/* Модуль 2, занятие 1: Виды требований.
   Теория: уровни требований по Вигерсу — карта «этажей» (бизнес-, пользовательские, функциональные) и боковых видов
   (нефункциональные, бизнес-правила, ограничения, внешние интерфейсы, переходные) на трёх сквозных цепочках «Искры»
   и на бытовом примере; бизнес-правила BR-1…BR-16 по типам Вигерса, «правило или требование», ограничения;
   потребность и решение — лестница «Зачем? / Как ещё?», трассировка цель → задача → функция, сироты.
   Практика: разложить 16 высказываний по восьми видам; письмо Тимура Рашидовича «хочу как в такси» — решения →
   потребности и переформулировка по трём уровням с живыми признаками; дерево трассировки от цели «неявки 17 % → 8 %»;
   лаборатория «ревизия бэклога перед планированием MVP» (сироты, цели без функций — последствия на пилоте);
   своими словами Тимуру Рашидовичу: почему «как в такси» — ещё не требование и что мы с ним сделаем. */
'use strict';
(function () {
  const TR = window.TR, ui = TR.ui, esc = TR.esc;
  const ID = 'm2-types';

  if (!document.getElementById('m2t-css')) document.head.insertAdjacentHTML('beforeend', `<style id="m2t-css">
    .m2t-root, .m2t-root .stack > * { min-width: 0; }
    .m2t-root .seg button { white-space: normal; text-align: left; }
    .m2t-wmap { display: grid; grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr); gap: 12px; }
    .m2t-col { display: grid; gap: 6px; align-content: start; min-width: 0; }
    .m2t-lv { display: grid; grid-template-columns: 26px minmax(0, 1fr); gap: 8px; align-items: center; text-align: left; font: inherit; color: inherit; border: 1px solid var(--border); background: var(--surface-2); border-radius: 10px; padding: 8px 10px; cursor: pointer; min-width: 0; }
    .m2t-lv:hover { border-color: var(--border-strong); }
    .m2t-lv[aria-pressed="true"] { border-color: var(--accent); box-shadow: 0 0 0 1px var(--accent); background: var(--accent-soft); }
    .m2t-lv b { display: block; font-size: 14px; line-height: 1.25; }
    .m2t-lv small { display: block; color: var(--text-muted); font-size: 12px; line-height: 1.3; }
    .m2t-lv .ic { text-align: center; }
    .m2t-lv.p1 { margin: 0 16%; } .m2t-lv.p2 { margin: 0 8%; }
    .m2t-lv.side { border-style: dashed; }
    .m2t-down { text-align: center; color: var(--text-muted); font: 600 11px/1.2 var(--f-mono); }
    .m2t-h3 { font: 600 18px/1.3 var(--f-brand); margin: 0; }
    .m2t-facts { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
    .m2t-fact { padding: 9px 12px; border-radius: 10px; background: var(--surface); border: 1px solid var(--border); font-size: 14px; min-width: 0; overflow-wrap: anywhere; }
    .m2t-fact > b { display: block; font: 600 10.5px/1.3 var(--f-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 3px; }
    .m2t-fact.ex { border-color: color-mix(in srgb, var(--accent) 50%, var(--border)); background: var(--accent-soft); }
    .m2t-fact.home { border-color: color-mix(in srgb, var(--info) 45%, var(--border)); background: var(--info-soft); }
    .m2t-fact.bad { border-color: color-mix(in srgb, var(--bad) 45%, var(--border)); background: var(--bad-soft); }
    .m2t-fact.wide { grid-column: 1 / -1; }
    .m2t-legend { display: flex; flex-wrap: wrap; gap: 6px; }
    .m2t-legend button { font: inherit; font-size: 12.5px; border: 1px solid var(--border-strong); background: var(--surface-2); color: var(--text-2); border-radius: 99px; padding: 4px 10px; cursor: pointer; }
    .m2t-legend button[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); color: var(--accent); }
    .m2t-brs { display: grid; grid-template-columns: repeat(auto-fill, minmax(66px, 1fr)); gap: 6px; }
    .m2t-br { font: 600 12.5px/1 var(--f-mono); padding: 9px 4px; border-radius: 8px; border: 1px solid var(--border); border-bottom-width: 3px; background: var(--surface-2); color: var(--text); cursor: pointer; }
    .m2t-br[data-k="fact"] { border-bottom-color: var(--info); } .m2t-br[data-k="cons"] { border-bottom-color: var(--bad); }
    .m2t-br[data-k="act"] { border-bottom-color: var(--ok); } .m2t-br[data-k="inf"] { border-bottom-color: var(--violet); }
    .m2t-br[data-k="calc"] { border-bottom-color: var(--warn); }
    .m2t-br[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); }
    .m2t-br.dim { opacity: .35; }
    .m2t-flip { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
    .m2t-flip button { font: inherit; font-size: 14px; text-align: left; color: inherit; border: 1px solid var(--border-strong); background: var(--surface-2); border-radius: 10px; padding: 10px 12px; cursor: pointer; display: grid; gap: 6px; min-width: 0; }
    .m2t-flip button[aria-pressed="true"] { border-color: var(--accent); background: var(--surface); }
    .m2t-flip .a { font-size: 13px; color: var(--text-2); border-top: 1px dashed var(--border-strong); padding-top: 6px; }
    .m2t-ladder { display: grid; gap: 6px; }
    .m2t-rung { border: 1px solid var(--border); border-left: 4px solid var(--border-strong); border-radius: 10px; padding: 9px 12px; background: var(--surface); font-size: 14px; display: grid; gap: 3px; min-width: 0; }
    .m2t-rung.goal { border-left-color: var(--accent); } .m2t-rung.need { border-left-color: var(--ok); } .m2t-rung.sol { border-left-color: var(--warn); }
    .m2t-rung.hid { opacity: .5; border-style: dashed; color: var(--text-muted); }
    .m2t-alts { display: grid; gap: 6px; padding: 10px 12px; border-radius: 10px; background: var(--ok-soft); border: 1px solid color-mix(in srgb, var(--ok) 40%, var(--border)); font-size: 13.5px; }
    .m2t-tree { display: grid; gap: 8px; }
    .m2t-node { display: block; width: 100%; text-align: left; font: inherit; font-size: 13.5px; color: inherit; border: 1px solid var(--border); border-radius: 10px; padding: 7px 10px; background: var(--surface); cursor: pointer; min-width: 0; overflow-wrap: anywhere; }
    .m2t-node.g { border-color: color-mix(in srgb, var(--accent) 55%, var(--border)); background: var(--accent-soft); font-weight: 600; }
    .m2t-node.u { background: var(--surface-2); }
    .m2t-node.on { box-shadow: 0 0 0 2px var(--accent); }
    .m2t-node.dim { opacity: .4; }
    .m2t-node.orph { border-style: dashed; border-color: var(--bad); }
    .m2t-node.empty { border-style: dashed; border-color: var(--warn); }
    .m2t-node .tg { display: inline-block; margin-left: 6px; font: 600 10px/1 var(--f-mono); padding: 3px 6px; border-radius: 5px; vertical-align: middle; }
    .m2t-node .tg.bad { background: var(--bad-soft); color: var(--bad); } .m2t-node .tg.warn { background: var(--warn-soft); color: var(--warn); }
    .m2t-node .tg.ok { background: var(--ok-soft); color: var(--ok); }
    .m2t-kids { display: grid; gap: 6px; margin-left: 14px; padding-left: 10px; border-left: 2px solid var(--border); }
    .m2t-line { padding: 9px 11px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface); display: grid; gap: 7px; min-width: 0; }
    .m2t-line.ok { border-color: var(--ok); background: var(--ok-soft); } .m2t-line.bad { border-color: var(--bad); background: var(--bad-soft); }
    .m2t-line.warn { border-color: var(--warn); background: var(--warn-soft); }
    .m2t-line .tx { font-size: 14px; overflow-wrap: anywhere; }
    .m2t-line .why { font-size: 13px; color: var(--text-2); }
    .m2t-line select { max-width: 100%; }
    .m2t-feats { display: flex; flex-wrap: wrap; gap: 5px; }
    .m2t-feat { font-size: 12px; line-height: 1.3; padding: 3px 8px; border-radius: 99px; border: 1px solid var(--border); color: var(--text-muted); background: var(--surface-2); }
    .m2t-feat.on { color: var(--ok); border-color: color-mix(in srgb, var(--ok) 50%, transparent); background: var(--ok-soft); }
    .m2t-feat.crit::after { content: " ⚑"; }
    .m2t-letter { padding: 14px 16px; border: 1px solid var(--border); border-radius: 12px; background: var(--surface); font-size: 14.5px; line-height: 1.55; display: grid; gap: 8px; }
    .m2t-letter .hd { font: 500 12px/1.4 var(--f-mono); color: var(--text-muted); border-bottom: 1px solid var(--border); padding-bottom: 8px; overflow-wrap: anywhere; }
    .m2t-letter mark { background: var(--warn-soft); color: inherit; padding: 0 3px; border-radius: 4px; }
    .m2t-field { display: grid; gap: 6px; padding: 12px; border: 1px solid var(--border); border-radius: 12px; background: var(--surface); }
    .m2t-field.ok { border-color: var(--ok); } .m2t-field.bad { border-color: var(--bad); }
    .m2t-field header { display: flex; flex-wrap: wrap; gap: 8px; align-items: baseline; }
    .m2t-field header b { font: 600 15px/1.3 var(--f-brand); }
    .m2t-steps { display: grid; gap: 12px; }
    .m2t-step { border: 1px solid var(--border); border-radius: 12px; background: var(--surface); padding: 12px 14px; display: grid; gap: 10px; min-width: 0; }
    .m2t-step.locked { opacity: .55; }
    .m2t-step > header { display: flex; gap: 10px; align-items: baseline; flex-wrap: wrap; }
    .m2t-step > header .n { font: 600 11px/1 var(--f-mono); letter-spacing: .1em; color: var(--accent); text-transform: uppercase; }
    .m2t-step > header b { font: 600 15px/1.3 var(--f-brand); }
    .m2t-step .ctx { font-size: 13.5px; color: var(--text-2); }
    .m2t-opts { display: grid; gap: 6px; }
    .m2t-opt { display: grid; grid-template-columns: 20px minmax(0, 1fr); gap: 8px; align-items: start; text-align: left; font: inherit; font-size: 14px; color: inherit; background: var(--surface-2); border: 1px solid var(--border); border-radius: 10px; padding: 9px 11px; cursor: pointer; min-width: 0; }
    .m2t-opt .bx { width: 16px; height: 16px; margin-top: 2px; border-radius: 50%; border: 2px solid var(--border-strong); }
    .m2t-opt[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); }
    .m2t-opt[aria-pressed="true"] .bx { border-color: var(--accent); background: var(--accent); }
    .m2t-opt:disabled { cursor: default; }
    .m2t-opt:disabled:not([aria-pressed="true"]) { opacity: .55; }
    .m2t-cons { border-left: 3px solid var(--border-strong); padding: 6px 10px; font-size: 13.5px; color: var(--text-2); display: grid; gap: 8px; }
    .m2t-cons.good { border-left-color: var(--ok); } .m2t-cons.bad { border-left-color: var(--bad); } .m2t-cons.mid { border-left-color: var(--warn); }
    .m2t-stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; }
    .m2t-stats .v { font-size: 17px; }
    .m2t-pilot { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
    @media (max-width: 760px) {
      .m2t-wmap, .m2t-facts, .m2t-flip, .m2t-pilot { grid-template-columns: minmax(0, 1fr); }
      .m2t-fact.wide { grid-column: auto; }
      .m2t-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .m2t-lv.p1 { margin: 0 8%; } .m2t-lv.p2 { margin: 0 4%; }
    }
  </style>`);

  // ---------- общие помощники ----------
  const talk = lines => `<div class="talk">${lines.map(x => x.who === 'sys' ? ui.note(x.k || '', x.title || '', x.html) : ui.say(x.who, x.html)).join('')}</div>`;
  const anNote = html => `<div style="margin-top:12px">${ui.note('info', 'Позиция аналитика', html)}</div>`;
  const interview = (q, a) => ui.note('', 'Как об этом спрашивают на собеседовании', `<b>«${q}»</b><br>${a}`);
  const mark = s => s === 'ok' ? '✓' : s === 'warn' ? '≈' : '✗';
  const quizRef = cfg => cfg.options.map((o, i) => o.ok ? i : -1).filter(i => i >= 0);
  const signed = n => (n > 0 ? '+' : '') + n;
  const has = (txt, re) => re.test(TR.norm(txt));

  // =====================================================================
  // Теория 1. Уровни требований по Вигерсу
  // =====================================================================
  const CHAINS = [
    { v: 'noshow', t: 'Неявки 17 % → 8 %' },
    { v: 'calls', t: 'Потерянные звонки 21 % → 5 %' },
    { v: 'extra', t: 'Простой 1 ч 40 мин → 20 мин' }
  ];
  const LV = [
    {
      id: 'biz', col: 'main', p: 'p1', ico: '🎯', t: 'Бизнес-требования', en: 'business requirements', q: 'Зачем бизнес платит за систему?',
      what: 'Цель бизнеса в цифрах: что изменится для компании и к какому сроку. Здесь нет экранов и кнопок — только деньги, время, клиенты.',
      src: 'Владелец продукта и спонсор — Тимур Рашидович', doc: 'Документ концепции и границ (vision and scope), раздел «Бизнес-цели»',
      marker: 'есть показатель, число «было → станет» и срок',
      ex: { noshow: 'Сократить неявки с 17 % до 8 % к сезону — к 1 апреля 2027 года.', calls: 'Сократить потерянные обращения в часы пик с 21 % до 5 %.', extra: 'Сократить простой машины на согласовании доп. работ с 1 ч 40 мин до 20 минут.' },
      home: '«Готовить ужин для семьи за 30 минут, а не за час».',
      err: '«Сделать удобное приложение» — это не цель бизнеса: не видно, что изменится и как это измерить. Тимур Рашидович через полгода не сможет сказать, получил ли он то, за что платил.'
    },
    {
      id: 'user', col: 'main', p: 'p2', ico: '🙋', t: 'Пользовательские требования', en: 'user requirements', q: 'Что человек хочет сделать с помощью системы?',
      what: 'Задачи конкретных пользователей: кто и чего хочет достичь. Записывают пользовательскими историями (User Story) или вариантами использования (Use Case) — их разберём в следующем занятии.',
      src: 'Пользователи и их представители: Елена, Марина Олеговна, Сергей Петрович, Рустам', doc: 'Истории в бэклоге, варианты использования',
      marker: 'есть роль и её задача: «клиент хочет…», «мастер может…»',
      ex: { noshow: 'Клиентка получает напоминание и в один шаг подтверждает, переносит или отменяет визит.', calls: 'Клиент сам записывается на ТО в приложении или на сайте, не дозваниваясь до колл-центра.', extra: 'Клиент видит фото и цену доп. работ в приложении и согласует или отказывается.' },
      home: '«Хочу доставать кастрюли, не нагибаясь».',
      err: 'Писать от имени системы («система хранит записи»): исчезает человек и его задача, а с ними — способ проверить, что задача решена.'
    },
    {
      id: 'func', col: 'main', p: '', ico: '⚙️', t: 'Функциональные требования', en: 'functional requirements', q: 'Что именно должна делать система?',
      what: 'Поведение системы: что она делает в ответ на действия людей и события. Формулировка «Система должна…». Из одной задачи пользователя обычно вырастает несколько функций.',
      src: 'Аналитик выводит их из пользовательских требований и бизнес-правил', doc: 'Спецификация требований к ПО (SRS), критерии приёмки',
      marker: '«система должна…» + действие или событие + результат',
      ex: { noshow: 'Система должна за 24 часа до начала записи отправить клиенту push с кнопками «Приеду», «Перенести», «Отменить».', calls: 'Система должна показывать свободные слоты по 30 минут (BR-1) не раньше чем через 2 часа и не дальше 30 дней (BR-2).', extra: 'Система должна отправить клиенту предложение с фото, перечнем работ и ценой, как только мастер его сформировал.' },
      home: '«Ящики под варочной панелью выдвигаются полностью».',
      err: 'Слишком общо («система должна поддерживать запись») или наоборот — решение за разработчика («таблица booking с индексом по дате»).'
    },
    {
      id: 'nfr', col: 'side', ico: '📏', t: 'Нефункциональные требования', en: 'атрибуты качества', q: 'Насколько хорошо система это делает?',
      what: 'Атрибуты качества: скорость, доступность, безопасность, удобство. Хорошее НФТ измеримо: метрика, порог, условия. Подробно — в занятии про НФТ.',
      src: 'Бизнес (сколько клиент готов ждать), Глеб, DevOps, закон', doc: 'Раздел НФТ в SRS',
      marker: '«не дольше», «не менее», проценты, секунды, «при N пользователях»',
      ex: { noshow: 'Push-напоминание доходит до клиента не позже чем через 1 минуту после отправки.', calls: 'Поиск слотов — не дольше 1 секунды для 95 % запросов при 1 500 одновременных пользователях.', extra: 'Фото доп. работ — до 10 МБ, хранятся 6 месяцев.' },
      home: '«Фасады выдерживают 10 лет ежедневного открывания».',
      err: '«Быстро», «надёжно», «удобно» — без числа это пожелание: Лиза не сможет проверить, а Глеб — спроектировать.'
    },
    {
      id: 'rule', col: 'side', ico: '📜', t: 'Бизнес-правила', en: 'business rules', q: 'По каким правилам живёт бизнес — с системой или без?',
      what: 'Политики, законы, расчёты, которые существуют независимо от системы. Правило не говорит, что делает система, — оно задаёт рамки, из которых вырастают функции. У нас — BR-1…BR-16.',
      src: 'Эксперты: Марина Олеговна, Ольга Викторовна; договоры, законы', doc: 'Каталог бизнес-правил — отдельно от требований, чтобы на него ссылаться',
      marker: 'правило было бы верно и для бумажного журнала записи',
      ex: { noshow: 'BR-4: не приехал в течение 15 минут — «Неявка»; после 2 неявок подряд онлайн-запись только с предоплатой 500 ₽.', calls: 'BR-2: онлайн-запись не позже чем за 2 часа и не дальше 30 дней вперёд.', extra: 'BR-8: нет ответа в приложении 20 минут — мастер звонит.' },
      home: '«В доме не шумим после 22:00» — правило живёт и без вашей новой кухни.',
      err: 'Растворить правило в десятке требований. Правило меняется — и никто не знает, в каких местах его поправить.'
    },
    {
      id: 'con', col: 'side', ico: '🚧', t: 'Ограничения', en: 'constraints', q: 'Что сужает выбор решений?',
      what: 'То, что ограничивает команду в выборе решений: законы, обязательные системы, сроки, бюджет, технологии. Ограничение не обсуждают как пожелание — его соблюдают.',
      src: 'Закон, договор, ИТ-ландшафт заказчика, владелец продукта', doc: 'Концепция и границы; раздел «Ограничения» в SRS',
      marker: '«только», «нельзя», «обязательно» — про рамки решения, а не про поведение для пользователя',
      ex: { noshow: 'SMS — только через SMS-шлюз, с которым у «Искры» договор (SMSC).', calls: 'Первая версия — к 15 марта 2027: с 1 апреля сезон «переобувки».', extra: 'Фото с госномером — персональные данные: хранить на серверах в России (152-ФЗ).' },
      home: '«Бюджет 400 тысяч, кухня 7 м², газовую трубу не переносим».',
      err: 'Путать ограничение с пожеланием: «хочу на таком-то фреймворке» от заказчика — пожелание, которое обсуждают; 54-ФЗ о чеках — ограничение.'
    },
    {
      id: 'iface', col: 'side', ico: '🔌', t: 'Внешние интерфейсы', en: 'external interfaces', q: 'С кем и чем система обменивается?',
      what: 'Как система связана с другими системами, устройствами и людьми: что передаём, в какую сторону, как часто и что делаем, если та сторона молчит.',
      src: 'Владельцы внешних систем: Алия (1С), Ольга Викторовна (ЮKassa, касса), документация их API', doc: 'Раздел «Внешние интерфейсы» в SRS, описания API',
      marker: 'название внешней системы + что передаём + частота или событие',
      ex: { noshow: 'Push — через Firebase Cloud Messaging и APNs; не доставлен — SMS через SMSC.', calls: 'Адреса станций и маршрут — из Яндекс Карт.', extra: 'Запчасти для доп. работ — остатки из 1С, синхронизация каждые 15 минут (BR-12).' },
      home: '«Посудомойка подключается к имеющемуся сливу и розетке на 16 А».',
      err: 'Забыть «а если не ответила»: 1С недоступна — что видит мастер? ЮKassa прислала уведомление дважды — платим дважды?'
    },
    {
      id: 'trans', col: 'side', ico: '🔁', t: 'Переходные требования', en: 'transition requirements', q: 'Что нужно, чтобы перейти со старого на новое?',
      what: 'Временные требования на период перехода: перенос данных, обучение, параллельная работа старого и нового. После запуска они больше не нужны — но без них запуск сорвётся.',
      src: 'Владелец продукта, Марина Олеговна, Алия, будущая поддержка', doc: 'План перехода; раздел в концепции',
      marker: '«перенести», «на время перехода», «обучить», «до даты запуска»',
      ex: { noshow: 'Записи, сделанные по телефону до запуска, переносятся в систему — им тоже уходят напоминания.', calls: 'Перенести 31 000 клиентов из Excel и 1С, объединив дубли с телефонами +7… и 8….', extra: 'Обучить 14 мастеров-приёмщиков и 64 механика до пилота: памятка и 30 минут на станции.' },
      home: '«Пока идёт ремонт — плитка на балконе, посуда в коробках».',
      err: 'Вспомнить о переносе данных за неделю до запуска: дубли клиентов, история обслуживания и бонусы «потеряются».'
    }
  ];

  const howLevels = {
    id: 'how-levels', title: 'Как это работает: уровни и виды требований', free: true, noReset: true,
    simple: {
      icon: '🏢',
      plain: 'Требования бывают разного «этажа». Наверху — зачем бизнесу система (цель в цифрах). Посередине — что хотят сделать люди. Внизу — что именно делает система. Сбоку — то, что касается всех этажей: качество, правила бизнеса, законы и рамки, связи с другими системами, переезд со старого на новое.',
      analogy: 'Ремонт кухни. Зачем: «готовить ужин за 30 минут, а не за час». Что хочу делать: «доставать кастрюли, не нагибаясь». Что должна делать кухня: «ящики выдвигаются полностью». Сбоку: «фасады — 10 лет» (качество), «не шуметь после 22:00» (правило дома), «бюджет 400 тысяч и газ не переносим» (ограничения), «посудомойка к имеющемуся сливу» (интерфейс), «посуда пока в коробках» (переход).',
      tech: 'Классификация К. Вигерса и Дж. Битти («Разработка требований к программному обеспечению», 3-е изд.): три уровня — бизнес-требования (business), пользовательские (user), функциональные (functional) — и нефункциональные: атрибуты качества, ограничения, внешние интерфейсы; бизнес-правила — отдельный источник, из которого выводятся требования разных уровней. Переходные требования (transition) выделяет BABOK v3 наряду с бизнес-, требованиями заинтересованных лиц и требованиями к решению.'
    },
    lead: ui.brief({
      situation: 'Утро понедельника. Тимур Рашидович прислал письмо на две страницы: цели, жалобы, «хочу как в такси», законы, 1С — всё вперемешку. Вера: «Прежде чем отвечать, разложим письмо по полочкам. Требования бывают разного вида — и с каждым видом работают по-своему».',
      todo: [
        'Выберите сквозную цепочку вверху: одна из трёх целей «Искры». Примеры во всех карточках подстроятся под неё.',
        'Нажимайте на виды требований на карте: слева — три «этажа» сверху вниз, справа — виды, которые касаются всех этажей.',
        'Нажмите «Вся цепочка одной таблицей», чтобы увидеть, как одна цель спускается до функции и обрастает правилами и ограничениями.'
      ],
      look: 'Главный признак вида — на какой вопрос отвечает высказывание. «Зачем?» — бизнес. «Кто и что хочет сделать?» — пользователь. «Что делает система?» — функция. «Насколько хорошо?» — качество.'
    }),
    render(el) {
      el.classList.add('m2t-root');
      const st = { sel: 'biz', ch: 'noshow', all: false };
      el.innerHTML = `<div class="stack">
        <div class="row"><span class="small dim">Сквозная цепочка:</span>${ui.seg('ch', CHAINS, st.ch, 'accent')}</div>
        <div class="m2t-wmap" data-map></div>
        <div data-detail></div>
        <div><button type="button" class="btn sm" data-all aria-pressed="false">Вся цепочка одной таблицей</button></div>
        <div data-tbl></div>
        ${interview('Какие бывают виды требований?', 'Слабый ответ — «функциональные и нефункциональные». Сильный — по Вигерсу: три уровня (бизнес-требования — зачем, пользовательские — кто что хочет сделать, функциональные — что делает система) плюс нефункциональные (атрибуты качества, ограничения, внешние интерфейсы) и бизнес-правила как источник. Хорошо добавить пример одной цепочки сверху вниз и сказать, зачем различать: у каждого уровня свой источник, свой документ и свой способ проверки.')}
      </div>`;
      const btn = l => `<button type="button" class="m2t-lv ${l.col === 'side' ? 'side' : l.p}" data-lv="${l.id}" aria-pressed="${st.sel === l.id}"><span class="ic" aria-hidden="true">${l.ico}</span><span><b>${esc(l.t)}</b><small>${esc(l.q)}</small></span></button>`;
      function drawMap() {
        const main = LV.filter(l => l.col === 'main'), side = LV.filter(l => l.col === 'side');
        TR.$('[data-map]', el).innerHTML = `<div class="m2t-col"><div class="eyebrow">Три уровня — сверху вниз</div>${main.map((l, i) => btn(l) + (i < main.length - 1 ? '<div class="m2t-down">↓ из этого вырастает ↓</div>' : '')).join('')}</div>
          <div class="m2t-col"><div class="eyebrow">Касаются всех уровней</div>${side.map(btn).join('')}</div>`;
      }
      function drawDetail() {
        const l = LV.find(x => x.id === st.sel);
        TR.$('[data-detail]', el).innerHTML = `<div class="card">
          <div><div class="eyebrow">${esc(l.en)}</div><h3 class="m2t-h3">${l.ico} ${esc(l.t)}</h3><div class="small dim">${esc(l.q)}</div></div>
          <div class="m2t-facts">
            <div class="m2t-fact wide"><b>Что это</b>${l.what}</div>
            <div class="m2t-fact ex wide"><b>Пример «Искры» · ${esc(CHAINS.find(c => c.v === st.ch).t)}</b>${l.ex[st.ch]}</div>
            <div class="m2t-fact"><b>Откуда берётся</b>${l.src}</div>
            <div class="m2t-fact"><b>Где живёт</b>${l.doc}</div>
            <div class="m2t-fact"><b>Как узнать в тексте</b>${l.marker}</div>
            <div class="m2t-fact home"><b>На кухне</b>${l.home}</div>
            <div class="m2t-fact bad wide"><b>Типичная ошибка</b>${l.err}</div>
          </div></div>`;
      }
      function drawTbl() {
        TR.$('[data-tbl]', el).innerHTML = st.all ? ui.table(['Вид', 'Цепочка «' + esc(CHAINS.find(c => c.v === st.ch).t) + '»'], LV.map(l => [`<b>${esc(l.t)}</b>`, l.ex[st.ch]])) + `<div class="small dim" style="margin-top:6px">Обратите внимание: одна цель бизнеса дала и функцию, и НФТ, и правило, и ограничение. Поэтому виды различают — но держат связанными.</div>` : '';
      }
      TR.on(el, 'click', '[data-lv]', (e, b) => { st.sel = b.dataset.lv; drawMap(); drawDetail(); });
      TR.on(el, 'click', '[data-all]', (e, b) => { st.all = !st.all; b.setAttribute('aria-pressed', String(st.all)); drawTbl(); });
      ui.onSeg(el, (n, v) => { if (n === 'ch') { st.ch = v; drawDetail(); drawTbl(); } });
      drawMap(); drawDetail(); drawTbl();
      el.insertAdjacentHTML('beforeend', anNote('Вид требования подсказывает, <b>у кого его спрашивать и как проверять</b>. Цель — у Тимура Рашидовича, и проверяют её цифрами через полгода. Задачу пользователя — у Елены и Марины Олеговны, проверяют на демо. Функцию — пишет аналитик, проверяет Лиза по критериям приёмки. Правило — у экспертов, и живёт оно в каталоге BR-*, а требования на него ссылаются.'));
    }
  };

  // =====================================================================
  // Теория 2. Бизнес-правила, ограничения и «правило или требование»
  // =====================================================================
  const BRT = {
    fact: { t: 'Факт', d: 'Утверждение о бизнесе, которое просто верно: кто что делает, что из чего состоит.' },
    cons: { t: 'Ограничение', d: 'Что можно и чего нельзя: «не позже», «только», «не более».' },
    act: { t: 'Активатор действия', d: '«Если случилось X — сделать Y». Запускает действие.' },
    inf: { t: 'Вывод', d: '«Если выполнены условия — считается, что…». Из фактов рождается новое знание.' },
    calc: { t: 'Вычисление', d: 'Формула: как посчитать число — длительность, бонусы, плату.' }
  };
  const BRS = [
    { n: 1, k: 'calc', t: 'Сетка записи 30 минут; длительность записи = сумма нормо-часов услуг, вверх до 30 минут', fr: 'Система должна рассчитывать длительность записи по услугам: 1,2 нормо-часа (72 мин) → 90 минут, три слота подряд.' },
    { n: 2, k: 'cons', t: 'Онлайн-запись не позже чем за 2 часа до начала и не дальше 30 дней вперёд', fr: 'Система должна показывать в онлайн-записи только слоты от «сейчас + 2 часа» до «сегодня + 30 дней».' },
    { n: 3, k: 'cons', t: 'Бесплатная отмена и перенос — не позднее чем за 3 часа до начала', fr: 'Система должна показывать кнопки «Перенести» и «Отменить» до момента «начало − 3 часа»; позже — телефон станции.' },
    { n: 4, k: 'inf', t: 'Не приехал в течение 15 минут после начала — «Неявка», пост освобождается. После 2 неявок подряд онлайн-запись только с предоплатой 500 ₽ (засчитывается в оплату)', fr: 'Система должна через 15 минут после начала переводить запись без отметки «Клиент приехал» в статус «Неявка».' },
    { n: 5, k: 'fact', t: 'В записи цена «от» по каталогу; итог — после приёмки и диагностики', fr: 'Система должна показывать в записи цену с пометкой «от» и пояснением «итог — после диагностики».' },
    { n: 6, k: 'cons', t: 'Платные доп. работы — только с согласия клиента (правила оказания услуг по ремонту и Закон о защите прав потребителей)', fr: 'Система должна не давать механику отметить доп. работу выполненной, пока предложение не в статусе «Согласовано».' },
    { n: 7, k: 'fact', t: 'Проблему находит механик (фото, отметка в планшете); предложение с ценой формирует мастер-приёмщик', fr: 'Система должна давать механику только отметку с фото, а цену и перечень — редактировать только мастеру.' },
    { n: 8, k: 'act', t: 'Нет ответа в приложении 20 минут → мастер звонит. Не дозвонился — основные работы продолжаются, доп. ждут; к концу основных ответа нет → «Истекло», обсуждают при выдаче', fr: 'Система должна через 20 минут без ответа показать мастеру задачу «Позвонить клиенту» с телефоном и суммой.' },
    { n: 9, k: 'inf', t: 'Корпоративные: доп. работы до лимита договора (у «Шашки» 3 000 ₽) согласуются автоматически; дороже — согласует завгар в кабинете компании', fr: 'Система должна согласовывать предложение автоматически (decided_by = auto), если сумма не больше лимита договора компании.' },
    { n: 10, k: 'cons', t: 'Оплата после статуса «Готов»: онлайн (карта, СБП через ЮKassa) или касса станции; юрлица — счёт раз в месяц; чек — онлайн-касса по 54-ФЗ', fr: 'Система должна открывать кнопку «Оплатить» только для заказ-нарядов в статусе «Готов».' },
    { n: 11, k: 'calc', t: 'Бонусы: 5 % от работ (не запчастей) после оплаты; списать до 30 % стоимости работ; 1 балл = 1 ₽; сгорают через 12 месяцев; корпоративным не начисляются', fr: 'Система должна после оплаты начислять бонусы: 5 % от суммы строк-работ, без запчастей; компаниям — 0.' },
    { n: 12, k: 'act', t: 'Запчасти: остатки в 1С; при записи на ТО — резерв на 3 дня; нет на складе — заказ 1–2 рабочих дня, запись не раньше поставки', fr: 'Система должна при записи на ТО создавать в 1С резерв запчастей на 3 дня.' },
    { n: 13, k: 'act', t: '«Готов» → push и SMS; бесплатное хранение машины до конца следующего дня, далее 500 ₽ в сутки', fr: 'Система должна при переходе заказ-наряда в «Готов» отправить клиенту push и SMS с адресом станции.' },
    { n: 14, k: 'inf', t: 'Гарантия на работы — 6 месяцев или 10 000 км, что раньше', fr: 'Система должна при приёмке показывать мастеру, действует ли гарантия на прошлые работы по этой машине.' },
    { n: 15, k: 'cons', t: 'ФИО, телефон, email, госномер, VIN — персональные данные: согласие при регистрации, хранение в РФ (152-ФЗ)', fr: 'Система должна не давать зарегистрироваться без отметки согласия на обработку персональных данных.' },
    { n: 16, k: 'cons', t: 'Заказ-наряды и платежи хранятся 5 лет; при удалении аккаунта документы остаются', fr: 'Система должна при удалении аккаунта обезличивать профиль, но сохранять заказ-наряды и платежи 5 лет.' }
  ];
  const FLIPS = [
    { q: '«Отмена бесплатна не позднее чем за 3 часа до начала»', a: '<b>Бизнес-правило</b> (BR-3). Оно верно и для оператора с бумажным журналом. Требования — то, как система его соблюдает: когда показывать кнопку, что писать клиенту.' },
    { q: '«Система должна скрывать кнопку «Отменить», когда до начала меньше 3 часов»', a: '<b>Функциональное требование</b>, выведенное из BR-3. Ссылается на правило: поменяется правило — найдём это требование по ссылке.' },
    { q: '«Чек — только через онлайн-кассу по 54-ФЗ»', a: '<b>Ограничение</b>: закон сужает выбор решений — свой чек «картинкой» сделать нельзя. Вместе с ним появляется <b>внешний интерфейс</b> с АТОЛ Онлайн.' },
    { q: '«Хочу, чтобы сделали на Flutter, у племянника так»', a: '<b>Пожелание</b>, а не ограничение. Выслушать, записать, отдать Глебу как вход. Ограничением оно станет, только если это обязательное условие договора.' }
  ];
  const CONS = [
    { t: 'Закон', ex: '54-ФЗ — чек через онлайн-кассу; 152-ФЗ — персональные данные в России; Закон о защите прав потребителей — доп. работы только с согласия (BR-6).', no: 'Нельзя хранить фото с госномером на зарубежном облаке; нельзя «согласовать молчанием».' },
    { t: 'Обязательные системы', ex: '1С остаётся главной по складу и бухгалтерии; ЮKassa — по договору; SMSC — по договору.', no: 'Нельзя завести «свой склад» в обход 1С — у Алии будут две правды.' },
    { t: 'Срок и бюджет', ex: 'MVP к 15 марта 2027: с 1 апреля поток записей в 3–4 раза больше.', no: 'Нельзя брать в первую версию всё, что хочется: каждая функция должна оправдать место.' },
    { t: 'Люди и среда', ex: 'Механики работают в перчатках, руки грязные; в цехе бывает плохая связь.', no: 'Нельзя требовать от механика набирать текст — только фото и крупные кнопки.' }
  ];

  const howRules = {
    id: 'how-rules', covers: ['t-sort'], title: 'Как это работает: бизнес-правила, ограничения, интерфейсы и переход', free: true, noReset: true,
    simple: {
      icon: '📜',
      plain: 'Бизнес-правило — то, как живёт бизнес, даже если никакой программы нет: «отмена бесплатно за 3 часа». Требование — что делает система, чтобы правило соблюдалось. Ограничение — рамка, в которой команда выбирает решение: закон, срок, обязательная 1С.',
      analogy: 'Правила дорожного движения существуют без вашей машины: «на красный стоим». Требование к машине — «тормоза останавливают её с 60 км/ч на 20 метрах». Ограничение — «машина должна пройти сертификацию». Правило одно, а требований, которые помогают его соблюдать, — много.',
      tech: 'Вигерс выделяет бизнес-правила как отдельный класс информации, а не уровень требований, и делит их на факты, ограничения, активаторы действий, выводы и вычисления (по классификации Р. Росса). Правила ведут в отдельном каталоге с идентификаторами (у нас BR-1…BR-16) и ссылаются на них из требований — это упрощает анализ влияния при изменении правила.'
    },
    lead: ui.brief({
      situation: 'Глеб, прочитав черновик: «У вас в требованиях одно и то же правило про три часа написано в пяти местах, и в двух — по-разному. Какое верное?» Вера: «Вот поэтому правила держат отдельно, а требования на них ссылаются».',
      todo: [
        'Нажимайте на правила BR-1…BR-16. Увидите тип правила по Вигерсу и одно функциональное требование, которое из него выросло. Фильтр вверху оставит правила одного типа.',
        'Переверните четыре карточки «Правило, требование, ограничение или пожелание?».',
        'Посмотрите четыре вида ограничений «Искры»: что каждое запрещает команде.'
      ],
      look: 'Проверка «бумажным журналом»: если высказывание было бы верно, когда Марина Олеговна записывает клиентов в тетрадь, — это правило бизнеса, а не требование к системе.'
    }),
    render(el) {
      el.classList.add('m2t-root');
      const st = { br: 3, f: '', flip: new Set() };
      el.innerHTML = `<div class="stack">
        <div class="stack tight"><span class="eyebrow">Каталог бизнес-правил «Искры» · типы по Вигерсу</span>
          <div class="m2t-legend" data-leg></div>
          <div class="m2t-brs" data-brs></div></div>
        <div data-brd></div>
        <div class="stack tight"><span class="eyebrow">Правило, требование, ограничение или пожелание?</span><div class="m2t-flip" data-flip></div></div>
        <div class="stack tight"><span class="eyebrow">Ограничения: что они запрещают команде</span>
          <div class="m2t-facts">${CONS.map(c => `<div class="m2t-fact"><b>${c.t}</b>${c.ex}<div class="small" style="margin-top:6px;color:var(--bad)">Нельзя: ${c.no.replace(/^Нельзя /, '')}</div></div>`).join('')}</div></div>
        <div class="m2t-facts">
          <div class="m2t-fact"><b>Внешние интерфейсы «Искры»</b>1С (остатки, резервы, бухгалтерия — каждые 15 минут), ЮKassa (оплата и уведомления-вебхуки), SMSC (SMS), Firebase и APNs (push), АТОЛ Онлайн (чеки), Яндекс Карты. Для каждого: что передаём, в какую сторону, как часто, <b>что делаем, если сторона не ответила</b>.</div>
          <div class="m2t-fact"><b>Переходные требования «Искры»</b>Перенос 31 000 клиентов из Excel и 1С с объединением дублей (+7… и 8…); перенос телефонных записей на даты после запуска; обучение 14 мастеров и 64 механиков; две недели параллельной работы телефона и онлайн-записи.</div>
        </div>
        ${interview('Чем бизнес-правило отличается от функционального требования?', 'Правило описывает бизнес и существует без системы (BR-3: «отмена бесплатна не позднее чем за 3 часа»). Требование описывает поведение системы и часто выводится из правила («система должна скрывать кнопку „Отменить“ позже чем за 3 часа»). Из одного правила растёт несколько требований, поэтому правила ведут отдельным каталогом и ссылаются на них — иначе при изменении правила его придётся искать по всей спецификации.')}
      </div>`;
      function drawLeg() {
        TR.$('[data-leg]', el).innerHTML = `<button type="button" data-f="" aria-pressed="${!st.f}">все</button>` + Object.keys(BRT).map(k => `<button type="button" data-f="${k}" aria-pressed="${st.f === k}">${BRT[k].t}</button>`).join('');
        TR.$('[data-brs]', el).innerHTML = BRS.map(b => `<button type="button" class="m2t-br ${st.f && st.f !== b.k ? 'dim' : ''}" data-k="${b.k}" data-br="${b.n}" aria-pressed="${st.br === b.n}" aria-label="Правило BR-${b.n}">BR-${b.n}</button>`).join('');
      }
      function drawBr() {
        const b = BRS.find(x => x.n === st.br), k = BRT[b.k];
        TR.$('[data-brd]', el).innerHTML = `<div class="card"><div class="eyebrow">BR-${b.n} · ${k.t}</div><div><b>${esc(b.t)}</b></div>
          <div class="small dim">${k.t}: ${k.d}</div>
          <div class="m2t-facts"><div class="m2t-fact"><b>Правило — живёт без системы</b>${esc(b.t)}</div><div class="m2t-fact ex"><b>Одно из требований, которые из него выросли</b>${esc(b.fr)} <span class="small dim">(ссылка: BR-${b.n})</span></div></div></div>`;
      }
      function drawFlip() {
        TR.$('[data-flip]', el).innerHTML = FLIPS.map((f, i) => `<button type="button" data-fl="${i}" aria-pressed="${st.flip.has(i)}"><span>${esc(f.q)}</span>${st.flip.has(i) ? `<span class="a">${f.a}</span>` : '<span class="small dim">Нажмите, чтобы перевернуть</span>'}</button>`).join('');
      }
      TR.on(el, 'click', '[data-f]', (e, b) => { st.f = b.dataset.f; const first = BRS.find(x => !st.f || x.k === st.f); if (first) st.br = first.n; drawLeg(); drawBr(); });
      TR.on(el, 'click', '[data-br]', (e, b) => { st.br = +b.dataset.br; drawLeg(); drawBr(); });
      TR.on(el, 'click', '[data-fl]', (e, b) => { const i = +b.dataset.fl; if (st.flip.has(i)) st.flip.delete(i); else st.flip.add(i); drawFlip(); });
      drawLeg(); drawBr(); drawFlip();
      el.insertAdjacentHTML('beforeend', anNote('Новичок обычно делает одно из двух: либо прячет правило внутри требований (и потом не может его найти), либо записывает пожелание заказчика как ограничение (и команда теряет свободу выбора без причины). Спасает простой порядок: правило — в каталог с номером, требование — со ссылкой на номер, ограничение — с источником (закон, договор, дата).'));
    }
  };

  // =====================================================================
  // Теория 3. Потребность и решение, трассировка
  // =====================================================================
  const LADS = [
    {
      id: 'taxi', t: '«Хочу как в такси»', who: 'Тимур Рашидович',
      goal: 'Клиент звонит на станцию 2–3 раза за визит, мастера отвлекаются от приёмки. Цель — чтобы звонков «что с машиной?» почти не было.',
      need: 'Клиент хочет знать, что с машиной и когда её забрать, не звоня на станцию.',
      sol: '«Машинка на карте, как в такси, — пусть клиент видит, где его машина»',
      alts: ['Статус ремонта в приложении: «Открыт → В работе → Ждёт согласования → Готов»', 'Push и SMS при смене статуса, особенно «Готов» (BR-13)', 'Ориентир «будет готова примерно к 16:00» в карточке заказ-наряда', '<span class="dim">«Машинка на карте» — машина стоит на подъёмнике: двигаться по карте ей некуда. Похоже на такси снаружи, но не решает задачу.</span>']
    },
    {
      id: 'call', t: '«Кнопка «Перезвоните мне»»', who: 'Тимур Рашидович',
      goal: 'В часы пик (9–11 и 17–19) теряется 21 % звонков. Цель — 5 %.',
      need: 'Клиент хочет записаться, когда удобно ему, а не когда освободится оператор.',
      sol: '«Кнопка «Перезвоните мне» на сайте»',
      alts: ['Онлайн-запись в приложении и на сайте — без оператора совсем', 'Обратный звонок — сглаживает пик, но три оператора всё равно перегружены', 'Подсказка «сейчас ждать 5 минут — запишитесь онлайн» в голосовом меню']
    },
    {
      id: 'chat', t: '«Чат с механиком»', who: 'Тимур Рашидович',
      goal: 'Простой машины на согласовании доп. работ — 1 ч 40 мин. Цель — 20 минут.',
      need: 'Клиент хочет быстро понять, что нашли и сколько это стоит, и решить, не отрываясь от работы.',
      sol: '«Чат клиента с механиком — пусть сам спрашивает»',
      alts: ['Предложение доп. работ в приложении: фото, перечень, цена, кнопки «Согласовать» и «Отказаться»', 'Звонок мастера, если ответа нет 20 минут (BR-8)', 'Автосогласование до лимита для корпоративных (BR-9)', '<span class="dim">Чат: Сергей Петрович — «механики грязными руками писать не будут», а цену по BR-7 формирует мастер, а не механик.</span>']
    }
  ];
  const TD = {
    goals: [{ id: 'g1', t: 'Потерянные обращения 21 % → 5 %' }, { id: 'g2', t: 'Простой на согласовании 1 ч 40 мин → 20 мин' }],
    tasks: [{ id: 'u1', g: 'g1', t: 'Клиент сам записывается онлайн' }, { id: 'u2', g: 'g1', t: 'Оператор записывает по телефону за минуту, видя все станции' }],
    funcs: [
      { id: 'f1', u: 'u1', t: 'Поиск свободных слотов по станции и услугам (BR-1, BR-2)' },
      { id: 'f2', u: 'u1', t: 'Подтверждение записи push и SMS' },
      { id: 'f3', u: 'u2', t: 'Единое расписание 7 станций в АРМ оператора' },
      { id: 'f4', u: null, t: 'Тёмная тема в приложении' }
    ]
  };

  const howTrace = {
    id: 'how-trace', covers: ['t-taxi', 't-trace', 't-lab'], title: 'Как это работает: потребность, решение и трассировка', free: true, noReset: true,
    simple: {
      icon: '🧵',
      plain: 'Заказчик часто приходит с готовым решением: «сделайте чат», «как в такси». За решением всегда стоит потребность — её и надо найти, спрашивая «зачем?». А потом каждую функцию привязать ниточкой к цели. Функция без ниточки — «сирота»: непонятно, зачем на неё тратить деньги. Цель без ниточек вниз — обещание, которое никто не выполнит.',
      analogy: 'Пациент приходит к врачу: «Выпишите мне антибиотик». Хороший врач спрашивает: «А что беспокоит?» — и выясняет, что болит горло от вирусной инфекции, а антибиотик тут не поможет. Решение пациента — гипотеза, а не диагноз.',
      tech: 'Различие потребности и решения — базовая идея BABOK v3 (Needs vs Solutions) и Вигерса («что, а не как»). Трассировка (traceability) — связь требований между уровнями и с источниками: прямая (от цели вниз — что её реализует) и обратная (от функции вверх — зачем она). Ведут в матрице трассировки требований (RTM). Требование без связи с целью или правилом — «сирота» (orphan): его либо привязывают, либо убирают с согласия владельца продукта.'
    },
    lead: ui.brief({
      situation: 'В письме Тимура Рашидовича три «хочу»: как в такси, кнопка «перезвоните мне», чат с механиком. Вера: «Ни одно из них пока не требование — это решения. Давайте спросим „зачем?“ и посмотрим, что под ними».',
      todo: [
        'Выберите «хочу» и нажимайте «Зачем?» — поднимитесь от решения к потребности и к цели бизнеса.',
        'На уровне потребности нажмите «Как ещё?» — увидите другие решения той же потребности.',
        'Внизу — дерево трассировки. Нажмите на цель — подсветится всё, что её реализует (прямая трассировка). Нажмите на функцию — подсветится путь вверх (обратная). Найдите сироту и цель без функций.'
      ],
      look: 'Одна потребность — много решений. Аналитик не отбрасывает решение заказчика, а кладёт его в список вариантов рядом с другими — и сравнивает, какое лучше двигает цель.'
    }),
    render(el) {
      el.classList.add('m2t-root');
      const st = { lad: 'taxi', up: 0, alts: false, node: '' };
      el.innerHTML = `<div class="stack">
        <div class="row"><span class="small dim">«Хочу» из письма:</span>${ui.seg('lad', LADS.map(l => ({ v: l.id, t: l.t })), st.lad, 'accent')}</div>
        <div data-lad></div>
        <div class="stack tight"><span class="eyebrow">Дерево трассировки · нажмите на узел</span><div class="m2t-tree" data-tree></div><div data-tnote></div></div>
        ${interview('Заказчик говорит: «Сделайте чат». Ваши действия?', 'Не спорить и не соглашаться сразу. Спросить «зачем?», «что сейчас мешает?», «как поймём, что стало лучше?» — и добраться до потребности и цели в цифрах. Затем предложить 2–3 решения, включая решение заказчика, с ценой и влиянием на цель, и дать выбрать владельцу продукта. Выбранное решение связать с целью в матрице трассировки.')}
      </div>`;
      function drawLad() {
        const l = LADS.find(x => x.id === st.lad);
        const rung = (k, lv, txt, show) => `<div class="m2t-rung ${k} ${show ? '' : 'hid'}"><span class="eyebrow">${lv}</span><span>${show ? txt : 'скрыто — спросите «Зачем?»'}</span></div>`;
        TR.$('[data-lad]', el).innerHTML = `<div class="card"><div class="m2t-ladder">
          ${rung('goal', 'Цель бизнеса (бизнес-требование)', esc(l.goal), st.up >= 2)}
          ${rung('need', 'Потребность (пользовательское требование)', esc(l.need), st.up >= 1)}
          ${st.alts && st.up >= 1 ? `<div class="m2t-alts"><b>Как ещё можно закрыть эту потребность:</b>${l.alts.map(a => `<div>• ${a}</div>`).join('')}</div>` : ''}
          ${rung('sol', 'Решение, которое предложил ' + l.who, esc(l.sol), true)}
        </div>
        <div class="row"><button type="button" class="btn sm primary" data-up ${st.up >= 2 ? 'disabled' : ''}>Зачем?</button>
          <button type="button" class="btn sm" data-alts ${st.up >= 1 ? '' : 'disabled'} aria-pressed="${st.alts}">Как ещё?</button>
          <button type="button" class="btn ghost sm" data-rst>Сначала</button></div>
        ${st.up >= 2 ? ui.say('vera', 'Видите? Теперь мы можем сравнивать решения по одному вопросу: <b>какое сильнее двигает цифру</b>. И «машинка на карте», и «чат» честно попадают в список — но проигрывают дешёвым и точным вариантам.') : ''}</div>`;
      }
      function rel(id) {
        // что подсвечивать: прямая трассировка от цели или задачи вниз, обратная от функции вверх
        const on = new Set([id]);
        const g = TD.goals.find(x => x.id === id), u = TD.tasks.find(x => x.id === id), f = TD.funcs.find(x => x.id === id);
        if (g) TD.tasks.filter(t => t.g === id).forEach(t => { on.add(t.id); TD.funcs.filter(x => x.u === t.id).forEach(x => on.add(x.id)); });
        if (u) { on.add(u.g); TD.funcs.filter(x => x.u === id).forEach(x => on.add(x.id)); }
        if (f && f.u) { on.add(f.u); on.add(TD.tasks.find(t => t.id === f.u).g); }
        return on;
      }
      function drawTree() {
        const on = st.node ? rel(st.node) : null;
        const cls = id => on ? (on.has(id) ? 'on' : 'dim') : '';
        const node = (k, x, extra, tag) => `<button type="button" class="m2t-node ${k} ${extra || ''} ${cls(x.id)}" data-node="${x.id}">${esc(x.t)}${tag || ''}</button>`;
        TR.$('[data-tree]', el).innerHTML = TD.goals.map(g => {
          const ts = TD.tasks.filter(t => t.g === g.id);
          return `<div>${node('g', g, ts.length ? '' : 'empty', ts.length ? '' : '<span class="tg warn">цель без функций</span>')}${ts.length ? `<div class="m2t-kids">${ts.map(t => `<div>${node('u', t)}<div class="m2t-kids">${TD.funcs.filter(f => f.u === t.id).map(f => node('', f)).join('')}</div></div>`).join('')}</div>` : ''}</div>`;
        }).join('') + `<div><div class="eyebrow" style="margin:4px 0">Без связи вверх</div>${TD.funcs.filter(f => !f.u).map(f => node('', f, 'orph', '<span class="tg bad">сирота</span>')).join('')}</div>`;
        let n = '';
        if (st.node === 'f4') n = ui.note('bad', 'Сирота', 'Тёмная тема не ведёт ни к одной цели. Это не значит «плохая идея» — значит, надо спросить, зачем она и кто просил. Не нашлось цели — в бэклог после MVP или убрать с согласия Тимура Рашидовича.');
        else if (st.node === 'g2') n = ui.note('warn', 'Цель без функций', 'Цель записана, но ни одна функция её не реализует. Это обещание, которое не выполнится: через полгода простой останется 1 ч 40 мин. Нужно найти задачи пользователей и функции — или честно убрать цель.');
        else if (TD.funcs.some(f => f.id === st.node)) n = ui.note('ok', 'Обратная трассировка', 'Путь вверх показывает, <b>зачем</b> функция: какая задача пользователя и какая цель бизнеса за ней стоят. Если цель уберут — станет видно, какие функции больше не нужны.');
        else if (st.node) n = ui.note('ok', 'Прямая трассировка', 'Путь вниз показывает, <b>чем</b> реализуется цель или задача. Если правило или цель изменятся — сразу видно, какие функции переделывать.');
        TR.$('[data-tnote]', el).innerHTML = n;
      }
      TR.on(el, 'click', '[data-up]', () => { st.up = Math.min(2, st.up + 1); drawLad(); });
      TR.on(el, 'click', '[data-alts]', () => { st.alts = !st.alts; drawLad(); });
      TR.on(el, 'click', '[data-rst]', () => { st.up = 0; st.alts = false; drawLad(); });
      TR.on(el, 'click', '[data-node]', (e, b) => { st.node = st.node === b.dataset.node ? '' : b.dataset.node; drawTree(); });
      ui.onSeg(el, (n, v) => { if (n === 'lad') { st.lad = v; st.up = 0; st.alts = false; drawLad(); } });
      drawLad(); drawTree();
      el.insertAdjacentHTML('beforeend', anNote('Трассировка — не бюрократия, а ответ на два вопроса, которые вам будут задавать каждую неделю. Тимур Рашидович: «Зачем мы делаем эту функцию?» — обратная трассировка. Артём: «Цель поменялась — что из бэклога это задевает?» — прямая. Без связей на оба вопроса отвечают «на глаз».'));
    }
  };

  // =====================================================================
  // Практика 1. Разложить 16 высказываний по видам
  // =====================================================================
  const SORT_B = [
    { id: 'biz', t: 'Бизнес-требование', sub: 'зачем бизнесу' },
    { id: 'user', t: 'Пользовательское', sub: 'кто что хочет сделать' },
    { id: 'func', t: 'Функциональное', sub: 'что делает система' },
    { id: 'nfr', t: 'Нефункциональное', sub: 'насколько хорошо' },
    { id: 'rule', t: 'Бизнес-правило', sub: 'живёт без системы' },
    { id: 'con', t: 'Ограничение', sub: 'рамки решения' },
    { id: 'iface', t: 'Внешний интерфейс', sub: 'обмен с другими системами' },
    { id: 'trans', t: 'Переходное', sub: 'со старого на новое' }
  ];
  const SORT_I = [
    { id: 's1', t: 'Сократить неявки с 17 % до 8 % к сезону 2027 года', ok: 'biz', why: 'Цель бизнеса: показатель, «было → станет», срок.' },
    { id: 's2', t: 'Снизить простой машины на согласовании доп. работ с 1 ч 40 мин до 20 минут', ok: 'biz', why: 'Цель бизнеса в цифрах — про деньги (простаивающий пост), а не про экраны.' },
    { id: 's3', t: 'Клиент хочет записаться на ТО в приложении, не дозваниваясь до колл-центра', ok: 'user', why: 'Роль и её задача — пользовательское требование.' },
    { id: 's4', t: 'Мастер-приёмщик хочет утром видеть все записи станции на день с услугами и машинами', ok: 'user', why: 'Задача мастера, сформулированная от его лица.' },
    { id: 's5', t: 'Система должна отправить клиенту push с фото и ценой, как только мастер отправил предложение доп. работ', ok: 'func', why: 'Поведение системы: событие → действие → результат.' },
    { id: 's6', t: 'Система должна по кнопке «Клиент приехал» в АРМ мастера переводить запись в статус «Клиент приехал»', ok: 'func', alt: { user: 'Здесь говорит не человек о своей задаче, а «система должна…» — это уже поведение системы, функция.' }, why: 'Конкретное поведение системы в ответ на действие мастера.' },
    { id: 's7', t: 'Поиск свободных слотов — не дольше 1 секунды для 95 % запросов при 1 500 одновременных пользователях', ok: 'nfr', why: 'Атрибут качества (производительность) с метрикой, порогом и нагрузкой.' },
    { id: 's8', t: 'Push о смене статуса ремонта доходит до клиента не позже чем через 1 минуту', ok: 'nfr', alt: { func: 'Что отправлять push — функция. А «не позже чем через минуту» — насколько хорошо, это НФТ.' }, why: '«Не позже чем через минуту» — скорость, атрибут качества.' },
    { id: 's9', t: 'Бесплатная отмена и перенос — не позднее чем за 3 часа до начала записи', ok: 'rule', alt: { con: 'Внутри правила есть «не позднее», но источник — политика «Искры», а не закон или рамки решения. Это бизнес-правило BR-3.' }, why: 'BR-3: политика бизнеса, верна и для бумажного журнала.' },
    { id: 's10', t: 'Бонусы — 5 % от стоимости работ (не запчастей); корпоративным клиентам не начисляются', ok: 'rule', why: 'BR-11: правило-вычисление, существует независимо от приложения.' },
    { id: 's11', t: 'Персональные данные клиентов — ФИО, телефон, госномер — хранятся только на серверах в России', ok: 'con', alt: { rule: 'Это требование закона (152-ФЗ), и в каталоге «Искры» оно стоит как BR-15. Но для команды это прежде всего рамка решения: где можно держать базу. Засчитано наполовину.' }, why: 'Закон (152-ФЗ) сужает выбор решений — ограничение.' },
    { id: 's12', t: 'Первая версия должна работать к 15 марта 2027 года', ok: 'con', alt: { biz: 'Срок — не цель сама по себе: он не говорит, что изменится для бизнеса. Это рамка проекта — ограничение.' }, why: 'Срок проекта — ограничение: он определяет, что успеем взять в MVP.' },
    { id: 's13', t: 'Остатки запчастей получаем из 1С каждые 15 минут; если 1С не отвечает — показываем последние известные остатки с временем обновления', ok: 'iface', alt: { con: 'Что 1С обязательна — ограничение. Но здесь описан сам обмен: что, как часто и что если молчит, — внешний интерфейс.' }, why: 'Обмен с внешней системой: что, как часто, что при сбое.' },
    { id: 's14', t: 'Оплата картой и СБП — через ЮKassa; о результате платежа ЮKassa сообщает уведомлением (вебхуком) на наш сервер', ok: 'iface', alt: { func: 'Здесь главное — обмен с внешней системой: кто кому что передаёт. Это внешний интерфейс.' }, why: 'Связь с платёжной системой — внешний интерфейс.' },
    { id: 's15', t: 'Перенести 31 000 клиентов из Excel и 1С в новую базу, объединив дубли с телефонами +7… и 8…', ok: 'trans', why: 'Нужно один раз — на переход. После запуска требование больше не нужно.' },
    { id: 's16', t: 'Первые две недели после запуска станции принимают и телефонные, и онлайн-записи; операторы переносят телефонные записи в новую систему', ok: 'trans', why: 'Параллельная работа старого и нового — переходное требование.' }
  ];
  function sortEval(v) {
    v = v || {};
    return SORT_I.map(r => { const g = v[r.id]; if (g === r.ok) return { r, s: 'ok', pts: 1 }; if (r.alt && r.alt[g]) return { r, s: 'warn', pts: 0.5, got: g }; return { r, s: 'bad', pts: 0, got: g }; });
  }
  const bT = id => (SORT_B.find(b => b.id === id) || { t: '—' }).t;
  const SORT_HINT = {
    biz: 'Есть ли здесь показатель бизнеса «было → станет»?', user: 'Кто здесь действует и чего хочет достичь?', func: 'Здесь описано, что делает система?',
    nfr: 'Есть ли здесь «насколько хорошо»: секунды, проценты, нагрузка?', rule: 'Было бы это верно, если бы приложения не было?', con: 'Откуда это — из закона, договора, срока? Обсуждается ли?',
    iface: 'Упоминается внешняя система и обмен с ней?', trans: 'Это нужно постоянно или только на время перехода?'
  };
  const taskSort = {
    id: 't-sort', title: 'Разложить письмо по видам требований',
    simple: howLevels.simple,
    lead: ui.brief({
      situation: 'Вера выписала из письма Тимура Рашидовича, протокола кик-оффа и заметок Глеба 16 высказываний. «Разложите их по видам — от этого зависит, к кому с каждым идти и где его хранить».',
      todo: [
        'Разложите 16 карточек по восьми корзинам: нажмите на карточку, затем на корзину (на компьютере можно перетаскивать).',
        'Для каждой спросите: на какой вопрос она отвечает — «зачем?», «кто что хочет?», «что делает система?», «насколько хорошо?» — или это правило, рамка, обмен, переход.',
        'Нажмите «Проверить». Засчитывается от 80 %. Где граница размыта, второй ответ засчитывается наполовину — с пояснением.'
      ],
      look: 'В каждую корзину попадает ровно по две карточки. Проверка «бумажным журналом» отличает правило от требования; «обсуждается ли?» — ограничение от пожелания.'
    }),
    blank: () => ({ v: {} }),
    reference: () => ({ v: Object.fromEntries(SORT_I.map(r => [r.id, r.ok])) }),
    render(el, ctx) {
      el.classList.add('m2t-root');
      let reveal = null;
      if (ctx.result) { reveal = {}; sortEval(ctx.ans.v).forEach(x => { if (ctx.ans.v && ctx.ans.v[x.r.id]) reveal[x.r.id] = x.s; }); }
      const box = document.createElement('div'); el.appendChild(box);
      ui.sort(box, { items: SORT_I.map(r => ({ id: r.id, t: esc(r.t) })), buckets: SORT_B, value: ctx.ans.v || {}, reveal, readonly: ctx.readonly, seed: 'm2t-sort', onChange: v => { ctx.ans.v = v; ctx.save(); } });
    },
    check(ans) {
      const ev = sortEval(ans && ans.v), score = ev.reduce((s, x) => s + x.pts, 0) / SORT_I.length, notes = [];
      ev.forEach(x => {
        if (x.s === 'ok') return;
        if (x.s === 'warn') notes.push({ ok: 'warn', html: `«${esc(x.r.t)}» → ${bT(x.got)}. ${x.r.alt[x.got]}` });
        else notes.push({ ok: false, html: `«${esc(x.r.t)}» — ${x.got ? `не «${bT(x.got)}». ${SORT_HINT[x.r.ok]}` : 'не разложено.'}` });
      });
      if (!notes.length) notes.push({ ok: true, html: 'Все 16 — на своих полках.' });
      const confBiz = ev.filter(x => ['s1', 's2'].includes(x.r.id) && x.s !== 'ok').length;
      return {
        ok: score >= 0.8, score, notes,
        summary: `Верно: ${ev.filter(x => x.s === 'ok').length} из ${SORT_I.length}, допустимо: ${ev.filter(x => x.s === 'warn').length}.`,
        mentor: confBiz ? 'Начните с верхнего этажа: <b>бизнес-требование — это цифра бизнеса «было → станет»</b>. В нём нет ни клиента с телефоном, ни системы — только неявки, простой, деньги.' : (score < 0.8 ? 'Пройдитесь вопросами: «зачем?» — бизнес, «кто что хочет?» — пользователь, «что делает система?» — функция, «насколько хорошо?» — НФТ. Остальное — правило, рамка, обмен или переход.' : null)
      };
    },
    explain: `<p>Ключ — вопрос, на который отвечает высказывание:</p>
      <ul class="checks">
        <li><b>«Зачем бизнесу?»</b> — неявки 17 % → 8 %, простой 1 ч 40 мин → 20 мин. Источник — Тимур Рашидович, проверка — цифрами после запуска.</li>
        <li><b>«Кто и что хочет сделать?»</b> — клиент записывается сам, мастер видит день. Источник — пользователи, проверка — на демо.</li>
        <li><b>«Что делает система?»</b> — push по событию, смена статуса по кнопке. Пишет аналитик, проверяет Лиза.</li>
        <li><b>«Насколько хорошо?»</b> — 1 секунда для 95 %, push за минуту. Без числа НФТ не бывает.</li>
        <li><b>Правило</b> живёт без системы (BR-3, BR-11); <b>ограничение</b> не обсуждается (152-ФЗ, 15 марта); <b>интерфейс</b> — обмен с 1С и ЮKassa и что при сбое; <b>переходное</b> нужно один раз (31 000 клиентов, параллельная работа).</li>
      </ul>
      <p>Граница «правило или ограничение» размыта — и это нормально: 152-ФЗ у «Искры» записан и правилом BR-15, и ограничением для команды. Важно другое — чтобы у каждого высказывания был свой источник и своё место. Источник: Вигерс и Битти, «Разработка требований к программному обеспечению», гл. 1 «Основы требований к ПО»; BABOK v3, раздел 2.3 «Классификация требований».</p>`,
    refNote: 'Засчитываются наполовину спорные пары: 152-ФЗ как бизнес-правило, срок 15 марта как бизнес-требование, обмен с 1С как ограничение, ЮKassa как функция, push за минуту как функция.',
    report: ans => sortEval(ans && ans.v).map(x => `- ${x.r.t} → ${bT((ans.v || {})[x.r.id])} ${mark(x.s)}`).join('\n')
  };

  // =====================================================================
  // Практика 2. Письмо Тимура Рашидовича: решения → потребности → уровни
  // =====================================================================
  const NEEDS = [
    { v: 'status', t: 'Клиент хочет знать, что с машиной, не звоня (звонит 2–3 раза за визит)' },
    { v: 'extra', t: 'Доп. работы согласуются быстро (простой 1 ч 40 мин)' },
    { v: 'calls', t: 'Не терять клиентов, которые не дозвонились (21 % в пик)' },
    { v: 'noshow', t: 'Клиенты приезжают, на что записались (неявки 17 %)' },
    { v: 'queue', t: 'Утром нет очереди у стойки приёмки (12–15 минут на клиента)' }
  ];
  const SOLS = [
    { id: 'a1', t: '«Хочу как в такси: чтобы клиент видел машинку на карте, пока её чинят»', ok: 'status', why: 'Машина стоит на подъёмнике — «карта» здесь про статус: клиенту важно знать, на каком этапе ремонт и когда забирать.' },
    { id: 'a2', t: '«Чат с механиком, чтобы клиент сам спрашивал»', ok: 'extra', alt: { status: 'Частично: клиент спрашивал бы и про статус. Но главный повод говорить с механиком — находки и доп. работы, где теряется 1 ч 40 мин.' }, why: 'Главное, о чём клиент говорит с цехом, — найденные проблемы и цена. Это согласование доп. работ.' },
    { id: 'a3', t: '«Кнопку „Перезвоните мне“ на сайте»', ok: 'calls', why: 'Кнопка — ответ на потерянные в пик звонки. Онлайн-запись закрывает ту же потребность сильнее.' },
    { id: 'a4', t: '«Пусть клиенты платят всё заранее — тогда приедут»', ok: 'noshow', why: 'Про неявки. Но «всё заранее» спорит с BR-5 (цена «от», итог после диагностики) — у «Искры» уже есть мягче: предоплата 500 ₽ после 2 неявок (BR-4).' },
    { id: 'a5', t: '«И SMS каждые полчаса, что с машиной»', ok: 'status', why: 'Та же потребность — статус без звонка. SMS каждые полчаса — дорого и раздражает; достаточно сообщать о смене статуса.' }
  ];
  const LEV = [
    {
      id: 'biz', t: 'Бизнес-требование', q: 'Зачем «Искре» это нужно — в цифрах?', ph: 'Сократить … с … до … к …',
      feats: [
        { id: 'metric', t: 'показатель: звонки клиентов «что с машиной?»', re: /звон|обращен/, crit: true },
        { id: 'num', t: 'число «было → станет»', re: /\d/, crit: true },
        { id: 'dir', t: 'направление: сократить, снизить', re: /сократ|сниж|сниз|уменьш|не более|не больше|до \d/ },
        { id: 'when', t: 'срок', re: /сезон|апрел|март|2027|месяц|квартал|запуск/ }
      ],
      ref: 'Сократить звонки клиентов на станцию с вопросом «что с машиной?» с 2–3 за визит до не более 1 к сезону 2027 года, чтобы мастера-приёмщики не отвлекались от приёмки.'
    },
    {
      id: 'user', t: 'Пользовательское требование', q: 'Кто и что хочет сделать?', ph: 'Клиент хочет …, чтобы …',
      feats: [
        { id: 'role', t: 'роль: клиент', re: /клиент|елена|владел/, crit: true },
        { id: 'status', t: 'что хочет знать: статус, этап ремонта', re: /статус|этап|что с машин|готов/, crit: true },
        { id: 'nocall', t: 'без звонка на станцию', re: /не звон|без звон|не дозвани|не надо звон|не нужно звон/ },
        { id: 'form', t: 'форма «хочет / может / видит»', re: /хочет|хочу|может|могу|видит|видеть|узнает|узнать/ }
      ],
      ref: 'Клиент хочет видеть в приложении, на каком этапе ремонт его машины и когда её можно забрать, чтобы не звонить на станцию.'
    },
    {
      id: 'func', t: 'Функциональное требование', q: 'Что именно должна делать система?', ph: 'Система должна при … показывать / отправлять …',
      feats: [
        { id: 'sys', t: 'кто действует: система или приложение', re: /систем|приложени|сервис/, crit: true },
        { id: 'event', t: 'событие: смена статуса заказ-наряда', re: /смен|измен|переход|переве|когда|при /, crit: true },
        { id: 'chan', t: 'где клиент это видит: push, SMS, экран', re: /push|пуш|sms|смс|уведомл|экран|карточк/ },
        { id: 'meas', t: 'проверяемая деталь: какие статусы или за сколько', re: /\d|в работе|готов|ждет согласован|открыт/ }
      ],
      ref: 'Система должна при каждой смене статуса заказ-наряда («В работе», «Ждёт согласования», «Готов») показывать новый статус в карточке ремонта в приложении и отправлять клиенту push не позже чем через 1 минуту.'
    }
  ];
  const levEval = txt => LEV.map(l => {
    const t = (txt || {})[l.id] || '';
    const got = l.feats.filter(f => has(t, f.re));
    const critMiss = l.feats.filter(f => f.crit && !got.includes(f));
    return { l, t, got, critMiss, ok: t.trim().length >= 25 && got.length >= 3 && !critMiss.length };
  });
  function solEval(v) {
    v = v || {};
    return SOLS.map(r => { const g = v[r.id]; if (g === r.ok) return { r, s: 'ok', pts: 1 }; if (r.alt && r.alt[g]) return { r, s: 'warn', pts: 0.5, got: g }; return { r, s: 'bad', pts: 0, got: g }; });
  }
  const LETTER = `<div class="m2t-letter"><div class="hd">От: Т. Р. Гарипов · Кому: «Орбита» · Тема: что я хочу от приложения</div>
    <div>Коллеги, по делу. <mark>Хочу как в такси: чтобы клиент видел машинку на карте, пока её чинят.</mark> Ещё <mark>чат с механиком, чтобы клиент сам спрашивал</mark>, а не дёргал Марину. На сайт — <mark>кнопку «Перезвоните мне»</mark>, а то в девять утра телефон не берут. <mark>Пусть клиенты платят всё заранее — тогда приедут</mark>, а не как сейчас. <mark>И SMS каждые полчаса, что с машиной.</mark></div>
    <div>Сроки знаете — 15 марта. Жду предложений, а не вопросов. Т. Р.</div></div>`;
  const taskTaxi = {
    id: 't-taxi', title: '«Хочу как в такси»: от решения к требованиям',
    simple: howTrace.simple,
    lead: ui.brief({
      situation: 'Письмо Тимура Рашидовича — пять «хочу», и все пять — готовые решения. Вера: «Отвечать „сделаем“ нельзя, „это неправильно“ — тем более. Сначала поймём, какую потребность закрывает каждое. А потом самое громкое, „как в такси“, перепишем по трём уровням — так, чтобы Тимур Рашидович узнал в нём своё, а Глеб и Лиза могли работать».',
      todo: [
        'Часть 1. Для каждого из пяти «хочу» выберите потребность, которая за ним стоит.',
        'Часть 2. Перепишите «как в такси» тремя требованиями: бизнес-требование (цель в цифрах), пользовательское (кто и что хочет), функциональное (что делает система). Под каждым полем вживую загораются признаки; ⚑ — обязательные.',
        'Нажмите «Проверить». Засчитывается, если верно сопоставлено не меньше 4 из 5 и в каждом из трёх требований есть все обязательные признаки и ещё хотя бы один.'
      ],
      look: 'Факты: клиент звонит 2–3 раза за визит; статусы заказ-наряда — «Открыт», «В работе», «Ждёт согласования», «Готов», «Выдан»; push о статусе — не позже 1 минуты. Цифру цели можно выбрать самим — главное, чтобы было «было → станет».'
    }),
    blank: () => ({ m: {}, t: { biz: '', user: '', func: '' } }),
    reference: () => ({ m: Object.fromEntries(SOLS.map(r => [r.id, r.ok])), t: Object.fromEntries(LEV.map(l => [l.id, l.ref])) }),
    render(el, ctx) {
      el.classList.add('m2t-root');
      const a = ctx.ans; a.m = a.m || {}; a.t = a.t || { biz: '', user: '', func: '' };
      el.innerHTML = `<div class="stack">${LETTER}
        <div class="stack tight"><span class="eyebrow">Часть 1 · Какая потребность за каждым «хочу»</span><div data-m></div></div>
        <div class="stack tight"><span class="eyebrow">Часть 2 · «Как в такси» по трём уровням</span><div class="stack" data-f></div></div></div>`;
      let reveal = null;
      if (ctx.result) { reveal = {}; solEval(a.m).forEach(x => { if (a.m[x.r.id]) reveal[x.r.id] = { s: x.s, why: x.s === 'ok' || ctx.readonly ? x.r.why : x.s === 'warn' ? x.r.alt[x.got] : 'Подумайте: о чём на самом деле беспокоится Тимур Рашидович, когда это просит? Какая боль из кик-оффа за этим стоит?' }; }); }
      if (ctx.readonly) { reveal = {}; SOLS.forEach(r => { reveal[r.id] = { s: 'ok', why: r.why }; }); }
      ui.match(TR.$('[data-m]', el), { rows: SOLS.map(r => ({ id: r.id, t: esc(r.t) })), choices: NEEDS, value: a.m, reveal, readonly: ctx.readonly, placeholder: 'Какая потребность…', onChange: v => { a.m = v; ctx.save(); } });
      const fbox = TR.$('[data-f]', el);
      const ev0 = levEval(a.t);
      fbox.innerHTML = LEV.map((l, i) => {
        const e = ev0[i], cls = ctx.result ? (e.ok ? 'ok' : 'bad') : '';
        return `<div class="m2t-field ${cls}" data-fl="${l.id}"><header><b>${esc(l.t)}</b><span class="small dim">${esc(l.q)}</span></header>
          <textarea rows="3" data-tx="${l.id}" aria-label="${esc(l.t)}" placeholder="${esc(l.ph)}" ${ctx.readonly ? 'readonly' : ''}>${esc(a.t[l.id] || '')}</textarea>
          <div class="m2t-feats" data-ft="${l.id}"></div></div>`;
      }).join('');
      function feats(id) {
        const l = LEV.find(x => x.id === id), t = a.t[id] || '';
        TR.$(`[data-ft="${id}"]`, el).innerHTML = l.feats.map(f => `<span class="m2t-feat ${has(t, f.re) ? 'on' : ''} ${f.crit ? 'crit' : ''}">${esc(f.t)}</span>`).join('');
      }
      LEV.forEach(l => feats(l.id));
      if (ctx.readonly) return;
      el.addEventListener('input', e => {
        const tx = e.target.closest('[data-tx]'); if (!tx) return;
        a.t[tx.dataset.tx] = tx.value; ctx.save(); feats(tx.dataset.tx);
      });
    },
    check(ans) {
      ans = ans || {};
      const se = solEval(ans.m), ms = se.reduce((s, x) => s + x.pts, 0) / SOLS.length;
      const le = levEval(ans.t), notes = [];
      se.forEach(x => {
        if (x.s === 'warn') notes.push({ ok: 'warn', html: `${esc(x.r.t)} — ${x.r.alt[x.got]}` });
        else if (x.s === 'bad') notes.push({ ok: false, html: `${esc(x.r.t)} — ${x.got ? 'потребность выбрана неточно. Какая цифра из кик-оффа станет лучше, если это сделать?' : 'не сопоставлено.'}` });
      });
      if (se.every(x => x.s === 'ok')) notes.push({ ok: true, html: 'Часть 1: за всеми пятью «хочу» найдены потребности. Заметьте: два из пяти — про одно и то же (статус без звонка).' });
      le.forEach(e => {
        if (e.ok) notes.push({ ok: true, html: `${e.l.t}: признаки на месте (${e.got.length} из ${e.l.feats.length}).` });
        else if (e.t.trim().length < 25) notes.push({ ok: false, html: `${e.l.t}: ${e.t.trim() ? 'слишком коротко — одной фразы-заголовка мало.' : 'не заполнено.'}` });
        else notes.push({ ok: false, html: `${e.l.t}: ${e.critMiss.length ? 'не хватает обязательного — ' + e.critMiss.map(f => f.t).join('; ') + '.' : 'нужен ещё хотя бы один признак: ' + e.l.feats.filter(f => !e.got.includes(f)).map(f => f.t).join('; ') + '.'}` });
      });
      const ls = le.reduce((s, e) => s + (e.ok ? 1 : Math.min(0.6, e.got.length * 0.2)), 0) / LEV.length;
      const score = ms * 0.4 + ls * 0.6;
      const solOk = se.filter(x => x.s === 'ok').length >= 4;
      const bizBad = !le[0].ok, funcBad = !le[2].ok;
      return {
        ok: solOk && le.every(e => e.ok) && score >= 0.8, score, notes,
        summary: `Потребности: ${se.filter(x => x.s === 'ok').length} из ${SOLS.length}; требования по уровням: ${le.filter(e => e.ok).length} из 3.`,
        mentor: bizBad ? 'Бизнес-требование «как в такси» — это не «клиент видит статус», а <b>что изменится для «Искры» в цифрах</b>: сколько раз клиент звонит на станцию сейчас и сколько должно стать.' : funcBad ? 'Функциональное требование начинается с «система должна…» и называет <b>событие</b>: когда именно система что-то показывает или отправляет.' : (!solOk ? 'Ищите за каждым «хочу» боль из кик-оффа: потерянные звонки, неявки, простой на согласовании, звонки «что с машиной?», очередь утром.' : null)
      };
    },
    explain: `<p>Пять «хочу» Тимура Рашидовича — пять решений, но потребностей за ними четыре: «машинка на карте» и «SMS каждые полчаса» закрывают одно — клиент хочет знать статус, не звоня. Это и есть главная находка: решения можно сравнивать, только когда видна общая потребность.</p>
      <ul class="checks">
        <li><b>Бизнес-требование</b> — про «Искру», а не про приложение: звонки «что с машиной?» с 2–3 за визит до одного, мастера не отвлекаются.</li>
        <li><b>Пользовательское</b> — про Елену: видеть, на каком этапе ремонт, и не звонить.</li>
        <li><b>Функциональное</b> — про систему: при смене статуса заказ-наряда показать его в карточке и отправить push за минуту. Это Глеб может оценить, а Лиза — проверить.</li>
        <li class="warn">«Платить всё заранее» спорит с BR-5 (цена «от»): итог известен только после диагностики. Такие конфликты решения с правилом аналитик выносит владельцу продукта с вариантами — у нас есть BR-4 с предоплатой 500 ₽.</li>
      </ul>
      <p>Ответ Тимуру Рашидовичу строится не «нет, такси не будет», а «вот что вы хотите получить, вот три способа, вот какой двигает цифру сильнее». Источник: BABOK v3, «Потребности и решения» (раздел 2.1, модель основных понятий); Вигерс и Битти, гл. 5 «Определение бизнес-требований».</p>`,
    refNote: 'Засчитываются любые формулировки с обязательными признаками: цифры цели можно выбрать свои, вместо push — SMS или экран, вместо «клиент» — «Елена». Для «чата с механиком» потребность «статус» засчитывается наполовину.',
    report: ans => {
      ans = ans || {};
      const se = solEval(ans.m), nt = v => (NEEDS.find(n => n.v === v) || { t: '—' }).t;
      return se.map(x => `- ${x.r.t} → ${nt(x.got || (ans.m || {})[x.r.id])} ${mark(x.s)}`).join('\n') + '\n' + levEval(ans.t).map(e => `- ${e.l.t}: ${e.t || '—'} ${e.ok ? '✓' : '✗'}`).join('\n');
    }
  };

  // =====================================================================
  // Практика 3. Дерево трассировки от цели «неявки 17 % → 8 %»
  // =====================================================================
  const TT = [
    { id: 'u1', t: 'Клиентка получает напоминание о визите и подтверждает, что приедет', ok: 'yes', why: 'Забыл — главная причина неявок; напоминание прямо двигает цифру.' },
    { id: 'u2', t: 'Клиент сам переносит или отменяет запись, не дозваниваясь до станции', ok: 'yes', why: 'Кто не может приехать, но не дозвонился, — становится неявкой. Перенос в один шаг превращает неявку в свободный слот.' },
    { id: 'u3', t: 'Мастер-приёмщик заранее видит, кто не подтвердил визит, и успевает позвонить или отдать слот', ok: 'yes', why: 'Страховка для тех, кто не ответил на напоминание.' },
    { id: 'u4', t: 'Клиент с двумя неявками подряд записывается онлайн с предоплатой 500 ₽', ok: 'yes', why: 'BR-4: предоплата отсекает «хронических» неприезжающих.' },
    { id: 'u5', t: 'Клиент согласует доп. работы в приложении по фото и цене', ok: 'no', why: 'Важная задача, но про другую цель — простой на согласовании.' },
    { id: 'u6', t: 'Клиент оплачивает ремонт онлайн картой или по СБП', ok: 'no', why: 'Оплата после «Готов» (BR-10) на неявки не влияет: клиент уже приехал.' }
  ];
  const TF = [
    { id: 'f1', t: 'Push за 24 часа до начала с кнопками «Приеду», «Перенести», «Отменить»', ok: 'u1' },
    { id: 'f2', t: 'SMS, если push выключен или не доставлен за 10 минут', ok: 'u1' },
    { id: 'f3', t: 'Перенос записи в приложении с выбором нового слота, бесплатно не позднее чем за 3 часа (BR-3)', ok: 'u2' },
    { id: 'f4', t: 'Отмена в один шаг: слот сразу свободен для онлайн-записи', ok: 'u2' },
    { id: 'f5', t: 'Список «не подтвердили визит» в АРМ мастера за 3 часа до начала', ok: 'u3' },
    { id: 'f6', t: 'Статус «Неявка» через 15 минут после начала и счётчик неявок подряд (BR-4)', ok: 'u4', alt: { u3: 'Статус «Неявка» мастер тоже видит, но главное назначение счётчика — основание для предоплаты по BR-4.' } },
    { id: 'f7', t: 'Онлайн-предоплата 500 ₽ через ЮKassa, засчитывается в оплату', ok: 'u4' },
    { id: 'f8', t: 'Фото находки в планшете механика', ok: 'u5' },
    { id: 'f9', t: 'Галерея работ станции «до и после» в приложении', ok: 'none' },
    { id: 'f10', t: 'Оплата картой и СБП после статуса «Готов»', ok: 'u6' }
  ];
  const TF_CH = TT.map(u => ({ v: u.id, t: u.t.length > 52 ? u.t.slice(0, 50) + '…' : u.t })).concat([{ v: 'none', t: 'Ни к одной задаче — сирота' }]);
  function trEval(a) {
    a = a || {}; const tk = a.tk || {}, fn = a.fn || {};
    const t = TT.map(r => ({ r, got: tk[r.id], s: tk[r.id] === r.ok ? 'ok' : 'bad' }));
    const f = TF.map(r => { const g = fn[r.id]; if (g === r.ok) return { r, got: g, s: 'ok', pts: 1 }; if (r.alt && r.alt[g]) return { r, got: g, s: 'warn', pts: 0.5 }; return { r, got: g, s: 'bad', pts: 0 }; });
    return { t, f, score: (t.filter(x => x.s === 'ok').length + f.reduce((s, x) => s + (x.pts || 0), 0)) / (TT.length + TF.length) };
  }
  const taskTrace = {
    id: 't-trace', title: 'Дерево трассировки: от цели до функций',
    simple: howTrace.simple,
    lead: ui.brief({
      situation: 'Артём: «Тимур Рашидович спросит на демо: что из сделанного снижает неявки? Покажите ниточки». Вера дала вам цель, шесть задач пользователей и десять функций из бэклога. Часть из них к неявкам отношения не имеет, а одна — вообще ни к чему.',
      todo: [
        'Шаг 1. Для каждой из шести задач пользователей решите: ведёт ли она к цели «неявки 17 % → 8 %» или к другой цели.',
        'Шаг 2. Для каждой функции выберите задачу, которую она реализует, — или отметьте её как сироту, если она не ведёт ни к одной задаче.',
        'Внизу дерево строится вживую. Нажмите «Проверить». Засчитывается от 80 %, и сирота должна быть найдена.'
      ],
      look: 'Функция может вести к задаче другой цели — это нормально, она просто не попадёт в дерево неявок. Сирота — функция, к которой не нашлось ни одной задачи из списка.'
    }),
    blank: () => ({ tk: {}, fn: {} }),
    reference: () => ({ tk: Object.fromEntries(TT.map(r => [r.id, r.ok])), fn: Object.fromEntries(TF.map(r => [r.id, r.ok])) }),
    render(el, ctx) {
      el.classList.add('m2t-root');
      const a = ctx.ans; a.tk = a.tk || {}; a.fn = a.fn || {};
      const ro = ctx.readonly, ev = ctx.result || ro ? trEval(a) : null;
      el.innerHTML = `<div class="stack">
        <div class="card flat"><div class="eyebrow">Цель бизнеса</div><div class="m2t-h3">🎯 Сократить неявки с 17 % до 8 % к сезону 2027</div></div>
        <div class="stack tight"><span class="eyebrow">Шаг 1 · Задачи пользователей</span><div class="stack tight" data-tk></div></div>
        <div class="stack tight"><span class="eyebrow">Шаг 2 · Функции из бэклога → к какой задаче</span><div class="stack tight" data-fn></div></div>
        <div class="stack tight"><span class="eyebrow">Дерево, которое получилось</span><div class="m2t-tree" data-tree></div></div></div>`;
      TR.$('[data-tk]', el).innerHTML = TT.map((r, i) => {
        const e = ev && ev.t[i], cls = e && (a.tk[r.id] || ro) ? e.s : '';
        return `<div class="m2t-line ${cls}"><div class="tx">${esc(r.t)}</div>${ui.seg('tk-' + r.id, [{ v: 'yes', t: 'ведёт к неявкам' }, { v: 'no', t: 'к другой цели' }], a.tk[r.id] || '')}${cls && (cls === 'ok' || ro) ? `<div class="why">${r.why}</div>` : cls === 'bad' ? '<div class="why">Спросите себя: если это сделать, станет ли меньше клиентов, которые записались и не приехали?</div>' : ''}</div>`;
      }).join('');
      TR.$('[data-fn]', el).innerHTML = TF.map((r, i) => {
        const e = ev && ev.f[i], cls = e && (a.fn[r.id] || ro) ? e.s : '';
        const why = !cls ? '' : cls === 'warn' ? r.alt[a.fn[r.id]] : cls === 'bad' ? 'Какую задачу человека делает возможной эта функция? Если ни одну из шести — это сирота.' : '';
        return `<div class="m2t-line ${cls}"><div class="tx">${esc(r.t)}</div><select data-fn="${r.id}" aria-label="Задача для функции: ${esc(r.t)}" ${ro ? 'disabled' : ''}><option value="">К какой задаче…</option>${TF_CH.map(c => `<option value="${c.v}" ${a.fn[r.id] === c.v ? 'selected' : ''}>${esc(c.t)}</option>`).join('')}</select>${why ? `<div class="why">${why}</div>` : ''}</div>`;
      }).join('');
      function drawTree() {
        const yes = TT.filter(u => a.tk[u.id] === 'yes'), other = TT.filter(u => a.tk[u.id] === 'no');
        const fs = u => TF.filter(f => a.fn[f.id] === u.id);
        const fnode = f => `<div class="m2t-node">${esc(f.t)}</div>`;
        const unode = (u, tag) => `<div><div class="m2t-node u ${fs(u).length ? '' : 'empty'}">${esc(u.t)}${fs(u).length ? '' : '<span class="tg warn">без функций</span>'}${tag || ''}</div>${fs(u).length ? `<div class="m2t-kids">${fs(u).map(fnode).join('')}</div>` : ''}</div>`;
        const orph = TF.filter(f => a.fn[f.id] === 'none'), unk = TF.filter(f => !a.fn[f.id]);
        TR.$('[data-tree]', el).innerHTML = `<div><div class="m2t-node g">Неявки 17 % → 8 %</div><div class="m2t-kids">${yes.length ? yes.map(u => unode(u)).join('') : '<div class="small dim">Пока ни одной задачи не привязано.</div>'}</div></div>
          ${other.length ? `<div><div class="eyebrow" style="margin:4px 0">Другие цели</div><div class="m2t-kids">${other.map(u => unode(u)).join('')}</div></div>` : ''}
          ${orph.length ? `<div><div class="eyebrow" style="margin:4px 0">Сироты</div>${orph.map(f => `<div class="m2t-node orph">${esc(f.t)}<span class="tg bad">сирота</span></div>`).join('')}</div>` : ''}
          ${unk.length ? `<div class="small dim">Не разложено функций: ${unk.length}.</div>` : ''}`;
      }
      drawTree();
      if (ro) return;
      ui.onSeg(el, (n, v) => { if (n.startsWith('tk-')) { a.tk[n.slice(3)] = v; ctx.save(); drawTree(); } });
      el.addEventListener('change', e => { const s = e.target.closest('select[data-fn]'); if (!s) return; if (s.value) a.fn[s.dataset.fn] = s.value; else delete a.fn[s.dataset.fn]; ctx.save(); drawTree(); });
    },
    check(ans) {
      const ev = trEval(ans), notes = [];
      const tBad = ev.t.filter(x => x.s !== 'ok'), fBad = ev.f.filter(x => x.s === 'bad'), fWarn = ev.f.filter(x => x.s === 'warn');
      tBad.forEach(x => notes.push({ ok: false, html: `Задача «${esc(x.r.t)}» — ${x.got ? (x.r.ok === 'yes' ? 'ведёт к неявкам. ' : 'не про неявки. ') + x.r.why : 'не решено.'}` }));
      fBad.forEach(x => notes.push({ ok: false, html: `Функция «${esc(x.r.t)}» — ${x.got ? (x.r.ok === 'none' ? 'на самом деле ни к одной задаче не ведёт: ни напоминания, ни перенос, ни оплата. Это сирота.' : x.got === 'none' ? 'не сирота: у неё есть задача-родитель. Какая задача без неё не решится?' : 'привязана не к той задаче.') : 'не привязана.'}` }));
      fWarn.forEach(x => notes.push({ ok: 'warn', html: `Функция «${esc(x.r.t)}» — ${x.r.alt[x.got]}` }));
      const orphOk = ev.f.find(x => x.r.id === 'f9').s === 'ok';
      if (!notes.length) notes.push({ ok: true, html: 'Дерево сходится: четыре задачи ведут к неявкам, у каждой есть функции, сирота найдена.' });
      return {
        ok: ev.score >= 0.8 && orphOk, score: ev.score, notes,
        summary: `Верно: ${Math.round(ev.score * 16)} из 16 связей${orphOk ? ', сирота найдена' : ', сирота не найдена'}.`,
        mentor: !orphOk ? 'Посмотрите на «Галерею работ „до и после“». Какую из шести задач она решает? Если ни одну — это и есть сирота: красивая функция без цели.' : (tBad.length ? 'Проверяйте каждую задачу одним вопросом: <b>станет ли меньше записавшихся, но не приехавших?</b> Оплата и доп. работы случаются, когда клиент уже на станции.' : null)
      };
    },
    explain: `<p>Четыре задачи пользователей ведут к неявкам: <b>напомнить и подтвердить</b>, <b>перенести или отменить без звонка</b>, <b>мастер видит неподтверждённых</b>, <b>предоплата после двух неявок</b> (BR-4). Под каждой — функции. Согласование доп. работ и оплата — важные задачи, но для других целей: клиент в этот момент уже приехал.</p>
      <ul class="checks">
        <li><b>Прямая трассировка</b> отвечает Тимуру Рашидовичу: «неявки снижают вот эти семь функций». Если цель поменяется — видно, что задевает.</li>
        <li><b>Обратная</b> отвечает Артёму: «зачем галерея?» — ни зачем, это сирота. Её либо привязывают к цели (Кирилл, маркетинг?), либо откладывают с согласия владельца продукта.</li>
        <li class="warn">Задача без функций — тревожный сигнал: обещали, но не сделали. Здесь таких нет — но в лаборатории дальше будет целая цель без единой функции.</li>
      </ul>
      <p>В жизни дерево ведут таблицей — матрицей трассировки требований: строки — функции, столбцы — цели, задачи, правила, тесты. Источник: Вигерс и Битти, гл. 29 «Связи в цепи требований»; BABOK v3, задача 5.1 «Трассировка требований».</p>`,
    refNote: 'Счётчик неявок (BR-4) засчитывается наполовину, если привязан к задаче мастера, а не к предоплате.',
    report: ans => {
      const ev = trEval(ans || {}), ut = id => (TT.find(u => u.id === id) || { t: id === 'none' ? 'сирота' : '—' }).t;
      return ev.t.map(x => `- Задача: ${x.r.t} → ${x.got === 'yes' ? 'к неявкам' : x.got === 'no' ? 'к другой цели' : '—'} ${mark(x.s)}`).join('\n') + '\n' + ev.f.map(x => `- Функция: ${x.r.t} → ${ut(x.got)} ${mark(x.s)}`).join('\n');
    }
  };

  // =====================================================================
  // Практика 4. Лаборатория: ревизия бэклога перед планированием MVP
  // =====================================================================
  const LAB = [
    {
      id: 'l1', t: 'Сирота: «Чат клиента с механиком»', ctx: 'Пришёл из письма Тимура Рашидовича. Связи с целью нет. Глеб оценил в 12 рабочих дней.',
      opts: [
        { id: 'take', t: 'Взять в MVP как есть — владелец продукта просил', k: 'bad', d: { trust: 1, days: 12, risk: 1 }, txt: 'Чат в плане, Тимур Рашидович доволен. Но 12 дней из запаса ушли на функцию без цели.', react: { who: 'petrovich', html: 'Чат? Механики в перчатках, руки в масле. Писать никто не будет — сфоткают и пойдут дальше.' }, late: { k: 'bad', t: 'Пилот: в чат за месяц написали 14 клиентов, механики ответили двоим. Тимур Рашидович: «Зачем мы это делали?» Доверие падает.' }, lateD: { trust: -2 } },
        { id: 'drop', t: 'Вычеркнуть молча: цели нет — значит, не нужно', k: 'bad', d: { trust: -2, days: 0, risk: 0 }, txt: 'В плане его нет. Тимур Рашидович узнаёт об этом на демо.', react: { who: 'timur', html: 'Я просил чат. Где он? Кто решил, что он не нужен, — вы?' } },
        { id: 'ask', t: 'Спросить у Тимура Рашидовича «зачем?», привязать к цели и сравнить с другими решениями', k: 'good', d: { trust: 1, days: 0, risk: 0 }, txt: 'Выясняется: ему важно, чтобы клиент быстро понимал, что нашли, и не звонил Марине. Это уже закрывают «предложение доп. работ с фото» и «статус ремонта». Чат — в бэклог после MVP, с пометкой, откуда он.', react: { who: 'timur', html: 'Так мне не чат нужен, а чтобы машина не стояла. Если ваше предложение с фото это делает — чат потом.' } }
      ]
    },
    {
      id: 'l2', t: 'Сирота: «Галерея работ станции „до и после“»', ctx: 'Попросил Кирилл, маркетолог. Связи с целью нет. Оценка — 5 дней.',
      opts: [
        { id: 'take', t: 'Взять: красиво, клиентам понравится', k: 'bad', d: { trust: 0, days: 5, risk: 0 }, txt: 'Пять дней ушли на функцию, которая не двигает ни одну из трёх целей.', react: { who: 'artem', html: 'Пять дней из запаса в десять. А что мы будем делать, если интеграция с 1С поедет?' } },
        { id: 'later', t: 'Спросить Кирилла, к какой цели она ведёт; цели в MVP нет — в бэклог после запуска, с пометкой источника', k: 'good', d: { trust: 0, days: 0, risk: 0 }, txt: 'Кирилл: «Это для рекламы весной, не горит». Галерея в бэклоге с пометкой «источник — маркетинг, цель — привлечение, после MVP».', react: { who: 'kirill', html: 'Честно — да, это для рекламы. Давайте после сезона, когда будет что показать.' } },
        { id: 'del', t: 'Удалить совсем — у нас не маркетинговый проект', k: 'mid', d: { trust: -1, days: 0, risk: 0 }, txt: 'Идея пропала из бэклога. Кирилл узнаёт об этом случайно.', react: { who: 'kirill', html: 'Мою задачу просто удалили? Даже не спросили?' } }
      ]
    },
    {
      id: 'l3', t: 'Похоже на сироту: «Выгрузка платежей ЮKassa для сверки»', ctx: 'Ни к одной из трёх целей не ведёт. Попросила Ольга Викторовна. Оценка — 2 дня.',
      opts: [
        { id: 'drop', t: 'Вычеркнуть: к целям не ведёт', k: 'bad', d: { trust: -2, days: 0, risk: 2 }, txt: 'Выгрузки нет. В конце первого же месяца Ольга Викторовна сверяет 4 500 платежей вручную.', react: { who: 'olga', html: 'Без сверки я не закрою месяц, а налоговая не спросит, есть ли у вас время. Это не «хотелка».' } },
        { id: 'link', t: 'Оставить: привязать не к цели, а к правилу BR-10 и ограничению 54-ФЗ — без сверки бухгалтерия не закроет месяц', k: 'good', d: { trust: 1, days: 2, risk: 0 }, txt: 'В матрице трассировки у выгрузки появляется источник: BR-10 и требование бухгалтерии. Это не сирота — её родитель не цель, а правило.', react: { who: 'olga', html: 'Вот, правильно. Мне нужна сверка с ЮKassa, по-другому месяц не закрыть.' } },
        { id: 'keep', t: 'Оставить без привязки — раз бухгалтерия просит', k: 'mid', d: { trust: 0, days: 2, risk: 0 }, txt: 'Выгрузку сделают. Но на следующей ревизии её снова примут за сироту — источник нигде не записан.', react: { who: 'vera', html: 'Решение верное, а след не оставили. Через месяц кто-нибудь снова её вычеркнет.' } }
      ]
    },
    {
      id: 'l4', t: 'Цель без функций: «Простой на согласовании 1 ч 40 мин → 20 мин»', ctx: 'Цель записана в концепции, но в бэклоге ни одной функции к ней не ведёт.',
      opts: [
        { id: 'add', t: 'Добавить функции: предложение с фото и ценой в приложении, звонок мастера через 20 минут (BR-8), автосогласование до лимита для корпоративных (BR-9)', k: 'good', d: { trust: 2, days: 5, risk: 0 }, txt: 'Пять дней в план — но это главная денежная боль. Артём перекраивает запас, освобождённый от сирот.', react: { who: 'timur', html: 'Вот это я и хотел. Пост с машиной на подъёмнике — это мои деньги.' }, late: { k: 'good', t: 'Пилот: простой на согласовании — 22 минуты вместо 1 ч 40 мин. Рустам из «Шашки»: «Мелочь до 3 000 согласуется сама, я даже не замечаю».' } },
        { id: 'later', t: 'Оставить цель, функции придумать потом', k: 'bad', d: { trust: 0, days: 0, risk: 1 }, txt: 'В плане пусто. Цель есть только на бумаге.', react: { who: 'artem', html: '«Потом» — это после 15 марта. А сезон с 1 апреля.' }, late: { k: 'bad', t: 'Пилот: простой — 1 ч 35 мин, механики по-прежнему ждут звонков. Тимур Рашидович: «Вы обещали двадцать минут».' }, lateD: { trust: -2 } },
        { id: 'del', t: 'Убрать цель из концепции — раз функций нет', k: 'bad', d: { trust: -3, days: 0, risk: 1 }, txt: 'Цели нет — и вопросов нет. До встречи с Тимуром Рашидовичем.', react: { who: 'timur', html: 'Это моя главная боль, а вы её вычеркнули? Без меня?' }, late: { k: 'bad', t: 'Пилот: простой — 1 ч 40 мин, ничего не изменилось.' } }
      ]
    },
    {
      id: 'l5', t: 'Цель «Неявки 17 % → 8 %» — покрыта одной функцией', ctx: 'К цели ведёт только «push за сутки». Ни переноса, ни предоплаты по BR-4.',
      opts: [
        { id: 'enough', t: 'Хватит одного напоминания — остальное после MVP', k: 'mid', d: { trust: 0, days: 0, risk: 0 }, txt: 'Напоминание будет. Но клиенту, которому оно пришло, некуда нажать «перенести» — только звонить.', late: { k: 'mid', t: 'Пилот: неявки — 13 %. Напомнили, но перенести в один шаг нельзя: половина «не могу» так и не дозвонилась.' } },
        { id: 'add', t: 'Добавить перенос и отмену в один шаг (BR-3), список «не подтвердили» мастеру и предоплату после 2 неявок (BR-4)', k: 'good', d: { trust: 2, days: 3, risk: 0 }, txt: 'Цель покрыта с трёх сторон: напомнить, дать перенести, отсечь хронических неприезжающих.', react: { who: 'marina', html: 'Вот если бы они сами переносили — я бы этот слот за час отдала другому.' }, late: { k: 'good', t: 'Пилот: неявки — 8 %. Освободившиеся слоты Марина Олеговна отдаёт листу ожидания.' } },
        { id: 'call', t: 'Добавить звонок оператора каждому клиенту накануне', k: 'bad', d: { trust: -1, days: 0, risk: 1 }, txt: 'В системе ничего не меняется — меняется работа трёх операторов: 600 звонков в день сверху.', react: { who: 'marina', html: 'Три оператора, шестьсот записей. Они и сейчас в пик пятую часть звонков теряют.' }, late: { k: 'bad', t: 'Пилот: неявки — 11 %, зато потерянные звонки выросли до 26 %: операторы обзванивают вместо того, чтобы отвечать.' } }
      ]
    }
  ];
  const LAB_BUF = 10;
  const LAB_Q = {
    q: 'Что верно про «сироту» в трассировке?',
    options: [
      { t: 'Сирота — повод спросить «зачем?»: найти цель, правило или ограничение, к которым она ведёт; не нашли — отложить или убрать с согласия владельца продукта', ok: true, why: 'Именно так: сначала поиск источника, потом решение — и не аналитиком в одиночку.' },
      { t: 'Сироту всегда удаляют: функций без цели не бывает', why: 'Выгрузка для Ольги Викторовны ведёт не к цели, а к правилу и закону. Удалив её, вы бы сорвали закрытие месяца.' },
      { t: 'Сироту оставляют: раз кто-то попросил, значит нужно', why: 'Так в MVP попадают чат и галерея — и съедают запас на то, что двигает цели.' },
      { t: 'Сироту отдают разработчикам: пусть решат, нужна ли она', why: 'Разработчики решают «как», а «нужно ли бизнесу» — владелец продукта.' }
    ]
  };
  function labSim(a) {
    a = a || {};
    const tot = { trust: 0, days: 0, risk: 0 }, late = [];
    LAB.forEach(s => {
      const o = s.opts.find(x => x.id === a[s.id]); if (!o) return;
      tot.trust += o.d.trust; tot.days += o.d.days; tot.risk += o.d.risk;
      if (o.lateD) tot.trust += o.lateD.trust;
      if (o.late) late.push(o.late);
    });
    const o4 = (LAB[3].opts.find(x => x.id === a.l4) || {}).id, o5 = (LAB[4].opts.find(x => x.id === a.l5) || {}).id;
    const pilot = {
      noshow: o5 === 'add' ? 8 : o5 === 'call' ? 11 : o5 === 'enough' ? 13 : 17,
      idle: o4 === 'add' ? '0:22' : o4 === 'later' ? '1:35' : '1:40',
      calls: o5 === 'call' ? 26 : 6
    };
    const done = LAB.every(s => a[s.id]);
    return { tot, late, pilot, done };
  }
  const riskT = r => r >= 3 ? ['bad', 'высокий'] : r >= 1 ? ['warn', 'средний'] : ['ok', 'низкий'];
  const taskLab = {
    id: 't-lab', title: 'Лаборатория: ревизия бэклога перед планированием MVP',
    simple: howTrace.simple,
    lead: ui.brief({
      situation: 'Пятница, планирование MVP к 15 марта. Артём: «Запаса — десять рабочих дней сверх обязательного. Вера построила матрицу трассировки, и в ней пять проблем: две сироты, одна „как будто сирота“, одна цель вообще без функций и одна — почти без. Решайте, что с каждой. На пилоте 1 марта увидим, что получилось».',
      todo: [
        'Для каждой из пяти проблем выберите действие. Читайте реакцию людей — выбор можно менять.',
        'Следите за показателями: доверие Тимура Рашидовича, израсходованный запас дней (из 10), риск.',
        'Когда решены все пять, откроется «Пилот на станции Победы» — цифры по трём целям. Ответьте на вопрос и нажмите «Проверить». Засчитывается, если по каждой проблеме выбрано лучшее действие (по галерее допустимо и второе) и ответ на вопрос верный.'
      ],
      look: 'Опора — теория про потребность и трассировку. У требования родителем может быть не только цель, но и бизнес-правило или ограничение. Показатели — учебная модель, а не замер.'
    }),
    blank: () => ({ q: [] }),
    reference: () => ({ l1: 'ask', l2: 'later', l3: 'link', l4: 'add', l5: 'add', q: quizRef(LAB_Q) }),
    render(el, ctx) {
      el.classList.add('m2t-root');
      const a = ctx.ans, ro = ctx.readonly; a.q = a.q || [];
      el.innerHTML = `<div class="stack"><div class="m2t-stats" data-st></div><div class="m2t-steps" data-steps></div><div data-pilot></div><div class="card flat" data-q></div></div>`;
      const cons = o => {
        if (!o) return '';
        return `<div class="m2t-cons ${o.k === 'good' ? 'good' : o.k === 'mid' ? 'mid' : 'bad'}"><div>${o.txt}</div>${o.react ? talk([o.react]) : ''}</div>`;
      };
      function draw() {
        const s = labSim(a), r = riskT(s.tot.risk), left = LAB_BUF - s.tot.days;
        TR.$('[data-st]', el).innerHTML = `
          <div class="stat"><span class="k">Доверие Тимура Р.</span><span class="v ${s.tot.trust > 0 ? 'ok' : s.tot.trust < 0 ? 'bad' : ''}">${signed(s.tot.trust)}</span><span class="s">видит ли он свои цели</span></div>
          <div class="stat"><span class="k">Запас дней</span><span class="v ${left < 0 ? 'bad' : left <= 2 ? 'warn' : 'ok'}">${left} из ${LAB_BUF}</span><span class="s">${left < 0 ? 'MVP к 15 марта не успеваем' : 'сверх обязательного'}</span></div>
          <div class="stat"><span class="k">Риск</span><span class="v ${r[0]}">${r[1]}</span><span class="s">закон, деньги, «на глаз»</span></div>
          <div class="stat"><span class="k">Решено</span><span class="v">${LAB.filter(x => a[x.id]).length} из ${LAB.length}</span><span class="s">проблем матрицы</span></div>`;
        TR.$('[data-steps]', el).innerHTML = LAB.map((st, i) => {
          const o = st.opts.find(x => x.id === a[st.id]);
          return `<div class="m2t-step"><header><span class="n">Проблема ${i + 1}</span><b>${esc(st.t)}</b></header><div class="ctx">${esc(st.ctx)}</div>
            <div class="m2t-opts">${st.opts.map(x => `<button type="button" class="m2t-opt" data-s="${st.id}" data-o="${x.id}" aria-pressed="${a[st.id] === x.id}" ${ro ? 'disabled' : ''}><span class="bx" aria-hidden="true"></span><span>${esc(x.t)}</span></button>`).join('')}</div>${cons(o)}</div>`;
        }).join('');
        const p = s.pilot;
        TR.$('[data-pilot]', el).innerHTML = s.done ? `<div class="card"><span class="eyebrow">Пилот на станции Победы · 1–14 марта</span>
          <div class="m2t-pilot">
            <div class="stat"><span class="k">Неявки · цель 8 %</span><span class="v ${p.noshow <= 8 ? 'ok' : p.noshow <= 11 ? 'warn' : 'bad'}">${p.noshow} %</span><span class="s">было 17 %</span></div>
            <div class="stat"><span class="k">Простой на согласовании · цель 0:20</span><span class="v ${p.idle === '0:22' ? 'ok' : 'bad'}">${p.idle}</span><span class="s">было 1:40</span></div>
            <div class="stat"><span class="k">Потерянные звонки · цель 5 %</span><span class="v ${p.calls <= 6 ? 'ok' : 'bad'}">${p.calls} %</span><span class="s">было 21 %</span></div>
          </div>
          ${s.late.map(x => `<div class="m2t-cons ${x.k}">${x.t}</div>`).join('')}
          ${LAB_BUF - s.tot.days < 0 ? '<div class="m2t-cons bad">Запас кончился раньше, чем работа: Артём сдвигает онлайн-оплату на апрель — уже в сезон.</div>' : ''}</div>` : '';
      }
      draw();
      ui.quiz(TR.$('[data-q]', el), Object.assign({}, LAB_Q, { value: a.q, readonly: ro, reveal: ctx.result, onChange: v => { a.q = v; ctx.save(); } }));
      if (ro) return;
      TR.on(el, 'click', '[data-s]', (e, b) => {
        const s = b.dataset.s, id = b.dataset.o; a[s] = id; ctx.save();
        const st = LAB.find(x => x.id === s);
        ctx.decide('Ревизия: ' + st.t, st.opts.find(x => x.id === id).t);
        draw();
      });
    },
    check(ans) {
      ans = ans || {};
      const s = labSim(ans), q = ui.quizScore(LAB_Q, ans.q || []), notes = [];
      let pts = 0;
      LAB.forEach((st, i) => {
        const o = st.opts.find(x => x.id === ans[st.id]);
        if (!o) { notes.push({ ok: false, html: `Проблема ${i + 1} («${esc(st.t)}») — не решена.` }); return; }
        pts += o.k === 'good' ? 1 : o.k === 'mid' ? 0.4 : 0;
        notes.push(o.k === 'good' ? { ok: true, html: `Проблема ${i + 1}: ${esc(o.t)}.` } : { ok: o.k === 'mid' ? 'warn' : false, html: `Проблема ${i + 1}: ${o.txt}` });
      });
      notes.push(q.ok ? { ok: true, html: 'Вопрос про сироту: верно.' } : { ok: false, html: 'Вопрос про сироту: вспомните выгрузку для Ольги Викторовны — у требования бывает родитель-правило.' });
      const score = (pts / LAB.length) * 0.8 + q.score * 0.2;
      const crit = ['l1', 'l3', 'l4', 'l5'].every(id => { const o = LAB.find(x => x.id === id).opts.find(x => x.id === ans[id]); return o && o.k === 'good'; });
      const l2 = LAB[1].opts.find(x => x.id === ans.l2);
      const ok = crit && !!l2 && l2.k !== 'bad' && q.ok && LAB_BUF - s.tot.days >= 0;
      return {
        ok, score: Math.min(1, score), notes,
        summary: s.done ? `Пилот: неявки ${s.pilot.noshow} %, простой ${s.pilot.idle}, потерянные звонки ${s.pilot.calls} %; запас ${LAB_BUF - s.tot.days} из ${LAB_BUF} дней; доверие ${signed(s.tot.trust)}.` : 'Решите все пять проблем — откроется пилот.',
        mentor: (() => { const o3 = LAB[2].opts.find(x => x.id === ans.l3); if (o3 && o3.id === 'drop') return 'Не каждое требование без цели — сирота. Родителем может быть <b>бизнес-правило или закон</b>: без сверки с ЮKassa бухгалтерия не закроет месяц (BR-10, 54-ФЗ).'; const o4 = LAB[3].opts.find(x => x.id === ans.l4); if (o4 && o4.id !== 'add') return 'Цель без функций — обещание, которое не выполнится. Вопрос не «оставить или убрать цель», а «какие функции её реализуют».'; return null; })()
      };
    },
    explain: `<p>Ревизия по матрице трассировки — это не чистка ради чистоты. Каждая проблема — вопрос к конкретному человеку:</p>
      <ul class="checks">
        <li><b>Сирота от владельца продукта</b> (чат) — спросить «зачем?» и показать, что потребность уже закрыта другим решением. Не вычёркивать молча: решение за Тимуром Рашидовичем.</li>
        <li><b>Сирота от эксперта</b> (галерея) — найти источник и цель; в MVP нет цели — в бэклог с пометкой, откуда пришла.</li>
        <li><b>«Как будто сирота»</b> (выгрузка) — родитель не цель, а правило BR-10 и закон. Трассировка ведётся не только к целям, но и к правилам и ограничениям.</li>
        <li><b>Цель без функций</b> — главная опасность: обещание, которое никто не выполнит. Освободившийся от сирот запас — сюда.</li>
        <li><b>Цель с одной функцией</b> — проверьте, достаточно ли её. «Напомнить» без «дать перенести» оставляет клиента с телефоном.</li>
      </ul>
      <p>Заметьте арифметику: отказ от чата и галереи освободил 17 дней — ровно столько, чтобы закрыть простой и неявки. Это и есть ценность трассировки для руководителя проекта. Источник: Вигерс и Битти, гл. 29 «Связи в цепи требований»; BABOK v3, 5.1 «Трассировка требований», 5.3 «Приоритизация».</p>`,
    refNote: 'По галерее засчитывается и «удалить совсем» (с потерей доверия Кирилла). По остальным четырём — только лучшее действие.',
    report: ans => {
      const s = labSim(ans || {});
      return LAB.map(st => `- ${st.t}: ${(st.opts.find(x => x.id === (ans || {})[st.id]) || { t: '—' }).t}`).join('\n') + `\n- Пилот: неявки ${s.pilot.noshow} %, простой ${s.pilot.idle}, звонки ${s.pilot.calls} %; запас ${LAB_BUF - s.tot.days} дн.; доверие ${signed(s.tot.trust)}\n- Вопрос: ${ui.quizScore(LAB_Q, (ans || {}).q || []).ok ? 'верно' : 'неверно'}`;
    }
  };

  // =====================================================================
  // Практика 5. Своими словами Тимуру Рашидовичу
  // =====================================================================
  const EX_RUBRIC = [
    '«Как в такси» — это решение; за ним потребность: клиент хочет знать, что с машиной, не звоня, а «Искра» теряет время мастеров на 2–3 звонка за визит',
    'Требование раскладывается на уровни: цель в цифрах для «Искры» → что хочет сделать клиент → что делает система (статус в приложении, push при смене статуса)',
    'Каждая функция привязана к цели: так видно, что «машинка на карте» или чат не двигают цифры, и деньги и время до 15 марта идут на то, что двигает',
    'Правила и рамки — тоже часть требований: без согласия клиента доп. работы нельзя (BR-6), персональные данные — в России, срок — 15 марта',
    'Коротко, на языке денег и сроков, без жаргона, с предложением следующего шага: согласовать цели и список функций'
  ];
  const EX_REF = 'Тимур Рашидович, «как в такси» мы услышали — и не теряем. Но машина на подъёмнике по карте не едет: вам ведь важно другое — чтобы клиент знал, что с машиной, и не звонил Марине по три раза за визит. Поэтому предлагаем так: цель — звонков «что с машиной?» не больше одного за визит к сезону. Клиент видит в приложении, на каком этапе ремонт и когда забирать. Система при каждой смене статуса за минуту присылает push. Это дешевле карты и сильнее двигает цифру. Так же мы прошли по всем вашим «хочу»: каждую функцию привязали к одной из трёх целей — неявки, потерянные звонки, простой на согласовании. Чат с механиком оказался не нужен в первой версии: его задачу закрывает предложение доп. работ с фото и ценой. Плюс есть рамки, которые не обсуждаются: без согласия клиента доп. работы делать нельзя по закону, данные клиентов храним в России, запуск — 15 марта. Предлагаю в среду за 30 минут согласовать цели и список функций — дальше команда работает без догадок.';
  const taskExplain = {
    id: 't-explain', title: 'Своими словами: почему «как в такси» — ещё не требование',
    simple: {
      icon: '🗣️',
      plain: 'Тимуру Рашидовичу не нужны слова «уровни по Вигерсу» и «трассировка». Ему нужно услышать, что его поняли, что он получит и почему это лучше того, что он предложил.',
      analogy: 'Клиент на приёмке: «Поменяйте мне свечи». Хороший мастер-приёмщик спрашивает: «А что беспокоит?» — «Троит на холодную». — «Тогда сначала диагностика: может быть катушка». Клиент не обижается: он хотел, чтобы машина не троила, а не свечи.',
      tech: 'Опора: потребность и решение (BABOK), три уровня требований (Вигерс), трассировка к целям. Говорите на языке слушателя: владельцу продукта — цели, деньги и сроки; детали — команде.'
    },
    lead: ui.brief({
      situation: 'Тимур Рашидович ответил на ваш черновик: «Я просил как в такси, а вы мне „цели“, „уровни“. Я заказчик, я сказал, что хочу. Почему нельзя просто сделать?» Вера: «Ответьте сами. Коротко и по-человечески».',
      todo: [
        'Напишите ответ в 6–10 предложений без жаргона (от 300 символов).',
        'Покажите, что вы поняли настоящую потребность, как она превратилась в требования, почему функции привязаны к целям и какие рамки не обсуждаются. Предложите следующий шаг.',
        'Нажмите «Проверить с Верой (Claude)» или «Сверить с эталоном самому» и честно отметьте раскрытые пункты. Засчитывается от 60 %.'
      ],
      lookTitle: 'На что опереться',
      look: 'Задание с письмом (решение → потребность → три уровня) и лаборатория (сироты, цели без функций). Тимур Рашидович нетерпелив и думает деньгами: начните с того, что он получит.'
    }),
    blank: () => ({ j: {} }),
    reference: () => ({ j: { text: EX_REF, self: EX_RUBRIC.map(() => true) } }),
    render(el, ctx) {
      el.classList.add('m2t-root');
      el.insertAdjacentHTML('beforeend', ui.say('timur', 'Я просил как в такси, а вы мне «цели», «уровни». Я заказчик, я сказал, что хочу. Почему нельзя просто сделать?'));
      const j = document.createElement('div'); j.style.marginTop = '12px'; el.appendChild(j);
      ui.justify(j, {
        id: 'm2t-explain', q: 'Почему «как в такси» — ещё не требование и что мы с ним сделаем?',
        qPlain: 'Объясните владельцу сети автосервисов без жаргона, почему его пожелание «как в такси» — это решение, а не требование, какую потребность вы за ним нашли, как она стала требованиями разных уровней, зачем функции привязывают к целям и какие ограничения не обсуждаются.',
        rubric: EX_RUBRIC, reference: EX_REF, value: ctx.ans.j, readonly: ctx.readonly, minLen: 300,
        placeholder: 'Тимур Рашидович, «как в такси» мы услышали…',
        onChange: v => { ctx.ans.j = v; ctx.save(); ctx.decide('Ответ Тимуру про «как в такси»', v.text || ''); }
      });
    },
    check(ans) {
      const s = ui.justifyScore(ans && ans.j);
      return {
        ok: s >= 0.6, score: s,
        summary: s ? `Оценка ответа: ${Math.round(s * 100)} %.` : 'Напишите ответ (от 300 символов) и проверьте его с Верой или сверьте с эталоном сами.',
        notes: s && s < 0.6 ? [{ ok: false, html: 'Тимуру Рашидовичу важно услышать три вещи: его поняли (потребность), он получит больше (решение сильнее двигает цифру) и что дальше (следующий шаг).' }] : []
      };
    },
    explain: `<p>Сильный ответ начинается не с отказа, а с потребности: «вам важно, чтобы клиент не звонил по три раза». Дальше — что получит заказчик (цель в цифрах, что видит клиент, что делает система) и почему это лучше «машинки на карте». Трассировка звучит не словом, а фразой «каждую функцию привязали к вашим трём целям». Рамки — коротко: закон и срок.</p>
      <p>Частые ошибки: спорить («такси — это неправильно»), прятаться за терминами («по Вигерсу это пользовательское требование»), соглашаться на всё («сделаем и такси, и чат») — и не предложить следующего шага. Хороший тест: поймёт ли ответ Марина Олеговна, если Тимур Рашидович его перешлёт.</p>`,
    report: ans => (ans.j && ans.j.text) ? ans.j.text : '—'
  };

  // =====================================================================
  TR.stage({
    id: ID,
    when: 'понедельник, 23 ноября, 10:00 · разбор письма Тимура Рашидовича',
    intro: [
      { who: 'timur', html: 'Коллеги, написал вам всё, что хочу. Как в такси, чат с механиком, кнопку «перезвоните», SMS. Сроки знаете. Жду предложений, а не вопросов.' },
      { who: 'gleb', html: 'Прочитал. Там цели, законы, 1С и «машинка на карте» — в одном абзаце. Что из этого мне делать, а что — просто знать?' },
      { who: 'artem', html: 'И главное — что из этого влезет в MVP к 15 марта. Мне нужно понимать, за что мы платим днями.' },
      { who: 'vera', html: 'Сегодня разложим письмо по полочкам. Требования бывают разного уровня и вида: цель бизнеса, задача пользователя, функция системы, правила, рамки, обмен с другими системами, переход. А потом свяжем их ниточками — от цели до функции, — чтобы на любое «зачем?» был ответ.' }
    ],
    facts: ['F-goal', 'F-deadline', 'F-noshow', 'F-calls', 'F-idle', 'F-pd'],
    glossary: [
      { term: 'Бизнес-требование', simple: 'Зачем бизнесу система — в цифрах: «неявки 17 % → 8 %».', tech: 'Высокоуровневая цель организации, ради которой создаётся система (Вигерс). Фиксируется в документе концепции и границ.' },
      { term: 'Пользовательское требование', simple: 'Что конкретный человек хочет сделать с помощью системы.', tech: 'Задача, которую пользователь должен выполнить с помощью системы; записывается историями или вариантами использования.' },
      { term: 'Функциональное требование', simple: 'Что именно делает система: «система должна…».', tech: 'Описание поведения системы при определённых условиях (Вигерс); основа спецификации требований (SRS) и критериев приёмки.' },
      { term: 'Нефункциональное требование', simple: 'Насколько хорошо система работает: скорость, надёжность, безопасность.', tech: 'Атрибуты качества (ISO/IEC 25010), а также ограничения и внешние интерфейсы в классификации Вигерса.' },
      { term: 'Бизнес-правило', simple: 'Правило бизнеса, которое верно и без программы: «отмена бесплатно за 3 часа».', tech: 'Политика, закон, стандарт или вычисление, определяющие работу бизнеса. Типы: факт, ограничение, активатор действия, вывод, вычисление. Ведётся в каталоге с идентификаторами (BR-*).' },
      { term: 'Ограничение', simple: 'Рамка, в которой выбирают решение: закон, срок, обязательная система.', tech: 'Constraint — условие, сужающее выбор проектных решений: законодательство (54-ФЗ, 152-ФЗ), обязательные интеграции, сроки, бюджет, технологии.' },
      { term: 'Внешний интерфейс', simple: 'Как система обменивается с другими системами: 1С, ЮKassa, SMS.', tech: 'Требования к взаимодействию с пользователями, ПО, оборудованием и каналами связи: данные, направление, частота, обработка сбоев.' },
      { term: 'Переходное требование', simple: 'Что нужно один раз, чтобы перейти со старого на новое: перенос данных, обучение.', tech: 'Transition requirement (BABOK v3): временные возможности для перехода — миграция данных, параллельная работа, обучение.' },
      { term: 'Потребность и решение', simple: 'Потребность — что человеку нужно; решение — один из способов это дать.', tech: 'Need — проблема или возможность; Solution — конкретный способ удовлетворить потребность (BABOK v3, модель основных понятий).' },
      { term: 'Трассировка', simple: 'Ниточки от цели к задачам и функциям — чтобы на любое «зачем?» был ответ.', tech: 'Traceability: связи требований между уровнями и с источниками; прямая и обратная. Ведётся в матрице трассировки требований (RTM).' },
      { term: 'Сирота (orphan)', simple: 'Функция, которая не ведёт ни к одной цели, правилу или ограничению.', tech: 'Требование без обратной трассировки к источнику. Его привязывают или исключают с согласия владельца продукта.' },
      { term: 'Документ концепции и границ', simple: 'Короткий документ: зачем делаем, для кого, что входит и что нет.', tech: 'Vision and scope document (Вигерс): бизнес-цели, критерии успеха, границы и ограничения проекта.' }
    ],
    outro: 'Письмо Тимура Рашидовича разложено: цели в цифрах, задачи людей, функции системы, правила BR-*, рамки закона и срока, обмен с 1С и ЮKassa, перенос 31 000 клиентов. Главное — «как в такси» перестало быть приказом и стало потребностью: клиент хочет знать статус, не звоня. А трассировка показала, что чат и галерея не двигают цели, зато согласованию доп. работ функций не хватало. В среду — у стены со стикерами: как записывать задачи пользователей историями и сценариями.',
    tasks: [howLevels, howRules, howTrace, taskSort, taskTaxi, taskTrace, taskLab, taskExplain]
  });
})();
