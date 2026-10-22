/* Модуль 4, занятие 2: ERD — сущности, атрибуты и связи.
   Теория: четыре кирпича ERD (сущность, атрибут, ключ, связь) на фрагменте «Искры» с описаниями из живой схемы
   TR.db.SCHEMA; «атрибут или сущность?» на примере станции; концептуальная → логическая → физическая модель одного
   фрагмента; ассоциативная сущность (booking_service, work_item); мощность и обязательность — два значка на каждом конце
   связи, конструктор «вороньих лапок» с чтением вслух и последствиями для «Искры»; нотации Чена, Crow's Foot,
   IDEF1X и UML (SVG одной и той же связи), сравнение и типичные ошибки ERD.
   Практика: выделить сущности, атрибуты и связи из рассказа Марины Олеговны и привязать атрибуты к сущностям;
   мощности для 8 пар — визуальный выбор значков с живым чтением; лаборатория «собрать ERD Искры» (перетаскивание,
   мощности, лишние связи) → какие реальные ситуации недели база не сможет сохранить; найти ошибки в ERD подрядчика;
   своими словами — прочитать ERD вслух Марине Олеговне. */
'use strict';
(function () {
  const TR = window.TR, ui = TR.ui, esc = TR.esc;
  const ID = 'm4-erd';

  if (!document.getElementById('m4e-css')) document.head.insertAdjacentHTML('beforeend', `<style id="m4e-css">
    .m4e-root, .m4e-root .stack > *, .m4e-root .card > * { min-width: 0; }
    .m4e-root .seg button { white-space: normal; }
    .m4e-h3 { font: 600 17px/1.3 var(--f-brand); margin: 0; }
    .m4e-grid2 { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
    .m4e-grid4 { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; }
    @media (max-width: 720px) { .m4e-grid2 { grid-template-columns: minmax(0, 1fr); } .m4e-grid4 { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
    .m4e-box { border: 1px solid var(--border); border-radius: 10px; padding: 10px 12px; background: var(--surface); font-size: 14px; display: grid; gap: 5px; align-content: start; min-width: 0; overflow-wrap: anywhere; }
    .m4e-box > b.k { font: 600 10.5px/1.3 var(--f-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--text-muted); }
    .m4e-box.ok { border-color: color-mix(in srgb, var(--ok) 45%, var(--border)); background: var(--ok-soft); }
    .m4e-box.bad { border-color: color-mix(in srgb, var(--bad) 45%, var(--border)); background: var(--bad-soft); }
    .m4e-box.info { border-color: color-mix(in srgb, var(--info) 45%, var(--border)); background: var(--info-soft); }
    .m4e-box.acc { border-color: color-mix(in srgb, var(--accent) 45%, var(--border)); background: var(--accent-soft); }
    .m4e-box ul { margin: 0; padding-left: 18px; }
    .m4e-chips { display: flex; flex-wrap: wrap; gap: 6px; }
    .m4e-chip { font: inherit; font-size: 13px; border: 1px solid var(--border-strong); background: var(--surface-2); color: var(--text); border-radius: 99px; padding: 5px 11px; cursor: pointer; }
    .m4e-chip[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); color: var(--accent); font-weight: 600; }
    .m4e-story { border-left: 4px solid var(--accent); background: var(--surface-2); border-radius: 0 10px 10px 0; padding: 10px 14px; font-size: 14.5px; line-height: 1.55; }
    .m4e-gl { display: grid; gap: 4px; justify-items: center; text-align: center; font: inherit; font-size: 12px; color: var(--text-2); border: 1px solid var(--border-strong); background: var(--surface-2); border-radius: 9px; padding: 6px 4px; cursor: pointer; min-width: 0; }
    .m4e-gl svg { display: block; }
    .m4e-gl[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); color: var(--text); font-weight: 600; }
    .m4e-gl:disabled { cursor: default; }
    .m4e-gl.ok { border-color: var(--ok); background: var(--ok-soft); } .m4e-gl.bad { border-color: var(--bad); background: var(--bad-soft); } .m4e-gl.warn { border-color: var(--warn); background: var(--warn-soft); }
    .m4e-glrow { display: grid; gap: 4px; }
    .m4e-glrow > .lbl { font-size: 12.5px; color: var(--text-muted); }
    .m4e-glbtns { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 6px; }
    .m4e-pair { border: 1px solid var(--border); border-radius: 12px; padding: 10px 12px; background: var(--surface); display: grid; gap: 8px; }
    .m4e-pair.ok { border-color: var(--ok); } .m4e-pair.bad { border-color: var(--bad); } .m4e-pair.warn { border-color: var(--warn); }
    .m4e-pair > header { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 6px; font-weight: 600; }
    .m4e-read { font-size: 13.5px; color: var(--text-2); display: grid; gap: 2px; }
    .m4e-read b { color: var(--text); }
    .m4e-svg { overflow-x: auto; border: 1px solid var(--border); border-radius: 12px; background: var(--code-bg); padding: 6px; }
    .m4e-svg svg { display: block; margin: 0 auto; }
    .m4e-pairs { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
    @media (max-width: 860px) { .m4e-pairs { grid-template-columns: minmax(0, 1fr); } }
    .m4e-rels { display: grid; gap: 6px; }
    .m4e-rel { display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr) minmax(0, 1fr) auto; gap: 8px; align-items: center; border: 1px solid var(--border); border-radius: 10px; padding: 7px 10px; background: var(--surface); font-size: 13.5px; }
    .m4e-rel.off { opacity: .55; border-style: dashed; }
    .m4e-rel.ok { border-color: var(--ok); } .m4e-rel.bad { border-color: var(--bad); background: var(--bad-soft); } .m4e-rel.warn { border-color: var(--warn); }
    .m4e-rel select { width: 100%; min-width: 0; }
    .m4e-rel label { display: flex; gap: 4px; align-items: center; font-size: 12.5px; white-space: nowrap; }
    .m4e-rel .why { grid-column: 1 / -1; font-size: 12.5px; color: var(--text-2); }
    @media (max-width: 640px) { .m4e-rel { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); } .m4e-rel > :first-child { grid-column: 1 / -1; } }
    .m4e-sc { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 4px 10px; border: 1px solid var(--border); border-left: 4px solid var(--border-strong); border-radius: 10px; padding: 8px 11px; background: var(--surface); font-size: 13.5px; }
    .m4e-sc .st { font: 600 11.5px var(--f-mono); white-space: nowrap; }
    .m4e-sc .cq { grid-column: 1 / -1; color: var(--text-2); font-size: 13px; }
    .m4e-sc.pass { border-left-color: var(--ok); } .m4e-sc.pass .st { color: var(--ok); }
    .m4e-sc.fail { border-left-color: var(--bad); background: var(--bad-soft); } .m4e-sc.fail .st { color: var(--bad); }
    .m4e-res { display: grid; gap: 6px; }
    .m4e-meter { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 10px; align-items: center; font-size: 13px; }
  </style>`);

  const anNote = html => `<div style="margin-top:12px">${ui.note('info', 'Позиция аналитика', html)}</div>`;
  const interview = (q, a) => ui.note('', 'Как об этом спрашивают на собеседовании', `<b>«${q}»</b><br>${a}`);
  const mark = s => s === 'ok' ? '✓' : s === 'warn' ? '≈' : '✗';
  // атрибут для ui.er: 'PK id', 'FK client_id', 'PK FK booking_id', 'email?'
  const A = (s, type) => { const m = String(s).match(/^((?:PK FK|PK|FK|UQ) )?(.+?)(\?)?$/); return { k: m[1] ? m[1].trim() : '', n: m[2], nul: !!m[3], type: type || '' }; };
  const E = (id, t, x, y, attrs, o) => Object.assign({ id, t, x, y, attrs: (attrs || []).map(a => Array.isArray(a) ? A(a[0], a[1]) : A(a)) }, o || {});
  function erIn(box, cfg) { box.innerHTML = ''; const d = document.createElement('div'); box.appendChild(d); return ui.er(d, cfg); }
  const CARD = { '1': 'ровно один', '0..1': 'ноль или один', '1..N': 'один или много', '0..N': 'ноль или много' };
  const CARD_K = ['1', '0..1', '1..N', '0..N'];
  const has0 = c => c === '0..1' || c === '0..N';
  const many = c => c === '1..N' || c === '0..N' || c === 'N';

  // значки «вороньей лапки» — та же геометрия, что в ui.er
  function ends(p, u, card, c) {
    const n = { x: -u.y, y: u.x }, at = d => ({ x: p.x + u.x * d, y: p.y + u.y * d });
    const bar = d => { const q = at(d); return `<line x1="${q.x + n.x * 7}" y1="${q.y + n.y * 7}" x2="${q.x - n.x * 7}" y2="${q.y - n.y * 7}" style="stroke:${c};stroke-width:1.6"/>`; };
    const circ = d => { const q = at(d); return `<circle cx="${q.x}" cy="${q.y}" r="4.5" style="fill:var(--code-bg);stroke:${c};stroke-width:1.5"/>`; };
    const crow = () => { const q = at(14); return `<path d="M${q.x} ${q.y} L${p.x + n.x * 8} ${p.y + n.y * 8} M${q.x} ${q.y} L${p.x} ${p.y} M${q.x} ${q.y} L${p.x - n.x * 8} ${p.y - n.y * 8}" style="stroke:${c};stroke-width:1.6;fill:none"/>`; };
    switch (card) { case '1': return bar(7) + bar(13); case '0..1': return bar(7) + circ(19); case '1..N': return crow() + bar(20); case '0..N': return crow() + circ(23); default: return ''; }
  }
  // один значок: сущность слева (side 'l') или справа ('r')
  function glyph(card, side) {
    const W = 58, H = 24, c = 'var(--text-2)';
    const p = side === 'r' ? { x: W - 4, y: 12 } : { x: 4, y: 12 }, u = side === 'r' ? { x: -1, y: 0 } : { x: 1, y: 0 };
    return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" aria-hidden="true"><line x1="${p.x}" y1="3" x2="${p.x}" y2="21" style="stroke:var(--border-strong);stroke-width:3"/><line x1="4" y1="12" x2="${W - 4}" y2="12" style="stroke:${c};stroke-width:1.5"/>${ends(p, u, card, c)}</svg>`;
  }
  // пара сущностей со связью
  function pairSVG(a, b, ca, cb) {
    const c = 'var(--text-2)';
    return `<svg viewBox="0 0 360 44" width="100%" style="max-width:360px" role="img" aria-label="${esc(a)} — ${esc(b)}">
      <rect x="1" y="6" width="112" height="32" rx="7" style="fill:var(--surface-3);stroke:var(--border-strong)"/><text x="57" y="27" text-anchor="middle" style="fill:var(--text);font-size:12.5px;font-weight:600">${esc(a)}</text>
      <rect x="247" y="6" width="112" height="32" rx="7" style="fill:var(--surface-3);stroke:var(--border-strong)"/><text x="303" y="27" text-anchor="middle" style="fill:var(--text);font-size:12.5px;font-weight:600">${esc(b)}</text>
      <line x1="113" y1="22" x2="247" y2="22" style="stroke:${c};stroke-width:1.5${ca && cb ? '' : ';stroke-dasharray:5 4'}"/>${ends({ x: 113, y: 22 }, { x: 1, y: 0 }, ca, c)}${ends({ x: 247, y: 22 }, { x: -1, y: 0 }, cb, c)}</svg>`;
  }

  // =====================================================================
  // Теория 1. Сущность, атрибут, ключ, связь; уровни модели; ассоциативная сущность
  // =====================================================================
  const BRICKS = [
    { v: 'ent', t: 'Сущность', d: 'Класс предметов или событий, о которых бизнесу нужно помнить: у каждого экземпляра есть свои свойства, и экземпляров много. На ERD — прямоугольник с именем в единственном числе.', ex: 'Клиент, Автомобиль, Запись, Заказ-наряд. «Елена Смирнова» — не сущность, а экземпляр сущности «Клиент».', home: 'Библиотека: Читатель, Книга, Выдача.', how: 'В речи — существительное, о котором говорят «у него есть…» и «их много».' },
    { v: 'attr', t: 'Атрибут', d: 'Свойство сущности: одно значение у каждого экземпляра. Атрибут не живёт сам по себе — он всегда «чей-то».', ex: 'Госномер и год выпуска — у Автомобиля; время начала и статус — у Записи.', home: 'У Книги — название, автор, год издания.', how: '«Какой?», «сколько?», «когда?» — ответ на эти вопросы обычно атрибут.' },
    { v: 'key', t: 'Ключ', d: 'Атрибут (или набор), который однозначно определяет экземпляр: первичный ключ (PK). Атрибут-ссылка на другую сущность — внешний ключ (FK) — появляется на логическом уровне.', ex: 'Клиент — id; телефон уникален, но это не первичный ключ (меняется). Запись хранит FK client_id и car_id.', home: 'Номер читательского билета, инвентарный номер книги.', how: '«По чему мы точно отличим одного от другого, даже если всё остальное совпало?»' },
    { v: 'rel', t: 'Связь', d: 'Как экземпляры сущностей относятся друг к другу. У связи есть имя (глагол) и на каждом конце — мощность (один или много) и обязательность (может ли быть ноль).', ex: 'Клиент <i>владеет</i> Автомобилем; Запись <i>превращается</i> в Заказ-наряд; Пост <i>находится</i> на Станции.', home: 'Читатель <i>берёт</i> Книгу — через Выдачу.', how: 'В речи — глагол между двумя существительными: «записывает», «оплачивает», «принадлежит».' }
  ];
  const ER_FRAG = () => ({
    entities: [
      E('client', 'Клиент', 10, 14, ['PK id', 'full_name', 'phone', 'email?']),
      E('car', 'Автомобиль', 10, 160, ['PK id', 'FK client_id', 'plate', 'vin?']),
      E('booking', 'Запись', 300, 60, ['PK id', 'FK client_id', 'FK car_id', 'FK station_id', 'start_at', 'status']),
      E('station', 'Станция', 560, 14, ['PK id', 'name', 'address']),
      E('post', 'Пост', 560, 150, ['PK id', 'FK station_id', 'name'])
    ],
    rels: [
      { a: 'client', b: 'car', ca: '1', cb: '0..N', t: 'владеет' },
      { a: 'client', b: 'booking', ca: '1', cb: '0..N', t: 'записывается' },
      { a: 'car', b: 'booking', ca: '1', cb: '0..N' },
      { a: 'station', b: 'booking', ca: '1', cb: '0..N' },
      { a: 'station', b: 'post', ca: '1', cb: '1..N', t: 'имеет' }
    ]
  });
  const LEVELS = {
    concept: { t: 'Концептуальная', who: 'Заказчик, бизнес, аналитик', what: 'Только сущности и связи на языке бизнеса. Без атрибутов (или с главными), M:N можно рисовать как есть.', er: () => ({ entities: [E('c', 'Клиент', 10, 20, [], { sub: 'кто записывается' }), E('b', 'Запись', 240, 20, [], { sub: 'визит в слот' }), E('s', 'Услуга', 470, 20, [], { sub: 'каталог работ' })], rels: [{ a: 'c', b: 'b', ca: '1', cb: '0..N', t: 'делает' }, { a: 'b', b: 's', ca: '0..N', cb: '1..N', t: 'включает' }] }) },
    logical: { t: 'Логическая', who: 'Аналитик, архитектор, разработчик', what: 'Все атрибуты, первичные и внешние ключи, M:N разрешены через ассоциативные сущности, нормализовано. Ещё не зависит от конкретной СУБД.', er: () => ({ entities: [E('c', 'Клиент', 10, 20, ['PK id', 'ФИО', 'телефон']), E('b', 'Запись', 220, 20, ['PK id', 'FK клиент', 'начало', 'статус']), E('bs', 'Услуга в записи', 220, 170, ['PK FK запись', 'PK FK услуга']), E('s', 'Услуга', 450, 20, ['PK id', 'код', 'цена «от»'])], rels: [{ a: 'c', b: 'b', ca: '1', cb: '0..N' }, { a: 'b', b: 'bs', ca: '1', cb: '1..N' }, { a: 's', b: 'bs', ca: '1', cb: '0..N' }] }) },
    physical: { t: 'Физическая', who: 'Разработчик, администратор БД', what: 'Таблицы и столбцы конкретной СУБД: имена snake_case, типы и длины, NOT NULL, индексы, ограничения. По ней пишут DDL (CREATE TABLE).', er: () => ({ entities: [E('c', 'client', 10, 20, [['PK id', 'INTEGER'], ['full_name', 'VARCHAR(120)'], ['phone', 'VARCHAR(20)']], { w: 220 }), E('b', 'booking', 250, 20, [['PK id', 'INTEGER'], ['FK client_id', 'INTEGER'], ['start_at', 'DATETIME'], ['status', 'VARCHAR(12)']], { w: 220 }), E('bs', 'booking_service', 250, 190, [['PK FK booking_id', 'INTEGER'], ['PK FK service_id', 'INTEGER']], { w: 220 }), E('s', 'service', 490, 20, [['PK id', 'INTEGER'], ['code', 'VARCHAR(10)'], ['price', 'DECIMAL(10,2)']], { w: 220 })], rels: [{ a: 'c', b: 'b', ca: '1', cb: '0..N' }, { a: 'b', b: 'bs', ca: '1', cb: '1..N' }, { a: 's', b: 'bs', ca: '1', cb: '0..N' }] }) }
  };
  const howErd = {
    id: 'how-erd', covers: ['t-ent'], title: 'Как это работает: сущности, атрибуты, ключи и связи', free: true, noReset: true,
    simple: {
      icon: '🗺️',
      plain: 'ERD — карта данных. Прямоугольники — то, о чём система помнит (клиенты, машины, записи), строчки внутри — что именно помнит (телефон, госномер), линии — как одно связано с другим (клиент владеет машинами). По такой карте разработчик создаёт таблицы, а заказчик проверяет, всё ли учли.',
      analogy: 'Генеалогическое древо: люди — сущности, даты рождения — атрибуты, линии «родитель — ребёнок» — связи. Чтобы понять семью, не нужно читать все письма — достаточно схемы.',
      tech: 'ERD (Entity-Relationship Diagram, диаграмма «сущность — связь») — модель П. Чена (1976). Элементы: сущность (entity type), атрибут, ключ (идентификатор), связь (relationship) с мощностью и обязательностью. Уровни: концептуальная, логическая, физическая модель (ANSI/SPARC; Саймсион, Витт «Data Modeling Essentials»). Ассоциативная сущность разрешает связь M:N.'
    },
    lead: ui.brief({
      situation: 'Среда, 27 января, доска в переговорной. Глеб нарисовал пять прямоугольников и шесть линий: «Это “Искра”. Пока не поймёшь, что тут нарисовано, — таблицы не трогай».',
      todo: [
        'Переключайте четыре «кирпича» ERD: что это, пример в «Искре», бытовой пример, как узнать в речи заказчика.',
        'Нажимайте на прямоугольники на диаграмме — увидите описание из настоящей схемы базы «Искры».',
        'Решите, станция — атрибут записи или сущность, и пройдите три уровня модели: концептуальный, логический, физический.',
        'Посмотрите, как связь «многие ко многим» превращается в ассоциативную сущность.'
      ],
      look: 'Существительное, у которого есть свои свойства и много экземпляров, — сущность. Свойство — атрибут. Глагол между существительными — связь.'
    }),
    render(el) {
      el.classList.add('m4e-root');
      const st = { b: 'ent', sel: 'booking', st: 'attr', lv: 'concept', mn: 'raw' };
      el.innerHTML = `<div class="stack">
        <h3 class="m4e-h3">1. Четыре кирпича</h3>
        <div class="m4e-chips">${BRICKS.map(b => `<button type="button" class="m4e-chip" data-br="${b.v}">${esc(b.t)}</button>`).join('')}</div>
        <div data-br-out></div>
        <p class="small dim">Нажмите на сущность на диаграмме.</p>
        <div data-er1></div>
        <div data-er1-out></div>
        <h3 class="m4e-h3">2. Станция — атрибут записи или сущность?</h3>
        <div>${ui.seg('st', [{ v: 'attr', t: 'Атрибут: «Победы» текстом в записи' }, { v: 'ent', t: 'Сущность: своя таблица' }], st.st)}</div>
        <div data-st></div>
        <h3 class="m4e-h3">3. Три уровня одной модели</h3>
        <div>${ui.seg('lv', Object.keys(LEVELS).map(k => ({ v: k, t: LEVELS[k].t })), st.lv)}</div>
        <div data-lv></div>
        <h3 class="m4e-h3">4. Ассоциативная сущность</h3>
        <div>${ui.seg('mn', [{ v: 'raw', t: 'M:N как есть' }, { v: 'res', t: 'Разрешена через сущность' }, { v: 'wi', t: 'Со своими атрибутами' }], st.mn)}</div>
        <div data-mn></div>
        ${interview('Чем сущность отличается от атрибута? Что такое ассоциативная сущность?', 'Сущность — то, о чём хранят несколько свойств и на что ссылаются; атрибут — одно свойство сущности. Тест: «у этого есть свои свойства? этого много? на это ссылаются?» — если да, сущность. Ассоциативная сущность — сущность-связка, которая разрешает M:N: «Услуга в записи» между Записью и Услугой. Сильный ответ добавляет: у ассоциативной сущности бывают свои атрибуты — количество, цена на момент заказа (строка заказ-наряда).')}
      </div>`;
      function drawBr() {
        TR.$$('[data-br]', el).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.br === st.b)));
        const b = BRICKS.find(x => x.v === st.b);
        TR.$('[data-br-out]', el).innerHTML = `<div class="m4e-grid2"><div class="m4e-box"><b class="k">${esc(b.t)}</b><div>${b.d}</div></div><div class="m4e-box acc"><b class="k">В «Искре»</b><div>${b.ex}</div></div><div class="m4e-box info"><b class="k">В жизни</b><div>${b.home}</div></div><div class="m4e-box"><b class="k">Как узнать в речи</b><div>${b.how}</div></div></div>`;
      }
      function drawEr1() {
        const cfg = ER_FRAG(); cfg.selected = st.sel; cfg.title = 'Фрагмент ERD «Искры»';
        cfg.onClick = id => { st.sel = id; drawEr1(); };
        erIn(TR.$('[data-er1]', el), cfg);
        const t = TR.db.table(st.sel);
        TR.$('[data-er1-out]', el).innerHTML = t ? `<div class="m4e-box acc"><b class="k">${esc(t.ru)} · таблица ${esc(t.name)}</b><div>${esc(t.desc)}</div><ul class="small">${t.cols.map(c => `<li><code>${esc(c.n)}</code>${c.pk ? ' <b>PK</b>' : ''}${c.fk ? ' <b>FK → ' + esc(c.fk) + '</b>' : ''} — ${esc(c.ru)}${c.nul ? ' (может быть пустым)' : ''}</li>`).join('')}</ul></div>` : '';
      }
      function drawSt() {
        TR.$('[data-st]', el).innerHTML = st.st === 'attr'
          ? `<div class="m4e-grid2"><div class="m4e-box bad"><b class="k">Атрибут «станция» в записи</b><div>В каждой записи — текст «Победы». Адрес, телефон и часы работы станции повторяются в каждой записи — или их нет вовсе. Опечатка «Пбеды» — новая станция. Посты не к чему привязать.</div></div>
             <div class="m4e-box"><b class="k">Тест из трёх вопросов</b><ul><li>Есть ли у станции свои свойства? — да: адрес, часы, телефон.</li><li>Много ли станций? — семь, и будут новые.</li><li>Ссылаются ли на неё другие? — посты, сотрудники, записи, заказ-наряды.</li></ul><div>Три «да» — это сущность.</div></div></div>`
          : `<div class="m4e-grid2"><div class="m4e-box ok"><b class="k">Сущность «Станция»</b><div>Одна строка на станцию, запись хранит ссылку <code>station_id</code>. Адрес меняется в одном месте, посты привязаны к станции, отчёт «неявки по станциям» — один запрос.</div></div>
             <div class="m4e-box"><b class="k">А что останется атрибутом?</b><div>Канал записи (приложение, сайт, телефон): своих свойств у него нет, на него никто не ссылается — это атрибут <code>booking.source</code> со списком значений. Если бы у канала появились свои свойства (комиссия, ответственный), он стал бы сущностью-справочником.</div></div></div>`;
      }
      function drawLv() {
        const L = LEVELS[st.lv], box = TR.$('[data-lv]', el);
        box.innerHTML = `<div class="stack"><div data-lv-er></div><div class="m4e-grid2"><div class="m4e-box"><b class="k">Что на этом уровне</b><div>${L.what}</div></div><div class="m4e-box info"><b class="k">Для кого</b><div>${L.who}</div></div></div>${st.lv === 'physical' ? `<div><div class="small dim">Так этот уровень выглядит в живой схеме базы «Искры»:</div>${TR.db.schemaHTML(['booking_service'])}</div>` : ''}</div>`;
        const cfg = L.er(); cfg.title = 'Уровень модели: ' + L.t;
        erIn(TR.$('[data-lv-er]', box), cfg);
      }
      function drawMn() {
        const box = TR.$('[data-mn]', el);
        let cfg, txt;
        if (st.mn === 'raw') { cfg = { entities: [E('b', 'Запись', 10, 20, ['PK id', 'start_at']), E('s', 'Услуга', 330, 20, ['PK id', 'code'])], rels: [{ a: 'b', b: 's', ca: '0..N', cb: '1..N', t: 'включает' }] }; txt = 'На концептуальном уровне честно: в записи одна или много услуг, услуга — в нуле или многих записях. Но в таблицу так не положить: куда записать, какие услуги выбраны? В запись — списком нельзя (1НФ), в услугу — тоже.'; }
        else if (st.mn === 'res') { cfg = { entities: [E('b', 'Запись', 10, 20, ['PK id', 'start_at']), E('bs', 'Услуга в записи', 220, 20, ['PK FK booking_id', 'PK FK service_id'], { tone: 'accent', w: 190 }), E('s', 'Услуга', 450, 20, ['PK id', 'code'])], rels: [{ a: 'b', b: 'bs', ca: '1', cb: '1..N' }, { a: 's', b: 'bs', ca: '1', cb: '0..N' }] }; txt = 'Ассоциативная сущность <code>booking_service</code>: одна строка — «в записи X выбрана услуга Y». M:N распалась на две связи 1:N, «лапки» смотрят на связку. Ключ — пара внешних ключей.'; }
        else { cfg = { entities: [E('wo', 'Заказ-наряд', 10, 20, ['PK id', 'number', 'status']), E('wi', 'Строка заказ-наряда', 220, 20, ['PK id', 'FK work_order_id', 'FK service_id?', 'FK part_id?', 'qty', 'price'], { tone: 'accent', w: 200 }), E('s', 'Услуга', 470, 10, ['PK id', 'price']), E('p', 'Запчасть', 470, 120, ['PK id', 'price'])], rels: [{ a: 'wo', b: 'wi', ca: '1', cb: '0..N' }, { a: 's', b: 'wi', ca: '0..1', cb: '0..N' }, { a: 'p', b: 'wi', ca: '0..1', cb: '0..N' }] }; txt = 'Когда у связи появляются свои свойства — количество, цена на момент добавления, — связка становится полноценной сущностью со своим <code>id</code>. Строка заказ-наряда связывает наряд с услугой или запчастью и хранит копию цены: каталог подорожает, а документ клиента — нет.'; }
        box.innerHTML = `<div class="stack"><div data-mn-er></div><div class="m4e-box ${st.mn === 'raw' ? 'bad' : 'ok'}"><div>${txt}</div></div></div>`;
        erIn(TR.$('[data-mn-er]', box), cfg);
      }
      TR.on(el, 'click', '[data-br]', (e, b) => { st.b = b.dataset.br; drawBr(); });
      ui.onSeg(el, (n, v) => { if (n === 'st') { st.st = v; drawSt(); } if (n === 'lv') { st.lv = v; drawLv(); } if (n === 'mn') { st.mn = v; drawMn(); } });
      drawBr(); drawEr1(); drawSt(); drawLv(); drawMn();
      el.insertAdjacentHTML('beforeend', anNote('Концептуальную модель аналитик рисует <b>вместе с бизнесом</b> — Марина Олеговна должна узнать в ней свою работу. Логическую — вместе с Глебом: ключи, связки, обязательность. Физическую обычно ведёт разработчик, а аналитик сверяет её со словарём данных. Главная ошибка новичка — начать сразу с физической: таблицы есть, а понимания, что именно хранится и зачем, нет.'));
    }
  };

  // =====================================================================
  // Практика 1. Сущности, атрибуты и связи из рассказа Марины
  // =====================================================================
  const STORY = '«Клиент звонит или записывается в приложении: называет ФИО, телефон и машину — госномер, марку. Выбирает станцию, время и одну или несколько услуг из каталога; у каждой услуги есть нормо-часы и цена «от». На станции посты, утром я раскидываю записи по постам. Клиент приехал — я открываю заказ-наряд, механик добавляет строки: работы и запчасти, у каждой строки своя цена. Готово — клиент платит картой в приложении или у нас на кассе. Кофе в зоне ожидания, кстати, бесплатный. Я тут пятнадцать лет — всё это держу в голове».';
  const ENT_B = [{ id: 'ent', t: 'Сущность', sub: 'прямоугольник' }, { id: 'attr', t: 'Атрибут', sub: 'строка внутри' }, { id: 'rel', t: 'Связь', sub: 'линия' }, { id: 'none', t: 'Не для модели', sub: 'система не хранит' }];
  const ENT_I = [
    { id: 'e1', t: 'Клиент', ok: 'ent' }, { id: 'e2', t: 'Автомобиль', ok: 'ent' }, { id: 'e3', t: 'Станция', ok: 'ent', alt: { attr: 'У станции свои свойства (адрес, часы), их семь, на неё ссылаются посты и записи — сущность.' } },
    { id: 'e4', t: 'Пост', ok: 'ent' }, { id: 'e5', t: 'Услуга', ok: 'ent' }, { id: 'e6', t: 'Запись', ok: 'ent', alt: { rel: '«Клиент записывается» звучит как глагол-связь, но у записи свои свойства — время, статус, канал — и на неё ссылается заказ-наряд. Это событие-сущность. Засчитано наполовину.' } },
    { id: 'e7', t: 'Заказ-наряд', ok: 'ent' }, { id: 'e8', t: 'Строка заказ-наряда (работа или запчасть)', ok: 'ent', alt: { attr: 'Строк в наряде много, у каждой своя цена и количество — значит, это сущность, а не атрибут наряда.' } }, { id: 'e9', t: 'Платёж', ok: 'ent' },
    { id: 'a1', t: 'Госномер', ok: 'attr' }, { id: 'a2', t: 'Нормо-часы', ok: 'attr' }, { id: 'a3', t: 'Время начала записи', ok: 'attr' },
    { id: 'a4', t: 'Способ оплаты: карта или касса', ok: 'attr', alt: { ent: 'Можно сделать справочником, если у способов появятся свойства (комиссия, касса). В «Искре» — перечисление в атрибуте платежа. Засчитано наполовину.' } },
    { id: 'a5', t: 'Цена строки заказ-наряда', ok: 'attr' },
    { id: 'r1', t: 'Машина принадлежит клиенту', ok: 'rel' }, { id: 'r2', t: 'Пост находится на станции', ok: 'rel' }, { id: 'r3', t: 'В записи одна или несколько услуг', ok: 'rel' },
    { id: 'x1', t: 'Бесплатный кофе в зоне ожидания', ok: 'none' }, { id: 'x2', t: 'Пятнадцать лет опыта Марины Олеговны', ok: 'none', alt: { attr: 'Дата приёма на работу у сотрудника в модели есть, но «опыт в голове» — не данные системы. Засчитано наполовину.' } }
  ];
  const OWN_CH = ['Клиент', 'Автомобиль', 'Станция', 'Услуга', 'Запись', 'Заказ-наряд', 'Строка заказ-наряда', 'Платёж'].map(t => ({ v: t, t }));
  const OWN_R = [
    { id: 'o1', t: 'Телефон', ok: 'Клиент', why: 'Телефон — свойство клиента (и логин в приложении).' },
    { id: 'o2', t: 'Госномер', ok: 'Автомобиль', why: 'Госномер описывает машину, а не запись: машина приезжает много раз.' },
    { id: 'o3', t: 'Нормо-часы', ok: 'Услуга', why: 'Нормо-часы — из каталога услуг; из них считается длительность записи (BR-1).' },
    { id: 'o4', t: 'Время начала', ok: 'Запись', why: 'Время — свойство визита, а не клиента или станции.' },
    { id: 'o5', t: 'Статус ремонта («В работе», «Готов»)', ok: 'Заказ-наряд', alt: { 'Запись': 'У записи свой статус (подтверждена, приехал, неявка), а статус ремонта — у заказ-наряда.' }, why: 'Статус ремонта — у заказ-наряда; у записи — свой статус визита.' },
    { id: 'o6', t: 'Цена работы в документе клиента', ok: 'Строка заказ-наряда', alt: { 'Услуга': 'У услуги — цена каталога «от». В документе — копия цены на момент добавления, она живёт в строке наряда.' }, why: 'Копия цены на момент добавления — в строке; каталог может измениться.' },
    { id: 'o7', t: 'Способ оплаты', ok: 'Платёж', alt: { 'Заказ-наряд': 'Один наряд могут оплатить в две попытки разными способами — способ у платежа.' }, why: 'Способ — свойство конкретной попытки оплаты.' }
  ];
  function entEval(ans) {
    const v = (ans && ans.v) || {}, m = (ans && ans.m) || {};
    const items = ENT_I.map(r => { const g = v[r.id]; const s = !g ? 'none' : g === r.ok ? 'ok' : (r.alt && r.alt[g]) ? 'warn' : 'bad'; return { r, g, s, pts: s === 'ok' ? 1 : s === 'warn' ? 0.5 : 0 }; });
    const own = OWN_R.map(r => { const g = m[r.id]; const s = !g ? 'none' : g === r.ok ? 'ok' : (r.alt && r.alt[g]) ? 'warn' : 'bad'; return { r, g, s, pts: s === 'ok' ? 1 : s === 'warn' ? 0.5 : 0 }; });
    const score = Math.round((0.6 * items.reduce((s, x) => s + x.pts, 0) / ENT_I.length + 0.4 * own.reduce((s, x) => s + x.pts, 0) / OWN_R.length) * 100) / 100;
    return { items, own, score };
  }
  const ENT_HINT = { ent: 'Есть ли у этого свои свойства, много ли экземпляров, ссылаются ли на него?', attr: 'Это свойство чего-то другого — «какой?», «сколько?», «когда?»', rel: 'Здесь глагол между двумя существительными?', none: 'Будет ли система это хранить и обрабатывать?' };
  const taskEnt = {
    id: 't-ent', title: 'Сущности и атрибуты из рассказа Марины Олеговны',
    simple: howErd.simple,
    lead: ui.brief({
      situation: 'Вера включила диктофон на приёмке: Марина Олеговна за минуту рассказала, как живёт станция. «Из этой минуты получается концептуальная модель. Вытащите из неё кирпичи».',
      todo: [
        'Прочитайте рассказ и разложите 19 карточек: сущность, атрибут, связь или «не для модели».',
        'Ниже укажите, какой сущности принадлежит каждый из семи атрибутов.',
        'Нажмите «Проверить». Засчитывается от 80 %.'
      ],
      lookTitle: 'Подсказка',
      look: 'Существительное → кандидат в сущности, но не всякое: «госномер» — свойство машины. Глагол → связь. То, что система не хранит (кофе, опыт в голове), в модель не попадает.'
    }),
    blank: () => ({ v: {}, m: {} }),
    reference: () => ({ v: Object.fromEntries(ENT_I.map(r => [r.id, r.ok])), m: Object.fromEntries(OWN_R.map(r => [r.id, r.ok])) }),
    render(el, ctx) {
      el.classList.add('m4e-root');
      const ans = ctx.ans; ans.v = ans.v || {}; ans.m = ans.m || {};
      el.innerHTML = `<div class="stack">${ui.say('marina', esc(STORY))}<div data-s></div><h3 class="m4e-h3">Чей это атрибут?</h3><div data-m></div></div>`;
      let rs = null, rm = null;
      if (ctx.result) {
        const ev = entEval(ans); rs = {}; rm = {};
        ev.items.forEach(x => { if (x.g) rs[x.r.id] = x.s; });
        ev.own.forEach(x => { if (x.g) rm[x.r.id] = { s: x.s, why: x.s === 'ok' ? x.r.why : x.s === 'warn' ? x.r.alt[x.g] : 'Спросите: свойство чего это? Чего в «Искре» много, у кого это значение меняется?' }; });
      }
      ui.sort(TR.$('[data-s]', el), { items: ENT_I.map(r => ({ id: r.id, t: esc(r.t) })), buckets: ENT_B, value: ans.v, reveal: rs, readonly: ctx.readonly, seed: 'm4e-ent', onChange: v => { ans.v = v; ctx.save(); } });
      ui.match(TR.$('[data-m]', el), { rows: OWN_R.map(r => ({ id: r.id, t: esc(r.t) })), choices: OWN_CH, value: ans.m, reveal: rm, readonly: ctx.readonly, onChange: v => { ans.m = v; ctx.save(); } });
    },
    check(ans) {
      const ev = entEval(ans), notes = [];
      ev.items.forEach(x => {
        if (x.s === 'ok') return;
        if (x.s === 'warn') notes.push({ ok: 'warn', html: `«${esc(x.r.t)}» → ${esc(ENT_B.find(b => b.id === x.g).t)}. ${x.r.alt[x.g]}` });
        else notes.push({ ok: false, html: `«${esc(x.r.t)}» — ${x.g ? 'не ' + esc(ENT_B.find(b => b.id === x.g).t.toLowerCase()) + '.' : 'не разложено.'} ${ENT_HINT[x.r.ok]}` });
      });
      ev.own.forEach(x => { if (x.s === 'bad' || x.s === 'none') notes.push({ ok: false, html: `«${esc(x.r.t)}» — ${x.g ? 'не у «' + esc(x.g) + '».' : 'не указано.'} ${x.r.why}` }); else if (x.s === 'warn') notes.push({ ok: 'warn', html: x.r.alt[x.g] }); });
      if (!notes.length) notes.push({ ok: true, html: 'Девять сущностей, пять атрибутов, три связи и два лишних факта — концептуальная модель «Искры» готова.' });
      return {
        ok: ev.score >= 0.8, score: ev.score, notes,
        summary: `Карточки: верно ${ev.items.filter(x => x.s === 'ok').length} из ${ENT_I.length}; атрибуты привязаны верно: ${ev.own.filter(x => x.s === 'ok').length} из ${OWN_R.length}.`,
        mentor: ev.items.some(x => ['e3', 'e8'].includes(x.r.id) && x.s !== 'ok') ? 'Пройдите тест из трёх вопросов: свои свойства? много экземпляров? на него ссылаются? Станция и строка наряда отвечают «да» на все три.' : (ev.score < 0.8 ? 'Атрибут всегда «чей-то»: ищите, у кого это значение своё и меняется вместе с ним.' : '')
      };
    },
    explain: `<p>Из минуты рассказа получилась концептуальная модель: <b>Клиент, Автомобиль, Станция, Пост, Услуга, Запись, Заказ-наряд, Строка заказ-наряда, Платёж</b>. Механик и мастер-приёмщик в рассказе — тоже кандидаты; в «Искре» это одна сущность <b>Сотрудник</b> с ролью: свойства у них общие, а разница — в правах.</p>
      <p>Два места, где спотыкаются чаще всего:</p>
      <ul class="checks"><li><b>Запись</b> звучит как действие («записывается»), но это событие со своими свойствами — время, статус, канал. События, о которых надо помнить, — сущности.</li>
      <li><b>Цена</b> бывает у двух сущностей: цена «от» — у услуги каталога (BR-5), фактическая — в строке заказ-наряда, как копия на момент добавления.</li></ul>
      <p>Правило отбора: в модель попадает то, что система должна <b>хранить и обрабатывать</b>. Кофе и опыт Марины Олеговны важны для «Искры», но не для базы. Источник: П. Чен «The Entity-Relationship Model — Toward a Unified View of Data» (1976); Саймсион, Витт «Data Modeling Essentials».</p>`,
    refNote: 'Наполовину засчитываются: запись как связь, способ оплаты как сущность-справочник, опыт Марины как атрибут; статус ремонта у записи, цена документа у услуги, способ оплаты у заказ-наряда.',
    report: ans => { const ev = entEval(ans); return ev.items.map(x => `- ${x.r.t} → ${x.g ? ENT_B.find(b => b.id === x.g).t : '—'} ${mark(x.s)}`).join('\n') + '\n' + ev.own.map(x => `- ${x.r.t} → ${x.g || '—'} ${mark(x.s)}`).join('\n'); }
  };

  // =====================================================================
  // Теория 2. Мощность и обязательность, чтение вслух
  // =====================================================================
  const CAR_B = {
    '1': ['У каждого клиента ровно одна машина.', 'bad', 'Клиент без машины не зарегистрируется, а у Тимура Рашидовича не может быть второй машины.'],
    '0..1': ['У клиента может быть не больше одной машины — или ни одной.', 'bad', 'Вторую машину не добавить: семья с двумя машинами заведёт второго «клиента» с тем же телефоном — и упрётся в UNIQUE.'],
    '1..N': ['У каждого клиента одна или несколько машин — без машины клиента не бывает.', 'warn', 'В приложении клиент сначала регистрируется, а машину добавляет потом: в момент регистрации сохранить его будет нельзя.'],
    '0..N': ['У клиента может быть ноль, одна или много машин.', 'ok', 'Так в «Искре»: зарегистрировался без машины — можно, у «Шашки» — десятки машин.']
  };
  const CAR_A = {
    '1': ['Каждая машина принадлежит ровно одному клиенту.', 'ok', 'Так в «Искре»: у машины в базе один владелец — тот, кто её записывает и получает SMS.'],
    '0..1': ['Машина может быть без владельца, но не больше одного.', 'warn', '«Ничья» машина в базе: кому слать SMS о готовности (BR-13)? Возможно для машин, пригнанных эвакуатором, — но это вопрос к Марине Олеговне.'],
    '1..N': ['У машины один или несколько владельцев.', 'bad', 'Это уже M:N: понадобится ассоциативная сущность «Владение» (клиент, машина, с какого числа). Для каршеринга — да, для «Искры» MVP — лишнее.'],
    '0..N': ['У машины может быть сколько угодно владельцев или ни одного.', 'bad', 'M:N плюс «ничьи» машины — модель стала сложнее, а ни одна ситуация «Искры» этого не требует.']
  };
  const READS = [
    { v: 'cb', t: 'Клиент — Запись', er: { a: 'Клиент', b: 'Запись', ca: '1', cb: '0..N' }, r: ['Каждый клиент может сделать <b>ноль или много</b> записей.', 'Каждая запись сделана <b>ровно одним</b> клиентом.'], why: 'Зарегистрировался и ещё не записался — ноль; Елена — постоянный клиент — много. Запись без клиента не бывает.' },
    { v: 'bw', t: 'Запись — Заказ-наряд', er: { a: 'Запись', b: 'Заказ-наряд', ca: '0..1', cb: '0..1' }, r: ['Каждая запись может превратиться <b>не более чем в один</b> заказ-наряд (или ни в один).', 'Каждый заказ-наряд открыт <b>не более чем по одной</b> записи (или без записи).'], why: 'Неявка — записи без наряда; таксист без записи — наряд без записи. Ноль в обе стороны — не небрежность, а жизнь.' },
    { v: 'sp', t: 'Станция — Пост', er: { a: 'Станция', b: 'Пост', ca: '1', cb: '1..N' }, r: ['На каждой станции <b>один или много</b> постов.', 'Каждый пост находится <b>ровно на одной</b> станции.'], why: 'От 4 постов на Дербышках до 8 на Победы. Станции без постов не бывает.' },
    { v: 'wp', t: 'Заказ-наряд — Платёж', er: { a: 'Заказ-наряд', b: 'Платёж', ca: '1', cb: '0..N' }, r: ['Каждый заказ-наряд может иметь <b>ноль или много</b> платежей.', 'Каждый платёж относится <b>ровно к одному</b> заказ-наряду.'], why: 'Пока не оплачен — ноль; карта не прошла, оплатили СБП — два. Каждая попытка нужна Ольге Викторовне для сверки с ЮKassa.' }
  ];
  const howCard = {
    id: 'how-card', covers: ['t-card', 't-build'], title: 'Как это работает: мощность, обязательность и «вороньи лапки»', free: true, noReset: true,
    simple: {
      icon: '🐾',
      plain: 'На каждом конце линии два значка. Ближний к прямоугольнику отвечает «сколько максимум?»: черта — один, «лапка» — много. Дальний отвечает «может ли быть ноль?»: кружок — может, черта — нет, хотя бы один обязателен. Читают от одного прямоугольника к значкам у другого: «у клиента — ноль или много машин».',
      analogy: 'Ресторан: «у каждого столика ноль или много заказов за вечер» и «каждый заказ — ровно за одним столиком». Если ошибиться и написать «у столика ровно один заказ», официант не сможет принять второй заказ от того же стола.',
      tech: 'Мощность (cardinality, кратность) — максимальное число экземпляров на другом конце: 1 или N. Обязательность (optionality, модальность, участие) — минимальное: 0 (необязательно) или 1 (обязательно). Нотация Crow\'s Foot (Г. Эверест, 1976; Information Engineering — Дж. Мартин): черта — один, кружок — ноль, «воронья лапка» — много. Четыре комбинации: ровно один (||), ноль или один (o|), один или много (|<), ноль или много (o<).'
    },
    lead: ui.brief({
      situation: 'Глеб показывает на линию «Клиент — Автомобиль»: «Вот эти закорючки — самое важное на диаграмме. Ошибёшься в одной — и база не даст сохранить реальную ситуацию. Или даст сохранить мусор».',
      todo: [
        'Посмотрите четыре значка и что они говорят.',
        'В конструкторе выберите значок у клиента и у машины — диаграмма, чтение вслух и последствия для «Искры» обновятся сразу.',
        'Переключайте четыре связи «Искры» и прочитайте каждую вслух в обе стороны.'
      ],
      look: 'Значок у прямоугольника Б отвечает на вопрос «сколько Б у одного А?». Поэтому «лапка» у машины значит «машин у клиента много».'
    }),
    render(el) {
      el.classList.add('m4e-root');
      const st = { a: '1', b: '0..N', rd: 'cb' };
      el.innerHTML = `<div class="stack">
        <h3 class="m4e-h3">1. Четыре значка</h3>
        <div class="m4e-grid4">${CARD_K.map(k => `<div class="m4e-box" style="justify-items:center;text-align:center">${glyph(k, 'r')}<b>${esc(CARD[k])}</b><span class="small dim">${{ '1': 'черта + черта: минимум 1, максимум 1', '0..1': 'кружок + черта: минимум 0, максимум 1', '1..N': 'черта + лапка: минимум 1, максимум много', '0..N': 'кружок + лапка: минимум 0, максимум много' }[k]}</span></div>`).join('')}</div>
        <div class="m4e-box info"><b class="k">Как не запутаться</b><div>Ближний к прямоугольнику значок — <b>максимум</b> (черта — один, лапка — много). Дальний — <b>минимум</b> (кружок — ноль, черта — один). Максимум — это <b>мощность</b>, минимум — <b>обязательность</b>.</div></div>
        <h3 class="m4e-h3">2. Конструктор: Клиент — Автомобиль</h3>
        <div class="m4e-grid2">
          <div class="m4e-glrow"><span class="lbl">Значок у «Клиент»: сколько клиентов у одной машины?</span><div class="m4e-glbtns">${CARD_K.map(k => `<button type="button" class="m4e-gl" data-ga="${k}" aria-pressed="${k === st.a}" aria-label="${esc(CARD[k])}">${glyph(k, 'l')}<span>${esc(CARD[k])}</span></button>`).join('')}</div></div>
          <div class="m4e-glrow"><span class="lbl">Значок у «Автомобиль»: сколько машин у одного клиента?</span><div class="m4e-glbtns">${CARD_K.map(k => `<button type="button" class="m4e-gl" data-gb="${k}" aria-pressed="${k === st.b}" aria-label="${esc(CARD[k])}">${glyph(k, 'r')}<span>${esc(CARD[k])}</span></button>`).join('')}</div></div>
        </div>
        <div data-cer></div>
        <div data-cread></div>
        <h3 class="m4e-h3">3. Читаем ERD «Искры» вслух</h3>
        <div>${ui.seg('rd', READS.map(r => ({ v: r.v, t: r.t })), st.rd)}</div>
        <div data-rd></div>
        <div class="m4e-box"><b class="k">Шаблон чтения</b><div>«Каждый <i>А</i> <b>может</b> (если ноль допустим) / <b>должен</b> (если обязателен) <i>глагол</i> <b>ровно один / не более одного / один или много / ноль или много</b> <i>Б</i>». И обязательно — в обе стороны: связь — это два утверждения.</div></div>
        ${interview('Чем мощность отличается от обязательности? Прочитайте связь.', 'Мощность — максимум (один или много), обязательность — минимум (ноль или хотя бы один). На «вороньей лапке» ближний к сущности значок — максимум, дальний — минимум. Сильный кандидат читает в обе стороны и приводит ситуацию: «у заказ-наряда ноль или много платежей — потому что неуспешная попытка тоже платёж».')}
      </div>`;
      function drawC() {
        TR.$$('[data-ga]', el).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.ga === st.a)));
        TR.$$('[data-gb]', el).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.gb === st.b)));
        erIn(TR.$('[data-cer]', el), { entities: [E('c', 'Клиент', 10, 10, ['PK id', 'phone']), E('car', 'Автомобиль', 380, 10, ['PK id', 'FK client_id', 'plate'])], rels: [{ a: 'c', b: 'car', ca: st.a, cb: st.b, t: 'владеет' }], title: 'Клиент — Автомобиль' });
        const fb = CAR_B[st.b], fa = CAR_A[st.a];
        TR.$('[data-cread]', el).innerHTML = `<div class="m4e-grid2"><div class="m4e-box ${fb[1] === 'ok' ? 'ok' : fb[1] === 'bad' ? 'bad' : 'info'}"><b class="k">Читаем от клиента</b><div><b>${fb[0]}</b></div><div class="small">${fb[2]}</div></div>
          <div class="m4e-box ${fa[1] === 'ok' ? 'ok' : fa[1] === 'bad' ? 'bad' : 'info'}"><b class="k">Читаем от машины</b><div><b>${fa[0]}</b></div><div class="small">${fa[2]}</div></div></div>`;
      }
      function drawRd() {
        const r = READS.find(x => x.v === st.rd);
        TR.$('[data-rd]', el).innerHTML = `<div class="stack"><div class="m4e-svg">${pairSVG(r.er.a, r.er.b, r.er.ca, r.er.cb)}</div><div class="m4e-box acc"><div>→ ${r.r[0]}</div><div>← ${r.r[1]}</div><div class="small">${r.why}</div></div></div>`;
      }
      TR.on(el, 'click', '[data-ga]', (e, b) => { st.a = b.dataset.ga; drawC(); });
      TR.on(el, 'click', '[data-gb]', (e, b) => { st.b = b.dataset.gb; drawC(); });
      ui.onSeg(el, (n, v) => { if (n === 'rd') { st.rd = v; drawRd(); } });
      drawC(); drawRd();
      el.insertAdjacentHTML('beforeend', anNote('Мощность и обязательность аналитик <b>не придумывает, а выясняет</b> — вопросами про исключения: «А бывает клиент без машины? А машина у двух людей? А заказ-наряд без записи?». Каждый ответ Марины Олеговны — это кружок или черта на диаграмме, а значит, NULL или NOT NULL, UNIQUE или связующая таблица в базе.'));
    }
  };

  // =====================================================================
  // Практика 2. Мощности для 8 пар — визуальный выбор значков
  // =====================================================================
  const CP = [
    { id: 'c1', a: 'Клиент', b: 'Автомобиль', fa: 'Владельцев у одного автомобиля', fb: 'Автомобилей у одного клиента', ca: '1', cb: '0..N', alt: { cb: { '1..N': 'Клиент регистрируется в приложении раньше, чем добавляет машину: «хотя бы одна» не даст его сохранить.' } }, why: 'Машину добавляют после регистрации; владелец в базе — один.' },
    { id: 'c2', a: 'Станция', b: 'Пост', fa: 'Станций у одного поста', fb: 'Постов на одной станции', ca: '1', cb: '1..N', alt: { cb: { '0..N': 'Новую станцию могут завести в системе до монтажа подъёмников — допустимо, но у всех семи станций посты есть.' } }, why: 'От 4 до 8 постов, без постов станция не работает.' },
    { id: 'c3', a: 'Клиент', b: 'Запись', fa: 'Клиентов у одной записи', fb: 'Записей у одного клиента', ca: '1', cb: '0..N', alt: { cb: { '1..N': 'В базе есть клиент без визитов — зарегистрировался и не записался. «Хотя бы одна» сделала бы его невозможным.' } }, why: 'Без записей — можно (зарегистрировался), запись без клиента — нельзя.' },
    { id: 'c4', a: 'Запись', b: 'Заказ-наряд', fa: 'Записей у одного заказ-наряда', fb: 'Заказ-нарядов у одной записи', ca: '0..1', cb: '0..1', alt: {}, why: 'Таксист без записи — наряд без записи; неявка — запись без наряда; больше одного — никогда.' },
    { id: 'c5', a: 'Запись', b: 'Услуга', fa: 'Записей с одной услугой', fb: 'Услуг в одной записи', ca: '0..N', cb: '1..N', alt: { ca: { '1..N': 'Новую услугу добавляют в каталог раньше, чем на неё кто-то запишется: ноль должен быть допустим.' } }, why: 'В записи хотя бы одна услуга (из неё считается длительность, BR-1); услуга может быть ещё ни разу не выбрана.' },
    { id: 'c6', a: 'Заказ-наряд', b: 'Строка', fa: 'Нарядов у одной строки', fb: 'Строк в одном наряде', ca: '1', cb: '0..N', alt: { cb: { '1..N': 'Мастер открывает наряд при приёмке, строки механик добавит позже — в момент открытия их ноль.' } }, why: 'Открыли — строк ещё нет; строка без наряда не бывает.' },
    { id: 'c7', a: 'Заказ-наряд', b: 'Платёж', fa: 'Нарядов у одного платежа', fb: 'Платежей у одного наряда', ca: '1', cb: '0..N', alt: { cb: { '1..N': 'До оплаты платежей ноль — а наряд уже существует.' } }, why: 'Пока не оплачен — ноль, карта не прошла — две попытки.' },
    { id: 'c8', a: 'Компания', b: 'Клиент', fa: 'Компаний у одного клиента', fb: 'Клиентов-сотрудников у компании', ca: '0..1', cb: '0..N', alt: { cb: { '1..N': 'Договор с компанией заключают раньше, чем водители зарегистрируются, — допустимо, но ноль надёжнее.' } }, why: 'Частные клиенты — без компании; водителей «Шашки» — много.' }
  ];
  function cardEval(ans) {
    const p = (ans && ans.p) || {};
    const rows = CP.map(c => {
      const g = p[c.id] || {};
      const one = (side) => { const v = g[side], ref = c[side]; if (!v) return 'none'; if (v === ref) return 'ok'; if (c.alt[side] && c.alt[side][v]) return 'warn'; return 'bad'; };
      const sa = one('ca'), sb = one('cb');
      const pts = ((sa === 'ok' ? 1 : sa === 'warn' ? 0.5 : 0) + (sb === 'ok' ? 1 : sb === 'warn' ? 0.5 : 0)) / 2;
      return { c, g, sa, sb, pts, s: pts >= 1 ? 'ok' : pts > 0 ? 'warn' : (g.ca || g.cb ? 'bad' : 'none') };
    });
    return { rows, score: Math.round(rows.reduce((s, x) => s + x.pts, 0) / CP.length * 100) / 100 };
  }
  const taskCard = {
    id: 't-card', title: 'Мощности для 8 пар: выбрать «вороньи лапки»',
    simple: howCard.simple,
    lead: ui.brief({
      situation: 'Глеб: «Я нарисовал линии, а значки оставил тебе. На каждом конце — один из четырёх. Под каждой парой сразу будет видно, как связь читается вслух, — если читается странно, значит, значок не тот».',
      todo: [
        'Для каждой из восьми пар выберите значок у первой сущности и у второй.',
        'Сверяйтесь с живым чтением под парой: оно должно звучать как правда об «Искре».',
        'Нажмите «Проверить». Засчитывается от 80 %; где граница спорная, ответ засчитывается наполовину с пояснением.'
      ],
      lookTitle: 'Подсказка',
      look: 'Для каждого конца задайте два вопроса: «бывает ли ноль?» (кружок или черта) и «бывает ли больше одного?» (черта или лапка). Ищите исключения: неявка, клиент без записи, оплата в две попытки.'
    }),
    blank: () => ({ p: {} }),
    reference: () => ({ p: Object.fromEntries(CP.map(c => [c.id, { ca: c.ca, cb: c.cb }])) }),
    render(el, ctx) {
      el.classList.add('m4e-root');
      const ans = ctx.ans; ans.p = ans.p || {};
      const ev = ctx.result ? cardEval(ans) : null;
      el.innerHTML = `<div class="m4e-pairs">${CP.map((c, i) => `<div class="m4e-pair" data-pair="${c.id}"></div>`).join('')}</div>`;
      const ro = ctx.readonly ? 'disabled' : '';
      function drawPair(c, i) {
        const g = ans.p[c.id] || {}, x = ev && ev.rows[i];
        const box = TR.$(`[data-pair="${c.id}"]`, el);
        box.className = 'm4e-pair ' + (x && x.s !== 'none' ? x.s : '');
        const btns = (side, s) => CARD_K.map(k => `<button type="button" class="m4e-gl ${x && s && g[side] === k ? (s === 'ok' ? 'ok' : s === 'warn' ? 'warn' : 'bad') : ''}" data-cp="${c.id}" data-side="${side}" data-v="${k}" aria-pressed="${g[side] === k}" aria-label="${esc(CARD[k])}" ${ro}>${glyph(k, side === 'ca' ? 'l' : 'r')}<span>${esc(CARD[k])}</span></button>`).join('');
        let fb = '';
        if (x && x.s !== 'none') {
          const w = [];
          if (x.sa === 'warn') w.push(c.alt.ca[g.ca]); if (x.sb === 'warn') w.push(c.alt.cb[g.cb]);
          fb = `<div class="small">${x.s === 'ok' ? '✓ ' + c.why : (w.length ? w.join(' ') : '') + (x.sa === 'bad' || x.sb === 'bad' || x.sa === 'none' || x.sb === 'none' ? ` Не тот значок ${x.sa !== 'ok' && x.sa !== 'warn' ? 'у «' + esc(c.a) + '»' : ''}${(x.sa !== 'ok' && x.sa !== 'warn') && (x.sb !== 'ok' && x.sb !== 'warn') ? ' и ' : ''}${x.sb !== 'ok' && x.sb !== 'warn' ? 'у «' + esc(c.b) + '»' : ''}: спросите «бывает ли ноль?» и «бывает ли больше одного?».` : '')}</div>`;
        }
        box.innerHTML = `<header><span>${esc(c.a)} — ${esc(c.b)}</span></header>
          <div class="m4e-svg">${pairSVG(c.a, c.b, g.ca, g.cb)}</div>
          <div class="m4e-glrow"><span class="lbl">Значок у «${esc(c.a)}» — ${esc(c.fa.toLowerCase())}</span><div class="m4e-glbtns">${btns('ca', x && x.sa)}</div></div>
          <div class="m4e-glrow"><span class="lbl">Значок у «${esc(c.b)}» — ${esc(c.fb.toLowerCase())}</span><div class="m4e-glbtns">${btns('cb', x && x.sb)}</div></div>
          <div class="m4e-read">${g.cb ? `<div>→ ${esc(c.fb)}: <b>${esc(CARD[g.cb])}</b>.</div>` : ''}${g.ca ? `<div>← ${esc(c.fa)}: <b>${esc(CARD[g.ca])}</b>.</div>` : ''}${!g.ca && !g.cb ? '<div class="dim">Выберите значки — здесь появится чтение вслух.</div>' : ''}</div>${fb}`;
      }
      CP.forEach(drawPair);
      TR.on(el, 'click', '[data-cp]', (e, b) => {
        if (ctx.readonly) return;
        const c = CP.find(x => x.id === b.dataset.cp), g = ans.p[c.id] = ans.p[c.id] || {};
        g[b.dataset.side] = b.dataset.v; ctx.save();
        const i = CP.indexOf(c); const keepEv = ev; if (keepEv) keepEv.rows[i] = { s: 'none' };
        drawPair(c, i);
      });
    },
    check(ans) {
      const ev = cardEval(ans), notes = [];
      ev.rows.forEach(x => {
        const lbl = `${esc(x.c.a)} — ${esc(x.c.b)}`;
        if (x.s === 'ok') notes.push({ ok: true, html: `${lbl}: ${CARD[x.c.ca]} — ${CARD[x.c.cb]}. ${x.c.why}` });
        else if (x.s === 'none') notes.push({ ok: false, html: `${lbl}: значки не выбраны.` });
        else {
          const w = []; if (x.sa === 'warn') w.push(x.c.alt.ca[x.g.ca]); if (x.sb === 'warn') w.push(x.c.alt.cb[x.g.cb]);
          notes.push({ ok: x.pts >= 0.5 ? 'warn' : false, html: `${lbl}: ${w.length ? w.join(' ') : 'не тот значок.'} Верно: у «${esc(x.c.a)}» — ${CARD[x.c.ca]}, у «${esc(x.c.b)}» — ${CARD[x.c.cb]}. ${x.c.why}` });
        }
      });
      const c4 = ev.rows.find(x => x.c.id === 'c4');
      return {
        ok: ev.score >= 0.8, score: ev.score, notes,
        summary: `Пар полностью верно: ${ev.rows.filter(x => x.s === 'ok').length} из 8, общий балл ${Math.round(ev.score * 100)} %.`,
        mentor: c4 && c4.s !== 'ok' ? 'Запись и заказ-наряд — любимый вопрос Глеба. Вспомните таксиста «Шашки», который заехал без записи, и клиента, который не приехал. Оба конца — «ноль или один».' : (ev.score < 0.8 ? 'Кружок — это вопрос «а бывает, что ещё нет?». Почти всегда бывает: клиент без записей, наряд без строк, наряд без оплаты.' : '')
      };
    },
    explain: `<p>Восемь пар — восемь бизнес-правил, записанных значками:</p>
      <ul class="checks"><li><b>Ноль</b> (кружок) — почти всегда про время: машину добавят позже, строки появятся позже, оплатят позже. Если поставить черту, база не даст сохранить объект «в начале жизни».</li>
      <li><b>Много</b> (лапка) — про повтор: платёж в две попытки, клиент с двумя машинами, сто записей на ТО-1.</li>
      <li><b>Запись — Заказ-наряд</b> — «ноль или один» с обеих сторон: в базе это <code>work_order.booking_id</code> NULL + UNIQUE.</li>
      <li><b>Запись — Услуга</b> — M:N, на логическом уровне превращается в «Услугу в записи».</li></ul>
      <p>Типичная ошибка — ставить черту «для порядка»: «у наряда хотя бы одна строка», «у клиента хотя бы одна машина». Это не порядок, а запрет реальной ситуации. Источник: Г. Эверест (1976), нотация Information Engineering (Дж. Мартин); Саймсион, Витт «Data Modeling Essentials», гл. о связях.</p>`,
    refNote: 'Наполовину засчитываются «один или много» вместо «ноль или много» там, где ноль — начальное состояние (машина, запись, строка, платёж, водители компании, посты новой станции, записи с новой услугой).',
    report: ans => cardEval(ans).rows.map(x => `- ${x.c.a} — ${x.c.b}: ${x.g.ca || '?'} / ${x.g.cb || '?'} ${mark(x.s)}`).join('\n')
  };

  // =====================================================================
  // Практика 3. Лаборатория: собрать ERD «Искры» → неделя ситуаций
  // =====================================================================
  const B_ENT = [
    ['client', 'Клиент', 10, 10, ['PK id', 'full_name', 'phone']],
    ['car', 'Автомобиль', 10, 210, ['PK id', 'FK client_id', 'plate']],
    ['booking', 'Запись', 290, 90, ['PK id', 'FK client_id', 'FK car_id', 'FK station_id', 'FK post_id?', 'start_at', 'status']],
    ['station', 'Станция', 840, 10, ['PK id', 'name']],
    ['post', 'Пост', 840, 200, ['PK id', 'FK station_id', 'name']],
    ['bs', 'Услуга в записи', 560, 250, ['PK FK booking_id', 'PK FK service_id']],
    ['service', 'Услуга', 840, 380, ['PK id', 'code', 'price']],
    ['wo', 'Заказ-наряд', 290, 380, ['PK id', 'FK booking_id?', 'number', 'status']],
    ['wi', 'Строка наряда', 560, 470, ['PK id', 'FK work_order_id', 'qty', 'price']],
    ['pay', 'Платёж', 10, 430, ['PK id', 'FK work_order_id', 'amount', 'status']]
  ];
  const B_REL = [
    { id: 'r1', a: 'client', b: 'car', ca: '1', cb: '0..N', alt: { cb: ['1..N'] } },
    { id: 'r2', a: 'station', b: 'post', ca: '1', cb: '1..N', alt: { cb: ['0..N'] } },
    { id: 'r3', a: 'client', b: 'booking', ca: '1', cb: '0..N', alt: { cb: ['1..N'] } },
    { id: 'r4', a: 'car', b: 'booking', ca: '1', cb: '0..N', alt: { cb: ['1..N'] } },
    { id: 'd2', a: 'car', b: 'post', ca: '0..N', cb: '0..1', distractor: true, t: 'Автомобиль — Пост (машина закреплена за постом)' },
    { id: 'r5', a: 'station', b: 'booking', ca: '1', cb: '0..N', alt: { cb: ['1..N'] } },
    { id: 'r6', a: 'post', b: 'booking', ca: '0..1', cb: '0..N', alt: {} },
    { id: 'r7', a: 'booking', b: 'bs', ca: '1', cb: '1..N', alt: {} },
    { id: 'r8', a: 'service', b: 'bs', ca: '1', cb: '0..N', alt: { cb: ['1..N'] } },
    { id: 'd1', a: 'client', b: 'service', ca: '0..N', cb: '0..N', distractor: true, t: 'Клиент — Услуга (какие услуги заказывал клиент)' },
    { id: 'r9', a: 'booking', b: 'wo', ca: '0..1', cb: '0..1', alt: {} },
    { id: 'r10', a: 'wo', b: 'wi', ca: '1', cb: '0..N', alt: { cb: ['1..N'] } },
    { id: 'r11', a: 'wo', b: 'pay', ca: '1', cb: '0..N', alt: {} }
  ];
  const ENT_T = Object.fromEntries(B_ENT.map(e => [e[0], e[1]]));
  const relName = r => r.t || `${ENT_T[r.a]} — ${ENT_T[r.b]}`;
  const B_SC = [
    { id: 's1', day: 'Пн 09:00', t: 'Новый клиент зарегистрировался в приложении, машину добавит вечером.', rel: 'r1', ok: m => m.on('r1') && has0(m.cb('r1')), fail: 'Регистрация не сохраняется: модель требует хотя бы одну машину. Даша в приложении делает обязательный шаг «добавьте машину» — 30 % бросают регистрацию.' },
    { id: 's2', day: 'Пн 09:05', t: 'У Тимура Рашидовича две машины — обе на одном аккаунте.', rel: 'r1', ok: m => m.on('r1') && many(m.cb('r1')), fail: 'Вторая машина не помещается: клиенту придётся заводить второй аккаунт с другим телефоном.' },
    { id: 's3', day: 'Пн 10:00', t: 'Елена записалась на ТО-1 и шиномонтаж одной записью.', rel: 'r7', ok: m => m.on('r7') && m.on('r8') && many(m.cb('r7')), fail: 'В записи помещается только одна услуга — Елене приходится делать две записи подряд, и они «съедают» два слота.' },
    { id: 's4', day: 'Пн 10:00', t: 'Услугу ТО-1 выбрали в сотне записей за неделю.', rel: 'r8', ok: m => m.on('r8') && many(m.cb('r8')), fail: 'Одну услугу каталога можно выбрать только в одной записи — каталог приходится копировать на каждую запись.' },
    { id: 's5', day: 'Вт 18:00', t: 'Онлайн-запись на субботу: пост назначит мастер утром.', rel: 'r6', ok: m => m.on('r6') && has0(m.ca('r6')), fail: 'Без поста запись не сохраняется: приложение ставит «пост 1» по умолчанию, в субботу там пять машин на одно время.' },
    { id: 's6', day: 'Ср 08:10', t: 'На станции Победы — 8 постов.', rel: 'r2', ok: m => m.on('r2') && many(m.cb('r2')) && m.ca('r2') === '1', fail: 'Модель не даёт станции несколько постов (или пост «висит» без станции) — расписание по постам не построить.' },
    { id: 's7', day: 'Ср 09:30', t: 'Таксист «Шашки» заехал без записи — мастер открывает заказ-наряд.', rel: 'r9', ok: m => m.on('r9') && has0(m.ca('r9')), fail: 'Наряд без записи не сохранить — Марина создаёт фиктивную запись задним числом, и статистика неявок врёт.' },
    { id: 's8', day: 'Ср 11:15', t: 'Клиент не приехал — неявка, заказ-наряда нет.', rel: 'r9', ok: m => m.on('r9') && has0(m.cb('r9')), fail: 'Каждая запись обязана иметь наряд: на неявку создаётся пустой наряд, и выручка «на станцию» считается по пустым документам.' },
    { id: 's9', day: 'Чт 12:00', t: 'Мастер открыл наряд при приёмке; работы механик добавит после диагностики.', rel: 'r10', ok: m => m.on('r10') && has0(m.cb('r10')), fail: 'Наряд без строк не сохраняется — мастер вписывает «диагностика 0 ₽», чтобы открыть документ.' },
    { id: 's10', day: 'Пт 17:40', t: 'Карта не прошла, клиент оплатил через СБП — две попытки.', rel: 'r11', ok: m => m.on('r11') && many(m.cb('r11')), fail: 'Второй платёж затирает первый — Ольга Викторовна не может сверить неуспешную попытку с отчётом ЮKassa.' },
    { id: 's11', day: 'Пт 19:00', t: 'Кирилл строит отчёт «какие услуги заказывал клиент».', rel: 'd1', ok: m => !m.on('d1'), fail: 'Две дороги к одному ответу: через запись и через прямую связь «Клиент — Услуга». Они разошлись (в прямой остались услуги из отменённых записей) — отчёт Кирилла не сходится с нарядами.' },
    { id: 's12', day: 'Сб 10:00', t: 'Машина Елены сегодня на посту 3, а в следующий раз — на посту 5.', rel: 'd2', ok: m => !m.on('d2'), fail: 'Постоянная связь «Автомобиль — Пост» закрепляет машину за постом навсегда: какой пост был в прошлый раз — непонятно. Пост — свойство записи, а не машины.' },
    { id: 's13', day: 'Сб 12:00', t: 'Ошибка в коде пытается сохранить запись без клиента и без машины.', rel: 'r3', ok: m => m.on('r3') && m.on('r4') && m.ca('r3') === '1' && m.ca('r4') === '1', fail: 'Запись-сирота сохранилась: напоминание отправить некому, на приёмке не видно, какая машина приедет.' }
  ];
  function buildModel(ans) {
    const e = (ans && ans.e) || {}, off = (ans && ans.off) || {};
    return { on: id => !off[id], ca: id => (e[id] || {}).ca || '', cb: id => (e[id] || {}).cb || '' };
  }
  function buildEval(ans) {
    const m = buildModel(ans);
    const sc = B_SC.map(s => ({ s, ok: !!s.ok(m) }));
    const rels = B_REL.map(r => {
      if (r.distractor) { const s = m.on(r.id) ? 'bad' : 'ok'; return { r, s, pts: s === 'ok' ? 2 : 0 }; }
      if (!m.on(r.id)) return { r, s: 'bad', pts: 0, removed: true };
      const sd = side => { const v = m[side](r.id); if (!v) return 'none'; if (v === r[side]) return 'ok'; return r.alt[side] && r.alt[side].includes(v) ? 'warn' : 'bad'; };
      const a = sd('ca'), b = sd('cb'), p = x => x === 'ok' ? 1 : x === 'warn' ? 0.5 : 0;
      const pts = p(a) + p(b);
      return { r, a, b, s: pts >= 2 ? 'ok' : pts > 0 ? 'warn' : 'bad', pts };
    });
    const relScore = rels.reduce((s, x) => s + x.pts, 0) / (B_REL.length * 2);
    const scScore = sc.filter(x => x.ok).length / B_SC.length;
    return { sc, rels, relScore, scScore, fails: sc.filter(x => !x.ok), score: Math.round((0.6 * scScore + 0.4 * relScore) * 100) / 100 };
  }
  const taskBuild = {
    id: 't-build', title: 'Лаборатория: собрать ERD «Искры» и прогнать неделю',
    simple: howCard.simple,
    lead: ui.brief({
      situation: 'Глеб: «Вот десять сущностей и тринадцать линий — две из них я нарисовал с подвохом. Поставь значки, убери лишнее, и Лиза прогонит по твоей модели неделю жизни станции. Что модель не сможет сохранить — увидим сразу».',
      todo: [
        'Расставьте сущности на доске, как вам удобно (перетаскивайте прямоугольники).',
        'Для каждой связи выберите значок у обеих сущностей. Если связь лишняя — снимите галочку «в модели».',
        'Нажмите «Прогнать неделю» и прочитайте последствия. Меняйте модель — результаты пересчитываются сразу.',
        'Нажмите «Проверить». Засчитывается от 80 % и если не больше двух ситуаций недели модель не выдерживает.'
      ],
      lookTitle: 'Подсказка',
      look: 'Лишняя связь — та, что дублирует путь через другие сущности или описывает временное состояние как постоянное. Значки выбирайте вопросами «бывает ли ноль?» и «бывает ли больше одного?».'
    }),
    blank: () => ({ e: {}, off: {}, pos: {}, ran: false }),
    reference: () => ({ e: Object.fromEntries(B_REL.filter(r => !r.distractor).map(r => [r.id, { ca: r.ca, cb: r.cb }])), off: { d1: true, d2: true }, pos: {}, ran: true }),
    render(el, ctx) {
      el.classList.add('m4e-root');
      const ans = ctx.ans; ans.e = ans.e || {}; ans.off = ans.off || {}; ans.pos = ans.pos || {};
      let dirty = false;
      const showRes = () => (!!ctx.result && !dirty) || ctx.readonly;
      const ents = B_ENT.map(x => { const p = ans.pos[x[0]]; return E(x[0], x[1], p ? p[0] : x[2], p ? p[1] : x[3], x[4], { w: 190 }); });
      el.innerHTML = `<div class="stack"><div data-board></div><div class="small dim">Перетаскивайте прямоугольники — расположение сохранится. Значки на линиях появятся, когда вы их выберете ниже.</div>
        <div class="m4e-rels" data-rels></div>
        <div class="row"><button type="button" class="btn primary" data-run>${ans.ran ? 'Прогнать неделю ещё раз' : 'Прогнать неделю'}</button><span class="small dim" data-cnt></span></div>
        <div data-res></div></div>`;
      const relsCfg = () => {
        const ev = showRes() ? buildEval(ans) : null;
        return B_REL.filter(r => !ans.off[r.id]).map(r => { const g = ans.e[r.id] || {}; const x = ev && ev.rels.find(y => y.r.id === r.id); return { a: r.a, b: r.b, ca: g.ca || '', cb: g.cb || '', dash: !g.ca || !g.cb, tone: x ? (x.s === 'ok' ? 'ok' : x.s === 'warn' ? 'warn' : 'bad') : '' }; });
      };
      const er = ui.er(TR.$('[data-board]', el), { entities: ents, rels: relsCfg(), width: 1050, height: 600, draggable: !ctx.readonly, title: 'ERD «Искры» — лаборатория', onMove: (id, x, y) => { ans.pos[id] = [x, y]; ctx.save(); } });
      const ro = ctx.readonly ? 'disabled' : '';
      const opt = (v) => `<option value="">значок…</option>${CARD_K.map(k => `<option value="${k}" ${v === k ? 'selected' : ''}>${esc(CARD[k])}</option>`).join('')}`;
      function drawRels() {
        const ev = showRes() ? buildEval(ans) : null;
        TR.$('[data-rels]', el).innerHTML = B_REL.map(r => {
          const g = ans.e[r.id] || {}, off = !!ans.off[r.id], x = ev && ev.rels.find(y => y.r.id === r.id);
          let why = '';
          if (x) {
            if (r.distractor) why = off ? 'Верно убрана: связь лишняя.' : (r.id === 'd1' ? 'Лишняя: услуги клиента и так известны через его записи. Вторая дорога к тому же факту рано или поздно разойдётся с первой.' : 'Лишняя: пост — свойство конкретной записи, а не машины навсегда.');
            else if (off) why = 'Эта связь нужна — без неё модель теряет реальный факт «Искры».';
            else if (x.s !== 'ok') why = `Верно: у «${esc(ENT_T[r.a])}» — ${CARD[r.ca]}, у «${esc(ENT_T[r.b])}» — ${CARD[r.cb]}.${x.s === 'warn' ? ' Ваш вариант допустим частично.' : ''}`;
          }
          return `<div class="m4e-rel ${off ? 'off' : ''} ${x ? x.s : ''}"><div><b>${esc(relName(r))}</b></div>
            <select data-re="${r.id}" data-side="ca" aria-label="Значок у ${esc(ENT_T[r.a])} в связи ${esc(relName(r))}" ${ro || (off ? 'disabled' : '')}>${opt(g.ca).replace('значок…', 'у «' + esc(ENT_T[r.a]) + '»…')}</select>
            <select data-re="${r.id}" data-side="cb" aria-label="Значок у ${esc(ENT_T[r.b])} в связи ${esc(relName(r))}" ${ro || (off ? 'disabled' : '')}>${opt(g.cb).replace('значок…', 'у «' + esc(ENT_T[r.b]) + '»…')}</select>
            <label><input type="checkbox" data-on="${r.id}" ${off ? '' : 'checked'} ${ro}> в модели</label>${why ? `<div class="why">${why}</div>` : ''}</div>`;
        }).join('');
      }
      function drawRes() {
        TR.$('[data-cnt]', el).textContent = `Связей в модели: ${B_REL.filter(r => !ans.off[r.id]).length}, значков выбрано: ${B_REL.reduce((s, r) => s + (ans.e[r.id] && ans.e[r.id].ca ? 1 : 0) + (ans.e[r.id] && ans.e[r.id].cb ? 1 : 0), 0)} из ${B_REL.length * 2}`;
        if (!ans.ran && !ctx.readonly) { TR.$('[data-res]', el).innerHTML = ''; return; }
        const ev = buildEval(ans);
        TR.$('[data-res]', el).innerHTML = `<div class="m4e-res"><div class="m4e-meter"><b>Неделя: ${ev.sc.filter(x => x.ok).length} из ${B_SC.length}</b>${ui.meter(ev.scScore, ev.scScore >= 0.85 ? 'ok' : 'warn')}</div>${ev.sc.map(x => `<div class="m4e-sc ${x.ok ? 'pass' : 'fail'}"><div><b>${esc(x.s.day)}.</b> ${esc(x.s.t)}</div><span class="st">${x.ok ? 'модель выдержала' : 'не сохранить'}</span>${x.ok ? '' : `<div class="cq">${x.s.fail}</div>`}</div>`).join('')}</div>`;
      }
      function refresh() { er.redraw({ rels: relsCfg() }); drawRels(); drawRes(); }
      el.addEventListener('change', e => {
        if (ctx.readonly) return;
        const s = e.target.closest('[data-re]');
        if (s) { const g = ans.e[s.dataset.re] = ans.e[s.dataset.re] || {}; if (s.value) g[s.dataset.side] = s.value; else delete g[s.dataset.side]; dirty = true; ctx.save(); refresh(); return; }
        const c = e.target.closest('[data-on]');
        if (c) { if (c.checked) delete ans.off[c.dataset.on]; else ans.off[c.dataset.on] = true; dirty = true; ctx.save(); refresh(); }
      });
      TR.on(el, 'click', '[data-run]', (e, b) => { ans.ran = true; ctx.save(); b.textContent = 'Прогнать неделю ещё раз'; drawRes(); ctx.decide && ctx.decide('Лаборатория ERD: ситуаций выдержано', String(buildEval(ans).sc.filter(x => x.ok).length) + ' из ' + B_SC.length); });
      if (ctx.readonly) TR.$('[data-run]', el).disabled = true;
      drawRels(); drawRes();
    },
    check(ans) {
      const ev = buildEval(ans), notes = [];
      ev.fails.forEach(x => notes.push({ ok: false, html: `<b>${esc(x.s.day)}. ${esc(x.s.t)}</b> ${x.s.fail}` }));
      ev.rels.forEach(x => {
        if (x.r.distractor) { if (x.s === 'bad') notes.push({ ok: false, html: `Связь «${esc(relName(x.r))}» — лишняя: ${x.r.id === 'd1' ? 'дублирует путь Клиент → Запись → Услуга в записи → Услуга.' : 'пост — свойство записи, а не машины.'}` }); else notes.push({ ok: true, html: `Лишняя связь «${esc(relName(x.r))}» убрана.` }); }
        else if (x.removed) notes.push({ ok: false, html: `Связь «${esc(relName(x.r))}» убрана, а она нужна.` });
        else if (x.s === 'warn') notes.push({ ok: 'warn', html: `${esc(relName(x.r))}: допустимо, но точнее — у «${esc(ENT_T[x.r.a])}» ${CARD[x.r.ca]}, у «${esc(ENT_T[x.r.b])}» ${CARD[x.r.cb]}.` });
        else if (x.s === 'bad') notes.push({ ok: false, html: `${esc(relName(x.r))}: верно — у «${esc(ENT_T[x.r.a])}» ${CARD[x.r.ca]}, у «${esc(ENT_T[x.r.b])}» ${CARD[x.r.cb]}.` });
      });
      if (!ev.fails.length) notes.unshift({ ok: true, html: 'Модель выдержала всю неделю: ни одной ситуации, которую «Искра» не смогла бы сохранить, и ни одной дыры для мусора.' });
      if (!ans || !ans.ran) notes.push({ ok: 'warn', html: 'Вы не прогоняли неделю — посмотрите последствия своей модели.' });
      return {
        ok: ev.score >= 0.8 && ev.fails.length <= 2, score: ev.score, notes,
        summary: `Неделя: модель выдержала ${ev.sc.filter(x => x.ok).length} из ${B_SC.length} ситуаций; связи и значки — ${Math.round(ev.relScore * 100)} %.`,
        mentor: ev.fails.length > 2 ? 'Посмотрите на ситуации, которые не сохранились: почти каждая — это «ноль, который вы запретили» или «много, которое вы ограничили одним». Найдите на доске линию и поменяйте один значок.' : (ev.score < 0.8 ? 'Неделя почти выдержана — подтяните значки там, где связь нарисована «примерно».' : '')
      };
    },
    explain: `<p>Модель «Искры» держится на трёх идеях:</p>
      <ul class="checks"><li><b>Ноль там, где объект рождается раньше связи</b>: клиент раньше машины, наряд раньше строк и платежей, запись раньше поста.</li>
      <li><b>Запись — Заказ-наряд «ноль или один» в обе стороны</b>: неявка и визит без записи — обычная жизнь, а не исключение.</li>
      <li><b>M:N — только через ассоциативную сущность</b> «Услуга в записи», а лишние связи убираются: «Клиент — Услуга» дублирует путь через записи (две дороги к одному факту рано или поздно разойдутся), «Автомобиль — Пост» превращает временное состояние в постоянное.</li></ul>
      <p>Обратите внимание: Запись связана и со Станцией, и с Постом, хотя пост «знает» свою станцию. Это не дубль: пост в записи может быть пустым (его назначат утром), а станция известна всегда. Аналитик фиксирует правило «пост записи — с той же станции» отдельно, как ограничение.</p>
      <p>Источник: Саймсион, Витт «Data Modeling Essentials»; Дейт «Введение в системы баз данных» (ссылочная целостность); Вигерс «Разработка требований» — модель данных как часть требований.</p>`,
    refNote: 'Допускаются «один или много» вместо «ноль или много» у машин, записей, строк, услуг в записях и «ноль или много» у постов станции — но тогда часть ситуаций недели не выдержится. Засчитывается, если выдержано не меньше 11 из 13.',
    report: ans => { const ev = buildEval(ans); return `- Неделя: ${ev.sc.filter(x => x.ok).length}/${B_SC.length}\n` + ev.rels.map(x => `- ${relName(x.r)}: ${(ans.off || {})[x.r.id] ? 'убрана' : ((ans.e || {})[x.r.id] || {}).ca + ' / ' + ((ans.e || {})[x.r.id] || {}).cb} ${mark(x.s)}`).join('\n'); }
  };

  // =====================================================================
  // Теория 3. Нотации: Чен, Crow's Foot, IDEF1X, UML; типичные ошибки
  // =====================================================================
  const svgText = (x, y, t, o) => `<text x="${x}" y="${y}" text-anchor="${(o && o.a) || 'middle'}" style="fill:${(o && o.c) || 'var(--text)'};font-size:${(o && o.s) || 12.5}px;${o && o.b ? 'font-weight:600;' : ''}${o && o.u ? 'text-decoration:underline;' : ''}${o && o.m ? 'font-family:var(--f-mono);' : ''}">${esc(t)}</text>`;
  function chenSVG() {
    const L = 'var(--text-2)';
    const oval = (cx, cy, t, u, ex, ey) => `<line x1="${cx}" y1="${cy}" x2="${ex}" y2="${ey}" style="stroke:${L};stroke-width:1.2"/><ellipse cx="${cx}" cy="${cy}" rx="${Math.max(30, t.length * 4.2 + 12)}" ry="15" style="fill:var(--surface);stroke:var(--border-strong)"/>${svgText(cx, cy + 4, t, { u, s: 12 })}`;
    return `<svg viewBox="0 0 580 230" width="100%" style="max-width:580px;min-width:440px" role="img" aria-label="Нотация Чена: Клиент владеет Автомобилем">
      ${oval(50, 30, 'id', true, 85, 95)}${oval(140, 28, 'ФИО', false, 95, 95)}${oval(80, 200, 'телефон', false, 85, 125)}
      ${oval(440, 30, 'id', true, 475, 95)}${oval(545, 40, 'госномер', false, 500, 95)}${oval(500, 200, 'марка', false, 480, 125)}
      <line x1="140" y1="110" x2="232" y2="110" style="stroke:${L};stroke-width:1.5"/>
      <line x1="328" y1="107" x2="420" y2="107" style="stroke:${L};stroke-width:1.5"/><line x1="328" y1="113" x2="420" y2="113" style="stroke:${L};stroke-width:1.5"/>
      <rect x="30" y="92" width="110" height="36" style="fill:var(--surface-3);stroke:var(--border-strong);stroke-width:1.5"/>${svgText(85, 115, 'Клиент', { b: true })}
      <rect x="420" y="92" width="120" height="36" style="fill:var(--surface-3);stroke:var(--border-strong);stroke-width:1.5"/>${svgText(480, 115, 'Автомобиль', { b: true })}
      <path d="M280 80 L328 110 L280 140 L232 110 Z" style="fill:var(--accent-soft);stroke:var(--accent);stroke-width:1.5"/>${svgText(280, 114, 'владеет', { s: 12 })}
      ${svgText(186, 102, '1', { b: true, c: 'var(--accent)' })}${svgText(374, 99, 'N', { b: true, c: 'var(--accent)' })}
      ${svgText(374, 132, 'двойная линия:', { s: 10.5, c: 'var(--text-muted)' })}${svgText(374, 145, 'участие обязательно', { s: 10.5, c: 'var(--text-muted)' })}</svg>`;
  }
  function idefSVG() {
    const L = 'var(--text-2)';
    return `<svg viewBox="0 0 580 200" width="100%" style="max-width:580px;min-width:440px" role="img" aria-label="Нотация IDEF1X: Клиент — Автомобиль">
      ${svgText(30, 30, 'Клиент', { a: 'start', b: true })}
      <rect x="30" y="38" width="160" height="110" style="fill:var(--surface);stroke:var(--border-strong);stroke-width:1.5"/><line x1="30" y1="66" x2="190" y2="66" style="stroke:var(--border-strong)"/>
      ${svgText(40, 57, 'id', { a: 'start', m: true })}${svgText(40, 88, 'ФИО', { a: 'start', m: true })}${svgText(40, 108, 'телефон (AK1)', { a: 'start', m: true })}
      ${svgText(390, 30, 'Автомобиль', { a: 'start', b: true })}
      <rect x="390" y="38" width="170" height="120" style="fill:var(--surface);stroke:var(--border-strong);stroke-width:1.5"/><line x1="390" y1="66" x2="560" y2="66" style="stroke:var(--border-strong)"/>
      ${svgText(400, 57, 'id', { a: 'start', m: true })}${svgText(400, 88, 'госномер (AK1)', { a: 'start', m: true })}${svgText(400, 108, 'client_id (FK)', { a: 'start', m: true, c: 'var(--info)' })}${svgText(400, 128, 'марка', { a: 'start', m: true })}
      <line x1="190" y1="95" x2="384" y2="95" style="stroke:${L};stroke-width:1.5;stroke-dasharray:7 5"/><circle cx="385" cy="95" r="5" style="fill:${L}"/>
      ${svgText(287, 86, 'владеет / принадлежит', { s: 11.5, c: 'var(--text-2)' })}
      ${svgText(287, 120, 'пунктир — неидентифицирующая связь', { s: 10.5, c: 'var(--text-muted)' })}${svgText(287, 134, '• у потомка — «ноль, один или много»', { s: 10.5, c: 'var(--text-muted)' })}
      ${svgText(287, 175, 'над чертой — ключ; ниже — остальные атрибуты', { s: 10.5, c: 'var(--text-muted)' })}</svg>`;
  }
  function umlSVG() {
    const L = 'var(--text-2)';
    const cls = (x, t, attrs) => `<rect x="${x}" y="40" width="190" height="${30 + attrs.length * 20 + 10}" style="fill:var(--surface);stroke:var(--border-strong);stroke-width:1.5"/>${svgText(x + 95, 18 + 40, t, { b: true })}<line x1="${x}" y1="70" x2="${x + 190}" y2="70" style="stroke:var(--border-strong)"/>${attrs.map((a, i) => svgText(x + 10, 90 + i * 20, a, { a: 'start', m: true, s: 11.5 })).join('')}`;
    return `<svg viewBox="0 0 580 170" width="100%" style="max-width:580px;min-width:440px" role="img" aria-label="Диаграмма классов UML: Клиент — Автомобиль">
      ${cls(20, 'Клиент', ['id: Integer {id}', 'fullName: String', 'phone: String {unique}'])}${cls(370, 'Автомобиль', ['id: Integer {id}', 'plate: String', 'vin: String [0..1]'])}
      <line x1="210" y1="95" x2="370" y2="95" style="stroke:${L};stroke-width:1.5"/>
      ${svgText(222, 88, '1', { b: true, c: 'var(--accent)', a: 'start' })}${svgText(360, 88, '0..*', { b: true, c: 'var(--accent)', a: 'end' })}
      ${svgText(290, 115, 'владеет ▸', { s: 12, c: 'var(--text-2)' })}
      ${svgText(290, 150, 'кратность — числами у концов линии', { s: 10.5, c: 'var(--text-muted)' })}</svg>`;
  }
  const NOTES = [
    { v: 'chen', t: 'Чен', read: 'Сущность — прямоугольник, связь — ромб с глаголом, атрибуты — овалы, ключ подчёркнут. Мощность — «1», «N», «M» у линий. Двойная линия — обязательное участие (у машины владелец обязателен).', where: 'Учебники, концептуальные модели, обсуждение с бизнесом. Автор — Питер Чен (1976).', pro: 'Связь видна как отдельный объект со своим именем — удобно для концептуальной модели.', con: 'Занимает много места: у «Искры» 15 сущностей и 100+ атрибутов — овалы утонут. Ключей и типов не показать.' },
    { v: 'crow', t: 'Crow\'s Foot', read: 'Сущность — прямоугольник со списком атрибутов (PK, FK), связь — линия, на концах — черта, кружок и «воронья лапка».', where: 'Самая распространённая на практике: dbdiagram.io, draw.io, DBeaver, ERwin, PowerDesigner, MySQL Workbench. Г. Эверест (1976), Information Engineering.', pro: 'Компактно, читается сразу, хорошо ложится на таблицы. Ей пользуется Глеб и наш тренажёр.', con: 'Глагол связи часто забывают подписать — и диаграмма перестаёт читаться вслух.' },
    { v: 'idef', t: 'IDEF1X', read: 'Сущность — прямоугольник, имя над ним, черта отделяет ключ от остальных атрибутов. Сплошная линия — идентифицирующая связь (ключ потомка включает ключ родителя, углы потомка скруглены), пунктир — неидентифицирующая. Точка у потомка — «ноль, один или много»; «P» — один или много, «Z» — ноль или один, ромб у родителя — родитель необязателен.', where: 'Госсектор и крупные корпорации, стандарт FIPS 184 (1993), IEEE 1320.2; режим IDEF1X в ERwin.', pro: 'Строгая: различает идентифицирующие связи, альтернативные ключи (AK).', con: 'Много условностей — новичку и бизнесу читать трудно.' },
    { v: 'uml', t: 'UML', read: 'Сущность — класс: имя, ниже атрибуты с типами. Связь — ассоциация, кратность — числами у концов: 1, 0..1, 1..*, 0..* (или *). Имя ассоциации — с треугольником направления чтения.', where: 'Команды, которые уже рисуют UML (последовательности, компоненты): Enterprise Architect, PlantUML, StarUML. Стандарт UML 2.5 (OMG).', pro: 'Кратность числами однозначна, одна нотация на весь проект.', con: 'Создан для объектов, а не таблиц: внешних ключей и ассоциативных таблиц в чистом UML нет — дописывают стереотипами.' }
  ];
  const ERRS = [
    ['Многозначный атрибут', 'В клиенте поле «машины: О392ЕТ116, А519ВУ116». Список — значит, отдельная сущность.'],
    ['M:N спрятана в атрибут', 'В записи «услуги: ТО-1, колодки». Нужна ассоциативная сущность.'],
    ['Неустойчивый ключ', 'Первичный ключ — госномер, ФИО или телефон: меняется — ломаются все ссылки.'],
    ['«Висящая» сущность', 'Прямоугольник без единой связи и без внешнего ключа: строка заказ-наряда, которая не знает своего наряда.'],
    ['Неверная мощность', '«Ровно один» платёж у наряда, «хотя бы одна» машина у клиента — запрет реальной ситуации.'],
    ['Лишняя связь или внешний ключ', 'Связь, которая дублирует путь через другие сущности (Клиент — Услуга), или FK «на всякий случай».'],
    ['Процесс вместо сущности', '«Оформление записи», «Согласование» — это действия; сущностью будет их результат: Запись, Предложение доп. работ.']
  ];
  const howNot = {
    id: 'how-not', covers: ['t-bugs', 't-explain'], title: 'Как это работает: нотации Чена, Crow\'s Foot, IDEF1X, UML и ошибки ERD', free: true, noReset: true,
    simple: {
      icon: '🔤',
      plain: 'Одну и ту же мысль «у клиента может быть много машин, у машины — один владелец» можно нарисовать по-разному — как одну фразу можно записать разными алфавитами. Аналитику нужно уметь читать все четыре распространённые нотации, а рисовать — в той, что принята в команде.',
      analogy: 'Ноты, табулатура и аккорды над текстом — три записи одной песни. Гитарист читает табы, пианист — ноты, а песня одна.',
      tech: 'Нотация Чена (P. Chen, 1976); Crow\'s Foot / Information Engineering (G. Everest, 1976; J. Martin, C. Finkelstein); IDEF1X (FIPS PUB 184, 1993; IEEE 1320.2-1998); диаграмма классов UML 2.5 (OMG). Различаются изображением связей, мощности, ключей и атрибутов; семантика базовых понятий общая.'
    },
    lead: ui.brief({
      situation: 'Подрядчик «Искры» по 1С прислал свою схему в IDEF1X, Даша рисует модели в UML, а в учебнике — ромбы Чена. Вера: «Нотация — это язык. Смысл один: сущность, атрибут, связь, мощность».',
      todo: [
        'Переключайте нотации: одна и та же связь «Клиент — Автомобиль» нарисована четырьмя способами. Под каждой — как читать, где встречается, плюсы и минусы.',
        'Прочитайте список типичных ошибок ERD — он пригодится в следующем задании.'
      ],
      look: 'Во всех нотациях ищите одно и то же: где сущность, где её ключ, где связь, что на концах связи — «один или много» и «может ли быть ноль».'
    }),
    render(el) {
      el.classList.add('m4e-root');
      const st = { n: 'crow' };
      el.innerHTML = `<div class="stack">
        <div>${ui.seg('not', NOTES.map(n => ({ v: n.v, t: n.t })), st.n)}</div>
        <div data-pic></div>
        <div data-info></div>
        <h3 class="m4e-h3">Сравнение</h3>
        ${ui.table(['', 'Чен', 'Crow\'s Foot', 'IDEF1X', 'UML'], [
          ['Сущность', 'прямоугольник', 'прямоугольник с атрибутами', 'прямоугольник, ключ над чертой', 'класс'],
          ['Связь', 'ромб с глаголом', 'линия с подписью', 'сплошная или пунктир', 'ассоциация'],
          ['Мощность', '1, N, M', 'черта / кружок / лапка', 'точка, P, Z, ромб', '1, 0..1, 1..*, 0..*'],
          ['Атрибуты', 'овалы', 'список в прямоугольнике', 'список, ключ отдельно', 'список с типами'],
          ['Где чаще', 'учебники, концепт', 'практика, инструменты', 'госсектор, ERwin', 'команды на UML']
        ])}
        <h3 class="m4e-h3">Семь типичных ошибок ERD</h3>
        ${ui.table(['Ошибка', 'Как выглядит в «Искре»'], ERRS.map(r => [`<b>${esc(r[0])}</b>`, esc(r[1])]))}
        ${interview('Какие нотации ERD вы знаете? Как обозначить «ноль или много»?', 'Чен (ромбы и овалы), Crow\'s Foot (вороньи лапки), IDEF1X, UML-классы. «Ноль или много» — кружок и лапка в Crow\'s Foot, «0..*» в UML, точка у потомка в IDEF1X, «N» с одинарной линией у Чена. Сильный ответ: «рисую в нотации команды, чаще Crow\'s Foot; главное — подписать связь глаголом и прочитать её вслух в обе стороны».')}
      </div>`;
      function draw() {
        const n = NOTES.find(x => x.v === st.n), pic = TR.$('[data-pic]', el);
        if (n.v === 'crow') erIn(pic, { entities: [E('c', 'Клиент', 10, 10, ['PK id', 'full_name', 'phone']), E('car', 'Автомобиль', 380, 10, ['PK id', 'FK client_id', 'plate'])], rels: [{ a: 'c', b: 'car', ca: '1', cb: '0..N', t: 'владеет' }], title: 'Crow\'s Foot: Клиент — Автомобиль' });
        else pic.innerHTML = `<div class="m4e-svg">${n.v === 'chen' ? chenSVG() : n.v === 'idef' ? idefSVG() : umlSVG()}</div>`;
        TR.$('[data-info]', el).innerHTML = `<div class="m4e-grid2"><div class="m4e-box acc"><b class="k">Как читать</b><div>${n.read}</div></div><div class="m4e-box"><b class="k">Где встречается</b><div>${n.where}</div></div><div class="m4e-box ok"><b class="k">Плюсы</b><div>${n.pro}</div></div><div class="m4e-box bad"><b class="k">Минусы</b><div>${n.con}</div></div></div>`;
      }
      ui.onSeg(el, (k, v) => { if (k === 'not') { st.n = v; draw(); } });
      draw();
      el.insertAdjacentHTML('beforeend', anNote('Получив чужую схему, аналитик сначала <b>читает её вслух</b>, связь за связью, в обе стороны, — и сверяет с тем, что знает о бизнесе. Большинство ошибок слышно сразу: «у заказ-наряда ровно один платёж» звучит неправдоподобно для любого, кто видел, как не проходит карта.'));
    }
  };

  // =====================================================================
  // Практика 4. Найти ошибки в ERD подрядчика
  // =====================================================================
  const BUG_ENT = () => [
    E('client', 'Клиент', 10, 10, ['PK id', 'full_name', 'phone', 'cars']),
    E('car', 'Автомобиль', 10, 170, ['PK id', 'FK client_id', 'plate', 'vin?']),
    E('booking', 'Запись', 280, 10, ['PK id', 'FK client_id', 'FK car_id', 'start_at', 'services']),
    E('service', 'Услуга', 550, 10, ['PK id', 'FK client_id', 'code', 'price']),
    E('station', 'Станция', 820, 10, ['PK id', 'name']),
    E('post', 'Пост', 820, 150, ['PK id', 'FK station_id', 'name']),
    E('wo', 'Заказ-наряд', 280, 220, ['PK plate', 'FK booking_id?', 'status', 'total']),
    E('wi', 'Строка наряда', 820, 320, ['PK id', 'name', 'qty', 'price']),
    E('pay', 'Платёж', 550, 250, ['PK id', 'FK work_order_id', 'amount', 'status'])
  ];
  const BUG_REL = [
    { a: 'client', b: 'car', ca: '1', cb: '0..N' }, { a: 'client', b: 'booking', ca: '1', cb: '0..N' }, { a: 'car', b: 'booking', ca: '1', cb: '0..N' },
    { a: 'client', b: 'service', ca: '1', cb: '0..N' }, { a: 'station', b: 'post', ca: '1', cb: '1..N' },
    { a: 'booking', b: 'wo', ca: '0..1', cb: '0..1' }, { a: 'wo', b: 'pay', ca: '1', cb: '1' }
  ];
  const BUG_CH = [
    { v: 'ok', t: 'Ошибок нет' }, { v: 'multi', t: 'Многозначный атрибут — нужна отдельная сущность' }, { v: 'mn', t: 'M:N спрятана в атрибут — нужна ассоциативная сущность' },
    { v: 'key', t: 'Неустойчивый первичный ключ' }, { v: 'orphan', t: 'Нет связи — сущность «висит» без внешнего ключа' }, { v: 'card', t: 'Неверная мощность связи' }, { v: 'extra', t: 'Лишняя связь / лишний внешний ключ' }
  ];
  const BUG_R = [
    { id: 'client', t: 'Клиент', ok: 'multi', why: 'Атрибут cars — список госномеров в одной ячейке. Машины уже есть отдельной сущностью — поле лишнее и вредное: два источника правды.' },
    { id: 'car', t: 'Автомобиль', ok: 'ok', why: 'id — суррогатный ключ, client_id — ссылка на владельца, VIN может быть пустым. Всё верно.' },
    { id: 'booking', t: 'Запись', ok: 'mn', alt: { multi: 'Формально services — многозначный атрибут, но корень глубже: это связь M:N «Запись — Услуга», и лечится она ассоциативной сущностью «Услуга в записи». Засчитано наполовину.' }, why: 'services — список услуг: M:N спрятана в текст. Нужна «Услуга в записи» (booking_service).' },
    { id: 'service', t: 'Услуга', ok: 'extra', why: 'Услуга каталога не принадлежит клиенту: client_id и связь «Клиент — Услуга» лишние — ТО-1 одна на всех.' },
    { id: 'station', t: 'Станция', ok: 'ok', why: 'Ключ, название, связь с постами «один или много» — верно.' },
    { id: 'post', t: 'Пост', ok: 'ok', why: 'Пост знает свою станцию — верно.' },
    { id: 'wo', t: 'Заказ-наряд', ok: 'key', why: 'Первичный ключ — госномер: машина приезжает много раз, второй наряд на ту же машину не сохранить, а при смене номера сломаются ссылки платежей.' },
    { id: 'wi', t: 'Строка наряда', ok: 'orphan', why: 'Нет work_order_id и нет линии к заказ-наряду: строка не знает, в каком она документе.' },
    { id: 'pay', t: 'Платёж', ok: 'card', why: 'Связь с нарядом «ровно один — ровно один»: нельзя сохранить неуспешную попытку и повторную оплату, и наряд не может существовать до оплаты. Нужно «ровно один — ноль или много».' }
  ];
  function bugEval(ans) {
    const m = (ans && ans.m) || {};
    const rows = BUG_R.map(r => { const g = m[r.id]; const s = !g ? 'none' : g === r.ok ? 'ok' : (r.alt && r.alt[g]) ? 'warn' : 'bad'; return { r, g, s, pts: s === 'ok' ? 1 : s === 'warn' ? 0.5 : 0 }; });
    return { rows, score: Math.round(rows.reduce((s, x) => s + x.pts, 0) / BUG_R.length * 100) / 100, found: rows.filter(x => x.r.ok !== 'ok' && x.s !== 'bad' && x.s !== 'none').length };
  }
  const taskBugs = {
    id: 't-bugs', title: 'Найти ошибки в ERD подрядчика',
    simple: howNot.simple,
    lead: ui.brief({
      situation: 'Подрядчик, который делал «Искре» сайт, прислал «готовую модель данных»: «Можно сразу создавать таблицы». Глеб: «Прочитай вслух — и скажи, что там не так. В шести сущностях из девяти я вижу по ошибке».',
      todo: [
        'Прочитайте диаграмму связь за связью. Нажмите на сущность — она подсветится и в списке ниже.',
        'Для каждой из девяти сущностей выберите ошибку из списка или «Ошибок нет».',
        'Нажмите «Проверить». Засчитывается от 80 %.'
      ],
      lookTitle: 'Подсказка',
      look: 'Пройдитесь по семи типичным ошибкам из теории: список в атрибуте, M:N в тексте, ключ, который меняется, сущность без связей, неправдоподобная мощность, связь «на всякий случай».'
    }),
    blank: () => ({ m: {} }),
    reference: () => ({ m: Object.fromEntries(BUG_R.map(r => [r.id, r.ok])) }),
    render(el, ctx) {
      el.classList.add('m4e-root');
      const ans = ctx.ans; ans.m = ans.m || {};
      let sel = null;
      el.innerHTML = `<div class="stack"><div data-er></div><div data-m></div></div>`;
      const ev = ctx.result || ctx.readonly ? bugEval(ans) : null;
      function drawEr() {
        const ents = BUG_ENT();
        if (ev) ents.forEach(e => { const x = ev.rows.find(y => y.r.id === e.id); if (x && x.s !== 'none') e.tone = x.s === 'ok' ? 'ok' : x.s === 'warn' ? 'warn' : 'bad'; });
        erIn(TR.$('[data-er]', el), { entities: ents, rels: BUG_REL, width: 1030, height: 440, selected: sel, title: 'ERD подрядчика с ошибками', onClick: id => { sel = id; drawEr(); const s = TR.$(`select[data-row="${id}"]`, el); if (s) { s.scrollIntoView({ block: 'nearest' }); s.focus(); } } });
      }
      drawEr();
      let reveal = null;
      if (ctx.result) { reveal = {}; ev.rows.forEach(x => { if (x.g) reveal[x.r.id] = { s: x.s, why: x.s === 'ok' ? x.r.why : x.s === 'warn' ? x.r.alt[x.g] : 'Не то. Прочитайте атрибуты и связи этой сущности вслух — что звучит неправдоподобно?' }; }); }
      ui.match(TR.$('[data-m]', el), { rows: BUG_R.map(r => ({ id: r.id, t: `<b>${esc(r.t)}</b>` })), choices: BUG_CH, value: ans.m, reveal, readonly: ctx.readonly, placeholder: 'Что не так?', onChange: v => { ans.m = v; ctx.save(); } });
    },
    check(ans) {
      const ev = bugEval(ans), notes = [];
      ev.rows.forEach(x => {
        if (x.s === 'ok') notes.push({ ok: true, html: `${esc(x.r.t)}: ${x.r.why}` });
        else if (x.s === 'warn') notes.push({ ok: 'warn', html: `${esc(x.r.t)}: ${x.r.alt[x.g]}` });
        else notes.push({ ok: false, html: `${esc(x.r.t)}: ${x.g ? (x.g === 'ok' ? 'ошибка есть.' : x.r.ok === 'ok' ? 'здесь всё верно.' : 'ошибка другая.') : 'не отмечено.'} ${x.r.why}` });
      });
      return {
        ok: ev.score >= 0.8, score: ev.score, notes,
        summary: `Найдено ошибок: ${ev.found} из 6; верно по всем сущностям: ${ev.rows.filter(x => x.s === 'ok').length} из 9.`,
        mentor: ev.rows.find(x => x.r.id === 'pay' && x.s !== 'ok') ? 'Прочитайте связь «Заказ-наряд — Платёж» вслух: «у каждого наряда ровно один платёж». А если карта не прошла? А если наряд ещё не оплачен?' : (ev.score < 0.8 ? 'Не спешите ставить «ошибок нет»: проверьте у сущности ключ (не меняется ли?), атрибуты (нет ли списков?) и связи (есть ли? правдоподобны ли значки?).' : '')
      };
    },
    explain: `<p>Шесть ошибок из девяти сущностей — типичный «быстрый» ERD:</p>
      <ul class="checks"><li><b>Клиент.cars</b> — список в атрибуте при том, что машины уже отдельная сущность: две правды о машинах клиента.</li>
      <li><b>Запись.services</b> — M:N в тексте; нужна «Услуга в записи».</li>
      <li><b>Услуга.client_id</b> — каталог не принадлежит клиенту; связь «Клиент — Услуга» лишняя.</li>
      <li><b>Заказ-наряд с ключом plate</b> — машина приезжает много раз; ключ должен быть суррогатным, а госномер — у машины.</li>
      <li><b>Строка наряда</b> без связи — документ, который не знает своих строк.</li>
      <li><b>Платёж 1 : 1</b> — запрещает неуспешные попытки и неоплаченный наряд.</li></ul>
      <p>Как отвечать подрядчику: не «у вас всё плохо», а по каждой ошибке — <b>какая ситуация «Искры» не сохранится</b>: «Елена приехала второй раз — второй заказ-наряд на её Kia не создать». Это разговор о бизнесе, его трудно оспорить. Источник: Саймсион, Витт «Data Modeling Essentials» — ревью модели; Вигерс «Разработка требований» — проверка требований.</p>`,
    refNote: 'Для записи «многозначный атрибут» засчитывается наполовину: формально верно, но лечится ассоциативной сущностью.',
    report: ans => bugEval(ans).rows.map(x => `- ${x.r.t}: ${x.g ? BUG_CH.find(c => c.v === x.g).t : '—'} ${mark(x.s)}`).join('\n')
  };

  // =====================================================================
  // Практика 5. Своими словами: прочитать ERD вслух Марине Олеговне
  // =====================================================================
  const EX_RUBRIC = [
    'Прочитал связи в обе стороны с «может/должен» и количеством: у клиента ноль или много машин, у машины ровно один владелец',
    'Запись — заказ-наряд: «не более одного» в обе стороны, с ситуациями из жизни (клиент без записи, неявка)',
    'Запись — услуга через «Услугу в записи»: в записи одна или несколько услуг, одна услуга — во многих записях',
    'Заказ-наряд — платёж: ноль или много и почему (не оплачен, карта не прошла — вторая попытка)',
    'Говорил языком приёмки без «кардинальностей» и «внешних ключей» и попросил Марину Олеговну подтвердить или поправить'
  ];
  const EX_REF = `<p>Марина Олеговна, давайте я прочитаю схему, а вы скажете, где я не прав.</p>
    <p>У клиента может быть ни одной машины — например, зарегистрировался и машину ещё не добавил, — а может быть несколько. Но у каждой машины в нашей базе один владелец. Клиент может сделать сколько угодно записей, а каждая запись — от одного клиента и на одну машину.</p>
    <p>В записи — одна или несколько услуг: ТО и шиномонтаж можно взять одной записью. А одна и та же услуга, скажем ТО-1, встречается во многих записях. Поэтому между записью и услугой есть отдельный «список услуг записи».</p>
    <p>Запись превращается не больше чем в один заказ-наряд. Клиент не приехал — наряда нет. Таксист заехал без записи — наряд есть, а записи нет. И то и другое база сохранит.</p>
    <p>У заказ-наряда может быть ноль платежей — пока не оплатили, — или несколько: карта не прошла, клиент оплатил через СБП, и обе попытки останутся для сверки с Ольгой Викторовной.</p>
    <p>Скажите, бывает ли у вас что-то, чего здесь нет? Например, машина без владельца или две записи на один заказ-наряд?</p>`;
  const taskExplain = {
    id: 't-explain', title: 'Своими словами: прочитать ERD Марине Олеговне',
    lead: ui.brief({
      situation: 'Марина Олеговна заглянула в переговорную: «Это и есть ваша “Искра” в квадратиках? Прочитайте мне, что тут нарисовано. Если я соглашусь — значит, похоже на правду».',
      todo: [
        'Прочитайте диаграмму ниже вслух — письменно, так, как сказали бы Марине Олеговне (от 300 символов).',
        'Проверьте ответ с Верой (если доступно) или сверьте с эталоном сами и честно отметьте пункты рубрики.',
        'Засчитывается от 60 % по рубрике.'
      ],
      lookTitle: 'На что опереться',
      look: 'Шаблон чтения из теории о мощности: «каждый А может/должен … ноль/один/много Б» — в обе стороны. Подкрепляйте каждую связь ситуацией со станции.'
    }),
    blank: () => ({ j: {} }),
    reference: () => ({ j: { text: EX_REF.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(), self: EX_RUBRIC.map(() => true) } }),
    render(el, ctx) {
      el.classList.add('m4e-root');
      el.insertAdjacentHTML('beforeend', ui.say('marina', 'Только без «сущностей», пожалуйста. Я квадратики читать не училась — я машины принимаю.'));
      const er = document.createElement('div'); er.style.marginTop = '10px'; el.appendChild(er);
      ui.er(er, { entities: [E('c', 'Клиент', 10, 10, ['PK id', 'phone']), E('car', 'Автомобиль', 10, 150, ['PK id', 'FK client_id']), E('b', 'Запись', 260, 10, ['PK id', 'FK client_id', 'FK car_id']), E('bs', 'Услуга в записи', 260, 160, ['PK FK booking_id', 'PK FK service_id']), E('s', 'Услуга', 520, 160, ['PK id', 'code']), E('wo', 'Заказ-наряд', 520, 10, ['PK id', 'FK booking_id?']), E('p', 'Платёж', 780, 10, ['PK id', 'FK work_order_id'])], rels: [{ a: 'c', b: 'car', ca: '1', cb: '0..N' }, { a: 'c', b: 'b', ca: '1', cb: '0..N' }, { a: 'car', b: 'b', ca: '1', cb: '0..N' }, { a: 'b', b: 'bs', ca: '1', cb: '1..N' }, { a: 's', b: 'bs', ca: '1', cb: '0..N' }, { a: 'b', b: 'wo', ca: '0..1', cb: '0..1' }, { a: 'wo', b: 'p', ca: '1', cb: '0..N' }], width: 990, height: 270, title: 'Фрагмент ERD «Искры» для чтения вслух' });
      const j = document.createElement('div'); j.style.marginTop = '12px'; el.appendChild(j);
      ui.justify(j, {
        id: 'm4e-explain', q: 'Прочитайте Марине Олеговне вслух, что нарисовано на диаграмме',
        qPlain: 'Перескажите диаграмму «сущность — связь» простыми словами для старшего мастера-приёмщика автосервиса: все связи в обе стороны, сколько может быть и может ли не быть совсем (клиент — машины, клиент — записи, запись — услуги через список услуг записи, запись — заказ-наряд, заказ-наряд — платежи), с примерами ситуаций со станции, без технических терминов, и попросите её подтвердить.',
        rubric: EX_RUBRIC, reference: EX_REF, value: ctx.ans.j, readonly: ctx.readonly, minLen: 300,
        placeholder: 'Марина Олеговна, давайте я прочитаю…',
        onChange: v => { ctx.ans.j = v; ctx.save(); ctx.decide && ctx.decide('Чтение ERD Марине Олеговне', v.text || ''); }
      });
    },
    check(ans) {
      const s = ui.justifyScore(ans && ans.j);
      return {
        ok: s >= 0.6, score: s,
        summary: s ? `Оценка ответа: ${Math.round(s * 100)} %.` : 'Напишите ответ (от 300 символов) и проверьте его с Верой или сверьте с эталоном сами.',
        notes: s && s < 0.6 ? [{ ok: false, html: 'Каждую линию — двумя фразами, в обе стороны, и каждую — с ситуацией со станции: неявка, таксист без записи, карта не прошла.' }] : [],
        mentor: s && s < 0.6 ? 'Марина Олеговна согласится или поправит, только если услышит свою работу. Вместо «кардинальность ноль или один» — «клиент не приехал, наряда нет».' : ''
      };
    },
    explain: `<p>Чтение ERD вслух — главный способ проверить модель с бизнесом. Сильное чтение: каждая связь — две фразы, в обе стороны, со словами «может» (ноль допустим) или «должен» (обязательно) и с количеством; к каждой — ситуация со станции. В конце — вопрос «что я упустил?»: так Марина Олеговна из слушателя становится соавтором модели.</p>
      <p>Частые ошибки: читать только в одну сторону («у клиента много машин» — а у машины?), произносить термины («мощность», «FK»), читать значки без смысла («кружок и лапка»), не спросить подтверждения. Если Марина скажет «а у нас машину бывает, сдают по доверенности», — это новая информация о модели: владелец и тот, кто привёз, — разные люди.</p>
      <p>Источник: Саймсион, Витт «Data Modeling Essentials» — валидация модели с экспертами; Вигерс «Разработка требований» — модели как средство проверки требований.</p>`,
    report: ans => (ans.j && ans.j.text) ? ans.j.text : '—'
  };

  // =====================================================================
  TR.stage({
    id: ID,
    when: 'среда, 27 января, 11:00 · ERD «Искры» на доске',
    intro: [
      { who: 'gleb', html: 'Таблицы из понедельника я понял. Теперь нарисуем их картинкой — ERD. По ней я создаю базу, Лиза пишет тесты, а Марина Олеговна проверяет, что мы ничего не упустили.' },
      { who: 'marina', html: 'Только чтобы я могла прочитать. Если у вас на картинке «у машины один заказ-наряд на всю жизнь», я сразу скажу — машины к нам возвращаются.' },
      { who: 'vera', html: 'Сегодня: сущности, атрибуты, связи и «вороньи лапки», четыре нотации, три уровня модели. Соберём ERD «Искры», прогоним по ней неделю станции и найдём ошибки в чужой схеме. А в конце прочитаем ERD Марине Олеговне — она лучший тестировщик модели.' }
    ],
    facts: ['F-slot', 'F-pay', 'F-corp', 'F-excel'],
    glossary: [
      { term: 'ERD', simple: 'Карта данных: что система хранит и как это связано.', tech: 'Entity-Relationship Diagram — диаграмма «сущность — связь» (П. Чен, 1976).' },
      { term: 'Сущность', simple: 'То, о чём система помнит: клиент, машина, запись.', tech: 'Entity type — класс объектов предметной области с общими атрибутами; экземпляр сущности — конкретный объект.' },
      { term: 'Атрибут', simple: 'Свойство сущности: телефон, госномер, время.', tech: 'Attribute — характеристика сущности; простой или составной, однозначный (многозначные выносятся в сущность).' },
      { term: 'Ключ', simple: 'То, по чему один экземпляр точно отличают от другого.', tech: 'Идентификатор: первичный (PK), альтернативный (AK, UNIQUE), внешний (FK) на логическом уровне.' },
      { term: 'Связь', simple: 'Как сущности относятся друг к другу: клиент владеет машиной.', tech: 'Relationship — ассоциация между сущностями с именем-глаголом, мощностью и обязательностью на каждом конце.' },
      { term: 'Мощность (кардинальность)', simple: 'Сколько максимум: один или много.', tech: 'Cardinality — максимальное число экземпляров на другом конце связи: 1 или N.' },
      { term: 'Обязательность (модальность)', simple: 'Может ли быть ноль.', tech: 'Optionality / participation — минимальное число: 0 (необязательная) или 1 (обязательная).' },
      { term: 'Crow\'s Foot', simple: 'Нотация с «вороньими лапками»: черта, кружок, лапка.', tech: 'Information Engineering (Г. Эверест, Дж. Мартин): || — ровно один, o| — ноль или один, |< — один или много, o< — ноль или много.' },
      { term: 'Нотация Чена', simple: 'Прямоугольники, ромбы-связи и овалы-атрибуты.', tech: 'Оригинальная нотация ER-модели П. Чена (1976); мощность — 1, N, M; двойная линия — тотальное участие.' },
      { term: 'IDEF1X', simple: 'Строгая нотация с ключом над чертой и точками на связях.', tech: 'FIPS PUB 184 (1993), IEEE 1320.2: идентифицирующие (сплошные) и неидентифицирующие (пунктир) связи, P/Z/точка.' },
      { term: 'UML-диаграмма классов', simple: 'Классы с атрибутами и связи с числами 1, 0..*.', tech: 'UML 2.5 (OMG): ассоциации с кратностью; для моделей данных — со стереотипами.' },
      { term: 'Концептуальная, логическая, физическая модель', simple: 'Три уровня подробности: для бизнеса, для аналитика и архитектора, для базы.', tech: 'Концептуальная — сущности и связи; логическая — атрибуты, ключи, нормализация, независимо от СУБД; физическая — таблицы, типы, индексы конкретной СУБД.' },
      { term: 'Ассоциативная сущность', simple: 'Сущность-связка, которая разрешает «многие ко многим».', tech: 'Associative entity — замена связи M:N двумя 1:N; может иметь свои атрибуты (booking_service, work_item).' }
    ],
    outro: 'ERD «Искры» на доске: десять сущностей, связи с правильными «лапками», ни одной лишней линии — и неделя станции, которую модель выдержала. Вы читаете Чена, Crow\'s Foot, IDEF1X и UML, отличаете концептуальную модель от физической и умеете прочитать схему вслух так, что Марина Олеговна кивает. В пятницу — от общей модели к конкретной задаче: какие данные нужны для согласования доп. работ.',
    tasks: [howErd, howCard, howNot, taskEnt, taskCard, taskBuild, taskBugs, taskExplain]
  });
})();
