/* База данных «Искра Онлайн» в браузере: схема с описаниями (для ERD и Data Dictionary), детерминированные данные
   и SQL-движок sql.js (SQLite, WebAssembly) с cdnjs. Данные — снимок на 10 февраля 2027, 12:00.
   В данные намеренно заложены «грязные» случаи для заданий на проверку качества данных — см. TR.db.ANOMALIES.
   API: TR.db.SCHEMA, ENUMS, NOW, ready(), run(sql), reset(), compare(sql, refSql, opts), resultHTML(res), schemaHTML(). */
'use strict';
(function () {
  const TR = window.TR, esc = TR.esc;
  const SQLJS = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/';

  // ---------- схема ----------
  // col: { n, type, ru, desc, pk, fk:'table.col', nul, uniq, def, enum:'table.col', pd (персональные данные) }
  const C = (n, type, ru, o) => Object.assign({ n, type, ru, nul: false }, o || {});
  const SCHEMA = [
    { name: 'station', ru: 'Станция', desc: 'Станция техобслуживания сети «Искра».', cols: [
      C('id', 'INTEGER', 'Идентификатор станции', { pk: true }),
      C('name', 'VARCHAR(60)', 'Название', { uniq: true, desc: 'Короткое название по району: «Победы», «Азино».' }),
      C('address', 'VARCHAR(200)', 'Адрес'),
      C('opens', 'CHAR(5)', 'Открытие', { def: "'08:00'", desc: 'Время открытия, ЧЧ:ММ.' }),
      C('closes', 'CHAR(5)', 'Закрытие', { def: "'21:00'" }),
      C('phone', 'VARCHAR(20)', 'Телефон станции')
    ] },
    { name: 'post', ru: 'Пост', desc: 'Рабочее место с подъёмником на станции. На одном посту одновременно обслуживается одна машина.', cols: [
      C('id', 'INTEGER', 'Идентификатор поста', { pk: true }),
      C('station_id', 'INTEGER', 'Станция', { fk: 'station.id' }),
      C('name', 'VARCHAR(30)', 'Название поста', { desc: '«Пост 3» — уникально в пределах станции.' }),
      C('type', 'VARCHAR(10)', 'Тип поста', { enum: 'post.type' })
    ] },
    { name: 'employee', ru: 'Сотрудник', desc: 'Сотрудник станции: мастер-приёмщик, механик, кладовщик, управляющий.', cols: [
      C('id', 'INTEGER', 'Идентификатор сотрудника', { pk: true }),
      C('station_id', 'INTEGER', 'Станция', { fk: 'station.id' }),
      C('full_name', 'VARCHAR(120)', 'ФИО', { pd: true }),
      C('role', 'VARCHAR(12)', 'Роль', { enum: 'employee.role' }),
      C('phone', 'VARCHAR(20)', 'Рабочий телефон', { nul: true, pd: true }),
      C('hired_at', 'DATE', 'Дата приёма')
    ] },
    { name: 'company', ru: 'Компания', desc: 'Корпоративный клиент по договору (таксопарк, служба доставки). Оплата по счёту раз в месяц.', cols: [
      C('id', 'INTEGER', 'Идентификатор компании', { pk: true }),
      C('name', 'VARCHAR(120)', 'Название'),
      C('inn', 'CHAR(10)', 'ИНН', { uniq: true }),
      C('contract_no', 'VARCHAR(30)', 'Номер договора'),
      C('auto_approve_limit', 'DECIMAL(10,2)', 'Лимит автосогласования, ₽', { def: '3000', desc: 'Доп. работы на сумму до лимита согласуются автоматически по договору.' })
    ] },
    { name: 'client', ru: 'Клиент', desc: 'Человек, который записывает машину на обслуживание. Корпоративный клиент — сотрудник компании (завгар).', cols: [
      C('id', 'INTEGER', 'Идентификатор клиента', { pk: true }),
      C('full_name', 'VARCHAR(120)', 'ФИО', { pd: true }),
      C('phone', 'VARCHAR(20)', 'Телефон', { uniq: true, pd: true, desc: 'Логин в приложении. Формат +7XXXXXXXXXX (при переносе из Excel встречаются 8XXXXXXXXXX).' }),
      C('email', 'VARCHAR(120)', 'Email', { nul: true, pd: true }),
      C('company_id', 'INTEGER', 'Компания', { fk: 'company.id', nul: true, desc: 'Заполнено у корпоративных клиентов.' }),
      C('no_show_count', 'INTEGER', 'Неявок подряд', { def: '0', desc: 'Сбрасывается в 0 при визите. При 2 и больше онлайн-запись — с предоплатой 500 ₽.' }),
      C('bonus_balance', 'INTEGER', 'Баланс баллов', { def: '0' }),
      C('created_at', 'DATETIME', 'Дата регистрации')
    ] },
    { name: 'car', ru: 'Автомобиль', desc: 'Автомобиль клиента.', cols: [
      C('id', 'INTEGER', 'Идентификатор автомобиля', { pk: true }),
      C('client_id', 'INTEGER', 'Владелец', { fk: 'client.id' }),
      C('plate', 'VARCHAR(12)', 'Госномер', { uniq: true, pd: true }),
      C('vin', 'CHAR(17)', 'VIN', { nul: true, uniq: true, pd: true }),
      C('brand', 'VARCHAR(40)', 'Марка'),
      C('model', 'VARCHAR(40)', 'Модель'),
      C('year', 'INTEGER', 'Год выпуска'),
      C('mileage', 'INTEGER', 'Пробег, км', { nul: true, desc: 'Последний известный пробег — со слов клиента или из заказ-наряда.' })
    ] },
    { name: 'service', ru: 'Услуга', desc: 'Каталог услуг с нормо-часами и базовой ценой («от»).', cols: [
      C('id', 'INTEGER', 'Идентификатор услуги', { pk: true }),
      C('code', 'VARCHAR(10)', 'Код услуги', { uniq: true }),
      C('name', 'VARCHAR(120)', 'Название'),
      C('category', 'VARCHAR(30)', 'Категория'),
      C('norm_hours', 'DECIMAL(4,1)', 'Нормо-часы', { desc: 'Длительность записи = сумма нормо-часов услуг, вверх до 30 минут.' }),
      C('price', 'DECIMAL(10,2)', 'Базовая цена, ₽', { desc: 'Цена «от»: итог — после приёмки и диагностики.' })
    ] },
    { name: 'booking', ru: 'Запись', desc: 'Запись клиента на обслуживание: станция, время, машина, выбранные услуги.', cols: [
      C('id', 'INTEGER', 'Идентификатор записи', { pk: true }),
      C('client_id', 'INTEGER', 'Клиент', { fk: 'client.id' }),
      C('car_id', 'INTEGER', 'Автомобиль', { fk: 'car.id' }),
      C('station_id', 'INTEGER', 'Станция', { fk: 'station.id' }),
      C('post_id', 'INTEGER', 'Пост', { fk: 'post.id', nul: true, desc: 'Назначает мастер-приёмщик; до этого пусто.' }),
      C('start_at', 'DATETIME', 'Начало'),
      C('end_at', 'DATETIME', 'Окончание'),
      C('status', 'VARCHAR(12)', 'Статус', { enum: 'booking.status', def: "'confirmed'" }),
      C('source', 'VARCHAR(8)', 'Канал записи', { enum: 'booking.source' }),
      C('created_at', 'DATETIME', 'Когда создана'),
      C('comment', 'VARCHAR(500)', 'Комментарий клиента', { nul: true })
    ] },
    { name: 'booking_service', ru: 'Услуга в записи', desc: 'Связь «многие ко многим»: какие услуги выбраны в записи.', cols: [
      C('booking_id', 'INTEGER', 'Запись', { pk: true, fk: 'booking.id' }),
      C('service_id', 'INTEGER', 'Услуга', { pk: true, fk: 'service.id' })
    ] },
    { name: 'work_order', ru: 'Заказ-наряд', desc: 'Документ на работы по машине: открывается при приёмке, закрывается при выдаче.', cols: [
      C('id', 'INTEGER', 'Идентификатор заказ-наряда', { pk: true }),
      C('number', 'VARCHAR(20)', 'Номер', { uniq: true, desc: 'Формат ЗН-<станция>-<порядковый>: ЗН-1-0457.' }),
      C('booking_id', 'INTEGER', 'Запись', { fk: 'booking.id', nul: true, uniq: true, desc: 'Пусто, если клиент приехал без записи.' }),
      C('car_id', 'INTEGER', 'Автомобиль', { fk: 'car.id' }),
      C('station_id', 'INTEGER', 'Станция', { fk: 'station.id' }),
      C('master_id', 'INTEGER', 'Мастер-приёмщик', { fk: 'employee.id' }),
      C('mechanic_id', 'INTEGER', 'Механик', { fk: 'employee.id', nul: true }),
      C('status', 'VARCHAR(16)', 'Статус', { enum: 'work_order.status', def: "'open'" }),
      C('opened_at', 'DATETIME', 'Открыт'),
      C('closed_at', 'DATETIME', 'Закрыт (машина выдана)', { nul: true }),
      C('mileage_in', 'INTEGER', 'Пробег при приёмке, км', { nul: true }),
      C('total', 'DECIMAL(10,2)', 'Итого, ₽', { nul: true, desc: 'Сумма согласованных строк. Считается при переводе в «Готов».' })
    ] },
    { name: 'work_item', ru: 'Строка заказ-наряда', desc: 'Работа или запчасть в заказ-наряде. Цена фиксируется на момент добавления.', cols: [
      C('id', 'INTEGER', 'Идентификатор строки', { pk: true }),
      C('work_order_id', 'INTEGER', 'Заказ-наряд', { fk: 'work_order.id' }),
      C('kind', 'VARCHAR(8)', 'Вид строки', { enum: 'work_item.kind' }),
      C('service_id', 'INTEGER', 'Услуга', { fk: 'service.id', nul: true, desc: 'Заполнено, если kind = service.' }),
      C('part_id', 'INTEGER', 'Запчасть', { fk: 'part.id', nul: true, desc: 'Заполнено, если kind = part.' }),
      C('qty', 'DECIMAL(8,2)', 'Количество', { def: '1' }),
      C('price', 'DECIMAL(10,2)', 'Цена за единицу, ₽', { desc: 'Копия цены на момент добавления: каталог может измениться.' }),
      C('extra_offer_id', 'INTEGER', 'Из предложения доп. работ', { fk: 'extra_offer.id', nul: true })
    ] },
    { name: 'part', ru: 'Запчасть', desc: 'Запчасть со склада. Остатки ведутся в 1С и синхронизируются каждые 15 минут.', cols: [
      C('id', 'INTEGER', 'Идентификатор запчасти', { pk: true }),
      C('sku', 'VARCHAR(20)', 'Артикул', { uniq: true }),
      C('name', 'VARCHAR(120)', 'Название'),
      C('price', 'DECIMAL(10,2)', 'Цена продажи, ₽'),
      C('stock_qty', 'INTEGER', 'Остаток на складе', { def: '0' })
    ] },
    { name: 'extra_offer', ru: 'Предложение доп. работ', desc: 'Найденная при ремонте проблема, которую клиент должен согласовать: без согласия платные доп. работы не выполняются.', cols: [
      C('id', 'INTEGER', 'Идентификатор предложения', { pk: true }),
      C('work_order_id', 'INTEGER', 'Заказ-наряд', { fk: 'work_order.id' }),
      C('description', 'VARCHAR(500)', 'Что нашли и что предлагаем'),
      C('amount', 'DECIMAL(10,2)', 'Сумма, ₽'),
      C('photo_url', 'VARCHAR(300)', 'Фото', { nul: true }),
      C('sent_at', 'DATETIME', 'Отправлено клиенту'),
      C('status', 'VARCHAR(10)', 'Статус', { enum: 'extra_offer.status', def: "'sent'" }),
      C('decided_at', 'DATETIME', 'Когда решено', { nul: true }),
      C('decided_by', 'VARCHAR(8)', 'Как решено', { enum: 'extra_offer.decided_by', nul: true })
    ] },
    { name: 'payment', ru: 'Платёж', desc: 'Оплата заказ-наряда. Онлайн — через ЮKassa, на станции — через кассу, корпоративные — по счёту.', cols: [
      C('id', 'INTEGER', 'Идентификатор платежа', { pk: true }),
      C('work_order_id', 'INTEGER', 'Заказ-наряд', { fk: 'work_order.id' }),
      C('amount', 'DECIMAL(10,2)', 'Сумма, ₽'),
      C('method', 'VARCHAR(8)', 'Способ оплаты', { enum: 'payment.method' }),
      C('status', 'VARCHAR(10)', 'Статус', { enum: 'payment.status' }),
      C('created_at', 'DATETIME', 'Создан'),
      C('paid_at', 'DATETIME', 'Оплачен', { nul: true }),
      C('provider_id', 'VARCHAR(40)', 'ID платежа у провайдера', { nul: true, uniq: true, desc: 'Идентификатор платежа в ЮKassa для сверки.' })
    ] },
    { name: 'bonus_tx', ru: 'Операция с баллами', desc: 'Начисление (+) и списание (−) бонусных баллов. 1 балл = 1 ₽.', cols: [
      C('id', 'INTEGER', 'Идентификатор операции', { pk: true }),
      C('client_id', 'INTEGER', 'Клиент', { fk: 'client.id' }),
      C('work_order_id', 'INTEGER', 'Заказ-наряд', { fk: 'work_order.id', nul: true }),
      C('amount', 'INTEGER', 'Баллы (+/−)'),
      C('reason', 'VARCHAR(12)', 'Причина', { enum: 'bonus_tx.reason' }),
      C('created_at', 'DATETIME', 'Когда')
    ] }
  ];
  const ENUMS = {
    'post.type': [['general', 'Универсальный'], ['tire', 'Шиномонтаж'], ['diag', 'Диагностика']],
    'employee.role': [['master', 'Мастер-приёмщик'], ['mechanic', 'Механик'], ['storekeeper', 'Кладовщик'], ['manager', 'Управляющий']],
    'booking.status': [['new', 'Ждёт предоплаты'], ['confirmed', 'Подтверждена'], ['arrived', 'Клиент приехал'], ['done', 'Завершена'], ['cancelled', 'Отменена'], ['no_show', 'Неявка']],
    'booking.source': [['app', 'Приложение'], ['site', 'Сайт'], ['phone', 'Телефон']],
    'work_order.status': [['open', 'Открыт'], ['in_progress', 'В работе'], ['waiting_approval', 'Ждёт согласования'], ['ready', 'Готов'], ['closed', 'Выдан'], ['cancelled', 'Отменён']],
    'work_item.kind': [['service', 'Работа'], ['part', 'Запчасть']],
    'extra_offer.status': [['sent', 'Отправлено'], ['approved', 'Согласовано'], ['rejected', 'Отклонено'], ['expired', 'Истекло']],
    'extra_offer.decided_by': [['client', 'Клиент в приложении'], ['phone', 'По телефону'], ['auto', 'Автоматически по договору']],
    'payment.method': [['card', 'Карта онлайн'], ['sbp', 'СБП'], ['cash', 'Касса станции'], ['invoice', 'Счёт компании']],
    'payment.status': [['pending', 'Ожидает'], ['paid', 'Оплачен'], ['failed', 'Ошибка'], ['refunded', 'Возвращён']],
    'bonus_tx.reason': [['accrual', 'Начисление'], ['redeem', 'Списание'], ['expire', 'Сгорание']]
  };
  const NOW = '2027-02-10 12:00';

  // ---------- DDL ----------
  const sqlType = t => t;
  function ddl() {
    return SCHEMA.map(t => {
      const pk = t.cols.filter(c => c.pk);
      const lines = t.cols.map(c => {
        let s = `  ${c.n} ${sqlType(c.type)}`;
        if (c.pk && pk.length === 1) s += ' PRIMARY KEY';
        if (!c.nul && !(c.pk && pk.length === 1)) s += ' NOT NULL';
        if (c.uniq && !c.pk) s += ' UNIQUE';
        if (c.def) s += ' DEFAULT ' + c.def;
        if (c.enum) s += ` CHECK (${c.n} IN (${ENUMS[c.enum].map(e => `'${e[0]}'`).join(', ')}))`;
        return s;
      });
      if (pk.length > 1) lines.push(`  PRIMARY KEY (${pk.map(c => c.n).join(', ')})`);
      t.cols.filter(c => c.fk).forEach(c => { const [ft, fc] = c.fk.split('.'); lines.push(`  FOREIGN KEY (${c.n}) REFERENCES ${ft}(${fc})`); });
      return `CREATE TABLE ${t.name} (\n${lines.join(',\n')}\n);`;
    }).join('\n\n');
  }

  // ---------- данные ----------
  // Генерация детерминирована (seed 'iskra-db'): у всех студентов одни и те же строки.
  function seed() {
    const R = TR.rand('iskra-db'), pick = a => a[Math.floor(R() * a.length)], int = (a, b) => a + Math.floor(R() * (b - a + 1));
    const T = {}; SCHEMA.forEach(t => { T[t.name] = []; });
    const pad = n => String(n).padStart(2, '0');
    const fmt = d => `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
    const at = (s) => new Date(s.replace(' ', 'T') + ':00Z');
    const addMin = (d, m) => new Date(d.getTime() + m * 60000);
    const now = at(NOW);

    const ST = [['Победы', 'пр. Победы, 78', 8], ['Ямашева', 'пр. Ямашева, 93', 6], ['Горки', 'ул. Рихарда Зорге, 66', 6], ['Азино', 'ул. Минская, 10', 5], ['Савиново', 'ул. Чистопольская, 61', 5], ['Танкодром', 'ул. Аделя Кутуя, 110', 4], ['Дербышки', 'ул. Мира, 24', 4]];
    ST.forEach((s, i) => T.station.push({ id: i + 1, name: s[0], address: 'Казань, ' + s[1], opens: '08:00', closes: '21:00', phone: '+7843200' + pad(11 + i) + '0' + i }));
    let pid = 0;
    ST.forEach((s, i) => { for (let k = 1; k <= s[2]; k++) T.post.push({ id: ++pid, station_id: i + 1, name: 'Пост ' + k, type: k === 1 ? 'diag' : k <= Math.ceil(s[2] / 3) + 1 ? 'tire' : 'general' }); });

    const FN = ['Алексей', 'Ринат', 'Дмитрий', 'Ильдар', 'Сергей', 'Артур', 'Максим', 'Руслан', 'Андрей', 'Марат', 'Игорь', 'Айдар', 'Павел', 'Тимофей', 'Камиль', 'Евгений', 'Нияз', 'Олег', 'Булат', 'Роман'];
    const LN = ['Иванов', 'Хабибуллин', 'Петров', 'Сафин', 'Кузнецов', 'Гарипов', 'Соколов', 'Валиев', 'Морозов', 'Шарипов', 'Волков', 'Закиров', 'Лебедев', 'Нуриев', 'Козлов', 'Галиев', 'Новиков', 'Мухаметов', 'Фёдоров', 'Ахметов'];
    const FW = ['Елена', 'Алсу', 'Ольга', 'Гульнара', 'Мария', 'Лейсан', 'Анна', 'Диляра', 'Татьяна', 'Резеда', 'Наталья', 'Айгуль', 'Ирина', 'Эльвира', 'Светлана'];
    const LW = ['Смирнова', 'Хайруллина', 'Иванова', 'Сабирова', 'Кузнецова', 'Гимадиева', 'Попова', 'Зарипова', 'Васильева', 'Каримова', 'Новикова', 'Фаизова', 'Морозова', 'Шакирова', 'Павлова'];
    const MID = ['Ринатович', 'Сергеевич', 'Ильдарович', 'Андреевич', 'Маратович', 'Викторович', 'Айратович', 'Олегович'];
    let eid = 0;
    const masters = {}, mechanics = {};
    ST.forEach((s, i) => {
      const sid = i + 1; masters[sid] = []; mechanics[sid] = [];
      const nm = sid === 1 ? 3 : 2;
      for (let k = 0; k < nm; k++) {
        const name = sid === 1 && k === 0 ? 'Кравец Марина Олеговна' : `${pick(LN)} ${pick(FN)} ${pick(MID)}`;
        T.employee.push({ id: ++eid, station_id: sid, full_name: name, role: 'master', phone: '+7917' + int(1000000, 9999999), hired_at: `20${int(12, 24)}-${pad(int(1, 12))}-${pad(int(1, 28))}` }); masters[sid].push(eid);
      }
      for (let k = 0; k < s[2]; k++) {
        const name = sid === 1 && k === 0 ? 'Ермолаев Сергей Петрович' : `${pick(LN)} ${pick(FN)} ${pick(MID)}`;
        T.employee.push({ id: ++eid, station_id: sid, full_name: name, role: 'mechanic', phone: R() < .3 ? null : '+7927' + int(1000000, 9999999), hired_at: `20${int(10, 25)}-${pad(int(1, 12))}-${pad(int(1, 28))}` }); mechanics[sid].push(eid);
      }
    });
    T.employee.push({ id: ++eid, station_id: 1, full_name: 'Садыкова Алия Ринатовна', role: 'storekeeper', phone: '+79179876543', hired_at: '2019-03-11' });
    T.employee.push({ id: ++eid, station_id: 1, full_name: 'Гарипов Тимур Рашидович', role: 'manager', phone: '+79170000001', hired_at: '2009-05-15' });

    T.company.push({ id: 1, name: 'ООО «Таксопарк Шашка»', inn: '1655123456', contract_no: 'КД-2025/014', auto_approve_limit: 3000 });
    T.company.push({ id: 2, name: 'ООО «ТрансЛогистик»', inn: '1660987654', contract_no: 'КД-2026/003', auto_approve_limit: 5000 });

    const CARS = [['Kia', 'Rio'], ['Hyundai', 'Solaris'], ['Lada', 'Vesta'], ['Lada', 'Granta'], ['Volkswagen', 'Polo'], ['Skoda', 'Rapid'], ['Toyota', 'Camry'], ['Renault', 'Logan'], ['Kia', 'Sportage'], ['Haval', 'Jolion'], ['Chery', 'Tiggo 7 Pro'], ['Geely', 'Coolray'], ['Toyota', 'RAV4'], ['Hyundai', 'Creta']];
    const LET = 'АВЕКМНОРСТУХ';
    const plate = () => `${pick(LET)}${int(100, 999)}${pick(LET)}${pick(LET)}116`;
    const usedPlates = new Set(), usedPhones = new Set();
    const phone = () => { let p; do { p = '+79' + pick(['17', '27', '37', '50', '87', '96']) + int(1000000, 9999999); } while (usedPhones.has(p)); usedPhones.add(p); return p; };
    let cid = 0, carId = 0;
    const addCar = (clientId, mk) => { let p; do { p = plate(); } while (usedPlates.has(p)); usedPlates.add(p); const m = mk || pick(CARS), y = int(2008, 2025); T.car.push({ id: ++carId, client_id: clientId, plate: p, vin: R() < .2 ? null : 'X' + Array.from({ length: 16 }, () => pick('ABCDEFGHJKLMNPRSTUVWXYZ0123456789'.split(''))).join(''), brand: m[0], model: m[1], year: y, mileage: R() < .1 ? null : int(8, 30) * 1000 * Math.max(1, 2026 - y) / 3 | 0 }); return carId; };
    for (let i = 0; i < 64; i++) {
      const w = R() < .4;
      const name = i === 6 ? 'Смирнова Елена Андреевна' : w ? `${pick(LW)} ${pick(FW)} ${pick(MID).replace(/ич$/, 'на')}` : `${pick(LN)} ${pick(FN)} ${pick(MID)}`;
      const c = { id: ++cid, full_name: name, phone: phone(), email: R() < .45 ? null : `user${cid}@mail.ru`, company_id: null, no_show_count: 0, bonus_balance: 0, created_at: fmt(addMin(at('2026-12-01 09:00'), int(0, 60 * 24 * 60))) };
      if (i === 6) Object.assign(c, { phone: '+79172345678', email: 'elena.smirnova@mail.ru', created_at: '2026-12-03 19:42' });
      T.client.push(c);
      addCar(c.id, i === 6 ? ['Kia', 'Rio'] : null);
      if (R() < .12) addCar(c.id);
    }
    T.car.find(c => c.client_id === 7).year = 2019;
    // корпоративные: завгары таксопарка и логистики — машины компании записаны на них
    const rustam = { id: ++cid, full_name: 'Галимов Рустам Ильдарович', phone: '+79270001122', email: 'zavgar@shashka-taxi.ru', company_id: 1, no_show_count: 0, bonus_balance: 0, created_at: '2026-12-10 10:00' };
    const trans = { id: ++cid, full_name: 'Белов Игорь Викторович', phone: '+79370004455', email: 'fleet@translogistic.ru', company_id: 2, no_show_count: 0, bonus_balance: 0, created_at: '2027-01-12 14:30' };
    T.client.push(rustam, trans);
    for (let k = 0; k < 10; k++) addCar(rustam.id, pick([['Hyundai', 'Solaris'], ['Kia', 'Rio'], ['Lada', 'Vesta']]));
    for (let k = 0; k < 4; k++) addCar(trans.id, ['Lada', 'Largus']);
    // аномалия: дубли клиентов из Excel — тот же человек с телефоном в формате 8XXXXXXXXXX
    const dup1 = { id: ++cid, full_name: 'Смирнова Елена', phone: '89172345678', email: null, company_id: null, no_show_count: 0, bonus_balance: 0, created_at: '2026-12-01 09:00' };
    const src2 = T.client[20];
    const dup2 = { id: ++cid, full_name: src2.full_name, phone: '8' + src2.phone.slice(2), email: null, company_id: null, no_show_count: 0, bonus_balance: 0, created_at: '2026-12-01 09:00' };
    T.client.push(dup1, dup2);
    addCar(dup2.id);

    const SV = [['TO-1', 'ТО-1: замена масла и масляного фильтра', 'ТО', 1.0, 2500], ['BRK-1', 'Замена тормозных колодок (ось)', 'Тормоза', 1.0, 1800], ['TIR-1', 'Шиномонтаж комплекс, 4 колеса', 'Шины', 1.0, 2400], ['TIR-2', 'Балансировка, 4 колеса', 'Шины', 0.5, 1200], ['DGN-1', 'Диагностика ходовой части', 'Диагностика', 0.5, 900], ['DGN-2', 'Компьютерная диагностика', 'Диагностика', 0.5, 1200], ['ENG-1', 'Замена ремня ГРМ', 'Двигатель', 3.0, 7500], ['AC-1', 'Заправка кондиционера', 'Кондиционер', 1.0, 2900], ['SUS-1', 'Развал-схождение', 'Ходовая', 1.0, 2200], ['ENG-2', 'Замена свечей зажигания', 'Двигатель', 0.5, 1200], ['SUS-2', 'Замена амортизатора, 1 шт.', 'Ходовая', 1.0, 2100], ['EL-1', 'Замена аккумулятора', 'Электрика', 0.5, 600], ['ENG-3', 'Промывка инжектора', 'Двигатель', 1.5, 3200], ['TO-2', 'Замена масла в АКПП', 'ТО', 1.5, 4500], ['BODY-1', 'Антикоррозийная обработка', 'Кузов', 3.0, 9000]];
    SV.forEach((s, i) => T.service.push({ id: i + 1, code: s[0], name: s[1], category: s[2], norm_hours: s[3], price: s[4] }));
    const PT = [['OIL-5W30-4', 'Масло моторное 5W-30, 4 л', 3900, 42], ['FLT-OIL', 'Фильтр масляный', 650, 60], ['FLT-AIR', 'Фильтр воздушный', 890, 25], ['FLT-CAB', 'Фильтр салонный', 790, 18], ['BRK-PAD-F', 'Колодки тормозные передние', 2900, 14], ['BRK-DSC-F', 'Диски тормозные передние, пара', 6800, 4], ['SPK-4', 'Свечи зажигания, 4 шт.', 1900, 20], ['TB-KIT', 'Комплект ремня ГРМ', 8400, 3], ['BAT-60', 'Аккумулятор 60 Ач', 7900, 6], ['SHK-F', 'Амортизатор передний', 4600, 0], ['AF-5', 'Антифриз G12, 5 л', 1500, 30], ['R134A', 'Фреон R134a, 0,5 кг', 1200, 15], ['LMP-H7', 'Лампа H7', 450, 50], ['WPR', 'Щётки стеклоочистителя, пара', 1100, 22], ['DOT4', 'Тормозная жидкость DOT4, 1 л', 600, 16], ['ATF-4', 'Масло АКПП ATF, 4 л', 4800, 9], ['HUB-B', 'Подшипник ступицы', 2700, 0], ['BALL-J', 'Шаровая опора', 1800, 7], ['TIE-E', 'Рулевой наконечник', 1300, 8], ['STB-L', 'Стойка стабилизатора', 950, 12]];
    PT.forEach((p, i) => T.part.push({ id: i + 1, sku: p[0], name: p[1], price: p[2], stock_qty: p[3] }));
    const SVC_PARTS = { 1: [1, 2], 2: [5], 7: [8], 8: [12], 10: [7], 11: [10], 12: [9], 14: [16] };

    // записи с 11 января по 21 февраля 2027
    let bid = 0, woid = 0, wiid = 0, eoid = 0, payid = 0, btid = 0;
    const woNo = {};
    const clients = T.client.filter(c => c !== dup1);
    const carsOf = id => T.car.filter(c => c.client_id === id);
    const day0 = at('2027-01-11 00:00');
    for (let d = 0; d < 42; d++) {
      const day = addMin(day0, d * 1440);
      const n = d === 30 ? 11 : int(2, 5);   // 10 февраля — «сегодня»: машины на постах во всех статусах
      for (let k = 0; k < n; k++) {
        const c = R() < .14 ? pick([rustam, trans]) : pick(clients);
        const cars = carsOf(c.id); if (!cars.length) continue;
        const car = pick(cars), sid = int(1, 7);
        const svc = [pick(T.service)]; if (R() < .35) { const s2 = pick(T.service); if (s2 !== svc[0]) svc.push(s2); }
        const hours = svc.reduce((s, x) => s + x.norm_hours, 0), dur = Math.ceil(hours * 2) * 30;
        const start = addMin(day, (8 * 60) + int(0, 22) * 30), end = addMin(start, dur);
        if (end.getUTCHours() * 60 + end.getUTCMinutes() > 21 * 60) continue;
        const past = end < now, today = fmt(start).slice(0, 10) === NOW.slice(0, 10);
        let status;
        if (today) status = start <= now ? 'arrived' : 'confirmed';
        else if (past) { const r = R(); status = r < .12 ? 'no_show' : r < .22 ? 'cancelled' : 'done'; }
        else status = c.no_show_count >= 2 || R() < .06 ? 'new' : 'confirmed';
        if (c.company_id && status === 'new') status = 'confirmed';
        const created = addMin(start, -int(3 * 60, 9 * 1440));
        const posts = T.post.filter(p => p.station_id === sid);
        const b = { id: ++bid, client_id: c.id, car_id: car.id, station_id: sid, post_id: status === 'new' || (status === 'confirmed' && !today) || status === 'cancelled' ? null : pick(posts).id, start_at: fmt(start), end_at: fmt(end), status, source: c.company_id ? 'phone' : pick(['app', 'app', 'app', 'site', 'phone', 'phone']), created_at: fmt(created < day0 ? addMin(day0, -int(60, 2000)) : created), comment: R() < .2 ? pick(['Стучит спереди справа', 'Горит Check Engine', 'Скрипят тормоза', 'Нужна справка для страховой', 'Привезу свои колёса', 'Перезвоните перед началом', 'Тянет влево']) : null };
        if (status === 'no_show') c.no_show_count = Math.min(3, c.no_show_count + 1); else if (status === 'done') c.no_show_count = 0;
        T.booking.push(b);
        svc.forEach(s => T.booking_service.push({ booking_id: b.id, service_id: s.id }));
        if (status !== 'done' && status !== 'arrived') continue;
        // заказ-наряд
        woNo[sid] = (woNo[sid] || 400) + int(1, 9);
        const opened = addMin(start, int(-10, 15)), corp = !!c.company_id;
        let wst = 'closed', closed = null;
        if (status === 'arrived') wst = pick(['open', 'in_progress', 'in_progress', 'waiting_approval', 'ready']);
        const wo = { id: ++woid, number: `ЗН-${sid}-${String(woNo[sid]).padStart(4, '0')}`, booking_id: b.id, car_id: car.id, station_id: sid, master_id: pick(masters[sid]), mechanic_id: wst === 'open' ? null : pick(mechanics[sid]), status: wst, opened_at: fmt(opened), closed_at: null, mileage_in: car.mileage ? car.mileage + int(0, 900) : null, total: null };
        T.work_order.push(wo);
        let sum = 0, works = 0;
        svc.forEach(s => {
          const price = s.price + (R() < .25 ? int(1, 6) * 100 : 0);
          T.work_item.push({ id: ++wiid, work_order_id: wo.id, kind: 'service', service_id: s.id, part_id: null, qty: 1, price, extra_offer_id: null }); sum += price; works += price;
          (SVC_PARTS[s.id] || []).forEach(p => { const pp = T.part[p - 1]; T.work_item.push({ id: ++wiid, work_order_id: wo.id, kind: 'part', service_id: null, part_id: pp.id, qty: 1, price: pp.price, extra_offer_id: null }); sum += pp.price; });
        });
        // доп. работы
        if (R() < .3 || wst === 'waiting_approval') {
          const amt = pick([1200, 1800, 2400, 2900, 3600, 4800, 6200]);
          const sent = addMin(opened, int(30, 120));
          let est, by = null, dec = null;
          if (wst === 'waiting_approval') est = 'sent';
          else if (corp && amt <= T.company[c.company_id - 1].auto_approve_limit) { est = 'approved'; by = 'auto'; dec = sent; }
          else { const r = R(); est = r < .62 ? 'approved' : r < .85 ? 'rejected' : 'expired'; by = est === 'expired' ? null : R() < .7 ? 'client' : 'phone'; dec = est === 'expired' ? null : addMin(sent, by === 'client' ? int(2, 55) : int(20, 95)); }
          const eo = { id: ++eoid, work_order_id: wo.id, description: pick(['Изношены передние колодки, остаток 2 мм', 'Течь амортизатора переднего правого', 'Люфт рулевого наконечника слева', 'Трещина пыльника ШРУСа', 'Аккумулятор не держит заряд', 'Сильный износ щёток стеклоочистителя', 'Стойка стабилизатора стучит']), amount: amt, photo_url: R() < .85 ? `https://files.iskra-auto.ru/photo/${wo.number}-${eoid + 1}.jpg` : null, sent_at: fmt(sent), status: est, decided_at: dec ? fmt(dec) : null, decided_by: by };
          T.extra_offer.push(eo);
          if (est === 'approved') { T.work_item.push({ id: ++wiid, work_order_id: wo.id, kind: 'service', service_id: pick(T.service).id, part_id: null, qty: 1, price: amt, extra_offer_id: eo.id }); sum += amt; works += amt; }
        }
        if (wst === 'closed' || wst === 'ready') wo.total = sum;
        if (wst !== 'closed') continue;
        closed = addMin(opened, int(60, 300)); wo.closed_at = fmt(closed);
        // оплата
        if (corp) { T.payment.push({ id: ++payid, work_order_id: wo.id, amount: sum, method: 'invoice', status: R() < .5 ? 'paid' : 'pending', created_at: fmt(closed), paid_at: null, provider_id: null }); const pp = T.payment[T.payment.length - 1]; if (pp.status === 'paid') pp.paid_at = fmt(addMin(closed, int(1, 20) * 1440)); continue; }
        const m = pick(['card', 'card', 'sbp', 'cash']);
        if (m !== 'cash' && R() < .12) T.payment.push({ id: ++payid, work_order_id: wo.id, amount: sum, method: m, status: 'failed', created_at: fmt(addMin(closed, -15)), paid_at: null, provider_id: `2f${(payid * 7919).toString(16)}-yk` });
        T.payment.push({ id: ++payid, work_order_id: wo.id, amount: sum, method: m, status: 'paid', created_at: fmt(addMin(closed, -10)), paid_at: fmt(addMin(closed, -8)), provider_id: m === 'cash' ? null : `2f${(payid * 7919).toString(16)}-yk` });
        const acc = Math.round(works * 0.05);
        T.bonus_tx.push({ id: ++btid, client_id: c.id, work_order_id: wo.id, amount: acc, reason: 'accrual', created_at: fmt(addMin(closed, 1)) }); c.bonus_balance += acc;
        if (c.bonus_balance > 900 && R() < .3) { const red = Math.min(c.bonus_balance, Math.round(works * 0.3)); T.bonus_tx.push({ id: ++btid, client_id: c.id, work_order_id: wo.id, amount: -red, reason: 'redeem', created_at: fmt(addMin(closed, -9)) }); c.bonus_balance -= red; }
      }
    }
    // аномалия: запись «Завершена», а заказ-наряда нет (мастер принял машину «по старинке», в 1С)
    T.booking.filter(b => b.status === 'cancelled').slice(0, 2).forEach(b => { b.status = 'done'; b.post_id = b.post_id || T.post.find(p => p.station_id === b.station_id).id; });
    // аномалия: заказ-наряд выдан, но оплаты нет (клиент «заплатит потом»)
    const debt = T.work_order.filter(w => w.status === 'closed' && T.payment.some(p => p.work_order_id === w.id && p.method === 'cash')).slice(-1)[0];
    if (debt) T.payment = T.payment.filter(p => p.work_order_id !== debt.id);
    // аномалия: запись по телефону с окончанием раньше начала (оператор перепутал время)
    const bad = T.booking.find(b => b.source === 'phone' && b.status === 'confirmed');
    if (bad) { const s = at(bad.start_at); bad.end_at = fmt(addMin(s, -60)); }
    // клиент без визитов: зарегистрировался в приложении и не записался
    T.client.push({ id: ++cid, full_name: 'Фаизова Айгуль Маратовна', phone: '+79500007788', email: 'aigul.f@yandex.ru', company_id: null, no_show_count: 0, bonus_balance: 0, created_at: '2027-02-09 21:15' });
    return { T, debt: debt ? debt.number : null, badBooking: bad ? bad.id : null };
  }

  const q = v => v == null ? 'NULL' : typeof v === 'number' ? String(v) : `'${String(v).replace(/'/g, "''")}'`;
  function inserts(T) {
    return SCHEMA.map(t => T[t.name].length ? T[t.name].map(r => `INSERT INTO ${t.name} (${t.cols.map(c => c.n).join(', ')}) VALUES (${t.cols.map(c => q(r[c.n])).join(', ')});`).join('\n') : '').join('\n');
  }

  // ---------- движок ----------
  let SQL = null, bytes = null, sandbox = null, loadP = null, meta = null;
  function loadScript(src) {
    return new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = () => rej(new Error('Не удалось загрузить ' + src)); document.head.appendChild(s); });
  }
  function ready() {
    if (!loadP) loadP = (async () => {
      if (!window.initSqlJs) await loadScript(SQLJS + 'sql-wasm.js');
      SQL = await window.initSqlJs({ locateFile: f => SQLJS + f });
      const db = new SQL.Database();
      const s = seed(); meta = s;
      // при заливке внешние ключи выключены (таблицы ссылаются друг на друга в произвольном порядке), в копиях — включены
      db.run(ddl());
      db.run('BEGIN;' + inserts(s.T) + 'COMMIT;');
      bytes = db.export(); db.close();
      sandbox = fresh();
      return true;
    })().catch(e => { loadP = null; throw e; });
    return loadP;
  }
  const fresh = () => { const d = new SQL.Database(bytes); d.run('PRAGMA foreign_keys = ON;'); return d; };
  const LIMIT = 500;
  function execOn(db, sql) {
    const t0 = performance.now();
    try {
      const out = db.exec(String(sql || ''));
      const last = out[out.length - 1];
      const changes = db.getRowsModified();
      return { ok: true, columns: last ? last.columns : [], rows: last ? last.values.slice(0, LIMIT) : [], total: last ? last.values.length : 0, changes, ms: Math.round(performance.now() - t0) };
    } catch (e) { return { ok: false, error: ruErr(e.message), raw: e.message, columns: [], rows: [], ms: Math.round(performance.now() - t0) }; }
  }
  function ruErr(m) {
    const s = String(m || '');
    let x;
    if ((x = s.match(/no such table: (\S+)/))) return `Нет такой таблицы: ${x[1]}. Посмотрите список таблиц в схеме.`;
    if ((x = s.match(/no such column: (\S+)/))) return `Нет такого столбца: ${x[1]}. Проверьте имя и таблицу (алиас).`;
    if ((x = s.match(/ambiguous column name: (\S+)/))) return `Столбец ${x[1]} есть в нескольких таблицах — укажите таблицу: имя_таблицы.${x[1]}.`;
    if (/syntax error/.test(s)) return 'Синтаксическая ошибка: ' + s.replace(/^.*?:\s*/, '') + '. Проверьте запятые, кавычки и порядок частей: SELECT … FROM … WHERE … GROUP BY … HAVING … ORDER BY … LIMIT.';
    if (/incomplete input/.test(s)) return 'Запрос оборван: не хватает закрывающей скобки или кавычки.';
    if (/FOREIGN KEY constraint failed/.test(s)) return 'Нарушен внешний ключ: ссылка на строку, которой нет (или удаление строки, на которую ссылаются).';
    if (/UNIQUE constraint failed: (\S+)/.test(s)) return 'Нарушена уникальность: ' + s.match(/UNIQUE constraint failed: (\S+)/)[1] + ' — такое значение уже есть.';
    if (/NOT NULL constraint failed: (\S+)/.test(s)) return 'Поле обязательно (NOT NULL): ' + s.match(/NOT NULL constraint failed: (\S+)/)[1] + '.';
    if (/CHECK constraint failed/.test(s)) return 'Нарушено ограничение CHECK: значение не из списка допустимых.';
    if (/misuse of aggregate/.test(s)) return 'Агрегат (COUNT, SUM…) нельзя использовать в WHERE — для условий на группы есть HAVING.';
    return s;
  }
  async function run(sql) { await ready(); return execOn(sandbox, sql); }
  async function reset() { await ready(); try { sandbox.close(); } catch (e) { } sandbox = fresh(); }
  // Сравнение результата студента с эталоном: каждый запрос — на свежей копии базы. Имена столбцов не важны,
  // важны число столбцов и строки (по умолчанию как множество; ordered:true — с учётом порядка).
  const normV = v => v == null ? null : typeof v === 'number' ? Math.round(v * 100) / 100 : /^-?\d+(\.\d+)?$/.test(String(v).trim()) ? Math.round(parseFloat(v) * 100) / 100 : String(v).trim();
  const key = row => JSON.stringify(row.map(normV));
  async function compare(sql, refSql, opts) {
    await ready();
    const o = opts || {};
    const d1 = fresh(), d2 = fresh();
    const mine = execOn(d1, sql), ref = execOn(d2, refSql);
    d1.close(); d2.close();
    if (!mine.ok) return { ok: false, mine, ref, why: mine.error };
    if (!ref.ok) return { ok: false, mine, ref, why: 'Ошибка в эталоне: ' + ref.error };
    const mc = mine.columns.length, rc = ref.columns.length;
    if (mc !== rc) return { ok: false, mine, ref, why: `Столбцов ${mc}, а нужно ${rc}${o.cols ? ': ' + o.cols : ''}.` };
    if (mine.total !== ref.total) return { ok: false, mine, ref, why: `Строк ${mine.total}, а должно быть ${ref.total}.` };
    if (o.ordered) {
      for (let i = 0; i < ref.rows.length; i++) if (key(mine.rows[i]) !== key(ref.rows[i])) return { ok: false, mine, ref, why: `Строки те же по числу, но порядок или значения расходятся начиная со строки ${i + 1}.` };
    } else {
      const cnt = new Map(); ref.rows.forEach(r => { const k = key(r); cnt.set(k, (cnt.get(k) || 0) + 1); });
      let miss = 0; mine.rows.forEach(r => { const k = key(r); if (cnt.get(k)) cnt.set(k, cnt.get(k) - 1); else miss++; });
      if (miss) return { ok: false, mine, ref, why: `Число строк совпало, но ${miss} ${TR.plural(miss, 'строка отличается', 'строки отличаются', 'строк отличаются')} от эталона.` };
    }
    return { ok: true, mine, ref, why: '' };
  }

  // ---------- отрисовка ----------
  function resultHTML(res, opts) {
    const o = opts || {};
    if (!res) return '';
    if (!res.ok) return `<div class="note bad"><div class="ttl">Ошибка</div><div>${esc(res.error)}</div></div>`;
    if (!res.columns.length) return `<div class="note ok"><div>Выполнено${res.changes ? ` · изменено строк: ${res.changes}` : ''} · ${res.ms} мс</div></div>`;
    const max = o.max || 50;
    return `<div class="sqlres"><div class="small dim">${res.total} ${TR.plural(res.total, 'строка', 'строки', 'строк')} · ${res.ms} мс${res.total > max ? ` · показаны первые ${max}` : ''}</div>
      <div class="sqlwrap"><table class="sqltbl mono"><thead><tr>${res.columns.map(c => `<th>${esc(c)}</th>`).join('')}</tr></thead>
      <tbody>${res.rows.slice(0, max).map(r => `<tr>${r.map(v => v == null ? '<td class="null">NULL</td>' : `<td>${esc(v)}</td>`).join('')}</tr>`).join('')}</tbody></table></div></div>`;
  }
  function schemaHTML(names) {
    const list = names ? SCHEMA.filter(t => names.includes(t.name)) : SCHEMA;
    return `<div class="schema-list">${list.map(t => `<details class="more"><summary><code>${esc(t.name)}</code> — ${esc(t.ru)}</summary><div><p class="small muted">${esc(t.desc)}</p>
      <div class="sqlwrap"><table class="sqltbl"><thead><tr><th>Поле</th><th>Тип</th><th>Ключ</th><th>Описание</th></tr></thead><tbody>${t.cols.map(c => `<tr><td class="mono">${esc(c.n)}${c.nul ? '<span class="dim">?</span>' : ''}</td><td class="mono small">${esc(c.type)}</td><td class="mono small">${c.pk ? 'PK ' : ''}${c.fk ? 'FK→' + esc(c.fk) : ''}${c.uniq && !c.pk ? 'UQ' : ''}</td><td class="small">${esc(c.ru)}${c.enum ? `<div class="dim">${ENUMS[c.enum].map(e => `${e[0]} — ${e[1]}`).join('; ')}</div>` : ''}${c.desc ? `<div class="dim">${esc(c.desc)}</div>` : ''}</td></tr>`).join('')}</tbody></table></div></div></details>`).join('')}</div>`;
  }
  if (!document.getElementById('db-css')) document.head.insertAdjacentHTML('beforeend', `<style id="db-css">
    .sqlres { display: grid; gap: 6px; min-width: 0; }
    .sqlwrap { overflow: auto; max-height: 420px; border: 1px solid var(--border); border-radius: 10px; }
    .sqltbl { border-collapse: collapse; width: 100%; font-size: 13px; }
    .sqltbl.mono { font-family: var(--f-mono); font-size: 12.5px; }
    .sqltbl th, .sqltbl td { padding: 6px 10px; border-bottom: 1px solid var(--border); text-align: left; vertical-align: top; white-space: nowrap; }
    .sqltbl td.small, .sqltbl td:last-child { white-space: normal; }
    .sqltbl th { position: sticky; top: 0; background: var(--surface-3); font-weight: 600; color: var(--text); z-index: 1; }
    .sqltbl tbody tr:nth-child(even) td { background: color-mix(in srgb, var(--surface-2) 60%, transparent); }
    .sqltbl td.null { color: var(--text-muted); font-style: italic; }
    .schema-list { display: grid; gap: 6px; }
  </style>`);

  TR.db = {
    SCHEMA, ENUMS, NOW, SQLJS,
    ddl, ready, run, reset, compare, resultHTML, schemaHTML,
    table: name => SCHEMA.find(t => t.name === name) || null,
    enumRu: (k, v) => { const e = (ENUMS[k] || []).find(x => x[0] === v); return e ? e[1] : v; },
    // что заложено в данные специально — для заданий «найдите проблему в данных»
    get ANOMALIES() { return { duplicatePhones: 'клиенты с телефоном 8XXXXXXXXXX дублируют клиентов с +7XXXXXXXXXX', doneWithoutWorkOrder: 'записи done без заказ-наряда', closedWithoutPayment: meta && meta.debt, badBooking: meta && meta.badBooking, clientWithoutVisits: 'клиент зарегистрирован, но без записей' }; },
    get loaded() { return !!bytes; }
  };
})();
