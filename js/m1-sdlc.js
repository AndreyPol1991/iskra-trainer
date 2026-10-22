/* Модуль 1, занятие 1: как устроена разработка программного обеспечения.
   Теория: how-cycle — семь этапов жизненного цикла (вход, выход, кто ведёт, что делает аналитик) на «Искре» и на
   ремонте квартиры, названия этапов в ГОСТ 34.601 и ISO/IEC/IEEE 12207; how-timeline — лента проекта «Искра Онлайн»
   с ноября по апрель: «по учебнику» и «как будет у нас» (итерации), артефакты и работа аналитика по месяцам;
   how-cost — цена ошибки растёт по этапам (1–10–100, Боэм) и MVP с итерациями как способ ловить ошибки раньше.
   Практика: кик-офф — разметка письма Тимура Рашидовича и вопросы Артёму (открывают факты F-net, F-calls, F-noshow,
   F-idle, F-goal, F-deadline, F-scope); порядок этапов и артефакты; аналитик на каждом этапе; лаборатория «где поймают
   ошибку со слотом» (решение → последствие); ответ Тимуру «зачем анализ, давайте сразу программировать». */
'use strict';
(function () {
  const TR = window.TR, ui = TR.ui, esc = TR.esc;
  const ID = 'm1-sdlc';

  if (!document.getElementById('msd-css')) document.head.insertAdjacentHTML('beforeend', `<style id="msd-css">
    .msd-root, .msd-root .stack > * { min-width: 0; }
    .msd-root details.more > div { grid-template-columns: minmax(0, 1fr); }
    .msd-root details.more > div > * { min-width: 0; }
    .msd-root .seg button { white-space: normal; text-align: left; }
    .msd-steps { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 6px; }
    .msd-step { position: relative; text-align: left; border: 1px solid var(--border-strong); border-radius: 10px; padding: 8px 6px 9px; background: var(--surface-2); display: grid; gap: 2px; align-content: start; min-width: 0; color: var(--text); }
    .msd-step .n { font: 600 10.5px/1 var(--f-mono); color: var(--text-muted); }
    .msd-step b { font: 600 12.5px/1.25 var(--f-brand); hyphens: auto; -webkit-hyphens: auto; }
    .msd-step[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); box-shadow: 0 0 0 1px var(--accent) inset; }
    .msd-step[aria-pressed="true"] .n { color: var(--accent); }
    .msd-sa { height: 5px; border-radius: 5px; background: var(--surface-3); overflow: hidden; margin-top: 4px; }
    .msd-sa i { display: block; height: 100%; background: var(--violet); }
    .msd-def { display: grid; grid-template-columns: 170px minmax(0, 1fr); gap: 6px 14px; font-size: 14px; }
    .msd-def > .k { font: 600 11px/1.5 var(--f-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--text-muted); padding-top: 2px; }
    .msd-def > .v { min-width: 0; }
    .msd-def ul { margin: 0; padding-left: 18px; display: grid; gap: 2px; }
    .msd-gantt { display: grid; grid-template-columns: 150px repeat(12, minmax(0, 1fr)); grid-template-rows: auto repeat(7, minmax(24px, auto)); gap: 4px 0; align-items: center; padding: 12px; border: 1px solid var(--border); border-radius: 12px; background: var(--code-bg); position: relative; min-width: 0; }
    .msd-gantt .lbl { font-size: 12.5px; color: var(--text-2); padding-right: 8px; min-width: 0; overflow-wrap: anywhere; line-height: 1.2; }
    .msd-gantt .mh { font: 600 10.5px/1.2 var(--f-mono); color: var(--text-muted); text-align: center; text-transform: uppercase; letter-spacing: .04em; padding-bottom: 4px; border: 0; background: none; cursor: pointer; border-radius: 6px; }
    .msd-gantt .mh[aria-pressed="true"] { color: var(--accent); background: var(--accent-soft); }
    .msd-gantt .bar { height: 18px; border-radius: 5px; background: color-mix(in srgb, var(--accent) 55%, var(--surface-3)); min-width: 0; }
    .msd-gantt .bar.sa { background: color-mix(in srgb, var(--violet) 55%, var(--surface-3)); }
    .msd-gantt .bar.late { background: repeating-linear-gradient(135deg, var(--bad) 0 6px, color-mix(in srgb, var(--bad) 50%, var(--surface-3)) 6px 12px); }
    .msd-gantt .cur { grid-row: 1 / -1; background: color-mix(in srgb, var(--accent) 9%, transparent); border-radius: 6px; align-self: stretch; z-index: 0; }
    .msd-gantt > * { z-index: 1; }
    .msd-gantt .dl { grid-row: 2 / -1; border-left: 2px dashed var(--bad); align-self: stretch; z-index: 2; position: relative; }
    .msd-legend { display: flex; flex-wrap: wrap; gap: 6px 14px; font-size: 12.5px; color: var(--text-muted); }
    .msd-legend i { display: inline-block; width: 18px; height: 8px; border-radius: 3px; margin-right: 6px; vertical-align: middle; }
    .msd-c2 { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
    .msd-c2 .card { align-content: start; }
    .msd-bars { display: grid; gap: 6px; }
    .msd-brow { display: grid; grid-template-columns: 170px minmax(0, 1fr) 54px; gap: 10px; align-items: center; text-align: left; border: 1px solid var(--border); border-radius: 10px; padding: 6px 10px; background: var(--surface); color: var(--text); width: 100%; }
    .msd-brow[aria-pressed="true"] { border-color: var(--accent); box-shadow: 0 0 0 1px var(--accent) inset; }
    .msd-brow .t { font-size: 13px; line-height: 1.25; }
    .msd-brow .track { height: 14px; border-radius: 4px; background: var(--surface-3); overflow: hidden; }
    .msd-brow .track i { display: block; height: 100%; background: var(--accent); border-radius: 4px; transition: width .3s; }
    .msd-brow .track i.off { background: var(--border-strong); }
    .msd-brow .x { font: 600 13px/1 var(--f-mono); text-align: right; }
    .msd-letter { border: 1px solid var(--border-strong); border-radius: 12px; background: var(--surface); overflow: hidden; }
    .msd-letter .hd { display: grid; gap: 2px; padding: 10px 14px; border-bottom: 1px solid var(--border); background: var(--surface-2); font-size: 13px; color: var(--text-2); }
    .msd-letter .hd b { color: var(--text); }
    .msd-letter .bd { padding: 12px 14px 16px; line-height: 1.75; font-size: 14.5px; }
    .msd-frag { display: inline; border: 0; padding: 1px 2px; margin: 0 1px; border-radius: 4px; background: none; color: var(--text); text-align: left; line-height: inherit; font-size: inherit; cursor: pointer; border-bottom: 1px dashed var(--border-strong); box-decoration-break: clone; -webkit-box-decoration-break: clone; }
    .msd-frag:hover:not(:disabled) { background: var(--surface-3); }
    .msd-frag[aria-pressed="true"] { background: color-mix(in srgb, var(--warn) 30%, transparent); border-bottom-color: var(--warn); }
    .msd-frag.ok { background: var(--ok-soft); border-bottom: 2px solid var(--ok); }
    .msd-frag.bad { background: var(--bad-soft); border-bottom: 2px solid var(--bad); }
    .msd-frag.sig { background: var(--info-soft); border-bottom: 2px solid var(--info); }
    .msd-frag:disabled { cursor: default; opacity: 1; }
    .msd-nb { display: grid; gap: 6px; }
    .msd-nb .it { font-size: 13.5px; padding: 6px 10px; border-radius: 8px; border: 1px solid var(--border); background: var(--surface-2); }
    .msd-nb .it.flag::before { content: "⚑ "; color: var(--warn); }
    .msd-nb .it.miss { border-style: dashed; color: var(--text-muted); }
    .msd-qs { display: grid; gap: 6px; }
    .msd-q { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 8px; align-items: center; text-align: left; border: 1px solid var(--border); border-radius: 10px; padding: 8px 12px; background: var(--surface); color: var(--text); width: 100%; font-size: 14px; line-height: 1.35; }
    .msd-q:hover:not(:disabled) { border-color: var(--text-muted); }
    .msd-q .m { font: 600 12px/1 var(--f-mono); color: var(--text-muted); white-space: nowrap; }
    .msd-q.asked { opacity: .55; }
    .msd-q.ok { border-color: var(--ok); } .msd-q.bad { border-color: var(--bad); }
    .msd-clock { display: flex; align-items: center; gap: 10px; }
    .msd-clock .meter { flex: 1; }
    .msd-log { display: grid; gap: 10px; }
    .msd-role { display: grid; gap: 8px; padding: 12px; border: 1px solid var(--border); border-radius: 12px; background: var(--surface); }
    .msd-role.ok { border-color: var(--ok); } .msd-role.bad { border-color: var(--bad); } .msd-role.warn { border-color: var(--warn); }
    .msd-role h4 { font: 600 15px/1.3 var(--f-brand); }
    .msd-opt { text-align: left; white-space: normal; justify-content: flex-start; font-weight: 500; line-height: 1.4; width: 100%; }
    .msd-chk { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; gap: 10px; align-items: center; text-align: left; border: 1px solid var(--border); border-radius: 10px; padding: 9px 12px; background: var(--surface); color: var(--text); width: 100%; }
    .msd-chk .box { width: 18px; height: 18px; border-radius: 5px; border: 1.5px solid var(--border-strong); }
    .msd-chk[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); }
    .msd-chk[aria-pressed="true"] .box { background: var(--accent); border-color: var(--accent); box-shadow: inset 0 0 0 3px var(--surface); }
    .msd-chk .h { font: 600 12px/1 var(--f-mono); color: var(--text-2); white-space: nowrap; }
    .msd-chk .st { display: block; font: 600 10.5px/1.3 var(--f-mono); letter-spacing: .06em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 2px; }
    .msd-chk .rs { display: block; font-size: 12.5px; color: var(--text-2); margin-top: 4px; }
    .msd-chk.hit { border-color: var(--ok); } .msd-chk.miss { border-color: color-mix(in srgb, var(--warn) 60%, var(--border)); }
    .msd-tl { display: grid; gap: 8px; }
    .msd-ev { display: grid; grid-template-columns: 110px minmax(0, 1fr); gap: 10px; padding: 10px 12px; border-radius: 10px; border: 1px solid var(--border); background: var(--surface); }
    .msd-ev .d { font: 600 12px/1.35 var(--f-mono); color: var(--text-muted); }
    .msd-ev.ok { border-color: color-mix(in srgb, var(--ok) 55%, var(--border)); }
    .msd-ev.bad { border-color: color-mix(in srgb, var(--bad) 55%, var(--border)); background: color-mix(in srgb, var(--bad-soft) 60%, var(--surface)); }
    .msd-ev.warn { border-color: color-mix(in srgb, var(--warn) 55%, var(--border)); }
    .msd-stats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
    .msd-stats .stat .v { font-size: 16px; }
    .msd-road { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 4px; padding: 10px; border: 1px solid var(--border); border-radius: 12px; background: var(--code-bg); }
    .msd-road .m { text-align: center; font: 600 10.5px/1.2 var(--f-mono); color: var(--text-muted); text-transform: uppercase; }
    .msd-road .c { min-height: 46px; border-radius: 8px; background: var(--surface-2); display: flex; flex-wrap: wrap; gap: 3px; align-content: center; justify-content: center; padding: 4px; }
    .msd-road .dot { width: 12px; height: 12px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 8px var(--accent-glow); }
    .msd-road .dot.bug { background: var(--bad); }
    @media (max-width: 860px) {
      .msd-steps { grid-template-columns: repeat(4, minmax(0, 1fr)); }
    }
    @media (max-width: 760px) {
      .msd-def { grid-template-columns: minmax(0, 1fr); gap: 2px; }
      .msd-def > .v { margin-bottom: 8px; }
      .msd-c2 { grid-template-columns: minmax(0, 1fr); }
      .msd-brow { grid-template-columns: minmax(0, 1fr) 48px; }
      .msd-brow .track { grid-column: 1 / -1; grid-row: 2; }
      .msd-gantt { grid-template-columns: 84px repeat(12, minmax(0, 1fr)); padding: 10px 8px; }
      .msd-gantt .lbl { font-size: 11px; }
    }
    @media (max-width: 460px) {
      .msd-steps { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .msd-ev { grid-template-columns: minmax(0, 1fr); gap: 2px; }
      .msd-stats { grid-template-columns: minmax(0, 1fr); }
      .msd-chk { grid-template-columns: auto minmax(0, 1fr); }
      .msd-chk .h { grid-column: 2; }
      .msd-gantt .mh { font-size: 9px; letter-spacing: 0; }
    }
  </style>`);

  // ---------- общие помощники ----------
  const quizRef = cfg => cfg.options.map((o, i) => o.ok ? i : -1).filter(i => i >= 0);
  const fresh = fn => pane => { const d = document.createElement('div'); pane.appendChild(d); fn(d); };
  const plainT = s => String(s || '').replace(/<[^>]+>/g, '');

  // =====================================================================
  // Этапы жизненного цикла — общие данные теории и практики
  // =====================================================================
  const STAGES = [
    { id: 'init', t: 'Инициация', sa: 0.5, lead: 'Заказчик и руководитель проекта',
      goal: 'Понять, зачем проект, стоит ли он денег и что в него входит.',
      iskra: { in: 'Боль Тимура Рашидовича: теряются звонки, неявки, машины стоят на подъёмниках.', out: 'Письмо и протокол кик-оффа, цели в цифрах, рамки проекта, договор со сроком (MVP к 15 марта).', sa: 'Помогает превратить жалобы в измеримые цели, задаёт уточняющие вопросы, фиксирует, что входит в проект и что нет.' },
      flat: { in: '«Хочу кухню побольше, чтобы не было тесно».', out: 'Смета, срок, договор с бригадой: кухня-гостиная, 3 месяца, бюджет.', sa: 'Прораб выясняет, что значит «не тесно»: сколько человек готовят и едят одновременно.' } },
    { id: 'req', t: 'Анализ требований', sa: 1, lead: 'Аналитик',
      goal: 'Выяснить и записать, что именно должна делать система, по каким правилам и для кого.',
      iskra: { in: 'Цели и рамки, доступ к людям «Искры»: Марине Олеговне, Сергею Петровичу, Ольге Викторовне.', out: 'Спецификация требований: пользовательские истории и сценарии, бизнес-правила BR-1…BR-16, нефункциональные требования, схемы процессов.', sa: 'Ведёт этап: интервью, наблюдение на станции, моделирование процессов, требования и критерии приёмки, согласование.' },
      flat: { in: 'Договор и пожелания хозяев.', out: 'Обмерный план и техническое задание: где плита, мойка, холодильник, сколько розеток и где.', sa: 'Это и есть «аналитика ремонта»: каждое «хочу» превращается в точку на плане.' } },
    { id: 'design', t: 'Проектирование', sa: 0.6, lead: 'Архитектор или тимлид, дизайнер',
      goal: 'Решить, как будет устроена система, чтобы выполнить требования: архитектура, экраны, данные, обмен с внешними системами.',
      iskra: { in: 'Спецификация требований.', out: 'Схема компонентов, макеты Ники в Figma, модель данных (ERD), описание API и интеграций с 1С, ЮKassa, SMS.', sa: 'Проверяет, что макеты и архитектура покрывают все сценарии и правила; описывает данные и обмен с внешними системами.' },
      flat: { in: 'Техническое задание.', out: 'Дизайн-проект: планировка, чертежи электрики и сантехники, подбор материалов.', sa: 'Сверяет: в чертеже электрики учтены все розетки из задания?' } },
    { id: 'dev', t: 'Разработка', sa: 0.5, lead: 'Разработчики',
      goal: 'Написать код и собрать работающую систему по требованиям и проекту.',
      iskra: { in: 'Требования, макеты, архитектура, описание API.', out: 'Код сервисов, приложения клиента, АРМ и планшета; сборки для тестирования.', sa: 'Отвечает на вопросы Глеба и Даши в задачах, уточняет детали у «Искры», проводит изменения через новую версию требования.' },
      flat: { in: 'Дизайн-проект и чертежи.', out: 'Штробы, проводка, трубы, стены, плитка.', sa: 'Электрик звонит: «Тут балка, розетку на 20 см левее можно?» — кто-то должен ответить по существу.' } },
    { id: 'test', t: 'Тестирование', sa: 0.5, lead: 'Тестировщик (QA)',
      goal: 'Проверить, что система делает то, что требуется, и найти дефекты до того, как их найдут клиенты.',
      iskra: { in: 'Сборка, требования, критерии приёмки.', out: 'Тест-кейсы, отчёты о дефектах, решение «готово к выпуску».', sa: 'Помогает Лизе с критериями приёмки, разбирает спорные случаи «ошибка или так задумано».' },
      flat: { in: 'Готовая кухня.', out: 'Акт приёмки и список недоделок.', sa: 'Проверяют по заданию: все розетки работают, плитка ровная, вода не течёт.' } },
    { id: 'deploy', t: 'Внедрение', sa: 0.6, lead: 'Руководитель проекта, DevOps-инженер (отвечает за серверы и выпуск версий)',
      goal: 'Запустить систему в работу: выпустить версию, перенести данные, научить людей.',
      iskra: { in: 'Проверенная версия.', out: 'Релиз в App Store и Google Play, перенос 31 000 клиентов из Excel, инструкции и обучение мастеров, пилот на станции Победы.', sa: 'Готовит перенос данных (дубли телефонов +7 и 8!), инструкции и обучение, разбирает замечания пилота.' },
      flat: { in: 'Принятая кухня.', out: 'Переезд, расставленная мебель, инструкции к технике.', sa: 'Объяснить хозяевам, как работает индукционная плита, — иначе завтра звонок «она не греет».' } },
    { id: 'ops', t: 'Эксплуатация и сопровождение', sa: 0.4, lead: 'Поддержка и команда развития',
      goal: 'Система работает каждый день; её чинят, улучшают и развивают по новым запросам.',
      iskra: { in: 'Работающая система, обращения сотрудников и клиентов, метрики.', out: 'Исправления, запросы на изменение, новые версии (бонусы, шиномонтаж с хранением шин).', sa: 'Разбирает обращения и метрики: дошли ли до 5 % потерянных обращений, 8 % неявок, 20 минут согласования; оформляет запросы на изменение.' },
      flat: { in: 'Кухня, в которой готовят каждый день.', out: 'Гарантийный ремонт, «а давайте ещё полку».', sa: 'Новая полка — это уже новый маленький цикл: замер, план, работа, проверка.' } }
  ];
  const ST = id => STAGES.find(s => s.id === id);

  // =====================================================================
  // Теория 1. Жизненный цикл: семь этапов
  // =====================================================================
  const howCycle = {
    id: 'how-cycle', covers: ['kickoff', 'stages'], title: 'Как это работает: жизненный цикл разработки', free: true, noReset: true,
    simple: {
      icon: '🔁',
      plain: 'Любая система проходит одни и те же этапы: зачем → что → как → сделать → проверить → запустить → жить и развиваться. Выход одного этапа — вход следующего.',
      analogy: 'Ремонт кухни: «хочу просторнее» → замер и задание → дизайн-проект → стройка → приёмка → переезд → гарантийный ремонт и новая полка. Пропустите замер — и холодильник не встанет в нишу.',
      tech: '<b>Жизненный цикл разработки ПО</b> (Software Development Life Cycle, SDLC) — последовательность этапов от идеи до вывода из эксплуатации. Стандарты: ISO/IEC/IEEE 12207 (в России — ГОСТ Р ИСО/МЭК 12207-2010) описывает процессы жизненного цикла программ; ГОСТ 34.601-90 — стадии создания автоматизированных систем (до сих пор встречается в госзаказе). Названия этапов в компаниях разные, суть одна.'
    },
    lead: ui.brief({
      situation: 'Вторник, утро. Вчера был кик-офф, сегодня Артём хочет план. Вера рисует на доске семь прямоугольников: «Через это пройдёт „Искра Онлайн“ до 15 марта и после. Давайте поймём, что на каждом этапе получается и где в нём мы».',
      todo: [
        'Нажимайте этапы по очереди и читайте карточку: цель, что на входе, что на выходе, кто ведёт и что делает аналитик.',
        'Переключите пример на «Ремонт кухни» и сравните: этапы те же, меняются только артефакты.',
        'Откройте блок «Как это называют в стандартах» — пригодится на собеседовании.'
      ],
      look: 'Фиолетовая полоска под названием этапа — насколько аналитик там занят. Полная — он ведёт этап.'
    }),
    render(el) {
      el.classList.add('msd-root');
      let cur = 'init', ex = 'iskra';
      el.innerHTML = `<div class="stack">
        <div class="row"><span class="small dim">Пример:</span>${ui.seg('ex', [{ v: 'iskra', t: '🔧 «Искра Онлайн»' }, { v: 'flat', t: '🏠 Ремонт кухни' }], ex, 'accent')}</div>
        <div class="msd-steps" data-st lang="ru"></div>
        <div data-card></div>
        ${ui.note('info', 'Цикл замыкается', 'Последний этап не конец: из эксплуатации приходят обращения и новые идеи — шиномонтаж с хранением шин, бонусы. Каждая такая идея снова проходит инициацию, анализ, проектирование… Поэтому и говорят «жизненный <b>цикл</b>», а не «жизненная линия».')}
        <details class="more"><summary>Как это называют в стандартах</summary><div>
          ${ui.table(['Учебные этапы', 'ГОСТ 34.601-90 (стадии создания АС)', 'Как говорят в командах'], [
            ['Инициация', 'Формирование требований к АС (обследование), разработка концепции', 'Discovery, предпроект, кик-офф'],
            ['Анализ требований', 'Техническое задание', 'Аналитика, сбор требований, бэклог'],
            ['Проектирование', 'Эскизный и технический проект', 'Архитектура, дизайн, макеты'],
            ['Разработка', 'Рабочая документация (и изготовление)', 'Разработка, спринты'],
            ['Тестирование', 'Предварительные испытания, опытная эксплуатация', 'QA, тестирование, приёмка'],
            ['Внедрение', 'Ввод в действие, приёмочные испытания', 'Релиз, запуск, пилот'],
            ['Эксплуатация и сопровождение', 'Сопровождение АС', 'Поддержка, развитие, сопровождение']
          ])}
          <p class="small muted">Соответствие примерное: в ГОСТ 34 стадии крупнее и сопровождаются обязательными документами. На собеседовании достаточно назвать этапы, сказать, что на выходе каждого, и показать, где работает аналитик. Плюсом будет упомянуть, что в гибких подходах этапы не идут строго друг за другом, а повторяются короткими циклами.</p>
        </div></details>
      </div>`;
      function draw() {
        TR.$('[data-st]', el).innerHTML = STAGES.map((s, i) => `<button type="button" class="msd-step" data-s="${s.id}" aria-pressed="${s.id === cur}"><span class="n">${i + 1}${i < STAGES.length - 1 ? ' →' : ' ↺'}</span><b>${esc(s.t)}</b><span class="msd-sa" title="Занятость аналитика"><i style="width:${s.sa * 100}%"></i></span></button>`).join('');
        const s = ST(cur), x = s[ex];
        TR.$('[data-card]', el).innerHTML = `<div class="card flat"><h4>${STAGES.indexOf(s) + 1}. ${esc(s.t)}</h4><div class="msd-def">
          <span class="k">Цель</span><div class="v">${s.goal}</div>
          <span class="k">На входе</span><div class="v">${x.in}</div>
          <span class="k">На выходе</span><div class="v">${x.out}</div>
          <span class="k">Кто ведёт</span><div class="v">${ex === 'iskra' ? s.lead : '—'}</div>
          <span class="k">${ex === 'iskra' ? 'Аналитик' : 'Аналог работы аналитика'}</span><div class="v">${x.sa}</div>
        </div></div>`;
      }
      ui.onSeg(el, (n, v) => { if (n === 'ex') { ex = v; draw(); } });
      TR.on(el, 'click', '[data-s]', (e, b) => { cur = b.dataset.s; draw(); });
      draw();
    }
  };

  // =====================================================================
  // Теория 2. Лента проекта «Искра Онлайн»: по учебнику и как будет у нас
  // =====================================================================
  const MONTHS = [{ v: 0, t: 'Ноя' }, { v: 1, t: 'Дек' }, { v: 2, t: 'Янв' }, { v: 3, t: 'Фев' }, { v: 4, t: 'Мар' }, { v: 5, t: 'Апр' }];
  // полумесяцы: 0 — первая половина ноября … 11 — вторая половина апреля; 15 марта — граница 8 и 9
  const BARS = {
    book: { init: [0, 0], req: [0, 3], design: [4, 4], dev: [5, 7], test: [8, 8], deploy: [9, 9], ops: [10, 11] },
    life: { init: [0, 0], req: [0, 7], design: [1, 7], dev: [1, 8], test: [1, 8], deploy: [8, 8], ops: [9, 11] }
  };
  const MONTH_TXT = {
    life: [
      { what: 'Кик-офф 2 ноября, письмо Тимура, цели и рамки. С 16 ноября — первый спринт: в разработку идут первые готовые истории про запись.', sa: 'Разбирает письмо и задаёт вопросы, пишет первые истории с критериями приёмки, готовит груминг, отвечает Лизе на вопросы к требованиям.', art: 'Протокол кик-оффа, факты и цели в блокноте, бэклог с первыми историями.', tr: 'Как устроена разработка · Команда · Подходы · Работа с разработчиками · Работа с QA' },
      { what: 'Интервью на станции Победы, требования к записи и доп. работам, путь клиента, макеты, процессы «как есть» и «как будет». Каждые две недели — показ готового Марине Олеговне.', sa: 'Ведёт интервью, пишет требования и нефункциональные требования, вместе с Артёмом и Тимуром решает, что входит в MVP, рисует карту пути клиента (CJM) и схемы процессов (BPMN), проверяет макеты.', art: 'Протокол интервью, истории и сценарии, нефункциональные требования, список MVP, CJM, макеты Ники, BPMN.', tr: 'Виды требований · User Story и Use Case · НФТ · Работа с требованиями · Работа с бизнесом · Приоритизация · CJM · Figma · BPMN' },
      { what: 'Оплата, архитектура и данные: как приложение говорит с ЮKassa, из каких компонентов система, как хранятся записи и доп. работы.', sa: 'Рисует диаграммы последовательности и компонентов, модель данных, пишет словарь данных.', art: 'Диаграмма последовательности оплаты, схема компонентов, модель данных (ERD), словарь данных.', tr: 'UML Sequence · UML Component · Основы БД · ERD · Проектирование данных · Data Dictionary' },
      { what: 'Доделываем MVP и тестируем всё вместе. Готовим перенос 31 000 клиентов из Excel.', sa: 'Проверяет данные SQL-запросами, готовит план переноса и чистки дублей, отвечает разработчикам, участвует в приёмке.', art: 'SQL-проверки, план переноса данных, отчёты о дефектах, инструкции для мастеров.', tr: 'SQL для аналитика' },
      { what: 'Пилот на станции Победы 1–14 марта, 15 марта — MVP на всех семи станциях.', sa: 'Обучает мастеров, разбирает замечания пилота, следит за переносом данных, собирает первые метрики.', art: 'Релиз, перенесённая база, инструкции, список замечаний пилота.', tr: '' },
      { what: 'Сезон переобувки: поток записей в 3–4 раза больше. Система в эксплуатации.', sa: 'Смотрит метрики — дошли ли до 5 % потерянных обращений, 8 % неявок, 20 минут согласования, — разбирает обращения, оформляет запросы на изменение для следующей версии.', art: 'Отчёт по метрикам, запросы на изменение, бэклог следующей версии.', tr: '' }
    ],
    book: [
      'Только требования. Разработчики ждут и ничего не делают — или их забирают на другой проект.',
      'Всё ещё требования: толстая спецификация на подпись Тимуру. Марина Олеговна видит только текст.',
      'Проектирование, потом разработка. Ни одного работающего экрана ещё никто из «Искры» не видел.',
      'Разработка. Ошибки в требованиях пока никому не видны: код пишут ровно по спецификации.',
      'Тестирование — и первый раз работающую систему видят люди «Искры». Внедрение уезжает за 15 марта.',
      'Сезон начался, а мы ещё внедряем и чиним то, что Марина Олеговна увидела только в марте.'
    ]
  };
  const howTimeline = {
    id: 'how-timeline', covers: ['role'], title: 'Как это работает: лента проекта и аналитик на ней', free: true, noReset: true,
    simple: {
      icon: '🗓️',
      plain: 'На бумаге этапы идут друг за другом. В жизни они накладываются: пока Глеб пишет запись, вы уже выясняете доп. работы, а Лиза проверяет то, что сделали неделю назад. Аналитик нужен на всех этапах — просто по-разному.',
      analogy: 'Ремонт квартиры по комнатам: в спальне уже клеят обои, на кухне кладут плитку, а в ванной ещё только замеряют. Прораб каждый день отвечает на вопросы в каждой комнате.',
      tech: '<b>Последовательная (каскадная) модель</b> — этапы строго друг за другом; результат виден в конце. <b>Итеративная и инкрементная</b> — короткие циклы (итерации, спринты по 2 недели), в каждом — немного анализа, разработки и проверки; работающая часть системы видна рано. Подходы подробно — в тренировке «Подходы к организации разработки». <b>Артефакт</b> — любой результат работы: документ, схема, макет, код, тест.'
    },
    lead: ui.brief({
      situation: 'Артём положил на стол календарь: «Ноябрь — апрель. 15 марта — MVP, 1 апреля — сезон. Покажите, где на этом календаре этапы и чем занят аналитик». Два варианта ленты: «по учебнику», где этапы строго друг за другом, и «как будет у нас» — короткими итерациями.',
      todo: [
        'Переключите режим «По учебнику» — «Как будет у нас» и посмотрите на красную линию 15 марта.',
        'Нажимайте месяцы в шапке ленты и читайте, что происходит, что делает аналитик и какие артефакты появляются.',
        'Заметьте, в каких месяцах курса вы будете тренировать каждую часть работы — подсказка внизу карточки месяца.'
      ],
      look: 'Оранжевые полосы — этапы, фиолетовая — анализ требований. Красная пунктирная линия — 15 марта, срок MVP. Штриховка — этап уехал за срок.'
    }),
    render(el) {
      el.classList.add('msd-root');
      let mode = 'book', m = 0;
      el.innerHTML = `<div class="stack">
        <div class="row"><span class="small dim">Лента:</span>${ui.seg('mode', [{ v: 'book', t: 'По учебнику: этап за этапом' }, { v: 'life', t: 'Как будет у нас: итерации' }], mode, 'accent')}</div>
        <div style="overflow-x:auto"><div class="msd-gantt" data-g></div></div>
        <div class="msd-legend"><span><i style="background:color-mix(in srgb, var(--accent) 55%, var(--surface-3))"></i>этап</span><span><i style="background:color-mix(in srgb, var(--violet) 55%, var(--surface-3))"></i>анализ требований</span><span><i style="background:var(--bad)"></i>после срока</span><span>┆ 15 марта — MVP</span></div>
        <div data-mo></div>
      </div>`;
      function draw() {
        const B = BARS[mode];
        let h = `<span class="lbl" style="grid-row:1;grid-column:1"></span>${MONTHS.map(x => `<button type="button" class="mh" data-m="${x.v}" aria-pressed="${x.v === m}" style="grid-row:1;grid-column:${2 + x.v * 2} / span 2">${x.t}</button>`).join('')}`;
        h += `<span class="cur" style="grid-row:1 / ${STAGES.length + 2};grid-column:${2 + m * 2} / span 2"></span>`;
        STAGES.forEach((s, i) => {
          const [a, b] = B[s.id], late = b >= 9 && s.id !== 'ops';
          h += `<span class="lbl" style="grid-row:${i + 2};grid-column:1">${esc(s.t)}</span><span class="bar ${s.id === 'req' ? 'sa' : ''} ${late ? 'late' : ''}" style="grid-row:${i + 2};grid-column:${2 + a} / ${3 + b}" title="${esc(s.t)}"></span>`;
        });
        h += `<span class="dl" style="grid-column:11;grid-row:2 / ${STAGES.length + 2}" title="15 марта — MVP"></span>`;
        TR.$('[data-g]', el).innerHTML = h;
        const mo = MONTHS[m].t;
        if (mode === 'book') {
          TR.$('[data-mo]', el).innerHTML = ui.note(m >= 4 ? 'bad' : 'warn', `${mo} · по учебнику`, MONTH_TXT.book[m]) + (m === 4 ? ui.note('info', 'Что здесь важно аналитику', 'Строгая последовательность хороша, когда требования известны заранее и почти не меняются: госзаказ, регуляторика, встроенное ПО. У «Искры» требования будут уточняться весь проект, а срок жёсткий. Поэтому «Орбита» работает итерациями — но этапы никуда не деваются: в каждой итерации есть свой маленький анализ, проектирование, разработка и проверка.') : '');
        } else {
          const x = MONTH_TXT.life[m];
          TR.$('[data-mo]', el).innerHTML = `<div class="card flat"><h4>${mo} · как будет у нас</h4><div class="msd-def">
            <span class="k">Что происходит</span><div class="v">${x.what}</div>
            <span class="k">Аналитик</span><div class="v">${x.sa}</div>
            <span class="k">Артефакты</span><div class="v">${x.art}</div>
            ${x.tr ? `<span class="k">Тренировки курса</span><div class="v small muted">${x.tr}</div>` : ''}
          </div></div>`;
        }
      }
      ui.onSeg(el, (n, v) => { if (n === 'mode') { mode = v; draw(); } });
      TR.on(el, 'click', '[data-m]', (e, b) => { m = +b.dataset.m; draw(); });
      draw();
    }
  };

  // =====================================================================
  // Теория 3. Цена ошибки и MVP
  // =====================================================================
  const FLAT = [
    { t: 'Замер и план', x: 1, d: 'Розетку для холодильника нарисовали не в той стене. Заметили на плане — перенесли крестик: 5 минут.' },
    { t: 'Дизайн-проект', x: 3, d: 'Заметили на чертеже электрики: перерисовать лист и согласовать с дизайнером — час.' },
    { t: 'Штробы и проводка', x: 10, d: 'Кабель уже в стене: новая штроба, перекладка кабеля, заделать старую — день работы электрика.' },
    { t: 'Штукатурка и плитка', x: 30, d: 'Сбить плитку, новая штроба, снова плитка — а этой плитки уже нет в продаже. Неделя и новая закупка.' },
    { t: 'После переезда', x: 100, d: 'Холодильник уже стоит, и тянется удлинитель через всю кухню — навсегда. Или переделывать кухню заново.' }
  ];
  const howCost = {
    id: 'how-cost', covers: ['lab', 'timur'], title: 'Как это работает: цена ошибки растёт, MVP помогает поймать её раньше', free: true, noReset: true,
    simple: {
      icon: '📈',
      plain: 'Чем позже нашли ошибку, тем больше уже построено поверх неё — и тем больше приходится переделывать. Ошибку в требованиях дешевле всего поймать на бумаге, дороже всего — у клиентов.',
      analogy: 'Розетка не в той стене: на плане — перенести крестик, после плитки — сбивать плитку, после переезда — удлинитель через всю кухню.',
      tech: 'Эмпирическое наблюдение Барри Боэма («Software Engineering Economics», 1981) и последующих исследований: дефект требований, найденный в эксплуатации, обходится в десятки–сотни раз дороже, чем найденный на анализе. Его часто пересказывают как «правило 1–10–100». В обзоре Boehm, Basili «Software Defect Reduction Top 10 List» (2001) это звучит осторожнее: в крупных системах разница часто около 100 раз, в небольших — около 5 раз. Это <b>ориентир для разговора, а не точный закон</b>. <b>MVP</b> (Minimum Viable Product, минимально жизнеспособный продукт — Эрик Рис, «Бизнес с нуля») — самая маленькая версия, которая уже решает главную задачу и даёт настоящую обратную связь.'
    },
    lead: ui.brief({
      situation: 'Тимур Рашидович торопит: «Давайте сразу программировать». Прежде чем отвечать ему, разберитесь сами, почему ранние этапы экономят деньги и как итерации помогают увидеть ошибку до сезона.',
      todo: [
        'Вкладка «1 — 10 — 100»: нажимайте этапы ремонта по очереди и смотрите, как растёт цена одной и той же ошибки. Переключите шкалу.',
        'Вкладка «MVP и итерации»: сравните «всё сразу к 15 марта» и «MVP и показы каждые две недели» — когда «Искра» впервые увидит работающую запись.',
        'Откройте «Насколько верить числам» — чтобы не повторять миф на собеседовании.'
      ],
      look: 'Числа у столбиков — условная цена исправления, если на плане она равна 1. Это иллюстрация, а не замер.'
    }),
    render(el) {
      el.classList.add('msd-root');
      const t = document.createElement('div'); el.appendChild(t);
      ui.tabs(t, [
        { id: 'cost', t: '1 — 10 — 100', render: fresh(drawCost) },
        { id: 'mvp', t: 'MVP и итерации', render: fresh(drawMvp) }
      ], 'cost');
    }
  };
  function drawCost(pane) {
    let i = 0, scale = 'lin';
    pane.innerHTML = `<div class="stack">
      <div class="row"><span class="small dim">Шкала:</span>${ui.seg('sc', [{ v: 'lin', t: 'обычная' }, { v: 'log', t: 'логарифмическая' }], scale)}</div>
      <div class="msd-bars" data-b></div>
      <div data-d></div>
      <details class="more"><summary>Насколько верить числам 1 — 10 — 100</summary><div>
        <p class="small">Барри Боэм в 1981 году собрал данные крупных проектов и показал: чем позже найден дефект требований, тем дороже исправление — вплоть до сотни раз. Позже Боэм и Базили (2001) уточнили: для больших систем «около 100 раз» встречается часто, а в небольших проектах с короткими итерациями разница бывает около 5 раз. Исследователи спорят о точных множителях, но не о направлении: цена растёт.</p>
        <p class="small">Как говорить на собеседовании: «Цена исправления ошибки растёт с каждым этапом, потому что поверх неё уже построены макеты, код, тесты и данные. Точные множители зависят от проекта, поэтому важнее не число, а практика: ревью требований, прототипы, короткие итерации и раннее тестирование». Это звучит сильнее, чем «ошибка стоит в 100 раз дороже — закон».</p>
      </div></details>
    </div>`;
    function draw() {
      const mx = scale === 'lin' ? 100 : Math.log10(101);
      TR.$('[data-b]', pane).innerHTML = FLAT.map((f, k) => {
        const w = scale === 'lin' ? f.x / mx : Math.log10(f.x + 1) / mx;
        return `<button type="button" class="msd-brow" data-i="${k}" aria-pressed="${k === i}"><span class="t">${k + 1}. ${esc(f.t)}</span><span class="track"><i class="${k <= i ? '' : 'off'}" style="width:${Math.max(2, Math.round(w * 100))}%"></i></span><span class="x">×${f.x}</span></button>`;
      }).join('');
      const f = FLAT[i];
      TR.$('[data-d]', pane).innerHTML = ui.note(i <= 1 ? 'ok' : i <= 2 ? 'warn' : 'bad', `Заметили на этапе «${f.t}»`, f.d) + (i === FLAT.length - 1 ? ui.note('info', 'Что здесь важно аналитику', 'У «Искры» та же логика. Правило «запись — один слот 30 минут» на ревью требований исправляется одной строкой. В сезон — это переписанный расчёт слотов, перенос сотен записей и злые клиенты на семи станциях. Поэтому аналитик ищет ошибки как можно раньше: ревью с людьми, которые знают работу, прототипы, вопросы «а если…». В лаборатории ниже вы проверите это на практике.') : '');
    }
    ui.onSeg(pane, (n, v) => { if (n === 'sc') { scale = v; draw(); } });
    TR.on(pane, 'click', '[data-i]', (e, b) => { i = +b.dataset.i; draw(); });
    draw();
  }
  function drawMvp(pane) {
    let mode = 'big';
    pane.innerHTML = `<div class="stack">
      <div class="row"><span class="small dim">Как делаем:</span>${ui.seg('mv', [{ v: 'big', t: 'Всё сразу к 15 марта' }, { v: 'mvp', t: 'MVP и показ каждые 2 недели' }], mode, 'accent')}</div>
      <div data-r></div><div data-t></div>
      <div class="msd-c2">
        <div class="card"><b>MVP — это…</b><span class="small">самая маленькая версия, которая уже решает главную задачу и работает по-настоящему. Например: клиент записывается онлайн, получает напоминание, согласует доп. работы по фото. Бонусы и кабинет компании — следующими версиями.</span><span class="small muted">Образ Хенрика Книберга: сначала самокат, потом велосипед, потом машина — каждый уже везёт человека.</span></div>
        <div class="card"><b>MVP — это не…</b><span class="small">«сырая версия всего сразу» и не «колесо от будущей машины». Половина кнопок, которые ничего не делают, не даёт обратной связи: на колесе никуда не уедешь.</span><span class="small muted">Что войдёт в MVP «Искры» — решим в тренировке «Приоритизация и ценность фичи».</span></div>
      </div>
    </div>`;
    function draw() {
      const big = mode === 'big';
      const cells = MONTHS.map(x => {
        let d = '';
        if (big) d = x.v === 4 ? '<span class="dot" title="Первый показ работающей системы"></span><span class="dot bug" title="Ошибку со слотом замечают здесь"></span>' : '';
        else d = (x.v <= 3 ? '<span class="dot" title="Показ"></span><span class="dot" title="Показ"></span>' : x.v === 4 ? '<span class="dot" title="Пилот"></span>' : '') + (x.v === 1 ? '<span class="dot bug" title="Ошибку со слотом замечают здесь"></span>' : '');
        return `<div class="stack tight"><span class="m">${x.t}</span><div class="c">${d}</div></div>`;
      }).join('');
      TR.$('[data-r]', pane).innerHTML = `<div class="msd-road">${cells}</div><div class="msd-legend" style="margin-top:6px"><span><i style="background:var(--accent)"></i>«Искра» видит работающую систему</span><span><i style="background:var(--bad)"></i>замечают ошибку «шиномонтаж — час, а слот — 30 минут»</span></div>`;
      TR.$('[data-t]', pane).innerHTML = big
        ? ui.note('bad', 'Первый показ — в марте', 'Марина Олеговна впервые увидит работающую запись на пилоте, 3 марта. И сразу скажет: «А шиномонтаж куда? Он час». До сезона две недели, а переделывать надо расчёт слотов, экраны и уже сделанные записи.')
        : ui.note('ok', 'Первый показ — в конце ноября', 'Каждые две недели Марина Олеговна видит то, что уже работает. В декабре на показе выбора времени она попробует записать шиномонтаж — и ошибка всплывёт, пока поверх неё построено немного. MVP и итерации не отменяют этапы — они делают цикл коротким, чтобы ошибки ловились рано.');
    }
    ui.onSeg(pane, (n, v) => { if (n === 'mv') { mode = v; draw(); } });
    draw();
  }

  // =====================================================================
  // Практика 1. Кик-офф: письмо Тимура Рашидовича и вопросы Артёму (открывают факты)
  // =====================================================================
  const LETTER = [
    { id: 'l0', t: 'Вера, Артём, добрый вечер. Пишу, как обещал, — по делу.', k: 'noise', why: 'Приветствие. В блокнот не идёт.' },
    { id: 'l1', t: 'У нас семь станций, тридцать восемь постов, 64 механика и 14 мастеров-приёмщиков. В месяц около 4 500 заказ-нарядов, средний чек — 7 800 ₽.', k: 'fact', f: 'F-net', why: 'Масштаб бизнеса в цифрах: от него зависят нагрузка, объём данных и сколько людей учить.' },
    { id: 'l2', t: 'Хочу приложение как в такси, чтобы было современно.', k: 'signal', why: 'Важный сигнал, но не факт: «как в такси» — образ, а не требование. Что за ним стоит, выясним позже.' },
    { id: 'l3', t: 'Запись у нас только по телефону, на телефоне три девочки. Я снял отчёт АТС: в часы пик, с 9 до 11 и с 17 до 19, мы теряем 21 % звонков.', k: 'fact', f: 'F-calls', why: 'Измеримая боль с источником (отчёт АТС): отсюда вырастет цель по потерянным обращениям.' },
    { id: 'l4', t: 'Мой племянник программист, говорит, писать надо на Flutter — учтите.', k: 'noise', why: 'Решение о технологии принимает команда, когда понятно, что строим. Это не факт о бизнесе «Искры».' },
    { id: 'l5', t: 'Каждый шестой записанный не приезжает — по журналу 17 % неявок, пост простаивает.', k: 'fact', f: 'F-noshow', why: 'Измеримая боль: неявки и простой постов.' },
    { id: 'l6', t: 'Когда механик находит доп. работы, мастер звонит клиенту. В среднем машина висит на подъёмнике час сорок, 38 % клиентов не берут трубку с первого раза.', k: 'fact', f: 'F-idle', why: 'Измеримая боль и описание процесса «как есть»: согласование звонками.' },
    { id: 'l7', t: 'Марина Олеговна, конечно, будет против — она всех клиентов в Excel держит. Но это решаемо.', k: 'signal', why: 'Сигнал о стейкхолдере и возможном сопротивлении — стоит записать в заметки, но это не факт о целях и цифрах. С Мариной Олеговной разберёмся на интервью.' },
    { id: 'l8', t: 'К весне хочу так: терять не больше 5 % обращений, неявок — меньше 8 %, а согласование доп. работ — минут двадцать, не больше.', k: 'fact', f: 'F-goal', why: 'Бизнес-цели в цифрах — по ним через полгода будут судить, удался ли проект.' },
    { id: 'l9', t: 'Конкуренты из «Автомира» уже запустили запись на сайте — у них, говорят, красиво.', k: 'signal', why: 'Контекст рынка («говорят») — полезно знать, но это не факт о «Искре».' },
    { id: 'l10', t: 'Сроки Артём знает, у нас в договоре всё написано. Главное — успеть до переобувки.', k: 'signal', why: 'Сам срок здесь не назван — только «до переобувки». Точную дату и причину стоит спросить у Артёма.' },
    { id: 'l11', t: 'Цвет — фирменный оранжевый, как вывеска. Логотип пришлю.', k: 'noise', why: 'Деталь для дизайнера, не для блокнота кик-оффа. Передадим Нике.' },
    { id: 'l12', t: 'Бюджет обсудим отдельно, не хочу переплачивать за то, чего клиент не увидит.', k: 'noise', why: 'Позиция по бюджету — тема Артёма. Фактов о бизнесе здесь нет.' }
  ];
  const L_FACTS = LETTER.filter(x => x.k === 'fact');
  const L_HINT = { 'F-net': 'цифры о размере сети', 'F-calls': 'сколько теряется звонков', 'F-noshow': 'сколько клиентов не приезжает', 'F-idle': 'сколько машина ждёт согласования доп. работ', 'F-goal': 'цели к весне в цифрах' };
  const BUDGET = 12;
  const QS = [
    { id: 'q1', t: 'Какой срок записан в договоре — и почему именно он?', m: 3, k: 'good', f: 'F-deadline' },
    { id: 'q2', t: 'Что именно входит в «Искру Онлайн» по договору: какие приложения и с какими системами связываемся?', m: 4, k: 'good', f: 'F-scope' },
    { id: 'q3', t: 'Кто со стороны «Искры» принимает решения по требованиям, если Тимур Рашидович недоступен?', m: 3, k: 'good', a: 'По деньгам и срокам — только Тимур. По процессу приёмки — Марина Олеговна, она старший мастер. Её мнение лучше узнать раньше, чем позже.' },
    { id: 'q4', t: 'Писать будем на Flutter, как советует племянник?', m: 3, k: 'bad', a: 'Это решит Глеб, когда будет понятно, что строим. Тебе сейчас это ничем не поможет — потратили три минуты.' },
    { id: 'q5', t: 'А можно сделать как в такси?', m: 2, k: 'bad', a: 'Можно что угодно. Вопрос — что такое «как в такси» для Тимура. Это ты у него и выяснишь, я за него не отвечу.' },
    { id: 'q6', t: 'Откуда цифры в письме — 21 % звонков, 17 % неявок? Можно увидеть источник?', m: 3, k: 'good', a: '21 % — из отчёта АТС, Тимур сам выгружал, перешлю. Неявки — по журналу Марины Олеговны, это ручной учёт, там может быть погрешность. Хороший вопрос: цели будем мерить теми же способами.' },
    { id: 'q7', t: 'Сколько стоит проект?', m: 2, k: 'bad', a: 'Смета — моя зона, она уже в договоре. Тебе важнее, что в неё входит.' },
    { id: 'q8', t: 'Когда следующая встреча с «Искрой» и кого позвать?', m: 2, k: 'ok', a: 'В начале декабря — интервью на станции Победы. Позовём Марину Олеговну, Сергея Петровича, Ольгу Викторовну, Кирилла и Алию. Список вопросов — с тебя.' }
  ];
  function kickEval(a) {
    a = a || {};
    const marks = a.marks || [], asked = a.asked || [];
    const found = L_FACTS.filter(x => marks.includes(x.id));
    const noise = LETTER.filter(x => x.k === 'noise' && marks.includes(x.id));
    const used = asked.reduce((s, id) => s + ((QS.find(q => q.id === id) || {}).m || 0), 0);
    const qFacts = QS.filter(q => q.f && asked.includes(q.id));
    const bad = QS.filter(q => q.k === 'bad' && asked.includes(q.id));
    const goodExtra = QS.filter(q => q.k === 'good' && !q.f && asked.includes(q.id));
    const p1 = Math.max(0, found.length / L_FACTS.length - 0.15 * noise.length);
    const p2 = Math.max(0, qFacts.length / 2 - 0.2 * bad.length);
    const score = 0.6 * p1 + 0.4 * p2;
    return { found, noise, used, qFacts, bad, goodExtra, p1, p2, score, facts: found.map(x => x.f).concat(qFacts.map(q => q.f)) };
  }
  const kickTask = {
    id: 'kickoff', title: 'Кик-офф: разберите письмо Тимура Рашидовича и спросите Артёма',
    simple: {
      icon: '✉️',
      plain: 'Первый артефакт проекта — слова заказчика. Задача аналитика на инициации — вытащить из них факты: цифры, цели, сроки, рамки — и отделить их от эмоций, вкусов и готовых решений.',
      analogy: 'Пациент рассказывает врачу: «Болит, давно, сосед советует таблетки, жена говорит — нервы». Врач записывает в карту: «Боль в правом боку третью неделю, температура 37,5». Остальное — тоже информация, но в диагноз не идёт.',
      tech: 'Бизнес-цели должны быть измеримыми: метрика, текущее значение, целевое, срок (Вигерс, «Разработка требований к ПО», глава о бизнес-требованиях; BABOK — «Анализ стратегии»). Факты фиксируют с источником: кто сказал и откуда данные. Готовые решения заказчика («на Flutter») записывают как ограничения или пожелания, а не как факты.'
    },
    lead: ui.brief({
      situation: 'Понедельник, 21:47. После кик-оффа Тимур Рашидович прислал письмо — как всегда, всё вперемешку. Утром Вера говорит: «Разметьте, что из этого факты для блокнота. На них будет держаться весь проект». А у Артёма есть 12 минут до следующей встречи — успейте спросить то, чего в письме нет.',
      todo: [
        'Часть 1. Нажимайте на фразы письма, в которых есть <b>факты</b>: цифры о бизнесе, измеримые боли, цели. Каждый найденный факт сразу попадает в блокнот. Эмоции, вкусы и готовые решения не отмечайте.',
        'Часть 2. Задайте Артёму вопросы: у вас 12 минут, у каждого вопроса своя цена. Хорошие вопросы открывают факты, пустые тратят время.',
        'Нажмите «Проверить». Засчитывается, если найдены все пять фактов письма, получены оба факта от Артёма и лишнего не больше одного в каждой части.'
      ],
      lookTitle: 'Подсказка',
      look: 'Факт для блокнота можно проверить и измерить: «теряем 21 % звонков по отчёту АТС». Не факт: «хочу современно», «племянник советует», «говорят, у конкурентов красиво».'
    }),
    blank: () => ({ marks: [], asked: [] }),
    reference: () => ({ marks: L_FACTS.map(x => x.id), asked: ['q1', 'q2', 'q3', 'q8'] }),
    render(el, ctx) {
      el.classList.add('msd-root');
      const a = ctx.ans; a.marks = a.marks || []; a.asked = a.asked || [];
      const res = ctx.result;
      // факты, уже добытые этим ответом, — в блокнот (идемпотентно; в эталоне ничего не открываем)
      if (!ctx.readonly) kickEval(a).facts.forEach(f => ctx.facts && ctx.facts.unlock(f, 'ask'));
      el.innerHTML = `<div class="stack">
        <div class="eyebrow">Часть 1 · Письмо</div>
        <div class="msd-letter"><div class="hd"><span><b>От:</b> Тимур Гарипов, «Искра»</span><span><b>Кому:</b> Вера, Артём («Орбита»)</span><span><b>Тема:</b> По итогам встречи · пн, 2 ноября, 21:47</span></div><div class="bd" data-letter></div></div>
        <div class="eyebrow">Часть 2 · 12 минут с Артёмом</div>
        <div class="msd-clock" data-clock></div>
        <div class="msd-qs" data-qs></div>
        <div class="msd-log" data-log></div>
        <div class="eyebrow">Блокнот: факты кик-оффа</div>
        <div class="msd-nb" data-nb></div>
      </div>`;
      function drawLetter() {
        TR.$('[data-letter]', el).innerHTML = LETTER.map(x => {
          const on = a.marks.includes(x.id);
          let cls = '';
          if (ctx.readonly) cls = x.k === 'fact' ? 'ok' : '';
          else if (res && on) cls = x.k === 'fact' ? 'ok' : x.k === 'signal' ? 'sig' : 'bad';
          return `<button type="button" class="msd-frag ${cls}" data-fr="${x.id}" aria-pressed="${on}" ${ctx.readonly ? 'disabled' : ''}>${esc(x.t)}</button>`;
        }).join(' ') + '<br><span class="small dim">С уважением, Тимур.</span>';
      }
      function drawQs() {
        const ev = kickEval(a), left = BUDGET - ev.used;
        TR.$('[data-clock]', el).innerHTML = `<span class="small">Осталось <b class="tnum">${left}</b> мин из ${BUDGET}</span>${ui.meter(left / BUDGET, left <= 3 ? 'bad' : left <= 6 ? 'warn' : '')}`;
        TR.$('[data-qs]', el).innerHTML = QS.map(q => {
          const asked = a.asked.includes(q.id);
          const st = res && asked ? (q.k === 'bad' ? 'bad' : 'ok') : '';
          const dis = ctx.readonly || asked || q.m > left;
          return `<button type="button" class="msd-q ${asked ? 'asked' : ''} ${st}" data-q="${q.id}" ${dis ? 'disabled' : ''} aria-pressed="${asked}"><span>${esc(q.t)}</span><span class="m">${asked ? 'спросили' : q.m + ' мин'}</span></button>`;
        }).join('');
        TR.$('[data-log]', el).innerHTML = a.asked.map(id => {
          const q = QS.find(x => x.id === id); if (!q) return '';
          const ans = q.f ? (TR.FACTS[q.f] ? TR.FACTS[q.f].answer : '') : q.a;
          return ui.say('me', esc(q.t)) + ui.say('artem', esc(ans) + (q.f ? `<div class="small" style="color:var(--ok)">✓ В блокнот: ${esc((TR.FACTS[q.f] || {}).short || q.f)}</div>` : ''));
        }).join('');
      }
      function drawNb() {
        const got = new Set(kickEval(a).facts);
        const ids = L_FACTS.map(x => x.f).concat(['F-deadline', 'F-scope']);
        const miss = ids.length - ids.filter(id => got.has(id)).length;
        TR.$('[data-nb]', el).innerHTML = ids.filter(id => got.has(id)).map(id => {
          const f = TR.FACTS[id] || { text: id, flag: false };
          return `<div class="it ${f.flag ? 'flag' : ''}">${esc(f.text)}</div>`;
        }).join('') + (miss ? `<div class="it miss">Ещё не выяснено: ${miss} ${TR.plural(miss, 'факт', 'факта', 'фактов')} из ${ids.length}</div>` : '') + '<div class="small dim">Факты сохраняются в блокноте (кнопка «Блокнот» вверху) и понадобятся в следующих тренировках.</div>';
      }
      drawLetter(); drawQs(); drawNb();
      TR.on(el, 'click', '[data-fr]', (e, b) => {
        if (ctx.readonly) return;
        const id = b.dataset.fr, x = LETTER.find(z => z.id === id);
        if (a.marks.includes(id)) a.marks = a.marks.filter(z => z !== id);
        else {
          a.marks.push(id);
          if (x.k === 'fact' && ctx.facts && ctx.facts.unlock(x.f, 'ask')) ui.toast(`В блокнот: ${esc((TR.FACTS[x.f] || {}).short || x.f)}`, 'ok', 2400);
        }
        ctx.save(); drawLetter(); drawNb();
      });
      TR.on(el, 'click', '[data-q]', (e, b) => {
        if (ctx.readonly) return;
        const q = QS.find(z => z.id === b.dataset.q); if (!q || a.asked.includes(q.id)) return;
        if (q.m > BUDGET - kickEval(a).used) return;
        a.asked.push(q.id); ctx.save();
        if (q.f && ctx.facts && ctx.facts.unlock(q.f, 'ask')) ui.toast(`В блокнот: ${esc((TR.FACTS[q.f] || {}).short || q.f)}`, 'ok', 2400);
        ctx.decide('Вопрос Артёму после кик-оффа', q.t);
        drawQs(); drawNb();
      });
    },
    check(ans) {
      const r = kickEval(ans), notes = [];
      if (r.found.length === L_FACTS.length) notes.push({ ok: true, html: 'Письмо: все пять фактов найдены — масштаб сети, три боли в цифрах и цели.' });
      else L_FACTS.filter(x => !r.found.includes(x)).forEach(x => notes.push({ ok: false, html: `Письмо: в нём ещё есть факт — ${L_HINT[x.f]}. Перечитайте внимательно.` }));
      r.noise.forEach(x => notes.push({ ok: false, html: `«${esc(x.t)}» — ${x.why}` }));
      const sig = LETTER.filter(x => x.k === 'signal' && ((ans && ans.marks) || []).includes(x.id));
      sig.forEach(x => notes.push({ ok: 'warn', html: `«${esc(x.t)}» — ${x.why} Отметка не штрафуется.` }));
      if (r.qFacts.length === 2) notes.push({ ok: true, html: 'Артём: срок и состав системы выяснены — их в письме не было.' });
      else {
        if (!(ans && ans.asked || []).includes('q1')) notes.push({ ok: false, html: 'Артём: в письме срок назван расплывчато — «до переобувки». Какая дата в договоре и почему?' });
        if (!(ans && ans.asked || []).includes('q2')) notes.push({ ok: false, html: 'Артём: из письма непонятно, что именно мы делаем — какие приложения и с какими системами связываемся.' });
      }
      r.bad.forEach(q => notes.push({ ok: false, html: `Вопрос «${esc(q.t)}» — ${esc(q.a)}` }));
      if (r.goodExtra.length) notes.push({ ok: true, html: `Бонус к пониманию: ${r.goodExtra.map(q => '«' + esc(q.t) + '»').join(', ')} — фактов не открыли, но это правильные вопросы на инициации.` });
      const ok = r.found.length === L_FACTS.length && r.qFacts.length === 2 && r.noise.length <= 1 && r.bad.length <= 1 && r.score >= 0.8;
      return {
        ok, score: r.score, notes,
        summary: `Фактов из письма: ${r.found.length} из ${L_FACTS.length}, от Артёма: ${r.qFacts.length} из 2. Лишних отметок: ${r.noise.length}, пустых вопросов: ${r.bad.length}.`,
        mentor: ok ? null : r.found.length < L_FACTS.length ? 'Ищите в письме то, что можно измерить и проверить: числа, проценты, сроки, «было — хочу». Именно из таких фраз потом вырастают цели проекта.' : r.qFacts.length < 2 ? 'У Артёма есть то, чего нет в письме, — договор. Спросите о том, что в договоре записано: срок и состав работ.' : 'Лишние отметки и пустые вопросы стоят доверия. Технологию выберет команда, а «как в такси» Артём за Тимура не расшифрует.'
      };
    },
    explain: `<p>На инициации аналитик собирает <b>факты</b> — то, на что будут опираться цели, приоритеты и требования:</p>
      ${ui.table(['Факт', 'Откуда', 'Зачем он проекту'], [
        ['7 станций, 38 постов, 4 500 заказ-нарядов в месяц, чек 7 800 ₽', 'письмо', 'масштаб: нагрузка, объём данных, сколько людей учить'],
        ['Теряем 21 % звонков в пик', 'письмо, отчёт АТС', 'боль → цель «не больше 5 %»'],
        ['17 % неявок', 'письмо, журнал Марины', 'боль → цель «меньше 8 %»'],
        ['Простой на согласовании 1 ч 40 мин', 'письмо', 'боль → цель «20 минут»'],
        ['Цели: 5 % / 8 % / 20 мин к весне', 'письмо', 'по ним будут судить, удался ли проект'],
        ['MVP к 15 марта: с 1 апреля сезон', 'Артём, договор', 'срок задаёт объём MVP'],
        ['Состав: приложения, АРМ, планшет, бэкенд, интеграции', 'Артём, договор', 'рамки проекта: что делаем и что нет']
      ])}
      <p>Остальное — тоже информация, но другого рода: «как в такси» — образ, за которым надо искать потребность; «на Flutter» — готовое решение, которое принимает команда; «Марина будет против» — сигнал о стейкхолдере для подготовки интервью. Хорошие вопросы на инициации — о сроках, рамках, источниках цифр и о том, кто принимает решения. Пустые — о технологиях и деньгах, которые не в зоне аналитика.</p>
      <p>Обратите внимание на источник цифр: 21 % — из отчёта АТС, 17 % — из ручного журнала. Цели будут мерить теми же способами, поэтому источник записывают вместе с фактом.</p>`,
    report: ans => {
      const r = kickEval(ans);
      return `- Факты из письма: ${r.found.map(x => x.f).join(', ') || '—'}\n- Лишние отметки: ${r.noise.length}\n- Вопросы Артёму: ${((ans && ans.asked) || []).map(id => (QS.find(q => q.id === id) || {}).t).join(' | ') || '—'}`;
    }
  };

  // =====================================================================
  // Практика 2. Этапы по порядку и артефакты
  // =====================================================================
  const ST_ITEMS = [
    { id: 'design', t: 'Проектирование', sub: 'решают, как будет устроена система' },
    { id: 'ops', t: 'Эксплуатация и сопровождение', sub: 'система работает, её чинят и развивают' },
    { id: 'req', t: 'Анализ требований', sub: 'выясняют и записывают, что должна делать система' },
    { id: 'test', t: 'Тестирование', sub: 'проверяют, что сделано то, что требовалось' },
    { id: 'init', t: 'Инициация', sub: 'зачем проект и что в него входит' },
    { id: 'deploy', t: 'Внедрение', sub: 'запускают в работу, переносят данные, учат людей' },
    { id: 'dev', t: 'Разработка', sub: 'пишут код' }
  ];
  const ST_REF = ['init', 'req', 'design', 'dev', 'test', 'deploy', 'ops'];
  const ARTS = [
    { id: 'a1', t: 'Письмо Тимура Рашидовича и протокол кик-оффа', ok: 'init' },
    { id: 'a2', t: 'Цели в цифрах (21 % → 5 %, 17 % → 8 %) и рамки MVP', ok: 'init', alt: { req: 'Цели — вход для анализа требований, и аналитик их уточняет. Но формулируют их на инициации: без целей непонятно, нужен ли проект вообще.' } },
    { id: 'a3', t: 'Протокол интервью с Мариной Олеговной на станции Победы', ok: 'req' },
    { id: 'a4', t: 'Пользовательские истории, сценарии и правила BR-1…BR-16', ok: 'req' },
    { id: 'a5', t: 'Макеты экранов записи в Figma', ok: 'design', alt: { req: 'Черновые наброски экранов аналитик иногда делает при выявлении требований. Но макеты Ники — результат проектирования.' } },
    { id: 'a6', t: 'Модель данных (ERD) и описание API', ok: 'design' },
    { id: 'a7', t: 'Код сервиса записи и сборка приложения для тестирования', ok: 'dev' },
    { id: 'a8', t: 'Тест-кейсы и отчёты о дефектах Лизы', ok: 'test', alt: { dev: 'Лиза пишет тест-кейсы параллельно с разработкой — это правильно. Но тест-кейсы и отчёты о дефектах — артефакты тестирования.' } },
    { id: 'a9', t: 'План переноса 31 000 клиентов из Excel и инструкция для мастеров', ok: 'deploy' },
    { id: 'a10', t: 'Обращение мастера «не видно фото доп. работ» и запрос на изменение', ok: 'ops' }
  ];
  function stagesEval(a) {
    a = a || {};
    const v = a.order || [];
    const full = v.length === ST_REF.length && ST_REF.every(id => v.includes(id));
    const os = full ? ui.orderScore(v, ST_REF) : 0;
    const arts = ARTS.map(x => { const got = (a.arts || {})[x.id]; return got === x.ok ? { x, s: 'ok', pts: 1 } : x.alt && x.alt[got] ? { x, s: 'warn', pts: 0.5, why: x.alt[got] } : { x, s: 'bad', pts: 0, got }; });
    const as = arts.reduce((s, z) => s + z.pts, 0) / ARTS.length;
    return { full, os, arts, as, score: 0.4 * os + 0.6 * as };
  }
  const stagesTask = {
    id: 'stages', title: 'Этапы по порядку и их артефакты',
    simple: howCycle.simple,
    lead: ui.brief({
      situation: 'Артём заводит в Confluence раздел проекта: «Сделай оглавление по этапам и разложи по нему документы, которые у нас будут, — чтобы через месяц никто не искал протокол интервью в папке „Разное“».',
      todo: [
        'Часть 1. Расставьте семь этапов жизненного цикла по порядку: стрелки ↑ ↓ (на компьютере можно перетаскивать).',
        'Часть 2. Для каждого из десяти артефактов «Искры» выберите этап, на котором он появляется.',
        'Нажмите «Проверить». Засчитывается от 80 %: порядок этапов весит 40 %, артефакты — 60 %.'
      ],
      look: 'Артефакт относится к тому этапу, на <b>выходе</b> которого он появляется. Если сомневаетесь, спросите: без какого этапа этот документ не мог бы возникнуть?'
    }),
    blank: () => ({ order: [], arts: {} }),
    reference: () => ({ order: ST_REF.slice(), arts: Object.fromEntries(ARTS.map(x => [x.id, x.ok])) }),
    render(el, ctx) {
      el.classList.add('msd-root');
      const a = ctx.ans; a.arts = a.arts || {};
      const ev = ctx.result ? stagesEval(a) : null;
      el.innerHTML = '<div class="stack"><div class="eyebrow">Часть 1 · Порядок этапов</div><div data-o></div><div class="eyebrow">Часть 2 · Артефакты</div><div data-m></div></div>';
      let oRev = null;
      if (ev && ev.full) { oRev = {}; (a.order || []).forEach((id, i) => { oRev[id] = ST_REF[i] === id ? 'ok' : 'bad'; }); }
      ui.order(TR.$('[data-o]', el), { items: ST_ITEMS, value: a.order, reveal: oRev, readonly: ctx.readonly, seed: 'msd-stages', onChange: v => { a.order = v; ctx.save(); } });
      const mRev = ev ? Object.fromEntries(ev.arts.map(z => [z.x.id, { s: z.s, why: z.s === 'warn' ? z.why : z.s === 'bad' ? (z.got ? 'Не тот этап. На выходе какого этапа появляется этот документ?' : 'Не выбрано.') : '' }])) : null;
      ui.match(TR.$('[data-m]', el), { rows: ARTS.map(x => ({ id: x.id, t: x.t })), choices: STAGES.map(s => ({ v: s.id, t: s.t })), value: a.arts, reveal: mRev, readonly: ctx.readonly, placeholder: 'Какой этап?', onChange: v => { a.arts = v; ctx.save(); } });
    },
    check(ans) {
      const r = stagesEval(ans), notes = [];
      if (!r.full) notes.push({ ok: false, html: 'Порядок этапов ещё не расставлен — подвиньте хотя бы один, чтобы он сохранился.' });
      else if (r.os === 1) notes.push({ ok: true, html: 'Этапы стоят по порядку.' });
      else {
        const v = ans.order, pos = id => v.indexOf(id);
        if (pos('req') > pos('design')) notes.push({ ok: false, html: 'Проектирование раньше анализа требований: как решать, как устроить систему, не зная, что она должна делать?' });
        if (pos('dev') > pos('test')) notes.push({ ok: false, html: 'Тестирование раньше разработки: проверять пока нечего.' });
        if (pos('init') !== 0) notes.push({ ok: false, html: 'Всё начинается с вопроса «зачем» — с инициации.' });
        if (pos('deploy') > pos('ops')) notes.push({ ok: false, html: 'Эксплуатация раньше внедрения: систему ещё не запустили в работу.' });
        if (notes.length === 0) notes.push({ ok: 'warn', html: 'Почти: пара соседних этапов переставлена.' });
      }
      r.arts.filter(z => z.s !== 'ok').forEach(z => notes.push({ ok: z.s === 'warn' ? 'warn' : false, html: `«${esc(z.x.t)}» — ${z.s === 'warn' ? z.why : z.got ? 'не на том этапе.' : 'этап не выбран.'}` }));
      if (r.arts.every(z => z.s === 'ok')) notes.push({ ok: true, html: 'Все десять артефактов разложены по этапам верно.' });
      return {
        ok: r.score >= 0.8 && r.os >= 0.9, score: r.score, notes,
        summary: `Порядок этапов: ${Math.round(r.os * 100)} %, артефакты: ${r.arts.filter(z => z.s === 'ok').length} из ${ARTS.length}.`,
        mentor: r.score >= 0.8 ? null : 'Каждый этап отвечает на свой вопрос: зачем? → что? → как? → сделать → работает ли? → запустить → жить. Артефакт появляется там, где на этот вопрос ответили.'
      };
    },
    explain: `<p>Порядок: <b>инициация → анализ требований → проектирование → разработка → тестирование → внедрение → эксплуатация и сопровождение</b>. Каждый этап отвечает на свой вопрос, и его артефакты — вход для следующего.</p>
      <ul class="checks">
        <li><b>Инициация</b> — письмо, протокол кик-оффа, цели в цифрах и рамки MVP.</li>
        <li><b>Анализ требований</b> — протоколы интервью, истории, сценарии, правила BR.</li>
        <li><b>Проектирование</b> — макеты, модель данных, описание API.</li>
        <li><b>Разработка</b> — код и сборки. <b>Тестирование</b> — тест-кейсы и дефекты.</li>
        <li><b>Внедрение</b> — перенос данных и инструкции. <b>Эксплуатация</b> — обращения и запросы на изменение, с которых начинается следующий круг.</li>
      </ul>
      <p>В жизни «Орбиты» этапы будут накладываться: Лиза начнёт писать тест-кейсы, пока Глеб пишет код. Но логика «выход одного — вход другого» сохраняется в каждой итерации. Если артефакта нет, следующий этап работает вслепую: без истории Глеб гадает, без критериев приёмки Лиза не знает, что проверять.</p>`,
    report: ans => {
      const r = stagesEval(ans);
      return `Порядок: ${((ans && ans.order) || []).map(id => (ST(id) || {}).t).join(' → ') || '—'}\n` + r.arts.map(z => `- ${z.x.t} → ${(ST(((ans && ans.arts) || {})[z.x.id]) || { t: '—' }).t} ${z.s === 'ok' ? '✓' : z.s === 'warn' ? '≈' : '✗'}`).join('\n');
    }
  };

  // =====================================================================
  // Практика 3. Аналитик на каждом этапе
  // =====================================================================
  const INV = [{ v: 'lead', t: 'Ведёт этап' }, { v: 'part', t: 'Участвует' }, { v: 'none', t: 'Почти не участвует' }];
  const ROLE = [
    { id: 'init', inv: { part: 'ok', lead: 'warn', none: 'bad' },
      invWhy: { lead: 'Ведут инициацию заказчик и руководитель проекта: они решают, нужен ли проект и за какие деньги. Аналитик помогает.', none: 'Без аналитика цели так и останутся жалобами — «хочу как в такси».' },
      opts: [
        { v: 'a', t: 'Помогает превратить жалобы Тимура в измеримые цели и фиксирует рамки: что входит в проект, а что нет', ok: true },
        { v: 'b', t: 'Сразу пишет подробную спецификацию всех экранов, чтобы Артём мог точнее оценить проект', why: 'Рано: ещё не ясно, что именно строим и зачем. Подробности без целей придётся переписывать.' },
        { v: 'c', t: 'Ждёт подписанного договора и утверждённого бюджета: пока их нет, разговоры с заказчиком о целях — пустая трата времени аналитика', why: 'Именно до договора решается, что войдёт в проект и сколько он стоит. Без аналитика рамки получатся «на глаз».' }
      ] },
    { id: 'req', inv: { lead: 'ok', part: 'warn', none: 'bad' },
      invWhy: { part: 'Это главный этап аналитика: здесь он не участник, а ведущий.', none: 'Без аналитика требования не появятся — разработчики будут угадывать.' },
      opts: [
        { v: 'a', t: 'Дословно записывает всё, что сказали Тимур и Марина, и отдаёт стенограмму разработчикам', why: 'Стенограмма — сырьё, а не требования: в ней противоречия, пропуски и готовые решения. Работа аналитика — их разобрать.' },
        { v: 'b', t: 'Выявляет и описывает требования: интервью и наблюдение на станции, процессы, правила BR, сценарии и критерии приёмки, согласование с «Искрой»', ok: true },
        { v: 'c', t: 'Выбирает язык программирования и базу данных, чтобы требования сразу были «реализуемыми», и согласует выбор с Тимуром Рашидовичем', why: 'Технологии выбирают тимлид и архитектор. Аналитик приносит требования, по которым их выбирают.' }
      ] },
    { id: 'design', inv: { part: 'ok', lead: 'ok', none: 'bad' },
      invWhy: { none: 'Без аналитика никто не сверит макеты и архитектуру с требованиями — дыры всплывут в разработке.' },
      opts: [
        { v: 'a', t: 'Рисует итоговый дизайн экранов вместо Ники, чтобы всё было точно по требованиям и дизайнеру не пришлось переспрашивать про каждое поле', why: 'Дизайн — работа дизайнера. Аналитик проверяет, что макеты покрывают все сценарии и состояния.' },
        { v: 'b', t: 'Не участвует: проектирование — дело архитектора и дизайнера, а аналитик в это время уже пишет требования к следующей версии', why: 'Без аналитика некому сверить решения с требованиями и описать данные и обмен с 1С, ЮKassa, SMS.' },
        { v: 'c', t: 'Проверяет, что макеты Ники и схема Глеба покрывают все сценарии и правила; описывает данные и обмен с 1С, ЮKassa и SMS', ok: true }
      ] },
    { id: 'dev', inv: { part: 'ok', lead: 'bad', none: 'bad' },
      invWhy: { lead: 'Разработку ведут разработчики и тимлид. Аналитик рядом, но не руководит.', none: 'Вопросы у разработчиков будут каждый день. Без ответов аналитика решения примут «на глаз».' },
      opts: [
        { v: 'a', t: 'Отвечает на вопросы Глеба и Даши в задачах, уточняет детали у «Искры», проводит изменения через новую версию требования', ok: true },
        { v: 'b', t: 'Договаривается с разработчиком в личных сообщениях и ничего не записывает — так быстрее', why: 'Через месяц никто не вспомнит, почему так сделано, а Лиза будет проверять по старой версии требования.' },
        { v: 'c', t: 'Садится писать код сам, если разработчики не успевают к концу спринта: требования он знает лучше всех, значит, ошибётся меньше', why: 'Это не работа аналитика. Если не успевают — решают Артём и Глеб: объём, приоритеты.' }
      ] },
    { id: 'test', inv: { part: 'ok', lead: 'warn', none: 'bad' },
      invWhy: { lead: 'Тестирование ведёт QA — Лиза. Аналитик помогает.', none: 'Спорные случаи «ошибка или так задумано» без аналитика не разобрать.' },
      opts: [
        { v: 'a', t: 'Сам проверяет всё вместо Лизы, чтобы она не придиралась к требованиям и не задавала лишних вопросов про граничные случаи', why: 'Придирки Лизы к требованиям — подарок: она находит дыры до клиентов. Тестирует QA.' },
        { v: 'b', t: 'Помогает Лизе с критериями приёмки и разбирает спорные случаи «ошибка или так задумано»', ok: true },
        { v: 'c', t: 'Не участвует: требования переданы ещё до разработки, за качество теперь отвечает только QA, и вопросы Лизы — её зона', why: 'Лиза будет находить места, где требование неоднозначно. Решать, как правильно, — вместе с аналитиком.' }
      ] },
    { id: 'deploy', inv: { part: 'ok', lead: 'warn', none: 'bad' },
      invWhy: { lead: 'Внедрение ведут руководитель проекта и DevOps. У аналитика своя важная часть.', none: 'Перенос данных и обучение без аналитика превратятся в хаос: кто знает правила лучше него?' },
      opts: [
        { v: 'a', t: 'Настраивает серверы, сам выкладывает версию в App Store и Google Play и следит, чтобы релиз прошёл ночью без сбоев', why: 'Это работа DevOps и разработчиков.' },
        { v: 'b', t: 'Уходит на следующий проект: требования написаны, остальное — дело команды', why: 'Именно при внедрении выясняется, как люди работают с системой на самом деле. Замечания пилота — новые требования.' },
        { v: 'c', t: 'Готовит перенос 31 000 клиентов из Excel (с дублями телефонов), инструкции и обучение мастеров, разбирает замечания пилота на Победы', ok: true }
      ] },
    { id: 'ops', inv: { part: 'ok', lead: 'warn', none: 'warn' },
      invWhy: { lead: 'Эксплуатацию ведут поддержка и команда развития.', none: 'Если аналитик ушёл, никто не проверит, достигнуты ли цели, и не превратит обращения в запросы на изменение.' },
      opts: [
        { v: 'a', t: 'Разбирает обращения и метрики — достигли ли 5 % / 8 % / 20 минут — и оформляет запросы на изменение для следующей версии', ok: true },
        { v: 'b', t: 'Сам исправляет ошибки в коде, которые находят мастера, — так быстрее, чем ставить задачи разработчикам и ждать спринта', why: 'Ошибки в коде чинят разработчики. Аналитик помогает понять, что именно ошибка.' },
        { v: 'c', t: 'Отвечает на звонки клиентов «Искры» вместо колл-центра, чтобы лично слышать все жалобы на приложение', why: 'Это работа поддержки «Искры». Аналитику нужны выводы из обращений, а не сами звонки.' }
      ] }
  ];
  function roleEval(a) {
    a = a || {};
    const rows = ROLE.map(r => {
      const x = (a.r || {})[r.id] || {};
      const inv = x.inv ? r.inv[x.inv] : null, opt = r.opts.find(o => o.v === x.act);
      const ip = inv === 'ok' ? 1 : inv === 'warn' ? 0.5 : 0, ap = opt && opt.ok ? 1 : 0;
      return { r, x, inv, opt, pts: 0.3 * ip + 0.7 * ap, actOk: !!(opt && opt.ok) };
    });
    return { rows, score: rows.reduce((s, z) => s + z.pts, 0) / ROLE.length };
  }
  const roleTask = {
    id: 'role', title: 'Аналитик на каждом этапе: что он делает',
    simple: howTimeline.simple,
    lead: ui.brief({
      situation: 'Дома вас спросили: «Ну и что ты там делаешь? Требования пишешь, а дальше — отдыхаешь?» Вера улыбается: «Давайте проверим, что вы сами ответите». Для каждого этапа решите, насколько там занят аналитик и что он делает в проекте «Искры».',
      todo: [
        'Для каждого из семи этапов выберите, насколько аналитик вовлечён: ведёт этап, участвует или почти не участвует.',
        'Выберите его главное действие на этом этапе — один из трёх вариантов.',
        'Нажмите «Проверить». Засчитывается от 80 %, если главное действие выбрано неверно не больше чем на одном этапе.'
      ],
      look: 'Ловушки — в двух сторонах: аналитик, который делает чужую работу (код, дизайн, тестирование), и аналитик, который «отдал требования и ушёл».'
    }),
    blank: () => ({ r: {} }),
    reference: () => ({ r: Object.fromEntries(ROLE.map(r => [r.id, { inv: Object.keys(r.inv).find(k => r.inv[k] === 'ok'), act: r.opts.find(o => o.ok).v }])) }),
    render(el, ctx) {
      el.classList.add('msd-root');
      const a = ctx.ans; a.r = a.r || {};
      const ev = ctx.result ? roleEval(a) : null;
      el.innerHTML = '<div class="stack" data-rows></div>';
      function draw() {
        TR.$('[data-rows]', el).innerHTML = ROLE.map((r, i) => {
          const x = a.r[r.id] || {}, z = ev ? ev.rows[i] : null;
          const st = z ? (z.actOk && z.inv === 'ok' ? 'ok' : z.actOk ? 'warn' : 'bad') : '';
          const opts = TR.shuffle(r.opts, 'msd-role-' + r.id);
          let fb = '';
          if (z) {
            if (z.inv && z.inv !== 'ok') fb += `<div class="small muted">Вовлечённость: ${r.invWhy[x.inv] || ''}</div>`;
            if (!x.inv) fb += '<div class="small muted">Вовлечённость не выбрана.</div>';
            if (z.opt && !z.opt.ok) fb += `<div class="small muted">Действие: ${z.opt.why}</div>`;
            if (!z.opt) fb += '<div class="small muted">Действие не выбрано.</div>';
          }
          return `<div class="msd-role ${st}"><h4>${i + 1}. ${esc(ST(r.id).t)}</h4>
            <div class="row" role="group" aria-label="Вовлечённость аналитика"><span class="small dim">Вовлечённость:</span>${INV.map(o => `<button type="button" class="btn xs" data-inv="${r.id}|${o.v}" aria-pressed="${x.inv === o.v}" ${ctx.readonly ? 'disabled' : ''}>${esc(o.t)}</button>`).join('')}</div>
            <span class="small dim">Главное действие аналитика:</span><div class="stack tight">${opts.map(o => `<button type="button" class="btn sm msd-opt" data-ra="${r.id}|${o.v}" aria-pressed="${x.act === o.v}" ${ctx.readonly ? 'disabled' : ''}>${esc(o.t)}</button>`).join('')}</div>${fb}</div>`;
        }).join('');
      }
      draw();
      TR.on(el, 'click', '[data-inv]', (e, b) => { if (ctx.readonly) return; const [id, v] = b.dataset.inv.split('|'); a.r[id] = Object.assign({}, a.r[id], { inv: v }); ctx.save(); draw(); });
      TR.on(el, 'click', '.msd-opt[data-ra]', (e, b) => { if (ctx.readonly) return; const [id, v] = b.dataset.ra.split('|'); a.r[id] = Object.assign({}, a.r[id], { act: v }); ctx.save(); draw(); });
    },
    check(ans) {
      const r = roleEval(ans), notes = [];
      const actBad = r.rows.filter(z => !z.actOk);
      r.rows.forEach(z => {
        const t = ST(z.r.id).t;
        if (z.actOk && z.inv === 'ok') notes.push({ ok: true, html: `${esc(t)}: верно.` });
        else {
          if (!z.actOk) notes.push({ ok: false, html: `${esc(t)}: ${z.opt ? z.opt.why : 'главное действие не выбрано.'}` });
          if (z.inv !== 'ok') notes.push({ ok: z.inv === 'warn' ? 'warn' : false, html: `${esc(t)}, вовлечённость: ${z.x.inv ? z.r.invWhy[z.x.inv] : 'не выбрана.'}` });
        }
      });
      return {
        ok: r.score >= 0.8 && actBad.length <= 1, score: r.score, notes,
        summary: `Главное действие верно на ${ROLE.length - actBad.length} этапах из ${ROLE.length}.`,
        mentor: r.score >= 0.8 && actBad.length <= 1 ? null : 'Аналитик — переводчик между «Искрой» и командой. На каждом этапе спросите: где сейчас нужен перевод? Не «сделать за другого», а «помочь другому сделать правильно».'
      };
    },
    explain: `<p>Аналитик нужен на всех этапах, но по-разному:</p>
      ${ui.table(['Этап', 'Вовлечённость', 'Что делает'], [
        ['Инициация', 'участвует', 'жалобы → измеримые цели, рамки проекта'],
        ['Анализ требований', '<b>ведёт</b>', 'интервью, процессы, правила, истории, критерии приёмки'],
        ['Проектирование', 'участвует или ведёт свою часть', 'сверяет макеты и архитектуру с требованиями, описывает данные и интеграции'],
        ['Разработка', 'участвует', 'отвечает на вопросы в задачах, ведёт изменения'],
        ['Тестирование', 'участвует', 'критерии приёмки, «ошибка или так задумано»'],
        ['Внедрение', 'участвует', 'перенос данных, инструкции, обучение, замечания пилота'],
        ['Эксплуатация', 'участвует', 'метрики и обращения → запросы на изменение']
      ])}
      <p>Две крайности одинаково вредны. «Аналитик-мастер на все руки», который пишет код и рисует дизайн, отнимает работу у команды и бросает свою. «Аналитик-почтальон», который отдал спецификацию и ушёл, оставляет команду угадывать. На собеседовании о роли аналитика спрашивают почти всегда; хороший ответ — по этапам, с примером из проекта.</p>`,
    report: ans => roleEval(ans).rows.map(z => `- ${ST(z.r.id).t}: ${(INV.find(o => o.v === z.x.inv) || { t: '—' }).t}; ${z.opt ? plainT(z.opt.t) : '—'} ${z.actOk ? '✓' : '✗'}`).join('\n')
  };

  // =====================================================================
  // Практика 4. Лаборатория: где поймают ошибку со слотом
  // =====================================================================
  const LAB_BUDGET = 8;
  const CHECKS = [
    { id: 'c-review', st: 'req', h: 2, t: 'Ревью требований с Мариной Олеговной: проходим вслух сценарии записи на каждую услугу из каталога', hit: true,
      res: 'На третьей минуте Марина Олеговна: «А шиномонтаж с балансировкой куда? Он час — это два слота». Правило переписали за час: длительность = сумма нормо-часов, вверх до 30 минут. Так появился BR-1.' },
    { id: 'c-sign', st: 'req', h: 1, t: 'Отправить спецификацию Тимуру Рашидовичу на подпись', hit: false,
      res: 'Тимур подписал за десять минут: «Делайте». Подпись нужна — это согласование. Но он не мастер-приёмщик и не помнит, сколько длится балансировка.' },
    { id: 'c-proto', st: 'design', h: 5, t: 'Кликабельный прототип выбора времени в Figma: дать попробовать двум мастерам на Ямашева', hit: true,
      res: 'Мастер выбирает «Шиномонтаж» — прототип предлагает один слот. «Не влезем, это час». Поправили требование и прототип за полдня.' },
    { id: 'c-mock', st: 'design', h: 4, t: 'Ника дорисовывает красивые макеты всех экранов', hit: false,
      res: 'Макеты красивые и полные — но нарисованы по тем же требованиям: один слот на любую услугу. Ошибку не видно, пока ею не попробуют воспользоваться.' },
    { id: 'c-amigos', st: 'dev', h: 2, t: 'Обсуждение втроём перед спринтом: Глеб, Лиза и вы разбираете историю записи', hit: true,
      res: 'Лиза: «А если услуг две и вместе они 70 минут? Какую длительность берём?» Вы идёте к Марине Олеговне — и выясняете про шиномонтаж. Код ещё не написан, но оценку, макет выбора времени и две истории переделывают.' },
    { id: 'c-auto', st: 'test', h: 3, t: 'Лиза пишет автотесты по спецификации', hit: false,
      res: 'Все тесты зелёные: система делает ровно то, что написано, — один слот на любую услугу. Тест проверяет соответствие требованию, а не само требование.' },
    { id: 'c-load', st: 'test', h: 4, t: 'Нагрузочный тест: 1 500 человек открывают запись в понедельник в 09:00', hit: false,
      res: 'Система выдержала — молодцы. Но ошибка не в скорости, а в правиле.' },
    { id: 'c-pilot', st: 'deploy', h: 3, t: 'Пилот на станции Победы 1–14 марта', hit: true,
      res: 'На третий день пилота у Марины Олеговны два шиномонтажа налезли на ТО: «Кто это придумал?» До сезона две недели.' }
  ];
  const OUT = {
    req: { k: 'ok', score: 1, x: 1, t: 'Поймали на анализе требований', d: 'Исправили одну строку в спецификации — час работы. Ни макеты, ни код ещё не построены поверх ошибки.' },
    design: { k: 'ok', score: 0.9, x: 3, t: 'Поймали на проектировании', d: 'Поправили требование, прототип выбора времени и описание API — полдня. Дёшево: кода ещё нет.' },
    dev: { k: 'warn', score: 0.6, x: 10, t: 'Поймали в разработке', d: 'Код ещё не написан, но оценки, макеты и две истории — заново: около двух дней команды. Терпимо, но могли и дешевле.' },
    deploy: { k: 'bad', score: 0.3, x: 40, t: 'Поймали на пилоте', d: 'Переписать расчёт слотов, перенести две сотни сделанных записей, извиниться перед клиентами Победы, переобучить мастеров — две недели. Ровно столько и оставалось до сезона.' },
    ops: { k: 'bad', score: 0, x: 100, t: 'Поймали в сезон', d: 'С 1 апреля поток в 3–4 раза больше. Шиномонтажи налезают на ТО на всех семи станциях: очереди, отмены, клиенты снова звонят в колл-центр. Срочное исправление в разгар сезона, ручной перенос сотен записей, Тимур Рашидович считает потерянную выручку.' }
  };
  const STAGE_ORDER = ['req', 'design', 'dev', 'test', 'deploy', 'ops'];
  const LAB_Q = {
    q: 'Почему автотесты Лизы и нагрузочный тест не поймали ошибку со слотом?', seed: 'msd-lab-q',
    options: [
      { t: 'Они проверяют, что система делает то, что написано в требованиях. Ошибка — в самом требовании; её ловят люди, которые знают, как работает станция: ревью, прототип, разговор втроём', ok: 1, why: 'Верно. Тесты проверяют соответствие требованию (верификацию), а правильность требования проверяют с бизнесом (валидация).' },
      { t: 'Лиза тестировала невнимательно: опытный тестировщик сам догадался бы, что шиномонтаж длится дольше, и завёл бы дефект ещё до релиза', why: 'Лиза проверила ровно то, что было написано. Опыт тут ни при чём.' },
      { t: 'Тестов было слишком мало: если покрыть автотестами все услуги каталога и все станции, ошибка обязательно найдётся на тестировании', why: 'Сколько ни пиши тестов по неверному требованию — все будут проверять неверное поведение.' },
      { t: 'Автотесты и нагрузочные тесты в таком проекте не нужны: всё равно всё проверяется на пилоте, поэтому на них зря потратили время', why: 'Нужны: они ловят дефекты кода и регрессии. Просто дефекты требований ловят другими способами.' }
    ]
  };
  function labEval(a) {
    a = a || {};
    const picked = (a.picked || []).filter(id => CHECKS.some(c => c.id === id));
    const hours = picked.reduce((s, id) => s + CHECKS.find(c => c.id === id).h, 0);
    const catching = CHECKS.filter(c => picked.includes(c.id) && c.hit).sort((x, y) => STAGE_ORDER.indexOf(x.st) - STAGE_ORDER.indexOf(y.st));
    const first = catching[0] || null;
    const stage = first ? first.st : 'ops';
    const q = ui.quizScore(LAB_Q, a.q || []);
    const out = OUT[stage];
    return { picked, hours, first, stage, out, q, score: Math.round((0.7 * out.score + 0.2 * q.score + (a.ran ? 0.1 : 0)) * 1000) / 1000 };
  }
  const labTask = {
    id: 'lab', title: 'Лаборатория: где поймают ошибку со слотом',
    simple: howCost.simple,
    lead: ui.brief({
      situation: 'В первом черновике требований записано: «Каждая запись занимает один слот — 30 минут». Никто пока не заметил, что шиномонтаж с балансировкой длится час, а с апреля таких записей будет в 3–4 раза больше. Артём даёт на дополнительные проверки по проекту <b>8 часов</b> вашего и чужого времени. Какие проверки вы включите в план — и где всплывёт ошибка?',
      todo: [
        'Выберите проверки в план проекта. Суммарно — не больше 8 часов. У каждой проверки указан этап, на котором она проходит.',
        'Нажмите «Прогнать проект» и прочитайте, что произошло на каждой выбранной проверке и чем всё кончилось.',
        'Можно поменять план и прогнать снова. Посмотрите, во что обошлась бы ошибка на других этапах.',
        'Ответьте на вопрос и нажмите «Проверить». Засчитывается, если ошибку поймали на анализе требований или на проектировании и ответ на вопрос верный.'
      ],
      lookTitle: 'Подсказка',
      look: 'Ошибку в требовании видит тот, кто знает реальную работу станции, — и только если ему показать требование в понятном виде: вслух по сценариям или кликабельным прототипом. Тесты по спецификации проверяют спецификацию, а не жизнь.'
    }),
    blank: () => ({ picked: [], ran: false, q: [] }),
    reference: () => ({ picked: ['c-review', 'c-proto'], ran: true, q: quizRef(LAB_Q) }),
    render(el, ctx) {
      el.classList.add('msd-root');
      const a = ctx.ans; a.picked = a.picked || []; a.q = a.q || [];
      el.innerHTML = `<div class="stack">
        <div class="msd-clock" data-bud></div>
        <div class="stack tight" data-chk></div>
        <div data-run></div>
        <div data-out></div>
        <div class="card flat" data-q></div>
      </div>`;
      function draw() {
        const r = labEval(a), left = LAB_BUDGET - r.hours;
        TR.$('[data-bud]', el).innerHTML = `<span class="small">В плане <b class="tnum">${r.hours}</b> ч из ${LAB_BUDGET}</span>${ui.meter(r.hours / LAB_BUDGET, left < 0 ? 'bad' : left <= 1 ? 'warn' : '')}`;
        TR.$('[data-chk]', el).innerHTML = CHECKS.map(c => {
          const on = a.picked.includes(c.id), dis = ctx.readonly || (!on && c.h > left);
          const shown = a.ran && on;
          return `<button type="button" class="msd-chk ${shown ? (c.hit ? 'hit' : 'miss') : ''}" data-c="${c.id}" aria-pressed="${on}" ${dis ? 'disabled' : ''}><span class="box" aria-hidden="true"></span><span><span class="st">${esc(ST(c.st).t)}</span>${esc(c.t)}${shown ? `<span class="rs">${c.hit ? '✓ ' : '— '}${esc(c.res)}</span>` : ''}</span><span class="h">${c.h} ч</span></button>`;
        }).join('');
        TR.$('[data-run]', el).innerHTML = ctx.readonly ? '' : `<div class="row"><button type="button" class="btn primary" data-go>${a.ran ? '⟲ Прогнать проект ещё раз' : '▶ Прогнать проект'}</button><span class="small dim">${a.picked.length ? 'План готов — посмотрим, что будет.' : 'Можно прогнать и без проверок — посмотрите, чем это кончится.'}</span></div>`;
        const out = TR.$('[data-out]', el);
        if (!a.ran) { out.innerHTML = ''; return; }
        const o = r.out;
        const tl = STAGE_ORDER.map(s => {
          const here = CHECKS.filter(c => c.st === s && a.picked.includes(c.id));
          const caught = r.stage === s;
          const past = STAGE_ORDER.indexOf(s) > STAGE_ORDER.indexOf(r.stage);
          let txt, k = '';
          if (past) { txt = 'Ошибка уже исправлена — здесь всё спокойно.'; k = 'ok'; }
          else if (caught) { txt = `<b>${esc(o.t)}.</b> ${o.d}`; k = o.k; }
          else txt = here.length ? `Проверки прошли, ошибку не заметили: ${here.map(c => '«' + esc(c.t) + '»').join(', ')}.` : 'Проверок, которые могли бы её заметить, не было. Ошибка едет дальше.';
          return `<div class="msd-ev ${k}"><span class="d">${esc(s === 'ops' ? 'Сезон, апрель' : ST(s).t)}</span><div class="small">${txt}</div></div>`;
        }).join('');
        out.innerHTML = `<div class="stack">
          <div class="msd-stats">
            <div class="stat"><span class="k">Где поймали</span><span class="v ${o.k}">${esc(r.stage === 'ops' ? 'в сезон' : ST(r.stage).t.toLowerCase())}</span></div>
            <div class="stat"><span class="k">Цена исправления</span><span class="v ${o.k}">×${o.x}</span><span class="s">если на анализе — ×1</span></div>
            <div class="stat"><span class="k">Потрачено на проверки</span><span class="v">${r.hours} ч</span></div>
          </div>
          <div class="msd-tl">${tl}</div>
          <details class="more"><summary>Во что обошлась бы ошибка на каждом этапе</summary><div>${ui.table(['Где поймали', 'Цена', 'Что переделываем'], STAGE_ORDER.filter(s => OUT[s]).map(s => [s === 'ops' ? 'В сезон' : ST(s).t, '×' + OUT[s].x, OUT[s].d]))}</div></details>
        </div>`;
      }
      draw();
      ui.quiz(TR.$('[data-q]', el), Object.assign({}, LAB_Q, { value: a.q, readonly: ctx.readonly, reveal: ctx.result, onChange: v => { a.q = v; ctx.save(); } }));
      TR.on(el, 'click', '[data-c]', (e, b) => {
        if (ctx.readonly) return;
        const id = b.dataset.c;
        if (a.picked.includes(id)) a.picked = a.picked.filter(x => x !== id);
        else if (CHECKS.find(c => c.id === id).h <= LAB_BUDGET - labEval(a).hours) a.picked.push(id);
        a.ran = false; ctx.save(); draw();
      });
      TR.on(el, 'click', '[data-go]', () => {
        if (ctx.readonly) return;
        a.ran = true; ctx.save();
        ctx.decide('План проверок (лаборатория со слотом)', a.picked.map(id => CHECKS.find(c => c.id === id).t).join('; ') || 'без проверок');
        draw();
      });
    },
    check(ans) {
      const r = labEval(ans), notes = [];
      if (!(ans && ans.ran)) notes.push({ ok: 'warn', html: 'Проект так и не прогнали — нажмите «Прогнать проект», чтобы увидеть последствия плана.' });
      notes.push({ ok: r.out.k === 'ok' ? true : r.out.k === 'warn' ? 'warn' : false, html: `${r.out.t} (цена ×${r.out.x}). ${r.first ? `Сработала проверка «${esc(r.first.t)}».` : 'Ни одна выбранная проверка не могла заметить ошибку в требовании.'}` });
      const miss = CHECKS.filter(c => r.picked.includes(c.id) && !c.hit);
      if (miss.length && r.out.k !== 'ok') notes.push({ ok: 'warn', html: `Не заметили ошибку: ${miss.map(c => '«' + esc(c.t) + '»').join(', ')}. Эти проверки полезны, но проверяют не правильность требования.` });
      if (r.stage === 'dev') notes.push({ ok: 'warn', html: 'Разговор втроём перед спринтом сработал — хорошо. Но есть способы найти ошибку ещё раньше и дешевле: с теми, кто знает работу станции.' });
      notes.push(r.q.ok ? { ok: true, html: 'Вопрос: верно — тесты проверяют соответствие требованию, а не само требование.' } : { ok: false, html: 'Вопрос: подумайте, с чем сравнивает систему автотест — и откуда он знает, как должно быть.' });
      const ok = r.score >= 0.8 && (r.stage === 'req' || r.stage === 'design') && r.q.ok;
      return {
        ok, score: r.score, notes,
        summary: `${r.out.t}: цена ×${r.out.x}, проверки — ${r.hours} ч из ${LAB_BUDGET}.`,
        mentor: ok ? null : r.stage === 'ops' || r.stage === 'deploy' ? 'Кто в «Искре» сразу скажет, сколько длится шиномонтаж? И в какой момент проекта этому человеку проще всего показать правило «одна запись — 30 минут»?' : r.stage === 'dev' ? 'Почти. А можно ли показать правило Марине Олеговне или мастерам ещё до спринта?' : null
      };
    },
    explain: `<p>Ошибку в требовании ловят не тесты, а <b>люди, которые знают реальную работу</b>, — если показать им требование в понятном виде:</p>
      <ul class="checks">
        <li><b>Ревью требований вслух по сценариям</b> с Мариной Олеговной — 2 часа, цена исправления ×1. Самый дешёвый и самый недооценённый способ.</li>
        <li><b>Кликабельный прототип</b> для мастеров — люди «пробуют» систему до кода и натыкаются на ошибку сами.</li>
        <li><b>Разговор втроём перед спринтом</b> (аналитик, разработчик, тестировщик) — ловит неоднозначности, но позже и дороже.</li>
        <li><b>Пилот</b> ловит всё, но поздно: поверх ошибки уже построены код, данные и обучение.</li>
      </ul>
      <p>Подпись Тимура, красивые макеты, автотесты и нагрузочный тест нужны, но эту ошибку не ловят: подпись — это согласование, а не проверка; макеты и тесты повторяют требование. В терминах качества: тесты отвечают на вопрос «правильно ли мы сделали систему?» (<b>верификация</b>), а ревью и прототипы — «ту ли систему мы делаем?» (<b>валидация</b>). Цена ×1 → ×100 — иллюстрация эмпирического наблюдения Боэма; точные множители в каждом проекте свои, но направление одно.</p>`,
    report: ans => {
      const r = labEval(ans);
      return `- План: ${r.picked.map(id => CHECKS.find(c => c.id === id).t).join('; ') || 'без проверок'} (${r.hours} ч)\n- Итог: ${r.out.t}, цена ×${r.out.x}\n- Вопрос про тесты: ${r.q.ok ? 'верно' : 'неверно'}`;
    }
  };

  // =====================================================================
  // Практика 5. Ответ Тимуру: «давайте сразу программировать»
  // =====================================================================
  const T_RUBRIC = [
    'Признаёт его цель и срок: MVP к 15 марта, с 1 апреля сезон — время действительно дорого',
    'Объясняет, что до кода нужно понять, что строим: без требований и проектирования разработчики угадывают и переделывают',
    'Приводит цену ошибки: ошибка в требованиях, найденная в сезон, стоит в десятки раз дороже, чем на бумаге (пример: шиномонтаж час, а слот 30 минут)',
    'Снимает страх «долгого анализа»: работаем итерациями, первые задачи уйдут в разработку уже в середине ноября, каждые 2 недели — показ, до сезона — пилот на одной станции',
    'Говорит, что нужно от «Искры»: немного времени Марины Олеговны и мастеров на интервью и проверку требований — это быстрее, чем переделывать'
  ];
  const T_REF = 'Тимур Рашидович, вы правы: время дорого — MVP нужен к 15 марта, а с 1 апреля сезон. Именно поэтому мы не начинаем писать код вслепую. Если программисты завтра начнут, они будут угадывать, как работает ваша станция. Пример из нашего же черновика: там записано «каждая запись — 30 минут», а шиномонтаж с балансировкой — час. На бумаге это исправляется за час. Если найдём на пилоте — две недели переделок и перенос сотен записей. Если в апреле — очереди на всех семи станциях и потерянные клиенты, та же боль, от которой вы уходите. Но «анализ» не значит «два месяца бумаг»: мы работаем короткими итерациями. Первые задачи по записи уйдут разработчикам уже 16 ноября, каждые две недели будем показывать работающие экраны Марине Олеговне, а в начале марта — пилот на Победы, до сезона. От вас нужно немного времени Марины Олеговны и пары мастеров: интервью в начале декабря и короткие проверки по ходу. Это самый быстрый путь к 15 марта, а не самый медленный.';
  const timurTask = {
    id: 'timur', title: 'Ответьте Тимуру: «Зачем анализ? Давайте сразу программировать»',
    simple: {
      icon: '🗣️',
      plain: 'Заказчик торопится, и это нормально. Аналитику нужно показать, что ранние этапы не тормозят, а экономят время и деньги, — на его же примере.',
      analogy: 'Прораб объясняет хозяину: «Можем завтра начать штробить. Но если не нарисуем, где холодильник, через месяц будем сбивать плитку. Дайте мне два часа на замер — и начнём без переделок».',
      tech: 'Аргументы: цена ошибки растёт по этапам (Боэм); итеративная разработка и MVP дают раннюю обратную связь (Скрам-гайд, Эрик Рис); вовлечение бизнеса в проверку требований — валидация (BABOK, Вигерс). Говорить — языком заказчика: сроки, деньги, клиенты.'
    },
    lead: ui.brief({
      situation: 'Вечером Тимур Рашидович пишет Артёму, а тот пересылает вам: «Вчера я вам всё рассказал. Зачем до конца ноября какие-то требования и схемы? Пусть программисты начинают завтра, до сезона четыре месяца». Артём: «Напиши ему ответ — коротко и по делу. Только без слова „жизненный цикл“».',
      todo: [
        'Напишите 5–8 предложений, от 200 символов: на языке Тимура — сроки, деньги, клиенты.',
        'Покажите, почему ранние этапы экономят время, и снимите страх, что «анализ — это два месяца бумаг».',
        'Нажмите «Проверить с Верой (Claude)» или «Сверить с эталоном самому» и отметьте раскрытые пункты. Засчитывается от 60 %.'
      ],
      lookTitle: 'На что опереться',
      look: 'MVP к 15 марта, сезон с 1 апреля. Ошибка «слот 30 минут, а шиномонтаж час»: ×1 на бумаге, две недели на пилоте, хаос в сезон. Первый спринт — 16 ноября, показ каждые 2 недели, пилот на Победы в начале марта. Нужны Марина Олеговна и мастера.'
    }),
    blank: () => ({ j: {} }),
    reference: () => ({ j: { text: T_REF, self: T_RUBRIC.map(() => true) } }),
    render(el, ctx) {
      el.classList.add('msd-root');
      el.insertAdjacentHTML('beforeend', ui.say('timur', 'Вчера я вам всё рассказал. Зачем до конца ноября какие-то требования и схемы? Пусть программисты начинают завтра, до сезона четыре месяца.'));
      const j = document.createElement('div'); j.style.marginTop = '12px'; el.appendChild(j);
      ui.justify(j, {
        id: 'msd-timur', q: 'Что ответить Тимуру Рашидовичу?', qPlain: 'Объясните владельцу сети автосервисов, почему нельзя сразу начать программировать: зачем нужны анализ требований и проектирование, как растёт цена ошибки (пример: шиномонтаж длится час, а в требованиях слот 30 минут), и почему итерации и MVP не задержат срок 15 марта.',
        rubric: T_RUBRIC, reference: T_REF, value: ctx.ans.j, readonly: ctx.readonly, minLen: 200,
        placeholder: 'Тимур Рашидович, …',
        onChange: v => { ctx.ans.j = v; ctx.save(); ctx.decide('Ответ Тимуру: зачем анализ', v.text || ''); }
      });
    },
    check(ans) {
      const s = ui.justifyScore(ans && ans.j);
      return {
        ok: s >= 0.6, score: s,
        summary: s ? `Оценка ответа: ${Math.round(s * 100)} %.` : 'Напишите ответ (от 200 символов) и проверьте его с Верой или сверьте с эталоном сами.',
        notes: s && s < 0.6 ? [{ ok: false, html: 'Тимура убеждают не термины, а его же деньги и сроки. Покажите на примере со слотом, сколько стоит ошибка на бумаге и в сезон, и что первые задачи в разработку уйдут уже в ноябре.' }] : []
      };
    },
    explain: '<p>Сильный ответ заказчику, который торопит, строится из трёх шагов: <b>согласиться с целью</b> («время дорого — да»), <b>показать риск на его примере</b> (шиномонтаж и слот: час на бумаге против хаоса в сезон) и <b>предложить быстрый путь</b> (итерации, первый спринт 16 ноября, показ каждые две недели, пилот до сезона). Просьба о времени Марины Олеговны звучит как вклад в его срок, а не как наша прихоть.</p><p>Слова «жизненный цикл», «верификация», «Боэм» заказчику не нужны — они нужны вам, чтобы ответ был точным. Как устроены итерации и почему «Орбита» не работает по одному большому ТЗ, разберём в тренировке «Подходы к организации разработки».</p>',
    report: ans => (ans && ans.j && ans.j.text) ? ans.j.text : '—'
  };

  // =====================================================================
  TR.stage({
    id: ID,
    when: 'вторник, 3 ноября, 11:00 · «Орбита», переговорная «Старт»',
    intro: [
      { who: 'artem', html: 'Вчера в 21:47 Тимур Рашидович прислал письмо — длинное, как он и обещал. А у меня есть договор: там сроки и состав работ. Через час я хочу видеть, что мы из всего этого поняли, и план до весны.' },
      { who: 'vera', html: 'Письмо заказчика — первый артефакт проекта. Сегодня мы разметим его и вытащим факты в блокнот: на них будет держаться всё — цели, приоритеты, требования. А ещё посмотрим, через какие этапы пройдёт «Искра Онлайн» до 15 марта и почему ошибку в требованиях дешевле всего поймать прямо сейчас.' },
      { who: 'gleb', html: 'И чтобы никаких «потом разберёмся». Я видел проект, где про длинные услуги вспомнили в сезон. Больше не хочу.' }
    ],
    glossary: [
      { term: 'Жизненный цикл ПО (SDLC)', simple: 'Путь системы от идеи до вывода из работы: зачем → что → как → сделать → проверить → запустить → жить и развиваться.', tech: 'Software Development Life Cycle. Этапы: инициация, анализ требований, проектирование, разработка, тестирование, внедрение, эксплуатация и сопровождение. Стандарты: ISO/IEC/IEEE 12207, ГОСТ 34.601-90.' },
      { term: 'Инициация', simple: 'Решаем, зачем проект и стоит ли он денег.', tech: 'Первый этап: цели, рамки, бюджет и срок, договор. Артефакты: протокол кик-оффа, концепция или устав проекта.' },
      { term: 'Кик-офф', simple: 'Первая встреча заказчика и команды: знакомимся и договариваемся о главном.', tech: 'Стартовая встреча проекта: цели, рамки, роли, сроки, каналы связи.' },
      { term: 'Артефакт', simple: 'Любой результат работы, который можно передать другому: документ, схема, макет, код.', tech: 'Результат этапа, который служит входом следующему: спецификация требований, макет, модель данных, сборка, тест-кейс, отчёт о дефекте.' },
      { term: 'Спецификация требований', simple: 'Документ, где записано, что должна делать система и по каким правилам.', tech: 'Результат анализа требований: пользовательские истории и сценарии, бизнес-правила, нефункциональные требования, критерии приёмки.' },
      { term: 'Внедрение', simple: 'Запуск в работу: выпустить, перенести данные, научить людей.', tech: 'Этап ввода в эксплуатацию: релиз, миграция данных, обучение, инструкции, пилот.' },
      { term: 'Пилот', simple: 'Пробный запуск на одной станции, прежде чем на всех.', tech: 'Ограниченная опытная эксплуатация для проверки системы в реальных условиях. У «Искры» — станция Победы, 1–14 марта.' },
      { term: 'Сопровождение', simple: 'Жизнь после запуска: чиним, улучшаем, добавляем новое.', tech: 'Эксплуатация и сопровождение: исправление дефектов, обработка обращений, запросы на изменение, новые версии.' },
      { term: 'MVP', simple: 'Самая маленькая версия, которая уже решает главную задачу по-настоящему.', tech: 'Minimum Viable Product — минимально жизнеспособный продукт (Эрик Рис, «Бизнес с нуля»). У «Искры» — к 15 марта.' },
      { term: 'Итерация', simple: 'Короткий круг работы: немного проанализировали, сделали, проверили, показали.', tech: 'Повторяющийся цикл фиксированной длины (в Scrum — спринт, у «Орбиты» 2 недели), в конце которого есть работающий прирост продукта.' },
      { term: 'Цена ошибки (1–10–100)', simple: 'Чем позже нашли ошибку, тем дороже её исправить.', tech: 'Эмпирическое наблюдение Б. Боэма (1981): дефект требований в эксплуатации обходится в десятки–сотни раз дороже, чем на анализе. Множители условны, направление устойчиво.' },
      { term: 'Верификация и валидация', simple: 'Верификация — «сделали ли мы правильно?», валидация — «то ли мы делаем?».', tech: 'Верификация — проверка соответствия результата требованиям (тесты). Валидация — проверка, что требования и система отвечают реальным потребностям (ревью с бизнесом, прототипы, пилот).' }
    ],
    outro: 'В блокноте — семь фактов кик-оффа: на них будут держаться цели, приоритеты и требования. Вы знаете, через какие этапы пройдёт «Искра Онлайн», что аналитик делает на каждом и почему ошибку в требованиях дешевле всего поймать на ревью с Мариной Олеговной, а не в апреле. Завтра — знакомство с командой «Орбиты»: кто есть кто и кому вы будете задавать вопросы.',
    tasks: [howCycle, howTimeline, howCost, kickTask, stagesTask, roleTask, labTask, timurTask]
  });
})();
