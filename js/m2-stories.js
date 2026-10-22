/* Модуль 2, занятие 2: User Story и Use Case.
   Теория: пользовательская история — роль, действие, ценность; что ломается без каждой части; 3C (карточка, разговор,
   подтверждение); эпик → история → задача; критерии приёмки. INVEST — шесть букв на примерах «Искры» и приёмы нарезки
   историй. Use Case по Кокберну на примере «Записаться на ТО» (поля шаблона, основной сценарий, расширения), уровни
   целей, диаграмма вариантов использования UML (include, extend), история или сценарий — сравнение.
   Практика: собрать историю «напоминание о записи» из частей и отсеять лишние критерии; INVEST-фильтр 8 историй;
   лаборатория «Согласовать доп. работы» — порядок основного потока, привязка расширений (BR-8, BR-9, отказ) и прогон
   шести случаев Лизой с последствиями; выбрать формат для 9 ситуаций; своими словами Глебу — когда история, когда сценарий. */
'use strict';
(function () {
  const TR = window.TR, ui = TR.ui, esc = TR.esc;
  const ID = 'm2-stories';

  if (!document.getElementById('m2s-css')) document.head.insertAdjacentHTML('beforeend', `<style id="m2s-css">
    .m2s-root, .m2s-root .stack > * { min-width: 0; }
    .m2s-root .seg button { white-space: normal; text-align: left; }
    .m2s-h3 { font: 600 18px/1.3 var(--f-brand); margin: 0; }
    .m2s-sticker { position: relative; padding: 16px 18px; border-radius: 4px 4px 16px 4px; background: var(--warn-soft); border: 1px solid color-mix(in srgb, var(--warn) 40%, var(--border)); box-shadow: 0 6px 16px -10px rgba(0,0,0,.5); font: 500 16px/1.5 var(--f-brand); max-width: 560px; overflow-wrap: anywhere; }
    .m2s-sticker .p { border-radius: 4px; padding: 0 3px; }
    .m2s-sticker .p.role { background: var(--info-soft); color: var(--info); }
    .m2s-sticker .p.act { background: var(--ok-soft); color: var(--ok); }
    .m2s-sticker .p.val { background: var(--violet-soft); color: var(--violet); }
    .m2s-sticker .p.miss { background: var(--bad-soft); color: var(--bad); text-decoration: line-through; }
    .m2s-sticker .p.empty { color: var(--text-muted); font-style: italic; }
    .m2s-sticker .id { display: block; font: 600 11px/1 var(--f-mono); color: var(--text-muted); margin-bottom: 8px; letter-spacing: .08em; }
    .m2s-3c { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
    .m2s-3c button { font: inherit; text-align: left; color: inherit; border: 1px solid var(--border-strong); background: var(--surface-2); border-radius: 12px; padding: 10px 12px; cursor: pointer; display: grid; gap: 4px; min-width: 0; }
    .m2s-3c button[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); }
    .m2s-3c .big { font: 700 22px/1 var(--f-mono); color: var(--accent); }
    .m2s-3c small { color: var(--text-muted); font-size: 12.5px; }
    .m2s-tree { display: grid; gap: 6px; }
    .m2s-node { display: block; width: 100%; text-align: left; font: inherit; font-size: 13.5px; color: inherit; border: 1px solid var(--border); border-radius: 10px; padding: 7px 10px; background: var(--surface); cursor: pointer; min-width: 0; overflow-wrap: anywhere; }
    .m2s-node.ep { background: var(--accent-soft); border-color: color-mix(in srgb, var(--accent) 50%, var(--border)); font-weight: 600; }
    .m2s-node.st { background: var(--warn-soft); }
    .m2s-node.tk { background: var(--surface-2); font-size: 13px; cursor: default; }
    .m2s-node[aria-pressed="true"] { box-shadow: 0 0 0 2px var(--accent); }
    .m2s-node .tg { font: 600 10px/1 var(--f-mono); color: var(--text-muted); margin-right: 6px; letter-spacing: .06em; }
    .m2s-kids { display: grid; gap: 6px; margin-left: 14px; padding-left: 10px; border-left: 2px solid var(--border); }
    .m2s-letters { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 6px; }
    .m2s-letters button { font: inherit; border: 1px solid var(--border-strong); background: var(--surface-2); color: inherit; border-radius: 12px; padding: 10px 4px; cursor: pointer; display: grid; gap: 2px; justify-items: center; min-width: 0; }
    .m2s-letters button b { font: 700 24px/1 var(--f-mono); color: var(--accent); }
    .m2s-letters button small { font-size: 11px; color: var(--text-muted); text-align: center; line-height: 1.2; overflow-wrap: anywhere; }
    .m2s-letters button[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); }
    .m2s-facts { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
    .m2s-fact { padding: 9px 12px; border-radius: 10px; background: var(--surface); border: 1px solid var(--border); font-size: 14px; min-width: 0; overflow-wrap: anywhere; }
    .m2s-fact > b { display: block; font: 600 10.5px/1.3 var(--f-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 3px; }
    .m2s-fact.bad { border-color: color-mix(in srgb, var(--bad) 45%, var(--border)); background: var(--bad-soft); }
    .m2s-fact.ok { border-color: color-mix(in srgb, var(--ok) 45%, var(--border)); background: var(--ok-soft); }
    .m2s-fact.wide { grid-column: 1 / -1; }
    .m2s-uc { display: grid; gap: 6px; }
    .m2s-sec { display: grid; grid-template-columns: minmax(0, 170px) minmax(0, 1fr); gap: 10px; width: 100%; text-align: left; font: inherit; font-size: 14px; color: inherit; border: 1px solid var(--border); border-radius: 10px; padding: 8px 10px; background: var(--surface); cursor: pointer; min-width: 0; }
    .m2s-sec:hover { border-color: var(--border-strong); }
    .m2s-sec[aria-pressed="true"] { border-color: var(--accent); box-shadow: 0 0 0 1px var(--accent); }
    .m2s-sec .k { font: 600 11px/1.4 var(--f-mono); letter-spacing: .06em; text-transform: uppercase; color: var(--text-muted); }
    .m2s-sec .v { min-width: 0; overflow-wrap: anywhere; }
    .m2s-sec ol { margin: 0; padding-left: 20px; } .m2s-sec ul { margin: 0; padding-left: 0; list-style: none; }
    .m2s-sec li { margin: 2px 0; }
    .m2s-levels { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 6px; }
    .m2s-levels button { font: inherit; font-size: 12.5px; border: 1px solid var(--border-strong); background: var(--surface-2); color: inherit; border-radius: 10px; padding: 8px 4px; cursor: pointer; display: grid; gap: 3px; justify-items: center; text-align: center; min-width: 0; }
    .m2s-levels button span:first-child { font-size: 22px; }
    .m2s-levels button[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); }
    .m2s-svgbox { overflow-x: auto; border: 1px solid var(--border); border-radius: 12px; background: var(--surface); padding: 8px; max-width: 100%; }
    .m2s-svgbox svg { display: block; min-width: 560px; width: 100%; height: auto; }
    .m2s-svgbox text { fill: var(--text); font: 13px var(--f-body); }
    .m2s-svgbox .lbl { fill: var(--text-muted); font: 600 11px var(--f-mono); }
    .m2s-svgbox .uc { fill: var(--surface-2); stroke: var(--border-strong); stroke-width: 1.5; cursor: pointer; }
    .m2s-svgbox .uc.on { stroke: var(--accent); stroke-width: 2.5; fill: var(--accent-soft); }
    .m2s-svgbox .ln { stroke: var(--text-2); stroke-width: 1.4; fill: none; }
    .m2s-svgbox .dash { stroke-dasharray: 5 4; }
    .m2s-svgbox .bound { fill: none; stroke: var(--border-strong); stroke-width: 1.5; }
    .m2s-svgbox .act { stroke: var(--text); stroke-width: 1.8; fill: none; }
    .m2s-svgbox .arrow { fill: var(--text-2); }
    .m2s-slots { display: grid; gap: 10px; }
    .m2s-slot { display: grid; gap: 6px; }
    .m2s-opts { display: grid; gap: 6px; }
    .m2s-opt { display: grid; grid-template-columns: 20px minmax(0, 1fr); gap: 8px; align-items: start; text-align: left; font: inherit; font-size: 14px; color: inherit; background: var(--surface-2); border: 1px solid var(--border); border-radius: 10px; padding: 8px 11px; cursor: pointer; min-width: 0; }
    .m2s-opt .bx { width: 16px; height: 16px; margin-top: 2px; border-radius: 50%; border: 2px solid var(--border-strong); }
    .m2s-opt[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); }
    .m2s-opt[aria-pressed="true"] .bx { border-color: var(--accent); background: var(--accent); }
    .m2s-opt.ok { border-color: var(--ok); background: var(--ok-soft); } .m2s-opt.bad { border-color: var(--bad); background: var(--bad-soft); } .m2s-opt.warn { border-color: var(--warn); background: var(--warn-soft); }
    .m2s-opt:disabled { cursor: default; }
    .m2s-opt:disabled:not([aria-pressed="true"]) { opacity: .55; }
    .m2s-line { padding: 9px 11px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface); display: grid; gap: 7px; min-width: 0; }
    .m2s-line.ok { border-color: var(--ok); background: var(--ok-soft); } .m2s-line.bad { border-color: var(--bad); background: var(--bad-soft); }
    .m2s-line.warn { border-color: var(--warn); background: var(--warn-soft); }
    .m2s-line .tx { font-size: 14px; overflow-wrap: anywhere; }
    .m2s-line .why { font-size: 13px; color: var(--text-2); }
    .m2s-ext { border: 1px solid var(--border); border-radius: 12px; background: var(--surface); padding: 12px 14px; display: grid; gap: 8px; min-width: 0; }
    .m2s-ext > header { display: flex; gap: 8px; flex-wrap: wrap; align-items: baseline; }
    .m2s-ext > header .n { font: 600 11px/1 var(--f-mono); letter-spacing: .1em; color: var(--accent); text-transform: uppercase; }
    .m2s-ext > header b { font: 600 15px/1.3 var(--f-brand); }
    .m2s-ext .at { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; font-size: 13.5px; }
    .m2s-ext .at select { width: auto; min-width: 150px; max-width: 100%; }
    .m2s-stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; }
    .m2s-stats .v { font-size: 17px; }
    .m2s-runs { display: grid; gap: 8px; }
    .m2s-run { border: 1px solid var(--border); border-left: 4px solid var(--border-strong); border-radius: 10px; padding: 9px 12px; background: var(--surface); display: grid; gap: 4px; font-size: 13.5px; min-width: 0; }
    .m2s-run.good { border-left-color: var(--ok); } .m2s-run.bad { border-left-color: var(--bad); } .m2s-run.mid { border-left-color: var(--warn); }
    .m2s-run .hd { display: flex; flex-wrap: wrap; gap: 8px; justify-content: space-between; font-weight: 600; font-size: 14px; }
    .m2s-run .mn { font: 600 12px/1.4 var(--f-mono); color: var(--text-muted); white-space: nowrap; }
    .m2s-run .tx { color: var(--text-2); }
    .m2s-crit { display: grid; gap: 6px; }
    .m2s-crit .m2s-line { grid-template-columns: minmax(0, 1fr) auto; align-items: center; }
    .m2s-crit .m2s-line .why { grid-column: 1 / -1; }
    @media (max-width: 760px) {
      .m2s-3c, .m2s-facts { grid-template-columns: minmax(0, 1fr); }
      .m2s-fact.wide { grid-column: auto; }
      .m2s-letters { grid-template-columns: repeat(3, minmax(0, 1fr)); }
      .m2s-levels { grid-template-columns: repeat(3, minmax(0, 1fr)); }
      .m2s-sec { grid-template-columns: minmax(0, 1fr); gap: 2px; }
      .m2s-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .m2s-crit .m2s-line { grid-template-columns: minmax(0, 1fr); }
    }
  </style>`);

  // ---------- общие помощники ----------
  const talk = lines => `<div class="talk">${lines.map(x => x.who === 'sys' ? ui.note(x.k || '', x.title || '', x.html) : ui.say(x.who, x.html)).join('')}</div>`;
  const anNote = html => `<div style="margin-top:12px">${ui.note('info', 'Позиция аналитика', html)}</div>`;
  const interview = (q, a) => ui.note('', 'Как об этом спрашивают на собеседовании', `<b>«${q}»</b><br>${a}`);
  const mark = s => s === 'ok' ? '✓' : s === 'warn' ? '≈' : '✗';
  const quizRef = cfg => cfg.options.map((o, i) => o.ok ? i : -1).filter(i => i >= 0);
  const signed = n => (n > 0 ? '+' : '') + n;

  // =====================================================================
  // Теория 1. Пользовательская история: роль, действие, ценность, 3C
  // =====================================================================
  const ANAT = [
    { v: 'full', t: 'Полная', role: 'клиентка, записанная на ТО', act: 'получить push с готовностью машины', val: 'забрать её до конца следующего дня, пока хранение бесплатное', note: { k: 'ok', h: 'Всё на месте: <b>кто</b> (у него своя ситуация), <b>что</b> (одно действие), <b>зачем</b> (ценность, по которой понятно, когда история «сработала»). Правило BR-13 всплывёт в разговоре и в критериях.' } },
    { v: 'norole', t: 'Без роли', role: '', act: 'получить push с готовностью машины', val: 'забрать её вовремя', note: { k: 'bad', h: 'Для кого? Для клиентки, для завгара «Шашки» или для мастера? У Рустама счёт раз в месяц и машины забирают водители — ему нужно другое уведомление. «Как пользователь» — та же беда: роль безликая.' } },
    { v: 'noval', t: 'Без ценности', role: 'клиентка, записанная на ТО', act: 'получить push с готовностью машины', val: '', note: { k: 'bad', h: 'Зачем? Без «чтобы…» нельзя ни расставить приоритеты, ни понять, что считать успехом. Может, ей важнее время готовности заранее, а не push по факту?' } },
    { v: 'sol', t: 'Решение вместо потребности', role: 'клиентка', act: 'чтобы сервер раз в минуту опрашивал статус заказ-наряда и слал push через Firebase', val: 'знать, что машина готова', note: { k: 'bad', h: 'Действие превратилось в техническое задание. Как отправлять — решает Глеб. История говорит, <b>что нужно человеку</b>, и оставляет команде простор для решения (буква N в INVEST).' } },
    { v: 'sys', t: 'От имени системы', role: 'система', act: 'отправить push при статусе «Готов»', val: 'клиент знал', note: { k: 'bad', h: '«Как система, я хочу…» — это функциональное требование в костюме истории. Человек и его ситуация пропали, а с ними — вопросы «а если push выключен?», «а если вечер?».' } }
  ];
  const C3 = [
    { id: 'card', l: 'C', t: 'Card · карточка', s: 'обещание разговора', h: 'Стикер в 1–2 строки: роль, действие, ценность. Это не спецификация, а напоминание «нам надо об этом поговорить». У нас — «Как клиентка, я хочу получить push, когда машина готова, чтобы забрать её, пока хранение бесплатное».' },
    { id: 'conv', l: 'C', t: 'Conversation · разговор', s: 'детали — в обсуждении', h: 'Детали выясняются в разговоре аналитика, команды и бизнеса. Ниже — пять минут у стены со стикерами.', talk: [{ who: 'dasha', html: 'А если push выключен?' }, { who: 'vera', html: 'Тогда SMS — по BR-13 при «Готов» шлём оба.' }, { who: 'liza', html: 'Готов в 20:50, станция закрывается в 21:00. Бесплатно до конца следующего дня — это до 21:00 завтра?' }, { who: 'marina', html: 'До закрытия станции следующего дня, да. Дальше 500 ₽ в сутки.' }] },
    { id: 'conf', l: 'C', t: 'Confirmation · подтверждение', s: 'критерии приёмки', h: 'Итог разговора — критерии приёмки: по ним Лиза проверит, а Тимур Рашидович примет.<ul class="checks" style="margin-top:6px"><li>При переходе заказ-наряда в «Готов» клиенту уходят push и SMS не позже чем через 1 минуту.</li><li>В сообщении — адрес станции и «бесплатное хранение до 21:00 [дата следующего дня]».</li><li>Корпоративным клиентам уведомление уходит контактному лицу компании.</li></ul>' }
  ];
  const EPIC = {
    t: 'Онлайн-запись', stories: [
      { id: 's1', t: 'Как клиент, я хочу записаться на ТО на свободное время, чтобы не дозваниваться в колл-центр', tasks: ['Описать запрос «свободные слоты» (BR-1, BR-2)', 'Экран выбора времени — макет Ники', 'Сервис записи: создание и блокировка слотов', 'Тест-кейсы на границы 2 часа и 30 дней'] },
      { id: 's2', t: 'Как клиентка, я хочу перенести запись сама, чтобы не звонить на станцию', tasks: ['Правило BR-3 в сервисе записи', 'Экран «Перенести» с новыми слотами', 'Уведомление мастеру о переносе'] },
      { id: 's3', t: 'Как клиент с двумя неявками, я хочу внести предоплату онлайн, чтобы всё-таки записаться без звонка', tasks: ['Счётчик неявок подряд (BR-4)', 'Оплата 500 ₽ через ЮKassa', 'Зачёт предоплаты в итоговую оплату'] }
    ]
  };
  const howStory = {
    id: 'how-story', covers: ['t-build'], title: 'Как это работает: пользовательская история и 3C', free: true, noReset: true,
    simple: {
      icon: '🗒️',
      plain: 'Пользовательская история — короткая фраза на стикере: кто, что хочет сделать и зачем. Это не полное описание, а повод поговорить. Детали появляются в разговоре и записываются как критерии приёмки — по ним потом проверяют, что сделано.',
      analogy: 'Записка мастеру-приёмщику от клиента: «Я, владелец Kia Rio, хочу поменять резину на зимнюю, чтобы в пятницу ехать к маме в Арск». Мастер не делает по ней ремонт — он перезванивает, уточняет размер колёс и хранение. А «в пятницу» подсказывает, что важно успеть к четвергу.',
      tech: 'Формат «Как <роль>, я хочу <действие>, чтобы <ценность>» (Connextra, 2001). 3C — Card, Conversation, Confirmation (Рон Джеффрис). Майк Кон, «Пользовательские истории. Гибкая разработка программного обеспечения»: история — единица планирования и разговора, а не спецификация; детали — в критериях приёмки. Эпик — большая история, которую нарезают на истории размером в спринт; истории — на задачи для команды.'
    },
    lead: ui.brief({
      situation: 'Среда, стена со стикерами в «Орбите». Даша: «На половине стикеров написано „Как пользователь, я хочу удобно“. Я не понимаю, что делать». Вера: «Давайте разберём, из чего состоит хорошая история и что ломается, если части нет».',
      todo: [
        'Переключайте варианты стикера: полный, без роли, без ценности, решение вместо потребности, от имени системы. Читайте, что ломается.',
        'Нажмите на три «C»: карточка, разговор, подтверждение. Это три жизни одной истории.',
        'Раскройте эпик «Онлайн-запись»: нажмите на историю — увидите задачи команды под ней.'
      ],
      look: 'История мала нарочно: она помещается на стикер, чтобы её обсуждали, а не читали. Всё, что выяснили в разговоре, записывают в критерии приёмки — а не дописывают в саму фразу.'
    }),
    render(el) {
      el.classList.add('m2s-root');
      const st = { v: 'full', c: 'card', s: '' };
      el.innerHTML = `<div class="stack">
        <div class="row"><span class="small dim">Стикер:</span>${ui.seg('anat', ANAT.map(a => ({ v: a.v, t: a.t })), st.v, 'accent')}</div>
        <div data-stk></div>
        <div class="stack tight"><span class="eyebrow">3C — три жизни одной истории</span><div class="m2s-3c" data-c3></div><div data-c3d></div></div>
        <div class="stack tight"><span class="eyebrow">Эпик → история → задача · нажмите на историю</span><div class="m2s-tree" data-ep></div></div>
        <div class="m2s-facts">
          <div class="m2s-fact"><b>Критерии приёмки списком правил</b>«Напоминание приходит за 24 часа до начала». «Кнопка „Перенести“ доступна не позднее чем за 3 часа (BR-3)». Коротко и проверяемо.</div>
          <div class="m2s-fact"><b>Критерии сценарием Дано / Когда / Тогда</b>Дано: запись на 14:00, сейчас 11:01. Когда: клиент нажимает «Перенести». Тогда: открываются свободные слоты. Подробно — в занятии про QA.</div>
        </div>
        ${interview('Что такое пользовательская история и чем она отличается от требования?', 'История — короткое описание потребности от лица пользователя: роль, действие, ценность. Это не спецификация, а обещание разговора (3C: карточка, разговор, подтверждение). Проверяемой её делают критерии приёмки. Хорошо назвать признаки качества — INVEST — и сказать, что история нарезается из эпика и сама нарезается на задачи команды.')}
      </div>`;
      function drawStk() {
        const a = ANAT.find(x => x.v === st.v), part = (cls, txt, ph) => txt ? `<span class="p ${cls}">${esc(txt)}</span>` : `<span class="p empty">${ph}</span>`;
        TR.$('[data-stk]', el).innerHTML = `<div class="m2s-sticker"><span class="id">US-24 · эпик «Статус ремонта»</span>Как ${part(a.v === 'sys' ? 'role miss' : 'role', a.role, '…кто?')}, я хочу ${part(a.v === 'sol' ? 'act miss' : 'act', a.act, '…что?')}${a.val ? ', чтобы ' : ''}${part('val', a.val, a.v === 'noval' ? ' — …зачем?' : '')}</div>
          <div style="margin-top:10px">${ui.note(a.note.k, a.v === 'full' ? 'Что здесь хорошо' : 'Что ломается', a.note.h)}</div>`;
      }
      function drawC3() {
        TR.$('[data-c3]', el).innerHTML = C3.map(c => `<button type="button" data-c="${c.id}" aria-pressed="${st.c === c.id}"><span class="big">${c.l}</span><b>${esc(c.t)}</b><small>${esc(c.s)}</small></button>`).join('');
        const c = C3.find(x => x.id === st.c);
        TR.$('[data-c3d]', el).innerHTML = `<div class="card flat"><div>${c.h}</div>${c.talk ? talk(c.talk) : ''}</div>`;
      }
      function drawEp() {
        TR.$('[data-ep]', el).innerHTML = `<div class="m2s-node ep"><span class="tg">ЭПИК</span>${esc(EPIC.t)}</div><div class="m2s-kids">${EPIC.stories.map(s => `<div><button type="button" class="m2s-node st" data-st="${s.id}" aria-pressed="${st.s === s.id}"><span class="tg">ИСТОРИЯ</span>${esc(s.t)}</button>${st.s === s.id ? `<div class="m2s-kids" style="margin-top:6px">${s.tasks.map(t => `<div class="m2s-node tk"><span class="tg">ЗАДАЧА</span>${esc(t)}</div>`).join('')}</div>` : ''}</div>`).join('')}</div>
          <div class="small dim">Эпик не влезает в спринт и не оценивается точно. История — влезает и даёт пользователю что-то целое. Задача — кусок работы одного человека, сама по себе ценности для клиента не даёт.</div>`;
      }
      ui.onSeg(el, (n, v) => { if (n === 'anat') { st.v = v; drawStk(); } });
      TR.on(el, 'click', '[data-c]', (e, b) => { st.c = b.dataset.c; drawC3(); });
      TR.on(el, 'click', '[data-st]', (e, b) => { st.s = st.s === b.dataset.st ? '' : b.dataset.st; drawEp(); });
      drawStk(); drawC3(); drawEp();
      el.insertAdjacentHTML('beforeend', anNote('Аналитик в Scrum-команде редко пишет истории в одиночку: он готовит черновик, приводит на разговор нужных людей (Марину Олеговну, Лизу, Дашу) и записывает итог — критерии приёмки и ссылки на правила BR-*. История без критериев — повод для спора на демо.'));
    }
  };

  // =====================================================================
  // Теория 2. INVEST и нарезка историй
  // =====================================================================
  const INV = [
    { l: 'I', en: 'Independent', ru: 'независимая', q: 'Можно ли сделать её отдельно от других, в любом порядке?', bad: '«Перенести запись — делать только после „Отменить запись“, там общий экран»', fix: 'Порядок — забота планирования, а не самой истории. Общий кусок выносят в отдельную историю или объединяют две в одну.' },
    { l: 'N', en: 'Negotiable', ru: 'обсуждаемая', q: 'Оставляет ли она простор для решения команды?', bad: '«Экран статуса из трёх вкладок, синяя кнопка 48 px, опрос сервера каждые 5 секунд»', fix: 'Убрать решение, оставить потребность: «вижу, на каком этапе ремонт». Как — обсудят Ника и Глеб.' },
    { l: 'V', en: 'Valuable', ru: 'ценная', q: 'Получит ли пользователь или бизнес что-то, когда её сделают?', bad: '«Как разработчик, я хочу настроить таблицу booking»', fix: 'Это задача, а не история. Ценность появляется, когда клиент может записаться, — таблица будет задачей внутри этой истории.' },
    { l: 'E', en: 'Estimable', ru: 'оцениваемая', q: 'Может ли команда прикинуть объём?', bad: '«Доп. работы согласуются сами — нейросеть угадывает, что клиент бы выбрал»', fix: 'Непонятно, что делать и возможно ли это. Нужен разговор или исследование (спайк), а потом — история с понятным правилом (BR-9).' },
    { l: 'S', en: 'Small', ru: 'небольшая', q: 'Влезает ли она в спринт?', bad: '«Записаться, оплатить предоплату, получать напоминания, переносить и копить бонусы»', fix: 'Это эпик. Нарезать: запись, напоминание, перенос, предоплата — каждая история даёт что-то целое.' },
    { l: 'T', en: 'Testable', ru: 'проверяемая', q: 'Сможет ли Лиза сказать «готово» или «не готово»?', bad: '«Как клиент, я хочу, чтобы приложение было удобным»', fix: 'Удобно — это как? «Записаться за 3 шага и не больше чем за минуту» — уже можно проверить.' }
  ];
  const SPLIT = [
    { v: 'steps', t: 'по шагам процесса', h: 'Оплатить онлайн → получить чек → вернуть деньги. Каждый шаг даёт клиенту что-то законченное.' },
    { v: 'rules', t: 'по правилам и вариантам', h: 'Оплата картой — одна история, СБП — вторая, счёт для юрлица раз в месяц (BR-10) — третья.' },
    { v: 'happy', t: 'сначала простой путь', h: 'Сначала «оплата прошла с первого раза», потом — «оплата не прошла», «ЮKassa прислала уведомление дважды».' },
    { v: 'data', t: 'по данным', h: 'Оплата только работ → работ и запчастей → со списанием бонусов до 30 % (BR-11).' },
    { v: 'roles', t: 'по ролям', h: 'Клиентка платит в приложении; кассир станции принимает оплату на кассе; Ольга Викторовна сверяет платежи.' }
  ];
  const howInvest = {
    id: 'how-invest', covers: ['t-invest'], title: 'Как это работает: INVEST и как резать большие истории', free: true, noReset: true,
    simple: {
      icon: '✂️',
      plain: 'INVEST — шесть вопросов к истории перед тем, как взять её в работу: её можно сделать отдельно, она не диктует решение, она полезна, её можно оценить, она небольшая и её можно проверить. Если история слишком большая — её режут так, чтобы каждый кусок всё равно был полезен.',
      analogy: 'Пирог режут на куски сверху вниз — в каждом куске и корж, и начинка, и крем. А не снимают сначала весь крем, потом всю начинку. Так и история: в каждом куске — немного экрана, немного сервера, немного базы, и клиент уже может чем-то пользоваться.',
      tech: 'INVEST — критерии Билла Уэйка (2003): Independent, Negotiable, Valuable, Estimable, Small, Testable. Нарезка «вертикальными срезами» (vertical slicing): приёмы по шагам процесса, по правилам, по данным, по ролям, «сначала простой путь» (Р. Лоуренс, шаблоны разделения историй; Майк Кон).'
    },
    lead: ui.brief({
      situation: 'Глеб на груминге: «Половину историй мы не можем оценить, а одна у вас на три спринта». Вера: «Пропустим их через INVEST — шесть вопросов. А большие — нарежем».',
      todo: [
        'Нажимайте на буквы I, N, V, E, S, T: смысл, вопрос к истории, плохой пример «Искры» и как исправить.',
        'Переключайте приёмы нарезки на примере эпика «Онлайн-оплата».'
      ],
      look: 'Больше всего историй ломается на V (техническая задача вместо истории), S (эпик под видом истории) и T («удобно», «быстро»).'
    }),
    render(el) {
      el.classList.add('m2s-root');
      const st = { l: 'I', sp: 'steps' };
      el.innerHTML = `<div class="stack">
        <div class="m2s-letters" data-lt></div><div data-ld></div>
        <div class="stack tight"><span class="eyebrow">Как нарезать эпик «Онлайн-оплата»</span>
          <div class="row">${ui.seg('sp', SPLIT.map(s => ({ v: s.v, t: s.t })), st.sp)}</div><div data-sp></div></div>
        ${ui.note('warn', 'Как резать нельзя', '«Сначала вся база, потом весь сервер, потом все экраны» — горизонтальные слои. Через три спринта у клиента нет ничего, чем можно воспользоваться, а ошибки в понимании всплывают в самом конце.')}
        ${interview('Что такое INVEST? Какая буква нарушается чаще всего?', 'Расшифровать шесть букв и к каждой — вопрос: «можно сделать отдельно?», «не диктует ли решение?», «кому польза?», «можно оценить?», «влезает в спринт?», «как проверить?». Чаще всего ломаются V (техническая задача под видом истории), S (эпик) и T (непроверяемые «удобно» и «быстро»). Плюс — приём нарезки: вертикальными срезами, по шагам или правилам, сначала простой путь.')}
      </div>`;
      function draw() {
        TR.$('[data-lt]', el).innerHTML = INV.map(x => `<button type="button" data-l="${x.l}" aria-pressed="${st.l === x.l}"><b>${x.l}</b><small>${esc(x.ru)}</small></button>`).join('');
        const x = INV.find(i => i.l === st.l);
        TR.$('[data-ld]', el).innerHTML = `<div class="card"><div><div class="eyebrow">${x.l} · ${x.en}</div><h3 class="m2s-h3">${esc(x.ru[0].toUpperCase() + x.ru.slice(1))}</h3></div>
          <div class="m2s-facts"><div class="m2s-fact wide"><b>Вопрос к истории</b>${esc(x.q)}</div><div class="m2s-fact bad"><b>Нарушение в «Искре»</b>${esc(x.bad)}</div><div class="m2s-fact ok"><b>Как исправить</b>${esc(x.fix)}</div></div></div>`;
        TR.$('[data-sp]', el).innerHTML = `<div class="card flat">${esc(SPLIT.find(s => s.v === st.sp).h)}</div>`;
      }
      TR.on(el, 'click', '[data-l]', (e, b) => { st.l = b.dataset.l; draw(); });
      ui.onSeg(el, (n, v) => { if (n === 'sp') { st.sp = v; draw(); } });
      draw();
      el.insertAdjacentHTML('beforeend', anNote('INVEST — не экзамен для истории, а чек-лист перед грумингом. Если вы сами не можете ответить «как Лиза это проверит?» или «что получит клиент?» — команда тоже не сможет, и вопрос всплывёт посреди спринта.'));
    }
  };

  // =====================================================================
  // Теория 3. Use Case по Кокберну, уровни целей, UML, сравнение
  // =====================================================================
  const UC = [
    { id: 'name', k: 'Название', v: '«Записаться на ТО»', why: 'Цель актора глаголом: «Записаться», «Согласовать», «Оплатить». Не «Модуль записи» и не «Экран слотов».' },
    { id: 'actor', k: 'Основной актор', v: 'Клиент', why: 'Тот, кто хочет достичь цели и запускает сценарий. Второстепенные акторы помогают: здесь ЮKassa, если нужна предоплата.' },
    { id: 'level', k: 'Уровень', v: 'Цель пользователя («уровень моря»)', why: 'Одна сессия, одна цель, после которой человек доволен. Ниже — подфункции («Найти свободный слот»), выше — бизнес-процессы.' },
    { id: 'stake', k: 'Заинтересованные лица', v: '<ul><li>Клиент — быстро, на удобное время, с понятной ценой</li><li>Марина Олеговна — без накладок, с правильной длительностью</li><li>«Искра» — меньше неявок, пост не простаивает</li></ul>', why: 'По Кокберну сценарий защищает интересы всех заинтересованных — отсюда берутся проверки и гарантии.' },
    { id: 'pre', k: 'Предусловия', v: 'Клиент вошёл в приложение, согласие на обработку персональных данных дано (BR-15)', why: 'Что уже верно до начала. Система это не проверяет внутри сценария — проверка была раньше.' },
    { id: 'trig', k: 'Триггер', v: 'Клиент нажимает «Записаться»', why: 'Событие, которое запускает сценарий.' },
    { id: 'main', k: 'Основной сценарий', v: '<ol><li>Клиент выбирает станцию и машину.</li><li>Клиент выбирает услуги; система показывает цену «от» (BR-5) и длительность (BR-1).</li><li>Система показывает свободные слоты (BR-2).</li><li>Клиент выбирает слот.</li><li>Система создаёт запись «Подтверждена» и занимает слоты поста.</li><li>Система отправляет подтверждение push и SMS.</li></ol>', why: 'Самый частый путь к успеху, 3–9 шагов. Каждый шаг: кто действует и что делает. Без «если» — все «если» уходят в расширения.' },
    { id: 'ext', k: 'Расширения', v: '<ul><li><b>3a.</b> Свободных слотов на 30 дней нет: система предлагает ближайшую станцию.</li><li><b>4a.</b> Слот заняли, пока клиент выбирал: система сообщает и возвращает к шагу 3.</li><li><b>5a.</b> У клиента 2 неявки подряд (BR-4): запись создаётся «Ждёт предоплаты», клиент вносит 500 ₽ через ЮKassa.</li><li><b>5a1.</b> Оплата не прошла: запись не подтверждается, слоты освобождаются.</li></ul>', why: 'Номер = шаг, где случилось + буква. «5a1» — расширение внутри расширения. Каждое заканчивается: возврат к шагу, успех другим путём или неудача.' },
    { id: 'min', k: 'Минимальные гарантии', v: 'Один слот не занят дважды; при сбое запись не создаётся наполовину', why: 'Что верно при любом исходе, даже при неудаче.' },
    { id: 'succ', k: 'Гарантии успеха', v: 'Запись «Подтверждена» (или «Ждёт предоплаты»), слоты заняты, клиент получил подтверждение', why: 'Что верно, когда цель достигнута. По этому пункту Лиза пишет проверку конечного состояния.' }
  ];
  const GOALS = [
    { ic: '☁️', t: 'облако', d: 'Цель бизнеса целиком', ex: '«Обслужить машину клиента» — от звонка до выдачи' },
    { ic: '🪁', t: 'воздушный змей', d: 'Сводная цель, несколько сессий', ex: '«Пройти ТО»: записаться, приехать, согласовать, оплатить' },
    { ic: '🌊', t: 'уровень моря', d: 'Цель пользователя за одну сессию', ex: '«Записаться на ТО», «Согласовать доп. работы»' },
    { ic: '🐟', t: 'рыба', d: 'Подфункция, часть другого сценария', ex: '«Найти свободный слот», «Внести предоплату»' },
    { ic: '🐚', t: 'моллюск', d: 'Слишком мелко для сценария', ex: '«Ввести номер телефона» — это поле, а не цель' }
  ];
  const UML = {
    book: 'Вариант использования «Записаться на ТО» — цель клиента. Линия к актору: он в нём участвует.',
    slot: '«Найти свободный слот» — общая часть, которая <b>всегда</b> выполняется внутри записи и переноса. Связь <b>«include»</b> (включение): стрелка от базового варианта к включаемому.',
    pay: '«Внести предоплату» выполняется <b>только при условии</b> — 2 неявки подряд (BR-4). Связь <b>«extend»</b> (расширение): стрелка от расширяющего варианта к базовому. В ней участвует второстепенный актор — ЮKassa.',
    extra: '«Согласовать доп. работы» — отдельная цель клиента. Мастер-приёмщик тоже участвует: формирует предложение (BR-7). Подробно разберём его в лаборатории.'
  };
  const CMP = [
    ['Что это', 'Обещание разговора о потребности', 'Описание взаимодействия актора с системой целиком'],
    ['Размер', 'Стикер: роль, действие, ценность + критерии', 'Страница: шаги, расширения, гарантии'],
    ['Ветвления', 'Плохо держит: ветки прячутся в критериях', 'Главная сила: каждое «если» — отдельное расширение'],
    ['Для чего', 'Планирование, оценка, приоритеты, спринты', 'Понять сложный процесс целиком, найти пропущенные случаи'],
    ['Хорош, когда', 'Одна понятная ценность, мало вариантов', 'Много участников, правил и «а если…»'],
    ['Риск', 'Ветки теряются между историями', 'Разрастается в документ, который никто не читает']
  ];
  const howUc = {
    id: 'how-usecase', covers: ['t-uc', 't-format'], title: 'Как это работает: Use Case по Кокберну и когда что выбирать', free: true, noReset: true,
    simple: {
      icon: '🧭',
      plain: 'Вариант использования (Use Case) — это сценарий: кто чего хочет добиться и как шаг за шагом идёт разговор человека с системой. Сначала — самый частый успешный путь, потом — все «а если…» отдельными ветками. История говорит «что и зачем», сценарий показывает «как это разворачивается, со всеми поворотами».',
      analogy: 'Инструкция для нового мастера-приёмщика «Как принять машину». Основной путь: встретить, сверить запись, осмотреть, оформить заказ-наряд, отдать ключи в цех. А дальше — ветки: «клиент без записи», «машина корпоративная», «клиент опоздал на 20 минут». Без веток новичок растеряется на первом же нестандартном клиенте.',
      tech: 'Алистер Кокберн, «Современные методы описания функциональных требований к системам» (Writing Effective Use Cases): основной актор, уровень цели, заинтересованные лица и интересы, предусловия, триггер, минимальные гарантии и гарантии успеха, основной сценарий (3–9 шагов), расширения с нумерацией «шаг + буква». Уровни целей: облако, воздушный змей, уровень моря, рыба, моллюск. Диаграмма вариантов использования — UML 2.5: актор, вариант использования, граница системы, связи «include» и «extend».'
    },
    lead: ui.brief({
      situation: 'Марина Олеговна, глядя на стикеры: «Это всё мило, а где написано, что делать, если клиент не берёт трубку? Если „Шашка“? Если отказался?» Вера: «А вот для этого есть сценарии. Покажу на записи на ТО — а согласование доп. работ соберёте сами».',
      todo: [
        'Нажимайте на разделы сценария «Записаться на ТО» — узнаете, зачем каждый раздел и как его писать.',
        'Пройдите уровни целей от облака до моллюска.',
        'На диаграмме UML нажимайте на варианты использования: что значат «include» и «extend».',
        'В конце — таблица: история или сценарий, когда что.'
      ],
      look: 'Главное правило Кокберна: в основном сценарии нет «если». Все «если» — в расширениях, и у каждого расширения есть номер шага, где оно случается, и понятный конец.'
    }),
    render(el) {
      el.classList.add('m2s-root');
      const st = { sec: 'main', g: 2, u: 'book' };
      el.innerHTML = `<div class="stack">
        <div class="card"><div class="eyebrow">Вариант использования UC-01 · нажмите на раздел</div><div class="m2s-uc" data-uc></div><div data-ucw></div></div>
        <div class="stack tight"><span class="eyebrow">Уровни целей по Кокберну</span><div class="m2s-levels" data-gl></div><div data-gd></div></div>
        <div class="stack tight"><span class="eyebrow">Диаграмма вариантов использования (UML) · нажмите на овал</span><div class="m2s-svgbox" data-svg></div><div data-ud></div></div>
        <div class="stack tight"><span class="eyebrow">История или сценарий</span><div class="m2s-facts">${CMP.map(r => `<div class="m2s-fact"><b>${r[0]}</b><div><span class="chip warn">история</span> ${r[1]}</div><div style="margin-top:4px"><span class="chip info">Use Case</span> ${r[2]}</div></div>`).join('')}</div></div>
        ${ui.note('ok', 'Не «или», а «и»', 'Форматы не конкурируют. В бэклоге живут истории — по ним планируют спринты. Для ветвистого процесса рядом лежит сценарий: истории ссылаются на его ветки, а критерии приёмки берутся из расширений.')}
        ${interview('Чем Use Case отличается от User Story? Когда что выбрать?', 'История — короткая единица планирования о потребности (роль, действие, ценность), детали в разговоре и критериях. Use Case — полный сценарий взаимодействия: актор, предусловия, основной поток, расширения, гарантии. Историю берут для простых ценностей и планирования, сценарий — где много ветвлений и участников (у нас — согласование доп. работ). Часто используют вместе: сценарий как контекст, истории — как срезы для спринтов.')}
      </div>`;
      function drawUc() {
        TR.$('[data-uc]', el).innerHTML = UC.map(s => `<button type="button" class="m2s-sec" data-sec="${s.id}" aria-pressed="${st.sec === s.id}"><span class="k">${esc(s.k)}</span><span class="v">${s.v}</span></button>`).join('');
        TR.$('[data-ucw]', el).innerHTML = `<div style="margin-top:8px">${ui.note('info', 'Зачем этот раздел: ' + UC.find(s => s.id === st.sec).k, UC.find(s => s.id === st.sec).why)}</div>`;
      }
      function drawG() {
        TR.$('[data-gl]', el).innerHTML = GOALS.map((g, i) => `<button type="button" data-g="${i}" aria-pressed="${st.g === i}"><span aria-hidden="true">${g.ic}</span><span>${esc(g.t)}</span></button>`).join('');
        const g = GOALS[st.g];
        TR.$('[data-gd]', el).innerHTML = `<div class="card flat"><b>${esc(g.d)}.</b> Пример: ${esc(g.ex)}.${st.g === 2 ? ' <span class="dim">Большинство сценариев пишут на этом уровне.</span>' : ''}</div>`;
      }
      function drawSvg() {
        const on = id => st.u === id ? 'uc on' : 'uc';
        const actor = (x, y, name) => `<g><circle class="act" cx="${x}" cy="${y}" r="9"/><line class="act" x1="${x}" y1="${y + 9}" x2="${x}" y2="${y + 34}"/><line class="act" x1="${x - 14}" y1="${y + 18}" x2="${x + 14}" y2="${y + 18}"/><line class="act" x1="${x}" y1="${y + 34}" x2="${x - 11}" y2="${y + 52}"/><line class="act" x1="${x}" y1="${y + 34}" x2="${x + 11}" y2="${y + 52}"/><text x="${x}" y="${y + 70}" text-anchor="middle">${name}</text></g>`;
        TR.$('[data-svg]', el).innerHTML = `<svg viewBox="0 0 680 300" role="img" aria-label="Диаграмма вариантов использования «Искра Онлайн»">
          <defs><marker id="m2s-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path class="arrow" d="M0,0 L10,5 L0,10 z"/></marker></defs>
          <rect class="bound" x="120" y="14" width="430" height="272" rx="8"/><text class="lbl" x="132" y="34">«Искра Онлайн»</text>
          ${actor(50, 60, 'Клиент')}${actor(620, 40, 'ЮKassa')}${actor(620, 190, 'Мастер')}
          <line class="ln" x1="66" y1="85" x2="196" y2="80"/><line class="ln" x1="66" y1="95" x2="196" y2="226"/>
          <line class="ln" x1="604" y1="65" x2="500" y2="140"/><line class="ln" x1="604" y1="215" x2="474" y2="228"/>
          <line class="ln dash" x1="300" y1="100" x2="300" y2="130" marker-end="url(#m2s-ar)"/><text class="lbl" x="308" y="120">«include»</text>
          <line class="ln dash" x1="440" y1="138" x2="370" y2="94" marker-end="url(#m2s-ar)"/><text class="lbl" x="414" y="106">«extend»</text>
          <g data-u="book"><ellipse class="${on('book')}" cx="290" cy="78" rx="100" ry="24"/><text x="290" y="83" text-anchor="middle">Записаться на ТО</text></g>
          <g data-u="slot"><ellipse class="${on('slot')}" cx="250" cy="156" rx="95" ry="24"/><text x="250" y="161" text-anchor="middle">Найти свободный слот</text></g>
          <g data-u="pay"><ellipse class="${on('pay')}" cx="458" cy="158" rx="82" ry="24"/><text x="458" y="163" text-anchor="middle">Внести предоплату</text></g>
          <g data-u="extra"><ellipse class="${on('extra')}" cx="330" cy="232" rx="125" ry="24"/><text x="330" y="237" text-anchor="middle">Согласовать доп. работы</text></g>
        </svg>`;
        TR.$('[data-ud]', el).innerHTML = ui.note('', '', UML[st.u]);
      }
      TR.on(el, 'click', '[data-sec]', (e, b) => { st.sec = b.dataset.sec; drawUc(); });
      TR.on(el, 'click', '[data-g]', (e, b) => { st.g = +b.dataset.g; drawG(); });
      TR.on(el, 'click', '[data-u]', (e, g) => { st.u = g.dataset.u; drawSvg(); });
      drawUc(); drawG(); drawSvg();
      el.insertAdjacentHTML('beforeend', anNote('Диаграмма UML — оглавление, а не содержание: она показывает, какие цели есть у каких акторов. Вся ценность — в тексте сценария, особенно в расширениях. Новичок рисует красивую диаграмму с десятком «include» и не пишет ни одного расширения; Лизе и Глебу нужно ровно наоборот.'));
    }
  };

  // =====================================================================
  // Практика 1. Собрать историю из частей и отсеять лишнее
  // =====================================================================
  const SLOTS = [
    {
      id: 'role', t: 'Как…', opts: [
        { id: 'r1', t: 'пользователь', k: 'bad', why: 'Безликая роль: непонятно, чья ситуация. Клиент, записанный на ТО, и завгар «Шашки» ждут разного.' },
        { id: 'r2', t: 'клиентка, записанная на ТО', k: 'good', why: 'Конкретная роль в конкретной ситуации — у неё есть запись, о которой можно забыть.' },
        { id: 'r3', t: 'разработчик сервиса уведомлений', k: 'bad', why: 'Разработчик не пользователь продукта: так пишут техническую задачу, а не историю.' },
        { id: 'r4', t: 'мастер-приёмщик', k: 'bad', why: 'Мастеру важна явка, но напоминание получает и на кнопки нажимает клиент. У мастера — своя история: видеть, кто подтвердил.' }
      ]
    },
    {
      id: 'act', t: '…я хочу…', opts: [
        { id: 'a1', t: 'получить напоминание за сутки с кнопками «Приеду», «Перенести», «Отменить»', k: 'good', why: 'Одно действие, понятное клиенту, без технологии внутри.' },
        { id: 'a2', t: 'чтобы Firebase отправлял push через очередь сообщений', k: 'bad', why: 'Решение за Глеба (нарушение N в INVEST). Клиентке всё равно, через что.' },
        { id: 'a3', t: 'удобное приложение', k: 'bad', why: 'Не действие и не проверяется (нарушение T).' },
        { id: 'a4', t: 'чтобы мне звонили накануне визита', k: 'mid', why: 'Потребность та же, но решение зашито — и неподъёмное: три оператора, 600 записей в день.' }
      ]
    },
    {
      id: 'val', t: '…чтобы…', opts: [
        { id: 'v1', t: 'не забыть о визите, а если планы поменялись — освободить время заранее', k: 'good', why: 'Ценность для неё — и сразу видно, как это двигает цель «неявки 17 % → 8 %».' },
        { id: 'v2', t: 'было как в такси', k: 'bad', why: 'Не ценность, а сравнение. Что именно должно стать как в такси?' },
        { id: 'v3', t: 'система работала', k: 'bad', why: 'Пустая ценность: ни для кого и ни про что.' },
        { id: 'v4', t: 'станция не простаивала', k: 'mid', why: 'Это ценность для бизнеса, а не для клиентки. Верно по смыслу, но история от её лица — и её «зачем».' }
      ]
    }
  ];
  const CRIT = [
    { id: 'c1', t: 'Напоминание приходит за 24 часа до начала записи', ok: 'keep', why: 'Проверяемо: время, событие.' },
    { id: 'c2', t: 'Если push не доставлен за 10 минут или уведомления выключены — уходит SMS', ok: 'keep', why: 'Крайний случай, о котором спросит Даша.' },
    { id: 'c3', t: 'Кнопка «Перенести» доступна не позднее чем за 3 часа до начала (BR-3); позже — показываем телефон станции', ok: 'keep', why: 'Граница из правила — Лиза проверит 3:00 и 2:59.' },
    { id: 'c4', t: 'После «Отменить» слот сразу свободен для онлайн-записи', ok: 'keep', why: 'Ради этого всё и делается: освободившееся время достаётся другому.' },
    { id: 'c5', t: 'Push отправляется через Firebase Cloud Messaging из очереди RabbitMQ', ok: 'drop', why: 'Это «как» — решение Глеба, а не критерий приёмки.' },
    { id: 'c6', t: 'Напоминание удобное и понятное', ok: 'drop', why: 'Не проверить: удобно — это как?' },
    { id: 'c7', t: 'За подтверждение визита клиенту начисляются 50 бонусов', ok: 'drop', why: 'Новое правило, которого нет в BR-11 и которое никто не согласовывал. Если нужно — отдельная история и решение Тимура Рашидовича.' },
    { id: 'c8', t: 'Мастер видит в АРМ, кто подтвердил визит', ok: 'drop', alt: 'keep', why: 'Полезно, но это история другого пользователя — мастера. В этой истории она размывает размер и ценность.' },
    { id: 'c9', t: 'Всё работает быстро', ok: 'drop', why: 'Не проверить. Если важна скорость — это НФТ с числом.' }
  ];
  function buildEval(a) {
    a = a || {}; const cr = a.cr || {};
    const sl = SLOTS.map(s => { const o = s.opts.find(x => x.id === a[s.id]); return { s, o, pts: o ? (o.k === 'good' ? 1 : o.k === 'mid' ? 0.4 : 0) : 0 }; });
    const cs = CRIT.map(c => { const g = cr[c.id]; if (g === c.ok) return { c, g, s: 'ok', pts: 1 }; if (c.alt && g === c.alt) return { c, g, s: 'warn', pts: 0.5 }; return { c, g, s: 'bad', pts: 0 }; });
    const score = (sl.reduce((s, x) => s + x.pts, 0) / SLOTS.length) * 0.5 + (cs.reduce((s, x) => s + x.pts, 0) / CRIT.length) * 0.5;
    return { sl, cs, score };
  }
  const taskBuild = {
    id: 't-build', title: 'Собрать историю «напоминание о записи»',
    simple: howStory.simple,
    lead: ui.brief({
      situation: 'На стене висит черновик Кирилла про напоминания — и рядом девять стикеров-«критериев», которые накидали все подряд. Вера: «Соберите из частей одну хорошую историю для цели „неявки 17 % → 8 %“ и оставьте только те критерии, которые к ней относятся и проверяются».',
      todo: [
        'Выберите по одному варианту для роли, действия и ценности — история соберётся на стикере.',
        'Для каждого из девяти критериев решите: «оставить» или «убрать». Оставлять — то, что относится к этой истории и что Лиза сможет проверить.',
        'Нажмите «Проверить». Засчитывается от 80 %, если роль, действие и ценность выбраны лучшие, а лишние критерии убраны.'
      ],
      look: 'Убирать критерий — не значит выбросить идею. Решение «как», новое правило или история другого пользователя переезжают в другое место, а не в эту карточку.'
    }),
    blank: () => ({ cr: {} }),
    reference: () => ({ role: 'r2', act: 'a1', val: 'v1', cr: Object.fromEntries(CRIT.map(c => [c.id, c.ok])) }),
    render(el, ctx) {
      el.classList.add('m2s-root');
      const a = ctx.ans, ro = ctx.readonly; a.cr = a.cr || {};
      const showR = !!(ctx.result || ro);
      el.innerHTML = `<div class="stack"><div data-stk></div><div class="m2s-slots" data-sls></div>
        <div class="stack tight"><span class="eyebrow">Критерии приёмки · оставить или убрать</span><div class="m2s-crit" data-cr></div></div></div>`;
      function stk() {
        const p = id => { const s = SLOTS.find(x => x.id === id), o = s.opts.find(x => x.id === a[id]); return o ? `<span class="p ${id}">${esc(o.t)}</span>` : '<span class="p empty">…</span>'; };
        const kept = CRIT.filter(c => a.cr[c.id] === 'keep');
        TR.$('[data-stk]', el).innerHTML = `<div class="m2s-sticker"><span class="id">US-31 · эпик «Напоминания» · цель: неявки 17 % → 8 %</span>Как ${p('role')}, я хочу ${p('act')}, чтобы ${p('val')}.
          ${kept.length ? `<div style="margin-top:10px;font:400 13.5px/1.45 var(--f-body)"><b>Критерии приёмки:</b><ul style="margin:4px 0 0;padding-left:18px">${kept.map(c => `<li>${esc(c.t)}</li>`).join('')}</ul></div>` : ''}</div>`;
      }
      function slots() {
        TR.$('[data-sls]', el).innerHTML = SLOTS.map(s => `<div class="m2s-slot"><span class="eyebrow">${esc(s.t)}</span><div class="m2s-opts">${s.opts.map(o => {
          const on = a[s.id] === o.id, cls = showR && on ? (o.k === 'good' ? 'ok' : o.k === 'mid' ? 'warn' : 'bad') : (ro && o.k === 'good' ? 'ok' : '');
          return `<button type="button" class="m2s-opt ${cls}" data-sl="${s.id}" data-o="${o.id}" aria-pressed="${on}" ${ro ? 'disabled' : ''}><span class="bx" aria-hidden="true"></span><span>${esc(o.t)}${showR && on ? `<div class="small dim" style="margin-top:4px">${o.why}</div>` : ''}</span></button>`;
        }).join('')}</div></div>`).join('');
      }
      function crit() {
        const ev = buildEval(a);
        TR.$('[data-cr]', el).innerHTML = CRIT.map((c, i) => {
          const e = ev.cs[i], cls = showR && a.cr[c.id] ? e.s : '';
          return `<div class="m2s-line ${cls}"><div class="tx">${esc(c.t)}</div>${ui.seg('cr-' + c.id, [{ v: 'keep', t: 'оставить' }, { v: 'drop', t: 'убрать' }], a.cr[c.id] || '')}${cls ? `<div class="why">${cls === 'ok' || ro ? c.why : cls === 'warn' ? 'Засчитано наполовину. ' + c.why : (c.ok === 'keep' ? 'Этот критерий нужен: он проверяем и относится к истории.' : 'Этот критерий лишний: спросите — проверяем ли он и про эту ли историю?')}</div>` : ''}</div>`;
        }).join('');
      }
      stk(); slots(); crit();
      if (ro) return;
      TR.on(el, 'click', '[data-sl][data-o]', (e, b) => { a[b.dataset.sl] = b.dataset.o; ctx.save(); stk(); slots(); });
      ui.onSeg(el, (n, v) => { if (n.startsWith('cr-')) { a.cr[n.slice(3)] = v; ctx.save(); stk(); } });
    },
    check(ans) {
      const ev = buildEval(ans), notes = [];
      ev.sl.forEach(x => { if (!x.o) notes.push({ ok: false, html: `«${esc(x.s.t)}» — не выбрано.` }); else if (x.o.k !== 'good') notes.push({ ok: x.o.k === 'mid' ? 'warn' : false, html: `«${esc(x.s.t)} ${esc(x.o.t)}» — ${x.o.why}` }); });
      if (ev.sl.every(x => x.o && x.o.k === 'good')) notes.push({ ok: true, html: 'Роль, действие и ценность — лучшие: конкретная роль, действие без технологии, ценность для неё самой.' });
      ev.cs.forEach(x => { if (x.s === 'ok') return; notes.push({ ok: x.s === 'warn' ? 'warn' : false, html: `«${esc(x.c.t)}» — ${x.g ? (x.s === 'warn' ? 'засчитано наполовину. ' : '') + x.c.why : 'не решено.'}` }); });
      if (ev.cs.every(x => x.s === 'ok')) notes.push({ ok: true, html: 'Критерии: оставлены четыре проверяемых, убраны решение, новое правило, чужая история и два «удобно-быстро».' });
      const slotsOk = ev.sl.every(x => x.o && x.o.k === 'good');
      return {
        ok: slotsOk && ev.score >= 0.8, score: ev.score, notes,
        summary: `История: ${ev.sl.filter(x => x.o && x.o.k === 'good').length} из 3 частей; критерии: ${ev.cs.filter(x => x.s === 'ok').length} из ${CRIT.length}.`,
        mentor: !slotsOk ? 'Проверьте каждую часть стикера вопросом: <b>кто именно</b> (не «пользователь»), <b>что делает он сам</b> (не «как это устроено»), <b>что это даёт ему</b> (не системе и не бизнесу).' : (ev.score < 0.8 ? 'Критерий приёмки отвечает на вопрос «как Лиза поймёт, что история сделана». Решения Глеба, новые правила и истории других людей — в другие места.' : null)
      };
    },
    explain: `<p>Хорошая история здесь: <b>«Как клиентка, записанная на ТО, я хочу получить напоминание за сутки с кнопками „Приеду“, „Перенести“, „Отменить“, чтобы не забыть о визите, а если планы поменялись — освободить время заранее»</b>.</p>
      <ul class="checks">
        <li><b>Роль</b> — конкретная и в ситуации. «Пользователь» и «разработчик» роли не дают.</li>
        <li><b>Действие</b> — что нужно человеку, без «через Firebase». Как сделать — решит команда.</li>
        <li><b>Ценность</b> — её «зачем». «Чтобы станция не простаивала» — верно, но это зачем бизнеса; оно живёт в цели над историей.</li>
        <li><b>Критерии</b> — четыре проверяемых. Решение «как» уходит Глебу, бонусы за явку — к Тимуру Рашидовичу как новое правило, «мастер видит подтверждения» — в отдельную историю мастера.</li>
      </ul>
      <p>Частая ошибка — дописывать в историю всё, что прозвучало у стены. История растёт, перестаёт влезать в спринт и смешивает разных пользователей. Источник: Майк Кон, «Пользовательские истории», гл. 2 «Написание историй» и гл. 6 «Приёмочное тестирование историй».</p>`,
    refNote: 'Критерий «мастер видит, кто подтвердил» засчитывается наполовину, если его оставить. «Чтобы станция не простаивала» и «звонить накануне» засчитываются частично.',
    report: ans => {
      ans = ans || {};
      const ev = buildEval(ans);
      return `- История: Как ${ev.sl.map(x => x.o ? x.o.t : '…').join(' / ')}\n` + ev.cs.map(x => `- ${x.c.t}: ${x.g === 'keep' ? 'оставить' : x.g === 'drop' ? 'убрать' : '—'} ${mark(x.s)}`).join('\n');
    }
  };

  // =====================================================================
  // Практика 2. INVEST-фильтр 8 историй
  // =====================================================================
  const INV_CH = [
    { v: 'ok', t: 'Годится — INVEST соблюдён' }, { v: 'I', t: 'I — зависит от другой истории' }, { v: 'N', t: 'N — решение зашито, не обсудить' },
    { v: 'V', t: 'V — нет ценности для пользователя' }, { v: 'E', t: 'E — нельзя оценить' }, { v: 'S', t: 'S — слишком большая' }, { v: 'T', t: 'T — нельзя проверить' }
  ];
  const INV_S = [
    { id: 'i1', t: 'Как клиентка, я хочу записаться онлайн, выбрать станцию, услуги и время, внести предоплату, получать напоминания, переносить запись и копить бонусы', ok: 'S', why: 'Это эпик на несколько спринтов. Нарезать: запись, напоминание, перенос, предоплата, бонусы.' },
    { id: 'i2', t: 'Как клиент, я хочу, чтобы приложение было удобным', ok: 'T', alt: { E: 'Оценить её тоже нельзя — но корень в том, что «удобно» никак не проверить. Начинать с T.' }, why: '«Удобно» не проверить. Что именно должно стать удобнее и как это измерить?' },
    { id: 'i3', t: 'Как разработчик, я хочу настроить таблицу booking в базе данных', ok: 'V', why: 'Техническая задача: клиент ничего не получит, пока не сможет записаться. Таблица — задача внутри истории записи.' },
    { id: 'i4', t: 'Как мастер-приёмщик, я хочу видеть в АРМ отметку «подтвердил визит» у записей на день, чтобы заранее обзвонить неподтвердивших', ok: 'ok', why: 'Роль, действие, ценность; влезает в спринт; проверяется по отметке.' },
    { id: 'i5', t: 'Как клиентка, я хочу перенести запись — делать только после истории «Отменить запись», потому что там общий экран и код', ok: 'I', why: 'Жёсткая зависимость от другой истории. Общее выносят или две истории объединяют.' },
    { id: 'i6', t: 'Как клиент, я хочу видеть статус ремонта: экран из трёх вкладок, синяя кнопка 48 px, опрос сервера каждые 5 секунд', ok: 'N', why: 'В историю зашито решение — дизайн и техника. Ника и Глеб не могут предложить лучше.' },
    { id: 'i7', t: 'Как завгар «Шашки», я хочу, чтобы доп. работы согласовывались нейросетью, которая угадывает моё решение', ok: 'E', alt: { V: 'Ценность сомнительна, но главное — никто не знает, что делать и возможно ли это. Сначала — исследование. А правило у «Шашки» уже есть: лимит 3 000 ₽ (BR-9).' }, why: 'Непонятно, что и как делать, — не оценить. Нужен разговор: у «Шашки» есть простое правило лимита (BR-9).' },
    { id: 'i8', t: 'Как клиентка, я хочу получить push и SMS, когда машина готова (BR-13), чтобы забрать её до конца следующего дня бесплатно', ok: 'ok', why: 'Ценность понятна, правило указано, проверяется по событию «Готов».' }
  ];
  function invEval(v) {
    v = v || {};
    return INV_S.map(r => { const g = v[r.id]; if (g === r.ok) return { r, g, s: 'ok', pts: 1 }; if (r.alt && r.alt[g]) return { r, g, s: 'warn', pts: 0.5 }; return { r, g, s: 'bad', pts: 0 }; });
  }
  const chT = v => (INV_CH.find(c => c.v === v) || { t: '—' }).t;
  const taskInvest = {
    id: 't-invest', title: 'INVEST-фильтр: восемь историй перед грумингом',
    simple: howInvest.simple,
    lead: ui.brief({
      situation: 'Завтра груминг. Глеб прислал восемь историй из бэклога: «Эти мы не можем ни оценить, ни взять. Скажите, какие годятся, а какие — что с ними не так». Две из восьми годятся.',
      todo: [
        'Для каждой истории выберите: «Годится» или главную нарушенную букву INVEST.',
        'Если нарушений несколько, выбирайте главное — из-за которого историю нельзя взять в работу прямо сейчас.',
        'Нажмите «Проверить». Засчитывается от 80 %. Где две буквы спорят, вторая засчитывается наполовину — с пояснением.'
      ],
      look: 'Разные буквы — разные лекарства: S — нарезать, V — превратить в задачу внутри истории, N — убрать решение, T — добавить число, E — сначала разговор, I — объединить или вынести общее.'
    }),
    blank: () => ({ v: {} }),
    reference: () => ({ v: Object.fromEntries(INV_S.map(r => [r.id, r.ok])) }),
    render(el, ctx) {
      el.classList.add('m2s-root');
      let reveal = null;
      if (ctx.result || ctx.readonly) { reveal = {}; invEval(ctx.ans.v).forEach(x => { if (ctx.readonly || x.g) reveal[x.r.id] = { s: ctx.readonly ? 'ok' : x.s, why: ctx.readonly || x.s === 'ok' ? x.r.why : x.s === 'warn' ? x.r.alt[x.g] : 'Задайте шесть вопросов INVEST по очереди: на каком истории не пройти?' }; }); }
      const box = document.createElement('div'); el.appendChild(box);
      ui.match(box, { rows: INV_S.map(r => ({ id: r.id, t: '«' + esc(r.t) + '»' })), choices: INV_CH, value: ctx.ans.v || {}, reveal, readonly: ctx.readonly, placeholder: 'Вердикт…', onChange: v => { ctx.ans.v = v; ctx.save(); } });
    },
    check(ans) {
      const ev = invEval(ans && ans.v), score = ev.reduce((s, x) => s + x.pts, 0) / INV_S.length, notes = [];
      ev.forEach(x => {
        if (x.s === 'ok') return;
        if (x.s === 'warn') notes.push({ ok: 'warn', html: `«${esc(x.r.t.slice(0, 70))}…» — ${x.r.alt[x.g]}` });
        else notes.push({ ok: false, html: `«${esc(x.r.t.slice(0, 70))}…» — ${x.g ? (x.r.ok === 'ok' ? 'эта история годится: проверьте, какой букве она бы не прошла — ни одной.' : x.g === 'ok' ? 'не годится: есть нарушение, из-за которого её нельзя взять в работу.' : `не «${chT(x.g)}».`) : 'не оценено.'}` });
      });
      if (!notes.length) notes.push({ ok: true, html: 'Все восемь — верно: две годятся, у шести — шесть разных букв.' });
      return {
        ok: score >= 0.8, score, notes,
        summary: `Верно: ${ev.filter(x => x.s === 'ok').length} из ${INV_S.length}.`,
        mentor: score < 0.8 ? 'Удобный порядок вопросов: <b>кому польза?</b> (V) → <b>влезает ли в спринт?</b> (S) → <b>как проверить?</b> (T) → <b>нет ли внутри решения?</b> (N) → <b>понятно ли, что делать?</b> (E) → <b>не держится ли за другую?</b> (I).' : null
      };
    },
    explain: `<p>Шесть историй — шесть разных болезней, и у каждой своё лечение:</p>
      <ul class="checks">
        <li><b>S</b> — «запись, предоплата, напоминания, перенос, бонусы» — эпик. Режем вертикально: каждая часть даёт клиенту что-то целое.</li>
        <li><b>T</b> — «удобно» — добавить измеримое: «записаться за 3 шага».</li>
        <li><b>V</b> — «таблица booking» — это задача, она живёт внутри истории записи.</li>
        <li><b>I</b> — «только после отмены» — объединить или вынести общий экран.</li>
        <li><b>N</b> — «синяя кнопка 48 px» — оставить потребность, решение отдать Нике и Глебу.</li>
        <li><b>E</b> — «нейросеть угадывает» — сначала разговор. У «Шашки» уже есть понятное правило — лимит 3 000 ₽ (BR-9).</li>
      </ul>
      <p>INVEST — не оценка аналитика, а общий язык с командой: «эта не проходит по S» короче и точнее, чем «какая-то она большая». Источник: Билл Уэйк, «INVEST in Good Stories, and SMART Tasks» (2003); Майк Кон, «Пользовательские истории», гл. 2.</p>`,
    refNote: '«Удобное приложение» с вердиктом E и «нейросеть» с вердиктом V засчитываются наполовину.',
    report: ans => invEval(ans && ans.v).map(x => `- ${x.r.t.slice(0, 80)}… → ${chT(x.g)} ${mark(x.s)}`).join('\n')
  };

  // =====================================================================
  // Практика 3. Лаборатория: Use Case «Согласовать доп. работы» под прогоном Лизы
  // =====================================================================
  const MAIN = [
    { id: 'm1', t: 'Механик отмечает в планшете находку: фото и короткое описание (BR-7)' },
    { id: 'm2', t: 'Система уведомляет мастера-приёмщика о находке' },
    { id: 'm3', t: 'Мастер-приёмщик формирует предложение: работы, запчасти, цена' },
    { id: 'm4', t: 'Система отправляет предложение клиенту (push и карточка с фото и ценой); заказ-наряд → «Ждёт согласования»' },
    { id: 'm5', t: 'Клиент открывает предложение и нажимает «Согласовать»' },
    { id: 'm6', t: 'Система фиксирует решение («Согласовано», решил клиент), добавляет работы в заказ-наряд, статус → «В работе»' },
    { id: 'm7', t: 'Система уведомляет механика: доп. работы можно выполнять' }
  ];
  const MAIN_OK = MAIN.map(m => m.id);
  const AT_CH = [{ v: '1', t: 'к шагу 1' }, { v: '2', t: 'к шагу 2' }, { v: '3', t: 'к шагу 3' }, { v: '4', t: 'к шагу 4' }, { v: '5', t: 'к шагу 5' }, { v: '6', t: 'к шагу 6' }, { v: '7', t: 'к шагу 7' }, { v: '5a', t: 'к расширению «нет ответа 20 минут»' }];
  const EXT = [
    {
      id: 'e1', t: 'Клиент — компания, сумма в пределах лимита договора (у «Шашки» — 3 000 ₽)', rule: 'BR-9', at: '4', atWarn: '3',
      opts: [
        { id: 'auto', t: 'Система согласует автоматически (решено: автоматически) и уведомляет завгара; переход к шагу 6', k: 'good' },
        { id: 'driver', t: 'Предложение уходит водителю, который пригнал машину', k: 'bad' },
        { id: 'call', t: 'Мастер звонит завгару по каждой находке', k: 'mid' }
      ]
    },
    {
      id: 'e2', t: 'Клиент — компания, сумма выше лимита договора', rule: 'BR-9', at: '4', atWarn: '3',
      opts: [
        { id: 'fleet', t: 'Предложение уходит завгару в кабинет компании; дальше шаги 5–7 — от его имени', k: 'good' },
        { id: 'auto', t: 'Согласовать автоматически — постоянный клиент, договор есть', k: 'bad' },
        { id: 'later', t: 'Отложить до выдачи машины — обсудят с водителем', k: 'bad' }
      ]
    },
    {
      id: 'e3', t: 'Клиент не ответил в приложении 20 минут', rule: 'BR-8', at: '5', atWarn: '4',
      opts: [
        { id: 'call', t: 'Система ставит мастеру задачу «Позвонить клиенту»; ответ по телефону мастер вносит сам (решено: по телефону)', k: 'good' },
        { id: 'silent', t: 'Молчание — знак согласия: система согласует сама', k: 'bad' },
        { id: 'wait', t: 'Ждать ответа в приложении, сколько понадобится', k: 'bad' }
      ]
    },
    {
      id: 'e4', t: 'Мастер не дозвонился до клиента', rule: 'BR-8', at: '5a', atWarn: '5',
      opts: [
        { id: 'cont', t: 'Основные работы продолжаются, доп. ждут; к концу основных ответа нет — предложение «Истекло», обсуждают при выдаче', k: 'good' },
        { id: 'stop', t: 'Машина стоит на подъёмнике до ответа клиента', k: 'bad' },
        { id: 'do', t: 'Механик делает доп. работы — это же для безопасности', k: 'bad' }
      ]
    },
    {
      id: 'e5', t: 'Клиент отказался от доп. работ', rule: 'BR-6', at: '5', atWarn: '',
      opts: [
        { id: 'rej', t: 'Система фиксирует «Отклонено», работы в заказ-наряд не добавляются, механик продолжает основные; отказ виден в истории машины', k: 'good' },
        { id: 'push', t: 'Мастер звонит и уговаривает', k: 'mid' },
        { id: 'close', t: 'Заказ-наряд закрывается, клиент забирает машину', k: 'bad' }
      ]
    }
  ];
  const UC_Q = {
    q: 'Почему «нет ответа 20 минут» — расширение шага 5, а не отдельный вариант использования?',
    options: [
      { t: 'Цель актора та же — решить по доп. работам; меняется только путь к ней в одной точке основного сценария', ok: true, why: 'Именно: расширение — другой путь к той же цели (или к неудаче) из конкретного шага.' },
      { t: 'Потому что у расширений не бывает своих правил', why: 'Бывают: у этого — BR-8. Правило не делает ветку отдельным сценарием.' },
      { t: 'Потому что в нём участвует мастер-приёмщик', why: 'Мастер участвует и в основном сценарии (шаг 3). Участник не определяет границу сценария.' },
      { t: 'Так короче, а по смыслу разницы нет', why: 'Разница есть: отдельный сценарий означал бы отдельную цель актора. Здесь цель одна.' }
    ]
  };
  function ucRun(a) {
    a = a || {}; const re = a.re || {}, at = a.at || {}, ord = a.ord && a.ord.length === MAIN_OK.length ? a.ord : null;
    const o = id => (EXT.find(e => e.id === id).opts.find(x => x.id === re[id]) || null);
    const before = (x, y) => ord ? ord.indexOf(x) < ord.indexOf(y) : false;
    const runs = [];
    // C1 — основной сценарий
    const keyOrd = before('m3', 'm4') && before('m4', 'm5') && before('m5', 'm6') && before('m6', 'm7') && before('m1', 'm3');
    runs.push(!ord ? { k: 'bad', c: 'Елена, задние колодки, 3 200 ₽, согласовала через 7 минут', min: 0, law: 0, tr: 0, t: 'Основной сценарий не упорядочен — прогонять нечего.', pend: true }
      : keyOrd ? { k: 'good', c: 'Елена, задние колодки, 3 200 ₽, согласовала через 7 минут', min: 7, law: 0, tr: 1, t: 'Фото и цена пришли в приложение, Елена нажала «Согласовать» на совещании. Механик получил сигнал и продолжил.' }
        : { k: 'bad', c: 'Елена, задние колодки, 3 200 ₽, согласовала через 7 минут', min: 35, law: before('m6', 'm5') || before('m7', 'm5') ? 1 : 0, tr: -1, t: before('m4', 'm3') ? 'Предложение ушло клиентке раньше, чем мастер посчитал цену: Елена видит фото без суммы и звонит Марине. Простой — 35 минут.' : before('m7', 'm5') || before('m6', 'm5') ? 'Механику разрешили доп. работы до решения клиентки — это работа без согласия (BR-6).' : 'Шаги перепутаны: Лиза не может пройти сценарий от начала до конца, разработчики делают каждый по-своему.' });
    // C2 — «Шашка» в пределах лимита
    const e1 = o('e1');
    runs.push(!e1 ? { k: 'bad', c: '«Шашка», лампа ближнего света, 900 ₽', min: 0, law: 0, tr: 0, t: 'Реакция не выбрана.', pend: true }
      : e1.id === 'auto' ? { k: 'good', c: '«Шашка», лампа ближнего света, 900 ₽', min: 1, law: 0, tr: 1, t: 'Сумма в лимите 3 000 ₽ — согласовано автоматически, Рустам получил уведомление. Машина в линию через 20 минут.' }
        : e1.id === 'call' ? { k: 'mid', c: '«Шашка», лампа ближнего света, 900 ₽', min: 25, law: 0, tr: -1, t: 'Мастер 25 минут ловит Рустама ради лампы за 900 ₽.', react: { who: 'rustam', html: 'Зачем мне звонить из-за лампы? У нас же лимит в договоре.' } }
          : { k: 'bad', c: '«Шашка», лампа ближнего света, 900 ₽', min: 40, law: 1, tr: -1, t: 'Водитель такси не плательщик и не может согласовывать: решение принял не тот, кто платит.', react: { who: 'rustam', html: 'Водитель вам ничего согласовывать не может. Счёт оплачиваю я.' } });
    // C3 — «Шашка» выше лимита
    const e2 = o('e2');
    runs.push(!e2 ? { k: 'bad', c: '«Шашка», передние колодки и диски, 4 800 ₽', min: 0, law: 0, tr: 0, t: 'Реакция не выбрана.', pend: true }
      : e2.id === 'fleet' ? { k: 'good', c: '«Шашка», передние колодки и диски, 4 800 ₽', min: 15, law: 0, tr: 1, t: 'Выше лимита — предложение в кабинете компании. Рустам согласовал за 15 минут.' }
        : e2.id === 'auto' ? { k: 'bad', c: '«Шашка», передние колодки и диски, 4 800 ₽', min: 1, law: 1, tr: -2, t: 'Согласовано без завгара сверх лимита договора. В конце месяца «Шашка» отказывается оплачивать 4 800 ₽.', react: { who: 'olga', html: 'Сверх лимита без согласования компании — это наш убыток. Счёт они не примут.' } }
          : { k: 'bad', c: '«Шашка», передние колодки и диски, 4 800 ₽', min: 0, law: 0, tr: -1, t: 'Машину выдали с изношенными колодками. Через три дня она вернулась на эвакуаторе — простой такси Рустам считает своими деньгами.' });
    // C4 — Елена молчит 20 минут, потом берёт трубку
    const e3 = o('e3');
    runs.push(!e3 ? { k: 'bad', c: 'Елена на совещании 20 минут, потом берёт трубку', min: 0, law: 0, tr: 0, t: 'Реакция не выбрана.', pend: true }
      : e3.id === 'call' ? { k: 'good', c: 'Елена на совещании 20 минут, потом берёт трубку', min: 24, law: 0, tr: 1, t: 'Через 20 минут мастер получил задачу и дозвонился; решение «по телефону» записано в предложении.' }
        : e3.id === 'silent' ? { k: 'bad', c: 'Елена на совещании 20 минут, потом берёт трубку', min: 20, law: 1, tr: -2, t: 'Система «согласовала молчанием». Платные работы без согласия — нарушение закона (BR-6). Елена требует вернуть деньги.', react: { who: 'elena', html: 'Я ничего не согласовывала. Я была на совещании!' } }
          : { k: 'bad', c: 'Елена на совещании 20 минут, потом берёт трубку', min: 95, law: 0, tr: -1, t: 'Никто не звонит — ждём, пока Елена откроет приложение вечером. Машина полтора часа на подъёмнике.' });
    // C5 — молчит, не дозвонились, основные работы кончились
    const e4 = o('e4');
    let c5;
    if (!e3 || !e4) c5 = { k: 'bad', c: 'Клиент молчит, мастер не дозвонился, основные работы закончились через 50 минут', min: 0, law: 0, tr: 0, t: 'Реакции не выбраны.', pend: true };
    else if (e3.id === 'silent') c5 = { k: 'bad', c: 'Клиент молчит, мастер не дозвонился, основные работы закончились через 50 минут', min: 20, law: 1, tr: -2, t: 'До звонка дело не дошло: «молчание — согласие» уже сработало. Работы без согласия (BR-6).' };
    else if (e3.id === 'wait') c5 = { k: 'bad', c: 'Клиент молчит, мастер не дозвонился, основные работы закончились через 50 минут', min: 120, law: 0, tr: -1, t: 'Звонка нет, ждём без конца: машина на подъёмнике до вечера.' };
    else c5 = e4.id === 'cont' ? { k: 'good', c: 'Клиент молчит, мастер не дозвонился, основные работы закончились через 50 минут', min: 0, law: 0, tr: 0, t: 'Основные работы шли без остановки; к их концу ответа нет — предложение «Истекло», обсудят при выдаче. Пост свободен.' }
      : e4.id === 'stop' ? { k: 'bad', c: 'Клиент молчит, мастер не дозвонился, основные работы закончились через 50 минут', min: 110, law: 0, tr: -1, t: 'Машина стоит на подъёмнике до ответа клиента — почти два часа. Следующая запись на этот пост сдвигается.' }
        : { k: 'bad', c: 'Клиент молчит, мастер не дозвонился, основные работы закончились через 50 минут', min: 0, law: 1, tr: -2, t: 'Механик сделал работы «для безопасности». Клиент отказывается платить — и по закону прав (BR-6).' };
    runs.push(c5);
    // C6 — отказ
    const e5 = o('e5');
    runs.push(!e5 ? { k: 'bad', c: 'Елена отказалась: «замену дисков сделаю в следующий раз»', min: 0, law: 0, tr: 0, t: 'Реакция не выбрана.', pend: true }
      : e5.id === 'rej' ? { k: 'good', c: 'Елена отказалась: «замену дисков сделаю в следующий раз»', min: 3, law: 0, tr: 1, t: 'Отказ записан, механик продолжил основные работы. В следующий визит Марина Олеговна увидит рекомендацию в истории машины.' }
        : e5.id === 'push' ? { k: 'mid', c: 'Елена отказалась: «замену дисков сделаю в следующий раз»', min: 15, law: 0, tr: -2, t: 'Мастер 15 минут уговаривает. Елена раздражена: «Я же нажала „Отказаться“».' }
          : { k: 'bad', c: 'Елена отказалась: «замену дисков сделаю в следующий раз»', min: 0, law: 0, tr: -2, t: 'Заказ-наряд закрыли вместе с основными работами — Елена приехала на ТО, а уехала без него.' });
    const live = runs.filter(r => !r.pend);
    return { runs, avg: live.length ? Math.round(live.reduce((s, r) => s + r.min, 0) / live.length) : 0, law: live.reduce((s, r) => s + r.law, 0), tr: live.reduce((s, r) => s + r.tr, 0), done: !runs.some(r => r.pend) };
  }
  function ucEval(a) {
    a = a || {};
    const ord = a.ord && a.ord.length === MAIN_OK.length ? a.ord : null;
    const os = ord ? ui.orderScore(ord, MAIN_OK) : 0;
    const at = EXT.map(e => { const g = (a.at || {})[e.id]; return { e, g, s: g === e.at ? 'ok' : g && g === e.atWarn ? 'warn' : 'bad' }; });
    const re = EXT.map(e => { const o = e.opts.find(x => x.id === (a.re || {})[e.id]); return { e, o, pts: o ? (o.k === 'good' ? 1 : o.k === 'mid' ? 0.4 : 0) : 0 }; });
    const atS = at.reduce((s, x) => s + (x.s === 'ok' ? 1 : x.s === 'warn' ? 0.5 : 0), 0) / EXT.length;
    const reS = re.reduce((s, x) => s + x.pts, 0) / EXT.length;
    return { os, at, re, atS, reS };
  }
  const taskUc = {
    id: 't-uc', title: 'Лаборатория: Use Case «Согласовать доп. работы» под прогоном Лизы',
    simple: howUc.simple,
    lead: ui.brief({
      situation: 'Самый ветвистый процесс «Искры» — согласование доп. работ: здесь закон (BR-6), кто находит и кто считает (BR-7), таймер 20 минут (BR-8) и корпоративный лимит (BR-9). Вера: «Заголовок я заполнила. Расставьте основной сценарий, привяжите расширения и решите, что делает система в каждой ветке. Лиза прогонит шесть реальных случаев — посмотрим, сколько машины стоят на подъёмниках».',
      todo: [
        'Шаг 1. Расставьте семь шагов основного сценария по порядку (стрелки ↑ ↓ или перетаскивание).',
        'Шаг 2. Для каждого из пяти расширений выберите, к какому шагу оно привязано, и что делает система.',
        'Шаг 3. Смотрите прогон Лизы: шесть случаев, простой в минутах, нарушения закона, доверие клиентов. Ответьте на вопрос и нажмите «Проверить».',
        'Засчитывается, если основной сценарий почти без ошибок, расширения привязаны верно (не меньше 4 из 5), в каждой ветке выбрана лучшая реакция (для отказа допустимо и «уговорить»), нарушений закона нет и ответ на вопрос верный.'
      ],
      look: 'Цель — «простой на согласовании не больше 20 минут». Кто что делает: механик находит (с фото), мастер считает цену, клиент решает. «Шашка»: лимит 3 000 ₽, выше — завгар в кабинете компании. Нет ответа 20 минут — звонок; не дозвонились — основные работы идут, доп. ждут, в конце — «Истекло».'
    }),
    blank: () => ({ at: {}, re: {}, q: [] }),
    reference: () => ({ ord: MAIN_OK.slice(), at: Object.fromEntries(EXT.map(e => [e.id, e.at])), re: Object.fromEntries(EXT.map(e => [e.id, e.opts.find(o => o.k === 'good').id])), q: quizRef(UC_Q) }),
    render(el, ctx) {
      el.classList.add('m2s-root');
      const a = ctx.ans, ro = ctx.readonly; a.at = a.at || {}; a.re = a.re || {}; a.q = a.q || [];
      const showR = !!(ctx.result || ro);
      el.innerHTML = `<div class="stack">
        <div class="card flat"><div class="eyebrow">UC-07 · Согласовать доп. работы</div>
          <div class="m2s-facts">
            <div class="m2s-fact"><b>Основной актор</b>Клиент (у компании — завгар). Участвуют: механик, мастер-приёмщик.</div>
            <div class="m2s-fact"><b>Уровень</b>Цель пользователя («уровень моря»)</div>
            <div class="m2s-fact"><b>Предусловия</b>Машина на посту, заказ-наряд «В работе»</div>
            <div class="m2s-fact"><b>Триггер</b>Механик нашёл проблему вне заказ-наряда</div>
            <div class="m2s-fact"><b>Минимальные гарантии</b>Платные доп. работы без согласия плательщика не выполняются (BR-6)</div>
            <div class="m2s-fact"><b>Гарантии успеха</b>Решение записано: кто, когда, каким способом; заказ-наряд обновлён</div>
          </div></div>
        <div class="stack tight"><span class="eyebrow">Шаг 1 · Основной сценарий</span><div data-ord></div></div>
        <div class="stack tight"><span class="eyebrow">Шаг 2 · Расширения</span><div class="stack" data-ext></div></div>
        <div class="stack tight"><span class="eyebrow">Шаг 3 · Прогон Лизы</span><div class="m2s-stats" data-st></div><div class="m2s-runs" data-runs></div></div>
        <div class="card flat" data-q></div></div>`;
      const ev0 = ucEval(a);
      let ordReveal = null;
      if (showR && a.ord) { ordReveal = {}; a.ord.forEach((id, i) => { ordReveal[id] = MAIN_OK[i] === id ? 'ok' : 'bad'; }); }
      ui.order(TR.$('[data-ord]', el), { items: MAIN, value: a.ord, reveal: ordReveal, readonly: ro, seed: 'm2s-uc', onChange: v => { a.ord = v; ctx.save(); drawRuns(); } });
      function drawExt() {
        TR.$('[data-ext]', el).innerHTML = EXT.map((e, i) => {
          const atE = ev0.at[i], atCls = showR && a.at[e.id] ? atE.s : '';
          return `<div class="m2s-ext"><header><span class="n">Расширение · ${e.rule}</span><b>${esc(e.t)}</b></header>
            <div class="at ${atCls}"><span>Привязано</span><select data-at="${e.id}" aria-label="К какому шагу привязано: ${esc(e.t)}" ${ro ? 'disabled' : ''}><option value="">выберите шаг…</option>${AT_CH.map(c => `<option value="${c.v}" ${a.at[e.id] === c.v ? 'selected' : ''}>${esc(c.t)}</option>`).join('')}</select>
              ${atCls ? `<span class="chip ${atCls === 'ok' ? 'ok' : atCls === 'warn' ? 'warn' : 'bad'}">${atCls === 'ok' ? 'верно' : atCls === 'warn' ? 'почти' : 'не здесь'}</span>` : ''}</div>
            <div class="m2s-opts">${e.opts.map(o => {
              const on = a.re[e.id] === o.id, cls = showR && on ? (o.k === 'good' ? 'ok' : o.k === 'mid' ? 'warn' : 'bad') : '';
              return `<button type="button" class="m2s-opt ${cls}" data-e="${e.id}" data-o="${o.id}" aria-pressed="${on}" ${ro ? 'disabled' : ''}><span class="bx" aria-hidden="true"></span><span>${esc(o.t)}</span></button>`;
            }).join('')}</div></div>`;
        }).join('');
      }
      function drawRuns() {
        const r = ucRun(a);
        TR.$('[data-st]', el).innerHTML = `
          <div class="stat"><span class="k">Средний простой</span><span class="v ${!r.done ? '' : r.avg <= 20 ? 'ok' : r.avg <= 40 ? 'warn' : 'bad'}">${r.avg} мин</span><span class="s">цель — до 20 мин (было 1 ч 40 мин)</span></div>
          <div class="stat"><span class="k">Нарушения BR-6</span><span class="v ${r.law ? 'bad' : 'ok'}">${r.law}</span><span class="s">работы без согласия плательщика</span></div>
          <div class="stat"><span class="k">Доверие клиентов</span><span class="v ${r.tr > 0 ? 'ok' : r.tr < 0 ? 'bad' : ''}">${signed(r.tr)}</span><span class="s">Елена, Рустам</span></div>
          <div class="stat"><span class="k">Прогнано</span><span class="v">${r.runs.filter(x => !x.pend).length} из 6</span><span class="s">случаев</span></div>`;
        TR.$('[data-runs]', el).innerHTML = r.runs.map((x, i) => `<div class="m2s-run ${x.pend ? '' : x.k}"><div class="hd"><span>Случай ${i + 1}. ${esc(x.c)}</span>${x.pend ? '' : `<span class="mn">простой ${x.min} мин${x.law ? ' · BR-6 ✗' : ''}</span>`}</div><div class="tx">${x.t}</div>${x.react ? talk([x.react]) : ''}</div>`).join('');
      }
      drawExt(); drawRuns();
      ui.quiz(TR.$('[data-q]', el), Object.assign({}, UC_Q, { value: a.q, readonly: ro, reveal: ctx.result, onChange: v => { a.q = v; ctx.save(); } }));
      if (ro) return;
      TR.on(el, 'click', '[data-e][data-o]', (e, b) => {
        a.re[b.dataset.e] = b.dataset.o; ctx.save();
        const ex = EXT.find(x => x.id === b.dataset.e);
        ctx.decide('UC доп. работ: ' + ex.t, ex.opts.find(o => o.id === b.dataset.o).t);
        TR.$$(`[data-e="${b.dataset.e}"]`, el).forEach(x => x.setAttribute('aria-pressed', String(x === b)));
        drawRuns();
      });
      el.addEventListener('change', e => { const s = e.target.closest('select[data-at]'); if (!s) return; if (s.value) a.at[s.dataset.at] = s.value; else delete a.at[s.dataset.at]; ctx.save(); });
    },
    check(ans) {
      ans = ans || {};
      const ev = ucEval(ans), r = ucRun(ans), q = ui.quizScore(UC_Q, ans.q || []), notes = [];
      notes.push(ev.os >= 0.95 ? { ok: true, html: 'Основной сценарий: шаги по порядку — механик нашёл, мастер посчитал, клиент решил, система зафиксировала и дала сигнал механику.' } : { ok: ev.os >= 0.85 ? 'warn' : false, html: `Основной сценарий: порядок верен на ${Math.round(ev.os * 100)} %. Проверьте: кто формирует цену и может ли клиент получить предложение раньше, чем она посчитана? Может ли механик получить сигнал раньше, чем клиент решил?` });
      ev.at.forEach(x => { if (x.s !== 'ok') notes.push({ ok: x.s === 'warn' ? 'warn' : false, html: `«${esc(x.e.t)}» — ${!x.g ? 'шаг не выбран.' : x.s === 'warn' ? 'почти: ' + (x.e.id === 'e4' ? 'звонок — уже ветка «нет ответа 20 минут», поэтому «не дозвонился» живёт внутри неё (5a1).' : 'ветка возникает в момент, когда предложение должно уйти клиенту, — на шаге отправки.') : 'привязано не к тому шагу. В какой момент основного сценария эта ситуация впервые становится видна?'}` }); });
      ev.re.forEach(x => {
        if (!x.o) notes.push({ ok: false, html: `«${esc(x.e.t)}» — реакция не выбрана.` });
        else if (x.o.k !== 'good') notes.push({ ok: x.o.k === 'mid' ? 'warn' : false, html: `«${esc(x.e.t)}» → «${esc(x.o.t)}». Смотрите прогон: ${esc(x.o.k === 'mid' ? 'работает, но стоит минут и нервов.' : 'ломает правило ' + x.e.rule + ' или держит машину на подъёмнике.')}` });
      });
      if (ev.re.every(x => x.o && x.o.k === 'good')) notes.push({ ok: true, html: 'Все пять веток: система действует по правилам BR-6, BR-8, BR-9 и не держит машину на подъёмнике.' });
      if (r.law) notes.push({ ok: false, html: `Прогон: ${r.law} ${TR.plural(r.law, 'нарушение', 'нарушения', 'нарушений')} закона — доп. работы без согласия плательщика.` });
      notes.push(q.ok ? { ok: true, html: 'Вопрос: верно.' } : { ok: false, html: 'Вопрос: расширение — другой путь к той же цели из одной точки сценария.' });
      const score = ev.os * 0.2 + ev.atS * 0.2 + ev.reS * 0.45 + q.score * 0.15;
      const reOk = ev.re.every(x => x.o && (x.o.k === 'good' || (x.e.id === 'e5' && x.o.k === 'mid')));
      const ok = ev.os >= 0.9 && ev.at.filter(x => x.s === 'ok').length >= 4 && reOk && !r.law && q.ok && score >= 0.8;
      return {
        ok, score: Math.min(1, score), notes,
        summary: r.done ? `Прогон: средний простой ${r.avg} мин, нарушений BR-6 — ${r.law}, доверие ${signed(r.tr)}.` : 'Прогон не завершён: расставьте сценарий и выберите реакции во всех ветках.',
        mentor: r.law ? 'Главная гарантия этого сценария — <b>минимальная</b>: без согласия плательщика платные доп. работы не выполняются (BR-6). Молчание — не согласие, водитель — не плательщик, «для безопасности» — не основание.' : (r.done && r.avg > 20 ? 'Простой больше цели в 20 минут. Где машина стоит без дела? Подсказка: «не дозвонились» не значит «остановить работы».' : null)
      };
    },
    explain: `<p>Основной сценарий — семь шагов без единого «если»: <b>механик находит → мастер узнаёт → мастер считает → система отправляет клиенту → клиент согласует → система фиксирует → механик получает сигнал</b>. Все «если» — в расширениях:</p>
      <ul class="checks">
        <li><b>4a. Компания, в пределах лимита</b> (BR-9) — согласовано автоматически, завгар уведомлён. <b>4b. Выше лимита</b> — завгар в кабинете компании, дальше шаги 5–7 от его имени.</li>
        <li><b>5a. Нет ответа 20 минут</b> (BR-8) — задача мастеру позвонить; решение по телефону записывается с пометкой «по телефону».</li>
        <li><b>5a1. Не дозвонился</b> — основные работы идут, доп. ждут; к концу основных — «Истекло», обсуждают при выдаче. Машина не стоит.</li>
        <li><b>5b. Отказ</b> — «Отклонено», работы не добавляются, рекомендация остаётся в истории машины.</li>
      </ul>
      <p>Обратите внимание на прогон: все опасные варианты либо нарушают минимальную гарантию (работы без согласия — BR-6, Закон о защите прав потребителей), либо держат машину на подъёмнике и съедают цель «20 минут». Одна история «Как клиент, я хочу согласовать доп. работы» эти ветки бы спрятала — а Лиза узнала бы о них на пилоте. Из каждого расширения потом получается история в бэклоге и набор критериев приёмки. Источник: Кокберн, «Современные методы описания функциональных требований к системам», гл. 5 «Сценарии и шаги» и гл. 6 «Расширения».</p>`,
    refNote: 'Корпоративные ветки, привязанные к шагу 3, и «не дозвонился», привязанное к шагу 5, засчитываются наполовину. Для отказа «мастер уговаривает» засчитывается частично.',
    report: ans => {
      ans = ans || {};
      const r = ucRun(ans), ord = ans.ord || [];
      return `- Основной сценарий: ${ord.map(id => MAIN_OK.indexOf(id) + 1).join(' → ') || '—'}\n` + EXT.map(e => `- ${e.t}: шаг ${(ans.at || {})[e.id] || '—'}, ${(e.opts.find(o => o.id === (ans.re || {})[e.id]) || { t: '—' }).t}`).join('\n') + `\n- Прогон: простой ${r.avg} мин, BR-6 нарушений ${r.law}, доверие ${signed(r.tr)}`;
    }
  };

  // =====================================================================
  // Практика 4. Какой формат для какой ситуации
  // =====================================================================
  const FMT_B = [
    { id: 'story', t: 'Пользовательская история', sub: 'одна ценность, мало веток' },
    { id: 'uc', t: 'Use Case', sub: 'много веток и участников' },
    { id: 'both', t: 'История + Use Case', sub: 'планировать историями, понимать сценарием' },
    { id: 'none', t: 'Ни то ни другое', sub: 'это правило или НФТ' }
  ];
  const FMT_I = [
    { id: 'f1', t: 'Напомнить клиенту о записи за сутки', ok: 'story', why: 'Одна ценность, одно событие, пара критериев. Сценарий был бы тяжелее самой функции.' },
    { id: 'f2', t: 'Согласовать доп. работы: клиент, корпоративный лимит, нет ответа 20 минут, не дозвонились, отказ', ok: 'uc', alt: { both: 'Да, в бэклоге всё равно будут истории. Но главный артефакт здесь — сценарий: без него ветки потеряются.' }, why: 'Много участников и веток с правилами BR-6…BR-9 — классический Use Case.' },
    { id: 'f3', t: 'Онлайн-оплата: карта и СБП через ЮKassa, оплата не прошла, уведомление пришло дважды, возврат', ok: 'uc', alt: { both: 'Тоже верно по жизни. Но сначала нужен сценарий со всеми сбоями — истории нарежутся из него.' }, why: 'Внешняя система, сбои, повторы, возврат — ветки, которые надо увидеть вместе.' },
    { id: 'f4', t: 'Клиент видит историю обслуживания своей машины', ok: 'story', why: 'Простой просмотр без ветвлений — история с критериями.' },
    { id: 'f5', t: 'Эпик «Онлайн-запись» на четыре спринта — с проверками BR-1, BR-2 и предоплатой по BR-4 для разработчиков и Лизы', ok: 'both', alt: { uc: 'Сценарий нужен, но планировать четыре спринта сценарием неудобно — в бэклоге будут истории со ссылкой на него.' }, why: 'Планируют историями по спринтам, а целостную картину с ветками держит сценарий.' },
    { id: 'f6', t: 'Поиск слотов — не дольше 1 секунды для 95 % запросов при 1 500 одновременных пользователях', ok: 'none', why: 'Это НФТ. Его привязывают к историям и сценарию как ограничение качества, но им не пишут ни историю, ни сценарий.' },
    { id: 'f7', t: 'Бонусы — 5 % от работ, сгорают через 12 месяцев, корпоративным не начисляются', ok: 'none', why: 'Бизнес-правило BR-11 — в каталог правил. Истории и сценарии на него ссылаются.' },
    { id: 'f8', t: 'Мастер-приёмщик отмечает «Клиент приехал» одной кнопкой', ok: 'story', why: 'Одно действие, одна ценность.' },
    { id: 'f9', t: 'Выдача машины: оплата, чек по 54-ФЗ, обсуждение «Истекших» доп. работ, платное хранение после следующего дня (BR-13)', ok: 'uc', alt: { both: 'Хороший ответ для жизни: сценарий + истории по веткам. Засчитано наполовину — главный здесь сценарий.' }, why: 'На стойке сходятся оплата, закон, истекшие предложения и хранение — нужен сценарий со всеми ветками.' }
  ];
  function fmtEval(v) {
    v = v || {};
    return FMT_I.map(r => { const g = v[r.id]; if (g === r.ok) return { r, g, s: 'ok', pts: 1 }; if (r.alt && r.alt[g]) return { r, g, s: 'warn', pts: 0.5 }; return { r, g, s: 'bad', pts: 0 }; });
  }
  const fbT = id => (FMT_B.find(b => b.id === id) || { t: '—' }).t;
  const taskFormat = {
    id: 't-format', title: 'История или сценарий: формат для девяти ситуаций',
    simple: howUc.simple,
    lead: ui.brief({
      situation: 'Артём: «Чтобы мы не спорили на каждом груминге — давайте договоримся, что пишем историей, что сценарием, а что вообще не то и не другое». Вера выписала девять тем из бэклога «Искры».',
      todo: [
        'Разложите девять тем по четырём корзинам: история, Use Case, история вместе со сценарием, ни то ни другое.',
        'Спросите себя: сколько веток и участников? Это одна ценность или процесс? А может, это правило или атрибут качества?',
        'Нажмите «Проверить». Засчитывается от 80 %. Спорные пары засчитываются наполовину — с пояснением.'
      ],
      look: 'Мерило — ветвистость. Одна ценность и пара критериев — история. Много «а если…», участников и правил — сценарий. Правило и НФТ — не формат задачи, а то, на что задачи ссылаются.'
    }),
    blank: () => ({ v: {} }),
    reference: () => ({ v: Object.fromEntries(FMT_I.map(r => [r.id, r.ok])) }),
    render(el, ctx) {
      el.classList.add('m2s-root');
      let reveal = null;
      if (ctx.result) { reveal = {}; fmtEval(ctx.ans.v).forEach(x => { if (x.g) reveal[x.r.id] = x.s; }); }
      const box = document.createElement('div'); el.appendChild(box);
      ui.sort(box, { items: FMT_I.map(r => ({ id: r.id, t: esc(r.t) })), buckets: FMT_B, value: ctx.ans.v || {}, reveal, readonly: ctx.readonly, seed: 'm2s-fmt', onChange: v => { ctx.ans.v = v; ctx.save(); } });
    },
    check(ans) {
      const ev = fmtEval(ans && ans.v), score = ev.reduce((s, x) => s + x.pts, 0) / FMT_I.length, notes = [];
      ev.forEach(x => {
        if (x.s === 'ok') return;
        if (x.s === 'warn') notes.push({ ok: 'warn', html: `«${esc(x.r.t)}» → ${fbT(x.g)}. ${x.r.alt[x.g]}` });
        else notes.push({ ok: false, html: `«${esc(x.r.t)}» — ${x.g ? `не «${fbT(x.g)}». ` + (x.r.ok === 'none' ? 'Это действие человека или правило и атрибут качества?' : x.r.ok === 'story' ? 'Сколько здесь веток? Не тяжеловат ли сценарий для одной кнопки?' : 'Сколько здесь «а если…»? Удержит ли их одна история?') : 'не разложено.'}` });
      });
      if (!notes.length) notes.push({ ok: true, html: 'Все девять — в своих корзинах.' });
      const key = ev.find(x => x.r.id === 'f2');
      return {
        ok: score >= 0.8 && key.s !== 'bad', score, notes,
        summary: `Верно: ${ev.filter(x => x.s === 'ok').length} из ${FMT_I.length}, допустимо: ${ev.filter(x => x.s === 'warn').length}.`,
        mentor: key.s === 'bad' ? 'Согласование доп. работ — пять веток, три участника и четыре правила. Вспомните прогон Лизы: что стало бы с этими ветками в одной истории?' : (score < 0.8 ? 'Мерило — ветвистость и число участников. А правило и НФТ — не задачи, а то, на что задачи ссылаются.' : null)
      };
    },
    explain: `<p>Договорённость для «Искры» получается такая:</p>
      <ul class="checks">
        <li><b>История</b> — одна ценность, мало веток: напоминание, история обслуживания, кнопка «Клиент приехал».</li>
        <li><b>Use Case</b> — много веток, участников и правил: согласование доп. работ, онлайн-оплата, выдача машины.</li>
        <li><b>Оба</b> — большой эпик: планируем историями по спринтам, а картину с ветками держит сценарий, на который истории ссылаются.</li>
        <li><b>Ни то ни другое</b> — правило BR-11 и НФТ про 1 секунду. Они живут в каталоге правил и разделе НФТ, а истории и сценарии на них ссылаются.</li>
      </ul>
      <p>На собеседовании ценят именно критерий выбора, а не «у нас Scrum — значит, только истории». Источник: Кокберн, «Современные методы описания функциональных требований к системам», приложение о сравнении с пользовательскими историями; Майк Кон, «Пользовательские истории», гл. 12 «Чем пользовательские истории не являются».</p>`,
    refNote: 'Для онлайн-оплаты, согласования доп. работ и выдачи машины «история + сценарий» засчитывается наполовину; для эпика онлайн-записи — «только сценарий».',
    report: ans => fmtEval(ans && ans.v).map(x => `- ${x.r.t} → ${fbT(x.g)} ${mark(x.s)}`).join('\n')
  };

  // =====================================================================
  // Практика 5. Своими словами Глебу
  // =====================================================================
  const EX_RUBRIC = [
    'История — короткое обещание разговора о потребности: роль, действие, ценность и критерии; хороша для планирования, оценки и простых ценностей вроде «напомнить о записи»',
    'Use Case — сценарий целиком: актор, предусловия, основной поток без «если», расширения и гарантии; нужен, когда много веток, участников и правил',
    'Согласование доп. работ ветвится: корпоративный лимит (BR-9), нет ответа 20 минут и не дозвонились (BR-8), отказ — в одной истории ветки потеряются, и это всплывёт на пилоте',
    'Форматы не конкурируют: в бэклоге истории (срезы по веткам), сценарий — общий контекст, на который они ссылаются; критерии приёмки берутся из расширений',
    'Говорит о последствиях: работы без согласия — нарушение закона (BR-6), машина на подъёмнике — деньги «Искры» и цель «20 минут»'
  ];
  const EX_REF = 'Глеб, истории никуда не денутся — по ним мы планируем спринты и оцениваем. История хороша, когда ценность одна и веток мало: «напомнить о записи за сутки» — стикер и четыре критерия, сценарий там лишний. С доп. работами иначе: три участника и пять веток — компания в пределах лимита 3 000 ₽ согласуется сама, выше — завгар в кабинете; клиент молчит 20 минут — мастер звонит; не дозвонились — основные работы идут, а предложение в конце истекает; отказ. Если записать это одной историей «хочу согласовать доп. работы», ветки спрячутся в критериях, каждый поймёт по-своему, а Лиза найдёт дыры на пилоте. Цена ошибки высокая: сделать работы без согласия — нарушение закона, а машина на подъёмнике — простой, ради сокращения которого нас и наняли. Поэтому предлагаю так: Use Case — одна страница с основным потоком и расширениями, это общая картина. А в бэклог из него нарежем истории — основной путь, корпоративный лимит, звонок через 20 минут, истечение, — и критерии приёмки для каждой возьмём прямо из расширений.';
  const taskExplain = {
    id: 't-explain', title: 'Своими словами: когда история, а когда сценарий',
    simple: {
      icon: '🗣️',
      plain: 'Глеб — практик: ему не нужны определения, ему нужно понять, что команда получит от сценария и почему одной истории мало. Объясните на примере доп. работ — и предложите, как форматы уживутся вместе.',
      analogy: 'Список покупок и рецепт. Для «купить хлеб» хватает строчки в списке. Для праздничного торта нужен рецепт с шагами и «если крем не густеет — добавьте…». Но рецепт не заменяет список покупок — он из него рождается.',
      tech: 'Опора: 3C и INVEST (Кон, Уэйк), Use Case с расширениями (Кокберн). Сильный ответ называет критерий выбора (ветвистость, участники, правила), пример с последствием ошибки и способ совместить форматы.'
    },
    lead: ui.brief({
      situation: 'После лаборатории Глеб пишет в чат: «У нас Scrum, всё в историях. Зачем ещё Use Case? Давайте согласование доп. работ одной историей и критериями — быстрее же». Вера: «Ответьте ему сами. Он примет аргументы, если они конкретные».',
      todo: [
        'Напишите ответ в 6–10 предложений (от 300 символов).',
        'Покажите, когда хороша история и когда нужен сценарий, почему согласование доп. работ — сценарий, что будет, если записать его одной историей, и как форматы работают вместе.',
        'Нажмите «Проверить с Верой (Claude)» или «Сверить с эталоном самому» и честно отметьте раскрытые пункты. Засчитывается от 60 %.'
      ],
      lookTitle: 'На что опереться',
      look: 'Лаборатория с прогоном Лизы — у вас есть цифры: простой, нарушения BR-6. Глеб любит конкретику: правила, ветки, что сломается.'
    }),
    blank: () => ({ j: {} }),
    reference: () => ({ j: { text: EX_REF, self: EX_RUBRIC.map(() => true) } }),
    render(el, ctx) {
      el.classList.add('m2s-root');
      el.insertAdjacentHTML('beforeend', ui.say('gleb', 'У нас Scrum, всё в историях. Зачем ещё Use Case? Давайте согласование доп. работ одной историей и критериями — быстрее же.'));
      const j = document.createElement('div'); j.style.marginTop = '12px'; el.appendChild(j);
      ui.justify(j, {
        id: 'm2s-explain', q: 'Когда писать пользовательскую историю, а когда — Use Case? Почему согласование доп. работ — сценарий?',
        qPlain: 'Объясните тимлиду-разработчику, когда достаточно пользовательской истории, а когда нужен вариант использования по Кокберну, почему согласование доп. работ в автосервисе (корпоративный лимит, нет ответа 20 минут, не дозвонились, отказ) лучше описать сценарием, что будет при одной истории и как совместить форматы.',
        rubric: EX_RUBRIC, reference: EX_REF, value: ctx.ans.j, readonly: ctx.readonly, minLen: 300,
        placeholder: 'Глеб, истории никуда не денутся…',
        onChange: v => { ctx.ans.j = v; ctx.save(); ctx.decide('История или сценарий (ответ Глебу)', v.text || ''); }
      });
    },
    check(ans) {
      const s = ui.justifyScore(ans && ans.j);
      return {
        ok: s >= 0.6, score: s,
        summary: s ? `Оценка ответа: ${Math.round(s * 100)} %.` : 'Напишите ответ (от 300 символов) и проверьте его с Верой или сверьте с эталоном сами.',
        notes: s && s < 0.6 ? [{ ok: false, html: 'Глебу нужны три вещи: критерий выбора формата, конкретные ветки доп. работ с правилами и предложение, как это ляжет в бэклог.' }] : []
      };
    },
    explain: `<p>Сильный ответ не спорит с «у нас Scrum», а встраивает сценарий в него: истории остаются единицей планирования, сценарий — общая картина для ветвистого процесса, а критерии приёмки историй берутся из его расширений. Аргумент — не определение, а цена ошибки: потерянная ветка «не дозвонились» означает либо машину на подъёмнике, либо работы без согласия.</p>
      <p>Частые ошибки: «сценарий подробнее, значит лучше» (тогда и напоминание надо было писать сценарием); «истории — для Scrum, сценарии — для водопада» (формат зависит от задачи, а не от процесса); забыть, как сценарий превратится в бэклог.</p>`,
    report: ans => (ans.j && ans.j.text) ? ans.j.text : '—'
  };

  // =====================================================================
  TR.stage({
    id: ID,
    when: 'среда, 25 ноября, 11:00 · стена со стикерами в «Орбите»',
    intro: [
      { who: 'dasha', html: 'На стене сорок стикеров, и на половине — «Как пользователь, я хочу удобно». Я не понимаю, что из этого делать.' },
      { who: 'marina', html: 'А я не понимаю, где тут написано, что делать, если клиент не берёт трубку. Или если это «Шашка». У меня таких «если» — каждый день.' },
      { who: 'gleb', html: 'И оценить половину невозможно. Одна история у вас на три спринта.' },
      { who: 'vera', html: 'Все трое правы — и это два разных инструмента. Пользовательская история — короткое обещание разговора, по ним планируют. Сценарий по Кокберну — вся картина с ветками. Сегодня научимся писать хорошие истории, проверять их по INVEST и соберём сценарий самого ветвистого процесса — согласования доп. работ.' }
    ],
    facts: ['F-noshow', 'F-idle', 'F-extra-law', 'F-extra-who', 'F-extra-timeout', 'F-corp', 'F-ready', 'F-cancel'],
    glossary: [
      { term: 'Пользовательская история (User Story)', simple: 'Короткая фраза: кто, что хочет сделать и зачем. Повод поговорить, а не полное описание.', tech: 'Формат «Как <роль>, я хочу <действие>, чтобы <ценность>» (Connextra); единица планирования в гибкой разработке (Кон).' },
      { term: '3C', simple: 'Карточка, разговор, подтверждение — три жизни истории.', tech: 'Card, Conversation, Confirmation (Р. Джеффрис): запись-напоминание, обсуждение деталей, критерии приёмки.' },
      { term: 'Критерии приёмки', simple: 'Список проверок: по ним понятно, что история сделана.', tech: 'Acceptance criteria — условия, которым должен удовлетворять результат; пишутся правилами или сценариями Дано/Когда/Тогда.' },
      { term: 'Эпик', simple: 'Большая история, которая не влезает в один спринт.', tech: 'Epic — крупный элемент бэклога, нарезаемый на истории вертикальными срезами.' },
      { term: 'INVEST', simple: 'Шесть проверок хорошей истории.', tech: 'Independent, Negotiable, Valuable, Estimable, Small, Testable (Б. Уэйк, 2003).' },
      { term: 'Вариант использования (Use Case)', simple: 'Сценарий: как человек шаг за шагом добивается цели с помощью системы, со всеми «а если…».', tech: 'По Кокберну: основной актор, уровень цели, заинтересованные лица, предусловия, триггер, гарантии, основной сценарий, расширения.' },
      { term: 'Актор', simple: 'Тот, кто взаимодействует с системой: человек или другая система.', tech: 'Основной актор преследует цель; второстепенные (ЮKassa, SMS-шлюз) помогают её достичь (UML 2.5, Кокберн).' },
      { term: 'Основной сценарий', simple: 'Самый частый путь к успеху — без «если».', tech: 'Main success scenario: 3–9 шагов «кто что делает».' },
      { term: 'Расширение', simple: 'Ветка «а если…» от конкретного шага основного сценария.', tech: 'Extension: условие + действия; нумеруется номером шага и буквой (5a, 5a1); заканчивается возвратом, успехом или неудачей.' },
      { term: 'Минимальные гарантии и гарантии успеха', simple: 'Что верно при любом исходе и что верно, когда цель достигнута.', tech: 'Minimal guarantees / success guarantees (Кокберн) — основа проверок конечного состояния.' },
      { term: '«include» и «extend»', simple: 'На диаграмме: «всегда входит внутрь» и «добавляется при условии».', tech: 'Отношения вариантов использования в UML 2.5: включение (обязательная общая часть) и расширение (необязательное поведение при условии в точке расширения).' }
    ],
    outro: 'Теперь у вас два инструмента. История — для одной ценности и для планирования: стикер, разговор, критерии, проверка по INVEST. Сценарий по Кокберну — для ветвистых процессов: основной поток без «если», расширения с номерами шагов, гарантии. Прогон Лизы показал цену потерянной ветки: машина на подъёмнике или работы без согласия. В пятницу Глеб спросит про то, что не поместилось ни в историю, ни в сценарий: «а сколько это — быстро?»',
    tasks: [howStory, howInvest, howUc, taskBuild, taskInvest, taskUc, taskFormat, taskExplain]
  });
})();
