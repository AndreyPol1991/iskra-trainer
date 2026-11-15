/* Атлас диаграмм — кнопка «Диаграммы» в шапке. Справочник для тех, кто начинает с нуля и открывает его из любой
   тренировки: что такое диаграмма и как с ней работать; все основные диаграммы аналитика (что показывает, когда брать
   и когда нет, как читать, пример на «Искре», код PlantUML и Mermaid, частые ошибки, вопрос с собеседования);
   редкие виды и все 14 диаграмм UML; PlantUML и Mermaid с живой песочницей; мастер «какую диаграмму взять»;
   самопроверка на ситуациях из кейса. Очков не начисляет и в отчёт не пишет: это справочник, а не тренировка. */
'use strict';
(function () {
  const TR = window.TR, ui = TR.ui, esc = TR.esc;

  if (!document.getElementById('xa-css')) document.head.insertAdjacentHTML('beforeend', `<style id="xa-css">
    .modal .sheet:has(.xa-root) { max-width: 1180px; width: min(1180px, 96vw); }
    /* колонка окна не шире экрана: иначе длинная строка кода растягивает карточку и на телефоне текст обрезается */
    .modal .sheet:has(.xa-root) .sbody { grid-template-columns: minmax(0, 1fr); }
    .xa-root .tab-pane, .xa-root .tab-pane > div, .xa-det > * { min-width: 0; }
    .xa-root { display: grid; gap: 14px; min-width: 0; }
    .xa-root p { margin: 0; }
    .xa-lead { font-size: 15px; color: var(--text-2); max-width: 75ch; }
    .xa-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 250px), 1fr)); gap: 10px; }
    .xa-card { border: 1px solid var(--border); border-radius: var(--r); background: var(--surface); padding: 12px 14px; display: grid; gap: 6px; align-content: start; min-width: 0; }
    .xa-card h4 { margin: 0; font-size: 14.5px; }
    .xa-card .small { color: var(--text-2); }
    button.xa-card { text-align: left; font: inherit; color: inherit; cursor: pointer; }
    button.xa-card:hover { border-color: var(--accent); }
    .xa-card .xa-ic { font-size: 20px; line-height: 1; }
    .xa-steps { display: grid; gap: 8px; counter-reset: xa; }
    .xa-step { display: grid; grid-template-columns: 34px minmax(0, 1fr); gap: 10px; align-items: start; border: 1px solid var(--border); border-radius: 10px; background: var(--surface); padding: 10px 12px; }
    .xa-step::before { counter-increment: xa; content: counter(xa); display: grid; place-items: center; width: 28px; height: 28px; border-radius: 50%; background: var(--accent-soft); color: var(--accent); font-weight: 700; }
    .xa-step b { display: block; margin-bottom: 2px; }
    .xa-two { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 10px; }
    .xa-tbl { width: 100%; border-collapse: collapse; font-size: 13.5px; }
    .xa-tbl th, .xa-tbl td { border-bottom: 1px solid var(--border); padding: 7px 8px; text-align: left; vertical-align: top; }
    .xa-tbl th { color: var(--text-muted); font-weight: 600; font-size: 12.5px; }
    .xa-scroll { overflow-x: auto; }
    .xa-yes { color: var(--ok); font-weight: 700; } .xa-no { color: var(--text-muted); } .xa-mid { color: var(--warn); font-weight: 700; }

    .xa-cat { display: grid; grid-template-columns: minmax(0, 290px) minmax(0, 1fr); gap: 14px; align-items: start; }
    .xa-list { display: grid; gap: 10px; position: sticky; top: 0; max-height: 78vh; overflow: auto; padding-right: 4px; }
    .xa-filters { display: flex; flex-wrap: wrap; gap: 6px; }
    .xa-filters .chip[aria-pressed="true"] { background: var(--accent); color: var(--accent-text); border-color: var(--accent); }
    .xa-gr { display: grid; gap: 4px; }
    .xa-gr h5 { margin: 6px 0 2px; font-size: 12px; text-transform: uppercase; letter-spacing: .05em; color: var(--text-muted); }
    .xa-it { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 6px; align-items: center; text-align: left; font: inherit; color: var(--text); background: var(--surface); border: 1px solid var(--border); border-radius: 9px; padding: 7px 10px; cursor: pointer; }
    .xa-it:hover { border-color: var(--border-strong); }
    .xa-it[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); }
    .xa-it small { display: block; color: var(--text-muted); font-size: 11.5px; }
    .xa-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--text-muted); }
    .xa-dot.core { background: var(--accent); } .xa-dot.often { background: var(--info); }
    .xa-det { display: grid; gap: 12px; min-width: 0; }
    .xa-head { display: grid; gap: 4px; }
    .xa-head h3 { margin: 0; font-size: 21px; font-family: var(--f-brand); }
    .xa-badges { display: flex; flex-wrap: wrap; gap: 6px; }
    .xa-badge { font-size: 12px; padding: 2px 8px; border-radius: 999px; border: 1px solid var(--border); color: var(--text-2); background: var(--surface-2); }
    .xa-badge.core { border-color: var(--accent); color: var(--accent); background: var(--accent-soft); }
    .xa-badge.often { border-color: var(--info); color: var(--info); background: var(--info-soft); }
    .xa-pic { border: 1px solid var(--border); border-radius: 12px; background: var(--surface-2); padding: 10px; overflow-x: auto; }
    .xa-svg { display: block; width: 100%; max-width: 520px; min-width: 300px; margin: 0 auto; height: auto; }
    .xa-svg .xa-b { fill: var(--surface); stroke: var(--border-strong); stroke-width: 1.4; }
    .xa-svg .xa-b.soft { fill: var(--accent-soft); stroke: var(--accent); }
    .xa-svg .xa-b.info { fill: var(--info-soft); stroke: var(--info); }
    .xa-svg .xa-b.ok { fill: var(--ok-soft); stroke: var(--ok); }
    .xa-svg .xa-b.bad { fill: var(--bad-soft); stroke: var(--bad); }
    .xa-svg .xa-b.warn { fill: var(--warn-soft); stroke: var(--warn); }
    .xa-svg .xa-b.mut { fill: var(--surface-3); stroke: var(--text-muted); }
    .xa-svg .xa-b.thick { stroke-width: 3.2; }
    .xa-svg .xa-b.dash { fill: none; stroke-dasharray: 6 4; }
    .xa-svg .xa-b.none { fill: none; }
    .xa-svg .xa-f { fill: var(--text-2); stroke: none; }
    .xa-svg .xa-l { fill: none; stroke: var(--text-2); stroke-width: 1.4; }
    .xa-svg .xa-l.dash { stroke-dasharray: 5 4; }
    .xa-svg .xa-l.acc { stroke: var(--accent); stroke-width: 2.2; }
    .xa-svg .xa-l.bone { stroke: var(--text-muted); }
    .xa-svg .xa-ah { fill: var(--text-2); }
    .xa-svg .xa-t { fill: var(--text); font-size: 10.5px; font-family: var(--f-body); }
    .xa-svg .xa-t.s { fill: var(--text-muted); font-size: 9px; }
    .xa-svg .xa-t.b { font-weight: 700; }
    .xa-svg .xa-t.acc { fill: var(--accent); font-weight: 700; }
    .xa-svg .xa-t.lbl { fill: var(--text-2); font-size: 9px; paint-order: stroke; stroke: var(--surface-2); stroke-width: 3px; }
    .xa-svg .xa-t.mono { font-family: var(--f-mono); font-size: 9px; }
    .xa-sec { display: grid; gap: 6px; }
    .xa-sec > h4 { margin: 0; font-size: 14px; color: var(--text-2); }
    .xa-ul { margin: 0; padding-left: 18px; display: grid; gap: 4px; align-content: start; }
    .xa-sec, .xa-two > * { align-content: start; }
    /* Код показываем так, как его набирают: без лигатур, иначе -> и --> превращаются в «→» и новичок перепишет не тот символ */
    .xa-root pre.code, .xa-root code, .xa-root textarea, .xa-svg .mono { font-variant-ligatures: none; font-feature-settings: "liga" 0, "calt" 0; }
    .xa-ul li { line-height: 1.45; }
    .xa-alt { font: inherit; font-size: 13px; color: var(--accent); background: none; border: 0; padding: 0; cursor: pointer; text-decoration: underline; text-underline-offset: 2px; }
    .xa-elem { display: grid; grid-template-columns: minmax(110px, 170px) minmax(0, 1fr); gap: 4px 12px; font-size: 13.5px; }
    .xa-elem b { color: var(--text); }
    .xa-codebar { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
    .xa-codebar .grow { flex: 1; }
    .xa-det details { border: 1px solid var(--border); border-radius: 10px; background: var(--surface); padding: 8px 12px; }
    .xa-det summary { cursor: pointer; font-weight: 600; }
    .xa-det details > div { margin-top: 8px; color: var(--text-2); }
    .xa-uml { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 10px; }
    .xa-uml ul { margin: 0; padding-left: 18px; display: grid; gap: 3px; font-size: 13.5px; }

    .xa-sand { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.25fr); gap: 12px; align-items: start; }
    .xa-sand textarea { width: 100%; min-height: 250px; font: 12.5px/1.55 var(--f-mono); background: var(--code-bg); color: var(--text); border: 1px solid var(--border); border-radius: 10px; padding: 10px; resize: vertical; box-sizing: border-box; }
    .xa-msgs { display: grid; gap: 4px; font-size: 12.5px; }
    .xa-msg { padding: 5px 9px; border-radius: 8px; background: var(--bad-soft); color: var(--bad); }
    .xa-msg.warn { background: var(--warn-soft); color: var(--warn); }
    .xa-msg.ok { background: var(--ok-soft); color: var(--ok); }
    .xa-out { overflow-x: auto; border: 1px solid var(--border); border-radius: 12px; background: var(--surface-2); padding: 8px; min-height: 120px; }

    .xa-pick { display: grid; gap: 8px; }
    .xa-opt { display: block; width: 100%; text-align: left; font: inherit; color: var(--text); background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 10px 12px; cursor: pointer; }
    .xa-opt:hover { border-color: var(--accent); }
    .xa-res { border: 1px solid var(--accent); border-left-width: 4px; border-radius: 10px; background: var(--surface); padding: 12px 14px; display: grid; gap: 8px; }
    .xa-score { font-size: 14px; color: var(--text-2); }
    @media (max-width: 860px) {
      .xa-cat, .xa-sand { grid-template-columns: minmax(0, 1fr); }
      .xa-list { position: static; max-height: none; }
    }
    @media (max-width: 620px) { .xa-two, .xa-uml { grid-template-columns: minmax(0, 1fr); } .xa-elem { grid-template-columns: minmax(0, 1fr); } }
  </style>`);

  /* ---------- маленький набор для рисования схем ---------- */
  const svg = (w, h, body, label) => `<svg viewBox="0 0 ${w} ${h}" class="xa-svg" role="img" aria-label="${esc(label || 'Схема-пример')}"><defs><marker id="xa-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" class="xa-ah"/></marker></defs>${body}</svg>`;
  const T = (x, y, t, c, a) => {
    const ls = String(t).split('\n'), y0 = y - (ls.length - 1) * 6;
    return `<text x="${x}" y="${y0}" text-anchor="${a || 'middle'}" class="xa-t ${c || ''}">${ls.map((l, i) => `<tspan x="${x}" dy="${i ? 12 : 0}">${esc(l)}</tspan>`).join('')}</text>`;
  };
  const R = (x, y, w, h, t, c, rx, tc) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx == null ? 6 : rx}" class="xa-b ${c || ''}"/>${t ? T(x + w / 2, y + h / 2 + 4, t, tc) : ''}`;
  const L = (d, o) => { o = o || {}; return `<path d="${d}" class="xa-l ${o.c || ''}" ${o.noarrow ? '' : 'marker-end="url(#xa-a)"'}/>${o.t ? T(o.x, o.y, o.t, 'lbl') : ''}`; };
  const E = (cx, cy, rx, ry, t, c) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" class="xa-b ${c || ''}"/>${t ? T(cx, cy + 4, t) : ''}`;
  const C = (cx, cy, r, c) => `<circle cx="${cx}" cy="${cy}" r="${r}" class="${c === 'fill' ? 'xa-f' : 'xa-b ' + (c || '')}"/>`;
  const D = (cx, cy, w, h, t, c) => `<polygon points="${cx},${cy - h / 2} ${cx + w / 2},${cy} ${cx},${cy + h / 2} ${cx - w / 2},${cy}" class="xa-b ${c || ''}"/>${t ? T(cx, cy + 4, t) : ''}`;
  const A = (x, y, t) => `<circle cx="${x}" cy="${y}" r="6" class="xa-b none"/><path d="M${x} ${y + 6} V${y + 22} M${x - 9} ${y + 12} H${x + 9} M${x} ${y + 22} L${x - 8} ${y + 34} M${x} ${y + 22} L${x + 8} ${y + 34}" class="xa-l"/>${T(x, y + 46, t)}`;
  const DB = (x, y, w, h, t, c) => `<path d="M${x} ${y + 6} C${x} ${y - 2} ${x + w} ${y - 2} ${x + w} ${y + 6} V${y + h - 6} C${x + w} ${y + h + 2} ${x} ${y + h + 2} ${x} ${y + h - 6} Z" class="xa-b ${c || ''}"/><path d="M${x} ${y + 6} C${x} ${y + 14} ${x + w} ${y + 14} ${x + w} ${y + 6}" class="xa-l" style="stroke:var(--border-strong)"/>${t ? T(x + w / 2, y + h / 2 + 8, t) : ''}`;
  const HX = (x, y, w, h, t, c) => `<polygon points="${x + 8},${y} ${x + w - 8},${y} ${x + w},${y + h / 2} ${x + w - 8},${y + h} ${x + 8},${y + h} ${x},${y + h / 2}" class="xa-b ${c || ''}"/>${t ? T(x + w / 2, y + h / 2 + 4, t) : ''}`;
  const ROT = (x, y, t, c) => `<text x="${x}" y="${y}" text-anchor="middle" transform="rotate(-90 ${x} ${y})" class="xa-t ${c || ''}">${esc(t)}</text>`;
  const ENT = (x, y, w, title, rows) => R(x, y, w, 20, title, 'soft', 3, 'b') + R(x, y + 20, w, rows.length * 14 + 8, '', '', 0) + rows.map((r, i) => T(x + 6, y + 38 + i * 14, r, 'mono', 'start')).join('');
  const CLS = (x, y, w, name, attrs, ops) => { const h1 = attrs.length * 13 + 8, h2 = ops.length * 13 + 8; return R(x, y, w, 20, name, 'soft', 0, 'b') + R(x, y + 20, w, h1, '', '', 0) + attrs.map((r, i) => T(x + 6, y + 36 + i * 13, r, 'mono', 'start')).join('') + (ops.length ? R(x, y + 20 + h1, w, h2, '', '', 0) + ops.map((r, i) => T(x + 6, y + 36 + h1 + i * 13, r, 'mono', 'start')).join('') : ''); };
  const CMP = (x, y, w, h, t) => R(x, y, w, h, t) + `<rect x="${x + w - 18}" y="${y + 5}" width="12" height="14" class="xa-b"/><rect x="${x + w - 21}" y="${y + 8}" width="6" height="3" class="xa-b"/><rect x="${x + w - 21}" y="${y + 13}" width="6" height="3" class="xa-b"/>`;
  const NODE = (x, y, w, h, t) => `<polygon points="${x},${y + 8} ${x + 8},${y} ${x + w + 8},${y} ${x + w},${y + 8}" class="xa-b mut"/><polygon points="${x + w},${y + 8} ${x + w + 8},${y} ${x + w + 8},${y + h - 8} ${x + w},${y + h}" class="xa-b mut"/>${R(x, y + 8, w, h - 8, '', '', 0)}${T(x + w / 2, y + 24, t, 'b')}`;

  /* ---------- группы ---------- */
  const GROUPS = [
    { id: 'user', ic: '👤', t: 'Путь пользователя', q: 'Как человек проходит путь и пользуется продуктом?' },
    { id: 'process', ic: '🔀', t: 'Процессы и алгоритмы', q: 'Кто, что и в каком порядке делает?' },
    { id: 'behavior', ic: '🎯', t: 'Требования и поведение', q: 'Что система умеет и по каким правилам живёт?' },
    { id: 'interact', ic: '🔌', t: 'Взаимодействие систем', q: 'Как системы и люди обмениваются запросами и данными?' },
    { id: 'arch', ic: '🏗', t: 'Архитектура', q: 'Из чего состоит система и где она работает?' },
    { id: 'data', ic: '🗄', t: 'Данные', q: 'Какие данные храним и как они связаны?' },
    { id: 'plan', ic: '🧠', t: 'Мышление и планирование', q: 'Как собрать мысли, найти причины, спланировать работу?' }
  ];
  const FREQ = { core: 'Нужна в каждом проекте', often: 'Встречается часто', rare: 'Встретите в отдельных компаниях' };

  /* ---------- диаграммы ---------- */
  // alt в avoid: [текст, id диаграммы, которую взять вместо]
  const DIAGRAMS = [
    {
      id: 'cjm', group: 'user', freq: 'core', name: 'CJM — карта пути клиента', aka: 'Customer Journey Map',
      std: 'Строгой нотации нет. Метод из сервис-дизайна; подробно — Стикдорн и Шнайдер, «Это сервис-дизайн».',
      shows: 'Весь путь человека к цели — от «узнал о проблеме» до «получил результат», включая то, что происходит вне вашего продукта: звонки, ожидание, эмоции. По этапам записывают действия клиента, его мысли и чувства, точки контакта с компанией, боли и идеи, что улучшить.',
      use: ['В начале проекта: понять, где клиенту плохо, до того как придумывать функции', 'Показать бизнесу, за что клиенты недовольны, на языке клиента', 'Выбрать, какие боли закрыть в первом релизе'],
      avoid: [['Нужно расписать экраны и кнопки', 'userflow'], ['Нужно показать работу сотрудников и отделов', 'bpmn'], ['Нужно показать, как системы вызывают друг друга', 'sequence']],
      readers: 'Владелец бизнеса, продакт-менеджер, дизайнеры, аналитики.',
      elems: [['Этапы', 'Крупные шаги пути: «узнал», «записался», «приехал», «ждёт», «оплатил»'], ['Действия', 'Что человек делает на этапе'], ['Мысли и эмоции', 'Что он чувствует; часто рисуют линией настроения'], ['Точки контакта', 'Где он сталкивается с компанией: звонок, приложение, стойка'], ['Боли и возможности', 'Что мешает и что можно улучшить']],
      iskra: 'Елена меняет резину: ищет, где переобуться → звонит, линия занята (теряется 21 % звонков) → наконец записывается → сдаёт машину → ждёт без новостей и звонит сама 2–3 раза → согласует доп. работы по телефону → платит → забирает. Самые глубокие провалы настроения — дозвон и ожидание без статуса.',
      pic: () => svg(330, 170, ['Узнала', 'Записалась', 'Ждёт', 'Оплатила'].map((t, i) => R(8 + i * 80, 8, 74, 24, t, 'soft')).join('') + T(8, 46, 'Настроение', 's', 'start') + L('M45 70 L125 128 L205 120 L285 62', { c: 'acc', noarrow: true }) + [[45, 70], [125, 128], [205, 120], [285, 62]].map(p => C(p[0], p[1], 4, 'fill')).join('') + T(125, 150, 'линия занята:\n21 % звонков теряется', 's') + T(205, 104, 'нет статуса', 's') + T(285, 82, 'оплата онлайн', 's'), 'CJM: этапы и линия настроения клиента'),
      pu: null, puNote: 'В PlantUML отдельной диаграммы для CJM нет. Карту пути обычно рисуют в Miro, FigJam или таблицей.',
      mm: `journey
  title Елена меняет резину в «Искре»
  section Запись
    Ищет, где переобуться: 3: Клиент
    Звонит, линия занята: 1: Клиент
    Записывается в приложении: 4: Клиент
  section Визит
    Сдаёт машину мастеру: 4: Клиент, Мастер
    Ждёт без новостей: 2: Клиент
    Согласует доп. работы по фото: 4: Клиент
  section Выдача
    Оплачивает онлайн: 5: Клиент`,
      mmNote: 'В Mermaid есть упрощённая версия — journey: этапы, шаги и оценка настроения от 1 до 5. Мысли и боли в неё не помещаются.',
      mistakes: ['Рисуют путь из головы, без интервью с клиентами — получается фантазия команды', 'Пишут только шаги и забывают эмоции и боли — это уже не CJM, а список действий', 'Смешивают путь клиента с работой сотрудников внутри компании'],
      ask: ['Чем CJM отличается от user flow?', 'CJM — весь путь клиента с эмоциями, в том числе вне продукта; user flow — шаги внутри продукта по экранам и решениям. CJM отвечает «где больно», user flow — «как именно пройти по экранам».'],
      tools: 'Miro, FigJam, Figma, таблица в Excel или Google Таблицах.', stage: 'm3-cjm'
    },
    {
      id: 'userflow', group: 'user', freq: 'core', name: 'User flow — пользовательский поток', aka: 'Схема пользовательского сценария, screen flow',
      std: 'Строгой нотации нет: обычно используют фигуры блок-схемы (действие, решение, начало и конец).',
      shows: 'Шаги человека внутри продукта для одной цели: какие экраны он видит, что нажимает, где выбирает и куда попадает при ошибке.',
      use: ['Перед макетами в Figma: договориться, какие экраны нужны и как они связаны', 'Найти забытые ветки: «а если слот заняли?», «а если нет интернета?»', 'Передать дизайнеру и разработчику логику переходов'],
      avoid: [['Нужен весь опыт клиента с эмоциями и офлайн-шагами', 'cjm'], ['Нужно показать, что происходит внутри системы между сервисами', 'sequence']],
      readers: 'Дизайнеры, мобильные и фронтенд-разработчики, тестировщики.',
      elems: [['Овал', 'Начало и конец сценария'], ['Прямоугольник', 'Экран или действие пользователя'], ['Ромб', 'Решение или проверка: «слот свободен?»'], ['Стрелка с подписью', 'Переход и его условие']],
      iskra: 'Запись в приложении «Искры»: выбрать станцию и услугу → выбрать время → если слот за это время заняли, показать «Время уже заняли» и вернуть к выбору → подтвердить → получить напоминание.',
      pic: () => svg(330, 170, R(6, 70, 72, 30, 'Открыла\nприложение', 'ok', 15) + L('M78 85 L94 85') + R(94, 70, 72, 30, 'Выбрала\nвремя') + L('M166 85 L176 85') + D(214, 85, 76, 50, 'Слот\nсвободен?') + L('M252 85 L262 85', { t: 'да', x: 257, y: 78 }) + R(262, 70, 62, 30, 'Запись\nсоздана', 'ok', 15) + L('M214 110 L214 140 L130 140 L130 102', { t: '«Время уже заняли»', x: 172, y: 155 }) + T(214, 125, 'нет', 'lbl'), 'User flow записи с веткой «слот заняли»'),
      pu: `@startuml
start
:Выбрала станцию и услугу;
repeat
  :Выбрала время;
repeat while (Слот уже заняли?) is (да) not (нет)
:Подтвердила запись;
:Получила push с напоминанием;
stop
@enduml`, puNote: 'В PlantUML user flow рисуют диаграммой деятельности (activity).',
      mm: `flowchart TD
  A([Открыла приложение]) --> B[Выбрала станцию и услугу]
  B --> C[Выбрала время]
  C --> D{Слот свободен?}
  D -- да --> E[Подтвердила запись]
  D -- нет --> F[«Время уже заняли»]
  F --> C
  E --> G([Получила push с напоминанием])`,
      mistakes: ['Рисуют только «счастливый путь» и забывают ошибки и отказы', 'Смешивают экраны и внутреннюю работу сервера', 'Делают один огромный поток на всё приложение вместо потока на каждую цель'],
      ask: ['Зачем аналитику user flow, если есть макеты?', 'Макет показывает, как выглядит экран; user flow — как экраны связаны и что происходит при каждом выборе и ошибке. По нему видно, каких экранов и состояний ещё не хватает.'],
      tools: 'Figma, FigJam, Miro, draw.io; кодом — Mermaid и PlantUML.', stage: 'm3-cjm'
    },
    {
      id: 'storymap', group: 'user', freq: 'often', name: 'User Story Map — карта пользовательских историй', aka: 'Story mapping, карта историй',
      std: 'Метод Джеффа Паттона, книга «Пользовательские истории. Искусство гибкой разработки ПО».',
      shows: 'Бэклог, разложенный по пути пользователя. Сверху «хребет» — крупные действия по порядку, под каждым — истории от важных к второстепенным. Горизонтальные линии режут карту на релизы: всё, что выше первой линии, — первая версия продукта (MVP).',
      use: ['Собрать бэклог так, чтобы не потерять целые шаги пути', 'Решить, что войдёт в первый релиз, а что подождёт', 'Объяснить команде и заказчику объём работ одной картинкой'],
      avoid: [['Нужен порядок вызовов между системами', 'sequence'], ['Нужен план по датам', 'gantt']],
      readers: 'Продакт-менеджер, вся команда разработки, заказчик.',
      elems: [['Хребет', 'Крупные действия пользователя слева направо'], ['Карточки', 'Пользовательские истории под своим действием'], ['Линии релизов', 'Что войдёт в первую версию, что во вторую']],
      iskra: 'Хребет: найти станцию → записаться → приехать → согласовать доп. работы → оплатить. Выше линии MVP к 15 марта: запись на слот, напоминание, статус ремонта, оплата картой. Ниже: перенос записи, бонусы.',
      pic: () => svg(330, 170, ['Найти\nстанцию', 'Записаться', 'Приехать', 'Оплатить'].map((t, i) => R(8 + i * 80, 8, 74, 30, t, 'soft')).join('') + R(8, 46, 74, 20, 'Карта станций') + R(88, 46, 74, 20, 'Выбор слота') + R(88, 70, 74, 20, 'Напоминание') + R(168, 46, 74, 20, 'Статус ремонта') + R(248, 46, 74, 20, 'Оплата картой') + L('M4 100 L326 100', { c: 'dash', noarrow: true }) + T(8, 96, 'MVP ↑', 'acc', 'start') + T(322, 114, 'релиз 2 ↓', 's', 'end') + R(88, 120, 74, 20, 'Перенос') + R(168, 120, 74, 30, 'Доп. работы\nс фото') + R(248, 120, 74, 20, 'Бонусы'), 'Карта историй: хребет, карточки, линия MVP'),
      pu: null, puNote: 'В PlantUML нет. Рисуют на доске: Miro, FigJam, стикеры на стене.',
      mm: null, mmNote: 'В Mermaid нет. Карту историй делают на доске или в плагинах к Jira.',
      mistakes: ['Пишут истории в одну колонку без хребта — снова получается плоский список', 'Режут релиз по компонентам («сначала весь бэкенд»), а не по сквозному пути пользователя', 'Не обновляют карту после планирования'],
      ask: ['Как с помощью story map выбрать MVP?', 'Под каждым шагом хребта берут минимально нужные истории так, чтобы пользователь мог пройти весь путь от начала до конца. Всё остальное уходит ниже линии первого релиза.'],
      tools: 'Miro, FigJam, доска со стикерами, плагины к Jira.', stage: 'm2-stories'
    },
    {
      id: 'flowchart', group: 'process', freq: 'core', name: 'Блок-схема', aka: 'Flowchart, схема алгоритма',
      std: 'ГОСТ 19.701-90 (ISO 5807-85) «Схемы алгоритмов, программ, данных и систем».',
      shows: 'Алгоритм или правило: шаги по порядку, проверки условий и ветки «да / нет». Самая простая и понятная всем схема.',
      use: ['Описать правило с условиями так, чтобы его понял и бизнес, и разработчик', 'Показать логику расчёта или проверки', 'Быстро нарисовать на встрече, чтобы договориться'],
      avoid: [['В процессе несколько участников и важно, кто что делает', 'bpmn'], ['Нужно показать запросы между системами', 'sequence'], ['Много комбинаций условий — схема превратится в паутину', 'decision']],
      readers: 'Все: бизнес, разработчики, тестировщики.',
      elems: [['Овал', 'Начало или конец'], ['Прямоугольник', 'Действие'], ['Ромб', 'Решение: вопрос с ответами «да / нет»'], ['Параллелограмм', 'Ввод или вывод данных'], ['Стрелка', 'Порядок шагов']],
      iskra: 'Правило BR-4: если у клиента две неявки подряд, онлайн-запись возможна только с предоплатой 500 ₽; иначе — обычная запись.',
      pic: () => svg(330, 170, R(6, 70, 56, 28, 'Начало', '', 14) + L('M62 84 L84 84') + D(130, 84, 92, 54, '2 неявки\nподряд?') + L('M176 84 L186 84 L186 55 L196 55', { t: 'да', x: 186, y: 70 }) + R(196, 40, 128, 30, 'Запись только\nс предоплатой 500 ₽', 'warn') + L('M186 84 L186 115 L196 115', { t: 'нет', x: 186, y: 103 }) + R(196, 100, 128, 30, 'Обычная запись', 'ok') + T(165, 160, 'овал — начало, ромб — решение, прямоугольник — действие', 's'), 'Блок-схема правила BR-4'),
      pu: `@startuml
start
:Клиент записывается онлайн;
if (Две неявки подряд?) then (да)
  :Требовать предоплату 500 ₽;
else (нет)
  :Обычная запись;
endif
stop
@enduml`, puNote: 'В PlantUML блок-схему рисуют диаграммой деятельности.',
      mm: `flowchart TD
  S([Начало]) --> Q{Две неявки подряд?}
  Q -- да --> P[Запись только с предоплатой 500 ₽]
  Q -- нет --> N[Обычная запись]
  P --> F([Конец])
  N --> F`,
      mistakes: ['Ромб без подписей на выходах — непонятно, где «да», а где «нет»', 'В одном прямоугольнике три действия', 'Стрелки возвращаются и пересекаются так, что схему нельзя прочитать'],
      ask: ['Чем блок-схема отличается от BPMN?', 'Блок-схема — алгоритм без участников и событий, её понимает любой. BPMN — бизнес-процесс по стандарту: участники в дорожках, события, сообщения между организациями, его можно даже исполнять в BPM-движке.'],
      tools: 'draw.io (diagrams.net), Miro, Visio; кодом — Mermaid и PlantUML.'
    },
    {
      id: 'bpmn', group: 'process', freq: 'core', name: 'BPMN — нотация бизнес-процессов', aka: 'Business Process Model and Notation',
      std: 'BPMN 2.0.2 (OMG, 2014), международный стандарт ISO/IEC 19510.',
      shows: 'Бизнес-процесс с участниками: кто (пул, дорожка), что делает (задачи), что запускает и завершает процесс (события), где процесс разветвляется (шлюзы), какие сообщения ходят между организациями.',
      use: ['Описать процесс «как есть», чтобы найти, где теряется время', 'Нарисовать процесс «как будет» после автоматизации', 'Договориться с бизнесом о правилах: кто за что отвечает', 'Передать процесс в BPM-систему (например, Camunda), которая будет его исполнять'],
      avoid: [['Простое правило без участников', 'flowchart'], ['Обмен запросами между системами по API', 'sequence'], ['Статусы одного объекта', 'state']],
      readers: 'Бизнес-заказчик, руководители подразделений, аналитики, разработчики BPM.',
      elems: [['Пул и дорожки', 'Участник процесса и роли внутри него'], ['Круг', 'Событие: тонкий — начало, жирный — конец, двойной — промежуточное'], ['Скруглённый прямоугольник', 'Задача — работа, которую кто-то делает'], ['Ромб', 'Шлюз: «×» — выбор одного пути, «+» — параллельно'], ['Сплошная стрелка', 'Поток операций внутри пула'], ['Пунктир с конвертом', 'Сообщение между пулами']],
      iskra: 'Процесс визита: клиент записывается в приложении → мастер-приёмщик принимает машину → механик диагностирует → если нужны доп. работы, клиент согласует их по фото (BR-6) → работы → оплата → выдача.',
      pic: () => svg(330, 170, R(4, 6, 322, 150, '', 'none', 2) + `<path d="M20 6 V156 M36 6 V156 M36 81 H326" class="xa-l" style="stroke:var(--border-strong)"/>` + ROT(14, 81, 'Станция «Искра»', 's') + ROT(30, 44, 'Клиент', 's') + ROT(30, 119, 'Мастер', 's') + C(54, 43, 8, '') + L('M62 43 L72 43') + R(72, 30, 70, 26, 'Записаться', '', 8) + L('M107 56 L107 72 L128 72 L128 105') + R(96, 105, 70, 26, 'Принять\nмашину', '', 8) + L('M166 118 L186 118') + D(201, 118, 30, 30, '×') + L('M201 103 L201 43 L232 43', { t: 'доп. работы', x: 201, y: 76 }) + R(232, 30, 74, 26, 'Согласовать\nпо фото', '', 8) + L('M216 118 L288 118', { t: 'нет', x: 250, y: 112 }) + `<circle cx="297" cy="118" r="8" class="xa-b thick"/>` + L('M269 56 L292 110'), 'BPMN: пул с дорожками, события, задачи и шлюз'),
      pu: null, puNote: 'Настоящей BPMN в PlantUML нет. Похожую схему с дорожками можно нарисовать диаграммой деятельности, но это будет не BPMN: нет событий и шлюзов по стандарту.',
      mm: null, mmNote: 'В Mermaid BPMN нет. Для BPMN берут специальные редакторы: bpmn.io, Camunda Modeler.',
      mistakes: ['Процесс без начального и конечного события', 'Шлюз разветвляет, но ветки нигде не сходятся обратно', 'В названии задачи нет глагола: «Оплата» вместо «Оплатить заказ-наряд»', 'Сплошная стрелка между пулами — между организациями ходят только сообщения (пунктир)'],
      ask: ['Чем пул отличается от дорожки?', 'Пул — самостоятельный участник, обычно отдельная организация или система: между пулами ходят только сообщения. Дорожка — роль внутри одного участника, между дорожками идёт обычный поток операций.'],
      tools: 'bpmn.io, Camunda Modeler, Bizagi Modeler, Business Studio, ELMA, draw.io.', stage: 'm3-bpmn1'
    },
    {
      id: 'activity', group: 'process', freq: 'often', name: 'UML Activity — диаграмма деятельности', aka: 'Диаграмма активностей',
      std: 'UML 2.5.1 (OMG, 2017), раздел Activities.',
      shows: 'Алгоритм или процесс в мире ИТ: действия, ветвления, параллельные ветки (развилка и слияние — жирные чёрточки), дорожки для участников. По сути — «блок-схема на стероидах» из семейства UML.',
      use: ['Описать сложный алгоритм с параллельными шагами', 'Показать логику внутри системы, когда команда работает в UML', 'Нарисовать процесс кодом в PlantUML, если BPMN не требуется'],
      avoid: [['Процесс для бизнеса по стандарту BPMN', 'bpmn'], ['Запросы между системами по времени', 'sequence']],
      readers: 'Разработчики, архитекторы, аналитики.',
      elems: [['Чёрный кружок', 'Начало'], ['Кружок в кольце', 'Конец'], ['Скруглённый прямоугольник', 'Действие'], ['Ромб', 'Ветвление или слияние веток'], ['Жирная чёрточка', 'Развилка на параллельные ветки и их слияние'], ['Дорожки', 'Кто выполняет действие']],
      iskra: 'Оплата: клиент нажимает «Оплатить» → платёжный сервис создаёт платёж в ЮKassa → клиент подтверждает в банке → параллельно: чек уходит в онлайн-кассу и начисляются бонусы (BR-11) → заказ-наряд отмечается оплаченным.',
      pic: () => svg(330, 180, R(4, 4, 160, 18, 'Клиент', 'mut', 0, 'b') + R(164, 4, 162, 18, 'Платёжный сервис', 'mut', 0, 'b') + `<path d="M164 22 V176" class="xa-l" style="stroke:var(--border-strong)"/>` + C(84, 36, 6, 'fill') + L('M84 42 L84 50') + R(34, 50, 100, 24, 'Нажать «Оплатить»', '', 12) + L('M134 62 L194 62') + R(194, 50, 112, 24, 'Создать платёж', '', 12) + L('M250 74 L250 90') + `<rect x="190" y="90" width="120" height="5" class="xa-f"/>` + L('M215 95 L215 104') + L('M286 95 L286 104') + R(172, 104, 86, 24, 'Чек в кассу', '', 12) + R(262, 104, 62, 24, 'Бонусы', '', 12) + L('M215 128 L215 138') + L('M290 128 L290 138') + `<rect x="190" y="138" width="120" height="5" class="xa-f"/>` + L('M250 143 L250 154') + `<circle cx="250" cy="163" r="8" class="xa-b"/><circle cx="250" cy="163" r="4.5" class="xa-f"/>`, 'Диаграмма деятельности с дорожками и параллельными ветками'),
      pu: `@startuml
|Клиент|
start
:Нажимает «Оплатить»;
|Платёжный сервис|
:Создаёт платёж в ЮKassa;
|Клиент|
:Подтверждает оплату в банке;
|Платёжный сервис|
fork
  :Отправляет чек в онлайн-кассу;
fork again
  :Начисляет бонусы;
end fork
:Отмечает заказ-наряд оплаченным;
stop
@enduml`,
      mm: null, mmNote: 'Отдельной диаграммы деятельности в Mermaid нет — рисуют блок-схемой (flowchart), но без настоящих развилок и дорожек UML.',
      mistakes: ['Параллельные ветки разошлись, но не слились обратно', 'Дорожки не подписаны — неясно, кто действует', 'Слишком мелкие шаги: каждое нажатие кнопки отдельным действием'],
      ask: ['Когда взять activity, а когда BPMN?', 'BPMN — для бизнес-процессов и разговора с бизнесом, особенно если процесс будут исполнять в BPM-системе. Activity — для логики в ИТ-команде, которая работает в UML, или когда схему удобно держать кодом в PlantUML.'],
      tools: 'PlantUML, Enterprise Architect, StarUML, draw.io, Visual Paradigm.'
    },
    {
      id: 'epc', group: 'process', freq: 'rare', name: 'EPC — событийная цепочка процессов', aka: 'Event-driven Process Chain, eEPC',
      std: 'Метод ARIS (Август-Вильгельм Шеер, 1992). Стандарта уровня ISO нет, правила задаёт методология ARIS.',
      shows: 'Процесс как строгое чередование событий (шестиугольники — «что случилось») и функций (скруглённые прямоугольники — «что делаем»). Ветвления — логическими связками И, ИЛИ, исключающее ИЛИ.',
      use: ['Если в компании принят ARIS — часто в банках, промышленности, при внедрении SAP', 'Читать старые регламенты, нарисованные в этой нотации'],
      avoid: [['Новый проект без традиции ARIS — сегодня стандарт де-факто BPMN', 'bpmn']],
      readers: 'Методологи процессов, аналитики в крупных компаниях.',
      elems: [['Шестиугольник', 'Событие — состояние «что произошло»'], ['Скруглённый прямоугольник', 'Функция — действие'], ['Кружок с «XOR», «И», «ИЛИ»', 'Логическая связка ветвления'], ['Правило чередования', 'После события — функция, после функции — событие']],
      iskra: 'Событие «Машина принята» → функция «Провести диагностику» → исключающее ИЛИ → событие «Проблем нет» или событие «Найдена проблема».',
      pic: () => svg(330, 170, HX(6, 66, 74, 36, 'Машина\nпринята', 'info') + L('M80 84 L92 84') + R(92, 66, 82, 36, 'Провести\nдиагностику', 'ok', 12) + L('M174 84 L184 84') + C(196, 84, 12, '') + T(196, 87, 'XOR', 's') + L('M204 75 L228 47') + L('M204 93 L228 121') + HX(228, 30, 94, 34, 'Проблем нет', 'info') + HX(228, 104, 94, 34, 'Найдена\nпроблема', 'info') + T(165, 162, 'событие → функция → событие', 's'), 'EPC: события, функция и связка XOR'),
      pu: null, puNote: 'В PlantUML нет.', mm: null, mmNote: 'В Mermaid нет.',
      mistakes: ['Две функции подряд без события между ними', 'После события ставят связку ИЛИ — событие ничего не решает, решает функция'],
      ask: ['Сталкивались с EPC? Чем она отличается от BPMN?', 'EPC — нотация ARIS, где события и функции чередуются строго. В BPMN события ставят только там, где они важны, и есть пулы для участников. Новые процессы чаще рисуют в BPMN.'],
      tools: 'ARIS, Business Studio, draw.io (есть набор фигур EPC).'
    },
    {
      id: 'idef0', group: 'process', freq: 'rare', name: 'IDEF0 — функциональная модель', aka: 'Integration Definition for Function Modeling, SADT',
      std: 'FIPS 183 (США, 1993); в России — рекомендации Р 50.1.028-2001.',
      shows: 'Что делает организация или система, без порядка во времени. Каждая функция — прямоугольник с четырьмя сторонами: слева входы, справа выходы, сверху управление (правила, регламенты), снизу механизмы (люди, инструменты). Каждый блок раскрывают в отдельную схему подробнее.',
      use: ['Верхнеуровнево описать функции организации', 'Государственные и ГОСТ-проекты, где этого требует заказчик', 'Показать, какие регламенты управляют работой и кто её выполняет'],
      avoid: [['Нужен порядок шагов и ветки', 'bpmn'], ['Продуктовая разработка в команде по Scrum — схема будет слишком тяжёлой', 'userflow']],
      readers: 'Методологи, руководители, аналитики госпроектов.',
      elems: [['Прямоугольник', 'Функция: глагол + объект'], ['Стрелка слева', 'Вход — что преобразуется'], ['Стрелка справа', 'Выход — результат'], ['Стрелка сверху', 'Управление — правила, регламент'], ['Стрелка снизу', 'Механизм — кто и чем делает']],
      iskra: 'Функция «Принять машину»: вход — машина клиента; выход — заказ-наряд; управление — регламент приёмки и правила BR-5; механизм — мастер-приёмщик и рабочее место мастера.',
      pic: () => svg(330, 176, R(115, 62, 100, 50, 'Принять\nмашину', 'soft', 2) + T(209, 108, 'А0', 's', 'end') + L('M10 87 L115 87') + T(62, 80, 'машина клиента', 'lbl') + L('M215 87 L320 87') + T(268, 80, 'заказ-наряд', 'lbl') + L('M165 18 L165 62') + T(165, 12, 'регламент приёмки, BR-5', 'lbl') + L('M165 156 L165 112') + T(165, 170, 'мастер-приёмщик, АРМ', 'lbl') + T(62, 100, 'вход', 's') + T(268, 100, 'выход', 's') + T(195, 40, 'управление', 's') + T(197, 140, 'механизм', 's'), 'IDEF0: функция с входом, выходом, управлением и механизмом'),
      pu: null, puNote: 'В PlantUML нет.', mm: null, mmNote: 'В Mermaid нет.',
      mistakes: ['Путают управление и вход: регламент не преобразуется, он управляет — значит, сверху', 'Пытаются показать порядок шагов — IDEF0 про функции, не про время', 'Больше 6 блоков на одной схеме — по стандарту от 3 до 6'],
      ask: ['Что приходит в функцию сверху, а что снизу?', 'Сверху — управление: правила, регламенты, законы, которые определяют, как делать. Снизу — механизмы: люди, оборудование, системы, которые делают.'],
      tools: 'Business Studio, Ramus, draw.io.'
    },
    {
      id: 'usecase', group: 'behavior', freq: 'core', name: 'UML Use Case — варианты использования', aka: 'Диаграмма прецедентов',
      std: 'UML 2.5.1 (OMG), раздел Use Cases. Текст сценариев — Алистер Кокберн, «Современные методы описания функциональных требований».',
      shows: 'Кто пользуется системой (актёры — человечки) и какие цели он с её помощью достигает (варианты использования — овалы). Это оглавление функций, а не порядок шагов.',
      use: ['На старте: договориться о границе системы и списке функций', 'Увидеть всех пользователей и внешние системы', 'Оглавление к текстовым сценариям (use case по Кокберну)'],
      avoid: [['Нужен порядок шагов внутри сценария', 'activity'], ['Нужен порядок вызовов между системами', 'sequence']],
      readers: 'Заказчик, аналитики, тестировщики, руководитель проекта.',
      elems: [['Человечек', 'Актёр — роль человека или внешняя система'], ['Овал', 'Вариант использования — цель актёра, глагол + объект'], ['Прямоугольник', 'Граница системы'], ['Линия', 'Актёр участвует в варианте'], ['«include» / «extend»', 'Обязательное включение / необязательное расширение']],
      iskra: 'Клиент: записаться на ТО, согласовать доп. работы, оплатить онлайн. Мастер-приёмщик: принять машину, предложить доп. работы. «Записаться на ТО» всегда включает «выбрать свободное время».',
      pic: () => svg(330, 172, A(30, 50, 'Клиент') + R(78, 8, 172, 156, '', 'none', 4) + T(164, 24, 'Искра Онлайн', 'b') + E(164, 56, 66, 15, 'Записаться на ТО') + E(164, 96, 66, 15, 'Согласовать доп. работы') + E(164, 136, 66, 15, 'Принять машину') + L('M42 72 L98 56', { noarrow: true }) + L('M42 76 L98 96', { noarrow: true }) + A(296, 104, 'Мастер') + L('M284 128 L230 136', { noarrow: true }), 'Use Case: актёры, граница системы, варианты использования'),
      pu: `@startuml
left to right direction
actor "Клиент" as C
actor "Мастер-приёмщик" as M
rectangle "Искра Онлайн" {
  usecase "Записаться на ТО" as UC1
  usecase "Выбрать свободное время" as UC2
  usecase "Согласовать доп. работы" as UC3
  usecase "Принять машину" as UC4
}
C --> UC1
C --> UC3
M --> UC4
UC1 .> UC2 : <<include>>
@enduml`,
      mm: null, mmNote: 'Диаграммы вариантов использования в Mermaid нет. Её рисуют в PlantUML, draw.io или Enterprise Architect.',
      mistakes: ['Рисуют в овалах шаги («нажать кнопку», «ввести телефон») вместо целей', 'Стрелками показывают порядок — у use case-диаграммы нет порядка', 'Злоупотребляют «extend» и «include» — схема превращается в паутину'],
      ask: ['Чем use case-диаграмма отличается от текстового use case?', 'Диаграмма — оглавление: кто и какие цели достигает. Текстовый use case по Кокберну расписывает один вариант подробно: предусловия, основной сценарий по шагам, альтернативы, исключения.'],
      tools: 'PlantUML, draw.io, Enterprise Architect, StarUML.', stage: 'm2-stories'
    },
    {
      id: 'state', group: 'behavior', freq: 'core', name: 'UML State Machine — диаграмма состояний', aka: 'Статусная модель, диаграмма переходов',
      std: 'UML 2.5.1 (OMG), раздел State Machines.',
      shows: 'Какие состояния (статусы) бывают у одного объекта, какие переходы между ними разрешены и что их вызывает: событие, условие в квадратных скобках, действие после косой черты.',
      use: ['У объекта есть статус: заявка, запись, заказ, платёж — почти в каждой системе', 'Проверить, что из каждого статуса есть выход и нет запрещённых переходов', 'Дать тестировщикам готовый список переходов для проверок'],
      avoid: [['Процесс с несколькими участниками', 'bpmn'], ['Порядок запросов между системами', 'sequence']],
      readers: 'Разработчики, тестировщики, аналитики.',
      elems: [['Чёрный кружок', 'Начальное состояние'], ['Скруглённый прямоугольник', 'Состояние (статус)'], ['Стрелка с подписью', 'Переход: событие [условие] / действие'], ['Кружок в кольце', 'Конечное состояние']],
      iskra: 'Статусы записи: новая → подтверждена (предоплата по BR-4, если нужна) → клиент приехал → выполнена. Из «подтверждена» — в «неявку», если клиент не приехал за 15 минут после начала (BR-4), или в «отменена», если отмена не позже чем за 3 часа (BR-3).',
      pic: () => svg(330, 172, C(12, 41, 6, 'fill') + L('M18 41 L28 41') + R(28, 28, 72, 26, 'Новая', '', 13) + L('M100 41 L120 41') + R(120, 28, 88, 26, 'Подтверждена', '', 13) + L('M208 41 L226 41', { t: 'приехал', x: 217, y: 22 }) + R(226, 28, 96, 26, 'Клиент приехал', '', 13) + L('M274 54 L274 92', { t: 'выдана', x: 300, y: 75 }) + R(226, 92, 96, 26, 'Выполнена', 'ok', 13) + L('M164 54 L164 92', { t: '15 мин (BR-4)', x: 120, y: 75 }) + R(120, 92, 88, 26, 'Неявка', 'bad', 13) + L('M274 118 L274 142') + `<circle cx="274" cy="152" r="8" class="xa-b"/><circle cx="274" cy="152" r="4.5" class="xa-f"/>`, 'Диаграмма состояний записи'),
      pu: `@startuml
state "Новая" as created
state "Подтверждена" as confirmed
state "Клиент приехал" as arrived
state "Выполнена" as done
state "Неявка" as no_show
state "Отменена" as cancelled
[*] --> created
created --> confirmed : предоплата (BR-4)
confirmed --> arrived : клиент приехал
arrived --> done : машина выдана
confirmed --> no_show : 15 мин после начала (BR-4)
confirmed --> cancelled : отмена не позже чем за 3 ч (BR-3)
created --> cancelled : отмена
done --> [*]
@enduml`,
      mm: `stateDiagram-v2
  state "Новая" as created
  state "Подтверждена" as confirmed
  state "Клиент приехал" as arrived
  state "Выполнена" as done
  state "Неявка" as no_show
  state "Отменена" as cancelled
  [*] --> created
  created --> confirmed: предоплата (BR-4)
  confirmed --> arrived: клиент приехал
  arrived --> done: машина выдана
  confirmed --> no_show: 15 мин после начала
  confirmed --> cancelled: отмена за 3 ч и раньше
  created --> cancelled: отмена
  done --> [*]`,
      mistakes: ['Путают состояние и действие: «Оплатить» — действие, «Оплачен» — состояние', 'Тупиковые статусы: попасть можно, выйти нельзя, хотя по смыслу надо', 'Переходы без событий — неясно, что их вызывает'],
      ask: ['Как проверить статусную модель на полноту?', 'Для каждого статуса спросить: как в него попадают, какие из него выходы, что будет при каждом событии (отмена, таймаут, ошибка оплаты). Удобно свести в таблицу «статус × событие» и найти пустые клетки.'],
      tools: 'PlantUML, Mermaid, draw.io, Enterprise Architect.', sys: 'st'
    },
    {
      id: 'decision', group: 'behavior', freq: 'often', name: 'Таблица и дерево решений', aka: 'Decision table, decision tree; DMN',
      std: 'Таблицы решений входят в BABOK (раздел «Моделирование решений»); стандарт для исполнения — DMN 1.5 (OMG).',
      shows: 'Правило с несколькими условиями: что делать при каждой комбинации. Столбцы — комбинации условий, строки — условия и действия. Дерево решений показывает то же ветками.',
      use: ['У правила больше двух условий — в тексте легко пропустить комбинацию', 'Отдать тестировщикам: каждый столбец — готовый тест', 'Проверить с бизнесом, что все случаи учтены'],
      avoid: [['Нужен порядок шагов во времени', 'flowchart'], ['Нужны статусы объекта', 'state']],
      readers: 'Бизнес, разработчики, тестировщики.',
      elems: [['Строки условий', 'Вопросы с ответами «да / нет» или диапазонами'], ['Строки действий', 'Что делать'], ['Столбец', 'Одно правило — одна комбинация условий'], ['«—»', 'Условие не важно для этого правила']],
      iskra: 'BR-9 и BR-6, согласование доп. работ: корпоративный клиент и сумма в пределах лимита договора (у «Шашки» 3 000 ₽) — согласуется автоматически; корпоративный и дороже — согласует завгар; частный клиент — согласует сам в приложении.',
      pic: () => { const col = [8, 150, 208, 266], w = [142, 58, 58, 58], rows = [['Условия и действия', 'П1', 'П2', 'П3'], ['Корпоративный клиент', 'да', 'да', 'нет'], ['Сумма ≤ лимита 3 000 ₽', 'да', 'нет', '—'], ['Согласовать автоматически', '✓', '', ''], ['Согласует завгар', '', '✓', ''], ['Согласует клиент', '', '', '✓']]; let s = ''; rows.forEach((r, i) => r.forEach((c, j) => { s += R(col[j], 8 + i * 25, w[j], 25, '', i === 0 ? 'mut' : i >= 3 ? 'ok' : '', 0) + T(j ? col[j] + w[j] / 2 : col[j] + 6, 24 + i * 25, c, i === 0 ? 'b' : '', j ? 'middle' : 'start'); })); return svg(330, 165, s, 'Таблица решений по правилу BR-9'); },
      pu: null, puNote: 'Таблицу в PlantUML не рисуют: её пишут таблицей в документе. Дерево решений можно нарисовать диаграммой деятельности.',
      mm: `flowchart TD
  Q1{Корпоративный клиент?} -- нет --> A3[Согласует клиент в приложении]
  Q1 -- да --> Q2{Сумма не больше лимита 3 000 ₽?}
  Q2 -- да --> A1[Согласовать автоматически]
  Q2 -- нет --> A2[Согласует завгар]`,
      mmNote: 'Mermaid рисует дерево решений блок-схемой. Саму таблицу пишут в Markdown или Confluence.',
      mistakes: ['Пропускают комбинации: условий три — комбинаций до восьми', 'Два правила противоречат друг другу для одной комбинации', 'Действия записаны без конкретики: «обработать» вместо «согласовать автоматически»'],
      ask: ['Зачем таблица решений, если правило можно описать текстом?', 'В таблице видно все комбинации условий и пустые клетки — пропуски и противоречия находятся сразу. И каждый столбец — готовый тест для QA.'],
      tools: 'Excel, Confluence, Camunda (DMN), draw.io.'
    },
    {
      id: 'sequence', group: 'interact', freq: 'core', name: 'UML Sequence — диаграмма последовательности', aka: 'Диаграмма последовательностей, sequence',
      std: 'UML 2.5.1 (OMG), раздел Interactions.',
      shows: 'Как участники (люди, приложения, сервисы, внешние системы) обмениваются сообщениями во времени: сверху вниз по порядку. Видны запросы, ответы, асинхронные события, ветки «если ошибка» и повторы.',
      use: ['Описать интеграцию: кто кого вызывает, с какими данными, что в ответ', 'Разобрать ошибки и таймауты: что будет, если внешний сервис не ответил', 'Согласовать с разработчиками порядок вызовов API', 'Самая частая диаграмма в постановках системного аналитика'],
      avoid: [['Нужен состав системы, а не порядок', 'component'], ['Нужна работа людей и отделов', 'bpmn'], ['Нужны статусы объекта', 'state']],
      readers: 'Разработчики бэкенда и фронтенда, архитекторы, тестировщики.',
      elems: [['Прямоугольник сверху', 'Участник'], ['Пунктир вниз', 'Линия жизни — время идёт сверху вниз'], ['Сплошная стрелка', 'Запрос (синхронный — с закрашенным наконечником)'], ['Пунктирная стрелка', 'Ответ'], ['Рамка alt / opt / loop', 'Ветки «если», необязательная часть, повтор']],
      iskra: 'Оплата: клиент нажимает «Оплатить» → приложение вызывает платёжный сервис → тот создаёт платёж в ЮKassa и получает ссылку → клиент платит → ЮKassa присылает вебхук «оплачено» → приложение показывает push. Если банк отказал — другая ветка.',
      pic: () => { const xs = [40, 125, 210, 290], ns = ['Клиент', 'Приложение', 'Платёжный\nсервис', 'ЮKassa']; let s = xs.map((x, i) => R(x - 38, 6, 76, 28, ns[i], 'info') + `<path d="M${x} 34 V164" class="xa-l dash"/>`).join(''); s += L('M40 52 L123 52', { t: 'Оплатить', x: 82, y: 47 }) + L('M125 74 L208 74', { t: 'POST /payments', x: 167, y: 69 }) + L('M210 96 L288 96', { t: 'создать платёж', x: 250, y: 91 }) + L('M290 120 L212 120', { c: 'dash', t: 'вебхук: оплачено', x: 250, y: 115 }) + L('M210 144 L127 144', { c: 'dash', t: 'push «Оплачено»', x: 167, y: 139 }); return svg(330, 170, s, 'Диаграмма последовательности оплаты'); },
      pu: `@startuml
actor "Клиент" as U
participant "Приложение" as App
participant "Платёжный сервис" as Pay
participant "ЮKassa" as YK
U -> App : Нажимает «Оплатить»
App -> Pay : POST /payments
Pay -> YK : Создать платёж
YK --> Pay : ссылка на оплату
Pay --> App : 201 Created, ссылка
App -> YK : Открывает страницу оплаты
YK -> Pay : Вебхук payment.succeeded
alt оплата прошла
  Pay --> App : push «Оплачено»
else отказ банка
  Pay --> App : push «Не прошло, попробуйте другую карту»
end
@enduml`,
      mm: `sequenceDiagram
  actor U as Клиент
  participant App as Приложение
  participant Pay as Платёжный сервис
  participant YK as ЮKassa
  U->>App: Нажимает «Оплатить»
  App->>Pay: POST /payments
  Pay->>YK: Создать платёж
  YK-->>Pay: ссылка на оплату
  Pay-->>App: 201 Created, ссылка
  App->>YK: Открывает страницу оплаты
  YK->>Pay: Вебхук payment.succeeded
  alt оплата прошла
    Pay-->>App: push «Оплачено»
  else отказ банка
    Pay-->>App: push «Не прошло»
  end`,
      mistakes: ['Рисуют только успешный путь — а самое ценное в sequence как раз ошибки и таймауты', 'На стрелках нет данных: «запрос» вместо «POST /payments: сумма, заказ-наряд»', 'Участников больше 7–8 — схему не прочитать, лучше разбить на несколько'],
      ask: ['Как на sequence показать, что внешний сервис может не ответить?', 'Фрагментом alt (или break) с веткой «таймаут»: что делает система — повторяет запрос, показывает ошибку, ставит задачу в очередь. Это и есть требования к обработке ошибок.'],
      tools: 'PlantUML, Mermaid, draw.io, Enterprise Architect, sequencediagram.org.', stage: 'm3-seq'
    },
    {
      id: 'context', group: 'interact', freq: 'core', name: 'Контекстная диаграмма', aka: 'System context diagram, диаграмма контекста',
      std: 'Первый уровень модели C4 (Саймон Браун); в структурном анализе — DFD нулевого уровня (Йордон, Де Марко).',
      shows: 'Систему как один чёрный ящик в центре и всех, с кем она общается: пользователей и внешние системы. На стрелках — что передаётся. Это граница проекта на одной картинке.',
      use: ['Самое начало проекта: что наше, а что чужое', 'Составить список интеграций', 'Объяснить проект новичку или заказчику за минуту'],
      avoid: [['Нужно показать устройство системы изнутри', 'c4'], ['Нужен порядок обмена по шагам', 'sequence']],
      readers: 'Все: заказчик, команда, безопасность, руководство.',
      elems: [['Прямоугольник в центре', 'Ваша система'], ['Человечки', 'Пользователи и роли'], ['Прямоугольники вокруг', 'Внешние системы'], ['Стрелки с подписями', 'Что передаётся и в какую сторону']],
      iskra: '«Искра Онлайн» в центре; клиент записывается и платит; мастер-приёмщик ведёт заказ-наряды; внешние: ЮKassa (платежи), SMS-шлюз (напоминания), 1С (остатки запчастей и выгрузка оплат).',
      pic: () => svg(330, 172, A(30, 22, 'Клиент') + A(30, 102, 'Мастер') + R(120, 64, 90, 42, 'Искра\nОнлайн', 'soft', 8) + L('M44 48 L120 74', { t: 'запись, оплата', x: 80, y: 52 }) + L('M44 126 L120 98', { t: 'заказ-наряды', x: 80, y: 124 }) + R(252, 14, 72, 26, 'ЮKassa', 'info') + R(252, 72, 72, 26, 'SMS-шлюз', 'info') + R(252, 130, 72, 26, '1С', 'info') + L('M210 72 L252 30', { t: 'платежи', x: 230, y: 44 }) + L('M210 85 L252 85', { t: 'SMS', x: 231, y: 80 }) + L('M210 98 L252 140', { t: 'запчасти', x: 228, y: 128 }), 'Контекстная диаграмма «Искра Онлайн»'),
      pu: `@startuml
!include <C4/C4_Context>
Person(client, "Клиент", "Записывается, согласует и платит")
Person(master, "Мастер-приёмщик", "Ведёт заказ-наряды")
System(iskra, "Искра Онлайн", "Запись, ремонт, оплата")
System_Ext(yk, "ЮKassa", "Онлайн-платежи")
System_Ext(sms, "SMS-шлюз", "Напоминания")
System_Ext(c1, "1С", "Склад и бухгалтерия")
Rel(client, iskra, "Записывается и платит")
Rel(master, iskra, "Принимает машины")
Rel(iskra, yk, "Создаёт платежи")
Rel(iskra, sms, "Отправляет SMS")
Rel(iskra, c1, "Остатки и оплаты", "каждые 15 мин")
@enduml`,
      mm: `flowchart LR
  client([Клиент]) -- запись, оплата --> sys[Искра Онлайн]
  master([Мастер-приёмщик]) -- заказ-наряды --> sys
  sys -- платежи --> yk[[ЮKassa]]
  sys -- напоминания --> sms[[SMS-шлюз]]
  sys <-->|остатки и оплаты| c1[[1С]]`,
      mmNote: 'В Mermaid есть экспериментальная C4Context, но надёжнее блок-схема, как здесь.',
      mistakes: ['Рисуют внутренности системы — на контекстной она одна коробка', 'Стрелки без подписей: непонятно, что передаётся', 'Забывают внешние системы, о которых не думали: налоговая касса, SMS, почта'],
      ask: ['С какой диаграммы вы начнёте новый проект?', 'С контекстной: она фиксирует границу системы, всех пользователей и внешние интеграции. С неё же начинается список требований к интеграциям и вопросов к заказчику.'],
      tools: 'draw.io, Miro, Structurizr, PlantUML (C4-PlantUML).', stage: 'm3-comp'
    },
    {
      id: 'dfd', group: 'interact', freq: 'often', name: 'DFD — диаграмма потоков данных', aka: 'Data Flow Diagram',
      std: 'Структурный анализ: нотации Йордона — Де Марко и Гейна — Сарсона (1970-е).',
      shows: 'Откуда приходят данные, какие процессы их обрабатывают, где данные хранятся и куда уходят. Порядка во времени нет — только движение данных.',
      use: ['Разобраться, где хранятся и через кого проходят персональные данные (важно для 152-ФЗ и безопасности)', 'Найти лишние копии данных и ручные перекладывания', 'Описать интеграции на уровне «что куда течёт»'],
      avoid: [['Нужен порядок шагов во времени', 'sequence'], ['Нужна структура таблиц', 'erd']],
      readers: 'Аналитики, архитекторы, специалисты по безопасности.',
      elems: [['Квадрат', 'Внешняя сущность — источник или получатель данных'], ['Круг', 'Процесс, который преобразует данные'], ['Две параллельные линии', 'Хранилище данных'], ['Стрелка с подписью', 'Поток данных — что именно течёт']],
      iskra: 'Клиент передаёт данные машины и выбранное время → процесс «Записать на ТО» → запись сохраняется в хранилище «Записи» → напоминание уходит в SMS-шлюз; телефон клиента — персональные данные, видно, где они лежат.',
      pic: () => svg(330, 170, R(8, 64, 62, 30, 'Клиент', '', 0) + C(150, 79, 34, 'soft') + T(150, 77, 'Записать\nна ТО') + `<path d="M238 52 H322 M238 82 H322 M238 52 V82" class="xa-l" style="stroke:var(--border-strong)"/>` + T(280, 71, 'D1 Записи') + R(240, 124, 82, 28, 'SMS-шлюз', '', 0) + L('M70 79 L116 79', { t: 'машина, время', x: 93, y: 70 }) + L('M184 72 L236 68', { t: 'запись', x: 210, y: 62 }) + L('M174 104 L240 134', { t: 'напоминание', x: 196, y: 130 }), 'DFD: внешняя сущность, процесс, хранилище, потоки'),
      pu: null, puNote: 'Отдельной DFD в PlantUML нет; изредка рисуют приближённо через диаграмму компонентов.',
      mm: `flowchart LR
  C[Клиент] -- данные машины, время --> P1((Записать на ТО))
  P1 -- запись --> D1[(Записи)]
  P1 -- напоминание --> N[SMS-шлюз]
  D1 -- расписание дня --> P2((Принять машину))
  M[Мастер-приёмщик] -- результат осмотра --> P2`,
      mmNote: 'В Mermaid DFD рисуют блок-схемой: круг — процесс, цилиндр — хранилище.',
      mistakes: ['Стрелка от хранилища к хранилищу — данные не текут сами, нужен процесс между ними', 'Процесс без выхода («чёрная дыра») или без входа («чудо»)', 'Добавляют порядок «сначала, потом» — это уже другая диаграмма'],
      ask: ['Чем DFD отличается от sequence?', 'DFD показывает, какие данные откуда и куда текут и где хранятся, без времени. Sequence показывает порядок сообщений между участниками во времени.'],
      tools: 'draw.io, Visio, Miro, Lucidchart.'
    },
    {
      id: 'c4', group: 'arch', freq: 'core', name: 'C4 — модель архитектуры', aka: 'C4 model: Context, Containers, Components, Code',
      std: 'Саймон Браун, c4model.com. Четыре уровня приближения, как карта: страна → город → район → улица.',
      shows: 'Архитектуру на четырёх уровнях. 1 — контекст: система и её окружение. 2 — контейнеры: приложения, сервисы, базы данных, из которых она состоит. 3 — компоненты внутри контейнера. 4 — код (рисуют редко). Каждый уровень — для своих читателей.',
      use: ['Объяснить архитектуру смешанной аудитории: от заказчика до разработчиков', 'Зафиксировать, из каких частей состоит система и как они связаны', 'Документация архитектуры, которую реально читают'],
      avoid: [['Нужен порядок вызовов', 'sequence'], ['Нужны серверы и сети', 'deployment']],
      readers: 'Уровень 1 — все; уровень 2 — команда и архитекторы; уровень 3 — разработчики.',
      elems: [['Человек', 'Пользователь или роль'], ['Синий прямоугольник', 'Контейнер или система: имя, [технология], назначение'], ['Цилиндр', 'Хранилище данных'], ['Серый прямоугольник', 'Внешняя система'], ['Пунктирная рамка', 'Граница системы'], ['Стрелка', 'Связь: что делает и по какой технологии']],
      iskra: 'Уровень контейнеров «Искра Онлайн»: мобильное приложение, сайт, рабочее место мастера и планшет механика ходят в API-шлюз; за ним сервисы записи, заказ-нарядов, платежей и уведомлений; база PostgreSQL, хранилище фото, брокер сообщений; снаружи ЮKassa, SMS-шлюз, 1С.',
      pic: () => svg(330, 170, `<circle cx="38" cy="26" r="10" class="xa-b soft"/>` + R(14, 38, 48, 30, 'Клиент', 'soft', 12) + R(88, 8, 160, 154, '', 'dash', 6) + T(168, 22, 'Искра Онлайн [система]', 's') + R(100, 30, 136, 32, 'Приложение\n[iOS / Android]', 'info', 6) + R(100, 76, 136, 32, 'API-шлюз\n[REST]', 'info', 6) + DB(130, 120, 76, 36, 'База\n[PostgreSQL]', 'info') + R(264, 76, 60, 32, 'ЮKassa', 'mut', 6) + L('M62 50 L100 46') + L('M168 62 L168 76') + L('M168 108 L168 120') + L('M236 92 L264 92'), 'C4, уровень контейнеров'),
      pu: `@startuml
!include <C4/C4_Container>
Person(client, "Клиент", "Записывается и платит")
System_Boundary(iskra, "Искра Онлайн") {
  Container(app, "Мобильное приложение", "iOS / Android")
  Container(api, "API-шлюз", "REST")
  Container(book, "Сервис записи", "Слоты, BR-1…BR-4")
  ContainerDb(db, "База данных", "PostgreSQL")
}
System_Ext(yk, "ЮKassa", "Онлайн-платежи")
Rel(client, app, "Записывается")
Rel(app, api, "Вызывает", "HTTPS / JSON")
Rel(api, book, "Передаёт запросы записи")
Rel(book, db, "Читает и пишет")
Rel(api, yk, "Создаёт платежи")
@enduml`, puNote: 'C4 в PlantUML подключается стандартной библиотекой: строка !include <C4/C4_Container>.',
      mm: `C4Container
  title Искра Онлайн: контейнеры
  Person(client, "Клиент")
  System_Boundary(iskra, "Искра Онлайн") {
    Container(app, "Мобильное приложение", "iOS / Android")
    Container(api, "API-шлюз", "REST")
    ContainerDb(db, "База данных", "PostgreSQL")
  }
  System_Ext(yk, "ЮKassa")
  Rel(client, app, "Записывается")
  Rel(app, api, "Вызывает", "HTTPS")
  Rel(api, db, "Читает и пишет")
  Rel(api, yk, "Создаёт платежи")`,
      mmNote: 'C4 в Mermaid пока экспериментальная: синтаксис тот же, что у C4-PlantUML, но раскладка хуже.',
      mistakes: ['Смешивают уровни: на одной схеме и сервисы, и классы, и серверы', 'Нет легенды и подписей технологий — читатель гадает', 'Путают контейнер C4 с Docker-контейнером: в C4 это любое отдельно запускаемое приложение или хранилище'],
      ask: ['Что такое «контейнер» в C4?', 'Отдельно запускаемая или развёртываемая часть системы: мобильное приложение, веб-приложение, сервис, база данных. К Docker это слово отношения не имеет.'],
      tools: 'Structurizr (DSL), C4-PlantUML, draw.io, IcePanel.', stage: 'm3-comp'
    },
    {
      id: 'component', group: 'arch', freq: 'often', name: 'UML Component — диаграмма компонентов', aka: 'Диаграмма компонентов UML',
      std: 'UML 2.5.1 (OMG), раздел Components.',
      shows: 'Из каких компонентов (модулей, сервисов) состоит система, какие интерфейсы они предоставляют и какие используют. Интерфейс рисуют «леденцом» (предоставляет) и «гнездом» (требует).',
      use: ['Показать разработчикам состав системы и зависимости между модулями', 'Найти, какие компоненты затронет изменение', 'Описать, какие API кто предоставляет'],
      avoid: [['Объяснить архитектуру смешанной аудитории — проще C4', 'c4'], ['Показать серверы и сети', 'deployment']],
      readers: 'Разработчики, архитекторы.',
      elems: [['Прямоугольник со значком', 'Компонент'], ['Кружок на палочке', 'Предоставляемый интерфейс'], ['Полукруг', 'Требуемый интерфейс'], ['Пунктирная стрелка', 'Зависимость: «использует»']],
      iskra: 'API-шлюз использует сервис записи и платёжный сервис через их REST-интерфейсы; платёжный сервис зависит от ЮKassa; сервисы пишут в одну базу PostgreSQL.',
      pic: () => svg(330, 170, CMP(16, 30, 100, 34, 'API-шлюз') + CMP(16, 108, 100, 34, 'Сервис записи') + CMP(206, 30, 110, 34, 'Платёжный\nсервис') + L('M206 47 L182 47', { noarrow: true }) + C(176, 47, 6, '') + L('M116 47 L168 47', { c: 'dash', t: 'REST', x: 140, y: 40 }) + L('M66 64 L66 106', { c: 'dash' }) + DB(222, 104, 82, 42, 'PostgreSQL') + L('M116 125 L220 125', { c: 'dash' }), 'Диаграмма компонентов с интерфейсом-леденцом'),
      pu: `@startuml
package "Искра Онлайн" {
  [API-шлюз] as gw
  [Сервис записи] as book
  [Платёжный сервис] as pay
  database "PostgreSQL" as db
}
cloud "ЮKassa" as yk
gw --> book : REST
gw --> pay : REST
book --> db
pay --> db
pay --> yk : HTTPS
@enduml`,
      mm: `flowchart LR
  subgraph iskra[Искра Онлайн]
    gw[API-шлюз] --> book[Сервис записи]
    gw --> pay[Платёжный сервис]
    book --> db[(PostgreSQL)]
    pay --> db
  end
  pay --> yk[[ЮKassa]]`,
      mmNote: 'Отдельной диаграммы компонентов UML в Mermaid нет. Подойдёт блок-схема с группами или бета-версия architecture-beta.',
      mistakes: ['Рисуют классы вместо компонентов — слишком мелко', 'Стрелки зависимостей в обе стороны — признак, что границы компонентов выбраны плохо', 'Нет подписей интерфейсов: непонятно, через что связаны'],
      ask: ['Чем диаграмма компонентов отличается от C4?', 'По смыслу похожи, но UML Component — строгая нотация с интерфейсами для технической аудитории. C4 проще, с понятными уровнями и подписями, его читают и не-разработчики.'],
      tools: 'PlantUML, Enterprise Architect, StarUML, draw.io.', stage: 'm3-comp'
    },
    {
      id: 'deployment', group: 'arch', freq: 'often', name: 'UML Deployment — диаграмма развёртывания', aka: 'Схема развёртывания, инфраструктурная схема',
      std: 'UML 2.5.1 (OMG), раздел Deployments.',
      shows: 'На каком «железе» и в каких средах что запущено: узлы (серверы, телефоны, облако, кластер), артефакты на них и каналы связи между узлами.',
      use: ['Обсудить с DevOps и безопасностью, где что живёт', 'Нефункциональные требования: резервирование, доступность, где хранятся данные (152-ФЗ требует хранить персональные данные россиян в России)', 'Понять, какие сетевые доступы нужно открыть'],
      avoid: [['Нужна логика и порядок вызовов', 'sequence'], ['Нужна логическая архитектура без серверов', 'c4']],
      readers: 'DevOps, администраторы, архитекторы, безопасность.',
      elems: [['Объёмный прямоугольник', 'Узел: сервер, устройство, облако'], ['Прямоугольник «artifact»', 'Что развёрнуто: приложение, файл'], ['Линия с подписью', 'Канал связи и протокол']],
      iskra: 'Приложение «Искры» на телефоне клиента по HTTPS ходит в облачный кластер, где запущены API-шлюз и сервисы; база PostgreSQL в том же облаке; 1С стоит на сервере в офисе бухгалтерии и обменивается данными каждые 15 минут.',
      pic: () => svg(330, 170, NODE(10, 40, 112, 94, 'Телефон клиента') + R(22, 84, 88, 34, '«artifact»\nприложение', '', 2) + NODE(170, 24, 146, 124, 'Облачный кластер') + R(184, 62, 118, 28, 'API-шлюз') + R(184, 100, 118, 28, 'Сервис записи') + L('M122 92 L170 92', { t: 'HTTPS', x: 146, y: 86 }), 'Диаграмма развёртывания: телефон и облако'),
      pu: `@startuml
node "Телефон клиента" {
  artifact "Приложение «Искра»" as app
}
cloud "Облачный хостинг" {
  node "Kubernetes-кластер" {
    [API-шлюз] as gw
    [Сервис записи] as book
  }
  database "PostgreSQL" as db
}
node "Сервер в офисе" {
  [1С: Бухгалтерия] as c1
}
app --> gw : HTTPS
gw --> book
book --> db
book --> c1 : обмен каждые 15 мин
@enduml`,
      mm: null, mmNote: 'Диаграммы развёртывания в Mermaid нет. Ближе всего бета-версия architecture-beta.',
      mistakes: ['Смешивают логические компоненты и физические серверы без разделения', 'Не подписывают протоколы и порты', 'Рисуют то, чего нет: схема развёртывания должна совпадать с реальностью'],
      ask: ['Зачем аналитику диаграмма развёртывания?', 'Через неё проверяют нефункциональные требования: где хранятся персональные данные, что будет при падении узла, какие доступы и каналы нужны внешним системам.'],
      tools: 'PlantUML, draw.io (наборы фигур облаков), Enterprise Architect.', stage: 'm3-comp'
    },
    {
      id: 'erd', group: 'data', freq: 'core', name: 'ERD — диаграмма «сущность — связь»', aka: 'Entity-Relationship Diagram, ER-диаграмма',
      std: 'Питер Чен, 1976 (нотация Чена); на практике чаще нотация «воронья лапка» (Джеймс Мартин, Information Engineering).',
      shows: 'Какие данные хранятся (сущности, будущие таблицы), какие у них атрибуты (поля, ключи) и как сущности связаны: один к одному, один ко многим, многие ко многим.',
      use: ['Спроектировать или описать базу данных', 'Договориться с разработчиками о модели данных до кода', 'Разобраться в чужой базе перед тем, как писать SQL'],
      avoid: [['Нужно понять, как данные движутся между системами', 'dfd'], ['Нужна модель предметной области с поведением', 'class']],
      readers: 'Разработчики бэкенда, администраторы баз данных, аналитики.',
      elems: [['Прямоугольник', 'Сущность (таблица) с атрибутами'], ['PK', 'Первичный ключ — уникальный номер строки'], ['FK', 'Внешний ключ — ссылка на строку другой таблицы'], ['Черта у линии', '«Один»'], ['Воронья лапка', '«Много»'], ['Кружок у линии', '«Может не быть» (необязательно)']],
      iskra: 'Таблицы базы «Искры»: client (клиент) — один ко многим — car (машина) — один ко многим — booking (запись). У одной машины много записей, у записи ровно одна машина: в booking есть внешний ключ car_id.',
      pic: () => svg(330, 160, ENT(8, 18, 92, 'client', ['id PK', 'phone', 'name']) + ENT(118, 18, 92, 'car', ['id PK', 'client_id FK', 'plate']) + ENT(228, 18, 96, 'booking', ['id PK', 'car_id FK', 'start_at', 'status']) + `<path d="M100 52 H118 M104 47 V57 M110 52 L118 46 M110 52 L118 58 M210 52 H228 M214 47 V57 M220 52 L228 46 M220 52 L228 58" class="xa-l"/>` + T(165, 140, 'одна машина — много записей; у записи одна машина', 's'), 'ERD: client, car, booking'),
      pu: `@startuml
hide circle
skinparam linetype ortho
entity "client" as client {
  * id : integer <<PK>>
  --
  phone : varchar(20)
  name : varchar(100)
}
entity "car" as car {
  * id : integer <<PK>>
  --
  client_id : integer <<FK>>
  plate : varchar(12)
}
entity "booking" as booking {
  * id : integer <<PK>>
  --
  car_id : integer <<FK>>
  start_at : datetime
  status : varchar(12)
}
client ||--o{ car
car ||--o{ booking
@enduml`, puNote: 'В PlantUML ERD рисуют сущностями entity с вороньими лапками (||--o{).',
      mm: `erDiagram
  client ||--o{ car : "владеет"
  car ||--o{ booking : "записана"
  client {
    int id PK
    string phone
    string name
  }
  car {
    int id PK
    int client_id FK
    string plate
  }
  booking {
    int id PK
    int car_id FK
    datetime start_at
    string status
  }`,
      mistakes: ['Связь «многие ко многим» без промежуточной таблицы — в реляционной базе так нельзя', 'Внешний ключ кладут не на ту сторону: на стороне «много» должен быть FK', 'Хранят списки в одном поле: «услуги: замена масла, шиномонтаж»'],
      ask: ['Как реализовать связь «многие ко многим»?', 'Промежуточной таблицей с двумя внешними ключами. В «Искре» запись и услуга связаны через booking_service: у записи много услуг, услуга бывает во многих записях.'],
      tools: 'dbdiagram.io (DBML), DBeaver, draw.io, PlantUML, Mermaid, ERwin.', stage: 'm4-erd'
    },
    {
      id: 'class', group: 'data', freq: 'often', name: 'UML Class — диаграмма классов', aka: 'Диаграмма классов, доменная модель',
      std: 'UML 2.5.1 (OMG), раздел Classification. Доменная модель — Эрик Эванс, «Предметно-ориентированное проектирование».',
      shows: 'Понятия (классы), их свойства (атрибуты), иногда действия (операции) и связи: ассоциация, наследование, композиция (часть не живёт без целого), агрегация, кратности «1», «0..*».',
      use: ['Модель предметной области: какие понятия есть в бизнесе и как связаны, ещё до базы данных', 'Объектно-ориентированное проектирование вместе с разработчиками', 'Описать структуру сложного запроса или ответа API'],
      avoid: [['Нужна именно схема таблиц базы', 'erd'], ['Нужно поведение во времени', 'sequence']],
      readers: 'Разработчики, архитекторы, аналитики.',
      elems: [['Прямоугольник из трёх частей', 'Имя класса, атрибуты, операции'], ['Стрелка с пустым треугольником', 'Наследование: «является»'], ['Закрашенный ромб', 'Композиция: часть не существует без целого'], ['Пустой ромб', 'Агрегация: часть может жить отдельно'], ['Числа у концов', 'Кратность: 1, 0..1, 1..*, 0..*']],
      iskra: 'Заказ-наряд состоит из строк работ (композиция: без заказ-наряда строка не нужна) и может иметь несколько платежей; у заказ-наряда есть номер, статус и операция «итого».',
      pic: () => svg(330, 170, CLS(10, 16, 132, 'Заказ-наряд', ['номер: String', 'статус: Статус'], ['итого(): Деньги']) + CLS(200, 16, 124, 'Строка работ', ['название: String', 'цена: Деньги'], []) + CLS(200, 110, 124, 'Платёж', ['сумма: Деньги'], []) + `<polygon points="142,46 152,41 162,46 152,51" class="xa-f"/>` + L('M162 46 L200 46', { noarrow: true }) + T(168, 40, '1', 's') + T(190, 40, '1..*', 's') + L('M76 104 L76 136 L200 136') + T(84, 118, '1', 's') + T(184, 130, '0..*', 's'), 'Диаграмма классов: композиция и ассоциация'),
      pu: `@startuml
class "Заказ-наряд" as WO {
  номер : String
  статус : Статус
  итого() : Деньги
}
class "Строка работ" as WL {
  название : String
  цена : Деньги
}
class "Платёж" as P {
  сумма : Деньги
}
WO "1" *-- "1..*" WL : состоит из
WO "1" --> "0..*" P : оплачивается
@enduml`,
      mm: `classDiagram
  class WorkOrder["Заказ-наряд"]
  class WorkLine["Строка работ"]
  class Payment["Платёж"]
  WorkOrder : +String number
  WorkOrder : +Status status
  WorkOrder : +total() Money
  WorkLine : +String name
  WorkLine : +Money price
  Payment : +Money amount
  WorkOrder "1" *-- "1..*" WorkLine : состоит из
  WorkOrder "1" --> "0..*" Payment : оплачивается`,
      mmNote: 'В Mermaid имя класса пишут латиницей, а русскую подпись — в квадратных скобках с кавычками.',
      mistakes: ['Рисуют таблицы с внешними ключами — это уже ERD, а не модель понятий', 'Путают композицию и агрегацию', 'Перегружают операциями: аналитику в доменной модели они обычно не нужны'],
      ask: ['Чем диаграмма классов отличается от ERD?', 'ERD — про хранение: таблицы, ключи, связи в базе. Диаграмма классов — про понятия и их поведение: есть наследование, композиция, операции. Одна доменная модель может храниться по-разному.'],
      tools: 'PlantUML, Mermaid, Enterprise Architect, StarUML, IntelliJ IDEA.', stage: 'm4-erd'
    },
    {
      id: 'gantt', group: 'plan', freq: 'often', name: 'Диаграмма Ганта', aka: 'Gantt chart, календарный план',
      std: 'Генри Гант, 1910-е. Стандарт де-факто для календарных планов.',
      shows: 'Работы на шкале времени: когда каждая начинается и заканчивается, что от чего зависит, где ключевые даты (вехи).',
      use: ['Показать план до релиза и зависимости работ', 'Оценить, успеваете ли к сроку, и что сдвинется при задержке', 'Обсудить сроки с руководителем проекта и заказчиком'],
      avoid: [['Нужно разложить истории по релизам без дат', 'storymap'], ['Нужен процесс, а не план', 'bpmn']],
      readers: 'Руководитель проекта, заказчик, команда.',
      elems: [['Полоса', 'Работа: начало и длительность'], ['Стрелка между полосами', 'Зависимость: следующая начнётся после предыдущей'], ['Ромб', 'Веха — важная дата без длительности'], ['Секции', 'Группы работ']],
      iskra: 'План до MVP 15 марта 2027: требования → запись на ТО → онлайн-оплата → пилот на двух станциях. С 1 апреля начинается сезон «переобувки», и поток записей вырастает в 3–4 раза — сдвигать нельзя.',
      pic: () => svg(330, 160, ['Требования', 'Запись на ТО', 'Онлайн-оплата', 'Пилот'].map((t, i) => T(8, 36 + i * 28, t, '', 'start')).join('') + ['янв', 'фев', 'мар'].map((m, i) => T(118 + i * 72, 16, m, 's') + `<path d="M${100 + i * 72} 20 V140" class="xa-l dash" style="stroke:var(--border)"/>`).join('') + R(100, 26, 36, 14, '', 'soft', 3) + R(136, 54, 76, 14, '', 'soft', 3) + R(212, 82, 34, 14, '', 'soft', 3) + D(250, 117, 14, 14, '', 'warn') + T(286, 121, '15 марта', 'acc') + L('M136 40 L136 54') + L('M212 68 L212 82'), 'Диаграмма Ганта до MVP'),
      pu: `@startgantt
Project starts 2027-01-11
[Требования] requires 14 days
[Запись на ТО] requires 30 days
[Запись на ТО] starts at [Требования]'s end
[Онлайн-оплата] requires 14 days
[Онлайн-оплата] starts at [Запись на ТО]'s end
[MVP] happens at [Онлайн-оплата]'s end
@endgantt`,
      mm: `gantt
  title Запуск «Искра Онлайн» к сезону
  dateFormat YYYY-MM-DD
  section Анализ
    Требования          :a1, 2027-01-11, 14d
  section Разработка
    Запись на ТО        :a2, after a1, 30d
    Онлайн-оплата       :a3, after a2, 14d
  section Запуск
    MVP                 :milestone, m1, after a3, 0d`,
      mistakes: ['Нет зависимостей — при сдвиге одной работы не видно, что поедет', 'Планируют без запаса, а потом срывают вехи', 'Слишком мелкие работы на несколько часов — план нельзя поддерживать'],
      ask: ['Что такое критический путь?', 'Самая длинная цепочка зависимых работ: задержка любой из них сдвигает весь срок. На неё смотрят в первую очередь.'],
      tools: 'MS Project, GanttPRO, Jira (временная шкала), Excel, Mermaid, PlantUML.'
    },
    {
      id: 'mindmap', group: 'plan', freq: 'often', name: 'Майнд-карта', aka: 'Интеллект-карта, mind map',
      std: 'Популяризировал Тони Бьюзен в 1970-е. Нотации нет.',
      shows: 'Тема в центре и ветки от неё: подтемы, вопросы, идеи. Помогает собрать и разложить мысли, не думая о порядке.',
      use: ['Подготовить вопросы к интервью по темам', 'Мозговой штурм с командой', 'Набросать структуру документа или требований'],
      avoid: [['Нужен порядок шагов', 'flowchart'], ['Нужно найти причины проблемы по категориям', 'fishbone']],
      readers: 'Вы сами и команда на встрече.',
      elems: [['Центр', 'Главная тема'], ['Ветки', 'Подтемы'], ['Листья', 'Конкретные вопросы и идеи']],
      iskra: 'Перед интервью с Мариной Олеговной: в центре «Вопросы к интервью», ветки — запись, приёмка, доп. работы, оплата, неявки; на ветках конкретные вопросы.',
      pic: () => svg(330, 170, E(165, 85, 58, 24, 'Вопросы\nк интервью', 'soft') + [[50, 30, 'Запись'], [280, 30, 'Доп. работы'], [50, 140, 'Оплата'], [280, 140, 'Неявки']].map(([x, y, t]) => L(`M165 85 Q${(165 + x) / 2} ${y} ${x} ${y}`, { noarrow: true }) + R(x - 36, y - 11, 72, 22, t, '', 11)).join('') + T(50, 60, 'сколько звонков\nтеряется?', 's') + T(280, 60, 'как согласуют\nсейчас?', 's'), 'Майнд-карта вопросов к интервью'),
      pu: `@startmindmap
* Вопросы к интервью
** Запись
*** Как записываются сейчас?
*** Сколько звонков теряется?
** Доп. работы
*** Как согласуют сейчас?
** Оплата
*** Сколько платят картой?
** Неявки
*** Что делают с неявками?
@endmindmap`,
      mm: `mindmap
  root((Вопросы к интервью))
    Запись
      Как записываются сейчас
      Сколько звонков теряется
    Доп. работы
      Как согласуют сейчас
    Оплата
      Сколько платят картой
    Неявки
      Что делают с неявками`,
      mmNote: 'В Mermaid ветки задаются отступами: сдвиньте строку — и она станет дочерней.',
      mistakes: ['Длинные предложения на ветках — карта перестаёт читаться', 'Выдают майнд-карту за требования — это черновик мыслей, а не документ'],
      ask: ['Как вы готовитесь к интервью с заказчиком?', 'Собираю цели встречи и вопросы по темам — удобно майнд-картой, — расставляю приоритеты, отправляю повестку заранее, после встречи — протокол с договорённостями.'],
      tools: 'XMind, Miro, MindMeister, Mermaid, PlantUML.', stage: 'm2-business'
    },
    {
      id: 'fishbone', group: 'plan', freq: 'often', name: 'Диаграмма Исикавы', aka: 'Причинно-следственная диаграмма, «рыбья кость», fishbone',
      std: 'Каору Исикава, 1960-е. Один из семи инструментов контроля качества.',
      shows: 'Проблему (голова рыбы) и возможные причины, разложенные по категориям (кости): люди, процесс, правила, техника, данные. Помогает искать корень проблемы, а не лечить симптом.',
      use: ['Разобрать проблему до того, как придумывать решение', 'Разбор инцидента вместе с командой', 'Показать бизнесу, что причин несколько и одна функция всё не решит'],
      avoid: [['Нужно просто собрать мысли без «проблема → причины»', 'mindmap'], ['Причины уже известны, нужен процесс', 'bpmn']],
      readers: 'Команда, бизнес-заказчик, руководство.',
      elems: [['Голова', 'Проблема — измеримо: «17 % неявок»'], ['Хребет', 'Стрелка к проблеме'], ['Кости', 'Категории причин'], ['Мелкие косточки', 'Конкретные причины']],
      iskra: 'Проблема — 17 % неявок. Клиент: забыл, передумал. Процесс: нет напоминания. Правила: отмена бесплатная, но без онлайна — только звонком. Канал записи: по телефону, без подтверждения.',
      pic: () => svg(330, 170, L('M10 85 L240 85', { c: 'acc' }) + R(244, 64, 80, 42, '17 %\nнеявок', 'bad', 6) + [[60, 'Клиент', 'забыл'], [160, 'Процесс', 'нет напоминания']].map(([x, t, c]) => L(`M${x} 22 L${x + 36} 85`, { c: 'bone', noarrow: true }) + T(x, 16, t, 'b') + T(x + 36, 50, c, 's', 'start')).join('') + [[60, 'Правила', 'отмена только звонком'], [160, 'Канал', 'запись по телефону']].map(([x, t, c]) => L(`M${x} 148 L${x + 36} 85`, { c: 'bone', noarrow: true }) + T(x, 162, t, 'b') + T(x + 34, 124, c, 's', 'start')).join(''), 'Диаграмма Исикавы для неявок'),
      pu: null, puNote: 'В PlantUML нет. Рисуют в Miro или draw.io.', mm: null, mmNote: 'В Mermaid нет. Подойдут Miro, draw.io или доска.',
      mistakes: ['Проблема сформулирована расплывчато: «клиенты недовольны» вместо измеримой', 'Записывают решения вместо причин: «сделать напоминание» — это решение', 'Останавливаются на первом уровне — помогает спросить «почему?» пять раз'],
      ask: ['Как найти корневую причину проблемы?', 'Сформулировать проблему с цифрой, разложить причины по категориям на диаграмме Исикавы, для главных спросить «почему?» несколько раз и подтвердить данными.'],
      tools: 'Miro, draw.io, Visio, доска.'
    }
  ];
  const byId = Object.fromEntries(DIAGRAMS.map(d => [d.id, d]));

  /* ---------- редкие и узкие ---------- */
  const RARE = [
    ['UML Object — диаграмма объектов', 'Снимок конкретных экземпляров в один момент: «заказ-наряд № 1042 со строками…». Пример данных к диаграмме классов.', 'PlantUML'],
    ['UML Package — диаграмма пакетов', 'Как модули сгруппированы и зависят друг от друга: слои приложения, крупные части кода.', 'PlantUML'],
    ['UML Communication — диаграмма коммуникаций', 'Те же сообщения, что в sequence, но акцент на связях между участниками; порядок задаётся номерами 1, 1.1, 2.', 'редко где рисуют'],
    ['UML Timing — временная диаграмма', 'Как меняются состояния участников по шкале времени: протоколы, встраиваемые системы, таймауты.', 'PlantUML'],
    ['UML Interaction Overview', 'Диаграмма деятельности, где каждый блок — маленькая sequence. Карта сложного взаимодействия.', 'редко'],
    ['UML Composite Structure', 'Внутреннее устройство класса или компонента: части и порты.', 'редко'],
    ['UML Profile', 'Расширение самого UML своими стереотипами, например «REST-ресурс».', 'архитекторы'],
    ['ArchiMate', 'Язык корпоративной архитектуры (The Open Group): бизнес, приложения и технологии на одной схеме. Инструмент — Archi.', 'PlantUML'],
    ['IDEF1X', 'Нотация моделей данных, родственница ERD. Встречается в ERwin и госпроектах.', 'ERwin'],
    ['IDEF3', 'Описание процессов и сценариев из семейства IDEF: порядок работ и связки.', 'Business Studio'],
    ['Кроссфункциональная блок-схема (swimlane)', 'Блок-схема с дорожками для участников. «BPMN-лайт» для быстрых набросков.', 'draw.io, PlantUML'],
    ['SIPOC', 'Таблица-схема: поставщики → входы → процесс → выходы → потребители. Lean и «шесть сигм».', 'таблица'],
    ['Value Stream Map — карта потока создания ценности', 'Lean: шаги процесса и время ожидания между ними. Хорошо показывает, где теряется время — как 1 ч 40 мин на подъёмнике в «Искре».', 'Miro'],
    ['Event Storming', 'Сессия со стикерами: события предметной области по времени, команды, правила. Быстрое совместное моделирование домена (DDD).', 'стена, Miro'],
    ['Wireframe — каркас экрана', 'Схема интерфейса без дизайна: блоки, поля, кнопки. PlantUML умеет простые каркасы (Salt).', 'Figma, PlantUML Salt'],
    ['Оргструктура (org chart)', 'Кто кому подчиняется. Аналитику нужна, чтобы найти всех заинтересованных лиц.', 'draw.io'],
    ['Матрица приоритетов (квадрант)', 'Две оси, например «ценность × трудоёмкость», и функции на поле. Помогает выбрать, что делать первым.', 'Mermaid quadrantChart'],
    ['Карта Уордли (Wardley map)', 'Стратегия: компоненты продукта по цепочке ценности и по зрелости — что покупать готовым, что делать самим.', 'onlinewardleymaps.com'],
    ['Диаграмма Сэнки (Sankey)', 'Потоки величин: например, сколько клиентов приходит из звонков, сайта и приложения и сколько доходит до оплаты.', 'Mermaid sankey'],
    ['Сетевая схема', 'Сети, подсети, межсетевые экраны, адреса. Нужна администраторам и безопасности.', 'PlantUML nwdiag, draw.io'],
    ['Структура JSON или YAML', 'Наглядная схема вложенности ответа API — удобно приложить к описанию метода.', 'PlantUML @startjson'],
    ['Git-граф', 'Ветки и слияния в репозитории: как команда ведёт разработку.', 'Mermaid gitGraph']
  ];
  const UML = {
    structure: [['Классов', 'class', true], ['Компонентов', 'component', true], ['Развёртывания', 'deployment', true], ['Объектов'], ['Пакетов'], ['Составной структуры'], ['Профилей']],
    behavior: [['Вариантов использования', 'usecase', true], ['Деятельности', 'activity', true], ['Состояний', 'state', true], ['Последовательности (взаимодействие)', 'sequence', true], ['Коммуникации (взаимодействие)'], ['Обзора взаимодействия'], ['Временная (взаимодействие)']]
  };

  /* ---------- подбор ---------- */
  const PICK = [
    { q: 'Как клиент проходит весь путь — от «надо переобуться» до «забрал машину», с эмоциями и болями', r: ['cjm'] },
    { q: 'Какие экраны проходит пользователь и куда ведёт каждая кнопка', r: ['userflow'] },
    { q: 'Как работают люди и отделы: кто, что и в каком порядке делает', sub: [
      { q: 'Для бизнеса: несколько участников, процесс «как есть» или «как будет»', r: ['bpmn'] },
      { q: 'Простое правило или алгоритм с условиями «да / нет»', r: ['flowchart'] },
      { q: 'Для ИТ-команды, с параллельными ветками, удобно держать кодом', r: ['activity'] }] },
    { q: 'Что пользователи вообще могут делать с системой — обзор функций', r: ['usecase'] },
    { q: 'Какие статусы бывают у объекта и как они меняются', r: ['state'] },
    { q: 'Правило с несколькими условиями: что делать в каждой комбинации', r: ['decision'] },
    { q: 'Как системы и сервисы обмениваются запросами шаг за шагом', r: ['sequence'] },
    { q: 'Из чего состоит система и с кем она связана', sub: [
      { q: 'Граница системы и все внешние участники — первый взгляд', r: ['context'] },
      { q: 'Крупные части: приложения, сервисы, базы — для всей команды', r: ['c4'] },
      { q: 'Модули и интерфейсы между ними — для разработчиков', r: ['component'] },
      { q: 'На каких серверах и устройствах всё запущено', r: ['deployment'] }] },
    { q: 'Какие данные хранятся и как связаны', sub: [
      { q: 'Таблицы будущей базы данных, ключи и связи', r: ['erd'] },
      { q: 'Понятия предметной области и связи между ними', r: ['class'] },
      { q: 'Откуда данные приходят, где лежат и куда уходят', r: ['dfd'] }] },
    { q: 'Разложить бэклог по пути пользователя и выбрать первый релиз', r: ['storymap'] },
    { q: 'План работ и сроки до релиза', r: ['gantt'] },
    { q: 'Собрать мысли, вопросы или идеи', r: ['mindmap'] },
    { q: 'Найти причины проблемы, прежде чем её решать', r: ['fishbone'] }
  ];

  /* ---------- самопроверка ---------- */
  const QUIZ = [
    { q: 'Глеб спрашивает, в каком порядке приложение, платёжный сервис и ЮKassa обмениваются запросами при оплате и что будет, если банк откажет.', a: 'sequence', o: ['sequence', 'component', 'bpmn', 'erd'], why: 'Порядок запросов между системами во времени и ветка ошибки — ровно то, что показывает sequence.' },
    { q: 'Марина Олеговна хочет обсудить, как сейчас проходит приёмка машины: что делает мастер-приёмщик, что механик, что кладовщица.', a: 'bpmn', o: ['bpmn', 'sequence', 'usecase', 'state'], why: 'Несколько людей, каждый в своей роли, и порядок работ — бизнес-процесс. Это BPMN с дорожками.' },
    { q: 'Тестировщик спрашивает: может ли запись из «Неявки» вернуться в «Подтверждена»?', a: 'state', o: ['state', 'flowchart', 'erd', 'c4'], why: 'Вопрос о разрешённых переходах между статусами одного объекта — диаграмма состояний.' },
    { q: 'Тимур Рашидович хочет понять, где клиенты больше всего нервничают за весь визит, включая звонки и ожидание.', a: 'cjm', o: ['cjm', 'userflow', 'bpmn', 'gantt'], why: 'Весь путь клиента с эмоциями, в том числе вне приложения, — это CJM. User flow показал бы только экраны.' },
    { q: 'Новый разработчик спрашивает, из каких крупных частей состоит «Искра Онлайн»: приложения, сервисы, базы, внешние системы.', a: 'c4', o: ['c4', 'deployment', 'class', 'cjm'], why: 'Крупные части системы для всей команды — уровень контейнеров C4. Серверы показала бы диаграмма развёртывания, а это другой вопрос.' },
    { q: 'Нужно описать таблицы client, car и booking, их ключи и связи для разработчика базы данных.', a: 'erd', o: ['erd', 'dfd', 'class', 'mindmap'], why: 'Таблицы, первичные и внешние ключи, «один ко многим» — ERD.' },
    { q: 'Правило BR-9: корпоративный клиент или нет, сумма в пределах лимита или нет — кто согласует доп. работы. Нужно проверить, что учтены все комбинации.', a: 'decision', o: ['decision', 'state', 'sequence', 'usecase'], why: 'Несколько условий и их комбинации удобнее всего проверять таблицей решений: пустая клетка — пропущенный случай.' },
    { q: 'Артём просит показать план до MVP 15 марта и что сдвинется, если запись на ТО задержится на неделю.', a: 'gantt', o: ['gantt', 'storymap', 'bpmn', 'c4'], why: 'Работы на шкале времени и зависимости между ними — диаграмма Ганта.' },
    { q: 'Неявок 17 %. Прежде чем придумывать решение, Вера просит разобрать, откуда они берутся.', a: 'fishbone', o: ['fishbone', 'mindmap', 'cjm', 'state'], why: 'Проблема с цифрой и поиск причин по категориям — диаграмма Исикавы.' },
    { q: 'Даша спрашивает, какие экраны будут при записи и что увидит клиент, если выбранное время уже заняли.', a: 'userflow', o: ['userflow', 'cjm', 'sequence', 'usecase'], why: 'Экраны, переходы и ветка «время заняли» внутри приложения — user flow.' },
    { q: 'Безопасность хочет знать, где физически будут лежать данные клиентов и какие серверы общаются с 1С в офисе.', a: 'deployment', o: ['deployment', 'component', 'context', 'erd'], why: 'Серверы, облако, офисный сервер и каналы между ними — диаграмма развёртывания.' },
    { q: 'На первой встрече нужно за минуту показать, что входит в проект, а что — внешние системы: ЮKassa, SMS, 1С.', a: 'context', o: ['context', 'c4', 'sequence', 'bpmn'], why: 'Система одной коробкой и всё её окружение — контекстная диаграмма. Это и первый уровень C4.' }
  ];

  /* ---------- общие кусочки ---------- */
  const nameOf = id => (byId[id] ? byId[id].name : id);
  const shortName = id => nameOf(id).split(' — ')[0];
  const groupOf = id => GROUPS.find(g => g.id === id);
  const support = code => code ? '<span class="xa-yes">есть</span>' : '<span class="xa-no">нет</span>';

  function copyText(text) {
    const done = () => ui.toast('Код скопирован — вставьте его в редактор', 'ok');
    try { if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(text).then(done, () => fallback()); return; } } catch (e) { }
    fallback();
    function fallback() {
      const ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); done(); } catch (e) { ui.toast('Не получилось скопировать: выделите код и нажмите Ctrl+C', 'warn'); }
      ta.remove();
    }
  }

  /* ---------- вкладка «С чего начать» ---------- */
  function tabStart(box, nav) {
    box.innerHTML = `<div class="xa-root">
      ${ui.simple({ icon: '📐', title: 'Простыми словами', plain: 'Диаграмма — это картинка, которая отвечает на один вопрос о системе быстрее, чем страница текста. «Кто что делает?», «В каком порядке системы общаются?», «Какие статусы бывают у записи?» — на каждый вопрос своя диаграмма.', analogy: 'В автосервисе у одной машины есть схема электрики, схема тормозов и карта техобслуживания. Это одна и та же машина, но каждая схема показывает свой срез, и электрик не ищет провода на схеме тормозов. С системой так же: не бывает одной диаграммы «про всё».', tech: 'Диаграмма — модель: она нарочно упрощает систему и показывает только то, что нужно читателю. Правила рисования задаёт нотация (BPMN, UML), а нарисовать можно в графическом редакторе или кодом (PlantUML, Mermaid).' })}
      <div class="xa-sec"><h4>Три вопроса перед любой диаграммой</h4>
        <div class="xa-grid">
          <div class="xa-card"><div class="xa-ic">❓</div><h4>Что я хочу показать?</h4><p class="small">Путь человека, процесс, порядок запросов, состав системы, данные, статусы? От ответа зависит тип диаграммы.</p></div>
          <div class="xa-card"><div class="xa-ic">👀</div><h4>Кто будет читать?</h4><p class="small">Владельцу бизнеса — CJM и BPMN верхнего уровня. Разработчику — sequence, ERD, компоненты. Не рисуйте для разработчика то, что нужно заказчику, и наоборот.</p></div>
          <div class="xa-card"><div class="xa-ic">🔍</div><h4>Насколько подробно?</h4><p class="small">Один уровень детализации на одной схеме. Если элементов больше 15–20, разбейте на несколько диаграмм или сделайте общую плюс подробные.</p></div>
        </div></div>
      <div class="xa-sec"><h4>Что хотите показать? Нажмите — откроются подходящие диаграммы</h4>
        <div class="xa-grid">${GROUPS.map(g => `<button type="button" class="xa-card" data-xa-group="${g.id}"><div class="xa-ic">${g.ic}</div><h4>${esc(g.t)}</h4><p class="small">${esc(g.q)}</p><p class="small">${DIAGRAMS.filter(d => d.group === g.id).map(d => esc(shortName(d.id))).join(' · ')}</p></button>`).join('')}</div></div>
      <div class="xa-sec"><h4>Нотация, инструмент и код — три разные вещи</h4>
        <div class="xa-scroll"><table class="xa-tbl"><thead><tr><th>Что это</th><th>Простыми словами</th><th>Примеры</th></tr></thead><tbody>
          <tr><td><b>Нотация</b></td><td>Язык правил: какая фигура что значит. Как правила дорожного движения — одинаковы в любом городе.</td><td>BPMN, UML, C4, IDEF0, нотация Чена для ERD</td></tr>
          <tr><td><b>Графический редактор</b></td><td>Программа, где фигуры рисуют мышкой.</td><td>draw.io (diagrams.net), Miro, Figma, Visio, Camunda Modeler</td></tr>
          <tr><td><b>Диаграмма как код</b></td><td>Вы пишете текст, программа сама рисует картинку. Текст хранят в git рядом с документацией.</td><td>PlantUML, Mermaid, Structurizr DSL, DBML</td></tr>
        </tbody></table></div>
        <p class="small dim">Одну и ту же диаграмму последовательности можно нарисовать в draw.io мышкой или написать кодом в PlantUML: нотация одна — UML, инструменты разные.</p></div>
      <div class="xa-sec"><h4>Как работать с диаграммой: семь шагов</h4>
        <div class="xa-steps">
          <div class="xa-step"><div><b>Сформулируйте вопрос и читателя</b>«Показать Глебу, что происходит при отказе банка» — уже половина работы.</div></div>
          <div class="xa-step"><div><b>Выберите тип диаграммы</b>По вопросу, а не по привычке. Не уверены — вкладка «Подобрать».</div></div>
          <div class="xa-step"><div><b>Набросайте от руки или на доске</b>Пять минут на бумаге экономят час перетаскивания стрелок.</div></div>
          <div class="xa-step"><div><b>Нарисуйте начисто</b>В редакторе или кодом. Одна диаграмма — один уровень подробности.</div></div>
          <div class="xa-step"><div><b>Проверьте по чек-листу</b>Название, подписи на всех стрелках, понятные имена, легенда, ничего лишнего.</div></div>
          <div class="xa-step"><div><b>Покажите читателю и спросите, что он понял</b>Если пересказ не совпал с задумкой — диаграмма, а не читатель, требует доработки.</div></div>
          <div class="xa-step"><div><b>Держите диаграмму рядом с требованиями и обновляйте</b>Устаревшая схема хуже, чем никакая: ей верят. Поэтому диаграммы кодом удобно хранить в git и менять вместе с текстом.</div></div>
        </div></div>
      <div class="xa-two">
        <div class="xa-sec"><h4>Чек-лист хорошей диаграммы</h4><ul class="xa-ul">
          <li>Есть название: что за схема и о чём</li><li>Понятно без автора: читатель не должен спрашивать «а что это за стрелка?»</li><li>На стрелках есть подписи — глагол или данные</li><li>Один уровень подробности</li><li>Не больше 15–20 элементов</li><li>Имена такие же, как в требованиях и глоссарии</li><li>Есть легенда, если используете цвета или свои значки</li><li>Указаны дата или версия</li></ul></div>
        <div class="xa-sec"><h4>Где живут диаграммы</h4><ul class="xa-ul">
          <li>В функциональных требованиях и техническом задании — рядом с текстом, который поясняют</li><li>В Confluence или вики проекта</li><li>В git рядом с кодом — если они нарисованы кодом</li><li>В задаче в Jira — для конкретной доработки</li><li>На доске Miro — пока идёт обсуждение</li></ul></div>
      </div>
      ${ui.note('info', 'Сколько диаграмм нужно знать новичку', 'Для старта хватит девяти: CJM, user flow, блок-схема, BPMN, use case, диаграмма состояний, sequence, C4 (или компоненты) и ERD. Они помечены оранжевой точкой в каталоге. Остальные — когда встретите их в проекте.')}
    </div>`;
    TR.on(box, 'click', '[data-xa-group]', (e, b) => nav.catalog({ group: b.dataset.xaGroup }));
  }

  /* ---------- вкладка «Все диаграммы» ---------- */
  // lang — какой код показывать; pinned — ученик сам выбрал язык в этой карточке: тогда показываем его,
  // даже если кода нет (с пояснением почему), а не подменяем молча другим языком
  const cat = { group: 'all', coreOnly: false, sel: 'sequence', lang: 'pu', pinned: false };
  const langOf = d => cat.pinned ? cat.lang : ((cat.lang === 'pu' ? d.pu : d.mm) ? cat.lang : (d.pu ? 'pu' : d.mm ? 'mm' : cat.lang));
  function detailHTML(d) {
    const g = groupOf(d.group), L2 = d.stage ? TR.lesson(d.stage) : null;
    const codeOf = lang => lang === 'pu' ? d.pu : d.mm;
    const lang = langOf(d);
    const code = codeOf(lang), note = lang === 'pu' ? d.puNote : d.mmNote;
    const editor = lang === 'pu' ? ['https://www.plantuml.com/plantuml/uml/', 'Открыть редактор PlantUML'] : ['https://mermaid.live/edit', 'Открыть Mermaid Live'];
    return `<div class="xa-head"><div class="xa-badges"><span class="xa-badge">${g.ic} ${esc(g.t)}</span><span class="xa-badge ${d.freq}">${esc(FREQ[d.freq])}</span></div>
        <h3>${esc(d.name)}</h3><div class="small dim">${esc(d.aka)}</div><div class="small dim">${esc(d.std)}</div></div>
      <div class="xa-pic">${d.pic()}</div>
      <div class="xa-sec"><h4>Что показывает</h4><p>${esc(d.shows)}</p></div>
      <div class="xa-two">
        <div class="xa-sec"><h4>✅ Когда брать</h4><ul class="xa-ul">${d.use.map(u => `<li>${esc(u)}</li>`).join('')}</ul></div>
        <div class="xa-sec"><h4>⛔ Когда не подходит</h4><ul class="xa-ul">${d.avoid.map(([t, alt]) => `<li>${esc(t)} → <button type="button" class="xa-alt" data-xa-sel="${alt}">${esc(shortName(alt))}</button></li>`).join('')}</ul></div>
      </div>
      <div class="xa-sec"><h4>Кто читает</h4><p>${esc(d.readers)}</p></div>
      <div class="xa-sec"><h4>Как читать</h4><div class="xa-elem">${d.elems.map(([k, v]) => `<b>${esc(k)}</b><span>${esc(v)}</span>`).join('')}</div></div>
      ${ui.note('', 'Пример на «Искре»', esc(d.iskra))}
      <div class="xa-sec"><h4>Код этой диаграммы</h4>
        <div class="xa-codebar">${ui.seg('xa-lang', [{ v: 'pu', t: `PlantUML ${d.pu ? '✓' : '✗'}` }, { v: 'mm', t: `Mermaid ${d.mm ? '✓' : '✗'}` }], lang)}<span class="grow"></span>
          ${code ? `<button type="button" class="btn sm" data-xa-copy>📋 Копировать</button><a class="btn sm ghost" href="${editor[0]}" target="_blank" rel="noopener">${editor[1]} ↗</a>` : ''}</div>
        ${code ? ui.code(code, 'text') + (note ? `<p class="small dim">${esc(note)}</p>` : '') : ui.note('warn', `В ${lang === 'pu' ? 'PlantUML' : 'Mermaid'} этой диаграммы нет`, esc(note || '') + ((lang === 'pu' ? d.mm : d.pu) ? ` Код есть на вкладке ${lang === 'pu' ? 'Mermaid' : 'PlantUML'}.` : ''))}
        ${code ? '<p class="small dim">Скопируйте код, откройте редактор и вставьте — картинка нарисуется сама. Поменяйте подпись или добавьте шаг и посмотрите, что изменится.</p>' : ''}</div>
      <div class="xa-sec"><h4>Частые ошибки</h4><ul class="xa-ul">${d.mistakes.map(m => `<li>${esc(m)}</li>`).join('')}</ul></div>
      <details><summary>На собеседовании спросят: ${esc(d.ask[0])}</summary><div>${esc(d.ask[1])}</div></details>
      <div class="xa-sec"><h4>Где рисовать</h4><p>${esc(d.tools)}</p></div>
      ${L2 ? `<div><button type="button" class="btn primary sm" data-xa-stage="${d.stage}">Потренироваться: ${esc(TR.lessonLabel(d.stage))} — ${esc(L2.title)} →</button></div>` : ''}
      ${d.sys ? `<div><button type="button" class="btn primary sm" data-xa-sys="${d.sys}">Посмотреть все статусы «Искры» в разделе «Система» →</button></div>` : ''}`;
  }
  function tabCatalog(box, nav) {
    function list() {
      const shown = DIAGRAMS.filter(d => (cat.group === 'all' || d.group === cat.group) && (!cat.coreOnly || d.freq === 'core'));
      if (!shown.some(d => d.id === cat.sel) && shown.length) cat.sel = shown[0].id;
      return `<div class="xa-filters" role="group" aria-label="Группы диаграмм"><button type="button" class="chip" data-xa-g="all" aria-pressed="${cat.group === 'all'}">Все</button>${GROUPS.map(g => `<button type="button" class="chip" data-xa-g="${g.id}" aria-pressed="${cat.group === g.id}">${g.ic} ${esc(g.t)}</button>`).join('')}</div>
        <button type="button" class="chip" data-xa-core aria-pressed="${cat.coreOnly}">● Только самые нужные</button>
        ${GROUPS.filter(g => shown.some(d => d.group === g.id)).map(g => `<div class="xa-gr"><h5>${g.ic} ${esc(g.t)}</h5>${shown.filter(d => d.group === g.id).map(d => `<button type="button" class="xa-it" data-xa-sel="${d.id}" aria-pressed="${d.id === cat.sel}"><span>${esc(shortName(d.id))}<small>${esc(d.aka)}</small></span><span class="xa-dot ${d.freq}" title="${esc(FREQ[d.freq])}"></span></button>`).join('')}</div>`).join('')}
        <p class="small dim"><span class="xa-dot core" style="display:inline-block"></span> нужна в каждом проекте · <span class="xa-dot often" style="display:inline-block"></span> встречается часто · <span class="xa-dot" style="display:inline-block"></span> в отдельных компаниях</p>`;
    }
    function draw(scroll) {
      box.innerHTML = `<div class="xa-root"><div class="xa-cat"><aside class="xa-list">${list()}</aside><section class="xa-det" aria-live="polite">${detailHTML(byId[cat.sel])}</section></div>
        <div class="xa-sec"><h4>Ещё встретите</h4><p class="small dim">Эти диаграммы нужны реже или в отдельных компаниях. Достаточно знать, что они есть и для чего.</p>
          <div class="xa-scroll"><table class="xa-tbl"><thead><tr><th>Диаграмма</th><th>Что показывает</th><th>Где рисуют</th></tr></thead><tbody>${RARE.map(r => `<tr><td><b>${esc(r[0])}</b></td><td>${esc(r[1])}</td><td>${esc(r[2])}</td></tr>`).join('')}</tbody></table></div></div>
        <div class="xa-sec"><h4>Все 14 диаграмм UML</h4><p class="small dim">UML 2.5 (Unified Modeling Language — унифицированный язык моделирования) — это не одна диаграмма, а семейство из 14. Аналитику обычно хватает семи, отмеченных ★.</p>
          <div class="xa-uml"><div class="xa-card"><h4>Структурные: из чего состоит</h4><ul>${UML.structure.map(u => `<li>${u[2] ? '★ ' : ''}${u[1] ? `<button type="button" class="xa-alt" data-xa-sel="${u[1]}">${esc(u[0])}</button>` : esc(u[0])}</li>`).join('')}</ul></div>
          <div class="xa-card"><h4>Поведенческие: как работает</h4><ul>${UML.behavior.map(u => `<li>${u[2] ? '★ ' : ''}${u[1] ? `<button type="button" class="xa-alt" data-xa-sel="${u[1]}">${esc(u[0])}</button>` : esc(u[0])}</li>`).join('')}</ul></div></div></div></div>`;
      if (scroll) { const det = TR.$('.xa-det', box); if (det && window.matchMedia('(max-width: 860px)').matches) det.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    }
    TR.on(box, 'click', '[data-xa-g]', (e, b) => { cat.group = b.dataset.xaG; draw(); });
    TR.on(box, 'click', '[data-xa-core]', () => { cat.coreOnly = !cat.coreOnly; draw(); });
    TR.on(box, 'click', '[data-xa-sel]', (e, b) => { cat.sel = b.dataset.xaSel; if (!byId[cat.sel]) return; const d = byId[cat.sel]; cat.pinned = false; if (cat.group !== 'all' && d.group !== cat.group) cat.group = 'all'; if (cat.coreOnly && d.freq !== 'core') cat.coreOnly = false; draw(true); });
    TR.on(box, 'click', '[data-seg="xa-lang"] button', (e, b) => { cat.lang = b.dataset.v; cat.pinned = true; draw(); });
    TR.on(box, 'click', '[data-xa-copy]', () => { const d = byId[cat.sel], code = langOf(d) === 'pu' ? d.pu : d.mm; if (code) copyText(code); });
    TR.on(box, 'click', '[data-xa-stage]', (e, b) => nav.stage(b.dataset.xaStage));
    TR.on(box, 'click', '[data-xa-sys]', (e, b) => nav.system(b.dataset.xaSys));
    draw();
  }

  /* ---------- вкладка «PlantUML и Mermaid» ---------- */
  const SAMPLE = {
    pu: `@startuml
actor "Клиент" as U
participant "Приложение" as App
participant "Сервис записи" as Book
U -> App : Выбираю время 10:30
App -> Book : POST /bookings
Book --> App : 201 Created
App --> U : «Вы записаны на 10:30»
@enduml`,
    mm: `sequenceDiagram
  actor U as Клиент
  participant App as Приложение
  participant Book as Сервис записи
  U->>App: Выбираю время 10:30
  App->>Book: POST /bookings
  Book-->>App: 201 Created
  App-->>U: «Вы записаны на 10:30»`
  };
  // Разбор маленького подмножества sequence-диаграмм PlantUML и Mermaid — для живой песочницы
  function parseSeq(src) {
    const lanes = [], steps = [], msgs = [], ID = '[A-Za-z0-9_А-Яа-яЁё]+';
    const lane = (id, t) => { let l = lanes.find(x => x.id === id); if (!l) { l = { id, t: t || id }; lanes.push(l); } else if (t) l.t = t; return l; };
    String(src).split('\n').forEach((raw, i) => {
      const s = raw.trim(), n = i + 1;
      if (!s || s.startsWith("'") || s.startsWith('%%')) return;
      if (/^@(start|end)uml\b/i.test(s) || /^sequenceDiagram$/i.test(s)) return;
      let m;
      if ((m = s.match(new RegExp(`^(participant|actor|database|boundary|control|entity|collections|queue)\\s+"([^"]+)"\\s+as\\s+(${ID})$`, 'i')))) { lane(m[3], m[2]); return; }
      if ((m = s.match(new RegExp(`^(participant|actor)\\s+(${ID})\\s+as\\s+(.+)$`, 'i')))) { lane(m[2], m[3].replace(/^"|"$/g, '').trim()); return; }
      if ((m = s.match(new RegExp(`^(participant|actor|database)\\s+(${ID})$`, 'i')))) { lane(m[2]); return; }
      if ((m = s.match(new RegExp(`^(${ID})\\s*(-->>|->>|-->|->)\\s*(${ID})\\s*(?::\\s*(.*))?$`)))) {
        if (lanes.length >= 6 && !lanes.some(l => l.id === m[1]) ) { msgs.push({ n, kind: 'warn', t: 'Песочница рисует до шести участников — остальных пропускаю.' }); return; }
        lane(m[1]); lane(m[3]);
        const label = (m[4] || '').trim();
        steps.push({ from: m[1], to: m[3], t: label || '(без подписи)', reply: m[2].startsWith('--') });
        if (!label) msgs.push({ n, kind: 'warn', t: 'У стрелки нет подписи. После двоеточия напишите, что передаётся.' });
        return;
      }
      if (/^(alt|else|opt|loop|end|note|activate|deactivate|autonumber|title|group|break|par|rect)\b/i.test(s)) { msgs.push({ n, kind: 'warn', t: `«${s.split(/\s/)[0]}» песочница не рисует. Настоящие PlantUML и Mermaid его понимают.` }); return; }
      if (/^[A-Za-z0-9_А-Яа-яЁё]+\s*(=>|→|- >)\s*/.test(s)) { msgs.push({ n, kind: 'bad', t: 'Стрелку пишут дефисом и знаком «больше»: -> (запрос) или --> (ответ).' }); return; }
      if (/\s->|->\s|-->/.test(s) && /"/.test(s.split(':')[0])) { msgs.push({ n, kind: 'bad', t: 'В стрелке используйте короткие имена (алиасы) без кавычек: U -> App : текст. Длинное имя задают в строке participant "…" as App.' }); return; }
      msgs.push({ n, kind: 'bad', t: 'Строку не удалось разобрать. Стрелка выглядит так: Клиент -> Приложение : текст' });
    });
    return { lanes, steps, msgs };
  }
  function tabCode(box) {
    let lang = 'pu', text = SAMPLE.pu;
    const COMPARE = [
      ['Что это', 'Язык описания диаграмм, рисует сервер или программа на Java', 'Язык описания диаграмм на JavaScript, рисует прямо в браузере'],
      ['Первая строка', '@startuml … @enduml (для Ганта и майнд-карт — @startgantt, @startmindmap)', 'Тип диаграммы: sequenceDiagram, flowchart, erDiagram…'],
      ['Сколько умеет', 'Почти весь UML, C4 (через библиотеку), ERD, Гант, майнд-карты, ArchiMate, каркасы экранов', 'Блок-схемы, sequence, классы, состояния, ERD, Гант, майнд-карты, journey; C4 — экспериментально'],
      ['Где рисуется сразу', 'plantuml.com, плагины для Confluence, VS Code, IntelliJ IDEA', 'mermaid.live; встроен в GitLab, GitHub, Notion, Obsidian — пишете блок ```mermaid в Markdown'],
      ['Плюсы', 'Строгий UML, много типов диаграмм, тонкая настройка', 'Ничего не нужно устанавливать, работает в документации из коробки'],
      ['Минусы', 'Нужен сервер или Java; раскладку не подвинуть руками', 'Меньше типов, нет use case, BPMN и развёртывания; раскладка тоже автоматическая']
    ];
    function sandbox() {
      const res = parseSeq(text), out = TR.$('.xa-out', box), msgEl = TR.$('.xa-msgs', box);
      const msgs = res.msgs.slice();
      if (!res.steps.length) msgs.unshift({ n: 0, kind: 'bad', t: 'Пока нет ни одной стрелки — нарисовать нечего.' });
      else if (!msgs.some(x => x.kind === 'bad')) msgs.unshift({ n: 0, kind: 'ok', t: `Готово: участников — ${res.lanes.length}, сообщений — ${res.steps.length}.` });
      msgEl.innerHTML = msgs.map(x => `<div class="xa-msg ${x.kind === 'bad' ? '' : x.kind}">${x.n ? `Строка ${x.n}: ` : ''}${esc(x.t)}</div>`).join('');
      if (res.steps.length) { out.innerHTML = '<div></div>'; ui.seq(out.firstChild, { lanes: res.lanes, steps: res.steps, controls: false, start: 'all', laneW: 150, title: 'Ваша диаграмма' }); }
      else out.innerHTML = '<p class="small dim" style="padding:12px">Здесь появится диаграмма.</p>';
    }
    box.innerHTML = `<div class="xa-root">
      ${ui.simple({ icon: '⌨️', title: 'Диаграмма как код — простыми словами', plain: 'Вместо того чтобы двигать фигуры мышкой, вы пишете короткий текст: «Клиент отправляет запрос приложению». Программа сама превращает текст в картинку и сама раскладывает фигуры.', analogy: 'Как сообщение и печатный бланк: вы пишете только суть, а оформление делает принтер. Захотели поменять шаг — поправили одну строку, а не перерисовали полсхемы.', tech: 'PlantUML и Mermaid — текстовые языки описания диаграмм. Текст хранят в git вместе с документацией: видно, кто и что поменял, изменения проходят ревью, а схема не расходится с требованиями.' })}
      <div class="xa-sec"><h4>Живая песочница: sequence-диаграмма</h4>
        <p class="small dim">Поменяйте текст слева — диаграмма справа перерисуется. Песочница понимает участников и стрелки; полный язык — в настоящих редакторах.</p>
        <div class="xa-codebar">${ui.seg('xa-sb', [{ v: 'pu', t: 'PlantUML' }, { v: 'mm', t: 'Mermaid' }], lang)}<span class="grow"></span><button type="button" class="btn sm ghost" data-xa-reset>⟲ Вернуть пример</button></div>
        <div class="xa-sand"><div class="stack"><textarea spellcheck="false" aria-label="Код диаграммы"></textarea><div class="xa-msgs" aria-live="polite"></div></div><div class="xa-out"></div></div>
        <div class="xa-card"><h4>Попробуйте сами</h4><ul class="xa-ul">
          <li>Добавьте участника: <code>participant "ЮKassa" as YK</code> (в Mermaid — <code>participant YK as ЮKassa</code>) и стрелку к нему</li>
          <li>Сделайте ответ пунктиром: в PlantUML <code>--></code>, в Mermaid <code>-->></code></li>
          <li>Уберите подпись у стрелки и посмотрите на подсказку</li>
          <li>Переключитесь на Mermaid: та же диаграмма, другой синтаксис</li></ul></div></div>
      <div class="xa-sec"><h4>PlantUML и Mermaid: сравнение</h4>
        <div class="xa-scroll"><table class="xa-tbl"><thead><tr><th></th><th>PlantUML</th><th>Mermaid</th></tr></thead><tbody>${COMPARE.map(r => `<tr><td><b>${esc(r[0])}</b></td><td>${esc(r[1])}</td><td>${esc(r[2])}</td></tr>`).join('')}</tbody></table></div></div>
      <div class="xa-two">
        <div class="xa-sec"><h4>Как начать с PlantUML за пять минут</h4><ul class="xa-ul">
          <li>Откройте <a href="https://www.plantuml.com/plantuml/uml/" target="_blank" rel="noopener">plantuml.com/plantuml</a> — онлайн-редактор, ничего ставить не нужно</li>
          <li>Вставьте код из любой карточки каталога и нажмите Submit</li>
          <li>Для работы: расширение PlantUML в VS Code или плагин в IntelliJ IDEA, макрос PlantUML в Confluence</li>
          <li>Документация на русском: plantuml.com/ru</li></ul></div>
        <div class="xa-sec"><h4>Как начать с Mermaid за пять минут</h4><ul class="xa-ul">
          <li>Откройте <a href="https://mermaid.live/edit" target="_blank" rel="noopener">mermaid.live</a> — редактор с картинкой справа</li>
          <li>В GitLab, GitHub, Notion и Obsidian просто напишите в Markdown блок <code>\`\`\`mermaid</code> — схема нарисуется сама</li>
          <li>В VS Code — расширение для предпросмотра Markdown с Mermaid</li>
          <li>Документация: mermaid.js.org</li></ul></div>
      </div>
      <div class="xa-sec"><h4>Шпаргалка по синтаксису</h4>
        <div class="xa-scroll"><table class="xa-tbl"><thead><tr><th>Что нужно</th><th>PlantUML</th><th>Mermaid</th></tr></thead><tbody>
          <tr><td>Начало и конец</td><td><code>@startuml</code> … <code>@enduml</code></td><td>Первая строка — тип: <code>sequenceDiagram</code></td></tr>
          <tr><td>Участник с русским именем</td><td><code>participant "Платёжный сервис" as Pay</code></td><td><code>participant Pay as Платёжный сервис</code></td></tr>
          <tr><td>Запрос</td><td><code>App -> Pay : POST /payments</code></td><td><code>App->>Pay: POST /payments</code></td></tr>
          <tr><td>Ответ пунктиром</td><td><code>Pay --> App : 201</code></td><td><code>Pay-->>App: 201</code></td></tr>
          <tr><td>Ветка «если»</td><td><code>alt успех</code> … <code>else ошибка</code> … <code>end</code></td><td>так же: <code>alt</code> … <code>else</code> … <code>end</code></td></tr>
          <tr><td>Комментарий</td><td><code>' это комментарий</code></td><td><code>%% это комментарий</code></td></tr>
          <tr><td>Блок-схема</td><td>диаграмма деятельности: <code>start</code>, <code>:шаг;</code>, <code>if (…) then</code></td><td><code>flowchart TD</code>, <code>A[шаг] --> B{вопрос?}</code></td></tr>
        </tbody></table></div></div>
      <div class="xa-sec"><h4>Какие диаграммы умеют</h4>
        <div class="xa-scroll"><table class="xa-tbl"><thead><tr><th>Диаграмма</th><th>PlantUML</th><th>Mermaid</th></tr></thead><tbody>${DIAGRAMS.map(d => `<tr><td><button type="button" class="xa-alt" data-xa-sel="${d.id}">${esc(shortName(d.id))}</button></td><td>${support(d.pu)}</td><td>${d.mm && d.mmNote && /упрощ|экспер|блок-схем/i.test(d.mmNote) ? '<span class="xa-mid">частично</span>' : support(d.mm)}</td></tr>`).join('')}</tbody></table></div>
        <p class="small dim">«Частично» — Mermaid рисует похожую схему другим типом диаграммы или в упрощённом виде.</p></div>
      ${ui.note('warn', 'Частые ошибки новичков', '<ul class="xa-ul"><li>Забыли <code>@enduml</code> — PlantUML ничего не нарисует</li><li>Русские буквы в идентификаторах Mermaid — пишите идентификатор латиницей, а русское имя в подписи</li><li>Двоеточие, скобки или кавычки в подписи ломают разбор — возьмите подпись в кавычки</li><li>В Mermaid отступы в майнд-карте значат вложенность: лишний пробел переносит ветку</li><li>Ждут, что раскладку можно подвинуть мышкой, — нет, её задаёт программа; порядок строк влияет на расположение</li></ul>')}
    </div>`;
    const ta = TR.$('textarea', box);
    ta.value = text;
    ta.addEventListener('input', () => { text = ta.value; sandbox(); });
    TR.on(box, 'click', '[data-seg="xa-sb"] button', (e, b) => { lang = b.dataset.v; text = SAMPLE[lang]; ta.value = text; TR.$$('[data-seg="xa-sb"] button', box).forEach(x => x.setAttribute('aria-pressed', String(x.dataset.v === lang))); sandbox(); });
    TR.on(box, 'click', '[data-xa-reset]', () => { text = SAMPLE[lang]; ta.value = text; sandbox(); });
    sandbox();
  }

  /* ---------- вкладка «Подобрать» ---------- */
  function tabPick(box, nav) {
    let path = [];
    function draw() {
      let level = PICK, chosen = null;
      path.forEach(i => { chosen = level[i]; level = chosen.sub || null; });
      let html = `<div class="xa-root"><p class="xa-lead">Ответьте на один-два вопроса — подскажу диаграмму и объясню почему.</p>`;
      if (path.length) html += `<div class="row"><button type="button" class="btn sm ghost" data-xa-back>← Назад</button><button type="button" class="btn sm ghost" data-xa-restart>⟲ Сначала</button></div>`;
      if (level) html += `<div class="xa-pick"><div class="q"><b>${path.length ? 'Уточните:' : 'Что вы хотите показать?'}</b></div>${level.map((o, i) => `<button type="button" class="xa-opt" data-xa-opt="${i}">${esc(o.q)}</button>`).join('')}</div>`;
      else if (chosen) chosen.r.forEach(id => { const d = byId[id]; html += `<div class="xa-res"><div class="xa-badges"><span class="xa-badge ${d.freq}">${esc(FREQ[d.freq])}</span></div><h3 style="margin:0">${esc(d.name)}</h3><div class="xa-pic">${d.pic()}</div><p>${esc(d.shows)}</p><div><b>Не подойдёт, если:</b> ${d.avoid.map(([t, alt]) => `${esc(t.charAt(0).toLowerCase() + t.slice(1))} — тогда ${esc(shortName(alt))}`).join('; ')}.</div><div><button type="button" class="btn primary sm" data-xa-open="${d.id}">Открыть карточку: как читать, пример и код →</button></div></div>`; });
      box.innerHTML = html + '</div>';
    }
    TR.on(box, 'click', '[data-xa-opt]', (e, b) => { path.push(+b.dataset.xaOpt); draw(); });
    TR.on(box, 'click', '[data-xa-back]', () => { path.pop(); draw(); });
    TR.on(box, 'click', '[data-xa-restart]', () => { path = []; draw(); });
    TR.on(box, 'click', '[data-xa-open]', (e, b) => nav.catalog({ sel: b.dataset.xaOpen }));
    draw();
  }

  /* ---------- вкладка «Проверь себя» ---------- */
  const quizState = {};
  function tabQuiz(box, nav) {
    box.innerHTML = `<div class="xa-root"><p class="xa-lead">Двенадцать ситуаций из проекта «Искра Онлайн». Выберите диаграмму — сразу увидите, верно ли и почему. Очки здесь не начисляются: это разминка перед тренировками.</p><div class="xa-score" aria-live="polite"></div><div class="stack xa-qs"></div><div class="row"><button type="button" class="btn sm ghost" data-xa-qreset>⟲ Пройти заново</button></div></div>`;
    const list = TR.$('.xa-qs', box), score = TR.$('.xa-score', box);
    const upd = () => { const answered = QUIZ.filter((q, i) => quizState[i] != null).length, right = QUIZ.filter((q, i) => quizState[i] != null && q.o[quizState[i]] === q.a).length; score.textContent = answered ? `Верно ${right} из ${answered}${answered === QUIZ.length ? ` · всего вопросов ${QUIZ.length}` : ''}` : ''; };
    function cards() {
      list.innerHTML = '';
      QUIZ.forEach((q, i) => {
        const card = document.createElement('div'); card.className = 'card'; list.appendChild(card);
        const opts = q.o.map(id => ({ t: esc(shortName(id)), ok: id === q.a, why: id === q.a ? esc(q.why) : `${esc(shortName(id))}: ${esc(byId[id].shows.split('. ')[0])}. Здесь нужна ${esc(shortName(q.a))}: ${esc(q.why)}` }));
        const ctl = ui.quiz(card, { q: `${i + 1}. ${esc(q.q)}`, options: opts, seed: 'xa-q' + i, value: quizState[i] != null ? [quizState[i]] : [], reveal: quizState[i] != null ? true : null, onChange: v => { quizState[i] = v[0]; ctl.redraw(true); upd(); } });
      });
      upd();
    }
    TR.on(box, 'click', '[data-xa-qreset]', () => { Object.keys(quizState).forEach(k => delete quizState[k]); cards(); });
    cards();
  }

  /* ---------- окно ---------- */
  TR.atlas = {
    open(tab, sel) {
      if (sel && byId[sel]) { cat.sel = sel; cat.group = 'all'; cat.coreOnly = false; }
      ui.modal({
        title: 'Атлас диаграмм',
        html: '<div class="xa-root"></div>',
        onMount(body, close) {
          let tabs = null;
          const nav = {
            catalog(o) { if (o && o.group) { cat.group = o.group; cat.coreOnly = false; const first = DIAGRAMS.find(d => d.group === o.group); if (first) cat.sel = first.id; } if (o && o.sel && byId[o.sel]) { cat.sel = o.sel; cat.group = 'all'; cat.coreOnly = false; } tabs.show('cat'); },
            stage(id) { close(); if (TR.go) TR.go(id); },
            system(tabId) { close(); if (TR.system && TR.system.open) TR.system.open(tabId); }
          };
          tabs = ui.tabs(TR.$('.xa-root', body), [
            { id: 'start', t: '🧭 С чего начать', render: b => tabStart(b, nav) },
            { id: 'cat', t: '🗂 Все диаграммы', render: b => tabCatalog(b, nav) },
            { id: 'code', t: '⌨️ PlantUML и Mermaid', render: b => { tabCode(b); TR.on(b, 'click', '[data-xa-sel]', (e, x) => nav.catalog({ sel: x.dataset.xaSel })); } },
            { id: 'pick', t: '🎯 Подобрать', render: b => tabPick(b, nav) },
            { id: 'quiz', t: '✅ Проверь себя', render: b => tabQuiz(b, nav) }
          ], ['start', 'cat', 'code', 'pick', 'quiz'].includes(tab) ? tab : (sel ? 'cat' : 'start'));
        }
      });
    },
    DIAGRAMS, RARE, PICK, QUIZ, parseSeq
  };

  TR.glossary([
    { term: 'Нотация', simple: 'Правила рисования: какая фигура что значит.', tech: 'Набор графических элементов и правил их сочетания, например BPMN 2.0 или UML 2.5.' },
    { term: 'PlantUML', simple: 'Пишете текст — получаете диаграмму.', tech: 'Язык и инструмент «диаграмма как код»: UML, C4, ERD, Гант, майнд-карты. Рисует сервер plantuml.com или локальная программа на Java.' },
    { term: 'Mermaid', simple: 'Диаграммы из текста прямо в документации.', tech: 'JavaScript-библиотека «диаграмма как код»; встроена в GitLab, GitHub, Notion, Obsidian (блок ```mermaid в Markdown).' },
    { term: 'Диаграмма как код (diagrams as code)', simple: 'Схему не рисуют мышкой, а описывают текстом.', tech: 'Подход, при котором исходник диаграммы — текст в git: версии, ревью и автоматическая отрисовка.' }
  ], null);
})();
