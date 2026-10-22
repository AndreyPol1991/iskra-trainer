/* Модуль 4, занятие 1: Основы баз данных и реляционная модель.
   Теория: зачем база вместо Excel — «Записи_январь.xlsx» Марины Олеговны с подсветкой аномалий (дубли, вставка,
   обновление, удаление, несколько значений в ячейке), что делает СУБД, таблица/строка/столбец/значение на живой
   таблице client, типы данных и ловушки (телефон числом, деньги в FLOAT); первичный ключ (естественный и суррогатный),
   внешний ключ «нажмите на запись — увидите клиента», связи 1:1, 1:N, M:N через booking_service (живой запрос), NULL,
   ограничения NOT NULL / UNIQUE / CHECK / FOREIGN KEY — песочница с настоящими ошибками SQLite на копии базы;
   нормализация 1НФ → 2НФ → 3НФ пошагово, транзакция оплаты на кассе со «сбоем» и ACID, реляционная и документная модель.
   Практика: найти проблемы в Excel Марины и назвать аномалии; первичные ключи и тип связи для 8 пар (где живёт
   внешний ключ); нормализовать широкую таблицу — разнести столбцы по таблицам и узнать нарушенную нормальную форму;
   лаборатория «Неделя Лизы» — ограничения и транзакция → какие реальные ситуации «Искры» база не сохранит, а какой
   мусор пропустит; своими словами Марине Олеговне — зачем база вместо Excel. */
