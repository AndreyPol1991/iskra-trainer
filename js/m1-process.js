/* Модуль 1, занятие 3: подходы к организации разработки.
   Теория: водопад и V-модель (лента проекта «Искра Онлайн» до 15 марта в двух вариантах, запрос на изменение,
   пары «уровень требований ↔ уровень тестирования», переключатели «что подходит проекту»); Agile и Scrum (четыре
   ценности манифеста, роли-события-артефакты с тайм-боксами, спринт по дням: команда и аналитик «на спринт вперёд»);
   Kanban (доска, WIP-лимиты и закон Литтла, время цикла и время выполнения, Scrum vs Kanban, Scrumban и SAFe).
   Практика: подход для четырёх проектов «Орбиты» с главным аргументом; раскладка ролей, событий и артефактов Scrum;
   лаборатория «Kanban-доска с WIP-лимитами» (узкое место — тестирование, две недели с последствиями); аналитик в
   потоке спринтов — расставить работу по шкале; ответ Тимуру Рашидовичу «почему не всё по ТЗ сразу». */
'use strict';
(function () {
  const TR = window.TR, ui = TR.ui, esc = TR.esc;
  const ID = 'm1-process';

  if (!document.getElementById('mpr-css')) document.head.insertAdjacentHTML('beforeend', `<style id="mpr-css">
    .mpr-root, .mpr-root .stack > * { min-width: 0; }
    .mpr-root .seg button { white-space: normal; text-align: left; }
    .mpr-root .chip { white-space: normal; text-align: left; max-width: 100%; }
    .mpr-lbl { font: 600 10.5px/1.3 var(--f-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--text-muted); }
    .mpr-two { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr); gap: 16px; align-items: start; }
    .mpr-two > * { min-width: 0; }
    .mpr-panel { border: 1px solid var(--border-strong); border-radius: 12px; padding: 12px 14px; background: var(--surface); display: grid; gap: 10px; font-size: 14px; }
    .mpr-panel h4 { font: 700 16px/1.3 var(--f-brand); margin: 0; }
    .mpr-ex { border-left: 3px solid var(--accent); background: var(--surface-2); border-radius: 0 8px 8px 0; padding: 8px 12px; font-size: 14px; }
    .mpr-kv { display: grid; grid-template-columns: 120px minmax(0, 1fr); gap: 4px 12px; font-size: 14px; }
    .mpr-kv > span:nth-child(odd) { font: 600 10.5px/1.8 var(--f-mono); letter-spacing: .05em; text-transform: uppercase; color: var(--text-muted); }
    .mpr-stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; }
    .mpr-stats .stat .v { font-size: 16px; }
    .mpr-stats6 { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 8px; }
    .mpr-stats6 .stat .v { font-size: 17px; }
    /* лента проекта */
    .mpr-scroll { overflow-x: auto; max-width: 100%; }
    .mpr-gantt { display: grid; gap: 4px; min-width: 520px; font-size: 12.5px; }
    .mpr-gr { display: grid; grid-template-columns: 128px minmax(0, 1fr); gap: 8px; align-items: center; }
    .mpr-gr > span:first-child { color: var(--text-2); line-height: 1.25; }
    .mpr-tr { position: relative; height: 22px; background: var(--surface-2); border-radius: 6px; }
    .mpr-bar { position: absolute; top: 2px; bottom: 2px; border-radius: 5px; background: var(--accent-soft); border: 1px solid var(--accent); font: 600 10.5px/16px var(--f-mono); color: var(--accent); overflow: hidden; white-space: nowrap; padding: 0 4px; }
    .mpr-bar.t { background: var(--warn-soft); border-color: var(--warn); color: var(--warn); }
    .mpr-bar.ok { background: var(--ok-soft); border-color: var(--ok); color: var(--ok); }
    .mpr-bar.bad { background: var(--bad-soft); border-color: var(--bad); color: var(--bad); }
    .mpr-mk { position: absolute; top: -2px; bottom: -2px; width: 3px; background: var(--ok); border-radius: 2px; }
    .mpr-mk.bad { background: var(--bad); }
    .mpr-months { display: grid; grid-template-columns: 128px minmax(0, 1fr); gap: 8px; font: 600 10.5px/1.3 var(--f-mono); color: var(--text-muted); text-transform: uppercase; }
    .mpr-months > div { display: grid; grid-template-columns: 3.4fr 4.4fr 4.4fr 4fr 2fr; }
    /* V-модель */
    .mpr-v { display: grid; gap: 6px; }
    .mpr-vr { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 8px; }
    .mpr-vb { border: 1px solid var(--border); background: var(--surface); color: var(--text); border-radius: 10px; padding: 7px 10px; font-size: 13.5px; line-height: 1.3; text-align: left; min-width: 0; }
    .mpr-vb small { display: block; color: var(--text-muted); font-size: 11.5px; }
    .mpr-vb[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); }
    .mpr-vb.r { border-style: dashed; }
    .mpr-vcode { justify-self: center; font: 600 12px/1.3 var(--f-mono); color: var(--text-muted); border: 1px dashed var(--border-strong); border-radius: 99px; padding: 4px 14px; }
    /* переключатели */
    .mpr-sws { display: grid; gap: 6px; }
    .mpr-sw { display: grid; grid-template-columns: 34px minmax(0, 1fr); gap: 10px; align-items: center; padding: 7px 10px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface); text-align: left; color: var(--text); width: 100%; font-size: 14px; line-height: 1.35; }
    .mpr-sw .k { width: 34px; height: 20px; border-radius: 99px; background: var(--surface-3); border: 1px solid var(--border-strong); position: relative; }
    .mpr-sw .k::after { content: ""; position: absolute; top: 2px; left: 2px; width: 14px; height: 14px; border-radius: 50%; background: var(--text-muted); transition: left .15s; }
    .mpr-sw[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); }
    .mpr-sw[aria-pressed="true"] .k { background: var(--accent); border-color: var(--accent); }
    .mpr-sw[aria-pressed="true"] .k::after { left: 16px; background: var(--surface); }
    .mpr-scale { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; gap: 10px; align-items: center; font: 600 11px/1.3 var(--f-mono); color: var(--text-muted); text-transform: uppercase; }
    .mpr-scale .tr { position: relative; height: 12px; border-radius: 99px; background: linear-gradient(90deg, color-mix(in srgb, var(--info) 45%, var(--surface-2)), var(--surface-2), color-mix(in srgb, var(--accent) 45%, var(--surface-2))); }
    .mpr-scale .dot { position: absolute; top: -4px; width: 20px; height: 20px; margin-left: -10px; border-radius: 50%; background: var(--text); border: 3px solid var(--surface); box-shadow: 0 0 0 1px var(--border-strong); transition: left .2s; }
    /* карточки-перевёртыши */
    .mpr-flips { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 10px; }
    .mpr-flip { border: 1px solid var(--border); border-radius: 12px; padding: 10px 12px; background: var(--surface); color: var(--text); text-align: left; display: grid; gap: 6px; align-content: start; font-size: 14px; line-height: 1.4; min-width: 0; width: 100%; }
    .mpr-flip b { font: 700 15px/1.3 var(--f-brand); }
    .mpr-flip[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); }
    .mpr-chips { display: flex; flex-wrap: wrap; gap: 6px; }
    .mpr-grp { display: grid; gap: 6px; }
    /* дни спринта */
    .mpr-days { display: grid; grid-template-columns: repeat(10, minmax(0, 1fr)); gap: 4px; }
    .mpr-day { border: 1px solid var(--border); background: var(--surface); color: var(--text); border-radius: 8px; padding: 6px 2px; font: 600 12px/1.2 var(--f-mono); text-align: center; min-width: 0; }
    .mpr-day small { display: block; font-weight: 400; font-size: 10px; color: var(--text-muted); }
    .mpr-day[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); color: var(--accent); }
    .mpr-day.ev { border-bottom: 3px solid var(--warn); }
    .mpr-lanes { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 10px; }
    .mpr-lane { border: 1px solid var(--border); border-radius: 10px; padding: 9px 12px; background: var(--surface); display: grid; gap: 4px; font-size: 14px; align-content: start; }
    .mpr-lane.an { border-color: color-mix(in srgb, var(--accent) 50%, var(--border)); }
    /* Kanban: мини-доска и лаборатория */
    .mpr-board { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 6px; min-width: 560px; }
    .mpr-col { border: 1px solid var(--border); border-radius: 10px; background: var(--surface-2); padding: 6px; display: grid; gap: 4px; align-content: start; min-height: 120px; min-width: 0; }
    .mpr-col.full { border-color: var(--warn); }
    .mpr-col.jam { border-color: var(--bad); background: color-mix(in srgb, var(--bad) 7%, var(--surface-2)); }
    .mpr-col header { display: flex; justify-content: space-between; gap: 4px; font: 600 10.5px/1.3 var(--f-mono); text-transform: uppercase; color: var(--text-muted); }
    .mpr-col header b { color: var(--text); }
    .mpr-cards { display: flex; flex-wrap: wrap; gap: 3px; }
    .mpr-cd { font: 600 10.5px/1.2 var(--f-mono); border: 1px solid var(--border-strong); background: var(--surface); border-radius: 5px; padding: 2px 4px; }
    .mpr-cd.fin { border-color: var(--ok); color: var(--ok); }
    .mpr-cd.old { border-color: var(--bad); color: var(--bad); }
    .mpr-lim { display: grid; grid-template-columns: 150px minmax(0, 1fr); gap: 8px; align-items: center; font-size: 14px; }
    .mpr-dec { border: 1px solid var(--border); border-radius: 12px; padding: 10px 12px; background: var(--surface); display: grid; gap: 8px; }
    .mpr-dec.ok { border-color: var(--ok); } .mpr-dec.bad { border-color: var(--bad); } .mpr-dec.warn { border-color: var(--warn); }
    .mpr-dec .hd { display: flex; gap: 8px; align-items: baseline; flex-wrap: wrap; }
    .mpr-dec .hd b { font: 600 15px/1.3 var(--f-brand); }
    .mpr-opt { display: grid; grid-template-columns: 20px minmax(0, 1fr); gap: 8px; align-items: start; padding: 7px 10px; border: 1px solid var(--border); border-radius: 9px; background: var(--surface-2); text-align: left; color: var(--text); width: 100%; font-size: 13.5px; line-height: 1.4; }
    .mpr-opt .mk { width: 16px; height: 16px; border-radius: 50%; border: 2px solid var(--border-strong); margin-top: 1px; }
    .mpr-opt[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); }
    .mpr-opt[aria-pressed="true"] .mk { border-color: var(--accent); background: var(--accent); box-shadow: inset 0 0 0 3px var(--surface); }
    .mpr-opt.ok { border-color: var(--ok); background: var(--ok-soft); } .mpr-opt.bad { border-color: var(--bad); background: var(--bad-soft); }
    .mpr-opt:disabled { opacity: 1; cursor: default; }
    .mpr-res { border: 2px solid var(--border-strong); border-radius: 14px; padding: 12px 14px; background: var(--surface-2); display: grid; gap: 10px; }
    .mpr-tl { display: grid; gap: 6px; }
    .mpr-ev { display: grid; grid-template-columns: 76px minmax(0, 1fr); gap: 10px; border: 1px solid var(--border); border-left: 4px solid var(--border-strong); border-radius: 10px; padding: 7px 12px; background: var(--surface); font-size: 14px; }
    .mpr-ev.ok { border-left-color: var(--ok); } .mpr-ev.bad { border-left-color: var(--bad); } .mpr-ev.warn { border-left-color: var(--warn); } .mpr-ev.info { border-left-color: var(--info); }
    .mpr-ev .t { font: 600 12px/1.6 var(--f-mono); color: var(--text-muted); }
    .mpr-cfd { display: grid; grid-template-columns: repeat(10, minmax(0, 1fr)); gap: 4px; align-items: end; height: 110px; }
    .mpr-cfd > div { display: flex; flex-direction: column-reverse; height: 100%; border-radius: 4px; overflow: hidden; background: var(--surface-3); }
    .mpr-cfd i { display: block; }
    .mpr-cfd i.x { background: var(--ok); } .mpr-cfd i.t { background: var(--warn); } .mpr-cfd i.d { background: var(--accent); } .mpr-cfd i.a { background: var(--info); }
    .mpr-leg { display: flex; flex-wrap: wrap; gap: 4px 12px; font-size: 12px; color: var(--text-2); }
    .mpr-leg i { display: inline-block; width: 10px; height: 10px; border-radius: 3px; margin-right: 4px; vertical-align: -1px; }
    /* задание 1 */
    .mpr-proj { border: 1px solid var(--border); border-radius: 12px; padding: 10px 12px; background: var(--surface); display: grid; gap: 8px; }
    .mpr-proj.ok { border-color: var(--ok); } .mpr-proj.bad { border-color: var(--bad); } .mpr-proj.warn { border-color: var(--warn); }
    .mpr-proj h4 { margin: 0; font: 700 15px/1.3 var(--f-brand); }
    .mpr-proj .d { font-size: 13.5px; color: var(--text-2); }
    .mpr-why { font-size: 13px; color: var(--text-2); border-top: 1px dashed var(--border); padding-top: 6px; }
    /* задание 4 */
    .mpr-slots { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 6px; min-width: 600px; }
    .mpr-slot { border: 1px solid var(--border); border-radius: 10px; background: var(--surface-2); padding: 6px; display: grid; gap: 4px; align-content: start; min-height: 90px; font-size: 12px; min-width: 0; }
    .mpr-slot header { font: 600 10.5px/1.3 var(--f-mono); text-transform: uppercase; color: var(--text-muted); }
    .mpr-slot span { border: 1px solid var(--border-strong); background: var(--surface); border-radius: 6px; padding: 3px 5px; line-height: 1.25; }
    @media (max-width: 860px) { .mpr-two { grid-template-columns: minmax(0, 1fr); } .mpr-stats6 { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
    @media (max-width: 620px) {
      .mpr-stats, .mpr-stats6 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .mpr-kv { grid-template-columns: minmax(0, 1fr); gap: 0; }
      .mpr-kv > span:nth-child(even) { margin-bottom: 6px; }
      .mpr-lanes { grid-template-columns: minmax(0, 1fr); }
      .mpr-days { grid-template-columns: repeat(5, minmax(0, 1fr)); }
      .mpr-ev { grid-template-columns: minmax(0, 1fr); gap: 2px; }
      .mpr-lim { grid-template-columns: minmax(0, 1fr); gap: 4px; }
      .mpr-vr { gap: 4px; } .mpr-vb { padding: 6px 7px; font-size: 12.5px; }
    }
  </style>`);

  const interview = items => `<details class="more"><summary>Как об этом спрашивают на собеседовании</summary><div><ul class="checks">${items.map(x => `<li class="info"><b>${x[0]}</b> ${x[1]}</li>`).join('')}</ul></div></details>`;
  const mistakes = items => ui.note('warn', 'Типичные ошибки', `<ul class="checks">${items.map(x => `<li class="bad">${x}</li>`).join('')}</ul>`);
  const st = (k, v, cls, s) => `<div class="stat"><span class="k">${k}</span><span class="v ${cls || ''}">${v}</span><span class="s">${s}</span></div>`;
  const fmt = x => (Math.round(x * 10) / 10).toLocaleString('ru-RU');

  // =====================================================================
  // Теория 1. Водопад и V-модель
  // =====================================================================
  // недели: 0 = 9 ноября, 18 = 15 марта
  const W = n => (n / 18 * 100).toFixed(2) + '%';
  const bar = (from, to, t, k) => `<i class="mpr-bar ${k || ''}" style="left:${W(from)};width:${W(to - from)}" title="${esc(t)}">${esc(t)}</i>`;
  const GANTT = {
    wf: [
      ['Анализ и ТЗ', [[0, 4, 'ТЗ']]],
      ['Проектирование', [[4, 7, 'архитектура, макеты']]],
      ['Разработка', [[7, 14, 'всё сразу']]],
      ['Тестирование', [[14, 17, 'тест', 't']]],
      ['Внедрение', [[17, 18, 'релиз', 'ok']]]
    ],
    it: [
      ['Подготовка', [[0, 2, 'бэклог, архитектура']]],
      ['Спринты', [[2, 4, 'С1'], [4, 6, 'С2'], [6.6, 8.6, 'С3'], [8.6, 10.6, 'С4'], [10.6, 12.6, 'С5'], [12.6, 14.6, 'С6'], [14.6, 16.6, 'С7']]],
      ['Тестирование', [[2.4, 4, 'тест', 't'], [4.4, 6, 'тест', 't'], [7, 8.6, 'тест', 't'], [9, 10.6, 'тест', 't'], [11, 12.6, 'тест', 't'], [13, 14.6, 'тест', 't'], [15, 16.6, 'тест', 't']]],
      ['Релиз MVP', [[16.6, 18, 'MVP', 'ok']]]
    ]
  };
  function drawWater(pane) {
    let mode = 'wf', chg = false;
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Один и тот же проект — «Искра Онлайн» с 9 ноября до 15 марта — двумя способами. <b>Водопад</b> (waterfall): этапы идут друг за другом, следующий начинается, когда закончен и подписан предыдущий. <b>Итерации</b>: каждые две недели — небольшой кусок работающего продукта, который можно показать.</p>
      <div class="row">${ui.seg('mode', [{ v: 'wf', t: '🌊 Водопад' }, { v: 'it', t: '🔁 Итерации (Scrum)' }], 'wf')}</div>
      <button type="button" class="mpr-sw" data-chg aria-pressed="false"><span class="k" aria-hidden="true"></span><span>2 декабря: «Искра» просит добавить шиномонтаж и хранение шин — сезон переобувки</span></button>
      <div class="mpr-scroll"><div data-g></div></div>
      <div class="mpr-stats" data-s></div>
      <div data-n></div>
    </div>`;
    function draw() {
      const rows = GANTT[mode].map(r => `<div class="mpr-gr"><span>${esc(r[0])}</span><div class="mpr-tr">${r[1].map(b => bar(b[0], b[1], b[2], b[3])).join('')}${chg && mode === 'wf' && r[0] === 'Анализ и ТЗ' ? bar(4, 7, 'запрос на изменение', 'bad') : ''}</div></div>`).join('');
      const first = mode === 'wf' ? 15 : 4;
      TR.$('[data-g]', pane).innerHTML = `<div class="mpr-gantt"><div class="mpr-months"><span></span><div><span>ноябрь</span><span>декабрь</span><span>январь</span><span>февраль</span><span>март</span></div></div>${rows}
        <div class="mpr-gr"><span>Тимур видит работающее</span><div class="mpr-tr"><i class="mpr-mk" style="left:${W(first)}"></i>${mode === 'it' ? [6, 8.6, 10.6, 12.6, 14.6, 16.6].map(x => `<i class="mpr-mk" style="left:${W(x)}"></i>`).join('') : ''}</div></div></div>`;
      const S = mode === 'wf'
        ? [['Первый показ', 'конец февраля', 'bad', 'после 15 недель'], ['Обратная связь', '1 раз', 'bad', 'на приёмке'], ['Шиномонтаж', chg ? '+3 недели' : '—', chg ? 'bad' : '', chg ? 'переподписать ТЗ' : 'не просили'], ['Фиксировано', 'объём', 'warn', 'срок и бюджет плывут']]
        : [['Первый показ', '4 декабря', 'ok', 'демо спринта 1'], ['Обратная связь', '7 раз', 'ok', 'на каждом демо'], ['Шиномонтаж', chg ? 'в бэклог' : '—', chg ? 'ok' : '', chg ? 'решает владелец' : 'не просили'], ['Фиксировано', 'срок', 'ok', 'объём гибкий']];
      TR.$('[data-s]', pane).innerHTML = S.map(x => st(x[0], x[1], x[2], x[3])).join('');
      TR.$('[data-n]', pane).innerHTML = mode === 'wf'
        ? (chg ? ui.note('bad', 'Изменение в водопаде', 'ТЗ уже подписано: шиномонтаж — это запрос на изменение. Переписать раздел ТЗ, заново согласовать, сдвинуть проектирование. Три недели к плану — и 15 марта под угрозой. Альтернатива — сказать «нет», и «Искра» встретит сезон без шиномонтажа.')
          : ui.note('warn', 'Как это выглядит', 'Тимур Рашидович подпишет ТЗ в начале декабря и до конца февраля не увидит ни одного работающего экрана. Если в ТЗ ошибка («слот 30 минут, а шиномонтаж длится час»), её найдут на тестировании — когда до релиза три недели.'))
        : (chg ? ui.note('ok', 'Изменение в итерациях', 'Шиномонтаж становится новыми историями в бэклоге продукта. Владелец продукта решает: брать в MVP вместо чего-то менее важного или после. Спринт, который идёт сейчас, не ломается.')
          : ui.note('info', 'Как это выглядит', 'Каждые две недели демо: Тимур Рашидович и Марина Олеговна видят работающую отмену, напоминания, оплату. Ошибку в понимании ловят через две недели, а не через три месяца. Цена: заказчик должен регулярно приходить и принимать решения.'));
    }
    ui.onSeg(pane, (n, v) => { mode = v; draw(); });
    TR.on(pane, 'click', '[data-chg]', (e, b) => { chg = !chg; b.setAttribute('aria-pressed', String(chg)); draw(); });
    draw();
  }
  const VLEV = [
    { l: 'Бизнес-требования', ls: 'что нужно «Искре»', r: 'Приёмочное тестирование', rs: 'заказчик принимает',
      ex: 'Требование: «неявки 17 % → 8 %, клиент может отменить запись сам». Проверка: Марина Олеговна на стенде проходит сценарии отмены и переноса и подписывает акт приёмки.', who: 'Аналитик пишет требования и сценарии приёмки; проверяет заказчик вместе с QA.' },
    { l: 'Системные требования', ls: 'что делает система', r: 'Системное тестирование', rs: 'вся система целиком',
      ex: 'Требование: «бесплатная отмена — не позднее чем за 3 часа (BR-3)». Проверка: Лиза отменяет записи за 3:01, 3:00 и 2:59 через приложение и смотрит статус, возврат и уведомление.', who: 'Аналитик пишет требования, QA по ним — тест-кейсы. Тест-кейсы можно писать сразу, как только требование готово.' },
    { l: 'Архитектура', ls: 'из чего состоит', r: 'Интеграционное тестирование', rs: 'части вместе',
      ex: 'Решение: «возврат предоплаты — через ЮKassa, чек — через АТОЛ Онлайн». Проверка: сервис записи вызывает ЮKassa, приходит вебхук, чек возврата уходит в кассу.', who: 'Архитектор и тимлид; аналитик описывает интеграции, QA и разработчики проверяют стыки.' },
    { l: 'Дизайн модулей', ls: 'как устроена часть', r: 'Модульное тестирование', rs: 'одна функция',
      ex: 'Модуль: функция «бесплатна ли отмена» по времени начала и текущему времени. Проверка: автотест Глеба на 3:00 → «бесплатно», 2:59 → «поздно».', who: 'Разработчики пишут модульные тесты сами, обычно автоматические.' }
  ];
  function drawV(pane) {
    let cur = 1;
    pane.innerHTML = `<div class="stack">
      <p class="small muted"><b>V-модель</b> — водопад, у которого каждому уровню требований сразу ставится в пару уровень тестирования. Левая ветка спускается от бизнеса к коду, правая поднимается обратно. Нажмите на уровень.</p>
      <div class="mpr-v" data-v></div><div data-p></div>
      ${ui.note('info', 'Главная мысль V-модели', 'Тест планируют одновременно с требованием, а не после кода: «как я это проверю?» звучит, пока требование ещё можно поправить. Эта идея живёт и в Agile — в критериях приёмки и «трёх амиго». Применяют там, где нужна доказуемая проверка каждого требования: медицина, авиация, автомобильная электроника, банковские ядра.')}
    </div>`;
    function draw() {
      TR.$('[data-v]', pane).innerHTML = VLEV.map((x, i) => `<div class="mpr-vr">
        <button type="button" class="mpr-vb" data-i="${i}" aria-pressed="${cur === i}" style="margin-left:${i * 9}%">${esc(x.l)}<small>${esc(x.ls)}</small></button>
        <button type="button" class="mpr-vb r" data-i="${i}" aria-pressed="${cur === i}" style="margin-right:${i * 9}%">${esc(x.r)}<small>${esc(x.rs)}</small></button></div>`).join('') + '<div class="mpr-vcode">⌄ кодирование ⌄</div>';
      const x = VLEV[cur];
      TR.$('[data-p]', pane).innerHTML = `<div class="mpr-panel"><h4>${esc(x.l)} ↔ ${esc(x.r)}</h4><div class="mpr-ex"><span class="mpr-lbl">В «Искре»</span><div>${esc(x.ex)}</div></div><div class="mpr-kv"><span>Кто</span><span>${esc(x.who)}</span></div></div>`;
    }
    TR.on(pane, 'click', '[data-i]', (e, b) => { cur = +b.dataset.i; draw(); });
    draw();
  }
  const FIT = [
    { id: 'stable', t: 'Требования известны заранее и почти не будут меняться', w: -2 },
    { id: 'fixed', t: 'Договор фиксирует объём и цену, приёмка — строго по ТЗ (госзаказ по 44-ФЗ)', w: -2 },
    { id: 'reg', t: 'Ошибка опасна, регулятор требует документ и проверку на каждом этапе', w: -2 },
    { id: 'owner', t: 'Заказчик готов раз в две недели смотреть результат и решать', w: 2 },
    { id: 'unk', t: 'Пользователи могут удивить: без обратной связи легко сделать не то', w: 2 },
    { id: 'date', t: 'Нужно выйти к дате хотя бы с самым важным (MVP)', w: 2 }
  ];
  const PRESET = { iskra: ['owner', 'unk', 'date'], gov: ['stable', 'fixed'], med: ['stable', 'reg', 'fixed'] };
  function drawFit(pane) {
    let on = {};
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Подход выбирают под проект, а не по моде. Включите то, что верно для проекта, — или возьмите готовый пример.</p>
      <div class="row"><button type="button" class="btn sm" data-pre="iskra">🚗 «Искра Онлайн»</button><button type="button" class="btn sm" data-pre="gov">🏛️ Госзаказ: учёт в МФЦ</button><button type="button" class="btn sm" data-pre="med">🩺 ПО медицинского прибора</button></div>
      <div class="mpr-two"><div class="mpr-sws" data-sw></div><div class="stack tight"><div class="mpr-scale"><span>Водопад, V</span><div class="tr"><i class="dot" data-dot></i></div><span>Гибко</span></div><div data-vd></div></div></div>
    </div>`;
    function draw() {
      TR.$('[data-sw]', pane).innerHTML = FIT.map(f => `<button type="button" class="mpr-sw" data-f="${f.id}" aria-pressed="${!!on[f.id]}"><span class="k" aria-hidden="true"></span><span>${esc(f.t)}</span></button>`).join('');
      const s = FIT.reduce((a, f) => a + (on[f.id] ? f.w : 0), 0);
      TR.$('[data-dot]', pane).style.left = (50 + s / 6 * 50) + '%';
      TR.$('[data-vd]', pane).innerHTML = s <= -3 ? ui.note('info', 'Ближе к водопаду или V-модели', on.reg ? 'Каждое требование должно быть доказуемо проверено: V-модель с трассировкой «требование → тест». Гибкие практики возможны внутри этапов, но документы и приёмку не отменить.' : 'Объём известен и зафиксирован договором — последовательные этапы с ТЗ (например, по ГОСТ 34) честнее, чем делать вид, что можно менять всё.')
        : s >= 3 ? ui.note('ok', 'Ближе к гибкому подходу', 'Срок фиксирован, объём уточняется по ходу, заказчик рядом — короткие итерации со спринтами или поток Kanban. Это и есть «Искра Онлайн».')
          : ui.note('warn', 'Смешанный случай', 'Так бывает чаще всего: например, интеграцию с онлайн-кассой по 54-ФЗ описывают заранее и подробно, а экраны приложения уточняют на демо. Гибриды — нормальная практика.');
    }
    TR.on(pane, 'click', '[data-f]', (e, b) => { on[b.dataset.f] = !on[b.dataset.f]; draw(); });
    TR.on(pane, 'click', '[data-pre]', (e, b) => { on = {}; PRESET[b.dataset.pre].forEach(k => { on[k] = true; }); draw(); });
    draw();
  }
  const howModels = {
    id: 'how-models', covers: ['choose'], title: 'Как это работает: водопад, V-модель и когда они уместны', free: true, noReset: true,
    simple: {
      icon: '🌊',
      plain: 'Водопад — когда сначала полностью описывают всё, что нужно сделать, потом всё проектируют, потом всё программируют и в конце всё проверяют. Гибкий подход — когда делают небольшими кусками и каждые пару недель показывают работающее, чтобы вовремя поправить курс.',
      analogy: 'Свадьбу планируют водопадом: дата, зал и меню фиксируют заранее, переиграть за неделю нельзя. А ремонт квартиры, в которой уже живёшь, удобнее комнатами: закончили кухню — пожили, поняли, что в ванной хотим иначе.',
      tech: '<b>Каскадная модель</b> (waterfall): анализ → проектирование → реализация → тестирование → внедрение; переход — после завершения и согласования этапа. Её часто приписывают Уинстону Ройсу (1970), хотя он сам предупреждал о рисках «одного прохода». <b>V-модель</b> ставит каждому уровню требований в пару уровень тестирования (ISO/IEC/IEEE 29119, стандарты безопасности вроде IEC 62304 для медицинского ПО). В России для госзаказа ТЗ часто оформляют по ГОСТ 34.602.'
    },
    lead: ui.brief({
      situation: 'Пятница, 6 ноября. Артём собрал команду: до MVP 15 марта четыре месяца, а Тимур Рашидович по телефону спросил, «будет ли нормальное ТЗ». Прежде чем спорить о Scrum, разберитесь, что такое водопад и когда он действительно лучший выбор.',
      todo: [
        'Вкладка «Водопад или итерации»: переключите режимы и включите запрос на изменение 2 декабря — сравните последствия.',
        'Вкладка «V-модель»: нажмите на все четыре уровня.',
        'Вкладка «Что подходит проекту»: попробуйте три готовых примера и свои сочетания.'
      ],
      look: 'Водопад — не «устаревший», а подходящий для стабильных требований, фиксированных договоров и регулируемых отраслей. Позиция аналитика: в водопаде он пишет большое ТЗ в начале; в итерациях — требования частями, на спринт вперёд.'
    }),
    render(el) {
      el.classList.add('mpr-root');
      const t = document.createElement('div'); el.appendChild(t);
      ui.tabs(t, [
        { id: 'wf', t: 'Водопад или итерации', render: drawWater },
        { id: 'v', t: 'V-модель', render: drawV },
        { id: 'fit', t: 'Что подходит проекту', render: drawFit }
      ], 'wf');
      el.insertAdjacentHTML('beforeend', `<div class="stack tight" style="margin-top:12px">
        ${mistakes(['«Водопад — это плохо, Agile — хорошо». Подход выбирают под условия: госзаказ с фиксированным ТЗ гибким не станет от того, что команда проводит дейли.', '«В V-модели тестируют дважды». Нет: каждому уровню требований — свой уровень проверки, и тест планируют вместе с требованием.', '«В гибком подходе нет требований». Требования есть, их пишут частями и уточняют перед каждым спринтом.'])}
        ${interview([['«Чем водопад отличается от Agile?»', 'В водопаде фиксирован объём, этапы последовательны, результат виден в конце. В Agile фиксированы срок и команда, объём уточняется, работающий продукт — каждую итерацию.'], ['«Когда вы бы выбрали водопад?»', 'Требования стабильны и известны, договор с фиксированной ценой и приёмкой по ТЗ (госзаказ), регулятор требует документов на каждом этапе.'], ['«Что такое V-модель?»', 'Вариант каскада, где каждому уровню требований соответствует уровень тестирования: бизнес-требования — приёмочное, системные — системное, архитектура — интеграционное, модули — модульное.']])}
      </div>`);
    }
  };

  // =====================================================================
  // Теория 2. Agile и Scrum
  // =====================================================================
  const MANI = [
    { a: 'Люди и взаимодействие', b: 'процессы и инструменты', ex: 'Глеб не понял правило трёх часов — вы подходите и за пять минут рисуете ось времени, а не ждёте, пока он заполнит форму вопроса в Jira. Но ответ потом всё равно записываете в задачу.' },
    { a: 'Работающий продукт', b: 'исчерпывающая документация', ex: 'Марина Олеговна поймёт больше, пощёлкав отмену записи на демо, чем прочитав 40 страниц ТЗ. Документация остаётся — ровно столько, сколько нужно, чтобы команда делала одно и то же.' },
    { a: 'Сотрудничество с заказчиком', b: 'согласование условий контракта', ex: 'Тимур Рашидович раз в две недели приходит на демо и решает, что важнее. Договор при этом есть — просто спорный вопрос решают разговором, а не поиском пункта 4.2.' },
    { a: 'Готовность к изменениям', b: 'следование первоначальному плану', ex: 'Шиномонтаж всплыл в декабре — его кладут в бэклог и сравнивают с другими задачами, а не отвечают «в ТЗ этого нет».' }
  ];
  function drawMani(pane) {
    const on = {};
    pane.innerHTML = `<div class="stack">
      <p class="small muted"><b>Манифест гибкой разработки</b> (Agile Manifesto, 2001) — четыре ценности и двенадцать принципов, которые написали семнадцать практиков. Это не метод, а система приоритетов. Нажмите на ценность — увидите, как она выглядит в «Искре».</p>
      <div class="mpr-flips" data-f></div>
      ${ui.note('info', '«Правое тоже ценно»', 'В манифесте прямо сказано: ценности справа тоже важны, но то, что слева, — важнее. Поэтому «в Agile нет документации» — миф. Нет документации ради документации.')}
    </div>`;
    function draw() {
      TR.$('[data-f]', pane).innerHTML = MANI.map((m, i) => `<button type="button" class="mpr-flip" data-m="${i}" aria-pressed="${!!on[i]}"><b>${esc(m.a)}</b><span class="small muted">важнее, чем ${esc(m.b)}</span>${on[i] ? `<span>${esc(m.ex)}</span>` : '<span class="small dim">Нажмите — пример из «Искры»</span>'}</button>`).join('');
    }
    TR.on(pane, 'click', '[data-m]', (e, b) => { on[b.dataset.m] = !on[b.dataset.m]; draw(); });
    draw();
  }
  const SCRUM = [
    { g: 'Роли', id: 'po', t: 'Владелец продукта', what: 'Отвечает за ценность продукта: ведёт бэклог продукта, решает порядок задач, формулирует цель продукта. Один человек, не комитет.', isk: 'Тимур Рашидович — он решает, что войдёт в MVP. Повседневные вопросы делегирует Марине Олеговне, но последнее слово за ним.', an: 'Аналитик помогает владельцу: превращает его идеи в понятные истории с критериями, приносит варианты и последствия. Решает не аналитик.' },
    { g: 'Роли', id: 'sm', t: 'Scrum-мастер', what: 'Отвечает за то, чтобы Scrum работал: убирает препятствия, проводит события, учит команду и заказчика. Не начальник и не секретарь.', isk: 'Артём совмещает роль с руководством проектом — частый компромисс в студиях, хотя Скрам-гайд советует не смешивать.', an: 'К Scrum-мастеру аналитик идёт, когда мешает процесс: заказчик не приходит на демо, задачи приходят сырыми.' },
    { g: 'Роли', id: 'dev', t: 'Разработчики', what: 'Все, кто делает инкремент: программисты, тестировщики, дизайнеры, аналитики. Сами решают, как сделать работу, и вместе отвечают за качество.', isk: 'Глеб, Даша, Лиза, Ника — и вы. В Скрам-гайде нет отдельных «ролей» тестировщика или аналитика: все они разработчики.', an: 'Аналитик — часть команды разработки, а не посредник снаружи.' },
    { g: 'События', id: 'sprint', t: 'Спринт', what: 'Контейнер для всех событий: фиксированный отрезок до месяца, обычно 1–4 недели. Внутри — планирование, дейли, работа, обзор, ретро. Цель спринта не меняют посреди.', isk: 'Две недели. Первый спринт — 23 ноября – 4 декабря, цель: «клиент может сам отменить и перенести запись». До MVP около семи спринтов.', an: 'Внутри спринта аналитик сопровождает текущие задачи и готовит следующие.' },
    { g: 'События', id: 'plan', t: 'Планирование спринта', what: 'Команда и владелец продукта решают: зачем этот спринт (цель), что возьмём (задачи из бэклога), как будем делать. Для двухнедельного спринта — до 4 часов.', isk: 'Понедельник утром. Тимур Рашидович по видео подтверждает цель, команда выбирает задачи, которые прошли Definition of Ready.', an: 'Объясняет задачи и отвечает на вопросы; если задача не готова — честно говорит об этом.' },
    { g: 'События', id: 'daily', t: 'Ежедневный Scrum (дейли)', what: 'Пятнадцать минут каждый день для разработчиков: как мы движемся к цели спринта, что мешает. Не отчёт начальнику.', isk: 'В 10:00 у доски: «Застряла на возврате по СБП», — говорит Даша.', an: 'Слушает, где буксуют требования; разбор — после дейли с нужными людьми.' },
    { g: 'События', id: 'review', t: 'Обзор спринта (демо)', what: 'Команда показывает заинтересованным сторонам, что сделано, и вместе решают, что дальше. Рабочая встреча, не презентация. До 2 часов для двух недель.', isk: 'Пятница 4 декабря: Марина Олеговна сама отменяет запись на стенде, замечания идут в бэклог.', an: 'Часто ведёт показ сценариев и записывает замечания в бэклог.' },
    { g: 'События', id: 'retro', t: 'Ретроспектива', what: 'Команда обсуждает, как работала: что улучшить в процессе, качестве, общении. До 1,5 часа для двух недель.', isk: '«Задачи приходили на планирование сырыми — давайте груминг по средам».', an: 'Говорит о проблемах на стыке с бизнесом и требованиями.' },
    { g: 'Артефакты', id: 'pb', t: 'Бэклог продукта', what: 'Упорядоченный список всего, что может понадобиться продукту. Обязательство — цель продукта. Постоянно уточняется (refinement).', isk: 'ISK-112 «Отмена записи», ISK-115 «Напоминания», ISK-118 «Кабинет „Шашки“»… Цель продукта: неявки 17 % → 8 %, потерянные звонки 21 % → 5 %.', an: 'Главный «рабочий стол» аналитика: детализирует, режет большие задачи, пишет критерии.' },
    { g: 'Артефакты', id: 'sb', t: 'Бэклог спринта', what: 'Цель спринта + выбранные задачи + план, как их сделать. Принадлежит разработчикам. Обязательство — цель спринта.', isk: 'Цель «клиент сам отменяет и переносит запись»; задачи ISK-112, ISK-113 и подзадачи Глеба и Даши.', an: 'Следит, чтобы задачи в спринте не расходились с требованиями.' },
    { g: 'Артефакты', id: 'inc', t: 'Инкремент', what: 'Работающий результат спринта, пригодный к использованию. Обязательство — Definition of Done (DoD): общее для команды определение «сделано».', isk: 'DoD «Орбиты»: код в основной ветке, автотесты зелёные, Лиза проверила по критериям, стенд обновлён, требования актуальны.', an: 'Пункт «требования актуальны» в DoD — зона аналитика.' }
  ];
  function drawScrum(pane) {
    let cur = 'po';
    pane.innerHTML = `<div class="stack">
      <p class="small muted"><b>Scrum</b> — самый распространённый фреймворк гибкой разработки: 3 ответственности (роли), 5 событий, 3 артефакта (Скрам-гайд, Швабер и Сазерленд, редакция 2020). Нажмите на элемент.</p>
      <div class="mpr-two"><div class="stack tight" data-l></div><div data-p></div></div>
      ${ui.note('info', 'Чего нет в Скрам-гайде', 'Груминг (уточнение бэклога) — постоянная активность, а не отдельное событие. Definition of Ready, сторипоинты, покер планирования, диаграмма сгорания — популярные практики команд, а не части Scrum. Руководителя проекта в Scrum тоже нет — но в реальных студиях он часто есть, потому что есть договор и бюджет.')}
    </div>`;
    function draw() {
      TR.$('[data-l]', pane).innerHTML = ['Роли', 'События', 'Артефакты'].map(g => `<div class="mpr-grp"><span class="mpr-lbl">${g}</span><div class="mpr-chips">${SCRUM.filter(x => x.g === g).map(x => `<button type="button" class="chip" data-s="${x.id}" aria-pressed="${cur === x.id}">${esc(x.t)}</button>`).join('')}</div></div>`).join('');
      const x = SCRUM.find(s => s.id === cur);
      TR.$('[data-p]', pane).innerHTML = `<div class="mpr-panel"><h4>${esc(x.t)}</h4><div>${esc(x.what)}</div><div class="mpr-ex"><span class="mpr-lbl">В «Искре»</span><div>${esc(x.isk)}</div></div><div class="mpr-kv"><span>Аналитик</span><span>${esc(x.an)}</span></div></div>`;
    }
    TR.on(pane, 'click', '[data-s]', (e, b) => { cur = b.dataset.s; draw(); });
    draw();
  }
  const DAYS = [
    { d: 'Пн', team: 'Планирование спринта 1: цель «клиент сам отменяет и переносит запись», в бэклог спринта — ISK-112 и ISK-113.', an: 'Объясняет задачи, отвечает на вопросы, следит, чтобы цель спринта записали словами бизнеса.', ev: 1 },
    { d: 'Вт', team: 'Дейли, разработка: Глеб — сервер отмены, Даша — экран.', an: 'Три амиго по ISK-112 с Глебом и Лизой: проходят «ровно 3:00» на примерах.' },
    { d: 'Ср', team: 'Дейли, разработка.', an: '<b>На спринт вперёд:</b> интервью с Мариной Олеговной о напоминаниях (ISK-115, спринт 2).' },
    { d: 'Чт', team: 'Дейли, разработка; Ника дорисовывает окно переноса.', an: 'Пишет постановку и критерии приёмки ISK-115. Отвечает Даше в задаче про перенос.' },
    { d: 'Пт', team: 'Дейли; Лиза проверяет первую сборку отмены.', an: 'Лиза: «это баг или так задумано?» — аналитик отвечает по требованию, при споре — к Марине Олеговне.' },
    { d: 'Пн', team: 'Дейли, разработка.', an: '<b>На спринт вперёд:</b> черновик ISK-120 «Онлайн-оплата» — вопросы к Ольге Викторовне про чеки.' },
    { d: 'Вт', team: 'Дейли; уточнение бэклога (груминг) — час со всей командой.', an: 'Ведёт груминг ISK-115 и ISK-120: вопросы, разрезание, оценка.', ev: 1 },
    { d: 'Ср', team: 'Дейли, разработка, исправление дефектов.', an: 'Проверяет ISK-115 по Definition of Ready; макет Ники — в задаче.' },
    { d: 'Чт', team: 'Дейли; Лиза гоняет регресс.', an: 'Вместе с Лизой проверяет отмену по критериям приёмки; готовит сценарий демо.' },
    { d: 'Пт', team: 'Обзор спринта (демо) для Тимура Рашидовича и Марины Олеговны, затем ретроспектива.', an: 'Показывает сценарий отмены, записывает замечания в бэклог; на ретро — про сырые задачи.', ev: 1 }
  ];
  function drawDays(pane) {
    let cur = 0;
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Спринт 1: 23 ноября – 4 декабря, десять рабочих дней. Пока команда делает отмену записи, аналитик уже готовит задачи <b>следующего</b> спринта — это называют «аналитика на спринт вперёд». Нажимайте на дни.</p>
      <div class="mpr-days" data-d></div><div class="mpr-lanes" data-l></div>
      ${ui.note('info', 'Почему «на спринт вперёд»', 'Если начать разбираться в напоминаниях на планировании спринта 2, задачу не успеют оценить и взять. Аналитик обычно работает на один-два спринта впереди разработки, а в текущем спринте отвечает на вопросы и принимает сделанное. Слишком далеко вперёд тоже плохо: требования устаревают раньше, чем до них дойдёт очередь.')}
    </div>`;
    function draw() {
      TR.$('[data-d]', pane).innerHTML = DAYS.map((x, i) => `<button type="button" class="mpr-day ${x.ev ? 'ev' : ''}" data-i="${i}" aria-pressed="${cur === i}">${i + 1}<small>${x.d}</small></button>`).join('');
      const x = DAYS[cur];
      TR.$('[data-l]', pane).innerHTML = `<div class="mpr-lane"><span class="mpr-lbl">Команда · день ${cur + 1}</span><div>${x.team}</div></div><div class="mpr-lane an"><span class="mpr-lbl">Аналитик</span><div>${x.an}</div></div>`;
    }
    TR.on(pane, 'click', '[data-i]', (e, b) => { cur = +b.dataset.i; draw(); });
    draw();
  }
  const howScrum = {
    id: 'how-scrum', covers: ['scrum', 'flow'], title: 'Как это работает: Agile и Scrum — роли, события, артефакты', free: true, noReset: true,
    simple: {
      icon: '🔁',
      plain: 'Agile — набор ценностей: делать продукт небольшими кусками, часто показывать заказчику и спокойно принимать изменения. Scrum — конкретные правила, как так работать: работа идёт спринтами по 1–4 недели, в начале планируют, каждый день сверяются, в конце показывают результат и обсуждают, как работать лучше.',
      analogy: 'Как тренировки по плану на неделю: в понедельник решили, что тренируем, каждый день короткая сверка, в воскресенье — замер результатов и разговор с тренером, что поменять в следующей неделе.',
      tech: '<b>Scrum</b> (Скрам-гайд, К. Швабер и Дж. Сазерленд, 2020): ответственности — владелец продукта, Scrum-мастер, разработчики; события — спринт, планирование спринта, ежедневный Scrum, обзор спринта, ретроспектива; артефакты и их обязательства — бэклог продукта (цель продукта), бэклог спринта (цель спринта), инкремент (Definition of Done). Ценности Agile — Манифест гибкой разработки ПО, 2001.'
    },
    lead: ui.brief({
      situation: 'Команда склоняется к Scrum с двухнедельными спринтами. Глеб работал по нему, Даша — нет, а Тимур Рашидович думает, что «спринт» — это когда все бегут. Разберитесь, из чего состоит Scrum и где в нём аналитик.',
      todo: [
        'Вкладка «Манифест»: откройте все четыре ценности.',
        'Вкладка «Scrum на одной странице»: пройдитесь по ролям, событиям и артефактам.',
        'Вкладка «Спринт по дням»: прощёлкайте десять дней и посмотрите, когда аналитик работает «на спринт вперёд».'
      ],
      look: 'Аналитик в Scrum — один из разработчиков: он не стоит между заказчиком и командой, а работает внутри команды и рядом с владельцем продукта.'
    }),
    render(el) {
      el.classList.add('mpr-root');
      const t = document.createElement('div'); el.appendChild(t);
      ui.tabs(t, [
        { id: 'm', t: 'Манифест', render: drawMani },
        { id: 's', t: 'Scrum на одной странице', render: drawScrum },
        { id: 'd', t: 'Спринт по дням', render: drawDays }
      ], 'm');
      el.insertAdjacentHTML('beforeend', `<div class="stack tight" style="margin-top:12px">
        ${mistakes(['Дейли превращается в отчёт руководителю на 40 минут. Это 15 минут разработчиков о движении к цели спринта.', 'Посреди спринта меняют цель, потому что «заказчик попросил». Новое идёт в бэклог продукта; цель спринта сохраняют, состав работ уточняют вместе с командой.', 'Демо — презентация со слайдами. Это рабочая встреча: заказчик сам трогает инкремент, замечания идут в бэклог.', 'Аналитик пишет требования на тот же спринт, в котором их разрабатывают, — команда ждёт и угадывает.'])}
        ${interview([['«Назовите роли, события и артефакты Scrum»', 'Владелец продукта, Scrum-мастер, разработчики; спринт, планирование, ежедневный Scrum, обзор, ретроспектива; бэклог продукта, бэклог спринта, инкремент (плюс обязательства: цель продукта, цель спринта, DoD).'], ['«Чем DoR отличается от DoD?»', 'DoR — договорённость, когда задачу можно брать в спринт (практика команд); DoD — когда инкремент считается сделанным (часть Скрам-гайда).'], ['«Где аналитик в Scrum?»', 'В команде разработчиков: на спринт вперёд готовит задачи с владельцем продукта, на груминге и планировании отвечает на вопросы, в спринте сопровождает и принимает, на демо собирает замечания.']])}
      </div>`);
    }
  };

  // =====================================================================
  // Теория 3. Kanban
  // =====================================================================
  function drawLittle(pane) {
    let wip = 12;
    pane.innerHTML = `<div class="stack">
      <p class="small muted"><b>Kanban</b> (японское «карточка», пришло из производственной системы Toyota; в разработке — метод Дэвида Андерсона, 2010) — работа как поток. Принципы: визуализировать работу на доске, <b>ограничить незавершённую работу</b> (WIP — work in progress), управлять потоком, сделать правила явными и улучшать понемногу. Спринтов и обязательных ролей нет.</p>
      <div class="mpr-scroll"><div class="mpr-board">
        ${[['Бэклог', 'ISK-121 ISK-122 ISK-123', ''], ['Анализ · 2', 'ISK-119 ISK-120', 'full'], ['Разработка · 3', 'ISK-116 ISK-117', ''], ['Тест · 2', 'ISK-114 ISK-115', 'full'], ['Готово', 'ISK-112 ISK-113', '']].map(c => `<div class="mpr-col ${c[2]}"><header><b>${c[0].split(' · ')[0]}</b><span>${c[0].split(' · ')[1] ? 'лимит ' + c[0].split(' · ')[1] : ''}</span></header><div class="mpr-cards">${c[1].split(' ').map(x => `<span class="mpr-cd">${x}</span>`).join('')}</div></div>`).join('')}
      </div></div>
      <p class="small muted">Колонка «Тест» заполнена до лимита: Глеб не может «бросить» туда новую задачу — он помогает Лизе или доделывает своё. Лимит превращает скрытую очередь в видимую проблему.</p>
      <div class="mpr-panel"><h4>Закон Литтла: почему меньше в работе — быстрее</h4>
        <div class="mpr-lim"><span>Задач в работе: <b data-w>12</b></span><input type="range" min="2" max="20" value="12" data-r aria-label="Количество задач в работе"></div>
        <div class="mpr-stats" data-s></div><div class="small muted">Среднее время цикла ≈ задач в работе ÷ пропускная способность (Джон Литтл, 1961). Пропускная способность — сколько задач в день команда доводит до «Готово»; у нас её ограничивает тестирование — 1 задача в день.</div></div>
    </div>`;
    function draw() {
      TR.$('[data-w]', pane).textContent = wip;
      TR.$('[data-s]', pane).innerHTML = st('В работе', wip, wip > 8 ? 'bad' : wip > 4 ? 'warn' : 'ok', 'задач') + st('Выпуск', '1', '', 'задача в день') + st('Время цикла', '≈ ' + wip, wip > 8 ? 'bad' : wip > 4 ? 'warn' : 'ok', 'рабочих дней') + st('Новая задача', wip > 8 ? 'ждёт' : 'идёт', wip > 8 ? 'bad' : 'ok', wip > 8 ? 'больше двух недель' : 'без долгой очереди');
    }
    pane.addEventListener('input', e => { if (e.target.matches('[data-r]')) { wip = +e.target.value; draw(); } });
    draw();
  }
  const TPTS = [
    { id: 'c', d: '9 ноября', t: 'Создана', s: 'Марина Олеговна попросила напоминания — задача ISK-115 появилась в бэклоге.' },
    { id: 's', d: '23 ноября', t: 'Взята в работу', s: 'Аналитик начал разбор (колонка «Анализ»). С этого момента считается время цикла.' },
    { id: 'f', d: '3 декабря', t: 'Готово', s: 'Лиза проверила, задача на стенде. Время цикла — 8 рабочих дней.' },
    { id: 'u', d: '4 декабря', t: 'У клиента', s: 'Марина Олеговна увидела напоминание на демо. Время выполнения — почти месяц с её просьбы.' }
  ];
  function drawTimes(pane) {
    let cur = 'c';
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Две главные метрики потока. <b>Время выполнения</b> (lead time) — от появления запроса до результата у заказчика: так ждёт бизнес. <b>Время цикла</b> (cycle time) — от начала работы до «Готово»: так работает команда. Нажмите на точки пути ISK-115.</p>
      <div class="mpr-scroll"><div class="mpr-gantt" style="min-width:420px">
        <div class="mpr-gr"><span>Время выполнения</span><div class="mpr-tr">${bar(0, 18, 'почти месяц: так ждёт Марина Олеговна', 'bad')}</div></div>
        <div class="mpr-gr"><span>Время цикла</span><div class="mpr-tr">${bar(8.5, 16, '8 рабочих дней', 'ok')}</div></div>
      </div></div>
      <div class="row" data-p></div><div data-o></div>
      ${ui.note('info', 'Что с этим делает аналитик', 'Если время выполнения большое, а цикла — маленькое, задачи долго лежат в бэклоге: вопрос к приоритетам владельца продукта. Если велико время цикла — что-то тормозит внутри: часто это ожидание ответов по требованиям или очередь в тестирование. Аналитик смотрит, сколько задача стоит в колонке «Анализ» и «Ждёт ответа заказчика».')}
    </div>`;
    function draw() {
      TR.$('[data-p]', pane).innerHTML = TPTS.map(p => `<button type="button" class="chip" data-t="${p.id}" aria-pressed="${cur === p.id}">${esc(p.d)} · ${esc(p.t)}</button>`).join('');
      TR.$('[data-o]', pane).innerHTML = `<div class="mpr-ex">${esc(TPTS.find(p => p.id === cur).s)}</div>`;
    }
    TR.on(pane, 'click', '[data-t]', (e, b) => { cur = b.dataset.t; draw(); });
    draw();
  }
  function drawVs(pane) {
    pane.innerHTML = `<div class="stack">
      <div class="mpr-scroll">${ui.table(['', 'Scrum', 'Kanban'], [
        ['Ритм', 'Спринты фиксированной длины', 'Непрерывный поток, без итераций'],
        ['Роли', 'Владелец продукта, Scrum-мастер, разработчики', 'Не обязательны; часто есть ответственный за поток'],
        ['Ограничение работы', 'Объём спринта', 'WIP-лимиты по колонкам'],
        ['Изменения', 'В бэклог, обычно со следующего спринта', 'В любой момент, когда освободилось место'],
        ['Метрики', 'Цель спринта, скорость команды', 'Время цикла и выполнения, пропускная способность'],
        ['Когда хорош', 'Новый продукт, нужна регулярная обратная связь', 'Поддержка, поток заявок разной срочности']
      ])}</div>
      ${ui.note('info', 'Гибриды', '<b>Scrumban</b> — спринты и ретро из Scrum плюс доска с WIP-лимитами из Kanban; часто так живут команды после релиза, когда новая разработка смешивается с поддержкой. <b>SAFe</b> (Scaled Agile Framework) — каркас для десятков команд над одним продуктом (банки, телеком): общее планирование на квартал, поезда релизов. «Искре» с одной командой он не нужен, но название стоит знать для собеседований.')}
      ${ui.note('ok', 'Что выбрала «Орбита»', 'До MVP — Scrum с двухнедельными спринтами: продукт новый, Тимуру Рашидовичу нужно видеть результат. На доске спринта — WIP-лимит на тестирование, потому что Лиза одна. После 15 марта поддержка пойдёт по Kanban.')}
    </div>`;
  }
  const howKanban = {
    id: 'how-kanban', covers: ['kanban'], title: 'Как это работает: Kanban, WIP-лимиты и метрики потока', free: true, noReset: true,
    simple: {
      icon: '🗂️',
      plain: 'Kanban — доска с колонками, по которым задачи движутся слева направо. Главное правило: в каждой колонке может быть не больше определённого числа задач. Пока одна не ушла дальше, новую не берут. Так задачи не копятся в очередях, а доходят до конца быстрее.',
      analogy: 'Как кофейня с одним бариста: если кассир принимает заказы быстрее, чем варится кофе, у стойки собирается толпа с чеками. Разумнее кассиру на минуту помочь — налить молоко, — чем принять ещё десять заказов.',
      tech: '<b>Kanban-метод</b> (Дэвид Андерсон, «Канбан», 2010): визуализация, ограничение незавершённой работы (WIP-лимиты), управление потоком, явные правила, петли обратной связи, эволюционные улучшения. Метрики: время выполнения (lead time), время цикла (cycle time), пропускная способность (throughput), кумулятивная диаграмма потока (CFD). Закон Литтла: среднее время в системе = средняя незавершённая работа ÷ пропускная способность.'
    },
    lead: ui.brief({
      situation: 'Лиза на встрече говорит тихо, но важное: «Я одна тестирую и приложение, и АРМ, и планшет. Если Глеб с Дашей будут сдавать мне по пять задач в день, через неделю я утону». Глеб: «Ну так проверяй быстрее». Разберитесь, как Kanban отвечает на этот спор.',
      todo: [
        'Вкладка «Доска и WIP»: подвигайте ползунок — сколько ждёт задача при 4 и при 16 задачах в работе.',
        'Вкладка «Время цикла и выполнения»: нажмите на все четыре точки пути ISK-115.',
        'Вкладка «Scrum, Kanban, гибриды»: сравните подходы и прочитайте, что выбрала «Орбита».'
      ],
      look: 'Скорость команды определяет самое узкое место, а не самый быстрый человек. Если разработка делает больше, чем успевает тестирование, то «делать быстрее» — значит только копить очередь.'
    }),
    render(el) {
      el.classList.add('mpr-root');
      const t = document.createElement('div'); el.appendChild(t);
      ui.tabs(t, [
        { id: 'w', t: 'Доска и WIP', render: drawLittle },
        { id: 't', t: 'Время цикла и выполнения', render: drawTimes },
        { id: 'v', t: 'Scrum, Kanban, гибриды', render: drawVs }
      ], 'w');
      el.insertAdjacentHTML('beforeend', `<div class="stack tight" style="margin-top:12px">
        ${mistakes(['Повесить доску и не ставить лимиты. Это уже не Kanban, а просто список задач по колонкам.', 'Считать простой разработчика при упёршемся лимите провалом. Это сигнал: помогите узкому месту.', 'Мерить «сколько задач начали». Важно, сколько дошло до «Готово» и за какое время.'])}
        ${interview([['«Что такое WIP-лимит и зачем он?»', 'Максимум задач в колонке одновременно. Он не даёт копить очереди, делает узкое место видимым и сокращает время цикла (закон Литтла).'], ['«Чем время цикла отличается от времени выполнения?»', 'Выполнения — от запроса до результата (ждёт заказчик), цикла — от начала работы до готовности (работает команда).'], ['«Scrum или Kanban для поддержки?»', 'Обычно Kanban: поток заявок разной срочности, планировать двухнедельный объём бессмысленно, важно время реакции.']])}
      </div>`);
    }
  };

  // =====================================================================
  // Практика 1. Какой подход для какого проекта
  // =====================================================================
  const APP = [{ v: 'scrum', t: 'Scrum' }, { v: 'kanban', t: 'Kanban' }, { v: 'wf', t: 'Водопад' }, { v: 'v', t: 'V-модель' }];
  const APP_T = { scrum: 'Scrum', kanban: 'Kanban', wf: 'Водопад', v: 'V-модель' };
  const PROJ = [
    { id: 'iskra', t: '🚗 «Искра Онлайн»', d: 'Новое приложение, сайт и АРМ для сети автосервисов. MVP к 15 марта, дальше сезон. Владелец рядом и готов смотреть результат, требования будут уточняться.',
      ok: 'scrum', part: [], rs: [
        { t: 'Срок фиксирован, объём уточняется: каждые две недели владелец видит работающее и решает, что важнее для MVP', ok: true },
        { t: 'В Scrum можно не писать требования — сэкономим время до 15 марта' },
        { t: 'Так работают все современные студии, заказчику это понравится' }],
      why: 'Новый продукт с неизвестным до конца объёмом и жёсткой датой — классический случай итераций: важное делаем первым, к 15 марта гарантированно есть MVP. Kanban тоже возможен, но без ритма демо Тимуру Рашидовичу сложнее принимать решения.' },
    { id: 'smile', t: '🦷 Поддержка сайта клиники «Улыбка»', d: 'Сайт запущен год назад. Приходят заявки: поменять цены, починить форму записи (срочно!), добавить врача. В неделю 10–20 заявок разной срочности.',
      ok: 'kanban', part: ['scrum'], rs: [
        { t: 'Работа приходит потоком с разной срочностью: планировать объём на две недели бессмысленно, важно время реакции', ok: true },
        { t: 'В Kanban нет правил, поэтому подходит для мелочей' },
        { t: 'Задачи маленькие, поэтому подход не нужен вовсе' }],
      why: 'Поток заявок без общей цели итерации — дом Kanban: WIP-лимиты, класс обслуживания «срочно» для сломанной формы записи, метрика — время выполнения. Scrum здесь заставил бы ждать следующего спринта.' },
    { id: 'gov', t: '🏛️ Госзаказ: учёт обращений в МФЦ района', d: 'Тендер по 44-ФЗ. ТЗ по ГОСТ 34 входит в контракт, цена фиксирована, приёмка комиссией по пунктам ТЗ, штрафы за отклонение.',
      ok: 'wf', part: ['v'], rs: [
        { t: 'Объём и цена зафиксированы контрактом, приёмка по ТЗ: менять требования по ходу почти невозможно', ok: true },
        { t: 'Водопад быстрее Scrum, а у госзаказчика сроки' },
        { t: 'Госзаказчики не любят новые подходы' }],
      why: 'Когда объём и цена записаны в контракт, а принимают по пунктам ТЗ, честнее последовательные этапы с подробным ТЗ. Внутри этапа разработки команда может работать итерациями, но снаружи это водопад. V-модель тоже уместна, если заказчик требует программу испытаний на каждый уровень.' },
    { id: 'med', t: '🩺 ПО для дозатора лекарств в больнице', d: 'Прибор дозирует лекарство через капельницу. Ошибка может стоить жизни, регулятор требует доказать, что каждое требование проверено.',
      ok: 'v', part: ['wf'], rs: [
        { t: 'Ошибка опасна для жизни: каждому уровню требований нужен свой спланированный уровень проверки и трассировка «требование → тест»', ok: true },
        { t: 'V-модель — тот же водопад, просто модное название' },
        { t: 'Пользователей мало, поэтому обратная связь не нужна' }],
      why: 'Медицинское ПО (IEC 62304) требует доказуемой проверки каждого требования на своём уровне — это V-модель. Водопад засчитан частично: последовательность та же, но без парных уровней тестирования не хватает главного.' }
  ];
  function chEval(a) {
    a = a || {}; const p = a.p || {}, r = a.r || {};
    const per = {}; let sum = 0;
    PROJ.forEach(x => {
      const ap = p[x.id] === x.ok ? 1 : x.part.includes(p[x.id]) ? 0.5 : 0;
      const ri = r[x.id], rs = ri != null && x.rs[ri] && x.rs[ri].ok ? 1 : 0;
      per[x.id] = { ap, rs, s: ap * 0.6 + rs * 0.4 }; sum += per[x.id].s;
    });
    const score = sum / PROJ.length;
    return { per, score, ok: score >= 0.8 && PROJ.every(x => per[x.id].ap > 0) };
  }
  const chooseTask = {
    id: 'choose', title: 'Подход для четырёх проектов «Орбиты»',
    simple: howModels.simple,
    lead: ui.brief({
      situation: 'Артём показывает портфель «Орбиты»: «У нас четыре проекта, и на всех почему-то один процесс. Давай разберёмся, что кому подходит, — и с главным аргументом, а не „так принято“».',
      todo: [
        'Для каждого проекта выберите подход.',
        'Выберите главный аргумент — тот, с которым вы пойдёте к заказчику.',
        'Нажмите «Проверить». Засчитывается от 80 %, и ни один подход не должен быть совсем мимо.'
      ],
      look: 'Ищите в описании признаки: стабильны ли требования, что фиксирует договор, насколько опасна ошибка, как приходит работа — проектом или потоком.'
    }),
    blank: () => ({ p: {}, r: {} }),
    reference: () => ({ p: Object.fromEntries(PROJ.map(x => [x.id, x.ok])), r: Object.fromEntries(PROJ.map(x => [x.id, x.rs.findIndex(y => y.ok)])) }),
    render(el, ctx) {
      el.classList.add('mpr-root');
      const a = ctx.ans; a.p = a.p || {}; a.r = a.r || {};
      const rv = !!(ctx.result || ctx.readonly), D = ctx.readonly ? 'disabled' : '';
      function draw() {
        const ev = chEval(a);
        el.innerHTML = `<div class="stack">${PROJ.map(x => {
          const pe = ev.per[x.id], cls = rv ? (pe.s >= 0.99 ? 'ok' : pe.s >= 0.5 ? 'warn' : 'bad') : '';
          const order = TR.shuffle(x.rs.map((_, i) => i), 'mpr-' + x.id);
          return `<div class="mpr-proj ${cls}"><h4>${x.t}</h4><div class="d">${esc(x.d)}</div>
            <div class="row" role="group" aria-label="Подход">${APP.map(o => `<button type="button" class="chip" data-p="${x.id}" data-v="${o.v}" aria-pressed="${a.p[x.id] === o.v}" ${D}>${o.t}</button>`).join('')}</div>
            <span class="mpr-lbl">Главный аргумент</span>
            ${order.map(i => `<button type="button" class="mpr-opt ${rv && a.r[x.id] === i ? (x.rs[i].ok ? 'ok' : 'bad') : ''}" data-r="${x.id}" data-i="${i}" aria-pressed="${a.r[x.id] === i}" ${D}><span class="mk" aria-hidden="true"></span><span>${esc(x.rs[i].t)}</span></button>`).join('')}
            ${rv ? `<div class="mpr-why">${esc(x.why)}</div>` : ''}</div>`;
        }).join('')}</div>`;
      }
      draw();
      el.addEventListener('click', e => {
        if (ctx.readonly) return;
        const p = e.target.closest('[data-p]'), r = e.target.closest('[data-r]');
        if (p) { a.p[p.dataset.p] = p.dataset.v; ctx.decide('Подход: ' + p.dataset.p, APP_T[p.dataset.v]); }
        else if (r) a.r[r.dataset.r] = +r.dataset.i;
        else return;
        ctx.save(); draw();
      });
    },
    check(ans) {
      const ev = chEval(ans), a = ans || {}, notes = [];
      PROJ.forEach(x => {
        const pe = ev.per[x.id], pv = (a.p || {})[x.id];
        if (!pv) { notes.push({ ok: false, html: `${x.t}: подход не выбран.` }); return; }
        if (pe.ap === 1 && pe.rs === 1) notes.push({ ok: true, html: `${x.t}: ${APP_T[pv]} — и аргумент по существу.` });
        else if (pe.ap === 0) notes.push({ ok: false, html: `${x.t}: ${APP_T[pv]} здесь мимо. ${x.id === 'iskra' ? 'Известен ли объём заранее? Кто и как часто смотрит результат?' : x.id === 'smile' ? 'Работа приходит проектом с целью или потоком заявок разной срочности?' : x.id === 'gov' ? 'Что зафиксировано в контракте и по чему принимают работу?' : 'Что требует регулятор, когда ошибка опасна для жизни?'}` });
        else if (pe.ap === 0.5) notes.push({ ok: 'warn', html: `${x.t}: ${APP_T[pv]} — возможно, но не лучший выбор. ${esc(x.why)}` });
        if (pe.ap > 0 && pe.rs === 0) notes.push({ ok: 'warn', html: `${x.t}: аргумент не тот. ${(a.r || {})[x.id] == null ? 'Он не выбран.' : 'Такой довод заказчик разобьёт одним вопросом: подход выбирают по свойствам проекта, а не по моде или удобству.'}` });
      });
      return { ok: ev.ok, score: ev.score, notes, summary: `Подходы и аргументы: ${Math.round(ev.score * 100)} %.`,
        mentor: (a.p || {}).iskra === 'wf' ? 'Тимур Рашидович просит ТЗ — но это не значит, что ему нужен водопад. Ему нужна уверенность, что к 15 марта будет работающее. Её дают демо каждые две недели лучше, чем подпись на ТЗ.' : null };
    },
    explain: `<ul class="checks">
        <li><b>«Искра Онлайн» — Scrum.</b> Новый продукт, жёсткая дата, объём уточняется. Итерации гарантируют, что к 15 марта сделано самое ценное.</li>
        <li><b>Поддержка «Улыбки» — Kanban.</b> Поток заявок разной срочности; метрика — время выполнения, срочное идёт по отдельному классу обслуживания.</li>
        <li><b>Госзаказ — водопад.</b> Контракт фиксирует объём и цену, приёмка по ТЗ. Гибкость внутри этапов возможна, но не снаружи.</li>
        <li><b>Медицинский дозатор — V-модель.</b> Доказуемая проверка каждого уровня требований и трассировка.</li>
      </ul>
      <p>Подход — инструмент под условия. На собеседовании ценят не «я за Agile», а умение назвать признаки: стабильность требований, тип договора, цену ошибки, характер потока работы.</p>
      <p class="small muted">Источники: Скрам-гайд 2020; Д. Андерсон, «Канбан»; Манифест гибкой разработки ПО; ГОСТ 34.602; IEC 62304 (жизненный цикл ПО медицинских изделий); BABOK v3 — выбор подхода к анализу (предиктивный и адаптивный).</p>`,
    refNote: 'Засчитывается и «соседний» подход там, где он разумен (Scrum для поддержки, V-модель для госзаказа, водопад для медицины) — за половину балла.',
    report: ans => { const a = ans || {}; return PROJ.map(x => `${x.t}: ${APP_T[(a.p || {})[x.id]] || '—'}; аргумент: ${(a.r || {})[x.id] != null ? x.rs[a.r[x.id]].t : '—'}`).join('\n') + `\nБалл: ${Math.round(chEval(a).score * 100)} %`; }
  };

  // =====================================================================
  // Практика 2. Роли, события, артефакты Scrum
  // =====================================================================
  const SB = [{ id: 'role', t: 'Роли (ответственности)' }, { id: 'event', t: 'События' }, { id: 'art', t: 'Артефакты' }, { id: 'no', t: 'Не из Скрам-гайда', sub: 'практики команд и чужие понятия' }];
  const SI = [
    { id: 'po', t: 'Владелец продукта', ok: 'role', why: 'Одна из трёх ответственностей: ценность продукта и порядок бэклога.' },
    { id: 'sm', t: 'Scrum-мастер', ok: 'role', why: 'Ответственность за то, чтобы Scrum работал.' },
    { id: 'dev', t: 'Разработчики (включая QA и аналитика)', ok: 'role', why: 'Все, кто делает инкремент. Отдельных ролей тестировщика и аналитика в Scrum нет.' },
    { id: 'spr', t: 'Спринт', ok: 'event', why: 'Событие-контейнер для всех остальных.' },
    { id: 'pl', t: 'Планирование спринта', ok: 'event', why: 'Зачем, что и как в этом спринте.' },
    { id: 'dl', t: 'Ежедневный Scrum', ok: 'event', why: '15 минут разработчиков о движении к цели спринта.' },
    { id: 'rv', t: 'Обзор спринта (демо)', ok: 'event', why: 'Показ инкремента заинтересованным сторонам и адаптация бэклога.' },
    { id: 'rt', t: 'Ретроспектива', ok: 'event', why: 'Улучшение того, как команда работает.' },
    { id: 'pb', t: 'Бэклог продукта', ok: 'art', why: 'Артефакт, обязательство — цель продукта.' },
    { id: 'sb', t: 'Бэклог спринта', ok: 'art', why: 'Артефакт, обязательство — цель спринта.' },
    { id: 'inc', t: 'Инкремент', ok: 'art', why: 'Артефакт, обязательство — Definition of Done.' },
    { id: 'pm', t: 'Руководитель проекта', ok: 'no', why: 'В Scrum такой роли нет: его функции распределены между владельцем продукта, Scrum-мастером и командой. В студиях он есть из-за договора и бюджета — но это не Scrum.' },
    { id: 'gantt', t: 'Диаграмма Ганта на весь проект', ok: 'no', why: 'Инструмент предиктивного планирования, к Scrum не относится.' },
    { id: 'dor', t: 'Definition of Ready', ok: 'no', why: 'Популярная практика команд, но в Скрам-гайде её нет (в отличие от Definition of Done).' },
    { id: 'poker', t: 'Покер планирования и сторипоинты', ok: 'no', why: 'Техника оценки, придуманная вне Scrum (Джеймс Греннинг, Майк Кон). Скрам-гайд не говорит, как оценивать.' },
    { id: 'groom', t: 'Груминг (уточнение бэклога)', ok: 'no', why: 'В Скрам-гайде 2020 это постоянная активность, а не событие. Многие команды проводят её встречей — но формально события «груминг» нет.' }
  ];
  const scrumTask = {
    id: 'scrum', title: 'Разложить Scrum: роли, события, артефакты',
    simple: howScrum.simple,
    lead: ui.brief({
      situation: 'Даша никогда не работала по Scrum и просит «шпаргалку на одну страницу». Глеб подкидывает ловушки: «А груминг — это событие? А DoR — артефакт?» Разложите карточки так, чтобы Даша не запуталась.',
      todo: ['Разложите 16 карточек по четырём корзинам.', 'Нажмите «Проверить». Засчитывается от 80 % правильно разложенных.'],
      look: 'Ловушки — то, что команды делают постоянно, но чего нет в Скрам-гайде. Знать разницу полезно на собеседовании: «это часть Scrum» и «это наша практика» — разные утверждения.'
    }),
    blank: () => ({ v: {} }),
    reference: () => ({ v: Object.fromEntries(SI.map(x => [x.id, x.ok])) }),
    render(el, ctx) {
      el.classList.add('mpr-root');
      const a = ctx.ans; a.v = a.v || {};
      const rv = (ctx.result || ctx.readonly) ? Object.fromEntries(SI.filter(x => a.v[x.id]).map(x => [x.id, a.v[x.id] === x.ok ? 'ok' : 'bad'])) : null;
      const box = document.createElement('div'); el.appendChild(box);
      ui.sort(box, { items: SI.map(x => ({ id: x.id, t: x.t })), buckets: SB, value: a.v, reveal: rv, readonly: ctx.readonly, seed: 'mpr-scrum',
        onChange: v => { a.v = v; ctx.save(); } });
      if (ctx.result || ctx.readonly) el.insertAdjacentHTML('beforeend', `<div class="stack tight" style="margin-top:10px">${ui.note('info', 'Пояснения', `<ul class="checks">${SI.filter(x => a.v[x.id] && a.v[x.id] !== x.ok).map(x => `<li class="bad"><b>${esc(x.t)}</b> → ${esc(SB.find(b => b.id === x.ok).t)}. ${esc(x.why)}</li>`).join('') || '<li>Все разложенные карточки на своих местах.</li>'}</ul>`)}</div>`);
    },
    check(ans) {
      const v = (ans && ans.v) || {}, good = SI.filter(x => v[x.id] === x.ok), bad = SI.filter(x => v[x.id] && v[x.id] !== x.ok), miss = SI.filter(x => !v[x.id]);
      const score = good.length / SI.length, notes = [];
      if (good.length) notes.push({ ok: true, html: `На месте ${good.length} из ${SI.length}.` });
      bad.forEach(x => notes.push({ ok: false, html: `<b>${esc(x.t)}</b> — не «${esc(SB.find(b => b.id === v[x.id]).t)}». ${esc(x.why)}` }));
      if (miss.length) notes.push({ ok: false, html: `Не разложены: ${miss.map(x => esc(x.t)).join(', ')}.` });
      return { ok: score >= 0.8, score, notes, summary: `Разложено верно ${good.length} из ${SI.length}.`,
        mentor: v.groom === 'event' || v.dor === 'art' ? 'Ловушка Глеба сработала — и это нормально: многие опытные команды думают так же. Груминг и DoR полезны, но это ваши договорённости, а не Scrum. На собеседовании это различие звучит очень убедительно.' : null };
    },
    explain: `<p><b>3 ответственности</b>: владелец продукта, Scrum-мастер, разработчики. <b>5 событий</b>: спринт, планирование, ежедневный Scrum, обзор, ретроспектива. <b>3 артефакта</b> с обязательствами: бэклог продукта — цель продукта, бэклог спринта — цель спринта, инкремент — Definition of Done.</p>
      <p>Всё остальное — DoR, сторипоинты, покер планирования, встреча груминга, руководитель проекта, диаграмма Ганта — может жить рядом со Scrum, но в Скрам-гайд не входит. Аналитик в Scrum — один из разработчиков.</p>
      <p class="small muted">Источник: К. Швабер, Дж. Сазерленд, «Руководство по скраму» (Скрам-гайд), редакция ноября 2020; М. Кон, «Agile: оценка и планирование проектов».</p>`,
    report: ans => { const v = (ans && ans.v) || {}; return SB.map(b => `${b.t}: ${SI.filter(x => v[x.id] === b.id).map(x => x.t + (x.ok === b.id ? '' : ' ✗')).join(', ') || '—'}`).join('\n'); }
  };

  // =====================================================================
  // Практика 3. Лаборатория: Kanban-доска с WIP-лимитами
  // =====================================================================
  const KB_N = 24, KB_DAYS = 10;
  const LIMS = ['1', '2', '3', '4', '5', 'inf'];
  const limN = v => v === 'inf' || !v ? 99 : +v;
  const limT = v => v === 'inf' ? '∞' : v || '—';
  const POL = [
    { v: 'none', t: 'Ничего не меняем: пусть очередь копится, Лиза разберёт' },
    { v: 'swarm', t: 'Свободные помогают узкому месту: Глеб и Даша пишут автотесты и проверяют сборки, аналитик проверяет приёмку по критериям' },
    { v: 'skip', t: 'Ускоряем тест: Лиза проверяет только новое, без регресса' }
  ];
  function kbSim(o) {
    o = o || {};
    const L = { a: limN(o.la), d: limN(o.ld), t: limN(o.lt) }, T = o.pol === 'skip' ? 0.5 : 1;
    const cards = Array.from({ length: KB_N }, (_, i) => ({ n: 112 + i, col: 'b', a: 0.5, d: 1, t: T, s: null, f: null }));
    const cnt = c => cards.filter(x => x.col === c).length;
    const snap = () => ({ b: cards.filter(x => x.col === 'b').map(x => x.n), x: cards.filter(x => x.col === 'x').map(x => x.n),
      a: cards.filter(x => x.col === 'a').map(x => ({ n: x.n, fin: x.a <= 1e-9 })), d: cards.filter(x => x.col === 'd').map(x => ({ n: x.n, fin: x.d <= 1e-9 })), t: cards.filter(x => x.col === 't').map(x => ({ n: x.n, fin: x.t <= 1e-9 })) });
    const snaps = [snap()];
    let idle = 0, maxT = 0, maxTday = 0;
    const work = (col, key, cap) => {
      const inCol = cards.filter(x => x.col === col);
      const pen = col === 't' ? Math.max(0.6, 1 - 0.07 * Math.max(0, inCol.filter(x => x[key] > 1e-9).length - 2)) : 1;
      let c = cap * pen;
      for (const x of inCol) { if (c <= 1e-9) break; if (x[key] > 1e-9) { const u = Math.min(c, x[key]); x[key] -= u; c -= u; } }
      return c / pen;
    };
    for (let day = 1; day <= KB_DAYS; day++) {
      cards.filter(x => x.col === 't' && x.t <= 1e-9).forEach(x => { x.col = 'x'; x.f = day - 1; });
      for (const x of cards.filter(x => x.col === 'd' && x.d <= 1e-9)) if (cnt('t') < L.t) x.col = 't';
      for (const x of cards.filter(x => x.col === 'a' && x.a <= 1e-9)) if (cnt('d') < L.d) x.col = 'd';
      for (const x of cards.filter(x => x.col === 'b')) if (cnt('a') < L.a) { x.col = 'a'; x.s = day; }
      if (cnt('t') > maxT) { maxT = cnt('t'); maxTday = day; }
      work('t', 't', 1);
      const dv = work('d', 'd', 2), an = work('a', 'a', 1);
      if (o.pol === 'swarm') idle += work('t', 't', (dv + an) * 0.5) / 0.5; else idle += dv + an;
      snaps.push(snap());
    }
    cards.filter(x => x.col === 't' && x.t <= 1e-9).forEach(x => { x.col = 'x'; x.f = KB_DAYS; });
    snaps[KB_DAYS] = snap();
    const done = cards.filter(x => x.col === 'x'), wipC = cards.filter(x => 'adt'.includes(x.col));
    const ct = done.length ? done.reduce((s, x) => s + (x.f - x.s + 1), 0) / done.length : 0;
    const age = wipC.length ? wipC.reduce((s, x) => s + (KB_DAYS - x.s + 1), 0) / wipC.length : 0;
    return { done: done.length, ct: Math.round(ct * 10) / 10, wip: wipC.length, age: Math.round(age * 10) / 10, idle: Math.round(idle * 2) / 2, maxT, maxTday,
      esc: o.pol === 'skip' ? Math.round(done.length * 0.3) : 0, snaps, L };
  }
  function kbEval(a) {
    a = a || {};
    if (!a.la || !a.ld || !a.lt || !a.pol) return { r: null, score: 0, ok: false, k: [0, 0, 0, 0, 0] };
    const r = kbSim(a), lt = limN(a.lt);
    const k = [lt <= 3 ? 1 : lt <= 5 ? 0.5 : 0, a.pol === 'swarm' ? 1 : a.pol === 'none' ? 0.3 : 0, r.done >= 9 ? 1 : Math.max(0, (r.done - 5) / 4), r.ct <= 5 ? 1 : r.ct <= 6 ? 0.5 : 0, r.wip <= 8 ? 1 : 0];
    const score = k.reduce((s, x) => s + x, 0) / k.length;
    return { r, k, score, ok: score >= 0.8 && a.pol === 'swarm' && lt <= 3 && r.done >= 9 && r.ct <= 5 };
  }
  function kbEvents(a, r) {
    const ev = [], add = (d, t, k) => ev.push({ d, t, k });
    if (limN(a.la) >= 99) add('День 1', `Без лимита на анализ вы «взяли в работу» все ${KB_N} задачи сразу. К разработке половины из них требования устареют — Марина Олеговна успеет передумать.`, 'bad');
    else add('День 1', `Анализ берёт не больше ${a.la} задач: остальные спокойно лежат в бэклоге, их порядок ещё может поменять владелец продукта.`, 'ok');
    if (limN(a.ld) >= 99) add('День 3', 'Разработка без лимита: Глеб и Даша начинают новое, не дожидаясь теста. Наполовину проверенные задачи копятся.', 'warn');
    if (r.maxT >= 5) add('День ' + r.maxTday, `У Лизы ${r.maxT} задач одновременно. Она переключается между ними и теряет до 40 % времени. «Я не успеваю» — и это видно только ей.`, 'bad');
    else add('День ' + Math.max(3, r.maxTday), `В тестировании не больше ${r.maxT} задач: Лиза доводит до конца одну, прежде чем брать следующую.`, 'ok');
    if (a.pol === 'none' && r.idle > 3) add('Неделя 2', `Колонки упёрлись в лимиты, Глеб, Даша и вы простаиваете ${fmt(r.idle)} чел.-дня. Лимит сделал проблему видимой — но никто не помог тестированию.`, 'warn');
    if (a.pol === 'none' && r.idle <= 3) add('Неделя 2', 'Все заняты, никто не простаивает — а до «Готово» доходит мало. Загрузка людей не равна скорости потока.', 'warn');
    if (a.pol === 'swarm') add('Неделя 2', r.idle > 3 || limN(a.lt) < 99 ? 'Глеб и Даша пишут автотесты на отмену записи, вы проверяете сборки по критериям приёмки. Тестирование перестало быть узким местом.' : 'Помогать некому: без лимитов все заняты своим и никогда не освобождаются. Помощь узкому месту включается только вместе с WIP-лимитами.', r.idle > 3 || limN(a.lt) < 99 ? 'ok' : 'warn');
    if (a.pol === 'skip') add('После релиза', `Готово ${r.done} задач, но без регресса ${r.esc} дефекта ушли к клиентам: например, после отмены записи слот не освобождается, а повторная оплата списывает деньги дважды. Марина Олеговна разбирает жалобы.`, 'bad');
    add('День 10', `Итог: готово ${r.done} из ${KB_N}, среднее время цикла ${fmt(r.ct)} дн., в работе осталось ${r.wip} (средний возраст ${fmt(r.age)} дн.).`, r.done >= 9 && r.ct <= 5 && a.pol !== 'skip' ? 'ok' : 'warn');
    return ev;
  }
  function kbBoard(s, L, day) {
    const cd = (x, old) => `<span class="mpr-cd ${x.fin ? 'fin' : ''} ${old ? 'old' : ''}">${x.n}</span>`;
    const many = (arr, max) => arr.slice(0, max).map(n => `<span class="mpr-cd">${n}</span>`).join('') + (arr.length > max ? `<span class="small dim">+${arr.length - max}</span>` : '');
    const col = (t, list, lim) => { const full = lim < 99 && list.length >= lim, jam = lim >= 99 && list.length >= 5; return `<div class="mpr-col ${jam ? 'jam' : full ? 'full' : ''}"><header><b>${t}</b><span>${list.length}/${lim >= 99 ? '∞' : lim}</span></header><div class="mpr-cards">${list.slice(0, 12).map(x => cd(x)).join('')}${list.length > 12 ? `<span class="small dim">+${list.length - 12}</span>` : ''}</div></div>`; };
    return `<div class="mpr-scroll"><div class="mpr-board">
      <div class="mpr-col"><header><b>Бэклог</b><span>${s.b.length}</span></header><div class="mpr-cards">${many(s.b, 6)}</div></div>
      ${col('Анализ', s.a, L.a)}${col('Разработка', s.d, L.d)}${col('Тест', s.t, L.t)}
      <div class="mpr-col"><header><b>Готово</b><span>${s.x.length}</span></header><div class="mpr-cards">${many(s.x, 12)}</div></div>
    </div></div><div class="small dim">День ${day}. Зелёная рамка — работа в колонке закончена, задача ждёт, пока её заберут дальше.</div>`;
  }
  const kanbanTask = {
    id: 'kanban', title: 'Лаборатория: Kanban-доска и узкое место в тестировании',
    simple: howKanban.simple,
    lead: ui.brief({
      situation: 'Модель на две недели: в бэклоге 24 задачи (ISK-112…ISK-135). Вы разбираете две задачи в день, Глеб и Даша вместе разрабатывают две в день, Лиза одна тестирует одну в день. Глеб: «Мы быстрые, давайте просто брать больше». Артём просит настроить доску так, чтобы к пятнице было больше готового, а не начатого.',
      todo: [
        'Задайте WIP-лимиты для колонок «Анализ», «Разработка» и «Тест» (∞ — без лимита).',
        'Решите, что делать, когда тестирование не успевает.',
        'Нажмите «▶ Прожить две недели», посмотрите доску по дням и итог. Меняйте настройки и прогоняйте снова.',
        'Нажмите «Проверить». Засчитывается от 80 %: готово не меньше 9 задач, время цикла не больше 5 дней, лимит на тест не больше 3 и без отказа от регресса.'
      ],
      look: 'Пропускная способность всей доски равна пропускной способности узкого места. Лимиты не ускоряют людей — они не дают копить очереди и освобождают руки, чтобы помочь узкому месту. Модель учебная: числа упрощены, но эффект — как в жизни.'
    }),
    blank: () => ({ la: '', ld: '', lt: '', pol: '', ran: false, day: 10 }),
    reference: () => ({ la: '2', ld: '2', lt: '2', pol: 'swarm', ran: true, day: 10 }),
    render(el, ctx) {
      el.classList.add('mpr-root');
      const a = ctx.ans, rv = !!(ctx.result || ctx.readonly), D = ctx.readonly ? 'disabled' : '';
      if (a.day == null) a.day = KB_DAYS;
      el.innerHTML = `<div class="stack">${ui.say('liza', 'Я не против работать быстрее. Я против того, чтобы у меня одновременно висело восемь недопроверенных задач.')}${ui.say('gleb', 'А я против того, чтобы сидеть без дела, когда колонка «Разработка» заполнена.')}<div class="stack" data-ds></div><div data-run></div><div data-out></div></div>`;
      function decs() {
        const ev = kbEval(a);
        const segs = (k, label) => `<div class="mpr-lim"><span>${label}</span><div class="row" role="group" aria-label="${label}">${LIMS.map(v => `<button type="button" class="chip" data-l="${k}" data-v="${v}" aria-pressed="${a[k] === v}" ${D}>${limT(v)}</button>`).join('')}</div></div>`;
        TR.$('[data-ds]', el).innerHTML = `<div class="mpr-dec ${rv ? (ev.k[0] === 1 ? 'ok' : 'bad') : ''}"><div class="hd"><span class="mpr-lbl">Решение 1</span><b>WIP-лимиты колонок</b></div>
            ${segs('la', 'Анализ (вы)')}${segs('ld', 'Разработка (Глеб, Даша)')}${segs('lt', 'Тест (Лиза)')}
            <div class="row"><button type="button" class="btn sm" data-pre ${D}>Как сейчас: без лимитов</button></div></div>
          <div class="mpr-dec ${rv ? (ev.k[1] === 1 ? 'ok' : 'bad') : ''}"><div class="hd"><span class="mpr-lbl">Решение 2</span><b>Тестирование не успевает. Что делаем?</b></div>
            ${POL.map(o => `<button type="button" class="mpr-opt ${rv && a.pol === o.v ? (o.v === 'swarm' ? 'ok' : 'bad') : ''}" data-pol="${o.v}" aria-pressed="${a.pol === o.v}" ${D}><span class="mk" aria-hidden="true"></span><span>${esc(o.t)}</span></button>`).join('')}</div>`;
      }
      function out() {
        const all = a.la && a.ld && a.lt && a.pol;
        TR.$('[data-run]', el).innerHTML = ctx.readonly ? '' : `<div class="row"><button type="button" class="btn primary" data-go ${all ? '' : 'disabled'}>▶ Прожить две недели</button><span class="small dim">${all ? 'Можно менять настройки и прогонять снова.' : 'Сначала задайте три лимита и выберите решение 2.'}</span></div>`;
        if (!all || !(a.ran || rv)) { TR.$('[data-out]', el).innerHTML = ''; return; }
        const r = kbSim(a), day = Math.max(0, Math.min(KB_DAYS, a.day == null ? KB_DAYS : a.day));
        const cfd = r.snaps.slice(1).map(s => { const h = k => (s[k].length / KB_N * 100).toFixed(1) + '%'; return `<div title="День"><i class="x" style="height:${h('x')}"></i><i class="t" style="height:${h('t')}"></i><i class="d" style="height:${h('d')}"></i><i class="a" style="height:${h('a')}"></i></div>`; }).join('');
        TR.$('[data-out]', el).innerHTML = `<div class="mpr-res"><div class="eyebrow">Что произошло за две недели</div>
          <div class="mpr-stats6">${st('Готово', r.done + ' из ' + KB_N, r.done >= 9 ? 'ok' : r.done >= 7 ? 'warn' : 'bad', 'задач')}${st('Время цикла', fmt(r.ct), r.ct <= 5 ? 'ok' : r.ct <= 6 ? 'warn' : 'bad', 'дней в среднем')}${st('В работе', r.wip, r.wip <= 8 ? 'ok' : 'bad', 'начато, не готово')}${st('Очередь у Лизы', r.maxT, r.maxT <= 3 ? 'ok' : r.maxT <= 5 ? 'warn' : 'bad', 'максимум')}${st('Простой', fmt(r.idle), a.pol === 'none' && r.idle > 3 ? 'warn' : '', 'чел.-дней')}${st('Дефекты у клиентов', r.esc, r.esc ? 'bad' : 'ok', r.esc ? 'без регресса' : 'регресс на месте')}</div>
          <div class="mpr-lim"><span>Доска на день <b>${day}</b></span><input type="range" min="0" max="${KB_DAYS}" value="${day}" data-day aria-label="День для просмотра доски"></div>
          <div data-bd>${kbBoard(r.snaps[day], r.L, day)}</div>
          <div><span class="mpr-lbl">Кумулятивная диаграмма потока: доля задач по колонкам, дни 1–10</span><div class="mpr-cfd">${cfd}</div><div class="mpr-leg"><span><i style="background:var(--info)"></i>анализ</span><span><i style="background:var(--accent)"></i>разработка</span><span><i style="background:var(--warn)"></i>тест</span><span><i style="background:var(--ok)"></i>готово</span><span><i style="background:var(--surface-3)"></i>бэклог</span></div></div>
          <div class="mpr-tl">${kbEvents(a, r).map(x => `<div class="mpr-ev ${x.k}"><span class="t">${esc(x.d)}</span><span>${esc(x.t)}</span></div>`).join('')}</div></div>`;
      }
      decs(); out();
      el.addEventListener('input', e => {
        if (!e.target.matches('[data-day]')) return;
        a.day = +e.target.value; ctx.save();
        const r = kbSim(a); TR.$('[data-bd]', el).innerHTML = kbBoard(r.snaps[a.day], r.L, a.day);
        const lb = e.target.parentElement.querySelector('b'); if (lb) lb.textContent = a.day;
      });
      el.addEventListener('click', e => {
        if (ctx.readonly) return;
        const l = e.target.closest('[data-l]'), p = e.target.closest('[data-pol]'), go = e.target.closest('[data-go]'), pre = e.target.closest('[data-pre]');
        if (l) { a[l.dataset.l] = l.dataset.v; a.ran = false; }
        else if (p) { a.pol = p.dataset.pol; a.ran = false; ctx.decide('Kanban: что делать с узким местом', POL.find(x => x.v === a.pol).t); }
        else if (pre) { a.la = a.ld = a.lt = 'inf'; a.ran = false; }
        else if (go) { a.ran = true; a.day = KB_DAYS; ctx.decide('Kanban: WIP-лимиты', `анализ ${limT(a.la)}, разработка ${limT(a.ld)}, тест ${limT(a.lt)}`); }
        else return;
        ctx.save(); decs(); out();
        if (go) { const o = TR.$('[data-out]', el); o && o.scrollIntoView && o.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
      });
    },
    check(ans) {
      const ev = kbEval(ans), a = ans || {}, notes = [];
      if (!ev.r) return { ok: false, score: 0, notes: [{ ok: false, html: 'Задайте все три лимита и выберите, что делать с тестированием.' }], summary: 'Настройки не заданы.' };
      const r = ev.r, lt = limN(a.lt);
      notes.push(lt <= 3 ? { ok: true, html: `Лимит на тест — ${a.lt}: Лиза не тонет в недопроверенных задачах.` } : { ok: false, html: `Лимит на тест — ${limT(a.lt)}. Узкое место — тестирование: если туда можно сваливать сколько угодно, очередь просто переезжает к Лизе и становится невидимой. Сколько задач одновременно может держать в голове один тестировщик?` });
      if (limN(a.la) >= 99) notes.push({ ok: 'warn', html: 'Анализ без лимита: вы «начали» все задачи сразу. Требования, разобранные за три недели до разработки, устаревают. Аналитику тоже нужен лимит — на спринт вперёд, не на квартал.' });
      if (a.pol === 'swarm') notes.push({ ok: true, html: 'Свободные помогают узкому месту: автотесты, проверка сборок, приёмка по критериям.' });
      else if (a.pol === 'skip') notes.push({ ok: false, html: `Отказ от регресса ускорил доску, но ${r.esc} дефекта ушли к клиентам. Это не решение узкого места, а перенос проблемы на клиентов «Искры» и на поддержку.` });
      else notes.push({ ok: false, html: 'Очередь просто копится. Лимит показал проблему — что могут сделать Глеб, Даша и вы, когда колонка разработки заполнена?' });
      notes.push({ ok: r.done >= 9 ? true : false, html: `Готово ${r.done} из ${KB_N} (нужно от 9).` });
      notes.push({ ok: r.ct <= 5 ? true : r.ct <= 6 ? 'warn' : false, html: `Среднее время цикла ${fmt(r.ct)} дн. (нужно не больше 5).${r.ct > 5 ? ' Чем больше задач в работе одновременно, тем дольше каждая идёт до конца — закон Литтла.' : ''}` });
      if (r.wip > 8) notes.push({ ok: false, html: `В работе осталось ${r.wip} задач: много начатого и мало законченного.` });
      return { ok: ev.ok, score: ev.score, notes, summary: `Готово ${r.done}, время цикла ${fmt(r.ct)} дн., в работе ${r.wip}, дефектов у клиентов ${r.esc}.`,
        mentor: a.pol === 'skip' ? 'Самое быстрое решение на доске — самое дорогое у клиента. Тестирование — не формальность, которую можно отрезать, когда горит. Горит — значит, помогаем.' : limN(a.lt) >= 99 && limN(a.ld) >= 99 ? 'Без лимитов все заняты, а готово мало — так выглядит большинство команд «до Kanban». Первый шаг — не нанимать, а перестать начинать новое, пока не закончено старое.' : null };
    },
    explain: `<ul class="checks">
        <li><b>Узкое место определяет скорость всей доски.</b> Разработка делает две задачи в день, тест — одну. Сколько бы ни начинали, до «Готово» дойдёт примерно столько, сколько проверит Лиза.</li>
        <li><b>WIP-лимиты сокращают время цикла.</b> Меньше задач одновременно — каждая идёт до конца быстрее, требования не устаревают, Лиза не переключается между восемью задачами.</li>
        <li><b>Лимит делает простой видимым — и это хорошо.</b> Глеб без задачи в разработке — сигнал «помоги тестированию»: автотесты, проверка сборок, разбор дефектов. Аналитик помогает приёмкой по своим же критериям.</li>
        <li><b>Отказ от регресса — ложное ускорение.</b> Доска зеленеет, а дефекты уходят к клиентам: двойные списания и неосвобождённые слоты бьют прямо по целям «Искры».</li>
        <li><b>Лимит на анализ — тоже про аналитика.</b> Разобрать все задачи на месяц вперёд — значит переделывать половину, когда бизнес передумает.</li>
      </ul>
      <p>Хорошие ответы: лимиты 2–3 на тест и разработку, помощь узкому месту. Числа модели учебные, но вывод универсален: «остановите начинание, начните заканчивать» (Stop starting, start finishing).</p>
      <p class="small muted">Источники: Д. Андерсон, «Канбан. Альтернативный путь в Agile»; Э. Голдратт, «Цель» — теория ограничений; Дж. Литтл, 1961 — закон Литтла; Д. Вакантэ, «Kanban: метрики потока».</p>`,
    refNote: 'Засчитываются и другие сочетания: лимит на тест 2–3, на разработку 2–3, с помощью узкому месту — если итог проходит пороги.',
    report: ans => { const a = ans || {}, ev = kbEval(a); return `Лимиты: анализ ${limT(a.la)}, разработка ${limT(a.ld)}, тест ${limT(a.lt)}\nУзкое место: ${(POL.find(x => x.v === a.pol) || { t: '—' }).t}\n` + (ev.r ? `Итог: готово ${ev.r.done}/${KB_N}, цикл ${fmt(ev.r.ct)} дн., в работе ${ev.r.wip}, дефектов ${ev.r.esc}; балл ${Math.round(ev.score * 100)} %` : 'Не прогнано'); }
  };

  // =====================================================================
  // Практика 4. Аналитик в потоке спринтов
  // =====================================================================
  const SLOTS = [
    { v: 's1', t: 'Спринт 1 — пока команда делает отмену записи' },
    { v: 'plan', t: 'Планирование спринта 2' },
    { v: 'in', t: 'Внутри спринта 2' },
    { v: 'rev', t: 'Обзор спринта 2 (демо)' },
    { v: 'retro', t: 'Ретроспектива спринта 2' }
  ];
  const SLOT_SHORT = { s1: 'Спринт 1', plan: 'Планирование 2', in: 'Внутри спринта 2', rev: 'Демо 2', retro: 'Ретро 2' };
  const ACTS = [
    { id: 'int', t: 'Интервью с Мариной Олеговной: когда и как напоминать клиенту о записи', ok: ['s1'], why: 'Аналитика на спринт вперёд: если узнавать на планировании, ISK-115 не успеют оценить.' },
    { id: 'spec', t: 'Написать постановку и критерии приёмки ISK-115 «Напоминания»', ok: ['s1'], why: 'К планированию задача должна пройти Definition of Ready.' },
    { id: 'groom', t: 'Груминг ISK-115 с командой: вопросы, разрезание, оценка', ok: ['s1'], why: 'Уточнение бэклога идёт в текущем спринте для следующего.' },
    { id: 'goal', t: 'Объяснить цель ISK-115 и ответить на вопросы, когда команда выбирает задачи', ok: ['plan'], why: 'Это и есть планирование: что берём и зачем.' },
    { id: 'amigo', t: 'Три амиго по ISK-115 с Дашей и Лизой перед стартом разработки', ok: ['in', 's1'], why: 'Обычно в первые дни спринта, иногда — сразу после груминга.' },
    { id: 'ans', t: 'Ответить Даше в задаче: «Что, если запись перенесли после отправки напоминания?»', ok: ['in'], why: 'Сопровождение реализации: ответ в задаче, а не в личке.' },
    { id: 'next', t: 'Подготовить ISK-120 «Онлайн-оплата» к спринту 3: вопросы Ольге Викторовне про чеки', ok: ['in'], why: 'Внутри спринта 2 аналитик уже живёт спринтом 3 — это и есть «на спринт вперёд».' },
    { id: 'acc', t: 'Проверить напоминания на стенде вместе с Лизой по критериям приёмки', ok: ['in'], why: 'Приёмка по критериям — до демо, а не на нём.' },
    { id: 'show', t: 'Показать напоминания Марине Олеговне, записать её замечания в бэклог', ok: ['rev'], why: 'Обзор спринта: показ заинтересованным сторонам и адаптация бэклога.' },
    { id: 'imp', t: 'Сказать, что задачи приходили на планирование сырыми, и предложить груминг по средам', ok: ['retro'], why: 'Ретроспектива — про процесс, а не про продукт.' }
  ];
  const flowTask = {
    id: 'flow', title: 'Аналитик в потоке спринтов: что и когда',
    simple: howScrum.simple,
    lead: ui.brief({
      situation: 'Во втором спринте команда будет делать ISK-115 «Напоминания о записи». Вера просит: «Распиши, что ты делаешь по этой задаче и когда. Хочу увидеть, что ты работаешь на спринт вперёд, а не догоняешь команду».',
      todo: ['Для каждого из десяти дел выберите, когда оно происходит. Шкала внизу заполняется по вашим ответам.', 'Нажмите «Проверить». Засчитывается от 80 %.'],
      look: 'Задайте себе вопрос: «Что должно быть готово к моменту, когда команда начнёт эту задачу?» Всё, что нужно для оценки и планирования, — делается в предыдущем спринте.'
    }),
    blank: () => ({ v: {} }),
    reference: () => ({ v: Object.fromEntries(ACTS.map(x => [x.id, x.ok[0]])) }),
    render(el, ctx) {
      el.classList.add('mpr-root');
      const a = ctx.ans; a.v = a.v || {};
      const rv = (ctx.result || ctx.readonly) ? Object.fromEntries(ACTS.filter(x => a.v[x.id]).map(x => [x.id, { s: x.ok.includes(a.v[x.id]) ? 'ok' : 'bad', why: x.why }])) : null;
      el.innerHTML = '<div class="stack"><div data-m></div><span class="mpr-lbl">Шкала: два спринта аналитика</span><div class="mpr-scroll"><div class="mpr-slots" data-sl></div></div></div>';
      const pv = () => { TR.$('[data-sl]', el).innerHTML = SLOTS.map(s => `<div class="mpr-slot"><header>${esc(SLOT_SHORT[s.v])}</header>${ACTS.filter(x => a.v[x.id] === s.v).map(x => `<span>${esc(x.t)}</span>`).join('')}</div>`).join(''); };
      ui.match(TR.$('[data-m]', el), { rows: ACTS.map(x => ({ id: x.id, t: esc(x.t) })), choices: SLOTS, value: a.v, reveal: rv, readonly: ctx.readonly, placeholder: 'Когда?',
        onChange: v => { a.v = v; ctx.save(); pv(); } });
      pv();
    },
    check(ans) {
      const v = (ans && ans.v) || {}, good = ACTS.filter(x => x.ok.includes(v[x.id])), bad = ACTS.filter(x => v[x.id] && !x.ok.includes(v[x.id])), miss = ACTS.filter(x => !v[x.id]);
      const score = good.length / ACTS.length, notes = [];
      if (good.length) notes.push({ ok: true, html: `На своём месте ${good.length} из ${ACTS.length}.` });
      bad.forEach(x => notes.push({ ok: false, html: `«${esc(x.t)}» — не «${esc(SLOT_SHORT[v[x.id]])}». ${esc(x.why)}` }));
      if (miss.length) notes.push({ ok: false, html: `Не расставлено: ${miss.length}.` });
      const late = ['int', 'spec', 'groom'].filter(id => v[id] && v[id] !== 's1').length;
      return { ok: score >= 0.8, score, notes, summary: `На месте ${good.length} из ${ACTS.length}.`,
        mentor: late >= 2 ? 'Если интервью и постановка происходят в том же спринте, что и разработка, команда первые дни ждёт вас — или угадывает. Аналитик идёт на шаг впереди, как разведчик.' : null };
    },
    explain: `<p>Ритм аналитика в Scrum — <b>на спринт вперёд</b>: в спринте 1 он выясняет, пишет и грумит задачи спринта 2; на планировании объясняет их; внутри спринта 2 сопровождает реализацию, принимает по критериям — и уже готовит спринт 3. На демо собирает замечания в бэклог, на ретро говорит о процессе.</p>
      <p>Опасности по краям: опоздать (задачи сырые, команда ждёт) и забежать слишком далеко (требования на квартал вперёд устаревают раньше, чем до них дойдёт очередь).</p>
      <p class="small muted">Источники: Скрам-гайд 2020 — события и уточнение бэклога; Э. Готтесдинер, М. Горман, «Discover to Deliver» — двухтрековая работа аналитика (открытие и поставка).</p>`,
    refNote: 'Три амиго засчитываются и в спринте 1 (сразу после груминга), и в начале спринта 2.',
    report: ans => { const v = (ans && ans.v) || {}; return ACTS.map(x => `${x.t} → ${SLOT_SHORT[v[x.id]] || '—'} ${x.ok.includes(v[x.id]) ? '✓' : '✗'}`).join('\n'); }
  };

  // =====================================================================
  // Практика 5. Ответ Тимуру Рашидовичу
  // =====================================================================
  const T_RUBRIC = [
    'Полные требования к новой системе заранее неизвестны: «Искра» уточнит их, когда увидит работающее (пример — шиномонтаж, исключения Марины Олеговны)',
    'По ТЗ и водопаду работающее появится только в конце (февраль–март): ошибку в ТЗ найдём поздно и дорого, а 15 марта сдвинуть нельзя',
    'Итерации: демо каждые две недели, Тимур Рашидович сам решает, что важнее; к 15 марта гарантированно готово самое ценное — MVP',
    'Требования и документы никуда не исчезают: их пишут частями, перед каждым спринтом, и они всегда актуальны',
    'Что нужно от заказчика: прийти на демо, быстро принимать решения, назначить представителя (Марина Олеговна)',
    'Контроль у заказчика: прогресс и деньги видны каждые две недели; ТЗ уместно там, где объём стабилен (например, интеграция с кассой по 54-ФЗ)'
  ];
  const T_REF = 'Тимур Рашидович, ТЗ на всё сразу кажется надёжным, но в новом проекте оно надёжно только на бумаге. Мы ещё не знаем всех ваших правил: на кик-оффе не прозвучали шиномонтаж и половина исключений, о которых знает Марина Олеговна. По водопаду вы подпишете ТЗ в декабре и увидите работающую программу в конце февраля — если в ТЗ ошибка, мы найдём её за три недели до 15 марта, а сезон не сдвинешь. Мы предлагаем по-другому: каждые две недели показываем вам работающий кусок — отмену записи, напоминания, оплату. Вы сами решаете, что важнее, и к 15 марта гарантированно готово самое ценное для сезона, а не 80 % всего. Документы при этом есть: требования мы пишем к каждой задаче перед спринтом, и они всегда отражают то, что вы решили. Там, где правила жёсткие и не меняются, — например, чеки по 54-ФЗ, — описываем всё заранее и подробно. От вас нужно немного: час раз в две недели на демо и человек, который быстро отвечает на вопросы, — Марина Олеговна. Зато контроль у вас: каждые две недели видно, что сделано и куда идут деньги.';
  const timurTask = {
    id: 'timur', title: 'Ответ Тимуру Рашидовичу: «Почему не сделать всё по ТЗ сразу?»',
    simple: howModels.simple,
    lead: ui.brief({
      situation: 'Вечером Тимур Рашидович звонит Артёму, и тот включает громкую связь: «Я плачу за программу, а не за встречи. Напишите нормальное ТЗ, я подпишу, вы сделаете, я приму. Почему не так?» Артём кивает вам: «Ответь ты — ты будешь писать требования».',
      todo: [
        'Ответьте своими словами: 6–10 предложений, от 300 символов. Тимур Рашидович думает деньгами и сроками — говорите о них.',
        'Опирайтесь на сегодняшнее: ленту проекта в двух вариантах, запрос на шиномонтаж, ритм спринтов, что нужно от заказчика.',
        'Нажмите «Проверить с Верой (Claude)» или «Сверить с эталоном самому» и отметьте пункты, которые у вас прозвучали. Затем «Проверить». Засчитывается от 60 %.'
      ],
      look: 'Не спорьте с желанием Тимура Рашидовича контролировать проект — покажите, что демо раз в две недели дают ему больше контроля, чем подпись на ТЗ. И честно скажите, что потребуется от него.'
    }),
    blank: () => ({ j: {} }),
    reference: () => ({ j: { text: T_REF, self: T_RUBRIC.map(() => true) } }),
    render(el, ctx) {
      el.classList.add('mpr-root');
      const a = ctx.ans; a.j = a.j || {};
      el.innerHTML = ui.say('timur', 'Я плачу за программу, а не за встречи. Напишите нормальное ТЗ, я подпишу, вы сделаете, я приму. Почему не так?') + ui.say('artem', 'Ответь ты — ты будешь писать требования. Коротко и по делу.') + '<div style="margin-top:12px"></div>';
      const j = document.createElement('div'); el.appendChild(j);
      ui.justify(j, {
        id: 'mpr-timur', q: 'Ответ Тимуру Рашидовичу: почему «Искру Онлайн» не делают водопадом по ТЗ?', placeholder: 'Тимур Рашидович, …',
        qPlain: 'Владелец сети автосервисов «Искра» просит сделать приложение и систему записи по классической схеме: подробное ТЗ, подпись, разработка, приёмка. Срок MVP — 15 марта, с апреля сезон с ростом нагрузки в 3–4 раза. Объясните ему на его языке (деньги, сроки, контроль), почему команда предлагает итерации (Scrum, демо каждые две недели), что останется от документации и что нужно от него.',
        rubric: T_RUBRIC, reference: T_REF, value: a.j, readonly: ctx.readonly, minLen: 300,
        onChange: v => { a.j = v; ctx.save(); ctx.decide('Ответ Тимуру Рашидовичу про ТЗ и итерации', v.text || ''); }
      });
    },
    check(ans) {
      const j = (ans && ans.j) || {}, s = ui.justifyScore(j), t = (j.text || '').trim(), notes = [];
      if (t.length < 300) notes.push({ ok: false, html: `Ответ короче 300 символов (${t.length}). Тимура Рашидовича убедят даты и деньги, а не термины.` });
      if (!(j.ai || j.self)) notes.push({ ok: false, html: 'Проверьте ответ: «Проверить с Верой» или «Сверить с эталоном самому» — и отметьте пункты, которые у вас есть.' });
      else if (s < 0.6) notes.push({ ok: false, html: 'Пока мало пунктов. Когда Тимур Рашидович увидит работающее при водопаде? Что будет, если в ТЗ ошибка? Что он получит к 15 марта при итерациях? Что останется от документов?' });
      else notes.push({ ok: true, html: `Ответ: ${Math.round(s * 100)} %.` });
      const n = TR.norm(t);
      if (t.length >= 300 && /scrum|agile|спринт|бэклог|инкремент/.test(n) && !/демо|показ|увидит|увидите/.test(n)) notes.push({ ok: 'warn', html: 'Много терминов, мало картинки для заказчика. Вместо «инкремент спринта» — «каждые две недели вы сами пощёлкаете отмену записи на стенде».' });
      return { ok: s >= 0.6 && t.length >= 300, score: s, notes };
    },
    explain: `<p>Главная мысль: <b>ТЗ на всё сразу даёт ощущение контроля, итерации — сам контроль</b>. В новом продукте требования неизбежно уточняются; вопрос только в том, узнаем мы об этом через две недели на демо или в конце февраля на приёмке.</p>
      <p>Сильный ответ не обесценивает документы и не обещает «гибкость бесплатно»: требования пишутся частями и остаются актуальными, а от заказчика нужны время на демо и быстрые решения. Там, где правила стабильны (54-ФЗ, интеграция с кассой), — подробное описание заранее.</p>
      <p class="small muted">Источники: Манифест гибкой разработки ПО; Скрам-гайд 2020 — обзор спринта и владелец продукта; К. Вигерс, Дж. Битти, «Разработка требований к программному обеспечению» — требования в гибких проектах; М. Кон, «Scrum: гибкая разработка ПО».</p>`,
    report: ans => `Ответ Тимуру Рашидовичу: ${(ans && ans.j && ans.j.text) || '—'}`
  };

  // =====================================================================
  TR.stage({
    id: ID,
    when: 'пятница, 6 ноября, 15:00 · «Орбита», выбираем, как работать',
    intro: [
      { who: 'artem', html: 'Коллеги, до MVP 15 марта — четыре месяца. Сегодня решаем, <b>как</b> мы работаем: спринты, доска, кто за что отвечает. Тимур Рашидович утром спросил, «будет ли нормальное ТЗ», — к вечеру нужен ответ.' },
      { who: 'gleb', html: 'Я за Scrum, двухнедельные спринты. Но давайте без сорокаминутных дейли, я это уже проходил.' },
      { who: 'liza', html: 'А я хочу понять, сколько задач мне будут сдавать одновременно. Тестировщик у нас один.' },
      { who: 'vera', html: 'Хороший день, чтобы разобраться в подходах по-настоящему. Водопад, V-модель, Scrum, Kanban — у каждого своё место. А ваша задача — понять, где в каждом из них аналитик и когда он должен успеть подготовить требования.' }
    ],
    facts: ['F-deadline', 'F-scope', 'F-goal'],
    glossary: [
      { term: 'Водопад (каскадная модель)', simple: 'Этапы по очереди: всё описали, всё спроектировали, всё сделали, всё проверили.', tech: 'Waterfall: последовательные фазы с согласованием на выходе каждой; фиксированный объём. Уместен при стабильных требованиях, госзаказе, жёсткой приёмке по ТЗ (ГОСТ 34.602).' },
      { term: 'V-модель', simple: 'Водопад, где каждому уровню требований сразу ставят в пару уровень проверки.', tech: 'Бизнес-требования ↔ приёмочное тестирование, системные ↔ системное, архитектура ↔ интеграционное, модули ↔ модульное. Применяется в регулируемых отраслях (IEC 62304, ISO 26262).' },
      { term: 'Agile (гибкая разработка)', simple: 'Делать продукт небольшими кусками, часто показывать и спокойно принимать изменения.', tech: 'Манифест гибкой разработки ПО (2001): 4 ценности и 12 принципов. Не метод, а система приоритетов; методы — Scrum, Kanban, XP и др.' },
      { term: 'Scrum', simple: 'Работа спринтами по 1–4 недели с планированием, ежедневной сверкой, демо и ретро.', tech: 'Фреймворк (Скрам-гайд 2020): ответственности — владелец продукта, Scrum-мастер, разработчики; 5 событий; 3 артефакта с обязательствами.' },
      { term: 'Спринт', simple: 'Отрезок фиксированной длины, за который команда делает работающий кусок продукта.', tech: 'Sprint — событие-контейнер до одного месяца; цель спринта не меняется в его ходе.' },
      { term: 'Бэклог продукта', simple: 'Упорядоченный список всего, что может понадобиться продукту.', tech: 'Product Backlog — артефакт Scrum, обязательство — цель продукта; порядок определяет владелец продукта, уточнение — постоянно.' },
      { term: 'Инкремент и Definition of Done', simple: 'Работающий результат спринта и общее для команды определение «сделано».', tech: 'Increment — артефакт Scrum; DoD — его обязательство: критерии качества, без которых работа не считается частью инкремента.' },
      { term: 'Kanban', simple: 'Доска с колонками и лимитом задач в каждой — работа идёт потоком.', tech: 'Kanban-метод (Д. Андерсон): визуализация, WIP-лимиты, управление потоком, явные правила, эволюционные улучшения.' },
      { term: 'WIP-лимит', simple: 'Сколько задач может быть в колонке одновременно.', tech: 'Work in progress limit — ограничение незавершённой работы; сокращает время цикла и делает узкие места видимыми.' },
      { term: 'Время цикла и время выполнения', simple: 'Сколько задачу делали — и сколько её ждал заказчик.', tech: 'Cycle time — от начала работы до готовности; lead time — от появления запроса до результата. Закон Литтла: время = незавершённая работа ÷ пропускная способность.' },
      { term: 'Scrumban и SAFe', simple: 'Смесь Scrum и Kanban; каркас для многих команд над одним продуктом.', tech: 'Scrumban — спринты и ретро + доска с WIP-лимитами. SAFe (Scaled Agile Framework) — масштабирование Agile на десятки команд: квартальное планирование, поезда релизов.' }
    ],
    outro: 'Решили: до 15 марта «Орбита» работает по Scrum с двухнедельными спринтами, первый спринт — 23 ноября. На доске спринта — WIP-лимит на тестирование, и если колонка Лизы заполнена, разработчики помогают ей, а не начинают новое. Вы теперь знаете, где аналитик в каждом подходе и почему он должен идти на спринт вперёд. Через десять дней — первый груминг: Глеб прочитает вашу постановку отмены записи и задаст свои пятнадцать вопросов.',
    tasks: [howModels, howScrum, howKanban, chooseTask, scrumTask, kanbanTask, flowTask, timurTask]
  });
})();
