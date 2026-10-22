/* Модуль 1, занятие 5: работа системного аналитика с QA.
   Сквозная задача — ISK-112 «Отмена записи клиентом» (BR-3, BR-4, BR-2) глазами тестировщицы Лизы.
   Теория: роль QA и проверяемое требование (детектор размытых слов на живом тексте, Дано/Когда/Тогда, чек-лист
   и тест-кейс, где QA в процессе — shift-left); классы эквивалентности и граничные значения (ось BR-3 с ползунком
   и четырьмя версиями кода Глеба: какую ошибку ловит 3:01, 3:00 и 2:59; классы BR-2); баг-репорт, серьёзность и
   приоритет, «баг или фича» (дерево решения), жизненный цикл дефекта и регресс.
   Практика: переписать 6 непроверяемых требований (редактор с живыми признаками); набор тестовых точек для BR-3
   и BR-2 на числовой оси; триаж 8 баг-репортов (дефект кода / требований / не баг, серьёзность, приоритет);
   лаборатория «Лиза гоняет сборку по вашим критериям» — конструктор сценариев Дано/Когда/Тогда и последствия
   пропущенных дефектов; ответ Артёму своими словами. */
'use strict';
(function () {
  const TR = window.TR, ui = TR.ui, esc = TR.esc;
  const ID = 'm1-qa';

  if (!document.getElementById('mqa-css')) document.head.insertAdjacentHTML('beforeend', `<style id="mqa-css">
    .mqa-root, .mqa-root .stack > * { min-width: 0; }
    .mqa-root .seg button { white-space: normal; text-align: left; }
    .mqa-root .chip { white-space: normal; text-align: left; max-width: 100%; }
    .mqa-lbl { font: 600 10.5px/1.3 var(--f-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--text-muted); }
    .mqa-two { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr); gap: 16px; align-items: start; }
    .mqa-two > * { min-width: 0; }
    .mqa-panel { border: 1px solid var(--border-strong); border-radius: 12px; padding: 12px 14px; background: var(--surface); display: grid; gap: 10px; font-size: 14px; }
    .mqa-panel h4 { font: 700 16px/1.3 var(--f-brand); margin: 0; }
    .mqa-ex { border-left: 3px solid var(--accent); background: var(--surface-2); border-radius: 0 8px 8px 0; padding: 8px 12px; font-size: 14px; }
    .mqa-bad { border: 1px solid var(--bad); background: var(--bad-soft); border-radius: 10px; padding: 8px 12px; font-size: 14px; }
    .mqa-good { border: 1px solid var(--ok); background: var(--ok-soft); border-radius: 10px; padding: 8px 12px; font-size: 14px; }
    .mqa-list { display: grid; gap: 6px; }
    .mqa-it { display: grid; grid-template-columns: minmax(0, 1fr); gap: 2px; text-align: left; border: 1px solid var(--border); background: var(--surface); color: var(--text); border-radius: 10px; padding: 8px 10px; font-size: 14px; line-height: 1.35; width: 100%; }
    .mqa-it small { color: var(--text-muted); font-size: 12px; }
    .mqa-it[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); }
    .mqa-kv { display: grid; grid-template-columns: 130px minmax(0, 1fr); gap: 4px 12px; font-size: 14px; }
    .mqa-kv > span:nth-child(odd) { font: 600 10.5px/1.8 var(--f-mono); letter-spacing: .05em; text-transform: uppercase; color: var(--text-muted); }
    .mqa-chips { display: flex; flex-wrap: wrap; gap: 6px; }
    .mqa-gh { font: 13.5px/1.6 var(--f-mono); background: var(--surface-2); border: 1px solid var(--border); border-radius: 10px; padding: 8px 12px; white-space: pre-wrap; overflow-wrap: anywhere; }
    .mqa-gh b { color: var(--accent); }
    .mqa-mark { background: var(--warn-soft); border-bottom: 2px solid var(--warn); border-radius: 3px; padding: 0 2px; }
    .mqa-stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; }
    .mqa-stats .stat .v { font-size: 17px; }
    /* ось */
    .mqa-axis { position: relative; height: 54px; margin: 6px 8px 0; }
    .mqa-axis .ln { position: absolute; left: 0; right: 0; top: 22px; height: 8px; border-radius: 99px; display: flex; overflow: hidden; }
    .mqa-axis .ln i { display: block; height: 100%; }
    .mqa-axis .ln i.no { background: color-mix(in srgb, var(--text-muted) 40%, var(--surface-2)); }
    .mqa-axis .ln i.late { background: color-mix(in srgb, var(--bad) 55%, var(--surface-2)); }
    .mqa-axis .ln i.free { background: color-mix(in srgb, var(--ok) 55%, var(--surface-2)); }
    .mqa-axis .pt { position: absolute; top: 14px; width: 4px; height: 24px; margin-left: -2px; background: var(--text); border-radius: 2px; }
    .mqa-axis .pt.sel { background: var(--accent); width: 6px; margin-left: -3px; }
    .mqa-axis .pl { position: absolute; top: 40px; transform: translateX(-50%); font: 600 10.5px/1.2 var(--f-mono); color: var(--text-2); white-space: nowrap; }
    .mqa-axis .pl.up { top: 0; }
    .mqa-axis .pl.l { transform: translateX(-100%); } .mqa-axis .pl.r { transform: none; }
    .mqa-axis .cur { position: absolute; top: 10px; width: 16px; height: 32px; margin-left: -8px; border-radius: 8px; border: 3px solid var(--accent); background: var(--surface); }
    .mqa-rng { display: grid; grid-template-columns: 150px minmax(0, 1fr); gap: 10px; align-items: center; font-size: 14px; }
    .mqa-tb { width: 100%; border-collapse: collapse; font-size: 13.5px; }
    .mqa-tb td, .mqa-tb th { border-bottom: 1px solid var(--border); padding: 5px 6px; text-align: left; }
    .mqa-tb th { font: 600 10.5px/1.3 var(--f-mono); text-transform: uppercase; color: var(--text-muted); }
    .mqa-tb .ok { color: var(--ok); font-weight: 700; } .mqa-tb .bad { color: var(--bad); font-weight: 700; }
    /* матрица и дерево */
    .mqa-mx { display: grid; grid-template-columns: 34px minmax(0, 1fr) minmax(0, 1fr); gap: 6px; align-items: stretch; }
    .mqa-mx .ax { font: 600 10.5px/1.2 var(--f-mono); color: var(--text-muted); text-transform: uppercase; display: grid; place-items: center; text-align: center; }
    .mqa-mx .ax.v { writing-mode: vertical-rl; transform: rotate(180deg); }
    .mqa-cell { border: 1px solid var(--border); border-radius: 10px; padding: 8px 10px; background: var(--surface); color: var(--text); text-align: left; font-size: 13px; line-height: 1.35; min-width: 0; }
    .mqa-cell[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); }
    .mqa-cell b { display: block; font-size: 11px; font-family: var(--f-mono); text-transform: uppercase; color: var(--text-muted); margin-bottom: 2px; }
    .mqa-tree { display: grid; gap: 8px; }
    .mqa-q { border: 1px solid var(--border); border-radius: 10px; padding: 8px 12px; background: var(--surface); display: grid; gap: 6px; font-size: 14px; }
    .mqa-q.dim { opacity: .45; }
    .mqa-flow { display: flex; flex-wrap: wrap; gap: 4px 6px; align-items: center; font-size: 13px; }
    .mqa-flow .chip { white-space: normal; }
    /* практика */
    .mqa-rw { border: 1px solid var(--border); border-radius: 12px; padding: 10px 12px; background: var(--surface); display: grid; gap: 8px; }
    .mqa-rw.ok { border-color: var(--ok); } .mqa-rw.bad { border-color: var(--bad); } .mqa-rw.warn { border-color: var(--warn); }
    .mqa-rw .orig { font-size: 14.5px; }
    .mqa-rw textarea { width: 100%; min-height: 76px; }
    .mqa-ft { display: flex; flex-wrap: wrap; gap: 5px; }
    .mqa-pts { display: grid; gap: 6px; }
    .mqa-pr { display: grid; grid-template-columns: 170px minmax(0, 1fr); gap: 8px; align-items: center; border: 1px solid var(--border); border-radius: 10px; padding: 6px 10px; background: var(--surface); font-size: 13.5px; }
    .mqa-pr.ok { border-color: var(--ok); } .mqa-pr.bad { border-color: var(--bad); } .mqa-pr.warn { border-color: var(--warn); }
    .mqa-pr .why { grid-column: 1 / -1; font-size: 12.5px; color: var(--text-2); }
    .mqa-tg { display: flex; gap: 8px; align-items: center; text-align: left; background: none; border: 0; color: var(--text); padding: 0; font-size: 13.5px; }
    .mqa-tg .bx { width: 18px; height: 18px; border-radius: 4px; border: 2px solid var(--border-strong); flex: none; }
    .mqa-tg[aria-pressed="true"] .bx { background: var(--accent); border-color: var(--accent); box-shadow: inset 0 0 0 2px var(--surface); }
    .mqa-tg:disabled { opacity: 1; cursor: default; }
    .mqa-bug { border: 1px solid var(--border); border-radius: 12px; padding: 10px 12px; background: var(--surface); display: grid; gap: 8px; }
    .mqa-bug.ok { border-color: var(--ok); } .mqa-bug.bad { border-color: var(--bad); } .mqa-bug.warn { border-color: var(--warn); }
    .mqa-bug .hd { display: flex; gap: 8px; flex-wrap: wrap; align-items: baseline; }
    .mqa-bug .hd b { font: 600 14.5px/1.35 var(--f-brand); }
    .mqa-bug .sel { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
    .mqa-bug select { width: 100%; font-size: 13px; padding: 4px 8px; }
    .mqa-why { font-size: 13px; color: var(--text-2); border-top: 1px dashed var(--border); padding-top: 6px; }
    .mqa-sc { border: 1px solid var(--border); border-radius: 12px; padding: 10px 12px; background: var(--surface); display: grid; gap: 8px; }
    .mqa-sc.ok { border-color: var(--ok); } .mqa-sc.bad { border-color: var(--bad); } .mqa-sc.warn { border-color: var(--warn); }
    .mqa-sc .row2 { display: grid; grid-template-columns: 70px minmax(0, 1fr); gap: 8px; align-items: center; font-size: 13.5px; }
    .mqa-sc select { width: 100%; font-size: 13px; padding: 4px 8px; }
    .mqa-res { border: 2px solid var(--border-strong); border-radius: 14px; padding: 12px 14px; background: var(--surface-2); display: grid; gap: 10px; }
    .mqa-tl { display: grid; gap: 6px; }
    .mqa-ev { display: grid; grid-template-columns: 96px minmax(0, 1fr); gap: 10px; border: 1px solid var(--border); border-left: 4px solid var(--border-strong); border-radius: 10px; padding: 7px 12px; background: var(--surface); font-size: 14px; }
    .mqa-ev.ok { border-left-color: var(--ok); } .mqa-ev.bad { border-left-color: var(--bad); } .mqa-ev.warn { border-left-color: var(--warn); } .mqa-ev.info { border-left-color: var(--info); }
    .mqa-ev .t { font: 600 12px/1.6 var(--f-mono); color: var(--text-muted); }
    @media (max-width: 860px) { .mqa-two { grid-template-columns: minmax(0, 1fr); } }
    @media (max-width: 620px) {
      .mqa-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .mqa-kv, .mqa-rng, .mqa-pr { grid-template-columns: minmax(0, 1fr); gap: 4px; }
      .mqa-bug .sel { grid-template-columns: minmax(0, 1fr); }
      .mqa-ev { grid-template-columns: minmax(0, 1fr); gap: 2px; }
      .mqa-sc .row2 { grid-template-columns: minmax(0, 1fr); gap: 2px; }
      .mqa-mx { grid-template-columns: 24px minmax(0, 1fr) minmax(0, 1fr); }
    }
  </style>`);

  const interview = items => `<details class="more"><summary>Как об этом спрашивают на собеседовании</summary><div><ul class="checks">${items.map(x => `<li class="info"><b>${x[0]}</b> ${x[1]}</li>`).join('')}</ul></div></details>`;
  const mistakes = items => ui.note('warn', 'Типичные ошибки', `<ul class="checks">${items.map(x => `<li class="bad">${x}</li>`).join('')}</ul>`);
  const st = (k, v, cls, s) => `<div class="stat"><span class="k">${k}</span><span class="v ${cls || ''}">${v}</span><span class="s">${s}</span></div>`;
  const chip = (t, k) => `<span class="chip ${k || ''}">${t}</span>`;
  const VAGUE = ['удобн', 'быстр', 'корректн', 'по возможност', 'своевременн', 'интуитивн', 'при необходимост', 'и т д', 'и т.д', 'обычно', 'как правило', 'по ситуации', 'достаточно', 'оптимальн', 'понятн', 'надежн', 'санкци'];
  const vagueIn = t => { const n = TR.norm(t); return VAGUE.filter(w => n.includes(w)); };

  // =====================================================================
  // Теория 1. Роль QA и проверяемое требование
  // =====================================================================
  const PHR = [
    { t: 'Отмена записи должна быть удобной.', q: 'Удобной — это как? Я не могу нажать на «удобно» и получить «да» или «нет».', fix: 'Отмена — из карточки записи в «Моих записях», не больше двух касаний, перед отменой — окно подтверждения.', crit: 'Измеримость' },
    { t: 'Если клиент отменяет поздно, применяются санкции.', q: 'Поздно — это сколько? Ровно 3:00 — поздно? Санкции — какие?', fix: 'Если до начала меньше 3 часов (ровно 3:00 — ещё бесплатно), отмена поздняя: засчитывается неявка (BR-4), предоплата не возвращается.', crit: 'Однозначность' },
    { t: 'Клиент получает уведомление и деньги возвращаются.', q: 'Это два требования. Какое уведомление и когда? Какие деньги, каким способом?', fix: 'Разделить: (1) после отмены — push «Запись отменена» не позже 1 минуты; (2) при бесплатной отмене предоплата 500 ₽ возвращается тем же способом, приходит чек возврата.', crit: 'Атомарность' },
    { t: 'Система корректно обрабатывает ошибки.', q: 'Какие ошибки? Что видит клиент? Что происходит с записью?', fix: 'Если нет сети, приложение показывает «Нет связи, запись не отменена — попробуйте ещё раз»; статус записи не меняется.', crit: 'Полнота' },
    { t: 'Отменить можно за 3 часа; перенос доступен всегда.', q: 'Перенос за час до начала тоже? В постановке написано «меньше 3 часов — перенос недоступен».', fix: 'Перенос доступен по тем же правилам, что бесплатная отмена: не позднее чем за 3 часа до начала.', crit: 'Непротиворечивость' }
  ];
  function drawDetector(pane) {
    let cur = 0, txt = 'Клиент может быстро отменить запись, если до начала достаточно времени.';
    pane.innerHTML = `<div class="stack">
      <p class="small muted"><b>Проверяемое требование</b> — такое, по которому два человека независимо получат одинаковый ответ «выполнено / не выполнено». Признаки (Вигерс; ISO/IEC/IEEE 29148): однозначность, измеримость, полнота, атомарность, непротиворечивость. Нажмите на фразу из черновика — услышите вопрос Лизы.</p>
      <div class="mqa-two"><div class="mqa-list" data-l></div><div data-p></div></div>
      <div class="mqa-panel"><h4>Проверьте свою фразу</h4>
        <textarea data-t aria-label="Текст требования" rows="2">${esc(txt)}</textarea><div class="mqa-ft" data-f></div></div>
    </div>`;
    function drawL() {
      TR.$('[data-l]', pane).innerHTML = PHR.map((p, i) => `<button type="button" class="mqa-it" data-i="${i}" aria-pressed="${cur === i}"><span>«${esc(p.t)}»</span><small>${esc(p.crit)}</small></button>`).join('');
      const p = PHR[cur];
      TR.$('[data-p]', pane).innerHTML = `<div class="mqa-panel"><div class="mqa-bad">«${esc(p.t)}»</div>${ui.say('liza', esc(p.q))}<div class="mqa-good"><span class="mqa-lbl ok">Проверяемо</span><div>${esc(p.fix)}</div></div><div class="small muted">Нарушен признак: <b>${esc(p.crit)}</b></div></div>`;
    }
    function drawF() {
      const n = TR.norm(txt), v = vagueIn(txt);
      const f = [
        [v.length === 0, v.length ? 'размытые слова: ' + v.join(', ') : 'нет размытых слов'],
        [/\d/.test(n), /\d/.test(n) ? 'есть число' : 'нет чисел и единиц'],
        [/(если|когда|при |до |после |не позднее|не раньше|не позже)/.test(n), 'есть условие'],
        [/(статус|показыва|видит|приходит|возвраща|засчитыва|отображ|сохраня)/.test(n), 'есть наблюдаемый результат']
      ];
      TR.$('[data-f]', pane).innerHTML = f.map(x => chip((x[0] ? '✓ ' : '✕ ') + esc(x[1]), x[0] ? 'ok' : 'bad')).join('');
    }
    TR.on(pane, 'click', '[data-i]', (e, b) => { cur = +b.dataset.i; drawL(); });
    pane.addEventListener('input', e => { if (e.target.matches('[data-t]')) { txt = e.target.value; drawF(); } });
    drawL(); drawF();
  }
  const GWT = {
    free: { t: 'Бесплатная отмена', g: 'запись клиента на 15:00 с предоплатой 500 ₽\nИ сейчас 12:00 — до начала ровно 3 часа', w: 'клиент нажимает «Отменить» и подтверждает отмену', th: ['запись в статусе «Отменена», вид отмены — «бесплатная»', '500 ₽ возвращаются тем же способом, клиенту приходит чек возврата', 'слот 15:00 снова доступен для записи'] },
    late: { t: 'Поздняя отмена', g: 'запись клиента на 15:00 с предоплатой 500 ₽\nИ сейчас 12:01 — до начала 2 часа 59 минут', w: 'клиент нажимает «Отменить»', th: ['до подтверждения показано предупреждение: «Отмена поздняя: засчитается неявка, предоплата не вернётся»', 'после подтверждения запись «Отменена», вид — «поздняя», засчитана неявка (BR-4)', 'предоплата 500 ₽ не возвращается'] },
    start: { t: 'Запись уже началась', g: 'запись клиента на 15:00\nИ сейчас 15:05', w: 'клиент открывает карточку записи', th: ['кнопки «Отменить» и «Перенести» нет', 'показан текст «Запись уже началась. Позвоните на станцию»'] }
  };
  const gh = s => `<div class="mqa-gh"><b>Сценарий:</b> ${esc(s.t)}\n<b>Дано</b> ${esc(s.g).replace(/\nИ /g, '\n<b>И</b> ')}\n<b>Когда</b> ${esc(s.w)}\n<b>Тогда</b> ${s.th.map(esc).join('\n<b>И</b> ')}</div>`;
  function drawGwt(pane) {
    let cur = 'free', bad = false;
    pane.innerHTML = `<div class="stack">
      <p class="small muted"><b>Дано / Когда / Тогда</b> (Given / When / Then, язык Gherkin из BDD — разработки через поведение) — способ записать критерий приёмки как пример: <b>Дано</b> — исходное состояние, <b>Когда</b> — одно действие, <b>Тогда</b> — наблюдаемый результат. Такой критерий читают заказчик, разработчик и тестировщик — и по нему же пишут автотест.</p>
      <div class="row">${ui.seg('gwt', Object.keys(GWT).map(k => ({ v: k, t: GWT[k].t })), cur)}</div>
      <button type="button" class="btn sm" data-bad aria-pressed="false">Показать, как пишут плохо</button>
      <div data-o></div>
    </div>`;
    function draw() {
      TR.$('[data-o]', pane).innerHTML = bad
        ? `<div class="mqa-gh"><b>Сценарий:</b> отмена\n<b>Дано</b> у клиента есть запись\n<b>Когда</b> клиент отменяет её вовремя\n<b>Тогда</b> всё работает корректно</div>${ui.note('bad', 'Почему это не критерий', '«Есть запись» — какая, на какое время, с предоплатой? «Вовремя» — граница не названа. «Корректно» — Лиза не может сравнить с фактом. Такой сценарий пройдёт при любом поведении системы.')}`
        : gh(GWT[cur]) + ui.note('info', 'Правила хорошего сценария', '<ul class="checks"><li>В «Дано» — конкретные значения: время, сумма, статус. Граничное значение — прямо в примере.</li><li>Одно действие в «Когда». Два действия — два сценария.</li><li>«Тогда» — то, что можно увидеть: статус, текст на экране, деньги, уведомление. Не «система обрабатывает».</li><li>Негативные сценарии не менее важны, чем удачный путь.</li></ul>');
    }
    ui.onSeg(pane, (n, v) => { cur = v; bad = false; const b = TR.$('[data-bad]', pane); b.setAttribute('aria-pressed', 'false'); b.textContent = 'Показать, как пишут плохо'; draw(); });
    TR.on(pane, 'click', '[data-bad]', (e, b) => { bad = !bad; b.setAttribute('aria-pressed', String(bad)); b.textContent = bad ? 'Вернуть хороший пример' : 'Показать, как пишут плохо'; draw(); });
    draw();
  }
  const QASTEPS = [
    { t: 'Ревью требований', s: 'до кода', d: 'Лиза читает постановку и спрашивает «как я это проверю?». Сегодняшний день. Самая дешёвая точка: ошибка — в тексте, а не в коде. Это и есть shift-left — «сдвиг тестирования влево» по ленте проекта.' },
    { t: 'Тест-дизайн', s: 'пока пишут код', d: 'Классы эквивалентности, граничные значения, тест-кейсы и чек-листы по критериям приёмки.' },
    { t: 'Три амиго', s: 'перед стартом', d: 'Аналитик, разработчик и тестировщик проходят критерии на примерах: «ровно 3:00 — бесплатно?»' },
    { t: 'Тест сборки', s: 'в спринте', d: 'Проверка на стенде по тест-кейсам; найденное — баг-репорты.' },
    { t: 'Регресс', s: 'перед релизом', d: 'Повторная проверка того, что уже работало: не сломала ли отмена запись, оплату, напоминания. Часть — автотестами.' },
    { t: 'Приёмка', s: 'демо', d: 'Заказчик проходит сценарии приёмки; QA помогает подготовить данные и стенд.' }
  ];
  function drawCase(pane) {
    let mode = 'cl', step = 0;
    pane.innerHTML = `<div class="stack">
      <div class="row">${ui.seg('cs', [{ v: 'cl', t: 'Чек-лист' }, { v: 'tc', t: 'Тест-кейс' }], 'cl')}</div><div data-o></div>
      <span class="mqa-lbl">Где QA работает с аналитиком</span><div class="mqa-chips" data-s></div><div data-d></div>
    </div>`;
    function draw() {
      TR.$('[data-o]', pane).innerHTML = mode === 'cl'
        ? `<div class="mqa-panel"><h4>Чек-лист «Отмена записи»</h4><ul class="checks"><li>Отмена за 3:01 — бесплатная</li><li>Отмена ровно за 3:00 — бесплатная</li><li>Отмена за 2:59 — поздняя, неявка</li><li>Возврат предоплаты по карте и по СБП</li><li>Слот освобождается после отмены</li><li>После начала записи кнопки отмены нет</li></ul><div class="small muted">Короткий список «что проверить». Быстро писать и поддерживать; подходит опытному тестировщику, который знает систему. Шаги каждый раз может пройти по-разному.</div></div>`
        : `<div class="mqa-panel"><h4>Тест-кейс TC-112-03</h4><div class="mqa-kv"><span>Название</span><span>Отмена ровно за 3:00 — бесплатная</span><span>Требование</span><span>ISK-112, BR-3</span><span>Предусловия</span><span>Клиент Елена Смирнова, запись на 15:00 на Победы, предоплата 500 ₽ картой; время стенда 12:00:00</span><span>Шаги</span><span>1. «Мои записи» → запись 15:00. 2. «Отменить». 3. «Подтвердить».</span><span>Ожидаемый результат</span><span>Статус «Отменена», вид «бесплатная»; 500 ₽ возвращены на карту; чек возврата на email; слот 15:00 свободен</span></div><div class="small muted">Подробно и воспроизводимо: пройдёт новичок, по нему пишут автотест, он годится как доказательство для заказчика. Дороже в поддержке.</div></div>`;
      TR.$('[data-s]', pane).innerHTML = QASTEPS.map((s, i) => `<button type="button" class="chip" data-st="${i}" aria-pressed="${step === i}">${i + 1}. ${esc(s.t)} · ${esc(s.s)}</button>`).join('');
      TR.$('[data-d]', pane).innerHTML = `<div class="mqa-ex">${esc(QASTEPS[step].d)}</div>`;
    }
    ui.onSeg(pane, (n, v) => { mode = v; draw(); });
    TR.on(pane, 'click', '[data-st]', (e, b) => { step = +b.dataset.st; draw(); });
    draw();
  }
  const howTestable = {
    id: 'how-testable', covers: ['rewrite'], title: 'Как это работает: роль QA и проверяемое требование', free: true, noReset: true,
    simple: {
      icon: '🔍',
      plain: 'Тестировщик (QA — quality assurance, обеспечение качества) проверяет, что система делает то, что нужно. Но проверить можно только то, что записано однозначно: «быстро», «удобно», «корректно» не проверишь. Поэтому хороший тестировщик читает требования раньше, чем появится код, и спрашивает: «как я это проверю?»',
      analogy: 'Попросите двух людей проверить, «чисто ли в квартире». Один скажет «да», другой — «нет». А «на полу нет пыли, посуда вымыта, мусор вынесен» оба проверят одинаково.',
      tech: '<b>Проверяемость</b> (verifiability) — свойство хорошего требования наряду с однозначностью, полнотой, непротиворечивостью и атомарностью (ISO/IEC/IEEE 29148; Вигерс, Битти). Критерии приёмки часто пишут в формате <b>Gherkin</b>: Дано / Когда / Тогда (Дэн Норт, BDD). <b>Shift-left</b> — раннее подключение тестирования: ревью требований до разработки.'
    },
    lead: ui.brief({
      situation: 'Четверг, 19 ноября. Лиза распечатала постановку ISK-112 «Отмена записи», вооружилась маркером и третий раз подходит к вашему столу: «Тут „удобно“. Тут „поздно“. Как я это проверю?»',
      todo: [
        'Вкладка «Детектор размытых слов»: откройте все пять фраз и проверьте свою — меняйте текст и следите за признаками.',
        'Вкладка «Дано / Когда / Тогда»: три сценария и «как пишут плохо».',
        'Вкладка «Чек-лист или тест-кейс»: сравните и пройдите шесть точек работы QA с аналитиком.'
      ],
      look: 'Вопросы Лизы — не придирки, а самая дешёвая проверка требований. Позиция аналитика: проверяемость требования — его зона ответственности, а не тестировщика.'
    }),
    render(el) {
      el.classList.add('mqa-root');
      const t = document.createElement('div'); el.appendChild(t);
      ui.tabs(t, [
        { id: 'd', t: 'Детектор размытых слов', render: drawDetector },
        { id: 'g', t: 'Дано / Когда / Тогда', render: drawGwt },
        { id: 'c', t: 'Чек-лист или тест-кейс', render: drawCase }
      ], 'd');
      el.insertAdjacentHTML('beforeend', `<div class="stack tight" style="margin-top:12px">
        ${mistakes(['Считать, что QA подключается, когда есть сборка. Самые дорогие дефекты — в требованиях, их находят чтением.', 'Писать критерии только для удачного пути. Лиза первой спросит про «нет сети» и «запись уже началась».', 'Ставить в «Тогда» внутреннюю механику («вызывается метод refund»). Критерий описывает то, что видно снаружи.'])}
        ${interview([['«Какое требование проверяемое?»', 'Однозначное и измеримое: есть условие, конкретные значения и наблюдаемый результат; два человека независимо дадут одинаковый ответ «выполнено / нет».'], ['«Что такое Дано/Когда/Тогда?»', 'Формат критерия приёмки из BDD: исходное состояние, одно действие, наблюдаемый результат. По нему пишут ручные тест-кейсы и автотесты.'], ['«Чем тест-кейс отличается от чек-листа?»', 'Тест-кейс — шаги, предусловия и ожидаемый результат, воспроизводимо; чек-лист — список того, что проверить, быстрее, но зависит от опыта тестировщика.']])}
      </div>`);
    }
  };

  // =====================================================================
  // Теория 2. Классы эквивалентности и граничные значения
  // =====================================================================
  const CODE = [
    { v: 'ok', t: 'Верно: «≥ 3 ч»', f: m => m >= 180, d: 'Бесплатно, если до начала 180 минут или больше.' },
    { v: 'gt', t: 'Глеб: «> 3 ч»', f: m => m > 180, d: 'Строго больше трёх часов — ровно 3:00 становится поздней отменой.' },
    { v: 'tz', t: 'Даша: время телефона', f: m => m - 120 >= 180, d: 'Приложение считает по часам телефона, а у клиента в командировке телефон на времени Екатеринбурга (+2 ч к Казани).' },
    { v: 'off', t: 'Ошибка на минуту: «≥ 2:59»', f: m => m >= 179, d: 'Округление вниз до минуты: 2:59 тоже считается бесплатной.' }
  ];
  const hm = m => (m < 0 ? '−' : '') + Math.floor(Math.abs(m) / 60) + ':' + String(Math.abs(m) % 60).padStart(2, '0');
  const AX_MIN = -60, AX_MAX = 360;
  const axPos = m => ((m - AX_MIN) / (AX_MAX - AX_MIN) * 100).toFixed(2) + '%';
  const axLine = () => `<div class="ln"><i class="no" style="width:${axPos(0)}"></i><i class="late" style="width:${(180 / (AX_MAX - AX_MIN) * 100).toFixed(2)}%"></i><i class="free" style="flex:1"></i></div>`;
  function drawBR3(pane) {
    let m = 180, code = 'gt';
    pane.innerHTML = `<div class="stack">
      <p class="small muted"><b>BR-3:</b> бесплатная отмена — не позднее чем за 3 часа до начала. На оси — сколько времени до начала записи осталось в момент отмены. Двигайте ползунок, потом выберите версию кода и посмотрите, какую ошибку ловит каждая точка.</p>
      <div class="mqa-axis" data-ax></div>
      <div class="mqa-rng"><span>До начала: <b data-m></b></span><input type="range" min="${AX_MIN}" max="${AX_MAX}" value="${m}" data-r aria-label="Сколько времени до начала записи"></div>
      <div data-cl></div>
      <span class="mqa-lbl">Версия кода</span><div class="row">${ui.seg('code', CODE.map(c => ({ v: c.v, t: c.t })), code)}</div>
      <div data-tb></div>
    </div>`;
    function draw() {
      TR.$('[data-ax]', pane).innerHTML = axLine() + [[179, '2:59', 'up l'], [180, '3:00', ''], [181, '3:01', 'up r'], [0, 'начало', '']].map(p => `<i class="pt" style="left:${axPos(p[0])}"></i><span class="pl ${p[2]}" style="left:${axPos(p[0])}">${p[1]}</span>`).join('') + `<i class="cur" style="left:${axPos(m)}"></i>`;
      TR.$('[data-m]', pane).textContent = m < 0 ? 'началась ' + hm(-m) + ' назад' : hm(m);
      const cls = m < 0 ? ['no', 'Отмена недоступна: запись уже началась (дальше — BR-4, неявка через 15 минут)'] : m >= 180 ? ['ok', 'Бесплатная отмена: предоплата возвращается'] : ['bad', 'Поздняя отмена: засчитывается неявка, предоплата не возвращается'];
      TR.$('[data-cl]', pane).innerHTML = ui.note(cls[0] === 'no' ? 'info' : cls[0], 'Класс: ' + (cls[0] === 'ok' ? 'бесплатно' : cls[0] === 'bad' ? 'поздно' : 'после начала'), cls[1]);
      const c = CODE.find(x => x.v === code);
      TR.$('[data-tb]', pane).innerHTML = `<div class="small muted">${esc(c.d)}</div><table class="mqa-tb"><tr><th>Точка</th><th>Ожидаем</th><th>Код даёт</th><th>Тест</th></tr>${[181, 180, 179].map(p => { const exp = p >= 180, got = c.f(p); return `<tr><td>${hm(p)}</td><td>${exp ? 'бесплатно' : 'поздно'}</td><td>${got ? 'бесплатно' : 'поздно'}</td><td class="${exp === got ? 'ok' : 'bad'}">${exp === got ? '✓ прошёл' : '✕ дефект найден'}</td></tr>`; }).join('')}</table>
        ${code === 'ok' ? ui.note('ok', 'Все три точки прошли', 'Так и должно быть у правильного кода. Но заметьте: каждая точка ловит свою ошибку — переключите версии.') : ui.note('warn', 'Почему нужны все три', '«> 3 ч» ловит только 3:00, время телефона — 3:01 и 3:00, ошибку на минуту — только 2:59. Убрать любую точку — пропустить один из дефектов.')}`;
    }
    pane.addEventListener('input', e => { if (e.target.matches('[data-r]')) { m = +e.target.value; draw(); } });
    ui.onSeg(pane, (n, v) => { code = v; draw(); });
    draw();
  }
  const CLS2 = [
    { id: 'early', t: 'Меньше 2 часов до начала', k: 'bad', ex: '1:59, 1:00, 0:30', r: 'Отказ: «Онлайн-запись — не позднее чем за 2 часа»' },
    { id: 'ok', t: 'От 2 часов до 30 суток', k: 'ok', ex: '2:00, 2:01, 7 дней, ровно 30 суток', r: 'Запись создаётся' },
    { id: 'far', t: 'Дальше 30 суток', k: 'bad', ex: '30 суток и 30 минут, 45 дней', r: 'Отказ: «Запись открыта на 30 дней вперёд»' },
    { id: 'past', t: 'Время в прошлом', k: 'bad', ex: 'вчера, 5 минут назад', r: 'Отказ — недопустимый класс: такого вообще не должно прийти' }
  ];
  function drawClasses(pane) {
    let cur = 'ok';
    pane.innerHTML = `<div class="stack">
      <p class="small muted"><b>Класс эквивалентности</b> — группа входных значений, на которые система реагирует одинаково. Достаточно одного теста на класс — и тестов на каждую <b>границу</b> между классами, потому что ошибки живут на границах. <b>BR-2:</b> онлайн-запись не позже чем за 2 часа до начала и не дальше 30 дней вперёд. Нажмите на класс.</p>
      <div class="mqa-chips" data-c></div><div data-o></div>
      ${ui.note('info', 'Что ещё прячется на границе', '<ul class="checks"><li><b>Точность:</b> 3:00 — это 3:00:00 или 3:00:59? Договоритесь, что время сравнивается с точностью до минуты — и запишите.</li><li><b>Чьё «сейчас»:</b> время сервера в часовом поясе станции (Казань), а не телефона клиента.</li><li><b>Включительно или нет:</b> «не позднее чем за 3 часа» включает ровно 3:00, «больше 3 часов» — не включает. Одно слово меняет класс граничной точки.</li></ul>')}
    </div>`;
    function draw() {
      TR.$('[data-c]', pane).innerHTML = CLS2.map(c => `<button type="button" class="chip ${c.k}" data-c="${c.id}" aria-pressed="${cur === c.id}">${esc(c.t)}</button>`).join('');
      const c = CLS2.find(x => x.id === cur);
      TR.$('[data-o]', pane).innerHTML = `<div class="mqa-panel"><div class="mqa-kv"><span>Примеры значений</span><span>${esc(c.ex)}</span><span>Ожидаемо</span><span>${esc(c.r)}</span><span>Тестов нужно</span><span>${cur === 'ok' ? 'Один из середины класса + границы 2:00 и ровно 30 суток' : cur === 'past' ? 'Один — недопустимые значения проверяют, но не перебирают' : 'Граница рядом с соседним классом: ' + (cur === 'early' ? '1:59' : '30 суток и 30 минут')}</span></div></div>`;
    }
    TR.on(pane, 'click', '[data-c]', (e, b) => { cur = b.dataset.c; draw(); });
    draw();
  }
  const howBounds = {
    id: 'how-bounds', covers: ['bounds', 'lab'], title: 'Как это работает: классы эквивалентности и граничные значения', free: true, noReset: true,
    simple: {
      icon: '📏',
      plain: 'Проверить все возможные значения нельзя: минут до начала записи — тысячи. Поэтому значения делят на группы, где система ведёт себя одинаково, и проверяют по одному из каждой группы. А главное — проверяют границы между группами: 3:01, 3:00, 2:59. Именно там программисты чаще всего ошибаются.',
      analogy: 'Аттракцион «для детей от 120 см». Проверять каждого ребёнка не нужно: достаточно 119, 120 и 121 см — и один раз взрослого. Ошибка «от» или «больше» сразу всплывёт на 120.',
      tech: '<b>Разбиение на классы эквивалентности</b> (equivalence partitioning) и <b>анализ граничных значений</b> (boundary value analysis) — базовые техники тест-дизайна (ISTQB Foundation Level; Ли Копланд, «Практическое руководство по разработке тестов»). Для границы проверяют значение на ней и по обе стороны (трёхточечный вариант).'
    },
    lead: ui.brief({
      situation: 'Лиза рисует на доске ось: «Вот 3 часа. С какой стороны ровно 3:00? В постановке „не позднее чем за 3 часа“, а Глеб в коде написал „больше трёх часов“. Это одно и то же?»',
      todo: [
        'Вкладка «Ось BR-3»: подвигайте ползунок, затем переключите четыре версии кода и посмотрите, какая точка ловит какую ошибку.',
        'Вкладка «Классы BR-2»: нажмите на все четыре класса.'
      ],
      look: 'Аналитик отвечает за то, чтобы граница была записана однозначно: «ровно 3:00 — бесплатно». Тестировщик — за то, чтобы её проверить с обеих сторон.'
    }),
    render(el) {
      el.classList.add('mqa-root');
      const t = document.createElement('div'); el.appendChild(t);
      ui.tabs(t, [{ id: 'a', t: 'Ось BR-3: 3:01, 3:00, 2:59', render: drawBR3 }, { id: 'c', t: 'Классы BR-2', render: drawClasses }], 'a');
      el.insertAdjacentHTML('beforeend', `<div class="stack tight" style="margin-top:12px">
        ${mistakes(['Тестировать «за 5 часов» и «за 1 час» — два значения из середины классов, а границу пропустить.', 'Писать в требовании «за 3 часа» без «не позднее чем» — и спорить потом, включительно ли.', 'Забыть недопустимый класс: «запись уже началась», «время в прошлом».'])}
        ${interview([['«Что такое граничные значения?»', 'Значения на границе классов и рядом с ней: для «не позднее чем за 3 часа» — 3:01, 3:00, 2:59. Ошибки «больше / больше или равно» ловятся именно там.'], ['«Что такое класс эквивалентности?»', 'Группа входных данных, которые система обрабатывает одинаково. Хватает одного теста на класс плюс тестов на границы; не забывайте недопустимые классы.']])}
      </div>`);
    }
  };

  // =====================================================================
  // Теория 3. Баг-репорт, серьёзность и приоритет, баг или фича
  // =====================================================================
  const BRF = [
    { t: 'Заголовок', g: 'Отмена ровно за 3:00 засчитывается как поздняя', b: 'Отмена не работает!!!', why: 'Что, где и при каком условии — одной строкой. По заголовку дефект находят в списке через месяц.' },
    { t: 'Окружение', g: 'Стенд test-2, сборка 0.4.112; iPhone 13, iOS 17.5; приложение 1.0.0 (34)', b: '—', why: 'Без версии сборки и устройства Даша не воспроизведёт.' },
    { t: 'Предусловия', g: 'Клиент Елена Смирнова, запись на 15:00 на Победы, предоплата 500 ₽ картой; время стенда 12:00', b: '—', why: 'Граничное значение — прямо в предусловиях.' },
    { t: 'Шаги', g: '1. «Мои записи» → запись 15:00. 2. «Отменить». 3. «Подтвердить».', b: 'Попробовала отменить', why: 'Пронумерованные шаги, без «и т. д.». Любой пройдёт их одинаково.' },
    { t: 'Ожидаемый результат', g: 'Отмена бесплатная, 500 ₽ возвращаются, чек возврата (BR-3: ровно 3:00 — бесплатно; ISK-112 v1.2)', b: '—', why: 'Ссылка на требование превращает спор «баг или нет» в сверку с документом.' },
    { t: 'Фактический результат', g: 'Предупреждение «Отмена поздняя», статус «Отменена», вид «поздняя», засчитана неявка, деньги не вернулись', b: 'Ничего не работает', why: 'Что именно произошло — факты, без эмоций.' },
    { t: 'Вложения', g: 'Скриншот предупреждения, запись экрана, ID записи 1043, лог запроса', b: '—', why: 'Скриншот и идентификаторы экономят разработчику час.' },
    { t: 'Серьёзность / приоритет', g: 'Значительная / высокий', b: 'СРОЧНО!!!', why: 'Серьёзность — насколько плохо для системы и пользователя. Приоритет — как быстро чинить. Это разные оси.' }
  ];
  function drawReport(pane) {
    let cur = 0, good = true;
    pane.innerHTML = `<div class="stack">
      <p class="small muted"><b>Баг-репорт</b> (отчёт о дефекте) — письмо разработчику, по которому он воспроизведёт и исправит проблему без вопросов. Нажмите на поле.</p>
      <div class="row">${ui.seg('rep', [{ v: '1', t: '✓ Отчёт Лизы' }, { v: '0', t: '✕ Отчёт «на эмоциях»' }], '1')}</div>
      <div class="mqa-two"><div class="mqa-list" data-l></div><div data-p></div></div>
    </div>`;
    function draw() {
      TR.$('[data-l]', pane).innerHTML = BRF.map((f, i) => `<button type="button" class="mqa-it" data-i="${i}" aria-pressed="${cur === i}"><small>${esc(f.t)}</small><span>${esc(good ? f.g : f.b)}</span></button>`).join('');
      const f = BRF[cur];
      TR.$('[data-p]', pane).innerHTML = `<div class="mqa-panel"><h4>${esc(f.t)}</h4><div class="${good ? 'mqa-good' : 'mqa-bad'}">${esc(good ? f.g : f.b)}</div><div>${esc(f.why)}</div></div>`;
    }
    ui.onSeg(pane, (n, v) => { good = v === '1'; draw(); });
    TR.on(pane, 'click', '[data-i]', (e, b) => { cur = +b.dataset.i; draw(); });
    draw();
  }
  const MX = [
    { id: 'hh', s: 'Высокая серьёзность', p: 'высокий приоритет', t: 'При отмене с оплатой по СБП деньги не возвращаются', d: 'Деньги клиентов и претензии по закону о защите прав потребителей: чинить немедленно.' },
    { id: 'lh', s: 'Низкая серьёзность', p: 'высокий приоритет', t: 'Опечатка «Отменить запсиь» на главной кнопке', d: 'Ничего не ломает, но завтра демо Тимуру Рашидовичу и это видит каждый клиент. Пять минут работы — сделать сегодня.' },
    { id: 'hl', s: 'Высокая серьёзность', p: 'низкий приоритет', t: 'Приложение падает при отмене на Android 7', d: 'Падение — серьёзно. Но таких телефонов 0,3 % клиентов, есть обход через сайт, а поддержка Android 7 вообще под вопросом. Можно после релиза.' },
    { id: 'll', s: 'Низкая серьёзность', p: 'низкий приоритет', t: 'В тёмной теме иконка корзины смещена на 2 пикселя', d: 'Косметика. В бэклог, при случае.' }
  ];
  function drawMatrix(pane) {
    let cur = 'lh';
    pane.innerHTML = `<div class="stack">
      <p class="small muted"><b>Серьёзность</b> (severity) — насколько дефект вредит системе и пользователю; оценивает тестировщик. <b>Приоритет</b> (priority) — в каком порядке чинить; решают владелец продукта и тимлид, учитывая сроки и бизнес. Часто совпадают — но не всегда.</p>
      <div class="mqa-mx" data-m></div><div data-o></div>
      <span class="mqa-lbl">Жизненный цикл дефекта</span>
      <div class="mqa-flow">${['Новый', 'Назначен', 'В работе', 'Исправлен', 'Перепроверка', 'Закрыт'].map(x => chip(x)).join('→')}</div>
      <div class="mqa-flow small">${chip('Переоткрыт', 'bad')} — не исправился при перепроверке · ${chip('Отклонён', 'warn')} — не дефект (работает по требованию) · ${chip('Отложен', 'info')} — дефект, но не сейчас</div>
      ${ui.note('info', 'Регресс', 'После каждого исправления проверяют не только сам дефект, но и то, что могло задеть: починили возврат по СБП — перепроверьте возврат по карте и чек. Набор таких проверок — регрессионное тестирование; его стараются автоматизировать.')}
    </div>`;
    function draw() {
      const c = id => { const x = MX.find(m => m.id === id); return `<button type="button" class="mqa-cell" data-x="${id}" aria-pressed="${cur === id}"><b>${esc(x.s)} · ${esc(x.p)}</b>${esc(x.t)}</button>`; };
      TR.$('[data-m]', pane).innerHTML = `<span class="ax"></span><span class="ax">приоритет высокий</span><span class="ax">приоритет низкий</span><span class="ax v">серьёзн. высокая</span>${c('hh')}${c('hl')}<span class="ax v">серьёзн. низкая</span>${c('lh')}${c('ll')}`;
      TR.$('[data-o]', pane).innerHTML = `<div class="mqa-ex">${esc(MX.find(m => m.id === cur).d)}</div>`;
    }
    TR.on(pane, 'click', '[data-x]', (e, b) => { cur = b.dataset.x; draw(); });
    draw();
  }
  const TREE = [
    { t: 'Отмена ровно за 3:00 засчитана как поздняя', a1: 'yes', a2: null, r: 'code', d: 'Поведение расходится с требованием (BR-3: ровно 3:00 — бесплатно). Дефект кода: баг-репорт Глебу, исправление, перепроверка.' },
    { t: 'Водителю «Шашки» засчитали неявку за отмену за час', a1: 'no', a2: 'no', r: 'req', d: 'Система работает по требованию — но требование не учло корпоративных клиентов: машинами управляет завгар. Дефект требований: аналитик уточняет у Рустама и Марины Олеговны, выпускает новую версию ISK-112.' },
    { t: 'За 2 часа до начала нельзя перенести запись', a1: 'no', a2: 'yes', r: 'no', d: 'Работает по требованию, и требование верное: за 2 часа пост уже не займёшь другим клиентом. Не баг. Если клиентам это неудобно — пожелание в бэклог, решает владелец продукта.' }
  ];
  const RES_T = { code: ['bad', 'Дефект кода'], req: ['warn', 'Дефект требований'], no: ['ok', 'Не баг'] };
  function drawTree(pane) {
    let cur = 0, a1 = null, a2 = null;
    pane.innerHTML = `<div class="stack"><p class="small muted">Спор «это баг или так задумано?» решается не громкостью, а двумя вопросами. Выберите случай и ответьте.</p><div class="mqa-chips" data-c></div><div class="mqa-tree" data-t></div></div>`;
    function draw() {
      const x = TREE[cur];
      TR.$('[data-c]', pane).innerHTML = TREE.map((t, i) => `<button type="button" class="chip" data-c="${i}" aria-pressed="${cur === i}">${esc(t.t)}</button>`).join('');
      const btn = (q, v, t) => `<button type="button" class="btn sm" data-a="${q}" data-v="${v}" aria-pressed="${(q === '1' ? a1 : a2) === v}">${t}</button>`;
      let h = `<div class="mqa-q"><b>1. Поведение расходится с требованием?</b><div class="row">${btn('1', 'yes', 'Да')}${btn('1', 'no', 'Нет, работает как написано')}</div></div>`;
      if (a1 === 'no') h += `<div class="mqa-q"><b>2. Требование верно отражает то, что нужно бизнесу?</b><div class="row">${btn('2', 'yes', 'Да')}${btn('2', 'no', 'Нет, в требовании пробел или ошибка')}</div></div>`;
      const res = a1 === 'yes' ? 'code' : a1 === 'no' && a2 ? (a2 === 'no' ? 'req' : 'no') : null;
      if (res) { const right = res === x.r; h += ui.note(right ? RES_T[res][0] : 'bad', RES_T[res][1] + (right ? '' : ' — нет, перечитайте случай'), right ? esc(x.d) : 'Сверьтесь с требованием: что в нём сказано? И если всё по требованию — нужно ли это «Искре»?'); }
      TR.$('[data-t]', pane).innerHTML = h;
    }
    TR.on(pane, 'click', '[data-c]', (e, b) => { cur = +b.dataset.c; a1 = a2 = null; draw(); });
    TR.on(pane, 'click', '[data-a]', (e, b) => { if (b.dataset.a === '1') { a1 = b.dataset.v; a2 = null; } else a2 = b.dataset.v; draw(); });
    draw();
  }
  const howBugs = {
    id: 'how-bugs', covers: ['triage', 'why'], title: 'Как это работает: баг-репорт, серьёзность и приоритет, «баг или фича»', free: true, noReset: true,
    simple: {
      icon: '🐞',
      plain: 'Дефект — расхождение между тем, как система работает, и тем, как должна. Тестировщик описывает его так, чтобы разработчик повторил: шаги, что ожидали, что получили. Серьёзность говорит, насколько это плохо, приоритет — как срочно чинить. А иногда «баг» оказывается ошибкой в самих требованиях — тогда исправляет аналитик.',
      analogy: 'Вы вызываете мастера: «Течёт кран на кухне, капает раз в секунду, началось после замены прокладки» — он приедет с нужной деталью. «Всё течёт!!!» — приедет с пустыми руками.',
      tech: '<b>Дефект</b> — несоответствие фактического результата ожидаемому (ISTQB). Отчёт о дефекте: заголовок, окружение, предусловия, шаги, ожидаемый и фактический результат, вложения, серьёзность, приоритет, ссылка на требование. Жизненный цикл: новый → назначен → в работе → исправлен → перепроверка → закрыт / переоткрыт / отклонён / отложен. <b>Регрессионное тестирование</b> — проверка, что изменения не сломали работавшее.'
    },
    lead: ui.brief({
      situation: 'Лиза вспоминает прошлый проект: «Там у нас половина „багов“ была спором „так задумано или нет“. Тестировщик заводит баг, разработчик закрывает „работает по ТЗ“, а заказчик злится на обоих». Разберитесь, как этого не допустить.',
      todo: [
        'Вкладка «Баг-репорт»: сравните отчёт Лизы и отчёт «на эмоциях», нажмите на поля.',
        'Вкладка «Серьёзность и приоритет»: нажмите на все четыре клетки, посмотрите жизненный цикл дефекта.',
        'Вкладка «Баг или фича»: пройдите три случая по двум вопросам.'
      ],
      look: 'Аналитик — арбитр в споре «баг или фича», потому что у него требования. Если требование молчит или ошибается — это дефект требований, и чинит его аналитик новой версией.'
    }),
    render(el) {
      el.classList.add('mqa-root');
      const t = document.createElement('div'); el.appendChild(t);
      ui.tabs(t, [{ id: 'r', t: 'Баг-репорт', render: drawReport }, { id: 'm', t: 'Серьёзность и приоритет', render: drawMatrix }, { id: 't', t: 'Баг или фича', render: drawTree }], 'r');
      el.insertAdjacentHTML('beforeend', `<div class="stack tight" style="margin-top:12px">
        ${mistakes(['Путать серьёзность и приоритет: «критическая опечатка».', 'Закрывать дефект «работает по ТЗ», не спросив, верно ли ТЗ.', 'Исправлять дефект требований «в коде, по-тихому», не меняя версию требования, — через месяц никто не знает, как правильно.'])}
        ${interview([['«Чем серьёзность отличается от приоритета?»', 'Серьёзность — влияние дефекта на систему и пользователя, приоритет — очерёдность исправления с учётом бизнеса. Пример: опечатка на главной кнопке перед демо — низкая серьёзность, высокий приоритет.'], ['«Что вы делаете, когда тестировщик и разработчик спорят, баг ли это?»', 'Сверяю с требованием. Расходится — дефект кода. Совпадает, но требование не отражает потребность — дефект требований: уточняю у бизнеса и выпускаю новую версию. Всё верно — не баг, пожелание в бэклог.'], ['«Что должно быть в баг-репорте?»', 'Заголовок, окружение, предусловия, шаги, ожидаемый и фактический результат, вложения, серьёзность, приоритет, ссылка на требование.']])}
      </div>`);
    }
  };

  // =====================================================================
  // Практика 1. Переписать непроверяемые требования
  // =====================================================================
  const RW = [
    { id: 'r1', t: 'Отмена записи должна быть удобной для клиента.', f: [
      ['где', 'где кнопка (карточка записи, «Мои записи»)', n => /карточк|мои записи|экран|списк/.test(n)],
      ['шаги', 'число шагов или касаний', n => /\d+\s*(касан|нажат|шаг|клик|тап|действ)|(два|двух|три|трех|одно) (касан|нажат|шаг|клик|тап|действ)/.test(n)],
      ['подтв', 'подтверждение перед отменой', n => /подтвер/.test(n)]],
      ref: 'Отменить запись можно из карточки записи в разделе «Мои записи» не больше чем за два касания: «Отменить» → окно подтверждения → «Подтвердить».' },
    { id: 'r2', t: 'Свободные слоты должны показываться быстро.', f: [
      ['время', 'время ответа с единицами (1 с)', n => /\d+([.,]\d+)?\s*(мс|сек|секунд|с(?![а-я]))/.test(n)],
      ['доля', 'для какой доли запросов (95 %)', n => /(^|[^\d])9[05]([^\d]|$)|перцентил|процент/.test(n)],
      ['нагр', 'при какой нагрузке (1 500 одновременно)', n => /1\s?500|одновремен/.test(n)]],
      ref: 'Список свободных слотов отображается не дольше 1 секунды для 95 % запросов при 1 500 одновременных пользователях.' },
    { id: 'r3', t: 'При поздней отмене к клиенту применяются санкции.', f: [
      ['граница', 'граница: меньше 3 часов (ровно 3:00 — бесплатно)', n => /(3|три|трех)\s*(ч|час)|3:00|180 мин/.test(n) && /(менее|меньше|позднее|позже|ровно|включ)/.test(n)],
      ['неявка', 'засчитывается неявка (BR-4)', n => /неявк/.test(n)],
      ['деньги', 'что с предоплатой', n => /предоплат|500/.test(n)]],
      ref: 'Если до начала записи меньше 3 часов (ровно 3:00 — ещё бесплатно), отмена поздняя: она засчитывается как неявка (BR-4), предоплата 500 ₽ не возвращается.' },
    { id: 'r4', t: 'Клиент должен получать уведомление об отмене.', f: [
      ['канал', 'канал: push или SMS', n => /push|пуш|sms|смс/.test(n)],
      ['срок', 'срок доставки (не позже 1 минуты)', n => /\d+\s*(мин|сек|с(?![а-я]))|минут/.test(n)],
      ['текст', 'что в уведомлении (дата, время, станция)', n => /(дат|врем|станци|адрес)/.test(n)]],
      ref: 'После отмены клиенту приходит push «Запись отменена» с датой, временем и станцией не позже 1 минуты; если push отключены — SMS.' },
    { id: 'r5', t: 'Приложение должно корректно обрабатывать ошибки при отмене.', f: [
      ['ситуац', 'конкретная ситуация (нет сети, запись началась)', n => /(сет|интернет|связ|началас|время прошло|недоступ|таймаут|не ответ)/.test(n)],
      ['видит', 'что видит клиент (текст сообщения)', n => /(сообщени|текст|показ|видит|надпис|экран)/.test(n)],
      ['статус', 'что с записью (статус не меняется)', n => /(статус|не меня|остает|сохраня|не отмен)/.test(n)]],
      ref: 'Если при отмене нет сети, приложение показывает сообщение «Нет связи. Запись не отменена — попробуйте ещё раз»; статус записи не меняется.' },
    { id: 'r6', t: 'Отменённые записи удаляются из системы.', f: [
      ['стат', 'статус «Отменена» вместо удаления', n => /отменен|cancelled/.test(n)],
      ['хран', 'запись сохраняется', n => /(не удаля|хран|сохран|остает)/.test(n)],
      ['когда', 'время отмены', n => /(врем|дат|момент)[а-я]* отмен|когда отмен/.test(n)],
      ['вид', 'вид отмены: бесплатная или поздняя', n => /бесплатн|поздн/.test(n)]],
      ref: 'Отменённая запись не удаляется: она сохраняется со статусом «Отменена» (cancelled), временем отмены и видом — бесплатная или поздняя.' }
  ];
  function rwEval(a) {
    const t = (a && a.t) || {}, per = {};
    let sum = 0;
    RW.forEach(r => {
      const txt = t[r.id] || '', n = TR.norm(txt), hits = r.f.map(f => !!txt.trim() && f[2](n)), v = vagueIn(txt);
      const raw = hits.filter(Boolean).length / r.f.length, s = Math.max(0, raw - (v.length ? 0.2 : 0));
      per[r.id] = { hits, v, s, empty: !txt.trim() }; sum += s;
    });
    const score = sum / RW.length;
    return { per, score, ok: score >= 0.8 && RW.every(r => per[r.id].s >= 0.5) };
  }
  const rewriteTask = {
    id: 'rewrite', title: 'Переписать 6 непроверяемых требований',
    simple: howTestable.simple,
    lead: ui.brief({
      situation: 'Лиза возвращает вам листок с шестью фразами, обведёнными маркером: «Это я не могу проверить. Перепишите так, чтобы я написала по ним тест-кейсы, — а Глеб автотесты».',
      todo: [
        'Перепишите каждое требование своими словами. Под полем вживую загораются признаки проверяемости.',
        'Опирайтесь на правила «Искры»: BR-3, BR-4, нагрузку из кейса (1 500 одновременных пользователей), push не позже 1 минуты.',
        'Нажмите «Проверить». Засчитывается от 80 % признаков, и каждое требование — хотя бы наполовину. Размытое слово снимает часть балла.'
      ],
      look: 'Проверьте себя вопросом Лизы: «Что я сделаю и что должна увидеть, чтобы сказать „выполнено“?» Если ответа нет — требование ещё не готово.'
    }),
    blank: () => ({ t: {} }),
    reference: () => ({ t: Object.fromEntries(RW.map(r => [r.id, r.ref])) }),
    render(el, ctx) {
      el.classList.add('mqa-root');
      const a = ctx.ans; a.t = a.t || {};
      const rv = !!(ctx.result || ctx.readonly);
      el.innerHTML = `<div class="stack">${RW.map((r, i) => `<div class="mqa-rw" data-rw="${r.id}"><div class="orig"><span class="mqa-lbl">Было ${i + 1}</span><div class="mqa-bad">«${esc(r.t)}»</div></div>
        <textarea data-t="${r.id}" aria-label="Проверяемая версия требования ${i + 1}" placeholder="Проверяемая версия…" ${ctx.readonly ? 'readonly' : ''}>${esc(a.t[r.id] || '')}</textarea><div class="mqa-ft" data-f="${r.id}"></div><div data-w="${r.id}"></div></div>`).join('')}</div>`;
      const upd = id => {
        const ev = rwEval(a), p = ev.per[id], r = RW.find(x => x.id === id);
        TR.$(`[data-f="${id}"]`, el).innerHTML = r.f.map((f, i) => chip((p.hits[i] ? '✓ ' : '○ ') + esc(f[1]), p.hits[i] ? 'ok' : '')).join('') + (p.v.length ? chip('размыто: ' + esc(p.v.join(', ')), 'warn') : '');
        const box = TR.$(`[data-rw="${id}"]`, el);
        box.className = 'mqa-rw' + (rv ? (p.s >= 0.99 ? ' ok' : p.s >= 0.5 ? ' warn' : ' bad') : '');
        TR.$(`[data-w="${id}"]`, el).innerHTML = rv ? `<div class="mqa-why">Пример: ${esc(r.ref)}</div>` : '';
      };
      RW.forEach(r => upd(r.id));
      el.addEventListener('input', e => { const ta = e.target.closest('[data-t]'); if (!ta || ctx.readonly) return; a.t[ta.dataset.t] = ta.value; ctx.save(); upd(ta.dataset.t); });
    },
    check(ans) {
      const ev = rwEval(ans), notes = [];
      RW.forEach((r, i) => {
        const p = ev.per[r.id];
        if (p.empty) { notes.push({ ok: false, html: `${i + 1}. «${esc(r.t)}» — не переписано.` }); return; }
        const miss = r.f.filter((f, k) => !p.hits[k]).map(f => f[1]);
        if (!miss.length && !p.v.length) notes.push({ ok: true, html: `${i + 1}. Проверяемо: все признаки на месте.` });
        else notes.push({ ok: p.s >= 0.5 ? 'warn' : false, html: `${i + 1}. ${miss.length ? 'Не хватает: ' + esc(miss.join('; ')) + '.' : ''} ${p.v.length ? `Осталось размытое «${esc(p.v.join('», «'))}» — Лиза снова спросит «а это сколько?».` : ''}` });
      });
      return { ok: ev.ok, score: ev.score, notes, summary: `Признаков проверяемости: ${Math.round(ev.score * 100)} %.`,
        mentor: RW.filter(r => ev.per[r.id].v.length).length >= 2 ? 'Размытые слова прилипают к требованиям незаметно: «быстро», «корректно», «удобно». Совет: перечитайте фразу и замените каждое такое слово числом, условием или тем, что видно на экране.' : null };
    },
    explain: `<ul class="checks">
        <li><b>«Удобно»</b> → где кнопка, сколько касаний, есть ли подтверждение. Удобство проверяют числом шагов и юзабилити-тестом, а не словом.</li>
        <li><b>«Быстро»</b> → время, доля запросов, нагрузка: «≤ 1 с для 95 % запросов при 1 500 одновременных пользователях». Без нагрузки «секунда» ничего не значит.</li>
        <li><b>«Санкции»</b> → граница с указанием, включительно ли, и конкретные последствия: неявка по BR-4, предоплата не возвращается.</li>
        <li><b>«Уведомление»</b> → канал, срок, содержание.</li>
        <li><b>«Корректно обрабатывать ошибки»</b> → какая ошибка, что видит клиент, что с данными. Каждая ошибочная ситуация — своё требование.</li>
        <li><b>«Удаляются»</b> — не только размыто, но и вредно: без отменённых записей не посчитать неявки и правило двух неявок подряд. Верно — статус, время и вид отмены.</li>
      </ul>
      <p class="small muted">Источники: К. Вигерс, Дж. Битти, «Разработка требований к программному обеспечению» — характеристики качественных требований; ISO/IEC/IEEE 29148 — свойства хорошо сформулированного требования; ISO/IEC 25010 — измеримые характеристики качества.</p>`,
    refNote: 'Засчитываются любые формулировки, если в них есть признаки: числа с единицами, условие, наблюдаемый результат — и нет размытых слов.',
    report: ans => { const t = (ans && ans.t) || {}, ev = rwEval(ans); return RW.map((r, i) => `${i + 1}. ${r.t}\n   → ${t[r.id] || '—'} (${Math.round(ev.per[r.id].s * 100)} %)`).join('\n'); }
  };

  // =====================================================================
  // Практика 2. Граничные значения BR-3 и BR-2
  // =====================================================================
  const AXES = [
    { id: 'br3', t: 'BR-3: бесплатная отмена — не позднее чем за 3 часа', q: 'Сколько до начала записи в момент отмены', min: -60, max: 360,
      zones: [[-60, 0, 'no'], [0, 180, 'late'], [180, 360, 'free']],
      out: [{ v: 'free', t: 'Бесплатно, предоплата возвращается' }, { v: 'late', t: 'Поздно: неявка, без возврата' }, { v: 'no', t: 'Отмена недоступна' }],
      pts: [
        { id: 'a24', m: 1440, x: 340, l: 'за сутки', ok: 'free', req: false, why: 'Середина класса «бесплатно». Можно, но 3:01 уже покрывает этот класс.' },
        { id: 'a301', m: 181, x: 205, l: '3:01', ok: 'free', req: true, why: 'Граница с бесплатной стороны: ловит ошибку «время телефона».' },
        { id: 'a300', m: 180, l: '3:00', ok: 'free', req: true, why: 'Сама граница. «Не позднее чем за 3 часа» — ровно 3:00 ещё бесплатно. Ловит «> 3 ч» вместо «≥».' },
        { id: 'a259', m: 179, x: 155, l: '2:59', ok: 'late', req: true, why: 'Граница с поздней стороны: ловит ошибку на минуту.' },
        { id: 'a100', m: 60, l: '1:00', ok: 'late', req: false, why: 'Середина класса «поздно». Дублирует 2:59.' },
        { id: 'a001', m: 1, x: 15, l: '0:01', ok: 'late', req: false, why: 'Граница с началом записи изнутри: полезная точка, если есть время.' },
        { id: 'aneg', m: -5, x: -25, l: '−0:05', ok: 'no', req: true, why: 'Недопустимый класс: запись уже началась. Без этой точки не поймать «бесплатную отмену задним числом».' }
      ] },
    { id: 'br2', t: 'BR-2: онлайн-запись — не позже чем за 2 часа и не дальше 30 дней', q: 'Через сколько начнётся новая запись', min: -60, max: 400,
      zones: [[-60, 0, 'no'], [0, 120, 'no'], [120, 380, 'free'], [380, 400, 'no']],
      out: [{ v: 'ok', t: 'Запись создаётся' }, { v: 'deny', t: 'Отказ с объяснением' }],
      pts: [
        { id: 'b159', m: 119, x: 95, l: '1:59', ok: 'deny', req: true, why: 'Граница с запрещённой стороны: меньше 2 часов — отказ.' },
        { id: 'b200', m: 120, x: 120, l: '2:00', ok: 'ok', req: true, why: '«Не позже чем за 2 часа» — ровно 2:00 можно. Ловит «> 2 ч».' },
        { id: 'b201', m: 121, x: 145, l: '2:01', ok: 'ok', req: false, why: 'Третья точка у нижней границы: полезна, но 2:00 и 1:59 важнее.' },
        { id: 'b7d', m: 10080, x: 250, l: '7 дней', ok: 'ok', req: false, why: 'Середина класса «можно».' },
        { id: 'b30', m: 43200, x: 372, l: '30 суток', ok: 'ok', req: true, why: 'Верхняя граница: ровно 30 суток вперёд — можно.' },
        { id: 'b3030', m: 43230, x: 392, l: '30 сут 30 мин', ok: 'deny', req: true, why: 'Следующий слот за границей (сетка 30 минут, BR-1) — отказ.' },
        { id: 'bpast', m: -60, x: -40, l: 'в прошлом', ok: 'deny', req: false, why: 'Недопустимый класс. На сайте такого слота не выбрать, но запрос в API подделать можно — Глеб будет рад тесту.' }
      ] }
  ];
  const ALLPTS = AXES.flatMap(ax => ax.pts.map(p => Object.assign({ ax: ax.id }, p)));
  function bdEval(a) {
    const inc = (a && a.inc) || {}, exp = (a && a.exp) || {};
    const req = ALLPTS.filter(p => p.req), got = req.filter(p => inc[p.id]);
    const sel = ALLPTS.filter(p => inc[p.id]), right = sel.filter(p => exp[p.id] === p.ok);
    const cov = got.length / req.length, cor = sel.length ? right.length / sel.length : 0;
    const extra = sel.length - got.length;
    const score = Math.max(0, cov * 0.5 + cor * 0.5 - (extra > 4 ? 0.1 : 0));
    const k300 = inc.a300 && exp.a300 === 'free';
    return { score, cov, cor, got, req, sel, right, extra, k300, ok: score >= 0.8 && k300 && cov >= 0.75 };
  }
  const boundsTask = {
    id: 'bounds', title: 'Граничные значения для BR-3 и BR-2',
    simple: howBounds.simple,
    lead: ui.brief({
      situation: 'Лиза: «У меня на отмену и запись есть время на десяток проверок, не больше. Выбери точки, которые я обязана проверить, и скажи, что в каждой должно получиться. Дальше я сама».',
      todo: [
        'На каждой оси отметьте точки, которые войдут в тест-набор. Выбранные точки подсвечиваются на оси.',
        'Для каждой выбранной точки укажите ожидаемый результат.',
        'Нажмите «Проверить». Засчитывается от 80 %: обязательные границы на месте, ожидания верны, и ровно 3:00 — бесплатно.'
      ],
      look: 'На каждой границе — точка на ней и по обе стороны. Плюс недопустимый класс. Середины классов — по остаточному принципу.'
    }),
    blank: () => ({ inc: {}, exp: {} }),
    reference: () => ({ inc: Object.fromEntries(ALLPTS.filter(p => p.req).map(p => [p.id, true])), exp: Object.fromEntries(ALLPTS.filter(p => p.req).map(p => [p.id, p.ok])) }),
    render(el, ctx) {
      el.classList.add('mqa-root');
      const a = ctx.ans; a.inc = a.inc || {}; a.exp = a.exp || {};
      const rv = !!(ctx.result || ctx.readonly), D = ctx.readonly ? 'disabled' : '';
      function draw() {
        el.innerHTML = `<div class="stack">${AXES.map(ax => {
          const pos = v => ((Math.max(ax.min, Math.min(ax.max, v)) - ax.min) / (ax.max - ax.min) * 100).toFixed(2) + '%';
          const zones = ax.zones.map(z => `<i class="${z[2]}" style="width:${((z[1] - z[0]) / (ax.max - ax.min) * 100).toFixed(2)}%"></i>`).join('');
          const marks = ax.pts.map((p, i) => { const x = p.x != null ? p.x : p.m; return `<i class="pt ${a.inc[p.id] ? 'sel' : ''}" style="left:${pos(x)}"></i><span class="pl ${i % 2 ? 'up' : ''}" style="left:${pos(x)}">${esc(p.l)}</span>`; }).join('');
          return `<div class="mqa-panel"><h4>${esc(ax.t)}</h4><div class="small muted">${esc(ax.q)}. Ось условная: точки разнесены, чтобы не слипались.</div>
            <div class="mqa-axis"><div class="ln">${zones}</div>${marks}</div>
            <div class="mqa-pts">${ax.pts.map(p => {
              const on = !!a.inc[p.id], ok = on && a.exp[p.id] === p.ok;
              const cls = rv ? (on ? (ok ? 'ok' : 'bad') : p.req ? 'bad' : '') : '';
              return `<div class="mqa-pr ${cls}"><button type="button" class="mqa-tg" data-inc="${p.id}" aria-pressed="${on}" ${D}><span class="bx" aria-hidden="true"></span><span><b>${esc(p.l)}</b></span></button>
                <select data-exp="${p.id}" aria-label="Ожидаемый результат для ${esc(p.l)}" ${on && !ctx.readonly ? '' : 'disabled'}><option value="">${on ? 'Ожидаемый результат…' : 'не в наборе'}</option>${ax.out.map(o => `<option value="${o.v}" ${a.exp[p.id] === o.v && on ? 'selected' : ''}>${esc(o.t)}</option>`).join('')}</select>
                ${rv && (on || p.req) ? `<div class="why">${p.req ? '<b>Обязательная.</b> ' : ''}${esc(p.why)}${on && !ok ? ' Ожидается: ' + esc(ax.out.find(o => o.v === p.ok).t) + '.' : ''}</div>` : ''}</div>`;
            }).join('')}</div></div>`;
        }).join('')}</div>`;
      }
      draw();
      el.addEventListener('click', e => {
        const b = e.target.closest('[data-inc]'); if (!b || ctx.readonly) return;
        const id = b.dataset.inc; a.inc[id] = !a.inc[id]; if (!a.inc[id]) { delete a.inc[id]; delete a.exp[id]; }
        ctx.save(); draw();
      });
      el.addEventListener('change', e => {
        const s = e.target.closest('[data-exp]'); if (!s || ctx.readonly) return;
        a.exp[s.dataset.exp] = s.value; ctx.save();
        if (s.dataset.exp === 'a300') ctx.decide('Ровно 3:00 до начала', s.value === 'free' ? 'бесплатно' : s.value);
      });
    },
    check(ans) {
      const ev = bdEval(ans), a = ans || {}, notes = [];
      const missReq = ev.req.filter(p => !(a.inc || {})[p.id]);
      if (missReq.length) notes.push({ ok: false, html: `Не хватает обязательных точек: ${missReq.map(p => esc(p.l)).join(', ')}. ${esc(missReq[0].why)}` });
      else notes.push({ ok: true, html: 'Все обязательные границы на месте.' });
      ev.sel.filter(p => (a.exp || {})[p.id] !== p.ok).forEach(p => notes.push({ ok: false, html: `${esc(p.l)}: ${(a.exp || {})[p.id] ? 'ожидание неверное' : 'ожидание не указано'}. ${esc(p.why)}` }));
      if (!ev.k300) notes.push({ ok: false, html: 'Ровно 3:00: «не позднее чем за 3 часа» включает саму границу — отмена бесплатная. Это главная точка спора в ISK-112.' });
      if (ev.extra > 4) notes.push({ ok: 'warn', html: `Выбрано ${ev.extra} необязательных точек: у Лизы десяток проверок, середины классов дублируют друг друга.` });
      return { ok: ev.ok, score: ev.score, notes, summary: `Обязательные границы: ${ev.got.length} из ${ev.req.length}; верных ожиданий: ${ev.right.length} из ${ev.sel.length}.`,
        mentor: (a.inc || {}).a300 && (a.exp || {}).a300 === 'late' ? 'Вы прочитали «не позднее чем за 3 часа» как «больше трёх часов» — ровно как Глеб в коде. Если аналитик сам путается, значит, в требовании надо прямо написать: «ровно 3:00 — ещё бесплатно».' : null };
    },
    explain: `<p>Для каждой границы — три точки: на ней и по обе стороны. <b>BR-3:</b> 3:01 (бесплатно), 3:00 (бесплатно — граница включается словами «не позднее чем»), 2:59 (поздно), плюс недопустимый класс «запись уже началась» — отмена недоступна. <b>BR-2:</b> 1:59 (отказ), 2:00 (можно), ровно 30 суток (можно), следующий слот после 30 суток (отказ).</p>
      <p>Середины классов («за сутки», «1:00», «7 дней») проверяют, если остаётся время, но они ловят меньше ошибок. Недопустимые значения («время в прошлом») — отдельный класс: на интерфейсе их не выбрать, а через API отправить можно.</p>
      <p class="small muted">Источники: ISTQB Foundation Level Syllabus — тест-дизайн по классам эквивалентности и граничным значениям; Л. Копланд, «Практическое руководство по разработке тестов»; Г. Майерс, «Искусство тестирования программ».</p>`,
    refNote: 'Необязательные точки (середины классов, 2:01, 0:01, «в прошлом») не снижают балл, если их не больше четырёх и ожидания для них верны.',
    report: ans => { const a = ans || {}, ev = bdEval(a); return AXES.map(ax => `${ax.id.toUpperCase()}: ${ax.pts.filter(p => (a.inc || {})[p.id]).map(p => `${p.l} → ${(ax.out.find(o => o.v === (a.exp || {})[p.id]) || { t: '?' }).t}${(a.exp || {})[p.id] === p.ok ? '' : ' ✗'}`).join('; ') || '—'}`).join('\n') + `\nБалл ${Math.round(ev.score * 100)} %`; }
  };

  // =====================================================================
  // Практика 3. Триаж баг-репортов
  // =====================================================================
  const TYPES = [{ v: 'code', t: 'Дефект кода' }, { v: 'req', t: 'Дефект требований' }, { v: 'no', t: 'Не баг' }];
  const SEV = [{ v: 'crit', t: 'Критическая' }, { v: 'major', t: 'Значительная' }, { v: 'minor', t: 'Незначительная' }, { v: 'triv', t: 'Тривиальная' }];
  const PRI = [{ v: 'high', t: 'Высокий' }, { v: 'med', t: 'Средний' }, { v: 'low', t: 'Низкий' }];
  const BUGS = [
    { id: 'b1', t: 'Отмена ровно за 3:00 засчитывается как поздняя', d: 'Запись на 15:00, отмена в 12:00:00. Засчитана неявка, предоплата 500 ₽ не вернулась. В ISK-112: «ровно 3:00 — ещё бесплатно».', type: 'code', sev: ['major', 'crit'], pri: ['high'],
      why: 'Расходится с требованием — дефект кода. Значительная: деньги клиента и неявка, которая через две таких — предоплата. Высокий: это главное правило задачи.' },
    { id: 'b2', t: 'Опечатка на кнопке: «Отменить запсиь»', d: 'Карточка записи в приложении, iOS и Android. В макете Ники текст верный.', type: 'code', sev: ['triv', 'minor'], pri: ['high', 'med'],
      why: 'Код расходится с макетом. Тривиальная — ничего не ломает. Но приоритет высокий: видит каждый клиент, а в пятницу демо.' },
    { id: 'b3', t: 'Перенос недоступен за 2 часа до начала', d: 'Клиент хотел перенести запись на завтра за 2 часа до начала — кнопки «Перенести» нет, только поздняя отмена.', type: 'no', sev: [], pri: [],
      why: 'Работает по требованию: меньше 3 часов — перенос недоступен (журнал решений от 16.11). Не баг. Если клиенты будут жаловаться — пожелание в бэклог, решает владелец продукта.' },
    { id: 'b4', t: 'При отмене с оплатой по СБП деньги не возвращаются', d: 'Бесплатная отмена за 5 часов. Оплата картой — возврат приходит. Оплата через СБП — статус возврата «ошибка», деньги у «Искры».', type: 'code', sev: ['crit'], pri: ['high'],
      why: 'В требовании: возврат тем же способом, каким платили. Критическая: деньги клиентов, претензии по закону о защите прав потребителей. Высокий — без исправления не выпускать.' },
    { id: 'b5', t: 'Водителю «Шашки» засчитали неявку за отмену за час', d: 'Корпоративная запись таксопарка. Завгар Рустам переставил машину на другой день — водитель отменил за час, системе засчитана неявка, после двух — предоплата 500 ₽.', type: 'req', sev: ['major', 'minor'], pri: ['high', 'med'],
      why: 'Система работает по ISK-112, но требование не учло корпоративных клиентов: правило неявок для физлиц не подходит машинам таксопарка, которыми управляет завгар. Дефект требований — уточнить у Рустама и Марины Олеговны, новая версия.' },
    { id: 'b6', t: 'Бесплатная отмена доступна после начала записи', d: 'Запись на 15:00. В 15:10 клиент отменяет — отмена проходит как бесплатная.', type: 'code', sev: ['crit', 'major'], pri: ['high'],
      why: 'Противоречит BR-3 и BR-4: после начала отмены нет, через 15 минут — неявка. Обход правила неявок бьёт прямо по цели «17 % → 8 %». Критическая или значительная, приоритет высокий.' },
    { id: 'b7', t: 'После отмены резерв запчастей в 1С не снимается', d: 'Запись на ТО с резервом фильтров (BR-12). После отмены резерв висит 3 дня, Алия видит «нет в наличии», другие записи на ТО не создаются.', type: 'req', sev: ['major', 'minor'], pri: ['med', 'high'],
      why: 'В ISK-112 ничего не сказано о резерве: разработчик сделал ровно то, что написано. Пробел в требованиях — связь отмены с BR-12. Аналитик дописывает и согласует с Алией.' },
    { id: 'b8', t: 'Отменённая запись не исчезла из «Моих записей»', d: 'После отмены запись осталась в списке серой, с пометкой «Отменена».', type: 'no', sev: [], pri: [],
      why: 'Так и задумано: запись не удаляется, хранится со статусом «Отменена» и показывается в истории. Не баг — дефект отклоняется со ссылкой на требование и макет.' }
  ];
  function trEval(a) {
    const v = (a && a.v) || {}, per = {};
    let sum = 0, typeOk = 0;
    BUGS.forEach(b => {
      const x = v[b.id] || {}, tOk = x.type === b.type;
      let s = 0, sevOk = null, priOk = null;
      if (b.type === 'no') s = tOk ? 1 : 0;
      else { sevOk = b.sev.includes(x.sev); priOk = b.pri.includes(x.pri); s = (tOk ? 0.5 : 0) + (sevOk ? 0.25 : 0) + (priOk ? 0.25 : 0); }
      if (tOk) typeOk++;
      per[b.id] = { s, tOk, sevOk, priOk }; sum += s;
    });
    const score = sum / BUGS.length;
    return { per, score, typeOk, ok: score >= 0.8 && typeOk >= BUGS.length - 1 };
  }
  const triageTask = {
    id: 'triage', title: 'Триаж восьми баг-репортов',
    simple: howBugs.simple,
    lead: ui.brief({
      situation: 'Перемотаем на 2 декабря, конец первого спринта. Лиза завела восемь отчётов по отмене записи, Глеб половину закрыл с пометкой «работает по ТЗ». Артём: «Разберитесь втроём до обеда: что чиним, что дописываем в требованиях, что закрываем».',
      todo: [
        'Для каждого отчёта выберите вид: дефект кода, дефект требований или не баг.',
        'Для дефектов укажите серьёзность и приоритет. Для «не бага» их можно не заполнять.',
        'Нажмите «Проверить». Засчитывается от 80 %, ошибиться в виде можно не больше одного раза.'
      ],
      look: 'Сначала откройте требование: расходится ли поведение с ним? Если нет — верно ли само требование? Серьёзность — про вред, приоритет — про очередь.'
    }),
    blank: () => ({ v: {} }),
    reference: () => ({ v: Object.fromEntries(BUGS.map(b => [b.id, b.type === 'no' ? { type: 'no' } : { type: b.type, sev: b.sev[0], pri: b.pri[0] }])) }),
    render(el, ctx) {
      el.classList.add('mqa-root');
      const a = ctx.ans; a.v = a.v || {};
      const rv = !!(ctx.result || ctx.readonly), D = ctx.readonly ? 'disabled' : '', ev = trEval(a);
      const sel = (id, k, list, ph) => { const x = a.v[id] || {}; return `<select data-b="${id}" data-k="${k}" aria-label="${ph}" ${D}><option value="">${ph}</option>${list.map(o => `<option value="${o.v}" ${x[k] === o.v ? 'selected' : ''}>${esc(o.t)}</option>`).join('')}</select>`; };
      el.innerHTML = `<div class="stack">${BUGS.map((b, i) => {
        const p = ev.per[b.id], cls = rv ? (p.s >= 0.99 ? 'ok' : p.s >= 0.5 ? 'warn' : 'bad') : '';
        return `<div class="mqa-bug ${cls}"><div class="hd"><span class="mqa-lbl">BUG-${201 + i}</span><b>${esc(b.t)}</b></div><div class="small">${esc(b.d)}</div>
          <div class="sel">${sel(b.id, 'type', TYPES, 'Вид')}${sel(b.id, 'sev', SEV, 'Серьёзность')}${sel(b.id, 'pri', PRI, 'Приоритет')}</div>
          ${rv ? `<div class="mqa-why">${esc(b.why)}</div>` : ''}</div>`;
      }).join('')}</div>`;
      el.addEventListener('change', e => {
        const s = e.target.closest('[data-b]'); if (!s || ctx.readonly) return;
        const x = a.v[s.dataset.b] = a.v[s.dataset.b] || {}; x[s.dataset.k] = s.value; ctx.save();
        if (s.dataset.k === 'type') ctx.decide('Триаж ' + s.dataset.b, (TYPES.find(t => t.v === s.value) || { t: '—' }).t);
      });
    },
    check(ans) {
      const ev = trEval(ans), v = (ans && ans.v) || {}, notes = [];
      BUGS.forEach((b, i) => {
        const p = ev.per[b.id], x = v[b.id] || {}, n = `BUG-${201 + i}`;
        if (!x.type) { notes.push({ ok: false, html: `${n}: вид не выбран.` }); return; }
        if (!p.tOk) notes.push({ ok: false, html: `${n} «${esc(b.t)}»: не «${esc(TYPES.find(t => t.v === x.type).t)}». ${b.type === 'no' ? 'Что сказано в требовании про это поведение?' : b.type === 'req' ? 'Код сделал то, что написано. А написано ли всё, что нужно бизнесу?' : 'Сравните с требованием: оно здесь однозначно.'}` });
        else if (b.type === 'no' || (p.sevOk && p.priOk)) notes.push({ ok: true, html: `${n}: верно.` });
        else notes.push({ ok: 'warn', html: `${n}: вид верный, но ${!p.sevOk ? 'серьёзность ' : ''}${!p.sevOk && !p.priOk ? 'и ' : ''}${!p.priOk ? 'приоритет ' : ''}спорные. ${esc(b.why)}` });
      });
      return { ok: ev.ok, score: ev.score, notes, summary: `Вид верно у ${ev.typeOk} из ${BUGS.length}; общий балл ${Math.round(ev.score * 100)} %.`,
        mentor: (v.b5 || {}).type === 'code' || (v.b7 || {}).type === 'code' ? 'Глеб закрыл бы эти отчёты «работает по ТЗ» — и был бы прав. Код сделал написанное, а пробел — в требованиях. Признать дефект требований — не стыдно; стыдно молча чинить в коде без новой версии.' : (v.b8 || {}).type === 'code' ? 'Отменённая запись в истории — это требование, а не ошибка. Если не сверяться с требованием, команда «чинит» то, что сделано правильно.' : null };
    },
    explain: `<ul class="checks">
        <li><b>Дефекты кода</b> (BUG-201, 202, 204, 206): поведение расходится с требованием или макетом. Отчёт — разработчику, после исправления — перепроверка и регресс.</li>
        <li><b>Дефекты требований</b> (BUG-205 «Шашка», 207 резерв запчастей): код сделал написанное, но требование не учло корпоративных клиентов и связь с BR-12. Аналитик уточняет у бизнеса, выпускает новую версию ISK-112, Лиза добавляет тесты.</li>
        <li><b>Не баги</b> (BUG-203 перенос, 208 серая запись): работает как задумано. Отчёт отклоняется со ссылкой на требование; пожелание — в бэклог, если бизнес захочет.</li>
        <li><b>Серьёзность ≠ приоритет:</b> опечатка тривиальна, но перед демо — высокий приоритет; деньги по СБП — критично и срочно.</li>
      </ul>
      <p class="small muted">Источники: ISTQB Foundation Level — управление дефектами; IEEE 1044 — классификация аномалий ПО; К. Вигерс, Дж. Битти — дефекты требований и их стоимость.</p>`,
    refNote: 'Для серьёзности и приоритета засчитываются соседние разумные значения (например, «критическая» или «значительная» для бесплатной отмены после начала).',
    report: ans => { const v = (ans && ans.v) || {}; return BUGS.map((b, i) => { const x = v[b.id] || {}; return `BUG-${201 + i} ${b.t}: ${(TYPES.find(t => t.v === x.type) || { t: '—' }).t}, ${(SEV.find(t => t.v === x.sev) || { t: '—' }).t}, ${(PRI.find(t => t.v === x.pri) || { t: '—' }).t}`; }).join('\n'); }
  };

  // =====================================================================
  // Практика 4. Лаборатория: Лиза гоняет сборку по вашим критериям
  // =====================================================================
  const LG = [
    { v: 'g4', t: 'запись на 15:00, предоплаты нет, сейчас 11:00 (за 4 часа)', k: 'free' },
    { v: 'g301', t: 'запись на 15:00, предоплаты нет, сейчас 11:59 (за 3 ч 01 мин)', k: 'free' },
    { v: 'g300', t: 'запись на 15:00, предоплаты нет, сейчас 12:00 (ровно за 3 часа)', k: 'free' },
    { v: 'g259', t: 'запись на 15:00, предоплаты нет, сейчас 12:01 (за 2 ч 59 мин)', k: 'late' },
    { v: 'gpay', t: 'запись на 15:00 с предоплатой 500 ₽ через СБП, сейчас 11:00', k: 'free', pay: true },
    { v: 'gst', t: 'запись на 15:00, сейчас 15:05 (запись уже началась)', k: 'start' },
    { v: 'gvg', t: 'у клиента есть запись', k: 'vague' }
  ];
  const LW = [
    { v: 'wc', t: 'клиент нажимает «Отменить» и подтверждает' },
    { v: 'w2', t: 'клиент дважды быстро нажимает «Подтвердить отмену»' },
    { v: 'wo', t: 'клиент открывает карточку записи' },
    { v: 'wvg', t: 'клиент работает с записью' }
  ];
  const LT = [
    { v: 'st', t: 'запись в статусе «Отменена»' },
    { v: 'free', t: 'отмена бесплатная, неявка не засчитана' },
    { v: 'late', t: 'отмена поздняя, засчитана неявка' },
    { v: 'ref', t: '500 ₽ вернулись тем же способом, пришёл чек возврата' },
    { v: 'slot', t: 'слот 15:00 снова доступен для записи' },
    { v: 'once', t: 'ровно одна отмена и одно уведомление, без дублей' },
    { v: 'blk', t: 'кнопки «Отменить» нет, показано «Запись уже началась»' },
    { v: 'okk', t: 'всё работает корректно' }
  ];
  const DEF = {
    D1: { t: 'Ровно 3:00 считается поздней отменой («> 3 ч» вместо «≥»)', esc: 'Елена Смирнова отменила запись ровно за 3 часа — ей засчитали неявку. Через неделю — вторая такая же, и онлайн-запись для неё только с предоплатой. Жалоба Марине Олеговне и отзыв «обманывают» в Яндекс Картах.' },
    D2: { t: 'Возврат по СБП не уходит', esc: '23 клиента за первую неделю ждут возврат предоплаты по СБП. Ольга Викторовна вручную сверяет платежи с ЮKassa, двое пишут претензии.' },
    D3: { t: 'Двойное нажатие создаёт две отмены и два уведомления', esc: 'Клиенты получают по два push и SMS, а по записям с предоплатой — два возврата по 500 ₽: 11 случаев за неделю.' },
    D4: { t: 'Слот после отмены не освобождается', esc: 'Отменённые слоты остаются «занятыми»: сайт показывает «нет мест», посты простаивают — ровно то, с чем проект боролся (неявки 17 % → 8 %).' },
    D5: { t: 'После начала записи кнопка «Отменить» доступна, отмена — бесплатная', esc: 'Клиенты, опаздывающие на запись, отменяют её «бесплатно» задним числом. Правило неявок (BR-4) обходится, статистика неявок врёт.' }
  };
  const DKEYS = Object.keys(DEF);
  // ожидание по правилам: true — верно, false — противоречит правилам, null — неприменимо
  function expect(g, w, t) {
    const G = LG.find(x => x.v === g);
    if (!G || G.k === 'vague' || w === 'wvg') return 'vague';
    if (t === 'okk') return 'vague';
    if (G.k === 'start') {
      if (w === 'w2') return null;
      return t === 'blk' ? true : false;
    }
    if (w === 'wo') return null;
    if (t === 'blk') return false;
    if (t === 'once') return w === 'w2' ? true : null;
    if (t === 'st' || t === 'slot') return true;
    if (t === 'free') return G.k === 'free';
    if (t === 'late') return G.k === 'late';
    if (t === 'ref') return G.pay ? true : null;
    return null;
  }
  // как ведёт себя сборка 0.4: какой дефект проявится на этой проверке
  function buildFail(g, w, t) {
    const G = LG.find(x => x.v === g); if (!G) return null;
    if (G.k === 'start') return t === 'blk' && (w === 'wc' || w === 'wo') ? 'D5' : null;
    if (w !== 'wc' && w !== 'w2') return null;
    if (g === 'g300' && t === 'free') return 'D1';
    if (G.pay && t === 'ref') return 'D2';
    if (w === 'w2' && t === 'once') return 'D3';
    if (t === 'slot') return 'D4';
    return null;
  }
  // сборка на 3:00 даёт «поздно» — ошибочный критерий «late» на g300 проходит
  function labRun(a) {
    const sc = ((a && a.sc) || []).filter(s => s && (s.g || s.w || (s.t && s.t.length)));
    const caught = new Set(), rows = [];
    let wrong = 0, vague = 0, falseBug = 0, hidden = false;
    sc.forEach((s, i) => {
      const res = [];
      if (!s.g || !s.w || !(s.t || []).length) { rows.push({ i, res: [{ k: 'warn', t: 'Сценарий не дописан: нужны Дано, Когда и хотя бы одно Тогда.' }] }); vague++; return; }
      (s.t || []).forEach(t => {
        const e = expect(s.g, s.w, t), T = LT.find(x => x.v === t).t;
        if (e === 'vague') { vague++; res.push({ k: 'warn', t: `«${T}» — Лиза: ${s.g === 'gvg' || s.w === 'wvg' ? '«Какая запись? За сколько до начала? Что именно делает клиент?» Сценарий не выполнить.' : '«Корректно — это как? Проверила, что не упало».'}` }); return; }
        if (e === null) { res.push({ k: 'info', t: `«${T}» — неприменимо к этому сценарию. Лиза пропустила проверку.` }); return; }
        if (e === false) {
          wrong++;
          if (s.g === 'g300' && t === 'late' && (s.w === 'wc' || s.w === 'w2')) { hidden = true; res.push({ k: 'bad', t: `«${T}» — тест прошёл: сборка тоже считает 3:00 поздней. Но по BR-3 это ошибка — критерий спрятал дефект.` }); }
          else { falseBug++; res.push({ k: 'bad', t: `«${T}» — противоречит правилам «Искры». Лиза завела дефект, Глеб полдня доказывал, что сборка права.` }); }
          return;
        }
        const d = buildFail(s.g, s.w, t);
        if (d) { caught.add(d); res.push({ k: 'ok', t: `«${T}» — ✕ дефект найден: ${DEF[d].t}.` }); }
        else res.push({ k: 'pass', t: `«${T}» — ✓ прошло.` });
      });
      rows.push({ i, res });
    });
    return { rows, caught: DKEYS.filter(k => caught.has(k)), escaped: DKEYS.filter(k => !caught.has(k)), wrong, vague, falseBug, hidden, n: sc.length };
  }
  function labEval(a) {
    const r = labRun(a), c = r.caught.length;
    const score = Math.max(0, c / 5 * 0.7 + (1 - Math.min(1, (r.wrong + r.vague) / 3)) * 0.3);
    return { r, score, ok: score >= 0.8 && c >= 4 && r.caught.includes('D1') && r.wrong === 0 };
  }
  const NSC = 5;
  const blankSc = () => Array.from({ length: NSC }, () => ({ g: '', w: '', t: [] }));
  const labTask = {
    id: 'lab', title: 'Лаборатория: Лиза гоняет сборку по вашим критериям',
    simple: howBounds.simple,
    lead: ui.brief({
      situation: 'Перемотаем на 3 декабря. На стенде сборка 0.4 с отменой записи. В ней есть дефекты — вы их не видите. До демо Лиза успеет пройти пять сценариев и проверит <b>ровно то, что вы напишете</b> в критериях приёмки: ни больше, ни меньше. Что вы не описали — уйдёт к клиентам.',
      todo: [
        'Соберите до пяти сценариев: Дано, Когда и одно или несколько Тогда.',
        'Нажмите «▶ Лиза гоняет сборку 0.4» — увидите, что прошло, что найдено и что ушло в релиз. Можно менять сценарии и прогонять снова.',
        'Нажмите «Проверить». Засчитывается от 80 %: найдено не меньше 4 дефектов из 5, обязательно — дефект ровно на 3:00, и ни одного критерия, противоречащего правилам.'
      ],
      look: 'Подумайте как тестировщик: где граница, что с деньгами, что будет, если нажать дважды, что после начала записи, что с самим слотом. Каждое Тогда — то, что видно снаружи.'
    }),
    blank: () => ({ sc: blankSc(), ran: false }),
    reference: () => ({ sc: [
      { g: 'g300', w: 'wc', t: ['st', 'free', 'slot'] },
      { g: 'gpay', w: 'wc', t: ['st', 'ref'] },
      { g: 'g4', w: 'w2', t: ['once'] },
      { g: 'gst', w: 'wo', t: ['blk'] },
      { g: 'g259', w: 'wc', t: ['st', 'late'] }
    ], ran: true }),
    render(el, ctx) {
      el.classList.add('mqa-root');
      const a = ctx.ans; if (!Array.isArray(a.sc)) a.sc = blankSc();
      while (a.sc.length < NSC) a.sc.push({ g: '', w: '', t: [] });
      const rv = !!(ctx.result || ctx.readonly), D = ctx.readonly ? 'disabled' : '';
      el.innerHTML = `<div class="stack">${ui.say('liza', 'Проверю всё, что напишете. Но только то, что напишете, — фантазировать за аналитика не буду. Времени до демо на пять сценариев.')}<div class="stack" data-scs></div><div data-run></div><div data-out></div></div>`;
      function scs() {
        TR.$('[data-scs]', el).innerHTML = a.sc.map((s, i) => {
          const g = LG.find(x => x.v === s.g), w = LW.find(x => x.v === s.w);
          const pv = s.g || s.w || s.t.length ? `<div class="mqa-gh"><b>Сценарий ${i + 1}</b>\n<b>Дано</b> ${esc(g ? g.t : '…')}\n<b>Когда</b> ${esc(w ? w.t : '…')}\n<b>Тогда</b> ${s.t.length ? s.t.map(t => esc(LT.find(x => x.v === t).t)).join('\n<b>И</b> ') : '…'}</div>` : '';
          return `<div class="mqa-sc"><div class="row between"><span class="mqa-lbl">Сценарий ${i + 1}</span>${!ctx.readonly && (s.g || s.w || s.t.length) ? `<button type="button" class="btn ghost xs" data-clr="${i}">Очистить</button>` : ''}</div>
            <div class="row2"><b>Дано</b><select data-g="${i}" aria-label="Дано, сценарий ${i + 1}" ${D}><option value="">—</option>${LG.map(o => `<option value="${o.v}" ${s.g === o.v ? 'selected' : ''}>${esc(o.t)}</option>`).join('')}</select></div>
            <div class="row2"><b>Когда</b><select data-w="${i}" aria-label="Когда, сценарий ${i + 1}" ${D}><option value="">—</option>${LW.map(o => `<option value="${o.v}" ${s.w === o.v ? 'selected' : ''}>${esc(o.t)}</option>`).join('')}</select></div>
            <div class="row2"><b>Тогда</b><div class="mqa-chips">${LT.map(o => `<button type="button" class="chip" data-t="${i}" data-v="${o.v}" aria-pressed="${s.t.includes(o.v)}" ${D}>${esc(o.t)}</button>`).join('')}</div></div>${pv}</div>`;
        }).join('');
      }
      function out() {
        const any = a.sc.some(s => s.g || s.w || s.t.length);
        TR.$('[data-run]', el).innerHTML = ctx.readonly ? '' : `<div class="row"><button type="button" class="btn primary" data-go ${any ? '' : 'disabled'}>▶ Лиза гоняет сборку 0.4</button><span class="small dim">${any ? 'Можно менять сценарии и прогонять снова.' : 'Сначала соберите хотя бы один сценарий.'}</span></div>`;
        if (!any || !(a.ran || rv)) { TR.$('[data-out]', el).innerHTML = ''; return; }
        const r = labRun(a);
        const ev = [];
        r.escaped.forEach(k => ev.push({ d: 'после релиза', t: DEF[k].esc, k: 'bad' }));
        if (r.hidden) ev.push({ d: 'демо', t: 'Марина Олеговна на демо отменяет запись ровно за 3 часа и видит «поздняя отмена». «Мы же договаривались!» — критерий был написан неверно, и тест его «подтвердил».', k: 'bad' });
        if (r.falseBug) ev.push({ d: '3 декабря', t: `${r.falseBug} ложн. дефект(а): критерий противоречил правилам, Лиза и Глеб потратили полдня на спор.`, k: 'warn' });
        if (!r.escaped.length) ev.push({ d: '15 марта', t: 'Отмена записи выходит в релиз без известных дефектов. Неявки начинают снижаться: клиенты отменяют заранее, слоты достаются другим.', k: 'ok' });
        TR.$('[data-out]', el).innerHTML = `<div class="mqa-res"><div class="eyebrow">Результат прогона сборки 0.4</div>
          <div class="mqa-stats">${st('Найдено', r.caught.length + ' из 5', r.caught.length >= 4 ? 'ok' : r.caught.length >= 2 ? 'warn' : 'bad', 'дефектов')}${st('Ушло в релиз', r.escaped.length, r.escaped.length ? 'bad' : 'ok', 'к клиентам')}${st('Ошибочных', r.wrong, r.wrong ? 'bad' : 'ok', 'критериев')}${st('Неясных', r.vague, r.vague ? 'warn' : 'ok', 'Лиза не смогла')}</div>
          ${r.rows.map(row => `<div class="mqa-panel"><span class="mqa-lbl">Сценарий ${row.i + 1}</span><ul class="checks">${row.res.map(x => `<li class="${x.k === 'ok' ? '' : x.k === 'pass' ? 'info' : x.k}">${esc(x.t)}</li>`).join('')}</ul></div>`).join('')}
          <div class="mqa-tl">${ev.map(x => `<div class="mqa-ev ${x.k}"><span class="t">${esc(x.d)}</span><span>${esc(x.t)}</span></div>`).join('')}</div></div>`;
      }
      scs(); out();
      const changed = () => { a.ran = false; ctx.save(); scs(); out(); };
      el.addEventListener('change', e => {
        if (ctx.readonly) return;
        const g = e.target.closest('[data-g]'), w = e.target.closest('[data-w]');
        if (g) a.sc[+g.dataset.g].g = g.value; else if (w) a.sc[+w.dataset.w].w = w.value; else return;
        changed();
      });
      el.addEventListener('click', e => {
        if (ctx.readonly) return;
        const t = e.target.closest('[data-t]'), c = e.target.closest('[data-clr]'), go = e.target.closest('[data-go]');
        if (t) { const s = a.sc[+t.dataset.t]; s.t = s.t.includes(t.dataset.v) ? s.t.filter(x => x !== t.dataset.v) : s.t.concat(t.dataset.v); changed(); }
        else if (c) { a.sc[+c.dataset.clr] = { g: '', w: '', t: [] }; changed(); }
        else if (go) {
          a.ran = true; ctx.save(); out();
          const r = labRun(a); ctx.decide('Лаборатория QA: найдено дефектов', `${r.caught.length} из 5`);
          const o = TR.$('[data-out]', el); o && o.scrollIntoView && o.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
      });
    },
    check(ans) {
      const ev = labEval(ans), r = ev.r, notes = [];
      if (!r.n) return { ok: false, score: 0, notes: [{ ok: false, html: 'Нет ни одного сценария.' }], summary: 'Сценариев нет.' };
      notes.push({ ok: r.caught.length >= 4 ? true : r.caught.length >= 2 ? 'warn' : false, html: `Найдено ${r.caught.length} из 5 дефектов.` });
      const hint = { D1: 'Где граница BR-3 и с какой стороны ровно 3:00?', D2: 'Что с деньгами, если платили не картой?', D3: 'Что будет, если клиент нажмёт дважды — телефон в трясущейся маршрутке?', D4: 'Отмена освобождает пост для других клиентов — кто это проверил?', D5: 'А что видит клиент, если запись уже началась?' };
      r.escaped.forEach(k => notes.push({ ok: false, html: `Ушло к клиентам: ${esc(DEF[k].t)}. ${hint[k]}` }));
      if (r.wrong) notes.push({ ok: false, html: `${r.wrong} критери${r.wrong === 1 ? 'й противоречит' : 'я противоречат'} правилам «Искры». Ошибочный критерий опаснее отсутствующего: он «подтверждает» дефект${r.hidden ? ' — как случилось с ровно 3:00' : ''}.` });
      if (r.vague) notes.push({ ok: 'warn', html: `${r.vague} неясн. проверок: «корректно», «есть запись», «работает с записью» — Лизе нечего сравнивать.` });
      return { ok: ev.ok, score: ev.score, notes, summary: `Найдено ${r.caught.length}/5, ошибочных критериев ${r.wrong}, неясных ${r.vague}.`,
        mentor: r.hidden ? 'Вот почему критерии приёмки пишет тот, кто знает правило, а Лиза задаёт вопросы. Сборка ошиблась так же, как критерий, — и тест прошёл. Две ошибки, которые совпали, выглядят как успех.' : r.caught.length <= 2 ? 'Удачный путь проверен — а дефекты живут по краям: граница, деньги, двойное нажатие, «уже началось». Критерии приёмки — это в первую очередь края.' : null };
    },
    explain: `<ul class="checks">
        <li><b>Граница:</b> «ровно 3:00 → бесплатно, слот свободен» ловит и «> 3 ч» (D1), и неосвобождённый слот (D4). А сценарий 2:59 → поздно подтверждает вторую сторону границы.</li>
        <li><b>Деньги — отдельным сценарием:</b> предоплата через СБП и «вернулись тем же способом, пришёл чек» (D2). Платёжные способы ведут себя по-разному.</li>
        <li><b>Повторное действие:</b> двойное нажатие → «ровно одна отмена» (D3). Это классика: сеть тормозит, клиент жмёт ещё раз.</li>
        <li><b>Недопустимый класс:</b> запись уже началась → кнопки нет (D5).</li>
        <li><b>Ошибочный критерий хуже отсутствующего.</b> «Ровно 3:00 → поздно» превращает дефект в «пройденный тест». Размытый критерий («корректно») не проверяет ничего.</li>
      </ul>
      <p>Тестировщик проверяет по критериям, которые вы написали. Поэтому критерии приёмки — не формальность в конце постановки, а главный инструмент качества, и их стоит пройти с Лизой и Глебом на трёх амиго.</p>
      <p class="small muted">Источники: Г. Аджич, «Спецификация на примерах»; Дэн Норт — BDD и Given/When/Then; ISTQB Foundation Level — тест-дизайн на основе спецификации; Л. Криспин, Дж. Грегори, «Гибкое тестирование».</p>`,
    refNote: 'Засчитываются и другие наборы: например, предоплата через СБП в сценарии с двойным нажатием или 3:01 вместо 4 часов — если найдено не меньше 4 дефектов, включая 3:00, и нет ошибочных критериев.',
    report: ans => { const a = ans || {}, ev = labEval(a); return (a.sc || []).filter(s => s.g || s.w || (s.t || []).length).map((s, i) => `${i + 1}. Дано ${(LG.find(x => x.v === s.g) || { t: '—' }).t}; Когда ${(LW.find(x => x.v === s.w) || { t: '—' }).t}; Тогда ${(s.t || []).map(t => LT.find(x => x.v === t).t).join(' и ') || '—'}`).join('\n') + `\nНайдено ${ev.r.caught.length}/5 (${ev.r.caught.join(', ') || '—'}), ошибочных ${ev.r.wrong}, неясных ${ev.r.vague}`; }
  };

  // =====================================================================
  // Практика 5. Ответ Артёму своими словами
  // =====================================================================
  const W_RUBRIC = [
    'Ревью требований тестировщиком до кода (shift-left) ловит ошибки там, где исправление стоит минуты, а не дни: пример «ровно 3:00»',
    'Вопрос «как я это проверю?» делает требование однозначным и измеримым — это нужно не только Лизе, но и Глебу, и заказчику',
    'Критерии Дано/Когда/Тогда и граничные значения (3:01, 3:00, 2:59) — общий язык аналитика, разработчика и QA; по ним пишут тест-кейсы и автотесты',
    'Часть «багов» — дефекты требований (корпоративные клиенты, резерв запчастей): их находит чтение требований, а не тест сборки; чинит аналитик новой версией',
    'Без требований спор «баг или фича» решается на демо и в претензиях клиентов; с ними — сверкой с документом',
    'Вывод про сроки и деньги: меньше возвратов из тестирования и дефектов у клиентов, предсказуемый спринт — это ускоряет путь к 15 марта'
  ];
  const W_REF = 'Артём, Лиза сейчас читает не ради бумаги — она тестирует самое дешёвое место, текст требований. За один час она нашла «удобно», «поздно» и «санкции», которые я не смогла бы защитить ни перед Глебом, ни перед Мариной Олеговной. Главная находка — «ровно 3:00»: Глеб в коде написал «больше трёх часов», а по правилу это ещё бесплатно. Исправить фразу сейчас — минута; найти это на демо или в жалобе клиентки — переделка, повторный тест и испорченное доверие. Теперь у нас критерии в формате «Дано / Когда / Тогда» с точками 3:01, 3:00 и 2:59: Лиза по ним пишет тест-кейсы, Глеб — автотесты, а заказчик читает то же самое. Ещё Лиза задала вопросы, на которые кодом не ответишь: что с водителями «Шашки» и с резервом запчастей при отмене — это пробелы в моих требованиях, и лучше закрыть их сейчас новой версией, чем спорить в спринте «баг это или фича». Да, это пара часов Лизы до спринта, зато в спринте меньше возвратов задач, меньше дефектов у клиентов и предсказуемое демо. Для 15 марта это быстрее, а не медленнее.';
  const whyTask = {
    id: 'why', title: 'Ответ Артёму: зачем Лизе требования до кода',
    simple: howBugs.simple,
    lead: ui.brief({
      situation: 'Артём заглядывает в переговорную, где вы с Лизой второй час сидите над ISK-112: «Зачем Лиза сейчас читает требования? Сборки ещё нет. Пусть тестирует, когда Глеб доделает, — а сейчас займётся регрессом АРМ. У нас сроки».',
      todo: [
        'Ответьте Артёму своими словами: 6–10 предложений, от 300 символов. Он руководитель проекта — говорите о сроках, переделках и рисках.',
        'Опирайтесь на сегодняшнее: размытые требования, ровно 3:00, Дано/Когда/Тогда, дефекты требований, лабораторию со сборкой 0.4.',
        'Нажмите «Проверить с Верой (Claude)» или «Сверить с эталоном самому» и отметьте пункты, которые у вас прозвучали. Затем «Проверить». Засчитывается от 60 %.'
      ],
      look: 'Не защищайте Лизу — защищайте сроки. Сильный ответ показывает, что два часа сейчас экономят дни в спринте, и приводит конкретный пример.'
    }),
    blank: () => ({ j: {} }),
    reference: () => ({ j: { text: W_REF, self: W_RUBRIC.map(() => true) } }),
    render(el, ctx) {
      el.classList.add('mqa-root');
      const a = ctx.ans; a.j = a.j || {};
      el.innerHTML = ui.say('artem', 'Зачем Лиза сейчас читает требования? Сборки ещё нет. Пусть тестирует, когда Глеб доделает. У нас сроки.') + ui.say('liza', 'Я могу и потом. Только потом будет дороже…') + '<div style="margin-top:12px"></div>';
      const j = document.createElement('div'); el.appendChild(j);
      ui.justify(j, {
        id: 'mqa-why', q: 'Ответ Артёму: зачем тестировщику читать требования до разработки?', placeholder: 'Артём, …',
        qPlain: 'Руководитель проекта считает, что тестировщику незачем читать требования до появления сборки. Объясните на кейсе сети автосервисов «Искра» (задача «Отмена записи», правило «бесплатная отмена не позднее чем за 3 часа», граничные значения 3:01 / 3:00 / 2:59, критерии в формате Дано/Когда/Тогда, дефекты требований), почему раннее ревью требований QA экономит время и деньги.',
        rubric: W_RUBRIC, reference: W_REF, value: a.j, readonly: ctx.readonly, minLen: 300,
        onChange: v => { a.j = v; ctx.save(); ctx.decide('Ответ Артёму про раннее подключение QA', v.text || ''); }
      });
    },
    check(ans) {
      const j = (ans && ans.j) || {}, s = ui.justifyScore(j), t = (j.text || '').trim(), notes = [];
      if (t.length < 300) notes.push({ ok: false, html: `Ответ короче 300 символов (${t.length}). Артёма убедит пример и цена ошибки, а не «так правильно».` });
      if (!(j.ai || j.self)) notes.push({ ok: false, html: 'Проверьте ответ: «Проверить с Верой» или «Сверить с эталоном самому» — и отметьте пункты, которые у вас есть.' });
      else if (s < 0.6) notes.push({ ok: false, html: 'Пока мало пунктов. Что Лиза нашла сегодня? Сколько стоило бы это в спринте? Какие дефекты кодом вообще не поймать?' });
      else notes.push({ ok: true, html: `Ответ: ${Math.round(s * 100)} %.` });
      if (t.length >= 300 && !/3:00|3 час|три час/.test(TR.norm(t))) notes.push({ ok: 'warn', html: 'Нет конкретного примера. «Ровно 3:00» — самый наглядный аргумент сегодняшнего дня.' });
      return { ok: s >= 0.6 && t.length >= 300, score: s, notes };
    },
    explain: `<p>Главная мысль: <b>тестирование начинается с требований</b>. Самые дорогие дефекты — те, что заложены в тексте: их не найти, проверяя сборку по тому же тексту. Лиза, читающая постановку до кода, — самая дешёвая проверка на проекте.</p>
      <p>Хороший ответ руководителю — на его языке: пример (ровно 3:00), цена (минута сейчас против переделки и повторного теста потом), выгода для срока (меньше возвратов, предсказуемое демо). И честно: это пара часов сейчас.</p>
      <p class="small muted">Источники: Л. Криспин, Дж. Грегори, «Гибкое тестирование» — тестировщик в команде с первого дня; ISTQB Foundation Level — ранее тестирование и статическое тестирование (ревью); К. Вигерс, Дж. Битти — стоимость дефектов требований.</p>`,
    report: ans => `Ответ Артёму: ${(ans && ans.j && ans.j.text) || '—'}`
  };

  // =====================================================================
  TR.stage({
    id: ID,
    when: 'четверг, 19 ноября, 14:00 · Лиза читает требования к отмене записи',
    intro: [
      { who: 'liza', html: 'Я прочитала ISK-112. Можно я буду задавать глупые вопросы? Первый: «не позднее чем за 3 часа» — ровно 3:00 это ещё можно? Второй: что значит «удобно»? Третий… у меня их двадцать.' },
      { who: 'gleb', html: 'Кстати, я в коде написал «больше трёх часов». Это же то же самое?' },
      { who: 'vera', html: 'Вот и ответ, зачем Лиза читает требования до кода. Сегодня учимся работать с QA: писать требования, которые можно проверить, критерии в формате Дано/Когда/Тогда, граничные значения, разбирать баг-репорты и решать, баг это или дефект требований.' }
    ],
    facts: ['F-noshow', 'F-goal', 'F-deadline'],
    glossary: [
      { term: 'QA (тестировщик)', simple: 'Человек, который проверяет, что система делает то, что нужно, — и начинает с чтения требований.', tech: 'Quality assurance — обеспечение качества: ревью требований, тест-дизайн, тестирование, регресс, участие в приёмке (ISTQB).' },
      { term: 'Проверяемое требование', simple: 'Такое, что два человека независимо скажут одинаково: выполнено или нет.', tech: 'Verifiable requirement: однозначное, измеримое, полное, атомарное, непротиворечивое (ISO/IEC/IEEE 29148; Вигерс).' },
      { term: 'Критерии приёмки', simple: 'Условия, по которым понятно, что задача сделана.', tech: 'Acceptance criteria — проверяемые условия истории/задачи; часто в формате Gherkin.' },
      { term: 'Дано / Когда / Тогда', simple: 'Исходное состояние, одно действие, наблюдаемый результат.', tech: 'Given / When / Then — синтаксис Gherkin (BDD, Дэн Норт); по сценариям пишут ручные тесты и автотесты (Cucumber и др.).' },
      { term: 'Класс эквивалентности', simple: 'Группа значений, на которые система реагирует одинаково.', tech: 'Equivalence partition — техника тест-дизайна: один тест на класс, включая недопустимые классы.' },
      { term: 'Граничные значения', simple: 'Значения на границе и рядом: 3:01, 3:00, 2:59.', tech: 'Boundary value analysis — проверка значений на границах классов и по обе стороны (ISTQB).' },
      { term: 'Тест-кейс и чек-лист', simple: 'Подробный сценарий с шагами — и короткий список «что проверить».', tech: 'Test case: ID, предусловия, шаги, ожидаемый результат, связь с требованием. Checklist — перечень проверок без детальных шагов.' },
      { term: 'Баг-репорт', simple: 'Описание дефекта, по которому разработчик его повторит.', tech: 'Defect report: заголовок, окружение, предусловия, шаги, ожидаемый и фактический результат, вложения, серьёзность, приоритет.' },
      { term: 'Серьёзность и приоритет', simple: 'Насколько плохо — и как срочно чинить.', tech: 'Severity — влияние дефекта; priority — очерёдность исправления с учётом бизнеса. Независимые оси.' },
      { term: 'Дефект требований', simple: 'Ошибка или пробел в самих требованиях: код сделал написанное, но написано не то.', tech: 'Requirements defect — исправляется изменением требования (новая версия), а не «тихой» правкой кода.' },
      { term: 'Регрессионное тестирование', simple: 'Проверка, что новое не сломало старое.', tech: 'Regression testing — повторное тестирование после изменений; кандидат на автоматизацию.' },
      { term: 'Shift-left', simple: 'Подключать тестирование как можно раньше — с требований.', tech: 'Сдвиг активностей качества к началу жизненного цикла: статическое тестирование (ревью) требований и дизайна.' }
    ],
    outro: 'Лиза унесла из переговорной не двадцать вопросов, а восемь критериев приёмки в формате Дано/Когда/Тогда с точками 3:01, 3:00 и 2:59 — и пометку «ровно 3:00 — бесплатно» в ISK-112 v1.2. Глеб поменял одно сравнение в коде, пока это стоило минуту. Вы научились писать проверяемые требования, выбирать граничные значения, разбирать баг-репорты и отличать дефект кода от дефекта требований. Модуль 1 пройден: в понедельник начинаем модуль «Требования» — с письма Тимура Рашидовича, где перемешано всё сразу.',
    tasks: [howTestable, howBounds, howBugs, rewriteTask, boundsTask, triageTask, labTask, whyTask]
  });
})();
