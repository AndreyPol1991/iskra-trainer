/* Модуль 3, занятие 1: Пользовательский путь, CJM и user flow.
   Теория: персона и исследование (интервью, наблюдение, хорошие и плохие вопросы); карта пути клиента (CJM): этапы,
   строки, кривая эмоций, путь от боли к требованию; user flow: экраны, действия, решения, ветки ошибок, счастливый
   путь и крайние случаи; чем CJM отличается от user flow, BPMN и карты историй.
   Практика: утро на станции «Победы» — наблюдение и разговор с Еленой (открывает факты F-el-*); собрать CJM Елены
   и кривую эмоций; трассировка боль → возможность → требование → метрика; лаборатория «user flow записи на ТО» —
   недостающие ветки и прогон Лизы с последствиями; выбрать инструмент для задач и объяснить Артёму своими словами. */
'use strict';
(function () {
  const TR = window.TR, ui = TR.ui, esc = TR.esc;
  const ID = 'm3-cjm';

  if (!document.getElementById('mcj-css')) document.head.insertAdjacentHTML('beforeend', `<style id="mcj-css">
    .mcj-root, .mcj-root .stack > * { min-width: 0; }
    .mcj-root .seg button { white-space: normal; text-align: left; }
    .mcj-root .card.flat { display: block; }
    .mcj-persona { display: grid; grid-template-columns: minmax(0, 200px) minmax(0, 1fr); gap: 14px; border: 1px solid var(--border); border-radius: 14px; background: var(--surface); padding: 14px; }
    .mcj-persona .ph { display: grid; justify-items: center; gap: 6px; text-align: center; }
    .mcj-persona .av { width: 84px; height: 84px; border-radius: 50%; background: var(--accent-soft); color: var(--accent); display: grid; place-items: center; font: 700 34px/1 var(--f-brand); border: 2px solid color-mix(in srgb, var(--accent) 45%, var(--border)); }
    .mcj-persona .nm { font: 600 16px/1.3 var(--f-brand); }
    .mcj-persona .qt { font-style: italic; color: var(--text-2); font-size: 13.5px; }
    .mcj-pf { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
    .mcj-pf button { text-align: left; font: inherit; font-size: 13.5px; color: inherit; border: 1px solid var(--border); background: var(--surface-2); border-radius: 10px; padding: 8px 10px; cursor: pointer; min-width: 0; overflow-wrap: anywhere; display: grid; gap: 3px; }
    .mcj-pf button b { font: 600 10.5px/1.3 var(--f-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--text-muted); }
    .mcj-pf button[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); }
    .mcj-bad { border: 1px dashed var(--border-strong); border-radius: 12px; padding: 12px 14px; background: var(--surface-2); font-size: 14px; }
    .mcj-qs { display: grid; gap: 6px; }
    .mcj-opt { display: grid; grid-template-columns: 22px minmax(0, 1fr); gap: 8px; align-items: start; text-align: left; font: inherit; font-size: 14px; color: inherit; background: var(--surface-2); border: 1px solid var(--border); border-radius: 10px; padding: 8px 11px; cursor: pointer; min-width: 0; overflow-wrap: anywhere; }
    .mcj-opt .bx { width: 16px; height: 16px; margin-top: 2px; border-radius: 4px; border: 2px solid var(--border-strong); }
    .mcj-opt.rd .bx { border-radius: 50%; }
    .mcj-opt[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); }
    .mcj-opt[aria-pressed="true"] .bx { border-color: var(--accent); background: var(--accent); }
    .mcj-opt.ok { border-color: var(--ok); background: var(--ok-soft); } .mcj-opt.bad { border-color: var(--bad); background: var(--bad-soft); } .mcj-opt.warn { border-color: var(--warn); background: var(--warn-soft); }
    .mcj-opt:disabled { cursor: default; } .mcj-opt:disabled:not([aria-pressed="true"]) { opacity: .5; }
    .mcj-opt .tg { font: 600 10px/1.4 var(--f-mono); letter-spacing: .08em; color: var(--text-muted); text-transform: uppercase; margin-right: 6px; }
    .mcj-opt .why { display: block; margin-top: 4px; font-size: 13px; color: var(--text-2); }
    .mcj-budget { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; font-size: 13.5px; }
    .mcj-budget i { width: 22px; height: 10px; border-radius: 3px; background: var(--surface-3); border: 1px solid var(--border); display: inline-block; }
    .mcj-budget i.on { background: var(--accent); border-color: var(--accent); }
    .mcj-scroll { overflow-x: auto; max-width: 100%; border: 1px solid var(--border); border-radius: 12px; background: var(--surface); }
    .mcj-grid { display: grid; grid-template-columns: 112px repeat(var(--n, 5), minmax(128px, 1fr)); min-width: 760px; font-size: 12.5px; }
    .mcj-grid > div { border-right: 1px solid var(--border); border-bottom: 1px solid var(--border); padding: 6px; min-width: 0; display: grid; gap: 4px; align-content: start; overflow-wrap: anywhere; }
    .mcj-grid .hd { background: var(--surface-2); font: 600 12px/1.3 var(--f-brand); }
    .mcj-grid .hd small { display: block; font: 600 10px/1.3 var(--f-mono); color: var(--text-muted); letter-spacing: .06em; }
    .mcj-grid .rh { background: var(--surface-2); font: 600 11px/1.3 var(--f-mono); letter-spacing: .04em; text-transform: uppercase; color: var(--text-2); }
    .mcj-grid button.rh { font: 600 11px/1.3 var(--f-mono); text-align: left; cursor: pointer; border: 0; border-right: 1px solid var(--border); border-bottom: 1px solid var(--border); color: var(--text-2); }
    .mcj-grid button.rh[aria-pressed="true"] { background: var(--accent-soft); color: var(--accent); }
    .mcj-grid .on { background: color-mix(in srgb, var(--accent) 7%, transparent); }
    .mcj-st { border-radius: 6px; padding: 4px 6px; line-height: 1.35; border: 1px solid var(--border); }
    .mcj-st.act { background: var(--info-soft); } .mcj-st.touch { background: var(--violet-soft); } .mcj-st.feel { background: var(--warn-soft); }
    .mcj-st.pain { background: var(--bad-soft); } .mcj-st.opp { background: var(--ok-soft); }
    .mcj-st.ok { box-shadow: inset 3px 0 0 var(--ok); } .mcj-st.bad { box-shadow: inset 3px 0 0 var(--bad); } .mcj-st.warn { box-shadow: inset 3px 0 0 var(--warn); }
    .mcj-cards { display: grid; gap: 6px; }
    .mcj-card { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 190px) minmax(0, 150px); gap: 8px; align-items: center; border: 1px solid var(--border); border-radius: 10px; padding: 7px 10px; background: var(--surface); font-size: 13.5px; }
    .mcj-card select { width: 100%; min-width: 0; font-size: 13px; }
    .mcj-card.ok { border-color: var(--ok); } .mcj-card.bad { border-color: var(--bad); background: var(--bad-soft); } .mcj-card.warn { border-color: var(--warn); background: var(--warn-soft); }
    .mcj-card .why { grid-column: 1 / -1; font-size: 12.5px; color: var(--text-2); }
    .mcj-emo { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 6px; }
    .mcj-emo > div { display: grid; gap: 4px; justify-items: center; text-align: center; font-size: 12px; min-width: 0; }
    .mcj-emo .seg { flex-direction: column; width: 100%; }
    .mcj-emo .seg button { text-align: center; padding: 3px 4px; font-size: 15px; }
    .mcj-svg { overflow-x: auto; max-width: 100%; border: 1px solid var(--border); border-radius: 12px; background: var(--surface); padding: 6px; }
    .mcj-svg svg { display: block; width: 100%; height: auto; }
    .mcj-svg.wide svg { min-width: 600px; }
    .mcj-svg text { fill: var(--text); font: 12.5px var(--f-body); }
    .mcj-svg .lbl { fill: var(--text-muted); font: 600 10.5px var(--f-mono); }
    .mcj-svg .ax { stroke: var(--border-strong); stroke-width: 1; stroke-dasharray: 3 4; }
    .mcj-svg .crv { fill: none; stroke: var(--accent); stroke-width: 2.5; }
    .mcj-svg .dot { fill: var(--accent); }
    .mcj-svg .dot.low { fill: var(--bad); }
    .mcj-svg .n { fill: var(--surface-2); stroke: var(--border-strong); stroke-width: 1.4; }
    .mcj-svg .n.screen { fill: var(--info-soft); stroke: color-mix(in srgb, var(--info) 60%, var(--border)); }
    .mcj-svg .n.dec { fill: var(--warn-soft); stroke: color-mix(in srgb, var(--warn) 60%, var(--border)); }
    .mcj-svg .n.err { fill: var(--bad-soft); stroke: color-mix(in srgb, var(--bad) 60%, var(--border)); }
    .mcj-svg .n.end { fill: var(--ok-soft); stroke: color-mix(in srgb, var(--ok) 60%, var(--border)); }
    .mcj-svg .n.q { fill: var(--surface); stroke: var(--border-strong); stroke-dasharray: 5 4; }
    .mcj-svg .n.tok { stroke: var(--ok); stroke-width: 2.4; } .mcj-svg .n.tbad { stroke: var(--bad); stroke-width: 2.4; } .mcj-svg .n.twarn { stroke: var(--warn); stroke-width: 2.4; }
    .mcj-svg .n.sel { stroke: var(--accent); stroke-width: 3; }
    .mcj-svg .e { stroke: var(--text-2); stroke-width: 1.4; fill: none; }
    .mcj-svg .e.dash { stroke-dasharray: 5 4; }
    .mcj-svg .ah { fill: var(--text-2); }
    .mcj-svg .el { fill: var(--text-2); font: 600 11px var(--f-mono); }
    .mcj-svg g[data-n] { cursor: pointer; }
    .mcj-chain { display: grid; grid-template-columns: minmax(0, 1fr) 18px minmax(0, 1fr) 18px minmax(0, 1fr) 18px minmax(0, 1fr); gap: 6px; align-items: stretch; border: 1px solid var(--border); border-radius: 12px; padding: 10px; background: var(--surface); }
    .mcj-chain > .ar { display: grid; place-items: center; color: var(--text-muted); font-weight: 700; }
    .mcj-chain .bx { border-radius: 10px; padding: 8px 10px; font-size: 13.5px; min-width: 0; overflow-wrap: anywhere; display: grid; gap: 4px; align-content: start; border: 1px solid var(--border); background: var(--surface-2); }
    .mcj-chain .bx > b { font: 600 10.5px/1.3 var(--f-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--text-muted); }
    .mcj-chain .bx.pain { background: var(--bad-soft); }
    .mcj-chain .bx.ok { border-color: var(--ok); background: var(--ok-soft); } .mcj-chain .bx.bad { border-color: var(--bad); }
    .mcj-chain select { width: 100%; min-width: 0; font-size: 13px; }
    .mcj-chain .why { font-size: 12.5px; color: var(--text-2); }
    .mcj-steps { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; }
    .mcj-steps > div { border: 1px solid var(--border); border-radius: 12px; padding: 10px; background: var(--surface); font-size: 13.5px; min-width: 0; overflow-wrap: anywhere; opacity: .35; transition: opacity .2s; }
    .mcj-steps > div.on { opacity: 1; border-color: color-mix(in srgb, var(--accent) 45%, var(--border)); }
    .mcj-steps > div > b { display: block; font: 600 10.5px/1.3 var(--f-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--accent); margin-bottom: 4px; }
    .mcj-pts { display: grid; gap: 10px; }
    .mcj-pt { border: 1px solid var(--border); border-radius: 12px; background: var(--surface); padding: 10px 12px; display: grid; gap: 8px; min-width: 0; }
    .mcj-pt > header { display: flex; gap: 8px; align-items: baseline; flex-wrap: wrap; }
    .mcj-pt > header .k { font: 600 11px/1 var(--f-mono); color: var(--accent); letter-spacing: .08em; }
    .mcj-pt > header b { font: 600 15px/1.3 var(--f-brand); }
    .mcj-stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; }
    .mcj-stat { border: 1px solid var(--border); border-radius: 12px; padding: 8px 10px; background: var(--surface); display: grid; gap: 2px; }
    .mcj-stat .v { font: 700 20px/1.1 var(--f-mono); } .mcj-stat .k { font-size: 12px; color: var(--text-muted); }
    .mcj-stat.ok .v { color: var(--ok); } .mcj-stat.bad .v { color: var(--bad); }
    .mcj-runs { display: grid; gap: 8px; }
    .mcj-run { border: 1px solid var(--border); border-left: 4px solid var(--border-strong); border-radius: 10px; padding: 8px 12px; background: var(--surface); display: grid; gap: 4px; font-size: 13.5px; min-width: 0; }
    .mcj-run.good { border-left-color: var(--ok); } .mcj-run.bad { border-left-color: var(--bad); } .mcj-run.mid { border-left-color: var(--warn); }
    .mcj-run .hd { font-weight: 600; } .mcj-run .tx { color: var(--text-2); }
    .mcj-cmp { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
    .mcj-cmp > div { border: 1px solid var(--border); border-radius: 10px; padding: 8px 11px; background: var(--surface); font-size: 13.5px; min-width: 0; overflow-wrap: anywhere; }
    .mcj-cmp > div > b { display: block; font: 600 10.5px/1.3 var(--f-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 3px; }
    @media (max-width: 760px) {
      .mcj-persona { grid-template-columns: minmax(0, 1fr); }
      .mcj-pf, .mcj-cmp { grid-template-columns: minmax(0, 1fr); }
      .mcj-card { grid-template-columns: minmax(0, 1fr); }
      .mcj-chain { grid-template-columns: minmax(0, 1fr); } .mcj-chain > .ar { transform: rotate(90deg); height: 14px; }
      .mcj-steps { grid-template-columns: minmax(0, 1fr); }
      .mcj-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .mcj-emo { gap: 3px; } .mcj-emo > div { font-size: 11px; }
    }
  </style>`);

  // ---------- общие помощники ----------
  const talk = lines => `<div class="talk">${lines.map(x => ui.say(x.who, x.html)).join('')}</div>`;
  const anNote = html => `<div style="margin-top:12px">${ui.note('info', 'Позиция аналитика', html)}</div>`;
  const interview = (q, a) => ui.note('', 'Как об этом спрашивают на собеседовании', `<b>«${q}»</b><br>${a}`);
  const mark = s => s === 'ok' ? '✓' : s === 'warn' ? '≈' : '✗';
  const fShort = id => (TR.FACTS[id] && TR.FACTS[id].short) || id;
  let svgUid = 0;
  function wrapT(text, max) {
    const words = String(text || '').split(/\s+/), out = []; let cur = '';
    words.forEach(w => { if ((cur + ' ' + w).trim().length > max && cur) { out.push(cur); cur = w; } else cur = (cur + ' ' + w).trim(); });
    if (cur) out.push(cur);
    return out;
  }
  // мини-рисовалка схем user flow: узлы {id,x,y,w,h,k,t,cls}, рёбра {a,b,t,mode:'v'|'h'|'pts',pts,dash}
  function flowSVG(nodes, edges, W, H, opts) {
    const o = opts || {}, mid = 'mcjah' + (++svgUid), P = Object.fromEntries(nodes.map(n => [n.id, n]));
    const box = n => {
      const lines = wrapT(n.t, n.k === 'dec' ? Math.round(n.w / 8.2) : Math.round(n.w / 7.2)), lh = 14, y0 = n.y + n.h / 2 - (lines.length - 1) * lh / 2 + 4;
      const shape = n.k === 'dec'
        ? `<polygon class="n dec ${n.cls || ''}" points="${n.x + n.w / 2},${n.y} ${n.x + n.w},${n.y + n.h / 2} ${n.x + n.w / 2},${n.y + n.h} ${n.x},${n.y + n.h / 2}"/>`
        : `<rect class="n ${n.k} ${n.cls || ''}" x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="${n.k === 'end' ? n.h / 2 : 8}"/>`;
      return `<g ${o.click ? `data-n="${esc(n.id)}" role="button" tabindex="0" aria-label="${esc(n.t)}"` : ''}>${shape}${n.tag ? `<text class="lbl" x="${n.x + 6}" y="${n.y - 4}">${esc(n.tag)}</text>` : ''}<text text-anchor="middle">${lines.map((l, i) => `<tspan x="${n.x + n.w / 2}" y="${y0 + i * lh}">${esc(l)}</tspan>`).join('')}</text></g>`;
    };
    const edge = e => {
      const a = P[e.a], b = P[e.b]; if (!a || !b) return '';
      let pts;
      if (e.pts) pts = e.pts;
      else if (e.mode === 'h') pts = [[a.x + a.w, a.y + a.h / 2], [b.x, b.y + b.h / 2]];
      else pts = [[a.x + a.w / 2, a.y + a.h], [b.x + b.w / 2, b.y]];
      const lp = e.lp || (e.mode === 'h' ? [pts[0][0] + 6, pts[0][1] - 6] : [pts[0][0] + 6, pts[0][1] + 14]);
      return `<polyline class="e ${e.dash ? 'dash' : ''}" points="${pts.map(p => p.join(',')).join(' ')}" marker-end="url(#${mid})"/>${e.t ? `<text class="el" x="${lp[0]}" y="${lp[1]}">${esc(e.t)}</text>` : ''}`;
    };
    return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(o.label || 'Схема')}"><defs><marker id="${mid}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="ah" d="M0,0 L10,5 L0,10 z"/></marker></defs>${edges.map(edge).join('')}${nodes.map(box).join('')}</svg>`;
  }

  // =====================================================================
  // Теория 1. Персона и исследование: наблюдение, интервью, хорошие вопросы
  // =====================================================================
  const PERSONAS = [
    { v: 'demo', t: 'Сегмент из маркетинга', h: '<b>«Женщины 25–45 лет, доход средний, есть автомобиль, живут в Казани».</b>', note: { k: 'bad', h: 'Это целевая аудитория, а не персона. Под это описание попадают и Елена, и пенсионерка с «Нивой», и владелица трёх машин такси. Ни одного решения по интерфейсу отсюда не вывести: не видно ни цели, ни ситуации, ни боли.' } },
    { v: 'fake', t: 'Выдуманная «из головы»', h: '<b>«Елена, 34 года. Любит кофе на овсяном молоке и йогу, мечтает о Tesla, читает Telegram-каналы о саморазвитии».</b>', note: { k: 'bad', h: 'Живо, но придумано за столом и не про наш сервис. Что из этого влияет на запись на ТО? Ничего. Такая персона опасна: команда начинает спорить о вкусах выдуманного человека вместо фактов.' } },
    { v: 'work', t: 'Рабочая персона на фактах', h: '', note: { k: 'ok', h: 'Опирается на наблюдение и разговор, а не на фантазию. Каждая строка влияет на решения: «звонить некогда» → запись и согласование без звонков; «не верит „надо менять“» → фото и цена; «забывает» → напоминания. Нажмите на поля карточки.' } }
  ];
  const PFIELDS = [
    { id: 'goal', k: 'Цель', v: 'Обслужить машину, не теряя рабочий день и не переплачивая за лишнее.', h: 'Цель — то, ради чего человек вообще идёт в сервис. Её проверяют требования: «записаться за 2 минуты», «согласовать с телефона». Алан Купер разделял <b>цели</b> (зачем) и <b>задачи</b> (что нажать) — интерфейс меняет задачи, цели остаются.' },
    { id: 'ctx', k: 'Контекст', v: 'Менеджер в офисе, днём совещания, телефон на беззвучном. Машину сдаёт утром по дороге на работу, забирает вечером.', h: 'Контекст — где и когда человек пользуется сервисом. Отсюда — 38 % не берут трубку (F-idle): дело не в клиентах, а в их дне. Значит, согласование должно ждать ответа в приложении, а не требовать живого разговора.' },
    { id: 'pain', k: 'Боли', v: 'Дозвониться на запись; очередь на приёмке; не знает, что с машиной; «надо менять» по телефону звучит как развод.', h: 'Боли — то, что мешает достичь цели. Каждая боль должна иметь источник: наблюдение, цитату или число. Боль без источника — гипотеза, её надо проверить.' },
    { id: 'now', k: 'Как решает сейчас', v: 'Звонит сама 2–3 раза за визит; ставит напоминание в календарь, но забывает; просит мастера «прислать фото в мессенджер».', h: 'Обходные пути (workarounds) — золото для аналитика. «Прислать фото в мессенджер» — готовое требование: человек уже сам придумал, что ему нужно, но делает это неудобно и без следа в системе.' },
    { id: 'tech', k: 'Устройства и навыки', v: 'iPhone, пользуется такси и доставкой, оплачивает по СБП, push не отключает.', h: 'Отсюда ожидания: «как в такси» у Тимура Рашидовича — это и про Елену. Она сравнит приложение «Искры» не с другими автосервисами, а с лучшими приложениями в своём телефоне.' },
    { id: 'quote', k: 'Цитата', v: '«Покажите фото и цену — я сама решу».', h: 'Цитата — короткая настоящая фраза из разговора. Она лучше любых абзацев напоминает команде, о ком речь, и не даёт персоне превратиться в выдумку.' }
  ];
  const METHODS = [
    { v: 'int', t: 'Интервью', h: '<b>Что даёт:</b> истории, мотивы, слова клиента. <b>Ограничение:</b> люди плохо вспоминают и рассказывают «как должно быть». <b>У нас:</b> разговор с Еленой о прошлом визите — что было после того, как она отдала ключи.' },
    { v: 'obs', t: 'Наблюдение', h: '<b>Что даёт:</b> то, что люди делают на самом деле, включая то, что они считают нормой и не упомянут. <b>Ограничение:</b> долго, видно не всё. <b>У нас:</b> стойка приёмки 8:00–8:40 — засечь время оформления, посчитать очередь, увидеть, что мастер переписывает данные. Марина Олеговна про это в интервью не сказала: для неё это просто работа.' },
    { v: 'data', t: 'Данные и отчёты', h: '<b>Что даёт:</b> масштаб: сколько, как часто, где. <b>Ограничение:</b> не говорит «почему». <b>У нас:</b> отчёт АТС — 21 % звонков в пик теряется (F-calls); журнал записей — 17 % неявок (F-noshow).' },
    { v: 'srv', t: 'Опрос', h: '<b>Что даёт:</b> проверку гипотезы на многих людях. <b>Ограничение:</b> отвечают на ваши вопросы, а не рассказывают о своих. Хорош после интервью, когда уже знаете, что спрашивать: «Сколько раз за визит вы звонили на станцию?»' }
  ];
  const QDEMO = [
    { id: 'q1', t: '«Вам было бы удобно записываться через приложение?»', k: 'bad', who: 'elena', a: 'Ну… да, наверное. Если удобное.', h: 'Гипотетический и наводящий вопрос. «Да» ничего не стоит: человек вежлив и не знает, как поступит. Решение, принятое на таком ответе, — ставка вслепую.' },
    { id: 'q2', t: '«Расскажите про прошлый визит — с момента, когда решили, что пора на ТО»', k: 'ok', who: 'elena', a: 'Пробег уже был пятнадцать тысяч, я месяц откладывала. Потом в обед звонила — не дозвонилась, вечером записали на вторник на восемь…', h: 'Вопрос о прошлом опыте, открытый, без подсказки ответа. Человек рассказывает историю — в ней этапы, точки контакта и боли, которые вы сами бы не придумали.' },
    { id: 'q3', t: '«Сколько раз вы звонили на станцию за тот визит?»', k: 'ok', who: 'elena', a: 'Раза три. Утром — уточнить, к какому окну. Днём — готово ли. Вечером — что так долго.', h: 'Уточняющий вопрос о конкретном факте. Число из такого ответа можно положить в метрику: «звонков „готово?“ за визит — с трёх до нуля».' },
    { id: 'q4', t: '«Какую кнопку сделать на главном экране?»', k: 'bad', who: 'elena', a: 'Не знаю… большую? Зелёную?', h: 'Вопрос о решении. Клиент не дизайнер и не обязан знать, как устроить экран. Спрашивайте о цели и проблеме, решение — работа Ники и команды.' }
  ];
  const howPersona = {
    id: 'how-persona', covers: ['t-observe'], title: 'Как это работает: персона и исследование пользователя', free: true, noReset: true,
    simple: {
      icon: '🧑',
      plain: 'Персона — портрет одного типичного пользователя, собранный из реальных наблюдений и разговоров: что он хочет, в какой ситуации, что ему мешает и как он выкручивается сейчас. Это не «целевая аудитория» из маркетинга и не фантазия, а договорённость команды, для кого мы делаем продукт.',
      analogy: 'Вы выбираете подарок маме. «Женщина 60 лет» ничего не подскажет. А «вечером читает, жалуется, что лампа слепит, а очки всё время теряет» — сразу подсказывает, что ей нужно. Персона — это такое «знаю, как она живёт», только про пользователя сервиса.',
      tech: 'Персоны предложил Алан Купер («Психбольница в руках пациентов», 1999): цели, контекст, поведение вместо демографии. Исследование — интервью о прошлом опыте, контекстное наблюдение (contextual inquiry, Бейер и Хольцблатт), анализ данных, опросы. Принципы вопросов — Роб Фитцпатрик, «Спросите маму»: о прошлом, а не о будущем; о фактах, а не о мнениях; о проблеме, а не о решении.'
    },
    lead: ui.brief({
      situation: 'Понедельник вечером. Вера пишет: «Завтра в 8:00 едем на Победы — смотреть утро на приёмке и говорить с Еленой Смирновой, она сдаёт машину на ТО. Ника уже рисует экраны, но пока не знает, для кого. Давайте сначала поймём, что такое персона и как спрашивать, чтобы получать факты».',
      todo: [
        'Переключите три варианта персоны: сегмент, выдуманная, рабочая. Посмотрите, что из каждой можно вывести.',
        'У рабочей персоны нажмите на поля — узнаете, зачем каждое и какие требования из него вырастают.',
        'Переключите методы исследования и нажмите на четыре вопроса Елене — посмотрите, какой ответ даёт каждый.'
      ],
      look: 'Хорошее исследование отвечает на вопрос «что люди делают на самом деле». Мнения («было бы удобно») и решения («сделайте кнопку») — слабые данные; истории о прошлом и наблюдаемые числа — сильные.'
    }),
    render(el) {
      el.classList.add('mcj-root');
      const st = { p: 'work', f: 'goal', m: 'obs', q: '' };
      el.innerHTML = `<div class="stack">
        <div class="row"><span class="small dim">Персона:</span>${ui.seg('per', PERSONAS.map(p => ({ v: p.v, t: p.t })), st.p, 'accent')}</div>
        <div data-per></div>
        <div class="stack tight"><span class="eyebrow">Где берутся факты</span>${ui.seg('met', METHODS.map(m => ({ v: m.v, t: m.t })), st.m)}<div data-met></div></div>
        <div class="stack tight"><span class="eyebrow">Четыре вопроса Елене · нажмите на вопрос</span><div class="mcj-qs" data-qs></div><div data-qa></div></div>
        ${ui.note('warn', 'Типичные ошибки', '<ul class="checks"><li class="bad">Персона «за столом» — без единого разговора с пользователем.</li><li class="bad">Пять персон на всё подряд: команда не понимает, кто главный. Для MVP обычно хватает одной-двух основных.</li><li class="bad">Спрашивать «хотели бы вы…?» и считать «да» доказательством.</li><li class="bad">Слушать только заказчика: Тимур Рашидович знает бизнес, но клиентом «Искры» не является.</li></ul>')}
        ${interview('Как вы собираете требования у пользователей, а не у заказчика?', 'Назовите методы и их ограничения: интервью о прошлом опыте, наблюдение на месте, данные. Приведите пример вопроса без подсказки («расскажите про последний раз, когда…») и пример плохого («было бы вам удобно…?»). Сильный ответ: «Мнения проверяю фактами — числами из отчётов или наблюдением».')}
      </div>`;
      function drawP() {
        const p = PERSONAS.find(x => x.v === st.p);
        const body = st.p !== 'work' ? `<div class="mcj-bad">${p.h}</div>` : `<div class="mcj-persona"><div class="ph"><div class="av" aria-hidden="true">Е</div><div class="nm">Елена Смирнова, 34</div><div class="small dim">Kia Rio 2019 · пробег 61 000 км · клиентка «Искры» 3 года</div><div class="qt">«Покажите фото и цену — я сама решу»</div></div>
          <div class="stack tight"><div class="mcj-pf">${PFIELDS.map(f => `<button type="button" data-pf="${f.id}" aria-pressed="${st.f === f.id}"><b>${esc(f.k)}</b>${esc(f.v)}</button>`).join('')}</div>
          <div class="card flat small">${PFIELDS.find(f => f.id === st.f).h}</div></div></div>`;
        TR.$('[data-per]', el).innerHTML = body + `<div style="margin-top:10px">${ui.note(p.note.k, p.v === 'work' ? 'Что здесь хорошо' : 'Что не так', p.note.h)}</div>`;
      }
      const drawM = () => { TR.$('[data-met]', el).innerHTML = `<div class="card flat small">${METHODS.find(m => m.v === st.m).h}</div>`; };
      function drawQ() {
        TR.$('[data-qs]', el).innerHTML = QDEMO.map(q => `<button type="button" class="mcj-opt rd ${st.q === q.id ? (q.k === 'ok' ? 'ok' : 'bad') : ''}" data-q="${q.id}" aria-pressed="${st.q === q.id}"><span class="bx" aria-hidden="true"></span><span>${esc(q.t)}</span></button>`).join('');
        const q = QDEMO.find(x => x.id === st.q);
        TR.$('[data-qa]', el).innerHTML = q ? talk([{ who: 'me', html: esc(q.t.replace(/[«»]/g, '')) }, { who: q.who, html: esc(q.a) }]) + `<div style="margin-top:8px">${ui.note(q.k === 'ok' ? 'ok' : 'bad', q.k === 'ok' ? 'Сильный вопрос' : 'Слабый вопрос', q.h)}</div>` : '';
      }
      ui.onSeg(el, (n, v) => { if (n === 'per') { st.p = v; drawP(); } if (n === 'met') { st.m = v; drawM(); } });
      TR.on(el, 'click', '[data-pf]', (e, b) => { st.f = b.dataset.pf; drawP(); });
      TR.on(el, 'click', '[data-q]', (e, b) => { st.q = b.dataset.q; drawQ(); });
      drawP(); drawM(); drawQ();
      el.insertAdjacentHTML('beforeend', anNote('Аналитик не обязан быть исследователем, но обязан отличать факт от мнения. В требованиях ссылайтесь на источник: «наблюдение 15.12, стойка Победы: оформление 12–15 мин» весит больше, чем «клиентам неудобно».'));
    }
  };

  // =====================================================================
  // Теория 2. CJM: этапы, строки, кривая эмоций, от боли к требованию
  // =====================================================================
  const D_ST = ['Заболел зуб', 'Записаться', 'Прийти и ждать', 'Лечение', 'Оплата и после'];
  const D_ROWS = [
    { id: 'act', t: 'Действия', h: 'Что человек делает на этом этапе — глаголами, от его лица. Не «система отправляет», а «ищет, звонит, ждёт».', cells: ['Терпит, ищет клинику в картах', 'Звонит в регистратуру', 'Сидит в коридоре 30 минут', 'Лечит, слушает про «ещё два зуба»', 'Платит, получает рекомендации'] },
    { id: 'touch', t: 'Точки контакта', h: 'Где человек касается сервиса: сайт, звонок, стойка, SMS, приложение, сам врач. Каждая точка контакта — место, где опыт может сломаться.', cells: ['Отзывы, сайт', 'Телефон регистратуры', 'Администратор, коридор', 'Врач, кресло', 'Касса, бумажка с назначениями'] },
    { id: 'feel', t: 'Мысли и чувства', h: 'Что человек думает и чувствует — лучше его словами из интервью. Отсюда строится кривая эмоций.', cells: ['«Может, само пройдёт»', '«Опять занято…»', '«Я же записан на 10:00!»', '«Сколько это будет стоить?»', '«Фух, наконец-то»'] },
    { id: 'pain', t: 'Боли', h: 'Что мешает на этом этапе. У каждой боли — источник: наблюдение, цитата, число.', cells: ['Непонятно, кому доверять', 'Не дозвониться', 'Ожидание без объяснений', 'Цена неизвестна заранее', 'Забыл, что назначили'] },
    { id: 'opp', t: 'Возможности', h: 'Идеи, как убрать боль. Формулируют вопросом «Как мы могли бы…?» — это ещё не решение, а направление. Из них потом рождаются требования.', cells: ['Рейтинг врачей с отзывами', 'Онлайн-запись', 'SMS «врач задерживается на 20 мин»', 'План лечения с ценой до начала', 'Напоминание о повторном визите'] }
  ];
  const D_EMO = [-1, -2, -2, -1, 1];
  const CHAIN = [
    { k: 'Боль', h: '<b>Неявки 17 %</b> (F-noshow). Елена: «Я записалась за неделю — и забыла».' },
    { k: 'Возможность', h: '<b>«Как мы могли бы напомнить о визите и дать легко перенести?»</b> Направление, а не решение.' },
    { k: 'Требование', h: 'Push за 24 часа и за 2 часа до начала с кнопками «Приеду», «Перенести», «Отменить»; бесплатный перенос — не позднее чем за 3 часа (BR-3).' },
    { k: 'Метрика', h: 'Неявки <b>17 % → 8 %</b> к сезону (F-goal). Через месяц после запуска сравним — так поймём, сработало ли.' }
  ];
  function emoSVG(vals, names, opts) {
    const o = opts || {}, W = 600, H = 170, L = 40, R = 16, T = 18, B = 34, n = vals.length;
    const xs = i => L + (W - L - R) * (n === 1 ? 0.5 : i / (n - 1)), ys = v => T + (H - T - B) * (2 - v) / 4;
    const known = vals.map((v, i) => v == null ? null : [xs(i), ys(v)]);
    const pts = known.filter(Boolean), min = Math.min(...vals.filter(v => v != null));
    return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Кривая эмоций по этапам">
      ${[-2, -1, 0, 1, 2].map(v => `<line class="ax" x1="${L}" x2="${W - R}" y1="${ys(v)}" y2="${ys(v)}"/><text class="lbl" x="4" y="${ys(v) + 4}">${v > 0 ? '+' + v : v}</text>`).join('')}
      ${pts.length > 1 ? `<polyline class="crv" points="${pts.map(p => p.join(',')).join(' ')}"/>` : ''}
      ${known.map((p, i) => p ? `<circle class="dot ${vals[i] === min && min < 0 ? 'low' : ''}" cx="${p[0]}" cy="${p[1]}" r="6"/>` : '').join('')}
      ${names.map((s, i) => `<text class="lbl" text-anchor="middle" x="${xs(i)}" y="${H - 10}">${esc(wrapT(s, 16)[0])}</text>`).join('')}
      ${o.note ? `<text x="${W - R}" y="12" text-anchor="end" class="lbl">${esc(o.note)}</text>` : ''}
    </svg>`;
  }
  const howCjm = {
    id: 'how-cjm', covers: ['t-cjm'], title: 'Как это работает: карта пути клиента (CJM) и кривая эмоций', free: true, noReset: true,
    simple: {
      icon: '🗺️',
      plain: 'Карта пути клиента (CJM, Customer Journey Map) — таблица: по горизонтали этапы, через которые проходит человек, по вертикали — что он делает, где касается сервиса, что думает и чувствует, что ему мешает и как это можно исправить. Внизу часто рисуют кривую эмоций: где человеку хорошо, а где он готов уйти к конкурентам.',
      analogy: 'Вспомните поездку в отпуск: выбрали билеты, доехали до аэропорта, досмотр, перелёт, заселение. Если нарисовать настроение по шагам, провал окажется в очереди на досмотре и на ресепшене в 2 часа ночи. Карта пути показывает такие провалы, чтобы чинить именно их.',
      tech: 'CJM описывает опыт клиента целиком, на всех каналах, включая те, где нет нашей системы (Каплан, Nielsen Norman Group, «Journey Mapping 101»; Стикдорн и др., «This Is Service Design Doing»). Бывает «как есть» (as-is) — на фактах исследования — и «как будет» (to-be). Возможности формулируют вопросом «Как мы могли бы…?» (How Might We). Родственный артефакт — service blueprint: под картой клиента — «закулисье»: сотрудники и системы.'
    },
    lead: ui.brief({
      situation: 'Вера рисует на доске таблицу: «Прежде чем делать карту Елены, посмотрим на бытовой пример — поход к стоматологу. Все там были, все помнят, где было плохо».',
      todo: [
        'Нажмите на заголовки строк карты — узнаете, что пишут в каждой строке и откуда это берут.',
        'Посмотрите на кривую эмоций под картой: где провалы и почему именно там.',
        'Пройдите по шагам цепочку «боль → возможность → требование → метрика» на примере неявок «Искры».'
      ],
      look: 'Карта строится от клиента, а не от системы: этапы — это его шаги («записаться», «сдать машину»), а не наши модули. В карте есть и то, что происходит без приложения: звонки, очередь, ожидание.'
    }),
    render(el) {
      el.classList.add('mcj-root');
      const st = { r: 'act', s: 0 };
      el.innerHTML = `<div class="stack">
        <div class="stack tight"><span class="eyebrow">Карта «Поход к стоматологу» · нажмите на строку</span><div class="mcj-scroll"><div class="mcj-grid" data-g></div></div><div data-rh></div></div>
        <div class="stack tight"><span class="eyebrow">Кривая эмоций</span><div class="mcj-svg wide">${emoSVG(D_EMO, D_ST)}</div>
        <div class="small dim">Провалы — на «Записаться» и «Прийти и ждать»: там нет информации и человек ничего не контролирует. Именно туда стоит направить первые возможности. Чаще всего провал — не там, где «сложно», а там, где <b>неизвестно</b>.</div></div>
        <div class="stack tight"><span class="eyebrow">Как из боли рождается требование · пример «Искры»</span><div class="mcj-steps" data-ch></div>
          <div class="row"><button type="button" class="btn sm" data-chb="-1">← Назад</button><button type="button" class="btn sm primary" data-chb="1">Дальше →</button></div></div>
        <div class="mcj-cmp">
          <div><b>Карта «как есть» (as-is)</b>Только факты исследования: что сейчас происходит, где больно. Её показывают заказчику, чтобы договориться о проблемах.</div>
          <div><b>Карта «как будет» (to-be)</b>Тот же путь с новым сервисом: какие точки контакта появились, какие боли исчезли. Её сверяют с целями (F-goal).</div>
        </div>
        ${ui.note('warn', 'Типичные ошибки', '<ul class="checks"><li class="bad">Этапы — модули системы («Модуль записи», «Модуль оплаты») вместо шагов клиента.</li><li class="bad">Боли без источника: «клиенту, наверное, неудобно».</li><li class="bad">Решения в строке болей: «нет приложения» — это не боль, боль — «не дозвониться в обед».</li><li class="bad">Карта висит на стене и никуда не ведёт: возможности не превращаются в требования и метрики.</li></ul>')}
        ${interview('Что такое CJM и зачем она аналитику?', 'Карта пути клиента: этапы × строки (действия, точки контакта, мысли и эмоции, боли, возможности). Аналитику она нужна, чтобы требования вырастали из реальных болей и были связаны с целями бизнеса. Хорошо показать цепочку на примере: боль → возможность → требование → метрика, и упомянуть as-is / to-be.')}
      </div>`;
      function drawG() {
        const g = TR.$('[data-g]', el);
        g.innerHTML = `<div class="hd">Строка / этап</div>${D_ST.map((s, i) => `<div class="hd"><small>ЭТАП ${i + 1}</small>${esc(s)}</div>`).join('')}` +
          D_ROWS.map(r => `<button type="button" class="rh" data-r="${r.id}" aria-pressed="${st.r === r.id}">${esc(r.t)}</button>${r.cells.map(c => `<div class="${st.r === r.id ? 'on' : ''}"><div class="mcj-st ${r.id}">${esc(c)}</div></div>`).join('')}`).join('');
        TR.$('[data-rh]', el).innerHTML = `<div class="card flat small"><b>${esc(D_ROWS.find(r => r.id === st.r).t)}.</b> ${D_ROWS.find(r => r.id === st.r).h}</div>`;
      }
      function drawCh() { TR.$('[data-ch]', el).innerHTML = CHAIN.map((c, i) => `<div class="${i <= st.s ? 'on' : ''}"><b>${i + 1}. ${esc(c.k)}</b>${c.h}</div>`).join(''); }
      TR.on(el, 'click', '[data-r]', (e, b) => { st.r = b.dataset.r; drawG(); });
      TR.on(el, 'click', '[data-chb]', (e, b) => { st.s = Math.max(0, Math.min(CHAIN.length - 1, st.s + Number(b.dataset.chb))); drawCh(); });
      drawG(); drawCh();
      el.insertAdjacentHTML('beforeend', anNote('Карту обычно ведёт дизайнер или исследователь, но аналитику она нужна больше всех: это мост от «клиенту плохо» к проверяемому требованию с номером правила и числом. Если требование нельзя связать ни с одной болью или целью — спросите, зачем оно в MVP.'));
    }
  };

  // =====================================================================
  // Теория 3. User flow; счастливый путь и крайние случаи; CJM vs flow vs BPMN vs story map
  // =====================================================================
  const RF_NODES = (withBr) => {
    const n = [
      { id: 'a', x: 20, y: 14, w: 170, h: 44, k: 'screen', t: 'Экран «Мои записи»', tag: 'ЭКРАН' },
      { id: 'b', x: 20, y: 86, w: 170, h: 44, k: 'screen', t: 'Карточка записи: «Перенести»' },
      { id: 'c', x: 30, y: 156, w: 150, h: 70, k: 'dec', t: 'До начала ≥ 3 часов?', tag: 'РЕШЕНИЕ' },
      { id: 'd', x: 20, y: 252, w: 170, h: 44, k: 'screen', t: 'Выбор нового времени' },
      { id: 'e', x: 30, y: 322, w: 150, h: 70, k: 'dec', t: 'Слот ещё свободен?' },
      { id: 'f', x: 20, y: 418, w: 170, h: 44, k: 'end', t: 'Запись перенесена, push', tag: 'УСПЕХ' }
    ];
    if (withBr) n.push(
      { id: 'g', x: 260, y: 168, w: 230, h: 46, k: 'err', t: 'Бесплатный перенос недоступен (BR-3): «Позвонить на станцию»', tag: 'ВЕТКА' },
      { id: 'h', x: 260, y: 334, w: 230, h: 46, k: 'err', t: '«Это время только что заняли» → назад к выбору' }
    );
    return n;
  };
  const RF_EDGES = (withBr) => {
    const e = [{ a: 'a', b: 'b', t: 'нажала на запись' }, { a: 'b', b: 'c' }, { a: 'c', b: 'd', t: 'да' }, { a: 'd', b: 'e', t: 'выбрала 15:00' }, { a: 'e', b: 'f', t: 'да' }];
    if (withBr) e.push({ a: 'c', b: 'g', mode: 'h', t: 'нет' }, { a: 'e', b: 'h', mode: 'h', t: 'нет' }, { a: 'h', b: 'd', pts: [[375, 334], [375, 274], [190, 274]], dash: true });
    return e;
  };
  const RF_INFO = {
    a: 'Экран — прямоугольник. Подписывают так, как его назовут в макете: «Мои записи», а не «экран 3».',
    b: 'Действие пользователя — подпись на стрелке («нажала на запись») или кнопка на экране. Стрелка ведёт туда, куда попадёт человек.',
    c: 'Решение — ромб с вопросом, на который система отвечает «да» или «нет». У каждого ромба должны быть все выходы. Здесь — правило BR-3.',
    d: 'Экран выбора времени — тот же, что при записи. В user flow это видно сразу: компонент переиспользуется, Ника не рисует второй.',
    e: 'Решение, которое легко забыть: пока клиентка выбирала, слот мог занять другой. Это гонка (одновременная запись), и в интерфейсе для неё нужен свой экран.',
    f: 'Конец счастливого пути: цель достигнута. Хорошо указать, что ещё происходит: push, освобождённый старый слот.',
    g: 'Ветка ошибки по правилу: не тупик, а понятный выход — объяснение и звонок на станцию.',
    h: 'Возврат к выбору с сохранённым контекстом (станция, услуги) — пунктирная стрелка назад. Без неё клиент начинает всё сначала и злится.'
  };
  const TOOLS = [
    { v: 'cjm', t: 'CJM', h: { q: 'Что чувствует клиент на всём пути и где ему плохо?', who: 'Опыт одного типа клиента, все каналы — и без системы тоже', lvl: 'Этапы визита целиком: от «пора на ТО» до «забрала и оплатила»', reader: 'Заказчик, продакт, дизайнер, аналитик', ex: 'На этапе «Ремонт» Елена на совещании, ей звонят с незнакомого номера и говорят «надо менять колодки» — провал кривой эмоций.' } },
    { v: 'flow', t: 'User flow', h: { q: 'Через какие экраны и решения человек идёт к одной цели?', who: 'Один пользователь и интерфейс', lvl: 'Одна задача: «согласовать доп. работы» — экраны, кнопки, ветки ошибок', reader: 'Дизайнер, мобильный разработчик, тестировщик', ex: 'Push → экран предложения (фото, цена) → «Согласовать» / «Отказаться» / нет ответа; ветка «предложение уже истекло».' } },
    { v: 'bpmn', t: 'BPMN', h: { q: 'Кто что делает в процессе организации и в каком порядке?', who: 'Все участники: механик, мастер, клиент, система, 1С', lvl: 'Процесс: найдено → предложение → ответ или таймер 20 минут → звонок → решение', reader: 'Бизнес, аналитик, бэкенд, руководство', ex: 'Таймер 20 минут (BR-8) на граничном событии, дорожки «Механик» и «Мастер-приёмщик», автосогласование для «Шашки» (BR-9).' } },
    { v: 'map', t: 'Карта историй', h: { q: 'Что делаем в первую очередь и что войдёт в релиз?', who: 'Путь пользователя, разложенный на истории', lvl: 'Хребет — шаги пути, под ними истории, горизонтальные линии — релизы', reader: 'Команда, продакт, руководитель проекта', ex: 'Шаг «Согласовать доп. работы»: в MVP — фото и кнопки, позже — чат с мастером и история предложений.' } }
  ];
  const howFlow = {
    id: 'how-flow', covers: ['t-flow'], title: 'Как это работает: user flow, ветки и выбор инструмента', free: true, noReset: true,
    simple: {
      icon: '🔀',
      plain: 'User flow (пользовательский поток) — схема, по которой человек идёт через экраны к одной цели: что он видит, что нажимает, где система принимает решение и куда он попадёт, если что-то пошло не так. Самый частый путь называют счастливым (happy path), остальные — ветками и крайними случаями.',
      analogy: 'Банкомат. Счастливый путь: карта → PIN → сумма → деньги. Но кто-то проектировал и ветки: неверный PIN (три попытки, потом карта блокируется), в банкомате нет нужных купюр, нет связи с банком, клиент ушёл и не забрал карту. Без этих веток банкомат был бы опасен.',
      tech: 'User flow — артефакт проектирования интерфейса (NN/g: user flows vs journey maps). Он уже, чем CJM (одна задача, только наш интерфейс), и уже, чем BPMN 2.0 (OMG): BPMN описывает процесс организации со всеми участниками. Карта историй (Джефф Паттон, «Пользовательские карты историй») — для планирования релизов. Ветки ищут по чек-листу: вход, пустые данные, ошибки сети и сервера, бизнес-правила, одновременные действия, отмена.'
    },
    lead: ui.brief({
      situation: 'Ника показывает первый поток «Перенести запись»: четыре экрана подряд и стрелки. Глеб: «А если до записи час? А если время уже заняли?» Ника: «Ой». Вера: «Нормальное „ой“. Именно для этого аналитик и смотрит на поток».',
      todo: [
        'Переключите «Только счастливый путь» и «С ветками» — посмотрите, что появилось.',
        'Нажмите на элементы схемы — узнаете, как читать экраны, действия, решения и возвраты.',
        'Переключите четыре инструмента: CJM, user flow, BPMN, карта историй — на одном примере согласования доп. работ.'
      ],
      look: 'У каждого ромба должны быть все выходы, и ни одна ветка не должна заканчиваться тупиком: человек всегда понимает, что случилось и что делать дальше.'
    }),
    render(el) {
      el.classList.add('mcj-root');
      const st = { br: 'yes', n: 'c', t: 'flow' };
      el.innerHTML = `<div class="stack">
        <div class="row"><span class="small dim">Поток «Перенести запись»:</span>${ui.seg('fbr', [{ v: 'no', t: 'Только счастливый путь' }, { v: 'yes', t: 'С ветками' }], st.br, 'accent')}</div>
        <div class="mcj-svg wide" data-fs></div><div data-fi></div>
        <div class="small dim">Легенда: голубой прямоугольник — экран; ромб — решение системы; красный — ветка ошибки или правила; зелёный овал — успех; подпись на стрелке — действие пользователя; пунктир — возврат.</div>
        ${ui.note('', 'Где прячутся ветки — чек-лист', '<ul class="checks"><li class="info"><b>Вход:</b> человек не вошёл в аккаунт или сессия истекла.</li><li class="info"><b>Пустые данные:</b> нет слотов, нет записей, нет машины в гараже.</li><li class="info"><b>Сеть и сервер:</b> нет соединения, ошибка, долгий ответ.</li><li class="info"><b>Бизнес-правила:</b> BR-2 (не позже чем за 2 часа), BR-3 (перенос за 3 часа), BR-4 (2 неявки — предоплата).</li><li class="info"><b>Одновременность:</b> слот заняли, пока выбирали.</li><li class="info"><b>Отмена и назад:</b> что сохранится, если человек вернётся.</li></ul>')}
        <div class="stack tight"><span class="eyebrow">Один процесс — четыре взгляда · согласование доп. работ</span>${ui.seg('tool', TOOLS.map(t => ({ v: t.v, t: t.t })), st.t)}<div data-tl></div></div>
        ${interview('Чем CJM отличается от user flow и BPMN?', 'CJM — опыт клиента на всём пути, включая то, что вне системы, с эмоциями и болями. User flow — экраны и решения одной задачи в интерфейсе, со всеми ветками. BPMN — процесс организации: кто из участников что делает и как передаёт работу. Сильный ответ: «Они не заменяют друг друга: боли из CJM становятся требованиями, user flow проверяет интерфейс, BPMN — процесс за ним».')}
      </div>`;
      function drawF() {
        const yes = st.br === 'yes';
        const nodes = RF_NODES(yes).map(n => Object.assign({}, n, { cls: st.n === n.id ? 'sel' : '' }));
        TR.$('[data-fs]', el).innerHTML = flowSVG(nodes, RF_EDGES(yes), 510, 476, { click: true, label: 'User flow «Перенести запись»' });
        if (!yes && (st.n === 'g' || st.n === 'h')) st.n = 'c';
        TR.$('[data-fi]', el).innerHTML = `<div class="card flat small">${RF_INFO[st.n]}${!yes && (st.n === 'c' || st.n === 'e') ? ' <b>Сейчас у ромба только один выход — «да». Что будет при «нет»? Включите ветки.</b>' : ''}</div>`;
      }
      function drawT() {
        const t = TOOLS.find(x => x.v === st.t).h;
        TR.$('[data-tl]', el).innerHTML = `<div class="mcj-cmp"><div><b>Отвечает на вопрос</b>${esc(t.q)}</div><div><b>Чей взгляд</b>${esc(t.who)}</div><div><b>Уровень</b>${esc(t.lvl)}</div><div><b>Кто читает</b>${esc(t.reader)}</div><div style="grid-column:1/-1"><b>Как выглядит доп. работа здесь</b>${esc(t.ex)}</div></div>`;
      }
      ui.onSeg(el, (n, v) => { if (n === 'fbr') { st.br = v; drawF(); } if (n === 'tool') { st.t = v; drawT(); } });
      TR.on(el, 'click', '[data-n]', (e, g) => { st.n = g.dataset.n; drawF(); });
      drawF(); drawT();
      el.insertAdjacentHTML('beforeend', anNote('Аналитик часто не рисует user flow сам — его рисует дизайнер. Но именно аналитик приносит ветки: он знает правила BR-*, статусы и ошибки API. Хороший вопрос на ревью потока: «Покажите, что увидит человек, если здесь „нет“».'));
    }
  };

  // =====================================================================
  // Практика 1. Утро на станции: наблюдение и разговор с Еленой (открывает F-el-*)
  // =====================================================================
  const OBS = [
    { id: 'o1', kind: 'Наблюдение', t: 'Засечь время оформления одной машины у стойки и записать, что именно делает мастер', good: true, fact: 'F-el-queue', who: 'marina', a: 'Пятнадцать минут на человека, а половину я переписываю номер, VIN и телефон. Утром все приезжают к восьми.', why: 'Наблюдаемый факт с числом. Марина Олеговна в интервью этого не говорила — для неё это просто работа.' },
    { id: 'o2', kind: 'Наблюдение', t: 'Посчитать машины в очереди у стойки в 8:00, 8:20 и 8:40', good: true, who: 'vera', a: 'Записала: в 8:00 — семь машин, в 8:20 — пять, к 8:40 — две. Двое уехали, не дождавшись.', why: 'Даёт масштаб боли и ещё один факт: люди уезжают — это потерянные визиты.' },
    { id: 'o3', kind: 'Вопрос Елене', t: '«Расскажите про прошлый визит: что было после того, как вы отдали ключи?»', good: true, fact: 'F-el-status', who: 'elena', a: 'Сдала машину — и как в чёрную дыру. Звоню сама: готово? нет? Раза три за день.', why: 'Открытый вопрос о прошлом опыте. Боль «не вижу статус» и число «2–3 звонка» Елена назвала сама.' },
    { id: 'o4', kind: 'Вопрос Елене', t: '«Вспомните, как вам предлагали доп. работы в прошлый раз. Что вы сделали?»', good: true, fact: 'F-el-photo', who: 'elena', a: 'Когда звонят и говорят «надо менять колодки» — я не понимаю, правда или нет. Покажите фото и цену — я сама решу.', why: 'Конкретный случай из прошлого. Из ответа сразу видна потребность: фото и цена до согласия.' },
    { id: 'o5', kind: 'Вопрос Елене', t: '«Бывало, что вы пропускали запись? Как это вышло?»', good: true, fact: 'F-el-remind', who: 'elena', a: 'Я записалась за неделю — и забыла. Напомните за день и ещё утром, я же не нарочно.', why: 'Вопрос без осуждения, о реальном случае. Неявки 17 % получили объяснение: люди не злодеи, они забывают.' },
    { id: 'o6', kind: 'Вопрос Марине', t: '«Что из того, что вы спрашиваете у клиента на приёмке, у вас уже есть в базе?»', good: true, fact: 'F-el-queue', who: 'marina', a: 'Да почти всё: телефон, госномер, VIN у постоянных есть в 1С. Но искать дольше, чем переписать заново.', why: 'Вопрос о процессе, а не о мнении. Видна причина очереди: данные есть, но их неудобно найти.' },
    { id: 'o7', kind: 'Наблюдение', t: 'Час постоять у стойки днём и отметить, сколько раз звонят клиенты и о чём', good: true, fact: 'F-el-status', who: 'vera', a: 'За час — девять звонков, семь из них «моя машина готова?». Марина Олеговна каждый раз уходит в цех узнавать.', why: 'Наблюдение подтверждает слова Елены числом и показывает цену для станции: мастер отвлекается от приёмки.' },
    { id: 'o8', kind: 'Вопрос Елене', t: '«Вам было бы удобно записываться через приложение?»', good: false, who: 'elena', a: 'Ну… да, наверное. Если удобное.', why: 'Гипотетический наводящий вопрос. «Да» ничего не стоит и не говорит, что мешает сейчас.' },
    { id: 'o9', kind: 'Вопрос Елене', t: '«Какого цвета сделать кнопку записи?»', good: false, who: 'elena', a: 'Не знаю… зелёную? Мне без разницы, честно.', why: 'Вопрос о решении. Клиент не дизайнер; спросите о цели и проблеме.' },
    { id: 'o10', kind: 'Вопрос Марине', t: '«Клиенты ведь недовольны очередью, правда?»', good: false, who: 'marina', a: 'Да им всем всё не нравится. А что я сделаю, я одна на стойке.', why: 'Наводящий вопрос подсказывает ответ — и получает мнение с раздражением вместо фактов.' },
    { id: 'o11', kind: 'Вопрос Елене', t: '«Сколько бы вы заплатили за такое приложение?»', good: false, who: 'elena', a: 'За приложение автосервиса? Нисколько, наверное.', why: 'Гипотетический вопрос о будущем, к тому же не про её путь. Приложение бесплатное — время ушло зря.' },
    { id: 'o12', kind: 'Разговор', t: 'Вернуться в переговорную и записать, как Тимур Рашидович представляет путь клиента', good: false, who: 'timur', a: 'Да что тут представлять. Чтоб как в такси: нажал — приехал — уехал.', why: 'Это мнение владельца, а не наблюдение клиента. Ценно для целей бизнеса, но путь Елены так не узнать — тем более когда она стоит у стойки.' }
  ];
  const OBS_MAX = 6, EL_FACTS = ['F-el-status', 'F-el-photo', 'F-el-queue', 'F-el-remind'];
  function obsEval(ans) {
    const picks = ((ans && ans.p) || []).filter(id => OBS.some(o => o.id === id)).slice(0, OBS_MAX);
    const items = picks.map(id => OBS.find(o => o.id === id));
    const found = EL_FACTS.filter(f => items.some(o => o.fact === f));
    const bad = items.filter(o => !o.good).length;
    const score = Math.max(0, Math.min(1, found.length / 4 * 0.8 + (items.length ? Math.max(0, 0.2 - 0.1 * bad) : 0)));
    return { picks, items, found, bad, score };
  }
  const taskObserve = {
    id: 't-observe', title: 'Утро на станции: наблюдение и разговор с Еленой',
    simple: howPersona.simple,
    lead: ui.brief({
      situation: 'Вторник, 08:00, станция на Победы. У стойки приёмки — очередь. Вера: «У нас время до 8:40 — потом приезжает Елена Смирнова сдавать Kia Rio на ТО, и у неё десять минут до такси. Успеем шесть наблюдений или вопросов. Выбирайте те, что дадут факты, а не мнения».',
      todo: [
        'Выберите не больше шести наблюдений и вопросов. Ответ появляется сразу — новые факты попадают в блокнот.',
        'Ищите четыре факта пути клиента: статус ремонта, фото и цена, очередь на приёмке, напоминания.',
        'Нажмите «Проверить». Засчитывается, если найдены все четыре факта и слабых вопросов — не больше одного.'
      ],
      look: 'Сильные вопросы — о прошлом и конкретном случае («расскажите про прошлый раз…»), сильные наблюдения — с числом. Слабые — о будущем («было бы удобно?»), о решении («какого цвета кнопка?») и наводящие («правда ведь…?»).'
    }),
    blank: () => ({ p: [] }),
    reference: () => ({ p: ['o1', 'o3', 'o4', 'o5', 'o7', 'o2'] }),
    render(el, ctx) {
      el.classList.add('mcj-root');
      const a = ctx.ans, ro = ctx.readonly; a.p = a.p || [];
      const show = !!(ctx.result || ro);
      el.innerHTML = `<div class="stack"><div class="mcj-budget" data-bd></div><div class="mcj-qs" data-os></div>
        <div class="stack tight"><span class="eyebrow">Что вы узнали</span><div data-log></div></div></div>`;
      function draw() {
        const ev = obsEval(a);
        TR.$('[data-bd]', el).innerHTML = `<span class="small dim">Время до 8:40:</span>${Array.from({ length: OBS_MAX }, (_, i) => `<i class="${i < a.p.length ? 'on' : ''}"></i>`).join('')}<span class="small">${a.p.length} из ${OBS_MAX}</span><span class="small dim">· фактов пути клиента: ${ev.found.length} из 4</span>`;
        TR.$('[data-os]', el).innerHTML = OBS.map(o => {
          const on = a.p.includes(o.id), cls = show && on ? (o.good ? 'ok' : 'bad') : (ro && o.good ? 'ok' : '');
          const dis = ro || (!on && a.p.length >= OBS_MAX);
          return `<button type="button" class="mcj-opt ${cls}" data-o="${o.id}" aria-pressed="${on}" ${dis ? 'disabled' : ''}><span class="bx" aria-hidden="true"></span><span><span class="tg">${esc(o.kind)}</span>${esc(o.t)}${(show && on) || ro ? `<span class="why">${o.why}</span>` : ''}</span></button>`;
        }).join('');
        const shown = ro ? ev.items : a.p.map(id => OBS.find(o => o.id === id)).filter(Boolean);
        TR.$('[data-log]', el).innerHTML = shown.length ? talk(shown.map(o => ({ who: o.who, html: esc(o.a) + (o.fact ? ` <span class="chip ok" style="margin-left:4px">в блокнот: ${esc(fShort(o.fact))}</span>` : '') }))) : '<div class="small dim">Пока ничего. Выберите первое наблюдение или вопрос.</div>';
      }
      draw();
      if (ro) return;
      TR.on(el, 'click', '[data-o]', (e, b) => {
        const id = b.dataset.o, o = OBS.find(x => x.id === id);
        if (a.p.includes(id)) a.p = a.p.filter(x => x !== id);
        else if (a.p.length < OBS_MAX) {
          a.p.push(id);
          if (o.fact && ctx.facts && ctx.facts.unlock(o.fact, 'ask')) ui.toast(`В блокнот: ${esc(fShort(o.fact))}`, 'ok', 2400);
          ctx.decide && ctx.decide('Утро на станции: ' + o.kind, o.t);
        }
        ctx.save(); draw();
      });
    },
    check(ans) {
      const ev = obsEval(ans), notes = [];
      EL_FACTS.forEach(f => {
        const has = ev.found.includes(f), src = OBS.filter(o => o.fact === f).map(o => '«' + o.t.replace(/[«»]/g, '') + '»');
        notes.push(has ? { ok: true, html: `Найдено: <b>${esc(fShort(f))}</b>.` } : { ok: false, html: `Не найдено: <b>${esc(fShort(f))}</b>. Этот факт дал бы, например, ${esc(src[0])}.` });
      });
      ev.items.filter(o => !o.good).forEach(o => notes.push({ ok: ev.bad > 1 ? false : 'warn', html: `${esc(o.t)} — ${o.why}` }));
      if (ev.items.length && !ev.bad) notes.push({ ok: true, html: 'Ни одного слабого вопроса: только прошлый опыт, конкретные случаи и числа.' });
      return {
        ok: ev.found.length === 4 && ev.bad <= 1 && ev.score >= 0.8, score: ev.score, notes,
        summary: `Фактов пути клиента: ${ev.found.length} из 4; слабых вопросов: ${ev.bad}; использовано ${ev.items.length} из ${OBS_MAX}.`,
        mentor: ev.bad > 1 ? 'Мы приехали за фактами. «Было бы удобно?» и «какого цвета кнопка?» дают вежливые мнения. Спрашивайте о прошлом: «расскажите про последний раз, когда…».' : (ev.found.length < 4 ? 'Пройдите по пути Елены: запись, приезд и очередь, ремонт, доп. работы. На каком этапе вы ещё ничего не узнали?' : null)
      };
    },
    explain: `<p>Шесть «минут» — это настоящее ограничение полевого исследования: клиентка спешит, мастер работает. Поэтому важен выбор: <b>наблюдение с числом</b> (время оформления, очередь, звонки за час) и <b>вопросы о прошлом опыте</b> («расскажите про прошлый визит», «вспомните, как предлагали доп. работы»).</p>
      <ul class="checks">
        <li><b>Очередь 8:00–8:40, 12–15 минут, половина — переписывание</b> — увидели сами. В интервью Марина Олеговна об этом не говорила: привычное не замечают.</li>
        <li><b>Статус ремонта</b> — Елена звонит 2–3 раза; наблюдение у стойки подтвердило: 7 из 9 звонков за час — «готово?».</li>
        <li><b>Фото и цена</b> — потребность, которую клиентка сформулировала сама из реального случая.</li>
        <li><b>Напоминания</b> — у неявок 17 % появилась человеческая причина: забывают, а не обманывают.</li>
      </ul>
      <p>Слабые вопросы опасны не тем, что «тратят время», а тем, что дают ложную уверенность: «клиенты сказали, что приложение будет удобным». Источники: Роб Фитцпатрик, «Спросите маму»; Бейер и Хольцблатт, «Contextual Design»; BABOK v3, техники «Интервью» и «Наблюдение».</p>`,
    refNote: 'Засчитывается любой набор, который открывает все четыре факта: для очереди подходят и засечь время, и вопрос Марине о данных; для статуса — и вопрос Елене, и час у стойки.',
    report: ans => { const ev = obsEval(ans || {}); return ev.items.map(o => `- ${o.kind}: ${o.t} ${o.good ? '✓' : '✗'}${o.fact ? ' → ' + o.fact : ''}`).join('\n') || '- ничего не выбрано'; }
  };

  // =====================================================================
  // Практика 2. CJM Елены: карточки по этапам и строкам + кривая эмоций
  // =====================================================================
  const CJ_ST = [
    { id: 's1', t: 'Вспомнить и решить' }, { id: 's2', t: 'Записаться и дождаться' }, { id: 's3', t: 'Приехать и сдать машину' },
    { id: 's4', t: 'Ремонт и доп. работы' }, { id: 's5', t: 'Забрать и оплатить' }
  ];
  const CJ_ROWS = [{ id: 'act', t: 'Действия' }, { id: 'touch', t: 'Точки контакта' }, { id: 'feel', t: 'Мысли и чувства' }, { id: 'pain', t: 'Боли' }];
  const CARDS = [
    { id: 'c1', t: 'Видит пробег 15 000 км — пора на ТО, но месяц откладывает', s: 's1', r: 'act' },
    { id: 'c2', t: 'Наклейка с датой ТО на стекле, бортовой компьютер', s: 's1', r: 'touch' },
    { id: 'c3', t: '«Опять полдня терять…»', s: 's1', r: 'feel' },
    { id: 'c4', t: 'Звонит в обед, ждёт на линии, договаривается на вторник 8:00', s: 's2', r: 'act' },
    { id: 'c5', t: 'Телефон колл-центра', s: 's2', r: 'touch' },
    { id: 'c6', t: 'В часы пик теряется 21 % звонков — дозвонилась только со второго раза', s: 's2', r: 'pain', ra: ['act'], src: 'F-calls' },
    { id: 'c7', t: 'Записалась за неделю — и забыла; вспомнила случайно накануне', s: 's2', r: 'pain', sa: ['s1'], src: 'F-el-remind' },
    { id: 'c8', t: 'Стойка приёмки, мастер-приёмщик', s: 's3', r: 'touch' },
    { id: 'c9', t: 'Очередь в 8:00: оформление 12–15 минут, половина — переписать VIN и телефон', s: 's3', r: 'pain', src: 'F-el-queue' },
    { id: 'c10', t: 'Отдаёт ключи, подписывает заказ-наряд, уезжает на такси', s: 's3', r: 'act' },
    { id: 'c11', t: '«Опоздаю на работу. Зачем я опять всё диктую?»', s: 's3', r: 'feel' },
    { id: 'c12', t: 'Звонок мастера с незнакомого номера', s: 's4', r: 'touch' },
    { id: 'c13', t: '«Развод или правда? Хоть бы фото показали…»', s: 's4', r: 'feel' },
    { id: 'c14', t: 'Не знает, что с машиной, — звонит сама 2–3 раза', s: 's4', r: 'pain', ra: ['act'], src: 'F-el-status' },
    { id: 'c15', t: 'Доп. работы по телефону без фото и цены: на совещании не может ответить, машина стоит', s: 's4', r: 'pain', src: 'F-el-photo, F-idle' },
    { id: 'c16', t: 'Приезжает вечером, ждёт мастера, платит картой на кассе', s: 's5', r: 'act' },
    { id: 'c17', t: 'Касса станции, бумажный заказ-наряд и чек', s: 's5', r: 'touch' },
    { id: 'c18', t: '«Фух, готово. Но почему дороже, чем „от“ на сайте?»', s: 's5', r: 'feel' }
  ];
  const CJ_OPP = { s1: 'Напоминание о ТО по пробегу и дате', s2: 'Онлайн-запись 24/7; напоминания за сутки и за 2 часа', s3: 'Данные клиента и машины готовы до приезда', s4: 'Статус в приложении; доп. работы с фото и ценой', s5: 'Онлайн-оплата и электронный чек; цена «от» с пояснением' };
  const EMO_V = [{ v: '2', t: '😀' }, { v: '1', t: '🙂' }, { v: '0', t: '😐' }, { v: '-1', t: '🙁' }, { v: '-2', t: '😣' }];
  function cjEval(ans) {
    const c = (ans && ans.c) || {}, e = (ans && ans.e) || {};
    const cs = CARDS.map(k => {
      const v = c[k.id] || {}, sOk = v.s === k.s || (k.sa || []).includes(v.s), rOk = v.r === k.r || (k.ra || []).includes(v.r);
      const pts = (sOk ? 0.5 : 0) + (rOk ? 0.5 : 0);
      return { k, v, sOk, rOk, pts, s: !v.s && !v.r ? '' : pts === 1 ? 'ok' : pts === 0.5 ? 'warn' : 'bad' };
    });
    const num = id => e[id] == null || e[id] === '' ? null : Number(e[id]);
    const ev = CJ_ST.map(s => num(s.id)), all = ev.every(v => v != null);
    const rules = [
      { id: 'low', ok: all && ev[3] <= Math.min(...ev) && ev[3] < 0, t: 'Самая низкая точка — «Ремонт и доп. работы»: неизвестность, звонки с незнакомого номера, «надо менять» без фото.' },
      { id: 'queue', ok: all && ev[2] < 0, t: 'На приёмке эмоция ниже нуля: очередь и повторное диктование данных.' },
      { id: 'end', ok: all && ev[4] > ev[3], t: 'В конце кривая поднимается: машина готова — облегчение, даже если цена удивила.' }
    ];
    const cardsScore = cs.reduce((s, x) => s + x.pts, 0) / CARDS.length, curve = rules.filter(r => r.ok).length / rules.length;
    return { cs, ev, all, rules, cardsScore, curve, score: cardsScore * 0.75 + curve * 0.25 };
  }
  const taskCjm = {
    id: 't-cjm', title: 'Собрать CJM Елены и кривую эмоций',
    simple: howCjm.simple,
    lead: ui.brief({
      situation: 'Вернулись в «Орбиту». На столе — 18 стикеров из утра на станции и разговора с Еленой. Ника: «Разложите их, пожалуйста, по карте — я хочу видеть, на каком этапе у неё всё плохо, и туда рисовать в первую очередь».',
      todo: [
        'Для каждого стикера выберите этап пути и строку карты: действие, точка контакта, мысль или чувство, боль. Карта заполняется на глазах.',
        'Под картой поставьте эмоцию на каждом этапе — от 😣 до 😀. Кривая нарисуется сама.',
        'Нажмите «Проверить». Засчитывается от 80 %, если самая низкая точка кривой — там, где ей действительно хуже всего.'
      ],
      look: 'Точка контакта — где клиентка касается сервиса (телефон, стойка, касса). Боль — что мешает, с источником. Цитата в кавычках — мысль. Глагол от её лица — действие.'
    }),
    blank: () => ({ c: {}, e: {} }),
    reference: () => ({ c: Object.fromEntries(CARDS.map(k => [k.id, { s: k.s, r: k.r }])), e: { s1: '-1', s2: '-1', s3: '-1', s4: '-2', s5: '1' } }),
    render(el, ctx) {
      el.classList.add('mcj-root');
      const a = ctx.ans, ro = ctx.readonly; a.c = a.c || {}; a.e = a.e || {};
      const show = !!(ctx.result || ro);
      el.innerHTML = `<div class="stack">
        <div class="stack tight"><span class="eyebrow">Карта пути Елены · «как есть»</span><div class="mcj-scroll"><div class="mcj-grid" data-g></div></div></div>
        <div class="stack tight"><span class="eyebrow">Эмоция на каждом этапе</span><div class="mcj-emo" data-emo></div><div class="mcj-svg wide" data-crv></div></div>
        <div class="stack tight"><span class="eyebrow">Стикеры · этап и строка</span><div class="mcj-cards" data-cs></div></div></div>`;
      function grid() {
        const ev = cjEval(a);
        const cell = (s, r) => ev.cs.filter(x => (ro ? x.k.s : x.v.s) === s && (ro ? x.k.r : x.v.r) === r).map(x => `<div class="mcj-st ${r} ${show && !ro ? x.s : ''}">${esc(x.k.t)}</div>`).join('');
        TR.$('[data-g]', el).innerHTML = `<div class="hd">Строка / этап</div>${CJ_ST.map((s, i) => `<div class="hd"><small>ЭТАП ${i + 1}</small>${esc(s.t)}</div>`).join('')}` +
          CJ_ROWS.map(r => `<div class="rh">${esc(r.t)}</div>${CJ_ST.map(s => `<div>${cell(s.id, r.id)}</div>`).join('')}`).join('') +
          (show ? `<div class="rh">Возможности · подсказка Веры</div>${CJ_ST.map(s => `<div><div class="mcj-st opp">${esc(CJ_OPP[s.id])}</div></div>`).join('')}` : '');
      }
      function curve() {
        const ev = cjEval(ro ? taskCjm.reference() : a);
        TR.$('[data-crv]', el).innerHTML = emoSVG(ev.ev, CJ_ST.map(s => s.t), { note: ev.all ? '' : 'поставьте эмоции на всех этапах' });
      }
      function emo() {
        const e = ro ? taskCjm.reference().e : a.e;
        TR.$('[data-emo]', el).innerHTML = CJ_ST.map(s => `<div><span>${esc(s.t)}</span>${ro ? `<b style="font-size:20px">${(EMO_V.find(x => x.v === e[s.id]) || { t: '—' }).t}</b>` : ui.seg('emo-' + s.id, EMO_V, e[s.id] == null ? '' : e[s.id])}</div>`).join('');
      }
      function cards() {
        const ev = cjEval(a);
        TR.$('[data-cs]', el).innerHTML = CARDS.map((k, i) => {
          const x = ev.cs[i], v = ro ? { s: k.s, r: k.r } : x.v, cls = show && !ro ? x.s : '';
          const why = cls && cls !== 'ok' ? `<div class="why">${!x.sOk ? `Этап: это про «${esc(CJ_ST.find(s => s.id === k.s).t)}». ` : ''}${!x.rOk ? `Строка: ${k.r === 'pain' ? 'это боль — то, что мешает, у неё есть источник' + (k.src ? ' (' + esc(k.src) + ')' : '') : k.r === 'touch' ? 'это точка контакта — где клиентка касается сервиса' : k.r === 'feel' ? 'это мысль своими словами — строка «Мысли и чувства»' : 'это действие клиентки — глагол от её лица'}.` : ''}</div>` : '';
          return `<div class="mcj-card ${cls}"><div>${esc(k.t)}</div>
            <select data-cs="${k.id}" data-f="s" aria-label="Этап для стикера: ${esc(k.t)}" ${ro ? 'disabled' : ''}><option value="">Этап…</option>${CJ_ST.map(s => `<option value="${s.id}" ${v.s === s.id ? 'selected' : ''}>${esc(s.t)}</option>`).join('')}</select>
            <select data-cs="${k.id}" data-f="r" aria-label="Строка для стикера: ${esc(k.t)}" ${ro ? 'disabled' : ''}><option value="">Строка…</option>${CJ_ROWS.map(r => `<option value="${r.id}" ${v.r === r.id ? 'selected' : ''}>${esc(r.t)}</option>`).join('')}</select>${why}</div>`;
        }).join('');
      }
      grid(); emo(); curve(); cards();
      if (ro) return;
      el.addEventListener('change', e => {
        const s = e.target.closest('select[data-cs]'); if (!s) return;
        const id = s.dataset.cs; a.c[id] = Object.assign({}, a.c[id] || {}, { [s.dataset.f]: s.value }); ctx.save(); grid();
      });
      ui.onSeg(el, (n, v) => { if (n.startsWith('emo-')) { a.e[n.slice(4)] = v; ctx.save(); curve(); } });
    },
    check(ans) {
      const ev = cjEval(ans), notes = [];
      const wrongS = ev.cs.filter(x => !x.sOk), wrongR = ev.cs.filter(x => !x.rOk);
      if (!wrongS.length) notes.push({ ok: true, html: 'Все стикеры — на своих этапах пути.' });
      else notes.push({ ok: false, html: `Этап не тот или не выбран у ${wrongS.length} ${TR.plural(wrongS.length, 'стикера', 'стикеров', 'стикеров')}: ${wrongS.slice(0, 4).map(x => '«' + esc(x.k.t.slice(0, 48)) + '…»').join(', ')}. Спросите себя: когда это происходит — до звонка, на стойке, пока машина в цехе или вечером?` });
      if (!wrongR.length) notes.push({ ok: true, html: 'Строки верны: действия, точки контакта, мысли и боли не перепутаны.' });
      else {
        const pains = wrongR.filter(x => x.k.r === 'pain').length, touch = wrongR.filter(x => x.k.r === 'touch').length;
        notes.push({ ok: false, html: `Строка не та или не выбрана у ${wrongR.length} ${TR.plural(wrongR.length, 'стикера', 'стикеров', 'стикеров')}.${pains ? ' Боль — это не действие и не чувство, а то, что мешает, и у неё есть источник: число или наблюдение (F-calls, F-el-queue, F-el-status…).' : ''}${touch ? ' Точка контакта — существительное: телефон, стойка, касса, звонок мастера.' : ''}` });
      }
      if (!ev.all) notes.push({ ok: false, html: 'Кривая эмоций не закончена — поставьте эмоцию на всех пяти этапах.' });
      else ev.rules.forEach(r => notes.push({ ok: r.ok, html: r.ok ? r.t : 'Кривая: ' + r.t.charAt(0).toLowerCase() + r.t.slice(1) + ' Сейчас это не так.' }));
      const low = ev.rules[0].ok;
      return {
        ok: ev.score >= 0.8 && low, score: ev.score, notes,
        summary: `Стикеры: ${Math.round(ev.cardsScore * 100)} %; кривая: ${ev.rules.filter(r => r.ok).length} из 3 признаков.`,
        mentor: !low ? 'Где Елене хуже всего? Вспомните её слова: «как в чёрную дыру», «развод или правда». Именно там провал кривой — и туда Ника будет рисовать в первую очередь.' : (ev.score < 0.8 ? 'Проверьте строку по форме стикера: глагол от её лица — действие, существительное «где» — точка контакта, цитата — мысль, «мешает» с числом — боль.' : null)
      };
    },
    explain: `<p>Карта показывает то, чего не видно из макетов: <b>самая низкая точка — пока машина в цехе</b>. Елена ничего не контролирует, не знает статуса и получает звонок «надо менять» без доказательств. Второй провал — утро на приёмке: очередь и повторное диктование данных.</p>
      <ul class="checks">
        <li>Этапы — шаги клиентки, а не модули системы. «Записаться и дождаться» включает время до визита — там живёт боль «забыла».</li>
        <li>Боли — с источниками: 21 % звонков (F-calls), 12–15 минут (F-el-queue), 2–3 звонка (F-el-status), фото и цена (F-el-photo).</li>
        <li>Точки контакта — где опыт может сломаться: телефон, стойка, звонок с незнакомого номера, касса.</li>
        <li>Строка «Возможности» — мост к следующему заданию: каждая боль получит направление, требование и метрику.</li>
      </ul>
      <p>Частые ошибки: путать «звонит в колл-центр» (действие) и «телефон колл-центра» (точка контакта); писать в боли решения («нет приложения»); рисовать кривую «на глаз», не опираясь на цитаты. Источники: Nielsen Norman Group, «Journey Mapping 101»; Стикдорн, Хормесс, Лоуренс, Шнайдер, «This Is Service Design Doing».</p>`,
    refNote: 'Стикер «дозвонилась со второго раза» засчитывается и как действие; «звонит сама 2–3 раза» — тоже. «Забыла о записи» — и на первом этапе. Кривая засчитывается любая, где минимум — на «Ремонте», на приёмке ниже нуля, а в конце подъём.',
    report: ans => {
      const ev = cjEval(ans || {});
      return ev.cs.map(x => `- ${x.k.t}: ${(CJ_ST.find(s => s.id === x.v.s) || { t: '—' }).t} / ${(CJ_ROWS.find(r => r.id === x.v.r) || { t: '—' }).t} ${mark(x.s || 'bad')}`).join('\n') + `\n- Эмоции: ${ev.ev.map(v => v == null ? '—' : v).join(', ')}`;
    }
  };

  // =====================================================================
  // Практика 3. Трассировка: боль → возможность → требование → метрика
  // =====================================================================
  const PAINS = [
    { id: 'p1', t: 'Не дозвониться на запись: в часы пик теряется 21 % звонков', src: 'F-calls', o: 'o1', r: 'r1', m: 'm1' },
    { id: 'p2', t: 'Записалась за неделю — и забыла; неявки 17 %', src: 'F-el-remind, F-noshow', o: 'o2', r: 'r2', m: 'm2' },
    { id: 'p3', t: 'Очередь на приёмке: 12–15 минут, половина — переписывание данных', src: 'F-el-queue', o: 'o3', r: 'r3', m: 'm3' },
    { id: 'p4', t: 'Не знает, что с машиной, — звонит сама 2–3 раза за визит', src: 'F-el-status', o: 'o4', r: 'r4', m: 'm4' },
    { id: 'p5', t: '«Надо менять» по телефону без фото; машина 1 ч 40 мин ждёт ответа', src: 'F-el-photo, F-idle', o: 'o5', r: 'r5', m: 'm5' }
  ];
  const T_O = [
    { v: 'o1', t: 'Как мы могли бы дать записаться без звонка и в любое время?' },
    { v: 'o2', t: 'Как мы могли бы напомнить о визите и дать легко перенести?' },
    { v: 'o3', t: 'Как мы могли бы получить данные клиента и машины до приезда?' },
    { v: 'o4', t: 'Как мы могли бы показывать, что происходит с машиной, без звонков?' },
    { v: 'o5', t: 'Как мы могли бы дать клиенту решить про доп. работы самому, видя фото и цену?' },
    { v: 'o6', t: 'Как мы могли бы сделать приложение красивым, как у такси?', bad: 'Это не про боль, а про вкус. Красота не уберёт ни одну из пяти болей и не проверяется.' },
    { v: 'o7', t: 'Как мы могли бы штрафовать каждого за неявку?', bad: 'Противоречит BR-4: предоплата — только после 2 неявок подряд. Штраф всем отпугнёт 83 % честных клиентов, а Елена «не нарочно» забыла.' }
  ];
  const T_R = [
    { v: 'r1', t: 'Онлайн-запись в приложении и на сайте: свободные слоты по сетке 30 минут, не позже чем за 2 часа и не дальше 30 дней (BR-1, BR-2)' },
    { v: 'r2', t: 'Push за 24 часа и за 2 часа до начала с кнопками «Приеду», «Перенести», «Отменить»; бесплатный перенос — не позднее чем за 3 часа (BR-3)' },
    { v: 'r3', t: 'Для онлайн-записи АРМ мастера заранее показывает карточку клиента и машины (госномер, VIN, телефон) — мастер только сверяет' },
    { v: 'r4', t: 'Статус заказ-наряда в приложении; при смене статуса — push не позже 1 минуты; при «Готов» — push и SMS (BR-13)' },
    { v: 'r5', t: 'Предложение доп. работ в приложении: фото механика, описание и цена от мастера, «Согласовать» / «Отказаться»; нет ответа 20 минут — звонок мастера (BR-6 – BR-8)' },
    { v: 'r6', t: 'Приложение должно быть удобным и быстрым', bad: 'Не проверить: что значит «удобно» и «быстро»? Лиза не напишет по этому ни одного теста. Нужны число и условие.' },
    { v: 'r7', t: 'Сервер раз в 5 секунд опрашивает 1С и шлёт push через Firebase', bad: 'Это решение, а не требование к поведению, — и неверное: статусы ремонта живут не в 1С. Как доставлять push, решит Глеб; требование — «не позже 1 минуты».' },
    { v: 'r8', t: 'Механик звонит клиенту и называет цену доп. работ', bad: 'Нарушает BR-7: проблему фиксирует механик, цену и предложение формирует мастер-приёмщик. И это снова звонок — та самая боль.' }
  ];
  const T_M = [
    { v: 'm1', t: 'Потерянные обращения: 21 % → 5 % (F-goal)' },
    { v: 'm2', t: 'Неявки: 17 % → 8 % (F-goal)' },
    { v: 'm3', t: 'Оформление на приёмке по записи: 12–15 минут → до 5 минут' },
    { v: 'm4', t: 'Звонки клиента «готово?»: 2–3 за визит → не больше 1' },
    { v: 'm5', t: 'Простой на согласовании: 1 ч 40 мин → 20 минут (F-goal)' },
    { v: 'm6', t: 'Рейтинг приложения в магазине — 5 звёзд', bad: 'Метрика не связана с этой болью и почти не зависит от одной функции. Нужна метрика, которая сдвинется, если боль ушла.' }
  ];
  function trEval(ans) {
    const t = (ans && ans.t) || {};
    return PAINS.map(p => {
      const v = t[p.id] || {}, ok = { o: v.o === p.o, r: v.r === p.r, m: v.m === p.m };
      return { p, v, ok, pts: (ok.o + ok.r + ok.m) / 3 };
    });
  }
  const taskTrace = {
    id: 't-trace', title: 'Боль → возможность → требование → метрика',
    simple: {
      icon: '🧵',
      plain: 'Каждое требование должно вырастать из реальной боли и вести к измеримой цели. Цепочка из четырёх звеньев: что мешает клиенту (с источником), направление «Как мы могли бы…?», проверяемое требование с номером правила, число, по которому поймём, что помогло.',
      analogy: 'Врач: жалоба «болит голова по утрам» → гипотеза «давление» → назначение «таблетка утром, измерять дважды в день» → цель «давление ниже 130 через месяц». Без жалобы назначение — наугад, без цели — непонятно, помогло ли.',
      tech: 'Трассируемость требований (Вигерс, «Разработка требований», гл. 29; BABOK v3, «Трассировка требований»): каждое требование связано с источником и бизнес-целью. Возможности — «How Might We» из дизайн-мышления. Метрики — из бизнес-целей (F-goal).'
    },
    lead: ui.brief({
      situation: 'Артём заглядывает к доске с картой: «Красиво. А что из этого пойдёт в бэклог?» Вера: «Сейчас свяжем. Каждой боли — направление, требование и метрику. Требование без боли — лишнее, боль без требования — дыра».',
      todo: [
        'Для каждой из пяти болей выберите возможность («Как мы могли бы…?»), требование и метрику.',
        'Среди вариантов есть ловушки: красота без пользы, непроверяемое «удобно», решение вместо требования, нарушение правил BR-*.',
        'Нажмите «Проверить». Засчитывается от 80 %.'
      ],
      look: 'Хорошее требование можно проверить и назвать правило, на которое оно опирается. Хорошая метрика сдвинется, если боль действительно ушла.'
    }),
    blank: () => ({ t: {} }),
    reference: () => ({ t: Object.fromEntries(PAINS.map(p => [p.id, { o: p.o, r: p.r, m: p.m }])) }),
    render(el, ctx) {
      el.classList.add('mcj-root');
      const a = ctx.ans, ro = ctx.readonly; a.t = a.t || {};
      const show = !!(ctx.result || ro);
      const sel = (pid, f, list, cur, ph) => `<select data-tp="${pid}" data-f="${f}" aria-label="${ph}" ${ro ? 'disabled' : ''}><option value="">${ph}…</option>${list.map(o => `<option value="${o.v}" ${cur === o.v ? 'selected' : ''}>${esc(o.t)}</option>`).join('')}</select>`;
      function draw() {
        const ev = trEval(ro ? taskTrace.reference() : a);
        el.innerHTML = `<div class="stack">${ev.map(x => {
          const box = (f, k, list) => {
            const cls = show && x.v[f] ? (x.ok[f] ? 'ok' : 'bad') : '', it = list.find(o => o.v === x.v[f]);
            const why = show && x.v[f] && !x.ok[f] ? `<div class="why">${it && it.bad ? it.bad : 'Подходит к другой боли. Какую именно проблему это убирает?'}</div>` : '';
            return `<div class="bx ${cls}"><b>${k}</b>${sel(x.p.id, f, list, x.v[f], k)}${why}</div>`;
          };
          return `<div class="mcj-chain"><div class="bx pain"><b>Боль · ${esc(x.p.src)}</b>${esc(x.p.t)}</div><div class="ar" aria-hidden="true">→</div>${box('o', 'Возможность', T_O)}<div class="ar" aria-hidden="true">→</div>${box('r', 'Требование', T_R)}<div class="ar" aria-hidden="true">→</div>${box('m', 'Метрика', T_M)}</div>`;
        }).join('')}</div>`;
      }
      draw();
      if (ro) return;
      el.addEventListener('change', e => {
        const s = e.target.closest('select[data-tp]'); if (!s) return;
        a.t[s.dataset.tp] = Object.assign({}, a.t[s.dataset.tp] || {}, { [s.dataset.f]: s.value }); ctx.save();
      });
    },
    check(ans) {
      const ev = trEval(ans), notes = [], score = ev.reduce((s, x) => s + x.pts, 0) / PAINS.length;
      const used = ev.flatMap(x => ['o', 'r', 'm'].map(f => x.v[f]).filter(Boolean));
      const traps = [...T_O, ...T_R, ...T_M].filter(o => o.bad && used.includes(o.v));
      ev.forEach(x => {
        if (x.pts === 1) notes.push({ ok: true, html: `«${esc(x.p.t.slice(0, 60))}…» — цепочка цельная.` });
        else notes.push({ ok: x.pts >= 0.66 ? 'warn' : false, html: `«${esc(x.p.t.slice(0, 60))}…» — ${['o', 'r', 'm'].filter(f => !x.ok[f]).map(f => ({ o: 'возможность', r: 'требование', m: 'метрика' })[f]).join(', ')}: ${x.v.o || x.v.r || x.v.m ? 'не про эту боль' : 'не выбрано'}.` });
      });
      traps.forEach(o => notes.push({ ok: false, html: `Ловушка «${esc(o.t)}» — ${o.bad}` }));
      return {
        ok: score >= 0.8 && !traps.some(o => o.v === 'r7' || o.v === 'r8'), score, notes,
        summary: `Цельных цепочек: ${ev.filter(x => x.pts === 1).length} из ${PAINS.length}; ловушек: ${traps.length}.`,
        mentor: traps.length ? 'Требование описывает, что должно происходить для человека, и опирается на правила BR-*. «Удобно», «через Firebase» и «механик называет цену» — три разные ошибки: непроверяемость, решение и нарушение BR-7.' : (score < 0.8 ? 'Идите от боли: что именно мешает? Какое направление это убирает? Как проверить требование? Какое число сдвинется?' : null)
      };
    },
    explain: `<p>Пять болей — пять цепочек, и у каждой звено отвечает на свой вопрос: <b>что мешает</b> (с источником), <b>куда смотреть</b> («Как мы могли бы…?»), <b>что сделать проверяемо</b> (с номером правила), <b>как поймём, что помогло</b> (число из целей).</p>
      <ul class="checks">
        <li>Метрики трёх цепочек взяты из целей Тимура Рашидовича (F-goal): 21 % → 5 %, 17 % → 8 %, 1 ч 40 мин → 20 минут. Значит, MVP по этим требованиям прямо работает на деньги заказчика.</li>
        <li>Две метрики — новые: «оформление до 5 минут» и «звонков „готово?“ не больше 1». Их надо согласовать с Мариной Олеговной и начать мерить до запуска — иначе не с чем будет сравнить.</li>
        <li>Ловушки — типовые: «удобно» не проверить; «через Firebase» — решение Глеба, а не требование; «механик называет цену» нарушает BR-7.</li>
      </ul>
      <p>Это и есть трассируемость: от требования можно дойти до боли и цели, а от цели — до требований, которые её закрывают. На защите MVP это главный аргумент: «каждая история в бэклоге закрывает измеримую боль». Источники: Вигерс, «Разработка требований», гл. 29 «Связи в цепочке требований»; BABOK v3, задача «Трассировка требований».</p>`,
    refNote: 'Засчитывается только точное соответствие: варианты нарочно разные по смыслу. Ловушки r7 и r8 (решение и нарушение BR-7) блокируют зачёт.',
    report: ans => trEval(ans || {}).map(x => `- ${x.p.t}: ${['o', 'r', 'm'].map(f => mark(x.ok[f] ? 'ok' : 'bad')).join(' ')}`).join('\n')
  };

  // =====================================================================
  // Практика 4. Лаборатория: user flow «Записаться на ТО» — недостающие ветки и прогон Лизы
  // =====================================================================
  const POINTS = [
    { id: 'd2', at: 'Выбор даты и времени', q: 'На выбранный день нет свободных слотов', opts: [
      { id: 'a', k: 'ok', s: '«Мест нет» + ближайшие даты и станции рядом', t: 'Показать «На этот день мест нет» и сразу ближайшие свободные даты на этой станции и свободное время на станциях рядом', why: 'Пустое состояние — не тупик: клиент видит выход в одно нажатие и остаётся в приложении.' },
      { id: 'b', k: 'bad', s: 'Пустая сетка без пояснений', t: 'Показать пустую сетку без пояснений — клиент сам догадается выбрать другой день', why: 'Пустая сетка выглядит как сбой: «приложение не работает». Человек закрывает его и звонит — или уходит к конкурентам.' },
      { id: 'c', k: 'warn', s: '«Позвоните нам» и номер колл-центра', t: 'Показать «Позвоните нам» и номер колл-центра', why: 'Не тупик, но возвращает к той самой боли — звонкам в пик, где теряется 21 %.' }
    ] },
    { id: 'd1', at: 'Подтверждение записи', q: 'Клиент не вошёл в аккаунт', opts: [
      { id: 'a', k: 'ok', s: 'Вход по SMS-коду → вернуть на подтверждение', t: 'Вход по номеру телефона и коду из SMS (с согласием на обработку персональных данных, BR-15), затем вернуть на подтверждение с сохранённым выбором', why: 'Ленивая авторизация: просим вход только когда он нужен и не теряем выбор станции, услуг и времени.' },
      { id: 'b', k: 'warn', s: 'Вход → на главную, выбрать заново', t: 'Вход по SMS-коду, после входа — на главный экран', why: 'Вход есть, но контекст потерян: клиент выбирает всё заново, часть людей на этом бросает запись.' },
      { id: 'c', k: 'bad', s: 'Записать без телефона и входа', t: 'Не проверять — записываем без телефона и аккаунта', why: 'Не будет напоминаний, не работает учёт неявок (BR-4), нет согласия на персональные данные (BR-15).' }
    ] },
    { id: 'd3', at: 'После входа', q: 'У клиента 2 неявки подряд (BR-4)', opts: [
      { id: 'a', k: 'ok', s: 'Шаг «Предоплата 500 ₽» → «Ждёт предоплаты»', t: 'Шаг «Предоплата 500 ₽» через ЮKassa с пояснением «засчитается в оплату»; запись в статусе «Ждёт предоплаты», после оплаты — «Подтверждена»', why: 'Точно по BR-4: предоплата только для тех, у кого две неявки подряд, и человек понимает, за что платит.' },
      { id: 'b', k: 'bad', s: 'Запретить онлайн-запись', t: 'Запретить онлайн-запись — пусть звонит', why: 'Противоречит BR-4: правило не запрещает запись, а требует предоплату. Клиент потерян или снова звонит.' },
      { id: 'c', k: 'bad', s: 'Записать как обычно', t: 'Записать как обычно — мастер разберётся на месте', why: 'Правило BR-4 не работает: третья неявка подряд, пост простаивает.' },
      { id: 'd', k: 'bad', s: 'Предоплата 500 ₽ для всех', t: 'Предоплата 500 ₽ для всех клиентов — так проще', why: 'Наказывает 83 % честных клиентов и не совпадает с BR-4. Конверсия записи упадёт.' }
    ] },
    { id: 'd5', at: 'Предоплата', q: 'Банк отклонил предоплату', opts: [
      { id: 'a', k: 'ok', s: '«Оплата не прошла» + повтор; слот держим 15 мин', t: '«Оплата не прошла» + повторить или выбрать другой способ (карта, СБП); слот держим 15 минут, потом освобождаем', why: 'Человек понимает, что случилось, может повторить, а слот не висит занятым вечно.' },
      { id: 'b', k: 'bad', s: 'Подтвердить без оплаты', t: 'Всё равно подтвердить запись — заплатит на станции', why: 'BR-4 обойдён: клиент с двумя неявками снова записан без предоплаты.' },
      { id: 'c', k: 'bad', s: 'Молча отменить запись', t: 'Молча отменить запись и вернуть на главный экран', why: 'Человек не понимает, записан он или нет; может приехать к закрытому посту — или уйти навсегда.' }
    ] },
    { id: 'd4', at: 'Нажал «Записаться»', q: 'Слот заняли, пока клиент подтверждал', opts: [
      { id: 'a', k: 'ok', s: '«Время только что заняли» → к выбору, выбор сохранён', t: '«Это время только что заняли» и вернуть к выбору времени, сохранив станцию и услуги', why: 'Гонку обрабатывает сервер (одна запись на пост и время), интерфейс честно объясняет и не заставляет начинать сначала.' },
      { id: 'b', k: 'bad', s: 'Записать обоих на один пост', t: 'Записать обоих — на станции разберутся', why: 'Две машины на один пост в одно время: кто-то ждёт часами, мастер извиняется, отзыв испорчен.' },
      { id: 'c', k: 'warn', s: '«Что-то пошло не так» → на главную', t: 'Показать «Что-то пошло не так» и вернуть на главный экран', why: 'Двойной записи нет, но человек не понимает, что случилось, и начинает всё заново — или бросает.' }
    ] }
  ];
  const CASES = [
    { id: 'k1', t: 'Алсу, новая клиентка: поставила приложение и сразу нажала «Записаться»', pts: ['d1'] },
    { id: 'k2', t: 'Суббота, на Победы всё занято до вечера', pts: ['d2'] },
    { id: 'k3', t: 'Игорь: две неявки подряд (client.no_show_count = 2)', pts: ['d3'] },
    { id: 'k4', t: 'Два клиента одновременно нажимают «Записаться» на 10:00, пост один', pts: ['d4'] },
    { id: 'k5', t: 'Игорь с двумя неявками, банк отклонил карту', pts: ['d3', 'd5'] },
    { id: 'k6', t: 'Елена: вошла, слоты есть, неявок нет — счастливый путь', pts: [] }
  ];
  const OUT = {
    'd2:b': { k: 'bad', t: 'Увидел пустую сетку, решил, что приложение сломалось, закрыл. Позвонил в пик — не дозвонился.', lost: 1 },
    'd2:c': { k: 'mid', t: 'Позвонил в колл-центр, со второго раза записался на воскресенье. Звонок, которого могло не быть.', calls: 1 },
    'd1:b': { k: 'mid', t: 'Вошла, оказалась на главной, выбрала станцию и время заново. Записалась, но с раздражением — и через 4 минуты вместо 2.', calls: 0 },
    'd1:c': { k: 'bad', t: 'Записалась без телефона: напоминания не ушли, неявку не учли, согласия на персональные данные нет (BR-15).', br: 1 },
    'd3:b': { k: 'bad', t: 'Увидел «Запись недоступна», позвонил на станцию ругаться. Правило BR-4 прочитано неверно — клиент потерян.', lost: 1, br: 1 },
    'd3:c': { k: 'bad', t: 'Записался как обычно и снова не приехал. Пост простоял 2 часа, третья неявка подряд.', br: 1, noshow: 1 },
    'd3:d': { k: 'bad', t: 'Предоплату увидели все: 3 из 10 честных клиентов бросили запись на этом шаге. Правило шире BR-4.', lost: 1, br: 1 },
    'd5:b': { k: 'bad', t: 'Записан без предоплаты — BR-4 обойдён. Через неделю — третья неявка.', br: 1, noshow: 1 },
    'd5:c': { k: 'bad', t: 'Не понял, записан ли. Приехал к 10:00 — записи нет, пост занят. Скандал у стойки.', lost: 1 },
    'd4:b': { k: 'bad', t: 'Обе машины записаны на пост 3 в 10:00. Вторая ждала полтора часа, Марина Олеговна извинялась.', conflict: 1 },
    'd4:c': { k: 'mid', t: 'Двойной записи нет, но второй клиент не понял, что произошло, и начал заново с главного экрана.', calls: 0 }
  };
  const GOOD_T = { k1: 'Вошла по SMS-коду и вернулась на подтверждение — записалась за 2 минуты.', k2: 'Увидел «мест нет» и воскресенье 10:00 на Победы — записался, не звоня.', k3: 'Оплатил 500 ₽ через СБП, запись «Подтверждена», приехал вовремя.', k4: 'Первый записан, второй увидел «время только что заняли» и выбрал 10:30.', k5: 'Карта отклонена — повторил через СБП за минуту, слот удержан.', k6: 'Записалась за 2 минуты, получила push за сутки и за 2 часа.' };
  const optOf = (ans, pid) => { const p = POINTS.find(x => x.id === pid), v = ans && ans.d && ans.d[pid]; return p.opts.find(o => o.id === v) || null; };
  function runCase(ans, c) {
    for (const pid of c.pts) {
      const o = optOf(ans, pid);
      if (!o) return { k: 'bad', t: `На схеме нет ветки «${POINTS.find(p => p.id === pid).q.toLowerCase()}» — разработчик сделал как понял: экран завис, клиент ушёл.`, lost: 1 };
      if (o.k !== 'ok') return Object.assign({ lost: 0, br: 0, conflict: 0, noshow: 0, calls: 0 }, OUT[pid + ':' + o.id]);
    }
    return { k: 'good', t: GOOD_T[c.id] };
  }
  function flEval(ans) {
    const pts = POINTS.map(p => { const o = optOf(ans, p.id); return { p, o, pts: !o ? 0 : o.k === 'ok' ? 1 : o.k === 'warn' ? 0.5 : 0 }; });
    const runs = CASES.map(c => ({ c, r: runCase(ans, c) }));
    const sum = k => runs.reduce((s, x) => s + (x.r[k] || 0), 0);
    return { pts, runs, score: pts.reduce((s, x) => s + x.pts, 0) / POINTS.length, good: runs.filter(x => x.r.k === 'good').length, lost: sum('lost'), br: sum('br'), conflict: sum('conflict') };
  }
  function flowFor(ans, show) {
    const X = 20, W = 190, DW = 160, DX = X + 15, BW = 290;
    const nodes = [
      { id: 'n1', x: X, y: 14, w: W, h: 40, k: 'screen', t: 'Главная: «Записаться на ТО»', tag: 'ЭКРАН' },
      { id: 'n2', x: X, y: 80, w: W, h: 40, k: 'screen', t: 'Станция и услуги' },
      { id: 'n3', x: X, y: 146, w: W, h: 40, k: 'screen', t: 'Дата и время' },
      { id: 'd2', x: DX, y: 210, w: DW, h: 62, k: 'dec', t: 'Есть свободные слоты?' },
      { id: 'n4', x: X, y: 298, w: W, h: 40, k: 'screen', t: 'Подтверждение записи' },
      { id: 'd1', x: DX, y: 362, w: DW, h: 62, k: 'dec', t: 'Клиент вошёл?' },
      { id: 'd3', x: DX, y: 450, w: DW, h: 62, k: 'dec', t: '2 неявки подряд?' },
      { id: 'd5', x: 375, y: 532, w: DW, h: 62, k: 'dec', t: 'Предоплата прошла?' },
      { id: 'd4', x: DX, y: 700, w: DW, h: 62, k: 'dec', t: 'Слот ещё свободен?' },
      { id: 'n5', x: X, y: 790, w: W, h: 40, k: 'end', t: 'Запись подтверждена, push', tag: 'УСПЕХ' }
    ];
    const BPOS = { d2: [300, 216], d1: [300, 368], d3: [310, 456], d5: [310, 616], d4: [300, 706] };
    const edges = [
      { a: 'n1', b: 'n2' }, { a: 'n2', b: 'n3' }, { a: 'n3', b: 'd2' }, { a: 'd2', b: 'n4', t: 'да' },
      { a: 'n4', b: 'd1', t: 'нажал «Записаться»' }, { a: 'd1', b: 'd3', t: 'да' }, { a: 'd3', b: 'd4', t: 'нет' },
      { a: 'bd3', b: 'd5' },
      { a: 'd5', b: 'd4', pts: [[375, 563], [262, 563], [262, 731], [195, 731]], t: 'да', lp: [300, 556] },
      { a: 'd4', b: 'n5', t: 'да' }
    ];
    POINTS.forEach(p => {
      const o = optOf(ans, p.id), pos = BPOS[p.id];
      const cls = show && o ? (o.k === 'ok' ? 'tok' : o.k === 'warn' ? 'twarn' : 'tbad') : '';
      nodes.push({ id: 'b' + p.id, x: pos[0], y: pos[1], w: BW, h: 50, k: o ? (o.k === 'ok' ? 'screen' : 'err') : 'q', cls, t: o ? o.s : '? ' + p.q });
      if (p.id === 'd5') edges.push({ a: 'd5', b: 'bd5', t: 'нет', dash: !o });
      else edges.push({ a: p.id, b: 'b' + p.id, mode: 'h', t: p.id === 'd3' ? 'да' : 'нет', dash: !o });
    });
    return flowSVG(nodes, edges, 620, 846, { label: 'User flow «Записаться на ТО»' });
  }
  const taskFlow = {
    id: 't-flow', title: 'Лаборатория: user flow «Записаться на ТО» и прогон Лизы',
    simple: howFlow.simple,
    lead: ui.brief({
      situation: 'Ника принесла поток записи на ТО: пять экранов подряд, от главной до «Запись подтверждена». Лиза: «Красиво. Только у меня шесть тестовых случаев, и для пяти из них на схеме ничего нет». Вера: «Дорисуйте ветки — а потом Лиза прогонит свои случаи по вашей схеме».',
      todo: [
        'На схеме пять ромбов-решений с пунктирной веткой «?». Для каждого выберите, что увидит клиент.',
        'Схема обновляется сразу. Опирайтесь на правила BR-2, BR-4, BR-15 и на боли из CJM.',
        'Нажмите «Проверить» — Лиза прогонит шесть случаев и покажет последствия. Засчитывается от 80 %, если ветка двух неявок (BR-4) верна и двойной записи нет.'
      ],
      look: 'Хорошая ветка — не тупик: человек понимает, что случилось, и видит выход. Правило BR-4 не запрещает запись, а добавляет шаг. Одновременную запись решает сервер, интерфейс — честно объясняет.'
    }),
    blank: () => ({ d: {} }),
    reference: () => ({ d: Object.fromEntries(POINTS.map(p => [p.id, 'a'])) }),
    render(el, ctx) {
      el.classList.add('mcj-root');
      const a = ctx.ans, ro = ctx.readonly; a.d = a.d || {};
      const show = !!(ctx.result || ro), src = ro ? taskFlow.reference() : a;
      el.innerHTML = `<div class="stack"><div class="mcj-svg wide" data-fl></div><div class="mcj-pts" data-pts></div><div data-run></div></div>`;
      const drawFlow = () => { TR.$('[data-fl]', el).innerHTML = flowFor(src, show); };
      function drawPts() {
        TR.$('[data-pts]', el).innerHTML = POINTS.map((p, i) => `<div class="mcj-pt"><header><span class="k">РОМБ ${i + 1} · ${esc(p.at)}</span><b>${esc(p.q)}</b></header><div class="mcj-qs">${p.opts.map(o => {
          const on = (src.d || {})[p.id] === o.id, cls = (show && on) || (ro && o.k === 'ok') ? (o.k === 'ok' ? 'ok' : o.k === 'warn' ? 'warn' : 'bad') : '';
          return `<button type="button" class="mcj-opt rd ${cls}" data-pt="${p.id}" data-o="${o.id}" aria-pressed="${on}" ${ro ? 'disabled' : ''}><span class="bx" aria-hidden="true"></span><span>${esc(o.t)}${show && on ? `<span class="why">${o.why}</span>` : ''}</span></button>`;
        }).join('')}</div></div>`).join('');
      }
      function drawRun() {
        const box = TR.$('[data-run]', el);
        if (!show) { box.innerHTML = '<div class="small dim">После проверки Лиза прогонит по вашей схеме шесть случаев и покажет, что случилось с каждым клиентом.</div>'; return; }
        const ev = flEval(src);
        box.innerHTML = `<div class="stack tight"><span class="eyebrow">Прогон Лизы · шесть случаев</span>
          <div class="mcj-stats"><div class="mcj-stat ${ev.good === 6 ? 'ok' : ''}"><span class="v">${ev.good} / 6</span><span class="k">записались без проблем</span></div>
          <div class="mcj-stat ${ev.lost ? 'bad' : 'ok'}"><span class="v">${ev.lost}</span><span class="k">клиентов потеряно</span></div>
          <div class="mcj-stat ${ev.br ? 'bad' : 'ok'}"><span class="v">${ev.br}</span><span class="k">нарушений правил BR</span></div>
          <div class="mcj-stat ${ev.conflict ? 'bad' : 'ok'}"><span class="v">${ev.conflict}</span><span class="k">двойных записей на пост</span></div></div>
          <div class="mcj-runs">${ev.runs.map(x => `<div class="mcj-run ${x.r.k}"><div class="hd">${esc(x.c.t)}</div><div class="tx">${esc(x.r.t)}</div></div>`).join('')}</div>
          ${ui.say('liza', ev.good === 6 ? 'Все шесть случаев проходят. Забираю схему в тест-кейсы — по ромбу на кейс, плюс граничные: ровно 2 часа до слота, ровно 2 неявки.' : `${6 - ev.good} из 6 случаев ломаются. Каждый такой — либо потерянная запись, либо нарушенное правило. В проде мы узнали бы об этом из отзывов.`)}</div>`;
      }
      drawFlow(); drawPts(); drawRun();
      if (ro) return;
      TR.on(el, 'click', '[data-pt][data-o]', (e, b) => {
        a.d[b.dataset.pt] = b.dataset.o; ctx.save();
        const p = POINTS.find(x => x.id === b.dataset.pt); ctx.decide && ctx.decide('User flow: ' + p.q, p.opts.find(o => o.id === b.dataset.o).t);
        drawFlow(); drawPts();
      });
    },
    check(ans) {
      const ev = flEval(ans), notes = [];
      ev.pts.forEach(x => {
        if (!x.o) notes.push({ ok: false, html: `«${esc(x.p.q)}» — ветка не нарисована.` });
        else notes.push({ ok: x.o.k === 'ok' ? true : x.o.k === 'warn' ? 'warn' : false, html: `«${esc(x.p.q)}» → ${esc(x.o.s)}. ${x.o.why}` });
      });
      notes.push({ ok: ev.good === 6, html: `Прогон Лизы: без проблем ${ev.good} из 6; потеряно клиентов — ${ev.lost}, нарушений правил — ${ev.br}, двойных записей — ${ev.conflict}.` });
      const d3 = optOf(ans, 'd3'), d4 = optOf(ans, 'd4');
      return {
        ok: ev.score >= 0.8 && !!d3 && d3.k === 'ok' && !(d4 && d4.k === 'bad'), score: ev.score, notes,
        summary: `Ветки: ${ev.pts.filter(x => x.o && x.o.k === 'ok').length} из ${POINTS.length} верно; прогон — ${ev.good} из 6 случаев без проблем.`,
        mentor: !d3 || d3.k !== 'ok' ? 'Перечитайте BR-4: после 2 неявок подряд онлайн-запись — <b>только с предоплатой 500 ₽</b>. Не запрет, не «как обычно» и не «для всех» — отдельный шаг для этих клиентов.' : (ev.score < 0.8 ? 'Проверьте каждую ветку вопросом Лизы: «Что человек видит и что он может сделать дальше?» Тупик, пустой экран и «что-то пошло не так» — не ответ.' : null)
      };
    },
    explain: `<p>Схема Ники была честным счастливым путём — и поэтому ломалась на пяти случаях из шести. Ветки — это не «украшение», а места, где теряются клиенты и нарушаются правила:</p>
      <ul class="checks">
        <li><b>Нет слотов</b> — пустое состояние с выходом: ближайшие даты и станции рядом. Иначе клиент звонит — и мы возвращаемся к 21 % потерянных звонков.</li>
        <li><b>Не вошёл</b> — ленивая авторизация по SMS-коду с согласием на персональные данные (BR-15) и возвратом на тот же шаг.</li>
        <li><b>2 неявки подряд</b> — шаг предоплаты 500 ₽ и статус «Ждёт предоплаты» (booking.status = new), как в BR-4. Это критично: правило — главный инструмент против неявок 17 % → 8 %.</li>
        <li><b>Оплата не прошла</b> — повтор и удержание слота на время, потом освобождение.</li>
        <li><b>Слот заняли</b> — сервер не даёт двойной записи, интерфейс объясняет и сохраняет выбор.</li>
      </ul>
      <p>Каждый ромб Лиза превратит в тест-кейс, а Глеб — в код ошибки API (например, «слот занят» — 409 Conflict). Это и есть польза user flow для аналитика: ветки находятся до разработки, а не в отзывах. Источники: Nielsen Norman Group, «User Flows»; Кокберн, «Современные методы описания функциональных требований» — расширения сценария; BR-2, BR-4, BR-15 кейса.</p>`,
    refNote: 'Засчитывается от 80 %: «позвоните нам» при отсутствии слотов, «вход → на главную» и «что-то пошло не так» засчитываются наполовину. Ветка BR-4 должна быть верной, а двойная запись недопустима.',
    report: ans => flEval(ans || {}).pts.map(x => `- ${x.p.q}: ${x.o ? x.o.s : '—'} ${mark(x.o ? (x.o.k === 'ok' ? 'ok' : x.o.k) : 'bad')}`).join('\n')
  };

  // =====================================================================
  // Практика 5. Выбрать инструмент + объяснить Артёму своими словами
  // =====================================================================
  const TL_B = [{ id: 'cjm', t: 'CJM', sub: 'опыт клиента на всём пути' }, { id: 'flow', t: 'User flow', sub: 'экраны и ветки одной задачи' }, { id: 'bpmn', t: 'BPMN', sub: 'процесс: кто что делает' }, { id: 'map', t: 'Карта историй', sub: 'что в какой релиз' }];
  const TL_I = [
    { id: 'x1', t: 'Показать Тимуру Рашидовичу, на каком этапе визита клиент теряет терпение', ok: 'cjm' },
    { id: 'x2', t: 'Описать для Даши и Лизы все экраны записи на ТО, включая «нет слотов» и «слот заняли»', ok: 'flow' },
    { id: 'x3', t: 'Договориться, кто что делает при согласовании доп. работ: механик, мастер, клиент, таймер 20 минут', ok: 'bpmn' },
    { id: 'x4', t: 'Разложить истории онлайн-записи: что в MVP к 15 марта, что после', ok: 'map' },
    { id: 'x5', t: 'Найти, где в пути клиента больше всего звонков на станцию', ok: 'cjm' },
    { id: 'x6', t: 'Показать путь заказ-наряда от приёмки до выдачи через АРМ, планшет механика и 1С', ok: 'bpmn' },
    { id: 'x7', t: 'Проверить, куда попадёт клиент после отмены записи из «Мои записи» и что увидит при ошибке', ok: 'flow' },
    { id: 'x8', t: 'Решить, без каких шагов пути клиента не будет первой версии', ok: 'map' }
  ];
  const EX_RUBRIC = [
    'Называет, что дали наблюдение и разговор с Еленой: факты с числами (очередь 12–15 минут, 2–3 звонка за визит, фото и цена, забывает о записи), которых не было ни в макетах, ни в интервью.',
    'Показывает цепочку «боль → возможность → требование → метрика» хотя бы на одном примере (например, неявки → напоминания за 24 и 2 часа → 17 % → 8 %).',
    'Объясняет, зачем user flow: ветки «не вошёл», «нет слотов», «2 неявки — предоплата» (BR-4), «слот заняли» — без них клиенты теряются, а правила не работают.',
    'Различает инструменты: CJM — опыт клиента целиком, user flow — экраны одной задачи, BPMN — процесс организации; они не заменяют, а дополняют друг друга.',
    'Говорит языком руководителя проекта: меньше переделок до 15 марта, связь с целями (21 % → 5 %, 17 % → 8 %), понятный следующий шаг.'
  ];
  const EX_REF = 'Артём, утро на станции сэкономит нам переделки. Мы увидели то, чего не было ни в интервью, ни в макетах: оформление на приёмке 12–15 минут, и половина — переписывание данных; Елена звонит 2–3 раза за визит, чтобы узнать статус; не верит «надо менять» без фото и цены; забывает о записи. Карта пути показала, где клиентке хуже всего — пока машина в цехе, — и Ника теперь рисует сначала статус и согласование, а не красивую главную. Каждую боль мы довели до требования и метрики: например, неявки → push за 24 и за 2 часа с кнопками «Перенести» и «Отменить» → цель 17 % → 8 %. Значит, всё в бэклоге MVP работает на цели Тимура Рашидовича, и лишнее видно сразу. User flow записи нужен разработке и Лизе: в схеме Ники не было веток «не вошёл», «нет слотов», «2 неявки — предоплата 500 ₽» по BR-4 и «слот заняли». Без них Даша сделала бы как поняла, а мы узнали бы о дырах из отзывов. BPMN не заменяет ни то, ни другое: он покажет процесс станции — кто из людей и систем что делает. Следующий шаг — в понедельник рисуем процесс записи «как есть».';
  const taskExplain = {
    id: 't-explain', title: 'Выбрать инструмент и объяснить Артёму своими словами',
    simple: {
      icon: '🗣️',
      plain: 'Артёму важны сроки и деньги: он хочет понять, зачем тратить время на карту и поток, если «экраны уже рисуются». Сначала разложите восемь задач по инструментам, потом ответьте ему коротко и конкретно — с числами из утра на станции.',
      analogy: 'Ремонт квартиры: дизайн-проект (как будет жить семья), план электрики (где какие розетки и что будет, если выбьет автомат) и график работ бригад. Никто не скажет «зачем план электрики, у нас же есть дизайн».',
      tech: 'Опора: CJM (NN/g, Стикдорн), user flow, BPMN 2.0 (OMG), карта историй (Паттон). Сильный ответ называет факты исследования, показывает трассировку до целей и объясняет, какой риск снимает каждый артефакт.'
    },
    lead: ui.brief({
      situation: 'Вечер вторника. Артём в чате: «Мы потратили утро на станции и полдня на карту. Ника уже рисует экраны, BPMN вы всё равно сделаете в понедельник. Зачем было всё это? Объясните — мне завтра защищать план перед Тимуром Рашидовичем».',
      todo: [
        'Разложите восемь задач по четырём инструментам: CJM, user flow, BPMN, карта историй.',
        'Напишите ответ Артёму в 6–10 предложений (от 300 символов): что дало исследование, как боли стали требованиями и метриками, зачем user flow и чем всё это отличается от BPMN.',
        'Нажмите «Проверить с Верой (Claude)» или «Сверить с эталоном самому» и честно отметьте раскрытые пункты. Засчитывается, если раскладка не меньше 75 % и ответ — от 60 %.'
      ],
      lookTitle: 'На что опереться',
      look: 'У вас есть числа из утра (12–15 минут, 2–3 звонка), цели (21 % → 5 %, 17 % → 8 %) и прогон Лизы по user flow. Артём любит конкретику и «что это даёт к 15 марта».'
    }),
    blank: () => ({ s: {}, j: {} }),
    reference: () => ({ s: Object.fromEntries(TL_I.map(i => [i.id, i.ok])), j: { text: EX_REF, self: EX_RUBRIC.map(() => true) } }),
    render(el, ctx) {
      el.classList.add('mcj-root');
      const a = ctx.ans, ro = ctx.readonly; a.s = a.s || {};
      let reveal = null;
      if (ctx.result || ro) { reveal = {}; TL_I.forEach(i => { if (ro || a.s[i.id]) reveal[i.id] = ro || a.s[i.id] === i.ok ? 'ok' : 'bad'; }); }
      el.innerHTML = `<div class="stack"><div class="stack tight"><span class="eyebrow">Восемь задач · какой инструмент</span><div data-sort></div></div>
        ${ui.say('artem', 'Мы потратили утро на станции и полдня на карту. Ника уже рисует экраны, BPMN вы всё равно сделаете. Зачем было всё это?')}<div data-j></div></div>`;
      ui.sort(TR.$('[data-sort]', el), { items: TL_I.map(i => ({ id: i.id, t: esc(i.t) })), buckets: TL_B, value: ro ? taskExplain.reference().s : a.s, reveal, readonly: ro, seed: 'mcj-tools', onChange: v => { a.s = v; ctx.save(); } });
      ui.justify(TR.$('[data-j]', el), {
        id: 'mcj-explain', q: 'Зачем были наблюдение, CJM и user flow, если экраны уже рисуются и будет BPMN?',
        qPlain: 'Объясните руководителю проекта автосервиса, что дали наблюдение на станции и разговор с клиенткой, как боли из карты пути клиента стали требованиями с метриками, зачем нужен user flow записи на ТО с ветками (не вошёл, нет слотов, 2 неявки — предоплата, слот заняли) и чем эти артефакты отличаются от BPMN.',
        rubric: EX_RUBRIC, reference: EX_REF, value: a.j, readonly: ro, minLen: 300,
        placeholder: 'Артём, утро на станции сэкономит нам…',
        onChange: v => { a.j = v; ctx.save(); ctx.decide && ctx.decide('Зачем CJM и user flow (ответ Артёму)', v.text || ''); }
      });
    },
    check(ans) {
      const s = (ans && ans.s) || {}, sortScore = TL_I.filter(i => s[i.id] === i.ok).length / TL_I.length, js = ui.justifyScore(ans && ans.j);
      const notes = TL_I.filter(i => s[i.id] !== i.ok).map(i => ({ ok: false, html: `«${esc(i.t)}» — ${s[i.id] ? 'это не ' + esc(TL_B.find(b => b.id === s[i.id]).t) + ', а ' : ''}<b>${esc(TL_B.find(b => b.id === i.ok).t)}</b>: ${{ cjm: 'речь об опыте и эмоциях клиента на всём пути', flow: 'речь об экранах и ветках одной задачи в интерфейсе', bpmn: 'речь о нескольких участниках и порядке их работы', map: 'речь о планировании: что в какой релиз' }[i.ok]}.` }));
      if (sortScore === 1) notes.push({ ok: true, html: 'Все восемь задач — у своих инструментов.' });
      if (!js) notes.push({ ok: false, html: 'Ответ Артёму не написан или не проверен: напишите от 300 символов и проверьте с Верой или сверьте с эталоном.' });
      else if (js < 0.6) notes.push({ ok: false, html: 'Артёму нужны три вещи: факты, которых не было в макетах; связь требований с целями заказчика; какие риски снимает user flow до разработки.' });
      else notes.push({ ok: true, html: `Ответ Артёму: ${Math.round(js * 100)} % по рубрике.` });
      const score = sortScore * 0.3 + js * 0.7;
      return {
        ok: sortScore >= 0.75 && js >= 0.6, score, notes,
        summary: `Раскладка: ${Math.round(sortScore * 100)} %; ответ: ${Math.round(js * 100)} %.`,
        mentor: sortScore < 0.75 ? 'Спросите про каждую задачу: «Чей взгляд и какой уровень?» Опыт клиента целиком — CJM; экраны одной задачи — user flow; несколько участников — BPMN; релизы — карта историй.' : null
      };
    },
    explain: `<p>Сильный ответ не защищает «методологию», а показывает, что каждый артефакт снял конкретный риск: <b>наблюдение</b> дало факты с числами, которых не было ни в интервью, ни в макетах; <b>карта</b> показала, где клиентке хуже всего, и связала требования с целями заказчика; <b>user flow</b> нашёл пять дыр до разработки; <b>BPMN</b> впереди — он про процесс станции, а не про экраны.</p>
      <p>Частые ошибки: «так положено по методологии» (Артёма это не убедит); пересказ определений без примеров из «Искры»; «CJM и BPMN — одно и то же». Сравнение инструментов: Nielsen Norman Group, «Journey Mapping 101» и «User Flows»; BPMN 2.0 (OMG); Джефф Паттон, «Пользовательские карты историй».</p>`,
    report: ans => {
      const s = (ans && ans.s) || {};
      return TL_I.map(i => `- ${i.t}: ${(TL_B.find(b => b.id === s[i.id]) || { t: '—' }).t} ${mark(s[i.id] === i.ok ? 'ok' : 'bad')}`).join('\n') + '\n\nОтвет Артёму:\n' + ((ans && ans.j && ans.j.text) || '—');
    }
  };

  // =====================================================================
  TR.stage({
    id: ID,
    when: 'вторник, 15 декабря, 08:00 · утро на станции «Победы»: путь Елены',
    intro: [
      { who: 'marina', html: 'Восемь утра, у меня семь машин в очереди. Если вы смотреть — смотрите, только не мешайте. Я одна на стойке.' },
      { who: 'nika', html: 'Я уже нарисовала главную и запись. Но, честно, рисовала «для всех». Хочу понять, для кого конкретно.' },
      { who: 'elena', html: 'Мне в 8:40 на такси, у меня совещание в девять. Спрашивайте быстро — я вам столько всего расскажу про ваш сервис.' },
      { who: 'vera', html: 'Сегодня смотрим на «Искру» глазами клиентки. Наблюдаем и спрашиваем о прошлом опыте, собираем карту пути Елены, превращаем боли в требования и дорисовываем ветки потока записи — до того, как Даша начнёт программировать.' }
    ],
    facts: ['F-calls', 'F-noshow', 'F-idle', 'F-goal', 'F-cutoff', 'F-noshow-rule', 'F-price-from', 'F-cancel', 'F-pd'],
    glossary: [
      { term: 'Персона', simple: 'Портрет одного типичного пользователя на основе реальных наблюдений и разговоров.', tech: 'Архетип пользователя с целями, контекстом, поведением и болями (А. Купер); не путать с сегментом аудитории.' },
      { term: 'Карта пути клиента (CJM)', simple: 'Таблица: этапы пути клиента и что на каждом он делает, чувствует и что ему мешает.', tech: 'Customer Journey Map — визуализация опыта клиента по этапам: действия, точки контакта, мысли и эмоции, боли, возможности; as-is и to-be.' },
      { term: 'Точка контакта', simple: 'Место, где клиент касается сервиса: звонок, стойка, приложение, SMS, касса.', tech: 'Touchpoint — канал или момент взаимодействия клиента с сервисом.' },
      { term: 'Кривая эмоций', simple: 'Линия настроения клиента по этапам: провалы показывают, что чинить первым.', tech: 'Emotional curve — строка CJM, построенная по цитатам и наблюдениям.' },
      { term: '«Как мы могли бы…?»', simple: 'Вопрос-направление, который превращает боль в задачу для команды.', tech: 'How Might We — формулировка возможности в дизайн-мышлении: ещё не решение, но уже направление.' },
      { term: 'User flow', simple: 'Схема экранов и решений, по которой человек идёт к одной цели, со всеми ветками.', tech: 'Пользовательский поток: экраны, действия, решения, ветки ошибок; артефакт проектирования интерфейса.' },
      { term: 'Счастливый путь', simple: 'Самый частый путь к цели, когда всё идёт хорошо.', tech: 'Happy path / основной сценарий; противоположность — крайние случаи и ветки ошибок.' },
      { term: 'Крайний случай', simple: 'Редкая, но возможная ситуация: нет слотов, нет сети, две неявки.', tech: 'Edge case — граничное или исключительное условие; источник веток в user flow и тест-кейсов.' },
      { term: 'Ленивая авторизация', simple: 'Просить войти только тогда, когда без этого нельзя, и не терять уже сделанный выбор.', tech: 'Lazy / deferred authentication — вход на шаге, где нужна идентификация, с возвратом в контекст.' },
      { term: 'Карта историй', simple: 'Путь пользователя, разложенный на истории и нарезанный на релизы.', tech: 'User story map (Дж. Паттон): хребет из шагов, истории под ними, горизонтальные срезы релизов.' },
      { term: 'Трассируемость', simple: 'Связь требования с болью, источником и целью: видно, зачем оно.', tech: 'Traceability — двусторонняя связь требований с источниками, целями и тестами (Вигерс, BABOK).' }
    ],
    outro: 'Сегодня «Искра» стала для команды не списком функций, а Еленой Смирновой, которая звонит три раза за визит и не верит «надо менять» без фото. Четыре новых факта — в блокноте; карта пути показала провал в цехе; каждая боль получила требование и метрику; поток записи обзавёлся ветками, и Лиза уже пишет по ним тест-кейсы. В четверг — ревью макетов Ники в Figma: проверим, дошло ли всё это до экранов.',
    tasks: [howPersona, howCjm, howFlow, taskObserve, taskCjm, taskTrace, taskFlow, taskExplain]
  });
})();
