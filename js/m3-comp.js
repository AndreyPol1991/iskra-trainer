/* Модуль 3, занятие 6: UML Component Diagram.
   Теория: how-comp-basics — компонент, предоставляемый и требуемый интерфейс («леденец» и «гнездо»), сборка, порт,
   зависимость, внешняя система, граница системы («нажмите на элемент»; «Искра» и кухня для сравнения);
   how-comp-read — карта компонентов «Искры Онлайн» (тот же состав, что TR.system.COMP): клик — от чего зависит и кто
   зависит, «уронить» компонент; как читать и где пригодится аналитику; how-comp-c4 — C4 (контекст, контейнеры,
   компоненты), диаграмма развёртывания и UML-компоненты: для кого и что показывают.
   Практика: своё / внешнее / не компонент; конструктор связей «кто через какой интерфейс» с живой диаграммой
   ball-and-socket; лаборатория анализа влияния отказа (ЮKassa, 1С в выходные, брокер) с подсветкой последствий;
   куда положить новую функцию (BR-13 и др.) кликом по диаграмме; уровни C4 и ответ Тимуру своими словами. */
'use strict';
(function () {
  const TR = window.TR, ui = TR.ui, esc = TR.esc;
  const ID = 'm3-comp';

  if (!document.getElementById('mcp-css')) document.head.insertAdjacentHTML('beforeend', `<style id="mcp-css">
    .mcp-root, .mcp-root .stack > * { min-width: 0; }
    .mcp-root .seg button { white-space: normal; }
    .mcp-board { overflow-x: auto; border: 1px solid var(--border); border-radius: 12px; background: var(--code-bg); padding: 6px; }
    .mcp-board svg { display: block; min-width: 720px; width: 100%; max-width: 1000px; }
    .mcp-board.sm svg { min-width: 560px; max-width: 780px; }
    .mcp-hit { cursor: pointer; outline: none; }
    .mcp-hit:hover rect.bx, .mcp-hit:focus rect.bx { stroke-width: 2.4; }
    .mcp-opts { display: flex; flex-wrap: wrap; gap: 6px; min-width: 0; }
    .mcp-opt { border: 1px solid var(--border-strong); border-radius: 10px; padding: 6px 10px; background: var(--surface-2); color: var(--text); font-size: 13.5px; line-height: 1.3; text-align: left; max-width: 100%; }
    .mcp-opt:hover:not(:disabled) { border-color: var(--text-muted); }
    .mcp-opt[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); box-shadow: 0 0 0 1px var(--accent) inset; }
    .mcp-opt.ok { border-color: var(--ok); background: var(--ok-soft); } .mcp-opt.bad { border-color: var(--bad); background: var(--bad-soft); } .mcp-opt.warn { border-color: var(--warn); background: var(--warn-soft); }
    .mcp-opt:disabled { cursor: default; }
    .mcp-def { display: grid; grid-template-columns: 150px minmax(0, 1fr); gap: 6px 14px; font-size: 14px; }
    .mcp-def > .k { font: 600 11px/1.5 var(--f-mono); letter-spacing: .05em; text-transform: uppercase; color: var(--text-muted); padding-top: 2px; }
    .mcp-rows { display: grid; gap: 6px; }
    .mcp-row { display: grid; grid-template-columns: 170px minmax(0, 1fr) minmax(0, 240px); gap: 8px; align-items: center; padding: 7px 10px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface); font-size: 13.5px; }
    .mcp-row .who { font: 600 12px/1.3 var(--f-mono); color: var(--text-muted); }
    .mcp-row select { width: 100%; min-width: 0; }
    .mcp-row.ok { border-color: var(--ok); } .mcp-row.bad { border-color: var(--bad); } .mcp-row.warn { border-color: var(--warn); }
    .mcp-row .why { grid-column: 1 / -1; font-size: 12.5px; color: var(--text-2); }
    .mcp-row.pick { box-shadow: 0 0 0 2px var(--accent) inset; }
    .mcp-fn { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 8px; align-items: center; padding: 7px 10px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface); font-size: 13.5px; }
    .mcp-fn.ok { border-color: var(--ok); } .mcp-fn.bad { border-color: var(--bad); } .mcp-fn.warn { border-color: var(--warn); }
    .mcp-fn .why { grid-column: 1 / -1; font-size: 12.5px; color: var(--text-2); }
    .mcp-fn .seg button { font-size: 12.5px; }
    .mcp-two { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 12px; align-items: start; }
    .mcp-tag { display: inline-block; font: 600 11px/1.4 var(--f-mono); padding: 1px 6px; border-radius: 6px; background: var(--surface-3); color: var(--text-2); margin: 0 4px 4px 0; }
    @media (max-width: 760px) {
      .mcp-def { grid-template-columns: minmax(0, 1fr); gap: 2px; }
      .mcp-def > .v { margin-bottom: 8px; }
      .mcp-row { grid-template-columns: minmax(0, 1fr); gap: 4px; }
      .mcp-fn { grid-template-columns: minmax(0, 1fr); }
      .mcp-two { grid-template-columns: minmax(0, 1fr); }
    }
  </style>`);

  // =====================================================================
  // Состав «Искры Онлайн» — тот же, что карта компонентов в x-system.js (TR.system.COMP)
  // =====================================================================
  const SYS = (TR.system && TR.system.COMP) || [];
  const CP = [
    { id: 'app', t: 'Приложение клиента', s: 'iOS / Android', k: 'front', x: 10, y: 30 },
    { id: 'site', t: 'Сайт с записью', s: 'веб', k: 'front', x: 10, y: 110 },
    { id: 'arm', t: 'АРМ мастера', s: 'веб, стойка', k: 'front', x: 10, y: 190 },
    { id: 'tab', t: 'Планшет механика', s: 'веб, цех', k: 'front', x: 10, y: 270 },
    { id: 'gw', t: 'API-шлюз', s: 'REST, авторизация', k: 'back', x: 200, y: 150 },
    { id: 'book', t: 'Сервис записи', s: 'слоты, BR-1…BR-4', k: 'back', x: 400, y: 30 },
    { id: 'wo', t: 'Сервис заказ-нарядов', s: 'ЗН, доп. работы', k: 'back', x: 400, y: 110 },
    { id: 'pay', t: 'Платёжный сервис', s: 'BR-10, BR-11', k: 'back', x: 400, y: 190 },
    { id: 'ntf', t: 'Сервис уведомлений', s: 'push, SMS', k: 'back', x: 400, y: 270 },
    { id: 'int', t: 'Интеграция с 1С', s: 'каждые 15 мин', k: 'back', x: 400, y: 350 },
    { id: 'db', t: 'База данных', s: 'PostgreSQL', k: 'data', x: 610, y: 40 },
    { id: 'files', t: 'Хранилище фото', s: 'S3, 6 месяцев', k: 'data', x: 610, y: 150 },
    { id: 'mq', t: 'Брокер сообщений', s: 'события', k: 'data', x: 610, y: 300 },
    { id: 'yk', t: 'ЮKassa', s: 'карта, СБП', k: 'ext', x: 820, y: 30 },
    { id: 'atol', t: 'Онлайн-касса', s: 'АТОЛ, 54-ФЗ', k: 'ext', x: 820, y: 110 },
    { id: 'sms', t: 'SMS-шлюз', s: 'SMSC', k: 'ext', x: 820, y: 190 },
    { id: 'push', t: 'Push-сервисы', s: 'FCM / APNs', k: 'ext', x: 820, y: 270 },
    { id: '1c', t: '1С', s: 'склад, бухгалтерия', k: 'ext', x: 820, y: 350 }
  ].map(c => { const s = SYS.find(x => x.id === c.id); return Object.assign({ w: 160, h: 58, d: s ? s.d : '' }, c, s ? { t: s.t } : {}); });
  const CPB = id => CP.find(c => c.id === id);
  const KC = { front: 'var(--info)', back: 'var(--accent)', data: 'var(--violet)', ext: 'var(--text-muted)' };
  // зависимости «кто → от кого» (потребитель → поставщик интерфейса)
  const DEPS = [
    { c: 'app', p: 'gw', i: 'REST API' }, { c: 'site', p: 'gw', i: 'REST API' }, { c: 'arm', p: 'gw', i: 'REST API' }, { c: 'tab', p: 'gw', i: 'REST API' },
    { c: 'gw', p: 'book', i: 'IBooking' }, { c: 'gw', p: 'wo', i: 'IWorkOrders' }, { c: 'gw', p: 'pay', i: 'IPayments' },
    { c: 'book', p: 'db', i: 'SQL' }, { c: 'wo', p: 'db', i: 'SQL' }, { c: 'pay', p: 'db', i: 'SQL' }, { c: 'int', p: 'db', i: 'SQL' },
    { c: 'wo', p: 'files', i: 'S3 API' },
    { c: 'book', p: 'int', i: 'IStock' },
    { c: 'book', p: 'mq', i: 'События', a: 1 }, { c: 'wo', p: 'mq', i: 'События', a: 1 }, { c: 'pay', p: 'mq', i: 'События', a: 1 }, { c: 'ntf', p: 'mq', i: 'События', a: 1 },
    { c: 'pay', p: 'yk', i: 'ЮKassa API v3', oy: -8 }, { c: 'yk', p: 'pay', i: 'Вебхук', oy: 8, a: 1 }, { c: 'pay', p: 'atol', i: 'АТОЛ API', a: 1 },
    { c: 'ntf', p: 'sms', i: 'SMSC API', oy1: -12 }, { c: 'ntf', p: 'push', i: 'FCM / APNs', oy1: -12 }, { c: 'int', p: '1c', i: 'HTTP-сервис 1С' }
  ];
  const C = { ok: 'var(--ok)', bad: 'var(--bad)', warn: 'var(--warn)', accent: 'var(--accent)', info: 'var(--info)', violet: 'var(--violet)', mute: 'var(--text-muted)', '': 'var(--text-2)' };
  let uid = 0;

  // маршрут ортогональной линии от потребителя к поставщику
  function route(e, asm) {
    const a = CPB(e.c), b = CPB(e.p);
    const y1 = a.y + a.h / 2 + (e.oy1 != null ? e.oy1 : (e.oy || 0)), y2 = b.y + b.h / 2 + (e.oy || 0);
    let x1, x2, xm, dir;
    if (b.x > a.x) { x1 = a.x + a.w; x2 = b.x; xm = b.x - (asm ? 26 : 18) - (e.p === 'mq' ? 6 : 0); dir = 1; }
    else if (b.x < a.x) { x1 = a.x; x2 = b.x + b.w; xm = a.x - 14; dir = -1; }
    else { x1 = a.x + a.w; x2 = b.x + b.w; xm = a.x + a.w + 26; dir = -1; }
    return { x1, y1, x2, y2, xm, dir };
  }
  function edgeSVG(e, opt, id) {
    const r = route(e, opt.asm), col = C[e.k || ''] || C[''];
    const sw = e.k ? 2 : 1.2;
    if (!opt.asm) {
      return `<path d="M${r.x1} ${r.y1} H${r.xm} V${r.y2} H${r.x2 - r.dir * 2}" style="fill:none;stroke:${col};stroke-width:${sw};stroke-dasharray:5 4" marker-end="url(#${id}-o${e.k || ''})"><title>${esc(CPB(e.c).t)} → ${esc(CPB(e.p).t)}: ${esc(e.i || '')}</title></path>`;
    }
    // сборка: гнездо у потребителя, леденец у поставщика
    const bx = r.x2 - r.dir * 13, sx = bx - r.dir * 9;
    let s = `<path d="M${r.x1} ${r.y1} H${r.xm} V${r.y2} H${sx}" style="fill:none;stroke:${col};stroke-width:${sw}"/>`;
    s += `<path d="M${bx} ${r.y2 - 9} A9 9 0 0 ${r.dir > 0 ? 0 : 1} ${bx} ${r.y2 + 9}" style="fill:none;stroke:${col};stroke-width:${sw + 0.4}"/>`;
    s += `<line x1="${r.x2}" y1="${r.y2}" x2="${bx + r.dir * 5}" y2="${r.y2}" style="stroke:${col};stroke-width:${sw}"/><circle cx="${bx}" cy="${r.y2}" r="5" style="fill:var(--surface);stroke:${col};stroke-width:${sw + 0.4}"/>`;
    if (e.lab) s += `<text x="${(r.xm + sx) / 2}" y="${r.y2 - 7}" text-anchor="middle" style="fill:${col};font-size:10px;font-weight:600;paint-order:stroke;stroke:var(--code-bg);stroke-width:3px">${esc(e.lab)}</text>`;
    return `<g><title>${esc(CPB(e.c).t)} → ${esc(e.i || '')} (${esc(CPB(e.p).t)})</title>${s}</g>`;
  }
  function compIcon(x, y, col) {
    return `<g style="fill:var(--surface);stroke:${col};stroke-width:1.1"><rect x="${x}" y="${y}" width="14" height="12" rx="1"/><rect x="${x - 3}" y="${y + 2}" width="7" height="3"/><rect x="${x - 3}" y="${y + 7}" width="7" height="3"/></g>`;
  }
  function boxSVG(c, opt) {
    const st = opt.state && opt.state[c.id];
    const col = st ? C[st] : KC[c.k];
    const sel = opt.sel === c.id;
    const ext = c.k === 'ext';
    let s = `<rect class="bx" x="${c.x}" y="${c.y}" width="${c.w}" height="${c.h}" rx="5" style="fill:${st ? `color-mix(in srgb, ${col} 14%, var(--surface))` : 'var(--surface)'};stroke:${col};stroke-width:${sel ? 2.6 : st ? 2 : 1.3};${ext ? 'stroke-dasharray:6 3;' : ''}"/>`;
    if (!ext) s += compIcon(c.x + c.w - 20, c.y + 6, col);
    s += `<text x="${c.x + 10}" y="${c.y + 24}" style="fill:var(--text);font-size:12.5px;font-weight:600">${esc(c.t)}</text>`;
    s += `<text x="${c.x + 10}" y="${c.y + 42}" style="fill:var(--text-muted);font-size:10.5px">${ext ? '«внешняя» · ' : ''}${esc(c.s)}</text>`;
    if (opt.fail === c.id) s += `<path d="M${c.x + c.w - 22} ${c.y + c.h - 22} l14 14 M${c.x + c.w - 8} ${c.y + c.h - 22} l-14 14" style="stroke:var(--bad);stroke-width:3"/>`;
    const bd = opt.badges && opt.badges[c.id];
    if (bd && bd.length) bd.forEach((b, j) => {
      const bx = c.x + c.w - 10 - j * 19, by = c.y - 2;
      s += `<circle cx="${bx}" cy="${by}" r="9" style="fill:${C[b.k || 'accent']}"/><text x="${bx}" y="${by + 3.5}" text-anchor="middle" style="fill:var(--surface);font:700 10px var(--f-mono)">${esc(b.n)}</text>`;
    });
    return opt.click ? `<g class="mcp-hit" data-c="${c.id}" tabindex="0" role="button" aria-label="${esc(c.t)}" aria-pressed="${sel}">${s}</g>` : s;
  }
  // opt: { edges:[...], asm, state:{id:kind}, sel, fail, click, badges, only:[ids], title }
  function compSVG(opt) {
    const id = 'mcpd' + (++uid);
    const mk = k => `<marker id="${id}-o${k}" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="9" markerHeight="9" orient="auto-start-reverse"><path d="M0 0 L12 6 L0 12" style="fill:none;stroke:${C[k]};stroke-width:1.6"/></marker>`;
    let s = `<svg viewBox="0 0 1000 422" role="img" aria-label="${esc(opt.title || 'Диаграмма компонентов «Искры Онлайн»')}"><defs>${Object.keys(C).map(mk).join('')}</defs>`;
    s += `<rect x="2" y="4" width="784" height="414" rx="12" style="fill:none;stroke:var(--border-strong);stroke-dasharray:8 5"/>`;
    s += `<text x="14" y="20" style="fill:var(--text-muted);font:600 11px var(--f-mono)">«subsystem» Искра Онлайн</text>`;
    (opt.edges || []).forEach(e => { s += edgeSVG(e, opt, id); });
    CP.forEach(c => { if (!opt.only || opt.only.includes(c.id)) s += boxSVG(c, opt); });
    return `<div class="mcp-board">${s}</svg></div>`;
  }
  const pct = x => Math.round(x * 100) + ' %';

  // =====================================================================
  // Теория 1. Нотация: компонент, интерфейсы, порт, зависимость
  // =====================================================================
  const LBL = {
    iskra: { A: 'API-шлюз', B: 'Платёжный сервис', C: 'ЮKassa', D: 'База данных', i1: 'IPayments', i2: 'ЮKassa API v3', i3: 'Вебхук', dep: '«use» SQL', sys: 'Искра Онлайн' },
    home: { A: 'Кофемашина', B: 'Проводка квартиры', C: 'Городская сеть', D: 'Щиток с автоматами', i1: 'Розетка 220 В', i2: 'Ввод от подстанции', i3: 'Показания счётчика', dep: '«use»', sys: 'Квартира' }
  };
  const EL = [
    { id: 'comp', t: 'Компонент', d: 'Самостоятельная заменяемая часть системы со своими обязанностями, которая общается с остальными только через интерфейсы. Прямоугольник со значком «двух штырьков» или стереотипом «component».', iskra: 'Платёжный сервис: создаёт платежи, принимает вебхуки, отправляет чеки, начисляет бонусы. Внутри может быть что угодно — снаружи видны только интерфейсы.', home: 'Проводка квартиры: что внутри стен, вам неважно — важно, что есть розетки.', mis: 'Компонентом называют всё подряд: таблицу, экран, класс. Компонент — это то, что можно отдельно разработать, развернуть или заменить.' },
    { id: 'prov', t: 'Предоставляемый интерфейс («леденец»)', d: 'Кружок на палочке: что компонент <b>умеет и даёт</b> другим. Набор операций или событий с контрактом.', iskra: 'IPayments: «создать платёж», «узнать статус», «вернуть деньги». Его использует API-шлюз.', home: 'Розетка 220 В — то, что даёт проводка.', mis: 'Рисуют «леденец» у того, кто вызывает. Леденец всегда у поставщика: у того, кто умеет.' },
    { id: 'req', t: 'Требуемый интерфейс («гнездо»)', d: 'Полукруг на палочке: что компоненту <b>нужно</b> от других, чтобы работать.', iskra: 'API-шлюзу нужен IPayments, чтобы передать запрос «оплатить» из приложения.', home: 'Вилка кофемашины — ей нужна розетка 220 В.', mis: 'Забывают требуемые интерфейсы — и потом не видят, от чего зависит компонент. Именно гнёзда нужны для анализа влияния.' },
    { id: 'asm', t: 'Сборка (ball-and-socket)', d: 'Леденец вставлен в гнездо: требуемый интерфейс одного компонента удовлетворён предоставляемым интерфейсом другого. Читается «A использует B через интерфейс I».', iskra: 'API-шлюз —(IPayments)— Платёжный сервис; Платёжный сервис —(ЮKassa API v3)— ЮKassa.', home: 'Вилка в розетке.', mis: 'Соединяют компоненты голой линией без интерфейса — непонятно, через что они общаются и что сломается при изменении.' },
    { id: 'port', t: 'Порт', d: 'Квадратик на границе компонента — именованная «точка входа», через которую идут интерфейсы. Полезен, когда у компонента несколько входов для разных клиентов.', iskra: 'Порт «webhooks» платёжного сервиса: через него ЮKassa присылает уведомления. Отдельный вход — отдельные правила: проверка подлинности, свой лимит запросов.', home: 'Щиток со счётчиком на лестнице — отдельная «точка», к которой приходит контролёр.', mis: 'Порты рисуют везде «для красоты». Аналитику они нужны редко — когда входов несколько и правила у них разные.' },
    { id: 'dep', t: 'Зависимость', d: 'Пунктирная стрелка от зависимого к тому, от кого он зависит: «если поменяется B, может сломаться A». Часто со стереотипом «use».', iskra: 'Платёжный сервис зависит от базы данных: хранит платежи (таблица payment).', home: 'Проводка зависит от щитка: выбило автомат — розетки обесточены.', mis: 'Стрелку рисуют «по потоку данных», а не по зависимости. Направление — от того, кто использует, к тому, кого используют.' },
    { id: 'ext', t: 'Внешняя система', d: 'Компонент, который делаем не мы и не можем поменять: только использовать его интерфейс. Рисуют за границей нашей системы, часто со стереотипом «external» или серым.', iskra: 'ЮKassa, АТОЛ, SMSC, FCM/APNs и 1С «Искры». 1С — собственность заказчика, но не часть «Искры Онлайн»: её обновляет другая команда.', home: 'Городская электросеть: вы платите за неё, но управлять подстанцией не можете.', mis: 'Внешнюю систему рисуют внутри границы — и забывают, что её сбой и её изменения от нас не зависят. Для внешних всегда спрашивайте: что будет, если она недоступна?' }
  ];
  function basicsSVG(ex, hl) {
    const L = LBL[ex];
    const on = k => hl === k;
    const st = (k, base) => on(k) ? 'var(--accent)' : base;
    const w = k => on(k) ? 2.6 : 1.4;
    let s = `<svg viewBox="0 0 760 300" role="img" aria-label="Нотация диаграммы компонентов">`;
    s += `<rect x="8" y="14" width="540" height="276" rx="12" style="fill:none;stroke:var(--border-strong);stroke-dasharray:8 5"/><text x="20" y="32" style="fill:var(--text-muted);font:600 11px var(--f-mono)">«subsystem» ${esc(L.sys)}</text>`;
    // A
    s += `<rect x="24" y="52" width="160" height="62" rx="5" style="fill:var(--surface);stroke:var(--info);stroke-width:1.4"/>${compIcon(164, 58, 'var(--info)')}<text x="34" y="78" style="fill:var(--text-muted);font-size:10px">«component»</text><text x="34" y="96" style="fill:var(--text);font-size:13px;font-weight:600">${esc(L.A)}</text>`;
    // B
    s += `<rect x="300" y="44" width="200" height="110" rx="5" style="fill:var(--surface);stroke:${st('comp', 'var(--accent)')};stroke-width:${w('comp')}"/>${compIcon(480, 50, 'var(--accent)')}<text x="312" y="72" style="fill:var(--text-muted);font-size:10px">«component»</text><text x="312" y="90" style="fill:var(--text);font-size:13px;font-weight:600">${esc(L.B)}</text>`;
    // A → B: гнездо и леденец
    s += `<path d="M184 83 H253" style="fill:none;stroke:${st('req', 'var(--text-2)')};stroke-width:${w('req')}"/><path d="M262 74 A9 9 0 0 0 262 92" style="fill:none;stroke:${st('req', on('asm') ? 'var(--accent)' : 'var(--text-2)')};stroke-width:${on('req') || on('asm') ? 2.8 : 1.8}"/>`;
    s += `<line x1="300" y1="83" x2="267" y2="83" style="stroke:${st('prov', on('asm') ? 'var(--accent)' : 'var(--text-2)')};stroke-width:${w('prov')}"/><circle cx="262" cy="83" r="5" style="fill:var(--surface);stroke:${st('prov', on('asm') ? 'var(--accent)' : 'var(--text-2)')};stroke-width:${on('prov') || on('asm') ? 2.8 : 1.8}"/><text x="262" y="66" text-anchor="middle" style="fill:var(--text);font-size:11px;font-weight:600">${esc(L.i1)}</text>`;
    // C внешняя
    s += `<rect x="596" y="44" width="150" height="110" rx="5" style="fill:var(--surface);stroke:${st('ext', 'var(--text-muted)')};stroke-width:${w('ext')};stroke-dasharray:6 3"/><text x="608" y="72" style="fill:var(--text-muted);font-size:10px">«external»</text><text x="608" y="90" style="fill:var(--text);font-size:13px;font-weight:600">${esc(L.C)}</text>`;
    // B требует интерфейс C
    s += `<path d="M500 64 H568" style="fill:none;stroke:${on('asm') ? 'var(--accent)' : 'var(--text-2)'};stroke-width:1.4"/><path d="M577 55 A9 9 0 0 0 577 73" style="fill:none;stroke:${on('asm') || on('req') ? 'var(--accent)' : 'var(--text-2)'};stroke-width:1.8"/><line x1="596" y1="64" x2="582" y2="64" style="stroke:var(--text-2);stroke-width:1.4"/><circle cx="577" cy="64" r="5" style="fill:var(--surface);stroke:${on('prov') ? 'var(--accent)' : 'var(--text-2)'};stroke-width:1.8"/><text x="548" y="50" text-anchor="middle" style="fill:var(--text);font-size:11px;font-weight:600">${esc(L.i2)}</text>`;
    // порт B и вебхук от C
    s += `<rect x="494" y="112" width="12" height="12" style="fill:${on('port') ? 'var(--accent)' : 'var(--surface-3)'};stroke:${st('port', 'var(--text-2)')};stroke-width:${w('port')}"/><text x="488" y="140" text-anchor="end" style="fill:var(--text-muted);font-size:10px">порт webhooks</text>`;
    s += `<line x1="506" y1="118" x2="525" y2="118" style="stroke:var(--text-2);stroke-width:1.4"/><circle cx="530" cy="118" r="5" style="fill:var(--surface);stroke:${on('prov') ? 'var(--accent)' : 'var(--text-2)'};stroke-width:1.8"/><path d="M539 109 A9 9 0 0 1 539 127" style="fill:none;stroke:var(--text-2);stroke-width:1.8"/><path d="M539 118 H596" style="fill:none;stroke:var(--text-2);stroke-width:1.4"/><text x="566" y="140" text-anchor="middle" style="fill:var(--text);font-size:11px;font-weight:600">${esc(L.i3)}</text>`;
    // D и зависимость
    s += `<rect x="300" y="214" width="200" height="56" rx="5" style="fill:var(--surface);stroke:var(--violet);stroke-width:1.4"/>${compIcon(480, 220, 'var(--violet)')}<text x="312" y="246" style="fill:var(--text);font-size:13px;font-weight:600">${esc(L.D)}</text>`;
    s += `<defs><marker id="mcpb-o" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="9" markerHeight="9" orient="auto"><path d="M0 0 L12 6 L0 12" style="fill:none;stroke:${on('dep') ? 'var(--accent)' : 'var(--text-2)'};stroke-width:1.6"/></marker></defs>`;
    s += `<line x1="400" y1="154" x2="400" y2="211" style="stroke:${st('dep', 'var(--text-2)')};stroke-width:${w('dep')};stroke-dasharray:5 4" marker-end="url(#mcpb-o)"/><text x="410" y="188" style="fill:var(--text-2);font-size:11px">${esc(L.dep)}</text>`;
    return `<div class="mcp-board sm">${s}</svg></div>`;
  }
  const howBasics = {
    id: 'how-comp-basics', covers: ['own'], title: 'Как это работает: компоненты, интерфейсы, порты и зависимости', free: true, noReset: true,
    simple: {
      icon: '🧱',
      plain: 'Диаграмма компонентов показывает, из каких крупных частей состоит система, что каждая часть умеет, что ей нужно от других и с какими чужими системами она связана.',
      analogy: 'Электрика в квартире: кофемашине нужна розетка (гнездо — «мне нужно»), проводка её даёт (леденец — «я умею»), а сама проводка зависит от щитка и городской сети, которой вы не управляете.',
      tech: '<b>Component diagram</b> — структурная диаграмма UML 2.5 (OMG, раздел 11.6 «Components»): компоненты, предоставляемые и требуемые интерфейсы, порты, соединители сборки (assembly connector) и зависимости. В отличие от диаграммы развёртывания, показывает логическое устройство, а не серверы.'
    },
    render(el) {
      el.classList.add('mcp-root');
      let cur = 'asm', ex = 'iskra';
      el.innerHTML = `<div class="stack">
        <div class="row"><span class="small dim">Пример:</span>${ui.seg('ex', [{ v: 'iskra', t: '🔧 Оплата в «Искре»' }, { v: 'home', t: '🏠 Электрика в квартире' }], ex, 'accent')}</div>
        <div class="mcp-opts" data-els></div>
        <div data-dg></div>
        <div data-card></div>
        ${ui.note('', 'Своё и внешнее', 'Пунктирная рамка — граница нашей системы. Всё внутри делает «Орбита»: можем менять, разворачивать, чинить. Всё снаружи — чужое: ЮKassa, АТОЛ, SMSC, FCM/APNs и даже 1С «Искры» (её дорабатывает другой подрядчик). Для каждой внешней системы аналитик выясняет: какой у неё интерфейс, кто владелец, какие ограничения (лимиты, часы обслуживания), что делаем при её недоступности.')}
        ${ui.note('warn', 'Типичные ошибки', '<ul class="checks"><li class="bad">Смешивают уровни: на одной картинке «Платёжный сервис», «Таблица payment» и «Сервер app-02».</li><li class="bad">Линии без интерфейсов и без направления — непонятно, кто от кого зависит.</li><li class="bad">Внешние системы внутри границы — будто мы можем их поменять.</li><li class="bad">Диаграмма один раз нарисована и забыта. Устаревшая схема хуже никакой: по ней принимают неверные решения.</li></ul>')}
        <details class="more"><summary>Как об этом спрашивают на собеседовании</summary><div>
          <p><b>«Что такое предоставляемый и требуемый интерфейс?»</b> Предоставляемый — что компонент даёт другим (леденец), требуемый — что ему нужно (гнездо). Соединение леденца с гнездом — сборка: «A использует B через интерфейс I». Пример: API-шлюз требует IPayments, платёжный сервис его предоставляет.</p>
          <p><b>«Зачем аналитику диаграмма компонентов?»</b> Чтобы понимать, куда ляжет новая функция, какие интеграции затронет изменение, что сломается при отказе внешней системы, и чтобы говорить с архитектором и разработчиками на одном языке.</p>
        </div></details>
      </div>`;
      function draw() {
        const e = EL.find(x => x.id === cur);
        TR.$('[data-els]', el).innerHTML = EL.map(x => `<button type="button" class="mcp-opt" data-e="${x.id}" aria-pressed="${x.id === cur}">${esc(x.t)}</button>`).join('');
        TR.$('[data-dg]', el).innerHTML = basicsSVG(ex, cur);
        TR.$('[data-card]', el).innerHTML = `<div class="card flat"><h4>${esc(e.t)}</h4><div class="mcp-def"><span class="k">Что это</span><div class="v">${e.d}</div><span class="k">${ex === 'iskra' ? 'В «Искре»' : 'В квартире'}</span><div class="v">${e[ex]}</div><span class="k">Ошибка</span><div class="v">${e.mis}</div></div></div>`;
      }
      ui.onSeg(el, (n, v) => { if (n === 'ex') { ex = v; draw(); } });
      TR.on(el, 'click', '[data-e]', (e, b) => { cur = b.dataset.e; draw(); });
      draw();
    }
  };

  // =====================================================================
  // Теория 2. Карта «Искры Онлайн»: как читать и что будет, если уронить
  // =====================================================================
  const howRead = {
    id: 'how-comp-read', covers: ['impact'], title: 'Как это работает: читаем карту «Искры Онлайн» и ищем последствия', free: true, noReset: true,
    simple: {
      icon: '🗺️',
      plain: 'Диаграмму компонентов читают по стрелкам зависимостей: от кого зависит компонент и кто зависит от него. Второй вопрос — главный для анализа влияния: если это сломать или поменять, кого заденет?',
      analogy: 'Схема метро: закрыли станцию на ремонт — по схеме сразу видно, какие пересадки пропадут и каким пассажирам придётся ехать в объезд.',
      tech: '<b>Анализ влияния</b> (impact analysis, BABOK, 7.6 «Анализ влияния изменений») опирается на модель зависимостей. Синхронная зависимость передаёт отказ сразу, асинхронная (через брокер, очередь) — сглаживает: работа откладывается, а не останавливается.'
    },
    render(el) {
      el.classList.add('mcp-root');
      let sel = 'pay', drop = false;
      el.innerHTML = `<div class="stack">
        <p class="small muted">Нажмите на компонент: стрелки от него — от чего он зависит, стрелки к нему — кто зависит от него. Включите «Уронить», чтобы увидеть, кого заденет его отказ напрямую.</p>
        <div class="row">${ui.seg('m', [{ v: '0', t: 'Зависимости' }, { v: '1', t: '💥 Уронить' }], '0', 'accent')}</div>
        <div data-dg></div>
        <div data-card></div>
        <details class="more" open><summary>Как читать диаграмму компонентов за пять шагов</summary><div>
          <ol>
            <li><b>Граница.</b> Что наше, что чужое: внешние системы — источник рисков и отдельных договорённостей.</li>
            <li><b>Входы.</b> Кто пользуется системой: приложение, сайт, АРМ, планшет — все идут через API-шлюз.</li>
            <li><b>Владельцы.</b> Какой сервис отвечает за какие правила: запись — BR-1…BR-4, оплата — BR-10, BR-11.</li>
            <li><b>Синхронные и асинхронные связи.</b> Через брокер — «отложится», напрямую — «встанет».</li>
            <li><b>Единые точки отказа.</b> Компоненты, от которых зависят многие: API-шлюз, база данных, брокер.</li>
          </ol>
          <p class="small muted">Где аналитику это пригодится: оценка запроса на изменение (какие сервисы трогаем — столько и команд в оценке), список интеграций и их требований, нефункциональные требования «что делаем при недоступности», разговор с архитектором и заказчиком.</p>
        </div></details>
        <details class="more"><summary>Как об этом спрашивают на собеседовании</summary><div>
          <p><b>«Внешний сервис недоступен. Как вы поймёте, что сломается?»</b> По диаграмме компонентов: найти, кто от него зависит; разделить синхронные и асинхронные зависимости; для каждой функции решить — не работает, работает с ограничениями, не затронута; записать поведение при отказе в требования («показать „оплатите на кассе“», «поставить в очередь»).</p>
        </div></details>
      </div>`;
      function draw() {
        const out = DEPS.filter(d => d.c === sel), inn = DEPS.filter(d => d.p === sel);
        const state = { [sel]: drop ? 'bad' : 'accent' };
        const edges = DEPS.map(d => Object.assign({}, d, { k: d.c === sel && !drop ? 'info' : d.p === sel ? (drop ? (d.a ? 'warn' : 'bad') : 'accent') : '' }));
        if (drop) inn.forEach(d => { state[d.c] = d.a ? 'warn' : 'bad'; });
        else out.forEach(d => { state[d.p] = 'info'; });
        TR.$('[data-dg]', el).innerHTML = compSVG({ edges, state, sel, click: true, fail: drop ? sel : null });
        const c = CPB(sel);
        TR.$('[data-card]', el).innerHTML = `<div class="card flat"><h4>${esc(c.t)} <span class="small dim">· ${esc(c.s)}</span></h4><div class="mcp-def">
          <span class="k">Что делает</span><div class="v">${esc(c.d || '')}</div>
          <span class="k">Зависит от</span><div class="v">${out.length ? out.map(d => `<span class="mcp-tag">${esc(CPB(d.p).t)} · ${esc(d.i)}${d.a ? ' · асинхр.' : ''}</span>`).join('') : '—'}</div>
          <span class="k">Кто зависит</span><div class="v">${inn.length ? inn.map(d => `<span class="mcp-tag">${esc(CPB(d.c).t)}${d.a ? ' · асинхр.' : ''}</span>`).join('') : '—'}</div>
          ${drop ? `<span class="k">Если упадёт</span><div class="v">${inn.length ? `Напрямую задеты: ${inn.map(d => esc(CPB(d.c).t) + (d.a ? ' (отложится)' : ' (встанет то, что требует его)')).join(', ')}. Дальше по цепочке — те, кто зависит от них.` : 'От него никто не зависит напрямую: отказ останется внутри.'}</div>` : ''}
        </div></div>`;
      }
      ui.onSeg(el, (n, v) => { if (n === 'm') { drop = v === '1'; draw(); } });
      TR.on(el, 'click', '.mcp-hit', (e, g) => { sel = g.dataset.c; draw(); });
      TR.on(el, 'keydown', '.mcp-hit', (e, g) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); sel = g.dataset.c; draw(); } });
      draw();
    }
  };

  // =====================================================================
  // Теория 3. C4, диаграмма развёртывания и UML-компоненты
  // =====================================================================
  function clip(a, b) {
    const cx = a.x + a.w / 2, cy = a.y + a.h / 2, dx = b.x + b.w / 2 - cx, dy = b.y + b.h / 2 - cy;
    const t = Math.min(dx ? (a.w / 2) / Math.abs(dx) : 1e9, dy ? (a.h / 2) / Math.abs(dy) : 1e9);
    return [cx + dx * t, cy + dy * t];
  }
  function mini(nodes, edges, W, H) {
    const id = 'mcpm' + (++uid), N = k => nodes.find(n => n.id === k);
    let s = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Схема"><defs><marker id="${id}-a" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="8" markerHeight="8" orient="auto"><path d="M0 0 L12 6 L0 12" style="fill:none;stroke:var(--text-2);stroke-width:1.6"/></marker></defs>`;
    nodes.filter(n => n.k === 'frame' || n.k === 'node').forEach(n => {
      if (n.k === 'node') s += `<path d="M${n.x + 8} ${n.y} l8 -8 h${n.w} v${n.h} l-8 8" style="fill:var(--surface-2);stroke:var(--border-strong)"/><line x1="${n.x + n.w}" y1="${n.y}" x2="${n.x + n.w + 8}" y2="${n.y - 8}" style="stroke:var(--border-strong)"/>`;
      s += `<rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="${n.k === 'node' ? 2 : 10}" style="fill:${n.k === 'node' ? 'var(--surface-2)' : 'none'};stroke:var(--border-strong);${n.k === 'frame' ? 'stroke-dasharray:7 4' : ''}"/><text x="${n.x + 10}" y="${n.y + 16}" style="fill:var(--text-muted);font:600 11px var(--f-mono)">${esc(n.t)}</text>`;
    });
    edges.forEach(e => {
      const a = N(e[0]), b = N(e[1]); const p1 = clip(a, b), p2 = clip(b, a);
      s += `<line x1="${p1[0]}" y1="${p1[1]}" x2="${p2[0]}" y2="${p2[1]}" style="stroke:var(--text-2);stroke-width:1.2;${e[3] ? 'stroke-dasharray:5 4' : ''}" marker-end="url(#${id}-a)"/>`;
      if (e[2]) s += `<text x="${(p1[0] + p2[0]) / 2}" y="${(p1[1] + p2[1]) / 2 - 4}" text-anchor="middle" style="fill:var(--text-2);font-size:10px;paint-order:stroke;stroke:var(--code-bg);stroke-width:3px">${esc(e[2])}</text>`;
    });
    nodes.filter(n => n.k !== 'frame' && n.k !== 'node').forEach(n => {
      const col = { person: 'var(--info)', sys: 'var(--accent)', ext: 'var(--text-muted)', cont: 'var(--accent)', db: 'var(--violet)', comp: 'var(--accent)', art: 'var(--ok)' }[n.k] || 'var(--text-2)';
      s += `<rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="${n.k === 'person' ? 18 : 6}" style="fill:${n.k === 'sys' ? 'var(--accent-soft)' : 'var(--surface)'};stroke:${col};stroke-width:${n.k === 'sys' ? 2 : 1.3};${n.k === 'ext' ? 'stroke-dasharray:6 3' : ''}"/>`;
      if (n.k === 'person') s += `<circle cx="${n.x + 16}" cy="${n.y + n.h / 2}" r="6" style="fill:none;stroke:${col};stroke-width:1.4"/>`;
      if (n.k === 'db') s += `<ellipse cx="${n.x + n.w / 2}" cy="${n.y + 6}" rx="${n.w / 2 - 6}" ry="4" style="fill:none;stroke:${col}"/>`;
      const tx = n.k === 'person' ? n.x + 28 : n.x + 10;
      s += `<text x="${tx}" y="${n.y + (n.s ? n.h / 2 - 2 : n.h / 2 + 4)}" style="fill:var(--text);font-size:${n.k === 'sys' ? 13 : 12}px;font-weight:600">${esc(n.t)}</text>`;
      if (n.s) s += `<text x="${tx}" y="${n.y + n.h / 2 + 13}" style="fill:var(--text-muted);font-size:10px">${esc(n.s)}</text>`;
    });
    return `<div class="mcp-board sm">${s}</svg></div>`;
  }
  const VIEWS = {
    c1: { t: 'C4 · 1. Контекст', who: 'Заказчик, руководитель, все новые люди в проекте', what: 'Система — одна коробка. Вокруг — кто ею пользуется и с какими внешними системами она обменивается данными.', q: 'С кем мы связаны? Кто наши пользователи? Что вне нашей ответственности?',
      nodes: [{ id: 'cl', k: 'person', t: 'Клиент', s: 'приложение, сайт', x: 20, y: 20, w: 170, h: 46 }, { id: 'ms', k: 'person', t: 'Мастер-приёмщик', s: 'АРМ', x: 20, y: 100, w: 170, h: 46 }, { id: 'mh', k: 'person', t: 'Механик', s: 'планшет', x: 20, y: 180, w: 170, h: 46 }, { id: 'zg', k: 'person', t: 'Завгар «Шашки»', s: 'кабинет компании', x: 20, y: 260, w: 170, h: 46 },
        { id: 'sys', k: 'sys', t: 'Искра Онлайн', s: 'запись, ремонт, оплата', x: 290, y: 130, w: 190, h: 70 },
        { id: 'yk', k: 'ext', t: 'ЮKassa', x: 580, y: 14, w: 160, h: 40 }, { id: 'at', k: 'ext', t: 'Онлайн-касса АТОЛ', x: 580, y: 80, w: 160, h: 40 }, { id: 'sm', k: 'ext', t: 'SMS-шлюз, push', x: 580, y: 146, w: 160, h: 40 }, { id: 'oc', k: 'ext', t: '1С «Искры»', x: 580, y: 212, w: 160, h: 40 }, { id: 'ym', k: 'ext', t: 'Яндекс Карты', x: 580, y: 278, w: 160, h: 40 }],
      edges: [['cl', 'sys', 'записывается, платит'], ['ms', 'sys'], ['mh', 'sys'], ['zg', 'sys'], ['sys', 'yk', 'платежи'], ['sys', 'at', 'чеки'], ['sys', 'sm'], ['sys', 'oc', 'остатки, бухгалтерия'], ['sys', 'ym']], H: 330 },
    c2: { t: 'C4 · 2. Контейнеры', who: 'Архитектор, тимлид, аналитик, эксплуатация', what: 'Что отдельно запускается и хранит данные: приложения, бэкенд, базы, брокеры — и как они общаются (протоколы).', q: 'Из каких запускаемых частей состоит система? Где хранятся данные? По каким протоколам общаются?',
      nodes: [{ id: 'f', k: 'frame', t: 'Искра Онлайн', x: 8, y: 8, w: 560, h: 312 }, { id: 'ap', k: 'cont', t: 'Приложение клиента', s: 'iOS / Android', x: 24, y: 34, w: 170, h: 44 }, { id: 'st', k: 'cont', t: 'Сайт', s: 'веб', x: 24, y: 96, w: 170, h: 44 }, { id: 'ar', k: 'cont', t: 'АРМ и планшет', s: 'веб-приложения', x: 24, y: 158, w: 170, h: 44 },
        { id: 'be', k: 'cont', t: 'Бэкенд', s: 'API-шлюз и сервисы', x: 240, y: 96, w: 160, h: 60 }, { id: 'db', k: 'db', t: 'PostgreSQL', s: 'данные', x: 430, y: 34, w: 124, h: 50 }, { id: 'mq', k: 'db', t: 'Брокер', s: 'события', x: 430, y: 130, w: 124, h: 50 }, { id: 'fs', k: 'db', t: 'Хранилище фото', s: 'S3', x: 430, y: 226, w: 124, h: 50 },
        { id: 'ex', k: 'ext', t: 'Внешние системы', s: 'ЮKassa, АТОЛ, SMSC, 1С', x: 590, y: 120, w: 160, h: 60 }],
      edges: [['ap', 'be', 'HTTPS/JSON'], ['st', 'be'], ['ar', 'be'], ['be', 'db', 'SQL'], ['be', 'mq', 'AMQP'], ['be', 'fs', 'S3'], ['be', 'ex', 'HTTPS']], H: 330 },
    c3: { t: 'C4 · 3. Компоненты', who: 'Разработчики и аналитик конкретной части', what: 'Что внутри одного контейнера: крупные блоки кода с обязанностями и связями. Почти то же, что UML-диаграмма компонентов.', q: 'Какой блок отвечает за правило? Куда положить новую функцию? Что заденет изменение?',
      nodes: [{ id: 'f', k: 'frame', t: 'Бэкенд (контейнер)', x: 8, y: 8, w: 560, h: 312 }, { id: 'gw', k: 'comp', t: 'API-шлюз', x: 24, y: 136, w: 130, h: 44 }, { id: 'bk', k: 'comp', t: 'Сервис записи', x: 200, y: 30, w: 160, h: 40 }, { id: 'wo', k: 'comp', t: 'Сервис заказ-нарядов', x: 200, y: 92, w: 160, h: 40 }, { id: 'py', k: 'comp', t: 'Платёжный сервис', x: 200, y: 154, w: 160, h: 40 }, { id: 'nt', k: 'comp', t: 'Сервис уведомлений', x: 200, y: 216, w: 160, h: 40 }, { id: 'ic', k: 'comp', t: 'Интеграция с 1С', x: 200, y: 270, w: 160, h: 40 },
        { id: 'db', k: 'db', t: 'PostgreSQL', x: 420, y: 60, w: 130, h: 46 }, { id: 'mq', k: 'db', t: 'Брокер', x: 420, y: 200, w: 130, h: 46 }, { id: 'yk', k: 'ext', t: 'ЮKassa', x: 600, y: 150, w: 140, h: 44 }],
      edges: [['gw', 'bk'], ['gw', 'wo'], ['gw', 'py'], ['bk', 'db'], ['wo', 'db'], ['py', 'yk', 'API v3'], ['py', 'mq', '', 1], ['mq', 'nt', '', 1]], H: 330 },
    dep: { t: 'Развёртывание (UML deployment)', who: 'Эксплуатация (DevOps), архитектор, безопасность', what: 'Где физически всё работает: серверы и облачные узлы, сети, сколько копий, где база и её реплика, где резервные копии. Артефакты (запускаемые сборки) размещены на узлах.', q: 'Сколько серверов? Где хранятся данные (152-ФЗ — в России)? Что будет, если упадёт один сервер?',
      nodes: [{ id: 'cl', k: 'node', t: 'Облако в России (Москва)', x: 12, y: 24, w: 520, h: 296 }, { id: 'k1', k: 'art', t: 'бэкенд × 2 копии', s: 'артефакт: контейнеры сервисов', x: 30, y: 60, w: 220, h: 44 }, { id: 'lb', k: 'art', t: 'Балансировщик', s: 'HTTPS', x: 30, y: 150, w: 220, h: 44 }, { id: 'pg', k: 'db', t: 'PostgreSQL', s: 'основная + реплика', x: 290, y: 60, w: 220, h: 50 }, { id: 'bk', k: 'db', t: 'Резервные копии', s: 'каждые 15 мин, RPO ≤ 15 мин', x: 290, y: 150, w: 220, h: 50 }, { id: 'ob', k: 'db', t: 'Объектное хранилище', s: 'фото, 6 месяцев', x: 290, y: 240, w: 220, h: 50 },
        { id: 'ph', k: 'person', t: 'Телефоны клиентов', s: 'App Store, Google Play', x: 560, y: 60, w: 186, h: 46 }, { id: 'pc', k: 'person', t: 'Компьютеры станций', s: 'браузер', x: 560, y: 150, w: 186, h: 46 }],
      edges: [['ph', 'lb', 'HTTPS'], ['pc', 'lb'], ['lb', 'k1'], ['k1', 'pg'], ['pg', 'bk', '', 1], ['k1', 'ob']], H: 330 }
  };
  const howC4 = {
    id: 'how-comp-c4', covers: ['c4'], title: 'Как это работает: C4, диаграмма развёртывания и UML-компоненты', free: true, noReset: true,
    simple: {
      icon: '🔭',
      plain: 'Одну систему рисуют с разной высоты. Издалека — одна коробка и её соседи (контекст). Ближе — из каких запускаемых частей она состоит (контейнеры). Ещё ближе — что внутри одной части (компоненты). А диаграмма развёртывания показывает не устройство, а где всё физически работает.',
      analogy: 'Карты Яндекса: страна — город — район — дом. Каждый масштаб — для своего вопроса. Схема квартиры не поможет выбрать маршрут до Казани, а карта России — найти розетку.',
      tech: '<b>Модель C4</b> (Саймон Браун): Context, Containers, Components, Code — четыре уровня масштаба с простой нотацией «коробки и стрелки». <b>UML component diagram</b> — логическое устройство с интерфейсами (UML 2.5, 11.6). <b>UML deployment diagram</b> — узлы (серверы, облако, устройства) и размещённые на них артефакты (UML 2.5, 19).'
    },
    render(el) {
      el.classList.add('mcp-root');
      let cur = 'c1';
      el.innerHTML = `<div class="stack">
        ${ui.seg('v', Object.keys(VIEWS).map(k => ({ v: k, t: VIEWS[k].t })), cur, 'accent')}
        <div data-card></div>
        <div data-dg></div>
        ${ui.table(['', 'UML компонентов', 'C4', 'UML развёртывания'], [
          ['Отвечает на вопрос', 'Из каких частей состоит система и через какие интерфейсы они связаны', 'Как система выглядит с разной высоты — от контекста до кода', 'Где всё физически работает'],
          ['Элементы', 'Компоненты, интерфейсы (леденец/гнездо), порты, зависимости', 'Люди, система, контейнеры, компоненты; простые коробки и подписанные стрелки', 'Узлы (серверы, облако, устройства), артефакты, каналы связи'],
          ['Для кого', 'Архитектор, разработчики, аналитик', 'Все: от заказчика (контекст) до разработчиков (компоненты)', 'Эксплуатация, безопасность, архитектор'],
          ['В «Искре»', 'Карта сервисов: запись, ЗН, платежи, уведомления, 1С', 'Контекст для Тимура, контейнеры для Глеба', 'Облако в Москве, 2 копии бэкенда, реплика базы — 152-ФЗ, RPO/RTO']
        ])}
        ${ui.note('warn', 'Типичные ошибки', '<ul class="checks"><li class="bad">Показывают заказчику диаграмму компонентов с интерфейсами — ему нужен контекст.</li><li class="bad">Рисуют серверы на диаграмме компонентов: «Платёжный сервис на app-02». Это развёртывание, у него своя диаграмма.</li><li class="bad">Путают C4-«контейнер» с Docker-контейнером. В C4 контейнер — любая отдельно запускаемая часть: приложение на телефоне, база данных, веб-сайт.</li></ul>')}
        <details class="more"><summary>Как об этом спрашивают на собеседовании</summary><div>
          <p><b>«Чем диаграмма компонентов отличается от диаграммы развёртывания?»</b> Компоненты — логическое устройство: части и их интерфейсы. Развёртывание — физика: на каких узлах запущены артефакты, сколько копий, какие сети. Один компонент может работать на трёх серверах, а на одном сервере — несколько компонентов.</p>
          <p><b>«Что такое C4?»</b> Четыре уровня: контекст (система и её окружение), контейнеры (запускаемые части), компоненты (блоки внутри контейнера), код. Аналитик чаще всего рисует первые два и читает третий.</p>
        </div></details>
      </div>`;
      function draw() {
        const v = VIEWS[cur];
        TR.$('[data-card]', el).innerHTML = `<div class="card flat"><h4>${esc(v.t)}</h4><div class="mcp-def"><span class="k">Что показывает</span><div class="v">${v.what}</div><span class="k">Для кого</span><div class="v">${v.who}</div><span class="k">Отвечает на</span><div class="v">${v.q}</div></div></div>`;
        TR.$('[data-dg]', el).innerHTML = mini(v.nodes, v.edges, 760, v.H);
      }
      ui.onSeg(el, (n, v) => { if (n === 'v') { cur = v; draw(); } });
      draw();
    }
  };

  // =====================================================================
  // Практика 1. Своё, внешнее или не компонент
  // =====================================================================
  const OWN = [
    { id: 'w1', t: 'Сервис записи', b: 'own', why: 'Наш сервис: слоты, запись, отмена, неявки (BR-1…BR-4).' },
    { id: 'w2', t: 'Платёжный сервис', b: 'own', why: 'Наш: создаёт платежи в ЮKassa, принимает вебхуки, отправляет чеки.' },
    { id: 'w3', t: 'API-шлюз', b: 'own', why: 'Наш компонент: единая точка входа, проверка токена, маршрутизация.' },
    { id: 'w4', t: 'Брокер сообщений', b: 'own', why: 'Программу брокера написали не мы, но мы его разворачиваем, настраиваем и отвечаем за него — он внутри границы системы.' },
    { id: 'w5', t: 'Хранилище фото', b: 'own', alt: 'ext', why: 'Хранилище арендуем в облаке, но данные и правила (6 месяцев, до 10 МБ) — наши, и оно внутри границы. Облачный провайдер — вопрос развёртывания.' },
    { id: 'w6', t: 'Сервис уведомлений', b: 'own', why: 'Наш: решает, что, кому и каким каналом отправить.' },
    { id: 'w7', t: 'ЮKassa', b: 'ext', why: 'Внешний платёжный провайдер: мы пользуемся его API и даём ему адрес для вебхуков.' },
    { id: 'w8', t: 'АТОЛ Онлайн', b: 'ext', why: 'Внешняя онлайн-касса: регистрирует чеки по 54-ФЗ.' },
    { id: 'w9', t: 'SMSC', b: 'ext', why: 'Внешний SMS-шлюз.' },
    { id: 'w10', t: 'Firebase Cloud Messaging и APNs', b: 'ext', why: 'Внешние push-сервисы Google и Apple — без них push на телефон не доставить.' },
    { id: 'w11', t: '1С «Искры»', b: 'ext', why: 'Ловушка: 1С принадлежит заказчику, но не входит в «Искру Онлайн». Её дорабатывает другой подрядчик и обновляет по своему графику — для нас она внешняя.' },
    { id: 'w12', t: 'Яндекс Карты', b: 'ext', why: 'Внешний сервис карт для адресов станций.' },
    { id: 'w13', t: 'Марина Олеговна, мастер-приёмщик', b: 'not', why: 'Человек — пользователь (актор), а не компонент. На C4-контексте она есть, на диаграмме компонентов — нет.' },
    { id: 'w14', t: 'Таблица booking', b: 'not', why: 'Таблица — часть данных внутри базы. Это уровень модели данных (ERD), а не компонентов.' },
    { id: 'w15', t: 'Сервер app-02 в облаке', b: 'not', why: 'Узел развёртывания — его место на диаграмме развёртывания.' },
    { id: 'w16', t: 'Правило BR-3 «отмена за 3 часа»', b: 'not', why: 'Требование, а не часть системы. Его реализует сервис записи.' }
  ];
  const OWN_B = [{ id: 'own', t: 'Наш компонент', sub: 'внутри границы «Искры Онлайн»' }, { id: 'ext', t: 'Внешняя система', sub: 'чужая, используем интерфейс' }, { id: 'not', t: 'Не компонент', sub: 'человек, данные, сервер, правило' }];
  function ownEval(ans) {
    const v = (ans && ans.v) || {};
    let s = 0; const per = {};
    OWN.forEach(x => { const g = v[x.id]; const k = g === x.b ? 'ok' : (x.alt && g === x.alt) ? 'warn' : g ? 'bad' : 'miss'; per[x.id] = k; s += k === 'ok' ? 1 : k === 'warn' ? 0.5 : 0; });
    const score = Math.round(s / OWN.length * 1000) / 1000;
    return { per, score, ok: score >= 0.8 && per.w11 === 'ok' };
  }
  const ownTask = {
    id: 'own', title: 'Своё, внешнее или вообще не компонент',
    simple: howBasics.simple,
    lead: ui.brief({
      situation: 'Перед архитектурным комитетом Глеб выписал на доску всё, что прозвучало на созвонах: «Давай разберёмся, что из этого наши компоненты, что чужие системы, а что сюда вообще не относится. На комитете Тимур Рашидович обязательно спросит, за что мы отвечаем».',
      todo: ['Разложите 16 карточек по трём корзинам.', 'Нажмите «Проверить». Засчитывается от 80 %, если 1С разложена верно.'],
      look: 'Наш компонент — то, что мы разрабатываем, разворачиваем или настраиваем и за что отвечаем. Внешняя система — то, что меняет и чинит кто-то другой. Люди, таблицы, серверы и правила — другие уровни модели.'
    }),
    blank: () => ({ v: {} }),
    reference: () => ({ v: Object.fromEntries(OWN.map(x => [x.id, x.b])) }),
    render(el, ctx) {
      el.classList.add('mcp-root');
      const a = ctx.ans; a.v = a.v || {};
      const ev = ctx.result ? ownEval(a) : null;
      const rv = {};
      if (ev) OWN.forEach(x => { if (a.v[x.id]) rv[x.id] = ev.per[x.id]; });
      const box = document.createElement('div'); el.appendChild(box);
      ui.sort(box, { items: OWN.map(x => ({ id: x.id, t: x.t })), buckets: OWN_B, value: a.v, readonly: ctx.readonly, reveal: ev ? rv : null, seed: 'mcp-own', onChange: v => { a.v = v; ctx.save(); } });
    },
    check(ans) {
      const r = ownEval(ans), notes = [], v = (ans && ans.v) || {};
      const miss = OWN.filter(x => r.per[x.id] === 'miss');
      if (miss.length) notes.push({ ok: false, html: `Не разложено: ${miss.length} из ${OWN.length}.` });
      OWN.forEach(x => {
        if (r.per[x.id] === 'bad') notes.push({ ok: false, html: `«${esc(x.t)}» — ${OWN_B.find(b => b.id === x.b).t.toLowerCase()}. ${x.why}` });
        if (r.per[x.id] === 'warn') notes.push({ ok: 'warn', html: `«${esc(x.t)}»: можно спорить, но лучше считать нашим. ${x.why}` });
      });
      if (r.per.w11 === 'ok') notes.push({ ok: true, html: '1С — внешняя, хотя и принадлежит заказчику: её график обновлений и сбои от нас не зависят.' });
      if (!miss.length && r.score === 1) notes.push({ ok: true, html: 'Всё разложено верно: граница системы проведена правильно.' });
      return { ok: r.ok, score: r.score, notes, summary: `Верно: ${pct(r.score)}${v.w11 && r.per.w11 !== 'ok' ? ', 1С — неверно' : ''}.`,
        mentor: r.ok ? null : 'Для каждой карточки спросите: «Кто её чинит, если она сломалась в субботу?» Если «Орбита» — наше. Если кто-то другой — внешнее. Если вопрос не имеет смысла — это не компонент.' };
    },
    explain: `<p>Граница системы — первое, что проводят на диаграмме компонентов. Внутри — то, за что отвечает «Орбита»: сервисы, шлюз, брокер, хранилище, база. Снаружи — внешние системы: их интерфейсы, лимиты и графики работ — предмет договорённостей и нефункциональных требований («что делаем, если ЮKassa недоступна»). Самая частая ловушка — системы заказчика: 1С «Искры» своя для бизнеса, но чужая для нас.</p>
      <p>Люди, таблицы, серверы и правила — тоже элементы модели, но другого уровня: люди — на контексте C4 и в вариантах использования, таблицы — на ERD, серверы — на диаграмме развёртывания, правила — в требованиях. Смешивать уровни на одной картинке — главная причина, по которой диаграммы перестают читать. Источник: UML 2.5, 11.6; Саймон Браун, «Модель C4».</p>`,
    refNote: 'Хранилище фото, отнесённое к внешним, засчитывается наполовину.',
    report: ans => `- Верно: ${pct(ownEval(ans).score)}`
  };

  // =====================================================================
  // Практика 2. Конструктор связей: кто через какой интерфейс
  // =====================================================================
  const IF = [
    { v: 'api', t: 'REST API «Искры»', p: 'gw' }, { v: 'book', t: 'IBooking', p: 'book' }, { v: 'wo', t: 'IWorkOrders', p: 'wo' }, { v: 'pay', t: 'IPayments', p: 'pay' },
    { v: 'hook', t: 'Вебхук /webhooks/yookassa', p: 'pay' }, { v: 'stock', t: 'IStock — остатки и резервы', p: 'int' }, { v: 'ev', t: 'События (публикация и подписка)', p: 'mq' },
    { v: 'sql', t: 'SQL', p: 'db' }, { v: 's3', t: 'S3 API', p: 'files' }, { v: 'yk', t: 'ЮKassa API v3', p: 'yk' }, { v: 'atol', t: 'АТОЛ Онлайн API', p: 'atol' },
    { v: 'sms', t: 'SMSC HTTP API', p: 'sms' }, { v: 'push', t: 'FCM / APNs', p: 'push' }, { v: '1c', t: 'HTTP-сервис 1С', p: '1c' }
  ];
  const LR = [
    { id: 'r1', c: 'app', t: 'Записаться, оплатить, согласовать доп. работы', a: 'api', bad: { book: 'Приложение в обход шлюза: проверку входа и ограничение частоты запросов пришлось бы делать в каждом сервисе, а внутренние адреса — открыть в интернет.' } },
    { id: 'r2', c: 'gw', t: 'Передать запрос на запись', a: 'book' },
    { id: 'r3', c: 'pay', t: 'Создать платёж', a: 'yk' },
    { id: 'r4', c: 'yk', t: 'Сообщить о результате оплаты', a: 'hook', bad: { yk: 'ЮKassa не вызывает сама себя. Уведомление она шлёт на наш адрес — этот интерфейс предоставляет платёжный сервис, и за него отвечаем мы: адрес, проверка подлинности, повторы.', pay: 'IPayments — внутренний интерфейс для наших клиентов. ЮKassa вызывает отдельный вход — вебхук, у него свои правила безопасности.' } },
    { id: 'r5', c: 'pay', t: 'Зарегистрировать чек по 54-ФЗ', a: 'atol' },
    { id: 'r6', c: 'wo', t: 'Сообщить «заказ-наряд готов»', a: 'ev', bad: { sms: 'Сервис заказ-нарядов не должен знать про SMS: это забота сервиса уведомлений. Иначе каждое новое уведомление — правка в ЗН.' } },
    { id: 'r7', c: 'ntf', t: 'Узнать, что заказ-наряд готов', a: 'ev', bad: { wo: 'Опрашивать сервис заказ-нарядов каждые несколько секунд — лишняя нагрузка и жёсткая связь. Подписка на событие в брокере — и узнаём сразу.' } },
    { id: 'r8', c: 'ntf', t: 'Доставить push на телефон', a: 'push' },
    { id: 'r9', c: 'book', t: 'Проверить остатки запчастей для ТО (BR-12)', a: 'stock', bad: { '1c': 'Напрямую в 1С — и сервис записи станет заложником 1С: её обновляют в выходные, и запись на ТО встанет. Интеграция держит остатки (обновляет каждые 15 минут) и прячет 1С за своим интерфейсом.' } },
    { id: 'r10', c: 'int', t: 'Забрать остатки со склада', a: '1c' },
    { id: 'r11', c: 'wo', t: 'Сохранить фото проблемы (до 10 МБ)', a: 's3', bad: { sql: 'Фото по 10 МБ в базе раздувают её и резервные копии: копия каждые 15 минут (RPO) станет тяжёлой. Файлы — в объектное хранилище, в базе — только ссылка.' } }
  ];
  function linksEval(ans) {
    const v = (ans && ans.v) || {};
    const per = LR.map(r => ({ r, g: v[r.id], s: v[r.id] ? (v[r.id] === r.a ? 'ok' : 'bad') : 'miss' }));
    const good = per.filter(p => p.s === 'ok').length;
    const score = Math.round(good / LR.length * 1000) / 1000;
    return { per, good, score, ok: score >= 0.8 && v.r4 === 'hook' && v.r9 === 'stock' };
  }
  const linksTask = {
    id: 'links', title: 'Конструктор связей: кто через какой интерфейс',
    lead: ui.brief({
      situation: 'Глеб: «Компоненты есть, а связей на схеме нет. Для каждой потребности выбери интерфейс, через который компонент её закроет. Диаграмма будет собираться у тебя на глазах — леденец в гнездо». Слева в строке — кому нужно, по центру — что нужно.',
      todo: [
        'Для каждой из 11 потребностей выберите интерфейс. Связь сразу появится на диаграмме: гнездо у того, кому нужно, леденец у того, кто предоставляет.',
        'Нажмите «Проверить». Засчитывается от 80 %, если вебхук ЮKassa и проверка остатков для ТО собраны верно.'
      ],
      look: 'Интерфейс предоставляет тот, кто умеет. Внешняя система тоже может вызывать нас — тогда интерфейс наш. Сервисы не ходят во внешние системы друг друга: для 1С есть интеграция, для уведомлений — брокер.'
    }),
    blank: () => ({ v: {} }),
    reference: () => ({ v: Object.fromEntries(LR.map(r => [r.id, r.a])) }),
    render(el, ctx) {
      el.classList.add('mcp-root');
      const a = ctx.ans; a.v = a.v || {};
      const ev = ctx.result ? linksEval(a) : null;
      el.innerHTML = `<div class="stack"><div data-dg></div><div class="mcp-rows" data-rows></div></div>`;
      function dg() {
        const edges = LR.filter(r => a.v[r.id]).map(r => {
          const f = IF.find(i => i.v === a.v[r.id]);
          const p = ev ? ev.per.find(x => x.r.id === r.id) : null;
          const base = DEPS.find(d => d.c === r.c && d.p === f.p) || {};
          return { c: r.c, p: f.p, i: f.t, lab: f.t.split(' ')[0], k: p ? (p.s === 'ok' ? 'ok' : 'bad') : 'accent', oy: base.oy, oy1: base.oy1 };
        }).filter(e => e.c !== e.p);
        TR.$('[data-dg]', el).innerHTML = compSVG({ edges, asm: true, title: 'Связи компонентов' });
      }
      TR.$('[data-rows]', el).innerHTML = LR.map(r => {
        const p = ev && ev.per.find(x => x.r.id === r.id);
        const why = p && p.s === 'bad' ? `<div class="why">${(r.bad && r.bad[p.g]) || `Нужно: ${esc(IF.find(i => i.v === r.a).t)} (${esc(CPB(IF.find(i => i.v === r.a).p).t)}).`}</div>` : '';
        return `<div class="mcp-row ${p && p.s !== 'miss' ? p.s : ''}"><span class="who">${esc(CPB(r.c).t)}</span><span>${esc(r.t)}</span>
          <select data-r="${r.id}" aria-label="Интерфейс: ${esc(r.t)}" ${ctx.readonly ? 'disabled' : ''}><option value="">Через интерфейс…</option>${IF.filter(i => i.p !== r.c).map(i => `<option value="${i.v}" ${a.v[r.id] === i.v ? 'selected' : ''}>${esc(i.t)} — ${esc(CPB(i.p).t)}</option>`).join('')}</select>${why}</div>`;
      }).join('');
      TR.on(el, 'change', 'select[data-r]', (e, s) => { if (ctx.readonly) return; if (s.value) a.v[s.dataset.r] = s.value; else delete a.v[s.dataset.r]; ctx.save(); dg(); });
      dg();
    },
    check(ans) {
      const r = linksEval(ans), notes = [];
      const miss = r.per.filter(p => p.s === 'miss').length;
      if (miss) notes.push({ ok: false, html: `Без интерфейса: ${miss} из ${LR.length}.` });
      r.per.filter(p => p.s === 'bad').forEach(p => notes.push({ ok: false, html: `${esc(CPB(p.r.c).t)} — «${esc(p.r.t)}»: ${(p.r.bad && p.r.bad[p.g]) || `нужен ${esc(IF.find(i => i.v === p.r.a).t)}.`}` }));
      const v = (ans && ans.v) || {};
      if (v.r4 === 'hook') notes.push({ ok: true, html: 'Вебхук: ЮKassa требует интерфейс, который предоставляем мы. Направление зависимости — от ЮKassa к нам.' });
      if (v.r9 === 'stock') notes.push({ ok: true, html: 'Остатки — через интеграцию: сервис записи не зависит от графика обновлений 1С.' });
      return { ok: r.ok, score: r.score, notes, summary: `Связей собрано верно: ${r.good} из ${LR.length}.`,
        mentor: r.ok ? null : 'Посмотрите на диаграмму: к каким компонентам тянется больше всего гнёзд? Если к внешней системе тянутся три наших сервиса — что-то не так.' };
    },
    explain: `<p>Связи на диаграмме компонентов — это не «кто кому шлёт данные», а «кто от кого зависит и через какой контракт». Отсюда два неочевидных места. <b>Вебхук</b>: зависимость идёт от ЮKassa к нам — интерфейс наш, и требования к нему пишем мы (адрес, проверка подлинности, идемпотентность). <b>1С</b>: только интеграция знает, как разговаривать с 1С; остальные видят IStock. Если 1С заменят или обновят, правки — в одном компоненте.</p>
      <p>Брокер развязывает сервисы: заказ-наряды публикуют событие «готов» и не знают, кто его слушает — сегодня уведомления, завтра бонусы или аналитика Кирилла. Фото — в объектное хранилище, а не в базу: нефункциональные требования (RPO 15 минут, 6 месяцев хранения) влияют на архитектуру. Источники: UML 2.5, 11.6 (assembly connector); Ньюман «Создание микросервисов» (границы сервисов).</p>`,
    refNote: 'Засчитываются только интерфейсы из эталона; варианты с пояснением ловушек — частые ошибки.',
    report: ans => { const r = linksEval(ans); return `- Связей верно: ${r.good}/${LR.length}`; }
  };

  // =====================================================================
  // Практика 3. Лаборатория: анализ влияния отказа
  // =====================================================================
  const FN = [
    { id: 'f1', t: 'Онлайн-запись в приложении и на сайте' },
    { id: 'f2', t: 'Запись на ТО с резервом запчастей (BR-12)' },
    { id: 'f3', t: 'Оплата в приложении картой или по СБП' },
    { id: 'f4', t: 'Оплата на кассе станции' },
    { id: 'f5', t: 'Push и SMS «Машина готова» (BR-13)' },
    { id: 'f6', t: 'Согласование доп. работ в приложении' },
    { id: 'f7', t: 'Выгрузка оплат и заказ-нарядов в 1С' }
  ];
  const ST = [{ v: 'down', t: 'Не работает' }, { v: 'lim', t: 'С ограничениями' }, { v: 'ok', t: 'Как обычно' }];
  const SC = [
    { id: 'yk', t: 'ЮKassa недоступна', when: 'суббота, 12:00–12:40', fail: 'yk',
      ref: { f1: ['lim', 'ok'], f2: ['ok'], f3: ['down'], f4: ['ok'], f5: ['ok'], f6: ['ok'], f7: ['ok'] },
      why: { f1: 'Запись работает, но клиенты с двумя неявками не смогут внести предоплату 500 ₽ (BR-4) — для них ограничение.', f2: 'Резерв запчастей не связан с ЮKassa.', f3: 'Платёжный сервис не может создать платёж — показываем «оплатите на кассе станции» и не даём нажимать «Оплатить» по кругу.', f4: 'Касса станции работает через банковский терминал, не через ЮKassa.', f5: 'Уведомления идут через брокер и push/SMS — ЮKassa ни при чём.', f6: 'Согласование — сервис заказ-нарядов, оплаты не требует.', f7: 'Выгрузка просто отдаст меньше онлайн-оплат.' },
      act: 'Записать в требования: при ошибке ЮKassa — сообщение «оплата временно недоступна, оплатите на кассе», платёж не создаём повторно без клиента, инцидент — дежурному.' },
    { id: '1c', t: '1С обновляют', when: 'суббота 20:00 — воскресенье 08:00', fail: '1c',
      ref: { f1: ['ok'], f2: ['lim'], f3: ['ok'], f4: ['ok'], f5: ['ok'], f6: ['ok'], f7: ['lim', 'down'] },
      why: { f1: 'Запись без запчастей от 1С не зависит.', f2: 'Остатки — с последней синхронизации, резерв в 1С ставится в очередь и создастся после обновления. Риск: запчасть могут продать — но склад ночью закрыт.', f3: 'Оплата не ходит в 1С: выгрузка в бухгалтерию — отдельно и позже.', f4: 'Касса станции не зависит от 1С; к тому же ночью станции закрыты.', f5: 'Уведомления не зависят от 1С.', f6: 'Доп. работы не ждут 1С (цены — копия в строке заказ-наряда).', f7: 'Выгрузка остановится и догонит пакетом в воскресенье утром — Ольга Викторовна увидит данные с задержкой.' },
      act: 'Договориться с подрядчиком 1С об окне работ и уведомлении за сутки; в интеграции — очередь и повтор после окна; в НФТ — «отказ 1С не блокирует запись и оплату».' },
    { id: 'mq', t: 'Брокер сообщений упал', when: 'понедельник, 09:10 — пик записи', fail: 'mq',
      ref: { f1: ['lim'], f2: ['lim'], f3: ['lim'], f4: ['ok'], f5: ['down'], f6: ['lim'], f7: ['ok'] },
      why: { f1: 'Запись создаётся, но подтверждение push не уходит: события «запись создана» не доходят до уведомлений. Если сервис записи не умеет откладывать события — может упасть и сама запись.', f2: 'Как и запись: резерв делается, подтверждения нет.', f3: 'Оплата и чек проходят (они без брокера), но push «оплата прошла» не придёт.', f4: 'Оплата на кассе идёт через АРМ и заказ-наряд, уведомление не нужно.', f5: 'Сервис уведомлений не получает событий — «Машина готова» не приходит. Клиенты звонят, Марина Олеговна обзванивает вручную.', f6: 'Предложение создаётся, но push клиенту не уходит — через 20 минут мастер звонит (BR-8).', f7: 'Интеграция читает данные из базы, брокер ей не нужен.' },
      act: 'Брокер — единая точка отказа для уведомлений: нужна копия брокера и «исходящий ящик» в сервисах (событие сохраняется в базе и отправляется, когда брокер поднимется).' }
  ];
  function impEval(ans) {
    const v = (ans && ans.v) || {};
    let tot = 0, got = 0; const per = {};
    SC.forEach(sc => FN.forEach(f => {
      tot++;
      const g = v[sc.id + ':' + f.id], acc = sc.ref[f.id];
      const k = !g ? 'miss' : g === acc[0] ? 'ok' : acc.includes(g) ? 'warn' : 'bad';
      per[sc.id + ':' + f.id] = k; got += k === 'ok' ? 1 : k === 'warn' ? 0.75 : 0;
    }));
    const score = Math.round(got / tot * 1000) / 1000;
    const key = per['yk:f3'] === 'ok' && per['mq:f5'] === 'ok' && per['1c:f3'] === 'ok';
    return { per, score, key, ok: score >= 0.8 && key };
  }
  function impState(failId) {
    const st = { [failId]: 'bad' };
    DEPS.filter(d => d.p === failId).forEach(d => { st[d.c] = d.a ? 'warn' : 'bad'; });
    return st;
  }
  const impactTask = {
    id: 'impact', title: 'Лаборатория: что сломается, если упадёт…',
    simple: howRead.simple,
    lead: ui.brief({
      situation: 'Тимур Рашидович на комитете: «Вы говорите — внешние системы. А если ЮKassa ляжет? А 1С наш подрядчик обновляет по выходным — что, запись встанет?» Глеб добавляет третий вопрос от себя: «А если упадёт наш брокер в понедельник в 09:10?» Ответить надо по каждой функции.',
      todo: [
        'Нажмите на упавший сервис на диаграмме (ЮKassa, 1С или брокер) или выберите сценарий кнопкой.',
        'Для каждой из 7 функций выберите: не работает, работает с ограничениями, как обычно. Всего 21 ответ.',
        'Нажмите «Проверить». Засчитывается от 80 %, если верно: оплата в приложении при отказе ЮKassa, «Машина готова» при отказе брокера, оплата при обновлении 1С. После проверки диаграмма покажет, кого задевает отказ.'
      ],
      look: 'Ищите стрелки к упавшему компоненту. Прямая синхронная зависимость — функция встаёт. Через брокер или очередь — откладывается. Нет пути — не затронута. Помните про расписание: ночью станции закрыты.'
    }),
    blank: () => ({ sc: 'yk', v: {} }),
    reference: () => { const v = {}; SC.forEach(sc => FN.forEach(f => { v[sc.id + ':' + f.id] = sc.ref[f.id][0]; })); return { sc: 'yk', v }; },
    render(el, ctx) {
      el.classList.add('mcp-root');
      const a = ctx.ans; a.v = a.v || {}; a.sc = a.sc || 'yk';
      const ev = ctx.result ? impEval(a) : null;
      el.innerHTML = `<div class="stack">
        <div class="row" data-scs></div>
        <div data-dg></div>
        <div data-head></div>
        <div class="stack tight" data-fns></div>
        <div data-act></div>
      </div>`;
      function draw() {
        const sc = SC.find(s => s.id === a.sc);
        TR.$('[data-scs]', el).innerHTML = SC.map(s => {
          const done = FN.filter(f => a.v[s.id + ':' + f.id]).length;
          return `<button type="button" class="mcp-opt" data-sc="${s.id}" aria-pressed="${a.sc === s.id}">💥 ${esc(s.t)} <span class="small dim">${done}/${FN.length}</span></button>`;
        }).join('');
        const showImp = !!ev || ctx.readonly;
        const state = showImp ? impState(sc.fail) : { [sc.fail]: 'bad' };
        const edges = DEPS.map(d => Object.assign({}, d, { k: showImp && d.p === sc.fail ? (d.a ? 'warn' : 'bad') : '' }));
        TR.$('[data-dg]', el).innerHTML = compSVG({ edges, state, fail: sc.fail, click: true, sel: sc.fail, title: 'Отказ: ' + sc.t });
        TR.$('[data-head]', el).innerHTML = `<div class="small"><b>${esc(sc.t)}</b> · ${esc(sc.when)}${showImp ? '' : ' · <span class="dim">кого задевает — покажу после проверки</span>'}</div>`;
        TR.$('[data-fns]', el).innerHTML = FN.map(f => {
          const key = sc.id + ':' + f.id, g = a.v[key], k = ev ? ev.per[key] : '';
          const why = ev && g && k !== 'ok' ? `<div class="why">${sc.why[f.id]}</div>` : ev && k === 'ok' ? `<div class="why">${sc.why[f.id]}</div>` : ctx.readonly ? `<div class="why">${sc.why[f.id]}</div>` : '';
          return `<div class="mcp-fn ${k && k !== 'miss' ? k : ''}"><span>${esc(f.t)}</span><div class="seg" role="group" aria-label="${esc(f.t)}">${ST.map(s => `<button type="button" data-f="${f.id}" data-v="${s.v}" aria-pressed="${g === s.v}" ${ctx.readonly ? 'disabled' : ''}>${s.t}</button>`).join('')}</div>${why}</div>`;
        }).join('');
        TR.$('[data-act]', el).innerHTML = showImp ? ui.note('', 'Что записать в требования', sc.act) : '';
      }
      TR.on(el, 'click', '[data-sc]', (e, b) => { a.sc = b.dataset.sc; ctx.save(); draw(); });
      TR.on(el, 'click', '.mcp-hit', (e, g) => { const s = SC.find(x => x.fail === g.dataset.c); if (s) { a.sc = s.id; ctx.save(); draw(); } else TR.ui.toast && TR.ui.toast('Этот сценарий не разбираем — выберите ЮKassa, 1С или брокер'); });
      TR.on(el, 'click', '[data-f]', (e, b) => { if (ctx.readonly) return; a.v[a.sc + ':' + b.dataset.f] = b.dataset.v; ctx.save(); draw(); });
      draw();
    },
    check(ans) {
      const r = impEval(ans), notes = [];
      SC.forEach(sc => {
        const bad = FN.filter(f => r.per[sc.id + ':' + f.id] === 'bad'), miss = FN.filter(f => r.per[sc.id + ':' + f.id] === 'miss');
        if (!bad.length && !miss.length) notes.push({ ok: true, html: `«${esc(sc.t)}»: все функции оценены верно.` });
        if (miss.length) notes.push({ ok: false, html: `«${esc(sc.t)}»: не оценено функций — ${miss.length}.` });
        bad.forEach(f => notes.push({ ok: false, html: `«${esc(sc.t)}» → ${esc(f.t)}: ${ST.find(s => s.v === sc.ref[f.id][0]).t.toLowerCase()}. ${sc.why[f.id]}` }));
      });
      return { ok: r.ok, score: r.score, notes, summary: `Оценено верно: ${pct(r.score)}${r.key ? '' : ', ключевые функции — с ошибкой'}.`,
        mentor: r.ok ? null : 'Не всё, что связано с упавшим сервисом, ломается. Ищите путь: функция → компонент → упавший сервис. Через брокер — откладывается, напрямую — встаёт.' };
    },
    explain: `<p>Анализ влияния — самая частая практическая польза диаграммы компонентов. Алгоритм: найти стрелки к упавшему компоненту, пройти по ним к функциям и для каждой решить — <b>встаёт</b> (прямая синхронная зависимость: оплата без ЮKassa), <b>с ограничениями</b> (работает, но без части возможностей или с задержкой: запись на ТО со старыми остатками, уведомления без брокера) или <b>не затронута</b>.</p>
      <p>Неожиданный вывод третьего сценария: собственный брокер оказался опаснее внешней ЮKassa — от него зависят уведомления по всем процессам, и в понедельник 09:10 его отказ ударит по тысячам людей. Выводы аналитика превращаются в требования: поведение при отказе каждой внешней системы, окна работ 1С, копия брокера и «исходящий ящик». Источник: BABOK, 7.6 «Анализ влияния»; Найгард «Release It!» (единые точки отказа).</p>`,
    refNote: 'Для онлайн-записи при отказе ЮKassa засчитывается и «как обычно» (с небольшим снижением): ограничение касается только клиентов с предоплатой по BR-4. Выгрузка в 1С при обновлении — «с ограничениями» или «не работает».',
    report: ans => { const r = impEval(ans); return `- Анализ влияния: ${pct(r.score)}`; }
  };

  // =====================================================================
  // Практика 4. Куда положить новую функцию
  // =====================================================================
  const OURS = ['app', 'site', 'arm', 'tab', 'gw', 'book', 'wo', 'pay', 'ntf', 'int'];
  const NF = [
    { id: 'n1', t: 'Понять, что бесплатное хранение заканчивается (конец следующего дня после «Готов»), и сообщить об этом событием', a: ['wo'], why: 'Срок считается от статуса «Готов» заказ-наряда — значит, и правило у его владельца. Он публикует событие «хранение заканчивается».', w: { ntf: 'Сервис уведомлений не знает правил хранения — он только доставляет. Иначе каждое изменение BR-13 — правка в уведомлениях.', app: 'Таймер на телефоне не сработает, если приложение удалено или выключено, и правило окажется в двух местах.' } },
    { id: 'n2', t: 'Отправить клиенту push и SMS: «Заберите машину до 21:00 завтра, потом хранение 500 ₽ в сутки»', a: ['ntf'], why: 'Каналы доставки, шаблоны и повторы — у сервиса уведомлений. Он подписан на событие из брокера.', w: { wo: 'Сервис заказ-нарядов не должен знать про SMS и push — это сделает его зависимым от SMS-шлюза.' } },
    { id: 'n3', t: 'Начислять 500 ₽ за каждые сутки хранения строкой в заказ-наряд', a: ['wo'], why: 'Строки работ и их цены — в заказ-наряде (work_item). Платёжный сервис потом просто возьмёт итог.', w: { pay: 'Платёжный сервис принимает деньги, а состав заказ-наряда — не его ответственность.' } },
    { id: 'n4', t: 'Списать бонусы до 30 % стоимости работ при оплате (BR-11)', a: ['pay'], why: 'Бонусы и их движение (bonus_tx) — платёжный сервис: списание — часть расчёта суммы платежа.', w: { app: 'В приложении — только выбор «списать», расчёт на сервере: иначе его можно подделать.' } },
    { id: 'n5', t: 'Не дать записаться ближе чем за 2 часа до начала (BR-2)', a: ['book'], why: 'Правило проверяет сервис записи: проверку в приложении можно обойти, а сайт и колл-центр тоже записывают.', w: { app: 'В приложении можно только скрыть недоступные слоты как подсказку, но правило обязано жить на сервере.', gw: 'Шлюз проверяет вход и частоту запросов, но не бизнес-правила.' } },
    { id: 'n6', t: 'Автоматически согласовать доп. работы «Шашки» до 3 000 ₽ (BR-9)', a: ['wo'], why: 'Предложения доп. работ и их статусы (approved, decided_by = auto) — сервис заказ-нарядов.' },
    { id: 'n7', t: 'Передать в бухгалтерию 1С оплаты за день', a: ['int'], why: 'Только интеграция разговаривает с 1С: она читает оплаты из базы и выгружает пакетом.', w: { pay: 'Если платёжный сервис будет сам ходить в 1С, оплата станет зависеть от её обновлений по выходным.' } },
    { id: 'n8', t: 'Показать станции на карте при выборе', a: ['app', 'site'], why: 'Карта — на стороне клиента: приложение и сайт сами используют Яндекс Карты, адреса станций уже есть. Бэкенду ничего не нужно.' }
  ];
  function placeEval(ans) {
    const v = (ans && ans.v) || {};
    const per = NF.map(n => ({ n, g: v[n.id], s: !v[n.id] ? 'miss' : n.a.includes(v[n.id]) ? 'ok' : 'bad' }));
    const good = per.filter(p => p.s === 'ok').length;
    const score = Math.round(good / NF.length * 1000) / 1000;
    return { per, good, score, ok: score >= 0.8 };
  }
  const placeTask = {
    id: 'place', title: 'Куда положить новую функцию',
    lead: ui.brief({
      situation: 'После комитета Тимур Рашидович вспомнил про BR-13: «Машина готова — а клиент забирает через три дня. Пусть система напоминает, что с завтра хранение платное, и сама начисляет». Артём принёс ещё несколько функций из бэклога: «Скажи, в какой компонент каждая — я пойму, какой команде отдавать».',
      todo: [
        'Выберите функцию в списке, затем нажмите на компонент на диаграмме — функция «ляжет» в него (номер появится на компоненте). Можно выбрать и в выпадающем списке.',
        'Нажмите «Проверить». Засчитывается от 80 %.'
      ],
      look: 'Функция живёт у владельца данных и правила: кто хранит статус и дату — тот и решает. Доставка сообщений — у уведомлений, разговор с 1С — у интеграции, деньги — у платёжного сервиса. Правила — на сервере, не в приложении.'
    }),
    blank: () => ({ v: {}, pick: 'n1' }),
    reference: () => ({ v: Object.fromEntries(NF.map(n => [n.id, n.a[0]])), pick: 'n1' }),
    render(el, ctx) {
      el.classList.add('mcp-root');
      const a = ctx.ans; a.v = a.v || {}; a.pick = a.pick || 'n1';
      const ev = ctx.result ? placeEval(a) : null;
      el.innerHTML = `<div class="stack"><div data-dg></div><div class="mcp-rows" data-rows></div></div>`;
      function draw() {
        const badges = {};
        NF.forEach((n, i) => {
          const c = a.v[n.id]; if (!c) return;
          const p = ev && ev.per.find(x => x.n.id === n.id);
          (badges[c] = badges[c] || []).push({ n: i + 1, k: p ? (p.s === 'ok' ? 'ok' : 'bad') : (a.pick === n.id ? 'accent' : 'info') });
        });
        TR.$('[data-dg]', el).innerHTML = compSVG({ edges: DEPS, badges, click: !ctx.readonly, title: 'Куда положить функцию' });
        TR.$('[data-rows]', el).innerHTML = NF.map((n, i) => {
          const p = ev && ev.per.find(x => x.n.id === n.id);
          const why = p && p.s !== 'miss' ? `<div class="why">${p.s === 'ok' ? n.why : ((n.w && n.w[p.g]) || 'Не тот владелец.') + ' ' + n.why}</div>` : ctx.readonly ? `<div class="why">${n.why}</div>` : '';
          return `<div class="mcp-row ${p && p.s !== 'miss' ? p.s : ''} ${!ctx.readonly && a.pick === n.id ? 'pick' : ''}"><button type="button" class="mcp-opt" data-pk="${n.id}" aria-pressed="${a.pick === n.id}" ${ctx.readonly ? 'disabled' : ''}>№ ${i + 1}</button><span>${esc(n.t)}</span>
            <select data-n="${n.id}" aria-label="Компонент для функции ${i + 1}" ${ctx.readonly ? 'disabled' : ''}><option value="">Компонент…</option>${OURS.map(c => `<option value="${c}" ${a.v[n.id] === c ? 'selected' : ''}>${esc(CPB(c).t)}</option>`).join('')}</select>${why}</div>`;
        }).join('');
      }
      function put(c) {
        if (ctx.readonly) return;
        if (!OURS.includes(c)) { TR.ui.toast && TR.ui.toast('Внешнюю систему и хранилища мы не дорабатываем — выберите наш компонент'); return; }
        a.v[a.pick] = c; ctx.save();
        const i = NF.findIndex(n => n.id === a.pick), next = NF.slice(i + 1).find(n => !a.v[n.id]);
        if (next) a.pick = next.id;
        draw();
      }
      TR.on(el, 'click', '[data-pk]', (e, b) => { a.pick = b.dataset.pk; ctx.save(); draw(); });
      TR.on(el, 'click', '.mcp-hit', (e, g) => put(g.dataset.c));
      TR.on(el, 'keydown', '.mcp-hit', (e, g) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); put(g.dataset.c); } });
      TR.on(el, 'change', 'select[data-n]', (e, s) => { if (ctx.readonly) return; if (s.value) a.v[s.dataset.n] = s.value; else delete a.v[s.dataset.n]; ctx.save(); draw(); });
      draw();
    },
    check(ans) {
      const r = placeEval(ans), notes = [];
      r.per.forEach((p, i) => {
        if (p.s === 'miss') notes.push({ ok: false, html: `Функция № ${i + 1} не размещена.` });
        else if (p.s === 'bad') notes.push({ ok: false, html: `№ ${i + 1}: не «${esc(CPB(p.g).t)}», а «${esc(CPB(p.n.a[0]).t)}». ${(p.n.w && p.n.w[p.g]) || ''} ${p.n.why}` });
      });
      if (r.per[0].s === 'ok' && r.per[1].s === 'ok') notes.push({ ok: true, html: 'BR-13 разделено правильно: правило хранения — у заказ-нарядов, доставка — у уведомлений, связь — через событие.' });
      return { ok: r.ok, score: r.score, notes, summary: `Размещено верно: ${r.good} из ${NF.length}.`,
        mentor: r.ok ? null : 'Спросите про каждую функцию: «Чьи это данные? Кто уже знает статус и дату?» Функция живёт там, где живут её данные.' };
    },
    explain: `<p>Принцип простой: <b>функция живёт у владельца данных и правила</b>. Срок бесплатного хранения считается от «Готов» — это заказ-наряд; доставка push и SMS — уведомления; деньги и бонусы — платёжный сервис; 1С — только интеграция. BR-13 распалось на две функции в двух компонентах, связанных событием: так правило хранения можно менять, не трогая уведомления, и наоборот.</p>
      <p>Бизнес-правила — на сервере. В приложении — подсказки и удобство (скрыть недоступные слоты), но проверку BR-2 обязан сделать сервис записи: приложение можно обойти, а записывают ещё сайт и колл-центр. Для аналитика это прямая польза: по размещению функций понятно, какие команды и сервисы затронет задача и сколько она будет стоить. Источник: Эванс «Предметно-ориентированное проектирование» (ограниченные контексты); Ньюман «Создание микросервисов».</p>`,
    refNote: 'Карта станций засчитывается и в приложении, и на сайте.',
    report: ans => { const r = placeEval(ans); return `- Размещено верно: ${r.good}/${NF.length}`; }
  };

  // =====================================================================
  // Практика 5. Уровни C4 и ответ Тимуру своими словами
  // =====================================================================
  const C4I = [
    { id: 'c1', t: '«Искра Онлайн» — одна коробка; вокруг — клиенты, мастера, механики, ЮKassa, касса, 1С', b: 'ctx' },
    { id: 'c2', t: 'Для Тимура Рашидовича на комитете: кто пользуется системой и с кем она связана', b: 'ctx' },
    { id: 'c3', t: 'Приложение iOS/Android, сайт, АРМ, бэкенд, PostgreSQL, брокер, хранилище фото — что отдельно запускается', b: 'cont' },
    { id: 'c4', t: 'Протоколы между частями: HTTPS и JSON, SQL, обмен сообщениями через брокер', b: 'cont' },
    { id: 'c5', t: 'Внутри платёжного сервиса: приём платежей, обработчик вебхуков, адаптер ЮKassa, отправка чеков', b: 'comp' },
    { id: 'c6', t: 'Для Глеба перед разработкой оплаты: из каких блоков состоит платёжный сервис и как они связаны', b: 'comp' },
    { id: 'c7', t: 'Две копии бэкенда в облаке в Москве, PostgreSQL с репликой, балансировщик', b: 'dep' },
    { id: 'c8', t: 'Для эксплуатации: где что запущено, какие порты открыты, где резервные копии (152-ФЗ — в России)', b: 'dep' }
  ];
  const C4B = [{ id: 'ctx', t: 'C4: контекст' }, { id: 'cont', t: 'C4: контейнеры' }, { id: 'comp', t: 'C4: компоненты' }, { id: 'dep', t: 'Развёртывание' }];
  const T_RUBRIC = [
    'Объясняет пользу на языке бизнеса: схема показывает, из чего состоит система, что наше, а что чужое (ЮKassa, касса, SMS, 1С)',
    'Отвечает про отказ ЮKassa: перестанет работать только оплата в приложении, клиентам предложат кассу станции; запись, ремонт и уведомления работают',
    'Отвечает про 1С по выходным: запись и оплата не встанут, остатки обновятся и выгрузка догонит после окна работ',
    'Показывает, как схема помогает оценивать изменения: видно, какие части затронет новая функция (например, напоминания о хранении по BR-13), а значит, сроки и стоимость',
    'Говорит коротко и без жаргона; если упоминает термины (интерфейс, брокер), объясняет их'
  ];
  const T_REF = 'Тимур Рашидович, эта схема — карта «Искры Онлайн»: из каких частей она состоит, какие части наши, а какие чужие — ЮKassa, касса АТОЛ, SMS, 1С. По ней мы заранее отвечаем на вопросы «что будет, если…». Если ЮKassa ляжет в субботу, перестанет работать только оплата в приложении: клиент увидит «оплатите на кассе станции», а запись, ремонт, согласование доп. работ и уведомления продолжат работать — они с ЮKassa не связаны. Если 1С обновляют в выходные, запись и оплата не встанут: остатки запчастей возьмём с последнего обновления, резервы поставим в очередь, а выгрузка в бухгалтерию догонит в воскресенье утром — Ольга Викторовна увидит данные чуть позже. Мы нашли и наше слабое место — «почтальон» событий внутри системы: если он упадёт, перестанут приходить уведомления «машина готова», поэтому ставим ему запасную копию. И ещё польза: когда вы придумываете новую функцию, например напоминание о платном хранении, по схеме сразу видно, какие две части её затронут, — значит, мы быстро и честно скажем срок и цену.';
  function c4Eval(ans) {
    const v = (ans && ans.v) || {};
    const good = C4I.filter(x => v[x.id] === x.b).length;
    const sort = good / C4I.length;
    const j = ui.justifyScore(ans && ans.j);
    const score = Math.round((0.6 * sort + 0.4 * j) * 1000) / 1000;
    return { good, sort, j, score, ok: score >= 0.75 && sort >= 0.75 };
  }
  const c4Task = {
    id: 'c4', title: 'Уровни C4 и ответ Тимуру Рашидовичу',
    simple: howC4.simple,
    lead: ui.brief({
      situation: 'Вера готовит пакет схем к комитету: «Каждому — своя высота. Разложи, что на какой схеме окажется». А потом Тимур Рашидович спросит главное: «Зачем мне эти квадратики? Что мне с ними делать?»',
      todo: [
        'Часть 1. Разложите 8 карточек по уровням: C4-контекст, C4-контейнеры, C4-компоненты, развёртывание.',
        'Часть 2. Ответьте Тимуру Рашидовичу своими словами: зачем схема, что будет при отказе ЮKassa и при обновлении 1С, как она помогает с новыми функциями.',
        'Нажмите «Проверить». Засчитывается от 75 %, если уровни разложены хотя бы на 75 % (уровни — 60 %, ответ — 40 %).'
      ],
      look: 'Контекст — система одной коробкой и её соседи. Контейнеры — что отдельно запускается. Компоненты — что внутри одного контейнера. Развёртывание — где всё физически работает. А Тимуру нужен не уровень, а польза: риски и деньги.'
    }),
    blank: () => ({ v: {}, j: {} }),
    reference: () => ({ v: Object.fromEntries(C4I.map(x => [x.id, x.b])), j: { text: T_REF, self: T_RUBRIC.map(() => true) } }),
    render(el, ctx) {
      el.classList.add('mcp-root');
      const a = ctx.ans; a.v = a.v || {}; a.j = a.j || {};
      const ev = ctx.result ? c4Eval(a) : null;
      el.innerHTML = `<div class="stack"><div class="eyebrow">Часть 1 · Уровни</div><div data-s></div><div class="eyebrow">Часть 2 · Ответ Тимуру Рашидовичу</div>${ui.say('timur', 'Зачем мне эти квадратики? Что мне с ними делать? Скажите лучше: если ЮKassa ляжет в субботу — что будет? А 1С по выходным обновляют.')}<div data-j></div></div>`;
      const rv = {};
      if (ev) C4I.forEach(x => { if (a.v[x.id]) rv[x.id] = a.v[x.id] === x.b ? 'ok' : 'bad'; });
      ui.sort(TR.$('[data-s]', el), { items: C4I.map(x => ({ id: x.id, t: x.t })), buckets: C4B, value: a.v, readonly: ctx.readonly, reveal: ev ? rv : null, seed: 'mcp-c4', onChange: v => { a.v = v; ctx.save(); } });
      ui.justify(TR.$('[data-j]', el), {
        id: 'mcp-timur', q: 'Что ответить Тимуру Рашидовичу?',
        qPlain: 'Объясните владельцу сети автосервисов, зачем нужна диаграмма компонентов системы «Искра Онлайн», что будет при недоступности платёжного сервиса ЮKassa в субботу и при обновлении 1С в выходные, и как схема помогает оценивать новые функции.',
        rubric: T_RUBRIC, reference: T_REF, value: a.j, readonly: ctx.readonly, minLen: 250,
        placeholder: 'Тимур Рашидович, …',
        onChange: v => { a.j = v; ctx.save(); ctx.decide('Ответ Тимуру про схему компонентов', v.text || ''); }
      });
    },
    check(ans) {
      const r = c4Eval(ans), notes = [], v = (ans && ans.v) || {};
      C4I.forEach(x => { if (v[x.id] && v[x.id] !== x.b) notes.push({ ok: false, html: `«${esc(x.t)}» — ${C4B.find(b => b.id === x.b).t}.` }); });
      const miss = C4I.filter(x => !v[x.id]).length;
      if (miss) notes.push({ ok: false, html: `Не разложено карточек: ${miss}.` });
      if (r.good === C4I.length) notes.push({ ok: true, html: 'Уровни разложены верно: каждой аудитории — своя высота.' });
      if (!r.j) notes.push({ ok: false, html: 'Ответ Тимуру не написан или не оценён: от 250 символов, затем проверка с Верой или по эталону.' });
      else notes.push({ ok: r.j >= 0.6 ? true : 'warn', html: `Ответ Тимуру: ${pct(r.j)} по рубрике.${r.j < 0.6 ? ' Ответьте на его конкретные вопросы — ЮKassa в субботу и 1С по выходным, — и скажите, что ему это даёт.' : ''}` });
      return { ok: r.ok, score: r.score, notes, summary: `Уровни: ${r.good} из ${C4I.length}, ответ: ${pct(r.j)}.`,
        mentor: r.ok ? null : 'Тимуру Рашидовичу неважно, как называется уровень. Ему важно: что сломается, что нет, и сколько стоит новое. Ответьте этим.' };
    },
    explain: `<p>Уровни C4 — это масштаб карты под вопрос и аудиторию. <b>Контекст</b> — для заказчика и всех новичков: система одной коробкой, пользователи, внешние системы. <b>Контейнеры</b> — для архитектора и команды: что запускается отдельно, где данные, какие протоколы. <b>Компоненты</b> — для разработчиков одной части: блоки внутри контейнера (UML-диаграмма компонентов живёт примерно здесь). <b>Развёртывание</b> — для эксплуатации: серверы, копии, сети, резервные копии и где они лежат (152-ФЗ).</p>
      <p>Заказчику схема ценна не нотацией, а ответами: что сломается при отказе ЮKassa (только онлайн-оплата), что при работах в 1С (ничего критичного, данные догонят), где наше слабое место (брокер) и как быстро оценить новую функцию. Сильный ответ — на его вопросы, его словами. Источники: Саймон Браун, c4model.com; UML 2.5, разделы 11 и 19; BABOK, 10.27 «Моделирование ограничений и интерфейсов».</p>`,
    refNote: 'Ответ Тимуру оценивается по рубрике (самопроверка или проверка Claude).',
    report: ans => { const r = c4Eval(ans); return `- Уровни C4: ${r.good}/${C4I.length}\n- Ответ Тимуру (${pct(r.j)}): ${(ans && ans.j && ans.j.text) || '—'}`; }
  };

  // =====================================================================
  TR.stage({
    id: ID,
    when: 'среда, 13 января, 15:00 · архитектурный комитет: из чего состоит «Искра Онлайн»',
    intro: [
      { who: 'timur', html: 'Мне показывают много квадратиков. Я хочу понять три вещи: что из этого делаете вы, что будет, если что-то сломается в субботу, и почему каждая новая идея стоит по-разному.' },
      { who: 'gleb', html: 'Состав я нарисовал: четыре клиентских приложения, шлюз, пять сервисов, база, брокер, хранилище фото и пять внешних систем. Но связи и «что сломается» лучше проверить свежим взглядом — я к этой схеме привык.' },
      { who: 'vera', html: 'Сегодня — диаграмма компонентов. Разберём нотацию UML: компоненты, «леденцы» и «гнёзда», порты, зависимости. Проведём границу системы, соберём связи, уроним ЮKassa, 1С и брокер, решим, куда положить напоминание о хранении, и посмотрим, чем это отличается от C4 и схемы развёртывания.' }
    ],
    facts: ['F-pay', 'F-parts', 'F-ready', 'F-pd'],
    glossary: [
      { term: 'Диаграмма компонентов', simple: 'Из каких крупных частей состоит система и как они связаны.', tech: 'Структурная диаграмма UML 2.5 (раздел 11.6): компоненты, интерфейсы, порты, соединители и зависимости.' },
      { term: 'Компонент', simple: 'Самостоятельная заменяемая часть системы.', tech: 'Модульная часть системы, инкапсулирующая содержимое и взаимодействующая через предоставляемые и требуемые интерфейсы.' },
      { term: 'Предоставляемый интерфейс («леденец»)', simple: 'Что компонент умеет и даёт другим.', tech: 'Provided interface — нотация «ball» (кружок на линии).' },
      { term: 'Требуемый интерфейс («гнездо»)', simple: 'Что компоненту нужно от других.', tech: 'Required interface — нотация «socket» (полукруг). Соединение с предоставляемым — assembly connector.' },
      { term: 'Порт', simple: 'Именованный вход в компонент.', tech: 'Port — точка взаимодействия на границе компонента, через которую проходят интерфейсы.' },
      { term: 'Зависимость', simple: 'Если поменять B, может сломаться A.', tech: 'Dependency — пунктирная стрелка от клиента к поставщику, часто со стереотипом «use».' },
      { term: 'Внешняя система', simple: 'Чужая система, которую мы только используем.', tech: 'Система вне границы разрабатываемой; на C4-контексте — External System. У «Искры»: ЮKassa, АТОЛ, SMSC, FCM/APNs, 1С.' },
      { term: 'Модель C4', simple: 'Одна система с четырёх высот.', tech: 'Context, Containers, Components, Code (Саймон Браун). Контейнер — отдельно запускаемая часть: приложение, база, сайт.' },
      { term: 'Диаграмма развёртывания', simple: 'Где всё физически работает.', tech: 'Deployment diagram UML 2.5 (раздел 19): узлы, артефакты, пути связи.' },
      { term: 'Анализ влияния', simple: 'Что заденет изменение или отказ.', tech: 'Impact analysis (BABOK 7.6): прослеживание зависимостей от изменённого или отказавшего элемента к функциям и требованиям.' },
      { term: 'Единая точка отказа', simple: 'Часть, без которой не работает много чего.', tech: 'Single point of failure — компонент без резерва, отказ которого останавливает несколько функций. Лечится резервированием и асинхронностью.' }
    ],
    outro: 'Теперь у «Искры Онлайн» есть проверенная карта: граница системы, связи через интерфейсы, понятные последствия отказа ЮKassa, работ в 1С и падения брокера, место для напоминаний о хранении по BR-13 и пакет схем для разных аудиторий. Модуль моделирования закончен: вы умеете показать путь клиента, экран, процесс, разговор систем и их устройство. Дальше — данные: какие таблицы стоят за всеми этими компонентами и как их проектировать.',
    tasks: [howBasics, howRead, howC4, ownTask, linksTask, impactTask, placeTask, c4Task]
  });
})();
