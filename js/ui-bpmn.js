/* BPMN-диаграмма в SVG: пулы и дорожки, события с маркерами, задачи разных типов, шлюзы, подпроцессы,
   граничные события, данные, аннотации; потоки управления, сообщений и ассоциации. Раскладка — по сетке
   (col, row внутри дорожки), маршрутизация линий — ортогональная. Цвета из токенов темы.
   cfg: {
     title, pools:[{id,t,lanes:[{id,t}],blackbox}] | lanes:[{id,t}] + pool:'Название',
     nodes:[{id,type,t,lane,col,row,tone,attach,ni,loop,marker}],
     flows:[{from,to,t,kind:'seq'|'msg'|'assoc'|'data',tone,def,via}],
     colW:150, rowH:92, hl:{id:'ok'|'bad'|'warn'|'info'|'accent'|'violet'}, selected:id, onClick(id), dim:[ids]
   }
   type: start | start-msg | start-timer | start-signal | start-cond
         end | end-msg | end-err | end-term | end-esc | end-signal
         int-timer | int-msg | int-msg-throw | int-signal | int-esc | int-cond | int-link
         b-timer | b-msg | b-err | b-esc | b-signal | b-cond (граничные; attach — id задачи, ni:true — непрерывающее)
         task | user | service | send | receive | manual | script | rule | sub | call | evsub
         xor | and | or | evt | gw (пустой ромб) | data | data-in | data-out | store | note | blank
   loop: 'std' | 'par' | 'seq' — маркер цикла / многоэкземплярности у задачи. */
