/* Модуль 4, занятие 4: Data Dictionary (словарь данных) и описание таблиц.
   Теория: how-why — зачем словарь и кто им пользуется (роли и их вопросы), паспорт таблицы «было / стало» на booking,
   живой словарь из TR.db.SCHEMA с DDL; how-field — анатомия описания поля (14 атрибутов на booking.status, что будет,
   если пропустить), живая проверка ограничений в учебной базе (CHECK, NOT NULL, UNIQUE, FOREIGN KEY, откат) и правило,
   которое записали только на словах (end_at раньше start_at); how-names — соглашения об именовании «было / стало»,
   персональные данные и сроки хранения (BR-15, BR-16), версии словаря и что ломает совместимость.
   Практика: заполнить словарь для booking (тип, ключ, NULL, перечисление, значение по умолчанию); найти ошибки в
   чужом словаре таблицы payment; статусы Марины → перечисление work_order.status + способ хранения + живой CHECK;
   отметить ПДн и связать правила полей с BR-*; описать поле booking.start_at своими словами. */
'use strict';
(function () {
  const TR = window.TR, ui = TR.ui, esc = TR.esc;
  const ID = 'm4-dict';

  if (!document.getElementById('mdic-css')) document.head.insertAdjacentHTML('beforeend', `<style id="mdic-css">
    .mdic-root, .mdic-root .stack > *, .mdic-root .card > * { min-width: 0; }
    .mdic-root .seg button { white-space: normal; }
    .mdic-roles { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 6px; }
    .mdic-role { text-align: left; border: 1px solid var(--border-strong); border-radius: 10px; padding: 8px 10px; background: var(--surface-2); color: var(--text); display: grid; gap: 2px; min-width: 0; }
    .mdic-role b { font-size: 13.5px; }
    .mdic-role span { font-size: 12px; color: var(--text-2); line-height: 1.3; }
    .mdic-role[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); box-shadow: 0 0 0 1px var(--accent) inset; }
    .mdic-def { display: grid; grid-template-columns: 170px minmax(0, 1fr); gap: 6px 14px; font-size: 14px; }
    .mdic-def > .k { font: 600 11px/1.6 var(--f-mono); letter-spacing: .05em; text-transform: uppercase; color: var(--text-muted); }
    .mdic-def > .v { min-width: 0; }
    .mdic-ba { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
    .mdic-ba .bad-t { border-left: 3px solid var(--bad); padding-left: 10px; }
    .mdic-ba .ok-t { border-left: 3px solid var(--ok); padding-left: 10px; }
    .mdic-attrs { display: flex; flex-wrap: wrap; gap: 6px; }
    .mdic-wrap { overflow-x: auto; border: 1px solid var(--border); border-radius: 12px; }
    .mdic-dict { border-collapse: collapse; width: 100%; min-width: 760px; font-size: 12.5px; }
    .mdic-dict th, .mdic-dict td { border-bottom: 1px solid var(--border); padding: 6px 8px; text-align: left; vertical-align: top; }
    .mdic-dict th { font: 600 10.5px/1.3 var(--f-mono); color: var(--text-muted); text-transform: uppercase; letter-spacing: .03em; background: var(--surface-2); position: sticky; top: 0; }
    .mdic-dict td.m { font-family: var(--f-mono); white-space: nowrap; }
    .mdic-dict .pd { color: var(--warn); font-weight: 700; }
    .mdic-ed { display: grid; gap: 6px; }
    .mdic-er { display: grid; grid-template-columns: minmax(0, 1.3fr) 112px 128px 64px 84px minmax(0, 1fr); gap: 8px; align-items: center; border: 1px solid var(--border); border-radius: 10px; padding: 6px 8px; background: var(--surface-2); }
    .mdic-er.hd { background: none; border-color: transparent; font: 600 10.5px/1.3 var(--f-mono); color: var(--text-muted); text-transform: uppercase; padding-top: 0; padding-bottom: 0; }
    .mdic-er.ok { border-color: var(--ok); }
    .mdic-er.warn { border-color: var(--warn); }
    .mdic-er.bad { border-color: var(--bad); }
    .mdic-er .nm code { font-size: 12.5px; }
    .mdic-er .nm small { display: block; font-size: 12px; color: var(--text-2); }
    .mdic-er select, .mdic-er input[type="text"] { padding: 5px 6px; font-size: 12.5px; }
    .mdic-er label { display: inline-flex; gap: 5px; align-items: center; font-size: 12.5px; color: var(--text-2); }
    .mdic-er .why { grid-column: 1 / -1; font-size: 13px; color: var(--text-2); }
    .mdic-er .lb { display: none; font: 600 10px/1 var(--f-mono); color: var(--text-muted); text-transform: uppercase; }
    .mdic-spec { border: 1px solid var(--border-strong); border-radius: 12px; background: var(--surface); overflow: hidden; }
    .mdic-spec .hd { padding: 9px 14px; border-bottom: 1px solid var(--border); background: var(--surface-2); font-size: 13px; color: var(--text-2); }
    .mdic-spec .bd { padding: 8px; display: grid; gap: 4px; }
    .mdic-sn { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, .9fr) 72px minmax(0, 1.1fr) minmax(0, 1.6fr); gap: 8px; text-align: left; border: 1px solid transparent; border-radius: 8px; padding: 6px 8px; background: none; color: var(--text); font-size: 13px; line-height: 1.4; width: 100%; }
    .mdic-sn .m { font-family: var(--f-mono); font-size: 12px; overflow-wrap: anywhere; }
    .mdic-sn:hover:not(:disabled) { background: var(--surface-2); }
    .mdic-sn[aria-pressed="true"] { background: color-mix(in srgb, var(--warn) 20%, transparent); border-color: var(--warn); }
    .mdic-sn.ok { background: color-mix(in srgb, var(--ok) 16%, transparent); border-color: var(--ok); }
    .mdic-sn.bad { background: color-mix(in srgb, var(--bad) 14%, transparent); border-color: var(--bad); }
    .mdic-sn.warn { border-color: var(--warn); }
    .mdic-sn.miss { border: 1px dashed var(--bad); }
    .mdic-sn.th { font: 600 10.5px/1.3 var(--f-mono); color: var(--text-muted); text-transform: uppercase; pointer-events: none; }
    .mdic-found { display: grid; gap: 6px; }
    .mdic-found .it { display: grid; grid-template-columns: minmax(0, 1fr) 210px; gap: 8px; align-items: center; border: 1px solid var(--border); border-radius: 10px; padding: 7px 10px; background: var(--surface-2); font-size: 13.5px; }
    .mdic-found .it.ok { border-color: var(--ok); } .mdic-found .it.bad { border-color: var(--bad); } .mdic-found .it.warn { border-color: var(--warn); }
    .mdic-found .it .why { grid-column: 1 / -1; font-size: 13px; color: var(--text-2); }
    .mdic-chips { display: flex; flex-wrap: wrap; gap: 6px; }
    .mdic-chip { border: 1px solid var(--border-strong); border-radius: 999px; padding: 5px 11px; background: var(--surface-2); color: var(--text); font-size: 13px; line-height: 1.25; text-align: left; }
    .mdic-chip code { font-size: 12px; }
    .mdic-chip[aria-pressed="true"] { border-color: var(--warn); background: color-mix(in srgb, var(--warn) 20%, transparent); box-shadow: 0 0 0 1px var(--warn) inset; }
    .mdic-chip.ok { border-color: var(--ok); } .mdic-chip.bad { border-color: var(--bad); border-style: dashed; } .mdic-chip.warn { border-color: var(--warn); border-style: dotted; }
    .mdic-chip:disabled { cursor: default; }
    .mdic-tests { display: grid; gap: 6px; }
    .mdic-test { text-align: left; border: 1px solid var(--border-strong); border-radius: 10px; padding: 7px 10px; background: var(--surface-2); color: var(--text); font-size: 13px; width: 100%; display: grid; gap: 2px; }
    .mdic-test code { font-size: 12px; overflow-wrap: anywhere; }
    .mdic-test[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); }
    .mdic-2 { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.3fr); gap: 12px; }
    .mdic-2 > * { min-width: 0; }
    .mdic-2 .mdic-def { grid-template-columns: minmax(0, 1fr); gap: 3px; }
    .mdic-2 .mdic-def code { overflow-wrap: anywhere; }
    .mdic-pair { display: grid; grid-template-columns: minmax(0, 1fr) 24px minmax(0, 1fr); gap: 6px; align-items: center; font-size: 13.5px; }
    .mdic-pair code.b { color: var(--bad); text-decoration: line-through; }
    .mdic-pair code.g { color: var(--ok); }
    @media (max-width: 760px) {
      .mdic-roles { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .mdic-def, .mdic-ba, .mdic-2 { grid-template-columns: minmax(0, 1fr); }
      .mdic-er { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .mdic-er .nm { grid-column: 1 / -1; }
      .mdic-er.hd { display: none; }
      .mdic-er .lb { display: block; margin-bottom: 3px; }
      .mdic-sn { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); }
      .mdic-sn.th { display: none; }
      .mdic-sn .d { grid-column: 1 / -1; }
      .mdic-found .it { grid-template-columns: minmax(0, 1fr); }
    }
  </style>`);

  const S = TR.db.SCHEMA, E = TR.db.ENUMS;
  const tbl = n => S.find(t => t.name === n);
  const keyOf = c => c.pk ? 'PK' : c.fk ? 'FK:' + c.fk.split('.')[0] : c.uniq ? 'UQ' : '';
  const keyRu = k => !k ? '—' : k === 'PK' ? 'PK' : k === 'UQ' ? 'UNIQUE' : 'FK → ' + k.slice(3);
  const dbFail = e => ui.note('bad', 'База не загрузилась', `Учебная база (SQLite в браузере) подгружается из интернета, а сейчас загрузить её не удалось: ${esc(String((e && e.message) || e || ''))}. Проверьте сеть и нажмите ещё раз — остальная часть занятия работает без базы.`);
  // Выполнить изменение «понарошку»: на свежей копии базы — общая песочница не меняется.
  async function tryRun(sql) {
    if (TR.db.runFresh) return TR.db.runFresh(sql);
    await TR.db.ready();
    await TR.db.run('ROLLBACK;');
    const r = await TR.db.run('BEGIN; ' + sql);
    await TR.db.run('ROLLBACK;');
    return r;
  }
  function dictHTML(t) {
    return `<div class="mdic-wrap"><table class="mdic-dict"><thead><tr><th>Поле</th><th>Название</th><th>Тип</th><th>NULL</th><th>По умолч.</th><th>Ключ</th><th>Допустимые значения</th><th>ПДн</th><th>Описание</th></tr></thead><tbody>${t.cols.map(c => `<tr>
      <td class="m">${esc(c.n)}</td><td>${esc(c.ru)}</td><td class="m">${esc(c.type)}</td><td>${c.nul ? 'да' : 'нет'}</td><td class="m">${c.def ? esc(c.def) : '—'}</td>
      <td class="m">${c.pk ? 'PK' : ''}${c.fk ? (c.pk ? ', ' : '') + 'FK → ' + esc(c.fk) : ''}${c.uniq && !c.pk ? 'UNIQUE' : ''}${!c.pk && !c.fk && !c.uniq ? '—' : ''}</td>
      <td>${c.enum ? E[c.enum].map(e => `<code>${esc(e[0])}</code> ${esc(e[1])}`).join('<br>') : '—'}</td><td>${c.pd ? '<span class="pd">ПДн</span>' : '—'}</td><td>${c.desc ? esc(c.desc) : '<span class="dim">—</span>'}</td></tr>`).join('')}</tbody></table></div>`;
  }

  // =====================================================================
  // Теория 1. Зачем словарь данных и кто им пользуется
  // =====================================================================
  const ROLES = [
    { id: 'gleb', t: 'Разработчик', who: 'Глеб', need: 'Тип и длина, NULL, ключи, ограничения, значение по умолчанию.', q: '«У work_order.status длина 16 — а самое длинное значение waiting_approval влезает? А при создании какой статус ставить, если клиент приехал без записи?»', use: 'Пишет миграции и проверки во входящих запросах API. Без словаря угадывает — и каждая угадайка становится дефектом.' },
    { id: 'liza', t: 'Тестировщица', who: 'Лиза', need: 'Допустимые значения, границы, обязательность, бизнес-правила BR-*.', q: '«status = waiting должен отклоняться? А пустой post_id — это ошибка или „пост ещё не назначен“?»', use: 'Строит тест-кейсы по граничным значениям и перечислениям прямо из словаря: каждое ограничение — минимум один позитивный и один негативный тест.' },
    { id: 'kirill', t: 'Аналитик данных', who: 'Кирилл', need: 'Смысл поля, единицы, как считается, источник, пример.', q: '«bonus_balance — в рублях или в баллах? И отменённые записи считать в загрузке станций?»', use: 'Строит отчёты и прогнозы нагрузки. Без описания смысла считает «средний чек» по-своему — и цифры не сходятся с бухгалтерией.' },
    { id: 'marina', t: 'Поддержка и бизнес', who: 'Марина Олеговна', need: 'Русские названия статусов, что видит клиент, кто меняет.', q: '«Клиент звонит: „у меня написано «Клиент приехал», а я уже дома“. Что это значит и кто должен был поменять?»', use: 'Отвечает клиентам и разбирает жалобы. Русские названия перечислений из словаря — те же, что на экранах.' },
    { id: 'olga', t: 'Бухгалтерия', who: 'Ольга Викторовна', need: 'Деньги: тип, округление, «до или после» скидок; сроки хранения.', q: '«work_order.total — это до списания бонусов или после? И сколько хранится платёж, если клиент удалил аккаунт?»', use: 'Сверяет выручку с ЮKassa и 1С. Одно неописанное «до/после бонусов» — ежемесячное расхождение.' },
    { id: 'dasha', t: 'Мобильный разработчик', who: 'Даша', need: 'Перечисления с русскими названиями, форматы дат и телефонов, что может быть пустым.', q: '«email может быть пустым? Тогда в профиле показываю „Добавить email“, а не пустую строку».', use: 'Рисует экраны: какие поля обязательны в форме, какие подписи показывать, что делать с пустыми значениями.' },
    { id: 'sec', t: 'Ответственный за ПДн', who: 'Ольга Викторовна (по совместительству)', need: 'Признак ПДн, срок хранения, где хранится, кто имеет доступ.', q: '«Где у нас лежат телефоны и VIN? Кто их видит? Что удалим по запросу клиента?»', use: 'Отвечает перед Роскомнадзором по 152-ФЗ: перечень ПДн и сроки хранения берёт из словаря.' },
    { id: 'me', t: 'Системный аналитик', who: 'Вы', need: 'Всё сразу — вы автор и хранитель словаря.', q: '«Если поменять client.phone на необязательное — что сломается?»', use: 'Ведёт словарь, версии и журнал изменений, использует его в анализе влияния и в описаниях API.' }
  ];
  const howWhy = {
    id: 'how-why', covers: ['fill'], title: 'Как это работает: словарь данных, его читатели и паспорт таблицы', free: true, noReset: true,
    simple: {
      icon: '📖',
      plain: 'Словарь данных — справочник по базе: какие есть таблицы, что значит каждое поле, какие значения допустимы и по каким правилам они меняются. Один документ вместо сотни вопросов в чате.',
      analogy: 'Инструкция к лекарству: состав, дозировка, противопоказания, срок годности. Врач, фармацевт и пациент читают одну и ту же бумажку — каждый своё.',
      tech: 'Data Dictionary — метаданные модели: таблицы (назначение, владелец, объём, хранение) и атрибуты (имя, тип, обязательность, ключи, ограничения, домены значений, источник, правила). BABOK v3, 10.12 «Словарь данных»; DAMA-DMBOK, гл. «Управление метаданными»; Вигерс, гл. 13.'
    },
    lead: ui.brief({
      situation: 'Вторник, 10:00. В чате проекта за неделю 43 вопроса вида «а это поле может быть пустым?». Глеб: «Хочу один документ, где всё написано». Лиза: «И чтобы я могла по нему писать тесты». Вера: «Это и есть словарь данных. Посмотрим, кто и что в нём ищет».',
      todo: [
        'Во вкладке «Кто пользуется» нажимайте на роли: что каждый ищет в словаре и с каким вопросом приходит.',
        'Во вкладке «Паспорт таблицы» сравните «было» и «стало» для booking.',
        'Во вкладке «Живой словарь» выберите таблицу — это настоящий словарь учебной базы, из которого генерируется код таблиц.'
      ],
      look: 'Словарь — не «документ для галочки», а <b>единый источник правды о данных</b>. Если словарь и база расходятся, верить нельзя ни одному. Поэтому лучший словарь — тот, из которого генерируется код (или наоборот), как TR.db.SCHEMA в тренажёре.'
    }),
    render(el) {
      el.classList.add('mdic-root');
      const tabs = document.createElement('div'); el.appendChild(tabs);
      ui.tabs(tabs, [
        { id: 'r', t: 'Кто пользуется', render: rRoles },
        { id: 'p', t: 'Паспорт таблицы', render: rPass },
        { id: 'l', t: 'Живой словарь', render: rLive }
      ]);
      el.insertAdjacentHTML('beforeend', `<div class="stack" style="margin-top:12px">
        ${ui.note('warn', 'Типичные ошибки', '<ul class="checks"><li class="bad">Описание повторяет имя: «status — статус», «created_at — дата создания». Пользы ноль: какие статусы? чьё время?</li><li class="bad">Словарь написали один раз к сдаче и забыли. Через месяц он врёт, и им перестают пользоваться.</li><li class="bad">Нет русских названий значений: Марина и Даша придумывают свои, и в приложении «Ждёт согласования», а в АРМ — «На согласовании».</li><li class="bad">Нет владельца таблицы: непонятно, кого спрашивать, можно ли менять.</li></ul>')}
        <details class="more"><summary>Как об этом спрашивают на собеседовании</summary><div>
          <p><b>«Что такое словарь данных и что в нём должно быть?»</b> Описание таблиц (назначение, владелец, источник, объём, хранение) и полей (имя, русское название, тип и длина, обязательность, значение по умолчанию, ключи, ограничения, допустимые значения, источник, пример, бизнес-правило, признак ПДн, срок хранения). Плюс версия и журнал изменений.</p>
          <p><b>«Чем словарь отличается от ERD?»</b> ERD показывает структуру и связи — «картинка». Словарь — подробности каждого поля — «текст». Они дополняют друг друга и должны совпадать.</p>
          <p><b>«Кто пользуется словарём?»</b> Разработчики, тестировщики, аналитики данных, поддержка, бухгалтерия, ответственный за ПДн, интеграторы (1С, ЮKassa).</p>
        </div></details></div>`);

      function rRoles(box) {
        let cur = 'gleb';
        box.innerHTML = `<div class="stack"><div class="mdic-roles" data-r></div><div data-card></div></div>`;
        function draw() {
          TR.$('[data-r]', box).innerHTML = ROLES.map(r => `<button type="button" class="mdic-role" data-role="${r.id}" aria-pressed="${r.id === cur}"><b>${esc(r.t)}</b><span>${esc(r.who)}</span></button>`).join('');
          const r = ROLES.find(x => x.id === cur);
          TR.$('[data-card]', box).innerHTML = `<div class="card flat"><div class="mdic-def">
            <span class="k">Ищет в словаре</span><div class="v">${esc(r.need)}</div>
            <span class="k">Зачем</span><div class="v">${esc(r.use)}</div></div>
            ${ui.say(r.id === 'sec' ? 'olga' : r.id, esc(r.q))}</div>`;
        }
        TR.on(box, 'click', '[data-role]', (e, b) => { cur = b.dataset.role; draw(); });
        draw();
      }

      function rPass(box) {
        let m = 'good';
        box.innerHTML = `<div class="stack"><div class="row"><span class="small dim">Показать:</span>${ui.seg('m', [{ v: 'bad', t: 'Было' }, { v: 'good', t: 'Стало' }, { v: 'both', t: 'Рядом' }], m, 'accent')}</div><div data-out></div></div>`;
        const BAD = `<div class="card flat bad-t"><p><b>booking</b> — таблица бронирований. Содержит данные о бронированиях клиентов.</p></div>`;
        const GOOD = `<div class="card flat ok-t"><div class="mdic-def">
          <span class="k">Таблица</span><div class="v"><code>booking</code> — Запись</div>
          <span class="k">Назначение</span><div class="v">Запись клиента на обслуживание: станция, время, машина, выбранные услуги (через booking_service). Из записи при приёмке открывается заказ-наряд.</div>
          <span class="k">Владелец</span><div class="v">Бизнес — Марина Олеговна (процесс записи и приёмки). Технический — Глеб.</div>
          <span class="k">Источник</span><div class="v">Приложение, сайт, телефон (колл-центр) — поле source.</div>
          <span class="k">Объём</span><div class="v">≈ 600 записей в день, в сезон до 3 000; пик — понедельник 09:00, до 1 500 пользователей одновременно.</div>
          <span class="k">Связи</span><div class="v">N:1 к client, car, station, post; 1:N к booking_service; 1:0..1 к work_order.</div>
          <span class="k">Персональные данные</span><div class="v">Прямо — нет; ссылки на client и car, где ПДн есть. comment — свободный текст, может содержать ПДн.</div>
          <span class="k">Хранение</span><div class="v">В BR-* срок не задан — <b>открытый вопрос Ольге Викторовне</b>. Записи с заказ-нарядом — не меньше срока заказ-наряда (5 лет, BR-16).</div>
          <span class="k">Правила</span><div class="v">BR-1 (сетка 30 мин), BR-2 (за 2 ч, до 30 дней), BR-3 (отмена за 3 ч), BR-4 (неявка, предоплата).</div>
          <span class="k">Оговорки</span><div class="v">В учебной базе время — по Казани, без часового пояса.</div></div></div>`;
        function draw() { TR.$('[data-out]', box).innerHTML = m === 'both' ? `<div class="mdic-ba">${BAD}${GOOD}</div>` : m === 'bad' ? BAD + ui.note('bad', 'Что не так', 'Описание повторяет имя таблицы. Не сказано, кто владелец, откуда данные, сколько их, сколько хранить и по каким правилам они живут. Каждый из этих пробелов — вопрос в чате.') : GOOD + ui.note('ok', 'Обратите внимание', 'Паспорт честно показывает дыру: срок хранения записей не определён. Хороший словарь не скрывает незнание, а превращает его в вопрос с адресатом.'); }
        ui.onSeg(box, (n, v) => { m = v; draw(); });
        draw();
      }

      function rLive(box) {
        let cur = 'booking';
        box.innerHTML = `<div class="stack"><div class="row"><label class="small dim" for="mdic-live-t">Таблица:</label><select id="mdic-live-t" style="max-width:320px" aria-label="Таблица словаря">${S.map(t => `<option value="${t.name}" ${t.name === cur ? 'selected' : ''}>${t.name} — ${esc(t.ru)}</option>`).join('')}</select></div>
          <div data-out></div></div>`;
        function draw() {
          const t = tbl(cur);
          const ddl = TR.db.ddl().split('\n\n').find(x => x.startsWith('CREATE TABLE ' + cur + ' ('));
          TR.$('[data-out]', box).innerHTML = `<p class="small"><b>${esc(t.ru)}.</b> ${esc(t.desc)}</p>${dictHTML(t)}
            <details class="more"><summary>Код таблицы, сгенерированный из этого словаря</summary><div>${ui.code(ddl || '', 'sql')}</div></details>
            ${ui.note('info', 'Словарь и код — из одного источника', 'В тренажёре словарь хранится как данные (TR.db.SCHEMA), и из него же строится CREATE TABLE. Поэтому они не могут разойтись. В настоящих проектах то же делают генераторами документации по схеме или, наоборот, миграциями из описания модели.')}`;
        }
        box.addEventListener('change', e => { if (e.target.id === 'mdic-live-t') { cur = e.target.value; draw(); } });
        draw();
      }
    }
  };

  // =====================================================================
  // Практика 1. Словарь для booking
  // =====================================================================
  const BK = tbl('booking');
  const FAM = ['INTEGER', 'VARCHAR', 'DATETIME', 'DATE', 'DECIMAL', 'BOOLEAN'];
  const KEYS = ['', 'PK', 'FK:client', 'FK:car', 'FK:station', 'FK:post', 'UQ'];
  const famOf = t => t.replace(/\(.*$/, '');
  const refRow = c => ({ type: famOf(c.type), key: keyOf(c), nul: !!c.nul, en: !!c.enum, def: c.def ? c.def.replace(/'/g, '') : '' });
  const FILL_WHY = {
    id: 'Суррогатный первичный ключ, целое число.',
    client_id: 'Кто записался — ссылка на client, обязательно.',
    car_id: 'Какая машина — ссылка на car, обязательно: у клиента бывает несколько машин.',
    station_id: 'На какую станцию — обязательно, слоты считаются по станции.',
    post_id: 'Пост назначает мастер-приёмщик утром — до этого пусто, поэтому NULL.',
    start_at: 'Момент начала — DATETIME, обязательно. Правила BR-1, BR-2.',
    end_at: 'Конец = начало + нормо-часы услуг, вверх до 30 минут (BR-1).',
    status: "Перечисление (CHECK), по умолчанию confirmed. «Ждёт предоплаты» (new) — только после 2 неявок подряд (BR-4).",
    source: 'Перечисление: app, site, phone. Значения по умолчанию нет: канал всегда известен.',
    created_at: 'Когда создана — обязательно. Можно по умолчанию «текущее время».',
    comment: 'Комментарий клиента необязателен — NULL. Свободный текст: может содержать ПДн.'
  };
  function fillEval(a) {
    const r = (a && a.r) || {};
    const rows = BK.cols.map(c => {
      const ref = refRow(c), g = r[c.n] || {}, errs = [];
      if (g.type !== ref.type) errs.push(`тип: ${g.type || 'не выбран'} → ${ref.type}`);
      if ((g.key || '') !== ref.key) errs.push(`ключ: ${keyRu(g.key)} → ${keyRu(ref.key)}`);
      if (!!g.nul !== ref.nul) errs.push(ref.nul ? 'должно допускать NULL' : 'должно быть обязательным (NOT NULL)');
      if (!!g.en !== ref.en) errs.push(ref.en ? 'это перечисление — нужен CHECK со списком значений' : 'это не перечисление');
      const d = TR.norm(g.def || '').replace(/\s+/g, '');
      const dOk = ref.def ? d === TR.norm(ref.def) : c.n === 'created_at' ? (!d || /now|current|сейчас|текущ/.test(d)) : !d;
      if (!dOk) errs.push(ref.def ? `по умолчанию — ${ref.def}` : 'значения по умолчанию здесь нет');
      return { c, errs, pts: (5 - errs.length) / 5 };
    });
    return { rows, score: rows.reduce((s, x) => s + x.pts, 0) / rows.length };
  }
  const fillTask = {
    id: 'fill', title: 'Заполните словарь данных для таблицы booking',
    simple: howWhy.simple,
    lead: ui.brief({
      situation: 'Глеб прислал скелет: «Имена полей есть, остальное — твоё. Тип, ключ, может ли быть пустым, перечисление или нет, что по умолчанию. Завтра по этому пишу миграцию, Лиза — тесты».',
      todo: [
        'Для каждого из 11 полей выберите тип, ключ, отметьте NULL (может быть пустым) и «перечисление», впишите значение по умолчанию, если оно есть.',
        'Опирайтесь на факты справа и на бизнес-правила BR-*.',
        'Нажмите «Проверить». Засчитывается от 80 % верных характеристик.'
      ],
      lookTitle: 'Факты от Марины Олеговны',
      look: 'Пост назначает мастер утром, при записи его нет. Клиент может ничего не написать в комментарии. Обычная запись сразу подтверждена; «ждёт предоплаты» — только после двух неявок подряд (BR-4). Записываются через приложение, сайт или по телефону. У клиента может быть несколько машин.'
    }),
    blank: () => ({ r: {} }),
    reference: () => ({ r: Object.fromEntries(BK.cols.map(c => [c.n, refRow(c)])) }),
    render(el, ctx) {
      el.classList.add('mdic-root');
      const a = ctx.ans; a.r = a.r || {};
      const ro = ctx.readonly, ev = ctx.result ? fillEval(a) : null;
      el.innerHTML = `<div class="stack"><div class="mdic-spec"><div class="hd"><b>booking</b> · Запись · черновик словаря v0.1</div><div class="bd mdic-ed" data-ed></div></div></div>`;
      const H = `<div class="mdic-er hd"><span>Поле</span><span>Тип</span><span>Ключ</span><span>NULL</span><span>Перечисл.</span><span>По умолчанию</span></div>`;
      TR.$('[data-ed]', el).innerHTML = H + BK.cols.map(c => {
        const g = a.r[c.n] || {}, rr = ev && ev.rows.find(x => x.c.n === c.n), st = rr ? (rr.errs.length ? (rr.pts >= 0.6 ? 'warn' : 'bad') : 'ok') : '';
        return `<div class="mdic-er ${st}">
          <div class="nm"><code>${c.n}</code><small>${esc(c.ru)}</small></div>
          <div><span class="lb">Тип</span><select data-f="type" data-c="${c.n}" aria-label="Тип поля ${c.n}" ${ro ? 'disabled' : ''}><option value="">тип…</option>${FAM.map(t => `<option ${g.type === t ? 'selected' : ''}>${t}</option>`).join('')}</select></div>
          <div><span class="lb">Ключ</span><select data-f="key" data-c="${c.n}" aria-label="Ключ поля ${c.n}" ${ro ? 'disabled' : ''}>${KEYS.map(k => `<option value="${k}" ${(g.key || '') === k ? 'selected' : ''}>${keyRu(k)}</option>`).join('')}</select></div>
          <div><span class="lb">Пустое</span><label><input type="checkbox" data-f="nul" data-c="${c.n}" ${g.nul ? 'checked' : ''} ${ro ? 'disabled' : ''} aria-label="Поле ${c.n} может быть пустым"> NULL</label></div>
          <div><span class="lb">Перечисл.</span><label><input type="checkbox" data-f="en" data-c="${c.n}" ${g.en ? 'checked' : ''} ${ro ? 'disabled' : ''} aria-label="Поле ${c.n} — перечисление"> CHECK</label></div>
          <div><span class="lb">По умолчанию</span><input type="text" data-f="def" data-c="${c.n}" value="${esc(g.def || '')}" placeholder="—" ${ro ? 'readonly' : ''} aria-label="Значение по умолчанию для ${c.n}"></div>
          ${rr && rr.errs.length ? `<div class="why"><b>${esc(rr.errs.join('; '))}.</b> ${esc(FILL_WHY[c.n] || '')}</div>` : ro ? `<div class="why">${esc(FILL_WHY[c.n] || '')}</div>` : ''}
        </div>`;
      }).join('');
      const upd = e => {
        if (ro) return;
        const t = e.target, f = t.dataset.f, n = t.dataset.c; if (!f || !n) return;
        const g = a.r[n] = a.r[n] || {};
        g[f] = t.type === 'checkbox' ? t.checked : t.value;
        ctx.save();
      };
      el.addEventListener('change', upd);
      el.addEventListener('input', e => { if (e.target.dataset.f === 'def') upd(e); });
    },
    check(ans) {
      const r = fillEval(ans), notes = [];
      notes.push({ ok: r.score >= 0.8 ? true : r.score >= 0.6 ? 'warn' : false, html: `Характеристик заполнено верно: ${Math.round(r.score * 100)} %. Полностью верных полей: ${r.rows.filter(x => !x.errs.length).length} из ${r.rows.length}.` });
      r.rows.filter(x => x.errs.length).forEach(x => notes.push({ ok: x.pts >= 0.6 ? 'warn' : false, html: `<code>${x.c.n}</code>: ${esc(x.errs.join('; '))}. ${esc(FILL_WHY[x.c.n] || '')}` }));
      const g = (ans.r || {});
      const postBad = g.post_id && !g.post_id.nul, stDef = g.status && TR.norm(g.status.def || '') === 'new';
      return {
        ok: r.score >= 0.8, score: r.score, notes,
        summary: `Словарь booking верен на ${Math.round(r.score * 100)} %.`,
        mentor: r.score >= 0.8 ? null : postBad ? 'post_id обязателен? Тогда клиент не сможет записаться: пост назначает мастер утром. Обязательность — это вопрос «есть ли значение в момент создания строки».' : stDef ? '«Ждёт предоплаты» — исключение по BR-4, а не правило. По умолчанию — confirmed.' : 'Идите по полю и задавайте три вопроса: «откуда значение?», «есть ли оно в момент создания?», «из какого списка?».'
      };
    },
    explain: `<p>Эталон — это словарь учебной базы (TR.db.SCHEMA). Главное в нём не типы, а <b>обязательность и значения по умолчанию</b> — именно там прячутся бизнес-правила:</p>
      <ul class="checks">
        <li><code>post_id</code> допускает NULL, потому что пост назначает мастер утром. Сделать обязательным — запретить онлайн-запись.</li>
        <li><code>status</code> по умолчанию <code>confirmed</code>: обычная запись сразу подтверждена. <code>new</code> («Ждёт предоплаты») ставит бэкенд по BR-4.</li>
        <li><code>source</code> без значения по умолчанию: канал всегда известен, а «по умолчанию app» исказит статистику колл-центра (цель «потерянные звонки 21 % → 5 %»).</li>
        <li><code>status</code> и <code>source</code> — перечисления: CHECK со списком, а русские названия — в словаре (ENUMS).</li>
      </ul>
      <p>Длину строк (VARCHAR(12), VARCHAR(500)) пишут в словарь тоже — здесь мы проверяли только тип. Источники: BABOK v3, 10.12; Вигерс, гл. 13, пример словаря данных.</p>`,
    refNote: 'Для created_at засчитывается и пустое значение по умолчанию, и «текущее время» (CURRENT_TIMESTAMP, now()).',
    report: ans => BK.cols.map(c => { const g = (ans.r || {})[c.n] || {}; return `- ${c.n}: ${g.type || '?'} ${keyRu(g.key)} ${g.nul ? 'NULL' : 'NOT NULL'}${g.en ? ' CHECK' : ''}${g.def ? ' DEFAULT ' + g.def : ''}`; }).join('\n')
  };

  // =====================================================================
  // Теория 2. Описание поля и живая проверка ограничений
  // =====================================================================
  const FIELD = [
    { k: 'Имя', v: '<code>status</code>', miss: 'Без точного имени все называют по-своему: «статус записи», «state», «booking_state».' },
    { k: 'Русское название', v: 'Статус записи', miss: 'Даша и Ника не знают, как подписать поле на экране.' },
    { k: 'Описание', v: 'Где запись в своём жизненном цикле. Меняется клиентом (отмена), мастером (приехал) и системой (неявка, завершение).', miss: '«Статус — статус» — описание, которое ничего не объясняет.' },
    { k: 'Тип и длина', v: '<code>VARCHAR(12)</code> — код латиницей', miss: 'Глеб выберет VARCHAR(8) — и «cancelled» (9 символов) не влезет.' },
    { k: 'NULL', v: 'Нет — у записи всегда есть статус', miss: 'Появятся записи без статуса — их не покажет ни один экран.' },
    { k: 'По умолчанию', v: "<code>'confirmed'</code>", miss: 'Каждый вызов API должен будет передавать статус явно — и кто-то забудет.' },
    { k: 'Ключ', v: '—', miss: '' },
    { k: 'Ограничения', v: "<code>CHECK (status IN ('new','confirmed','arrived','done','cancelled','no_show'))</code>", miss: 'В базу попадёт «waiting» или «Отменена» — отчёты сломаются.' },
    { k: 'Допустимые значения', v: E['booking.status'].map(e => `<code>${e[0]}</code> ${esc(e[1])}`).join(' · '), miss: 'Нет русских названий — в АРМ «Отменена», в приложении «Отменено», в отчёте «Аннулирована».' },
    { k: 'Переходы', v: 'new → confirmed → arrived → done; confirmed → cancelled / no_show. Из done и cancelled — никуда.', miss: 'Без переходов Лиза не проверит «нельзя отменить завершённую запись».' },
    { k: 'Источник', v: 'Бэкенд записи: при создании, отмене, приёмке; таймер неявки.', miss: 'Непонятно, кто виноват в неверном статусе.' },
    { k: 'Пример', v: '<code>confirmed</code>', miss: 'Пример снимает половину вопросов о формате.' },
    { k: 'Бизнес-правила', v: 'BR-3 (отмена за 3 ч), BR-4 (неявка через 15 мин; new — после 2 неявок)', miss: 'Правило живёт только в голове Марины — и уходит вместе с ней в отпуск.' },
    { k: 'ПДн / хранение', v: 'Не ПДн. Хранится вместе с записью.', miss: 'Ответственный за ПДн не знает, что включать в перечень.' }
  ];
  const TESTS = [
    { t: 'Недопустимое значение статуса', sql: "UPDATE booking SET status = 'waiting' WHERE id = 1;", exp: 'CHECK', why: 'Словарь говорит: только 6 значений. База это помнит — CHECK не пускает «waiting».' },
    { t: 'Пустой клиент у записи', sql: 'UPDATE booking SET client_id = NULL WHERE id = 1;', exp: 'NOT NULL', why: 'client_id обязателен — запись без клиента бессмысленна.' },
    { t: 'Дубль госномера', sql: 'UPDATE car SET plate = (SELECT plate FROM car WHERE id = 2) WHERE id = 1;', exp: 'UNIQUE', why: 'Госномер уникален: двух машин с одним номером не бывает (а дубль из Excel — бывает, его и ловим).' },
    { t: 'Ссылка на несуществующую машину', sql: 'UPDATE booking SET car_id = 99999 WHERE id = 1;', exp: 'FOREIGN KEY', why: 'Внешний ключ: машины 99999 нет.' },
    { t: 'Допустимое изменение', sql: "UPDATE booking SET status = 'no_show' WHERE id = 1;", exp: 'ok', why: 'Значение из списка — база принимает. Изменение выполнено на отдельной копии базы: общая учебная база не изменилась.' },
    { t: 'Правило, которое записали только словами', sql: 'SELECT id, start_at, end_at FROM booking WHERE end_at <= start_at;', exp: 'rows', why: 'В словаре сказано «end_at = начало + длительность», но в базе ограничения CHECK (end_at > start_at) нет — и одна кривая запись уже есть. Правило из словаря, не переведённое в ограничение, рано или поздно нарушат.' }
  ];
  const howField = {
    id: 'how-field', covers: ['bugs', 'enum'], title: 'Как это работает: описание поля и ограничения в базе', free: true, noReset: true,
    simple: {
      icon: '🔎',
      plain: 'Описание поля отвечает на все вопросы о нём заранее: что это, какого типа, может ли быть пустым, что по умолчанию, какие значения допустимы, кто его меняет и по какому правилу. Часть этих ответов база может проверять сама — ограничениями.',
      analogy: 'Графа в бланке паспорта: «Дата рождения — ДД.ММ.ГГГГ, обязательно, не позже сегодняшней». Сотрудник МФЦ не пропустит «тридцатое февраля».',
      tech: 'Атрибуты элемента данных: имя, определение, тип и длина, обязательность (NULL / NOT NULL), значение по умолчанию (DEFAULT), ключи (PRIMARY KEY, FOREIGN KEY, UNIQUE), ограничения (CHECK), домен значений (перечисление), источник, пример, правила (ISO/IEC 11179 «Регистры метаданных»; DAMA-DMBOK).'
    },
    lead: ui.brief({
      situation: 'Лиза: «Мне не нужна „красивая“ табличка. Мне нужно знать про каждое поле: что можно, что нельзя, и что будет, если нарушить». Вера: «Разберём одно поле до винтика — booking.status. А потом проверим, что база реально делает с нарушениями».',
      todo: [
        'Нажимайте на атрибуты поля booking.status: значение и что будет, если его не описать.',
        'Справа запускайте проверки в учебной базе: какие нарушения ловит база, а какое — нет.'
      ],
      look: 'Изменения выполняются на отдельной копии базы — учебную базу вы не испортите. Последняя проверка — самая важная: правило, записанное только словами, база не защищает.'
    }),
    render(el) {
      el.classList.add('mdic-root');
      let cur = 7, tcur = -1;
      el.innerHTML = `<div class="stack">
        <div class="mdic-2">
          <div class="stack tight"><div class="eyebrow">Поле booking.status — 14 атрибутов</div><div class="mdic-attrs" data-at></div><div data-ac></div></div>
          <div class="stack tight"><div class="eyebrow">Живая проверка в учебной базе</div><div class="mdic-tests" data-ts></div><div data-tr></div></div>
        </div>
        ${ui.note('warn', 'Типичные ошибки', '<ul class="checks"><li class="bad">NULL «по привычке» везде, где не уверены. Потом тесты ловят пустые статусы и суммы.</li><li class="bad">Перечисление описано только в тексте («статусы: подтверждена, отменена…») без кодов — разработчик придумает свои.</li><li class="bad">Правило есть в словаре, но не в базе и не в API — «где-нибудь проверим». Не проверят.</li><li class="bad">Значение по умолчанию, которое искажает статистику: source = app «чтобы не было пусто».</li></ul>')}
        <details class="more"><summary>Как об этом спрашивают на собеседовании</summary><div>
          <p><b>«Какие ограничения целостности вы знаете?»</b> NOT NULL, UNIQUE, PRIMARY KEY, FOREIGN KEY, CHECK, DEFAULT (не ограничение, но правило заполнения). Плюс правила, которые проверяет приложение: сложные и межтабличные (BR-2 «за 2 часа»).</p>
          <p><b>«Где проверять правило — в базе или в коде?»</b> Простые и вечные (тип, обязательность, список значений, ссылки) — в базе: она последняя линия обороны. Сложные и меняющиеся (время до записи, лимиты) — в коде, но описывать в словаре со ссылкой на BR-*.</p>
          <p><b>«Чем NULL отличается от пустой строки и нуля?»</b> NULL — «значения нет / неизвестно». 0 бонусов — значение. Пустая строка в email — мусор: лучше NULL.</p>
        </div></details></div>`;
      function drawA() {
        TR.$('[data-at]', el).innerHTML = FIELD.map((f, i) => `<button type="button" class="chip" data-a="${i}" aria-pressed="${i === cur}">${esc(f.k)}</button>`).join('');
        const f = FIELD[cur];
        TR.$('[data-ac]', el).innerHTML = `<div class="card flat"><div class="mdic-def"><span class="k">${esc(f.k)}</span><div class="v">${f.v}</div>${f.miss ? `<span class="k">Если не описать</span><div class="v">${esc(f.miss)}</div>` : ''}</div></div>`;
      }
      function drawT() { TR.$('[data-ts]', el).innerHTML = TESTS.map((t, i) => `<button type="button" class="mdic-test" data-t="${i}" aria-pressed="${i === tcur}"><b>${i + 1}. ${esc(t.t)}</b><code>${esc(t.sql)}</code></button>`).join(''); }
      TR.on(el, 'click', '[data-a]', (e, b) => { cur = +b.dataset.a; drawA(); });
      TR.on(el, 'click', '[data-t]', async (e, b) => {
        tcur = +b.dataset.t; drawT();
        const t = TESTS[tcur], out = TR.$('[data-tr]', el);
        out.innerHTML = '<div class="small dim">Загружаю базу…</div>';
        try {
          const r = t.exp === 'rows' ? await TR.db.run(t.sql) : await tryRun(t.sql);
          out.innerHTML = TR.db.resultHTML(r) + ui.note(t.exp === 'rows' ? 'warn' : r.ok === (t.exp === 'ok') ? 'ok' : 'warn', t.exp === 'ok' ? 'Принято и откачено' : t.exp === 'rows' ? 'База промолчала' : `База поймала: ${t.exp}`, esc(t.why));
        } catch (err) { out.innerHTML = dbFail(err); }
      });
      drawA(); drawT();
    }
  };

  // =====================================================================
  // Практика 2. Найдите ошибки в чужом словаре (payment)
  // =====================================================================
  const DEF_T = [{ v: 'type', t: 'Тип данных' }, { v: 'null', t: 'Обязательность (NULL)' }, { v: 'key', t: 'Ключ / уникальность' }, { v: 'enum', t: 'Перечисление' }, { v: 'name', t: 'Именование' }, { v: 'pd', t: 'ПДн / хранение' }, { v: 'desc', t: 'Неясное описание' }];
  const DTT = v => (DEF_T.find(d => d.v === v) || {}).t || '—';
  const PAY = [
    { id: 'p1', n: 'id', ty: 'INTEGER', nl: 'нет', k: 'PK', d: 'Идентификатор платежа', def: null, why: 'Всё на месте.' },
    { id: 'p2', n: 'workOrderId', ty: 'INTEGER', nl: 'нет', k: 'FK → work_order.id', d: 'Заказ-наряд, который оплачивают', def: 'name', why: 'camelCase посреди snake_case. По соглашению — work_order_id: остальные таблицы называют ссылки так, и запросы «JOIN … USING (work_order_id)» сломаются.', fix: 'work_order_id' },
    { id: 'p3', n: 'amount', ty: 'FLOAT', nl: 'нет', k: '—', d: 'Сумма платежа, ₽', def: 'type', why: 'Деньги во FLOAT теряют копейки — сверка с ЮKassa не сойдётся.', fix: 'DECIMAL(10,2)' },
    { id: 'p4', n: 'method', ty: 'VARCHAR(8)', nl: 'нет', k: 'CHECK: card, sbp, cash', d: 'Способ оплаты', def: 'enum', why: 'Нет значения invoice — «Счёт компании». По BR-10 юрлица («Шашка») платят по счёту раз в месяц: такой платёж просто не запишется.', fix: "CHECK: card, sbp, cash, invoice" },
    { id: 'p5', n: 'status', ty: 'VARCHAR(10)', nl: 'нет', k: "CHECK: pending, paid, failed, refunded; DEFAULT 'pending'", d: 'Статус платежа: pending → paid / failed; paid → refunded', def: null, why: 'Всё на месте: значения, переходы, значение по умолчанию.' },
    { id: 'p6', n: 'created_at', ty: 'DATETIME', nl: 'нет', k: '—', d: 'Когда платёж создан (UTC)', def: null, why: 'Всё на месте, и даже часовой пояс указан.' },
    { id: 'p7', n: 'paid_at', ty: 'DATETIME', nl: 'нет', k: '—', d: 'Когда оплачен', def: 'null', why: 'Пока платёж в статусе pending или failed, момента оплаты нет. NOT NULL заставит писать выдуманное время.', fix: 'NULL допустим' },
    { id: 'p8', n: 'provider_id', ty: 'VARCHAR(40)', nl: 'нет', k: '—', d: 'ID платежа в ЮKassa', def: 'null', alt: { key: 'Верно, UNIQUE тоже нужен — по нему сверка с ЮKassa. Но главная ошибка — обязательность: у оплаты в кассе станции и по счёту ID ЮKassa нет.' }, why: 'У оплаты в кассе и по счёту нет ID ЮKassa — поле должно допускать NULL. И стоит добавить UNIQUE для сверки.', fix: 'NULL, UNIQUE' },
    { id: 'p9', n: 'card_number', ty: 'VARCHAR(19)', nl: 'да', k: '—', d: 'Номер карты клиента — для повторной оплаты', def: 'pd', alt: { desc: 'Описание понятное — и в этом беда: хранить номер карты нельзя совсем.' }, why: 'Номер карты хранить нельзя: это зона ответственности ЮKassa (стандарт безопасности PCI DSS). Для повторной оплаты используют токен (payment_method_id) от ЮKassa.', fix: 'Удалить поле; при необходимости — токен ЮKassa' },
    { id: 'p10', n: 'client_phone', ty: 'VARCHAR(20)', nl: 'да', k: '—', d: 'Телефон для отправки чека. ПДн: нет', def: 'pd', why: 'Телефон — персональные данные (BR-15), а признак ПДн не отмечен. К тому же это копия client.phone: при обезличивании её забудут.', fix: 'Брать через work_order → car → client или отметить ПДн' },
    { id: 'p11', n: 'dt', ty: 'DATETIME', nl: 'да', k: '—', d: 'Дата', def: 'name', alt: { desc: 'Описание и правда пустое, но корень — в имени: «dt» не говорит, какой это момент. Назовите по смыслу — и описание напишется само.' }, why: 'Имя по типу, а не по смыслу. Какая дата — создания, оплаты, возврата? Рядом уже есть created_at и paid_at.', fix: 'refunded_at — «Когда возвращён», если это возврат' },
    { id: 'p12', n: 'receipt_url', ty: 'VARCHAR(300)', nl: 'да', k: '—', d: 'Ссылка на чек онлайн-кассы (54-ФЗ). Пусто, пока чек не пробит', def: null, why: 'Всё на месте, и сказано, когда пусто.' },
    { id: 'p13', n: 'is_deleted', ty: 'BOOLEAN', nl: 'нет', k: 'DEFAULT false', d: 'Платёж можно удалить по просьбе клиента', def: 'pd', alt: { desc: 'Описание понятное, но противоречит BR-16: платежи хранятся 5 лет и при удалении аккаунта остаются.' }, why: 'Нарушает BR-16: платежи хранятся 5 лет и не удаляются по просьбе клиента. Возврат — статус refunded.', fix: 'Удалить поле; возврат — status = refunded' },
    { id: 'p14', n: 'currency', ty: 'CHAR(3)', nl: 'нет', k: "DEFAULT 'RUB'", d: 'Валюта по ISO 4217', def: null, why: 'Всё на месте: сейчас всегда рубли, но поле не повредит.' }
  ];
  const PDEFS = PAY.filter(p => p.def);
  function bugsEval(a) {
    const sel = (a && a.sel) || {};
    const rows = PAY.filter(p => p.id in sel).map(p => {
      const g = sel[p.id];
      if (!p.def) return { p, st: 'bad', pts: 0, why: p.why };
      if (g === p.def) return { p, st: 'ok', pts: 1, why: p.why };
      if (g && p.alt && p.alt[g]) return { p, st: 'warn', pts: 0.75, why: p.alt[g] };
      return { p, st: g ? 'bad' : 'warn', pts: 0.5, why: g ? `Не «${DTT(g)}». ${p.why}` : 'Нашли, но не выбрали вид ошибки.' };
    });
    const hits = rows.filter(r => r.p.def), fp = rows.filter(r => !r.p.def);
    return { rows, hits, fp, missed: PDEFS.filter(p => !(p.id in sel)), score: Math.max(0, Math.min(1, hits.reduce((s, r) => s + r.pts, 0) / PDEFS.length - 0.1 * fp.length)) };
  }
  const bugsTask = {
    id: 'bugs', title: 'Найдите ошибки в чужом словаре: таблица payment',
    simple: howField.simple,
    lead: ui.brief({
      situation: 'Словарь таблицы payment набросал стажёр с соседнего проекта — «у нас так было». Ольга Викторовна посмотрела и сказала: «Я не программист, но тут что-то не так с деньгами». Вера: «Найдите всё до того, как Глеб напишет миграцию».',
      todo: [
        'Нажимайте на строки словаря, в которых есть ошибка.',
        'Для каждой найденной строки выберите вид ошибки.',
        'Строки без ошибок не отмечайте — за них снимаются баллы.',
        'Нажмите «Проверить». Засчитывается от 80 %.'
      ],
      lookTitle: 'Что держать в голове',
      look: 'BR-10: оплата онлайн, в кассе станции или по счёту (юрлица). BR-15: телефон — ПДн. BR-16: платежи хранятся 5 лет и не удаляются. Деньги — DECIMAL. Соглашение — snake_case, ссылки с _id, моменты времени с _at.'
    }),
    blank: () => ({ sel: {} }),
    reference: () => ({ sel: Object.fromEntries(PDEFS.map(p => [p.id, p.def])) }),
    render(el, ctx) {
      el.classList.add('mdic-root');
      const a = ctx.ans; a.sel = a.sel || {};
      const ro = ctx.readonly, ev = ctx.result ? bugsEval(a) : null;
      const cls = id => { if (!ev && !ro) return ''; const r = ev && ev.rows.find(x => x.p.id === id); if (r) return r.st; return ro && PAY.find(p => p.id === id).def ? 'miss' : ''; };
      el.innerHTML = `<div class="stack"><div class="mdic-spec"><div class="hd"><b>payment</b> · Платёж · словарь v0.2 · автор: стажёр</div><div class="bd">
        <div class="mdic-sn th"><span>Поле</span><span>Тип</span><span>NULL</span><span>Ключ / ограничения</span><span>Описание</span></div><div data-s class="stack tight"></div></div></div>
        <div class="eyebrow">Найденные ошибки</div><div class="mdic-found" data-f></div></div>`;
      function draw() {
        TR.$('[data-s]', el).innerHTML = PAY.map(p => `<button type="button" class="mdic-sn ${cls(p.id)}" data-sn="${p.id}" aria-pressed="${p.id in a.sel}" ${ro ? 'disabled' : ''}><span class="m"><b>${esc(p.n)}</b></span><span class="m">${esc(p.ty)}</span><span>${esc(p.nl)}</span><span class="m">${esc(p.k)}</span><span class="d">${esc(p.d)}</span></button>`).join('');
        const ids = PAY.filter(p => p.id in a.sel).map(p => p.id);
        TR.$('[data-f]', el).innerHTML = ids.length ? ids.map(id => {
          const p = PAY.find(x => x.id === id), r = ev && ev.rows.find(x => x.p.id === id);
          return `<div class="it ${r ? r.st : ''}"><span><code>${esc(p.n)}</code> ${esc(p.ty)}</span>
            <select data-d="${id}" aria-label="Вид ошибки для поля ${esc(p.n)}" ${ro ? 'disabled' : ''}><option value="">Вид ошибки…</option>${DEF_T.map(d => `<option value="${d.v}" ${a.sel[id] === d.v ? 'selected' : ''}>${esc(d.t)}</option>`).join('')}</select>
            ${r || ro ? `<div class="why">${esc(r ? r.why : p.why)}${p.fix ? ` <b>Как исправить:</b> ${esc(p.fix)}.` : ''}</div>` : ''}</div>`;
        }).join('') : '<div class="small dim">Пока ничего не отмечено. Нажмите на строку словаря.</div>';
      }
      TR.on(el, 'click', '[data-sn]', (e, b) => { if (ro) return; const id = b.dataset.sn; if (id in a.sel) delete a.sel[id]; else a.sel[id] = ''; ctx.save(); draw(); });
      el.addEventListener('change', e => { const s = e.target.closest('select[data-d]'); if (!s || ro) return; a.sel[s.dataset.d] = s.value; ctx.save(); });
      draw();
    },
    check(ans) {
      const r = bugsEval(ans), notes = [];
      notes.push({ ok: r.hits.length >= 8 ? true : r.hits.length >= 6 ? 'warn' : false, html: `Найдено ошибок: ${r.hits.length} из ${PDEFS.length}, вид определён верно у ${r.rows.filter(x => x.st === 'ok').length}.` });
      if (r.missed.length) notes.push({ ok: 'warn', html: `Пропущено ${r.missed.length}. Проверьте деньги, обязательность «моментов» (что, если оплаты ещё нет?), полноту списка способов оплаты по BR-10 и всё, что касается карты, телефона и удаления.` });
      r.fp.forEach(x => notes.push({ ok: false, html: `<code>${esc(x.p.n)}</code> — ${esc(x.why)}` }));
      r.rows.filter(x => x.p.def && x.st !== 'ok').forEach(x => notes.push({ ok: x.st === 'warn' ? 'warn' : false, html: `<code>${esc(x.p.n)}</code> — ${esc(x.why)}` }));
      const pdMiss = ['p9', 'p13'].some(id => !(id in ((ans && ans.sel) || {})));
      return {
        ok: r.score >= 0.8, score: r.score, notes,
        summary: `Найдено ${r.hits.length} из ${PDEFS.length}, лишних отметок: ${r.fp.length}.`,
        mentor: r.score >= 0.8 ? null : pdMiss ? 'Самые опасные строки — не про типы. Номер карты и «удалить по просьбе клиента» — это уже не ошибка словаря, а нарушение закона и BR-16.' : 'Читайте каждую строку глазами трёх людей: Глеба (тип, ключи), Лизы (может ли быть пустым, из какого списка), Ольги Викторовны (деньги, хранение, персональные данные).'
      };
    },
    explain: `<p>В словаре <b>9 ошибок</b> на 14 строк, и они очень разные по цене:</p>
      <ul class="checks">
        <li><b>Закон и безопасность</b>: номер карты (хранить нельзя — токен ЮKassa), «можно удалить по просьбе» (BR-16), телефон без отметки ПДн (BR-15). Пропустить их — штрафы и проверки.</li>
        <li><b>Деньги и бизнес</b>: FLOAT вместо DECIMAL, нет способа invoice для «Шашки» (BR-10).</li>
        <li><b>Обязательность</b>: paid_at и provider_id не могут быть NOT NULL — у неоплаченного и кассового платежа их нет.</li>
        <li><b>Именование</b>: workOrderId и dt — нарушения соглашения и смысла.</li>
      </ul>
      <p>Хороший приём ревью словаря — <b>прогнать по нему три сценария</b>: онлайн-оплата Елены, оплата в кассе на Победы, счёт «Шашке» за месяц. На кассовом сразу видно, что provider_id пуст, на счёте — что invoice нет в списке. Источники: BABOK v3, 10.12; DAMA-DMBOK, «Качество метаданных»; Положение Банка России и PCI DSS о данных карт.</p>`,
    refNote: 'Близкий вид засчитывается частично там, где граница тонкая: provider_id (NULL ↔ уникальность), card_number и is_deleted (ПДн/хранение ↔ описание), dt (именование ↔ описание).',
    report: ans => { const r = bugsEval(ans); return r.rows.map(x => `- ${x.p.n} → ${DTT(((ans && ans.sel) || {})[x.p.id])} ${x.st === 'ok' ? '✓' : x.st === 'warn' ? '≈' : '✗'}`).join('\n') || '—'; }
  };

  // =====================================================================
  // Практика 3. Статусы → перечисления
  // =====================================================================
  const WO_E = E['work_order.status'];
  const EN_CHOICES = WO_E.map(e => ({ v: e[0], t: `${e[0]} — ${e[1]}` })).concat([{ v: 'other', t: 'Не статус заказ-наряда (событие или другая таблица)' }, { v: 'ask', t: 'Подходящего значения нет — вопрос Марине Олеговне' }]);
  const EN_ROWS = [
    { id: 'm1', t: '«Приняли машину, оформили бумаги, механика ещё не назначили»', ok: 'open', why: 'open — Открыт: документ есть, работы не начаты.' },
    { id: 'm2', t: '«Ринат поднял машину и начал ТО»', ok: 'in_progress', why: 'in_progress — В работе.' },
    { id: 'm3', t: '«Нашли колодки, ждём ответа Елены»', ok: 'waiting_approval', why: 'waiting_approval — Ждёт согласования (BR-6, BR-8).' },
    { id: 'm4', t: '«Елена не ответила, Марина дозвонилась — работы продолжаются»', ok: 'in_progress', alt: { waiting_approval: 'Ожидание закончилось: решение получено по телефону, статус возвращается в «В работе». Сам звонок — это extra_offer.decided_by = phone.' }, why: 'Возврат в in_progress: статус ходит туда-обратно — поэтому у заказ-наряда нужна история.' },
    { id: 'm5', t: '«Всё сделали, клиенту ушло SMS»', ok: 'ready', why: 'ready — Готов (BR-13: push и SMS).' },
    { id: 'm6', t: '«Клиент забрал машину»', ok: 'closed', why: 'closed — Выдан. Обратите внимание: код closed, а русское название «Выдан» — словарь связывает одно с другим.' },
    { id: 'm7', t: '«Клиент передумал ещё до начала работ»', ok: 'cancelled', why: 'cancelled — Отменён.' },
    { id: 'm8', t: '«Клиент оплатил картой»', ok: 'other', alt: { closed: 'Оплата и выдача — разные события: можно оплатить онлайн и забрать завтра (BR-13). Оплата — payment.status = paid.' }, why: 'Это payment.status = paid, а не статус заказ-наряда.' },
    { id: 'm9', t: '«Механик сфотографировал проблему»', ok: 'other', alt: { waiting_approval: 'Фото — ещё не предложение. «Ждёт согласования» начинается, когда мастер отправил предложение с ценой (BR-7).' }, why: 'Событие в планшете → строка extra_offer, а не статус заказ-наряда.' },
    { id: 'm10', t: '«Ждём запчасть со склада, машина стоит на улице»', ok: 'ask', alt: { in_progress: 'Можно и так — но тогда отчёт «время в работе» будет врать: машина не в работе. Это решение должна принять Марина Олеговна, а не аналитик молча.', open: 'Возможно — если работы ещё не начинали. Но это ваша догадка: зафиксируйте вопрос.' }, why: 'В перечислении такого нет. Новое значение (waiting_parts) или «В работе»? Это решение бизнеса: вопрос Марине Олеговне и запись в журнал изменений словаря.' }
  ];
  const STORE_Q = { q: 'Как хранить перечисление статусов в базе?', options: [
    { t: 'Код латиницей в VARCHAR + CHECK со списком; русские названия — в словаре данных (или в таблице-справочнике)', ok: true, why: 'Код стабилен и не зависит от формулировок; CHECK не пускает мусор; русское название меняется без миграции данных.' },
    { t: 'Русский текст прямо в поле: «Ждёт согласования»', why: 'Переименовали «Выдан» в «Выдан клиенту» — и старые строки не совпадают с новыми. Плюс опечатки, регистр, ё/е.' },
    { t: 'Число 1–6 без расшифровки в словаре', why: 'Через месяц никто не помнит, что такое 4. Число допустимо только вместе со справочником.' },
    { t: 'Свободный текст без ограничений — так гибче', why: 'Гибкость для мусора: «готов», «Готов», «готово», «ready».' }] };
  function enumEval(a) {
    const m = (a && a.m) || {};
    const rows = EN_ROWS.map(r => { const g = m[r.id]; return { r, g, st: !g ? 'none' : g === r.ok ? 'ok' : (r.alt && r.alt[g]) ? 'warn' : 'bad' }; });
    const ms = rows.reduce((s, x) => s + (x.st === 'ok' ? 1 : x.st === 'warn' ? 0.5 : 0), 0) / rows.length;
    const q = ui.quizScore(STORE_Q, a && a.q);
    return { rows, ms, q, score: 0.75 * ms + 0.25 * q.score };
  }
  const enumTask = {
    id: 'enum', title: 'Статусы Марины Олеговны → перечисление work_order.status',
    simple: howField.simple,
    lead: ui.brief({
      situation: 'Марина Олеговна рассказывает, как живёт машина на станции, — своими словами. Глеб: «Мне нужны коды. Что из этого статус заказ-наряда, а что нет?» Лиза: «И что делать с тем, чего в списке нет?»',
      todo: [
        'Сопоставьте каждую фразу Марины с кодом work_order.status — или отметьте, что это не статус заказ-наряда, или что подходящего значения нет.',
        'Ответьте, как хранить перечисление в базе.',
        'По желанию — проверьте в учебной базе, что CHECK не пускает чужой код.',
        'Нажмите «Проверить». Засчитывается от 80 %.'
      ],
      lookTitle: 'Перечисление из словаря',
      look: WO_E.map(e => `<code>${e[0]}</code> ${esc(e[1])}`).join(' · ') + '. Статус описывает <b>состояние документа</b>, а не каждое событие: оплата живёт в payment, находки — в extra_offer.'
    }),
    blank: () => ({ m: {}, q: [] }),
    reference: () => ({ m: Object.fromEntries(EN_ROWS.map(r => [r.id, r.ok])), q: [0] }),
    render(el, ctx) {
      el.classList.add('mdic-root');
      const a = ctx.ans; a.m = a.m || {};
      const ro = ctx.readonly;
      let reveal = null;
      if (ctx.result || ro) { reveal = {}; enumEval(a).rows.forEach(x => { if (x.st !== 'none' || ro) reveal[x.r.id] = { s: x.st === 'none' ? 'bad' : x.st, why: x.st === 'warn' ? x.r.alt[x.g] : x.r.why }; }); }
      el.innerHTML = `<div class="stack">${ui.say('marina', 'Да как живёт… Приняли, оформили — механик поднял — нашли что-то, ждём клиента — сделали, позвонили — забрал. Иногда ждём запчасть, иногда клиент передумал.')}<div data-m></div><div data-q></div>
        <div class="card flat"><p><b>Проверка в учебной базе</b> (необязательно): попробуйте записать в заказ-наряд статус, которого нет в перечислении.</p>${ui.code("UPDATE work_order\nSET status = 'waiting_parts'\nWHERE id = 1;", 'sql')}<div class="row"><button type="button" class="btn sm" data-try>Выполнить на копии базы</button></div><div data-res></div></div></div>`;
      ui.match(TR.$('[data-m]', el), { rows: EN_ROWS.map(r => ({ id: r.id, t: esc(r.t) })), choices: EN_CHOICES, value: a.m, reveal, readonly: ro, placeholder: 'Код статуса…', onChange: v => { a.m = v; ctx.save(); } });
      ui.quiz(TR.$('[data-q]', el), Object.assign({}, STORE_Q, { value: a.q, readonly: ro, reveal: ctx.result || ro ? true : null, onChange: v => { a.q = v; ctx.save(); } }));
      TR.on(el, 'click', '[data-try]', async () => {
        const out = TR.$('[data-res]', el); out.innerHTML = '<div class="small dim">Загружаю базу…</div>';
        try {
          const r = await tryRun("UPDATE work_order SET status = 'waiting_parts' WHERE id = 1;");
          out.innerHTML = TR.db.resultHTML(r) + ui.note('info', 'Что это значит', r.ok ? 'База приняла значение — значит, CHECK нет. Так быть не должно.' : 'CHECK не пустил новое значение. Чтобы добавить waiting_parts, нужно решение Марины Олеговны, новая версия словаря и миграция — а приложению Даши — новое русское название.');
        } catch (e) { out.innerHTML = dbFail(e); }
      });
    },
    check(ans) {
      const r = enumEval(ans), notes = [];
      notes.push({ ok: r.ms >= 0.8 ? true : r.ms >= 0.6 ? 'warn' : false, html: `Фразы: верно ${r.rows.filter(x => x.st === 'ok').length} из ${EN_ROWS.length}${r.rows.some(x => x.st === 'warn') ? ', частично — ' + r.rows.filter(x => x.st === 'warn').length : ''}.` });
      r.rows.filter(x => x.st === 'bad' || x.st === 'warn').forEach(x => notes.push({ ok: x.st === 'warn' ? 'warn' : false, html: `${esc(x.r.t)} — ${esc(x.st === 'warn' ? x.r.alt[x.g] : x.r.why)}` }));
      if (r.rows.some(x => x.st === 'none')) notes.push({ ok: 'warn', html: 'Не все фразы сопоставлены.' });
      notes.push({ ok: r.q.ok, html: r.q.ok ? 'Хранение: код + CHECK + русские названия в словаре — верно.' : 'Хранение: код должен быть стабильным и проверяемым базой, а русские названия — жить в словаре.' });
      const askBad = (ans.m || {}).m10 && (ans.m || {}).m10 !== 'ask';
      return {
        ok: r.score >= 0.8, score: r.score, notes,
        summary: `Перечисление: ${Math.round(r.ms * 100)} %, хранение: ${r.q.ok ? 'верно' : 'неверно'}.`,
        mentor: r.score >= 0.8 ? (askBad ? 'Засчитано. Но про запчасти: вы решили за Марину Олеговну. Такие вещи аналитик фиксирует вопросом, а не догадкой.' : null) : 'Отделяйте состояние документа от событий вокруг него. «Оплатил» — это платёж, «сфотографировал» — предложение. Статус отвечает на вопрос «где сейчас машина в нашем процессе?»'
      };
    },
    explain: `<p>Перечисление — это <b>договор о словах</b>. Марина говорит «забрал», в коде <code>closed</code>, на экране «Выдан» — и словарь данных связывает все три. Без него каждый экран и отчёт изобретает свои названия.</p>
      <ul class="checks">
        <li>Статус — состояние документа. События (фото, оплата, звонок) живут в своих таблицах и полях.</li>
        <li>Статус может возвращаться (in_progress ⇄ waiting_approval) — переходы записывают в словаре рядом со значениями.</li>
        <li>Если подходящего значения нет («ждём запчасть»), аналитик не придумывает его молча и не впихивает в похожее: это вопрос бизнесу, новая версия словаря, миграция, новый текст для приложения.</li>
        <li>Хранение: стабильный код + CHECK в базе + русские названия в словаре. Учебная база так и сделана (TR.db.ENUMS).</li>
      </ul>
      <p>Источники: ISO/IEC 11179 (домены значений); DAMA-DMBOK, «Справочные данные и мастер-данные»; Вигерс, гл. 13.</p>`,
    refNote: 'Частично засчитываются спорные, но объяснимые варианты: «ждём запчасть» как in_progress или open, «дозвонились» как waiting_approval.',
    report: ans => EN_ROWS.map(r => `- ${r.t} → ${((ans.m || {})[r.id]) || '—'}`).join('\n') + `\n- Хранение: ${((ans.q || [])[0] != null) ? STORE_Q.options[ans.q[0]].t : '—'}`
  };

  // =====================================================================
  // Теория 3. Именование, ПДн и хранение, версии
  // =====================================================================
  const NAMES = [
    ['Bookings', 'booking', 'Имя таблицы — в единственном числе и нижнем регистре: строка — это одна запись.'],
    ['StatusOfBooking', 'status', 'snake_case; имя таблицы в имени поля не повторяем — и так понятно: booking.status.'],
    ['client', 'client_id', 'Ссылка на другую таблицу — с суффиксом _id. Иначе непонятно, тут число или объект.'],
    ['create_date', 'created_at', 'Момент времени — суффикс _at и причастие: created_at, sent_at, decided_at.'],
    ['fio', 'full_name', 'Английские слова, без транслита: «fio», «summa», «nomer» читает не каждый разработчик.'],
    ['sum', 'amount', 'Не используйте ключевые слова и имена функций SQL: sum, date, order, user.'],
    ['active', 'is_active', 'Логическое поле — с is_ или has_: is_active, has_warranty.'],
    ['dt', 'paid_at', 'Имя — по смыслу, а не по типу: «dt», «val», «data» ничего не говорят.']
  ];
  const PD_LIST = () => S.flatMap(t => t.cols.filter(c => c.pd).map(c => `${t.name}.${c.n}`));
  const RET = [
    ['Персональные данные клиента (ФИО, телефон, email, госномер, VIN)', 'Пока действует согласие и аккаунт; при удалении аккаунта — обезличить', 'BR-15, 152-ФЗ'],
    ['Заказ-наряды, строки, предложения доп. работ, платежи, операции с баллами', '5 лет; при удалении аккаунта остаются (с обезличенным клиентом)', 'BR-16'],
    ['Фото доп. работ (файлы в хранилище)', '6 месяцев, до 10 МБ', 'НФТ проекта'],
    ['Записи (booking)', 'Не определено — вопрос Ольге Викторовне', '—'],
    ['Справочники (станции, услуги, запчасти)', 'Бессрочно; удаление — только архивом', 'Ссылки из документов']
  ];
  const CHG = [
    { t: 'Добавить необязательное поле extra_offer.found_by', br: false, who: 'Никого срочно: старые запросы и приложения не замечают нового поля. Записать в журнал изменений.' },
    { t: 'Добавить обязательное поле без значения по умолчанию', br: true, who: 'Глеба: миграция упадёт на существующих строках. Нужно значение по умолчанию или заполнение старых строк.' },
    { t: 'Переименовать booking.comment → booking.client_note', br: true, who: 'Всех: бэкенд, приложение Даши, отчёты Кирилла, интеграции. Лучше — новое поле + переходный период + удаление старого.' },
    { t: 'Добавить значение waiting_parts в work_order.status', br: true, who: 'Дашу и Нику: приложение не знает, как показать новый статус. Кирилла: отчёты по статусам. Лизу: новые тесты переходов.' },
    { t: 'Разрешить NULL в client.phone (для обезличивания)', br: true, who: 'Дашу и Глеба: код, который считает телефон всегда заполненным (логин, SMS), упадёт на обезличенных клиентах.' },
    { t: 'Уточнить описание поля, не меняя тип и правила', br: false, who: 'Никого — но версию словаря всё равно поднять: «что было написано на момент разработки» важно для споров.' }
  ];
  const howNames = {
    id: 'how-names', covers: ['rules', 'card'], title: 'Как это работает: именование, персональные данные и хранение, версии словаря', free: true, noReset: true,
    simple: {
      icon: '🏷️',
      plain: 'Имена полей пишут по одним правилам — тогда их угадываешь, не открывая словарь. Персональные данные отмечают прямо в словаре — тогда видно, что защищать и что стирать. А каждое изменение словаря получает номер версии — тогда понятно, кто и на что опирался.',
      analogy: 'Подписи на коробках при переезде: «Кухня — посуда — хрупкое». Один стиль на все коробки, отметка «хрупкое» и список, что и когда упаковали.',
      tech: 'Соглашения об именовании (naming conventions): snake_case, единственное число, суффиксы _id, _at, is_; классификация данных (персональные — 152-ФЗ, ст. 3), политика хранения (retention policy); версионирование схемы и словаря, обратная совместимость, миграции (Эмблер, Садаладж, «Рефакторинг баз данных»).'
    },
    lead: ui.brief({
      situation: 'Лиза нашла в чате: «А почему в одной таблице created_at, а в другой create_date?» Ольга Викторовна: «И мне нужен список, где у нас персональные данные. Роскомнадзор спросит». Глеб: «А если ты поменяешь словарь, как я узнаю?»',
      todo: [
        'Во вкладке «Именование» переключайте «было / стало».',
        'Во вкладке «ПДн и хранение» посмотрите перечень ПДн, собранный прямо из словаря, и сроки хранения.',
        'Во вкладке «Версии» нажимайте на изменения: ломают ли они совместимость и кого предупредить.'
      ],
      look: 'Признак ПДн и срок хранения — такие же атрибуты поля, как тип. Если они есть в словаре, перечень ПДн для ответственного собирается одним запросом, а не неделей опросов.'
    }),
    render(el) {
      el.classList.add('mdic-root');
      const tabs = document.createElement('div'); el.appendChild(tabs);
      ui.tabs(tabs, [
        { id: 'n', t: 'Именование', render: rNames },
        { id: 'p', t: 'ПДн и хранение', render: rPd },
        { id: 'v', t: 'Версии', render: rVer }
      ]);
      el.insertAdjacentHTML('beforeend', `<div class="stack" style="margin-top:12px">
        ${ui.note('warn', 'Типичные ошибки', '<ul class="checks"><li class="bad">Смесь стилей: workOrderId, work_order_id, WorkOrderID в одной базе.</li><li class="bad">ПДн отмечены «в голове»: свободный комментарий клиента с номером телефона никто не учёл.</li><li class="bad">Словарь меняют без версии: Лиза тестирует по старому, Глеб пишет по новому.</li><li class="bad">Переименование поля «просто для красоты» без анализа влияния.</li></ul>')}
        <details class="more"><summary>Как об этом спрашивают на собеседовании</summary><div>
          <p><b>«Какие соглашения об именовании вы используете?»</b> snake_case, единственное число для таблиц, _id для ссылок, _at для моментов времени, is_/has_ для логических, английские слова без транслита, без ключевых слов SQL. Главное — одно соглашение на проект, записанное в начале словаря.</p>
          <p><b>«Как отражаете персональные данные в модели?»</b> Признак ПДн у поля, срок и основание хранения, правило обезличивания; минимизация — не копировать ПДн по таблицам.</p>
          <p><b>«Как управляете изменениями модели данных?»</b> Версия словаря и журнал изменений; для ломающих изменений — анализ влияния, миграция, переходный период.</p>
        </div></details></div>`);

      function rNames(box) {
        let m = 'both';
        box.innerHTML = `<div class="stack"><div class="row"><span class="small dim">Показать:</span>${ui.seg('m', [{ v: 'bad', t: 'Было' }, { v: 'both', t: 'Было → стало' }], m, 'accent')}</div><div class="stack tight" data-out></div>
          ${ui.note('info', 'Соглашение — первая страница словаря', '<p>«Таблицы — существительное в единственном числе, snake_case. Первичный ключ — id. Ссылка — &lt;таблица&gt;_id. Момент времени — &lt;причастие&gt;_at (UTC). Логическое — is_&lt;…&gt;. Деньги — DECIMAL(10,2), валюта — в описании.»</p><p class="small">Даже в учебной базе есть исключение: <code>employee.hired_at</code> — это дата (DATE), а не момент времени. По соглашению лучше <code>hired_on</code> — или явная оговорка в словаре.</p>')}</div>`;
        function draw() {
          TR.$('[data-out]', box).innerHTML = NAMES.map(n => m === 'bad' ? `<div class="card flat"><p><code>${esc(n[0])}</code></p></div>` : `<div class="card flat"><div class="mdic-pair"><code class="b">${esc(n[0])}</code><span>→</span><code class="g">${esc(n[1])}</code></div><p class="small">${esc(n[2])}</p></div>`).join('');
        }
        ui.onSeg(box, (k, v) => { m = v; draw(); });
        draw();
      }
      function rPd(box) {
        const list = PD_LIST();
        box.innerHTML = `<div class="stack"><p>Перечень полей с признаком ПДн — собран из словаря учебной базы автоматически (${list.length} ${TR.plural(list.length, 'поле', 'поля', 'полей')}):</p>
          <div class="mdic-chips">${list.map(x => `<span class="chip warn"><code>${esc(x)}</code></span>`).join('')}</div>
          ${ui.note('warn', 'Чего в перечне нет, но стоит подумать', '<p><code>booking.comment</code> — свободный текст: клиент может написать «перезвоните жене, +7…». <code>extra_offer.photo_url</code> — на фото может быть госномер. Такие поля отмечают «может содержать ПДн».</p>')}
          ${ui.table(['Что', 'Срок хранения', 'Основание'], RET.map(r => r.map(esc)))}
          ${ui.note('info', 'Хранение — это и про удаление', 'Срок хранения отвечает на два вопроса: «сколько минимум держим» (BR-16, налоговый и бухгалтерский учёт) и «когда обязаны удалить или обезличить» (152-ФЗ). Для клиента «Искры» они противоречат друг другу — и решение «документ остаётся, человек обезличивается» тоже записывается в словарь.')}</div>`;
      }
      function rVer(box) {
        let cur = 0;
        box.innerHTML = `<div class="stack">
          ${ui.table(['Версия', 'Дата', 'Что изменилось'], [
            ['1.0', '25.01.2027', 'Первая версия: 15 таблиц по ERD.'],
            ['1.1', '29.01.2027', 'extra_offer: + found_by, created_by (BR-7); + work_order_status_history.'],
            ['1.2', 'план', 'client.phone, car.plate: допускают NULL — для обезличивания (BR-15, BR-16).'],
            ['1.3', 'план', 'service: + is_active, archived_at — архив вместо удаления.']
          ])}
          <p>Какое изменение ломает совместимость? Нажмите:</p>
          <div class="mdic-tests">${CHG.map((c, i) => `<button type="button" class="mdic-test" data-c="${i}" aria-pressed="${i === cur}">${esc(c.t)}</button>`).join('')}</div><div data-out></div></div>`;
        function draw() {
          TR.$$('[data-c]', box).forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.c === cur)));
          const c = CHG[cur];
          TR.$('[data-out]', box).innerHTML = ui.note(c.br ? 'warn' : 'ok', c.br ? 'Ломает совместимость' : 'Не ломает', `<p><b>Кого предупредить:</b> ${esc(c.who)}</p>`);
        }
        TR.on(box, 'click', '[data-c]', (e, b) => { cur = +b.dataset.c; draw(); });
        draw();
      }
    }
  };

  // =====================================================================
  // Практика 4. ПДн и бизнес-правила
  // =====================================================================
  const PD_F = [
    { f: 'client.full_name', ok: [true], why: 'ФИО — прямо названо в BR-15.' },
    { f: 'client.phone', ok: [true], why: 'Телефон — ПДн (BR-15), к тому же логин.' },
    { f: 'client.email', ok: [true], why: 'Email — ПДн (BR-15).' },
    { f: 'car.plate', ok: [true], why: 'Госномер — ПДн по BR-15: по нему находят владельца.' },
    { f: 'car.vin', ok: [true], why: 'VIN — ПДн по BR-15.' },
    { f: 'employee.full_name', ok: [true], why: 'Сотрудники — тоже субъекты ПДн.' },
    { f: 'car.brand', ok: [false], why: '«Kia» сама по себе человека не определяет.' },
    { f: 'car.mileage', ok: [false], why: 'Пробег без госномера и VIN — не ПДн.' },
    { f: 'company.inn', ok: [false], why: 'ИНН юридического лица — не персональные данные (у ИП было бы иначе).' },
    { f: 'work_order.number', ok: [false], why: 'Номер документа — не ПДн.' },
    { f: 'payment.amount', ok: [false], why: 'Сумма сама по себе — не ПДн.' },
    { f: 'booking.comment', ok: [true, false], why: 'Свободный текст: может содержать ПДн. Лучше отметить «может содержать» — засчитывается любой ответ.' },
    { f: 'extra_offer.photo_url', ok: [true, false], why: 'На фото может попасть госномер. Спорно — засчитывается любой ответ, если вы понимаете риск.' }
  ];
  const BRS = [
    ['BR-1', 'сетка 30 минут'], ['BR-2', 'за 2 часа, до 30 дней'], ['BR-3', 'отмена за 3 часа'], ['BR-4', 'неявка, предоплата'],
    ['BR-5', 'цена «от»'], ['BR-6', 'доп. работы только с согласия'], ['BR-7', 'кто находит и кто формирует'], ['BR-8', '20 минут, «Истекло»'],
    ['BR-9', 'лимит корпоративных'], ['BR-10', 'оплата после «Готов»'], ['BR-11', 'бонусы'], ['BR-12', 'запчасти и резерв'],
    ['BR-13', '«Готов», хранение машины'], ['BR-14', 'гарантия'], ['BR-15', 'персональные данные'], ['BR-16', 'хранение 5 лет']
  ].map(b => ({ v: b[0], t: `${b[0]} — ${b[1]}` }));
  const BR_ROWS = [
    { id: 'b1', t: '<code>booking.end_at</code> = start_at + сумма нормо-часов услуг, вверх до 30 минут', ok: 'BR-1' },
    { id: 'b2', t: 'Для source = app / site: <code>booking.start_at</code> ≥ created_at + 2 ч и ≤ created_at + 30 дней', ok: 'BR-2' },
    { id: 'b3', t: '<code>booking.status</code> → cancelled без последствий, только если сейчас ≤ start_at − 3 ч', ok: 'BR-3' },
    { id: 'b4', t: '<code>booking.status</code> = new (ждёт предоплаты), если client.no_show_count ≥ 2', ok: 'BR-4' },
    { id: 'b5', t: 'Строка <code>work_item</code> с extra_offer_id создаётся, только если extra_offer.status = approved', ok: 'BR-6' },
    { id: 'b6', t: '<code>extra_offer.status</code> = expired, если основные работы закончены, а решения нет', ok: 'BR-8' },
    { id: 'b7', t: '<code>extra_offer.decided_by</code> = auto допустимо, только если amount ≤ company.auto_approve_limit', ok: 'BR-9' },
    { id: 'b8', t: '<code>payment</code> со способом card / sbp создаётся, только когда work_order.status = ready', ok: 'BR-10' },
    { id: 'b9', t: '<code>bonus_tx</code> (accrual): amount = 5 % от строк kind = service; при client.company_id не NULL — не создаётся', ok: 'BR-11' },
    { id: 'b10', t: '<code>work_order</code>, <code>payment</code>: физическое удаление запрещено', ok: 'BR-16' }
  ];
  function rulesEval(a) {
    const pd = (a && a.pd) || {}, m = (a && a.m) || {};
    const pr = PD_F.map(x => ({ x, g: !!pd[x.f], ok: x.ok.includes(!!pd[x.f]) }));
    const br = BR_ROWS.map(r => ({ r, g: m[r.id], ok: m[r.id] === r.ok }));
    const ps = pr.filter(x => x.ok).length / pr.length, bs = br.filter(x => x.ok).length / br.length;
    return { pr, br, ps, bs, score: 0.5 * ps + 0.5 * bs, anyPd: Object.keys(pd).some(k => pd[k]) };
  }
  const rulesTask = {
    id: 'rules', title: 'Отметьте персональные данные и свяжите правила полей с BR-*',
    simple: howNames.simple,
    lead: ui.brief({
      situation: 'Ольга Викторовна просит перечень ПДн «к среде». Лиза — чтобы у каждого правила в словаре был номер BR: «по номеру я найду тест, а по тесту — требование». Вера: «Две колонки словаря за одно утро. Поехали».',
      todo: [
        'Часть 1. Нажмите на поля, которые содержат персональные данные (BR-15).',
        'Часть 2. Для каждого правила поля выберите бизнес-правило BR-*, из которого оно следует.',
        'Нажмите «Проверить». Засчитывается от 80 % по двум частям вместе.'
      ],
      lookTitle: 'Подсказка',
      look: 'ПДн — сведения, по которым можно определить конкретного человека: прямо (ФИО, телефон) или через связанные данные (госномер, VIN). Данные юрлица и «обезличенные» числа — нет. Для правил: читайте поле и условие и ищите, о чём правило — время записи, отмена, неявка, согласие, оплата, бонусы, хранение.'
    }),
    blank: () => ({ pd: {}, m: {} }),
    reference: () => ({ pd: Object.fromEntries(PD_F.filter(x => x.ok[0]).map(x => [x.f, true])), m: Object.fromEntries(BR_ROWS.map(r => [r.id, r.ok])) }),
    render(el, ctx) {
      el.classList.add('mdic-root');
      const a = ctx.ans; a.pd = a.pd || {}; a.m = a.m || {};
      const ro = ctx.readonly, ev = (ctx.result || ro) ? rulesEval(a) : null;
      el.innerHTML = `<div class="stack"><div class="eyebrow">Часть 1. Персональные данные</div><div class="mdic-chips" data-pd></div><div data-pdw></div>
        <div class="eyebrow">Часть 2. Правила полей → BR-*</div><div data-br></div></div>`;
      function drawPd() {
        TR.$('[data-pd]', el).innerHTML = PD_F.map(x => { const r = ev && ev.pr.find(y => y.x.f === x.f); return `<button type="button" class="mdic-chip ${r ? (x.ok.length > 1 ? '' : r.ok ? 'ok' : 'bad') : ''}" data-f="${x.f}" aria-pressed="${!!a.pd[x.f]}" ${ro ? 'disabled' : ''}><code>${x.f}</code></button>`; }).join('');
        TR.$('[data-pdw]', el).innerHTML = ev ? `<div class="stack tight">${ev.pr.filter(x => !x.ok || x.x.ok.length > 1 || ro).map(x => `<div class="small"><code>${x.x.f}</code> — ${esc(x.x.why)}</div>`).join('')}</div>` : '';
      }
      TR.on(el, 'click', '[data-f]', (e, b) => { if (ro) return; const f = b.dataset.f; a.pd[f] = !a.pd[f]; if (!a.pd[f]) delete a.pd[f]; ctx.save(); b.setAttribute('aria-pressed', String(!!a.pd[f])); });
      drawPd();
      let reveal = null;
      if (ev) { reveal = {}; ev.br.forEach(x => { if (x.g || ro) reveal[x.r.id] = { s: x.ok ? 'ok' : 'bad', why: x.ok ? '' : `Это ${x.r.ok}.` }; }); }
      ui.match(TR.$('[data-br]', el), { rows: BR_ROWS.map(r => ({ id: r.id, t: r.t })), choices: BRS, value: a.m, reveal, readonly: ro, placeholder: 'Бизнес-правило…', onChange: v => { a.m = v; ctx.save(); } });
    },
    check(ans) {
      const r = rulesEval(ans), notes = [];
      notes.push({ ok: r.ps >= 0.8 ? true : r.ps >= 0.6 ? 'warn' : false, html: `ПДн: верно по ${r.pr.filter(x => x.ok).length} из ${PD_F.length} полей.` });
      r.pr.filter(x => !x.ok).forEach(x => notes.push({ ok: false, html: `<code>${x.x.f}</code> ${x.g ? 'отмечено как ПДн' : 'не отмечено'}: ${esc(x.x.why)}` }));
      notes.push({ ok: r.bs >= 0.8 ? true : r.bs >= 0.6 ? 'warn' : false, html: `Правила: верно ${r.br.filter(x => x.ok).length} из ${BR_ROWS.length}.` });
      r.br.filter(x => !x.ok).forEach(x => notes.push({ ok: x.g ? false : 'warn', html: `${x.r.t.replace(/<[^>]+>/g, '')} — ${x.g ? `не ${esc(x.g)}, а ` : ''}${x.r.ok}.` }));
      const inn = !!(ans.pd || {})['company.inn'];
      return {
        ok: r.score >= 0.8, score: r.score, notes,
        summary: `ПДн: ${Math.round(r.ps * 100)} %, правила: ${Math.round(r.bs * 100)} %.`,
        mentor: r.score >= 0.8 ? null : inn ? 'ИНН «Шашки» — это реквизит компании, не человека. Персональные данные — про физических лиц: клиентов и сотрудников.' : 'Для правил ищите ключевые слова: «30 минут» — BR-1, «2 часа / 30 дней» — BR-2, «3 часа» — BR-3, «неявки» — BR-4, «согласие» — BR-6, «лимит» — BR-9, «5 %» — BR-11, «удаление» — BR-16.'
      };
    },
    explain: `<p>Две колонки словаря, которые чаще всего пустуют, — и именно они нужны людям за пределами разработки:</p>
      <ul class="checks">
        <li><b>ПДн</b>: 7 полей в учебной базе (клиент, машина, сотрудник). Плюс «может содержать» — свободные тексты и фото. Отсюда — перечень для ответственного за ПДн, правила обезличивания и права доступа (механику не нужен телефон клиента).</li>
        <li><b>BR-*</b> у правила поля — это трассировка: от поля к правилу, от правила к требованию и тесту. Поменяет Тимур Рашидович BR-3 с 3 часов на 6 — по словарю видно, какое поле и какое ограничение трогать.</li>
        <li>Правила бывают «в базе» (CHECK, NOT NULL) и «в коде» (BR-2: время до записи, BR-9: лимит). В словаре пишут оба вида и где именно проверяется.</li>
      </ul>
      <p>Источники: 152-ФЗ «О персональных данных», ст. 3 (определение) и ст. 18.1 (меры); BABOK v3, 10.12 и 10.9 «Анализ бизнес-правил»; Росс, «Принципы бизнес-правил».</p>`,
    refNote: 'Для booking.comment и extra_offer.photo_url засчитывается любой ответ — это поля «может содержать ПДн».',
    report: ans => `- ПДн: ${Object.keys(ans.pd || {}).filter(k => ans.pd[k]).join(', ') || '—'}\n` + BR_ROWS.map(r => `- ${r.t.replace(/<[^>]+>/g, '')} → ${(ans.m || {})[r.id] || '—'}`).join('\n')
  };

  // =====================================================================
  // Практика 5. Описание поля своими словами
  // =====================================================================
  const C_RUBRIC = [
    'Имя, русское название и смысл: момент начала визита; тип DATETIME (в проде — с часовым поясом), обязательное (NOT NULL), без значения по умолчанию',
    'Часовой пояс: хранится в UTC (в учебной базе — по Казани без пояса), показывается по времени станции',
    'Правила: шаг сетки 30 минут (BR-1), в часы работы станции 08:00–21:00, онлайн — не раньше чем через 2 часа и не дальше 30 дней (BR-2)',
    'Связи и источник: end_at > start_at (end_at = start_at + нормо-часы); заполняет клиент (приложение, сайт) или оператор; перенос меняет поле, отмена и перенос — за 3 часа (BR-3); пример значения',
    'Не ПДн; хранится вместе с записью; что проверить: граничные значения (ровно 2 часа, 30-й и 31-й день, 20:30, не кратно 30 минутам)'
  ];
  const C_REF = 'Поле booking.start_at — «Начало записи».\n\nСмысл: момент, на который клиент записан на станцию; от него считаются неявка (15 минут, BR-4), бесплатная отмена и перенос (за 3 часа, BR-3).\nТип: DATETIME; в PostgreSQL — timestamptz, хранится в UTC, показывается по времени станции (Казань, UTC+3). В учебной базе — строка по-казански без пояса, это упрощение.\nОбязательность: NOT NULL, значения по умолчанию нет.\nОграничения: кратно 30 минутам (сетка BR-1); не раньше открытия станции (08:00) и так, чтобы end_at было не позже закрытия (21:00); для онлайн-записи (source = app, site) — не раньше чем через 2 часа от момента записи и не дальше 30 дней (BR-2). Для записи по телефону оператор может записать и ближе — уточнить у Марины Олеговны.\nСвязанные поля: end_at = start_at + сумма нормо-часов услуг, округлённая вверх до 30 минут; end_at > start_at (в базе такого CHECK нет — в данных уже есть кривая запись, предлагаю добавить).\nИсточник: клиент в приложении или на сайте, оператор колл-центра; меняется при переносе.\nПример: 2027-02-11 09:30 по времени станции (06:30 UTC).\nПДн: нет. Хранение: вместе с записью.\nДля тестов: запись ровно через 2 часа и через 1 ч 59 мин, на 30-й и 31-й день, на 20:30 при услуге на 1 час, на 09:15.';
  const cardTask = {
    id: 'card', title: 'Опишите поле booking.start_at для словаря своими словами',
    lead: ui.brief({
      situation: 'Лиза: «Самое коварное поле — время начала. У меня по нему будет тестов двадцать. Опиши его так, чтобы я не пришла с вопросами». Глеб: «И мне — какой тип и где проверять».',
      todo: [
        'Напишите описание поля от 300 символов: смысл, тип и часовой пояс, обязательность, ограничения с BR-*, связанные поля, источник, пример, ПДн, что проверить.',
        'Нажмите «Проверить с Верой (Claude)» или «Сверить с эталоном самому» и отметьте раскрытые пункты. Засчитывается от 60 %.'
      ],
      lookTitle: 'На что опереться',
      look: 'BR-1 (сетка 30 минут, длительность = сумма нормо-часов вверх до 30 мин), BR-2 (за 2 часа, до 30 дней), BR-3 (отмена за 3 часа), BR-4 (неявка через 15 минут). Станции работают 08:00–21:00. Учебная база хранит время по Казани без пояса.'
    }),
    blank: () => ({ j: {} }),
    reference: () => ({ j: { text: C_REF, self: C_RUBRIC.map(() => true) } }),
    render(el, ctx) {
      el.classList.add('mdic-root');
      el.insertAdjacentHTML('beforeend', ui.say('liza', 'Напиши так, чтобы по описанию я сразу видела границы: что ровно на границе — можно, а что на минуту дальше — нельзя.'));
      const j = document.createElement('div'); j.style.marginTop = '12px'; el.appendChild(j);
      ui.justify(j, {
        id: 'mdic-card', q: 'Описание поля booking.start_at для словаря данных',
        qPlain: 'Опишите для словаря данных поле «начало записи» (booking.start_at) в системе онлайн-записи в автосервис: смысл, тип и часовой пояс, обязательность, ограничения с номерами бизнес-правил (сетка 30 минут, часы работы 08:00–21:00, онлайн не раньше чем за 2 часа и не дальше 30 дней), связь с полем окончания, источник значения, пример, персональные ли это данные, какие граничные значения проверить.',
        rubric: C_RUBRIC, reference: C_REF, value: ctx.ans.j, readonly: ctx.readonly, minLen: 300,
        placeholder: 'booking.start_at — «Начало записи». Смысл: …',
        onChange: v => { ctx.ans.j = v; ctx.save(); ctx.decide('Описание booking.start_at', v.text || ''); }
      });
    },
    check(ans) {
      const s = ui.justifyScore(ans && ans.j);
      return {
        ok: s >= 0.6, score: s,
        summary: s ? `Оценка описания: ${Math.round(s * 100)} %.` : 'Напишите описание (от 300 символов) и проверьте его с Верой или сверьте с эталоном сами.',
        notes: s && s < 0.6 ? [{ ok: false, html: 'В описании поля времени главное — пояс и границы: в каком времени хранится, от чего считаются 2 часа и 30 дней, кратность 30 минутам. Без этого Лиза не напишет граничные тесты.' }] : []
      };
    },
    explain: '<p>Описание поля времени — лучшая проверка словаря: в нём сходятся тип, часовой пояс, сетка, часы работы, окно записи и связанные поля. Хорошее описание <b>сразу даёт тесты</b>: «ровно 2 часа — можно, 1 ч 59 мин — нельзя», «30-й день — можно, 31-й — нельзя», «09:15 — нельзя».</p><p>Заметьте, как описание выявило два пробела: CHECK (end_at > start_at) в базе нет, а одна кривая запись уже есть; и не сказано, действует ли BR-2 для записи по телефону. Это и есть ценность словаря: пробелы становятся вопросами с адресатом, а не дефектами в проде. В среду — SQL: Тимур Рашидович просит цифры, и словарь вам пригодится сразу.</p>',
    report: ans => (ans && ans.j && ans.j.text) ? ans.j.text : '—'
  };

  // =====================================================================
  TR.stage({
    id: ID,
    when: 'вторник, 2 февраля, 10:00 · словарь данных для Глеба и Лизы',
    intro: [
      { who: 'gleb', html: 'За неделю в чате 43 вопроса «а это поле может быть пустым?». Я хочу один документ. Открыл — и всё понятно: тип, ключ, что по умолчанию, какие значения.' },
      { who: 'liza', html: 'А мне — границы и правила. По словарю я пишу тесты: каждое ограничение — минимум два теста, «можно» и «нельзя».' },
      { who: 'olga', html: 'И пусть там будет отмечено, где персональные данные и сколько что хранится. Это не мне любопытно — это 152-ФЗ.' },
      { who: 'vera', html: 'Это словарь данных — паспорт базы. Сегодня заполним его для записи, найдём ошибки в чужом, договоримся о статусах и именах, отметим ПДн и правила. А самое коварное поле — время начала записи — опишете вы.' }
    ],
    facts: ['F-slot', 'F-cutoff', 'F-cancel', 'F-noshow-rule', 'F-pay', 'F-pd', 'F-retention'],
    glossary: [
      { term: 'Словарь данных (Data Dictionary)', simple: 'Справочник по базе: что значит каждое поле и какие значения в нём допустимы.', tech: 'Набор метаданных о таблицах и атрибутах: определение, тип, обязательность, ключи, ограничения, домены значений, источник, правила (BABOK v3, 10.12).' },
      { term: 'Метаданные', simple: '«Данные о данных»: не сам телефон Елены, а то, что поле phone — строка до 20 символов и ПДн.', tech: 'Описание структуры, смысла и правил данных (DAMA-DMBOK; ISO/IEC 11179).' },
      { term: 'NULL / NOT NULL', simple: 'Может ли поле быть пустым.', tech: 'NULL — отсутствие значения; NOT NULL — ограничение обязательности.' },
      { term: 'Значение по умолчанию (DEFAULT)', simple: 'Что база подставит, если значение не передали.', tech: 'DEFAULT в определении столбца: booking.status DEFAULT \'confirmed\'.' },
      { term: 'Ограничение CHECK', simple: 'Правило, которое база проверяет сама при каждой записи.', tech: 'Ограничение целостности на уровне столбца или строки: CHECK (status IN (…)), CHECK (end_at > start_at).' },
      { term: 'Перечисление (домен значений)', simple: 'Закрытый список допустимых значений с русскими названиями.', tech: 'Enumeration / value domain: код + наименование; хранится как CHECK, справочная таблица или тип ENUM.' },
      { term: 'Персональные данные (ПДн)', simple: 'Всё, по чему можно узнать конкретного человека.', tech: 'Любая информация, относящаяся к прямо или косвенно определённому физическому лицу (152-ФЗ, ст. 3). В «Искре» — BR-15.' },
      { term: 'Соглашение об именовании', simple: 'Общие правила, как называть таблицы и поля.', tech: 'Naming convention: snake_case, единственное число, _id, _at, is_; фиксируется в начале словаря.' },
      { term: 'Срок хранения', simple: 'Сколько данные обязаны храниться — и когда их нужно удалить.', tech: 'Retention policy: минимальный срок (BR-16, учёт) и обязанность уничтожить или обезличить (152-ФЗ, ст. 21).' },
      { term: 'Версия словаря', simple: 'Номер и дата изменения словаря, чтобы все опирались на одно и то же.', tech: 'Версионирование метаданных и журнал изменений; ломающие изменения — с анализом влияния и миграцией (Эмблер, «Рефакторинг баз данных»).' }
    ],
    outro: 'У «Искры» есть словарь данных: booking описан до значения по умолчанию, ошибки в чужом словаре payment найдены (включая номер карты, который хранить нельзя), статусы Марины Олеговны превращены в коды с русскими названиями, а «ждём запчасть» стало вопросом с адресатом. Ольга Викторовна получила перечень ПДн, Лиза — номера BR у каждого правила, Глеб — описание start_at и предложение добавить CHECK (end_at > start_at). В среду — SQL: Тимур Рашидович просит цифры.',
    tasks: [howWhy, howField, howNames, fillTask, bugsTask, enumTask, rulesTask, cardTask]
  });
})();
