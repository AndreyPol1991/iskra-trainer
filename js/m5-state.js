/* Модуль 5, занятие 1: Диаграмма состояний (UML State Machine, статусная модель).
   Теория: how-st-basics — элементы нотации на модели заказ-наряда «Искры»: начальное и конечное состояние, состояние,
   переход, событие, сторожевое условие [guard], действие / effect («нажмите на элемент — узнаете, что это»), бытовой
   пример — стиральная машина; how-st-sim — живой симулятор заказ-наряда: события, разрешённые и запрещённые переходы,
   журнал истории (связь с work_order и историей статусов из 4·3); how-st-table — таблица «статус × событие», тупики,
   недостижимые состояния, пустые клетки как вопросы бизнесу, код PlantUML и Mermaid.
   Практика: раскладка «состояние / событие / действие / условие»; найдите ошибки в черновике статусов записи (BR-3, BR-4);
   лаборатория «сценарии Лизы» — выбор статуса и последствия ошибки; диаграмма статусов платежа кодом (PlantUML или
   Mermaid) с живой схемой и проверкой по признакам; ответ Глебу, зачем рисовать статусы, если в базе это «просто поле». */
'use strict';
(function () {
  const TR = window.TR, ui = TR.ui, esc = TR.esc;
  const ID = 'm5-state';
  const pct = x => Math.round((x || 0) * 100) + ' %';

  if (!document.getElementById('m5s-css')) document.head.insertAdjacentHTML('beforeend', `<style id="m5s-css">
    .m5s-root { display: grid; gap: 14px; min-width: 0; }
    .m5s-root p { margin: 0; }
    .m5s-board { overflow-x: auto; border: 1px solid var(--border); border-radius: 12px; background: var(--surface-2); padding: 8px; }
    .m5s-board svg { display: block; margin: 0 auto; }
    .m5s-board [data-st], .m5s-board [data-tr] { cursor: pointer; }
    .m5s-chips { display: flex; flex-wrap: wrap; gap: 6px; }
    .m5s-chips .chip[aria-pressed="true"] { background: var(--accent); color: var(--accent-text); border-color: var(--accent); }
    .m5s-info { border: 1px solid var(--border); border-left: 4px solid var(--accent); border-radius: 10px; background: var(--surface); padding: 10px 14px; display: grid; gap: 6px; font-size: 14px; min-height: 60px; }
    .m5s-two { display: grid; grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr); gap: 14px; align-items: start; }
    .m5s-evs { display: grid; gap: 6px; }
    .m5s-ev { text-align: left; font: inherit; font-size: 14px; color: var(--text); background: var(--surface); border: 1px solid var(--border); border-radius: 9px; padding: 8px 10px; cursor: pointer; }
    .m5s-ev:hover { border-color: var(--accent); }
    .m5s-log { display: grid; gap: 4px; font: 12.5px/1.45 var(--f-mono); max-height: 220px; overflow: auto; border: 1px solid var(--border); border-radius: 10px; background: var(--code-bg); padding: 8px 10px; }
    .m5s-log .bad { color: var(--bad); } .m5s-log .ok { color: var(--ok); }
    .m5s-msg { border-radius: 9px; padding: 8px 12px; font-size: 14px; }
    .m5s-msg.ok { background: var(--ok-soft); border-left: 3px solid var(--ok); }
    .m5s-msg.bad { background: var(--bad-soft); border-left: 3px solid var(--bad); }
    .m5s-tbl { width: 100%; border-collapse: collapse; font-size: 13px; }
    .m5s-tbl th, .m5s-tbl td { border: 1px solid var(--border); padding: 6px 8px; text-align: center; vertical-align: middle; }
    .m5s-tbl th { background: var(--surface-2); color: var(--text-2); font-weight: 600; }
    .m5s-tbl th:first-child, .m5s-tbl td:first-child { text-align: left; }
    .m5s-tbl td.go { background: var(--ok-soft); color: var(--text); font-weight: 600; }
    .m5s-tbl td.empty.hl { background: var(--warn-soft); }
    .m5s-scroll { overflow-x: auto; }
    .m5s-items { display: grid; gap: 6px; }
    .m5s-item { display: grid; grid-template-columns: 30px minmax(0, 1fr); gap: 8px; align-items: start; text-align: left; font: inherit; font-size: 14px; color: var(--text); background: var(--surface); border: 1px solid var(--border); border-radius: 9px; padding: 8px 10px; cursor: pointer; }
    .m5s-item .n { font: 700 12px var(--f-mono); color: var(--accent); }
    .m5s-item[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); }
    .m5s-item.ok { border-color: var(--ok); background: var(--ok-soft); }
    .m5s-item.bad { border-color: var(--bad); background: var(--bad-soft); }
    .m5s-item.miss { border-color: var(--warn); background: var(--warn-soft); }
    .m5s-item[disabled] { cursor: default; }
    .m5s-sc { display: grid; grid-template-columns: minmax(0, 1fr) minmax(150px, 210px); gap: 10px; align-items: center; border: 1px solid var(--border); border-radius: 12px; background: var(--surface); padding: 10px 12px; }
    .m5s-sc .obj { font: 600 11px var(--f-mono); color: var(--text-muted); text-transform: uppercase; letter-spacing: .06em; }
    .m5s-sc select { width: 100%; }
    .m5s-sc .res { grid-column: 1 / -1; font-size: 13.5px; border-radius: 8px; padding: 6px 10px; }
    .m5s-sc .res.ok { background: var(--ok-soft); border-left: 3px solid var(--ok); }
    .m5s-sc .res.bad { background: var(--bad-soft); border-left: 3px solid var(--bad); }
    .m5s-ed textarea { width: 100%; min-height: 240px; box-sizing: border-box; font: 12.5px/1.55 var(--f-mono); font-variant-ligatures: none; font-feature-settings: "liga" 0, "calt" 0; background: var(--code-bg); color: var(--text); border: 1px solid var(--border); border-radius: 10px; padding: 10px; resize: vertical; }
    .m5s-feats { display: grid; gap: 4px; font-size: 13.5px; }
    .m5s-feat { display: grid; grid-template-columns: 22px minmax(0, 1fr); gap: 6px; }
    .m5s-feat .mk { font-weight: 700; color: var(--text-muted); } .m5s-feat.on .mk { color: var(--ok); }
    .m5s-pm { font-size: 12.5px; padding: 4px 8px; border-radius: 8px; background: var(--bad-soft); color: var(--bad); }
    .m5s-pm.warn { background: var(--warn-soft); color: var(--warn); }
    .m5s-root pre.code { font-variant-ligatures: none; font-feature-settings: "liga" 0, "calt" 0; }
    @media (max-width: 820px) { .m5s-two { grid-template-columns: minmax(0, 1fr); } .m5s-sc { grid-template-columns: minmax(0, 1fr); } }
  </style>`);

  /* ---------- рисование статусной модели ----------
     model: { states:[{id,t,sub}], tr:[{id,from,to,t}], start:[id], final:[id], pos:{id:{x,y}} }
     opt: { hl: 'st:id' | 'tr:id', cur: id, marks: { 'st:id'|'tr:id': 'ok'|'bad'|'miss'|n }, nums: { key: n } } */
  let svgN = 0;
  function smSVG(m, opt) {
    opt = opt || {};
    const uid = 'm5s' + (++svgN), BW = 160, BH = 44, pos = m.pos;
    const xs = Object.values(pos).map(p => p.x), ys = Object.values(pos).map(p => p.y);
    const W = Math.max(...xs) + BW + 40, H = Math.max(...ys) + BH + 70;
    const col = k => { const mk = opt.marks && opt.marks[k]; return mk === 'ok' ? 'var(--ok)' : mk === 'bad' ? 'var(--bad)' : mk === 'miss' ? 'var(--warn)' : opt.hl === k ? 'var(--accent)' : 'var(--text-2)'; };
    let s = `<svg viewBox="0 0 ${W} ${H}" width="100%" style="min-width:${Math.min(W, 560)}px;max-width:${W}px" role="img" aria-label="${esc(opt.label || 'Диаграмма состояний')}"><defs>`;
    ['var(--text-2)', 'var(--accent)', 'var(--ok)', 'var(--bad)', 'var(--warn)'].forEach((c, i) => { s += `<marker id="${uid}-a${i}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" style="fill:${c}"/></marker>`; });
    s += '</defs>';
    const mid = c => ['var(--text-2)', 'var(--accent)', 'var(--ok)', 'var(--bad)', 'var(--warn)'].indexOf(c);
    const num = (k, x, y) => opt.nums && opt.nums[k] ? `<circle cx="${x}" cy="${y}" r="9" style="fill:var(--accent)"/><text x="${x}" y="${y + 3.5}" text-anchor="middle" style="fill:var(--accent-text);font-size:10px;font-weight:700">${opt.nums[k]}</text>` : '';
    m.tr.forEach(t => {
      const A = pos[t.from], B = pos[t.to]; if (!A || !B) return;
      const k = 'tr:' + t.id, c = col(k);
      let d, lx, ly, anchor = 'middle';
      const nl = String(t.t || '').split(/\n/).length;
      if (B.x > A.x) { const x1 = A.x + BW, y1 = A.y + BH / 2, x2 = B.x, y2 = B.y + BH / 2; d = `M${x1} ${y1} C${x1 + 40} ${y1} ${x2 - 40} ${y2} ${x2} ${y2}`; lx = (x1 + x2) / 2; ly = (y1 + y2) / 2 - 8 - (nl - 1) * 13; }
      else if (B.x < A.x && t.arc === 'up') { const x1 = A.x + 30, y1 = A.y, x2 = B.x + BW - 30, y2 = B.y, top = Math.min(y1, y2) - 52; d = `M${x1} ${y1} C${x1} ${top} ${x2} ${top} ${x2} ${y2}`; lx = (x1 + x2) / 2; ly = top + 14; }
      else if (B.x < A.x) { const x1 = A.x, y1 = A.y + BH - 8, x2 = B.x + BW, y2 = B.y + BH - 8, dip = Math.max(y1, y2) + 34; d = `M${x1} ${y1} C${x1 - 40} ${dip} ${x2 + 40} ${dip} ${x2} ${y2}`; lx = (x1 + x2) / 2; ly = dip - 4; }
      else if (B.y > A.y) { const x = A.x + BW / 2 - 18, y1 = A.y + BH, y2 = B.y; d = `M${x} ${y1} L${x} ${y2}`; lx = x + 6; ly = (y1 + y2) / 2 + 4; anchor = 'start'; }
      else { const x = A.x + BW / 2 + 18, y1 = A.y, y2 = B.y + BH; d = `M${x} ${y1} L${x} ${y2}`; lx = x - 6; ly = (y1 + y2) / 2 + 4; anchor = 'end'; }
      s += `<g data-tr="${esc(t.id)}"><path d="${d}" style="fill:none;stroke:transparent;stroke-width:14"/><path d="${d}" style="fill:none;stroke:${c};stroke-width:${opt.hl === k ? 2.6 : 1.6}" marker-end="url(#${uid}-a${Math.max(0, mid(c))})"/>`;
      String(t.t || '').split('\n').forEach((ln, i) => { s += `<text x="${lx}" y="${ly + i * 13}" text-anchor="${anchor}" style="fill:${opt.hl === k ? 'var(--accent)' : 'var(--text-2)'};font-size:12px;paint-order:stroke;stroke:var(--surface-2);stroke-width:4px">${esc(ln)}</text>`; });
      s += num(k, lx + (anchor === 'end' ? 8 : anchor === 'start' ? -8 : 0), ly - 15) + '</g>';
    });
    (m.start || []).forEach(id => { const p = pos[id]; if (!p) return; const k = 'start', c = col(k); s += `<g data-st="__start"><circle cx="${p.x - 26}" cy="${p.y + BH / 2}" r="7" style="fill:${opt.hl === k ? 'var(--accent)' : 'var(--text)'}"/><path d="M${p.x - 19} ${p.y + BH / 2} H${p.x - 2}" style="stroke:${c};stroke-width:1.6" marker-end="url(#${uid}-a${Math.max(0, mid(c))})"/>${num('start', p.x - 26, p.y + BH / 2 - 16)}</g>`; });
    m.states.forEach(st => {
      const p = pos[st.id]; if (!p) return;
      const k = 'st:' + st.id, c = col(k), cur = opt.cur === st.id, fin = (m.final || []).includes(st.id);
      s += `<g data-st="${esc(st.id)}"><rect x="${p.x}" y="${p.y}" width="${BW}" height="${BH}" rx="21" style="fill:${cur ? 'var(--accent-soft)' : 'var(--surface)'};stroke:${cur ? 'var(--accent)' : c};stroke-width:${cur || opt.hl === k ? 2.6 : 1.5}"/>`;
      s += `<text x="${p.x + BW / 2}" y="${p.y + (st.sub ? 18 : 25)}" text-anchor="middle" style="fill:var(--text);font-size:14px;font-weight:600">${esc(st.t)}</text>`;
      if (st.sub) s += `<text x="${p.x + BW / 2}" y="${p.y + 33}" text-anchor="middle" style="fill:var(--text-muted);font-size:11px;font-family:var(--f-mono)">${esc(st.sub)}</text>`;
      if (fin) { const fx = p.x + BW / 2, fy = p.y + BH + 22; s += `<path d="M${fx} ${p.y + BH} V${fy - 9}" style="stroke:var(--text-2);stroke-width:1.4" marker-end="url(#${uid}-a0)"/><circle cx="${fx}" cy="${fy}" r="8" style="fill:none;stroke:var(--text);stroke-width:1.5"/><circle cx="${fx}" cy="${fy}" r="4.5" style="fill:var(--text)"/>`; }
      s += num(k, p.x + BW - 4, p.y + 2) + '</g>';
    });
    return s + '</svg>';
  }

  /* ---------- модель заказ-наряда (как в базе и в разделе «Система») ---------- */
  const ru = (k, v) => (TR.db && TR.db.enumRu ? TR.db.enumRu(k, v) : v);
  const WO = {
    states: ['open', 'in_progress', 'waiting_approval', 'ready', 'closed', 'cancelled'].map(id => ({ id, t: ru('work_order.status', id), sub: id })),
    tr: [
      { id: 'start', from: 'open', to: 'in_progress', t: 'механик начал работы', ev: 'e_start' },
      { id: 'offer', from: 'in_progress', to: 'waiting_approval', t: 'предложение доп. работ\n/ push клиенту', ev: 'e_offer' },
      { id: 'back', from: 'waiting_approval', to: 'in_progress', t: 'решение клиента\nили [20 мин без ответа] (BR-8)', ev: 'e_agree' },
      { id: 'done', from: 'in_progress', to: 'ready', t: 'работы сделаны\n/ push и SMS', ev: 'e_done' },
      { id: 'close', from: 'ready', to: 'closed', t: 'оплата и выдача', ev: 'e_paid' },
      { id: 'cancel', from: 'open', to: 'cancelled', t: 'клиент передумал', ev: 'e_cancel' }
    ],
    start: ['open'], final: ['closed', 'cancelled'],
    pos: { open: { x: 40, y: 30 }, in_progress: { x: 330, y: 30 }, cancelled: { x: 40, y: 160 }, waiting_approval: { x: 620, y: 160 }, ready: { x: 620, y: 30 }, closed: { x: 910, y: 30 } }
  };
  const woName = id => ru('work_order.status', id);

  /* =====================================================================
     ТЕОРИЯ
     ===================================================================== */
  const NOTIONS = [
    { k: 'start', t: 'Начальное состояние', hl: 'start', html: '<b>Чёрный кружок</b> — откуда объект начинает жизнь. Заказ-наряд создаётся в статусе «Открыт», когда мастер-приёмщик принял машину. Начальное состояние одно, и в него не возвращаются.' },
    { k: 'state', t: 'Состояние', hl: 'st:in_progress', html: '<b>Скруглённый прямоугольник</b> — устойчивое положение, в котором объект живёт какое-то время и ждёт события: «В работе», «Ждёт согласования». Название — прилагательное или причастие («Готов», «Выдан»), не глагол: «Выдать» — это действие.' },
    { k: 'tr', t: 'Переход', hl: 'tr:done', html: '<b>Стрелка</b> — разрешённая смена состояния. Чего нет на диаграмме, то запрещено: из «Готов» стрелки в «В работе» нет — значит, вернуть машину в работу после «Готов» система не должна.' },
    { k: 'ev', t: 'Событие', hl: 'tr:done', html: '<b>Подпись на стрелке</b> — что запускает переход: «работы сделаны», «клиент передумал», «вебхук ЮKassa». Событие происходит мгновенно, а состояние длится.' },
    { k: 'guard', t: 'Условие [guard]', hl: 'tr:back', html: '<b>В квадратных скобках</b> — сторожевое условие: переход сработает, только если оно истинно. «[20 мин без ответа]» — правило BR-8: нет ответа в приложении 20 минут — основные работы продолжаются.' },
    { k: 'act', t: 'Действие / effect', hl: 'tr:offer', html: '<b>После косой черты</b> — что система делает при переходе: «/ push клиенту», «/ push и SMS». Полная запись: <code>событие [условие] / действие</code>.' },
    { k: 'final', t: 'Конечное состояние', hl: 'st:closed', html: '<b>Кружок в кольце</b> — жизнь объекта закончилась: «Выдан» или «Отменён». Из конечных состояний переходов нет; если «Выдан» вдруг нужно «открыть снова» — это новый заказ-наряд, а не стрелка назад.' }
  ];
  const howBasics = {
    id: 'how-st-basics', covers: ['kind'], title: 'Как это работает: состояния, переходы, события и условия', free: true, noReset: true,
    simple: { icon: '🔁', title: 'Простыми словами', plain: 'Диаграмма состояний показывает, какие статусы бывают у одного объекта и как он из одного попадает в другой. Всё, чего нет на схеме, запрещено.', analogy: 'Стиральная машина: «Ожидание» → нажали «Старт» → «Стирка» → «Полоскание» → «Отжим» → «Готово». Открыть дверцу во время стирки нельзя — такого перехода нет. Если машина позволяет — это дефект, и именно его находит диаграмма.', tech: 'UML 2.5.1, раздел 14 «State Machines». Переход записывается как событие [сторожевое условие] / действие. Статусная модель — обязательная часть постановки для любого объекта со статусом (BABOK, 10.45 «State Modelling»).' },
    render(el) {
      el.classList.add('m5s-root');
      let cur = 'state';
      function draw() {
        const n = NOTIONS.find(x => x.k === cur);
        el.innerHTML = `<div class="m5s-root">
          <p>Статусная модель заказ-наряда «Искры» — та же, что в разделе «Система» и в таблице <code>work_order</code>. Нажмите на понятие или прямо на элемент схемы.</p>
          <div class="m5s-chips" role="group" aria-label="Элементы диаграммы">${NOTIONS.map(x => `<button type="button" class="chip" data-nt="${x.k}" aria-pressed="${x.k === cur}">${esc(x.t)}</button>`).join('')}</div>
          <div class="m5s-board">${smSVG(WO, { hl: n.hl, label: 'Статусы заказ-наряда' })}</div>
          <div class="m5s-info" aria-live="polite"><b>${esc(n.t)}</b><div>${n.html}</div></div>
          ${ui.note('warn', 'Частые ошибки', 'Состояние названо глаголом («Оплатить» вместо «Оплачен»); стрелка без события — непонятно, что её запускает; «тупик» — в состояние можно попасть, а выйти нельзя, хотя оно не конечное; стрелка из конечного состояния «назад».')}
          ${ui.note('', 'Как спросят на собеседовании', '«Чем состояние отличается от события?» — Состояние длится: заказ-наряд «В работе» час. Событие мгновенно: «механик отметил работы сделанными». События переводят объект из состояния в состояние.')}</div>`;
      }
      TR.on(el, 'click', '[data-nt]', (e, b) => { cur = b.dataset.nt; draw(); });
      TR.on(el, 'click', '[data-st],[data-tr]', (e, g) => {
        const st = g.dataset.st, tr = g.dataset.tr;
        cur = st === '__start' ? 'start' : st ? ((WO.final.includes(st)) ? 'final' : 'state') : tr === 'back' ? 'guard' : tr === 'offer' ? 'act' : 'tr';
        draw();
      });
      draw();
    }
  };

  const EVENTS = [
    { id: 'e_start', t: 'Механик начал работы' },
    { id: 'e_offer', t: 'Механик нашёл проблему, мастер отправил предложение доп. работ' },
    { id: 'e_agree', t: 'Клиент ответил в приложении (согласен или нет)' },
    { id: 'e_timeout', t: 'Прошло 20 минут, ответа нет, мастер не дозвонился' },
    { id: 'e_done', t: 'Все работы сделаны' },
    { id: 'e_paid', t: 'Клиент оплатил и забрал машину' },
    { id: 'e_cancel', t: 'Клиент передумал до начала работ' },
    { id: 'e_more', t: 'Клиент после «Готов» просит ещё одну доп. работу' }
  ];
  const SIM = { e_start: { open: 'in_progress' }, e_offer: { in_progress: 'waiting_approval' }, e_agree: { waiting_approval: 'in_progress' }, e_timeout: { waiting_approval: 'in_progress' }, e_done: { in_progress: 'ready' }, e_paid: { ready: 'closed' }, e_cancel: { open: 'cancelled' }, e_more: {} };
  const SIM_WHY = {
    e_timeout: 'По BR-8 основные работы продолжаются, доп. работы ждут; к концу основных ответа нет — предложение «Истекло».',
    e_agree: 'Решение клиента возвращает заказ-наряд в работу: согласованные строки добавляются, отклонённые — нет.',
    e_done: 'Система отправляет клиенту push и SMS «машина готова».',
    e_paid: 'После оплаты начисляются бонусы (BR-11), заказ-наряд выгружается в 1С.'
  };
  const howSim = {
    id: 'how-st-sim', covers: ['lab'], title: 'Как это работает: живой симулятор заказ-наряда', free: true, noReset: true,
    simple: { icon: '🎮', title: 'Простыми словами', plain: 'Диаграмма состояний — это правила игры для объекта. Если на событие нет стрелки из текущего статуса, система должна отказать. А каждый такой отказ — вопрос: «точно запрещено, или мы забыли переход?»', analogy: 'Как настольная игра: фишку можно двигать только по нарисованным дорожкам. Если игрок хочет пойти напрямик, а дорожки нет — либо ход запрещён, либо в правилах дыра.', tech: 'В базе состояние — поле <code>work_order.status</code>, а каждый переход пишется в историю (кто, когда, из какого статуса в какой) — это разбирали в 4·3. Диаграмма задаёт, какие записи в истории вообще возможны.' },
    render(el) {
      el.classList.add('m5s-root');
      let cur = 'open', log = [{ ok: true, t: 'Заказ-наряд создан: «' + woName('open') + '»' }], msg = null;
      function draw() {
        el.innerHTML = `<div class="m5s-root"><p>Машина Елены на подъёмнике. Нажимайте события — схема покажет, куда перейдёт заказ-наряд, или объяснит, почему перехода нет.</p>
          <div class="m5s-board">${smSVG(WO, { cur, label: 'Симулятор заказ-наряда' })}</div>
          ${msg ? `<div class="m5s-msg ${msg.ok ? 'ok' : 'bad'}" aria-live="polite">${msg.html}</div>` : ''}
          <div class="m5s-two"><div class="m5s-evs">${EVENTS.map(e => `<button type="button" class="m5s-ev" data-ev="${e.id}">⚡ ${esc(e.t)}</button>`).join('')}</div>
            <div class="stack"><div class="eyebrow">История статусов (как в таблице истории)</div><div class="m5s-log">${log.map(l => `<div class="${l.ok ? 'ok' : 'bad'}">${esc(l.t)}</div>`).join('')}</div><button type="button" class="btn sm ghost" data-reset>⟲ Новый заказ-наряд</button></div></div>
          ${ui.note('info', 'Что здесь видно', 'Событие «Клиент после „Готов“ просит ещё одну доп. работу» ни из одного статуса никуда не ведёт. Это не баг симулятора, а настоящая дыра в модели — тот самый вопрос Лизы. Вариантов два: открыть новый заказ-наряд или разрешить переход «Готов → В работе». Решает бизнес (Марина Олеговна), а аналитик фиксирует решение на диаграмме.')}</div>`;
      }
      TR.on(el, 'click', '[data-ev]', (e, b) => {
        const ev = EVENTS.find(x => x.id === b.dataset.ev), to = SIM[ev.id][cur];
        if (to) { log.push({ ok: true, t: `${woName(cur)} → ${woName(to)} · ${ev.t}` }); msg = { ok: true, html: `<b>${esc(woName(cur))} → ${esc(woName(to))}.</b> ${esc(SIM_WHY[ev.id] || '')}` }; cur = to; }
        else { log.push({ ok: false, t: `отказ: «${ev.t}» в статусе «${woName(cur)}»` }); msg = { ok: false, html: `<b>Перехода нет.</b> Из «${esc(woName(cur))}» по событию «${esc(ev.t)}» стрелки на диаграмме нет — система должна отказать.${ev.id === 'e_more' ? ' И это вопрос к бизнесу: что делать, если клиент просит доп. работу после «Готов»?' : WO.final.includes(cur) ? ' Объект уже в конечном состоянии.' : ''}` }; }
        draw();
      });
      TR.on(el, 'click', '[data-reset]', () => { cur = 'open'; log = [{ ok: true, t: 'Заказ-наряд создан: «' + woName('open') + '»' }]; msg = null; draw(); });
      draw();
    }
  };

  const WO_PUML = `@startuml
state "Открыт" as open
state "В работе" as in_progress
state "Ждёт согласования" as waiting_approval
state "Готов" as ready
state "Выдан" as closed
state "Отменён" as cancelled
[*] --> open
open --> in_progress : механик начал работы
in_progress --> waiting_approval : предложение доп. работ / push
waiting_approval --> in_progress : решение клиента или [20 мин без ответа]
in_progress --> ready : работы сделаны / push и SMS
ready --> closed : оплата и выдача
open --> cancelled : клиент передумал
closed --> [*]
cancelled --> [*]
@enduml`;
  const WO_MM = `stateDiagram-v2
  state "Открыт" as open
  state "В работе" as in_progress
  state "Ждёт согласования" as waiting_approval
  state "Готов" as ready
  state "Выдан" as closed
  state "Отменён" as cancelled
  [*] --> open
  open --> in_progress: механик начал работы
  in_progress --> waiting_approval: предложение доп. работ / push
  waiting_approval --> in_progress: решение клиента или 20 мин без ответа
  in_progress --> ready: работы сделаны / push и SMS
  ready --> closed: оплата и выдача
  open --> cancelled: клиент передумал
  closed --> [*]
  cancelled --> [*]`;
  const howTable = {
    id: 'how-st-table', covers: ['bugs', 'code'], title: 'Как это работает: таблица «статус × событие» и код диаграммы', free: true, noReset: true,
    simple: { icon: '🧮', title: 'Простыми словами', plain: 'Чтобы проверить модель на дыры, разложите её в таблицу: строки — статусы, столбцы — события. В клетке — куда переходим. Пустая клетка — либо запрет, либо забытый случай.', analogy: 'Как таблица умножения: пропущенную клетку видно сразу, а в длинном тексте пропуск не заметишь.', tech: 'Таблица переходов (state transition table) эквивалентна диаграмме. Из неё тестировщики строят тесты переходов (ISTQB, «тестирование переходов состояний»): каждая заполненная клетка — позитивный тест, каждая пустая — негативный.' },
    render(el) {
      el.classList.add('m5s-root');
      let hl = false, lang = 'pu';
      function draw() {
        const evs = EVENTS.filter(e => e.id !== 'e_more');
        el.innerHTML = `<div class="m5s-root"><p>Та же модель заказ-наряда, разложенная в таблицу. Зелёные клетки — разрешённые переходы.</p>
          <div class="row"><button type="button" class="btn sm" data-hl aria-pressed="${hl}">${hl ? 'Скрыть' : 'Подсветить'} пустые клетки</button></div>
          <div class="m5s-scroll"><table class="m5s-tbl"><thead><tr><th>Статус \\ событие</th>${evs.map(e => `<th>${esc(e.t.replace(/,.*$/, ''))}</th>`).join('')}</tr></thead><tbody>${WO.states.map(st => `<tr><td><b>${esc(st.t)}</b></td>${evs.map(e => { const to = SIM[e.id][st.id]; return to ? `<td class="go">→ ${esc(woName(to))}</td>` : `<td class="empty ${hl ? 'hl' : ''}">—</td>`; }).join('')}</tr>`).join('')}</tbody></table></div>
          <div class="m5s-two"><div class="stack">
            <div class="card"><b>Как проверять модель</b><ul style="margin:0;padding-left:18px;display:grid;gap:4px">
              <li><b>Тупики:</b> в статус можно попасть, но выйти нельзя, и он не конечный.</li>
              <li><b>Недостижимые:</b> в статус не ведёт ни одна стрелка.</li>
              <li><b>Пустые клетки:</b> для каждой спросите бизнес: «запрещено или забыли?» — например, отмена заказ-наряда «В работе».</li>
              <li><b>Конечные состояния:</b> из них стрелок нет.</li>
              <li><b>Условия:</b> у двух стрелок из одного статуса по одному событию условия не должны пересекаться.</li></ul></div>
            ${ui.note('', 'Как спросят на собеседовании', '«Как тестировщику проверить статусную модель?» — Каждая заполненная клетка таблицы — позитивный тест: переход должен сработать. Каждая пустая — негативный: система должна отказать. Плюс тупики и недостижимые статусы.')}</div>
            <div class="stack"><div class="row">${ui.seg('m5s-lang', [{ v: 'pu', t: 'PlantUML' }, { v: 'mm', t: 'Mermaid' }], lang)}</div>${ui.code(lang === 'pu' ? WO_PUML : WO_MM, 'text')}<p class="small dim">${lang === 'pu' ? 'state "Имя" as id — русское имя и короткий идентификатор; [*] — начало и конец; подпись после двоеточия.' : 'Первая строка — stateDiagram-v2; идентификаторы латиницей, русское имя через state "Имя" as id.'}</p></div></div></div>`;
      }
      TR.on(el, 'click', '[data-hl]', () => { hl = !hl; draw(); });
      TR.on(el, 'click', '[data-seg="m5s-lang"] button', (e, b) => { lang = b.dataset.v; draw(); });
      draw();
    }
  };

  /* =====================================================================
     ПРАКТИКА
     ===================================================================== */

  /* ---------- 1. Состояние, событие, действие или условие ---------- */
  const KIND = [
    { id: 'k1', t: '«Готов»', b: 'st' },
    { id: 'k2', t: 'механик отметил работы сделанными', b: 'ev' },
    { id: 'k3', t: 'отправить клиенту push и SMS', b: 'act' },
    { id: 'k4', t: '[прошло 20 минут без ответа]', b: 'grd' },
    { id: 'k5', t: '«Ждёт согласования»', b: 'st' },
    { id: 'k6', t: 'клиент нажал «Согласен»', b: 'ev' },
    { id: 'k7', t: 'начислить 5 % бонусами', b: 'act' },
    { id: 'k8', t: '[сумма не больше лимита договора 3 000 ₽]', b: 'grd' },
    { id: 'k9', t: 'вебхук ЮKassa «платёж прошёл»', b: 'ev' },
    { id: 'k10', t: '«Неявка»', b: 'st' },
    { id: 'k11', t: '[до начала записи не меньше 3 часов]', b: 'grd' },
    { id: 'k12', t: 'освободить пост в расписании', b: 'act' }
  ];
  const KIND_B = [{ id: 'st', t: 'Состояние', sub: 'длится' }, { id: 'ev', t: 'Событие', sub: 'запускает переход' }, { id: 'grd', t: 'Условие [guard]', sub: 'разрешает переход' }, { id: 'act', t: 'Действие / effect', sub: 'что делает система' }];
  const KIND_WHY = { st: 'Это положение объекта, которое длится, — состояние.', ev: 'Это мгновенный факт, который запускает переход, — событие.', grd: 'Это проверка «да / нет» перед переходом — сторожевое условие.', act: 'Это то, что система делает при переходе, — действие (effect).' };
  function kindEval(v) { v = v || {}; const good = KIND.filter(x => v[x.id] === x.b).length; return { good, score: good / KIND.length }; }
  const taskKind = {
    id: 'kind', title: 'Состояние, событие, условие или действие',
    simple: howBasics.simple,
    lead: ui.brief({
      situation: 'Глеб собирает статусы в код и путается: «Что из этого — статус в поле status, а что — то, что его меняет?» Вера: «Разложи по полочкам, и он перестанет путаться».',
      todo: ['Разложите 12 карточек по четырём корзинам.', 'Нажмите «Проверить». Засчитывается, если верно хотя бы 10 из 12.'],
      lookTitle: 'Подсказка', look: 'Состояние длится, событие мгновенно, условие стоит в квадратных скобках и отвечает «да / нет», действие — глагол, который система выполняет при переходе.'
    }),
    blank: () => ({ v: {} }),
    reference: () => ({ v: Object.fromEntries(KIND.map(x => [x.id, x.b])) }),
    render(el, ctx) {
      el.classList.add('m5s-root');
      const a = ctx.ans; a.v = a.v || {};
      let rv = null;
      if (ctx.result) { rv = {}; KIND.forEach(x => { if (a.v[x.id]) rv[x.id] = a.v[x.id] === x.b ? 'ok' : 'bad'; }); }
      el.innerHTML = '<div data-s></div>';
      ui.sort(TR.$('[data-s]', el), { items: KIND.map(x => ({ id: x.id, t: esc(x.t) })), buckets: KIND_B, value: a.v, readonly: ctx.readonly, reveal: rv, seed: 'm5s-kind', onChange: v => { a.v = v; ctx.save(); } });
    },
    check(ans) {
      const v = (ans && ans.v) || {}, r = kindEval(v), notes = [];
      KIND.forEach(x => { if (!v[x.id]) notes.push({ ok: false, html: `Не разложено: ${esc(x.t)}.` }); else if (v[x.id] !== x.b) notes.push({ ok: false, html: `${esc(x.t)} — ${esc(KIND_B.find(b => b.id === x.b).t.toLowerCase())}. ${esc(KIND_WHY[x.b])}` }); });
      if (r.good === KIND.length) notes.push({ ok: true, html: 'Все двенадцать на своих местах.' });
      return { ok: r.good >= 10, score: r.score, notes, summary: `Верно ${r.good} из ${KIND.length}.`, mentor: r.good >= 10 ? null : 'Задайте каждой карточке вопрос: «это длится?» — состояние; «это случилось?» — событие; «это проверка да / нет?» — условие; «это система делает?» — действие.' };
    },
    explain: `<p>Состояния — «Готов», «Ждёт согласования», «Неявка»: объект в них живёт и ждёт. События — «механик отметил», «клиент нажал», «вебхук пришёл»: мгновенные факты. Условия в квадратных скобках — «[20 минут без ответа]» (BR-8), «[сумма ≤ лимита]» (BR-9), «[до начала ≥ 3 часов]» (BR-3): переход сработает, только если условие истинно. Действия — «отправить push», «начислить бонусы», «освободить пост»: то, что система делает при переходе.</p>
      <p>Именно это разделение превращается в код: состояние — значение поля status, событие — вызов API или сообщение из брокера, условие — проверка перед сменой статуса, действие — побочный эффект (уведомление, запись в историю). Источник: UML 2.5.1, раздел 14.2.3 (Transitions: trigger [guard] / effect).</p>`,
    refNote: 'Засчитывается от 10 верных из 12.',
    report: ans => { const r = kindEval((ans && ans.v) || {}); return `- Разложено верно: ${r.good}/${KIND.length}`; }
  };

  /* ---------- 2. Найдите ошибки в черновике ---------- */
  const BK = k => ru('booking.status', k);
  const DRAFT = {
    states: [{ id: 'new', t: BK('new') }, { id: 'confirmed', t: BK('confirmed') }, { id: 'arrived', t: BK('arrived') }, { id: 'done', t: BK('done') }, { id: 'cancel', t: 'Отменить' }, { id: 'no_show', t: BK('no_show') }],
    tr: [
      { id: 'pay', from: 'new', to: 'confirmed', t: 'предоплата 500 ₽\n(BR-4)' },
      { id: 'came', from: 'confirmed', to: 'arrived', t: 'мастер отметил\nприезд' },
      { id: 'out', from: 'arrived', to: 'done', t: 'машина выдана' },
      { id: 'ns', from: 'confirmed', to: 'no_show', t: 'через 5 минут\nпосле начала' },
      { id: 'cl', from: 'confirmed', to: 'cancel', t: 'клиент отменил' },
      { id: 'again', from: 'done', to: 'new', t: 'клиент записался снова', arc: 'up' }
    ],
    start: [], final: [],
    pos: { new: { x: 40, y: 80 }, confirmed: { x: 330, y: 80 }, arrived: { x: 620, y: 80 }, done: { x: 910, y: 80 }, cancel: { x: 330, y: 230 }, no_show: { x: 620, y: 230 } }
  };
  const BUGS = [
    { key: 'start', t: 'Диаграмма начинается сразу с «Ждёт предоплаты» — без чёрного кружка', err: 'Нет начального состояния: непонятно, с какого статуса рождается запись. Нужно [*] → «Ждёт предоплаты» (или сразу «Подтверждена», если предоплата не нужна).' },
    { key: 'tr:pay', t: '«Ждёт предоплаты» → «Подтверждена»: «предоплата 500 ₽ (BR-4)»' },
    { key: 'tr:came', t: '«Подтверждена» → «Клиент приехал»: «мастер отметил приезд»' },
    { key: 'st:cancel', t: 'Состояние «Отменить»', err: 'Состояние названо глаголом. «Отменить» — действие; состояние — «Отменена».' },
    { key: 'tr:ns', t: '«Подтверждена» → «Неявка»: «через 5 минут после начала»', err: 'Противоречит BR-4: неявка — через 15 минут после начала, тогда же освобождается пост.' },
    { key: 'tr:cl', t: '«Подтверждена» → «Отменить»: «клиент отменил»', err: 'Нет условия из BR-3: бесплатная отмена — только [до начала не меньше 3 часов]. Без него разработчик разрешит отмену за минуту до записи.' },
    { key: 'tr:out', t: '«Клиент приехал» → «Завершена»: «машина выдана»' },
    { key: 'tr:again', t: '«Завершена» → «Ждёт предоплаты»: «клиент записался снова»', err: '«Завершена» — конечное состояние. Повторная запись — это новая запись (новая строка booking), а не стрелка назад: иначе история старой записи перезапишется.' }
  ];
  const BUG_ERR = BUGS.map((b, i) => b.err ? i : -1).filter(i => i >= 0);
  function bugEval(m) { const s = new Set(m || []); const hit = BUG_ERR.filter(i => s.has(i)).length, wrong = [...s].filter(i => !BUG_ERR.includes(i)).length; return { hit, wrong, score: Math.max(0, (hit - wrong) / BUG_ERR.length) }; }
  const taskBugs = {
    id: 'bugs', title: 'Найдите ошибки в черновике статусов записи',
    simple: howTable.simple,
    lead: ui.brief({
      situation: 'Ника нарисовала статусы записи на ТО для экрана «Мои записи». Лиза: «По этому я тесты писать не буду — тут что-то не так». Вера просит найти, что именно.',
      todo: ['Посмотрите на схему и отметьте в списке пункты с ошибками.', 'Ошибок пять: в нотации и в бизнес-правилах (BR-3, BR-4).', 'Нажмите «Проверить». Засчитывается, если найдены все пять и не больше одной лишней отметки.'],
      lookTitle: 'Подсказка', look: 'Проверьте: есть ли начало; не названо ли состояние глаголом; совпадают ли числа с BR-3 и BR-4; есть ли нужные условия; не уходят ли стрелки из конечного состояния.'
    }),
    blank: () => ({ m: [] }),
    reference: () => ({ m: BUG_ERR.slice() }),
    render(el, ctx) {
      el.classList.add('m5s-root');
      const a = ctx.ans; a.m = a.m || [];
      const shown = !!ctx.result || ctx.readonly, nums = {}, marks = {};
      BUGS.forEach((b, i) => { nums[b.key] = i + 1; if (shown) { const on = a.m.includes(i); marks[b.key] = on && b.err ? 'ok' : on && !b.err ? 'bad' : !on && b.err ? 'miss' : undefined; } });
      el.innerHTML = `<div class="m5s-root"><div class="m5s-board">${smSVG(DRAFT, { nums, marks, label: 'Черновик Ники' })}</div>
        <div class="small dim">Номер «1» про начало стоит у первого статуса: чёрного кружка перед ним нет.</div>
        <div class="m5s-items">${BUGS.map((b, i) => { const on = a.m.includes(i); const cls = shown ? (on && b.err ? 'ok' : on && !b.err ? 'bad' : !on && b.err ? 'miss' : '') : ''; return `<button type="button" class="m5s-item ${cls}" data-bg="${i}" aria-pressed="${on}" ${ctx.readonly ? 'disabled' : ''}><span class="n">${i + 1}</span><span>${esc(b.t)}${shown && b.err ? `<div class="small" style="margin-top:4px;color:var(--text-2)">${esc(b.err)}</div>` : ''}</span></button>`; }).join('')}</div>
        <div class="small dim" data-cnt>Отмечено: ${a.m.length}.${shown ? ' Зелёные — ошибка найдена, красные — лишняя отметка, жёлтые — пропущена.' : ''}</div></div>`;
      // пункт 1 — про отсутствующее начало: в черновике нет чёрного кружка, поэтому номер ставим у первого статуса
      const g1 = el.querySelector('[data-st="new"]'), p1 = DRAFT.pos.new;
      if (g1) g1.insertAdjacentHTML('beforeend', `<circle cx="${p1.x - 4}" cy="${p1.y + 2}" r="9" style="fill:var(--accent)"/><text x="${p1.x - 4}" y="${p1.y + 5.5}" text-anchor="middle" style="fill:var(--accent-text);font-size:10px;font-weight:700">1</text>`);
      el.onclick = ctx.readonly ? null : e => {
        const b = e.target.closest('[data-bg]'); if (!b) return;
        const i = +b.dataset.bg; a.m = a.m.includes(i) ? a.m.filter(x => x !== i) : a.m.concat(i).sort((x, y) => x - y); ctx.save();
        b.setAttribute('aria-pressed', String(a.m.includes(i))); b.classList.remove('ok', 'bad', 'miss');
        const c = TR.$('[data-cnt]', el); if (c) c.textContent = `Отмечено: ${a.m.length}.`;
      };
    },
    check(ans) {
      const m = (ans && ans.m) || [], r = bugEval(m), notes = [];
      BUG_ERR.forEach(i => notes.push({ ok: m.includes(i), html: `${i + 1}. ${esc(BUGS[i].err)}${m.includes(i) ? '' : ' — пропущено.'}` }));
      m.filter(i => !BUG_ERR.includes(i)).forEach(i => notes.push({ ok: false, html: `${i + 1}. «${esc(BUGS[i].t)}» — здесь всё верно.` }));
      return { ok: r.hit === BUG_ERR.length && r.wrong <= 1, score: r.score, notes, summary: `Найдено ${r.hit} из ${BUG_ERR.length}, лишних: ${r.wrong}.`, mentor: r.hit === BUG_ERR.length ? (r.wrong > 1 ? 'Ошибки найдены, но отмечены и верные переходы. Перед тем как править, сверьте с правилом.' : null) : 'Пройдитесь по чек-листу: начало, названия состояний, числа из BR-3 и BR-4, условия на стрелках, стрелки из конечных состояний.' };
    },
    explain: `<p>Правильная модель записи: [*] → «Ждёт предоплаты» → «Подтверждена» (предоплата 500 ₽ по BR-4, если у клиента две неявки подряд; иначе запись создаётся сразу подтверждённой) → «Клиент приехал» → «Завершена». Из «Подтверждена» — в «Отменена» по событию «клиент отменил» с условием [до начала ≥ 3 ч] (BR-3) и в «Неявка» через 15 минут после начала (BR-4). «Завершена», «Отменена», «Неявка» — конечные.</p>
      <p>Ошибки в нотации (нет начала, состояние-глагол, стрелка из конечного) и ошибки против правил (5 минут вместо 15, нет условия трёх часов) одинаково опасны: первые путают читателя, вторые попадают в код. Повторная запись — новый объект: так сохраняется история и считаются неявки подряд для BR-4. Источники: UML 2.5.1, раздел 14; BABOK v3, 10.45.</p>`,
    refNote: 'Засчитывается, если найдены все пять ошибок и не больше одной лишней отметки.',
    report: ans => { const r = bugEval((ans && ans.m) || []); return `- Найдено ошибок: ${r.hit}/${BUG_ERR.length}, лишних: ${r.wrong}`; }
  };

  /* ---------- 3. Лаборатория: сценарии Лизы ---------- */
  const SCN = [
    { id: 's1', obj: 'work_order', from: 'in_progress', t: 'Механик Сергей Петрович нашёл стёртые колодки, Марина Олеговна отправила Елене предложение на 2 400 ₽ с фото.', a: 'waiting_approval',
      good: 'Заказ-наряд ждёт решения: клиент видит предложение в приложении, мастер — таймер 20 минут.',
      bad: 'Если оставить «В работе», механик поставит колодки без согласия — это нарушение BR-6 и Закона о защите прав потребителей: клиент вправе не платить.' },
    { id: 's2', obj: 'work_order', from: 'waiting_approval', t: 'Прошло 20 минут, Елена не ответила, мастер позвонил — она не взяла трубку.', a: 'in_progress',
      good: 'По BR-8 основные работы продолжаются, доп. работы ждут — подъёмник не простаивает.',
      bad: 'Если заказ-наряд «застрянет» в «Ждёт согласования», машина стоит на подъёмнике — тот самый простой 1 ч 40 мин, который проект должен убрать.' },
    { id: 's3', obj: 'extra_offer', from: 'sent', t: 'Основные работы закончены, ответа на предложение так и нет.', a: 'expired',
      good: 'Предложение «Истекло» (BR-8), его обсудят при выдаче машины. Заказ-наряд может идти в «Готов».',
      bad: 'Если оставить «Отправлено», предложение будет висеть вечно, а отчёт по доп. работам Тимуру Рашидовичу покажет мусор.' },
    { id: 's4', obj: 'work_order', from: 'in_progress', t: 'Все согласованные работы сделаны, механик нажал «Готово» на планшете.', a: 'ready',
      good: 'Система отправляет push и SMS «машина готова», клиент перестаёт звонить на станцию.',
      bad: 'Без «Готов» клиент не получит уведомления и будет звонить сам — минус одна из целей проекта.' },
    { id: 's5', obj: 'work_order', from: 'ready', t: 'Елена оплатила онлайн и забрала машину.', a: 'closed',
      good: 'Заказ-наряд «Выдан»: начисляются бонусы 5 % (BR-11), данные уходят в 1С.',
      bad: 'Если заказ-наряд не закрыть, бонусы не начислятся, а Ольга Викторовна не увидит оплату в 1С.' },
    { id: 's6', obj: 'booking', from: 'confirmed', t: 'Рустам записал машину «Шашки» на 10:00, сейчас 10:16, машины нет.', a: 'no_show',
      good: 'По BR-4 — «Неявка», пост освобождается для других клиентов, счётчик неявок растёт.',
      bad: 'Если ждать дальше, пост простаивает в пиковый понедельник, а правило про две неявки подряд не сработает.' }
  ];
  const OBJ = { work_order: { t: 'Заказ-наряд', st: ['open', 'in_progress', 'waiting_approval', 'ready', 'closed', 'cancelled'] }, extra_offer: { t: 'Предложение доп. работ', st: ['sent', 'approved', 'rejected', 'expired'] }, booking: { t: 'Запись', st: ['new', 'confirmed', 'arrived', 'done', 'cancelled', 'no_show'] } };
  function scnEval(v) { v = v || {}; const good = SCN.filter(s => v[s.id] === s.a).length; return { good, score: good / SCN.length }; }
  const taskLab = {
    id: 'lab', title: 'Лаборатория: сценарии Лизы',
    simple: howSim.simple,
    lead: ui.brief({
      situation: 'Лиза готовит тесты к пилоту на станции «Победы»: «Скажи, в каком статусе должен оказаться объект после каждого сценария. Ошибёшься — я увижу, что сломается у живых клиентов».',
      todo: ['Для каждого сценария выберите статус, в который перейдёт объект.', 'Нажмите «Проверить» — увидите последствия каждого решения.', 'Засчитывается, если верно хотя бы 5 из 6.'],
      lookTitle: 'Подсказка', look: 'Смотрите на текущий статус и на правила: BR-4 (неявка через 15 минут), BR-6 (доп. работы только с согласия), BR-8 (20 минут без ответа), BR-11 (бонусы после оплаты).'
    }),
    blank: () => ({ v: {} }),
    reference: () => ({ v: Object.fromEntries(SCN.map(s => [s.id, s.a])) }),
    render(el, ctx) {
      el.classList.add('m5s-root');
      const a = ctx.ans; a.v = a.v || {};
      const shown = !!ctx.result || ctx.readonly, ev = scnEval(a.v);
      el.innerHTML = `<div class="m5s-root">${shown ? `<div class="row"><b>Сценариев без сбоев: ${ev.good} из ${SCN.length}</b>${ui.meter(ev.score)}</div>` : ''}
        ${SCN.map(s => { const o = OBJ[s.obj], sel = a.v[s.id], k = s.obj + '.status'; return `<div class="m5s-sc"><div><div class="obj">${esc(o.t)} · сейчас «${esc(ru(k, s.from))}»</div><div>${esc(s.t)}</div></div>
          <select data-sc="${s.id}" aria-label="Новый статус: ${esc(o.t)}" ${ctx.readonly ? 'disabled' : ''}><option value="">Новый статус…</option>${o.st.map(x => `<option value="${x}" ${sel === x ? 'selected' : ''}>${esc(ru(k, x))}</option>`).join('')}</select>
          ${shown ? (sel === s.a ? `<div class="res ok">${esc(s.good)}</div>` : `<div class="res bad">${sel ? `«${esc(ru(k, sel))}» — ` : 'Статус не выбран. '}${esc(s.bad)} Правильно: «${esc(ru(k, s.a))}».</div>`) : ''}</div>`; }).join('')}</div>`;
      el.onchange = ctx.readonly ? null : e => { const s = e.target.closest('[data-sc]'); if (!s) return; if (s.value) a.v[s.dataset.sc] = s.value; else delete a.v[s.dataset.sc]; ctx.save(); const r = s.parentElement.querySelector('.res'); if (r) r.remove(); };
    },
    check(ans) {
      const v = (ans && ans.v) || {}, r = scnEval(v), notes = [];
      SCN.forEach((s, i) => { const k = s.obj + '.status'; notes.push(v[s.id] === s.a ? { ok: true, html: `Сценарий ${i + 1}: «${esc(ru(k, s.a))}» — верно.` } : { ok: false, html: `Сценарий ${i + 1}: нужно «${esc(ru(k, s.a))}». ${esc(s.bad)}` }); });
      return { ok: r.good >= 5, score: r.score, notes, summary: `Верно ${r.good} из ${SCN.length}.`, mentor: r.good >= 5 ? null : 'Для каждого сценария найдите на диаграмме текущий статус и стрелку с подходящим событием и условием. Если стрелки нет — переход запрещён.' };
    },
    explain: `<p>Каждый сценарий — это одна стрелка модели: «В работе» → «Ждёт согласования» по предложению доп. работ; «Ждёт согласования» → «В работе» по BR-8, когда 20 минут нет ответа; предложение «Отправлено» → «Истекло», если к концу основных работ ответа нет; «В работе» → «Готов» с уведомлением; «Готов» → «Выдан» после оплаты; запись «Подтверждена» → «Неявка» через 15 минут (BR-4).</p>
      <p>Обратите внимание на последствия ошибок: они бьют ровно по целям проекта — простой на подъёмнике, звонки клиентов, неявки. Поэтому статусную модель согласуют с бизнесом и отдают тестировщикам до разработки. Источник: ISTQB Foundation, техника «тестирование переходов состояний»; UML 2.5.1, раздел 14.</p>`,
    refNote: 'Засчитывается от 5 верных из 6.',
    report: ans => { const v = (ans && ans.v) || {}; return SCN.map((s, i) => `- Сценарий ${i + 1}: ${v[s.id] ? ru(s.obj + '.status', v[s.id]) : '—'}${v[s.id] === s.a ? ' ✓' : ''}`).join('\n'); }
  };

  /* ---------- 4. Нарисуйте статусы платежа кодом ---------- */
  function parseSM(src) {
    const states = [], tr = [], start = [], final = [], msgs = [], W = '[A-Za-z0-9_А-Яа-яЁё]+';
    let hasStart = false, hasEnd = false, mermaid = false;
    const st = (id, t) => { let x = states.find(s => s.id === id); if (!x) { x = { id, t: t || id }; states.push(x); } else if (t) x.t = t; return x; };
    String(src || '').split('\n').forEach((raw, i) => {
      const s = raw.trim(), n = i + 1;
      if (!s || s.startsWith("'") || s.startsWith('%%')) return;
      if (/^@startuml$/i.test(s)) { hasStart = true; return; }
      if (/^@enduml$/i.test(s)) { hasEnd = true; return; }
      if (/^stateDiagram(-v2)?$/i.test(s)) { mermaid = true; return; }
      if (/^@end/i.test(s)) { msgs.push({ n, kind: 'bad', t: 'Закрывающая строка — ровно @enduml.' }); return; }
      let m;
      if ((m = s.match(new RegExp(`^state\\s+"([^"]+)"\\s+as\\s+(${W})$`, 'i')))) { st(m[2], m[1]); return; }
      if ((m = s.match(new RegExp(`^state\\s+(${W})$`, 'i')))) { st(m[1]); return; }
      if ((m = s.match(new RegExp(`^(\\[\\*\\]|${W})\\s*(-->|->)\\s*(\\[\\*\\]|${W})\\s*(?::\\s*(.*))?$`)))) {
        const a = m[1], b = m[3], label = (m[4] || '').trim();
        if (a === '[*]' && b === '[*]') { msgs.push({ n, kind: 'bad', t: 'Стрелка из начала прямо в конец ничего не описывает.' }); return; }
        if (a === '[*]') { st(b); if (!start.includes(b)) start.push(b); return; }
        if (b === '[*]') { st(a); if (!final.includes(a)) final.push(a); return; }
        st(a); st(b); tr.push({ id: 't' + tr.length, from: a, to: b, t: label, bare: !label });
        if (!label) msgs.push({ n, kind: 'warn', t: 'Переход без подписи: после двоеточия напишите событие.' });
        return;
      }
      if (/^state\s+[^"]+\s+as\s+/i.test(s)) { msgs.push({ n, kind: 'bad', t: 'Русское имя с пробелами — в кавычках: state "Ожидает оплаты" as pending.' }); return; }
      if (new RegExp(`^${W}\\s*(=>|→)`).test(s)) { msgs.push({ n, kind: 'bad', t: 'Переход пишется стрелкой -->.' }); return; }
      msgs.push({ n, kind: 'bad', t: 'Строку не удалось разобрать. Переход выглядит так: pending --> paid : вебхук «оплачено»' });
    });
    if (hasStart && !hasEnd && !mermaid) msgs.push({ n: 0, kind: 'bad', t: 'Нет последней строки @enduml.' });
    return { states, tr, start, final, msgs };
  }
  function layout(res) {
    const depth = {}, q = [];
    res.start.forEach(s => { depth[s] = 0; q.push(s); });
    while (q.length) { const x = q.shift(); res.tr.filter(t => t.from === x).forEach(t => { if (depth[t.to] == null) { depth[t.to] = depth[x] + 1; q.push(t.to); } }); }
    const maxD = Math.max(0, ...Object.values(depth));
    res.states.forEach(s => { if (depth[s.id] == null) depth[s.id] = maxD + 1; });
    const rows = {}, pos = {};
    res.states.forEach(s => { const d = depth[s.id]; rows[d] = (rows[d] || 0) + 1; pos[s.id] = { x: 40 + d * 290, y: 30 + (rows[d] - 1) * 110 }; });
    return pos;
  }
  const findSt = (res, re) => res.states.find(s => re.test(TR.norm(s.t + ' ' + s.id)));
  const hasTr = (res, a, b) => !!(a && b && res.tr.some(t => t.from === a.id && t.to === b.id));
  const PAY = { pending: /ожида|pending/, paid: /оплач|paid/, failed: /ошибк|отказ|не прош|failed/, refunded: /возвра|refund/ };
  const CFEATS = [
    { t: 'Есть начальное состояние: [*] --> …', f: r => r.start.length > 0 },
    { t: 'Четыре состояния: ожидает, оплачен, ошибка (отказ), возвращён', f: r => Object.values(PAY).every(re => findSt(r, re)) },
    { t: 'Переход «ожидает → оплачен»', f: r => hasTr(r, findSt(r, PAY.pending), findSt(r, PAY.paid)) },
    { t: 'Переход «ожидает → ошибка»', f: r => hasTr(r, findSt(r, PAY.pending), findSt(r, PAY.failed)) },
    { t: 'Переход «оплачен → возвращён»', f: r => hasTr(r, findSt(r, PAY.paid), findSt(r, PAY.refunded)) },
    { t: 'Нет перехода из «ошибки» в «оплачен»: повторная попытка — новый платёж', f: r => !hasTr(r, findSt(r, PAY.failed), findSt(r, PAY.paid)) && r.tr.length > 0 },
    { t: 'Все переходы подписаны событиями', f: r => r.tr.length > 0 && !r.tr.some(t => t.bare) },
    { t: 'Код без ошибок разбора', f: r => (r.states.length > 0) && !r.msgs.some(m => m.kind === 'bad') }
  ];
  function codeEval(text) { const r = parseSM(text); const on = CFEATS.map(f => !!f.f(r)); const n = on.filter(Boolean).length; return { r, on, n, score: n / CFEATS.length }; }
  const CODE_START = `@startuml
state "Ожидает" as pending
state "Оплачен" as paid
[*] --> pending : платёж создан в ЮKassa
' добавьте остальные состояния и переходы

@enduml`;
  const CODE_REF = `@startuml
state "Ожидает" as pending
state "Оплачен" as paid
state "Ошибка" as failed
state "Возвращён" as refunded
[*] --> pending : платёж создан в ЮKassa
pending --> paid : вебхук «платёж прошёл»
pending --> failed : отказ банка
paid --> refunded : возврат по заявлению клиента
paid --> [*]
failed --> [*]
refunded --> [*]
@enduml`;
  const taskCode = {
    id: 'code', title: 'Нарисуйте статусы платежа кодом',
    simple: howTable.simple,
    lead: ui.brief({
      situation: 'Глеб: «Платёжный сервис пишу на этой неделе. Положи в репозиторий статусы платежа кодом — PlantUML или Mermaid. Платёж создаётся в ЮKassa, дальше либо вебхук „прошёл“, либо отказ банка; оплаченный можно вернуть».',
      todo: ['Допишите диаграмму состояний платежа. Схема рисуется рядом, пока вы пишете.', 'Следите за признаками под редактором.', 'Нажмите «Проверить». Засчитывается, если выполнено 7 признаков из 8, включая «код без ошибок разбора».'],
      lookTitle: 'Подсказка', look: 'Статусы платежа в базе: «Ожидает», «Оплачен», «Ошибка», «Возвращён». После ошибки клиент платит снова — это новый платёж, поэтому стрелки «Ошибка → Оплачен» нет.'
    }),
    blank: () => ({ text: '' }),
    reference: () => ({ text: CODE_REF }),
    render(el, ctx) {
      el.classList.add('m5s-root');
      const a = ctx.ans; if (!a.text && !ctx.readonly) a.text = CODE_START;
      el.innerHTML = `<div class="m5s-root"><div class="m5s-two m5s-ed"><div class="stack"><textarea spellcheck="false" aria-label="Код диаграммы состояний" ${ctx.readonly ? 'readonly' : ''}></textarea><div class="stack" data-pm aria-live="polite"></div></div><div class="m5s-board" data-out></div></div>
        <div class="eyebrow">Признаки</div><div class="m5s-feats" data-ft aria-live="polite"></div>
        <details class="small"><summary>Шпаргалка: PlantUML и Mermaid</summary>${ui.code('PlantUML:\n  state "Ожидает" as pending\n  [*] --> pending : платёж создан\n  pending --> paid : вебхук\n  paid --> [*]\nMermaid:\n  stateDiagram-v2\n  state "Ожидает" as pending\n  [*] --> pending\n  pending --> paid: вебхук', 'text')}</details></div>`;
      const ta = TR.$('textarea', el); ta.value = a.text || '';
      const upd = () => {
        const ev = codeEval(ta.value);
        TR.$('[data-ft]', el).innerHTML = CFEATS.map((f, i) => `<div class="m5s-feat ${ev.on[i] ? 'on' : ''}"><span class="mk">${ev.on[i] ? '✓' : '○'}</span><span>${esc(f.t)}</span></div>`).join('');
        TR.$('[data-pm]', el).innerHTML = ev.r.msgs.slice(0, 5).map(m => `<div class="m5s-pm ${m.kind === 'bad' ? '' : 'warn'}">${m.n ? `Строка ${m.n}: ` : ''}${esc(m.t)}</div>`).join('');
        const out = TR.$('[data-out]', el);
        if (!ev.r.states.length) out.innerHTML = '<p class="small dim" style="padding:10px">Здесь появится схема.</p>';
        else out.innerHTML = smSVG({ states: ev.r.states.map(s => ({ id: s.id, t: s.t })), tr: ev.r.tr.map(t => ({ id: t.id, from: t.from, to: t.to, t: t.t || '(без подписи)' })), start: ev.r.start, final: ev.r.final, pos: layout(ev.r) }, { label: 'Ваша диаграмма' });
      };
      if (!ctx.readonly) ta.addEventListener('input', () => { a.text = ta.value; ctx.save(); upd(); });
      upd();
    },
    check(ans) {
      const ev = codeEval((ans && ans.text) || ''), notes = [];
      CFEATS.forEach((f, i) => notes.push({ ok: ev.on[i], html: esc(f.t) + (ev.on[i] ? '' : ' — не выполнено.') }));
      ev.r.msgs.filter(m => m.kind === 'bad').slice(0, 3).forEach(m => notes.push({ ok: false, html: `${m.n ? `Строка ${m.n}: ` : ''}${esc(m.t)}` }));
      const clean = ev.on[CFEATS.length - 1];
      return { ok: ev.n >= 7 && clean, score: ev.score, notes, summary: `Признаков: ${ev.n} из ${CFEATS.length}.`, mentor: ev.n >= 7 && clean ? null : !clean ? 'Сначала добейтесь, чтобы код разбирался без ошибок: кавычки у русских имён, стрелки -->, @enduml в конце.' : 'Проверьте все пути платежа: создан → прошёл или отказ; оплаченный → возврат.' };
    },
    explain: `<p>В эталоне четыре состояния, как в таблице <code>payment</code>: «Ожидает» → «Оплачен» по вебхуку ЮKassa, «Ожидает» → «Ошибка» при отказе банка, «Оплачен» → «Возвращён» при возврате. «Ошибка» — конечное: при повторной попытке создаётся новый платёж (в истории заказ-наряда видно обе попытки, и Ольге Викторовне есть что сверить с ЮKassa). Писать можно и в Mermaid: <code>stateDiagram-v2</code>, те же <code>state "Имя" as id</code> и <code>[*]</code>.</p>
      <p>В реальной постановке добавляют таймаут: платёж «Ожидает» дольше 15 минут — запрос статуса в ЮKassa и перевод в «Ошибку» или «Оплачен». Источники: plantuml.com/ru/state-diagram, mermaid.js.org/syntax/stateDiagram.html, документация ЮKassa о статусах платежа.</p>`,
    refNote: 'Засчитывается любой код PlantUML или Mermaid, если выполнено 7 признаков из 8 и код разбирается без ошибок.',
    report: ans => { const ev = codeEval((ans && ans.text) || ''); return `- Признаков: ${ev.n}/${CFEATS.length}\n\n\`\`\`\n${(ans && ans.text) || ''}\n\`\`\``; }
  };

  /* ---------- 5. Ответ Глебу ---------- */
  const J_RUBRIC = [
    'Объясняет, что поле status хранит только текущее значение, а диаграмма задаёт, какие переходы разрешены и что их запускает',
    'Приводит пример, что сломается без модели: например, возврат из «Готов» в «В работе», отмена за минуту до записи вопреки BR-3 или доп. работы без согласия (BR-6)',
    'Говорит, что модель — единая для бэкенда, мобильного приложения, АРМ и тестов: все понимают переходы одинаково',
    'Упоминает, что из модели получаются проверки на сервере и тест-кейсы Лизы (заполненные и пустые клетки таблицы переходов)',
    'Отвечает коротко и по делу, на «ты» или «вы» — как коллеге, без лишней теории'
  ];
  const J_REF = 'Глеб, поле status хранит только где заказ-наряд сейчас. А диаграмма отвечает, куда ему можно отсюда и что его туда переводит. Без неё каждый реализует переходы по-своему: Даша в приложении разрешит отмену за минуту до записи, хотя по BR-3 бесплатно — только за три часа; АРМ позволит вернуть заказ-наряд из «Готов» в «В работе», и клиенту уже ушло SMS «машина готова»; механик сможет начать доп. работы без согласия клиента — а это нарушение BR-6. Диаграмма — одна правда для бэкенда, приложения, АРМ и тестов. Из неё ты делаешь проверку на сервере: переход не по стрелке — ошибка 409. А Лиза из той же таблицы переходов берёт тест-кейсы: каждая заполненная клетка — позитивный тест, каждая пустая — негативный. Это полчаса на схему вместо недели багов на пилоте.';
  const taskExplain = {
    id: 'explain', title: 'Объясните Глебу, зачем рисовать статусы',
    lead: ui.brief({
      situation: 'Глеб на планёрке: «Зачем рисовать статусы? В базе это просто поле status, varchar(12). Я и так знаю, какие значения бывают».',
      todo: ['Ответьте Глебу своими словами, от 200 символов: чем модель отличается от поля, что сломается без неё, кому она нужна.', 'Проверьте ответ по рубрике (или попросите Веру).', 'Нажмите «Проверить». Засчитывается от 60 % по рубрике.'],
      lookTitle: 'Подсказка', look: 'Поле — «где сейчас», модель — «куда можно и почему». Приведите пример из «Искры», который Глеб узнает: отмена по BR-3, доп. работы по BR-6, возврат из «Готов».'
    }),
    blank: () => ({ j: {} }),
    reference: () => ({ j: { text: J_REF, self: J_RUBRIC.map(() => true) } }),
    render(el, ctx) {
      el.classList.add('m5s-root');
      const a = ctx.ans; a.j = a.j || {};
      el.innerHTML = `<div class="m5s-root">${ui.say('gleb', 'Зачем рисовать статусы? В базе это просто поле status, varchar(12). Я и так знаю, какие значения бывают.')}<div data-j></div></div>`;
      ui.justify(TR.$('[data-j]', el), {
        id: 'm5s-gleb', q: 'Что ответить Глебу?',
        qPlain: 'Объясните тимлиду бэкенда, зачем нужна диаграмма состояний, если статус в базе — просто поле: чем модель отличается от поля, что сломается без неё и как её используют разработчики и тестировщики.',
        rubric: J_RUBRIC, reference: J_REF, value: a.j, readonly: ctx.readonly, minLen: 200,
        placeholder: 'Глеб, …',
        onChange: v => { a.j = v; ctx.save(); ctx.decide('Ответ Глебу: зачем статусная модель', v.text || ''); }
      });
    },
    check(ans) {
      const j = ui.justifyScore(ans && ans.j), notes = [];
      if (!j) notes.push({ ok: false, html: 'Ответ не написан или не оценён: от 200 символов, затем проверка по рубрике или с Верой.' });
      else notes.push({ ok: j >= 0.6 ? true : 'warn', html: `Ответ: ${pct(j)} по рубрике.${j < 0.6 ? ' Приведите конкретный пример из «Искры», что сломается без модели.' : ''}` });
      return { ok: j >= 0.6, score: j, notes, summary: `Ответ: ${pct(j)} по рубрике.`, mentor: j >= 0.6 ? null : 'Разработчика убеждают примеры багов, а не определения. Покажите Глебу, какой переход без модели реализуют неправильно.' };
    },
    explain: `<p>Поле <code>status</code> отвечает на вопрос «где объект сейчас», а диаграмма состояний — «куда ему можно и что его туда переводит». Без модели переходы реализуют по-разному в бэкенде, приложении и АРМ, и правила вроде BR-3 (отмена за 3 часа), BR-6 (доп. работы только с согласия) и BR-8 (20 минут) теряются.</p>
      <p>Из модели получаются проверки на сервере (переход не по стрелке — ошибка 409 Conflict) и тест-кейсы: каждая заполненная клетка таблицы переходов — позитивный тест, каждая пустая — негативный. Источники: UML 2.5.1, раздел 14; BABOK v3, 10.45 «State Modelling»; ISTQB Foundation, «тестирование переходов состояний».</p>`,
    refNote: 'Оценивается по рубрике: самопроверка или проверка Claude.',
    report: ans => `- Ответ Глебу (${pct(ui.justifyScore(ans && ans.j))}): ${(ans && ans.j && ans.j.text) || '—'}`
  };

  TR.stage({
    id: ID,
    when: 'понедельник, 15 февраля, 10:00 · статусы перед пилотом на станции «Победы»',
    intro: [
      { who: 'liza', html: 'Готовлю тесты к пилоту и нашла странное: в АРМ мастера заказ-наряд можно перевести из «Готов» обратно в «В работе». Клиенту к этому моменту уже ушло SMS «машина готова». В требованиях об этом ни слова — так можно или нет?' },
      { who: 'gleb', html: 'У нас статус — просто поле status. Каждый понимает переходы по-своему: я на бэкенде, Даша в приложении, Ника на макетах. Договориться бы один раз.' },
      { who: 'vera', html: 'Начинаем новый модуль — по диаграмме на занятие. Первая — диаграмма состояний: какие статусы бывают у объекта, какие переходы разрешены и что их запускает. Нарисуем модель заказ-наряда, прогоним сценарии Лизы и положим статусы платежа кодом в репозиторий.' }
    ],
    glossary: [
      { term: 'Диаграмма состояний', simple: 'Какие статусы бывают у объекта и как он переходит из одного в другой.', tech: 'UML State Machine Diagram (UML 2.5.1, раздел 14); в постановках — «статусная модель».' },
      { term: 'Состояние', simple: 'Положение объекта, которое длится: «В работе», «Готов».', tech: 'State — ситуация, в которой объект ждёт события.' },
      { term: 'Переход', simple: 'Разрешённая смена статуса — стрелка.', tech: 'Transition: trigger [guard] / effect.' },
      { term: 'Событие', simple: 'Что случилось и запустило переход.', tech: 'Trigger: вызов, сигнал, истечение времени.' },
      { term: 'Сторожевое условие (guard)', simple: 'Проверка «да / нет» в квадратных скобках перед переходом.', tech: 'Guard — логическое выражение; переход срабатывает, только если оно истинно.' },
      { term: 'Конечное состояние', simple: 'Жизнь объекта закончилась: «Выдан», «Отменён».', tech: 'Final state — кружок в кольце; исходящих переходов нет.' },
      { term: 'Таблица переходов', simple: 'Та же модель таблицей: строки — статусы, столбцы — события.', tech: 'State transition table; основа тестирования переходов состояний (ISTQB).' }
    ],
    outro: 'Модель статусов согласована: Лиза пишет тесты по таблице переходов, Глеб делает проверку на сервере, а вопрос «Готов → В работе» ушёл Марине Олеговне — решили открывать новый заказ-наряд. Следующее занятие — UML Activity: как показать алгоритм с параллельными ветками.',
    tasks: [howBasics, howSim, howTable, taskKind, taskLab, taskBugs, taskCode, taskExplain]
  });
})();
