/* Модуль 1, занятие 2: Команда разработки и роль системного аналитика.
   Теория: карта команды «Искра Онлайн» (роли, кто на какой вопрос отвечает, плохой и хороший аналитик в диалогах);
   бизнес- и системный аналитик — пошаговый «перевод» от слов Тимура Рашидовича до задачи разработчику, кто что решает;
   RACI на бытовом примере (ремонт ванной, поломки матрицы) и каналы коммуникации (чат, Jira, Confluence, встреча, письмо).
   Практика: кому адресовать 10 вопросов; день аналитика — бизнес-анализ, системный анализ или не ваша работа;
   RACI для пяти дел проекта; лаборатория «Спор о фото доп. работ» (чьё решение и как действовать — с последствиями);
   своими словами Тимуру Рашидовичу: кто в команде за что отвечает и зачем ему аналитик. */
'use strict';
(function () {
  const TR = window.TR, ui = TR.ui, esc = TR.esc;
  const ID = 'm1-team';

  if (!document.getElementById('m1t-css')) document.head.insertAdjacentHTML('beforeend', `<style id="m1t-css">
    .m1t-root, .m1t-root .stack > * { min-width: 0; }
    .m1t-root .seg button { white-space: normal; text-align: left; }
    .m1t-qbar { display: flex; flex-wrap: wrap; gap: 6px; }
    .m1t-qbar button { font: inherit; font-size: 13px; border: 1px solid var(--border-strong); background: var(--surface-2); color: var(--text-2); border-radius: 99px; padding: 5px 12px; cursor: pointer; }
    .m1t-qbar button[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); color: var(--accent); }
    .m1t-map { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; }
    .m1t-zone { display: grid; gap: 6px; align-content: start; padding: 10px; border: 1px solid var(--border); border-radius: 12px; background: var(--surface); min-width: 0; }
    .m1t-role { display: grid; grid-template-columns: 22px minmax(0, 1fr); align-items: center; gap: 8px; width: 100%; text-align: left; border: 1px solid var(--border); background: var(--surface-2); color: var(--text); border-radius: 9px; padding: 7px 9px; font-size: 13.5px; line-height: 1.25; cursor: pointer; min-width: 0; }
    .m1t-role:hover { border-color: var(--border-strong); }
    .m1t-role[aria-pressed="true"] { border-color: var(--accent); box-shadow: 0 0 0 1px var(--accent); }
    .m1t-role.main { background: var(--accent-soft); border-color: color-mix(in srgb, var(--accent) 60%, var(--border)); }
    .m1t-role.help { background: var(--info-soft); border-color: color-mix(in srgb, var(--info) 45%, var(--border)); }
    .m1t-role.dim { opacity: .45; }
    .m1t-role .ic { text-align: center; }
    .m1t-role .nm { min-width: 0; overflow-wrap: break-word; }
    .m1t-role .nm small { display: block; color: var(--text-muted); font-size: 11.5px; }
    .m1t-role .bd { display: inline-block; margin-top: 4px; font: 600 10px/1 var(--f-mono); padding: 3px 5px; border-radius: 5px; white-space: nowrap; }
    .m1t-role .seen { color: var(--accent); margin-left: 4px; }
    .m1t-role.main .bd { background: var(--accent); color: var(--accent-text); }
    .m1t-role.help .bd { background: var(--info); color: var(--surface); }
    .m1t-facts { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
    .m1t-fact { padding: 9px 12px; border-radius: 10px; background: var(--surface); border: 1px solid var(--border); font-size: 14px; min-width: 0; }
    .m1t-fact > b { display: block; font: 600 10.5px/1.3 var(--f-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 3px; }
    .m1t-fact.need { border-color: color-mix(in srgb, var(--ok) 45%, var(--border)); background: var(--ok-soft); }
    .m1t-fact.hurt { border-color: color-mix(in srgb, var(--bad) 45%, var(--border)); background: var(--bad-soft); }
    .m1t-h3 { font: 600 18px/1.3 var(--f-brand); margin: 0; }
    .m1t-layers { display: grid; gap: 8px; }
    .m1t-layer { display: grid; grid-template-columns: 30px minmax(0, 1fr); gap: 10px; padding: 10px 12px; border: 1px solid var(--border); border-left-width: 4px; border-radius: 10px; background: var(--surface); min-width: 0; }
    .m1t-layer.cur { border-left-color: var(--accent); box-shadow: 0 0 0 1px color-mix(in srgb, var(--accent) 40%, transparent); }
    .m1t-layer.past { border-left-color: var(--ok); }
    .m1t-layer.skip { border-left-color: var(--bad); background: var(--bad-soft); }
    .m1t-layer .no { width: 26px; height: 26px; border-radius: 50%; display: grid; place-items: center; font: 600 12px/1 var(--f-mono); background: var(--surface-3); color: var(--text-2); }
    .m1t-layer .hd { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; font-weight: 600; }
    .m1t-layer .tx { font-size: 14px; color: var(--text-2); margin-top: 3px; }
    .m1t-layer .tx b { color: var(--text); }
    .m1t-tag { display: inline-block; font: 600 10.5px/1 var(--f-mono); padding: 3px 7px; border-radius: 99px; letter-spacing: .04em; white-space: nowrap; }
    .m1t-tag.biz { background: var(--warn-soft); color: var(--warn); }
    .m1t-tag.ba { background: var(--violet-soft); color: var(--violet); }
    .m1t-tag.sa { background: var(--info-soft); color: var(--info); }
    .m1t-tag.dev { background: var(--ok-soft); color: var(--ok); }
    .m1t-tag.no { background: var(--surface-3); color: var(--text-2); }
    .m1t-cmp { display: grid; grid-template-columns: minmax(0, 150px) minmax(0, 1fr) minmax(0, 1fr); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; background: var(--surface); }
    .m1t-cmp > div { padding: 8px 10px; border-top: 1px solid var(--border); font-size: 13.5px; min-width: 0; overflow-wrap: anywhere; }
    .m1t-cmp > div:nth-child(-n+3) { border-top: 0; }
    .m1t-cmp .k { font: 600 10.5px/1.4 var(--f-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--text-muted); background: var(--surface-2); }
    .m1t-cmp .h { font: 600 14px/1.3 var(--f-brand); background: var(--surface-2); }
    .m1t-flip { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
    .m1t-flip button { font: inherit; font-size: 14px; text-align: left; color: inherit; border: 1px solid var(--border-strong); background: var(--surface-2); border-radius: 10px; padding: 10px 12px; cursor: pointer; display: grid; gap: 6px; min-width: 0; }
    .m1t-flip button[aria-pressed="true"] { border-color: var(--accent); background: var(--surface); }
    .m1t-flip .a { font-size: 13px; color: var(--text-2); border-top: 1px dashed var(--border-strong); padding-top: 6px; }
    .m1t-deciders { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
    .m1t-dec { padding: 10px 12px; border-radius: 12px; border: 1px solid var(--border); background: var(--surface); display: grid; gap: 4px; align-content: start; min-width: 0; font-size: 13.5px; }
    .m1t-dec .big { font: 700 15px/1.25 var(--f-brand); }
    .m1t-dec.c { grid-column: 1 / -1; border-color: var(--accent); background: var(--accent-soft); }
    .m1t-raci { overflow-x: auto; border: 1px solid var(--border); border-radius: 12px; background: var(--surface); max-width: 100%; }
    .m1t-raci table { border-collapse: collapse; width: 100%; font-size: 13px; }
    .m1t-raci th, .m1t-raci td { border-bottom: 1px solid var(--border); padding: 6px 4px; text-align: center; vertical-align: middle; }
    .m1t-raci th { font-weight: 600; font-size: 12px; color: var(--text-2); line-height: 1.2; }
    .m1t-raci th .sb { display: block; font-weight: 400; color: var(--text-muted); font-size: 10.5px; }
    .m1t-raci .rl { text-align: left; min-width: 150px; line-height: 1.3; padding-left: 10px; }
    .m1t-raci tr:last-child td { border-bottom: 0; }
    .m1t-raci tr.ok td.rl { box-shadow: inset 3px 0 0 var(--ok); }
    .m1t-raci tr.bad td.rl { box-shadow: inset 3px 0 0 var(--bad); }
    .m1t-raci tr.warn td.rl { box-shadow: inset 3px 0 0 var(--warn); }
    .m1t-cell { width: 34px; height: 30px; border-radius: 7px; border: 1px dashed var(--border-strong); background: transparent; font: 700 14px/1 var(--f-mono); color: var(--text-muted); cursor: pointer; padding: 0; }
    .m1t-cell[data-v="R"] { border: 1px solid var(--info); background: var(--info-soft); color: var(--info); }
    .m1t-cell[data-v="A"] { border: 1px solid var(--accent); background: var(--accent-soft); color: var(--accent); }
    .m1t-cell[data-v="C"] { border: 1px solid var(--warn); background: var(--warn-soft); color: var(--warn); }
    .m1t-cell[data-v="I"] { border: 1px solid var(--border-strong); background: var(--surface-3); color: var(--text-2); }
    .m1t-cell:disabled { cursor: default; opacity: 1; }
    .m1t-legend { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; }
    .m1t-legend .card { gap: 3px; font-size: 13px; align-content: start; }
    .m1t-legend .lt { font: 700 20px/1 var(--f-mono); }
    .m1t-chat { display: grid; gap: 8px; padding: 12px; border: 1px solid var(--border); border-radius: 12px; background: var(--surface); }
    .m1t-msg { display: grid; grid-template-columns: 30px minmax(0, 1fr); gap: 8px; text-align: left; font: inherit; color: inherit; background: var(--surface-2); border: 1px solid var(--border); border-radius: 10px; padding: 8px 10px; cursor: pointer; min-width: 0; }
    .m1t-msg[aria-pressed="true"] { border-color: var(--accent); box-shadow: 0 0 0 1px var(--accent); }
    .m1t-msg .who { font-size: 12px; color: var(--text-muted); }
    .m1t-msg .t { font-size: 14px; overflow-wrap: anywhere; }
    .m1t-chans { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 6px; }
    .m1t-chan { padding: 8px 10px; border-radius: 10px; border: 1px solid var(--border); background: var(--surface); font-size: 12.5px; display: grid; gap: 2px; align-content: start; min-width: 0; }
    .m1t-chan b { font-size: 13.5px; }
    .m1t-chan.on { border-color: var(--ok); background: var(--ok-soft); }
    .m1t-day { display: grid; gap: 6px; }
    .m1t-slot { display: grid; grid-template-columns: 52px minmax(0, 1fr) auto; gap: 10px; align-items: center; padding: 8px 10px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface); min-width: 0; }
    .m1t-slot.ok { border-color: var(--ok); background: var(--ok-soft); }
    .m1t-slot.bad { border-color: var(--bad); background: var(--bad-soft); }
    .m1t-slot.warn { border-color: var(--warn); background: var(--warn-soft); }
    .m1t-slot .tm { font: 600 13px/1 var(--f-mono); color: var(--text-muted); }
    .m1t-slot .tx { font-size: 14px; min-width: 0; overflow-wrap: anywhere; }
    .m1t-slot .why { grid-column: 2 / -1; font-size: 13px; color: var(--text-2); }
    .m1t-pick3 { display: inline-flex; gap: 3px; flex-wrap: wrap; }
    .m1t-pick3 button { font: 600 12px/1.1 var(--f-body); border: 1px solid var(--border-strong); background: var(--surface-2); color: var(--text-2); border-radius: 7px; padding: 6px 9px; cursor: pointer; }
    .m1t-pick3 button[aria-pressed="true"][data-v="ba"] { border-color: var(--violet); background: var(--violet-soft); color: var(--violet); }
    .m1t-pick3 button[aria-pressed="true"][data-v="sa"] { border-color: var(--info); background: var(--info-soft); color: var(--info); }
    .m1t-pick3 button[aria-pressed="true"][data-v="no"] { border-color: var(--text-muted); background: var(--surface-3); color: var(--text); }
    .m1t-pick3 button:disabled { cursor: default; }
    .m1t-steps { display: grid; gap: 12px; }
    .m1t-step { border: 1px solid var(--border); border-radius: 12px; background: var(--surface); padding: 12px 14px; display: grid; gap: 10px; min-width: 0; }
    .m1t-step.locked { opacity: .55; }
    .m1t-step > header { display: flex; gap: 10px; align-items: baseline; flex-wrap: wrap; }
    .m1t-step > header .n { font: 600 11px/1 var(--f-mono); letter-spacing: .1em; color: var(--accent); text-transform: uppercase; }
    .m1t-step > header b { font: 600 15px/1.3 var(--f-brand); }
    .m1t-opts { display: grid; gap: 6px; }
    .m1t-opt { display: grid; grid-template-columns: 20px minmax(0, 1fr); gap: 8px; align-items: start; text-align: left; font: inherit; font-size: 14px; color: inherit; background: var(--surface-2); border: 1px solid var(--border); border-radius: 10px; padding: 9px 11px; cursor: pointer; min-width: 0; }
    .m1t-opt .bx { width: 16px; height: 16px; margin-top: 2px; border-radius: 50%; border: 2px solid var(--border-strong); }
    .m1t-opt.multi .bx { border-radius: 4px; }
    .m1t-opt[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); }
    .m1t-opt[aria-pressed="true"] .bx { border-color: var(--accent); background: var(--accent); }
    .m1t-opt:disabled { cursor: default; }
    .m1t-opt:disabled:not([aria-pressed="true"]) { opacity: .55; }
    .m1t-cons { border-left: 3px solid var(--border-strong); padding: 6px 10px; font-size: 13.5px; color: var(--text-2); display: grid; gap: 8px; }
    .m1t-cons.good { border-left-color: var(--ok); }
    .m1t-cons.bad { border-left-color: var(--bad); }
    .m1t-cons.mid { border-left-color: var(--warn); }
    .m1t-stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; }
    .m1t-stats .v { font-size: 17px; }
    .m1t-factlist { display: grid; gap: 6px; }
    .m1t-factlist > div { font-size: 13.5px; padding: 7px 10px; border-radius: 8px; background: var(--surface-2); border: 1px solid var(--border); }
    .m1t-calc { font: 500 13px/1.5 var(--f-mono); padding: 8px 12px; border-radius: 8px; background: var(--code-bg); border: 1px solid var(--border); overflow-x: auto; }
    @media (max-width: 860px) { .m1t-map { grid-template-columns: repeat(2, minmax(0, 1fr)); } .m1t-legend { grid-template-columns: repeat(2, minmax(0, 1fr)); } .m1t-chans { grid-template-columns: repeat(3, minmax(0, 1fr)); } .m1t-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
    @media (max-width: 600px) {
      .m1t-facts, .m1t-flip, .m1t-deciders { grid-template-columns: minmax(0, 1fr); }
      .m1t-dec.c { grid-column: auto; }
      .m1t-cmp { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); }
      .m1t-cmp .k { grid-column: 1 / -1; padding-bottom: 4px; }
      .m1t-cmp > div:nth-child(-n+3) { border-top: 1px solid var(--border); }
      .m1t-cmp > div:first-child { display: none; }
      .m1t-chans { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .m1t-slot { grid-template-columns: 44px minmax(0, 1fr); }
      .m1t-slot .m1t-pick3 { grid-column: 1 / -1; }
      .m1t-raci th, .m1t-raci td { padding: 5px 2px; }
      .m1t-raci .rl { min-width: 112px; font-size: 12.5px; padding-left: 6px; }
      .m1t-raci thead th:not(.rl) { writing-mode: vertical-rl; transform: rotate(180deg); white-space: nowrap; text-align: left; vertical-align: bottom; padding: 6px 2px; }
      .m1t-raci thead th:not(.rl) .sb { display: none; }
      .m1t-cell { width: 28px; height: 28px; font-size: 13px; }
      .m1t-role { grid-template-columns: minmax(0, 1fr); font-size: 13px; padding: 6px 7px; }
      .m1t-role .ic { display: none; }
      .m1t-zone { padding: 8px; }
    }
    @media (max-width: 420px) { .m1t-map { grid-template-columns: minmax(0, 1fr); } }
  </style>`);

  // ---------- общие помощники ----------
  const L = (id, t, sub) => ({ id, t, sub });
  const quizRef = cfg => cfg.options.map((o, i) => o.ok ? i : -1).filter(i => i >= 0);
  const talk = lines => `<div class="talk">${lines.map(x => x.who === 'sys' ? ui.note(x.k || '', x.title || '', x.html) : ui.say(x.who, x.html)).join('')}</div>`;
  const anNote = html => `<div style="margin-top:12px">${ui.note('info', 'Позиция аналитика', html)}</div>`;
  const interview = (q, a) => ui.note('', 'Как об этом спрашивают на собеседовании', `<b>«${q}»</b><br>${a}`);
  const mark = s => s === 'ok' ? '✓' : s === 'warn' ? '≈' : '✗';

  // =====================================================================
  // Теория 1. Карта команды «Искра Онлайн»
  // =====================================================================
  const ZONES = [
    { id: 'biz', t: 'Заказчик · «Искра»' },
    { id: 'mgmt', t: 'Управление и анализ · «Орбита»' },
    { id: 'make', t: 'Дизайн и разработка · «Орбита»' },
    { id: 'run', t: 'Качество и эксплуатация' }
  ];
  const QS = [
    { id: 'what', t: 'Что и зачем делаем?', note: 'Что нужно бизнесу и в каком порядке, решает <b>владелец продукта</b> — у нас Тимур Рашидович. Эксперты станций рассказывают, как всё устроено на самом деле. Аналитики не решают за них, а превращают «хочу» в понятные варианты с ценой — и записывают, что решили.' },
    { id: 'how', t: 'Как это сделать?', note: '«Как» — зона команды: архитектуру выбирает Глеб, интерфейс — Ника, код пишут разработчики. Системный аналитик описывает <b>поведение</b> системы — что она делает, при каких правилах, с какими данными, — но не диктует технологию.' },
    { id: 'when', t: 'Когда и за сколько?', note: 'Сроки, бюджет, риски и договор держит <b>руководитель проекта</b> Артём. Он опирается на оценки команды, а выбор «урезать объём или сдвинуть дату» делает вместе с владельцем продукта.' },
    { id: 'ok', t: 'Работает ли как надо?', note: 'Проверяет <b>тестировщица</b> Лиза — по критериям приёмки, которые аналитик пишет вместе с ней. Финальное «да, это то, что нужно» на демо говорит владелец продукта.' },
    { id: 'live', t: 'Как живёт после запуска?', note: 'Выкатку, серверы, мониторинг и резервные копии держит <b>DevOps</b>. Обращения мастеров и клиентов принимает <b>поддержка</b>. Им нужны от аналитика окна обслуживания, требования к доступности, памятки и известные ограничения.' }
  ];
  const ROLES = [
    {
      id: 'owner', z: 'biz', ico: '👑', t: 'Владелец продукта', en: 'Product Owner, заказчик', q: { what: 'main', when: 'help', ok: 'main' },
      here: 'Тимур Рашидович. Платит, решает, что войдёт в MVP к 15 марта, и принимает результат на демо.',
      big: 'Отдельный сотрудник от бизнеса, иногда один на несколько команд; спонсор проекта может быть выше него.',
      does: 'Решает, что важнее и зачем. Держит цель продукта и порядок в бэклоге, принимает результат.',
      out: 'Приоритеты, решения «берём / не берём», «да» на демо, подпись под объёмом работ',
      needs: 'Варианты с ценой и последствиями на языке денег и сроков, ясные вопросы, итоги встреч письменно',
      hurts: 'Жаргон, таблицы и API, «а как вы хотите?» без вариантов',
      bad: [{ who: 'me', html: 'Тимур Рашидович, какой тип данных у поля «статус записи» — строка или перечисление?' }, { who: 'timur', html: 'Я машины чиню, а не базы. Вы мне скажите, сколько это стоит и когда будет.' }],
      good: [{ who: 'me', html: 'Есть два варианта напоминаний. Только push — бесплатно, но часть клиентов уведомления отключает. Push и SMS — около 3 ₽ за сообщение, зато доходит до всех. Неявки сейчас 17 %, цель — 8 %. Какой вариант берём в MVP?' }, { who: 'timur', html: 'Пост простаивает дороже, чем три рубля. Берём оба. Пришлите итог письмом — Марине покажу.' }]
    },
    {
      id: 'expert', z: 'biz', ico: '🔧', t: 'Эксперты предметной области', en: 'ключевые пользователи', q: { what: 'help', ok: 'help' },
      here: 'Марина Олеговна (приёмка), Сергей Петрович (цех), Ольга Викторовна (бухгалтерия, законы), Алия (склад, 1С).',
      big: 'Ключевые пользователи от каждого подразделения; их время выделяют приказом на проект.',
      does: 'Знают, как всё работает на самом деле: правила, исключения, законы, «как мы делаем, когда…».',
      out: 'Правила и исключения (BR-1…BR-16), примеры документов, отзывы на макеты и демо',
      needs: 'Конкретные вопросы про их работу, уважение ко времени, показ результата на понятных примерах',
      hurts: 'Вопросы «а вам нужно приложение?», расспросы по второму кругу, ответы, которые потом никто не учёл',
      bad: [{ who: 'me', html: 'Марина Олеговна, а вам вообще удобно будет в приложении?' }, { who: 'marina', html: 'Мне удобно, когда клиент приезжает вовремя. Приложения ваши — дело десятое. У меня очередь у стойки.' }],
      good: [{ who: 'me', html: 'Марина Олеговна, вопрос про исключение: клиент опоздал на 10 минут. Пост ещё держим или ставим следующего? А если опоздал на 20?' }, { who: 'marina', html: 'Пятнадцать минут ждём, потом — неявка, ставлю следующего. Это у нас железно. Запишите, а то потом программа будет ждать до вечера.' }]
    },
    {
      id: 'pm', z: 'mgmt', ico: '📅', t: 'Руководитель проекта', en: 'Project Manager', q: { when: 'main' },
      here: 'Артём. Отвечает перед «Искрой» за MVP к 15 марта, бюджет и договор.',
      big: 'Руководитель проекта или программы проектов; на больших проектах ему помогают администраторы.',
      does: 'Планирует, кто что и когда делает, следит за сроками, бюджетом и рисками, держит заказчика в курсе.',
      out: 'План и график, оценка, отчёты о статусе, договор и дополнительные соглашения',
      needs: 'Оценимый объём, риски в требованиях, влияние каждого изменения на срок и деньги',
      hurts: '«Ещё одна маленькая хотелка», которую пообещали заказчику без анализа влияния',
      bad: [{ who: 'me', html: 'Тимур Рашидович ещё хочет шиномонтаж с хранением шин. Я сказал, что сделаем, там немного.' }, { who: 'artem', html: 'Стоп. Хранение шин — это склад, ячейки, сезонные напоминания. Это недели, а не «немного». Что вы пообещали и от чьего имени?' }],
      good: [{ who: 'me', html: 'Тимур Рашидович просит шиномонтаж с хранением. Затронуто: запись (новые услуги и слоты по часу), склад шин, напоминания. Глеб прикинул — плюс две-три недели. Варианты: после MVP или вместо онлайн-оплаты.' }, { who: 'artem', html: 'Вот с этим идём к Тимуру. Подготовлю ему два сценария по срокам.' }]
    },
    {
      id: 'ba', z: 'mgmt', ico: '🗺️', t: 'Бизнес-аналитик', en: 'Business Analyst', q: { what: 'help' },
      here: 'Отдельного нет: бизнес-анализ на проекте делаете вы с Верой — процессы станции, цели, проблемы.',
      big: 'Часто отдельный человек на стороне заказчика или в консалтинге; работает до и вокруг ИТ-проекта.',
      does: 'Изучает бизнес: процессы «как есть» и «как будет», проблемы, цели, заинтересованных лиц. Отвечает на вопрос «что и зачем нужно бизнесу».',
      out: 'Цели и бизнес-требования, модели процессов, карта заинтересованных лиц',
      needs: 'Доступ к людям бизнеса и данным: отчёты АТС, Excel, статистика неявок',
      hurts: 'Сразу экраны и таблицы без понимания, какую проблему решаем',
      bad: [{ who: 'me', html: 'Процессы станции мне не нужны, давайте сразу нарисую экран записи.' }, { who: 'vera', html: 'А кто записывает — клиент, оператор, мастер? Что бывает с теми, кто не приехал? Без процесса экран — гадание, и мы нарисуем то, что Марина не примет.' }],
      good: [{ who: 'me', html: 'По отчёту АТС в пик теряется 21 % звонков, а неявок 17 %. Значит, две разные проблемы: до записи и после. Цели — 5 % и 8 %.' }, { who: 'vera', html: 'Отлично — теперь каждую функцию можно проверить вопросом: какую из двух цифр она двигает?' }]
    },
    {
      id: 'sa', z: 'mgmt', ico: '🧭', t: 'Системный аналитик', en: 'System Analyst', q: { what: 'help', how: 'help', ok: 'help', live: 'help' },
      here: 'Вера (ведущий) и вы (младший). В «Орбите» один человек совмещает бизнес- и системный анализ.',
      big: 'Несколько аналитиков, у каждого своя часть системы: запись, оплата, интеграции.',
      does: 'Переводит потребности бизнеса в требования к системе: сценарии, правила, данные, интеграции, критерии приёмки. Отвечает команде на вопросы и ведёт задачу до приёмки.',
      out: 'Требования и спецификации, сценарии, статусные модели, модель данных, описание API, критерии приёмки',
      needs: 'Это вы. От остальных вам нужны ответы, решения и обратная связь',
      hurts: '—',
      bad: [{ who: 'vera', html: 'Посмотрите на соседние роли: у каждой свой список того, что она ждёт от аналитика. Если кто-то в команде додумывает за бизнес сам — значит, мы ему чего-то не дали.' }],
      good: [{ who: 'vera', html: 'Наша работа — чтобы никто не додумывал за бизнес. Тимуру — варианты с ценой, Артёму — влияние на срок, Нике — сценарии и состояния, Глебу — правила и цифры, Лизе — проверяемые критерии.' }]
    },
    {
      id: 'arch', z: 'make', ico: '🏗️', t: 'Архитектор и тимлид', en: 'Architect, Team Lead', q: { how: 'main', when: 'help' },
      here: 'Глеб: ведёт разработчиков, решает, как устроена система, и сам пишет бэкенд.',
      big: 'Архитектор — отдельный человек на несколько команд, у каждой команды свой тимлид.',
      does: 'Решает, из чего состоит система и на чём её делать, оценивает работу, распределяет задачи, проверяет код.',
      out: 'Архитектура, выбор технологий, оценки, ревью кода',
      needs: 'Функциональные требования и нефункциональные — в цифрах: нагрузка, объёмы, интеграции, ограничения закона',
      hurts: 'Готовое техническое решение вместо требования: «сделайте на микросервисах»',
      bad: [{ who: 'me', html: 'Глеб, запись надо сделать на микросервисах и с очередью — я читал, что так надёжнее.' }, { who: 'gleb', html: 'А сколько записей в день? Сколько человек одновременно? Что будет, если 1С недоступна? Дай цифры — решение подберу я.' }],
      good: [{ who: 'me', html: 'Обычный день — 600 записей, сезон — до 3 000. В понедельник в 09:00 — до 1 500 человек одновременно, поиск слотов не дольше секунды. Остатки из 1С — каждые 15 минут.' }, { who: 'gleb', html: 'Вот это разговор. Понедельник в девять — главный риск, под него и спроектирую. Оценку дам к пятнице.' }]
    },
    {
      id: 'ux', z: 'make', ico: '🎨', t: 'Дизайнер интерфейсов', en: 'UX/UI-дизайнер', q: { how: 'main' },
      here: 'Ника: приложение клиента, АРМ мастера, планшет механика. Макеты — в Figma.',
      big: 'Отдел дизайна: исследователи пользователей, дизайнеры интерфейсов, редакторы текстов.',
      does: 'Придумывает, как человек будет пользоваться системой: пути, экраны, кнопки, тексты, все состояния.',
      out: 'Пользовательские пути, макеты и прототипы в Figma',
      needs: 'Сценарии, роли, данные на экране, правила и все состояния: пусто, загрузка, ошибка, нет сети',
      hurts: '«Нарисуй кнопку» без сценария и без крайних случаев',
      bad: [{ who: 'me', html: 'Ника, нарисуй экран выбора времени: сетка слотов и кнопка «Записаться».' }, { who: 'nika', html: 'А если на день нет свободных слотов? А если клиент с двумя неявками и нужна предоплата? Цена показывается? Я нарисую только «всё хорошо», а остальное будет сюрпризом.' }],
      good: [{ who: 'me', html: 'Сценарий: клиент выбирает услуги и время. Слоты по 30 минут, не раньше чем через 2 часа и не дальше 30 дней. Цена «от». Состояния: слотов нет — предложить другой день; две неявки — предоплата 500 ₽; нет сети.' }, { who: 'nika', html: 'По такому можно рисовать. Завтра скину прототип — посмотрим вместе с Мариной Олеговной?' }]
    },
    {
      id: 'front', z: 'make', ico: '🖥️', t: 'Фронтенд-разработчик', en: 'Frontend', q: { how: 'main' },
      here: 'Тимофей: веб — АРМ мастера-приёмщика, планшет механика, онлайн-запись на сайте.',
      big: 'Отдельная группа разработчиков веб-интерфейсов.',
      does: 'Делает то, что человек видит и нажимает в браузере: экраны, формы, проверки полей, сообщения об ошибках.',
      out: 'Код веб-интерфейсов',
      needs: 'Однозначные описания экранов: поля, правила проверки, тексты ошибок, состояния, откуда берутся данные',
      hurts: '«Какое-нибудь поле для телефона» — без формата и проверки',
      bad: [{ who: 'sys', k: 'bad', title: 'В задаче', html: '«Поле телефона клиента». Тимофей спрашивает в чате: а формат? +7 или 8? Что, если такой телефон уже есть в базе? Ответа нет два дня — делает как придумал.' }],
      good: [{ who: 'sys', k: 'ok', title: 'В задаче', html: '«Телефон: маска +7 (XXX) XXX-XX-XX, обязательно. Вводят с 8 — заменяем на +7. Если клиент с таким телефоном есть — подставляем его данные». Тимофей делает за день, Лиза проверяет по тем же строкам.' }]
    },
    {
      id: 'back', z: 'make', ico: '⚙️', t: 'Бэкенд-разработчик', en: 'Backend', q: { how: 'main' },
      here: 'Глеб и команда: сервисы записи, заказ-нарядов, уведомлений, платежей, интеграции с 1С и ЮKassa.',
      big: 'Отдельные команды на разные части серверной логики.',
      does: 'Делает «кухню», которую клиент не видит: правила, расчёты, хранение данных, обмен с другими системами.',
      out: 'Серверная часть, API, база данных, интеграции',
      needs: 'Правила с границами и крайними случаями, статусы и переходы, ответы на вопросы в течение дня',
      hurts: 'Правила, которые живут только в голове у Марины Олеговны; ответы через неделю',
      bad: [{ who: 'gleb', html: 'В понедельник спросили: если клиент отменяет ровно за 3 часа — это бесплатно или уже нет? Ответа нет до сих пор. Сделали «бесплатно». Надеемся, угадали.' }],
      good: [{ who: 'me', html: 'Уточнил у Марины Олеговны: «не позднее чем за 3 часа» — значит, ровно за 3:00 ещё бесплатно, за 2:59 уже нет. Дописал в BR-3 и в критерии приёмки.' }, { who: 'gleb', html: 'Через час после вопроса — то, что надо. Лиза уже видит границу.' }]
    },
    {
      id: 'mobile', z: 'make', ico: '📱', t: 'Мобильный разработчик', en: 'iOS, Android', q: { how: 'main' },
      here: 'Даша: приложение клиента для iOS и Android — запись, статус ремонта, согласование доп. работ, оплата.',
      big: 'Отдельные люди или команды на iOS и Android.',
      does: 'Делает приложение для телефона: экраны, push-уведомления, работу при плохой связи, обновления в магазинах приложений.',
      out: 'Приложения в App Store, Google Play и RuStore',
      needs: 'Сценарии с особенностями телефона: нет сети, отключены уведомления, старая версия приложения',
      hurts: '«Как на сайте» — без особенностей телефона',
      bad: [{ who: 'dasha', html: 'В требованиях: «клиент получает push о доп. работах». А если уведомления выключены? А если приложение старой версии и не знает про новый статус? Я узнаю об этом от Лизы за день до релиза.' }],
      good: [{ who: 'dasha', html: 'Есть раздел «Если push не дошёл»: через 20 минут без ответа мастер звонит (BR-8), а в приложении предложение висит на главном экране. Оценила без сюрпризов.' }]
    },
    {
      id: 'qa', z: 'run', ico: '🧪', t: 'Тестировщица', en: 'QA, Quality Assurance', q: { ok: 'main' },
      here: 'Лиза. Читает требования ещё до разработки и спрашивает: «как я это проверю?»',
      big: 'Отдел тестирования: ручные тестировщики и автоматизаторы, нагрузочное тестирование.',
      does: 'Проверяет, что сделано то, что нужно, и ничего не сломалось. Ищет, где система ведёт себя не так, как обещано.',
      out: 'Тест-кейсы и чек-листы, баг-репорты, отчёт о тестировании',
      needs: 'Проверяемые требования: числа, границы, ожидаемый результат, критерии приёмки',
      hurts: '«Быстро», «удобно», «и т. д.» — проверить невозможно',
      bad: [{ who: 'me', html: 'Поиск свободных слотов должен работать быстро и удобно.' }, { who: 'liza', html: 'Быстро — это сколько? Для скольких человек сразу? Я могу проверить «одна секунда при 1 500 пользователях», а «быстро» — нет.' }],
      good: [{ who: 'me', html: 'Поиск слотов — не дольше 1 секунды для 95 % запросов при 1 500 одновременных пользователях.' }, { who: 'liza', html: 'Проверю нагрузочным тестом, понедельник 09:00 смоделирую. А что видит клиент, если ответ дольше? Допишем?' }]
    },
    {
      id: 'devops', z: 'run', ico: '🛠️', t: 'DevOps-инженер', en: 'DevOps', q: { live: 'main' },
      here: 'Денис — один на три проекта «Орбиты»: серверы в России, выкатка, мониторинг, резервные копии.',
      big: 'Команда эксплуатации и платформы: дежурства, автоматическая выкатка, наблюдение за системой.',
      does: 'Следит, чтобы система была развёрнута и работала: серверы, выкатка новых версий, мониторинг, резервные копии.',
      out: 'Настроенные окружения, автоматическая выкатка, мониторинг и оповещения',
      needs: 'Требования к доступности, окна обслуживания, где по закону хранить данные (152-ФЗ — в России)',
      hurts: '«Система работает всегда» — тогда когда её обновлять?',
      bad: [{ who: 'sys', k: 'bad', title: 'В требованиях', html: '«Система доступна всегда, без перерывов». Денис спрашивает: станции работают с 08:00 до 21:00 без выходных — а обновлять когда? Ночью? Сколько простоя в месяц допустимо?' }],
      good: [{ who: 'sys', k: 'ok', title: 'В требованиях', html: '«Доступность записи — 99,5 % в часы работы станций (≈ 3,6 ч простоя в месяц). Обновления — с 22:00 до 07:00». По этому Денис планирует выкатки и дежурства.' }]
    },
    {
      id: 'tw', z: 'run', ico: '📘', t: 'Технический писатель', en: 'Technical Writer', q: { live: 'help' },
      here: 'Отдельного нет: памятки для мастеров и механиков пишете вы с Лизой, справку в приложении — с Никой.',
      big: 'Отдельная роль: руководства пользователя, справка, описание API для внешних разработчиков.',
      does: 'Пишет документацию для пользователей и для других разработчиков: инструкции, справку, описание API.',
      out: 'Руководства, справка, памятки, описание API',
      needs: 'Сценарии, роли, известные ограничения, актуальные требования',
      hurts: 'Требования в десяти чатах вместо одной актуальной страницы',
      bad: [{ who: 'sys', k: 'bad', title: 'Памятка механику', html: '«Нажмите кнопку и сделайте фото». Какую кнопку? Сколько фото? Что, если в цехе нет сети? Сергей Петрович отправляет памятку обратно.' }],
      good: [{ who: 'sys', k: 'ok', title: 'Памятка механику', html: '«Нашли проблему — „Добавить находку“, 1–3 фото с телефона, коротко что не так. Нет сети — фото уйдут сами, когда сеть появится». Одна страница крупным шрифтом.' }]
    },
    {
      id: 'support', z: 'run', ico: '🎧', t: 'Поддержка', en: 'Support', q: { live: 'main' },
      here: 'После запуска: первая линия — операторы колл-центра «Искры», вторая — «Орбита».',
      big: 'Первая линия отвечает пользователям, вторая разбирает сложные случаи, третья — разработчики.',
      does: 'Принимает обращения: «не работает», «как сделать», «нашёл ошибку». Решает сам или передаёт команде.',
      out: 'Ответы пользователям, заявки на исправление, база известных проблем',
      needs: 'Инструкции, известные ограничения, как ведёт себя система в крайних случаях',
      hurts: 'Ограничения, о которых знает только аналитик',
      bad: [{ who: 'sys', k: 'bad', title: 'Обращение', html: 'Клиент: «Не могу записаться на сегодня на 18:00, а слот свободен!» Оператор не знает про правило «не позже чем за 2 часа» (BR-2), заводит срочную ошибку, Глеба срывают с задачи.' }],
      good: [{ who: 'sys', k: 'ok', title: 'Обращение', html: 'В базе ответов поддержки: «Онлайн-запись — не позже чем за 2 часа. Ближе — только по телефону станции». Оператор отвечает клиенту за минуту.' }]
    }
  ];

  const howRoles = {
    id: 'how-roles', covers: ['t-whom'], title: 'Как это работает: карта команды «Искра Онлайн»', free: true, noReset: true,
    simple: {
      icon: '🧩',
      plain: 'Систему делает не один программист, а команда. У каждого своя часть работы и свой главный вопрос — и каждому от аналитика нужно своё.',
      analogy: 'Ремонт машины на станции. Клиент решает, что чинить и сколько готов заплатить. Мастер-приёмщик переводит «что-то стучит» в заказ-наряд с понятными работами. Механики чинят, мастер цеха решает, как именно. Контролёр проверяет перед выдачей, бухгалтерия выписывает чек. Если заказ-наряд записан плохо, механики чинят не то — хотя каждый работал честно. Мастер-приёмщик здесь — аналитик.',
      tech: 'Типичные роли: владелец продукта (Product Owner), эксперты предметной области, руководитель проекта (Project Manager), бизнес- и системный аналитики, архитектор и тимлид, дизайнер (UX/UI), разработчики (фронтенд, бэкенд, мобильные), тестировщик (QA), DevOps, технический писатель, поддержка. <b>Роль — не должность</b>: в небольшой команде один человек держит две-три роли (Глеб — и архитектор, и тимлид, и бэкенд). В Scrum Guide 2020 зон ответственности три — владелец продукта, Scrum-мастер и разработчики; аналитик входит в разработчиков.'
    },
    lead: ui.brief({
      situation: 'Первая неделя проекта «Искра Онлайн». Вера: «Прежде чем писать требования, узнайте команду в лицо: кто что решает и к кому с каким вопросом идти». Четырнадцать ролей разложены по четырём зонам — от заказчика до поддержки.',
      todo: [
        'Нажимайте вопросы вверху: «Что и зачем?», «Как?», «Когда и за сколько?»… Подсветятся роли, которые на него отвечают: оранжевый — решает, синий — участвует.',
        'Нажимайте на роли. Читайте карточку: чем занят человек, что выдаёт, что ждёт от аналитика и чем ему мешает плохой аналитик.',
        'Переключатель «Аналитик принёс»: сравните, что слышит роль от плохого и от хорошего аналитика. Переключатель «Где»: как роль выглядит в «Орбите» и в большой компании.'
      ],
      look: 'Точка справа у роли — вы её уже открыли. Названия и границы ролей в компаниях разные: здесь так, как устроено на нашем проекте.'
    }),
    render(el) {
      el.classList.add('m1t-root');
      const st = { sel: 'owner', q: 'what', mode: 'bad', lens: 'here', seen: new Set(['owner']) };
      el.innerHTML = `<div class="stack">
        <div class="stack tight"><span class="eyebrow">Кто отвечает на вопрос</span><div class="m1t-qbar" data-qbar></div></div>
        <div data-qnote></div>
        <div class="row"><span class="small dim">Где:</span>${ui.seg('lens', [{ v: 'here', t: 'на проекте «Искра Онлайн»' }, { v: 'big', t: 'в большой компании' }], st.lens)}<span class="small dim" data-cnt></span></div>
        <div class="m1t-map" data-map></div>
        <div data-detail></div>
        ${interview('Кто входит в команду разработки и чем аналитик отличается от остальных?', 'Хороший ответ — не список должностей, а вопросы: кто решает «что и зачем» (владелец продукта), кто — «как» (архитектор, дизайнер, разработчики), кто — «когда и за сколько» (руководитель проекта), кто проверяет (QA) и кто держит систему после запуска (DevOps, поддержка). Аналитик — тот, кто связывает эти вопросы: переводит потребности бизнеса в требования, понятные каждому в команде.')}
      </div>`;
      function drawQ() {
        TR.$('[data-qbar]', el).innerHTML = QS.map(q => `<button type="button" data-q="${q.id}" aria-pressed="${st.q === q.id}">${esc(q.t)}</button>`).join('') + `<button type="button" data-q="" aria-pressed="${!st.q}">все роли</button>`;
        const q = QS.find(x => x.id === st.q);
        TR.$('[data-qnote]', el).innerHTML = q ? ui.note('', q.t, q.note) : '';
      }
      function drawMap() {
        TR.$('[data-map]', el).innerHTML = ZONES.map(z => `<div class="m1t-zone"><div class="eyebrow">${esc(z.t)}</div>${ROLES.filter(r => r.z === z.id).map(r => {
          const lv = st.q ? (r.q[st.q] || 'dim') : '';
          return `<button type="button" class="m1t-role ${lv}" data-role="${r.id}" aria-pressed="${st.sel === r.id}"><span class="ic" aria-hidden="true">${r.ico}</span><span class="nm">${esc(r.t)}${st.seen.has(r.id) ? '<span class="seen" title="Уже открыта">•</span>' : ''}<small>${esc(r.en)}</small>${lv === 'main' ? '<span class="bd">решает</span>' : lv === 'help' ? '<span class="bd">участвует</span>' : ''}</span></button>`;
        }).join('')}</div>`).join('');
        TR.$('[data-cnt]', el).textContent = `Открыто ролей: ${st.seen.size} из ${ROLES.length}`;
      }
      function drawDetail() {
        const r = ROLES.find(x => x.id === st.sel), z = ZONES.find(x => x.id === r.z);
        TR.$('[data-detail]', el).innerHTML = `<div class="card">
          <div><div class="eyebrow">${esc(z.t)}</div><h3 class="m1t-h3">${r.ico} ${esc(r.t)} <span class="small dim" style="font-weight:400">· ${esc(r.en)}</span></h3></div>
          <div class="small"><b>${st.lens === 'here' ? 'На проекте' : 'В большой компании'}:</b> ${r[st.lens]}</div>
          <div class="m1t-facts">
            <div class="m1t-fact"><b>Чем занят</b>${r.does}</div>
            <div class="m1t-fact"><b>Что выдаёт</b>${r.out}</div>
            <div class="m1t-fact need"><b>Что ждёт от аналитика</b>${r.needs}</div>
            <div class="m1t-fact hurt"><b>Чем мешает плохой аналитик</b>${r.hurts}</div>
          </div>
          <div class="row"><span class="small dim">Аналитик принёс:</span>${ui.seg('mode', [{ v: 'bad', t: 'плохо' }, { v: 'good', t: 'хорошо' }], st.mode, 'accent')}</div>
          ${talk(r[st.mode])}
        </div>`;
      }
      TR.on(el, 'click', '[data-q]', (e, b) => { st.q = b.dataset.q; drawQ(); drawMap(); });
      TR.on(el, 'click', '[data-role]', (e, b) => { st.sel = b.dataset.role; st.seen.add(st.sel); drawMap(); drawDetail(); });
      ui.onSeg(el, (n, v) => { if (n === 'mode' || n === 'lens') { st[n] = v; drawDetail(); } });
      drawQ(); drawMap(); drawDetail();
      el.insertAdjacentHTML('beforeend', anNote('К аналитику приходят с вопросами все — от Тимура Рашидовича до Лизы. Он не решает за них, а приносит каждому то, без чего тот будет додумывать за бизнес. Поэтому первое, что делает новичок на проекте, — узнаёт, кто что решает, к кому с каким вопросом идти и кому какой артефакт нужен.'));
    }
  };

  // =====================================================================
  // Теория 2. Бизнес- и системный аналитик: перевод от слов заказчика до задачи
  // =====================================================================
  const TRANS = {
    status: {
      t: '«Как в такси»',
      layers: [
        { who: 'biz', tag: 'Заказчик', h: 'Хотелка', tx: 'Тимур Рашидович: <b>«Хочу, чтобы как в такси: клиент видит, где его машина»</b>. Это идея решения, а не требование: непонятно, какую проблему она решает.' },
        { who: 'ba', tag: 'Бизнес-аналитик', h: 'Проблема', tx: 'Спрашиваем «зачем?» и смотрим на станцию. Клиент сдаёт машину и не знает, что с ней: <b>звонит сам 2–3 раза за визит</b>, мастера отвлекаются от приёмки. В такси Тимуру нравится не карта, а то, что <b>не надо звонить и гадать</b>.' },
        { who: 'ba', tag: 'Бизнес-аналитик', h: 'Цель и бизнес-требование', tx: '«Клиент узнаёт о ходе ремонта и о готовности, не звоня на станцию». Измеримо: <b>звонков о статусе — вдвое меньше</b> к лету. Решение «карта с машиной» отброшено — машина стоит на подъёмнике, двигаться ей некуда.' },
        { who: 'sa', tag: 'Системный аналитик', h: 'Требования к системе', tx: 'Заказ-наряд проходит статусы <b>«Открыт» → «В работе» ⇄ «Ждёт согласования» → «Готов» → «Выдан»</b>. Смена статуса видна в приложении; push — не позже 1 минуты. При «Готов» — push и SMS (BR-13), в сообщении — до какого времени хранение бесплатно.' },
        { who: 'sa', tag: 'Системный аналитик', h: 'Детали для команды', tx: 'Глебу: поле <code>work_order.status</code> со значениями <code>open → in_progress ⇄ waiting_approval → ready → closed</code>, событие «статус изменился» уходит в сервис уведомлений. Даше: экран «Мой ремонт». Лизе — критерий: <b>«Дано</b> заказ-наряд „В работе“; <b>когда</b> мастер ставит „Готов“; <b>тогда</b> клиент получает push и SMS не позже чем через 1 минуту»' },
        { who: 'dev', tag: 'Команда', h: 'Как сделать', tx: 'Дальше решает команда: Глеб — как отправлять уведомления и что делать, если SMS-шлюз не ответил; Ника — как выглядит экран; Даша — как обновлять статус без перезапуска приложения.' }
      ],
      raw: 'Без перевода: Даша рисует карту с точкой «ваша машина», Глеб спрашивает, где взять GPS-трекер для подъёмника. Две недели работы — а клиент всё так же звонит узнать, готово ли.'
    },
    noshow: {
      t: '«Пусть платят штраф»',
      layers: [
        { who: 'biz', tag: 'Заказчик', h: 'Хотелка', tx: 'Тимур Рашидович: <b>«Клиенты записываются и не приезжают. Пусть платят штраф — тысячу рублей!»</b>' },
        { who: 'ba', tag: 'Бизнес-аналитик', h: 'Проблема', tx: '<b>17 % неявок</b>: пост простаивает. Почему не приезжают? Записались за неделю и забыли; по телефону отменить неудобно — дозвониться в пик трудно. Штраф ударит и по честным клиентам, которые просто забыли.' },
        { who: 'ba', tag: 'Бизнес-аналитик', h: 'Цель и бизнес-требование', tx: '<b>Неявки — с 17 % до 8 %</b> к сезону. Варианты: напоминания, простая отмена в приложении, предоплата — только для тех, кто не приезжает регулярно. Это решение согласуем с Тимуром и Мариной: правило BR-4.' },
        { who: 'sa', tag: 'Системный аналитик', h: 'Требования к системе', tx: 'Напоминание за сутки и за 2 часа. Отмена в приложении бесплатно — не позднее чем за 3 часа (BR-3). Не приехал в течение 15 минут — «Неявка», пост освобождается. <b>После 2 неявок подряд</b> онлайн-запись только с предоплатой 500 ₽, которая засчитывается в оплату (BR-4).' },
        { who: 'sa', tag: 'Системный аналитик', h: 'Детали для команды', tx: 'Глебу: <code>booking.status = no_show</code>, счётчик <code>client.no_show_count</code> +1 и сброс при визите; при значении ≥ 2 запись создаётся в статусе <code>new</code> «Ждёт предоплаты». Ольге Викторовне — чек на предоплату через онлайн-кассу. Лизе — критерий: «Дано клиент с двумя неявками подряд; когда записывается онлайн; тогда видит предоплату 500 ₽ и запись „Ждёт предоплаты“».' },
        { who: 'dev', tag: 'Команда', h: 'Как сделать', tx: 'Команда решает, как отправлять напоминания по расписанию, как провести предоплату через ЮKassa и что делать, если клиент не оплатил за отведённое время.' }
      ],
      raw: 'Без перевода: Глеб делает «штраф 1 000 ₽ за неявку — списать с привязанной карты». Ольга Викторовна на приёмке: списывать деньги без согласия клиента нельзя, а платёж без чека — нарушение 54-ФЗ. Переделка, и неявок меньше не стало.'
    }
  };
  const CMP = [
    ['Главный вопрос', 'Что нужно бизнесу и зачем?', 'Что должна делать система, чтобы это получилось?'],
    ['Смотрит на', 'Процессы, цели, проблемы, людей и деньги', 'Сценарии, правила, данные, интеграции, ошибки'],
    ['Говорит с', 'Владельцем, экспертами, пользователями', 'С ними же — и с разработчиками, дизайнером, QA'],
    ['Артефакты', 'Цели, бизнес-требования, процессы «как есть / как будет» (BPMN), карта заинтересованных лиц', 'Пользовательские истории и сценарии, статусные модели, ERD, описание API, критерии приёмки'],
    ['На «Искре»', '«Теряем 21 % звонков в пик — цель 5 %»', '«Слоты по 30 минут, запись не позже чем за 2 часа; если слот заняли — ответ 409, показать другие слоты»']
  ];
  const DECIDE = [
    { q: 'Войдут ли бонусы в MVP к 15 марта?', a: '<b>Тимур Рашидович</b> как владелец продукта. Аналитик готовит варианты, Артём — влияние на срок.' },
    { q: 'PostgreSQL или другая база данных?', a: '<b>Глеб</b> как архитектор — по требованиям в цифрах: объёмы, нагрузка, хранение в России.' },
    { q: 'Сдвинуть релиз на неделю или урезать объём?', a: '<b>Артём</b> готовит сценарии и предлагает, выбирает <b>Тимур Рашидович</b>.' },
    { q: 'Отменять ровно за 3:00 — бесплатно или платно?', a: 'Правило — за <b>бизнесом</b> (Марина Олеговна, Тимур Рашидович). Аналитик задаёт вопрос, фиксирует ответ в BR-3 и раздаёт команде.' },
    { q: 'Как назвать на экране статус «waiting_approval»?', a: '<b>Ника</b> предлагает, аналитик сверяет с языком станции, <b>Марина Олеговна</b> подтверждает, что мастерам понятно.' },
    { q: 'Что будет, если 1С недоступна при записи?', a: 'Поведение для пользователя — <b>требование</b> (аналитик выясняет у бизнеса, что допустимо); как это сделать технически — <b>Глеб</b>.' }
  ];
  const howBaSa = {
    id: 'how-basa', covers: ['t-day', 't-explain'], title: 'Как это работает: бизнес-аналитик, системный аналитик и кто что решает', free: true, noReset: true,
    simple: {
      icon: '🔁',
      plain: 'Бизнес говорит на языке проблем и денег, разработчики — на языке статусов, полей и ошибок. Аналитик переводит: сначала выясняет, что на самом деле нужно бизнесу, потом описывает, что должна делать система.',
      analogy: 'Клиент на станции говорит: «Сделайте, чтобы не стучало». Мастер-приёмщик расспрашивает: где стучит, когда, после чего — это бизнес-анализ. Потом пишет заказ-наряд: «диагностика ходовой, замена стойки стабилизатора, нормо-часы, запчасть» — это системный анализ. Как именно откручивать гайки, решает механик.',
      tech: '<b>Бизнес-аналитик</b> (BABOK, IIBA) работает с потребностями: цели, проблемы, процессы, заинтересованные лица, бизнес-требования. <b>Системный аналитик</b> переводит их в требования к системе: функциональные и нефункциональные, сценарии, данные, интерфейсы (уровни требований — по Вигерсу, «Разработка требований к программному обеспечению»). Граница размыта: во многих компаниях, как в «Орбите», это один человек. Главное — понимать, в какой «шляпе» вы сейчас. <b>Кто решает</b>: «что и зачем» — бизнес и владелец продукта, «как» — команда, «когда и за сколько» — руководитель проекта вместе с владельцем.'
    },
    lead: ui.brief({
      situation: 'Два примера с кик-оффа: Тимур Рашидович хочет «как в такси» и «штраф за неявку». Посмотрите, как хотелка проходит через бизнес-анализ и системный анализ и превращается в задачу, которую можно сделать и проверить.',
      todo: [
        'Выберите пример и нажимайте «Шаг →». На каждом слое читайте, кто работает (метка) и что получилось.',
        'Включите «Без аналитика» — что сделает команда, если хотелка уйдёт в разработку как есть?',
        'Сравните роли в таблице «БА и СА» и проверьте себя на карточках «Чьё это решение?» — нажмите на карточку, чтобы увидеть ответ.'
      ],
      look: 'Метки: жёлтая — заказчик, фиолетовая — бизнес-аналитик, синяя — системный аналитик, зелёная — команда разработки. Требования и статусы в примерах — те же, что в правилах «Искры» (BR-3, BR-4, BR-13).'
    }),
    render(el) {
      el.classList.add('m1t-root');
      const t = document.createElement('div'); el.appendChild(t);
      ui.tabs(t, [
        { id: 'tr', t: 'Перевод: от хотелки до задачи', render: pane => {
          let ex = 'status', k = 1, raw = false;
          pane.innerHTML = `<div class="stack">
            <div class="row"><span class="small dim">Пример:</span>${ui.seg('ex', Object.keys(TRANS).map(x => ({ v: x, t: TRANS[x].t })), ex, 'accent')}</div>
            <div class="row"><button type="button" class="btn sm primary" data-st="next">Шаг →</button><button type="button" class="btn sm ghost" data-st="all">Показать все слои</button><button type="button" class="btn sm ghost" data-st="reset">⟲ Сначала</button>
              <button type="button" class="btn sm" data-raw aria-pressed="false">Без аналитика</button></div>
            <div data-ly></div></div>`;
          function draw() {
            const X = TRANS[ex];
            TR.$('[data-raw]', pane).setAttribute('aria-pressed', String(raw));
            if (raw) {
              const first = X.layers[0];
              TR.$('[data-ly]', pane).innerHTML = `<div class="m1t-layers"><div class="m1t-layer past"><span class="no">1</span><div><div class="hd">${first.h} <span class="m1t-tag biz">${first.tag}</span></div><div class="tx">${first.tx}</div></div></div>
                <div class="m1t-layer skip"><span class="no">→</span><div><div class="hd">Сразу в разработку <span class="m1t-tag dev">Команда</span></div><div class="tx">${X.raw}</div></div></div></div>`;
              return;
            }
            TR.$('[data-ly]', pane).innerHTML = `<div class="m1t-layers">${X.layers.slice(0, k).map((y, i) => `<div class="m1t-layer ${i === k - 1 ? 'cur' : 'past'}"><span class="no">${i + 1}</span><div><div class="hd">${y.h} <span class="m1t-tag ${y.who}">${y.tag}</span></div><div class="tx">${y.tx}</div></div></div>`).join('')}</div>
              ${k >= X.layers.length ? ui.note('ok', 'Итог', 'Одна фраза заказчика превратилась в проблему, измеримую цель, требования к системе и критерий приёмки. Ни на одном шаге аналитик не решал за Тимура, что важнее, и не выбирал за Глеба, как это сделать.') : `<div class="small dim">Слой ${k} из ${X.layers.length}</div>`}`;
          }
          TR.on(pane, 'click', '[data-st]', (e, b) => { raw = false; const X = TRANS[ex]; k = b.dataset.st === 'next' ? Math.min(X.layers.length, k + 1) : b.dataset.st === 'all' ? X.layers.length : 1; draw(); });
          TR.on(pane, 'click', '[data-raw]', () => { raw = !raw; draw(); });
          ui.onSeg(pane, (n, v) => { if (n === 'ex') { ex = v; k = 1; raw = false; draw(); } });
          draw();
        } },
        { id: 'cmp', t: 'БА и СА', render: pane => {
          pane.innerHTML = `<div class="stack"><div class="m1t-cmp"><div class="k"></div><div class="h">Бизнес-аналитик</div><div class="h">Системный аналитик</div>
            ${CMP.map(r => `<div class="k">${r[0]}</div><div>${r[1]}</div><div>${r[2]}</div>`).join('')}</div>
            ${ui.note('warn', 'Честно о границе', 'Чёткой границы нет. В банке бизнес-аналитик может сидеть в бизнес-подразделении и не видеть код, а системный — в ИТ. В студии вроде «Орбиты» оба слоя делает один человек. На собеседовании ценят не определение, а понимание: бизнес-анализ отвечает «что и зачем», системный — «что именно делает система», а «как» — за разработкой.')}
            ${interview('Чем бизнес-аналитик отличается от системного?', 'Бизнес-аналитик работает с потребностями бизнеса: проблемы, цели, процессы, бизнес-требования. Системный — переводит их в требования к системе: сценарии, правила, данные, интеграции, критерии приёмки, — и сопровождает разработку. Пример из жизни сильнее определения: «теряем 21 % звонков» — бизнес-анализ, «слоты по 30 минут, ответ 409, если слот заняли» — системный.')}</div>`;
        } },
        { id: 'who', t: 'Кто что решает', render: pane => {
          const open = new Set();
          pane.innerHTML = `<div class="stack">
            <div class="m1t-deciders">
              <div class="m1t-dec"><span class="eyebrow">Что и зачем</span><span class="big">Бизнес и владелец продукта</span><span class="small muted">Цели, приоритеты, правила, что входит в MVP. Тимур Рашидович, эксперты станций.</span></div>
              <div class="m1t-dec"><span class="eyebrow">Как</span><span class="big">Команда разработки</span><span class="small muted">Архитектура, технологии, интерфейс, код. Глеб, Ника, Даша, Тимофей.</span></div>
              <div class="m1t-dec"><span class="eyebrow">Когда и за сколько</span><span class="big">Руководитель проекта</span><span class="small muted">Сроки, бюджет, риски, договор. Артём — вместе с владельцем продукта.</span></div>
              <div class="m1t-dec c"><span class="eyebrow">Аналитик посередине</span><span class="big">Переводит, предлагает варианты, фиксирует решения</span><span class="small muted">Выясняет правила, раскладывает спор на «что» и «как», приносит варианты с ценой тому, кто решает, и записывает, что решили. Сам решает только в своей зоне: как описать требования и как организовать работу с ними.</span></div>
            </div>
            <div class="eyebrow">Проверьте себя: чьё это решение?</div>
            <div class="m1t-flip" data-flip></div></div>`;
          const draw = () => { TR.$('[data-flip]', pane).innerHTML = DECIDE.map((d, i) => `<button type="button" data-fl="${i}" aria-pressed="${open.has(i)}"><b>${esc(d.q)}</b>${open.has(i) ? `<span class="a">${d.a}</span>` : '<span class="small dim">Нажмите, чтобы увидеть ответ</span>'}</button>`).join(''); };
          TR.on(pane, 'click', '[data-fl]', (e, b) => { const i = +b.dataset.fl; open.has(i) ? open.delete(i) : open.add(i); draw(); });
          draw();
        } }
      ], 'tr');
      el.insertAdjacentHTML('beforeend', anNote('Аналитик — переводчик в обе стороны. Бизнесу он переводит технику на язык денег и сроков («это плюс две недели»), команде — бизнес на язык правил и данных («ровно за 3:00 — ещё бесплатно»). Чаще всего он ошибается не в переводе, а когда начинает <b>решать за других</b>: выбирать технологию за Глеба или приоритеты за Тимура.'));
    }
  };

  // =====================================================================
  // Теория 3. RACI и каналы коммуникации
  // =====================================================================
  const CYCLE = ['', 'R', 'A', 'C', 'I'];
  function raciLint(cols, row) {
    const vals = cols.map(c => (row || {})[c.id] || ''), cnt = k => vals.filter(x => x === k).length;
    if (!vals.some(Boolean)) return [{ k: 'warn', t: 'строка пустая — никто ничего не делает' }];
    const out = [], A = cnt('A'), R = cnt('R'), C = cnt('C');
    if (A === 0) out.push({ k: 'bad', t: R ? 'делать есть кому, а отвечать за результат некому (нет A)' : 'никто не отвечает за результат (нет A)' });
    if (A > 1) out.push({ k: 'bad', t: `отвечающих (A) — ${A}: каждый думает, что решает он` });
    if (C >= cols.length - 1) out.push({ k: 'warn', t: 'советоваться почти со всеми — решение будет ждать каждого' });
    if (!out.length) out.push({ k: 'ok', t: R ? 'один отвечает, понятно, кто делает' : 'один отвечает и делает сам — так бывает' });
    return out;
  }
  function raciTable(el, cfg) {
    const v = cfg.value;
    el.innerHTML = `<div class="m1t-raci"><table><thead><tr><th class="rl">Что делаем</th>${cfg.cols.map(c => `<th>${esc(c.t)}${c.sub ? `<span class="sb">${esc(c.sub)}</span>` : ''}</th>`).join('')}</tr></thead>
      <tbody>${cfg.rows.map(r => `<tr class="${(cfg.reveal && cfg.reveal[r.id]) || ''}"><td class="rl">${esc(r.t)}</td>${cfg.cols.map(c => { const x = (v[r.id] || {})[c.id] || ''; return `<td><button type="button" class="m1t-cell" data-r="${r.id}" data-c="${c.id}" data-v="${x}" aria-label="${esc(r.t)} — ${esc(c.t)}: ${x || 'пусто'}" ${cfg.readonly ? 'disabled' : ''}>${x || '·'}</button></td>`; }).join('')}</tr>`).join('')}</tbody></table></div>`;
    if (!cfg.readonly) TR.on(el, 'click', '.m1t-cell', (e, b) => {
      const r = b.dataset.r, c = b.dataset.c; v[r] = v[r] || {};
      const nx = CYCLE[(CYCLE.indexOf(v[r][c] || '') + 1) % CYCLE.length];
      if (nx) v[r][c] = nx; else delete v[r][c];
      b.dataset.v = nx; b.textContent = nx || '·';
      b.setAttribute('aria-label', b.getAttribute('aria-label').replace(/: [^:]*$/, ': ' + (nx || 'пусто')));
      const tr = b.closest('tr'); if (tr) tr.className = '';
      cfg.onChange && cfg.onChange(v, r);
    });
  }
  const lintHTML = (cols, rows, v) => {
    const used = rows.filter(r => cols.some(c => (v[r.id] || {})[c.id]));
    if (!used.length) return '<div class="small dim">Заполните строки — проверка формата появится здесь.</div>';
    return `<ul class="checks">${used.map(r => raciLint(cols, v[r.id]).map(x => `<li class="${x.k === 'ok' ? '' : x.k}"><b>${esc(r.t)}</b>: ${esc(x.t)}</li>`).join('')).join('')}</ul>${used.length < rows.length ? `<div class="small dim">Заполнено строк: ${used.length} из ${rows.length}.</div>` : ''}`;
  };
  const RACI_LEGEND = `<div class="m1t-legend">
    <div class="card flat"><span class="lt" style="color:var(--info)">R</span><b>Делает</b><span class="small muted">Responsible — исполнитель, «руки». Может быть несколько.</span></div>
    <div class="card flat"><span class="lt" style="color:var(--accent)">A</span><b>Отвечает</b><span class="small muted">Accountable — с кого спросят и кто принимает работу. <b>Ровно один</b> на строку.</span></div>
    <div class="card flat"><span class="lt" style="color:var(--warn)">C</span><b>Советуемся</b><span class="small muted">Consulted — спрашиваем до решения, разговор в обе стороны.</span></div>
    <div class="card flat"><span class="lt" style="color:var(--text-2)">I</span><b>В курсе</b><span class="small muted">Informed — сообщаем после, в одну сторону.</span></div>
  </div>`;
  const BATH_COLS = [L('anna', 'Анна', 'хозяйка'), L('boss', 'Прораб'), L('des', 'Дизайнер'), L('tile', 'Плиточник'), L('plumb', 'Сантехник'), L('uk', 'УК', 'управляющая компания'), L('nbr', 'Соседи')];
  const BATH_ROWS = [L('choose', 'Выбрать плитку и бюджет'), L('plan', 'Составить смету и график'), L('pipes', 'Заменить трубы'), L('water', 'Отключить стояк воды'), L('lay', 'Положить плитку')];
  const BATH_GOOD = {
    choose: { anna: 'A', boss: 'C', des: 'R', tile: 'C' },
    plan: { anna: 'C', boss: 'A', tile: 'C', plumb: 'C' },
    pipes: { anna: 'I', boss: 'A', plumb: 'R' },
    water: { boss: 'R', plumb: 'C', uk: 'A', nbr: 'I' },
    lay: { anna: 'I', boss: 'A', des: 'C', tile: 'R' }
  };
  const BATH_BREAKS = [
    { id: 'good', t: 'Как надо', k: 'ok', fix: v => v, story: 'В каждой строке один отвечающий, понятно, кто делает, с кем советоваться и кого предупредить. Ремонт идёт по графику.' },
    { id: 'twoA', t: 'Двое главных', k: 'bad', fix: v => { v.choose.des = 'A'; return v; }, story: 'Анна выбрала бежевую плитку, дизайнер — серую, и каждый считал, что решает он. Прораб на всякий случай заказал обе партии. Лишние 40 тысяч и неделя ожидания.' },
    { id: 'noA', t: 'Никто не отвечает', k: 'bad', fix: v => { delete v.lay.boss; return v; }, story: 'Плитку положили с перекосом. Анна спрашивает: «Кто принимал?» Плиточник: «Я делал, как сказали». Дизайнер: «Я только рисовал». Прорабу работу никто не сдавал. Переделывать некому.' },
    { id: 'allC', t: 'Советоваться со всеми', k: 'warn', fix: v => { Object.assign(v.plan, { des: 'C', uk: 'C', nbr: 'C' }); return v; }, story: 'Смету согласовывали две недели: ждали ответа от УК и от соседей, которым до сметы нет дела. Плиточник ушёл на другой объект.' },
    { id: 'noI', t: 'Забыли предупредить', k: 'warn', fix: v => { delete v.water.nbr; return v; }, story: 'Стояк перекрыли в 9 утра без объявления. Сосед сверху остался с мыльной головой — и написал жалобу в УК. Таблица выглядит «правильной» — формат это не ловит, ловит только здравый смысл.' }
  ];
  const CHAT = [
    { id: 'm1', who: 'gleb', t: 'Отмена ровно за 3 часа до записи — бесплатно или уже нет? Пишу проверку прямо сейчас.', ch: ['chat', 'conf'], why: 'Быстрый вопрос — ответить в чате в течение часа, чтобы Глеб не встал. Но <b>само правило</b> записать в требование BR-3 в Confluence и в задачу в Jira: через месяц никто не будет искать ответ в переписке.' },
    { id: 'm2', who: 'liza', t: 'Нашла: отмена за 2:59 проходит бесплатно. Это баг?', ch: ['jira'], why: 'Дефект — в Jira: шаги, ожидаемый и фактический результат, ссылка на BR-3. В чате баг потеряется, и никто не увидит, когда его исправили.' },
    { id: 'm3', who: 'timur', t: '(вам в личку, в 23:40) Добавьте ещё шиномонтаж с хранением шин. Это же несложно?', ch: ['mail', 'meet'], why: 'Это запрос на изменение. Не обещать в личке: поблагодарить, передать Артёму, оценить влияние и вернуться с вариантами — на встрече или письмом. Решение фиксируется письменно, иначе «несложно» станет вашим личным обещанием.' },
    { id: 'm4', who: 'nika', t: 'Залила новый вариант экрана «Выбор времени», посмотрите', ch: ['jira', 'conf'], why: 'Ссылку на фрейм Figma — в задачу и в требование, а не только в чат. Замечания — комментариями в самой Figma, чтобы они висели рядом с элементом.' },
    { id: 'm5', who: 'marina', t: '(голосовое, 4 минуты) Про то, как принимать машину, если клиент приехал без записи…', ch: ['conf', 'mail'], why: 'Ценное знание из головы эксперта. Переслушать, записать правила в Confluence и отправить Марине Олеговне короткое письмо: «правильно ли я понял(а)?» — follow-up после разговора.' },
    { id: 'm6', who: 'artem', t: 'Спорим про хранение фото уже 40 сообщений. Может, созвонимся?', ch: ['meet'], why: 'Да: спор с тремя мнениями решают на короткой встрече с вариантами на столе. После — протокол: что решили, кто решил и почему.' }
  ];
  const CHANS = [
    { id: 'chat', t: 'Рабочий чат', d: 'быстрые вопросы и новости; решения отсюда переносят в документ' },
    { id: 'jira', t: 'Jira', d: 'задачи, баги, статусы, кто делает и когда' },
    { id: 'conf', t: 'Confluence', d: 'требования, решения, протоколы — единый источник правды' },
    { id: 'meet', t: 'Встреча', d: 'спорное, сложное, демо, груминг; итог — протокол' },
    { id: 'mail', t: 'Письмо', d: 'договорённости с заказчиком, изменения объёма, follow-up' }
  ];
  const howRaci = {
    id: 'how-raci', covers: ['t-raci', 't-photo'], title: 'Как это работает: RACI и каналы коммуникации', free: true, noReset: true,
    simple: {
      icon: '📋',
      plain: 'RACI — табличка: для каждого дела записано, кто делает, кто отвечает, с кем советуются и кого просто предупреждают. А каналы коммуникации — договорённость, где что живёт: вопрос — в чате, задача — в Jira, решение — в Confluence.',
      analogy: 'Ремонт ванной. Плитку выбирает хозяйка, кладёт плиточник, за результат отвечает прораб, стояк перекрывает управляющая компания, а соседей надо предупредить. Если отвечающих двое — спорят, если ни одного — переделывать некому.',
      tech: '<b>R</b> (Responsible) — исполнитель, их может быть несколько. <b>A</b> (Accountable) — отвечает за результат и принимает работу, <b>ровно один на задачу</b>. <b>C</b> (Consulted) — консультирует до решения. <b>I</b> (Informed) — получает сообщение после. Матрица ответственности пришла из практики управления проектами (PMBOK). Каналы: <b>Jira</b> — система задач, <b>Confluence</b> — вики для требований и решений, чат — Telegram, Slack, «Пачка» и т. п. Правило: решение, принятое в чате или на встрече, «существует», когда оно записано там, где его найдут.'
    },
    lead: ui.brief({
      situation: 'Две вкладки. «RACI» — соседний бытовой пример: ремонт ванной, пять дел и семь участников. «Каналы» — рабочий чат проекта «Искра Онлайн» в обычный вторник: шесть сообщений, и каждое должно попасть в своё место.',
      todo: [
        'Вкладка «RACI»: прочитайте легенду и таблицу «как надо». Нажимайте поломки и читайте, что случилось на ремонте.',
        'Пощёлкайте клетки сами: клик меняет букву по кругу (пусто → R → A → C → I). Следите за проверкой под таблицей.',
        'Вкладка «Каналы»: нажимайте на сообщения в чате. Подсветятся каналы, куда это должно попасть, и объяснение почему.'
      ],
      look: 'Строка — дело, столбец — человек. Проверка под таблицей ловит формат: нет A, два A, советуются со всеми. Кого забыли предупредить, формат не поймает — это видно только по смыслу.'
    }),
    render(el) {
      el.classList.add('m1t-root');
      const t = document.createElement('div'); el.appendChild(t);
      ui.tabs(t, [
        { id: 'raci', t: 'RACI', render: pane => {
          let v = TR.clone(BATH_GOOD), cur = 'good';
          pane.innerHTML = `<div class="stack">${RACI_LEGEND}<div class="row"><span class="small dim">Поломки:</span><div class="row" data-br></div></div><div data-tbl></div><div data-lint></div><div data-story></div></div>`;
          const drawBtns = () => { TR.$('[data-br]', pane).innerHTML = BATH_BREAKS.map(b => `<button type="button" class="btn sm ${b.id === 'good' ? '' : 'ghost'}" data-bk="${b.id}" aria-pressed="${cur === b.id}">${esc(b.t)}</button>`).join(''); };
          const drawLint = () => { TR.$('[data-lint]', pane).innerHTML = lintHTML(BATH_COLS, BATH_ROWS, v); };
          const drawStory = () => { const b = BATH_BREAKS.find(x => x.id === cur); TR.$('[data-story]', pane).innerHTML = b ? ui.note(b.k, 'Что случилось на ремонте', b.story) : ui.note('', 'Вы правите сами', 'Смотрите на проверку выше. И помните: таблица без ошибок формата ещё не значит, что все нужные люди в курсе.'); };
          function drawTable() {
            const old = TR.$('[data-tbl]', pane), fresh = document.createElement('div'); fresh.setAttribute('data-tbl', ''); old.replaceWith(fresh);
            raciTable(fresh, { cols: BATH_COLS, rows: BATH_ROWS, value: v, onChange: () => { cur = null; drawBtns(); drawLint(); drawStory(); } });
          }
          TR.on(pane, 'click', '[data-bk]', (e, b) => { const br = BATH_BREAKS.find(x => x.id === b.dataset.bk); cur = br.id; v = br.fix(TR.clone(BATH_GOOD)); drawBtns(); drawTable(); drawLint(); drawStory(); });
          drawBtns(); drawTable(); drawLint(); drawStory();
        } },
        { id: 'chan', t: 'Каналы', render: pane => {
          let sel = 'm1';
          pane.innerHTML = `<div class="stack"><div class="m1t-chans" data-chans></div><div class="m1t-chat" data-chat></div><div data-why></div>
            ${ui.note('', 'Встречи проекта', 'Ежедневная встреча команды (15 минут: что сделано, что мешает), уточнение бэклога с аналитиком, демо для Тимура Рашидовича и Марины Олеговны, ретроспектива. Подробно о них — в следующей тренировке «Подходы к организации разработки». Правило для любой встречи с заказчиком: в тот же день — короткое письмо с итогами.')}</div>`;
          function draw() {
            const m = CHAT.find(x => x.id === sel);
            TR.$('[data-chans]', pane).innerHTML = CHANS.map(c => `<div class="m1t-chan ${m.ch.includes(c.id) ? 'on' : ''}"><b>${esc(c.t)}</b><span class="small muted">${esc(c.d)}</span></div>`).join('');
            TR.$('[data-chat]', pane).innerHTML = `<div class="eyebrow">Чат «Искра Онлайн · команда»</div>${CHAT.map(x => { const p = TR.PEOPLE[x.who]; return `<button type="button" class="m1t-msg" data-msg="${x.id}" aria-pressed="${x.id === sel}"><span class="avatar sm" data-p="${x.who}" aria-hidden="true">${esc(p.ini)}</span><span><span class="who">${esc(p.name)}</span><span class="t" style="display:block">${esc(x.t)}</span></span></button>`; }).join('')}`;
            TR.$('[data-why]', pane).innerHTML = ui.note('ok', 'Куда это должно попасть', m.why);
          }
          TR.on(pane, 'click', '[data-msg]', (e, b) => { sel = b.dataset.msg; draw(); });
          draw();
        } }
      ], 'raci');
      el.insertAdjacentHTML('beforeend', anNote('В RACI проекта аналитик почти никогда не пустой: где-то он делает (требования, памятки), где-то с ним советуются (архитектура, макеты, проверка). А в коммуникациях он — хранитель «единого источника правды»: следит, чтобы решения из чатов и встреч оказывались в требованиях, а не только в чьей-то памяти.'));
    }
  };

  // =====================================================================
  // Практика 1. Кому адресовать вопрос
  // =====================================================================
  const WHO = [
    { v: 'timur', t: 'Тимур Рашидович — владелец продукта' },
    { v: 'marina', t: 'Марина Олеговна — приёмка, эксперт' },
    { v: 'olga', t: 'Ольга Викторовна — бухгалтерия, законы' },
    { v: 'artem', t: 'Артём — руководитель проекта' },
    { v: 'gleb', t: 'Глеб — архитектор, тимлид' },
    { v: 'nika', t: 'Ника — дизайнер' },
    { v: 'dasha', t: 'Даша — мобильная разработка' },
    { v: 'liza', t: 'Лиза — тестирование' },
    { v: 'devops', t: 'Денис — DevOps' },
    { v: 'support', t: 'Поддержка (первая линия)' }
  ];
  const ASK = [
    { id: 'prio', t: 'Что важнее успеть к 15 марта — онлайн-оплату или бонусы?', ok: 'timur', crit: true, alt: { artem: 'Артём скажет, во что обходится каждый вариант, но выбирает, что важнее для бизнеса, владелец продукта.' }, hint: 'Кто в проекте решает, что важнее, и платит за это?', why: 'Приоритеты решает владелец продукта. Аналитик приносит варианты с ценой, Артём — влияние на срок, выбирает Тимур Рашидович.' },
    { id: 'cost', t: 'Если взять в MVP шиномонтаж с хранением шин — что станет со сроком 15 марта и бюджетом?', ok: 'artem', crit: true, alt: { gleb: 'Глеб оценит трудоёмкость, но ответ про срок, бюджет и договор собирает руководитель проекта.', timur: 'Решать будет Тимур Рашидович — но с цифрами в руках. Сначала нужно влияние на срок и бюджет.' }, hint: 'Кто отвечает за сроки, бюджет и договор?', why: 'Влияние на сроки и деньги — зона руководителя проекта. С его оценкой идут к владельцу за решением.' },
    { id: 'issue', t: 'Как сейчас на станции выдают машину, если клиент так и не ответил про доп. работы?', ok: 'marina', hint: 'Кто знает, как работа на станции устроена на самом деле?', why: 'Правила и исключения приёмки знает эксперт. Марина Олеговна расскажет, как обсуждают такое при выдаче (BR-8).' },
    { id: 'load', t: 'Выдержит ли поиск слотов 1 500 человек одновременно в понедельник в 09:00?', ok: 'gleb', alt: { liza: 'Лиза проверит это нагрузочным тестом, но спроектировать систему под такую нагрузку — задача архитектора.', devops: 'Денис поможет с серверами, но как устроить систему под нагрузку, решает архитектор.' }, hint: 'Кто решает, как устроена система, чтобы она выдержала нагрузку?', why: 'Нагрузка — вопрос архитектуры. Аналитик даёт Глебу цифры (1 500 одновременно, ответ ≤ 1 с для 95 % запросов), решение — его.' },
    { id: 'push', t: 'Что делает приложение на телефоне, если клиент выключил push-уведомления?', ok: 'dasha', alt: { nika: 'Ника нарисует, как это выглядит, но про ограничения iOS и Android, разрешения и фоновые обновления знает мобильный разработчик.' }, hint: 'Кто знает особенности телефонов, разрешений и уведомлений?', why: 'Особенности iOS и Android — к мобильному разработчику. С ответом Даши аналитик дописывает сценарий «push не дошёл».' },
    { id: 'empty', t: 'Что видит клиент на экране «Выбор времени», если на выбранный день нет свободных слотов?', ok: 'nika', alt: { dasha: 'Даша это сделает, но придумать, что видит человек и что ему предложить, должна дизайнер.' }, hint: 'Кто придумывает, что человек видит на экране в каждом состоянии?', why: 'Состояния экрана рисует дизайнер. Аналитик даёт Нике правило (BR-2) и само состояние «слотов нет», Ника решает, как это показать.' },
    { id: 'edges', t: 'Список проверок отмены: за 3:01, ровно за 3:00 и за 2:59 до начала (BR-3)', ok: 'liza', alt: { gleb: 'Глеб по нему тоже сверится, но в первую очередь это материал для проверки.' }, hint: 'Кому нужны граничные значения и ожидаемый результат, чтобы проверить работу?', why: 'Граничные значения и ожидаемый результат — то, из чего Лиза делает тест-кейсы.' },
    { id: 'window', t: 'Когда выкатывать обновления, чтобы не мешать станциям, работающим с 08:00 до 21:00?', ok: 'devops', alt: { gleb: 'Глеб учтёт это в архитектуре, но выкатку и окна обслуживания держит эксплуатация.', artem: 'Артём согласует окна с заказчиком, но планирует и делает выкатку DevOps.' }, hint: 'Кто выкатывает новые версии и следит, чтобы система работала?', why: 'Окна обслуживания и выкатка — DevOps. Аналитик даёт требование: доступность 99,5 % в часы работы станций, обновления ночью.' },
    { id: 'check', t: 'Какой чек нужен при предоплате 500 ₽ после двух неявок (BR-4) и какой — при окончательной оплате?', ok: 'olga', alt: { timur: 'Тимур Рашидович решает, нужна ли предоплата, но какой чек требует закон — к главному бухгалтеру.' }, hint: 'Кто в «Искре» отвечает за кассу, чеки и 54-ФЗ?', why: 'Чеки по 54-ФЗ, предоплата и окончательный расчёт — вопрос к Ольге Викторовне. Ответ попадёт в требования к онлайн-кассе.' },
    { id: 'memo', t: 'Памятка: что ответить клиенту, если push «Готов» пришёл, а SMS нет', ok: 'support', alt: { liza: 'Лиза проверит, приходят ли оба сообщения, но памятка с ответами клиентам нужна тем, кто будет им отвечать.' }, hint: 'Кто будет отвечать клиентам после запуска?', why: 'Поддержке нужны памятки и известные ограничения — иначе каждое обращение превращается в срочную ошибку для разработчиков.' }
  ];
  function askEval(v) {
    v = v || {};
    return ASK.map(r => { const got = v[r.id]; if (got === r.ok) return { r, s: 'ok', pts: 1 }; if (r.alt && r.alt[got]) return { r, s: 'warn', pts: 0.5 }; return { r, s: 'bad', pts: 0, empty: !got }; });
  }
  const whoOf = v => (WHO.find(w => w.v === v) || { t: '—' }).t;
  const taskWhom = {
    id: 't-whom', title: 'Кому адресовать вопрос',
    simple: howRoles.simple,
    lead: ui.brief({
      situation: 'Вторая неделя проекта. В блокноте скопились вопросы и готовые материалы, и каждый надо отнести тому, кто по нему решает или кому он нужен для работы. Нести всё Тимуру Рашидовичу нельзя — у него семь станций. Всё Глебу — тоже: он не решает за бизнес.',
      todo: [
        'Для каждой из десяти строк выберите, к кому вы с этим пойдёте.',
        'Спрашивайте себя: кто решает? кто будет это делать? кому без этого не начать работу?',
        'Нажмите «Проверить». Засчитывается от 80 %, и две строки — про приоритеты и про влияние на срок — обязательны. Некоторые строки допускают второй ответ: он засчитывается наполовину, с пояснением.'
      ],
      look: 'Роли — в разделе теории «Карта команды». Выбирайте не должность, а того, чья это работа: Глеб, например, и архитектор, и тимлид, и бэкенд-разработчик.'
    }),
    blank: () => ({ v: {} }),
    reference: () => ({ v: Object.fromEntries(ASK.map(r => [r.id, r.ok])) }),
    render(el, ctx) {
      el.classList.add('m1t-root');
      let reveal = null;
      if (ctx.result) { reveal = {}; askEval(ctx.ans.v).forEach(x => { reveal[x.r.id] = { s: x.s, why: x.s === 'ok' || ctx.readonly ? x.r.why : (x.s === 'warn' ? x.r.alt[ctx.ans.v[x.r.id]] : x.r.hint) }; }); }
      const box = document.createElement('div'); el.appendChild(box);
      ui.match(box, { rows: ASK.map(r => ({ id: r.id, t: esc(r.t) })), choices: WHO, value: ctx.ans.v || {}, reveal, readonly: ctx.readonly, placeholder: 'К кому идём…', onChange: v => { ctx.ans.v = v; ctx.save(); } });
    },
    check(ans) {
      const ev = askEval(ans && ans.v), score = ev.reduce((s, x) => s + x.pts, 0) / ASK.length;
      const critBad = ev.filter(x => x.r.crit && x.s !== 'ok'), notes = [];
      ev.forEach(x => {
        if (x.s === 'ok') return;
        if (x.s === 'warn') notes.push({ ok: 'warn', html: `«${esc(x.r.t)}» — ${x.r.alt[(ans.v || {})[x.r.id]]}` });
        else notes.push({ ok: false, html: `«${esc(x.r.t)}» — ${x.empty ? 'не выбрано. ' : ''}${x.r.hint}` });
      });
      if (!notes.length) notes.push({ ok: true, html: 'Все десять — по адресу.' });
      return {
        ok: score >= 0.8 && !critBad.length, score, notes,
        summary: `По адресу: ${ev.filter(x => x.s === 'ok').length} из ${ASK.length}, допустимо: ${ev.filter(x => x.s === 'warn').length}.`,
        mentor: critBad.length ? 'Начните с главного различия: кто <b>решает, что важнее</b>, и кто <b>считает, во что это обойдётся</b>. Это два разных человека, и к ним ходят в определённом порядке: сначала влияние — потом решение.' : null
      };
    },
    explain: `<p>Аналитик — «диспетчер» вопросов: он знает, кто в команде что решает, и не несёт каждый вопрос владельцу. Опорные различия:</p>
      <ul class="checks">
        <li><b>Тимур Рашидович решает, что важнее</b>, а Артём считает, <b>во что это обойдётся</b> по срокам и деньгам. Сначала влияние — потом решение.</li>
        <li><b>Как работает станция</b> — к Марине Олеговне, <b>что требует закон о чеках</b> — к Ольге Викторовне. Это эксперты: они не решают приоритеты, но без них правила будут выдуманными.</li>
        <li><b>Нике — состояния экранов</b>, <b>Глебу — требования в цифрах</b> (нагрузка, объёмы), <b>Даше — особенности телефона</b>, <b>Лизе — границы и ожидаемый результат</b>.</li>
        <li><b>DevOps и поддержка</b> вступают в конце, но требования для них пишут заранее: окна обслуживания, памятки, известные ограничения.</li>
      </ul>
      <p>Частая ошибка новичка — идти с любым вопросом к самому главному. Тимур Рашидович ответит и про push, и про чеки — но ответит «на глаз», а команда будет строить на этом систему. Источник: Вигерс и Битти, «Разработка требований к программному обеспечению», глава о заинтересованных лицах и источниках требований.</p>`,
    report: ans => askEval(ans && ans.v).map(x => `- ${x.r.t} → ${whoOf((ans.v || {})[x.r.id])} ${mark(x.s)}`).join('\n')
  };

  // =====================================================================
  // Практика 2. День аналитика: БА, СА или не ваша работа
  // =====================================================================
  const DAY_OPTS = [{ v: 'ba', t: 'Бизнес-анализ' }, { v: 'sa', t: 'Системный анализ' }, { v: 'no', t: 'Не моя работа' }];
  const DAY = [
    { id: 'd1', tm: '09:30', t: 'Разобрать с Мариной Олеговной, как сейчас идёт запись по телефону и на каком шаге теряются звонки', ok: 'ba', alt: { sa: 'Это ещё не система, а процесс «как есть» — бизнес-анализ. Системный появится, когда опишем, что делает приложение.' }, why: 'Процесс «как есть» и поиск, где теряются клиенты, — бизнес-анализ.' },
    { id: 'd2', tm: '10:15', t: 'Вместе с Тимуром Рашидовичем посчитать, сколько постов простаивает из-за неявок, и записать цель «17 % → 8 %»', ok: 'ba', why: 'Проблема, деньги и измеримая цель — бизнес-анализ.' },
    { id: 'd3', tm: '11:00', t: 'Описать статусы записи: «Ждёт предоплаты» → «Подтверждена» → «Клиент приехал» → «Завершена», «Отменена», «Неявка» — и переходы между ними', ok: 'sa', why: 'Статусная модель объекта системы — системный анализ.' },
    { id: 'd4', tm: '11:40', t: 'Описать запрос «Создать запись»: поля, обязательность, ответ 409, если слот уже заняли', ok: 'sa', why: 'Описание API и ошибок — системный анализ. Как реализовать запрос, решит Глеб.' },
    { id: 'd5', tm: '12:30', t: 'Выбрать, на каком языке программирования писать сервис уведомлений', ok: 'no', who: 'Глеб', why: 'Технологию выбирает архитектор (Глеб). Аналитик даёт требования: сколько уведомлений, как быстро, что если SMS-шлюз не ответил.' },
    { id: 'd6', tm: '13:30', t: 'Нарисовать в Figma экран «Выбор времени» со всеми состояниями', ok: 'no', who: 'Ника', alt: { sa: 'Сценарий и список состояний — ваша работа, а нарисовать экран — работа дизайнера.' }, why: 'Рисует Ника. От аналитика — сценарий, правила (BR-1, BR-2) и список состояний: слотов нет, нужна предоплата, нет сети.' },
    { id: 'd7', tm: '14:00', t: 'Превратить правило «запись не позже чем за 2 часа» в требование с границами: 2:00 — можно, 1:59 — нельзя, что видит клиент', ok: 'sa', alt: { ba: 'Само правило выясняет бизнес-анализ, а превратить его в поведение системы с границами — системный анализ.' }, why: 'Бизнес-правило BR-2 → требование к системе с границами и поведением — системный анализ.' },
    { id: 'd8', tm: '14:40', t: 'Составить список заинтересованных лиц «Искры»: кто влияет на проект и кого он заденет (механики, колл-центр, «Шашка»)', ok: 'ba', why: 'Заинтересованные лица и их интересы — бизнес-анализ.' },
    { id: 'd9', tm: '15:20', t: 'Решить, войдут ли бонусы в первую версию', ok: 'no', who: 'Тимур Рашидович', alt: { ba: 'Подготовить варианты и последствия — да, бизнес-анализ. Но решает не аналитик, а владелец продукта.' }, why: 'Решает владелец продукта. Аналитик готовит варианты: что даёт, сколько стоит, что сдвинется.' },
    { id: 'd10', tm: '16:00', t: 'Описать обмен с 1С: какие остатки запчастей забираем, раз в 15 минут, что делать, если 1С не отвечает', ok: 'sa', why: 'Интеграция с внешней системой — системный анализ.' },
    { id: 'd11', tm: '16:40', t: 'Написать автотест, который каждую ночь проверяет отмену записи', ok: 'no', who: 'Лиза или разработчики', why: 'Автотесты пишут тестировщики и разработчики. От аналитика — критерии приёмки, по которым тест проверяет.' },
    { id: 'd12', tm: '17:20', t: 'Предложить новый процесс: доп. работы согласуются в приложении с фото, а не звонком мастера', ok: 'ba', alt: { sa: 'Пока это процесс «как будет» — бизнес-анализ. Требования к экрану согласования появятся следующим шагом.' }, why: 'Процесс «как будет» — бизнес-анализ: меняем работу людей на станции.' },
    { id: 'd13', tm: '17:50', t: 'Описать таблицу предложений доп. работ: поля, статусы «Отправлено / Согласовано / Отклонено / Истекло», кто и как решил', ok: 'sa', why: 'Модель данных — системный анализ.' },
    { id: 'd14', tm: '18:20', t: 'Настроить резервное копирование базы на сервере', ok: 'no', who: 'Денис (DevOps)', why: 'Это DevOps. От аналитика — требования: как часто копия, сколько данных можно потерять, сколько хранить (BR-16 — 5 лет для документов).' }
  ];
  function dayEval(v) {
    v = v || {};
    return DAY.map(r => { const got = v[r.id]; if (got === r.ok) return { r, s: 'ok', pts: 1 }; if (r.alt && r.alt[got]) return { r, s: 'warn', pts: 0.5 }; return { r, s: 'bad', pts: 0, empty: !got }; });
  }
  const dayLabel = v => (DAY_OPTS.find(o => o.v === v) || { t: '—' }).t;
  const DAY_HINT = { ba: 'Здесь главное — бизнес: процессы, цели, проблемы, люди.', sa: 'Здесь главное — система: что она делает, с какими данными, правилами и ошибками.', no: 'Подумайте: кто в команде делает это руками или решает?' };
  const taskDay = {
    id: 't-day', title: 'День аналитика: в какой вы шляпе',
    simple: howBaSa.simple,
    lead: ui.brief({
      situation: 'Ваш календарь на среду, 11 ноября. Вера: «В „Орбите“ мы с вами и бизнес-, и системные аналитики. Но полезно понимать, в какой шляпе вы сейчас. А часть пунктов вообще не наша работа — её надо отдать тому, чья она, и помочь ему тем, что нужно от нас».',
      todo: [
        'Для каждого из 14 пунктов выберите: «Бизнес-анализ», «Системный анализ» или «Не моя работа».',
        'Спрашивайте себя: это про бизнес (процесс, цель, деньги, люди) или про систему (статусы, данные, API, правила с границами)? И делает ли это аналитик руками?',
        'Нажмите «Проверить». Засчитывается от 80 %. Где граница размыта, второй ответ засчитывается наполовину — с пояснением.'
      ],
      look: 'Разбор БА и СА и карточки «Чьё это решение?» — в теории «Бизнес-аналитик, системный аналитик и кто что решает». Помните: «не моя работа» не значит «не участвую» — к таким пунктам аналитик обычно что-то приносит.'
    }),
    blank: () => ({ v: {} }),
    reference: () => ({ v: Object.fromEntries(DAY.map(r => [r.id, r.ok])) }),
    render(el, ctx) {
      el.classList.add('m1t-root');
      const a = ctx.ans; a.v = a.v || {};
      const rv = ctx.result ? Object.fromEntries(dayEval(a.v).map(x => [x.r.id, x])) : null;
      const box = TR.el('<div class="m1t-day"></div>'); el.appendChild(box);
      function draw() {
        box.innerHTML = DAY.map(r => {
          const x = rv && rv[r.id], got = a.v[r.id];
          const why = x ? (x.s === 'ok' || ctx.readonly ? r.why + (r.who ? ` <b>Чья работа:</b> ${esc(r.who)}.` : '') : x.s === 'warn' ? r.alt[got] : (x.empty ? 'Не выбрано. ' : '') + (got ? DAY_HINT[r.ok] : '')) : '';
          return `<div class="m1t-slot ${x ? x.s : ''}"><span class="tm">${r.tm}</span><span class="tx">${esc(r.t)}</span>
            <span class="m1t-pick3" role="group" aria-label="Чья это работа: ${esc(r.t)}">${DAY_OPTS.map(o => `<button type="button" data-d="${r.id}" data-v="${o.v}" aria-pressed="${got === o.v}" ${ctx.readonly ? 'disabled' : ''}>${o.t}</button>`).join('')}</span>
            ${why ? `<span class="why">${why}</span>` : ''}</div>`;
        }).join('') + `<div class="small dim">Отмечено: ${DAY.filter(r => a.v[r.id]).length} из ${DAY.length}</div>`;
      }
      if (!ctx.readonly) TR.on(box, 'click', '[data-d]', (e, b) => { a.v[b.dataset.d] = b.dataset.v; if (rv) delete rv[b.dataset.d]; ctx.save(); draw(); });
      draw();
    },
    check(ans) {
      const ev = dayEval(ans && ans.v), score = ev.reduce((s, x) => s + x.pts, 0) / DAY.length, notes = [];
      const by = k => ev.filter(x => x.r.ok === k);
      [['ba', 'бизнес-анализ'], ['sa', 'системный анализ'], ['no', 'не работа аналитика']].forEach(([k, t]) => {
        const g = by(k), good = g.filter(x => x.s === 'ok').length;
        notes.push({ ok: good === g.length ? true : good >= g.length - 1 ? 'warn' : false, html: `Пункты, где главное — ${t}: распознано ${good} из ${g.length}.` });
      });
      ev.filter(x => x.s === 'bad' && !x.empty).forEach(x => notes.push({ ok: false, html: `${x.r.tm} «${esc(x.r.t)}» — ${DAY_HINT[x.r.ok]}` }));
      const empty = ev.filter(x => x.empty).length;
      if (empty) notes.push({ ok: false, html: `Не отмечено пунктов: ${empty}.` });
      const decided = ev.find(x => x.r.id === 'd9');
      return {
        ok: score >= 0.8, score, notes,
        summary: `Точно: ${ev.filter(x => x.s === 'ok').length} из ${DAY.length}, допустимо: ${ev.filter(x => x.s === 'warn').length}.`,
        mentor: decided && decided.s === 'bad' && (ans.v || {}).d9 === 'sa' ? 'Решить, что войдёт в первую версию, — не анализ, а решение владельца продукта. Наша часть — принести ему варианты и последствия.' : (ev.filter(x => x.r.ok === 'no' && x.s === 'bad').length >= 2 ? 'Аналитик часто тянет на себя чужую работу: рисует экраны, выбирает технологии, решает приоритеты. Это не помощь, а подмена — и потом непонятно, кто отвечает.' : null)
      };
    },
    explain: `<p>Разделение такое: <b>бизнес-анализ</b> — процессы «как есть» и «как будет», проблемы, цели в цифрах, заинтересованные лица. <b>Системный анализ</b> — статусы, API, правила с границами, интеграции, модель данных. А выбрать язык программирования, нарисовать макет, написать автотест, настроить резервные копии и решить, что войдёт в MVP, — работа других ролей.</p>
      <ul class="checks">
        <li>«Не моя работа» — не значит «не участвую». К каждому такому пункту аналитик приносит своё: Нике — сценарий и состояния, Глебу — цифры, Лизе — критерии, Денису — требования к резервным копиям, Тимуру Рашидовичу — варианты.</li>
        <li>Граница БА и СА размыта: правило «за 2 часа» выясняют на бизнес-интервью, а с границами 2:00 и 1:59 описывают как требование к системе. Важно не название, а понимание, какой результат вы сейчас производите.</li>
        <li>Как это выглядит в жизни: в небольших компаниях оба вида анализа делает один человек, в банках и госкомпаниях — часто разные люди и даже подразделения. Опора — BABOK (IIBA) и уровни требований по Вигерсу.</li>
      </ul>`,
    report: ans => dayEval(ans && ans.v).map(x => `- ${x.r.tm} ${x.r.t} → ${dayLabel((ans.v || {})[x.r.id])} ${mark(x.s)}`).join('\n')
  };

  // =====================================================================
  // Практика 3. RACI для пяти дел проекта
  // =====================================================================
  const PR_COLS = [L('timur', 'Тимур Р.', 'владелец продукта'), L('marina', 'Марина О.', 'эксперт приёмки'), L('artem', 'Артём', 'руководитель проекта'), L('an', 'Аналитики', 'Вера и вы'), L('gleb', 'Глеб', 'архитектор'), L('nika', 'Ника', 'дизайн'), L('liza', 'Лиза', 'QA')];
  const PR_ROWS = [
    { id: 'mvp', t: 'Решить, что входит в MVP к 15 марта', A: ['timur'], need: { an: ['R', 'C'], artem: ['R', 'C'] }, hint: 'Кто решает, что важнее, и платит за это? Аналитик здесь не решает, но без его вариантов решать не из чего; Артём считает, что успеем.' },
    { id: 'req', t: 'Описать требования к согласованию доп. работ (BR-6…BR-9)', A: ['an'], altA: ['timur'], need: { marina: ['C'], gleb: ['C'], liza: ['C'] }, hint: 'Кто пишет и отвечает за требования? С кем их обсуждают до того, как отдать в разработку: кто знает правила станции, кто будет делать, кто будет проверять?' },
    { id: 'photo', t: 'Выбрать, как и где хранить фото доп. работ', A: ['gleb'], need: { an: ['C'], timur: ['C', 'I'] }, hint: 'Кто решает, как устроена система? У кого он узнаёт, сколько фото и сколько хранить, и кому сообщить, во что это обойдётся?' },
    { id: 'ux', t: 'Нарисовать макеты экранов согласования доп. работ', A: ['nika'], need: { an: ['C'], marina: ['C', 'I'] }, hint: 'Кто отвечает за то, как выглядит и работает экран? С кем она сверяет сценарий и состояния?' },
    { id: 'test', t: 'Проверить сборку перед пилотом на станции Победы', A: ['liza'], need: { an: ['C', 'I'], gleb: ['C', 'R', 'I'] }, hint: 'Кто отвечает за проверку? Аналитик её не ведёт, но знает, что должно получиться.' }
  ];
  const PR_REF = {
    mvp: { timur: 'A', marina: 'C', artem: 'C', an: 'R', gleb: 'C', nika: 'I', liza: 'I' },
    req: { timur: 'I', marina: 'C', artem: 'I', an: 'A', gleb: 'C', nika: 'C', liza: 'C' },
    photo: { timur: 'C', artem: 'I', an: 'C', gleb: 'A', nika: 'C', liza: 'I' },
    ux: { timur: 'I', marina: 'C', an: 'C', gleb: 'C', nika: 'A', liza: 'I' },
    test: { artem: 'I', an: 'C', gleb: 'C', nika: 'I', liza: 'A' }
  };
  function prEval(v) {
    v = v || {};
    return PR_ROWS.map(r => {
      const row = v[r.id] || {}, vals = PR_COLS.map(c => row[c.id] || '');
      const As = PR_COLS.filter(c => row[c.id] === 'A').map(c => c.id);
      const oneA = As.length === 1, aOk = oneA && r.A.includes(As[0]), aAlt = oneA && (r.altA || []).includes(As[0]);
      const needOk = Object.entries(r.need).every(([c, allowed]) => allowed.includes(row[c] || ''));
      const tooC = vals.filter(x => x === 'C').length >= PR_COLS.length - 1;
      const score = (oneA ? 0.3 : 0) + (aOk ? 0.5 : aAlt ? 0.4 : 0) + (needOk ? 0.2 : 0);
      return { r, oneA, aOk, aAlt, needOk, tooC, nA: As.length, empty: !vals.some(Boolean), score, s: (aOk || aAlt) && needOk && !tooC ? 'ok' : (oneA ? 'warn' : 'bad') };
    });
  }
  const taskRaci = {
    id: 't-raci', title: 'RACI для пяти дел проекта',
    simple: howRaci.simple,
    lead: ui.brief({
      situation: 'Артём собирает план до 15 марта. На прошлом проекте «Орбиты» запуск сорвался, потому что каждый думал, что решает кто-то другой. Артём: «Соберите RACI на пять дел, где у нас уже спорят. Обсудим на планёрке».',
      todo: [
        'Щёлкайте клетки: клик меняет букву по кругу (пусто → R → A → C → I). Пустая клетка — человек в этом деле не участвует.',
        'В каждой строке — ровно один A. Подумайте, кто делает руками (R), с кем советоваться до (C) и кого предупредить после (I).',
        'Следите за проверкой под таблицей и нажмите «Проверить». Засчитывается от 80 %, и во всех строках должен быть ровно один A.'
      ],
      look: 'Колонка «Аналитики» — вы с Верой. Посмотрите, где аналитик делает (R), где отвечает (A), а где его только спрашивают (C). Проверка под таблицей ловит формат, а кто именно A — проверит кнопка «Проверить».'
    }),
    blank: () => ({ v: {} }),
    reference: () => ({ v: TR.clone(PR_REF) }),
    render(el, ctx) {
      el.classList.add('m1t-root');
      const a = ctx.ans; a.v = a.v || {};
      let reveal = null;
      if (ctx.result) { reveal = {}; prEval(a.v).forEach(x => { reveal[x.r.id] = x.s; }); }
      el.innerHTML = `<div class="stack">${RACI_LEGEND}<div data-tbl></div><div data-lint></div></div>`;
      const drawLint = () => { TR.$('[data-lint]', el).innerHTML = lintHTML(PR_COLS, PR_ROWS, a.v); };
      raciTable(TR.$('[data-tbl]', el), { cols: PR_COLS, rows: PR_ROWS, value: a.v, readonly: ctx.readonly, reveal, onChange: v => { a.v = v; ctx.save(); drawLint(); } });
      drawLint();
    },
    check(ans) {
      const ev = prEval(ans && ans.v), score = ev.reduce((s, x) => s + x.score, 0) / PR_ROWS.length, notes = [];
      ev.forEach(x => {
        if (x.s === 'ok') { if (x.aAlt) notes.push({ ok: 'warn', html: `«${esc(x.r.t)}»: A у Тимура Рашидовича — так бывает, если он подписывает требования. Но содержание требований и их качество — зона аналитика, чаще A ставят ему.` }); return; }
        if (x.empty) notes.push({ ok: false, html: `«${esc(x.r.t)}»: строка пустая. ${x.r.hint}` });
        else if (!x.oneA) notes.push({ ok: false, html: `«${esc(x.r.t)}»: ${x.nA ? `A стоит у ${x.nA} человек` : 'нет A'} — нужен ровно один. ${x.r.hint}` });
        else if (!x.aOk && !x.aAlt) notes.push({ ok: false, html: `«${esc(x.r.t)}»: A стоит не у того, кто отвечает за результат. ${x.r.hint}` });
        else if (!x.needOk) notes.push({ ok: 'warn', html: `«${esc(x.r.t)}»: отвечающий выбран верно, но проверьте роли остальных. ${x.r.hint}` });
        else if (x.tooC) notes.push({ ok: 'warn', html: `«${esc(x.r.t)}»: советоваться почти со всеми — решение будет ждать каждого. С кем действительно нужно?` });
      });
      const allOneA = ev.every(x => x.oneA);
      if (!notes.length) notes.push({ ok: true, html: 'Во всех пяти строках один отвечающий и понятные роли.' });
      return {
        ok: score >= 0.8 && allOneA, score, notes,
        summary: `Строк в порядке: ${ev.filter(x => x.s === 'ok').length} из ${PR_ROWS.length}.`,
        mentor: allOneA ? (ev.find(x => x.r.id === 'photo' && !x.aOk) ? 'Посмотрите на строку про фото: «как и где хранить» — это «как». Кто в команде отвечает за «как»?' : null) : 'Начните с правила, без которого RACI не работает: <b>в каждой строке ровно один A</b>. Двое главных — спор, ни одного — дело повисло.'
      };
    },
    explain: `<p>Главное правило RACI — <b>ровно один A в строке</b>: тот, с кого спросят за результат. R может быть несколько; C — с кем советуются до; I — кому сообщают после.</p>
      <ul class="checks">
        <li><b>Состав MVP</b> — Тимур Рашидович (A): это «что и зачем». Аналитики готовят варианты (R), Артём считает срок (C), Марина Олеговна подсказывает, без чего станция не заработает (C).</li>
        <li><b>Требования</b> — аналитики (A). Марина Олеговна, Глеб и Лиза — C уже на этой строке: правила проверяют до разработки, а не после.</li>
        <li><b>Хранение фото</b> — Глеб (A): это «как». Но он советуется с аналитиком (сколько фото, сколько хранить) и с Тимуром Рашидовичем (во что обойдётся) — отсюда лаборатория следующего задания.</li>
        <li><b>Макеты</b> — Ника (A), аналитик — C. <b>Проверка</b> — Лиза (A), аналитик — C: знает, что должно получиться, но тестирование не ведёт.</li>
      </ul>
      <p>Где у практиков нет единого мнения: можно ли одному человеку быть и A, и R, нужна ли RACI в маленькой команде. Многие ведут её только для спорных зон — кто решает про сроки, кто принимает результат. Это нормально: RACI — способ договориться, а не отчёт ради отчёта (PMBOK, раздел об управлении ресурсами проекта).</p>`,
    report: ans => prEval(ans && ans.v).map(x => `- ${x.r.t}: ${PR_COLS.map(c => `${c.t}=${((ans.v || {})[x.r.id] || {})[c.id] || '·'}`).join(', ')} ${mark(x.s)}`).join('\n')
  };

  // =====================================================================
  // Практика 4. Лаборатория: спор о фото доп. работ
  // =====================================================================
  const S1 = [
    { id: 'gleb', t: 'Написать в чат: «Глеб — тимлид, ему решать. Делаем в базе»', k: 'bad', d: { trust: 0, team: -2, days: 0, risk: 2 }, react: { who: 'nika', html: 'То есть сколько фото увидит клиент, тоже решил Глеб? Ладно, рисую одно маленькое превью. Елена Смирнова будет в восторге.' }, txt: 'Вы отдали Глебу не только «как хранить», но и «что нужно бизнесу»: сколько фото, сколько хранить, кто их видит. Эти вопросы — не к архитектору.' },
    { id: 'nika', t: 'Поддержать Нику: «Клиент — главное. Делаем галерею до 10 фото в полном размере»', k: 'bad', d: { trust: -1, team: -1, days: 3, risk: 1 }, react: { who: 'gleb', html: 'Десять фото по 5 МБ на каждое предложение? Кто это решил и кто платит за место? Я пока ничего не начинаю.' }, txt: 'Вы решили за бизнес объём функции. Галерея на 10 фото — это время Ники и Даши и деньги на хранение, а нужна ли она клиенту — никто не проверял.' },
    { id: 'split', t: 'Разделить спор: «Тут два вопроса. Что нужно бизнесу — сколько фото, сколько хранить, кто видит — подтвердит Тимур Рашидович. Где хранить — решит Глеб. Соберу факты к завтрашнему созвону»', k: 'good', d: { trust: 1, team: 1, days: 0, risk: -1 }, react: { who: 'gleb', html: 'Годится. Дай мне цифры: сколько фото и сколько хранить — посчитаю варианты.' }, txt: 'Спор «кто прав» превратился в два вопроса с понятными владельцами: «что и зачем» — бизнес, «как» — команда. Каждый получил свою задачу.' },
    { id: 'timur', t: 'Написать Тимуру Рашидовичу в личку: «Рассудите, кто прав — Глеб или Ника?»', k: 'bad', d: { trust: -2, team: -1, days: 1, risk: 0 }, react: { who: 'timur', html: 'Я в базах не разбираюсь. Вы аналитик — вы и скажите, что лучше и сколько стоит. И не пишите мне в двенадцать ночи.' }, txt: 'Эскалация без вариантов: владельца просят выбрать технологию, в которой он не разбирается, и делают это через голову команды.' }
  ];
  const S2 = [
    { id: 'petrovich', t: 'Сергей Петрович: сколько фото механик реально делает и чем снимает', good: true, fact: '<b>1–3 фото с телефона</b>, в перчатках. «Десять фото никто делать не будет — механик не фотограф».' },
    { id: 'olga', t: 'Ольга Викторовна: можно ли хранить фото с госномером где угодно', good: true, crit: true, fact: 'На фото попадают госномер и VIN — это <b>персональные данные</b> (BR-15, 152-ФЗ): хранить только на серверах <b>в России</b>.' },
    { id: 'marina', t: 'Марина Олеговна: как долго фото может понадобиться', good: true, fact: 'Пока действует <b>гарантия — 6 месяцев</b> (BR-14): клиент придёт с претензией — покажем, что было до ремонта.' },
    { id: 'glebcalc', t: 'Глеб: сколько места и денег займёт хранение', good: true, fact: '≈ 1 500 предложений в месяц × 3 фото × 3 МБ ≈ <b>13 ГБ в месяц, за полгода ≈ 80 ГБ</b>. В базе — тяжёлые резервные копии и медленное восстановление; в объектном хранилище в российском облаке — <b>около 200 ₽ в месяц</b>.' },
    { id: 'kirill', t: 'Кирилл: можно ли использовать фото поломок в рекламе', good: false, fact: 'Кирилл загорелся идеей «до и после» для соцсетей. Интересно, но это отдельная тема — и с персональными данными там свои риски. Для спора о хранении ничего не дало.' },
    { id: 'dasha', t: 'Даша: на чём написано мобильное приложение', good: false, fact: '«На Flutter». Для вопроса, сколько фото и где их хранить, это ничего не даёт.' }
  ];
  const S3 = [
    { id: 'meet', t: 'Созвон на 30 минут: показать факты и два варианта с ценой и рисками. Требования к фото (до 3 фото, 6 месяцев, только в России) подтверждает Тимур Рашидович, способ хранения выбирает Глеб, Ника рисует под это', k: 'good', d: { trust: 2, team: 1, days: 0, risk: -1 }, react: [{ who: 'timur', html: 'Три фото, полгода, в России, двести рублей в месяц? Согласен. Как хранить — решайте сами, это ваша работа.' }, { who: 'gleb', html: 'Тогда фото — в объектное хранилище в российском облаке, в базе — только ссылка в <code>extra_offer.photo_url</code>. База лёгкая, копии быстрые.' }], txt: 'Каждое решение принял тот, чья это зона, — на фактах и с ценой на столе.' },
    { id: 'vote', t: 'Голосование в чате: как большинство решит, так и сделаем', k: 'bad', d: { trust: -1, team: -1, days: 1, risk: 2 }, react: [{ who: 'nika', html: 'Четыре голоса «за базу», один мой «против». Ну, демократия. Только клиенту от этого не легче.' }], txt: 'Архитектуру и требования не решают голосованием: большинство не отвечает за последствия. Тимур Рашидович не знает, что тратит деньги, а про закон о персональных данных никто не вспомнил.' },
    { id: 'me', t: 'Вписать в требования готовое решение: «Хранить в объектном хранилище такого-то облака, формат WebP, сжатие 80 %»', k: 'bad', d: { trust: 0, team: -2, days: 0, risk: 1 }, react: [{ who: 'gleb', html: 'Это моя работа — выбирать хранилище и формат. Ты напиши, что нужно: сколько фото, как долго, где по закону. Как — решу я.' }], txt: 'Аналитик продиктовал реализацию. Требование — это «что и с какими ограничениями», а не «на чём и как».' },
    { id: 'later', t: 'Отложить: «Разберёмся в первом спринте, пока делайте как считаете нужным»', k: 'bad', d: { trust: 0, team: -1, days: 4, risk: 2 }, react: [{ who: 'dasha', html: 'Я уже сделала загрузку десяти фото, а Глеб — одно фото в базе. Кто будет переделывать?' }], txt: 'Без решения каждый сделал по-своему. Переделка — дни работы, а срок 15 марта не двигается.' }
  ];
  const S4 = [
    { id: 'doc', t: 'Протокол в Confluence: что решили, кто решил и почему. Обновить требование к фото, задачи в Jira Глебу и Нике, Лизе — критерии проверки. В чат — ссылку', k: 'good', d: { trust: 1, team: 1, days: 0, risk: -1 }, txt: 'Решение найдут все — и через месяц, и новый человек в команде. Лиза проверит лимит 3 фото и 10 МБ, потому что он записан.' },
    { id: 'oral', t: 'Ничего не записывать: все были на созвоне и так помнят', k: 'bad', d: { trust: -1, team: -1, days: 2, risk: 1 }, txt: 'Через месяц Ника: «Мы же договорились про пять фото?» Глеб: «Про три». Протокола нет — снова созвон и переделка макета.' },
    { id: 'chat', t: 'Написать короткий итог в рабочий чат', k: 'mid', d: { trust: 0, team: 0, days: 1, risk: 0 }, txt: 'Лучше, чем ничего. Но сообщение утонуло под сотней других, Лиза его не видела и не проверила лимит 10 МБ на фото.' },
    { id: 'big', t: 'Отправить Тимуру Рашидовичу на согласование 12-страничный документ с ER-диаграммой и схемой хранилища', k: 'mid', d: { trust: -1, team: 0, days: 2, risk: 0 }, txt: 'Тимур Рашидович: «Я это читать не буду. Что я подписываю — одним абзацем?» Неделя ожидания ответа.' }
  ];
  const PH_Q = {
    q: 'Итоговый вопрос: чьё решение — где физически хранить фото доп. работ?', seed: 'm1t-photo-q',
    options: [
      { t: 'Глеба как архитектора — в рамках требований, которые подтвердил владелец продукта', ok: 1, why: 'Да. «Как» — зона команды, а рамки для него задают требования, которые подтвердил владелец продукта.' },
      { t: 'Тимура Рашидовича — он владелец продукта и платит', why: 'Он решает «что и зачем» и согласует деньги. Выбирать технологию хранения — не его зона, он сам это сказал.' },
      { t: 'Аналитика — он собрал все факты и лучше всех понимает задачу', why: 'Аналитик собирает факты и раскладывает спор, но не диктует реализацию.' },
      { t: 'Всей команды голосованием', why: 'Голосование размывает ответственность: если решение окажется плохим, спросить не с кого.' }
    ]
  };
  const pick2 = a => (a.s2 || []).filter(id => S2.some(o => o.id === id)).slice(0, 3);
  function photoSim(a) {
    const tot = { trust: 0, team: 0, days: 0, risk: 0 };
    const add = d => { if (d) Object.keys(tot).forEach(k => { tot[k] += d[k] || 0; }); };
    const o1 = S1.find(o => o.id === a.s1), o3 = S3.find(o => o.id === a.s3), o4 = S4.find(o => o.id === a.s4);
    add(o1 && o1.d);
    const p = pick2(a), hasOlga = p.includes('olga'), good = p.filter(id => S2.find(o => o.id === id).good).length;
    if (p.length) add({ trust: 0, team: 0, days: 0, risk: hasOlga ? -1 : 0 });
    add(o3 && o3.d); add(o4 && o4.d);
    const late = [];
    if (a.s3 && !hasOlga) { late.push({ k: 'bad', t: 'Пилот, март: Ольга Викторовна спрашивает, где лежат фото с госномерами. Оказалось — в зарубежном облаке из прототипа. Переезд на серверы в России — +5 дней, риск штрафа по 152-ФЗ (для компании — до 6 млн ₽ за первое нарушение).' }); tot.days += 5; tot.risk += 2; }
    if (a.s3 && p.length && !p.includes('petrovich') && !p.includes('glebcalc')) { late.push({ k: 'mid', t: 'Сколько фото реально делают механики и во что обойдётся хранение, так и не выяснили — лимит на фото поставили «на глаз».' }); tot.risk += 1; }
    if (a.s3 === 'meet' && a.s4 === 'doc' && hasOlga) late.push({ k: 'good', t: 'Пилот на Победы: механик отправляет 2 фото с телефона, Елена Смирнова видит их крупно и согласует замену колодок за 4 минуты. База лёгкая, резервная копия — минуты, хранение — около 200 ₽ в месяц.' });
    return { tot, late, hasOlga, good, p };
  }
  const riskT = r => r <= -1 ? ['ok', 'низкий'] : r <= 1 ? ['warn', 'средний'] : ['bad', 'высокий'];
  const signed = n => (n > 0 ? '+' : '') + n;
  const taskPhoto = {
    id: 't-photo', title: 'Лаборатория: спор о фото доп. работ',
    simple: howRaci.simple,
    lead: ui.brief({
      situation: 'Четверг, 12 ноября. В рабочем чате 40 сообщений. Глеб: «Фото доп. работ кладём прямо в базу, в таблицу предложений — одна транзакция, ничего не потеряется». Ника: «Клиенту нужно видеть фото крупно, несколько штук, с отметкой поломки — иначе Елена не поверит». Тимур Рашидович, которого добавили в чат: «Никаких новых подписок и серверов. Аналитик, разберитесь». Все смотрят на вас.',
      todo: [
        'Шаг 1: выберите, как ответить в чат. Читайте последствия и реакцию команды — выбор можно поменять.',
        'Шаг 2: у вас один день — выберите три факта, которые соберёте к созвону.',
        'Шаги 3 и 4: как прийти к решению и как его зафиксировать. Следите за показателями: доверие Тимура Рашидовича, атмосфера в команде, сдвиг сроков, риск.',
        'Ответьте на итоговый вопрос и нажмите «Проверить». Засчитывается, если на ключевых шагах выбраны действия, при которых каждое решение принимает тот, чья это зона, и решение записано.'
      ],
      look: 'Показатели — учебная модель, а не замер. Блок «Через четыре месяца» покажет, чем обернутся ваши решения на пилоте. Опора — RACI из теории: что здесь «что и зачем», а что «как»?'
    }),
    blank: () => ({ s1: '', s2: [], s3: '', s4: '', q: [] }),
    reference: () => ({ s1: 'split', s2: ['olga', 'petrovich', 'glebcalc'], s3: 'meet', s4: 'doc', q: quizRef(PH_Q) }),
    render(el, ctx) {
      el.classList.add('m1t-root');
      const a = ctx.ans; a.s2 = a.s2 || []; a.q = a.q || [];
      const ro = ctx.readonly;
      el.innerHTML = `<div class="stack"><div class="m1t-stats" data-st></div><div class="m1t-steps" data-steps></div><div data-late></div><div class="card flat" data-q></div></div>`;
      const opt = (step, o, on, dis, multi) => `<button type="button" class="m1t-opt ${multi ? 'multi' : ''}" data-s="${step}" data-o="${o.id}" aria-pressed="${on}" ${dis ? 'disabled' : ''}><span class="bx" aria-hidden="true"></span><span>${esc(o.t)}</span></button>`;
      const cons = o => {
        if (!o) return '';
        const k = o.k === 'good' ? 'good' : o.k === 'mid' ? 'mid' : 'bad';
        const rs = o.react ? (Array.isArray(o.react) ? o.react : [o.react]) : [];
        return `<div class="m1t-cons ${k}"><div>${o.txt}</div>${rs.length ? talk(rs) : ''}</div>`;
      };
      function draw() {
        const s = photoSim(a), r = riskT(s.tot.risk);
        TR.$('[data-st]', el).innerHTML = `
          <div class="stat"><span class="k">Доверие Тимура Р.</span><span class="v ${s.tot.trust > 0 ? 'ok' : s.tot.trust < 0 ? 'bad' : ''}">${signed(s.tot.trust)}</span><span class="s">видит ли он, что его деньги берегут</span></div>
          <div class="stat"><span class="k">Атмосфера в команде</span><span class="v ${s.tot.team > 0 ? 'ok' : s.tot.team < 0 ? 'bad' : ''}">${signed(s.tot.team)}</span><span class="s">не решили ли за кого-то</span></div>
          <div class="stat"><span class="k">Сдвиг сроков</span><span class="v ${s.tot.days > 2 ? 'bad' : s.tot.days > 0 ? 'warn' : 'ok'}">${s.tot.days} ${TR.plural(s.tot.days, 'день', 'дня', 'дней')}</span><span class="s">относительно плана к 15 марта</span></div>
          <div class="stat"><span class="k">Риск</span><span class="v ${r[0]}">${r[1]}</span><span class="s">закон, переделки, «на глаз»</span></div>`;
        const o1 = S1.find(o => o.id === a.s1), o3 = S3.find(o => o.id === a.s3), o4 = S4.find(o => o.id === a.s4);
        const open2 = ro || !!a.s1, open3 = ro || (open2 && pick2(a).length >= 3), open4 = ro || (open3 && !!a.s3);
        const p = pick2(a);
        TR.$('[data-steps]', el).innerHTML = `
          <div class="m1t-step"><header><span class="n">Шаг 1</span><b>Что ответить в чат?</b></header>
            <div class="m1t-opts">${S1.map(o => opt('s1', o, a.s1 === o.id, ro)).join('')}</div>${cons(o1)}</div>
          <div class="m1t-step ${open2 ? '' : 'locked'}"><header><span class="n">Шаг 2</span><b>Какие три факта собрать за день?</b><span class="small dim">выбрано ${p.length} из 3</span></header>
            ${open2 ? `<div class="m1t-opts">${S2.map(o => opt('s2', o, p.includes(o.id), ro || (!p.includes(o.id) && p.length >= 3), true)).join('')}</div>
            ${p.length ? `<div class="m1t-factlist"><span class="eyebrow">Что вы узнали</span>${p.map(id => `<div>${S2.find(o => o.id === id).fact}</div>`).join('')}</div>` : ''}` : '<div class="small dim">Сначала ответьте в чат.</div>'}</div>
          <div class="m1t-step ${open3 ? '' : 'locked'}"><header><span class="n">Шаг 3</span><b>Как прийти к решению?</b></header>
            ${open3 ? `<div class="m1t-opts">${S3.map(o => opt('s3', o, a.s3 === o.id, ro)).join('')}</div>${cons(o3)}` : '<div class="small dim">Сначала соберите три факта.</div>'}</div>
          <div class="m1t-step ${open4 ? '' : 'locked'}"><header><span class="n">Шаг 4</span><b>Как зафиксировать решение?</b></header>
            ${open4 ? `<div class="m1t-opts">${S4.map(o => opt('s4', o, a.s4 === o.id, ro)).join('')}</div>${cons(o4)}` : '<div class="small dim">Сначала решите, как прийти к решению.</div>'}</div>`;
        TR.$('[data-late]', el).innerHTML = a.s3 && a.s4 ? `<div class="card"><span class="eyebrow">Через четыре месяца · пилот на станции Победы</span>${s.late.length ? s.late.map(x => `<div class="m1t-cons ${x.k}">${x.t}</div>`).join('') : '<div class="m1t-cons mid">Пилот прошёл без происшествий с фото, но решение держится на памяти тех, кто был на созвоне.</div>'}</div>` : '';
      }
      draw();
      ui.quiz(TR.$('[data-q]', el), Object.assign({}, PH_Q, { value: a.q, readonly: ro, reveal: ctx.result, onChange: v => { a.q = v; ctx.save(); } }));
      if (ro) return;
      TR.on(el, 'click', '[data-s]', (e, b) => {
        const s = b.dataset.s, id = b.dataset.o;
        if (s === 's2') { const p = pick2(a); a.s2 = p.includes(id) ? p.filter(x => x !== id) : (p.length < 3 ? p.concat(id) : p); }
        else a[s] = id;
        ctx.save();
        const lbl = { s1: 'Фото: ответ в чат', s2: 'Фото: какие факты собрать', s3: 'Фото: как прийти к решению', s4: 'Фото: как зафиксировать' }[s];
        const all = { s1: S1, s2: S2, s3: S3, s4: S4 }[s];
        ctx.decide(lbl, s === 's2' ? pick2(a).map(x => all.find(o => o.id === x).t).join('; ') : (all.find(o => o.id === id) || {}).t);
        draw();
      });
    },
    check(ans) {
      ans = ans || {};
      const s = photoSim(ans), q = ui.quizScore(PH_Q, ans.q || []), notes = [];
      const o1 = S1.find(o => o.id === ans.s1), o3 = S3.find(o => o.id === ans.s3), o4 = S4.find(o => o.id === ans.s4);
      notes.push(!o1 ? { ok: false, html: 'Шаг 1 не выбран.' } : o1.k === 'good' ? { ok: true, html: 'Шаг 1: спор разложен на «что и зачем» и «как» — у каждого вопроса свой владелец.' } : { ok: false, html: `Шаг 1: ${o1.txt} Подумайте, какие вопросы в этом споре — к бизнесу, а какие — к команде.` });
      if (s.p.length < 3) notes.push({ ok: false, html: `Шаг 2: выбрано фактов ${s.p.length} из 3.` });
      else if (!s.hasOlga) notes.push({ ok: false, html: 'Шаг 2: среди фактов нет того, что может остановить пилот целиком. Что изображено на фото машины — и что об этом говорит закон?' });
      else notes.push({ ok: s.good >= 3 ? true : 'warn', html: s.good >= 3 ? 'Шаг 2: три полезных факта, включая требование закона о персональных данных.' : 'Шаг 2: закон учтён, но один из фактов к спору о хранении не относится. Что ещё нужно знать, чтобы посчитать объём?' });
      notes.push(!o3 ? { ok: false, html: 'Шаг 3 не выбран.' } : o3.k === 'good' ? { ok: true, html: 'Шаг 3: решение на фактах, каждый решает в своей зоне.' } : { ok: false, html: `Шаг 3: ${o3.txt}` });
      notes.push(!o4 ? { ok: false, html: 'Шаг 4 не выбран.' } : o4.k === 'good' ? { ok: true, html: 'Шаг 4: решение записано там, где его найдут, и роздано тем, кому оно нужно.' } : { ok: o4.k === 'mid' ? 'warn' : false, html: `Шаг 4: ${o4.txt}` });
      notes.push(q.ok ? { ok: true, html: 'Итоговый вопрос: верно.' } : { ok: false, html: 'Итоговый вопрос: «где хранить» — это «что» или «как»? И кто в команде отвечает за «как»?' });
      const p4 = o4 ? (o4.k === 'good' ? 1 : o4.k === 'mid' ? 0.4 : 0) : 0;
      const score = (o1 && o1.k === 'good' ? 0.2 : 0) + (s.p.length >= 3 ? (s.hasOlga ? 0.1 : 0) + Math.min(0.1, s.good * 0.035) : 0) + (o3 && o3.k === 'good' ? 0.2 : 0) + p4 * 0.2 + q.score * 0.2;
      const ok = !!o1 && o1.k === 'good' && s.p.length >= 3 && s.hasOlga && !!o3 && o3.k === 'good' && !!o4 && o4.k === 'good' && q.ok;
      return {
        ok, score: Math.min(1, score), notes,
        summary: `Доверие ${signed(s.tot.trust)}, команда ${signed(s.tot.team)}, сдвиг сроков ${s.tot.days} ${TR.plural(s.tot.days, 'день', 'дня', 'дней')}, риск — ${riskT(s.tot.risk)[1]}.`,
        mentor: !o1 || o1.k !== 'good' ? 'В любом споре в команде начните с вопроса: <b>что здесь «что и зачем», а что «как»?</b> Первое — к бизнесу, второе — к команде. Аналитик не судья, а тот, кто раскладывает спор и приносит факты.' : (!s.hasOlga ? 'На фото машины — госномер. Какое правило «Искры» про это? Подсказка: BR-15.' : null)
      };
    },
    explain: `<p>Спор «Глеб против Ники» на самом деле состоит из двух вопросов:</p>
      <ul class="checks">
        <li><b>Что нужно бизнесу</b>: сколько фото, как долго хранить, где по закону, сколько это может стоить. Это требования — их выясняет аналитик у экспертов (Сергей Петрович, Марина Олеговна, Ольга Викторовна), подтверждает владелец продукта.</li>
        <li><b>Как это сделать</b>: в базе или в объектном хранилище, в каком формате. Это архитектура — решает Глеб в рамках требований.</li>
        <li>Ника права в главном — клиенту нужно видеть фото, — но «галерея на 10» без фактов была бы её решением за бизнес. Глеб прав в том, что решать «как» ему, — но не в том, сколько фото нужно.</li>
      </ul>
      <p>Самый опасный пропуск — <b>закон</b>: на фото госномер, это персональные данные (152-ФЗ, BR-15), хранить их можно только в России. Такие требования находят поздно и дорого, если не спросить эксперта заранее. И наконец, решение без протокола живёт ровно до первого «а мы же договаривались иначе».</p>
      <p>Как об этом спрашивают на собеседовании: «Разработчик и дизайнер спорят, заказчик требует разобраться. Ваши действия?» Сильный ответ: разложить спор на «что» и «как», собрать факты, привести варианты с ценой к тем, кто решает, зафиксировать решение письменно.</p>`,
    refNote: 'Засчитывается и другой набор фактов, если в нём есть требование закона о персональных данных и ещё два полезных факта (сколько фото делают механики, сколько хранить, сколько места и денег).',
    report: ans => {
      const s = photoSim(ans || {}), f = (arr, id) => (arr.find(o => o.id === id) || { t: '—' }).t;
      return `- Шаг 1: ${f(S1, ans.s1)}\n- Шаг 2: ${s.p.map(id => f(S2, id)).join('; ') || '—'}\n- Шаг 3: ${f(S3, ans.s3)}\n- Шаг 4: ${f(S4, ans.s4)}\n- Итог: доверие ${signed(s.tot.trust)}, команда ${signed(s.tot.team)}, сроки +${s.tot.days} дн., риск ${riskT(s.tot.risk)[1]}\n- Вопрос: ${ui.quizScore(PH_Q, ans.q || []).ok ? 'верно' : 'неверно'}`;
    }
  };

  // =====================================================================
  // Практика 5. Своими словами: Тимуру Рашидовичу — кто за что отвечает
  // =====================================================================
  const EX_RUBRIC = [
    '«Что и зачем» решает он сам как владелец продукта: что войдёт в MVP, что важнее, сколько денег; эксперты станций — Марина Олеговна, Сергей Петрович, Ольга Викторовна — рассказывают правила',
    '«Как сделать» решает команда: Глеб — устройство системы, Ника — экраны, разработчики — код, Лиза проверяет; а сроки и бюджет держит Артём',
    'Аналитик — переводчик между бизнесом и командой: выясняет правила, превращает их в требования для каждого в команде, приносит владельцу варианты с ценой и записывает решения',
    'Пример из проекта: фото доп. работ (три фото, полгода, хранение в России) или правило отмены за 3 часа — без аналитика каждый додумал бы сам, а ошибку нашли бы поздно',
    'Говорит на языке Тимура Рашидовича: коротко, про деньги, сроки и простой постов — без жаргона'
  ];
  const EX_REF = 'Тимур Рашидович, коротко. Что делать и что важнее — решаете вы: что войдёт в первую версию к 15 марта и на что тратим деньги. Как устроена работа станции, нам рассказывают Марина Олеговна, Сергей Петрович и Ольга Викторовна. Как это сделать технически — решает команда: Глеб отвечает за устройство системы, Ника — за экраны, разработчики пишут код, Лиза проверяет. За сроки и бюджет отвечает Артём. А я — переводчик между вами и командой: выясняю правила, записываю их так, чтобы каждый в команде понял одинаково, и приношу вам варианты с ценой, когда нужно решение. С фото доп. работ так и вышло: Глеб и Ника спорили, я выяснил, что механики делают 1–3 фото, что гарантия полгода и что фото с номерами по закону можно хранить только в России. Вы решили — три фото, полгода, двести рублей в месяц, — Глеб выбрал, как хранить. Без этого каждый сделал бы по-своему, а переделку мы оплатили бы сроком запуска.';
  const taskExplain = {
    id: 't-explain', title: 'Своими словами: кто у вас за что отвечает',
    simple: {
      icon: '🗣️',
      plain: 'Заказчику не нужны слова «RACI» и «бизнес-требования». Ему нужно понять, к кому идти с каким вопросом и за что он платит аналитику.',
      analogy: 'Объяснить хозяину автосервиса, зачем нужен мастер-приёмщик, если механики и так умеют чинить. Без приёмщика клиент объясняет механику «где-то стучит», механик чинит «как понял» — а выясняется это на выдаче.',
      tech: 'Опора: «что и зачем» — бизнес и владелец продукта, «как» — команда, «когда и за сколько» — руководитель проекта; аналитик связывает эти вопросы. Говорите на языке слушателя (Вигерс: каждому заинтересованному лицу — свой уровень детализации).'
    },
    lead: ui.brief({
      situation: 'После созвона про фото Тимур Рашидович пишет вам: «Я думал, аналитик — это тот, кто пишет ТЗ. А вы у меня спрашиваете, что важнее, у Глеба — как хранить, у Марины — как на станции. Объясните коротко: кто у вас за что отвечает и за что я плачу вам?»',
      todo: [
        'Напишите ответ в 5–8 предложений без технического жаргона (от 250 символов).',
        'Покажите, кто решает «что и зачем», кто — «как», кто — сроки и бюджет, и где ваше место. Приведите пример с проекта.',
        'Нажмите «Проверить с Верой (Claude)» или «Сверить с эталоном самому» и честно отметьте раскрытые пункты. Засчитывается от 60 %.'
      ],
      lookTitle: 'На что опереться',
      look: 'Теория «Кто что решает», RACI из задания 3 и лаборатория про фото. Тимур Рашидович нетерпелив и думает деньгами и сроками: коротко, конкретно, без слов «спецификация» и «артефакт».'
    }),
    blank: () => ({ j: {} }),
    reference: () => ({ j: { text: EX_REF, self: EX_RUBRIC.map(() => true) } }),
    render(el, ctx) {
      el.classList.add('m1t-root');
      el.insertAdjacentHTML('beforeend', ui.say('timur', 'Я думал, аналитик — это тот, кто пишет ТЗ. А вы у меня спрашиваете, что важнее, у Глеба — как хранить, у Марины — как на станции. Объясните коротко: кто у вас за что отвечает и за что я плачу вам?'));
      const j = document.createElement('div'); j.style.marginTop = '12px'; el.appendChild(j);
      ui.justify(j, {
        id: 'm1t-explain', q: 'Кто в команде «Искра Онлайн» за что отвечает и зачем Тимуру Рашидовичу аналитик?',
        qPlain: 'Объясните владельцу сети автосервисов без жаргона, кто в команде разработки за что отвечает (что и зачем, как, сроки и бюджет) и какую роль играет системный аналитик, с примером из проекта.',
        rubric: EX_RUBRIC, reference: EX_REF, value: ctx.ans.j, readonly: ctx.readonly, minLen: 250,
        placeholder: 'Тимур Рашидович, коротко: …',
        onChange: v => { ctx.ans.j = v; ctx.save(); ctx.decide('Кто за что отвечает (ответ Тимуру)', v.text || ''); }
      });
    },
    check(ans) {
      const s = ui.justifyScore(ans && ans.j);
      return {
        ok: s >= 0.6, score: s,
        summary: s ? `Оценка ответа: ${Math.round(s * 100)} %.` : 'Напишите ответ (от 250 символов) и проверьте его с Верой или сверьте с эталоном сами.',
        notes: s && s < 0.6 ? [{ ok: false, html: 'Тимуру Рашидовичу важно три вещи: что решает он сам, что решает команда и за что он платит вам — на живом примере с проекта.' }] : []
      };
    },
    explain: `<p>Сильный ответ строится на трёх вопросах: <b>что и зачем</b> (владелец продукта и эксперты), <b>как</b> (команда), <b>когда и за сколько</b> (руководитель проекта) — и на месте аналитика между ними. Пример с проекта убеждает лучше определений: спор про фото, правило отмены за 3 часа, «как в такси».</p>
      <p>Частые ошибки: перечислить должности без «кто что решает»; сказать «аналитик пишет ТЗ» — это результат, а не смысл работы; уйти в жаргон («бэклог», «артефакты», «стейкхолдеры»). И честно: аналитик не начальник команды и не секретарь заказчика — он отвечает за то, чтобы все понимали одно и то же.</p>`,
    report: ans => (ans.j && ans.j.text) ? ans.j.text : '—'
  };

  // =====================================================================
  TR.stage({
    id: ID,
    when: 'среда, 4 ноября, 10:00 · «Орбита», знакомство с командой',
    intro: [
      { who: 'artem', html: 'Коллеги, знакомимся. Проект «Искра Онлайн», MVP к 15 марта. Нас восемь человек, плюс со стороны «Искры» Тимур Рашидович и его люди. Сегодня договариваемся, кто за что отвечает, — чтобы через месяц не выяснять это в чате.' },
      { who: 'gleb', html: 'От аналитиков мне нужно одно: что должно получиться и по каким правилам. Не «сделайте на микросервисах», а цифры и крайние случаи. Как сделать — наша работа.' },
      { who: 'liza', html: 'А мне — чтобы каждое «быстро» и «удобно» превращалось в число. И зовите меня читать требования до разработки, а не после.' },
      { who: 'vera', html: 'Слышите? Каждый ждёт от вас своего. Сегодня разберём, кто в команде что решает, где кончается бизнес-анализ и начинается системный — и что делать, когда двое спорят, а заказчик говорит «разберитесь».' }
    ],
    facts: ['F-scope', 'F-deadline'],
    glossary: [
      { term: 'Владелец продукта (Product Owner)', simple: 'Тот, кто решает, что делать в первую очередь, и принимает результат. У нас — Тимур Рашидович.', tech: 'Отвечает за ценность продукта: цель продукта, порядок в бэклоге, приёмка результата. В Scrum Guide 2020 — одна из трёх зон ответственности.' },
      { term: 'Руководитель проекта (Project Manager)', simple: 'Следит, чтобы успели к сроку и уложились в деньги. У нас — Артём.', tech: 'Отвечает за сроки, бюджет, риски, договор и коммуникации с заказчиком (PMBOK).' },
      { term: 'Бизнес-аналитик', simple: 'Выясняет, что на самом деле нужно бизнесу и зачем.', tech: 'Работает с потребностями: цели, проблемы, процессы, заинтересованные лица, бизнес-требования (BABOK, IIBA).' },
      { term: 'Системный аналитик', simple: 'Переводит потребности бизнеса в понятные команде требования к системе.', tech: 'Описывает поведение системы: сценарии, правила, статусы, данные, интеграции, нефункциональные требования, критерии приёмки; сопровождает разработку.' },
      { term: 'Архитектор и тимлид', simple: 'Решают, как устроена система, и ведут разработчиков. У нас обе роли у Глеба.', tech: 'Архитектор выбирает структуру системы и технологии под требования; тимлид оценивает и распределяет задачи, отвечает за качество кода.' },
      { term: 'UX/UI-дизайнер', simple: 'Придумывает, как человек пользуется системой, и рисует экраны.', tech: 'UX (user experience) — пути и удобство, UI (user interface) — внешний вид экранов. Результат — макеты и прототипы, например в Figma.' },
      { term: 'Фронтенд, бэкенд, мобильная разработка', simple: 'Что видит человек в браузере, что происходит на сервере и что у него в телефоне.', tech: 'Фронтенд — веб-интерфейс; бэкенд — серверная логика, данные, API, интеграции; мобильная разработка — приложения для iOS и Android.' },
      { term: 'QA (тестирование)', simple: 'Проверяет, что сделано то, что нужно, и ничего не сломалось.', tech: 'Quality Assurance — обеспечение качества: тест-кейсы по критериям приёмки, поиск дефектов, регресс.' },
      { term: 'DevOps', simple: 'Следит, чтобы система была развёрнута и работала, и выкатывает новые версии.', tech: 'Практики и роль на стыке разработки и эксплуатации: автоматическая сборка и выкатка, серверы, мониторинг, резервные копии.' },
      { term: 'RACI', simple: 'Табличка: кто делает, кто отвечает, с кем советуются, кого предупреждают.', tech: 'Матрица ответственности: R — Responsible (исполнитель), A — Accountable (отвечает, ровно один), C — Consulted (консультирует до), I — Informed (информируется после).' },
      { term: 'Jira и Confluence', simple: 'Jira — список задач с их статусами, Confluence — общая вики с требованиями и решениями.', tech: 'Системы Atlassian: трекер задач и база знаний. В России часто используют аналоги (YouTrack, Kaiten, «Яндекс Трекер», Wiki.js и др.) — принцип тот же.' },
      { term: 'Эксперт предметной области', simple: 'Человек, который знает, как работа устроена на самом деле. У нас — Марина Олеговна, Сергей Петрович, Ольга Викторовна.', tech: 'Subject Matter Expert (SME) — источник бизнес-правил и исключений; ключевой пользователь на приёмке.' }
    ],
    outro: 'Теперь вы знаете команду в лицо. Аналитик — не начальник и не секретарь: он связывает три вопроса — «что и зачем» (Тимур Рашидович), «как» (команда) и «когда и за сколько» (Артём) — и приносит каждому то, без чего тот будет додумывать за бизнес. И помните лабораторию про фото: любой спор сначала раскладывают на «что» и «как», а решение записывают. В пятницу решаем, как будем работать: по ТЗ водопадом или спринтами — Тимур Рашидович уже спрашивал.',
    tasks: [howRoles, howBaSa, howRaci, taskWhom, taskDay, taskRaci, taskPhoto, taskExplain]
  });
})();
