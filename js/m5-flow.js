/* Модуль 5, занятие 3: Блок-схема (ГОСТ 19.701-90, ISO 5807).
   Теория: how-fc-shapes — фигуры ГОСТ на схеме «можно ли записаться онлайн» (BR-1, BR-2, BR-4): терминатор, ввод/вывод,
   процесс, предопределённый процесс, решение; документ, соединитель и граница цикла — значками («нажмите на фигуру»),
   бытовой пример — рецепт; how-fc-trace — «пройдите по схеме»: ползунки часов до начала, дней вперёд и неявок подряд
   подсвечивают путь, каждый путь — тест, граничные значения; how-fc-rules — правила хорошей блок-схемы, цикл ожидания
   (BR-8) с возвратом, код Mermaid и PlantUML.
   Практика: фигуры ГОСТ к шагам; лаборатория «Лиза гоняет тесты» с граничными случаями и последствиями; ошибки в черновике
   BR-4 (тупик, число, выдуманный штраф, ромб без вопроса и с одним выходом); правило BR-9 кодом Mermaid с живой схемой и
   проверкой по признакам; ответ Марине Олеговне, зачем схема, если правило можно объяснить на словах. */
'use strict';
(function () {
  const TR = window.TR, ui = TR.ui, esc = TR.esc;
  const ID = 'm5-flow';
  const pct = x => Math.round((x || 0) * 100) + ' %';

  if (!document.getElementById('m5f-css')) document.head.insertAdjacentHTML('beforeend', `<style id="m5f-css">
    .m5f-root { display: grid; gap: 14px; min-width: 0; }
    .m5f-root p { margin: 0; }
    .m5f-board { overflow-x: auto; border: 1px solid var(--border); border-radius: 12px; background: var(--surface-2); padding: 8px; }
    .m5f-board svg { display: block; margin: 0 auto; }
    .m5f-board [data-k] { cursor: pointer; }
    .m5f-chips { display: flex; flex-wrap: wrap; gap: 6px; }
    .m5f-chips .chip[aria-pressed="true"] { background: var(--accent); color: var(--accent-text); border-color: var(--accent); }
    .m5f-info { border: 1px solid var(--border); border-left: 4px solid var(--accent); border-radius: 10px; background: var(--surface); padding: 10px 14px; display: grid; gap: 6px; font-size: 14px; }
    .m5f-two { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 14px; align-items: start; }
    .m5f-glyph { display: flex; align-items: center; gap: 10px; }
    .m5f-sl { display: grid; gap: 10px; }
    .m5f-sl label { display: grid; gap: 4px; font-size: 14px; }
    .m5f-sl input[type=range] { width: 100%; accent-color: var(--accent); }
    .m5f-sl b { font-family: var(--f-mono); color: var(--accent); }
    .m5f-out { border-radius: 10px; padding: 10px 12px; font-size: 14px; background: var(--ok-soft); border-left: 3px solid var(--ok); }
    .m5f-out.stop { background: var(--warn-soft); border-left-color: var(--warn); }
    .m5f-items { display: grid; gap: 6px; }
    .m5f-item { display: grid; grid-template-columns: 30px minmax(0, 1fr); gap: 8px; text-align: left; font: inherit; font-size: 14px; color: var(--text); background: var(--surface); border: 1px solid var(--border); border-radius: 9px; padding: 8px 10px; cursor: pointer; }
    .m5f-item .n { font: 700 12px var(--f-mono); color: var(--accent); }
    .m5f-item[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); }
    .m5f-item.ok { border-color: var(--ok); background: var(--ok-soft); }
    .m5f-item.bad { border-color: var(--bad); background: var(--bad-soft); }
    .m5f-item.miss { border-color: var(--warn); background: var(--warn-soft); }
    .m5f-item[disabled] { cursor: default; }
    .m5f-case { display: grid; grid-template-columns: minmax(0, 1fr) minmax(170px, 250px); gap: 10px; align-items: center; border: 1px solid var(--border); border-radius: 12px; background: var(--surface); padding: 10px 12px; }
    .m5f-case select { width: 100%; }
    .m5f-case .meta { font: 600 11px var(--f-mono); color: var(--text-muted); letter-spacing: .04em; }
    .m5f-case .res { grid-column: 1 / -1; font-size: 13.5px; border-radius: 8px; padding: 6px 10px; }
    .m5f-case .res.ok { background: var(--ok-soft); border-left: 3px solid var(--ok); }
    .m5f-case .res.bad { background: var(--bad-soft); border-left: 3px solid var(--bad); }
    .m5f-ed textarea { width: 100%; min-height: 280px; box-sizing: border-box; font: 12.5px/1.55 var(--f-mono); font-variant-ligatures: none; font-feature-settings: "liga" 0, "calt" 0; background: var(--code-bg); color: var(--text); border: 1px solid var(--border); border-radius: 10px; padding: 10px; resize: vertical; }
    .m5f-feats { display: grid; gap: 4px; font-size: 13.5px; }
    .m5f-feat { display: grid; grid-template-columns: 22px minmax(0, 1fr); gap: 6px; }
    .m5f-feat .mk { font-weight: 700; color: var(--text-muted); } .m5f-feat.on .mk { color: var(--ok); }
    .m5f-pm { font-size: 12.5px; padding: 4px 8px; border-radius: 8px; background: var(--bad-soft); color: var(--bad); }
    .m5f-pm.warn { background: var(--warn-soft); color: var(--warn); }
    .m5f-root pre.code, .m5f-root code { font-variant-ligatures: none; font-feature-settings: "liga" 0, "calt" 0; }
    @media (max-width: 820px) { .m5f-two { grid-template-columns: minmax(0, 1fr); } .m5f-case { grid-template-columns: minmax(0, 1fr); } }
  </style>`);

  /* =====================================================================
     Разбор Mermaid flowchart (подмножество) и раскладка
     ===================================================================== */
  const NODE_RE = /^([A-Za-z][A-Za-z0-9_]*)\s*(\(\[(.+?)\]\)|\[\[(.+?)\]\]|\[\/(.+?)\/\]|\(\((.+?)\)\)|\{(.+?)\}|\[(.+?)\]|\((.+?)\))?/;
  function parseFC(src) {
    const nodes = {}, order = [], edges = [], msgs = [];
    let head = false;
    const unq = t => String(t).trim().replace(/^"(.*)"$/, '$1');
    const node = (id, kind, t) => { let n = nodes[id]; if (!n) { n = nodes[id] = { id, kind: 'proc', t: id, defined: false }; order.push(id); } if (kind) { n.kind = kind; n.t = unq(t); n.defined = true; } return n; };
    String(src || '').split(/\r?\n/).forEach((raw, i) => {
      let s = raw.trim(); const n = i + 1;
      if (!s || s.startsWith('%%')) return;
      if (/^(flowchart|graph)\s+(TD|TB|LR|RL|BT)$/i.test(s)) { head = true; return; }
      if (/^(flowchart|graph)$/i.test(s)) { head = true; msgs.push({ n, kind: 'warn', t: 'Укажите направление: flowchart TD (сверху вниз).' }); return; }
      if (/^(classDef|class|style|linkStyle|click|subgraph|end)\b/i.test(s)) { msgs.push({ n, kind: 'warn', t: `«${s.split(/\s/)[0]}» живая схема не рисует, но Mermaid его понимает.` }); return; }
      const chain = [], labels = [];
      let pos = 0, ok = true;
      const readNode = () => {
        const m = s.slice(pos).match(NODE_RE);
        if (!m) return null;
        pos += m[0].length;
        let kind = null, t = null;
        if (m[3] != null) { kind = 'term'; t = m[3]; } else if (m[4] != null) { kind = 'sub'; t = m[4]; } else if (m[5] != null) { kind = 'io'; t = m[5]; } else if (m[6] != null) { kind = 'conn'; t = m[6]; } else if (m[7] != null) { kind = 'dec'; t = m[7]; } else if (m[8] != null) { kind = 'proc'; t = m[8]; } else if (m[9] != null) { kind = 'term'; t = m[9]; }
        return node(m[1], kind, t);
      };
      const first = readNode();
      if (!first) { msgs.push({ n, kind: 'bad', t: 'Строку не удалось разобрать. Пример: A[Действие] --> B{Вопрос?}' }); return; }
      chain.push(first);
      while (pos < s.length) {
        const rest = s.slice(pos);
        let m;
        if ((m = rest.match(/^\s*-->\s*\|([^|]*)\|\s*/))) { labels.push(m[1].trim()); pos += m[0].length; }
        else if ((m = rest.match(/^\s*(-->|-\.->|==>)\s*/))) { labels.push(''); pos += m[0].length; }
        else if ((m = rest.match(/^\s*--\s*([^>]+?)\s*-->\s*/))) { labels.push(m[1].trim()); pos += m[0].length; }
        else if (/^\s*;?\s*$/.test(rest)) { pos = s.length; break; }
        else { ok = false; break; }
        const nx = readNode();
        if (!nx) { ok = false; break; }
        chain.push(nx);
      }
      if (!ok) { msgs.push({ n, kind: 'bad', t: 'Не удалось разобрать связь. Связь: A --> B, с подписью: A -- да --> B или A -->|да| B.' }); return; }
      for (let k = 0; k < labels.length; k++) edges.push({ from: chain[k].id, to: chain[k + 1].id, t: labels[k] });
    });
    if (order.length && !head) msgs.unshift({ n: 1, kind: 'bad', t: 'Первая строка — тип и направление: flowchart TD.' });
    order.forEach(id => { if (!nodes[id].defined) msgs.push({ n: 0, kind: 'warn', t: `Узел ${id} без фигуры и текста — задайте, например, ${id}[Действие].` }); });
    return { nodes, order, edges, msgs, head };
  }
  function wrapT(t, max) { const w = String(t).split(/[ \t]+/), out = []; let line = ''; w.forEach(x => { if ((line + ' ' + x).trim().length > max && line) { out.push(line); line = x; } else line = (line + ' ' + x).trim(); }); if (line) out.push(line); return out.slice(0, 4); }
  function sizeOf(n) {
    if (n.kind === 'conn') { n._ls = [n.t]; return { w: 34, h: 34 }; }
    const max = n.kind === 'dec' ? 18 : 24, ls = wrapT(n.t, max); n._ls = ls;
    const L = Math.max(...ls.map(l => l.length));
    if (n.kind === 'dec') return { w: Math.max(150, L * 7.2 + 70), h: ls.length * 15 + 40 };
    if (n.kind === 'term') return { w: Math.max(110, L * 7 + 36), h: Math.max(34, ls.length * 15 + 16) };
    return { w: Math.min(260, Math.max(130, L * 7 + (n.kind === 'io' ? 44 : n.kind === 'sub' ? 40 : 28))), h: ls.length * 15 + 18 };
  }
  function layoutFC(g) {
    const ids = g.order, out = {}; ids.forEach(id => { out[id] = []; });
    g.edges.forEach((e, i) => { e.i = i; out[e.from].push(e); });
    const hasIn = new Set(g.edges.map(e => e.to));
    const roots = ids.filter(id => !hasIn.has(id)); if (!roots.length && ids.length) roots.push(ids[0]);
    // обратные рёбра (циклы)
    const state = {};
    const dfs = v => { state[v] = 1; out[v].forEach(e => { if (state[e.to] === 1) e.back = true; else if (!state[e.to]) dfs(e.to); }); state[v] = 2; };
    roots.forEach(r => { if (!state[r]) dfs(r); }); ids.forEach(id => { if (!state[id]) dfs(id); });
    // ранги — длиннейший путь без обратных рёбер
    const rank = {}, inc = {}; ids.forEach(id => { inc[id] = []; }); g.edges.forEach(e => { if (!e.back) inc[e.to].push(e); });
    const rk = v => { if (rank[v] != null) return rank[v]; rank[v] = -1; let r = 0; inc[v].forEach(e => { r = Math.max(r, rk(e.from) + 1); }); rank[v] = r; return r; };
    ids.forEach(rk);
    // колонки: «да» и первый выход продолжают колонку родителя, остальные уходят вправо
    const col = {}, occ = {}, seen = {};
    const free = (r, c) => { while (occ[r] && occ[r].has(c)) c++; return c; };
    const put = (v, c) => { c = free(rank[v], c); col[v] = c; (occ[rank[v]] = occ[rank[v]] || new Set()).add(c); };
    // основную колонку продолжает ветка с самым длинным путём до конца; при равенстве — «да»
    const hgt = {}, height = v => { if (hgt[v] != null) return hgt[v]; hgt[v] = 0; let h = 0; out[v].forEach(e => { if (!e.back) h = Math.max(h, height(e.to) + 1); }); hgt[v] = h; return h; };
    const sortKids = es => es.filter(e => !e.back).slice().sort((a, b) => (height(b.to) - height(a.to)) || ((/^да$/i.test(b.t) ? 1 : 0) - (/^да$/i.test(a.t) ? 1 : 0)));
    const walk = v => { if (seen[v]) return; seen[v] = 1; sortKids(out[v]).forEach((e, k) => { if (col[e.to] == null) put(e.to, k === 0 ? col[v] : col[v] + 1); walk(e.to); }); };
    roots.forEach(r => { if (col[r] == null) put(r, 0); walk(r); }); ids.forEach(id => { if (col[id] == null) put(id, 0); walk(id); });
    // размеры, координаты
    const sz = {}; ids.forEach(id => { sz[id] = sizeOf(g.nodes[id]); });
    const nCols = Math.max(0, ...ids.map(id => col[id])) + 1, nRanks = Math.max(0, ...ids.map(id => rank[id])) + 1;
    const colW = Array.from({ length: nCols }, (_, c) => Math.max(120, ...ids.filter(id => col[id] === c).map(id => sz[id].w)));
    const rowH = Array.from({ length: nRanks }, (_, r) => Math.max(30, ...ids.filter(id => rank[id] === r).map(id => sz[id].h)));
    const backN = g.edges.filter(e => e.back).length, LEFT = 30 + backN * 16;
    const cx = []; let x = LEFT; colW.forEach((w, c) => { cx[c] = x + w / 2; x += w + 56; });
    const ry = []; let y = 18; rowH.forEach((h, r) => { ry[r] = y; y += h + 46; });
    const pos = {}; ids.forEach(id => { const r = rank[id]; pos[id] = { x: cx[col[id]], y: ry[r] + (rowH[r] - sz[id].h) / 2, w: sz[id].w, h: sz[id].h }; });
    const occAt = new Set(ids.map(id => col[id] + ':' + rank[id]));
    return { pos, rank, col, cx, colW, occAt, width: x - 56 + 30, height: y - 46 + 18, LEFT };
  }
  function shape(n, p, st) {
    const x = p.x - p.w / 2, y = p.y, w = p.w, h = p.h, sty = `fill:${st.fill};stroke:${st.stroke};stroke-width:${st.sw}`;
    if (n.kind === 'term') return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" style="${sty}"/>`;
    if (n.kind === 'dec') return `<polygon points="${p.x},${y} ${x + w},${y + h / 2} ${p.x},${y + h} ${x},${y + h / 2}" style="${sty}"/>`;
    if (n.kind === 'io') return `<polygon points="${x + 12},${y} ${x + w},${y} ${x + w - 12},${y + h} ${x},${y + h}" style="${sty}"/>`;
    if (n.kind === 'sub') return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" style="${sty}"/><path d="M${x + 9} ${y} V${y + h} M${x + w - 9} ${y} V${y + h}" style="stroke:${st.stroke};stroke-width:${st.sw}"/>`;
    if (n.kind === 'conn') return `<circle cx="${p.x}" cy="${y + h / 2}" r="${h / 2}" style="${sty}"/>`;
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" style="${sty}"/>`;
  }
  function fcSVG(src, opt) {
    opt = opt || {};
    const g = typeof src === 'string' ? parseFC(src) : src;
    if (!g.order.length) return '<p class="small dim" style="padding:10px">Здесь появится схема.</p>';
    const L = layoutFC(g), uid = 'm5f' + Math.random().toString(36).slice(2, 8);
    let rightLane = 0, leftLane = 0;
    const maxRight = Math.max(...g.order.map(id => L.pos[id].x + L.pos[id].w / 2));
    const longN = g.edges.filter(e => !e.back && L.rank[e.to] - L.rank[e.from] > 1).length;
    const W = Math.max(L.width + longN * 16 + 20, 300), H = L.height + 10;
    const onPath = k => opt.path && opt.path.has(k);
    const markOf = k => opt.marks && opt.marks[k];
    const colOf = (k, base) => { const m = markOf(k); return m === 'ok' ? 'var(--ok)' : m === 'bad' ? 'var(--bad)' : m === 'miss' ? 'var(--warn)' : onPath(k) ? 'var(--accent)' : base; };
    let s = `<svg viewBox="0 0 ${W} ${H}" width="100%" style="min-width:${Math.min(W, 460)}px;max-width:${W}px" role="img" aria-label="${esc(opt.label || 'Блок-схема')}"><defs>`;
    ['var(--text-2)', 'var(--accent)', 'var(--ok)', 'var(--bad)', 'var(--warn)'].forEach((c, i) => { s += `<marker id="${uid}-${i}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" style="fill:${c}"/></marker>`; });
    s += '</defs>';
    const mk = c => ['var(--text-2)', 'var(--accent)', 'var(--ok)', 'var(--bad)', 'var(--warn)'].indexOf(c);
    const num = (k, x, y) => opt.nums && opt.nums[k] ? `<circle cx="${x}" cy="${y}" r="9" style="fill:var(--accent)"/><text x="${x}" y="${y + 3.5}" text-anchor="middle" style="fill:var(--accent-text);font-size:10px;font-weight:700">${opt.nums[k]}</text>` : '';
    const label = (t, x, y, anchor, c) => t ? `<text x="${x}" y="${y}" text-anchor="${anchor || 'middle'}" style="fill:${c};font-size:11.5px;font-weight:600;paint-order:stroke;stroke:var(--surface-2);stroke-width:4px">${esc(t)}</text>` : '';
    g.edges.forEach(e => {
      const A = L.pos[e.from], B = L.pos[e.to], k = 'e:' + e.i, c = colOf(k, 'var(--text-2)'), w = onPath(k) || markOf(k) ? 2.4 : 1.5;
      const dec = g.nodes[e.from].kind === 'dec';
      let d, lx, ly, la = 'start';
      if (e.back) {
        const lane = L.LEFT - 18 - (leftLane++) * 16, ax = A.x - A.w / 2, ay = A.y + A.h / 2, bx = B.x - B.w / 2, by = B.y + B.h / 2;
        d = `M${ax} ${ay} H${lane} V${by} H${bx - 1}`; lx = ax - 6; ly = ay - 6; la = 'end';
      } else if (L.rank[e.to] - L.rank[e.from] > 1) {
        const lane = maxRight + 24 + (rightLane++) * 16, ax = A.x + A.w / 2, ay = A.y + A.h / 2, by = B.y + B.h / 2, bx = B.x + B.w / 2;
        d = `M${ax} ${ay} H${lane} V${by} H${bx + 1}`; lx = ax + 6; ly = ay - 6;
      } else if (Math.abs(A.x - B.x) < 1) {
        d = `M${A.x} ${A.y + A.h} V${B.y - 1}`; lx = A.x + 8; ly = A.y + A.h + 14;
      } else if (B.x > A.x && dec) {
        const ax = A.x + A.w / 2, ay = A.y + A.h / 2, cB = L.col[e.to];
        if (L.occAt.has(cB + ':' + L.rank[e.from])) {
          // в колонке цели на высоте ромба уже стоит фигура: спускаемся по промежутку между колонками
          const gx = L.cx[cB] - L.colW[cB] / 2 - 24, gy = B.y - 16;
          d = `M${ax} ${ay} H${gx} V${gy} H${B.x} V${B.y - 1}`;
        } else d = `M${ax} ${ay} H${B.x} V${B.y - 1}`;
        lx = ax + 6; ly = ay - 6;
      } else {
        const mid = A.y + A.h + 20; d = `M${A.x} ${A.y + A.h} V${mid} H${B.x} V${B.y - 1}`; lx = A.x + (B.x > A.x ? 8 : -8); ly = A.y + A.h + 14; la = B.x > A.x ? 'start' : 'end';
      }
      s += `<g data-k="${k}"><path d="${d}" style="fill:none;stroke:transparent;stroke-width:12"/><path d="${d}" style="fill:none;stroke:${c};stroke-width:${w}" marker-end="url(#${uid}-${Math.max(0, mk(c))})"/>${label(e.t, lx, ly, la, c === 'var(--text-2)' ? 'var(--text)' : c)}${num(k, lx + (la === 'end' ? -14 : 14), ly + 8)}</g>`;
    });
    g.order.forEach(id => {
      const n = g.nodes[id], p = L.pos[id], k = 'n:' + id;
      const hl = opt.hl && opt.hl === n.kind, c = colOf(k, hl ? 'var(--accent)' : 'var(--border-strong)'), path = onPath(k);
      s += `<g data-k="${k}" data-kind="${n.kind}">${shape(n, p, { fill: path ? 'var(--accent-soft)' : 'var(--surface)', stroke: c, sw: hl || path || markOf(k) ? 2.6 : 1.5 })}`;
      const t0 = p.y + p.h / 2 - (n._ls.length - 1) * 7.5 + 4;
      n._ls.forEach((l, i) => { s += `<text x="${p.x}" y="${t0 + i * 15}" text-anchor="middle" style="fill:var(--text);font-size:12px;${n.kind === 'term' || n.kind === 'dec' ? 'font-weight:600' : ''}">${esc(l)}</text>`; });
      s += num(k, p.x + p.w / 2 - 2, p.y + 2) + '</g>';
    });
    return s + '</svg>';
  }

  /* =====================================================================
     Основная схема: можно ли записаться онлайн (BR-1, BR-2, BR-4)
     ===================================================================== */
  const MAIN = `flowchart TD
  S([Начало]) --> IN[/Клиент выбрал услуги, дату и время/]
  IN --> D[[Посчитать длительность по BR-1]]
  D --> Q1{До начала не меньше 2 часов?}
  Q1 -- нет --> R1[/«Онлайн-запись закрыта, позвоните на станцию»/]
  Q1 -- да --> Q2{Не дальше 30 дней вперёд?}
  Q2 -- нет --> R2[/«Запись открыта только на 30 дней вперёд»/]
  Q2 -- да --> Q3{Две неявки подряд?}
  Q3 -- да --> P1[Создать запись «Ждёт предоплаты» 500 ₽]
  Q3 -- нет --> P2[Создать запись «Подтверждена»]
  R1 --> E([Конец])
  R2 --> E
  P1 --> E
  P2 --> E`;
  const MAIN_PU = `@startuml
start
:Клиент выбрал услуги, дату и время;
:Посчитать длительность по BR-1;
if (До начала не меньше 2 часов?) then (да)
  if (Не дальше 30 дней вперёд?) then (да)
    if (Две неявки подряд?) then (да)
      :Создать запись «Ждёт предоплаты» 500 ₽;
    else (нет)
      :Создать запись «Подтверждена»;
    endif
  else (нет)
    :Показать «Запись открыта только на 30 дней вперёд»;
  endif
else (нет)
  :Показать «Онлайн-запись закрыта, позвоните на станцию»;
endif
stop
@enduml`;
  const MG = parseFC(MAIN);
  // путь по схеме для параметров
  function tracePath(h, d, ns) {
    const P = new Set(['n:S', 'n:IN', 'n:D', 'n:Q1', 'n:E']), ek = (a, b) => 'e:' + MG.edges.find(e => e.from === a && e.to === b).i;
    P.add(ek('S', 'IN')); P.add(ek('IN', 'D')); P.add(ek('D', 'Q1'));
    let end;
    if (h < 2) { P.add(ek('Q1', 'R1')); P.add('n:R1'); P.add(ek('R1', 'E')); end = 'R1'; }
    else { P.add(ek('Q1', 'Q2')); P.add('n:Q2'); if (d > 30) { P.add(ek('Q2', 'R2')); P.add('n:R2'); P.add(ek('R2', 'E')); end = 'R2'; } else { P.add(ek('Q2', 'Q3')); P.add('n:Q3'); if (ns >= 2) { P.add(ek('Q3', 'P1')); P.add('n:P1'); P.add(ek('P1', 'E')); end = 'P1'; } else { P.add(ek('Q3', 'P2')); P.add('n:P2'); P.add(ek('P2', 'E')); end = 'P2'; } } }
    return { P, end };
  }
  const ENDS = { R1: 'Отказ: до начала меньше 2 часов (BR-2) — клиенту предлагают позвонить на станцию.', R2: 'Отказ: дальше 30 дней (BR-2) — запись ещё не открыта.', P1: 'Запись создана в статусе «Ждёт предоплаты»: после двух неявок подряд — предоплата 500 ₽ (BR-4).', P2: 'Запись создана сразу «Подтверждена».' };

  /* =====================================================================
     ТЕОРИЯ
     ===================================================================== */
  const GL = {
    doc: '<svg width="70" height="40" viewBox="0 0 70 40" aria-hidden="true"><path d="M4 4 H66 V30 C50 22 36 40 20 32 C14 29 8 30 4 32 Z" style="fill:var(--surface);stroke:var(--text-2);stroke-width:1.5"/></svg>',
    conn: '<svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="14" style="fill:var(--surface);stroke:var(--text-2);stroke-width:1.5"/><text x="20" y="25" text-anchor="middle" style="fill:var(--text);font-size:13px;font-weight:700">А</text></svg>',
    loop: '<svg width="80" height="40" viewBox="0 0 80 40" aria-hidden="true"><path d="M14 4 H66 L76 14 V36 H4 V14 Z" style="fill:var(--surface);stroke:var(--text-2);stroke-width:1.5"/></svg>'
  };
  const SHAPES = [
    { k: 'term', t: 'Терминатор', html: '<b>Скруглённая фигура</b> — начало и конец алгоритма. На схеме ровно одно «Начало»; «Конец» тоже лучше один — все ветки сходятся к нему.' },
    { k: 'io', t: 'Данные (ввод и вывод)', html: '<b>Параллелограмм</b> — данные приходят или уходят: клиент выбрал дату и время, система показала сообщение «Онлайн-запись закрыта». Не путайте с действием системы.' },
    { k: 'proc', t: 'Процесс', html: '<b>Прямоугольник</b> — одно действие: «Создать запись „Подтверждена“». Одно действие — одна фигура, глагол и объект.' },
    { k: 'sub', t: 'Предопределённый процесс', html: '<b>Прямоугольник с двойными боковыми линиями</b> — шаг, который подробно описан на отдельной схеме: «Посчитать длительность по BR-1». Так схема остаётся короткой.' },
    { k: 'dec', t: 'Решение', html: '<b>Ромб</b> — вопрос, на который есть ответы «да / нет» (или несколько вариантов). Каждый выход подписан, ответы не пересекаются: «до начала не меньше 2 часов?» — да или нет, без «может быть».' },
    { k: 'doc', t: 'Документ', html: `<div class="m5f-glyph">${GL.doc}<span><b>Прямоугольник с волнистым низом</b> — бумажный или файловый документ: заказ-наряд, акт приёма, чек.</span></div>` },
    { k: 'conn', t: 'Соединитель', html: `<div class="m5f-glyph">${GL.conn}<span><b>Кружок с буквой</b> — продолжение схемы в другом месте или на другой странице: линия обрывается в «А» и продолжается из «А». Спасает от длинных пересекающихся стрелок.</span></div>` },
    { k: 'loop', t: 'Граница цикла', html: `<div class="m5f-glyph">${GL.loop}<span><b>Фигура со срезанными углами</b> — начало и конец цикла по ГОСТ. На практике цикл часто рисуют проще: ромб и стрелка назад, как в разделе про правила.</span></div>` }
  ];
  const howShapes = {
    id: 'how-fc-shapes', covers: ['shapes'], title: 'Как это работает: фигуры блок-схемы по ГОСТ 19.701', free: true, noReset: true,
    simple: { icon: '🔷', title: 'Простыми словами', plain: 'Блок-схема — алгоритм в картинке: шаги по порядку и вопросы с ответами «да / нет». У каждой фигуры свой смысл: овал — начало и конец, прямоугольник — действие, ромб — вопрос.', analogy: 'Рецепт омлета: начало → взять яйца (ввод) → взбить (действие) → «молоко есть?» (вопрос) → да: добавить; нет: пропустить → пожарить → конец. Блок-схему понимает и повар, и программист.', tech: 'ГОСТ 19.701-90 (ISO 5807-85) «Схемы алгоритмов, программ, данных и систем. Условные обозначения и правила выполнения». В Mermaid — диаграмма flowchart, в PlantUML блок-схему рисуют диаграммой деятельности.' },
    render(el) {
      el.classList.add('m5f-root');
      let cur = 'dec';
      function draw() {
        const sh = SHAPES.find(x => x.k === cur);
        el.innerHTML = `<div class="m5f-root"><p>Как приложение решает, можно ли записаться онлайн на выбранное время (BR-1, BR-2, BR-4). Нажмите на фигуру или на название.</p>
          <div class="m5f-chips" role="group" aria-label="Фигуры">${SHAPES.map(x => `<button type="button" class="chip" data-sh="${x.k}" aria-pressed="${x.k === cur}">${esc(x.t)}</button>`).join('')}</div>
          <div class="m5f-two"><div class="m5f-board">${fcSVG(MG, { hl: cur, label: 'Можно ли записаться онлайн' })}</div>
          <div class="stack"><div class="m5f-info" aria-live="polite"><b>${esc(sh.t)}</b><div>${sh.html}</div></div>
            ${ui.note('warn', 'Частые ошибки', 'Ромб без подписей на выходах; ромб без вопроса («Проверить время»); в прямоугольнике три действия через запятую; ветка, которая никуда не ведёт (тупик); стрелки пересекаются так, что схему не прочитать.')}
            ${ui.note('', 'Как спросят на собеседовании', '«Чем блок-схема отличается от BPMN?» — Блок-схема показывает алгоритм без участников и событий, её понимает любой. BPMN — бизнес-процесс по стандарту: кто что делает в дорожках, события, сообщения между организациями.')}</div></div></div>`;
      }
      TR.on(el, 'click', '[data-sh]', (e, b) => { cur = b.dataset.sh; draw(); });
      TR.on(el, 'click', '[data-kind]', (e, g) => { cur = g.dataset.kind; draw(); });
      draw();
    }
  };

  const howTrace = {
    id: 'how-fc-trace', covers: ['trace'], title: 'Как это работает: пройдите по схеме — каждый путь это тест', free: true, noReset: true,
    simple: { icon: '🧭', title: 'Простыми словами', plain: 'Блок-схему можно «пройти пальцем»: подставляете данные и на каждом ромбе выбираете ветку. Сколько разных путей от начала до конца — столько минимум тестов нужно тестировщику.', analogy: 'Как навигатор: от точки А в точку Б несколько маршрутов. Чтобы убедиться, что все дороги открыты, надо проехать каждый.', tech: 'Покрытие ветвей (branch coverage): каждый выход каждого ромба должен сработать хотя бы в одном тесте. На границах условий («не меньше 2 часов») берут значения ровно на границе и рядом — это анализ граничных значений (ISTQB).' },
    render(el) {
      el.classList.add('m5f-root');
      let h = 26, d = 1, ns = 0;
      function draw() {
        const tr = tracePath(h, d, ns), stop = tr.end === 'R1' || tr.end === 'R2';
        el.innerHTML = `<div class="m5f-root"><p>Подвигайте ползунки — схема подсветит путь, по которому пройдёт запись.</p>
          <div class="m5f-two"><div class="stack"><div class="m5f-sl">
            <label>Часов до начала записи: <b data-v="h">${h}</b><input type="range" min="0" max="48" step="0.5" value="${h}" data-r="h" aria-label="Часов до начала"></label>
            <label>Дней вперёд: <b data-v="d">${d}</b><input type="range" min="0" max="40" step="1" value="${d}" data-r="d" aria-label="Дней вперёд"></label>
            <label>Неявок подряд у клиента: <b data-v="ns">${ns}</b><input type="range" min="0" max="3" step="1" value="${ns}" data-r="ns" aria-label="Неявок подряд"></label></div>
            <div class="m5f-out ${stop ? 'stop' : ''}" aria-live="polite">${esc(ENDS[tr.end])}</div>
            ${ui.note('info', 'Сколько тестов нужно', 'Путей от начала до конца четыре — значит, минимум четыре теста. Плюс граничные значения: ровно 2 часа (запись разрешена — «не меньше»), 1,5 часа (закрыта), ровно 30 дней (разрешена), 31 день (закрыта). Попробуйте их ползунками.')}</div>
            <div class="m5f-board">${fcSVG(MG, { path: tr.P, label: 'Путь по схеме' })}</div></div></div>`;
      }
      el.oninput = e => { const r = e.target.closest('[data-r]'); if (!r) return; const v = +r.value; if (r.dataset.r === 'h') h = v; if (r.dataset.r === 'd') d = v; if (r.dataset.r === 'ns') ns = v; const keep = r.dataset.r; draw(); const nr = el.querySelector(`[data-r="${keep}"]`); if (nr) nr.focus(); };
      draw();
    }
  };

  const LOOP = `flowchart TD
  S([Предложение отправлено клиенту]) --> W[Ждать ответа в приложении]
  W --> Q{Клиент ответил?}
  Q -- да --> A[Применить решение клиента]
  Q -- нет --> T{Прошло 20 минут?}
  T -- нет --> W
  T -- да --> C[Мастер звонит клиенту, BR-8]
  A --> E([Конец])
  C --> E`;
  const howRules = {
    id: 'how-fc-rules', covers: ['bugs', 'code'], title: 'Как это работает: правила хорошей блок-схемы, цикл и код', free: true, noReset: true,
    simple: { icon: '📏', title: 'Простыми словами', plain: 'Хорошую блок-схему читают сверху вниз, не задавая вопросов автору. У неё один вход и один выход, у каждого ромба подписаны все выходы, и из любой фигуры можно дойти до конца.', analogy: 'Как схема эвакуации: стрелки ведут к выходу из любой точки, тупиков нет, на развилках написано, куда идти.', tech: 'Правила ГОСТ 19.701: поток сверху вниз и слева направо, линии не пересекаются (иначе — соединители), у решения подписаны выходы. Цикл — ромб-условие и линия возврата; у цикла обязательно есть условие выхода.' },
    render(el) {
      el.classList.add('m5f-root');
      let lang = 'mm';
      function draw() {
        el.innerHTML = `<div class="m5f-root">
          <div class="m5f-two"><div class="stack"><div class="card"><b>Чек-лист блок-схемы</b><ul style="margin:0;padding-left:18px;display:grid;gap:4px;font-size:14px">
            <li>Одно «Начало», все ветки приходят к «Концу» — тупиков нет</li>
            <li>В ромбе — вопрос, все выходы подписаны, ответы не пересекаются</li>
            <li>Одна фигура — одно действие, глагол и объект</li>
            <li>Числа совпадают с правилами (BR-2: 2 часа и 30 дней)</li>
            <li>Поток сверху вниз, линии не пересекаются</li>
            <li>У каждого цикла есть условие выхода</li>
            <li>Подробности — в предопределённый процесс на отдельной схеме</li></ul></div>
            ${ui.note('info', 'Цикл', 'Справа — ожидание ответа клиента по BR-8: «прошло 20 минут?» — нет → снова ждать. Стрелка возврата идёт назад, а выход из цикла — ветка «да». Цикл без выхода — бесконечный: мастер так и не позвонит.')}</div>
            <div class="m5f-board">${fcSVG(LOOP, { label: 'Цикл ожидания ответа' })}</div></div>
          <div class="eyebrow">Схема записи кодом</div>
          <div class="row">${ui.seg('m5f-lang', [{ v: 'mm', t: 'Mermaid' }, { v: 'pu', t: 'PlantUML' }], lang)}</div>
          ${ui.code(lang === 'mm' ? MAIN : MAIN_PU, 'text')}
          <p class="small dim">${lang === 'mm' ? 'Mermaid: ([…]) — терминатор, […] — процесс, {…} — решение, [/…/] — ввод и вывод, [[…]] — предопределённый процесс. Связь: A --> B, с подписью: A -- да --> B. Идентификаторы — латиницей.' : 'PlantUML: отдельной блок-схемы нет, её пишут диаграммой деятельности: :действие; — шаг, if (…) then (да) … else (нет) … endif — решение. Фигуры ГОСТ (параллелограмм, двойные линии) PlantUML не передаёт — все шаги рисуются одинаково. Нужны точные фигуры ГОСТ — берите Mermaid или draw.io.'}</p>
          ${ui.note('', 'Как спросят на собеседовании', '«Как проверить блок-схему на полноту?» — Пройти все пути от начала до конца, проверить, что у каждого ромба подписаны все выходы и нет тупиков, сверить числа с правилами. Для сложных условий удобнее таблица решений.')}</div>`;
      }
      TR.on(el, 'click', '[data-seg="m5f-lang"] button', (e, b) => { lang = b.dataset.v; draw(); });
      draw();
    }
  };

  /* =====================================================================
     ПРАКТИКА
     ===================================================================== */

  /* ---------- 1. Какая фигура ---------- */
  const SH_CH = [{ v: 'term', t: 'Терминатор' }, { v: 'io', t: 'Данные (ввод и вывод)' }, { v: 'proc', t: 'Процесс' }, { v: 'sub', t: 'Предопределённый процесс' }, { v: 'dec', t: 'Решение' }, { v: 'doc', t: 'Документ' }, { v: 'conn', t: 'Соединитель' }, { v: 'loop', t: 'Граница цикла' }];
  const SHQ = [
    { id: 'q1', t: 'Конец', a: 'term' },
    { id: 'q2', t: 'Клиент ввёл номер телефона', a: 'io' },
    { id: 'q3', t: 'До начала записи не меньше 3 часов?', a: 'dec' },
    { id: 'q4', t: 'Перевести запись в статус «Отменена»', a: 'proc' },
    { id: 'q5', t: 'Рассчитать предоплату — по отдельной схеме', a: 'sub' },
    { id: 'q6', t: 'Распечатать заказ-наряд для подписи клиента', a: 'doc' },
    { id: 'q7', t: 'Метка «А»: схема продолжается на следующей странице', a: 'conn' },
    { id: 'q8', t: 'Показать клиенту сообщение «Время уже заняли»', a: 'io' }
  ];
  const SH_WHY = { term: 'начало или конец алгоритма', io: 'данные приходят от человека или уходят к нему', proc: 'одно действие системы', sub: 'шаг описан на отдельной схеме', dec: 'вопрос с ответами «да / нет»', doc: 'бумажный документ', conn: 'продолжение схемы в другом месте', loop: 'начало и конец цикла' };
  function shEval(v) { v = v || {}; const good = SHQ.filter(x => v[x.id] === x.a).length; return { good, score: good / SHQ.length }; }
  const taskShapes = {
    id: 'shapes', title: 'Какой фигурой нарисовать шаг',
    simple: howShapes.simple,
    lead: ui.brief({
      situation: 'Марина Олеговна хочет памятку для новой администраторши «как отменять записи». Вера: «Нарисуем блок-схему, но сначала договоримся, какой фигурой какой шаг. По ГОСТу».',
      todo: ['Для каждого шага выберите фигуру ГОСТ 19.701.', 'Нажмите «Проверить». Засчитывается, если верно хотя бы 7 из 8.'],
      lookTitle: 'Подсказка', look: 'Человек ввёл или увидел — данные (параллелограмм). Система сделала — процесс. Вопрос — ромб. Описано отдельно — предопределённый процесс. Бумага — документ.'
    }),
    blank: () => ({ v: {} }),
    reference: () => ({ v: Object.fromEntries(SHQ.map(x => [x.id, x.a])) }),
    render(el, ctx) {
      el.classList.add('m5f-root');
      const a = ctx.ans; a.v = a.v || {};
      let rv = null;
      if (ctx.result) { rv = {}; SHQ.forEach(x => { if (a.v[x.id]) rv[x.id] = a.v[x.id] === x.a ? { s: 'ok', why: `Верно: ${esc(SH_WHY[x.a])}.` } : { s: 'bad', why: `Нужна фигура «${esc(SH_CH.find(c => c.v === x.a).t)}»: ${esc(SH_WHY[x.a])}.` }; }); }
      el.innerHTML = '<div data-m></div>';
      ui.match(TR.$('[data-m]', el), { rows: SHQ.map(x => ({ id: x.id, t: '«' + esc(x.t) + '»' })), choices: SH_CH, value: a.v, readonly: ctx.readonly, reveal: rv, placeholder: 'Какая фигура?', onChange: v => { a.v = v; ctx.save(); } });
    },
    check(ans) {
      const v = (ans && ans.v) || {}, r = shEval(v), notes = [];
      SHQ.forEach(x => { if (!v[x.id]) notes.push({ ok: false, html: `Не выбрано: «${esc(x.t)}».` }); else if (v[x.id] !== x.a) notes.push({ ok: false, html: `«${esc(x.t)}» — ${esc(SH_CH.find(c => c.v === x.a).t.toLowerCase())}: ${esc(SH_WHY[x.a])}.` }); });
      if (r.good === SHQ.length) notes.push({ ok: true, html: 'Все восемь фигур выбраны верно.' });
      return { ok: r.good >= 7, score: r.score, notes, summary: `Верно ${r.good} из ${SHQ.length}.`, mentor: r.good >= 7 ? null : 'Самая частая путаница — ввод-вывод и процесс. Если шаг — это данные от человека или к нему, это параллелограмм; если система что-то делает — прямоугольник.' };
    },
    explain: `<p>Терминатор — начало и конец. Параллелограмм — данные: ввод телефона и показ сообщения клиенту. Прямоугольник — одно действие системы. Прямоугольник с двойными боковыми линиями — шаг, который раскрыт на отдельной схеме, например расчёт предоплаты. Ромб — вопрос. Документ — бумажный заказ-наряд. Соединитель — продолжение схемы в другом месте.</p>
      <p>Правильные фигуры помогают читать схему с одного взгляда: где система ждёт человека, где решает, где работает сама. Источник: ГОСТ 19.701-90, раздел 3 «Описание символов».</p>`,
    refNote: 'Засчитывается от 7 верных из 8.',
    report: ans => { const r = shEval((ans && ans.v) || {}); return `- Фигуры: ${r.good}/${SHQ.length}`; }
  };

  /* ---------- 2. Лаборатория: Лиза гоняет тесты ---------- */
  const OUTS = [{ v: 'R1', t: 'Отказ: меньше 2 часов' }, { v: 'R2', t: 'Отказ: дальше 30 дней' }, { v: 'P1', t: 'Запись «Ждёт предоплаты»' }, { v: 'P2', t: 'Запись «Подтверждена»' }];
  const CASES = [
    { id: 'c1', meta: 'до начала 26 ч · вперёд 1 день · неявок 0', t: 'Елена записывается на завтра на 12:00.', h: 26, d: 1, ns: 0, bad: 'Обычная запись, все условия выполнены — её должны подтвердить сразу.' },
    { id: 'c2', meta: 'до начала 1,5 ч · вперёд 0 дней · неявок 0', t: 'Клиент в 10:30 пытается записаться на сегодня на 12:00.', h: 1.5, d: 0, ns: 0, bad: 'Меньше двух часов (BR-2): мастер не успеет подготовить пост и запчасти — онлайн-запись закрыта.' },
    { id: 'c3', meta: 'до начала 2 ч ровно · вперёд 0 дней · неявок 1', t: 'Клиент в 10:00 записывается на 12:00.', h: 2, d: 0, ns: 1, bad: 'Граница включительно: «не меньше 2 часов» — значит, ровно 2 часа можно. Отказ — потерянный клиент; а одна неявка — ещё не две подряд.' },
    { id: 'c4', meta: 'до начала 5 дней · вперёд 5 дней · неявок 2', t: 'Рустам записывает машину «Шашки», у которой две неявки подряд.', h: 120, d: 5, ns: 2, bad: 'Две неявки подряд — запись только с предоплатой 500 ₽ (BR-4). Без неё пост снова может простоять.' },
    { id: 'c5', meta: 'вперёд 30 дней ровно · неявок 0', t: 'Клиент заранее записывается на переобувку ровно через 30 дней.', h: 720, d: 30, ns: 0, bad: 'Граница включительно: «не дальше 30 дней» — 30 дней можно. Отказ здесь — самая обидная ошибка в сезон.' },
    { id: 'c6', meta: 'вперёд 31 день · неявок 2', t: 'Клиент с двумя неявками подряд пытается записаться через 31 день.', h: 744, d: 31, ns: 2, bad: 'Раньше всего срабатывает проверка 30 дней: до вопроса о неявках дело не доходит — запись просто ещё не открыта.' }
  ];
  const caseEnd = c => tracePath(c.h, c.d, c.ns).end;
  function caseEval(v) { v = v || {}; const good = CASES.filter(c => v[c.id] === caseEnd(c)).length; return { good, score: good / CASES.length }; }
  const taskTrace = {
    id: 'trace', title: 'Лаборатория: Лиза гоняет тесты по схеме',
    simple: howTrace.simple,
    lead: ui.brief({
      situation: 'Лиза проверяет онлайн-запись по блок-схеме из теории: «Скажи, чем закончится каждый тест. Если схема и твой ответ разойдутся — значит, кто-то из нас не понял правило».',
      todo: ['Для каждого теста выберите, чем закончится путь по схеме.', 'Нажмите «Проверить» — увидите путь и последствия ошибки.', 'Засчитывается, если верно хотя бы 5 из 6.'],
      lookTitle: 'Подсказка', look: 'Проверки идут по порядку: сначала 2 часа, потом 30 дней, потом неявки. Границы включительно: «не меньше 2 часов» и «не дальше 30 дней».'
    }),
    blank: () => ({ v: {} }),
    reference: () => ({ v: Object.fromEntries(CASES.map(c => [c.id, caseEnd(c)])) }),
    render(el, ctx) {
      el.classList.add('m5f-root');
      const a = ctx.ans; a.v = a.v || {};
      const shown = !!ctx.result || ctx.readonly, ev = caseEval(a.v);
      let sel = shown ? CASES.find(c => a.v[c.id] !== caseEnd(c)) || CASES[0] : null;
      el.innerHTML = `<div class="m5f-root">${shown ? `<div class="row"><b>Совпало со схемой: ${ev.good} из ${CASES.length}</b>${ui.meter(ev.score)}</div>` : ''}
        <div class="m5f-two"><div class="stack">${CASES.map((c, i) => { const v = a.v[c.id], right = caseEnd(c); return `<div class="m5f-case"><div><div class="meta">Тест ${i + 1} · ${esc(c.meta)}</div><div>${esc(c.t)}</div></div>
          <select data-cs="${c.id}" aria-label="Итог теста ${i + 1}" ${ctx.readonly ? 'disabled' : ''}><option value="">Чем закончится?</option>${OUTS.map(o => `<option value="${o.v}" ${v === o.v ? 'selected' : ''}>${esc(o.t)}</option>`).join('')}</select>
          ${shown ? (v === right ? `<div class="res ok">Верно. ${esc(ENDS[right])} <button type="button" class="btn sm ghost" data-show="${c.id}">Показать путь</button></div>` : `<div class="res bad">${v ? `«${esc(OUTS.find(o => o.v === v).t)}» — ` : 'Не выбрано. '}${esc(c.bad)} По схеме: ${esc(OUTS.find(o => o.v === right).t.toLowerCase())}. <button type="button" class="btn sm ghost" data-show="${c.id}">Показать путь</button></div>`) : ''}</div>`; }).join('')}</div>
          <div class="stack"><div class="m5f-board" data-b>${fcSVG(MG, shown && sel ? { path: tracePath(sel.h, sel.d, sel.ns).P, label: 'Путь теста' } : { label: 'Схема онлайн-записи' })}</div>${shown && sel ? `<div class="small dim" data-cap>Путь теста ${CASES.indexOf(sel) + 1}.</div>` : ''}</div></div></div>`;
      el.onchange = ctx.readonly ? null : e => { const s = e.target.closest('[data-cs]'); if (!s) return; if (s.value) a.v[s.dataset.cs] = s.value; else delete a.v[s.dataset.cs]; ctx.save(); const r = s.parentElement.querySelector('.res'); if (r) r.remove(); };
      el.onclick = e => { const b = e.target.closest('[data-show]'); if (!b) return; const c = CASES.find(x => x.id === b.dataset.show); TR.$('[data-b]', el).innerHTML = fcSVG(MG, { path: tracePath(c.h, c.d, c.ns).P, label: 'Путь теста' }); const cap = TR.$('[data-cap]', el); if (cap) cap.textContent = `Путь теста ${CASES.indexOf(c) + 1}.`; };
    },
    check(ans) {
      const v = (ans && ans.v) || {}, r = caseEval(v), notes = [];
      CASES.forEach((c, i) => { const right = caseEnd(c); notes.push(v[c.id] === right ? { ok: true, html: `Тест ${i + 1}: ${esc(OUTS.find(o => o.v === right).t.toLowerCase())} — верно.` } : { ok: false, html: `Тест ${i + 1}: по схеме — ${esc(OUTS.find(o => o.v === right).t.toLowerCase())}. ${esc(c.bad)}` }); });
      return { ok: r.good >= 5, score: r.score, notes, summary: `Верно ${r.good} из ${CASES.length}.`, mentor: r.good >= 5 ? null : 'Идите по схеме сверху вниз и на каждом ромбе честно отвечайте на вопрос. Границы включительно: ровно 2 часа и ровно 30 дней — можно.' };
    },
    explain: `<p>Четыре пути схемы — четыре исхода, и тесты Лизы покрывают каждый: обычная запись, меньше двух часов, дальше 30 дней, две неявки подряд. Тесты 3 и 5 — граничные значения: «не меньше 2 часов» и «не дальше 30 дней» включают границу. Тест 6 показывает порядок проверок: до вопроса о неявках дело не доходит, если запись ещё не открыта.</p>
      <p>Именно так блок-схема превращается в тест-кейсы: каждый путь — позитивный или негативный сценарий, каждая граница — отдельная проверка. Источники: ГОСТ 19.701-90; ISTQB Foundation, «анализ граничных значений» и «покрытие ветвей».</p>`,
    refNote: 'Засчитывается от 5 верных из 6.',
    report: ans => { const v = (ans && ans.v) || {}; return CASES.map((c, i) => `- Тест ${i + 1}: ${v[c.id] ? OUTS.find(o => o.v === v[c.id]).t : '—'}${v[c.id] === caseEnd(c) ? ' ✓' : ''}`).join('\n'); }
  };

  /* ---------- 3. Найдите ошибки ---------- */
  const DRAFT = `flowchart TD
  S([Начало]) --> T[/Время начала записи/]
  T --> Q1{Клиент приехал?}
  Q1 -- да --> A[Статус «Клиент приехал»]
  Q1 -- нет --> Q2{Прошло 10 минут после начала?}
  Q2 -- нет --> W[Подождать ещё минуту]
  Q2 -- да --> N[Статус «Неявка», освободить пост, выставить штраф 500 ₽]
  N --> Q3{Неявки клиента}
  Q3 --> P[Следующая онлайн-запись — только с предоплатой]
  A --> E([Конец])
  P --> E`;
  const DG = parseFC(DRAFT);
  const eKey = (a, b) => 'e:' + DG.edges.findIndex(e => e.from === a && e.to === b);
  const DITEMS = [
    { k: 'n:S', t: '«Начало»' },
    { k: 'n:T', t: 'Ввод: время начала записи' },
    { k: 'n:Q1', t: 'Ромб «Клиент приехал?» с выходами «да» и «нет»' },
    { k: 'n:Q2', t: 'Ромб «Прошло 10 минут после начала?»', err: 'Противоречит BR-4: неявка — через 15 минут после начала.' },
    { k: 'n:W', t: '«Подождать ещё минуту»', err: 'Тупик: из фигуры нет выхода. Нужна стрелка назад к «Клиент приехал?» — это цикл ожидания, иначе алгоритм застрянет.' },
    { k: 'n:N', t: '«Статус „Неявка“, освободить пост, выставить штраф 500 ₽»', err: 'Штрафа в правилах нет. По BR-4 после двух неявок подряд нужна предоплата 500 ₽, и она засчитывается в оплату. Придуманное правило попадёт в код и в претензии клиентов.' },
    { k: 'n:Q3', t: 'Ромб «Неявки клиента»', err: 'В ромбе не вопрос. Нужно: «Это вторая неявка подряд?»' },
    { k: eKey('Q3', 'P'), t: 'Из ромба «Неявки клиента» выходит одна стрелка без подписи', err: 'У решения должно быть не меньше двух подписанных выходов: «да» — предоплата, «нет» — к «Концу».' },
    { k: 'n:A', t: '«Статус „Клиент приехал“» → «Конец»' }
  ];
  const D_ERR = DITEMS.map((x, i) => x.err ? i : -1).filter(i => i >= 0);
  function dEval(m) { const s = new Set(m || []); const hit = D_ERR.filter(i => s.has(i)).length, wrong = [...s].filter(i => !D_ERR.includes(i)).length; return { hit, wrong, score: Math.max(0, (hit - wrong) / D_ERR.length) }; }
  const FIXED = `flowchart TD
  S([Начало]) --> T[/Время начала записи/]
  T --> Q1{Клиент приехал?}
  Q1 -- да --> A[Статус «Клиент приехал»]
  Q1 -- нет --> Q2{Прошло 15 минут после начала?}
  Q2 -- нет --> W[Подождать ещё минуту]
  W --> Q1
  Q2 -- да --> N[Статус «Неявка», освободить пост]
  N --> Q3{Это вторая неявка подряд?}
  Q3 -- да --> P[Следующая онлайн-запись — только с предоплатой 500 ₽]
  Q3 -- нет --> E([Конец])
  A --> E
  P --> E`;
  const taskBugs = {
    id: 'bugs', title: 'Найдите ошибки в блок-схеме неявки',
    simple: howRules.simple,
    lead: ui.brief({
      situation: 'Ника нарисовала для памятки, что делать, если клиент не приехал (BR-4). Марина Олеговна уже хочет распечатать. Вера: «Стоп. Пять ошибок — найди до печати».',
      todo: ['Отметьте в списке пункты с ошибками (номера совпадают с номерами на схеме).', 'Ошибок пять.', 'Нажмите «Проверить». Засчитывается, если найдены все пять и не больше одной лишней отметки.'],
      lookTitle: 'Подсказка', look: 'Сверьте числа с BR-4; проверьте, что из каждой фигуры есть выход; что в ромбах вопросы и у каждого ромба два подписанных выхода; что на схеме нет правил, которых нет в BR.'
    }),
    blank: () => ({ m: [] }),
    reference: () => ({ m: D_ERR.slice() }),
    render(el, ctx) {
      el.classList.add('m5f-root');
      const a = ctx.ans; a.m = a.m || [];
      const shown = !!ctx.result || ctx.readonly, nums = {}, marks = {};
      DITEMS.forEach((x, i) => { nums[x.k] = i + 1; if (shown) { const on = a.m.includes(i); marks[x.k] = on && x.err ? 'ok' : on && !x.err ? 'bad' : !on && x.err ? 'miss' : undefined; } });
      el.innerHTML = `<div class="m5f-root"><div class="m5f-two"><div class="m5f-board">${fcSVG(DG, { nums, marks, label: 'Черновик Ники' })}</div>
        <div class="stack"><div class="m5f-items">${DITEMS.map((x, i) => { const on = a.m.includes(i), cls = shown ? (on && x.err ? 'ok' : on && !x.err ? 'bad' : !on && x.err ? 'miss' : '') : ''; return `<button type="button" class="m5f-item ${cls}" data-bg="${i}" aria-pressed="${on}" ${ctx.readonly ? 'disabled' : ''}><span class="n">${i + 1}</span><span>${esc(x.t)}${shown && x.err ? `<div class="small" style="margin-top:4px;color:var(--text-2)">${esc(x.err)}</div>` : ''}</span></button>`; }).join('')}</div>
        <div class="small dim" data-cnt>Отмечено: ${a.m.length}.${shown ? ' Зелёные — найдено, красные — лишняя отметка, жёлтые — пропущено.' : ''}</div></div></div>
        ${shown ? `<div class="eyebrow">Исправленная схема</div><div class="m5f-two"><div class="m5f-board">${fcSVG(FIXED, { label: 'Исправленная схема' })}</div>${ui.code(FIXED, 'text')}</div>` : ''}</div>`;
      el.onclick = ctx.readonly ? null : e => {
        const b = e.target.closest('[data-bg]'); if (!b) return;
        const i = +b.dataset.bg; a.m = a.m.includes(i) ? a.m.filter(x => x !== i) : a.m.concat(i).sort((x, y) => x - y); ctx.save();
        b.setAttribute('aria-pressed', String(a.m.includes(i))); b.classList.remove('ok', 'bad', 'miss');
        const c = TR.$('[data-cnt]', el); if (c) c.textContent = `Отмечено: ${a.m.length}.`;
      };
    },
    check(ans) {
      const m = (ans && ans.m) || [], r = dEval(m), notes = [];
      D_ERR.forEach(i => notes.push({ ok: m.includes(i), html: `${i + 1}. ${esc(DITEMS[i].err)}${m.includes(i) ? '' : ' — пропущено.'}` }));
      m.filter(i => !D_ERR.includes(i)).forEach(i => notes.push({ ok: false, html: `${i + 1}. «${esc(DITEMS[i].t)}» — здесь всё верно.` }));
      return { ok: r.hit === D_ERR.length && r.wrong <= 1, score: r.score, notes, summary: `Найдено ${r.hit} из ${D_ERR.length}, лишних: ${r.wrong}.`, mentor: r.hit === D_ERR.length ? (r.wrong > 1 ? 'Ошибки найдены, но отмечены и верные шаги. Перед правкой сверяйте с правилом.' : null) : 'Пройдите чек-лист: числа из BR-4, выход из каждой фигуры, вопрос в каждом ромбе и два подписанных выхода, нет ли правил «от себя».' };
    },
    explain: `<p>Пять ошибок: 10 минут вместо 15 (BR-4); тупик «Подождать ещё минуту» — нужен цикл назад к вопросу «Клиент приехал?»; выдуманный штраф — в правилах только предоплата, и она засчитывается в оплату; ромб «Неявки клиента» без вопроса; у этого ромба один выход без подписи — нет ветки «нет».</p>
      <p>Схема для персонала — та же постановка: администратор будет выполнять её буквально. Тупик — это человек, который не знает, что делать дальше, а придуманный штраф — конфликт с клиентом. Источник: ГОСТ 19.701-90, раздел 4 «Правила применения символов».</p>`,
    refNote: 'Засчитывается, если найдены все пять ошибок и не больше одной лишней отметки.',
    report: ans => { const r = dEval((ans && ans.m) || []); return `- Найдено ошибок: ${r.hit}/${D_ERR.length}, лишних: ${r.wrong}`; }
  };

  /* ---------- 4. Правило BR-9 кодом Mermaid ---------- */
  const CODE_START = `flowchart TD
  S([Механик нашёл проблему]) --> IN[/Мастер-приёмщик сформировал предложение с ценой/]
  IN --> Q1{Клиент корпоративный?}
  %% допишите ветки и решения

  E([Конец])`;
  const CODE_REF = `flowchart TD
  S([Механик нашёл проблему]) --> IN[/Мастер-приёмщик сформировал предложение с ценой/]
  IN --> Q1{Клиент корпоративный?}
  Q1 -- нет --> C[Согласует клиент в приложении]
  Q1 -- да --> Q2{Сумма не больше лимита договора?}
  Q2 -- да --> AUTO[Согласовать автоматически]
  Q2 -- нет --> ZG[Согласует завгар в кабинете компании]
  C --> E([Конец])
  AUTO --> E
  ZG --> E`;
  const nodesOf = g => g.order.map(id => g.nodes[id]);
  const FFEATS = [
    { t: 'Первая строка — flowchart TD', f: g => g.head },
    { t: 'Есть начало и конец — терминаторы ([…])', f: g => { const outs = new Set(g.edges.map(e => e.from)), ins = new Set(g.edges.map(e => e.to)); return nodesOf(g).some(n => n.kind === 'term' && !ins.has(n.id)) && nodesOf(g).some(n => n.kind === 'term' && !outs.has(n.id) && ins.has(n.id)); } },
    { t: 'Два решения: корпоративный ли клиент и укладывается ли сумма в лимит', f: g => { const ds = nodesOf(g).filter(n => n.kind === 'dec').map(n => TR.norm(n.t)); return ds.length >= 2 && ds.some(t => /корпорат/.test(t)) && ds.some(t => /лимит|3 ?000/.test(t)); } },
    { t: 'У каждого решения не меньше двух выходов, все подписаны', f: g => { const ds = nodesOf(g).filter(n => n.kind === 'dec'); return ds.length > 0 && ds.every(n => { const es = g.edges.filter(e => e.from === n.id); return es.length >= 2 && es.every(e => e.t); }); } },
    { t: 'Три исхода: автоматически, завгар, клиент в приложении', f: g => { const t = nodesOf(g).filter(n => n.kind !== 'dec').map(n => TR.norm(n.t)).join(' | '); return /автомат/.test(t) && /завгар/.test(t) && /клиент/.test(t.replace(/корпорат\w*/g, '')); } },
    { t: 'Нет тупиков: из каждой фигуры, кроме «Конца», есть выход', f: g => { const outs = new Set(g.edges.map(e => e.from)), ins = new Set(g.edges.map(e => e.to)); const bad = nodesOf(g).filter(n => !outs.has(n.id) && !(n.kind === 'term' && ins.has(n.id))); return g.order.length > 2 && bad.length === 0; } },
    { t: 'Все ветки приходят к «Концу»', f: g => { const ends = nodesOf(g).filter(n => n.kind === 'term' && !g.edges.some(e => e.from === n.id)).map(n => n.id); if (!ends.length) return false; const can = new Set(ends); let ch = true; while (ch) { ch = false; g.edges.forEach(e => { if (can.has(e.to) && !can.has(e.from)) { can.add(e.from); ch = true; } }); } return g.order.every(id => can.has(id)); } },
    { t: 'Код без ошибок разбора', f: g => g.order.length > 0 && !g.msgs.some(m => m.kind === 'bad') }
  ];
  function codeEval(text) { const g = parseFC(text); const on = FFEATS.map(f => !!f.f(g)); const n = on.filter(Boolean).length; return { g, on, n, score: n / FFEATS.length }; }
  const taskCode = {
    id: 'code', title: 'Нарисуйте правило BR-9 кодом Mermaid',
    lead: ui.brief({
      situation: 'Рустам из «Шашки» спрашивал, кто согласует доп. работы для их машин. Даша просит: «Положи блок-схему BR-9 в описание задачи в GitLab — Mermaid там нарисуется сам».',
      todo: ['Допишите блок-схему в Mermaid. Схема рисуется рядом, пока вы пишете.', 'Следите за признаками под редактором.', 'Нажмите «Проверить». Засчитывается, если выполнено 7 признаков из 8, включая «код без ошибок разбора».'],
      lookTitle: 'Подсказка', look: 'BR-9: корпоративные — до лимита договора (у «Шашки» 3 000 ₽) автоматически, дороже — согласует завгар в кабинете компании. Частный клиент согласует сам в приложении (BR-6). Ромб: Q2{Сумма не больше лимита договора?}; ветка: Q2 -- да --> AUTO[…].'
    }),
    blank: () => ({ text: '' }),
    reference: () => ({ text: CODE_REF }),
    render(el, ctx) {
      el.classList.add('m5f-root');
      const a = ctx.ans; if (!a.text && !ctx.readonly) a.text = CODE_START;
      el.innerHTML = `<div class="m5f-root"><div class="m5f-two m5f-ed"><div class="stack"><textarea spellcheck="false" aria-label="Код блок-схемы Mermaid" ${ctx.readonly ? 'readonly' : ''}></textarea><div class="stack" data-pm aria-live="polite"></div></div><div class="m5f-board" data-out></div></div>
        <div class="eyebrow">Признаки</div><div class="m5f-feats" data-ft aria-live="polite"></div>
        <details class="small"><summary>Шпаргалка Mermaid flowchart</summary>${ui.code('flowchart TD\n  S([Начало]) --> A[/Данные/]\n  A --> Q{Вопрос?}\n  Q -- да --> B[Действие]\n  Q -- нет --> C[[Отдельная схема]]\n  B --> E([Конец])\n  C --> E', 'text')}</details></div>`;
      const ta = TR.$('textarea', el); ta.value = a.text || '';
      const upd = () => {
        const ev = codeEval(ta.value);
        TR.$('[data-ft]', el).innerHTML = FFEATS.map((f, i) => `<div class="m5f-feat ${ev.on[i] ? 'on' : ''}"><span class="mk">${ev.on[i] ? '✓' : '○'}</span><span>${esc(f.t)}</span></div>`).join('');
        TR.$('[data-pm]', el).innerHTML = ev.g.msgs.slice(0, 5).map(m => `<div class="m5f-pm ${m.kind === 'bad' ? '' : 'warn'}">${m.n ? `Строка ${m.n}: ` : ''}${esc(m.t)}</div>`).join('');
        TR.$('[data-out]', el).innerHTML = fcSVG(ev.g, { label: 'Ваша блок-схема' });
      };
      if (!ctx.readonly) ta.addEventListener('input', () => { a.text = ta.value; ctx.save(); upd(); });
      upd();
    },
    check(ans) {
      const ev = codeEval((ans && ans.text) || ''), notes = [];
      FFEATS.forEach((f, i) => notes.push({ ok: ev.on[i], html: esc(f.t) + (ev.on[i] ? '' : ' — не выполнено.') }));
      ev.g.msgs.filter(m => m.kind === 'bad').slice(0, 3).forEach(m => notes.push({ ok: false, html: `${m.n ? `Строка ${m.n}: ` : ''}${esc(m.t)}` }));
      const clean = ev.on[FFEATS.length - 1];
      return { ok: ev.n >= 7 && clean, score: ev.score, notes, summary: `Признаков: ${ev.n} из ${FFEATS.length}.`, mentor: ev.n >= 7 && clean ? null : !clean ? 'Сначала добейтесь, чтобы код разбирался: первая строка flowchart TD, идентификаторы латиницей, связи A --> B или A -- да --> B.' : 'Проверьте логику: два ромба (корпоративный? в пределах лимита?), три исхода и все ветки — к «Концу».' };
    },
    explain: `<p>В эталоне два ромба: «Клиент корпоративный?» и «Сумма не больше лимита договора?». Три исхода: частный клиент согласует сам в приложении (BR-6), корпоративный в пределах лимита — автоматически, дороже — завгар в кабинете компании (BR-9). Все ветки сходятся к «Концу», тупиков нет.</p>
      <p>В GitLab такой блок, вставленный в описание задачи как <code>\`\`\`mermaid</code>, рисуется сам — схема лежит рядом с задачей и обновляется вместе с ней. Если условий станет больше (лимит на машину и на месяц), удобнее перейти к таблице решений. Источники: mermaid.js.org/syntax/flowchart.html; ГОСТ 19.701-90.</p>`,
    refNote: 'Засчитывается любой корректный код Mermaid, если выполнено 7 признаков из 8.',
    report: ans => { const ev = codeEval((ans && ans.text) || ''); return `- Признаков: ${ev.n}/${FFEATS.length}\n\n\`\`\`\n${(ans && ans.text) || ''}\n\`\`\``; }
  };

  /* ---------- 5. Ответ Марине Олеговне ---------- */
  const J_RUBRIC = [
    'Объясняет, что на схеме видны все случаи сразу, в том числе редкие (меньше 2 часов, 31 день, две неявки), которые на словах легко забыть',
    'Говорит, что все администраторы на семи станциях будут действовать одинаково и не придумывать правила (как штраф в черновике)',
    'Упоминает, что новичок может пройти схему пальцем без помощи — это экономит время Марины Олеговны',
    'Говорит, что по той же схеме Лиза проверяет приложение: каждый путь — тест, и приложение ведёт себя так же, как администратор',
    'Отвечает просто и уважительно, без терминов вроде «терминатор» и «ветвление»'
  ];
  const J_REF = 'Марина Олеговна, на словах вы объясните отлично, но новенькая запомнит основное и забудет редкие случаи: что делать, если клиент записывается за полтора часа, через 31 день или у него две неявки подряд. На схеме все случаи видны сразу, и пройти её можно пальцем, не дёргая вас. Ещё важнее, что на всех семи станциях администраторы будут делать одинаково и не придумают своего — помните, в черновике Ники появился штраф, которого нет в правилах? И третье: по этой же схеме Лиза проверяет приложение, каждый путь — отдельная проверка. Значит, приложение и администратор у стойки отвечают клиенту одно и то же, и спорных ситуаций меньше.';
  const taskExplain = {
    id: 'explain', title: 'Объясните Марине Олеговне, зачем схема',
    lead: ui.brief({
      situation: 'Марина Олеговна: «Зачем мне эти ромбики? Я новенькой правила записи за пять минут на словах объясню».',
      todo: ['Ответьте своими словами, от 200 символов: что даёт схема ей, станциям и проверке приложения.', 'Проверьте ответ по рубрике (или попросите Веру).', 'Нажмите «Проверить». Засчитывается от 60 % по рубрике.'],
      lookTitle: 'Подсказка', look: 'Говорите на её языке: новенькая, редкие случаи, одинаково на всех станциях, меньше спорных ситуаций с клиентами.'
    }),
    blank: () => ({ j: {} }),
    reference: () => ({ j: { text: J_REF, self: J_RUBRIC.map(() => true) } }),
    render(el, ctx) {
      el.classList.add('m5f-root');
      const a = ctx.ans; a.j = a.j || {};
      el.innerHTML = `<div class="m5f-root">${ui.say('marina', 'Зачем мне эти ромбики? Я новенькой правила записи за пять минут на словах объясню.')}<div data-j></div></div>`;
      ui.justify(TR.$('[data-j]', el), {
        id: 'm5f-marina', q: 'Что ответить Марине Олеговне?',
        qPlain: 'Объясните управляющей станцией автосервиса, зачем нужна блок-схема правил онлайн-записи, если правила можно объяснить новой сотруднице на словах: что схема даёт ей, всем станциям и проверке приложения.',
        rubric: J_RUBRIC, reference: J_REF, value: a.j, readonly: ctx.readonly, minLen: 200,
        placeholder: 'Марина Олеговна, …',
        onChange: v => { a.j = v; ctx.save(); ctx.decide('Ответ Марине Олеговне: зачем блок-схема', v.text || ''); }
      });
    },
    check(ans) {
      const j = ui.justifyScore(ans && ans.j), notes = [];
      if (!j) notes.push({ ok: false, html: 'Ответ не написан или не оценён: от 200 символов, затем проверка по рубрике или с Верой.' });
      else notes.push({ ok: j >= 0.6 ? true : 'warn', html: `Ответ: ${pct(j)} по рубрике.${j < 0.6 ? ' Назовите редкие случаи и пользу для всех станций.' : ''}` });
      return { ok: j >= 0.6, score: j, notes, summary: `Ответ: ${pct(j)} по рубрике.`, mentor: j >= 0.6 ? null : 'Марине Олеговне не важна нотация. Ей важно, чтобы новенькая не ошиблась и все станции работали одинаково.' };
    },
    explain: `<p>Сильный ответ — про пользу для управляющей: редкие случаи не теряются, все станции работают одинаково, новичок разбирается сам, а приложение и администратор отвечают клиенту одно и то же, потому что их проверяют по одной схеме.</p>
      <p>Блок-схема — один из немногих артефактов аналитика, который одинаково понятен бизнесу, персоналу, разработчикам и тестировщикам. Источники: ГОСТ 19.701-90; BABOK v3, 10.35 «Process Modelling».</p>`,
    refNote: 'Оценивается по рубрике: самопроверка или проверка Claude.',
    report: ans => `- Ответ Марине Олеговне (${pct(ui.justifyScore(ans && ans.j))}): ${(ans && ans.j && ans.j.text) || '—'}`
  };

  TR.stage({
    id: ID,
    when: 'пятница, 19 февраля, 10:00 · правила записи для новой администраторши',
    intro: [
      { who: 'marina', html: 'К сезону берём новую администраторшу на «Победы». Мне нужна памятка: когда можно записать онлайн, когда только по телефону, что делать с неявками. Только чтобы без «ну, по ситуации».' },
      { who: 'liza', html: 'А мне по той же памятке проверять приложение. Если у администратора одно правило, а у приложения другое — клиенты будут ругаться на обоих.' },
      { who: 'vera', html: 'Сегодня — блок-схема по ГОСТ 19.701: фигуры, ветки, циклы. Нарисуем правила записи так, чтобы их поняла и новенькая, и Лиза, — и пройдём схему пальцем, как тест.' }
    ],
    glossary: [
      { term: 'Блок-схема', simple: 'Алгоритм в картинке: шаги и вопросы с ответами «да / нет».', tech: 'Схема алгоритма по ГОСТ 19.701-90 (ISO 5807-85); в Mermaid — flowchart.' },
      { term: 'Терминатор', simple: 'Скруглённая фигура: начало и конец.', tech: 'Символ «Терминатор» — вход из внешней среды и выход в неё.' },
      { term: 'Решение', simple: 'Ромб с вопросом и подписанными выходами.', tech: 'Символ «Решение»: один вход, несколько альтернативных выходов, условие на каждом.' },
      { term: 'Предопределённый процесс', simple: 'Шаг, расписанный на отдельной схеме.', tech: 'Символ с двойными боковыми линиями; в Mermaid — [[…]].' },
      { term: 'Граничное значение', simple: 'Значение ровно на границе правила: ровно 2 часа, ровно 30 дней.', tech: 'Boundary value analysis (ISTQB): тесты на границе и рядом с ней.' },
      { term: 'Тупик', simple: 'Фигура, из которой некуда идти дальше.', tech: 'Узел без исходящих связей, не являющийся терминатором, — ошибка схемы.' }
    ],
    outro: 'Памятка готова: администраторша проходит её пальцем, Лиза — тестами, и правила у стойки и в приложении совпадают. Следующее занятие — диаграмма классов: как описать понятия «Искры» и связи между ними.',
    tasks: [howShapes, howTrace, howRules, taskShapes, taskTrace, taskBugs, taskCode, taskExplain]
  });
})();
