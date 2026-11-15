/* Модуль 3, занятие 7: Диаграммы — какую выбрать и как нарисовать кодом (PlantUML, Mermaid).
   Теория: how-dg-map — «какой вопрос — какая диаграмма»: вопросы команды «Искры» и «Орбиты», по нажатию — диаграмма,
   кто её читает и с чем не путать; how-dg-code — диаграмма как код: одна и та же схема в PlantUML и Mermaid,
   «нажмите на строку — узнаете, что она значит», живая отрисовка; how-dg-good — хорошая и плохая диаграмма
   (переключатель «до / после»), уровень детализации, чек-лист.
   Практика: сопоставление вопросов и диаграмм; «найдите ошибки» в коде PlantUML (синтаксис и смысл);
   редактор PlantUML или Mermaid с живой схемой и проверкой по признакам; лаборатория «защита проектирования» —
   каждому слушателю своя диаграмма, реакции слушателей; ответ Тимуру Рашидовичу, зачем столько схем. */
'use strict';
(function () {
  const TR = window.TR, ui = TR.ui, esc = TR.esc;
  const ID = 'm3-diagrams';
  const pct = x => Math.round((x || 0) * 100) + ' %';

  if (!document.getElementById('m3d-css')) document.head.insertAdjacentHTML('beforeend', `<style id="m3d-css">
    .m3d-root { display: grid; gap: 14px; min-width: 0; }
    .m3d-root p { margin: 0; }
    .m3d-two { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr); gap: 14px; align-items: start; }
    .m3d-qs { display: grid; gap: 6px; }
    .m3d-q { display: grid; grid-template-columns: 34px minmax(0, 1fr); gap: 8px; align-items: center; text-align: left; font: inherit; color: var(--text); background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 8px 10px; cursor: pointer; }
    .m3d-q:hover { border-color: var(--border-strong); }
    .m3d-q[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); }
    .m3d-ava { width: 30px; height: 30px; border-radius: 50%; display: grid; place-items: center; background: var(--surface-3); color: var(--text-2); font-size: 11px; font-weight: 700; }
    .m3d-panel { border: 1px solid var(--border); border-left: 4px solid var(--accent); border-radius: 12px; background: var(--surface); padding: 12px 14px; display: grid; gap: 8px; min-width: 0; }
    .m3d-panel h4 { margin: 0; font-size: 16px; }
    .m3d-pic { border: 1px solid var(--border); border-radius: 10px; background: var(--surface-2); padding: 8px; overflow-x: auto; }
    .m3d-pic svg { max-width: 460px; }
    .m3d-code { display: grid; gap: 2px; font: 12.5px/1.5 var(--f-mono); font-variant-ligatures: none; font-feature-settings: "liga" 0, "calt" 0; background: var(--code-bg); border: 1px solid var(--border); border-radius: 10px; padding: 8px; overflow-x: auto; }
    .m3d-line { display: grid; grid-template-columns: 26px minmax(max-content, 1fr); gap: 8px; align-items: baseline; text-align: left; font: inherit; color: var(--text); background: none; border: 1px solid transparent; border-radius: 6px; padding: 2px 6px; cursor: pointer; white-space: pre; }
    .m3d-line .n { color: var(--text-muted); text-align: right; user-select: none; }
    .m3d-line:hover { border-color: var(--border-strong); }
    .m3d-line[aria-pressed="true"] { background: var(--accent-soft); border-color: var(--accent); }
    .m3d-line.ok { background: var(--ok-soft); border-color: var(--ok); }
    .m3d-line.bad { background: var(--bad-soft); border-color: var(--bad); }
    .m3d-line.miss { background: var(--warn-soft); border-color: var(--warn); }
    .m3d-line[disabled] { cursor: default; }
    .m3d-explain { border: 1px solid var(--border); border-radius: 10px; background: var(--surface); padding: 10px 12px; font-size: 14px; min-height: 48px; }
    .m3d-out { overflow-x: auto; border: 1px solid var(--border); border-radius: 12px; background: var(--surface-2); padding: 6px; min-height: 90px; }
    .m3d-ed textarea { width: 100%; min-height: 230px; box-sizing: border-box; font: 12.5px/1.55 var(--f-mono); font-variant-ligatures: none; font-feature-settings: "liga" 0, "calt" 0; background: var(--code-bg); color: var(--text); border: 1px solid var(--border); border-radius: 10px; padding: 10px; resize: vertical; }
    .m3d-feats { display: grid; gap: 4px; font-size: 13.5px; }
    .m3d-feat { display: grid; grid-template-columns: 22px minmax(0, 1fr); gap: 6px; align-items: start; }
    .m3d-feat .mk { font-weight: 700; color: var(--text-muted); }
    .m3d-feat.on .mk { color: var(--ok); }
    .m3d-msg { font-size: 12.5px; padding: 4px 8px; border-radius: 8px; background: var(--bad-soft); color: var(--bad); }
    .m3d-msg.warn { background: var(--warn-soft); color: var(--warn); }
    .m3d-aud { display: grid; gap: 8px; }
    .m3d-person { display: grid; grid-template-columns: 38px minmax(0, 1fr) minmax(150px, 220px); gap: 10px; align-items: center; border: 1px solid var(--border); border-radius: 12px; background: var(--surface); padding: 10px 12px; }
    .m3d-person .ava { width: 36px; height: 36px; border-radius: 50%; display: grid; place-items: center; background: var(--accent-soft); color: var(--accent); font-weight: 700; font-size: 12px; }
    .m3d-person select { width: 100%; }
    .m3d-person .who { font-weight: 600; } .m3d-person .role { font-size: 12px; color: var(--text-muted); }
    .m3d-person .ask { font-size: 13.5px; color: var(--text-2); margin-top: 2px; }
    .m3d-react { grid-column: 2 / -1; font-size: 13.5px; border-radius: 8px; padding: 6px 10px; }
    .m3d-react.ok { background: var(--ok-soft); color: var(--text); border-left: 3px solid var(--ok); }
    .m3d-react.bad { background: var(--bad-soft); color: var(--text); border-left: 3px solid var(--bad); }
    .m3d-cmp { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 10px; }
    .m3d-check { display: grid; gap: 6px; }
    .m3d-ci { display: grid; grid-template-columns: 22px minmax(0, 1fr); gap: 8px; text-align: left; font: inherit; color: var(--text); background: var(--surface); border: 1px solid var(--border); border-radius: 9px; padding: 8px 10px; cursor: pointer; }
    .m3d-ci .why { display: none; color: var(--text-2); font-size: 13px; margin-top: 4px; }
    .m3d-ci[aria-expanded="true"] .why { display: block; }
    .m3d-ci[aria-expanded="true"] { border-color: var(--accent); }
    @media (max-width: 820px) { .m3d-two, .m3d-cmp { grid-template-columns: minmax(0, 1fr); } .m3d-person { grid-template-columns: 38px minmax(0, 1fr); } .m3d-person select { grid-column: 1 / -1; } .m3d-react { grid-column: 1 / -1; } }
  </style>`);

  /* ---------- диаграммы, которые встречаются в заданиях ---------- */
  const DG = {
    cjm: { t: 'CJM — карта пути клиента', q: 'где клиенту плохо на всём пути, включая звонки и ожидание', reader: 'бизнес, продукт, дизайн' },
    userflow: { t: 'User flow', q: 'какие экраны проходит пользователь и куда ведёт каждая кнопка', reader: 'дизайнеры, мобильные разработчики' },
    bpmn: { t: 'BPMN', q: 'кто из людей и отделов что делает и в каком порядке', reader: 'бизнес, руководители, аналитики' },
    usecase: { t: 'UML Use Case', q: 'кто пользуется системой и какие цели достигает', reader: 'заказчик, команда' },
    state: { t: 'Диаграмма состояний', q: 'какие статусы бывают у объекта и какие переходы разрешены', reader: 'разработчики, тестировщики' },
    sequence: { t: 'UML Sequence', q: 'в каком порядке системы обмениваются запросами и что при ошибке', reader: 'разработчики, архитекторы, QA' },
    c4: { t: 'C4: контейнеры', q: 'из каких частей состоит система и как они связаны', reader: 'вся команда, архитекторы' },
    deployment: { t: 'Диаграмма развёртывания', q: 'на каких серверах и устройствах всё запущено и где лежат данные', reader: 'эксплуатация, безопасность' },
    erd: { t: 'ERD', q: 'какие таблицы будут в базе, их ключи и связи', reader: 'разработчики бэкенда, администраторы баз' },
    dfd: { t: 'DFD — потоки данных', q: 'откуда данные приходят, где хранятся и куда уходят', reader: 'аналитики, безопасность, бухгалтерия' },
    gantt: { t: 'Диаграмма Ганта', q: 'когда какие работы и что от чего зависит', reader: 'руководитель проекта, заказчик' },
    decision: { t: 'Таблица решений', q: 'что делать при каждой комбинации условий правила', reader: 'бизнес, разработчики, QA' }
  };
  const pic = id => { const d = TR.atlas && TR.atlas.DIAGRAMS && TR.atlas.DIAGRAMS.find(x => x.id === id); return d ? `<div class="m3d-pic">${d.pic()}</div>` : ''; };
  const atlasBtn = id => `<button type="button" class="btn sm ghost" data-m3d-atlas="${esc(id)}">📐 Подробно в справочнике «Диаграммы»</button>`;
  function bindAtlas(el) { TR.on(el, 'click', '[data-m3d-atlas]', (e, b) => { if (TR.atlas && TR.atlas.open) TR.atlas.open('cat', b.dataset.m3dAtlas); }); }

  /* ---------- разбор sequence-кода (подмножество PlantUML и Mermaid) ----------
     Чистая функция: используется и для живой отрисовки, и в check. */
  function parseSeq(src) {
    const lanes = [], steps = [], msgs = [], W = '[A-Za-z0-9_А-Яа-яЁё]+';
    let hasStart = false, hasEnd = false, mermaid = false;
    const lane = (id, t) => { let l = lanes.find(x => x.id === id); if (!l) { l = { id, t: t || id }; lanes.push(l); } else if (t) l.t = t; return l; };
    String(src || '').split('\n').forEach((raw, i) => {
      const s = raw.trim(), n = i + 1;
      if (!s || s.startsWith("'") || s.startsWith('%%')) return;
      if (/^@startuml$/i.test(s)) { hasStart = true; return; }
      if (/^@enduml$/i.test(s)) { hasEnd = true; return; }
      if (/^sequenceDiagram$/i.test(s)) { mermaid = true; return; }
      if (/^@end/i.test(s)) { msgs.push({ n, kind: 'bad', t: 'Закрывающая строка пишется ровно так: @enduml.' }); return; }
      let m;
      if ((m = s.match(new RegExp(`^(participant|actor|database|boundary|control|entity|collections|queue)\\s+"([^"]+)"\\s+as\\s+(${W})$`, 'i')))) { lane(m[3], m[2]); return; }
      if ((m = s.match(new RegExp(`^(participant|actor)\\s+(${W})\\s+as\\s+(.+)$`, 'i')))) {
        if (!mermaid && /\s/.test(m[3].trim()) && !/^".*"$/.test(m[3].trim())) { msgs.push({ n, kind: 'bad', t: 'Длинное имя с пробелами берут в кавычки: participant "Сервис заказ-нарядов" as WO.' }); return; }
        lane(m[2], m[3].replace(/^"|"$/g, '').trim()); return;
      }
      if ((m = s.match(new RegExp(`^(participant|actor|database)\\s+(${W})$`, 'i')))) { lane(m[2]); return; }
      if (/^(participant|actor)\s+[^"]+\s+as\s+/i.test(s)) { msgs.push({ n, kind: 'bad', t: 'Имя с пробелами — в кавычках: participant "Сервис заказ-нарядов" as WO.' }); return; }
      if ((m = s.match(new RegExp(`^(${W})\\s*(-->>|->>|-->|->)\\s*(${W})\\s*(?::\\s*(.*))?$`)))) {
        lane(m[1]); lane(m[3]);
        const label = (m[4] || '').trim();
        steps.push({ from: m[1], to: m[3], t: label || '(без подписи)', reply: m[2].startsWith('--'), bare: !label });
        if (!label) msgs.push({ n, kind: 'warn', t: 'Стрелка без подписи: после двоеточия напишите, что передаётся.' });
        return;
      }
      if (new RegExp(`^${W}\\s*(=>|→|=>>)`).test(s)) { msgs.push({ n, kind: 'bad', t: 'Такой стрелки нет. Запрос: -> (в Mermaid ->>), ответ: --> (в Mermaid -->>).' }); return; }
      if (/^(alt|else|opt|loop|end|note|activate|deactivate|autonumber|title|group|break|par|rect)\b/i.test(s)) { msgs.push({ n, kind: 'warn', t: `«${s.split(/\s/)[0]}» живая схема здесь не рисует, но PlantUML и Mermaid его понимают.` }); return; }
      msgs.push({ n, kind: 'bad', t: 'Строку не удалось разобрать. Стрелка выглядит так: Клиент -> Приложение : текст' });
    });
    if (hasStart && !hasEnd && !mermaid) msgs.push({ n: 0, kind: 'bad', t: 'Нет последней строки @enduml — PlantUML ничего не нарисует.' });
    return { lanes, steps, msgs, mermaid, plantuml: hasStart };
  }
  function drawSeq(el, res, title) {
    if (!res.steps.length) { el.innerHTML = '<p class="small dim" style="padding:10px">Здесь появится схема, как только будет хотя бы одна стрелка.</p>'; return; }
    el.innerHTML = '<div></div>';
    ui.seq(el.firstChild, { lanes: res.lanes.slice(0, 6), steps: res.steps.filter(s => res.lanes.slice(0, 6).some(l => l.id === s.from) && res.lanes.slice(0, 6).some(l => l.id === s.to)), controls: false, start: 'all', laneW: 150, title: title || 'Схема из кода' });
  }

  /* =====================================================================
     ТЕОРИЯ
     ===================================================================== */
  const MAPQ = [
    { who: 'timur', q: 'Где клиенты теряются и злятся — и за что я плачу деньги?', d: 'cjm', why: 'Весь путь Елены от «надо переобуться» до «забрала машину», с эмоциями и болями: дозвон, ожидание без статуса. Это язык владельца бизнеса.' },
    { who: 'marina', q: 'Как после запуска будет проходить приёмка: что делаю я, что механик, что кладовщица?', d: 'bpmn', why: 'Несколько людей, каждый в своей дорожке, порядок работ и развилки «нужны доп. работы или нет» — бизнес-процесс в BPMN.' },
    { who: 'gleb', q: 'Что происходит между приложением, платёжным сервисом и ЮKassa, если банк отказал?', d: 'sequence', why: 'Порядок запросов между системами во времени и ветка ошибки — sequence. Глебу нужны конкретные вызовы и данные на стрелках.' },
    { who: 'liza', q: 'Может ли заказ-наряд из «Готов» вернуться в «В работе»?', d: 'state', why: 'Вопрос о разрешённых переходах статусов одного объекта — диаграмма состояний. Из неё Лиза возьмёт список проверок.' },
    { who: 'dasha', q: 'Какие экраны в приложении при записи и что увидит клиент, если время уже заняли?', d: 'userflow', why: 'Экраны, кнопки и ветка ошибки внутри приложения — user flow. CJM была бы слишком «высокой», sequence — слишком технической.' },
    { who: 'artem', q: 'Успеваем ли к 15 марта и что сдвинется, если оплата задержится?', d: 'gantt', why: 'Работы на шкале времени и зависимости — диаграмма Ганта.' },
    { who: 'olga', q: 'Какие данные об оплатах уходят в 1С, откуда они берутся и где лежат?', d: 'dfd', why: 'Движение данных между процессами и хранилищами без порядка во времени — DFD. Ей не нужны ни классы, ни вызовы API.' },
    { who: 'gleb', q: 'Какие таблицы будут в базе и как запись связана с машиной и клиентом?', d: 'erd', why: 'Таблицы, первичные и внешние ключи, «один ко многим» — ERD.' }
  ];
  const howMap = {
    id: 'how-dg-map', covers: ['pick'], title: 'Как это работает: какой вопрос — какая диаграмма', free: true, noReset: true,
    simple: { icon: '🗺', title: 'Простыми словами', plain: 'Диаграмма отвечает на один вопрос. Сначала поймите, какой вопрос задаёт человек, — тип диаграммы почти выбирается сам.', analogy: 'В автосервисе у одной машины есть схема электрики, схема тормозов и карта ТО. Электрик не ищет провода на схеме тормозов. Так и с системой: «одной схемы про всё» не бывает — бывает пакет схем, каждая для своего читателя.', tech: 'Модель — упрощение системы под задачу. BABOK (раздел 10) и Вигерс («Разработка требований») называют выбор модели по цели и аудитории первым шагом моделирования.' },
    render(el) {
      el.classList.add('m3d-root');
      let cur = 0;
      function draw() {
        const q = MAPQ[cur], d = DG[q.d], P = TR.PEOPLE[q.who];
        el.innerHTML = `<div class="m3d-root">
          <p>Вопросы, которые команда задала за неделю. Нажмите на вопрос — справа появится диаграмма, которая на него отвечает, и объяснение почему.</p>
          <div class="m3d-two"><div class="m3d-qs">${MAPQ.map((x, i) => `<button type="button" class="m3d-q" data-q="${i}" aria-pressed="${i === cur}"><span class="m3d-ava">${esc(TR.PEOPLE[x.who].ini)}</span><span>${esc(x.q)}</span></button>`).join('')}</div>
          <div class="m3d-panel" aria-live="polite"><div class="small dim">${esc(P.name)}, ${esc(P.role)}</div><h4>→ ${esc(d.t)}</h4>${pic(q.d)}<p>${esc(q.why)}</p><p class="small dim">Кто ещё читает: ${esc(d.reader)}.</p><div>${atlasBtn(q.d)}</div></div></div>
          ${ui.note('info', 'Три вопроса перед любой диаграммой', '<b>Что показать?</b> Путь человека, процесс, порядок запросов, состав системы, данные, статусы. <b>Кому?</b> Владельцу — CJM и BPMN, разработчику — sequence, ERD, C4. <b>Насколько подробно?</b> Один уровень детализации на схеме и не больше 15–20 элементов.')}
          ${ui.note('', 'Как спросят на собеседовании', '«Какие диаграммы вы рисуете и когда?» Сильный ответ — не список, а связка «вопрос → диаграмма → читатель»: «процесс с бизнесом — BPMN, интеграцию с разработчиками — sequence, статусы — диаграмма состояний, данные — ERD».')}</div>`;
      }
      TR.on(el, 'click', '[data-q]', (e, b) => { cur = +b.dataset.q; draw(); });
      bindAtlas(el);
      draw();
    }
  };

  const CODE = {
    pu: [
      ['@startuml', 'Начало диаграммы PlantUML. Без пары @startuml … @enduml ничего не нарисуется.'],
      ['actor "Клиент" as U', 'Участник-человек (рисуется человечком). В кавычках — имя на схеме, после as — короткое имя (алиас), которым пользуемся в стрелках.'],
      ['participant "Приложение" as App', 'Участник-система (рисуется прямоугольником). Русское имя с пробелами — обязательно в кавычках.'],
      ['participant "Сервис записи" as Book', 'Ещё один участник. Порядок строк participant задаёт порядок колонок слева направо.'],
      ['U -> App : Выбираю 10:30', 'Сообщение: от кого -> кому : что передаётся. Сплошная стрелка — запрос.'],
      ['App -> Book : POST /bookings', 'На стрелке — конкретика: метод и адрес API или данные. «Запрос» без деталей — плохая подпись.'],
      ['Book --> App : 201 Created', 'Две чёрточки --> — пунктир, то есть ответ на запрос.'],
      ['App --> U : «Вы записаны на 10:30»', 'Ответ человеку. По схеме видно, что клиент получает подтверждение только после ответа сервиса.'],
      ['@enduml', 'Конец диаграммы.']
    ],
    mm: [
      ['sequenceDiagram', 'Первая строка Mermaid — тип диаграммы. Отдельной закрывающей строки нет.'],
      ['  actor U as Клиент', 'Участник-человек. Порядок обратный PlantUML: сначала короткое имя, потом as и подпись. Кавычки не нужны.'],
      ['  participant App as Приложение', 'Участник-система. Идентификатор — латиницей, русское имя — после as.'],
      ['  participant Book as Сервис записи', 'Ещё один участник.'],
      ['  U->>App: Выбираю 10:30', 'Запрос в Mermaid — стрелка ->> (сплошная с наконечником). Двоеточие сразу после имени.'],
      ['  App->>Book: POST /bookings', 'Тот же смысл, что в PlantUML, — другой синтаксис.'],
      ['  Book-->>App: 201 Created', 'Ответ — пунктир -->>.'],
      ['  App-->>U: «Вы записаны на 10:30»', 'Ответ клиенту. В GitLab этот блок, вставленный в Markdown как ```mermaid, нарисуется прямо в задаче.']
    ]
  };
  const howCode = {
    id: 'how-dg-code', covers: ['fix', 'write'], title: 'Как это работает: диаграмма как код — PlantUML и Mermaid', free: true, noReset: true,
    simple: { icon: '⌨️', title: 'Простыми словами', plain: 'Вместо того чтобы двигать фигуры мышкой, вы пишете короткий текст: «Клиент отправляет запрос приложению». Программа сама рисует картинку и сама раскладывает фигуры.', analogy: 'Как заказ-наряд и распечатка: мастер вписывает только суть, оформление делает принтер. Захотели поменять шаг — поправили одну строку, а не перерисовали полсхемы.', tech: 'PlantUML и Mermaid — текстовые языки описания диаграмм («diagrams as code»). Текст хранят в git рядом с требованиями: видна история правок, изменения проходят ревью, схема не расходится с текстом.' },
    render(el) {
      el.classList.add('m3d-root');
      let lang = 'pu', sel = 4;
      function draw() {
        const lines = CODE[lang], res = parseSeq(lines.map(l => l[0]).join('\n'));
        el.innerHTML = `<div class="m3d-root">
          <p>Одна и та же схема — запись на ТО — в двух языках. Нажмите на любую строку кода, чтобы узнать, что она значит.</p>
          <div class="row">${ui.seg('m3d-lang', [{ v: 'pu', t: 'PlantUML' }, { v: 'mm', t: 'Mermaid' }], lang)}</div>
          <div class="m3d-two"><div class="stack"><div class="m3d-code" role="group" aria-label="Код диаграммы">${lines.map((l, i) => `<button type="button" class="m3d-line" data-line="${i}" aria-pressed="${i === sel}"><span class="n">${i + 1}</span><span>${esc(l[0])}</span></button>`).join('')}</div>
            <div class="m3d-explain" aria-live="polite"><b>Строка ${sel + 1}.</b> ${esc((lines[sel] || lines[0])[1])}</div></div>
            <div class="m3d-out"></div></div>
          <div class="m3d-cmp">
            <div class="card"><b>PlantUML</b><p class="small">Почти весь UML, C4, ERD, Гант, майнд-карты. Рисует сервер plantuml.com, плагины VS Code, IntelliJ IDEA, Confluence. Первая строка — @startuml, последняя — @enduml.</p></div>
            <div class="card"><b>Mermaid</b><p class="small">Блок-схемы, sequence, классы, состояния, ERD, Гант, майнд-карты. Рисуется прямо в GitLab, GitHub, Notion, Obsidian — блок <code>\`\`\`mermaid</code> в Markdown, редактор mermaid.live.</p></div>
          </div>
          ${ui.note('warn', 'Частые ошибки новичков', 'Нет <code>@enduml</code>; русское имя с пробелами без кавычек; стрелка <code>=></code> вместо <code>-></code>; ответ сплошной стрелкой вместо пунктира; стрелка без подписи. Все пять встретятся вам в задании «Найдите ошибки».')}
          ${ui.note('', 'Как спросят на собеседовании', '«Чем PlantUML лучше draw.io?» — Схема живёт текстом в git рядом с требованиями: видно, кто и что поменял, правка проходит ревью, а схема не устаревает молча. Минус — раскладку не подвинешь руками.')}</div>`;
        drawSeq(TR.$('.m3d-out', el), res, 'Запись на ТО');
      }
      TR.on(el, 'click', '[data-line]', (e, b) => { sel = +b.dataset.line; TR.$$('[data-line]', el).forEach(x => x.setAttribute('aria-pressed', String(x === b))); TR.$('.m3d-explain', el).innerHTML = `<b>Строка ${sel + 1}.</b> ${esc(CODE[lang][sel][1])}`; });
      TR.on(el, 'click', '[data-seg="m3d-lang"] button', (e, b) => { lang = b.dataset.v; sel = Math.min(sel, CODE[lang].length - 1); draw(); });
      draw();
    }
  };

  const BAD = { lanes: [{ id: 'a', t: 'Клиент' }, { id: 'b', t: 'Приложение' }, { id: 'c', t: 'Шлюз' }, { id: 'd', t: 'Сервис' }, { id: 'e', t: 'БД' }, { id: 'f', t: 'Касса' }], steps: [{ from: 'a', to: 'b', t: 'запрос' }, { from: 'b', to: 'c', t: 'запрос' }, { from: 'c', to: 'd', t: 'запрос' }, { from: 'd', to: 'e', t: 'SELECT' }, { from: 'e', to: 'd', t: 'данные' }, { from: 'd', to: 'f', t: 'вызов' }, { from: 'd', to: 'b', t: 'ответ' }] };
  const GOOD = { lanes: [{ id: 'a', t: 'Клиент' }, { id: 'b', t: 'Приложение' }, { id: 'd', t: 'Платёжный сервис' }, { id: 'f', t: 'ЮKassa' }], steps: [{ from: 'a', to: 'b', t: 'Нажимает «Оплатить» 4 300 ₽' }, { from: 'b', to: 'd', t: 'POST /payments: заказ-наряд, сумма' }, { from: 'd', to: 'f', t: 'Создать платёж' }, { from: 'f', to: 'd', t: 'ссылка на оплату', reply: true }, { from: 'd', to: 'b', t: '201: ссылка', reply: true }, { from: 'f', to: 'd', t: 'вебхук: оплачено' }, { from: 'd', to: 'b', t: 'push «Оплачено»', reply: true }] };
  const CHECK = [
    ['Есть название', 'Что за схема и о чём: «Оплата заказ-наряда в приложении». Без названия читатель гадает, какую часть системы видит.'],
    ['Понятно без автора', 'Если схему нужно объяснять голосом — она недоделана. Покажите коллеге и попросите пересказать.'],
    ['На каждой стрелке — что передаётся', '«Запрос» и «ответ» ничего не говорят. «POST /payments: заказ-наряд, сумма» — говорит.'],
    ['Один уровень подробности', 'Не смешивайте «Клиент платит» и «SELECT из таблицы payment» на одной схеме. Для деталей — отдельная схема.'],
    ['Не больше 15–20 элементов', 'Больше — разбейте: общая схема плюс подробные по частям.'],
    ['Имена как в требованиях', 'Если в требованиях «Платёжный сервис», на схеме не должно быть «Сервис», «Payments» и «модуль оплаты».'],
    ['Ответы — пунктиром, ошибки — показаны', 'Самое ценное в sequence — ветки отказа и таймаута. Их и проверяют разработчики.'],
    ['Лежит рядом с требованиями и обновляется', 'Устаревшая схема хуже никакой: ей верят. Код в git меняют вместе с текстом.']
  ];
  const howGood = {
    id: 'how-dg-good', covers: ['defense'], title: 'Как это работает: хорошая диаграмма и пакет диаграмм', free: true, noReset: true,
    simple: { icon: '✅', title: 'Простыми словами', plain: 'Хорошую диаграмму понимают без автора. Её читают за минуту: видно, кто участвует, что передаётся и что будет при ошибке.', analogy: 'Как схема проезда к станции «Искры»: на ней нет каждого дома города — только нужные улицы и подписанные повороты. Лишнее мешает доехать.', tech: 'Модель отражает систему с точки зрения конкретного читателя (ISO/IEC/IEEE 42010 — точки зрения, viewpoints). Поэтому проект описывают набором диаграмм разных уровней, а не одной общей.' },
    render(el) {
      el.classList.add('m3d-root');
      let mode = 'bad';
      function draw() {
        el.innerHTML = `<div class="m3d-root">
          <p>Глеб прислал схему оплаты. Переключите «до» и «после» и сравните, что из каждой можно понять.</p>
          <div class="row">${ui.seg('m3d-ba', [{ v: 'bad', t: 'До: «квадратики и стрелки»' }, { v: 'good', t: 'После правки' }], mode)}</div>
          <div class="m3d-out"></div>
          ${mode === 'bad' ? ui.note('bad', 'Что не так', 'Нет названия; на стрелках «запрос» и «ответ» — неясно, что передаётся; ответы нарисованы как запросы; смешаны уровни (шлюз и SQL-запрос к базе рядом с действием клиента); неясно, при чём тут касса; нет ветки отказа банка.') : ui.note('ok', 'Что стало лучше', 'Только участники, нужные для вопроса «как проходит оплата»; на стрелках — данные и методы; ответы пунктиром; виден вебхук от ЮKassa — асинхронное подтверждение. Ветку отказа банка добавят фрагментом alt.')}
          <div class="eyebrow">Чек-лист хорошей диаграммы — нажмите на пункт, чтобы увидеть пояснение</div>
          <div class="m3d-check">${CHECK.map((c, i) => `<button type="button" class="m3d-ci" data-ci="${i}" aria-expanded="false"><span>✓</span><span><b>${esc(c[0])}</b><span class="why">${esc(c[1])}</span></span></button>`).join('')}</div>
          ${ui.note('info', 'Пакет диаграмм вместо одной огромной', 'Одна схема «про всё» никому не помогает: владельцу она слишком подробная, разработчику — слишком общая. Проект описывают пакетом: CJM и BPMN — для бизнеса, контекст и C4 — для всех, sequence, состояния, ERD — для разработки и тестирования, развёртывание — для эксплуатации. Каждая схема — ответ на свой вопрос.')}
          ${ui.note('', 'Как спросят на собеседовании', '«Как понять, что диаграмма получилась?» — Дать её читателю без объяснений и попросить пересказать. Совпало с задумкой — готово; не совпало — правим схему, а не читателя.')}</div>`;
        const box = TR.$('.m3d-out', el), cfg = mode === 'bad' ? BAD : GOOD;
        box.innerHTML = '<div></div>';
        ui.seq(box.firstChild, { lanes: cfg.lanes, steps: cfg.steps, controls: false, start: 'all', laneW: 140, title: mode === 'bad' ? 'Схема до правки' : 'Оплата заказ-наряда в приложении' });
      }
      TR.on(el, 'click', '[data-seg="m3d-ba"] button', (e, b) => { mode = b.dataset.v; draw(); });
      TR.on(el, 'click', '[data-ci]', (e, b) => b.setAttribute('aria-expanded', String(b.getAttribute('aria-expanded') !== 'true')));
      draw();
    }
  };

  /* =====================================================================
     ПРАКТИКА
     ===================================================================== */

  /* ---------- 1. Подберите диаграмму к вопросу ---------- */
  const PICK = [
    { id: 'p1', who: 'timur', t: 'Тимур Рашидович: «Покажите, где за весь визит клиент нервничает больше всего — я хочу понять, за что плачу»', a: 'cjm', why: 'Весь путь клиента с эмоциями, в том числе вне приложения, — CJM.' },
    { id: 'p2', who: 'liza', t: 'Лиза: «Из каких статусов предложение доп. работ может перейти в „Истекло“?»', a: 'state', why: 'Разрешённые переходы статусов одного объекта — диаграмма состояний (BR-8: нет ответа к концу работ → «Истекло»).' },
    { id: 'p3', who: 'gleb', t: 'Глеб: «Распиши, в каком порядке планшет механика, сервис заказ-нарядов и приложение клиента обмениваются сообщениями при доп. работах»', a: 'sequence', why: 'Порядок сообщений между системами во времени — sequence.' },
    { id: 'p4', who: 'marina', t: 'Марина Олеговна: «Нарисуйте, кто что делает утром на приёмке: я, механик, кладовщица»', a: 'bpmn', why: 'Люди в разных ролях и порядок их работ — BPMN с дорожками.' },
    { id: 'p5', who: 'dasha', t: 'Даша: «Какие экраны будут при переносе записи и что увидит клиент, если до начала меньше трёх часов?»', a: 'userflow', why: 'Экраны и ветка «меньше трёх часов — перенос платный или невозможен» (BR-3) — user flow.' },
    { id: 'p6', who: 'artem', t: 'Артём: «Что сдвинется, если интеграция с 1С задержится на неделю?»', a: 'gantt', why: 'Работы на шкале времени и зависимости — диаграмма Ганта.' },
    { id: 'p7', who: 'gleb', t: 'Глеб: «Нужна схема таблиц booking, booking_service и service с ключами»', a: 'erd', why: 'Таблицы, ключи и связь «многие ко многим» через booking_service — ERD.' },
    { id: 'p8', who: 'rustam', t: 'Рустам из «Шашки»: «Кто согласует доп. работы для наших машин — я, ваш мастер или автоматически? Распишите все случаи»', a: 'decision', why: 'Несколько условий (корпоративный клиент, сумма в пределах лимита 3 000 ₽) и их комбинации — таблица решений (BR-9).' }
  ];
  const PICK_CHOICES = ['cjm', 'userflow', 'bpmn', 'state', 'sequence', 'c4', 'erd', 'dfd', 'gantt', 'decision'].map(v => ({ v, t: DG[v].t }));
  function pickEval(v) { v = v || {}; const good = PICK.filter(p => v[p.id] === p.a).length; return { good, score: good / PICK.length }; }
  const taskPick = {
    id: 'pick', title: 'Какая диаграмма ответит на вопрос',
    simple: howMap.simple,
    lead: ui.brief({
      situation: 'Вера собирает пакет к защите: «Вот восемь вопросов, которые нам задали за неделю. Для каждого — диаграмма, которая на него отвечает. Не по привычке, а по вопросу».',
      todo: ['Для каждого вопроса выберите диаграмму из списка.', 'Нажмите «Проверить». Засчитывается, если верно хотя бы 7 из 8.'],
      lookTitle: 'Подсказка', look: 'Сначала определите, о чём вопрос: путь человека, работа людей, порядок запросов, статусы, экраны, сроки, таблицы, правило с условиями.'
    }),
    blank: () => ({ v: {} }),
    reference: () => ({ v: Object.fromEntries(PICK.map(p => [p.id, p.a])) }),
    render(el, ctx) {
      el.classList.add('m3d-root');
      const a = ctx.ans; a.v = a.v || {};
      let rv = null;
      if (ctx.result) { rv = {}; PICK.forEach(p => { if (a.v[p.id]) rv[p.id] = a.v[p.id] === p.a ? { s: 'ok', why: esc(p.why) } : { s: 'bad', why: `${esc(DG[a.v[p.id]].t)} отвечает на вопрос «${esc(DG[a.v[p.id]].q)}». Здесь нужна ${esc(DG[p.a].t)}: ${esc(p.why)}` }; }); }
      el.innerHTML = '<div data-m></div>';
      ui.match(TR.$('[data-m]', el), { rows: PICK.map(p => ({ id: p.id, t: esc(p.t) })), choices: PICK_CHOICES, value: a.v, readonly: ctx.readonly, reveal: rv, placeholder: 'Какая диаграмма?', onChange: v => { a.v = v; ctx.save(); } });
    },
    check(ans) {
      const v = (ans && ans.v) || {}, r = pickEval(v), notes = [];
      PICK.forEach(p => {
        if (!v[p.id]) notes.push({ ok: false, html: `Не выбрано: «${esc(p.t.split(': ')[0])}».` });
        else if (v[p.id] !== p.a) notes.push({ ok: false, html: `${esc(p.t.split(': ')[0])}: выбрана ${esc(DG[v[p.id]].t)}, а нужна ${esc(DG[p.a].t)}. ${esc(p.why)}` });
      });
      if (r.good === PICK.length) notes.push({ ok: true, html: 'Все восемь вопросов получили свою диаграмму.' });
      return { ok: r.good >= 7, score: r.score, notes, summary: `Верно ${r.good} из ${PICK.length}.`, mentor: r.good >= 7 ? null : 'Не начинайте с диаграммы — начинайте с вопроса. «Порядок между системами» — sequence, «статусы» — состояния, «кто из людей что делает» — BPMN.' };
    },
    explain: `<p>Выбор диаграммы — это перевод вопроса читателя. Владелец спрашивает о клиентах и деньгах — CJM. Управляющая — о работе людей — BPMN. Разработчик — о вызовах и ошибках — sequence. Тестировщица — о статусах — диаграмма состояний. Дизайнер и мобильный разработчик — об экранах — user flow. Руководитель проекта — о сроках — Гант. Бэкенд — о таблицах — ERD. Правило с комбинациями условий — таблица решений: каждый столбец — готовый тест.</p>
      <p>Частая ошибка — рисовать любимую диаграмму на любой вопрос: BPMN там, где нужна sequence, или одну огромную схему на всё. Источники: BABOK v3, раздел 10 (техники моделирования); Вигерс, Битти, «Разработка требований к ПО», глава о визуальном моделировании; UML 2.5.1; BPMN 2.0.2.</p>`,
    refNote: 'Засчитывается от 7 верных из 8.',
    report: ans => { const v = (ans && ans.v) || {}; return PICK.map(p => `- ${p.t.split(': ')[0]}: ${v[p.id] ? DG[v[p.id]].t : '—'}${v[p.id] === p.a ? ' ✓' : ''}`).join('\n'); }
  };

  /* ---------- 2. Найдите ошибки в коде ---------- */
  const FIX = [
    { t: '@startuml' },
    { t: 'actor "Клиент" as U' },
    { t: 'participant "Приложение клиента" as App' },
    { t: 'participant Сервис заказ-нарядов as WO', err: 'Имя с пробелами без кавычек — PlantUML не разберёт строку. Нужно: participant "Сервис заказ-нарядов" as WO.' },
    { t: 'participant "АРМ мастера" as ARM' },
    { t: 'ARM -> WO : предложение: колодки, 2 400 ₽' },
    { t: 'WO => App : предложение доп. работ с фото', err: 'Стрелки «=>» нет. Запрос пишется «->».' },
    { t: 'App -> U', err: 'Стрелка без подписи — непонятно, что получает клиент. Нужно: App -> U : push «Найдена проблема, 2 400 ₽» с фото.' },
    { t: 'U -> App : «Согласен»' },
    { t: 'App -> WO : решение «согласовано»' },
    { t: 'WO -> App : 200 OK', err: 'Это ответ на запрос приложения — его рисуют пунктиром: WO --> App : 200 OK.' },
    { t: 'WO -> ARM : клиент согласился' },
    { t: '@end', err: 'Закрывающая строка — @enduml. Без неё PlantUML ничего не нарисует.' }
  ];
  const FIX_ERR = FIX.map((l, i) => l.err ? i : -1).filter(i => i >= 0);
  const FIX_FIXED = `@startuml
actor "Клиент" as U
participant "Приложение клиента" as App
participant "Сервис заказ-нарядов" as WO
participant "АРМ мастера" as ARM
ARM -> WO : предложение: колодки, 2 400 ₽
WO -> App : предложение доп. работ с фото
App -> U : push «Найдена проблема, 2 400 ₽»
U -> App : «Согласен»
App -> WO : решение «согласовано»
WO --> App : 200 OK
WO -> ARM : клиент согласился
@enduml`;
  function fixEval(marked) { const m = new Set(marked || []); const hit = FIX_ERR.filter(i => m.has(i)).length, wrong = [...m].filter(i => !FIX_ERR.includes(i)).length; return { hit, wrong, score: Math.max(0, (hit - wrong) / FIX_ERR.length) }; }
  const taskFix = {
    id: 'fix', title: 'Найдите ошибки в коде PlantUML',
    simple: howCode.simple,
    lead: ui.brief({
      situation: 'Ника набросала в PlantUML схему согласования доп. работ (BR-6, BR-7), но картинка не рисуется, а Глеб говорит, что и по смыслу не всё так. «Посмотри свежим глазом», — просит Вера.',
      todo: ['Нажмите на строки, в которых есть ошибка: синтаксическая (PlantUML не поймёт) или смысловая (картинка нарисуется, но вводит в заблуждение).', 'Ошибок пять.', 'Нажмите «Проверить». Засчитывается, если найдены все пять и не больше одной лишней отметки.'],
      lookTitle: 'Подсказка', look: 'Проверьте каждую строку по шпаргалке: кавычки у длинных имён, вид стрелки, подписи, ответы пунктиром, последняя строка.'
    }),
    blank: () => ({ m: [] }),
    reference: () => ({ m: FIX_ERR.slice() }),
    render(el, ctx) {
      el.classList.add('m3d-root');
      const a = ctx.ans; a.m = a.m || [];
      const shown = !!ctx.result || ctx.readonly;
      el.innerHTML = `<div class="m3d-root"><div class="m3d-code" role="group" aria-label="Код Ники">${FIX.map((l, i) => {
        const on = a.m.includes(i); let cls = '';
        if (shown) cls = on && l.err ? 'ok' : on && !l.err ? 'bad' : !on && l.err ? 'miss' : '';
        return `<button type="button" class="m3d-line ${cls}" data-fx="${i}" aria-pressed="${on}" ${ctx.readonly ? 'disabled' : ''}><span class="n">${i + 1}</span><span>${esc(l.t)}</span></button>`;
      }).join('')}</div>
      <div class="small dim">Отмечено строк: ${a.m.length}.${shown ? ' Зелёные — ошибка найдена, красные — лишняя отметка, жёлтые — ошибка пропущена.' : ''}</div>
      ${shown ? `<div class="eyebrow">Исправленный код и схема</div>${ui.code(FIX_FIXED, 'text')}<div class="m3d-out"></div>` : ''}</div>`;
      if (shown) drawSeq(TR.$('.m3d-out', el), parseSeq(FIX_FIXED), 'Согласование доп. работ');
      // onclick, а не addEventListener: render вызывается заново после каждой проверки, обработчики не должны копиться
      el.onclick = ctx.readonly ? null : e => {
        const b = e.target.closest('[data-fx]'); if (!b) return;
        const i = +b.dataset.fx; a.m = a.m.includes(i) ? a.m.filter(x => x !== i) : a.m.concat(i).sort((x, y) => x - y); ctx.save();
        b.setAttribute('aria-pressed', String(a.m.includes(i))); b.classList.remove('ok', 'bad', 'miss');
        const cnt = TR.$('.small.dim', el); if (cnt) cnt.textContent = `Отмечено строк: ${a.m.length}.`;
      };
    },
    check(ans) {
      const m = (ans && ans.m) || [], r = fixEval(m), notes = [];
      FIX_ERR.forEach(i => notes.push({ ok: m.includes(i), html: `Строка ${i + 1}: ${esc(FIX[i].err)}${m.includes(i) ? '' : ' — пропущено.'}` }));
      m.filter(i => !FIX_ERR.includes(i)).forEach(i => notes.push({ ok: false, html: `Строка ${i + 1} («${esc(FIX[i].t)}») правильная.${i === 5 ? ' Предложение с ценой формирует мастер-приёмщик (BR-7) — так и нарисовано.' : ''}` }));
      return { ok: r.hit === FIX_ERR.length && r.wrong <= 1, score: r.score, notes, summary: `Найдено ${r.hit} из ${FIX_ERR.length}, лишних отметок: ${r.wrong}.`, mentor: r.hit === FIX_ERR.length ? (r.wrong > 1 ? 'Все ошибки нашли, но и правильные строки отметили. Перед правкой проверяйте, действительно ли строка нарушает правило.' : null) : 'Пройдитесь по шпаргалке: кавычки, вид стрелки, подписи, пунктир у ответов, последняя строка. Каждая ошибка — из этого списка.' };
    },
    explain: `<p>Синтаксические ошибки ломают отрисовку: длинное имя без кавычек, несуществующая стрелка <code>=></code>, закрывающая строка <code>@end</code> вместо <code>@enduml</code>. Смысловые ошибки опаснее: картинка рисуется, но вводит в заблуждение. Стрелка без подписи прячет главное — что получает клиент. Ответ, нарисованный сплошной стрелкой, выглядит как новый запрос, и разработчик решит, что сервис заказ-нарядов сам что-то вызывает в приложении.</p>
      <p>Обратите внимание на строку 6: предложение с ценой отправляет мастер-приёмщик, а не механик — так требует BR-7. Сверять схему с бизнес-правилами — такая же часть проверки, как синтаксис. Источники: документация PlantUML (plantuml.com/ru/sequence-diagram), UML 2.5.1, раздел 17 (Interactions).</p>`,
    refNote: 'Засчитывается, если найдены все пять ошибок и не больше одной лишней отметки.',
    report: ans => { const r = fixEval((ans && ans.m) || []); return `- Найдено ошибок: ${r.hit}/${FIX_ERR.length}, лишних: ${r.wrong}`; }
  };

  /* ---------- 3. Напишите диаграмму кодом ---------- */
  const WRITE_START = `@startuml
actor "Клиент" as U
participant "Приложение клиента" as App
' добавьте участников и стрелки

@enduml`;
  const WRITE_REF = `@startuml
actor "Клиент" as U
participant "Приложение клиента" as App
participant "Сервис уведомлений" as N
participant "Сервис заказ-нарядов" as WO
participant "АРМ мастера" as ARM
ARM -> WO : предложение доп. работ: колодки, 2 400 ₽, фото
WO -> N : событие «предложение отправлено»
N -> App : push «Найдена проблема»
U -> App : открывает фото, нажимает «Согласен»
App -> WO : POST /offers/42/approve
WO --> App : 200 OK
WO -> ARM : статус «Согласовано»
@enduml`;
  const has = (res, re) => res.lanes.some(l => re.test(TR.norm(l.t)));
  const FEATS = [
    { id: 'lanes', t: 'Не меньше четырёх участников', f: r => r.lanes.length >= 4 },
    { id: 'who', t: 'Есть клиент, мастер (или АРМ мастера) и сервис заказ-нарядов', f: r => has(r, /клиент/) && has(r, /мастер|арм/) && has(r, /заказ/) },
    { id: 'ntf', t: 'Клиент узнаёт о предложении через уведомление (push или сервис уведомлений)', f: r => has(r, /уведом|push|пуш/) || r.steps.some(s => /push|пуш|уведом/.test(TR.norm(s.t))) },
    { id: 'steps', t: 'Не меньше пяти сообщений', f: r => r.steps.length >= 5 },
    { id: 'words', t: 'В подписях есть предложение и согласие клиента', f: r => r.steps.some(s => /предлож/.test(TR.norm(s.t))) && r.steps.some(s => /соглас/.test(TR.norm(s.t))) },
    { id: 'reply', t: 'Хотя бы один ответ нарисован пунктиром — стрелкой с двумя чёрточками', f: r => r.steps.some(s => s.reply) },
    { id: 'clean', t: 'Все стрелки подписаны и код без ошибок разбора', f: r => r.steps.length > 0 && !r.steps.some(s => s.bare) && !r.msgs.some(m => m.kind === 'bad') }
  ];
  function writeEval(text) { const res = parseSeq(text); const on = FEATS.map(f => !!f.f(res)); return { res, on, n: on.filter(Boolean).length, score: on.filter(Boolean).length / FEATS.length }; }
  const taskWrite = {
    id: 'write', title: 'Нарисуйте согласование доп. работ кодом',
    lead: ui.brief({
      situation: 'Глеб: «Положи в репозиторий схему согласования доп. работ кодом — PlantUML или Mermaid, как удобнее. Мастер отправляет предложение, клиенту приходит push, клиент соглашается в приложении, мастер видит, что можно делать».',
      todo: ['Напишите sequence-диаграмму в PlantUML или Mermaid. Схема рядом перерисовывается, пока вы пишете.', 'Следите за признаками под редактором — они отмечаются вживую.', 'Нажмите «Проверить». Засчитывается, если выполнено 6 признаков из 7, включая «код без ошибок разбора».'],
      lookTitle: 'Подсказка', look: 'Участники: клиент, приложение клиента, сервис уведомлений, сервис заказ-нарядов, АРМ мастера. Предложение с ценой формирует мастер-приёмщик (BR-7), согласие клиента обязательно (BR-6). Ответ сервиса — пунктиром.'
    }),
    blank: () => ({ text: '' }),
    reference: () => ({ text: WRITE_REF }),
    render(el, ctx) {
      el.classList.add('m3d-root');
      const a = ctx.ans; if (typeof a.text !== 'string' || (!a.text && !ctx.readonly)) a.text = a.text || WRITE_START;
      el.innerHTML = `<div class="m3d-root"><div class="m3d-two m3d-ed"><div class="stack"><textarea spellcheck="false" aria-label="Код диаграммы" ${ctx.readonly ? 'readonly' : ''}></textarea><div class="m3d-msgs stack" aria-live="polite"></div></div><div class="m3d-out"></div></div>
        <div class="eyebrow">Признаки</div><div class="m3d-feats" aria-live="polite"></div>
        <details class="small"><summary>Шпаргалка: PlantUML и Mermaid</summary>${ui.code('PlantUML:\n  participant "Сервис заказ-нарядов" as WO\n  ARM -> WO : предложение\n  WO --> App : 200 OK\nMermaid:\n  sequenceDiagram\n  participant WO as Сервис заказ-нарядов\n  ARM->>WO: предложение\n  WO-->>App: 200 OK', 'text')}</details></div>`;
      const ta = TR.$('textarea', el);
      ta.value = a.text;
      const upd = () => {
        const ev = writeEval(ta.value);
        TR.$('.m3d-feats', el).innerHTML = FEATS.map((f, i) => `<div class="m3d-feat ${ev.on[i] ? 'on' : ''}"><span class="mk">${ev.on[i] ? '✓' : '○'}</span><span>${esc(f.t)}</span></div>`).join('');
        TR.$('.m3d-msgs', el).innerHTML = ev.res.msgs.slice(0, 5).map(m => `<div class="m3d-msg ${m.kind === 'bad' ? '' : 'warn'}">${m.n ? `Строка ${m.n}: ` : ''}${esc(m.t)}</div>`).join('');
        drawSeq(TR.$('.m3d-out', el), ev.res, 'Согласование доп. работ');
      };
      if (!ctx.readonly) ta.addEventListener('input', () => { a.text = ta.value; ctx.save(); upd(); });
      upd();
    },
    check(ans) {
      const ev = writeEval((ans && ans.text) || ''), notes = [];
      FEATS.forEach((f, i) => notes.push({ ok: ev.on[i], html: esc(f.t) + (ev.on[i] ? '' : ' — не выполнено.') }));
      ev.res.msgs.filter(m => m.kind === 'bad').slice(0, 3).forEach(m => notes.push({ ok: false, html: `${m.n ? `Строка ${m.n}: ` : ''}${esc(m.t)}` }));
      const clean = ev.on[FEATS.length - 1];
      return { ok: ev.n >= 6 && clean, score: ev.score, notes, summary: `Признаков: ${ev.n} из ${FEATS.length}.`, mentor: ev.n >= 6 && clean ? null : !clean ? 'Сначала добейтесь, чтобы код разбирался без ошибок и все стрелки были подписаны: схема, которая не рисуется, команде не поможет.' : 'Проверьте, что в схеме есть весь путь: мастер → сервис заказ-нарядов → уведомление → клиент → согласие → мастер.' };
    },
    explain: `<p>В эталоне пять участников и семь сообщений: мастер-приёмщик формирует предложение с ценой и фото (BR-7), сервис заказ-нарядов публикует событие, сервис уведомлений отправляет push, клиент соглашается в приложении (BR-6), приложение передаёт решение, сервис отвечает пунктиром и меняет статус, мастер видит «Согласовано». Писать можно и в Mermaid — смысл тот же, меняется только синтаксис стрелок и участников.</p>
      <p>Что стоит добавить в настоящую постановку: ветку BR-8 (нет ответа 20 минут — мастер звонит) через фрагмент <code>alt</code>, а для корпоративных клиентов — автосогласование до лимита (BR-9). Код кладут в репозиторий рядом с требованиями: при изменении процесса схему правят в том же коммите. Источники: plantuml.com/ru/sequence-diagram, mermaid.js.org/syntax/sequenceDiagram.html, UML 2.5.1, раздел 17.</p>`,
    refNote: 'Засчитывается любой код PlantUML или Mermaid, если выполнено 6 признаков из 7 и код разбирается без ошибок.',
    report: ans => { const ev = writeEval((ans && ans.text) || ''); return `- Признаков: ${ev.n}/${FEATS.length}\n\n\`\`\`\n${(ans && ans.text) || ''}\n\`\`\``; }
  };

  /* ---------- 4. Лаборатория: защита проектирования ---------- */
  const AUD = [
    { id: 'timur', ask: 'Зачем всё это? Где мы теряем клиентов и что изменится для них?', a: 'cjm', good: '«Вот, теперь вижу: дозвон и ожидание без статуса — там они и уходят. И видно, что закрывает каждая функция. Беру».' },
    { id: 'marina', ask: 'Как изменится моя работа на приёмке: что делаю я, что механик?', a: 'bpmn', good: '«Понятно: доп. работы я больше не согласую звонками, мне только отправить предложение. И видно, где я жду клиента».' },
    { id: 'gleb', ask: 'Что происходит между приложением, платёжным сервисом и ЮKassa — и что при отказе банка?', a: 'sequence', good: '«Вызовы, вебхук, ветка отказа — всё на месте. По этому можно делать оценку».' },
    { id: 'liza', ask: 'Какие статусы у записи и какие переходы мне проверять?', a: 'state', good: '«Шесть статусов и все переходы с условиями. Из этого я сразу делаю тест-кейсы».' },
    { id: 'olga', ask: 'Какие данные об оплатах уходят в 1С и откуда они берутся?', a: 'dfd', good: '«Вижу: оплата из ЮKassa, касса станции, выгрузка в 1С раз в 15 минут. Понятно, где сверять, если не сойдётся».' },
    { id: 'artem', ask: 'Успеваем ли к 15 марта и что поедет, если оплата задержится?', a: 'gantt', good: '«Критический путь виден: оплата держит пилот. Значит, интеграцию с ЮKassa начинаем раньше».' }
  ];
  const AUD_CHOICES = ['cjm', 'bpmn', 'sequence', 'state', 'c4', 'erd', 'dfd', 'deployment', 'gantt'].map(v => ({ v, t: DG[v].t }));
  const BADREACT = {
    timur: 'Квадратики, стрелки, какие-то статусы… Я спрашивал, где мы теряем клиентов.',
    marina: 'Тут системы и запросы, а меня интересует, кто из людей что делает утром.',
    gleb: 'Красиво, но мне нужен порядок вызовов и что будет, если банк отказал.',
    liza: 'Мне нечего из этого взять в тест-кейсы: где статусы и переходы?',
    olga: 'Не вижу, откуда берутся цифры и куда они уходят. Как мне сверять?',
    artem: 'Где сроки и зависимости? Я так и не понял, успеваем ли.'
  };
  function audEval(v) { v = v || {}; const good = AUD.filter(p => v[p.id] === p.a).length; return { good, score: good / AUD.length }; }
  const taskDefense = {
    id: 'defense', title: 'Лаборатория: защита проектирования',
    simple: howGood.simple,
    lead: ui.brief({
      situation: 'Понедельник, защита. В зале шестеро, у каждого свой вопрос. Вера: «Покажешь каждому одну схему — ту, что отвечает на его вопрос. Не угадаешь — человек уйдёт со своим вопросом, а доверие к проекту упадёт».',
      todo: ['Для каждого слушателя выберите диаграмму, которую покажете.', 'Нажмите «Проверить» — увидите, как отреагирует каждый.', 'Засчитывается, если довольны хотя бы пятеро из шести.'],
      lookTitle: 'Подсказка', look: 'Слушайте вопрос, а не должность. Бухгалтер спрашивает о движении данных, тестировщица — о статусах, руководитель проекта — о сроках.'
    }),
    blank: () => ({ v: {} }),
    reference: () => ({ v: Object.fromEntries(AUD.map(p => [p.id, p.a])) }),
    render(el, ctx) {
      el.classList.add('m3d-root');
      const a = ctx.ans; a.v = a.v || {};
      const shown = !!ctx.result || ctx.readonly, ev = audEval(a.v);
      el.innerHTML = `<div class="m3d-root">${shown ? `<div class="row"><b>Довольны: ${ev.good} из ${AUD.length}</b>${ui.meter(ev.score)}</div>` : ''}
        <div class="m3d-aud">${AUD.map(p => {
          const P = TR.PEOPLE[p.id], sel = a.v[p.id];
          const react = shown && sel ? (sel === p.a ? `<div class="m3d-react ok">${esc(p.good)}</div>` : `<div class="m3d-react bad">«${esc(BADREACT[p.id])}» Вы показали ${esc(DG[sel].t)} — она отвечает на вопрос «${esc(DG[sel].q)}».</div>`) : shown ? `<div class="m3d-react bad">Вы ничего не показали — вопрос остался без ответа.</div>` : '';
          return `<div class="m3d-person"><span class="ava">${esc(P.ini)}</span><div><div class="who">${esc(P.name)}</div><div class="role">${esc(P.role)}</div><div class="ask">«${esc(p.ask)}»</div></div>
            <select data-aud="${p.id}" aria-label="Диаграмма для: ${esc(P.name)}" ${ctx.readonly ? 'disabled' : ''}><option value="">Что показать?</option>${AUD_CHOICES.map(c => `<option value="${c.v}" ${sel === c.v ? 'selected' : ''}>${esc(c.t)}</option>`).join('')}</select>${react}</div>`;
        }).join('')}</div></div>`;
      el.onchange = ctx.readonly ? null : e => { const s = e.target.closest('[data-aud]'); if (!s) return; if (s.value) a.v[s.dataset.aud] = s.value; else delete a.v[s.dataset.aud]; ctx.save(); const row = s.closest('.m3d-person'), r = row && row.querySelector('.m3d-react'); if (r) r.remove(); };
    },
    check(ans) {
      const v = (ans && ans.v) || {}, r = audEval(v), notes = [];
      AUD.forEach(p => {
        const P = TR.PEOPLE[p.id];
        if (v[p.id] === p.a) notes.push({ ok: true, html: `${esc(P.name)}: ${esc(DG[p.a].t)} — в точку.` });
        else notes.push({ ok: false, html: `${esc(P.name)} спрашивал(а): «${esc(p.ask)}» Это вопрос «${esc(DG[p.a].q)}» — ответ даёт ${esc(DG[p.a].t)}.` });
      });
      return { ok: r.good >= 5, score: r.score, notes, summary: `Довольны ${r.good} из ${AUD.length}.`, mentor: r.good >= 5 ? null : 'На защите каждому нужен ответ на его вопрос. Переведите вопрос в «что показать»: путь клиента, работа людей, вызовы систем, статусы, потоки данных, сроки.' };
    },
    explain: `<p>Пакет для защиты: Тимуру Рашидовичу — CJM (где теряем клиентов и что изменится), Марине Олеговне — BPMN «как будет» (её работа и работа механика), Глебу — sequence оплаты с веткой отказа, Лизе — диаграмма состояний записи, Ольге Викторовне — DFD (откуда берутся данные об оплатах и куда уходят), Артёму — Гант с критическим путём.</p>
      <p>Обратите внимание: C4 и диаграмма развёртывания — хорошие схемы, но сегодня их никто не спросил. Лишняя схема на защите отнимает внимание. Правило «одна схема — один вопрос — один читатель» — основа подхода «точек зрения» в архитектурной документации (ISO/IEC/IEEE 42010) и раздела 10 BABOK.</p>`,
    refNote: 'Засчитывается, если довольны хотя бы пятеро из шести.',
    report: ans => { const v = (ans && ans.v) || {}; return AUD.map(p => `- ${TR.PEOPLE[p.id].name}: ${v[p.id] ? DG[v[p.id]].t : '—'}${v[p.id] === p.a ? ' ✓' : ''}`).join('\n'); }
  };

  /* ---------- 5. Ответ Тимуру Рашидовичу ---------- */
  const J_RUBRIC = [
    'Объясняет, что одна схема «про всё» не помогает: владельцу слишком подробно, разработчику слишком общо',
    'Говорит, что каждая схема отвечает на свой вопрос и для своего читателя, приводит хотя бы два примера (CJM — для него, sequence или ERD — для разработчиков)',
    'Показывает пользу для бизнеса: меньше ошибок и переделок, быстрее оценка, тестировщики проверяют по схемам',
    'Объясняет, почему схемы кодом: лежат рядом с требованиями, обновляются вместе с ними и не устаревают',
    'Говорит коротко и без жаргона; если упоминает термин (sequence, BPMN), объясняет его'
  ];
  const J_REF = 'Тимур Рашидович, одна большая схема «про всё» выглядела бы как карта Казани со всеми трубами и проводами: вам там слишком подробно, а Глебу всё равно не хватит деталей. Поэтому у нас пакет: каждая схема отвечает на один вопрос для одного человека. Для вас — карта пути клиента: где Елена злится и уходит и какая функция это закрывает. Для Марины Олеговны — схема процесса приёмки: кто из людей что делает. Для разработчиков — схема обмена между приложением, оплатой и ЮKassa, включая отказ банка, и схема таблиц базы. Для Лизы — схема статусов, по ней она пишет проверки. Это экономит ваши деньги: разработчики не додумывают, ошибки ловим на бумаге, а не после запуска, и оценки точнее. Схемы мы храним текстом рядом с требованиями: поменялось правило — в том же месте поправили схему, поэтому она не устареет к весне.';
  const taskExplain = {
    id: 'explain', title: 'Объясните Тимуру Рашидовичу, зачем столько схем',
    lead: ui.brief({
      situation: 'После защиты Тимур Рашидович ловит вас в коридоре: «Слушайте, зачем столько картинок? Нарисуйте одну большую, где всё, — я её на стену повешу».',
      todo: ['Ответьте своими словами, от 200 символов: почему пакет схем, а не одна; кому какая; что это даёт бизнесу; почему схемы храним кодом.', 'Проверьте ответ по рубрике (или попросите Веру).', 'Нажмите «Проверить». Засчитывается от 60 % по рубрике.'],
      lookTitle: 'Подсказка', look: 'Говорите на языке владельца: клиенты, деньги, сроки, риски. Сравнение с картами или схемами машины работает лучше терминов.'
    }),
    blank: () => ({ j: {} }),
    reference: () => ({ j: { text: J_REF, self: J_RUBRIC.map(() => true) } }),
    render(el, ctx) {
      el.classList.add('m3d-root');
      const a = ctx.ans; a.j = a.j || {};
      el.innerHTML = `<div class="m3d-root">${ui.say('timur', 'Зачем столько картинок? Нарисуйте одну большую, где всё, — я её на стену повешу.')}<div data-j></div></div>`;
      ui.justify(TR.$('[data-j]', el), {
        id: 'm3d-timur', q: 'Что ответить Тимуру Рашидовичу?',
        qPlain: 'Объясните владельцу сети автосервисов, почему проект описывают пакетом диаграмм, а не одной большой схемой, кому какая схема нужна, что это даёт бизнесу и почему схемы хранят текстом (кодом) рядом с требованиями.',
        rubric: J_RUBRIC, reference: J_REF, value: a.j, readonly: ctx.readonly, minLen: 200,
        placeholder: 'Тимур Рашидович, …',
        onChange: v => { a.j = v; ctx.save(); ctx.decide('Ответ Тимуру: зачем пакет диаграмм', v.text || ''); }
      });
    },
    check(ans) {
      const j = ui.justifyScore(ans && ans.j), notes = [];
      if (!j) notes.push({ ok: false, html: 'Ответ не написан или не оценён: от 200 символов, затем проверка по рубрике или с Верой.' });
      else notes.push({ ok: j >= 0.6 ? true : 'warn', html: `Ответ: ${pct(j)} по рубрике.${j < 0.6 ? ' Скажите, кому какая схема и что это даёт бизнесу, — а не как называются нотации.' : ''}` });
      return { ok: j >= 0.6, score: j, notes, summary: `Ответ: ${pct(j)} по рубрике.`, mentor: j >= 0.6 ? null : 'Тимуру Рашидовичу не важны названия диаграмм. Ему важно: клиенты, деньги, сроки. Объясните пакет схем этим языком.' };
    },
    explain: `<p>Сильный ответ строится вокруг пользы для владельца: одна схема «про всё» не отвечает ни на один вопрос — ему слишком подробно, разработчику слишком общо. Пакет схем — это ответы разным людям: CJM — о клиентах и деньгах, BPMN — о работе сотрудников, sequence и ERD — для разработки, диаграмма состояний — для тестирования. Это снижает переделки и делает оценки точнее.</p>
      <p>Хранение схем кодом рядом с требованиями — аргумент про актуальность: схема меняется вместе с правилом и не устаревает. Источники: ISO/IEC/IEEE 42010 (точки зрения на архитектуру), BABOK v3, раздел 10; Саймон Браун, c4model.com («карты разного масштаба»).</p>`,
    refNote: 'Оценивается по рубрике: самопроверка или проверка Claude.',
    report: ans => `- Ответ Тимуру (${pct(ui.justifyScore(ans && ans.j))}): ${(ans && ans.j && ans.j.text) || '—'}`
  };

  TR.stage({
    id: ID,
    when: 'пятница, 15 января, 11:00 · защита проектирования: пакет диаграмм «Искра Онлайн»',
    intro: [
      { who: 'artem', html: 'В понедельник защищаем проектирование — сначала перед Тимуром Рашидовичем, потом перед командой. А у нас в папке двадцать картинок вперемешку: где-то BPMN, где-то квадратики Глеба, где-то фото доски. Никто не понимает, какая на какой вопрос отвечает.' },
      { who: 'gleb', html: 'И картинки из draw.io устаревают через неделю: правило поменяли, а схему никто не перерисовал. Давайте держать схемы кодом — PlantUML в репозитории, рядом с требованиями. Даша просит Mermaid: GitLab рисует его прямо в описании задачи.' },
      { who: 'vera', html: 'Сегодня соберём пакет: для каждого вопроса — своя диаграмма, для каждого читателя — свой уровень. И научимся писать схемы кодом в PlantUML и Mermaid. Если какую-то диаграмму видите впервые — в шапке есть кнопка «📐 Диаграммы» со справочником по всем видам.' }
    ],
    glossary: [
      { term: 'Нотация', simple: 'Правила рисования: какая фигура что значит.', tech: 'Набор графических элементов и правил их сочетания: BPMN 2.0, UML 2.5, C4.' },
      { term: 'Диаграмма как код', simple: 'Схему не рисуют мышкой, а описывают текстом.', tech: 'Diagrams as code: исходник диаграммы — текст в git; версии, ревью, автоматическая отрисовка (PlantUML, Mermaid, Structurizr).' },
      { term: 'PlantUML', simple: 'Пишете текст — получаете UML-диаграмму.', tech: 'Язык и инструмент описания диаграмм: UML, C4, ERD, Гант, майнд-карты. Пара строк @startuml … @enduml.' },
      { term: 'Mermaid', simple: 'Диаграммы из текста прямо в документации.', tech: 'JavaScript-библиотека; встроена в GitLab, GitHub, Notion (блок ```mermaid в Markdown).' },
      { term: 'Алиас', simple: 'Короткое имя участника для стрелок.', tech: 'В PlantUML: participant "Сервис заказ-нарядов" as WO — дальше в стрелках пишут WO.' },
      { term: 'Уровень детализации', simple: 'Насколько подробно показана система.', tech: 'Одна диаграмма — один уровень абстракции; детали выносят в отдельные диаграммы (принцип «карт разного масштаба» C4).' }
    ],
    outro: 'Пакет к защите собран: каждому — своя схема, и все лежат кодом рядом с требованиями. Модуль 3 закрыт: вы умеете показать путь клиента, процесс, обмен систем и состав системы. С понедельника — модуль 4, данные: начнём с Excel Марины Олеговны и первой базы.',
    tasks: [howMap, howCode, howGood, taskPick, taskFix, taskWrite, taskDefense, taskExplain]
  });
})();
