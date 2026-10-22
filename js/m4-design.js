/* Модуль 4, занятие 3: проектирование данных для задачи.
   Теория: how-nouns — от требований к данным (существительные → сущности и атрибуты, глаголы → связи, события,
   статусы; разметка Use Case «Согласование доп. работ» и бытовой пример «книга другу»), CRUD-матрица на сценарии
   записи на ТО; how-money — деньги (FLOAT / DECIMAL / копейки, живые вычисления), время и часовые пояса, цена на момент
   заказа (живой запрос к базе), осознанная денормализация (total, bonus_balance, no_show_count) со сверочными запросами;
   how-state — статус как поле и история переходов (симулятор заказ-наряда), удаление: физическое / мягкое /
   обезличивание при BR-15 и BR-16, журнал аудита.
   Практика: раскладка фраз Use Case по видам элементов модели; CRUD-матрица «роли × таблицы» для согласования;
   лаборатория «каталог подорожал — что стало со старыми заказ-нарядами» (варианты хранения цены и удаления каталога →
   последствия → выбор); конструктор таблицы extra_offer + история статусов; объяснение Глебу и Ольге Викторовне. */
'use strict';
(function () {
  const TR = window.TR, ui = TR.ui, esc = TR.esc;
  const ID = 'm4-design';

  if (!document.getElementById('mdsg-css')) document.head.insertAdjacentHTML('beforeend', `<style id="mdsg-css">
    .mdsg-root, .mdsg-root .stack > *, .mdsg-root .card > * { min-width: 0; }
    .mdsg-root .seg button { white-space: normal; }
    .mdsg-uc { border: 1px solid var(--border-strong); border-radius: 12px; background: var(--surface); padding: 12px 14px; font-size: 15px; line-height: 1.95; }
    .mdsg-uc .hd { font: 600 11px/1.4 var(--f-mono); color: var(--text-muted); text-transform: uppercase; letter-spacing: .05em; margin-bottom: 4px; }
    .mdsg-tk { display: inline; border: 0; border-bottom: 2px solid var(--border-strong); background: none; color: var(--text); padding: 0 2px; font: inherit; line-height: 1.5; border-radius: 4px 4px 0 0; cursor: pointer; }
    .mdsg-tk.k-ent { border-color: var(--accent); }
    .mdsg-tk.k-attr { border-color: var(--info); }
    .mdsg-tk.k-rel { border-color: var(--warn); }
    .mdsg-tk.k-ev { border-color: var(--ok); }
    .mdsg-tk.k-no { border-color: var(--text-muted); border-bottom-style: dashed; }
    .mdsg-tk.lit.k-ent { background: color-mix(in srgb, var(--accent) 16%, transparent); }
    .mdsg-tk.lit.k-attr { background: color-mix(in srgb, var(--info) 16%, transparent); }
    .mdsg-tk.lit.k-rel { background: color-mix(in srgb, var(--warn) 18%, transparent); }
    .mdsg-tk.lit.k-ev { background: color-mix(in srgb, var(--ok) 16%, transparent); }
    .mdsg-tk.lit.k-no { background: var(--surface-3); }
    .mdsg-tk.dim { opacity: .45; border-bottom-color: transparent; }
    .mdsg-tk[aria-pressed="true"] { outline: 2px solid var(--accent); outline-offset: 1px; }
    .mdsg-leg { display: flex; flex-wrap: wrap; gap: 6px 14px; font-size: 12.5px; color: var(--text-2); }
    .mdsg-leg i { display: inline-block; width: 18px; height: 0; border-bottom: 3px solid; vertical-align: middle; margin-right: 5px; }
    .mdsg-def { display: grid; grid-template-columns: 130px minmax(0, 1fr); gap: 5px 12px; font-size: 14px; }
    .mdsg-def > .k { font: 600 11px/1.6 var(--f-mono); letter-spacing: .05em; text-transform: uppercase; color: var(--text-muted); }
    .mdsg-wrap { overflow-x: auto; border: 1px solid var(--border); border-radius: 12px; background: var(--surface); }
    .mdsg-mx { border-collapse: collapse; width: 100%; min-width: 560px; font-size: 13px; }
    .mdsg-mx th, .mdsg-mx td { border-bottom: 1px solid var(--border); padding: 6px 8px; text-align: center; vertical-align: middle; }
    .mdsg-mx th { font: 600 11px/1.3 var(--f-mono); color: var(--text-muted); letter-spacing: .02em; }
    .mdsg-mx td.t { text-align: left; font-size: 13px; }
    .mdsg-mx td.t code { font-size: 12px; }
    .mdsg-mx td.ok { background: color-mix(in srgb, var(--ok) 14%, transparent); }
    .mdsg-mx td.bad { background: color-mix(in srgb, var(--bad) 14%, transparent); }
    .mdsg-mx td.hit { background: var(--accent-soft); }
    .mdsg-ops { display: inline-flex; gap: 3px; }
    .mdsg-op { width: 26px; height: 26px; border: 1px solid var(--border-strong); border-radius: 6px; background: var(--surface-2); color: var(--text-muted); font: 700 12px/1 var(--f-mono); padding: 0; }
    .mdsg-op[aria-pressed="true"] { background: var(--accent); border-color: var(--accent); color: var(--accent-text); }
    .mdsg-op:disabled { cursor: default; }
    .mdsg-let { font: 700 12.5px/1 var(--f-mono); letter-spacing: .08em; color: var(--accent); }
    .mdsg-2 { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.25fr); gap: 12px; }
    .mdsg-2 > * { min-width: 0; }
    .mdsg-evs { display: grid; gap: 6px; }
    .mdsg-ev { text-align: left; border: 1px solid var(--border-strong); border-radius: 10px; padding: 7px 10px; background: var(--surface-2); color: var(--text); font-size: 13.5px; line-height: 1.35; width: 100%; }
    .mdsg-ev[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); box-shadow: 0 0 0 1px var(--accent) inset; }
    .mdsg-ev .n { font: 600 11px/1 var(--f-mono); color: var(--text-muted); margin-right: 6px; }
    .mdsg-doc { border: 1px solid var(--border-strong); border-radius: 12px; overflow: hidden; background: var(--surface); }
    .mdsg-doc .hd { padding: 8px 12px; background: var(--surface-2); border-bottom: 1px solid var(--border); font-size: 13px; color: var(--text-2); }
    .mdsg-doc table { border-collapse: collapse; width: 100%; font-size: 13px; }
    .mdsg-doc td { padding: 5px 10px; border-bottom: 1px solid var(--border); vertical-align: top; }
    .mdsg-doc td.num { text-align: right; font-family: var(--f-mono); white-space: nowrap; }
    .mdsg-doc tr.chg td.num { color: var(--bad); font-weight: 700; }
    .mdsg-doc tr.blk td { background: color-mix(in srgb, var(--warn) 16%, transparent); }
    .mdsg-doc tr.tot td { font-weight: 700; border-bottom: 0; }
    .mdsg-doc .old { text-decoration: line-through; color: var(--text-muted); font-weight: 400; margin-right: 4px; }
    .mdsg-cons { display: grid; gap: 6px; }
    .mdsg-cons > div { border-left: 3px solid var(--border-strong); padding: 5px 10px; font-size: 13.5px; background: var(--surface-2); border-radius: 0 8px 8px 0; }
    .mdsg-cons > .ok { border-left-color: var(--ok); }
    .mdsg-cons > .bad { border-left-color: var(--bad); }
    .mdsg-cons > .warn { border-left-color: var(--warn); }
    .mdsg-cons b.who { font-weight: 600; }
    .mdsg-fl { display: grid; gap: 6px; }
    .mdsg-fr { display: grid; grid-template-columns: 34px minmax(0, 1.4fr) minmax(0, 1fr) 92px; gap: 8px; align-items: center; border: 1px solid var(--border); border-radius: 10px; padding: 6px 8px; background: var(--surface-2); }
    .mdsg-fr.off { opacity: .62; background: none; }
    .mdsg-fr.ok { border-color: var(--ok); }
    .mdsg-fr.bad { border-color: var(--bad); }
    .mdsg-fr.warn { border-color: var(--warn); }
    .mdsg-fr .nm code { font-size: 12.5px; }
    .mdsg-fr .nm small { display: block; color: var(--text-2); font-size: 12px; line-height: 1.3; }
    .mdsg-fr .why { grid-column: 1 / -1; font-size: 13px; color: var(--text-2); }
    .mdsg-fr label { display: inline-flex; gap: 5px; align-items: center; font-size: 12.5px; color: var(--text-2); }
    .mdsg-fr select { padding: 5px 6px; font-size: 12.5px; }
    .mdsg-inc { width: 30px; height: 30px; border-radius: 8px; border: 1px solid var(--border-strong); background: var(--surface); color: var(--text-muted); font-weight: 700; padding: 0; }
    .mdsg-inc[aria-pressed="true"] { background: var(--accent); border-color: var(--accent); color: var(--accent-text); }
    .mdsg-step { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 6px; }
    .mdsg-kv { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
    .mdsg-kv .card { align-content: start; }
    .mdsg-big { font: 700 22px/1.1 var(--f-brand); }
    .mdsg-log { font-family: var(--f-mono); font-size: 12px; }
    .mdsg-q { display: grid; gap: 4px; }
    .mdsg-q .ans { font-size: 13.5px; }
    @media (max-width: 760px) {
      .mdsg-2, .mdsg-kv { grid-template-columns: minmax(0, 1fr); }
      .mdsg-step { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .mdsg-fr { grid-template-columns: 34px minmax(0, 1fr); }
      .mdsg-fr .ty, .mdsg-fr .nl { grid-column: 2; }
      .mdsg-def { grid-template-columns: minmax(0, 1fr); }
    }
  </style>`);

  const money = n => (Math.round(n * 100) / 100).toLocaleString('ru-RU', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).replace(/ /g, ' ') + ' ₽';
  const bal = n => `${n} ${TR.plural(n, 'балл', 'балла', 'баллов')}`;
  const dbFail = e => ui.note('bad', 'База не загрузилась', `Учебная база (SQLite в браузере) подгружается из интернета. Похоже, нет сети: ${esc(String((e && e.message) || e || ''))}. Теорию можно читать дальше — числа из базы приведены в тексте.`);

  // =====================================================================
  // Теория 1. От требований к данным
  // =====================================================================
  const KINDS = {
    ent: { t: 'Сущность (таблица)', c: 'var(--accent)' },
    attr: { t: 'Атрибут (поле)', c: 'var(--info)' },
    rel: { t: 'Связь (внешний ключ)', c: 'var(--warn)' },
    ev: { t: 'Событие → статус и время', c: 'var(--ok)' },
    no: { t: 'Не данные / не храним', c: 'var(--text-muted)' }
  };
  const UC = {
    iskra: {
      hd: 'UC-07 «Согласовать доп. работы» · основной сценарий',
      text: '[Механик|mech] находит при ремонте [проблему|problem] и делает [фото|photo] в [планшете|tablet]. [Мастер-приёмщик|master] формирует [предложение|offer] с [описанием|descr] и [ценой|price] и [отправляет|send] его [клиенту|client]. Клиент в [приложении|app] [согласует|approve] или [отклоняет|reject] предложение. Если ответа нет [20 минут|min20], мастер [звонит|call] клиенту. Согласованные работы [добавляются|added] в [заказ-наряд|order]. Для [«Шашки»|shashka] сумма до [лимита договора|limit] согласуется [автоматически|auto]. На экране — [крупная кнопка «Согласовать»|button].',
      tok: {
        mech: ['ent', 'employee (role = mechanic) → ссылка found_by', 'Механик — не отдельная таблица, а сотрудник с ролью. В предложении нужна ссылка «кто нашёл»: found_by → employee.id. Иначе спор «кто сказал, что колодки на 2 мм» не разрешить.'],
        problem: ['attr', 'extra_offer.description', 'Существительное, но не сущность: у «проблемы» нет своей жизни без предложения. Если бы одна находка порождала несколько предложений (дешёвый и дорогой вариант) — выделили бы таблицу finding.'],
        photo: ['attr', 'extra_offer.photo_url', 'Файл фото (до 10 МБ, хранится 6 месяцев) лежит в файловом хранилище, в базе — только ссылка. Картинки в базе раздувают резервные копии и замедляют восстановление (RTO ≤ 1 ч).'],
        tablet: ['no', 'канал, а не данные', 'Планшет — устройство и интерфейс. Иногда хранят источник (source = tablet / arm) для аналитики, но самого «планшета» в модели нет.'],
        master: ['ent', 'employee (role = master) → ссылка created_by', 'Тот же employee, но другая роль и другая ссылка: created_by. По BR-7 предложение с ценой формирует мастер — значит, именно он отвечает за сумму.'],
        offer: ['ent', 'extra_offer — новая таблица', 'Главная сущность сценария: у предложения есть жизнь (отправлено → согласовано / отклонено / истекло), время и ответственные. Признак сущности: у неё есть свой идентификатор и она проживает несколько состояний.'],
        descr: ['attr', 'extra_offer.description VARCHAR(500)', 'Что нашли и что предлагаем — текст, который клиент читает в приложении. Обязательно: без описания согласие не «информированное» (BR-6).'],
        price: ['attr', 'extra_offer.amount DECIMAL(10,2)', 'Деньги — точный десятичный тип или целые копейки, не FLOAT. Сумма фиксируется в момент отправки: что клиент согласовал, то и платит.'],
        send: ['ev', 'status = sent, sent_at', 'Глагол-событие. Превращается в статус и момент времени. От sent_at считаются 20 минут BR-8 — поэтому время обязательно.'],
        client: ['ent', 'client — через work_order → car → client', 'Клиент уже есть в модели. Копировать в предложение его телефон не нужно: адресат находится по связям. Лишняя копия персональных данных — лишний риск (BR-15).'],
        app: ['no', 'канал', 'Приложение — интерфейс. Канал ответа сохраним иначе: decided_by = client (в приложении) или phone (по телефону).'],
        approve: ['ev', 'status = approved, decided_at, decided_by = client', 'Событие «согласовал» — это три поля: новый статус, когда и как решено. Это доказательство согласия по BR-6 — его не удаляют и не переписывают.'],
        reject: ['ev', 'status = rejected (+ decided_at, decided_by)', 'Отказ — тоже решение, и его тоже нужно доказать: «клиент отказался от замены колодок 12 января в 20:27».'],
        min20: ['no', 'правило BR-8, вычисляется от sent_at', 'Не поле. Хранить «осталось минут» нельзя — устареет через минуту. Таймер вычисляется: sent_at + 20 минут < сейчас и status = sent.'],
        call: ['ev', 'decided_by = phone (+ called_at — по желанию)', 'Звонок — событие. Минимум: решение по телефону видно по decided_by = phone. Если Тимур захочет статистику дозвона («38 % не берут трубку») — понадобится called_at или отдельная таблица звонков.'],
        added: ['rel', 'work_item.extra_offer_id → extra_offer.id', 'Глагол-связь: согласованные работы становятся строками заказ-наряда со ссылкой на предложение. По ней видно, какие строки появились «сверху» и на основании какого согласия.'],
        order: ['ent', 'work_order — уже есть', 'Предложение принадлежит заказ-наряду: extra_offer.work_order_id NOT NULL. Без заказ-наряда предложения не бывает.'],
        shashka: ['ent', 'company — уже есть', 'Корпоративный клиент. Связь идёт через клиента: client.company_id.'],
        limit: ['attr', 'company.auto_approve_limit', 'Атрибут компании, а не предложения: лимит из договора, у «Шашки» 3 000 ₽ (BR-9). В предложении его не дублируем.'],
        auto: ['ev', 'decided_by = auto', 'Решение без человека — тоже значение перечисления. Через полгода Ольга спросит: «кто согласовал 2 800 ₽ для „Шашки“?» — ответ «договор, автоматически».'],
        button: ['no', 'интерфейс', 'Крупная кнопка — требование к экрану (для Ники), а не к данным.']
      }
    },
    home: {
      hd: 'Бытовой пример · «Я даю книги друзьям»',
      text: '[Друг|friend] [берёт|take] у меня [книгу|book] на [две недели|due] и потом [возвращает|ret]. Я записываю в [блокнот|note], [когда отдал|when] и [в каком состоянии|cond] была книга. Если друг [не вернул вовремя|late] — я [напоминаю|remind].',
      tok: {
        friend: ['ent', 'friend', 'Человек с именем и телефоном — сущность.'],
        take: ['ent', 'loan (выдача) — сущность-событие', 'Интересный случай: глагол «берёт» стал сущностью. У выдачи есть своя жизнь — когда отдал, до какого срока, когда вернули. Глагол с датами и состоянием часто превращается в таблицу.'],
        book: ['ent', 'book', 'Книга — сущность. Одну книгу можно выдать много раз — поэтому выдача отдельно.'],
        due: ['attr', 'loan.due_at', 'Срок возврата — атрибут выдачи, а не книги.'],
        ret: ['ev', 'loan.returned_at', 'Событие «вернул» — момент времени. Пока NULL — книга на руках.'],
        note: ['no', 'носитель', 'Блокнот — где храним, а не что храним.'],
        when: ['attr', 'loan.given_at', 'Момент выдачи.'],
        cond: ['attr', 'loan.condition_out', 'Состояние на момент выдачи — копия «как было тогда»: потом сравним при возврате.'],
        late: ['no', 'вычисляется', 'Просрочка не хранится: due_at < сегодня и returned_at IS NULL.'],
        remind: ['ev', 'reminder (если важно, сколько раз напоминали)', 'Если напоминаний бывает несколько и важно, когда, — это отдельная таблица событий. Если нет — не храним.']
      }
    }
  };
  const tokRe = /\[([^|\]]+)\|([a-z0-9]+)\]/g;

  const CR_ROLES = [['client', 'Клиент'], ['mech', 'Механик'], ['master', 'Мастер-приёмщик'], ['sys', 'Система']];
  const CR_STEPS = [
    { t: 'Елена записывается на ТО в приложении', ops: [['booking', 'client', 'C'], ['client', 'client', 'R']], why: 'Запись создаёт клиент. Данные клиента читаются, чтобы подставить машину и телефон.' },
    { t: 'Система резервирует запчасти в 1С на 3 дня (BR-12)', ops: [['part', 'sys', 'U'], ['booking', 'sys', 'R']], why: 'Не человек, а система меняет остаток (резерв). Роль «Система» в CRUD-матрице обязательна — иначе потеряются фоновые изменения.' },
    { t: 'Мастер утром назначает пост', ops: [['booking', 'master', 'U']], why: 'Мастер не создаёт запись, а меняет её: post_id.' },
    { t: 'Елена переносит запись на час позже (BR-3)', ops: [['booking', 'client', 'U']], why: 'Перенос — изменение, а не новая запись. Если бы это была новая запись, история «переносила дважды» потерялась бы.' },
    { t: 'Другой клиент не приехал за 15 минут — «Неявка» (BR-4)', ops: [['booking', 'sys', 'U'], ['client', 'sys', 'U']], why: 'Система по таймеру меняет статус записи и увеличивает no_show_count у клиента.' },
    { t: 'Елена приехала — мастер открывает заказ-наряд', ops: [['work_order', 'master', 'C'], ['booking', 'master', 'U']], why: 'Заказ-наряд создаёт мастер, запись переходит в «Клиент приехал».' },
    { t: 'Механик смотрит, что делать по машине', ops: [['work_order', 'mech', 'R']], why: 'Механику нужен заказ-наряд и машина. Телефон и ФИО клиента ему не нужны — это принцип минимизации персональных данных.' },
    { t: 'Кто-нибудь удаляет запись?', ops: [], why: 'Никто. Отменённая запись — статус cancelled, а не DELETE: иначе пропадёт статистика неявок и отмен, ради которой затевали проект.' }
  ];
  const CR_TABLES = ['booking', 'client', 'work_order', 'part'];

  const howNouns = {
    id: 'how-nouns', covers: ['entities', 'crud'], title: 'Как это работает: от требований к данным и к CRUD-матрице', free: true, noReset: true,
    simple: {
      icon: '🧩',
      plain: 'Читаем требования и сценарии с карандашом: существительные — кандидаты в сущности и поля, глаголы — в связи, события и статусы. Потом проходим сценарий по шагам и записываем, кто какие данные создаёт, читает, меняет и удаляет.',
      analogy: 'Как переезд: сначала составляете список вещей (что есть), потом — кто что несёт и куда ставит. Без списка половина вещей окажется «ничьей».',
      tech: 'Анализ предметной области по тексту (лингвистический анализ, Чен, 1983), модель сущность — связь; CRUD-матрица (Create, Read, Update, Delete — создать, прочитать, изменить, удалить) — BABOK v3, техника «Анализ данных»/«Моделирование данных»; Вигерс, «Разработка требований», гл. 13 «Требования к данным».'
    },
    lead: ui.brief({
      situation: 'Пятница, 14:00. Use Case «Согласовать доп. работы» и BPMN-схема у вас уже есть. Глеб: «Красиво. А таблицы где? Что храним, какие поля, кто что пишет?» Вера: «Таблицы не придумывают — их вычитывают из сценария. Давайте покажу на нём же».',
      todo: [
        'Переключайте подсветку: существительные, глаголы, всё. Нажимайте на подчёркнутые слова — увидите, во что они превращаются в модели.',
        'Переключите пример на бытовой — «книга другу». Обратите внимание: там глагол стал целой таблицей.',
        'Во вкладке «CRUD-матрица» пройдите сценарий записи на ТО по шагам и посмотрите, как заполняется матрица.'
      ],
      look: 'Правило-подсказка: существительное становится <b>сущностью</b>, если у него есть свой идентификатор и своя жизнь (несколько состояний, много экземпляров). Иначе — это <b>атрибут</b> другой сущности. Глагол становится <b>связью</b>, если просто соединяет двоих, и <b>событием</b> (статус + время + кто), если важно, когда и кем это сделано.'
    }),
    render(el) {
      el.classList.add('mdsg-root');
      const tabs = document.createElement('div'); el.appendChild(tabs);
      ui.tabs(tabs, [
        { id: 'uc', t: 'Существительные и глаголы', render: renderUC },
        { id: 'crud', t: 'CRUD-матрица', render: renderCRUD }
      ]);
      el.insertAdjacentHTML('beforeend', `<div class="stack" style="margin-top:12px">
        ${ui.note('warn', 'Типичные ошибки', '<ul class="checks"><li class="bad">Каждое существительное — таблица: «Проблема», «Фото», «Планшет», «Кнопка». Модель раздувается, связи путаются.</li><li class="bad">Хранить то, что вычисляется: «осталось минут до звонка», «просрочено». Такие поля врут уже через минуту.</li><li class="bad">Копировать персональные данные «для удобства» (телефон клиента в предложение) — их потом придётся обезличивать в пяти местах.</li><li class="bad">CRUD-матрица без роли «Система»: теряются таймеры, вебхуки ЮKassa, синхронизация с 1С.</li></ul>')}
        <details class="more"><summary>Как об этом спрашивают на собеседовании</summary><div>
          <p><b>«Вам дали Use Case. Как вы получите из него модель данных?»</b> Выпишу существительные и глаголы; отделю сущности (свой идентификатор, жизнь) от атрибутов; глаголы — в связи или события со статусом и временем; проверю каждую сущность вопросами «сколько их?», «кто создаёт?», «когда удаляется?»; сверю с существующей моделью, чтобы не дублировать; соберу CRUD-матрицу по ролям.</p>
          <p><b>«Зачем CRUD-матрица?»</b> Она находит «ничьи» данные (никто не создаёт — откуда возьмутся?), «вечные» (никто не удаляет — а надо ли?), лишние права (механику не нужен телефон клиента) и служит основой ролевой модели доступа и тест-кейсов Лизы.</p>
        </div></details></div>`);

      function renderUC(box) {
        let ex = 'iskra', mode = 'all', sel = null;
        box.innerHTML = `<div class="stack">
          <div class="row"><span class="small dim">Пример:</span>${ui.seg('ex', [{ v: 'iskra', t: '🔧 Согласование доп. работ' }, { v: 'home', t: '📚 Книга другу' }], ex, 'accent')}</div>
          <div class="row"><span class="small dim">Подсветить:</span>${ui.seg('mode', [{ v: 'n', t: 'Существительные' }, { v: 'v', t: 'Глаголы' }, { v: 'all', t: 'Всё' }], mode)}</div>
          <div class="mdsg-uc" data-uc></div>
          <div class="mdsg-leg">${Object.keys(KINDS).map(k => `<span><i style="border-color:${KINDS[k].c}"></i>${KINDS[k].t}</span>`).join('')}</div>
          <div data-card></div></div>`;
        const VERB = { send: 1, approve: 1, reject: 1, call: 1, added: 1, auto: 1, take: 1, ret: 1, remind: 1, late: 1, min20: 0 };
        function draw() {
          const u = UC[ex];
          const html = esc(u.text).replace(tokRe, (m, w, id) => {
            const k = u.tok[id][0], isV = !!VERB[id];
            const lit = mode === 'all' || (mode === 'v' ? isV : !isV);
            return `<button type="button" class="mdsg-tk k-${k} ${lit ? 'lit' : 'dim'}" data-tk="${id}" aria-pressed="${sel === id}">${w}</button>`;
          });
          TR.$('[data-uc]', box).innerHTML = `<div class="hd">${esc(u.hd)}</div><div>${html}</div>`;
          const t = sel && u.tok[sel];
          TR.$('[data-card]', box).innerHTML = t ? `<div class="card flat"><div class="mdsg-def">
              <span class="k">Вид</span><div><span class="chip" style="border-color:${KINDS[t[0]].c}">${KINDS[t[0]].t}</span></div>
              <span class="k">В модели</span><div><code>${esc(t[1])}</code></div>
              <span class="k">Почему</span><div>${esc(t[2])}</div></div></div>`
            : `<div class="small dim">Нажмите на подчёркнутое слово.</div>`;
        }
        ui.onSeg(box, (n, v) => { if (n === 'ex') { ex = v; sel = null; } if (n === 'mode') mode = v; draw(); });
        TR.on(box, 'click', '[data-tk]', (e, b) => { sel = b.dataset.tk; draw(); });
        draw();
      }

      function renderCRUD(box) {
        let step = -1;
        box.innerHTML = `<div class="stack">
          <p>CRUD-матрица — таблица «данные × роли», в клетках — буквы <span class="mdsg-let">C</span> создаёт, <span class="mdsg-let">R</span> читает, <span class="mdsg-let">U</span> меняет, <span class="mdsg-let">D</span> удаляет. Её не выдумывают, а <b>собирают по шагам сценария</b>. Пройдём запись на ТО.</p>
          <div class="row"><button type="button" class="btn sm" data-cr="prev">← Шаг назад</button><button type="button" class="btn sm primary" data-cr="next">Следующий шаг →</button><button type="button" class="btn sm ghost" data-cr="all">Показать всё</button><span class="small dim" data-cnt></span></div>
          <div data-st></div>
          <div class="mdsg-wrap"><table class="mdsg-mx" data-mx></table></div>
          ${ui.note('info', 'Как читать матрицу', '<p>Пустой столбец «D» в документах — хороший знак: записи, заказ-наряды, платежи не удаляют, а переводят в статус (cancelled, closed) — BR-16. Строка, где никто не делает C, — тревога: откуда возьмутся данные? Клетка «механик × клиент» пустая — и это правильно: минимизация доступа к персональным данным (BR-15).</p>')}
        </div>`;
        function draw() {
          const cells = {}, hit = {};
          CR_STEPS.forEach((s, i) => { if (i <= step) s.ops.forEach(([t, r, op]) => { const k = t + '|' + r; cells[k] = (cells[k] || '') + (cells[k] && cells[k].includes(op) ? '' : op); if (i === step) hit[k] = 1; }); });
          const ordered = s => 'CRUD'.split('').filter(c => s.includes(c)).join('');
          TR.$('[data-mx]', box).innerHTML = `<thead><tr><th style="text-align:left">Таблица</th>${CR_ROLES.map(r => `<th>${esc(r[1])}</th>`).join('')}</tr></thead><tbody>${CR_TABLES.map(t => `<tr><td class="t"><code>${t}</code></td>${CR_ROLES.map(r => { const k = t + '|' + r[0]; return `<td class="${hit[k] ? 'hit' : ''}"><span class="mdsg-let">${ordered(cells[k] || '') || '<span class="dim">—</span>'}</span></td>`; }).join('')}</tr>`).join('')}</tbody>`;
          const s = CR_STEPS[step];
          TR.$('[data-st]', box).innerHTML = s ? `<div class="card flat"><p><b>Шаг ${step + 1}. ${esc(s.t)}</b></p><p class="small">${esc(s.why)}</p></div>` : '<div class="small dim">Нажмите «Следующий шаг».</div>';
          TR.$('[data-cnt]', box).textContent = `${Math.max(0, step + 1)} из ${CR_STEPS.length}`;
        }
        TR.on(box, 'click', '[data-cr]', (e, b) => { const a = b.dataset.cr; step = a === 'next' ? Math.min(CR_STEPS.length - 1, step + 1) : a === 'prev' ? Math.max(-1, step - 1) : CR_STEPS.length - 1; draw(); });
        draw();
      }
    }
  };

  // =====================================================================
  // Практика 1. Из Use Case — элементы модели
  // =====================================================================
  const EN_ITEMS = [
    { id: 'i1', t: 'Предложение доп. работ', ok: ['ent'], why: 'Своя жизнь (отправлено → решено), свой номер, много экземпляров на один заказ-наряд — сущность extra_offer.' },
    { id: 'i2', t: 'Описание найденной проблемы', ok: ['attr'], why: 'Без предложения не живёт — атрибут extra_offer.description.' },
    { id: 'i3', t: 'Сумма предложения', ok: ['attr'], why: 'Атрибут amount, DECIMAL(10,2): что клиент согласовал, то и платит.' },
    { id: 'i4', t: 'Фото проблемы', ok: ['attr'], why: 'В базе — ссылка photo_url, сам файл — в хранилище (до 10 МБ, 6 месяцев).' },
    { id: 'i5', t: 'Предложение относится к заказ-наряду', ok: ['rel'], why: 'Связь «многие к одному»: extra_offer.work_order_id → work_order.id.' },
    { id: 'i6', t: 'Кто нашёл проблему (механик)', ok: ['rel'], alt: { ent: 'Механик — не новая таблица: он уже есть как employee. Нужна ссылка found_by → employee.id, то есть связь.' }, why: 'Ссылка found_by → employee.id (BR-7: проблему находит механик).' },
    { id: 'i7', t: 'Кто составил предложение с ценой (мастер)', ok: ['rel'], alt: { ent: 'Мастер — уже существующий employee. В предложение добавляем ссылку created_by — это связь.' }, why: 'Ссылка created_by → employee.id: по BR-7 цену формирует мастер, он и отвечает.' },
    { id: 'i8', t: 'Клиент согласовал в приложении', ok: ['ev'], why: 'Событие: status = approved, decided_at, decided_by = client. Доказательство согласия по BR-6.' },
    { id: 'i9', t: 'Предложение отправлено клиенту', ok: ['ev'], alt: { attr: 'Почти: sent_at — атрибут. Но вместе со статусом sent это событие: от него идёт таймер BR-8.' }, why: 'Событие: status = sent + sent_at. От этого момента считаются 20 минут.' },
    { id: 'i10', t: 'Мастер дозвонился, клиент сказал «делайте»', ok: ['ev'], why: 'Событие: approved + decided_by = phone (+ called_at, если нужна статистика дозвона).' },
    { id: 'i11', t: '«Прошло 20 минут без ответа»', ok: ['no'], alt: { ev: 'Это не хранимое событие, а условие: вычисляется из sent_at и текущего времени. Храним итог — expired или decided_by = phone.', attr: 'Поле «осталось минут» устареет через минуту. Вычисляется из sent_at.' }, why: 'Вычисляется: sent_at + 20 мин < сейчас и status = sent. Хранить нельзя — устареет.' },
    { id: 'i12', t: 'Согласованная работа попадает в заказ-наряд', ok: ['rel'], alt: { ev: 'Событие тут — согласование. А «попадает» — это строка work_item со ссылкой extra_offer_id: связь.' }, why: 'Связь work_item.extra_offer_id → extra_offer.id: видно, на основании какого согласия появилась строка.' },
    { id: 'i13', t: 'Лимит автосогласования «Шашки» 3 000 ₽', ok: ['attr'], why: 'Атрибут компании company.auto_approve_limit (BR-9), а не предложения.' },
    { id: 'i14', t: 'Крупная кнопка «Согласовать»', ok: ['no'], why: 'Требование к интерфейсу — для Ники, не для базы.' },
    { id: 'i15', t: 'Планшет механика', ok: ['no'], why: 'Канал ввода, не данные. Максимум — поле «источник» для аналитики.' },
    { id: 'i16', t: 'Заказ-наряд', ok: ['ent'], why: 'Сущность work_order — уже есть в модели. Не создаём заново, а связываемся с ней.' }
  ];
  const EN_BUCKETS = Object.keys(KINDS).map(k => ({ id: k, t: KINDS[k].t }));
  function enEval(a) {
    const v = (a && a.v) || {};
    const rows = EN_ITEMS.map(it => {
      const g = v[it.id];
      if (!g) return { it, st: 'none', pts: 0 };
      if (it.ok.includes(g)) return { it, st: 'ok', pts: 1 };
      if (it.alt && it.alt[g]) return { it, st: 'bad', pts: 0, why: it.alt[g] };
      return { it, st: 'bad', pts: 0 };
    });
    return { rows, score: rows.reduce((s, r) => s + r.pts, 0) / EN_ITEMS.length, placed: rows.filter(r => r.st !== 'none').length };
  }
  const entitiesTask = {
    id: 'entities', title: 'Из Use Case — в модель: сущности, атрибуты, связи, события',
    lead: ui.brief({
      situation: 'Глеб положил на стол распечатку UC-07 и стикеры: «Вот всё, что я выписал. Разложи: что станет таблицей, что полем, что ссылкой, что статусом, а что вообще не в базу. Потом я буду писать миграцию — переделывать не хочу».',
      todo: [
        'Разложите 16 карточек по пяти корзинам: сущность, атрибут, связь, событие, не данные.',
        'Помните: многое уже есть в модели «Искры» (work_order, employee, company). Новую таблицу заводим, только если у объекта своя жизнь.',
        'Нажмите «Проверить». Засчитывается от 80 % верно разложенных карточек.'
      ],
      lookTitle: 'Подсказка',
      look: 'Задайте карточке три вопроса. «Есть ли у неё свой номер и много экземпляров?» — сущность. «Это свойство чего-то другого?» — атрибут. «Это ссылка на уже существующий объект?» — связь. «Это момент, когда что-то изменилось, и важно кто и когда?» — событие. «Это экран, устройство или то, что вычисляется?» — не храним.'
    }),
    blank: () => ({ v: {} }),
    reference: () => ({ v: Object.fromEntries(EN_ITEMS.map(i => [i.id, i.ok[0]])) }),
    render(el, ctx) {
      el.classList.add('mdsg-root');
      const a = ctx.ans; a.v = a.v || {};
      let reveal = null;
      if (ctx.result) { reveal = {}; enEval(a).rows.forEach(r => { if (r.st !== 'none') reveal[r.it.id] = r.st; }); }
      const box = document.createElement('div'); el.appendChild(box);
      ui.sort(box, { items: EN_ITEMS.map(i => ({ id: i.id, t: esc(i.t) })), buckets: EN_BUCKETS, value: a.v, reveal, readonly: ctx.readonly, seed: 'mdsg-ent', onChange: v => { a.v = v; ctx.save(); } });
    },
    check(ans) {
      const r = enEval(ans), notes = [];
      notes.push({ ok: r.score >= 0.8 ? true : r.score >= 0.6 ? 'warn' : false, html: `Верно разложено ${r.rows.filter(x => x.st === 'ok').length} из ${EN_ITEMS.length}.` });
      if (r.placed < EN_ITEMS.length) notes.push({ ok: 'warn', html: `Не разложено карточек: ${EN_ITEMS.length - r.placed}.` });
      r.rows.filter(x => x.st === 'bad').forEach(x => notes.push({ ok: false, html: `«${esc(x.it.t)}» — ${esc(x.why || x.it.why)}` }));
      const entWrong = r.rows.filter(x => x.st === 'bad' && ans.v[x.it.id] === 'ent').length;
      return {
        ok: r.score >= 0.8, score: r.score, notes,
        summary: `Разложено верно ${Math.round(r.score * 100)} %.`,
        mentor: r.score >= 0.8 ? null : entWrong >= 2 ? 'Таблиц получается слишком много. Механик и мастер уже живут в employee — нам нужны не новые таблицы, а ссылки на них. Новая сущность в этом сценарии одна — само предложение.' : 'Отделяйте хранимое от вычисляемого: «прошло 20 минут» — это условие от sent_at, а не поле. А экран и планшет — вообще не данные.'
      };
    },
    explain: `<p>Из всего сценария получается <b>одна новая таблица</b> — <code>extra_offer</code>. Остальное — её поля (описание, сумма, фото), ссылки на то, что уже есть (заказ-наряд, механик, мастер), события, которые превращаются в статус + время + «кем решено», и то, что в базу не идёт вовсе.</p>
      <p>Самые частые ошибки: сделать таблицы «Механик» и «Мастер» (это роли одного <code>employee</code>), хранить вычисляемое («20 минут прошло») и путать событие с атрибутом. Подсказка Веры: если у глагола есть «когда» и «кто» — это событие; если он просто соединяет двоих — связь.</p>
      <p>Источники: Чен, «Модель сущность — связь» (1976) и правила перевода текста в ERD (1983); Вигерс, гл. 13; BABOK v3, 10.15 «Моделирование данных».</p>`,
    refNote: 'Засчитывается только смысловое попадание; объяснение у каждой карточки появляется после проверки.',
    report: ans => { const r = enEval(ans); return r.rows.map(x => `- ${x.it.t} → ${(KINDS[(ans.v || {})[x.it.id]] || {}).t || '—'} ${x.st === 'ok' ? '✓' : x.st === 'bad' ? '✗' : ''}`).join('\n'); }
  };

  // =====================================================================
  // Практика 2. CRUD-матрица согласования
  // =====================================================================
  const CM_ROLES = [['client', 'Клиент', 'приложение'], ['mech', 'Механик', 'планшет'], ['master', 'Мастер-приёмщик', 'АРМ'], ['sys', 'Система', 'таймеры, ЮKassa, 1С']];
  const CM = {
    extra_offer: { ru: 'Предложение доп. работ', c: { client: ['RU', 'RU'], mech: ['R', 'CR'], master: ['CRU', 'CRU'], sys: ['U', 'RU'] },
      why: 'Клиент читает и решает (U: status, decided_at). Механик видит, согласовано ли — можно ли начинать; создать «черновик» с фото — допустимо. Мастер создаёт с ценой (BR-7) и фиксирует решение по телефону. Система ставит expired (BR-8) и auto (BR-9). D — ни у кого: это доказательство согласия (BR-6).' },
    work_item: { ru: 'Строка заказ-наряда', c: { client: ['R', 'R'], mech: ['R', 'RU'], master: ['CRU', 'CRUD'], sys: ['', 'CR'] },
      why: 'Строки добавляет и правит мастер; удалить ошибочную строку до «Готов» — допустимо. Система может сама создать строки из согласованного предложения. Клиент и механик читают.' },
    work_order: { ru: 'Заказ-наряд', c: { client: ['R', 'R'], mech: ['R', 'RU'], master: ['CRU', 'CRU'], sys: ['U', 'RU'] },
      why: 'Открывает и ведёт мастер. Система меняет статус на «Ждёт согласования» при отправке предложения и считает total. Механик может отмечать ход работ. D — никогда: отмена — статус cancelled, хранение 5 лет (BR-16).' },
    payment: { ru: 'Платёж', c: { client: ['CR', 'CR'], mech: ['', ''], master: ['CR', 'CR'], sys: ['U', 'CRU'] },
      why: 'Платёж создаёт клиент (онлайн) или мастер (касса станции). Статус paid ставит система по уведомлению ЮKassa. Механику платежи не нужны. D — нельзя: 5 лет (BR-16), сверка Ольги Викторовны.' },
    client: { ru: 'Клиент (ПДн)', c: { client: ['CRU', 'CRUD'], mech: ['', ''], master: ['R', 'CRU'], sys: ['U', 'RU'] },
      why: 'Клиент регистрируется и правит профиль; «удалить аккаунт» допустимо — но это обезличивание, а не DELETE (документы остаются, BR-16). Мастер читает и может завести клиента без приложения. Система меняет no_show_count и bonus_balance. Механику ФИО и телефон не нужны — минимизация ПДн (BR-15).' }
  };
  const CM_T = Object.keys(CM);
  const ordCR = s => 'CRUD'.split('').filter(c => (s || '').includes(c)).join('');
  function cmEval(a) {
    const m = (a && a.m) || {};
    const cells = [];
    CM_T.forEach(t => CM_ROLES.forEach(([r]) => {
      const got = ordCR(m[t + '|' + r]), [must, allow] = CM[t].c[r];
      const miss = must.split('').filter(c => c && !got.includes(c)), extra = got.split('').filter(c => !allow.includes(c));
      cells.push({ t, r, got, ok: !miss.length && !extra.length, miss, extra });
    }));
    const badD = cells.filter(c => ['extra_offer', 'work_order', 'payment'].includes(c.t) && c.got.includes('D'));
    const mechPd = cells.filter(c => c.r === 'mech' && (c.t === 'client' || c.t === 'payment') && c.got);
    return { cells, score: cells.filter(c => c.ok).length / cells.length, badD, mechPd, touched: Object.keys(m).some(k => m[k]) };
  }
  const crudTask = {
    id: 'crud', title: 'CRUD-матрица: кто что делает с данными согласования',
    lead: ui.brief({
      situation: 'Глебу нужны права доступа, Лизе — тест-кейсы «механик не должен видеть…». Вера: «Соберите CRUD-матрицу по сценарию согласования — от находки механика до оплаты. Из неё Глеб сделает роли, а Лиза — проверки».',
      todo: [
        'В каждой клетке включите буквы: C — создаёт, R — читает, U — меняет, D — удаляет. Пустая клетка — роль с таблицей не работает.',
        'Не забудьте роль «Система»: таймер BR-8, автосогласование BR-9, уведомления ЮKassa.',
        'Нажмите «Проверить». Засчитывается от 80 % верных клеток и без удаления документов.'
      ],
      lookTitle: 'Подсказка',
      look: 'Идите по шагам: механик нашёл → мастер сформировал → система сменила статус заказ-наряда → клиент согласовал (или система через 20 минут) → строки попали в заказ-наряд → «Готов» → оплата. На каждом шаге спросите: какая таблица, какая операция, чьими руками. И отдельно: кто и что <i>удаляет</i>?'
    }),
    blank: () => ({ m: {} }),
    reference: () => { const m = {}; CM_T.forEach(t => CM_ROLES.forEach(([r]) => { if (CM[t].c[r][0]) m[t + '|' + r] = CM[t].c[r][0]; })); return { m }; },
    render(el, ctx) {
      el.classList.add('mdsg-root');
      const a = ctx.ans; a.m = a.m || {};
      const ev = ctx.result ? cmEval(a) : null;
      el.innerHTML = `<div class="stack"><div class="mdsg-wrap"><table class="mdsg-mx" data-mx></table></div><div data-why></div></div>`;
      function draw() {
        TR.$('[data-mx]', el).innerHTML = `<thead><tr><th style="text-align:left">Таблица</th>${CM_ROLES.map(r => `<th>${esc(r[1])}<div class="small dim" style="font-weight:400;text-transform:none">${esc(r[2])}</div></th>`).join('')}</tr></thead>
          <tbody>${CM_T.map(t => `<tr><td class="t"><code>${t}</code><div class="small dim">${esc(CM[t].ru)}</div></td>${CM_ROLES.map(([r, rn]) => {
            const k = t + '|' + r, got = a.m[k] || '', c = ev && ev.cells.find(x => x.t === t && x.r === r);
            return `<td class="${c ? (c.ok ? 'ok' : 'bad') : ''}"><span class="mdsg-ops">${'CRUD'.split('').map(op => `<button type="button" class="mdsg-op" data-k="${k}" data-op="${op}" aria-pressed="${got.includes(op)}" aria-label="${esc(rn)} — ${op} для ${t}" ${ctx.readonly ? 'disabled' : ''}>${op}</button>`).join('')}</span></td>`;
          }).join('')}</tr>`).join('')}</tbody>`;
        TR.$('[data-why]', el).innerHTML = (ev || ctx.readonly) ? `<div class="stack tight">${CM_T.map(t => `<div class="card flat"><p><code>${t}</code> — ${esc(CM[t].why)}</p></div>`).join('')}</div>` : '';
      }
      TR.on(el, 'click', '[data-op]', (e, b) => {
        if (ctx.readonly) return;
        const k = b.dataset.k, op = b.dataset.op, cur = a.m[k] || '';
        a.m[k] = ordCR(cur.includes(op) ? cur.replace(op, '') : cur + op);
        if (!a.m[k]) delete a.m[k];
        ctx.save(); b.setAttribute('aria-pressed', String(!cur.includes(op)));
      });
      draw();
    },
    check(ans) {
      const r = cmEval(ans), notes = [];
      const roleRu = id => CM_ROLES.find(x => x[0] === id)[1];
      notes.push({ ok: r.score >= 0.8 ? true : r.score >= 0.6 ? 'warn' : false, html: `Верных клеток: ${r.cells.filter(c => c.ok).length} из ${r.cells.length}.` });
      if (r.badD.length) notes.push({ ok: false, html: `Удаление (D) у документов: ${r.badD.map(c => `${roleRu(c.r)} × <code>${c.t}</code>`).join(', ')}. Предложения, заказ-наряды и платежи не удаляют: это доказательство согласия (BR-6) и документы, которые хранятся 5 лет (BR-16). Отмена — статус.` });
      if (r.mechPd.length) notes.push({ ok: false, html: 'Механику открыт доступ к клиенту или платежам. Ему для работы нужны машина и заказ-наряд; ФИО, телефон и оплата — лишние персональные и финансовые данные (BR-15, принцип минимизации 152-ФЗ).' });
      const sysMiss = r.cells.filter(c => c.r === 'sys' && c.miss.length);
      if (sysMiss.length) notes.push({ ok: false, html: `У роли «Система» не хватает изменений: ${sysMiss.map(c => `<code>${c.t}</code> (${c.miss.join('')})`).join(', ')}. Кто тогда поставит «Истекло» через 20 минут, отметит оплату по уведомлению ЮKassa, пересчитает бонусы и неявки?` });
      r.cells.filter(c => !c.ok && c.r !== 'sys' && !(r.badD.includes(c)) && !(r.mechPd.includes(c))).forEach(c => notes.push({ ok: 'warn', html: `${roleRu(c.r)} × <code>${c.t}</code>: ${c.miss.length ? `не хватает ${c.miss.join(', ')}` : ''}${c.miss.length && c.extra.length ? '; ' : ''}${c.extra.length ? `лишнее ${c.extra.join(', ')}` : ''}.` }));
      const ok = r.score >= 0.8 && !r.badD.length;
      return {
        ok, score: r.badD.length ? Math.min(r.score, 0.7) : r.score, notes,
        summary: r.touched ? `Матрица совпала на ${Math.round(r.score * 100)} %.` : 'Матрица пустая.',
        mentor: ok ? null : r.badD.length ? 'Слово «удалить» в документах «Искры» почти всегда означает «перевести в статус». Ольга Викторовна через пять лет должна найти и предложение, и платёж.' : 'Пройдите сценарий ещё раз по шагам и для каждого шага отметьте одну клетку. Чаще всего забывают систему: таймеры и уведомления тоже «руки».'
      };
    },
    explain: `<p>Ключевые наблюдения из матрицы:</p>
      <ul class="checks">
        <li>Столбец <b>D пустой</b> для предложений, заказ-нарядов и платежей. «Удалить» заменяется статусом: cancelled, expired, refunded. Это прямо следует из BR-6 (согласие нужно доказать) и BR-16 (5 лет хранения).</li>
        <li>Роль <b>«Система»</b> меняет данные чаще людей: «Истекло» по BR-8, автосогласование по BR-9, статус заказ-наряда, total, оплата по уведомлению ЮKassa, бонусы, неявки. Без неё в матрице дыры — и в требованиях к бэкенду тоже.</li>
        <li><b>Механик × клиент — пусто.</b> Это решение о доступе к персональным данным: в планшете показываем машину и работы, но не телефон и ФИО.</li>
        <li>Клиент меняет предложение (U) только в части решения: статус и время. Сумму и описание он не меняет — в спецификации API это отдельные поля с разными правами.</li>
      </ul>
      <p>Дальше из матрицы получаются роли доступа для Глеба и негативные тесты для Лизы: «механик запрашивает /clients/42 → 403». Источники: BABOK v3, 10.15 и 10.42 (ролевая модель); Вигерс, гл. 13 — CRUD-матрица как проверка полноты требований.</p>`,
    refNote: 'Во многих клетках допускается вариант: механик может создавать черновик предложения, мастер — удалять ошибочную строку до «Готов», система — создавать строки и платежи по счёту. Строго: никакого D у документов и никакого доступа механика к клиенту и платежам.',
    report: ans => CM_T.map(t => `- ${t}: ${CM_ROLES.map(([r, rn]) => `${rn} ${ordCR((ans.m || {})[t + '|' + r]) || '—'}`).join(', ')}`).join('\n')
  };

  // =====================================================================
  // Теория 2. Деньги, время, цена на момент заказа, денормализация
  // =====================================================================
  const howMoney = {
    id: 'how-money', covers: ['pricelab'], title: 'Как это работает: деньги, время, цена «на тот момент» и осознанная денормализация', free: true, noReset: true,
    simple: {
      icon: '💰',
      plain: 'Деньги храним точно (десятичным типом или целыми копейками), время — с часовым поясом, цену в документе — копией «как было тогда». А если ради скорости храним одно и то же дважды — записываем, что главное и как сверяем.',
      analogy: 'Чек из магазина: на нём цена того дня. Если завтра молоко подорожает, ваш вчерашний чек не перепечатают — иначе бухгалтерия никогда не сойдётся.',
      tech: 'Числа с фиксированной точкой (DECIMAL/NUMERIC) против двоичной плавающей точки (IEEE 754); timestamptz в PostgreSQL; снимок значения (snapshot) в документе; управляемая денормализация с источником истины и сверкой (Дейт, «Введение в системы баз данных»; Фаулер, шаблон Money в «Шаблонах корпоративных приложений»).'
    },
    lead: ui.brief({
      situation: 'Ольга Викторовна зашла на минуту и задержалась на час: «Мне нужно три вещи. Чтобы копейки сходились с ЮKassa. Чтобы время в чеке было правильное. И чтобы прошлогодний заказ-наряд не менялся, когда мы поднимаем цены». Глеб: «Последнее — это вопрос модели. Давайте разберём».',
      todo: [
        'Во вкладке «Деньги» переключите тип хранения и посмотрите, что получается в вычислениях — это реальный JavaScript в вашем браузере.',
        'Во вкладке «Время» разберите запись Елены из командировки.',
        'Во вкладке «Цена в строке» выполните запрос к учебной базе, во вкладке «Денормализация» — сверку.'
      ],
      look: 'Осознанная денормализация — это не «забыли нормализовать», а решение с тремя записями в словаре данных: <b>что источник истины</b>, <b>когда копия обновляется</b>, <b>как ловим расхождения</b>.'
    }),
    render(el) {
      el.classList.add('mdsg-root');
      const tabs = document.createElement('div'); el.appendChild(tabs);
      ui.tabs(tabs, [
        { id: 'm', t: 'Деньги', render: rMoney },
        { id: 't', t: 'Время', render: rTime },
        { id: 'p', t: 'Цена в строке', render: rPrice },
        { id: 'd', t: 'Денормализация', render: rDenorm }
      ]);
      el.insertAdjacentHTML('beforeend', `<div class="stack" style="margin-top:12px">
        ${ui.note('warn', 'Типичные ошибки', '<ul class="checks"><li class="bad">Деньги во FLOAT: «сумма строк 13 056,999999 ₽» и копейка расхождения со сверкой ЮKassa каждый день.</li><li class="bad">Округление «где-нибудь»: бонусы считаются в приложении с округлением вверх, а в бэкенде — вниз. Правило округления пишут в словарь данных.</li><li class="bad">Время без пояса: напоминание приходит на два часа раньше, а «20 минут без ответа» срабатывают сразу.</li><li class="bad">Цена строки берётся из каталога через JOIN: подняли прайс — переписали историю.</li><li class="bad">Копия есть, а источника истины и сверки нет: через полгода баланс баллов «не бьётся», и никто не знает, какой из двух верный.</li></ul>')}
        <details class="more"><summary>Как об этом спрашивают на собеседовании</summary><div>
          <p><b>«Каким типом хранить деньги?»</b> NUMERIC/DECIMAL с двумя знаками или целым числом в копейках; никогда FLOAT. Валюту — отдельным полем, если валют больше одной. Правило округления — в требованиях.</p>
          <p><b>«Как хранить время?»</b> Момент времени — в UTC (в PostgreSQL — timestamptz), а показывать в поясе станции или пользователя. Дату без времени (день рождения) — типом DATE, без пояса.</p>
          <p><b>«Нарушает ли копия цены в строке заказа нормализацию?»</b> Нет: это другой факт — «цена, по которой продали», а не «текущая цена в каталоге». У них разная жизнь.</p>
          <p><b>«Когда вы денормализуете?»</b> Когда чтение частое и дорогое, а запись редкая; и всегда — с источником истины, правилом обновления и сверкой.</p>
        </div></details></div>`);

      function rMoney(box) {
        let mode = 'float';
        const lines = [1530, 1530, 1530];
        const f1 = 0.1 + 0.2, f2 = 1530 * 1.1, f3 = 33.33 * 3, f4 = 0.07 * 100;
        box.innerHTML = `<div class="stack">
          <p>Пример: мастер дал Елене скидку 15 % на колодки — 1 530 ₽. Потом прайс поднимают на 10 %. Бонусы — 5 % от работ (BR-11). Как это посчитает компьютер?</p>
          <div class="row"><span class="small dim">Храним как:</span>${ui.seg('m', [{ v: 'float', t: 'FLOAT (с плавающей точкой)' }, { v: 'dec', t: 'DECIMAL(10,2)' }, { v: 'kop', t: 'INTEGER, копейки' }], mode, 'accent')}</div>
          <div data-out></div></div>`;
        function draw() {
          const rows = mode === 'float' ? [
            ['0,1 + 0,2', String(f1), f1 !== 0.3],
            ['1 530 × 1,1 (прайс +10 %)', String(f2), f2 !== 1683],
            ['33,33 × 3', String(f3), f3 !== 99.99],
            ['0,07 × 100', String(f4), f4 !== 7]
          ] : mode === 'dec' ? [
            ['0,10 + 0,20', '0.30', false], ['1 530,00 × 1,1', '1683.00', false], ['33,33 × 3', '99.99', false], ['0,07 × 100', '7.00', false]
          ] : [
            ['10 + 20 коп.', '30 → 0,30 ₽', false], ['153 000 × 11 / 10 коп.', '168 300 → 1 683,00 ₽', false], ['3 333 × 3 коп.', '9 999 → 99,99 ₽', false], ['7 × 100 коп.', '700 → 7,00 ₽', false]
          ];
          const exp = { float: ['bad', 'FLOAT — двоичная дробь', 'Это не ошибка JavaScript, а свойство формата IEEE 754: 0,1 нельзя точно записать двоичной дробью. В одной строке погрешность незаметна, но сумма 4 500 заказ-нарядов за месяц разойдётся со сверкой ЮKassa на копейки — и Ольга будет искать их вручную.'],
            dec: ['ok', 'DECIMAL(10,2) — десятичная фиксированная точка', 'Так сделано в «Искре»: amount, price, total — DECIMAL(10,2), до 99 999 999,99 ₽. База считает в десятичных цифрах, как бухгалтер. В PostgreSQL — NUMERIC(10,2).'],
            kop: ['ok', 'Целое число копеек', 'Тоже правильно и популярно в платёжных системах (ЮKassa в API передаёт сумму строкой «1683.00», Stripe — целыми центами). Минус: везде помнить, что 168300 — это копейки; называйте поле amount_kop.'] }[mode];
          TR.$('[data-out]', box).innerHTML = `${ui.table(['Вычисление', 'Результат'], rows.map(r => [esc(r[0]), `<code style="color:${r[2] ? 'var(--bad)' : 'var(--ok)'}">${esc(r[1])}</code>`]))}
            ${ui.note(exp[0], exp[1], exp[2])}
            ${ui.note('info', 'Правило округления — тоже требование', `<p>Бонусы по BR-11 — 5 % от работ, а баланс баллов в «Искре» — целое число (client.bonus_balance INTEGER). 5 % от 1 333,33 ₽ = 66,67 — это 66 или 67 баллов? В словаре данных нужно записать: «баллы начисляются с округлением вниз до целого». У Елены работы на ${money(lines[0] + 3700)} → ${bal(Math.floor((lines[0] + 3700) * 0.05))}.</p>`)}`;
        }
        ui.onSeg(box, (n, v) => { mode = v; draw(); });
        draw();
      }

      function rTime(box) {
        let mode = 'naive';
        box.innerHTML = `<div class="stack">
          <p>Елена в командировке в Екатеринбурге (UTC+5, на 2 часа впереди Казани). Она записывается на ТО на станцию Победы <b>на завтра, 09:30 по Казани</b> (UTC+3). Сервер «Искры» работает в UTC. Как храним время?</p>
          <div class="row"><span class="small dim">Храним как:</span>${ui.seg('t', [{ v: 'naive', t: 'Строка без пояса «2027-02-11 09:30»' }, { v: 'utc', t: 'Момент в UTC + пояс станции' }], mode, 'accent')}</div>
          <div data-out></div></div>`;
        function draw() {
          const naive = mode === 'naive';
          TR.$('[data-out]', box).innerHTML = `${ui.table(['Кто', 'Что видит / что делает', ''], naive ? [
            ['База', '<code>start_at = 2027-02-11 09:30</code> — чьи это 09:30?', ui.status('?', 'warn')],
            ['Телефон Елены', 'Показывает «09:30» и ставит напоминание по своим часам — это 07:30 по Казани', ui.status('мимо', 'bad')],
            ['Сервер (UTC)', 'Проверка BR-2 «не позже чем за 2 часа» считает 09:30 как UTC — ошибается на 3 часа', ui.status('мимо', 'bad')],
            ['Мастер в АРМ', '09:30 — верно, но случайно: АРМ в Казани', ui.status('повезло', 'warn')]
          ] : [
            ['База', '<code>start_at = 2027-02-11 06:30:00+00</code> (timestamptz), у станции — пояс Europe/Moscow', ui.status('однозначно', 'ok')],
            ['Телефон Елены', 'Показывает «09:30 по времени станции» — приложение переводит в пояс станции, а не телефона', ui.status('верно', 'ok')],
            ['Сервер (UTC)', 'BR-2, BR-3, BR-8 считает разницей моментов: 20 минут — это 20 минут в любом поясе', ui.status('верно', 'ok')],
            ['Мастер в АРМ', '09:30 — перевод в пояс станции', ui.status('верно', 'ok')]
          ])}
          ${ui.note(naive ? 'warn' : 'ok', naive ? 'Где это стреляет' : 'Правило для словаря данных', naive ? 'Все станции «Искры» в Казани — поэтому ошибка годами не видна. Она проявится у клиентов в других поясах, в push-уведомлениях (Firebase присылает время в UTC), в сверке с ЮKassa (её отметки времени — в UTC с поясом) и в отчётах «записей до 9 утра».' : '<p>«Моменты времени (…_at) хранятся в UTC, тип timestamptz. Показываются в поясе станции (station.timezone, для Казани — Europe/Moscow, UTC+3, без перехода на летнее время). Даты без времени (employee.hired_at) — тип DATE, без пояса.»</p>')}
          ${ui.note('info', 'А в учебной базе?', 'В тренажёре (SQLite) время записано строкой по-казански, без пояса: «2027-02-10 12:00». Это упрощение — и ровно такую оговорку аналитик обязан записать в словарь данных, чтобы разработчик не догадывался.')}`;
        }
        ui.onSeg(box, (n, v) => { mode = v; draw(); });
        draw();
      }

      function rPrice(box) {
        box.innerHTML = `<div class="stack">
          <div class="grid2">
            <div class="card flat"><p><b>Вариант «ссылка»</b>: в строке только service_id, цену берём из каталога.</p>${ui.code('SELECT s.name, s.price\nFROM work_item i\nJOIN service s ON s.id = i.service_id\nWHERE i.work_order_id = 457;', 'sql')}<p class="small">Цена — всегда сегодняшняя. Подняли прайс — изменились все прошлые заказ-наряды.</p></div>
            <div class="card flat"><p><b>Вариант «копия»</b> (так в «Искре»): цена копируется в строку при добавлении.</p>${ui.code('SELECT s.name, i.price\nFROM work_item i\nJOIN service s ON s.id = i.service_id\nWHERE i.work_order_id = 457;', 'sql')}<p class="small">В строке — цена, по которой продали. Каталог живёт своей жизнью.</p></div>
          </div>
          <p>Это не дублирование, а <b>два разных факта</b>: «сколько стоит сейчас» и «по чём продали тогда». Проверим на учебной базе: сколько строк-работ в заказ-нарядах уже сейчас отличаются от каталога (скидки, наценки, старые цены)?</p>
          <div class="row"><button type="button" class="btn sm primary" data-run>Выполнить запрос</button></div>
          ${ui.code("SELECT COUNT(*) AS строк_работ,\n       SUM(i.price <> s.price) AS цена_не_как_в_каталоге\nFROM work_item i\nJOIN service s ON s.id = i.service_id;", 'sql')}
          <div data-res></div></div>`;
        TR.on(box, 'click', '[data-run]', async () => {
          const out = TR.$('[data-res]', box); out.innerHTML = '<div class="small dim">Загружаю базу…</div>';
          try {
            const r = await TR.db.run('SELECT COUNT(*) AS строк_работ, SUM(i.price <> s.price) AS цена_не_как_в_каталоге FROM work_item i JOIN service s ON s.id = i.service_id;');
            out.innerHTML = TR.db.resultHTML(r) + (r.ok && r.rows[0] ? ui.note('info', 'Что это значит', `Из ${r.rows[0][0]} строк ${r.rows[0][1]} уже не совпадают с текущим каталогом. Если бы цена бралась по ссылке, все эти заказ-наряды показывали бы не ту сумму, что в чеке.`) : '');
          } catch (e) { out.innerHTML = dbFail(e); }
        });
      }

      const DEN = [
        { f: 'work_order.total', src: 'Сумма строк work_item (qty × price) по согласованным строкам', why: 'Список заказ-нарядов в АРМ и отчёт «средний чек 7 800 ₽» не пересчитывают тысячи строк каждый раз.', when: 'Считается при переводе в «Готов»; после — не меняется (документ закрыт).', risk: 'Строку поправили после «Готов» — total устарел.', sql: "SELECT COUNT(*) AS расхождений FROM work_order w\nWHERE w.total IS NOT NULL AND ABS(w.total - (\n  SELECT COALESCE(SUM(i.qty * i.price), 0) FROM work_item i\n  WHERE i.work_order_id = w.id AND (i.extra_offer_id IS NULL\n    OR i.extra_offer_id IN (SELECT id FROM extra_offer WHERE status = 'approved')))) > 0.01;" },
        { f: 'client.bonus_balance', src: 'Сумма операций bonus_tx.amount клиента', why: 'Баланс показывается на главном экране приложения при каждом входе: 1 500 одновременных пользователей в понедельник 9:00.', when: 'Меняется в той же транзакции, что и запись в bonus_tx.', risk: 'Запись в bonus_tx прошла, а баланс — нет (или наоборот).', sql: 'SELECT COUNT(*) AS расхождений FROM client c\nWHERE c.bonus_balance <> COALESCE(\n  (SELECT SUM(t.amount) FROM bonus_tx t WHERE t.client_id = c.id), 0);' },
        { f: 'client.no_show_count', src: 'Хвост истории записей клиента: сколько последних подряд — no_show', why: 'Проверка BR-4 «после 2 неявок — предоплата» нужна при каждой онлайн-записи; считать по истории каждый раз — дорого и сложно.', when: '+1 при «Неявке», сброс в 0 при визите.', risk: 'Неявку отменили вручную (клиент позвонил, ошибка мастера), а счётчик не уменьшили.', sql: null }
      ];
      function rDenorm(box) {
        let cur = 0;
        box.innerHTML = `<div class="stack"><p>В схеме «Искры» уже есть осознанные копии. Нажмите на поле:</p>
          <div class="row">${DEN.map((d, i) => `<button type="button" class="chip" data-d="${i}" aria-pressed="${i === cur}">${d.f}</button>`).join('')}</div><div data-card></div></div>`;
        function draw() {
          const d = DEN[cur];
          TR.$$('[data-d]', box).forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.d === cur)));
          TR.$('[data-card]', box).innerHTML = `<div class="card flat"><div class="mdsg-def">
            <span class="k">Источник истины</span><div>${esc(d.src)}</div>
            <span class="k">Зачем копия</span><div>${esc(d.why)}</div>
            <span class="k">Когда обновляется</span><div>${esc(d.when)}</div>
            <span class="k">Чем рискуем</span><div>${esc(d.risk)}</div></div>
            ${d.sql ? `<div class="stack tight"><div class="small dim">Сверочный запрос — ночная проверка, которую стоит записать в требования:</div>${ui.code(d.sql, 'sql')}<div class="row"><button type="button" class="btn sm" data-chk>Проверить в учебной базе</button></div><div data-res></div></div>` : '<p class="small dim">Сверка — по истории записей клиента; в учебной базе истории счётчика нет, поэтому это поле — кандидат в журнал аудита (следующая теория).</p>'}</div>`;
        }
        TR.on(box, 'click', '[data-d]', (e, b) => { cur = +b.dataset.d; draw(); });
        TR.on(box, 'click', '[data-chk]', async () => {
          const out = TR.$('[data-res]', box); out.innerHTML = '<div class="small dim">Загружаю базу…</div>';
          try { const r = await TR.db.run(DEN[cur].sql); out.innerHTML = TR.db.resultHTML(r) + (r.ok && r.rows[0] && r.rows[0][0] === 0 ? '<p class="small">Расхождений нет — копия согласована с источником.</p>' : ''); } catch (e) { out.innerHTML = dbFail(e); }
        });
        draw();
      }
    }
  };

  // =====================================================================
  // Практика 3. Лаборатория «каталог подорожал»
  // =====================================================================
  const LAB_LINES = [
    { id: 'TO-1', kind: 'Работа', name: 'ТО-1: замена масла и масляного фильтра', price: 2500, work: true },
    { id: 'DGN-2', kind: 'Работа', name: 'Компьютерная диагностика', price: 1200, work: true },
    { id: 'P-OIL', kind: 'Запчасть', name: 'Масло 5W-30, 4 л', price: 3200 },
    { id: 'P-FLT', kind: 'Запчасть', name: 'Фильтр масляный', price: 650 },
    { id: 'BRK-1', kind: 'Работа', name: 'Замена тормозных колодок (ось) — доп. работа, согласована в приложении', price: 1800, work: true },
    { id: 'P-PAD', kind: 'Запчасть', name: 'Колодки передние, комплект', price: 2520 }
  ];
  const LAB_PAID = LAB_LINES.reduce((s, l) => s + l.price, 0); // 11 870
  const LAB_DES = [
    { v: 'A', t: 'A · ссылка на каталог', d: 'В work_item — только service_id / part_id. Цена строки = текущая цена каталога (JOIN).' },
    { v: 'B', t: 'B · копия цены в строке', d: 'При добавлении строки цена копируется в work_item.price. Так сейчас в «Искре».' },
    { v: 'C', t: 'C · копия + история цен каталога', d: 'Как B, плюс таблица service_price (цена, действует с … по …): видно, сколько стоило в каталоге на любую дату.' }
  ];
  const LAB_EV = [
    { id: 'e1', t: '1 марта: прайс поднимают на 10 %', who: 'Тимур Рашидович' },
    { id: 'e2', t: 'Марина Олеговна убирает «Компьютерную диагностику» из каталога', who: 'Марина Олеговна' },
    { id: 'e3', t: 'Новый заказ: мастер даёт постоянной клиентке скидку 15 % на замену колодок', who: 'мастер-приёмщик' },
    { id: 'e4', t: 'Апрель: Елена оспаривает чек по гарантии (BR-14)', who: 'Елена' }
  ];
  function labCalc(d, del, ev) {
    const rows = LAB_LINES.map(l => {
      let cat = l.price;
      if (d === 'A' && ev.e3 && l.id === 'BRK-1') cat = 1530;
      if (ev.e1) cat = Math.round(cat * 1.1 / 10) * 10;
      const shown = d === 'A' ? cat : l.price;
      const blocked = ev.e2 && l.id === 'DGN-2' && del === 'hard';
      const archived = ev.e2 && l.id === 'DGN-2' && del === 'soft';
      return { l, shown, chg: shown !== l.price, blocked, archived };
    });
    const total = rows.reduce((s, r) => s + r.shown, 0);
    const cons = [];
    const mismatch = total !== LAB_PAID;
    if (d === 'A') {
      if (mismatch) cons.push(['bad', 'Ольга Викторовна', `Заказ-наряд показывает ${money(total)}, а платёж и чек 54-ФЗ — ${money(LAB_PAID)}. Январская выручка «выросла» задним числом, сверка с ЮKassa не сходится.`]);
      else cons.push(['warn', 'Ольга Викторовна', 'Пока сумма совпадает с чеком — но только потому, что каталог ещё не меняли. Любая правка прайса перепишет историю.']);
      if (ev.e3) cons.push(['bad', 'Мастер-приёмщик', 'Скидку одной клиентке можно дать только через каталог — и «колодки» подешевели у всех, включая старые заказ-наряды. Строка 5 старого заказ-наряда теперь 1 530 ₽ вместо оплаченных 1 800.']);
    } else {
      cons.push(['ok', 'Ольга Викторовна', `Заказ-наряд = платёж = чек: ${money(LAB_PAID)}. Подорожание каталога на прошлое не влияет.`]);
      if (ev.e1) cons.push(['ok', 'Тимур Рашидович', 'Новые заказ-наряды — по новым ценам, старые — как были оплачены.']);
      if (ev.e3) cons.push(d === 'C' ? ['ok', 'Мастер-приёмщик', 'Скидка — только в строке нового заказа: 1 530 ₽. По истории каталога видно: «в каталоге 1 800 → в строке 1 530, скидка 15 %».'] : ['warn', 'Мастер-приёмщик', 'Скидка — только в строке: 1 530 ₽. Но почему не 1 800, через полгода не понять: нет ни цены каталога на дату, ни поля «скидка / причина». Стоит добавить discount или комментарий.']);
    }
    if (ev.e2) cons.push(del === 'hard' ? ['bad', 'Марина Олеговна', 'DELETE FROM service: база отказала — «нарушен внешний ключ»: на услугу ссылаются строки заказ-нарядов. Марина пишет в поддержку. А если разработчик «починит» каскадным удалением — строки исчезнут из закрытых документов, которые надо хранить 5 лет (BR-16).'] : ['ok', 'Марина Олеговна', 'Услуга помечена архивной (is_active = 0, archived_at): из записи и прайса пропала, в старых заказ-нарядах читается с названием.']);
    if (ev.e4) {
      if (d === 'A' && mismatch) cons.push(['bad', 'Елена', `«У меня чек на ${money(LAB_PAID)}, а в приложении заказ-наряд на ${money(total)}. Какой документ верный?» Спор по гарантии сервис начинает с позиции «наши данные не сходятся».`]);
      else if (d === 'A') cons.push(['warn', 'Елена', 'Сейчас документ совпадает с чеком — повезло, что каталог не трогали.']);
      else cons.push(['ok', 'Елена', `Заказ-наряд в приложении совпадает с чеком: ${money(LAB_PAID)}, строки и даты на месте — гарантия BR-14 считается от даты выдачи.${d === 'C' ? ' Можно ещё и показать цену каталога на 14 января.' : ''}`]);
    }
    const bonusWork = rows.filter(r => r.l.work).reduce((s, r) => s + r.shown, 0);
    return { rows, total, cons, mismatch, bonusNow: Math.floor(bonusWork * 0.05), bonusPaid: Math.floor(LAB_LINES.filter(l => l.work).reduce((s, l) => s + l.price, 0) * 0.05) };
  }
  const LAB_Q = [
    { k: 'q1', q: '1. Прайс подняли на 10 %. Что покажет старый ЗН-1-0457 в варианте A?', options: [
      { t: `${money(LAB_PAID)} — как в чеке`, why: 'В варианте A цена строки не хранится — она каждый раз берётся из каталога.' },
      { t: 'Сумму по новым ценам — больше, чем оплачено', ok: true, why: 'Именно: документ «переписался» задним числом. Чек и платёж остались прежними — данные разошлись.' },
      { t: 'Ошибку: база запретит менять каталог', why: 'Обновить цену в каталоге базе ничто не мешает — внешний ключ защищает от удаления, а не от изменения.' }] },
    { k: 'q2', q: '2. Мастер хочет дать постоянной клиентке скидку 15 % на одну работу. Где её хранить?', options: [
      { t: 'Временно снизить цену в каталоге', why: 'Скидка получат все — и (в варианте A) все старые заказ-наряды.' },
      { t: 'В строке заказ-наряда: цена 1 530 ₽ (и лучше — поле «скидка» или причина)', ok: true, why: 'Скидка — свойство конкретной продажи. Цена в строке — копия «по чём продали», каталог не трогаем.' },
      { t: 'Только в комментарии к заказ-наряду', why: 'Комментарий не посчитаешь: total, чек и бонусы возьмут полную цену.' }] },
    { k: 'q3', q: '3. Марина Олеговна просит убрать «Компьютерную диагностику» из каталога. Как?', options: [
      { t: 'DELETE FROM service WHERE code = \'DGN-2\'', why: 'Внешний ключ из work_item не даст удалить. А «обойти» каскадом — значит выдрать строки из закрытых документов (BR-16).' },
      { t: 'Пометить архивной: is_active = 0 и archived_at', ok: true, why: 'Мягкое удаление для справочника: из новых записей пропадает, в старых документах остаётся.' },
      { t: 'Удалить и заменить в старых строках на «Прочие работы»', why: 'Это подделка истории: клиенту диагностику делали.' }] },
    { k: 'q4', q: '4. Через полгода Ольга спрашивает: «почему в строке 1 530, а по прайсу тогда было 1 800?» Где есть ответ?', options: [
      { t: 'В варианте A', why: 'В A нет ни цены продажи, ни цены на дату — только сегодняшний каталог.' },
      { t: 'В варианте B без дополнительных полей', why: 'B хранит 1 530, но не знает, сколько было в каталоге тогда. Видно «что», не видно «почему».' },
      { t: 'В варианте C (история цен каталога) — или в B с полем скидки / причины', ok: true, why: 'История цен каталога даёт «было 1 800 на 14 января»; поле скидки в строке даёт причину. Любое из двух закрывает вопрос.' }] }
  ];
  const labTask = {
    id: 'pricelab', title: 'Лаборатория: каталог подорожал — что стало со старыми заказ-нарядами?',
    simple: howMoney.simple,
    lead: ui.brief({
      situation: 'Тимур Рашидович: «С 1 марта поднимаем цены на 10 %, всё дорожает». Ольга Викторовна сразу: «А январские заказ-наряды не поменяются? У меня по ним чеки пробиты». Глеб: «Зависит от модели». Вера: «Вот и проверим — на заказ-наряде Елены от 14 января».',
      todo: [
        'Выберите вариант хранения цены (A, B, C) и способ удаления из каталога.',
        'Включайте события по одному и вместе — смотрите, что происходит со старым заказ-нарядом и кто из людей недоволен. Попробуйте все три варианта.',
        'Ответьте на 4 вопроса и выберите решение для «Искры».',
        'Нажмите «Проверить». Засчитывается от 80 %, если выбранное решение не ломает документы.'
      ],
      lookTitle: 'На что смотреть',
      look: `Заказ-наряд ЗН-1-0457 оплачен картой 14 января, сумма ${money(LAB_PAID)}, чек 54-ФЗ пробит. Бонусы начислены от работ (BR-11). Документ хранится 5 лет (BR-16). Любое изменение его суммы — расхождение с чеком и платежом.`
    }),
    blank: () => ({ d: 'A', del: 'hard', ev: {}, q1: [], q2: [], q3: [], q4: [], pick: '', pdel: '' }),
    reference: () => ({ d: 'B', del: 'soft', ev: { e1: true, e2: true, e3: true, e4: true }, q1: [1], q2: [1], q3: [1], q4: [2], pick: 'B', pdel: 'soft' }),
    render(el, ctx) {
      el.classList.add('mdsg-root');
      const a = ctx.ans; a.ev = a.ev || {}; a.d = a.d || 'A'; a.del = a.del || 'hard';
      const ro = ctx.readonly;
      el.innerHTML = `<div class="stack">
        <div class="stack tight"><div class="eyebrow">Проектное решение</div>
          <div class="row"><span class="small dim">Цена строки:</span>${ui.seg('d', LAB_DES.map(x => ({ v: x.v, t: x.t })), a.d, 'accent')}</div>
          <div class="small" data-dd></div>
          <div class="row"><span class="small dim">Удаление из каталога:</span>${ui.seg('del', [{ v: 'hard', t: 'Физическое (DELETE)' }, { v: 'soft', t: 'Мягкое (архив)' }], a.del, 'accent')}</div></div>
        <div class="mdsg-2">
          <div class="stack tight"><div class="eyebrow">События</div><div class="mdsg-evs">${LAB_EV.map((e, i) => `<button type="button" class="mdsg-ev" data-ev="${e.id}" aria-pressed="${!!a.ev[e.id]}" ${ro ? 'disabled' : ''}><span class="n">${i + 1}</span>${esc(e.t)}</button>`).join('')}</div>
            <div data-sql></div></div>
          <div class="stack tight"><div class="eyebrow">Старый заказ-наряд</div><div data-doc></div></div>
        </div>
        <div class="stack tight"><div class="eyebrow">Последствия</div><div class="mdsg-cons" data-cons></div></div>
        <div class="stack"><div class="eyebrow">Вопросы</div>${LAB_Q.map(q => `<div data-q="${q.k}"></div>`).join('')}
          <div class="card flat"><p><b>5. Ваше решение для «Искры»</b></p>
            <div class="row"><span class="small dim">Цена строки:</span>${ui.seg('pick', LAB_DES.map(x => ({ v: x.v, t: x.t })), a.pick, 'accent')}</div>
            <div class="row"><span class="small dim">Каталог:</span>${ui.seg('pdel', [{ v: 'hard', t: 'Удаляем физически' }, { v: 'soft', t: 'Архивируем' }], a.pdel, 'accent')}</div></div></div>
      </div>`;
      if (ro) TR.$$('[data-seg] button', el).forEach(b => { b.disabled = true; });
      function draw() {
        const r = labCalc(a.d, a.del, a.ev);
        TR.$('[data-dd]', el).textContent = LAB_DES.find(x => x.v === a.d).d;
        TR.$('[data-doc]', el).innerHTML = `<div class="mdsg-doc"><div class="hd"><b>ЗН-1-0457</b> · 14.01.2027 · станция Победы · Елена С., Kia Rio · оплачен картой</div>
          <table><tbody>${r.rows.map(x => `<tr class="${x.chg ? 'chg' : ''} ${x.blocked ? 'blk' : ''}"><td>${esc(x.l.name)}${x.archived ? ' <span class="small dim">(в архиве каталога)</span>' : ''}${x.blocked ? '<div class="small">DELETE заблокирован внешним ключом</div>' : ''}<div class="small dim">${x.l.kind}</div></td><td class="num">${x.chg ? `<span class="old">${money(x.l.price)}</span>` : ''}${money(x.shown)}</td></tr>`).join('')}
          <tr class="tot ${r.mismatch ? 'chg' : ''}"><td>Итого в документе${r.mismatch ? ` <span class="small" style="color:var(--bad)">≠ оплачено ${money(LAB_PAID)}</span>` : ''}</td><td class="num">${money(r.total)}</td></tr></tbody></table></div>
          <p class="small dim">Бонусы при оплате: ${bal(r.bonusPaid)}${r.bonusNow !== r.bonusPaid ? ` · если пересчитать по текущему документу — ${bal(r.bonusNow)}: Кирилл не сведёт отчёт` : ''}.</p>`;
        TR.$('[data-cons]', el).innerHTML = r.cons.map(c => `<div class="${c[0]}"><b class="who">${esc(c[1])}:</b> ${esc(c[2])}</div>`).join('') || '<div>Включите события слева.</div>';
        TR.$('[data-sql]', el).innerHTML = ui.code(a.d === 'A' ? '-- цена строки\nSELECT s.price FROM work_item i\nJOIN service s ON s.id = i.service_id' : a.d === 'B' ? '-- цена строки\nSELECT i.price FROM work_item i' : '-- цена строки и цена каталога на дату\nSELECT i.price, sp.price AS catalog\nFROM work_item i\nJOIN work_order w ON w.id = i.work_order_id\nJOIN service_price sp ON sp.service_id = i.service_id\n AND w.opened_at >= sp.valid_from\n AND (sp.valid_to IS NULL OR w.opened_at < sp.valid_to)', 'sql');
      }
      ui.onSeg(el, (n, v) => { if (ro) return; a[n] = v; ctx.save(); if (n === 'd' || n === 'del') draw(); if (n === 'pick' || n === 'pdel') ctx.decide(n === 'pick' ? 'Хранение цены строки' : 'Удаление из каталога', v); });
      TR.on(el, 'click', '[data-ev]', (e, b) => { if (ro) return; const id = b.dataset.ev; a.ev[id] = !a.ev[id]; b.setAttribute('aria-pressed', String(a.ev[id])); ctx.save(); draw(); });
      LAB_Q.forEach(q => ui.quiz(TR.$(`[data-q="${q.k}"]`, el), { q: q.q, options: q.options, value: a[q.k], readonly: ro, reveal: ctx.result || ro ? true : null, onChange: v => { a[q.k] = v; ctx.save(); } }));
      draw();
    },
    check(ans) {
      const notes = [];
      let pts = 0;
      LAB_Q.forEach(q => { const s = ui.quizScore(q, ans[q.k]); pts += s.score; const i = (ans[q.k] || [])[0]; notes.push({ ok: s.ok, html: `${esc(q.q.split('. ')[0])}. ${i == null ? 'Нет ответа.' : esc(q.options[i].why)}` }); });
      const pickOk = ans.pick === 'B' || ans.pick === 'C', delOk = ans.pdel === 'soft';
      notes.push({ ok: pickOk, html: !ans.pick ? 'Решение по хранению цены не выбрано.' : ans.pick === 'A' ? 'Вариант A переписывает оплаченные документы при каждом изменении прайса — для документов с чеком 54-ФЗ и сроком хранения 5 лет это недопустимо.' : ans.pick === 'B' ? 'B — так и сделано в «Искре»: work_item.price — копия на момент добавления. Достаточно для MVP; причину скидки можно добавить полем.' : 'C — самый информативный: и цена продажи, и история каталога. Дороже в разработке (таблица истории, правила «действует с — по»), но Ольга и Кирилл будут благодарны.' });
      notes.push({ ok: delOk, html: !ans.pdel ? 'Способ удаления из каталога не выбран.' : delOk ? 'Каталог — архивируем: на позиции ссылаются документы.' : 'Физическое удаление из справочника, на который ссылаются документы, либо запрещено внешним ключом, либо (с каскадом) уничтожает строки документов.' });
      const seen = Object.keys(ans.ev || {}).filter(k => ans.ev[k]).length;
      if (seen < 2) notes.push({ ok: 'warn', html: 'В лаборатории включено меньше двух событий — посмотрите последствия, это и есть материал для ответов.' });
      const score = (pts + (pickOk ? 1 : 0) + (delOk ? 1 : 0)) / 6;
      return {
        ok: score >= 0.8 && pickOk && delOk, score, notes,
        summary: `Вопросы: ${Math.round(pts)} из 4; решение: ${pickOk && delOk ? 'безопасное' : 'ломает документы'}.`,
        mentor: pickOk && delOk ? (score >= 0.8 ? null : 'Решение верное, но в вопросах есть промахи — включите события в варианте A и посмотрите, что происходит со строкой колодок.') : 'Включите в лаборатории вариант A и событие «прайс +10 %», потом «скидку». Посмотрите на итог документа и на реплику Ольги — это и есть ответ.'
      };
    },
    explain: `<p>Цена в строке документа — это <b>не дубль каталога, а отдельный факт</b>: «по чём продали в этот день». У каталога своя жизнь (подорожания, акции, архив), у документа — своя (зафиксирован, оплачен, хранится 5 лет). Поэтому в «Искре» <code>work_item.price</code> — копия на момент добавления, а <code>extra_offer.amount</code> — сумма, которую клиент согласовал.</p>
      <ul class="checks">
        <li><b>A (ссылка)</b> ломает всё сразу: сумма документа ≠ чек ≠ платёж, «выручка за январь» меняется в марте, скидку одной клиентке не дать.</li>
        <li><b>B (копия)</b> — минимально правильное решение, так и сделано. Чего не хватает: причины отклонения от прайса — добавьте поле <code>discount</code> или комментарий.</li>
        <li><b>C (копия + история цен)</b> — когда нужна аналитика «как менялся прайс» и ответы «сколько стоило 14 января». Шаблон «временная таблица» (valid_from / valid_to).</li>
        <li><b>Справочники, на которые ссылаются документы, не удаляют</b> — архивируют (<code>is_active</code>, <code>archived_at</code>). Внешний ключ — ваш друг: он не дал Марине сломать историю.</li>
      </ul>
      <p>Тот же принцип в жизни: в чеке магазина цена дня, а не «текущая цена молока». Источники: Фаулер, «Шаблоны корпоративных приложений» (Money, Temporal Property); Дейт, «Введение в системы баз данных», гл. о временных данных; Снодграсс, «Developing Time-Oriented Database Applications in SQL».</p>`,
    refNote: 'Засчитываются оба безопасных решения по цене — B и C. События лаборатории не оцениваются, но без них трудно ответить на вопросы.',
    report: ans => [...LAB_Q.map(q => `- ${q.q.split('. ')[0]}: ${((ans[q.k] || [])[0] != null) ? q.options[ans[q.k][0]].t : '—'}`), `- Решение: цена ${ans.pick || '—'}, каталог ${ans.pdel === 'soft' ? 'архив' : ans.pdel === 'hard' ? 'DELETE' : '—'}`].join('\n')
  };

  // =====================================================================
  // Теория 3. Статусы и история, удаление и 5 лет, аудит
  // =====================================================================
  const WO_EV = [
    { to: 'in_progress', t: 'Механик начал работы', by: 'mechanic · Ринат', dt: 15 },
    { to: 'waiting_approval', t: 'Отправлено предложение: колодки', by: 'master · Марина', dt: 40 },
    { to: 'in_progress', t: 'Елена согласовала в приложении', by: 'client · Елена', dt: 12 },
    { to: 'waiting_approval', t: 'Второе предложение: аккумулятор', by: 'master · Марина', dt: 35 },
    { to: 'in_progress', t: 'Не ответила 20 минут — Марина дозвонилась', by: 'master · Марина', dt: 38 },
    { to: 'ready', t: 'Работы завершены, «Готов» → push и SMS', by: 'system', dt: 55 },
    { to: 'closed', t: 'Машина выдана', by: 'master · Марина', dt: 70 }
  ];
  const woRu = s => TR.db.enumRu('work_order.status', s);
  const hhmm = m => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
  const DEL_MODES = {
    hard: { t: 'DELETE', rows: [
      ['client', 'строка удалена', 'bad'], ['car', 'удалена (или запрет — внешний ключ)', 'bad'], ['work_order', 'удалены каскадом — или удаление клиента запрещено базой', 'bad'], ['payment', 'исчезли из сверки Ольги Викторовны', 'bad']],
      note: ['bad', 'Нарушено BR-16', 'Заказ-наряды и платежи должны храниться 5 лет, «при удалении аккаунта документы остаются». Физическое удаление клиента либо запрещено внешними ключами, либо уничтожает документы.'] },
    soft: { t: 'Мягкое удаление (deleted_at)', rows: [
      ['client', 'deleted_at = 2027-02-10 12:00; ФИО и телефон на месте', 'warn'], ['car', 'на месте, госномер и VIN на месте', 'warn'], ['work_order', 'на месте', 'ok'], ['payment', 'на месте', 'ok']],
      note: ['warn', 'Документы целы, но персональные данные — тоже', 'Мягкое удаление — «скрыть, но хранить». Для документов и справочников — хорошо. Для клиента, который отозвал согласие, — мало: по 152-ФЗ персональные данные нужно уничтожить или обезличить (BR-15). И не забудьте фильтр «WHERE deleted_at IS NULL» во всех запросах.'] },
    anon: { t: 'Обезличивание + мягкое удаление', rows: [
      ['client', 'full_name = «Удалённый клиент #1042», phone и email очищены, deleted_at заполнено', 'ok'], ['car', 'plate и VIN очищены, марка и модель остались', 'ok'], ['work_order', 'на месте, ссылается на обезличенного клиента', 'ok'], ['payment', 'на месте — сверка и отчётность целы', 'ok']],
      note: ['ok', 'BR-15 и BR-16 одновременно', 'Документы живут 5 лет, но уже не указывают на человека. Подводный камень в схеме «Искры»: client.phone — NOT NULL и UNIQUE, car.plate — NOT NULL и UNIQUE. Очистить нельзя — нужно разрешить NULL или подставлять уникальную заглушку. Это вопрос к Глебу и строка в словаре данных.'] }
  };
  const AUDIT = [
    ['2027-01-14 17:02', 'extra_offer', '37', 'status', 'sent', 'approved', 'client:2214', 'app'],
    ['2027-01-14 17:20', 'extra_offer', '37', 'amount', '4 320.00', '3 900.00', 'employee:12', 'arm'],
    ['2027-01-14 18:05', 'work_order', '457', 'total', '—', '11 870.00', 'system', 'backend'],
    ['2027-01-15 09:11', 'client', '2214', 'phone', '(просмотр)', '—', 'employee:31', 'arm']
  ];
  const howState = {
    id: 'how-state', covers: ['offer', 'explain'], title: 'Как это работает: статус и история, удаление и хранение 5 лет, аудит', free: true, noReset: true,
    simple: {
      icon: '🕰️',
      plain: 'Статус — это «где объект сейчас». История — «как он туда попал»: кто, когда, из какого состояния в какое. Документы не удаляют — их закрывают, а людей из документов «стирают» обезличиванием. Аудит записывает, кто что поменял, на случай разбирательств.',
      analogy: 'Медицинская карта: диагноз сейчас — на обложке, но врачу нужны и все записи по датам. Карту не выбрасывают, даже если пациент сменил поликлинику.',
      tech: 'Статусная модель (конечный автомат) + журнал переходов (status history, event log); мягкое удаление (soft delete, deleted_at); обезличивание персональных данных (152-ФЗ, ст. 3 и 21); журнал аудита (audit trail: кто, что, когда, старое и новое значение). Kimball — медленно меняющиеся измерения; ISO/IEC 25010 — подхарактеристики «подотчётность» и «неотказуемость».'
    },
    lead: ui.brief({
      situation: 'Тимур Рашидович ставил цель: простой на согласовании 1 ч 40 мин → 20 минут. Вера: «А как мы через полгода узнаем, получилось ли? Если в заказ-наряде только поле status — никак. Поле знает, где мы сейчас, но не помнит, где мы были».',
      todo: [
        'Во вкладке «Статус и история» прокрутите день заказ-наряда событиями. Переключите «только поле» / «поле + история» и посмотрите, на какие вопросы есть ответ.',
        'Во вкладке «Удаление» удалите аккаунт Елены тремя способами.',
        'Во вкладке «Аудит» нажмите на строки журнала.'
      ],
      look: 'Хранить историю нужно не «на всякий случай», а под вопросы: «сколько ждали согласования», «кто перевёл в „Готов“», «кто изменил сумму после согласия». Нет вопроса — нет истории.'
    }),
    render(el) {
      el.classList.add('mdsg-root');
      const tabs = document.createElement('div'); el.appendChild(tabs);
      ui.tabs(tabs, [
        { id: 'h', t: 'Статус и история', render: rHist },
        { id: 'd', t: 'Удаление и 5 лет', render: rDel },
        { id: 'a', t: 'Аудит', render: rAudit }
      ]);
      el.insertAdjacentHTML('beforeend', `<div class="stack" style="margin-top:12px">
        ${ui.note('warn', 'Типичные ошибки', '<ul class="checks"><li class="bad">Только поле status — цель «20 минут вместо 1 ч 40 мин» нечем измерить.</li><li class="bad">История в логах сервера: через 14 дней логи ротируются, а Ольге нужно за год.</li><li class="bad">«Удаление» документа по просьбе клиента — нарушение BR-16. И наоборот, «мягкое удаление» клиента без обезличивания — нарушение 152-ФЗ.</li><li class="bad">Аудит «всего подряд»: журнал больше самой базы, а нужного (кто изменил сумму) там нет.</li></ul>')}
        <details class="more"><summary>Как об этом спрашивают на собеседовании</summary><div>
          <p><b>«Как хранить статусы?»</b> Текущий статус — полем с ограничением на допустимые значения (перечисление). Если важно, когда и кем менялся, — таблица истории переходов: сущность, из какого, в какой, когда, кто, комментарий. Если переходов один-два (отправлено → решено) — хватает полей-отметок времени.</p>
          <p><b>«Чем мягкое удаление отличается от архивации и обезличивания?»</b> Мягкое — пометка «удалено», данные целы. Архивация — перенос в отдельное хранилище. Обезличивание — удаление признаков, по которым можно узнать человека, при сохранении документа.</p>
          <p><b>«Чем история статусов отличается от аудита?»</b> История — бизнес-события, её видят пользователи и отчёты. Аудит — технический след любых изменений важных полей, для расследований и безопасности.</p>
        </div></details></div>`);

      function rHist(box) {
        let n = 0, mode = 'hist';
        box.innerHTML = `<div class="stack">
          <div class="row"><span class="small dim">Модель:</span>${ui.seg('h', [{ v: 'field', t: 'Только поле status' }, { v: 'hist', t: 'Поле + таблица истории' }], mode, 'accent')}</div>
          <div class="row"><button type="button" class="btn sm primary" data-h="next">Следующее событие →</button><button type="button" class="btn sm ghost" data-h="reset">Сначала</button><span class="small dim" data-cnt></span></div>
          <div class="mdsg-2"><div class="stack tight"><div class="eyebrow">work_order</div><div data-row></div><div data-tbl></div></div>
          <div class="stack tight"><div class="eyebrow">Вопросы Тимура и Ольги</div><div class="stack tight" data-qs></div></div></div></div>`;
        function draw() {
          let t = 9 * 60, st = 'open';
          const hist = [{ from: '—', to: 'open', at: hhmm(t), by: 'master · Марина' }];
          for (let i = 0; i < n; i++) { const e = WO_EV[i]; t += e.dt; hist.push({ from: st, to: e.to, at: hhmm(t), by: e.by, t: e.t }); st = e.to; }
          TR.$('[data-cnt]', box).textContent = n < WO_EV.length ? `следующее: ${WO_EV[n].t}` : 'день закончен';
          TR.$('[data-row]', box).innerHTML = ui.table(['number', 'status', 'updated_at'], [['ЗН-1-0457', `<code>${st}</code> <span class="small dim">${esc(woRu(st))}</span>`, hist[hist.length - 1].at]]);
          TR.$('[data-tbl]', box).innerHTML = mode === 'hist' ? `<div class="eyebrow">work_order_status_history</div>${ui.table(['from', 'to', 'changed_at', 'changed_by'], hist.map(h => [`<code>${h.from}</code>`, `<code>${h.to}</code>`, h.at, esc(h.by)]))}` : '<p class="small dim">Истории нет: каждое событие перезаписывает поле. Предыдущее значение потеряно.</p>';
          let wait = 0, waits = 0; for (let i = 1; i < hist.length; i++) if (hist[i - 1].to === 'waiting_approval') { wait += WO_EV[i - 1].dt; waits++; }
          const readyBy = hist.find(h => h.to === 'ready');
          const qs = [
            ['Сколько всего машина ждала согласования?', mode === 'hist' ? `${wait} мин за ${waits} ${TR.plural(waits, 'раз', 'раза', 'раз')}` : null],
            ['Сколько раз уходили в «Ждёт согласования»?', mode === 'hist' ? `${hist.filter(h => h.to === 'waiting_approval').length}` : null],
            ['Кто и когда перевёл в «Готов»?', mode === 'hist' ? (readyBy ? `${esc(readyBy.by)}, ${readyBy.at}` : 'ещё не было') : null],
            ['В каком статусе заказ-наряд сейчас?', `${esc(woRu(st))}`]
          ];
          TR.$('[data-qs]', box).innerHTML = qs.map(q => `<div class="card flat mdsg-q"><div class="small"><b>${esc(q[0])}</b></div><div class="ans">${q[1] == null ? '<span style="color:var(--bad)">Нечем ответить — значение перезаписано.</span>' : q[1]}</div></div>`).join('')
            + (mode === 'hist' ? '' : ui.note('info', 'Но иногда полей хватает', 'У предложения доп. работ всего один переход: «Отправлено» → итог. Его история целиком умещается в полях sent_at, decided_at, decided_by. Отдельная таблица нужна там, где статус ходит туда-обратно, как у заказ-наряда.'));
        }
        ui.onSeg(box, (k, v) => { mode = v; draw(); });
        TR.on(box, 'click', '[data-h]', (e, b) => { n = b.dataset.h === 'reset' ? 0 : Math.min(WO_EV.length, n + 1); draw(); });
        draw();
      }

      function rDel(box) {
        let mode = 'hard';
        box.innerHTML = `<div class="stack">${ui.say('elena', 'Я переезжаю в Москву. Удалите, пожалуйста, мой аккаунт и все мои данные.')}
          <div class="row"><span class="small dim">Как удаляем:</span>${ui.seg('d', Object.keys(DEL_MODES).map(k => ({ v: k, t: DEL_MODES[k].t })), mode, 'accent')}</div><div data-out></div></div>`;
        function draw() {
          const m = DEL_MODES[mode];
          TR.$('[data-out]', box).innerHTML = ui.table(['Таблица', 'Что стало', ''], m.rows.map(r => [`<code>${r[0]}</code>`, esc(r[1]), ui.status(r[2] === 'ok' ? 'норма' : r[2] === 'warn' ? 'риск' : 'нарушение', r[2])])) + ui.note(m.note[0], m.note[1], m.note[2])
            + (mode === 'anon' ? ui.code("UPDATE client SET full_name = 'Удалённый клиент #' || id,\n  phone = NULL, email = NULL, deleted_at = CURRENT_TIMESTAMP\nWHERE id = 2214;  -- нужен phone без NOT NULL!\nUPDATE car SET plate = NULL, vin = NULL WHERE client_id = 2214;", 'sql') : '');
        }
        ui.onSeg(box, (k, v) => { mode = v; draw(); });
        draw();
      }

      function rAudit(box) {
        let cur = 1;
        const WHY = [
          'Обычная смена статуса клиентом. Она уже есть в самом предложении (decided_at, decided_by) — в аудите дублируется, это нормально для ключевых событий.',
          'Тревожная строка: сумму предложения изменили <b>после</b> согласия клиента (status уже approved). Без аудита это не обнаружить. Правило в требования: после решения клиента amount не меняется — новое предложение.',
          'Система посчитала total при «Готов». Видно, что это не человек, — важно для разбора расхождений.',
          'Просмотр телефона клиента сотрудником — аудит доступа к персональным данным (BR-15). Его ведут для ПДн, а не для каждого поля.'
        ];
        box.innerHTML = `<div class="stack"><p>Журнал аудита — одна общая таблица <code>audit_log</code>: когда, таблица, строка, поле, старое и новое значение, кто, откуда. Пишется бэкендом автоматически для важных полей: деньги, статусы, персональные данные.</p>
          <div class="mdsg-wrap"><table class="mdsg-mx mdsg-log" data-t></table></div><div data-w></div></div>`;
        function draw() {
          TR.$('[data-t]', box).innerHTML = `<thead><tr>${['changed_at', 'table', 'row', 'field', 'old', 'new', 'actor', 'source'].map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${AUDIT.map((r, i) => `<tr class="${i === cur ? 'on' : ''}" data-a="${i}" style="cursor:pointer">${r.map((c, j) => `<td class="${i === cur ? 'hit' : ''} ${j === 0 ? 't' : ''}">${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody>`;
          TR.$('[data-w]', box).innerHTML = `<div class="card flat"><p>${WHY[cur]}</p></div>`;
        }
        TR.on(box, 'click', '[data-a]', (e, b) => { cur = +b.dataset.a; draw(); });
        draw();
      }
    }
  };

  // =====================================================================
  // Практика 4. Конструктор таблицы extra_offer + история
  // =====================================================================
  const TYPES = ['INTEGER', 'DECIMAL(10,2)', 'FLOAT', 'VARCHAR', 'DATETIME', 'BOOLEAN', 'BLOB'];
  const OF = [
    { n: 'id', ru: 'Идентификатор', fixed: true, inc: true, type: ['INTEGER'], nul: [false], why: 'Первичный ключ.' },
    { n: 'work_order_id', ru: 'Заказ-наряд (FK)', inc: true, type: ['INTEGER'], nul: [false], why: 'Без заказ-наряда предложения не бывает — NOT NULL, внешний ключ.' },
    { n: 'found_by', ru: 'Кто нашёл проблему (механик, FK employee)', inc: true, type: ['INTEGER'], nul: [true, false], why: 'BR-7: проблему находит механик. NULL допустим, если заметил сам мастер при приёмке.' },
    { n: 'created_by', ru: 'Кто сформировал предложение (мастер, FK employee)', inc: true, type: ['INTEGER'], nul: [false], why: 'BR-7: цену формирует мастер — он отвечает за сумму. Обязательно.' },
    { n: 'description', ru: 'Что нашли и что предлагаем', inc: true, type: ['VARCHAR'], nul: [false], why: 'Без описания согласие не информированное (BR-6). VARCHAR(500).' },
    { n: 'amount', ru: 'Сумма, ₽', inc: true, type: ['DECIMAL(10,2)', 'INTEGER'], nul: [false], why: 'Деньги — DECIMAL(10,2) или целые копейки (тогда имя amount_kop). Никогда FLOAT.' },
    { n: 'photo_url', ru: 'Ссылка на фото в хранилище', inc: true, type: ['VARCHAR'], nul: [true], why: 'Фото желательно, но не всегда возможно — NULL. Файл в хранилище 6 месяцев.' },
    { n: 'photo', ru: 'Само фото файлом в базе', inc: false, type: ['BLOB'], nul: [true], why: 'Фото до 10 МБ в базе раздует резервные копии и замедлит восстановление (RTO ≤ 1 ч). Файл — в хранилище, в базе — ссылка.' },
    { n: 'sent_at', ru: 'Когда отправлено клиенту', inc: true, type: ['DATETIME'], nul: [false], why: 'От него считаются 20 минут BR-8 — обязательно.' },
    { n: 'status', ru: 'Статус: sent / approved / rejected / expired', inc: true, type: ['VARCHAR'], nul: [false], why: 'Перечисление с CHECK, по умолчанию sent. Обязательно.' },
    { n: 'is_approved', ru: 'Согласовано (да/нет)', inc: false, type: ['BOOLEAN'], nul: [true], why: 'Дублирует status и не различает «отклонено» и «истекло». Два источника правды разойдутся.' },
    { n: 'decided_at', ru: 'Когда решено', inc: true, type: ['DATETIME'], nul: [true], why: 'Пока решения нет — NULL. Вместе с sent_at даёт «сколько ждали ответа».' },
    { n: 'decided_by', ru: 'Как решено: client / phone / auto', inc: true, type: ['VARCHAR'], nul: [true], why: 'Перечисление; NULL, пока не решено (и для «Истекло»). Это доказательство согласия по BR-6.' },
    { n: 'called_at', ru: 'Когда мастер позвонил клиенту', inc: 'opt', type: ['DATETIME'], nul: [true], why: 'По желанию: нужен, если Тимур хочет статистику дозвона (BR-8, «38 % не берут трубку»).' },
    { n: 'client_phone', ru: 'Телефон клиента (для звонка)', inc: false, type: ['VARCHAR'], nul: [true], why: 'Копия персональных данных: телефон берётся по связи work_order → car → client. При обезличивании её забудут (BR-15).' },
    { n: 'order_total', ru: 'Сумма заказ-наряда на момент отправки', inc: false, type: ['DECIMAL(10,2)'], nul: [true], why: 'Денормализация без вопроса, на который она отвечает. Сумма заказ-наряда — в work_order.total.' }
  ];
  const HIST_Q = { q: 'Нужна ли отдельная таблица истории статусов?', options: [
    { t: 'Да, для каждой таблицы со статусом — всегда', why: 'Не всегда: история нужна под вопросы. У предложения один переход — его покрывают поля.' },
    { t: 'Для extra_offer хватает полей sent_at / decided_at / decided_by — переход один. А для work_order, где статус ходит туда-обратно, нужна work_order_status_history', ok: true, why: 'Именно: цель «простой 20 минут» меряется по истории заказ-наряда, а у предложения всё видно из его полей.' },
    { t: 'Нет: достаточно поля status, остальное — в логах сервера', why: 'Логи ротируются и не предназначены для отчётов Тимура и Ольги.' }] };
  const HIST_COLS = { q: 'Какие поля нужны в work_order_status_history?', multi: true, options: [
    { t: 'work_order_id', ok: true, why: 'Чья история.' },
    { t: 'from_status и to_status', ok: true, why: 'Из какого в какой — иначе не посчитать время в каждом статусе.' },
    { t: 'changed_at', ok: true, why: 'Когда — основа всех метрик времени.' },
    { t: 'changed_by (сотрудник, клиент или система)', ok: true, why: 'Кто — для разборов и метрик по мастерам.' },
    { t: 'comment (причина)', ok: true, why: 'Почему: «клиент не ответил, дозвонились». Необязательное, но полезное.' },
    { t: 'client_full_name', why: 'Персональные данные в истории — лишняя копия ПДн (BR-15).' },
    { t: 'current_total (сумма на момент перехода)', why: 'Не нужна для вопросов истории статусов; сумма — в строках и total.' }] };
  function ofEval(a) {
    const f = (a && a.f) || {};
    const rows = OF.map(x => {
      const s = f[x.n] || {}, inc = x.fixed ? true : !!s.inc;
      if (x.fixed) return { x, s, st: 'ok', pts: 1 };
      if (x.inc === 'opt') return { x, s, st: inc ? (x.type.includes(s.type) ? 'ok' : 'warn') : 'ok', pts: inc && !x.type.includes(s.type) ? 0.5 : 1, msg: inc && !x.type.includes(s.type) ? `тип ${s.type || 'не выбран'} — нужен ${x.type[0]}` : '' };
      if (!x.inc) return inc ? { x, s, st: 'bad', pts: 0, msg: 'лишнее поле' } : { x, s, st: 'ok', pts: 1 };
      if (!inc) return { x, s, st: 'bad', pts: 0, msg: 'поле нужно' };
      const tOk = x.type.includes(s.type), nOk = x.nul.includes(!!s.nul);
      return { x, s, st: tOk && nOk ? 'ok' : 'warn', pts: (tOk ? 0.5 : 0) + (nOk ? 0.5 : 0), msg: [tOk ? '' : `тип ${s.type || 'не выбран'}`, nOk ? '' : (s.nul ? 'должно быть обязательным (NOT NULL)' : 'должно допускать NULL')].filter(Boolean).join(', ') };
    });
    const fs = rows.reduce((t, r) => t + r.pts, 0) / rows.length;
    const amt = f.amount || {}, crit = [];
    if (amt.type === 'FLOAT') crit.push('Сумма во FLOAT — деньги потеряют копейки.');
    if (!amt.inc) crit.push('Нет суммы — клиент согласует неизвестно что.');
    if (!(f.status || {}).inc) crit.push('Нет статуса — непонятно, согласовано ли.');
    if ((f.client_phone || {}).inc) crit.push('Копия телефона клиента — лишние персональные данные.');
    const q1 = ui.quizScore(HIST_Q, a && a.h1), q2 = ui.quizScore(HIST_COLS, a && a.h2);
    return { rows, fs, crit, q1, q2, score: 0.6 * fs + 0.2 * q1.score + 0.2 * q2.score };
  }
  function ofDDL(a) {
    const f = (a && a.f) || {};
    const ls = OF.filter(x => x.fixed || (f[x.n] || {}).inc).map(x => {
      const s = f[x.n] || {};
      if (x.fixed) return '  id INTEGER PRIMARY KEY';
      let t = s.type || '???'; if (t === 'VARCHAR') t = x.n === 'description' ? 'VARCHAR(500)' : x.n === 'photo_url' ? 'VARCHAR(300)' : x.n === 'status' ? 'VARCHAR(10)' : x.n === 'decided_by' ? 'VARCHAR(8)' : 'VARCHAR(100)';
      let l = `  ${x.n} ${t}${s.nul ? '' : ' NOT NULL'}`;
      if (x.n === 'status') l += " DEFAULT 'sent'\n    CHECK (status IN ('sent','approved','rejected','expired'))";
      if (x.n === 'decided_by') l += "\n    CHECK (decided_by IN ('client','phone','auto'))";
      if (x.n === 'work_order_id') l += ' REFERENCES work_order(id)';
      if (x.n === 'found_by' || x.n === 'created_by') l += ' REFERENCES employee(id)';
      return l;
    });
    return `CREATE TABLE extra_offer (\n${ls.join(',\n')}\n);`;
  }
  const offerTask = {
    id: 'offer', title: 'Спроектируйте таблицу extra_offer и историю статусов',
    simple: howState.simple,
    lead: ui.brief({
      situation: 'Глеб: «Пиши таблицу. Я по ней сделаю миграцию, Лиза — тесты. Только без „на всякий случай“: каждое поле должно на что-то отвечать». Стажёр накидал 16 кандидатов — часть нужна, часть вредна.',
      todo: [
        'Для каждого кандидата решите: включить (✓) или нет. Для включённых выберите тип и отметьте, может ли поле быть пустым (NULL).',
        'Справа вживую собирается CREATE TABLE — читайте его глазами Глеба.',
        'Ответьте на два вопроса про историю статусов.',
        'Нажмите «Проверить». Засчитывается от 80 %, если деньги не во FLOAT и нет лишних персональных данных.'
      ],
      lookTitle: 'Подсказка',
      look: 'Обязательное поле (NOT NULL) — то, без чего строка не имеет смысла <i>в момент создания</i>. Решение клиента появится позже — значит, decided_at при создании пусто. Деньги — DECIMAL или копейки. Файлы — ссылкой. Копии чужих данных — только если вы можете назвать вопрос, на который они отвечают.'
    }),
    blank: () => ({ f: {}, h1: [], h2: [] }),
    reference: () => ({ f: Object.fromEntries(OF.filter(x => x.inc && !x.fixed).map(x => [x.n, { inc: x.inc === true, type: x.type[0], nul: x.nul[0] }])), h1: [1], h2: [0, 1, 2, 3, 4] }),
    render(el, ctx) {
      el.classList.add('mdsg-root');
      const a = ctx.ans; a.f = a.f || {};
      const ro = ctx.readonly, ev = ctx.result ? ofEval(a) : null;
      el.innerHTML = `<div class="stack"><div class="mdsg-2"><div class="mdsg-fl" data-fl></div><div class="stack tight"><div class="eyebrow">Что получит Глеб</div><div data-ddl></div></div></div>
        <div data-h1></div><div data-h2></div></div>`;
      function drawDDL() { TR.$('[data-ddl]', el).innerHTML = ui.code(ofDDL(a), 'sql'); }
      function draw() {
        TR.$('[data-fl]', el).innerHTML = OF.map(x => {
          const s = a.f[x.n] || {}, inc = x.fixed || !!s.inc, r = ev && ev.rows.find(y => y.x.n === x.n);
          return `<div class="mdsg-fr ${inc ? '' : 'off'} ${r ? r.st : ''}">
            <button type="button" class="mdsg-inc" data-inc="${x.n}" aria-pressed="${inc}" aria-label="Включить поле ${x.n}" ${ro || x.fixed ? 'disabled' : ''}>${inc ? '✓' : '+'}</button>
            <div class="nm"><code>${x.n}</code><small>${esc(x.ru)}</small></div>
            <div class="ty">${x.fixed ? '<code class="small">INTEGER PK</code>' : `<select data-ty="${x.n}" aria-label="Тип поля ${x.n}" ${ro || !inc ? 'disabled' : ''}><option value="">тип…</option>${TYPES.map(t => `<option ${s.type === t ? 'selected' : ''}>${t}</option>`).join('')}</select>`}</div>
            <div class="nl">${x.fixed ? '' : `<label><input type="checkbox" data-nl="${x.n}" ${s.nul ? 'checked' : ''} ${ro || !inc ? 'disabled' : ''} aria-label="Поле ${x.n} может быть пустым"> NULL</label>`}</div>
            ${r && (r.st !== 'ok' || ro) ? `<div class="why">${r.msg ? `<b>${esc(r.msg)}.</b> ` : ''}${esc(x.why)}</div>` : ro ? `<div class="why">${esc(x.why)}</div>` : ''}
          </div>`;
        }).join('');
        drawDDL();
      }
      TR.on(el, 'click', '[data-inc]', (e, b) => { if (ro) return; const n = b.dataset.inc, s = a.f[n] = a.f[n] || {}; s.inc = !s.inc; ctx.save(); draw(); });
      el.addEventListener('change', e => {
        if (ro) return;
        const t = e.target;
        if (t.dataset.ty) { (a.f[t.dataset.ty] = a.f[t.dataset.ty] || {}).type = t.value; ctx.save(); drawDDL(); }
        if (t.dataset.nl) { (a.f[t.dataset.nl] = a.f[t.dataset.nl] || {}).nul = t.checked; ctx.save(); drawDDL(); }
      });
      draw();
      ui.quiz(TR.$('[data-h1]', el), Object.assign({}, HIST_Q, { value: a.h1, readonly: ro, reveal: ctx.result || ro ? true : null, onChange: v => { a.h1 = v; ctx.save(); } }));
      ui.quiz(TR.$('[data-h2]', el), Object.assign({}, HIST_COLS, { value: a.h2, readonly: ro, reveal: ctx.result || ro ? true : null, onChange: v => { a.h2 = v; ctx.save(); } }));
    },
    check(ans) {
      const r = ofEval(ans), notes = [];
      notes.push({ ok: r.fs >= 0.85 ? true : r.fs >= 0.65 ? 'warn' : false, html: `Поля: ${Math.round(r.fs * 100)} % верно (состав, тип, обязательность).` });
      r.crit.forEach(c => notes.push({ ok: false, html: c }));
      r.rows.filter(x => x.st !== 'ok').forEach(x => notes.push({ ok: x.st === 'warn' ? 'warn' : false, html: `<code>${x.x.n}</code>: ${esc(x.msg)}. ${esc(x.x.why)}` }));
      notes.push({ ok: r.q1.ok, html: r.q1.ok ? 'История: верно — у предложения хватает полей, у заказ-наряда нужна таблица истории.' : 'История: подумайте, сколько переходов у предложения и сколько у заказ-наряда.' });
      notes.push({ ok: r.q2.ok ? true : r.q2.score >= 0.6 ? 'warn' : false, html: r.q2.ok ? 'Поля истории выбраны верно.' : 'Поля истории: нужны «чья, из какого, в какой, когда, кто» (+ причина); персональные данные и суммы туда не кладут.' });
      const ok = r.score >= 0.8 && !r.crit.length;
      return {
        ok, score: r.crit.length ? Math.min(r.score, 0.7) : r.score, notes,
        summary: `Итог ${Math.round(r.score * 100)} %${r.crit.length ? ', есть критичные ошибки' : ''}.`,
        mentor: ok ? null : r.crit.length ? 'Сначала критичное: деньги — не FLOAT, телефон клиента — не копируем. Остальное доведём.' : 'Пройдитесь по полям с вопросом «есть ли значение в момент создания предложения?». Если нет — поле допускает NULL.'
      };
    },
    explain: `<p>Хорошая таблица <code>extra_offer</code> отвечает ровно на вопросы сценария и правил:</p>
      <ul class="checks">
        <li><b>Что и сколько</b>: description, amount DECIMAL(10,2) — обязательно (BR-6: согласие должно быть информированным).</li>
        <li><b>Кто</b>: found_by (механик) и created_by (мастер) — BR-7 разделяет, кто нашёл и кто отвечает за цену. В текущей схеме «Искры» этих полей нет — это предложение аналитика в журнал изменений модели.</li>
        <li><b>Когда и чем закончилось</b>: sent_at (обязательно, от него таймер BR-8), status с CHECK и по умолчанию sent, decided_at и decided_by — пустые до решения.</li>
        <li><b>Чего нет</b>: файла фото (ссылка), булева is_approved (второй источник правды рядом со status), телефона клиента (копия ПДн), суммы заказ-наряда (чужой факт).</li>
      </ul>
      <p>История: предложение живёт один переход — его «история» и есть поля sent_at/decided_at/decided_by. Заказ-наряд ходит между «В работе» и «Ждёт согласования» несколько раз за визит — без <code>work_order_status_history</code> цель «простой 20 минут» не измерить. Источники: Вигерс, гл. 13 (словарь и модель данных); Фаулер, «Event Sourcing» и «Audit Log»; 152-ФЗ о минимизации персональных данных.</p>`,
    refNote: 'called_at можно включать или нет; found_by — с NULL или без; сумма — DECIMAL(10,2) или INTEGER в копейках.',
    report: ans => { const f = ans.f || {}; return OF.filter(x => !x.fixed && (f[x.n] || {}).inc).map(x => `- ${x.n} ${(f[x.n] || {}).type || '?'}${(f[x.n] || {}).nul ? ' NULL' : ' NOT NULL'}`).join('\n') + `\n- История: ${(ans.h1 || []).map(i => HIST_Q.options[i].t).join('') || '—'}`; }
  };

  // =====================================================================
  // Практика 5. Объяснить своими словами
  // =====================================================================
  const EX_RUBRIC = [
    'Деньги: DECIMAL(10,2) или целые копейки, не FLOAT; правило округления (бонусы — вниз до целого)',
    'Цена в строке заказ-наряда и сумма предложения — копия на момент добавления/согласия; каталог меняется, документы — нет; справочник архивируют, не удаляют',
    'Статусы: поле с перечислением + время и «кем решено»; для заказ-наряда — история переходов, чтобы измерить простой на согласовании',
    'Удаление: заказ-наряды, платежи и предложения не удаляются 5 лет (BR-16); клиента при удалении аккаунта обезличиваем (BR-15)',
    'Время в UTC с показом в поясе станции; аудит изменений денег, статусов и доступа к ПДн'
  ];
  const EX_REF = 'Глеб, Ольга Викторовна, коротко о решениях по данным для согласования доп. работ.\n\n1. Деньги. Все суммы — DECIMAL(10,2) (или целые копейки), не FLOAT: иначе копейки не сойдутся со сверкой ЮKassa. Бонусы по BR-11 считаем от работ и округляем вниз до целого балла — это правило записываем в словарь данных.\n\n2. Цены. В строке заказ-наряда (work_item.price) и в предложении (extra_offer.amount) хранится цена на момент добавления и согласия — копия, а не ссылка на каталог. Поднимем прайс 1 марта — январские документы, чеки и платежи останутся как были. Услуги из каталога не удаляем, а переводим в архив: на них ссылаются документы.\n\n3. Статусы. У предложения — поле status (sent, approved, rejected, expired) и поля sent_at, decided_at, decided_by: этого достаточно, переход один, и это доказательство согласия клиента (BR-6). У заказ-наряда добавляем таблицу истории статусов (кто, когда, из какого в какой) — по ней Тимур Рашидович увидит, сократился ли простой на согласовании с 1 ч 40 мин до 20 минут.\n\n4. Удаление и хранение. Заказ-наряды, платежи и предложения не удаляются минимум 5 лет (BR-16), отмена — это статус. Если клиент удаляет аккаунт, мы обезличиваем его персональные данные (ФИО, телефон, email, госномер, VIN — BR-15), а документы остаются. Для этого client.phone и car.plate должны допускать пустое значение — Глеб, это изменение схемы.\n\n5. Время и аудит. Моменты времени храним в UTC, показываем по времени станции (Казань, UTC+3). Изменения сумм и статусов и просмотр персональных данных пишем в журнал аудита: кто, когда, старое и новое значение.';
  const explainTask = {
    id: 'explain', title: 'Объясните Глебу и Ольге Викторовне решения по данным',
    lead: ui.brief({
      situation: 'Конец дня. Ольга Викторовна: «Мне не нужны ваши таблицы, мне нужно понять: копейки сойдутся? Прошлогодние документы не поменяются? Что будет, если клиент удалит аккаунт?» Глеб: «А мне — список решений, чтобы я не переспрашивал». Вера: «Одно письмо на двоих. Без жаргона, но точно».',
      todo: [
        'Напишите сообщение от 300 символов: деньги, цены в документах, статусы и история, удаление и хранение, время и аудит.',
        'Термины — с пояснением: Ольга Викторовна не обязана знать слово «денормализация».',
        'Нажмите «Проверить с Верой (Claude)» или «Сверить с эталоном самому» и отметьте раскрытые пункты. Засчитывается от 60 %.'
      ],
      lookTitle: 'На что опереться',
      look: 'BR-6 (согласие), BR-11 (бонусы), BR-15 (персональные данные), BR-16 (5 лет). Решения из лаборатории: цена строки — копия, каталог — архив. Из конструктора: extra_offer со статусом и отметками времени, история статусов у заказ-наряда.'
    }),
    blank: () => ({ j: {} }),
    reference: () => ({ j: { text: EX_REF, self: EX_RUBRIC.map(() => true) } }),
    render(el, ctx) {
      el.classList.add('mdsg-root');
      el.insertAdjacentHTML('beforeend', ui.say('olga', 'Копейки сойдутся? Январские документы не поменяются? И что будет, если клиент удалит аккаунт, — у меня ведь всё должно храниться пять лет.'));
      const j = document.createElement('div'); j.style.marginTop = '12px'; el.appendChild(j);
      ui.justify(j, {
        id: 'mdsg-explain', q: 'Сообщение Глебу и Ольге Викторовне: решения по данным',
        qPlain: 'Объясните разработчику и главному бухгалтеру сети автосервисов решения по хранению данных для согласования доп. работ: тип для денег и округление, цена в строке документа как копия на момент продажи и архив каталога, статусы и история переходов, хранение документов 5 лет и обезличивание клиента при удалении аккаунта, время в UTC и журнал аудита.',
        rubric: EX_RUBRIC, reference: EX_REF, value: ctx.ans.j, readonly: ctx.readonly, minLen: 300,
        placeholder: 'Глеб, Ольга Викторовна, коротко о решениях по данным…',
        onChange: v => { ctx.ans.j = v; ctx.save(); ctx.decide('Решения по данным (письмо)', v.text || ''); }
      });
    },
    check(ans) {
      const s = ui.justifyScore(ans && ans.j);
      return {
        ok: s >= 0.6, score: s,
        summary: s ? `Оценка сообщения: ${Math.round(s * 100)} %.` : 'Напишите сообщение (от 300 символов) и проверьте его с Верой или сверьте с эталоном сами.',
        notes: s && s < 0.6 ? [{ ok: false, html: 'Бухгалтеру важны три ответа: копейки сходятся (тип денег), прошлое не меняется (копия цены), документы хранятся 5 лет даже после удаления аккаунта (обезличивание). Разработчику — конкретные поля и правила.' }] : []
      };
    },
    explain: '<p>Хорошее объяснение решений по данным — это <b>список решений с причинами</b>, а не описание таблиц. Каждый пункт отвечает на чей-то вопрос: Ольги (копейки, прошлое, хранение), Тимура (как измерим простой), Глеба (какие поля и ограничения), Лизы (что проверять).</p><p>Обратите внимание на «подводный камень», который всплыл сегодня: в текущей схеме <code>client.phone</code> и <code>car.plate</code> обязательны и уникальны — обезличить клиента нельзя без изменения схемы. Такие находки и есть работа аналитика данных: их записывают в журнал изменений модели. Во вторник всё это ляжет в словарь данных — для Глеба и Лизы.</p>',
    report: ans => (ans && ans.j && ans.j.text) ? ans.j.text : '—'
  };

  // =====================================================================
  TR.stage({
    id: ID,
    when: 'пятница, 29 января, 14:00 · данные для согласования доп. работ',
    intro: [
      { who: 'gleb', html: 'Use Case есть, BPMN есть, ERD на доске есть. Мне в понедельник писать миграцию. Что храним по согласованию доп. работ, какие поля, кто что пишет — и чтобы без «потом добавим».' },
      { who: 'olga', html: 'И сразу от меня: суммы должны сходиться с ЮKassa до копейки, а документы хранятся пять лет. Даже если клиент удалит приложение.' },
      { who: 'vera', html: 'Сегодня проектируем данные под задачу. Вычитаем сущности из сценария, соберём CRUD-матрицу, проверим в лаборатории, что будет со старыми заказ-нарядами, когда подорожает каталог, — и нарисуем таблицу extra_offer так, чтобы Глебу не пришлось переспрашивать.' },
      { who: 'timur', html: 'И чтобы я через полгода увидел: машина на подъёмнике стоит 20 минут, а не час сорок. Цифрой.' }
    ],
    facts: ['F-extra-law', 'F-extra-who', 'F-extra-timeout', 'F-corp', 'F-price-from', 'F-bonus', 'F-pd', 'F-retention'],
    glossary: [
      { term: 'Сущность', simple: 'То, о чём храним данные и что существует во многих экземплярах: клиент, заказ-наряд, предложение.', tech: 'Entity: класс объектов предметной области с идентификатором и атрибутами; в физической модели — таблица (Чен, 1976).' },
      { term: 'Атрибут', simple: 'Свойство сущности: сумма, описание, дата.', tech: 'Attribute: характеристика сущности; в таблице — столбец с типом и ограничениями.' },
      { term: 'CRUD-матрица', simple: 'Таблица: кто какие данные создаёт, читает, меняет и удаляет.', tech: 'CRUD (Create, Read, Update, Delete) matrix: данные × роли (или функции); проверка полноты требований и основа ролевой модели доступа (BABOK v3).' },
      { term: 'DECIMAL', simple: 'Точный тип для денег: хранит десятичные цифры, как бухгалтер.', tech: 'DECIMAL(p,s)/NUMERIC — число с фиксированной точкой: p цифр, из них s после запятой. В отличие от FLOAT (IEEE 754) не даёт двоичной погрешности.' },
      { term: 'UTC', simple: 'Всемирное время «без пояса», от которого отсчитывают все остальные. Казань — UTC+3.', tech: 'Coordinated Universal Time. Моменты хранятся в UTC (timestamptz в PostgreSQL), отображаются в поясе станции или пользователя.' },
      { term: 'Снимок значения (копия на момент)', simple: 'Цена, которая была в день продажи, записанная в сам документ.', tech: 'Snapshot / historical attribute: значение копируется в документ при операции и дальше не зависит от справочника (work_item.price).' },
      { term: 'Денормализация', simple: 'Сознательно храним одно и то же дважды — ради скорости.', tech: 'Избыточное хранение производных данных (work_order.total, client.bonus_balance) с указанием источника истины, правила обновления и сверки.' },
      { term: 'История статусов', simple: 'Список «кто, когда, из какого статуса в какой» перевёл объект.', tech: 'Status history / журнал переходов конечного автомата; позволяет измерять время в статусах.' },
      { term: 'Мягкое удаление', simple: 'Не стираем строку, а помечаем «удалена».', tech: 'Soft delete: поле deleted_at или is_active; запросы фильтруют помеченные строки. Не заменяет обезличивание ПДн.' },
      { term: 'Обезличивание', simple: 'Убираем из данных всё, по чему можно узнать человека, а документ оставляем.', tech: 'Действия, после которых нельзя определить принадлежность ПДн субъекту без дополнительной информации (152-ФЗ, ст. 3).' },
      { term: 'Журнал аудита', simple: 'Запись, кто что изменил или посмотрел, и что было до.', tech: 'Audit trail: время, объект, поле, старое и новое значение, автор, источник. Ведут для денег, статусов и доступа к ПДн.' }
    ],
    outro: 'Сценарий согласования превратился в данные: одна новая таблица extra_offer со ссылками на заказ-наряд, механика и мастера, CRUD-матрица без «удалить» у документов, цена в строке — копия, каталог — архив, у заказ-наряда — история статусов, по которой Тимур Рашидович увидит свои 20 минут. Нашли и подводный камень: обезличить клиента при обязательном уникальном телефоне нельзя — это изменение схемы. Во вторник соберём всё в словарь данных — Глеб и Лиза уже ждут.',
    tasks: [howNouns, howMoney, howState, entitiesTask, crudTask, labTask, offerTask, explainTask]
  });
})();
