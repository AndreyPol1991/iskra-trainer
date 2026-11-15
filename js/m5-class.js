/* Модуль 5, занятие 4: UML Class — диаграмма классов (доменная модель).
   Теория: how-cl-parts — класс из трёх отделений на «Заказ-наряде»: имя, атрибуты с типами и видимостью, операции;
   класс и объект («нажмите на часть»), бытовой пример — чертёж и дома; how-cl-rels — ассоциация, агрегация, композиция,
   наследование, зависимость, кратности и что будет с частями при удалении целого (на модели «Искры», сверенной с базой);
   how-cl-vs — диаграмма классов и ERD, как модель ложится в таблицы (композиция, наследование одной таблицей с kind,
   «многие ко многим» через booking_service), код Mermaid и PlantUML.
   Практика: кратности восьми связей по базе «Искры»; лаборатория «какая связь» с последствиями (152-ФЗ, хранение истории,
   отчёты); ошибки в модели Ники; модель кабинета компании кодом Mermaid с живой схемой и проверкой по признакам;
   ответ Артёму, зачем модель понятий до таблиц. */
'use strict';
(function () {
  const TR = window.TR, ui = TR.ui, esc = TR.esc;
  const ID = 'm5-class';
  const pct = x => Math.round((x || 0) * 100) + ' %';

  if (!document.getElementById('m5c-css')) document.head.insertAdjacentHTML('beforeend', `<style id="m5c-css">
    .m5c-root { display: grid; gap: 14px; min-width: 0; }
    .m5c-root p { margin: 0; }
    .m5c-board { overflow-x: auto; border: 1px solid var(--border); border-radius: 12px; background: var(--surface-2); padding: 8px; }
    .m5c-board svg { display: block; margin: 0 auto; }
    .m5c-board [data-k] { cursor: pointer; }
    .m5c-chips { display: flex; flex-wrap: wrap; gap: 6px; }
    .m5c-chips .chip[aria-pressed="true"] { background: var(--accent); color: var(--accent-text); border-color: var(--accent); }
    .m5c-info { border: 1px solid var(--border); border-left: 4px solid var(--accent); border-radius: 10px; background: var(--surface); padding: 10px 14px; display: grid; gap: 6px; font-size: 14px; }
    .m5c-two { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 14px; align-items: start; }
    .m5c-del { border-radius: 10px; padding: 10px 12px; font-size: 14px; background: var(--warn-soft); border-left: 3px solid var(--warn); }
    .m5c-tbl { width: 100%; border-collapse: collapse; font-size: 13.5px; }
    .m5c-tbl th, .m5c-tbl td { border-bottom: 1px solid var(--border); padding: 7px 8px; text-align: left; vertical-align: top; }
    .m5c-tbl th { color: var(--text-muted); font-size: 12.5px; }
    .m5c-scroll { overflow-x: auto; }
    .m5c-items { display: grid; gap: 6px; }
    .m5c-item { display: grid; grid-template-columns: 30px minmax(0, 1fr); gap: 8px; text-align: left; font: inherit; font-size: 14px; color: var(--text); background: var(--surface); border: 1px solid var(--border); border-radius: 9px; padding: 8px 10px; cursor: pointer; }
    .m5c-item .n { font: 700 12px var(--f-mono); color: var(--accent); }
    .m5c-item[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); }
    .m5c-item.ok { border-color: var(--ok); background: var(--ok-soft); }
    .m5c-item.bad { border-color: var(--bad); background: var(--bad-soft); }
    .m5c-item.miss { border-color: var(--warn); background: var(--warn-soft); }
    .m5c-item[disabled] { cursor: default; }
    .m5c-pair { display: grid; grid-template-columns: minmax(0, 1fr) minmax(170px, 230px); gap: 10px; align-items: center; border: 1px solid var(--border); border-radius: 12px; background: var(--surface); padding: 10px 12px; }
    .m5c-pair select { width: 100%; }
    .m5c-pair .res { grid-column: 1 / -1; font-size: 13.5px; border-radius: 8px; padding: 6px 10px; }
    .m5c-pair .res.ok { background: var(--ok-soft); border-left: 3px solid var(--ok); }
    .m5c-pair .res.bad { background: var(--bad-soft); border-left: 3px solid var(--bad); }
    .m5c-ed textarea { width: 100%; min-height: 320px; box-sizing: border-box; font: 12.5px/1.55 var(--f-mono); font-variant-ligatures: none; font-feature-settings: "liga" 0, "calt" 0; background: var(--code-bg); color: var(--text); border: 1px solid var(--border); border-radius: 10px; padding: 10px; resize: vertical; }
    .m5c-feats { display: grid; gap: 4px; font-size: 13.5px; }
    .m5c-feat { display: grid; grid-template-columns: 22px minmax(0, 1fr); gap: 6px; }
    .m5c-feat .mk { font-weight: 700; color: var(--text-muted); } .m5c-feat.on .mk { color: var(--ok); }
    .m5c-pm { font-size: 12.5px; padding: 4px 8px; border-radius: 8px; background: var(--bad-soft); color: var(--bad); }
    .m5c-pm.warn { background: var(--warn-soft); color: var(--warn); }
    .m5c-root pre.code, .m5c-root code { font-variant-ligatures: none; font-feature-settings: "liga" 0, "calt" 0; }
    @media (max-width: 820px) { .m5c-two { grid-template-columns: minmax(0, 1fr); } .m5c-pair { grid-template-columns: minmax(0, 1fr); } }
  </style>`);

  /* =====================================================================
     Модель и рисование диаграммы классов
     model: { classes:[{id,name,attrs:[],ops:[],abs,x,y}], rels:[{a,b,kind,ma,mb,t}] }
     kind: assoc (a—b), nav (a→b), comp/aggr (ромб у a — целого), inh (a наследует b, треугольник у b), dep (a ⇢ b)
     ===================================================================== */
  function boxSize(c) {
    const L = Math.max(c.name.length * 7.8 + 20, ...c.attrs.map(t => t.length * 6.9 + 20), ...c.ops.map(t => t.length * 6.9 + 20), 130);
    const w = Math.min(250, L), h1 = c.abs ? 38 : 26, h2 = Math.max(1, c.attrs.length) * 15 + 8, h3 = c.ops.length ? c.ops.length * 15 + 8 : 0;
    return { w, h: h1 + h2 + h3, h1, h2, h3 };
  }
  function clip(c, tx, ty) {
    const dx = tx - c.cx, dy = ty - c.cy; if (!dx && !dy) return { x: c.cx, y: c.cy };
    const sx = (c.w / 2) / Math.abs(dx || 1e-9), sy = (c.h / 2) / Math.abs(dy || 1e-9), s = Math.min(sx, sy);
    return { x: c.cx + dx * s, y: c.cy + dy * s };
  }
  function autoPos(m) {
    // порядок обхода по связям, сетка по три в ряд
    const ids = m.classes.map(c => c.id), adj = {}; ids.forEach(i => { adj[i] = []; });
    m.rels.forEach(r => { if (adj[r.a] && adj[r.b]) { adj[r.a].push(r.b); adj[r.b].push(r.a); } });
    const order = [], seen = new Set();
    ids.forEach(s => { if (seen.has(s)) return; const q = [s]; seen.add(s); while (q.length) { const v = q.shift(); order.push(v); adj[v].forEach(u => { if (!seen.has(u)) { seen.add(u); q.push(u); } }); } });
    const by = Object.fromEntries(m.classes.map(c => [c.id, c])), cols = order.length > 4 ? 3 : 2;
    const sizes = order.map(id => boxSize(by[id])), cw = Math.max(...sizes.map(s => s.w)) + 90;
    let rowY = 20;
    for (let r = 0; r * cols < order.length; r++) {
      const row = order.slice(r * cols, r * cols + cols), rh = Math.max(...row.map(id => boxSize(by[id]).h));
      row.forEach((id, k) => { by[id].x = 30 + k * cw + (r % 2 ? cw / 3 : 0); by[id].y = rowY; });
      rowY += rh + 80;
    }
  }
  function clSVG(m, opt) {
    opt = opt || {};
    if (!m.classes.length) return '<p class="small dim" style="padding:10px">Здесь появится схема.</p>';
    if (m.classes.some(c => c.x == null)) autoPos(m);
    const G = {}; m.classes.forEach(c => { const s = boxSize(c); G[c.id] = Object.assign({}, s, { cx: c.x + s.w / 2, cy: c.y + s.h / 2, c }); });
    const W = Math.max(...m.classes.map(c => c.x + G[c.id].w)) + 40, H = Math.max(...m.classes.map(c => c.y + G[c.id].h)) + 40;
    const mark = k => opt.marks && opt.marks[k];
    const col = (k, base) => { const v = mark(k); return v === 'ok' ? 'var(--ok)' : v === 'bad' ? 'var(--bad)' : v === 'miss' ? 'var(--warn)' : base; };
    const hl = h => opt.hl === h;
    const num = (k, x, y) => opt.nums && opt.nums[k] ? `<circle cx="${x}" cy="${y}" r="9" style="fill:var(--accent)"/><text x="${x}" y="${y + 3.5}" text-anchor="middle" style="fill:var(--accent-text);font-size:10px;font-weight:700">${opt.nums[k]}</text>` : '';
    let s = `<svg viewBox="0 0 ${W} ${H}" width="100%" style="min-width:${Math.min(W, 480)}px;max-width:${W}px" role="img" aria-label="${esc(opt.label || 'Диаграмма классов')}">`;
    // несколько связей между одной парой классов рисуем параллельно, а не одна поверх другой
    const pairCnt = {}, pairIdx = {};
    m.rels.forEach((r, i) => { const key = [r.a, r.b].sort().join('|'); pairIdx[i] = pairCnt[key] || 0; pairCnt[key] = (pairCnt[key] || 0) + 1; });
    m.rels.forEach((r, i) => {
      const A = G[r.a], B = G[r.b]; if (!A || !B) return;
      const k = 'r:' + i, base = (hl(r.kind) || (hl('mult') && (r.ma || r.mb))) ? 'var(--accent)' : 'var(--text-2)', c = col(k, base), sw = base !== 'var(--text-2)' || mark(k) ? 2.4 : 1.5;
      const cnt = pairCnt[[r.a, r.b].sort().join('|')], off = (pairIdx[i] - (cnt - 1) / 2) * 34;
      const q1 = clip(A, B.cx, B.cy), q2 = clip(B, A.cx, A.cy), a0 = Math.atan2(q2.y - q1.y, q2.x - q1.x), sgn = r.a < r.b ? 1 : -1, ox = -Math.sin(a0) * off * sgn, oy = Math.cos(a0) * off * sgn;
      const p1 = { x: q1.x + ox, y: q1.y + oy }, p2 = { x: q2.x + ox, y: q2.y + oy }, ang = Math.atan2(p2.y - p1.y, p2.x - p1.x), ux = Math.cos(ang), uy = Math.sin(ang), nx = -uy, ny = ux;
      const dash = r.kind === 'dep' ? 'stroke-dasharray:6 4;' : '';
      let x1 = p1.x, y1 = p1.y, x2 = p2.x, y2 = p2.y, deco = '';
      if (r.kind === 'comp' || r.kind === 'aggr') { const L = 18, Wd = 7; const tip = p1, back = { x: p1.x + ux * L, y: p1.y + uy * L }, mid = { x: p1.x + ux * L / 2, y: p1.y + uy * L / 2 }; deco += `<polygon points="${tip.x},${tip.y} ${mid.x + nx * Wd},${mid.y + ny * Wd} ${back.x},${back.y} ${mid.x - nx * Wd},${mid.y - ny * Wd}" style="fill:${r.kind === 'comp' ? c : 'var(--surface)'};stroke:${c};stroke-width:1.5"/>`; x1 = back.x; y1 = back.y; }
      if (r.kind === 'inh') { const L = 16, Wd = 9, tip = p2, base2 = { x: p2.x - ux * L, y: p2.y - uy * L }; deco += `<polygon points="${tip.x},${tip.y} ${base2.x + nx * Wd},${base2.y + ny * Wd} ${base2.x - nx * Wd},${base2.y - ny * Wd}" style="fill:var(--surface);stroke:${c};stroke-width:1.5"/>`; x2 = base2.x; y2 = base2.y; }
      if (r.kind === 'nav' || r.kind === 'dep') { const L = 12, Wd = 6, tip = p2, b2 = { x: p2.x - ux * L, y: p2.y - uy * L }; deco += `<path d="M${b2.x + nx * Wd} ${b2.y + ny * Wd} L${tip.x} ${tip.y} L${b2.x - nx * Wd} ${b2.y - ny * Wd}" style="fill:none;stroke:${c};stroke-width:1.5"/>`; }
      s += `<g data-k="${k}" data-kind="${r.kind}"><line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" style="stroke:transparent;stroke-width:14"/><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="stroke:${c};stroke-width:${sw};${dash}"/>${deco}`;
      const lab = (t, p, sgn) => { if (!t) return ''; const ox = p.x + ux * sgn * 24 + nx * 11, oy = p.y + uy * sgn * 24 + ny * 11 + 4; return `<text x="${ox}" y="${oy}" text-anchor="middle" style="fill:${hl('mult') ? 'var(--accent)' : 'var(--text)'};font-size:11.5px;font-weight:700;font-family:var(--f-mono);paint-order:stroke;stroke:var(--surface-2);stroke-width:4px">${esc(t)}</text>`; };
      s += lab(r.ma, p1, 1) + lab(r.mb, p2, -1);
      if (r.t) { const mx = (p1.x + p2.x) / 2 - nx * 12, my = (p1.y + p2.y) / 2 - ny * 12 + 4; s += `<text x="${mx}" y="${my}" text-anchor="middle" style="fill:var(--text-2);font-size:10.5px;font-style:italic;paint-order:stroke;stroke:var(--surface-2);stroke-width:4px">${esc(r.t)}</text>`; }
      s += num(k, (p1.x + p2.x) / 2 + nx * 14, (p1.y + p2.y) / 2 + ny * 14) + '</g>';
    });
    m.classes.forEach(cl => {
      const g = G[cl.id], x = cl.x, y = cl.y, k = 'c:' + cl.id, st = col(k, hl('name') ? 'var(--accent)' : 'var(--border-strong)'), sw = mark(k) || hl('name') ? 2.4 : 1.5;
      s += `<g data-k="${k}" data-kind="class"><rect x="${x}" y="${y}" width="${g.w}" height="${g.h}" rx="3" style="fill:var(--surface);stroke:${st};stroke-width:${sw}"/>`;
      s += `<rect x="${x}" y="${y}" width="${g.w}" height="${g.h1}" rx="3" style="fill:${hl('name') ? 'var(--accent-soft)' : 'var(--surface-3)'};stroke:${st};stroke-width:${sw}"/>`;
      if (cl.abs) s += `<text x="${x + g.w / 2}" y="${y + 13}" text-anchor="middle" style="fill:var(--text-muted);font-size:10px">«abstract»</text>`;
      s += `<text x="${x + g.w / 2}" y="${y + g.h1 - 9}" text-anchor="middle" style="fill:var(--text);font-size:13px;font-weight:700;${cl.abs ? 'font-style:italic;' : ''}" data-part="name">${esc(cl.name)}</text>`;
      const sec = (arr, y0, part) => arr.map((t, i) => {
        const m2 = t.match(/^([+\-#~])?\s*(.*?)(\s*:\s*(.+))?$/) || [], vis = m2[1] || '', nm = m2[2] || t, ty = m2[4] || '';
        const vx = x + 8, ny2 = y0 + 15 + i * 15;
        return `<text x="${vx}" y="${ny2}" style="font-size:11.5px;font-family:var(--f-mono)" data-part="${part}"><tspan style="fill:${hl('vis') ? 'var(--accent)' : 'var(--text-muted)'};font-weight:${hl('vis') ? 700 : 400}">${esc(vis)}</tspan><tspan style="fill:${hl(part) ? 'var(--accent)' : 'var(--text)'};font-weight:${hl(part) ? 700 : 400}">${esc(nm)}</tspan>${ty ? `<tspan style="fill:${hl('type') ? 'var(--accent)' : 'var(--text-2)'};font-weight:${hl('type') ? 700 : 400}">: ${esc(ty)}</tspan>` : ''}</text>`;
      }).join('');
      s += `<line x1="${x}" y1="${y + g.h1}" x2="${x + g.w}" y2="${y + g.h1}" style="stroke:${st}"/>` + sec(cl.attrs, y + g.h1, 'attr');
      if (cl.ops.length) s += `<line x1="${x}" y1="${y + g.h1 + g.h2}" x2="${x + g.w}" y2="${y + g.h1 + g.h2}" style="stroke:${st}"/>` + sec(cl.ops, y + g.h1 + g.h2, 'op');
      s += num(k, x + g.w - 2, y + 2) + '</g>';
    });
    return s + '</svg>';
  }

  /* ---------- модель «Искры» (сверена с таблицами базы) ---------- */
  const C = (id, name, attrs, ops, x, y, abs) => ({ id, name, attrs, ops: ops || [], x, y, abs: !!abs });
  const WO_ONE = { classes: [C('wo', 'ЗаказНаряд', ['-номер: String', '-статус: СтатусЗН', '-итого: Деньги'], ['+пересчитатьИтого(): Деньги', '+отправитьПредложение()', '+закрыть()'], 30, 20)], rels: [] };
  const MODEL = {
    classes: [
      C('company', 'Компания', ['название: String', 'ИНН: String', 'лимитАвтосогласования: Деньги'], [], 20, 20),
      C('client', 'Клиент', ['ФИО: String', 'телефон: String', 'неявокПодряд: int'], [], 390, 20),
      C('car', 'Машина', ['госномер: String', 'VIN: String', 'марка: String'], [], 730, 20),
      C('wo', 'ЗаказНаряд', ['номер: String', 'статус: СтатусЗН'], ['пересчитатьИтого(): Деньги'], 730, 230),
      C('line', 'СтрокаЗаказНаряда', ['количество: Decimal', 'цена: Деньги'], [], 390, 230, true),
      C('offer', 'ПредложениеДопРабот', ['сумма: Деньги', 'статус: СтатусПредл'], [], 730, 440),
      C('srv', 'СтрокаРаботы', [], [], 270, 460),
      C('prt', 'СтрокаЗапчасти', [], [], 490, 460)
    ],
    rels: [
      { a: 'company', b: 'client', kind: 'assoc', ma: '0..1', mb: '0..*', t: 'работает от имени' },
      { a: 'client', b: 'car', kind: 'assoc', ma: '1', mb: '0..*', t: 'владеет' },
      { a: 'car', b: 'wo', kind: 'assoc', ma: '1', mb: '0..*' },
      { a: 'wo', b: 'line', kind: 'comp', ma: '1', mb: '0..*' },
      { a: 'wo', b: 'offer', kind: 'comp', ma: '1', mb: '0..*' },
      { a: 'srv', b: 'line', kind: 'inh' },
      { a: 'prt', b: 'line', kind: 'inh' }
    ]
  };

  /* =====================================================================
     ТЕОРИЯ
     ===================================================================== */
  const PARTS = [
    { k: 'name', t: 'Имя класса', html: '<b>Верхнее отделение</b> — имя понятия: существительное в единственном числе, как в глоссарии: «ЗаказНаряд», а не «Заказ-наряды» и не «Оформить заказ». Класс — это <b>понятие</b>, а не действие.' },
    { k: 'attr', t: 'Атрибуты', html: '<b>Второе отделение</b> — что мы знаем о понятии: номер, статус, итого. В доменной модели аналитика это главное отделение.' },
    { k: 'type', t: 'Типы', html: '<b>После двоеточия</b> — тип значения: String, Деньги, СтатусЗН. Аналитик может писать типы понятиями предметной области («Деньги», а не DECIMAL(10,2)) — точный тип выберут при проектировании базы.' },
    { k: 'vis', t: 'Видимость', html: '<b>Знак перед именем</b>: <code>+</code> открыто всем, <code>-</code> только самому классу, <code>#</code> наследникам. Это язык разработчиков; в доменной модели аналитика видимость часто не пишут вовсе.' },
    { k: 'op', t: 'Операции', html: '<b>Третье отделение</b> — что понятие умеет: «пересчитатьИтого()», «закрыть()». Аналитик пишет операции, когда они связаны с правилами: итого считается по согласованным строкам.' },
    { k: 'obj', t: 'Класс и объект', html: '<b>Класс</b> — описание всех заказ-нарядов сразу, как бланк. <b>Объект</b> — конкретный заказ-наряд ЗН-1-0457 Елены. На диаграмме объектов его пишут с подчёркиванием: <code>зн0457 : ЗаказНаряд</code>.' }
  ];
  const howParts = {
    id: 'how-cl-parts', covers: ['mult'], title: 'Как это работает: класс, атрибуты и операции', free: true, noReset: true,
    simple: { icon: '🧱', title: 'Простыми словами', plain: 'Диаграмма классов показывает понятия предметной области — клиент, машина, заказ-наряд, — что мы о них знаем и как они связаны. Это словарь проекта в картинке.', analogy: 'Класс — как чертёж дома, объект — построенный по нему дом. По одному чертежу «Заказ-наряд» каждый день создаются десятки конкретных заказ-нарядов.', tech: 'UML 2.5.1, раздел 11 «Classification». Для аналитика — доменная модель: понятия, атрибуты и связи без деталей реализации (Эванс, «Предметно-ориентированное проектирование»; Ларман, «Применение UML и шаблонов проектирования»).' },
    render(el) {
      el.classList.add('m5c-root');
      let cur = 'attr';
      function draw() {
        const p = PARTS.find(x => x.k === cur);
        el.innerHTML = `<div class="m5c-root"><p>Класс «Заказ-наряд» — тот же, что таблица <code>work_order</code> в модуле 4. Нажмите на часть класса или на название.</p>
          <div class="m5c-chips" role="group" aria-label="Части класса">${PARTS.map(x => `<button type="button" class="chip" data-pt="${x.k}" aria-pressed="${x.k === cur}">${esc(x.t)}</button>`).join('')}</div>
          <div class="m5c-two"><div class="m5c-board">${clSVG(WO_ONE, { hl: cur === 'obj' ? 'name' : cur, label: 'Класс ЗаказНаряд' })}</div>
            <div class="stack"><div class="m5c-info" aria-live="polite"><b>${esc(p.t)}</b><div>${p.html}</div></div>
            ${ui.note('warn', 'Частые ошибки', 'Класс назван глаголом («ОплатитьЗаказ» — это операция, а не понятие); в классе поля внешних ключей вроде <code>client_id</code> — это детали таблицы, связь показывают линией; один класс на всё («Данные»); синонимы — «Клиент» и «Покупатель» как два класса.')}
            ${ui.note('', 'Как спросят на собеседовании', '«Чем диаграмма классов отличается от ERD?» — Классы описывают понятия и их поведение: есть операции, наследование, композиция. ERD описывает хранение: таблицы, ключи, связи в базе. Одна доменная модель может лечь в таблицы по-разному.')}</div></div></div>`;
      }
      TR.on(el, 'click', '[data-pt]', (e, b) => { cur = b.dataset.pt; draw(); });
      TR.on(el, 'click', '[data-part]', (e, t) => { cur = t.dataset.part; draw(); });
      draw();
    }
  };

  const RELS = [
    { k: 'assoc', t: 'Ассоциация', html: '<b>Линия</b> — понятия связаны: клиент <i>владеет</i> машиной. Подпись — глагол, на концах — кратности. Стрелка на конце (направленная ассоциация) показывает, кто о ком знает.', del: 'Удалили клиента (например, по запросу на удаление персональных данных) — машина и история её ремонтов остаются, связь просто разрывается или обезличивается.' },
    { k: 'mult', t: 'Кратность', html: '<b>Числа на концах линии</b>: сколько объектов на <b>этом</b> конце приходится на один объект на другом. «Клиент 1 — 0..* Машина»: у машины ровно один владелец, у клиента — сколько угодно машин, в том числе ни одной. Варианты: <code>1</code>, <code>0..1</code>, <code>0..*</code>, <code>1..*</code>.', del: 'Кратность — это бизнес-правило: «у машины один владелец» потом станет NOT NULL и внешним ключом в таблице car.' },
    { k: 'comp', t: 'Композиция ◆', html: '<b>Закрашенный ромб у целого</b> — часть не живёт без целого: строка заказ-наряда и предложение доп. работ существуют только внутри своего заказ-наряда.', del: 'Удалили черновик заказ-наряда — его строки и предложения удаляются вместе с ним. Иначе в базе остаются «сироты», и отчёт по выручке врёт.' },
    { k: 'aggr', t: 'Агрегация ◇', html: '<b>Пустой ромб у целого</b> — «целое и части», но части живут сами по себе: бригада механиков смены. В UML 2.5 у агрегации нет строгого смысла, многие команды вместо неё рисуют обычную ассоциацию.', del: 'Распустили смену — механики остаются работать на станции.' },
    { k: 'inh', t: 'Наследование △', html: '<b>Пустой треугольник у родителя</b> — «является»: строка работы — это строка заказ-наряда, строка запчасти — тоже. Общие атрибуты (количество, цена) — у родителя, особые — у наследников. Родитель «abstract»: просто «строки» не бывает.', del: 'В базе «Искры» наследование легло одной таблицей work_item с полем kind (работа или запчасть).' },
    { k: 'dep', t: 'Зависимость ⇢', html: '<b>Пунктир со стрелкой</b> — один класс временно использует другой: заказ-наряд при пересчёте итого обращается к прайсу услуг. Постоянной связи нет.', del: 'Поменяли прайс — у старых строк цена не меняется: в work_item хранится копия цены на момент добавления.' }
  ];
  const howRels = {
    id: 'how-cl-rels', covers: ['rel'], title: 'Как это работает: связи и кратности', free: true, noReset: true,
    simple: { icon: '🔗', title: 'Простыми словами', plain: 'Связи отвечают на вопросы «кто с кем связан, сколько их и что будет с частями, если удалить целое». Именно здесь прячутся бизнес-правила.', analogy: 'Дом и комнаты — композиция: снесли дом, комнат нет. Дом и жильцы — ассоциация: снесли дом, люди переехали. Квартира и жильё — наследование: квартира является жильём.', tech: 'UML 2.5.1: Association (11.5), Generalization (9.9), Dependency (7.7.3); AggregationKind: none, shared, composite. Кратность — Multiplicity (7.5): нижняя..верхняя граница.' },
    render(el) {
      el.classList.add('m5c-root');
      let cur = 'comp';
      function draw() {
        const r = RELS.find(x => x.k === cur);
        el.innerHTML = `<div class="m5c-root"><p>Модель «Искры», сверенная с базой: компания, клиент, машина, заказ-наряд, строки и предложения. Нажмите на вид связи или на линию.</p>
          <div class="m5c-chips" role="group" aria-label="Виды связей">${RELS.map(x => `<button type="button" class="chip" data-rl="${x.k}" aria-pressed="${x.k === cur}">${esc(x.t)}</button>`).join('')}</div>
          <div class="m5c-board">${clSVG(MODEL, { hl: cur, label: 'Модель «Искры»' })}</div>
          <div class="m5c-two"><div class="m5c-info" aria-live="polite"><b>${esc(r.t)}</b><div>${r.html}</div></div><div class="m5c-del"><b>Что будет на деле:</b> ${r.del}</div></div>
          ${ui.note('', 'Как спросят на собеседовании', '«Чем композиция отличается от агрегации?» — При композиции часть не существует без целого и удаляется вместе с ним (строки заказ-наряда). При агрегации часть живёт отдельно (механики смены). Если сомневаетесь — рисуйте ассоциацию и пишите правило словами.')}</div>`;
      }
      TR.on(el, 'click', '[data-rl]', (e, b) => { cur = b.dataset.rl; draw(); });
      TR.on(el, 'click', '[data-kind]', (e, g) => { const k = g.dataset.kind; if (k !== 'class' && RELS.some(x => x.k === k)) { cur = k; draw(); } });
      draw();
    }
  };

  const MODEL_MM = `classDiagram
  class Company["Компания"]
  class Client["Клиент"]
  class Car["Машина"]
  class WorkOrder["Заказ-наряд"]
  class Line["Строка заказ-наряда"]
  class ServiceLine["Строка работы"]
  class PartLine["Строка запчасти"]
  Company : +String inn
  Company : +Money autoApproveLimit
  Client : +String phone
  Car : +String plate
  WorkOrder : +String number
  WorkOrder : +recalcTotal() Money
  Company "0..1" -- "0..*" Client : работает от имени
  Client "1" -- "0..*" Car : владеет
  Car "1" -- "0..*" WorkOrder
  WorkOrder "1" *-- "0..*" Line
  Line <|-- ServiceLine
  Line <|-- PartLine`;
  const MODEL_PU = `@startuml
class "Компания" as Company {
  ИНН : String
  лимитАвтосогласования : Деньги
}
class "Клиент" as Client {
  телефон : String
}
class "Машина" as Car {
  госномер : String
}
class "ЗаказНаряд" as WorkOrder {
  номер : String
  пересчитатьИтого() : Деньги
}
abstract class "СтрокаЗаказНаряда" as Line
class "СтрокаРаботы" as ServiceLine
class "СтрокаЗапчасти" as PartLine
Company "0..1" -- "0..*" Client : работает от имени
Client "1" -- "0..*" Car : владеет
Car "1" -- "0..*" WorkOrder
WorkOrder "1" *-- "0..*" Line
Line <|-- ServiceLine
Line <|-- PartLine
@enduml`;
  const MAP = [
    ['Класс', 'Таблица', 'ЗаказНаряд → work_order'],
    ['Атрибут', 'Столбец', 'номер → work_order.number'],
    ['Ассоциация 1 — 0..*', 'Внешний ключ на стороне «много»', 'Машина → car.client_id'],
    ['Кратность 0..1', 'Столбец, который может быть пустым (NULL)', 'Клиент без компании → client.company_id = NULL'],
    ['Композиция', 'Внешний ключ NOT NULL и удаление вместе с целым', 'work_item.work_order_id'],
    ['Наследование', 'Одна таблица с полем вида — или по таблице на наследника', 'work_item.kind = service | part'],
    ['«Многие ко многим»', 'Промежуточная таблица', 'Запись ↔ Услуга → booking_service']
  ];
  const howVs = {
    id: 'how-cl-vs', covers: ['bugs', 'code'], title: 'Как это работает: от классов к таблицам — и код', free: true, noReset: true,
    simple: { icon: '🧭', title: 'Простыми словами', plain: 'Сначала договариваются о понятиях (классы), потом решают, как их хранить (таблицы). Модель понятий понятна бизнесу, таблицы — разработчикам.', analogy: 'Сначала составляют список блюд и что в них входит, потом решают, как разложить продукты по полкам холодильника.', tech: 'Доменная модель отделена от модели хранения: из одной диаграммы классов можно получить разные ERD (одна таблица на иерархию, по таблице на класс). Соответствия: класс → таблица, ассоциация → внешний ключ, «многие ко многим» → промежуточная таблица.' },
    render(el) {
      el.classList.add('m5c-root');
      let lang = 'mm';
      function draw() {
        el.innerHTML = `<div class="m5c-root"><div class="m5c-scroll"><table class="m5c-tbl"><thead><tr><th>На диаграмме классов</th><th>В базе данных</th><th>Пример «Искры»</th></tr></thead><tbody>${MAP.map(r => `<tr><td><b>${esc(r[0])}</b></td><td>${esc(r[1])}</td><td><code>${esc(r[2])}</code></td></tr>`).join('')}</tbody></table></div>
          ${ui.note('info', 'Чего нет на диаграмме классов', 'Первичных и внешних ключей (<code>id</code>, <code>client_id</code>) — связь уже показана линией. Промежуточных таблиц — «многие ко многим» рисуется одной линией с <code>0..*</code> на обоих концах. Типов СУБД — вместо VARCHAR(12) пишут String или понятие «Госномер».')}
          <div class="eyebrow">Модель кодом</div><div class="row">${ui.seg('m5c-lang', [{ v: 'mm', t: 'Mermaid' }, { v: 'pu', t: 'PlantUML' }], lang)}</div>
          ${ui.code(lang === 'mm' ? MODEL_MM : MODEL_PU, 'text')}
          <p class="small dim">${lang === 'mm' ? 'Mermaid: class Id["Русское имя"]; атрибут: Id : +Тип имя; связь: A "1" -- "0..*" B : подпись; композиция *--, агрегация o--, наследование <|-- (треугольник у родителя слева), зависимость ..>.' : 'PlantUML: class "Имя" as Id { атрибуты }; abstract class — абстрактный; связи те же: --, *--, o--, <|--, ..>; кратности в кавычках у концов.'}</p>
          ${ui.note('', 'Как спросят на собеседовании', '«Как наследование ложится в таблицы?» — Чаще всего одной таблицей с полем вида (у «Искры» work_item.kind) или отдельной таблицей на каждого наследника. Выбор зависит от того, сколько у наследников своих полей.')}</div>`;
      }
      TR.on(el, 'click', '[data-seg="m5c-lang"] button', (e, b) => { lang = b.dataset.v; draw(); });
      draw();
    }
  };

  /* =====================================================================
     ПРАКТИКА
     ===================================================================== */

  /* ---------- 1. Кратности ---------- */
  const MULT_CH = ['1 … 0..*', '1 … 1..*', '0..1 … 0..*', '0..1 … 0..1', '0..* … 1..*', '0..* … 0..1', '0..* … 1', '1 … 1'].map(v => ({ v, t: v }));
  const MULTS = [
    { id: 'm1', t: 'Клиент ___ Машина', a: '1 … 0..*', why: 'У машины ровно один владелец (car.client_id обязателен), у клиента — сколько угодно машин, в том числе ни одной.' },
    { id: 'm2', t: 'Компания ___ Клиент', a: '0..1 … 0..*', why: 'Клиент может быть частным (client.company_id пустой) — значит, 0..1 компании; у компании сколько угодно водителей-клиентов.' },
    { id: 'm3', t: 'Запись ___ ЗаказНаряд', a: '0..1 … 0..1', why: 'Заказ-наряд бывает без записи — клиент приехал сам (work_order.booking_id пустой); запись бывает без заказ-наряда — неявка. И не больше одного с каждой стороны.' },
    { id: 'm4', t: 'Запись ___ Услуга', a: '0..* … 1..*', why: 'В записи хотя бы одна услуга, а услуга встречается в любом числе записей — «многие ко многим» (в базе через booking_service).' },
    { id: 'm5', t: 'ЗаказНаряд ___ Платёж', a: '1 … 0..*', why: 'Платёж всегда относится к одному заказ-наряду; у заказ-наряда может не быть платежей (ещё не оплачен) или быть несколько попыток (карта не прошла, оплатили СБП).' },
    { id: 'm6', t: 'ЗаказНаряд ___ Механик', a: '0..* … 0..1', why: 'Механика назначают не сразу (work_order.mechanic_id может быть пустым), а у механика много заказ-нарядов.' },
    { id: 'm7', t: 'ЗаказНаряд ___ Мастер-приёмщик', a: '0..* … 1', why: 'Заказ-наряд всегда открывает мастер-приёмщик (master_id обязателен), а у мастера много заказ-нарядов.' },
    { id: 'm8', t: 'Станция ___ Пост', a: '1 … 1..*', why: 'Пост всегда на одной станции, а на станции хотя бы один пост с подъёмником.' }
  ];
  function multEval(v) { v = v || {}; const good = MULTS.filter(x => v[x.id] === x.a).length; return { good, score: good / MULTS.length }; }
  const taskMult = {
    id: 'mult', title: 'Расставьте кратности по базе «Искры»',
    simple: howParts.simple,
    lead: ui.brief({
      situation: 'Глеб: «Кратности — это то, что я превращу в NOT NULL и внешние ключи. Ошибёшься — либо база не пустит нормальные данные, либо пустит мусор». Вера: «Сверяйся с тем, как работает станция».',
      todo: ['Для каждой связи выберите кратности: слева — сколько объектов левого класса приходится на один правый, справа — наоборот. Запись «Клиент 1 … 0..* Машина» читается: у машины один клиент, у клиента 0..* машин.', 'Нажмите «Проверить». Засчитывается, если верно хотя бы 6 из 8.'],
      lookTitle: 'Подсказка', look: 'Спрашивайте с обеих сторон: «может ли машина быть без владельца?», «может ли заказ-наряд быть без записи?», «сколько их максимум?». Ответ «бывает, что нет» — значит, нижняя граница 0.'
    }),
    blank: () => ({ v: {} }),
    reference: () => ({ v: Object.fromEntries(MULTS.map(x => [x.id, x.a])) }),
    render(el, ctx) {
      el.classList.add('m5c-root');
      const a = ctx.ans; a.v = a.v || {};
      let rv = null;
      if (ctx.result) { rv = {}; MULTS.forEach(x => { if (a.v[x.id]) rv[x.id] = a.v[x.id] === x.a ? { s: 'ok', why: esc(x.why) } : { s: 'bad', why: `Нужно «${esc(x.a)}». ${esc(x.why)}` }; }); }
      el.innerHTML = '<div data-m></div>';
      ui.match(TR.$('[data-m]', el), { rows: MULTS.map(x => ({ id: x.id, t: esc(x.t) })), choices: MULT_CH, value: a.v, readonly: ctx.readonly, reveal: rv, placeholder: 'Кратности…', onChange: v => { a.v = v; ctx.save(); } });
    },
    check(ans) {
      const v = (ans && ans.v) || {}, r = multEval(v), notes = [];
      MULTS.forEach(x => { if (!v[x.id]) notes.push({ ok: false, html: `Не выбрано: ${esc(x.t)}.` }); else if (v[x.id] !== x.a) notes.push({ ok: false, html: `${esc(x.t.replace('___', x.a))}. ${esc(x.why)}` }); });
      if (r.good === MULTS.length) notes.push({ ok: true, html: 'Все восемь кратностей совпадают с тем, как работает «Искра».' });
      return { ok: r.good >= 6, score: r.score, notes, summary: `Верно ${r.good} из ${MULTS.length}.`, mentor: r.good >= 6 ? null : 'Задавайте два вопроса с каждой стороны: «бывает ли ноль?» и «бывает ли больше одного?». Самые коварные — запись и заказ-наряд: бывают друг без друга.' };
    },
    explain: `<p>Кратность — это бизнес-правило, записанное числами. «Клиент 1 … 0..* Машина» станет обязательным внешним ключом car.client_id. «Компания 0..1 … 0..* Клиент» — необязательным client.company_id. Пара «Запись 0..1 … 0..1 ЗаказНаряд» объясняет, почему work_order.booking_id может быть пустым и при этом уникальным. «Запись 0..* … 1..* Услуга» — «многие ко многим», которую в базе реализует таблица booking_service.</p>
      <p>Ошибка в кратности стоит дорого: «1» вместо «0..1» не даст открыть заказ-наряд клиенту, приехавшему без записи, а «0..*» вместо «1» оставит платежи без заказ-наряда. Источники: UML 2.5.1, раздел 7.5 (Multiplicities); Ларман, «Применение UML и шаблонов проектирования», глава о доменной модели.</p>`,
    refNote: 'Засчитывается от 6 верных из 8.',
    report: ans => { const v = (ans && ans.v) || {}; return MULTS.map(x => `- ${x.t.replace('___', v[x.id] || '—')}${v[x.id] === x.a ? ' ✓' : ''}`).join('\n'); }
  };

  /* ---------- 2. Лаборатория: какая связь ---------- */
  const RK = [{ v: 'assoc', t: 'Ассоциация' }, { v: 'aggr', t: 'Агрегация ◇' }, { v: 'comp', t: 'Композиция ◆' }, { v: 'inh', t: 'Наследование △' }];
  const PAIRS = [
    { id: 'p1', t: 'ЗаказНаряд и ПредложениеДопРабот', a: ['comp'], good: 'Предложение существует только внутри заказ-наряда: удалили черновик заказ-наряда — его предложения ушли вместе с ним.', bad: { assoc: 'Удалили черновик заказ-наряда — предложения доп. работ остались «висеть» без заказ-наряда, и отчёт по доп. работам для Тимура Рашидовича показывает несуществующие деньги.', aggr: 'Агрегация разрешает предложению жить отдельно — а предложение без заказ-наряда бессмысленно: непонятно, какой машине и на какую сумму.', inh: 'Предложение не является заказ-нарядом — у них разные атрибуты и жизнь. Наследование смешало бы их в одну иерархию.' } },
    { id: 'p2', t: 'Клиент и Машина', a: ['assoc'], good: 'Ассоциация: машину могут продать, клиент может удалить аккаунт — история ремонтов машины остаётся (её хранят 5 лет).', bad: { comp: 'Клиент попросил удалить персональные данные (152-ФЗ) — композиция удалила вместе с ним машины и всю историю ремонтов, которую станция обязана хранить.', aggr: 'Машина — не «часть» клиента. Агрегация ничего не добавляет и путает читателя: здесь обычная связь «владеет».', inh: 'Машина не является клиентом — наследование здесь бессмысленно.' } },
    { id: 'p3', t: 'СтрокаЗаказНаряда и СтрокаЗапчасти', a: ['inh'], good: 'Наследование: строка запчасти — это строка заказ-наряда с количеством и ценой, плюс ссылка на запчасть. В базе — одна таблица work_item с kind = part.', bad: { assoc: 'Две отдельные сущности со связью — и количество с ценой придётся дублировать в обеих. Итого заказ-наряда считали бы по двум местам и расходились.', comp: 'Строка запчасти — не часть строки, а её разновидность. Композиция означала бы «строка внутри строки».', aggr: 'Агрегация — про «целое и части», а здесь «является». Иерархия видов строк потерялась.' } },
    { id: 'p4', t: 'Станция и Пост', a: ['comp'], good: 'Композиция: пост с подъёмником существует только на своей станции; закрыли станцию — её посты убираются из расписания.', bad: { assoc: 'Пост может остаться без станции — в расписании онлайн-записи появляются посты-призраки, на которые клиенты записываются.', aggr: 'Агрегация разрешает посту жить без станции — но подъёмник не переезжает между станциями в системе. Правило «пост принадлежит станции» потеряно.', inh: 'Пост не является станцией.' } },
    { id: 'p5', t: 'Станция и Сотрудник', a: ['assoc', 'aggr'], good: 'Связь без владения: сотрудника переводят на другую станцию, а закрытие станции не удаляет людей и их историю заказ-нарядов. Ассоциацию и агрегацию засчитываем обе — в UML 2.5 у агрегации нет строгого смысла.', bad: { comp: 'Станцию на «Азино» закрыли на ремонт и удалили из системы — композиция удалила всех её сотрудников, а с ними — кто открывал и вёл тысячи заказ-нарядов.', inh: 'Сотрудник не является станцией.' } },
    { id: 'p6', t: 'Платёж и ОнлайнПлатёж (через ЮKassa)', a: ['inh'], good: 'Наследование: онлайн-платёж — это платёж с суммой и статусом, плюс id платежа в ЮKassa. В базе — одна таблица payment с полем method.', bad: { assoc: 'Два класса со связью — сумма и статус дублируются, и сверка с ЮKassa показывает расхождения между «платежом» и «онлайн-платежом».', comp: 'Онлайн-платёж — не часть платежа, а его разновидность.', aggr: 'Агрегация — про «целое и части», а здесь «является».' } }
  ];
  function pairEval(v) { v = v || {}; const good = PAIRS.filter(p => p.a.includes(v[p.id])).length; return { good, score: good / PAIRS.length }; }
  const taskRel = {
    id: 'rel', title: 'Лаборатория: какая связь и что будет при удалении',
    simple: howRels.simple,
    lead: ui.brief({
      situation: 'Глеб настраивает удаление в базе: «Скажи, где удалять вместе, где оставлять, а где это вообще один вид. Я сделаю, как на твоей схеме». Ольга Викторовна напоминает: историю ремонтов и платежей храним 5 лет.',
      todo: ['Для каждой пары выберите вид связи.', 'Нажмите «Проверить» — увидите, что случится с данными при каждом решении.', 'Засчитывается, если верно хотя бы 5 из 6.'],
      lookTitle: 'Подсказка', look: 'Задайте три вопроса: «является ли одно другим?» (наследование), «живёт ли часть без целого?» (если нет — композиция), «а если просто связаны?» (ассоциация).'
    }),
    blank: () => ({ v: {} }),
    reference: () => ({ v: Object.fromEntries(PAIRS.map(p => [p.id, p.a[0]])) }),
    render(el, ctx) {
      el.classList.add('m5c-root');
      const a = ctx.ans; a.v = a.v || {};
      const shown = !!ctx.result || ctx.readonly, ev = pairEval(a.v);
      el.innerHTML = `<div class="m5c-root">${shown ? `<div class="row"><b>Без потерь данных: ${ev.good} из ${PAIRS.length}</b>${ui.meter(ev.score)}</div>` : ''}
        ${PAIRS.map(p => { const sel = a.v[p.id]; return `<div class="m5c-pair"><div><b>${esc(p.t)}</b></div>
          <select data-pr="${p.id}" aria-label="Вид связи: ${esc(p.t)}" ${ctx.readonly ? 'disabled' : ''}><option value="">Какая связь?</option>${RK.map(r => `<option value="${r.v}" ${sel === r.v ? 'selected' : ''}>${esc(r.t)}</option>`).join('')}</select>
          ${shown ? (p.a.includes(sel) ? `<div class="res ok">${esc(p.good)}</div>` : `<div class="res bad">${sel ? esc(p.bad[sel] || '') : 'Не выбрано.'} Правильно: ${p.a.map(x => esc(RK.find(r => r.v === x).t.toLowerCase())).join(' или ')}.</div>`) : ''}</div>`; }).join('')}</div>`;
      el.onchange = ctx.readonly ? null : e => { const s = e.target.closest('[data-pr]'); if (!s) return; if (s.value) a.v[s.dataset.pr] = s.value; else delete a.v[s.dataset.pr]; ctx.save(); const r = s.parentElement.querySelector('.res'); if (r) r.remove(); };
    },
    check(ans) {
      const v = (ans && ans.v) || {}, r = pairEval(v), notes = [];
      PAIRS.forEach(p => notes.push(p.a.includes(v[p.id]) ? { ok: true, html: `${esc(p.t)}: верно.` } : { ok: false, html: `${esc(p.t)}: нужна ${p.a.map(x => esc(RK.find(k => k.v === x).t.toLowerCase())).join(' или ')}. ${v[p.id] ? esc(p.bad[v[p.id]] || '') : ''}` }));
      return { ok: r.good >= 5, score: r.score, notes, summary: `Верно ${r.good} из ${PAIRS.length}.`, mentor: r.good >= 5 ? null : 'Представьте удаление целого: что должно случиться с частью? Исчезнуть — композиция. Остаться — ассоциация. А если одно — разновидность другого, это наследование.' };
    },
    explain: `<p>Композиция — там, где часть без целого бессмысленна: предложения доп. работ и строки внутри заказ-наряда, посты внутри станции. Ассоциация — там, где объекты живут каждый своей жизнью: клиент и машина, станция и сотрудник (агрегацию тоже засчитываем). Наследование — «является»: строка запчасти — это строка заказ-наряда, онлайн-платёж — это платёж.</p>
      <p>Вид связи — это не украшение: из него разработчик настраивает удаление в базе (каскадное или запрет), а ошибка удаляет данные, которые по закону нужно хранить, или оставляет мусор в отчётах. Источники: UML 2.5.1, разделы 9.9 и 11.5; Эванс, «Предметно-ориентированное проектирование» (агрегаты и границы целостности).</p>`,
    refNote: 'Засчитывается от 5 верных из 6. Для пары «Станция и Сотрудник» засчитывается и ассоциация, и агрегация.',
    report: ans => { const v = (ans && ans.v) || {}; return PAIRS.map(p => `- ${p.t}: ${v[p.id] ? RK.find(r => r.v === v[p.id]).t : '—'}${p.a.includes(v[p.id]) ? ' ✓' : ''}`).join('\n'); }
  };

  /* ---------- 3. Ошибки в модели Ники ---------- */
  const DRAFT = {
    classes: [
      C('client', 'Клиент', ['ФИО: String', 'телефон: String'], [], 20, 30),
      C('car', 'Машина', ['госномер: String', 'client_id: int'], [], 300, 30),
      C('wo', 'ЗаказНаряд', ['номер: String', 'статус: СтатусЗН'], [], 590, 30),
      C('line', 'СтрокаЗаказНаряда', ['количество: Decimal', 'цена: Деньги'], [], 300, 250),
      C('srv', 'СтрокаРаботы', [], [], 300, 440),
      C('pay', 'ОплатитьЗаказНаряд', ['сумма: Деньги'], [], 20, 250),
      C('offer', 'ПредложениеДопРабот', ['сумма: Деньги'], [], 590, 250)
    ],
    rels: [
      { a: 'client', b: 'car', kind: 'comp', ma: '1', mb: '0..*' },
      { a: 'car', b: 'wo', kind: 'assoc', ma: '1', mb: '0..*' },
      { a: 'wo', b: 'line', kind: 'assoc', ma: '1', mb: '0..1' },
      { a: 'line', b: 'wo', kind: 'inh' },
      { a: 'srv', b: 'line', kind: 'inh' },
      { a: 'wo', b: 'pay', kind: 'assoc', ma: '1', mb: '0..*' },
      { a: 'wo', b: 'offer', kind: 'comp', ma: '1', mb: '0..*' }
    ]
  };
  const BUGS = [
    { k: 'c:client', t: 'Класс «Клиент» с ФИО и телефоном' },
    { k: 'c:car', t: 'У «Машины» атрибут client_id: int', err: 'Внешний ключ — деталь таблицы, а не понятие. В доменной модели связь «клиент владеет машиной» уже показана линией.' },
    { k: 'r:0', t: '«Клиент» ◆— «Машина»: композиция', err: 'Машина живёт без клиента: её продают, а историю ремонтов хранят 5 лет. С композицией удаление клиента по 152-ФЗ удалит машины и историю. Нужна ассоциация.' },
    { k: 'r:2', t: '«ЗаказНаряд» 1 — 0..1 «СтрокаЗаказНаряда»', err: 'Кратность 0..1 запрещает вторую строку, а в заказ-наряде их много: работы, запчасти, доп. работы. Нужно 0..*. И это композиция: строки не живут без заказ-наряда.' },
    { k: 'r:3', t: '«СтрокаЗаказНаряда» наследует «ЗаказНаряд»', err: 'Строка не является заказ-нарядом — она его часть. Наследование здесь неверно, связь уже должна быть композицией.' },
    { k: 'r:4', t: '«СтрокаРаботы» наследует «СтрокаЗаказНаряда»' },
    { k: 'c:pay', t: 'Класс «ОплатитьЗаказНаряд»', err: 'Класс назван глаголом — это действие, а не понятие. Понятие — «Платёж» (сумма, способ, статус), а «оплатить» — его операция или событие.' },
    { k: 'r:6', t: '«ЗаказНаряд» ◆— «ПредложениеДопРабот», 1 — 0..*' }
  ];
  const B_ERR = BUGS.map((b, i) => b.err ? i : -1).filter(i => i >= 0);
  function bEval(m) { const s = new Set(m || []); const hit = B_ERR.filter(i => s.has(i)).length, wrong = [...s].filter(i => !B_ERR.includes(i)).length; return { hit, wrong, score: Math.max(0, (hit - wrong) / B_ERR.length) }; }
  const taskBugs = {
    id: 'bugs', title: 'Найдите ошибки в модели Ники',
    simple: howVs.simple,
    lead: ui.brief({
      situation: 'Ника набросала модель для кабинета компании и показала Глебу. Глеб: «Начну делать таблицы прямо по ней». Вера: «Подожди. Тут пять ошибок — в понятиях, связях и кратностях».',
      todo: ['Отметьте пункты с ошибками (номера совпадают с номерами на схеме).', 'Ошибок пять.', 'Нажмите «Проверить». Засчитывается, если найдены все пять и не больше одной лишней отметки.'],
      lookTitle: 'Подсказка', look: 'Проверьте: нет ли в классах полей-ключей; не названо ли понятие глаголом; что будет с частями при удалении целого; «является» ли наследник родителем; сколько строк бывает в заказ-наряде.'
    }),
    blank: () => ({ m: [] }),
    reference: () => ({ m: B_ERR.slice() }),
    render(el, ctx) {
      el.classList.add('m5c-root');
      const a = ctx.ans; a.m = a.m || [];
      const shown = !!ctx.result || ctx.readonly, nums = {}, marks = {};
      BUGS.forEach((b, i) => { nums[b.k] = i + 1; if (shown) { const on = a.m.includes(i); marks[b.k] = on && b.err ? 'ok' : on && !b.err ? 'bad' : !on && b.err ? 'miss' : undefined; } });
      el.innerHTML = `<div class="m5c-root"><div class="m5c-board">${clSVG(DRAFT, { nums, marks, label: 'Модель Ники' })}</div>
        <div class="m5c-items">${BUGS.map((b, i) => { const on = a.m.includes(i), cls = shown ? (on && b.err ? 'ok' : on && !b.err ? 'bad' : !on && b.err ? 'miss' : '') : ''; return `<button type="button" class="m5c-item ${cls}" data-bg="${i}" aria-pressed="${on}" ${ctx.readonly ? 'disabled' : ''}><span class="n">${i + 1}</span><span>${esc(b.t)}${shown && b.err ? `<div class="small" style="margin-top:4px;color:var(--text-2)">${esc(b.err)}</div>` : ''}</span></button>`; }).join('')}</div>
        <div class="small dim" data-cnt>Отмечено: ${a.m.length}.${shown ? ' Зелёные — найдено, красные — лишняя отметка, жёлтые — пропущено.' : ''}</div>
        ${shown ? `<div class="eyebrow">Как правильно</div><div class="m5c-board">${clSVG(MODEL, { label: 'Исправленная модель' })}</div>` : ''}</div>`;
      el.onclick = ctx.readonly ? null : e => {
        const b = e.target.closest('[data-bg]'); if (!b) return;
        const i = +b.dataset.bg; a.m = a.m.includes(i) ? a.m.filter(x => x !== i) : a.m.concat(i).sort((x, y) => x - y); ctx.save();
        b.setAttribute('aria-pressed', String(a.m.includes(i))); b.classList.remove('ok', 'bad', 'miss');
        const c = TR.$('[data-cnt]', el); if (c) c.textContent = `Отмечено: ${a.m.length}.`;
      };
    },
    check(ans) {
      const m = (ans && ans.m) || [], r = bEval(m), notes = [];
      B_ERR.forEach(i => notes.push({ ok: m.includes(i), html: `${i + 1}. ${esc(BUGS[i].err)}${m.includes(i) ? '' : ' — пропущено.'}` }));
      m.filter(i => !B_ERR.includes(i)).forEach(i => notes.push({ ok: false, html: `${i + 1}. «${esc(BUGS[i].t)}» — здесь всё верно.` }));
      return { ok: r.hit === B_ERR.length && r.wrong <= 1, score: r.score, notes, summary: `Найдено ${r.hit} из ${B_ERR.length}, лишних: ${r.wrong}.`, mentor: r.hit === B_ERR.length ? (r.wrong > 1 ? 'Ошибки найдены, но отмечены и верные элементы. Сверяйте каждую отметку с правилом.' : null) : 'Пройдите чек-лист: ключи в классах, глаголы вместо понятий, удаление целого, «является ли», сколько строк в заказ-наряде.' };
    },
    explain: `<p>Пять ошибок: внешний ключ client_id в классе (связь уже показана линией); композиция «клиент — машина» (машину продают, историю хранят); кратность 0..1 у строк заказ-наряда (их много); наследование «строка — заказ-наряд» (строка — часть, а не разновидность); класс-глагол «ОплатитьЗаказНаряд» вместо понятия «Платёж».</p>
      <p>Если Глеб сделает таблицы по такой модели, в заказ-наряд нельзя будет добавить вторую строку, а удаление клиента сотрёт историю ремонтов. Поэтому доменную модель проверяют до таблиц — это дешевле всего. Источники: UML 2.5.1, раздел 11; Ларман, «Применение UML и шаблонов проектирования», глава 9 «Модель предметной области».</p>`,
    refNote: 'Засчитывается, если найдены все пять ошибок и не больше одной лишней отметки.',
    report: ans => { const r = bEval((ans && ans.m) || []); return `- Найдено ошибок: ${r.hit}/${B_ERR.length}, лишних: ${r.wrong}`; }
  };

  /* ---------- 4. Модель кабинета компании кодом Mermaid ---------- */
  const REL_OPS = [['<|--', 'inh', true], ['--|>', 'inh', false], ['*--', 'comp', true], ['--*', 'comp', false], ['o--', 'aggr', true], ['--o', 'aggr', false], ['..|>', 'dep', false], ['<|..', 'dep', true], ['..>', 'dep', false], ['<..', 'dep', true], ['-->', 'nav', false], ['<--', 'nav', true], ['--', 'assoc', false], ['..', 'dep', false]];
  function parseCL(src) {
    const classes = [], byId = {}, rels = [], msgs = []; let head = false;
    const cls = (id, name) => { let c = byId[id]; if (!c) { c = byId[id] = { id, name: name || id, attrs: [], ops: [] }; classes.push(c); } else if (name) c.name = name; return c; };
    const member = (c, t) => {
      t = t.trim(); if (!t) return;
      if (/\(/.test(t)) { const m = t.match(/^([+\-#~]?)\s*([^\s(]+\([^)]*\))\s*(\S+)?$/); c.ops.push(m ? `${m[1]}${m[2]}${m[3] ? ': ' + m[3] : ''}` : t); return; }
      const m = t.match(/^([+\-#~]?)\s*(\S+)\s+(\S+)$/); c.attrs.push(m ? `${m[1]}${m[3]}: ${m[2]}` : t);
    };
    let open = null;
    String(src || '').split(/\r?\n/).forEach((raw, i) => {
      const s = raw.trim(), n = i + 1;
      if (!s || s.startsWith('%%')) return;
      if (/^classDiagram$/i.test(s)) { head = true; return; }
      if (open) { if (s === '}') { open = null; return; } member(open, s); return; }
      let m;
      if ((m = s.match(/^class\s+([A-Za-z][A-Za-z0-9_]*)\s*(?:\["([^"]+)"\])?\s*(\{)?\s*$/))) { const c = cls(m[1], m[2]); if (m[3]) open = c; return; }
      if ((m = s.match(/^([A-Za-z][A-Za-z0-9_]*)\s*:\s*(.+)$/)) && !/(--|\.\.)/.test(s.split(':')[0])) { member(cls(m[1]), m[2]); return; }
      const rm = s.match(/^([A-Za-z][A-Za-z0-9_]*)\s*(?:"([^"]*)")?\s*(<\|--|--\|>|\*--|--\*|o--|--o|\.\.\|>|<\|\.\.|\.\.>|<\.\.|-->|<--|--|\.\.)\s*(?:"([^"]*)")?\s*([A-Za-z][A-Za-z0-9_]*)\s*(?::\s*(.+))?$/);
      if (rm) {
        const [, L, mL, op, mR, R, lab] = rm, def = REL_OPS.find(o => o[0] === op);
        cls(L); cls(R);
        const kind = def[1], leftSpecial = def[2];
        if (kind === 'inh') rels.push(leftSpecial ? { a: R, b: L, kind } : { a: L, b: R, kind });
        else if (kind === 'comp' || kind === 'aggr') rels.push(leftSpecial ? { a: L, b: R, kind, ma: mL, mb: mR, t: lab } : { a: R, b: L, kind, ma: mR, mb: mL, t: lab });
        else if (kind === 'nav') rels.push(leftSpecial ? { a: R, b: L, kind, ma: mR, mb: mL, t: lab } : { a: L, b: R, kind, ma: mL, mb: mR, t: lab });
        else rels.push(leftSpecial ? { a: R, b: L, kind, ma: mR, mb: mL, t: lab } : { a: L, b: R, kind, ma: mL, mb: mR, t: lab });
        return;
      }
      msgs.push({ n, kind: 'bad', t: 'Строку не удалось разобрать. Класс: class Company["Компания"]; атрибут: Company : +Money limit; связь: Client "1" -- "0..*" Car : владеет' });
    });
    if (open) msgs.push({ n: 0, kind: 'bad', t: 'Блок класса не закрыт: нужна строка «}».' });
    if (classes.length && !head) msgs.unshift({ n: 1, kind: 'bad', t: 'Первая строка — classDiagram.' });
    return { classes, rels, msgs, head };
  }
  const CODE_START = `classDiagram
  class Company["Компания"]
  class Client["Клиент"]
  Company : +String inn
  %% добавьте лимит автосогласования, машину, заказ-наряд,
  %% предложение доп. работ и связи с кратностями
`;
  const CODE_REF = `classDiagram
  class Company["Компания"]
  class Client["Клиент"]
  class Car["Машина"]
  class WorkOrder["Заказ-наряд"]
  class Offer["Предложение доп. работ"]
  Company : +String inn
  Company : +Money autoApproveLimit
  Client : +String phone
  Car : +String plate
  WorkOrder : +String number
  Offer : +Money amount
  Offer : +Status status
  Company "0..1" -- "0..*" Client : работает от имени
  Client "1" -- "0..*" Car : владеет
  Car "1" -- "0..*" WorkOrder
  WorkOrder "1" *-- "0..*" Offer`;
  const nm = c => TR.norm(c.name + ' ' + c.id);
  const findC = (g, re) => g.classes.find(c => re.test(nm(c)));
  const relBetween = (g, x, y) => x && y && g.rels.find(r => (r.a === x.id && r.b === y.id) || (r.a === y.id && r.b === x.id));
  const CN = { company: /компан|company/, client: /клиент|client/, car: /машин|car|авто/, wo: /заказ|workorder|order/, offer: /предлож|offer/ };
  const CFEATS = [
    { t: 'Первая строка — classDiagram', f: g => g.head },
    { t: 'Пять классов: компания, клиент, машина, заказ-наряд, предложение доп. работ', f: g => Object.values(CN).every(re => findC(g, re)) },
    { t: 'У компании есть лимит автосогласования', f: g => { const c = findC(g, CN.company); return !!c && c.attrs.some(a => /лимит|limit/.test(TR.norm(a))); } },
    { t: 'Связь «компания — клиент» с кратностями 0..1 и 0..*', f: g => { const c = findC(g, CN.company), k = findC(g, CN.client), r = relBetween(g, c, k); if (!r) return false; const mc = r.a === c.id ? r.ma : r.mb, mk = r.a === c.id ? r.mb : r.ma; return mc === '0..1' && /^(0\.\.\*|\*)$/.test(mk || ''); } },
    { t: 'У машины ровно один владелец: «1» на стороне клиента', f: g => { const k = findC(g, CN.client), c = findC(g, CN.car), r = relBetween(g, k, c); if (!r) return false; return (r.a === k.id ? r.ma : r.mb) === '1'; } },
    { t: 'Предложение — композиция внутри заказ-наряда', f: g => { const w = findC(g, CN.wo), o = findC(g, CN.offer); return !!(w && o && g.rels.some(r => r.kind === 'comp' && r.a === w.id && r.b === o.id)); } },
    { t: 'У всех связей, кроме наследования, есть кратности на обоих концах', f: g => { const rs = g.rels.filter(r => r.kind !== 'inh' && r.kind !== 'dep'); return rs.length >= 3 && rs.every(r => r.ma && r.mb); } },
    { t: 'Код без ошибок разбора', f: g => g.classes.length > 0 && !g.msgs.some(m => m.kind === 'bad') }
  ];
  function codeEval(text) { const g = parseCL(text); const on = CFEATS.map(f => !!f.f(g)); const n = on.filter(Boolean).length; return { g, on, n, score: n / CFEATS.length }; }
  const taskCode = {
    id: 'code', title: 'Опишите модель кабинета компании кодом Mermaid',
    lead: ui.brief({
      situation: 'Рустам хочет в кабинете «Шашки» видеть свои машины, заказ-наряды и что согласовано автоматически. Глеб: «Дай модель кодом — положу в задачу в GitLab, по ней и сделаем таблицы».',
      todo: ['Допишите диаграмму классов в Mermaid. Схема рисуется рядом, пока вы пишете.', 'Следите за признаками под редактором.', 'Нажмите «Проверить». Засчитывается, если выполнено 7 признаков из 8, включая «код без ошибок разбора».'],
      lookTitle: 'Подсказка', look: 'Корпоративный клиент — это клиент со ссылкой на компанию (бывает и без неё); лимит автосогласования хранится у компании (BR-9). Композиция: WorkOrder "1" *-- "0..*" Offer. Идентификаторы — латиницей, русское имя: class Car["Машина"].'
    }),
    blank: () => ({ text: '' }),
    reference: () => ({ text: CODE_REF }),
    render(el, ctx) {
      el.classList.add('m5c-root');
      const a = ctx.ans; if (!a.text && !ctx.readonly) a.text = CODE_START;
      el.innerHTML = `<div class="m5c-root"><div class="m5c-two m5c-ed"><div class="stack"><textarea spellcheck="false" aria-label="Код диаграммы классов" ${ctx.readonly ? 'readonly' : ''}></textarea><div class="stack" data-pm aria-live="polite"></div></div><div class="m5c-board" data-out></div></div>
        <div class="eyebrow">Признаки</div><div class="m5c-feats" data-ft aria-live="polite"></div>
        <details class="small"><summary>Шпаргалка Mermaid classDiagram</summary>${ui.code('classDiagram\n  class Car["Машина"]\n  Car : +String plate\n  Car : +mileage() int\n  Client "1" -- "0..*" Car : владеет\n  WorkOrder "1" *-- "0..*" Offer\n  Line <|-- PartLine', 'text')}</details></div>`;
      const ta = TR.$('textarea', el); ta.value = a.text || '';
      const upd = () => {
        const ev = codeEval(ta.value);
        TR.$('[data-ft]', el).innerHTML = CFEATS.map((f, i) => `<div class="m5c-feat ${ev.on[i] ? 'on' : ''}"><span class="mk">${ev.on[i] ? '✓' : '○'}</span><span>${esc(f.t)}</span></div>`).join('');
        TR.$('[data-pm]', el).innerHTML = ev.g.msgs.slice(0, 5).map(m => `<div class="m5c-pm ${m.kind === 'bad' ? '' : 'warn'}">${m.n ? `Строка ${m.n}: ` : ''}${esc(m.t)}</div>`).join('');
        TR.$('[data-out]', el).innerHTML = clSVG({ classes: ev.g.classes.map(c => Object.assign({}, c, { x: null, y: null })), rels: ev.g.rels }, { label: 'Ваша модель' });
      };
      if (!ctx.readonly) ta.addEventListener('input', () => { a.text = ta.value; ctx.save(); upd(); });
      upd();
    },
    check(ans) {
      const ev = codeEval((ans && ans.text) || ''), notes = [];
      CFEATS.forEach((f, i) => notes.push({ ok: ev.on[i], html: esc(f.t) + (ev.on[i] ? '' : ' — не выполнено.') }));
      ev.g.msgs.filter(m => m.kind === 'bad').slice(0, 3).forEach(m => notes.push({ ok: false, html: `${m.n ? `Строка ${m.n}: ` : ''}${esc(m.t)}` }));
      const clean = ev.on[CFEATS.length - 1];
      return { ok: ev.n >= 7 && clean, score: ev.score, notes, summary: `Признаков: ${ev.n} из ${CFEATS.length}.`, mentor: ev.n >= 7 && clean ? null : !clean ? 'Сначала добейтесь, чтобы код разбирался: первая строка classDiagram, идентификаторы латиницей, кратности в кавычках.' : 'Проверьте модель по базе: клиент бывает без компании, у машины один владелец, предложение живёт только внутри заказ-наряда.' };
    },
    explain: `<p>В эталоне пять классов. Компания хранит ИНН и лимит автосогласования (BR-9). Связь «Компания 0..1 — 0..* Клиент» значит, что клиент бывает частным. «Клиент 1 — 0..* Машина»: у машины один владелец. «Машина 1 — 0..* ЗаказНаряд» — история обслуживания. Предложение доп. работ — композиция внутри заказ-наряда, и именно по его полю «как решено» кабинет покажет Рустаму, что согласовано автоматически.</p>
      <p>Из этой модели Глеб получит таблицы company, client, car, work_order, extra_offer и внешние ключи — ровно те, что вы видели в модуле 4. Источник: mermaid.js.org/syntax/classDiagram.html; UML 2.5.1, раздел 11.</p>`,
    refNote: 'Засчитывается любой корректный код Mermaid, если выполнено 7 признаков из 8.',
    report: ans => { const ev = codeEval((ans && ans.text) || ''); return `- Признаков: ${ev.n}/${CFEATS.length}\n\n\`\`\`\n${(ans && ans.text) || ''}\n\`\`\``; }
  };

  /* ---------- 5. Ответ Артёму ---------- */
  const J_RUBRIC = [
    'Объясняет, что модель понятий — общий язык с бизнесом: понятия и правила (клиент и компания, лимит, у машины один владелец) проверяют с Мариной Олеговной и Рустамом до кода',
    'Приводит пример ошибки, которую модель ловит дёшево: строки заказ-наряда с кратностью 0..1, композиция «клиент — машина» или клиент без компании',
    'Говорит, что из модели получаются таблицы, API и экраны — она экономит время, а не тратит его',
    'Упоминает, что модель не зависит от базы: таблицы можно поменять, понятия останутся',
    'Отвечает на языке руководителя проекта: сроки, риски, переделки — и коротко'
  ];
  const J_REF = 'Артём, день на модель понятий — это страховка от недели переделок. В модели мы договариваемся с Мариной Олеговной и Рустамом на их языке: корпоративный клиент — это водитель от компании, лимит автосогласования у компании, у машины один владелец. Такие правила дешевле всего поправить на схеме: в черновике Ники строк в заказ-наряде могла быть только одна, а удаление клиента стирало историю ремонтов. Найди мы это после таблиц — переделывали бы базу, API и экраны кабинета. Из готовой модели Глеб сразу получает таблицы и ключи, Даша — что показывать в кабинете, Лиза — что проверять. И модель не привязана к базе: если поменяем хранение, понятия и правила останутся теми же.';
  const taskExplain = {
    id: 'explain', title: 'Объясните Артёму, зачем модель понятий до таблиц',
    lead: ui.brief({
      situation: 'Артём: «Зачем тратить день на какие-то классы? Глеб быстрее сразу таблицы сделает, а Рустам ждёт кабинет».',
      todo: ['Ответьте своими словами, от 200 символов: что даёт модель понятий проекту, срокам и рискам.', 'Проверьте ответ по рубрике (или попросите Веру).', 'Нажмите «Проверить». Засчитывается от 60 % по рубрике.'],
      lookTitle: 'Подсказка', look: 'Руководителя проекта убеждают сроки и риски: что дешевле поправить на схеме, чем в базе, и что модель даёт всем в команде.'
    }),
    blank: () => ({ j: {} }),
    reference: () => ({ j: { text: J_REF, self: J_RUBRIC.map(() => true) } }),
    render(el, ctx) {
      el.classList.add('m5c-root');
      const a = ctx.ans; a.j = a.j || {};
      el.innerHTML = `<div class="m5c-root">${ui.say('artem', 'Зачем тратить день на какие-то классы? Глеб быстрее сразу таблицы сделает, а Рустам ждёт кабинет.')}<div data-j></div></div>`;
      ui.justify(TR.$('[data-j]', el), {
        id: 'm5c-artem', q: 'Что ответить Артёму?',
        qPlain: 'Объясните руководителю проекта, зачем перед проектированием таблиц нужна доменная модель (диаграмма классов): что она даёт проекту, срокам, рискам и команде.',
        rubric: J_RUBRIC, reference: J_REF, value: a.j, readonly: ctx.readonly, minLen: 200,
        placeholder: 'Артём, …',
        onChange: v => { a.j = v; ctx.save(); ctx.decide('Ответ Артёму: зачем доменная модель', v.text || ''); }
      });
    },
    check(ans) {
      const j = ui.justifyScore(ans && ans.j), notes = [];
      if (!j) notes.push({ ok: false, html: 'Ответ не написан или не оценён: от 200 символов, затем проверка по рубрике или с Верой.' });
      else notes.push({ ok: j >= 0.6 ? true : 'warn', html: `Ответ: ${pct(j)} по рубрике.${j < 0.6 ? ' Скажите, какие переделки модель предотвращает и что она даёт команде.' : ''}` });
      return { ok: j >= 0.6, score: j, notes, summary: `Ответ: ${pct(j)} по рубрике.`, mentor: j >= 0.6 ? null : 'Артёма убеждают сроки и риски. Покажите на примере, какую переделку модель предотвращает.' };
    },
    explain: `<p>Доменная модель — самое дешёвое место для исправления ошибок понимания: правило «у машины один владелец» или «строк в заказ-наряде много» правится на схеме за минуту, а в базе, API и экранах — днями. Модель даёт общий язык с бизнесом и с командой и не зависит от способа хранения.</p>
      <p>Руководителю проекта аргументы нужны в его координатах: сроки, риски, переделки. Источники: Эванс, «Предметно-ориентированное проектирование» (единый язык); Вигерс, Битти, «Разработка требований к ПО», глава о моделях данных; Боэм — стоимость исправления ошибки растёт по этапам.</p>`,
    refNote: 'Оценивается по рубрике: самопроверка или проверка Claude.',
    report: ans => `- Ответ Артёму (${pct(ui.justifyScore(ans && ans.j))}): ${(ans && ans.j && ans.j.text) || '—'}`
  };

  TR.stage({
    id: ID,
    when: 'понедельник, 22 февраля, 11:00 · кабинет компании: понятия до таблиц',
    intro: [
      { who: 'rustam', html: 'Хочу в кабинете видеть все машины «Шашки», их заказ-наряды и что ваши мастера согласовали автоматически в пределах лимита. Сейчас я узнаю об этом из счёта в конце месяца.' },
      { who: 'gleb', html: 'Сделаю таблицы прямо сегодня: company, client, car — и поехали.' },
      { who: 'vera', html: 'Сначала — модель понятий: диаграмма классов. Кто с кем связан, сколько их, что будет с частями при удалении целого. Это полдня, и таблицы потом лягут сами. А ошибка в понятиях после таблиц стоит недели.' }
    ],
    glossary: [
      { term: 'Диаграмма классов', simple: 'Понятия предметной области, что о них знаем и как они связаны.', tech: 'UML Class Diagram (UML 2.5.1, раздел 11); у аналитика — доменная модель.' },
      { term: 'Класс', simple: 'Понятие: «Клиент», «Машина», «ЗаказНаряд».', tech: 'Classifier с атрибутами и операциями; объект — экземпляр класса.' },
      { term: 'Кратность', simple: 'Сколько объектов на конце связи: 1, 0..1, 0..*, 1..*.', tech: 'Multiplicity — нижняя и верхняя границы числа связанных экземпляров.' },
      { term: 'Композиция', simple: 'Часть не живёт без целого (закрашенный ромб).', tech: 'Composite aggregation: часть принадлежит одному целому и удаляется вместе с ним.' },
      { term: 'Наследование', simple: '«Является»: строка запчасти — это строка заказ-наряда.', tech: 'Generalization: наследник получает атрибуты и связи родителя.' },
      { term: 'Доменная модель', simple: 'Модель понятий бизнеса без деталей базы и кода.', tech: 'Domain model (Ларман, Эванс): классы предметной области, атрибуты, ассоциации.' }
    ],
    outro: 'Модель кабинета согласована с Рустамом и Мариной Олеговной: клиент бывает без компании, у машины один владелец, предложения живут внутри заказ-наряда. Глеб делает таблицы по модели — и они совпадают с базой из модуля 4. Следующее занятие — C4: как показать архитектуру разным читателям.',
    tasks: [howParts, howRels, howVs, taskMult, taskRel, taskBugs, taskCode, taskExplain]
  });
})();
