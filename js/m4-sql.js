/* Модуль 4, занятие 5: SQL для системного аналитика.
   Теория: how-select — анатомия запроса (кликабельные части), конструктор SELECT/WHERE/ORDER BY/LIMIT/DISTINCT
   с LIKE/IN/BETWEEN на живой базе, даты в SQLite (date, strftime, julianday, datetime), зачем SQL аналитику;
   how-group — агрегаты и NULL на мини-таблице, порядок выполнения запроса по шагам, WHERE против HAVING,
   целочисленное деление; how-join — INNER и LEFT JOIN (пять режимов на мини-таблицах, условие в ON и в WHERE),
   размножение строк при JOIN, трёхзначная логика NULL, «найти сирот» через LEFT JOIN … IS NULL.
   Практика: «Тимур Рашидович просит цифры» — четыре запроса в живой консоли (неявки по станциям, средний чек,
   доля согласованных доп. работ, минуты до ответа клиента); предсказать результат восьми запросов и сверить в
   консоли; найти и исправить ошибку в четырёх запросах (= NULL, INNER вместо LEFT, WHERE вместо HAVING,
   размножение строк); лаборатория «можно ли верить цифрам» — четыре аномалии данных, решение → последствия;
   проверка BR-4 запросами («за период» ≠ «подряд», запрос-сторож) и объяснение Лизе своими словами (ui.justify). */
