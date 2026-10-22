/* Модуль 3, занятие 2: Интерфейсные требования и работа с Figma.
   Теория: схема, макет и прототип; Figma глазами аналитика (файл и страницы, фреймы, компоненты и варианты, auto
   layout, прототип, комментарии, режим разработчика, версии, ссылка на фрейм) и чек-лист ревью макета; спецификация
   экрана (поле, тип, обязательность, формат и маска, валидация и текст ошибки, умолчание, источник и API-поле, права);
   состояния экрана (пусто, загрузка, ошибка, нет сети, успех, длинный текст) и навигация.
   Практика: ревью макета Ники «Выбор времени» — найти проблемы кликом; спецификация полей экрана «Запись»;
   лаборатория «состояния экрана „Мои записи“» с прогоном Лизы и последствиями; сопоставить элементы экрана
   «Согласование доп. работ» с полями API и базы; комментарий Нике в Figma своими словами. */
'use strict';
(function () {
  const TR = window.TR, ui = TR.ui, esc = TR.esc;
  const ID = 'm3-ui';

  if (!document.getElementById('mui-css')) document.head.insertAdjacentHTML('beforeend', `<style id="mui-css">
    .mui-root, .mui-root .stack > * { min-width: 0; }
    .mui-root .seg button { white-space: normal; text-align: left; }
    .mui-root .card.flat { display: block; }
    .mui-canvas { overflow-x: auto; max-width: 100%; border: 1px solid var(--border); border-radius: 12px; padding: 14px; background-color: var(--surface-2); background-image: radial-gradient(var(--grid-line) 1px, transparent 1px); background-size: 16px 16px; }
    .mui-row { display: flex; gap: 18px; align-items: flex-start; flex-wrap: wrap; }
    .mui-frame { margin: 0; display: grid; gap: 6px; justify-items: start; min-width: 0; }
    .mui-frame figcaption { font: 600 11px/1.3 var(--f-mono); color: var(--info); letter-spacing: .02em; }
    .mui-frame figcaption small { color: var(--text-muted); font-weight: 400; margin-left: 6px; }
    .mui-ph { width: 270px; max-width: 100%; border: 1px solid var(--border-strong); border-radius: 28px; background: var(--bg); padding: 9px; box-shadow: var(--shadow); position: relative; }
    .mui-scr { border-radius: 20px; background: var(--surface); overflow: hidden; min-height: 470px; display: flex; flex-direction: column; font: 12.5px/1.4 var(--f-body); color: var(--text); position: relative; }
    .mui-sb { display: flex; justify-content: space-between; padding: 6px 14px 2px; font: 600 10.5px var(--f-mono); color: var(--text-2); }
    .mui-ab { display: grid; grid-template-columns: 22px minmax(0, 1fr) 22px; align-items: center; padding: 6px 10px 8px; border-bottom: 1px solid var(--border); }
    .mui-ab b { font: 600 14px/1.2 var(--f-brand); text-align: center; }
    .mui-ab span { color: var(--accent); font-size: 18px; line-height: 1; }
    .mui-body { padding: 8px 10px; display: grid; gap: 8px; align-content: start; flex: 1; }
    .mui-lbl { font-size: 11px; color: var(--text-muted); }
    .mui-chip { display: inline-block; border: 1px solid var(--border-strong); border-radius: 99px; padding: 2px 9px; font-size: 11.5px; background: var(--surface-2); }
    .mui-days { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 4px; }
    .mui-day { border: 1px solid var(--border); border-radius: 8px; padding: 3px 0; text-align: center; font-size: 11px; background: var(--surface-2); }
    .mui-day.on { background: var(--accent); color: var(--accent-text, #fff); border-color: var(--accent); }
    .mui-slots { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 5px; }
    .mui-slot { border: 1px solid color-mix(in srgb, var(--accent) 50%, var(--border)); border-radius: 8px; padding: 5px 0; text-align: center; font: 600 12px var(--f-mono); color: var(--accent); background: var(--surface); }
    .mui-slot.busy { color: color-mix(in srgb, var(--accent) 70%, var(--text-muted)); border-color: color-mix(in srgb, var(--accent) 40%, var(--border)); }
    .mui-slot.off { color: var(--text-muted); border-color: var(--border); background: var(--surface-2); text-decoration: line-through; }
    .mui-btn { display: block; text-align: center; border-radius: 12px; padding: 9px; background: var(--accent); color: var(--accent-text, #fff); font-weight: 600; font-size: 13px; }
    .mui-btn.ghost { background: transparent; color: var(--accent); border: 1px solid var(--accent); }
    .mui-btn.dis { opacity: .45; }
    .mui-btn.sm { padding: 5px 8px; font-size: 11.5px; border-radius: 9px; display: inline-block; }
    .mui-tab { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); border-top: 1px solid var(--border); padding: 6px 4px 8px; font-size: 10px; text-align: center; color: var(--text-muted); margin-top: auto; }
    .mui-tab .on { color: var(--accent); font-weight: 600; }
    .mui-f { display: grid; gap: 2px; }
    .mui-in { border: 1px solid var(--border-strong); border-radius: 8px; padding: 6px 8px; background: var(--surface-2); min-height: 28px; font-size: 12px; overflow-wrap: anywhere; }
    .mui-in.ph { color: var(--text-muted); }
    .mui-in.err { border-color: var(--bad); }
    .mui-et { color: var(--bad); font-size: 11px; }
    .mui-card { border: 1px solid var(--border); border-radius: 12px; padding: 8px 9px; background: var(--surface-2); display: grid; gap: 3px; overflow-wrap: anywhere; }
    .mui-card b { font-size: 12.5px; }
    .mui-sk { height: 54px; border-radius: 12px; background: linear-gradient(90deg, var(--surface-2), var(--surface-3), var(--surface-2)); }
    .mui-ban { border-radius: 10px; padding: 6px 9px; font-size: 11.5px; background: var(--warn-soft); border: 1px solid color-mix(in srgb, var(--warn) 50%, var(--border)); }
    .mui-ban.bad { background: var(--bad-soft); border-color: color-mix(in srgb, var(--bad) 50%, var(--border)); }
    .mui-empty { display: grid; justify-items: center; gap: 6px; text-align: center; padding: 26px 8px; color: var(--text-2); }
    .mui-empty .ic { font-size: 34px; }
    .mui-code { font: 11px/1.4 var(--f-mono); color: var(--bad); background: var(--surface-2); border-radius: 8px; padding: 6px; overflow-wrap: anywhere; }
    .mui-spin { width: 28px; height: 28px; border-radius: 50%; border: 3px solid var(--surface-3); border-top-color: var(--accent); margin: 80px auto; }
    .mui-hs { display: block; width: 100%; font: inherit; color: inherit; text-align: left; background: transparent; border: 0; padding: 3px; margin: -3px; width: calc(100% + 6px); border-radius: 9px; cursor: pointer; outline: 2px dashed transparent; outline-offset: 0; position: relative; }
    .mui-hs:hover { outline-color: var(--border-strong); }
    .mui-hs[aria-pressed="true"] { outline-color: var(--accent); background: var(--accent-soft); }
    .mui-hs.ok { outline: 2px solid var(--ok); background: var(--ok-soft); } .mui-hs.bad { outline: 2px solid var(--bad); background: var(--bad-soft); } .mui-hs.miss { outline: 2px dashed var(--warn); }
    .mui-hs:disabled { cursor: default; }
    .mui-hs .num { position: absolute; top: -8px; right: -6px; width: 18px; height: 18px; border-radius: 50%; background: var(--accent); color: var(--accent-text, #fff); font: 700 10.5px/18px var(--f-mono); text-align: center; }
    .mui-pin { position: absolute; display: grid; place-items: center; width: 24px; height: 24px; border-radius: 50% 50% 50% 2px; background: var(--violet); color: #fff; font: 700 11px var(--f-brand); box-shadow: var(--shadow); }
    .mui-cmt { border: 1px solid color-mix(in srgb, var(--violet) 40%, var(--border)); background: var(--violet-soft); border-radius: 12px; padding: 8px 10px; font-size: 12.5px; max-width: 250px; }
    .mui-cmt b { color: var(--violet); }
    .mui-side { width: 200px; max-width: 100%; border: 1px solid var(--border); border-radius: 12px; background: var(--surface); padding: 8px; display: grid; gap: 6px; font-size: 12.5px; }
    .mui-side .h { font: 600 10.5px/1.3 var(--f-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--text-muted); }
    .mui-layer { padding: 3px 6px; border-radius: 6px; } .mui-layer.on { background: var(--info-soft); color: var(--info); }
    .mui-fig { display: grid; grid-template-columns: minmax(0, 170px) minmax(0, 1fr) minmax(0, 170px); border: 1px solid var(--border-strong); border-radius: 12px; overflow: hidden; background: var(--surface); min-width: 640px; font-size: 12.5px; }
    .mui-fig .top { grid-column: 1 / -1; display: flex; gap: 10px; align-items: center; padding: 6px 10px; border-bottom: 1px solid var(--border); background: var(--surface-2); }
    .mui-fig .pn { border-right: 1px solid var(--border); padding: 8px; display: grid; gap: 4px; align-content: start; }
    .mui-fig .pn:last-child { border-right: 0; border-left: 1px solid var(--border); }
    .mui-fig .cv { padding: 12px; display: flex; gap: 14px; align-items: flex-start; position: relative; background-color: var(--surface-2); background-image: radial-gradient(var(--grid-line) 1px, transparent 1px); background-size: 14px 14px; min-height: 250px; }
    .mui-fb { font: inherit; font-size: 12px; color: inherit; text-align: left; border: 1px solid transparent; background: transparent; border-radius: 6px; padding: 4px 6px; cursor: pointer; }
    .mui-fb:hover { border-color: var(--border-strong); }
    .mui-fb[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); }
    .mui-mini { width: 112px; border: 1px solid var(--info); border-radius: 10px; background: var(--surface); padding: 6px; display: grid; gap: 4px; font-size: 10px; }
    .mui-mini i { display: block; height: 7px; border-radius: 3px; background: var(--surface-3); }
    .mui-mini .bt { height: 14px; border-radius: 5px; background: var(--accent); }
    .mui-mini.comp { border-color: var(--violet); border-style: dashed; }
    .mui-spec { display: grid; grid-template-columns: minmax(0, 150px) minmax(0, 1fr); gap: 4px 10px; font-size: 13.5px; border: 1px solid var(--border); border-radius: 12px; padding: 10px 12px; background: var(--surface); }
    .mui-spec > b { font: 600 11px/1.5 var(--f-mono); letter-spacing: .04em; text-transform: uppercase; color: var(--text-muted); }
    .mui-spec > span { min-width: 0; overflow-wrap: anywhere; }
    .mui-two { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 16px; align-items: start; }
    .mui-fl { display: grid; gap: 8px; }
    .mui-fr { border: 1px solid var(--border); border-radius: 12px; background: var(--surface); padding: 10px 12px; display: grid; gap: 8px; min-width: 0; }
    .mui-fr > header { display: flex; gap: 8px; align-items: baseline; flex-wrap: wrap; }
    .mui-fr > header b { font: 600 15px/1.3 var(--f-brand); }
    .mui-fr > header .n { width: 20px; height: 20px; border-radius: 50%; background: var(--accent); color: var(--accent-text, #fff); font: 700 11px/20px var(--f-mono); text-align: center; flex: none; }
    .mui-cells { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
    .mui-cell { display: grid; gap: 3px; min-width: 0; }
    .mui-cell > span { font: 600 10.5px/1.3 var(--f-mono); letter-spacing: .06em; text-transform: uppercase; color: var(--text-muted); }
    .mui-cell select { width: 100%; min-width: 0; font-size: 13px; }
    .mui-cell.ok select { border-color: var(--ok); } .mui-cell.bad select { border-color: var(--bad); } .mui-cell.warn select { border-color: var(--warn); }
    .mui-cell .why { font-size: 12.5px; color: var(--text-2); }
    .mui-cell.wide { grid-column: 1 / -1; }
    .mui-opts { display: grid; gap: 6px; }
    .mui-opt { display: grid; grid-template-columns: 18px minmax(0, 1fr); gap: 8px; align-items: start; text-align: left; font: inherit; font-size: 13.5px; color: inherit; background: var(--surface-2); border: 1px solid var(--border); border-radius: 10px; padding: 7px 10px; cursor: pointer; min-width: 0; overflow-wrap: anywhere; }
    .mui-opt .bx { width: 14px; height: 14px; margin-top: 3px; border-radius: 50%; border: 2px solid var(--border-strong); }
    .mui-opt[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); }
    .mui-opt[aria-pressed="true"] .bx { border-color: var(--accent); background: var(--accent); }
    .mui-opt.ok { border-color: var(--ok); background: var(--ok-soft); } .mui-opt.bad { border-color: var(--bad); background: var(--bad-soft); } .mui-opt.warn { border-color: var(--warn); background: var(--warn-soft); }
    .mui-opt:disabled { cursor: default; }
    .mui-opt .why { display: block; margin-top: 4px; font-size: 12.5px; color: var(--text-2); }
    .mui-stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; }
    .mui-stat { border: 1px solid var(--border); border-radius: 12px; padding: 8px 10px; background: var(--surface); display: grid; gap: 2px; }
    .mui-stat .v { font: 700 20px/1.1 var(--f-mono); } .mui-stat .k { font-size: 12px; color: var(--text-muted); }
    .mui-stat.ok .v { color: var(--ok); } .mui-stat.bad .v { color: var(--bad); }
    .mui-runs { display: grid; gap: 8px; }
    .mui-run { border: 1px solid var(--border); border-left: 4px solid var(--border-strong); border-radius: 10px; padding: 8px 12px; background: var(--surface); display: grid; gap: 4px; font-size: 13.5px; }
    .mui-run.good { border-left-color: var(--ok); } .mui-run.bad { border-left-color: var(--bad); } .mui-run.mid { border-left-color: var(--warn); }
    .mui-run .hd { font-weight: 600; } .mui-run .tx { color: var(--text-2); }
    .mui-list { display: grid; gap: 6px; }
    .mui-li { border: 1px solid var(--border); border-radius: 10px; padding: 7px 10px; background: var(--surface); font-size: 13.5px; }
    .mui-li.ok { border-color: var(--ok); background: var(--ok-soft); } .mui-li.bad { border-color: var(--bad); background: var(--bad-soft); } .mui-li.warn { border-color: var(--warn); background: var(--warn-soft); }
    .mui-photo { display: block; width: 100%; height: auto; border-radius: 10px; }
    .mui-photo .bg { fill: var(--surface-3); } .mui-photo .disc { fill: var(--surface-2); stroke: var(--text-muted); stroke-width: 3; }
    .mui-photo .pad { fill: var(--warn-soft); stroke: var(--warn); stroke-width: 2; } .mui-photo .wear { stroke: var(--bad); stroke-width: 2.5; fill: none; }
    .mui-photo text { fill: var(--text-2); font: 600 10px var(--f-mono); }
    @media (max-width: 760px) {
      .mui-two { grid-template-columns: minmax(0, 1fr); }
      .mui-cells { grid-template-columns: minmax(0, 1fr); }
      .mui-spec { grid-template-columns: minmax(0, 1fr); gap: 0 10px; } .mui-spec > span { margin-bottom: 6px; }
      .mui-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .mui-side { width: 100%; }
    }
  </style>`);

  // ---------- общие помощники ----------
  const anNote = html => `<div style="margin-top:12px">${ui.note('info', 'Позиция аналитика', html)}</div>`;
  const interview = (q, a) => ui.note('', 'Как об этом спрашивают на собеседовании', `<b>«${q}»</b><br>${a}`);
  const mark = s => s === 'ok' ? '✓' : s === 'warn' ? '≈' : '✗';
  const phone = (name, body, o) => `<figure class="mui-frame">${name ? `<figcaption><span aria-hidden="true">#</span> ${esc(name)}<small>${(o && o.size) || '390 × 844'}</small></figcaption>` : ''}<div class="mui-ph"><div class="mui-scr"><div class="mui-sb"><span>${(o && o.time) || '9:40'}</span><span>${(o && o.net) || '4G ▮▮▮'}</span></div>${body}</div>${(o && o.pins) || ''}</div></figure>`;
  const appbar = (t, back) => `<div class="mui-ab"><span>${back === false ? '' : '‹'}</span><b>${esc(t)}</b><span></span></div>`;
  const tabbar = on => `<div class="mui-tab">${['Главная', 'Записи', 'Гараж', 'Профиль'].map(t => `<span class="${t === on ? 'on' : ''}">${t}</span>`).join('')}</div>`;
  const photoSVG = () => `<svg class="mui-photo" viewBox="0 0 240 120" role="img" aria-label="Фото механика: износ передних тормозных колодок"><rect class="bg" x="0" y="0" width="240" height="120" rx="10"/><circle class="disc" cx="92" cy="62" r="46"/><circle class="disc" cx="92" cy="62" r="14"/><rect class="pad" x="140" y="30" width="26" height="64" rx="4"/><path class="wear" d="M146 36 L160 52 M146 54 L160 70 M146 72 L160 88"/><text x="176" y="58">износ</text><text x="176" y="72">90 %</text><text x="8" y="114">фото: механик, 11:58</text></svg>`;

  // =====================================================================
  // Теория 1. Схема, макет, прототип; Figma глазами аналитика; чек-лист ревью
  // =====================================================================
  const FID = [
    { v: 'wf', t: 'Схема (wireframe)', h: 'Серые блоки и подписи: что где лежит и в каком порядке. Рисуется за минуты, правится легко — идеальна, чтобы договориться о составе экрана, пока не потрачены часы на цвета. Аналитик на этом этапе проверяет: все ли данные из требований есть на экране.' },
    { v: 'mk', t: 'Макет (mockup)', h: 'Финальный вид: цвета, шрифты, реальные тексты и отступы — по нему верстают. Здесь проверяют тексты ошибок, длинные значения, контраст и состояния. Ошибка, найденная в макете, стоит минуты Ники; та же ошибка в коде — день Даши.' },
    { v: 'pt', t: 'Прототип', h: 'Макеты, связанные переходами: нажал «Записаться» — открылся экран подтверждения. Его можно «прокликать» на телефоне и показать Марине Олеговне или Елене. Прототип проверяет поток и навигацию — то, что не видно на одном экране.' }
  ];
  const fidMock = v => {
    if (v === 'wf') return phone('Выбор времени · wireframe', `<div class="mui-body"><div class="mui-in ph">[ станция ]</div><div class="mui-in ph">[ услуга · цена «от» ]</div><div class="mui-days">${'<div class="mui-day">▭</div>'.repeat(5)}</div><div class="mui-slots">${'<div class="mui-slot off" style="text-decoration:none">▭▭</div>'.repeat(6)}</div><div class="mui-in ph" style="text-align:center">[ кнопка: Записаться ]</div></div>`);
    const body = `${appbar('Выбор времени')}<div class="mui-body"><span class="mui-chip">Победы, 8 · изменить</span><div class="mui-card"><b>ТО-1: масло и фильтр</b><span class="mui-lbl">1 ч · от 3 900 ₽</span></div><div class="mui-days"><div class="mui-day on">Вт 15</div><div class="mui-day">Ср 16</div><div class="mui-day">Чт 17</div><div class="mui-day">Пт 18</div><div class="mui-day">Сб 19</div></div><div class="mui-slots"><div class="mui-slot">12:00</div><div class="mui-slot">12:30</div><div class="mui-slot off">13:00</div><div class="mui-slot">15:00</div><div class="mui-slot">15:30</div><div class="mui-slot off">19:30</div></div>${v === 'pt' ? '<div class="mui-ban" style="background:var(--info-soft)">⟶ нажатие «Записаться» → фрейм «Подтверждение» · анимация «вправо», 300 мс</div>' : ''}<span class="mui-btn">Записаться на 12:00</span></div>${tabbar('Записи')}`;
    return phone('Выбор времени · ' + (v === 'pt' ? 'прототип' : 'макет'), body);
  };
  const FIG = [
    { id: 'file', t: 'Файл и страницы', h: 'Файл «Искра Онлайн — приложение клиента», внутри страницы: «Обложка», «Запись», «Ремонт», «Компоненты», «Архив». Аналитику важно знать, какая страница актуальная: старые варианты лежат в «Архиве», чтобы по ним никто не верстал.' },
    { id: 'frame', t: 'Фрейм', h: 'Фрейм — один экран (или его состояние) нужного размера, например 390 × 844. У каждого фрейма понятное имя: «Запись / Выбор времени / нет слотов». В требованиях ссылаются именно на фрейм.' },
    { id: 'comp', t: 'Компоненты и варианты', h: 'Компонент — переиспользуемый элемент: «Слот времени», «Кнопка», «Карточка записи». У компонента есть варианты (variants): слот «свободен», «занят», «выбран», «недоступен по правилу». Аналитик проверяет, что для каждого статуса из требований есть вариант.' },
    { id: 'auto', t: 'Auto layout', h: 'Автоматическая раскладка: элементы растягиваются и переносятся сами. Попросите Нику вставить в карточку самое длинное название услуги — auto layout покажет, переносится ли текст или ломает экран.' },
    { id: 'proto', t: 'Прототип', h: 'Режим Prototype: стрелки между фреймами — «по нажатию открыть», «назад», «оверлей». По прототипу проверяют user flow: все ли ветки из потока нарисованы и куда ведёт каждая кнопка.' },
    { id: 'cmt', t: 'Комментарии', h: 'Комментарий привязан к точке на фрейме. Пишите конкретно и с причиной: «Слот 10:30 при текущем 9:40 должен быть недоступен — BR-2, не позже чем за 2 часа». Решённые комментарии закрывают — так видно, что осталось.' },
    { id: 'dev', t: 'Режим разработчика (Dev Mode)', h: 'Dev Mode показывает Даше размеры, отступы, цвета, шрифты, экспорт иконок и статус «Готово к разработке». Аналитик может добавить к фрейму ссылку на требование или историю — разработчик увидит её рядом с макетом.' },
    { id: 'ver', t: 'История версий', h: 'Именованные версии: «v3 — после ревью 17.12». Если макет поменяли после согласования, в истории видно что и когда. Требование лучше связывать с версией или фреймом со статусом, а не с «текущим состоянием файла».' },
    { id: 'link', t: 'Ссылка на фрейм', h: 'У каждого фрейма своя ссылка (Copy link). В требованиях пишут: «Экран: Запись / Выбор времени — ссылка на фрейм; состояния: нет слотов, загрузка, ошибка — ссылки». Ссылка на весь файл бесполезна: в нём сотни фреймов.' }
  ];
  const howFigma = {
    id: 'how-figma', covers: ['t-review'], title: 'Как это работает: схема, макет, прототип и Figma глазами аналитика', free: true, noReset: true,
    simple: {
      icon: '🎨',
      plain: 'Дизайнер рисует экраны в Figma: сначала схему (серые блоки), потом макет (как будет выглядеть), потом связывает макеты в прототип, который можно «прокликать». Аналитик не рисует — он проверяет, что на экранах есть все данные, правила и состояния из требований, и связывает требования со ссылками на фреймы.',
      analogy: 'Ремонт кухни: эскиз на салфетке (где плита, где мойка), дизайн-проект с цветами фасадов и 3D-обход, по которому можно «пройти». Хозяин проверяет не цвет ручек, а дотянется ли он до розетки и откроется ли дверца, если рядом холодильник.',
      tech: 'Уровни детализации: wireframe → mockup → prototype (низкая и высокая точность, low/high fidelity). Figma: файлы и страницы, фреймы, компоненты и варианты, auto layout, прототипирование, комментарии, Dev Mode, история версий. Ревью макета по чек-листу: эвристики Нильсена (видимость состояния системы, предотвращение ошибок, понятные сообщения), ISO/IEC 25010 — удобство использования.'
    },
    lead: ui.brief({
      situation: 'Четверг, 12:00. Ника присылает ссылку: «Готовы макеты записи, гляньте до обеда». Вера: «Прежде чем смотреть — разберёмся, что именно мы смотрим и где в Figma то, что нужно аналитику».',
      todo: [
        'Переключите схему, макет и прототип — один и тот же экран «Выбор времени». Прочитайте, что проверять на каждом уровне.',
        'Нажимайте на части окна Figma: страницы, фреймы, компонент, прототип, комментарий, Dev Mode, версии, ссылку.',
        'Прочитайте чек-лист ревью — он понадобится в первом задании.'
      ],
      look: 'Аналитик смотрит макет не как «красиво или нет», а как требования в картинках: есть ли все данные, правила BR-*, состояния, тексты ошибок и переходы.'
    }),
    render(el) {
      el.classList.add('mui-root');
      const st = { f: 'mk', g: 'frame' };
      el.innerHTML = `<div class="stack">
        <div class="row"><span class="small dim">Уровень:</span>${ui.seg('fid', FID.map(f => ({ v: f.v, t: f.t })), st.f, 'accent')}</div>
        <div class="mui-two"><div data-fm></div><div data-fh></div></div>
        <div class="stack tight"><span class="eyebrow">Окно Figma · нажимайте на части</span><div style="overflow-x:auto;max-width:100%"><div class="mui-fig" data-fig></div></div><div data-fgi></div></div>
        ${ui.note('', 'Чек-лист ревью макета', `<ul class="checks">
          <li><b>Данные:</b> всё из требований на экране — цена «от» (BR-5), длительность, станция; ничего лишнего.</li>
          <li><b>Правила:</b> BR-* видны в интерфейсе — недоступные слоты (BR-2), окно отмены (BR-3), предоплата (BR-4).</li>
          <li><b>Состояния:</b> пусто, загрузка, ошибка, нет сети, успех, длинный текст — отдельные фреймы или варианты.</li>
          <li><b>Ошибки:</b> тексты понятные, говорят, что случилось и что делать; не «Ошибка 422».</li>
          <li><b>Реальные данные:</b> длинные названия услуг, номер с регионом 116 / 716, 12 записей у таксопарка.</li>
          <li><b>Доступность:</b> статус не только цветом, контраст, размер касания не меньше 44 × 44 pt — механики и клиенты в перчатках.</li>
          <li><b>Навигация:</b> откуда пришли, куда «назад», что откроет push.</li>
          <li><b>Связь:</b> у каждого фрейма — ссылка в требованиях, у требования — ссылка на фрейм.</li></ul>`)}
        ${interview('Как вы работаете с дизайнером и макетами?', 'Сильный ответ: «Даю дизайнеру требования и правила до макетов, ревьюю макеты по чек-листу — данные, правила, состояния, ошибки, навигация; пишу комментарии с причиной и ссылкой на требование; в спецификации ссылаюсь на фреймы; проверяю, что для каждого статуса есть вариант компонента». Хорошо упомянуть Dev Mode и версии.')}
      </div>`;
      const drawF = () => { TR.$('[data-fm]', el).innerHTML = fidMock(st.f); TR.$('[data-fh]', el).innerHTML = `<div class="card flat small">${FID.find(f => f.v === st.f).h}</div>`; };
      function drawG() {
        const b = (id, html) => `<button type="button" class="mui-fb" data-fg="${id}" aria-pressed="${st.g === id}">${html}</button>`;
        TR.$('[data-fig]', el).innerHTML = `<div class="top">${b('file', '<b>Искра Онлайн — приложение клиента</b>')}<span class="small dim">/</span>${b('ver', '🕘 v3 — после ревью 17.12')}<span style="margin-left:auto"></span>${b('link', '🔗 Copy link')}</div>
          <div class="pn"><span class="mui-lbl">СТРАНИЦЫ</span>${b('file', 'Обложка')}${b('file', '▸ Запись')}${b('file', 'Ремонт')}${b('comp', '◇ Компоненты')}${b('file', 'Архив')}<span class="mui-lbl" style="margin-top:6px">СЛОИ</span>${b('frame', '# Выбор времени')}${b('auto', '⇅ Список слотов (auto layout)')}</div>
          <div class="cv">${b('frame', `<span class="mui-mini"><span class="mui-lbl"># Выбор времени</span><i></i><i></i><span class="bt"></span></span>`)}${b('proto', '<span style="font:700 18px var(--f-mono);color:var(--info)">⟶</span><br><span class="mui-lbl">прототип</span>')}${b('frame', `<span class="mui-mini"><span class="mui-lbl"># Подтверждение</span><i></i><i></i><i></i><span class="bt"></span></span>`)}${b('comp', `<span class="mui-mini comp"><span class="mui-lbl">◇ Слот</span><span class="mui-lbl">свободен · занят · выбран · недоступен</span></span>`)}${b('cmt', '<span class="mui-pin" style="position:static">Н</span>')}</div>
          <div class="pn">${b('dev', '&lt;/&gt; Dev Mode')}${b('proto', '▶ Prototype')}<span class="mui-lbl" style="margin-top:6px">ОСМОТР</span><span class="small dim">W 390 · H 844<br>Отступ 16 · Inter 14</span>${b('dev', '🔗 Требование: US-12 «Записаться на ТО»')}</div>`;
        const g = FIG.find(x => x.id === st.g);
        TR.$('[data-fgi]', el).innerHTML = `<div class="card flat small"><b>${esc(g.t)}.</b> ${g.h}</div>`;
      }
      ui.onSeg(el, (n, v) => { if (n === 'fid') { st.f = v; drawF(); } });
      TR.on(el, 'click', '[data-fg]', (e, b) => { st.g = b.dataset.fg; drawG(); });
      drawF(); drawG();
      el.insertAdjacentHTML('beforeend', anNote('Макет — не замена требованиям, а их иллюстрация. Правило «не позже чем за 2 часа» живёт в требованиях и в коде; в макете оно видно как недоступный слот. Если правило есть только в голове у Ники или только в комментарии Figma — оно потеряется при первой же правке.'));
    }
  };

  // =====================================================================
  // Теория 2. Спецификация экрана: поле, тип, обязательность, маска, валидация, ошибка, источник, права
  // =====================================================================
  const CAR_F = [
    { id: 'brand', t: 'Марка', ph: 'Kia', spec: { type: 'Выбор из справочника с поиском', req: 'Обязательное', fmt: '—', val: 'Значение из справочника марок', err: '«Выберите марку из списка»', def: 'Пусто', src: 'car.brand (справочник марок)', rights: 'Клиент — изменяет; мастер — видит и может исправить' } },
    { id: 'model', t: 'Модель', ph: 'Rio', spec: { type: 'Выбор из справочника, зависит от марки; «Другая» — свободный текст', req: 'Обязательное', fmt: 'до 40 символов', val: 'Список фильтруется по марке; без марки поле недоступно', err: '«Сначала выберите марку»', def: 'Пусто', src: 'car.model', rights: 'Как у марки' } },
    { id: 'year', t: 'Год выпуска', ph: '2019', spec: { type: 'Число', req: 'Обязательное', fmt: '4 цифры, цифровая клавиатура', val: 'От 1980 до текущего года включительно', err: '«Год выпуска — от 1980 до текущего года»', def: 'Пусто', src: 'car.year', rights: 'Клиент, мастер' } },
    { id: 'vin', t: 'VIN', ph: 'Z94C251BBKR123456', spec: { type: 'Текст с маской', req: 'Необязательное (нужно для заказа запчастей — подсказка «где найти VIN»)', fmt: '17 символов, латиница в верхнем регистре и цифры', val: 'Ровно 17 символов, без букв I, O, Q', err: '«VIN — 17 символов: латинские буквы и цифры, без I, O и Q. Сейчас: 16»', def: 'Пусто', src: 'car.vin', rights: 'Персональные данные (BR-15): видят владелец и мастер станции; в списках — замаскирован' } },
    { id: 'km', t: 'Пробег, км', ph: '61 000', spec: { type: 'Число', req: 'Необязательное', fmt: 'Разделитель тысяч, «км» после поля', val: '0 … 999 999; не меньше последнего пробега при приёмке', err: '«Пробег меньше, чем при прошлом визите (58 200 км). Проверьте»', def: 'Последний пробег из заказ-наряда (work_order.mileage_in)', src: 'car.mileage', rights: 'Клиент; мастер обновляет при приёмке' } }
  ];
  const SPEC_K = [['type', 'Тип'], ['req', 'Обязательность'], ['fmt', 'Формат и маска'], ['val', 'Валидация'], ['err', 'Текст ошибки'], ['def', 'По умолчанию'], ['src', 'Источник / API-поле'], ['rights', 'Права']];
  const ERRS = [
    { v: 'code', t: '«Ошибка 422»', k: 'bad', h: 'Код для разработчика, не для человека. Клиентка не знает, что такое 422, и не понимает, что исправить.' },
    { v: 'vague', t: '«Неверный ввод»', k: 'bad', h: 'Что неверно? Где? Что сделать? Человек будет перебирать варианты наугад — или закроет экран.' },
    { v: 'blame', t: '«Вы ввели неправильный VIN!»', k: 'bad', h: 'Обвиняет и не помогает. Восклицательный знак и «вы ввели неправильно» раздражают, а правила ввода так и не названы.' },
    { v: 'good', t: '«VIN — 17 символов: латинские буквы и цифры, без I, O и Q. Сейчас: 16»', k: 'ok', h: 'Говорит, что не так, какое правило и что сделать. Счётчик показывает, сколько осталось. Ошибку показывают у поля и после ухода с поля, а не на каждую букву.' }
  ];
  const howSpec = {
    id: 'how-spec', covers: ['t-fields'], title: 'Как это работает: спецификация экрана и полей', free: true, noReset: true,
    simple: {
      icon: '📋',
      plain: 'Макет показывает, как экран выглядит, но не говорит, что можно вводить, что обязательно, что будет при ошибке и откуда берутся данные. Это фиксирует аналитик в спецификации экрана: по строке на каждое поле — тип, обязательность, формат, проверки, текст ошибки, значение по умолчанию, источник данных и кто может менять.',
      analogy: 'Бланк в банке: на нём видны клеточки. Но операционист знает больше: паспорт — 10 цифр, дата рождения не позже сегодняшней, ИНН — необязателен, а если клеточку заполнили неправильно — скажет, как надо. Спецификация экрана — это «что знает операционист», записанное для разработчика и тестировщика.',
      tech: 'Спецификация пользовательского интерфейса (Вигерс, «Разработка требований», гл. 15 «Проектирование интерфейса»; ГОСТ 34.602 — требования к интерфейсу в ТЗ). Колонки: поле, тип элемента, обязательность (в т. ч. условная), формат и маска, правила валидации, текст ошибки, значение по умолчанию, источник (API-поле, таблица.поле), права доступа. Тексты ошибок — эвристика Нильсена № 9: помогать распознать, понять и исправить ошибку.'
    },
    lead: ui.brief({
      situation: 'Даша смотрит макет «Добавить автомобиль»: «А год можно 1950? VIN обязателен? Что писать, если VIN короткий? И это поле в API как называется?» Вера: «Это всё вопросы к спецификации, а не к Нике. Давайте посмотрим, как она выглядит».',
      todo: [
        'Нажмите на поля макета «Добавить автомобиль» — справа откроется строка спецификации.',
        'Переключите четыре текста ошибки для VIN и сравните, какой помогает человеку.',
        'Прочитайте, какие колонки обязательны и почему.'
      ],
      look: 'Каждая колонка отвечает на вопрос, который иначе зададут Даша, Глеб или Лиза — или, хуже, решат сами. Источник данных связывает экран с API и базой: car.vin, car.year.'
    }),
    render(el) {
      el.classList.add('mui-root');
      const st = { f: 'vin', e: 'vague' };
      el.innerHTML = `<div class="stack">
        <div class="mui-two"><div data-ph></div><div data-sp></div></div>
        <div class="stack tight"><span class="eyebrow">Текст ошибки для VIN</span>${ui.seg('err', ERRS.map(x => ({ v: x.v, t: x.t })), st.e)}<div data-er></div></div>
        ${ui.table(['Колонка', 'На какой вопрос отвечает', 'Кто спросит, если не написать'], [
          ['Тип', 'Что за элемент: текст, число, выбор, дата, флажок', 'Ника, Даша'],
          ['Обязательность', 'Можно ли пропустить; бывает «обязательно, если…»', 'Даша, Лиза'],
          ['Формат и маска', 'Как выглядит ввод: +7 (___) ___-__-__, 17 символов', 'Даша'],
          ['Валидация', 'Какие значения допустимы и где проверять (на телефоне и на сервере)', 'Глеб, Лиза'],
          ['Текст ошибки', 'Что сказать человеку, чтобы он исправил', 'Ника, Лиза'],
          ['По умолчанию', 'Что в поле, когда экран открылся', 'Даша'],
          ['Источник / API-поле', 'Откуда данные и куда сохраняются: car.vin, GET /cars', 'Глеб'],
          ['Права', 'Кто видит и кто меняет; персональные данные (BR-15)', 'Глеб, Ольга Викторовна']
        ])}
        ${ui.note('warn', 'Типичные ошибки', '<ul class="checks"><li class="bad">«Обязательное» у всех полей подряд — анкета на 12 полей, и клиент бросает запись.</li><li class="bad">Проверка только в интерфейсе: правило живёт и на сервере, иначе его обойдут через API.</li><li class="bad">Нет источника: Даша называет поле carVin, Глеб — vin_code, и интеграция ломается.</li><li class="bad">Тексты ошибок пишет разработчик в последний вечер.</li></ul>')}
        ${interview('Что вы описываете в требованиях к экрану?', 'Назовите колонки спецификации полей и приведите пример с правилом и текстом ошибки. Добавьте состояния экрана и навигацию, ссылку на фрейм в Figma и связь полей с API. Сильный ответ: «Валидация дублируется на сервере, тексты ошибок согласованы с дизайнером».')}
      </div>`;
      function drawPh() {
        const body = `${appbar('Добавить автомобиль')}<div class="mui-body">${CAR_F.map(f => `<button type="button" class="mui-hs" data-cf="${f.id}" aria-pressed="${st.f === f.id}"><span class="mui-f"><span class="mui-lbl">${esc(f.t)}${f.spec.req.startsWith('Обяз') ? ' *' : ''}</span><span class="mui-in ${f.id === 'vin' ? 'err' : ''}">${esc(f.id === 'vin' ? 'Z94C251BBKR12345' : f.ph)}</span>${f.id === 'vin' ? `<span class="mui-et">${esc(ERRS.find(x => x.v === st.e).t.replace(/[«»]/g, ''))}</span>` : ''}</span></button>`).join('')}<span class="mui-btn">Сохранить</span></div>${tabbar('Гараж')}`;
        TR.$('[data-ph]', el).innerHTML = phone('Гараж / Добавить автомобиль', body);
        const f = CAR_F.find(x => x.id === st.f);
        TR.$('[data-sp]', el).innerHTML = `<div class="stack tight"><span class="eyebrow">Спецификация · поле «${esc(f.t)}»</span><div class="mui-spec">${SPEC_K.map(([k, t]) => `<b>${t}</b><span>${esc(f.spec[k])}</span>`).join('')}</div><div class="small dim">Ссылка на фрейм: Figma → «Гараж / Добавить автомобиль / default»; ошибка VIN — вариант «error».</div></div>`;
      }
      const drawE = () => { const x = ERRS.find(e => e.v === st.e); TR.$('[data-er]', el).innerHTML = ui.note(x.k, x.k === 'ok' ? 'Помогает' : 'Не помогает', x.h); };
      ui.onSeg(el, (n, v) => { if (n === 'err') { st.e = v; drawE(); drawPh(); } });
      TR.on(el, 'click', '[data-cf]', (e, b) => { st.f = b.dataset.cf; drawPh(); });
      drawPh(); drawE();
      el.insertAdjacentHTML('beforeend', anNote('Спецификацию полей удобно вести таблицей в требованиях рядом со ссылкой на фрейм. Лиза пишет по ней проверки граничных значений (VIN из 16, 17 и 18 символов; год 1979, 1980 и текущий), Глеб — правила на сервере, Даша — маски и клавиатуры.'));
    }
  };

  // =====================================================================
  // Теория 3. Состояния экрана и навигация
  // =====================================================================
  const STATES_T = [
    { v: 'empty', t: 'Пусто', m: () => `<div class="mui-empty"><span class="ic">🔧</span><b>Сейчас машина не в ремонте</b><span>Здесь появится статус, когда вы сдадите машину на станции</span><span class="mui-btn sm">Записаться на ТО</span></div>`, h: 'Пустое состояние объясняет, почему пусто, и даёт следующий шаг. Белый экран выглядит как сбой.' },
    { v: 'load', t: 'Загрузка', m: () => `<div class="mui-sk"></div><div class="mui-sk" style="height:30px"></div><div class="mui-sk" style="height:80px"></div>`, h: 'Скелетон — серые плашки на месте будущего содержимого: человек видит, что идёт загрузка и что примерно появится. Нужно описать, что будет, если грузится слишком долго (например, больше 10 секунд).' },
    { v: 'err', t: 'Ошибка', m: () => `<div class="mui-empty"><span class="ic">⚠️</span><b>Не удалось загрузить статус</b><span>Мы уже знаем о проблеме. Попробуйте через минуту</span><span class="mui-btn sm">Повторить</span><span class="mui-lbl">код: WO-503</span></div>`, h: 'Человеческий текст, действие «Повторить», мелкий код для поддержки. Никаких текстов исключений и «Что-то пошло не так» без выхода.' },
    { v: 'off', t: 'Нет сети', m: () => `<div class="mui-ban">Нет соединения · показано на 11:42</div><div class="mui-card"><b>Kia Rio · А123ВС 116</b><span>В работе · механик Ильдар</span><span class="mui-lbl">Готовность ≈ 15:30</span></div>`, h: 'Показываем последнее известное с пометкой времени и честно говорим, что связи нет. Действия, которые требуют сервера, недоступны или ставятся в очередь — это нужно решить и записать.' },
    { v: 'ok', t: 'Успех', m: () => `<div class="mui-card"><b>Kia Rio · А123ВС 116</b><span>● Ждёт согласования</span><span class="mui-lbl">Заказ-наряд ПБ-0412 · Победы</span></div><div class="mui-ban" style="background:var(--info-soft)">Найдена проблема: износ колодок. Посмотреть и решить →</div><div class="mui-card"><span class="mui-lbl">Принят 08:12 → В работе 08:40 → Ждёт согласования 11:58</span></div>`, h: 'Основное состояние: статус заказ-наряда (open, in_progress, waiting_approval, ready, closed) словами клиента, следующий шаг, история смены статусов.' },
    { v: 'long', t: 'Длинный текст', m: () => `<div class="mui-card"><b>Hyundai Solaris · Т777ТТ 716</b><span>В работе: «Комплексная диагностика ходовой части и рулевого управления с выездом на…»</span><span class="mui-lbl">ещё 4 работы · показать все</span></div>`, h: 'Реальные данные длиннее, чем в макете: название услуги на две строки, регион из трёх цифр, пять работ в заказ-наряде. Решить: перенос, обрезка с «…», «показать все».' }
  ];
  const howStates = {
    id: 'how-states', covers: ['t-states'], title: 'Как это работает: состояния экрана и навигация', free: true, noReset: true,
    simple: {
      icon: '🚦',
      plain: 'Экран — это не одна картинка. Он бывает пустым, загружается, ломается, остаётся без интернета, показывает данные — и данные бывают слишком длинными. Для каждого состояния нужно решить, что человек увидит и что сможет сделать. Иначе решать будет разработчик — в последний вечер и по-своему.',
      analogy: 'Табло в аэропорту. «Регистрация», «Посадка», «Задерживается до 15:40», «Отменён — подойдите к стойке 12». У каждого состояния свой текст и своё действие. Представьте табло, которое при задержке просто гаснет.',
      tech: 'Состояния экрана: empty, loading, error, offline, success (ideal), partial, long content; паттерн «скелетон», оптимистичный интерфейс, кэш с меткой времени. Эвристики Нильсена № 1 «Видимость состояния системы» и № 9 «Помощь в распознавании и исправлении ошибок». Навигация: точка входа (в т. ч. deep link из push), «назад», что сохраняется при уходе.'
    },
    lead: ui.brief({
      situation: 'Даша: «У Ники на экране „Статус ремонта“ только красивый вариант. А что я покажу, пока грузится? Или в метро?» Вера: «Шесть состояний — шесть вопросов. Посмотрим на каждое».',
      todo: [
        'Переключите шесть состояний экрана «Статус ремонта» и прочитайте, что в каждом надо решить.',
        'Посмотрите блок про навигацию: откуда человек попадает на экран и куда уходит.',
        'Обратите внимание на «Нет сети»: что показывать и что делать с кнопками.'
      ],
      look: 'Правило: у каждого состояния есть понятный текст и следующий шаг. «Пусто» не должно выглядеть как «сломалось», а «ошибка» — как «пусто».'
    }),
    render(el) {
      el.classList.add('mui-root');
      const st = { s: 'ok' };
      el.innerHTML = `<div class="stack">
        <div class="row"><span class="small dim">Состояние:</span>${ui.seg('stt', STATES_T.map(s => ({ v: s.v, t: s.t })), st.s, 'accent')}</div>
        <div class="mui-two"><div data-ph></div><div class="stack tight" data-sh></div></div>
        <div class="card flat small"><b>Навигация экрана «Статус ремонта».</b> Входы: вкладка «Записи» → карточка визита; push «Машина готова» или «Нужно ваше решение» — сразу на этот экран (deep link), даже если приложение было закрыто. Выходы: «Посмотреть и решить» → «Согласование доп. работ»; «Назад» → «Мои записи». Если человек не вошёл в аккаунт, push сначала ведёт на вход, а после — сюда же.</div>
        ${ui.note('warn', 'Типичные ошибки', '<ul class="checks"><li class="bad">Ошибка показана пустым списком: человек думает, что данных нет, и делает действие повторно.</li><li class="bad">Бесконечный спиннер — ни ошибки, ни выхода.</li><li class="bad">В офлайне кнопки активны, нажатие «пропадает» молча.</li><li class="bad">Макет на «Иван Иванов, Kia Rio» — первый реальный заказ-наряд ломает вёрстку.</li></ul>')}
        ${interview('Какие состояния экрана вы описываете?', 'Пусто, загрузка, ошибка (с разными причинами), нет сети, успех, длинные и пограничные данные. Для каждого — что видит человек и что может сделать. Сильный ответ добавляет навигацию (вход из push, «назад») и что делать с действиями без сети.')}
      </div>`;
      function draw() {
        const s = STATES_T.find(x => x.v === st.s);
        TR.$('[data-ph]', el).innerHTML = phone('Ремонт / Статус · ' + s.t.toLowerCase(), `${appbar('Статус ремонта')}<div class="mui-body">${s.m()}</div>${tabbar('Записи')}`, { net: s.v === 'off' ? 'нет сети ✕' : '4G ▮▮▮', time: '12:05' });
        TR.$('[data-sh]', el).innerHTML = `<span class="eyebrow">Что решить для состояния «${esc(s.t)}»</span><div class="card flat small">${s.h}</div>`;
      }
      ui.onSeg(el, (n, v) => { if (n === 'stt') { st.s = v; draw(); } });
      draw();
      el.insertAdjacentHTML('beforeend', anNote('Матрица состояний — таблица «экран × состояние» в требованиях: что показываем, какие действия доступны, какой текст. Её читают Ника (нарисовать все варианты), Даша (сверстать), Лиза (проверить: выключить сеть, замедлить ответ, вернуть 500).'));
    }
  };

  // =====================================================================
  // Практика 1. Ревью макета «Выбор времени»: кликнуть по проблемам
  // =====================================================================
  const HS = [
    { id: 'h-head', prob: false, t: 'Заголовок и кнопка «назад»', why: 'Всё на месте: понятно, где человек и как вернуться.' },
    { id: 'h-station', prob: false, t: 'Станция «Победы, 8 · изменить»', why: 'Станция видна и меняется в одно нажатие — так и надо.' },
    { id: 'h-price', prob: true, t: 'Услуга без цены', why: 'Нет цены «от» по каталогу (BR-5). Елена ждёт цену заранее (F-el-photo), а «итог дороже, чем ожидала» — боль из CJM. Нужно: «от 3 900 ₽ · итог после диагностики».' },
    { id: 'h-days', prob: true, t: 'Календарь «до 15 февраля»', why: 'Запись — не дальше 30 дней вперёд (BR-2). Сегодня 15 декабря — последний день 14 января, а не 15 февраля. Комментарий Ники «пусть планируют заранее» противоречит правилу.' },
    { id: 'h-1030', prob: true, t: 'Слот 10:30 доступен при текущем 9:40', why: 'Онлайн-запись — не позже чем за 2 часа до начала (BR-2). При 9:40 первый доступный слот — 12:00. Иначе Марина Олеговна не успеет подготовить пост и запчасти.' },
    { id: 'h-1200', prob: false, t: 'Слот 12:00', why: 'Свободен и проходит по BR-2: ровно 2 ч 20 мин до начала. Всё верно.' },
    { id: 'h-busy', prob: true, t: 'Занятые 12:30 и 13:00 — чуть бледнее свободных', why: 'Занятые слоты отличаются только оттенком цвета: при солнце на экране, в тёмной теме или при нарушении цветовосприятия их не отличить. Нужен второй признак — зачёркивание, «занято», недоступность для нажатия (вариант компонента «занят»).' },
    { id: 'h-2030', prob: true, t: 'Слот 20:30 для ТО длительностью 1 час', why: 'Длительность — сумма нормо-часов, вверх до 30 минут (BR-1): ТО-1 занимает 2 слота. Начало в 20:30 — конец в 21:30, а станция работает до 21:00. Слот надо скрыть или сделать недоступным.' },
    { id: 'h-btn', prob: false, t: 'Кнопка «Записаться на 12:00»', why: 'Кнопка крупная и повторяет выбор — человек видит, на что соглашается. Хорошо.' },
    { id: 'h-tab', prob: false, t: 'Нижняя навигация', why: 'Стандартные вкладки, активная — «Записи». Претензий нет.' },
    { id: 'h-layers', prob: true, t: 'Слои: у «Выбора времени» один фрейм', why: 'Нарисовано только «всё хорошо». Нет фреймов или вариантов «нет слотов на день», «загрузка», «ошибка», «нет сети» — их потом придумает Даша. Из user flow мы знаем: «нет слотов» — частый случай в субботу.' }
  ];
  const PROBS = HS.filter(h => h.prob);
  function rvEval(ans) {
    const m = ((ans && ans.m) || []).filter(id => HS.some(h => h.id === id));
    const found = PROBS.filter(h => m.includes(h.id)), fp = HS.filter(h => !h.prob && m.includes(h.id));
    return { m, found, fp, score: Math.max(0, found.length / PROBS.length - 0.15 * fp.length) };
  }
  function reviewMock(ans, show, ro) {
    const m = ans.m || [];
    const hs = (id, html) => {
      const h = HS.find(x => x.id === id), on = m.includes(id);
      const cls = ro ? (h.prob ? 'ok' : '') : show && on ? (h.prob ? 'ok' : 'bad') : '';
      return `<button type="button" class="mui-hs ${cls}" data-hs="${id}" aria-pressed="${on}" aria-label="${esc(h.t)}" ${ro ? 'disabled' : ''}>${html}</button>`;
    };
    const body = `${hs('h-head', appbar('Выбор времени'))}<div class="mui-body">
      ${hs('h-station', '<span class="mui-chip">Станция: Победы, 8 · изменить</span>')}
      ${hs('h-price', '<span class="mui-card"><b>ТО-1: масло и фильтр</b><span class="mui-lbl">Длительность 1 ч</span></span>')}
      ${hs('h-days', '<span class="mui-days"><span class="mui-day on">Вт 15</span><span class="mui-day">Ср 16</span><span class="mui-day">Чт 17</span><span class="mui-day">Пт 18</span><span class="mui-day">›</span></span><span class="mui-lbl">Запись доступна до 15 февраля</span>')}
      <span class="mui-lbl">Сегодня · сейчас 9:40</span>
      <div class="mui-slots">${hs('h-1030', '<span class="mui-slot" style="display:block">10:30</span>')}${hs('h-1200', '<span class="mui-slot" style="display:block">12:00</span>')}<span style="grid-column:span 2;display:block">${hs('h-busy', '<span class="mui-slots" style="grid-template-columns:repeat(2,minmax(0,1fr))"><span class="mui-slot busy">12:30</span><span class="mui-slot busy">13:00</span></span>')}</span><span class="mui-slot">15:00</span>${hs('h-2030', '<span class="mui-slot" style="display:block">20:30</span>')}</div>
      ${hs('h-btn', '<span class="mui-btn">Записаться на 12:00</span>')}</div>${hs('h-tab', tabbar('Записи'))}`;
    const pins = `<span class="mui-pin" style="top:150px;right:-10px" aria-hidden="true">Н</span>`;
    const side = `<div class="mui-side"><span class="h">Слои · страница «Запись»</span>${hs('h-layers', '<span class="mui-layer"># Главная</span><span class="mui-layer"># Станция и услуги</span><span class="mui-layer on"># Выбор времени</span><span class="mui-layer"># Подтверждение</span><span class="mui-layer"># Запись подтверждена</span>')}<span class="h" style="margin-top:6px">Комментарий</span><div class="mui-cmt"><b>Ника:</b> календарь без ограничений — пусть клиенты планируют заранее! Занятые слоты сделала посветлее, чтобы не отвлекали.</div></div>`;
    return `<div class="mui-canvas"><div class="mui-row">${phone('Запись / Выбор времени', body, { pins })}${side}</div></div>`;
  }
  const taskReview = {
    id: 't-review', title: 'Ревью макета Ники: экран «Выбор времени»',
    simple: howFigma.simple,
    lead: ui.brief({
      situation: 'Ника: «Экран выбора времени готов, завтра отдаю Даше. Посмотрите свежим глазом?» Вера: «Сравните с правилами BR-1, BR-2, BR-5 и с тем, что мы узнали про Елену. И не забудьте про состояния».',
      todo: [
        'Нажимайте на элементы макета и панели слоёв, где видите проблему. Повторное нажатие снимает пометку.',
        'Проблем шесть. Есть и элементы, которые сделаны хорошо, — их отмечать не надо.',
        'Нажмите «Проверить». Засчитывается от 80 % и не больше одной ложной пометки (каждая ложная — минус 15 %).'
      ],
      look: 'Сейчас 9:40, 15 декабря. Станция работает 08:00–21:00. ТО-1 длится 1 час. Правила: сетка 30 минут (BR-1), не ближе 2 часов и не дальше 30 дней (BR-2), цена «от» (BR-5).'
    }),
    blank: () => ({ m: [] }),
    reference: () => ({ m: PROBS.map(h => h.id) }),
    render(el, ctx) {
      el.classList.add('mui-root');
      const a = ctx.ans, ro = ctx.readonly; a.m = a.m || [];
      const show = !!(ctx.result || ro);
      el.innerHTML = `<div class="stack"><div data-mk></div><div class="stack tight"><span class="eyebrow">Ваши пометки</span><div class="mui-list" data-ls></div></div></div>`;
      function draw() {
        TR.$('[data-mk]', el).innerHTML = reviewMock(ro ? taskReview.reference() : a, show, ro);
        const list = ro ? PROBS : HS.filter(h => a.m.includes(h.id));
        TR.$('[data-ls]', el).innerHTML = list.length ? list.map(h => `<div class="mui-li ${show ? (h.prob ? 'ok' : 'bad') : ''}"><b>${esc(h.t)}</b>${show ? ` — ${h.why}` : ''}</div>`).join('') : '<div class="small dim">Пока ничего не отмечено.</div>';
      }
      draw();
      if (ro) return;
      TR.on(el, 'click', '[data-hs]', (e, b) => {
        const id = b.dataset.hs;
        a.m = a.m.includes(id) ? a.m.filter(x => x !== id) : a.m.concat(id);
        ctx.save(); draw();
      });
    },
    check(ans) {
      const ev = rvEval(ans), notes = [];
      PROBS.forEach(h => notes.push(ev.found.includes(h) ? { ok: true, html: `<b>${esc(h.t)}</b> — ${h.why}` } : { ok: false, html: `Не найдено: <b>${esc(h.t)}</b>. ${h.why}` }));
      ev.fp.forEach(h => notes.push({ ok: false, html: `Лишняя пометка: <b>${esc(h.t)}</b> — ${h.why}` }));
      return {
        ok: ev.score >= 0.8 && ev.fp.length <= 1, score: ev.score, notes,
        summary: `Найдено проблем: ${ev.found.length} из ${PROBS.length}; лишних пометок: ${ev.fp.length}.`,
        mentor: ev.found.length < 5 ? 'Пройдитесь по чек-листу: данные (цена?), правила (2 часа, 30 дней, длительность до закрытия), доступность (только цвет?), состояния (а если слотов нет?).' : (ev.fp.length > 1 ? 'Ревью — не «всё переделать». Хорошие решения тоже стоит назвать: станция видна, кнопка повторяет выбор. Ника будет больше доверять вашим замечаниям.' : null)
      };
    },
    explain: `<p>Шесть проблем — шесть разных пунктов чек-листа: <b>данные</b> (нет цены «от», BR-5), <b>правила</b> (BR-2: 2 часа и 30 дней; BR-1: длительность до закрытия станции), <b>доступность</b> (статус только цветом), <b>состояния</b> (один фрейм на всё).</p>
      <ul class="checks">
        <li>Правила видны в интерфейсе, но живут в требованиях и на сервере. Даже если Ника нарисует 10:30 серым, сервер обязан отклонить такую запись.</li>
        <li>Слот 20:30 — пример правила, которое видно только при сложении: длительность услуги + время закрытия. Такие ошибки находит аналитик, а не дизайнер.</li>
        <li>Комментарий Ники — не ошибка дизайнера, а пропуск в требованиях: правило BR-2 до неё не дошло. Значит, ссылку на правила надо дать до макетов.</li>
      </ul>
      <p>Источники: Якоб Нильсен, «10 эвристик удобства использования» (№ 1 видимость состояния, № 5 предотвращение ошибок); WCAG 2.1, критерий 1.4.1 «Использование цвета»; ISO/IEC 25010 — удобство использования.</p>`,
    refNote: 'Засчитывается от 5 из 6 проблем без лишних пометок или все 6 с одной лишней.',
    report: ans => { const ev = rvEval(ans || {}); return HS.filter(h => ev.m.includes(h.id)).map(h => `- ${h.t} ${h.prob ? '✓' : '✗ (лишняя)'}`).join('\n') + `\n- Найдено ${ev.found.length} из ${PROBS.length}`; }
  };

  // =====================================================================
  // Практика 2. Спецификация полей экрана «Запись»
  // =====================================================================
  const TYPES = [{ v: 'text', t: 'Текст в одну строку' }, { v: 'mask', t: 'Текст с маской' }, { v: 'multi', t: 'Множественный выбор из каталога' }, { v: 'slot', t: 'Выбор слота из сетки' }, { v: 'area', t: 'Многострочный текст' }, { v: 'check', t: 'Флажок' }];
  const REQS = [{ v: 'req', t: 'Обязательное' }, { v: 'opt', t: 'Необязательное' }, { v: 'cond', t: 'Обязательное при условии' }];
  const SRCS = [{ v: 'car.plate', t: 'car.plate' }, { v: 'car.vin', t: 'car.vin' }, { v: 'client.phone', t: 'client.phone' }, { v: 'client.full_name', t: 'client.full_name' }, { v: 'booking_service', t: 'booking_service.service_id → service' }, { v: 'booking.start', t: 'booking.start_at + booking.end_at' }, { v: 'booking.comment', t: 'booking.comment' }, { v: 'booking.status', t: 'booking.status' }, { v: 'new', t: 'Нет в модели: новое поле client.pd_consent_at — вопрос Глебу' }];
  const FIELDS = [
    { id: 'f-plate', t: 'Госномер', ph: 'А123ВС 116', type: 'mask', req: 'req', src: 'car.plate', vals: [
      { v: 'a', ok: true, t: 'Буквы А, В, Е, К, М, Н, О, Р, С, Т, У, Х + 3 цифры + 2 буквы + регион из 2–3 цифр; ошибка «Проверьте госномер, например: А123ВС 116»' },
      { v: 'b', t: 'Любые символы до 12; ошибка «Неверный ввод»', why: 'Пропустит «аааа» и латинскую A вместо кириллической — дубли машин и поиск в АРМ мастера сломаются. И «Неверный ввод» не говорит, что исправить.' },
      { v: 'c', t: 'Только цифры; ошибка «Ошибка 422»', why: 'В госномере есть буквы — поле не примет ни один номер. А «422» — код для разработчика.' }] },
    { id: 'f-phone', t: 'Телефон', ph: '+7 (917) 123-45-67', type: 'mask', req: 'req', src: 'client.phone', vals: [
      { v: 'a', ok: true, t: 'Российский мобильный: +7 и 10 цифр, ввод «8…» превращается в «+7…»; ошибка «Введите номер мобильного: +7 и 10 цифр»' },
      { v: 'b', t: 'Любой формат — храним как ввели', why: 'Ровно так появились дубли в базе: один человек и с «+7», и с «8» (F-excel). Нормализация — при вводе.' },
      { v: 'c', t: '10 цифр; ошибка «Поле заполнено неверно»', alt: true, why: 'Правило близко, но «8» и «+7» не нормализуются, а текст ошибки не помогает.' }] },
    { id: 'f-svc', t: 'Услуги', ph: '☑ ТО-1 · ☐ Шиномонтаж', type: 'multi', req: 'req', src: 'booking_service', vals: [
      { v: 'a', ok: true, t: 'Хотя бы одна услуга; длительность = сумма нормо-часов вверх до 30 минут (BR-1); ошибка «Выберите хотя бы одну услугу»' },
      { v: 'b', t: 'Ровно одна услуга', why: 'Запись — многие ко многим с услугами (booking_service). ТО и шиномонтаж в один визит — обычное дело, особенно в сезон.' },
      { v: 'c', t: 'Без проверок — сколько угодно, в том числе ни одной', why: 'Запись без услуг: непонятно, сколько слотов занять и какие запчасти резервировать (BR-12).' }] },
    { id: 'f-slot', t: 'Дата и время', ph: 'Вт 15 декабря, 12:00', type: 'slot', req: 'req', src: 'booking.start', vals: [
      { v: 'a', ok: true, t: 'Свободный слот не раньше чем через 2 часа и не дальше 30 дней (BR-2), вся длительность — до 21:00; если заняли — «Это время только что заняли, выберите другое»' },
      { v: 'b', t: 'Любое время с 08:00 до 21:00', why: 'Без BR-2 и без учёта длительности: запись на «через 20 минут» и на 20:30 часового ТО.' },
      { v: 'c', t: 'Проверка только на сервере; ошибка «Ошибка сохранения»', why: 'Сервер проверять обязан, но и интерфейс не должен предлагать недоступные слоты. А «Ошибка сохранения» не говорит, что делать.' }] },
    { id: 'f-cmt', t: 'Комментарий для мастера', ph: 'Стучит справа при повороте', type: 'area', req: 'opt', src: 'booking.comment', vals: [
      { v: 'a', ok: true, t: 'До 500 символов, счётчик «120 / 500»; лишнее не вводится, подсказка «Опишите, что беспокоит»' },
      { v: 'b', t: 'До 50 символов', why: '«Стучит справа при повороте, началось после ямы на Ямашева» уже не влезет. А в базе под комментарий 500 символов (booking.comment).' },
      { v: 'c', t: 'Без ограничения длины', why: 'В базе поле VARCHAR(500): длинный текст или обрежется молча, или запись упадёт с ошибкой.' }] },
    { id: 'f-consent', t: 'Согласие на обработку персональных данных', ph: '☐ Согласен(на) с условиями', type: 'check', req: 'cond', reqAlt: 'req', src: 'new', vals: [
      { v: 'a', ok: true, t: 'По умолчанию не отмечен; без отметки «Записаться» недоступна, подсказка «Нужно согласие на обработку персональных данных»; показывается только тем, кто ещё не давал согласие' },
      { v: 'b', t: 'Отмечен заранее', why: 'Согласие по 152-ФЗ должно быть конкретным и сознательным. Заранее поставленная галочка — классическая претензия Роскомнадзора.' },
      { v: 'c', t: 'Не нужен — согласие подразумевается', why: 'Нарушает BR-15: согласие собирают при регистрации явно. Ольга Викторовна такое не пропустит.' }] }
  ];
  function fdEval(ans) {
    const f = (ans && ans.f) || {};
    const rows = FIELDS.map(r => {
      const v = f[r.id] || {}, val = r.vals.find(x => x.v === v.val);
      const cells = {
        type: v.type === r.type ? 1 : 0,
        req: v.req === r.req ? 1 : (r.reqAlt && v.req === r.reqAlt ? 0.5 : 0),
        val: val ? (val.ok ? 1 : val.alt ? 0.5 : 0) : 0,
        src: v.src === r.src ? 1 : 0
      };
      return { r, v, val, cells, pts: (cells.type + cells.req + cells.val + cells.src) / 4 };
    });
    return { rows, score: rows.reduce((s, x) => s + x.pts, 0) / FIELDS.length };
  }
  const taskFields = {
    id: 't-fields', title: 'Спецификация полей экрана «Запись»',
    simple: howSpec.simple,
    lead: ui.brief({
      situation: 'Ника нарисовала экран подтверждения записи. Даша: «Мне нужна спецификация: что в каждом поле, что обязательно, какие ошибки и куда это сохраняется». Глеб добавляет: «И названия полей — как в базе, а не как удобно».',
      todo: [
        'Для каждого из шести полей выберите тип элемента, обязательность, правило проверки с текстом ошибки и источник — поле базы или API.',
        'Опирайтесь на модель данных «Искры» (booking, booking_service, car, client) и правила BR-1, BR-2, BR-15.',
        'Нажмите «Проверить». Засчитывается от 80 % ячеек.'
      ],
      look: 'Если нужного поля в модели нет — так и напишите и задайте вопрос Глебу: это лучше, чем придумать имя самому. «Обязательное при условии» — когда поле нужно не всем (например, только тем, кто ещё не давал согласие).'
    }),
    blank: () => ({ f: {} }),
    reference: () => ({ f: Object.fromEntries(FIELDS.map(r => [r.id, { type: r.type, req: r.req, val: r.vals.find(x => x.ok).v, src: r.src }])) }),
    render(el, ctx) {
      el.classList.add('mui-root');
      const a = ctx.ans, ro = ctx.readonly; a.f = a.f || {};
      const show = !!(ctx.result || ro), src = ro ? taskFields.reference() : a;
      const ev = fdEval(src);
      const body = `${appbar('Запись')}<div class="mui-body"><span class="mui-chip">Победы, 8</span>${FIELDS.map((r, i) => `<div class="mui-f" style="position:relative"><span class="mui-lbl"><b style="color:var(--accent)">${i + 1}</b> · ${esc(r.t)}</span><span class="mui-in ${r.id === 'f-consent' ? '' : ''}">${esc(r.ph)}</span></div>`).join('')}<span class="mui-btn">Записаться</span></div>`;
      el.innerHTML = `<div class="mui-two"><div>${phone('Запись / Подтверждение', body)}</div><div class="mui-fl">${ev.rows.map((x, i) => {
        const cell = (k, label, list, wide) => {
          const cur = x.v[k], c = x.cells[k], cls = show && cur ? (c === 1 ? 'ok' : c === 0.5 ? 'warn' : 'bad') : '';
          let why = '';
          if (show && cur && c < 1) {
            if (k === 'val') why = x.val && x.val.why;
            else if (k === 'type') why = `Здесь нужен «${esc(TYPES.find(t => t.v === x.r.type).t)}».`;
            else if (k === 'req') why = x.r.id === 'f-consent' ? 'Согласие нужно только тем, кто его ещё не давал: «обязательное при условии». Просто «обязательное» засчитано наполовину.' : x.r.req === 'opt' ? 'Комментарий — по желанию: без него запись возможна.' : 'Без этого поля запись не состоится.';
            else why = x.r.src === 'new' ? 'В модели данных такого поля нет. Не выдумывайте имя — зафиксируйте вопрос Глебу о новом поле.' : `Источник — ${esc(SRCS.find(s => s.v === x.r.src).t)}.`;
          }
          return `<label class="mui-cell ${cls} ${wide ? 'wide' : ''}"><span>${label}</span><select data-fd="${x.r.id}" data-k="${k}" aria-label="${label}: ${esc(x.r.t)}" ${ro ? 'disabled' : ''}><option value="">—</option>${list.map(o => `<option value="${esc(o.v)}" ${cur === o.v ? 'selected' : ''}>${esc(o.t)}</option>`).join('')}</select>${why ? `<span class="why">${why}</span>` : ''}</label>`;
        };
        return `<div class="mui-fr"><header><span class="n">${i + 1}</span><b>${esc(x.r.t)}</b></header><div class="mui-cells">${cell('type', 'Тип', TYPES)}${cell('req', 'Обязательность', REQS)}${cell('val', 'Проверка и текст ошибки', x.r.vals, true)}${cell('src', 'Источник / поле', SRCS, true)}</div></div>`;
      }).join('')}</div></div>`;
      if (ro) return;
      el.addEventListener('change', e => {
        const s = e.target.closest('select[data-fd]'); if (!s) return;
        a.f[s.dataset.fd] = Object.assign({}, a.f[s.dataset.fd] || {}, { [s.dataset.k]: s.value }); ctx.save();
      });
    },
    check(ans) {
      const ev = fdEval(ans), notes = [];
      ev.rows.forEach(x => {
        if (x.pts === 1) { notes.push({ ok: true, html: `<b>${esc(x.r.t)}</b> — описано полностью.` }); return; }
        const bad = [];
        if (x.cells.type < 1) bad.push(`тип — «${esc(TYPES.find(t => t.v === x.r.type).t)}»`);
        if (x.cells.req < 1) bad.push(`обязательность — «${esc(REQS.find(t => t.v === x.r.req).t)}»`);
        if (x.cells.val < 1) bad.push(x.val ? 'проверка: ' + x.val.why : 'проверка не выбрана');
        if (x.cells.src < 1) bad.push(`источник — ${esc(SRCS.find(s => s.v === x.r.src).t)}`);
        notes.push({ ok: x.pts >= 0.75 ? 'warn' : false, html: `<b>${esc(x.r.t)}</b>: ${bad.join('; ')}` });
      });
      return {
        ok: ev.score >= 0.8, score: ev.score, notes,
        summary: `Спецификация заполнена верно на ${Math.round(ev.score * 100)} %.`,
        mentor: ev.score < 0.8 ? 'Для каждого поля задайте четыре вопроса Даши: «что это за элемент?», «можно пропустить?», «что не пропускать и что сказать?», «куда сохранить?». Ответы — в правилах BR-* и в модели данных.' : null
      };
    },
    explain: `<p>Спецификация полей снимает вопросы, которые иначе решили бы «как удобнее»: какие символы в госномере, что делать с «8…» в телефоне, сколько услуг в записи, где кончается сетка, сколько символов в комментарии, как собирать согласие.</p>
      <ul class="checks">
        <li><b>Источник</b> связывает экран с моделью: car.plate, client.phone, booking_service, booking.start_at/end_at, booking.comment. Поля согласия в модели нет — правильная реакция аналитика — вопрос Глебу, а не придуманное имя.</li>
        <li><b>Проверки</b> берутся из правил: BR-1 (длительность), BR-2 (2 часа и 30 дней), BR-15 (согласие). На сервере они повторяются обязательно.</li>
        <li><b>Тексты ошибок</b> говорят, что не так и как исправить, с примером.</li>
        <li><b>Условная обязательность</b> — частый пропуск: согласие нужно один раз, а не при каждой записи.</li>
      </ul>
      <p>Источники: Вигерс, «Разработка требований», гл. 15; ГОСТ 34.602 (требования к интерфейсу в ТЗ); Федеральный закон 152-ФЗ, ст. 9 (согласие на обработку персональных данных); эвристика Нильсена № 9.</p>`,
    refNote: 'У согласия «обязательное» вместо «обязательное при условии» засчитывается наполовину; проверка телефона «10 цифр» — тоже наполовину.',
    report: ans => fdEval(ans || {}).rows.map(x => `- ${x.r.t}: ${['type', 'req', 'val', 'src'].map(k => mark(x.cells[k] === 1 ? 'ok' : x.cells[k] ? 'warn' : 'bad')).join(' ')}`).join('\n')
  };

  // =====================================================================
  // Практика 3. Лаборатория: матрица состояний экрана «Мои записи» и прогон Лизы
  // =====================================================================
  const ST_ROWS = [
    { id: 's-empty', t: 'Пусто: у клиентки ещё нет записей', opts: [
      { id: 'a', k: 'bad', t: 'Пустой белый экран', m: '<div style="height:160px"></div>', why: 'Выглядит как сбой: человек не понимает, загрузилось ли.', out: { k: 'bad', t: 'Решила, что приложение сломалось, позвонила в колл-центр спросить, как записаться.', calls: 1 } },
      { id: 'b', k: 'ok', t: 'Иллюстрация, «У вас пока нет записей» и кнопка «Записаться на ТО»', m: '<div class="mui-empty"><span class="ic">📅</span><b>У вас пока нет записей</b><span class="mui-btn sm">Записаться на ТО</span></div>', why: 'Объясняет, почему пусто, и даёт следующий шаг.' },
      { id: 'c', k: 'bad', t: '«Ошибка: записи не найдены»', m: '<div class="mui-ban bad">Ошибка: записи не найдены</div>', why: 'Нормальная ситуация подана как ошибка — пугает новичка.', out: { k: 'mid', t: 'Испугалась «ошибки», но нашла запись через главную. Оставила отзыв «глючит».', complaints: 1 } }
    ] },
    { id: 's-load', t: 'Загрузка на медленном интернете', opts: [
      { id: 'a', k: 'ok', t: 'Скелетон — серые плашки на месте карточек; через 10 секунд — «Дольше обычного…» и «Повторить»', m: '<div class="mui-sk"></div><div class="mui-sk"></div><div class="mui-sk" style="height:30px"></div>', why: 'Видно, что идёт загрузка и что появится; есть выход, если долго.' },
      { id: 'b', k: 'bad', t: 'Ничего не показывать, пока не загрузится', m: '<div style="height:160px"></div>', why: 'Пустой экран на 8 секунд неотличим от «записей нет».', out: { k: 'bad', t: 'Восемь секунд пустоты — решил, что записи нет, и записался ещё раз. Две записи на одну машину.', dups: 1 } },
      { id: 'c', k: 'warn', t: 'Спиннер на весь экран, без ограничения по времени', m: '<div class="mui-spin"></div>', why: 'Загрузку видно, но если сервер не ответит — спиннер крутится вечно.', out: { k: 'mid', t: 'Подождал, спиннер крутился минуту — закрыл приложение и перезапустил. Сработало со второго раза.' } }
    ] },
    { id: 's-err', t: 'Ошибка сервера (ответ 500)', opts: [
      { id: 'a', k: 'ok', t: '«Не удалось загрузить записи. Мы уже чиним» + «Повторить»; код ошибки мелко для поддержки', m: '<div class="mui-empty"><span class="ic">⚠️</span><b>Не удалось загрузить записи</b><span>Мы уже чиним. Попробуйте через минуту</span><span class="mui-btn sm">Повторить</span><span class="mui-lbl">код: BK-500</span></div>', why: 'Честно, по-человечески, с действием; код помогает поддержке.' },
      { id: 'b', k: 'bad', t: 'Текст исключения: «NullPointerException at BookingService.list…»', m: '<div class="mui-code">java.lang.NullPointerException at BookingService.list(BookingService.java:142)</div>', why: 'Пугает и раскрывает внутреннее устройство системы — это ещё и вопрос безопасности.', out: { k: 'bad', t: 'Сделала скриншот «ошибки с кодом» и выложила в отзывы. Звонок в колл-центр: «у вас всё сломалось?»', calls: 1, complaints: 1 } },
      { id: 'c', k: 'bad', t: 'Пустой список — как будто записей нет', m: '<div class="mui-empty"><span class="ic">📅</span><b>У вас пока нет записей</b><span class="mui-btn sm">Записаться на ТО</span></div>', why: 'Ошибка маскируется под «пусто»: человек думает, что запись пропала, и записывается заново.', out: { k: 'bad', t: 'В понедельник в 9:00 сервер 10 минут отвечал 500. Сорок человек увидели «записей нет» и записались повторно — посты заняты дублями, а потом половина из них — неявки.', dups: 40, noshow: 20 } }
    ] },
    { id: 's-off', t: 'Нет сети', opts: [
      { id: 'a', k: 'ok', t: 'Плашка «Нет соединения», последние сохранённые записи с отметкой «обновлено в 9:12»; «Перенести» и «Отменить» недоступны до появления сети', m: '<div class="mui-ban">Нет соединения · обновлено в 9:12</div><div class="mui-card"><b>Ср 16 дек, 10:00 · Победы</b><span>ТО-1 · от 3 900 ₽</span><span><span class="mui-btn sm dis">Перенести</span> <span class="mui-btn sm ghost dis">Отменить</span></span></div>', why: 'Человек видит свои данные и понимает, почему действия недоступны.' },
      { id: 'b', k: 'bad', t: 'Бесконечная загрузка', m: '<div class="mui-spin"></div>', why: 'Ни данных, ни объяснения. В метро — минуты ожидания впустую.', out: { k: 'mid', t: 'В метро крутился спиннер. Вышла на станции — забыла, что хотела перенести, не приехала.', noshow: 1 } },
      { id: 'c', k: 'bad', t: 'Список из кэша без пометки, кнопки активны', m: '<div class="mui-card"><b>Ср 16 дек, 10:00 · Победы</b><span>ТО-1 · от 3 900 ₽</span><span><span class="mui-btn sm">Перенести</span> <span class="mui-btn sm ghost">Отменить</span></span></div>', why: 'Нажатие «Отменить» молча пропадает: человек уверен, что отменил, а пост ждёт.', out: { k: 'bad', t: 'Нажала «Отменить» в метро — отмена не ушла. Утром пост ждал 15 минут: неявка, вторая подряд — следующая запись уже с предоплатой (BR-4).', noshow: 1, complaints: 1 } }
    ] },
    { id: 's-ok', t: 'Успех: есть записи', opts: [
      { id: 'a', k: 'ok', t: 'Ближайшая сверху: дата, время, станция, услуги, цена «от», статус; «Перенести» и «Отменить» — только если до начала больше 3 часов (BR-3)', m: '<div class="mui-card"><b>Ср 16 дек, 10:00 · Победы</b><span>ТО-1 · от 3 900 ₽ · Подтверждена</span><span><span class="mui-btn sm">Перенести</span> <span class="mui-btn sm ghost">Отменить</span></span></div><div class="mui-card"><b>Пт 25 дек, 18:00 · Азино</b><span>Шиномонтаж · от 2 400 ₽</span></div>', why: 'Главное — сверху, правило BR-3 видно в интерфейсе.' },
      { id: 'b', k: 'bad', t: 'Все записи по дате создания, кнопки доступны всегда', m: '<div class="mui-card"><b>Пт 25 дек, 18:00 · Азино</b></div><div class="mui-card"><b>Ср 16 дек, 10:00 · Победы</b><span class="mui-btn sm">Отменить</span></div>', why: 'Ближайшая запись теряется внизу, а бесплатная отмена за 30 минут нарушает BR-3.', out: { k: 'bad', t: 'Отменила запись за 40 минут до начала — кнопка позволила. Пост пустой, BR-3 нарушено, Марина Олеговна в ярости.', complaints: 1, noshow: 1 } },
      { id: 'c', k: 'warn', t: 'Только дата и станция — подробности по нажатию', m: '<div class="mui-card"><b>Ср 16 дек · Победы</b></div><div class="mui-card"><b>Пт 25 дек · Азино</b></div>', why: 'Чисто, но время и цена «от» спрятаны — чаще открывают карточку и чаще звонят уточнить.', out: { k: 'mid', t: 'Не увидела время на главном экране, позвонила уточнить «во сколько я записана».', calls: 1 } }
    ] },
    { id: 's-long', t: 'Много данных: у таксопарка 12 записей, длинные названия услуг', opts: [
      { id: 'a', k: 'ok', t: 'Название переносится на 2 строки, дальше «…» и полное — в карточке; прошлые визиты свёрнуты в «История»', m: '<div class="mui-card"><b>Чт 17 дек, 09:00 · Победы</b><span>Комплексная диагностика ходовой части и рулевого…</span></div><div class="mui-card"><b>Чт 17 дек, 09:30 · Победы</b><span>ТО-2 · Т777ТТ 716</span></div><span class="mui-lbl">ещё 10 записей · История визитов ›</span>', why: 'Вёрстка держит реальные данные, список не превращается в простыню.' },
      { id: 'b', k: 'bad', t: 'Обрезать название до 10 символов', m: '<div class="mui-card"><b>Чт 17 дек, 09:00</b><span>Комплексна…</span></div><div class="mui-card"><b>Чт 17 дек, 09:30</b><span>Комплексна…</span></div>', why: 'Две разные услуги выглядят одинаково — не понять, что за запись.', out: { k: 'mid', t: 'Рустам не смог отличить две записи «Комплексна…», отменил не ту. Машину пришлось переписывать по телефону.', calls: 1 } },
      { id: 'c', k: 'bad', t: 'Длинная строка вылезает за экран — горизонтальная прокрутка', m: '<div class="mui-card" style="white-space:nowrap;overflow:hidden"><b>Чт 17 дек, 09:00</b><span>Комплексная диагностика ходовой части и рулевого управления с выездом на…</span></div>', why: 'Экран ломается, кнопки уезжают за край.', out: { k: 'bad', t: 'У Рустама экран ехал вбок, кнопки «Перенести» не видно. Позвонил завгару-соседу, потом в колл-центр.', calls: 1, complaints: 1 } }
    ] }
  ];
  const ST_CASES = [
    { id: 'c1', row: 's-empty', t: 'Алсу только что зарегистрировалась и открыла «Мои записи»' },
    { id: 'c2', row: 's-load', t: 'Игорь в лифте, слабый 3G — список грузится 8 секунд' },
    { id: 'c3', row: 's-err', t: 'Понедельник, 09:00, пик 1 500 человек — сервер 10 минут отвечает 500' },
    { id: 'c4', row: 's-off', t: 'Елена в метро без сети хочет отменить запись на утро' },
    { id: 'c5', row: 's-ok', t: 'У Елены две записи: завтра 10:00 и через неделю' },
    { id: 'c6', row: 's-long', t: 'Рустам: у «Шашки» 12 записей, у одной услуги длинное название' }
  ];
  const ST_GOOD = { c1: 'Увидела «пока нет записей», нажала «Записаться на ТО» — записалась за 2 минуты.', c2: 'Видел скелетон, через 8 секунд список появился. Ничего не нажимал зря.', c3: 'Увидели «Не удалось загрузить, мы уже чиним», нажали «Повторить» через минуту. Ни одного дубля.', c4: 'Увидела «Нет соединения», кнопки недоступны — отменила, выйдя из метро. Пост освобождён заранее.', c5: 'Ближайшая сверху, время и цена «от» видны, перенесла в два нажатия.', c6: 'Две строки названия и «ещё 10 записей» — нашёл нужную, перенёс.' };
  function stEval(ans) {
    const s = (ans && ans.s) || {};
    const rows = ST_ROWS.map(r => { const o = r.opts.find(x => x.id === s[r.id]) || null; return { r, o, pts: !o ? 0 : o.k === 'ok' ? 1 : o.k === 'warn' ? 0.5 : 0 }; });
    const runs = ST_CASES.map(c => {
      const x = rows.find(y => y.r.id === c.row);
      const out = !x.o ? { k: 'bad', t: 'Состояние не описано — Даша сделала как успела: белый экран. Клиент позвонил в колл-центр.', calls: 1 } : x.o.k === 'ok' ? { k: 'good', t: ST_GOOD[c.id] } : x.o.out;
      return { c, out };
    });
    const sum = k => runs.reduce((acc, x) => acc + (x.out[k] || 0), 0);
    return { rows, runs, score: rows.reduce((acc, x) => acc + x.pts, 0) / ST_ROWS.length, good: runs.filter(x => x.out.k === 'good').length, calls: sum('calls'), dups: sum('dups'), noshow: sum('noshow'), complaints: sum('complaints') };
  }
  const taskStates = {
    id: 't-states', title: 'Лаборатория: матрица состояний «Мои записи» и прогон Лизы',
    simple: howStates.simple,
    lead: ui.brief({
      situation: 'Экран «Мои записи» у Ники — один красивый фрейм. Лиза: «У меня шесть случаев: новая клиентка, медленный интернет, сервер лёг в пик, метро, обычный день, таксопарк с дюжиной записей». Вера: «Заполните матрицу состояний — и пусть Лиза прогонит».',
      todo: [
        'Для каждого из шести состояний выберите, что увидит клиент. Превью телефона показывает выбранный вариант.',
        'Думайте о последствиях: что человек сделает дальше, если поймёт экран неправильно?',
        'Нажмите «Проверить» — Лиза прогонит шесть случаев. Засчитывается от 80 %, если ошибка сервера не маскируется под «пусто».'
      ],
      look: 'Опасные состояния — те, что выглядят как другие: ошибка как «пусто», офлайн как «всё работает». Из-за них появляются дубли записей и неявки. Правило BR-3: бесплатная отмена и перенос — не позднее чем за 3 часа.'
    }),
    blank: () => ({ s: {} }),
    reference: () => ({ s: Object.fromEntries(ST_ROWS.map(r => [r.id, r.opts.find(o => o.k === 'ok').id])) }),
    render(el, ctx) {
      el.classList.add('mui-root');
      const a = ctx.ans, ro = ctx.readonly; a.s = a.s || {};
      const show = !!(ctx.result || ro), src = ro ? taskStates.reference() : a;
      let pv = 's-ok';
      el.innerHTML = `<div class="stack"><div class="mui-two"><div class="stack tight"><div data-pvs></div><div data-pv></div></div><div class="mui-fl" data-rows></div></div><div data-run></div></div>`;
      function preview() {
        TR.$('[data-pvs]', el).innerHTML = `<label class="small dim">Превью: <select data-pvsel aria-label="Какое состояние показать в превью">${ST_ROWS.map(r => `<option value="${r.id}" ${pv === r.id ? 'selected' : ''}>${esc(r.t.split(':')[0])}</option>`).join('')}</select></label>`;
        const r = ST_ROWS.find(x => x.id === pv), o = r.opts.find(x => x.id === (src.s || {})[r.id]);
        TR.$('[data-pv]', el).innerHTML = phone('Записи / Мои записи · ' + r.t.split(':')[0].toLowerCase(), `${appbar('Мои записи', false)}<div class="mui-body">${o ? o.m : '<div class="mui-empty"><span class="ic">?</span><span>Состояние ещё не выбрано</span></div>'}</div>${tabbar('Записи')}`, { net: r.id === 's-off' ? 'нет сети ✕' : r.id === 's-load' ? '3G ▮' : '4G ▮▮▮' });
      }
      function rows() {
        TR.$('[data-rows]', el).innerHTML = ST_ROWS.map(r => `<div class="mui-fr"><header><b>${esc(r.t)}</b></header><div class="mui-opts">${r.opts.map(o => {
          const on = (src.s || {})[r.id] === o.id, cls = (show && on) || (ro && o.k === 'ok') ? (o.k === 'ok' ? 'ok' : o.k === 'warn' ? 'warn' : 'bad') : '';
          return `<button type="button" class="mui-opt ${cls}" data-sr="${r.id}" data-o="${o.id}" aria-pressed="${on}" ${ro ? 'disabled' : ''}><span class="bx" aria-hidden="true"></span><span>${esc(o.t)}${show && on ? `<span class="why">${o.why}</span>` : ''}</span></button>`;
        }).join('')}</div></div>`).join('');
      }
      function run() {
        const box = TR.$('[data-run]', el);
        if (!show) { box.innerHTML = '<div class="small dim">После проверки Лиза прогонит шесть случаев по вашей матрице и посчитает последствия.</div>'; return; }
        const ev = stEval(src);
        box.innerHTML = `<div class="stack tight"><span class="eyebrow">Прогон Лизы · шесть случаев</span>
          <div class="mui-stats"><div class="mui-stat ${ev.good === 6 ? 'ok' : ''}"><span class="v">${ev.good} / 6</span><span class="k">без проблем</span></div>
          <div class="mui-stat ${ev.calls ? 'bad' : 'ok'}"><span class="v">${ev.calls}</span><span class="k">звонков в колл-центр</span></div>
          <div class="mui-stat ${ev.dups ? 'bad' : 'ok'}"><span class="v">${ev.dups}</span><span class="k">записей-дублей</span></div>
          <div class="mui-stat ${ev.noshow ? 'bad' : 'ok'}"><span class="v">${ev.noshow}</span><span class="k">неявок</span></div></div>
          <div class="mui-runs">${ev.runs.map(x => `<div class="mui-run ${x.out.k}"><div class="hd">${esc(x.c.t)}</div><div class="tx">${esc(x.out.t)}</div></div>`).join('')}</div>
          ${ui.say('liza', ev.good === 6 ? 'Шесть из шести. Забираю матрицу в тест-план: выключаю сеть, замедляю ответ, возвращаю 500, создаю клиента без записей и таксопарк на 12 записей.' : `Ломается ${6 - ev.good} из 6. Самое дорогое — то, что выглядит как другое состояние: дубли и неявки потом разгребает Марина Олеговна.`)}</div>`;
      }
      preview(); rows(); run();
      el.addEventListener('change', e => { const s = e.target.closest('select[data-pvsel]'); if (s) { pv = s.value; preview(); } });
      if (ro) return;
      TR.on(el, 'click', '[data-sr][data-o]', (e, b) => {
        a.s[b.dataset.sr] = b.dataset.o; pv = b.dataset.sr; ctx.save();
        const r = ST_ROWS.find(x => x.id === b.dataset.sr); ctx.decide && ctx.decide('Состояние «' + r.t + '»', r.opts.find(o => o.id === b.dataset.o).t);
        rows(); preview();
      });
    },
    check(ans) {
      const ev = stEval(ans), notes = [];
      ev.rows.forEach(x => notes.push(!x.o ? { ok: false, html: `«${esc(x.r.t)}» — состояние не описано.` } : { ok: x.o.k === 'ok' ? true : x.o.k === 'warn' ? 'warn' : false, html: `«${esc(x.r.t)}» → ${esc(x.o.t)}. ${x.o.why}` }));
      notes.push({ ok: ev.good === 6, html: `Прогон: без проблем ${ev.good} из 6; звонков — ${ev.calls}, дублей — ${ev.dups}, неявок — ${ev.noshow}, жалоб — ${ev.complaints}.` });
      const err = ev.rows.find(x => x.r.id === 's-err').o;
      const errOk = !!err && err.id !== 'c';
      return {
        ok: ev.score >= 0.8 && errOk, score: ev.score, notes,
        summary: `Состояния: ${ev.rows.filter(x => x.o && x.o.k === 'ok').length} из ${ST_ROWS.length} верно; прогон — ${ev.good} из 6 без проблем.`,
        mentor: !errOk ? 'Ошибка, замаскированная под «записей нет», — самая дорогая: в пик сорок человек записались повторно. Ошибка должна выглядеть как ошибка — с текстом и «Повторить».' : (ev.score < 0.8 ? 'Для каждого состояния спросите: «Что человек подумает и что сделает дальше?» Если он может принять одно состояние за другое — вариант плохой.' : null)
      };
    },
    explain: `<p>Матрица состояний — дешёвый способ избежать дорогих последствий. Красивый фрейм «Успех» — только одна шестая экрана. Остальное Даша либо сделает по спецификации, либо придумает сама.</p>
      <ul class="checks">
        <li><b>Ошибка ≠ пусто.</b> Подмена ошибки пустым списком в пик понедельника даёт дубли записей и неявки — прямо против цели 17 % → 8 %.</li>
        <li><b>Офлайн — честно.</b> Последние данные с меткой времени и недоступные действия; иначе «отмена» молча пропадает.</li>
        <li><b>Правило в интерфейсе.</b> «Перенести» и «Отменить» доступны только при запасе больше 3 часов (BR-3) — и на сервере тоже.</li>
        <li><b>Реальные данные.</b> 12 записей и длинные названия — проверка вёрстки, которую делают на макете, а не в отзывах.</li>
      </ul>
      <p>Каждая строка матрицы — тест-кейс Лизы и вариант компонента у Ники. Источники: Нильсен, эвристики № 1 и № 9; Material Design и Apple Human Interface Guidelines — разделы о пустых состояниях, загрузке и офлайн-режиме.</p>`,
    refNote: 'Спиннер без ограничения по времени и «только дата и станция» засчитываются наполовину. Ошибка сервера, показанная пустым списком, блокирует зачёт.',
    report: ans => stEval(ans || {}).rows.map(x => `- ${x.r.t}: ${x.o ? x.o.t : '—'} ${mark(x.o ? (x.o.k === 'ok' ? 'ok' : x.o.k) : 'bad')}`).join('\n')
  };

  // =====================================================================
  // Практика 4. Сопоставить элементы экрана «Согласование доп. работ» с полями API и базы
  // =====================================================================
  const AP_CH = [
    { v: 'eo.photo', t: 'extra_offer.photo_url' }, { v: 'eo.desc', t: 'extra_offer.description' }, { v: 'eo.amount', t: 'extra_offer.amount' },
    { v: 'eo.sent', t: 'extra_offer.sent_at + 20 минут (BR-8) — вычисляется' }, { v: 'eo.status', t: 'extra_offer.status → approved, decided_by = client, decided_at' },
    { v: 'wo.number', t: 'work_order.number' }, { v: 'wo.status', t: 'work_order.status (waiting_approval)' }, { v: 'wo.master', t: 'work_order.master_id → employee' },
    { v: 'car.plate', t: 'work_order.car_id → car.brand, car.model, car.plate' }, { v: 'wi.price', t: 'work_item.price' }, { v: 'client.bonus', t: 'client.bonus_balance' }, { v: 'bk.comment', t: 'booking.comment' }
  ];
  const AP_EL = [
    { id: 'e1', t: 'Фото колодок', ok: 'eo.photo', why: 'Фото механика хранится ссылкой в extra_offer.photo_url (до 10 МБ, 6 месяцев — НФТ кейса).' },
    { id: 'e2', t: '«Износ передних колодок 90 %, диск в норме. Предлагаем заменить колодки»', ok: 'eo.desc', why: 'Что нашли и что предлагаем — extra_offer.description.' },
    { id: 'e3', t: '«6 400 ₽»', ok: 'eo.amount', alt: { 'wi.price': 'Строка work_item появится только после согласия. До этого цена живёт в предложении — extra_offer.amount.' }, why: 'Сумма предложения — extra_offer.amount. Строка в заказ-наряде (work_item) появится только после согласия.' },
    { id: 'e4', t: '«Предложил: мастер Марина О.»', ok: 'wo.master', why: 'Цену формирует мастер-приёмщик (BR-7): employee через work_order.master_id.' },
    { id: 'e5', t: '«Kia Rio · А123ВС 116»', ok: 'car.plate', why: 'Машина берётся через work_order.car_id → car.' },
    { id: 'e6', t: '«Ждём ответа до 12:18»', ok: 'eo.sent', why: 'Такого поля нет — время вычисляется: sent_at + 20 минут (BR-8). Это надо записать в спецификации, иначе Даша спросит «а где поле deadline?».' },
    { id: 'e7', t: 'Кнопка «Согласовать»', ok: 'eo.status', why: 'Нажатие меняет extra_offer.status на approved, decided_by = client, decided_at = сейчас; затем в заказ-наряд добавляется строка работы.' },
    { id: 'e8', t: '«Заказ-наряд ПБ-0412»', ok: 'wo.number', why: 'Человекочитаемый номер — work_order.number, а не внутренний id.' },
    { id: 'e9', t: 'Статус «Ждёт согласования»', ok: 'wo.status', why: 'Пока предложение не решено, заказ-наряд в статусе waiting_approval («Ждёт согласования»).' }
  ];
  function apMock(nums) {
    const n = i => nums ? `<span class="num" aria-hidden="true">${i}</span>` : '';
    const box = (i, html) => `<span class="mui-hs" style="cursor:default">${html}${n(i)}</span>`;
    return phone('Ремонт / Согласование доп. работ', `${appbar('Нужно ваше решение')}<div class="mui-body">
      ${box(8, '<span class="mui-lbl">Заказ-наряд ПБ-0412 · Победы</span>')}${box(5, '<b>Kia Rio · А123ВС 116</b>')}${box(9, '<span class="mui-chip">● Ждёт согласования</span>')}
      ${box(1, photoSVG())}
      ${box(2, '<span>Износ передних колодок 90 %, диск в норме. Предлагаем заменить колодки</span>')}
      <div class="row between">${box(3, '<b style="font-size:18px">6 400 ₽</b>')}${box(4, '<span class="mui-lbl">Предложил: мастер Марина О.</span>')}</div>
      ${box(6, '<span class="mui-ban">Ждём ответа до 12:18 · потом позвонит мастер</span>')}
      ${box(7, '<span class="mui-btn">Согласовать</span>')}<span class="mui-btn ghost">Отказаться</span></div>`, { time: '11:58' });
  }
  const taskApi = {
    id: 't-api', title: 'Экран «Согласование доп. работ» ↔ поля API и базы',
    simple: {
      icon: '🔗',
      plain: 'Каждый элемент на экране откуда-то берётся: из поля в базе, из ответа API или вычисляется по правилу. Аналитик связывает элементы макета с полями данных — тогда Даша знает, что запросить, Глеб — что отдать, а Лиза — что проверить.',
      analogy: 'Квитанция за квартиру: «к оплате» — из показаний счётчика и тарифа, «долг» — из прошлого месяца, «пени» — вычисляются. Если не знать, откуда каждая цифра, спорить с управляющей компанией бесполезно.',
      tech: 'Маппинг «элемент интерфейса ↔ атрибут данных» — часть спецификации экрана; основа для контракта API (поля ответа GET /work-orders/{id}/extra-offers) и словаря данных. Вычисляемые значения описываются формулой и правилом (BR-8), а не выдуманным полем.'
    },
    lead: ui.brief({
      situation: 'Макет «Согласование доп. работ» — тот самый, ради которого Елена просила фото и цену. Глеб: «Прежде чем делать API, скажите, что на экране и откуда это берётся. Названия — из модели данных». На макете девять пронумерованных элементов.',
      todo: [
        'Для каждого из девяти элементов выберите поле базы или API, откуда он берётся (или во что превращается нажатие).',
        'Будьте внимательны: одно значение вычисляется, а одно поле похоже на правильное, но появляется только после согласия.',
        'Нажмите «Проверить». Засчитывается от 80 %.'
      ],
      look: 'Модель: work_order (number, status, master_id, car_id), extra_offer (description, amount, photo_url, sent_at, status, decided_by, decided_at), work_item (строки заказ-наряда). BR-7: цену формирует мастер. BR-8: 20 минут на ответ.'
    }),
    blank: () => ({ v: {} }),
    reference: () => ({ v: Object.fromEntries(AP_EL.map(e => [e.id, e.ok])) }),
    render(el, ctx) {
      el.classList.add('mui-root');
      let reveal = null;
      const v = ctx.ans.v || {};
      if (ctx.result || ctx.readonly) { reveal = {}; AP_EL.forEach(e => { const g = v[e.id]; if (ctx.readonly || g) reveal[e.id] = { s: ctx.readonly || g === e.ok ? 'ok' : (e.alt && e.alt[g] ? 'warn' : 'bad'), why: ctx.readonly || g === e.ok ? e.why : (e.alt && e.alt[g]) || 'Откуда ещё может взяться это значение? Посмотрите на таблицы extra_offer и work_order.' }; }); }
      el.innerHTML = `<div class="mui-two"><div>${apMock(true)}</div><div data-m></div></div>`;
      ui.match(TR.$('[data-m]', el), { rows: AP_EL.map((e, i) => ({ id: e.id, t: `<b>${i + 1}.</b> ${esc(e.t)}` })), choices: AP_CH, value: v, reveal, readonly: ctx.readonly, placeholder: 'Поле…', onChange: nv => { ctx.ans.v = nv; ctx.save(); } });
    },
    check(ans) {
      const v = (ans && ans.v) || {}, notes = [];
      let pts = 0;
      AP_EL.forEach((e, i) => {
        const g = v[e.id];
        if (g === e.ok) { pts += 1; return; }
        if (e.alt && e.alt[g]) { pts += 0.5; notes.push({ ok: 'warn', html: `${i + 1}. ${esc(e.t)} — ${e.alt[g]}` }); return; }
        notes.push({ ok: false, html: `${i + 1}. ${esc(e.t)} — ${g ? 'не ' + esc(AP_CH.find(c => c.v === g).t) + '. ' : 'не выбрано. '}${e.why}` });
      });
      const score = pts / AP_EL.length;
      if (score === 1) notes.push({ ok: true, html: 'Все девять элементов связаны с данными, включая вычисляемое время ответа и действие кнопки.' });
      return {
        ok: score >= 0.8, score, notes,
        summary: `Верно: ${AP_EL.filter(e => v[e.id] === e.ok).length} из ${AP_EL.length}.`,
        mentor: score < 0.8 ? 'Различайте три вида элементов: <b>хранимое</b> поле (description, amount), <b>связанное</b> через ключ (мастер, машина) и <b>вычисляемое</b> по правилу (sent_at + 20 минут). А кнопка — это изменение данных.' : null
      };
    },
    explain: `<p>На экране девять элементов — и три их разных рода:</p>
      <ul class="checks">
        <li><b>Хранимые</b> в предложении: фото, описание, сумма — extra_offer.photo_url, description, amount.</li>
        <li><b>Связанные</b> через ключи: номер и статус заказ-наряда, мастер (work_order.master_id → employee), машина (work_order.car_id → car).</li>
        <li><b>Вычисляемые</b>: «ждём до 12:18» = sent_at + 20 минут (BR-8). Поля нет — и не надо; надо записать формулу.</li>
        <li><b>Действие</b>: «Согласовать» меняет extra_offer.status, decided_by, decided_at, а потом создаёт строку work_item со ссылкой extra_offer_id.</li>
      </ul>
      <p>Частая ловушка — work_item.price вместо extra_offer.amount: до согласия строки в заказ-наряде ещё нет. Такой маппинг Глеб превратит в ответ API, а Лиза — в проверку «цена на экране = amount предложения». Источники: Вигерс, «Разработка требований», гл. 13 «Требования к данным»; BABOK v3, «Моделирование данных».</p>`,
    refNote: 'work_item.price для цены засчитывается наполовину: строка работы появится только после согласия.',
    report: ans => AP_EL.map((e, i) => `- ${i + 1}. ${e.t}: ${(AP_CH.find(c => c.v === ((ans && ans.v) || {})[e.id]) || { t: '—' }).t} ${mark(((ans && ans.v) || {})[e.id] === e.ok ? 'ok' : 'bad')}`).join('\n')
  };

  // =====================================================================
  // Практика 5. Комментарий Нике в Figma своими словами
  // =====================================================================
  const CM_RUBRIC = [
    'Тон коллеги: отмечает, что сделано хорошо (станция видна, кнопка повторяет выбор), замечания — без «всё переделать».',
    'Называет конкретные проблемы с правилами и причинами: 2 часа и 30 дней (BR-2), длительность до закрытия в 21:00 (BR-1), цена «от» (BR-5).',
    'Просит недостающие состояния — «нет слотов», «загрузка», «ошибка», «нет сети» — как фреймы или варианты компонента «Слот».',
    'Говорит про доступность: занятый слот отличается не только цветом (зачёркнут, недоступен), достаточный размер касания.',
    'Предлагает следующий шаг и ссылку: где лежат правила (ссылка на требования), что обновить и к какому сроку, кто проверит; вопросы, а не приказы.'
  ];
  const CM_REF = 'Ника, спасибо — экран читается сразу: станция видна, кнопка повторяет выбранное время, это очень удобно. Несколько правок по правилам, они в требованиях к записи (ссылка на раздел «Запись на ТО», BR-1, BR-2, BR-5). 1) Запись — не ближе чем за 2 часа и не дальше 30 дней: при 9:40 первый слот — 12:00, а календарь должен заканчиваться 14 января, а не 15 февраля. 2) ТО-1 идёт час, значит слот 20:30 закончится в 21:30, после закрытия, — его надо скрыть или сделать недоступным. 3) Рядом с услугой нужна цена «от 3 900 ₽» и подпись «итог после диагностики» — клиентки об этом прямо просили. 4) Занятые слоты сейчас отличаются только оттенком; можно сделать их зачёркнутыми и неактивными — вариантом компонента «Слот: занят»? 5) Не хватает состояний «нет слотов на день» (с ближайшими датами и станциями рядом), «загрузка», «ошибка» и «нет сети» — можно как варианты фрейма. Если удобно, созвонимся на 15 минут сегодня; обновлённые фреймы до понедельника — Лиза сразу возьмёт их в проверку, а я поставлю ссылки на фреймы в требования.';
  const taskComment = {
    id: 't-comment', title: 'Комментарий Нике в Figma своими словами',
    simple: {
      icon: '💬',
      plain: 'Комментарий в Figma — это короткое письмо коллеге. Хороший комментарий говорит, что хорошо, что не так и почему, со ссылкой на правило, и предлагает следующий шаг. Плохой — «переделать всё» или «так не должно быть» без объяснения.',
      analogy: 'Замечания к ремонту прорабу. «Всё криво» — ссора. «Розетку у плиты — на 20 см выше, по нормам; плитку в ванной — супер; давайте в пятницу посмотрим ещё раз» — и прораб переделывает без обид.',
      tech: 'Ревью дизайна — совместная работа, а не экзамен: конкретно, с причиной (правило, требование, эвристика), с приоритетом и ссылкой, вопросами вместо приказов. Комментарии привязываются к фрейму; решённые закрываются; итог фиксируется в требованиях и версии макета.'
    },
    lead: ui.brief({
      situation: 'После ревью Вера: «Напишите Нике один общий комментарий на фрейм „Выбор времени“. Она отличный дизайнер, просто правила к ней не дошли. Нужно, чтобы она поправила к понедельнику и не обиделась».',
      todo: [
        'Напишите комментарий в 6–10 предложений (от 300 символов).',
        'Отметьте хорошее, назовите проблемы с правилами и причинами, попросите недостающие состояния, скажите про доступность и предложите следующий шаг.',
        'Нажмите «Проверить с Верой (Claude)» или «Сверить с эталоном самому» и честно отметьте раскрытые пункты. Засчитывается от 60 %.'
      ],
      lookTitle: 'На что опереться',
      look: 'Ваши находки из ревью: цена «от», 30 дней, 2 часа, слот 20:30, занятые слоты только цветом, один фрейм без состояний. Ника любит конкретику и ссылки.'
    }),
    blank: () => ({ j: {} }),
    reference: () => ({ j: { text: CM_REF, self: CM_RUBRIC.map(() => true) } }),
    render(el, ctx) {
      el.classList.add('mui-root');
      el.innerHTML = `<div class="stack">${ui.say('nika', 'Жду комментарии к «Выбору времени». Только, пожалуйста, по делу — в прошлом проекте мне писали «некрасиво» и «переделать», я так и не поняла, что именно.')}<div data-j></div></div>`;
      ui.justify(TR.$('[data-j]', el), {
        id: 'mui-comment', q: 'Комментарий Нике к фрейму «Запись / Выбор времени»',
        qPlain: 'Напишите дизайнеру комментарий к макету экрана выбора времени записи в автосервис: отметьте хорошее; назовите проблемы с правилами (запись не ближе чем за 2 часа и не дальше 30 дней, длительность услуги до закрытия в 21:00, цена «от»); попросите состояния «нет слотов», «загрузка», «ошибка», «нет сети»; скажите про отличие занятых слотов не только цветом; предложите следующий шаг.',
        rubric: CM_RUBRIC, reference: CM_REF, value: ctx.ans.j, readonly: ctx.readonly, minLen: 300,
        placeholder: 'Ника, спасибо — экран читается сразу…',
        onChange: v => { ctx.ans.j = v; ctx.save(); ctx.decide && ctx.decide('Комментарий Нике в Figma', v.text || ''); }
      });
    },
    check(ans) {
      const s = ui.justifyScore(ans && ans.j);
      return {
        ok: s >= 0.6, score: s,
        summary: s ? `Оценка комментария: ${Math.round(s * 100)} %.` : 'Напишите комментарий (от 300 символов) и проверьте его с Верой или сверьте с эталоном сами.',
        notes: s && s < 0.6 ? [{ ok: false, html: 'Нике нужны три вещи: что именно не так и по какому правилу, каких состояний не хватает и что делать дальше — с кем, к какому сроку, где ссылки.' }] : []
      };
    },
    explain: `<p>Хороший комментарий к макету — короткая спецификация изменений в вежливой форме: <b>что хорошо → что не так и почему (правило) → что нужно добавить → следующий шаг</b>. Нумерованные пункты удобно закрывать по одному.</p>
      <p>Частые ошибки: вкусовщина без причины («мне не нравится»), приказной тон, десяток комментариев-точек без общей картины, правила только в комментарии (а не в требованиях). После ревью аналитик обновляет требования и ставит ссылки на обновлённые фреймы — иначе через месяц никто не вспомнит, почему 20:30 недоступно. Источники: Figma Help — «Comments», «Dev Mode»; Нильсен, «10 эвристик»; Вигерс, «Разработка требований», гл. 15.</p>`,
    report: ans => (ans.j && ans.j.text) ? ans.j.text : '—'
  };

  // =====================================================================
  TR.stage({
    id: ID,
    when: 'четверг, 17 декабря, 12:00 · ревью макетов Ники в Figma',
    intro: [
      { who: 'nika', html: 'Макеты записи готовы! Я учла карту пути — статус ремонта и согласование с фото теперь на главном месте. Посмотрите до обеда? Завтра хочу отдать Даше.' },
      { who: 'dasha', html: 'Я уже открыла. Красиво. Но у меня вопросы: что в полях можно вводить, что показывать, пока грузится, и как эти поля называются в API.' },
      { who: 'liza', html: 'А я хочу знать, что будет без сети и при ошибке. На макете только солнечный день.' },
      { who: 'vera', html: 'Вот и работа на сегодня. Разберёмся, как читать Figma глазами аналитика, проведём ревью по чек-листу, напишем спецификацию полей и матрицу состояний и свяжем экран с данными. А в конце — комментарий Нике, после которого она скажет «спасибо», а не «опять переделывать».' }
    ],
    facts: ['F-slot', 'F-cutoff', 'F-cancel', 'F-noshow-rule', 'F-price-from', 'F-extra-who', 'F-extra-timeout', 'F-pd', 'F-excel', 'F-el-photo'],
    glossary: [
      { term: 'Схема (wireframe)', simple: 'Черновик экрана серыми блоками: что где лежит.', tech: 'Low-fidelity — каркас интерфейса без визуального стиля; для договорённости о составе и порядке элементов.' },
      { term: 'Макет (mockup)', simple: 'Как экран будет выглядеть на самом деле.', tech: 'High-fidelity — финальный визуальный дизайн; основа для вёрстки и ревью текстов, состояний, данных.' },
      { term: 'Прототип', simple: 'Макеты, связанные переходами: можно «прокликать».', tech: 'Интерактивная модель интерфейса для проверки потока и навигации; в Figma — режим Prototype.' },
      { term: 'Фрейм', simple: 'Один экран или его состояние в Figma.', tech: 'Frame — контейнер заданного размера (например, 390 × 844); у фрейма есть своя ссылка.' },
      { term: 'Компонент и варианты', simple: 'Переиспользуемый элемент и его разные состояния.', tech: 'Component / variants в Figma: «Слот» — свободен, занят, выбран, недоступен.' },
      { term: 'Режим разработчика (Dev Mode)', simple: 'Режим Figma для разработчиков: размеры, цвета, ссылки на требования.', tech: 'Dev Mode — инспектор свойств, экспорт ресурсов, статус «готово к разработке», аннотации и ссылки.' },
      { term: 'Спецификация полей', simple: 'Таблица: что в каждом поле экрана, что обязательно, какие проверки и куда сохраняется.', tech: 'Поле, тип, обязательность, формат/маска, валидация, текст ошибки, значение по умолчанию, источник (API/БД), права.' },
      { term: 'Валидация', simple: 'Проверка, что введено допустимое значение.', tech: 'Проверка ввода на клиенте (для удобства) и обязательно на сервере (для надёжности).' },
      { term: 'Состояния экрана', simple: 'Пусто, загрузка, ошибка, нет сети, успех, длинный текст — у каждого свой вид и действие.', tech: 'Empty, loading, error, offline, success, edge content; матрица «экран × состояние».' },
      { term: 'Скелетон', simple: 'Серые плашки на месте содержимого, пока оно грузится.', tech: 'Skeleton screen — индикатор загрузки, повторяющий структуру будущего контента.' },
      { term: 'Deep link', simple: 'Ссылка, которая открывает нужный экран приложения сразу, например из push.', tech: 'Глубокая ссылка на конкретный экран с параметрами (id заказ-наряда); нужен сценарий для неавторизованного пользователя.' }
    ],
    outro: 'Макеты Ники теперь проверены как требования: правила BR-1, BR-2, BR-5 видны на экране, у «Моих записей» есть все шесть состояний, у полей — спецификация с проверками и источниками, у экрана согласования — связь с моделью данных. Ника получила комментарий, который можно закрывать по пунктам, а Лиза — готовый тест-план. В понедельник поднимемся уровнем выше: нарисуем в BPMN процесс записи «как есть» — с колл-центром, стойкой и всеми, кто в нём участвует.',
    tasks: [howFigma, howSpec, howStates, taskReview, taskFields, taskStates, taskApi, taskComment]
  });
})();
