/* Модуль 3, занятие 4: BPMN — продвинутый уровень.
   Теория: события по триггерам (конструктор «позиция × триггер»; сообщение, сигнал, ошибка, эскалация; таймеры —
   дата, длительность, цикл); граничные события и шлюз по событию (прерывающее и непрерывающее на фрагменте
   согласования, «кто первый» в шлюзе по событию, ошибка и эскалация на подпроцессах); структура (подпроцессы
   свёрнутые, событийные, вызов процесса; несколько пулов: клиент, «Искра», ЮKassa; шлюз «ИЛИ»; как упрощать).
   Практика: тип события для девяти ситуаций; TO-BE «Согласование доп. работ» — заполнить восемь слотов диаграммы;
   лаборатория «прерывающее или непрерывающее» — сценарии Елены по минутам с последствиями; упростить «спагетти»
   выдачи и оплаты (подпроцесс, пул ЮKassa, убрать интерфейс); объяснить TO-BE Марине Олеговне своими словами. */
'use strict';
(function () {
  const TR = window.TR, ui = TR.ui, esc = TR.esc;
  const ID = 'm3-bpmn2';

  if (!document.getElementById('m3b2-css')) document.head.insertAdjacentHTML('beforeend', `<style id="m3b2-css">
    .m3b2-root, .m3b2-root .stack > * { min-width: 0; }
    .m3b2-root .chip { white-space: normal; text-align: left; max-width: 100%; }
    .m3b2-root .seg button { white-space: normal; }
    .m3b2-lbl { font: 600 10.5px/1.3 var(--f-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--text-muted); }
    .m3b2-panel { border: 1px solid var(--border-strong); border-radius: 12px; padding: 12px 14px; background: var(--surface); display: grid; gap: 10px; font-size: 14px; min-width: 0; }
    .m3b2-panel h4 { font: 700 16px/1.3 var(--f-brand); margin: 0; }
    .m3b2-ex { border-left: 3px solid var(--accent); background: var(--surface-2); border-radius: 0 8px 8px 0; padding: 8px 12px; font-size: 14px; }
    .m3b2-two { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 14px; align-items: start; }
    .m3b2-two > * { min-width: 0; }
    .m3b2-con { display: grid; grid-template-columns: 120px minmax(0, 1fr); gap: 14px; align-items: center; }
    .m3b2-gl { border: 1px solid var(--border); border-radius: 12px; background: var(--surface-2); display: grid; place-items: center; min-height: 100px; }
    .m3b2-gl .board, .m3b2-opt .board, .m3b2-sit .board { border: 0; background: transparent; overflow: hidden; }
    .m3b2-gl svg, .m3b2-opt svg, .m3b2-sit svg { min-width: 0 !important; width: 100%; height: auto; }
    .m3b2-rows { display: grid; gap: 8px; }
    .m3b2-sit { display: grid; grid-template-columns: minmax(0, 1fr) 210px 64px; gap: 8px 12px; align-items: center; border: 1px solid var(--border); border-radius: 10px; padding: 8px 10px; background: var(--surface); font-size: 14px; }
    .m3b2-sit.ok { border-color: var(--ok); } .m3b2-sit.bad { border-color: var(--bad); background: var(--bad-soft); } .m3b2-sit.warn { border-color: var(--warn); }
    .m3b2-sit select { width: 100%; min-width: 0; }
    .m3b2-sit .why { grid-column: 1 / -1; font-size: 13px; color: var(--text-2); }
    .m3b2-opts { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 8px; }
    .m3b2-opt { border: 1px solid var(--border); background: var(--surface); color: var(--text); border-radius: 10px; padding: 4px 6px 8px; display: grid; gap: 2px; justify-items: center; text-align: center; font-size: 12.5px; line-height: 1.3; min-width: 0; }
    .m3b2-opt .board { max-width: 120px; width: 100%; }
    .m3b2-opt[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); }
    .m3b2-opt.ok { border-color: var(--ok); background: var(--ok-soft); } .m3b2-opt.bad { border-color: var(--bad); background: var(--bad-soft); }
    .m3b2-picks { display: flex; flex-wrap: wrap; gap: 6px; }
    .m3b2-ctl { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
    .m3b2-set { display: grid; grid-template-columns: 210px minmax(0, 1fr); gap: 8px 12px; align-items: center; font-size: 14px; }
    .m3b2-tl { display: flex; flex-wrap: wrap; gap: 6px; }
    .m3b2-fr { border-radius: 12px; padding: 10px 14px; border: 1px solid var(--border-strong); background: var(--surface-2); font-size: 14px; }
    .m3b2-fr.ok { border-color: var(--ok); } .m3b2-fr.bad { border-color: var(--bad); } .m3b2-fr.warn { border-color: var(--warn); } .m3b2-fr.accent { border-color: var(--accent); }
    .m3b2-cmp { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; }
    .m3b2-cmp > div { border: 1px solid var(--border); border-radius: 10px; padding: 8px 10px; background: var(--surface); font-size: 13.5px; display: grid; gap: 4px; align-content: start; }
    .m3b2-cmp b { font-size: 14.5px; }
    .m3b2-srow { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 6px 10px; align-items: center; border: 1px solid var(--border); border-radius: 10px; padding: 7px 10px; background: var(--surface); font-size: 14px; }
    .m3b2-srow.ok { border-color: var(--ok); } .m3b2-srow.bad { border-color: var(--bad); background: var(--bad-soft); } .m3b2-srow.warn { border-color: var(--warn); }
    .m3b2-srow .why { grid-column: 1 / -1; font-size: 13px; color: var(--text-2); }
    .m3b2-stats { display: flex; flex-wrap: wrap; gap: 8px; font-size: 13.5px; }
    .m3b2-stats span { border: 1px solid var(--border); border-radius: 99px; padding: 3px 10px; background: var(--surface); }
    @media (max-width: 760px) {
      .m3b2-two, .m3b2-set { grid-template-columns: minmax(0, 1fr); }
      .m3b2-cmp { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); }
      .m3b2-sit { grid-template-columns: minmax(0, 1fr) 56px; }
      .m3b2-sit select { grid-column: 1 / 2; }
      .m3b2-srow { grid-template-columns: minmax(0, 1fr); }
    }
  </style>`);

  // ---------- помощники ----------
  const interview = items => `<details class="more"><summary>Как об этом спрашивают на собеседовании</summary><div><ul class="checks">${items.map(x => `<li class="info"><b>${x[0]}</b> ${x[1]}</li>`).join('')}</ul></div></details>`;
  const mistakes = items => ui.note('warn', 'Типичные ошибки', `<ul class="checks">${items.map(x => `<li class="bad">${x}</li>`).join('')}</ul>`);
  // ui.bpmn сжимает SVG по ширине контейнера; задаём минимальную ширину, чтобы широкая схема прокручивалась, а не мельчала
  function diagram(host, cfg, scale) {
    const box = document.createElement('div'); host.appendChild(box);
    const h = ui.bpmn(box, cfg);
    const fix = () => { const s = box.querySelector('svg'); if (!s) return; const w = +((s.getAttribute('viewBox') || '').split(' ')[2]) || 0; if (w > 640) s.style.minWidth = Math.round(w * (scale || 0.8)) + 'px'; };
    fix();
    return { redraw(n) { h.redraw(n); fix(); }, box };
  }
  // Координаты сетки ui.bpmn (пулы с названиями и дорожками: слева 66 px) — для подписей потоков lx/ly,
  // потому что подписи двух граничных событий на одной задаче иначе налезают друг на друга.
  const CW = 140, RH = 84, colX = c => 66 + c * CW + CW / 2;
  const glyph = (type, ni) => ui.bpmnGlyph(type, '', ni ? { ni: true } : null);

  // ---------- TO-BE «Согласование доп. работ» ----------
  // Узлы-слоты можно подменять: over = { id: {type, ni} }
  function tobe(over) {
    over = over || {};
    const N = (id, def) => Object.assign({ id }, def, over[id] || {});
    const yS = 178; // верх дорожки «Система»: пул клиента 6+46, зазор 26, дорожка механика 100
    return {
      title: 'TO-BE: согласование дополнительных работ', colW: CW, rowH: RH,
      pools: [{ id: 'pk', t: 'Клиент', blackbox: true }, { id: 'pi', t: '«Искра Онлайн»', lanes: [{ id: 'mh', t: 'Механик' }, { id: 'sy', t: 'Система' }, { id: 'ms', t: 'Мастер-приёмщик' }] }],
      nodes: [
        N('a1', { type: 'start', t: 'Найдена доп. неисправность', lane: 'mh', col: 0 }),
        N('a2', { type: 'user', t: 'Сфотографировать и отметить проблему', lane: 'mh', col: 1 }),
        N('ph', { type: 'data-out', t: 'Фото проблемы', lane: 'mh', col: 2 }),
        N('a3', { type: 'user', t: 'Сформировать предложение с ценой', lane: 'ms', col: 2 }),
        N('a4', { type: 'xor', t: 'В пределах лимита?', lane: 'sy', col: 3, row: 1 }),
        N('a5', { type: 'service', t: 'Согласовать автоматически', lane: 'sy', col: 3, row: 0 }),
        N('a6', { type: 'send', t: 'Отправить предложение', lane: 'sy', col: 4, row: 1 }),
        N('a7', { type: 'receive', t: 'Ждать решения клиента', lane: 'sy', col: 5, row: 1 }),
        N('a9', { type: 'b-signal', attach: 'a7' }),
        N('a8', { type: 'b-timer', t: '20 мин', attach: 'a7', ni: true }),
        N('a10', { type: 'xor', t: 'Согласовано?', lane: 'sy', col: 6, row: 1 }),
        N('mg', { type: 'xor', lane: 'sy', col: 6, row: 0 }),
        N('a11', { type: 'service', t: 'Добавить работы в заказ-наряд', lane: 'sy', col: 7, row: 0 }),
        N('a12', { type: 'end', t: 'Доп. работы согласованы', lane: 'sy', col: 8, row: 0 }),
        N('a13', { type: 'end', t: 'Отклонено', lane: 'sy', col: 7, row: 1 }),
        N('a16', { type: 'service', t: 'Перевести в «Истекло»', lane: 'sy', col: 6, row: 2 }),
        N('a21', { type: 'end', t: 'Предложение истекло', lane: 'sy', col: 7, row: 2 }),
        N('a15', { type: 'user', t: 'Позвонить клиенту', lane: 'ms', col: 6 }),
        N('a17', { type: 'xor', t: 'Дозвонился?', lane: 'ms', col: 7 }),
        N('a18', { type: 'user', t: 'Внести решение клиента', lane: 'ms', col: 8 }),
        N('a19', { type: 'end', t: 'Решение внесено', lane: 'ms', col: 9 }),
        N('a20', { type: 'end', t: 'Ждём ответа в приложении', lane: 'ms', col: 8, row: 1 })
      ],
      flows: [
        { from: 'a1', to: 'a2' }, { from: 'a2', to: 'ph', kind: 'assoc' }, { from: 'a2', to: 'a3' }, { from: 'a3', to: 'a4' },
        { from: 'a4', to: 'a5', t: 'да', lx: colX(3) + 8, ly: yS + 8 + RH / 2 + 30 + 14 }, { from: 'a4', to: 'a6', t: 'нет' },
        { from: 'a5', to: 'mg' }, { from: 'a6', to: 'pk', kind: 'msg', t: 'фото и цена' }, { from: 'pk', to: 'a7', kind: 'msg', t: 'решение' },
        { from: 'a6', to: 'a7' }, { from: 'a7', to: 'a10' }, { from: 'a10', to: 'mg', t: 'да', lx: colX(6) + 8, ly: yS + 8 + RH / 2 + 30 + 14 }, { from: 'a10', to: 'a13', t: 'нет' },
        { from: 'mg', to: 'a11' }, { from: 'a11', to: 'a12' },
        { from: 'a9', to: 'a16', t: 'конец работ', lx: colX(5) - 70, ly: yS + 8 + 2 * RH + RH / 2 + 4 }, { from: 'a16', to: 'a21' },
        { from: 'a8', to: 'a15' }, { from: 'a15', to: 'a17' }, { from: 'a17', to: 'a18', t: 'да' }, { from: 'a17', to: 'a20', t: 'нет' }, { from: 'a18', to: 'a19' }
      ]
    };
  }
  // ---------- фрагмент ожидания решения (теория и лаборатория) ----------
  function frag(tm, sg) {
    const yS = 78;
    return {
      title: 'Фрагмент: ожидание решения клиента', colW: CW, rowH: RH,
      pools: [{ id: 'fk', t: 'Клиент', blackbox: true }, { id: 'fi', t: '«Искра Онлайн»', lanes: [{ id: 'fs', t: 'Система' }, { id: 'fm', t: 'Мастер-приёмщик' }] }],
      nodes: [
        { id: 'f6', type: 'send', t: 'Отправить предложение', lane: 'fs', col: 0 },
        { id: 'f7', type: 'receive', t: 'Ждать решения клиента', lane: 'fs', col: 1 },
        { id: 'fsig', type: 'b-signal', attach: 'f7', ni: sg === 'ni' },
        { id: 'ftm', type: 'b-timer', t: '20 мин', attach: 'f7', ni: tm === 'ni' },
        { id: 'f11', type: 'service', t: 'Учесть решение в заказ-наряде', lane: 'fs', col: 2 },
        { id: 'f12', type: 'end', t: 'Решение учтено', lane: 'fs', col: 3 },
        { id: 'f16', type: 'service', t: 'Перевести в «Истекло»', lane: 'fs', col: 2, row: 1 },
        { id: 'f21', type: 'end', t: 'Предложение истекло', lane: 'fs', col: 3, row: 1 },
        { id: 'f15', type: 'user', t: 'Позвонить клиенту', lane: 'fm', col: 2 },
        { id: 'f17', type: 'xor', t: 'Дозвонился?', lane: 'fm', col: 3 },
        { id: 'f18', type: 'user', t: 'Внести решение клиента', lane: 'fm', col: 4 },
        { id: 'f19', type: 'end', t: 'Решение внесено', lane: 'fm', col: 5 },
        { id: 'f20', type: 'end', t: 'Ждём ответа в приложении', lane: 'fm', col: 4, row: 1 }
      ],
      flows: [
        { from: 'f6', to: 'fk', kind: 'msg', t: 'предложение' }, { from: 'fk', to: 'f7', kind: 'msg', t: 'решение' },
        { from: 'f6', to: 'f7' }, { from: 'f7', to: 'f11' }, { from: 'f11', to: 'f12' },
        { from: 'fsig', to: 'f16', t: 'конец работ', lx: colX(1) - 70, ly: yS + 8 + RH + RH / 2 + 4 }, { from: 'f16', to: 'f21' },
        { from: 'ftm', to: 'f15' }, { from: 'f15', to: 'f17' }, { from: 'f17', to: 'f18', t: 'да' }, { from: 'f17', to: 'f20', t: 'нет' }, { from: 'f18', to: 'f19' }
      ]
    };
  }
  const SIG_NOTE = '<div class="small dim">Треугольник на рамке «Ждать решения клиента» — сигнал «Основные работы завершены» (его подаёт планшет механика, когда закрыта последняя основная работа). Часы — таймер 20 минут. Пунктирная обводка — непрерывающее событие.</div>';

  // =====================================================================
  // Теория 1. События: позиция × триггер; сообщение, сигнал, ошибка, эскалация; таймеры
  // =====================================================================
  const POS = [{ v: 'start', t: 'Начальное' }, { v: 'int', t: 'Промежуточное: ловит' }, { v: 'thr', t: 'Промежуточное: бросает' }, { v: 'b', t: 'Граничное' }, { v: 'end', t: 'Конечное' }];
  const TRG = [{ v: 'none', t: 'Без триггера' }, { v: 'msg', t: 'Сообщение' }, { v: 'timer', t: 'Таймер' }, { v: 'err', t: 'Ошибка' }, { v: 'esc', t: 'Эскалация' }, { v: 'signal', t: 'Сигнал' }, { v: 'cond', t: 'Условие' }, { v: 'term', t: 'Терминирующее' }];
  const ALLOW = { start: ['none', 'msg', 'timer', 'signal', 'cond'], int: ['msg', 'timer', 'signal', 'cond'], thr: ['none', 'msg', 'esc', 'signal'], b: ['msg', 'timer', 'err', 'esc', 'signal', 'cond'], end: ['none', 'msg', 'err', 'esc', 'signal', 'term'] };
  const POS_D = {
    start: 'Тонкий круг. Запускает экземпляр процесса. Входящих потоков управления нет.',
    int: 'Двойной круг, белый значок. Процесс стоит и ждёт, пока событие случится.',
    thr: 'Двойной круг, закрашенный значок. Процесс сам подаёт событие и сразу идёт дальше.',
    b: 'Двойной круг на рамке задачи или подпроцесса. Ловит событие, пока задача выполняется. Сплошная обводка — прерывает задачу, пунктир — нет.',
    end: 'Толстый круг, закрашенный значок. Ветка закончилась и, возможно, что-то «бросила» наружу.'
  };
  const TRG_D = {
    none: 'Просто начало, промежуточная отметка или конец — без причины-триггера.',
    msg: 'Конверт. Сообщение адресно, от одного участника другому: push, SMS, вебхук ЮKassa, письмо.',
    timer: 'Часы. Дата, длительность или цикл: «15 марта», «20 минут», «каждый день в 21:00».',
    err: 'Молния. Авария, после которой продолжать нельзя: ловится только на границе и всегда прерывает.',
    esc: 'Стрелка вверх. «Доложить наверх»: сообщить ответственному, работа может продолжаться.',
    signal: 'Треугольник. Объявление «по громкой связи»: слышат все, кто его ждёт, адресата нет.',
    cond: 'Лист с линиями. Срабатывает, когда условие на данных стало истинным: «остаток на складе < 2».',
    term: 'Закрашенный круг. Немедленно останавливает весь экземпляр процесса, все параллельные ветки.'
  };
  const EX = {
    'start-timer': 'Каждый день в 21:00 — запустить сверку оплат с ЮKassa.', 'start-msg': 'Пришёл вебхук ЮKassa «оплачено» — начать выдачу чека.', 'start-signal': 'Объявлено «Станция закрыта на санитарный день» — запустить перенос записей.', 'start-cond': 'Остаток колодок меньше 4 — запустить заказ поставщику.', 'start-none': 'Механик нашёл доп. неисправность.',
    'int-msg': 'Ждём подтверждения резерва запчасти от 1С.', 'int-timer': 'Ждём до 08:00 следующего дня.', 'int-signal': 'Ждём сигнала «Основные работы завершены».', 'int-cond': 'Ждём, пока статус оплаты станет «paid».',
    'thr-none': 'Отметка «Запись подтверждена» — для отчёта о ходе процесса.', 'thr-msg': 'Отправить клиенту push «Машина готова» и идти дальше.', 'thr-esc': 'Сообщить старшему мастеру, что срок под угрозой, — и продолжить.', 'thr-signal': 'Объявить «Основные работы завершены» всем ожидающим.',
    'b-msg': 'Пока идёт ремонт, клиент прислал «отменяю» — прервать.', 'b-timer': 'Ждать решения 20 минут; непрерывающий — звонок мастера параллельно.', 'b-err': 'Оплата отклонена банком — прервать «Оплатить онлайн», предложить кассу.', 'b-esc': 'Подпроцесс ремонта доложил «срок под угрозой» — предупредить клиента.', 'b-signal': 'Сигнал «Основные работы завершены» прерывает ожидание решения.', 'b-cond': 'Сумма заказ-наряда превысила лимит договора — уведомить завгара.',
    'end-none': 'Клиент записан.', 'end-msg': 'Завершить, отправив клиенту чек.', 'end-err': 'Подпроцесс оплаты завершился ошибкой «Отклонено банком».', 'end-esc': 'Подпроцесс закончился эскалацией «нужна помощь старшего мастера».', 'end-signal': 'Объявить «Заказ-наряд закрыт» всем, кто ждёт.', 'end-term': 'Клиент отменил запись — остановить всё: резерв, напоминания, звонки.'
  };
  const evType = (p, t) => p === 'start' ? (t === 'none' ? 'start' : 'start-' + t) : p === 'int' ? 'int-' + t : p === 'thr' ? (t === 'none' ? 'int' : 'int-' + t + '-throw') : p === 'b' ? 'b-' + t : (t === 'none' ? 'end' : 'end-' + t);
  function drawCon(pane) {
    let p = 'b', t = 'timer', ni = false;
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Любое событие BPMN — это <b>позиция</b> (где оно в процессе) и <b>триггер</b> (что его вызывает). Форму круга задаёт позиция, значок внутри — триггер. Соберите событие и посмотрите, существует ли оно в стандарте.</p>
      <div class="m3b2-lbl">Позиция</div>${ui.seg('p', POS, p, 'sm')}
      <div class="m3b2-lbl">Триггер</div>${ui.seg('t', TRG, t, 'sm')}
      <div data-n></div>
      <div class="m3b2-con"><div class="m3b2-gl" data-g></div><div class="m3b2-panel" data-o></div></div>
    </div>`;
    function draw() {
      const ok = ALLOW[p].includes(t), key = p + '-' + t;
      TR.$('[data-n]', pane).innerHTML = p === 'b' && ok && t !== 'err' ? ui.seg('ni', [{ v: '0', t: 'Прерывающее' }, { v: '1', t: 'Непрерывающее' }], ni ? '1' : '0', 'sm') : '';
      TR.$('[data-g]', pane).innerHTML = ok ? glyph(evType(p, t), p === 'b' && ni && t !== 'err') : '<span class="small dim" style="padding:10px;text-align:center">такого события нет</span>';
      let h = `<h4>${esc(POS.find(x => x.v === p).t)} · ${esc(TRG.find(x => x.v === t).t.toLowerCase())}</h4>`;
      if (ok) h += `<div>${esc(POS_D[p])}</div><div>${esc(TRG_D[t])}</div>${EX[key] ? `<div class="m3b2-ex"><b>В «Искре»:</b> ${esc(EX[key])}</div>` : ''}`;
      else h += `<div>${p === 'start' && (t === 'err' || t === 'esc') ? 'Начальные события ошибки и эскалации бывают только у событийного подпроцесса (о нём — в третьем разделе): он ловит ошибку внутри родителя.' : t === 'term' ? 'Терминирующим бывает только конечное событие: оно «выключает» весь экземпляр.' : p === 'int' && (t === 'err' || t === 'esc') ? 'Ошибку и эскалацию не ждут посреди потока — их ловят на границе задачи или подпроцесса.' : t === 'none' ? 'Без триггера событие не может ничего ловить: чего ждать?' : 'Такое сочетание стандарт BPMN 2.0 не допускает.'}</div>`;
      TR.$('[data-o]', pane).innerHTML = h;
    }
    ui.onSeg(pane, (g, v) => { if (g === 'p') p = v; else if (g === 't') t = v; else if (g === 'ni') ni = v === '1'; else return; draw(); });
    draw();
  }
  function drawCmp(pane) {
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Четыре триггера, которые путают чаще всего. Главный вопрос: <b>кому</b> адресовано и <b>что будет с текущей работой</b>.</p>
      <div class="m3b2-cmp">
        <div>${glyph('int-msg-throw')}<b>Сообщение</b><span>Адресно: от одного участника конкретному другому. Между пулами.</span><span class="small dim">Как письмо с адресом.</span><span><i>«Искра»:</i> push Елене с предложением.</span></div>
        <div>${glyph('int-signal-throw')}<b>Сигнал</b><span>Широковещательно: слышат все, кто ждёт этот сигнал, отправитель не знает получателей.</span><span class="small dim">Как объявление по громкой связи на станции.</span><span><i>«Искра»:</i> «Основные работы завершены».</span></div>
        <div>${glyph('b-err')}<b>Ошибка</b><span>Авария: дальше по плану нельзя. Ловится на границе и всегда прерывает.</span><span class="small dim">Как пожарная тревога: работу бросают.</span><span><i>«Искра»:</i> банк отклонил оплату.</span></div>
        <div>${glyph('b-esc', true)}<b>Эскалация</b><span>Доложить ответственному выше. Может не прерывать работу.</span><span class="small dim">Как «позовите старшего».</span><span><i>«Искра»:</i> ремонт не успевает к сроку — мастер предупреждает клиента.</span></div>
      </div>
      ${ui.note('info', 'Ошибка в бизнес-смысле — не всегда «ошибка» BPMN', 'Клиент отказался от доп. работ — это не ошибка, а обычный исход: шлюз «Согласовано?» и ветка «нет». Событие ошибки — для ситуаций, когда задача не может завершиться нормально: сбой оплаты, нет связи с 1С.')}
    </div>`;
  }
  function drawTimers(pane) {
    let k = 'dur';
    const T = {
      date: { t: 'Дата и время', iso: '2027-03-15T09:00', ex: '«15 марта, 9:00 — запуск MVP»: событие сработает один раз в указанный момент.', g: 'start-timer' },
      dur: { t: 'Длительность', iso: 'PT20M', ex: '«20 минут без ответа» (BR-8): отсчёт идёт с момента, когда токен пришёл к событию или задача с граничным таймером началась.', g: 'b-timer' },
      cyc: { t: 'Цикл', iso: 'R/2027-01-11T21:00/P1D', ex: '«Каждый день в 21:00» — сверка оплат с ЮKassa после закрытия станций.', g: 'start-timer' }
    };
    pane.innerHTML = `<div class="stack">
      <p class="small muted">У таймера три вида определения, в BPMN 2.0 они записываются в формате ISO 8601: <b>timeDate</b>, <b>timeDuration</b>, <b>timeCycle</b>. Аналитику формат писать не обязательно, но на диаграмме должно быть понятно, какой именно срок имеется в виду и <b>от какого момента</b> он считается.</p>
      ${ui.seg('tm', [{ v: 'date', t: 'Дата' }, { v: 'dur', t: 'Длительность' }, { v: 'cyc', t: 'Цикл' }], k)}
      <div class="m3b2-con"><div class="m3b2-gl" data-g></div><div class="m3b2-panel" data-o></div></div>
      ${ui.note('warn', 'Вопрос Лизы, который надо предвидеть', '«20 минут — рабочих или календарных? А если механик отметил проблему в 20:50, а станция закрывается в 21:00?» Ответ записывают в требование рядом с диаграммой: например, «таймер считается в часы работы станции; предложение, отправленное после 20:40, мастер обсуждает утром».')}
    </div>`;
    function draw() { const x = T[k]; TR.$('[data-g]', pane).innerHTML = glyph(x.g, k === 'dur'); TR.$('[data-o]', pane).innerHTML = `<h4>${esc(x.t)}</h4><div>${esc(x.ex)}</div><div class="small"><span class="m3b2-lbl">ISO 8601</span> <code>${esc(x.iso)}</code></div>`; }
    ui.onSeg(pane, (g, v) => { if (g === 'tm') { k = v; draw(); } });
    draw();
  }
  const howEvents = {
    id: 'how-events', covers: ['evtypes'], title: 'Как это работает: события — таймеры, сообщения, сигналы, ошибки, эскалации', free: true, noReset: true,
    simple: {
      icon: '⏱️',
      plain: 'События — это «что-то случилось»: пришло сообщение, прошло время, что-то сломалось, начальника надо позвать. Форма круга говорит, где событие в процессе, значок — что именно случилось.',
      analogy: 'Будильник — таймер, звонок в дверь — сообщение, объявление в аэропорту — сигнал, пожарная тревога — ошибка, «позовите администратора» — эскалация.',
      tech: 'BPMN 2.0, раздел 10.5: события делятся на начальные, промежуточные (ловящие и бросающие), граничные (прерывающие и непрерывающие) и конечные; определения событий — message, timer, error, escalation, cancel, compensation, conditional, link, signal, terminate, multiple. В этом занятии — восемь самых нужных аналитику.'
    },
    lead: ui.brief({
      situation: 'Среда, 23 декабря. Сегодня TO-BE самого больного места — согласования доп. работ: машина стоит на подъёмнике 1 ч 40 мин, 38 % клиентов не берут трубку. В правиле BR-8 сразу три события: «20 минут без ответа», «не дозвонился», «основные работы закончены». Чтобы их нарисовать, нужен словарь событий.',
      todo: ['Вкладка «Конструктор»: соберите несколько событий, попробуйте и несуществующие сочетания.', 'Вкладка «Сообщение, сигнал, ошибка, эскалация»: сравните четыре триггера.', 'Вкладка «Таймеры»: посмотрите три вида.'],
      look: 'Белый значок — событие ловят (ждут), закрашенный — бросают (подают сами). Это читается быстрее любых подписей.'
    }),
    render(el) {
      el.classList.add('m3b2-root');
      const t = document.createElement('div'); el.appendChild(t);
      ui.tabs(t, [{ id: 'c', t: 'Конструктор', render: drawCon }, { id: 'm', t: 'Сообщение, сигнал, ошибка, эскалация', render: drawCmp }, { id: 't', t: 'Таймеры', render: drawTimers }], 'c');
      el.insertAdjacentHTML('beforeend', `<div class="stack tight" style="margin-top:12px">
        ${mistakes(['Сообщение между дорожками одного пула. Сообщения — только между участниками; внутри пула — поток управления или сигнал.', 'Отказ клиента нарисован событием ошибки. Это обычный исход — шлюз и ветка «нет».', 'Таймер без точки отсчёта: «20 минут» — от чего? От отправки предложения, от прочтения push?', 'Промежуточное событие с закрашенным значком там, где процесс должен ждать. Закрашенный — «бросаю», белый — «жду».'])}
        ${interview([['«Чем сигнал отличается от сообщения?»', 'Сообщение адресовано конкретному участнику, сигнал — широковещательный, его ловят все подписанные экземпляры и процессы.'], ['«Чем ошибка отличается от эскалации?»', 'Ошибка — критическая, всегда прерывает активность, на которой поймана. Эскалация — уведомление ответственного, может быть непрерывающей.'], ['«Какие бывают таймеры?»', 'Дата (timeDate), длительность (timeDuration), цикл (timeCycle) — в формате ISO 8601. Как начальные, промежуточные и граничные.']])}
      </div>`);
    }
  };

  // =====================================================================
  // Теория 2. Граничные события: прерывающие и непрерывающие; шлюз по событию; ошибка на подпроцессе
  // =====================================================================
  function drawBoundary(pane) {
    let tm = 'ni', m = 0;
    pane.innerHTML = `<div class="stack">
      <p class="small muted"><b>Граничное событие</b> «прилеплено» к рамке задачи и слушает, пока задача выполняется. <b>Прерывающее</b> (сплошная двойная обводка) отменяет задачу и уводит токен по своей ветке. <b>Непрерывающее</b> (пунктир) оставляет задачу работать и создаёт <b>второй</b> токен для своей ветки. Переключите тип таймера и пройдите по минутам: Елена отвечает в приложении на 22-й минуте, когда мастер ей уже звонит.</p>
      ${ui.seg('bt', [{ v: 'ni', t: 'Таймер непрерывающий' }, { v: 'int', t: 'Таймер прерывающий' }], tm)}
      <div data-d></div>${SIG_NOTE}
      <div class="m3b2-tl" data-t></div><div data-o></div>
    </div>`;
    const MIN = [0, 20, 22];
    let d;
    function look() {
      const hl = {}, badge = {}, set = (ids, k) => ids.forEach(i => { hl[i] = k; });
      if (m === 0) set(['f7'], 'accent');
      if (m === 1) { set(['f6'], 'ok'); set(tm === 'ni' ? ['f7', 'f15'] : ['f15'], 'accent'); if (tm !== 'ni') set(['f7'], 'warn'); }
      if (m === 2) { set(['f6', 'f15', 'f17', 'f20'], 'ok'); if (tm === 'ni') set(['f7', 'f11', 'f12'], 'ok'); else set(['f7'], 'bad'); }
      Object.keys(hl).forEach(i => { if (hl[i] === 'accent') badge[i] = '●'; });
      const c = frag(tm, 'int'); c.hl = hl; c.nodes = c.nodes.map(n => badge[n.id] ? Object.assign({}, n, { badge: badge[n.id] }) : n); return c;
    }
    const TXT = {
      ni: ['Минута 0. Предложение ушло, токен ждёт в «Ждать решения клиента». Таймер и сигнал на её рамке «взведены».', 'Минута 20. Непрерывающий таймер сработал: появился второй токен — мастер звонит. Первый токен по-прежнему ждёт ответа в приложении. Токенов два.', 'Минута 22. Елена не взяла трубку (совещание), мастер записал «не дозвонился». Но через минуту она ответила в приложении — ожидание ещё живо, решение учтено. Всё хорошо.'],
      int: ['Минута 0. Предложение ушло, токен ждёт в «Ждать решения клиента».', 'Минута 20. Прерывающий таймер отменил задачу «Ждать решения клиента» и увёл токен к мастеру. Ответ в приложении больше никто не ждёт.', 'Минута 22. Елена нажала «Согласовать» в приложении — но сообщение некому принять. Её ответ потерян, мастер не дозвонился. Елена уверена, что всё согласовала, а работы не сделаны.']
    };
    function draw() {
      const host = TR.$('[data-d]', pane);
      if (!d) d = diagram(host, look()); else d.redraw(look());
      TR.$('[data-t]', pane).innerHTML = MIN.map((x, i) => `<button type="button" class="chip" data-m="${i}" aria-pressed="${i === m}">Минута ${x}</button>`).join('');
      TR.$('[data-o]', pane).innerHTML = `<div class="m3b2-fr ${m === 2 ? (tm === 'ni' ? 'ok' : 'bad') : m === 1 ? 'accent' : ''}">${esc(TXT[tm][m])}</div>`;
    }
    ui.onSeg(pane, (g, v) => { if (g === 'bt') { tm = v; draw(); } });
    TR.on(pane, 'click', '[data-m]', (e, b) => { m = +b.dataset.m; draw(); });
    draw();
  }
  const EVG = {
    title: 'Шлюз по событию', pool: '«Искра Онлайн»', lanes: [{ id: 'x', t: 'Система' }], colW: CW, rowH: 80,
    nodes: [{ id: 'g0', type: 'send', t: 'Отправить предложение', lane: 'x', col: 0 }, { id: 'g1', type: 'evt', lane: 'x', col: 1 },
      { id: 'g2', type: 'int-msg', t: 'Решение получено', lane: 'x', col: 2 }, { id: 'g3', type: 'int-timer', t: '20 минут', lane: 'x', col: 2, row: 1 },
      { id: 'g4', type: 'task', t: 'Учесть решение', lane: 'x', col: 3 }, { id: 'g5', type: 'task', t: 'Передать мастеру на звонок', lane: 'x', col: 3, row: 1 }],
    flows: [{ from: 'g0', to: 'g1' }, { from: 'g1', to: 'g2' }, { from: 'g1', to: 'g3' }, { from: 'g2', to: 'g4' }, { from: 'g3', to: 'g5' }]
  };
  function drawEvg(pane) {
    pane.innerHTML = `<div class="stack">
      <p class="small muted"><b>Шлюз по событию</b> (ромб с пятиугольником в двойном круге) — развилка, где путь выбирает не условие на данных, а <b>то событие, которое случится первым</b>. Как только сработало одно, остальные «отключаются». За ним стоят только ловящие промежуточные события или задачи получения.</p>
      <div data-d></div>
      <div class="m3b2-two">
        <div class="m3b2-panel"><h4>Где он хорош</h4><ul class="checks"><li>Гонка «ответ или тайм-аут», когда после тайм-аута ответ <b>уже не нужен</b>: «ждём подтверждения резерва от 1С 15 минут, иначе — ручная проверка у Алии».</li><li>Выбор между разными сообщениями: «клиент согласился» / «клиент отказался» как два разных сообщения.</li></ul></div>
        <div class="m3b2-panel"><h4>Почему в TO-BE его нет на этом месте</h4><ul class="checks"><li>После 20 минут шлюз перестаёт ждать решение. Ответ Елены на 22-й минуте, пока мастер ей звонит, будет потерян — та же беда, что с прерывающим таймером.</li><li>BR-8 говорит «мастер звонит», а не «перестаём ждать». Поэтому — граничный <b>непрерывающий</b> таймер на «Ждать решения».</li></ul></div>
      </div>
      ${ui.note('info', 'XOR или шлюз по событию?', 'XOR решает по данным, которые уже есть («В пределах лимита?»). Шлюз по событию решает по тому, что ещё не случилось и неизвестно когда случится («что придёт раньше»). Если в вопросе есть «что раньше» — это шлюз по событию.')}
    </div>`;
    diagram(TR.$('[data-d]', pane), EVG);
  }
  const ERRD = {
    title: 'Ошибка и эскалация на границе', pool: '«Искра»: выдача машины', lanes: [{ id: 'x', t: '' }], colW: CW, rowH: 84,
    nodes: [{ id: 's', type: 'start', t: 'Машина в цехе', lane: 'x', col: 0 }, { id: 'rep', type: 'sub', t: 'Выполнить ремонт', lane: 'x', col: 1 },
      { id: 'be', type: 'b-esc', attach: 'rep', ni: true }, { id: 'w', type: 'user', t: 'Предупредить клиента о задержке', lane: 'x', col: 2, row: 1 }, { id: 'we', type: 'end', t: 'Клиент предупреждён', lane: 'x', col: 3, row: 1 },
      { id: 'pay', type: 'sub', t: 'Оплатить онлайн', lane: 'x', col: 3 }, { id: 'bx', type: 'b-err', attach: 'pay' }, { id: 'cash', type: 'manual', t: 'Принять оплату на кассе', lane: 'x', col: 4, row: 1 },
      { id: 'e', type: 'end', t: 'Машина выдана', lane: 'x', col: 5 }],
    flows: [{ from: 's', to: 'rep' }, { from: 'rep', to: 'pay' }, { from: 'be', to: 'w', t: 'срок под угрозой' }, { from: 'w', to: 'we' }, { from: 'pay', to: 'e' }, { from: 'bx', to: 'cash', t: 'отклонено' }, { from: 'cash', to: 'e' }]
  };
  function drawErr(pane) {
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Граничные события особенно удобны на <b>подпроцессах</b>: внутри подпроцесса бросают ошибку или эскалацию (конечным или промежуточным событием), а снаружи, на рамке, её ловят.</p>
      <div data-d></div>
      <div class="m3b2-two">
        <div class="m3b2-panel"><h4>Эскалация, непрерывающая</h4><div>Внутри «Выполнить ремонт» механик отметил: «не успеваю к 18:00». Подпроцесс бросил эскалацию, мастер предупреждает клиента — а ремонт продолжается.</div></div>
        <div class="m3b2-panel"><h4>Ошибка, всегда прерывающая</h4><div>Внутри «Оплатить онлайн» банк отклонил платёж. Подпроцесс прерван, клиенту предлагают кассу станции (BR-10). У ошибки непрерывающего варианта нет.</div></div>
      </div>
    </div>`;
    diagram(TR.$('[data-d]', pane), ERRD);
  }
  const howBoundary = {
    id: 'how-boundary', covers: ['tokens'], title: 'Как это работает: граничные события и шлюз по событию', free: true, noReset: true,
    simple: {
      icon: '🧲',
      plain: 'Граничное событие — «сторож» на задаче: пока задача идёт, он ждёт своего. Прерывающий сторож останавливает задачу, непрерывающий — запускает дополнительную работу, а задача продолжается.',
      analogy: 'Вы ждёте курьера дома. Прерывающее: «через час не пришёл — ухожу» — курьер придёт, а вас нет. Непрерывающее: «через час позвоню в службу доставки» — и продолжаю ждать дома.',
      tech: '<b>Boundary event</b> (BPMN 2.0, 10.5.4) — промежуточное событие на границе активности; атрибут cancelActivity задаёт прерывание. Непрерывающее порождает параллельный токен. <b>Event-based gateway</b> (10.6.6) — выбор пути по первому наступившему событию; остальные ожидания отменяются.'
    },
    lead: ui.brief({
      situation: 'Глеб прочитал BR-8 и спросил: «Через 20 минут — мы перестаём ждать ответ в приложении или продолжаем? Это разные статусы и разный код». Вопрос точный: на диаграмме это одна пунктирная линия на кружке.',
      todo: ['Вкладка «Прерывающее и непрерывающее»: пройдите три минуты при обоих типах таймера.', 'Вкладка «Шлюз по событию»: поймите, чем он отличается от граничного таймера.', 'Вкладка «Ошибка и эскалация»: посмотрите на события на рамке подпроцесса.'],
      look: 'Вопрос для выбора: «после того как событие случилось, исходная работа ещё нужна?» Да — непрерывающее. Нет — прерывающее.'
    }),
    render(el) {
      el.classList.add('m3b2-root');
      const t = document.createElement('div'); el.appendChild(t);
      ui.tabs(t, [{ id: 'b', t: 'Прерывающее и непрерывающее', render: drawBoundary }, { id: 'g', t: 'Шлюз по событию', render: drawEvg }, { id: 'e', t: 'Ошибка и эскалация', render: drawErr }], 'b');
      el.insertAdjacentHTML('beforeend', `<div class="stack tight" style="margin-top:12px">
        ${mistakes(['Таймер ожидания нарисован прерывающим «по привычке» — и ответ клиента после тайм-аута теряется.', 'Непрерывающее событие там, где задачу надо закончить: ожидание продолжается после «Истекло», и решение приходит, когда машина уже выдана.', 'Граничное событие висит на задаче, которая длится секунду (сервисная задача «Отправить push»), — ему просто некогда сработать.', 'После шлюза по событию стоят обычные задачи или условия. За ним — только ловящие события или задачи получения.'])}
        ${interview([['«Чем прерывающее граничное событие отличается от непрерывающего?»', 'Прерывающее отменяет активность и продолжает процесс по своей ветке; непрерывающее создаёт параллельный токен, активность продолжается. Обозначение — сплошная или пунктирная двойная обводка.'], ['«Когда шлюз по событию, а когда XOR?»', 'XOR — решение по данным; шлюз по событию — гонка событий, путь выбирает то, что случилось первым.'], ['«Может ли ошибка быть непрерывающей?»', 'Нет: граничное событие ошибки всегда прерывающее. Непрерывающими бывают таймер, сообщение, сигнал, условие, эскалация.']])}
      </div>`);
    }
  };

  // =====================================================================
  // Теория 3. Подпроцессы, несколько пулов, «ИЛИ», как упрощать
  // =====================================================================
  const SUBS = {
    col: { t: 'Свёрнутый подпроцесс', g: 'sub', d: 'Прямоугольник с «+». Внутри — своя диаграмма, на этом уровне её не видно. Главный способ упрощать: «Согласовать доп. работы» на карте ремонта — один прямоугольник, а вся сегодняшняя диаграмма — внутри.', cfg: { title: 'Ремонт верхнего уровня', pool: '«Искра»: ремонт', lanes: [{ id: 'x', t: '' }], colW: CW, nodes: [{ id: 'a', type: 'start', t: 'Машина принята', lane: 'x', col: 0 }, { id: 'b', type: 'task', t: 'Выполнить основные работы', lane: 'x', col: 1 }, { id: 'c', type: 'sub', t: 'Согласовать доп. работы', lane: 'x', col: 1, row: 1 }, { id: 'g', type: 'and', lane: 'x', col: 2 }, { id: 'd', type: 'task', t: 'Подготовить к выдаче', lane: 'x', col: 3 }, { id: 'e', type: 'end', t: 'Машина готова', lane: 'x', col: 4 }, { id: 'f', type: 'start', t: 'Найдена неисправность', lane: 'x', col: 0, row: 1 }], flows: [{ from: 'a', to: 'b' }, { from: 'b', to: 'g' }, { from: 'f', to: 'c' }, { from: 'c', to: 'g' }, { from: 'g', to: 'd' }, { from: 'd', to: 'e' }] } },
    ev: { t: 'Событийный подпроцесс', g: 'evsub', d: 'Пунктирная рамка внутри процесса, без входящих потоков. Запускается своим начальным событием в любой момент, пока родитель жив: «клиент отменил визит» — снять резерв и предложения. Начальное событие сплошное — прерывает родителя, пунктирное — нет.', cfg: null },
    call: { t: 'Вызов процесса', g: 'call', d: 'Жирная рамка. Вызывает самостоятельный процесс, который используют повторно: «Оплатить онлайн» вызывается и при выдаче машины, и при предоплате 500 ₽ по BR-4. Описан один раз — меняется в одном месте.', cfg: null }
  };
  function drawSubs(pane) {
    let k = 'col';
    pane.innerHTML = `<div class="stack">
      <p class="small muted"><b>Подпроцесс</b> — действие, внутри которого своя диаграмма. Он позволяет держать каждую картинку на одном уровне детализации: снаружи — «что», внутри — «как».</p>
      ${ui.seg('sb', [{ v: 'col', t: 'Свёрнутый' }, { v: 'ev', t: 'Событийный' }, { v: 'call', t: 'Вызов процесса' }], k)}
      <div class="m3b2-con"><div class="m3b2-gl" data-g></div><div class="m3b2-panel" data-o></div></div><div data-d></div>
    </div>`;
    function draw() {
      const x = SUBS[k];
      TR.$('[data-g]', pane).innerHTML = ui.bpmnGlyph(x.g, k === 'col' ? 'Согласовать доп. работы' : k === 'ev' ? 'Клиент отменил визит' : 'Оплатить онлайн');
      TR.$('[data-o]', pane).innerHTML = `<h4>${esc(x.t)}</h4><div>${esc(x.d)}</div>`;
      const h = TR.$('[data-d]', pane); h.innerHTML = ''; if (x.cfg) diagram(h, x.cfg);
    }
    ui.onSeg(pane, (g, v) => { if (g === 'sb') { k = v; draw(); } });
    draw();
  }
  const PAY = () => ({
    title: 'Оплата: три участника', colW: CW, rowH: 80,
    pools: [{ id: 'pc', t: 'Клиент', blackbox: true }, { id: 'pi', t: '«Искра Онлайн»', lanes: [{ id: 'b', t: 'Бэкенд' }] }, { id: 'py', t: 'ЮKassa', blackbox: true }],
    nodes: [{ id: 's', type: 'start-msg', t: 'Нажал «Оплатить»', lane: 'b', col: 0 }, { id: 't1', type: 'service', t: 'Создать платёж', lane: 'b', col: 1 },
      { id: 't2', type: 'receive', t: 'Получить уведомление об оплате', lane: 'b', col: 2 }, { id: 't3', type: 'service', t: 'Пробить чек (54-ФЗ)', lane: 'b', col: 3 },
      { id: 't4', type: 'send', t: 'Отправить чек и push', lane: 'b', col: 4 }, { id: 'e', type: 'end', t: 'Оплачено', lane: 'b', col: 5 }],
    flows: [{ from: 's', to: 't1' }, { from: 't1', to: 't2' }, { from: 't2', to: 't3' }, { from: 't3', to: 't4' }, { from: 't4', to: 'e' },
      { from: 'pc', to: 's', kind: 'msg', t: 'оплатить' }, { from: 't1', to: 'py', kind: 'msg', t: 'создать платёж' }, { from: 'py', to: 't2', kind: 'msg', t: 'вебхук' }, { from: 't4', to: 'pc', kind: 'msg', t: 'чек' }]
  });
  const PAYM = [
    { k: 'pc>s', t: 'Клиент → «Искра»: «оплатить»', d: 'Нажатие кнопки в приложении — сообщение от участника «Клиент». Оно запускает процесс начальным событием-сообщением.' },
    { k: 't1>py', t: '«Искра» → ЮKassa: создать платёж', d: 'Бэкенд вызывает ЮKassa и получает ссылку на страницу оплаты. Как устроена страница ЮKassa внутри — не наше дело: пул ЮKassa свёрнут в «чёрный ящик».' },
    { k: 'py>t2', t: 'ЮKassa → «Искра»: вебхук', d: 'Уведомление об оплате приходит асинхронно — задача получения ждёт его. Подробно «кто кого вызывает» нарисуем на диаграмме последовательности в январе.' },
    { k: 't4>pc', t: '«Искра» → клиент: чек', d: 'Чек онлайн-кассы — на email или SMS (BR-10). Сам вызов онлайн-кассы АТОЛ — ещё один пул, если он важен заказчику.' }
  ];
  function drawPools(pane) {
    let cur = 0, d;
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Диаграмма взаимодействия (collaboration) показывает несколько участников и сообщения между ними. Свой процесс раскрываем, чужие — сворачиваем в <b>пул-«чёрный ящик»</b>: нам важны только сообщения на границе. Нажмите на сообщения по очереди.</p>
      <div data-d></div><div class="m3b2-picks" data-p></div><div data-o></div>
    </div>`;
    function conf() { const c = PAY(); c.flows = c.flows.map(f => f.from + '>' + f.to === PAYM[cur].k ? Object.assign({}, f, { tone: 'accent' }) : f); return c; }
    function draw() {
      if (!d) d = diagram(TR.$('[data-d]', pane), conf()); else d.redraw(conf());
      TR.$('[data-p]', pane).innerHTML = PAYM.map((x, i) => `<button type="button" class="chip" data-i="${i}" aria-pressed="${i === cur}">${esc(x.t)}</button>`).join('');
      TR.$('[data-o]', pane).innerHTML = `<div class="m3b2-ex">${esc(PAYM[cur].d)}</div>`;
    }
    TR.on(pane, 'click', '[data-i]', (e, b) => { cur = +b.dataset.i; draw(); });
    draw();
  }
  const ORD = (push, mail) => ({
    title: 'Шлюз «ИЛИ»', pool: '«Искра Онлайн»', lanes: [{ id: 'x', t: 'Система' }], colW: CW, rowH: 72,
    nodes: [{ id: 's', type: 'start', t: 'Заказ-наряд «Готов»', lane: 'x', col: 0, row: 1 }, { id: 'o1', type: 'or', lane: 'x', col: 1, row: 1 },
      { id: 'p', type: 'service', t: 'Отправить push', lane: 'x', col: 2, row: 0 }, { id: 'm', type: 'service', t: 'Отправить SMS', lane: 'x', col: 2, row: 1 }, { id: 'em', type: 'service', t: 'Отправить email', lane: 'x', col: 2, row: 2 },
      { id: 'o2', type: 'or', lane: 'x', col: 3, row: 1 }, { id: 'e', type: 'end', t: 'Клиент уведомлён', lane: 'x', col: 4, row: 1 }],
    flows: [{ from: 's', to: 'o1' }, { from: 'o1', to: 'p', t: 'есть приложение' }, { from: 'o1', to: 'm', t: 'всегда' }, { from: 'o1', to: 'em', t: 'указан email' }, { from: 'p', to: 'o2' }, { from: 'm', to: 'o2' }, { from: 'em', to: 'o2' }, { from: 'o2', to: 'e' }],
    hl: Object.assign({ o1: 'ok', m: 'accent', o2: 'ok', e: 'ok' }, push ? { p: 'accent' } : {}, mail ? { em: 'accent' } : {}),
    dim: [].concat(push ? [] : ['p', 'o1>p', 'p>o2'], mail ? [] : ['em', 'o1>em', 'em>o2'])
  });
  function drawOr(pane) {
    let push = true, mail = false, d;
    pane.innerHTML = `<div class="stack">
      <p class="small muted"><b>«Включающее ИЛИ» (OR, ромб с кругом)</b> — выбирает <b>один или несколько</b> путей: каждый выход со своим условием, сработают все истинные. Слияние «ИЛИ» ждёт только те ветки, которые были запущены. Пример — BR-13: «Готов» → push и SMS; push — если у клиента приложение, письмо — если указан email.</p>
      <div class="m3b2-picks"><button type="button" class="chip" data-o="push" aria-pressed="${push}">У клиента есть приложение</button><button type="button" class="chip" data-o="mail" aria-pressed="${mail}">Клиент указал email</button></div>
      <div data-d></div><div data-x></div>
      ${ui.note('warn', 'Осторожно с «ИЛИ»', 'Его труднее читать и тестировать: при трёх выходах — семь сочетаний. Если варианты взаимоисключающие — нужен XOR, если нужны всегда все — AND. «ИЛИ» — только когда действительно «одно, два или все».')}
    </div>`;
    function draw() {
      if (!d) d = diagram(TR.$('[data-d]', pane), ORD(push, mail)); else d.redraw(ORD(push, mail));
      TR.$$('[data-o]', pane).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.o === 'push' ? push : mail)));
      const n = 1 + (push ? 1 : 0) + (mail ? 1 : 0);
      TR.$('[data-x]', pane).innerHTML = `<div class="m3b2-ex">Запущено веток: <b>${n}</b>. Слияние «ИЛИ» ждёт ровно ${n} ${TR.plural(n, 'токен', 'токена', 'токенов')} — и не ждёт ветку, которая не запускалась. «И» на этом месте зависло бы, XOR — выпустил бы «Клиент уведомлён» ${n} ${TR.plural(n, 'раз', 'раза', 'раз')}.</div>`;
    }
    TR.on(pane, 'click', '[data-o]', (e, b) => { if (b.dataset.o === 'push') push = !push; else mail = !mail; draw(); });
    draw();
  }
  function drawSimple(pane) {
    pane.innerHTML = `<div class="stack">
      <p class="small muted">Диаграмма, которую никто не может прочитать, — бесполезна, даже если она верна. Правила упрощения, проверенные практикой (7PMG — «семь правил моделирования процессов», Мендлинг, Рейерс, ван дер Аалст, 2010; Б. Сильвер, «Method and Style»):</p>
      <div class="m3b2-two">
        <div class="m3b2-panel"><h4>Что делать</h4><ul class="checks">
          <li>Не больше 15–20 элементов на диаграмме; больше — режьте на подпроцессы.</li>
          <li>Один уровень детализации: снаружи «Оплатить онлайн», внутри — шаги оплаты.</li>
          <li>Чужие процессы — свёрнутыми пулами: ЮKassa, 1С, SMS-шлюз.</li>
          <li>Сначала основной путь, потом исключения — только те, что важны бизнесу (BR-8: «не дозвонился», «Истекло»).</li>
          <li>Одно начальное и явные конечные события с говорящими именами.</li></ul></div>
        <div class="m3b2-panel"><h4>Чего не рисовать</h4><ul class="checks">
          <li>Экраны, кнопки, спиннеры — это макеты Ники и спецификация экрана.</li>
          <li>Технические повторы и логи («3 попытки при ошибке сети») — это требования к интеграции и диаграмма последовательности.</li>
          <li>Исключения ради исключений: «а если у механика сел планшет» — в риски, не в процесс.</li>
          <li>Одну и ту же ветку дважды — вынесите в подпроцесс или вызов процесса.</li></ul></div>
      </div>
    </div>`;
  }
  const howStructure = {
    id: 'how-structure', covers: ['simplify'], title: 'Как это работает: подпроцессы, несколько пулов, «ИЛИ» и как упрощать', free: true, noReset: true,
    simple: {
      icon: '🧩',
      plain: 'Большой процесс делят на части: снаружи — коробочка «Оплатить онлайн», внутри — подробности. Чужие системы рисуют закрытыми коробками и показывают только, какие письма им отправляем и получаем.',
      analogy: 'Оглавление книги: в нём «Глава 3. Оплата», а не все её абзацы. Захотели подробностей — открыли главу.',
      tech: '<b>Sub-process</b> (свёрнутый/развёрнутый), <b>event sub-process</b> (запускается событием внутри родителя), <b>call activity</b> (вызов глобального процесса) — BPMN 2.0, 10.3. <b>Collaboration</b> — несколько пулов и потоки сообщений; <b>black-box pool</b> — участник без раскрытого процесса. <b>Inclusive gateway</b> (OR) — 10.6.3.'
    },
    lead: ui.brief({
      situation: 'Вера показывает первую версию TO-BE стажёра: 46 элементов, экраны, спиннеры, повторы запросов. «Всё правда, но прочитать невозможно. Давайте научимся упрощать — без потери смысла».',
      todo: ['Вкладка «Подпроцессы»: сравните три вида.', 'Вкладка «Несколько пулов»: пройдите по четырём сообщениям оплаты.', 'Вкладка «ИЛИ»: включайте и выключайте условия.', 'Вкладка «Как упрощать»: прочитайте правила — они понадобятся в задании.'],
      look: 'Проверка простоты: может ли Марина Олеговна за минуту пересказать диаграмму? Если нет — режьте.'
    }),
    render(el) {
      el.classList.add('m3b2-root');
      const t = document.createElement('div'); el.appendChild(t);
      ui.tabs(t, [{ id: 's', t: 'Подпроцессы', render: drawSubs }, { id: 'p', t: 'Несколько пулов', render: drawPools }, { id: 'o', t: '«ИЛИ»', render: drawOr }, { id: 'u', t: 'Как упрощать', render: drawSimple }], 's');
      el.insertAdjacentHTML('beforeend', `<div class="stack tight" style="margin-top:12px">
        ${mistakes(['Подпроцесс без начального и конечного события внутри — непонятно, где он начинается и чем заканчивается.', 'Поток управления из своего пула прямо в задачу внутри раскрытого пула ЮKassa. Только сообщения.', 'Раскрыли чужой процесс «как мы думаем, работает ЮKassa» — ошибётесь, а поддерживать придётся вам.', '«ИЛИ» на месте XOR: условия случайно пересеклись — запустились обе ветки.'])}
        ${interview([['«Чем подпроцесс отличается от вызова процесса?»', 'Подпроцесс — часть родительского процесса, описан внутри него. Вызов процесса (call activity) обращается к самостоятельному глобальному процессу, который переиспользуют из разных мест.'], ['«Что такое событийный подпроцесс?»', 'Подпроцесс без входящих потоков, запускаемый начальным событием (сообщение, таймер, ошибка…) в контексте родителя; может прерывать родителя или нет.'], ['«Как вы упрощаете сложные диаграммы?»', 'Уровни детализации и подпроцессы, свёрнутые пулы для внешних систем, основной путь плюс бизнес-значимые исключения, без интерфейса и технических повторов.']])}
      </div>`);
    }
  };

  // =====================================================================
  // Практика 1. Тип события для девяти ситуаций
  // =====================================================================
  const EV_CH = [
    { v: 'start-timer', t: 'Начальное: таймер' }, { v: 'start-msg', t: 'Начальное: сообщение' }, { v: 'int-msg', t: 'Промежуточное: ждём сообщение' },
    { v: 'int-timer', t: 'Промежуточное: ждём время' }, { v: 'int-signal', t: 'Промежуточное: ждём сигнал' }, { v: 'b-timer:ni', t: 'Граничный таймер, непрерывающий' },
    { v: 'b-timer', t: 'Граничный таймер, прерывающий' }, { v: 'b-err', t: 'Граничная ошибка' }, { v: 'b-esc:ni', t: 'Граничная эскалация, непрерывающая' },
    { v: 'b-signal', t: 'Граничный сигнал, прерывающий' }, { v: 'end-msg', t: 'Конечное: сообщение' }, { v: 'end-term', t: 'Конечное: терминирующее' }, { v: 'end-err', t: 'Конечное: ошибка' }
  ];
  const EV_IT = [
    { id: 'e1', t: 'Каждый вечер в 21:00, когда станции закрываются, запустить сверку оплат с ЮKassa.', ok: ['start-timer'], why: 'Процесс запускается по расписанию — начальное событие-таймер с циклом.' },
    { id: 'e2', t: 'ЮKassa прислала уведомление (вебхук) об оплате — с него начинается выдача чека.', ok: ['start-msg'], why: 'Процесс запускает сообщение от другого участника — начальное событие-сообщение.' },
    { id: 'e3', t: 'Прошло 20 минут без ответа клиента: мастер звонит, а приложение продолжает ждать ответа.', ok: ['b-timer:ni'], why: 'Ожидание продолжается, звонок — параллельно: граничный непрерывающий таймер (BR-8).', near: { 'b-timer': 'Прерывающий таймер отменит ожидание — ответ в приложении на 22-й минуте будет потерян.', 'int-timer': 'Промежуточный таймер в потоке остановит процесс на 20 минут и ничего не будет ждать параллельно.' } },
    { id: 'e4', t: 'Банк отклонил оплату — «Оплатить онлайн» прерывается, клиенту предлагают кассу станции.', ok: ['b-err'], why: 'Авария внутри подпроцесса, продолжать нельзя — граничная ошибка, всегда прерывающая.' },
    { id: 'e5', t: 'Механик не успевает к обещанному сроку — подпроцесс ремонта сообщает мастеру, а ремонт продолжается.', ok: ['b-esc:ni'], why: '«Доложить наверх» без остановки работы — непрерывающая эскалация.', near: { 'b-err': 'Ошибка прервала бы ремонт — а машину продолжают чинить.' } },
    { id: 'e6', t: 'Процесс выдачи заканчивается отправкой клиенту чека на email.', ok: ['end-msg'], why: 'Ветка закончилась и бросила сообщение наружу — конечное событие-сообщение.' },
    { id: 'e7', t: 'Клиент отменил запись — немедленно остановить всё: резерв запчастей, напоминания, звонки.', ok: ['end-term'], why: 'Терминирующее конечное событие останавливает все параллельные ветки экземпляра.', near: { 'end-err': 'Ошибка требует обработчика на границе и годится для подпроцесса. Здесь — просто «выключить всё».' } },
    { id: 'e8', t: 'Ждём, когда 1С пришлёт подтверждение резерва запчасти, и только потом продолжаем.', ok: ['int-msg'], why: 'Процесс стоит и ждёт сообщения — промежуточное ловящее событие-сообщение (или задача получения).' },
    { id: 'e9', t: 'Пришёл сигнал «Основные работы завершены» — ожидание решения клиента заканчивается, предложение «Истекло».', ok: ['b-signal'], why: 'Сигнал ловится на рамке «Ждать решения» и прерывает её — граничный прерывающий сигнал (BR-8).', near: { 'int-signal': 'Промежуточный сигнал в потоке ждал бы только сигнала — а нам нужно ждать решение и сигнал одновременно, поэтому граничный.' } }
  ];
  const evG = v => { if (!v) return ''; const [t, ni] = v.split(':'); return glyph(t, !!ni); };
  const evtypesTask = {
    id: 'evtypes', title: 'Выберите тип события для девяти ситуаций',
    lead: ui.brief({
      situation: 'Перед тем как рисовать TO-BE, Вера даёт разминку: девять ситуаций из «Искры» — от ЮKassa до отмены записи. «Подберите каждой событие. Рядом появится значок — проверьте глазами, похож ли он на то, что вы имели в виду».',
      todo: ['Для каждой ситуации выберите тип события из списка.', 'Нажмите «Проверить». Засчитывается от 80 % (не меньше 8 из 9).'],
      look: 'Три вопроса: где событие (начало, середина, рамка задачи, конец)? Что его вызывает? Если на рамке — исходная работа продолжается?'
    }),
    blank: () => ({ v: {} }),
    reference: () => ({ v: Object.fromEntries(EV_IT.map(x => [x.id, x.ok[0]])) }),
    render(el, ctx) {
      el.classList.add('m3b2-root');
      const a = ctx.ans; a.v = a.v || {};
      const rv = !!(ctx.result || ctx.readonly);
      el.innerHTML = `<div class="m3b2-rows" data-r></div>`;
      function draw() {
        TR.$('[data-r]', el).innerHTML = EV_IT.map((x, i) => {
          const v = a.v[x.id], ok = x.ok.includes(v);
          return `<div class="m3b2-sit ${rv && v ? (ok ? 'ok' : 'bad') : ''}"><div><b>${i + 1}.</b> ${esc(x.t)}</div>
            <select data-s="${x.id}" aria-label="Тип события для ситуации ${i + 1}" ${ctx.readonly ? 'disabled' : ''}><option value="">Выберите…</option>${EV_CH.map(c => `<option value="${c.v}" ${v === c.v ? 'selected' : ''}>${esc(c.t)}</option>`).join('')}</select>
            <div>${evG(v)}</div>
            ${rv && v ? `<div class="why">${ok ? '' : esc((x.near && x.near[v]) || 'Не то событие.') + ' '}${esc(x.why)}</div>` : ''}</div>`;
        }).join('');
      }
      el.addEventListener('change', e => { const s = e.target.closest('[data-s]'); if (!s) return; if (s.value) a.v[s.dataset.s] = s.value; else delete a.v[s.dataset.s]; ctx.save(); draw(); });
      draw();
    },
    check(ans) {
      const v = (ans && ans.v) || {}, notes = [];
      const good = EV_IT.filter(x => x.ok.includes(v[x.id]));
      notes.push({ ok: good.length >= 8, html: `Верно ${good.length} из ${EV_IT.length}.` });
      EV_IT.forEach((x, i) => { if (v[x.id] && !x.ok.includes(v[x.id])) notes.push({ ok: false, html: `${i + 1}. Не «${esc(EV_CH.find(c => c.v === v[x.id]).t)}». ${esc((x.near && x.near[v[x.id]]) || '')} ${esc(x.why)}` }); });
      const miss = EV_IT.filter(x => !v[x.id]).length; if (miss) notes.push({ ok: false, html: `Без ответа: ${miss}.` });
      const score = good.length / EV_IT.length;
      return { ok: score >= 0.8, score, notes, summary: `Верно ${good.length} из ${EV_IT.length}.`,
        mentor: v.e3 === 'b-timer' ? 'Таймер 20 минут — главный момент сегодняшнего дня. После него приложение продолжает ждать ответа? Да — значит, непрерывающий.' : v.e5 === 'b-err' ? 'Ошибку и эскалацию путают часто. Ремонт после события продолжается? Значит, это не ошибка.' : null };
    },
    explain: `<p>Ключ к выбору — три вопроса: <b>где</b> (тонкий круг — начало, двойной — середина или рамка, толстый — конец), <b>что вызывает</b> (сообщение, время, сигнал, ошибка, эскалация) и для граничных — <b>продолжается ли работа</b> (пунктир — да).</p>
      <p>Ситуации 3 и 9 — это и есть ядро TO-BE: на рамке «Ждать решения клиента» висят непрерывающий таймер (звонок мастера) и прерывающий сигнал «Основные работы завершены» («Истекло»). Ситуации 4 и 5 показывают пару «ошибка — эскалация»: первая останавливает, вторая сообщает.</p>
      <p class="small muted">Источники: BPMN 2.0 (OMG), раздел 10.5 «Events», таблицы 10.84–10.93; Б. Сильвер, «BPMN Method and Style», гл. 6 «Events».</p>`,
    report: ans => { const v = (ans && ans.v) || {}; return EV_IT.map((x, i) => `${i + 1}. ${(EV_CH.find(c => c.v === v[x.id]) || { t: '—' }).t}${x.ok.includes(v[x.id]) ? '' : ' ✗'}`).join('\n'); }
  };

  // =====================================================================
  // Практика 2. Соберите TO-BE: заполните слоты
  // =====================================================================
  const SL = [
    { id: 'a4', name: 'Развилка после «Сформировать предложение»: корпоративный клиент и сумма в пределах лимита договора?', blank: { type: 'gw' }, opts: [
      { v: 'xor', n: { type: 'xor' }, t: '«Исключающее ИЛИ»', s: 1, why: 'Ровно один путь по данным: либо автосогласование (BR-9), либо предложение клиенту.' },
      { v: 'or', n: { type: 'or' }, t: '«ИЛИ»', s: 0, why: '«ИЛИ» допускает оба пути сразу: клиенту ушло бы предложение, уже согласованное автоматически.' },
      { v: 'and', n: { type: 'and' }, t: '«И»', s: 0, why: '«И» пустит токен по обоим путям всегда.' },
      { v: 'evt', n: { type: 'evt' }, t: 'По событию', s: 0, why: 'Здесь ничего не ждём: сумма и тип клиента уже известны. Решение по данным — XOR.' }] },
    { id: 'a5', name: 'Автосогласование «Шашки» до 3 000 ₽', blank: { type: 'blank' }, opts: [
      { v: 'service', n: { type: 'service' }, t: 'Сервисная задача', s: 1, why: 'Делает система без человека: статус «Согласовано», decided_by = auto.' },
      { v: 'rule', n: { type: 'rule' }, t: 'Задача бизнес-правила', s: 0.5, why: 'Правило лимита уже проверено шлюзом; здесь система не решает, а фиксирует согласование. Близко, но точнее — сервисная.' },
      { v: 'user', n: { type: 'user' }, t: 'Пользовательская задача', s: 0, why: 'Никто не нажимает кнопку — в этом весь смысл автосогласования.' },
      { v: 'manual', n: { type: 'manual' }, t: 'Ручная задача', s: 0, why: 'Ручная — без программы вообще. Здесь всё делает система.' }] },
    { id: 'a6', name: 'Отправить предложение клиенту (фото, цена)', blank: { type: 'blank' }, opts: [
      { v: 'send', n: { type: 'send' }, t: 'Задача отправки', s: 1, why: 'Из задачи выходит поток сообщений к клиенту — задача отправки показывает это явно.' },
      { v: 'service', n: { type: 'service' }, t: 'Сервисная задача', s: 0.5, why: 'Отправку делает система, так что не ошибка, но смысл «отправить сообщение другому участнику» теряется.' },
      { v: 'user', n: { type: 'user' }, t: 'Пользовательская задача', s: 0, why: 'Мастер уже сформировал предложение — отправляет система.' },
      { v: 'receive', n: { type: 'receive' }, t: 'Задача получения', s: 0, why: 'Получение — следующая задача: ждать решения.' }] },
    { id: 'a7', name: 'Ждать решения клиента', blank: { type: 'blank' }, opts: [
      { v: 'receive', n: { type: 'receive' }, t: 'Задача получения', s: 1, why: 'Процесс ждёт сообщения «решение» — задача получения. На её рамке можно повесить таймер и сигнал.' },
      { v: 'user', n: { type: 'user' }, t: 'Пользовательская задача', s: 0, why: 'Никто из сотрудников не работает — система ждёт сообщения.' },
      { v: 'service', n: { type: 'service' }, t: 'Сервисная задача', s: 0, why: 'Сервисная задача выполняет работу, а не ждёт внешнего ответа.' },
      { v: 'manual', n: { type: 'manual' }, t: 'Ручная задача', s: 0, why: 'Ожидание — не ручная работа.' }] },
    { id: 'a8', name: 'Событие на рамке «Ждать решения»: 20 минут без ответа → мастер звонит', blank: { type: 'b' }, opts: [
      { v: 'tni', n: { type: 'b-timer', ni: true }, t: 'Таймер, непрерывающий', s: 1, why: 'Звонок — параллельно, ожидание в приложении продолжается (BR-8).' },
      { v: 'ti', n: { type: 'b-timer', ni: false }, t: 'Таймер, прерывающий', s: 0, why: 'Прерывающий отменит ожидание: ответ Елены в приложении на 22-й минуте потеряется.' },
      { v: 'mni', n: { type: 'b-msg', ni: true }, t: 'Сообщение, непрерывающее', s: 0, why: 'Тут не приходит сообщение — проходит время.' },
      { v: 'eni', n: { type: 'b-esc', ni: true }, t: 'Эскалация, непрерывающая', s: 0, why: 'По смыслу похоже на «позвать мастера», но эскалацию бросает подпроцесс изнутри. Здесь — просто истёк срок.' }] },
    { id: 'a9', name: 'Событие на рамке «Ждать решения»: основные работы завершены → «Истекло»', blank: { type: 'b' }, opts: [
      { v: 'si', n: { type: 'b-signal', ni: false }, t: 'Сигнал, прерывающий', s: 1, why: 'Планшет механика объявляет «Основные работы завершены»; ожидание надо закончить — прерывающее.' },
      { v: 'sni', n: { type: 'b-signal', ni: true }, t: 'Сигнал, непрерывающий', s: 0, why: 'Ожидание продолжится и после «Истекло»: решение придёт, когда машину уже выдают.' },
      { v: 'ci', n: { type: 'b-cond', ni: false }, t: 'Условие, прерывающее', s: 0.75, why: 'Тоже работает: «все основные работы закрыты» — условие на данных. Сигнал нагляднее, если событие подаёт планшет.' },
      { v: 'err', n: { type: 'b-err' }, t: 'Ошибка', s: 0, why: 'Окончание работ — не авария, а плановое событие.' }] },
    { id: 'a10', name: 'Развилка после решения клиента', blank: { type: 'gw' }, opts: [
      { v: 'xor', n: { type: 'xor' }, t: '«Исключающее ИЛИ»', s: 1, why: 'Решение либо «согласовано», либо «отклонено».' },
      { v: 'evt', n: { type: 'evt' }, t: 'По событию', s: 0, why: 'Решение уже получено — смотрим на его содержимое, ждать нечего.' },
      { v: 'and', n: { type: 'and' }, t: '«И»', s: 0, why: 'Согласовано и отклонено одновременно не бывает.' },
      { v: 'or', n: { type: 'or' }, t: '«ИЛИ»', s: 0, why: 'Исходы взаимоисключающие — нужен XOR.' }] },
    { id: 'a21', name: 'Конец ветки «Истекло»', blank: { type: 'int' }, opts: [
      { v: 'end', n: { type: 'end' }, t: 'Конечное событие', s: 1, why: 'Ветка закончилась; если мастер ещё звонит, его ветка дойдёт до своего конца сама.' },
      { v: 'term', n: { type: 'end-term' }, t: 'Конечное терминирующее', s: 0.5, why: 'Остановит и звонок мастера — допустимо, но резко: если мастер как раз дозвонился, разговор «оборвётся» в процессе. Обычное конечное — проще.' },
      { v: 'err', n: { type: 'end-err' }, t: 'Конечное: ошибка', s: 0, why: '«Истекло» — штатный исход по BR-8, не авария.' },
      { v: 'msg', n: { type: 'end-msg' }, t: 'Конечное: сообщение', s: 0, why: 'По BR-8 «Истекло» обсуждают при выдаче — сообщение клиенту на этом шаге не отправляем.' }] }
  ];
  function slotOver(v, ro) {
    const o = {};
    SL.forEach((s, i) => { const ch = s.opts.find(x => x.v === v[s.id]); o[s.id] = Object.assign({}, ch ? ch.n : s.blank, { badge: String(i + 1) }); if (!ch && s.blank.type === 'b') o[s.id].ni = false; });
    return o;
  }
  const slotsTask = {
    id: 'slots', title: 'Соберите TO-BE согласования: заполните слоты',
    lead: ui.brief({
      situation: 'Вера нарисовала каркас TO-BE по BR-6…BR-9 и оставила восемь пустых мест: «Типы элементов выберите сами — на ревью Глеб спросит про каждый». Пунктирные прямоугольники, пустые ромбы и круги — слоты.',
      todo: ['Нажмите на пронумерованный слот на диаграмме (или на его номер ниже) и выберите элемент. Диаграмма сразу обновится.', 'Нажмите «Проверить». Засчитывается от 80 % и если оба события на рамке «Ждать решения» выбраны верно.'],
      look: 'Читайте BR-8 по словам: «нет ответа 20 минут → мастер звонит» (а приложение?), «не дозвонился → основные работы продолжаются», «к концу основных ответа нет → „Истекло“».'
    }),
    blank: () => ({ v: {} }),
    reference: () => ({ v: Object.fromEntries(SL.map(s => [s.id, s.opts[0].v])) }),
    render(el, ctx) {
      el.classList.add('m3b2-root');
      const a = ctx.ans; a.v = a.v || {};
      const rv = !!(ctx.result || ctx.readonly);
      let sel = ctx.readonly ? null : SL[0].id;
      el.innerHTML = `<div class="stack">${ui.say('vera', 'Каркас по BR-6…BR-9 готов. Восемь слотов — ваши.')}<div data-d></div>${SIG_NOTE}<div class="m3b2-panel" data-p></div></div>`;
      const conf = () => {
        const c = tobe(slotOver(a.v)); c.selected = sel; c.hl = {};
        SL.forEach(s => { const ch = s.opts.find(x => x.v === a.v[s.id]); if (rv && ch) c.hl[s.id] = ch.s >= 1 ? 'ok' : ch.s > 0 ? 'warn' : 'bad'; });
        c.onClick = id => { if (ctx.readonly || !SL.some(s => s.id === id)) return; sel = id; d.redraw(conf()); panel(); };
        return c;
      };
      const d = diagram(TR.$('[data-d]', el), conf());
      function panel() {
        const s = SL.find(x => x.id === sel);
        let h = `<div class="m3b2-lbl">Слоты</div><div class="m3b2-picks">${SL.map((x, i) => { const ch = x.opts.find(o => o.v === a.v[x.id]); const k = rv && ch ? (ch.s >= 1 ? ' ✓' : ch.s > 0 ? ' ~' : ' ✗') : ''; return `<button type="button" class="chip" data-sl="${x.id}" aria-pressed="${x.id === sel}" ${ctx.readonly ? 'disabled' : ''}>${i + 1} · ${ch ? esc(ch.t) : '—'}${k}</button>`; }).join('')}</div>`;
        if (s && !ctx.readonly) h += `<h4>Слот ${SL.indexOf(s) + 1}: ${esc(s.name)}</h4><div class="m3b2-opts">${s.opts.map(o => `<button type="button" class="m3b2-opt" data-o="${o.v}" aria-pressed="${a.v[s.id] === o.v}">${glyph(o.n.type, o.n.ni)}<span>${esc(o.t)}</span></button>`).join('')}</div>`;
        if (rv) h += `<ul class="checks">${SL.map((x, i) => { const ch = x.opts.find(o => o.v === a.v[x.id]); return ch ? `<li class="${ch.s >= 1 ? 'ok' : ch.s > 0 ? 'warn' : 'bad'}"><b>${i + 1}. ${esc(ch.t)}.</b> ${esc(ch.why)}${ch.s < 1 && ctx.readonly ? '' : ''}</li>` : `<li class="bad"><b>${i + 1}.</b> Слот не заполнен.</li>`; }).join('')}</ul>`;
        TR.$('[data-p]', el).innerHTML = h;
      }
      TR.on(el, 'click', '[data-sl]', (e, b) => { sel = b.dataset.sl; d.redraw(conf()); panel(); });
      TR.on(el, 'click', '[data-o]', (e, b) => {
        if (!sel || ctx.readonly) return;
        a.v[sel] = b.dataset.o; ctx.save();
        const i = SL.findIndex(x => x.id === sel), nx = SL.slice(i + 1).concat(SL.slice(0, i)).find(x => !a.v[x.id]); if (nx) sel = nx.id;
        d.redraw(conf()); panel();
      });
      panel();
    },
    check(ans) {
      const v = (ans && ans.v) || {}, notes = [];
      let pts = 0;
      SL.forEach((s, i) => { const ch = s.opts.find(o => o.v === v[s.id]); if (!ch) { notes.push({ ok: false, html: `Слот ${i + 1} не заполнен.` }); return; } pts += ch.s; notes.push({ ok: ch.s >= 1 ? true : ch.s > 0 ? 'warn' : false, html: `${i + 1}. ${esc(ch.t)}: ${esc(ch.why)}` }); });
      const crit = v.a8 === 'tni' && (v.a9 === 'si' || v.a9 === 'ci');
      if (!crit) notes.unshift({ ok: false, html: 'События на рамке «Ждать решения клиента» — главное в BR-8: таймер должен быть непрерывающим (ждём и звоним), а «основные работы завершены» — прерывающим (ждать больше нечего).' });
      const score = pts / SL.length;
      return { ok: score >= 0.8 && crit, score, notes, summary: `Слоты: ${Math.round(score * 100)} %.`,
        mentor: v.a8 === 'ti' ? 'Прерывающий таймер — самая частая ошибка именно здесь. Спросите себя: если Елена ответит в приложении на 22-й минуте, пока мастер набирает номер, — кто примет её ответ?' : v.a4 === 'evt' ? 'Шлюз по событию нужен, когда ждём «что случится раньше». Про лимит договора мы всё знаем заранее — это вопрос к данным.' : null };
    },
    explain: `<p>Собранный TO-BE читается так: механик фотографирует проблему, мастер формирует предложение с ценой. Если клиент корпоративный и сумма в пределах лимита (у «Шашки» 3 000 ₽, BR-9) — система согласует сама. Иначе предложение уходит в приложение и система <b>ждёт решения</b>. Через 20 минут без ответа <b>непрерывающий</b> таймер отправляет мастера звонить — ожидание в приложении продолжается. Дозвонился — мастер вносит решение в АРМ, и для процесса это тот же ответ клиента (канал «телефон»). Не дозвонился — основные работы идут, доп. ждут. Когда механик закрыл основные работы, <b>прерывающий</b> сигнал заканчивает ожидание: предложение «Истекло», его обсуждают при выдаче (BR-8). Платные доп. работы без согласия не выполняются (BR-6).</p>
      <p>Статусы предложения из базы ложатся на ветки один в один: sent → approved / rejected / expired, decided_by = client, phone, auto. Глеб получает из диаграммы статусную модель, Лиза — тест-кейсы: ответ до 20 минут, ответ во время звонка, дозвонился, не дозвонился и «Истекло», автосогласование, корпоративный сверх лимита.</p>
      <p class="small muted">Источники: BPMN 2.0 (OMG), 10.5.4 «Boundary events», 10.3 «Activities» (типы задач); Б. Сильвер, «BPMN Method and Style»; правила оказания услуг по ремонту автомототранспортных средств и Закон «О защите прав потребителей» — основание BR-6.</p>`,
    refNote: 'Засчитывается и условное прерывающее событие вместо сигнала в слоте 6, и терминирующее конечное в слоте 8 — с меньшим баллом.',
    report: ans => { const v = (ans && ans.v) || {}; return SL.map((s, i) => `${i + 1}. ${(s.opts.find(o => o.v === v[s.id]) || { t: '—' }).t}`).join('\n'); }
  };

  // =====================================================================
  // Практика 3. Лаборатория: прерывающее или непрерывающее
  // =====================================================================
  const SC = [{ v: 'a', t: 'Елена отвечает в приложении на 12-й минуте' }, { v: 'b', t: 'Отвечает в приложении на 22-й, когда мастер звонит' }, { v: 'c', t: 'Не отвечает совсем, работы закончены к 60-й' }, { v: 'd', t: 'Берёт трубку на 21-й и соглашается' }];
  function tl(sc, tm, sg) {
    const NI = tm === 'ni', SI = sg !== 'ni', F = [], vis = new Set(['f6']);
    const add = (m, text, k, tok, done, bad) => { (done || []).concat(tok || []).forEach(x => vis.add(x)); F.push({ m, text, k: k || '', tok: tok || [], vis: [...vis], bad: bad || [] }); };
    add(0, 'Предложение ушло в приложение: фото и цена. Токен ждёт в «Ждать решения клиента»; таймер и сигнал на её рамке взведены.', '', ['f7']);
    if (sc === 'a') { add(12, 'Елена нажала «Согласовать». «Ждать решения» завершилась — таймер и сигнал на её рамке больше не действуют: граничные события живут, только пока жива задача.', 'ok', [], ['f7', 'f11', 'f12']); return { F, out: { k: 'ok', t: 'Согласовано за 12 минут', d: 'При любых настройках. Граничные события просто не успели сработать.' } }; }
    add(20, NI ? 'Прошло 20 минут. Непрерывающий таймер создал второй токен: мастер звонит. Ожидание в приложении продолжается — токенов два.' : 'Прошло 20 минут. Прерывающий таймер отменил «Ждать решения клиента» и увёл токен к мастеру. Ответ из приложения больше никто не ждёт.', NI ? 'accent' : 'warn', NI ? ['f7', 'f15'] : ['f15'], ['ftm'], NI ? [] : ['f7']);
    if (sc === 'd') {
      if (NI) { add(21, 'Елена взяла трубку и согласилась. Мастер вносит решение в АРМ — для процесса это тот же ответ клиента (канал «телефон»): «Ждать решения» завершилась, работы добавлены в заказ-наряд.', 'ok', [], ['f17', 'f18', 'f19', 'f7', 'f11', 'f12']); return { F, out: { k: 'ok', t: 'Согласовано по телефону', d: 'decided_by = phone. Механик берётся за доп. работы, пока машина на подъёмнике.' } }; }
      add(21, 'Елена согласилась по телефону, мастер внёс решение — но процесс его уже не ждёт: «Ждать решения» отменена таймером. До заказ-наряда решение не дойдёт.', 'bad', [], ['f17', 'f18', 'f19'], ['f11']);
      return { F, out: { k: 'bad', t: 'Решение есть, а работ нет', d: 'В АРМ стоит «согласовано», в заказ-наряде доп. работ нет, механик о них не знает. Елена приезжает за машиной — тормозные колодки не заменены.' } };
    }
    add(21, 'Елена на совещании, трубку не берёт. Мастер отмечает «не дозвонился» — его ветка закончилась. Основные работы продолжаются, доп. ждут.', NI ? '' : 'warn', NI ? ['f7'] : [], ['f17', 'f20']);
    if (sc === 'b') {
      if (NI) { add(22, 'Елена вышла с совещания и нажала «Согласовать» в приложении. Ожидание ещё живо — решение учтено.', 'ok', [], ['f7', 'f11', 'f12']); return { F, out: { k: 'ok', t: 'Согласовано на 22-й минуте', d: 'Непрерывающий таймер позволил и позвонить, и дождаться ответа в приложении.' } }; }
      add(22, 'Елена нажала «Согласовать» в приложении, но сообщение некому принять — задача ожидания отменена 2 минуты назад.', 'bad', [], [], ['f7']);
      return { F, out: { k: 'bad', t: 'Ответ потерян', d: 'Елена уверена, что всё согласовала. Предложение навсегда «Отправлено», работы не сделаны. Звонок в колл-центр и жалоба — ровно то, от чего мы уходим.' } };
    }
    if (!NI) {
      add(60, 'Механик закрыл основные работы, планшет подал сигнал «Основные работы завершены». Но поймать его некому: задачи, на рамке которой висит сигнал, уже нет.', 'bad', [], [], ['f7']);
      return { F, out: { k: 'bad', t: 'Предложение повисло', d: 'Статус навсегда «Отправлено», а не «Истекло». В отчёте Тимура Рашидовича — десятки «висящих» предложений, мастер при выдаче о них не знает.' } };
    }
    if (SI) { add(60, 'Сигнал «Основные работы завершены» прервал ожидание: предложение «Истекло». Мастер обсудит его с Еленой при выдаче (BR-8).', 'ok', [], ['fsig', 'f7', 'f16', 'f21']); return { F, out: { k: 'ok', t: 'Истекло по правилам', d: 'Один финальный статус, машина не стояла лишней минуты, при выдаче мастер предложит работы ещё раз.' } }; }
    add(60, 'Непрерывающий сигнал перевёл предложение в «Истекло», но ожидание продолжается — токенов снова два.', 'warn', ['f7'], ['fsig', 'f16', 'f21']);
    add(75, 'Елена ответила «Согласовать» — уже после «Истекло». Система добавляет работы в заказ-наряд машины, которую в этот момент выдают.', 'bad', [], ['f7', 'f11', 'f12'], ['f21']);
    return { F, out: { k: 'bad', t: 'Два финала сразу', d: 'Предложение и «Истекло», и «Согласовано». Кассир видит в заказ-наряде работы, которых не было, — а это уже нарушение BR-6 с обратной стороны.' } };
  }
  const TQ = [
    { id: 'a', q: 'Таймер прерывающий. Елена ответила в приложении на 22-й минуте. Что с её ответом?', options: [
      { t: 'Потерян: «Ждать решения» уже отменена таймером', ok: true, why: 'Да. Прерывающее событие отменяет задачу — ответ некому принять.' }, { t: 'Учтён: сообщение дождётся', why: 'В BPMN сообщения не копятся «до востребования»: без ожидающей задачи оно теряется.' }, { t: 'Учтён, если мастер ещё не дозвонился', why: 'Состояние звонка не важно: ожидание уже отменено.' }] },
    { id: 'b', q: 'Таймер непрерывающий. Сколько токенов в экземпляре процесса на 20-й минуте?', options: [
      { t: 'Один', why: 'Непрерывающее событие не забирает токен у задачи, а создаёт новый.' }, { t: 'Два: ожидание и звонок мастера', ok: true, why: 'Да: задача продолжает ждать, и параллельно идёт ветка звонка.' }, { t: 'Три', why: 'Сигнал ещё не сработал.' }] },
    { id: 'c', q: 'Зачем событию «Основные работы завершены» быть прерывающим?', options: [
      { t: 'Чтобы ожидание закончилось и у предложения был один финальный статус «Истекло»', ok: true, why: 'Да. Иначе решение может прийти после «Истекло» — во время выдачи.' }, { t: 'Чтобы мастер перестал звонить', why: 'Ветка звонка к этому времени обычно уже закончилась; дело в ожидании решения.' }, { t: 'Прерывающим оно быть не обязано', why: 'Попробуйте сценарий «не отвечает совсем» с непрерывающим сигналом.' }] }
  ];
  const labTask = {
    id: 'tokens', title: 'Лаборатория: прерывающее или непрерывающее?',
    lead: ui.brief({
      situation: 'Глеб: «Покажи мне по минутам, что будет с Еленой. Я не хочу узнать о потерянных ответах из жалоб». Перед вами фрагмент TO-BE. Типы обоих событий на рамке «Ждать решения клиента» можно менять.',
      todo: ['Выберите типы событий и сценарий. Нажимайте «Дальше» или минуты на ленте — смотрите токены и последствия.', 'Пройдите все четыре сценария хотя бы при одной настройке и найдите настройку, при которой все четыре заканчиваются хорошо.', 'Ответьте на три вопроса и оставьте эту настройку. Нажмите «Проверить». Засчитывается при верной настройке и хотя бы двух верных ответах.'],
      look: 'Синий — токен сейчас здесь, зелёный — уже пройдено, жёлтый — отменённая задача, красный — здесь всё пошло не так.'
    }),
    blank: () => ({ tm: 'int', sg: 'ni', sc: 'a', q: {}, seen: [] }),
    reference: () => ({ tm: 'ni', sg: 'int', sc: 'b', q: { a: [0], b: [1], c: [0] }, seen: ['a', 'b', 'c', 'd'] }),
    render(el, ctx) {
      el.classList.add('m3b2-root');
      const a = ctx.ans; a.tm = a.tm || 'int'; a.sg = a.sg || 'ni'; a.sc = a.sc || 'a'; a.q = a.q || {}; a.seen = a.seen || [];
      const rv = !!(ctx.result || ctx.readonly);
      let fi = 0, d;
      el.innerHTML = `<div class="stack">
        <div class="m3b2-set">
          <span>Таймер «20 мин»</span>${ui.seg('tm', [{ v: 'int', t: 'Прерывающий' }, { v: 'ni', t: 'Непрерывающий' }], a.tm, 'sm')}
          <span>Сигнал «Основные работы завершены»</span>${ui.seg('sg', [{ v: 'int', t: 'Прерывающий' }, { v: 'ni', t: 'Непрерывающий' }], a.sg, 'sm')}
          <span>Сценарий</span>${ui.seg('sc', SC, a.sc, 'sm')}
        </div>
        <div data-d></div>${SIG_NOTE}
        <div class="m3b2-ctl"><div class="m3b2-tl" data-t></div><button type="button" class="btn primary sm" data-a="next">Дальше ▶</button></div>
        <div data-f></div><div data-o></div>
        <div class="small dim" data-s></div>
        <div class="m3b2-lbl">Вопросы Глеба</div><div data-q></div>
      </div>`;
      if (ctx.readonly) TR.$$('.m3b2-set [data-seg] button', el).forEach(b => { b.disabled = true; });
      function conf(fr) {
        const c = frag(a.tm, a.sg), hl = {}, badge = {};
        fr.vis.forEach(i => { hl[i] = 'ok'; });
        if (fr.bad.length && fr.k === 'warn') fr.bad.forEach(i => { hl[i] = 'warn'; }); else fr.bad.forEach(i => { hl[i] = 'bad'; });
        fr.tok.forEach(i => { hl[i] = 'accent'; badge[i] = '●'; });
        c.hl = hl; c.nodes = c.nodes.map(n => badge[n.id] ? Object.assign({}, n, { badge: '●' }) : n);
        return c;
      }
      function draw() {
        const r = tl(a.sc, a.tm, a.sg), fr = r.F[fi];
        if (!d) d = diagram(TR.$('[data-d]', el), conf(fr)); else d.redraw(conf(fr));
        TR.$('[data-t]', el).innerHTML = r.F.map((x, i) => `<button type="button" class="chip" data-fi="${i}" aria-pressed="${i === fi}">мин. ${x.m}</button>`).join('');
        TR.$('[data-f]', el).innerHTML = `<div class="m3b2-fr ${fr.k}"><b>Минута ${fr.m}.</b> ${esc(fr.text)}</div>`;
        const last = fi === r.F.length - 1;
        TR.$('[data-o]', el).innerHTML = last ? `<div class="m3b2-fr ${r.out.k}"><b>Итог: ${esc(r.out.t)}.</b> ${esc(r.out.d)}</div>` : '';
        if (last && !ctx.readonly && !a.seen.includes(a.sc)) { a.seen.push(a.sc); ctx.save(); }
        const res = SC.map(s => tl(s.v, a.tm, a.sg).out.k === 'ok');
        TR.$('[data-s]', el).textContent = `Пройдено сценариев: ${a.seen.length} из 4. При текущей настройке хорошо заканчиваются: ${res.filter(Boolean).length} из 4.`;
        TR.$('[data-a="next"]', el).disabled = last;
      }
      ui.onSeg(el, (g, v) => { if (ctx.readonly || !['tm', 'sg', 'sc'].includes(g)) return; a[g] = v; fi = 0; ctx.save(); draw(); });
      TR.on(el, 'click', '[data-fi]', (e, b) => { fi = +b.dataset.fi; draw(); });
      TR.on(el, 'click', '[data-a="next"]', () => { fi++; draw(); });
      draw();
      const qh = TR.$('[data-q]', el);
      TQ.forEach(q => { const box = document.createElement('div'); qh.appendChild(box); ui.quiz(box, { q: q.q, options: q.options, value: a.q[q.id] || [], readonly: ctx.readonly, reveal: rv || null, onChange: v => { a.q[q.id] = v; ctx.save(); } }); });
    },
    check(ans) {
      const a = ans || {}, q = a.q || {}, notes = [];
      const tm = a.tm || 'int', sg = a.sg || 'ni';
      const res = SC.map(s => ({ s, r: tl(s.v, tm, sg).out }));
      const cfgOk = res.every(x => x.r.k === 'ok');
      notes.push(cfgOk ? { ok: true, html: 'Таймер непрерывающий, сигнал прерывающий: все четыре сценария Елены заканчиваются по правилам BR-8.' } : { ok: false, html: `При текущей настройке плохо заканчиваются: ${res.filter(x => x.r.k !== 'ok').map(x => `«${esc(x.s.t)}» — ${esc(x.r.t.toLowerCase())}`).join('; ')}.` });
      let qs = 0;
      TQ.forEach((x, i) => { if (ui.quizScore(x, q[x.id]).ok) qs++; else notes.push({ ok: false, html: `Вопрос ${i + 1}: ${esc(x.options.find(o => o.ok).why)}` }); });
      notes.push({ ok: qs >= 2, html: `Верных ответов: ${qs} из 3.` });
      if ((a.seen || []).length < 4) notes.push({ ok: 'warn', html: `Пройдено сценариев: ${(a.seen || []).length} из 4. Последствия лучше один раз увидеть.` });
      return { ok: cfgOk && qs >= 2, score: (cfgOk ? 0.4 : 0) + 0.2 * qs, notes, summary: `Настройка ${cfgOk ? 'верна' : 'не верна'}, вопросы ${qs}/3.`,
        mentor: tm === 'ni' && sg === 'ni' ? 'Таймер правильный. А сигнал? Запустите сценарий «не отвечает совсем» и дождитесь 75-й минуты.' : tm === 'int' ? 'Посмотрите сценарий «отвечает на 22-й». Куда делся ответ Елены?' : null };
    },
    explain: `<p>Правильная настройка: <b>таймер — непрерывающий</b> (звоним и продолжаем ждать), <b>сигнал — прерывающий</b> (после окончания основных работ ждать нечего). Каждая другая комбинация ломает хотя бы один сценарий:</p>
      <ul><li>прерывающий таймер теряет ответ, пришедший во время звонка, и решение, внесённое мастером по телефону;</li><li>с прерывающим таймером сигнал некому ловить — предложение навсегда «Отправлено»;</li><li>непрерывающий сигнал даёт два финала — «Истекло» и «Согласовано».</li></ul>
      <p>Обратите внимание: сценарии лаборатории — готовые тест-кейсы для Лизы, а настройки — требования для Глеба: «после истечения 20 минут ожидание ответа в приложении не прекращается»; «при событии „основные работы завершены“ предложение в статусе sent переходит в expired, последующие ответы клиента отклоняются с сообщением „предложение истекло“».</p>
      <p class="small muted">Источники: BPMN 2.0 (OMG), 10.5.4 «Boundary Events», 13.5 «Behavior of Events» (cancelActivity); Б. Сильвер, «BPMN Method and Style», гл. 7.</p>`,
    report: ans => { const a = ans || {}; return `Таймер: ${a.tm}, сигнал: ${a.sg}; пройдено сценариев: ${(a.seen || []).join(', ') || '—'}; ответы: ${TQ.map(x => ui.quizScore(x, (a.q || {})[x.id]).ok ? '✓' : '✗').join(' ')}`; }
  };

  // =====================================================================
  // Практика 4. Упростите «спагетти» выдачи и оплаты
  // =====================================================================
  const SP = [
    { id: 'k1', t: 'Отправить push и SMS «Готов»', ok: ['keep'], why: 'Бизнес-шаг по BR-13 — остаётся.' },
    { id: 'k2', t: 'Открыть экран оплаты', ok: ['drop'], why: 'Интерфейс — это макет Ники, а не процесс.' },
    { id: 'k3', t: 'Показать спиннер загрузки', ok: ['drop'], why: 'Деталь интерфейса.' },
    { id: 'k4', t: 'Выбрать способ оплаты', ok: ['sub'], why: 'Часть оплаты — внутрь подпроцесса «Оплатить онлайн».' },
    { id: 'k5', t: 'Создать платёж в ЮKassa', ok: ['sub'], why: 'Наш шаг оплаты — внутрь подпроцесса.' },
    { id: 'k6', t: 'Ввести данные карты', ok: ['ext'], why: 'Это происходит на странице ЮKassa — её процесс, наш пул его не описывает.' },
    { id: 'k7', t: 'Пройти 3-D Secure', ok: ['ext'], why: 'Проверка банка через ЮKassa — чужой процесс.' },
    { id: 'k8', t: 'Получить уведомление об оплате', ok: ['sub'], why: 'Наш шаг оплаты: ждём вебхук — внутрь подпроцесса.' },
    { id: 'k9', t: 'Повторить запрос 3 раза при ошибке сети', ok: ['drop'], why: 'Технический повтор — в требования к интеграции и в диаграмму последовательности, не в бизнес-процесс.' },
    { id: 'k10', t: 'Пробить чек через онлайн-кассу', ok: ['keep', 'sub'], why: 'Бизнес-шаг по 54-ФЗ. Можно оставить на верхнем уровне или включить в «Оплатить онлайн» — оба варианта честные.' },
    { id: 'k11', t: 'Начислить бонусы 5 %', ok: ['keep'], why: 'Бизнес-правило BR-11 — важно Кириллу и клиенту, остаётся.' },
    { id: 'k12', t: 'Выдать ключи', ok: ['keep'], why: 'Сам смысл процесса — остаётся.' },
    { id: 'k13', t: 'Записать лог в систему мониторинга', ok: ['drop'], why: 'Техническая деталь для разработчиков.' },
    { id: 'k14', t: 'Показать «Спасибо за оплату!»', ok: ['drop'], why: 'Экран, а не работа.' }
  ];
  const SP_ACT = [{ v: 'keep', t: 'Оставить' }, { v: 'sub', t: 'В подпроцесс «Оплатить онлайн»' }, { v: 'ext', t: 'Это делает ЮKassa' }, { v: 'drop', t: 'Убрать' }];
  function spBefore() {
    const nodes = [{ id: 's', type: 'start', t: 'Машина готова', lane: 'x', col: 0 }], flows = [];
    SP.forEach((x, i) => nodes.push({ id: x.id, type: 'task', t: x.t, lane: 'x', col: i < 7 ? i + 1 : i - 6, row: i < 7 ? 0 : 1 }));
    nodes.push({ id: 'e', type: 'end', t: 'Машина выдана', lane: 'x', col: 8, row: 1 });
    flows.push({ from: 's', to: 'k1' }); SP.slice(1).forEach((x, i) => flows.push({ from: SP[i].id, to: x.id })); flows.push({ from: 'k14', to: 'e' }); flows.push({ from: 'k9', to: 'k5', drop: 26 });
    return { title: 'Спагетти: до', pool: '«Искра»: выдача и оплата', lanes: [{ id: 'x', t: '' }], colW: 132, rowH: 80, nodes, flows };
  }
  function spAfter(v) {
    const ch = [], seen = { sub: false };
    SP.forEach(x => { const a = v[x.id]; if (a === 'sub') { if (!seen.sub) { seen.sub = true; ch.push({ id: 'sub', type: 'sub', t: 'Оплатить онлайн' }); } } else if (a === 'keep' || !a) ch.push({ id: x.id, type: 'task', t: x.t, tone: a ? '' : 'warn' }); });
    const ext = SP.some(x => v[x.id] === 'ext');
    const nodes = [{ id: 's', type: 'start', t: 'Машина готова', lane: 'x', col: 0 }].concat(ch.map((n, i) => Object.assign({ lane: 'x', col: i + 1 }, n)), [{ id: 'e', type: 'end', t: 'Машина выдана', lane: 'x', col: ch.length + 1 }]);
    const ids = nodes.map(n => n.id), flows = ids.slice(1).map((id, i) => ({ from: ids[i], to: id }));
    const pools = [{ id: 'pi', t: '«Искра»: выдача', lanes: [{ id: 'x', t: '' }] }];
    if (ext) { pools.push({ id: 'py', t: 'ЮKassa', blackbox: true }); const tgt = ids.includes('sub') ? 'sub' : ch.length ? ch[0].id : 's'; flows.push({ from: tgt, to: 'py', kind: 'msg', t: 'платёж', ax: null }); flows.push({ from: 'py', to: tgt, kind: 'msg', t: 'оплачено' }); }
    // два сообщения к одному узлу разводим по x
    if (ext) { const i = ids.indexOf(ids.includes('sub') ? 'sub' : ch.length ? ch[0].id : 's'), cx = 40 + i * CW + CW / 2; flows[flows.length - 2].ax = cx - 22; flows[flows.length - 1].bx = cx + 22; }
    return { cfg: { title: 'После упрощения', pools, colW: CW, rowH: 80, nodes, flows }, count: nodes.length + (ext ? 1 : 0) };
  }
  const simplifyTask = {
    id: 'simplify', title: 'Упростите «спагетти»: выдача и оплата',
    lead: ui.brief({
      situation: 'Стажёр нарисовал процесс выдачи машины с оплатой — 16 элементов в одну ленту, с экранами и повторами запросов. Марина Олеговна: «Я на третьем прямоугольнике потерялась». Вера: «Ничего не теряем по смыслу — только переносим на свои места».',
      todo: ['Для каждого шага выберите: оставить на этом уровне, свернуть в подпроцесс «Оплатить онлайн», отдать в пул ЮKassa или убрать (интерфейс и техника).', 'Справа — «после»: смотрите, как диаграмма становится короче.', 'Нажмите «Проверить». Засчитывается от 80 %, если не убран ни один бизнес-шаг.'],
      look: 'Убирать можно только то, что не меняет бизнес-смысл: экраны, спиннеры, логи, технические повторы. Бизнес-шаги переносят — в подпроцесс или к тому участнику, который их делает.'
    }),
    blank: () => ({ v: {} }),
    reference: () => ({ v: Object.fromEntries(SP.map(x => [x.id, x.ok[0]])) }),
    render(el, ctx) {
      el.classList.add('m3b2-root');
      const a = ctx.ans; a.v = a.v || {};
      const rv = !!(ctx.result || ctx.readonly);
      el.innerHTML = `<div class="stack"><div class="m3b2-lbl">До</div><div data-b></div><div class="m3b2-rows" data-r></div><div class="m3b2-stats" data-s></div><div class="m3b2-lbl">После</div><div data-a></div></div>`;
      diagram(TR.$('[data-b]', el), spBefore());
      let d;
      function draw() {
        TR.$('[data-r]', el).innerHTML = SP.map(x => { const v = a.v[x.id], ok = x.ok.includes(v), crit = v === 'drop' && x.ok.includes('keep'); return `<div class="m3b2-srow ${rv && v ? (ok ? 'ok' : crit ? 'bad' : 'warn') : ''}"><div>${esc(x.t)}</div><div class="m3b2-picks">${SP_ACT.map(c => `<button type="button" class="chip" data-x="${x.id}" data-v="${c.v}" aria-pressed="${v === c.v}" ${ctx.readonly ? 'disabled' : ''}>${esc(c.t)}</button>`).join('')}</div>${rv && v ? `<div class="why">${ok ? '' : 'Лучше: ' + esc(SP_ACT.find(c => c.v === x.ok[0]).t.toLowerCase()) + '. '}${esc(x.why)}</div>` : ''}</div>`; }).join('');
        const r = spAfter(a.v), done = SP.filter(x => a.v[x.id]).length;
        TR.$('[data-s]', el).innerHTML = `<span>Было элементов: 16</span><span>Стало: ${r.count}</span><span>Решено шагов: ${done} из ${SP.length}</span>`;
        if (!d) d = diagram(TR.$('[data-a]', el), r.cfg); else d.redraw(r.cfg);
      }
      TR.on(el, 'click', '[data-x]', (e, b) => { a.v[b.dataset.x] = b.dataset.v; ctx.save(); draw(); });
      draw();
    },
    check(ans) {
      const v = (ans && ans.v) || {}, notes = [];
      const good = SP.filter(x => x.ok.includes(v[x.id])), lost = SP.filter(x => v[x.id] === 'drop' && x.ok.includes('keep'));
      notes.push({ ok: good.length >= 12, html: `Верных решений: ${good.length} из ${SP.length}. Элементов после упрощения: ${spAfter(v).count} вместо 16.` });
      lost.forEach(x => notes.push({ ok: false, html: `Убран бизнес-шаг «${esc(x.t)}». ${esc(x.why)} Упрощение не должно терять смысл.` }));
      SP.filter(x => v[x.id] && !x.ok.includes(v[x.id]) && !lost.includes(x)).forEach(x => notes.push({ ok: 'warn', html: `«${esc(x.t)}»: лучше — ${esc(SP_ACT.find(c => c.v === x.ok[0]).t.toLowerCase())}. ${esc(x.why)}` }));
      const miss = SP.filter(x => !v[x.id]).length; if (miss) notes.push({ ok: false, html: `Не решено шагов: ${miss}.` });
      const score = good.length / SP.length;
      return { ok: score >= 0.8 && !lost.length, score, notes, summary: `Верно ${good.length} из ${SP.length}.`,
        mentor: v.k6 === 'sub' || v.k7 === 'sub' ? 'Ввод карты и 3-D Secure происходят на стороне ЮKassa. Если нарисовать их в нашем подпроцессе, мы будем поддерживать описание чужой системы — и ошибёмся при первом её обновлении.' : lost.length ? 'Упрощать — не значит выкидывать. Бизнес-шаг можно свернуть, но не потерять.' : null };
    },
    explain: `<p>Из 16 элементов осталось 7–8: «Машина готова» → уведомить → <b>Оплатить онлайн</b> (подпроцесс) ⇄ ЮKassa → пробить чек → начислить бонусы → выдать ключи → «Машина выдана». Ничего важного не потеряно: шаги оплаты — внутри подпроцесса, ввод карты и 3-D Secure — в свёрнутом пуле ЮKassa, экраны — в макетах Ники, повторы запросов и логи — в требованиях к интеграции.</p>
      <p>Обратите внимание на «ловушку» с повтором: стрелка назад «повторить 3 раза» делает бизнес-диаграмму похожей на код. Такие правила живут в нефункциональных требованиях и на диаграмме последовательности (занятие в январе).</p>
      <p class="small muted">Источники: Я. Мендлинг, Х. Рейерс, В. ван дер Аалст, «Seven Process Modeling Guidelines (7PMG)», 2010; Б. Сильвер, «BPMN Method and Style» — иерархическое моделирование; BPMN 2.0 (OMG), 9.2 «Pool and Participant».</p>`,
    refNote: '«Пробить чек» засчитывается и на верхнем уровне, и внутри подпроцесса.',
    report: ans => { const v = (ans && ans.v) || {}; return SP.map(x => `${x.t}: ${(SP_ACT.find(c => c.v === v[x.id]) || { t: '—' }).t}`).join('\n'); }
  };

  // =====================================================================
  // Практика 5. Объясните TO-BE Марине Олеговне
  // =====================================================================
  const R_RUB = [
    'Предложение с фото и ценой уходит клиенту в приложение; корпоративным в пределах лимита (у «Шашки» 3 000 ₽) — согласуется автоматически',
    'Через 20 минут без ответа мастер звонит, а ответ в приложении всё ещё принимается',
    'Не дозвонились — основные работы продолжаются, машина не простаивает; доп. работы ждут',
    'К концу основных работ ответа нет — предложение «Истекло», его обсуждают при выдаче; без согласия платные работы не делают (BR-6)',
    'Говорит языком станции, без терминов BPMN, и связывает с целью: простой 1 ч 40 мин → 20 мин'
  ];
  const R_REF = 'Марина Олеговна, машина больше не будет стоять из-за согласования. Как это будет: механик фотографирует проблему на планшете, мастер ставит цену — и предложение сразу уходит клиенту в приложение, с фото. Если это «Шашка» и сумма до 3 000 ₽, всё согласуется само, звонить Рустаму не нужно. Если клиент молчит 20 минут, мастеру приходит задача позвонить — но приложение продолжает ждать: ответит клиент кнопкой, пока мастер набирает номер, — ответ засчитается. Не дозвонились — ничего страшного: механик продолжает основные работы, а дополнительные просто ждут. Когда основные работы закончены, а ответа так и нет, предложение получает статус «Истекло», и мастер обсуждает его с клиентом при выдаче. Без согласия клиента платные работы не делаем — это закон. В итоге машина на подъёмнике не ждёт ответа: мы рассчитываем, что вместо 1 часа 40 минут простоя будет не больше 20.';
  const explainTask = {
    id: 'marina2', title: 'Объясните TO-BE Марине Олеговне',
    lead: ui.brief({
      situation: 'Вечером Марина Олеговна пишет Вере: «Посмотрела вашу схему. А если клиент не ответит? Машина будет стоять на подъёмнике, как сейчас? Объясните по-человечески, без кружочков». Вера пересылает вам: «Ответьте вы, вы собирали TO-BE».',
      todo: ['Ответьте своими словами: 5–8 предложений, от 300 символов. Пройдите по всем веткам: ответил, молчит 20 минут, не дозвонились, работы закончены, корпоративный клиент.', 'Нажмите «Проверить с Верой (Claude)» или «Сверить с эталоном самому» и отметьте пункты. Затем «Проверить». Засчитывается от 60 %.'],
      look: 'Марина Олеговна думает о посте и о клиенте у стойки. Говорите о том, что увидит мастер и что будет с машиной, а не о таймерах и сигналах.'
    }),
    blank: () => ({ j: {} }),
    reference: () => ({ j: { text: R_REF, self: R_RUB.map(() => true) } }),
    render(el, ctx) {
      el.classList.add('m3b2-root');
      const a = ctx.ans; a.j = a.j || {};
      el.innerHTML = ui.say('marina', 'А если клиент не ответит? Машина будет стоять на подъёмнике, как сейчас? Объясните по-человечески, без кружочков.') + '<div style="margin-top:12px"></div>';
      const j = document.createElement('div'); el.appendChild(j);
      ui.justify(j, {
        id: 'm3b2-marina', q: 'Ответ Марине Олеговне: как будет работать согласование доп. работ', placeholder: 'Марина Олеговна, …',
        qPlain: 'Автосервис «Искра» внедряет согласование дополнительных работ через приложение: механик фотографирует проблему, мастер-приёмщик формирует предложение с ценой, оно уходит клиенту. Правила: корпоративным клиентам до лимита договора (3 000 ₽) — автосогласование; нет ответа 20 минут — мастер звонит, приложение продолжает ждать; не дозвонились — основные работы продолжаются, доп. ждут; к концу основных работ нет ответа — «Истекло», обсуждают при выдаче; без согласия платные работы не делаются. Сейчас машина стоит на согласовании 1 ч 40 мин, цель — 20 минут. Объясните управляющей станцией простыми словами.',
        rubric: R_RUB, reference: R_REF, value: a.j, readonly: ctx.readonly, minLen: 300,
        onChange: v => { a.j = v; ctx.save(); ctx.decide('Объяснение TO-BE согласования Марине Олеговне', v.text || ''); }
      });
    },
    check(ans) {
      const j = (ans && ans.j) || {}, s = ui.justifyScore(j), t = (j.text || '').trim(), n = TR.norm(t), notes = [];
      if (t.length < 300) notes.push({ ok: false, html: `Ответ короче 300 символов (${t.length}).` });
      if (!(j.ai || j.self)) notes.push({ ok: false, html: 'Проверьте ответ: «Проверить с Верой» или «Сверить с эталоном самому» — и отметьте пункты.' });
      else if (s < 0.6) notes.push({ ok: false, html: 'Пока мало пунктов. Что будет через 20 минут? А если не дозвонились? Что к концу основных работ? Что с «Шашкой»?' });
      else notes.push({ ok: true, html: `Ответ: ${Math.round(s * 100)} %.` });
      const sig = [[/20 ?мин/, '20 минут и звонок'], [/истек/, '«Истекло»'], [/лимит|3 ?000|шашк/, 'автосогласование корпоративных'], [/основн/, 'основные работы продолжаются']];
      const miss = sig.filter(x => !x[0].test(n)).map(x => x[1]);
      if (t.length >= 300 && miss.length) notes.push({ ok: 'warn', html: `Не прозвучало: ${miss.join(', ')}.` });
      if (t.length >= 300 && /(токен|шлюз|граничн|непрерыва|сигнал)/.test(n)) notes.push({ ok: 'warn', html: 'Марина Олеговна просила без кружочков: «токен», «граничное», «непрерывающее», «сигнал» лучше заменить на «мастеру приходит задача», «приложение продолжает ждать».' });
      return { ok: s >= 0.6 && t.length >= 300, score: s, notes };
    },
    explain: `<p>Сильный ответ — это тот же TO-BE, пересказанный по веткам, но языком станции: «приложение продолжает ждать» вместо «непрерывающий таймер», «когда механик закрыл основные работы» вместо «сигнал». Главное для Марины Олеговны — что машина не простаивает и что мастер не остаётся крайним: звонок — подстраховка, а не основной канал.</p>
      <p>Хорошо, если прозвучало правовое основание (без согласия — нельзя, BR-6) и цель: простой на согласовании 1 ч 40 мин → 20 мин. Это превращает схему из «очередной программы» в ответ на её же боль.</p>
      <p class="small muted">Источники: BABOK v3, техника 10.35 «Process Modelling» и 10.43 «Reviews»; К. Вигерс, Дж. Битти, «Разработка требований к программному обеспечению» — представление требований пользователям.</p>`,
    report: ans => `Объяснение TO-BE Марине Олеговне: ${(ans && ans.j && ans.j.text) || '—'}`
  };

  // =====================================================================
  TR.stage({
    id: ID,
    when: 'среда, 23 декабря, 10:00 · согласование доп. работ «как будет»',
    intro: [
      { who: 'vera', html: 'Сегодня — TO-BE самого дорогого места: согласования доп. работ. Сейчас машина стоит на подъёмнике в среднем <b>1 ч 40 мин</b>, 38 % клиентов не берут трубку с первого раза. Цель — <b>20 минут</b>.' },
      { who: 'petrovich', html: 'Мне главное — чтобы механик не стоял с ключом в руке и не ждал. Нашёл, сфотографировал, работает дальше по основному.' },
      { who: 'gleb', html: 'А мне нужна точность. Через 20 минут мы перестаём ждать ответ в приложении или нет? Когда предложение становится «Истекло»? «Шашку» согласуем сами — до какой суммы?' },
      { who: 'vera', html: 'Все три вопроса — это элементы BPMN, которых мы ещё не знаем: таймеры, граничные события, сигналы. Разберёмся — и соберём TO-BE так, чтобы Глеб по нему писал код, а Марина Олеговна — понимала.' }
    ],
    facts: ['F-idle', 'F-extra-law', 'F-extra-who', 'F-extra-timeout', 'F-corp'],
    glossary: [
      { term: 'Граничное событие', simple: '«Сторож» на рамке задачи: ловит событие, пока задача идёт.', tech: 'Boundary event — промежуточное событие, прикреплённое к активности (BPMN 2.0, 10.5.4).' },
      { term: 'Прерывающее и непрерывающее', simple: 'Прерывающее останавливает задачу, непрерывающее — запускает дополнительную работу параллельно.', tech: 'Атрибут cancelActivity: true — сплошная обводка, false — пунктирная; непрерывающее порождает новый токен.' },
      { term: 'Таймер', simple: 'Событие «наступило время»: дата, длительность или цикл.', tech: 'Timer event: timeDate, timeDuration, timeCycle в формате ISO 8601 (например, PT20M).' },
      { term: 'Сигнал', simple: 'Объявление «для всех, кто слушает», без адресата.', tech: 'Signal event — широковещательное событие; в отличие от сообщения не адресовано конкретному участнику.' },
      { term: 'Ошибка и эскалация', simple: 'Ошибка — авария, работу бросают. Эскалация — «позвать старшего», работа может идти дальше.', tech: 'Error — всегда прерывающее граничное событие; escalation — может быть непрерывающим, обычно бросается из подпроцесса.' },
      { term: 'Шлюз по событию', simple: 'Развилка «что случится раньше».', tech: 'Event-based gateway — выбор пути по первому наступившему событию; за ним — ловящие события или задачи получения.' },
      { term: 'Шлюз «ИЛИ»', simple: 'Развилка «одно, несколько или все»: идём по всем путям с истинным условием.', tech: 'Inclusive gateway (OR); слияние ждёт только активированные ветки.' },
      { term: 'Подпроцесс', simple: 'Прямоугольник с «+», внутри которого своя диаграмма.', tech: 'Sub-process: свёрнутый или развёрнутый; event sub-process запускается событием внутри родителя; call activity вызывает глобальный процесс.' },
      { term: 'Пул-«чёрный ящик»', simple: 'Участник, чей процесс мы не рисуем, — только сообщения с ним.', tech: 'Black-box pool в collaboration-диаграмме: участник без раскрытого процесса (ЮKassa, 1С, SMS-шлюз).' },
      { term: 'Задача отправки и получения', simple: 'Отправить сообщение другому участнику — и ждать его ответа.', tech: 'Send task / receive task; к задаче получения удобно крепить граничные таймеры.' }
    ],
    outro: 'TO-BE согласования готов и проверен по минутам: непрерывающий таймер — звонок мастера без потери ответа в приложении, прерывающий сигнал — «Истекло» к концу основных работ, автосогласование «Шашки» до 3 000 ₽. Глеб уже выписывает статусы предложения, Лиза — тест-кейсы из сценариев Елены. После праздников — 11 января: как именно приложение, бэкенд и ЮKassa разговаривают друг с другом. Это уже диаграмма последовательности.',
    tasks: [howEvents, howBoundary, howStructure, evtypesTask, slotsTask, labTask, simplifyTask, explainTask]
  });
})();
