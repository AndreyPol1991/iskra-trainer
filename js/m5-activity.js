/* Модуль 5, занятие 2: UML Activity — диаграмма деятельности.
   Теория: how-ac-basics — элементы нотации на схеме оплаты и выдачи «Искры» (начальный узел, действие, решение и
   слияние, развилка и слияние параллельных веток, дорожки, конечный узел; «нажмите на элемент»), бытовой пример —
   утро перед работой; how-ac-fork — пошаговый симулятор «по очереди или параллельно» с маркерами и счётчиком времени,
   ромб «одно из» против черты «все сразу»; how-ac-vs — activity, BPMN, блок-схема и sequence: что когда брать,
   синтаксис PlantUML (в Mermaid диаграммы деятельности нет).
   Практика: узнать элементы на схеме; лаборатория «по очереди, параллельно или одно из» с последствиями (BR-10, BR-11,
   54-ФЗ); ошибки в черновике выдачи машины; процесс оплаты кодом PlantUML с живой схемой и проверкой по признакам;
   ответ Глебу, зачем activity, если есть BPMN. */
'use strict';
(function () {
  const TR = window.TR, ui = TR.ui, esc = TR.esc;
  const ID = 'm5-activity';
  const pct = x => Math.round((x || 0) * 100) + ' %';

  if (!document.getElementById('m5a-css')) document.head.insertAdjacentHTML('beforeend', `<style id="m5a-css">
    .m5a-root { display: grid; gap: 14px; min-width: 0; }
    .m5a-root p { margin: 0; }
    .m5a-board { overflow-x: auto; border: 1px solid var(--border); border-radius: 12px; background: var(--surface-2); padding: 8px; }
    .m5a-board svg { display: block; margin: 0 auto; }
    .m5a-board [data-n] { cursor: pointer; }
    .m5a-chips { display: flex; flex-wrap: wrap; gap: 6px; }
    .m5a-chips .chip[aria-pressed="true"] { background: var(--accent); color: var(--accent-text); border-color: var(--accent); }
    .m5a-info { border: 1px solid var(--border); border-left: 4px solid var(--accent); border-radius: 10px; background: var(--surface); padding: 10px 14px; display: grid; gap: 6px; font-size: 14px; min-height: 60px; }
    .m5a-two { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 14px; align-items: start; }
    .m5a-ctl { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
    .m5a-clock { font: 600 14px var(--f-mono); color: var(--accent); }
    .m5a-tbl { width: 100%; border-collapse: collapse; font-size: 13.5px; }
    .m5a-tbl th, .m5a-tbl td { border-bottom: 1px solid var(--border); padding: 7px 8px; text-align: left; vertical-align: top; }
    .m5a-tbl th { color: var(--text-muted); font-size: 12.5px; }
    .m5a-scroll { overflow-x: auto; }
    .m5a-items { display: grid; gap: 6px; }
    .m5a-item { display: grid; grid-template-columns: 30px minmax(0, 1fr); gap: 8px; text-align: left; font: inherit; font-size: 14px; color: var(--text); background: var(--surface); border: 1px solid var(--border); border-radius: 9px; padding: 8px 10px; cursor: pointer; }
    .m5a-item .n { font: 700 12px var(--f-mono); color: var(--accent); }
    .m5a-item[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); }
    .m5a-item.ok { border-color: var(--ok); background: var(--ok-soft); }
    .m5a-item.bad { border-color: var(--bad); background: var(--bad-soft); }
    .m5a-item.miss { border-color: var(--warn); background: var(--warn-soft); }
    .m5a-item[disabled] { cursor: default; }
    .m5a-pair { display: grid; grid-template-columns: minmax(0, 1fr) minmax(170px, 240px); gap: 10px; align-items: center; border: 1px solid var(--border); border-radius: 12px; background: var(--surface); padding: 10px 12px; }
    .m5a-pair select { width: 100%; }
    .m5a-pair .ab { display: grid; gap: 2px; } .m5a-pair .ab b { font-weight: 600; }
    .m5a-pair .res { grid-column: 1 / -1; font-size: 13.5px; border-radius: 8px; padding: 6px 10px; }
    .m5a-pair .res.ok { background: var(--ok-soft); border-left: 3px solid var(--ok); }
    .m5a-pair .res.bad { background: var(--bad-soft); border-left: 3px solid var(--bad); }
    .m5a-ed textarea { width: 100%; min-height: 300px; box-sizing: border-box; font: 12.5px/1.55 var(--f-mono); font-variant-ligatures: none; font-feature-settings: "liga" 0, "calt" 0; background: var(--code-bg); color: var(--text); border: 1px solid var(--border); border-radius: 10px; padding: 10px; resize: vertical; }
    .m5a-feats { display: grid; gap: 4px; font-size: 13.5px; }
    .m5a-feat { display: grid; grid-template-columns: 22px minmax(0, 1fr); gap: 6px; }
    .m5a-feat .mk { font-weight: 700; color: var(--text-muted); } .m5a-feat.on .mk { color: var(--ok); }
    .m5a-pm { font-size: 12.5px; padding: 4px 8px; border-radius: 8px; background: var(--bad-soft); color: var(--bad); }
    .m5a-pm.warn { background: var(--warn-soft); color: var(--warn); }
    .m5a-root pre.code { font-variant-ligatures: none; font-feature-settings: "liga" 0, "calt" 0; }
    @media (max-width: 820px) { .m5a-two { grid-template-columns: minmax(0, 1fr); } .m5a-pair { grid-template-columns: minmax(0, 1fr); } }
  </style>`);

  /* =====================================================================
     Разбор подмножества PlantUML activity и рисование
     ===================================================================== */
  function parseAct(src) {
    const root = [], stack = [{ k: 'root', seq: root }], lanes = [], msgs = [];
    let lane = null, idx = 0, hasStart = false, hasEnd = false, any = false;
    const cur = () => stack[stack.length - 1].seq, top = () => stack[stack.length - 1];
    String(src || '').split(/\r?\n/).forEach((raw, i) => {
      const s = raw.trim(), n = i + 1;
      if (!s || s.startsWith("'")) return;
      if (/^@startuml$/i.test(s)) { hasStart = true; return; }
      if (/^@enduml$/i.test(s)) { hasEnd = true; return; }
      if (/^@end/i.test(s)) { msgs.push({ n, kind: 'bad', t: 'Закрывающая строка — ровно @enduml.' }); return; }
      let m;
      if ((m = s.match(/^\|([^|]+)\|$/))) { lane = m[1].trim(); if (!lanes.includes(lane)) lanes.push(lane); return; }
      if (/^start$/i.test(s)) { cur().push({ k: 'start', idx: idx++, lane }); any = true; return; }
      if (/^(stop|end)$/i.test(s)) { cur().push({ k: 'stop', idx: idx++, lane }); any = true; return; }
      if (/^(kill|detach)$/i.test(s)) { cur().push({ k: 'kill', idx: idx++, lane }); any = true; return; }
      if ((m = s.match(/^:(.*);$/))) { const t = m[1].trim(); if (!t) { msgs.push({ n, kind: 'bad', t: 'Пустое действие: напишите, что делаем.' }); return; } cur().push({ k: 'act', idx: idx++, t, lane }); any = true; return; }
      if (/^:/.test(s)) { msgs.push({ n, kind: 'bad', t: 'Действие заканчивается точкой с запятой: :Начислить бонусы;' }); return; }
      if ((m = s.match(/^if\s*\((.*)\)\s*then\s*(?:\((.*)\))?$/i))) { const node = { k: 'if', idx: idx++, cond: m[1].trim(), lane, branches: [{ label: (m[2] || '').trim(), seq: [] }] }; cur().push(node); stack.push({ k: 'if', node, seq: node.branches[0].seq }); any = true; return; }
      if ((m = s.match(/^elseif\s*\((.*)\)\s*then\s*(?:\((.*)\))?$/i))) { if (top().k !== 'if') { msgs.push({ n, kind: 'bad', t: 'elseif без if.' }); return; } const b = { label: (m[2] || m[1]).trim(), seq: [] }; top().node.branches.push(b); top().seq = b.seq; return; }
      if ((m = s.match(/^else\s*(?:\((.*)\))?$/i))) { if (top().k !== 'if') { msgs.push({ n, kind: 'bad', t: 'else без if.' }); return; } const b = { label: (m[1] || '').trim(), seq: [] }; top().node.branches.push(b); top().seq = b.seq; return; }
      if (/^endif$/i.test(s)) { if (top().k !== 'if') { msgs.push({ n, kind: 'bad', t: 'endif без if.' }); return; } stack.pop(); return; }
      if (/^fork$/i.test(s)) { const node = { k: 'fork', idx: idx++, lane, branches: [{ seq: [] }] }; cur().push(node); stack.push({ k: 'fork', node, seq: node.branches[0].seq }); any = true; return; }
      if (/^fork again$/i.test(s)) { if (top().k !== 'fork') { msgs.push({ n, kind: 'bad', t: 'fork again без fork.' }); return; } const b = { seq: [] }; top().node.branches.push(b); top().seq = b.seq; return; }
      if ((m = s.match(/^end (fork|merge)$/i))) { if (top().k !== 'fork') { msgs.push({ n, kind: 'bad', t: 'end fork без fork.' }); return; } top().node.merge = m[1].toLowerCase() === 'merge'; stack.pop(); return; }
      if (/^(repeat|while|endwhile|backward|note|partition|split|floating)\b/i.test(s)) { msgs.push({ n, kind: 'warn', t: `«${s.split(/\s/)[0]}» живая схема здесь не рисует, но PlantUML его понимает.` }); return; }
      msgs.push({ n, kind: 'bad', t: 'Строку не удалось разобрать. Действие: :Отправить чек;  Развилка: fork … fork again … end fork.' });
    });
    while (stack.length > 1) { const f = stack.pop(); msgs.push({ n: 0, kind: 'bad', t: f.k === 'if' ? 'Блок if не закрыт: нужна строка endif.' : 'Развилка не закрыта: нужна строка end fork.' }); }
    if (hasStart && !hasEnd) msgs.push({ n: 0, kind: 'bad', t: 'Нет последней строки @enduml.' });
    return { seq: root, lanes, msgs, any };
  }
  const walk = (seq, f) => seq.forEach(nd => { f(nd); if (nd.branches) nd.branches.forEach(b => walk(b.seq, f)); });
  function wrapT(t, max) { const w = String(t).split(/[ 	]+/), out = []; let line = ''; w.forEach(x => { if ((line + ' ' + x).trim().length > max && line) { out.push(line); line = x; } else line = (line + ' ' + x).trim(); }); if (line) out.push(line); return out.slice(0, 3); }
  const GAP = 18, BG = 26;
  function nsize(nd) {
    if (nd.k === 'start') return { w: 20, h: 20 };
    if (nd.k === 'stop' || nd.k === 'kill') return { w: 26, h: 26 };
    if (nd.k === 'act') { const ls = wrapT(nd.t, 26); nd._ls = ls; const w = Math.min(230, Math.max(120, Math.max(...ls.map(l => l.length)) * 6.9 + 30)); return { w, h: ls.length * 15 + 18 + (nd.lane ? 13 : 0) }; }
    const bs = nd.branches.map(b => ssize(b.seq)); nd._bs = bs;
    const inner = bs.reduce((a, b) => a + b.w, 0) + BG * (bs.length - 1);
    if (nd.k === 'if') { const cw = Math.min(240, String(nd.cond).length * 6.6 + 50); return { w: Math.max(inner, cw * 2 - 20, 90), h: 34 + 30 + Math.max(...bs.map(b => b.h)) + 28 + 26 }; }
    return { w: Math.max(inner, 80), h: 6 + 24 + Math.max(...bs.map(b => b.h)) + 24 + 6 };
  }
  function ssize(seq) { if (!seq.length) return { w: 40, h: 8 }; const ss = seq.map(nsize); seq.forEach((nd, i) => { nd._s = ss[i]; }); return { w: Math.max(...ss.map(s => s.w)), h: ss.reduce((a, s) => a + s.h, 0) + GAP * (seq.length - 1) }; }
  function actSVG(src, opt) {
    opt = opt || {};
    const res = typeof src === 'string' ? parseAct(src) : src, uid = 'm5a' + Math.random().toString(36).slice(2, 8);
    const size = ssize(res.seq), legendH = res.lanes.length ? 26 : 0;
    const W = Math.max(size.w + 60, 320), H = size.h + 36 + legendH;
    const laneC = l => { const i = res.lanes.indexOf(l); return i < 0 ? 'var(--text-muted)' : `var(--p${(i % 6) + 1})`; };
    const stroke = nd => { const mk = opt.marks && opt.marks[nd.idx]; return mk === 'ok' ? 'var(--ok)' : mk === 'bad' ? 'var(--bad)' : mk === 'miss' ? 'var(--warn)' : (opt.hl === nd.k || (opt.hl === 'if' && nd.k === 'merge')) ? 'var(--accent)' : 'var(--border-strong)'; };
    const sw = nd => (opt.hl === nd.k || (opt.marks && opt.marks[nd.idx])) ? 2.6 : 1.5;
    let s = `<svg viewBox="0 0 ${W} ${H}" width="100%" style="min-width:${Math.min(W, 420)}px;max-width:${W}px" role="img" aria-label="${esc(opt.label || 'Диаграмма деятельности')}"><defs><marker id="${uid}-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" style="fill:var(--text-2)"/></marker></defs>`;
    if (legendH) { let lx = 12; res.lanes.forEach(l => { const w = l.length * 6.8 + 22; s += `<g data-n="lane"><rect x="${lx}" y="6" width="${w}" height="18" rx="9" style="fill:var(--surface);stroke:${laneC(l)};stroke-width:${opt.hl === 'lane' ? 2.4 : 1.4}"/><text x="${lx + w / 2}" y="19" text-anchor="middle" style="fill:${laneC(l)};font-size:11px;font-weight:600">${esc(l)}</text></g>`; lx += w + 8; }); }
    const arrow = (x1, y1, x2, y2) => `<path d="M${x1} ${y1} V${y2}" style="fill:none;stroke:var(--text-2);stroke-width:1.4" marker-end="url(#${uid}-a)"/>`;
    const num = (nd, x, y) => opt.nums && opt.nums[nd.idx] ? `<circle cx="${x}" cy="${y}" r="9" style="fill:var(--accent)"/><text x="${x}" y="${y + 3.5}" text-anchor="middle" style="fill:var(--accent-text);font-size:10px;font-weight:700">${opt.nums[nd.idx]}</text>` : '';
    function drawSeq(seq, cx, y) {
      let prevBottom = null, yy = y;
      seq.forEach(nd => {
        const sz = nd._s;
        if (prevBottom != null) s += arrow(cx, prevBottom, cx, yy - 1);
        drawNode(nd, cx, yy, sz);
        prevBottom = yy + sz.h; yy += sz.h + GAP;
      });
      return seq.length ? prevBottom : y + 8;
    }
    function drawNode(nd, cx, y, sz) {
      const act = opt.active && opt.active.has(nd.idx);
      if (nd.k === 'start') { s += `<g data-n="start"><circle cx="${cx}" cy="${y + 10}" r="9" style="fill:${opt.hl === 'start' ? 'var(--accent)' : 'var(--text)'}"/>${num(nd, cx + 14, y)}</g>`; return; }
      if (nd.k === 'stop') { s += `<g data-n="stop"><circle cx="${cx}" cy="${y + 13}" r="11" style="fill:none;stroke:${opt.hl === 'stop' ? 'var(--accent)' : 'var(--text)'};stroke-width:1.8"/><circle cx="${cx}" cy="${y + 13}" r="6.5" style="fill:${opt.hl === 'stop' ? 'var(--accent)' : 'var(--text)'}"/>${num(nd, cx + 16, y)}</g>`; return; }
      if (nd.k === 'kill') { s += `<g data-n="stop"><circle cx="${cx}" cy="${y + 13}" r="11" style="fill:var(--surface);stroke:var(--text);stroke-width:1.8"/><path d="M${cx - 7} ${y + 6} L${cx + 7} ${y + 20} M${cx + 7} ${y + 6} L${cx - 7} ${y + 20}" style="stroke:var(--text);stroke-width:1.8"/></g>`; return; }
      if (nd.k === 'act') {
        const w = sz.w, x = cx - w / 2, lc = nd.lane ? laneC(nd.lane) : null;
        s += `<g data-n="act"><rect x="${x}" y="${y}" width="${w}" height="${sz.h}" rx="12" style="fill:${act ? 'var(--accent-soft)' : 'var(--surface)'};stroke:${act ? 'var(--accent)' : stroke(nd)};stroke-width:${act ? 2.6 : sw(nd)}"/>`;
        if (lc) s += `<rect x="${x + 1}" y="${y + 1}" width="5" height="${sz.h - 2}" rx="2" style="fill:${lc}"/><text x="${x + 14}" y="${y + 12}" style="fill:${lc};font-size:9.5px;font-weight:600">${esc(nd.lane)}</text>`;
        const t0 = y + (lc ? 13 : 0) + 14 + (sz.h - (lc ? 13 : 0) - nd._ls.length * 15 - 18) / 2 + 2;
        nd._ls.forEach((l, i) => { s += `<text x="${cx + (lc ? 3 : 0)}" y="${t0 + i * 15}" text-anchor="middle" style="fill:var(--text);font-size:12px">${esc(l)}</text>`; });
        s += num(nd, x + w - 2, y + 2) + '</g>'; return;
      }
      const bs = nd._bs, inner = bs.reduce((a, b) => a + b.w, 0) + BG * (bs.length - 1);
      let bx = cx - inner / 2; const centers = bs.map(b => { const c = bx + b.w / 2; bx += b.w + BG; return c; });
      if (nd.k === 'if') {
        const dy = y + 17, top = y + 34 + 30, bottom = y + sz.h - 26, my = y + sz.h - 13;
        s += `<g data-n="if"><polygon points="${cx},${y} ${cx + 17},${dy} ${cx},${y + 34} ${cx - 17},${dy}" style="fill:var(--surface);stroke:${stroke(nd)};stroke-width:${sw(nd)}"/><text x="${cx + 24}" y="${dy + 4}" style="fill:var(--text);font-size:11.5px;font-weight:600">${esc(nd.cond)}</text>${num(nd, cx - 24, y + 4)}</g>`;
        nd.branches.forEach((b, i) => {
          const c = centers[i];
          s += `<path d="M${cx} ${y + 34} V${y + 44} H${c} V${top - 1}" style="fill:none;stroke:var(--text-2);stroke-width:1.4" marker-end="url(#${uid}-a)"/>`;
          if (b.label) s += `<text x="${c + (c >= cx ? 6 : -6)}" y="${y + 58}" text-anchor="${c >= cx ? 'start' : 'end'}" style="fill:var(--text-2);font-size:10.5px;paint-order:stroke;stroke:var(--surface-2);stroke-width:4px">[${esc(b.label)}]</text>`;
          const end = drawSeq(b.seq, c, top);
          s += `<path d="M${c} ${end} V${bottom} H${cx}" style="fill:none;stroke:var(--text-2);stroke-width:1.4"/>`;
        });
        s += `<g data-n="if"><path d="M${cx} ${bottom} V${my - 12}" style="stroke:var(--text-2);stroke-width:1.4" marker-end="url(#${uid}-a)"/><polygon points="${cx},${my - 12} ${cx + 12},${my} ${cx},${my + 12} ${cx - 12},${my}" style="fill:var(--surface);stroke:${opt.hl === 'if' ? 'var(--accent)' : 'var(--border-strong)'};stroke-width:${opt.hl === 'if' ? 2.4 : 1.5}"/></g>`;
        return;
      }
      // развилка
      const barW = Math.max(60, inner - 10), top = y + 6 + 24, by2 = y + sz.h - 6, hlF = opt.hl === 'fork', fc = (opt.marks && opt.marks[nd.idx]) ? stroke(nd) : hlF ? 'var(--accent)' : 'var(--text)';
      s += `<g data-n="fork"><rect x="${cx - barW / 2}" y="${y}" width="${barW}" height="6" rx="2" style="fill:${fc}"/>${num(nd, cx + barW / 2 + 12, y + 2)}</g>`;
      nd.branches.forEach((b, i) => {
        const c = centers[i];
        s += `<path d="M${c} ${y + 6} V${top - 1}" style="fill:none;stroke:var(--text-2);stroke-width:1.4" marker-end="url(#${uid}-a)"/>`;
        const end = drawSeq(b.seq, c, top);
        s += `<path d="M${c} ${end} V${by2 - (nd.merge ? 18 : 1)}${nd.merge ? ` H${cx}` : ''}" style="fill:none;stroke:var(--text-2);stroke-width:1.4" ${nd.merge ? '' : `marker-end="url(#${uid}-a)"`}/>`;
      });
      if (nd.merge) s += `<g data-n="fork"><polygon points="${cx},${by2 - 18} ${cx + 12},${by2 - 6} ${cx},${by2 + 6} ${cx - 12},${by2 - 6}" style="fill:var(--surface);stroke:${fc};stroke-width:1.8"/></g>`;
      else s += `<g data-n="fork"><rect x="${cx - barW / 2}" y="${by2}" width="${barW}" height="6" rx="2" style="fill:${fc}"/></g>`;
    }
    drawSeq(res.seq, W / 2, 16 + legendH);
    return s + '</svg>';
  }
  // «Волны» исполнения: какие действия идут одновременно (для симулятора)
  function waves(seq) {
    const out = [];
    seq.forEach(nd => {
      if (nd.k === 'act' || nd.k === 'start' || nd.k === 'stop') out.push([nd]);
      else if (nd.k === 'if') waves(nd.branches[0].seq).forEach(w => out.push(w));
      else if (nd.k === 'fork') { const bw = nd.branches.map(b => waves(b.seq)), n = Math.max(...bw.map(x => x.length)); for (let i = 0; i < n; i++) out.push([].concat(...bw.map(x => x[i] || []))); }
    });
    return out;
  }
  const secOf = nd => { const m = nd.t && nd.t.match(/\((\d+)\s*с\)/); return m ? +m[1] : 0; };

  /* =====================================================================
     ТЕОРИЯ
     ===================================================================== */
  const PAY_FLOW = `@startuml
|Клиент|
start
:Нажать «Оплатить»;
|Платёжный сервис|
if (Способ оплаты?) then (онлайн)
  :Создать платёж в ЮKassa;
  :Получить вебхук «оплачено»;
else (касса станции)
  :Принять оплату на кассе;
endif
fork
  :Чек через онлайн-кассу (54-ФЗ);
fork again
  :Начислить бонусы 5 % (BR-11);
end fork
|Мастер-приёмщик|
:Выдать машину;
stop
@enduml`;
  const NOTIONS = [
    { k: 'start', t: 'Начальный узел', html: '<b>Чёрный кружок</b> — где деятельность начинается. Здесь — клиент нажимает «Оплатить» в приложении или подходит к кассе.' },
    { k: 'act', t: 'Действие', html: '<b>Скруглённый прямоугольник</b> — шаг, который кто-то выполняет. Название — глагол и объект: «Создать платёж в ЮKassa», а не «Платёж». Стрелки между действиями — <b>поток управления</b>: что за чем идёт.' },
    { k: 'if', t: 'Решение и слияние', html: '<b>Ромб с условиями</b> — выбирается <b>одна</b> ветка: [онлайн] или [касса станции] (BR-10). Подписи-условия на выходах обязательны и не должны пересекаться. Нижний ромб — слияние: ветки сходятся обратно.' },
    { k: 'fork', t: 'Развилка и слияние параллельных', html: '<b>Жирная черта</b> — дальше <b>все</b> ветки идут одновременно: чек и бонусы не ждут друг друга. Нижняя черта — слияние: процесс пойдёт дальше, только когда завершатся <b>все</b> ветки. Машину выдают после чека — так требует 54-ФЗ.' },
    { k: 'lane', t: 'Дорожки', html: '<b>Дорожки (partitions)</b> — кто выполняет действие: клиент, платёжный сервис, мастер-приёмщик. В PlantUML дорожки задаются строкой <code>|Клиент|</code> и рисуются колонками; здесь — цветной полосой у действия.' },
    { k: 'stop', t: 'Конечный узел', html: '<b>Кружок в кольце</b> — вся деятельность закончилась. Бывает ещё <b>конечный узел потока</b> — кружок с крестом (в PlantUML <code>kill</code>): заканчивается только одна ветка, остальные продолжают работу.' }
  ];
  const howBasics = {
    id: 'how-ac-basics', covers: ['elems'], title: 'Как это работает: действия, решения, развилки и дорожки', free: true, noReset: true,
    simple: { icon: '🔀', title: 'Простыми словами', plain: 'Диаграмма деятельности — это алгоритм в картинке: какие шаги, в каком порядке, где выбор «одно из», а что можно делать одновременно.', analogy: 'Утро перед работой: проснуться → если будни, поставить будильник на завтра, иначе спать дальше → параллельно: чайник кипит, вы принимаете душ → когда готово и то и другое, завтракаете. Ромб — выбор, черта — «одновременно», вторая черта — «ждём всех».', tech: 'UML 2.5.1, раздел 15 «Activities»: action, control flow, decision/merge, fork/join, activity partition, initial/final nodes. Семантика — движение «маркеров» (tokens): развилка размножает маркер, слияние параллельных ждёт все.' },
    render(el) {
      el.classList.add('m5a-root');
      let cur = 'fork';
      function draw() {
        const n = NOTIONS.find(x => x.k === cur);
        el.innerHTML = `<div class="m5a-root"><p>Оплата и выдача машины в «Искре» (BR-10, BR-11). Нажмите на понятие или на элемент схемы.</p>
          <div class="m5a-chips" role="group" aria-label="Элементы">${NOTIONS.map(x => `<button type="button" class="chip" data-nt="${x.k}" aria-pressed="${x.k === cur}">${esc(x.t)}</button>`).join('')}</div>
          <div class="m5a-two"><div class="m5a-board">${actSVG(PAY_FLOW, { hl: cur, label: 'Оплата и выдача машины' })}</div>
          <div class="stack"><div class="m5a-info" aria-live="polite"><b>${esc(n.t)}</b><div>${n.html}</div></div>
            ${ui.note('warn', 'Частые ошибки', 'Ромб без подписей на выходах; развилка без слияния — непонятно, ждём ли все ветки; действие без глагола («Чек»); перепутаны ромб и черта: оплата картой и наличными нарисованы «одновременно».')}
            ${ui.note('', 'Как спросят на собеседовании', '«Чем развилка отличается от решения?» — Решение (ромб) выбирает одну ветку по условию. Развилка (черта) запускает все ветки сразу, а слияние ждёт, пока завершатся все.')}</div></div></div>`;
      }
      TR.on(el, 'click', '[data-nt]', (e, b) => { cur = b.dataset.nt; draw(); });
      TR.on(el, 'click', '[data-n]', (e, g) => { cur = g.dataset.n; draw(); });
      draw();
    }
  };

  const SEQ_V = `start
:Вебхук «оплачено» (1 с);
:Чек через онлайн-кассу (3 с);
:Начислить бонусы (1 с);
:Push «Оплачено» (1 с);
stop`;
  const PAR_V = `start
:Вебхук «оплачено» (1 с);
fork
  :Чек через онлайн-кассу (3 с);
fork again
  :Начислить бонусы (1 с);
fork again
  :Push «Оплачено» (1 с);
end fork
stop`;
  const howFork = {
    id: 'how-ac-fork', covers: ['par'], title: 'Как это работает: по очереди или параллельно', free: true, noReset: true,
    simple: { icon: '⏱', title: 'Простыми словами', plain: 'Если шаги не зависят друг от друга, их можно делать одновременно — это быстрее. Если один шаг нужен для другого — строго по очереди. А если делается только что-то одно — это выбор.', analogy: 'На кухне: пока варится паста, вы режете салат — параллельно. Но соус не сделать, пока не обжарен лук — по очереди. А чай или кофе — выбор: оба сразу вы не пьёте.', tech: 'Маркер (token) на развилке размножается — по одному в каждую ветку. Слияние параллельных (join) пропускает дальше, только когда пришли маркеры из всех веток. Решение (decision) отправляет маркер ровно в одну ветку.' },
    render(el) {
      el.classList.add('m5a-root');
      const V = { seq: parseAct(SEQ_V), par: parseAct(PAR_V) };
      const W = { seq: waves(V.seq.seq), par: waves(V.par.seq) };
      const st = { seq: 0, par: 0 };
      const timeOf = (k, n) => W[k].slice(0, n).reduce((a, w) => a + Math.max(0, ...w.map(secOf)), 0);
      function draw() {
        const box = k => { const act = new Set((W[k][st[k] - 1] || []).map(x => x.idx)); return `<div class="stack"><b>${k === 'seq' ? 'По очереди' : 'Параллельно: развилка и слияние'}</b><div class="m5a-board">${actSVG(V[k], { active: act, label: k === 'seq' ? 'По очереди' : 'Параллельно' })}</div><div class="m5a-ctl"><span class="m5a-clock">⏱ ${timeOf(k, st[k])} с</span><span class="small dim">шаг ${st[k]} из ${W[k].length}</span></div></div>`; };
        el.innerHTML = `<div class="m5a-root"><p>После вебхука ЮKassa платёжному сервису нужно отправить чек, начислить бонусы и прислать клиенту push. Нажимайте «Шаг» — оранжевым подсвечено то, что выполняется сейчас.</p>
          <div class="m5a-ctl"><button type="button" class="btn sm primary" data-step>Шаг →</button><button type="button" class="btn sm ghost" data-reset>⟲ Сначала</button></div>
          ${box('seq')}${box('par')}
          ${st.seq >= W.seq.length && st.par >= W.par.length ? ui.note('ok', 'Итог', `По очереди — ${timeOf('seq', W.seq.length)} с, параллельно — ${timeOf('par', W.par.length)} с: слияние ждёт самую долгую ветку (чек, 3 с), а не сумму всех. Клиент получает push сразу, а не после чека.`) : ''}
          ${ui.note('info', 'Ромб или черта?', 'Если на месте черты нарисовать ромб, выполнится <b>только одна</b> ветка: например, бонусы начислят, а чек не отправят. Если на месте ромба (онлайн или касса) нарисовать черту — клиент заплатит <b>дважды</b>. Поэтому вопрос аналитика к каждой паре шагов: «по очереди, одновременно или одно из?»')}</div>`;
      }
      TR.on(el, 'click', '[data-step]', () => { ['seq', 'par'].forEach(k => { if (st[k] < W[k].length) st[k]++; }); draw(); });
      TR.on(el, 'click', '[data-reset]', () => { st.seq = 0; st.par = 0; draw(); });
      draw();
    }
  };

  const CMP = [
    ['UML Activity', 'Алгоритм или процесс внутри системы, ветки и параллельность', 'Разработчики, аналитики', 'Что делает платёжный сервис после вебхука'],
    ['BPMN', 'Бизнес-процесс между людьми и организациями, события, сообщения', 'Бизнес, руководители, BPM-системы', 'Как станция согласует доп. работы с клиентом'],
    ['Блок-схема', 'Простой алгоритм без участников и параллельности (ГОСТ 19.701)', 'Все', 'Правило BR-4: нужна ли предоплата'],
    ['UML Sequence', 'Обмен сообщениями между участниками во времени', 'Разработчики', 'Кто кого вызывает при оплате и что при отказе банка']
  ];
  const howVs = {
    id: 'how-ac-vs', covers: ['bugs', 'code'], title: 'Как это работает: activity, BPMN, блок-схема — и код PlantUML', free: true, noReset: true,
    simple: { icon: '🧭', title: 'Простыми словами', plain: 'Диаграмма деятельности — «ИТ-шная» родственница BPMN и блок-схемы. Её берут, когда нужно показать логику с выбором и параллельными шагами для команды разработки.', analogy: 'BPMN — схема работы всего автосервиса для управляющей. Activity — инструкция, что делает касса после оплаты: её читает программист.', tech: 'Activity входит в UML 2.5 и хорошо пишется кодом: в PlantUML это основной синтаксис «новой» диаграммы деятельности. В Mermaid отдельной диаграммы деятельности нет — только блок-схема (flowchart) без развилок UML.' },
    render(el) {
      el.classList.add('m5a-root');
      el.innerHTML = `<div class="m5a-root">
        <div class="m5a-scroll"><table class="m5a-tbl"><thead><tr><th>Диаграмма</th><th>Что показывает</th><th>Кто читает</th><th>Пример на «Искре»</th></tr></thead><tbody>${CMP.map(r => `<tr><td><b>${esc(r[0])}</b></td><td>${esc(r[1])}</td><td>${esc(r[2])}</td><td>${esc(r[3])}</td></tr>`).join('')}</tbody></table></div>
        <div class="m5a-two"><div class="stack"><div class="eyebrow">Код схемы оплаты в PlantUML</div>${ui.code(PAY_FLOW, 'text')}</div>
          <div class="stack"><div class="card"><b>Шпаргалка PlantUML</b><ul style="margin:0;padding-left:18px;display:grid;gap:4px;font-size:14px">
            <li><code>start</code> и <code>stop</code> — начало и конец</li>
            <li><code>:Создать платёж;</code> — действие, точка с запятой в конце</li>
            <li><code>if (Условие?) then (да)</code> … <code>else (нет)</code> … <code>endif</code> — решение</li>
            <li><code>fork</code> … <code>fork again</code> … <code>end fork</code> — параллельные ветки</li>
            <li><code>|Клиент|</code> — дорожка: всё ниже выполняет клиент</li>
            <li><code>' комментарий</code></li></ul></div>
            ${ui.note('warn', 'Mermaid', 'Диаграммы деятельности в Mermaid нет. Похожую схему можно нарисовать блок-схемой <code>flowchart</code>, но без настоящих развилок и дорожек UML — поэтому в задании пишем на PlantUML.')}
            ${ui.note('', 'Как спросят на собеседовании', '«Когда вы возьмёте activity, а когда BPMN?» — BPMN — для процессов с бизнесом и между участниками, особенно если его будут исполнять в BPM-системе. Activity — для логики внутри системы и для разработчиков, особенно с параллельными шагами.')}</div></div></div>`;
    }
  };

  /* =====================================================================
     ПРАКТИКА
     ===================================================================== */

  /* ---------- 1. Узнайте элементы ---------- */
  const EL_CHOICES = [{ v: 'act', t: 'Действие' }, { v: 'dec', t: 'Решение (ромб)' }, { v: 'mrg', t: 'Слияние веток решения' }, { v: 'fork', t: 'Развилка (черта)' }, { v: 'join', t: 'Слияние параллельных (черта)' }, { v: 'lane', t: 'Дорожка' }, { v: 'start', t: 'Начальный узел' }, { v: 'stop', t: 'Конечный узел' }];
  const ELS = [
    { id: 'e1', t: 'Ромб после «Нажать „Оплатить“», выходы подписаны [онлайн] и [касса станции]', a: 'dec', why: 'Выбор одной ветки по условию — решение.' },
    { id: 'e2', t: 'Черта, после которой «Чек через онлайн-кассу» и «Начислить бонусы» идут одновременно', a: 'fork', why: 'Черта, из которой выходят параллельные ветки, — развилка.' },
    { id: 'e3', t: 'Черта перед «Выдать машину», в которую входят ветки чека и бонусов', a: 'join', why: 'Черта, которая ждёт все ветки, — слияние параллельных.' },
    { id: 'e4', t: '«Создать платёж в ЮKassa»', a: 'act', why: 'Глагол и объект — действие.' },
    { id: 'e5', t: 'Полоса «Мастер-приёмщик» у действия «Выдать машину»', a: 'lane', why: 'Кто выполняет действие — дорожка.' },
    { id: 'e6', t: 'Ромб, в который сходятся ветки «онлайн» и «касса станции»', a: 'mrg', why: 'Ромб, где ветки решения сходятся обратно, — слияние.' },
    { id: 'e7', t: 'Чёрный кружок над «Нажать „Оплатить“»', a: 'start', why: 'Отсюда деятельность начинается — начальный узел.' },
    { id: 'e8', t: 'Кружок в кольце после «Выдать машину»', a: 'stop', why: 'Деятельность закончилась — конечный узел.' }
  ];
  function elEval(v) { v = v || {}; const good = ELS.filter(x => v[x.id] === x.a).length; return { good, score: good / ELS.length }; }
  const taskElems = {
    id: 'elems', title: 'Узнайте элементы на схеме',
    simple: howBasics.simple,
    lead: ui.brief({
      situation: 'Ника впервые видит диаграмму деятельности: «Тут черты, ромбы, полоски… Что из этого что?» Вера: «Подпиши ей каждый элемент — и заодно проверишь себя».',
      todo: ['Для каждого описания выберите, что это за элемент. Схема — та же, что в теории (оплата и выдача).', 'Нажмите «Проверить». Засчитывается, если верно хотя бы 7 из 8.'],
      lookTitle: 'Подсказка', look: 'Ромб — выбор одной ветки или их слияние. Черта — все ветки сразу или ожидание всех. Полоса с названием роли — дорожка.'
    }),
    blank: () => ({ v: {} }),
    reference: () => ({ v: Object.fromEntries(ELS.map(x => [x.id, x.a])) }),
    render(el, ctx) {
      el.classList.add('m5a-root');
      const a = ctx.ans; a.v = a.v || {};
      let rv = null;
      if (ctx.result) { rv = {}; ELS.forEach(x => { if (a.v[x.id]) rv[x.id] = a.v[x.id] === x.a ? { s: 'ok', why: esc(x.why) } : { s: 'bad', why: `Это не «${esc(EL_CHOICES.find(c => c.v === a.v[x.id]).t)}». ${esc(x.why)}` }; }); }
      el.innerHTML = `<div class="m5a-root"><div class="m5a-board">${actSVG(PAY_FLOW, { label: 'Оплата и выдача машины' })}</div><div data-m></div></div>`;
      ui.match(TR.$('[data-m]', el), { rows: ELS.map(x => ({ id: x.id, t: esc(x.t) })), choices: EL_CHOICES, value: a.v, readonly: ctx.readonly, reveal: rv, placeholder: 'Что это?', onChange: v => { a.v = v; ctx.save(); } });
    },
    check(ans) {
      const v = (ans && ans.v) || {}, r = elEval(v), notes = [];
      ELS.forEach(x => { if (!v[x.id]) notes.push({ ok: false, html: `Не выбрано: ${esc(x.t)}.` }); else if (v[x.id] !== x.a) notes.push({ ok: false, html: `${esc(x.t)} — ${esc(EL_CHOICES.find(c => c.v === x.a).t.toLowerCase())}. ${esc(x.why)}` }); });
      if (r.good === ELS.length) notes.push({ ok: true, html: 'Все восемь элементов узнаны.' });
      return { ok: r.good >= 7, score: r.score, notes, summary: `Верно ${r.good} из ${ELS.length}.`, mentor: r.good >= 7 ? null : 'Различайте форму и смысл: ромб — «одно из» или схождение веток выбора; черта — «все сразу» или «ждём всех».' };
    },
    explain: `<p>Ромб на выходе — решение, на входе — слияние веток решения. Черта на выходе — развилка, на входе — слияние параллельных веток: оно ждёт, пока завершатся все. Полоса с ролью — дорожка: кто выполняет действие. Чёрный кружок — начало, кружок в кольце — конец всей деятельности.</p>
      <p>Самая частая путаница — ромб и черта. От неё зависят деньги: «одно из» вместо «оба» теряет чек, «оба» вместо «одно из» списывает оплату дважды. Источник: UML 2.5.1, раздел 15.3 (Control Nodes).</p>`,
    refNote: 'Засчитывается от 7 верных из 8.',
    report: ans => { const r = elEval((ans && ans.v) || {}); return `- Элементы: ${r.good}/${ELS.length}`; }
  };

  /* ---------- 2. Лаборатория: по очереди, параллельно или одно из ---------- */
  const REL = [{ v: 'seq', t: 'По очереди: сначала первое' }, { v: 'par', t: 'Параллельно (развилка)' }, { v: 'alt', t: 'Одно из (решение)' }];
  const PAIRS = [
    { id: 'p1', a1: 'Отправить чек через онлайн-кассу', a2: 'Начислить бонусы 5 %', a: 'par', good: 'Шаги не зависят друг от друга — развилка экономит время, клиент быстрее получает push.', bad: { seq: 'Ничего не сломается, но клиент ждёт лишнее время: бонусам не нужен чек, чеку — бонусы.', alt: 'Ромб выполнит только одну ветку: либо чек не уйдёт (нарушение 54-ФЗ), либо бонусы не начислятся (BR-11).' } },
    { id: 'p2', a1: 'Оплатить картой в приложении', a2: 'Оплатить на кассе станции', a: 'alt', good: 'Клиент выбирает один способ (BR-10) — решение с условиями [онлайн] и [касса].', bad: { seq: 'Клиента попросят заплатить сначала в приложении, потом ещё и на кассе — двойная оплата.', par: 'Развилка запустит обе оплаты одновременно — двойное списание и возврат денег через ЮKassa.' } },
    { id: 'p3', a1: 'Получить вебхук ЮKassa «оплачено»', a2: 'Выдать машину', a: 'seq', good: 'Машину выдают только после оплаты (BR-10): слияние перед выдачей ждёт подтверждения.', bad: { par: 'Машину отдадут, пока платёж ещё не прошёл: банк откажет — а клиент уже уехал.', alt: 'Ромб выберет одно: либо оплату без выдачи, либо выдачу без оплаты.' } },
    { id: 'p4', a1: 'Списать бонусы (до 30 % стоимости работ)', a2: 'Создать платёж в ЮKassa', a: 'seq', good: 'Сначала бонусы уменьшают сумму (BR-11), потом платёж создаётся на остаток.', bad: { par: 'Платёж создадут на полную сумму, а бонусы спишут отдельно — клиент переплатит, придётся делать возврат.', alt: 'Клиент сможет либо списать бонусы, либо заплатить — а нужно и то и другое, если бонусов не хватает на всю сумму.' } },
    { id: 'p5', a1: 'Отправить push «Оплачено»', a2: 'Выгрузить оплату в 1С', a: 'par', good: 'Выгрузка в 1С идёт по расписанию раз в 15 минут — push не должен её ждать.', bad: { seq: 'Если push ждёт выгрузки в 1С, клиент узнает об оплате через 15 минут и будет звонить на станцию.', alt: 'Ромб выполнит только одно: либо клиент не узнает об оплате, либо бухгалтерия не увидит её в 1С.' } },
    { id: 'p6', a1: 'Чек через онлайн-кассу', a2: 'Выдать машину', a: 'seq', good: 'Чек выдаётся при расчёте (54-ФЗ), а машина — после: Ольга Викторовна спокойна.', bad: { par: 'Ключи отдадут, не дождавшись чека: если касса зависла, расчёт без чека — штраф по 54-ФЗ.', alt: 'Ромб выберет одно: чек без выдачи или выдачу без чека.' } }
  ];
  function pairEval(v) { v = v || {}; const good = PAIRS.filter(p => v[p.id] === p.a).length; return { good, score: good / PAIRS.length }; }
  const taskPar = {
    id: 'par', title: 'Лаборатория: по очереди, параллельно или одно из',
    simple: howFork.simple,
    lead: ui.brief({
      situation: 'Глеб рисует логику платёжного сервиса: «Скажи для каждой пары шагов: по очереди, одновременно или одно из. Как скажешь — так и закодирую». Ольга Викторовна добавляет: «Чек должен быть при расчёте — это закон».',
      todo: ['Для каждой пары выберите, как связаны шаги.', 'Нажмите «Проверить» — увидите, что случится у живых клиентов при каждом решении.', 'Засчитывается, если верно хотя бы 5 из 6.'],
      lookTitle: 'Подсказка', look: 'Спросите себя: нужен ли результат первого шага второму? (тогда по очереди). Делаются ли оба? (тогда параллельно). Или только один из двух? (тогда решение).'
    }),
    blank: () => ({ v: {} }),
    reference: () => ({ v: Object.fromEntries(PAIRS.map(p => [p.id, p.a])) }),
    render(el, ctx) {
      el.classList.add('m5a-root');
      const a = ctx.ans; a.v = a.v || {};
      const shown = !!ctx.result || ctx.readonly, ev = pairEval(a.v);
      el.innerHTML = `<div class="m5a-root">${shown ? `<div class="row"><b>Без сбоев: ${ev.good} из ${PAIRS.length}</b>${ui.meter(ev.score)}</div>` : ''}
        ${PAIRS.map(p => { const sel = a.v[p.id]; return `<div class="m5a-pair"><div class="ab"><b>1. ${esc(p.a1)}</b><b>2. ${esc(p.a2)}</b></div>
          <select data-pr="${p.id}" aria-label="Связь шагов: ${esc(p.a1)} и ${esc(p.a2)}" ${ctx.readonly ? 'disabled' : ''}><option value="">Как связаны?</option>${REL.map(r => `<option value="${r.v}" ${sel === r.v ? 'selected' : ''}>${esc(r.t)}</option>`).join('')}</select>
          ${shown ? (sel === p.a ? `<div class="res ok">${esc(p.good)}</div>` : `<div class="res bad">${sel ? esc(p.bad[sel]) : 'Не выбрано.'} Правильно: ${esc(REL.find(r => r.v === p.a).t.toLowerCase())}.</div>`) : ''}</div>`; }).join('')}</div>`;
      el.onchange = ctx.readonly ? null : e => { const s = e.target.closest('[data-pr]'); if (!s) return; if (s.value) a.v[s.dataset.pr] = s.value; else delete a.v[s.dataset.pr]; ctx.save(); const r = s.parentElement.querySelector('.res'); if (r) r.remove(); };
    },
    check(ans) {
      const v = (ans && ans.v) || {}, r = pairEval(v), notes = [];
      PAIRS.forEach(p => notes.push(v[p.id] === p.a ? { ok: true, html: `«${esc(p.a1)}» и «${esc(p.a2)}»: ${esc(REL.find(x => x.v === p.a).t.toLowerCase())} — верно.` } : { ok: false, html: `«${esc(p.a1)}» и «${esc(p.a2)}»: нужно ${esc(REL.find(x => x.v === p.a).t.toLowerCase())}. ${v[p.id] ? esc(p.bad[v[p.id]]) : ''}` }));
      return { ok: r.good >= 5, score: r.score, notes, summary: `Верно ${r.good} из ${PAIRS.length}.`, mentor: r.good >= 5 ? null : 'Для каждой пары задайте три вопроса: нужен ли результат первого второму, делаются ли оба, или только один. Ответ и есть форма на схеме.' };
    },
    explain: `<p>Параллельно — то, что не зависит друг от друга: чек и бонусы, push и выгрузка в 1С. По очереди — когда второму нужен результат первого: бонусы уменьшают сумму платежа (BR-11), машину выдают после оплаты (BR-10) и после чека (54-ФЗ). Одно из — способы оплаты: картой в приложении или на кассе.</p>
      <p>Каждая ошибка здесь — реальные деньги или жалоба: двойное списание, переплата, расчёт без чека, клиент, который звонит на станцию. Поэтому аналитик проговаривает с разработчиком каждую пару шагов. Источники: UML 2.5.1, разделы 15.3.3 (Fork/Join) и 15.3.4 (Decision/Merge); Федеральный закон № 54-ФЗ о применении ККТ.</p>`,
    refNote: 'Засчитывается от 5 верных из 6.',
    report: ans => { const v = (ans && ans.v) || {}; return PAIRS.map(p => `- ${p.a1} / ${p.a2}: ${v[p.id] ? REL.find(r => r.v === v[p.id]).t : '—'}${v[p.id] === p.a ? ' ✓' : ''}`).join('\n'); }
  };

  /* ---------- 3. Найдите ошибки в черновике ---------- */
  const DRAFT = `|Механик|
start
:Нажать «Готово» на планшете;
|Сервис уведомлений|
:Push и SMS «Машина готова»;
|Клиент|
if (Как оплатить?) then
  :Оплатить в приложении;
else
  :Оплатить на кассе;
endif
|Платёжный сервис|
fork
  :Чек;
fork again
  :Начислить бонусы 5 %;
end merge
|Механик|
:Выдать ключи клиенту;
:Списать бонусы до 30 %;
stop`;
  const D = parseAct(DRAFT), DN = [];
  walk(D.seq, nd => DN.push(nd));
  const nodeBy = (k, t) => DN.find(n => n.k === k && (!t || (n.t && n.t.indexOf(t) === 0)));
  const DITEMS = [
    { nd: nodeBy('start'), t: 'Начало: механик нажимает «Готово» на планшете' },
    { nd: nodeBy('act', 'Push'), t: 'Сервис уведомлений отправляет push и SMS «Машина готова»' },
    { nd: nodeBy('if'), t: 'Ромб «Как оплатить?» — выходы без подписей', err: 'У решения нет условий на выходах: непонятно, когда какая ветка. Нужно [онлайн] и [касса станции] (BR-10).' },
    { nd: nodeBy('act', 'Чек'), t: 'Действие «Чек»', err: 'Действие без глагола. Нужно «Отправить чек через онлайн-кассу».' },
    { nd: nodeBy('act', 'Начислить'), t: 'Действие «Начислить бонусы 5 %»' },
    { nd: nodeBy('fork'), t: 'Ветки чека и бонусов сходятся в ромб (end merge)', err: 'Ромб-слияние пропускает дальше первую же пришедшую ветку — ключи выдадут, не дождавшись чека (54-ФЗ). После развилки нужно слияние-черта: end fork.' },
    { nd: nodeBy('act', 'Выдать'), t: '«Выдать ключи клиенту» — в дорожке «Механик»', err: 'Машину выдаёт мастер-приёмщик, а не механик: дорожка указана неверно — так права в АРМ раздадут не той роли.' },
    { nd: nodeBy('act', 'Списать'), t: '«Списать бонусы до 30 %» — после выдачи ключей', err: 'Бонусы списывают до оплаты: они уменьшают сумму платежа (BR-11). После выдачи списывать поздно — клиент уже заплатил полную сумму.' },
    { nd: nodeBy('stop'), t: 'Конечный узел после последнего действия' }
  ];
  const D_ERR = DITEMS.map((x, i) => x.err ? i : -1).filter(i => i >= 0);
  function dEval(m) { const s = new Set(m || []); const hit = D_ERR.filter(i => s.has(i)).length, wrong = [...s].filter(i => !D_ERR.includes(i)).length; return { hit, wrong, score: Math.max(0, (hit - wrong) / D_ERR.length) }; }
  const FIXED = `@startuml
|Механик|
start
:Нажать «Готово» на планшете;
|Сервис уведомлений|
:Push и SMS «Машина готова»;
|Клиент|
:Списать бонусы до 30 %;
if (Как оплатить?) then (онлайн)
  :Оплатить в приложении;
else (касса станции)
  :Оплатить на кассе;
endif
|Платёжный сервис|
fork
  :Отправить чек через онлайн-кассу;
fork again
  :Начислить бонусы 5 %;
end fork
|Мастер-приёмщик|
:Выдать ключи клиенту;
stop
@enduml`;
  const taskBugs = {
    id: 'bugs', title: 'Найдите ошибки в черновике выдачи машины',
    simple: howVs.simple,
    lead: ui.brief({
      situation: 'Ника нарисовала, что происходит от «Готово» на планшете до выдачи ключей. Вера: «Пять ошибок — в нотации и в правилах. Найди, пока Глеб не начал кодить».',
      todo: ['Отметьте в списке пункты с ошибками (номера совпадают с номерами на схеме).', 'Ошибок пять.', 'Нажмите «Проверить». Засчитывается, если найдены все пять и не больше одной лишней отметки.'],
      lookTitle: 'Подсказка', look: 'Проверьте подписи у ромба, глаголы в действиях, чем закрыта развилка, кто выдаёт машину и когда списываются бонусы (BR-11).'
    }),
    blank: () => ({ m: [] }),
    reference: () => ({ m: D_ERR.slice() }),
    render(el, ctx) {
      el.classList.add('m5a-root');
      const a = ctx.ans; a.m = a.m || [];
      const shown = !!ctx.result || ctx.readonly, nums = {}, marks = {};
      DITEMS.forEach((x, i) => { if (!x.nd) return; nums[x.nd.idx] = i + 1; if (shown) { const on = a.m.includes(i); marks[x.nd.idx] = on && x.err ? 'ok' : on && !x.err ? 'bad' : !on && x.err ? 'miss' : undefined; } });
      el.innerHTML = `<div class="m5a-root"><div class="m5a-two"><div class="m5a-board">${actSVG(D, { nums, marks, label: 'Черновик Ники' })}</div>
        <div class="stack"><div class="m5a-items">${DITEMS.map((x, i) => { const on = a.m.includes(i), cls = shown ? (on && x.err ? 'ok' : on && !x.err ? 'bad' : !on && x.err ? 'miss' : '') : ''; return `<button type="button" class="m5a-item ${cls}" data-bg="${i}" aria-pressed="${on}" ${ctx.readonly ? 'disabled' : ''}><span class="n">${i + 1}</span><span>${esc(x.t)}${shown && x.err ? `<div class="small" style="margin-top:4px;color:var(--text-2)">${esc(x.err)}</div>` : ''}</span></button>`; }).join('')}</div>
        <div class="small dim" data-cnt>Отмечено: ${a.m.length}.${shown ? ' Зелёные — найдено, красные — лишняя отметка, жёлтые — пропущено.' : ''}</div></div></div>
        ${shown ? `<div class="eyebrow">Исправленная схема</div><div class="m5a-two"><div class="m5a-board">${actSVG(FIXED, { label: 'Исправленная схема' })}</div>${ui.code(FIXED, 'text')}</div>` : ''}</div>`;
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
      return { ok: r.hit === D_ERR.length && r.wrong <= 1, score: r.score, notes, summary: `Найдено ${r.hit} из ${D_ERR.length}, лишних: ${r.wrong}.`, mentor: r.hit === D_ERR.length ? (r.wrong > 1 ? 'Ошибки найдены, но отмечены и верные шаги. Сверяйте каждую отметку с правилом.' : null) : 'Пройдитесь по чек-листу: условия у ромба, глагол в каждом действии, чем закрыта развилка, кто выполняет шаг, порядок по BR-11.' };
    },
    explain: `<p>Две ошибки нотации: у ромба нет условий на выходах, а действие «Чек» без глагола. Одна — в семантике: развилку закрыли ромбом (<code>end merge</code>), и процесс пойдёт дальше по первой пришедшей ветке, не дождавшись чека. Две — против правил «Искры»: машину выдаёт мастер-приёмщик, а бонусы списывают до оплаты, потому что они уменьшают сумму (BR-11).</p>
      <p>Дорожки — не украшение: по ним раздают права в системе и пишут инструкции персоналу. Слияние параллельных веток — не формальность: оно гарантирует, что следующий шаг не начнётся раньше времени. Источники: UML 2.5.1, раздел 15; plantuml.com/ru/activity-diagram-beta.</p>`,
    refNote: 'Засчитывается, если найдены все пять ошибок и не больше одной лишней отметки.',
    report: ans => { const r = dEval((ans && ans.m) || []); return `- Найдено ошибок: ${r.hit}/${D_ERR.length}, лишних: ${r.wrong}`; }
  };

  /* ---------- 4. Напишите процесс кодом ---------- */
  const CODE_START = `@startuml
|Клиент|
start
:Нажать «Оплатить»;
' дальше: способ оплаты (if … else … endif),
' потом параллельно чек и бонусы (fork … end fork),
' потом выдача машины мастером-приёмщиком

stop
@enduml`;
  const CODE_REF = FIXED;
  const acts = r => { const out = []; walk(r.seq, n => { if (n.k === 'act') out.push(n); }); return out; };
  const AFEATS = [
    { t: 'Есть начало (start) и конец (stop)', f: r => { let a = false, b = false; walk(r.seq, n => { if (n.k === 'start') a = true; if (n.k === 'stop') b = true; }); return a && b; } },
    { t: 'Есть решение if … else … endif с подписанными ветками', f: r => { let ok = false; walk(r.seq, n => { if (n.k === 'if' && n.branches.length >= 2 && n.branches.every(b => b.label)) ok = true; }); return ok; } },
    { t: 'Решение — про способ оплаты (онлайн или касса)', f: r => { let ok = false; walk(r.seq, n => { if (n.k === 'if' && /оплат|касс|онлайн|способ/.test(TR.norm(n.cond + ' ' + n.branches.map(b => b.label).join(' ')))) ok = true; }); return ok; } },
    { t: 'Есть развилка fork с двумя ветками и слиянием end fork', f: r => { let ok = false; walk(r.seq, n => { if (n.k === 'fork' && n.branches.length >= 2 && !n.merge) ok = true; }); return ok; } },
    { t: 'В параллельных ветках — чек и бонусы', f: r => { let ok = false; walk(r.seq, n => { if (n.k === 'fork') { const t = TR.norm(n.branches.map(b => b.seq.map(x => x.t || '').join(' ')).join(' ')); if (/чек/.test(t) && /бонус/.test(t)) ok = true; } }); return ok; } },
    { t: 'Не меньше двух дорожек, машину выдаёт мастер-приёмщик', f: r => r.lanes.length >= 2 && acts(r).some(a => /выда/.test(TR.norm(a.t)) && /мастер/.test(TR.norm(a.lane || ''))) },
    { t: 'Выдача машины — после развилки, а не внутри неё', f: r => { const top = r.seq; const fi = top.findIndex(n => n.k === 'fork'), vi = top.findIndex(n => n.k === 'act' && /выда/.test(TR.norm(n.t))); return fi >= 0 && vi > fi; } },
    { t: 'Код без ошибок разбора', f: r => r.any && !r.msgs.some(m => m.kind === 'bad') }
  ];
  function codeEval(text) { const r = parseAct(text); const on = AFEATS.map(f => !!f.f(r)); const n = on.filter(Boolean).length; return { r, on, n, score: n / AFEATS.length }; }
  const taskCode = {
    id: 'code', title: 'Опишите оплату и выдачу кодом PlantUML',
    lead: ui.brief({
      situation: 'Глеб: «Положи в репозиторий диаграмму деятельности оплаты: клиент выбирает способ — онлайн или касса, потом параллельно чек и бонусы, потом мастер выдаёт машину. Только PlantUML — в Mermaid её не нарисовать».',
      todo: ['Допишите код PlantUML. Схема рисуется рядом, пока вы пишете.', 'Следите за признаками под редактором.', 'Нажмите «Проверить». Засчитывается, если выполнено 7 признаков из 8, включая «код без ошибок разбора».'],
      lookTitle: 'Подсказка', look: 'Дорожка — строка |Мастер-приёмщик|, всё ниже выполняет он. Решение: if (Способ оплаты?) then (онлайн) … else (касса станции) … endif. Параллельно: fork … fork again … end fork.'
    }),
    blank: () => ({ text: '' }),
    reference: () => ({ text: CODE_REF }),
    render(el, ctx) {
      el.classList.add('m5a-root');
      const a = ctx.ans; if (!a.text && !ctx.readonly) a.text = CODE_START;
      el.innerHTML = `<div class="m5a-root"><div class="m5a-two m5a-ed"><div class="stack"><textarea spellcheck="false" aria-label="Код диаграммы деятельности" ${ctx.readonly ? 'readonly' : ''}></textarea><div class="stack" data-pm aria-live="polite"></div></div><div class="m5a-board" data-out></div></div>
        <div class="eyebrow">Признаки</div><div class="m5a-feats" data-ft aria-live="polite"></div></div>`;
      const ta = TR.$('textarea', el); ta.value = a.text || '';
      const upd = () => {
        const ev = codeEval(ta.value);
        TR.$('[data-ft]', el).innerHTML = AFEATS.map((f, i) => `<div class="m5a-feat ${ev.on[i] ? 'on' : ''}"><span class="mk">${ev.on[i] ? '✓' : '○'}</span><span>${esc(f.t)}</span></div>`).join('');
        TR.$('[data-pm]', el).innerHTML = ev.r.msgs.slice(0, 5).map(m => `<div class="m5a-pm ${m.kind === 'bad' ? '' : 'warn'}">${m.n ? `Строка ${m.n}: ` : ''}${esc(m.t)}</div>`).join('');
        const out = TR.$('[data-out]', el);
        out.innerHTML = ev.r.any ? actSVG(ev.r, { label: 'Ваша диаграмма' }) : '<p class="small dim" style="padding:10px">Здесь появится схема.</p>';
      };
      if (!ctx.readonly) ta.addEventListener('input', () => { a.text = ta.value; ctx.save(); upd(); });
      upd();
    },
    check(ans) {
      const ev = codeEval((ans && ans.text) || ''), notes = [];
      AFEATS.forEach((f, i) => notes.push({ ok: ev.on[i], html: esc(f.t) + (ev.on[i] ? '' : ' — не выполнено.') }));
      ev.r.msgs.filter(m => m.kind === 'bad').slice(0, 3).forEach(m => notes.push({ ok: false, html: `${m.n ? `Строка ${m.n}: ` : ''}${esc(m.t)}` }));
      const clean = ev.on[AFEATS.length - 1];
      return { ok: ev.n >= 7 && clean, score: ev.score, notes, summary: `Признаков: ${ev.n} из ${AFEATS.length}.`, mentor: ev.n >= 7 && clean ? null : !clean ? 'Сначала добейтесь, чтобы код разбирался: точка с запятой после действий, каждый if закрыт endif, каждый fork — end fork.' : 'Проверьте логику: способ оплаты — решение с подписями, чек и бонусы — развилка со слиянием, выдача — после, в дорожке мастера-приёмщика.' };
    },
    explain: `<p>В эталоне: дорожки «Механик», «Сервис уведомлений», «Клиент», «Мастер-приёмщик»; бонусы списываются до оплаты (BR-11); решение «Как оплатить?» с ветками [онлайн] и [касса станции] (BR-10); развилка «чек ∥ бонусы» со слиянием <code>end fork</code>; выдача ключей — после слияния и в дорожке мастера-приёмщика.</p>
      <p>Такую схему кладут рядом с требованиями к платёжному сервису: по ней разработчик видит, что можно делать параллельно, а тестировщик — какие ветки проверить (обе оплаты, сбой кассы). Источник: plantuml.com/ru/activity-diagram-beta; UML 2.5.1, раздел 15.</p>`,
    refNote: 'Засчитывается любой корректный код PlantUML, если выполнено 7 признаков из 8.',
    report: ans => { const ev = codeEval((ans && ans.text) || ''); return `- Признаков: ${ev.n}/${AFEATS.length}\n\n\`\`\`\n${(ans && ans.text) || ''}\n\`\`\``; }
  };

  /* ---------- 5. Ответ Глебу ---------- */
  const J_RUBRIC = [
    'Объясняет разницу: BPMN — процесс между людьми и организациями для бизнеса, activity — логика внутри системы для разработчиков',
    'Приводит пример из «Искры»: что делает платёжный сервис после вебхука (чек и бонусы параллельно, выдача после слияния)',
    'Говорит о главной пользе activity — явно видно, что параллельно, что по очереди и что «одно из», а ошибка здесь стоит денег (двойное списание, расчёт без чека)',
    'Упоминает, что activity удобно держать кодом PlantUML в репозитории рядом с требованиями',
    'Отвечает коротко, как коллеге; не утверждает, что одна диаграмма заменяет другую'
  ];
  const J_REF = 'Глеб, BPMN у нас про то, как станция работает с клиентом: кто из людей что делает, сообщения между мастером и клиентом — это для Марины Олеговны и Тимура Рашидовича. А activity — про логику внутри твоего платёжного сервиса: что он делает после вебхука ЮKassa. Там важно то, чего в BPMN процесса станции не видно: бонусы списываем до создания платежа, чек и начисление бонусов идут параллельно, а выдача ждёт слияния — машину не отдадут без чека. Каждая ошибка тут — деньги: перепутаешь «одно из» и «параллельно» — двойное списание, не дождёшься слияния — расчёт без чека и штраф. Activity лежит кодом PlantUML рядом с требованиями к сервису: поменялось правило — правим строку в том же коммите. Одна схема другую не заменяет: BPMN — для бизнеса, activity — для тебя и Лизы.';
  const taskExplain = {
    id: 'explain', title: 'Объясните Глебу, зачем activity, если есть BPMN',
    lead: ui.brief({
      situation: 'Глеб: «У нас же есть BPMN процесса оплаты, мы его в декабре рисовали. Зачем ещё какая-то диаграмма деятельности?»',
      todo: ['Ответьте Глебу своими словами, от 200 символов: чем они отличаются, кому какая, что даёт activity именно ему.', 'Проверьте ответ по рубрике (или попросите Веру).', 'Нажмите «Проверить». Засчитывается от 60 % по рубрике.'],
      lookTitle: 'Подсказка', look: 'BPMN — работа людей и обмен между участниками. Activity — логика внутри сервиса, параллельные шаги, условия. Пример: что делает платёжный сервис после вебхука.'
    }),
    blank: () => ({ j: {} }),
    reference: () => ({ j: { text: J_REF, self: J_RUBRIC.map(() => true) } }),
    render(el, ctx) {
      el.classList.add('m5a-root');
      const a = ctx.ans; a.j = a.j || {};
      el.innerHTML = `<div class="m5a-root">${ui.say('gleb', 'У нас же есть BPMN процесса оплаты, мы его в декабре рисовали. Зачем ещё какая-то диаграмма деятельности?')}<div data-j></div></div>`;
      ui.justify(TR.$('[data-j]', el), {
        id: 'm5a-gleb', q: 'Что ответить Глебу?',
        qPlain: 'Объясните тимлиду бэкенда, чем диаграмма деятельности UML отличается от BPMN, кому какая нужна и какую пользу activity даёт разработчику платёжного сервиса.',
        rubric: J_RUBRIC, reference: J_REF, value: a.j, readonly: ctx.readonly, minLen: 200,
        placeholder: 'Глеб, …',
        onChange: v => { a.j = v; ctx.save(); ctx.decide('Ответ Глебу: activity и BPMN', v.text || ''); }
      });
    },
    check(ans) {
      const j = ui.justifyScore(ans && ans.j), notes = [];
      if (!j) notes.push({ ok: false, html: 'Ответ не написан или не оценён: от 200 символов, затем проверка по рубрике или с Верой.' });
      else notes.push({ ok: j >= 0.6 ? true : 'warn', html: `Ответ: ${pct(j)} по рубрике.${j < 0.6 ? ' Назовите читателя каждой схемы и пример из платёжного сервиса.' : ''}` });
      return { ok: j >= 0.6, score: j, notes, summary: `Ответ: ${pct(j)} по рубрике.`, mentor: j >= 0.6 ? null : 'Разработчика убеждает его собственная задача. Покажите, что activity отвечает на его вопрос: что делает сервис после вебхука и что можно делать параллельно.' };
    },
    explain: `<p>BPMN и activity не конкуренты: BPMN описывает процесс между участниками на языке бизнеса, activity — логику внутри системы на языке разработки. Для платёжного сервиса activity показывает порядок и параллельность шагов после вебхука, а ошибки в этом месте стоят денег.</p>
      <p>Хороший ответ разработчику — через его задачу и его риски, а не через определения. Источники: UML 2.5.1, раздел 15; BPMN 2.0.2 (OMG), раздел 10; Вигерс, Битти, «Разработка требований к ПО», глава о моделях.</p>`,
    refNote: 'Оценивается по рубрике: самопроверка или проверка Claude.',
    report: ans => `- Ответ Глебу (${pct(ui.justifyScore(ans && ans.j))}): ${(ans && ans.j && ans.j.text) || '—'}`
  };

  TR.stage({
    id: ID,
    when: 'среда, 17 февраля, 11:00 · что происходит после оплаты: по очереди или параллельно',
    intro: [
      { who: 'gleb', html: 'Пишу платёжный сервис. После вебхука ЮKassa надо отправить чек, начислить бонусы, прислать push, выгрузить в 1С. Что из этого параллельно, что по очереди? В BPMN процесса станции этого не видно.' },
      { who: 'olga', html: 'И одно правило без обсуждений: чек — при расчёте, это 54-ФЗ. Машину без чека не отдаём.' },
      { who: 'vera', html: 'Сегодня — диаграмма деятельности UML: действия, решения, развилки и дорожки. Разберём, где «одно из», где «одновременно», а где «строго по очереди», — и Глеб получит схему кодом в репозиторий.' }
    ],
    glossary: [
      { term: 'Диаграмма деятельности', simple: 'Алгоритм в картинке: шаги, выбор, параллельные ветки, кто делает.', tech: 'UML Activity Diagram (UML 2.5.1, раздел 15).' },
      { term: 'Действие', simple: 'Шаг, который кто-то выполняет: глагол и объект.', tech: 'Action — атомарный шаг деятельности.' },
      { term: 'Решение и слияние', simple: 'Ромб: выбор одной ветки по условию и схождение веток обратно.', tech: 'Decision / merge node; условия на выходах — guards.' },
      { term: 'Развилка и слияние параллельных', simple: 'Черта: все ветки одновременно — и ожидание всех.', tech: 'Fork / join node; join пропускает дальше, когда пришли маркеры из всех веток.' },
      { term: 'Дорожка', simple: 'Кто выполняет действия: клиент, сервис, мастер.', tech: 'Activity partition (swimlane).' },
      { term: 'Конечный узел потока', simple: 'Кружок с крестом: заканчивается одна ветка, остальные работают.', tech: 'Flow final node; в PlantUML — kill.' }
    ],
    outro: 'Логика платёжного сервиса согласована: бонусы — до платежа, чек и бонусы — параллельно, выдача — после слияния. Глеб кодит по схеме, Лиза пишет тесты на обе оплаты и сбой кассы. Следующее занятие — блок-схема: как описать правило так, чтобы его понял любой.',
    tasks: [howBasics, howFork, howVs, taskElems, taskPar, taskBugs, taskCode, taskExplain]
  });
})();
