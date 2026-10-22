/* Модуль 3, занятие 3: BPMN — базовый уровень.
   Теория: зачем BPMN и азбука элементов (интервью Марины Олеговны → диаграмма, кликабельная легенда, клиент — дорожка
   или отдельный пул); потоки и правила (поток управления, поток сообщений, ассоциация и данные — «можно ли так?»;
   именование задач, событий и шлюзов; один уровень детализации на диаграмме); шлюзы и токен (XOR и AND на живом
   примере, шесть ситуаций, правила движения токена).
   Практика: узнать элементы на диаграмме AS-IS «Запись по телефону» (кликабельный квиз); собрать AS-IS по дорожкам
   и порядку с живым предпросмотром; найти 8 ошибок в черновике Марины Олеговны; лаборатория «прогоните токен»
   (разветвление и слияние — последствия: дубли, зависание, мастер не в курсе); ответ Марине Олеговне своими словами. */
'use strict';
(function () {
  const TR = window.TR, ui = TR.ui, esc = TR.esc;
  const ID = 'm3-bpmn1';

  if (!document.getElementById('m3b1-css')) document.head.insertAdjacentHTML('beforeend', `<style id="m3b1-css">
    .m3b1-root, .m3b1-root .stack > * { min-width: 0; }
    .m3b1-root .chip { white-space: normal; text-align: left; max-width: 100%; }
    .m3b1-root .seg button { white-space: normal; }
    .m3b1-lbl { font: 600 10.5px/1.3 var(--f-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--text-muted); }
    .m3b1-panel { border: 1px solid var(--border-strong); border-radius: 12px; padding: 12px 14px; background: var(--surface); display: grid; gap: 10px; font-size: 14px; min-width: 0; }
    .m3b1-panel h4 { font: 700 16px/1.3 var(--f-brand); margin: 0; }
    .m3b1-ex { border-left: 3px solid var(--accent); background: var(--surface-2); border-radius: 0 8px 8px 0; padding: 8px 12px; font-size: 14px; }
    .m3b1-quote { border-left: 3px solid var(--warn); background: var(--surface-2); border-radius: 0 8px 8px 0; padding: 10px 14px; font-size: 14.5px; line-height: 1.55; font-style: italic; }
    .m3b1-two { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 14px; align-items: start; }
    .m3b1-two > * { min-width: 0; }
    .m3b1-glyphs { display: grid; grid-template-columns: repeat(auto-fill, minmax(116px, 1fr)); gap: 8px; }
    .m3b1-g { border: 1px solid var(--border); background: var(--surface); border-radius: 10px; padding: 4px; color: var(--text); display: grid; gap: 2px; justify-items: center; font-size: 12px; line-height: 1.25; text-align: center; min-width: 0; }
    .m3b1-g[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); }
    .m3b1-g .board { border: 0; background: transparent; overflow: hidden; width: 100%; }
    .m3b1-g svg { min-width: 0 !important; width: 100%; height: auto; }
    .m3b1-cases { display: grid; gap: 6px; }
    .m3b1-case { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 6px 10px; align-items: center; border: 1px solid var(--border); border-radius: 10px; padding: 8px 10px; background: var(--surface); font-size: 14px; }
    .m3b1-case.ok { border-color: var(--ok); background: var(--ok-soft); }
    .m3b1-case.bad { border-color: var(--bad); background: var(--bad-soft); }
    .m3b1-case .why { grid-column: 1 / -1; font-size: 13px; color: var(--text-2); }
    .m3b1-names { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 8px; }
    .m3b1-nm { border: 1px solid var(--border); background: var(--surface); color: var(--text); border-radius: 10px; padding: 8px 10px; text-align: left; display: grid; gap: 4px; font-size: 13.5px; line-height: 1.35; min-width: 0; }
    .m3b1-nm s { color: var(--bad); }
    .m3b1-nm b.good { color: var(--ok); }
    .m3b1-nm[aria-pressed="true"] { border-color: var(--ok); }
    .m3b1-nm small { color: var(--text-muted); font-size: 12px; }
    .m3b1-rows { display: grid; gap: 6px; }
    .m3b1-row { display: grid; grid-template-columns: 26px minmax(0, 1fr) auto; gap: 6px 10px; align-items: center; border: 1px solid var(--border); border-radius: 10px; padding: 7px 10px; background: var(--surface); font-size: 14px; }
    .m3b1-row.ok { border-color: var(--ok); } .m3b1-row.bad { border-color: var(--bad); background: var(--bad-soft); }
    .m3b1-row .n { font: 700 12px/1 var(--f-mono); color: var(--text-muted); }
    .m3b1-row .mv { display: flex; gap: 4px; }
    .m3b1-row .mv button { width: 30px; height: 28px; border-radius: 8px; border: 1px solid var(--border); background: var(--surface-2); color: var(--text); }
    .m3b1-row .mv button:disabled { opacity: .35; }
    .m3b1-row .lanes { grid-column: 2 / -1; display: flex; flex-wrap: wrap; gap: 4px; }
    .m3b1-row .why { grid-column: 2 / -1; font-size: 13px; color: var(--text-2); }
    .m3b1-signs { display: flex; flex-wrap: wrap; gap: 6px; }
    .m3b1-sign { font-size: 12.5px; border-radius: 99px; padding: 3px 10px; border: 1px solid var(--border); color: var(--text-2); background: var(--surface); }
    .m3b1-sign.on { border-color: var(--ok); color: var(--ok); background: var(--ok-soft); }
    .m3b1-log { display: grid; gap: 4px; max-height: 260px; overflow: auto; font-size: 13.5px; }
    .m3b1-log div { border-left: 3px solid var(--border-strong); padding: 3px 8px; background: var(--surface-2); border-radius: 0 6px 6px 0; }
    .m3b1-log div.ok { border-color: var(--ok); } .m3b1-log div.bad { border-color: var(--bad); } .m3b1-log div.warn { border-color: var(--warn); } .m3b1-log div.accent { border-color: var(--accent); }
    .m3b1-ctl { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
    .m3b1-set { display: grid; grid-template-columns: 200px minmax(0, 1fr); gap: 8px 12px; align-items: center; font-size: 14px; }
    .m3b1-cons { border-radius: 12px; padding: 12px 14px; border: 1px solid var(--border-strong); background: var(--surface-2); font-size: 14px; display: grid; gap: 6px; }
    .m3b1-cons.ok { border-color: var(--ok); } .m3b1-cons.bad { border-color: var(--bad); } .m3b1-cons.warn { border-color: var(--warn); }
    .m3b1-picks { display: flex; flex-wrap: wrap; gap: 6px; }
    @media (max-width: 760px) {
      .m3b1-two { grid-template-columns: minmax(0, 1fr); }
      .m3b1-set { grid-template-columns: minmax(0, 1fr); }
    }
  </style>`);

  // ---------- помощники ----------
  const interview = items => `<details class="more"><summary>Как об этом спрашивают на собеседовании</summary><div><ul class="checks">${items.map(x => `<li class="info"><b>${x[0]}</b> ${x[1]}</li>`).join('')}</ul></div></details>`;
  const mistakes = items => ui.note('warn', 'Типичные ошибки', `<ul class="checks">${items.map(x => `<li class="bad">${x}</li>`).join('')}</ul>`);
  // ui.bpmn масштабирует SVG по ширине контейнера — на узком экране подписи становятся мелкими.
  // Здесь задаём минимальную ширину, чтобы широкая диаграмма прокручивалась внутри .board, а не сжималась.
  function diagram(host, cfg, scale) {
    const box = document.createElement('div'); host.appendChild(box);
    const h = ui.bpmn(box, cfg);
    const fix = () => { const s = box.querySelector('svg'); if (!s) return; const w = +((s.getAttribute('viewBox') || '').split(' ')[2]) || 0; if (w > 640) s.style.minWidth = Math.round(w * (scale || 0.8)) + 'px'; };
    fix();
    return { redraw(n) { h.redraw(n); fix(); }, box };
  }
  const LANES3 = [{ id: 'c', t: 'Клиент' }, { id: 'o', t: 'Оператор колл-центра' }, { id: 'm', t: 'Мастер-приёмщик' }];

  // ---------- AS-IS в одном пуле: клиент — дорожка (основа лаборатории токена) ----------
  function asis1(g1, g2) {
    return {
      title: 'AS-IS: запись по телефону, один пул', pool: 'Запись по телефону — как есть', lanes: LANES3, colW: 140, rowH: 86,
      nodes: [
        { id: 's', type: 'start', t: 'Нужно на ТО', lane: 'c', col: 0 },
        { id: 'call', type: 'task', t: 'Позвонить в колл-центр', lane: 'c', col: 1 },
        { id: 'find', type: 'task', t: 'Найти время в Excel-графике', lane: 'o', col: 2 },
        { id: 'xls', type: 'store', t: 'Excel-график станций', lane: 'o', col: 2, row: 1 },
        { id: 'gw', type: 'xor', t: 'Время подошло?', lane: 'o', col: 3 },
        { id: 'put', type: 'task', t: 'Внести запись в график', lane: 'o', col: 4 },
        { id: 'no', type: 'task', t: 'Предложить перезвонить позже', lane: 'o', col: 3, row: 1 },
        { id: 'lost', type: 'end', t: 'Обращение потеряно', lane: 'o', col: 4, row: 1 },
        { id: 'g1', type: g1 || 'and', lane: 'o', col: 5 },
        { id: 'tell', type: 'task', t: 'Сообщить время и адрес', lane: 'o', col: 6 },
        { id: 'chk', type: 'task', t: 'Проверить загрузку постов', lane: 'm', col: 6 },
        { id: 'g2', type: g2 || 'and', lane: 'o', col: 7 },
        { id: 'log', type: 'task', t: 'Закрыть обращение в журнале', lane: 'o', col: 8 },
        { id: 'e', type: 'end', t: 'Клиент записан', lane: 'o', col: 9 }
      ],
      flows: [
        { from: 's', to: 'call' }, { from: 'call', to: 'find' }, { from: 'find', to: 'xls', kind: 'assoc' }, { from: 'find', to: 'gw' },
        { from: 'gw', to: 'put', t: 'да' }, { from: 'gw', to: 'no', t: 'нет' }, { from: 'no', to: 'lost' },
        { from: 'put', to: 'g1' }, { from: 'g1', to: 'tell' }, { from: 'g1', to: 'chk' }, { from: 'tell', to: 'g2' }, { from: 'chk', to: 'g2' },
        { from: 'g2', to: 'log' }, { from: 'log', to: 'e' }
      ]
    };
  }
  // ---------- AS-IS в двух пулах: клиент — отдельный участник ----------
  function asis2() {
    return {
      title: 'AS-IS: запись по телефону, два пула', colW: 140, rowH: 86,
      pools: [{ id: 'pc', t: 'Клиент', lanes: [{ id: 'c2', t: '' }] }, { id: 'pi', t: 'Сеть «Искра»', lanes: [{ id: 'o2', t: 'Оператор колл-центра' }, { id: 'm2', t: 'Мастер-приёмщик' }] }],
      nodes: [
        { id: 'c_s', type: 'start', t: 'Нужно на ТО', lane: 'c2', col: 0 },
        { id: 'c_call', type: 'task', t: 'Позвонить в колл-центр', lane: 'c2', col: 1 },
        { id: 'c_ans', type: 'int-msg', t: 'Время визита получено', lane: 'c2', col: 6 },
        { id: 'c_e', type: 'end', t: 'Визит запланирован', lane: 'c2', col: 7 },
        { id: 'o_s', type: 'start-msg', t: 'Звонок поступил', lane: 'o2', col: 1 },
        { id: 'o_find', type: 'task', t: 'Найти время в Excel-графике', lane: 'o2', col: 2 },
        { id: 'o_store', type: 'store', t: 'Excel-график станций', lane: 'o2', col: 2, row: 1 },
        { id: 'o_gw', type: 'xor', t: 'Время подошло?', lane: 'o2', col: 3 },
        { id: 'o_put', type: 'task', t: 'Внести запись в график', lane: 'o2', col: 4 },
        { id: 'o_no', type: 'task', t: 'Предложить перезвонить позже', lane: 'o2', col: 3, row: 1 },
        { id: 'o_lost', type: 'end', t: 'Обращение потеряно', lane: 'o2', col: 4, row: 1 },
        { id: 'o_and', type: 'and', lane: 'o2', col: 5 },
        { id: 'o_tell', type: 'send', t: 'Сообщить время и адрес', lane: 'o2', col: 6 },
        { id: 'm_check', type: 'user', t: 'Проверить загрузку постов', lane: 'm2', col: 6 },
        { id: 'o_join', type: 'and', lane: 'o2', col: 7 },
        { id: 'o_end', type: 'end', t: 'Клиент записан', lane: 'o2', col: 8 }
      ],
      flows: [
        { from: 'c_s', to: 'c_call' }, { from: 'c_call', to: 'c_ans' }, { from: 'c_ans', to: 'c_e' },
        { from: 'c_call', to: 'o_s', kind: 'msg', t: 'звонок' }, { from: 'o_tell', to: 'c_ans', kind: 'msg', t: 'время и адрес' },
        { from: 'o_s', to: 'o_find' }, { from: 'o_find', to: 'o_store', kind: 'assoc' }, { from: 'o_find', to: 'o_gw' },
        { from: 'o_gw', to: 'o_put', t: 'да' }, { from: 'o_gw', to: 'o_no', t: 'нет' }, { from: 'o_no', to: 'o_lost' },
        { from: 'o_put', to: 'o_and' }, { from: 'o_and', to: 'o_tell' }, { from: 'o_and', to: 'm_check' },
        { from: 'o_tell', to: 'o_join' }, { from: 'm_check', to: 'o_join' }, { from: 'o_join', to: 'o_end' }
      ]
    };
  }

  // ---------- движок токенов: старт → задачи → XOR (один путь) / AND (все пути, слияние ждёт всех) → конец ----------
  function makeSim(model, pick) {
    const N = Object.fromEntries(model.nodes.map(n => [n.id, n]));
    const seq = model.flows.filter(f => !f.kind || f.kind === 'seq');
    const outs = id => seq.filter(f => f.from === id), ins = id => seq.filter(f => f.to === id);
    const name = id => N[id].t ? '«' + N[id].t + '»' : N[id].type === 'and' ? 'шлюз «И»' : 'шлюз «ИСКЛЮЧАЮЩЕЕ ИЛИ»';
    const st = { tokens: model.nodes.filter(n => /^start/.test(n.type)).map(n => ({ at: n.id, from: null, wait: false })), fired: {}, ends: {}, log: [], visited: new Set(), step: 0, flash: [], done: false, stuck: false, max: 1 };
    st.tokens.forEach(t => st.visited.add(t.at));
    st.log.push({ k: 'accent', t: 'Начальное событие создало токен.' });
    function step() {
      if (st.done || st.stuck) return;
      const next = [], fl = [];
      st.tokens.forEach(t => {
        if (t.wait) { next.push(t); return; }
        const n = N[t.at]; st.fired[n.id] = (st.fired[n.id] || 0) + 1;
        let o = outs(n.id);
        if (n.type === 'xor' && o.length > 1) { const f = pick(n.id, o); o = f ? [f] : []; st.log.push({ k: 'info', t: `${name(n.id)} пропускает токен только по одному пути — к ${name(o[0].to)}.` }); }
        else if (n.type === 'and' && o.length > 1) st.log.push({ k: 'accent', t: `Шлюз «И» размножил токен: ${o.length} пути выполняются одновременно.` });
        else if (n.type === 'xor' && ins(n.id).length > 1) st.log.push({ k: 'info', t: 'Слияние «ИСКЛЮЧАЮЩЕЕ ИЛИ» не ждёт: пропускает каждый пришедший токен сразу.' });
        else if (n.type !== 'and' && !/^start/.test(n.type)) st.log.push({ k: '', t: `Выполнено: ${name(n.id)}${st.fired[n.id] > 1 ? ` — уже ${st.fired[n.id]}-й раз!` : ''}.` });
        o.forEach(f => {
          const m = N[f.to]; st.visited.add(m.id);
          if (/^end/.test(m.type)) { st.ends[m.id] = (st.ends[m.id] || 0) + 1; fl.push(m.id); st.log.push({ k: st.ends[m.id] > 1 ? 'bad' : 'ok', t: `Токен дошёл до конечного события ${name(m.id)}${st.ends[m.id] > 1 ? ` — во второй раз` : ''}.` }); return; }
          next.push({ at: m.id, from: n.id, wait: m.type === 'and' && ins(m.id).length > 1 });
        });
      });
      [...new Set(next.filter(t => t.wait).map(t => t.at))].forEach(j => {
        const need = ins(j).map(f => f.from), here = next.filter(t => t.at === j && t.wait);
        if (need.every(s => here.some(t => t.from === s))) {
          need.forEach(s => { const i = next.findIndex(t => t.at === j && t.wait && t.from === s); next.splice(i, 1); });
          next.push({ at: j, from: null, wait: false });
          st.log.push({ k: 'ok', t: 'Слияние «И» дождалось токенов со всех входов и выпустило один.' });
        } else st.log.push({ k: 'warn', t: `Слияние «И» ждёт: пришло ${here.length} из ${need.length}.` });
      });
      st.tokens = next; st.step++; st.flash = fl; st.max = Math.max(st.max, next.length);
      st.done = !next.length; st.stuck = !!next.length && next.every(t => t.wait);
      if (st.stuck) st.log.push({ k: 'bad', t: 'Токены больше не двигаются: слияние «И» ждёт токен, который никогда не придёт. Экземпляр процесса завис.' });
      if (st.done) st.log.push({ k: 'ok', t: 'Токенов не осталось — экземпляр процесса завершён.' });
    }
    function look() {
      const hl = {}, badge = {};
      st.visited.forEach(id => { hl[id] = 'ok'; });
      st.tokens.forEach(t => { hl[t.at] = t.wait ? 'warn' : 'accent'; badge[t.at] = (badge[t.at] || 0) + 1; });
      Object.keys(st.ends).forEach(id => { if (st.ends[id] > 1) hl[id] = 'bad'; });
      return { hl, badge };
    }
    return { st, step, look, run() { let k = 0; while (!st.done && !st.stuck && k++ < 60) step(); return st; } };
  }
  function withLook(cfg, look) {
    cfg.hl = look.hl;
    cfg.nodes = cfg.nodes.map(n => Object.assign({}, n, look.badge[n.id] ? { badge: look.badge[n.id] > 1 ? '×' + look.badge[n.id] : '●' } : { badge: null }));
    return cfg;
  }

  // =====================================================================
  // Теория 1. Зачем BPMN, азбука элементов, пул и дорожки
  // =====================================================================
  const MARINA_TXT = 'Клиент звонит в колл-центр. Девочки спрашивают, какая машина и что делать, открывают Excel — там по каждой станции лист, — ищут окно. Есть окно — вписывают, говорят время и адрес. Нет — говорят: перезвоните позже, может, кто-то отменит. Параллельно запись уходит к нам на станцию, я или мастер смотрю, хватает ли постов. Ну и обращение в журнале закрывают. Всё просто.';
  function drawWhy(pane) {
    let mode = 'text';
    pane.innerHTML = `<div class="stack">
      <p class="small muted"><b>BPMN</b> (Business Process Model and Notation — модель и нотация бизнес-процессов) — стандарт консорциума OMG, версия 2.0 вышла в 2011 году, она же ISO/IEC 19510:2013. Это общий язык картинок, который одинаково читают заказчик, аналитик, разработчик и тестировщик. Ниже — одно и то же: рассказ Марины Олеговны на интервью и диаграмма по нему.</p>
      ${ui.seg('why', [{ v: 'text', t: 'Как рассказала Марина Олеговна' }, { v: 'bpmn', t: 'То же самое в BPMN' }], mode)}
      <div data-o></div>
      <div class="m3b1-two">
        <div class="m3b1-panel"><h4>Что даёт диаграмма, чего нет в тексте</h4><ul class="checks">
          <li>Видно, <b>кто</b> делает шаг: дорожки «Клиент», «Оператор», «Мастер-приёмщик».</li>
          <li>Видны <b>развилки</b>: ветка «нет» у вопроса «Время подошло?» ведёт в «Обращение потеряно» — это и есть 21 % потерянных звонков в часы пик.</li>
          <li>Видно, что идёт <b>параллельно</b>: оператор сообщает время, а мастер в это же время проверяет посты.</li>
          <li>Каждый шаг можно назвать и спросить: «а если?..» — текст такие вопросы прячет.</li></ul></div>
        <div class="m3b1-panel"><h4>Где BPMN нужен аналитику</h4><ul class="checks">
          <li><b>AS-IS</b> («как есть») — описать текущий процесс и найти боли, как сегодня.</li>
          <li><b>TO-BE</b> («как будет») — договориться о новом процессе с системой «Искра Онлайн» (в среду, занятие 4).</li>
          <li>Связать процесс с требованиями: каждая задача в дорожке системы — кандидат в пользовательскую историю.</li>
          <li>Исполняемые процессы в движках (Camunda, Bizagi) — это уже следующий уровень, для разработчиков.</li></ul></div>
      </div>
      <div class="m3b1-ex"><b>Бытовой пример.</b> Заказ пиццы по телефону: вы звоните (начальное событие), оператор спрашивает адрес и состав (задачи), есть ли нужная пицца («исключающее ИЛИ»: да — оформить, нет — предложить замену), кухня печёт, а курьер в это время едет за предыдущим заказом («И»), пицца доставлена (конечное событие). Тот же набор элементов — тот же язык.</div>
    </div>`;
    const out = TR.$('[data-o]', pane);
    function draw() {
      out.innerHTML = '';
      if (mode === 'text') out.innerHTML = `<div class="m3b1-quote">«${esc(MARINA_TXT)}»</div><div class="small dim">Попробуйте по тексту ответить: что будет с клиентом, если окна нет? Кто и когда закрывает обращение, если мастер ещё не проверил посты?</div>`;
      else diagram(out, asis1('and', 'and'));
    }
    ui.onSeg(pane, (g, v) => { if (g === 'why') { mode = v; draw(); } });
    draw();
  }
  const ABC = [
    { k: 'start', n: 'Начальное событие', d: 'С него начинается процесс: что-то случилось — и работа пошла. Тонкий круг без значка — «просто начало».', nm: 'Факт или состояние: «Нужно на ТО», «Обнаружена неисправность».' },
    { k: 'start-msg', n: 'Начальное событие-сообщение', d: 'Процесс запускается, когда пришло сообщение от другого участника: звонок, письмо, уведомление от системы. Конверт внутри.', nm: '«Звонок поступил», «Заявка получена».' },
    { k: 'int-timer', n: 'Промежуточный таймер', d: 'Процесс ждёт срока или даты и только потом идёт дальше. Двойной круг — промежуточное событие, часы — таймер.', nm: '«За день до визита», «Прошло 20 минут».' },
    { k: 'int-msg', n: 'Промежуточное событие: получение сообщения', d: 'Процесс стоит и ждёт сообщения от другого участника. Белый конверт — ловим, закрашенный — отправляем.', nm: '«Время визита получено».' },
    { k: 'end', n: 'Конечное событие', d: 'Ветка процесса закончилась. Толстая обводка. Конечных событий может быть несколько — по одному на каждый исход.', nm: 'Результат: «Клиент записан», «Обращение потеряно».' },
    { k: 'task', n: 'Задача', d: 'Одна единица работы, которую дальше на этой диаграмме не дробят. Прямоугольник со скруглёнными углами.', nm: 'Глагол + объект: «Найти время в графике».' },
    { k: 'user', n: 'Пользовательская задача', d: 'Человек выполняет работу в программе: оператор в Excel, мастер в АРМ. Значок — человечек.', nm: '«Проверить загрузку постов».' },
    { k: 'service', n: 'Сервисная задача', d: 'Работу делает система без участия человека: отправить SMS, посчитать цену. Значок — шестерёнка.', nm: '«Отправить SMS-напоминание».' },
    { k: 'manual', n: 'Ручная задача', d: 'Работа руками, без программы: выдать ключи, осмотреть машину. Значок — ладонь.', nm: '«Выдать ключи клиенту».' },
    { k: 'xor', n: 'Шлюз «исключающее ИЛИ» (XOR)', d: 'Развилка: токен уходит ровно по одному пути, по условию. На слиянии — пропускает каждого пришедшего, не ждёт.', nm: 'Вопрос: «Время подошло?», на выходах — «да» / «нет».' },
    { k: 'and', n: 'Шлюз «И» (AND)', d: 'Все выходы сразу, параллельно. На слиянии ждёт, пока придут токены со всех входов.', nm: 'Обычно без подписи: смысл ясен из значка «+».' },
    { k: 'data', n: 'Объект данных', d: 'Документ или информация, которая создаётся или нужна в процессе: заказ-наряд, фото. Живёт, пока идёт процесс.', nm: 'Существительное: «Заказ-наряд», «Фото проблемы».' },
    { k: 'store', n: 'Хранилище данных', d: 'То, что живёт дольше одного процесса: база, Excel-график, 1С. Цилиндр.', nm: '«Excel-график станций», «База клиентов».' },
    { k: 'note', n: 'Текстовая аннотация', d: 'Пояснение для читателя, на ход процесса не влияет. Соединяется с элементом пунктирной ассоциацией.', nm: 'Свободный текст: «по BR-2 — не позже чем за 2 часа».' }
  ];
  function drawAbc(pane) {
    let cur = 'start';
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Нажмите на элемент — узнаете, что это, как его называть и где он в процессе записи. Все элементы BPMN делятся на четыре семьи: <b>события</b> (круги — что-то случилось), <b>действия</b> (прямоугольники — кто-то работает), <b>шлюзы</b> (ромбы — развилки и слияния), <b>данные и артефакты</b> (документы, хранилища, пояснения). Плюс <b>пулы и дорожки</b> — «бассейн» с «дорожками» для участников и ролей.</p>
      <div class="m3b1-glyphs">${ABC.map(x => `<button type="button" class="m3b1-g" data-g="${x.k}" aria-pressed="${x.k === cur}">${ui.bpmnGlyph(x.k, '')}<span>${esc(x.n)}</span></button>`).join('')}</div>
      <div data-o></div>
    </div>`;
    function draw() {
      TR.$$('[data-g]', pane).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.g === cur)));
      const x = ABC.find(a => a.k === cur);
      TR.$('[data-o]', pane).innerHTML = `<div class="m3b1-panel"><h4>${esc(x.n)}</h4><div>${esc(x.d)}</div><div class="small"><span class="m3b1-lbl">Как назвать</span><br>${esc(x.nm)}</div></div>`;
    }
    TR.on(pane, 'click', '[data-g]', (e, b) => { cur = b.dataset.g; draw(); });
    draw();
  }
  function drawPool(pane) {
    let mode = 'lane';
    pane.innerHTML = `<div class="stack">
      <p class="small muted"><b>Пул</b> — участник процесса: организация, независимый человек или внешняя система. <b>Дорожка</b> — роль или подразделение <i>внутри</i> участника. Главное правило: внутри пула работу передают <b>потоком управления</b> (сплошная стрелка), между пулами — только <b>потоком сообщений</b> (пунктир с кружком). «Искра» не управляет клиентом — она может только отправить ему сообщение и ждать ответа.</p>
      ${ui.seg('pl', [{ v: 'lane', t: 'Клиент — дорожка (черновик для разговора)' }, { v: 'pool', t: 'Клиент — отдельный пул (чистовик)' }], mode)}
      <div data-o></div><div data-x></div>
    </div>`;
    function draw() {
      const o = TR.$('[data-o]', pane); o.innerHTML = '';
      diagram(o, mode === 'lane' ? asis1('and', 'and') : asis2());
      TR.$('[data-x]', pane).innerHTML = mode === 'lane'
        ? ui.note('info', 'Когда так можно', 'Для первого разговора с заказчиком клиента часто рисуют дорожкой: одна картинка, все шаги связаны сплошными стрелками, читать проще. Но это упрощение: получается, будто «Искра» командует клиентом — «позвонить», «приехать». Для аналитики и TO-BE клиента выносят в отдельный пул.')
        : ui.note('ok', 'Что изменилось', 'У клиента — свой процесс: позвонил, ждёт время визита. Связь с «Искрой» — потоки сообщений «звонок» и «время и адрес». Сразу видна дыра: если ответ «нет», клиент так и ждёт сообщения, которого не будет, — в чистовике тут понадобится шлюз по событию (о нём — в среду).');
    }
    ui.onSeg(pane, (g, v) => { if (g === 'pl') { mode = v; draw(); } });
    draw();
  }
  const howBasics = {
    id: 'how-basics', covers: ['parts'], title: 'Как это работает: зачем BPMN, азбука элементов, пулы и дорожки', free: true, noReset: true,
    simple: {
      icon: '🗺️',
      plain: 'BPMN — это способ нарисовать процесс так, чтобы его одинаково поняли и владелец автосервиса, и программист: кружки — события, прямоугольники — работа, ромбы — развилки, полосы — кто что делает.',
      analogy: 'Как схема метро: станции, линии и пересадки нарисованы условными знаками, и любой пассажир понимает её без объяснений — потому что знаки одни для всех.',
      tech: '<b>BPMN 2.0</b> (OMG, 2011; ISO/IEC 19510:2013). Четыре группы элементов: потоковые объекты (события, действия, шлюзы), соединяющие объекты (поток управления, поток сообщений, ассоциация), зоны ответственности (пулы и дорожки), артефакты (данные, аннотации, группы). Брюс Сильвер, «BPMN Method and Style», выделяет уровни: описательный, аналитический, исполняемый.'
    },
    lead: ui.brief({
      situation: 'Понедельник, 21 декабря. Вера положила перед вами расшифровку интервью с Мариной Олеговной: «Сегодня рисуем, как записывают клиентов сейчас. Прежде чем что-то улучшать, надо увидеть процесс целиком».',
      todo: ['Вкладка «Зачем BPMN»: переключите рассказ и диаграмму — сравните, что видно.', 'Вкладка «Азбука»: нажмите на все элементы.', 'Вкладка «Пул и дорожки»: сравните черновик и чистовик.'],
      look: 'На диаграмме важна не красота, а то, что каждый элемент значит ровно одно. Ромб с крестом — всегда «ровно один путь», толстый круг — всегда «конец ветки».'
    }),
    render(el) {
      el.classList.add('m3b1-root');
      const t = document.createElement('div'); el.appendChild(t);
      ui.tabs(t, [{ id: 'w', t: 'Зачем BPMN', render: drawWhy }, { id: 'a', t: 'Азбука элементов', render: drawAbc }, { id: 'p', t: 'Пул и дорожки', render: drawPool }], 'w');
      el.insertAdjacentHTML('beforeend', `<div class="stack tight" style="margin-top:12px">
        ${mistakes(['Дорожки названы фамилиями: «Ирина», «Марина». Через полгода Ирина уйдёт, а процесс останется — дорожка называется ролью: «Оператор колл-центра».', 'Клиент и «Искра» в одном пуле без оговорки — и сплошная стрелка «Искра» → «Клиент приехал», будто клиентом можно управлять.', 'Рисуют экраны и кнопки: «Нажать „Сохранить“». BPMN описывает работу, а не интерфейс.', 'Одна огромная диаграмма на всё: от звонка до оплаты. Читать невозможно — процесс режут на части по смыслу.'])}
        ${interview([['«Что такое BPMN и зачем он аналитику?»', 'Стандарт OMG для моделирования бизнес-процессов. Нужен, чтобы бизнес и разработка одинаково понимали процесс, находили боли в AS-IS и договаривались о TO-BE.'], ['«Чем пул отличается от дорожки?»', 'Пул — участник (организация, внешняя система), у него свой процесс. Дорожка — роль внутри участника. Между пулами — только потоки сообщений.'], ['«Какие группы элементов есть в BPMN?»', 'События, действия (задачи и подпроцессы), шлюзы, данные; соединения: поток управления, поток сообщений, ассоциация; пулы и дорожки; артефакты.']])}
      </div>`);
    }
  };

  // =====================================================================
  // Теория 2. Потоки, данные, именование, уровень детализации
  // =====================================================================
  const FLOW_CFG = {
    title: 'Три вида линий', colW: 140, rowH: 80,
    pools: [{ id: 'fc', t: 'Клиент', lanes: [{ id: 'f1', t: '' }] }, { id: 'fi', t: 'Сеть «Искра»', lanes: [{ id: 'f2', t: 'Оператор' }, { id: 'f3', t: 'Мастер-приёмщик' }] }],
    nodes: [
      { id: 'a', type: 'start', t: 'Нужно на ТО', lane: 'f1', col: 0 }, { id: 'b', type: 'task', t: 'Позвонить в колл-центр', lane: 'f1', col: 1 },
      { id: 'ce', type: 'int-msg', t: 'Время получено', lane: 'f1', col: 4 },
      { id: 'c', type: 'start-msg', t: 'Звонок поступил', lane: 'f2', col: 1 }, { id: 'd', type: 'task', t: 'Найти время в графике', lane: 'f2', col: 2 },
      { id: 'st', type: 'store', t: 'Excel-график', lane: 'f2', col: 2, row: 1 },
      { id: 'g', type: 'user', t: 'Проверить загрузку постов', lane: 'f3', col: 3 }, { id: 'f', type: 'send', t: 'Сообщить время', lane: 'f2', col: 4 }
    ],
    flows: [{ from: 'a', to: 'b' }, { from: 'b', to: 'ce' }, { from: 'b', to: 'c', kind: 'msg', t: 'сообщение', tone: 'accent' }, { from: 'c', to: 'd' }, { from: 'd', to: 'st', kind: 'assoc', tone: 'violet' }, { from: 'd', to: 'g', t: 'управление', tone: 'ok' }, { from: 'g', to: 'f' }, { from: 'f', to: 'ce', kind: 'msg', tone: 'accent' }]
  };
  const CASES = [
    { t: 'Сплошная стрелка из дорожки «Оператор» в дорожку «Мастер-приёмщик» одного пула', ok: 'yes', why: 'Можно и нужно: дорожки — роли одного участника, работа между ними передаётся потоком управления.' },
    { t: 'Сплошная стрелка из пула «Клиент» в пул «Искра»', ok: 'no', why: 'Нельзя: поток управления не выходит за границу пула. Между участниками — только поток сообщений.' },
    { t: 'Пунктир-сообщение между задачами двух дорожек одного пула', ok: 'no', why: 'Нельзя: поток сообщений — только между разными пулами. Внутри пула — поток управления.' },
    { t: 'Поток сообщений из задачи в свёрнутый пул «SMS-шлюз» (без внутренностей)', ok: 'yes', why: 'Можно: пул-«чёрный ящик» показывает внешнего участника, чей процесс нам не важен. Сообщения идут прямо в его границу.' },
    { t: 'Пунктирная ассоциация от задачи к хранилищу «Excel-график»', ok: 'yes', why: 'Можно: так показывают, какие данные читает или пишет задача. Данные не двигают токен — порядок задаёт только поток управления.' },
    { t: 'Сплошная стрелка в начальное событие', ok: 'no', why: 'Нельзя: у начального события нет входящих потоков управления, у конечного — исходящих. (Входящее сообщение в начальное событие-сообщение — можно.)' }
  ];
  function drawFlows(pane) {
    const v = {};
    pane.innerHTML = `<div class="stack">
      <p class="small muted">В BPMN три вида линий, и путать их — самая частая ошибка новичков. <b style="color:var(--ok)">Поток управления</b> — сплошная линия со стрелкой: порядок работ внутри пула, по нему бегает токен. <b style="color:var(--accent)">Поток сообщений</b> — пунктир с кружком в начале и пустой стрелкой: обмен между участниками (звонок, SMS, письмо). <b style="color:var(--violet)">Ассоциация</b> — точечный пунктир: связь с данными и пояснениями.</p>
      <div data-d></div>
      <div class="m3b1-lbl">Можно ли так? Ответьте на шесть случаев</div>
      <div class="m3b1-cases" data-c></div>
    </div>`;
    diagram(TR.$('[data-d]', pane), FLOW_CFG);
    function draw() {
      TR.$('[data-c]', pane).innerHTML = CASES.map((c, i) => `<div class="m3b1-case ${v[i] ? (v[i] === c.ok ? 'ok' : 'bad') : ''}"><div>${esc(c.t)}</div>${ui.seg('c' + i, [{ v: 'yes', t: 'Можно' }, { v: 'no', t: 'Нельзя' }], v[i] || '', 'sm')}${v[i] ? `<div class="why">${v[i] === c.ok ? 'Верно. ' : 'Не так. '}${esc(c.why)}</div>` : ''}</div>`).join('');
    }
    ui.onSeg(pane, (g, val) => { if (/^c\d+$/.test(g)) { v[+g.slice(1)] = val; draw(); } });
    draw();
  }
  const NAMES = [
    { kind: 'Задача', bad: 'Excel', good: 'Найти время в Excel-графике', rule: 'Задача — глагол в неопределённой форме + объект. «Excel» — это инструмент, а не работа.' },
    { kind: 'Задача', bad: 'Запись клиента', good: 'Внести запись в график', rule: 'Отглагольное существительное прячет действие. Глагол сразу отвечает на вопрос «что сделать?».' },
    { kind: 'Задача', bad: 'Оператор вносит запись', good: 'Внести запись в график', rule: 'Исполнителя уже показывает дорожка — в названии задачи он лишний.' },
    { kind: 'Начальное событие', bad: 'Позвонить', good: 'Нужно на ТО', rule: 'Событие — то, что случилось, состояние или факт. Действие «позвонить» — это уже задача клиента.' },
    { kind: 'Конечное событие', bad: 'Конец', good: 'Клиент записан', rule: 'Конечное событие называют результатом. Если исходов несколько — у каждого своё имя: «Клиент записан», «Обращение потеряно».' },
    { kind: 'Шлюз', bad: 'Проверка', good: 'Время подошло?', rule: 'Шлюз «исключающее ИЛИ» — вопрос, а выходы подписаны ответами: «да» / «нет». Проверку делает задача перед шлюзом.' },
    { kind: 'Дорожка', bad: 'Ирина', good: 'Оператор колл-центра', rule: 'Дорожка — роль, а не человек: людей три, роль одна, и процесс переживёт смену сотрудников.' },
    { kind: 'Задача', bad: 'Проверить и записать и сообщить', good: 'Три задачи: «Найти время», «Внести запись», «Сообщить время»', rule: 'Один прямоугольник — одна работа. Союз «и» в названии — сигнал разрезать задачу.' }
  ];
  function drawNames(pane) {
    const open = new Set();
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Хорошая диаграмма читается вслух как рассказ: «Нужно на ТО → позвонить в колл-центр → найти время → время подошло? да → внести запись…». Для этого у каждого элемента своё правило имени. Нажмите на плохое название — увидите, как его исправить.</p>
      <div class="m3b1-names" data-n></div>
      ${ui.note('info', 'Шпаргалка', '<b>Задача</b> — глагол + объект («Найти время»). <b>Событие</b> — состояние, причастие или существительное («Звонок поступил», «Прошло 20 минут»). <b>Шлюз XOR</b> — вопрос с ответами на выходах. <b>Дорожка</b> — роль. <b>Данные</b> — существительное («Заказ-наряд»).')}
    </div>`;
    function draw() {
      TR.$('[data-n]', pane).innerHTML = NAMES.map((x, i) => `<button type="button" class="m3b1-nm" data-i="${i}" aria-pressed="${open.has(i)}"><small>${esc(x.kind)}</small><span><s>${esc(x.bad)}</s>${open.has(i) ? ` → <b class="good">${esc(x.good)}</b>` : ''}</span>${open.has(i) ? `<small>${esc(x.rule)}</small>` : '<small>Нажмите, чтобы исправить</small>'}</button>`).join('');
    }
    TR.on(pane, 'click', '[data-i]', (e, b) => { const i = +b.dataset.i; if (open.has(i)) open.delete(i); else open.add(i); draw(); });
    draw();
  }
  const L3 = ['Снять трубку', 'Поздороваться по скрипту', 'Открыть Excel', 'Найти лист станции', 'Нажать Ctrl+F', 'Ввести дату', 'Вписать фамилию', 'Нажать «Сохранить»'];
  const LEVELS = {
    1: { cfg: { title: 'Уровень 1', pool: 'Сеть «Искра»', lanes: [{ id: 'x', t: '' }], colW: 140, nodes: [{ id: 'a', type: 'start', t: 'Нужно на ТО', lane: 'x', col: 0 }, { id: 'b', type: 'sub', t: 'Записать клиента по телефону', lane: 'x', col: 1 }, { id: 'c', type: 'sub', t: 'Принять машину', lane: 'x', col: 2 }, { id: 'd', type: 'sub', t: 'Отремонтировать и выдать', lane: 'x', col: 3 }, { id: 'e', type: 'end', t: 'Машина выдана', lane: 'x', col: 4 }], flows: [{ from: 'a', to: 'b' }, { from: 'b', to: 'c' }, { from: 'c', to: 'd' }, { from: 'd', to: 'e' }] }, k: 'info', t: 'Карта процессов: «запись → приёмка → ремонт → выдача». Значок «+» — подпроцесс, внутри него своя диаграмма. Хорошо для Тимура Рашидовича и для оглавления, но болей отсюда не видно.' },
    2: { cfg: null, k: 'ok', t: 'Рабочий уровень для разговора с бизнесом: 6–12 задач, видны роли, развилки и параллельные ветки. Именно здесь видно «Обращение потеряно». Так рисуют AS-IS и TO-BE.' },
    3: { cfg: { title: 'Уровень 3', pool: 'Оператор колл-центра', lanes: [{ id: 'x', t: '' }], colW: 120, nodes: [{ id: 's', type: 'start', t: 'Звонок', lane: 'x', col: 0 }].concat(L3.map((t, i) => ({ id: 'l' + i, type: 'task', t, lane: 'x', col: i + 1 }))), flows: [{ from: 's', to: 'l0' }].concat(L3.slice(1).map((_, i) => ({ from: 'l' + i, to: 'l' + (i + 1) }))) }, k: 'bad', t: 'Это уже инструкция пользователя, а не бизнес-процесс: кнопки, скрипты, клавиши. Восемь задач — и всё ещё не понятно, что будет, если окна нет. Такие подробности — в инструкцию или в спецификацию экрана.' }
  };
  function drawLevel(pane) {
    let lv = '2';
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Один и тот же процесс можно нарисовать крупно или мелко. Правило: <b>одна диаграмма — один уровень детализации</b>. Если рядом стоят «Записать клиента» и «Нажать „Сохранить“», читатель не понимает, что важно. Переключите уровни.</p>
      ${ui.seg('lv', [{ v: '1', t: '1 · карта процессов' }, { v: '2', t: '2 · рабочий процесс' }, { v: '3', t: '3 · клики и кнопки' }], lv)}
      <div data-o></div><div data-x></div>
    </div>`;
    function draw() {
      const o = TR.$('[data-o]', pane); o.innerHTML = '';
      const L = LEVELS[lv];
      diagram(o, L.cfg || asis1('and', 'and'));
      TR.$('[data-x]', pane).innerHTML = ui.note(L.k, lv === '2' ? 'Наш уровень' : lv === '1' ? 'Слишком крупно для анализа' : 'Слишком мелко', L.t);
    }
    ui.onSeg(pane, (g, v) => { if (g === 'lv') { lv = v; draw(); } });
    draw();
  }
  const howFlows = {
    id: 'how-flows', covers: ['build'], title: 'Как это работает: потоки, данные, имена и уровень детализации', free: true, noReset: true,
    simple: {
      icon: '➡️',
      plain: 'Сплошная стрелка — «потом делаем это» внутри одной организации. Пунктир с конвертом — «отправили весточку» другому участнику. Точечный пунктир — «эта работа пользуется этими данными».',
      analogy: 'На кухне ресторана повар передаёт тарелку официанту из рук в руки — это поток управления. Заказ поставщику уходит письмом — это сообщение: поставщиком повар не командует.',
      tech: '<b>Sequence flow</b> — порядок действий внутри одного пула, по нему движется токен. <b>Message flow</b> — обмен сообщениями между пулами (участниками), токен не переносит. <b>Association</b> — связь артефактов и данных с элементами потока; <b>data association</b> показывает вход и выход данных задачи (BPMN 2.0, раздел 7.4 и 10.4).'
    },
    lead: ui.brief({
      situation: 'Вера показывает два черновика стажёров: «Посмотрите — тут сплошная стрелка в клиента, тут задача называется „Excel“. Давайте договоримся о правилах, прежде чем рисовать своё».',
      todo: ['Вкладка «Три вида линий»: ответьте на шесть случаев «можно или нельзя».', 'Вкладка «Как называть»: исправьте все восемь названий.', 'Вкладка «Уровень детализации»: сравните три уровня.'],
      look: 'Проверка имени простая: прочитайте цепочку вслух. Если получилось «Звонок → Excel → Проверка → Конец» — непонятно ничего. Если «Звонок поступил → найти время → время подошло?» — понятно всё.'
    }),
    render(el) {
      el.classList.add('m3b1-root');
      const t = document.createElement('div'); el.appendChild(t);
      ui.tabs(t, [{ id: 'f', t: 'Три вида линий', render: drawFlows }, { id: 'n', t: 'Как называть', render: drawNames }, { id: 'l', t: 'Уровень детализации', render: drawLevel }], 'f');
      el.insertAdjacentHTML('beforeend', `<div class="stack tight" style="margin-top:12px">
        ${mistakes(['Стрелки от данных к задаче показывают порядок работ. Данные не задают порядок — его задаёт только поток управления.', 'Шлюз без вопроса и выходы без подписей: читатель не знает, когда идти по какой ветке.', 'Задача с двумя действиями через «и» — потом невозможно сказать, на каком шаге застряли.', 'Два начальных события в одном пуле без причины — непонятно, где начало.'])}
        ${interview([['«Чем поток управления отличается от потока сообщений?»', 'Поток управления задаёт порядок внутри пула и переносит токен; поток сообщений — обмен между пулами, токен не переносит. Между пулами потока управления быть не может.'], ['«Как вы называете задачи и события?»', 'Задача — глагол + объект, событие — состояние или факт, шлюз — вопрос с ответами на выходах, дорожка — роль.'], ['«Как понять, что диаграмма слишком подробная?»', 'Появились кнопки, экраны и клавиши, задач больше 15–20, читатель теряет главную линию. Подробности уводят в подпроцесс или в спецификацию.']])}
      </div>`);
    }
  };

  // =====================================================================
  // Теория 3. Шлюзы XOR и AND, токен
  // =====================================================================
  function miniModel(type) {
    return {
      title: 'Шлюзы и токен', pool: 'Сеть «Искра»', lanes: [{ id: 'o', t: 'Оператор' }, { id: 'm', t: 'Мастер-приёмщик' }], colW: 140, rowH: 80,
      nodes: [{ id: 's', type: 'start', t: 'Время подошло', lane: 'o', col: 0 }, { id: 'put', type: 'task', t: 'Внести запись в график', lane: 'o', col: 1 }, { id: 'g1', type, lane: 'o', col: 2 },
        { id: 'tell', type: 'task', t: 'Сообщить время и адрес', lane: 'o', col: 3 }, { id: 'chk', type: 'task', t: 'Проверить загрузку постов', lane: 'm', col: 3 }, { id: 'g2', type, lane: 'o', col: 4 }, { id: 'e', type: 'end', t: 'Клиент записан', lane: 'o', col: 5 }],
      flows: [{ from: 's', to: 'put' }, { from: 'put', to: 'g1' }, { from: 'g1', to: 'tell', t: type === 'xor' ? 'клиент на линии' : '' }, { from: 'g1', to: 'chk', t: type === 'xor' ? 'иначе' : '', def: type === 'xor' }, { from: 'tell', to: 'g2' }, { from: 'chk', to: 'g2' }, { from: 'g2', to: 'e' }]
    };
  }
  function drawGw(pane) {
    let type = 'and', sim, d;
    pane.innerHTML = `<div class="stack">
      <p class="small muted"><b>Шлюз</b> — ромб, где поток ветвится или сходится. Сам шлюз работу не делает — он только решает, куда пойдут токены. <b>«Исключающее ИЛИ» (XOR, крест)</b> выбирает ровно один путь по условию; один из выходов можно сделать путём <b>по умолчанию</b> (косая чёрточка) — он сработает, если остальные условия ложны. <b>«И» (AND, плюс)</b> отправляет токен по всем выходам сразу, а на слиянии ждёт, пока соберутся все. Переключите тип и прогоните токен по шагам.</p>
      ${ui.seg('gt', [{ v: 'and', t: 'Шлюзы «И»' }, { v: 'xor', t: 'Шлюзы «исключающее ИЛИ»' }], type)}
      <div data-d></div>
      <div class="m3b1-ctl"><button type="button" class="btn primary sm" data-a="step">Шаг токена ▶</button><button type="button" class="btn sm" data-a="reset">Сначала ↺</button><span class="small dim" data-s></span></div>
      <div class="m3b1-log" data-l></div>
    </div>`;
    function reset() {
      sim = makeSim(miniModel(type), (id, o) => o[0]);
      const host = TR.$('[data-d]', pane); host.innerHTML = '';
      d = diagram(host, withLook(miniModel(type), sim.look()));
      show();
    }
    function show() {
      d.redraw(withLook(miniModel(type), sim.look()));
      TR.$('[data-l]', pane).innerHTML = sim.st.log.slice().reverse().map(x => `<div class="${x.k}">${esc(x.t)}</div>`).join('');
      TR.$('[data-s]', pane).textContent = `Шаг ${sim.st.step} · токенов сейчас: ${sim.st.tokens.length}${sim.st.done ? ' · процесс завершён' : ''}`;
    }
    ui.onSeg(pane, (g, v) => { if (g === 'gt') { type = v; reset(); } });
    TR.on(pane, 'click', '[data-a]', (e, b) => { if (b.dataset.a === 'step') { sim.step(); show(); } else reset(); });
    reset();
  }
  const SIX = [
    { t: 'Есть свободное окно — внести запись, нет — предложить перезвонить.', ok: 'xor', why: 'Взаимоисключающие исходы по условию — ровно один путь.' },
    { t: 'После записи одновременно сообщить клиенту время и передать запись на станцию.', ok: 'and', why: 'Обе работы нужны и не зависят друг от друга — параллельные ветки.' },
    { t: 'Клиент просит ТО или диагностику — записываем на одно из двух.', ok: 'xor', why: 'Выбор одного варианта из нескольких — «исключающее ИЛИ».' },
    { t: 'Перед выдачей машины касса проверяет оплату, а мастер — что машину помыли. Выдаём, когда готово и то и другое.', ok: 'and', why: 'Слияние «И»: ждём завершения обеих веток. С «исключающим ИЛИ» выдали бы машину после первой проверки.' },
    { t: 'Клиент корпоративный — выставить счёт, частный — принять оплату на кассе.', ok: 'xor', why: 'Тип клиента определяет ровно одну ветку (BR-10).' },
    { t: 'Пока механик снимает колесо, кладовщица выдаёт колодки со склада.', ok: 'and', why: 'Две работы идут одновременно в разных дорожках — разветвление «И».' }
  ];
  function drawSix(pane) {
    const v = {};
    pane.innerHTML = `<div class="stack"><p class="small muted">Тренировка перед лабораторией: какой шлюз нужен? Подсказка — спросите себя: «нужны <b>все</b> ветки или <b>одна</b> из них?»</p><div class="m3b1-cases" data-c></div></div>`;
    function draw() {
      TR.$('[data-c]', pane).innerHTML = SIX.map((c, i) => `<div class="m3b1-case ${v[i] ? (v[i] === c.ok ? 'ok' : 'bad') : ''}"><div>${esc(c.t)}</div>${ui.seg('s' + i, [{ v: 'xor', t: 'XOR' }, { v: 'and', t: 'AND' }], v[i] || '', 'sm')}${v[i] ? `<div class="why">${v[i] === c.ok ? 'Верно. ' : 'Не так. '}${esc(c.why)}</div>` : ''}</div>`).join('');
    }
    ui.onSeg(pane, (g, val) => { if (/^s\d+$/.test(g)) { v[+g.slice(1)] = val; draw(); } });
    draw();
  }
  function drawToken(pane) {
    pane.innerHTML = `<div class="stack">
      <p class="small muted"><b>Токен</b> — воображаемая фишка, которая бегает по потокам управления и показывает, где сейчас находится один экземпляр процесса (один звонок Елены). Стандарт BPMN 2.0 описывает поведение каждого элемента именно через токены. Если вы можете «прогнать токен» по диаграмме — вы понимаете, что она значит.</p>
      <div class="m3b1-two">
        <div class="m3b1-panel"><h4>Правила движения</h4><ul class="checks">
          <li>Начальное событие создаёт токен.</li>
          <li>Задача получает токен, выполняется и отдаёт его дальше.</li>
          <li>XOR-развилка пропускает токен по одному пути; XOR-слияние пропускает каждый пришедший токен, не дожидаясь других.</li>
          <li>AND-развилка делает копию токена на каждый выход; AND-слияние ждёт токены со <b>всех</b> входов и выпускает один.</li>
          <li>Конечное событие «съедает» токен. Экземпляр процесса закончен, когда токенов не осталось.</li></ul></div>
        <div class="m3b1-panel"><h4>Зачем это аналитику</h4><ul class="checks">
          <li>Найти <b>зависание</b>: AND-слияние ждёт ветку, в которую токен не пошёл.</li>
          <li>Найти <b>дубли</b>: после AND-разветвления XOR-слияние пропускает два токена — шаг выполнится дважды.</li>
          <li>Проверить каждую ветку: дойдёт ли токен до конца при «нет»?</li>
          <li>Лиза так придумывает тест-кейсы: один путь токена — один сценарий.</li></ul></div>
      </div>
      <div class="m3b1-ex"><b>Бытовой пример.</b> Эстафета: палочка одна, бегун не стартует, пока ему её не передали. «И» — как если бы на этапе палочку разломили на две, и финишёр ждёт, пока прибегут оба. А «исключающее ИЛИ» на финише пропустит первого и потом — второго: финиш будет дважды.</div>
    </div>`;
  }
  const howGw = {
    id: 'how-gw', covers: ['token'], title: 'Как это работает: шлюзы XOR и AND, токен', free: true, noReset: true,
    simple: {
      icon: '🔀',
      plain: '«Исключающее ИЛИ» — выбираем одну дорогу из нескольких. «И» — идём всеми дорогами сразу, а потом ждём, пока все вернутся. Токен — фишка, по которой видно, где сейчас процесс.',
      analogy: 'Развилка на трассе — «исключающее ИЛИ»: поехали либо налево, либо направо. Семья в торговом центре разделилась — папа за продуктами, мама за обувью — и встречается у выхода: это «И».',
      tech: '<b>Exclusive gateway</b> (XOR) — на разветвлении одно исходящее направление по условию (поддерживает default flow), на слиянии — без синхронизации. <b>Parallel gateway</b> (AND) — на разветвлении все исходящие, на слиянии — синхронизация всех входящих. Семантика описана через токены (BPMN 2.0, раздел 13).'
    },
    lead: ui.brief({
      situation: 'Глеб заглядывает через плечо: «А что будет, если шлюз в середине — не „И“, а „ИЛИ“? Запись создастся два раза?» Вера улыбается: «Прогоните токен — и узнаете».',
      todo: ['Вкладка «XOR и AND»: прогоните токен при обоих типах шлюзов.', 'Вкладка «Шесть ситуаций»: выберите шлюз для каждой.', 'Вкладка «Что такое токен»: прочитайте правила — они понадобятся в лаборатории.'],
      look: 'Разветвление и слияние почти всегда одного типа: открыли «И» — закройте «И». Смешение типов — источник зависаний и дублей.'
    }),
    render(el) {
      el.classList.add('m3b1-root');
      const t = document.createElement('div'); el.appendChild(t);
      ui.tabs(t, [{ id: 'g', t: 'XOR и AND', render: drawGw }, { id: 's', t: 'Шесть ситуаций', render: drawSix }, { id: 't', t: 'Что такое токен', render: drawToken }], 'g');
      el.insertAdjacentHTML('beforeend', `<div class="stack tight" style="margin-top:12px">
        ${mistakes(['Условия на выходах XOR пересекаются («сумма > 1000» и «сумма > 3000»): при 5 000 подходят оба — какой путь? Условия должны исключать друг друга.', 'Ни одно условие не выполнилось, а пути по умолчанию нет — токен застрял на шлюзе.', 'Разветвление «И», а слияние «исключающее ИЛИ»: шаг после слияния выполнится дважды.', 'Шлюз решает «сам»: «Проверить оплату» нарисовано ромбом. Проверка — это задача, шлюз только задаёт вопрос по её результату.'])}
        ${interview([['«Чем XOR отличается от AND?»', 'XOR — один путь по условию, на слиянии не ждёт. AND — все пути параллельно, на слиянии ждёт всех.'], ['«Что такое токен?»', 'Абстракция для описания поведения процесса: метка, которая движется по потокам управления; по ней видно, где экземпляр процесса и что выполняется параллельно.'], ['«Что будет, если разветвить AND, а слить XOR?»', 'Каждая ветка пройдёт через слияние отдельно, и всё после него выполнится столько раз, сколько было веток.']])}
      </div>`);
    }
  };

  // =====================================================================
  // Практика 1. Узнайте элементы (кликабельная диаграмма-квиз)
  // =====================================================================
  const P_CH = [
    { v: 'start', t: 'Начальное событие' }, { v: 'start-msg', t: 'Начальное событие-сообщение' }, { v: 'int-msg', t: 'Промежуточное: получение сообщения' },
    { v: 'end', t: 'Конечное событие' }, { v: 'task', t: 'Задача (без типа)' }, { v: 'user', t: 'Пользовательская задача' }, { v: 'send', t: 'Задача отправки сообщения' },
    { v: 'xor', t: 'Шлюз «исключающее ИЛИ»' }, { v: 'and', t: 'Шлюз «И»' }, { v: 'store', t: 'Хранилище данных' }, { v: 'data', t: 'Объект данных' }
  ];
  const P_IT = [
    { id: 'c_s', ok: 'start', why: 'Тонкий круг без значка — начальное событие без триггера: у клиента просто возникла потребность.' },
    { id: 'o_s', ok: 'start-msg', why: 'Тонкий круг с конвертом: процесс оператора запускает входящее сообщение — звонок.' },
    { id: 'o_find', ok: 'task', why: 'Обычная задача без значка типа. Можно было бы уточнить до пользовательской, но на этой диаграмме тип не указан.' },
    { id: 'o_store', ok: 'store', why: 'Цилиндр — хранилище: Excel-график живёт дольше одного звонка. Объект данных был бы листом с загнутым углом.' },
    { id: 'o_gw', ok: 'xor', why: 'Ромб с крестом — «исключающее ИЛИ»: время либо подошло, либо нет.' },
    { id: 'o_lost', ok: 'end', why: 'Толстый круг — конечное событие. Исход «Обращение потеряно» — та самая боль 21 %.' },
    { id: 'o_and', ok: 'and', why: 'Ромб с плюсом — шлюз «И»: оба пути параллельно.' },
    { id: 'o_tell', ok: 'send', why: 'Закрашенный конверт в углу — задача отправки сообщения: из неё выходит поток сообщений к клиенту.' },
    { id: 'm_check', ok: 'user', why: 'Человечек — пользовательская задача: мастер работает в программе (пока — в Excel).' },
    { id: 'c_ans', ok: 'int-msg', why: 'Двойной круг с белым конвертом — промежуточное событие получения сообщения: клиент ждёт время визита.' }
  ];
  const P_Q1 = { q: 'Линия от «Позвонить в колл-центр» к «Звонок поступил» — пунктир с кружком в начале и пустой стрелкой. Что это?', options: [
    { t: 'Поток сообщений: клиент и «Искра» — разные участники', ok: true, why: 'Да: между пулами — только сообщения. Звонок — сообщение от клиента.' },
    { t: 'Поток управления: просто нарисован пунктиром для красоты', why: 'Поток управления всегда сплошной и не пересекает границу пула.' },
    { t: 'Ассоциация: показывает, что звонок — это данные', why: 'Ассоциация — точечный пунктир без стрелки, связывает с данными и аннотациями.' }] };
  const P_Q2 = { q: 'Почему клиент здесь нарисован отдельным пулом, а оператор и мастер — дорожками одного пула?', options: [
    { t: 'Клиент — независимый участник: «Искра» не управляет его действиями, может только обмениваться сообщениями', ok: true, why: 'Именно. Оператор и мастер — роли одной организации, ими управляет один процесс.' },
    { t: 'Потому что у клиента меньше задач', why: 'Число задач ни при чём: пул — это участник, а не объём работы.' },
    { t: 'Потому что клиент работает в другой программе', why: 'Программа не делает участника отдельным: мастер и оператор тоже в разных программах, но в одном пуле.' }] };
  const partsTask = {
    id: 'parts', title: 'Узнайте элементы на диаграмме AS-IS',
    lead: ui.brief({
      situation: 'Вера нарисовала чистовик «Запись по телефону» и пронумеровала десять элементов: «Завтра покажем Марине Олеговне. Если вы сами не назовёте каждый значок — она спросит, а вы замнётесь».',
      todo: ['Нажмите на пронумерованный элемент на диаграмме (или на его номер в списке под ней) и выберите, что это.', 'Ответьте на два вопроса о линиях и пулах.', 'Нажмите «Проверить». Засчитывается от 80 %.'],
      look: 'Смотрите на три признака: форма (круг, прямоугольник, ромб, цилиндр), обводка (тонкая, двойная, толстая) и значок внутри или в углу.'
    }),
    blank: () => ({ v: {}, q1: [], q2: [] }),
    reference: () => ({ v: Object.fromEntries(P_IT.map(x => [x.id, x.ok])), q1: [0], q2: [0] }),
    render(el, ctx) {
      el.classList.add('m3b1-root');
      const a = ctx.ans; a.v = a.v || {}; a.q1 = a.q1 || []; a.q2 = a.q2 || [];
      const rv = !!(ctx.result || ctx.readonly);
      let sel = rv ? null : P_IT[0].id;
      el.innerHTML = `<div class="stack"><div data-d></div><div class="m3b1-panel" data-p></div><div data-q1></div><div data-q2></div></div>`;
      const num = id => P_IT.findIndex(x => x.id === id) + 1;
      const conf = () => {
        const c = asis2();
        c.nodes = c.nodes.map(n => num(n.id) ? Object.assign({}, n, { badge: String(num(n.id)) }) : n);
        c.hl = {}; P_IT.forEach(x => { if (rv && a.v[x.id]) c.hl[x.id] = a.v[x.id] === x.ok ? 'ok' : (x.ok === 'user' || x.ok === 'send') && a.v[x.id] === 'task' ? 'warn' : 'bad'; else if (!rv && a.v[x.id]) c.hl[x.id] = 'info'; });
        c.selected = sel;
        c.onClick = id => { if (!num(id) || ctx.readonly) return; sel = id; d.redraw(conf()); panel(); };
        return c;
      };
      const d = diagram(TR.$('[data-d]', el), conf());
      function panel() {
        const p = TR.$('[data-p]', el), it = P_IT.find(x => x.id === sel);
        p.innerHTML = `<div class="m3b1-lbl">Ваши ответы — нажмите номер, чтобы выбрать элемент</div>
          <div class="m3b1-picks">${P_IT.map((x, i) => { const v = a.v[x.id], ch = P_CH.find(c => c.v === v); const k = rv && v ? (v === x.ok ? 'ok' : 'bad') : ''; return `<button type="button" class="chip" data-sel="${x.id}" aria-pressed="${x.id === sel}" ${ctx.readonly ? 'disabled' : ''}>${i + 1} · ${ch ? esc(ch.t) : '—'}${k === 'ok' ? ' ✓' : k === 'bad' ? ' ✗' : ''}</button>`; }).join('')}</div>
          ${it && !ctx.readonly ? `<div class="m3b1-lbl">Элемент № ${num(sel)} — это…</div><div class="m3b1-picks">${P_CH.map(c => `<button type="button" class="chip" data-v="${c.v}" aria-pressed="${a.v[sel] === c.v}">${esc(c.t)}</button>`).join('')}</div>` : ''}
          ${rv ? `<ul class="checks">${P_IT.map((x, i) => `<li class="${a.v[x.id] === x.ok ? 'ok' : 'bad'}"><b>${i + 1}.</b> ${esc(P_CH.find(c => c.v === x.ok).t)}${a.v[x.id] && a.v[x.id] !== x.ok ? ` (у вас — ${esc(P_CH.find(c => c.v === a.v[x.id]).t.toLowerCase())})` : ''}. ${esc(x.why)}</li>`).join('')}</ul>` : ''}`;
      }
      TR.on(el, 'click', '[data-sel]', (e, b) => { sel = b.dataset.sel; d.redraw(conf()); panel(); });
      TR.on(el, 'click', '[data-v]', (e, b) => {
        if (!sel || ctx.readonly) return;
        a.v[sel] = b.dataset.v; ctx.save();
        const i = P_IT.findIndex(x => x.id === sel), nx = P_IT.slice(i + 1).concat(P_IT.slice(0, i)).find(x => !a.v[x.id]);
        if (nx) sel = nx.id;
        d.redraw(conf()); panel();
      });
      panel();
      ui.quiz(TR.$('[data-q1]', el), Object.assign({}, P_Q1, { value: a.q1, readonly: ctx.readonly, reveal: rv || null, onChange: v => { a.q1 = v; ctx.save(); } }));
      ui.quiz(TR.$('[data-q2]', el), Object.assign({}, P_Q2, { value: a.q2, readonly: ctx.readonly, reveal: rv || null, onChange: v => { a.q2 = v; ctx.save(); } }));
    },
    check(ans) {
      const v = (ans && ans.v) || {}, notes = [];
      let pts = 0;
      P_IT.forEach((x, i) => {
        if (v[x.id] === x.ok) pts += 1;
        else if (v[x.id] === 'task' && (x.ok === 'user' || x.ok === 'send')) { pts += 0.5; notes.push({ ok: 'warn', html: `№ ${i + 1}: это задача, но уточнённого типа — посмотрите на значок в левом верхнем углу. ${esc(x.why)}` }); }
        else if (v[x.id]) notes.push({ ok: false, html: `№ ${i + 1}: не «${esc(P_CH.find(c => c.v === v[x.id]).t)}». ${esc(x.why)}` });
      });
      const miss = P_IT.filter(x => !v[x.id]).length;
      if (miss) notes.push({ ok: false, html: `Не отмечено элементов: ${miss}.` });
      const q1 = ui.quizScore(P_Q1, ans && ans.q1).ok, q2 = ui.quizScore(P_Q2, ans && ans.q2).ok;
      notes.push(q1 ? { ok: true, html: 'Поток сообщений узнан верно.' } : { ok: false, html: 'Вопрос о линии: между пулами — только поток сообщений, он рисуется пунктиром с кружком и пустой стрелкой.' });
      notes.push(q2 ? { ok: true, html: 'Пул — участник, дорожка — роль внутри него.' } : { ok: false, html: 'Вопрос о пулах: пул — независимый участник, дорожка — роль внутри участника.' });
      pts += (q1 ? 1 : 0) + (q2 ? 1 : 0);
      const score = pts / (P_IT.length + 2), good = P_IT.filter(x => v[x.id] === x.ok).length;
      notes.unshift({ ok: good >= 8, html: `Элементы: верно ${good} из ${P_IT.length}.` });
      return { ok: score >= 0.8, score, notes, summary: `Верно ${Math.round(score * 100)} %.`,
        mentor: v.o_store === 'data' ? 'Хранилище и объект данных путают часто. Простая проверка: переживёт ли это один звонок? Excel-график живёт годами — значит, хранилище, цилиндр.' : v.c_ans === 'start-msg' || v.o_s === 'int-msg' ? 'Смотрите на обводку: тонкий круг — начало, двойной — середина процесса, толстый — конец. Конверт внутри говорит только о триггере.' : null };
    },
    explain: `<p>Три вопроса к любому элементу: <b>какая форма</b> (круг — событие, прямоугольник — действие, ромб — шлюз, лист или цилиндр — данные), <b>какая обводка</b> у круга (тонкая — начало, двойная — промежуточное, толстая — конец), <b>какой значок</b> (конверт — сообщение, часы — таймер, человечек — пользователь, плюс или крест в ромбе — тип шлюза).</p>
      <p>Обратите внимание на клиента: его пул начинается с потребности и заканчивается «Визит запланирован», а связь с «Искрой» — только сообщения. В ветке «нет» сообщение клиенту не уходит, и его процесс «зависает» на ожидании. Это не ошибка рисования, а честное отражение AS-IS: клиент просто уходит к конкурентам.</p>
      <p class="small muted">Источники: OMG, «Business Process Model and Notation (BPMN) 2.0», раздел 7 «Overview»; Б. Сильвер, «BPMN Method and Style», гл. 2–4.</p>`,
    report: ans => { const v = (ans && ans.v) || {}; return P_IT.map((x, i) => `${i + 1}. ${(P_CH.find(c => c.v === v[x.id]) || { t: '—' }).t}${v[x.id] === x.ok ? '' : ' ✗'}`).join('\n'); }
  };

  // =====================================================================
  // Практика 2. Соберите AS-IS по дорожкам и порядку
  // =====================================================================
  const B_IT = [
    { id: 'b1', t: 'Нужно на ТО', type: 'start', lane: 'c', why: 'Начальное событие у клиента: с его потребности всё начинается.' },
    { id: 'b2', t: 'Позвонить в колл-центр', lane: 'c', why: 'Действие клиента.' },
    { id: 'b3', t: 'Выяснить машину и услугу', lane: 'o', why: 'Оператор принимает звонок и уточняет, что нужно.' },
    { id: 'b4', t: 'Найти свободное время в графике', lane: 'o', why: 'Оператор ищет окно в Excel-графике станции.' },
    { id: 'b5', t: 'Согласовать время с клиентом', lane: 'o', why: 'Работу выполняет оператор, клиент — собеседник. В двухпульной версии это стало бы обменом сообщениями.' },
    { id: 'b6', t: 'Внести запись в график', lane: 'o', why: 'Оператор вписывает клиента в Excel.' },
    { id: 'b7', t: 'Отправить список записей на станцию', lane: 'o', why: 'Вечером оператор отправляет станции список на завтра по почте — так сейчас.' },
    { id: 'b8', t: 'Сверить записи с загрузкой постов', lane: 'm', why: 'Утром мастер-приёмщик смотрит, хватает ли постов.' },
    { id: 'b9', t: 'Позвонить клиенту накануне визита', lane: 'm', why: 'Мастер-приёмщик напоминает о визите — ответ на 17 % неявок, пока вручную.' },
    { id: 'b10', t: 'Визит подтверждён', type: 'end', lane: 'm', why: 'Конечное событие — результат процесса записи.' },
    { id: 'x1', t: 'Excel-график станций', lane: 'x', why: 'Это не шаг, а хранилище данных: рисуется цилиндром рядом с задачей «Найти свободное время».' },
    { id: 'x2', t: 'Отремонтировать машину', lane: 'x', why: 'Это другой процесс (ремонт), за границей процесса записи. На карте процессов он стоит следующим.' },
    { id: 'x3', t: 'Нажать «Сохранить» в Excel', lane: 'x', why: 'Слишком мелкий уровень: это клик в интерфейсе, а не бизнес-шаг. Входит в «Внести запись в график».' }
  ];
  const B_STEPS = B_IT.filter(x => x.lane !== 'x').map(x => x.id);
  const B_LN = [{ v: 'c', t: 'Клиент' }, { v: 'o', t: 'Оператор' }, { v: 'm', t: 'Мастер' }, { v: 'x', t: 'Не шаг' }];
  function buildEval(ans) {
    const lane = (ans && ans.lane) || {}, order = (ans && ans.order) || [];
    const laneOk = B_IT.filter(x => lane[x.id] === x.lane).length;
    const placed = order.filter(id => B_STEPS.includes(id) && lane[id] && lane[id] !== 'x');
    const ord = placed.length >= 2 ? ui.orderScore(placed, B_STEPS.filter(id => placed.includes(id))) * (placed.length / B_STEPS.length) : 0;
    return { laneOk, ord, score: 0.6 * laneOk / B_IT.length + 0.4 * ord };
  }
  const buildTask = {
    id: 'build', title: 'Соберите AS-IS «Запись по телефону» по дорожкам',
    lead: ui.brief({
      situation: 'Вера: «Для первого разговора с Мариной Олеговной нарисуем черновик в одном пуле — клиент дорожкой, так ей будет проще. Основной путь, когда время нашлось, — без развилок. Карточки я выписала из интервью, но три из них — не шаги этого процесса».',
      todo: ['Для каждой карточки выберите дорожку: клиент, оператор колл-центра, мастер-приёмщик — или «Не шаг».', 'Стрелками ↑ ↓ расставьте шаги по порядку. Предпросмотр диаграммы обновляется сразу.', 'Нажмите «Проверить». Засчитывается, если дорожки верны хотя бы у 11 карточек из 13 и порядок верен на 85 %.'],
      look: 'Дорожка — тот, кто выполняет работу. «Согласовать время» — говорят двое, но работу (найти, предложить, зафиксировать) делает оператор.'
    }),
    blank: () => ({ order: TR.shuffle(B_IT.map(x => x.id), 'm3b1-build'), lane: {} }),
    reference: () => ({ order: B_IT.map(x => x.id), lane: Object.fromEntries(B_IT.map(x => [x.id, x.lane])) }),
    render(el, ctx) {
      el.classList.add('m3b1-root');
      const a = ctx.ans; a.lane = a.lane || {};
      if (!a.order || a.order.length !== B_IT.length) a.order = TR.shuffle(B_IT.map(x => x.id), 'm3b1-build');
      const rv = !!(ctx.result || ctx.readonly);
      el.innerHTML = `<div class="stack"><div class="m3b1-rows" data-r></div><div class="m3b1-signs" data-g></div><div class="m3b1-lbl">Предпросмотр</div><div data-d></div></div>`;
      const by = Object.fromEntries(B_IT.map(x => [x.id, x]));
      const conf = () => {
        const placed = a.order.filter(id => a.lane[id] && a.lane[id] !== 'x');
        return { title: 'Ваш черновик AS-IS', pool: 'Запись по телефону — как есть', lanes: LANES3, colW: 132, rowH: 80,
          nodes: placed.map((id, i) => ({ id, type: by[id].type || (id === 'x1' ? 'store' : 'task'), t: by[id].t, lane: a.lane[id], col: i, tone: rv ? (a.lane[id] === by[id].lane ? '' : 'bad') : '' })),
          flows: placed.slice(1).map((id, i) => ({ from: placed[i], to: id })) };
      };
      const d = diagram(TR.$('[data-d]', el), conf());
      function rows() {
        TR.$('[data-r]', el).innerHTML = a.order.map((id, k) => {
          const x = by[id], ok = a.lane[id] === x.lane;
          return `<div class="m3b1-row ${rv && a.lane[id] ? (ok ? 'ok' : 'bad') : ''}"><span class="n">${k + 1}</span><div>${esc(x.t)}</div>
            <div class="mv">${ctx.readonly ? '' : `<button type="button" data-mv="-1" data-id="${id}" aria-label="Выше" ${k === 0 ? 'disabled' : ''}>↑</button><button type="button" data-mv="1" data-id="${id}" aria-label="Ниже" ${k === a.order.length - 1 ? 'disabled' : ''}>↓</button>`}</div>
            <div class="lanes">${B_LN.map(l => `<button type="button" class="chip" data-ln="${l.v}" data-id="${id}" aria-pressed="${a.lane[id] === l.v}" ${ctx.readonly ? 'disabled' : ''}>${l.t}</button>`).join('')}</div>
            ${rv && a.lane[id] && !ok ? `<div class="why">Дорожка: ${esc(B_LN.find(l => l.v === x.lane).t)}. ${esc(x.why)}</div>` : ''}</div>`;
        }).join('');
        const placed = a.order.filter(id => a.lane[id] && a.lane[id] !== 'x'), done = B_IT.filter(x => a.lane[x.id]).length;
        const sg = [
          [done === B_IT.length, `Разложено ${done} из ${B_IT.length}`],
          [placed.length && by[placed[0]].type === 'start', 'Начинается с начального события'],
          [placed.length && by[placed[placed.length - 1]].type === 'end', 'Заканчивается конечным событием'],
          [['c', 'o', 'm'].every(l => placed.some(id => a.lane[id] === l)), 'Ни одна дорожка не пустует'],
          [!placed.some(id => /^x/.test(id) && id !== 'x1') && !placed.includes('x1'), 'В процессе только действия и события']
        ];
        TR.$('[data-g]', el).innerHTML = sg.map(s => `<span class="m3b1-sign ${s[0] ? 'on' : ''}">${s[0] ? '✓ ' : ''}${s[1]}</span>`).join('');
      }
      TR.on(el, 'click', '[data-mv]', (e, b) => {
        const i = a.order.indexOf(b.dataset.id), j = i + (+b.dataset.mv); if (j < 0 || j >= a.order.length) return;
        [a.order[i], a.order[j]] = [a.order[j], a.order[i]]; ctx.save(); rows(); d.redraw(conf());
      });
      TR.on(el, 'click', '[data-ln]', (e, b) => { a.lane[b.dataset.id] = b.dataset.ln; ctx.save(); rows(); d.redraw(conf()); });
      rows();
    },
    check(ans) {
      const r = buildEval(ans), lane = (ans && ans.lane) || {}, notes = [];
      notes.push({ ok: r.laneOk >= 11, html: `Дорожки верны у ${r.laneOk} из ${B_IT.length} карточек.` });
      B_IT.filter(x => lane[x.id] && lane[x.id] !== x.lane).forEach(x => notes.push({ ok: false, html: `«${esc(x.t)}» — ${esc(B_LN.find(l => l.v === x.lane).t.toLowerCase())}. ${esc(x.why)}` }));
      const miss = B_IT.filter(x => !lane[x.id]).length;
      if (miss) notes.push({ ok: false, html: `Без дорожки осталось карточек: ${miss}.` });
      notes.push({ ok: r.ord >= 0.85, html: r.ord >= 0.85 ? `Порядок шагов верный (${Math.round(r.ord * 100)} %).` : `Порядок верен на ${Math.round(r.ord * 100)} %. Прочитайте цепочку вслух: звонок → выяснить → найти время → согласовать → внести → отправить станции → сверить посты → позвонить накануне → визит подтверждён.` });
      const ok = r.laneOk >= 11 && r.ord >= 0.85;
      return { ok, score: r.score, notes, summary: `Дорожки ${r.laneOk}/${B_IT.length}, порядок ${Math.round(r.ord * 100)} %.`,
        mentor: lane.b5 === 'c' ? '«Согласовать время» тянет в дорожку клиента — разговаривают же двое. Но дорожка показывает, кто выполняет работу и отвечает за результат. Это оператор.' : lane.x1 && lane.x1 !== 'x' ? '«Excel-график» — не действие, а место, где лежат данные. На диаграмме он будет цилиндром рядом с задачей, а не шагом в цепочке.' : null };
    },
    explain: `<p>Основной путь читается одной фразой: клиенту нужно на ТО — он звонит — оператор выясняет машину, находит время, согласует его, вносит запись и вечером отправляет список на станцию — мастер утром сверяет посты и накануне звонит клиенту — визит подтверждён.</p>
      <p>Три карточки — не шаги этого процесса: <b>хранилище</b> (Excel-график — данные, а не работа), <b>соседний процесс</b> (ремонт начинается после записи) и <b>другой уровень детализации</b> (клик «Сохранить»). Отсекать лишнее — половина работы аналитика: граница процесса и единый уровень делают диаграмму читаемой.</p>
      <p>Уже здесь видны две передачи между ролями — оператор → станция (вечерний список по почте) и мастер → клиент (звонок накануне). Каждая передача в AS-IS — место, где теряется информация, и кандидат на автоматизацию в TO-BE.</p>
      <p class="small muted">Источники: BPMN 2.0 (OMG), раздел 10.8 «Lanes»; Б. Сильвер, «BPMN Method and Style» — правила стиля об уровне детализации; К. Вигерс, Дж. Битти, «Разработка требований к программному обеспечению», гл. о моделях процессов.</p>`,
    refNote: 'Засчитывается и другой порядок соседних шагов, если смысл цепочки сохранён (порядок оценивается по парам шагов, порог 85 %).',
    report: ans => { const a = ans || {}; return (a.order || []).map((id, i) => `${i + 1}. ${B_IT.find(x => x.id === id).t} — ${(B_LN.find(l => l.v === (a.lane || {})[id]) || { t: '—' }).t}`).join('\n'); }
  };

  // =====================================================================
  // Практика 3. Найдите ошибки в черновике Марины Олеговны
  // =====================================================================
  const E_RS = [
    { v: 'seqpool', t: 'Поток управления пересекает границу пула' }, { v: 'nametask', t: 'Задача названа не действием' },
    { v: 'gwq', t: 'Шлюз без вопроса и подписей на выходах' }, { v: 'level', t: 'Не тот уровень детализации' },
    { v: 'join', t: 'Слияние не того типа' }, { v: 'nameev', t: 'Событие названо действием' },
    { v: 'endout', t: 'Из конечного события выходит поток' }, { v: 'noin', t: 'Задача ни с чем не связана' }
  ];
  const E_ERR = {
    e_call: { k: 'seqpool', why: 'Сплошная стрелка из пула «Клиент» в пул «Искра». Между участниками — только поток сообщений: «звонок».' },
    e_take: { k: 'nametask', why: '«Звонок» — существительное. Задача — глагол + объект: «Выяснить машину и услугу». Или это событие «Звонок поступил».' },
    e_gw: { k: 'gwq', why: '«Проверка» — не вопрос, выходы не подписаны. Нужно «Время подошло?» с выходами «да» / «нет».' },
    e_save: { k: 'level', why: '«Нажать „Сохранить“» — клик в интерфейсе на фоне бизнес-шагов. На этом уровне — «Внести запись в график».' },
    e_join: { k: 'join', why: 'После разветвления «И» слияние «исключающее ИЛИ» пропустит оба токена: процесс закончится дважды. Нужно слияние «И».' },
    e_end: { k: 'nameev', why: '«Записать клиента» — действие. Конечное событие называют результатом: «Клиент записан».' },
    e_lost: { k: 'endout', why: 'Из конечного события выходит стрелка назад. Конец — это конец; если нужен повтор, стрелку ведут от задачи или шлюза, до конечного события.' },
    e_float: { k: 'noin', why: 'Задача без входящих и исходящих потоков: неизвестно, когда она начинается и что после неё. Её надо встроить в поток (после «Проверить загрузку постов» или по таймеру «за день до визита»).' }
  };
  const E_OK = {
    e_cs: 'Начальное событие клиента названо состоянием — верно.', e_find: 'Глагол + объект, на своём месте — верно.', e_no: 'Ветка отказа нарисована задачей — верно.',
    e_and: 'Разветвление «И»: сообщить клиенту и проверить посты параллельно — верно.', e_tell: 'Задача названа действием — верно.', e_mchk: 'Задача мастера в своей дорожке — верно.'
  };
  const E_CFG = () => ({
    title: 'Черновик Марины Олеговны', colW: 140, rowH: 86,
    pools: [{ id: 'pc', t: 'Клиент', lanes: [{ id: 'ec', t: '' }] }, { id: 'pi', t: 'Искра', lanes: [{ id: 'eo', t: 'Оператор' }, { id: 'em', t: 'Мастер-приёмщик' }] }],
    nodes: [
      { id: 'e_cs', type: 'start', t: 'Нужно на ТО', lane: 'ec', col: 0 }, { id: 'e_call', type: 'task', t: 'Позвонить в колл-центр', lane: 'ec', col: 1 },
      { id: 'e_take', type: 'task', t: 'Звонок', lane: 'eo', col: 2 }, { id: 'e_find', type: 'task', t: 'Найти время в Excel-графике', lane: 'eo', col: 3 },
      { id: 'e_gw', type: 'xor', t: 'Проверка', lane: 'eo', col: 4 }, { id: 'e_save', type: 'task', t: 'Нажать «Сохранить» в Excel', lane: 'eo', col: 5 },
      { id: 'e_no', type: 'task', t: 'Предложить перезвонить', lane: 'eo', col: 4, row: 1 }, { id: 'e_lost', type: 'end', t: 'Обращение потеряно', lane: 'eo', col: 5, row: 1 },
      { id: 'e_and', type: 'and', lane: 'eo', col: 6 }, { id: 'e_tell', type: 'task', t: 'Сообщить клиенту время', lane: 'eo', col: 7 },
      { id: 'e_mchk', type: 'task', t: 'Проверить загрузку постов', lane: 'em', col: 7 }, { id: 'e_join', type: 'xor', lane: 'eo', col: 8 },
      { id: 'e_end', type: 'end', t: 'Записать клиента', lane: 'eo', col: 9 }, { id: 'e_float', type: 'task', t: 'Позвонить клиенту накануне', lane: 'em', col: 3 }
    ],
    flows: [
      { from: 'e_cs', to: 'e_call' }, { from: 'e_call', to: 'e_take' }, { from: 'e_take', to: 'e_find' }, { from: 'e_find', to: 'e_gw' },
      { from: 'e_gw', to: 'e_save' }, { from: 'e_gw', to: 'e_no' }, { from: 'e_no', to: 'e_lost' }, { from: 'e_lost', to: 'e_find', drop: 20 },
      { from: 'e_save', to: 'e_and' }, { from: 'e_and', to: 'e_tell' }, { from: 'e_and', to: 'e_mchk' }, { from: 'e_tell', to: 'e_join' }, { from: 'e_mchk', to: 'e_join' }, { from: 'e_join', to: 'e_end' }
    ]
  });
  const E_NAME = id => { const n = E_CFG().nodes.find(x => x.id === id); return n.t ? '«' + n.t + '»' : n.type === 'and' ? 'шлюз «И»' : 'шлюз-слияние'; };
  function errEval(m) {
    m = m || {};
    let pts = 0; const found = [], half = [], fp = [];
    Object.keys(m).forEach(id => { if (!m[id]) return; if (E_ERR[id]) { if (m[id] === E_ERR[id].k) { pts += 1; found.push(id); } else { pts += 0.5; half.push(id); } } else { pts -= 0.5; fp.push(id); } });
    return { score: Math.max(0, pts / 8), found, half, fp, miss: Object.keys(E_ERR).filter(id => !m[id]) };
  }
  const errorsTask = {
    id: 'errors', title: 'Найдите 8 ошибок в черновике Марины Олеговны',
    lead: ui.brief({
      situation: 'Марина Олеговна прислала письмо: «Я тоже нарисовала, в Visio, посмотрела ролики. Вот. По-моему, всё правильно». Вера: «Ошибок восемь. Найдите все — и объясните Марине Олеговне по-доброму, она старалась».',
      todo: ['Нажмите на элемент, в котором (или из которого) ошибка, и выберите, в чём она.', 'Если отметили зря — выберите «Здесь нет ошибки».', 'Нажмите «Проверить». Засчитывается от 75 %: верная причина — 1 балл, ошибка найдена, но причина не та — 0,5, лишняя отметка — минус 0,5.'],
      look: 'Пройдите по чек-листу: границы пулов, имена задач, имена событий, вопросы шлюзов, пары «разветвление — слияние», входы и выходы у каждого элемента, единый уровень детализации.'
    }),
    blank: () => ({ m: {} }),
    reference: () => ({ m: Object.fromEntries(Object.keys(E_ERR).map(id => [id, E_ERR[id].k])) }),
    render(el, ctx) {
      el.classList.add('m3b1-root');
      const a = ctx.ans; a.m = a.m || {};
      const rv = !!(ctx.result || ctx.readonly);
      let sel = null;
      el.innerHTML = `<div class="stack">${ui.say('marina', 'Я тоже нарисовала, в Visio. По-моему, всё правильно — посмотрите, пожалуйста.')}<div data-d></div><div class="m3b1-panel" data-p></div></div>`;
      const conf = () => {
        const c = E_CFG(); c.hl = {}; c.selected = sel;
        c.nodes = c.nodes.map(n => a.m[n.id] ? Object.assign({}, n, { badge: '!' }) : n);
        Object.keys(a.m).forEach(id => { if (!a.m[id]) return; c.hl[id] = rv ? (E_ERR[id] ? (a.m[id] === E_ERR[id].k ? 'ok' : 'warn') : 'bad') : 'warn'; });
        if (ctx.readonly) Object.keys(E_ERR).forEach(id => { if (!a.m[id]) c.hl[id] = 'info'; });
        c.onClick = id => { if (ctx.readonly) return; sel = id; d.redraw(conf()); panel(); };
        return c;
      };
      const d = diagram(TR.$('[data-d]', el), conf());
      function panel() {
        const p = TR.$('[data-p]', el), r = errEval(a.m);
        const marked = Object.keys(a.m).filter(id => a.m[id]);
        let h = `<div class="m3b1-lbl">Отмечено: ${marked.length}</div>`;
        if (sel && !ctx.readonly) h += `<h4>${esc(E_NAME(sel))}: в чём ошибка?</h4><div class="m3b1-picks">${E_RS.map(x => `<button type="button" class="chip" data-r="${x.v}" aria-pressed="${a.m[sel] === x.v}">${esc(x.t)}</button>`).join('')}<button type="button" class="chip" data-r="" aria-pressed="${!a.m[sel]}">Здесь нет ошибки</button></div>`;
        else if (!ctx.readonly) h += '<div class="small dim">Нажмите на элемент диаграммы.</div>';
        if (rv) {
          h += `<ul class="checks">${marked.map(id => E_ERR[id] ? `<li class="${a.m[id] === E_ERR[id].k ? 'ok' : 'warn'}"><b>${esc(E_NAME(id))}</b>${a.m[id] === E_ERR[id].k ? '' : ` — ошибка есть, но другая: «${esc(E_RS.find(x => x.v === E_ERR[id].k).t)}»`}. ${esc(E_ERR[id].why)}</li>` : `<li class="bad"><b>${esc(E_NAME(id))}</b> — здесь ошибки нет. ${esc(E_OK[id] || '')}</li>`).join('')}</ul>`;
          if (ctx.readonly) h += `<ul class="checks">${r.miss.map(id => `<li class="info"><b>${esc(E_NAME(id))}</b>: ${esc(E_ERR[id].why)}</li>`).join('')}</ul>`;
          else if (r.miss.length) h += ui.note('info', `Не найдено: ${r.miss.length}`, `Ищите по категориям: ${[...new Set(r.miss.map(id => E_RS.find(x => x.v === E_ERR[id].k).t.toLowerCase()))].join('; ')}.`);
        }
        p.innerHTML = h;
      }
      TR.on(el, 'click', '[data-r]', (e, b) => { if (!sel) return; if (b.dataset.r) a.m[sel] = b.dataset.r; else delete a.m[sel]; ctx.save(); d.redraw(conf()); panel(); });
      panel();
    },
    check(ans) {
      const r = errEval(ans && ans.m), notes = [];
      notes.push({ ok: r.found.length >= 6, html: `Найдено с верной причиной: ${r.found.length} из 8${r.half.length ? `, ещё ${r.half.length} — с другой причиной` : ''}.` });
      r.found.forEach(id => notes.push({ ok: true, html: `${esc(E_NAME(id))}: ${esc(E_ERR[id].why)}` }));
      r.half.forEach(id => notes.push({ ok: 'warn', html: `${esc(E_NAME(id))}: ошибка здесь есть, но причина другая. Подумайте ещё.` }));
      r.fp.forEach(id => notes.push({ ok: false, html: `${esc(E_NAME(id))} — здесь всё правильно. ${esc(E_OK[id] || '')}` }));
      if (r.miss.length) notes.push({ ok: false, html: `Не найдено ошибок: ${r.miss.length}. Пройдитесь по чек-листу из подсказки.` });
      return { ok: r.score >= 0.75, score: r.score, notes, summary: `Найдено ${r.found.length} из 8, баллы ${Math.round(r.score * 100)} %.`,
        mentor: r.miss.includes('e_join') ? 'Самая коварная ошибка — слияние. Ромбы похожи, но «исключающее ИЛИ» после «И» пропускает оба токена: «Записать клиента» случится дважды. Прогоните токен пальцем.' : r.miss.includes('e_call') ? 'Посмотрите на границу между пулами: какая линия её пересекает? Сплошная стрелка там невозможна.' : null };
    },
    explain: `<p>Восемь ошибок — восемь пунктов чек-листа ревью BPMN, которые стоит держать в голове:</p>
      <ol><li>Между пулами — только поток сообщений.</li><li>Задача — глагол + объект.</li><li>Шлюз — вопрос, выходы подписаны.</li><li>Один уровень детализации, без кликов и кнопок.</li><li>Разветвление и слияние — одного типа.</li><li>Конечное событие — результат, а не действие.</li><li>Из конечного события ничего не выходит.</li><li>У каждого элемента (кроме начала и конца) есть вход и выход.</li></ol>
      <p>Как говорить с Мариной Олеговной: начните с того, что у неё получилось (дорожки ролей, ветка отказа — честная и важная), затем — две-три главные правки с объяснением «зачем», а не «так положено». Заказчик, который сам рисует процесс, — подарок: он вовлечён.</p>
      <p class="small muted">Источники: Б. Сильвер, «BPMN Method and Style» — правила стиля и типичные ошибки; BPMN 2.0 (OMG), разделы 10.2 (события) и 10.5 (шлюзы); Я. Мендлинг и др., «Seven Process Modeling Guidelines (7PMG)».</p>`,
    report: ans => { const m = (ans && ans.m) || {}; return Object.keys(m).filter(id => m[id]).map(id => `${E_NAME(id)}: ${(E_RS.find(x => x.v === m[id]) || {}).t}${E_ERR[id] && E_ERR[id].k === m[id] ? '' : ' ✗'}`).join('\n') || '—'; }
  };

  // =====================================================================
  // Практика 4. Лаборатория: прогоните токен
  // =====================================================================
  const T_Q = [
    { id: 'a', q: 'Разветвление «И», слияние «исключающее ИЛИ». Сколько раз выполнится «Закрыть обращение в журнале»?', options: [
      { t: 'Один раз', why: 'XOR-слияние не ждёт: каждый из двух токенов проходит через него отдельно.' }, { t: 'Два раза', ok: true, why: 'Да: два токена после «И» — два прохода через XOR-слияние. В журнале две записи.' }, { t: 'Ни разу', why: 'Не ждёт — значит, не зависнет: пропустит оба.' }] },
    { id: 'b', q: 'Разветвление «исключающее ИЛИ», слияние «И». Что будет с процессом?', options: [
      { t: 'Завершится нормально', why: 'Слияние «И» ждёт токен со второго входа, а он туда не пошёл.' }, { t: 'Зависнет на слиянии «И»', ok: true, why: 'Да: «И» ждёт токен от «Проверить загрузку постов», которого нет. Обращение никогда не закроется.' }, { t: 'Выполнит обе ветки', why: 'XOR пропускает только одну ветку.' }] },
    { id: 'c', q: 'Ответ на «Время подошло?» — «нет». Сколько токенов дойдёт до «Клиент записан»?', options: [
      { t: 'Ни одного: токен уйдёт в «Обращение потеряно»', ok: true, why: 'Да. И это главная находка AS-IS: в процессе нет шага «перезвонить клиенту» — он просто уходит.' }, { t: 'Один', why: 'XOR отправил токен по ветке «нет» — до «Внести запись» он не доберётся.' }, { t: 'Два', why: 'Разветвление «И» стоит после «Внести запись» — в ветке «нет» его нет.' }] }
  ];
  const T_CONS = {
    'and-and': { k: 'ok', t: 'Всё как надо', d: 'Клиент знает время и адрес, мастер проверил посты, обращение закрыто один раз. Разветвление «И» и слияние «И» — пара.' },
    'and-xor': { k: 'bad', t: 'Дубли', d: '«Закрыть обращение в журнале» выполнилось дважды, «Клиент записан» — тоже. В отчёте Тимура Рашидовича записей больше, чем клиентов, а в «Искре Онлайн» такая ошибка создала бы две брони одного поста — и другой клиент услышал бы «мест нет».' },
    'xor-and': { k: 'bad', t: 'Зависание', d: 'Слияние «И» ждёт токен от мастера, но «исключающее ИЛИ» туда его не отправило. Обращение навсегда «в работе», а в системе висела бы запись в статусе «Новая».' },
    'xor-xor': { k: 'warn', t: 'Мастер не в курсе', d: 'Формально процесс закончился, но «исключающее ИЛИ» выбрало только «Сообщить время». Мастер не проверил посты: утром Елена приезжает, а пост занят — 40 минут ожидания и злой отзыв.' },
    'no': { k: 'warn', t: 'Обращение потеряно', d: 'При «нет» токен уходит в «Обращение потеряно». Это и есть 21 % звонков в часы пик: в AS-IS нет шага «перезвонить, когда освободится окно». Первая идея для TO-BE.' }
  };
  const tKey = a => (a.sc === 'no' ? 'no' : (a.g1 || 'and') + '-' + (a.g2 || 'and'));
  const tPick = sc => (id, o) => id === 'gw' ? o.find(f => f.to === (sc === 'no' ? 'no' : 'put')) : o[0];
  const tokenTask = {
    id: 'token', title: 'Лаборатория: прогоните токен по AS-IS',
    lead: ui.brief({
      situation: 'Глеб не верит на слово: «Я хочу видеть, что будет со звонком Елены, если шлюзы перепутать». Перед вами AS-IS в одном пуле. Шлюзы разветвления и слияния можно менять, ответ на «Время подошло?» — тоже.',
      todo: ['Выберите типы шлюзов и сценарий, прогоните токен по шагам («Шаг») или сразу («До конца»). Посмотрите последствия.', 'Попробуйте все четыре сочетания и сценарий «нет».', 'Ответьте на три вопроса и оставьте в диаграмме правильные шлюзы. Нажмите «Проверить». Засчитывается при верных шлюзах и хотя бы двух верных ответах из трёх.'],
      look: 'Жёлтый — токен ждёт на слиянии «И», синий — токен сейчас здесь, зелёный — где токен уже побывал, красный — конечное событие сработало повторно.'
    }),
    blank: () => ({ g1: 'xor', g2: 'xor', sc: 'yes', q: {}, tried: [] }),
    reference: () => ({ g1: 'and', g2: 'and', sc: 'yes', q: { a: [1], b: [1], c: [0] }, tried: ['and-and', 'and-xor', 'xor-and', 'xor-xor', 'no'] }),
    render(el, ctx) {
      el.classList.add('m3b1-root');
      const a = ctx.ans; a.q = a.q || {}; a.tried = a.tried || []; a.g1 = a.g1 || 'xor'; a.g2 = a.g2 || 'xor'; a.sc = a.sc || 'yes';
      const rv = !!(ctx.result || ctx.readonly);
      el.innerHTML = `<div class="stack">
        <div class="m3b1-set">
          <span>Разветвление после «Внести запись»</span>${ui.seg('g1', [{ v: 'xor', t: '«исключающее ИЛИ»' }, { v: 'and', t: '«И»' }], a.g1, 'sm')}
          <span>Слияние перед «Закрыть обращение»</span>${ui.seg('g2', [{ v: 'xor', t: '«исключающее ИЛИ»' }, { v: 'and', t: '«И»' }], a.g2, 'sm')}
          <span>Ответ на «Время подошло?»</span>${ui.seg('sc', [{ v: 'yes', t: 'да' }, { v: 'no', t: 'нет (час пик)' }], a.sc, 'sm')}
        </div>
        <div data-d></div>
        <div class="m3b1-ctl"><button type="button" class="btn primary sm" data-a="step">Шаг ▶</button><button type="button" class="btn sm" data-a="run">До конца ⏩</button><button type="button" class="btn ghost sm" data-a="reset">Сначала ↺</button><span class="small dim" data-s></span></div>
        <div class="m3b1-two"><div class="m3b1-log" data-l></div><div data-c></div></div>
        <div class="small dim" data-t></div>
        <div class="m3b1-lbl">Вопросы Глеба</div><div data-q></div>
      </div>`;
      if (ctx.readonly) TR.$$('[data-seg] button', el).forEach(b => { b.disabled = true; });
      let sim, d;
      function reset() { sim = makeSim(asis1(a.g1, a.g2), tPick(a.sc)); if (!d) d = diagram(TR.$('[data-d]', el), withLook(asis1(a.g1, a.g2), sim.look())); show(); }
      function show() {
        d.redraw(withLook(asis1(a.g1, a.g2), sim.look()));
        TR.$('[data-l]', el).innerHTML = sim.st.log.slice().reverse().map(x => `<div class="${x.k}">${esc(x.t)}</div>`).join('');
        TR.$('[data-s]', el).textContent = `Шаг ${sim.st.step} · токенов: ${sim.st.tokens.length}${sim.st.done ? ' · завершён' : sim.st.stuck ? ' · завис' : ''}`;
        const fin = sim.st.done || sim.st.stuck, c = T_CONS[tKey(a)];
        TR.$('[data-c]', el).innerHTML = fin ? `<div class="m3b1-cons ${c.k}"><b>Последствие: ${esc(c.t)}</b><div>${esc(c.d)}</div></div>` : '<div class="m3b1-cons"><div class="small dim">Доведите токен до конца — здесь появится последствие для «Искры».</div></div>';
        if (fin && !ctx.readonly && !a.tried.includes(tKey(a))) { a.tried.push(tKey(a)); ctx.save(); }
        TR.$('[data-t]', el).textContent = `Опробовано: ${a.tried.length} из 5 вариантов (4 сочетания шлюзов + сценарий «нет»).`;
      }
      ui.onSeg(el, (g, v) => { if (ctx.readonly || !['g1', 'g2', 'sc'].includes(g)) return; a[g] = v; ctx.save(); reset(); });
      TR.on(el, 'click', '[data-a]', (e, b) => { if (b.dataset.a === 'step') sim.step(); else if (b.dataset.a === 'run') sim.run(); else { reset(); return; } show(); });
      reset();
      const qh = TR.$('[data-q]', el);
      T_Q.forEach(q => { const box = document.createElement('div'); qh.appendChild(box); ui.quiz(box, { q: q.q, options: q.options, value: a.q[q.id] || [], readonly: ctx.readonly, reveal: rv || null, onChange: v => { a.q[q.id] = v; ctx.save(); } }); });
    },
    check(ans) {
      const a = ans || {}, q = a.q || {}, notes = [];
      const cfgOk = a.g1 === 'and' && a.g2 === 'and';
      const sim = makeSim(asis1(a.g1 || 'xor', a.g2 || 'xor'), tPick('yes')).run();
      const logN = sim.fired.log || 0;
      notes.push(cfgOk ? { ok: true, html: 'Шлюзы — пара «И» / «И»: обе ветки выполняются, слияние дожидается обеих, обращение закрывается один раз.' }
        : { ok: false, html: `Сейчас в диаграмме ${a.g1 === 'and' ? '«И»' : '«исключающее ИЛИ»'} → ${a.g2 === 'and' ? '«И»' : '«исключающее ИЛИ»'}: ${sim.stuck ? 'процесс зависает на слиянии' : logN > 1 ? '«Закрыть обращение» выполняется ' + logN + ' раза' : 'мастер не узнаёт о записи'}. ${esc(T_CONS[(a.g1 || 'xor') + '-' + (a.g2 || 'xor')].d)}` });
      let qs = 0;
      T_Q.forEach((x, i) => { const r = ui.quizScore(x, q[x.id]).ok; if (r) qs++; else notes.push({ ok: false, html: `Вопрос ${i + 1}: ${esc(x.options.find(o => o.ok).why)}` }); });
      notes.push({ ok: qs >= 2, html: `Верных ответов: ${qs} из 3.` });
      const tried = (a.tried || []).length;
      if (tried < 3) notes.push({ ok: 'warn', html: `Опробовано вариантов: ${tried} из 5. Посмотрите и неправильные сочетания — на ревью вы будете узнавать их по последствиям.` });
      const score = (cfgOk ? 0.4 : 0) + 0.2 * qs;
      return { ok: cfgOk && qs >= 2, score, notes, summary: `Шлюзы ${cfgOk ? 'верны' : 'не верны'}, вопросы ${qs}/3.`,
        mentor: !cfgOk && a.g1 === 'and' ? 'Разветвление верное, а слияние — посмотрите, что оно делает с двумя токенами. Открыли «И» — закройте «И».' : null };
    },
    explain: `<p>Главные выводы лаборатории:</p>
      <ul><li><b>«И» → «И»</b> — правильная пара для параллельной работы: оба участника сделали своё, процесс закрылся один раз.</li>
      <li><b>«И» → «исключающее ИЛИ»</b> — дубли: всё после слияния выполняется столько раз, сколько было веток. В системе это двойные записи, двойные SMS, двойные списания.</li>
      <li><b>«исключающее ИЛИ» → «И»</b> — зависание: слияние ждёт ветку, в которую никто не пошёл.</li>
      <li><b>«исключающее ИЛИ» → «исключающее ИЛИ»</b> — синтаксически чисто, но по смыслу потеряна работа: мастер не узнал о записи.</li></ul>
      <p>Сценарий «нет» показал главную боль AS-IS: потерянное обращение — это конечное событие, а не ветка «перезвонить». В TO-BE её заменит онлайн-запись со свободными слотами и лист ожидания. Тестировщица Лиза делает ровно то же, что вы сейчас: один путь токена — один тест-кейс.</p>
      <p class="small muted">Источники: BPMN 2.0 (OMG), раздел 13 «BPMN Execution Semantics»; Б. Сильвер, «BPMN Method and Style», гл. о шлюзах; В. ван дер Аалст — свойство «soundness» модели процесса (нет зависаний и «лишних» токенов).</p>`,
    report: ans => { const a = ans || {}; return `Шлюзы: ${a.g1} → ${a.g2}; опробовано: ${(a.tried || []).join(', ') || '—'}; ответы: ${T_Q.map(x => ui.quizScore(x, (a.q || {})[x.id]).ok ? '✓' : '✗').join(' ')}`; }
  };

  // =====================================================================
  // Практика 5. Ответ Марине Олеговне своими словами
  // =====================================================================
  const M_RUBRIC = [
    'Объясняет, что AS-IS — общая картина того, как работают сейчас, и основа для TO-BE (сначала понять, потом менять)',
    'Называет конкретную находку: ветка «нет» у вопроса «Время подошло?» ведёт в «Обращение потеряно» — это 21 % звонков в часы пик',
    'Показывает пользу дорожек: передачи оператор → станция и мастер → клиент (вечерний список, звонок накануне) — места, где теряется информация',
    'Говорит простым языком и с уважением к опыту Марины Олеговны, без лекции о нотации',
    'Предлагает следующий шаг: проверить диаграмму вместе, дополнить исключения и в среду обсудить TO-BE'
  ];
  const M_REF = 'Марина Олеговна, вы правы — процесс вы знаете лучше всех, и диаграмма нужна не вам, а всем остальным: команде «Орбиты», Тимуру Рашидовичу, разработчикам. Это общая картина того, как запись работает сейчас, и без неё мы не договоримся, что менять. Смотрите, что она уже показала. Когда окна нет, оператор говорит «перезвоните позже» — и всё, обращение закончилось. На диаграмме это отдельный исход «Обращение потеряно», и в часы пик туда уходит 21 % звонков: в процессе просто нет шага «перезвонить клиенту». Второе — передачи между людьми: вечером оператор отправляет список по почте, утром вы сверяете посты, накануне мастер звонит клиенту. Каждая такая передача — место, где что-то теряется, и как раз это «Искра Онлайн» может взять на себя. Давайте так: я распечатаю диаграмму, вы за пятнадцать минут поправите, где я ошибся и какие исключения забыл, а в среду мы вместе нарисуем, как будет с онлайн-записью.';
  const marinaTask = {
    id: 'marina', title: 'Ответ Марине Олеговне: «Зачем мне ваши кружочки?»',
    lead: ui.brief({
      situation: 'На созвоне Марина Олеговна смотрит на диаграмму и вздыхает: «Зачем мне ваши кружочки и стрелочки? Я пятнадцать лет на приёмке, я и так знаю, как мы записываем». Вера кивает вам: «Ответьте вы — вы рисовали».',
      todo: ['Ответьте своими словами: 5–8 предложений, от 300 символов.', 'Опирайтесь на сегодняшнее: что показали развилки, дорожки и прогон токена.', 'Нажмите «Проверить с Верой (Claude)» или «Сверить с эталоном самому» и отметьте пункты, которые у вас есть. Затем «Проверить». Засчитывается от 60 %.'],
      look: 'Не спорьте с опытом Марины Олеговны — опирайтесь на него. Диаграмма нужна не ей, а всем остальным, и её же просят проверить диаграмму.'
    }),
    blank: () => ({ j: {} }),
    reference: () => ({ j: { text: M_REF, self: M_RUBRIC.map(() => true) } }),
    render(el, ctx) {
      el.classList.add('m3b1-root');
      const a = ctx.ans; a.j = a.j || {};
      el.innerHTML = ui.say('marina', 'Зачем мне ваши кружочки и стрелочки? Я пятнадцать лет на приёмке, я и так знаю, как мы записываем.') + ui.say('vera', 'Ответьте вы — вы рисовали. Коротко, по-человечески и с примерами из диаграммы.') + '<div style="margin-top:12px"></div>';
      const j = document.createElement('div'); el.appendChild(j);
      ui.justify(j, {
        id: 'm3b1-marina', q: 'Ответ Марине Олеговне: зачем нужна диаграмма AS-IS «Запись по телефону»?', placeholder: 'Марина Олеговна, …',
        qPlain: 'Управляющая станцией автосервиса «Искра» с 15-летним опытом не понимает, зачем рисовать BPMN-диаграмму текущего процесса записи по телефону (клиент → оператор колл-центра → мастер-приёмщик). На диаграмме видно: если свободного времени нет, обращение теряется (21 % звонков в часы пик теряются); запись передаётся на станцию вечерним списком по почте; мастер накануне звонит клиенту. Объясните ей простыми словами, зачем диаграмма и что дальше.',
        rubric: M_RUBRIC, reference: M_REF, value: a.j, readonly: ctx.readonly, minLen: 300,
        onChange: v => { a.j = v; ctx.save(); ctx.decide('Ответ Марине Олеговне о пользе AS-IS', v.text || ''); }
      });
    },
    check(ans) {
      const j = (ans && ans.j) || {}, s = ui.justifyScore(j), t = (j.text || '').trim(), n = TR.norm(t), notes = [];
      if (t.length < 300) notes.push({ ok: false, html: `Ответ короче 300 символов (${t.length}).` });
      if (!(j.ai || j.self)) notes.push({ ok: false, html: 'Проверьте ответ: «Проверить с Верой» или «Сверить с эталоном самому» — и отметьте пункты.' });
      else if (s < 0.6) notes.push({ ok: false, html: 'Пока мало пунктов. Что показала ветка «нет»? Что видно по дорожкам? Что вы предлагаете сделать дальше?' });
      else notes.push({ ok: true, html: `Ответ: ${Math.round(s * 100)} %.` });
      if (t.length >= 300 && !/21|потер|теря/.test(n)) notes.push({ ok: 'warn', html: 'Не прозвучала главная находка — потерянные обращения. Цифра 21 % убеждает лучше любой нотации.' });
      if (t.length >= 300 && /(токен|шлюз|пул|xor|and)/.test(n)) notes.push({ ok: 'warn', html: 'Для Марины Олеговны термины лишние: «токен», «шлюз», «пул» лучше заменить на «звонок», «развилка», «участник».' });
      return { ok: s >= 0.6 && t.length >= 300, score: s, notes };
    },
    explain: `<p>Сильный ответ держится на трёх опорах: <b>диаграмма нужна не только ей</b> (общий язык для «Искры» и «Орбиты»), <b>конкретная находка</b> (потерянные обращения при «нет», 21 %) и <b>приглашение к работе</b> (проверить и дополнить). Скептичный эксперт становится союзником, когда видит, что его знание стало видимым и ценным, а не что его «учат рисовать».</p>
      <p>Чего избегать: лекции о стандарте OMG, слов «токен» и «шлюз», обещаний «приложение всё решит». И не защищайте диаграмму как «правильную» — попросите найти в ней ошибки.</p>
      <p class="small muted">Источники: BABOK v3, техника 10.35 «Process Modelling» и 10.43 «Reviews»; К. Вигерс, Дж. Битти, «Разработка требований к программному обеспечению» — работа с представителями пользователей.</p>`,
    report: ans => `Ответ Марине Олеговне: ${(ans && ans.j && ans.j.text) || '—'}`
  };

  // =====================================================================
  TR.stage({
    id: ID,
    when: 'понедельник, 21 декабря, 10:00 · процесс записи «как есть»',
    intro: [
      { who: 'vera', html: 'Доброе утро! Сегодня рисуем, как «Искра» записывает клиентов <b>сейчас</b> — по телефону, через колл-центр. Прежде чем улучшать процесс, его надо увидеть целиком: кто что делает, где развилки, где теряются звонки.' },
      { who: 'artem', html: 'Тимур Рашидович на кик-оффе сказал: «теряем каждый пятый звонок». Хочу понять, где именно. И в среду — показать, как будет с приложением.' },
      { who: 'gleb', html: 'Только давайте нормальную нотацию, а не квадратики в PowerPoint. Я потом по этой схеме статусы буду делать.' },
      { who: 'vera', html: 'BPMN — то, что нужно: одна картинка, которую прочитают и Марина Олеговна, и Глеб. Начнём с азбуки, а потом прогоним по диаграмме звонок Елены.' }
    ],
    facts: ['F-calls', 'F-excel', 'F-noshow'],
    glossary: [
      { term: 'BPMN', simple: 'Стандартный язык схем для бизнес-процессов: кружки, прямоугольники, ромбы, полосы.', tech: 'Business Process Model and Notation 2.0 — стандарт OMG (2011), ISO/IEC 19510:2013.' },
      { term: 'AS-IS и TO-BE', simple: 'Как работают сейчас — и как будут работать после изменений.', tech: 'Модели текущего и целевого состояния процесса; разница между ними — объём изменений (BABOK v3, анализ текущего и будущего состояния).' },
      { term: 'Пул (pool)', simple: '«Бассейн» одного участника: организации, клиента, внешней системы.', tech: 'Графическое представление участника (participant) в диаграмме взаимодействия (collaboration); содержит процесс участника или изображается «чёрным ящиком».' },
      { term: 'Дорожка (lane)', simple: 'Полоса внутри пула для роли: оператор, мастер.', tech: 'Подраздел пула для группировки элементов по исполнителям; поток управления между дорожками разрешён.' },
      { term: 'Событие', simple: 'То, что случилось: начало, ожидание, конец.', tech: 'Event — круг; начальное (тонкая обводка), промежуточное (двойная), конечное (толстая); маркер — триггер или результат (сообщение, таймер…).' },
      { term: 'Задача', simple: 'Одна работа, которую дальше не дробят.', tech: 'Task — атомарное действие; типы: пользовательская, сервисная, ручная, отправка, получение, скрипт, бизнес-правило.' },
      { term: 'Шлюз XOR', simple: 'Развилка «одно из»: идём ровно по одному пути.', tech: 'Exclusive gateway: на разветвлении — один выход по условию (есть путь по умолчанию), на слиянии — без синхронизации.' },
      { term: 'Шлюз AND', simple: 'Развилка «всё сразу» и встреча «ждём всех».', tech: 'Parallel gateway: разветвление во все выходы, слияние с синхронизацией всех входов.' },
      { term: 'Поток управления', simple: 'Сплошная стрелка: что за чем делают внутри одного участника.', tech: 'Sequence flow — порядок выполнения внутри пула; по нему движется токен.' },
      { term: 'Поток сообщений', simple: 'Пунктир: обмен «весточками» между участниками.', tech: 'Message flow — обмен сообщениями между пулами; не может соединять элементы одного пула.' },
      { term: 'Объект данных и хранилище', simple: 'Документ в процессе и место, где данные живут долго.', tech: 'Data object — данные в рамках экземпляра процесса; data store — персистентное хранилище; связываются ассоциациями.' },
      { term: 'Токен', simple: 'Воображаемая фишка, которая показывает, где сейчас процесс.', tech: 'Абстракция семантики выполнения BPMN: создаётся начальным событием, потребляется конечным; шлюзы управляют числом токенов.' }
    ],
    outro: 'AS-IS готов и прогнан токеном: теперь видно, где теряется каждый пятый звонок (ветка «нет» без перезвона) и где теряется информация (вечерний список по почте, звонок накануне). Марина Олеговна обещала поправить черновик до среды. В среду — TO-BE самого больного места: согласования доп. работ, где машина стоит на подъёмнике 1 ч 40 мин. Понадобятся таймеры, сообщения и граничные события.',
    tasks: [howBasics, howFlows, howGw, partsTask, buildTask, errorsTask, tokenTask, marinaTask]
  });
})();
