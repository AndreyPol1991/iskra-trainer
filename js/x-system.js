/* Живая система «Искра Онлайн» — кнопка «Система» в шапке. Справочник, к которому студент возвращается из любой
   тренировки: карта компонентов, база данных с SQL-консолью, модели статусов, бизнес-правила. */
'use strict';
(function () {
  const TR = window.TR, ui = TR.ui, esc = TR.esc;

  if (!document.getElementById('xs-css')) document.head.insertAdjacentHTML('beforeend', `<style id="xs-css">
    .modal .sheet:has(.xs-root) { max-width: 1100px; width: min(1100px, 96vw); }
    .xs-root { display: grid; gap: 14px; min-width: 0; }
    .xs-map { overflow-x: auto; border: 1px solid var(--border); border-radius: 12px; background: var(--surface-2); padding: 8px; }
    .xs-map svg { display: block; margin: 0 auto; }
    .xs-map [data-xc] { cursor: pointer; }
    .xs-info { border: 1px solid var(--border); border-left: 4px solid var(--accent); border-radius: 10px; padding: 10px 14px; background: var(--surface); display: grid; gap: 6px; font-size: 14px; }
    .xs-console { display: grid; gap: 8px; }
    .xs-console textarea { font: 13px/1.5 var(--f-mono); min-height: 110px; background: var(--code-bg); }
    .xs-examples { display: flex; flex-wrap: wrap; gap: 6px; }
    .xs-two { display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr); gap: 14px; align-items: start; }
    .xs-sm { overflow-x: auto; border: 1px solid var(--border); border-radius: 12px; background: var(--surface-2); padding: 10px; }
    .xs-brs { display: grid; gap: 6px; }
    .xs-br { display: grid; grid-template-columns: 62px minmax(0, 1fr); gap: 10px; padding: 8px 12px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface); font-size: 14px; }
    .xs-br b { font-family: var(--f-mono); color: var(--accent); font-size: 12.5px; }
    .xs-br .src { font-size: 12px; color: var(--text-muted); }
    @media (max-width: 760px) { .xs-two { grid-template-columns: minmax(0, 1fr); } }
  </style>`);

  // ---------- карта компонентов ----------
  const COMP = [
    { id: 'app', t: 'Приложение клиента', s: 'iOS / Android', x: 20, y: 20, k: 'front', d: 'Запись, статус ремонта, согласование доп. работ с фото, оплата, бонусы, история обслуживания. Пишет Даша.' },
    { id: 'site', t: 'Сайт с записью', s: 'веб', x: 20, y: 96, k: 'front', d: 'Онлайн-запись без установки приложения: выбор станции, услуг и времени.' },
    { id: 'arm', t: 'АРМ мастера', s: 'веб, стойка приёмки', x: 20, y: 172, k: 'front', d: 'Расписание постов, приёмка машины, заказ-наряд, предложения доп. работ, выдача.' },
    { id: 'tab', t: 'Планшет механика', s: 'веб, цех', x: 20, y: 248, k: 'front', d: 'Список работ по заказ-наряду, фото найденной проблемы, отметка «сделано». Крупные кнопки — руки в масле.' },
    { id: 'gw', t: 'API-шлюз', s: 'REST, авторизация', x: 250, y: 134, k: 'back', d: 'Единая точка входа для всех клиентов: проверка токена, ограничение частоты запросов, маршрутизация к сервисам.' },
    { id: 'book', t: 'Сервис записи', s: 'слоты, BR-1…BR-4', x: 450, y: 20, k: 'back', d: 'Свободные слоты, запись, перенос, отмена, неявки и предоплата. Самый нагруженный: понедельник 09:00, до 1 500 человек одновременно.' },
    { id: 'wo', t: 'Сервис заказ-нарядов', s: 'ЗН, доп. работы', x: 450, y: 96, k: 'back', d: 'Заказ-наряды, строки работ и запчастей, предложения доп. работ (BR-6…BR-9), статусы ремонта.' },
    { id: 'pay', t: 'Платёжный сервис', s: 'BR-10, BR-11', x: 450, y: 172, k: 'back', d: 'Создаёт платежи в ЮKassa, принимает вебхуки, отправляет чеки в онлайн-кассу, начисляет и списывает бонусы.' },
    { id: 'ntf', t: 'Сервис уведомлений', s: 'push, SMS', x: 450, y: 248, k: 'back', d: 'Напоминания о записи, «машина готова», предложения доп. работ. Получает события из брокера, шлёт push и SMS.' },
    { id: 'int', t: 'Интеграция с 1С', s: 'каждые 15 мин', x: 450, y: 324, k: 'back', d: 'Остатки и резервы запчастей (BR-12), выгрузка закрытых заказ-нарядов и оплат в бухгалтерию.' },
    { id: 'mq', t: 'Брокер сообщений', s: 'события', x: 660, y: 286, k: 'data', d: 'Очередь событий «запись создана», «ЗН готов», «платёж прошёл»: сервисы не ждут друг друга, а подписываются на события.' },
    { id: 'db', t: 'База данных', s: 'PostgreSQL', x: 660, y: 58, k: 'data', d: 'Клиенты, машины, записи, заказ-наряды, платежи. 15 таблиц — откройте вкладку «База данных».' },
    { id: 'files', t: 'Хранилище фото', s: 'S3, 6 месяцев', x: 660, y: 172, k: 'data', d: 'Фото найденных проблем к предложениям доп. работ. Хранятся 6 месяцев, до 10 МБ.' },
    { id: 'yk', t: 'ЮKassa', s: 'карта, СБП', x: 870, y: 134, k: 'ext', d: 'Платёжный провайдер: страница оплаты картой и СБП, уведомления о статусе платежа (вебхуки).' },
    { id: 'atol', t: 'Онлайн-касса', s: 'АТОЛ, 54-ФЗ', x: 870, y: 210, k: 'ext', d: 'Формирует фискальный чек и отправляет его в налоговую и клиенту.' },
    { id: 'sms', t: 'SMS-шлюз', s: 'SMSC', x: 870, y: 286, k: 'ext', d: 'Отправка SMS: коды входа, напоминания, «машина готова».' },
    { id: 'push', t: 'Push-сервисы', s: 'FCM / APNs', x: 870, y: 362, k: 'ext', d: 'Доставка push-уведомлений на телефоны Android и iOS.' },
    { id: '1c', t: '1С', s: 'склад, бухгалтерия', x: 870, y: 438, k: 'ext', d: 'Учётная система «Искры»: запчасти, остатки, бухгалтерия, счета юрлицам.' }
  ];
  const LINKS = [['app', 'gw'], ['site', 'gw'], ['arm', 'gw'], ['tab', 'gw'], ['gw', 'book'], ['gw', 'wo'], ['gw', 'pay'], ['book', 'db'], ['wo', 'db'], ['pay', 'db'], ['wo', 'files'], ['pay', 'yk'], ['pay', 'atol'], ['ntf', 'sms'], ['ntf', 'push'], ['int', '1c'], ['book', 'int'], ['wo', 'mq'], ['pay', 'mq'], ['book', 'mq'], ['mq', 'ntf'], ['int', 'db']];
  const KC = { front: 'var(--info)', back: 'var(--accent)', data: 'var(--violet)', ext: 'var(--text-muted)' };
  const KN = { front: 'Клиентские приложения', back: 'Сервисы бэкенда', data: 'Данные и обмен', ext: 'Внешние системы' };
  function mapSVG(sel) {
    const W = 1064, H = 500, BW = 180, BH = 52;
    const box = id => COMP.find(c => c.id === id);
    let s = `<svg viewBox="0 0 ${W} ${H}" width="100%" style="min-width:760px;max-width:${W}px" role="img" aria-label="Компоненты «Искра Онлайн»"><defs><marker id="xs-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" style="fill:var(--text-muted)"/></marker></defs>`;
    s += `<rect x="236" y="6" width="614" height="${H - 12}" rx="14" style="fill:none;stroke:var(--border-strong);stroke-dasharray:6 5"/><text x="248" y="${H - 16}" style="fill:var(--text-muted);font-size:11px;font-family:var(--f-mono)">ГРАНИЦА СИСТЕМЫ «ИСКРА ОНЛАЙН» (БЭКЕНД)</text>`;
    LINKS.forEach(([a, b]) => {
      const A = box(a), B = box(b), on = sel && (sel === a || sel === b);
      const x1 = A.x + BW, y1 = A.y + BH / 2, x2 = B.x, y2 = B.y + BH / 2;
      const back = x2 < x1, same = A.x === B.x;
      const d = same ? `M${A.x} ${y1} C${A.x - 46} ${y1} ${B.x - 46} ${y2} ${B.x} ${y2}` : back ? `M${A.x + BW / 2} ${A.y + (B.y > A.y ? BH : 0)} L${B.x + BW / 2} ${B.y + (B.y > A.y ? 0 : BH)}` : `M${x1} ${y1} C${x1 + 40} ${y1} ${x2 - 40} ${y2} ${x2} ${y2}`;
      s += `<path d="${d}" style="fill:none;stroke:${on ? 'var(--accent)' : 'var(--border-strong)'};stroke-width:${on ? 2.2 : 1.3}" marker-end="url(#xs-ar)"/>`;
    });
    COMP.forEach(c => {
      const on = sel === c.id, col = KC[c.k];
      s += `<g data-xc="${c.id}"><rect x="${c.x}" y="${c.y}" width="${BW}" height="${BH}" rx="10" style="fill:${on ? `color-mix(in srgb, ${col} 18%, var(--surface))` : 'var(--surface)'};stroke:${col};stroke-width:${on ? 2.4 : 1.4}${c.k === 'ext' ? ';stroke-dasharray:5 4' : ''}"/>`;
      s += `<rect x="${c.x + BW - 22}" y="${c.y + 8}" width="13" height="10" rx="1.5" style="fill:none;stroke:${col};stroke-width:1.1"/><rect x="${c.x + BW - 25}" y="${c.y + 10}" width="6" height="2.5" style="fill:var(--surface);stroke:${col};stroke-width:1"/><rect x="${c.x + BW - 25}" y="${c.y + 14}" width="6" height="2.5" style="fill:var(--surface);stroke:${col};stroke-width:1"/>`;
      s += `<text x="${c.x + 10}" y="${c.y + 22}" style="fill:var(--text);font-size:12.5px;font-weight:600">${esc(c.t)}</text><text x="${c.x + 10}" y="${c.y + 39}" style="fill:var(--text-muted);font-size:11px">${esc(c.s)}</text></g>`;
    });
    s += '</svg>';
    return s;
  }
  function tabMap(box) {
    let sel = 'book';
    const draw = () => {
      const c = COMP.find(x => x.id === sel);
      const ins = LINKS.filter(l => l[1] === sel).map(l => COMP.find(x => x.id === l[0]).t), outs = LINKS.filter(l => l[0] === sel).map(l => COMP.find(x => x.id === l[1]).t);
      box.innerHTML = `<div class="stack">
        <p class="small muted">Нажмите на компонент — увидите, что он делает и с кем связан. Пунктир — внешние системы: они не наши, но от них зависит работа «Искры».</p>
        <div class="row" style="flex-wrap:wrap;gap:6px">${Object.keys(KN).map(k => `<span class="chip" style="border-color:${KC[k]}">${KN[k]}</span>`).join('')}</div>
        <div class="xs-map">${mapSVG(sel)}</div>
        <div class="xs-info"><b>${esc(c.t)}</b><span class="small dim">${esc(KN[c.k])} · ${esc(c.s)}</span><div>${esc(c.d)}</div>
          ${ins.length ? `<div class="small"><b>Вызывают:</b> ${ins.map(esc).join(', ')}</div>` : ''}${outs.length ? `<div class="small"><b>Вызывает сам:</b> ${outs.map(esc).join(', ')}</div>` : ''}</div>
      </div>`;
    };
    TR.on(box, 'click', '[data-xc]', (e, g) => { sel = g.dataset.xc; draw(); });
    draw();
  }

  // ---------- база данных ----------
  const EX = [
    ['Записи на сегодня', "SELECT b.start_at, s.name AS станция, c.full_name AS клиент, b.status\nFROM booking b\nJOIN station s ON s.id = b.station_id\nJOIN client c ON c.id = b.client_id\nWHERE b.start_at LIKE '2027-02-10%'\nORDER BY b.start_at;"],
    ['Неявки по станциям', "SELECT s.name, COUNT(*) AS неявок\nFROM booking b JOIN station s ON s.id = b.station_id\nWHERE b.status = 'no_show'\nGROUP BY s.name\nORDER BY неявок DESC;"],
    ['Машины на постах', "SELECT w.number, w.status, c.brand || ' ' || c.model AS авто, c.plate\nFROM work_order w JOIN car c ON c.id = w.car_id\nWHERE w.status NOT IN ('closed', 'cancelled');"],
    ['Доп. работы', "SELECT status, decided_by, COUNT(*) AS n, SUM(amount) AS сумма\nFROM extra_offer\nGROUP BY status, decided_by;"],
    ['Средний чек', "SELECT ROUND(AVG(total)) AS средний_чек, COUNT(*) AS заказ_нарядов\nFROM work_order WHERE status = 'closed';"]
  ];
  function tabDb(box) {
    let sql = EX[0][1];
    box.innerHTML = `<div class="xs-two">
      <div class="xs-console">
        <p class="small muted">Это настоящая база SQLite в вашем браузере — снимок «Искры» на ${esc(TR.db.NOW)}. Можно писать любые запросы, даже UPDATE и DELETE: кнопка «Сбросить базу» вернёт всё как было.</p>
        <div class="xs-examples">${EX.map((x, i) => `<button type="button" class="btn xs" data-ex="${i}">${esc(x[0])}</button>`).join('')}</div>
        <textarea aria-label="SQL-запрос" spellcheck="false">${esc(sql)}</textarea>
        <div class="row"><button type="button" class="btn primary sm" data-run>▶ Выполнить</button><button type="button" class="btn ghost sm" data-reset>⟲ Сбросить базу</button><span class="small dim">Ctrl+Enter — выполнить</span></div>
        <div data-out><p class="small dim">Загружаю базу…</p></div>
      </div>
      <div class="stack tight"><div class="eyebrow">Таблицы · ${TR.db.SCHEMA.length}</div>${TR.db.schemaHTML()}</div>
    </div>`;
    const ta = TR.$('textarea', box), out = TR.$('[data-out]', box);
    const run = async () => {
      out.innerHTML = '<p class="small dim">Выполняю…</p>';
      try { const r = await TR.db.run(ta.value); out.innerHTML = TR.db.resultHTML(r); }
      catch (e) { out.innerHTML = ui.note('bad', 'База не загрузилась', 'Движок SQL грузится из интернета (cdnjs). Проверьте подключение и попробуйте ещё раз.'); }
    };
    TR.on(box, 'click', '[data-ex]', (e, b) => { ta.value = EX[+b.dataset.ex][1]; run(); });
    TR.on(box, 'click', '[data-run]', run);
    TR.on(box, 'click', '[data-reset]', async () => { await TR.db.reset(); ui.toast('База возвращена к исходному снимку', 'ok'); run(); });
    ta.addEventListener('keydown', e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); run(); } });
    run();
  }

  // ---------- статусы ----------
  const SM = {
    booking: { t: 'Запись', states: ['new', 'confirmed', 'arrived', 'done', 'cancelled', 'no_show'], tr: [['new', 'confirmed', 'предоплата 500 ₽ (BR-4)'], ['confirmed', 'arrived', 'клиент приехал'], ['arrived', 'done', 'машина выдана'], ['new', 'cancelled', 'отмена'], ['confirmed', 'cancelled', 'отмена ≥ 3 ч (BR-3)'], ['confirmed', 'no_show', '15 мин после начала (BR-4)']], start: ['new', 'confirmed'] },
    work_order: { t: 'Заказ-наряд', states: ['open', 'in_progress', 'waiting_approval', 'ready', 'closed', 'cancelled'], tr: [['open', 'in_progress', 'механик начал'], ['in_progress', 'waiting_approval', 'предложение доп. работ'], ['waiting_approval', 'in_progress', 'решение или 20 мин (BR-8)'], ['in_progress', 'ready', 'работы сделаны → push+SMS'], ['ready', 'closed', 'оплата и выдача'], ['open', 'cancelled', 'клиент передумал']], start: ['open'] },
    extra_offer: { t: 'Предложение доп. работ', states: ['sent', 'approved', 'rejected', 'expired'], tr: [['sent', 'approved', 'клиент / звонок / авто (BR-9)'], ['sent', 'rejected', 'клиент отказался'], ['sent', 'expired', 'нет ответа к концу работ (BR-8)']], start: ['sent'] },
    payment: { t: 'Платёж', states: ['pending', 'paid', 'failed', 'refunded'], tr: [['pending', 'paid', 'вебхук ЮKassa'], ['pending', 'failed', 'отказ банка'], ['paid', 'refunded', 'возврат']], start: ['pending'] }
  };
  function smSVG(k) {
    const m = SM[k], cols = k === 'booking' ? [['new'], ['confirmed'], ['arrived', 'cancelled'], ['done', 'no_show']] : k === 'work_order' ? [['open'], ['in_progress', 'cancelled'], ['waiting_approval', 'ready'], ['closed']] : k === 'extra_offer' ? [['sent'], ['approved', 'rejected', 'expired']] : [['pending'], ['paid', 'failed'], ['refunded']];
    const BW = 170, BH = 44, CW = 240, RH = 92, pos = {};
    cols.forEach((c, i) => c.forEach((s, j) => { pos[s] = { x: 20 + i * CW, y: 30 + j * RH }; }));
    const W = 40 + cols.length * CW - (CW - BW), H = 60 + Math.max(...cols.map(c => c.length)) * RH;
    const ru = s => TR.db.enumRu(k + '.status', s);
    let s = `<svg viewBox="0 0 ${W} ${H}" width="100%" style="min-width:${Math.min(W, 640)}px;max-width:${W}px"><defs><marker id="xs-sm" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" style="fill:var(--accent)"/></marker></defs>`;
    m.tr.forEach(([a, b, t]) => {
      const A = pos[a], B = pos[b];
      let d, lx, ly;
      if (B.x > A.x) { const x1 = A.x + BW, y1 = A.y + BH / 2, x2 = B.x, y2 = B.y + BH / 2; d = `M${x1} ${y1} C${x1 + 36} ${y1} ${x2 - 36} ${y2} ${x2} ${y2}`; lx = (x1 + x2) / 2; ly = (y1 + y2) / 2 - 6; }
      else if (B.x < A.x) { const x1 = A.x, y1 = A.y + BH - 6, x2 = B.x + BW, y2 = B.y + BH - 6; d = `M${x1} ${y1} C${x1 - 40} ${y1 + 26} ${x2 + 40} ${y2 + 26} ${x2} ${y2}`; lx = (x1 + x2) / 2; ly = Math.max(y1, y2) + 26; }
      else { const x = A.x + BW / 2, y1 = A.y + BH, y2 = B.y; d = `M${x} ${y1} L${x} ${y2}`; lx = x + 6; ly = (y1 + y2) / 2 + 4; }
      s += `<path d="${d}" style="fill:none;stroke:var(--accent);stroke-width:1.5" marker-end="url(#xs-sm)"/><text x="${lx}" y="${ly}" ${B.x !== A.x ? 'text-anchor="middle"' : ''} style="fill:var(--text-2);font-size:10.5px;paint-order:stroke;stroke:var(--surface-2);stroke-width:4px">${esc(t)}</text>`;
    });
    m.states.forEach(st => {
      const p = pos[st], start = m.start.includes(st), fin = !m.tr.some(t => t[0] === st);
      s += `<rect x="${p.x}" y="${p.y}" width="${BW}" height="${BH}" rx="22" style="fill:var(--surface);stroke:${fin ? 'var(--text-muted)' : 'var(--accent)'};stroke-width:${fin ? 2.6 : 1.5}"/>`;
      if (start) s += `<circle cx="${p.x - 10}" cy="${p.y + BH / 2}" r="5" style="fill:var(--accent)"/>`;
      s += `<text x="${p.x + BW / 2}" y="${p.y + 19}" text-anchor="middle" style="fill:var(--text);font-size:12.5px;font-weight:600">${esc(ru(st))}</text><text x="${p.x + BW / 2}" y="${p.y + 34}" text-anchor="middle" style="fill:var(--text-muted);font-size:10.5px;font-family:var(--f-mono)">${esc(st)}</text>`;
    });
    return s + '</svg>';
  }
  function tabStatus(box) {
    let k = 'booking';
    const draw = () => { box.innerHTML = `<div class="stack"><p class="small muted">Модели статусов — как в базе данных (поле <code>status</code>). Точка слева — начальное состояние, серая рамка — конечное. На стрелках — что переводит объект и какое правило за этим стоит.</p>${ui.seg('xs-sm', Object.keys(SM).map(x => ({ v: x, t: SM[x].t })), k, 'accent')}<div class="xs-sm">${smSVG(k)}</div></div>`; };
    ui.onSeg(box, (n, v) => { k = v; draw(); });
    draw();
  }

  // ---------- правила ----------
  const BR = [
    ['BR-1', 'Сетка записи 30 минут; длительность записи = сумма нормо-часов услуг, вверх до 30 мин', 'F-slot'],
    ['BR-2', 'Онлайн-запись не позже чем за 2 часа до начала и не дальше 30 дней вперёд', 'F-cutoff'],
    ['BR-3', 'Бесплатная отмена и перенос — не позднее чем за 3 часа до начала', 'F-cancel'],
    ['BR-4', 'Не приехал за 15 минут — «Неявка»; после 2 неявок подряд онлайн-запись только с предоплатой 500 ₽', 'F-noshow-rule'],
    ['BR-5', 'В записи цена «от»; итог — после приёмки и диагностики', 'F-price-from'],
    ['BR-6', 'Платные доп. работы — только с согласия клиента', 'F-extra-law'],
    ['BR-7', 'Проблему фиксирует механик (фото), предложение с ценой — мастер-приёмщик', 'F-extra-who'],
    ['BR-8', 'Нет ответа 20 минут — звонок мастера; к концу основных работ ответа нет — «Истекло»', 'F-extra-timeout'],
    ['BR-9', 'Корпоративные: доп. работы до лимита договора (3 000 ₽ у «Шашки») — автоматически', 'F-corp'],
    ['BR-10', 'Оплата после «Готов»: ЮKassa (карта, СБП) или касса; юрлица — счёт; чек по 54-ФЗ', 'F-pay'],
    ['BR-11', 'Бонусы 5 % от работ, списание до 30 % работ, сгорают через 12 месяцев, юрлицам не начисляются', 'F-bonus'],
    ['BR-12', 'Запчасти: остатки из 1С каждые 15 мин, резерв на 3 дня, нет — заказ 1–2 дня', 'F-parts'],
    ['BR-13', '«Готов» → push и SMS; хранение до конца следующего дня бесплатно, далее 500 ₽ в сутки', 'F-ready'],
    ['BR-14', 'Гарантия на работы 6 месяцев или 10 000 км', 'F-warranty'],
    ['BR-15', 'ФИО, телефон, email, госномер, VIN — персональные данные: согласие, хранение в РФ', 'F-pd'],
    ['BR-16', 'Заказ-наряды и платежи хранятся 5 лет', 'F-retention']
  ];
  function tabRules(box) {
    box.innerHTML = `<div class="stack"><p class="small muted">Бизнес-правила «Искры». На них ссылаются требования, BPMN, словарь данных и тесты. Правило открывается в блокноте, когда вы выяснили его у заказчика; здесь — полный список, чтобы сверяться.</p>
      <div class="xs-brs">${BR.map(([id, t, f]) => { const has = TR.facts.has(f), F = TR.FACTS[f], who = F && TR.PEOPLE[F.who]; return `<div class="xs-br"><b>${id}</b><div>${esc(t)}<div class="src">${has ? '✓ в блокноте' : 'ещё не выяснено на встречах'}${who ? ' · источник: ' + esc(who.name) : ''}</div></div></div>`; }).join('')}</div></div>`;
  }

  TR.system = {
    open(tab) {
      ui.modal({
        title: 'Система «Искра Онлайн»',
        html: '<div class="xs-root"></div>',
        onMount(body) {
          ui.tabs(TR.$('.xs-root', body), [
            { id: 'map', t: '🧩 Компоненты', render: tabMap },
            { id: 'db', t: '🗄 База данных', render: tabDb },
            { id: 'st', t: '🔁 Статусы', render: tabStatus },
            { id: 'br', t: '📏 Правила', render: tabRules }
          ], tab || 'map');
        }
      });
    },
    COMP, LINKS, BR, SM
  };
})();