'use strict';
(function () {
  const TR = window.TR, ui = TR.ui, esc = TR.esc;
  const ID = 'm4-db';

  if (!document.getElementById('m4d-css')) document.head.insertAdjacentHTML('beforeend', `<style id="m4d-css">
    .m4d-root, .m4d-root .stack > *, .m4d-root .card > * { min-width: 0; }
    .m4d-root .seg button { white-space: normal; }
    .m4d-h3 { font: 600 17px/1.3 var(--f-brand); margin: 0; }
    .m4d-xlw { overflow-x: auto; border: 1px solid var(--border-strong); border-radius: 10px; background: var(--surface); }
    .m4d-xlcap { display: flex; gap: 8px; align-items: center; padding: 6px 10px; border-bottom: 1px solid var(--border); background: var(--surface-3); font: 600 12px/1.3 var(--f-mono); color: var(--text-2); }
    .m4d-xl { border-collapse: collapse; font-size: 12.5px; min-width: 860px; width: 100%; }
    .m4d-xl th, .m4d-xl td { border: 1px solid var(--border); padding: 0; text-align: left; vertical-align: top; }
    .m4d-xl thead th { background: var(--surface-2); font-weight: 600; padding: 4px 6px; color: var(--text-2); }
    .m4d-xl thead tr:first-child th { font: 500 10.5px/1.2 var(--f-mono); color: var(--text-muted); text-align: center; padding: 2px; }
    .m4d-xl .rn { background: var(--surface-2); color: var(--text-muted); font: 500 11px var(--f-mono); text-align: center; padding: 4px; width: 26px; }
    .m4d-xl .cv { display: block; width: 100%; min-height: 26px; padding: 4px 6px; font: inherit; color: inherit; text-align: left; background: transparent; border: 0; white-space: nowrap; }
    .m4d-xl button.cv { cursor: pointer; }
    .m4d-xl button.cv:hover { background: var(--surface-2); }
    .m4d-xl .cv.hl { background: color-mix(in srgb, var(--warn) 22%, transparent); box-shadow: inset 0 0 0 1.5px var(--warn); }
    .m4d-xl .cv.mk { background: color-mix(in srgb, var(--accent) 18%, transparent); box-shadow: inset 0 0 0 1.5px var(--accent); }
    .m4d-xl .cv.ok { background: var(--ok-soft); box-shadow: inset 0 0 0 1.5px var(--ok); }
    .m4d-xl .cv.bad { background: var(--bad-soft); box-shadow: inset 0 0 0 1.5px var(--bad); }
    .m4d-xl .cv.miss { box-shadow: inset 0 0 0 1.5px dashed var(--warn); outline: 1.5px dashed var(--warn); outline-offset: -3px; }
    .m4d-xl .cv.dim { color: var(--text-muted); }
    .m4d-grid2 { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
    .m4d-grid3 { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
    @media (max-width: 720px) { .m4d-grid2, .m4d-grid3 { grid-template-columns: minmax(0, 1fr); } }
    .m4d-box { border: 1px solid var(--border); border-radius: 10px; padding: 10px 12px; background: var(--surface); font-size: 14px; display: grid; gap: 5px; align-content: start; min-width: 0; overflow-wrap: anywhere; }
    .m4d-box > b.k { font: 600 10.5px/1.3 var(--f-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--text-muted); }
    .m4d-box.ok { border-color: color-mix(in srgb, var(--ok) 45%, var(--border)); background: var(--ok-soft); }
    .m4d-box.bad { border-color: color-mix(in srgb, var(--bad) 45%, var(--border)); background: var(--bad-soft); }
    .m4d-box.info { border-color: color-mix(in srgb, var(--info) 45%, var(--border)); background: var(--info-soft); }
    .m4d-box.acc { border-color: color-mix(in srgb, var(--accent) 45%, var(--border)); background: var(--accent-soft); }
    .m4d-chips { display: flex; flex-wrap: wrap; gap: 6px; }
    .m4d-chip { font: inherit; font-size: 13px; border: 1px solid var(--border-strong); background: var(--surface-2); color: var(--text); border-radius: 99px; padding: 5px 11px; cursor: pointer; }
    .m4d-chip[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); color: var(--accent); font-weight: 600; }
    .m4d-mini { overflow-x: auto; }
    .m4d-mini table { border-collapse: collapse; font: 12.5px/1.35 var(--f-mono); width: 100%; }
    .m4d-mini th, .m4d-mini td { border: 1px solid var(--border); padding: 4px 7px; text-align: left; white-space: nowrap; }
    .m4d-mini th { background: var(--surface-3); font-weight: 600; }
    .m4d-mini caption { text-align: left; font: 600 12.5px/1.4 var(--f-mono); color: var(--accent); padding: 2px 0 4px; }
    .m4d-mini td.nul { color: var(--text-muted); font-style: italic; }
    .m4d-mini .on td, .m4d-mini td.on, .m4d-mini th.on { background: color-mix(in srgb, var(--accent) 16%, transparent); }
    .m4d-mini .pk { color: var(--warn); } .m4d-mini .fk { color: var(--info); }
    .m4d-mini button.cell { font: inherit; color: inherit; background: transparent; border: 0; padding: 0; cursor: pointer; text-decoration: underline dotted; }
    .m4d-steps { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
    .m4d-tables { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 10px; }
    .m4d-rel { display: grid; grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr); gap: 8px; align-items: center; }
    .m4d-ent { border: 1.5px solid var(--border-strong); border-radius: 9px; padding: 8px 10px; background: var(--surface-2); text-align: center; font-size: 13.5px; min-width: 0; }
    .m4d-ent small { display: block; color: var(--text-muted); font: 11px/1.3 var(--f-mono); }
    .m4d-ent.link { border-style: dashed; border-color: var(--accent); background: var(--accent-soft); }
    .m4d-arrow { font: 600 13px var(--f-mono); color: var(--accent); text-align: center; }
    .m4d-pairs { display: grid; gap: 8px; }
    .m4d-pair { display: grid; grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr) minmax(0, 1.2fr); gap: 8px; align-items: center; border: 1px solid var(--border); border-radius: 10px; padding: 8px 10px; background: var(--surface); }
    .m4d-pair.ok { border-color: var(--ok); background: var(--ok-soft); } .m4d-pair.bad { border-color: var(--bad); background: var(--bad-soft); } .m4d-pair.warn { border-color: var(--warn); background: var(--warn-soft); }
    .m4d-pair .why { grid-column: 1 / -1; font-size: 13px; color: var(--text-2); }
    .m4d-pair select { width: 100%; min-width: 0; }
    @media (max-width: 640px) { .m4d-pair { grid-template-columns: minmax(0, 1fr); } }
    .m4d-pk { display: grid; gap: 6px; border: 1px solid var(--border); border-radius: 10px; padding: 9px 11px; background: var(--surface); }
    .m4d-pk.ok { border-color: var(--ok); } .m4d-pk.bad { border-color: var(--bad); } .m4d-pk.warn { border-color: var(--warn); }
    .m4d-cons { display: grid; gap: 8px; }
    .m4d-ctab { border: 1px solid var(--border); border-radius: 10px; padding: 8px 10px; background: var(--surface); display: grid; gap: 6px; }
    .m4d-ctab > b { font: 600 13px var(--f-mono); color: var(--accent); }
    .m4d-tg { display: flex; flex-wrap: wrap; gap: 6px; }
    .m4d-tg button { font: 12.5px/1.3 var(--f-mono); border: 1px solid var(--border-strong); background: var(--surface-2); color: var(--text-2); border-radius: 8px; padding: 6px 10px; cursor: pointer; text-align: left; }
    .m4d-tg button[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); color: var(--text); font-weight: 600; }
    .m4d-tg button[aria-pressed="true"]::before { content: '✓ '; color: var(--accent); }
    .m4d-tg button:disabled { cursor: default; opacity: .85; }
    .m4d-res { display: grid; gap: 6px; }
    .m4d-sc { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 4px 10px; border: 1px solid var(--border); border-left: 4px solid var(--border-strong); border-radius: 10px; padding: 8px 11px; background: var(--surface); font-size: 13.5px; }
    .m4d-sc .st { font: 600 11.5px var(--f-mono); white-space: nowrap; color: var(--text-2); }
    .m4d-sc .cq { grid-column: 1 / -1; color: var(--text-2); font-size: 13px; }
    .m4d-sc.ok { border-left-color: var(--ok); } .m4d-sc.bad { border-left-color: var(--bad); background: var(--bad-soft); }
    .m4d-acid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 6px; }
    .m4d-acid button { font: inherit; border: 1px solid var(--border-strong); background: var(--surface-2); color: var(--text); border-radius: 10px; padding: 8px 6px; cursor: pointer; display: grid; gap: 2px; text-align: center; }
    .m4d-acid button b { font: 700 22px/1 var(--f-brand); color: var(--accent); }
    .m4d-acid button small { font-size: 11.5px; color: var(--text-muted); }
    .m4d-acid button[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); }
    .m4d-acid button { min-width: 0; overflow-wrap: anywhere; }
    @media (max-width: 520px) { .m4d-acid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
    .m4d-tx { display: grid; gap: 5px; }
    .m4d-op { display: grid; grid-template-columns: 26px minmax(0, 1fr) auto; gap: 8px; align-items: center; border: 1px solid var(--border); border-radius: 9px; padding: 7px 10px; background: var(--surface); font-size: 13.5px; }
    .m4d-op .n { font: 600 12px var(--f-mono); color: var(--text-muted); text-align: center; }
    .m4d-op .s { font: 600 11.5px var(--f-mono); white-space: nowrap; }
    .m4d-op.done { border-color: color-mix(in srgb, var(--ok) 45%, var(--border)); } .m4d-op.done .s { color: var(--ok); }
    .m4d-op.lost { opacity: .6; border-style: dashed; } .m4d-op.lost .s { color: var(--text-muted); }
    .m4d-op.crash { border-color: var(--bad); background: var(--bad-soft); } .m4d-op.crash .s { color: var(--bad); }
    .m4d-op.undo { border-color: var(--warn); } .m4d-op.undo .s { color: var(--warn); }
    .m4d-live { display: grid; gap: 6px; }
    .m4d-sigs { display: flex; flex-wrap: wrap; gap: 6px; }
  </style>`);

  const anNote = html => `<div style="margin-top:12px">${ui.note('info', 'Позиция аналитика', html)}</div>`;
  const interview = (q, a) => ui.note('', 'Как об этом спрашивают на собеседовании', `<b>«${q}»</b><br>${a}`);
  const mark = s => s === 'ok' ? '✓' : s === 'warn' ? '≈' : '✗';
  const NO_DB = 'Не удалось загрузить учебную базу: движок SQLite (sql.js) скачивается с cdnjs.cloudflare.com, нужен интернет. Остальная теория работает и без него — вернитесь к этой кнопке позже.';

  // живой запрос к общей песочнице (только SELECT)
  async function live(out, sql, opts) {
    out.innerHTML = '<div class="small dim">Загружаю базу…</div>';
    try {
      const res = await TR.db.run(sql);
      out.innerHTML = ui.code(sql, 'sql') + TR.db.resultHTML(res, opts);
    } catch (e) { out.innerHTML = ui.note('warn', 'База не загрузилась', NO_DB); }
  }
  // выполнить изменяющий запрос на свежей копии базы — общая песочница не портится
  async function liveFresh(out, sql, comment) {
    out.innerHTML = '<div class="small dim">Загружаю базу…</div>';
    try {
      const r = await TR.db.compare(sql, 'SELECT 1');
      out.innerHTML = ui.code(sql, 'sql') + TR.db.resultHTML(r.mine) + (comment ? `<div class="small muted">${comment}</div>` : '');
    } catch (e) { out.innerHTML = ui.note('warn', 'База не загрузилась', NO_DB); }
  }

  // =====================================================================
  // «Записи_январь.xlsx» Марины Олеговны
  // =====================================================================
  const XL_COLS = [['A', 'Дата'], ['B', 'Время'], ['C', 'Станция'], ['D', 'Клиент'], ['E', 'Телефон'], ['F', 'Машина'], ['G', 'Госномер'], ['H', 'Услуги'], ['I', 'Цена, ₽'], ['J', 'Мастер'], ['K', 'Статус']];
  const XL_ROWS = [
    ['25.01.2027', '10:00', 'Победы', 'Смирнова Елена', '+7 917 234-56-78', 'Kia Rio', 'О392ЕТ116', 'ТО-1', '2 500', 'Кравец М. О.', 'пришла'],
    ['25.01.2027', '10:30', 'Победы', 'Белов Игорь', '+7 937 000-44-55', 'Hyundai Solaris', 'А325УР116', 'ТО-1, колодки', '4 300', 'Кравец М. О.', 'ждём'],
    ['25.01.2027', '11-00', 'Пбеды', 'Валиев Игорь', '89961883220', 'Лада Веста', 'А519ВУ116', 'Диагностика', '1 200', 'Кравец М. О.', ''],
    ['26.01', '09:00', 'Победы', 'Кузнецова Светлана', '+7 996 973-66-29', 'Skoda Rapid', 'А248ХА116', 'ТО-1', '2 300', 'Кравец М. О.', 'пришла'],
    ['26.01.2027', '12:00', 'Победы', 'Смирнова Е.', '8 917 234 56 78', 'Киа Рио', 'О392ЕТ116', 'Шиномонтаж', '2 400', 'Кравец М. О.', 'ждём'],
    ['—', '—', 'Победы', '—', '—', '—', '—', 'Хранение шин (новая)', '3 000', '—', 'цена на сезон!'],
    ['26.01.2027', '15:00', 'Победы', 'Морозова Ольга', '+7 950 768-41-76', 'Renault Logan', 'М328СВ116', 'Замена аккумулятора', '600', 'Кравец М. О.', 'отменила']
  ];
  const cid = (r, c) => `r${r}-${c}`;
  const rowCells = r => XL_COLS.map(c => cid(r, c[0]));
  function xlHTML(o) {
    const opt = o || {};
    const cls = id => [opt.hl && opt.hl.has(id) ? 'hl' : '', opt.mark && opt.mark.has(id) ? 'mk' : '', opt.reveal && opt.reveal[id] ? opt.reveal[id] : ''].join(' ');
    const cell = (r, c, v) => {
      const id = cid(r, c), t = esc(v || ' ');
      return opt.click && !opt.readonly ? `<button type="button" class="cv ${cls(id)}" data-cell="${id}" aria-pressed="${!!(opt.mark && opt.mark.has(id))}" aria-label="Ячейка ${c}${r + 1}: ${esc(v || 'пусто')}">${t}</button>` : `<span class="cv ${cls(id)} ${v === '—' ? 'dim' : ''}">${t}</span>`;
    };
    return `<div class="m4d-xlw"><div class="m4d-xlcap">📗 Записи_январь.xlsx · лист «Победы»</div><table class="m4d-xl">
      <thead><tr><th></th>${XL_COLS.map(c => `<th>${c[0]}</th>`).join('')}</tr><tr><th class="rn">1</th>${XL_COLS.map(c => `<th>${esc(c[1])}</th>`).join('')}</tr></thead>
      <tbody>${XL_ROWS.map((row, r) => `<tr><td class="rn">${r + 2}</td>${row.map((v, k) => `<td>${cell(r, XL_COLS[k][0], v)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  }
  const XL_ANOM = [
    { v: 'dup', t: 'Дубли', cells: ['r0-D', 'r0-E', 'r0-F', 'r4-D', 'r4-E', 'r4-F'], what: 'Елена Смирнова записана дважды: «Смирнова Елена, +7 917…, Kia Rio» и «Смирнова Е., 8 917…, Киа Рио». Для Excel это два разных человека.', hurt: 'Бонусы копятся на двух карточках, неявки считаются по отдельности (BR-4 не сработает), SMS может уйти на один номер из двух. В базе «Искры» таких клиентов 31 000 — и дубли там тоже есть (факт F-excel).', db: 'Клиент — одна строка в таблице <code>client</code>, телефон — <code>UNIQUE</code> в одном формате +7XXXXXXXXXX. Запись ссылается на клиента по номеру <code>client_id</code>, а не повторяет его ФИО.' },
    { v: 'ins', t: 'Аномалия вставки', cells: rowCells(5), what: 'Новую услугу «Хранение шин» некуда записать, пока на неё никто не записался. Марина завела «строку-заметку» без даты и клиента.', hurt: 'Строка-призрак попадёт в любые подсчёты: «записей за январь — 7», хотя их 6; в фильтре по клиентам появится «—».', db: 'Услуга живёт в своей таблице <code>service</code> — её можно добавить в каталог, не создавая ни одной записи.' },
    { v: 'upd', t: 'Аномалия обновления', cells: ['r0-I', 'r3-I', 'r0-E', 'r4-E'], what: 'Один и тот же факт хранится в нескольких строках. ТО-1 стоит 2 500 в одной строке и 2 300 в другой; телефон Елены — в двух строках по-разному.', hurt: 'Елена сменила номер — надо найти и поправить все её строки за год. Забыли одну — напоминание ушло на старый номер, Елена не приехала.', db: 'Факт хранится один раз: телефон — в <code>client</code>, цена каталога — в <code>service</code>. Поменяли в одном месте — изменилось везде. (Цена в заказ-наряде — отдельная история: это копия на момент заказа, её разберём на занятии про проектирование.)' },
    { v: 'del', t: 'Аномалия удаления', cells: rowCells(6), what: 'Морозова отменила запись. Если Марина удалит строку, чтобы «не мешала», вместе с ней пропадёт единственное место, где были телефон Морозовой и её Renault.', hurt: 'Через месяц Морозова звонит: «Вы же меня знаете», — а в Excel её больше нет. Удаление одного факта (записи) стёрло другие (клиента, машину).', db: 'Запись, клиент и машина — разные таблицы. Отмену не удаляют, а ставят статус <code>cancelled</code>; клиент и машина остаются.' },
    { v: 'multi', t: 'Несколько значений в ячейке', cells: ['r1-H'], what: '«ТО-1, колодки» — два значения в одной ячейке. И цена 4 300 — общая, непонятно, сколько стоит каждая услуга.', hurt: 'Кирилл спрашивает: «Сколько раз за месяц меняли колодки?» Фильтр «равно колодки» строку Белова не найдёт — придётся искать по куску текста и надеяться, что никто не написал «тормоза».', db: 'Одна услуга в записи — одна строка связующей таблицы <code>booking_service</code> (запись, услуга). Это первая нормальная форма.' },
    { v: 'fmt', t: 'Разнобой форматов', cells: ['r2-B', 'r2-C', 'r2-E', 'r3-A', 'r2-K'], what: 'Время «11-00», станция «Пбеды», телефон без +7, дата без года, пустой статус. Excel принимает в ячейку что угодно.', hurt: 'Фильтр «станция = Победы» теряет строку с опечаткой; сортировка по дате ставит «26.01» не туда; пустой статус — то ли клиент приехал, то ли нет.', db: 'У столбца есть тип (DATETIME, а не текст), станция выбирается из таблицы <code>station</code> по ключу, статус — из списка (CHECK), обязательные поля — NOT NULL.' }
  ];

  // =====================================================================
  // Теория 1. Зачем база данных: Excel, СУБД, таблица, типы
  // =====================================================================
  const DBMS = [
    { v: 'store', t: 'Хранит', d: 'Данные лежат на сервере, а не в файле на компьютере Марины. Файл можно случайно удалить, отправить не той версии, открыть вдвоём — и потерять правки одного.', ex: 'Все 7 станций видят одну и ту же базу: мастер на Азино знает, что Елена была на Победы.' },
    { v: 'rules', t: 'Следит за правилами', d: 'Ограничения: поле обязательно, значение уникально, только из списка, ссылка на существующую строку. Нарушение — запись не сохранится.', ex: 'Не получится записать машину на клиента, которого нет, или статус «пришла» вместо «arrived».' },
    { v: 'many', t: 'Пускает многих сразу', d: 'Сотни пользователей читают и пишут одновременно, и СУБД не даёт им испортить друг другу данные.', ex: 'В понедельник в 09:00 — до 1 500 клиентов одновременно ищут слоты (F-peak). Excel такого не выдержит даже вдвоём.' },
    { v: 'tx', t: 'Транзакции', d: 'Несколько изменений выполняются как одно: либо все, либо ни одного.', ex: 'Оплата: платёж, статус «Выдан», бонусы — всё или ничего. Подробно — в третьем разделе теории.' },
    { v: 'query', t: 'Отвечает на вопросы', d: 'Язык запросов SQL: «сколько неявок на каждой станции за январь» — одна строка запроса, ответ за доли секунды.', ex: 'Тимур Рашидович просит цифры — аналитик пишет SELECT, а не листает файл. SQL — на пятом занятии модуля.' },
    { v: 'safe', t: 'Защищает и бережёт', d: 'Права доступа (механик не видит выручку), журнал изменений, резервные копии.', ex: 'Требования «Искры»: потеря не больше 15 минут данных (RPO) и восстановление за час (RTO); персональные данные — на серверах в России (BR-15).' }
  ];
  const CL_COLS = [['id', 'pk', 'Идентификатор — суррогатный первичный ключ'], ['full_name', '', 'ФИО'], ['phone', '', 'Телефон, уникален'], ['email', '', 'Email, может быть пустым'], ['company_id', 'fk', 'Ссылка на компанию — у корпоративных']];
  const CL_ROWS = [[7, 'Смирнова Елена Андреевна', '+79172345678', 'elena.smirnova@mail.ru', null], [11, 'Смирнова Айгуль Викторовна', '+79965880020', null, null], [67, 'Смирнова Елена', '89172345678', null, null]];
  const PARTS = {
    table: { t: 'Таблица (отношение)', d: 'Набор однотипных фактов об одном виде объектов: все клиенты, все машины, все записи. У таблицы есть имя (<code>client</code>) и фиксированный набор столбцов. В теории реляционной модели (Э. Кодд, 1970) таблица называется <b>отношением</b> — отсюда «реляционная».' },
    col: { t: 'Столбец (атрибут, поле)', d: 'Одно свойство объекта: телефон, email. У столбца есть имя, <b>тип данных</b> и правила (обязателен ли, уникален ли). В отличие от Excel, в столбец <code>phone</code> не напишешь «позвонить после 18».' },
    row: { t: 'Строка (запись, кортеж)', d: 'Один объект — один клиент. Порядок строк в таблице не важен и не гарантирован: «пятая строка» в базе ничего не значит, значит только ключ. Строку находят по <b>первичному ключу</b> — <code>id = 7</code>.' },
    val: { t: 'Значение (ячейка)', d: 'Пересечение строки и столбца — <b>одно</b> значение нужного типа. Или <code>NULL</code> — «значения нет». Список «ТО-1, колодки» в одной ячейке — нарушение правил (первая нормальная форма).' },
    pk: { t: 'Первичный ключ', d: '<code>id</code> — номер, который однозначно указывает на строку и никогда не меняется. Подробно — во втором разделе.' }
  };
  const TYPES = [
    ['INTEGER', 'Целое число', 'id, год выпуска, пробег, баллы', 'Хранить в нём телефон: «89172345678» станет числом, пропадёт «+», а номер с ведущим нулём (иностранный) — испортится'],
    ['DECIMAL(10,2)', 'Точное число с копейками', 'цены, суммы, лимит «Шашки» 3 000,00', 'Хранить деньги в FLOAT (число с плавающей точкой): 0,1 + 0,2 там не равно 0,3 — копейки «плывут»'],
    ['VARCHAR(n)', 'Строка до n символов', 'ФИО (120), email, госномер (12)', 'Слишком короткая длина: «Галимзянова-Шарафутдинова …» не влезет'],
    ['CHAR(n)', 'Строка ровно n символов', 'VIN (17), ИНН юрлица (10)', 'Использовать для текста переменной длины — дополнится пробелами'],
    ['DATE / DATETIME', 'Дата / дата и время', 'дата приёма на работу; начало записи', 'Хранить даты текстом «26.01»: не сортируется, не считается «за 2 часа до начала» (BR-2)'],
    ['BOOLEAN', 'Да / нет', 'согласие на обработку ПДн (BR-15)', 'Хранить «да», «Да», «+», «1» вперемешку'],
    ['VARCHAR + CHECK', 'Значение из списка (перечисление)', 'статус записи: new, confirmed, arrived…', 'Свободный текст «пришла / ждём / отменила» — без списка допустимых значений']
  ];
  const howExcel = {
    id: 'how-excel', covers: ['t-anom'], title: 'Как это работает: зачем база данных, если есть Excel', free: true, noReset: true,
    simple: {
      icon: '🗃️',
      plain: 'Excel — это лист бумаги в клетку: пиши что хочешь где хочешь. База данных — картотека с правилами: у каждого вида карточек свой ящик (клиенты, машины, записи), у каждой карточки свой номер, а карточки ссылаются друг на друга по номерам. Поэтому каждый факт записан ровно один раз и его невозможно «записать криво».',
      analogy: 'Домашняя записная книжка, где телефон мамы записан в трёх местах: в «М», в «Д» (день рождения) и на последней странице. Мама сменила номер — исправили в двух местах, в третьем остался старый. Картотека с одной карточкой «Мама» и ссылками на неё такого не допустит.',
      tech: 'База данных — организованная совокупность данных; СУБД (система управления базами данных) — программа, которая хранит данные, обеспечивает целостность (ограничения), параллельный доступ, транзакции, права и восстановление. Реляционная модель — Э. Кодд, 1970; классический учебник — К. Дж. Дейт «Введение в системы баз данных». Примеры СУБД: PostgreSQL (прод «Искры»), SQLite (наш тренажёр), MySQL, Oracle, Microsoft SQL Server.'
    },
    lead: ui.brief({
      situation: 'Понедельник, 25 января. Марина Олеговна прислала «Записи_январь.xlsx» — так станция на Победы живёт 15 лет. Глеб: «Это и будет нашей базой? Нет. Но это лучший учебник, почему нужна база».',
      todo: [
        'Переключайте виды проблем над таблицей — подсветятся ячейки, а ниже появится: что не так, чем это бьёт по «Искре» и как это решает база.',
        'Посмотрите, что умеет СУБД, и нажмите на части таблицы <code>client</code> — узнаете, как называется каждая.',
        'Загрузите живые строки из учебной базы «Искры» и пролистайте типы данных с типичными ошибками.'
      ],
      look: 'Главная мысль: в Excel один факт («телефон Елены», «цена ТО-1») живёт в нескольких местах, а в базе — ровно в одном. Почти все беды Excel — из-за этого.'
    }),
    render(el) {
      el.classList.add('m4d-root');
      const st = { a: 'dup', dbms: 'store', part: 'table' };
      el.innerHTML = `<div class="stack">
        <h3 class="m4d-h3">1. Excel Марины Олеговны: где болит</h3>
        <div>${ui.seg('anom', XL_ANOM.map(a => ({ v: a.v, t: a.t })), st.a)}</div>
        <div data-xl></div>
        <div data-an></div>
        <div class="m4d-box info"><b class="k">Сценарий: Елена сменила телефон</b><div class="m4d-steps" data-ph></div><div data-ph-t class="small"></div></div>
        <h3 class="m4d-h3">2. Что делает СУБД</h3>
        <div class="m4d-chips">${DBMS.map(d => `<button type="button" class="m4d-chip" data-dbms="${d.v}" aria-pressed="${d.v === st.dbms}">${esc(d.t)}</button>`).join('')}</div>
        <div data-dbms-out></div>
        <h3 class="m4d-h3">3. Таблица, строка, столбец, значение</h3>
        <p class="small dim">Нажмите на имя таблицы, на заголовок столбца, на номер строки или на значение.</p>
        <div class="m4d-mini" data-cl></div>
        <div data-part></div>
        <div class="row"><button type="button" class="btn sm" data-live-cl>Показать живые строки из базы «Искры»</button></div>
        <div data-live-out class="m4d-live"></div>
        <h3 class="m4d-h3">4. Типы данных: у каждого столбца свой</h3>
        ${ui.table(['Тип', 'Что хранит', 'Пример в «Искре»', 'Типичная ошибка'], TYPES.map(r => [`<code style="white-space:nowrap">${esc(r[0])}</code>`, esc(r[1]), esc(r[2]), esc(r[3])]))}
        <div class="m4d-grid2">
          <div class="m4d-box bad"><b class="k">Деньги во FLOAT</b><div>Компьютер считает 0,1 + 0,2 в числах с плавающей точкой так: <code data-float></code>. Для 4 500 заказ-нарядов в месяц копейки «уплывут» в отчёте Ольги Викторовны.</div><div class="small">Правильно: <code>DECIMAL(10,2)</code> или целое число копеек.</div></div>
          <div class="m4d-box bad"><b class="k">Телефон числом</b><div>«+7 917 234-56-78» как INTEGER превратится в 79172345678 — пропадёт «+», а «8 917…» и «+7 917…» так и останутся разными числами.</div><div class="small">Правильно: строка <code>VARCHAR(20)</code> в одном формате +7XXXXXXXXXX и проверка формата при вводе.</div></div>
        </div>
        ${interview('Чем база данных отличается от Excel?', 'Слабый ответ — «база больше и быстрее». Сильный: в базе <b>каждый факт хранится один раз</b> (таблицы и ключи), <b>СУБД следит за правилами</b> (типы, обязательность, уникальность, ссылки), даёт <b>одновременную работу многих</b> пользователей и <b>транзакции</b>. Excel — свободный лист: дубли, аномалии вставки, обновления и удаления. Пример из практики сильнее определения: «телефон клиента в трёх строках — сменили в двух».')}
      </div>`;
      function drawXl() {
        const a = XL_ANOM.find(x => x.v === st.a);
        TR.$('[data-xl]', el).innerHTML = xlHTML({ hl: new Set(a.cells) });
        TR.$('[data-an]', el).innerHTML = `<div class="m4d-grid3">
          <div class="m4d-box"><b class="k">Что не так</b><div>${a.what}</div></div>
          <div class="m4d-box bad"><b class="k">Чем бьёт по «Искре»</b><div>${a.hurt}</div></div>
          <div class="m4d-box ok"><b class="k">Как в базе</b><div>${a.db}</div></div></div>`;
      }
      const PH = [
        ['Excel', 'Елена звонит: «У меня новый номер». Марина ищет «Смирнова» — находит 14 строк за год. Часть записана как «Смирнова Е.», часть — с номером 8 917… Исправляет 11. Три строки остались со старым номером — завтра на него уйдёт SMS-напоминание.'],
        ['База', 'Мастер находит Елену по телефону и меняет одно поле в одной строке: <code>UPDATE client SET phone = … WHERE id = 7</code>. Все 14 записей ссылаются на <code>client_id = 7</code> — они «видят» новый номер сразу.']
      ];
      let ph = 0;
      function drawPh() {
        TR.$('[data-ph]', el).innerHTML = PH.map((p, i) => `<button type="button" class="m4d-chip" data-phi="${i}" aria-pressed="${i === ph}">${p[0]}</button>`).join('');
        TR.$('[data-ph-t]', el).innerHTML = PH[ph][1];
      }
      function drawDbms() {
        const d = DBMS.find(x => x.v === st.dbms);
        TR.$$('[data-dbms]', el).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.dbms === st.dbms)));
        TR.$('[data-dbms-out]', el).innerHTML = `<div class="m4d-grid2"><div class="m4d-box"><b class="k">${esc(d.t)}</b><div>${d.d}</div></div><div class="m4d-box acc"><b class="k">В «Искре»</b><div>${d.ex}</div></div></div>`;
      }
      function drawCl() {
        const p = st.part;
        TR.$('[data-cl]', el).innerHTML = `<table><caption><button type="button" class="cell" data-part="table">client</button> — таблица клиентов</caption>
          <thead><tr><th></th>${CL_COLS.map(c => `<th class="${p === 'col' && c[0] === 'phone' ? 'on' : ''}"><button type="button" class="cell ${c[1]}" data-part="${c[1] === 'pk' ? 'pk' : 'col'}" title="${esc(c[2])}">${c[1] ? c[1].toUpperCase() + ' ' : ''}${c[0]}</button></th>`).join('')}</tr></thead>
          <tbody>${CL_ROWS.map((r, i) => `<tr class="${p === 'row' && i === 0 ? 'on' : ''}"><td><button type="button" class="cell" data-part="row">строка ${i + 1}</button></td>${r.map((v, k) => `<td class="${v == null ? 'nul' : ''} ${p === 'val' && i === 0 && k === 2 ? 'on' : ''} ${p === 'col' && k === 2 ? 'on' : ''}">${v == null ? 'NULL' : `<button type="button" class="cell" data-part="val">${esc(v)}</button>`}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
        const P = PARTS[p];
        el.querySelector('div[data-part]').innerHTML = `<div class="m4d-box acc"><b class="k">${esc(P.t)}</b><div>${P.d}</div>${p === 'row' || p === 'val' ? '<div class="small">Заметили? Строки 1 и 3 — один и тот же человек, Елена: телефон в разных форматах, поэтому UNIQUE не сработал. Это наследство переноса из Excel — его будем искать запросами на занятии по SQL.</div>' : ''}</div>`;
      }
      TR.on(el, 'click', '[data-dbms]', (e, b) => { st.dbms = b.dataset.dbms; drawDbms(); });
      TR.on(el, 'click', '[data-phi]', (e, b) => { ph = +b.dataset.phi; drawPh(); });
      TR.on(el, 'click', 'button[data-part]', (e, b) => { st.part = b.dataset.part; drawCl(); });
      TR.on(el, 'click', '[data-live-cl]', () => live(TR.$('[data-live-out]', el), 'SELECT id, full_name, phone, email, company_id, no_show_count\nFROM client\nWHERE full_name LIKE \'Смирнова%\' OR company_id IS NOT NULL\nORDER BY id\nLIMIT 8;'));
      ui.onSeg(el, (n, v) => { if (n === 'anom') { st.a = v; drawXl(); } });
      TR.$('[data-float]', el).textContent = String(0.1 + 0.2);
      drawXl(); drawPh(); drawDbms(); drawCl();
      el.insertAdjacentHTML('beforeend', anNote('Аналитик не «ругает Excel», а <b>читает его как источник требований</b>: каждая кривая ячейка — это правило, которое база должна проверять (формат телефона, список статусов), или сущность, которой не хватает (услуга без записи — значит, нужен каталог услуг). Excel Марины — лучший черновик модели данных.'));
    }
  };

  // =====================================================================
  // Практика 1. Найти проблемы в Excel и назвать аномалии
  // =====================================================================
  const PROBS = [
    { id: 'p1', cells: ['r0-D', 'r0-E', 'r4-D', 'r4-E'], t: 'Один клиент записан дважды: «Смирнова Елена, +7 917…» и «Смирнова Е., 8 917…»', why: 'дубль клиента — бонусы и неявки разъедутся по двум «людям»' },
    { id: 'p2', cells: ['r0-F', 'r4-F'], t: 'Одна машина О392ЕТ116 названа «Kia Rio» и «Киа Рио»', why: 'одна машина — два написания: история обслуживания и гарантия (BR-14) потеряются' },
    { id: 'p3', cells: ['r1-H', 'r1-I'], t: '«ТО-1, колодки» в одной ячейке и общая цена 4 300', why: 'несколько значений в ячейке — нельзя посчитать услуги по отдельности (1НФ)' },
    { id: 'p4', cells: ['r0-I', 'r3-I'], t: 'ТО-1 стоит 2 500 и 2 300 в разных строках', why: 'цена каталога хранится в каждой строке — где-то не обновили' },
    { id: 'p5', cells: ['r2-C'], t: 'Станция «Пбеды»', why: 'станция — свободный текст, опечатка выпадет из фильтра и отчёта' },
    { id: 'p6', cells: ['r2-B', 'r2-E', 'r3-A'], t: 'Время «11-00», телефон без +7, дата без года', why: 'нет типов и форматов — не сортируется и не сравнивается' },
    { id: 'p7', cells: rowCells(5), t: 'Строка-заметка «Хранение шин» без даты и клиента', why: 'аномалия вставки: услуге без записи негде жить' },
    { id: 'p8', cells: ['r2-K'], t: 'Пустой статус у записи Валиева', why: 'статус не обязателен и не из списка — непонятно, приехал ли клиент' }
  ];
  const CELL2P = {}; PROBS.forEach(p => p.cells.forEach(c => { CELL2P[c] = p.id; }));
  const ANOM_CH = [{ v: 'ins', t: 'Аномалия вставки' }, { v: 'upd', t: 'Аномалия обновления' }, { v: 'del', t: 'Аномалия удаления' }, { v: 'dup', t: 'Дублирование (избыточность)' }, { v: 'nf1', t: 'Неатомарное значение (несколько в ячейке)' }];
  const ANOM_R = [
    { id: 'a1', t: 'Чтобы не забыть цену новой услуги «Хранение шин», Марина завела строку без клиента и даты.', ok: 'ins', why: 'Факт (услуга и её цена) нельзя сохранить без другого факта (записи) — это аномалия вставки.' },
    { id: 'a2', t: 'Елена сменила телефон. Его нужно исправить в 14 строках за год; в трёх забыли — SMS ушло на старый номер.', ok: 'upd', why: 'Один факт в многих местах: изменили не везде — данные противоречат друг другу. Аномалия обновления.' },
    { id: 'a3', t: 'Морозова отменила запись; строку удалили — и пропал единственный телефон Морозовой.', ok: 'del', why: 'Удалили один факт (запись) — потеряли другие (клиента, машину). Аномалия удаления.' },
    { id: 'a4', t: 'Елена записана как «Смирнова Елена» и «Смирнова Е.»: баллы копятся на двух карточках.', ok: 'dup', alt: { upd: 'Последствие похоже на аномалию обновления, но корень другой: здесь не один факт в нескольких строках, а два «разных» объекта вместо одного — дубль.' }, why: 'Один реальный объект записан как два разных — дублирование.' },
    { id: 'a5', t: '«ТО-1, колодки» в одной ячейке: Кирилл не может посчитать, сколько раз за месяц меняли колодки.', ok: 'nf1', why: 'В ячейке список вместо одного значения — нарушение первой нормальной формы.' }
  ];
  function anomEval(ans) {
    const mk = new Set((ans && ans.cells) || []);
    const found = PROBS.filter(p => p.cells.some(c => mk.has(c)));
    const fp = [...mk].filter(c => !CELL2P[c]);
    const m = (ans && ans.m) || {};
    const rows = ANOM_R.map(r => { const g = m[r.id]; const s = !g ? 'none' : g === r.ok ? 'ok' : (r.alt && r.alt[g]) ? 'warn' : 'bad'; return { r, g, s, pts: s === 'ok' ? 1 : s === 'warn' ? 0.5 : 0 }; });
    const fScore = Math.max(0, (found.length - Math.max(0, fp.length - 1) * 0.5) / PROBS.length);
    const mScore = rows.reduce((s, x) => s + x.pts, 0) / ANOM_R.length;
    return { mk, found, fp, rows, fScore, mScore, score: Math.round((0.6 * fScore + 0.4 * mScore) * 100) / 100 };
  }
  const taskAnom = {
    id: 't-anom', title: 'Найти проблемы в Excel Марины Олеговны',
    simple: howExcel.simple,
    lead: ui.brief({
      situation: 'Марина Олеговна: «У меня всё в порядке, 15 лет так работаем». Вера: «Давайте вместе посмотрим один лист — и вы сами решите». В листе спрятано 8 проблем.',
      todo: [
        'Нажимайте на ячейки, где видите проблему (повторное нажатие снимает отметку). Достаточно отметить одну ячейку из каждой проблемы.',
        'Ниже сопоставьте пять ситуаций с видом аномалии.',
        'Нажмите «Проверить». Засчитывается, если найдено не меньше 6 проблем из 8 без лишних отметок и названы аномалии (общий балл от 80 %).'
      ],
      lookTitle: 'Подсказка',
      look: 'Ищите три вещи: один факт в нескольких местах (сравните строки 2 и 6), значения, которые Excel «съел» бы в любом виде (формат, опечатки, пустота), и строки, которые не про запись.'
    }),
    blank: () => ({ cells: [], m: {} }),
    reference: () => ({ cells: PROBS.map(p => p.cells[0]), m: Object.fromEntries(ANOM_R.map(r => [r.id, r.ok])) }),
    render(el, ctx) {
      el.classList.add('m4d-root');
      const ans = ctx.ans; ans.cells = ans.cells || []; ans.m = ans.m || {};
      let dirty = false;
      el.innerHTML = `<div class="stack"><div data-xl></div><div class="small dim" data-cnt></div>
        <h3 class="m4d-h3">Какая это аномалия?</h3><div data-m></div></div>`;
      function revealCells() {
        if ((!ctx.result || dirty) && !ctx.readonly) return null;
        const ev = anomEval(ans), rv = {};
        ev.mk.forEach(c => { rv[c] = CELL2P[c] ? 'ok' : 'bad'; });
        if (ctx.readonly) PROBS.forEach(p => p.cells.forEach(c => { if (!rv[c]) rv[c] = 'miss'; }));
        return rv;
      }
      function drawXl() {
        const mk = new Set(ans.cells);
        TR.$('[data-xl]', el).innerHTML = xlHTML({ click: true, readonly: ctx.readonly, mark: (ctx.result && !dirty) || ctx.readonly ? null : mk, reveal: revealCells() });
        TR.$('[data-cnt]', el).textContent = `Отмечено ячеек: ${ans.cells.length}. Проблем в листе: 8.`;
      }
      TR.on(el, 'click', '[data-cell]', (e, b) => {
        const c = b.dataset.cell, i = ans.cells.indexOf(c);
        if (i >= 0) ans.cells.splice(i, 1); else ans.cells.push(c);
        dirty = true; ctx.save(); drawXl();
      });
      drawXl();
      let reveal = null;
      if (ctx.result) { reveal = {}; anomEval(ans).rows.forEach(x => { if (x.g) reveal[x.r.id] = { s: x.s, why: x.s === 'ok' ? x.r.why : x.s === 'warn' ? x.r.alt[x.g] : 'Подумайте: какой факт здесь «потерялся» или «размножился» — и при каком действии (вставка, изменение, удаление)?' }; }); }
      ui.match(TR.$('[data-m]', el), { rows: ANOM_R.map(r => ({ id: r.id, t: esc(r.t) })), choices: ANOM_CH, value: ans.m, reveal, readonly: ctx.readonly, onChange: v => { ans.m = v; ctx.save(); } });
    },
    check(ans) {
      const ev = anomEval(ans), notes = [];
      ev.found.forEach(p => notes.push({ ok: true, html: `${esc(p.t)} — ${p.why}.` }));
      PROBS.filter(p => !ev.found.includes(p)).forEach(p => notes.push({ ok: false, html: `Не найдено: ${esc(p.why)}. <span class="small dim">(${p.cells[0].replace(/r(\d+)-(\w)/, (m, r, c) => c + (+r + 2))})</span>` }));
      if (ev.fp.length) notes.push({ ok: 'warn', html: `Лишние отметки: ${ev.fp.length}. ${ev.fp.length > 1 ? 'Больше одной лишней — снижают балл.' : 'Одна — не страшно.'} Например, госномер О392ЕТ116 дважды — это нормально: одна машина приезжала два раза. Проблема не в повторе госномера, а в том, что всё остальное о машине и клиенте повторяется вместе с ним.` });
      ev.rows.forEach(x => { if (x.s === 'bad' || x.s === 'none') notes.push({ ok: false, html: `«${esc(x.r.t)}» — ${x.g ? 'не «' + esc(ANOM_CH.find(c => c.v === x.g).t) + '».' : 'вид не выбран.'} ${x.r.why}` }); else if (x.s === 'warn') notes.push({ ok: 'warn', html: x.r.alt[x.g] }); });
      const ok = ev.found.length >= 6 && ev.fp.length <= 2 && ev.score >= 0.8;
      return {
        ok, score: ev.score, notes,
        summary: `Найдено проблем: ${ev.found.length} из 8, лишних отметок: ${ev.fp.length}; аномалии названы верно: ${ev.rows.filter(x => x.s === 'ok').length} из 5.`,
        mentor: ev.found.length < 6 ? 'Сравните строки 2 и 6 целиком — это один и тот же человек и одна машина. А потом спросите себя про каждую ячейку: «Excel принял бы здесь любую чепуху?» Если да — это правило, которого не хватает.' : (!ok ? 'Аномалии различаются действием: <b>вставка</b> — не могу сохранить факт без другого, <b>обновление</b> — изменил не везде, <b>удаление</b> — стёр лишнее вместе с нужным.' : '')
      };
    },
    explain: `<p>Все восемь проблем сводятся к двум корням. <b>Первый — один факт живёт в нескольких местах</b>: телефон Елены, её машина, цена ТО-1 повторяются в каждой строке. Отсюда дубли и аномалии обновления. <b>Второй — у ячейки нет правил</b>: тип, формат, обязательность, список допустимых значений. Отсюда «Пбеды», «11-00» и пустой статус.</p>
      <p>Три классические аномалии (по Кодду и Дейту) — признак того, что в одной таблице смешаны разные сущности:</p>
      <ul class="checks"><li><b>Вставки</b>: нельзя записать услугу, пока нет записи на неё.</li><li><b>Обновления</b>: телефон надо менять в 14 строках.</li><li><b>Удаления</b>: удалили запись — потеряли клиента.</li></ul>
      <p>Лечение одно: разнести факты по таблицам (клиент, машина, станция, услуга, запись) и связать их ключами. Это и есть нормализация — её разберём в третьем разделе теории. Частая ошибка — отметить повтор госномера как дубль: повтор <b>ключа-ссылки</b> нормален (машина приезжала дважды), плохо, когда вместе с ним повторяются все данные о машине.</p>
      <p>Источник: К. Дж. Дейт «Введение в системы баз данных», главы о нормализации; Э. Кодд «A Relational Model of Data for Large Shared Data Banks» (1970).</p>`,
    refNote: 'Достаточно одной ячейки из каждой проблемы; одна лишняя отметка не снижает балл. Дубль клиента, названный «аномалией обновления», засчитывается наполовину.',
    report: ans => { const ev = anomEval(ans); return `- Найдено проблем: ${ev.found.length}/8, лишних отметок: ${ev.fp.length}\n` + ev.rows.map(x => `- ${x.r.t} → ${x.g ? ANOM_CH.find(c => c.v === x.g).t : '—'} ${mark(x.s)}`).join('\n'); }
  };

  // =====================================================================
  // Теория 2. Ключи, связи, NULL, ограничения
  // =====================================================================
  const PK_C = [
    { v: 'name', t: 'ФИО', s: 'bad', d: 'Не уникально: в базе три Смирновы, а Игорей Викторовичей — двое. Меняется (вышла замуж). Пишется по-разному («Смирнова Е.»).' },
    { v: 'phone', t: 'Телефон', s: 'warn', d: '<b>Естественный ключ-кандидат</b>: уникален (логин в приложении). Но меняется — а на ключ ссылаются записи, заказ-наряды, бонусы: пришлось бы менять везде. Поэтому телефон — <code>UNIQUE</code>, но не первичный ключ.' },
    { v: 'email', t: 'Email', s: 'bad', d: 'Есть не у всех: у Айгуль Смирновой email пустой (NULL). Первичный ключ не может быть пустым.' },
    { v: 'id', t: 'id (номер)', s: 'ok', d: '<b>Суррогатный ключ</b>: номер, который выдаёт сама база (1, 2, 3…). Ничего не значит для бизнеса — поэтому никогда не меняется. Так и сделано в «Искре»: <code>client.id</code>.' }
  ];
  const BK = [[1, 7, 'Победы', '2027-01-11 10:00'], [2, 11, 'Азино', '2027-01-11 12:30'], [3, 7, 'Горки', '2027-01-12 09:00']];
  const CLI = [[7, 'Смирнова Елена Андреевна'], [11, 'Смирнова Айгуль Викторовна'], [40, 'Смирнова Татьяна Сергеевна']];
  const RELS = [
    { v: '11', t: '1 : 1', a: 'Запись', as: 'booking', b: 'Заказ-наряд', bs: 'work_order', link: null, fk: '<code>work_order.booking_id</code> — внешний ключ <b>с UNIQUE</b>: на одну запись — не больше одного заказ-наряда. Поле может быть пустым: клиент приехал без записи.', ex: 'Одна запись превращается максимум в один заказ-наряд.', home: 'Человек и его паспорт: у одного человека — один действующий паспорт, паспорт — у одного человека.', err: 'Склеить 1:1 в одну таблицу «запись-наряд» — тогда заказ-наряд без записи хранить негде.' },
    { v: '1n', t: '1 : N', a: 'Клиент', as: 'client', b: 'Машина', bs: 'car', link: null, fk: '<code>car.client_id</code> — внешний ключ <b>на стороне «многих»</b>. Каждая машина знает своего владельца; у клиента нет поля «машины».', ex: 'У Рустама из «Шашки» — десятки машин, у каждой машины — один владелец в базе.', home: 'Мама и дети: у мамы может быть много детей, у каждого ребёнка — одна мама (в этой модели).', err: 'Поле «машины» в таблице клиента со списком госномеров — список в ячейке, нарушение 1НФ.' },
    { v: 'mn', t: 'M : N', a: 'Запись', as: 'booking', b: 'Услуга', bs: 'service', link: 'booking_service', fk: 'Напрямую M:N в реляционной базе не хранится. Нужна <b>связующая таблица</b> <code>booking_service(booking_id, service_id)</code>: каждая её строка — «в записи X выбрана услуга Y». Два внешних ключа вместе — составной первичный ключ.', ex: 'Елена записалась на ТО-1 и шиномонтаж: две строки в booking_service. ТО-1 выбирали в сотне записей — сотня строк.', home: 'Студенты и курсы: студент ходит на много курсов, на курсе много студентов. Связь хранит ведомость «студент — курс».', err: 'Столбцы «Услуга 1», «Услуга 2», «Услуга 3» в записи: а если услуг четыре?' }
  ];
  const CONSTR_DEMO = [
    { t: 'UNIQUE: второй аккаунт Елены', sql: "INSERT INTO client (full_name, phone, created_at)\nVALUES ('Смирнова Елена (второй аккаунт)', '+79172345678', '2027-02-10 12:00');", c: 'Телефон +79172345678 уже есть у клиента 7 — база отказала. Дубль «8 917…» в базе есть потому, что формат другой: UNIQUE сравнивает строки буквально. Отсюда требование — приводить телефон к одному формату до сохранения.' },
    { t: 'NOT NULL: клиент без телефона', sql: "INSERT INTO client (full_name, created_at)\nVALUES ('Без телефона', '2027-02-10 12:00');", c: 'Телефон обязателен: это логин в приложении и канал SMS.' },
    { t: 'FOREIGN KEY: запись на машину №9999', sql: "INSERT INTO booking (client_id, car_id, station_id, start_at, end_at, status, source, created_at)\nVALUES (7, 9999, 1, '2027-02-15 10:00', '2027-02-15 11:00', 'confirmed', 'app', '2027-02-10 12:00');", c: 'Машины 9999 нет — ссылка «в никуда» не сохранится.' },
    { t: 'CHECK: статус «пришла»', sql: "UPDATE booking SET status = 'пришла' WHERE id = 2;", c: 'Статус — только из списка: new, confirmed, arrived, done, cancelled, no_show.' },
    { t: 'FOREIGN KEY: удалить станцию «Победы»', sql: 'DELETE FROM station WHERE id = 1;', c: 'На станцию ссылаются посты, сотрудники, записи — удалить её нельзя, иначе они станут «сиротами».' },
    { t: 'Всё по правилам: клиент без email', sql: "INSERT INTO client (full_name, phone, created_at)\nVALUES ('Хасанов Ильдар Ринатович', '+79270001122', '2027-02-10 12:00');", c: 'Email необязателен (NULL), no_show_count и bonus_balance заполнились значениями по умолчанию (DEFAULT 0).' }
  ];
  const howKeys = {
    id: 'how-keys', covers: ['t-keys', 't-lab'], title: 'Как это работает: ключи, связи, NULL и ограничения', free: true, noReset: true,
    simple: {
      icon: '🔑',
      plain: 'У каждой строки есть паспорт — первичный ключ: номер, по которому её всегда можно найти. Когда одной таблице нужно сослаться на другую, она хранит этот номер — внешний ключ. Запись не повторяет ФИО клиента, а хранит «клиент № 7». А ограничения — это правила, которые база проверяет сама: «телефон обязателен», «телефон не повторяется», «статус только из списка».',
      analogy: 'Гардероб в театре. Номерок — первичный ключ пальто: по нему пальто находят, сколько бы одинаковых чёрных пальто ни висело. Билет с местом «ряд 5, место 12» — внешний ключ: он ссылается на кресло, которое существует. Билет на «ряд 99» не продадут.',
      tech: 'Первичный ключ (PRIMARY KEY) — минимальный набор столбцов, однозначно определяющий строку; не NULL, уникален. Естественный ключ — из предметной области (ИНН, VIN), суррогатный — искусственный (id, UUID). Внешний ключ (FOREIGN KEY) — столбец, значения которого должны существовать в первичном (или уникальном) ключе другой таблицы — ссылочная целостность. NULL — отсутствие значения (неизвестно или неприменимо). Ограничения целостности: NOT NULL, UNIQUE, CHECK, PRIMARY KEY, FOREIGN KEY, DEFAULT (Дейт; стандарт SQL ISO/IEC 9075).'
    },
    lead: ui.brief({
      situation: 'Глеб рисует на доске таблицы client, car, booking. «Мне от аналитика нужно три вещи: как найти строку, на что она ссылается и что база должна запрещать». Вера: «Ключ, связь, ограничение».',
      todo: [
        'Выберите, что сделать первичным ключом клиента, — увидите, почему ФИО, телефон и email не годятся.',
        'Нажмите на строку записи — подсветится клиент, на которого она ссылается.',
        'Переключите связи 1:1, 1:N, M:N и загрузите живой пример M:N из базы.',
        'Запустите команды-нарушители в песочнице: это настоящие ошибки SQLite на копии базы «Искры».'
      ],
      look: 'Внешний ключ всегда стоит на стороне «многих» (машина знает владельца, а не наоборот). M:N без отдельной таблицы не бывает.'
    }),
    render(el) {
      el.classList.add('m4d-root');
      const st = { pk: 'id', bk: 0, rel: '1n', nul: 'email' };
      el.innerHTML = `<div class="stack">
        <h3 class="m4d-h3">1. Первичный ключ: что однозначно указывает на клиента?</h3>
        <div class="m4d-chips">${PK_C.map(c => `<button type="button" class="m4d-chip" data-pkc="${c.v}">${esc(c.t)}</button>`).join('')}</div>
        <div data-pk-out></div>
        <div class="m4d-grid2">
          <div class="m4d-box"><b class="k">Естественный ключ</b><div>Берётся из жизни: VIN машины, ИНН компании, код услуги «TO-1». Плюс — понятен людям. Минус — жизнь меняется: госномер меняют при перерегистрации, VIN клиент часто не знает.</div></div>
          <div class="m4d-box"><b class="k">Суррогатный ключ</b><div>Номер или UUID, который выдаёт система. Ничего не значит — поэтому стабилен. В «Искре» у всех таблиц <code>id</code>, а естественные кандидаты (phone, plate, vin, inn, code) — с ограничением <code>UNIQUE</code>.</div></div>
        </div>
        <div class="m4d-box"><b class="k">Составной ключ</b><div>Ключ из нескольких столбцов. В <code>booking_service</code> пара <code>(booking_id, service_id)</code> — первичный ключ: одну услугу нельзя добавить в запись дважды.</div></div>
        <h3 class="m4d-h3">2. Внешний ключ: ссылка на строку другой таблицы</h3>
        <p class="small dim">Нажмите на номер записи слева.</p>
        <div class="m4d-grid2"><div class="m4d-mini" data-bk></div><div class="m4d-mini" data-cli></div></div>
        <div data-fk-out></div>
        <h3 class="m4d-h3">3. Три вида связей</h3>
        <div>${ui.seg('rel', RELS.map(r => ({ v: r.v, t: r.t })), st.rel)}</div>
        <div data-rel></div>
        <div class="row"><button type="button" class="btn sm" data-live-mn>Живой пример: услуги в записях 2 и 3</button></div>
        <div data-live-mn-out class="m4d-live"></div>
        <h3 class="m4d-h3">4. NULL — «значения нет»</h3>
        <div>${ui.seg('nul', [{ v: 'email', t: 'email клиента' }, { v: 'post', t: 'пост в записи' }, { v: 'closed', t: 'когда выдан' }, { v: 'zero', t: 'NULL, 0 и пустая строка' }], st.nul)}</div>
        <div data-nul></div>
        <h3 class="m4d-h3">5. Ограничения: база проверяет сама</h3>
        ${ui.table(['Ограничение', 'Что запрещает', 'Пример в «Искре»'], [
          ['<code>PRIMARY KEY</code>', 'пустой или повторный ключ', '<code>client.id</code>'],
          ['<code>NOT NULL</code>', 'пустое значение', 'телефон клиента, начало записи'],
          ['<code>UNIQUE</code>', 'повтор значения', 'телефон, госномер, номер заказ-наряда, <code>work_order.booking_id</code>'],
          ['<code>CHECK</code>', 'значение вне правила', 'статус из списка; сумма платежа больше нуля; окончание позже начала'],
          ['<code>FOREIGN KEY</code>', 'ссылку на несуществующую строку и удаление строки, на которую ссылаются', '<code>booking.car_id → car.id</code>'],
          ['<code>DEFAULT</code>', 'не запрещает — подставляет значение, если не указали', '<code>no_show_count = 0</code>, статус заказ-наряда <code>open</code>']
        ])}
        <p class="small dim">Песочница: команда выполняется на свежей копии учебной базы, общая база не меняется.</p>
        <div class="m4d-chips">${CONSTR_DEMO.map((d, i) => `<button type="button" class="m4d-chip" data-cd="${i}">${esc(d.t)}</button>`).join('')}</div>
        <div data-cd-out class="m4d-live"></div>
        ${interview('Чем первичный ключ отличается от UNIQUE? Как сделать связь «многие ко многим»?', 'Первичный ключ — один на таблицу, не NULL, по нему ссылаются внешние ключи. UNIQUE может быть несколько, и (в большинстве СУБД) допускает NULL — как <code>car.vin</code>. M:N — через связующую таблицу с двумя внешними ключами: <code>booking_service(booking_id, service_id)</code>. Бонус к ответу: сказать, что у связующей таблицы бывают свои атрибуты (количество, цена на момент заказа) — тогда это уже полноценная сущность.')}
      </div>`;
      function drawPk() {
        TR.$$('[data-pkc]', el).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.pkc === st.pk)));
        const c = PK_C.find(x => x.v === st.pk);
        TR.$('[data-pk-out]', el).innerHTML = `<div class="m4d-box ${c.s === 'ok' ? 'ok' : c.s === 'bad' ? 'bad' : 'info'}"><b class="k">${c.s === 'ok' ? 'Годится' : c.s === 'warn' ? 'Кандидат, но лучше нет' : 'Не годится'}</b><div>${c.d}</div></div>`;
      }
      function drawFk() {
        const cur = BK[st.bk];
        TR.$('[data-bk]', el).innerHTML = `<table><caption>booking</caption><thead><tr><th class="pk">PK id</th><th class="fk">FK client_id</th><th>станция</th><th>start_at</th></tr></thead><tbody>${BK.map((r, i) => `<tr class="${i === st.bk ? 'on' : ''}"><td><button type="button" class="cell" data-bki="${i}" aria-pressed="${i === st.bk}">${r[0]}</button></td><td>${r[1]}</td><td>${esc(r[2])}</td><td>${esc(r[3])}</td></tr>`).join('')}</tbody></table>`;
        TR.$('[data-cli]', el).innerHTML = `<table><caption>client</caption><thead><tr><th class="pk">PK id</th><th>full_name</th></tr></thead><tbody>${CLI.map(r => `<tr class="${r[0] === cur[1] ? 'on' : ''}"><td>${r[0]}</td><td>${esc(r[1])}</td></tr>`).join('')}</tbody></table>`;
        TR.$('[data-fk-out]', el).innerHTML = `<div class="m4d-box acc"><div>Запись ${cur[0]} хранит не ФИО, а <code>client_id = ${cur[1]}</code>. ${cur[1] === 7 ? 'У Елены две записи — обе ссылаются на одну строку клиента: сменит телефон — обе «увидят» новый.' : 'Айгуль Смирнова — другая строка с другим ключом, хоть фамилия та же.'} Попробуйте удалить клиента 7 — база не даст: на него ссылаются записи (по умолчанию <code>ON DELETE RESTRICT</code>).</div></div>`;
      }
      function drawRel() {
        const r = RELS.find(x => x.v === st.rel);
        const pic = r.link
          ? `<div class="m4d-rel" style="grid-template-columns:minmax(0,1fr) auto minmax(0,1fr) auto minmax(0,1fr)"><div class="m4d-ent">${r.a}<small>${r.as}</small></div><div class="m4d-arrow">1 — N</div><div class="m4d-ent link">Услуга в записи<small>${r.link}</small></div><div class="m4d-arrow">N — 1</div><div class="m4d-ent">${r.b}<small>${r.bs}</small></div></div>`
          : `<div class="m4d-rel"><div class="m4d-ent">${r.a}<small>${r.as}</small></div><div class="m4d-arrow">${r.t}</div><div class="m4d-ent">${r.b}<small>${r.bs}</small></div></div>`;
        TR.$('[data-rel]', el).innerHTML = `<div class="stack">${pic}<div class="m4d-grid2">
          <div class="m4d-box acc"><b class="k">Где живёт связь</b><div>${r.fk}</div></div>
          <div class="m4d-box"><b class="k">В «Искре»</b><div>${r.ex}</div></div>
          <div class="m4d-box info"><b class="k">В жизни</b><div>${r.home}</div></div>
          <div class="m4d-box bad"><b class="k">Типичная ошибка</b><div>${r.err}</div></div></div></div>`;
      }
      const NUL = {
        email: 'У Айгуль Смирновой email не указан: <code>email = NULL</code>. Значение <b>неизвестно</b> — может, его нет, может, не спросили. Поле разрешает NULL, потому что регистрация — по телефону.',
        post: 'Клиент записался онлайн, пост назначит мастер утром: до этого <code>booking.post_id = NULL</code>. Значение <b>пока не применимо</b>. Если запретить NULL, онлайн-запись придётся делать «с постом наугад».',
        closed: '<code>work_order.closed_at</code> пусто, пока машина не выдана. NULL здесь — не ошибка, а состояние: «ещё не наступило».',
        zero: '<b>NULL ≠ 0 ≠ пустая строка.</b> Пробег NULL — «не знаем», пробег 0 — «новая машина». Email «» — кто-то стёр текст, но поле не пустое. И ловушка для запросов: <code>email = NULL</code> никогда не истинно, нужно <code>email IS NULL</code> — подробно на занятии по SQL. Для аналитика: у каждого необязательного поля спросите «что значит пусто?» и запишите в словарь данных.'
      };
      function drawNul() { TR.$('[data-nul]', el).innerHTML = `<div class="m4d-box">${NUL[st.nul]}</div>`; }
      TR.on(el, 'click', '[data-pkc]', (e, b) => { st.pk = b.dataset.pkc; drawPk(); });
      TR.on(el, 'click', '[data-bki]', (e, b) => { st.bk = +b.dataset.bki; drawFk(); });
      TR.on(el, 'click', '[data-live-mn]', () => live(TR.$('[data-live-mn-out]', el), 'SELECT bs.booking_id, s.code, s.name, s.price\nFROM booking_service bs\nJOIN service s ON s.id = bs.service_id\nWHERE bs.booking_id IN (2, 3)\nORDER BY bs.booking_id;'));
      TR.on(el, 'click', '[data-cd]', (e, b) => { TR.$$('[data-cd]', el).forEach(x => x.setAttribute('aria-pressed', String(x === b))); const d = CONSTR_DEMO[+b.dataset.cd]; liveFresh(TR.$('[data-cd-out]', el), d.sql, d.c); });
      ui.onSeg(el, (n, v) => { if (n === 'rel') { st.rel = v; drawRel(); } if (n === 'nul') { st.nul = v; drawNul(); } });
      drawPk(); drawFk(); drawRel(); drawNul();
      el.insertAdjacentHTML('beforeend', anNote('Ограничения — это <b>бизнес-правила, переведённые на язык базы</b>. Аналитик не пишет DDL (команды создания таблиц), но для каждого поля говорит: обязательно ли, уникально ли, из какого списка, на что ссылается и <b>что значит пусто</b>. Перестараться так же опасно, как недосмотреть: лишний NOT NULL не даст сохранить реальную ситуацию — это проверим в лаборатории.'));
    }
  };

  // =====================================================================
  // Практика 2. Первичные ключи и связи для 8 пар
  // =====================================================================
  const PKT = [
    { id: 'client', t: 'client — клиент', c: [['name', 'ФИО'], ['phone', 'телефон'], ['email', 'email'], ['id', 'id (суррогатный)']], ok: 'id', warn: { phone: 'Телефон уникален, но меняется — а на ключ ссылаются записи и бонусы. Пусть будет UNIQUE, а ключом — id. Засчитано наполовину.' }, bad: 'ФИО повторяются и меняются, email бывает пустым — первичный ключ не может быть ни повторным, ни пустым.' },
    { id: 'car', t: 'car — автомобиль', c: [['plate', 'госномер'], ['vin', 'VIN'], ['id', 'id (суррогатный)']], ok: 'id', warn: { vin: 'VIN стабилен, но клиент часто его не знает — поле может быть NULL, а ключ пустым быть не может. Засчитано наполовину.' }, bad: 'Госномер меняется при перерегистрации, а вместе с ним пришлось бы менять все ссылки из записей и заказ-нарядов.' },
    { id: 'service', t: 'service — услуга каталога', c: [['code', 'код (TO-1)'], ['name', 'название'], ['id', 'id (суррогатный)']], ok: 'id', warn: { code: 'Код «TO-1» — хороший естественный ключ, если его никогда не переименуют. Глеб всё равно предпочитает id, а код — UNIQUE. Засчитано наполовину.' }, bad: 'Название меняется («ТО-1: замена масла и фильтра» → «ТО-1 расширенное») и длинное — плохой ключ.' },
    { id: 'bs', t: 'booking_service — услуга в записи', c: [['b', 'booking_id'], ['s', 'service_id'], ['bs', '(booking_id, service_id)'], ['id', 'отдельный id']], ok: 'bs', warn: { id: 'Можно, но тогда обязательно UNIQUE(booking_id, service_id) — иначе ТО-1 добавят в запись дважды. Засчитано наполовину.' }, bad: 'Один booking_id повторяется (в записи несколько услуг), один service_id — тоже (ТО-1 во многих записях). Уникальна только пара.' }
  ];
  const PAIRS = [
    { id: 'q1', a: 'Станция', b: 'Пост', type: '1n', where: 'b', why: 'На станции 4–8 постов, пост — на одной станции. <code>post.station_id</code>.' },
    { id: 'q2', a: 'Клиент', b: 'Машина', type: '1n', where: 'b', why: 'У клиента может быть несколько машин, у машины — один владелец. <code>car.client_id</code>.' },
    { id: 'q3', a: 'Запись', b: 'Услуга', type: 'mn', where: 'link', why: 'В записи несколько услуг, услуга — во многих записях. Связующая таблица <code>booking_service</code>.' },
    { id: 'q4', a: 'Запись', b: 'Заказ-наряд', type: '11', where: 'b', alt: { where: { a: 'Ссылку можно держать и в записи, но заказ-наряд появляется позже и бывает без записи: удобнее, чтобы он сам ссылался на запись (<code>work_order.booking_id UNIQUE</code>).' } }, why: 'Одна запись — не больше одного заказ-наряда, и наоборот. <code>work_order.booking_id</code> с UNIQUE; пусто, если клиент без записи.' },
    { id: 'q5', a: 'Заказ-наряд', b: 'Строка заказ-наряда', type: '1n', where: 'b', why: 'В наряде много строк (работы и запчасти), строка — в одном наряде. <code>work_item.work_order_id</code>.' },
    { id: 'q6', a: 'Компания', b: 'Клиент', type: '1n', where: 'b', why: 'У «Шашки» много водителей-клиентов, клиент — сотрудник не больше чем одной компании. <code>client.company_id</code>, у частных — NULL.' },
    { id: 'q7', a: 'Заказ-наряд', b: 'Платёж', type: '1n', where: 'b', alt: { type: { '11': 'Кажется, что один наряд — один платёж. Но карта может не пройти (failed), и клиент оплатит повторно через СБП — два платежа на один наряд. 1:1 потеряет историю.' } }, why: 'Картой не прошло — оплатили СБП: два платежа на один наряд. <code>payment.work_order_id</code>.' },
    { id: 'q8', a: 'Станция', b: 'Услуга', type: 'mn', where: 'link', why: 'Шиномонтаж есть не на всех станциях, ТО — на всех. Нужна связующая таблица «услуга на станции» (station_service) — в учебной базе её пока нет, это вопрос к Марине Олеговне.' }
  ];
  const TYPE_T = { '11': '1 : 1', '1n': '1 : N', mn: 'M : N' };
  function keysEval(ans) {
    const a = ans || {}, pk = a.pk || {}, rel = a.rel || {};
    const pks = PKT.map(p => { const g = pk[p.id]; const s = !g ? 'none' : g === p.ok ? 'ok' : p.warn[g] ? 'warn' : 'bad'; return { p, g, s, pts: s === 'ok' ? 1 : s === 'warn' ? 0.5 : 0 }; });
    const prs = PAIRS.map(p => {
      const g = rel[p.id] || {};
      const tS = !g.type ? 'none' : g.type === p.type ? 'ok' : (p.alt && p.alt.type && p.alt.type[g.type]) ? 'warn' : 'bad';
      let wS = !g.where ? 'none' : g.where === p.where ? 'ok' : (p.alt && p.alt.where && p.alt.where[g.where]) ? 'warn' : 'bad';
      if (g.type === 'mn' && g.where && g.where !== 'link' && tS === 'ok') wS = 'bad';
      const pts = (tS === 'ok' ? 0.5 : 0) + (wS === 'ok' ? 0.5 : wS === 'warn' ? 0.25 : 0);
      const s = pts >= 1 ? 'ok' : pts > 0 ? 'warn' : (g.type || g.where ? 'bad' : 'none');
      return { p, g, tS, wS, s, pts };
    });
    const score = Math.round((0.35 * pks.reduce((s, x) => s + x.pts, 0) / PKT.length + 0.65 * prs.reduce((s, x) => s + x.pts, 0) / PAIRS.length) * 100) / 100;
    return { pks, prs, score };
  }
  const taskKeys = {
    id: 't-keys', title: 'Первичные ключи и связи: 4 таблицы и 8 пар',
    simple: howKeys.simple,
    lead: ui.brief({
      situation: 'Глеб: «Перед тем как я создам таблицы, скажи мне две вещи: по чему я найду строку и где хранится каждая связь». Вера: «Начните с ключей, потом пройдитесь по парам».',
      todo: [
        'Для четырёх таблиц выберите первичный ключ.',
        'Для восьми пар сущностей выберите вид связи (1:1, 1:N, M:N) и где она хранится: внешний ключ в первой таблице, во второй или отдельная связующая таблица.',
        'Нажмите «Проверить». Засчитывается от 80 %.'
      ],
      lookTitle: 'Подсказка',
      look: 'Задайте два вопроса в обе стороны: «у одной станции сколько постов?» и «у одного поста сколько станций?». Если «много» в обе стороны — M:N и связующая таблица. Внешний ключ — на стороне «многих».'
    }),
    blank: () => ({ pk: {}, rel: {} }),
    reference: () => ({ pk: Object.fromEntries(PKT.map(p => [p.id, p.ok])), rel: Object.fromEntries(PAIRS.map(p => [p.id, { type: p.type, where: p.where }])) }),
    render(el, ctx) {
      el.classList.add('m4d-root');
      const ans = ctx.ans; ans.pk = ans.pk || {}; ans.rel = ans.rel || {};
      const ev = ctx.result ? keysEval(ans) : null;
      el.innerHTML = `<div class="stack"><h3 class="m4d-h3">Первичные ключи</h3><div class="m4d-grid2" data-pks></div>
        <h3 class="m4d-h3">Связи</h3><div class="m4d-pairs" data-prs></div></div>`;
      const ro = ctx.readonly ? 'disabled' : '';
      TR.$('[data-pks]', el).innerHTML = PKT.map((p, i) => {
        const x = ev && ev.pks[i], g = ans.pk[p.id];
        return `<div class="m4d-pk ${x && g ? x.s : ''}"><b class="mono">${esc(p.t)}</b><div class="m4d-tg">${p.c.map(c => `<button type="button" data-pk="${p.id}" data-v="${c[0]}" aria-pressed="${g === c[0]}" ${ro}>${esc(c[1])}</button>`).join('')}</div>
          ${x && g && x.s !== 'ok' ? `<div class="small">${x.s === 'warn' ? p.warn[g] : p.bad}</div>` : ''}${x && x.s === 'ok' ? '<div class="small">Верно.</div>' : ''}</div>`;
      }).join('');
      TR.$('[data-prs]', el).innerHTML = PAIRS.map((p, i) => {
        const g = ans.rel[p.id] || {}, x = ev && ev.prs[i];
        let why = '';
        if (x && x.s !== 'none') {
          if (x.s === 'ok') why = p.why;
          else if (x.tS === 'warn') why = p.alt.type[g.type];
          else if (x.wS === 'warn') why = p.alt.where[g.where] + ' Засчитано частично.';
          else why = x.tS !== 'ok' ? `Спросите в обе стороны: у одного «${esc(p.a)}» сколько «${esc(p.b)}»? А наоборот?` : (p.type === 'mn' ? 'Для M:N внешнего ключа в одной из таблиц мало: нужна связующая таблица.' : `Внешний ключ ставят на стороне «многих» — у той таблицы, чья строка ссылается на одну строку другой.`);
        }
        return `<div class="m4d-pair ${x && x.s !== 'none' ? x.s : ''}"><div><b>${esc(p.a)}</b> — <b>${esc(p.b)}</b></div>
          <select data-pr="${p.id}" data-f="type" aria-label="Вид связи ${esc(p.a)} — ${esc(p.b)}" ${ro}><option value="">вид связи…</option>${Object.keys(TYPE_T).map(k => `<option value="${k}" ${g.type === k ? 'selected' : ''}>${TYPE_T[k]}</option>`).join('')}</select>
          <select data-pr="${p.id}" data-f="where" aria-label="Где хранится связь ${esc(p.a)} — ${esc(p.b)}" ${ro}><option value="">где хранится…</option><option value="a" ${g.where === 'a' ? 'selected' : ''}>внешний ключ в «${esc(p.a)}»</option><option value="b" ${g.where === 'b' ? 'selected' : ''}>внешний ключ в «${esc(p.b)}»</option><option value="link" ${g.where === 'link' ? 'selected' : ''}>связующая таблица</option></select>
          ${why ? `<div class="why">${why}</div>` : ''}</div>`;
      }).join('');
      TR.on(el, 'click', '[data-pk]', (e, b) => { if (ctx.readonly) return; ans.pk[b.dataset.pk] = b.dataset.v; ctx.save(); TR.$$(`[data-pk="${b.dataset.pk}"]`, el).forEach(x => x.setAttribute('aria-pressed', String(x === b))); });
      el.addEventListener('change', e => { const s = e.target.closest('[data-pr]'); if (!s) return; const r = ans.rel[s.dataset.pr] = ans.rel[s.dataset.pr] || {}; if (s.value) r[s.dataset.f] = s.value; else delete r[s.dataset.f]; ctx.save(); });
    },
    check(ans) {
      const ev = keysEval(ans), notes = [];
      ev.pks.forEach(x => { if (x.s === 'ok') notes.push({ ok: true, html: `${esc(x.p.t)}: ключ выбран верно.` }); else if (x.s === 'warn') notes.push({ ok: 'warn', html: `${esc(x.p.t)}: ${x.p.warn[x.g]}` }); else notes.push({ ok: false, html: `${esc(x.p.t)}: ${x.g ? x.p.bad : 'ключ не выбран.'}` }); });
      ev.prs.forEach(x => {
        const lbl = `${esc(x.p.a)} — ${esc(x.p.b)}`;
        if (x.s === 'ok') notes.push({ ok: true, html: `${lbl}: ${TYPE_T[x.p.type]}. ${x.p.why}` });
        else if (x.s === 'none') notes.push({ ok: false, html: `${lbl}: не заполнено.` });
        else notes.push({ ok: x.pts > 0 ? 'warn' : false, html: `${lbl}: ${x.tS !== 'ok' ? 'вид связи не тот' : 'вид верный, но связь хранится не там'}. ${x.p.why}` });
      });
      const mnMiss = ev.prs.filter(x => x.p.type === 'mn' && x.s !== 'ok').length;
      return {
        ok: ev.score >= 0.8, score: ev.score, notes,
        summary: `Ключи: ${ev.pks.filter(x => x.s === 'ok').length} из 4; связи полностью верно: ${ev.prs.filter(x => x.s === 'ok').length} из 8.`,
        mentor: mnMiss ? 'Проверьте пары, где «много» в обе стороны: запись — услуга, станция — услуга. Внешний ключ в одной таблице хранит только одно значение — значит, нужна третья таблица.' : (ev.score < 0.8 ? 'Правило Глеба: внешний ключ живёт там, где «много». Машин у клиента много — значит, client_id лежит в машине.' : '')
      };
    },
    explain: `<p><b>Ключи.</b> Во всех таблицах «Искры» — суррогатный <code>id</code>, а естественные кандидаты (телефон, госномер, VIN, код услуги, ИНН) — с ограничением <code>UNIQUE</code>. Так ключ не меняется никогда, а бизнес-уникальность всё равно проверяется. Исключение — связующая таблица <code>booking_service</code>: её ключ — пара внешних ключей.</p>
      <p><b>Связи.</b> Четыре правила, которые закрывают почти все случаи:</p>
      <ul class="checks"><li>Вопрос задают в обе стороны: «у одного А сколько Б?» и «у одного Б сколько А?».</li><li>1:N — внешний ключ на стороне N (<code>car.client_id</code>).</li><li>1:1 — внешний ключ с UNIQUE в той таблице, которая появляется позже или может отсутствовать (<code>work_order.booking_id</code>).</li><li>M:N — связующая таблица с двумя внешними ключами.</li></ul>
      <p>Ловушка «Заказ-наряд — Платёж»: кажется, что 1:1, но неуспешная попытка оплаты — тоже платёж (статус <code>failed</code>), и Ольге Викторовне для сверки с ЮKassa важна каждая попытка. «Станция — Услуга» — пример, когда аналитик находит связь, которой ещё нет в модели: вопрос к Марине Олеговне «какие услуги где оказывают?».</p>
      <p>Источник: Дейт, «Введение в системы баз данных» (ключи и ссылочная целостность); Вигерс, «Разработка требований» (модель данных как часть требований).</p>`,
    refNote: 'Наполовину засчитываются естественные ключи-кандидаты (телефон, VIN, код услуги) и отдельный id у booking_service; для пары «Запись — Заказ-наряд» внешний ключ в записи засчитывается частично.',
    report: ans => { const ev = keysEval(ans); return ev.pks.map(x => `- PK ${x.p.t}: ${x.g || '—'} ${mark(x.s)}`).join('\n') + '\n' + ev.prs.map(x => `- ${x.p.a} — ${x.p.b}: ${TYPE_T[x.g.type] || '—'}, ${x.g.where || '—'} ${mark(x.s)}`).join('\n'); }
  };

  // =====================================================================
  // Теория 3. Нормализация, транзакции и ACID, реляционные и документные
  // =====================================================================
  const tbl = (cap, cols, rows, o) => `<div class="m4d-mini"><table><caption>${cap}</caption><thead><tr>${cols.map(c => `<th class="${/^PK/.test(c) ? 'pk' : /^FK/.test(c) ? 'fk' : ''}">${c}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map((v, i) => `<td class="${o && o.hl && o.hl.includes(i) ? 'on' : ''}">${v}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  const NF = [
    { t: 'Исходная', h: 'Одна широкая таблица — как в Excel.', html: () => tbl('запись (как в Excel)', ['дата', 'клиент', 'телефон', 'станция', 'адрес станции', 'услуги'], [['25.01 10:00', 'Смирнова Елена', '+79172345678', 'Победы', 'пр. Победы, 141', 'ТО-1, Шиномонтаж'], ['26.01 12:00', 'Смирнова Елена', '+79172345678', 'Победы', 'пр. Победы, 141', 'Диагностика']], { hl: [5] }), why: 'В ячейке «услуги» — список. Клиент и станция повторяются в каждой строке.' },
    { t: '1НФ', h: 'Первая нормальная форма: в каждой ячейке одно значение, нет повторяющихся групп («Услуга 1», «Услуга 2»).', html: () => tbl('запись_услуга', ['PK id записи', 'PK услуга', 'клиент', 'телефон', 'станция', 'адрес станции', 'цена услуги'], [['1', 'ТО-1', 'Смирнова Елена', '+79172345678', 'Победы', 'пр. Победы, 141', '2 500'], ['1', 'Шиномонтаж', 'Смирнова Елена', '+79172345678', 'Победы', 'пр. Победы, 141', '2 400'], ['2', 'Диагностика', 'Смирнова Елена', '+79172345678', 'Победы', 'пр. Победы, 141', '900']], { hl: [2, 3, 4, 5] }), why: 'Список разложен в строки, ключ стал составным (запись, услуга). Но клиент и станция зависят только от записи — от <b>части</b> ключа, а цена — только от услуги.' },
    { t: '2НФ', h: 'Вторая: каждый неключевой столбец зависит от <b>всего</b> ключа, а не от его части. Выносим то, что зависит только от записи, и то, что зависит только от услуги.', html: () => `<div class="m4d-tables">${tbl('booking', ['PK id', 'клиент', 'телефон', 'станция', 'адрес станции'], [['1', 'Смирнова Елена', '+79172345678', 'Победы', 'пр. Победы, 141'], ['2', 'Смирнова Елена', '+79172345678', 'Победы', 'пр. Победы, 141']], { hl: [1, 2, 3, 4] })}${tbl('booking_service', ['PK FK booking_id', 'PK FK service_id'], [['1', '1'], ['1', '3'], ['2', '5']])}${tbl('service', ['PK id', 'название', 'цена'], [['1', 'ТО-1', '2 500'], ['3', 'Шиномонтаж', '2 400'], ['5', 'Диагностика', '900']])}</div>`, why: 'Цена услуги теперь в одном месте. Но в booking телефон зависит от клиента, а адрес — от станции, то есть от неключевого столбца: это транзитивная зависимость.' },
    { t: '3НФ', h: 'Третья: неключевые столбцы зависят <b>только от ключа</b>, а не друг от друга. Клиент и станция — отдельные таблицы, запись хранит ссылки.', html: () => `<div class="m4d-tables">${tbl('booking', ['PK id', 'FK client_id', 'FK station_id', 'start_at'], [['1', '7', '1', '2027-01-25 10:00'], ['2', '7', '1', '2027-01-26 12:00']], { hl: [1, 2] })}${tbl('client', ['PK id', 'full_name', 'phone'], [['7', 'Смирнова Елена', '+79172345678']])}${tbl('station', ['PK id', 'name', 'address'], [['1', 'Победы', 'пр. Победы, 141']])}${tbl('booking_service', ['PK FK booking_id', 'PK FK service_id'], [['1', '1'], ['1', '3'], ['2', '5']])}</div>`, why: 'Каждый факт — в одном месте. Это и есть схема учебной базы «Искры». Телефон Елены меняется в одной строке, станцию с адресом можно завести до первой записи.' }
  ];
  const TX_OPS = [
    ['INSERT INTO payment … status = \'paid\'', 'Платёж 7 800 ₽ за ЗН-1-0457 принят'],
    ['UPDATE work_order SET status = \'closed\'', 'Заказ-наряд «Выдан»'],
    ['INSERT INTO bonus_tx … +390', 'Начислено 5 % от работ (BR-11)'],
    ['UPDATE client SET bonus_balance = bonus_balance + 390', 'Баланс Елены увеличен']
  ];
  const ACID = [
    { v: 'A', t: 'Atomicity', ru: 'Атомарность', d: 'Все операции транзакции выполняются как одна: либо все, либо ни одной. Сбой посередине — СУБД откатывает сделанное (ROLLBACK).', ex: 'Платёж есть, а бонусов нет — так не бывает: откатится и платёж.' },
    { v: 'C', t: 'Consistency', ru: 'Согласованность', d: 'Транзакция переводит базу из одного правильного состояния в другое: все ограничения выполнены до и после.', ex: 'Баланс баллов не уйдёт в минус, а платёж не сошлётся на несуществующий заказ-наряд — иначе транзакция не завершится.' },
    { v: 'I', t: 'Isolation', ru: 'Изолированность', d: 'Параллельные транзакции не мешают друг другу и не видят чужих незавершённых изменений.', ex: 'Понедельник, 09:00: два клиента одновременно берут последний слот на посту 3 — успеет один, второй получит «слот занят», а не двойную запись.' },
    { v: 'D', t: 'Durability', ru: 'Долговечность', d: 'После подтверждения (COMMIT) изменения не пропадут, даже если сразу отключат свет.', ex: 'Кассир увидел «Оплачено» — значит, платёж уже на диске, и после перезагрузки сервера он на месте.' }
  ];
  const howNorm = {
    id: 'how-norm', covers: ['t-norm', 't-explain'], title: 'Как это работает: нормализация, транзакции и ACID', free: true, noReset: true,
    simple: {
      icon: '🧩',
      plain: 'Нормализация — уборка таблиц: каждый факт кладём в одну коробку и подписываем номером, а в других местах держим только номер. Транзакция — «всё или ничего»: если оплата состоит из четырёх шагов и на третьем отключили свет, база отменит и первые два, чтобы не осталось «половины оплаты».',
      analogy: 'Нормализация — как разложить вещи после переезда: посуда — в кухонный шкаф, книги — на полку, а не «всё, что было в коробке №3», в одну кучу. Транзакция — перевод денег другу: с вашей карты списалось, а другу не пришло — банк так не должен; либо оба шага, либо ни одного.',
      tech: 'Нормальные формы (Кодд, 1970–1971): 1НФ — атомарные значения, нет повторяющихся групп; 2НФ — 1НФ и нет частичных зависимостей неключевых атрибутов от составного ключа; 3НФ — 2НФ и нет транзитивных зависимостей (неключевой атрибут зависит от другого неключевого). Мнемоника Б. Кента: «ключ, весь ключ и ничего, кроме ключа». Транзакция — логическая единица работы; свойства ACID (Т. Хердер, А. Ройтер, 1983): атомарность, согласованность, изолированность, долговечность.'
    },
    lead: ui.brief({
      situation: 'Вера разбирает с вами, как из Excel Марины получается схема учебной базы. А Ольга Викторовна, главный бухгалтер, спрашивает: «Если на кассе моргнёт свет посреди оплаты — что останется в базе?»',
      todo: [
        'Пройдите нормализацию по шагам: исходная таблица → 1НФ → 2НФ → 3НФ. Подсвечены столбцы, которые на следующем шаге «уедут».',
        'В симуляторе оплаты выберите, на каком шаге случится сбой, и сравните «без транзакции» и «с транзакцией».',
        'Нажмите на буквы ACID и посмотрите, чем реляционная модель отличается от документной.'
      ],
      look: 'Вопрос для каждого столбца: «от чего он зависит?». Телефон зависит от клиента, а не от записи, — значит, ему место в таблице клиентов.'
    }),
    render(el) {
      el.classList.add('m4d-root');
      const st = { nf: 0, tx: 'no', crash: 2, acid: 'A', model: 'rel' };
      el.innerHTML = `<div class="stack">
        <h3 class="m4d-h3">1. Нормализация по шагам</h3>
        <div class="m4d-steps" data-nfs></div>
        <div data-nf></div>
        <div class="m4d-box info"><b class="k">Запомнить</b><div>«Ключ, весь ключ и ничего, кроме ключа»: 1НФ — есть ключ и одно значение в ячейке; 2НФ — всё зависит от <b>всего</b> ключа; 3НФ — <b>ничего, кроме</b> ключа. Выше 3НФ (НФБК, 4НФ, 5НФ) на практике аналитику почти не нужны.</div></div>
        <div class="m4d-box"><b class="k">А бывает наоборот?</b><div>Да: иногда данные <b>сознательно</b> дублируют — денормализуют — ради скорости отчётов или чтобы сохранить историю (цена в строке заказ-наряда — копия на момент добавления). Это осознанное решение с причиной, а не «так получилось». Разберём на занятии о проектировании данных.</div></div>
        <h3 class="m4d-h3">2. Транзакция: оплата на кассе станции</h3>
        <div class="row">${ui.seg('tx', [{ v: 'no', t: 'Без транзакции' }, { v: 'yes', t: 'В одной транзакции' }], st.tx)}</div>
        <div class="row"><span class="small dim">Сбой после шага:</span>${ui.seg('crash', [{ v: '0', t: 'нет сбоя' }, { v: '1', t: '1' }, { v: '2', t: '2' }, { v: '3', t: '3' }], String(st.crash))}</div>
        <div data-tx></div>
        <div class="m4d-acid" data-acid-b>${ACID.map(a => `<button type="button" data-acid="${a.v}" aria-pressed="${a.v === st.acid}"><b>${a.v}</b><span>${a.ru}</span><small>${a.t}</small></button>`).join('')}</div>
        <div data-acid-out></div>
        <h3 class="m4d-h3">3. Реляционная или документная модель?</h3>
        <div>${ui.seg('model', [{ v: 'rel', t: 'Реляционная: таблицы' }, { v: 'doc', t: 'Документная: JSON' }], st.model)}</div>
        <div data-model></div>
        ${interview('Что такое нормализация и ACID? Приведите пример.', 'Нормализация — разнесение данных по таблицам так, чтобы каждый факт хранился один раз; убирает аномалии вставки, обновления и удаления. 1НФ — атомарные значения, 2НФ — нет зависимости от части составного ключа, 3НФ — нет зависимостей между неключевыми столбцами. ACID — свойства транзакции: атомарность, согласованность, изолированность, долговечность. Пример «оплата → статус → бонусы: всё или ничего» звучит сильнее любого определения.')}
      </div>`;
      function drawNf() {
        TR.$('[data-nfs]', el).innerHTML = NF.map((n, i) => `<button type="button" class="m4d-chip" data-nfi="${i}" aria-pressed="${i === st.nf}">${i ? '→ ' : ''}${n.t}</button>`).join('') + (st.nf < NF.length - 1 ? `<button type="button" class="btn sm" data-nfnext>Следующий шаг</button>` : '');
        const n = NF[st.nf];
        TR.$('[data-nf]', el).innerHTML = `<div class="stack"><div class="small"><b>${n.t}.</b> ${n.h}</div>${n.html()}<div class="m4d-box ${st.nf === NF.length - 1 ? 'ok' : 'bad'}"><div>${n.why}</div></div></div>`;
      }
      function drawTx() {
        const c = +st.crash, tx = st.tx === 'yes';
        const rows = TX_OPS.map((o, i) => {
          let cls, s;
          if (!c) { cls = 'done'; s = tx ? 'COMMIT ✓' : 'выполнено'; }
          else if (i < c) { cls = tx ? 'undo' : 'done'; s = tx ? 'откат (ROLLBACK)' : 'выполнено'; }
          else if (i === c) { cls = 'crash'; s = '⚡ сбой'; }
          else { cls = 'lost'; s = 'не выполнено'; }
          return `<div class="m4d-op ${cls}"><span class="n">${i + 1}</span><div><code>${esc(o[0])}</code><div class="small dim">${esc(o[1])}</div></div><span class="s">${s}</span></div>`;
        }).join('');
        let verdict;
        if (!c) verdict = ui.note('ok', 'Всё прошло', 'Все четыре шага выполнены. ' + (tx ? 'COMMIT — изменения зафиксированы и переживут отключение света (D — долговечность).' : 'Повезло: без транзакции всё хорошо, пока ничего не сломалось.'));
        else if (tx) verdict = ui.note('ok', 'База как до оплаты', `Сбой на шаге ${c + 1} — СУБД откатила шаги 1–${c}. Платежа нет, наряд не выдан, баллов нет: кассир видит ошибку и повторяет оплату. Ольге Викторовне нечего «сверять вручную».`);
        else verdict = ui.note('bad', 'Половина оплаты', c === 1 ? 'Деньги приняты, а заказ-наряд не «Выдан»: машина «висит» на станции, а клиенту завтра начислят плату за хранение (BR-13). Бонусов нет.' : c === 2 ? 'Платёж есть, наряд выдан, а баллы не начислены: Елена звонит «где мои 390 баллов?», и никто не знает, начислять ли вручную — вдруг начислит дважды.' : 'Операция по баллам записана, а баланс не увеличен: история и баланс расходятся — через год такие расхождения никто не распутает.');
        TR.$('[data-tx]', el).innerHTML = `<div class="m4d-tx">${tx ? '<div class="small mono dim">BEGIN;</div>' : ''}${rows}${tx ? `<div class="small mono dim">${c ? 'ROLLBACK;' : 'COMMIT;'}</div>` : ''}</div>${verdict}`;
      }
      function drawAcid() {
        TR.$$('[data-acid]', el).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.acid === st.acid)));
        const a = ACID.find(x => x.v === st.acid);
        TR.$('[data-acid-out]', el).innerHTML = `<div class="m4d-grid2"><div class="m4d-box"><b class="k">${a.ru} (${a.t})</b><div>${a.d}</div></div><div class="m4d-box acc"><b class="k">В «Искре»</b><div>${a.ex}</div></div></div>`;
      }
      function drawModel() {
        TR.$('[data-model]', el).innerHTML = st.model === 'rel'
          ? `<div class="m4d-grid2"><div class="m4d-box"><b class="k">Как хранится</b><div>Заказ-наряд — строка в <code>work_order</code>, его работы и запчасти — строки в <code>work_item</code> со ссылкой <code>work_order_id</code>, клиент — в <code>client</code>. Связи — через ключи, данные собирают запросом с JOIN.</div></div>
             <div class="m4d-box ok"><b class="k">Когда выбирают</b><div>Деньги, документы, много связей, строгие правила, транзакции: записи, наряды, платежи «Искры». Примеры СУБД: PostgreSQL, MySQL, Oracle, MS SQL Server, SQLite.</div></div></div>`
          : `<div class="stack">${ui.code(JSON.stringify({ _id: 'ЗН-1-0457', status: 'ready', client: { name: 'Смирнова Елена Андреевна', phone: '+79172345678' }, car: { plate: 'О392ЕТ116', model: 'Kia Rio' }, items: [{ kind: 'service', name: 'ТО-1', price: 2500 }, { kind: 'part', name: 'Фильтр масляный', qty: 1, price: 650 }] }, null, 2), 'json', 'Тот же заказ-наряд одним документом (MongoDB и подобные)')}
             <div class="m4d-grid2"><div class="m4d-box ok"><b class="k">Плюсы</b><div>Всё нужное экрану — одним куском, легко добавить новое поле без изменения схемы. Хорошо для каталогов с разными атрибутами, логов, событий, кэша.</div></div>
             <div class="m4d-box bad"><b class="k">Минусы для «Искры»</b><div>Клиент Елена скопирован в каждый наряд — опять аномалия обновления. Отчёт «выручка по станциям» и транзакция «платёж + бонусы» сложнее. Поэтому основа «Искры» — PostgreSQL; гибкие атрибуты можно держать в его поле JSONB.</div></div></div></div>`;
      }
      TR.on(el, 'click', '[data-nfi]', (e, b) => { st.nf = +b.dataset.nfi; drawNf(); });
      TR.on(el, 'click', '[data-nfnext]', () => { st.nf = Math.min(NF.length - 1, st.nf + 1); drawNf(); });
      TR.on(el, 'click', '[data-acid]', (e, b) => { st.acid = b.dataset.acid; drawAcid(); });
      ui.onSeg(el, (n, v) => { if (n === 'tx') { st.tx = v; drawTx(); } if (n === 'crash') { st.crash = +v; drawTx(); } if (n === 'model') { st.model = v; drawModel(); } });
      drawNf(); drawTx(); drawAcid(); drawModel();
      el.insertAdjacentHTML('beforeend', anNote('Аналитик не обязан помнить определение 2НФ дословно, но обязан <b>увидеть повторяющийся факт</b> и спросить «от чего зависит это поле?». А в требованиях к оплате, бонусам, бронированию слота — явно написать, какие действия должны выполняться <b>как одно целое</b>: «платёж, статус и начисление баллов — в одной транзакции; при сбое — откат и повтор». Глеб это прочитает как задачу, а Лиза — как тест-кейс.'));
    }
  };

  // =====================================================================
  // Практика 3. Нормализовать широкую таблицу
  // =====================================================================
  const NORM_B = [
    { id: 'client', t: 'client', sub: 'клиент' }, { id: 'car', t: 'car', sub: 'автомобиль' }, { id: 'station', t: 'station', sub: 'станция' },
    { id: 'booking', t: 'booking', sub: 'запись' }, { id: 'service', t: 'service', sub: 'услуга каталога' }, { id: 'bs', t: 'booking_service', sub: 'какие услуги в записи' },
    { id: 'calc', t: 'Не хранить', sub: 'вычисляется из других' }
  ];
  const NORM_I = [
    { id: 'n1', t: 'ФИО клиента', ok: 'client' },
    { id: 'n2', t: 'Телефон клиента', ok: 'client', alt: { booking: 'Телефон зависит от клиента, а не от записи: в записи он повторится столько раз, сколько у Елены визитов.' } },
    { id: 'n3', t: 'Email клиента', ok: 'client' },
    { id: 'n4', t: 'Госномер', ok: 'car' },
    { id: 'n5', t: 'Марка и модель', ok: 'car' },
    { id: 'n6', t: 'Название станции', ok: 'station' },
    { id: 'n7', t: 'Адрес станции', ok: 'station', alt: { booking: 'Адрес зависит от станции (транзитивная зависимость) — нарушение 3НФ.' } },
    { id: 'n8', t: 'Дата и время начала', ok: 'booking' },
    { id: 'n9', t: 'Статус записи', ok: 'booking' },
    { id: 'n10', t: 'Канал записи: приложение, сайт, телефон', ok: 'booking' },
    { id: 'n11', t: 'Код и название услуги', ok: 'service' },
    { id: 'n12', t: 'Цена услуги «от» по каталогу', ok: 'service', alt: { bs: 'Цена каталога зависит только от услуги — от части составного ключа (booking_id, service_id): нарушение 2НФ. Копию цены «на момент» хранят в строке заказ-наряда, а не в записи.' } },
    { id: 'n13', t: 'Какие услуги выбраны в записи', ok: 'bs', alt: { booking: 'Список услуг в одной ячейке записи — нарушение 1НФ. Каждая выбранная услуга — отдельная строка связующей таблицы.' } },
    { id: 'n14', t: 'Сумма записи «от» (сумма цен выбранных услуг)', ok: 'calc', alt: { booking: 'Сумму можно хранить ради скорости, но тогда её надо пересчитывать при каждом изменении услуг. Для цены «от» в записи — вычисляем. Засчитано наполовину.' } },
    { id: 'n15', t: 'Возраст машины, лет', ok: 'calc', alt: { car: 'Возраст меняется каждый год сам по себе. Храним год выпуска, а возраст считаем.' } },
    { id: 'n16', t: 'Владелец машины (кто клиент)', ok: 'car', alt: { client: 'У клиента может быть несколько машин: в его строке пришлось бы хранить список. Внешний ключ — на стороне «многих»: car.client_id.' } }
  ];
  const NF_CH = [{ v: '1', t: '1НФ: одно значение в ячейке' }, { v: '2', t: '2НФ: зависимость от всего ключа' }, { v: '3', t: '3НФ: только от ключа, не от других столбцов' }];
  const NF_R = [
    { id: 'f1', t: 'В записи столбец «услуги»: «ТО-1, колодки».', ok: '1', why: 'Список в ячейке — не атомарное значение.' },
    { id: 'f2', t: 'Столбцы «Услуга 1», «Услуга 2», «Услуга 3» в таблице записей.', ok: '1', why: 'Повторяющаяся группа — тоже нарушение 1НФ: а если услуг четыре?' },
    { id: 'f3', t: 'booking_service(booking_id, service_id, service_name): название зависит только от service_id.', ok: '2', why: 'Зависимость от части составного ключа — нарушение 2НФ.' },
    { id: 'f4', t: 'В booking хранится station_address: адрес зависит от station_id.', ok: '3', why: 'Неключевой столбец зависит от другого неключевого — транзитивная зависимость, 3НФ.' },
    { id: 'f5', t: 'В car хранится client_phone рядом с client_id.', ok: '3', why: 'Телефон зависит от client_id, а не от машины — 3НФ.' }
  ];
  function normEval(ans) {
    const v = (ans && ans.v) || {}, m = (ans && ans.m) || {};
    const items = NORM_I.map(r => { const g = v[r.id]; const s = !g ? 'none' : g === r.ok ? 'ok' : (r.alt && r.alt[g]) ? 'warn' : 'bad'; return { r, g, s, pts: s === 'ok' ? 1 : s === 'warn' ? 0.5 : 0 }; });
    const nfs = NF_R.map(r => { const g = m[r.id]; const s = !g ? 'none' : g === r.ok ? 'ok' : 'bad'; return { r, g, s, pts: s === 'ok' ? 1 : 0 }; });
    const score = Math.round((0.7 * items.reduce((s, x) => s + x.pts, 0) / NORM_I.length + 0.3 * nfs.reduce((s, x) => s + x.pts, 0) / NF_R.length) * 100) / 100;
    return { items, nfs, score };
  }
  const bName = id => (NORM_B.find(b => b.id === id) || { t: '—' }).t;
  const taskNorm = {
    id: 't-norm', title: 'Нормализовать таблицу Марины: разнести столбцы',
    simple: howNorm.simple,
    lead: ui.brief({
      situation: 'Глеб: «Марина Олеговна хочет, чтобы в новой системе было “как в её таблице, только онлайн”. Шестнадцать столбцов. Разложи их по таблицам — я по этому создам схему».',
      todo: [
        'Разложите 16 столбцов широкой таблицы по таблицам базы. Если значение можно посчитать из других — в корзину «Не хранить».',
        'Ниже определите, какую нормальную форму нарушает каждый из пяти примеров.',
        'Нажмите «Проверить». Засчитывается от 80 %.'
      ],
      lookTitle: 'Подсказка',
      look: 'Для каждого столбца спросите: «от чего он зависит?» Телефон — от клиента, адрес — от станции, цена «от» — от услуги, время — от записи. Что зависит сразу от записи и услуги — в связующую таблицу.'
    }),
    blank: () => ({ v: {}, m: {} }),
    reference: () => ({ v: Object.fromEntries(NORM_I.map(r => [r.id, r.ok])), m: Object.fromEntries(NF_R.map(r => [r.id, r.ok])) }),
    render(el, ctx) {
      el.classList.add('m4d-root');
      const ans = ctx.ans; ans.v = ans.v || {}; ans.m = ans.m || {};
      const ev = ctx.result ? normEval(ans) : null;
      el.innerHTML = `<div class="stack"><div data-s></div><h3 class="m4d-h3">Какая нормальная форма нарушена?</h3><div data-m></div></div>`;
      let rs = null, rm = null;
      if (ev) {
        rs = {}; ev.items.forEach(x => { if (x.g) rs[x.r.id] = x.s; });
        rm = {}; ev.nfs.forEach(x => { if (x.g) rm[x.r.id] = { s: x.s, why: x.s === 'ok' ? x.r.why : 'Не та форма. Вспомните: «ключ, весь ключ и ничего, кроме ключа».' }; });
      }
      ui.sort(TR.$('[data-s]', el), { items: NORM_I.map(r => ({ id: r.id, t: esc(r.t) })), buckets: NORM_B, value: ans.v, reveal: rs, readonly: ctx.readonly, seed: 'm4d-norm', onChange: v => { ans.v = v; ctx.save(); } });
      ui.match(TR.$('[data-m]', el), { rows: NF_R.map(r => ({ id: r.id, t: esc(r.t) })), choices: NF_CH, value: ans.m, reveal: rm, readonly: ctx.readonly, onChange: v => { ans.m = v; ctx.save(); } });
    },
    check(ans) {
      const ev = normEval(ans), notes = [];
      ev.items.forEach(x => {
        if (x.s === 'ok') return;
        if (x.s === 'warn') notes.push({ ok: 'warn', html: `«${esc(x.r.t)}» → ${esc(bName(x.g))}. ${x.r.alt[x.g]}` });
        else notes.push({ ok: false, html: `«${esc(x.r.t)}» — ${x.g ? `не в ${esc(bName(x.g))}.` : 'не разложено.'} ${x.r.alt ? Object.values(x.r.alt)[0] : `Этот столбец описывает ${esc(NORM_B.find(b => b.id === x.r.ok).sub)}.`}` });
      });
      ev.nfs.forEach(x => { if (x.s !== 'ok') notes.push({ ok: false, html: `«${esc(x.r.t)}» — ${x.r.why}` }); });
      if (!notes.length) notes.push({ ok: true, html: 'Все столбцы на своих местах, нормальные формы названы верно. Это и есть схема учебной базы «Искры».' });
      return {
        ok: ev.score >= 0.8, score: ev.score, notes,
        summary: `Столбцы: верно ${ev.items.filter(x => x.s === 'ok').length} из 16 (частично ${ev.items.filter(x => x.s === 'warn').length}); нормальные формы: ${ev.nfs.filter(x => x.s === 'ok').length} из 5.`,
        mentor: ev.items.some(x => ['n2', 'n7'].includes(x.r.id) && x.s !== 'ok') ? 'Проверьте телефон и адрес: они появляются в записи «за компанию», но зависят не от записи. Повторите вопрос «от чего зависит?».' : (ev.score < 0.8 ? 'Если значение можно получить из других (сумма, возраст) — храните исходное, а результат считайте. Иначе его придётся «не забывать» пересчитывать.' : '')
      };
    },
    explain: `<p>Шестнадцать столбцов Excel становятся шестью таблицами и двумя вычисляемыми значениями:</p>
      <ul class="checks"><li><code>client</code> — ФИО, телефон, email; <code>car</code> — госномер, марка, модель, владелец (<code>client_id</code>); <code>station</code> — название, адрес.</li>
      <li><code>booking</code> — время, статус, канал и ссылки на клиента, машину, станцию; <code>service</code> — код, название, цена «от».</li>
      <li><code>booking_service</code> — какие услуги выбраны (по строке на услугу).</li>
      <li>Сумма «от» и возраст машины — вычисляются: хранить их — значит хранить один факт дважды.</li></ul>
      <p>Тонкость с ценой: <b>цена каталога</b> принадлежит услуге, но в <b>заказ-наряде</b> хранят копию цены на момент добавления (<code>work_item.price</code>) — каталог подорожает, а документ клиента меняться не должен. Это сознательная денормализация ради истории — её подробно разберём в m4-design.</p>
      <p>Источник: Дейт, «Введение в системы баз данных», нормализация; Кодд, «Further Normalization of the Data Base Relational Model» (1971).</p>`,
    refNote: 'Наполовину засчитываются: телефон или адрес станции в записи, цена каталога в booking_service, услуги в записи, сумма «от» в записи, возраст в машине, владелец в клиенте.',
    report: ans => { const ev = normEval(ans); return ev.items.map(x => `- ${x.r.t} → ${x.g ? bName(x.g) : '—'} ${mark(x.s)}`).join('\n') + '\n' + ev.nfs.map(x => `- ${x.r.t} → ${x.g ? x.g + 'НФ' : '—'} ${mark(x.s)}`).join('\n'); }
  };

  // =====================================================================
  // Практика 4. Лаборатория «Неделя Лизы»: ограничения и транзакция → последствия
  // =====================================================================
  const CONS = [
    { id: 'phNN', tb: 'client', f: 'phone', t: 'NOT NULL', ref: true },
    { id: 'phUQ', tb: 'client', f: 'phone', t: 'UNIQUE', ref: true },
    { id: 'emNN', tb: 'client', f: 'email', t: 'NOT NULL', ref: false },
    { id: 'woNN', tb: 'work_order', f: 'booking_id', t: 'NOT NULL', ref: false },
    { id: 'woUQ', tb: 'work_order', f: 'booking_id', t: 'UNIQUE', ref: true },
    { id: 'woFK', tb: 'work_order', f: 'booking_id', t: 'FOREIGN KEY → booking.id', ref: true },
    { id: 'stCK', tb: 'booking', f: 'status', t: 'CHECK (status IN (…список…))', ref: true },
    { id: 'poNN', tb: 'booking', f: 'post_id', t: 'NOT NULL', ref: false },
    { id: 'tmCK', tb: 'booking', f: '', t: 'CHECK (end_at > start_at)', ref: true },
    { id: 'amCK', tb: 'payment', f: 'amount', t: 'CHECK (amount > 0)', ref: true },
    { id: 'tx', tb: 'оплата на кассе', f: '', t: 'платёж + «Выдан» + бонусы — одна транзакция', ref: true }
  ];
  const SCEN = [
    { id: 's1', c: 'phUQ', legit: false, day: 'Пн', t: 'Елена переустановила приложение и регистрируется заново с тем же телефоном.', on: 'База отказала: «такой телефон уже есть» — приложение предложило войти в старый аккаунт. Баллы и история на месте.', off: 'Появилась вторая Елена. Баллы — на старом аккаунте, новые записи — на новом; через две неявки «новой» Елены BR-4 не сработает.' },
    { id: 's2', c: 'phNN', legit: false, day: 'Пн', t: 'Сбой формы на сайте: регистрация ушла без телефона.', on: 'База не сохранила — форма показала ошибку, клиент ввёл телефон.', off: 'В базе клиент без телефона: SMS о готовности (BR-13) отправить некуда, войти в приложение он тоже не сможет.' },
    { id: 's3', c: 'emNN', legit: true, day: 'Вт', t: 'Ильдар Ринатович, 67 лет, записывается через колл-центр: email у него нет.', on: 'База отказала: email обязателен. Оператор вписал «нет@нет.ru» — теперь в базе фальшивый адрес, а чек по 54-ФЗ уйдёт в никуда.', off: 'Записан с пустым email — чек придёт по SMS (BR-10).' },
    { id: 's4', c: 'woNN', legit: true, day: 'Вт', t: 'Таксист «Шашки» заехал без записи — мастер открывает заказ-наряд.', on: 'База отказала: заказ-наряд без записи сохранить нельзя. Марина создаёт «фиктивную запись задним числом» — и портит статистику неявок и загрузки постов.', off: 'Заказ-наряд открыт с пустым booking_id — так и задумано.' },
    { id: 's5', c: 'woUQ', legit: false, day: 'Ср', t: 'Мастер дважды нажал «Открыть заказ-наряд» — медленный интернет.', on: 'Второй заказ-наряд на ту же запись не создался.', off: 'Два заказ-наряда на одну запись: механик добавил работы в один, мастер выставил счёт по другому. Выручка задвоилась в отчёте Тимура Рашидовича.' },
    { id: 's6', c: 'woFK', legit: false, day: 'Ср', t: 'Ошибка в коде: заказ-наряд ссылается на запись № 99999, которой нет.', on: 'База не сохранила — Глеб увидел ошибку в журнале и исправил в тот же день.', off: 'Заказ-наряд-«сирота»: отчёт «запись → наряд» его не видит, Лиза находит его через месяц.' },
    { id: 's7', c: 'stCK', legit: false, day: 'Чт', t: 'Новая версия АРМ отправила статус «arived» (опечатка).', on: 'База отказала, ошибку поймали на тестовом стенде.', off: 'Запись в статусе «arived» не попадает ни в «Клиент приехал», ни в «Неявку»: через 15 минут система освобождает пост (BR-4), хотя машина уже на подъёмнике.' },
    { id: 's8', c: 'poNN', legit: true, day: 'Чт', t: 'Елена записалась онлайн на субботу. Пост назначит мастер утром.', on: 'База отказала: пост обязателен. Приложению пришлось ставить «пост 1» по умолчанию — в субботу у поста 1 оказалось пять машин на одно время.', off: 'Запись сохранена с пустым постом, мастер назначил утром.' },
    { id: 's9', c: 'tmCK', legit: false, day: 'Пт', t: 'При переносе записи перепутали часы: окончание 10:00 раньше начала 11:00.', on: 'База отказала, перенос сделали правильно.', off: 'Запись «длиной минус час»: поиск свободных слотов считает пост свободным, туда записали ещё одного клиента. Кстати, в учебной базе такая запись уже есть — проверьте ниже.' },
    { id: 's10', c: 'amCK', legit: false, day: 'Пт', t: 'Кассир ошибся знаком: платёж на −7 800 ₽.', on: 'База отказала. Возвраты оформляются отдельным статусом refunded, а не отрицательной суммой.', off: 'Отрицательный платёж «съел» выручку станции за день, Ольга Викторовна полдня ищет, где расхождение с кассой.' },
    { id: 's11', c: 'tx', legit: false, day: 'Сб', t: 'Касса на Азино: после записи платежа моргнул свет.', on: 'Транзакция откатилась целиком: ни платежа, ни «Выдан», ни бонусов. Кассир повторил оплату.', off: 'Платёж есть, наряд не «Выдан», бонусов нет. Клиенту утром придёт счёт за хранение машины (BR-13), а баллы кто-то начислит вручную — дважды.' }
  ];
  function labEval(ans) {
    const c = (ans && ans.c) || {};
    const res = SCEN.map(s => { const on = !!c[s.c]; const ok = s.legit ? !on : on; return { s, on, ok, accepted: s.c === 'tx' ? null : !on }; });
    const score = Math.round(res.filter(x => x.ok).length / SCEN.length * 100) / 100;
    const legitBad = res.filter(x => x.s.legit && !x.ok);
    return { res, score, legitBad, junk: res.filter(x => !x.s.legit && !x.ok) };
  }
  const taskLab = {
    id: 't-lab', title: 'Лаборатория: ограничения и неделя Лизы',
    simple: howKeys.simple,
    lead: ui.brief({
      situation: 'Лиза приготовила «неделю жизни Искры» — 11 ситуаций, от обычных до аварийных. «Включи ограничения, как считаешь правильным, и я прогоню неделю. Посмотрим, что база не пустит, а что пропустит».',
      todo: [
        'Включите нужные ограничения для полей и решите, нужна ли транзакция для оплаты на кассе.',
        'Нажмите «Прогнать неделю» и прочитайте последствия. Меняйте ограничения — результаты пересчитываются сразу.',
        'Нажмите «Проверить». Засчитывается, если верно обработано от 80 % ситуаций и <b>ни одна реальная ситуация «Искры» не отвергнута</b>.'
      ],
      lookTitle: 'Подсказка',
      look: 'Ограничение — это обещание «так не бывает никогда». Прежде чем включить NOT NULL, спросите: а бывает ли в жизни, что значения пока нет? Лишний запрет так же вреден, как дыра: люди начнут обманывать систему.'
    }),
    blank: () => ({ c: {}, ran: false }),
    reference: () => ({ c: Object.fromEntries(CONS.map(k => [k.id, k.ref])), ran: true }),
    render(el, ctx) {
      el.classList.add('m4d-root');
      const ans = ctx.ans; ans.c = ans.c || {};
      let dirty = false;
      const groups = [];
      CONS.forEach(k => { let g = groups.find(x => x.tb === k.tb); if (!g) groups.push(g = { tb: k.tb, list: [] }); g.list.push(k); });
      el.innerHTML = `<div class="stack">
        <div class="m4d-cons">${groups.map(g => `<div class="m4d-ctab"><b>${esc(g.tb)}</b><div class="m4d-tg">${g.list.map(k => `<button type="button" data-cn="${k.id}" aria-pressed="${!!ans.c[k.id]}" ${ctx.readonly ? 'disabled' : ''}>${k.f ? esc(k.f) + ' ' : ''}${esc(k.t)}</button>`).join('')}</div></div>`).join('')}</div>
        <div class="row"><button type="button" class="btn primary" data-run>${ans.ran ? 'Прогнать неделю ещё раз' : 'Прогнать неделю'}</button><span class="small dim" data-on></span></div>
        <div data-res></div>
        <div class="m4d-box info"><b class="k">А что в учебной базе?</b><div>В TR.db почти все эти ограничения уже стоят — кроме CHECK (end_at > start_at). Проверьте, пропустила ли база такую запись.</div><div class="row"><button type="button" class="btn sm" data-live-t>Найти записи с окончанием раньше начала</button></div><div data-live-t-out class="m4d-live"></div></div>
      </div>`;
      function drawRes() {
        TR.$('[data-on]', el).textContent = `Включено ограничений: ${CONS.filter(k => ans.c[k.id]).length} из ${CONS.length}`;
        if (!ans.ran && !ctx.readonly) { TR.$('[data-res]', el).innerHTML = ''; return; }
        const ev = labEval(ans), show = (!!ctx.result && !dirty) || ctx.readonly;
        TR.$('[data-res]', el).innerHTML = `<div class="m4d-res">${ev.res.map(x => {
          const lbl = x.s.c === 'tx' ? (x.on ? 'в транзакции' : 'без транзакции') : (x.accepted ? 'принято базой' : 'отклонено базой');
          return `<div class="m4d-sc ${show ? (x.ok ? 'ok' : 'bad') : ''}"><div><b>${x.s.day}.</b> ${esc(x.s.t)}</div><span class="st">${lbl}</span><div class="cq">${x.on ? x.s.on : x.s.off}</div></div>`;
        }).join('')}</div>`;
      }
      TR.on(el, 'click', '[data-cn]', (e, b) => { if (ctx.readonly) return; const id = b.dataset.cn; ans.c[id] = !ans.c[id]; b.setAttribute('aria-pressed', String(ans.c[id])); dirty = true; ctx.save(); drawRes(); });
      TR.on(el, 'click', '[data-run]', (e, b) => { ans.ran = true; ctx.save(); b.textContent = 'Прогнать неделю ещё раз'; drawRes(); ctx.decide && ctx.decide('Ограничения в лаборатории', CONS.filter(k => ans.c[k.id]).map(k => `${k.tb}.${k.f} ${k.t}`).join('; ') || 'ни одного'); });
      TR.on(el, 'click', '[data-live-t]', () => live(TR.$('[data-live-t-out]', el), 'SELECT id, station_id, start_at, end_at, status\nFROM booking\nWHERE end_at < start_at;'));
      if (ctx.readonly) TR.$('[data-run]', el).disabled = true;
      drawRes();
    },
    check(ans) {
      const ev = labEval(ans), notes = [];
      ev.legitBad.forEach(x => notes.push({ ok: false, html: `<b>Реальная ситуация отвергнута:</b> ${esc(x.s.t)} ${x.s.on}` }));
      ev.junk.forEach(x => notes.push({ ok: false, html: `<b>Мусор прошёл в базу:</b> ${esc(x.s.t)} ${x.s.off}` }));
      if (!ev.legitBad.length) notes.push({ ok: true, html: 'Ни одна реальная ситуация «Искры» не отвергнута: клиент без email, заказ-наряд без записи, запись без поста — сохраняются.' });
      if (!ev.junk.length) notes.push({ ok: true, html: 'Весь мусор недели остановлен на входе.' });
      if (!ans || !ans.ran) notes.push({ ok: 'warn', html: 'Вы не прогоняли неделю — посмотрите последствия, это самое интересное.' });
      return {
        ok: ev.score >= 0.8 && !ev.legitBad.length, score: ev.legitBad.length ? Math.min(ev.score, 0.7) : ev.score, notes,
        summary: `Верно обработано ситуаций: ${ev.res.filter(x => x.ok).length} из ${SCEN.length}; реальных ситуаций отвергнуто: ${ev.legitBad.length}, мусора пропущено: ${ev.junk.length}.`,
        mentor: ev.legitBad.length ? 'Лишний NOT NULL — самая коварная ошибка: база «правильная», а работать нельзя, и люди начинают вписывать «нет@нет.ru» и фиктивные записи. Для каждого обязательного поля спросите Марину Олеговну: «Бывает, что этого ещё нет?»' : (ev.junk.length ? 'Каждая дыра — это сценарий, который Лиза найдёт в проде, а не на стенде. Уникальность, ссылки и списки значений — дешёвая страховка.' : '')
      };
    },
    explain: `<p>Ограничение — это обещание бизнеса «так не бывает никогда». Поэтому их выводят не из «аккуратности», а из жизни «Искры»:</p>
      <ul class="checks"><li><b>Включаем</b> то, что действительно невозможно: два клиента с одним телефоном, клиент без телефона, два наряда на одну запись, ссылка в никуда, статус не из списка, окончание раньше начала, отрицательный платёж.</li>
      <li><b>Не включаем</b> NOT NULL там, где «пусто» — нормальное состояние: email (не у всех есть), <code>work_order.booking_id</code> (клиент без записи), <code>booking.post_id</code> (пост назначат утром).</li>
      <li><b>Транзакция</b> — для действий, которые имеют смысл только вместе: платёж, статус «Выдан», бонусы.</li></ul>
      <p>Обратите внимание на <code>work_order.booking_id</code>: одно поле — три разных решения. Пустым быть может (NULL), повторяться не может (UNIQUE), ссылаться должно на существующую запись (FOREIGN KEY). Так в базе выражается связь «ноль или одна запись — ноль или один заказ-наряд».</p>
      <p>Лишние запреты опаснее, чем кажется: люди обходят их «фиктивными» данными, и база становится грязнее, чем без ограничения. Источники: Дейт, «Введение в системы баз данных» (целостность); ГОСТ Р ИСО/МЭК 25010 — целостность и корректность данных как часть качества.</p>`,
    refNote: 'Засчитывается любое сочетание, при котором верно обработано от 9 из 11 ситуаций и ни одна реальная ситуация (клиент без email, заказ-наряд без записи, запись без поста) не отвергнута.',
    report: ans => { const ev = labEval(ans); return `- Включено: ${CONS.filter(k => ans && ans.c && ans.c[k.id]).map(k => `${k.tb}.${k.f} ${k.t}`).join('; ') || '—'}\n` + ev.res.map(x => `- ${x.s.day}: ${x.s.t} ${x.ok ? '✓' : '✗'}`).join('\n'); }
  };

  // =====================================================================
  // Практика 5. Своими словами: Марине Олеговне — зачем база вместо Excel
  // =====================================================================
  const EX_RUBRIC = [
    'Назвал конкретные беды её Excel: дубль Елены (два формата телефона), цена ТО-1 в двух местах, удалённая строка Морозовой — пропал клиент',
    'Объяснил главную идею: в базе каждый факт хранится один раз — клиент, машина, услуга, запись в своих таблицах, а связи — по номерам (ключам)',
    'Объяснил, что база сама не пустит ошибку (обязательный и уникальный телефон, статус из списка, нет записи на несуществующую машину) — и при этом не запретит реальных ситуаций (клиент без записи, без email)',
    'Упомянул «всё или ничего» при оплате (транзакция) и/или одновременную работу 7 станций и сотен клиентов без конфликтов',
    'Говорил на её языке, без жаргона, с уважением к её опыту, и сказал, что изменится для неё на приёмке (поиск по телефону, не надо переписывать данные)'
  ];
  const EX_REF = `<p>Марина Олеговна, ваш Excel — это 15 лет опыта, и мы его внимательно прочитали: по нему видно, какие правила на самом деле работают на приёмке. Но посмотрите, что в нём происходит само собой. Елена Смирнова записана дважды: «+7 917…» и «8 917…» — для таблицы это два разных человека, и баллы у неё копятся на двух карточках. ТО-1 в одной строке стоит 2 500, в другой — 2 300. А если удалить строку Морозовой, которая отменила запись, пропадёт и её телефон.</p>
    <p>В базе каждый факт записан один раз: Елена — одна карточка клиента, её Kia — одна карточка машины, ТО-1 — одна строка в каталоге. Запись не переписывает ФИО и телефон, а просто ссылается на номер клиента. Сменила Елена телефон — вы меняете его в одном месте, и все её записи это «увидят».</p>
    <p>Кроме того, база сама проверяет правила, которые вы держите в голове: без телефона клиента не сохранить, второго клиента с тем же телефоном не завести, статус — только из списка. Но мы не запретим то, что бывает в жизни: таксист без записи, пенсионер без email — всё это сохранится. А оплата проходит по принципу «всё или ничего»: если на кассе моргнёт свет, не останется «полуоплаченного» наряда.</p>
    <p>Для вас на приёмке это значит: ввели телефон — увидели клиента, его машины и историю, ничего не переписываете. И все семь станций видят одно и то же.</p>`;
  const taskExplain = {
    id: 't-explain', title: 'Своими словами: Марине Олеговне — зачем база',
    lead: ui.brief({
      situation: 'Марина Олеговна выслушала Глеба и скрестила руки: «Пятнадцать лет мой Excel работает. Вы мне объясните по-человечески, зачем мне ваша база — без “сущностей” и “нормальных форм”».',
      todo: [
        'Напишите ответ Марине Олеговне (от 300 символов) — так, как сказали бы ей у стойки приёмки.',
        'Проверьте ответ с Верой (если доступно) или сверьте с эталоном сами и честно отметьте пункты рубрики.',
        'Засчитывается от 60 % по рубрике.'
      ],
      lookTitle: 'На что опереться',
      look: 'Ваши находки в её Excel (первое задание), лаборатория Лизы (что база запрещает и чего не запрещает), оплата «всё или ничего». Марина скептична, но уважает конкретику и своё время.'
    }),
    blank: () => ({ j: {} }),
    reference: () => ({ j: { text: EX_REF.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(), self: EX_RUBRIC.map(() => true) } }),
    render(el, ctx) {
      el.classList.add('m4d-root');
      el.insertAdjacentHTML('beforeend', ui.say('marina', 'Мне не нужна «система». Мне нужно, чтобы утром в 8:00 я не переписывала одно и то же в три места и чтобы клиенты не терялись. Убедите меня.'));
      const j = document.createElement('div'); j.style.marginTop = '12px'; el.appendChild(j);
      ui.justify(j, {
        id: 'm4d-explain', q: 'Зачем «Искре» база данных вместо Excel — объясните Марине Олеговне',
        qPlain: 'Объясните старшему мастеру-приёмщику без технического жаргона, чем база данных лучше её таблицы Excel: какие проблемы её таблицы исчезнут, почему каждый факт хранится один раз, что база проверяет сама и чего не запрещает, что даёт транзакция при оплате и что изменится для неё на приёмке.',
        rubric: EX_RUBRIC, reference: EX_REF, value: ctx.ans.j, readonly: ctx.readonly, minLen: 300,
        placeholder: 'Марина Олеговна, ваш Excel…',
        onChange: v => { ctx.ans.j = v; ctx.save(); ctx.decide && ctx.decide('Ответ Марине Олеговне про базу', v.text || ''); }
      });
    },
    check(ans) {
      const s = ui.justifyScore(ans && ans.j);
      return {
        ok: s >= 0.6, score: s,
        summary: s ? `Оценка ответа: ${Math.round(s * 100)} %.` : 'Напишите ответ (от 300 символов) и проверьте его с Верой или сверьте с эталоном сами.',
        notes: s && s < 0.6 ? [{ ok: false, html: 'Марину Олеговну убедят не термины, а её же примеры: дубль Елены, две цены ТО-1, пропавшая Морозова — и что для неё станет проще у стойки.' }] : [],
        mentor: s && s < 0.6 ? 'Начните с её боли, а не с базы: «утром вы переписываете одно и то же» — и покажите, как это исчезнет.' : ''
      };
    },
    explain: `<p>Сильный ответ строится как у хорошего мастера-приёмщика: сначала показать «поломку» на её же машине, потом — ремонт, потом — что изменится для владельца. Поломки — дубль Елены, две цены ТО-1, удалённая Морозова. Ремонт — «каждый факт один раз, остальные ссылаются на номер». Гарантия — «база сама проверяет правила, но не мешает жизни». Итог для неё — «ввели телефон, увидели всё».</p>
      <p>Частые ошибки: говорить терминами («нормализация до 3НФ»), спорить с её опытом («Excel — это плохо»), обещать, что база «сама всё исправит» (дубли из переноса 31 000 клиентов придётся чистить отдельно — это переходное требование), и забыть, что изменится лично для неё.</p>
      <p>Источник: Вигерс, «Разработка требований» — работа с заинтересованными лицами; BABOK v3 — управление изменениями и готовность к ним.</p>`,
    report: ans => (ans.j && ans.j.text) ? ans.j.text : '—'
  };

  // =====================================================================
  TR.stage({
    id: ID,
    when: 'понедельник, 25 января, 10:00 · Excel Марины Олеговны и первая база',
    intro: [
      { who: 'marina', html: 'Вот, прислала вам свой файл — «Записи_январь». Пятнадцать лет так живём, и ничего. Только утром переписываю половину заново, а Смирновых у меня, кажется, три. Или две.' },
      { who: 'gleb', html: 'Я посмотрел. Это не база, это лист бумаги в клетку. Мне нужно понимать: какие таблицы, какие ключи, что обязательно, что уникально. И что делать с оплатой, если упадёт посередине.' },
      { who: 'vera', html: 'Сегодня — основы. Почему Excel «врёт» сам себе, что такое таблица, ключ и связь, зачем нормализация и транзакции. К вечеру вы объясните Марине Олеговне, зачем ей база, — её же примерами.' }
    ],
    facts: ['F-excel', 'F-pd', 'F-pay', 'F-bonus', 'F-retention'],
    glossary: [
      { term: 'База данных', simple: 'Организованное хранилище данных с правилами — картотека, а не лист бумаги.', tech: 'Совокупность взаимосвязанных данных, организованных по определённой модели (реляционной, документной…) и управляемых СУБД.' },
      { term: 'СУБД', simple: 'Программа, которая хранит данные, следит за правилами и пускает многих сразу.', tech: 'Система управления базами данных: хранение, целостность, параллельный доступ, транзакции, права, восстановление. PostgreSQL, MySQL, Oracle, SQLite.' },
      { term: 'Таблица, строка, столбец', simple: 'Таблица — все клиенты; строка — один клиент; столбец — одно его свойство.', tech: 'Отношение, кортеж, атрибут в реляционной модели Э. Кодда (1970).' },
      { term: 'Тип данных', simple: 'Что можно положить в столбец: число, деньги, текст, дату.', tech: 'INTEGER, DECIMAL(p,s), VARCHAR(n), CHAR(n), DATE, DATETIME, BOOLEAN; определяет допустимые значения и операции.' },
      { term: 'Первичный ключ (PK)', simple: 'Номер строки, по которому её всегда найдут; не пустой и не повторяется.', tech: 'PRIMARY KEY — минимальный набор атрибутов, однозначно идентифицирующий кортеж. Естественный (VIN, ИНН) или суррогатный (id, UUID); бывает составным.' },
      { term: 'Внешний ключ (FK)', simple: 'Ссылка на строку другой таблицы: «клиент № 7».', tech: 'FOREIGN KEY — атрибут, значения которого должны существовать в ключе другой таблицы (ссылочная целостность).' },
      { term: 'Связи 1:1, 1:N, M:N', simple: 'Сколько строк одной таблицы соответствует строке другой.', tech: '1:N — FK на стороне N; 1:1 — FK с UNIQUE; M:N — через связующую (ассоциативную) таблицу с двумя FK, например booking_service.' },
      { term: 'NULL', simple: '«Значения нет»: не знаем или пока не применимо. Не ноль и не пустая строка.', tech: 'Специальный маркер отсутствующего значения; сравнения с NULL дают UNKNOWN, проверка — IS NULL.' },
      { term: 'Ограничения целостности', simple: 'Правила, которые база проверяет сама.', tech: 'NOT NULL, UNIQUE, CHECK, PRIMARY KEY, FOREIGN KEY, DEFAULT (стандарт SQL ISO/IEC 9075).' },
      { term: 'Аномалии вставки, обновления, удаления', simple: 'Беды таблицы, где смешаны разные факты: нельзя добавить, приходится менять во многих местах, удаляешь лишнее.', tech: 'Следствия избыточности в ненормализованных отношениях (Кодд, Дейт).' },
      { term: 'Нормализация (1НФ, 2НФ, 3НФ)', simple: 'Уборка: каждый факт — в одну таблицу, в других — только ссылка.', tech: '1НФ — атомарные значения; 2НФ — нет частичных зависимостей от составного ключа; 3НФ — нет транзитивных зависимостей. «Ключ, весь ключ и ничего, кроме ключа».' },
      { term: 'Денормализация', simple: 'Сознательное дублирование ради скорости или истории.', tech: 'Осознанный отказ от нормальной формы с обоснованием: копия цены в строке заказ-наряда, агрегаты для отчётов.' },
      { term: 'Транзакция', simple: 'Несколько изменений как одно: всё или ничего.', tech: 'Логическая единица работы: BEGIN … COMMIT / ROLLBACK.' },
      { term: 'ACID', simple: 'Четыре гарантии транзакции: всё или ничего, правила соблюдены, не мешают друг другу, не пропадут.', tech: 'Atomicity, Consistency, Isolation, Durability (Хердер, Ройтер, 1983).' },
      { term: 'Документная база', simple: 'Хранит объект целиком одним документом (JSON), без таблиц.', tech: 'Модель NoSQL (MongoDB и др.): гибкая схема, вложенные структуры; слабее в связях и межобъектных транзакциях.' }
    ],
    outro: 'Excel Марины Олеговны разобран на факты: клиенты, машины, станции, услуги, записи — каждый в своей таблице, со своим ключом и правилами. Вы знаете, где живёт каждая связь, что значит NULL, какие ограничения спасают от мусора, а какие мешают жизни, и почему оплата — одна транзакция. В среду рисуем всё это картинкой: ERD «Искры» на доске — сущности, связи и «вороньи лапки».',
    tasks: [howExcel, howKeys, howNorm, taskAnom, taskKeys, taskNorm, taskLab, taskExplain]
  });
})();
