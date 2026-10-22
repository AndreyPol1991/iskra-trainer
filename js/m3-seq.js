/* Модуль 3, занятие 5: UML Sequence Diagram.
   Теория: how-seq-basics — участники, линии жизни, синхронные и асинхронные сообщения, ответы, активации («нажмите на
   элемент»), проигрывание онлайн-оплаты через ЮKassa и кафе для сравнения, «ждать или не ждать» на таймлайне;
   how-seq-frag — фрагменты alt / opt / loop / par на «Искре» с PlantUML-кодом рядом и шпаргалкой нотации;
   how-seq-integr — синхронная и асинхронная интеграция, вебхук против опроса, тайм-ауты и повторы, идемпотентность.
   Практика: порядок сообщений оплаты + синхронно/асинхронно для 8 взаимодействий; конструктор фрагмента alt «оплата не
   прошла» с живым предпросмотром; ошибки в диаграмме Даши (PlantUML + картинка); конструктор диаграммы предоплаты по
   BR-4 по текстовому сценарию; лаборатория «SMS-шлюз упал в пятничный пик» с последствиями и ответ Тимуру своими словами. */
'use strict';
(function () {
  const TR = window.TR, ui = TR.ui, esc = TR.esc;
  const ID = 'm3-seq';

  if (!document.getElementById('msq-css')) document.head.insertAdjacentHTML('beforeend', `<style id="msq-css">
    .msq-root, .msq-root .stack > * { min-width: 0; }
    .msq-root .seg button { white-space: normal; }
    .msq-board { overflow-x: auto; border: 1px solid var(--border); border-radius: 12px; background: var(--code-bg); padding: 6px 4px; }
    .msq-board svg { display: block; }
    .msq-hit { cursor: pointer; outline: none; }
    .msq-hit:hover .hb, .msq-hit:focus .hb { fill: color-mix(in srgb, var(--accent) 12%, transparent); }
    .msq-two { display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr); gap: 12px; align-items: start; }
    .msq-g2 { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
    .msq-legend { display: flex; flex-wrap: wrap; gap: 6px; }
    .msq-opt { border: 1px solid var(--border-strong); border-radius: 10px; padding: 6px 10px; background: var(--surface-2); color: var(--text); font-size: 13.5px; line-height: 1.3; text-align: left; max-width: 100%; }
    .msq-opt:hover:not(:disabled) { border-color: var(--text-muted); }
    .msq-opt[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); box-shadow: 0 0 0 1px var(--accent) inset; }
    .msq-opt.ok { border-color: var(--ok); background: var(--ok-soft); } .msq-opt.bad { border-color: var(--bad); background: var(--bad-soft); } .msq-opt.warn { border-color: var(--warn); background: var(--warn-soft); }
    .msq-opt:disabled { cursor: default; }
    .msq-opts { display: flex; flex-wrap: wrap; gap: 6px; min-width: 0; }
    .msq-def { display: grid; grid-template-columns: 150px minmax(0, 1fr); gap: 6px 14px; font-size: 14px; }
    .msq-def > .k { font: 600 11px/1.5 var(--f-mono); letter-spacing: .05em; text-transform: uppercase; color: var(--text-muted); padding-top: 2px; }
    .msq-tl { display: grid; gap: 6px; }
    .msq-tlr { display: grid; grid-template-columns: 150px minmax(0, 1fr) 70px; gap: 10px; align-items: center; font-size: 13px; }
    .msq-tlr .tr { position: relative; height: 16px; background: var(--surface-3); border-radius: 4px; overflow: hidden; }
    .msq-tlr .tr i { position: absolute; top: 0; bottom: 0; border-radius: 4px; background: var(--accent); }
    .msq-tlr .tr i.w { background: var(--bad); } .msq-tlr .tr i.a { background: var(--violet); } .msq-tlr .tr i.o { background: var(--ok); }
    .msq-tlr .x { font: 600 12px/1 var(--f-mono); text-align: right; }
    .msq-brow { display: grid; grid-template-columns: 26px minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr) auto auto; gap: 6px; align-items: center; padding: 6px 8px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface); }
    .msq-brow.ok { border-color: var(--ok); } .msq-brow.bad { border-color: var(--bad); } .msq-brow.warn { border-color: var(--warn); }
    .msq-brow .n { font: 600 12px/1 var(--f-mono); color: var(--text-muted); }
    .msq-brow select { width: 100%; min-width: 0; }
    .msq-brow .why { grid-column: 1 / -1; font-size: 12.5px; color: var(--text-2); }
    .msq-brow .tools { display: flex; gap: 4px; }
    .msq-signs { display: grid; gap: 4px; font-size: 13px; }
    .msq-signs .s { padding: 4px 8px; border-radius: 8px; background: var(--surface-2); }
    .msq-signs .s.ok { color: var(--ok); } .msq-signs .s.bad { color: var(--bad); }
    .msq-found { display: grid; gap: 6px; }
    .msq-found .it { display: grid; grid-template-columns: minmax(0, 1fr) 240px; gap: 8px; align-items: center; padding: 7px 10px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface); font-size: 13.5px; }
    .msq-found .it.ok { border-color: var(--ok); } .msq-found .it.bad { border-color: var(--bad); } .msq-found .it.warn { border-color: var(--warn); }
    .msq-found .it .why { grid-column: 1 / -1; font-size: 12.5px; color: var(--text-2); }
    .msq-found select { width: 100%; min-width: 0; }
    .msq-dec { display: grid; gap: 8px; padding: 10px 12px; border: 1px solid var(--border); border-radius: 12px; background: var(--surface); }
    .msq-dec.ok { border-color: var(--ok); } .msq-dec.bad { border-color: var(--bad); } .msq-dec.warn { border-color: var(--warn); }
    .msq-dec .why { font-size: 13px; color: var(--text-2); }
    .msq-stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; }
    .msq-stat { padding: 8px 10px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface); display: grid; gap: 2px; min-width: 0; }
    .msq-stat .v { font: 700 18px/1.2 var(--f-mono); }
    .msq-stat .k { font-size: 12px; color: var(--text-2); }
    .msq-stat.ok .v { color: var(--ok); } .msq-stat.bad .v { color: var(--bad); } .msq-stat.warn .v { color: var(--warn); }
    .msq-ev { display: grid; grid-template-columns: 74px minmax(0, 1fr); gap: 10px; padding: 7px 10px; border-radius: 10px; border: 1px solid var(--border); background: var(--surface); font-size: 13.5px; }
    .msq-ev .d { font: 600 12px/1.4 var(--f-mono); color: var(--text-muted); }
    .msq-ev.bad { border-color: color-mix(in srgb, var(--bad) 55%, var(--border)); background: color-mix(in srgb, var(--bad-soft) 60%, var(--surface)); }
    .msq-ev.ok { border-color: color-mix(in srgb, var(--ok) 55%, var(--border)); }
    .msq-ev.warn { border-color: color-mix(in srgb, var(--warn) 55%, var(--border)); }
    @media (max-width: 760px) {
      .msq-two, .msq-g2 { grid-template-columns: minmax(0, 1fr); }
      .msq-def { grid-template-columns: minmax(0, 1fr); gap: 2px; }
      .msq-def > .v { margin-bottom: 8px; }
      .msq-brow { grid-template-columns: 22px minmax(0, 1fr) minmax(0, 1fr); }
      .msq-brow .lab { grid-column: 2 / -1; }
      .msq-brow .seg, .msq-brow .tools { grid-column: 2 / -1; }
      .msq-found .it { grid-template-columns: minmax(0, 1fr); }
      .msq-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .msq-tlr { grid-template-columns: minmax(0, 1fr) 60px; }
      .msq-tlr .tr { grid-column: 1 / -1; grid-row: 2; }
    }
  </style>`);

  // =====================================================================
  // Локальный рисовальщик UML-диаграммы последовательности.
  // Общий ui.seq умеет проигрывать шаги, но не различает наконечники синхронных и асинхронных сообщений
  // и не рисует активации и рамки фрагментов — для точной нотации UML 2.5 рисуем сами.
  // items: {type:'sync'|'async'|'reply', from, to, t, k} | {frag:'alt'|'opt'|'loop'|'par', guard} | {els: guard} | {end:true}
  // =====================================================================
  const C = { '': 'var(--text-2)', ok: 'var(--ok)', bad: 'var(--bad)', warn: 'var(--warn)', accent: 'var(--accent)', info: 'var(--info)', violet: 'var(--violet)', mute: 'var(--text-muted)' };
  let uid = 0;
  function umlSeq(cfg) {
    const id = 'msqd' + (++uid);
    const lanes = cfg.lanes, LW = cfg.laneW || 150, PAD = 12;
    const hasActor = lanes.some(l => l.kind === 'actor');
    const HEAD = hasActor ? 74 : 58;
    const li = lid => Math.max(0, lanes.findIndex(l => l.id === lid));
    const LX = lid => PAD + LW / 2 + li(lid) * LW;
    const W = PAD * 2 + lanes.length * LW;
    const msgs = [], frames = [], stack = [], open = {}, bars = [];
    const depth = lid => (open[lid] || []).length;
    let y = HEAD + 12, n = 0;
    (cfg.items || []).forEach((it, i) => {
      if (it.frag) { const f = { op: it.frag, guard: it.guard || '', y1: y, ops: [], ls: new Set(), d: stack.length, k: it.k || '' }; stack.push(f); frames.push(f); y += 34; return; }
      if (it.els != null) { const f = stack[stack.length - 1]; if (f) f.ops.push({ y, guard: it.els }); y += 28; return; }
      if (it.end) { const f = stack.pop(); if (f) f.y2 = y + 2; y += 16; return; }
      const self = it.from === it.to, my = y + 22;
      stack.forEach(f => { f.ls.add(it.from); f.ls.add(it.to); });
      const lf = lanes[li(it.from)] || {}, lt = lanes[li(it.to)] || {};
      if (it.type === 'reply') {
        const o = open[it.from]; if (o && o.length) o.pop().y2 = my;
      } else if (self) {
        if (lt.kind !== 'actor') bars.push({ lane: it.to, y1: my + 4, y2: my + 24, d: depth(it.to) || 1 });
      } else {
        if (lf.kind !== 'actor' && !depth(it.from)) {
          const b = { lane: it.from, y1: my - 8, y2: it.type === 'sync' ? null : my + 10, d: 0 }; bars.push(b);
          if (it.type === 'sync') (open[it.from] = open[it.from] || []).push(b);
        }
        if (lt.kind !== 'actor') {
          if (it.type === 'async') { if (!depth(it.to)) bars.push({ lane: it.to, y1: my, y2: my + 22, d: 0 }); }
          else { const b = { lane: it.to, y1: my, y2: null, d: depth(it.to) }; bars.push(b); (open[it.to] = open[it.to] || []).push(b); }
        }
      }
      msgs.push({ it, i, y: my, num: ++n, self });
      y += self ? 50 : 42;
    });
    while (stack.length) stack.pop().y2 = y;
    const H = y + 18;
    bars.forEach(b => { if (b.y2 == null) b.y2 = Math.max(b.y1 + 16, y - 6); });
    const mk = (k, kind) => `<marker id="${id}-${kind}${k}" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="9" markerHeight="9" orient="auto-start-reverse">${kind === 'f' ? `<path d="M0 0 L12 6 L0 12 z" style="fill:${C[k]}"/>` : `<path d="M0 0 L12 6 L0 12" style="fill:none;stroke:${C[k]};stroke-width:1.6"/>`}</marker>`;
    let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" style="max-width:none" role="img" aria-label="${esc(cfg.title || 'Диаграмма последовательности')}"><defs>${Object.keys(C).map(k => mk(k, 'f') + mk(k, 'o')).join('')}</defs>`;
    // рамки фрагментов (под сообщениями)
    frames.forEach(f => {
      const idx = f.ls.size ? Array.from(f.ls).map(li) : lanes.map((_, i) => i);
      const a = Math.min.apply(null, idx), b = Math.max.apply(null, idx);
      const x1 = PAD + a * LW + 8 + f.d * 8, x2 = PAD + (b + 1) * LW - 8 - f.d * 8 + (f.ls.size && b === lanes.length - 1 ? 0 : 0);
      const col = f.k ? C[f.k] : 'var(--text-muted)';
      const w = f.op.length * 9 + 20;
      s += `<rect x="${x1}" y="${f.y1}" width="${x2 - x1}" height="${f.y2 - f.y1}" rx="3" style="fill:${f.k ? `color-mix(in srgb, ${col} 7%, transparent)` : 'none'};stroke:${col};stroke-width:1.3"/>`;
      s += `<path d="M${x1} ${f.y1} h${w} v12 l-8 8 h${-(w - 8)} z" style="fill:var(--surface-2);stroke:${col};stroke-width:1.2"/>`;
      s += `<text x="${x1 + 7}" y="${f.y1 + 14}" style="fill:var(--text);font:700 12px var(--f-mono)">${esc(f.op)}</text>`;
      if (f.guard) s += `<text x="${x1 + w + 8}" y="${f.y1 + 15}" style="fill:${col};font-size:12px;font-weight:600">[${esc(f.guard)}]</text>`;
      f.ops.forEach(o => {
        s += `<line x1="${x1}" y1="${o.y + 4}" x2="${x2}" y2="${o.y + 4}" style="stroke:${col};stroke-dasharray:6 4;stroke-width:1.2"/>`;
        if (o.guard) s += `<text x="${x1 + 8}" y="${o.y + 20}" style="fill:${col};font-size:12px;font-weight:600">[${esc(o.guard)}]</text>`;
      });
    });
    // участники и линии жизни
    lanes.forEach(l => {
      const x = LX(l.id), hl = cfg.laneHl && cfg.laneHl[l.id];
      const stroke = hl ? C[hl] : l.kind === 'ext' ? 'var(--text-muted)' : 'var(--border-strong)';
      s += `<line x1="${x}" y1="${HEAD - 6}" x2="${x}" y2="${H - 6}" style="stroke:${hl ? C[hl] : 'var(--border-strong)'};stroke-dasharray:4 5;stroke-width:${hl ? 1.6 : 1}"/>`;
      if (l.kind === 'actor') {
        s += `<g style="stroke:${hl ? C[hl] : 'var(--text-2)'};stroke-width:1.6;fill:none"><circle cx="${x}" cy="12" r="6"/><path d="M${x} 18 v14 M${x - 9} 24 h18 M${x} 32 l-8 10 M${x} 32 l8 10"/></g>`;
        s += `<text x="${x}" y="58" text-anchor="middle" style="fill:var(--text);font-size:12.5px;font-weight:600">${esc(l.t)}</text>`;
      } else {
        const bw = LW - 18;
        s += `<rect x="${x - bw / 2}" y="6" width="${bw}" height="${l.sub ? 42 : 32}" rx="6" style="fill:var(--surface-2);stroke:${stroke};stroke-width:${hl ? 2 : 1.2};${l.kind === 'ext' ? 'stroke-dasharray:5 3;' : ''}"/>`;
        s += `<text x="${x}" y="${l.sub ? 24 : 27}" text-anchor="middle" style="fill:var(--text);font-size:12.5px;font-weight:600">${esc(l.t)}</text>`;
        if (l.sub) s += `<text x="${x}" y="40" text-anchor="middle" style="fill:var(--text-muted);font-size:10.5px">${esc(l.sub)}</text>`;
      }
    });
    // активации
    bars.forEach(b => {
      const x = LX(b.lane) - 5 + b.d * 5;
      s += `<rect x="${x}" y="${b.y1}" width="10" height="${Math.max(8, b.y2 - b.y1)}" style="fill:var(--surface-3);stroke:${cfg.hlAct ? 'var(--accent)' : 'var(--text-muted)'};stroke-width:${cfg.hlAct ? 2 : 1}"/>`;
    });
    // сообщения
    msgs.forEach(m => {
      const it = m.it, hk = cfg.hl && cfg.hl[m.i];
      const k = hk || it.k || (it.type === 'async' && cfg.colorAsync ? 'violet' : '');
      const col = C[k] || C[''];
      const dash = it.type === 'reply' ? 'stroke-dasharray:6 4;' : '';
      const marker = `url(#${id}-${it.type === 'sync' ? 'f' : 'o'}${k})`;
      const sw = hk ? 2.4 : 1.5;
      const label = (cfg.num ? m.num + '. ' : '') + (it.t || '');
      const tst = `fill:${hk ? col : 'var(--text)'};font-size:12px;${hk ? 'font-weight:600;' : ''}paint-order:stroke;stroke:var(--code-bg);stroke-width:4px;stroke-linejoin:round`;
      let g = '';
      if (m.self) {
        const x = LX(it.from) + 5;
        g += `<path d="M${x} ${m.y - 6} h30 v18 h-24" style="fill:none;stroke:${col};stroke-width:${sw};${dash}" marker-end="${marker}"/>`;
        String(label).split('\n').forEach((ln, j) => { g += `<text x="${x + 36}" y="${m.y + 2 + j * 13}" style="${tst}">${esc(ln)}</text>`; });
        if (cfg.click) g = `<rect class="hb" x="${x - 10}" y="${m.y - 18}" width="${LW - 10}" height="40" rx="6" style="fill:transparent"/>` + g;
      } else {
        const x1 = LX(it.from), x2 = LX(it.to), dir = x2 > x1 ? 1 : -1;
        const xa = x1 + dir * 5, xb = x2 - dir * 6;
        g += `<line x1="${xa}" y1="${m.y}" x2="${xb}" y2="${m.y}" style="stroke:${col};stroke-width:${sw};${dash}" marker-end="${marker}"/>`;
        const ls = String(label).split('\n');
        ls.forEach((ln, j) => { g += `<text x="${(x1 + x2) / 2}" y="${m.y - 6 - (ls.length - 1 - j) * 13}" text-anchor="middle" style="${tst}">${esc(ln)}</text>`; });
        if (cfg.click) g = `<rect class="hb" x="${Math.min(x1, x2)}" y="${m.y - 20 - (ls.length - 1) * 13}" width="${Math.abs(x2 - x1)}" height="${28 + (ls.length - 1) * 13}" rx="6" style="fill:transparent"/>` + g;
      }
      if (cfg.mark && cfg.mark[m.i]) {
        const x = m.self ? LX(it.from) + 4 : Math.min(LX(it.from), LX(it.to)) + 4;
        g += `<circle cx="${x}" cy="${m.y - 13}" r="7" style="fill:var(--accent)"/><text x="${x}" y="${m.y - 9.5}" text-anchor="middle" style="fill:var(--surface);font:700 10px var(--f-mono)">!</text>`;
      }
      s += cfg.click ? `<g class="msq-hit" data-mi="${m.i}" tabindex="0" role="button" aria-label="Сообщение ${m.num}: ${esc(it.t || '')}">${g}</g>` : g;
    });
    s += '</svg>';
    return `<div class="msq-board">${s}</div>`;
  }

  // PlantUML-текст из той же модели
  function toPuml(lanes, items) {
    const out = ['@startuml'];
    lanes.forEach(l => out.push(`${l.kind === 'actor' ? 'actor' : 'participant'} "${l.t}" as ${l.id}${l.kind === 'ext' ? ' <<внешняя>>' : ''}`));
    const act = {};
    let ind = '';
    (items || []).forEach(it => {
      if (it.frag) { out.push(`${ind}${it.frag} ${it.guard || ''}`.trimEnd()); ind += '  '; return; }
      if (it.els != null) { out.push(`${ind.slice(2)}else ${it.els}`.trimEnd()); return; }
      if (it.end) { ind = ind.slice(2); out.push(`${ind}end`); return; }
      const arrow = it.type === 'reply' ? '-->' : it.type === 'async' ? '->>' : '->';
      out.push(`${ind}${it.from} ${arrow} ${it.to} : ${String(it.t || '').replace(/\n/g, ' ')}`);
      const lt = lanes.find(l => l.id === it.to) || {};
      if (it.type === 'sync' && it.from !== it.to && lt.kind !== 'actor') { out.push(`${ind}activate ${it.to}`); act[it.to] = (act[it.to] || 0) + 1; }
      if (it.type === 'reply' && act[it.from]) { out.push(`${ind}deactivate ${it.from}`); act[it.from]--; }
    });
    out.push('@enduml');
    return out.join('\n');
  }
  // перевод в шаги общего проигрывателя ui.seq
  const toSteps = items => items.filter(it => it.from).map(it => ({ from: it.from, to: it.to, t: it.t, note: it.note || '', reply: it.type === 'reply', kind: it.k || (it.type === 'async' ? 'violet' : ''), lost: it.lost, time: it.time }));
  const pct = x => Math.round(x * 100) + ' %';
  const quizRef = cfg => cfg.options.map((o, i) => o.ok ? i : -1).filter(i => i >= 0);

  // =====================================================================
  // Сквозной сценарий: Елена оплачивает заказ-наряд 7 800 ₽ в приложении (BR-10)
  // =====================================================================
  const PAY_LANES = [
    { id: 'client', t: 'Елена', kind: 'actor' },
    { id: 'app', t: 'Приложение', sub: 'iOS / Android' },
    { id: 'back', t: 'Бэкенд', sub: 'платёжный сервис' },
    { id: 'yk', t: 'ЮKassa', sub: 'карта, СБП', kind: 'ext' },
    { id: 'atol', t: 'Онлайн-касса', sub: 'АТОЛ, 54-ФЗ', kind: 'ext' },
    { id: 'push', t: 'Push', sub: 'FCM / APNs', kind: 'ext' }
  ];
  const PAY = [
    { type: 'sync', from: 'client', to: 'app', t: 'Оплатить 7 800 ₽', note: 'Заказ-наряд в статусе «Готов» (BR-10). Елена нажимает «Оплатить» — это начало сценария, инициатор — человек.' },
    { type: 'sync', from: 'app', to: 'back', t: 'POST /payments', note: 'Приложение просит бэкенд создать платёж. С ключом идемпотентности: если связь моргнёт и запрос уйдёт дважды, платёж создастся один раз.' },
    { type: 'sync', from: 'back', to: 'yk', t: 'POST /v3/payments', note: 'Бэкенд вызывает API ЮKassa: сумма, описание, адрес возврата в приложение. Секретный ключ магазина живёт только на сервере — никогда в приложении.' },
    { type: 'reply', from: 'yk', to: 'back', t: 'pending, confirmation_url', note: 'ЮKassa отвечает сразу: платёж создан, статус pending (ждёт оплаты), ссылка на страницу оплаты. Денег ещё нет!' },
    { type: 'reply', from: 'back', to: 'app', t: '201: ссылка на оплату', note: 'Бэкенд сохраняет платёж (payment.status = pending) и возвращает ссылку приложению.' },
    { type: 'async', from: 'app', to: 'yk', t: 'Открыть страницу оплаты', note: 'Приложение открывает страницу ЮKassa и не ждёт ответа в этом запросе. Карту Елена вводит не у нас — это снимает с «Искры» требования к хранению карточных данных.' },
    { type: 'sync', from: 'client', to: 'yk', t: 'Карта / СБП, 3-D Secure', note: 'Елена платит: карта и код из банка или СБП в приложении банка. Сколько это займёт — минута или десять — не знает никто.' },
    { type: 'reply', from: 'yk', to: 'client', t: 'Готово → в приложение', note: 'ЮKassa показывает «Готово» и возвращает Елену в приложение (return_url). Внимание: возврат в приложение — ещё не доказательство оплаты.' },
    { type: 'async', from: 'yk', to: 'back', t: 'Вебхук payment.succeeded', note: 'Когда деньги списаны, ЮKassa сама присылает уведомление (вебхук) на наш адрес. Мы его не ждём в цикле — оно приходит, когда приходит. Это асинхронное сообщение.' },
    { type: 'sync', from: 'back', to: 'back', t: 'paid, бонусы 5 %', note: 'Бэкенд сверяет платёж (по id, сумме, статусу) и сохраняет: payment = paid, бонусы 5 % от работ (BR-11).' },
    { type: 'reply', from: 'back', to: 'yk', t: '200 OK', note: 'Отвечаем ЮKassa «принято». Пока она не получит 200, будет присылать уведомление повторно.' },
    { type: 'async', from: 'back', to: 'atol', t: 'Чек «приход»', note: 'Чек по 54-ФЗ — в онлайн-кассу. Касса регистрирует чек и отправляет его в налоговую и Елене на email. Ждать её ответа в этом месте не нужно.' },
    { type: 'async', from: 'back', to: 'push', t: '«Оплата прошла»', note: 'Push: «Оплата 7 800 ₽ прошла, чек на почте». Тоже асинхронно — доставка может занять секунды.' },
    { type: 'async', from: 'push', to: 'app', t: 'Уведомление', note: 'Телефон показывает уведомление. Сценарий закончен: деньги у «Искры», чек у Елены и в налоговой, бонусы начислены.' }
  ];

  // =====================================================================
  // Теория 1. Участники, линии жизни, сообщения, активации
  // =====================================================================
  const PARTS = [
    { id: 'part', t: 'Участник', hl: {}, lane: 'back', d: 'Прямоугольник сверху — участник взаимодействия (lifeline): система, сервис, внешний сервис. Человек рисуется человечком (actor). Порядок слева направо — по ходу разговора: инициатор слева, внешние системы справа.', mis: 'Рисуют «Базу данных», «Контроллер», «Сервис», «Модуль» — уровни, которые никто не обсуждает. Участники должны быть на одном уровне детализации.' },
    { id: 'life', t: 'Линия жизни', hl: {}, lane: 'yk', d: 'Пунктир вниз от участника — его время. Сверху вниз время идёт вперёд: что ниже, то позже. Расстояние не означает длительность — только порядок.', mis: 'Пытаются читать расстояния как секунды. Если время важно — подпишите его явно: «через 20 минут» (BR-8).' },
    { id: 'sync', t: 'Синхронное сообщение', hl: { 1: 'accent', 2: 'accent', 6: 'accent' }, d: 'Сплошная линия с <b>закрашенным</b> треугольником. Отправитель ждёт ответа и ничего не делает, пока не получит. В HTTP: запрос, на который нужен ответ, чтобы продолжить.', mis: 'Нарисовали синхронный вызов — и забыли ответ. Читатель не понимает, что вернулось и когда отправитель продолжил работу.' },
    { id: 'reply', t: 'Ответ', hl: { 3: 'accent', 4: 'accent', 7: 'accent' }, d: 'Пунктирная линия с открытой стрелкой — возврат результата тому, кто спросил. Подпишите, что именно вернулось: «201: ссылка», «409: слот занят».', mis: 'Ответ «уходит» не тому, кто вызывал, или подписан «ответ». Вместо «ответ» напишите, что в нём.' },
    { id: 'async', t: 'Асинхронное сообщение', hl: { 5: 'accent', 8: 'accent', 11: 'accent', 12: 'accent' }, d: 'Сплошная линия с <b>открытой</b> стрелкой. Отправитель не ждёт: отправил и продолжил. Так приходит вебхук, так уходят чек в кассу и push.', mis: 'Рисуют асинхронный вызов и тут же «ответ» от получателя, будто отправитель ждал. Если ответ нужен — это уже синхронный вызов или отдельное асинхронное сообщение обратно.' },
    { id: 'act', t: 'Активация', hl: {}, act: true, d: 'Узкий прямоугольник на линии жизни — участник занят обработкой: от получения вызова до ответа. По длине активации видно, кто кого держит.', mis: 'Активации растягивают на всю диаграмму или не рисуют вовсе. В требованиях для аналитика они необязательны, но хорошо показывают «кто ждёт».' },
    { id: 'self', t: 'Сообщение себе', hl: { 9: 'accent' }, d: 'Стрелка, которая выходит из участника и возвращается в него же, — внутренний шаг: сохранить статус, посчитать бонусы.', mis: 'Расписывают в самосообщениях весь код. Оставляйте только то, что важно для понимания: смену статуса, правило BR-*.' }
  ];
  const CAFE_LANES = [{ id: 'g', t: 'Гость', kind: 'actor' }, { id: 'cash', t: 'Кассир' }, { id: 'term', t: 'Терминал банка', kind: 'ext' }, { id: 'bar', t: 'Бариста' }];
  const CAFE = [
    { type: 'sync', from: 'g', to: 'cash', t: 'Капучино, 250 ₽' },
    { type: 'sync', from: 'cash', to: 'term', t: 'Списать 250 ₽' },
    { type: 'reply', from: 'term', to: 'cash', t: 'Одобрено' },
    { type: 'reply', from: 'cash', to: 'g', t: 'Чек и номерок 42' },
    { type: 'async', from: 'cash', to: 'bar', t: 'Заказ № 42' },
    { type: 'async', from: 'bar', to: 'g', t: '«Сорок второй!»' }
  ];
  const howBasics = {
    id: 'how-seq-basics', covers: ['order'], title: 'Как это работает: участники, сообщения и активации', free: true, noReset: true,
    simple: {
      icon: '📨',
      plain: 'Диаграмма последовательности показывает разговор систем во времени: кто кому что отправил, в каком порядке, кто ждал ответа, а кто отправил и пошёл дальше.',
      analogy: 'Кафе: вы заказываете у кассира и ждёте, пока терминал одобрит карту (синхронно — стоите у кассы). Потом получаете номерок и садитесь — кофе принесут, когда будет готов (асинхронно — вы не стоите над баристой).',
      tech: '<b>Sequence diagram</b> — диаграмма взаимодействия UML 2.5 (OMG, раздел 17 «Interactions»). Основные элементы: lifeline (линия жизни), message (синхронное — закрашенная стрелка, асинхронное — открытая, ответ — пунктир), execution specification (активация), combined fragment (alt, opt, loop, par и др.).'
    },
    render(el) {
      el.classList.add('msq-root');
      let cur = 'sync', ex = 'iskra', mode = 'sync';
      el.innerHTML = `<div class="stack">
        <div class="eyebrow">1 · Нажмите на элемент — узнаете, что это</div>
        <div class="row"><span class="small dim">Пример:</span>${ui.seg('ex', [{ v: 'iskra', t: '🔧 Оплата в «Искре»' }, { v: 'cafe', t: '☕ Кафе у дома' }], ex, 'accent')}</div>
        <div class="msq-legend" data-parts></div>
        <div data-dg></div>
        <div data-card></div>
        <div class="eyebrow">2 · Проиграйте сценарий по шагам</div>
        <p class="small muted">Тот же сценарий в проигрывателе: каждый шаг — с пояснением. Фиолетовые стрелки — асинхронные сообщения, пунктир — ответы.</p>
        <div data-play></div>
        <div class="eyebrow">3 · Ждать или не ждать?</div>
        <p class="small muted">Бэкенд получил вебхук «оплата прошла». Чек и push можно отправить синхронно (дождаться ответа кассы и push-сервиса) или асинхронно. Посмотрите, сколько ЮKassa ждёт нашего «200 OK» и что будет, если касса тормозит.</p>
        ${ui.seg('mode', [{ v: 'sync', t: 'Синхронно: ждём кассу и push' }, { v: 'async', t: 'Асинхронно: сохранили, ответили, отправили' }, { v: 'slow', t: 'Синхронно, а касса отвечает 40 с' }], mode)}
        <div data-tl></div>
        ${ui.note('warn', 'Типичные ошибки', '<ul class="checks"><li class="bad">Нет ответа на синхронный вызов — непонятно, что вернулось и когда отправитель продолжил.</li><li class="bad">Вебхук нарисован от нашего бэкенда к ЮKassa. Уведомление присылает ЮKassa — стрелка от неё к нам.</li><li class="bad">Всё подряд синхронное. Каждая синхронная стрелка — это «ждём»: чем их больше подряд, тем дольше клиент смотрит на крутилку и тем больше точек отказа.</li><li class="bad">Участники разного уровня: «Приложение», «Таблица payment», «Метод save()». Выберите один уровень и держитесь его.</li></ul>')}
        <details class="more"><summary>Как об этом спрашивают на собеседовании</summary><div>
          <p><b>«Чем синхронное сообщение отличается от асинхронного на диаграмме и в жизни?»</b> На диаграмме — закрашенная и открытая стрелка, у синхронного обязателен ответ. В жизни — отправитель ждёт результата (HTTP-запрос и ответ) или не ждёт (сообщение в очередь, вебхук, push). Приведите пример: создание платежа в ЮKassa — синхронно, уведомление об оплате — асинхронно.</p>
          <p><b>«Зачем аналитику sequence-диаграмма, если есть описание API?»</b> Описание API показывает один вызов, диаграмма — сценарий целиком: порядок, кто инициатор, где ждём, где внешняя система может не ответить. По ней разработчики договариваются о контракте, а тестировщики видят точки отказа.</p>
        </div></details>
      </div>`;
      function draw() {
        const p = PARTS.find(x => x.id === cur);
        TR.$('[data-parts]', el).innerHTML = PARTS.map(x => `<button type="button" class="msq-opt" data-p="${x.id}" aria-pressed="${x.id === cur}">${esc(x.t)}</button>`).join('');
        const lanes = ex === 'iskra' ? PAY_LANES : CAFE_LANES;
        const items = ex === 'iskra' ? PAY.slice(0, 13) : CAFE;
        let hl = p.hl;
        if (ex === 'cafe') hl = { sync: { 0: 'accent', 1: 'accent' }, reply: { 2: 'accent', 3: 'accent' }, async: { 4: 'accent', 5: 'accent' } }[cur] || {};
        const laneHl = p.lane ? { [ex === 'iskra' ? p.lane : (p.lane === 'yk' ? 'term' : 'cash')]: 'accent' } : null;
        TR.$('[data-dg]', el).innerHTML = umlSeq({ lanes, items, hl, laneHl, hlAct: p.act, laneW: ex === 'iskra' ? 150 : 160, num: true, title: ex === 'iskra' ? 'Оплата заказ-наряда' : 'Заказ в кафе' });
        const cafe = { part: 'Гость, кассир, терминал, бариста — участники. Терминал банка — «чужая» система, как ЮKassa у нас.', life: 'Сначала заказ, потом оплата, потом кофе — сверху вниз.', sync: 'Гость ждёт у кассы, пока терминал не скажет «одобрено». Кассир ждёт терминал.', reply: '«Одобрено» и «чек с номерком» — ответы на запросы.', async: 'Кассир передаёт заказ баристе и не стоит над ним; бариста зовёт «сорок второй!», когда кофе готов.', act: 'Кассир занят с момента заказа до выдачи номерка — его активация.', self: 'Бариста «варит кофе» — внутренний шаг, можно показать стрелкой себе.' }[cur];
        TR.$('[data-card]', el).innerHTML = `<div class="card flat"><h4>${esc(p.t)}</h4><div class="msq-def">
          <span class="k">Что это</span><div class="v">${p.d}</div>
          <span class="k">${ex === 'iskra' ? 'В «Искре»' : 'В кафе'}</span><div class="v">${ex === 'iskra' ? ({ part: 'Шесть участников: Елена, приложение, бэкенд, ЮKassa, онлайн-касса, push. ЮKassa и касса — внешние (пунктирная рамка): их код писали не мы.', life: 'Сначала создаём платёж, потом Елена платит, потом приходит вебхук — порядок читается сверху вниз.', sync: 'Стрелки 2 и 3: приложение не может открыть страницу оплаты, пока не получит ссылку, — поэтому ждёт. Стрелка 7: Елена ждёт ответа банка на странице оплаты.', reply: 'Стрелки 4, 5 и 8: «pending, confirmation_url», «201: ссылка на оплату», «Готово».', async: 'Стрелки 6, 9, 12 и 13: открыть страницу оплаты, вебхук ЮKassa, чек в кассу, push.', act: 'Бэкенд активен со стрелки 2 до ответа 5: всё это время приложение ждёт.', self: 'Стрелка 10: бэкенд сохраняет payment = paid и начисляет 5 % бонусов (BR-11).' }[cur]) : cafe}</div>
          <span class="k">Ошибка</span><div class="v">${p.mis}</div></div></div>`;
      }
      ui.seq(TR.$('[data-play]', el), { lanes: PAY_LANES.map(l => ({ id: l.id, t: l.t, sub: l.sub })), steps: toSteps(PAY), laneW: 150, hint: 'Нажмите «Проиграть» или «Шаг →»: Елена оплачивает заказ-наряд 7 800 ₽.' });
      function tl() {
        const rows = mode === 'async'
          ? [['Сохранить paid', 0, 0.1, ''], ['Ответ 200 ЮKassa', 0.1, 0.12, 'o'], ['Чек в кассу (в фоне)', 0.12, 2.2, 'a'], ['Push (в фоне)', 0.12, 1.0, 'a']]
          : mode === 'sync'
            ? [['Сохранить paid', 0, 0.1, ''], ['Ждём кассу', 0.1, 2.2, 'w'], ['Ждём push', 2.2, 3.1, 'w'], ['Ответ 200 ЮKassa', 3.1, 3.12, 'o']]
            : [['Сохранить paid', 0, 0.1, ''], ['Ждём кассу…', 0.1, 10, 'w'], ['ЮKassa: «не ответили»', 10, 10.05, 'w'], ['Повтор вебхука', 10.05, 10.3, 'w']];
        const max = 10.3;
        const total = mode === 'async' ? '0,12 с' : mode === 'sync' ? '3,1 с' : '> 10 с';
        TR.$('[data-tl]', el).innerHTML = `<div class="card flat stack tight"><div class="msq-tl">${rows.map(r => `<div class="msq-tlr"><span>${esc(r[0])}</span><span class="tr"><i class="${r[3]}" style="left:${r[1] / max * 100}%;width:${Math.max(0.8, (r[2] - r[1]) / max * 100)}%"></i></span><span class="x">${String(r[2]).replace('.', ',')} с</span></div>`).join('')}</div>
          <div class="small"><b>ЮKassa ждёт «200 OK»: ${total}.</b> ${mode === 'async' ? 'Ответили сразу после сохранения. Чек и push уходят в фоне: если касса притормозит, повторим отправку чека, а ЮKassa и Елена этого не заметят.' : mode === 'sync' ? 'Пока всё работает — терпимо. Но ответ ЮKassa теперь зависит от двух чужих систем: любая из них замедлится — замедлимся и мы.' : 'Касса тормозит — мы не отвечаем ЮKassa, она считает уведомление недоставленным и присылает его снова. Если обработчик не готов к повторам, Елене начислят бонусы дважды. Синхронная цепочка переносит чужую проблему к нам.'}</div></div>`;
      }
      ui.onSeg(el, (n, v) => { if (n === 'ex') { ex = v; draw(); } if (n === 'mode') { mode = v; tl(); } });
      TR.on(el, 'click', '[data-p]', (e, b) => { cur = b.dataset.p; draw(); });
      draw(); tl();
    }
  };

  // =====================================================================
  // Теория 2. Фрагменты alt / opt / loop / par и PlantUML
  // =====================================================================
  const FL = [{ id: 'app', t: 'Приложение' }, { id: 'back', t: 'Бэкенд', sub: 'платёжный сервис' }, { id: 'yk', t: 'ЮKassa', kind: 'ext' }, { id: 'atol', t: 'Онлайн-касса', kind: 'ext' }, { id: 'push', t: 'Push', kind: 'ext' }];
  const FRAGS = {
    alt: { t: 'alt — альтернатива', d: 'Несколько веток, выполняется ровно одна — та, чьё условие (guard) истинно. Ветки разделены пунктиром, у каждой условие в квадратных скобках. Аналог «если… иначе…».',
      iskra: 'Вебхук пришёл: оплата прошла — чек и push «спасибо»; не прошла — push «не получилось, попробуйте ещё раз или оплатите на кассе».', cafe: 'Карта прошла — выдаём номерок; не прошла — «попробуйте другую карту или наличные».',
      items: [{ type: 'async', from: 'yk', to: 'back', t: 'Вебхук: статус платежа' }, { frag: 'alt', guard: 'status = succeeded' }, { type: 'async', from: 'back', to: 'atol', t: 'Чек «приход»' }, { type: 'async', from: 'back', to: 'push', t: '«Оплата прошла»' }, { els: 'status = canceled' }, { type: 'async', from: 'back', to: 'push', t: '«Оплата не прошла»' }, { end: true }] },
    opt: { t: 'opt — необязательный шаг', d: 'Одна ветка, которая выполняется, только если условие истинно. Иначе её пропускают. Аналог «если…» без «иначе».',
      iskra: 'Если у Елены есть бонусы и она хочет их списать — сначала списываем до 30 % стоимости работ (BR-11), потом создаём платёж на остаток.', cafe: 'Если есть карта лояльности — бариста отмечает штамп. Нет карты — ничего не происходит.',
      items: [{ type: 'sync', from: 'app', to: 'back', t: 'POST /payments' }, { frag: 'opt', guard: 'списать бонусы' }, { type: 'sync', from: 'back', to: 'back', t: 'Списать ≤ 30 % работ' }, { end: true }, { type: 'sync', from: 'back', to: 'yk', t: 'POST /v3/payments (остаток)' }, { type: 'reply', from: 'yk', to: 'back', t: 'confirmation_url' }, { type: 'reply', from: 'back', to: 'app', t: '201: ссылка' }] },
    loop: { t: 'loop — повторение', d: 'Ветка повторяется, пока условие истинно или заданное число раз: loop(1,3) — от одного до трёх раз. Подходит для опроса статуса и повторов.',
      iskra: 'Елена вернулась со страницы оплаты, а вебхук ещё не пришёл. Приложение спрашивает статус каждые 3 секунды, но не дольше 30 секунд, — потом показывает «проверим и пришлём push».', cafe: 'Пока очередь не дошла — гость поглядывает на табло.',
      items: [{ type: 'sync', from: 'app', to: 'back', t: 'Вернулись со страницы оплаты' }, { type: 'reply', from: 'back', to: 'app', t: 'pending' }, { frag: 'loop', guard: 'каждые 3 с, пока pending, ≤ 30 с' }, { type: 'sync', from: 'app', to: 'back', t: 'GET /payments/{id}' }, { type: 'reply', from: 'back', to: 'app', t: 'pending | paid' }, { end: true }] },
    par: { t: 'par — параллельно', d: 'Ветки выполняются одновременно, порядок между ними не важен. Разделяются пунктиром, как в alt, но выполняются все.',
      iskra: 'После оплаты чек в кассу и push уходят параллельно: ни одному не нужно ждать другого.', cafe: 'Кассир одновременно пробивает чек и передаёт заказ баристе.',
      items: [{ type: 'sync', from: 'back', to: 'back', t: 'payment = paid' }, { frag: 'par', guard: '' }, { type: 'async', from: 'back', to: 'atol', t: 'Чек «приход»' }, { els: '' }, { type: 'async', from: 'back', to: 'push', t: '«Оплата прошла»' }, { end: true }] }
  };
  const howFrag = {
    id: 'how-seq-frag', covers: ['alt'], title: 'Как это работает: фрагменты alt, opt, loop, par и PlantUML', free: true, noReset: true,
    simple: {
      icon: '🧩',
      plain: 'В жизни сценарий ветвится: оплата прошла или нет, бонусы списываем или нет, вебхука ещё нет — спрашиваем снова. Для этого на диаграмме рисуют рамки-фрагменты с условием.',
      analogy: 'Инструкция к стиральной машине: «если горит красный — проверьте фильтр, иначе — нажмите старт»; «повторяйте полоскание 2 раза». Рамка — это «если» или «повторяйте» прямо на картинке.',
      tech: '<b>Combined fragment</b> (UML 2.5, 17.6): оператор взаимодействия (alt, opt, loop, par, break, critical, ref и др.) и операнды с условиями (guard). PlantUML — текстовая нотация: диаграмма пишется кодом и хранится рядом с требованиями в git или Confluence.'
    },
    render(el) {
      el.classList.add('msq-root');
      let op = 'alt', ex = 'iskra';
      el.innerHTML = `<div class="stack">
        <div class="row">${ui.seg('op', Object.keys(FRAGS).map(k => ({ v: k, t: `<b>${k}</b>` })), op, 'accent')}${ui.seg('ex', [{ v: 'iskra', t: '🔧 «Искра»' }, { v: 'cafe', t: '☕ Кафе' }], ex)}</div>
        <div data-card></div>
        <div class="msq-two"><div data-dg></div><div data-code></div></div>
        <details class="more" open><summary>Шпаргалка PlantUML</summary><div>
          ${ui.table(['Что', 'PlantUML', 'На диаграмме'], [
            ['Человек и система', '<code>actor "Елена" as client</code>, <code>participant "Бэкенд" as back</code>', 'Человечек и прямоугольник'],
            ['Синхронное сообщение', '<code>app -> back : POST /payments</code>', 'Сплошная, закрашенный наконечник'],
            ['Асинхронное', '<code>yk ->> back : вебхук</code>', 'Сплошная, открытый наконечник'],
            ['Ответ', '<code>back --> app : 201</code>', 'Пунктир'],
            ['Активация', '<code>activate back</code> … <code>deactivate back</code>', 'Узкий прямоугольник на линии жизни'],
            ['Альтернатива', '<code>alt условие</code> … <code>else условие</code> … <code>end</code>', 'Рамка alt, ветки через пунктир'],
            ['Необязательно / цикл / параллельно', '<code>opt …</code>, <code>loop …</code>, <code>par … else … end</code>', 'Рамки opt, loop, par'],
            ['Заметка', '<code>note right of back : BR-11</code>', 'Стикер у линии жизни']
          ])}
          <p class="small muted">PlantUML удобен аналитику: диаграмма — это текст, её можно сравнивать между версиями, править в Confluence и не двигать стрелки мышкой. Нарисовали в редакторе — проверьте: каждая синхронная стрелка с ответом? Ветки alt покрывают все случаи?</p>
        </div></details>
        ${ui.note('warn', 'Типичные ошибки', '<ul class="checks"><li class="bad">alt без условий: «ветка 1», «ветка 2». Условие — проверяемое: <i>[status = succeeded]</i>, а не <i>[всё хорошо]</i>.</li><li class="bad">opt вместо alt, когда у «иначе» есть свои действия. Если при неудаче что-то происходит (push «не прошла») — это alt.</li><li class="bad">loop без границы: «пока не придёт» — а если не придёт никогда? Пишите предел: «не дольше 30 с», «до 3 раз».</li><li class="bad">Вся логика — в одной диаграмме с пятью вложенными рамками. Разбейте: основной сценарий и отдельные диаграммы для отказов (<code>ref</code> — ссылка на другую диаграмму).</li></ul>')}
        <details class="more"><summary>Как об этом спрашивают на собеседовании</summary><div>
          <p><b>«Какие фрагменты вы знаете и чем alt отличается от opt?»</b> alt — выбор одной из нескольких веток, у каждой условие; opt — одна ветка, которая может не выполниться. loop — повтор с условием или числом раз, par — параллельные ветки. Ещё бывают break (прервать сценарий), critical (неделимый участок), ref (ссылка на другую диаграмму).</p>
          <p><b>«Нарисуйте оплату с отказом»</b> — частая задачка на доске. Покажите вебхук и alt с двумя ветками, не забудьте, что при неудаче чек не пробиваем.</p>
        </div></details>
      </div>`;
      function draw() {
        const f = FRAGS[op];
        TR.$('[data-card]', el).innerHTML = `<div class="card flat"><h4>${esc(f.t)}</h4><div class="msq-def"><span class="k">Что это</span><div class="v">${f.d}</div><span class="k">${ex === 'iskra' ? 'В «Искре»' : 'В кафе'}</span><div class="v">${ex === 'iskra' ? f.iskra : f.cafe}</div></div></div>`;
        const lanes = FL.filter(l => f.items.some(it => it.from === l.id || it.to === l.id));
        TR.$('[data-dg]', el).innerHTML = umlSeq({ lanes, items: f.items, laneW: 140, title: f.t });
        TR.$('[data-code]', el).innerHTML = ui.code(toPuml(lanes, f.items), 'text', 'PlantUML');
      }
      ui.onSeg(el, (n, v) => { if (n === 'op') op = v; if (n === 'ex') ex = v; draw(); });
      draw();
    }
  };

  // =====================================================================
  // Теория 3. Синхронная и асинхронная интеграция, вебхук, тайм-ауты, идемпотентность
  // =====================================================================
  const IL = [{ id: 'app', t: 'Приложение' }, { id: 'back', t: 'Бэкенд' }, { id: 'yk', t: 'ЮKassa', kind: 'ext' }];
  const INTEGR = {
    poll: { t: 'Опрос (polling)', steps: [
      { from: 'back', to: 'yk', t: 'GET /payments/{id}', time: '0 с' }, { from: 'yk', to: 'back', t: 'pending', reply: true },
      { from: 'back', to: 'yk', t: 'GET /payments/{id}', time: '5 с' }, { from: 'yk', to: 'back', t: 'pending', reply: true },
      { from: 'back', to: 'yk', t: 'GET /payments/{id}', time: '10 с' }, { from: 'yk', to: 'back', t: 'pending', reply: true },
      { from: 'back', to: 'yk', t: 'GET /payments/{id}', time: '15 с' }, { from: 'yk', to: 'back', t: 'succeeded', reply: true, kind: 'ok' }],
      txt: 'Бэкенд каждые 5 секунд спрашивает «ну что, оплатили?». 4 запроса на один платёж, а в сезон — 3 000 записей в день и столько же оплат. Узнаём с опозданием до 5 секунд и тратим лимиты API впустую.' },
    hook: { t: 'Вебхук', steps: [
      { from: 'yk', to: 'back', t: 'POST /webhooks/yookassa: succeeded', kind: 'violet', time: '14 с' }, { from: 'back', to: 'back', t: 'проверить и сохранить' }, { from: 'back', to: 'yk', t: '200 OK', reply: true, kind: 'ok' }],
      txt: 'ЮKassa сама сообщает, когда статус изменился: один запрос, без опоздания. Наша сторона предоставляет адрес (endpoint), ЮKassa его вызывает. Технически это HTTP-запрос с ответом, но для нашего сценария — асинхронное событие: мы не знаем, когда оно придёт. Пока ЮKassa не получит 200, она повторяет уведомление (в течение суток).' },
    retry: { t: 'Тайм-аут и повтор', steps: [
      { from: 'back', to: 'yk', t: 'POST /v3/payments (ключ K-77)', time: '0 с' }, { from: 'yk', to: 'back', t: '…нет ответа', reply: true, lost: true, kind: 'bad' },
      { box: true, from: 'back', to: 'yk', t: 'тайм-аут 5 с → пауза 1 с', kind: 'warn' },
      { from: 'back', to: 'yk', t: 'POST /v3/payments (тот же K-77)', time: '6 с' }, { from: 'yk', to: 'back', t: 'тот же платёж, confirmation_url', reply: true, kind: 'ok' }],
      txt: 'Ждать вечно нельзя: поток бэкенда занят, Елена смотрит на крутилку. Ставим тайм-аут (5 секунд), потом повторяем с растущей паузой (1, 2, 4 с — экспоненциальная задержка), не больше 3 раз. Но повторять безопасно, только если запрос идемпотентный: первый запрос мог дойти — и платёж уже создан!' },
    idem: { t: 'Идемпотентность', steps: [
      { from: 'yk', to: 'back', t: 'Вебхук succeeded (№1)', kind: 'violet', time: '14 с' }, { from: 'back', to: 'back', t: 'paid, +390 бонусов' }, { from: 'back', to: 'yk', t: '200 OK', reply: true, lost: true, kind: 'bad' },
      { from: 'yk', to: 'back', t: 'Вебхук succeeded (повтор)', kind: 'warn', time: '74 с' }, { from: 'back', to: 'back', t: 'уже paid → ничего не делаем', kind: 'ok' }, { from: 'back', to: 'yk', t: '200 OK', reply: true, kind: 'ok' }],
      txt: 'Идемпотентность — повтор того же запроса даёт тот же результат, без дублей. Наш ответ 200 потерялся в сети — ЮKassa присылает вебхук ещё раз. Без проверки начислили бы 390 бонусов дважды и пробили два чека. Решение: искать платёж по id и, если он уже paid, просто ответить 200. Для исходящих запросов — заголовок Idempotence-Key: ЮKassa по одному ключу создаёт платёж один раз.' }
  };
  const howIntegr = {
    id: 'how-seq-integr', covers: ['lab'], title: 'Как это работает: синхронная и асинхронная интеграция, вебхуки, повторы', free: true, noReset: true,
    simple: {
      icon: '🔁',
      plain: 'Внешние сервисы иногда тормозят и падают. Синхронный вызов привязывает нас к их скорости и здоровью; асинхронный развязывает. Чтобы ничего не потерять и не задвоить, нужны тайм-ауты, повторы и защита от повторов.',
      analogy: 'Вы звоните в ресторан заказать доставку и висите на линии, пока оператор уточняет у кухни, — это синхронно. Оставили заказ в приложении и получили SMS, когда курьер выехал, — асинхронно. Если курьер позвонил в дверь дважды, вы не платите дважды — это идемпотентность.',
      tech: '<b>Синхронная интеграция</b> — запрос-ответ (REST, gRPC): вызывающий ждёт. <b>Асинхронная</b> — сообщения и события (брокер, очередь, вебхук): отправитель не ждёт. <b>Вебхук</b> — HTTP-вызов, который внешняя система делает на наш адрес при событии. <b>Тайм-аут</b>, <b>повтор с экспоненциальной задержкой</b> и <b>идемпотентность</b> (Idempotence-Key в API ЮKassa) — базовые приёмы надёжной интеграции (Хоп, Вульф «Шаблоны интеграции корпоративных приложений»; Ньюман «Создание микросервисов»).'
    },
    render(el) {
      el.classList.add('msq-root');
      let cur = 'poll';
      el.innerHTML = `<div class="stack">
        ${ui.table(['', 'Синхронно', 'Асинхронно'], [
          ['Как', 'Запрос и ждём ответ (HTTP, REST)', 'Отправили сообщение и пошли дальше (очередь, событие, вебхук, push)'],
          ['Когда нужно', 'Результат нужен прямо сейчас, чтобы продолжить: ссылка на оплату, свободные слоты', 'Результат не нужен сразу или придёт позже: чек, уведомления, выгрузка в 1С'],
          ['Плюсы', 'Просто понять и отладить, сразу видно ошибку', 'Не ждём, переживаем сбои соседей, выдерживаем пики'],
          ['Минусы', 'Упал сосед — упали мы; медленный сосед — медленные мы', 'Сложнее: очереди, повторы, порядок сообщений, «где моё сообщение?»'],
          ['В «Искре»', 'Создать платёж в ЮKassa, найти слоты, проверить статус', 'Вебхук ЮKassa, чек в АТОЛ, push и SMS, события «ЗН готов»']
        ])}
        <div class="eyebrow">Четыре приёма — проиграйте каждый</div>
        ${ui.seg('i', Object.keys(INTEGR).map(k => ({ v: k, t: INTEGR[k].t })), cur, 'accent')}
        <div data-txt></div>
        <div data-play></div>
        ${ui.note('', 'Что записать в требованиях к интеграции', '<ul class="checks"><li>Кто инициатор и синхронно ли: «бэкенд вызывает POST /v3/payments и ждёт ответа».</li><li>Тайм-аут и повторы: «тайм-аут 5 с, до 3 повторов с паузой 1, 2, 4 с, с тем же Idempotence-Key».</li><li>Что делать, если так и не ответили: «показать клиенту „оплатите на кассе станции“, записать инцидент».</li><li>Как защищаемся от повторов входящих: «повторный вебхук по тому же платежу не меняет данные и получает 200».</li></ul>')}
        <details class="more"><summary>Как об этом спрашивают на собеседовании</summary><div>
          <p><b>«Что такое идемпотентность и зачем она платёжке?»</b> Повтор запроса не меняет результат: второй «создать платёж» с тем же ключом не создаёт второй платёж; повторный вебхук не начисляет бонусы дважды. В сетях запросы теряются и повторяются — без идемпотентности повтор превращается в двойное списание.</p>
          <p><b>«Вебхук или опрос?»</b> Вебхук — быстро и экономно, но нужен публичный адрес, проверка подлинности и обработка повторов. Опрос — запасной путь, если вебхук не пришёл: «через 15 минут pending — спросить статус самим».</p>
        </div></details>
      </div>`;
      const seq = ui.seq(TR.$('[data-play]', el), { lanes: IL, steps: INTEGR[cur].steps, laneW: 190, hint: 'Нажмите «Проиграть».' });
      function draw() { TR.$('[data-txt]', el).innerHTML = `<p class="small">${INTEGR[cur].txt}</p>`; }
      ui.onSeg(el, (n, v) => { if (n === 'i') { cur = v; draw(); seq.set(INTEGR[cur].steps); } });
      draw();
    }
  };

  // =====================================================================
  // Практика 1. Порядок сообщений + синхронно или асинхронно
  // =====================================================================
  const ORD = [
    { id: 'o1', t: 'Приложение → бэкенд: <b>POST /payments</b> — создать платёж по заказ-наряду', s: { type: 'sync', from: 'app', to: 'back', t: 'POST /payments' } },
    { id: 'o2', t: 'Бэкенд → ЮKassa: <b>POST /v3/payments</b> — создать платёж на 7 800 ₽', s: { type: 'sync', from: 'back', to: 'yk', t: 'POST /v3/payments' } },
    { id: 'o3', t: 'ЮKassa → бэкенд: ответ — платёж <b>pending</b> и ссылка confirmation_url', s: { type: 'reply', from: 'yk', to: 'back', t: 'pending, confirmation_url' } },
    { id: 'o4', t: 'Бэкенд → приложение: ответ <b>201</b> — ссылка на страницу оплаты', s: { type: 'reply', from: 'back', to: 'app', t: '201: ссылка' } },
    { id: 'o5', t: 'Приложение открывает страницу ЮKassa, Елена платит картой или по СБП', s: { type: 'async', from: 'app', to: 'yk', t: 'Страница оплаты' } },
    { id: 'o6', t: 'ЮKassa → бэкенд: <b>вебхук</b> payment.succeeded', s: { type: 'async', from: 'yk', to: 'back', t: 'Вебхук succeeded' } },
    { id: 'o7', t: 'Бэкенд сверяет и сохраняет: платёж <b>paid</b>, бонусы 5 % от работ', s: { type: 'sync', from: 'back', to: 'back', t: 'paid, бонусы' } },
    { id: 'o8', t: 'Бэкенд → ЮKassa: ответ <b>200 OK</b> на вебхук', s: { type: 'reply', from: 'back', to: 'yk', t: '200 OK' } },
    { id: 'o9', t: 'Бэкенд → онлайн-касса: <b>чек</b> по 54-ФЗ', s: { type: 'async', from: 'back', to: 'atol', t: 'Чек «приход»' } },
    { id: 'o10', t: 'Бэкенд → push-сервис: «Оплата прошла, чек на почте»', s: { type: 'async', from: 'back', to: 'push', t: '«Оплата прошла»' } }
  ];
  const ORD_REF = ORD.map(o => o.id);
  const SY = [
    { id: 'y1', t: 'Приложение → бэкенд: создать платёж и получить ссылку на оплату', b: 'sync', why: 'Без ссылки приложение не может открыть страницу оплаты — ждём ответа.' },
    { id: 'y2', t: 'Бэкенд → ЮKassa: создать платёж', b: 'sync', why: 'Ссылка confirmation_url нужна прямо сейчас. Защищаемся тайм-аутом и Idempotence-Key.' },
    { id: 'y3', t: 'ЮKassa → бэкенд: уведомление о результате оплаты', b: 'async', why: 'Вебхук приходит, когда Елена заплатит, — мы его не ждём в открытом запросе.' },
    { id: 'y4', t: 'Бэкенд → онлайн-касса: зарегистрировать чек', b: 'async', why: 'АТОЛ принимает чек в очередь и регистрирует за секунды или минуты; результат узнаём отдельно. Держать из-за этого ЮKassa и Елену незачем.' },
    { id: 'y5', t: 'Сервис уведомлений → push-сервис: «Оплата прошла»', b: 'async', why: 'Доставка push не гарантирует мгновенности; оплата от неё не зависит.' },
    { id: 'y6', t: 'АРМ мастера → бэкенд: перевести заказ-наряд в «Готов»', b: 'sync', why: 'Марина Олеговна должна сразу увидеть, что статус сменился или почему нет (например, не закрыты доп. работы).' },
    { id: 'y7', t: 'Сервис записи → поиск свободных слотов на 30 дней вперёд', b: 'sync', why: 'Клиент ждёт список времени на экране — это запрос-ответ, НФТ: не дольше 1 с для 95 % запросов.' },
    { id: 'y8', t: 'Платёжный сервис → 1С: выгрузить оплату в бухгалтерию', b: 'async', why: 'Бухгалтерии Ольги Викторовны оплата нужна не в ту же секунду. Если 1С обновляют в выходные — выгрузка подождёт, а оплата пройдёт.' }
  ];
  const SY_B = [{ id: 'sync', t: 'Синхронно', sub: 'отправитель ждёт ответа' }, { id: 'async', t: 'Асинхронно', sub: 'отправил и продолжил' }];
  function normOrder(v) {
    const a = (v || []).slice(), i9 = a.indexOf('o9'), i10 = a.indexOf('o10');
    if (i9 > -1 && i10 > -1 && i10 < i9) { a[i9] = 'o10'; a[i10] = 'o9'; }
    return a;
  }
  function orderEval(ans) {
    const v = normOrder(ans && ans.order);
    const full = v.length === ORD.length;
    const p = id => v.indexOf(id);
    const os = full ? ui.orderScore(v, ORD_REF) : 0;
    const crit = [
      { ok: full && p('o6') > p('o5'), html: 'Вебхук приходит <b>после</b> того, как Елена заплатила на странице ЮKassa.', bad: 'Вебхук стоит раньше оплаты. ЮKassa сообщает о результате, когда деньги списаны, — не раньше.' },
      { ok: full && p('o3') > p('o2') && p('o4') > p('o3'), html: 'Ответы идут после вызовов и в обратном порядке: сначала ЮKassa отвечает бэкенду, потом бэкенд — приложению.', bad: 'Ответы перепутаны с вызовами: бэкенд не может вернуть приложению ссылку, пока не получил её от ЮKassa.' },
      { ok: full && p('o9') > p('o6') && p('o10') > p('o6'), html: 'Чек и push — только после подтверждения оплаты вебхуком.', bad: 'Чек или push раньше вебхука. Возврат Елены в приложение — не доказательство оплаты: чек на неоплаченный платёж придётся аннулировать, а push «Оплата прошла» окажется враньём.' }
    ];
    const s8 = ans && ans.sy || {};
    const syOk = SY.filter(x => s8[x.id] === x.b).length;
    const syScore = syOk / SY.length;
    const score = Math.round((0.6 * os + 0.4 * syScore) * 1000) / 1000;
    return { v, full, os, crit, syOk, syScore, score, ok: score >= 0.8 && crit.every(c => c.ok) };
  }
  const orderTask = {
    id: 'order', title: 'Соберите оплату: порядок сообщений и тип каждого',
    simple: howBasics.simple,
    lead: ui.brief({
      situation: 'Глеб: «Я положил на стол десять стрелок оплаты, но порядок перемешался. Собери, как это будет на самом деле. И заодно скажи, где мы ждём ответа, а где нет — от этого зависит, что я сделаю очередью». Ольга Викторовна просит одно: «Чек — только когда деньги точно пришли».',
      todo: [
        'Часть 1. Расставьте 10 сообщений в порядке, в котором они произойдут. Справа — живая диаграмма вашего порядка: проиграйте её.',
        'Часть 2. Разложите 8 взаимодействий «Искры Онлайн»: синхронно или асинхронно.',
        'Нажмите «Проверить». Засчитывается от 80 % (порядок 60 %, типы 40 %), если вебхук после оплаты, ответы после вызовов, а чек и push — после вебхука.'
      ],
      look: 'Ответ всегда идёт назад тому, кто спросил, и в обратном порядке: кто спросил последним, тому ответят первым. Синхронно — когда без ответа нельзя сделать следующий шаг.'
    }),
    blank: () => ({ order: [], sy: {} }),
    reference: () => ({ order: ORD_REF.slice(), sy: Object.fromEntries(SY.map(x => [x.id, x.b])) }),
    render(el, ctx) {
      el.classList.add('msq-root');
      const a = ctx.ans; a.sy = a.sy || {};
      const ev = ctx.result ? orderEval(a) : null;
      el.innerHTML = `<div class="stack">
        <div class="eyebrow">Часть 1 · Порядок сообщений</div>
        <div data-ord></div>
        <div class="small dim">Ваш порядок на диаграмме (обновляется сразу):</div>
        <div data-prev></div>
        <div class="eyebrow">Часть 2 · Синхронно или асинхронно</div>
        <div data-sy></div>
      </div>`;
      const lanes = PAY_LANES.slice(1).map(l => ({ id: l.id, t: l.t, sub: l.sub }));
      const stepsOf = v => (v || []).map(id => ORD.find(o => o.id === id)).filter(Boolean).map(o => o.s);
      const prev = ui.seq(TR.$('[data-prev]', el), { lanes, steps: toSteps(stepsOf(a.order.length ? a.order : ORD_REF.slice())), laneW: 150, start: 'all' });
      const rv = {};
      if (ev && ev.full) ev.v.forEach((id, i) => { rv[id] = ORD_REF[i] === id ? 'ok' : 'bad'; });
      ui.order(TR.$('[data-ord]', el), { items: ORD.map(o => ({ id: o.id, t: o.t })), value: a.order, readonly: ctx.readonly, reveal: ev ? rv : null, seed: 'msq-order',
        onChange: v => { a.order = v; ctx.save(); prev.set(toSteps(stepsOf(v)), { all: true }); } });
      const srv = {};
      if (ev) SY.forEach(x => { if (a.sy[x.id]) srv[x.id] = a.sy[x.id] === x.b ? 'ok' : 'bad'; });
      ui.sort(TR.$('[data-sy]', el), { items: SY.map(x => ({ id: x.id, t: x.t })), buckets: SY_B, value: a.sy, readonly: ctx.readonly, reveal: ev ? srv : null, seed: 'msq-sy',
        onChange: v => { a.sy = v; ctx.save(); } });
    },
    check(ans) {
      const r = orderEval(ans), notes = [];
      if (!r.full) notes.push({ ok: false, html: 'Порядок не собран — переставьте карточки (хотя бы одно перемещение).' });
      else {
        notes.push({ ok: r.os >= 0.95 ? true : r.os >= 0.8 ? 'warn' : false, html: `Порядок: ${pct(r.os)} пар сообщений стоят верно относительно друг друга.` });
        r.crit.forEach(c => notes.push({ ok: c.ok, html: c.ok ? c.html : c.bad }));
        const v = r.v;
        if (v.indexOf('o8') < v.indexOf('o7')) notes.push({ ok: 'warn', html: '«200 OK» стоит раньше сохранения платежа. Ответив 200 до записи в базу, вы рискуете: если сервис упадёт в эту секунду, ЮKassa больше не пришлёт уведомление, а платёж у нас останется pending. Сначала сохранить, потом ответить.' });
      }
      SY.forEach(x => {
        const g = ans && ans.sy && ans.sy[x.id];
        if (!g) notes.push({ ok: false, html: `Не разложено: «${x.t}».` });
        else if (g !== x.b) notes.push({ ok: false, html: `«${x.t}» — ${x.b === 'sync' ? 'синхронно' : 'асинхронно'}. ${x.why}` });
      });
      if (r.syOk === SY.length) notes.push({ ok: true, html: 'Все 8 взаимодействий разложены верно: ждём там, где без ответа нельзя сделать следующий шаг.' });
      return {
        ok: r.ok, score: r.score, notes,
        summary: `Порядок: ${r.full ? pct(r.os) : '—'}, типы: ${r.syOk} из ${SY.length}.`,
        mentor: r.ok ? null : 'Проиграйте свою диаграмму и спросите на каждом шаге: «А это уже можно сделать? Всё, что нужно, уже пришло?» Чек без вебхука — это чек на воздух.'
      };
    },
    explain: `<p>Сценарий делится на две половины. <b>Синхронная</b>: приложение → бэкенд → ЮKassa и ответы обратно — нужна ссылка на страницу оплаты, без неё дальше никак. <b>Асинхронная</b>: Елена платит сколько угодно долго, а ЮKassa сама сообщает результат вебхуком. Только после вебхука мы сохраняем <code>paid</code>, отвечаем «200 OK» и отправляем чек и push — параллельно, порядок между ними не важен.</p>
      <p>Частая ошибка — считать возврат на <code>return_url</code> доказательством оплаты: Елена могла закрыть страницу, банк мог отказать. Источник правды — вебхук, а при сомнениях — запрос статуса <code>GET /v3/payments/{id}</code>. Синхронность выбирают не по вкусу: синхронно — когда результат нужен для следующего шага, асинхронно — когда его можно получить позже, а сбой соседа не должен останавливать нас. Источники: UML 2.5 (OMG), раздел 17; документация API ЮKassa «Входящие уведомления»; 54-ФЗ о применении контрольно-кассовой техники.</p>`,
    refNote: 'Чек и push можно поставить в любом порядке. «200 OK» до сохранения платежа засчитывается частично.',
    report: ans => { const r = orderEval(ans); return `- Порядок: ${r.full ? pct(r.os) : '—'} (${(ans && ans.order || []).join(', ')})\n- Синхронно/асинхронно: ${r.syOk} из ${SY.length}`; }
  };

  // =====================================================================
  // Практика 2. Добавьте alt «оплата не прошла»
  // =====================================================================
  const AL = [{ id: 'yk', t: 'ЮKassa', kind: 'ext' }, { id: 'back', t: 'Бэкенд', sub: 'платёжный сервис' }, { id: 'atol', t: 'Онлайн-касса', kind: 'ext' }, { id: 'push', t: 'Push', kind: 'ext' }];
  const ALT_OPS = [{ v: 'alt', t: 'alt' }, { v: 'opt', t: 'opt' }, { v: 'loop', t: 'loop' }, { v: 'par', t: 'par' }];
  const GUARDS = [
    { v: 'succ', t: 'status = succeeded' }, { v: 'canc', t: 'status = canceled' }, { v: 'else', t: 'else (иначе)' },
    { v: 'tap', t: 'клиент нажал «Оплатить»' }, { v: 'every', t: 'каждые 5 секунд' }, { v: 'ok', t: 'всё хорошо' }
  ];
  const AM = [
    { id: 's1', m: { type: 'sync', from: 'back', to: 'back', t: 'payment = paid, бонусы 5 %' }, want: 'succ', why: 'Сохраняем оплату и начисляем бонусы — только при успехе (BR-11: после оплаты).' },
    { id: 's2', m: { type: 'async', from: 'back', to: 'atol', t: 'Чек «приход»' }, want: 'succ', why: 'Чек по 54-ФЗ — на поступившие деньги.' },
    { id: 's3', m: { type: 'async', from: 'back', to: 'push', t: '«Оплата прошла, чек на почте»' }, want: 'succ', why: 'Спасибо — тому, кто заплатил.' },
    { id: 'f1', m: { type: 'sync', from: 'back', to: 'back', t: 'payment = failed, причина' }, want: 'canc', why: 'Фиксируем отказ и причину из cancellation_details: «недостаточно средств», «отклонено банком».' },
    { id: 'f2', m: { type: 'async', from: 'back', to: 'push', t: '«Не прошла: оплатите снова или на кассе»' }, want: 'canc', why: 'Елена должна узнать об отказе и о том, что делать: повторить или заплатить на кассе станции. Заказ-наряд остаётся «Готов».' },
    { id: 'x1', m: { type: 'async', from: 'back', to: 'atol', t: 'Чек «возврат прихода»' }, want: 'none', why: 'Ловушка: денег не было — возвращать нечего. Чек возврата пробивают при возврате реально полученных денег (статус refunded).' },
    { id: 'x2', m: { type: 'sync', from: 'back', to: 'yk', t: 'Повторить списание с карты' }, want: 'none', why: 'Ловушка: списать без участия клиента нельзя — нет его согласия и подтверждения банка. Повторную оплату начинает сама Елена.' },
    { id: 'x3', m: { type: 'sync', from: 'back', to: 'back', t: 'Заказ-наряд → «Выдан»' }, want: 'none', why: 'Ловушка: «Выдан» ставит мастер, когда отдаёт машину. Оплата и выдача — разные события.' }
  ];
  const AB = [{ id: 'b1', t: 'Ветка 1', sub: 'первое условие' }, { id: 'b2', t: 'Ветка 2', sub: 'второе условие (после пунктира)' }];
  function altItems(a) {
    const head = [{ type: 'async', from: 'yk', to: 'back', t: 'Вебхук: статус платежа' }, { type: 'sync', from: 'back', to: 'yk', t: 'GET /v3/payments/{id}' }, { type: 'reply', from: 'yk', to: 'back', t: 'status' }];
    const put = a.put || {};
    const b1 = AM.filter(x => put[x.id] === 'b1').map(x => x.m), b2 = AM.filter(x => put[x.id] === 'b2').map(x => x.m);
    const gt = v => { const g = GUARDS.find(x => x.v === v); return g ? (v === 'else' ? 'else' : g.t) : ''; };
    const items = head.slice();
    if (a.op) {
      items.push({ frag: a.op, guard: gt(a.g1), k: 'accent' });
      items.push(...b1);
      if (a.op !== 'opt' && a.op !== 'loop') { items.push({ els: gt(a.g2) }); items.push(...b2); }
      else items.push(...b2);
      items.push({ end: true });
    } else items.push(...b1, ...b2);
    items.push({ type: 'reply', from: 'back', to: 'yk', t: '200 OK' });
    return items;
  }
  function altEval(a) {
    a = a || {}; const put = a.put || {};
    const sOp = a.op === 'alt' ? 1 : 0;
    // ветки по смыслу: какая ветка «успех», какая «отказ»
    const sem = { b1: a.g1 === 'succ' ? 'succ' : a.g1 === 'canc' ? 'canc' : null, b2: a.g2 === 'succ' ? 'succ' : a.g2 === 'canc' ? 'canc' : a.g2 === 'else' ? (a.g1 === 'succ' ? 'canc' : a.g1 === 'canc' ? 'succ' : null) : null };
    const sG = sem.b1 && sem.b2 && sem.b1 !== sem.b2 ? 1 : (sem.b1 || sem.b2) ? 0.5 : 0;
    let good = 0, traps = 0;
    const per = AM.map(x => {
      const b = put[x.id];
      if (x.want === 'none') { if (b) { traps++; return { x, s: 'bad' }; } return { x, s: 'ok' }; }
      if (!b) return { x, s: 'miss' };
      const meaning = sem[b];
      if (meaning === x.want) { good++; return { x, s: 'ok' }; }
      return { x, s: 'bad' };
    });
    const need = AM.filter(x => x.want !== 'none').length;
    const sM = Math.max(0, (good - traps) / need);
    const score = Math.round((0.2 * sOp + 0.2 * sG + 0.6 * sM) * 1000) / 1000;
    return { sOp, sG, sM, good, traps, per, score, ok: score >= 0.8 && sOp === 1 && traps === 0 };
  }
  const altTask = {
    id: 'alt', title: 'Добавьте фрагмент alt «оплата не прошла»',
    simple: howFrag.simple,
    lead: ui.brief({
      situation: 'Даша показывает экран: «В диаграмме у нас только счастливый путь. А если банк Елене отказал? Мне нужно знать, какой push придёт и что показать в приложении». Лиза добавляет: «И я хочу видеть, что при отказе чек не пробивается — Ольга Викторовна меня съест».',
      todo: [
        'Выберите оператор фрагмента и условия веток.',
        'Разложите сообщения по веткам. Лишние оставьте в стопке — не каждое сообщение нужно.',
        'Справа — живой предпросмотр: диаграмма и PlantUML-код.',
        'Нажмите «Проверить». Засчитывается от 80 %, если оператор — alt и в ветки не попала ни одна ловушка.'
      ],
      look: 'Успех и отказ взаимоисключающие, и у каждого свои действия — значит, нужен фрагмент с двумя ветками. Условия пишутся по статусам ЮKassa: succeeded и canceled.'
    }),
    blank: () => ({ op: '', g1: '', g2: '', put: {} }),
    reference: () => ({ op: 'alt', g1: 'succ', g2: 'canc', put: { s1: 'b1', s2: 'b1', s3: 'b1', f1: 'b2', f2: 'b2' } }),
    render(el, ctx) {
      el.classList.add('msq-root');
      const a = ctx.ans; a.put = a.put || {};
      const ev = ctx.result ? altEval(a) : null;
      const sel = (k, label) => `<label class="field" style="min-width:0"><span>${label}</span><select data-k="${k}" aria-label="${label}" ${ctx.readonly ? 'disabled' : ''}><option value="">Выберите…</option>${GUARDS.map(g => `<option value="${g.v}" ${a[k] === g.v ? 'selected' : ''}>[${esc(g.t)}]</option>`).join('')}</select></label>`;
      el.innerHTML = `<div class="stack">
        <div class="row"><span class="small dim">Оператор:</span><div class="msq-opts" data-ops></div></div>
        <div class="msq-g2">${sel('g1', 'Условие ветки 1')}${sel('g2', 'Условие ветки 2')}</div>
        <div data-sort></div>
        <div class="msq-two"><div data-dg></div><div data-code></div></div>
      </div>`;
      function ops() {
        TR.$('[data-ops]', el).innerHTML = ALT_OPS.map(o => `<button type="button" class="msq-opt ${ev && a.op === o.v ? (o.v === 'alt' ? 'ok' : 'bad') : ''}" data-op="${o.v}" aria-pressed="${a.op === o.v}" ${ctx.readonly ? 'disabled' : ''}><b>${o.t}</b></button>`).join('');
      }
      function prev() {
        const items = altItems(a);
        TR.$('[data-dg]', el).innerHTML = umlSeq({ lanes: AL, items, laneW: 150, title: 'Обработка вебхука ЮKassa' });
        TR.$('[data-code]', el).innerHTML = ui.code(toPuml(AL, items), 'text', 'PlantUML — обновляется вживую');
      }
      ops(); prev();
      const rv = {};
      if (ev) ev.per.forEach(p => { if (a.put[p.x.id]) rv[p.x.id] = p.s === 'ok' ? 'ok' : 'bad'; });
      ui.sort(TR.$('[data-sort]', el), { items: AM.map(x => ({ id: x.id, t: x.m.t, sub: x.m.from === x.m.to ? 'бэкенд — себе' : `${AL.find(l => l.id === x.m.from).t} → ${AL.find(l => l.id === x.m.to).t}` })), buckets: AB, value: a.put, readonly: ctx.readonly, reveal: ev ? rv : null, seed: 'msq-alt',
        onChange: v => { a.put = v; ctx.save(); prev(); } });
      TR.on(el, 'click', '[data-op]', (e, b) => { if (ctx.readonly) return; a.op = b.dataset.op; ctx.save(); ctx.decide('Оператор фрагмента', a.op); ops(); prev(); });
      TR.on(el, 'change', 'select[data-k]', (e, s) => { if (ctx.readonly) return; a[s.dataset.k] = s.value; ctx.save(); prev(); });
    },
    check(ans) {
      const r = altEval(ans), a = ans || {}, notes = [];
      if (!a.op) notes.push({ ok: false, html: 'Оператор не выбран.' });
      else if (a.op === 'alt') notes.push({ ok: true, html: 'alt — верно: две взаимоисключающие ветки, у каждой свои действия.' });
      else notes.push({ ok: false, html: { opt: 'opt — одна необязательная ветка. Но при отказе тоже есть действия (push «не прошла»), а «иначе» у opt нет.', loop: 'loop — повторение. Мы не повторяем обработку вебхука, а выбираем одну из веток.', par: 'par — ветки выполняются обе и одновременно. Успех и отказ одновременно не бывают.' }[a.op] });
      if (r.sG === 1) notes.push({ ok: true, html: 'Условия проверяемые и покрывают оба исхода: succeeded и canceled (или «иначе»).' });
      else notes.push({ ok: false, html: 'Условия веток: нужны проверяемые условия по статусу платежа — [status = succeeded] и [status = canceled] или [else]. «Всё хорошо» не проверишь, «клиент нажал» и «каждые 5 секунд» — про другое.' });
      r.per.forEach(p => {
        if (p.s === 'ok' && p.x.want !== 'none') return;
        if (p.s === 'ok') return;
        if (p.s === 'miss') notes.push({ ok: false, html: `Не размещено: «${esc(p.x.m.t)}». ${p.x.why}` });
        else notes.push({ ok: false, html: `«${esc(p.x.m.t)}» — ${p.x.want === 'none' ? 'не нужно ни в одной ветке' : 'в другой ветке'}. ${p.x.why}` });
      });
      if (r.good === 5 && !r.traps) notes.push({ ok: true, html: 'Сообщения разложены верно: при успехе — paid, чек и «спасибо»; при отказе — failed и понятный push без чека.' });
      return {
        ok: r.ok, score: r.score, notes,
        summary: `Оператор: ${a.op || '—'}, условия: ${r.sG === 1 ? 'верно' : 'неверно'}, сообщения: ${r.good} из 5${r.traps ? `, ловушек: ${r.traps}` : ''}.`,
        mentor: r.ok ? null : 'Спросите себя за каждую стрелку: «Это нужно, если деньги пришли? А если не пришли?» Если ни там ни там — ей нет места в диаграмме.'
      };
    },
    explain: `<p>Ветвление по результату — это <b>alt</b>: ровно одна ветка из нескольких, у каждой своё проверяемое условие. Условия берём из модели данных ЮKassa: <code>succeeded</code> и <code>canceled</code>. При успехе — <code>paid</code>, бонусы, чек и push; при отказе — <code>failed</code> с причиной и push, который говорит, что делать дальше: оплатить снова или на кассе станции.</p>
      <p>Три ловушки — типичные ошибки на проектах: чек возврата на неполученные деньги (Ольга Викторовна получит расхождение с налоговой), автоматическое повторное списание (нельзя без клиента) и смешение оплаты с выдачей машины. Обратите внимание на <code>GET /v3/payments/{id}</code> перед alt: ЮKassa советует не верить уведомлению на слово, а сверить статус по API. Источники: UML 2.5, 17.6 «Combined Fragments»; документация ЮKassa «Статусы платежа»; 54-ФЗ.</p>`,
    refNote: 'Ветки можно поменять местами, если условия поменяны вместе с ними. Условие второй ветки — canceled или else.',
    report: ans => { const r = altEval(ans); return `- Оператор: ${(ans && ans.op) || '—'}\n- Условия: ${r.sG === 1 ? 'верно' : 'неверно'}\n- Сообщения: ${r.good}/5, ловушек ${r.traps}`; }
  };

  // =====================================================================
  // Практика 3. Найдите ошибки в диаграмме Даши
  // =====================================================================
  const BL = [{ id: 'app', t: 'Приложение' }, { id: 'back', t: 'Бэкенд' }, { id: 'yk', t: 'ЮKassa', kind: 'ext' }, { id: 'onec', t: '1С', kind: 'ext' }, { id: 'atol', t: 'Онлайн-касса', kind: 'ext' }, { id: 'push', t: 'Push', kind: 'ext' }];
  const BUG = [
    { type: 'sync', from: 'app', to: 'back', t: 'POST /payments' },
    { type: 'sync', from: 'back', to: 'yk', t: 'POST /v3/payments', err: 'noreply', why: 'Синхронный вызов без ответа: откуда бэкенд взял ссылку, которую сразу отдаёт приложению? Не хватает ответа ЮKassa «pending, confirmation_url».' },
    { type: 'reply', from: 'back', to: 'app', t: '201: confirmation_url' },
    { type: 'async', from: 'app', to: 'yk', t: 'Открыть страницу оплаты' },
    { type: 'async', from: 'back', to: 'push', t: '«Оплата прошла» (вернулись в приложение)', err: 'order', why: 'Не на своём месте: возврат в приложение — не оплата. Елена могла закрыть страницу, банк мог отказать. Push «оплата прошла» — только после вебхука succeeded.' },
    { type: 'async', from: 'back', to: 'yk', t: 'Вебхук payment.succeeded', err: 'dir', why: 'Перепутано направление: уведомление присылает ЮKassa на наш адрес, стрелка — от ЮKassa к бэкенду.' },
    { type: 'sync', from: 'back', to: 'onec', t: 'Подтвердить оплату', err: 'extra', why: 'Лишний участник: 1С не участвует в онлайн-оплате. Оплаты выгружаются в бухгалтерию потом, в фоне. С таким вызовом оплата встанет каждый раз, когда 1С обновляют в выходные.' },
    { type: 'reply', from: 'onec', to: 'back', t: 'OK', err: 'extra', why: 'Это ответ лишнего вызова 1С — та же ошибка.' },
    { type: 'sync', from: 'back', to: 'back', t: 'payment = paid' },
    { type: 'async', from: 'app', to: 'atol', t: 'Чек «приход»', err: 'sender', why: 'Не тот отправитель: чек отправляет бэкенд. Ключи доступа к кассе нельзя класть в приложение — их вытащат, а приложение Елена может закрыть до отправки, и чека не будет.' },
    { type: 'reply', from: 'back', to: 'yk', t: '200 OK' }
  ];
  const ERR_T = [{ v: 'dir', t: 'Перепутано направление' }, { v: 'noreply', t: 'Синхронный вызов без ответа' }, { v: 'extra', t: 'Лишний участник или вызов' }, { v: 'order', t: 'Не на своём месте во времени' }, { v: 'sender', t: 'Не тот отправитель' }, { v: 'type', t: 'Не тот тип (синхр./асинхр.)' }];
  const BUG_KEYS = ['noreply', 'order', 'dir', 'extra', 'sender'];
  function bugsEval(ans) {
    const m = (ans && ans.marks) || {};
    let found = 0, fp = 0;
    const per = {};
    BUG_KEYS.forEach(k => {
      const idx = BUG.map((b, i) => b.err === k ? i : -1).filter(i => i >= 0);
      const hit = idx.find(i => m[i] != null);
      if (hit == null) { per[k] = 'miss'; return; }
      const right = idx.some(i => m[i] === k);
      per[k] = right ? 'ok' : 'warn'; found += right ? 1 : 0.5;
    });
    Object.keys(m).forEach(i => { if (!BUG[i] || !BUG[i].err) fp++; });
    const score = Math.max(0, Math.round((found / BUG_KEYS.length - 0.15 * fp) * 1000) / 1000);
    return { found, fp, per, score, ok: score >= 0.8 };
  }
  const bugsTask = {
    id: 'bugs', title: 'Найдите ошибки в диаграмме Даши',
    lead: ui.brief({
      situation: 'Даша за вечер набросала оплату в PlantUML для своего экрана и просит: «Посмотри перед тем, как я покажу Глебу. Вроде всё логично, но Глеб всегда что-то находит». В диаграмме пять ошибок разного рода.',
      todo: [
        'Прочитайте PlantUML-код и диаграмму. Нажмите на сообщение с ошибкой (на диаграмме или номер в ряду кнопок) — оно появится в списке.',
        'Для каждого отмеченного сообщения выберите, что с ним не так.',
        'Нажмите «Проверить». Засчитывается от 80 %: верный тип ошибки — полный балл, неверный — половина, каждое ошибочно отмеченное верное сообщение — минус 15 %.'
      ],
      look: 'Пройдите по чек-листу: у каждой синхронной стрелки есть ответ? Каждая стрелка идёт от того, кто на самом деле начинает? Все участники нужны в этом сценарии? Нет ли действия раньше, чем для него появились основания?'
    }),
    blank: () => ({ marks: {} }),
    reference: () => { const m = {}; BUG.forEach((b, i) => { if (b.err && !(b.err === 'extra' && b.type === 'reply')) m[i] = b.err; }); return { marks: m }; },
    render(el, ctx) {
      el.classList.add('msq-root');
      const a = ctx.ans; a.marks = a.marks || {};
      const ev = ctx.result ? bugsEval(a) : null;
      el.innerHTML = `<div class="stack">
        <div class="msq-two"><div data-code></div><div class="stack tight"><div class="small dim">Отметить сообщение:</div><div class="msq-opts" data-nums></div><div class="small dim">Повторное нажатие снимает отметку.</div></div></div>
        <div data-dg></div>
        <div class="eyebrow">Найденные ошибки</div>
        <div class="msq-found" data-found></div>
      </div>`;
      TR.$('[data-code]', el).innerHTML = ui.code(toPuml(BL, BUG), 'text', 'diagram_dasha.puml');
      function draw() {
        const hl = {};
        if (ev) BUG.forEach((b, i) => { if (a.marks[i] != null) hl[i] = b.err ? (a.marks[i] === b.err ? 'ok' : 'warn') : 'bad'; else if (ctx.readonly && b.err) hl[i] = 'ok'; });
        else Object.keys(a.marks).forEach(i => { hl[i] = 'accent'; });
        TR.$('[data-dg]', el).innerHTML = umlSeq({ lanes: BL, items: BUG, laneW: 140, num: true, click: !ctx.readonly, hl, mark: a.marks, title: 'Диаграмма Даши' });
        TR.$('[data-nums]', el).innerHTML = BUG.map((b, i) => `<button type="button" class="msq-opt" data-n="${i}" aria-pressed="${a.marks[i] != null}" ${ctx.readonly ? 'disabled' : ''} aria-label="Сообщение ${i + 1}">${i + 1}</button>`).join('');
        const keys = Object.keys(a.marks).map(Number).sort((x, y) => x - y);
        TR.$('[data-found]', el).innerHTML = keys.length ? keys.map(i => {
          const b = BUG[i];
          const cls = ev ? (b.err ? (a.marks[i] === b.err ? 'ok' : 'warn') : 'bad') : '';
          const why = ev ? `<div class="why">${b.err ? (a.marks[i] === b.err ? b.why : 'Ошибка здесь есть, но другого рода. ' + b.why) : 'Здесь всё верно — это сообщение на своём месте.'}</div>` : '';
          return `<div class="it ${cls}"><span><b>${i + 1}.</b> ${esc(BL.find(l => l.id === b.from).t)} → ${esc(BL.find(l => l.id === b.to).t)}: ${esc(b.t)}</span>
            <select data-e="${i}" aria-label="Тип ошибки в сообщении ${i + 1}" ${ctx.readonly ? 'disabled' : ''}><option value="">Что не так?</option>${ERR_T.map(t => `<option value="${t.v}" ${a.marks[i] === t.v ? 'selected' : ''}>${esc(t.t)}</option>`).join('')}</select>${why}</div>`;
        }).join('') : '<div class="small dim">Пока ничего не отмечено.</div>';
      }
      function toggle(i) { if (ctx.readonly) return; if (a.marks[i] != null) delete a.marks[i]; else a.marks[i] = ''; ctx.save(); draw(); }
      TR.on(el, 'click', '[data-n]', (e, b) => toggle(+b.dataset.n));
      TR.on(el, 'click', '.msq-hit', (e, g) => toggle(+g.dataset.mi));
      TR.on(el, 'keydown', '.msq-hit', (e, g) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(+g.dataset.mi); } });
      TR.on(el, 'change', 'select[data-e]', (e, s) => { if (ctx.readonly) return; a.marks[s.dataset.e] = s.value; ctx.save(); });
      draw();
    },
    check(ans) {
      const r = bugsEval(ans), notes = [];
      const names = { noreply: 'нет ответа ЮKassa на создание платежа', order: 'push «оплата прошла» до вебхука', dir: 'направление вебхука', extra: 'лишний участник 1С', sender: 'чек отправляет приложение' };
      BUG_KEYS.forEach(k => {
        const b = BUG.find(x => x.err === k);
        if (r.per[k] === 'ok') notes.push({ ok: true, html: `Найдено: ${names[k]}.` });
        else if (r.per[k] === 'warn') notes.push({ ok: 'warn', html: `Место найдено (${names[k]}), но тип ошибки другой. ${b.why}` });
        else notes.push({ ok: false, html: `Пропущено: ${b.why}` });
      });
      if (r.fp) notes.push({ ok: false, html: `Отмечено верных сообщений как ошибочных: ${r.fp}. Например, «201: confirmation_url» и «200 OK» — правильные ответы, а «payment = paid» — нужный внутренний шаг.` });
      return {
        ok: r.ok, score: r.score, notes,
        summary: `Найдено ошибок: ${r.found} из ${BUG_KEYS.length}${r.fp ? `, ложных отметок: ${r.fp}` : ''}.`,
        mentor: r.ok ? null : 'Читайте диаграмму, как Глеб: на каждой стрелке — «кто это начинает? откуда он это знает? кто ему ответил?».'
      };
    },
    explain: `<p>Пять ошибок — пять разных вопросов ревью. <b>Нет ответа</b> на синхронный вызов: читатель не видит, откуда взялась ссылка. <b>Время</b>: push «оплата прошла» до вебхука — самая дорогая ошибка, клиент уедет, думая, что заплатил. <b>Направление</b>: вебхук всегда от внешней системы к нам. <b>Лишний участник</b>: 1С в онлайн-оплате делает «Искру» заложником обновлений бухгалтерии. <b>Отправитель</b>: всё, что требует секретных ключей (касса, ЮKassa), делает сервер, а не телефон.</p>
      <p>Такое ревью — обычная работа аналитика: диаграмму показывают разработчикам до кода, потому что исправить стрелку стоит минуту, а исправить релиз — неделю. Полезно держать чек-лист ревью sequence-диаграмм: участники одного уровня; ответы у синхронных вызовов; направление; что можно сделать асинхронно; что будет при отказе каждой внешней системы.</p>`,
    refNote: 'Ошибку «лишний участник» можно отметить на вызове 1С или на его ответе.',
    report: ans => { const r = bugsEval(ans); return `- Найдено: ${r.found}/${BUG_KEYS.length}, ложных: ${r.fp}`; }
  };

  // =====================================================================
  // Практика 4. Конструктор диаграммы по тексту: предоплата 500 ₽ (BR-4)
  // =====================================================================
  const KL = [{ id: 'app', t: 'Приложение' }, { id: 'book', t: 'Сервис записи' }, { id: 'pay', t: 'Платёжный сервис' }, { id: 'yk', t: 'ЮKassa', kind: 'ext' }, { id: 'push', t: 'Push', kind: 'ext' }];
  const KM = [
    { id: 'L1', t: 'Записаться на ТО', from: 'app', to: 'book', type: 'sync', req: true },
    { id: 'L2', t: 'Создать платёж 500 ₽', from: 'book', to: 'pay', type: 'sync', req: true },
    { id: 'L3', t: 'POST /v3/payments', from: 'pay', to: 'yk', type: 'sync', req: true },
    { id: 'L4', t: 'confirmation_url', from: 'yk', to: 'pay', type: 'reply', req: true },
    { id: 'L5', t: 'payment_id, ссылка', from: 'pay', to: 'book', type: 'reply', req: true },
    { id: 'L6', t: '«Ждёт предоплаты» + ссылка', from: 'book', to: 'app', type: 'reply', req: true },
    { id: 'L12', t: 'Открыть страницу оплаты', from: 'app', to: 'yk', type: 'any', req: false },
    { id: 'L7', t: 'Вебхук payment.succeeded', from: 'yk', to: 'pay', type: 'async', req: true },
    { id: 'L8', t: '200 OK', from: 'pay', to: 'yk', type: 'reply', req: true },
    { id: 'L9', t: 'Событие «предоплата получена»', from: 'pay', to: 'book', type: 'async', req: true },
    { id: 'L10', t: 'Запись → «Подтверждена»', from: 'book', to: 'book', type: 'any', req: false },
    { id: 'L11', t: '«Запись подтверждена»', from: 'book', to: 'push', type: 'async', req: true },
    { id: 'D1', t: 'Проверить остатки в 1С', from: 'book', to: 'book', type: 'any', req: false, trap: 'В сценарии нет запчастей и 1С — лишнее усложняет диаграмму.' },
    { id: 'D2', t: 'Списать 500 ₽ с карты автоматически', from: 'pay', to: 'yk', type: 'sync', req: false, trap: 'Без клиента списать нельзя: оплату подтверждает Елена на странице ЮKassa.' }
  ];
  const KREQ = KM.filter(x => x.req);
  const KTY = [{ v: 'sync', t: '→ синхр.' }, { v: 'async', t: '⇢ асинхр.' }, { v: 'reply', t: '⤶ ответ' }];
  const BUILD_TXT = 'Елена дважды подряд не приехала на запись, поэтому по BR-4 онлайн-запись для неё — только с предоплатой 500 ₽. Она записывается на ТО в приложении. Сервис записи создаёт запись в статусе «Ждёт предоплаты» и просит платёжный сервис создать платёж на 500 ₽; тот создаёт его в ЮKassa и получает ссылку на оплату, которая через сервис записи возвращается в приложение. Елена платит на странице ЮKassa. ЮKassa присылает платёжному сервису уведомление об успешной оплате, тот отвечает «200 OK» и публикует событие «предоплата получена». Сервис записи переводит запись в «Подтверждена» и отправляет Елене push «Запись подтверждена». 500 ₽ засчитаются в оплату визита.';
  function buildEval(ans) {
    const rows = (ans && ans.rows) || [];
    const seen = {}, per = {};
    let traps = 0;
    rows.forEach((r, i) => { const m = KM.find(x => x.id === r.l); if (!m) return; if (m.trap) traps++; if (seen[m.id] == null) seen[m.id] = i; });
    let sum = 0;
    KREQ.forEach(m => {
      if (seen[m.id] == null) { per[m.id] = { s: 0, miss: true }; return; }
      const r = rows[seen[m.id]];
      const dirOk = r.from === m.from && r.to === m.to, rev = r.from === m.to && r.to === m.from;
      const typeOk = m.type === 'any' || r.type === m.type;
      const s = (dirOk ? 0.6 : 0) + (typeOk ? 0.4 : 0);
      per[m.id] = { s, dirOk, rev, typeOk };
      sum += s;
    });
    const present = KREQ.filter(m => seen[m.id] != null).map(m => m.id);
    const order = present.length > 1 ? ui.orderScore(present.slice().sort((x, y) => seen[x] - seen[y]), present) : (present.length ? 1 : 0);
    const items = sum / KREQ.length;
    const score = Math.max(0, Math.round((0.8 * items + 0.2 * order * (present.length / KREQ.length) - 0.1 * traps) * 1000) / 1000);
    return { per, items, order, traps, present: present.length, score, ok: score >= 0.8 };
  }
  function buildItems(rows) {
    return rows.filter(r => r.l && r.from && r.to).map(r => { const m = KM.find(x => x.id === r.l); return { type: r.from === r.to ? 'sync' : (r.type || 'sync'), from: r.from, to: r.to, t: m ? m.t : '?' }; });
  }
  function buildSigns(rows) {
    const items = buildItems(rows), out = [];
    // каждый синхронный вызов между разными участниками должен получить ответ от вызванного к вызвавшему
    const pend = [];
    let replyOk = true, replyWrong = false;
    items.forEach(it => {
      if (it.type === 'sync' && it.from !== it.to) pend.push(it);
      if (it.type === 'reply') { const p = pend.pop(); if (!p) replyWrong = true; else if (p.to !== it.from || p.from !== it.to) replyWrong = true; }
    });
    if (pend.length) replyOk = false;
    out.push({ ok: items.length ? (replyOk && !replyWrong) : null, t: 'У каждого синхронного вызова есть ответ, и он идёт к тому, кто вызывал' });
    const hook = items.find(it => /Вебхук/.test(it.t));
    out.push({ ok: hook ? hook.from === 'yk' : null, t: 'Вебхук приходит от внешней системы' });
    const conf = items.findIndex(it => /подтверждена/i.test(it.t) && it.to === 'push'), hk = items.findIndex(it => /Вебхук/.test(it.t));
    out.push({ ok: conf > -1 && hk > -1 ? conf > hk : null, t: 'Push «Запись подтверждена» — после уведомления об оплате' });
    out.push({ ok: items.length ? !items.some(it => it.from === 'app' && (it.to === 'pay' || (it.to === 'yk' && it.type !== 'sync' && it.type !== 'async'))) : null, t: 'Приложение говорит только с сервисом записи и страницей оплаты' });
    return out;
  }
  const builderTask = {
    id: 'builder', title: 'Конструктор: диаграмма предоплаты по тексту (BR-4)',
    lead: ui.brief({
      situation: 'Артём: «Предоплата для тех, кто дважды не приехал, — в MVP. Нужна диаграмма к задаче, Глеб завтра начинает». Вера отдала вам текстовый сценарий, согласованный с Мариной Олеговной: переведите его в диаграмму последовательности.',
      todo: [
        'Прочитайте сценарий. Добавляйте сообщения по порядку: подпись, кто отправляет, кому, тип.',
        'Диаграмма и PlantUML справа обновляются сразу. Под ними — живые признаки качества.',
        'Не всё из списка подписей нужно: две — лишние.',
        'Нажмите «Проверить». Засчитывается от 80 %: каждое из 10 обязательных сообщений — направление 60 % и тип 40 %, плюс порядок; лишние сообщения снижают оценку.'
      ],
      lookTitle: 'Подсказка',
      look: 'Цепочка «вызов — вызов — вызов» и ответы обратно в обратном порядке. Ссылка возвращается тем же путём, каким шёл запрос. Уведомление об оплате и событие для сервиса записи — асинхронные.'
    }),
    blank: () => ({ rows: [{ l: 'L1', from: 'app', to: 'book', type: 'sync' }] }),
    reference: () => ({ rows: KM.filter(x => x.req || x.id === 'L12' || x.id === 'L10').map(x => ({ l: x.id, from: x.from, to: x.to, type: x.type === 'any' ? (x.from === x.to ? 'sync' : 'async') : x.type })) }),
    render(el, ctx) {
      el.classList.add('msq-root');
      const a = ctx.ans; a.rows = a.rows || [];
      const ev = ctx.result ? buildEval(a) : null;
      el.innerHTML = `<div class="stack">
        ${ui.note('', 'Сценарий', BUILD_TXT)}
        <div class="stack tight" data-rows></div>
        ${ctx.readonly ? '' : '<div class="row"><button type="button" class="btn sm" data-add>+ Добавить сообщение</button><span class="small dim" data-cnt></span></div>'}
        <div data-dg></div>
        <div class="msq-two"><div data-code></div><div class="stack tight"><div class="eyebrow">Живые признаки</div><div class="msq-signs" data-signs></div></div></div>
      </div>`;
      const opt = (list, v) => list.map(o => `<option value="${o.id}" ${v === o.id ? 'selected' : ''}>${esc(o.t)}</option>`).join('');
      function rowsHTML() {
        TR.$('[data-rows]', el).innerHTML = a.rows.map((r, i) => {
          let cls = '', why = '';
          if (ev) {
            const m = KM.find(x => x.id === r.l), p = m && ev.per[m.id];
            const first = m && a.rows.findIndex(x => x.l === m.id) === i;
            if (!m) cls = 'bad';
            else if (m.trap) { cls = 'bad'; why = m.trap; }
            else if (!m.req) cls = 'ok';
            else if (!first) { cls = 'warn'; why = 'Повтор — засчитывается первое такое сообщение.'; }
            else { cls = p.s === 1 ? 'ok' : p.s > 0 ? 'warn' : 'bad'; why = p.s === 1 ? '' : [!p.dirOk ? (p.rev ? 'Направление перевёрнуто.' : `Не те участники: ${KL.find(l => l.id === m.from).t} → ${KL.find(l => l.id === m.to).t}.`) : '', !p.typeOk ? `Тип: ${({ sync: 'синхронный вызов', async: 'асинхронное сообщение', reply: 'ответ' })[m.type]}.` : ''].join(' '); }
          }
          return `<div class="msq-brow ${cls}"><span class="n">${i + 1}</span>
            <select class="lab" data-f="l" data-i="${i}" aria-label="Подпись сообщения ${i + 1}" ${ctx.readonly ? 'disabled' : ''}><option value="">Подпись…</option>${opt(KM, r.l)}</select>
            <select data-f="from" data-i="${i}" aria-label="Отправитель сообщения ${i + 1}" ${ctx.readonly ? 'disabled' : ''}><option value="">От кого…</option>${opt(KL, r.from)}</select>
            <select data-f="to" data-i="${i}" aria-label="Получатель сообщения ${i + 1}" ${ctx.readonly ? 'disabled' : ''}><option value="">Кому…</option>${opt(KL, r.to)}</select>
            <div class="seg" role="group">${KTY.map(t => `<button type="button" data-ty="${t.v}" data-i="${i}" aria-pressed="${r.type === t.v}" ${ctx.readonly ? 'disabled' : ''}>${t.t}</button>`).join('')}</div>
            ${ctx.readonly ? '<span></span>' : `<div class="tools"><button type="button" class="btn sm ghost" data-mv="-1" data-i="${i}" aria-label="Выше" ${i === 0 ? 'disabled' : ''}>↑</button><button type="button" class="btn sm ghost" data-mv="1" data-i="${i}" aria-label="Ниже" ${i === a.rows.length - 1 ? 'disabled' : ''}>↓</button><button type="button" class="btn sm ghost" data-del="${i}" aria-label="Удалить">✕</button></div>`}
            ${why ? `<div class="why">${why}</div>` : ''}</div>`;
        }).join('') || '<div class="small dim">Сообщений пока нет.</div>';
        const c = TR.$('[data-cnt]', el); if (c) c.textContent = `Сообщений: ${a.rows.length}`;
      }
      function prev() {
        const items = buildItems(a.rows);
        TR.$('[data-dg]', el).innerHTML = items.length ? umlSeq({ lanes: KL, items, laneW: 150, num: true, title: 'Предоплата по BR-4' }) : '<div class="small dim">Здесь появится диаграмма.</div>';
        TR.$('[data-code]', el).innerHTML = ui.code(toPuml(KL, items), 'text', 'PlantUML');
        TR.$('[data-signs]', el).innerHTML = buildSigns(a.rows).map(s => `<div class="s ${s.ok === true ? 'ok' : s.ok === false ? 'bad' : ''}">${s.ok === true ? '✓' : s.ok === false ? '✗' : '·'} ${esc(s.t)}</div>`).join('');
      }
      function all() { rowsHTML(); prev(); }
      function change() { ctx.save(); prev(); }
      TR.on(el, 'change', 'select[data-f]', (e, s) => {
        if (ctx.readonly) return;
        const r = a.rows[+s.dataset.i]; r[s.dataset.f] = s.value;
        if (s.dataset.f === 'l' && !r.type) r.type = 'sync';
        change();
      });
      TR.on(el, 'click', '[data-ty]', (e, b) => { if (ctx.readonly) return; a.rows[+b.dataset.i].type = b.dataset.ty; TR.$$('[data-ty]', b.parentNode).forEach(x => x.setAttribute('aria-pressed', String(x === b))); change(); });
      TR.on(el, 'click', '[data-add]', () => { if (ctx.readonly) return; a.rows.push({ l: '', from: '', to: '', type: 'sync' }); ctx.save(); all(); });
      TR.on(el, 'click', '[data-del]', (e, b) => { if (ctx.readonly) return; a.rows.splice(+b.dataset.del, 1); ctx.save(); all(); });
      TR.on(el, 'click', '[data-mv]', (e, b) => { if (ctx.readonly) return; const i = +b.dataset.i, j = i + (+b.dataset.mv); if (j < 0 || j >= a.rows.length) return; const t = a.rows[i]; a.rows[i] = a.rows[j]; a.rows[j] = t; ctx.save(); all(); });
      all();
    },
    check(ans) {
      const r = buildEval(ans), notes = [];
      const miss = KREQ.filter(m => r.per[m.id].miss);
      if (miss.length) notes.push({ ok: false, html: `Нет сообщений: ${miss.map(m => '«' + esc(m.t) + '»').join(', ')}.` });
      const badDir = KREQ.filter(m => !r.per[m.id].miss && !r.per[m.id].dirOk);
      if (badDir.length) notes.push({ ok: false, html: `Не те участники или направление: ${badDir.map(m => '«' + esc(m.t) + '»').join(', ')}. Спросите себя: кто знает, что пора отправить это сообщение?` });
      const badT = KREQ.filter(m => !r.per[m.id].miss && !r.per[m.id].typeOk);
      if (badT.length) notes.push({ ok: false, html: `Тип сообщения: ${badT.map(m => '«' + esc(m.t) + '»').join(', ')}. Ответы — пунктиром к вызывавшему; вебхук и событие — асинхронные; вызовы, без результата которых нельзя продолжить, — синхронные.` });
      if (r.present > 1) notes.push({ ok: r.order >= 0.95 ? true : r.order >= 0.8 ? 'warn' : false, html: `Порядок обязательных сообщений: ${pct(r.order)}.` });
      if (r.traps) notes.push({ ok: false, html: `Лишних сообщений: ${r.traps}. В сценарии нет запчастей, а списывать деньги без клиента нельзя.` });
      if (!miss.length && !badDir.length && !badT.length) notes.push({ ok: true, html: 'Все обязательные сообщения на месте, с верным направлением и типом.' });
      return {
        ok: r.ok, score: r.score, notes,
        summary: `Обязательных сообщений: ${r.present} из ${KREQ.length}, качество ${pct(r.items)}, порядок ${pct(r.order)}${r.traps ? `, лишних ${r.traps}` : ''}.`,
        mentor: r.ok ? null : 'Идите по тексту по одному глаголу: «записывается», «просит создать», «создаёт», «получает ссылку», «возвращается», «присылает», «отвечает», «публикует», «отправляет». Каждый глагол — стрелка.'
      };
    },
    explain: `<p>Диаграмма читается как две части. <b>Синхронная</b> — «матрёшка» вызовов: приложение → сервис записи → платёжный сервис → ЮKassa, и ответы в обратном порядке, каждый — к тому, кто спросил. Приложение не ходит в платёжный сервис напрямую: запись — владелец сценария, а платёжный сервис — исполнитель «создай платёж». <b>Асинхронная</b> — после оплаты: вебхук от ЮKassa, «200 OK», событие «предоплата получена» через брокер и push. Сервис записи узнаёт об оплате событием, а не опросом.</p>
      <p>Обратите внимание, что текст сценария стал короче и точнее после диаграммы: видно, кто владеет статусом записи и где ждём. Такую диаграмму кладут в задачу рядом с правилом BR-4 и критериями приёмки — Глеб по ней пишет контракт между сервисами, Лиза — тесты «оплата не пришла», «вебхук пришёл дважды». Источник: UML 2.5, раздел 17; Вигерс, «Разработка требований», гл. 12 о моделях.</p>`,
    refNote: 'Сообщения «Открыть страницу оплаты» и «Запись → Подтверждена» необязательны. Открытие страницы можно нарисовать синхронным или асинхронным.',
    report: ans => { const r = buildEval(ans); return `- Обязательных: ${r.present}/${KREQ.length}, качество ${pct(r.items)}, порядок ${pct(r.order)}, лишних ${r.traps}\n` + buildItems((ans && ans.rows) || []).map((it, i) => `  ${i + 1}. ${it.from} ${it.type === 'reply' ? '-->' : it.type === 'async' ? '->>' : '->'} ${it.to}: ${it.t}`).join('\n'); }
  };

  // =====================================================================
  // Практика 5. Лаборатория: SMS-шлюз упал в пятничный пик + ответ Тимуру
  // =====================================================================
  const DEC = [
    { id: 'd1', t: 'Как сообщить клиенту об оплате', opts: [
      { v: 'sync', t: 'Внутри обработки вебхука: вызвать SMS-шлюз, дождаться ответа, потом отправить чек и ответить ЮKassa «200 OK»' },
      { v: 'event', t: 'Сохранить оплату, ответить «200 OK», а событие «платёж прошёл» отдать в брокер: сервис уведомлений сам отправит push и SMS' },
      { v: 'poll', t: 'Не уведомлять: приложение само спрашивает статус каждые 2 секунды, пока открыто' }] },
    { id: 'd2', t: 'Тайм-аут и повторы при вызове SMS-шлюза', opts: [
      { v: 'none', t: 'Без тайм-аута: библиотека по умолчанию ждёт, сколько потребуется' },
      { v: 'long', t: 'Тайм-аут 60 секунд, без повторов' },
      { v: 'short', t: 'Тайм-аут 3 секунды, до 5 повторов с растущей паузой (1, 2, 4, 8, 16 с), дальше — в очередь на разбор' },
      { v: 'storm', t: 'Тайм-аут 1 секунда, повторять сразу, без паузы, пока не получится' }] },
    { id: 'd3', t: 'ЮKassa прислала вебхук повторно', opts: [
      { v: 'again', t: 'Обработать как новый: отметить оплату, начислить бонусы, отправить чек' },
      { v: 'idem', t: 'Найти платёж по id: если уже paid — ничего не менять, просто ответить «200 OK»' },
      { v: 'ignore', t: 'Не отвечать на повторы — пусть ЮKassa перестанет' }] }
  ];
  const DEC_OK = { d1: 'event', d2: 'short', d3: 'idem' };
  const DEC_W = { d1: { event: 1, poll: 0.3, sync: 0 }, d2: { short: 1, long: 0.3, none: 0, storm: 0 }, d3: { idem: 1, again: 0, ignore: 0 } };
  const LAB_L = [{ id: 'yk', t: 'ЮKassa', kind: 'ext' }, { id: 'pay', t: 'Платёжный сервис' }, { id: 'atol', t: 'Касса', sub: 'АТОЛ', kind: 'ext' }, { id: 'mq', t: 'Брокер' }, { id: 'ntf', t: 'Уведомления' }, { id: 'sms', t: 'SMS-шлюз', sub: 'не отвечает', kind: 'ext' }];
  function labRun(a) {
    const d1 = a.d1, d2 = a.d2, d3 = a.d3;
    const st = [], evs = [];
    const S = { stuck: 0, dup: 0, desk: 0, sms: '—' };
    st.push({ time: '18:40', from: 'yk', to: 'pay', t: 'Вебхук: оплата 7 800 ₽', kind: 'violet', note: 'Пятница, пик выдачи машин: за 20 минут приходит около 40 оплат.' });
    st.push({ from: 'pay', to: 'pay', t: 'payment = paid' });
    if (d1 === 'sync') {
      const hang = d2 === 'none' || d2 === 'long';
      st.push({ from: 'pay', to: 'sms', t: 'Отправить SMS, ждём…', lost: true, kind: 'bad', note: 'SMS-шлюз не отвечает. Обработчик вебхука стоит и ждёт.' });
      if (d2 === 'storm') st.push({ box: true, from: 'pay', to: 'sms', t: 'повтор, повтор, повтор… 1 200 запросов в минуту', kind: 'bad', note: 'Повторы без паузы забивают и наш сервис, и шлюз. Провайдер блокирует наш аккаунт за флуд.' });
      if (d2 === 'short') st.push({ box: true, from: 'pay', to: 'sms', t: 'повторы через 1, 2, 4, 8, 16 с ≈ 46 с', kind: 'warn', note: 'Тайм-ауты спасают от вечного ожидания, но ЮKassa всё равно не дожидается ответа: 46 секунд — слишком долго.' });
      st.push({ box: true, from: 'yk', to: 'pay', t: 'ЮKassa не дождалась «200 OK»', kind: 'warn', note: 'ЮKassa считает уведомление недоставленным и будет присылать его снова.' });
      st.push({ from: 'yk', to: 'pay', t: 'Повтор вебхука', kind: 'warn' });
      if (d3 === 'again') st.push({ from: 'pay', to: 'pay', t: 'ещё раз бонусы и SMS', kind: 'bad', note: 'Повтор обработан как новая оплата: бонусы начислены второй раз.' });
      st.push({ from: 'pay', to: 'atol', t: 'Чек — не отправлен', lost: true, kind: 'bad', note: 'Чек стоит в коде после SMS — до него очередь не доходит. Оплата есть, чека нет: нарушение 54-ФЗ.' });
      st.push({ box: true, from: 'yk', to: 'sms', t: 'Все обработчики ждут SMS-шлюз — новые вебхуки в очереди', kind: 'bad', note: 'Обработчиков вебхуков ограниченное число. Все заняты ожиданием — оплаты других клиентов тоже «висят».' });
      S.stuck = hang || d2 === 'storm' ? 40 : 26; S.desk = hang || d2 === 'storm' ? 12 : 7;
      S.dup = d3 === 'again' ? (hang ? 3 : 2) * 40 : d3 === 'ignore' ? 0 : 0;
      S.sms = d2 === 'short' ? 'после 19:00, часть потеряна' : d2 === 'storm' ? 'аккаунт заблокирован' : 'не отправлены';
      evs.push({ d: '18:41', k: 'bad', t: 'Приложение у Елены: «Проверяем оплату…» — крутилка не уходит. Деньги списаны, а статус всё ещё pending у тех, чьи вебхуки в очереди.' });
      evs.push({ d: '18:45', k: 'bad', t: `У стойки Марины Олеговны — ${S.desk} клиентов: «Я оплатил, а приложение не видит». Двое платят второй раз на кассе — будет возврат.` });
      evs.push({ d: '18:50', k: 'bad', t: 'Ольга Викторовна: «Почему оплаты без чеков? Это штраф по 54-ФЗ за каждый чек».' });
    } else if (d1 === 'event') {
      st.push({ from: 'pay', to: 'yk', t: '200 OK', reply: true, kind: 'ok', note: 'Оплата сохранена — сразу отвечаем ЮKassa. Время обработки — доли секунды.' });
      st.push({ from: 'pay', to: 'atol', t: 'Чек «приход»', kind: 'violet', note: 'Чек уходит в кассу — касса работает, SMS-шлюз здесь ни при чём.' });
      st.push({ from: 'pay', to: 'mq', t: 'Событие «платёж прошёл»', kind: 'violet' });
      st.push({ from: 'mq', to: 'ntf', t: 'Событие', kind: 'violet' });
      st.push({ from: 'ntf', to: 'ntf', t: 'push отправлен', kind: 'ok', note: 'Push идёт через FCM/APNs — не через SMS-шлюз. Елена видит «Оплата прошла» через пару секунд.' });
      st.push({ from: 'ntf', to: 'sms', t: 'SMS', lost: true, kind: 'bad', note: 'SMS-шлюз не отвечает. Падает только SMS — оплата, чек и push уже прошли.' });
      if (d2 === 'short') { st.push({ box: true, from: 'ntf', to: 'sms', t: 'повторы через 1, 2, 4, 8, 16 с, потом очередь', kind: 'warn' }); st.push({ time: '19:01', from: 'ntf', to: 'sms', t: 'SMS доставлены', kind: 'ok', note: 'Шлюз поднялся — очередь SMS ушла спокойно, без лавины.' }); S.sms = 'доставлены в 19:01'; }
      else if (d2 === 'storm') { st.push({ box: true, from: 'ntf', to: 'sms', t: 'повторы без паузы — флуд', kind: 'bad', note: 'Повторы без паузы: шлюз при подъёме получает лавину запросов, провайдер ограничивает аккаунт.' }); S.sms = 'аккаунт ограничен'; }
      else if (d2 === 'none') { st.push({ box: true, from: 'ntf', to: 'sms', t: 'сервис уведомлений завис в ожидании', kind: 'bad', note: 'Без тайм-аута завис сервис уведомлений: перестали уходить и push о других событиях — «Машина готова».' }); S.sms = 'не отправлены'; }
      else { st.push({ box: true, from: 'ntf', to: 'sms', t: 'тайм-аут 60 с, без повторов — SMS потеряны', kind: 'warn' }); S.sms = 'потеряны'; }
      st.push({ time: '18:52', from: 'yk', to: 'pay', t: 'Повтор вебхука (сетевой сбой)', kind: 'warn', note: 'Даже при быстром ответе повторы случаются: наш «200 OK» потерялся в сети.' });
      if (d3 === 'again') { st.push({ from: 'pay', to: 'pay', t: 'бонусы и чек ещё раз', kind: 'bad' }); S.dup = 1; }
      else if (d3 === 'idem') st.push({ from: 'pay', to: 'yk', t: 'уже paid → 200 OK', reply: true, kind: 'ok' });
      else { st.push({ box: true, from: 'yk', to: 'pay', t: 'нет ответа → ЮKassa повторяет сутки', kind: 'warn' }); }
      S.stuck = 0; S.desk = 0;
      evs.push({ d: '18:40', k: 'ok', t: 'Елена видит «Оплата прошла» через 2 секунды, чек — на почте. Что SMS-шлюз лежит, она не замечает.' });
      evs.push({ d: '18:45', k: d2 === 'none' ? 'bad' : 'ok', t: d2 === 'none' ? 'Сервис уведомлений завис: push «Машина готова» перестали приходить. Клиенты звонят на станции.' : 'У стойки спокойно: оплаты проходят, приложение показывает статусы.' });
      if (d3 === 'again') evs.push({ d: '18:52', k: 'bad', t: 'Одному клиенту повторный вебхук начислил бонусы и пробил чек второй раз. Ольга Викторовна делает чек коррекции.' });
      if (d3 === 'ignore') evs.push({ d: '19:30', k: 'warn', t: 'ЮKassa сутки шлёт повторы, мониторинг краснеет, в журнале тысячи ошибок — настоящую проблему в них не видно.' });
    } else {
      st.push({ from: 'pay', to: 'yk', t: '200 OK', reply: true, kind: 'ok' });
      st.push({ from: 'pay', to: 'atol', t: 'Чек «приход»', kind: 'violet' });
      st.push({ box: true, from: 'pay', to: 'ntf', t: 'уведомлений нет: приложение опрашивает статус', kind: 'warn', note: 'Кто держит приложение открытым — увидит оплату. Кто закрыл — не узнает, пока не откроет.' });
      if (d3 === 'again') { st.push({ from: 'yk', to: 'pay', t: 'Повтор вебхука', kind: 'warn' }); st.push({ from: 'pay', to: 'pay', t: 'бонусы ещё раз', kind: 'bad' }); S.dup = 1; }
      S.desk = 3; S.sms = 'не нужны';
      evs.push({ d: '18:40', k: 'warn', t: 'Оплата и чек проходят. Но 1 500 открытых приложений в понедельник 09:00 будут опрашивать бэкенд каждые 2 секунды — 750 запросов в секунду впустую.' });
      evs.push({ d: '18:45', k: 'warn', t: 'Трое клиентов закрыли приложение после оплаты и переспрашивают у стойки: «Прошло?»' });
    }
    return { st, evs, S };
  }
  const L_RUBRIC = [
    'Объясняет, почему опасна прямая привязка: SMS-шлюз завис — у клиентов «зависла» оплата, нет чека, очередь у стойки, хотя деньги уже списаны',
    'Описывает новый порядок: сначала фиксируем оплату и отвечаем ЮKassa, чек и уведомления отправляются следом, отдельно',
    'Говорит про тайм-ауты и повторы с паузой: ждём не дольше нескольких секунд, SMS придёт позже, а push — сразу',
    'Объясняет на языке денег защиту от повторов: повторное уведомление не даст второй оплаты, двойных бонусов или второго чека',
    'Говорит на языке бизнеса (клиенты, деньги, 54-ФЗ, стойка), без жаргона или с расшифровкой терминов'
  ];
  const L_REF = 'Тимур Рашидович, SMS отправляется сразу, просто не в той же секунде, что оплата, — и это сделано специально. Мы проверили на стенде: если SMS-шлюз ляжет в пятничный пик, а оплата будет ждать SMS, то у клиентов деньги спишутся, а приложение будет крутить «проверяем оплату», чек не пробьётся, а у стойки Марины Олеговны выстроится очередь «я заплатил, а у вас не видно». Кто-то заплатит второй раз. Поэтому теперь порядок такой: деньги пришли — мы сразу фиксируем оплату и подтверждаем это ЮKassa, а чек, push и SMS отправляются следом, отдельно. Если SMS-шлюз недоступен, клиент всё равно получит push и чек на почту, а SMS мы будем пробовать отправить с паузами — 1, 2, 4 секунды и дальше — и отправим, как только шлюз поднимется. И ещё: ЮKassa иногда присылает одно и то же уведомление дважды. Мы проверяем номер платежа, поэтому второй раз бонусы не начислятся и второй чек не пробьётся — Ольге Викторовне не придётся делать исправления для налоговой.';
  function labEval(a) {
    a = a || {};
    const per = DEC.map(d => ({ d, v: a[d.id], s: a[d.id] ? (DEC_W[d.id][a[d.id]] || 0) : 0 }));
    const dec = per.reduce((s, p) => s + p.s, 0) / DEC.length;
    const j = ui.justifyScore(a.j);
    const score = Math.round((0.6 * dec + 0.4 * j) * 1000) / 1000;
    return { per, dec, j, score, ok: score >= 0.75 && per.every(p => p.s === 1) };
  }
  const labTask = {
    id: 'lab', title: 'Лаборатория: SMS-шлюз упал в пятничный пик',
    simple: howIntegr.simple,
    lead: ui.brief({
      situation: 'Глеб показывает первую версию обработчика вебхука: «Пришла оплата — шлю SMS „спасибо, чек по ссылке“, жду ответа шлюза, потом чек в кассу и „200 OK“ ЮKassa. Просто и понятно». Лиза: «А если SMS-шлюз ляжет? Давай я выключу его на стенде в сценарии „пятница, 18:40, пик выдачи машин“». Решения за вами.',
      todo: [
        'Часть 1. Примите три решения: как уведомлять об оплате, какой тайм-аут и повторы, что делать с повторным вебхуком.',
        'Нажмите «Запустить пятницу 18:40» и проиграйте последствия: диаграмма, счётчики, хроника. Меняйте решения и перезапускайте.',
        'Часть 2. Тимур Рашидович недоволен: «Зачем усложнять? Пусть сразу шлёт SMS, как раньше». Ответьте ему своими словами.',
        'Нажмите «Проверить». Засчитывается от 75 %, если все три решения верные (решения — 60 %, ответ — 40 %).'
      ],
      look: 'Каждая синхронная стрелка к внешней системе — это вопрос «а если она не ответит?». Оплата не должна зависеть от того, без чего она может обойтись.'
    }),
    blank: () => ({ d1: '', d2: '', d3: '', j: {} }),
    reference: () => ({ d1: 'event', d2: 'short', d3: 'idem', j: { text: L_REF, self: L_RUBRIC.map(() => true) } }),
    render(el, ctx) {
      el.classList.add('msq-root');
      const a = ctx.ans; a.j = a.j || {};
      const ev = ctx.result ? labEval(a) : null;
      let ran = false;
      el.innerHTML = `<div class="stack">
        <div class="eyebrow">Часть 1 · Решения</div>
        <div class="stack tight" data-dec></div>
        <div class="row"><button type="button" class="btn primary" data-run>▶ Запустить пятницу 18:40</button><span class="small dim" data-rh></span></div>
        <div data-res></div>
        <div class="eyebrow">Часть 2 · Ответ Тимуру Рашидовичу</div>
        ${ui.say('timur', 'Зачем усложнять? Брокеры какие-то, очереди. Пусть сразу шлёт SMS, как раньше на кассе: заплатил — получил SMS.')}
        <div data-j></div>
      </div>`;
      function decHTML() {
        TR.$('[data-dec]', el).innerHTML = DEC.map(d => {
          const p = ev && ev.per.find(x => x.d.id === d.id);
          const cls = p && a[d.id] ? (p.s === 1 ? 'ok' : p.s > 0 ? 'warn' : 'bad') : '';
          return `<div class="msq-dec ${cls}"><b>${esc(d.t)}</b><div class="msq-opts">${d.opts.map(o => `<button type="button" class="msq-opt" data-d="${d.id}" data-v="${o.v}" aria-pressed="${a[d.id] === o.v}" ${ctx.readonly ? 'disabled' : ''}>${esc(o.t)}</button>`).join('')}</div>${p && a[d.id] && p.s < 1 ? `<div class="why">${decWhy(d.id, a[d.id])}</div>` : ''}</div>`;
        }).join('');
        const miss = DEC.filter(d => !a[d.id]).length;
        TR.$('[data-rh]', el).textContent = miss ? `Осталось решений: ${miss}` : 'Все решения приняты';
        TR.$('[data-run]', el).disabled = !!miss;
      }
      function run() {
        const r = labRun(a);
        const S = r.S;
        const stat = (v, k, cls) => `<div class="msq-stat ${cls}"><span class="v">${v}</span><span class="k">${k}</span></div>`;
        TR.$('[data-res]', el).innerHTML = `<div class="stack tight">
          <div data-sq></div>
          <div class="msq-stats">
            ${stat(S.stuck, 'оплат «зависли» у клиентов', S.stuck ? 'bad' : 'ok')}
            ${stat(S.desk, 'человек у стойки «я оплатил»', S.desk > 5 ? 'bad' : S.desk ? 'warn' : 'ok')}
            ${stat(S.dup, 'дублей бонусов и чеков', S.dup ? 'bad' : 'ok')}
            ${stat(esc(S.sms), 'SMS клиентам', /доставлены|не нужны/.test(S.sms) ? 'ok' : 'warn')}
          </div>
          <div class="msq-tl">${r.evs.map(e => `<div class="msq-ev ${e.k}"><span class="d">${e.d}</span><span>${e.t}</span></div>`).join('')}</div>
        </div>`;
        ui.seq(TR.$('[data-sq]', el), { lanes: LAB_L, steps: r.st, laneW: 140, autoplay: !ctx.readonly, speed: 900, start: ctx.readonly ? 'all' : 0 });
        ran = true;
      }
      decHTML();
      if (ctx.readonly || (ctx.result && DEC.every(d => a[d.id]))) run();
      TR.on(el, 'click', '[data-d]', (e, b) => {
        if (ctx.readonly) return;
        a[b.dataset.d] = b.dataset.v; ctx.save();
        const d = DEC.find(x => x.id === b.dataset.d);
        ctx.decide(d.t, d.opts.find(o => o.v === b.dataset.v).t);
        decHTML(); if (ran && DEC.every(x => a[x.id])) run();
      });
      TR.on(el, 'click', '[data-run]', () => { if (DEC.every(d => a[d.id])) run(); });
      ui.justify(TR.$('[data-j]', el), {
        id: 'msq-lab', q: 'Что ответить Тимуру Рашидовичу?',
        qPlain: 'Объясните владельцу сети автосервисов, почему после онлайн-оплаты SMS отправляется не внутри обработки оплаты, а отдельно (через очередь событий), что было бы при падении SMS-шлюза при синхронном вызове, зачем тайм-ауты и повторы и почему повторное уведомление от ЮKassa не приведёт к двойным бонусам и чекам.',
        rubric: L_RUBRIC, reference: L_REF, value: a.j, readonly: ctx.readonly, minLen: 250,
        placeholder: 'Тимур Рашидович, …',
        onChange: v => { a.j = v; ctx.save(); ctx.decide('Ответ Тимуру про SMS', v.text || ''); }
      });
    },
    check(ans) {
      const r = labEval(ans), notes = [];
      r.per.forEach(p => {
        if (!p.v) notes.push({ ok: false, html: `Не принято решение: «${esc(p.d.t)}».` });
        else if (p.s === 1) notes.push({ ok: true, html: { d1: 'Оплата не ждёт SMS: сохранили, ответили ЮKassa, уведомления — через брокер. SMS-шлюз упал — пострадали только SMS.', d2: 'Короткий тайм-аут и повторы с растущей паузой: не висим и не устраиваем лавину, когда шлюз поднимается.', d3: 'Повторный вебхук идемпотентен: проверка по id платежа, повтор получает «200 OK» без изменений.' }[p.d.id] });
        else notes.push({ ok: p.s > 0 ? 'warn' : false, html: decWhy(p.d.id, p.v) });
      });
      if (!r.j) notes.push({ ok: false, html: 'Ответ Тимуру Рашидовичу не написан или не оценён: напишите от 250 символов и проверьте с Верой или по эталону.' });
      else if (r.j < 0.6) notes.push({ ok: 'warn', html: 'Ответ Тимуру слабоват: покажите, что видели на стенде (очередь у стойки, нет чека), и что даёт новый порядок клиенту и бухгалтерии.' });
      else notes.push({ ok: true, html: `Ответ Тимуру: ${pct(r.j)} по рубрике.` });
      return {
        ok: r.ok, score: r.score, notes,
        summary: `Решения: ${pct(r.dec)}, ответ: ${pct(r.j)}.`,
        mentor: r.ok ? null : 'Запустите сценарий с первым вариантом Глеба и посмотрите на счётчики. Что из этого случилось бы, если бы оплата не ждала SMS?'
      };
    },
    explain: `<p>Синхронный вызов SMS-шлюза внутри обработки оплаты склеивает судьбу оплаты с судьбой SMS. Шлюз завис — обработчики вебхуков стоят, ЮKassa не получает «200 OK» и шлёт повторы, чек не пробит, а у клиента списаны деньги и крутится «проверяем оплату». Правильный порядок: <b>сохранить → ответить 200 → остальное асинхронно</b>. Тогда отказ SMS-шлюза — это «SMS придут позже», а не «оплата не работает».</p>
      <p>Тайм-аут без повторов теряет сообщения, повторы без паузы устраивают лавину («шторм повторов»), без тайм-аута зависает уже наш сервис. Норма — короткий тайм-аут, несколько повторов с экспоненциальной задержкой и очередь «на разбор». А повторы входящих неизбежны — значит, обработчик должен быть идемпотентным: тот же платёж — тот же результат. Обратите внимание, как одна диаграмма последовательности показала проблему до написания кода: синхронная стрелка к внешней системе — повод спросить «а если она не ответит?». Источники: Ньюман «Создание микросервисов» (гл. о надёжности); Найгард «Release It!» (тайм-ауты, предохранители); документация ЮKassa «Входящие уведомления».</p>`,
    refNote: 'Опрос статуса из приложения засчитывается частично, тайм-аут 60 секунд — частично. Ответ Тимуру оценивается по рубрике.',
    report: ans => { const a = ans || {}; const r = labEval(a); return DEC.map(d => `- ${d.t}: ${a[d.id] ? d.opts.find(o => o.v === a[d.id]).t : '—'}`).join('\n') + `\n- Ответ Тимуру (${pct(r.j)}): ${(a.j && a.j.text) || '—'}`; }
  };
  function decWhy(d, v) {
    return ({
      d1: { sync: 'Синхронный вызов SMS-шлюза внутри оплаты: шлюз завис — оплата и чек стоят, ЮKassa шлёт повторы, у стойки очередь.', poll: 'Опрос из приложения работает, только пока приложение открыто, и нагружает бэкенд впустую: 1 500 приложений × запрос каждые 2 секунды. Уведомления о других событиях тоже нужны — нужен сервис уведомлений.' },
      d2: { none: 'Без тайм-аута поток ждёт вечно: зависает тот, кто вызывает, — сначала обработчики, потом весь сервис.', long: '60 секунд ожидания на каждое сообщение и ни одного повтора: SMS теряются, а потоки долго заняты.', storm: 'Повторы без паузы — «шторм»: добиваем лежащий шлюз, а при подъёме обрушиваем на него лавину. Провайдер может заблокировать аккаунт.' },
      d3: { again: 'Повтор обработан как новая оплата: бонусы дважды, второй чек — расхождение с налоговой и ручные исправления у Ольги Викторовны.', ignore: 'Без «200 OK» ЮKassa продолжит повторять сутки, журналы заполнятся ошибками, а реальная проблема в них потеряется.' }
    }[d] || {})[v] || '';
  }

  // =====================================================================
  TR.stage({
    id: ID,
    when: 'понедельник, 11 января 2027, 11:00 · онлайн-оплата: кто кого вызывает',
    intro: [
      { who: 'gleb', html: 'Оплата — самое нервное место. Приложение, мы, ЮKassa, касса, push. Кто кого вызывает? Кто ждёт ответа? Что, если ЮKassa ответит через минуту или не ответит вообще? Без картинки я это в голове не удержу.' },
      { who: 'olga', html: 'А мне важно одно: чек по 54-ФЗ — на каждую оплату, ровно один, и только когда деньги действительно пришли. Сверку с ЮKassa я делаю каждый день.' },
      { who: 'vera', html: 'Сегодня — диаграмма последовательности. Разберём нотацию UML, соберём сценарий оплаты по шагам, добавим ветку отказа, проверим чужую диаграмму и посмотрим, что происходит, когда внешний сервис падает в час пик. Рисовать будем и мышкой, и в PlantUML.' }
    ],
    facts: ['F-pay', 'F-bonus', 'F-noshow-rule', 'F-ready'],
    glossary: [
      { term: 'Диаграмма последовательности (sequence diagram)', simple: 'Картинка разговора систем во времени: кто кому что отправил и в каком порядке.', tech: 'Диаграмма взаимодействия UML 2.5 (OMG, раздел 17): линии жизни, сообщения, спецификации исполнения (активации), комбинированные фрагменты.' },
      { term: 'Линия жизни (lifeline)', simple: 'Участник и его пунктир вниз — его время.', tech: 'Lifeline — представляет участника взаимодействия; время на диаграмме идёт сверху вниз.' },
      { term: 'Синхронное сообщение', simple: 'Отправил и ждёшь ответа.', tech: 'Synchronous call — сплошная линия с закрашенным наконечником; подразумевает ответ (reply, пунктир).' },
      { term: 'Асинхронное сообщение', simple: 'Отправил и пошёл дальше.', tech: 'Asynchronous message — сплошная линия с открытым наконечником; отправитель не блокируется. Вебхуки, очереди, push.' },
      { term: 'Активация', simple: 'Узкий прямоугольник: участник занят.', tech: 'Execution specification — период, когда участник выполняет действие или ждёт вложенного вызова.' },
      { term: 'Фрагмент alt / opt / loop / par', simple: 'Рамки «если–иначе», «если», «повторять», «одновременно».', tech: 'Combined fragment с оператором взаимодействия и операндами с условиями (guard). UML 2.5, 17.6.' },
      { term: 'Вебхук', simple: 'Внешний сервис сам звонит нам, когда что-то произошло.', tech: 'HTTP-запрос от внешней системы на наш адрес при событии. У ЮKassa — payment.succeeded, payment.canceled и др.; повторяется, пока не получен 200.' },
      { term: 'Тайм-аут', simple: 'Сколько готовы ждать ответа, прежде чем сдаться.', tech: 'Максимальное время ожидания ответа на вызов; после него — ошибка, повтор или запасной путь.' },
      { term: 'Повтор с экспоненциальной задержкой', simple: 'Пробуем снова, каждый раз выжидая дольше.', tech: 'Retry with exponential backoff: паузы 1, 2, 4, 8 с… с ограничением числа попыток; часто со случайной добавкой (jitter).' },
      { term: 'Идемпотентность', simple: 'Повторили — результат тот же, без дублей.', tech: 'Свойство операции: многократное выполнение даёт тот же эффект, что однократное. В ЮKassa — заголовок Idempotence-Key; для вебхуков — проверка по id платежа.' },
      { term: 'PlantUML', simple: 'Диаграммы, которые пишут текстом.', tech: 'Текстовый язык описания UML-диаграмм: <code>a -> b : сообщение</code>, <code>alt … else … end</code>. Хранится в git, встраивается в Confluence.' },
      { term: '54-ФЗ', simple: 'Закон о кассах: на каждую оплату — чек.', tech: 'Федеральный закон «О применении контрольно-кассовой техники…». Для онлайн-оплат — онлайн-касса (у «Искры» — АТОЛ Онлайн), чек в ФНС и покупателю.' }
    ],
    outro: 'Оплата «Искры» теперь нарисована: синхронная часть до страницы ЮKassa, асинхронная — вебхук, чек, push; ветка отказа с понятным push и без чека; предоплата по BR-4. Вы увидели, как одна синхронная стрелка к SMS-шлюзу превращает чужую аварию в очередь у стойки, и как это лечат асинхронность, тайм-ауты, повторы и идемпотентность. В среду — архитектурный комитет: посмотрим на «Искру Онлайн» целиком, из каких компонентов она состоит и что сломается, если упадёт любой из них.',
    tasks: [howBasics, howFrag, howIntegr, orderTask, altTask, bugsTask, builderTask, labTask]
  });
})();