'use strict';
(function () {
  const TR = window.TR, ui = TR.ui, esc = TR.esc;
  const ID = 'm4-sql';

  if (!document.getElementById('m4sq-css')) document.head.insertAdjacentHTML('beforeend', `<style id="m4sq-css">
    .m4sq-root, .m4sq-root .stack > *, .m4sq-root .card > * { min-width: 0; }
    .m4sq-root details.more > div { grid-template-columns: minmax(0, 1fr); }
    .m4sq-con { display: grid; gap: 8px; min-width: 0; }
    .m4sq-ed { font: 13px/1.55 var(--f-mono); background: var(--code-bg); min-height: 120px; white-space: pre; overflow-x: auto; overflow-wrap: normal; tab-size: 2; }
    .m4sq-bar { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
    .m4sq-pre { display: flex; flex-wrap: wrap; gap: 6px; }
    .m4sq-pre .chip { white-space: normal; text-align: left; }
    .m4sq-out:empty { display: none; }
    .m4sq-sch > summary { font-size: 13px; }
    .m4sq-anat { font: 13.5px/1.9 var(--f-mono); background: var(--code-bg); border: 1px solid var(--border); border-radius: 10px; padding: 10px 12px; display: flex; flex-wrap: wrap; gap: 4px 6px; }
    .m4sq-anat button { font: inherit; border: 1px dashed var(--border-strong); background: transparent; color: var(--text); border-radius: 6px; padding: 0 6px; cursor: pointer; }
    .m4sq-anat button[aria-pressed="true"] { border-style: solid; border-color: var(--accent); background: var(--accent-soft); }
    .m4sq-anat .kw { color: var(--tok-k); font-weight: 600; }
    .m4sq-two { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 10px; }
    .m4sq-three { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
    .m4sq-opts { display: flex; flex-wrap: wrap; gap: 6px; }
    .m4sq-opt[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); color: var(--text); }
    .m4sq-opt.ok { border-color: var(--ok); background: var(--ok-soft); }
    .m4sq-opt.bad { border-color: var(--bad); background: var(--bad-soft); }
    .m4sq-item { border: 1px solid var(--border); border-radius: 12px; padding: 12px; background: var(--surface); display: grid; gap: 8px; min-width: 0; }
    .m4sq-item.ok { border-color: color-mix(in srgb, var(--ok) 60%, var(--border)); }
    .m4sq-item.bad { border-color: color-mix(in srgb, var(--bad) 60%, var(--border)); }
    .m4sq-item.warn { border-color: color-mix(in srgb, var(--warn) 60%, var(--border)); }
    .m4sq-item h5 { margin: 0; font: 600 14.5px/1.3 var(--f-brand); display: flex; gap: 8px; flex-wrap: wrap; align-items: baseline; }
    .m4sq-n { font: 600 11px/1.4 var(--f-mono); color: var(--text-muted); letter-spacing: .06em; text-transform: uppercase; }
    .m4sq-why { font-size: 13px; color: var(--text-2); line-height: 1.45; }
    .m4sq-cols { font: 500 12px/1.4 var(--f-mono); color: var(--text-muted); }
    .m4sq-steps { display: grid; gap: 2px; font: 13px/1.6 var(--f-mono); background: var(--code-bg); border: 1px solid var(--border); border-radius: 10px; padding: 8px 10px; overflow-x: auto; }
    .m4sq-steps div { padding: 1px 8px; border-radius: 6px; white-space: pre; display: flex; gap: 10px; }
    .m4sq-steps div b { color: var(--text-muted); font-weight: 600; min-width: 18px; }
    .m4sq-steps div.on { background: var(--accent-soft); box-shadow: 0 0 0 1px var(--accent) inset; }
    .m4sq-steps div.done { opacity: .75; }
    .m4sq-steps div.todo { opacity: .4; }
    .m4sq-mini .sqltbl tr.off td { opacity: .38; text-decoration: line-through; }
    .m4sq-mini .sqltbl tr.hl td { background: var(--accent-soft) !important; }
    .m4sq-mini .sqltbl tr.grp td:first-child { box-shadow: 3px 0 0 var(--accent) inset; }
    .m4sq-big { font: 600 22px/1.1 var(--f-mono); color: var(--accent); }
    .m4sq-res { display: flex; flex-wrap: wrap; gap: 6px 14px; align-items: baseline; padding: 10px 12px; border-radius: 12px; background: var(--code-bg); border: 1px solid var(--border); }
    .m4sq-res code { font: 500 13px/1.4 var(--f-mono); color: var(--text-2); overflow-wrap: anywhere; }
    .m4sq-tl { display: grid; gap: 8px; }
    .m4sq-ev { display: grid; grid-template-columns: 110px minmax(0, 1fr); gap: 10px; padding: 9px 12px; border-radius: 10px; border: 1px solid var(--border); background: var(--surface); font-size: 13.5px; line-height: 1.45; }
    .m4sq-ev .d { font: 600 12px/1.35 var(--f-mono); color: var(--text-muted); }
    .m4sq-ev.ok { border-color: color-mix(in srgb, var(--ok) 55%, var(--border)); }
    .m4sq-ev.bad { border-color: color-mix(in srgb, var(--bad) 55%, var(--border)); background: color-mix(in srgb, var(--bad-soft) 60%, var(--surface)); }
    .m4sq-ev.warn { border-color: color-mix(in srgb, var(--warn) 55%, var(--border)); }
    .m4sq-acts { display: grid; gap: 6px; }
    .m4sq-act { text-align: left; border: 1px solid var(--border-strong); border-radius: 10px; padding: 8px 12px; background: var(--surface-2); color: var(--text); font-size: 13.5px; line-height: 1.4; width: 100%; }
    .m4sq-act[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); box-shadow: 0 0 0 1px var(--accent) inset; }
    .m4sq-act:disabled { cursor: default; }
    .m4sq-feat { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
    .m4sq-feat .chip { cursor: default; }
    .m4sq-nl { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px; }
    .m4sq-nl button { text-align: left; border: 1px solid var(--border); border-radius: 10px; padding: 8px 10px; background: var(--surface-2); color: var(--text); font: 12.5px/1.4 var(--f-mono); }
    .m4sq-nl button[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); }
    .m4sq-sum { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; }
    @media (max-width: 760px) {
      .m4sq-two { grid-template-columns: minmax(0, 1fr); }
      .m4sq-three, .m4sq-nl { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); }
      .m4sq-sum { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); }
    }
    @media (max-width: 460px) {
      .m4sq-three, .m4sq-nl, .m4sq-sum { grid-template-columns: minmax(0, 1fr); }
      .m4sq-ev { grid-template-columns: minmax(0, 1fr); gap: 2px; }
    }
  </style>`);

  // =====================================================================
  // Общие помощники: консоль, сравнение, мини-таблицы
  // =====================================================================
  // каждый запрос — на свежей копии базы: UPDATE и DELETE студента не портят данные следующим заданиям
  const exec = sql => (TR.db.runFresh ? TR.db.runFresh(sql) : TR.db.run(sql));
  const OFFLINE = 'Не удалось загрузить движок базы данных: sql.js подгружается из интернета (cdnjs). Проверьте подключение и нажмите «Выполнить» ещё раз — ваш запрос сохранён и никуда не делся.';
  // Живая SQL-консоль. o: { value, onChange, readonly, rows, tables, presets:[{t,sql}], placeholder, label, wrap, autorun, schema }
  function sqlCon(el, o) {
    let cur = o.value || '';
    el.innerHTML = `<div class="m4sq-con">
      ${o.presets && !o.readonly ? `<div class="m4sq-pre">${o.presets.map((p, i) => `<button type="button" class="chip" data-sqpre="${i}">${esc(p.t)}</button>`).join('')}</div>` : ''}
      ${o.readonly ? (cur ? ui.code(cur, 'sql') : '<div class="small dim">Запрос не написан.</div>') : `<textarea class="m4sq-ed" spellcheck="false" autocomplete="off" autocapitalize="off" rows="${o.rows || 5}" aria-label="${esc(o.label || 'SQL-запрос')}" placeholder="${esc(o.placeholder || 'SELECT …')}">${esc(cur)}</textarea>`}
      ${o.readonly ? '' : `<div class="m4sq-bar"><button type="button" class="btn sm primary" data-sqrun>▶ Выполнить</button><span class="small dim">или Ctrl+Enter</span></div>`}
      <div class="m4sq-out" data-sqout aria-live="polite"></div>
      ${o.schema === false ? '' : `<details class="more m4sq-sch"><summary>Схема: ${o.tables ? o.tables.map(esc).join(', ') : 'все таблицы'}</summary><div>${TR.db.schemaHTML(o.tables)}</div></details>`}
    </div>`;
    const ta = TR.$('textarea', el), out = TR.$('[data-sqout]', el);
    async function run(sql) {
      const q = sql != null ? sql : (ta ? ta.value : cur);
      if (!String(q || '').trim()) { out.innerHTML = '<div class="small dim">Напишите запрос и нажмите «Выполнить».</div>'; return null; }
      out.innerHTML = `<div class="small dim">${TR.db.loaded ? 'Выполняю…' : 'Загружаю базу «Искры»… В первый раз это занимает несколько секунд.'}</div>`;
      try {
        const r = await exec(o.wrap ? o.wrap(q) : q);
        out.innerHTML = TR.db.resultHTML(r, { max: o.max || 50 });
        if (o.onRun) o.onRun(r, q);
        return r;
      } catch (e) { out.innerHTML = ui.note('bad', 'База не загрузилась', OFFLINE); return null; }
    }
    if (ta) {
      ta.addEventListener('input', () => { cur = ta.value; if (o.onChange) o.onChange(cur); });
      ta.addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); run(); } });
    }
    TR.on(el, 'click', '[data-sqrun]', () => run());
    TR.on(el, 'click', '[data-sqpre]', (e, b) => { const p = o.presets[+b.dataset.sqpre]; if (ta) { ta.value = p.sql; cur = p.sql; if (o.onChange) o.onChange(cur); } run(p.sql); });
    if ((o.autorun || o.readonly) && cur.trim()) run(cur);
    return { run };
  }
  async function cmp(sql, ref, opts) {
    try { return await TR.db.compare(sql, ref, opts || {}); }
    catch (e) { return { ok: false, offline: true, why: OFFLINE }; }
  }
  const offlineResult = () => ({ ok: false, score: 0, summary: 'Проверить не получилось: база не загрузилась.', notes: [{ ok: false, html: OFFLINE }] });
  const isNum = v => typeof v === 'number' || (v != null && /^-?\d+(\.\d+)?$/.test(String(v).trim()));
  // результаты одной формы, числа совпадают с допуском tol (строки сопоставляются по нечисловым ячейкам)
  function nearRes(m, r, tol) {
    if (!m || !r || !m.ok || !r.ok || m.columns.length !== r.columns.length || m.total !== r.total) return false;
    const key = row => row.map(v => isNum(v) ? '#' : TR.norm(String(v))).join('|');
    const srt = rows => rows.slice().sort((a, b) => key(a) < key(b) ? -1 : key(a) > key(b) ? 1 : 0);
    const A = srt(m.rows), B = srt(r.rows);
    return A.every((row, i) => row.every((v, j) => {
      const w = B[i][j];
      if (v == null || w == null) return v == null && w == null;
      if (isNum(v) && isNum(w)) return Math.abs(+v - +w) <= tol + 1e-9;
      return TR.norm(String(v)) === TR.norm(String(w));
    }));
  }
  const single = res => res && res.ok && res.total === 1 && res.columns.length === 1 && isNum(res.rows[0][0]) ? +res.rows[0][0] : null;
  // «нашёл те же строки»: есть столбец, множество значений которого совпадает с одним из столбцов эталона
  const colSets = res => res.columns.map((_, j) => new Set(res.rows.map(r => r[j] == null ? '∅' : String(r[j]).trim())));
  const eqSet = (a, b) => a.size === b.size && [...a].every(x => b.has(x));
  function hitRows(m, r) {
    if (!m || !r || !m.ok || !r.ok || !m.total) return false;
    const ms = colSets(m), rs = colSets(r);
    return ms.some(a => rs.some(b => eqSet(a, b)));
  }
  function superRows(m, r) {
    if (!m || !r || !m.ok || !r.ok || m.total <= r.total) return false;
    const ms = colSets(m), rs = colSets(r);
    return ms.some(a => rs.some(b => [...b].every(x => a.has(x))));
  }
  // мини-таблица в стиле результата запроса; rowCls(i) → 'off' | 'hl' | 'grp'
  function mini(cols, rows, rowCls, cap) {
    return `<div class="m4sq-mini">${cap ? `<div class="small dim" style="margin-bottom:4px">${cap}</div>` : ''}<div class="sqlwrap"><table class="sqltbl mono"><thead><tr>${cols.map(c => `<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${rows.map((r, i) => `<tr class="${rowCls ? rowCls(i) || '' : ''}">${r.map(v => v == null ? '<td class="null">NULL</td>' : `<td>${esc(v)}</td>`).join('')}</tr>`).join('')}</tbody></table></div></div>`;
  }
  const fmtN = x => String(Math.round(x * 10) / 10).replace('.', ',');

  // мини-таблица предложений доп. работ: для теории и для задания «предскажите результат»
  const OFFER = [[1, 1800, 'approved', 'client'], [2, 2400, 'rejected', 'phone'], [3, 3600, 'expired', null], [4, 1200, 'approved', 'auto'], [5, 4800, 'sent', null], [6, 2900, 'approved', 'client']];
  const PHOTO = [[1, 'a.jpg'], [1, 'b.jpg'], [3, 'c.jpg']];
  const sqlV = v => v == null ? 'NULL' : typeof v === 'number' ? v : `'${v}'`;
  const WITH = `WITH offer(id, amount, status, decided_by) AS (VALUES ${OFFER.map(r => `(${r.map(sqlV).join(', ')})`).join(', ')}), photo(offer_id, file) AS (VALUES ${PHOTO.map(r => `(${r.map(sqlV).join(', ')})`).join(', ')}) `;

  // =====================================================================
  // Теория 1. SELECT, WHERE, ORDER BY, LIMIT, DISTINCT, LIKE / IN / BETWEEN, даты
  // =====================================================================
  const ANAT = [
    { id: 'select', k: 'SELECT', v: 'name, price', t: 'Какие столбцы показать. «*» — все столбцы; можно считать выражения: price * 1.2 AS with_vat. Это как сказать официанту: «мне только суп и чай».' },
    { id: 'from', k: 'FROM', v: 'service', t: 'Из какой таблицы брать строки. Таблица — как лист Excel со строгими столбцами: у каждого свой тип, а строки не имеют «номера строки».' },
    { id: 'where', k: 'WHERE', v: "category = 'Шины'", t: 'Фильтр строк: остаются только те, где условие истинно. Строки — в одинарных кавычках. Условия соединяются AND и OR (скобки обязательны, когда смешиваете).' },
    { id: 'order', k: 'ORDER BY', v: 'price DESC', t: 'Сортировка: ASC — по возрастанию (по умолчанию), DESC — по убыванию. Без ORDER BY порядок строк не гарантирован — даже если «всегда так выходило».' },
    { id: 'limit', k: 'LIMIT', v: '3', t: 'Сколько строк вернуть. «Покажи топ-3». С OFFSET можно пролистать: LIMIT 10 OFFSET 20 — третья страница по 10.' }
  ];
  const BUILD_COLS = ['code', 'name', 'category', 'norm_hours', 'price'];
  const BUILD_W = [
    { v: 'none', t: 'без фильтра', sql: '' },
    { v: 'eq', t: "category = 'Двигатель'", sql: "category = 'Двигатель'" },
    { v: 'btw', t: 'price BETWEEN 1000 AND 2500', sql: 'price BETWEEN 1000 AND 2500' },
    { v: 'like', t: "name LIKE 'Замена%'", sql: "name LIKE 'Замена%'" },
    { v: 'in', t: "category IN ('Шины', 'Тормоза')", sql: "category IN ('Шины', 'Тормоза')" },
    { v: 'and', t: "category = 'ТО' OR price > 7000", sql: "category = 'ТО' OR price > 7000" }
  ];
  const BUILD_NOTE = {
    none: 'Все 15 услуг каталога.',
    eq: 'Точное совпадение. Регистр и пробелы важны: «двигатель» с маленькой буквы не найдётся.',
    btw: 'BETWEEN включает обе границы: услуги ровно за 1 000 и ровно за 2 500 ₽ попадут. Это то же, что price >= 1000 AND price <= 2500.',
    like: 'LIKE — поиск по шаблону: % — любое число любых символов, _ — ровно один символ. В SQLite LIKE не различает регистр только для латиницы: «замена%» с маленькой буквы кириллицу с большой не найдёт.',
    in: 'IN — короткая запись для нескольких OR: category = \'Шины\' OR category = \'Тормоза\'.',
    and: 'OR — хотя бы одно условие. Если смешиваете AND и OR, ставьте скобки: AND выполняется раньше, как умножение раньше сложения.'
  };
  const WHY = {
    hyp: { t: 'Проверить гипотезу', who: 'kirill', say: 'Мне кажется, утром не приезжают чаще, чем вечером. Напоминание тогда надо слать накануне вечером!', sql: `SELECT strftime('%H', start_at) AS hour,
       COUNT(*) AS bookings,
       SUM(status = 'no_show') AS no_shows
FROM booking
WHERE status IN ('done', 'no_show')
GROUP BY hour
ORDER BY hour;`, after: 'Не спорим «кажется — не кажется», а смотрим: неявки по часам начала. Одна минута — и у Кирилла цифры вместо ощущения.' },
    data: { t: 'Найти проблему в данных', who: 'gleb', say: 'У нас post_id может быть пустым. У каких записей он пустой — это нормально?', sql: `SELECT status, COUNT(*) AS without_post
FROM booking
WHERE post_id IS NULL
GROUP BY status;`, after: 'Пост назначает мастер-приёмщик при подтверждении на день. Пустой пост у будущих и отменённых — нормально; у «Завершена» был бы сигналом. Аналитик знает правило и проверяет им данные.' },
    req: { t: 'Проверить требование', who: 'liza', say: 'BR-2: онлайн-запись не позже чем за 2 часа до начала. Как убедиться, что на тестовом контуре это соблюдается?', sql: `SELECT id, source, created_at, start_at
FROM booking
WHERE source IN ('app', 'site')
  AND (julianday(start_at) - julianday(created_at)) * 24 < 2;`, after: 'Запрос-сторож: он ищет нарушения правила и должен вернуть ноль строк. Ноль — правило соблюдается. Такие запросы потом уходят в регресс и мониторинг.' }
  };
  const DATE_PRESETS = [
    { t: 'Записи на сегодня: date()', sql: `SELECT id, start_at, end_at, status
FROM booking
WHERE date(start_at) = '2027-02-10'
ORDER BY start_at;` },
    { t: 'Первая неделя февраля: BETWEEN', sql: `SELECT id, start_at, status
FROM booking
WHERE start_at BETWEEN '2027-02-01' AND '2027-02-07 23:59'
ORDER BY start_at;` },
    { t: 'Минуты между событиями: julianday()', sql: `SELECT id, sent_at, decided_at,
       ROUND((julianday(decided_at) - julianday(sent_at)) * 24 * 60) AS minutes
FROM extra_offer
WHERE decided_at IS NOT NULL
LIMIT 10;` },
    { t: '+15 минут к началу: datetime()', sql: `SELECT id, start_at,
       datetime(start_at, '+15 minutes') AS no_show_after
FROM booking
WHERE status = 'confirmed'
LIMIT 5;` },
    { t: 'Уникальные значения: DISTINCT', sql: `SELECT DISTINCT category
FROM service
ORDER BY category;` }
  ];
  const howSelect = {
    id: 'how-select', covers: ['numbers'], title: 'Как это работает: SELECT, фильтры, сортировка и даты', free: true, noReset: true,
    simple: {
      icon: '🔎',
      plain: 'SQL — язык вопросов к базе данных. Вы не говорите, <i>как</i> искать, а описываете, <i>что</i> нужно: «покажи такие-то столбцы из такой-то таблицы, где выполняется условие, отсортируй и дай первые три». База сама решает, как это быстро найти.',
      analogy: 'Как заказ в библиотеке: «Мне из каталога (FROM) — названия и авторов (SELECT) книг о машинах (WHERE), новые сначала (ORDER BY), не больше пяти (LIMIT)». Библиотекарь сам знает, на какой полке искать.',
      tech: 'SQL (Structured Query Language) — декларативный язык запросов к реляционным базам, стандарт ISO/IEC 9075. Чтение данных — оператор SELECT. В тренажёре — SQLite через sql.js: синтаксис базовых запросов тот же, что в PostgreSQL, отличаются функции дат. Источники: А. Бьюли «Изучаем SQL»; К. Дж. Дейт «Введение в системы баз данных»; документация SQLite (sqlite.org/lang_select.html, lang_datefunc.html).'
    },
    lead: ui.brief({
      situation: 'Среда, 10 февраля, 11:30. Глеб открыл вам доступ на чтение к копии базы тестовой эксплуатации «Искра Онлайн»: записи, заказ-наряды, предложения доп. работ за последний месяц. Вера: «Через полчаса придёт Тимур Рашидович с вопросами. Давайте сначала научимся спрашивать базу».',
      todo: ['Нажмите на каждую часть запроса — узнаете, что она делает.', 'Соберите запрос в конструкторе: столбцы, фильтр, сортировка, лимит — и посмотрите живой результат из базы «Искры».', 'Попробуйте функции дат в консоли и посмотрите, зачем аналитику SQL: три реальные ситуации.'],
      look: 'Базу менять нельзя (только SELECT) — но в консоли тренажёра можно всё: каждый запрос выполняется на свежей копии снимка, испортить данные нельзя.'
    }),
    render(el) {
      el.classList.add('m4sq-root');
      let an = 'select', cols = ['name', 'category', 'price'], w = 'none', ord = 'none', lim = 'none', dist = false, why = 'hyp';
      el.innerHTML = `<div class="stack">
        <h4>Анатомия запроса</h4>
        <div class="m4sq-anat" data-anat></div><div data-anatx></div>
        ${ui.note('info', 'Регистр и точка с запятой', 'Ключевые слова можно писать как угодно: select, SELECT, Select — одно и то же. Принято ключевые слова писать большими буквами, имена таблиц и столбцов — маленькими. Точка с запятой в конце — конец запроса; в консоли тренажёра её можно не ставить.')}
        <h4>Конструктор: каталог услуг <code>service</code></h4>
        <div class="small muted">Столбцы:</div>
        <div class="row" data-bcols></div>
        <div class="small muted">Фильтр WHERE:</div>
        <div class="row">${ui.seg('bw', BUILD_W.map(x => ({ v: x.v, t: esc(x.t) })), w)}</div>
        <div class="m4sq-two">
          <div class="stack" style="gap:6px"><div class="small muted">ORDER BY:</div>${ui.seg('bo', [{ v: 'none', t: 'нет' }, { v: 'pd', t: 'price DESC' }, { v: 'pa', t: 'price' }, { v: 'n', t: 'name' }], ord)}</div>
          <div class="stack" style="gap:6px"><div class="small muted">LIMIT:</div>${ui.seg('bl', [{ v: 'none', t: 'нет' }, { v: '3', t: '3' }, { v: '5', t: '5' }], lim)}</div>
        </div>
        <label class="toggle"><input type="checkbox" data-bdist> <span>DISTINCT — убрать повторяющиеся строки (попробуйте с одним столбцом category)</span></label>
        <div data-bsql></div><div class="small muted" data-bnote></div><div data-bout></div>
        <h4>Даты в SQLite</h4>
        <p class="small muted">В базе «Искры» дата и время хранятся текстом в формате ISO: <code>2027-02-10 14:30</code>. Такой текст сортируется и сравнивается как время, поэтому <code>start_at &gt; '2027-02-10'</code> работает. Для вычислений есть функции:</p>
        ${ui.table(['Функция', 'Что делает', 'Пример → результат'], [
          ['<code>date(x)</code>', 'только дата', "<code>date('2027-02-10 14:30')</code> → 2027-02-10"],
          ['<code>strftime(формат, x)</code>', 'часть даты: %H час, %Y-%m месяц, %w день недели (0 — воскресенье)', "<code>strftime('%H', start_at)</code> → 14"],
          ['<code>julianday(x)</code>', 'дата как число дней; разность — сколько дней прошло', '<code>(julianday(b) - julianday(a)) * 24 * 60</code> → минуты'],
          ['<code>datetime(x, сдвиг)</code>', 'сдвиг времени', "<code>datetime(start_at, '+15 minutes')</code>"]
        ])}
        ${ui.note('warn', 'В PostgreSQL — по-другому', 'В боевой базе «Искры» (PostgreSQL) то же самое пишется иначе: <code>start_at::date</code>, <code>extract(hour from start_at)</code>, <code>decided_at - sent_at</code> (интервал), <code>start_at + interval \'15 minutes\'</code>. Логика та же — синтаксис функций у каждой СУБД свой. На собеседовании это нормально сказать: «точную функцию посмотрю в документации».')}
        <div data-dcon></div>
        <h4>Зачем SQL системному аналитику</h4>
        <div class="row">${ui.seg('why', Object.keys(WHY).map(k => ({ v: k, t: esc(WHY[k].t) })), why)}</div>
        <div data-why></div>
        <details class="more"><summary>Как об этом спрашивают на собеседовании</summary><div>
          <p><b>«Как часто вы пишете SQL?»</b> — Честно: чтение данных — регулярно: проверить гипотезу, найти примеры для требований, проверить данные после релиза, подготовить выборку для тестировщика. Изменение данных в проде — не задача аналитика.</p>
          <p><b>«Чем WHERE отличается от LIMIT?»</b> — WHERE отбирает строки по условию, LIMIT ограничивает число строк результата после сортировки. Без ORDER BY LIMIT вернёт «какие-то» строки.</p>
          <p><b>«Что вернёт BETWEEN 1 AND 10?»</b> — Границы включительно: 1 и 10 попадут.</p>
        </div></details>
      </div>`;
      function drawAnat() {
        TR.$('[data-anat]', el).innerHTML = ANAT.map(a => `<button type="button" data-an="${a.id}" aria-pressed="${a.id === an}"><span class="kw">${esc(a.k)}</span> ${esc(a.v)}</button>`).join('') + '<span>;</span>';
        const A = ANAT.find(a => a.id === an);
        TR.$('[data-anatx]', el).innerHTML = `<div class="card flat"><p><b>${esc(A.k)}</b> — ${esc(A.t)}</p></div>`;
      }
      let timer = null;
      function buildSql() {
        const W = BUILD_W.find(x => x.v === w);
        const o = { none: '', pd: 'price DESC', pa: 'price', n: 'name' }[ord];
        return `SELECT ${dist ? 'DISTINCT ' : ''}${cols.length ? cols.join(', ') : '*'}\nFROM service${W.sql ? '\nWHERE ' + W.sql : ''}${o ? '\nORDER BY ' + o : ''}${lim !== 'none' ? '\nLIMIT ' + lim : ''};`;
      }
      function drawBuild() {
        TR.$('[data-bcols]', el).innerHTML = BUILD_COLS.map(c => `<button type="button" class="chip m4sq-opt" data-bc="${c}" aria-pressed="${cols.includes(c)}">${c}</button>`).join('');
        const sql = buildSql();
        TR.$('[data-bsql]', el).innerHTML = ui.code(sql, 'sql');
        TR.$('[data-bnote]', el).textContent = BUILD_NOTE[w] + (dist ? ' DISTINCT сравнивает строки целиком — по всем выбранным столбцам.' : '') + (lim !== 'none' && ord === 'none' ? ' LIMIT без ORDER BY — «какие-то» строки: порядок не гарантирован.' : '');
        clearTimeout(timer);
        const out = TR.$('[data-bout]', el);
        out.innerHTML = `<div class="small dim">${TR.db.loaded ? 'Выполняю…' : 'Загружаю базу «Искры»…'}</div>`;
        timer = setTimeout(async () => { try { out.innerHTML = TR.db.resultHTML(await exec(sql), { max: 15 }); } catch (e) { out.innerHTML = ui.note('bad', 'База не загрузилась', OFFLINE); } }, 120);
      }
      function drawWhy() {
        const W = WHY[why];
        TR.$('[data-why]', el).innerHTML = ui.say(W.who, esc(W.say)) + '<div data-wcon style="margin-top:8px"></div>' + `<p class="small muted" style="margin-top:6px">${esc(W.after)}</p>`;
        sqlCon(TR.$('[data-wcon]', el), { value: W.sql, rows: 6, tables: ['booking'], schema: false, label: 'Запрос: ' + W.t });
      }
      drawAnat(); drawBuild(); drawWhy();
      sqlCon(TR.$('[data-dcon]', el), { presets: DATE_PRESETS, value: DATE_PRESETS[0].sql, rows: 5, tables: ['booking', 'extra_offer', 'service'], label: 'Консоль: даты' });
      TR.on(el, 'click', '[data-an]', (e, b) => { an = b.dataset.an; drawAnat(); });
      TR.on(el, 'click', '[data-bc]', (e, b) => { const c = b.dataset.bc; cols = cols.includes(c) ? cols.filter(x => x !== c) : BUILD_COLS.filter(x => x === c || cols.includes(x)); drawBuild(); });
      el.addEventListener('change', e => { if (e.target.closest('[data-bdist]')) { dist = e.target.checked; drawBuild(); } });
      ui.onSeg(el, (n, v) => { if (n === 'bw') w = v; else if (n === 'bo') ord = v; else if (n === 'bl') lim = v; else if (n === 'why') { why = v; drawWhy(); return; } else return; drawBuild(); });
    }
  };

  // =====================================================================
  // Теория 2. Агрегаты, GROUP BY, HAVING, порядок выполнения
  // =====================================================================
  const AGG = [
    { id: 'cnt', f: 'COUNT(*)', use: () => true, calc: rs => rs.length, t: 'Считает строки — все, независимо от значений.' },
    { id: 'cntc', f: 'COUNT(decided_by)', use: r => r[3] != null, calc: rs => rs.filter(r => r[3] != null).length, t: 'Считает только строки, где decided_by не NULL. Ещё не решённые и истёкшие предложения не попали.' },
    { id: 'cntd', f: 'COUNT(DISTINCT decided_by)', use: r => r[3] != null, calc: rs => new Set(rs.filter(r => r[3] != null).map(r => r[3])).size, t: 'Число разных значений, NULL не считается: client, phone, auto.' },
    { id: 'sum', f: 'SUM(amount)', use: () => true, calc: rs => rs.reduce((s, r) => s + r[1], 0), t: 'Сумма по столбцу.' },
    { id: 'avg', f: 'AVG(amount)', use: () => true, calc: rs => rs.reduce((s, r) => s + r[1], 0) / rs.length, t: 'Среднее = SUM / COUNT(столбца). Строки с NULL в столбце не участвуют ни в сумме, ни в знаменателе.' },
    { id: 'max', f: 'MAX(amount)', use: () => true, calc: rs => Math.max(...rs.map(r => r[1])), t: 'Наибольшее значение. MIN — наименьшее. Работают и с датами: MAX(start_at) — последняя запись.' }
  ];
  const STEPS = [
    { ln: 1, k: 'FROM offer', t: 'Сначала база берёт все строки таблицы. Пока никакого SELECT — только сырые данные.' },
    { ln: 2, k: 'WHERE amount >= 1500', t: 'Фильтр отдельных строк. Предложение 4 (1 200 ₽) выбыло. Агрегатов здесь ещё нет — групп не существует, поэтому COUNT в WHERE писать нельзя.' },
    { ln: 3, k: 'GROUP BY status', t: 'Строки собираются в группы по статусу: approved (1 и 6), rejected, expired, sent. Дальше каждая группа — одна строка результата.' },
    { ln: 4, k: 'HAVING SUM(amount) >= 3000', t: 'Фильтр групп: здесь уже можно агрегаты. Группа rejected (2 400 ₽) выбыла.' },
    { ln: 0, k: 'SELECT status, COUNT(*) AS n, SUM(amount) AS total', t: 'Только теперь считаются столбцы результата и появляются псевдонимы n и total.' },
    { ln: 5, k: 'ORDER BY total DESC', t: 'Сортировка — после SELECT, поэтому здесь псевдоним total уже можно использовать.' },
    { ln: 6, k: 'LIMIT 2', t: 'В самом конце — отрезать первые две строки.' }
  ];
  function stepTable(i) {
    const rows = OFFER.map(r => r.slice());
    if (i === 0) return mini(['id', 'amount', 'status', 'decided_by'], rows, null, '6 строк');
    if (i === 1) return mini(['id', 'amount', 'status', 'decided_by'], rows, k => rows[k][1] < 1500 ? 'off' : '', '5 строк осталось');
    const kept = rows.filter(r => r[1] >= 1500);
    const order = ['approved', 'rejected', 'expired', 'sent'];
    const grouped = order.flatMap(s => kept.filter(r => r[2] === s));
    if (i === 2) return mini(['группа', 'id', 'amount'], grouped.map(r => [r[2], r[0], r[1]]), k => (k === 0 || grouped[k][2] !== grouped[k - 1][2]) ? 'grp' : '', '4 группы');
    const g = order.map(s => { const rs = kept.filter(r => r[2] === s); return [s, rs.length, rs.reduce((a, r) => a + r[1], 0)]; });
    if (i === 3) return mini(['status', 'COUNT(*)', 'SUM(amount)'], g, k => g[k][2] < 3000 ? 'off' : '', 'группы после HAVING');
    const h = g.filter(x => x[2] >= 3000);
    if (i === 4) return mini(['status', 'n', 'total'], h, null, 'столбцы результата');
    const s = h.slice().sort((a, b) => b[2] - a[2]);
    if (i === 5) return mini(['status', 'n', 'total'], s, null, 'по убыванию total');
    return mini(['status', 'n', 'total'], s, k => k >= 2 ? 'off' : 'hl', 'итог: 2 строки');
  }
  const GROUP_PRESETS = [
    { t: 'Записи по статусам', sql: `SELECT status, COUNT(*) AS bookings
FROM booking
GROUP BY status
ORDER BY bookings DESC;` },
    { t: 'Средний чек по станциям', sql: `SELECT station_id, COUNT(*) AS orders, ROUND(AVG(total)) AS avg_check
FROM work_order
WHERE status = 'closed'
GROUP BY station_id
ORDER BY avg_check DESC;` },
    { t: 'Станции, где больше 25 записей', sql: `SELECT station_id, COUNT(*) AS bookings
FROM booking
GROUP BY station_id
HAVING COUNT(*) > 25;` },
    { t: 'Ловушка: целочисленное деление', sql: `SELECT SUM(status = 'approved') / COUNT(*)         AS wrong,
       ROUND(100.0 * SUM(status = 'approved') / COUNT(*), 1) AS percent
FROM extra_offer
WHERE status <> 'sent';` }
  ];
  const howGroup = {
    id: 'how-group', covers: ['predict', 'br4'], title: 'Как это работает: агрегаты, GROUP BY, HAVING и порядок выполнения', free: true, noReset: true,
    simple: {
      icon: '🧮',
      plain: 'Агрегатные функции сворачивают много строк в одно число: сколько (COUNT), сумма (SUM), среднее (AVG), минимум и максимум (MIN, MAX). GROUP BY делает это отдельно для каждой группы — по станции, по статусу, по дню. WHERE фильтрует строки до группировки, HAVING — группы после.',
      analogy: 'Кассир в конце смены раскладывает чеки по стопкам — по способу оплаты (GROUP BY) и считает каждую стопку (SUM). Мятые чеки выбрасывает до раскладки (WHERE), а стопки меньше тысячи рублей не сдаёт в отчёт (HAVING).',
      tech: 'Логический порядок обработки SELECT: FROM (и JOIN) → WHERE → GROUP BY → HAVING → SELECT → DISTINCT → ORDER BY → LIMIT. Агрегаты пропускают NULL (кроме COUNT(*)). В SELECT при GROUP BY допустимы только столбцы группировки и агрегаты (SQLite мягче стандарта и вернёт «какое-то» значение — это ловушка). Деление целых чисел в SQLite и PostgreSQL — целочисленное. Источники: ISO/IEC 9075; А. Бьюли «Изучаем SQL», гл. 8; документация SQLite «Aggregate Functions».'
    },
    lead: ui.brief({
      situation: '11:45. Вера рисует на доске шесть предложений доп. работ: «Тимур будет спрашивать „сколько“ и „в среднем“. Это агрегаты. Давайте посмотрим, что они делают со строками — и в каком порядке база выполняет запрос».',
      todo: ['Нажимайте на функции — увидите, какие строки мини-таблицы участвуют и что получится. Обратите внимание на NULL.', 'Пройдите запрос по шагам: в каком порядке база его на самом деле выполняет.', 'Запустите готовые запросы на живой базе, в том числе ловушку с делением.'],
      look: 'Пишем SELECT первым, а выполняется он почти последним. Отсюда половина ошибок новичков.'
    }),
    render(el) {
      el.classList.add('m4sq-root');
      let ag = 'cnt', appr = false, st = 0;
      el.innerHTML = `<div class="stack">
        <h4>Агрегаты на мини-таблице <code>offer</code></h4>
        <div class="row">${ui.seg('ag', AGG.map(a => ({ v: a.id, t: esc(a.f) })), ag)}</div>
        <label class="toggle"><input type="checkbox" data-gappr> <span>Добавить WHERE status = 'approved'</span></label>
        <div data-gout></div>
        <h4>Порядок выполнения: шаг за шагом</h4>
        <div class="m4sq-steps" data-steps></div>
        <div class="row"><button type="button" class="btn sm" data-st="-1">← Шаг назад</button><button type="button" class="btn sm primary" data-st="1">Следующий шаг →</button><span class="small dim" data-stn></span></div>
        <div data-stx></div>
        ${ui.table(['', 'WHERE', 'HAVING'], [
          ['Что фильтрует', 'отдельные строки', 'группы'],
          ['Когда', 'до GROUP BY', 'после GROUP BY'],
          ['Агрегаты (COUNT, SUM…)', 'нельзя — ошибка', 'можно'],
          ['Пример', "WHERE status = 'no_show'", 'HAVING COUNT(*) > 2']
        ])}
        ${ui.note('warn', 'Две ловушки, на которых ловят', '<p><b>Целочисленное деление.</b> 21 / 36 в SQL — это 0, а не 0,58: делятся целые числа. Пишите 100.0 * a / b или CAST(a AS REAL) / b.</p><p><b>Столбец не из GROUP BY.</b> <code>SELECT station_id, client_id, COUNT(*) … GROUP BY station_id</code> — какой client_id показать, если их в группе двадцать? PostgreSQL выдаст ошибку, а SQLite молча покажет случайный. Правило: в SELECT — только то, по чему группируете, и агрегаты.</p>')}
        <h4>Попробуйте на живой базе</h4>
        <div data-gcon></div>
        <details class="more"><summary>Как об этом спрашивают на собеседовании</summary><div>
          <p><b>«Чем WHERE отличается от HAVING?»</b> — WHERE фильтрует строки до группировки и не видит агрегатов; HAVING фильтрует группы после GROUP BY и работает с агрегатами. Если условие можно написать в WHERE — пишите в WHERE: меньше строк попадёт в группировку.</p>
          <p><b>«COUNT(*) и COUNT(столбец) — в чём разница?»</b> — COUNT(*) считает все строки, COUNT(столбец) — только строки, где значение не NULL. COUNT(DISTINCT столбец) — число разных непустых значений.</p>
          <p><b>«В каком порядке выполняется запрос?»</b> — FROM и JOIN, WHERE, GROUP BY, HAVING, SELECT, DISTINCT, ORDER BY, LIMIT. Поэтому псевдоним из SELECT по стандарту нельзя использовать в WHERE, но можно в ORDER BY.</p>
        </div></details>
      </div>`;
      function drawAgg() {
        const A = AGG.find(a => a.id === ag);
        const rs = OFFER.filter(r => !appr || r[2] === 'approved');
        const v = A.calc(rs);
        const val = A.id === 'avg' ? fmtN(v) : String(v);
        TR.$('[data-gout]', el).innerHTML = `<div class="m4sq-two">${mini(['id', 'amount', 'status', 'decided_by'], OFFER, i => { const r = OFFER[i]; if (appr && r[2] !== 'approved') return 'off'; return A.use(r) ? 'hl' : ''; }, 'подсвечены строки, которые участвуют')}
          <div class="stack" style="gap:8px"><div class="m4sq-res"><span class="m4sq-big">${esc(val)}</span><code>SELECT ${esc(A.f)} FROM offer${appr ? " WHERE status = 'approved'" : ''}</code></div><p class="small muted">${esc(A.t)}</p></div></div>`;
      }
      function drawSteps() {
        const lines = ['SELECT status, COUNT(*) AS n, SUM(amount) AS total', 'FROM offer', 'WHERE amount >= 1500', 'GROUP BY status', 'HAVING SUM(amount) >= 3000', 'ORDER BY total DESC', 'LIMIT 2;'];
        const execNo = [5, 1, 2, 3, 4, 6, 7];
        const active = STEPS[st].ln;
        const doneLines = STEPS.slice(0, st).map(s => s.ln);
        TR.$('[data-steps]', el).innerHTML = lines.map((l, i) => `<div class="${i === active ? 'on' : doneLines.includes(i) ? 'done' : 'todo'}"><b>${execNo[i]}</b><span>${esc(l)}</span></div>`).join('');
        TR.$('[data-stn]', el).textContent = `Шаг ${st + 1} из ${STEPS.length}: ${STEPS[st].k}`;
        TR.$('[data-stx]', el).innerHTML = `<div class="m4sq-two"><div class="card flat"><p>${esc(STEPS[st].t)}</p></div>${stepTable(st)}</div>`;
        TR.$$('[data-st]', el).forEach(b => { b.disabled = (+b.dataset.st < 0 && st === 0) || (+b.dataset.st > 0 && st === STEPS.length - 1); });
      }
      drawAgg(); drawSteps();
      sqlCon(TR.$('[data-gcon]', el), { presets: GROUP_PRESETS, value: GROUP_PRESETS[0].sql, rows: 5, tables: ['booking', 'work_order', 'extra_offer'], label: 'Консоль: агрегаты' });
      ui.onSeg(el, (n, v) => { if (n === 'ag') { ag = v; drawAgg(); } });
      el.addEventListener('change', e => { if (e.target.closest('[data-gappr]')) { appr = e.target.checked; drawAgg(); } });
      TR.on(el, 'click', '[data-st]', (e, b) => { st = Math.max(0, Math.min(STEPS.length - 1, st + (+b.dataset.st))); drawSteps(); });
    }
  };

  // =====================================================================
  // Теория 3. JOIN, NULL, размножение строк, «сироты»
  // =====================================================================
  const JC = [[1, 'Елена'], [2, 'Рустам'], [3, 'Айгуль']];
  const JB = [[101, 1, 'app'], [102, 1, 'phone'], [103, 2, 'phone']];
  const JMODES = [
    { v: 'inner', t: 'INNER JOIN', sql: 'SELECT c.name, b.id, b.source\nFROM client c\nJOIN booking b ON b.client_id = c.id;', rows: () => JC.flatMap(c => JB.filter(b => b[1] === c[0]).map(b => [c[1], b[0], b[2]])), t2: 'Только пары, которые нашлись в обеих таблицах. Айгуль без записей пропала из результата — молча, без ошибки.' },
    { v: 'left', t: 'LEFT JOIN', sql: 'SELECT c.name, b.id, b.source\nFROM client c\nLEFT JOIN booking b ON b.client_id = c.id;', rows: () => JC.flatMap(c => { const m = JB.filter(b => b[1] === c[0]); return m.length ? m.map(b => [c[1], b[0], b[2]]) : [[c[1], null, null]]; }), t2: 'Все строки левой таблицы. Где пары нет — справа NULL. Айгуль на месте.' },
    { v: 'anti', t: 'LEFT … IS NULL', sql: 'SELECT c.name\nFROM client c\nLEFT JOIN booking b ON b.client_id = c.id\nWHERE b.id IS NULL;', rows: () => [['Айгуль']], cols: ['name'], t2: '«Найти сирот»: строки слева, у которых нет пары справа. Главный приём проверки качества данных: записи без заказ-наряда, заказ-наряды без оплаты, клиенты без визитов.' },
    { v: 'where', t: 'LEFT + WHERE справа', sql: "SELECT c.name, b.id, b.source\nFROM client c\nLEFT JOIN booking b ON b.client_id = c.id\nWHERE b.source = 'app';", rows: () => [['Елена', 101, 'app']], t2: 'Ловушка: условие на правую таблицу в WHERE выкидывает строки с NULL — LEFT JOIN тихо превратился в INNER. Рустам и Айгуль пропали.' },
    { v: 'on', t: 'LEFT + условие в ON', sql: "SELECT c.name, b.id, b.source\nFROM client c\nLEFT JOIN booking b ON b.client_id = c.id\n                   AND b.source = 'app';", rows: () => [['Елена', 101, 'app'], ['Рустам', null, null], ['Айгуль', null, null]], t2: 'Условие перенесли в ON: оно решает, какие строки справа «подходят в пару», а все клиенты остаются. Так считают «по всем станциям, включая те, где ноль».' }
  ];
  const FAN = [
    { v: 'plain', t: 'SUM без JOIN', sql: 'SELECT SUM(w.total)\nFROM work_order w;', rows: [['ЗН-1-0457', 5000], ['ЗН-1-0461', 3000]], cols: ['number', 'total'], sum: 8000, x: 'Два заказ-наряда: 5 000 + 3 000 = 8 000 ₽. Верно.' },
    { v: 'join', t: 'JOIN к платежам', sql: 'SELECT SUM(w.total)\nFROM work_order w\nJOIN payment p ON p.work_order_id = w.id;', rows: [['ЗН-1-0457', 5000, 'failed'], ['ЗН-1-0457', 5000, 'paid'], ['ЗН-1-0461', 3000, 'paid']], cols: ['number', 'total', 'p.status'], sum: 13000, x: 'По первому заказ-наряду два платежа: неудачная попытка картой и успешная. JOIN дал две строки — и total посчитался дважды: 13 000 вместо 8 000.' },
    { v: 'fix', t: 'JOIN + только paid', sql: "SELECT SUM(w.total)\nFROM work_order w\nJOIN payment p ON p.work_order_id = w.id\nWHERE p.status = 'paid';", rows: [['ЗН-1-0457', 5000, 'paid'], ['ЗН-1-0461', 3000, 'paid']], cols: ['number', 'total', 'p.status'], sum: 8000, x: 'Снова 8 000 — но только потому, что успешный платёж ровно один. Надёжнее не присоединять «многие» строки, когда суммируете поле «одной» стороны.' }
  ];
  const NULLS = [
    { e: 'NULL = NULL', r: 'NULL', x: 'Неизвестное равно неизвестному? Неизвестно. Поэтому WHERE email = NULL не найдёт ни одной строки.' },
    { e: 'email IS NULL', r: 'TRUE / FALSE', x: 'Правильный способ проверить пустоту. Обратное — IS NOT NULL.' },
    { e: "decided_by <> 'phone'", r: 'NULL, если decided_by пуст', x: 'Строки с NULL не попадут ни в = \'phone\', ни в <> \'phone\'. Частая причина «потерянных» строк.' },
    { e: 'total + 100', r: 'NULL, если total пуст', x: 'Любая арифметика с NULL даёт NULL.' },
    { e: 'COALESCE(total, 0)', r: '0, если total пуст', x: 'Подставить значение вместо NULL. Удобно в отчётах.' },
    { e: "status IN ('done', NULL)", r: 'TRUE для done, иначе NULL', x: 'IN — это цепочка OR из «=», а сравнение с NULL неизвестно. NOT IN со списком, где есть NULL, вообще ничего не вернёт.' }
  ];
  const JOIN_PRESETS = [
    { t: 'Клиенты без единой записи', sql: `SELECT c.id, c.full_name, c.created_at
FROM client c
LEFT JOIN booking b ON b.client_id = c.id
WHERE b.id IS NULL;` },
    { t: 'Услуги, которые ни разу не выбирали', sql: `SELECT s.code, s.name
FROM service s
LEFT JOIN booking_service bs ON bs.service_id = s.id
WHERE bs.booking_id IS NULL;` },
    { t: 'Записи с названием станции', sql: `SELECT b.id, s.name AS station, b.start_at, b.status
FROM booking b
JOIN station s ON s.id = b.station_id
ORDER BY b.start_at DESC
LIMIT 10;` },
    { t: 'Механики без телефона', sql: `SELECT full_name, station_id
FROM employee
WHERE role = 'mechanic' AND phone IS NULL;` }
  ];
  const howJoin = {
    id: 'how-join', covers: ['bugs', 'lab'], title: 'Как это работает: JOIN, NULL и опасные соединения', free: true, noReset: true,
    simple: {
      icon: '🔗',
      plain: 'Данные «Искры» разложены по таблицам: запись знает только station_id, а название станции лежит в station. JOIN соединяет таблицы по ключу. INNER JOIN оставляет только пары, LEFT JOIN — все строки левой таблицы, даже без пары. NULL — «значение неизвестно», и с ним обычные сравнения не работают.',
      analogy: 'Классный журнал и список кружков. INNER — дети, которые ходят хоть в один кружок. LEFT — все дети класса, у кого нет кружка — прочерк. А если ребёнок ходит в три кружка, он появится в списке трижды — не перепутайте это с тремя детьми.',
      tech: 'JOIN — операция соединения реляционной алгебры (Кодд; Дейт, гл. 7). INNER JOIN — пары, удовлетворяющие условию ON; LEFT OUTER JOIN дополняет строки левой таблицы без пары значениями NULL. Соединение «один ко многим» размножает строки стороны «один» (fan-out). NULL и трёхзначная логика (TRUE / FALSE / UNKNOWN) — ISO/IEC 9075; проверка — IS NULL. Анти-соединение (LEFT JOIN … WHERE правая.id IS NULL или NOT EXISTS) — стандартный приём поиска «сирот» при проверке качества данных (DAMA-DMBOK, глава о качестве данных).'
    },
    lead: ui.brief({
      situation: '11:55. Глеб, проходя мимо: «Половина неправильных цифр, которые я видел в отчётах, — это JOIN. Либо строки пропали, либо размножились. И ещё NULL — его все сравнивают через „равно“».',
      todo: ['Переключайте пять режимов соединения клиентов и записей — смотрите, какие строки остаются.', 'Посмотрите, как JOIN к платежам раздувает сумму.', 'Нажмите на выражения с NULL — узнаете, что они вернут.', 'Запустите приёмы на живой базе «Искры»: клиенты без записей, услуги, которые никто не заказывал.'],
      look: 'Перед тем как суммировать после JOIN, спросите себя: сколько строк справа может прийтись на одну строку слева?'
    }),
    render(el) {
      el.classList.add('m4sq-root');
      let jm = 'inner', fm = 'plain', nl = 0;
      el.innerHTML = `<div class="stack">
        <h4>Пять способов соединить клиентов и записи</h4>
        <div class="m4sq-two">${mini(['id', 'name'], JC, null, 'client c')}${mini(['id', 'client_id', 'source'], JB, null, 'booking b')}</div>
        <div class="row">${ui.seg('jm', JMODES.map(m => ({ v: m.v, t: esc(m.t) })), jm)}</div>
        <div data-jout></div>
        <h4>Размножение строк: сумма после JOIN</h4>
        <div class="row">${ui.seg('fm', FAN.map(m => ({ v: m.v, t: esc(m.t) })), fm)}</div>
        <div data-fout></div>
        <h4>NULL: нажмите на выражение</h4>
        <div class="m4sq-nl" data-nl></div><div data-nlx></div>
        <h4>Приёмы на живой базе</h4>
        <div data-jcon></div>
        <details class="more"><summary>Как об этом спрашивают на собеседовании</summary><div>
          <p><b>«Какие виды JOIN вы знаете?»</b> — INNER (только пары), LEFT и RIGHT (все строки одной стороны), FULL OUTER (все строки обеих сторон), CROSS (все со всеми). На практике 95 % — INNER и LEFT.</p>
          <p><b>«Как найти клиентов без заказов?»</b> — LEFT JOIN заказов и WHERE заказ.id IS NULL, или NOT EXISTS (SELECT 1 FROM заказ WHERE …). Через INNER JOIN — никак: он их и выкидывает.</p>
          <p><b>«Почему WHERE x = NULL ничего не находит?»</b> — Сравнение с NULL даёт «неизвестно», а WHERE оставляет только «истину». Нужно IS NULL.</p>
          <p><b>«Сумма после JOIN выросла — почему?»</b> — Связь «один ко многим»: строка стороны «один» повторилась столько раз, сколько у неё пар. Суммировать надо до соединения или без него.</p>
        </div></details>
      </div>`;
      function drawJ() {
        const M = JMODES.find(m => m.v === jm);
        TR.$('[data-jout]', el).innerHTML = `<div class="m4sq-two"><div class="stack" style="gap:8px">${ui.code(M.sql, 'sql')}<p class="small muted">${esc(M.t2)}</p></div>${mini(M.cols || ['name', 'b.id', 'b.source'], M.rows(), null, 'результат: ' + M.rows().length + ' ' + TR.plural(M.rows().length, 'строка', 'строки', 'строк'))}</div>`;
        const F = FAN.find(m => m.v === fm);
        TR.$('[data-fout]', el).innerHTML = `<div class="m4sq-two"><div class="stack" style="gap:8px">${ui.code(F.sql, 'sql')}<div class="m4sq-res"><span class="m4sq-big" style="color:var(--${F.sum === 8000 ? 'ok' : 'bad'})">${F.sum.toLocaleString('ru-RU')} ₽</span></div><p class="small muted">${esc(F.x)}</p></div>${mini(F.cols, F.rows, null, 'строки, которые суммируются')}</div>`;
        TR.$('[data-nl]', el).innerHTML = NULLS.map((n, i) => `<button type="button" data-nli="${i}" aria-pressed="${i === nl}">${esc(n.e)}</button>`).join('');
        const N = NULLS[nl];
        TR.$('[data-nlx]', el).innerHTML = `<div class="card flat"><p><code>${esc(N.e)}</code> → <b>${esc(N.r)}</b></p><p class="small muted">${esc(N.x)}</p></div>`;
      }
      drawJ();
      sqlCon(TR.$('[data-jcon]', el), { presets: JOIN_PRESETS, value: JOIN_PRESETS[0].sql, rows: 5, tables: ['client', 'booking', 'service', 'booking_service', 'employee'], label: 'Консоль: соединения' });
      ui.onSeg(el, (n, v) => { if (n === 'jm') jm = v; else if (n === 'fm') fm = v; else return; drawJ(); });
      TR.on(el, 'click', '[data-nli]', (e, b) => { nl = +b.dataset.nli; drawJ(); });
    }
  };

  // =====================================================================
  // Практика 1. Тимур Рашидович просит цифры
  // =====================================================================
  const NUM = [
    { id: 'a', t: 'Неявки по станциям', ask: 'Сколько неявок на каждой станции? По всем семи — я хочу видеть и те, где всё хорошо.', cols: 'название станции · число неявок (7 строк)', tables: ['station', 'booking'], tol: 0,
      ref: `SELECT s.name, COUNT(b.id) AS no_shows
FROM station s
LEFT JOIN booking b ON b.station_id = s.id
                   AND b.status = 'no_show'
GROUP BY s.id, s.name
ORDER BY no_shows DESC;`,
      inner: `SELECT s.name, COUNT(*) FROM booking b JOIN station s ON s.id = b.station_id WHERE b.status = 'no_show' GROUP BY s.name`,
      ph: "SELECT s.name, COUNT(…)\nFROM station s\n…", ans: 'Танкодром и Горки — по 4, Дербышки — 3, Победы — 2, Ямашева и Савиново — по 1, Азино — 0.' },
    { id: 'b', t: 'Средний чек', ask: 'Какой у нас средний чек? Только по машинам, которые уже выдали клиенту.', cols: 'одно число, ₽ (округлите ROUND)', tables: ['work_order'], tol: 1,
      ref: `SELECT ROUND(AVG(total)) AS avg_check
FROM work_order
WHERE status = 'closed';`, ph: 'SELECT …\nFROM work_order\nWHERE …', ans: '7 777 ₽ по 97 выданным заказ-нарядам — почти как в Excel Марины (7 800 ₽).' },
    { id: 'c', t: 'Доля согласованных доп. работ', ask: 'Из предложений доп. работ — сколько процентов клиенты согласовали? Те, что ещё ждут ответа, не считайте.', cols: 'одно число — процент с одним знаком, например 42.5', tables: ['extra_offer'], tol: 0.6, pct: true,
      ref: `SELECT ROUND(100.0 * SUM(status = 'approved') / COUNT(*), 1) AS approved_pct
FROM extra_offer
WHERE status <> 'sent';`, ph: 'SELECT …\nFROM extra_offer\nWHERE …', ans: '58,3 %: 21 согласовано из 36 предложений с итогом.' },
    { id: 'd', t: 'Минуты до ответа клиента', ask: 'Сколько минут проходит от отправки предложения до решения — отдельно когда клиент ответил в приложении и когда мастер дозвонился?', cols: 'decided_by · среднее число минут (2 строки: client и phone)', tables: ['extra_offer'], tol: 1,
      ref: `SELECT decided_by,
       ROUND(AVG((julianday(decided_at) - julianday(sent_at)) * 24 * 60)) AS minutes
FROM extra_offer
WHERE decided_by IN ('client', 'phone')
GROUP BY decided_by;`, ph: 'SELECT decided_by, …\nFROM extra_offer\n…', ans: 'В приложении — 33 минуты, по телефону — 54. Приложение быстрее на 20 минут, но до цели «20 минут» ещё далеко.' }
  ];
  async function numEval(ans) {
    const sql = (ans && ans.sql) || {}, sub = {}, notes = [];
    let score = 0, offline = false;
    for (const q of NUM) {
      const s = String(sql[q.id] || '').trim();
      if (!s) { sub[q.id] = { ok: false, why: 'Запрос не написан.' }; notes.push({ ok: false, html: `<b>${esc(q.t)}</b>: запрос не написан.` }); continue; }
      const r = await cmp(s, q.ref, {});
      if (r.offline) { offline = true; break; }
      let ok = r.ok, part = ok ? 1 : 0, why = r.why, warn = null;
      if (!ok && q.tol && nearRes(r.mine, r.ref, q.tol)) { ok = true; part = 1; warn = 'Число сходится с точностью до округления — засчитано.'; }
      const v = single(r.mine), rv = single(r.ref);
      if (!ok && q.pct && v != null && v > 0 && v < 1 && Math.abs(v * 100 - rv) <= q.tol) { ok = true; part = 0.9; warn = 'Вы вернули долю (0,58), а Тимур просил проценты. Умножьте на 100 — так читать проще.'; }
      if (!ok && q.id === 'a') {
        const r2 = await cmp(s, q.inner, {});
        if (r2.ok) { part = 0.6; warn = 'Шесть станций из семи: Азино пропала, потому что у неё ноль неявок. INNER JOIN или WHERE b.status = \'no_show\' выкидывают станции без пары. Нужен LEFT JOIN от station с условием на статус в ON (или SUM(b.status = \'no_show\')).'; }
      }
      if (!ok && q.id === 'b' && v != null && Math.abs(v - 7782) <= 1) why = 'Это средний чек по всем заказ-нарядам с суммой, включая «Готов» — машины ещё не выданы и не оплачены. Добавьте WHERE status = \'closed\'.';
      if (!ok && q.id === 'c' && v != null) {
        if (Math.abs(v - 56.8) <= 0.6) why = 'В знаменателе оказались и предложения «Отправлено» — по ним ещё нет итога. Исключите status = \'sent\'.';
        else if (v === 0) why = 'Получился 0 — целочисленное деление: 21 / 36 в SQL равно 0. Умножьте на 100.0 до деления.';
      }
      if (!ok && q.id === 'd' && r.mine && r.mine.ok && r.mine.rows.some(row => row.some(x => isNum(x) && +x > 0 && +x < 1))) why = 'Похоже, вы получили дни, а не минуты: julianday возвращает дни. Умножьте разность на 24 * 60.';
      score += part / NUM.length;
      sub[q.id] = { ok: part >= 0.6, part, why: warn || why };
      notes.push(part === 1 && !warn ? { ok: true, html: `<b>${esc(q.t)}</b>: сходится с эталоном. ${esc(q.ans)}` } : part > 0 ? { ok: 'warn', html: `<b>${esc(q.t)}</b>: ${esc(warn)}` } : { ok: false, html: `<b>${esc(q.t)}</b>: ${esc(why || 'не сходится с эталоном')}` });
    }
    if (offline) return Object.assign(offlineResult(), { sub: {} });
    const ok = score >= 0.85;
    return { ok, score, sub, notes, summary: `Сходится ${NUM.filter(q => sub[q.id] && sub[q.id].part === 1).length} из ${NUM.length} запросов.`,
      mentor: ok ? null : 'Начните с вопроса «из какой таблицы и какие строки?», потом — «что посчитать?». Неявки — booking.status, средний чек — work_order.total, доп. работы — extra_offer. Сверяйтесь с «что вернуть» под каждым вопросом.' };
  }
  const numbersTask = {
    id: 'numbers', title: 'Тимур Рашидович просит цифры',
    lead: ui.brief({
      situation: '12:00. Тимур Рашидович садится напротив: «В пятницу я в банке — кредит на две новые станции. Мне нужны четыре цифры. Не „примерно“, а из системы». Вера: «Каждый вопрос — один запрос. Пишите, запускайте, смотрите на результат — и только потом отвечайте».',
      todo: ['Для каждого из четырёх вопросов напишите запрос в консоли и запустите (кнопка или Ctrl+Enter). Схема нужных таблиц — под консолью.', 'Сверьтесь с подсказкой «что вернуть»: число столбцов и строк важно, имена столбцов — нет.', 'Нажмите «Проверить»: каждый запрос сравнивается с эталоном на свежей копии базы. Засчитывается, если сходятся все четыре (неявки без станции с нулём — частично).'],
      lookTitle: 'Подсказки', look: 'Неявка — booking.status = \'no_show\'. Выдан — work_order.status = \'closed\'. Согласовано — extra_offer.status = \'approved\', ждёт ответа — \'sent\'. Минуты между датами: (julianday(b) - julianday(a)) * 24 * 60.'
    }),
    blank: () => ({ sql: {} }),
    reference: () => ({ sql: Object.fromEntries(NUM.map(q => [q.id, q.ref])) }),
    render(el, ctx) {
      el.classList.add('m4sq-root');
      const a = ctx.ans; a.sql = a.sql || {};
      const res = ctx.result && ctx.result.sub ? ctx.result.sub : null;
      el.innerHTML = `<div class="stack">${NUM.map((q, i) => { const s = res && res[q.id]; return `<div class="m4sq-item ${s ? (s.part === 1 ? 'ok' : s.part > 0 ? 'warn' : 'bad') : ''}">
        <h5><span class="m4sq-n">Вопрос ${i + 1}</span>${esc(q.t)}</h5>
        ${ui.say('timur', esc(q.ask))}
        <div class="m4sq-cols">Что вернуть: ${esc(q.cols)}</div>
        <div data-nc="${q.id}"></div>
        ${s && s.why && s.part < 1 ? `<div class="m4sq-why">${esc(s.why)}</div>` : ''}
      </div>`; }).join('')}<div data-nsum></div></div>`;
      NUM.forEach(q => sqlCon(TR.$(`[data-nc="${q.id}"]`, el), { value: ctx.readonly ? q.ref : a.sql[q.id] || '', readonly: ctx.readonly, rows: 6, tables: q.tables, placeholder: q.ph, label: 'Запрос: ' + q.t, onChange: v => { a.sql[q.id] = v; ctx.save(); } }));
      if (ctx.result && ctx.result.ok) {
        TR.$('[data-nsum]', el).innerHTML = `<div class="card"><div class="eyebrow">Сводка для Тимура Рашидовича</div>
          <div class="m4sq-sum"><div class="stat"><span class="k">Неявки</span><span class="v">15</span><span class="s">больше всего — Танкодром и Горки</span></div><div class="stat"><span class="k">Средний чек</span><span class="v">7 777 ₽</span><span class="s">97 выданных машин</span></div><div class="stat"><span class="k">Согласие на доп. работы</span><span class="v">58,3 %</span><span class="s">21 из 36</span></div><div class="stat"><span class="k">Ответ клиента</span><span class="v">33 / 54 мин</span><span class="s">приложение / телефон</span></div></div>
          ${ui.say('timur', 'Вот. Это я понимаю. Отправляю в банк.')}${ui.say('vera', 'Тимур Рашидович, дайте нам ещё час. Цифры посчитаны правильно — но данные в базе мы ещё не проверяли. Если там дубли или «дыры», банк их найдёт раньше нас.')}</div>`;
      }
    },
    check: ans => numEval(ans),
    explain: `<p>Четыре вопроса — четыре типовых приёма. <b>Неявки по станциям</b> — GROUP BY по станции, но от таблицы station и через LEFT JOIN с условием на статус в ON: иначе Азино с нулём неявок молча пропадает, а Тимур решит, что данных по ней нет. <b>Средний чек</b> — AVG по выданным: «Готов» ещё не оплачен. <b>Доля</b> — 100.0 * SUM(условие) / COUNT(*): в SQLite условие даёт 1 или 0, а 100.0 спасает от целочисленного деления; знаменатель определяет смысл цифры — его надо согласовать с заказчиком. <b>Время</b> — разность julianday в днях × 24 × 60.</p>
      <p>Главная привычка аналитика: прежде чем отдавать число, проговорить, что именно оно значит («среднее по выданным за 11 января — 10 февраля»), и проверить на здравый смысл (7 777 ₽ — рядом с 7 800 из Excel, значит, порядок верный). Источники: А. Бьюли «Изучаем SQL», гл. 8 и 10; документация SQLite «Date And Time Functions».</p>`,
    refNote: 'Засчитывается любой запрос с тем же результатом: имена столбцов, порядок строк и способ (LEFT JOIN с условием в ON, SUM(CASE…), подзапрос) не важны; числа — с точностью до округления.',
    report: ans => NUM.map(q => `- ${q.t}: ${((ans && ans.sql && ans.sql[q.id]) || '—').replace(/\s+/g, ' ')}`).join('\n')
  };

  // =====================================================================
  // Практика 2. Предскажите результат
  // =====================================================================
  const PRED = [
    { id: 'p1', sql: 'SELECT COUNT(*), COUNT(decided_by)\nFROM offer;', opts: ['6 и 6', '6 и 4', '4 и 4'], ok: 1, why: 'COUNT(*) считает все 6 строк, COUNT(decided_by) — только непустые: у предложений 3 и 5 решения нет.' },
    { id: 'p2', sql: "SELECT COUNT(*)\nFROM offer\nWHERE decided_by <> 'phone';", opts: ['5', '4', '3'], ok: 2, why: 'Строк без «phone» пять, но у двух decided_by = NULL, а NULL <> \'phone\' — «неизвестно», и WHERE их выкидывает. Остаются client, auto, client.' },
    { id: 'p3', sql: 'SELECT status, COUNT(*)\nFROM offer\nGROUP BY status\nHAVING COUNT(*) > 1;', opts: ['1 строка', '3 строки', '4 строки'], ok: 0, why: 'Групп четыре (approved, rejected, expired, sent), но больше одной строки только у approved — в ней три предложения.' },
    { id: 'p4', sql: 'SELECT COUNT(*)\nFROM offer o\nLEFT JOIN photo p ON p.offer_id = o.id;', opts: ['3', '6', '7'], ok: 2, why: 'LEFT сохраняет все 6 предложений, а у предложения 1 две фотографии — оно повторилось. 6 + 1 = 7. С INNER JOIN было бы 3.' },
    { id: 'p5', sql: 'SELECT COUNT(*)\nFROM offer\nWHERE amount BETWEEN 1800 AND 2900;', opts: ['1', '2', '3'], ok: 2, why: 'BETWEEN включает границы: 1 800, 2 400 и 2 900.' },
    { id: 'p6', sql: "SELECT SUM(status = 'approved') / COUNT(*)\nFROM offer;", opts: ['0,5', '0', '50'], ok: 1, why: 'Три согласованных из шести — казалось бы, 0,5. Но 3 / 6 — деление целых чисел, результат 0. Нужно 100.0 * … / COUNT(*).' },
    { id: 'p7', sql: 'SELECT COUNT(DISTINCT decided_by)\nFROM offer;', opts: ['3', '4', '6'], ok: 0, why: 'Разные непустые значения: client, phone, auto. NULL в DISTINCT-подсчёт не входит.' },
    { id: 'p8', sql: 'SELECT id\nFROM offer\nORDER BY amount DESC\nLIMIT 2;', opts: ['5, 3', '1, 2', '5, 6'], ok: 0, why: 'Сначала сортировка по сумме по убыванию: 4 800 (id 5), 3 600 (id 3), 2 900… Потом LIMIT берёт первые две.' }
  ];
  const predictTask = {
    id: 'predict', title: 'Прочитайте запрос и предскажите результат',
    lead: ui.brief({
      situation: '12:30. Лиза приносит распечатку: «Я пишу тест-кейсы по отчётам и хочу заранее знать ожидаемый результат. Вот шесть предложений доп. работ и фотографии к ним. Что вернут эти восемь запросов?» Вера: «Читать SQL глазами — навык, который на собеседовании проверяют чаще, чем писать».',
      todo: ['Посмотрите на мини-таблицы offer и photo.', 'Для каждого запроса выберите, что он вернёт. Без консоли — головой.', 'Нажмите «Проверить». Засчитывается от 6 из 8. После проверки каждый запрос можно выполнить и увидеть результат.'],
      lookTitle: 'Помните', look: 'NULL не равен ничему. COUNT(*) и COUNT(столбец) считают разное. BETWEEN включает границы. Деление целых — целое. LEFT JOIN не теряет строк, но может их размножить.'
    }),
    blank: () => ({ p: {} }),
    reference: () => ({ p: Object.fromEntries(PRED.map(x => [x.id, String(x.ok)])) }),
    render(el, ctx) {
      el.classList.add('m4sq-root');
      const a = ctx.ans; a.p = a.p || {};
      const shown = !!ctx.result || ctx.readonly;
      el.innerHTML = `<div class="stack">
        <div class="m4sq-two">${mini(['id', 'amount', 'status', 'decided_by'], OFFER, null, 'offer — предложения доп. работ')}${mini(['offer_id', 'file'], PHOTO, null, 'photo — фото к предложениям')}</div>
        ${PRED.map((x, i) => { const v = a.p[x.id], has = v != null && v !== ''; const st = shown && has ? (+v === x.ok ? 'ok' : 'bad') : ''; return `<div class="m4sq-item ${st}">
          <h5><span class="m4sq-n">Запрос ${i + 1}</span></h5>
          ${ui.code(x.sql, 'sql')}
          <div class="m4sq-opts">${x.opts.map((o, k) => `<button type="button" class="chip m4sq-opt ${shown && has && +v === k ? (k === x.ok ? 'ok' : 'bad') : ''}" data-pi="${x.id}" data-po="${k}" aria-pressed="${has && +v === k}" ${ctx.readonly ? 'disabled' : ''}>${esc(o)}</button>`).join('')}</div>
          ${shown && has ? `<div class="m4sq-why">${esc(x.why)}</div><div class="row"><button type="button" class="btn sm" data-prun="${x.id}">▶ Выполнить на мини-таблицах</button></div><div data-pout="${x.id}"></div>` : ''}
        </div>`; }).join('')}
      </div>`;
      TR.on(el, 'click', '[data-po]', (e, b) => {
        if (ctx.readonly) return;
        a.p[b.dataset.pi] = b.dataset.po; ctx.save();
        TR.$$(`[data-pi="${b.dataset.pi}"]`, el).forEach(x => { x.setAttribute('aria-pressed', String(x === b)); x.classList.remove('ok', 'bad'); });
        const card = b.closest('.m4sq-item'); card.classList.remove('ok', 'bad');
      });
      TR.on(el, 'click', '[data-prun]', async (e, b) => {
        const x = PRED.find(p => p.id === b.dataset.prun), out = TR.$(`[data-pout="${x.id}"]`, el);
        out.innerHTML = '<div class="small dim">Выполняю…</div>';
        try { out.innerHTML = TR.db.resultHTML(await exec(WITH + x.sql)); } catch (err) { out.innerHTML = ui.note('bad', 'База не загрузилась', OFFLINE); }
      });
    },
    check(ans) {
      const p = (ans && ans.p) || {}, notes = [];
      let good = 0;
      PRED.forEach((x, i) => {
        const v = p[x.id];
        if (v == null || v === '') { notes.push({ ok: false, html: `Запрос ${i + 1}: ответ не выбран.` }); return; }
        if (+v === x.ok) { good++; notes.push({ ok: true, html: `Запрос ${i + 1}: верно — ${esc(x.opts[x.ok])}.` }); }
        else notes.push({ ok: false, html: `Запрос ${i + 1}: не «${esc(x.opts[+v])}». ${esc(x.why)}` });
      });
      const ok = good >= 6;
      return { ok, score: good / PRED.length, notes, summary: `Верно предсказано ${good} из ${PRED.length}.`,
        mentor: ok ? null : 'Проговаривайте запрос по порядку выполнения: какие строки взяли (FROM), какие остались (WHERE — и что с NULL), как сгруппировали, что посчитали. И отдельно спросите себя: «а где тут NULL?»' };
    },
    explain: `<p>Восемь запросов — восемь классических ловушек: <b>COUNT(*) против COUNT(столбца)</b>, <b>NULL в условии &lt;&gt;</b> (строки «теряются»), <b>HAVING</b> по группам, <b>LEFT JOIN размножает</b> строки при связи «один ко многим», <b>BETWEEN включительно</b>, <b>целочисленное деление</b>, <b>DISTINCT без NULL</b>, <b>ORDER BY раньше LIMIT</b>.</p>
      <p>В работе это нужно, чтобы читать чужие запросы: в отчёте BI-системы, в задаче от разработчика, в тест-кейсе Лизы. Если вы можете предсказать результат на шести строках, вы заметите и ошибку на шести тысячах. На собеседовании дают похожие «что вернёт этот запрос» — проговаривайте ход мысли вслух. Источники: ISO/IEC 9075 (трёхзначная логика); А. Бьюли «Изучаем SQL», гл. 4 и 8.</p>`,
    refNote: 'Засчитывается от 6 верных ответов из 8.',
    report: ans => PRED.map((x, i) => { const v = ans && ans.p && ans.p[x.id]; return `- Запрос ${i + 1}: ${v == null ? '—' : x.opts[+v]}${v != null && +v === x.ok ? ' ✓' : ''}`; }).join('\n')
  };

  // =====================================================================
  // Практика 3. Найдите ошибку в запросе
  // =====================================================================
  const DIAG = [
    { v: 'null', t: 'Сравнение с NULL через «=» — нужно IS NULL' },
    { v: 'left', t: 'INNER JOIN теряет строки без пары — нужен LEFT JOIN' },
    { v: 'having', t: 'Условие на агрегат в WHERE — нужен HAVING' },
    { v: 'fan', t: 'JOIN размножил строки — сумма завышена' },
    { v: 'order', t: 'Не хватает ORDER BY' },
    { v: 'quote', t: 'Строки надо брать в двойные кавычки' }
  ];
  const BUGS = [
    { id: 'b1', who: 'kirill', story: 'Хочу понять, кому чек можно прислать только по SMS — у кого нет email. Глеб дал запрос, а он возвращает ноль строк. Не может быть: половина клиентов из Excel без почты!', diag: 'null', tables: ['client'],
      broken: `SELECT id, full_name
FROM client
WHERE email = NULL;`,
      ref: `SELECT id, full_name
FROM client
WHERE email IS NULL;`, fixed: '35 клиентов без email — почти половина базы. Для них чек по 54-ФЗ — только по SMS (BR-10).' },
    { id: 'b2', who: 'kirill', story: 'Нужен список всех клиентов и сколько раз каждый записывался — включая тех, кто не записался ни разу: им пришлю приглашение. А в выгрузке нет Айгуль Фаизовой, хотя она зарегистрировалась вчера!', diag: 'left', tables: ['client', 'booking'],
      broken: `SELECT c.id, c.full_name, COUNT(b.id) AS bookings
FROM client c
JOIN booking b ON b.client_id = c.id
GROUP BY c.id, c.full_name;`,
      ref: `SELECT c.id, c.full_name, COUNT(b.id) AS bookings
FROM client c
LEFT JOIN booking b ON b.client_id = c.id
GROUP BY c.id, c.full_name;`, fixed: 'Все 69 клиентов; у одиннадцати — ноль записей, Кириллу есть кого приглашать. Обратите внимание: COUNT(b.id), а не COUNT(*) — иначе у «нулевых» получится 1.' },
    { id: 'b3', who: 'marina', story: 'Мне нужны станции, где неявок больше двух, — туда первыми включим напоминания. Запрос вообще не запускается, пишет какую-то ошибку.', diag: 'having', tables: ['booking'],
      broken: `SELECT station_id, COUNT(*) AS no_shows
FROM booking
WHERE status = 'no_show' AND COUNT(*) > 2
GROUP BY station_id;`,
      ref: `SELECT station_id, COUNT(*) AS no_shows
FROM booking
WHERE status = 'no_show'
GROUP BY station_id
HAVING COUNT(*) > 2;`, fixed: 'Три станции: Горки (3), Танкодром (6) — по 4 неявки, Дербышки (7) — 3. Фильтр по статусу остаётся в WHERE, условие на число — в HAVING.' },
    { id: 'b4', who: 'olga', story: 'Выручка по выданным заказ-нарядам у меня в 1С — около 754 тысяч за период. Ваш запрос показывает больше двух миллионов. Откуда деньги?', diag: 'fan', tables: ['station', 'work_order', 'work_item'],
      broken: `SELECT s.name, SUM(w.total) AS revenue
FROM station s
JOIN work_order w ON w.station_id = s.id
JOIN work_item i ON i.work_order_id = w.id
WHERE w.status = 'closed'
GROUP BY s.name;`,
      ref: `SELECT s.name, SUM(w.total) AS revenue
FROM station s
JOIN work_order w ON w.station_id = s.id
WHERE w.status = 'closed'
GROUP BY s.name;`, fixed: '754 350 ₽ — сходится с 1С. total — итог заказ-наряда, а строк в нём в среднем три: JOIN повторил total по разу на каждую строку.' }
  ];
  async function bugsEval(ans) {
    const d = (ans && ans.diag) || {}, f = (ans && ans.fix) || {}, sub = {}, notes = [];
    let score = 0, fixes = 0;
    for (let i = 0; i < BUGS.length; i++) {
      const b = BUGS[i], s = String(f[b.id] || '').trim();
      const dOk = d[b.id] === b.diag;
      let fOk = false, why = '';
      if (!s || TR.norm(s) === TR.norm(b.broken)) why = 'запрос не исправлен';
      else {
        const r = await cmp(s, b.ref, {});
        if (r.offline) return Object.assign(offlineResult(), { sub: {} });
        fOk = r.ok; why = r.why;
        if (!fOk && b.id === 'b2' && /left/i.test(s) && /count\s*\(\s*\*\s*\)/i.test(s)) why = 'LEFT JOIN на месте, но COUNT(*) посчитал строку с NULL справа как запись: у клиентов без записей вышло 1. Считайте COUNT(b.id).';
        if (!fOk && b.id === 'b4' && /work_item/i.test(s)) why = 'Соединение со строками заказ-наряда всё ещё размножает total. Для суммы итогов строки не нужны.';
      }
      if (fOk) fixes++;
      score += ((dOk ? 0.4 : 0) + (fOk ? 0.6 : 0)) / BUGS.length;
      sub[b.id] = { dOk, fOk, why };
      notes.push({ ok: dOk && fOk ? true : dOk || fOk ? 'warn' : false, html: `Запрос ${i + 1}: диагноз ${dOk ? 'верный' : d[b.id] ? `неверный («${esc((DIAG.find(x => x.v === d[b.id]) || {}).t || '')}»)` : 'не выбран'}; исправление ${fOk ? 'сходится с эталоном' : '— ' + esc(why)}.` });
    }
    const ok = score >= 0.8 && fixes >= 3;
    return { ok, score, sub, notes, summary: `Диагнозов верно: ${BUGS.filter(b => sub[b.id].dOk).length} из ${BUGS.length}, исправлено запросов: ${fixes} из ${BUGS.length}.`,
      mentor: ok ? null : 'Сначала запустите запрос «как есть» и посмотрите на симптом: ноль строк, ошибка, пропавшая строка, слишком большая сумма. Симптом подсказывает диагноз — а диагноз подсказывает исправление.' };
  }
  const bugsTask = {
    id: 'bugs', title: 'Найдите ошибку в запросе',
    lead: ui.brief({
      situation: '13:10. В общий чат «Искры» прилетают три жалобы: «запрос врёт». Кирилл, Марина Олеговна и Ольга Викторовна пользуются запросами, которые им когда-то набросал Глеб. Глеб на созвоне: «Разберитесь, пожалуйста, я в релизе».',
      todo: ['Прочитайте жалобу и запустите запрос «как есть» — посмотрите на симптом.', 'Выберите диагноз из списка.', 'Исправьте запрос в консоли (в ней уже лежит исходный) и запустите.', 'Нажмите «Проверить». Засчитывается, если диагнозы и исправления в сумме дают от 80 % и исправлены хотя бы три запроса из четырёх.'],
      lookTitle: 'Симптом → диагноз', look: 'Ноль строк там, где они точно есть, — сравнение с NULL. Пропали строки «без пары» — INNER JOIN. Ошибка про агрегат — WHERE вместо HAVING. Сумма в разы больше — JOIN размножил строки.'
    }),
    blank: () => ({ diag: {}, fix: {} }),
    reference: () => ({ diag: Object.fromEntries(BUGS.map(b => [b.id, b.diag])), fix: Object.fromEntries(BUGS.map(b => [b.id, b.ref])) }),
    render(el, ctx) {
      el.classList.add('m4sq-root');
      const a = ctx.ans; a.diag = a.diag || {}; a.fix = a.fix || {};
      const res = ctx.result && ctx.result.sub ? ctx.result.sub : null;
      el.innerHTML = `<div class="stack">${BUGS.map((b, i) => { const s = res && res[b.id]; return `<div class="m4sq-item ${s ? (s.dOk && s.fOk ? 'ok' : s.dOk || s.fOk ? 'warn' : 'bad') : ''}">
        <h5><span class="m4sq-n">Запрос ${i + 1}</span></h5>
        ${ui.say(b.who, esc(b.story))}
        <div class="small muted">Запрос, который «врёт»:</div>
        ${ui.code(b.broken, 'sql')}
        ${ctx.readonly ? '' : `<div class="row"><button type="button" class="btn sm" data-brun="${b.id}">▶ Запустить как есть</button></div><div data-bout="${b.id}"></div>`}
        <label class="small muted" style="display:grid;gap:4px">Диагноз
          <select data-bd="${b.id}" aria-label="Диагноз для запроса ${i + 1}" ${ctx.readonly ? 'disabled' : ''}><option value="">Выберите…</option>${DIAG.map(x => `<option value="${x.v}" ${a.diag[b.id] === x.v ? 'selected' : ''}>${esc(x.t)}</option>`).join('')}</select></label>
        <div class="small muted">Исправленный запрос:</div>
        <div data-bfix="${b.id}"></div>
        ${s && !(s.dOk && s.fOk) ? `<div class="m4sq-why">${s.dOk ? '' : 'Диагноз не тот. '}${s.fOk ? '' : esc(s.why)}</div>` : ''}
        ${(s && s.fOk) || ctx.readonly ? `<div class="m4sq-why">✓ ${esc(b.fixed)}</div>` : ''}
      </div>`; }).join('')}</div>`;
      BUGS.forEach(b => {
        if (!ctx.readonly && a.fix[b.id] == null) { a.fix[b.id] = b.broken; ctx.save(); }
        sqlCon(TR.$(`[data-bfix="${b.id}"]`, el), { value: ctx.readonly ? b.ref : a.fix[b.id], readonly: ctx.readonly, rows: 6, tables: b.tables, label: 'Исправленный запрос', onChange: v => { a.fix[b.id] = v; ctx.save(); } });
      });
      el.addEventListener('change', e => { const s = e.target.closest('[data-bd]'); if (!s || ctx.readonly) return; a.diag[s.dataset.bd] = s.value; ctx.save(); });
      TR.on(el, 'click', '[data-brun]', async (e, btn) => {
        const b = BUGS.find(x => x.id === btn.dataset.brun), out = TR.$(`[data-bout="${b.id}"]`, el);
        out.innerHTML = `<div class="small dim">${TR.db.loaded ? 'Выполняю…' : 'Загружаю базу «Искры»…'}</div>`;
        try { out.innerHTML = TR.db.resultHTML(await exec(b.broken), { max: 12 }); } catch (err) { out.innerHTML = ui.note('bad', 'База не загрузилась', OFFLINE); }
      });
    },
    check: ans => bugsEval(ans),
    explain: `<p>Четыре ошибки, которые встречаются в каждом втором самописном отчёте. <b>= NULL</b> — всегда «неизвестно», поэтому ноль строк без всякой ошибки: самое коварное — запрос «работает». <b>INNER вместо LEFT</b> — теряются как раз самые интересные строки: клиенты без записей, станции без неявок. <b>WHERE вместо HAVING</b> — к моменту WHERE групп ещё нет; SQLite хотя бы честно падает с ошибкой. <b>Размножение строк</b> — сумма поля «одной» стороны после JOIN со «многими»: Ольга Викторовна получила почти втрое больше денег, чем есть.</p>
      <p>Обратите внимание, как вы нашли ошибку: не перечитывая код, а сравнив результат со здравым смыслом и с другим источником (1С, Excel, «Айгуль же есть»). Это главный навык: проверять цифры независимым способом. Источники: А. Бьюли «Изучаем SQL», гл. 5 и 10; К. Дж. Дейт «SQL и реляционная теория» (о NULL).</p>`,
    refNote: 'Засчитывается любое исправление с тем же результатом, что у эталона: например, NOT EXISTS вместо LEFT JOIN или подзапрос вместо HAVING.',
    report: ans => BUGS.map((b, i) => `- Запрос ${i + 1}: диагноз ${(ans && ans.diag && ans.diag[b.id]) || '—'}; исправление: ${((ans && ans.fix && ans.fix[b.id]) || '—').replace(/\s+/g, ' ')}`).join('\n')
  };

  // =====================================================================
  // Практика 4. Лаборатория: можно ли верить цифрам?
  // =====================================================================
  const CASES = [
    { id: 'dup', t: 'Дубли клиентов', hyp: 'Клиентов переносили из Excel Марины Олеговны, а там телефоны и как +7…, и как 8…. Найдите клиентов, чей телефон начинается на 8.', tables: ['client'],
      ref: `SELECT d.id, d.phone, o.id AS original_id
FROM client d
JOIN client o ON o.phone = '+7' || substr(d.phone, 2)
WHERE d.phone LIKE '8%';`,
      acts: [
        { v: 'del', k: 'bad', t: 'Удалю дубли сам: DELETE FROM client WHERE phone LIKE \'8%\'.', cons: 'DELETE не прошёл: на карточку Галиева ссылаются машина и запись на 16 февраля (внешний ключ). Глеб: «Хорошо, что ключи включены. Иначе запись осталась бы без клиента, а Галиев приехал бы в никуда. И вообще — у вас доступ только на чтение, и правильно».' },
        { v: 'merge', k: 'good', t: 'Сообщу Марине Олеговне и Глебу: объединить карточки (перенести машины и записи на основную), привести телефоны к +7, добавить проверку формата при импорте и регистрации.', cons: 'Марина объединяет две пары карточек за десять минут: машины и записи переехали на основные. Глеб добавляет нормализацию телефона: 8… превращается в +7… при сохранении. Клиентов честно 67, а не 69.' },
        { v: 'skip', k: 'bad', t: 'Ничего не делать: два клиента из 69 — погрешность.', cons: 'Кирилл запускает рассылку: Елена Смирнова получает два одинаковых SMS и пишет в отзыве «у вас бардак». А счётчик неявок у дубля свой: клиент с двумя неявками может записаться со второй карточки без предоплаты — BR-4 обходится.' }
      ], miss: 'Дубли не нашли. Кирилл запускает рассылку: Елена Смирнова получает два одинаковых SMS. В отчёте для банка — 69 клиентов вместо 67.' },
    { id: 'done', t: 'Завершена без заказ-наряда', hyp: 'Запись в статусе «Завершена» (done) означает, что машину приняли и выдали — значит, у неё должен быть заказ-наряд. Найдите завершённые записи без заказ-наряда.', tables: ['booking', 'work_order'],
      ref: `SELECT b.id
FROM booking b
LEFT JOIN work_order w ON w.booking_id = b.id
WHERE b.status = 'done' AND w.id IS NULL;`,
      acts: [
        { v: 'fake', k: 'bad', t: 'Создать для них заказ-наряды задним числом на сумму среднего чека — чтобы отчёт сходился.', cons: 'Ольга Викторовна находит два заказ-наряда без строк и оплат по 7 777 ₽: выручка, которой не было. Неприятный разговор, а в банк чуть не ушли выдуманные деньги.' },
        { v: 'ask', k: 'good', t: 'Уточнить у Марины Олеговны, что случилось с этими визитами, показать их в отчёте отдельной строкой и завести дефект: статус «Завершена» ставится только при выдаче заказ-наряда.', cons: 'Марина: «16–17 января, Горки и Победы — АРМ завис, принимали по старинке, в 1С». Документы нашлись в 1С. Глеб добавляет правило перехода статуса. В отчёте честная сноска.' },
        { v: 'hide', k: 'warn', t: 'Тихо исключить эти две записи из отчёта.', cons: 'Цифры сходятся, но о дыре в процессе никто не узнал. Через месяц таких «завершённых без документа» — двадцать, и одну из них клиент оспаривает по гарантии (BR-14): документа нет.' }
      ], miss: 'Не нашли: в отчёте «завершено 99 визитов», а денег и документов — по 97. Банк спрашивает, откуда расхождение, и Тимуру нечего ответить.' },
    { id: 'debt', t: 'Выдан без оплаты', hyp: 'Заказ-наряд «Выдан» (closed) — машину отдали клиенту. Платёж должен быть: онлайн, на кассе или счёт компании (BR-10). Найдите выданные заказ-наряды, по которым нет ни одного платежа.', tables: ['work_order', 'payment'],
      ref: `SELECT w.id, w.number
FROM work_order w
WHERE w.status = 'closed'
  AND NOT EXISTS (SELECT 1 FROM payment p WHERE p.work_order_id = w.id);`,
      acts: [
        { v: 'del', k: 'bad', t: 'Удалить этот заказ-наряд, чтобы не портил выручку.', cons: 'Удаление не прошло: на заказ-наряд ссылаются строки работ (внешний ключ). А если бы прошло — пропала бы история ремонта и гарантия клиента, а документы по BR-16 хранятся 5 лет.' },
        { v: 'olga', k: 'good', t: 'Передать Ольге Викторовне номер и сумму заказ-наряда и предложить правило: перевести в «Выдан» можно только при оплате или выставленном счёте компании (BR-10).', cons: 'Ольга Викторовна звонит клиенту по ЗН-5-0479: «заплачу потом» превращается в оплату 9 000 ₽ в тот же день. Глеб добавляет проверку перехода в «Выдан».' },
        { v: 'fakepay', k: 'bad', t: 'Добавить платёж вручную со статусом paid — клиент ведь наверняка заплатил.', cons: 'Фиктивный платёж без чека по 54-ФЗ: расхождение с кассой и ЮKassa, Ольга Викторовна в ужасе — это риск штрафа. Платёж удаляют, а доверие к вашим данным падает.' }
      ], miss: 'Не нашли: долг 9 000 ₽ по ЗН-5-0479 висит незамеченным. Через месяц клиент «не помнит», а в отчёте для банка выручка завышена.' },
    { id: 'time', t: 'Окончание раньше начала', hyp: 'Длительность записи — сумма нормо-часов услуг (BR-1), окончание всегда позже начала. Найдите записи, где end_at раньше start_at.', tables: ['booking'],
      ref: `SELECT id, start_at, end_at
FROM booking
WHERE end_at < start_at;`,
      acts: [
        { v: 'swap', k: 'warn', t: 'Поменять местами start_at и end_at UPDATE-ом — очевидно же, перепутали.', cons: 'Получилось 13:30–14:30, а клиент едет к 14:30 — оператор перепутал не порядок, а время окончания. Пост «занят» не тогда. Сначала надо было уточнить у клиента и станции.' },
        { v: 'call', k: 'good', t: 'Срочно сообщить на станцию Победы — запись сегодня в 14:30: уточнить время у клиента. Завести дефект: ограничение CHECK (end_at > start_at) и окончание считать по нормо-часам, а не вводить руками.', cons: 'Станция звонит клиенту: запись 14:30–15:30, время исправлено до его приезда. Глеб добавляет ограничение и автоматический расчёт окончания по BR-1 — оператор больше не вводит его руками.' },
        { v: 'skip', k: 'bad', t: 'Ничего: запись по телефону, это зона колл-центра.', cons: 'Сегодня в 14:30 на Победы: расписание считает, что запись закончилась в 13:30, и оператор ставит на тот же пост вторую машину. Две машины на один подъёмник, клиент ждёт час.' }
      ], miss: 'Не нашли. Сегодня в 14:30 на Победы расписание считает пост свободным — на него ставят вторую машину. Две машины на один подъёмник.' }
  ];
  async function labEval(ans) {
    const q = (ans && ans.q) || {}, act = (ans && ans.act) || {}, found = {}, notes = [];
    let score = 0;
    for (const c of CASES) {
      const s = String(q[c.id] || '').trim();
      let f = false, why = 'запрос не написан';
      if (s) {
        const r = await cmp(s, c.ref, {});
        if (r.offline) return Object.assign(offlineResult(), { lab: null });
        f = hitRows(r.mine, r.ref);
        why = f ? '' : !r.mine.ok ? r.mine.error : r.mine.total === 0 ? 'запрос вернул ноль строк' : superRows(r.mine, r.ref) ? `нашлись нужные строки, но вместе с лишними (${r.mine.total})` : `найдено ${r.mine.total} ${TR.plural(r.mine.total, 'строка', 'строки', 'строк')}, а это не те`;
        if (!f && c.id === 'debt' && superRows(r.mine, r.ref)) why += ': похоже, вы искали «нет оплаченного платежа» и захватили заказ-наряды «Шашки» и «ТрансЛогистик» со счётом в статусе «Ожидает». По BR-10 юрлица платят раз в месяц — это не долг. Ищите заказ-наряды, где платежей нет совсем';
      }
      const A = c.acts.find(x => x.v === act[c.id]);
      found[c.id] = f;
      score += ((f ? 0.6 : 0) + (A ? (A.k === 'good' ? 0.4 : A.k === 'warn' ? 0.15 : 0) : 0)) / CASES.length;
      notes.push({ ok: f && A && A.k === 'good' ? true : f || (A && A.k !== 'bad') ? 'warn' : false, html: `<b>${esc(c.t)}</b>: ${f ? 'найдено' : 'не найдено — ' + esc(why)}; решение — ${A ? (A.k === 'good' ? 'верное' : A.k === 'warn' ? 'спорное' : 'опасное') : 'не выбрано'}.` });
    }
    const allFound = CASES.every(c => found[c.id]);
    const noBad = CASES.every(c => { const A = c.acts.find(x => x.v === act[c.id]); return A && A.k !== 'bad'; });
    const ok = allFound && noBad && score >= 0.85;
    return { ok, score, notes, lab: { found, act: Object.assign({}, act) },
      summary: `Найдено аномалий: ${CASES.filter(c => found[c.id]).length} из ${CASES.length}. Неделя спустя — смотрите ленту последствий под заданием.`,
      mentor: ok ? null : !allFound ? 'Для каждой гипотезы: какие строки «неправильные» и по какому признаку их отличить? «Нет пары» — LEFT JOIN … IS NULL или NOT EXISTS; формат — LIKE; время — сравнение столбцов.' : 'Найти — половина дела. Аналитик не правит данные сам и не прячет проблему: он сообщает владельцу данных, предлагает правило, которое не даст ошибке повториться, и честно показывает её в отчёте.' };
  }
  const labTask = {
    id: 'lab', title: 'Лаборатория: можно ли верить цифрам?',
    simple: {
      icon: '🧪',
      plain: 'Прежде чем отдавать цифры заказчику, аналитик проверяет данные: дубли, «сироты» без связанных записей, противоречивые статусы, невозможные значения. Каждую найденную проблему — не исправить тайком, а сообщить владельцу и предложить правило, которое не даст ей повториться.',
      analogy: 'Бухгалтер перед сдачей отчёта сверяет кассу с выпиской банка. Нашёл расхождение — не дописывает цифру ручкой, а выясняет, откуда оно.',
      tech: 'Измерения качества данных (DAMA-DMBOK, глава 13): полнота, уникальность, согласованность, достоверность, своевременность. Типовые проверки: дубли по нормализованному ключу, анти-соединение для «сирот», проверка допустимых переходов статуса, ограничения CHECK. Исправления — через владельца данных и процесс, а не прямым UPDATE в проде.'
    },
    lead: ui.brief({
      situation: '14:00. Вера: «Тимур хочет отправить цифры в банк. Пока он пьёт чай, проверим, можно ли этой базе верить. Глеб признался: при переносе из Excel и в первые недели тестовой эксплуатации было всякое. Вот четыре гипотезы — проверьте каждую запросом и решите, что делать с находкой».',
      todo: ['Для каждой гипотезы напишите запрос, который находит «неправильные» строки, и запустите его.', 'Выберите, что делаете с находкой.', 'Нажмите «Проверить» — увидите, что произошло через неделю. Засчитывается, если найдены все четыре проблемы и ни одно решение не опасное.'],
      lookTitle: 'Приёмы', look: 'Формат телефона — LIKE \'8%\'. Нет связанной строки — LEFT JOIN … WHERE правая.id IS NULL или NOT EXISTS (SELECT 1 FROM … WHERE …). Сравнение двух столбцов — WHERE a < b. В консоли можно всё, даже DELETE: каждый запрос выполняется на свежей копии снимка, данные не испортятся.'
    }),
    blank: () => ({ q: {}, act: {} }),
    reference: () => ({ q: Object.fromEntries(CASES.map(c => [c.id, c.ref])), act: Object.fromEntries(CASES.map(c => [c.id, c.acts.find(x => x.k === 'good').v])) }),
    render(el, ctx) {
      el.classList.add('m4sq-root');
      const a = ctx.ans; a.q = a.q || {}; a.act = a.act || {};
      const L = ctx.result && ctx.result.lab;
      el.innerHTML = `<div class="stack">${CASES.map((c, i) => `<div class="m4sq-item ${L ? (L.found[c.id] ? 'ok' : 'bad') : ''}">
        <h5><span class="m4sq-n">Гипотеза ${i + 1}</span>${esc(c.t)}</h5>
        <p class="small">${esc(c.hyp)}</p>
        <div data-lc="${c.id}"></div>
        <div class="small muted">Что делаете с находкой?</div>
        <div class="m4sq-acts">${c.acts.map(x => `<button type="button" class="m4sq-act" data-la="${c.id}" data-lv="${x.v}" aria-pressed="${a.act[c.id] === x.v}" ${ctx.readonly ? 'disabled' : ''}>${esc(x.t)}</button>`).join('')}</div>
      </div>`).join('')}<div data-ltl></div></div>`;
      CASES.forEach(c => sqlCon(TR.$(`[data-lc="${c.id}"]`, el), { value: ctx.readonly ? c.ref : a.q[c.id] || '', readonly: ctx.readonly, rows: 5, tables: c.tables, label: 'Запрос: ' + c.t, onChange: v => { a.q[c.id] = v; ctx.save(); } }));
      TR.on(el, 'click', '[data-la]', (e, b) => {
        if (ctx.readonly) return;
        const c = CASES.find(x => x.id === b.dataset.la);
        a.act[c.id] = b.dataset.lv; ctx.save();
        TR.$$(`[data-la="${c.id}"]`, el).forEach(x => x.setAttribute('aria-pressed', String(x === b)));
        ctx.decide('Лаборатория: ' + c.t, c.acts.find(x => x.v === b.dataset.lv).t);
      });
      if (L) {
        const ev = CASES.map(c => {
          const A = c.acts.find(x => x.v === L.act[c.id]);
          if (!L.found[c.id]) return ['bad', c.t, c.miss];
          if (!A) return ['warn', c.t, 'Нашли, но ничего не решили: проблема так и висит в базе.'];
          return [A.k === 'good' ? 'ok' : A.k, c.t, A.cons];
        });
        const good = ev.filter(e => e[0] === 'ok').length;
        TR.$('[data-ltl]', el).innerHTML = `<div class="eyebrow">Неделя спустя · среда, 17 февраля</div><div class="m4sq-tl">${ev.map(e => `<div class="m4sq-ev ${e[0]}"><span class="d">${esc(e[1])}</span><span>${esc(e[2])}</span></div>`).join('')}</div>
          ${good === CASES.length ? ui.say('timur', 'Банк задал два вопроса — про долг и про два визита без документов. У меня были ответы раньше, чем они спросили. Хорошая работа.') : ui.say('vera', `Хорошо закончились ${good} из ${CASES.length} историй. Посмотрите на остальные: где не нашли — какой признак отличает «плохие» строки? Где решение ударило — кто владелец этих данных и какое правило не даст ошибке повториться?`)}`;
      }
    },
    check: ans => labEval(ans),
    explain: `<p>Четыре проблемы — четыре измерения качества данных. <b>Уникальность</b>: дубли 8… и +7… — один человек, два счётчика неявок, две рассылки. <b>Согласованность</b>: запись «Завершена» без заказ-наряда, заказ-наряд «Выдан» без платежа — статусы двух таблиц противоречат друг другу. <b>Достоверность</b>: окончание раньше начала — значение, которого не бывает в природе. Пятый случай — клиентка без визитов (Айгуль Фаизова) — не ошибка: зарегистрировалась вчера; не всякая «странность» — дефект.</p>
      <p>Решения различаются сильнее запросов. Аналитик <b>не правит прод сам</b> (у него и доступа на запись быть не должно), <b>не прячет</b> проблему и <b>не выдумывает</b> данные. Он сообщает владельцу (Марина — клиенты и записи, Ольга Викторовна — деньги, станция — сегодняшнее расписание), предлагает правило, которое закроет дыру (нормализация телефона, допустимые переходы статусов, CHECK, расчёт окончания по BR-1), и честно показывает проблему в отчёте. Обратите внимание, как внешние ключи спасли базу от DELETE: ограничения — это требования, которые аналитик пишет в словаре данных. Источники: DAMA-DMBOK, гл. 13 «Качество данных»; Вигерс, гл. 13 о требованиях к данным.</p>`,
    refNote: 'Засчитывается любой запрос, который находит ровно эти строки (по любому столбцу: id, номер, телефон), — например, NOT EXISTS вместо LEFT JOIN или substr(phone, 1, 1) = \'8\' вместо LIKE.',
    report: ans => CASES.map(c => `- ${c.t}: ${((ans && ans.q && ans.q[c.id]) || '—').replace(/\s+/g, ' ')} → ${(ans && ans.act && ans.act[c.id]) || '—'}`).join('\n')
  };

  // =====================================================================
  // Практика 5. Проверьте BR-4 запросом и объясните Лизе
  // =====================================================================
  const BR4_A = `SELECT client_id, COUNT(*) AS no_shows
FROM booking
WHERE status = 'no_show'
GROUP BY client_id
HAVING COUNT(*) >= 2;`;
  const BR4_HIST = `SELECT b.client_id,
       c.no_show_count,
       group_concat(b.status || ' ' || substr(b.start_at, 6, 11), '  →  ') AS history
FROM (SELECT * FROM booking ORDER BY start_at) b
JOIN client c ON c.id = b.client_id
WHERE b.client_id IN (9, 28, 66)
GROUP BY b.client_id;`;
  const BR4_W = `SELECT b.id, b.client_id, b.source, b.status, b.start_at
FROM booking b
JOIN client c ON c.id = b.client_id
WHERE c.no_show_count >= 2
  AND b.source IN ('app', 'site')
  AND b.status = 'confirmed'
  AND b.start_at > '2027-02-10 12:00';`;
  const BR4_Q = { q: 'Нарушено ли сейчас BR-4 («после 2 неявок подряд онлайн-запись только с предоплатой»)?', options: [
    { t: 'Да: у трёх клиентов по 2–3 неявки, а их будущие записи подтверждены без предоплаты', ok: false, why: 'Первый запрос считает неявки за весь период, а правило — про неявки подряд. У всех троих между неявками был визит, и счётчик сбросился.' },
    { t: 'Нет: правило про неявки подряд — у всех троих после неявок был визит, счётчик no_show_count меньше 2', ok: true, why: 'Верно. «За период» и «подряд» — разные вопросы. Клиент 28 не приехал дважды подряд, но потом пришёл — по правилу счётчик обнулился.' },
    { t: 'Нельзя сказать без доступа к коду', ok: false, why: 'Код не нужен: правило проверяется по данным — истории записей и счётчику в карточке клиента.' }
  ] };
  const BR4_RUBRIC = [
    'Отвечает по данным: сейчас нарушений нет — у трёх клиентов 2–3 неявки за период, но не подряд или после визита счётчик сброшен; запрос-сторож вернул ноль строк',
    'Различает «за период» и «подряд»: простой COUNT по статусу даёт ложную тревогу, правило — про неявки подряд, визит сбрасывает счётчик',
    'Предлагает запрос-сторож для регресса или мониторинга: клиенты с no_show_count ≥ 2, онлайн-запись подтверждена без предоплаты — должно быть 0 строк',
    'Называет тест-кейсы: две неявки подряд → следующая онлайн-запись «Ждёт предоплаты» на 500 ₽; визит сбрасывает счётчик; граница 15 минут (14 — ещё не неявка, 16 — неявка)',
    'Поднимает открытые вопросы к бизнесу: сбрасывает ли счётчик отмена, касается ли правило корпоративных клиентов и записи по телефону'
  ];
  const BR4_REF = 'Лиза, по данным тестового контура BR-4 сейчас не нарушено. Сначала я посчитала неявки за весь период: у трёх клиентов их 2–3, и это выглядит как тревога. Но правило про неявки подряд. По истории видно, что у всех троих между неявками или после них был визит, и счётчик no_show_count у них 0 или 1. Например, у клиента 28 две неявки подряд в январе, но 29 января он приехал — по правилу предоплата больше не нужна. Для регресса предлагаю запрос-сторож: будущие онлайн-записи (приложение и сайт) в статусе «Подтверждена» у клиентов с no_show_count ≥ 2 — он должен возвращать ноль строк; сейчас ноль. Тест-кейсы: две неявки подряд — следующая онлайн-запись создаётся в статусе «Ждёт предоплаты» на 500 ₽; визит после неявок обнуляет счётчик; неявка ставится через 15 минут после начала — проверить 14 и 16 минут. Открытые вопросы к Тимуру Рашидовичу и Марине Олеговне: сбрасывает ли счётчик отмена записи (у клиента 66 между неявками были отмены), касается ли правило корпоративных клиентов — клиент 66 из «ТрансЛогистик» платит по счёту, — и нужна ли предоплата при записи по телефону через колл-центр.';
  const BR4_FEAT = [
    { t: 'нарушений нет', test: s => /(не нарушен|нарушений нет|нет нарушени|соблюда|ноль строк|0 строк)/.test(s) },
    { t: 'подряд ≠ за период', test: s => /подряд/.test(s) },
    { t: 'запрос-сторож / регресс', test: s => /(сторож|регресс|мониторинг|0 строк|ноль строк|пуст)/.test(s) },
    { t: 'тест-кейсы и граница 15 минут', test: s => /(15 мин|14|16|тест)/.test(s) },
    { t: 'вопросы бизнесу', test: s => /(отмен|корпорат|юрлиц|шашк|транслогист|телефон)/.test(s) }
  ];
  async function br4Eval(ans) {
    const a = ans || {}, notes = [];
    let aOk = false, wOk = false;
    const sa = String(a.a || '').trim(), sw = String(a.w || '').trim();
    if (sa) {
      const r = await cmp(sa, BR4_A, {});
      if (r.offline) return offlineResult();
      aOk = r.ok || (r.mine && r.mine.ok && r.mine.total === 3 && hitRows(r.mine, r.ref));
      notes.push(aOk ? { ok: true, html: 'Шаг 1: три клиента с двумя и более неявками за период — 9, 28 и 66.' } : { ok: false, html: `Шаг 1: ${esc(r.why || 'не те клиенты')}. Нужно: booking со статусом no_show, группировка по клиенту, HAVING COUNT(*) >= 2.` });
    } else notes.push({ ok: false, html: 'Шаг 1: запрос не написан.' });
    const qs = ui.quizScore(BR4_Q, a.qv);
    notes.push(qs.ok ? { ok: true, html: 'Шаг 2: верно — правило про неявки подряд, сейчас оно не нарушено.' } : { ok: false, html: (a.qv && a.qv.length) ? `Шаг 2: ${esc(BR4_Q.options[a.qv[0]].why)}` : 'Шаг 2: ответ не выбран.' });
    if (sw) {
      const low = sw.toLowerCase();
      const feats = [/no_show_count/.test(low), />=\s*2|>\s*1/.test(low), /source|'app'|'site'/.test(low), /status/.test(low)];
      let r;
      try { r = await exec(sw); } catch (e) { return offlineResult(); }
      wOk = r.ok && r.total === 0 && feats.every(Boolean);
      notes.push(wOk ? { ok: true, html: 'Шаг 3: запрос-сторож вернул ноль строк — правило соблюдается, и запрос можно отдать в регресс.' } : { ok: false, html: `Шаг 3: ${!r.ok ? esc(r.error) : r.total ? `сторож нашёл ${r.total} ${TR.plural(r.total, 'строку', 'строки', 'строк')} — условие слишком широкое или вы ищете не нарушения` : 'в запросе не видно всех признаков правила'}. Нужны: no_show_count ≥ 2, онлайн-источник (app, site), статус подтверждённой записи${feats[0] ? '' : ' · нет no_show_count'}${feats[1] ? '' : ' · нет порога ≥ 2'}${feats[2] ? '' : ' · нет source'}${feats[3] ? '' : ' · нет status'}.` });
    } else notes.push({ ok: false, html: 'Шаг 3: запрос-сторож не написан.' });
    const js = ui.justifyScore(a.j), txt = TR.norm((a.j && a.j.text) || '');
    if (txt) BR4_FEAT.forEach(f => { if (!f.test(txt)) notes.push({ ok: 'warn', html: `В ответе Лизе не видно: ${esc(f.t)}.` }); });
    const score = (aOk ? 0.25 : 0) + (qs.ok ? 0.15 : 0) + (wOk ? 0.2 : 0) + js * 0.4;
    const ok = aOk && qs.ok && wOk && js >= 0.6;
    return { ok, score, notes, summary: `Запросы: ${[aOk, wOk].filter(Boolean).length} из 2, вывод ${qs.ok ? 'верный' : 'неверный'}, ответ Лизе — ${js ? Math.round(js * 100) + ' %' : 'не оценён'}.`,
      mentor: ok ? null : !qs.ok ? 'Перечитайте правило слово за словом: «после 2 неявок подряд». Запрос «сколько неявок за период» отвечает на другой вопрос — и даёт ложную тревогу.' : 'Лизе нужно три вещи: вывод по данным, проверка, которую можно гонять каждый релиз (запрос-сторож и тест-кейсы), и список того, что в правиле ещё не определено.' };
  }
  const br4Task = {
    id: 'br4', title: 'Проверьте BR-4 запросом и объясните Лизе',
    simple: {
      icon: '🛡️',
      plain: 'Требование можно проверить не только тестом в интерфейсе, но и запросом к данным: ищем строки, которые правило запрещает. Если запрос вернул ноль строк — правило соблюдается. Но сначала надо точно прочитать правило: «две неявки за месяц» и «две неявки подряд» — разные запросы.',
      analogy: 'Правило «после двух опозданий подряд — разговор с руководителем». Если сотрудник опоздал в понедельник и в пятницу, а между ними приходил вовремя, — разговора не будет, хотя опозданий два.',
      tech: 'Верификация требований на данных — часть приёмки и мониторинга (Вигерс, гл. 17 «Проверка требований»); запрос-инвариант («должен вернуть 0 строк») используется в регрессе и в мониторинге качества данных (DAMA-DMBOK). Граничные значения (15 минут) — техника тест-дизайна ISTQB.'
    },
    lead: ui.brief({
      situation: '15:00. Лиза: «Мне надо подтвердить BR-4: после двух неявок подряд — онлайн-запись только с предоплатой 500 ₽. Я посчитала неявки по клиентам — у троих их по две и больше, а записи у них подтверждены без всякой предоплаты. Это баг?»',
      todo: ['Шаг 1. Повторите запрос Лизы: клиенты с двумя и более неявками (два столбца: client_id и число неявок).', 'Посмотрите историю записей этих клиентов — готовый запрос под шагом 1.', 'Шаг 2. Ответьте: нарушено ли правило.', 'Шаг 3. Напишите запрос-сторож: он ищет нарушения BR-4 и должен вернуть ноль строк, если правило соблюдается.', 'Шаг 4. Объясните Лизе своими словами (от 300 символов). Засчитывается, если верны шаги 1–3 и ответ набирает от 60 %.'],
      lookTitle: 'Подсказка', look: 'client.no_show_count — «неявок подряд», сбрасывается в 0 при визите. Ждёт предоплаты — booking.status = \'new\'. Онлайн — source IN (\'app\', \'site\'). «Сейчас» — 2027-02-10 12:00.'
    }),
    blank: () => ({ a: '', qv: [], w: '', j: {} }),
    reference: () => ({ a: BR4_A, qv: [1], w: BR4_W, j: { text: BR4_REF, self: BR4_RUBRIC.map(() => true) } }),
    render(el, ctx) {
      el.classList.add('m4sq-root');
      const a = ctx.ans;
      el.innerHTML = `<div class="stack">
        ${ui.say('liza', 'Вот мой запрос — ну почти. Повторите его, пожалуйста, у себя: может, я что-то не так посчитала?')}
        <div class="m4sq-item"><h5><span class="m4sq-n">Шаг 1</span>Кто не приходил два раза и больше</h5><div data-b4a></div></div>
        <details class="more"><summary>История записей клиентов 9, 28 и 66 — готовый запрос</summary><div><div data-b4h></div></div></details>
        <div class="m4sq-item"><h5><span class="m4sq-n">Шаг 2</span>Вывод</h5><div data-b4q></div></div>
        <div class="m4sq-item"><h5><span class="m4sq-n">Шаг 3</span>Запрос-сторож: должен вернуть ноль строк</h5><p class="small muted">Найдите будущие онлайн-записи клиентов, которым нужна предоплата, но запись уже подтверждена без неё.</p><div data-b4w></div></div>
        <div class="m4sq-item"><h5><span class="m4sq-n">Шаг 4</span>Ответ Лизе</h5><div data-b4j></div><div class="m4sq-feat" data-b4f></div></div>
      </div>`;
      sqlCon(TR.$('[data-b4a]', el), { value: ctx.readonly ? BR4_A : a.a || '', readonly: ctx.readonly, rows: 5, tables: ['booking'], placeholder: "SELECT client_id, COUNT(*)\nFROM booking\nWHERE …", label: 'Шаг 1: клиенты с неявками', onChange: v => { a.a = v; ctx.save(); } });
      sqlCon(TR.$('[data-b4h]', el), { value: BR4_HIST, readonly: true, schema: false });
      ui.quiz(TR.$('[data-b4q]', el), Object.assign({}, BR4_Q, { value: ctx.readonly ? [1] : a.qv || [], readonly: ctx.readonly, reveal: ctx.result || ctx.readonly ? 'mine' : null, seed: 'm4sq-br4', onChange: v => { a.qv = v; ctx.save(); } }));
      sqlCon(TR.$('[data-b4w]', el), { value: ctx.readonly ? BR4_W : a.w || '', readonly: ctx.readonly, rows: 7, tables: ['booking', 'client'], placeholder: "SELECT b.id, …\nFROM booking b\nJOIN client c ON c.id = b.client_id\nWHERE …", label: 'Шаг 3: запрос-сторож', onChange: v => { a.w = v; ctx.save(); } });
      const ft = TR.$('[data-b4f]', el);
      const drawFeat = txt => { const s = TR.norm(txt || ''); ft.innerHTML = '<span class="small dim">Признаки:</span>' + BR4_FEAT.map(f => { const on = f.test(s); return `<span class="chip ${on ? 'ok' : ''}">${on ? '✓' : '○'} ${esc(f.t)}</span>`; }).join(''); };
      ui.justify(TR.$('[data-b4j]', el), {
        id: 'm4sq-br4', q: 'Что ответить Лизе: баг это или нет, и как проверять BR-4 дальше?',
        qPlain: 'Тестировщица посчитала неявки клиентов за период и решила, что правило BR-4 нарушено: у трёх клиентов по 2–3 неявки, а будущие записи подтверждены без предоплаты. Правило: после 2 неявок подряд онлайн-запись только с предоплатой 500 ₽; неявка — не приехал в течение 15 минут; счётчик no_show_count сбрасывается при визите. Объясните ей, нарушено ли правило, чем «за период» отличается от «подряд», какой запрос-сторож и какие тест-кейсы предложить и какие вопросы задать бизнесу.',
        rubric: BR4_RUBRIC, reference: BR4_REF, value: ctx.readonly ? { text: BR4_REF, self: BR4_RUBRIC.map(() => true) } : a.j, readonly: ctx.readonly, minLen: 300,
        placeholder: 'Лиза, по данным BR-4 сейчас …',
        onChange: v => { a.j = v; ctx.save(); drawFeat(v.text); ctx.decide('Ответ Лизе про BR-4', v.text || ''); }
      });
      drawFeat(ctx.readonly ? BR4_REF : (a.j && a.j.text) || '');
    },
    check: ans => br4Eval(ans),
    explain: `<p>Лиза посчитала честно — но ответила на другой вопрос. «Две неявки за период» — это COUNT с HAVING; «две неявки подряд» — это последовательность, которую система хранит в счётчике no_show_count и сбрасывает при визите. По истории видно: клиент 28 не приехал дважды подряд, но потом пришёл, клиент 9 чередовал неявки и визиты, клиент 66 после двух неявок приехал, потом отменял и снова не приехал — счётчик 1. Нарушений нет, а запрос-сторож это подтверждает нулём строк.</p>
      <p>Что важно для работы: <b>сначала точное прочтение требования, потом запрос</b>; запрос-инвариант «должен вернуть 0» — дешёвая автоматическая проверка, которую можно запускать после каждого релиза; а данные почти всегда подсвечивают <b>дыры в самом правиле</b>: сбрасывает ли счётчик отмена? касается ли правило корпоративных клиентов, которые платят по счёту (клиент 66 — «ТрансЛогистик»)? Эти вопросы — к бизнесу, а ответы — в BR-4 новой версией. Источники: Вигерс, гл. 17; ISTQB Foundation — граничные значения; DAMA-DMBOK, гл. 13.</p>`,
    refNote: 'В шаге 1 засчитывается любой запрос, который находит клиентов 9, 28 и 66 (можно с ФИО). Сторож — любой запрос по booking и client с признаками правила, который возвращает ноль строк. Ответ Лизе — от 60 % по рубрике.',
    report: ans => `- Шаг 1: ${((ans && ans.a) || '—').replace(/\s+/g, ' ')}\n- Вывод: ${ans && ans.qv && ans.qv.length ? BR4_Q.options[ans.qv[0]].t : '—'}\n- Сторож: ${((ans && ans.w) || '—').replace(/\s+/g, ' ')}\n- Ответ Лизе: ${(ans && ans.j && ans.j.text) || '—'}`
  };

  // =====================================================================
  TR.stage({
    id: ID,
    when: 'среда, 10 февраля, 12:00 · Тимур Рашидович просит цифры',
    intro: [
      { who: 'timur', html: 'В пятницу я в банке — беру кредит на две новые станции. Мне нужны цифры: неявки по станциям, средний чек, сколько доп. работ клиенты соглашаются делать и как быстро отвечают. Excel Марины Олеговны я уже видел — там каша.' },
      { who: 'gleb', html: 'С января АРМ мастера работает на станциях в тестовой эксплуатации: записи из колл-центра, сайта и бета-версии приложения, заказ-наряды, предложения доп. работ. Дал вам доступ на чтение к копии базы — снимок на сегодня, 12:00. Только без DELETE, пожалуйста.' },
      { who: 'vera', html: 'SQL — не только для разработчиков. Аналитик, который сам пишет SELECT, отвечает на вопрос за пять минут, а не ждёт выгрузку неделю. Сегодня — четыре цифры для Тимура, чужие ошибки в запросах и самое важное: можно ли этим данным верить.' }
    ],
    facts: ['F-noshow', 'F-noshow-rule', 'F-extra-timeout', 'F-pay', 'F-excel', 'F-slot'],
    glossary: [
      { term: 'SQL', simple: 'Язык вопросов к базе данных: описываете, что нужно, — база сама находит.', tech: 'Structured Query Language, стандарт ISO/IEC 9075. Чтение — SELECT; изменение — INSERT, UPDATE, DELETE; структура — CREATE, ALTER.' },
      { term: 'SELECT … FROM … WHERE', simple: 'Какие столбцы, из какой таблицы, какие строки.', tech: 'Базовая форма запроса; WHERE фильтрует строки условием, истинным для строки (NULL — не истина).' },
      { term: 'Агрегатная функция', simple: 'Сворачивает много строк в одно число: сколько, сумма, среднее.', tech: 'COUNT, SUM, AVG, MIN, MAX. Пропускают NULL; COUNT(*) считает все строки.' },
      { term: 'GROUP BY и HAVING', simple: 'Посчитать отдельно по каждой группе и отфильтровать группы.', tech: 'GROUP BY формирует группы, HAVING фильтрует их после группировки и может использовать агрегаты; WHERE — до группировки.' },
      { term: 'INNER JOIN', simple: 'Соединить таблицы и оставить только пары, которые нашлись.', tech: 'Внутреннее соединение по условию ON. Строки без пары в результат не попадают.' },
      { term: 'LEFT JOIN', simple: 'Все строки левой таблицы, а где пары нет — пусто.', tech: 'Левое внешнее соединение: строки без пары дополняются NULL. С WHERE правая.id IS NULL — поиск «сирот» (анти-соединение).' },
      { term: 'NULL', simple: '«Значение неизвестно» — не ноль и не пустая строка.', tech: 'Отметка отсутствующего значения; сравнения с NULL дают UNKNOWN (трёхзначная логика). Проверка — IS NULL / IS NOT NULL; замена — COALESCE.' },
      { term: 'Порядок выполнения запроса', simple: 'SELECT пишем первым, а выполняется он почти последним.', tech: 'FROM/JOIN → WHERE → GROUP BY → HAVING → SELECT → DISTINCT → ORDER BY → LIMIT.' },
      { term: 'Размножение строк (fan-out)', simple: 'После JOIN «один ко многим» строка повторилась — и сумма выросла.', tech: 'Соединение со стороной «многие» дублирует строки стороны «один»; агрегировать поле «одной» стороны нужно до соединения.' },
      { term: 'Запрос-сторож', simple: 'Запрос, который ищет нарушения правила и должен вернуть ноль строк.', tech: 'Инвариант данных для регресса и мониторинга качества: «0 строк — правило соблюдается».' },
      { term: 'Качество данных', simple: 'Можно ли верить данным: нет ли дублей, дыр и невозможных значений.', tech: 'Измерения по DAMA-DMBOK: полнота, уникальность, согласованность, достоверность, своевременность.' },
      { term: 'julianday()', simple: 'Функция SQLite: дата как число дней — удобно считать, сколько прошло.', tech: '(julianday(b) - julianday(a)) * 24 * 60 — минуты между событиями. В PostgreSQL — разность timestamp даёт interval.' }
    ],
    outro: 'Четыре цифры для банка посчитаны, четыре проблемы в данных найдены и переданы владельцам, BR-4 проверено запросом-сторожем, а в правиле нашлись два открытых вопроса для бизнеса. Вы умеете писать SELECT с фильтрами, группировкой и соединениями, читать чужой SQL и находить в нём ошибки, считать даты в SQLite и — главное — проверять данные, прежде чем им верить. В пятницу вечером — последняя тренировка: выжимка всех четырёх модулей перед собеседованием.',
    tasks: [howSelect, howGroup, howJoin, numbersTask, predictTask, bugsTask, labTask, br4Task]
  });
})();
