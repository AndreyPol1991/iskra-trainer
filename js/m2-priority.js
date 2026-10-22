/* Модуль 2, занятие 6: приоритизация и ценность фичи.
   Теория: how-value — ценность и связь с целями F-goal (дерево целей), матрица «ценность / сложность», стоимость
   задержки и WSJF (живой калькулятор); how-rice — RICE (живой калькулятор на примере кофейни), MoSCoW, ёмкость
   команды и правило «Must не больше 60 %»; how-kano — модель Кано (анкета: функциональный и дисфункциональный вопрос
   → категория), MVP «самокат, а не колесо», фиксированный срок и гибкий объём.
   Практика: RICE-калькулятор на восьми фичах «Искры» с обоснованием чисел; MoSCoW под ёмкость 80 очков до пилота с
   учётом зависимостей; Кано-классификация для Елены; лаборатория «собери MVP → проживи сезон» (цели F-goal к 30 апреля,
   риски интеграций, зависимости); объяснение Тимуру, почему бонусы не в MVP (ui.justify). */
'use strict';
(function () {
  const TR = window.TR, ui = TR.ui, esc = TR.esc;
  const ID = 'm2-priority';

  if (!document.getElementById('mpi-css')) document.head.insertAdjacentHTML('beforeend', `<style id="mpi-css">
    .mpi-root, .mpi-root .stack > * { min-width: 0; }
    .mpi-root .seg button { white-space: normal; text-align: left; }
    .mpi-root details.more > div { grid-template-columns: minmax(0, 1fr); }
    .mpi-goals { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
    .mpi-goal { text-align: left; border: 1px solid var(--border-strong); border-radius: 12px; padding: 10px 12px; background: var(--surface-2); color: var(--text); display: grid; gap: 4px; min-width: 0; }
    .mpi-goal .v { font: 600 17px/1.2 var(--f-mono); }
    .mpi-goal .s { font-size: 12.5px; color: var(--text-muted); line-height: 1.3; }
    .mpi-goal[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); box-shadow: 0 0 0 1px var(--accent) inset; }
    .mpi-fl { display: grid; gap: 6px; }
    .mpi-fi { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 10px; align-items: center; padding: 7px 12px; border-radius: 10px; border: 1px solid var(--border); background: var(--surface); font-size: 13.5px; }
    .mpi-fi.dir { border-color: var(--ok); background: var(--ok-soft); }
    .mpi-fi.help { border-color: color-mix(in srgb, var(--info) 55%, var(--border)); }
    .mpi-fi.base { border-style: dashed; }
    .mpi-fi.none { opacity: .55; }
    .mpi-tag { display: inline-block; font: 600 10.5px/1.4 var(--f-mono); letter-spacing: .05em; text-transform: uppercase; padding: 1px 7px; border-radius: 6px; background: var(--surface-3); color: var(--text-2); white-space: nowrap; }
    .mpi-tag.ok { background: var(--ok-soft); color: var(--ok); } .mpi-tag.bad { background: var(--bad-soft); color: var(--bad); } .mpi-tag.warn { background: color-mix(in srgb, var(--warn) 18%, transparent); color: var(--warn); } .mpi-tag.info { background: var(--info-soft); color: var(--info); }
    .mpi-mx { display: grid; grid-template-columns: 26px minmax(0, 1fr) minmax(0, 1fr); gap: 6px; }
    .mpi-mx .ax { font: 600 10.5px/1.2 var(--f-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--text-muted); display: flex; align-items: center; justify-content: center; }
    .mpi-mx .ax.v { writing-mode: vertical-rl; transform: rotate(180deg); grid-row: 1 / 3; }
    .mpi-mx .ax.h { grid-column: 2 / 4; }
    .mpi-cell { border: 1px solid var(--border); border-radius: 12px; padding: 10px; background: var(--surface); display: grid; gap: 6px; align-content: start; min-height: 104px; min-width: 0; }
    .mpi-cell h5 { font: 600 13.5px/1.25 var(--f-brand); margin: 0; }
    .mpi-cell .s { font-size: 12px; color: var(--text-muted); }
    .mpi-cell .ps { display: flex; flex-wrap: wrap; gap: 5px; }
    .mpi-cell .chip[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); color: var(--text); }
    .mpi-cell.qw { background: color-mix(in srgb, var(--ok) 8%, var(--surface)); }
    .mpi-cell.pit { background: color-mix(in srgb, var(--bad) 6%, var(--surface)); }
    .mpi-calc { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; }
    .mpi-calc label { display: grid; gap: 4px; font-size: 12.5px; color: var(--text-2); min-width: 0; }
    .mpi-calc input[type=range] { width: 100%; }
    .mpi-calc .val { font: 600 14px/1 var(--f-mono); color: var(--text); }
    .mpi-res { display: flex; flex-wrap: wrap; gap: 6px 16px; align-items: baseline; padding: 10px 12px; border-radius: 12px; background: var(--code-bg); border: 1px solid var(--border); }
    .mpi-res .big { font: 600 22px/1 var(--f-mono); color: var(--accent); }
    .mpi-res code { font: 500 13px/1.4 var(--f-mono); color: var(--text-2); overflow-wrap: anywhere; }
    .mpi-mosc { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; }
    .mpi-mosc button { text-align: left; border: 1px solid var(--border-strong); border-radius: 12px; padding: 10px; background: var(--surface-2); color: var(--text); display: grid; gap: 2px; min-width: 0; }
    .mpi-mosc button b { font: 700 22px/1 var(--f-brand); }
    .mpi-mosc button[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); }
    .mpi-cap { display: grid; gap: 6px; }
    .mpi-bar { position: relative; display: flex; height: 22px; border-radius: 7px; overflow: hidden; background: var(--surface-3); border: 1px solid var(--border); }
    .mpi-bar i { display: block; height: 100%; }
    .mpi-bar .M { background: var(--accent); } .mpi-bar .S { background: color-mix(in srgb, var(--violet) 70%, var(--surface-3)); } .mpi-bar .C { background: color-mix(in srgb, var(--warn) 55%, var(--surface-3)); } .mpi-bar .X { background: repeating-linear-gradient(135deg, var(--bad) 0 6px, color-mix(in srgb, var(--bad) 45%, var(--surface-3)) 6px 12px); }
    .mpi-bar .mk { position: absolute; top: -2px; bottom: -2px; width: 0; border-left: 2px dashed var(--text); opacity: .7; }
    .mpi-leg { display: flex; flex-wrap: wrap; gap: 4px 14px; font-size: 12.5px; color: var(--text-muted); }
    .mpi-leg i { display: inline-block; width: 14px; height: 8px; border-radius: 3px; margin-right: 5px; vertical-align: middle; }
    .mpi-rc { display: grid; gap: 8px; padding: 12px; border: 1px solid var(--border); border-radius: 12px; background: var(--surface); }
    .mpi-rc h4 { font: 600 14.5px/1.3 var(--f-brand); margin: 0; display: flex; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
    .mpi-rc h4 .mpi-tag { white-space: normal; } .mpi-rc { min-width: 0; }
    .mpi-rc .ev { font-size: 13px; color: var(--text-2); line-height: 1.45; }
    .mpi-rsel { display: grid; grid-template-columns: minmax(0, 2fr) minmax(0, 1.3fr) minmax(0, 1.1fr) auto; gap: 8px; align-items: end; }
    .mpi-rsel label { display: grid; gap: 3px; font-size: 11.5px; color: var(--text-muted); min-width: 0; }
    .mpi-rsel select { width: 100%; min-width: 0; }
    .mpi-rsel select.ok { border-color: var(--ok); box-shadow: 0 0 0 1px var(--ok) inset; } .mpi-rsel select.bad { border-color: var(--bad); box-shadow: 0 0 0 1px var(--bad) inset; }
    .mpi-rsel .sc { font: 600 15px/1.2 var(--f-mono); text-align: right; min-width: 64px; }
    .mpi-rsel .sc small { display: block; font: 500 10.5px/1.2 var(--f-mono); color: var(--text-muted); }
    .mpi-rank { display: grid; gap: 4px; }
    .mpi-rk { display: grid; grid-template-columns: 22px minmax(0, 1fr) 90px 56px; gap: 8px; align-items: center; font-size: 13px; }
    .mpi-rk .n { font: 600 12px/1 var(--f-mono); color: var(--text-muted); }
    .mpi-rk .tr { height: 10px; border-radius: 4px; background: var(--surface-3); overflow: hidden; }
    .mpi-rk .tr i { display: block; height: 100%; background: var(--accent); }
    .mpi-rk .x { font: 600 12.5px/1 var(--f-mono); text-align: right; }
    .mpi-mrow { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 10px; align-items: center; padding: 9px 12px; border: 1px solid var(--border); border-radius: 12px; background: var(--surface); }
    .mpi-mrow.ok { border-color: var(--ok); } .mpi-mrow.bad { border-color: var(--bad); } .mpi-mrow.warn { border-color: var(--warn); }
    .mpi-mrow .t { font-size: 14px; font-weight: 600; line-height: 1.3; }
    .mpi-mrow .sub { font-size: 12.5px; color: var(--text-muted); line-height: 1.35; }
    .mpi-mrow .why { grid-column: 1 / -1; font-size: 12.5px; color: var(--text-2); }
    .mpi-mb { display: flex; gap: 4px; }
    .mpi-mb button { width: 38px; height: 34px; border-radius: 8px; border: 1px solid var(--border-strong); background: var(--surface-2); color: var(--text-2); font: 700 14px/1 var(--f-brand); }
    .mpi-mb button[aria-pressed="true"][data-c="M"] { background: var(--accent); border-color: var(--accent); color: var(--surface); }
    .mpi-mb button[aria-pressed="true"][data-c="S"] { background: color-mix(in srgb, var(--violet) 70%, var(--surface-3)); border-color: var(--violet); color: var(--text); }
    .mpi-mb button[aria-pressed="true"][data-c="C"] { background: color-mix(in srgb, var(--warn) 55%, var(--surface-3)); border-color: var(--warn); color: var(--text); }
    .mpi-mb button[aria-pressed="true"][data-c="W"] { background: var(--surface-3); border-color: var(--text-muted); color: var(--text); }
    .mpi-mb button:disabled { cursor: default; }
    .mpi-pick { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; gap: 10px; align-items: center; text-align: left; border: 1px solid var(--border); border-radius: 10px; padding: 8px 12px; background: var(--surface); color: var(--text); width: 100%; }
    .mpi-pick .box { width: 18px; height: 18px; border-radius: 5px; border: 1.5px solid var(--border-strong); }
    .mpi-pick[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); }
    .mpi-pick[aria-pressed="true"] .box { background: var(--accent); border-color: var(--accent); box-shadow: inset 0 0 0 3px var(--surface); }
    .mpi-pick .h { font: 600 12px/1 var(--f-mono); color: var(--text-2); white-space: nowrap; }
    .mpi-pick .sub { display: block; font-size: 12px; color: var(--text-muted); margin-top: 2px; }
    .mpi-pick .dp { display: block; font-size: 11.5px; color: var(--violet); margin-top: 2px; }
    .mpi-tl { display: grid; gap: 8px; }
    .mpi-ev { display: grid; grid-template-columns: 96px minmax(0, 1fr); gap: 10px; padding: 9px 12px; border-radius: 10px; border: 1px solid var(--border); background: var(--surface); font-size: 13.5px; }
    .mpi-ev .d { font: 600 12px/1.35 var(--f-mono); color: var(--text-muted); }
    .mpi-ev.ok { border-color: color-mix(in srgb, var(--ok) 55%, var(--border)); }
    .mpi-ev.bad { border-color: color-mix(in srgb, var(--bad) 55%, var(--border)); background: color-mix(in srgb, var(--bad-soft) 60%, var(--surface)); }
    .mpi-ev.warn { border-color: color-mix(in srgb, var(--warn) 55%, var(--border)); }
    .mpi-stats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
    .mpi-kano { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 10px; }
    .mpi-kano label { display: grid; gap: 4px; font-size: 13px; min-width: 0; }
    .mpi-kano select { width: 100%; min-width: 0; }
    .mpi-road { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; }
    .mpi-road .st { border: 1px solid var(--border); border-radius: 12px; padding: 10px; background: var(--surface); text-align: center; display: grid; gap: 4px; }
    .mpi-road .st .e { font-size: 28px; line-height: 1; }
    .mpi-road .st.no { opacity: .9; border-style: dashed; }
    .mpi-road .st .s { font-size: 12px; color: var(--text-muted); }
    .mpi-feat { display: flex; flex-wrap: wrap; gap: 6px; }
    .mpi-feat .chip { cursor: default; }
    .mpi-wsjf { display: grid; gap: 6px; }
    .mpi-wr { display: grid; grid-template-columns: minmax(0, 1.4fr) repeat(4, minmax(0, 1fr)) 64px; gap: 6px; align-items: center; font-size: 13px; }
    .mpi-wr.hd { font: 600 10.5px/1.2 var(--f-mono); letter-spacing: .05em; text-transform: uppercase; color: var(--text-muted); }
    .mpi-wr select { width: 100%; min-width: 0; }
    .mpi-wr .x { font: 600 14px/1 var(--f-mono); text-align: right; color: var(--accent); }
    @media (max-width: 760px) {
      .mpi-goals { grid-template-columns: minmax(0, 1fr); }
      .mpi-calc { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .mpi-mosc { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .mpi-rsel { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); }
      .mpi-rsel label:first-child { grid-column: 1 / -1; }
      .mpi-kano { grid-template-columns: minmax(0, 1fr); }
      .mpi-road { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .mpi-wr { grid-template-columns: minmax(0, 1fr) repeat(4, minmax(0, 1fr)); }
      .mpi-wr > :first-child { grid-column: 1 / -1; }
      .mpi-wr .x { grid-column: 1 / -1; text-align: left; }
      .mpi-wr.hd > :first-child, .mpi-wr.hd > :last-child { display: none; }
    }
    @media (max-width: 460px) {
      .mpi-mx { grid-template-columns: minmax(0, 1fr); } .mpi-mx .ax { display: none; }
      .mpi-mrow { grid-template-columns: minmax(0, 1fr); }
      .mpi-stats { grid-template-columns: minmax(0, 1fr); }
      .mpi-ev { grid-template-columns: minmax(0, 1fr); gap: 2px; }
      .mpi-rk { grid-template-columns: 22px minmax(0, 1fr) 52px; } .mpi-rk .tr { display: none; }
      .mpi-pick { grid-template-columns: auto minmax(0, 1fr); } .mpi-pick .h { grid-column: 2; }
    }
  </style>`);

  // ---------- общие помощники и данные ----------
  const quizRef = cfg => cfg.options.map((o, i) => o.ok ? i : -1).filter(i => i >= 0);
  const fmt = x => String(Math.round(x * 10) / 10).replace('.', ',');
  const num = x => Math.round(x).toLocaleString('ru-RU');
  const CAP = 80, RISK = 6, M_MAX = 48;
  const FEAT = [
    { id: 'arm', t: 'АРМ мастера-приёмщика', sub: 'расписание постов, записи, заказ-наряды, статусы', e: 12, deps: [] },
    { id: 'book', t: 'Онлайн-запись (сайт и приложение)', sub: 'свободные слоты, вход по телефону, BR-1 и BR-2', e: 14, deps: ['arm'] },
    { id: 'remind', t: 'Напоминания, отмена и перенос', sub: 'push/SMS за сутки и за 2 часа, отмена до 3 ч, неявка (BR-3, BR-4)', e: 5, deps: ['book'] },
    { id: 'tablet', t: 'Планшет механика', sub: 'фото проблемы, отметки по работам', e: 5, deps: ['arm'] },
    { id: 'extra', t: 'Согласование доп. работ в приложении', sub: 'фото, цена, 20 минут → звонок (BR-6 – BR-8)', e: 9, deps: ['tablet', 'book'] },
    { id: 'status', t: 'Статус ремонта и «Готов»', sub: 'push и SMS, бесплатное хранение (BR-13)', e: 4, deps: ['book'] },
    { id: 'pay', t: 'Онлайн-оплата', sub: 'ЮKassa, карта и СБП, чек 54-ФЗ (BR-10)', e: 9, deps: ['status'] },
    { id: 'corp', t: 'Кабинет компании «Шашка»', sub: 'автосогласование до 3 000 ₽, счёт раз в месяц (BR-9)', e: 8, deps: ['extra'] },
    { id: 'history', t: 'История обслуживания', sub: 'прошлые заказ-наряды, гарантия 6 мес / 10 000 км (BR-14)', e: 4, deps: ['book'] },
    { id: 'bonus', t: 'Бонусная программа', sub: '5 % баллами с работ, списание до 30 % (BR-11)', e: 10, deps: ['pay'] },
    { id: 'chat', t: 'Чат с мастером', sub: 'переписка клиента и мастера-приёмщика', e: 9, deps: ['book'] }
  ];
  const FT = id => FEAT.find(f => f.id === id);

  // =====================================================================
  // Теория 1. Ценность и связь с целями, матрица, стоимость задержки
  // =====================================================================
  const GOALS = [
    { id: 'calls', v: '21 % → 5 %', t: 'Потерянные обращения', dir: ['book'], help: ['remind', 'status'], base: ['arm'], why: 'Каждая онлайн-запись — звонок, который не потеряется в пик. Отмена в приложении и статус ремонта убирают ещё часть звонков.' },
    { id: 'noshow', v: '17 % → 8 %', t: 'Неявки', dir: ['remind'], help: [], base: ['book', 'arm'], why: '«5 почему» на интервью показало: забывают и не могут отменить. Напоминания и отмена в приложении бьют прямо в причину.' },
    { id: 'idle', v: '1 ч 40 → 20 мин', t: 'Простой на согласовании', dir: ['extra'], help: ['corp'], base: ['tablet', 'book', 'arm'], why: 'Согласование в приложении с фото и ценой; без планшета механику нечем сфотографировать проблему. Кабинет компании сокращает простой машин «Шашки».' }
  ];
  const HOUSE = [
    { id: 'h1', q: 'qw', t: 'Новые лампы', why: 'Час работы и 2 000 ₽ — а кухня сразу светлее. Быстрая победа: делаем первой.' },
    { id: 'h2', q: 'qw', t: 'Починить кран', why: 'Капает при гостях — неловко. Полчаса работы.' },
    { id: 'h3', q: 'big', t: 'Заменить столешницу', why: 'Дорого и долго, но это то, ради чего ремонт. Большая ставка: планировать, начинать рано.' },
    { id: 'h4', q: 'fill', t: 'Переклеить магниты', why: 'Дёшево, но никто не заметит. Если останется время.' },
    { id: 'h5', q: 'pit', t: 'Перенести мойку к окну', why: 'Трубы, штробы, две недели — а ценность сомнительна. Яма: не делать к приезду гостей.' },
    { id: 'h6', q: 'pit', t: 'Встроенная кофемашина', why: 'Дорого, нужна ниша и электрик, а кофе и так варят в турке.' }
  ];
  const HQ = [
    { id: 'big', t: 'Большие ставки', s: 'ценность высокая, сложность высокая' },
    { id: 'qw', t: 'Быстрые победы', s: 'ценность высокая, сложность низкая' },
    { id: 'pit', t: 'Ямы', s: 'ценность низкая, сложность высокая' },
    { id: 'fill', t: 'Заполнители', s: 'ценность низкая, сложность низкая' }
  ];
  const SCALE = [1, 2, 3, 5, 8, 13];
  const WS0 = [
    { id: 'w1', t: 'Напоминания', bv: 8, tc: 13, rr: 5, js: 3 },
    { id: 'w2', t: 'Бонусы', bv: 5, tc: 2, rr: 1, js: 8 },
    { id: 'w3', t: 'Чат с мастером', bv: 3, tc: 1, rr: 1, js: 8 }
  ];
  const howValue = {
    id: 'how-value', covers: ['rice'], title: 'Как это работает: ценность фичи и цели бизнеса', free: true, noReset: true,
    simple: {
      icon: '🎯',
      plain: 'Ценность фичи — это не «насколько она крутая», а насколько она двигает цели бизнеса и решает проблему пользователя. У «Искры» три цели в цифрах — каждую фичу проверяем вопросом: какую из них она двигает и насколько?',
      analogy: 'Гости приедут через две недели. Можно перенести мойку к окну — красиво, но не успеете. А можно поменять лампы и починить кран — кухня станет лучше уже завтра.',
      tech: 'Ценность оценивают относительно целей (BABOK v3, «Анализ стратегии»; Вигерс, глава о приоритизации). Матрица «ценность / сложность» (value/effort) — быстрый визуальный способ. Стоимость задержки (Cost of Delay, Дон Рейнертсен) — сколько бизнес теряет за каждую неделю, пока фичи нет; WSJF (Weighted Shortest Job First, SAFe) = стоимость задержки / размер работы.'
    },
    lead: ui.brief({
      situation: 'Понедельник, 7 декабря, 10:30. До встречи с Тимуром полчаса. Вера рисует на доске три цели: «В блокноте у вас восемнадцать фактов и тридцать хотелок. Всё к 15 марта не успеть. Начнём с вопроса: что из этого двигает цели?»',
      todo: ['Нажмите на каждую из трёх целей и посмотрите, какие фичи двигают её напрямую, какие помогают, а какие — фундамент.', 'Поиграйте с матрицей «ценность / сложность» на бытовом примере.', 'Измените оценки в калькуляторе стоимости задержки (WSJF) и посмотрите, как меняется порядок.'],
      look: 'Фича, которая не двигает ни одну цель, может быть хорошей — но не сейчас.'
    }),
    render(el) {
      el.classList.add('mpi-root');
      let g = 'calls', hs = 'h1';
      const ws = WS0.map(x => Object.assign({}, x));
      el.innerHTML = `<div class="stack">
        <h4>Дерево целей: какая фича что двигает</h4>
        <div class="mpi-goals" data-goals></div><div data-gl></div>
        <h4>Матрица «ценность / сложность»</h4>
        <div class="small dim">Пример: ремонт кухни, гости приедут через две недели. Нажмите на работу.</div>
        <div data-hm></div><div data-hc></div>
        <h4>Стоимость задержки и WSJF</h4>
        <p class="small muted">Стоимость задержки (Cost of Delay) — сколько теряем за каждую неделю без фичи. В SAFe её считают как сумму трёх оценок по шкале Фибоначчи: ценность для бизнеса, срочность (критичность ко времени) и снижение риска. WSJF = стоимость задержки / размер. Больше WSJF — делаем раньше.</p>
        <div class="mpi-wsjf" data-ws></div>
        ${ui.note('info', 'Срочность — это про сезон', 'У «Искры» срочность задаёт дата: с 1 апреля поток записей вырастает в 3–4 раза. Напоминания, которые не успели к сезону, — это месяц неявок по 17 % в самый дорогой период. Бонусы, которые запустят в мае, почти ничего не потеряют: клиенты не уйдут за месяц из-за отсутствия баллов.')}
        <details class="more"><summary>Как об этом спрашивают на собеседовании</summary><div>
          <p><b>«Как вы определяете ценность фичи?»</b> — Через цели бизнеса и проблемы пользователя: какую метрику и насколько она сдвинет, сколько людей затронет, сколько стоит, чем рискуем, если отложим. Цифры берём из данных, а не из громкости заказчика.</p>
          <p><b>«Что такое стоимость задержки?»</b> — Потери за единицу времени, пока фичи нет. Помогает выбрать порядок: фича с высокой стоимостью задержки и малым размером идёт первой (WSJF).</p>
        </div></details>
      </div>`;
      function draw() {
        TR.$('[data-goals]', el).innerHTML = GOALS.map(x => `<button type="button" class="mpi-goal" data-g="${x.id}" aria-pressed="${x.id === g}"><span class="s">${esc(x.t)}</span><span class="v">${esc(x.v)}</span></button>`).join('');
        const G = GOALS.find(x => x.id === g);
        const kind = id => G.dir.includes(id) ? ['dir', 'двигает напрямую', 'ok'] : G.help.includes(id) ? ['help', 'помогает', 'info'] : G.base.includes(id) ? ['base', 'фундамент', ''] : ['none', 'не влияет', ''];
        const order = id => ['dir', 'help', 'base', 'none'].indexOf(kind(id)[0]);
        TR.$('[data-gl]', el).innerHTML = `<div class="mpi-fl">${FEAT.slice().sort((a, b) => order(a.id) - order(b.id)).map(f => { const k = kind(f.id); return `<div class="mpi-fi ${k[0]}"><span>${esc(f.t)}</span><span class="mpi-tag ${k[2]}">${k[1]}</span></div>`; }).join('')}</div><p class="small muted" style="margin-top:8px">${esc(G.why)}</p>`;
        const cells = {}; HOUSE.forEach(h => (cells[h.q] = cells[h.q] || []).push(h));
        const cell = q => `<div class="mpi-cell ${q.id === 'qw' ? 'qw' : q.id === 'pit' ? 'pit' : ''}"><h5>${esc(q.t)}</h5><div class="s">${esc(q.s)}</div><div class="ps">${(cells[q.id] || []).map(h => `<button type="button" class="chip" data-h="${h.id}" aria-pressed="${h.id === hs}">${esc(h.t)}</button>`).join('')}</div></div>`;
        TR.$('[data-hm]', el).innerHTML = `<div class="mpi-mx"><div class="ax v">Ценность →</div>${cell(HQ[0])}${cell(HQ[1])}${cell(HQ[2])}${cell(HQ[3])}<div></div><div class="ax h">← сложность ниже</div></div>`;
        TR.$('[data-hc]', el).innerHTML = `<div class="card flat"><b>${esc(HOUSE.find(h => h.id === hs).t)}</b> — ${esc(HOUSE.find(h => h.id === hs).why)}</div>`;
        const opt = v => SCALE.map(s => `<option value="${s}" ${s === v ? 'selected' : ''}>${s}</option>`).join('');
        const rows = ws.map(w => ({ w, cod: w.bv + w.tc + w.rr })).map(o => Object.assign(o, { x: o.cod / o.w.js })).sort((a, b) => b.x - a.x);
        TR.$('[data-ws]', el).innerHTML = `<div class="mpi-wr hd"><span>Фича</span><span>Ценность</span><span>Срочность</span><span>Риск</span><span>Размер</span><span>WSJF</span></div>` + rows.map(({ w, x }) => `<div class="mpi-wr"><b>${esc(w.t)}</b>${['bv', 'tc', 'rr', 'js'].map(k => `<select data-w="${w.id}" data-k="${k}" aria-label="${esc(w.t)}: ${k === 'bv' ? 'ценность' : k === 'tc' ? 'срочность' : k === 'rr' ? 'снижение риска' : 'размер'}">${opt(w[k])}</select>`).join('')}<span class="x">${fmt(x)}</span></div>`).join('');
      }
      TR.on(el, 'click', '[data-g]', (e, b) => { g = b.dataset.g; draw(); });
      TR.on(el, 'click', '[data-h]', (e, b) => { hs = b.dataset.h; draw(); });
      el.addEventListener('change', e => { const s = e.target.closest('[data-w]'); if (!s) return; ws.find(w => w.id === s.dataset.w)[s.dataset.k] = +s.value; draw(); });
      draw();
    }
  };

  // =====================================================================
  // Теория 2. RICE, MoSCoW и ёмкость команды
  // =====================================================================
  const CAFE = {
    pay: { t: 'Оплата телефоном', r: 3000, i: 1, c: 100, e: 1, note: 'Охват — все гости за месяц, влияние среднее (очередь короче), есть данные кассы, сделать — неделя.' },
    loyal: { t: 'Программа лояльности', r: 1200, i: 1, c: 50, e: 3, note: 'Охват — постоянные гости, влияние предполагаемое: данных нет, уверенность 50 %.' },
    vegan: { t: 'Веганское меню', r: 300, i: 2, c: 80, e: 2, note: 'Охват небольшой, но для этих гостей влияние высокое: сейчас они уходят к соседям.' }
  };
  const MOSC = [
    { c: 'M', t: 'Must have', s: 'Без этого выпуск не имеет смысла', ex: 'Отпуск: паспорт и билеты', iskra: 'Без этого цели F-goal не достигаются к сезону.' },
    { c: 'S', t: 'Should have', s: 'Важно, но есть обходной путь', ex: 'Отпуск: зарядка для телефона (купим на месте)', iskra: 'Ценно, но станция переживёт сезон без этого — например, оплата на кассе.' },
    { c: 'C', t: 'Could have', s: 'Приятно, если останется время', ex: 'Отпуск: третья книга', iskra: 'Первым выпадает, если сработал риск. Это и есть запас.' },
    { c: 'W', t: 'Won’t have (this time)', s: 'Не в этот раз — договорились явно', ex: 'Отпуск: гитара', iskra: '«Не сейчас» — не «никогда»: записываем в бэклог следующих релизов.' }
  ];
  const howRice = {
    id: 'how-rice', covers: ['rice', 'moscow'], title: 'Как это работает: RICE, MoSCoW и ёмкость', free: true, noReset: true,
    simple: {
      icon: '🧮',
      plain: 'RICE превращает спор «что важнее» в числа: охват × влияние × уверенность / трудозатраты. MoSCoW делит всё на «обязательно», «желательно», «если успеем» и «не в этот раз» — и сверяет с тем, сколько команда успеет до срока.',
      analogy: 'Собираетесь в отпуск с одним чемоданом. Паспорт — обязательно. Зарядка — желательно, но можно купить. Третья книга — если влезет. Гитара — не в этот раз.',
      tech: 'RICE — метод Intercom (Шон Макбрайд): Reach (охват за период), Impact (влияние: 3 — массовое, 2 — высокое, 1 — среднее, 0,5 — низкое, 0,25 — минимальное), Confidence (уверенность: 100 / 80 / 50 %), Effort (трудозатраты). MoSCoW — метод DSDM (Дай Клегг): Must, Should, Could, Won’t; рекомендация DSDM — Must не больше 60 % трудозатрат, Could около 20 % — это запас на риски. Ёмкость = скорость команды × число итераций до срока.'
    },
    lead: ui.brief({
      situation: '10:40. Глеб приносит оценки: «Всё в очках. Наша скорость — 16 очков за спринт, до пилота 1 марта — пять спринтов, каникулы я уже вычел. Итого 80. Больше не будет, хоть кричите».',
      todo: ['Подвигайте ползунки RICE на примере кофейни и посмотрите, как каждый множитель меняет итог.', 'Нажмите на буквы MoSCoW — что значит каждая и как она звучит у «Искры».', 'Поиграйте с ёмкостью: сколько можно положить в Must, чтобы остался запас.'],
      look: 'Effort в RICE — в знаменателе: дешёвая фича с умеренной пользой может обогнать дорогую «большую».'
    }),
    render(el) {
      el.classList.add('mpi-root');
      let ex = 'pay', mo = 'M', must = 45, should = 25;
      let v = Object.assign({}, CAFE[ex]);
      el.innerHTML = `<div class="stack">
        <h4>RICE на примере кофейни</h4>
        <div class="row">${ui.seg('ex', Object.keys(CAFE).map(k => ({ v: k, t: esc(CAFE[k].t) })), ex)}</div>
        <div data-calc></div><div data-res></div>
        ${ui.note('warn', 'RICE не решает за вас', 'RICE сравнивает фичи одной шкалой, но не видит зависимостей (оплата без статуса «Готов» не заработает), закона (чек по 54-ФЗ обязателен) и срока. Это подсказка для разговора, а не приговор. И главное — честность чисел: охват и уверенность берут из данных, а не из энтузиазма.')}
        <h4>MoSCoW</h4>
        <div class="mpi-mosc" data-mo></div><div data-moc></div>
        <h4>Ёмкость: сколько влезет до срока</h4>
        <p class="small muted">Ёмкость — сколько работы команда успеет до срока: скорость (16 очков за спринт) × спринты (5 до пилота 1 марта) = 80 очков. Срок 15 марта не двигается, поэтому двигается объём.</p>
        <div class="mpi-calc" style="grid-template-columns:repeat(2,minmax(0,1fr))"><label>Must, очков <span class="val" data-mv></span><input type="range" min="10" max="80" step="1" value="${must}" data-cap="m" aria-label="Must, очков"></label><label>Should, очков <span class="val" data-sv></span><input type="range" min="0" max="50" step="1" value="${should}" data-cap="s" aria-label="Should, очков"></label></div>
        <div data-cap-out></div>
        <details class="more"><summary>Как об этом спрашивают на собеседовании</summary><div>
          <p><b>«Какие методы приоритизации вы знаете?»</b> — MoSCoW, RICE (или ICE — без охвата), Кано, матрица ценность/сложность, WSJF. Назовите, когда какой: MoSCoW — договориться о составе релиза со сроком, RICE — сравнить много фич числами, Кано — понять ожидания пользователей.</p>
          <p><b>«Всё — Must. Что делать?»</b> — Спросить, что будет, если этого не будет в релизе: если есть обходной путь — это Should. Сверить с ёмкостью: Must больше 60 % — нет запаса на риски, срок под угрозой.</p>
        </div></details>
      </div>`;
      function drawCalc() {
        TR.$('[data-calc]', el).innerHTML = `<div class="mpi-calc">
          <label>Охват, гостей в месяц <span class="val">${num(v.r)}</span><input type="range" min="100" max="5000" step="100" value="${v.r}" data-r="r" aria-label="Охват"></label>
          <label>Влияние <select data-r="i" aria-label="Влияние">${[3, 2, 1, 0.5, 0.25].map(x => `<option value="${x}" ${x === v.i ? 'selected' : ''}>${fmt(x)}</option>`).join('')}</select></label>
          <label>Уверенность, % <select data-r="c" aria-label="Уверенность">${[100, 80, 50].map(x => `<option value="${x}" ${x === v.c ? 'selected' : ''}>${x}</option>`).join('')}</select></label>
          <label>Трудозатраты, недель <span class="val">${v.e}</span><input type="range" min="1" max="8" step="1" value="${v.e}" data-r="e" aria-label="Трудозатраты"></label></div>`;
      }
      function drawRes() {
        const s = v.r * v.i * v.c / 100 / v.e;
        const all = Object.keys(CAFE).map(k => { const z = k === ex ? v : CAFE[k]; return { t: CAFE[k].t, s: z.r * z.i * z.c / 100 / z.e }; }).sort((a, b) => b.s - a.s);
        TR.$('[data-res]', el).innerHTML = `<div class="mpi-res"><span class="big">${num(s)}</span><code>${num(v.r)} × ${fmt(v.i)} × ${v.c} % / ${v.e} = ${num(s)}</code></div><p class="small muted">${esc(CAFE[ex].note)}</p><div class="small">Порядок сейчас: ${all.map((x, i) => `${i + 1}. ${esc(x.t)} (${num(x.s)})`).join(' · ')}</div>`;
        TR.$('[data-mo]', el).innerHTML = MOSC.map(m => `<button type="button" data-mo="${m.c}" aria-pressed="${m.c === mo}"><b>${m.c}</b><span class="small">${esc(m.t)}</span></button>`).join('');
        const M = MOSC.find(m => m.c === mo);
        TR.$('[data-moc]', el).innerHTML = `<div class="card flat"><b>${esc(M.t)}</b> — ${esc(M.s)}.<div class="small muted">${esc(M.ex)}. У «Искры»: ${esc(M.iskra)}</div></div>`;
        TR.$('[data-mv]', el).textContent = must; TR.$('[data-sv]', el).textContent = should;
        const tot = must + should, over = Math.max(0, tot - CAP), buf = Math.max(0, CAP - tot);
        const w = x => (x / Math.max(CAP, tot) * 100).toFixed(1) + '%';
        const msg = must > CAP ? ['bad', 'Must не влезает в ёмкость: срок сорван, даже если всё пойдёт идеально.'] : over ? ['bad', `Must + Should = ${tot} — на ${over} больше ёмкости. Часть Should не успеет, а риску негде упасть.`] : must > M_MAX ? ['warn', `Must = ${Math.round(must / CAP * 100)} % ёмкости — больше 60 %. Любой сбой (интеграция, болезнь) ударит прямо по обязательному.`] : buf < 6 ? ['warn', `Запас ${buf} очков. Глеб: «Интеграции с 1С и ЮKassa почти всегда съедают 5–8 очков».`] : ['ok', `Must ${Math.round(must / CAP * 100)} %, запас ${buf} очков: если сработает риск, выпадет только Should — обязательное успеет.`];
        TR.$('[data-cap-out]', el).innerHTML = `<div class="mpi-cap"><div class="mpi-bar"><i class="M" style="width:${w(Math.min(must, CAP))}"></i><i class="S" style="width:${w(Math.max(0, Math.min(should, CAP - must)))}"></i>${over ? `<i class="X" style="width:${w(over)}"></i>` : ''}<span class="mk" style="left:${w(M_MAX)}" title="60 %"></span></div>
          <div class="mpi-leg"><span><i style="background:var(--accent)"></i>Must</span><span><i style="background:color-mix(in srgb,var(--violet) 70%,var(--surface-3))"></i>Should</span><span><i style="background:var(--bad)"></i>не влезает</span><span>пунктир — 60 % ёмкости</span></div>
          <div class="small" style="color:var(--${msg[0]})">${esc(msg[1])}</div></div>`;
      }
      drawCalc(); drawRes();
      ui.onSeg(el, (n, x) => { if (n === 'ex') { ex = x; v = Object.assign({}, CAFE[ex]); drawCalc(); drawRes(); } });
      TR.on(el, 'click', '[data-mo]', (e, b) => { mo = b.dataset.mo; drawRes(); });
      el.addEventListener('input', e => {
        const r = e.target.closest('[data-r]'); if (r) { v[r.dataset.r] = +r.value; const lab = r.parentElement.querySelector('.val'); if (lab) lab.textContent = r.dataset.r === 'r' ? num(v.r) : v[r.dataset.r]; drawRes(); return; }
        const c = e.target.closest('[data-cap]'); if (c) { if (c.dataset.cap === 'm') must = +c.value; else should = +c.value; drawRes(); }
      });
      el.addEventListener('change', e => { const r = e.target.closest('select[data-r]'); if (r) { v[r.dataset.r] = +r.value; drawRes(); } });
    }
  };

  // =====================================================================
  // Теория 3. Модель Кано и MVP
  // =====================================================================
  const KANS = ['Мне нравится', 'Так и должно быть', 'Мне всё равно', 'Могу смириться', 'Мне не нравится'];
  // строки — ответ на функциональный вопрос, столбцы — на дисфункциональный
  const KTAB = [['Q', 'A', 'A', 'A', 'O'], ['R', 'I', 'I', 'I', 'M'], ['R', 'I', 'I', 'I', 'M'], ['R', 'I', 'I', 'I', 'M'], ['R', 'R', 'R', 'R', 'Q']];
  const KCAT = {
    M: { t: 'Обязательное (базовое)', s: 'Есть — не замечают, нет — возмущаются. Его отсутствие убивает продукт.' },
    O: { t: 'Одномерное (линейное)', s: 'Чем больше и лучше, тем довольнее. За это сравнивают с конкурентами.' },
    A: { t: 'Привлекательное (вау)', s: 'Не ждут, но радуются. Отсутствие не огорчает.' },
    I: { t: 'Безразличное', s: 'Есть или нет — всё равно. Деньги на ветер.' },
    R: { t: 'Обратное', s: 'Наличие раздражает. Убрать.' },
    Q: { t: 'Сомнительный ответ', s: 'Противоречие: «нравится, если есть» и «нравится, если нет». Переспросить.' }
  };
  const KPRE = [
    { id: 'towel', t: 'Отель: чистое полотенце', f: 1, d: 4 },
    { id: 'wifi', t: 'Отель: скорость Wi-Fi', f: 0, d: 4 },
    { id: 'choc', t: 'Отель: шоколадка на подушке', f: 0, d: 2 },
    { id: 'music', t: 'Отель: громкая музыка в лобби', f: 4, d: 0 },
    { id: 'coffee', t: '«Искра»: бесплатный кофе в зоне ожидания', f: 0, d: 3 }
  ];
  const howKano = {
    id: 'how-kano', covers: ['kano', 'lab'], title: 'Как это работает: модель Кано и MVP к сроку', free: true, noReset: true,
    simple: {
      icon: '😊',
      plain: 'Модель Кано делит свойства продукта по тому, как они влияют на удовлетворённость: обязательные (без них плохо), одномерные (чем больше, тем лучше), привлекательные (вау), безразличные и обратные. MVP — минимальный продукт, который уже решает главную задачу целиком, а не половина каждой фичи.',
      analogy: 'В отеле чистое полотенце никто не хвалит — но без него вы напишете гневный отзыв. Быстрый Wi-Fi — чем быстрее, тем лучше. Шоколадка на подушке — приятный сюрприз.',
      tech: 'Модель Кано (Нориаки Кано, 1984): анкета из пар вопросов — функционального («Как вы отнесётесь, если в продукте есть X?») и дисфункционального («…если X нет?»); ответ определяется по таблице оценки Кано. Со временем «вау» становится базовым. MVP (Minimum Viable Product, Эрик Рис, «Бизнес с нуля»); метафора «самокат, а не колесо» — Хенрик Книберг. Фиксированный срок и гибкий объём — принцип таймбоксинга (DSDM).'
    },
    lead: ui.brief({
      situation: '10:50. Ника заглядывает в переговорную: «Тимур Рашидович вчера сказал мне: сделайте как в такси, с чатом и тёмной темой, чтобы было вау». Вера: «А давайте спросим себя, что для Елены — вау, а что — само собой».',
      todo: ['Выберите пример или ответьте на два вопроса анкеты Кано сами — увидите категорию.', 'Посмотрите, как «вау» превращается в «обязательное» со временем.', 'Переключите «колесо» и «самокат» — чем MVP отличается от «сделаем всё, но по кусочку».'],
      look: 'Категория зависит от пары ответов: что человек чувствует, если свойство есть, и если его нет.'
    }),
    render(el) {
      el.classList.add('mpi-root');
      let f = 1, d = 4, road = 'bad';
      el.innerHTML = `<div class="stack">
        <h4>Анкета Кано: пара вопросов → категория</h4>
        <div class="row">${KPRE.map(p => `<button type="button" class="chip" data-kp="${p.id}">${esc(p.t)}</button>`).join('')}</div>
        <div class="mpi-kano" data-kq></div><div data-kr></div>
        ${ui.table(['Категория', 'Если есть', 'Если нет', 'В MVP'], [
          ['Обязательное', 'не замечают', 'возмущаются', 'обязательно, иначе продукт отвергнут'],
          ['Одномерное', 'чем лучше, тем довольнее', 'недовольны', 'ровно столько, сколько двигает цель'],
          ['Привлекательное', 'радуются', 'не огорчаются', '1–2 штуки, которые отличают от конкурентов'],
          ['Безразличное', 'всё равно', 'всё равно', 'не делать'],
          ['Обратное', 'раздражает', 'довольны', 'убрать']
        ])}
        ${ui.note('info', '«Вау» стареет', 'Онлайн-запись в автосервис десять лет назад была «вау», сегодня — почти обязательное: конкуренты из «Автомира» уже её запустили. Фото поломки в приложении сегодня — привлекательное, через пару лет станет базовым. Поэтому анкету Кано повторяют.')}
        <h4>MVP: самокат, а не колесо</h4>
        <div class="row">${ui.seg('road', [{ v: 'bad', t: 'Колесо → шасси → кузов → машина' }, { v: 'good', t: 'Самокат → велосипед → мотоцикл → машина' }], road)}</div>
        <div data-road></div>
        <details class="more"><summary>Как об этом спрашивают на собеседовании</summary><div>
          <p><b>«Что такое модель Кано и зачем она аналитику?»</b> — Классификация требований по влиянию на удовлетворённость. Помогает не тратить срок на безразличное и не забыть обязательное, о котором пользователь не скажет («само собой разумеется»).</p>
          <p><b>«Что такое MVP?»</b> — Минимальный продукт, который решает главную задачу пользователя от начала до конца и позволяет проверить гипотезу на реальных людях. Не «сырая версия всего», а полноценный узкий сценарий.</p>
        </div></details>
      </div>`;
      const ROAD = {
        bad: { st: [['🛞', 'Декабрь: АРМ без записи'], ['🔩', 'Январь: запись без напоминаний'], ['🚪', 'Февраль: половина доп. работ'], ['🚗', 'Май: всё работает']], cm: 'До мая ни одна цель не сдвинута: каждая фича «наполовину». Сезон 1 апреля встречаем со старым телефоном.', ok: false },
        good: { st: [['🛴', '15 марта: запись + напоминания + доп. работы'], ['🚲', 'Май: статус, оплата, кабинет «Шашки»'], ['🏍️', 'Лето: история, бонусы'], ['🚗', 'Осень: что покажут данные']], cm: 'С 15 марта три цели уже двигаются: узкий, но законченный сценарий на всех станциях. Дальше расширяем то, что подтвердили данные.', ok: true }
      };
      function draw() {
        TR.$('[data-kq]', el).innerHTML = `<label>Если в продукте <b>есть</b> это свойство, как вы к этому отнесётесь?<select data-k="f" aria-label="Функциональный вопрос">${KANS.map((x, i) => `<option value="${i}" ${i === f ? 'selected' : ''}>${x}</option>`).join('')}</select></label><label>Если этого свойства <b>нет</b>, как вы к этому отнесётесь?<select data-k="d" aria-label="Дисфункциональный вопрос">${KANS.map((x, i) => `<option value="${i}" ${i === d ? 'selected' : ''}>${x}</option>`).join('')}</select></label>`;
        const c = KCAT[KTAB[f][d]];
        TR.$('[data-kr]', el).innerHTML = `<div class="mpi-res"><span class="big">${esc(c.t)}</span><span class="small muted">${esc(c.s)}</span></div>`;
        const R = ROAD[road];
        TR.$('[data-road]', el).innerHTML = `<div class="mpi-road">${R.st.map(s => `<div class="st ${R.ok ? '' : 'no'}"><span class="e">${s[0]}</span><span class="s">${esc(s[1])}</span></div>`).join('')}</div><p class="small" style="color:var(--${R.ok ? 'ok' : 'bad'})">${esc(R.cm)}</p>`;
      }
      TR.on(el, 'click', '[data-kp]', (e, b) => { const p = KPRE.find(x => x.id === b.dataset.kp); f = p.f; d = p.d; draw(); });
      el.addEventListener('change', e => { const s = e.target.closest('[data-k]'); if (!s) return; if (s.dataset.k === 'f') f = +s.value; else d = +s.value; draw(); });
      ui.onSeg(el, (n, v) => { if (n === 'road') { road = v; draw(); } });
      draw();
    }
  };

  // =====================================================================
  // Практика 1. RICE-калькулятор
  // =====================================================================
  const IMP = [{ v: 3, t: '3 — массовое' }, { v: 2, t: '2 — высокое' }, { v: 1, t: '1 — среднее' }, { v: 0.5, t: '0,5 — низкое' }, { v: 0.25, t: '0,25 — минимальное' }];
  const CONF = [{ v: 100, t: '100 % — данные' }, { v: 80, t: '80 % — данные + прогноз' }, { v: 50, t: '50 % — гипотеза' }];
  const RF = [
    { id: 'book', t: 'Онлайн-запись', e: 14, ev: 'Визитов за квартал — около 13 500 (4 500 заказ-нарядов в месяц). Опрос 400 клиентов на кассе: онлайн готовы записываться 45 % — около 6 000 визитов. Цель: потерянные обращения 21 % → 5 %.',
      R: [13500, 6000, 360], rOk: 6000, iOk: [3, 2], cOk: [80, 100], rWhy: 'Охват — кого фича реально затронет: онлайн запишутся около 45 %, а не все 13 500.', iWhy: 'Прямо двигает цель по потерянным обращениям — 3 (или 2, если осторожничать).', cWhy: 'Есть отчёт АТС и опрос, доля онлайн-записей — прогноз: 80 % (100 % допустимо).' },
    { id: 'extra', t: 'Согласование доп. работ', e: 14, eNote: 'вместе с планшетом механика', ev: 'Сергей Петрович: доп. работы находят примерно в каждом третьем визите — около 4 500 за квартал. Сейчас машина ждёт ответа 1 ч 40 мин, 38 % клиентов не берут трубку с первого раза. Цель — 20 минут.',
      R: [13500, 4500, 360], rOk: 4500, iOk: [3], cOk: [80, 100], rWhy: 'Затронет только визиты с доп. работами — каждый третий, около 4 500.', iWhy: 'Это и есть цель «1 ч 40 мин → 20 минут» — массовое влияние, 3.', cWhy: 'Простой измерен, механизм понятен: 80 % или 100 %.' },
    { id: 'remind', t: 'Напоминания, отмена и перенос', e: 5, ev: 'Напоминание получает каждый записанный — все 13 500 визитов за квартал. Неявки 17 %, цель 8 %. «5 почему»: забывают, а отменить можно только звонком.',
      R: [13500, 6000, 2300], rOk: 13500, iOk: [2, 1], cOk: [80, 100], rWhy: 'Напоминание уходит каждому записанному — и по телефону, и онлайн: 13 500. 2 300 — это только неявщики, но заранее их не угадать.', iWhy: 'Двигает цель по неявкам, хотя не каждый напомненный приедет: 2 или 1.', cWhy: 'Причина неявок подтверждена интервью: 80 % или 100 %.' },
    { id: 'pay', t: 'Онлайн-оплата', e: 9, ev: 'Ольга Викторовна: сейчас все платят на кассе. По опросу онлайн готовы платить около 40 % — 5 400 визитов за квартал. Оплата — после статуса «Готов», на цели F-goal не влияет.',
      R: [13500, 5400, 360], rOk: 5400, iOk: [0.5, 1], cOk: [80, 100], rWhy: 'Онлайн заплатят около 40 % — 5 400, остальные на кассе.', iWhy: 'Удобство, на три цели почти не влияет: 0,5 или 1.', cWhy: 'Опрос есть: 80 % (100 % допустимо).' },
    { id: 'bonus', t: 'Бонусная программа', e: 10, ev: 'Кирилл: «бонусы вернут клиентов» — данных нет, это его гипотеза. Корпоративным баллы не начисляются, поэтому из 13 500 визитов остаётся около 12 000.',
      R: [13500, 12000, 4500], rOk: 12000, iOk: [0.5, 0.25], cOk: [50], rWhy: 'Корпоративным баллы не начисляются (BR-11): 12 000, а не 13 500.', iWhy: 'На цели F-goal не влияет, эффект на возвраты не измерен: 0,5 или 0,25.', cWhy: 'Только гипотеза Кирилла, без данных: 50 %.' },
    { id: 'history', t: 'История обслуживания', e: 4, ev: 'Ника: по опыту похожих приложений историю открывают около 30 % клиентов — около 4 000 визитов за квартал. Полезно для гарантии (6 мес / 10 000 км), на цели не влияет.',
      R: [13500, 4000, 360], rOk: 4000, iOk: [0.5, 0.25], cOk: [80, 50], rWhy: 'Откроют около 30 % — 4 000.', iWhy: 'Удобство, на цели не влияет: 0,5 или 0,25.', cWhy: 'Чужой опыт, своих данных нет: 80 % или 50 %.' },
    { id: 'corp', t: 'Кабинет компании «Шашка»', e: 8, ev: 'Рустам: 120 машин, в среднем 3 визита за квартал — около 360 визитов. Автосогласование до 3 000 ₽ и лимит прямо сокращают простой этих машин.',
      R: [13500, 4500, 360], rOk: 360, iOk: [2, 3], cOk: [100, 80], rWhy: 'Только машины «Шашки» — 360 визитов. Охват маленький, хотя клиент крупный.', iWhy: 'Для этих машин простой сокращается сильно: 2 или 3.', cWhy: 'Договор и слова Рустама: 100 % или 80 %.' },
    { id: 'chat', t: 'Чат с мастером', e: 9, ev: 'Тимур: «как в такси, с чатом». Ника: чатом пользуются 15–25 % клиентов — около 2 700 визитов. Марина Олеговна: «я не успею ещё и переписываться».',
      R: [13500, 2700, 360], rOk: 2700, iOk: [0.5, 0.25], cOk: [50], rWhy: 'Пишут в чат 15–25 % — около 2 700.', iWhy: 'Ни одну цель не двигает, а мастерам добавляет работы: 0,5 или 0,25.', cWhy: 'Желание заказчика без данных: 50 %.' }
  ];
  const riceOf = (f, x) => x && x.r != null && x.i != null && x.c != null ? x.r * x.i * (x.c / 100) / f.e : null;
  function riceEval(a) {
    a = a || {}; const v = a.v || {};
    let good = 0; const res = {};
    RF.forEach(f => {
      const x = v[f.id] || {};
      const r = { r: x.r == null ? 'none' : x.r === f.rOk ? 'ok' : 'bad', i: x.i == null ? 'none' : f.iOk.includes(x.i) ? 'ok' : 'bad', c: x.c == null ? 'none' : f.cOk.includes(x.c) ? 'ok' : 'bad' };
      good += ['r', 'i', 'c'].filter(k => r[k] === 'ok').length; res[f.id] = r;
    });
    const scored = RF.map(f => ({ f, s: riceOf(f, v[f.id]) })).filter(z => z.s != null).sort((p, q) => q.s - p.s);
    const top = scored.slice(0, 3).map(z => z.f.id);
    const topOk = scored.length === RF.length && ['remind', 'book', 'extra'].every(id => top.includes(id));
    const score = good / (RF.length * 3);
    return { res, good, scored, top, topOk, score };
  }
  const riceTask = {
    id: 'rice', title: 'RICE: посчитайте восемь фич «Искры»',
    simple: howRice.simple,
    lead: ui.brief({
      situation: '11:00. Тимур Рашидович начинает с порога: «Бонусы и чат — первыми. Это же как в такси». Кирилл кивает. Вера: «Давайте посчитаем. Если бонусы победят по числам — первыми будут бонусы». Трудозатраты Глеб уже оценил в очках.',
      todo: ['Для каждой фичи прочитайте данные и выберите охват (за квартал), влияние и уверенность. Трудозатраты даны.', 'Справа считается RICE, внизу — живой рейтинг.', 'Нажмите «Проверить». Засчитывается, если верны 80 % оценок и в первой тройке — фичи, которые двигают цели.'],
      lookTitle: 'Как выбирать', look: 'Охват — кого фича реально затронет за квартал. Влияние: 3 — прямо двигает цель F-goal, 1 — заметно помогает, 0,5 и меньше — удобство. Уверенность: 100 % — есть данные, 80 % — данные плюс прогноз, 50 % — чья-то гипотеза.'
    }),
    blank: () => ({ v: {} }),
    reference: () => ({ v: Object.fromEntries(RF.map(f => [f.id, { r: f.rOk, i: f.iOk[0], c: f.cOk[0] }])) }),
    render(el, ctx) {
      el.classList.add('mpi-root');
      const a = ctx.ans; a.v = a.v || {};
      const show = !!(ctx.result || ctx.readonly);
      const ev = riceEval(a);
      el.innerHTML = `<div class="stack"><div class="stack" data-cards></div><div class="eyebrow">Рейтинг RICE</div><div class="mpi-rank" data-rank></div></div>`;
      const sel = (f, k, opts) => {
        const x = a.v[f.id] || {}, st = show && x[k] != null ? ev.res[f.id][k] : '';
        const lab = k === 'r' ? 'Охват за квартал' : k === 'i' ? 'Влияние' : 'Уверенность';
        return `<label>${lab}<select class="${st}" data-f="${f.id}" data-k="${k}" aria-label="${lab}: ${esc(f.t)}" ${ctx.readonly ? 'disabled' : ''}><option value="">—</option>${opts.map(o => `<option value="${o.v}" ${x[k] === o.v ? 'selected' : ''}>${esc(o.t)}</option>`).join('')}</select></label>`;
      };
      TR.$('[data-cards]', el).innerHTML = RF.map(f => `<div class="mpi-rc"><h4><span>${esc(f.t)}</span><span class="mpi-tag">трудозатраты ${f.e} оч.${f.eNote ? ' · ' + esc(f.eNote) : ''}</span></h4><div class="ev">${esc(f.ev)}</div>
        <div class="mpi-rsel">${sel(f, 'r', f.R.map(r => ({ v: r, t: num(r) })))}${sel(f, 'i', IMP)}${sel(f, 'c', CONF)}<div class="sc" data-sc="${f.id}"></div></div>
        ${show ? `<div class="small muted">${ev.res[f.id].r === 'bad' ? '✕ ' + esc(f.rWhy) + ' ' : ''}${ev.res[f.id].i === 'bad' ? '✕ ' + esc(f.iWhy) + ' ' : ''}${ev.res[f.id].c === 'bad' ? '✕ ' + esc(f.cWhy) : ''}${ctx.readonly ? esc(f.rWhy + ' ' + f.iWhy + ' ' + f.cWhy) : ''}</div>` : ''}</div>`).join('');
      function drawScores() {
        RF.forEach(f => { const s = riceOf(f, a.v[f.id]); TR.$(`[data-sc="${f.id}"]`, el).innerHTML = s == null ? '<small>RICE</small>—' : `<small>RICE</small>${num(s)}`; });
        const e2 = riceEval(a), mx = e2.scored.length ? e2.scored[0].s : 1;
        TR.$('[data-rank]', el).innerHTML = e2.scored.length ? e2.scored.map((z, i) => `<div class="mpi-rk"><span class="n">${i + 1}</span><span>${esc(z.f.t)}</span><span class="tr"><i style="width:${(z.s / mx * 100).toFixed(1)}%"></i></span><span class="x">${num(z.s)}</span></div>`).join('') + (e2.scored.length < RF.length ? `<div class="small dim">Не оценено: ${RF.length - e2.scored.length}</div>` : '') : '<div class="small dim">Заполните оценки — рейтинг появится здесь.</div>';
      }
      drawScores();
      el.addEventListener('change', e => {
        const s = e.target.closest('select[data-f]'); if (!s || ctx.readonly) return;
        const x = a.v[s.dataset.f] = a.v[s.dataset.f] || {};
        if (s.value === '') delete x[s.dataset.k]; else x[s.dataset.k] = +s.value;
        s.classList.remove('ok', 'bad'); ctx.save(); drawScores();
      });
    },
    check(ans) {
      const r = riceEval(ans), notes = [], v = (ans && ans.v) || {};
      RF.forEach(f => {
        const x = r.res[f.id], miss = ['r', 'i', 'c'].filter(k => x[k] === 'none');
        if (miss.length) { notes.push({ ok: false, html: `<b>${esc(f.t)}</b>: не заполнено — ${miss.map(k => k === 'r' ? 'охват' : k === 'i' ? 'влияние' : 'уверенность').join(', ')}.` }); return; }
        const bad = [];
        if (x.r === 'bad') bad.push('охват: ' + f.rWhy); if (x.i === 'bad') bad.push('влияние: ' + f.iWhy); if (x.c === 'bad') bad.push('уверенность: ' + f.cWhy);
        if (bad.length) notes.push({ ok: false, html: `<b>${esc(f.t)}</b> — ${esc(bad.join(' '))}` });
      });
      if (r.good === RF.length * 3) notes.unshift({ ok: true, html: 'Все оценки обоснованы данными из блокнота и интервью.' });
      if (r.scored.length === RF.length) notes.push(r.topOk ? { ok: true, html: `Первая тройка: ${r.top.map(id => esc(RF.find(f => f.id === id).t)).join(', ')} — ровно то, что двигает три цели. Бонусы и чат — внизу: охват есть, а влияния на цели и уверенности нет.` } : { ok: false, html: `В первой тройке сейчас: ${r.top.map(id => esc(RF.find(f => f.id === id).t)).join(', ')}. Проверьте влияние и уверенность — у фич, которые двигают цели, RICE должен быть выше.` });
      const ok = r.score >= 0.8 && r.topOk;
      return { ok, score: r.score, notes, summary: `Обоснованных оценок: ${r.good} из ${RF.length * 3}.${r.scored.length === RF.length ? ' Лидер: ' + RF.find(f => f.id === r.top[0]).t + '.' : ''}`,
        mentor: ok ? null : 'Охват берите из данных, а не «все клиенты»: у бонусов нет корпоративных, у доп. работ — только каждый третий визит. Уверенность 50 % — когда за числом только чьё-то мнение.' };
    },
    explain: `<p>У RICE нет «правильного» числа с точностью до единицы — есть <b>обоснование</b>. Охват читаем из данных (13 500 визитов за квартал, 45 % готовы записываться онлайн, каждый третий визит — с доп. работами, у бонусов нет корпоративных), влияние — относительно целей F-goal, уверенность — по качеству источника.</p>
      ${ui.table(['Фича', 'R × I × C / E', 'RICE'], RF.map(f => [esc(f.t), `${num(f.rOk)} × ${fmt(f.iOk[0])} × ${f.cOk[0]} % / ${f.e}`, num(riceOf(f, { r: f.rOk, i: f.iOk[0], c: f.cOk[0] }))]))}
      <p>Напоминания побеждают за счёт малых трудозатрат и полного охвата — типичный эффект «быстрой победы». Бонусы и чат проигрывают не потому, что они плохие, а потому что не двигают цели и держатся на гипотезах. Кабинет «Шашки» — низкий RICE из-за охвата, но это крупный клиент: такие случаи RICE не видит, их обсуждают отдельно (как и закон — чек 54-ФЗ). Источники: Intercom, «RICE: Simple prioritization for product managers» (Ш. Макбрайд); Вигерс, глава 16 о приоритизации.</p>`,
    report: ans => { const r = riceEval(ans); return `- Рейтинг: ${r.scored.map(z => `${z.f.t} ${num(z.s)}`).join('; ') || '—'}\n- Обоснованных оценок: ${r.good}/${RF.length * 3}`; }
  };

  // =====================================================================
  // Практика 2. MoSCoW под ёмкость
  // =====================================================================
  const MREF = { arm: 'M', book: 'M', remind: 'M', tablet: 'M', extra: 'M', status: 'S', pay: 'S', corp: 'S', history: 'S', bonus: 'C', chat: 'W' };
  const MALT = { status: ['C'], pay: ['C'], corp: ['C'], history: ['C'], bonus: ['W'], chat: ['C'] };
  const MWHY = {
    arm: 'Фундамент: без расписания и заказ-нарядов у мастера не работает ни запись, ни согласование.',
    book: 'Прямо двигает цель 21 % → 5 %.', remind: 'Прямо двигает цель 17 % → 8 %: бьёт в причины из «5 почему».',
    tablet: 'Без фото от механика согласование доп. работ не заработает, а это цель «20 минут».', extra: 'Прямо двигает цель 1 ч 40 мин → 20 минут.',
    status: 'Снимает часть звонков «готова ли машина», дёшево — но станция переживёт сезон и без него.', pay: 'Удобно, но есть обходной путь — касса станции. И 54-ФЗ лучше отлаживать без спешки.',
    corp: 'Важен для «Шашки», но Рустам переживёт сезон со звонками мастера; 120 машин из 4 500 визитов в месяц.', history: 'Полезно для гарантии, на цели не влияет.',
    bonus: 'Не двигает цели, зависит от онлайн-оплаты, держится на гипотезе. Если всё пойдёт хорошо — успеем; если нет — выпадет первой.', chat: 'Не двигает цели, нагружает мастеров. Не в этот раз.'
  };
  const RANK = { M: 0, S: 1, C: 2, W: 3 };
  function moEval(a) {
    a = a || {}; const m = a.m || {};
    const sum = c => FEAT.filter(f => m[f.id] === c).reduce((s, f) => s + f.e, 0);
    const M = sum('M'), S = sum('S'), C = sum('C');
    const mustOk = FEAT.every(f => (MREF[f.id] === 'M') === (m[f.id] === 'M'));
    const res = {}; let good = 0;
    FEAT.forEach(f => { const v = m[f.id]; const s = !v ? 'none' : v === MREF[f.id] ? 'ok' : (MALT[f.id] || []).includes(v) ? 'warn' : 'bad'; res[f.id] = s; if (s === 'ok' || s === 'warn') good++; });
    const depBad = [];
    FEAT.forEach(f => { const v = m[f.id]; if (!v || v === 'W') return; f.deps.forEach(d => { const dv = m[d]; if (!dv || RANK[dv] > RANK[v]) depBad.push([f, FT(d), v, dv]); }); });
    const all = FEAT.every(f => m[f.id]);
    const score = Math.max(0, good / FEAT.length - 0.1 * depBad.length - (M + S > CAP ? 0.15 : 0));
    return { M, S, C, mustOk, res, good, depBad, all, score };
  }
  const moTask = {
    id: 'moscow', title: 'MoSCoW: что успеет к 15 марта',
    simple: howRice.simple,
    lead: ui.brief({
      situation: '11:25. Глеб пишет на доске: «Ёмкость — 80 очков до пилота 1 марта». Артём: «Разложите все одиннадцать фич по MoSCoW. Must — то, без чего сезон провален. И помните про зависимости: Глеб не сделает согласование без планшета».',
      todo: ['Для каждой фичи выберите M, S, C или W. Сверху — живая шкала ёмкости.', 'Следите за зависимостями (строка «нужно»): фича не может быть важнее того, без чего она не работает.', 'Нажмите «Проверить». Засчитывается, если Must — ровно то, без чего цели не достигаются, Must + Should влезают в 80 очков, зависимости не нарушены и остальное разложено разумно.'],
      lookTitle: 'Правило', look: 'Must не больше 60 % ёмкости (48 очков) — остальное запас на риски. Must + Should — в пределах 80.'
    }),
    blank: () => ({ m: {} }),
    reference: () => ({ m: Object.assign({}, MREF) }),
    render(el, ctx) {
      el.classList.add('mpi-root');
      const a = ctx.ans; a.m = a.m || {};
      const show = !!(ctx.result || ctx.readonly);
      el.innerHTML = '<div class="stack"><div data-cap></div><div class="stack" data-rows></div></div>';
      function drawCap() {
        const r = moEval(a), tot = r.M + r.S + r.C, mx = Math.max(CAP, tot), w = x => (x / mx * 100).toFixed(1) + '%';
        const over = Math.max(0, r.M + r.S - CAP);
        TR.$('[data-cap]', el).innerHTML = `<div class="mpi-cap"><div class="mpi-bar"><i class="M" style="width:${w(r.M)}"></i><i class="S" style="width:${w(r.S)}"></i><i class="C" style="width:${w(r.C)}"></i><span class="mk" style="left:${w(M_MAX)}"></span><span class="mk" style="left:${w(CAP)};border-left-style:solid"></span></div>
          <div class="mpi-leg"><span><i style="background:var(--accent)"></i>Must ${r.M}</span><span><i style="background:color-mix(in srgb,var(--violet) 70%,var(--surface-3))"></i>Should ${r.S}</span><span><i style="background:color-mix(in srgb,var(--warn) 55%,var(--surface-3))"></i>Could ${r.C}</span><span>пунктир — 60 % (48), черта — ёмкость 80</span></div>
          <div class="small ${r.M > M_MAX || over ? '' : 'dim'}" style="${r.M > M_MAX || over ? 'color:var(--warn)' : ''}">Must ${r.M} из 80 (${Math.round(r.M / CAP * 100)} %) · Must + Should ${r.M + r.S}${over ? ` — на ${over} больше ёмкости` : ''}</div></div>`;
      }
      function drawRows() {
        const r = moEval(a);
        TR.$('[data-rows]', el).innerHTML = FEAT.map(f => {
          const v = a.m[f.id], st = show && v ? r.res[f.id] : '';
          const why = show && (ctx.readonly || (v && r.res[f.id] !== 'ok')) ? `<div class="why">${r.res[f.id] === 'warn' ? 'Допустимо. ' : ''}${esc(MWHY[f.id])}</div>` : '';
          return `<div class="mpi-mrow ${st}"><div><div class="t">${esc(f.t)} <span class="mpi-tag">${f.e} оч.</span></div><div class="sub">${esc(f.sub)}${f.deps.length ? ` · <span style="color:var(--violet)">нужно: ${f.deps.map(d => esc(FT(d).t)).join(', ')}</span>` : ''}</div></div>
            <div class="mpi-mb" role="group" aria-label="MoSCoW: ${esc(f.t)}">${['M', 'S', 'C', 'W'].map(c => `<button type="button" data-f="${f.id}" data-c="${c}" aria-pressed="${v === c}" ${ctx.readonly ? 'disabled' : ''}>${c}</button>`).join('')}</div>${why}</div>`;
        }).join('');
      }
      drawCap(); drawRows();
      TR.on(el, 'click', '[data-f][data-c]', (e, b) => {
        if (ctx.readonly) return;
        const id = b.dataset.f, c = b.dataset.c;
        if (a.m[id] === c) delete a.m[id]; else a.m[id] = c;
        ctx.save(); drawCap(); drawRows();
      });
    },
    check(ans) {
      const r = moEval(ans), notes = [], m = (ans && ans.m) || {};
      if (!r.all) notes.push({ ok: false, html: `Не разложено: ${FEAT.filter(f => !m[f.id]).map(f => esc(f.t)).join(', ')}.` });
      FEAT.filter(f => MREF[f.id] === 'M' && m[f.id] && m[f.id] !== 'M').forEach(f => notes.push({ ok: false, html: `<b>${esc(f.t)}</b> — должна быть Must: ${esc(MWHY[f.id])}` }));
      FEAT.filter(f => MREF[f.id] !== 'M' && m[f.id] === 'M').forEach(f => notes.push({ ok: false, html: `<b>${esc(f.t)}</b> в Must — без неё цели к сезону достижимы. ${esc(MWHY[f.id])}` }));
      FEAT.filter(f => MREF[f.id] !== 'M' && m[f.id] && m[f.id] !== 'M' && r.res[f.id] === 'bad').forEach(f => notes.push({ ok: false, html: `<b>${esc(f.t)}</b>: ${m[f.id]} — спорно. ${esc(MWHY[f.id])}` }));
      FEAT.filter(f => r.res[f.id] === 'warn').forEach(f => notes.push({ ok: 'warn', html: `<b>${esc(f.t)}</b>: ${m[f.id]} — допустимо. ${esc(MWHY[f.id])}` }));
      r.depBad.forEach(([f, d, v, dv]) => notes.push({ ok: false, html: `Зависимость: «${esc(f.t)}» — ${v}, а «${esc(d.t)}» — ${dv || 'не разложено'}. Без «${esc(d.t)}» она не заработает: зависимость должна быть не ниже по приоритету.` }));
      if (r.M > M_MAX) notes.push({ ok: false, html: `Must = ${r.M} очков (${Math.round(r.M / CAP * 100)} % ёмкости) — больше 60 %. Запаса на риски нет.` });
      if (r.M + r.S > CAP) notes.push({ ok: false, html: `Must + Should = ${r.M + r.S} — больше ёмкости 80 очков. Что-то из Should на деле Could.` });
      if (r.mustOk && r.M + r.S <= CAP && !r.depBad.length) notes.unshift({ ok: true, html: `Must = ${r.M} очков (${Math.round(r.M / CAP * 100)} %): запись, напоминания, планшет, согласование доп. работ и АРМ под ними. Must + Should = ${r.M + r.S}, остальное — запас.` });
      const ok = r.all && r.mustOk && r.M + r.S <= CAP && !r.depBad.length && r.good >= FEAT.length - 1 && r.score >= 0.8;
      return { ok, score: r.score, notes, summary: `Must ${r.M} · Should ${r.S} · Could ${r.C} очков из ${CAP}. Разумно разложено: ${r.good} из ${FEAT.length}, нарушений зависимостей: ${r.depBad.length}.`,
        mentor: ok ? null : !r.mustOk ? 'Для каждой фичи спросите: «Если её не будет 15 марта, достигнем ли мы целей 5 % / 8 % / 20 минут?» Если да — это не Must.' : r.depBad.length ? 'Фича не может быть важнее того, без чего она не работает: согласование без планшета, оплата без статуса «Готов», бонусы без оплаты.' : 'Сверьтесь со шкалой: Must + Should должны влезать в 80 очков, а Could — это запас, который выпадет первым.' };
    },
    explain: `<p>Must — это ответ на вопрос «без чего сезон провален?»: <b>онлайн-запись</b> (21 % → 5 %), <b>напоминания и отмена</b> (17 % → 8 %), <b>согласование доп. работ</b> (1 ч 40 мин → 20 минут) и то, без чего они не работают, — <b>АРМ мастера</b> и <b>планшет механика</b>. Это 45 очков, 56 % ёмкости.</p>
      <p>Should (25 очков) — статус ремонта, онлайн-оплата, кабинет «Шашки», история: ценно, но у каждого есть обходной путь (касса, звонок Рустаму). Could — бонусы: 10 очков запаса, которые выпадут первыми, если интеграция с 1С или ЮKassa съест больше плана. Won’t — чат с мастером: не в этот раз, а не «никогда».</p>
      <p>Зависимости важнее любого метода: фича не может быть важнее того, без чего не заработает. Источники: DSDM Agile Project Framework — «MoSCoW Prioritisation» и правило 60 %; Вигерс, глава 16.</p>`,
    report: ans => { const r = moEval(ans), m = (ans && ans.m) || {}; return `- ${FEAT.map(f => `${f.t}: ${m[f.id] || '—'}`).join('; ')}\n- Must ${r.M}, Should ${r.S}, Could ${r.C}`; }
  };

  // =====================================================================
  // Практика 3. Кано для Елены
  // =====================================================================
  const KB = [{ id: 'M', t: 'Обязательное', sub: 'нет — возмущение' }, { id: 'O', t: 'Одномерное', sub: 'больше — лучше' }, { id: 'A', t: 'Привлекательное', sub: 'вау, не ждут' }, { id: 'I', t: 'Безразличное', sub: 'всё равно' }, { id: 'R', t: 'Обратное', sub: 'раздражает' }];
  const KI = [
    { id: 'k1', t: 'Подтверждение сразу после записи', ok: 'M', why: 'Без подтверждения Елена не уверена, что записалась, — позвонит. Наличие никто не заметит.' },
    { id: 'k2', t: 'Показанный свободным слот действительно свободен', ok: 'M', why: 'Само собой разумеется. Если нет — гнев и потерянный клиент.' },
    { id: 'k3', t: 'Чек об оплате на email или SMS', ok: 'M', why: 'Ожидается по умолчанию (и требуется законом 54-ФЗ).' },
    { id: 'k4', t: 'Скорость ответа мастера при согласовании доп. работ', ok: 'O', why: 'Чем быстрее, тем довольнее — линейная зависимость.' },
    { id: 'k5', t: 'Сколько вариантов времени предлагают на ближайшие дни', ok: 'O', why: 'Больше выбора — лучше, мало — недовольство.' },
    { id: 'k6', t: 'Фото поломки от механика прямо в приложении', ok: 'A', alt: 'O', why: 'Елена: «покажите фото — я сама решу». Сегодня так почти никто не делает — это вау.' },
    { id: 'k7', t: 'Статус ремонта онлайн: «в работе», «ждёт согласования», «готов»', ok: 'A', alt: 'M', why: 'Сейчас Елена звонит 2–3 раза за визит. Видеть статус — приятный сюрприз; у части клиентов уже ожидание.' },
    { id: 'k8', t: 'Тёмная тема и анимации', ok: 'I', why: 'Елене всё равно: она открывает приложение на минуту.' },
    { id: 'k9', t: 'Чат с мастером', ok: 'I', alt: 'A', why: 'Елене некогда переписываться — ей нужны статус, фото и цена. Для неё скорее безразлично.' },
    { id: 'k10', t: 'Рекламные push каждый день', ok: 'R', why: 'Раздражает: отключит уведомления — и пропустит согласование доп. работ.' },
    { id: 'k11', t: 'Анкета из 15 полей перед первой записью', ok: 'R', why: 'Чем больше полей, тем больше брошенных записей. Нужен минимум: телефон, машина, услуга.' }
  ];
  const KQ = { q: 'Тимур Рашидович: «Хочу вау! Давайте в MVP чат и тёмную тему». Что ответить с опорой на Кано?', options: [
    { t: 'Для Елены это безразличное: денег и срока стоит, радости не добавит. Её «вау» — фото поломки и статус ремонта, и они и так нужны для целей.', ok: true, why: 'Вау выбирают по реакции пользователя, а не по вкусу заказчика. Удачно, что «вау» Елены совпадает с целью по простою.' },
    { t: 'Согласиться: заказчик платит, ему виднее.', ok: false, why: 'Тогда срок 15 марта уйдёт на безразличное, а цели не сдвинутся.' },
    { t: 'Сделать тёмную тему вместо подтверждения записи — подтверждение никто не замечает.', ok: false, why: 'Обязательное не замечают, пока оно есть. Без подтверждения — звонки и гнев.' },
    { t: 'Отказать: вау-фичи в MVP не делают никогда.', ok: false, why: 'Одна-две привлекательные фичи отличают продукт от конкурентов. Вопрос — какие.' }
  ] };
  function kanoEval(a) {
    a = a || {}; const m = a.map || {}; const res = {}; let pts = 0;
    KI.forEach(x => { const v = m[x.id]; const s = !v ? 'none' : v === x.ok ? 'ok' : v === x.alt ? 'warn' : 'bad'; res[x.id] = s; if (s === 'ok' || s === 'warn') pts++; });
    const q = ui.quizScore(KQ, a.q);
    return { res, pts, q, score: 0.8 * pts / KI.length + 0.2 * q.score };
  }
  const kanoTask = {
    id: 'kano', title: 'Кано: что для Елены само собой, а что — вау',
    simple: howKano.simple,
    lead: ui.brief({
      situation: '11:45. Ника провела быстрый опрос по анкете Кано среди клиентов на станции — среди них Елена (Kia Rio, работает, звонить некогда). Разложите результаты по категориям: от этого зависит, что Ника будет рисовать первым.',
      todo: ['Разложите 11 свойств по пяти категориям Кано — глазами Елены.', 'Ответьте Тимуру Рашидовичу про «вау».', 'Нажмите «Проверить». Засчитывается, если 9 из 11 на допустимых местах и ответ Тимуру верный.'],
      lookTitle: 'Подсказка', look: 'Обязательное: есть — не замечают, нет — возмущаются. Одномерное: чем больше, тем лучше. Привлекательное: не ждут, но радуются. Безразличное: всё равно. Обратное: раздражает.'
    }),
    blank: () => ({ map: {}, q: [] }),
    reference: () => ({ map: Object.fromEntries(KI.map(x => [x.id, x.ok])), q: quizRef(KQ) }),
    render(el, ctx) {
      el.classList.add('mpi-root');
      const a = ctx.ans; a.map = a.map || {}; a.q = a.q || [];
      const show = !!(ctx.result || ctx.readonly), ev = kanoEval(a);
      el.innerHTML = '<div class="stack"><div data-sort></div><div data-q></div></div>';
      ui.sort(TR.$('[data-sort]', el), { items: KI.map(x => ({ id: x.id, t: esc(x.t) })), buckets: KB, value: a.map, readonly: ctx.readonly, seed: 'mpi-kano',
        reveal: show ? Object.fromEntries(KI.filter(x => a.map[x.id]).map(x => [x.id, ev.res[x.id]])) : null, onChange: v => { a.map = v; ctx.save(); } });
      ui.quiz(TR.$('[data-q]', el), Object.assign({}, KQ, { value: a.q, readonly: ctx.readonly, reveal: show || null, onChange: v => { a.q = v; ctx.save(); } }));
    },
    check(ans) {
      const r = kanoEval(ans), notes = [], m = (ans && ans.map) || {};
      const KN = id => (KB.find(b => b.id === id) || {}).t;
      KI.forEach(x => {
        const s = r.res[x.id];
        if (s === 'none') notes.push({ ok: false, html: `«${esc(x.t)}» — не разложено.` });
        else if (s === 'bad') notes.push({ ok: false, html: `«${esc(x.t)}»: ${esc(KN(m[x.id]))} — нет. ${esc(x.why)}` });
        else if (s === 'warn') notes.push({ ok: 'warn', html: `«${esc(x.t)}»: ${esc(KN(m[x.id]))} — допустимо, чаще «${esc(KN(x.ok))}». ${esc(x.why)}` });
      });
      if (r.pts === KI.length) notes.unshift({ ok: true, html: 'Все свойства на своих местах.' });
      notes.push(r.q.ok ? { ok: true, html: 'Ответ Тимуру: вау выбирают по реакции пользователя, а не по вкусу заказчика.' } : { ok: false, html: 'Ответ Тимуру: чат и тёмная тема для Елены безразличны; её вау — фото поломки и статус ремонта.' });
      const ok = r.pts >= 9 && r.q.ok && r.score >= 0.8;
      return { ok, score: r.score, notes, summary: `На допустимых местах: ${r.pts} из ${KI.length}. Ответ Тимуру: ${r.q.ok ? 'верный' : 'неверный'}.`,
        mentor: ok ? null : 'Задайте про каждое свойство два вопроса за Елену: «а если это есть?» и «а если этого нет?». Если без него она возмущается — обязательное, даже если его никто не хвалит.' };
    },
    explain: `<p>Для Елены <b>обязательное</b> — подтверждение записи, честные свободные слоты, чек: их не хвалят, но без них она уйдёт. <b>Одномерное</b> — скорость ответа и выбор времени: чем лучше, тем довольнее. <b>Привлекательное</b> — фото поломки и статус ремонта: то, о чём она сама сказала («покажите фото — я сама решу»). <b>Безразличное</b> — тёмная тема и чат. <b>Обратное</b> — ежедневная реклама и длинная анкета.</p>
      <p>Вывод для MVP: всё обязательное — да; привлекательное — то, что совпадает с целями (фото и статус как часть согласования доп. работ); безразличное — нет; обратное — следить, чтобы не появилось «случайно» (маркетинговые push). Через пару лет фото поломки станет обязательным — анкету повторим. Источники: Н. Кано и др., «Привлекательное качество и обязательное качество» (1984); Вигерс, глава 16.</p>`,
    report: ans => { const r = kanoEval(ans); return `- На местах: ${r.pts}/${KI.length}; ответ Тимуру: ${r.q.ok ? 'верный' : 'неверный'}`; }
  };

  // =====================================================================
  // Практика 4. Лаборатория: собери MVP → проживи сезон
  // =====================================================================
  const EFF = CAP - RISK;
  function labSim(pick) {
    const P = new Set(pick || []);
    const total = FEAT.filter(f => P.has(f.id)).reduce((s, f) => s + f.e, 0);
    const memo = {};
    const work = id => memo[id] != null ? memo[id] : (memo[id] = P.has(id) && FT(id).deps.every(work));
    const broken = FEAT.filter(f => P.has(f.id) && !work(f.id));
    const late = total > EFF, lateDays = late ? Math.ceil((total - EFF) / 16 * 14) : 0;
    let calls = 21, noshow = 17, idle = 100;
    if (work('book')) { calls = 6.5; noshow += 1; }
    if (work('remind')) { calls -= 2; noshow -= 10.5; }
    if (work('status')) calls -= 1.5;
    if (work('history')) calls -= 0.5;
    if (work('extra')) idle = 18;
    if (work('corp')) idle -= 2;
    if (late) { calls += 4; noshow += 2; idle += 12; }
    const g = { calls: calls <= 5, noshow: noshow <= 8, idle: idle <= 20 };
    const met = ['calls', 'noshow', 'idle'].filter(k => g[k]).length;
    return { P, total, work, broken, late, lateDays, calls, noshow, idle, g, met, score: P.size ? 0.75 * met / 3 + (late ? 0 : 0.25) : 0 };
  }
  const dayStr = n => n <= 31 ? `${n} марта` : `${n - 31} апреля`;
  const labTask = {
    id: 'lab', title: 'Лаборатория: соберите MVP и проживите сезон',
    simple: {
      icon: '🧪',
      plain: 'Приоритизация проверяется не на доске, а в сезоне. Соберите состав MVP в пределах ёмкости — и посмотрите, что случится к 30 апреля: достигнуты ли цели, что сломалось из-за зависимостей и что сделал риск.',
      analogy: 'Собираете рюкзак в поход: если набить его до отказа, первая же непредвиденная бутылка воды порвёт лямку. Запас — не лень, а страховка.',
      tech: 'Планирование релиза: фиксированный срок (timebox), ёмкость = скорость × итерации, буфер на риски (DSDM, Скрам-гайд — цель спринта и прогноз), зависимости между элементами бэклога. MVP оценивают по достижению целей бизнеса, а не по числу фич.'
    },
    lead: ui.brief({
      situation: '12:10. Артём: «Последний шаг — соберите состав MVP. Ёмкость 80 очков. Глеб предупреждает: в январе интеграция с 1С и ЮKassa почти наверняка съест лишние 5–8 очков. Нажмите „Запустить сезон“ и посмотрите, что будет 30 апреля».',
      todo: ['Отметьте фичи, которые войдут в MVP. Сверху — сумма очков и ёмкость.', 'Нажмите «Запустить сезон»: увидите ленту событий с декабря по апрель и итоги по трём целям. Меняйте состав и запускайте снова — сколько угодно.', 'Нажмите «Проверить». Засчитывается, если к 30 апреля достигнуты все три цели и MVP вышел вовремя.'],
      lookTitle: 'Помните', look: 'Цели: потерянные обращения ≤ 5 %, неявки ≤ 8 %, согласование ≤ 20 минут. Фича без своей зависимости не работает. Перерасход ёмкости сдвигает запуск и съедает пилот.'
    }),
    blank: () => ({ pick: [], ran: false }),
    reference: () => ({ pick: FEAT.filter(f => MREF[f.id] === 'M' || MREF[f.id] === 'S').map(f => f.id), ran: true }),
    render(el, ctx) {
      el.classList.add('mpi-root');
      const a = ctx.ans; a.pick = a.pick || [];
      el.innerHTML = '<div class="stack"><div data-cap></div><div class="stack" data-picks style="gap:6px"></div><div class="row"><button type="button" class="btn primary" data-run ' + (ctx.readonly ? 'disabled' : '') + '>Запустить сезон</button><span class="small dim" data-hint></span></div><div data-out></div></div>';
      function drawCap() {
        const s = labSim(a.pick), w = x => (Math.min(x, Math.max(CAP, s.total)) / Math.max(CAP, s.total) * 100).toFixed(1) + '%';
        TR.$('[data-cap]', el).innerHTML = `<div class="mpi-cap"><div class="mpi-bar"><i class="M" style="width:${w(Math.min(s.total, CAP))}"></i>${s.total > CAP ? `<i class="X" style="width:${w(s.total - CAP)}"></i>` : ''}<span class="mk" style="left:${w(EFF)}"></span><span class="mk" style="left:${w(CAP)};border-left-style:solid"></span></div>
          <div class="small">В MVP: <b class="tnum">${s.total}</b> очков из ${CAP} · пунктир — ${EFF} (если риск интеграции съест ${RISK}) · свободно ${Math.max(0, CAP - s.total)}</div></div>`;
      }
      function drawPicks() {
        TR.$('[data-picks]', el).innerHTML = FEAT.map(f => { const on = a.pick.includes(f.id); return `<button type="button" class="mpi-pick" data-p="${f.id}" aria-pressed="${on}" ${ctx.readonly ? 'disabled' : ''}><span class="box"></span><span><b>${esc(f.t)}</b><span class="sub">${esc(f.sub)}</span>${f.deps.length ? `<span class="dp">нужно: ${f.deps.map(d => esc(FT(d).t)).join(', ')}</span>` : ''}</span><span class="h">${f.e} оч.</span></button>`; }).join('');
      }
      function drawOut() {
        const out = TR.$('[data-out]', el), hint = TR.$('[data-hint]', el);
        if (!a.ran) { out.innerHTML = ''; hint.textContent = a.pick.length ? 'Состав изменён — запустите сезон, чтобы увидеть последствия.' : ''; return; }
        hint.textContent = '';
        const s = labSim(a.pick), ev = [];
        ev.push(['14 дек', '', `Старт: в плане ${s.total} очков из ${CAP}, запас ${Math.max(0, CAP - s.total)}.`]);
        ev.push(['18 янв', s.total > EFF ? 'bad' : 'ok', `Интеграция с 1С и ЮKassa заняла на ${RISK} очков больше плана. ${s.total > EFF ? 'Запаса не хватило — сроки поехали.' : 'Запас покрыл перерасход.'}`]);
        s.broken.forEach(f => ev.push(['фев', 'bad', `«${f.t}» не работает: нет «${f.deps.filter(d => !s.work(d)).map(d => FT(d).t).join('», «')}». Очки потрачены, пользы нет.`]));
        ev.push(['1 мар', s.late ? 'bad' : 'ok', s.late ? `Пилот на Победы сокращён: вместо двух недель — ${Math.max(0, 14 - s.lateDays)} дн. Марина Олеговна не успевает проверить запись в бою.` : 'Пилот на Победы: две недели, Марина Олеговна находит 11 мелких ошибок — все исправлены до запуска.']);
        ev.push(['15 мар', s.late ? 'bad' : 'ok', s.late ? `MVP готов только ${dayStr(15 + s.lateDays)}.` : 'MVP запущен на всех семи станциях.']);
        if (s.work('chat')) ev.push(['мар', 'warn', 'Чат: мастера-приёмщики получают по 40 сообщений в день и отвечают с опозданием. Марина Олеговна просит отключить.']);
        if (s.work('bonus')) ev.push(['мар', 'warn', 'Бонусы запущены: Кирилл доволен, Ольга Викторовна неделю сверяет начисления с кассой.']);
        if (!s.work('pay')) ev.push(['апр', '', 'Оплата — на кассе станции, как раньше. На цели это не влияет.']);
        if (s.work('extra') && !s.work('corp')) ev.push(['апр', '', '«Шашка» согласует доп. работы звонком мастеру, как раньше. Рустам ворчит, но кабинет компании — в майском релизе.']);
        if (s.work('book') && !s.work('status')) ev.push(['апр', '', 'Клиенты по-прежнему звонят узнать, готова ли машина: часть звонков в пик остаётся.']);
        ev.push(['1 апр', s.late ? 'bad' : '', 'Сезон переобувки: поток записей ×3–4.' + (s.late ? ' Первая неделя — сбои: не было нормального пилота.' : '')]);
        const st = (k, v, goal, unit) => `<div class="stat"><span class="k">${k}</span><span class="v ${v.ok ? 'ok' : 'bad'}">${v.x}${unit}</span><span class="s">цель ${goal} · ${v.ok ? 'достигнута' : 'не достигнута'}</span></div>`;
        out.innerHTML = `<div class="eyebrow">Лента сезона</div><div class="mpi-tl">${ev.map(e => `<div class="mpi-ev ${e[1]}"><span class="d">${esc(e[0])}</span><span>${esc(e[2])}</span></div>`).join('')}</div>
          <div class="eyebrow" style="margin-top:12px">30 апреля · итоги сезона</div>
          <div class="mpi-stats">${st('Потерянные обращения', { x: fmt(s.calls), ok: s.g.calls }, '≤ 5 %', ' %')}${st('Неявки', { x: fmt(s.noshow), ok: s.g.noshow }, '≤ 8 %', ' %')}${st('Согласование', { x: fmt(s.idle), ok: s.g.idle }, '≤ 20 мин', ' мин')}</div>
          ${ui.say(s.met === 3 && !s.late ? 'timur' : 'vera', s.met === 3 && !s.late ? 'Вот это я понимаю. Все три цифры — в отчёте. В мае делаем бонусы.' : s.late ? 'Мы положили в MVP больше, чем влезало с запасом. Риск сработал — и ударил по всему сразу.' : `Достигнуто целей: ${s.met} из 3. Посмотрите, какая фича двигает недостающую цель — и есть ли у неё всё, без чего она не работает.`)}`;
      }
      drawCap(); drawPicks(); drawOut();
      TR.on(el, 'click', '[data-p]', (e, b) => {
        if (ctx.readonly) return;
        const id = b.dataset.p; a.pick = a.pick.includes(id) ? a.pick.filter(x => x !== id) : a.pick.concat(id); a.ran = false;
        ctx.save(); drawCap(); drawPicks(); drawOut();
      });
      TR.on(el, 'click', '[data-run]', () => {
        if (ctx.readonly) return;
        a.ran = true; ctx.save(); drawOut();
        const s = labSim(a.pick);
        ctx.decide('Состав MVP (лаборатория)', `${a.pick.map(id => FT(id).t).join(', ') || 'пусто'} — ${s.total} оч., целей: ${s.met}/3${s.late ? ', опоздание' : ''}`);
      });
    },
    check(ans) {
      const s = labSim(ans && ans.pick), notes = [];
      notes.push(s.g.calls ? { ok: true, html: `Потерянные обращения: ${fmt(s.calls)} % — цель достигнута.` } : { ok: false, html: `Потерянные обращения: ${fmt(s.calls)} %. ${s.work('book') ? '' : 'Без работающей онлайн-записи звонки в пик продолжают теряться. '}${s.late ? 'Опоздание и сокращённый пилот добавили сбоев.' : ''}` });
      notes.push(s.g.noshow ? { ok: true, html: `Неявки: ${fmt(s.noshow)} % — цель достигнута.` } : { ok: false, html: `Неявки: ${fmt(s.noshow)} %. ${s.work('remind') ? '' : 'Без напоминаний и отмены в приложении причины из «5 почему» не устранены; онлайн-запись даже добавляет забывчивых. '}${s.late ? 'Опоздание ударило и сюда.' : ''}` });
      notes.push(s.g.idle ? { ok: true, html: `Согласование: ${fmt(s.idle)} мин — цель достигнута.` } : { ok: false, html: `Согласование: ${fmt(s.idle)} мин. ${s.work('extra') ? '' : 'Согласование доп. работ не работает — проверьте, есть ли планшет механика и онлайн-запись (приложение клиента). '}${s.late ? 'Опоздание добавило простой.' : ''}` });
      s.broken.forEach(f => notes.push({ ok: false, html: `«${esc(f.t)}» взята без «${f.deps.filter(d => !s.work(d)).map(d => esc(FT(d).t)).join('», «')}» — не работает.` }));
      if (s.late) notes.push({ ok: false, html: `В MVP ${s.total} очков: с учётом риска интеграции (${RISK}) это больше ёмкости — запуск ${dayStr(15 + s.lateDays)}, пилот сокращён.` });
      else if (s.total) notes.push({ ok: true, html: `${s.total} очков — с запасом ${CAP - s.total}: риск интеграции не сдвинул запуск.` });
      const ok = s.met === 3 && !s.late;
      return { ok, score: s.score, notes, summary: `Целей достигнуто: ${s.met} из 3. В MVP ${s.total} очков${s.late ? `, запуск ${dayStr(15 + s.lateDays)}` : ', запуск вовремя'}.`,
        mentor: ok ? null : s.late ? 'Ёмкость — 80, но риск интеграции почти наверняка съест 6. Уберите то, что не двигает цели: бонусы и чат — первые кандидаты.' : 'Начните с целей: какая фича двигает каждую — и что ей нужно, чтобы заработать.' };
    },
    explain: `<p>MVP, который проходит сезон, — это <b>Must</b> (АРМ, запись, напоминания, планшет, согласование — 45 очков) плюс то из Should, что влезает с запасом. Эталон — Must + Should, 70 очков: запас 10 покрывает риск интеграции, и даже если он окажется больше, первыми выпадут кабинет «Шашки» или история, а не цели.</p>
      <p>Три типичных провала: <b>«всё и сразу»</b> (с бонусами и чатом — 89 очков, запуск в начале апреля, сезон без пилота), <b>фича без зависимости</b> (согласование без планшета — очки потрачены, простой прежний), <b>красивое вместо нужного</b> (бонусы и чат вместо напоминаний — неявки остаются 17 %). Источники: DSDM — таймбоксинг и MoSCoW; Скрам-гайд — прогноз и цель спринта; Э. Рис, «Бизнес с нуля».</p>`,
    refNote: 'Засчитывается любой состав, при котором три цели достигнуты и сумма не больше 74 очков (80 минус риск интеграции). Минимальный проходной состав — пять Must-фич (45 очков).',
    report: ans => { const s = labSim(ans && ans.pick); return `- Состав: ${((ans && ans.pick) || []).map(id => FT(id).t).join(', ') || '—'}\n- ${s.total} оч., целей ${s.met}/3, ${s.late ? 'опоздание' : 'вовремя'}`; }
  };

  // =====================================================================
  // Практика 5. Объяснить Тимуру, почему бонусы не в MVP
  // =====================================================================
  const B_RUBRIC = [
    'Связывает с целями: бонусы не двигают ни одну из трёх целей (5 % / 8 % / 20 минут), а запись, напоминания и согласование доп. работ — двигают',
    'Говорит о ёмкости и сроке: до 15 марта около 80 очков, обязательное — 45, бонусы — ещё 10 и съедают запас на риски интеграций',
    'Называет зависимость и риск: бонусы начисляются после онлайн-оплаты, затрагивают кассу, чеки и учёт Ольги Викторовны — отлаживать это в сезон опасно',
    'Опирается на цифры приоритизации: у бонусов низкий RICE и уверенность 50 % — это гипотеза без данных',
    'Предлагает понятный план: бонусы — в следующем релизе после сезона (например, в мае), удержание до этого дают напоминания и статус; решение оставляет за Тимуром'
  ];
  const B_REF = 'Тимур Рашидович, бонусы мы не отменяем — мы ставим их сразу после сезона, в майский релиз. Причина простая: к 15 марта у команды около 80 очков работы, а то, что двигает ваши три цели, — онлайн-запись (21 % → 5 %), напоминания с отменой в приложении (17 % → 8 %) и согласование доп. работ с фото (1 ч 40 мин → 20 минут) — уже занимает 45. Бонусы — ещё 10 очков, и они ни одну из трёх цифр не двигают. Кроме того, бонусы начисляются только после онлайн-оплаты, то есть тянут за собой кассу, чеки по 54-ФЗ и сверку у Ольги Викторовны. Отлаживать это в апреле, когда поток вырастет в 3–4 раза, — риск для денег и для запуска. По нашей оценке RICE бонусы на пятом месте из восьми: эффект на возвраты пока гипотеза Кирилла, данных нет. Свободные 10 очков — наш запас: Глеб почти уверен, что интеграция с 1С съест лишнее в январе. Если запас не понадобится, начнём бонусы ещё до мая. А удерживать клиентов в сезон будут напоминания и статус ремонта. Решение за вами — но с этим планом все три ваши цифры к апрелю реальны.';
  const B_FEAT = [
    { t: 'три цели', test: s => /(21|17|1 ?ч ?40|20 мин|цел)/.test(s) },
    { t: 'срок 15 марта', test: s => /15 март/.test(s) },
    { t: 'ёмкость в очках', test: s => /(очк|емкост|80)/.test(s) },
    { t: 'зависит от онлайн-оплаты', test: s => /оплат/.test(s) },
    { t: 'касса, чеки, бухгалтерия', test: s => /(ольг|касс|чек|54|бухгалт)/.test(s) },
    { t: 'RICE или гипотеза', test: s => /(rice|райс|гипотез|данных нет|нет данных)/.test(s) },
    { t: 'когда будут бонусы', test: s => /(ма[йея]|после сезона|следующ)/.test(s) }
  ];
  const timurTask = {
    id: 'timur', title: 'Объясните Тимуру: почему бонусы не в MVP',
    simple: {
      icon: '🗣️',
      plain: 'Отказ заказчику — это не «нет», а «не сейчас, и вот почему». Опирайтесь на его же цели и сроки, покажите цену включения и дайте понятный план, когда фича появится.',
      analogy: 'Прораб хозяину: «Тёплый пол сделаем, но после того, как закроем крышу. Если начнём с пола — первый же дождь его зальёт. Крыша — к октябрю, пол — в ноябре».',
      tech: 'Управление ожиданиями стейкхолдеров (BABOK v3, «Управление требованиями на протяжении жизненного цикла»): решение о составе релиза обосновывается целями, ёмкостью, зависимостями и рисками; итог фиксируется, а отложенное попадает в бэклог с ориентировочным сроком.'
    },
    lead: ui.brief({
      situation: '12:40. Тимур Рашидович смотрит на доску, где бонусы стоят в колонке Could: «Я не понял. Кирилл говорит, бонусы — это деньги. Почему их нет в первой версии?» Артём: «Ответьте ему сами — коротко и на его языке».',
      todo: ['Напишите 6–10 предложений, от 300 символов: цели, срок и ёмкость, зависимость от оплаты и риск, цифры приоритизации, план.', 'Под полем загораются признаки сильного ответа.', 'Нажмите «Проверить с Верой (Claude)» или «Сверить с эталоном самому». Засчитывается от 60 %.'],
      lookTitle: 'На что опереться', look: 'Цели 5 % / 8 % / 20 минут. Ёмкость 80 очков, Must 45, бонусы 10. Бонусы начисляются после онлайн-оплаты (5 % от работ, списание до 30 %, сгорают через 12 месяцев) — касса, чеки 54-ФЗ, Ольга Викторовна. RICE бонусов — 300 против 4 320 у напоминаний, уверенность 50 %.'
    }),
    blank: () => ({ j: {} }),
    reference: () => ({ j: { text: B_REF, self: B_RUBRIC.map(() => true) } }),
    render(el, ctx) {
      el.classList.add('mpi-root');
      el.insertAdjacentHTML('beforeend', ui.say('timur', 'Я не понял. Кирилл говорит, бонусы — это деньги. Почему их нет в первой версии? Мне нужно, чтобы клиенты возвращались.') + ui.say('kirill', 'Пять процентов баллами — это же стандарт! У «Автомира» уже есть.'));
      const j = document.createElement('div'); j.style.marginTop = '12px'; el.appendChild(j);
      const ft = document.createElement('div'); ft.className = 'mpi-feat'; ft.style.marginTop = '8px'; el.appendChild(ft);
      const drawFeat = txt => { const s = TR.norm(txt || ''); ft.innerHTML = '<span class="small dim">Признаки:</span>' + B_FEAT.map(f => { const on = f.test(s); return `<span class="chip ${on ? 'ok' : ''}">${on ? '✓' : '○'} ${esc(f.t)}</span>`; }).join(''); };
      ui.justify(j, {
        id: 'mpi-timur', q: 'Что ответить Тимуру Рашидовичу?', qPlain: 'Объясните владельцу сети автосервисов, почему бонусная программа (5 % баллами, начисление после онлайн-оплаты) не входит в первую версию к 15 марта: связь с тремя целями (потерянные обращения 21 % → 5 %, неявки 17 % → 8 %, простой на согласовании 1 ч 40 мин → 20 минут), ёмкость команды 80 очков при обязательном объёме 45, зависимость от онлайн-оплаты и риск для кассы и чеков, низкая оценка RICE и уверенность 50 %, план выпуска в мае.',
        rubric: B_RUBRIC, reference: B_REF, value: ctx.ans.j, readonly: ctx.readonly, minLen: 300,
        placeholder: 'Тимур Рашидович, бонусы мы не отменяем — …',
        onChange: v => { ctx.ans.j = v; ctx.save(); drawFeat(v.text); ctx.decide('Ответ Тимуру: бонусы не в MVP', v.text || ''); }
      });
      el.addEventListener('input', e => { if (e.target.tagName === 'TEXTAREA') drawFeat(e.target.value); });
      drawFeat((ctx.ans.j && ctx.ans.j.text) || '');
    },
    check(ans) {
      const s = ui.justifyScore(ans && ans.j), txt = TR.norm((ans && ans.j && ans.j.text) || ''), notes = [];
      if (txt) B_FEAT.forEach(f => { if (!f.test(txt)) notes.push({ ok: 'warn', html: `В ответе не видно: ${esc(f.t)}.` }); });
      if (/(никогда|не будет)/.test(txt) && !/(ма[йея]|после сезона|следующ)/.test(txt)) notes.push({ ok: false, html: '«Не будет» без плана звучит как отказ. Скажите, когда бонусы появятся.' });
      return { ok: s >= 0.6, score: s, notes,
        summary: s ? `Оценка ответа: ${Math.round(s * 100)} %.` : 'Напишите ответ (от 300 символов) и проверьте его с Верой или сверьте с эталоном сами.',
        mentor: s && s < 0.6 ? 'Тимура убеждают его же цифры: три цели, 15 марта, 80 очков. Покажите, что бонусы не двигают ни одну цель и тянут за собой кассу, — и дайте дату, когда они будут.' : null };
    },
    explain: `<p>Сильный ответ строится как у прораба: <b>«не сейчас» вместо «нет»</b>, причина — <b>на языке заказчика</b> (его цели, его срок, его деньги), <b>цена включения</b> (10 очков запаса и риск для кассы в сезон) и <b>план</b> (май, а если запас не понадобится — раньше). Цифры приоритизации — RICE, MoSCoW, Кано — нужны вам, чтобы ответ был честным; Тимуру достаточно одной-двух.</p>
      <p>Обратите внимание: решение остаётся за Тимуром. Аналитик не запрещает — он показывает последствия так, чтобы правильный выбор стал очевидным. Дальше — модуль 3: путь клиента Елены, макеты и процессы для того, что вошло в MVP.</p>`,
    report: ans => (ans && ans.j && ans.j.text) ? ans.j.text : '—'
  };

  // =====================================================================
  TR.stage({
    id: ID,
    when: 'понедельник, 7 декабря, 11:00 · что войдёт в MVP к 15 марта',
    intro: [
      { who: 'artem', html: 'После пятничного интервью у нас восемнадцать фактов и список желаний длиной в год. Срок — 15 марта, сдвинуть его нельзя: с 1 апреля сезон. Сегодня решаем, что войдёт в MVP.' },
      { who: 'timur', html: 'Всё войдёт. Бонусы, чат, оплата — как в такси. Я плачу, вы делаете.' },
      { who: 'gleb', html: 'Тимур Рашидович, нас шесть человек, а не шестьдесят. Ёмкость до пилота — 80 очков. Всё вместе — под 90. Плюс интеграции, которые всегда съедают больше плана.' },
      { who: 'vera', html: 'Тогда спорить не будем — посчитаем. У нас три цели в цифрах: всё, что их двигает, — первым. Остальное честно разложим по ценности, сложности и зависимостям. И посмотрим, что будет в сезоне при разных вариантах.' }
    ],
    facts: ['F-goal', 'F-deadline', 'F-calls', 'F-noshow', 'F-idle', 'F-extra-who', 'F-corp', 'F-pay', 'F-bonus', 'F-peak'],
    glossary: [
      { term: 'Приоритизация', simple: 'Решить, что делать первым, а что потом или никогда.', tech: 'Упорядочивание требований по ценности, затратам, рискам и зависимостям (Вигерс, глава 16; BABOK v3, «Приоритизация требований»).' },
      { term: 'Ценность фичи', simple: 'Насколько фича двигает цели бизнеса и решает проблему пользователя.', tech: 'Оценивается относительно измеримых бизнес-целей (у «Искры» — F-goal) и проблем пользователей.' },
      { term: 'MVP', simple: 'Минимальный продукт, который уже по-настоящему решает главную задачу.', tech: 'Minimum Viable Product (Э. Рис). Узкий, но законченный сценарий для проверки гипотез на реальных пользователях. «Самокат, а не колесо» — Х. Книберг.' },
      { term: 'RICE', simple: 'Оценка: охват × влияние × уверенность / трудозатраты.', tech: 'Reach, Impact (3 / 2 / 1 / 0,5 / 0,25), Confidence (100 / 80 / 50 %), Effort. Метод Intercom.' },
      { term: 'MoSCoW', simple: 'Обязательно, желательно, если успеем, не в этот раз.', tech: 'Must, Should, Could, Won’t (this time). Метод DSDM; Must — не больше 60 % трудозатрат, Could — около 20 % (запас).' },
      { term: 'Модель Кано', simple: 'Как свойство влияет на радость пользователя: обязательное, одномерное, привлекательное, безразличное, обратное.', tech: 'Н. Кано, 1984. Анкета: функциональный и дисфункциональный вопрос, таблица оценки.' },
      { term: 'Матрица «ценность / сложность»', simple: 'Быстрые победы, большие ставки, заполнители и ямы.', tech: 'Value/effort matrix: визуальная приоритизация по двум осям.' },
      { term: 'Стоимость задержки', simple: 'Сколько теряем за каждую неделю, пока фичи нет.', tech: 'Cost of Delay (Д. Рейнертсен). WSJF = стоимость задержки / размер работы (SAFe).' },
      { term: 'Ёмкость команды', simple: 'Сколько работы команда успеет до срока.', tech: 'Скорость (очков за спринт) × число спринтов. У «Орбиты»: 16 × 5 = 80 очков до пилота 1 марта.' },
      { term: 'Очки (story points)', simple: 'Условная оценка размера работы: не часы, а «насколько большое».', tech: 'Относительная оценка трудоёмкости, сложности и неопределённости; скорость команды измеряется в очках за итерацию.' },
      { term: 'Зависимость', simple: 'Одну фичу нельзя сделать или запустить без другой.', tech: 'Связь между элементами бэклога: согласование доп. работ требует планшета механика и приложения клиента; бонусы — онлайн-оплаты.' },
      { term: 'Таймбокс', simple: 'Срок фиксирован — меняется объём.', tech: 'Принцип DSDM и Scrum: дата не двигается, состав подстраивается по приоритету.' }
    ],
    outro: 'MVP «Искры» к 15 марта — онлайн-запись, напоминания и отмена, согласование доп. работ с фото, а под ними АРМ мастера и планшет механика: 45 очков из 80, все три цели двигаются. Статус, оплата, кабинет «Шашки» и история — следом, бонусы — запас, чат — не в этот раз. Вы умеете считать RICE, раскладывать MoSCoW под ёмкость, видеть зависимости и объяснять заказчику «не сейчас» на его языке. Дальше — модуль 3: 15 декабря утро на станции и путь Елены.',
    tasks: [howValue, howRice, howKano, riceTask, moTask, kanoTask, labTask, timurTask]
  });
})();
