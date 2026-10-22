/* Модуль 1, занятие 4: работа системного аналитика с разработчиками.
   Сквозная задача — ISK-112 «Отмена и перенос записи клиентом» (BR-3, BR-4, BR-2).
   Теория: постановка задачи разработчику — анатомия из восьми блоков, «уберите блок — услышите вопрос», Definition of
   Ready на трёх задачах бэклога (соседний пример — бригада, которая ставит кухню); кто что решает — бизнес, аналитик,
   команда («три полки», «поведение, а не реализация», ограничения с источником); путь задачи — груминг, оценка (покер
   планирования), три амиго, ответы в задаче, а не в личке, версии требования, демо, технический долг.
   Практика: найти дыры в черновике постановки (вопросы Глеба); собрать постановку из перемешанных кусков по шаблону
   с живым предпросмотром; десять вопросов команды в спринте — откуда ответ и кто решает; лаборатория «изменение посреди
   спринта» с последствиями; ответ Артёму своими словами. */
'use strict';
(function () {
  const TR = window.TR, ui = TR.ui, esc = TR.esc;
  const ID = 'm1-devs';

  if (!document.getElementById('mdv-css')) document.head.insertAdjacentHTML('beforeend', `<style id="mdv-css">
    .mdv-root, .mdv-root .stack > * { min-width: 0; }
    .mdv-root .seg button { white-space: normal; text-align: left; }
    .mdv-root .btn { white-space: normal; text-align: left; }
    .wrap:has(.mdv-root) .stage-nav .btn { white-space: normal; text-align: left; max-width: 100%; }
    .mdv-lbl { font: 600 10.5px/1.3 var(--f-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--text-muted); }
    .mdv-lbl.ok { color: var(--ok); } .mdv-lbl.bad { color: var(--bad); } .mdv-lbl.warn { color: var(--warn); }
    .mdv-two { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.25fr); gap: 16px; align-items: start; }
    .mdv-two > * { min-width: 0; }
    .mdv-story { border: 1px solid color-mix(in srgb, var(--accent) 40%, var(--border)); background: color-mix(in srgb, var(--accent) 7%, var(--surface)); border-radius: 12px; padding: 10px 14px; font-size: 14.5px; line-height: 1.5; display: grid; gap: 4px; }
    .mdv-story b { color: var(--accent); }
    /* список-кнопки */
    .mdv-list { display: grid; gap: 6px; }
    .mdv-it { display: grid; grid-template-columns: 30px minmax(0, 1fr); gap: 8px; align-items: center; text-align: left; border: 1px solid var(--border); background: var(--surface); color: var(--text); border-radius: 10px; padding: 8px 10px; font-size: 14px; line-height: 1.35; width: 100%; }
    .mdv-it .i { font-size: 18px; text-align: center; }
    .mdv-it small { display: block; color: var(--text-muted); font-size: 12px; }
    .mdv-it[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); }
    .mdv-panel { border: 1px solid var(--border-strong); border-radius: 12px; padding: 12px 14px; background: var(--surface); display: grid; gap: 10px; font-size: 14px; }
    .mdv-panel h4 { font: 700 16px/1.3 var(--f-brand); }
    .mdv-ex { border-left: 3px solid var(--accent); background: var(--surface-2); border-radius: 0 8px 8px 0; padding: 8px 12px; font-size: 14px; }
    .mdv-kv { display: grid; grid-template-columns: 118px minmax(0, 1fr); gap: 4px 12px; font-size: 14px; }
    .mdv-kv > span:nth-child(odd) { font: 600 10.5px/1.8 var(--f-mono); letter-spacing: .05em; text-transform: uppercase; color: var(--text-muted); }
    /* переключатели */
    .mdv-sws { display: grid; gap: 6px; }
    .mdv-sw { display: grid; grid-template-columns: 34px minmax(0, 1fr); gap: 10px; align-items: center; padding: 7px 10px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface); text-align: left; color: var(--text); width: 100%; font-size: 14px; line-height: 1.35; }
    .mdv-sw .k { width: 34px; height: 20px; border-radius: 99px; background: var(--surface-3); border: 1px solid var(--border-strong); position: relative; }
    .mdv-sw .k::after { content: ""; position: absolute; top: 2px; left: 2px; width: 14px; height: 14px; border-radius: 50%; background: var(--text-muted); transition: left .15s; }
    .mdv-sw[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); }
    .mdv-sw[aria-pressed="true"] .k { background: var(--accent); border-color: var(--accent); }
    .mdv-sw[aria-pressed="true"] .k::after { left: 16px; background: var(--surface); }
    .mdv-stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; }
    .mdv-stats .stat .v { font-size: 18px; }
    .mdv-qs { display: grid; gap: 6px; }
    .mdv-q { display: grid; grid-template-columns: 74px minmax(0, 1fr); gap: 8px; align-items: start; font-size: 13.5px; line-height: 1.4; padding: 7px 10px; border-radius: 9px; background: var(--surface); border: 1px solid var(--border); border-left: 4px solid var(--border-strong); }
    .mdv-q.warn { border-left-color: var(--warn); } .mdv-q.bad { border-left-color: var(--bad); } .mdv-q.info { border-left-color: var(--info); }
    .mdv-q .w { font: 600 10.5px/1.6 var(--f-mono); letter-spacing: .04em; text-transform: uppercase; color: var(--text-muted); }
    /* DoR */
    .mdv-dor { display: grid; gap: 5px; }
    .mdv-dr { display: grid; grid-template-columns: 24px minmax(0, 1fr); gap: 8px; align-items: start; font-size: 14px; padding: 6px 10px; border-radius: 8px; background: var(--surface); border: 1px solid var(--border); }
    .mdv-dr .m { font: 700 14px/1.4 var(--f-mono); text-align: center; }
    .mdv-dr.ok .m { color: var(--ok); } .mdv-dr.bad .m { color: var(--bad); } .mdv-dr.bad { border-color: color-mix(in srgb, var(--bad) 40%, var(--border)); }
    .mdv-dr .fx { grid-column: 2; display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
    /* полки */
    .mdv-sh { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 8px; align-items: center; border: 1px solid var(--border); border-radius: 10px; padding: 8px 10px; background: var(--surface); font-size: 14px; }
    .mdv-sh.ok { border-color: var(--ok); } .mdv-sh.bad { border-color: var(--bad); }
    .mdv-sh .btns { display: flex; gap: 5px; flex-wrap: wrap; justify-content: flex-end; }
    .mdv-sh .why { grid-column: 1 / -1; font-size: 13px; color: var(--text-2); }
    .mdv-bad { border: 1px solid var(--bad); background: var(--bad-soft); border-radius: 10px; padding: 10px 12px; font-size: 14.5px; display: grid; gap: 4px; }
    .mdv-good { border: 1px solid var(--ok); background: var(--ok-soft); border-radius: 10px; padding: 10px 12px; font-size: 14.5px; line-height: 1.5; display: grid; gap: 4px; }
    .mdv-flips { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 10px; }
    .mdv-flip { border: 1px solid var(--border); border-radius: 10px; padding: 10px 12px; background: var(--surface); display: grid; gap: 8px; align-content: start; font-size: 14px; min-width: 0; }
    .mdv-flip.ok { border-color: var(--ok); } .mdv-flip.bad { border-color: var(--bad); }
    .mdv-flip .btns { display: flex; flex-wrap: wrap; gap: 6px; }
    /* путь задачи */
    .mdv-path { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 6px; }
    .mdv-st { border: 1px solid var(--border); background: var(--surface); color: var(--text); border-radius: 10px; padding: 8px 6px; display: grid; gap: 2px; justify-items: center; text-align: center; font-size: 13px; font-weight: 600; min-width: 0; }
    .mdv-st .n { font: 700 11px/1 var(--f-mono); color: var(--text-muted); }
    .mdv-st small { font-weight: 400; font-size: 11px; color: var(--text-muted); }
    .mdv-st[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); color: var(--accent); }
    /* покер */
    .mdv-cards { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
    .mdv-card { border: 2px solid var(--border-strong); border-radius: 12px; background: var(--surface-2); min-height: 112px; display: grid; place-items: center; gap: 4px; padding: 10px; text-align: center; }
    .mdv-card .v { font: 800 32px/1 var(--f-brand); }
    .mdv-card .v.hid { color: var(--text-muted); font-size: 26px; }
    .mdv-card .w { font-size: 12.5px; color: var(--text-2); }
    .mdv-card.hi { border-color: var(--bad); } .mdv-card.lo { border-color: var(--info); } .mdv-card.eq { border-color: var(--ok); }
    /* версии и лента */
    .mdv-tl { display: grid; gap: 6px; }
    .mdv-ev { display: grid; grid-template-columns: 86px minmax(0, 1fr); gap: 10px; border: 1px solid var(--border); border-left: 4px solid var(--border-strong); border-radius: 10px; padding: 8px 12px; background: var(--surface); font-size: 14px; }
    .mdv-ev.ok { border-left-color: var(--ok); } .mdv-ev.bad { border-left-color: var(--bad); } .mdv-ev.warn { border-left-color: var(--warn); } .mdv-ev.info { border-left-color: var(--info); }
    .mdv-ev .t { font: 600 12px/1.6 var(--f-mono); color: var(--text-muted); }
    .mdv-months { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; }
    .mdv-mo { border: 1px solid var(--border); border-radius: 10px; padding: 9px 10px; background: var(--surface); display: grid; gap: 4px; font-size: 13px; align-content: start; }
    .mdv-mo b { font: 600 11px/1.3 var(--f-mono); letter-spacing: .06em; text-transform: uppercase; color: var(--text-muted); }
    .mdv-mo.bad { border-color: color-mix(in srgb, var(--bad) 50%, var(--border)); background: color-mix(in srgb, var(--bad) 6%, var(--surface)); }
    .mdv-mo.ok { border-color: color-mix(in srgb, var(--ok) 50%, var(--border)); }
    /* черновик постановки (задание 1) */
    .mdv-doc { border: 1px solid var(--border-strong); border-radius: 12px; background: var(--surface); padding: 12px 16px 14px; display: grid; gap: 10px; }
    .mdv-doc .hd { display: flex; flex-wrap: wrap; gap: 6px 10px; align-items: baseline; border-bottom: 1px solid var(--border); padding-bottom: 8px; }
    .mdv-doc .hd b { font: 700 16px/1.3 var(--f-brand); }
    .mdv-doc .hd span { font: 12px/1.3 var(--f-mono); color: var(--text-muted); }
    .mdv-sec { display: grid; gap: 4px; }
    .mdv-sec h4 { font: 600 11px/1.3 var(--f-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--text-muted); }
    .mdv-frs { display: flex; flex-wrap: wrap; gap: 4px 6px; }
    .mdv-fr { display: inline-block; max-width: 100%; text-align: left; border: 0; border-bottom: 2px dotted var(--border-strong); background: none; color: var(--text); padding: 2px 4px; border-radius: 5px 5px 0 0; font-size: 14.5px; line-height: 1.5; }
    .mdv-fr:hover:not(:disabled) { background: var(--surface-3); }
    .mdv-fr[aria-pressed="true"] { background: var(--warn-soft); border-bottom: 2px solid var(--warn); }
    .mdv-fr.ok { background: var(--ok-soft); border-bottom: 2px solid var(--ok); }
    .mdv-fr.bad { background: var(--bad-soft); border-bottom: 2px solid var(--bad); }
    .mdv-fr.ref { background: var(--warn-soft); border-bottom: 2px solid var(--warn); }
    .mdv-fr:disabled { opacity: 1; cursor: default; }
    .mdv-notes { display: grid; gap: 8px; }
    .mdv-nt { border: 1px solid var(--border); border-radius: 10px; padding: 8px 12px; background: var(--surface); display: grid; gap: 6px; font-size: 14px; }
    .mdv-nt.ok { border-color: var(--ok); } .mdv-nt.bad { border-color: var(--bad); } .mdv-nt.warn { border-color: var(--warn); }
    .mdv-nt .src { font-style: italic; color: var(--text-2); }
    .mdv-nt .fix { font-size: 13.5px; color: var(--text-2); border-top: 1px dashed var(--border); padding-top: 6px; }
    /* сборка постановки */
    .mdv-pv { border: 1px solid var(--border-strong); border-radius: 12px; background: var(--surface); padding: 12px 16px; display: grid; gap: 8px; font-size: 14px; }
    .mdv-pv .sec { display: grid; gap: 3px; }
    .mdv-pv .sec h5 { font: 600 11px/1.3 var(--f-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--text-muted); margin: 0; }
    .mdv-pv .sec h5.empty { color: var(--bad); }
    .mdv-pv ul { margin: 0; padding-left: 18px; display: grid; gap: 2px; }
    .mdv-pv .trash { border-top: 1px dashed var(--border-strong); padding-top: 8px; color: var(--text-muted); }
    /* чат */
    .mdv-chat { display: grid; gap: 14px; }
    .mdv-msg { display: grid; gap: 8px; }
    .mdv-msg.ok .bubble { border-color: var(--ok); } .mdv-msg.bad .bubble { border-color: var(--bad); } .mdv-msg.warn .bubble { border-color: var(--warn); }
    .mdv-ctl { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
    .mdv-ctl select { width: auto; max-width: 100%; font-size: 13px; padding: 4px 8px; }
    .mdv-dm { font: 600 10.5px/1.3 var(--f-mono); letter-spacing: .06em; text-transform: uppercase; color: var(--warn); }
    .mdv-spec { font-size: 14px; }
    .mdv-spec ul { margin: 2px 0 8px; padding-left: 18px; display: grid; gap: 3px; }
    .mdv-spec h5 { font: 600 11px/1.3 var(--f-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--accent); margin: 8px 0 0; }
    /* лаборатория изменений */
    .mdv-dec { border: 1px solid var(--border); border-radius: 12px; padding: 10px 12px; background: var(--surface); display: grid; gap: 8px; }
    .mdv-dec.ok { border-color: var(--ok); } .mdv-dec.bad { border-color: var(--bad); } .mdv-dec.warn { border-color: var(--warn); }
    .mdv-dec .hd { display: flex; gap: 8px; align-items: baseline; flex-wrap: wrap; }
    .mdv-dec .hd b { font: 600 15px/1.3 var(--f-brand); }
    .mdv-opt { display: grid; grid-template-columns: 20px minmax(0, 1fr); gap: 8px; align-items: start; padding: 7px 10px; border: 1px solid var(--border); border-radius: 9px; background: var(--surface-2); text-align: left; color: var(--text); width: 100%; font-size: 13.5px; line-height: 1.4; }
    .mdv-opt .mk { width: 16px; height: 16px; border-radius: 50%; border: 2px solid var(--border-strong); margin-top: 1px; }
    .mdv-opt.multi .mk { border-radius: 4px; }
    .mdv-opt[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); }
    .mdv-opt[aria-pressed="true"] .mk { border-color: var(--accent); background: var(--accent); box-shadow: inset 0 0 0 3px var(--surface); }
    .mdv-opt.multi[aria-pressed="true"] .mk { box-shadow: none; }
    .mdv-opt.ok { border-color: var(--ok); background: var(--ok-soft); } .mdv-opt.bad { border-color: var(--bad); background: var(--bad-soft); }
    .mdv-opt:disabled { opacity: 1; cursor: default; }
    .mdv-res { border: 2px solid var(--border-strong); border-radius: 14px; padding: 12px 14px; background: var(--surface-2); display: grid; gap: 10px; }
    .mdv-stats5 { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 8px; }
    .mdv-stats5 .stat .v { font-size: 17px; }
    @media (max-width: 860px) { .mdv-two { grid-template-columns: minmax(0, 1fr); } .mdv-path { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
    @media (max-width: 620px) {
      .mdv-stats, .mdv-months { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .mdv-stats5 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .mdv-kv { grid-template-columns: minmax(0, 1fr); gap: 0; }
      .mdv-kv > span:nth-child(even) { margin-bottom: 6px; }
      .mdv-q { grid-template-columns: minmax(0, 1fr); gap: 2px; }
      .mdv-ev { grid-template-columns: minmax(0, 1fr); gap: 2px; }
      .mdv-sh { grid-template-columns: minmax(0, 1fr); }
      .mdv-sh .btns { justify-content: flex-start; }
      .mdv-cards { gap: 6px; }
      .mdv-card .v { font-size: 26px; }
      .mdv-path { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
  </style>`);

  const chip = (t, k) => `<span class="chip ${k || ''}">${t}</span>`;
  const half = x => (Math.round(x * 2) / 2).toLocaleString('ru-RU');
  const has = (o, k) => Object.prototype.hasOwnProperty.call(o || {}, k);
  const sysBtn = (tab, t) => `<button type="button" class="btn sm" data-sys="${esc(tab)}">🧩 ${esc(t)}</button>`;
  const bindSys = el => TR.on(el, 'click', '[data-sys]', (e, b) => { if (TR.system && TR.system.open) TR.system.open(b.dataset.sys); else ui.toast('Справочник системы недоступен в этом окне', 'warn'); });
  const interview = (items) => `<details class="more"><summary>Как об этом спрашивают на собеседовании</summary><div><ul class="checks">${items.map(x => `<li class="info"><b>${x[0]}</b> ${x[1]}</li>`).join('')}</ul></div></details>`;

  // =====================================================================
  // Теория 1. Постановка задачи разработчику
  // =====================================================================
  const BLOCKS = [
    { id: 'ctx', i: '🎯', t: 'Контекст и цель', s: 'зачем это бизнесу и пользователю',
      ex: '17 % записавшихся не приезжают, пост простаивает (F-noshow); цель сезона — 8 % (F-goal). Клиенту, у которого поменялись планы, сейчас проще промолчать, чем дозвониться. Отмена в два касания освобождает время для других клиентов.',
      who: 'Глеб, Артём', without: 'Глеб: «Зачем это? Может, хватит кнопки „Позвонить на станцию“?» Без цели команда не может ни предложить решение проще, ни заметить, что задумка ей противоречит.',
      home: '«Кухня для семьи из пяти человек, готовят каждый день» — от этого зависит, какую столешницу ставить.' },
    { id: 'flow', i: '🧭', t: 'Сценарий', s: 'шаги пользователя и ответы системы',
      ex: 'Мои записи → карточка записи → «Отменить» → окно подтверждения → «Запись отменена». Перенос: выбор нового времени → подтверждение → старая запись «Отменена», новая «Подтверждена».',
      who: 'Даша, Ника', without: 'Даша придумывает путь сама: отмена спрятана в меню «…», подтверждения нет — клиент отменяет случайным касанием в кармане.',
      home: 'Порядок работ: демонтаж старой кухни, электрика, потом шкафы.' },
    { id: 'rules', i: '📏', t: 'Бизнес-правила', s: 'BR-* с точными границами',
      ex: 'BR-3: бесплатно — не позднее чем за 3 часа до начала (ровно 3 ч 00 мин — ещё бесплатно). BR-2 для нового времени: не раньше чем через 2 часа и не дальше 30 дней. Поздняя отмена засчитывается как неявка (BR-4).',
      who: 'Глеб, Лиза', without: '«Ровно за 3 часа — можно? А за 2:59?» Глеб на сервере пишет «больше трёх часов», Даша в приложении — «не меньше трёх»: в одной системе два поведения.',
      home: '«Розетки — 30 см от пола, над столешницей — 110 см».' },
    { id: 'data', i: '🗄️', t: 'Данные и API', s: 'что сохраняем и что передаём',
      ex: 'Запись получает статус «Отменена» (cancelled), время отмены и вид: бесплатная или поздняя. Запись не удаляется. Методы отмены и переноса; названия, ответы и коды ошибок согласуем с Глебом.',
      who: 'Глеб, Даша', without: 'Глеб удаляет отменённую запись «за ненадобностью» — и статистика неявок, и правило двух неявок, и история клиента пропадают.',
      home: 'Спецификация материалов: какая плита, какие петли и ручки.' },
    { id: 'states', i: '⚠️', t: 'Состояния и ошибки', s: 'что видит человек, когда что-то пошло не так',
      ex: 'Время заняли, пока клиент выбирал. ЮKassa не ответила на возврат. Нет сети. До начала меньше 3 часов — предупреждение о поздней отмене до подтверждения.',
      who: 'Даша, Ника, Лиза', without: 'Белый экран или «Error 409». Клиент жмёт ещё раз — и создаёт вторую запись.',
      home: 'Что делать, если стена кривая или труба не там, где на плане.' },
    { id: 'ac', i: '✅', t: 'Критерии приёмки', s: 'как понять, что сделано',
      ex: 'Дано запись на 15:00 с предоплатой 500 ₽; когда клиент отменяет в 12:00; тогда запись «Отменена», 500 ₽ возвращаются, приходит чек возврата.',
      who: 'Лиза, Глеб', without: 'Лиза: «Как я пойму, что готово?» Глеб считает задачу сделанной, Марина Олеговна на демо — нет.',
      home: 'Акт приёмки: дверцы закрываются, ящики не скрипят, зазоры не больше 2 мм.' },
    { id: 'mock', i: '🎨', t: 'Макеты', s: 'ссылка на конкретные фреймы Figma',
      ex: 'Фреймы Ники: «Отмена — подтверждение», «Поздняя отмена — предупреждение», «Перенос — выбор времени». Макет показывает вид, постановка — поведение и данные.',
      who: 'Даша, Ника', without: 'Даша верстает «как поняла», Ника на ревью просит переделать — день работы в мусор.',
      home: 'Эскиз дизайнера кухни с цветом фасадов.' },
    { id: 'open', i: '❓', t: 'Открытые вопросы', s: 'что ещё не решено и кто ответит',
      ex: 'Сколько раз можно переносить одну запись? — Марина Олеговна, ответ до 18 ноября. Может ли завгар «Шашки» отменять записи водителей? — Рустам, до 20 ноября.',
      who: 'все', without: 'Неясное молча решает тот, кто первым дошёл до этого места в коде. О том, что решение вообще было, бизнес узнаёт на демо.',
      home: '«Цвет ручек заказчица выберет до пятницы» — бригада знает, что ручки пока не ставить.' }
  ];
  function drawAnatomy(pane) {
    let cur = 'ctx';
    pane.innerHTML = `<div class="stack">
      <div class="mdv-story"><span class="mdv-lbl">Задача в бэклоге</span><div><b>ISK-112</b> · Отмена и перенос записи клиентом в приложении «Искры»</div></div>
      <p class="small muted">Постановка — письмо разработчику, по которому он сделает задачу, даже если вы в отпуске. Нажмите на блок шаблона — увидите, что в нём для ISK-112, кому он нужнее всего и что будет без него.</p>
      <div class="mdv-two"><div class="mdv-list" data-bl></div><div data-bp></div></div>
      ${ui.note('info', 'Шаблон — не догма', 'Маленькой задаче хватит трёх-четырёх блоков: «поменять текст на кнопке» не требует раздела про API. Но про каждый блок стоит спросить себя: «а это здесь точно не нужно?» Пропущенный блок не исчезает — его заполнит разработчик своей догадкой.')}
    </div>`;
    function draw() {
      TR.$('[data-bl]', pane).innerHTML = BLOCKS.map((b, i) => `<button type="button" class="mdv-it" data-b="${b.id}" aria-pressed="${cur === b.id}"><span class="i" aria-hidden="true">${b.i}</span><span><b>${i + 1}. ${esc(b.t)}</b><small>${esc(b.s)}</small></span></button>`).join('');
      const b = BLOCKS.find(x => x.id === cur);
      TR.$('[data-bp]', pane).innerHTML = `<div class="mdv-panel"><h4>${b.i} ${esc(b.t)}</h4>
        <div class="mdv-ex"><span class="mdv-lbl">В ISK-112</span><div>${esc(b.ex)}</div></div>
        <div class="mdv-kv"><span>Кому нужнее</span><span>${esc(b.who)}</span><span>Без этого блока</span><span>${esc(b.without)}</span><span>Бытовой пример</span><span class="muted">${esc(b.home)}</span></div></div>`;
    }
    TR.on(pane, 'click', '[data-b]', (e, b) => { cur = b.dataset.b; draw(); });
    draw();
  }
  const LOST = {
    ctx: { who: 'Глеб', q: 'Зачем это? Может, хватит кнопки «Позвонить на станцию»?', when: 'groom', cost: 0.5 },
    flow: { who: 'Даша', q: 'Где кнопка отмены и нужно ли подтверждение?', when: 'dev', cost: 1 },
    rules: { who: 'Глеб', q: 'Ровно за 3 часа — бесплатно? А перенос на сегодня через час?', when: 'test', cost: 2 },
    data: { who: 'Глеб', q: 'Отменённую запись удаляем или храним? Что именно сохраняем?', when: 'dev', cost: 1 },
    states: { who: 'Даша', q: 'Что показать, если время заняли, пока клиент выбирал?', when: 'test', cost: 1.5 },
    ac: { who: 'Лиза', q: 'Как я пойму, что готово? По чему принимать?', when: 'demo', cost: 2 },
    mock: { who: 'Даша', q: 'Как выглядит предупреждение о поздней отмене?', when: 'dev', cost: 1 },
    open: { who: 'Марина Олеговна', q: 'Кто решил, что переносить можно сколько угодно раз?', when: 'demo', cost: 1.5 }
  };
  const WHEN_T = { groom: 'груминг', dev: 'разработка', test: 'тест', demo: 'демо' };
  function drawRemove(pane) {
    const on = Object.fromEntries(BLOCKS.map(b => [b.id, true]));
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Выключайте блоки постановки и смотрите, какие вопросы прозвучат и когда. Вопрос на груминге стоит минуты, на тесте и на демо — дни переделки. Дни здесь — учебная модель, а не замер.</p>
      <div class="row"><button type="button" class="btn sm" data-all="0">🧱 Две строки «через забор»</button><button type="button" class="btn sm" data-all="1">📄 Полная постановка</button></div>
      <div class="mdv-two"><div class="mdv-sws" data-sw></div><div class="stack tight"><div class="mdv-stats" data-st></div><div class="mdv-qs" data-qs></div></div></div>
      <div data-vd></div>
    </div>`;
    function draw() {
      TR.$('[data-sw]', pane).innerHTML = BLOCKS.map(b => `<button type="button" class="mdv-sw" data-s="${b.id}" aria-pressed="${on[b.id]}"><span class="k" aria-hidden="true"></span><span>${b.i} ${esc(b.t)}</span></button>`).join('');
      const off = BLOCKS.filter(b => !on[b.id]);
      const inSprint = off.filter(b => LOST[b.id].when !== 'groom').length;
      const days = off.reduce((s, b) => s + LOST[b.id].cost, 0);
      const demo = off.some(b => LOST[b.id].when === 'demo');
      TR.$('[data-st]', pane).innerHTML = `<div class="stat"><span class="k">Вопросов</span><span class="v ${off.length > 3 ? 'bad' : off.length ? 'warn' : 'ok'}">${off.length}</span><span class="s">из-за пропусков</span></div>
        <div class="stat"><span class="k">В спринте</span><span class="v ${inSprint > 2 ? 'bad' : inSprint ? 'warn' : 'ok'}">${inSprint}</span><span class="s">после старта</span></div>
        <div class="stat"><span class="k">Потери</span><span class="v ${days > 3 ? 'bad' : days ? 'warn' : 'ok'}">${half(days)}</span><span class="s">дней команды</span></div>
        <div class="stat"><span class="k">Демо</span><span class="v ${demo ? 'bad' : 'ok'}">${demo ? '✕' : '✓'}</span><span class="s">${demo ? 'спор с заказчиком' : 'без сюрпризов'}</span></div>`;
      TR.$('[data-qs]', pane).innerHTML = off.length ? off.map(b => { const l = LOST[b.id]; return `<div class="mdv-q ${l.when === 'groom' ? 'info' : l.when === 'dev' ? 'warn' : 'bad'}"><span class="w">${WHEN_T[l.when]}</span><span><b>${esc(l.who)}:</b> «${esc(l.q)}»</span></div>`; }).join('')
        : '<p class="small dim">Все блоки на месте: вопросы всё равно будут, но про новое, а не про очевидное.</p>';
      TR.$('[data-vd]', pane).innerHTML = off.length === BLOCKS.length
        ? ui.note('bad', 'Постановка «через забор»', `Две строки вместо постановки: восемь вопросов, ${inSprint} из них — в спринте, около ${half(days)} дней потерь. Хуже того, часть вопросов никто не задаст — разработчик просто решит сам.`)
        : off.length ? ui.note('warn', 'Пропуски дорожают со временем', 'Вопрос о цели всплывёт на груминге и обойдётся в полчаса. Вопросы о правилах, ошибках и критериях всплывают, когда код уже написан: тогда это переделка и повторный тест.')
          : ui.note('ok', 'Полная постановка', 'Команда может начинать. Оставшиеся вопросы — о том, чего никто не мог предвидеть, и на них вы отвечаете в течение дня в комментариях задачи.');
    }
    TR.on(pane, 'click', '[data-s]', (e, b) => { on[b.dataset.s] = !on[b.dataset.s]; draw(); });
    TR.on(pane, 'click', '[data-all]', (e, b) => { BLOCKS.forEach(x => { on[x.id] = b.dataset.all === '1'; }); draw(); });
    draw();
  }
  const DOR = [
    { id: 'goal', t: 'Понятны цель и ценность для бизнеса' },
    { id: 'ac', t: 'Есть проверяемые критерии приёмки' },
    { id: 'rules', t: 'Правила BR-* указаны с точными границами' },
    { id: 'mock', t: 'Макеты согласованы, если есть интерфейс' },
    { id: 'deps', t: 'Известны зависимости: внешние системы, законы, другие задачи' },
    { id: 'open', t: 'Открытые вопросы не мешают начать работу' },
    { id: 'est', t: 'Команда оценила задачу, и она помещается в спринт' }
  ];
  const DOR_ST = [
    { id: '112', t: 'ISK-112 · Отмена и перенос записи клиентом', st: { goal: 1, ac: 1, rules: 1, mock: 0, deps: 0, open: 1, est: 1 },
      fix: { mock: { who: 'nika', btn: 'Попросить Нику', say: 'Фрейм «Поздняя отмена — предупреждение» готов, ссылку положила в задачу. Посмотрите текст кнопок — его формулировали вы.' },
        deps: { who: 'olga', btn: 'Спросить Ольгу Викторовну', say: 'Возврат предоплаты — только с чеком возврата прихода через онлайн-кассу, это 54-ФЗ. И возвращать тем же способом, каким платили. Запишите это как ограничение.' } } },
    { id: '115', t: 'ISK-115 · Напоминание о записи за сутки и за 2 часа', st: { goal: 1, ac: 1, rules: 1, mock: 1, deps: 1, open: 1, est: 1 } },
    { id: '118', t: 'ISK-118 · Кабинет таксопарка «Шашка»', st: { goal: 1, ac: 0, rules: 0, mock: 0, deps: 0, open: 0, est: 0 },
      note: 'Это эпик, а не задача: кабинет компании, лимит согласования 3 000 ₽ (BR-9), счета раз в месяц. В спринт он не влезет при любом качестве постановки — его сначала режут на истории.' }
  ];
  function drawDoR(pane) {
    let cur = '112'; const fixed = {};
    pane.innerHTML = `<div class="stack">
      <p class="small muted"><b>Definition of Ready</b> (DoR, «определение готовности») — чек-лист, о котором команда договорилась сама: по нему задачу берут в спринт или возвращают на доработку. У «Орбиты» семь пунктов. Выберите задачу из бэклога.</p>
      <div class="row" data-sel></div>
      <div data-dor></div>
      ${ui.note('info', 'DoR и DoD — не одно и то же', '<b>DoR</b> — вход в спринт: задача понятна настолько, что её можно делать. <b>DoD</b> (Definition of Done, «определение готовности инкремента») — выход: сделано, проверено, развёрнуто на стенде, документация обновлена. В Скрам-гайде 2020 описан только DoD; DoR — популярная практика команд. Если DoR превращают в шлагбаум, задачи месяцами стоят «не готовы» — пункты должны помогать, а не наказывать.')}
    </div>`;
    function draw() {
      TR.$('[data-sel]', pane).innerHTML = DOR_ST.map(s => `<button type="button" class="btn sm" data-ds="${s.id}" aria-pressed="${cur === s.id}">ISK-${s.id}</button>`).join('');
      const s = DOR_ST.find(x => x.id === cur);
      const ok = id => s.st[id] || (s.fix && s.fix[id] && fixed[s.id + id]);
      const all = DOR.every(d => ok(d.id));
      TR.$('[data-dor]', pane).innerHTML = `<div class="mdv-panel"><h4>${esc(s.t)}</h4><div class="mdv-dor">${DOR.map(d => {
        const f = s.fix && s.fix[d.id], done = ok(d.id);
        return `<div class="mdv-dr ${done ? 'ok' : 'bad'}"><span class="m">${done ? '✓' : '✕'}</span><span>${esc(d.t)}</span>${f && !s.st[d.id] ? `<div class="fx">${fixed[s.id + d.id] ? ui.say(f.who, esc(f.say)) : `<button type="button" class="btn xs" data-fx="${d.id}">${esc(f.btn)}</button>`}</div>` : ''}</div>`;
      }).join('')}</div>
        ${all ? ui.note('ok', 'Готова к спринту', s.id === '112' ? 'Все пункты закрыты. Заметьте: макет и ограничение по чеку закрыли не вы одни — Ника и Ольга Викторовна. Аналитик здесь организатор: знает, чего не хватает и у кого спросить.' : 'Все пункты закрыты — задачу можно брать в планирование спринта.')
          : ui.note('bad', 'Вернуть на доработку', s.note ? esc(s.note) : 'Не все пункты закрыты. Нажмите на кнопки рядом с красными пунктами — кто поможет их закрыть?')}</div>`;
    }
    TR.on(pane, 'click', '[data-ds]', (e, b) => { cur = b.dataset.ds; draw(); });
    TR.on(pane, 'click', '[data-fx]', (e, b) => { fixed[cur + b.dataset.fx] = true; draw(); });
    draw();
  }
  const howBrief = {
    id: 'how-brief', covers: ['holes', 'assemble'], title: 'Как это работает: постановка задачи разработчику', free: true, noReset: true,
    simple: {
      icon: '📨',
      plain: 'Постановка — это письмо разработчику, по которому он сможет сделать задачу без вас: зачем она, как её проходит пользователь, какие правила действуют, какие данные нужны, что бывает при ошибках и как понять, что сделано. Чего нет в постановке, разработчик додумает сам — и не всегда так, как нужно бизнесу.',
      analogy: 'Бригаде, которая ставит кухню, мало сказать «поставьте кухню». Нужны размеры, где розетки, что делать, если стена кривая, и как будете принимать работу. Иначе кухню поставят — но не ту.',
      tech: '<b>Постановка задачи</b> (task specification) — артефакт аналитика для команды. Типовые блоки: контекст и цель, сценарий, бизнес-правила (BR-*), данные и контракт API, состояния и ошибки, критерии приёмки, макеты, открытые вопросы. Готовность задачи к спринту команда проверяет по <b>Definition of Ready</b>. Источники: Вигерс и Битти, «Разработка требований к программному обеспечению»; Кон, «Пользовательские истории: гибкая разработка программного обеспечения».'
    },
    lead: ui.brief({
      situation: 'Груминг через полчаса. Глеб уже прочитал ваш черновик ISK-112 и прислал смайлик с часами. Прежде чем чинить черновик, разберитесь, из чего состоит хорошая постановка и когда задачу можно брать в спринт.',
      todo: [
        'Вкладка «Анатомия постановки»: нажмите на каждый из восьми блоков.',
        'Вкладка «Уберите блок»: нажмите «Две строки „через забор“», потом включайте блоки по одному и следите, какие вопросы исчезают.',
        'Вкладка «Definition of Ready»: проверьте три задачи бэклога; для ISK-112 закройте красные пункты.'
      ],
      look: 'Позиция аналитика: он отвечает за то, чтобы задача была понятна до начала работы, — но не пишет её в одиночку. Вопросы Глеба, Даши и Лизы — не критика, а самая дешёвая проверка постановки.'
    }),
    render(el) {
      el.classList.add('mdv-root');
      const t = document.createElement('div'); el.appendChild(t);
      ui.tabs(t, [
        { id: 'an', t: 'Анатомия постановки', render: drawAnatomy },
        { id: 'rm', t: 'Уберите блок — услышите вопрос', render: drawRemove },
        { id: 'dor', t: 'Definition of Ready', render: drawDoR }
      ], 'an');
      el.insertAdjacentHTML('beforeend', `<div class="stack tight" style="margin-top:12px">
        ${ui.note('warn', 'Типичные ошибки новичка', '<ul class="checks"><li class="bad">Пересказать пожелание заказчика своими словами и назвать это постановкой.</li><li class="bad">Описать только удачный путь — без ошибок, границ и «а если».</li><li class="bad">Написать, как делать («таблица с триггером»), вместо того, что должно получиться.</li><li class="bad">Спрятать нерешённое: открытый вопрос, о котором молчат, решит разработчик.</li></ul>')}
        ${interview([['«Что вы передаёте разработчику, кроме User Story?»', 'Цель, сценарий, правила с границами, данные и API, состояния и ошибки, критерии приёмки, макеты, открытые вопросы — и называете, кто владелец каждого ответа.'], ['«Что такое Definition of Ready?»', 'Договорённость команды, по которой задачу берут в спринт: есть цель, критерии, макеты, известны зависимости, есть оценка. Не путать с Definition of Done.'], ['«Как поймёте, что постановка хорошая?»', 'Разработчик и тестировщик, прочитав её независимо, одинаково отвечают на вопрос «что будет, если…» — и могут оценить задачу.']])}
      </div>`);
    }
  };

  // =====================================================================
  // Теория 2. Кто что решает: бизнес, аналитик, команда
  // =====================================================================
  const SHELF = [
    { id: 's1', t: 'За сколько часов до начала отмена бесплатна', ok: 'biz', why: 'Правило бизнеса: деньги и загрузка постов. Решает «Искра» — Марина Олеговна, при споре Тимур Рашидович. Аналитик выясняет и записывает как BR-3.' },
    { id: 's2', t: 'Что видит клиент, если время заняли, пока он выбирал', ok: 'an', why: 'Поведение системы для пользователя. Аналитик описывает его вместе с Никой; Марину Олеговну спрашивают, только если затронуто правило.' },
    { id: 's3', t: 'Хранить вид отмены полем в таблице записи или отдельной таблицей', ok: 'dev', why: 'Устройство базы — решение разработчика. Аналитику важно другое: что вид отмены сохраняется и его можно посчитать.' },
    { id: 's4', t: 'Возвращать ли предоплату при поздней отмене', ok: 'biz', why: 'Деньги клиента и политика сети — решение Тимура Рашидовича и Марины Олеговны. Аналитик может предложить варианты с последствиями, но не выбирать.' },
    { id: 's5', t: 'Какие данные нужны, чтобы отличить бесплатную отмену от поздней', ok: 'an', why: 'Что хранить — зона аналитика: вид отмены, время, кто отменил. Как назвать столбец и где хранить — решит Глеб.' },
    { id: 's6', t: 'Повторять неудавшийся возврат через очередь или по расписанию', ok: 'dev', why: 'Механизм — решение команды. Требование аналитика: если ЮKassa не ответила, запись всё равно отменяется, а возврат доходит без участия клиента.' },
    { id: 's7', t: 'Нужен ли чек при возврате предоплаты', ok: 'biz', why: 'Это закон (54-ФЗ) и бухгалтерия: спрашивают Ольгу Викторовну. Аналитик записывает ответ как ограничение с источником.' },
    { id: 's8', t: 'Что написано в предупреждении о поздней отмене', ok: 'an', why: 'Смысл — что клиент потеряет и что может сделать — формулирует аналитик, подачу — Ника. Обещания про деньги сверяют с правилом бизнеса.' },
    { id: 's9', t: 'На чём писать приложение: Kotlin или Flutter', ok: 'dev', why: 'Технологии выбирает команда. Если бы «Искра» требовала конкретную платформу с причиной, это было бы ограничение.' }
  ];
  const SHELF_T = { biz: '📮 Бизнес', an: '✍️ Аналитик', dev: '🔧 Команда' };
  function drawShelves(pane) {
    const pick = {};
    pane.innerHTML = `<div class="stack">
      <div class="grid3">
        <div class="card flat"><b>📮 Бизнес «Искры»</b><span class="small muted">Правила, деньги, политика, закон. Аналитик выясняет, записывает и не решает за них.</span></div>
        <div class="card flat"><b>✍️ Аналитик</b><span class="small muted">Поведение системы, данные, сценарии, ошибки глазами пользователя, критерии приёмки — договорившись с бизнесом и командой.</span></div>
        <div class="card flat"><b>🔧 Команда разработки</b><span class="small muted">Как сделать: база, очереди, фреймворки, структура кода. Аналитик даёт условия, а не способ.</span></div>
      </div>
      <p class="small muted">Девять вопросов с груминга ISK-112. На какую полку каждый?</p>
      <div class="mdv-list" data-sh></div><div data-shs></div>
    </div>`;
    function draw() {
      TR.$('[data-sh]', pane).innerHTML = SHELF.map(s => { const p = pick[s.id], st = p ? (p === s.ok ? 'ok' : 'bad') : '';
        return `<div class="mdv-sh ${st}"><span>${esc(s.t)}</span><span class="btns">${Object.keys(SHELF_T).map(k => `<button type="button" class="btn xs" data-sp="${s.id}" data-v="${k}" aria-pressed="${p === k}">${SHELF_T[k]}</button>`).join('')}</span>${p ? `<span class="why"><b>${p === s.ok ? '✓' : '✕ Скорее: ' + SHELF_T[s.ok] + '.'}</b> ${esc(s.why)}</span>` : ''}</div>`; }).join('');
      const n = Object.keys(pick).length, good = SHELF.filter(s => pick[s.id] === s.ok).length;
      TR.$('[data-shs]', pane).innerHTML = n < SHELF.length ? `<p class="small dim">Разложено ${n} из ${SHELF.length}.</p>` : ui.note(good >= 8 ? 'ok' : 'warn', `Верно ${good} из ${SHELF.length}`, 'Граница простая: «что и зачем» — бизнес, «как должна вести себя система» — аналитик вместе с командой, «как это устроено внутри» — разработчики. Спорные случаи (тексты, коды ошибок в API) решают вместе и записывают.');
    }
    TR.on(pane, 'click', '[data-sp]', (e, b) => { pick[b.dataset.sp] = b.dataset.v; draw(); });
    draw();
  }
  const NEGO = [
    { who: 'gleb', t: 'Cron каждые 5 минут — значит, неявку поставим и в 10:15, и в 10:19. Марину Олеговну это устроит? И почему мне решают, чем это делать?' },
    { who: 'me', t: 'Справедливо. Бизнесу важно другое: через 15 минут после начала время освобождается, и мастер может поставить другого клиента. Насколько точно — уточню.' },
    { who: 'marina', t: 'В 10:15 — неявка, ставлю следующего. Клиенты знают правило. Мне надо, чтобы АРМ показал это сразу, а не через пять минут.' },
    { who: 'gleb', t: 'А если мастер нажал «Клиент приехал» в 10:14:59, а неявка ставится в 10:15:00?' },
    { who: 'me', t: 'Если отметка «Клиент приехал» сделана раньше — неявки нет. Запишу это в правила, Лиза проверит на 10:14 и 10:15.' }
  ];
  const NEGO_REQ = 'Если запись в статусе «Подтверждена» и мастер не отметил «Клиент приехал» в течение 15 минут после начала, в момент «начало + 15 минут» (для записи на 10:00 — в 10:15) запись получает статус «Неявка», время освобождается для других клиентов, мастер видит это в АРМ. Если отметка «Клиент приехал» сделана раньше, неявки нет.';
  function drawNego(pane) {
    let step = 0;
    pane.innerHTML = `<div class="stack">
      <div class="mdv-bad"><span class="mdv-lbl bad">В черновике постановки</span><div>«Сделайте cron каждые 5 минут, который ставит no_show записям, где прошло 15 минут».</div></div>
      <div class="row"><button type="button" class="btn sm primary" data-ng="next">Глеб читает дальше →</button><button type="button" class="btn sm ghost" data-ng="reset">⟲ Сначала</button><span class="small dim tnum" data-ngn></span></div>
      <div class="stack tight" data-ngs></div>
    </div>`;
    function draw() {
      TR.$('[data-ngn]', pane).textContent = `${Math.min(step, NEGO.length)} / ${NEGO.length}`;
      let h = step ? NEGO.slice(0, step).map(x => ui.say(x.who, esc(x.t))).join('') : '<p class="small dim">Cron — программа, которая запускает задачи по расписанию. Хороший инструмент — но это <b>способ</b>. Аналитик описал механизм, а поведение («когда именно неявка», «что если приехал в последнюю секунду») осталось за кадром. Нажмите кнопку.</p>';
      if (step >= NEGO.length) h += `<div class="mdv-good"><span class="mdv-lbl ok">Требование: поведение, а не механизм</span><div>${esc(NEGO_REQ)}</div></div>` + ui.say('gleb', 'Вот это понятно. Cron раз в пять минут тут не годится — сделаю отложенную задачу на каждую запись. Но это уже моё дело, в постановку не пишите.');
      TR.$('[data-ngs]', pane).innerHTML = h;
      const b = TR.$('[data-ng="next"]', pane); if (b) b.disabled = step >= NEGO.length;
    }
    TR.on(pane, 'click', '[data-ng]', (e, b) => { step = b.dataset.ng === 'next' ? Math.min(NEGO.length, step + 1) : 0; draw(); });
    draw();
  }
  const CONS = [
    { id: 'c1', t: 'Возврат предоплаты — только через API ЮKassa и только тем же способом, каким клиент платил', ok: 'con', why: 'Ограничение: так устроены правила платёжного сервиса и договор с ним. Источник — договор с ЮKassa.' },
    { id: 'c2', t: 'При возврате пробивать чек возврата прихода через онлайн-кассу', ok: 'con', why: 'Ограничение: 54-ФЗ. Источник — Ольга Викторовна и закон. «Оптимизировать» нельзя.' },
    { id: 'c3', t: 'Свободное время станций держать в Redis', ok: 'dev', why: 'Выбор команды: у «Искры» нет причины требовать Redis. В постановке — требование к скорости из НФТ, способ выберет Глеб.' },
    { id: 'c4', t: 'Телефон, ФИО и госномер хранить на серверах в России', ok: 'con', why: 'Ограничение: 152-ФЗ (BR-15). Записывают с источником, чтобы через год никто не «улучшил» хостинг.' },
    { id: 'c5', t: 'Кнопку «Отменить» сделать красной, 48 пикселей', ok: 'dev', why: 'Это решение дизайнера — в макете Ники. В постановке достаточно: «отмена требует подтверждения, случайное касание не отменяет запись».' }
  ];
  function drawCons(pane) {
    const pick = {};
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Иногда «как» — тоже требование. Это <b>ограничение</b>: за ним закон, договор или существующая система, и его нельзя «улучшить». Остальное «как» — решение команды или дизайнера. Решите про пять карточек.</p>
      <div class="mdv-flips" data-cf></div><div data-cfs></div>
    </div>`;
    function draw() {
      TR.$('[data-cf]', pane).innerHTML = CONS.map(c => { const p = pick[c.id], st = p ? (p === c.ok ? 'ok' : 'bad') : '';
        return `<div class="mdv-flip ${st}"><b>«${esc(c.t)}»</b>${p ? `<div class="small"><b>${p === c.ok ? '✓' : '✕'}</b> ${esc(c.why)}</div>` : `<div class="btns"><button type="button" class="btn xs" data-cn="${c.id}" data-v="con">Ограничение — оставить</button><button type="button" class="btn xs" data-cn="${c.id}" data-v="dev">Решат команда или дизайнер</button></div>`}</div>`; }).join('');
      const n = Object.keys(pick).length;
      TR.$('[data-cfs]', pane).innerHTML = n < CONS.length ? `<p class="small dim">Решено ${n} из ${CONS.length}.</p>` : ui.note('info', 'Признаки ограничения', 'Закон (54-ФЗ, 152-ФЗ); договор или правила внешней системы (ЮKassa, 1С, онлайн-касса); существующая инфраструктура заказчика; осознанное решение заказчика с причиной. Ограничения записывают отдельным разделом и <b>с источником</b> (Вигерс: проектные решения — не требования, пока они не ограничения).');
    }
    TR.on(pane, 'click', '[data-cn]', (e, b) => { pick[b.dataset.cn] = b.dataset.v; draw(); });
    draw();
  }
  const howBorder = {
    id: 'how-border', covers: ['chat'], title: 'Как это работает: кто что решает — бизнес, аналитик, команда', free: true, noReset: true,
    simple: {
      icon: '🧭',
      plain: 'Аналитик не главный над разработчиками и не секретарь заказчика. Правила и деньги решает бизнес. Как должна вести себя система — описывает аналитик, договорившись с бизнесом и командой. Как это сделать внутри — решают разработчики. Аналитик договаривается о поведении, а не диктует реализацию.',
      analogy: 'Вы заказали ремонт ванной. Где будет душ и какой бюджет — решаете вы. Что плитка не скользкая и вода уходит в слив — записывает прораб. Каким клеем клеить плитку — решает плиточник. Но если управляющая компания запрещает трогать стояк — это ограничение, его не обсуждают.',
      tech: 'Разделение «что» и «как»: требование описывает наблюдаемое поведение и результат, проектное решение — устройство (Вигерс и Битти). <b>Ограничение</b> (constraint) — внешнее условие на решение: закон, договор, существующая система. В BABOK v3 — «ограничения на решение» (solution constraints) как отдельный вид требований. Спорные зоны — тексты для пользователя, контракт API, коды ошибок — решают вместе и фиксируют в постановке.'
    },
    lead: ui.brief({
      situation: 'На груминге вопросы посыпались один за другим, и вы чуть не ответили «да, давайте Redis». Вера останавливает: «Сначала спросите себя — чей это вопрос?»',
      todo: [
        'Вкладка «Три полки»: разложите девять вопросов по полкам и прочитайте пояснения.',
        'Вкладка «Поведение, а не реализация»: нажимайте «Глеб читает дальше», пока cron не превратится в требование.',
        'Вкладка «Ограничения»: решите, какие «как» — на самом деле ограничения.'
      ],
      look: 'Позиция аналитика: он владелец постановки, но не владелец всех ответов. Его работа — знать, у кого ответ, получить его и записать так, чтобы все поняли одинаково.'
    }),
    render(el) {
      el.classList.add('mdv-root');
      const t = document.createElement('div'); el.appendChild(t);
      ui.tabs(t, [
        { id: 'sh', t: 'Три полки', render: drawShelves },
        { id: 'ng', t: 'Поведение, а не реализация', render: drawNego },
        { id: 'cn', t: 'Ограничения', render: drawCons }
      ], 'sh');
      el.insertAdjacentHTML('beforeend', `<div class="stack tight" style="margin-top:12px">
        ${ui.note('warn', 'Типичные ошибки', '<ul class="checks"><li class="bad">Решить правило за бизнес, «потому что так логично» — и узнать на демо, что Марина Олеговна думает иначе.</li><li class="bad">Выбрать технологию за команду, «потому что читал, что так быстрее».</li><li class="bad">Обратная крайность: «это не мой вопрос» — и оставить разработчика без ответа. Не знаете — скажите, кто знает и когда будет ответ.</li></ul>')}
        ${interview([['«Разработчик говорит, что ваше требование нельзя сделать. Что будете делать?»', 'Выясню, что именно мешает и какая цель за требованием; вместе поищем другое решение той же цели; если меняется правило — вернусь к бизнесу с вариантами и последствиями.'], ['«Должен ли аналитик проектировать базу?»', 'Аналитик описывает данные и их правила (что хранить, сколько, связи, обязательность); физическую структуру решает команда. В небольших командах аналитик может предложить модель — но последнее слово за разработчиками.']])}
        <div class="row">${sysBtn('br', 'Правила BR-* в справочнике системы')}</div>
      </div>`);
      bindSys(el);
    }
  };

  // =====================================================================
  // Теория 3. Путь задачи: груминг, оценка, три амиго, сопровождение, долг
  // =====================================================================
  const STAGES = [
    { id: 'groom', t: 'Груминг', s: 'за 1–2 недели', what: 'Команда читает задачу, задаёт вопросы, режет большое на части, находит зависимости. Вопросы к бизнесу уходят заранее: Марине Олеговне нужно время на ответ.', an: 'Готовит постановку, ведёт обсуждение, собирает вопросы, после встречи обновляет постановку.', art: 'обновлённая постановка, список открытых вопросов', mis: 'Принести черновик «в две строки» и надеяться, что команда поймёт сама.', ex: 'Глеб спросил про «ровно 3 часа», Лиза — про часовой пояс, Даша — про подтверждение. Ответы попали в постановку до спринта.', home: 'Прораб с бригадой обходят квартиру до начала работ.' },
    { id: 'est', t: 'Оценка', s: 'груминг, планирование', what: 'Оценивают те, кто делает. В «Орбите» — покер планирования в сторипоинтах: условных единицах сложности относительно знакомой задачи.', an: 'Отвечает на вопросы о правилах и объёме. Срок не называет: «там на два дня» от аналитика сбивает оценку (эффект якоря).', art: 'оценка в задаче', mis: 'Подсказывать оценку или спорить с ней.', ex: 'Разброс 3 / 5 / 13 вскрыл забытую работу — возврат предоплаты и чек возврата.', home: 'Смета: плиточник считает плитку, электрик — свою часть.' },
    { id: 'amigos', t: 'Три амиго', s: 'перед стартом', what: 'Аналитик, разработчик и тестировщик 20–30 минут проходят по критериям приёмки на примерах: одинаково ли понимаем?', an: 'Объясняет правила на примерах, дописывает новые примеры в критерии.', art: 'критерии приёмки с примерами', mis: 'Звать всю команду или пропускать встречу, «потому что всё понятно».', ex: 'Лиза: «Запись на 08:00, клиент отменяет в 05:30 — станция закрыта, это поздняя отмена?» Вопрос ушёл Марине Олеговне.', home: 'Планёрка на объекте: «как проверим, что слив работает?»' },
    { id: 'dev', t: 'Разработка', s: 'спринт', what: 'Вопросы неизбежны. Ответы — в задаче, где их видят все; изменения требований — через новую версию постановки.', an: 'На связи: отвечает в течение дня, честно говорит «не знаю — узнаю к 15:00», ведёт журнал решений и версии.', art: 'комментарии в задаче, журнал решений, версия 1.1', mis: 'Отвечать в личке: тестировщик проверит по старой версии.', ex: 'Даша спросила в личке про отмену неоплаченной записи — ответ перенесли в задачу, Глеб и Лиза увидели.', home: 'Прораб на связи: «плитку класть до розетки или после?»' },
    { id: 'demo', t: 'Демо и приёмка', s: 'конец спринта', what: 'Команда показывает работающую функцию заказчику; заказчик принимает по критериям или даёт замечания.', an: 'Готовит сценарий показа на реальных примерах, записывает замечания: дефект, изменение или вопрос.', art: 'протокол демо, замечания в бэклоге', mis: 'Показывать слайды вместо работающей системы; принимать «на словах».', ex: 'Марина Олеговна сама отменяет запись на стенде за 2:59 и видит предупреждение о поздней отмене.', home: 'Приёмка ремонта: открываем воду, проверяем слив.' },
    { id: 'after', t: 'После релиза', s: 'эксплуатация', what: 'Проверяем, достигнута ли цель, собираем обратную связь. Найденные ошибки и технический долг — в бэклог.', an: 'Сверяет результат с целью, формулирует следующие задачи.', art: 'метрики, новые задачи', mis: 'Считать работу законченной на релизе.', ex: 'Через месяц: отмен стало больше, неявок — меньше. Цель 8 % ещё не достигнута — нужны напоминания (ISK-115).', home: 'Гарантия: через месяц проверить, не отошла ли затирка.' }
  ];
  function drawPath(pane) {
    let cur = 'groom';
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Задача не «передаётся» один раз — аналитик ведёт её до приёмки. Нажмите на этап.</p>
      <div class="mdv-path" data-pth></div><div data-pp></div>
    </div>`;
    function draw() {
      TR.$('[data-pth]', pane).innerHTML = STAGES.map((s, i) => `<button type="button" class="mdv-st" data-ps="${s.id}" aria-pressed="${cur === s.id}"><span class="n">${i + 1}</span>${esc(s.t)}<small>${esc(s.s)}</small></button>`).join('');
      const s = STAGES.find(x => x.id === cur);
      TR.$('[data-pp]', pane).innerHTML = `<div class="mdv-panel"><h4>${esc(s.t)}</h4><div>${esc(s.what)}</div>
        <div class="mdv-kv"><span>Аналитик</span><span>${esc(s.an)}</span><span>Артефакт</span><span>${esc(s.art)}</span><span>Ошибка</span><span>${esc(s.mis)}</span><span>Бытовой пример</span><span class="muted">${esc(s.home)}</span></div>
        <div class="mdv-ex"><span class="mdv-lbl">В ISK-112</span><div>${esc(s.ex)}</div></div></div>`;
    }
    TR.on(pane, 'click', '[data-ps]', (e, b) => { cur = b.dataset.ps; draw(); });
    draw();
  }
  function drawPoker(pane) {
    let step = 0, path = '';
    pane.innerHTML = `<div class="stack">
      <div class="mdv-story"><span class="mdv-lbl">Оценка на груминге</span><div><b>ISK-112</b> · Отмена и перенос записи. Карты: 1, 2, 3, 5, 8, 13, 21 — сторипоинты, а не дни.</div></div>
      <div class="mdv-cards" data-pc></div>
      <div class="row" data-pb></div>
      <div class="stack tight" data-pt></div>
    </div>`;
    const CARDS = { 0: [['Глеб', '?'], ['Даша', '?'], ['Лиза', '?']], 1: [['Глеб', '3', 'lo'], ['Даша', '5', ''], ['Лиза', '13', 'hi']], good: [['Глеб', '8', 'eq'], ['Даша', '8', 'eq'], ['Лиза', '8', 'eq']], bad: [['Глеб', '3', ''], ['Даша', '3', ''], ['Лиза', '3', '']] };
    function draw() {
      const c = step === 0 ? CARDS[0] : step === 1 ? CARDS[1] : CARDS[path];
      TR.$('[data-pc]', pane).innerHTML = c.map(x => `<div class="mdv-card ${x[2] || ''}"><span class="v ${x[1] === '?' ? 'hid' : ''}">${x[1] === '?' ? '🂠' : x[1]}</span><span class="w">${x[0]}</span></div>`).join('');
      let btn = '', txt = '';
      if (step === 0) { btn = '<button type="button" class="btn sm primary" data-pk="open">Вскрыть карты</button>'; txt = '<p class="small dim">Каждый выбрал карту молча и одновременно — чтобы никто не подстраивался под мнение старшего.</p>'; }
      if (step === 1) { btn = '<button type="button" class="btn sm" data-pk="good">Спросить Лизу и Глеба: почему 13 и почему 3?</button><button type="button" class="btn sm" data-pk="bad">Аналитик: «Да там на пару дней, просто кнопка»</button>'; txt = ui.note('warn', 'Разброс 3 — 13', 'Большой разброс — не беда, а сигнал: люди понимают задачу по-разному. Что делать дальше?'); }
      if (step === 2 && path === 'good') txt = ui.say('liza', 'Возврат предоплаты через ЮKassa и чек возврата, плюс границы трёх часов и часовой пояс. Песочница ЮKassa — день только на это.') + ui.say('gleb', 'Про возврат я не подумал: считал, что надо просто сменить статус. Тогда переголосуем.') + ui.say('me', 'Возврат и чек — в постановке, раздел «Бизнес-правила». Подниму этот пункт выше, раз его не заметили.') + ui.note('ok', 'Итог: 8 у всех', 'Оценку дали те, кто делает. Аналитик не называл срок — он ответил на вопросы о правилах и сделал важное заметным.');
      if (step === 2 && path === 'bad') txt = ui.say('gleb', 'Ну раз аналитик говорит, что просто кнопка… Ставим 3.') + ui.note('bad', 'Через две недели', 'Возврат предоплаты и чек возврата всплыли на тесте у Лизы. Задача не влезла в спринт и переехала в следующий; Артём переносит дату демо Тимуру Рашидовичу. Это эффект якоря: первое прозвучавшее число тянет оценку за собой, особенно если его сказал «тот, кто знает требования».');
      if (step === 2) btn = '<button type="button" class="btn sm ghost" data-pk="reset">⟲ Сначала</button>';
      TR.$('[data-pb]', pane).innerHTML = btn;
      TR.$('[data-pt]', pane).innerHTML = txt;
    }
    TR.on(pane, 'click', '[data-pk]', (e, b) => { const k = b.dataset.pk; if (k === 'open') step = 1; else if (k === 'reset') { step = 0; path = ''; } else { step = 2; path = k; } draw(); });
    draw();
  }
  const DM = {
    dm: [
      ['Пн 11:20', 'Даша пишет в личку: «Можно отменять запись „Ждёт предоплаты“?» Вы: «Да, конечно, денег же нет».', 'warn'],
      ['Вт 15:00', 'Глеб не видел переписки и на сервере разрешил отмену только для «Подтверждена».', 'bad'],
      ['Ср 12:00', 'Лиза тестирует по постановке v1.0, где об этом ни слова, и заводит баг на приложение: «кнопка есть, а сервер отвечает ошибкой».', 'bad'],
      ['Пт 16:00', 'Демо: 40 минут спора, кто прав. Марина Олеговна: «А что вы вообще решили?» Переделка — в следующем спринте.', 'bad']
    ],
    task: [
      ['Пн 11:20', 'Даша спросила в личке. Вы отвечаете в задаче ISK-112: «Да, отмена „Ждёт предоплаты“ разрешена: денег нет, возвращать нечего. @Глеб @Лиза — учтите».', 'ok'],
      ['Пн 11:40', 'Постановка v1.1: правило «Отменить можно записи „Ждёт предоплаты“ и „Подтверждена“», строка в журнале изменений.', 'ok'],
      ['Вт 10:00', 'Глеб сделал серверную проверку по v1.1, Лиза добавила тест на отмену неоплаченной записи.', 'ok'],
      ['Пт 16:00', 'Демо без сюрпризов. Марина Олеговна отменяет обе записи сама.', 'ok']
    ]
  };
  const CHLOG = [
    ['1.0', '16.11', 'Первая версия после груминга', 'команда'],
    ['1.1', '24.11', 'Отмена записи «Ждёт предоплаты» разрешена (вопрос Даши; денег нет, возвращать нечего)', 'аналитик, по BR-3'],
    ['1.2', '26.11', 'Не больше двух переносов одной записи (ответ на открытый вопрос)', 'Марина Олеговна']
  ];
  function drawDm(pane) {
    let m = 'dm';
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Один и тот же вопрос Даши — и два способа ответить. Переключите.</p>
      ${ui.seg('dmm', [{ v: 'dm', t: '💬 Ответить в личке' }, { v: 'task', t: '📋 Ответить в задаче + новая версия' }], m, 'accent')}
      <div class="mdv-tl" data-dmt></div><div data-dmv></div>
    </div>`;
    function draw() {
      TR.$('[data-dmt]', pane).innerHTML = DM[m].map(x => `<div class="mdv-ev ${x[2]}"><span class="t">${x[0]}</span><span>${esc(x[1])}</span></div>`).join('');
      TR.$('[data-dmv]', pane).innerHTML = m === 'task'
        ? `<div class="eyebrow">Журнал изменений ISK-112</div>${ui.table(['Версия', 'Дата', 'Что изменилось', 'Кто решил'], CHLOG.map(r => r.map(esc)))}<p class="small muted">Изменение требования — это новая версия с записью «что, почему, кто решил». Тогда Лиза знает, по какой версии проверять, а через месяц никто не спорит, откуда правило.</p>`
        : ui.note('bad', 'Почему так вышло', 'Личка — лучший способ сделать так, чтобы решение знали двое. Остальные работают по старой версии. Правило простое: спросили где угодно — отвечаю в задаче и отмечаю тех, кого это касается.');
    }
    ui.onSeg(pane, (n, v) => { if (n === 'dmm') { m = v; draw(); } });
    draw();
  }
  const DEBT = {
    cut: [
      ['Месяц 1', 'Сэкономили 2 дня: время до начала считается по часам телефона.', 'ok'],
      ['Месяц 2', 'Клиент в командировке в Екатеринбурге видит время на 2 часа сдвинутым: 14 жалоб, Марина Олеговна разбирает вручную.', 'bad'],
      ['Месяц 3', 'Сообразительные клиенты переводят часы — бесплатная отмена за час. Минус 6 000 ₽ предоплат.', 'bad'],
      ['Месяц 4', 'Напоминания ISK-115 построили на том же коде. Переписывать уже два места — 5 дней.', 'bad']
    ],
    good: [
      ['Месяц 1', 'Задача заняла на 2 дня дольше: время считается на сервере, часовой пояс станции.', 'warn'],
      ['Месяц 2', 'Ничего не происходит.', 'ok'],
      ['Месяц 3', 'Ничего не происходит.', 'ok'],
      ['Месяц 4', 'Напоминания ISK-115 используют то же правило времени — 0 дней на переделку.', 'ok']
    ]
  };
  function drawDebt(pane) {
    let m = 'cut';
    pane.innerHTML = `<div class="stack">
      ${ui.say('gleb', 'Можно быстрее: время до начала считать прямо на телефоне клиента. Сделаем за день вместо трёх. Потом поправим.')}
      ${ui.seg('dbt', [{ v: 'cut', t: '✂ Срезать угол' }, { v: 'good', t: '🧱 Сделать как надо' }], m, 'accent')}
      <div class="mdv-months" data-dbm></div><div data-dbn></div>
      ${ui.note('info', 'Что такое технический долг', 'Упрощение в коде или устройстве системы, за которое потом платят «процентами» — лишней работой при каждом изменении (метафора Уорда Каннингема, 1992). Долг бывает осознанным и разумным: успеть к 15 марта иногда важнее. Плохо, когда о нём никто не знает.')}
      ${ui.note('ok', 'Роль аналитика', 'Не запрещать и не прятать, а сделать видимым: завести задачу в бэклог с последствиями для бизнеса («через 2–3 месяца — жалобы и потеря предоплат») — чтобы решение о долге принимал владелец продукта осознанно, а не тишина.')}
    </div>`;
    function draw() {
      TR.$('[data-dbm]', pane).innerHTML = DEBT[m].map(x => `<div class="mdv-mo ${x[2] === 'bad' ? 'bad' : x[2] === 'ok' ? 'ok' : ''}"><b>${x[0]}</b><span>${esc(x[1])}</span></div>`).join('');
      TR.$('[data-dbn]', pane).innerHTML = m === 'cut' ? ui.note('bad', 'Итог за 4 месяца', 'Сэкономили 2 дня — заплатили 5 дней работы, 6 000 ₽ и доверие клиентов. «Потом поправим» без задачи в бэклоге означает «никогда».') : ui.note('ok', 'Итог за 4 месяца', 'Заплатили 2 дня сразу — и больше ничего. Хороший результат выглядит скучно.');
    }
    ui.onSeg(pane, (n, v) => { if (n === 'dbt') { m = v; draw(); } });
    draw();
  }
  const howFlow = {
    id: 'how-flow', covers: ['change', 'why'], title: 'Как это работает: груминг, оценка, три амиго и сопровождение до приёмки', free: true, noReset: true,
    simple: {
      icon: '🤝',
      plain: 'Задачу мало написать — её надо провести: обсудить на груминге, дать команде оценить, перед стартом сверить понимание втроём, в спринте отвечать на вопросы в задаче, изменения выпускать новой версией, а на демо принять по критериям. Вопросы будут всегда — важно, чтобы они звучали до кода и ответы видели все.',
      analogy: 'Хороший прораб не уходит, раздав чертежи: он обходит квартиру с бригадой, отвечает на звонки, записывает изменения в смету и вместе с заказчиком принимает работу.',
      tech: '<b>Уточнение бэклога</b> (backlog refinement, «груминг») — регулярная работа над задачами будущих спринтов (Скрам-гайд 2020). <b>Покер планирования</b> — оценка вслепую в сторипоинтах (Майк Кон). <b>Три амиго</b> — бизнес-сторона (аналитик), разработчик и тестировщик над примерами (Гойко Аджич, «Спецификация на примерах»). <b>Журнал решений</b> и <b>версии требований</b> — управление изменениями (BABOK v3, «Управление жизненным циклом требований»). <b>Технический долг</b> — Уорд Каннингем.'
    },
    lead: ui.brief({
      situation: 'Задача прошла груминг. Артём напоминает: «Аналитик не исчезает, когда задача ушла в разработку. Покажи стажёру, как мы ведём задачу до демо».',
      todo: [
        'Вкладка «Путь задачи»: пройдите шесть этапов.',
        'Вкладка «Покер планирования»: вскройте карты и попробуйте оба продолжения.',
        'Вкладка «Личка или задача»: сравните два способа ответить Даше и посмотрите журнал изменений.',
        'Вкладка «Технический долг»: сравните «срезать угол» и «сделать как надо».'
      ],
      look: 'Позиция аналитика: он не оценивает за команду и не решает за бизнес, но отвечает за то, чтобы все работали по одной и той же актуальной версии требований.'
    }),
    render(el) {
      el.classList.add('mdv-root');
      const t = document.createElement('div'); el.appendChild(t);
      ui.tabs(t, [
        { id: 'pa', t: 'Путь задачи', render: drawPath },
        { id: 'pk', t: 'Покер планирования', render: drawPoker },
        { id: 'dm', t: 'Личка или задача', render: drawDm },
        { id: 'db', t: 'Технический долг', render: drawDebt }
      ], 'pa');
      el.insertAdjacentHTML('beforeend', `<div class="stack tight" style="margin-top:12px">
        ${interview([['«Что такое три амиго?»', 'Короткая встреча аналитика (или владельца продукта), разработчика и тестировщика перед стартом задачи: проходят критерии на примерах и выравнивают понимание.'], ['«Требование изменилось посреди спринта. Ваши действия?»', 'Зафиксировать запрос и источник, оценить влияние с командой, принести владельцу продукта варианты со сроками, после решения выпустить новую версию постановки и предупредить всех, кого это касается.'], ['«Что такое технический долг и при чём тут аналитик?»', 'Упрощение, за которое платят потом. Аналитик делает долг видимым для бизнеса: задача в бэклоге с последствиями.']])}
      </div>`);
    }
  };

  // =====================================================================
  // Практика 1. Дыры в постановке: что спросит Глеб
  // =====================================================================
  const HTYPE = [
    { v: 'goal', t: 'Нет цели и ценности' },
    { v: 'vague', t: 'Неоднозначно или неизмеримо' },
    { v: 'gap', t: 'Не хватает правила, исключения или ошибки' },
    { v: 'impl', t: 'Навязана реализация' },
    { v: 'untest', t: 'Нельзя проверить' }
  ];
  const HT = Object.fromEntries(HTYPE.map(x => [x.v, x.t]));
  const FR = {
    f_goal: { t: 'Сделать отмену записи в приложении.', hole: 'goal', alt: ['vague'], q: 'Глеб: «Зачем? Какую цифру двигаем?»', fix: 'Цель: клиент, у которого поменялись планы, сам отменяет или переносит запись — время освобождается для других. Неявки 17 % → 8 % (F-goal).' },
    f_open: { t: 'Клиент открывает «Мои записи», выбирает запись и нажимает «Отменить».', why: 'Нормальный шаг сценария: понятно, кто, где и что нажимает.' },
    f_confirm: { t: 'Перед отменой клиент подтверждает действие во всплывающем окне.', why: 'Хорошая деталь: защищает от случайного касания. Это поведение, а не дизайн.' },
    f_delete: { t: 'Запись удаляется из базы.', hole: 'impl', alt: ['gap'], q: 'Глеб: «Удалить? А статистика неявок, история клиента, правило двух неявок?»', fix: 'Запись получает статус «Отменена», время и вид отмены сохраняются. Запись не удаляется.' },
    f_free: { t: 'После отмены время на станции сразу освобождается для записи других клиентов.', why: 'Это и есть ценность задачи — и записано проверяемо: «сразу», «для других клиентов».' },
    f_3h: { t: 'Бесплатно отменить можно не позднее чем за 3 часа до начала записи.', why: 'Это BR-3, записано точно. Лиза ещё уточнит «ровно 3:00» на трёх амиго, но формулировка верная.' },
    f_late: { t: 'Если позже — по ситуации.', hole: 'vague', alt: ['gap'], q: 'Глеб: «По какой ситуации? Кнопки нет? Платно? Звонок на станцию?»', fix: 'Меньше 3 часов: перенос недоступен; отмена поздняя — внесённая предоплата не возвращается, отмена засчитывается как неявка (BR-4). Решение Марины Олеговны, журнал решений от 16.11.' },
    f_money: { t: 'Деньги возвращаются.', hole: 'gap', alt: ['vague'], q: 'Глеб: «Какие деньги? У большинства клиентов предоплаты нет. Куда возвращаем, каким способом, а чек?»', fix: 'Если была предоплата 500 ₽ (BR-4) и отмена бесплатная — возврат тем же способом через ЮKassa, чек возврата через онлайн-кассу (54-ФЗ).' },
    f_any: { t: 'Отменить можно любую запись.', hole: 'gap', alt: ['vague'], q: 'Лиза: «Даже „Клиент приехал“ или „Завершена“?»', fix: 'Отменить и перенести можно только записи в статусах «Ждёт предоплаты» и «Подтверждена».' },
    f_move: { t: 'Перенос — аналогично.', hole: 'gap', alt: ['vague'], q: 'Даша: «Аналогично чему? На сегодня через час можно? А через два месяца? На другую станцию?»', fix: 'Перенос: новое время по BR-2 (не раньше чем через 2 часа, не дальше 30 дней), сетка 30 минут, та же станция; предоплата переносится на новую запись.' },
    f_tz: { t: 'Время до начала считаем по часам сервера, часовой пояс станции — Москва (UTC+3).', why: 'Отличная деталь: заранее закрывает вопрос «а если клиент перевёл часы на телефоне».' },
    f_table: { t: 'Добавить таблицу cancellations с триггером на booking.', hole: 'impl', alt: [], q: 'Глеб: «А почему триггер? Мы их не используем. Что вообще нужно сохранить?»', fix: 'Какие данные нужны: время отмены, вид (бесплатная или поздняя), кто отменил. Как хранить — решает Глеб.' },
    f_notify: { t: 'Клиенту быстро приходит уведомление.', hole: 'vague', alt: ['untest'], q: 'Лиза: «Быстро — это сколько? Push или SMS?»', fix: 'После отмены — push не позже чем через 1 минуту; если push выключены — SMS.' },
    f_err: { t: 'Ошибки обрабатываются стандартно.', hole: 'gap', alt: ['vague'], q: 'Даша: «Какие ошибки? Что показать, если время заняли, пока клиент выбирал? Если ЮKassa не ответила?»', fix: 'Перечислены ситуации: время заняли — показать три ближайших свободных; ЮKassa не ответила — запись отменяется, возврат повторяется, клиент видит «Возврат в обработке»; нет сети — кнопки неактивны с подсказкой.' },
    f_crit: { t: 'Отмена работает корректно.', hole: 'untest', alt: ['vague'], q: 'Лиза: «Корректно — это как? По такому критерию я не могу ни принять, ни отклонить».', fix: 'Критерии на примерах: «Дано запись на 15:00 с предоплатой; когда отмена в 12:00; тогда „Отменена“, 500 ₽ возвращаются, приходит чек возврата».' },
    f_mock: { t: 'Макет: Figma, фрейм «Мои записи / Отмена».', why: 'Ссылка на конкретный фрейм — то, что нужно. Фреймы поздней отмены и переноса добавятся позже.' }
  };
  const HDOC = [
    { h: 'Цель', f: ['f_goal'] },
    { h: 'Сценарий', f: ['f_open', 'f_confirm', 'f_delete', 'f_free'] },
    { h: 'Правила', f: ['f_3h', 'f_late', 'f_money', 'f_any', 'f_move', 'f_tz'] },
    { h: 'Данные', f: ['f_table'] },
    { h: 'Уведомления', f: ['f_notify'] },
    { h: 'Ошибки', f: ['f_err'] },
    { h: 'Критерии приёмки', f: ['f_crit'] },
    { h: 'Макет', f: ['f_mock'] }
  ];
  const FR_ORDER = HDOC.reduce((a, s) => a.concat(s.f), []);
  const HOLES = FR_ORDER.filter(id => FR[id].hole);
  const NONH = FR_ORDER.filter(id => !FR[id].hole);
  const typeOk = (id, v) => !!v && (FR[id].hole === v || (FR[id].alt || []).includes(v));
  function holesEval(a) {
    const m = (a && a.m) || {};
    const found = HOLES.filter(id => has(m, id)), typed = found.filter(id => typeOk(id, m[id]));
    const fp = NONH.filter(id => has(m, id)), untyped = found.filter(id => !m[id]);
    const score = Math.max(0, Math.min(1, (found.length * 0.6 + typed.length * 0.4) / HOLES.length - fp.length * 0.08));
    return { found, typed, fp, untyped, score, ok: found.length >= 8 && fp.length <= 1 && typed.length >= 7 };
  }
  const holesTask = {
    id: 'holes', title: 'Дыры в постановке: что спросит Глеб',
    simple: howBrief.simple,
    lead: ui.brief({
      situation: 'Ваш черновик ISK-112 — написан в пятницу вечером на скорую руку. Через полчаса груминг. Глеб: «Давай сначала ты сам его прочитаешь моими глазами. Найди, где я начну задавать вопросы». В черновике есть и удачные фразы — их трогать не надо.',
      todo: [
        'Нажимайте на фразы черновика, к которым у разработчика будут вопросы. Повторное нажатие снимает отметку.',
        'Внизу, в списке «Ваши замечания», для каждой отмеченной фразы выберите, что с ней не так.',
        'Нажмите «Проверить». Засчитывается, если найдено не меньше 8 дыр из 10, верно названо не меньше 7 и отмечено не больше одной удачной фразы.'
      ],
      lookTitle: 'Подсказка',
      look: 'Читайте как Глеб, Даша и Лиза: «а если?», «сколько именно?», «зачем?», «как я это проверю?», «почему мне диктуют, как делать?». Удачная фраза — та, по которой разработчик сделает, а тестировщик проверит, не задав ни одного вопроса.'
    }),
    blank: () => ({ m: {} }),
    reference: () => ({ m: Object.fromEntries(HOLES.map(id => [id, FR[id].hole])) }),
    render(el, ctx) {
      el.classList.add('mdv-root');
      const a = ctx.ans; a.m = a.m || {};
      const rv = !!(ctx.result || ctx.readonly), ro = !!ctx.readonly, D = ro ? 'disabled' : '';
      el.innerHTML = `<div class="stack"><div class="mdv-doc" data-doc></div><div class="eyebrow" data-nh></div><div class="mdv-notes" data-nl></div></div>`;
      function draw() {
        TR.$('[data-doc]', el).innerHTML = `<div class="hd"><b>ISK-112 · Отмена записи</b><span>черновик · пятница, 13 ноября</span></div>` + HDOC.map(s => `<div class="mdv-sec"><h4>${esc(s.h)}</h4><div class="mdv-frs">${s.f.map(id => {
          const on = has(a.m, id), f = FR[id];
          const cls = rv && on ? (f.hole ? (typeOk(id, a.m[id]) ? 'ok' : 'ref') : 'bad') : '';
          return `<button type="button" class="mdv-fr ${cls}" data-fr="${id}" aria-pressed="${on}" ${D}>${esc(f.t)}</button>`;
        }).join('')}</div></div>`).join('');
        const marked = FR_ORDER.filter(id => has(a.m, id));
        TR.$('[data-nh]', el).textContent = `Ваши замечания · ${marked.length}`;
        TR.$('[data-nl]', el).innerHTML = marked.length ? marked.map(id => {
          const f = FR[id], v = a.m[id] || '';
          let st = '', body = '';
          if (rv) {
            if (!f.hole) { st = 'bad'; body = `<div class="fix"><b>Это удачная фраза.</b> ${esc(f.why)}</div>`; }
            else { st = typeOk(id, v) ? 'ok' : 'warn'; body = `<div class="fix"><b>${esc(f.q)}</b>${typeOk(id, v) ? '' : `<br>Что не так: скорее «${esc(HT[f.hole])}».`}<br><span class="dim">Как исправить:</span> ${esc(f.fix)}</div>`; }
          }
          return `<div class="mdv-nt ${st}"><span class="src">«${esc(f.t)}»</span><label class="row"><span class="small dim">Что не так:</span><select data-ty="${id}" aria-label="Что не так с фразой" ${D}><option value="">Выберите…</option>${HTYPE.map(x => `<option value="${x.v}" ${v === x.v ? 'selected' : ''}>${esc(x.t)}</option>`).join('')}</select></label>${body}</div>`;
        }).join('') : '<p class="small dim">Пока ничего не отмечено. Нажмите на фразу в черновике.</p>';
      }
      el.addEventListener('click', e => {
        const b = e.target.closest('[data-fr]'); if (!b || ro) return;
        const id = b.dataset.fr;
        if (has(a.m, id)) delete a.m[id]; else a.m[id] = '';
        ctx.save(); draw();
      });
      el.addEventListener('change', e => {
        const s = e.target.closest('[data-ty]'); if (!s || ro) return;
        a.m[s.dataset.ty] = s.value; ctx.save();
        ctx.decide('Дыры в постановке', FR_ORDER.filter(id => has(a.m, id)).map(id => `«${FR[id].t}» — ${HT[a.m[id]] || '?'}`).join('; '));
        draw();
      });
      draw();
    },
    check(ans) {
      const ev = holesEval(ans), notes = [];
      notes.push({ ok: ev.found.length >= 8, html: `Найдено дыр: ${ev.found.length} из ${HOLES.length}.` });
      const missSec = HDOC.filter(s => s.f.some(id => FR[id].hole && !ev.found.includes(id))).map(s => `«${s.h}»`);
      if (ev.found.length < HOLES.length) notes.push({ ok: ev.found.length >= 8 ? 'warn' : false, html: `Ещё есть фразы, на которых Глеб остановится, — в разделах ${missSec.join(', ')}. Спросите про каждую: «а если?», «сколько?», «как проверить?», «почему именно так?».` });
      if (ev.untyped.length) notes.push({ ok: false, html: `Для ${ev.untyped.length} ${TR.plural(ev.untyped.length, 'отмеченной фразы', 'отмеченных фраз', 'отмеченных фраз')} не выбрано, что с ней не так. Назвать проблему — половина исправления.` });
      const wrongT = ev.found.filter(id => ans.m[id] && !typeOk(id, ans.m[id]));
      if (wrongT.length) notes.push({ ok: 'warn', html: `Тип проблемы стоит пересмотреть: ${wrongT.map(id => `«${esc(FR[id].t)}»`).join(', ')}. Чего именно не хватает разработчику — цели, точного числа, правила для исключения, свободы выбора способа или способа проверки?` });
      if (ev.fp.length) notes.push({ ok: ev.fp.length > 1 ? false : 'warn', html: `Отмечены удачные фразы: ${ev.fp.map(id => `«${esc(FR[id].t)}»`).join(', ')}. Какой вопрос по ним можно задать? Если никакого — их не трогают: лишние замечания отнимают время груминга.` });
      return {
        ok: ev.ok, score: ev.score, notes,
        summary: `Дыр найдено ${ev.found.length} из ${HOLES.length}, тип назван верно для ${ev.typed.length}, лишних отметок ${ev.fp.length}.`,
        mentor: ev.fp.length > 1 ? 'Не каждая фраза — дыра. «Не позднее чем за 3 часа» и «по часам сервера» — как раз то, что Глеб хотел бы видеть везде. Ревью — это поиск вопросов, на которые текст не отвечает, а не охота на всё подряд.' : ev.found.length < 8 ? 'Посмотрите на короткие фразы: «аналогично», «стандартно», «по ситуации», «корректно». Короткая фраза в постановке почти всегда прячет решение, которого никто не принял.' : null
      };
    },
    explain: `<ul class="checks">
        <li><b>Нет цели.</b> «Сделать отмену» — это решение, а не цель. Цель — неявки 17 % → 8 %: от неё зависит, например, что важнее — простота отмены или удержание денег.</li>
        <li><b>Неоднозначно.</b> «По ситуации», «быстро» — каждый поймёт по-своему. Нужны правило (поздняя отмена: предоплата не возвращается, засчитывается как неявка) и число (push не позже 1 минуты).</li>
        <li><b>Не хватает правил и исключений.</b> «Деньги возвращаются», «любую запись», «перенос — аналогично», «ошибки стандартно» — за каждой фразой прячется 2–5 решений: какие деньги и с каким чеком, какие статусы, какие границы BR-2, что показать, если время заняли.</li>
        <li><b>Навязана реализация.</b> «Удалить из базы» и «таблица с триггером» — решения об устройстве базы. Первое ещё и неверно: отменённая запись нужна для статистики и правила двух неявок.</li>
        <li><b>Нельзя проверить.</b> «Работает корректно» — Лиза не может ни принять, ни отклонить. Критерии пишут на примерах: время, деньги, статус.</li>
        <li><b>Удачные фразы.</b> «Не позднее чем за 3 часа», «по часам сервера, UTC+3», «сразу освобождается для других клиентов», подтверждение отмены, ссылка на конкретный фрейм — так и пишут.</li>
      </ul>
      <p>Самый дешёвый способ найти дыры — прочитать постановку глазами разработчика и тестировщика до груминга. Каждая найденная здесь дыра — это вопрос, который не прозвучит в середине спринта.</p>
      <p class="small muted">Источники: Карл Вигерс, Джой Битти, «Разработка требований к программному обеспечению» — характеристики хорошего требования; ISO/IEC/IEEE 29148 — однозначность, полнота, проверяемость.</p>`,
    report: ans => { const ev = holesEval(ans), m = (ans && ans.m) || {}; return FR_ORDER.filter(id => has(m, id)).map(id => `«${FR[id].t}» → ${HT[m[id]] || '?'} ${FR[id].hole ? (typeOk(id, m[id]) ? '✓' : '±') : '✗ (удачная фраза)'}`).join('\n') + `\nНайдено ${ev.found.length}/${HOLES.length}, лишних ${ev.fp.length}`; }
  };

  // =====================================================================
  // Практика 2. Собрать постановку по шаблону
  // =====================================================================
  const ASEC = [
    { id: 'ctx', t: 'Контекст и цель' }, { id: 'flow', t: 'Сценарий' }, { id: 'rules', t: 'Бизнес-правила' },
    { id: 'data', t: 'Данные и API' }, { id: 'states', t: 'Состояния и ошибки' }, { id: 'ac', t: 'Критерии приёмки' },
    { id: 'mock', t: 'Макеты' }, { id: 'open', t: 'Открытые вопросы' }, { id: 'no', t: 'Не место в постановке', sub: 'убрать или перенести в другое место' }
  ];
  const ASM = [
    { id: 'a1', ok: 'ctx', t: '17 % записавшихся не приезжают, пост простаивает. Цель сезона — 8 %. Отмена в два касания освобождает время для других клиентов.' },
    { id: 'a2', ok: 'flow', t: 'Мои записи → карточка записи → «Отменить» или «Перенести» → подтверждение → экран результата.' },
    { id: 'a3', ok: 'flow', alt: ['rules'], t: 'Перенос: клиент выбирает время из свободного времени той же станции; старое время освобождается только после успешной записи на новое.' },
    { id: 'a4', ok: 'rules', t: 'BR-3: бесплатно — не позднее чем за 3 часа до начала (ровно 3:00 — ещё бесплатно). Позже перенос недоступен, отмена поздняя: предоплата не возвращается, засчитывается как неявка (BR-4).' },
    { id: 'a5', ok: 'rules', t: 'BR-2 для нового времени: не раньше чем через 2 часа и не дальше 30 дней; сетка 30 минут (BR-1).' },
    { id: 'a6', ok: 'data', t: 'Запись получает статус «Отменена» (cancelled), время отмены и вид: бесплатная или поздняя. Запись не удаляется.' },
    { id: 'a7', ok: 'data', t: 'Методы отмены и переноса записи; названия, ответы и коды ошибок — по согласованию с Глебом.' },
    { id: 'a8', ok: 'states', t: 'Время заняли, пока клиент выбирал: «Это время только что заняли» и три ближайших свободных.' },
    { id: 'a9', ok: 'states', t: 'ЮKassa не ответила на возврат: запись всё равно отменяется, возврат повторяется автоматически, клиент видит «Возврат 500 ₽ в обработке».' },
    { id: 'a10', ok: 'ac', t: 'Дано запись на 15:00 с предоплатой 500 ₽; когда клиент отменяет в 12:00; тогда статус «Отменена», 500 ₽ возвращаются, приходит чек возврата.' },
    { id: 'a11', ok: 'ac', t: 'Дано запись на 15:00; когда клиент отменяет в 12:01; тогда отмена поздняя, предоплата не возвращается, к неявкам подряд прибавляется 1.' },
    { id: 'a12', ok: 'mock', t: 'Figma: «Отмена — подтверждение», «Поздняя отмена — предупреждение», «Перенос — выбор времени».' },
    { id: 'a13', ok: 'open', t: 'Сколько раз можно переносить одну запись? — Марина Олеговна, ответ до 18 ноября.' },
    { id: 'a14', ok: 'open', t: 'Может ли завгар «Шашки» отменять записи водителей? — Рустам, ответ до 20 ноября.' },
    { id: 'a15', ok: 'no', t: 'Блокировку времени сделать через Redis с временем жизни 5 минут.', why: 'реализация — выбор Глеба' },
    { id: 'a16', ok: 'no', t: 'Глеб, сделай, пожалуйста, побыстрее — Тимур Рашидович торопит.', why: 'просьба, а не требование: сроки обсуждают на планировании' },
    { id: 'a17', ok: 'no', t: 'Кнопка «Отменить» — цвет #FF6B1A, скругление 12 px.', why: 'детали вида — в макете Ники' }
  ];
  const ASM_OK = (it, v) => v === it.ok || (it.alt || []).includes(v);
  function asmEval(a) {
    const v = (a && a.v) || {}, per = {};
    let good = 0;
    ASM.forEach(it => { const x = v[it.id]; per[it.id] = !x ? 'none' : ASM_OK(it, x) ? 'ok' : 'bad'; if (per[it.id] === 'ok') good++; });
    const junkIn = ASM.filter(it => it.ok === 'no' && v[it.id] && v[it.id] !== 'no');
    const lostReal = ASM.filter(it => it.ok !== 'no' && v[it.id] === 'no');
    return { per, good, junkIn, lostReal, score: good / ASM.length, ok: good >= 14 && !junkIn.length && per.a4 === 'ok' };
  }
  const asmTask = {
    id: 'assemble', title: 'Собрать постановку ISK-112 по шаблону',
    simple: howBrief.simple,
    lead: ui.brief({
      situation: 'После груминга у вас в заметках семнадцать кусков: ответы Марины Олеговны, вопросы Глеба, примеры Лизы, ссылки Ники — и пара фраз, которые туда попали случайно. Соберите из них постановку ISK-112 версии 1.0.',
      todo: [
        'Нажмите на карточку, затем на раздел шаблона (на компьютере можно перетаскивать).',
        'То, чему не место в постановке, положите в последнюю корзину.',
        'Ниже смотрите живой предпросмотр: так постановку увидят Глеб, Даша и Лиза. Пустой раздел подсвечен.',
        'Нажмите «Проверить». Засчитывается от 14 из 17 карточек на месте, если в постановку не попал мусор, а правило BR-3 лежит в бизнес-правилах.'
      ],
      look: 'Задайте каждой карточке вопрос: это «зачем», «как идёт пользователь», «какое правило», «что храним и передаём», «что если сломалось», «как проверить», «как выглядит» или «что не решено»? Если ни один вопрос не подходит — это не требование.'
    }),
    blank: () => ({ v: {} }),
    reference: () => ({ v: Object.fromEntries(ASM.map(it => [it.id, it.ok])) }),
    render(el, ctx) {
      el.classList.add('mdv-root');
      const a = ctx.ans; a.v = a.v || {};
      const rv = !!(ctx.result || ctx.readonly);
      el.innerHTML = `<div class="stack"><div data-srt></div><div class="eyebrow">Предпросмотр: ISK-112 · версия 1.0</div><div class="mdv-pv" data-pv></div></div>`;
      const reveal = rv ? Object.fromEntries(ASM.filter(it => a.v[it.id]).map(it => [it.id, ASM_OK(it, a.v[it.id]) ? 'ok' : 'bad'])) : null;
      function preview() {
        TR.$('[data-pv]', el).innerHTML = ASEC.filter(s => s.id !== 'no').map(s => {
          const items = ASM.filter(it => a.v[it.id] === s.id);
          return `<div class="sec"><h5 class="${items.length ? '' : 'empty'}">${esc(s.t)}${items.length ? '' : ' — пусто'}</h5>${items.length ? `<ul>${items.map(it => `<li>${esc(it.t)}</li>`).join('')}</ul>` : ''}</div>`;
        }).join('') + (ASM.some(it => a.v[it.id] === 'no') ? `<div class="trash small">🗑 Убрано из постановки: ${ASM.filter(it => a.v[it.id] === 'no').length}</div>` : '');
      }
      ui.sort(TR.$('[data-srt]', el), {
        items: ASM.map(it => ({ id: it.id, t: esc(it.t) })), buckets: ASEC.map(s => ({ id: s.id, t: esc(s.t), sub: s.sub ? esc(s.sub) : '' })),
        value: a.v, readonly: ctx.readonly, reveal, seed: 'mdv-asm',
        onChange: v => { a.v = v; ctx.save(); preview(); }
      });
      preview();
    },
    check(ans) {
      const ev = asmEval(ans), v = (ans && ans.v) || {}, notes = [];
      const empty = ASM.filter(it => !v[it.id]);
      if (empty.length) notes.push({ ok: false, html: `Не разложено карточек: ${empty.length}.` });
      if (ev.junkIn.length) notes.push({ ok: false, html: `В постановку попало то, что требованием не является: ${ev.junkIn.map(it => `«${esc(it.t)}»`).join(', ')}. Кто это решает и где этому место?` });
      if (ev.lostReal.length) notes.push({ ok: 'warn', html: `В корзину ушло нужное: ${ev.lostReal.map(it => `«${esc(it.t.slice(0, 60))}…»`).join(', ')}. Без этого кто-то из команды останется с вопросом.` });
      const wrong = ASM.filter(it => ev.per[it.id] === 'bad' && it.ok !== 'no' && v[it.id] !== 'no');
      const byKind = {};
      wrong.forEach(it => { byKind[it.ok] = (byKind[it.ok] || 0) + 1; });
      const HINT = {
        ctx: 'Что из карточек объясняет, зачем это «Искре»?', flow: 'Где описан путь клиента по экранам?',
        rules: 'Какие карточки — правила с числами, которые нельзя менять без бизнеса?', data: 'Что говорит о том, что сохраняется и передаётся между приложением и сервером?',
        states: 'Какие карточки отвечают на «а если что-то пошло не так»?', ac: 'Какие карточки построены как «Дано — Когда — Тогда»?',
        mock: 'Где ссылка на картинки Ники?', open: 'Где у карточки есть вопросительный знак, ответственный и срок?'
      };
      Object.keys(byKind).forEach(k => notes.push({ ok: false, html: `${HINT[k]} (не на месте: ${byKind[k]})` }));
      if (!notes.length) notes.push({ ok: true, html: 'Все разделы заполнены, мусор убран: Глеб, Даша и Лиза найдут в постановке каждый своё.' });
      return {
        ok: ev.ok, score: ev.score, notes,
        summary: `На своих местах: ${ev.good} из ${ASM.length}.`,
        mentor: ev.junkIn.some(it => it.id === 'a15') ? 'Redis с временем жизни — дельная мысль, но она Глеба. Если записать её в постановку, она станет требованием, и команда потеряет свободу выбрать лучшее. В постановку — условие: «пока клиент выбирает время, его не забирает другой клиент».' : null
      };
    },
    explain: `<ul class="checks">
        <li><b>Контекст и цель</b> — одна-две фразы с цифрой: неявки 17 % → 8 %. Это ответ на «зачем», к которому возвращаются в каждом споре.</li>
        <li><b>Сценарий и правила</b> разделены: путь по экранам меняется с макетом, а BR-3 и BR-2 — только с решением бизнеса. Карточку про перенос «старое время освобождается после успешной записи» можно положить и туда, и туда — засчитано оба.</li>
        <li><b>Данные и API</b> говорят, что сохраняем и что передаём, но не как устроена база. Названия методов и коды ошибок согласуют с Глебом — так и записано.</li>
        <li><b>Состояния и ошибки</b> — то, что чаще всего забывают: время заняли, ЮKassa молчит.</li>
        <li><b>Критерии приёмки</b> — на примерах с временем и деньгами: 12:00 и 12:01 для записи на 15:00 — граница BR-3.</li>
        <li><b>Открытые вопросы</b> — с ответственным и сроком. Это честно: команда знает, чего не делать раньше времени.</li>
        <li><b>Не место в постановке:</b> Redis (реализация), «побыстрее» (не требование), цвет кнопки (макет).</li>
      </ul>
      <p class="small muted">Источники: Карл Вигерс, Джой Битти, «Разработка требований к программному обеспечению» — структура спецификации; Гойко Аджич, «Спецификация на примерах» — критерии в виде примеров.</p>`,
    report: ans => { const ev = asmEval(ans), v = (ans && ans.v) || {}; return ASEC.map(s => `${s.t}: ${ASM.filter(it => v[it.id] === s.id).map(it => it.id).join(', ') || '—'}`).join('\n') + `\nНа месте ${ev.good}/${ASM.length}`; }
  };

  // =====================================================================
  // Практика 3. Вопросы команды в спринте: откуда ответ
  // =====================================================================
  const SPEC = [
    { id: 'ctx', h: 'Контекст и цель', li: ['17 % записавшихся не приезжают, пост простаивает (F-noshow); цель сезона — 8 % (F-goal).', 'Клиент, у которого поменялись планы, сам отменяет или переносит запись — время освобождается для других.'] },
    { id: 'flow', h: 'Сценарий', li: ['Мои записи → карточка записи → «Отменить» или «Перенести» → подтверждение → экран результата.', 'Перенос: время из свободного времени той же станции; старое время освобождается только после успешной записи на новое.', 'После отмены или переноса — push не позже чем через 1 минуту; если push выключены — SMS.'] },
    { id: 'rules', h: 'Бизнес-правила', li: ['Отменить и перенести можно записи в статусах «Ждёт предоплаты» и «Подтверждена».', 'BR-3: бесплатно — не позднее чем за 3 часа до начала (ровно за 3 ч 00 мин — ещё бесплатно). Время — по серверу, часовой пояс станции (Москва, UTC+3).', 'Меньше 3 часов: перенос недоступен; отмена поздняя — внесённая предоплата не возвращается, отмена засчитывается как неявка для BR-4 (две неявки подряд — предоплата 500 ₽ на следующую онлайн-запись).', 'Перенос: новое время по BR-2 — не раньше чем через 2 часа и не дальше 30 дней; сетка 30 минут; предоплата переносится на новую запись.', 'Бесплатная отмена с предоплатой: 500 ₽ возвращаются тем же способом через ЮKassa.', 'После отмены время сразу доступно другим клиентам; резерв запчастей в 1С снимается (BR-12).'] },
    { id: 'data', h: 'Данные и API', li: ['Запись получает статус «Отменена», время отмены и вид отмены: бесплатная или поздняя. Запись не удаляется.', 'Методы отмены и переноса; названия, ответы и коды ошибок — по согласованию с Глебом.'] },
    { id: 'states', h: 'Состояния и ошибки', li: ['Время заняли, пока клиент выбирал: «Это время только что заняли» и три ближайших свободных.', 'ЮKassa не ответила на возврат: запись всё равно отменяется, возврат повторяется автоматически, клиент видит «Возврат 500 ₽ в обработке».', 'До начала меньше 3 часов: предупреждение о поздней отмене до подтверждения.', 'Нет сети: кнопки неактивны, подсказка «Нет связи».'] },
    { id: 'ac', h: 'Критерии приёмки', li: ['Дано запись на 15:00 с предоплатой 500 ₽; когда клиент отменяет в 12:00; тогда «Отменена», 500 ₽ возвращаются.', 'Дано запись на 15:00; когда клиент отменяет в 12:01; тогда отмена поздняя, предоплата не возвращается, к неявкам подряд +1.'] },
    { id: 'mock', h: 'Макеты', li: ['Figma: «Отмена — подтверждение», «Поздняя отмена — предупреждение» (текст кнопок — ещё не утверждён), «Перенос — выбор времени».'] },
    { id: 'open', h: 'Открытые вопросы', li: ['Сколько раз можно переносить одну запись? — Марина Олеговна, до 18 ноября.', 'Может ли завгар «Шашки» отменять записи водителей? — Рустам, до 20 ноября.'] }
  ];
  const SEC_T = Object.fromEntries(SPEC.map(s => [s.id, s.h]));
  const specHTML = () => `<div class="mdv-spec">${SPEC.map(s => `<h5>${esc(s.h)}</h5><ul>${s.li.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`).join('')}</div>`;
  const PERS = { marina: 'Марина Олеговна', timur: 'Тимур Рашидович', olga: 'Ольга Викторовна', aliya: 'Алия', rustam: 'Рустам' };
  const PERS_D = { marina: 'Марины Олеговны', timur: 'Тимура Рашидовича', olga: 'Ольги Викторовны', aliya: 'Алии', rustam: 'Рустама' };
  const QCAT = [{ v: 'doc', t: '📄 Ответ в постановке' }, { v: 'an', t: '✍️ Решаю я' }, { v: 'biz', t: '📮 Спрошу «Искру»' }, { v: 'dev', t: '🔧 Решает команда' }];
  const QCAT_T = { doc: 'ответ есть в постановке', an: 'решает аналитик', biz: 'решает бизнес', dev: 'решает команда', dm: 'ответить в личке', task: 'ответить в задаче', skip: 'не отвечать' };
  const CQ = [
    { id: 'q1', who: 'gleb', at: '10:05', q: 'Ровно за 3 часа до начала — отмена ещё бесплатная или уже поздняя?', ok: 'doc', sec: 'rules', a: 'Бесплатная: «не позднее чем за 3 часа», ровно 3 ч 00 мин — ещё можно.', self: 'Поздняя, конечно: «за три часа» — значит больше трёх.', jt: 'Граница BR-3' },
    { id: 'q2', who: 'dasha', at: '10:40', q: 'Время до начала считаю по часам телефона? Так проще — без лишнего запроса к серверу.', ok: 'doc', sec: 'rules', a: 'Нет: по серверу, часовой пояс станции — Москва (UTC+3). Часы телефона клиент может перевести.', self: 'Давай по телефону, так быстрее.', jt: 'Чьи часы считаются' },
    { id: 'q3', who: 'gleb', at: '11:15', q: 'Вид отмены — бесплатная или поздняя — храню полем в записи или отдельной таблицей с историей?', ok: 'dev', self: 'Сделай отдельную таблицу, так правильнее.', dev: 'Это твоё решение. От меня — требование: вид и время отмены сохраняются, по ним можно посчитать поздние отмены по станциям.', jt: 'Где хранить вид отмены' },
    { id: 'q4', who: 'liza', at: '11:50', q: 'У клиента одна неявка, и он поздно отменяет следующую запись. На новую запись просим предоплату?', ok: 'doc', sec: 'rules', a: 'Да: поздняя отмена засчитывается как неявка — это две подряд, новая онлайн-запись с предоплатой 500 ₽.', self: 'Не знаю, давай не будем — жалко клиента.', jt: 'Поздняя отмена и BR-4' },
    { id: 'q5', who: 'dasha', at: '12:30', q: 'Пока клиент выбирал новое время, его заняли. Что показываем?', ok: 'doc', sec: 'states', a: '«Это время только что заняли» и три ближайших свободных — раздел «Состояния и ошибки».', self: 'Покажи ошибку, пусть выберет снова.', jt: 'Время заняли при переносе' },
    { id: 'q6', who: 'gleb', at: '13:10', q: 'Сколько раз можно переносить одну запись? Ставить ограничение?', ok: 'biz', whoOk: ['marina'], due: '18 ноября', self: 'Ставь не больше трёх, этого хватит.', jt: 'Число переносов' },
    { id: 'q7', who: 'gleb', at: '14:00', q: 'Возврат через ЮKassa: ждать ответа сразу или ставить в очередь и повторять?', ok: 'dev', self: 'Делай очередь, я читал, что так надёжнее.', dev: 'Это твоё решение. Требование: если ЮKassa не ответила, запись всё равно отменяется, возврат доходит без участия клиента, а клиент видит «Возврат в обработке».', jt: 'Механизм возврата' },
    { id: 'q8', who: 'nika', at: '14:40', q: 'Кнопка в предупреждении о поздней отмене: просто «Отменить» или «Отменить без возврата 500 ₽»? Как честно сказать, что клиент теряет?', ok: 'an', a: 'Текст: «Бесплатная отмена — не позднее чем за 3 часа. Сейчас отмена поздняя: предоплата не вернётся, отмена засчитается как неявка». Кнопки: «Всё равно отменить» и «Оставить запись». Покажу Марине Олеговне, чтобы обещание совпадало с правилом.', self: '', jt: 'Текст предупреждения' },
    { id: 'q9', who: 'gleb', at: '15:20', q: 'При поздней отмене предоплата остаётся у «Искры». Это выручка? Какой-то чек пробиваем?', ok: 'biz', whoOk: ['olga'], due: 'завтра 12:00', self: 'Ничего не пробиваем, деньги же уже получены.', jt: 'Удержанная предоплата и чек' },
    { id: 'q10', who: 'dasha', at: '16:10', dm: true, q: 'Слушай, можно я спрячу «Перенести» для записей «Ждёт предоплаты»? Так проще, никто и не заметит.', ok: 'task',
      opts: [{ v: 'dm', t: '💬 Ответить в личке: «Ок, прячь»' }, { v: 'task', t: '📋 Ответить в задаче ISK-112 и отметить Глеба и Лизу' }, { v: 'skip', t: '🤐 Не отвечать — пусть решает сама' }],
      r: { dm: 'Ок, прячь.', task: 'Ответил в ISK-112: по постановке перенос записей «Ждёт предоплаты» разрешён. Если есть причина менять — давай обсудим здесь, @Глеб @Лиза. Изменение — только через новую версию постановки.', skip: '' }, jt: 'Перенос записей «Ждёт предоплаты»' }
  ];
  function cqReply(q, a) {
    const v = a.c && a.c[q.id]; if (!v) return '';
    if (q.opts) return q.r[v] || '';
    if (v === 'doc') { const s = a.s && a.s[q.id]; return s ? (q.ok === 'doc' && s === q.sec ? `Есть в постановке, раздел «${SEC_T[s]}»: ${q.a}` : `Смотри постановку, раздел «${SEC_T[s]}».`) : 'Есть в постановке… (выберите раздел)'; }
    if (v === 'an') return q.ok === 'an' ? q.a : (q.self || 'Решаю сам: делай так, как удобнее.');
    if (v === 'biz') { const w = a.w && a.w[q.id]; return w ? `Не знаю — это решает ${PERS[w]}. Узнаю и отвечу до ${q.due || '17:00'}. Пока делай остальное.` : 'Спрошу у «Искры»… (выберите, у кого)'; }
    if (v === 'dev') return q.dev || 'Решайте сами, как удобнее.';
    return '';
  }
  function chatEval(a) {
    a = a || {}; const c = a.c || {}, s = a.s || {}, w = a.w || {}, per = {};
    let sum = 0, critical = 0;
    CQ.forEach(q => {
      const v = c[q.id];
      if (!v) { per[q.id] = { st: 'none' }; return; }
      if (v !== q.ok) { per[q.id] = { st: 'bad', v }; if (q.ok === 'biz' && (v === 'an' || v === 'doc')) critical++; if (q.ok === 'task') critical++; return; }
      if (q.ok === 'doc') { const good = s[q.id] === q.sec; per[q.id] = { st: good ? 'ok' : 'warn', v }; sum += good ? 1 : 0.5; return; }
      if (q.ok === 'biz') { const good = (q.whoOk || []).includes(w[q.id]); per[q.id] = { st: good ? 'ok' : 'warn', v }; sum += good ? 1 : 0.5; return; }
      per[q.id] = { st: 'ok', v }; sum += 1;
    });
    return { per, score: sum / CQ.length, critical };
  }
  const chatTask = {
    id: 'chat', title: 'Спринт, день 3: вопросы команды — откуда ответ',
    simple: howBorder.simple,
    lead: ui.brief({
      situation: 'Среда, третий день первого спринта. Вы полдня были на встрече у Тимура Рашидовича, а в комментариях к ISK-112 накопилось девять вопросов — и ещё один Даша прислала в личку. Глеб и Даша ждут: без ответа дальше не пишут.',
      todo: [
        'Под каждым вопросом выберите источник ответа: «📄 Ответ в постановке» (выберите раздел), «✍️ Решаю я» (это поведение системы — зона аналитика), «📮 Спрошу „Искру“» (выберите, кого) или «🔧 Решает команда» (это «как сделать»).',
        'Для вопроса в личке выберите, где и как ответить.',
        'Читайте свои ответы и журнал решений внизу — так их увидит команда. Постановка v1.0 открывается над вопросами.',
        'Нажмите «Проверить». Засчитывается от 80 %, если вы нигде не решили правило бизнеса сами и не ответили в личке.'
      ],
      look: 'Сначала ищите ответ в постановке: если он там есть, отвечайте сразу со ссылкой на раздел. Если ответа нет — спросите себя: это деньги и правила (бизнес), поведение системы (вы) или устройство кода (команда)? Позиция аналитика: честное «не знаю — узнаю к 17:00» лучше уверенной выдумки.'
    }),
    blank: () => ({ c: {}, s: {}, w: {} }),
    reference: () => ({ c: Object.fromEntries(CQ.map(q => [q.id, q.ok])), s: Object.fromEntries(CQ.filter(q => q.ok === 'doc').map(q => [q.id, q.sec])), w: Object.fromEntries(CQ.filter(q => q.ok === 'biz').map(q => [q.id, q.whoOk[0]])) }),
    render(el, ctx) {
      el.classList.add('mdv-root');
      const a = ctx.ans; a.c = a.c || {}; a.s = a.s || {}; a.w = a.w || {};
      const rv = !!(ctx.result || ctx.readonly), D = ctx.readonly ? 'disabled' : '';
      el.innerHTML = `<div class="stack"><details class="more"><summary>📄 Постановка ISK-112 · версия 1.0</summary><div>${specHTML()}</div></details>
        <div class="eyebrow">Комментарии к ISK-112 · среда</div><div class="mdv-chat" data-ch></div>
        <div class="eyebrow">Журнал решений ISK-112</div><div data-jr></div></div>`;
      function draw() {
        const ev = chatEval(a);
        TR.$('[data-ch]', el).innerHTML = CQ.map(q => {
          const v = a.c[q.id], st = rv ? (ev.per[q.id].st === 'none' ? 'bad' : ev.per[q.id].st) : '';
          const opts = q.opts || QCAT;
          let extra = '';
          if (!q.opts && v === 'doc') extra = `<select data-sc="${q.id}" aria-label="Раздел постановки" ${D}><option value="">Какой раздел…</option>${SPEC.map(s => `<option value="${s.id}" ${a.s[q.id] === s.id ? 'selected' : ''}>${esc(s.h)}</option>`).join('')}</select>`;
          if (!q.opts && v === 'biz') extra = `<select data-wh="${q.id}" aria-label="Кого спросить" ${D}><option value="">Кого спросить…</option>${Object.keys(PERS).map(k => `<option value="${k}" ${a.w[q.id] === k ? 'selected' : ''}>${PERS[k]}</option>`).join('')}</select>`;
          const body = `${q.dm ? '<span class="mdv-dm">личное сообщение</span>' : ''}<div>${esc(q.q)}</div><div class="mdv-ctl">${opts.map(o => `<button type="button" class="btn xs" data-cv="${q.id}" data-v="${o.v}" aria-pressed="${v === o.v}" ${D}>${o.t}</button>`).join('')}${extra}</div>`;
          const rep = cqReply(q, a);
          return `<div class="mdv-msg ${st}">${ui.say(q.who, body)}${rep ? ui.say('me', esc(rep)) : ''}</div>`;
        }).join('');
        const rows = CQ.filter(q => a.c[q.id]).map(q => {
          const v = a.c[q.id];
          const dec = q.opts ? QCAT_T[v] : v === 'doc' ? (a.s[q.id] ? `по постановке, раздел «${SEC_T[a.s[q.id]]}»` : 'по постановке — раздел?') : v === 'biz' ? (a.w[q.id] ? `ждём ответ ${PERS_D[a.w[q.id]]} до ${q.due}` : 'ждём ответ — кого спросили?') : v === 'dev' ? 'решает команда, требование записано' : 'решение аналитика';
          const who = q.opts ? '—' : v === 'doc' ? 'постановка' : v === 'biz' ? (a.w[q.id] ? PERS[a.w[q.id]] : '—') : v === 'dev' ? 'Глеб и команда' : 'аналитик';
          return [q.at, esc(q.jt), esc(dec), esc(who)];
        });
        TR.$('[data-jr]', el).innerHTML = rows.length ? ui.table(['Когда', 'Вопрос', 'Решение / статус', 'Кто решает'], rows) : '<p class="small dim">Журнал пуст: ответьте хотя бы на один вопрос.</p>';
      }
      el.addEventListener('click', e => {
        const b = e.target.closest('[data-cv]'); if (!b || ctx.readonly) return;
        a.c[b.dataset.cv] = b.dataset.v;
        if (b.dataset.v !== 'doc') delete a.s[b.dataset.cv];
        if (b.dataset.v !== 'biz') delete a.w[b.dataset.cv];
        ctx.save(); ctx.decide('Вопрос в спринте ' + b.dataset.cv, QCAT_T[b.dataset.v]); draw();
      });
      el.addEventListener('change', e => {
        const s = e.target.closest('[data-sc], [data-wh]'); if (!s || ctx.readonly) return;
        if (s.dataset.sc) a.s[s.dataset.sc] = s.value; else a.w[s.dataset.wh] = s.value;
        ctx.save(); draw();
      });
      draw();
    },
    check(ans) {
      const ev = chatEval(ans), notes = [], c = (ans && ans.c) || {};
      const n = id => CQ.findIndex(q => q.id === id) + 1;
      const empty = CQ.filter(q => ev.per[q.id].st === 'none');
      if (empty.length) notes.push({ ok: false, html: `Без ответа: ${empty.map(q => '№' + n(q.id)).join(', ')}. Молчание — тоже ответ: разработчик решит сам.` });
      CQ.forEach(q => {
        const p = ev.per[q.id], v = c[q.id];
        if (p.st === 'bad') {
          if (q.ok === 'task') notes.push({ ok: false, html: `№${n(q.id)} (личка): ${v === 'dm' ? 'ответ в личке знают двое. Глеб сделает сервер по постановке, Лиза проверит по постановке — а приложение будет вести себя иначе.' : 'без ответа Даша сделает по-своему, и об изменении требования никто не узнает.'} Где должен жить ответ, чтобы его видела вся команда?` });
          else if (q.ok === 'biz' && (v === 'an' || v === 'doc')) notes.push({ ok: false, html: `№${n(q.id)}: ${v === 'doc' ? 'в постановке ответа нет — проверьте раздел «Открытые вопросы» и правила.' : 'вы решили сами, но это не поведение системы, а правило с деньгами или законом.'} Кто в «Искре» отвечает за такие решения?` });
          else if (q.ok === 'doc') notes.push({ ok: false, html: `№${n(q.id)}: ответ уже есть в постановке v1.0 — откройте её над вопросами. ${v === 'biz' ? 'Спрашивать бизнес второй раз о том, на что он уже ответил, — тратить его доверие.' : v === 'dev' ? 'Если отдать команде, правило «Искры» решат на глаз.' : 'Решать заново то, что уже решено, — путь к двум разным версиям правила.'}` });
          else if (q.ok === 'dev') notes.push({ ok: false, html: `№${n(q.id)} — про устройство внутри системы. Чьё это решение? И что тогда остаётся аналитику — какое условие он даёт вместо способа?` });
          else if (q.ok === 'an') notes.push({ ok: false, html: `№${n(q.id)}: это поведение системы для пользователя — текст и смысл предупреждения. ${v === 'biz' ? 'Правило уже решено бизнесом; формулировку готовит аналитик с Никой и потом показывает Марине Олеговне.' : 'Если отдать команде, текст о деньгах напишет разработчик «как получится».'}` });
        } else if (p.st === 'warn') notes.push({ ok: 'warn', html: q.ok === 'doc' ? `№${n(q.id)}: ответ в постановке есть, но в другом разделе. Ссылка должна вести туда, где ответ.` : `№${n(q.id)}: полка верная, но тот ли человек? Кто в «Искре» отвечает за ${q.id === 'q9' ? 'чеки и бухгалтерию' : 'правила записи'}?` });
      });
      if (!notes.length) notes.push({ ok: true, html: 'Все десять вопросов отвечены по делу, журнал решений заполнен.' });
      return {
        ok: ev.score >= 0.8 && !ev.critical, score: ev.score, notes,
        summary: `Верно: ${String(Math.round(ev.score * 20) / 2).replace('.', ',')} из ${CQ.length}.${ev.critical ? ` Критичных ошибок (решили за бизнес или ответили в личке): ${ev.critical}.` : ''}`,
        mentor: ev.critical ? 'Самые дорогие ошибки здесь — уверенно ответить за бизнес и ответить в личке. В первом случае Марина Олеговна или Ольга Викторовна узнают о «своём» решении на демо. Во втором — команда работает по двум разным версиям требований.' : null
      };
    },
    explain: `<ul class="checks">
        <li><b>Ответ в постановке (№1, 2, 4, 5).</b> Ровно 3:00 — бесплатно; время — по серверу; поздняя отмена считается неявкой; «время заняли» — в состояниях. Отвечаете сразу и со ссылкой на раздел. Если такие вопросы повторяются — пункт плохо виден, его стоит поднять выше или выделить.</li>
        <li><b>Решаю я (№8).</b> Текст предупреждения — поведение системы для пользователя: аналитик формулирует смысл вместе с Никой, а обещание про деньги сверяет с Мариной Олеговной.</li>
        <li><b>Спрошу «Искру» (№6, 9).</b> Число переносов — открытый вопрос к Марине Олеговне (он записан в постановке со сроком). Удержанная предоплата и чек — бухгалтерия и 54-ФЗ, это Ольга Викторовна. Ответ: «не знаю — узнаю до …».</li>
        <li><b>Решает команда (№3, 7).</b> Поле или таблица, очередь или прямой вызов — «как». Вы даёте условие: что должно сохраниться, что должно произойти при сбое.</li>
        <li><b>Личка (№10).</b> Отвечаете в задаче и отмечаете тех, кого это касается. Если Даша хочет изменить поведение — это изменение требования: обсуждение в задаче и новая версия постановки.</li>
      </ul>
      <p>Журнал решений — не бюрократия: через неделю Лиза спросит, почему поздняя отмена считается неявкой, и ответом будет ссылка, а не спор.</p>
      <p class="small muted">Источники: Карл Вигерс, Кандас Хоканссон, «Software Requirements Essentials» — отслеживать открытые вопросы и решения; BABOK v3 — управление жизненным циклом требований.</p>`,
    report: ans => { const ev = chatEval(ans), c = (ans && ans.c) || {}; return CQ.map((q, i) => `${i + 1}. ${q.q} → ${c[q.id] ? QCAT_T[c[q.id]] + (ans.s && ans.s[q.id] ? ' (' + SEC_T[ans.s[q.id]] + ')' : '') + (ans.w && ans.w[q.id] ? ' (' + PERS[ans.w[q.id]] + ')' : '') : '—'} ${ev.per[q.id].st === 'ok' ? '✓' : '✗'}`).join('\n'); }
  };

  // =====================================================================
  // Практика 4. Лаборатория: изменение посреди спринта
  // =====================================================================
  const D1 = [
    { v: 'yes', t: '«Конечно, сделаем к пятнице! Это же одно поле» — и сразу пишете Глебу и Даше, чтобы взяли в работу' },
    { v: 'eval', t: '«Понял задачу. Сегодня до 16:00 оценим с командой, что это затронет, и я вернусь с вариантами и сроками»' },
    { v: 'no', t: '«Спринт уже идёт, по Скраму менять ничего нельзя. Только в следующем спринте, не раньше»' }
  ];
  const IMP = [
    { id: 'app', s: 'окно отмены', t: 'Окно отмены в приложении — Даша', ok: true, miss: 'Даша узнаёт о поле в четверг вечером: окно отмены переделывается второй раз.', cost: 1 },
    { id: 'api', s: 'метод отмены и данные', t: 'Метод отмены и данные записи — Глеб', ok: true, miss: 'Глеб узнаёт последним: сервер не принимает причину, приложение получает ошибку.', cost: 1 },
    { id: 'dict', s: 'список причин у Марины Олеговны', t: 'Список причин: кто составляет и меняет — Марина Олеговна', ok: true, miss: 'Причины придумал Глеб: «Передумал», «Другое». На демо Марина Олеговна: «А где „машина не заводится“ и „нашёл дешевле“?» — переделка.', cost: 1 },
    { id: 'tests', s: 'тесты Лизы', t: 'Критерии приёмки и тесты — Лиза', ok: true, miss: 'Лиза тестирует по старым критериям: необязательность поля не проверена — у клиентов со старой версией приложения отмена падает.', esc: 1 },
    { id: 'mock', s: 'макет Ники', t: 'Макет окна отмены — Ника', ok: true, miss: 'Даша рисует список причин сама; Ника на ревью: «Это не наш компонент» — полдня.', cost: 0.5 },
    { id: 'report', s: 'отчёт для Тимура Рашидовича', t: 'Где Тимур Рашидович увидит статистику (в MVP отчётов нет)', ok: true, miss: 'Поле есть, а смотреть статистику негде. Тимур Рашидович: «И где мои цифры?»', trust: -4 },
    { id: 'br3', s: 'правило трёх часов', t: 'Правило бесплатной отмены за 3 часа (BR-3)', ok: false },
    { id: 'onec', s: 'синхронизация с 1С', t: 'Синхронизация остатков с 1С', ok: false },
    { id: 'push', s: 'push-уведомление', t: 'Push-уведомление об отмене', ok: false }
  ];
  const D3 = [
    { v: 'self', t: 'Решаете сами: добавляете в спринт — это просьба владельца, а Глеб и Даша успеют, если пару вечеров задержатся' },
    { v: 'owner', t: 'Приносите Тимуру Рашидовичу и Артёму оценку (около 3 дней на команду) и варианты: в следующий спринт; в этот — вместо переноса записи; упрощённо — список из 4 причин сейчас, отчёт после MVP. Решают они' },
    { v: 'vote', t: 'Выносите на завтрашний дейли: пусть команда проголосует, брать ли, — делать-то ей' }
  ];
  const D4 = [
    { v: 'ver', t: 'Выпустить ISK-112 v1.3: что изменилось и почему, ссылка на решение Тимура Рашидовича; комментарий в задаче с отметками Глеба, Даши, Лизы и Ники' },
    { v: 'chat', t: 'Написать в общий чат проекта: «Добавили причину отмены, список причин — у Марины Олеговны, учтите»' },
    { v: 'oral', t: 'Рассказать на дейли устно — все же там будут, а документы потом обновим' }
  ];
  function chSim(a) {
    a = a || {};
    const im = a.imp || {};
    const ev = [], R = { goal: true, days: 0, redo: 0, esc: 0, trust: 0, mood: 0 };
    const add = (d, t, k) => ev.push({ d, t, k });
    if (a.d1 === 'yes') { add('Ср 11:10', 'Тимур Рашидович: «Отлично, жду в пятницу». Обещание дано до оценки — команда о нём узнаёт из вашего сообщения.', 'warn'); R.mood -= 1; }
    if (a.d1 === 'no') { add('Ср 11:10', 'Тимур Рашидович: «Мне не нужна бюрократия, мне нужна статистика». Звонит Артёму напрямую — разговор уже без вас.', 'bad'); R.trust -= 6; }
    if (a.d1 === 'eval') { add('Ср 11:10', 'Тимур Рашидович: «Хорошо, жду в 16:00». Запрос записан с источником и временем.', 'ok'); R.trust += 2; }
    const picked = IMP.filter(x => im[x.id]), missed = IMP.filter(x => x.ok && !im[x.id]), extra = IMP.filter(x => !x.ok && im[x.id]);
    if (picked.some(x => x.ok)) add('Ср 14:30', `Анализ влияния: ${picked.filter(x => x.ok).map(x => x.s).join(', ')}.`, missed.length ? 'warn' : 'ok');
    if (extra.length) { add('Ср 15:00', `Лишние проверки (${extra.map(x => x.s).join(', ')}): Глеб полдня выяснял, что их изменение не касается.`, 'warn'); R.days += 0.25 * extra.length; }
    if (a.d3 === 'self') {
      add('Чт 10:00', 'Вы добавили задачу в спринт сами. Артём узнаёт из доски: «Кто разрешил?» Даша и Глеб задерживаются два вечера.', 'bad');
      add('Пт 16:00', 'Демо: причина отмены есть, а перенос записи — нет, его не успели. Цель спринта не выполнена.', 'bad');
      R.goal = false; R.days += 2; R.mood -= 2; R.trust += a.d1 === 'yes' ? 0 : -2;
    } else if (a.d3 === 'owner') {
      add('Ср 16:00', 'Тимур Рашидович и Артём выбирают: упрощённо — 4 причины от Марины Олеговны, в следующем спринте; отчёт — после MVP. Решение записано.', 'ok');
      add('Пт 16:00', 'Демо: отмена и перенос работают, как обещали. Причина отмены — первая задача следующего спринта.', 'ok');
      R.trust += a.d1 === 'yes' ? -4 : 4;
      if (a.d1 === 'yes') add('Ср 16:10', 'Но в пятницу ничего не будет: пришлось извиняться за обещание, данное утром.', 'bad');
    } else if (a.d3 === 'vote') {
      add('Чт 10:15', 'Команда проголосовала «взять». Артём отменяет: состав спринта меняет не голосование, а владелец продукта вместе с командой. Полдня споров.', 'bad');
      R.days += 0.5; R.mood -= 1; R.trust -= 2;
    }
    missed.forEach(x => { add(a.d3 === 'owner' ? 'след. спринт' : 'Пт', x.miss, 'bad'); R.days += x.cost || 0; if (x.cost) R.redo++; R.esc += x.esc || 0; R.trust += x.trust || 0; });
    if (a.d4 === 'chat') { add('Чт', 'Сообщение утонуло в общем чате: Лиза была на встрече, Ника в этом чате не состоит. Критерии не обновлены.', 'bad'); R.redo++; R.days += 0.5; if (!missed.some(x => x.id === 'tests')) R.esc += 1; }
    if (a.d4 === 'oral') { add('через неделю', 'Спорят, какие четыре причины утвердили и обязательно ли поле: записи нет.', 'bad'); R.redo++; R.days += 0.5; }
    if (a.d4 === 'ver') add('Чт 09:00', 'Все работают по v1.3: Лиза обновила критерии, Ника — макет, Даша и Глеб знают, что и когда.', 'ok');
    const ORD = { 'Ср 11:10': 1, 'Ср 14:30': 2, 'Ср 15:00': 3, 'Ср 16:00': 4, 'Ср 16:10': 4.5, 'Чт 09:00': 5, 'Чт': 5.5, 'Чт 10:00': 5.6, 'Чт 10:15': 5.7, 'Пт': 6, 'Пт 16:00': 7, 'след. спринт': 8, 'через неделю': 9 };
    ev.forEach((x, i) => { x.i = i; });
    ev.sort((p, q) => ((ORD[p.d] || 0) - (ORD[q.d] || 0)) || p.i - q.i);
    return { ev, R };
  }
  function chEval(a) {
    a = a || {}; const im = a.imp || {};
    const s1 = a.d1 === 'eval' ? 1 : a.d1 === 'no' ? 0.3 : 0;
    const okN = IMP.filter(x => x.ok).length, good = IMP.filter(x => x.ok && im[x.id]).length, bad = IMP.filter(x => !x.ok && im[x.id]).length;
    const s2 = Math.max(0, (good - bad) / okN);
    const s3 = a.d3 === 'owner' ? 1 : 0;
    const s4 = a.d4 === 'ver' ? 1 : a.d4 ? 0.2 : 0;
    const score = (s1 + s2 + s3 + s4) / 4;
    return { s1, s2, s3, s4, good, bad, okN, score, ok: score >= 0.8 && a.d3 === 'owner' && a.d1 === 'eval' && a.d4 === 'ver' && s2 >= 0.66 };
  }
  const changeTask = {
    id: 'change', title: 'Лаборатория: изменение посреди спринта',
    simple: howFlow.simple,
    lead: ui.brief({
      situation: 'Среда, 25 ноября, шестой день из десяти. ISK-112 в работе: Глеб доделывает возврат, Даша — окно переноса. Звонит Тимур Рашидович: «Хочу, чтобы клиент при отмене выбирал причину. Мне нужна статистика, почему отменяют. Это же одно поле — сделайте к пятнице».',
      todo: [
        'Примите четыре решения: что ответить сейчас, что затронет изменение (можно выбрать несколько), кто решает и как донести изменение до команды.',
        'Нажмите «▶ Прожить неделю» и посмотрите, что произошло к пятнице и после. Можно менять решения и прожить неделю заново.',
        'Нажмите «Проверить». Засчитывается от 80 %: нужно не обещать до оценки, найти почти всё, что затронуто, отдать решение владельцу и выпустить новую версию требования.'
      ],
      look: '«Одно поле» почти никогда не одно: экран, сервер, справочник, тесты, макет — и место, где эти данные кто-то будет смотреть. Позиция аналитика: он не говорит ни «да», ни «нет» до оценки, а превращает просьбу в решение с ценой, которое принимает владелец продукта.'
    }),
    blank: () => ({ d1: '', imp: {}, d3: '', d4: '', ran: false }),
    reference: () => ({ d1: 'eval', imp: Object.fromEntries(IMP.filter(x => x.ok).map(x => [x.id, true])), d3: 'owner', d4: 'ver', ran: true }),
    render(el, ctx) {
      el.classList.add('mdv-root');
      const a = ctx.ans; a.imp = a.imp || {};
      const rv = !!(ctx.result || ctx.readonly), D = ctx.readonly ? 'disabled' : '';
      el.innerHTML = `<div class="stack">${ui.say('timur', 'Хочу, чтобы клиент при отмене выбирал причину. Мне нужна статистика, почему отменяют. Это же одно поле — сделайте к пятнице.')}<div class="stack" data-ds></div><div data-run></div><div data-out></div></div>`;
      const ev0 = chEval(a);
      const radio = (name, list, val, okv) => list.map(o => `<button type="button" class="mdv-opt ${rv && val === o.v ? (o.v === okv ? 'ok' : 'bad') : ''}" data-r="${name}" data-v="${o.v}" aria-pressed="${val === o.v}" ${D}><span class="mk" aria-hidden="true"></span><span>${esc(o.t)}</span></button>`).join('');
      function decs() {
        TR.$('[data-ds]', el).innerHTML = `
          <div class="mdv-dec ${rv ? (ev0.s1 === 1 ? 'ok' : 'bad') : ''}"><div class="hd"><span class="mdv-lbl">Решение 1 · Ср 11:05</span><b>Что ответить Тимуру Рашидовичу сейчас?</b></div>${radio('d1', D1, a.d1, 'eval')}</div>
          <div class="mdv-dec ${rv ? (ev0.s2 >= 0.99 ? 'ok' : ev0.s2 >= 0.66 ? 'warn' : 'bad') : ''}"><div class="hd"><span class="mdv-lbl">Решение 2 · Ср 14:00</span><b>Что затронет «одно поле»? Отметьте всё, что придётся менять или решать.</b></div>
            ${TR.shuffle(IMP, 'mdv-imp').map(x => { const on = !!a.imp[x.id]; return `<button type="button" class="mdv-opt multi ${rv && on ? (x.ok ? 'ok' : 'bad') : ''}" data-im="${x.id}" aria-pressed="${on}" ${D}><span class="mk" aria-hidden="true"></span><span>${esc(x.t)}</span></button>`; }).join('')}</div>
          <div class="mdv-dec ${rv ? (ev0.s3 === 1 ? 'ok' : 'bad') : ''}"><div class="hd"><span class="mdv-lbl">Решение 3 · Ср 16:00</span><b>Кто и как решает, брать ли изменение?</b></div>${radio('d3', D3, a.d3, 'owner')}</div>
          <div class="mdv-dec ${rv ? (ev0.s4 === 1 ? 'ok' : 'bad') : ''}"><div class="hd"><span class="mdv-lbl">Решение 4 · после решения</span><b>Как оформить и донести изменение?</b></div>${radio('d4', D4, a.d4, 'ver')}</div>`;
      }
      function out() {
        const all = a.d1 && a.d3 && a.d4;
        TR.$('[data-run]', el).innerHTML = ctx.readonly ? '' : `<div class="row"><button type="button" class="btn primary" data-go ${all ? '' : 'disabled'}>▶ Прожить неделю</button><span class="small dim">${all ? 'Можно менять решения и прожить неделю заново.' : 'Сначала примите решения 1, 3 и 4.'}</span></div>`;
        if (!(a.ran && all) && !rv) { TR.$('[data-out]', el).innerHTML = ''; return; }
        if (!all) { TR.$('[data-out]', el).innerHTML = ''; return; }
        const { ev, R } = chSim(a);
        const st = (k, v, cls, s) => `<div class="stat"><span class="k">${k}</span><span class="v ${cls}">${v}</span><span class="s">${s}</span></div>`;
        TR.$('[data-out]', el).innerHTML = `<div class="mdv-res"><div class="eyebrow">Что произошло</div>
          <div class="mdv-stats5">${st('Цель спринта', R.goal ? '✓' : '✕', R.goal ? 'ok' : 'bad', R.goal ? 'выполнена' : 'сорвана')}${st('Лишние дни', half(R.days), R.days > 2 ? 'bad' : R.days ? 'warn' : 'ok', 'работы команды')}${st('Переделки', R.redo, R.redo > 1 ? 'bad' : R.redo ? 'warn' : 'ok', 'после кода')}${st('У клиентов', R.esc, R.esc ? 'bad' : 'ok', R.esc ? 'дефект' : 'без дефектов')}${st('Доверие', (R.trust > 0 ? '+' : '') + R.trust, R.trust > 0 ? 'ok' : R.trust < 0 ? 'bad' : 'warn', 'Тимура Рашидовича')}</div>
          <div class="mdv-tl">${ev.map(x => `<div class="mdv-ev ${x.k}"><span class="t">${esc(x.d)}</span><span>${esc(x.t)}</span></div>`).join('')}</div></div>`;
      }
      decs(); out();
      el.addEventListener('click', e => {
        if (ctx.readonly) return;
        const r = e.target.closest('[data-r]'), im = e.target.closest('[data-im]'), go = e.target.closest('[data-go]');
        if (r) { a[r.dataset.r] = r.dataset.v; a.ran = false; ctx.decide('Изменение посреди спринта: ' + r.dataset.r, (r.dataset.r === 'd1' ? D1 : r.dataset.r === 'd3' ? D3 : D4).find(x => x.v === r.dataset.v).t); }
        else if (im) { a.imp[im.dataset.im] = !a.imp[im.dataset.im]; if (!a.imp[im.dataset.im]) delete a.imp[im.dataset.im]; a.ran = false; }
        else if (go) { a.ran = true; }
        else return;
        ctx.save(); decs(); out();
        if (go) { const o = TR.$('[data-out]', el); o && o.scrollIntoView && o.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
      });
    },
    check(ans) {
      const ev = chEval(ans), notes = [], a = ans || {};
      if (!a.d1) notes.push({ ok: false, html: 'Решение 1 не принято.' });
      else if (a.d1 === 'yes') notes.push({ ok: false, html: 'Решение 1: вы пообещали срок за команду, не зная, что затронет изменение. Кто будет делать — и что они уже делают?' });
      else if (a.d1 === 'no') notes.push({ ok: 'warn', html: 'Решение 1: «нельзя» без оценки звучит как бюрократия, и разговор уходит через вашу голову. Можно ли не обещать и не отказывать одновременно?' });
      else notes.push({ ok: true, html: 'Решение 1: не обещали и не отказали — взяли время на оценку и назвали срок ответа.' });
      if (ev.good < ev.okN) notes.push({ ok: ev.s2 >= 0.66 ? 'warn' : false, html: `Решение 2: найдено ${ev.good} из ${ev.okN} затронутых мест. Пройдите путь поля: кто его показывает, кто принимает и хранит, кто решает, какие причины бывают, кто проверяет, кто рисует — и где Тимур Рашидович будет смотреть цифры?` });
      if (ev.bad) notes.push({ ok: 'warn', html: `Решение 2: отмечено лишнее (${ev.bad}). Меняет ли причина отмены правило трёх часов, склад или уведомление? Лишняя проверка — тоже время команды.` });
      if (ev.good === ev.okN && !ev.bad) notes.push({ ok: true, html: 'Решение 2: влияние оценено полностью, включая неочевидное — справочник причин и отчёт.' });
      if (a.d3 !== 'owner') notes.push({ ok: false, html: a.d3 ? `Решение 3: ${a.d3 === 'self' ? 'менять состав спринта в одиночку — решать за владельца продукта и команду одновременно.' : 'голосование команды не заменяет решения о ценности: что важнее — перенос записи или статистика причин?'} Кто отвечает за приоритеты и что ему нужно, чтобы решить?` : 'Решение 3 не принято.' });
      else notes.push({ ok: true, html: 'Решение 3: решение за владельцем продукта, у него на руках оценка и варианты.' });
      if (a.d4 !== 'ver') notes.push({ ok: false, html: a.d4 ? 'Решение 4: устное или чатовое сообщение не меняет требование. По какому документу Лиза будет проверять, а Даша — делать?' : 'Решение 4 не принято.' });
      else notes.push({ ok: true, html: 'Решение 4: новая версия с причиной изменения и отметками всех, кого касается.' });
      return {
        ok: ev.ok, score: ev.score, notes,
        summary: `Решения: ответ — ${Math.round(ev.s1 * 100)} %, влияние — ${Math.round(ev.s2 * 100)} %, кто решает — ${Math.round(ev.s3 * 100)} %, как донести — ${Math.round(ev.s4 * 100)} %.`,
        mentor: a.d1 === 'yes' && a.d3 === 'self' ? 'Это ловушка «хорошего аналитика»: заказчику приятно, команде — овертайм, а цель спринта сорвана. Ваша сила не в «да», а в том, что Тимур Рашидович через пять часов получает честный выбор с ценой.' : null
      };
    },
    explain: `<ul class="checks">
        <li><b>Не «да» и не «нет», а «оценю и вернусь в 16:00».</b> Изменение посреди спринта — нормальная жизнь. Ошибка — обещать срок за команду или отказывать без разговора.</li>
        <li><b>Анализ влияния.</b> «Одно поле» трогает экран (Даша), сервер и данные (Глеб), справочник причин (его ведёт бизнес — Марина Олеговна), тесты (Лиза), макет (Ника) и, главное, место, где Тимур Рашидович увидит статистику: без отчёта поле бесполезно. Правило трёх часов, 1С и push не затронуты.</li>
        <li><b>Решает владелец продукта.</b> Аналитик приносит оценку команды и варианты с последствиями: «в следующий спринт», «вместо переноса записи», «упрощённо». Выбирают Тимур Рашидович с Артёмом. По Скрам-гайду состав работы спринта уточняют вместе с командой, а цель спринта не жертвуют молча.</li>
        <li><b>Новая версия требования.</b> v1.3 с записью «что, почему, кто решил» и отметками всех, кого касается. Тогда Лиза проверяет по актуальным критериям, а через месяц никто не спорит, откуда взялось поле.</li>
      </ul>
      <p>Подробно процесс управления изменениями — запрос, анализ влияния, трассировка, базовая версия — разберём в тренировке «Работа с требованиями» (модуль 2).</p>
      <p class="small muted">Источники: Скрам-гайд 2020 — цель спринта и уточнение работы; Карл Вигерс, Джой Битти — управление изменениями требований и анализ влияния; BABOK v3 — оценка изменений требований.</p>`,
    report: ans => { const a = ans || {}, ev = chEval(a), im = a.imp || {}; return `1. ${(D1.find(x => x.v === a.d1) || { t: '—' }).t}\n2. Влияние: ${IMP.filter(x => im[x.id]).map(x => x.t).join('; ') || '—'}\n3. ${(D3.find(x => x.v === a.d3) || { t: '—' }).t}\n4. ${(D4.find(x => x.v === a.d4) || { t: '—' }).t}\nБалл: ${Math.round(ev.score * 100)} %`; }
  };

  // =====================================================================
  // Практика 5. Ответ Артёму своими словами
  // =====================================================================
  const W_RUBRIC = [
    'Вопросы всё равно прозвучат — вопрос только когда: на груминге ответ стоит минуты, на тесте и на демо — дни переделки',
    'Постановка закрывает то, что разработчик иначе додумает сам: цель, правила с границами (ровно 3:00), ошибки, данные, критерии приёмки, открытые вопросы с ответственным',
    'Есть пример из ISK-112: «по ситуации», «деньги возвращаются», «удалить из базы», забытый возврат предоплаты с чеком на оценке, противоречие приложения и сервера',
    'Аналитик не решает за бизнес и команду: правила — «Искра», реализация — Глеб; аналитик знает, у кого ответ, и записывает его',
    'Сопровождение экономит время: ответы в задаче и журнал решений, изменения через версии, три амиго за 30 минут вместо споров на демо',
    'Вывод про срок: 15 марта ближе с короткими встречами и полной постановкой, а не без них; формат можно облегчить для маленьких задач'
  ];
  const W_REF = 'Артём, я понимаю про 15 марта — именно поэтому не хочу экономить на постановке. Вопросы Глеба всё равно прозвучат, вопрос только когда. На груминге ISK-112 он за полчаса нашёл «по ситуации», «деньги возвращаются» и «удалить из базы»: каждая такая фраза в спринте стала бы днём переделки, а Глеб решил бы сам, и не так, как Марина Олеговна. На оценке разброс 3 и 13 вскрыл забытый возврат предоплаты с чеком возврата — без этого задача не влезла бы в спринт. Три амиго — 30 минут втроём: Лиза задаёт «ровно за 3 часа — можно?», и мы не получаем приложение и сервер с разными правилами. Я при этом не решаю за других: правила — у «Искры», реализация — у Глеба, а я знаю, у кого ответ, и записываю его в задаче, чтобы все работали по одной версии. Когда в среду Тимур Рашидович попросит «одно поле», я за два часа покажу, что оно трогает, и вы решите, а не узнаете на демо. Давайте договоримся: маленьким задачам — короткая постановка, но грумингов и трёх амиго для задач вроде отмены и оплаты не отменяем — так мы к 15 марта успеем, а не будем переделывать.';
  const whyTask = {
    id: 'why', title: 'Ответ Артёму: зачем постановка, груминг и три амиго',
    simple: howFlow.simple,
    lead: ui.brief({
      situation: 'Ретроспектива перед первым спринтом. Артём: «До MVP 15 марта четыре месяца. Давай без формальностей: пишешь задачу в две строки, без грумингов и трёх амиго — Глеб опытный, сам разберётся. Сэкономим время».',
      todo: [
        'Ответьте Артёму своими словами: 6–10 предложений, от 300 символов. Он руководитель проекта — его убедят сроки и примеры, а не «так правильно».',
        'Опирайтесь на сегодняшнее: дыры в черновике, оценку 3/13, вопросы в спринте, изменение от Тимура Рашидовича.',
        'Нажмите «Проверить с Верой (Claude)» или «Сверить с эталоном самому» и отметьте пункты, которые у вас прозвучали. Затем «Проверить». Засчитывается от 60 %.'
      ],
      look: 'Сильный ответ не спорит с целью Артёма, а показывает, что постановка и короткие встречи как раз сокращают путь к 15 марта. Позиция аналитика: он отвечает за то, чтобы задача была понятна до кода, и предлагает облегчить процесс там, где это безопасно.'
    }),
    blank: () => ({ j: {} }),
    reference: () => ({ j: { text: W_REF, self: W_RUBRIC.map(() => true) } }),
    render(el, ctx) {
      el.classList.add('mdv-root');
      const a = ctx.ans; a.j = a.j || {};
      el.innerHTML = ui.say('artem', 'Давай без формальностей: задача в две строки, без грумингов и трёх амиго. Глеб опытный, сам разберётся. Нам к 15 марта успеть надо.') + ui.say('gleb', 'Я-то разберусь… Но потом не говорите, что я сделал не то.') + '<div style="margin-top:12px"></div>';
      const j = document.createElement('div'); el.appendChild(j);
      ui.justify(j, {
        id: 'mdv-why', q: 'Ответ Артёму: зачем постановка, груминг и три амиго, если сроки горят?', placeholder: 'Артём, …',
        qPlain: 'Ответьте руководителю проекта, который предлагает отказаться от подробной постановки задач, груминга и встреч трёх амиго ради сроков MVP. Объясните на кейсе сети автосервисов «Искра» (задача «Отмена и перенос записи», правила BR-2, BR-3, BR-4), почему это не сэкономит время, и предложите разумный компромисс.',
        rubric: W_RUBRIC, reference: W_REF, value: a.j, readonly: ctx.readonly, minLen: 300,
        onChange: v => { a.j = v; ctx.save(); ctx.decide('Ответ Артёму про постановку и груминг', v.text || ''); }
      });
    },
    check(ans) {
      const j = (ans && ans.j) || {}, s = ui.justifyScore(j), t = (j.text || '').trim(), notes = [];
      if (t.length < 300) notes.push({ ok: false, html: `Ответ короче 300 символов (${t.length}). Артёма убедят конкретные примеры и дни, а не общие слова.` });
      if (!(j.ai || j.self)) notes.push({ ok: false, html: 'Проверьте ответ: «Проверить с Верой» или «Сверить с эталоном самому» — и отметьте пункты, которые у вас есть.' });
      else if (s < 0.6) notes.push({ ok: false, html: 'Пока мало пунктов. Подумайте: когда прозвучат вопросы Глеба, если не на груминге? Что он решит сам? Чей это выбор — правила и реализация?' });
      else notes.push({ ok: true, html: `Ответ: ${Math.round(s * 100)} %.` });
      return { ok: s >= 0.6 && t.length >= 300, score: s, notes };
    },
    explain: `<p>Главная мысль: <b>вопросы к задаче будут всегда — постановка и короткие встречи переносят их туда, где ответ стоит минуты</b>. Без них Глеб не «разберётся сам» — он решит сам, и это решение увидят Марина Олеговна на демо и клиенты после релиза.</p>
      <p>Хороший ответ руководителю проекта говорит на его языке: дни, переделки, сорванная цель спринта. И предлагает компромисс: лёгкая постановка для маленьких задач, полная — для задач с деньгами и правилами, как отмена записи.</p>
      <p class="small muted">Источники: Гойко Аджич, «Спецификация на примерах»; Скрам-гайд 2020 — уточнение бэклога; Карл Вигерс, Джой Битти — стоимость ошибок в требованиях.</p>`,
    report: ans => `Ответ Артёму: ${(ans && ans.j && ans.j.text) || '—'}`
  };

  // =====================================================================
  TR.stage({
    id: ID,
    when: 'понедельник, 16 ноября, 10:30 · груминг бэклога перед первым спринтом',
    intro: [
      { who: 'artem', html: 'Через неделю стартует первый спринт. Сегодня груминг: Глеб, Даша и Лиза читают <b>ISK-112 «Отмена и перенос записи клиентом»</b>. Что не готово — в спринт не берём. Напоминаю: MVP — к 15 марта.' },
      { who: 'gleb', html: 'Прочитал черновик. Вопросов у меня штук пятнадцать. Начнём с простого: «если позже — по ситуации» — это по какой ситуации? И кто решил удалять запись из базы?' },
      { who: 'vera', html: 'Не пугайтесь: так и должно быть. Сегодня учимся работать с разработчиками — передавать задачу так, чтобы вопросы звучали до кода, сопровождать её в спринте и не решать за других. Правила BR-2, BR-3 и BR-4 Марина Олеговна прислала письмом после кик-оффа; подробное интервью со станцией будет в декабре.' }
    ],
    facts: ['F-noshow', 'F-goal', 'F-deadline', 'F-scope'],
    glossary: [
      { term: 'Постановка задачи', simple: 'Письмо разработчику, по которому он сделает задачу без вас: зачем, как, по каким правилам и как проверить.', tech: 'Артефакт аналитика: контекст и цель, сценарий, бизнес-правила, данные и API, состояния и ошибки, критерии приёмки, макеты, открытые вопросы.' },
      { term: 'Definition of Ready (DoR)', simple: 'Чек-лист команды: по нему задачу берут в спринт или возвращают на доработку.', tech: 'Практика Scrum-команд (в Скрам-гайде не описана): цель, критерии приёмки, макеты, зависимости, оценка. Не путать с Definition of Done — критериями готовности инкремента.' },
      { term: 'Груминг (уточнение бэклога)', simple: 'Встреча, где команда заранее разбирает будущие задачи: вопросы, разрезание, оценка.', tech: 'Backlog refinement — регулярная работа над элементами бэклога продукта: детализация, декомпозиция, оценка (Скрам-гайд 2020).' },
      { term: 'Три амиго', simple: 'Аналитик, разработчик и тестировщик полчаса проходят задачу на примерах, чтобы понимать её одинаково.', tech: 'Three Amigos — практика BDD и спецификации на примерах (Гойко Аджич): бизнес-взгляд, взгляд реализации и взгляд проверки над критериями приёмки.' },
      { term: 'Покер планирования', simple: 'Оценка задачи картами вслепую: все показывают одновременно, разброс обсуждают.', tech: 'Planning poker — оценка в сторипоинтах (условных единицах сложности) по ряду, близкому к Фибоначчи; снижает эффект якоря (Майк Кон, «Agile: оценка и планирование проектов»).' },
      { term: 'Журнал решений', simple: 'Таблица: какой был вопрос, что решили, кто и когда.', tech: 'Decision log — часть управления требованиями: решение, дата, автор, источник. Позволяет не пересматривать решения случайно.' },
      { term: 'Версия требования', simple: 'Номер редакции постановки и запись, что изменилось и почему.', tech: 'Версионирование и журнал изменений (change log) — управление изменениями требований (BABOK v3, Вигерс).' },
      { term: 'Ограничение', simple: '«Как», которое нельзя менять: его требует закон, договор или существующая система.', tech: 'Constraint — внешнее условие на решение (54-ФЗ, 152-ФЗ, правила ЮKassa). Записывается отдельно и с источником.' },
      { term: 'Технический долг', simple: 'Упрощение сейчас, за которое потом платят лишней работой.', tech: 'Technical debt (Уорд Каннингем, 1992): «проценты» — дополнительная работа при каждом изменении. Аналитик делает долг видимым в бэклоге с последствиями для бизнеса.' },
      { term: 'Демо (обзор спринта)', simple: 'Показ работающей функции заказчику в конце спринта и сбор замечаний.', tech: 'Sprint Review — рабочая встреча с заинтересованными сторонами по результату спринта (Скрам-гайд 2020); замечания попадают в бэклог.' }
    ],
    outro: 'Задача ISK-112 готова к спринту — и это не только ваша заслуга, а результат вопросов Глеба, Даши и Лизы. Вы собрали постановку из восьми блоков, отделили правила «Искры» от решений команды, научились отвечать на вопросы в задаче, а не в личке, и превращать «одно поле к пятнице» в решение с ценой. В четверг Лиза сядет читать требования к отмене и начнёт придумывать, как их проверить: посмотрим, выдержат ли «ровно 3:00» и «в течение 15 минут» взгляд тестировщика.',
    tasks: [howBrief, howBorder, howFlow, holesTask, asmTask, chatTask, changeTask, whyTask]
  });
})();
