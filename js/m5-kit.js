/* Общий набор для облегчённых тренировок модуля 5 «Диаграммы» (5·5 и дальше).
   graph(model, opt) — схемы «блоки и стрелки» (C4, развёртывание, контекст, DFD, use case, EPC, IDEF0, Исикава и др.);
   заготовки: chipsTheory — теория «нажмите на элемент», textTheory — теория с таблицей, кодом и заметками;
   matchTask — сопоставление, labTask — лаборатория «решение → последствие», bugsTask — «найдите ошибки»,
   justifyTask — ответ своими словами по рубрике. Все проверки — чистые функции от ответа, как требует движок. */
'use strict';
(function () {
  const TR = window.TR, ui = TR.ui, esc = TR.esc;
  const pct = x => Math.round((x || 0) * 100) + ' %';

  if (!document.getElementById('m5k-css')) document.head.insertAdjacentHTML('beforeend', `<style id="m5k-css">
    .m5k-root { display: grid; gap: 14px; min-width: 0; }
    .m5k-root p { margin: 0; }
    .m5k-board { overflow-x: auto; border: 1px solid var(--border); border-radius: 12px; background: var(--surface-2); padding: 8px; }
    .m5k-board svg { display: block; margin: 0 auto; }
    .m5k-board [data-k] { cursor: pointer; }
    .m5k-chips { display: flex; flex-wrap: wrap; gap: 6px; }
    .m5k-chips .chip[aria-pressed="true"] { background: var(--accent); color: var(--accent-text); border-color: var(--accent); }
    .m5k-info { border: 1px solid var(--border); border-left: 4px solid var(--accent); border-radius: 10px; background: var(--surface); padding: 10px 14px; display: grid; gap: 6px; font-size: 14px; }
    .m5k-two { display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr); gap: 14px; align-items: start; }
    .m5k-tbl { width: 100%; border-collapse: collapse; font-size: 13.5px; }
    .m5k-tbl th, .m5k-tbl td { border-bottom: 1px solid var(--border); padding: 7px 8px; text-align: left; vertical-align: top; }
    .m5k-tbl th { color: var(--text-muted); font-size: 12.5px; }
    .m5k-scroll { overflow-x: auto; }
    .m5k-items { display: grid; gap: 6px; }
    .m5k-item { display: grid; grid-template-columns: 30px minmax(0, 1fr); gap: 8px; text-align: left; font: inherit; font-size: 14px; color: var(--text); background: var(--surface); border: 1px solid var(--border); border-radius: 9px; padding: 8px 10px; cursor: pointer; }
    .m5k-item .n { font: 700 12px var(--f-mono); color: var(--accent); }
    .m5k-item[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); }
    .m5k-item.ok { border-color: var(--ok); background: var(--ok-soft); }
    .m5k-item.bad { border-color: var(--bad); background: var(--bad-soft); }
    .m5k-item.miss { border-color: var(--warn); background: var(--warn-soft); }
    .m5k-item[disabled] { cursor: default; }
    .m5k-row { display: grid; grid-template-columns: minmax(0, 1fr) minmax(170px, 250px); gap: 10px; align-items: center; border: 1px solid var(--border); border-radius: 12px; background: var(--surface); padding: 10px 12px; }
    .m5k-row select { width: 100%; }
    .m5k-row .meta { font: 600 11px var(--f-mono); color: var(--text-muted); letter-spacing: .04em; }
    .m5k-row .res { grid-column: 1 / -1; font-size: 13.5px; border-radius: 8px; padding: 6px 10px; }
    .m5k-row .res.ok { background: var(--ok-soft); border-left: 3px solid var(--ok); }
    .m5k-row .res.bad { background: var(--bad-soft); border-left: 3px solid var(--bad); }
    .m5k-root pre.code, .m5k-root code { font-variant-ligatures: none; font-feature-settings: "liga" 0, "calt" 0; }
    @media (max-width: 820px) { .m5k-two { grid-template-columns: minmax(0, 1fr); } .m5k-row { grid-template-columns: minmax(0, 1fr); } }
  </style>`);

  /* ---------- схема «блоки и стрелки» ----------
     model: { nodes:[{id,kind,t,sub,x,y,w,h}], edges:[{a,b,t,dash,both,none,via:[[x,y]],ax,ay,bx,by}], groups:[{t,x,y,w,h}], W, H }
     kind: box sys cont ext db person actor node art proc store sq uc hex func xor note
     opt: { hl: kind|'edge', nums:{key:n}, marks:{key:'ok'|'bad'|'miss'}, path:Set(keys), label } ; ключи 'n:id', 'e:индекс' */
  function wrap(t, max) { const w = String(t).split(/[ \t]+/), out = []; let line = ''; w.forEach(x => { if ((line + ' ' + x).trim().length > max && line) { out.push(line); line = x; } else line = (line + ' ' + x).trim(); }); if (line) out.push(line); return out; }
  const FILL = { sys: 'var(--accent-soft)', cont: 'var(--info-soft)', ext: 'var(--surface-3)', person: 'var(--accent-soft)', func: 'var(--ok-soft)', hex: 'var(--info-soft)', note: 'var(--warn-soft)' };
  const STROKE = { sys: 'var(--accent)', cont: 'var(--info)', ext: 'var(--text-muted)', person: 'var(--accent)', func: 'var(--ok)', hex: 'var(--info)', note: 'var(--warn)' };
  function graph(m, opt) {
    opt = opt || {};
    const uid = 'm5k' + Math.random().toString(36).slice(2, 8), nodes = {};
    m.nodes.forEach(n => { nodes[n.id] = Object.assign({ w: 150, h: 54 }, n); });
    const W = m.W || Math.max(...m.nodes.map(n => n.x + (n.w || 150))) + 30, H = m.H || Math.max(...m.nodes.map(n => n.y + (n.h || 54))) + 30;
    const mark = k => opt.marks && opt.marks[k];
    const col = (k, base) => { const v = mark(k); return v === 'ok' ? 'var(--ok)' : v === 'bad' ? 'var(--bad)' : v === 'miss' ? 'var(--warn)' : (opt.path && opt.path.has(k)) ? 'var(--accent)' : base; };
    const num = (k, x, y) => opt.nums && opt.nums[k] ? `<circle cx="${x}" cy="${y}" r="9" style="fill:var(--accent)"/><text x="${x}" y="${y + 3.5}" text-anchor="middle" style="fill:var(--accent-text);font-size:10px;font-weight:700">${opt.nums[k]}</text>` : '';
    let s = `<svg viewBox="0 0 ${W} ${H}" width="100%" style="min-width:${Math.min(W, 460)}px;max-width:${W}px" role="img" aria-label="${esc(opt.label || 'Схема')}"><defs>`;
    ['var(--text-2)', 'var(--accent)', 'var(--ok)', 'var(--bad)', 'var(--warn)'].forEach((c, i) => { s += `<marker id="${uid}-${i}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" style="fill:${c}"/></marker>`; });
    s += '</defs>';
    const mi = c => Math.max(0, ['var(--text-2)', 'var(--accent)', 'var(--ok)', 'var(--bad)', 'var(--warn)'].indexOf(c));
    let labels = ''; // подписи стрелок рисуем последним слоем, поверх блоков
    (m.groups || []).forEach(g => { s += `<rect x="${g.x}" y="${g.y}" width="${g.w}" height="${g.h}" rx="10" style="fill:none;stroke:${g.solid ? 'var(--border-strong)' : 'var(--text-muted)'};stroke-width:1.4;${g.solid ? '' : 'stroke-dasharray:7 5'}"/><text x="${g.x + 10}" y="${g.y + 16}" style="fill:var(--text-muted);font-size:11px;font-weight:600">${esc(g.t || '')}</text>`; });
    const clip = (n, tx, ty) => { const cx = n.x + n.w / 2, cy = n.y + n.h / 2, dx = tx - cx, dy = ty - cy; if (!dx && !dy) return { x: cx, y: cy }; if (n.kind === 'proc' || n.kind === 'xor' || n.kind === 'uc') { const rx = n.w / 2, ry = n.h / 2, t = 1 / Math.sqrt((dx * dx) / (rx * rx) + (dy * dy) / (ry * ry)); return { x: cx + dx * t, y: cy + dy * t }; } const sx = (n.w / 2) / Math.abs(dx || 1e-9), sy = (n.h / 2) / Math.abs(dy || 1e-9), k = Math.min(sx, sy); return { x: cx + dx * k, y: cy + dy * k }; };
    m.edges.forEach((e, i) => {
      const A = nodes[e.a], B = nodes[e.b]; if (!A || !B) return;
      const k = 'e:' + i, base = opt.hl === 'edge' ? 'var(--accent)' : 'var(--text-2)', c = col(k, base), sw = (opt.path && opt.path.has(k)) || mark(k) || opt.hl === 'edge' ? 2.4 : 1.5;
      const pts = [];
      const firstT = e.via && e.via.length ? { x: e.via[0][0], y: e.via[0][1] } : { x: B.x + B.w / 2, y: B.y + B.h / 2 };
      const lastF = e.via && e.via.length ? { x: e.via[e.via.length - 1][0], y: e.via[e.via.length - 1][1] } : { x: A.x + A.w / 2, y: A.y + A.h / 2 };
      pts.push(e.ax != null ? { x: e.ax, y: e.ay } : clip(A, firstT.x, firstT.y));
      (e.via || []).forEach(p => pts.push({ x: p[0], y: p[1] }));
      pts.push(e.bx != null ? { x: e.bx, y: e.by } : clip(B, lastF.x, lastF.y));
      const d = 'M' + pts.map(p => `${p.x} ${p.y}`).join(' L');
      const mid = pts.length > 2 ? pts[Math.floor(pts.length / 2)] : { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 };
      s += `<g data-k="${k}" data-kind="edge"><path d="${d}" style="fill:none;stroke:transparent;stroke-width:12"/><path d="${d}" style="fill:none;stroke:${c};stroke-width:${sw};${e.dash ? 'stroke-dasharray:6 4;' : ''}" ${e.none ? '' : `marker-end="url(#${uid}-${mi(c)})"`} ${e.both ? `marker-start="url(#${uid}-${mi(c)})"` : ''}/>`;
      if (e.t) wrap(e.t, 26).forEach((ln, j, arr) => { labels += `<text x="${mid.x + (e.lx || 0)}" y="${mid.y + (e.ly || 0) - (arr.length - 1) * 6 + j * 12 + 4}" text-anchor="middle" style="fill:${c === 'var(--text-2)' ? 'var(--text-2)' : c};font-size:10.5px;paint-order:stroke;stroke:var(--surface-2);stroke-width:4px;pointer-events:none">${esc(ln)}</text>`; });
      labels += num(k, mid.x + (e.lx || 0) + 14, mid.y + (e.ly || 0) - 12);
      s += '</g>';
    });
    m.nodes.forEach(n0 => {
      const n = nodes[n0.id], k = 'n:' + n.id, hl = opt.hl && opt.hl === n.kind, inPath = opt.path && opt.path.has(k);
      const st = col(k, hl ? 'var(--accent)' : (STROKE[n.kind] || 'var(--border-strong)')), sw = hl || inPath || mark(k) ? 2.6 : 1.5, fill = inPath ? 'var(--accent-soft)' : (FILL[n.kind] || 'var(--surface)');
      const { x, y, w, h } = n, cx = x + w / 2, sty = `fill:${fill};stroke:${st};stroke-width:${sw}`;
      let shape = '', ty = y, th = h;
      switch (n.kind) {
        case 'db': shape = `<path d="M${x} ${y + 9} C${x} ${y - 3} ${x + w} ${y - 3} ${x + w} ${y + 9} V${y + h - 9} C${x + w} ${y + h + 3} ${x} ${y + h + 3} ${x} ${y + h - 9} Z" style="${sty}"/><path d="M${x} ${y + 9} C${x} ${y + 20} ${x + w} ${y + 20} ${x + w} ${y + 9}" style="fill:none;stroke:${st};stroke-width:${sw}"/>`; ty = y + 12; th = h - 12; break;
        case 'person': shape = `<circle cx="${cx}" cy="${y + 12}" r="11" style="${sty}"/><rect x="${x}" y="${y + 24}" width="${w}" height="${h - 24}" rx="14" style="${sty}"/>`; ty = y + 24; th = h - 24; break;
        case 'actor': shape = `<circle cx="${cx}" cy="${y + 8}" r="7" style="fill:none;stroke:${st};stroke-width:${sw}"/><path d="M${cx} ${y + 15} V${y + 33} M${cx - 11} ${y + 22} H${cx + 11} M${cx} ${y + 33} L${cx - 9} ${y + 46} M${cx} ${y + 33} L${cx + 9} ${y + 46}" style="fill:none;stroke:${st};stroke-width:${sw}"/>`; ty = y + 46; th = h - 46; break;
        case 'node': shape = `<polygon points="${x},${y + 10} ${x + 10},${y} ${x + w + 10},${y} ${x + w},${y + 10}" style="fill:var(--surface-3);stroke:${st};stroke-width:${sw}"/><polygon points="${x + w},${y + 10} ${x + w + 10},${y} ${x + w + 10},${y + h - 10} ${x + w},${y + h}" style="fill:var(--surface-3);stroke:${st};stroke-width:${sw}"/><rect x="${x}" y="${y + 10}" width="${w}" height="${h - 10}" style="${sty}"/>`; ty = y + 10; th = 30; break;
        case 'art': shape = `<path d="M${x} ${y} H${x + w - 12} L${x + w} ${y + 12} V${y + h} H${x} Z" style="${sty}"/><path d="M${x + w - 12} ${y} V${y + 12} H${x + w}" style="fill:none;stroke:${st};stroke-width:${sw}"/>`; break;
        case 'proc': case 'uc': shape = `<ellipse cx="${cx}" cy="${y + h / 2}" rx="${w / 2}" ry="${h / 2}" style="${sty}"/>`; break;
        case 'xor': shape = `<circle cx="${cx}" cy="${y + h / 2}" r="${Math.min(w, h) / 2}" style="${sty}"/>`; break;
        case 'store': shape = `<path d="M${x + w} ${y} H${x} V${y + h} H${x + w}" style="fill:${fill};stroke:${st};stroke-width:${sw}"/><path d="M${x + 26} ${y} V${y + h}" style="stroke:${st};stroke-width:${sw}"/>`; break;
        case 'sq': shape = `<rect x="${x}" y="${y}" width="${w}" height="${h}" style="${sty}"/>`; break;
        case 'hex': shape = `<polygon points="${x + 12},${y} ${x + w - 12},${y} ${x + w},${y + h / 2} ${x + w - 12},${y + h} ${x + 12},${y + h} ${x},${y + h / 2}" style="${sty}"/>`; break;
        case 'func': shape = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" style="${sty}"/>`; break;
        case 'note': shape = `<path d="M${x} ${y} H${x + w - 12} L${x + w} ${y + 12} V${y + h} H${x} Z" style="${sty}"/>`; break;
        default: shape = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${n.kind === 'box' ? 6 : 8}" style="${sty}"/>`;
      }
      const maxc = Math.max(8, Math.floor((n.kind === 'store' ? w - 34 : w - 16) / 7)), ls = wrap(n.t, maxc), sub = n.sub ? wrap(n.sub, maxc + 2) : [];
      const total = ls.length * 14 + sub.length * 12, tx = n.kind === 'store' ? x + 26 + (w - 26) / 2 : cx;
      let yy = ty + th / 2 - total / 2 + 11;
      let txt = '';
      if (n.kind === 'store' && n.code) txt += `<text x="${x + 13}" y="${y + h / 2 + 4}" text-anchor="middle" style="fill:var(--text-muted);font-size:10.5px;font-weight:700">${esc(n.code)}</text>`;
      ls.forEach(l => { txt += `<text x="${tx}" y="${yy}" text-anchor="middle" style="fill:var(--text);font-size:12px;font-weight:600">${esc(l)}</text>`; yy += 14; });
      sub.forEach(l => { txt += `<text x="${tx}" y="${yy}" text-anchor="middle" style="fill:var(--text-muted);font-size:10.5px">${esc(l)}</text>`; yy += 12; });
      if (n.kind === 'actor') { txt = ''; let ay = y + 60; ls.forEach(l => { txt += `<text x="${cx}" y="${ay}" text-anchor="middle" style="fill:var(--text);font-size:12px;font-weight:600">${esc(l)}</text>`; ay += 14; }); }
      s += `<g data-k="${k}" data-kind="${n.kind}">${shape}${txt}${num(k, x + w - 2, y + 2)}</g>`;
    });
    return s + labels + '</svg>';
  }

  /* ---------- общие кусочки ---------- */
  const board = html => `<div class="m5k-board">${html}</div>`;
  const brief = o => ui.brief({ situation: o.situation, todo: o.todo, lookTitle: 'Подсказка', look: o.look });

  /* ---------- теория «нажмите на элемент» ---------- */
  function chipsTheory(o) {
    return {
      id: o.id, covers: o.covers, title: o.title, free: true, noReset: true, simple: o.simple,
      render(el) {
        el.classList.add('m5k-root');
        let cur = o.start || o.chips[0].k;
        function draw() {
          const c = o.chips.find(x => x.k === cur);
          el.innerHTML = `<div class="m5k-root">${o.intro ? `<p>${o.intro}</p>` : ''}
            <div class="m5k-chips" role="group" aria-label="Элементы">${o.chips.map(x => `<button type="button" class="chip" data-ch="${x.k}" aria-pressed="${x.k === cur}">${esc(x.t)}</button>`).join('')}</div>
            <div class="${o.wide ? 'stack' : 'm5k-two'}">${board(o.svg(c.hl || c.k))}<div class="stack"><div class="m5k-info" aria-live="polite"><b>${esc(c.t)}</b><div>${c.html}</div></div>${(o.notes || []).map(n => ui.note(n[0], n[1], n[2])).join('')}</div></div></div>`;
        }
        TR.on(el, 'click', '[data-ch]', (e, b) => { cur = b.dataset.ch; draw(); });
        TR.on(el, 'click', '[data-kind]', (e, g) => { const k = g.dataset.kind, hit = o.chips.find(x => x.k === k || x.hl === k); if (hit) { cur = hit.k; draw(); } });
        draw();
      }
    };
  }
  /* ---------- теория-текст: таблица, схема, код, заметки ---------- */
  function textTheory(o) {
    return {
      id: o.id, covers: o.covers, title: o.title, free: true, noReset: true, simple: o.simple,
      render(el) {
        el.classList.add('m5k-root');
        let lang = o.code ? Object.keys(o.code)[0] : null;
        function draw() {
          el.innerHTML = `<div class="m5k-root">${o.intro ? `<p>${o.intro}</p>` : ''}
            ${o.table ? `<div class="m5k-scroll"><table class="m5k-tbl"><thead><tr>${o.table.head.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${o.table.rows.map(r => `<tr>${r.map((c, i) => `<td>${i === 0 ? `<b>${esc(c)}</b>` : esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>` : ''}
            ${o.svg ? board(o.svg()) : ''}
            ${o.code ? `<div class="row">${ui.seg('m5k-lang', Object.keys(o.code).map(k => ({ v: k, t: k })), lang)}</div>${ui.code(o.code[lang], 'text')}${o.codeNote && o.codeNote[lang] ? `<p class="small dim">${esc(o.codeNote[lang])}</p>` : ''}` : ''}
            ${(o.notes || []).map(n => ui.note(n[0], n[1], n[2])).join('')}</div>`;
        }
        TR.on(el, 'click', '[data-seg="m5k-lang"] button', (e, b) => { lang = b.dataset.v; draw(); });
        draw();
      }
    };
  }

  /* ---------- сопоставление ---------- */
  function matchTask(o) {
    const need = o.need || Math.ceil(o.rows.length * 0.75);
    const ev = v => { v = v || {}; const good = o.rows.filter(r => v[r.id] === r.a).length; return { good, score: good / o.rows.length }; };
    const lbl = v => (o.choices.find(c => c.v === v) || {}).t || v;
    return {
      id: o.id, title: o.title, simple: o.simple,
      lead: brief({ situation: o.situation, todo: [o.todo || 'Для каждой строки выберите вариант из списка.', `Нажмите «Проверить». Засчитывается, если верно хотя бы ${need} из ${o.rows.length}.`], look: o.look }),
      blank: () => ({ v: {} }),
      reference: () => ({ v: Object.fromEntries(o.rows.map(r => [r.id, r.a])) }),
      render(el, ctx) {
        el.classList.add('m5k-root');
        const a = ctx.ans; a.v = a.v || {};
        let rv = null;
        if (ctx.result) { rv = {}; o.rows.forEach(r => { if (a.v[r.id]) rv[r.id] = a.v[r.id] === r.a ? { s: 'ok', why: esc(r.why) } : { s: 'bad', why: `Нужно «${esc(lbl(r.a))}». ${esc(r.why)}` }; }); }
        el.innerHTML = `<div class="m5k-root">${o.svg ? board(o.svg()) : ''}<div data-m></div></div>`;
        ui.match(TR.$('[data-m]', el), { rows: o.rows.map(r => ({ id: r.id, t: esc(r.t) })), choices: o.choices, value: a.v, readonly: ctx.readonly, reveal: rv, placeholder: o.placeholder || 'Выберите…', onChange: v => { a.v = v; ctx.save(); } });
      },
      check(ans) {
        const v = (ans && ans.v) || {}, r = ev(v), notes = [];
        o.rows.forEach(x => { if (!v[x.id]) notes.push({ ok: false, html: `Не выбрано: ${esc(x.t)}.` }); else if (v[x.id] !== x.a) notes.push({ ok: false, html: `${esc(x.t)} — «${esc(lbl(x.a))}». ${esc(x.why)}` }); });
        if (r.good === o.rows.length) notes.push({ ok: true, html: 'Всё верно.' });
        return { ok: r.good >= need, score: r.score, notes, summary: `Верно ${r.good} из ${o.rows.length}.`, mentor: r.good >= need ? null : o.mentor };
      },
      explain: o.explain, refNote: `Засчитывается от ${need} верных из ${o.rows.length}.`,
      report: ans => { const v = (ans && ans.v) || {}; return o.rows.map(r => `- ${r.t}: ${v[r.id] ? lbl(v[r.id]) : '—'}${v[r.id] === r.a ? ' ✓' : ''}`).join('\n'); }
    };
  }

  /* ---------- лаборатория: решение → последствие ---------- */
  function labTask(o) {
    const need = o.need || Math.ceil(o.items.length * 0.8);
    const okOf = (it, v) => (Array.isArray(it.a) ? it.a : [it.a]).includes(v);
    const ev = v => { v = v || {}; const good = o.items.filter(it => okOf(it, v[it.id])).length; return { good, score: good / o.items.length }; };
    const lbl = v => (o.choices.find(c => c.v === v) || {}).t || v;
    const badOf = (it, v) => typeof it.bad === 'string' ? it.bad : (it.bad && it.bad[v]) || it.badAny || '';
    const right = it => (Array.isArray(it.a) ? it.a : [it.a]).map(lbl).join(' или ');
    return {
      id: o.id, title: o.title, simple: o.simple,
      lead: brief({ situation: o.situation, todo: [o.todo || 'Для каждой ситуации выберите решение.', 'Нажмите «Проверить» — увидите последствия каждого решения.', `Засчитывается, если верно хотя бы ${need} из ${o.items.length}.`], look: o.look }),
      blank: () => ({ v: {} }),
      reference: () => ({ v: Object.fromEntries(o.items.map(it => [it.id, Array.isArray(it.a) ? it.a[0] : it.a])) }),
      render(el, ctx) {
        el.classList.add('m5k-root');
        const a = ctx.ans; a.v = a.v || {};
        const shown = !!ctx.result || ctx.readonly, r = ev(a.v);
        el.innerHTML = `<div class="m5k-root">${o.svg ? board(o.svg()) : ''}${shown ? `<div class="row"><b>${esc(o.scoreLabel || 'Без последствий')}: ${r.good} из ${o.items.length}</b>${ui.meter(r.score)}</div>` : ''}
          ${o.items.map((it, i) => { const sel = a.v[it.id]; return `<div class="m5k-row"><div>${it.meta ? `<div class="meta">${esc(it.meta)}</div>` : ''}<div>${esc(it.t)}</div></div>
            <select data-lb="${it.id}" aria-label="Решение ${i + 1}" ${ctx.readonly ? 'disabled' : ''}><option value="">${esc(o.placeholder || 'Ваше решение…')}</option>${o.choices.map(c => `<option value="${c.v}" ${sel === c.v ? 'selected' : ''}>${esc(c.t)}</option>`).join('')}</select>
            ${shown ? (okOf(it, sel) ? `<div class="res ok">${esc(it.good)}</div>` : `<div class="res bad">${sel ? esc(badOf(it, sel)) : 'Не выбрано.'} Правильно: ${esc(right(it))}.</div>`) : ''}</div>`; }).join('')}</div>`;
        el.onchange = ctx.readonly ? null : e => { const s = e.target.closest('[data-lb]'); if (!s) return; if (s.value) a.v[s.dataset.lb] = s.value; else delete a.v[s.dataset.lb]; ctx.save(); const rr = s.parentElement.querySelector('.res'); if (rr) rr.remove(); };
      },
      check(ans) {
        const v = (ans && ans.v) || {}, r = ev(v), notes = [];
        o.items.forEach((it, i) => notes.push(okOf(it, v[it.id]) ? { ok: true, html: `${i + 1}. ${esc(it.short || it.t)} — верно.` } : { ok: false, html: `${i + 1}. ${esc(it.short || it.t)}: правильно — ${esc(right(it))}. ${v[it.id] ? esc(badOf(it, v[it.id])) : ''}` }));
        return { ok: r.good >= need, score: r.score, notes, summary: `Верно ${r.good} из ${o.items.length}.`, mentor: r.good >= need ? null : o.mentor };
      },
      explain: o.explain, refNote: o.refNote || `Засчитывается от ${need} верных из ${o.items.length}.`,
      report: ans => { const v = (ans && ans.v) || {}; return o.items.map((it, i) => `- ${i + 1}. ${v[it.id] ? lbl(v[it.id]) : '—'}${okOf(it, v[it.id]) ? ' ✓' : ''}`).join('\n'); }
    };
  }

  /* ---------- найдите ошибки ---------- */
  function bugsTask(o) {
    const ERR = o.items.map((x, i) => x.err ? i : -1).filter(i => i >= 0);
    const ev = m => { const s = new Set(m || []); const hit = ERR.filter(i => s.has(i)).length, wrong = [...s].filter(i => !ERR.includes(i)).length; return { hit, wrong, score: Math.max(0, (hit - wrong) / ERR.length) }; };
    return {
      id: o.id, title: o.title, simple: o.simple,
      lead: brief({ situation: o.situation, todo: ['Отметьте пункты с ошибками (номера совпадают с номерами на схеме).', `Ошибок ${ERR.length === 5 ? 'пять' : ERR.length === 4 ? 'четыре' : ERR.length}.`, `Нажмите «Проверить». Засчитывается, если найдены все и не больше одной лишней отметки.`], look: o.look }),
      blank: () => ({ m: [] }),
      reference: () => ({ m: ERR.slice() }),
      render(el, ctx) {
        el.classList.add('m5k-root');
        const a = ctx.ans; a.m = a.m || [];
        const shown = !!ctx.result || ctx.readonly, nums = {}, marks = {};
        o.items.forEach((x, i) => { if (x.k) { nums[x.k] = i + 1; if (shown) { const on = a.m.includes(i); marks[x.k] = on && x.err ? 'ok' : on && !x.err ? 'bad' : !on && x.err ? 'miss' : undefined; } } });
        el.innerHTML = `<div class="m5k-root">${board(o.svg(nums, marks))}
          <div class="m5k-items">${o.items.map((x, i) => { const on = a.m.includes(i), cls = shown ? (on && x.err ? 'ok' : on && !x.err ? 'bad' : !on && x.err ? 'miss' : '') : ''; return `<button type="button" class="m5k-item ${cls}" data-bg="${i}" aria-pressed="${on}" ${ctx.readonly ? 'disabled' : ''}><span class="n">${i + 1}</span><span>${esc(x.t)}${shown && x.err ? `<div class="small" style="margin-top:4px;color:var(--text-2)">${esc(x.err)}</div>` : ''}</span></button>`; }).join('')}</div>
          <div class="small dim" data-cnt>Отмечено: ${a.m.length}.${shown ? ' Зелёные — найдено, красные — лишняя отметка, жёлтые — пропущено.' : ''}</div>
          ${shown && o.fixed ? `<div class="eyebrow">Как правильно</div>${board(o.fixed())}` : ''}</div>`;
        el.onclick = ctx.readonly ? null : e => {
          const b = e.target.closest('[data-bg]'); if (!b) return;
          const i = +b.dataset.bg; a.m = a.m.includes(i) ? a.m.filter(x => x !== i) : a.m.concat(i).sort((x, y) => x - y); ctx.save();
          b.setAttribute('aria-pressed', String(a.m.includes(i))); b.classList.remove('ok', 'bad', 'miss');
          const c = TR.$('[data-cnt]', el); if (c) c.textContent = `Отмечено: ${a.m.length}.`;
        };
      },
      check(ans) {
        const m = (ans && ans.m) || [], r = ev(m), notes = [];
        ERR.forEach(i => notes.push({ ok: m.includes(i), html: `${i + 1}. ${esc(o.items[i].err)}${m.includes(i) ? '' : ' — пропущено.'}` }));
        m.filter(i => !ERR.includes(i)).forEach(i => notes.push({ ok: false, html: `${i + 1}. «${esc(o.items[i].t)}» — здесь всё верно.` }));
        return { ok: r.hit === ERR.length && r.wrong <= 1, score: r.score, notes, summary: `Найдено ${r.hit} из ${ERR.length}, лишних: ${r.wrong}.`, mentor: r.hit === ERR.length ? (r.wrong > 1 ? 'Ошибки найдены, но отмечены и верные элементы. Сверяйте каждую отметку с правилом.' : null) : o.mentor };
      },
      explain: o.explain, refNote: 'Засчитывается, если найдены все ошибки и не больше одной лишней отметки.',
      report: ans => { const r = ev((ans && ans.m) || []); return `- Найдено ошибок: ${r.hit}/${ERR.length}, лишних: ${r.wrong}`; }
    };
  }

  /* ---------- ответ своими словами ---------- */
  function justifyTask(o) {
    const min = o.minLen || 200;
    return {
      id: o.id, title: o.title,
      lead: brief({ situation: o.situation, todo: [`Ответьте своими словами, от ${min} символов.`, 'Проверьте ответ по рубрике (или попросите Веру).', 'Нажмите «Проверить». Засчитывается от 60 % по рубрике.'], look: o.look }),
      blank: () => ({ j: {} }),
      reference: () => ({ j: { text: o.ref, self: o.rubric.map(() => true) } }),
      render(el, ctx) {
        el.classList.add('m5k-root');
        const a = ctx.ans; a.j = a.j || {};
        el.innerHTML = `<div class="m5k-root">${ui.say(o.who, esc(o.say))}<div data-j></div></div>`;
        ui.justify(TR.$('[data-j]', el), { id: o.id + '-j', q: o.q, qPlain: o.qPlain, rubric: o.rubric, reference: o.ref, value: a.j, readonly: ctx.readonly, minLen: min, placeholder: o.placeholder || '…', onChange: v => { a.j = v; ctx.save(); ctx.decide(o.decide || o.title, v.text || ''); } });
      },
      check(ans) {
        const j = ui.justifyScore(ans && ans.j), notes = [];
        if (!j) notes.push({ ok: false, html: `Ответ не написан или не оценён: от ${min} символов, затем проверка по рубрике или с Верой.` });
        else notes.push({ ok: j >= 0.6 ? true : 'warn', html: `Ответ: ${pct(j)} по рубрике.${j < 0.6 && o.hint ? ' ' + esc(o.hint) : ''}` });
        return { ok: j >= 0.6, score: j, notes, summary: `Ответ: ${pct(j)} по рубрике.`, mentor: j >= 0.6 ? null : o.mentor };
      },
      explain: o.explain, refNote: 'Оценивается по рубрике: самопроверка или проверка Claude.',
      report: ans => `- ${o.title} (${pct(ui.justifyScore(ans && ans.j))}): ${(ans && ans.j && ans.j.text) || '—'}`
    };
  }

  TR.m5 = { graph, board, chipsTheory, textTheory, matchTask, labTask, bugsTask, justifyTask, pct, wrap };
})();