'use strict';
(function () {
  const TR = window.TR, esc = TR.esc, ui = TR.ui;
  const TONE = { '': 'var(--text-2)', ok: 'var(--ok)', bad: 'var(--bad)', warn: 'var(--warn)', info: 'var(--info)', accent: 'var(--accent)', violet: 'var(--violet)' };
  let uid = 0;
  const TASKS = ['task', 'user', 'service', 'send', 'receive', 'manual', 'script', 'rule', 'sub', 'call', 'evsub', 'blank'];
  const isTask = t => TASKS.includes(t);
  const isGw = t => ['xor', 'and', 'or', 'evt', 'gw'].includes(t);
  const isEv = t => /^(start|end|int|b)(-|$)/.test(t);

  function wrap(text, max) {
    const words = String(text || '').split(/\s+/), out = []; let cur = '';
    words.forEach(w => { if ((cur + ' ' + w).trim().length > max && cur) { out.push(cur); cur = w; } else cur = (cur + ' ' + w).trim(); });
    if (cur) out.push(cur);
    return out;
  }

  ui.bpmn = (el, cfg) => {
    const id = 'bp' + (++uid);
    function layout() {
      const pools = cfg.pools || [{ id: '_p', t: cfg.pool || '', lanes: cfg.lanes || [{ id: '_l', t: '' }] }];
      const colW = cfg.colW || 150, rowH = cfg.rowH || 92, PH = pools.some(p => p.t) ? 30 : 0, LH = pools.some(p => !p.blackbox && p.lanes && (p.lanes.length > 1 || (p.lanes[0] && p.lanes[0].t))) ? 26 : 0;
      const left = PH + LH + 10;
      const nodes = cfg.nodes || [];
      const maxCol = Math.max(0, ...nodes.filter(n => !n.attach).map(n => n.col || 0));
      const W = left + (maxCol + 1) * colW + 16;
      const lanes = {}; let y = 6;
      const poolBox = {};
      pools.forEach((p, pi) => {
        const py = y;
        if (p.blackbox) { const h = 46; lanes[p.id] = { y, h, pool: p.id, bb: true }; y += h; }
        else p.lanes.forEach(l => {
          const rows = Math.max(0, ...nodes.filter(n => n.lane === l.id && !n.attach).map(n => n.row || 0));
          const h = (rows + 1) * rowH + 16;
          lanes[l.id] = { y, h, pool: p.id, t: l.t }; y += h;
        });
        poolBox[p.id] = { y: py, h: y - py, t: p.t, bb: p.blackbox, lanes: p.lanes || [] };
        y += pi < pools.length - 1 ? 26 : 0;
      });
      const H = y + 8;
      const P = {};
      nodes.filter(n => !n.attach).forEach(n => {
        const L = lanes[n.lane] || Object.values(lanes)[0];
        const cx = left + (n.col || 0) * colW + colW / 2, cy = L.y + 8 + (n.row || 0) * rowH + rowH / 2;
        let w, h;
        if (isTask(n.type)) { w = n.w || Math.min(colW - 22, 124); h = n.h || 60; }
        else if (isGw(n.type)) { w = h = 42; }
        else if (isEv(n.type)) { w = h = 34; }
        else if (n.type === 'data' || n.type === 'data-in' || n.type === 'data-out') { w = 30; h = 38; }
        else if (n.type === 'store') { w = 44; h = 38; }
        else if (n.type === 'note') { w = n.w || colW - 20; h = n.h || 44; }
        else { w = 100; h = 50; }
        P[n.id] = { x: cx - w / 2, y: cy - h / 2, w, h, cx, cy, n };
      });
      // граничные события — на нижней кромке задачи
      const att = {};
      nodes.filter(n => n.attach).forEach(n => {
        const host = P[n.attach]; if (!host) return;
        const k = att[n.attach] = (att[n.attach] || 0) + 1;
        const cx = host.x + host.w - 18 - (k - 1) * 30, cy = host.y + host.h;
        P[n.id] = { x: cx - 15, y: cy - 15, w: 30, h: 30, cx, cy, n };
      });
      // пул-«чёрный ящик» тоже может быть концом потока сообщений: его id работает как id узла
      pools.filter(p => p.blackbox).forEach(p => { const b = poolBox[p.id]; P[p.id] = { x: left, y: b.y, w: W - left - 16, h: b.h, cx: left + (W - left - 16) / 2, cy: b.y + b.h / 2, n: { id: p.id, type: 'pool' }, pool: true }; });
      return { pools, poolBox, lanes, P, W, H, left, PH, LH, colW };
    }
    const evMarker = (n, cx, cy, c, fill) => {
      const t = n.type, k = t.replace(/^(start|end|int|b)-?/, '').replace(/-throw$/, '');
      const throwing = /^end/.test(t) || /-throw$/.test(t);
      const f = throwing ? c : 'none';
      switch (k) {
        case 'timer': return `<circle cx="${cx}" cy="${cy}" r="9" style="fill:var(--surface);stroke:${c};stroke-width:1.4"/><path d="M${cx} ${cy - 6} V${cy} L${cx + 4} ${cy + 3}" style="fill:none;stroke:${c};stroke-width:1.4"/>`;
        case 'msg': return `<rect x="${cx - 8}" y="${cy - 5.5}" width="16" height="11" rx="1" style="fill:${throwing ? c : 'var(--surface)'};stroke:${c};stroke-width:1.3"/><path d="M${cx - 8} ${cy - 5} L${cx} ${cy + 1} L${cx + 8} ${cy - 5}" style="fill:none;stroke:${throwing ? fill : c};stroke-width:1.3"/>`;
        case 'err': return `<path d="M${cx - 7} ${cy + 7} L${cx - 3} ${cy - 6} L${cx + 2} ${cy + 2} L${cx + 7} ${cy - 7} L${cx + 3} ${cy + 6} L${cx - 2} ${cy - 2} Z" style="fill:${f};stroke:${c};stroke-width:1.3;stroke-linejoin:round"/>`;
        case 'term': return `<circle cx="${cx}" cy="${cy}" r="8" style="fill:${c}"/>`;
        case 'esc': return `<path d="M${cx} ${cy - 8} L${cx + 6} ${cy + 7} L${cx} ${cy + 2} L${cx - 6} ${cy + 7} Z" style="fill:${f};stroke:${c};stroke-width:1.3;stroke-linejoin:round"/>`;
        case 'signal': return `<path d="M${cx} ${cy - 8} L${cx + 8} ${cy + 6} L${cx - 8} ${cy + 6} Z" style="fill:${f};stroke:${c};stroke-width:1.3;stroke-linejoin:round"/>`;
        case 'cond': return `<rect x="${cx - 6}" y="${cy - 8}" width="12" height="16" style="fill:none;stroke:${c};stroke-width:1.2"/><path d="M${cx - 4} ${cy - 4} h8 M${cx - 4} ${cy} h8 M${cx - 4} ${cy + 4} h8" style="stroke:${c};stroke-width:1.1"/>`;
        case 'link': return `<path d="M${cx - 7} ${cy - 3} h7 v-4 l7 7 l-7 7 v-4 h-7 z" style="fill:${f};stroke:${c};stroke-width:1.2"/>`;
        default: return '';
      }
    };
    const taskIcon = (n, x, y, c) => {
      switch (n.type) {
        case 'user': return `<circle cx="${x + 12}" cy="${y + 10}" r="3.6" style="fill:none;stroke:${c};stroke-width:1.2"/><path d="M${x + 5} ${y + 22} c0 -5 3 -7 7 -7 s7 2 7 7 z" style="fill:none;stroke:${c};stroke-width:1.2"/>`;
        case 'service': return `<circle cx="${x + 12}" cy="${y + 13}" r="6.5" style="fill:none;stroke:${c};stroke-width:1.2;stroke-dasharray:2.4 1.6"/><circle cx="${x + 12}" cy="${y + 13}" r="2.4" style="fill:none;stroke:${c};stroke-width:1.2"/>`;
        case 'send': return `<rect x="${x + 5}" y="${y + 7}" width="15" height="10" style="fill:${c}"/><path d="M${x + 5} ${y + 7} l7.5 5.5 l7.5 -5.5" style="fill:none;stroke:var(--surface);stroke-width:1.2"/>`;
        case 'receive': return `<rect x="${x + 5}" y="${y + 7}" width="15" height="10" style="fill:none;stroke:${c};stroke-width:1.2"/><path d="M${x + 5} ${y + 7} l7.5 5.5 l7.5 -5.5" style="fill:none;stroke:${c};stroke-width:1.2"/>`;
        case 'manual': return `<path d="M${x + 5} ${y + 16} v-6 h5 l3 -3 h3 l-2 3 h6 v6 z" style="fill:none;stroke:${c};stroke-width:1.2;stroke-linejoin:round"/>`;
        case 'script': return `<path d="M${x + 8} ${y + 5} h10 c-3 3 -3 6 0 9 s3 6 0 9 h-10 c3 -3 3 -6 0 -9 s-3 -6 0 -9 z" style="fill:none;stroke:${c};stroke-width:1.1"/>`;
        case 'rule': return `<rect x="${x + 5}" y="${y + 6}" width="15" height="11" style="fill:none;stroke:${c};stroke-width:1.2"/><path d="M${x + 5} ${y + 9.5} h15 M${x + 9} ${y + 9.5} v7.5" style="stroke:${c};stroke-width:1.1"/>`;
        default: return '';
      }
    };
    function draw() {
      const L = layout(), P = L.P, hl = cfg.hl || {}, dim = new Set(cfg.dim || []);
      const tone = nid => hl[nid] ? TONE[hl[nid]] || TONE.accent : null;
      let s = `<svg viewBox="0 0 ${L.W} ${L.H}" width="100%" style="min-width:${Math.min(L.W, 640)}px;max-width:${L.W}px;font-family:var(--f-body)" role="img" aria-label="${esc(cfg.title || 'BPMN-диаграмма')}">
        <defs>${Object.keys(TONE).map(k => `<marker id="${id}-s${k}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" style="fill:${TONE[k]}"/></marker><marker id="${id}-m${k}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" style="fill:var(--surface);stroke:${TONE[k]};stroke-width:1.2"/></marker><marker id="${id}-o${k}" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7"><circle cx="5" cy="5" r="3.6" style="fill:var(--surface);stroke:${TONE[k]};stroke-width:1.2"/></marker>`).join('')}</defs>`;
      // пулы и дорожки
      L.pools.forEach(p => {
        const b = L.poolBox[p.id];
        s += `<rect x="4" y="${b.y}" width="${L.W - 8}" height="${b.h}" rx="4" style="fill:color-mix(in srgb, var(--surface-2) 55%, transparent);stroke:var(--border-strong);stroke-width:1.2"/>`;
        if (L.PH && p.t) {
          s += `<line x1="${4 + L.PH}" y1="${b.y}" x2="${4 + L.PH}" y2="${b.y + b.h}" style="stroke:var(--border-strong);stroke-width:1.2"/>`;
          s += `<text transform="translate(${4 + L.PH / 2 + 4} ${b.y + b.h / 2}) rotate(-90)" text-anchor="middle" style="fill:var(--text);font-size:12.5px;font-weight:600">${esc(p.t)}</text>`;
        }
        if (b.bb) return;
        (p.lanes || []).forEach((l, i) => {
          const ln = L.lanes[l.id];
          if (i > 0) s += `<line x1="${4 + L.PH}" y1="${ln.y}" x2="${L.W - 4}" y2="${ln.y}" style="stroke:var(--border-strong);stroke-width:1"/>`;
          if (L.LH && l.t) {
            s += `<line x1="${4 + L.PH + L.LH}" y1="${ln.y}" x2="${4 + L.PH + L.LH}" y2="${ln.y + ln.h}" style="stroke:var(--border);stroke-width:1"/>`;
            s += `<text transform="translate(${4 + L.PH + L.LH / 2 + 4} ${ln.y + ln.h / 2}) rotate(-90)" text-anchor="middle" style="fill:var(--text-2);font-size:11.5px">${esc(l.t)}</text>`;
          }
        });
      });
      // линии
      const edge = (b, side) => side === 'r' ? { x: b.x + b.w, y: b.cy } : side === 'l' ? { x: b.x, y: b.cy } : side === 't' ? { x: b.cx, y: b.y } : { x: b.cx, y: b.y + b.h };
      const pts2d = a => a.map(p => `${p.x} ${p.y}`).join(' L');
      (cfg.flows || []).forEach(f => {
        const A = P[f.from], B = P[f.to]; if (!A || !B) return;
        const k = f.tone && TONE[f.tone] ? f.tone : '', c = TONE[k];
        const kind = f.kind || 'seq';
        let pts;
        if (kind === 'msg') {
          const down = B.cy > A.cy, a = edge(A, down ? 'b' : 't'), b = edge(B, down ? 't' : 'b');
          let ax = f.ax != null ? f.ax : a.x, bx = f.bx != null ? f.bx : b.x;
          if (B.pool && f.bx == null) bx = ax; else if (A.pool && f.ax == null) ax = bx;
          const my = (a.y + b.y) / 2;
          pts = ax === bx ? [{ x: ax, y: a.y }, { x: bx, y: b.y }] : [{ x: ax, y: a.y }, { x: ax, y: my }, { x: bx, y: my }, { x: bx, y: b.y }];
        } else if (kind === 'assoc' || kind === 'data') {
          const a = { x: A.cx, y: A.cy }, b = { x: B.cx, y: B.cy };
          const clip = (Bx, p) => { const dx = p.x - Bx.cx, dy = p.y - Bx.cy, sx = Bx.w / 2 / Math.abs(dx || 1e-9), sy = Bx.h / 2 / Math.abs(dy || 1e-9), m = Math.min(sx, sy); return { x: Bx.cx + dx * m, y: Bx.cy + dy * m }; };
          pts = [clip(A, b), clip(B, a)];
        } else {
          const sameRow = Math.abs(A.cy - B.cy) < 3;
          if (B.cx > A.cx + 2) {
            if (sameRow) pts = [edge(A, 'r'), edge(B, 'l')];
            else if (isGw(A.n.type) || A.n.attach) { const a = edge(A, B.cy > A.cy ? 'b' : 't'); pts = [a, { x: a.x, y: B.cy }, edge(B, 'l')]; }
            else if (isGw(B.n.type)) { const a = edge(A, 'r'), b = edge(B, B.cy > A.cy ? 't' : 'b'); pts = [a, { x: b.x, y: a.y }, b]; }
            else { const a = edge(A, 'r'), b = edge(B, 'l'), mx = f.via != null ? f.via : (a.x + b.x) / 2; pts = [a, { x: mx, y: a.y }, { x: mx, y: b.y }, b]; }
          } else if (Math.abs(B.cx - A.cx) <= 2) {
            const down = B.cy > A.cy; pts = [edge(A, down ? 'b' : 't'), edge(B, down ? 't' : 'b')];
          } else {
            const a = edge(A, 'b'), b = edge(B, 'b'), ly = Math.max(A.y + A.h, B.y + B.h) + (f.drop || 16);
            pts = [a, { x: a.x, y: ly }, { x: b.x, y: ly }, b];
          }
        }
        const dash = kind === 'msg' ? 'stroke-dasharray:7 5;' : kind === 'assoc' || kind === 'data' ? 'stroke-dasharray:2 4;' : '';
        const mEnd = kind === 'msg' ? `marker-end="url(#${id}-m${k})" marker-start="url(#${id}-o${k})"` : kind === 'assoc' ? '' : `marker-end="url(#${id}-s${k})"`;
        const op = dim.has(f.from + '>' + f.to) ? 'opacity:.35;' : '';
        s += `<path d="M${pts2d(pts)}" style="fill:none;stroke:${c};stroke-width:${f.tone ? 2.2 : 1.5};${dash}${op}" ${mEnd}/>`;
        if (f.def && kind === 'seq') { const p0 = pts[0], p1 = pts[1], len = Math.hypot(p1.x - p0.x, p1.y - p0.y) || 1, ux = (p1.x - p0.x) / len, uy = (p1.y - p0.y) / len, q = { x: p0.x + ux * 10, y: p0.y + uy * 10 }; s += `<path d="M${q.x - 5 * ux - 5 * uy} ${q.y - 5 * uy + 5 * ux} L${q.x + 5 * ux + 5 * uy} ${q.y + 5 * uy - 5 * ux}" style="stroke:${c};stroke-width:1.6"/>`; }
        if (f.t) {
          const p0 = pts[0], p1 = pts[1];
          const vertical = Math.abs(p1.x - p0.x) < 2;
          const tx = vertical ? p0.x + 6 : p0.x + (p1.x - p0.x) / 2, ty = vertical ? p0.y + (p1.y > p0.y ? 16 : -8) : p0.y - 7;
          s += `<text x="${f.lx != null ? f.lx : tx}" y="${f.ly != null ? f.ly : ty}" ${vertical ? '' : 'text-anchor="middle"'} style="fill:${f.tone ? c : 'var(--text-2)'};font-size:11px;paint-order:stroke;stroke:var(--surface);stroke-width:4px;stroke-linejoin:round;${op}">${esc(f.t)}</text>`;
        }
      });
      // узлы
      (cfg.nodes || []).forEach(n => {
        const b = P[n.id]; if (!b) return;
        const tc = tone(n.id) || (n.tone ? TONE[n.tone] : null), sel = cfg.selected === n.id;
        const c = tc || 'var(--text)', sw = sel ? 2.6 : tc ? 2.2 : 1.4, op = dim.has(n.id) ? 'opacity:.35;' : '';
        s += `<g data-node="${esc(n.id)}" style="cursor:${cfg.onClick ? 'pointer' : 'default'};${op}">`;
        const fillTask = tc ? `color-mix(in srgb, ${tc} 12%, var(--surface))` : 'var(--surface)';
        if (isTask(n.type)) {
          if (n.type === 'blank') {
            s += `<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="10" style="fill:${tc ? fillTask : 'transparent'};stroke:${sel ? 'var(--accent)' : tc || 'var(--text-muted)'};stroke-width:${sw};stroke-dasharray:5 4"/>`;
          } else {
            s += `<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="10" style="fill:${fillTask};stroke:${sel ? 'var(--accent)' : c};stroke-width:${n.type === 'call' ? 3.4 : sw}"/>`;
            if (n.type === 'evsub') s += `<rect x="${b.x + 3}" y="${b.y + 3}" width="${b.w - 6}" height="${b.h - 6}" rx="8" style="fill:none;stroke:${c};stroke-width:1;stroke-dasharray:3 3"/>`;
            s += taskIcon(n, b.x, b.y, c);
          }
          const lines = wrap(n.t, n.type === 'blank' ? 16 : 17).slice(0, 4);
          const ly0 = b.cy - (lines.length - 1) * 7 + 4 - (n.type === 'sub' || n.type === 'call' || n.loop ? 5 : 0);
          lines.forEach((ln, i) => { s += `<text x="${b.cx}" y="${ly0 + i * 14}" text-anchor="middle" style="fill:${n.type === 'blank' && !n.t ? 'var(--text-muted)' : 'var(--text)'};font-size:11.5px">${esc(ln)}</text>`; });
          if (n.type === 'sub' || n.type === 'call') s += `<rect x="${b.cx - 6}" y="${b.y + b.h - 15}" width="12" height="12" rx="1.5" style="fill:none;stroke:${c};stroke-width:1.2"/><path d="M${b.cx - 3.5} ${b.y + b.h - 9} h7 M${b.cx} ${b.y + b.h - 12.5} v7" style="stroke:${c};stroke-width:1.2"/>`;
          if (n.loop) {
            const lx = n.type === 'sub' || n.type === 'call' ? b.cx + 14 : b.cx, ly = b.y + b.h - 10;
            if (n.loop === 'std') s += `<path d="M${lx - 4} ${ly + 3} a5 5 0 1 1 5 1" style="fill:none;stroke:${c};stroke-width:1.3"/><path d="M${lx + 1} ${ly + 4} l3 -3 M${lx + 1} ${ly + 4} l-1 -4" style="stroke:${c};stroke-width:1.2"/>`;
            if (n.loop === 'par') s += `<path d="M${lx - 4} ${ly - 5} v10 M${lx} ${ly - 5} v10 M${lx + 4} ${ly - 5} v10" style="stroke:${c};stroke-width:1.5"/>`;
            if (n.loop === 'seq') s += `<path d="M${lx - 5} ${ly - 4} h10 M${lx - 5} ${ly} h10 M${lx - 5} ${ly + 4} h10" style="stroke:${c};stroke-width:1.5"/>`;
          }
        } else if (isGw(n.type)) {
          const r = b.w / 2;
          s += `<path d="M${b.cx} ${b.cy - r} L${b.cx + r} ${b.cy} L${b.cx} ${b.cy + r} L${b.cx - r} ${b.cy} Z" style="fill:${fillTask};stroke:${sel ? 'var(--accent)' : c};stroke-width:${sw}"/>`;
          if (n.type === 'xor') s += `<path d="M${b.cx - 7} ${b.cy - 7} L${b.cx + 7} ${b.cy + 7} M${b.cx + 7} ${b.cy - 7} L${b.cx - 7} ${b.cy + 7}" style="stroke:${c};stroke-width:3;stroke-linecap:round"/>`;
          if (n.type === 'and') s += `<path d="M${b.cx - 10} ${b.cy} H${b.cx + 10} M${b.cx} ${b.cy - 10} V${b.cy + 10}" style="stroke:${c};stroke-width:3;stroke-linecap:round"/>`;
          if (n.type === 'or') s += `<circle cx="${b.cx}" cy="${b.cy}" r="9" style="fill:none;stroke:${c};stroke-width:2.6"/>`;
          if (n.type === 'evt') s += `<circle cx="${b.cx}" cy="${b.cy}" r="11" style="fill:none;stroke:${c};stroke-width:1.1"/><circle cx="${b.cx}" cy="${b.cy}" r="8.5" style="fill:none;stroke:${c};stroke-width:1.1"/><path d="M${b.cx} ${b.cy - 5.5} L${b.cx + 5.2} ${b.cy - 1.7} L${b.cx + 3.2} ${b.cy + 4.5} L${b.cx - 3.2} ${b.cy + 4.5} L${b.cx - 5.2} ${b.cy - 1.7} Z" style="fill:none;stroke:${c};stroke-width:1.1"/>`;
          if (n.t) { const lines = wrap(n.t, 20); lines.forEach((ln, i) => { s += `<text x="${b.cx}" y="${b.y - 8 - (lines.length - 1 - i) * 13}" text-anchor="middle" style="fill:var(--text);font-size:11px;paint-order:stroke;stroke:var(--surface);stroke-width:4px;stroke-linejoin:round">${esc(ln)}</text>`; }); }
        } else if (isEv(n.type)) {
          const r = b.w / 2, isEnd = /^end/.test(n.type), isInt = /^(int|b)/.test(n.type), ni = !!n.ni;
          const ef = n.attach ? 'var(--surface)' : fillTask;
          s += `<circle cx="${b.cx}" cy="${b.cy}" r="${r}" style="fill:${ef};stroke:${sel ? 'var(--accent)' : c};stroke-width:${isEnd ? 3.4 : sw};${ni ? 'stroke-dasharray:4 3;' : ''}"/>`;
          if (isInt) s += `<circle cx="${b.cx}" cy="${b.cy}" r="${r - 3.5}" style="fill:none;stroke:${c};stroke-width:1.2;${ni ? 'stroke-dasharray:4 3;' : ''}"/>`;
          s += evMarker(n, b.cx, b.cy, c, ef);
          if (n.t) { const lines = wrap(n.t, 18); lines.forEach((ln, i) => { s += `<text x="${b.cx}" y="${b.y + b.h + 13 + i * 13}" text-anchor="middle" style="fill:var(--text-2);font-size:11px;paint-order:stroke;stroke:var(--surface);stroke-width:4px;stroke-linejoin:round">${esc(ln)}</text>`; }); }
        } else if (/^data/.test(n.type)) {
          s += `<path d="M${b.x} ${b.y} h${b.w - 9} l9 9 v${b.h - 9} h-${b.w} z" style="fill:${fillTask};stroke:${c};stroke-width:${sw}"/><path d="M${b.x + b.w - 9} ${b.y} v9 h9" style="fill:none;stroke:${c};stroke-width:1.1"/>`;
          if (n.type !== 'data') s += `<path d="M${b.x + 4} ${b.y + 8} h5 v-3 l5 5 l-5 5 v-3 h-5 z" style="fill:${n.type === 'data-out' ? c : 'none'};stroke:${c};stroke-width:1"/>`;
          if (n.t) wrap(n.t, 18).forEach((ln, i) => { s += `<text x="${b.cx}" y="${b.y + b.h + 13 + i * 13}" text-anchor="middle" style="fill:var(--text-2);font-size:11px">${esc(ln)}</text>`; });
        } else if (n.type === 'store') {
          s += `<path d="M${b.x} ${b.y + 6} v${b.h - 12} a${b.w / 2} 6 0 0 0 ${b.w} 0 v-${b.h - 12}" style="fill:${fillTask};stroke:${c};stroke-width:${sw}"/><ellipse cx="${b.cx}" cy="${b.y + 6}" rx="${b.w / 2}" ry="6" style="fill:${fillTask};stroke:${c};stroke-width:${sw}"/><path d="M${b.x} ${b.y + 11} a${b.w / 2} 6 0 0 0 ${b.w} 0" style="fill:none;stroke:${c};stroke-width:1"/>`;
          if (n.t) wrap(n.t, 18).forEach((ln, i) => { s += `<text x="${b.cx}" y="${b.y + b.h + 13 + i * 13}" text-anchor="middle" style="fill:var(--text-2);font-size:11px">${esc(ln)}</text>`; });
        } else if (n.type === 'note') {
          s += `<path d="M${b.x + 12} ${b.y} h-12 v${b.h} h12" style="fill:none;stroke:${c};stroke-width:1.2"/>`;
          wrap(n.t, Math.max(14, Math.floor(b.w / 6.6))).slice(0, 4).forEach((ln, i) => { s += `<text x="${b.x + 6}" y="${b.y + 15 + i * 13}" style="fill:var(--text-2);font-size:11px;font-style:italic">${esc(ln)}</text>`; });
        }
        if (n.badge) s += `<g><circle cx="${b.x + b.w - 2}" cy="${b.y + 2}" r="9" style="fill:${tc || 'var(--accent)'}"/><text x="${b.x + b.w - 2}" y="${b.y + 6}" text-anchor="middle" style="fill:var(--bg);font-size:10.5px;font-weight:700">${esc(n.badge)}</text></g>`;
        s += '</g>';
      });
      s += '</svg>';
      el.innerHTML = `<div class="board bpmn-board">${s}</div>`;
    }
    el.addEventListener('click', e => { const g = e.target.closest('[data-node]'); if (g && cfg.onClick) cfg.onClick(g.dataset.node); });
    draw();
    return { redraw(next) { if (next) Object.assign(cfg, next); draw(); }, get cfg() { return cfg; } };
  };

  // Легенда элементов BPMN — маленькие образцы для теории
  ui.bpmnGlyph = (type, label, opts) => {
    const box = document.createElement('div');
    const isT = isTask(type);
    ui.bpmn(box, { colW: isT ? 150 : 90, rowH: isT ? 76 : 64, nodes: [Object.assign({ id: 'g', type, t: label || '', lane: '_l', col: 0 }, opts || {})] });
    return box.innerHTML;
  };
})();
