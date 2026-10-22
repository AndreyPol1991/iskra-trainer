/* Модуль 2, занятие 4: работа с требованиями.
   Теория: how-process — шесть шагов (выявление → анализ → документирование → проверка → согласование → управление
   изменениями) на «Искре» и на семейном отпуске, верификация и валидация, базовая версия; how-quality — критерии
   качества требования «было / стало» (полнота, однозначность, непротиворечивость, проверяемость, атомарность,
   трассируемость) и виды ревью; how-change — карточка требования с атрибутами, статусы как живой автомат с версиями,
   матрица трассировки и анализ влияния на примере «бесплатная отмена за 6 часов».
   Практика: охота на дефекты в черновике «Отмена и перенос» (разметка + вид дефекта); пары противоречий между
   требованиями и BR-*; жизненный цикл требования (порядок статусов + 8 ситуаций); лаборатория «анализ влияния CR-04
   шиномонтаж с хранением шин» по матрице трассировки (затронутое → новое → решение → последствия); письмо Тимуру со
   сроками и ценой своими словами. */
'use strict';
(function () {
  const TR = window.TR, ui = TR.ui, esc = TR.esc;
  const ID = 'm2-reqwork';

  if (!document.getElementById('mrw-css')) document.head.insertAdjacentHTML('beforeend', `<style id="mrw-css">
    .mrw-root, .mrw-root .stack > * { min-width: 0; }
    .mrw-root .seg button { white-space: normal; text-align: left; }
    .mrw-steps { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 6px; }
    .mrw-step { text-align: left; border: 1px solid var(--border-strong); border-radius: 10px; padding: 8px 8px 9px; background: var(--surface-2); color: var(--text); display: grid; gap: 2px; align-content: start; min-width: 0; }
    .mrw-step .n { font: 600 10.5px/1 var(--f-mono); color: var(--text-muted); }
    .mrw-step b { font: 600 12.5px/1.25 var(--f-brand); hyphens: auto; -webkit-hyphens: auto; overflow-wrap: anywhere; }
    .mrw-step[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); box-shadow: 0 0 0 1px var(--accent) inset; }
    .mrw-def { display: grid; grid-template-columns: 160px minmax(0, 1fr); gap: 6px 14px; font-size: 14px; }
    .mrw-def > .k { font: 600 11px/1.5 var(--f-mono); letter-spacing: .06em; text-transform: uppercase; color: var(--text-muted); padding-top: 2px; }
    .mrw-def > .v { min-width: 0; }
    .mrw-ba { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
    .mrw-ba .card { align-content: start; }
    .mrw-ba .bad-t { border-left: 3px solid var(--bad); padding-left: 10px; }
    .mrw-ba .ok-t { border-left: 3px solid var(--ok); padding-left: 10px; }
    .mrw-chips { display: flex; flex-wrap: wrap; gap: 6px; }
    .mrw-chip { border: 1px solid var(--border-strong); border-radius: 999px; padding: 5px 11px; background: var(--surface-2); color: var(--text); font-size: 13px; line-height: 1.25; text-align: left; }
    .mrw-chip[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); box-shadow: 0 0 0 1px var(--accent) inset; }
    .mrw-chip:disabled { opacity: .45; cursor: default; }
    .mrw-chip.cur { border-color: var(--accent); background: var(--accent); color: var(--accent-text); font-weight: 600; }
    .mrw-attr { display: grid; grid-template-columns: 150px minmax(0, 1fr); border: 1px solid var(--border-strong); border-radius: 12px; overflow: hidden; background: var(--surface); }
    .mrw-attr button { display: contents; }
    .mrw-attr .k, .mrw-attr .v { padding: 7px 12px; border-bottom: 1px solid var(--border); font-size: 13.5px; text-align: left; }
    .mrw-attr .k { font: 600 11px/1.6 var(--f-mono); letter-spacing: .05em; text-transform: uppercase; color: var(--text-muted); background: var(--surface-2); }
    .mrw-attr .on .k, .mrw-attr .on .v { background: var(--accent-soft); }
    .mrw-log { display: grid; gap: 4px; font-size: 13px; max-height: 220px; overflow-y: auto; }
    .mrw-log div { padding: 5px 9px; border-radius: 8px; background: var(--surface-2); }
    .mrw-log .t { font: 600 11.5px/1.3 var(--f-mono); color: var(--text-muted); margin-right: 6px; }
    .mrw-mx { overflow-x: auto; border: 1px solid var(--border); border-radius: 12px; background: var(--code-bg); }
    .mrw-mx table { border-collapse: collapse; width: 100%; min-width: 620px; font-size: 12.5px; }
    .mrw-mx th, .mrw-mx td { border-bottom: 1px solid var(--border); padding: 6px 8px; text-align: center; vertical-align: middle; }
    .mrw-mx th { font: 600 10.5px/1.25 var(--f-mono); color: var(--text-muted); text-transform: uppercase; letter-spacing: .02em; }
    .mrw-mx td.rq { text-align: left; }
    .mrw-mx td.rq button { border: 0; background: none; color: var(--text); text-align: left; padding: 0; font-size: 12.5px; line-height: 1.3; }
    .mrw-mx td.rq b { font-family: var(--f-mono); font-size: 11.5px; color: var(--text-2); display: block; }
    .mrw-mx tr.on td { background: var(--accent-soft); }
    .mrw-mx td.hit { color: var(--accent); font-weight: 700; }
    .mrw-mx td.yes { background: color-mix(in srgb, var(--warn) 22%, transparent); }
    .mrw-spec { border: 1px solid var(--border-strong); border-radius: 12px; background: var(--surface); overflow: hidden; }
    .mrw-spec .hd { padding: 9px 14px; border-bottom: 1px solid var(--border); background: var(--surface-2); font-size: 13px; color: var(--text-2); }
    .mrw-spec .bd { padding: 10px 14px 14px; display: grid; gap: 6px; }
    .mrw-sn { display: grid; grid-template-columns: 34px minmax(0, 1fr); gap: 8px; align-items: start; text-align: left; border: 1px solid transparent; border-radius: 8px; padding: 6px 8px; background: none; color: var(--text); font-size: 14px; line-height: 1.45; width: 100%; }
    .mrw-sn .i { font: 600 11px/1.6 var(--f-mono); color: var(--text-muted); }
    .mrw-sn:hover:not(:disabled) { background: var(--surface-2); }
    .mrw-sn[aria-pressed="true"] { background: color-mix(in srgb, var(--warn) 22%, transparent); border-color: var(--warn); }
    .mrw-sn.ok { background: var(--ok-soft); border-color: var(--ok); }
    .mrw-sn.bad { background: var(--bad-soft); border-color: var(--bad); }
    .mrw-sn.warn { background: var(--warn-soft); border-color: var(--warn); }
    .mrw-sn.miss { border: 1px dashed var(--info); }
    .mrw-sn:disabled { cursor: default; }
    .mrw-found { display: grid; gap: 6px; }
    .mrw-found .it { display: grid; grid-template-columns: minmax(0, 1fr) 210px; gap: 8px; align-items: center; padding: 7px 10px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface); font-size: 13.5px; }
    .mrw-found .it.ok { border-color: var(--ok); } .mrw-found .it.bad { border-color: var(--bad); } .mrw-found .it.warn { border-color: var(--warn); }
    .mrw-found .it .why { grid-column: 1 / -1; font-size: 12.5px; color: var(--text-2); }
    .mrw-found select { width: 100%; min-width: 0; }
    .mrw-cards { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
    .mrw-card { position: relative; text-align: left; display: grid; gap: 3px; padding: 9px 12px; border: 1px solid var(--border); border-radius: 12px; background: var(--surface); color: var(--text); min-width: 0; font-size: 13.5px; line-height: 1.4; }
    .mrw-card .id { font: 600 11px/1.3 var(--f-mono); color: var(--text-muted); }
    .mrw-card.br .id { color: var(--violet); }
    .mrw-card[aria-pressed="true"] { border-color: var(--accent); box-shadow: 0 0 0 1px var(--accent) inset; background: var(--accent-soft); }
    .mrw-card .pn { position: absolute; top: 6px; right: 8px; font: 600 11px/1 var(--f-mono); color: var(--accent); }
    .mrw-card:disabled { cursor: default; }
    .mrw-pairs { display: grid; gap: 6px; }
    .mrw-pair { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 8px; align-items: center; padding: 7px 10px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface); font-size: 13.5px; }
    .mrw-pair.ok { border-color: var(--ok); } .mrw-pair.bad { border-color: var(--bad); } .mrw-pair.warn { border-color: var(--warn); }
    .mrw-pair .why { grid-column: 1 / -1; font-size: 12.5px; color: var(--text-2); }
    .mrw-imp { display: grid; gap: 6px; }
    .mrw-ir { display: grid; grid-template-columns: auto minmax(0, 1.1fr) minmax(0, 2fr) 54px; gap: 10px; align-items: center; text-align: left; border: 1px solid var(--border); border-radius: 10px; padding: 8px 12px; background: var(--surface); color: var(--text); width: 100%; font-size: 13.5px; line-height: 1.35; }
    .mrw-ir .box { width: 18px; height: 18px; border-radius: 5px; border: 1.5px solid var(--border-strong); }
    .mrw-ir[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); }
    .mrw-ir[aria-pressed="true"] .box { background: var(--accent); border-color: var(--accent); box-shadow: inset 0 0 0 3px var(--surface); }
    .mrw-ir .id { display: block; font: 600 11px/1.3 var(--f-mono); color: var(--text-muted); }
    .mrw-ir .ln { font-size: 12px; color: var(--text-2); }
    .mrw-ir .d { font: 600 12px/1 var(--f-mono); color: var(--text-2); text-align: right; white-space: nowrap; }
    .mrw-ir.ok { border-color: var(--ok); } .mrw-ir.bad { border-color: var(--bad); } .mrw-ir.warn { border-color: var(--warn); }
    .mrw-ir .why { grid-column: 2 / -1; font-size: 12.5px; color: var(--text-2); }
    .mrw-ir:disabled { cursor: default; }
    .mrw-ir.hdr { background: none; border: 0; padding: 0 12px; font: 600 10.5px/1.2 var(--f-mono); color: var(--text-muted); text-transform: uppercase; }
    .mrw-stats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
    .mrw-stats .stat .v { font-size: 17px; }
    .mrw-tl { display: grid; gap: 8px; }
    .mrw-ev { display: grid; grid-template-columns: 120px minmax(0, 1fr); gap: 10px; padding: 10px 12px; border-radius: 10px; border: 1px solid var(--border); background: var(--surface); }
    .mrw-ev .d { font: 600 12px/1.35 var(--f-mono); color: var(--text-muted); }
    .mrw-ev.ok { border-color: color-mix(in srgb, var(--ok) 55%, var(--border)); }
    .mrw-ev.bad { border-color: color-mix(in srgb, var(--bad) 55%, var(--border)); background: color-mix(in srgb, var(--bad-soft) 60%, var(--surface)); }
    .mrw-ev.warn { border-color: color-mix(in srgb, var(--warn) 55%, var(--border)); }
    .mrw-opt { text-align: left; white-space: normal; justify-content: flex-start; font-weight: 500; line-height: 1.4; width: 100%; }
    .mrw-opt[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); box-shadow: 0 0 0 1px var(--accent) inset; }
    @media (max-width: 860px) { .mrw-steps { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
    @media (max-width: 760px) {
      .mrw-def { grid-template-columns: minmax(0, 1fr); gap: 2px; }
      .mrw-def > .v { margin-bottom: 8px; }
      .mrw-ba, .mrw-cards { grid-template-columns: minmax(0, 1fr); }
      .mrw-attr { grid-template-columns: 110px minmax(0, 1fr); }
      .mrw-found .it { grid-template-columns: minmax(0, 1fr); }
      .mrw-ir { grid-template-columns: auto minmax(0, 1fr) 48px; }
      .mrw-ir .ln { grid-column: 2 / -1; grid-row: 2; }
      .mrw-ir.hdr { display: none; }
    }
    @media (max-width: 460px) {
      .mrw-steps { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .mrw-ev { grid-template-columns: minmax(0, 1fr); gap: 2px; }
      .mrw-stats { grid-template-columns: minmax(0, 1fr); }
    }
  </style>`);

  const quizRef = cfg => cfg.options.map((o, i) => o.ok ? i : -1).filter(i => i >= 0);
  const rub = n => Math.round(n).toLocaleString('ru-RU').replace(/\s/g, ' ') + ' ₽';
  const DAY_RATE = 45000;   // день работы команды по договору
  const MVP_SLACK = 8;      // резерв MVP на изменения, дней

  // =====================================================================
  // Теория 1. Процесс работы с требованиями
  // =====================================================================
  const PROC = [
    { id: 'elic', t: 'Выявление', q: 'Что нужно и кому?',
      iskra: { do: 'Интервью с Мариной Олеговной и Тимуром Рашидовичем, наблюдение за стойкой приёмки в 08:00, письма, статистика колл-центра (21 % потерянных звонков).', out: 'Протоколы, сырые требования, факты блокнота.', err: 'Слушать только самого громкого — Тимура — и не спросить Ольгу Викторовну про 54-ФЗ и сроки хранения.' },
      trip: { do: 'Спросить всех: кто куда хочет, у кого когда отпуск, сколько готовы потратить.', out: 'Список пожеланий всей семьи.', err: 'Решить за всех и узнать про бабушкин юбилей уже в самолёте.' } },
    { id: 'anal', t: 'Анализ', q: 'Что действительно нужно и как связано?',
      iskra: { do: 'Отделяем потребность от решения, ищем противоречия (Кирилл хочет запись на 60 дней, правило BR-2 — 30), моделируем процессы, расставляем приоритеты.', out: 'Модели, разрешённые противоречия, приоритеты.', err: 'Записать всё подряд и не заметить, что два требования спорят друг с другом.' },
      trip: { do: 'Дети хотят море, папа — горы, бюджет 200 000 ₽. Находим вариант: море с поездкой в горы на день.', out: 'Один непротиворечивый план.', err: 'Пообещать и море, и горы — на бюджет, которого хватит на одно.' } },
    { id: 'doc', t: 'Документирование', q: 'Как записать, чтобы поняли одинаково?',
      iskra: { do: 'Истории с критериями приёмки, сценарии, бизнес-правила BR-*, НФТ — в Confluence. У каждого требования ID и атрибуты.', out: 'Спецификация, бэклог.', err: '«И так понятно» — через месяц никто не помнит, о чём договорились.' },
      trip: { do: 'Таблица: даты, город, отель, бюджет, кто бронирует и что берёт.', out: 'Один список на всех.', err: 'План живёт в голове у мамы. Мама заболела — отпуск остановился.' } },
    { id: 'check', t: 'Проверка', q: 'Записано правильно? И то ли нам нужно?',
      iskra: { do: '<b>Верификация</b> — ревью с Глебом и Лизой: однозначно, проверяемо, без противоречий. <b>Валидация</b> — показ сценариев и прототипа Марине Олеговне: это то, что нужно станции?', out: 'Замечания ревью, исправленные требования.', err: 'Проверить только «грамматику» требований и не показать их тем, кто знает работу станции.' },
      trip: { do: 'Показать список всей семье: «Точно эти даты? У бабушки же юбилей 14-го».', out: 'Исправленный план.', err: 'Проверить, что в таблице нет опечаток, но не спросить, удобны ли даты.' } },
    { id: 'agree', t: 'Согласование', q: 'Договорились? Фиксируем.',
      iskra: { do: 'Тимур Рашидович и Артём согласуют раздел — получается <b>базовая версия</b> (baseline) 1.0. С этого момента изменения — только через запрос на изменение.', out: 'Базовая версия требований, отметка «Согласовано» в Confluence.', err: 'Не зафиксировать базовую версию — потом не понять, что считать изменением, а что «так и было».' },
      trip: { do: 'Оплатили билеты и отель.', out: 'Брони и чеки.', err: 'Каждый день «чуть-чуть» менять план без брони — и остаться без мест.' } },
    { id: 'change', t: 'Управление изменениями', q: 'Что-то поменялось — что заденет и сколько стоит?',
      iskra: { do: 'Запрос на изменение CR-04 «шиномонтаж с хранением шин»: регистрируем, анализируем влияние по матрице трассировки, оцениваем, согласуем, выпускаем версию 1.1.', out: 'Запрос на изменение, анализ влияния, новая версия, история изменений.', err: 'Принять изменение на словах в коридоре — и сорвать срок, никого не предупредив.' },
      trip: { do: 'Тёща тоже едет: ещё билет, другой номер, бюджет +40 000 ₽. Все согласны?', out: 'Новый план и новый бюджет.', err: 'Молча взять тёщу и узнать в отеле, что номер на троих.' } }
  ];
  const howProcess = {
    id: 'how-process', covers: ['ambig'], title: 'Как это работает: путь требования от разговора до изменения', free: true, noReset: true,
    simple: {
      icon: '🔄',
      plain: 'Требование проходит шесть шагов: выяснили → разобрались → записали → проверили → договорились → управляем изменениями. Пропуск любого шага всплывает позже и дороже.',
      analogy: 'Семейный отпуск: всех спросили, нашли компромисс, записали план, показали всем, купили билеты — а когда тёща решила ехать тоже, пересчитали бюджет вместе, а не молча.',
      tech: 'Разработка требований (elicitation, analysis, specification, validation) и управление требованиями (baseline, change control, traceability, version control) — Вигерс, «Разработка требований», гл. 1–2; BABOK v3, области «Анализ требований и определение дизайна» и «Управление жизненным циклом требований»; ISO/IEC/IEEE 29148.'
    },
    lead: ui.brief({
      situation: 'Среда, 10:00. Вчера вечером Тимур Рашидович прислал: «Хочу шиномонтаж с хранением шин, как у конкурентов на Танкодроме. И в приложении. К сезону». Артём: «Раздел „Запись и заказ-наряд“ мы согласовали в понедельник. Это что теперь — переделывать?» Вера: «Это не катастрофа, это шестой шаг. Давайте посмотрим на весь путь».',
      todo: [
        'Нажимайте шаги по очереди: что делаем, что получается на выходе и типичная ошибка.',
        'Переключите пример на «Семейный отпуск» — шаги те же.',
        'Обратите внимание на «Проверку»: верификация и валидация — разные вопросы.'
      ],
      look: 'В гибкой разработке (у «Орбиты» — спринты по две недели) эти шаги проходит каждая история, а не весь проект один раз. Но базовая версия и управление изменениями нужны всё равно: иначе непонятно, что согласовано.'
    }),
    render(el) {
      el.classList.add('mrw-root');
      let cur = 'elic', ex = 'iskra';
      el.innerHTML = `<div class="stack">
        <div class="row"><span class="small dim">Пример:</span>${ui.seg('ex', [{ v: 'iskra', t: '🔧 «Искра Онлайн»' }, { v: 'trip', t: '🏖️ Семейный отпуск' }], ex, 'accent')}</div>
        <div class="mrw-steps" data-st lang="ru"></div>
        <div data-card></div>
        ${ui.note('info', 'Верификация и валидация', '<b>Верификация</b>: «правильно ли записали?» — однозначно, полно, без противоречий, проверяемо. Ловят Глеб и Лиза на ревью. <b>Валидация</b>: «то ли записали?» — отвечает ли требование реальной потребности. Ловят Марина Олеговна и мастера на показе сценариев и прототипа. Безупречно записанное требование может быть ненужным — и наоборот.')}
        ${ui.note('warn', 'Типичные ошибки', '<ul class="checks"><li class="bad">«Согласовали» — и забыли номер версии. Через месяц спор: «мы так не договаривались».</li><li class="bad">Изменение принято в чате без анализа влияния: сломали тест, экран и правило, о которых никто не вспомнил.</li><li class="bad">Валидацию заменили подписью: Тимур подписал, но станцию не спросили.</li></ul>')}
        <details class="more"><summary>Как об этом спрашивают на собеседовании</summary><div>
          <p><b>«Расскажите, как вы работаете с требованиями от начала до конца.»</b> Назовите шаги, на каждом — артефакт: протокол интервью, модели, спецификация или бэклог, замечания ревью, базовая версия, запрос на изменение с анализом влияния.</p>
          <p><b>«Чем верификация отличается от валидации?»</b> «Правильно ли мы делаем систему» против «ту ли систему мы делаем» (Боэм). Пример: требование про слот 30 минут однозначно и проверяемо (верификацию прошло), но шиномонтаж длится час — валидацию не прошло бы.</p>
          <p><b>«Что вы делаете, если заказчик меняет требования посреди спринта?»</b> Не спорю и не принимаю молча: регистрирую запрос, делаю анализ влияния, даю оценку и варианты, решение — за владельцем продукта, результат — новая версия требований.</p>
        </div></details>
      </div>`;
      function draw() {
        TR.$('[data-st]', el).innerHTML = PROC.map((s, i) => `<button type="button" class="mrw-step" data-s="${s.id}" aria-pressed="${s.id === cur}"><span class="n">${i + 1}${i < PROC.length - 1 ? ' →' : ' ↺'}</span><b>${esc(s.t)}</b></button>`).join('');
        const s = PROC.find(x => x.id === cur), x = s[ex];
        TR.$('[data-card]', el).innerHTML = `<div class="card flat"><h4>${PROC.indexOf(s) + 1}. ${esc(s.t)} <span class="small dim">· ${esc(s.q)}</span></h4><div class="mrw-def">
          <span class="k">Что делаем</span><div class="v">${x.do}</div>
          <span class="k">На выходе</span><div class="v">${x.out}</div>
          <span class="k">Типичная ошибка</span><div class="v">${x.err}</div>
        </div></div>`;
      }
      ui.onSeg(el, (n, v) => { if (n === 'ex') { ex = v; draw(); } });
      TR.on(el, 'click', '[data-s]', (e, b) => { cur = b.dataset.s; draw(); });
      draw();
    }
  };

  // =====================================================================
  // Теория 2. Качество требования и ревью
  // =====================================================================
  const QUAL = [
    { id: 'complete', t: 'Полнота', q: 'Сказано ли, что на границах и в исключениях?', who: ['liza', '«А на 31-й день вперёд записаться можно? А за 1 час до начала?»'],
      bad: 'Клиент может перенести запись на другую дату.',
      good: 'Клиент может перенести запись на свободный слот не раньше чем через 2 часа и не дальше 30 дней от текущего момента (BR-2); бесплатно — не позднее чем за 3 часа до начала (BR-3).' },
    { id: 'unamb', t: 'Однозначность', q: 'Поймут ли два человека одинаково?', who: ['gleb', '«Заранее — это за час или за неделю?»'],
      bad: 'Напоминание о записи отправляется заранее.',
      good: 'Напоминание отправляется push-уведомлением и SMS за 24 часа до начала записи.' },
    { id: 'consist', t: 'Непротиворечивость', q: 'Не спорит ли с другими требованиями и правилами?', who: ['olga', '«Так от всего чека или только от работ? И „Шашке“ тоже?»'],
      bad: 'Бонусы — 5 % от суммы заказ-наряда. (А BR-11: 5 % только от работ, корпоративным не начисляются.)',
      good: 'Бонусы — 5 % от стоимости работ (без запчастей) после оплаты; корпоративным клиентам не начисляются (BR-11).' },
    { id: 'verif', t: 'Проверяемость', q: 'Можно ли написать тест «прошло / не прошло»?', who: ['liza', '«Как я проверю „удобно“?»'],
      bad: 'Экран записи должен быть удобным.',
      good: 'Новый пользователь записывается на ТО без подсказок не дольше чем за 3 минуты (юзабилити-тест на 5 участниках).' },
    { id: 'atom', t: 'Атомарность', q: 'Это одно требование или несколько?', who: ['artem', '«Отзыв в MVP не берём. Как вычеркнуть половину строки?»'],
      bad: 'Клиент может отменить, перенести запись и оставить отзыв о визите.',
      good: 'Три требования: REQ-BK-12 «Отмена», REQ-BK-13 «Перенос», REQ-FB-01 «Отзыв о визите» — у каждого свой приоритет, статус и тесты.' },
    { id: 'trace', t: 'Трассируемость', q: 'Откуда оно, зачем и что от него зависит?', who: ['vera', '«Если цель уберут — как найти, что удалить вместе с ней?»'],
      bad: 'Добавить кнопку «Позвонить мастеру».',
      good: 'REQ-EX-07 «Позвонить мастеру из предложения доп. работ». Источник: разговор с Еленой. Цель: простой на согласовании 1 ч 40 мин → 20 мин (F-goal). Связи: US-21, экран «Предложение», TC-77.' }
  ];
  const howQuality = {
    id: 'how-quality', covers: ['conflict'], title: 'Как это работает: каким должно быть хорошее требование', free: true, noReset: true,
    simple: {
      icon: '🔍',
      plain: 'Хорошее требование — полное, однозначное, не спорит с другими, его можно проверить, оно про одну вещь и понятно, откуда взялось. Проверяют это на ревью — до того, как Глеб начнёт писать код.',
      analogy: 'Записка «купи хлеба, ну и что-нибудь к чаю» — неоднозначна. «Батон нарезной и пачку печенья до 150 ₽» — исполнима и проверяема: принёс или не принёс.',
      tech: 'Характеристики хорошего требования — ISO/IEC/IEEE 29148 (раньше IEEE 830): необходимое, однозначное, полное, непротиворечивое, осуществимое, проверяемое, единичное (атомарное), трассируемое. Виды ревью — Вигерс, гл. 17: самопроверка по чек-листу, коллегиальное ревью, пошаговый разбор (walkthrough), инспекция (по Фагану).'
    },
    lead: ui.brief({
      situation: 'Перед тем как отвечать Тимуру про шиномонтаж, Вера предлагает: «Давай посмотрим, в каком состоянии наш раздел про отмену и перенос — туда изменение тоже придёт. Лиза прошлась по нему и оставила двадцать комментариев. Разберём, что она ищет».',
      todo: [
        'Нажимайте критерии качества и переключайте «Было / Стало».',
        'Читайте, кто из команды задал бы вопрос к плохой версии, — так звучит каждый критерий на ревью.',
        'Откройте таблицу видов ревью ниже.'
      ],
      look: 'Ищите в требованиях слова-сигналы: «быстро», «удобно», «заранее», «и т. д.», «при необходимости», «соответствующий», «по возможности». Почти каждое — дефект.'
    }),
    render(el) {
      el.classList.add('mrw-root');
      let cur = 'complete', mode = 'bad';
      el.innerHTML = `<div class="stack">
        <div class="mrw-chips" data-q></div>
        <div class="row"><span class="small dim">Показать:</span>${ui.seg('m', [{ v: 'bad', t: 'Было' }, { v: 'good', t: 'Стало' }, { v: 'both', t: 'Рядом' }], mode, 'accent')}</div>
        <div data-card></div>
        <details class="more"><summary>Виды ревью требований</summary><div>
          ${ui.table(['Вид', 'Кто', 'Когда в «Орбите»'], [
            ['Самопроверка по чек-листу', 'Автор (вы)', 'Перед тем как отдать требование кому-то'],
            ['Коллегиальное ревью', 'Глеб, Лиза, Даша — асинхронно, комментариями', 'До груминга: каждое требование, которое пойдёт в спринт'],
            ['Пошаговый разбор (walkthrough)', 'Автор ведёт, бизнес слушает: Марина Олеговна, мастера', 'Валидация сценариев и прототипов перед согласованием'],
            ['Инспекция', 'Модератор, автор, 3–5 проверяющих с ролями, протокол дефектов', 'Для критичных разделов: оплата, персональные данные']
          ])}
          <p class="small muted">Ревью — самый дешёвый способ найти дефект: в требованиях его исправление стоит в десятки раз меньше, чем в коде или в апреле (Боэм; Вигерс, гл. 17).</p>
        </div></details>
        ${ui.note('warn', 'Типичные ошибки', '<ul class="checks"><li class="bad">Ревью «в голове»: «я перечитал, всё хорошо». Автор не видит своих неоднозначностей — он знает, что имел в виду.</li><li class="bad">Исправить формулировку, не спросив источник: «заранее» заменили на «за 1 час», а Марина Олеговна имела в виду сутки.</li><li class="bad">Противоречие решили сами: «пусть будет 30 дней». Решает владелец правила, а не аналитик.</li></ul>')}
        <details class="more"><summary>Как об этом спрашивают на собеседовании</summary><div>
          <p><b>«Какими свойствами должно обладать хорошее требование?»</b> Назовите 5–6 из ISO/IEC/IEEE 29148 и к каждому — пример «было / стало» из своей практики. Это гораздо убедительнее списка терминов.</p>
          <p><b>«Как вы находите противоречия?»</b> Матрица трассировки и сверка с бизнес-правилами: каждое требование ссылается на правило, и при изменении правила видно, кого оно задевает. Плюс ревью разными ролями.</p>
        </div></details>
      </div>`;
      function draw() {
        TR.$('[data-q]', el).innerHTML = QUAL.map(q => `<button type="button" class="mrw-chip" data-c="${q.id}" aria-pressed="${q.id === cur}">${esc(q.t)}</button>`).join('');
        const q = QUAL.find(x => x.id === cur);
        const bad = `<div class="card flat"><div class="eyebrow">Было</div><div class="bad-t">${esc(q.bad)}</div>${ui.say(q.who[0], q.who[1])}</div>`;
        const good = `<div class="card flat"><div class="eyebrow">Стало</div><div class="ok-t">${esc(q.good)}</div></div>`;
        TR.$('[data-card]', el).innerHTML = `<div class="stack"><div class="small"><b>${esc(q.t)}.</b> Вопрос к себе: ${esc(q.q)}</div>${mode === 'both' ? `<div class="mrw-ba">${bad}${good}</div>` : mode === 'bad' ? bad : good}</div>`;
      }
      ui.onSeg(el, (n, v) => { if (n === 'm') { mode = v; draw(); } });
      TR.on(el, 'click', '[data-c]', (e, b) => { cur = b.dataset.c; draw(); });
      draw();
    }
  };

  // =====================================================================
  // Теория 3. Атрибуты, статусы, трассировка и анализ влияния
  // =====================================================================
  const ATTR = [
    { k: 'ID', v: 'REQ-BK-12', why: 'Уникальный номер. На него ссылаются истории, тесты, дефекты и письма. «Требование про отмену» — не ссылка: таких может быть три.' },
    { k: 'Название', v: 'Отмена записи клиентом', why: 'Коротко, глагол + объект — чтобы найти в списке из двухсот.' },
    { k: 'Описание', v: 'Клиент отменяет подтверждённую запись в приложении или на сайте. Отмена не позднее чем за 3 часа до начала — бесплатная (BR-3); слот освобождается сразу.', why: 'Суть требования — однозначно и проверяемо.' },
    { k: 'Источник', v: 'BR-3; Марина Олеговна, правила станции Победы', why: 'К кому идти с вопросом и кто подтверждает изменение. Без источника противоречие не разрешить.' },
    { k: 'Приоритет', v: 'Must (входит в MVP)', why: 'Решает, попадёт ли требование в MVP к 15 марта. Подробно — в тренировке про приоритизацию.' },
    { k: 'Статус', v: 'Согласовано', why: 'Где требование в жизненном цикле: можно ли брать в разработку, можно ли менять без запроса.' },
    { k: 'Версия', v: '1.2 · 30 ноября', why: 'Что именно согласовали. Вместе с историей изменений отвечает на вопрос «кто, когда и почему поменял».' },
    { k: 'Ответственный', v: 'Вы (аналитик)', why: 'Кто ведёт требование и отвечает на вопросы Глеба и Лизы.' },
    { k: 'Критерии приёмки', v: 'TC-31…TC-34: отмена за 3:01, 3:00 и 2:59 до начала…', why: 'Как Лиза поймёт, что требование выполнено.' },
    { k: 'Связи', v: 'US-07, экран «Мои записи», таблица booking, TC-31…TC-34', why: 'Трассировка: по ним находят всё, что заденет изменение.' }
  ];
  const STATES = { draft: 'Черновик', review: 'На ревью', approved: 'Согласовано', impl: 'Реализовано', verified: 'Проверено', deferred: 'Отложено', rejected: 'Отклонено' };
  const EVENTS = [
    { id: 'send', t: 'Отправить на ревью', from: ['draft'], to: 'review', log: 'Отправлено Глебу и Лизе на ревью.' },
    { id: 'remarks', t: 'Ревью: есть замечания', from: ['review'], to: 'draft', ver: 'min', log: 'Лиза: «заранее — это когда?» Вернули на доработку.' },
    { id: 'approve', t: 'Согласовать', from: ['review'], to: 'approved', ver: 'base', log: 'Тимур Рашидович и Артём согласовали — базовая версия.' },
    { id: 'built', t: 'Разработка завершена', from: ['approved'], to: 'impl', log: 'Глеб влил код, сборка на тестовом стенде.' },
    { id: 'bug', t: 'Тест упал', from: ['impl'], to: 'impl', log: 'Лиза завела дефект на код. Статус требования не меняется — чинят код, а не требование.' },
    { id: 'tested', t: 'Тесты пройдены', from: ['impl'], to: 'verified', log: 'TC-31…TC-34 зелёные. Требование проверено.' },
    { id: 'cr', t: 'Запрос на изменение', from: ['approved', 'impl', 'verified'], to: 'draft', ver: 'min', log: 'CR: Тимур просит 6 часов вместо 3. Новая версия — снова черновик, старая остаётся в истории.' },
    { id: 'defer', t: 'Отложить', from: ['draft', 'review', 'approved'], to: 'deferred', log: 'Решили сделать после MVP.' },
    { id: 'reject', t: 'Отклонить', from: ['draft', 'review'], to: 'rejected', log: 'Требование отклонено с указанием причины.' },
    { id: 'back', t: 'Вернуть в работу', from: ['deferred'], to: 'draft', log: 'Вернули из отложенных.' }
  ];
  const MX_COLS = ['US-07 Отмена', 'US-08 Перенос', 'Экран «Мои записи»', 'АРМ: карточка записи', 'Таблица booking', 'TC-31…34 границы 3 ч', 'TC-40 напоминание'];
  const MX_ROWS = [
    { id: 'BR-3', t: 'Бесплатная отмена и перенос — не позднее 3 ч', links: [0, 1, 2, 3, 4, 5], kids: true },
    { id: 'REQ-BK-12', t: 'Отмена записи клиентом', links: [0, 2, 3, 4, 5] },
    { id: 'REQ-BK-13', t: 'Перенос записи', links: [1, 2, 4, 5] },
    { id: 'REQ-NT-03', t: 'Напоминание за сутки', links: [4, 6] },
    { id: 'REQ-BK-01', t: 'Поиск свободных слотов', links: [4] }
  ];
  const MX_VERDICT = ['Меняется: текст истории и критерии приёмки', 'Меняется: тоже бесплатный срок', 'Меняется: подсказка «бесплатно до …»', 'Проверить: показывает ли мастеру срок бесплатной отмены', 'Не меняется: поля те же, меняется только правило', 'Меняются: новые границы 6:01, 6:00, 5:59'];
  const howChange = {
    id: 'how-change', covers: ['life', 'impact'], title: 'Как это работает: атрибуты, статусы и анализ влияния', free: true, noReset: true,
    simple: {
      icon: '🧭',
      plain: 'У каждого требования есть паспорт: номер, источник, приоритет, статус, версия и связи. Статус показывает, где требование в жизни, а связи — что заденет его изменение. Анализ влияния — пройти по связям и для каждого найденного решить: меняется или нет.',
      analogy: 'В отпуске поменялись даты. По «связям» находим всё, что от них зависит: билеты, отель, трансфер, отгул на работе, кошка у соседки. Связь — ещё не изменение: страховку, может быть, менять не нужно, но проверить надо.',
      tech: 'Атрибуты требований и статусы — Вигерс, гл. 27–28; трассировка (матрица трассировки, прямая и обратная) — гл. 29; управление изменениями: запрос на изменение (change request, CR), анализ влияния (impact analysis), комиссия по изменениям (change control board) — гл. 28; BABOK v3, «Управление жизненным циклом требований».'
    },
    lead: ui.brief({
      situation: 'Вера открывает Confluence: «Прежде чем оценивать шиномонтаж, посмотри, как устроено одно наше требование. У него есть паспорт, жизнь и связи. Именно связи сегодня нас спасут».',
      todo: [
        'Вкладка «Карточка требования»: нажимайте атрибуты — зачем каждый нужен.',
        'Вкладка «Статусы»: проведите требование через жизнь кнопками событий. Смотрите, как меняются статус и версия и что пишется в историю.',
        'Вкладка «Матрица трассировки»: нажмите на строку BR-3 — так выглядит анализ влияния, если Тимур попросит бесплатную отмену за 6 часов вместо 3.'
      ],
      look: 'Связь в матрице — кандидат на изменение, а не приговор. По связям находим, что проверить; дальше для каждого решаем, меняется ли он на самом деле.'
    }),
    render(el) {
      el.classList.add('mrw-root');
      const tabs = document.createElement('div'); el.appendChild(tabs);
      ui.tabs(tabs, [
        { id: 'card', t: 'Карточка требования', render: renderCard },
        { id: 'st', t: 'Статусы', render: renderStates },
        { id: 'mx', t: 'Матрица трассировки', render: renderMx }
      ]);
      el.insertAdjacentHTML('beforeend', `<div class="stack" style="margin-top:14px">
        <div class="card flat"><div class="eyebrow">Как проходит запрос на изменение</div><ol class="small" style="margin:6px 0 0;padding-left:20px;display:grid;gap:3px">
          <li><b>Регистрация</b>: CR-04, автор, дата, суть, причина («конкуренты на Танкодроме уже делают»).</li>
          <li><b>Анализ влияния</b>: по матрице трассировки — какие требования, истории, экраны, таблицы и тесты затронуты, что появляется нового.</li>
          <li><b>Оценка</b>: дни команды, деньги, риски, что сдвигается.</li>
          <li><b>Решение</b>: варианты — заказчику и владельцу продукта; у крупных проектов — комиссия по изменениям.</li>
          <li><b>Новая версия</b>: требования 1.1, обновлённые связи, история изменений, уведомление команды.</li>
        </ol></div>
        ${ui.note('warn', 'Типичные ошибки', '<ul class="checks"><li class="bad">Менять текст согласованного требования «на месте» без новой версии — и потерять, что именно согласовывали.</li><li class="bad">Делать анализ влияния по памяти: «да там только каталог поправить». Забытая связь всплывает на тестировании.</li><li class="bad">Считать, что всё, что связано, — меняется. Оценка раздувается вдвое, и заказчик отказывается от нужного изменения.</li></ul>')}
        <details class="more"><summary>Как об этом спрашивают на собеседовании</summary><div>
          <p><b>«Какие атрибуты требования вы ведёте?»</b> ID, название, описание, источник, приоритет, статус, версия, ответственный, критерии приёмки, связи. Объясните зачем — хотя бы для трёх.</p>
          <p><b>«Что такое матрица трассировки?»</b> Таблица связей: цель → требование → история → экран, данные → тест. Прямая трассировка — от цели к реализации (всё ли сделали?), обратная — от кода и тестов к требованию (зачем это здесь?). Главное применение — анализ влияния изменений и поиск «сирот».</p>
        </div></details></div>`);

      function renderCard(box) {
        let cur = 0;
        function draw() {
          box.innerHTML = `<div class="stack"><div class="mrw-attr" role="list">${ATTR.map((a, i) => `<button type="button" data-a="${i}" class="${i === cur ? 'on' : ''}" aria-pressed="${i === cur}"><span class="k">${esc(a.k)}</span><span class="v">${esc(a.v)}</span></button>`).join('')}</div>
            <div class="card flat small"><b>${esc(ATTR[cur].k)}.</b> ${ATTR[cur].why}</div></div>`;
        }
        TR.on(box, 'click', '[data-a]', (e, b) => { cur = +b.dataset.a; draw(); });
        draw();
      }
      function renderStates(box) {
        let st = 'draft', ver = [0, 1], log = [{ t: 'v0.1', s: 'Черновик создан: «Отмена записи клиентом».' }];
        const vt = () => ver[0] + '.' + ver[1];
        function draw() {
          const main = ['draft', 'review', 'approved', 'impl', 'verified'], side = ['deferred', 'rejected'];
          box.innerHTML = `<div class="stack">
            <div class="mrw-chips">${main.map((s, i) => `<span class="mrw-chip ${s === st ? 'cur' : ''}">${STATES[s]}${i < main.length - 1 ? ' →' : ''}</span>`).join('')}<span class="small dim" style="align-self:center">в сторону:</span>${side.map(s => `<span class="mrw-chip ${s === st ? 'cur' : ''}">${STATES[s]}</span>`).join('')}</div>
            <div class="small">Сейчас: <b>${STATES[st]}</b>, версия <b class="tnum">${vt()}</b>${st === 'approved' || st === 'impl' || st === 'verified' ? ' · <span class="dim">менять — только через запрос на изменение</span>' : ''}</div>
            <div class="mrw-chips">${EVENTS.map(ev => `<button type="button" class="mrw-chip" data-ev="${ev.id}" ${ev.from.includes(st) ? '' : 'disabled'}>${esc(ev.t)}</button>`).join('')}<button type="button" class="btn sm" data-rs>Сначала</button></div>
            <div class="mrw-log">${log.slice().reverse().map(l => `<div><span class="t">${esc(l.t)}</span>${esc(l.s)}</div>`).join('')}</div>
          </div>`;
        }
        TR.on(box, 'click', '[data-ev]', (e, b) => {
          const ev = EVENTS.find(x => x.id === b.dataset.ev); if (!ev || !ev.from.includes(st)) return;
          if (ev.ver === 'min') ver = [ver[0], ver[1] + 1];
          if (ev.ver === 'base') ver = ver[0] === 0 ? [1, 0] : ver;
          st = ev.to; log.push({ t: 'v' + vt(), s: `${STATES[st]}. ${ev.log}` }); draw();
        });
        TR.on(box, 'click', '[data-rs]', () => { st = 'draft'; ver = [0, 1]; log = [{ t: 'v0.1', s: 'Черновик создан: «Отмена записи клиентом».' }]; draw(); });
        draw();
      }
      function renderMx(box) {
        let sel = 'BR-3';
        function draw() {
          const row = MX_ROWS.find(r => r.id === sel);
          box.innerHTML = `<div class="stack">
            <p class="small">Запрос: <b>«Сделать бесплатную отмену и перенос не позднее чем за 6 часов, а не за 3»</b>. Нажмите на строку — подсветятся связи.</p>
            <div class="mrw-mx"><table><thead><tr><th style="text-align:left">Требование</th>${MX_COLS.map(c => `<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>
              ${MX_ROWS.map(r => `<tr class="${r.id === sel ? 'on' : ''}"><td class="rq"><button type="button" data-r="${r.id}" aria-pressed="${r.id === sel}"><b>${esc(r.id)}</b>${esc(r.t)}</button></td>${MX_COLS.map((c, i) => `<td class="${r.links.includes(i) && r.id === sel ? 'hit' : ''} ${sel === 'BR-3' && r.id === sel && i < 6 && MX_VERDICT[i].startsWith('Меня') ? 'yes' : ''}">${r.links.includes(i) ? '●' : ''}</td>`).join('')}</tr>`).join('')}
            </tbody></table></div>
            ${sel === 'BR-3' ? `<div class="card flat small"><b>Анализ влияния BR-3 (3 ч → 6 ч).</b> По связям нашли 6 кандидатов, для каждого решили:<ul class="checks" style="margin-top:6px">${MX_VERDICT.map((v, i) => `<li class="${v.startsWith('Меня') ? 'warn' : v.startsWith('Проверить') ? 'info' : ''}">${esc(MX_COLS[i])}: ${esc(v)}.</li>`).join('')}</ul>Не задеты напоминание и поиск слотов — хотя они тоже работают с таблицей booking. Итог: 2 истории, 2 экрана, 4 тест-кейса, оценка — 1,5 дня. Без матрицы про TC-31…34 вспомнили бы, когда Лиза получила бы «красные» тесты на правильной сборке.</div>` : `<div class="card flat small"><b>${esc(row.id)}</b> связано с: ${row.links.map(i => esc(MX_COLS[i])).join(', ')}. Это прямая трассировка: от требования — к тому, что его реализует и проверяет. Обратная — от теста или экрана к требованию: «зачем это здесь?».</div>`}
          </div>`;
        }
        TR.on(box, 'click', '[data-r]', (e, b) => { sel = b.dataset.r; draw(); });
        draw();
      }
    }
  };

  // =====================================================================
  // Практика 1. Охота на дефекты в черновике «Отмена и перенос»
  // =====================================================================
  const DEF_T = [{ v: 'vague', t: 'Неоднозначно' }, { v: 'untest', t: 'Непроверяемо' }, { v: 'incomplete', t: 'Неполно' }, { v: 'atom', t: 'Не атомарно' }];
  const DTT = v => (DEF_T.find(d => d.v === v) || { t: '—' }).t;
  const SPEC = [
    { id: 's1', t: 'Клиент может отменить или перенести запись, а также изменить список услуг в записи.', def: 'atom', fix: 'Три отдельных требования: отмена, перенос, изменение услуг — с разными правилами и приоритетами.', why: 'Три действия в одной строке: у переноса есть ограничения BR-2, у изменения услуг — пересчёт длительности по BR-1. Одним статусом их не отследить.' },
    { id: 's2', t: 'Отмена и перенос доступны в приложении клиента и на сайте.', def: null, why: 'Ясно, где доступно, — дефекта нет.' },
    { id: 's3', t: 'Бесплатная отмена возможна не позднее чем за 3 часа до начала записи.', def: null, why: 'Точная граница из BR-3 — дефекта нет.' },
    { id: 's4', t: 'При поздней отмене применяются соответствующие меры.', def: 'vague', alt: { incomplete: 'Да, мер не хватает, — но главная беда в слове «соответствующие»: каждый поймёт своё.' }, fix: 'Указать, что именно происходит при отмене позже чем за 3 часа (например, считается ли это неявкой по BR-4) — уточнить у Марины Олеговны.', why: '«Соответствующие» — какие? Штраф, неявка, ничего? Глеб и Лиза поймут по-разному.' },
    { id: 's5', t: 'Система быстро отправляет клиенту подтверждение отмены.', def: 'untest', alt: { vague: 'Неоднозначно — да, но важнее, что «быстро» нельзя проверить. Нужна граница в секундах.' }, fix: 'Подтверждение отмены (push) — не позже 1 минуты после отмены.', why: '«Быстро» не проверить: Лиза не напишет тест.' },
    { id: 's6', t: 'Подтверждение приходит push-уведомлением, SMS и т. д.', def: 'vague', alt: { incomplete: 'Неполно — тоже верно, но корень в «и т. д.»: список открыт и каждый допишет своё.' }, fix: 'Подтверждение — push; если push не доставлен за 1 минуту — SMS. Других каналов нет.', why: '«И т. д.» — email? звонок? Список каналов открыт — оценить работу нельзя.' },
    { id: 's7', t: 'Отменённая запись получает статус «Отменена».', def: null, why: 'Точный статус cancelled из модели — дефекта нет.' },
    { id: 's8', t: 'Освободившийся слот по возможности сразу становится доступен для записи.', def: 'vague', alt: { untest: 'Проверить тоже трудно, но корень — «по возможности»: когда возможно, а когда нет?' }, fix: 'Освободившийся слот доступен для записи сразу после отмены (не позже 5 секунд).', why: '«По возможности» — а когда невозможно? Лазейка, через которую уходит требование.' },
    { id: 's9', t: 'Перенос выполняется на любую свободную дату.', def: 'incomplete', alt: { vague: 'Двусмысленности тут нет — «любую» понятно. Беда в том, что пропущены ограничения BR-2.' }, fix: 'Перенос — на свободный слот не раньше чем через 2 часа и не дальше 30 дней от текущего момента (BR-2).', why: 'Пропущены границы BR-2: «любая» дата — это и через 3 месяца, и через 10 минут.' },
    { id: 's10', t: 'При отмене записи на ТО резерв запчастей обрабатывается.', def: 'incomplete', alt: { vague: 'Да, «обрабатывается» размыто. Но главное — не сказано, что именно происходит с резервом.' }, fix: 'При отмене записи на ТО резерв запчастей в 1С снимается сразу (BR-12).', why: 'Что значит «обрабатывается»: снимается, продлевается, переносится на новую дату? Алия не поймёт, что увидит в 1С.' },
    { id: 's11', t: 'Если клиент не приехал, запись должна обрабатываться корректно.', def: 'untest', alt: { vague: '«Корректно» — размыто, верно. Но главное: тест «корректно / некорректно» не написать. Правило уже есть — BR-4.' }, fix: 'Если клиент не приехал в течение 15 минут после начала, запись получает статус «Неявка», пост освобождается (BR-4).', why: '«Корректно» — по чьему мнению? Есть точное правило BR-4: 15 минут, «Неявка».' },
    { id: 's12', t: 'Интерфейс отмены должен быть удобным и интуитивно понятным.', def: 'untest', alt: { vague: 'И неоднозначно тоже. Но в первую очередь — не проверить.' }, fix: 'Клиент находит и выполняет отмену записи не более чем за 3 нажатия с главного экрана (юзабилити-тест, 5 участников).', why: '«Удобный» и «интуитивный» — нет ни метрики, ни порога.' },
    { id: 's13', t: 'Корпоративные клиенты отменяют записи через кабинет компании.', def: null, why: 'Понятно, кто и где — дефекта нет.' },
    { id: 's14', t: 'Предоплата 500 ₽ возвращается.', def: 'incomplete', fix: 'Указать: при каком сроке отмены, в какой срок и каким способом возвращается предоплата (BR-4), — уточнить у Ольги Викторовны.', why: 'Когда? При любой отмене или только при бесплатной? Куда — на карту, бонусами?' }
  ];
  const SP = id => SPEC.find(s => s.id === id);
  const DEFS = SPEC.filter(s => s.def);
  function ambigEval(a) {
    const sel = (a && a.sel) || {};
    const rows = SPEC.filter(s => s.id in sel).map(s => {
      const got = sel[s.id];
      if (!s.def) return { s, st: 'bad', pts: 0, why: s.why };
      if (got === s.def) return { s, st: 'ok', pts: 1, why: s.why };
      if (got && s.alt && s.alt[got]) return { s, st: 'warn', pts: 0.75, why: s.alt[got] };
      return { s, st: got ? 'bad' : 'warn', pts: 0.5, why: got ? `Не «${DTT(got)}». ${s.why}` : 'Нашли, но не выбрали вид дефекта.' };
    });
    const hits = rows.filter(r => r.s.def), fp = rows.filter(r => !r.s.def);
    const score = Math.max(0, Math.min(1, hits.reduce((x, r) => x + r.pts, 0) / DEFS.length - 0.1 * fp.length));
    return { rows, hits, fp, missed: DEFS.filter(s => !(s.id in sel)), score };
  }
  const ambigTask = {
    id: 'ambig', title: 'Охота на дефекты: черновик «Отмена и перенос»',
    simple: howQuality.simple,
    lead: ui.brief({
      situation: 'Шиномонтаж придёт и в раздел «Отмена и перенос» — но сначала Вера просит навести там порядок: «Это черновик версии 0.3, писал стажёр до тебя. Лиза его ещё не видела. Найди всё, к чему она придерётся, — пусть лучше это будешь ты».',
      todo: [
        'Нажимайте на строки черновика, в которых есть дефект качества.',
        'Для каждой найденной строки выберите вид дефекта: неоднозначно, непроверяемо, неполно или не атомарно.',
        'Строки без дефектов отмечать не нужно — за них снимаются баллы.',
        'Нажмите «Проверить». Засчитывается от 80 %. После проверки у каждой строки появится объяснение и исправленная версия.'
      ],
      look: '<b>Неоднозначно</b> — можно понять по-разному («соответствующие», «по возможности», «и т. д.»). <b>Непроверяемо</b> — нельзя написать тест («быстро», «удобно», «корректно»). <b>Неполно</b> — пропущены границы, исключения, «что именно происходит». <b>Не атомарно</b> — несколько требований в одном.'
    }),
    blank: () => ({ sel: {} }),
    reference: () => ({ sel: Object.fromEntries(DEFS.map(s => [s.id, s.def])) }),
    render(el, ctx) {
      el.classList.add('mrw-root');
      const a = ctx.ans; a.sel = a.sel || {};
      const ev = ctx.result ? ambigEval(a) : null;
      const cls = id => { if (!ev) return ''; const r = ev.rows.find(x => x.s.id === id); if (r) return r.st; return ctx.readonly && SP(id).def ? 'miss' : ''; };
      el.innerHTML = `<div class="stack"><div class="mrw-spec"><div class="hd"><b>REQ-BK · Отмена и перенос записи</b> · черновик v0.3 · автор: стажёр</div><div class="bd" data-s></div></div>
        <div class="eyebrow">Найденные дефекты</div><div class="mrw-found" data-f></div></div>`;
      function draw() {
        TR.$('[data-s]', el).innerHTML = SPEC.map((s, i) => `<button type="button" class="mrw-sn ${cls(s.id)}" data-sn="${s.id}" aria-pressed="${s.id in a.sel}" ${ctx.readonly ? 'disabled' : ''}><span class="i">${i + 1}.</span><span>${esc(s.t)}</span></button>`).join('');
        const ids = SPEC.filter(s => s.id in a.sel).map(s => s.id);
        TR.$('[data-f]', el).innerHTML = ids.length ? ids.map(id => {
          const s = SP(id), r = ev && ev.rows.find(x => x.s.id === id);
          return `<div class="it ${r ? r.st : ''}"><span><span class="small dim">${SPEC.indexOf(s) + 1}.</span> ${esc(s.t)}</span>
            <select data-d="${id}" aria-label="Вид дефекта для строки ${SPEC.indexOf(s) + 1}" ${ctx.readonly ? 'disabled' : ''}><option value="">Вид дефекта…</option>${DEF_T.map(d => `<option value="${d.v}" ${a.sel[id] === d.v ? 'selected' : ''}>${esc(d.t)}</option>`).join('')}</select>
            ${r ? `<div class="why">${r.why}${s.fix ? `<br><b>Как исправить:</b> ${esc(s.fix)}` : ''}</div>` : ''}</div>`;
        }).join('') : '<div class="small dim">Пока ничего не отмечено. Нажмите на строку черновика.</div>';
      }
      TR.on(el, 'click', '[data-sn]', (e, b) => { if (ctx.readonly) return; const id = b.dataset.sn; if (id in a.sel) delete a.sel[id]; else a.sel[id] = ''; ctx.save(); draw(); });
      el.addEventListener('change', e => { const s = e.target.closest('select[data-d]'); if (!s || ctx.readonly) return; a.sel[s.dataset.d] = s.value; ctx.save(); });
      draw();
    },
    check(ans) {
      const r = ambigEval(ans), notes = [];
      notes.push({ ok: r.hits.length >= 9 ? true : r.hits.length >= 6 ? 'warn' : false, html: `Найдено дефектов: ${r.hits.length} из ${DEFS.length}, вид определён верно у ${r.rows.filter(x => x.st === 'ok').length}.` });
      if (r.missed.length) notes.push({ ok: 'warn', html: `Пропущено ${r.missed.length}. Перечитайте строки со словами «обрабатывается», «любую», «возвращается»: не сказано, <i>что именно</i> и <i>в каких границах</i>.` });
      r.fp.forEach(x => notes.push({ ok: false, html: `Строка «${esc(x.s.t)}» — ${x.why}` }));
      r.rows.filter(x => x.s.def && x.st !== 'ok').forEach(x => notes.push({ ok: x.st === 'warn' ? 'warn' : false, html: `«${esc(x.s.t)}» — ${x.why}` }));
      return {
        ok: r.score >= 0.8, score: r.score, notes,
        summary: `Найдено ${r.hits.length} из ${DEFS.length} дефектов, лишних отметок: ${r.fp.length}.`,
        mentor: r.score >= 0.8 ? null : r.fp.length > 1 ? 'Не каждая строка плохая. «Статус „Отменена“» и «за 3 часа» — точные и проверяемые. Задайте строке вопрос Лизы: «Как я это проверю?» Если ответ очевиден — дефекта нет.' : 'Ищите слова-сигналы: «соответствующие», «быстро», «и т. д.», «по возможности», «корректно», «удобный» — и места, где не сказано, что именно происходит.'
      };
    },
    explain: `<p>В черновике <b>10 дефектов</b> из 14 строк:</p>
      <ul class="checks">
        <li><b>Неоднозначно</b>: «соответствующие меры», «и т. д.», «по возможности» — каждый поймёт своё.</li>
        <li><b>Непроверяемо</b>: «быстро», «корректно», «удобным и интуитивно понятным» — нет числа и порога.</li>
        <li><b>Неполно</b>: перенос «на любую дату» без BR-2, резерв «обрабатывается», предоплата «возвращается» — не сказано, что именно и когда.</li>
        <li><b>Не атомарно</b>: отмена, перенос и изменение услуг в одной строке.</li>
      </ul>
      <p>Граница между «неоднозначно» и «непроверяемо» тонкая — засчитывается и близкий вид. Важно другое: <b>исправлять не «из головы», а по источнику</b>. Для «соответствующих мер» и возврата предоплаты в BR-* ответа нет — это вопросы Марине Олеговне и Ольге Викторовне, а не повод придумать правило самому. Источники: ISO/IEC/IEEE 29148 (характеристики требований); Вигерс, гл. 11 «Пишем хорошие требования» и гл. 17 «Проверка требований».</p>`,
    refNote: 'Засчитывается близкий вид дефекта там, где граница тонкая (неоднозначно ↔ непроверяемо, неоднозначно ↔ неполно), — с пониженным баллом.',
    report: ans => { const r = ambigEval(ans); return r.rows.map(x => `- ${SPEC.indexOf(x.s) + 1}. ${x.s.t} → ${DTT(((ans && ans.sel) || {})[x.s.id])} ${x.st === 'ok' ? '✓' : x.st === 'warn' ? '≈' : '✗'}`).join('\n') || '—'; }
  };

  // =====================================================================
  // Практика 2. Противоречия между требованиями
  // =====================================================================
  const CARDS = [
    { id: 'BR-2', br: true, t: 'Онлайн-запись — не позже чем за 2 часа до начала и не дальше 30 дней вперёд.' },
    { id: 'REQ-BK-03', t: 'Календарь записи открыт на 60 дней вперёд, чтобы клиенты записывались на сезон заранее (предложение Кирилла).' },
    { id: 'BR-16', br: true, t: 'Заказ-наряды и платежи хранятся 5 лет; при удалении аккаунта документы остаются.' },
    { id: 'REQ-AC-09', t: 'По запросу клиента аккаунт и все связанные с ним данные удаляются безвозвратно в течение суток.' },
    { id: 'BR-8', br: true, t: 'Нет ответа на предложение доп. работ 20 минут — мастер звонит; не дозвонился — доп. работы ждут; к концу основных работ ответа нет — «Истекло».' },
    { id: 'REQ-EX-05', t: 'Если клиент не ответил на предложение доп. работ за 20 минут, предложение получает статус «Истекло».' },
    { id: 'BR-11', br: true, t: 'Бонусы: 5 % от работ (не запчастей) после оплаты; корпоративным клиентам не начисляются.' },
    { id: 'REQ-BN-02', t: 'После оплаты каждому клиенту начисляются бонусы — 5 % от итоговой суммы заказ-наряда.' },
    { id: 'BR-3', br: true, t: 'Бесплатная отмена и перенос — не позднее чем за 3 часа до начала.' },
    { id: 'REQ-BK-07', t: 'Клиент может отменить запись в приложении вплоть до её начала.' },
    { id: 'BR-13', br: true, t: '«Готов» → push и SMS; бесплатное хранение машины до конца следующего дня, далее 500 ₽ в сутки.' },
    { id: 'REQ-NT-01', t: 'Push о смене статуса заказ-наряда приходит клиенту не позже 1 минуты после смены статуса.' },
    { id: 'BR-10', br: true, t: 'Оплата после статуса «Готов»: онлайн или в кассе станции; юрлица — счёт раз в месяц.' },
    { id: 'REQ-PY-01', t: 'Кнопка «Оплатить» в приложении появляется, когда заказ-наряд получает статус «Готов».' }
  ];
  const CD = id => CARDS.find(c => c.id === id);
  const pkey = (x, y) => [x, y].sort().join('|');
  const CONFL = {
    [pkey('BR-2', 'REQ-BK-03')]: 'Календарь на 60 дней против правила «не дальше 30 дней» (BR-2). Решает владелец правила — Марина Олеговна: на 60 дней не спланировать посты и мастеров.',
    [pkey('BR-16', 'REQ-AC-09')]: '«Удалить всё безвозвратно» против хранения заказ-нарядов и платежей 5 лет (BR-16). Решение: ПДн обезличиваем, документы остаются — и закон о ПДн, и бухгалтерия довольны.',
    [pkey('BR-8', 'REQ-EX-05')]: '«Истекло» через 20 минут против правила BR-8: через 20 минут мастер звонит, а «Истекло» — только к концу основных работ. Клиент, который был за рулём, потеряет предложение.',
    [pkey('BR-11', 'REQ-BN-02')]: '5 % «от итоговой суммы» и «каждому» против BR-11: только от работ (не запчастей) и не корпоративным. Иначе «Шашка» копит бонусы, а «Искра» дарит 5 % с запчастей.'
  };
  const TRAP = { [pkey('BR-3', 'REQ-BK-07')]: 'Это не противоречие: отменить можно до начала, а бесплатно — за 3 часа. Но требование REQ-BK-07 неполное: не сказано, что происходит при отмене позже чем за 3 часа. Это дефект полноты, а не противоречие.' };
  const OKPAIR = { [pkey('BR-13', 'REQ-NT-01')]: 'Не противоречат: BR-13 говорит, что push отправляется, REQ-NT-01 — как быстро. Они дополняют друг друга.', [pkey('BR-10', 'REQ-PY-01')]: 'Не противоречат: кнопка оплаты после «Готов» — ровно BR-10.' };
  const WHO_Q = {
    q: 'Вы нашли противоречие между REQ-BK-03 (60 дней, предложение Кирилла) и BR-2 (30 дней, Марина Олеговна). Кто решает, что останется?',
    options: [
      { t: 'Аналитик сам выбирает более разумный вариант и исправляет требование', why: 'Аналитик не владелец бизнес-правила. Его работа — найти противоречие, показать последствия и привести к решению тех, кто вправе решать.' },
      { t: 'Владелец правила и заказчик: аналитик показывает Марине Олеговне и Кириллу обе позиции и последствия, решение фиксирует Тимур Рашидович как владелец продукта', ok: true, why: 'Да. Аналитик — модератор: факты, последствия, варианты. Решение и его автор записываются в историю требования.' },
      { t: 'Глеб: как ему проще реализовать, так и будет', why: 'Удобство реализации — важный аргумент, но правило работы станции решает бизнес.' },
      { t: 'Оставляем оба — разберутся на тестировании', why: 'Тогда Лиза получит два противоречащих ожидаемых результата, а Глеб сделает один из них наугад.' }
    ]
  };
  function conflEval(a) {
    a = a || {};
    const pairs = a.pairs || [];
    const rows = pairs.map(k => CONFL[k] ? { k, s: 'ok', why: CONFL[k] } : TRAP[k] ? { k, s: 'warn', why: TRAP[k] } : { k, s: 'bad', why: OKPAIR[k] || 'Эти требования говорят о разных вещах — противоречия между ними нет.' });
    const good = rows.filter(r => r.s === 'ok').length, bad = rows.filter(r => r.s === 'bad').length, warn = rows.filter(r => r.s === 'warn').length;
    const sP = Math.max(0, (good - 0.5 * bad - 0.25 * warn) / Object.keys(CONFL).length);
    const q = ui.quizScore(WHO_Q, a.q || []);
    return { rows, good, bad, warn, sP, q, score: Math.round((0.8 * Math.min(1, sP) + 0.2 * q.score) * 1000) / 1000 };
  }
  const conflictTask = {
    id: 'conflict', title: 'Найдите противоречия между требованиями',
    simple: howQuality.simple,
    lead: ui.brief({
      situation: 'Перед согласованием версии 1.1 Вера просит сверить черновые требования (REQ-*), собранные от разных людей, с бизнес-правилами (BR-*): «Каждый говорил правду со своей колокольни. Найди, где колокольни спорят».',
      todo: [
        'Нажмите на одну карточку, затем на другую, — получится пара «эти двое противоречат». Пару можно удалить.',
        'Ищите пары, которые нельзя выполнить одновременно. Требования, которые дополняют друг друга или одно из которых просто неполное, — не противоречие.',
        'Ответьте, кто решает спор.',
        'Нажмите «Проверить». Засчитывается от 80 %: пары — 80 %, вопрос — 20 %.'
      ],
      look: 'Противоречие — когда, выполнив одно требование, вы обязательно нарушите другое. Попробуйте мысленно написать тест: если он не может быть зелёным для обоих, пара найдена.'
    }),
    blank: () => ({ pairs: [], q: [] }),
    reference: () => ({ pairs: Object.keys(CONFL), q: quizRef(WHO_Q) }),
    render(el, ctx) {
      el.classList.add('mrw-root');
      const a = ctx.ans; a.pairs = a.pairs || []; a.q = a.q || [];
      const ev = ctx.result ? conflEval(a) : null;
      let pick = null;
      el.innerHTML = `<div class="stack"><div class="mrw-cards" data-c></div><div class="small dim" data-h></div><div class="eyebrow">Найденные противоречия</div><div class="mrw-pairs" data-p></div><div class="card flat" data-q></div></div>`;
      function draw() {
        const num = {}; a.pairs.forEach((k, i) => k.split('|').forEach(id => { (num[id] = num[id] || []).push(i + 1); }));
        TR.$('[data-c]', el).innerHTML = CARDS.map(c => `<button type="button" class="mrw-card ${c.br ? 'br' : ''}" data-cd="${c.id}" aria-pressed="${pick === c.id}" ${ctx.readonly ? 'disabled' : ''}>${num[c.id] ? `<span class="pn">#${num[c.id].join(', #')}</span>` : ''}<span class="id">${esc(c.id)}${c.br ? ' · бизнес-правило' : ''}</span><span>${esc(c.t)}</span></button>`).join('');
        TR.$('[data-h]', el).textContent = ctx.readonly ? '' : pick ? `Выбрано ${pick}. Теперь нажмите вторую карточку пары (или ту же — чтобы отменить).` : 'Нажмите первую карточку пары.';
        TR.$('[data-p]', el).innerHTML = a.pairs.length ? a.pairs.map((k, i) => {
          const [x, y] = k.split('|'), r = ev && ev.rows.find(z => z.k === k);
          return `<div class="mrw-pair ${r ? r.s : ''}"><span><b>#${i + 1}</b> ${esc(x)} ⟷ ${esc(y)}</span>${ctx.readonly ? '<span></span>' : `<button type="button" class="btn sm" data-del="${esc(k)}" aria-label="Удалить пару ${esc(x)} и ${esc(y)}">Удалить</button>`}${r ? `<div class="why">${r.why}</div>` : ''}</div>`;
        }).join('') : '<div class="small dim">Пока пар нет.</div>';
      }
      TR.on(el, 'click', '[data-cd]', (e, b) => {
        if (ctx.readonly) return;
        const id = b.dataset.cd;
        if (!pick) pick = id;
        else if (pick === id) pick = null;
        else { const k = pkey(pick, id); if (!a.pairs.includes(k)) a.pairs.push(k); pick = null; ctx.save(); }
        draw();
      });
      TR.on(el, 'click', '[data-del]', (e, b) => { if (ctx.readonly) return; a.pairs = a.pairs.filter(k => k !== b.dataset.del); ctx.save(); draw(); });
      draw();
      ui.quiz(TR.$('[data-q]', el), Object.assign({}, WHO_Q, { value: a.q, readonly: ctx.readonly, reveal: ctx.result, onChange: v => { a.q = v; ctx.save(); } }));
    },
    check(ans) {
      const r = conflEval(ans), notes = [];
      const total = Object.keys(CONFL).length;
      notes.push({ ok: r.good === total ? true : r.good >= 2 ? 'warn' : false, html: `Найдено противоречий: ${r.good} из ${total}.` });
      r.rows.forEach(x => { const [p, q] = x.k.split('|'); notes.push({ ok: x.s === 'ok' ? true : x.s === 'warn' ? 'warn' : false, html: `${esc(p)} ⟷ ${esc(q)}: ${x.why}` }); });
      if (r.good < total) {
        const miss = Object.keys(CONFL).filter(k => !(ans.pairs || []).includes(k)).map(k => k.split('|').find(id => !CD(id).br));
        notes.push({ ok: 'warn', html: `Не найдены пары для: ${miss.map(esc).join(', ')}. Сравните каждое из них с бизнес-правилом той же темы.` });
      }
      notes.push(r.q.ok ? { ok: true, html: 'Вопрос: верно — решает бизнес, аналитик готовит решение.' } : { ok: false, html: 'Вопрос: аналитик находит противоречие и показывает последствия, но правило работы станции — не его решение.' });
      return {
        ok: r.score >= 0.8, score: r.score, notes,
        summary: `Пары: ${r.good} верных, ${r.bad} лишних${r.warn ? `, ${r.warn} «почти»` : ''}; вопрос: ${r.q.ok ? 'верно' : 'неверно'}.`,
        mentor: r.score >= 0.8 ? null : 'Разложите карточки по темам: запись, удаление, доп. работы, бонусы, отмена, уведомления, оплата. В каждой теме сравните REQ с BR: можно ли выполнить оба сразу?'
      };
    },
    explain: `<p>Четыре настоящих противоречия — все между «пожеланием с места» и бизнес-правилом:</p>
      <ul class="checks">
        <li><b>REQ-BK-03 ⟷ BR-2</b>: 60 дней против 30.</li>
        <li><b>REQ-AC-09 ⟷ BR-16</b>: «удалить всё» против хранения документов 5 лет. Решение — обезличивание.</li>
        <li><b>REQ-EX-05 ⟷ BR-8</b>: «Истекло» через 20 минут против «звонок через 20 минут, „Истекло“ к концу основных работ».</li>
        <li><b>REQ-BN-02 ⟷ BR-11</b>: 5 % от всего и всем против 5 % от работ и не корпоративным.</li>
      </ul>
      <p class="small">Ловушка — <b>REQ-BK-07 и BR-3</b>: выполнить оба можно (отменить до начала, бесплатно — за 3 часа), но REQ-BK-07 неполное. Дополняющие пары (BR-13 и push за минуту, BR-10 и кнопка оплаты) — не противоречие.</p>
      <p>Противоречия редко видны в одном документе: они живут между источниками. Поэтому каждое требование ссылается на правило, а правило — на владельца. Решает владелец, аналитик готовит решение: факты, последствия, варианты. Источники: ISO/IEC/IEEE 29148 (непротиворечивость); Вигерс, гл. 17; BABOK v3, 7.2 «Проверка требований».</p>`,
    report: ans => { const r = conflEval(ans); return r.rows.map(x => `- ${x.k.replace('|', ' ⟷ ')} ${x.s === 'ok' ? '✓' : x.s === 'warn' ? '≈' : '✗'}`).join('\n') + `\n- Кто решает: ${r.q.ok ? 'верно' : 'неверно'}`; }
  };

  // =====================================================================
  // Практика 3. Жизненный цикл требования
  // =====================================================================
  const LC_MAIN = ['draft', 'review', 'approved', 'impl', 'verified'];
  const LC_ITEMS = LC_MAIN.map(id => ({ id, t: STATES[id] }));
  const LC_CH = [
    { v: 'draft', t: 'Черновик' }, { v: 'review', t: 'На ревью' }, { v: 'approved', t: 'Согласовано' }, { v: 'impl', t: 'Реализовано' },
    { v: 'verified', t: 'Проверено' }, { v: 'deferred', t: 'Отложено' }, { v: 'rejected', t: 'Отклонено' }, { v: 'newver', t: 'Новая версия через запрос на изменение' }
  ];
  const LC_SIT = [
    { id: 'l1', t: 'Вы дописали критерии приёмки к REQ-BK-12 и отправили Глебу и Лизе комментировать', ok: 'review' },
    { id: 'l2', t: 'Лиза на ревью нашла в REQ-NT-03 слово «заранее» и вернула требование', ok: 'draft', alt: { review: 'Требование уже не на ревью: его вернули автору. Пока вы не исправите, это снова черновик (с новой минорной версией).' } },
    { id: 'l3', t: 'Тимур Рашидович и Артём согласовали раздел «Запись и заказ-наряд», версия 1.0', ok: 'approved' },
    { id: 'l4', t: 'Глеб влил код отмены записи, сборка на тестовом стенде, тесты ещё не гоняли', ok: 'impl' },
    { id: 'l5', t: 'Лиза прогнала TC-31…TC-34 по отмене — всё зелёное', ok: 'verified' },
    { id: 'l6', t: 'Бонусы решили не делать в MVP — вернёмся осенью', ok: 'deferred', alt: { rejected: 'Не отклонено: от бонусов не отказались, их перенесли. «Отклонено» — когда требование не будет сделано совсем.' } },
    { id: 'l7', t: 'Предложение Кирилла «запись на 60 дней» не приняли: остаётся BR-2, 30 дней', ok: 'rejected', alt: { deferred: 'Не отложено: к нему не вернутся — правило BR-2 оставили. Это отказ, и причину записывают.' } },
    { id: 'l8', t: 'Отмена уже реализована, и Тимур просит бесплатную отмену за 6 часов вместо 3', ok: 'newver', alt: { draft: 'Почти: новая версия начинается с черновика — но только через зарегистрированный запрос на изменение и анализ влияния, а реализованная версия 1.x остаётся в истории.' } }
  ];
  function lifeEval(a) {
    a = a || {};
    const v = a.order || [];
    const full = v.length === LC_MAIN.length;
    const os = full ? ui.orderScore(v, LC_MAIN) : 0;
    const m = LC_SIT.map(s => { const got = (a.map || {})[s.id]; return got === s.ok ? { s, st: 'ok', pts: 1 } : got && s.alt && s.alt[got] ? { s, st: 'warn', pts: 0.5, why: s.alt[got] } : { s, st: 'bad', pts: 0, got }; });
    const ms = m.reduce((x, z) => x + z.pts, 0) / LC_SIT.length;
    return { full, os, m, ms, score: Math.round((0.3 * os + 0.7 * ms) * 1000) / 1000 };
  }
  const lifeTask = {
    id: 'life', title: 'Жизненный цикл требования: статусы и ситуации',
    simple: howChange.simple,
    lead: ui.brief({
      situation: 'Артём хочет видеть в Confluence, что с каждым требованием происходит: «Мне нужно одним взглядом понять, что согласовано, что в работе, что проверено, — и что мы отложили». Вера: «Для этого статусы должны значить одно и то же для всех».',
      todo: [
        'Часть 1. Расставьте пять основных статусов в порядке жизни требования: стрелки ↑ ↓ (на компьютере можно перетаскивать).',
        'Часть 2. Для каждой из восьми ситуаций выберите, в каком статусе оказывается требование после неё.',
        'Нажмите «Проверить». Засчитывается от 80 %: порядок — 30 %, ситуации — 70 %.'
      ],
      look: '«Отложено» — вернёмся позже, «Отклонено» — не будем делать. Согласованное требование не правят «на месте»: изменение идёт через запрос и даёт новую версию.'
    }),
    blank: () => ({ order: [], map: {} }),
    reference: () => ({ order: LC_MAIN.slice(), map: Object.fromEntries(LC_SIT.map(s => [s.id, s.ok])) }),
    render(el, ctx) {
      el.classList.add('mrw-root');
      const a = ctx.ans; a.map = a.map || {};
      const ev = ctx.result ? lifeEval(a) : null;
      el.innerHTML = '<div class="stack"><div class="eyebrow">Часть 1 · Основной путь</div><div data-o></div><div class="eyebrow">Часть 2 · Что со статусом после события</div><div data-m></div></div>';
      let oRev = null;
      if (ev && ev.full) { oRev = {}; (a.order || []).forEach((id, i) => { oRev[id] = LC_MAIN[i] === id ? 'ok' : 'bad'; }); }
      ui.order(TR.$('[data-o]', el), { items: LC_ITEMS, value: a.order, reveal: oRev, readonly: ctx.readonly, seed: 'mrw-life', onChange: v => { a.order = v; ctx.save(); } });
      const mRev = ev ? Object.fromEntries(ev.m.map(z => [z.s.id, { s: z.st, why: z.st === 'warn' ? z.why : z.st === 'bad' ? (z.got ? 'Не тот статус. Что именно произошло с требованием — его проверили, согласовали, вернули, отложили?' : 'Не выбрано.') : '' }])) : null;
      ui.match(TR.$('[data-m]', el), { rows: LC_SIT.map(s => ({ id: s.id, t: s.t })), choices: LC_CH, value: a.map, reveal: mRev, readonly: ctx.readonly, placeholder: 'Какой статус?', onChange: v => { a.map = v; ctx.save(); } });
    },
    check(ans) {
      const r = lifeEval(ans), notes = [];
      if (!r.full) notes.push({ ok: false, html: 'Порядок статусов не расставлен — подвиньте хотя бы один, чтобы он сохранился.' });
      else if (r.os === 1) notes.push({ ok: true, html: 'Основной путь верный: черновик → на ревью → согласовано → реализовано → проверено.' });
      else {
        const v = ans.order, p = id => v.indexOf(id);
        if (p('approved') < p('review')) notes.push({ ok: false, html: 'Согласовано раньше ревью: согласовывают то, что уже проверили, иначе подпись ставят под дефектами.' });
        if (p('verified') < p('impl')) notes.push({ ok: false, html: 'Проверено раньше реализовано: Лизе пока нечего проверять.' });
        if (p('impl') < p('approved')) notes.push({ ok: false, html: 'Реализовано раньше согласовано: Глеб пишет код по несогласованному — переделки почти гарантированы.' });
        if (notes.length === 0) notes.push({ ok: 'warn', html: 'Почти: пара соседних статусов переставлена.' });
      }
      r.m.filter(z => z.st !== 'ok').forEach(z => notes.push({ ok: z.st === 'warn' ? 'warn' : false, html: `«${esc(z.s.t)}» — ${z.st === 'warn' ? z.why : z.got ? 'не тот статус.' : 'не выбрано.'}` }));
      if (r.m.every(z => z.st === 'ok')) notes.push({ ok: true, html: 'Все восемь ситуаций разобраны верно.' });
      return {
        ok: r.score >= 0.8 && r.os >= 0.9, score: r.score, notes,
        summary: `Порядок: ${Math.round(r.os * 100)} %, ситуации: ${r.m.filter(z => z.st === 'ok').length} из ${LC_SIT.length}.`,
        mentor: r.score >= 0.8 ? null : 'Спросите себя о каждом событии: кто что сделал с требованием? Отправили — на ревью, вернули — черновик, подписали — согласовано, сделали — реализовано, проверили — проверено.'
      };
    },
    explain: `<p>Основной путь: <b>черновик → на ревью → согласовано → реализовано → проверено</b>. Боковые выходы — <b>отложено</b> (вернёмся) и <b>отклонено</b> (не будем делать, с причиной).</p>
      <ul class="checks">
        <li>Ревью с замечаниями возвращает требование в <b>черновик</b> — и поднимает минорную версию (0.2 → 0.3).</li>
        <li><b>Согласовано</b> — это базовая версия. С этого момента «поправить одно слово» нельзя: только запрос на изменение.</li>
        <li>Упавший тест не меняет статус требования: дефект — в коде, требование верное.</li>
        <li>Изменение реализованного требования — <b>новая версия через запрос на изменение</b>: регистрация, анализ влияния, оценка, согласование. Старая версия остаётся в истории — по ней работает то, что уже в проде.</li>
      </ul>
      <p>Названия статусов в командах разные (Draft, In review, Approved, Implemented, Verified; в Jira — свои), важно, чтобы каждый значил одно и то же для всех и был у каждого требования. Источник: Вигерс, гл. 27 «Управление требованиями», табл. «Статусы требований»; BABOK v3, 5.5 «Утверждение требований».</p>`,
    report: ans => { const r = lifeEval(ans); return `Порядок: ${((ans && ans.order) || []).map(id => STATES[id]).join(' → ') || '—'}\n` + r.m.map(z => `- ${z.s.t} → ${(LC_CH.find(c => c.v === ((ans && ans.map) || {})[z.s.id]) || { t: '—' }).t} ${z.st === 'ok' ? '✓' : z.st === 'warn' ? '≈' : '✗'}`).join('\n'); }
  };

  // =====================================================================
  // Практика 4. Лаборатория: анализ влияния CR-04 «шиномонтаж с хранением шин»
  // =====================================================================
  const IR = [
    { id: 'R1', rq: 'REQ-CT-01', t: 'Каталог услуг с ценой «от» (BR-5)', ln: 'US-02 · экран «Услуги» · service · TC-05', d: 1, imp: 'yes', why: 'Новая услуга «Хранение комплекта шин за сезон» с ценой и сроком.' },
    { id: 'R2', rq: 'REQ-BK-01', t: 'Поиск свободных слотов (BR-1)', ln: 'US-04 · экран «Выбор времени» · post, booking · TC-11…15', d: 3, imp: 'no', why: 'Длительность шиномонтажа уже считается по нормо-часам (BR-1): час — значит два слота. Хранение пост не занимает. Связь есть — изменения нет.' },
    { id: 'R3', rq: 'REQ-BK-05', t: 'Создание записи и выбор услуг', ln: 'US-05 · экран «Запись» · booking, booking_service · TC-16…20', d: 4, imp: 'yes', why: 'При записи на переобувку — «оставить шины на хранение» или «мои шины на складе, привезите к визиту».' },
    { id: 'R4', rq: 'REQ-WO-02', t: 'Оформление заказ-наряда при приёмке (АРМ)', ln: 'US-12 · АРМ «Приёмка» · work_order, work_item · TC-41…45', d: 5, imp: 'yes', why: 'Приёмка шин на хранение: комплект, размер, износ, фото, место на складе, акт.' },
    { id: 'R5', rq: 'REQ-PY-01', t: 'Онлайн-оплата после «Готов» (BR-10)', ln: 'US-30 · экран «Оплата» · payment · TC-60…64', d: 2, imp: 'yes', why: 'Хранение оплачивается за сезон при сдаче шин — не после «Готов». Нужно правило и сценарий оплаты.' },
    { id: 'R6', rq: 'REQ-NT-03', t: 'Напоминание о записи за сутки', ln: 'US-08 · push/SMS · booking · TC-40', d: 1, imp: 'opt', why: 'Полезно добавить напоминание «сезон — пора забрать шины», но можно и позже. Засчитывается в обе стороны.' },
    { id: 'R7', rq: 'REQ-BN-01', t: 'Начисление бонусов (BR-11)', ln: 'US-35 · экран «Бонусы» · bonus_tx · TC-70…72', d: 1, imp: 'yes', why: 'BR-11: 5 % от работ, не от запчастей. Хранение — ни то ни другое. Начислять ли бонусы — решение Кирилла, правило надо дописать.' },
    { id: 'R8', rq: 'REQ-EX-01', t: 'Согласование доп. работ (BR-6…BR-8)', ln: 'US-20 · экран «Предложение» · extra_offer · TC-75…80', d: 4, imp: 'no', why: 'Хранение шин не порождает доп. работ. Если при приёмке увидели грыжу на шине — это уже существующий сценарий доп. работ.' },
    { id: 'R9', rq: 'REQ-PT-01', t: 'Резерв запчастей при записи на ТО (BR-12)', ln: 'US-25 · 1С · part · TC-50…53', d: 3, imp: 'no', why: 'Шины клиента — не запчасти «Искры» и не товар в 1С. Их нельзя учитывать как остатки склада — это отдельный учёт.' },
    { id: 'R10', rq: 'REQ-RD-01', t: 'Выдача и хранение машины после «Готов» (BR-13)', ln: 'US-14 · АРМ «Выдача» · work_order · TC-55', d: 2, imp: 'no', why: 'Это хранение машины, а не шин: правило BR-13 не меняется. Но в глоссарии нужно развести два «хранения», чтобы не путать.' },
    { id: 'R11', rq: 'REQ-CL-02', t: 'Карточка клиента и история обслуживания', ln: 'US-09 · экран «Мой гараж» · client, car · TC-30', d: 4, imp: 'yes', why: 'Блок «Мои шины»: что хранится, где, до какого числа, сколько стоит продление.' }
  ];
  const NEWS = [
    { id: 'n1', t: 'Новая таблица tire_storage: комплект, размер, станция, место, срок, статус', d: 2, ok: true, why: 'Хранения шин нет в модели данных — без новой сущности его не учесть.' },
    { id: 'n2', t: 'Статусная модель хранения: принят → на хранении → выдан; не забран в срок', d: 2, ok: true, why: 'У хранения своя жизнь, и «не забрали в срок» — важное исключение.' },
    { id: 'n3', t: 'Новое бизнес-правило BR-17: цена, срок хранения, что делаем с невостребованными шинами', d: 1, ok: true, why: 'Правила нет — его даст Тимур Рашидович, а юридическую часть проверит Ольга Викторовна.' },
    { id: 'n4', t: 'Акт приёма шин на хранение для клиента (ответственность «Искры» за сохранность)', d: 1, ok: true, why: 'Шины клиента — его имущество: нужен документ о приёме, состоянии и сроке.' },
    { id: 'n5', t: 'Новые тест-кейсы на хранение и регресс записи и оплаты', d: 3, ok: true, why: 'Новое поведение нужно проверить, а затронутое — перепроверить.' },
    { id: 'n6', t: 'Интеграция с 1С для учёта шин клиентов как товара на складе', d: 6, ok: false, why: 'Шины клиента — не товар «Искры». Ставить их в 1С как остатки — путать бухгалтерию Ольги Викторовны.' },
    { id: 'n7', t: 'Отдельное мобильное приложение для кладовщика склада шин', d: 15, ok: false, why: 'Избыточно: приёмка и выдача шин укладываются в АРМ мастера-приёмщика.' },
    { id: 'n8', t: 'Перевести сетку записи с 30 на 60 минут из-за шиномонтажа', d: 4, ok: false, why: 'Не нужно: BR-1 уже округляет длительность до 30 минут по нормо-часам. Шиномонтаж займёт два слота.' }
  ];
  const DEC = [
    { v: 'all', t: 'Всё целиком — в MVP к 15 марта: и АРМ, и приложение' },
    { v: 'split', t: 'Разделить: в MVP — минимум в АРМ мастера (приём шин, акт, место, оплата в кассе станции); в приложении — «Мои шины» и запись со своими шинами в версии 1.1 в мае' },
    { v: 'later', t: 'Отказать до осени: после сезона спокойно сделаем всё целиком' },
    { v: 'silent', t: 'Взять в MVP молча: базовую версию и срок не пересогласовывать, команда как-нибудь успеет' }
  ];
  const MIN_DAYS = 8;
  function impactEval(a) {
    a = a || {};
    const rows = a.rows || [], news = a.news || [];
    const need = IR.filter(r => r.imp === 'yes');
    const tp = need.filter(r => rows.includes(r.id)).length;
    const fpR = IR.filter(r => r.imp === 'no' && rows.includes(r.id));
    const missR = need.filter(r => !rows.includes(r.id));
    const sA = Math.max(0, Math.min(1, (tp - 0.5 * fpR.length) / need.length));
    const okN = NEWS.filter(n => n.ok), goodN = okN.filter(n => news.includes(n.id)).length, badN = NEWS.filter(n => !n.ok && news.includes(n.id));
    const sB = Math.max(0, Math.min(1, (goodN - badN.length) / okN.length));
    const days = IR.filter(r => rows.includes(r.id)).reduce((s, r) => s + r.d, 0) + NEWS.filter(n => news.includes(n.id)).reduce((s, n) => s + n.d, 0);
    const realDays = IR.filter(r => r.imp !== 'no').reduce((s, r) => s + r.d, 0) + okN.reduce((s, n) => s + n.d, 0);
    const hidden = missR.reduce((s, r) => s + r.d, 0) + okN.filter(n => !news.includes(n.id)).reduce((s, n) => s + n.d, 0);
    const sC = a.dec === 'split' ? 1 : a.dec === 'later' ? 0.5 : 0;
    return { rows, news, tp, need, fpR, missR, sA, goodN, okN, badN, sB, days, realDays, hidden, sC, score: Math.round((0.4 * sA + 0.2 * sB + 0.4 * sC) * 1000) / 1000 };
  }
  const impactTask = {
    id: 'impact', title: 'Лаборатория: анализ влияния CR-04 «шиномонтаж с хранением шин»',
    simple: howChange.simple,
    lead: ui.brief({
      situation: 'CR-04 от Тимура Рашидовича: «Клиент приезжает на переобувку и оставляет второй комплект шин у нас до следующего сезона. Хранение за сезон — платно. В приложении клиент видит, где его шины, и записывается на переобувку со своими шинами со склада. К сезону!» Базовая версия 1.0 согласована, до MVP — 15 марта, резерв MVP на изменения — 8 дней. День работы команды по договору — 45 000 ₽.',
      todo: [
        'Шаг 1. Пройдите по матрице трассировки и отметьте требования, которые CR-04 действительно меняет. Связь — ещё не изменение.',
        'Шаг 2. Отметьте то, чего в матрице нет и что придётся создать заново. Лишнее раздувает оценку.',
        'Шаг 3. Нажмите «Посчитать влияние», выберите решение для Тимура и посмотрите, что случилось в марте и апреле.',
        'Нажмите «Проверить». Засчитывается от 80 %, если решение реалистично: затронутое — 40 %, новое — 20 %, решение — 40 %.'
      ],
      lookTitle: 'Подсказка',
      look: 'Для каждой строки спросите: «Если сделать CR-04 и не трогать это требование — что-то сломается или будет неправдой?» Помните про весну: в апреле клиенты сдают на хранение зимние шины — ценность изменения именно сейчас.'
    }),
    blank: () => ({ rows: [], news: [], ran: false, dec: '' }),
    reference: () => ({ rows: IR.filter(r => r.imp === 'yes').map(r => r.id), news: NEWS.filter(n => n.ok).map(n => n.id), ran: true, dec: 'split' }),
    render(el, ctx) {
      el.classList.add('mrw-root');
      const a = ctx.ans; a.rows = a.rows || []; a.news = a.news || [];
      const ev = ctx.result ? impactEval(a) : null;
      el.innerHTML = `<div class="stack">
        <div class="eyebrow">Шаг 1 · Матрица трассировки: что CR-04 меняет</div>
        <div class="mrw-imp" data-r></div>
        <div class="eyebrow">Шаг 2 · Что появится нового</div>
        <div class="mrw-imp" data-n></div>
        <div data-run></div><div data-out></div>
      </div>`;
      function rowCls(r) { if (!ev || !a.rows.includes(r.id)) return ctx.readonly && r.imp === 'yes' ? 'ok' : ''; return r.imp === 'no' ? 'bad' : 'ok'; }
      function draw() {
        TR.$('[data-r]', el).innerHTML = `<div class="mrw-ir hdr"><span></span><span>Требование</span><span>Связи: история · экран · данные · тесты</span><span style="text-align:right">дни</span></div>` + IR.map(r => {
          const on = a.rows.includes(r.id), show = (ev && (on || r.imp === 'yes')) || (ctx.readonly);
          return `<button type="button" class="mrw-ir ${rowCls(r)}" data-ir="${r.id}" aria-pressed="${on}" ${ctx.readonly ? 'disabled' : ''}><span class="box" aria-hidden="true"></span><span><span class="id">${esc(r.rq)}</span>${esc(r.t)}</span><span class="ln">${esc(r.ln)}</span><span class="d">${r.d} д</span>${show && (on || ctx.readonly) ? `<span class="why">${r.imp === 'yes' ? '✓ ' : r.imp === 'opt' ? '≈ ' : '✗ '}${esc(r.why)}</span>` : ''}</button>`;
        }).join('');
        TR.$('[data-n]', el).innerHTML = NEWS.map(n => {
          const on = a.news.includes(n.id), cls = ev && on ? (n.ok ? 'ok' : 'bad') : ctx.readonly && n.ok ? 'ok' : '';
          return `<button type="button" class="mrw-ir ${cls}" data-nw="${n.id}" aria-pressed="${on}" ${ctx.readonly ? 'disabled' : ''}><span class="box" aria-hidden="true"></span><span>${esc(n.t)}</span><span class="ln"></span><span class="d">${n.d} д</span>${(ev && on) || (ctx.readonly && n.ok) ? `<span class="why">${n.ok ? '✓ ' : '✗ '}${esc(n.why)}</span>` : ''}</button>`;
        }).join('');
        const r = impactEval(a);
        TR.$('[data-run]', el).innerHTML = ctx.readonly ? '' : `<div class="row"><button type="button" class="btn primary" data-go ${a.rows.length ? '' : 'disabled'}>${a.ran ? '⟲ Пересчитать влияние' : '▶ Посчитать влияние'}</button><span class="small dim">Отмечено: ${a.rows.length} требований, ${a.news.length} новых элементов · ${r.days} дн.</span></div>`;
        const out = TR.$('[data-out]', el);
        if (!a.ran) { out.innerHTML = ''; return; }
        const full = r.days, min = MIN_DAYS;
        let h = `<div class="stack"><div class="mrw-stats">
            <div class="stat"><span class="k">Ваша оценка целиком</span><span class="v">${full} дн.</span><span class="s">≈ ${rub(full * DAY_RATE)}</span></div>
            <div class="stat"><span class="k">Минимум в АРМ</span><span class="v">${min} дн.</span><span class="s">≈ ${rub(min * DAY_RATE)} · оценка Глеба</span></div>
            <div class="stat"><span class="k">Резерв MVP</span><span class="v">${MVP_SLACK} дн.</span><span class="s">до 15 марта</span></div>
          </div>
          ${ui.say('gleb', r.hidden > 0 ? `По твоей матрице — ${full} дней. Но я бы проверил ещё раз: мне кажется, что-то не учтено.` : r.fpR.length || r.badN.length ? `${full} дней? Половина из этого — то, что CR-04 не трогает. Так мы Тимура напугаем зря.` : `${full} дней — похоже на правду. Целиком в MVP не влезает, минимум в АРМ — ровно в резерв.`)}
          <div class="eyebrow">Что предлагаем Тимуру Рашидовичу</div>
          <div class="stack tight">${DEC.map(d => `<button type="button" class="btn mrw-opt" data-dec="${d.v}" aria-pressed="${a.dec === d.v}" ${ctx.readonly ? 'disabled' : ''}>${esc(d.t)}</button>`).join('')}</div>`;
        if (a.dec) {
          const slip = Math.max(0, r.realDays - MVP_SLACK), hid = r.hidden;
          const T = {
            all: [['bad', 'Декабрь', `Тимур согласен: «всё и сразу». План MVP растёт на ${r.realDays} дней при резерве ${MVP_SLACK}.`], ['bad', '15 марта', `MVP не готов: сдвиг примерно на ${Math.ceil(slip / 5)} недели. Пилот на Победы — без записи и оплаты.`], ['bad', 'Апрель', 'Сезон начинается без онлайн-записи. Потерянные звонки — те же 21 %. Хранение шин есть, а записаться на переобувку онлайн нельзя.']],
            split: [['ok', 'Декабрь', `CR-04 согласован двумя частями, требования — версия 1.1. Минимум (${MIN_DAYS} дней) — из резерва MVP, остальное — версия 1.1 в мае. ${hid ? `Но в анализе пропущено ~${hid} дн. работы — всплывёт в феврале.` : ''}`], [hid ? 'warn' : 'ok', 'Февраль', hid ? `Лиза находит незаложенное: ${r.missR.map(x => x.rq).join(', ') || 'новые элементы'}. +${hid} дн. — часть уходит в май, но нервы потрачены.` : 'Лиза гоняет тесты хранения в АРМ — всё по плану, регресс записи и оплаты зелёный.'], ['ok', 'Апрель', 'Первый день сезона: онлайн-запись работает, у стойки мастера принимают зимние шины на хранение через АРМ. Тимур Рашидович доволен: «конкуренты с Танкодрома нам не страшны».']],
            later: [['ok', 'Декабрь', 'MVP не трогаем — срок 15 марта в безопасности.'], ['warn', 'Апрель', 'Весной клиенты сдают зимние шины на хранение — и везут их на Танкодром, к конкурентам. «Искра» теряет волну спроса.'], ['warn', 'Осень', 'Хранение готово к осенней переобувке. Работает, но половина ценности изменения упущена.']],
            silent: [['bad', 'Декабрь', 'Изменение «втихую» встраивают в спринты. Базовая версия не обновлена — Лиза тестирует по 1.0 и заводит дефекты на правильное поведение.'], ['bad', 'Февраль', `Команда не успевает: ${r.realDays} дней не помещаются в резерв ${MVP_SLACK}. Артём узнаёт об этом за три недели до срока.`], ['bad', '15 марта', 'MVP сорван или выпущен с дырами. Доверие Тимура к «Орбите» — главная потеря.']]
          }[a.dec];
          h += `<div class="mrw-tl">${T.map(x => `<div class="mrw-ev ${x[0]}"><span class="d">${esc(x[1])}</span><div class="small">${x[2]}</div></div>`).join('')}</div>`;
        }
        h += '</div>';
        out.innerHTML = h;
      }
      draw();
      TR.on(el, 'click', '[data-ir]', (e, b) => { if (ctx.readonly) return; const id = b.dataset.ir; a.rows = a.rows.includes(id) ? a.rows.filter(x => x !== id) : a.rows.concat(id); a.ran = false; ctx.save(); draw(); });
      TR.on(el, 'click', '[data-nw]', (e, b) => { if (ctx.readonly) return; const id = b.dataset.nw; a.news = a.news.includes(id) ? a.news.filter(x => x !== id) : a.news.concat(id); a.ran = false; ctx.save(); draw(); });
      TR.on(el, 'click', '[data-go]', () => { if (ctx.readonly) return; a.ran = true; ctx.save(); draw(); });
      TR.on(el, 'click', '[data-dec]', (e, b) => { if (ctx.readonly) return; a.dec = b.dataset.dec; ctx.save(); ctx.decide('Решение по CR-04', DEC.find(d => d.v === a.dec).t); draw(); });
    },
    check(ans) {
      const r = impactEval(ans), notes = [];
      notes.push({ ok: r.tp === r.need.length && !r.fpR.length ? true : r.sA >= 0.6 ? 'warn' : false, html: `Затронутые требования: ${r.tp} из ${r.need.length}${r.fpR.length ? `, лишних — ${r.fpR.length}` : ''}.` });
      r.missR.forEach(x => notes.push({ ok: false, html: `Пропущено ${esc(x.rq)} «${esc(x.t)}»: ${esc(x.why)}` }));
      r.fpR.forEach(x => notes.push({ ok: 'warn', html: `${esc(x.rq)} «${esc(x.t)}» — ${esc(x.why)}` }));
      notes.push({ ok: r.goodN === r.okN.length && !r.badN.length ? true : r.sB >= 0.6 ? 'warn' : false, html: `Новые элементы: ${r.goodN} из ${r.okN.length}${r.badN.length ? `, лишних — ${r.badN.length}` : ''}.` });
      r.badN.forEach(x => notes.push({ ok: false, html: `«${esc(x.t)}» — ${esc(x.why)}` }));
      if (!(ans && ans.ran)) notes.push({ ok: 'warn', html: 'Влияние не посчитано — нажмите «Посчитать влияние».' });
      const D = { split: { ok: true, html: 'Решение: разделить. Минимум в АРМ — из резерва MVP, ценность весной сохранена, остальное — в версии 1.1.' }, later: { ok: 'warn', html: 'Решение: отложить до осени. Срок MVP в безопасности, но весенняя волна хранения уходит к конкурентам. Можно лучше — разделить.' }, all: { ok: false, html: 'Решение: всё в MVP. ≈ 27 дней при резерве 8 — MVP сдвигается, сезон без онлайн-записи. Это проигрыш главной цели ради второстепенной.' }, silent: { ok: false, html: 'Решение: молча. Без пересогласования базовой версии и срока изменение разрушает план и доверие. Так делать нельзя никогда.' } };
      notes.push(D[ans && ans.dec] || { ok: false, html: 'Решение для Тимура не выбрано.' });
      const ok = r.score >= 0.8 && ans.dec === 'split';
      return {
        ok, score: r.score, notes,
        summary: `Затронуто: ${r.tp}/${r.need.length}, новое: ${r.goodN}/${r.okN.length}, решение: ${(DEC.find(d => d.v === (ans && ans.dec)) || { t: '—' }).t.split(':')[0]}.`,
        mentor: ok ? null : ans && (ans.dec === 'all' || ans.dec === 'silent') ? 'Что важнее для «Искры» 1 апреля — онлайн-запись или хранение шин в приложении? А можно ли дать хранение весной, не трогая срок MVP?' : 'Пройдите по каждой строке матрицы: если сделать CR-04 и не трогать это требование, станет ли оно неправдой? И помните: связь ещё не значит изменение.'
      };
    },
    explain: `<p>CR-04 меняет <b>6 требований</b>: каталог (новая услуга), создание записи (шины со склада), приёмку в АРМ (акт, место, фото), оплату (за сезон при сдаче, а не после «Готов»), бонусы (хранение — ни работа, ни запчасть: нужно решение Кирилла) и карточку клиента («Мои шины»). Напоминание — по желанию.</p>
      <p>Не меняет — хотя связь или слово рядом: поиск слотов (BR-1 уже считает длительность по нормо-часам), доп. работы, резерв запчастей (шины клиента — не товар 1С), хранение машины (BR-13 — про машину; разведите термины в глоссарии).</p>
      <p>Новое: таблица tire_storage, статусная модель хранения, правило BR-17 (цена, срок, невостребованные шины), акт приёма для клиента, тесты и регресс. Итог — около <b>27 дней ≈ 1,2 млн ₽</b> целиком против резерва 8 дней.</p>
      <p>Лучшее решение — <b>разделить</b>: весной в АРМ (8 дней, из резерва MVP, срок 15 марта не двигается), в приложении — в версии 1.1 в мае. Заказчик получает ценность в сезон, команда — реалистичный план, требования — новую базовую версию 1.1. Источники: Вигерс, гл. 28 «Управление изменениями», гл. 29 «Связи в цепочке требований»; BABOK v3, 6.4 «Оценка изменений требований».</p>`,
    refNote: 'Напоминание (REQ-NT-03) засчитывается и отмеченным, и неотмеченным. Решение «отложить до осени» — половина балла.',
    report: ans => { const r = impactEval(ans); return `- Затронуто: ${r.rows.map(id => IR.find(x => x.id === id).rq).join(', ') || '—'} (${r.tp}/${r.need.length})\n- Новое: ${r.news.map(id => NEWS.find(x => x.id === id).t.split(':')[0]).join('; ') || '—'}\n- Оценка: ${r.days} дн.\n- Решение: ${(DEC.find(d => d.v === (ans && ans.dec)) || { t: '—' }).t}`; }
  };

  // =====================================================================
  // Практика 5. Письмо Тимуру: согласование CR-04
  // =====================================================================
  const L_RUBRIC = [
    'Признаёт ценность идеи и её срочность: весной клиенты сдают зимние шины на хранение, конкуренты уже это делают',
    'Говорит, что изменение затрагивает: каталог, запись, приёмку, оплату, бонусы, карточку клиента — и требует новых правил (цена, срок, невостребованные шины)',
    'Даёт цифры: целиком около 27 дней (≈ 1,2 млн ₽) и сдвиг MVP; минимальный вариант в АРМ — 8 дней (≈ 360 000 ₽) из резерва, срок 15 марта не меняется',
    'Предлагает конкретный вариант: к сезону — приём шин на хранение через АРМ мастера, в приложении — в версии 1.1 в мае',
    'Просит решение и данные от «Искры»: согласовать CR-04, цену и срок хранения, правила для невостребованных шин (с Ольгой Викторовной), — и фиксирует новую версию требований'
  ];
  const L_REF = 'Тимур Рашидович, добрый день! Хранение шин — хорошая идея и вовремя: в апреле клиенты как раз сдают зимние шины, а на Танкодроме это уже предлагают. Мы разобрали, что изменение заденет: каталог услуг, запись на переобувку, приёмку у стойки, оплату (хранение платят при сдаче, а не после ремонта), бонусы и карточку клиента в приложении. Плюс нужны новые правила: сколько стоит хранение, на какой срок и что делаем, если шины не забрали. Если делать всё сразу, это около 27 дней работы команды, примерно 1,2 млн ₽, и MVP сдвинется на 3–4 недели — сезон начнётся без онлайн-записи. Предлагаем разделить. К 15 марта делаем минимум в программе мастера: приём шин на хранение, акт для клиента, место на складе, оплата в кассе станции. Это 8 дней, около 360 000 ₽, укладывается в резерв MVP, срок не меняется. «Мои шины» в приложении и запись на переобувку со своими шинами — в версии 1.1 в мае. Чтобы начать, нам нужно ваше согласие на этот вариант до пятницы, цена и срок хранения, и правила для невостребованных шин — их хорошо бы проверить с Ольгой Викторовной. После согласования выпустим версию требований 1.1 и пришлём её вам.';
  const letterTask = {
    id: 'letter', title: 'Письмо Тимуру: согласуйте изменение со сроками и ценой',
    simple: {
      icon: '✉️',
      plain: 'Заказчику не нужно слово «анализ влияния». Ему нужно: что изменится, сколько стоит, что сдвигается, какие есть варианты и какое решение нужно от него.',
      analogy: 'Прораб пишет хозяину: «Тёплый пол на кухне — можно. Целиком — +2 недели и 80 000 ₽, переезд сдвигается. Можно только у мойки — +3 дня, в срок. Что выбираете до пятницы?»',
      tech: 'Коммуникация решения по запросу на изменение: суть, влияние, оценка, варианты с последствиями, рекомендация, запрос решения, следующий шаг (новая базовая версия). Вигерс, гл. 28; BABOK v3, 5.4 «Оценка изменений требований» и 10.43 «Управление ожиданиями заинтересованных лиц».'
    },
    lead: ui.brief({
      situation: 'Артём: «Анализ влияния у тебя есть. Теперь письмо Тимуру Рашидовичу — от нас, но твоими словами. Он прочитает с телефона между станциями. Чтобы он понял, что мы не отказываем, а предлагаем, — и сразу ответил».',
      todo: [
        'Напишите письмо, от 300 символов: что затрагивает изменение, сколько стоит целиком и минимально, что с MVP, что предлагаете и какое решение нужно.',
        'Без терминов «матрица трассировки», «базовая версия», «CR» — или с расшифровкой.',
        'Нажмите «Проверить с Верой (Claude)» или «Сверить с эталоном самому» и отметьте раскрытые пункты. Засчитывается от 60 %.'
      ],
      lookTitle: 'На что опереться',
      look: 'Целиком ≈ 27 дней ≈ 1,2 млн ₽, MVP сдвигается на 3–4 недели. Минимум в АРМ — 8 дней ≈ 360 000 ₽, из резерва, срок 15 марта не меняется. Приложение — версия 1.1 в мае. Нужны: согласие, цена и срок хранения, правила для невостребованных шин.'
    }),
    blank: () => ({ j: {} }),
    reference: () => ({ j: { text: L_REF, self: L_RUBRIC.map(() => true) } }),
    render(el, ctx) {
      el.classList.add('mrw-root');
      el.insertAdjacentHTML('beforeend', ui.say('timur', 'Хочу шиномонтаж с хранением шин, как у конкурентов на Танкодроме. И в приложении. К сезону.'));
      const j = document.createElement('div'); j.style.marginTop = '12px'; el.appendChild(j);
      ui.justify(j, {
        id: 'mrw-letter', q: 'Письмо Тимуру Рашидовичу о запросе «шиномонтаж с хранением шин»',
        qPlain: 'Напишите владельцу сети автосервисов письмо-согласование его запроса на изменение «шиномонтаж с сезонным хранением шин»: что изменение затрагивает, сколько стоит целиком (около 27 дней, 1,2 млн ₽, сдвиг MVP) и в минимальном варианте (8 дней, 360 000 ₽, в срок 15 марта), какой вариант вы рекомендуете и какое решение и данные нужны от заказчика.',
        rubric: L_RUBRIC, reference: L_REF, value: ctx.ans.j, readonly: ctx.readonly, minLen: 300,
        placeholder: 'Тимур Рашидович, добрый день! …',
        onChange: v => { ctx.ans.j = v; ctx.save(); ctx.decide('Письмо Тимуру по CR-04', v.text || ''); }
      });
    },
    check(ans) {
      const s = ui.justifyScore(ans && ans.j);
      return {
        ok: s >= 0.6, score: s,
        summary: s ? `Оценка письма: ${Math.round(s * 100)} %.` : 'Напишите письмо (от 300 символов) и проверьте его с Верой или сверьте с эталоном сами.',
        notes: s && s < 0.6 ? [{ ok: false, html: 'В письме заказчику должны быть числа (дни, деньги, срок MVP), варианты и прямой вопрос «что выбираете до пятницы». Иначе ответа не будет, а изменение «поедет» само.' }] : []
      };
    },
    explain: '<p>Хорошее письмо по изменению — это <b>решение, которое осталось принять</b>, а не отчёт о работе. Структура: ценность идеи → что затрагивает (без жаргона) → два варианта с цифрами и последствиями → рекомендация → какое решение и какие данные нужны и к какому сроку → что будет дальше (новая версия требований).</p><p>Заказчик, который видит цену «всё сразу» и разумную альтернативу, почти всегда выбирает альтернативу сам. А решение и его автор записываются в историю CR-04 — через месяц спор «мы так не договаривались» закрывается одной ссылкой. В пятницу — работа с бизнесом: интервью с Тимуром Рашидовичем и Мариной Олеговной на станции Победы.</p>',
    report: ans => (ans && ans.j && ans.j.text) ? ans.j.text : '—'
  };

  // =====================================================================
  TR.stage({
    id: ID,
    when: 'среда, 2 декабря, 10:00 · запрос на изменение: шиномонтаж и хранение шин',
    intro: [
      { who: 'timur', html: 'Конкуренты на Танкодроме сделали хранение шин. Хочу у нас: шиномонтаж с хранением, и чтобы в приложении было видно. К сезону.' },
      { who: 'artem', html: 'Раздел «Запись и заказ-наряд» мы согласовали в понедельник, версия 1.0. До MVP три с половиной месяца, резерв на изменения — 8 дней. Мне не нужно «да» или «нет» — мне нужно, что это заденет и сколько стоит. До пятницы.' },
      { who: 'vera', html: 'Это нормальная жизнь требований: их выясняют, проверяют, согласуют — и меняют. Сегодня наведём порядок в черновике, найдём противоречия, разберёмся со статусами — и по матрице трассировки посчитаем, что заденет хранение шин. А письмо Тимуру напишете вы.' },
      { who: 'liza', html: 'Только, пожалуйста, с номерами требований. Мне надо знать, какие тесты перепроверять.' }
    ],
    facts: ['F-slot', 'F-cutoff', 'F-cancel', 'F-bonus', 'F-parts', 'F-ready', 'F-retention', 'F-deadline'],
    glossary: [
      { term: 'Управление требованиями', simple: 'Всё, что происходит с требованием после того, как его записали: версии, статусы, связи, изменения.', tech: 'Requirements management: базовая версия, контроль изменений, трассировка, версии и статусы (Вигерс, ч. III; BABOK v3, гл. 5).' },
      { term: 'Верификация и валидация', simple: 'Верификация — «правильно ли записали?», валидация — «то ли нужно?».', tech: 'Verification — проверка соответствия требований стандартам качества (однозначность, полнота…); validation — проверка, что требования отвечают реальной потребности (ревью с бизнесом, прототипы).' },
      { term: 'Базовая версия (baseline)', simple: 'Согласованный снимок требований, от которого считают изменения.', tech: 'Набор требований, утверждённый на определённый момент. Изменения после него — только через контроль изменений.' },
      { term: 'Атрибуты требования', simple: 'Паспорт требования: номер, источник, приоритет, статус, версия.', tech: 'ID, название, описание, источник, приоритет, статус, версия, ответственный, критерии приёмки, связи (Вигерс, гл. 27).' },
      { term: 'Статус требования', simple: 'Где требование в жизни: черновик, на ревью, согласовано, реализовано, проверено.', tech: 'Состояние в жизненном цикле; боковые — «Отложено» и «Отклонено». Набор статусов фиксируется в процессе команды.' },
      { term: 'Запрос на изменение (CR)', simple: 'Официальная просьба что-то поменять в согласованном.', tech: 'Change request: суть, причина, автор; проходит регистрацию, анализ влияния, оценку, решение и даёт новую версию требований.' },
      { term: 'Анализ влияния', simple: 'Выяснить, что заденет изменение и сколько это стоит.', tech: 'Impact analysis: по трассировке найти затронутые требования, истории, экраны, данные, тесты; определить новое; оценить трудозатраты и риски (Вигерс, гл. 28).' },
      { term: 'Матрица трассировки', simple: 'Таблица связей: требование — история — экран — данные — тест.', tech: 'Traceability matrix. Прямая трассировка — от цели к реализации, обратная — от реализации к требованию. Используется для анализа влияния и поиска «сирот».' },
      { term: 'Ревью требований', simple: 'Проверка требований другими людьми до разработки.', tech: 'Самопроверка, коллегиальное ревью, пошаговый разбор, инспекция (Вигерс, гл. 17). Самый дешёвый способ найти дефект.' },
      { term: 'Атомарность', simple: 'Одно требование — одна мысль.', tech: 'Singular (ISO/IEC/IEEE 29148): требование описывает одну возможность или ограничение — чтобы у него был один статус, приоритет и тест.' }
    ],
    outro: 'Черновик «Отмена и перенос» вычищен, четыре противоречия с бизнес-правилами найдены, статусы значат одно и то же для всех. По матрице трассировки CR-04 разобран: шесть затронутых требований, пять новых элементов, около 27 дней целиком — и вариант «минимум в АРМ к сезону, приложение в мае», который не двигает 15 марта. Письмо у Тимура Рашидовича. В пятницу — на станцию Победы: интервью с владельцем и приёмкой, и блокнот наконец пополнится фактами из первых рук.',
    tasks: [howProcess, howQuality, howChange, ambigTask, conflictTask, lifeTask, impactTask, letterTask]
  });
})();
