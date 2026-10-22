/* Модуль 2, занятие 3: нефункциональные требования.
   Теория: how-iso — восемь характеристик качества ISO/IEC 25010 на «Искре» и на кофейне у дома, отличие ФТ от НФТ;
   how-measure — из «быстро» в число по шагам (метрика, порог, перцентиль, нагрузка, условия, проверка), почему не
   среднее (живой график 20 запросов), профиль нагрузки F-peak по часам; how-avail — «девятки» доступности, резервные
   копии и RPO/RTO на примере сбоя в 14:30, персональные данные и 152-ФЗ.
   Практика: НФТ, спрятанные в репликах заказчика (разметка + характеристика); конструктор «быстро → измеримо» с живыми
   вопросами Глеба и Лизы; калькулятор доступности (цена против потерь), бюджет простоя и требования к ПДн; лаборатория
   «нагрузочный тест в понедельник 09:00» (критерий → тест → решение → апрель); ответ Тимуру своими словами. */
'use strict';
(function () {
  const TR = window.TR, ui = TR.ui, esc = TR.esc;
  const ID = 'm2-nfr';

  if (!document.getElementById('mnf-css')) document.head.insertAdjacentHTML('beforeend', `<style id="mnf-css">
    .mnf-root, .mnf-root .stack > * { min-width: 0; }
    .mnf-root .seg button { white-space: normal; text-align: left; }
    .mnf-chars { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 6px; }
    .mnf-ch { text-align: left; border: 1px solid var(--border-strong); border-radius: 10px; padding: 8px 10px; background: var(--surface-2); color: var(--text); display: grid; gap: 2px; min-width: 0; }
    .mnf-ch .n { font: 600 10.5px/1.2 var(--f-mono); color: var(--text-muted); text-transform: uppercase; letter-spacing: .04em; }
    .mnf-ch b { font: 600 13px/1.25 var(--f-brand); hyphens: auto; -webkit-hyphens: auto; overflow-wrap: anywhere; }
    .mnf-ch[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); box-shadow: 0 0 0 1px var(--accent) inset; }
    .mnf-def { display: grid; grid-template-columns: 170px minmax(0, 1fr); gap: 6px 14px; font-size: 14px; }
    .mnf-def > .k { font: 600 11px/1.5 var(--f-mono); letter-spacing: .06em; text-transform: uppercase; color: var(--text-muted); padding-top: 2px; }
    .mnf-def > .v { min-width: 0; }
    .mnf-sent { border: 1px solid var(--border-strong); border-radius: 12px; background: var(--surface); padding: 12px 14px; line-height: 1.8; font-size: 15px; }
    .mnf-sent .p { border-bottom: 2px solid var(--accent); padding: 1px 2px; border-radius: 3px; background: var(--accent-soft); }
    .mnf-sent .p.new { animation: mnfIn .5s ease; }
    .mnf-sent .gap { color: var(--text-muted); border-bottom: 2px dashed var(--border-strong); padding: 0 4px; }
    @keyframes mnfIn { from { background: var(--warn-soft); } to { background: var(--accent-soft); } }
    .mnf-chart { position: relative; height: 170px; display: flex; align-items: flex-end; gap: 3px; padding: 10px 10px 0; border: 1px solid var(--border); border-radius: 12px; background: var(--code-bg); overflow: hidden; }
    .mnf-chart .b { flex: 1 1 0; min-width: 0; border-radius: 4px 4px 0 0; background: color-mix(in srgb, var(--accent) 60%, var(--surface-3)); border: 0; padding: 0; }
    .mnf-chart .b.slow { background: color-mix(in srgb, var(--bad) 70%, var(--surface-3)); }
    .mnf-chart .b.mute { background: var(--border-strong); }
    .mnf-chart .b[aria-pressed="true"] { outline: 2px solid var(--text); }
    .mnf-chart .ln { position: absolute; left: 0; right: 0; border-top: 2px dashed var(--info); pointer-events: none; }
    .mnf-chart .ln span { position: absolute; right: 8px; top: -20px; font: 600 11.5px/1.3 var(--f-mono); color: var(--info); background: var(--code-bg); padding: 0 4px; border-radius: 4px; }
    .mnf-chart .ln.thr { border-top-color: var(--bad); } .mnf-chart .ln.thr span { color: var(--bad); left: 8px; right: auto; }
    .mnf-axis { display: flex; gap: 3px; padding: 4px 10px 0; }
    .mnf-axis span { flex: 1 1 0; min-width: 0; text-align: center; font: 500 10px/1.2 var(--f-mono); color: var(--text-muted); overflow: hidden; }
    .mnf-stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; }
    .mnf-stats .stat .v { font-size: 17px; }
    .mnf-stats.c3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .mnf-rows { display: grid; gap: 10px; }
    .mnf-row { display: grid; grid-template-columns: 150px minmax(0, 1fr); gap: 10px; align-items: start; padding: 10px 12px; border: 1px solid var(--border); border-radius: 12px; background: var(--surface); }
    .mnf-row.ok { border-color: var(--ok); } .mnf-row.bad { border-color: var(--bad); } .mnf-row.warn { border-color: var(--warn); }
    .mnf-row > .k { font: 600 11px/1.4 var(--f-mono); letter-spacing: .05em; text-transform: uppercase; color: var(--text-muted); padding-top: 6px; }
    .mnf-row .why { grid-column: 1 / -1; font-size: 13px; color: var(--text-2); }
    .mnf-opts { display: flex; flex-wrap: wrap; gap: 6px; min-width: 0; }
    .mnf-opt { border: 1px solid var(--border-strong); border-radius: 10px; padding: 6px 10px; background: var(--surface-2); color: var(--text); font-size: 13.5px; line-height: 1.3; text-align: left; max-width: 100%; }
    .mnf-opt:hover:not(:disabled) { border-color: var(--text-muted); }
    .mnf-opt[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); box-shadow: 0 0 0 1px var(--accent) inset; }
    .mnf-opt:disabled { cursor: default; }
    .mnf-voice { display: grid; gap: 6px; }
    .mnf-voice .v { font-size: 13.5px; padding: 7px 10px; border-radius: 9px; border: 1px solid var(--border); background: var(--surface-2); }
    .mnf-voice .v b { color: var(--accent); }
    .mnf-voice .v.done { color: var(--text-muted); border-style: dashed; }
    .mnf-frag { display: inline; border: 0; padding: 1px 2px; margin: 0 1px; border-radius: 4px; background: none; color: inherit; text-align: left; line-height: inherit; font-size: inherit; cursor: pointer; border-bottom: 1px dashed var(--border-strong); box-decoration-break: clone; -webkit-box-decoration-break: clone; }
    .mnf-frag:hover:not(:disabled) { background: var(--surface-3); }
    .mnf-frag[aria-pressed="true"] { background: color-mix(in srgb, var(--warn) 30%, transparent); border-bottom-color: var(--warn); }
    .mnf-frag.ok { background: var(--ok-soft); border-bottom: 2px solid var(--ok); }
    .mnf-frag.bad { background: var(--bad-soft); border-bottom: 2px solid var(--bad); }
    .mnf-frag.warn { background: var(--warn-soft); border-bottom: 2px solid var(--warn); }
    .mnf-frag.miss { border-bottom: 2px dashed var(--info); }
    .mnf-frag:disabled { cursor: default; }
    .mnf-found { display: grid; gap: 6px; }
    .mnf-found .it { display: grid; grid-template-columns: minmax(0, 1fr) 220px; gap: 8px; align-items: center; padding: 7px 10px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface); font-size: 13.5px; }
    .mnf-found .it.ok { border-color: var(--ok); } .mnf-found .it.bad { border-color: var(--bad); } .mnf-found .it.warn { border-color: var(--warn); }
    .mnf-found .it .why { grid-column: 1 / -1; font-size: 12.5px; color: var(--text-2); }
    .mnf-found select { width: 100%; min-width: 0; }
    .mnf-cards { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
    .mnf-card { text-align: left; display: grid; gap: 4px; padding: 10px 12px; border: 1px solid var(--border); border-radius: 12px; background: var(--surface); color: var(--text); min-width: 0; }
    .mnf-card b { font: 600 15px/1.3 var(--f-brand); }
    .mnf-card .s { font-size: 12.5px; color: var(--text-2); }
    .mnf-card[aria-pressed="true"] { border-color: var(--accent); box-shadow: 0 0 0 1px var(--accent) inset; background: var(--accent-soft); }
    .mnf-card.ok { border-color: var(--ok); } .mnf-card.bad { border-color: var(--bad); } .mnf-card.warn { border-color: var(--warn); }
    .mnf-tl { display: grid; gap: 8px; }
    .mnf-ev { display: grid; grid-template-columns: 120px minmax(0, 1fr); gap: 10px; padding: 10px 12px; border-radius: 10px; border: 1px solid var(--border); background: var(--surface); }
    .mnf-ev .d { font: 600 12px/1.35 var(--f-mono); color: var(--text-muted); }
    .mnf-ev.ok { border-color: color-mix(in srgb, var(--ok) 55%, var(--border)); }
    .mnf-ev.bad { border-color: color-mix(in srgb, var(--bad) 55%, var(--border)); background: color-mix(in srgb, var(--bad-soft) 60%, var(--surface)); }
    .mnf-ev.warn { border-color: color-mix(in srgb, var(--warn) 55%, var(--border)); }
    .mnf-bar2 { display: grid; grid-template-columns: 140px minmax(0, 1fr) 90px; gap: 10px; align-items: center; font-size: 13px; }
    .mnf-bar2 .track { height: 12px; border-radius: 4px; background: var(--surface-3); overflow: hidden; }
    .mnf-bar2 .track i { display: block; height: 100%; border-radius: 4px; background: var(--accent); }
    .mnf-bar2 .track i.loss { background: var(--bad); }
    .mnf-bar2 .x { font: 600 12.5px/1 var(--f-mono); text-align: right; }
    .mnf-num { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
    .mnf-num input { width: 120px; }
    @media (max-width: 760px) {
      .mnf-chars { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .mnf-def { grid-template-columns: minmax(0, 1fr); gap: 2px; }
      .mnf-def > .v { margin-bottom: 8px; }
      .mnf-row { grid-template-columns: minmax(0, 1fr); gap: 6px; }
      .mnf-row > .k { padding-top: 0; }
      .mnf-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .mnf-cards { grid-template-columns: minmax(0, 1fr); }
      .mnf-found .it { grid-template-columns: minmax(0, 1fr); }
      .mnf-bar2 { grid-template-columns: minmax(0, 1fr) 80px; }
      .mnf-bar2 .track { grid-column: 1 / -1; grid-row: 2; }
    }
    @media (max-width: 460px) {
      .mnf-ev { grid-template-columns: minmax(0, 1fr); gap: 2px; }
      .mnf-stats.c3 { grid-template-columns: minmax(0, 1fr); }
      .mnf-axis span { font-size: 8.5px; }
    }
  </style>`);

  // ---------- общие помощники ----------
  const quizRef = cfg => cfg.options.map((o, i) => o.ok ? i : -1).filter(i => i >= 0);
  const num = (x, d) => (Math.round(x * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d).replace('.', ',');
  const rub = n => Math.round(n).toLocaleString('ru-RU').replace(/\s/g, ' ') + ' ₽';
  const fmtH = h => {
    const m = Math.round(h * 60);
    if (m < 60) return m + ' мин';
    const hh = Math.floor(m / 60), mm = m % 60;
    return hh + ' ч' + (mm ? ' ' + mm + ' мин' : '');
  };
  const pctl = (arr, p) => { const s = arr.slice().sort((a, b) => a - b); return s[Math.max(0, Math.ceil(p * s.length) - 1)]; };
  const avg = arr => arr.reduce((s, x) => s + x, 0) / arr.length;
  const median = arr => { const s = arr.slice().sort((a, b) => a - b), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };

  // =====================================================================
  // Характеристики качества ISO/IEC 25010
  // =====================================================================
  const CHARS = [
    { id: 'func', t: 'Функциональная пригодность', en: 'Functional suitability',
      plain: 'Делает ли система то, что нужно, и делает ли это правильно.',
      sub: 'полнота, корректность, уместность функций',
      iskra: 'Бонусы считаются до рубля: 5 % только от работ, не от запчастей (BR-11). Обычно это уже функциональные требования — в НФТ сюда попадает разве что точность расчётов.',
      check: 'Функциональные тесты по критериям приёмки.',
      cafe: 'Кофейня варит именно то, что в меню, и капучино — это капучино, а не латте.' },
    { id: 'perf', t: 'Производительность', en: 'Performance efficiency',
      plain: 'Насколько быстро система отвечает и сколько людей выдерживает одновременно.',
      sub: 'время ответа, использование ресурсов, ёмкость',
      iskra: 'Поиск свободных слотов — не дольше 1 секунды для 95 % запросов при 1 500 одновременных пользователях (понедельник, 09:00). Push о готовности — не позже 1 минуты после смены статуса.',
      check: 'Нагрузочный тест с профилем нагрузки, мониторинг в проде.',
      cafe: 'В утренний пик бариста отдаёт кофе не дольше чем за 4 минуты, даже когда в очереди 15 человек.' },
    { id: 'compat', t: 'Совместимость', en: 'Compatibility',
      plain: 'Умеет ли система обмениваться данными с соседями и уживаться с ними.',
      sub: 'взаимодействие, сосуществование',
      iskra: 'Остатки запчастей приходят из 1С не реже чем раз в 15 минут (BR-12); статусы платежей — из ЮKassa вебхуками; АРМ работает на том же компьютере, где открыта 1С, и не мешает ей.',
      check: 'Интеграционные тесты на тестовых контурах 1С и ЮKassa.',
      cafe: 'Новая кофемашина работает с тем же фильтром для воды и той же кассой.' },
    { id: 'usab', t: 'Удобство использования', en: 'Usability (в версии 2023 — Interaction capability)',
      plain: 'Легко ли человеку понять систему, научиться и не ошибиться.',
      sub: 'понятность, обучаемость, управляемость, защита от ошибок, доступность для людей с особыми потребностями',
      iskra: 'Новый мастер-приёмщик оформляет заказ-наряд самостоятельно после одной смены обучения; кнопки на планшете механика — не меньше 15 мм, чтобы попадать в перчатке.',
      check: 'Юзабилити-тест: 5 человек, задание, время и число ошибок.',
      cafe: 'Меню читается за 10 секунд, а новый бариста выходит на смену после одного дня стажировки.' },
    { id: 'rel', t: 'Надёжность', en: 'Reliability',
      plain: 'Работает ли система, когда она нужна, и как быстро встаёт после сбоя.',
      sub: 'зрелость, доступность, отказоустойчивость, восстанавливаемость',
      iskra: 'Доступность онлайн-записи — 99,5 % в часы работы станций (≈ 3,6 ч простоя в месяц). После аварии теряем данные не больше чем за 15 минут и поднимаемся не дольше чем за 1 час.',
      check: 'Мониторинг доступности, учения по восстановлению из резервной копии.',
      cafe: 'Кофейня открыта по расписанию; сломалась кофемашина — через 20 минут работает запасная.' },
    { id: 'sec', t: 'Защищённость', en: 'Security',
      plain: 'Видят и меняют данные только те, кому можно, и всегда понятно, кто что сделал.',
      sub: 'конфиденциальность, целостность, неотказуемость, подотчётность, подлинность',
      iskra: 'Персональные данные клиентов хранятся на серверах в России (152-ФЗ, BR-15); мастер видит клиентов своей станции; каждое изменение суммы в заказ-наряде попадает в журнал: кто, когда, что было и что стало.',
      check: 'Проверка ролей и прав, тест на проникновение, аудит журнала.',
      cafe: 'Ключ от кассы — только у старшего; каждый возврат денег записан с фамилией.' },
    { id: 'maint', t: 'Сопровождаемость', en: 'Maintainability',
      plain: 'Легко ли систему менять, чинить и проверять.',
      sub: 'модульность, повторное использование, анализируемость, изменяемость, тестируемость',
      iskra: 'Новую услугу (например, шиномонтаж с хранением) администратор добавляет в каталог сам, без релиза; по журналу ошибок Глеб находит причину сбоя за час.',
      check: 'Ревью архитектуры, покрытие автотестами, сценарий «добавить услугу без разработчика».',
      cafe: 'Сезонный напиток добавляется в меню за вечер, без перестройки стойки.' },
    { id: 'port', t: 'Переносимость', en: 'Portability (в версии 2023 — Flexibility)',
      plain: 'На каких устройствах и в каких средах система работает и легко ли её перенести.',
      sub: 'адаптируемость, устанавливаемость, заменяемость',
      iskra: 'Приложение клиента работает на iOS 15+ и Android 9+; АРМ — в Chrome и Яндекс Браузере двух последних версий; планшет механика — на экранах от 8 дюймов.',
      check: 'Тест на матрице устройств и браузеров.',
      cafe: 'Меню и касса работают и в основной точке, и в летнем киоске на набережной.' }
  ];
  const CH = id => CHARS.find(c => c.id === id);

  const howIso = {
    id: 'how-iso', covers: ['hidden'], title: 'Как это работает: характеристики качества по ISO/IEC 25010', free: true, noReset: true,
    simple: {
      icon: '🎛️',
      plain: 'Функциональное требование отвечает на вопрос «что система делает», нефункциональное — «насколько хорошо»: как быстро, как надёжно, как защищённо, как удобно.',
      analogy: 'Две кофейни варят одинаковый капучино (функция та же). Но в одной вы ждёте 3 минуты, касса не ломается, а меню понятно с первого взгляда, а в другой — 15 минут и «терминал не работает». Разница — в нефункциональных требованиях.',
      tech: '<b>Нефункциональное требование</b> (НФТ) описывает атрибут качества системы или ограничение на неё. Модель качества продукта — ISO/IEC 25010 (в России — ГОСТ Р ИСО/МЭК 25010-2015): восемь характеристик и их подхарактеристики. В редакции 2023 года добавлена безопасность для жизни и здоровья (safety), удобство переименовано в «способность к взаимодействию», переносимость — в «гибкость». Вигерс называет НФТ «атрибутами качества» и отдельно выделяет ограничения.'
    },
    lead: ui.brief({
      situation: 'Глеб пересылает письмо Тимура Рашидовича: «Главное — чтобы летало и никогда не падало». «Это требования? — спрашивает он. — Я не знаю, как их запрограммировать». Вера: «Это требования, только пока не записанные. Сначала разберёмся, какие вообще бывают „насколько хорошо“».',
      todo: [
        'Нажимайте характеристики и читайте карточку: что это простыми словами, подхарактеристики, пример НФТ «Искры» и как его проверить.',
        'Переключите пример на «Кофейня у дома» — характеристики те же, меняются только числа.',
        'Откройте блоки ниже: чем НФТ отличается от функционального требования и как об этом спрашивают на собеседовании.'
      ],
      look: 'Восемь характеристик — это чек-лист: пройдитесь по нему на каждом проекте, и вы не забудете спросить о скорости, надёжности или правах доступа.'
    }),
    render(el) {
      el.classList.add('mnf-root');
      let cur = 'perf', ex = 'iskra';
      el.innerHTML = `<div class="stack">
        <div class="row"><span class="small dim">Пример:</span>${ui.seg('ex', [{ v: 'iskra', t: '🔧 «Искра Онлайн»' }, { v: 'cafe', t: '☕ Кофейня у дома' }], ex, 'accent')}</div>
        <div class="mnf-chars" data-ch lang="ru"></div>
        <div data-card></div>
        <details class="more"><summary>Функциональное или нефункциональное? Простой тест</summary><div>
          ${ui.table(['Высказывание', 'Вид', 'Почему'], [
            ['Клиент может отменить запись в приложении', 'Функциональное', 'Что делает система — действие пользователя'],
            ['Отмена записи обрабатывается не дольше 2 секунд для 95 % запросов', 'Нефункциональное (производительность)', 'Насколько быстро делает то же самое действие'],
            ['Мастер видит список записей своей станции на сегодня', 'Функциональное', 'Что показывает'],
            ['Мастер видит записи только своей станции', 'Нефункциональное (защищённость)', 'Ограничение доступа — кто что может видеть'],
            ['Персональные данные хранятся на серверах в России', 'Ограничение (закон 152-ФЗ), записывается рядом с НФТ', 'Не выбор команды, а требование закона']
          ])}
          <p class="small muted">Правило большого пальца: если фразу можно продолжить «…и сделать это <i>быстро / надёжно / безопасно / удобно</i>» — первая часть функциональная, а продолжение — нефункциональное.</p>
        </div></details>
        ${ui.note('warn', 'Типичные ошибки', '<ul class="checks"><li class="bad">НФТ вообще не записали — «это же само собой». Потом в сезон выясняется, что «само собой» никто не делал.</li><li class="bad">Записали прилагательным: «быстро», «удобно», «надёжно». Проверить нельзя — значит, и принять нельзя.</li><li class="bad">Скопировали «99,999 % и 0,1 секунды» из чужого проекта. Каждая девятка и каждая миллисекунда стоят денег.</li></ul>')}
        <details class="more"><summary>Как об этом спрашивают на собеседовании</summary><div>
          <p><b>«Чем функциональные требования отличаются от нефункциональных? Приведите примеры.»</b> Хороший ответ: функциональные — что система делает (записать клиента, отправить push), нефункциональные — с каким качеством (за сколько секунд, при какой нагрузке, с какой доступностью, кто имеет доступ). Назовите модель ISO/IEC 25010 и 3–4 характеристики с числами из своего проекта.</p>
          <p><b>«Как вы выясняете НФТ, если заказчик о них не говорит?»</b> Идти по чек-листу характеристик, спрашивать о пиках нагрузки, цене часа простоя, законах (152-ФЗ, 54-ФЗ), устройствах пользователей; смотреть на похожие системы и на прошлые аварии.</p>
        </div></details>
      </div>`;
      function draw() {
        TR.$('[data-ch]', el).innerHTML = CHARS.map((c, i) => `<button type="button" class="mnf-ch" data-c="${c.id}" aria-pressed="${c.id === cur}"><span class="n">${i + 1}</span><b>${esc(c.t)}</b></button>`).join('');
        const c = CH(cur);
        TR.$('[data-card]', el).innerHTML = `<div class="card flat"><h4>${esc(c.t)} <span class="small dim">· ${esc(c.en)}</span></h4><div class="mnf-def">
          <span class="k">Простыми словами</span><div class="v">${c.plain}</div>
          <span class="k">Подхарактеристики</span><div class="v">${c.sub}</div>
          <span class="k">${ex === 'iskra' ? 'НФТ «Искры»' : 'В кофейне'}</span><div class="v">${ex === 'iskra' ? c.iskra : c.cafe}</div>
          <span class="k">Как проверить</span><div class="v">${ex === 'iskra' ? c.check : 'Секундомер в утренний пик, журнал поломок, тайный покупатель.'}</div>
        </div></div>`;
      }
      ui.onSeg(el, (n, v) => { if (n === 'ex') { ex = v; draw(); } });
      TR.on(el, 'click', '[data-c]', (e, b) => { cur = b.dataset.c; draw(); });
      draw();
    }
  };

  // =====================================================================
  // Теория 2. Из «быстро» в число, перцентили, профиль нагрузки
  // =====================================================================
  const STEPS = [
    { who: 'gleb', q: '«Быстро» — это что именно? Открытие приложения, поиск, оплата?', part: 'время ответа сервера на запрос поиска свободных слотов', k: 'Метрика', why: 'Называем, <b>что</b> измеряем и откуда до куда. «Скорость приложения» — не метрика: в ней десятки разных действий.' },
    { who: 'gleb', q: 'Хорошо, поиск. Сколько секунд — это «быстро»?', part: 'не более 1 секунды', k: 'Порог', why: 'Число и единица. Секунда — граница, после которой человек замечает ожидание и начинает нажимать повторно (Якоб Нильсен, «Время отклика»).' },
    { who: 'liza', q: 'А если 99 запросов за 0,3 секунды, а один — за 10? Требование выполнено?', part: 'для 95 % запросов', k: 'Перцентиль', why: '95-й перцентиль (p95): 95 из 100 запросов укладываются в порог. Среднее прячет медленный «хвост», а 100 % недостижимы — один сетевой сбой, и требование нарушено.' },
    { who: 'gleb', q: 'При одном пользователе у меня и сейчас 0,2 секунды. При скольких?', part: 'при 1 500 одновременных пользователях', k: 'Нагрузка', why: 'Берём пик, а не среднее за день: понедельник, 09:00, открытие записи на неделю в сезон (F-peak).' },
    { who: 'liza', q: 'Где меряем? На моём ноутбуке с вайфаем из кафе будет одно, на сервере — другое.', part: 'время измеряется на сервере от получения запроса до отправки ответа, поиск по 7 станциям на 30 дней вперёд', k: 'Условия', why: 'Фиксируем точку измерения и объём данных: 30 дней вперёд — это BR-2, 7 станций и 38 постов — реальный масштаб.' },
    { who: 'liza', q: 'И как я это проверю до апреля?', part: 'проверяется нагрузочным тестом с профилем «понедельник, 09:00» перед каждым релизом', k: 'Проверка', why: 'Способ проверки — часть требования. Без него Лиза не сможет сказать «принято».' }
  ];
  const DATA_PC = {
    tue: { t: 'Вторник, 15:00', v: [0.21, 0.24, 0.26, 0.28, 0.3, 0.31, 0.33, 0.35, 0.36, 0.38, 0.4, 0.42, 0.45, 0.48, 0.52, 0.55, 0.61, 0.74, 0.92, 4.8] },
    mon: { t: 'Понедельник, 09:00', v: [0.25, 0.28, 0.3, 0.33, 0.35, 0.38, 0.4, 0.42, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.8, 0.9, 1.6, 2.4, 3.1, 3.9] }
  };
  const HOURS = ['08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];
  const PROFILE = {
    nov: { t: 'Ноябрь, обычный понедельник', v: [120, 450, 300, 220, 200, 230, 210, 190, 200, 260, 240, 160, 80] },
    apr: { t: 'Апрель, сезон переобувки', v: [300, 1500, 900, 650, 560, 600, 560, 520, 540, 700, 640, 420, 200] }
  };
  const howMeasure = {
    id: 'how-measure', covers: ['measure'], title: 'Как это работает: из «быстро» в измеримое требование', free: true, noReset: true,
    simple: {
      icon: '📏',
      plain: 'Измеримое НФТ отвечает на шесть вопросов: что меряем, какой порог, для какой доли запросов, при какой нагрузке, в каких условиях и как проверим.',
      analogy: '«Доставка быстрая» — ни о чём. «Доставим 95 % заказов в пределах МКАД за 60 минут с момента оплаты, даже в пятницу вечером» — это можно проверить и предъявить.',
      tech: 'Структура измеримого атрибута качества по Вигерсу («Разработка требований», гл. 14): метрика, шкала, порог, условия. Перцентиль (p95, p99) — значение, ниже которого лежит заданная доля измерений. Профиль нагрузки — распределение пользователей и операций во времени; по нему строят нагрузочный тест.'
    },
    lead: ui.brief({
      situation: 'Глеб и Лиза садятся рядом: «Давай прямо сейчас превратим „чтобы летало“ во что-нибудь, что я смогу запрограммировать, а Лиза — проверить».',
      todo: [
        'Вкладка «Шесть вопросов»: нажимайте «Следующий вопрос» — каждый вопрос Глеба или Лизы добавляет в требование одну часть.',
        'Вкладка «Почему не среднее»: переключите день и способ подсчёта — посмотрите, что прячет среднее.',
        'Вкладка «Профиль нагрузки»: сравните ноябрь и апрель и нажмите на столбик 09:00.'
      ],
      look: 'Среднее время отвечает на вопрос «как в среднем», а клиенту важно «как у меня». Поэтому в НФТ пишут перцентиль.'
    }),
    render(el) {
      el.classList.add('mnf-root');
      const tabs = document.createElement('div'); el.appendChild(tabs);
      ui.tabs(tabs, [
        { id: 'steps', t: 'Шесть вопросов', render: renderSteps },
        { id: 'pc', t: 'Почему не среднее', render: renderPc },
        { id: 'prof', t: 'Профиль нагрузки', render: renderProf }
      ]);
      el.insertAdjacentHTML('beforeend', `<div class="stack" style="margin-top:14px">
        ${ui.note('warn', 'Типичные ошибки', '<ul class="checks"><li class="bad">«Среднее время ответа 1 секунда» — пятая часть клиентов может ждать по 3 секунды, а среднее всё равно «зелёное».</li><li class="bad">Нагрузка «600 записей в день» вместо «1 500 одновременно в 09:00»: суточное число ничего не говорит о пике.</li><li class="bad">«100 % запросов» — недостижимо и непроверяемо. Пишут 95 % или 99 % и отдельно — долю ошибок.</li></ul>')}
        <details class="more"><summary>Как об этом спрашивают на собеседовании</summary><div>
          <p><b>«Что такое p95 и почему не среднее?»</b> p95 — время, в которое укладываются 95 % запросов. Среднее размывается быстрыми запросами и не показывает хвост, а именно в хвосте — недовольные клиенты. Для критичных операций добавляют p99.</p>
          <p><b>«Как вы сформулируете требование к скорости?»</b> По шаблону: операция → порог → перцентиль → нагрузка → условия измерения → способ проверки. Пример: «Поиск свободных слотов — не более 1 с для 95 % запросов при 1 500 одновременных пользователях; меряем на сервере; проверяем нагрузочным тестом перед релизом».</p>
        </div></details></div>`);

      function renderSteps(box) {
        let n = 0;
        function draw() {
          const parts = STEPS.map((s, i) => i < n ? `<span class="p ${i === n - 1 ? 'new' : ''}">${esc(s.part)}</span>` : `<span class="gap">${esc(s.k.toLowerCase())}?</span>`);
          box.innerHTML = `<div class="stack">
            <div class="mnf-sent"><span class="small dim">${n === 0 ? 'Было: «Система должна быстро искать свободное время». Стало:' : 'Требование:'}</span><br>НФТ-01. <b>Поиск свободных слотов:</b> ${parts[0]}, ${parts[1]}, ${parts[2]}, ${parts[3]}; ${parts[4]}. ${parts[5]}.</div>
            ${n < STEPS.length ? ui.say(STEPS[n].who, STEPS[n].q) : ui.say('vera', 'Вот теперь это требование. Глеб знает, что строить, Лиза — что проверять, а Тимур Рашидович — за что платит. Одно «летало» превратилось в шесть конкретных частей.')}
            ${n > 0 ? `<div class="card flat"><div class="eyebrow">${esc(STEPS[n - 1].k)}</div><div class="small">${STEPS[n - 1].why}</div></div>` : ''}
            <div class="row">${n < STEPS.length ? `<button type="button" class="btn primary" data-next>Следующий вопрос (${n + 1} из ${STEPS.length})</button>` : ''}${n > 0 ? '<button type="button" class="btn sm" data-reset>Сначала</button>' : ''}</div>
          </div>`;
        }
        TR.on(box, 'click', '[data-next]', () => { n = Math.min(STEPS.length, n + 1); draw(); });
        TR.on(box, 'click', '[data-reset]', () => { n = 0; draw(); });
        draw();
      }
      function renderPc(box) {
        let day = 'mon', mode = 'avg';
        box.innerHTML = `<div class="stack">
          <div class="row"><span class="small dim">День:</span>${ui.seg('day', [{ v: 'tue', t: DATA_PC.tue.t }, { v: 'mon', t: DATA_PC.mon.t }], day)}</div>
          <div class="row"><span class="small dim">Считаем:</span>${ui.seg('mode', [{ v: 'avg', t: 'среднее' }, { v: 'med', t: 'медиана' }, { v: 'p95', t: '95-й перцентиль' }, { v: 'max', t: 'максимум' }], mode, 'accent')}</div>
          <div data-ch></div><div data-txt></div></div>`;
        function draw() {
          const v = DATA_PC[day].v, top = 5;
          const val = mode === 'avg' ? avg(v) : mode === 'med' ? median(v) : mode === 'p95' ? pctl(v, 0.95) : Math.max.apply(null, v);
          const slow = v.filter(x => x > 1).length;
          TR.$('[data-ch]', box).innerHTML = `<div class="mnf-chart" role="img" aria-label="20 запросов, время ответа в секундах">
            ${v.map(x => `<span class="b ${x > 1 ? 'slow' : ''}" style="height:${Math.min(100, x / top * 100)}%" title="${num(x, 2)} с"></span>`).join('')}
            <div class="ln thr" style="bottom:${1 / top * 100}%"><span>порог 1 с</span></div>
            <div class="ln" style="bottom:${Math.min(96, val / top * 100)}%"><span>${num(val, 2)} с</span></div>
          </div><div class="small dim" style="margin-top:4px">20 запросов поиска слотов, отсортированы по времени. Высота столбика — секунды (шкала до 5 с).</div>`;
          const txt = {
            avg: `Среднее — <b>${num(val, 2)} с</b>. ${val <= 1 ? 'Формально «не больше секунды», и отчёт зелёный.' : ''} ${slow ? `Но ${slow} из 20 человек ждали дольше секунды — в отчёте их не видно.` : ''}`,
            med: `Медиана — <b>${num(val, 2)} с</b>: половина запросов быстрее. Про вторую половину — ничего. Медиана годится, чтобы понять «обычный» опыт, но не для порога.`,
            p95: `95-й перцентиль — <b>${num(val, 2)} с</b>: 19 из 20 запросов уложились в это время. ${val > 1 ? 'Порог 1 с нарушен — тест красный, и это честно: каждый пятый клиент ждёт заметно.' : 'Порог 1 с выполнен: хвост из одного запроса допустим — так и задумано.'}`,
            max: `Максимум — <b>${num(val, 2)} с</b>. Один случайный сбой сети — и «максимум не больше секунды» нарушен. Поэтому 100 % в требования не пишут, а редкие сбои меряют отдельно — долей ошибок.`
          }[mode];
          TR.$('[data-txt]', box).innerHTML = `<div class="card flat small">${txt}${day === 'mon' && mode === 'avg' ? '<br><br><b>Вывод:</b> в понедельник среднее 0,94 с «проходит», а 95-й перцентиль — 3,1 с. Требование со средним приняло бы систему, которую клиенты будут ругать.' : ''}</div>`;
        }
        ui.onSeg(box, (n, val) => { if (n === 'day') day = val; if (n === 'mode') mode = val; draw(); });
        draw();
      }
      function renderProf(box) {
        let p = 'apr', sel = 1;
        box.innerHTML = `<div class="stack">
          <div class="row"><span class="small dim">Период:</span>${ui.seg('pr', [{ v: 'nov', t: PROFILE.nov.t }, { v: 'apr', t: PROFILE.apr.t }], p, 'accent')}</div>
          <div data-ch></div><div data-txt></div>
          ${ui.table(['Что делают в пик', 'Доля', 'Почему важно'], [
            ['Ищут свободные слоты, листают дни', '≈ 70 %', 'Самая частая и тяжёлая операция — под неё и пишем НФТ-01'],
            ['Записываются (создают запись)', '≈ 20 %', 'Конкурируют за один слот: двое не должны записаться на один пост'],
            ['Смотрят статус, отменяют, переносят', '≈ 10 %', 'Лёгкие операции, но тоже в общем потоке']
          ])}
          <p class="small muted">Профиль нагрузки — это не одно число, а ответ на вопросы: <b>кто</b>, <b>когда</b>, <b>сколько одновременно</b> и <b>что делают</b>. Источник — Кирилл (маркетинг, F-peak) и статистика колл-центра: в 9–11 теряется 21 % звонков.</p>
        </div>`;
        function draw() {
          const v = PROFILE[p].v, top = 1600;
          TR.$('[data-ch]', box).innerHTML = `<div class="mnf-chart" style="height:150px">${v.map((x, i) => `<button type="button" class="b ${x >= 1000 ? 'slow' : ''}" style="height:${x / top * 100}%" data-h="${i}" aria-pressed="${i === sel}" aria-label="${HOURS[i]}:00 — ${x} пользователей"></button>`).join('')}</div>
            <div class="mnf-axis">${HOURS.map(h => `<span>${h}</span>`).join('')}</div>`;
          const x = v[sel], daySum = PROFILE[p].v.reduce((s, y) => s + y, 0);
          TR.$('[data-txt]', box).innerHTML = `<div class="mnf-stats c3">
            <div class="stat"><span class="k">${HOURS[sel]}:00–${HOURS[sel]}:59</span><span class="v">${x}</span><span class="s">одновременно в пике часа</span></div>
            <div class="stat"><span class="k">Среднее по дню</span><span class="v">${Math.round(daySum / v.length)}</span><span class="s">одновременно</span></div>
            <div class="stat"><span class="k">Запросов в секунду</span><span class="v">≈ ${Math.round(x / 10)}</span><span class="s">если каждый жмёт раз в 10 с</span></div>
          </div><p class="small">${p === 'apr' && sel === 1 ? 'Вот он — понедельник, 09:00 в сезон: открылась запись на неделю, <b>1 500 человек одновременно</b>. Среднее по дню в несколько раз меньше. Если написать НФТ под среднее, система упадёт ровно тогда, когда нужна больше всего.' : p === 'nov' ? 'В ноябре пик в 09:00 — около 450 человек. Тест под ноябрьскую нагрузку пройдёт, а в апреле нагрузка вырастет в 3–4 раза (F-deadline, F-peak).' : 'Нажмите столбик 09:00 — там пик.'}</p>`;
        }
        ui.onSeg(box, (n, val) => { if (n === 'pr') { p = val; draw(); } });
        TR.on(box, 'click', '[data-h]', (e, b) => { sel = +b.dataset.h; draw(); });
        draw();
      }
    }
  };

  // =====================================================================
  // Теория 3. Доступность, резервные копии, персональные данные
  // =====================================================================
  const NINES = [
    { v: '99', a: 0.99, cost: 45000, how: 'Один сервер, резервная копия раз в сутки, чиним в рабочее время.' },
    { v: '99.5', a: 0.995, cost: 70000, how: 'Два сервера приложений, база с репликой, мониторинг и дежурный по тревоге в часы работы станций.' },
    { v: '99.9', a: 0.999, cost: 160000, how: 'Две площадки (дата-центра), автоматическое переключение, дежурство 24/7.' },
    { v: '99.99', a: 0.9999, cost: 450000, how: 'Несколько площадок в разных городах, отдельная команда эксплуатации 24/7, регулярные учения по отказам.' }
  ];
  const NV = v => NINES.find(n => n.v === v);
  const nineT = v => v.replace('.', ',') + ' %';
  const BACKUP = {
    day: { t: 'раз в сутки, в 03:00', rpo: 'до 24 ч', lost: 'все записи и заказ-наряды с 03:00 до 14:30 — в сезон около 1 500 записей и 150 открытых заказ-нарядов', k: 'bad' },
    hour: { t: 'каждый час', rpo: 'до 1 ч', lost: 'всё с 14:00 до 14:30 — около 110 записей; мастерам придётся восстанавливать заказ-наряды по бумажным актам', k: 'warn' },
    stream: { t: 'непрерывно (реплика базы + журнал изменений)', rpo: 'секунды', lost: 'практически ничего: последние секунды, повторит сам клиент', k: 'ok' }
  };
  const RESTORE = {
    manual: { t: 'восстановить из копии вручную', rto: 4, d: 'Глеб поднимает новый сервер и разворачивает копию — около 4 часов.' },
    standby: { t: 'резервный сервер наготове', rto: 0.5, d: 'Переключаемся на заранее подготовленный сервер — около 30 минут.' },
    auto: { t: 'автоматическое переключение', rto: 0.05, d: 'Система сама переключается на реплику — 2–5 минут.' }
  };
  const PD = [
    { id: 'loc', t: 'Хранение в России', req: 'Персональные данные граждан РФ записываются, хранятся и обрабатываются в базах данных на территории России.', why: '152-ФЗ «О персональных данных», ст. 18 ч. 5 (локализация). У «Искры» это BR-15: ФИО, телефон, email, госномер, VIN.', test: 'Лиза проверяет по документам хостинга и схеме развёртывания: где стоят база, реплика и резервные копии.' },
    { id: 'consent', t: 'Согласие', req: 'При регистрации клиент даёт согласие на обработку ПДн; храним дату, время и версию текста согласия.', why: 'Без согласия обработка незаконна (152-ФЗ, ст. 6, 9). Версия текста нужна, когда текст поменяется.', test: 'Регистрация без галочки невозможна; в базе у клиента есть дата и версия согласия.' },
    { id: 'roles', t: 'Доступ по ролям', req: 'Мастер-приёмщик видит клиентов своей станции; механик — машину и список работ без телефона клиента; бухгалтер — платежи без истории визитов.', why: 'Принцип минимально необходимого доступа. Механику телефон не нужен: предложение доп. работ клиенту формирует мастер (BR-7).', test: 'Тест-кейсы на каждую роль: «механик открывает карточку — телефона нет».' },
    { id: 'audit', t: 'Журнал действий', req: 'Изменения сумм, статусов и ПДн записываются в журнал: кто, когда, что было, что стало. Журнал нельзя редактировать.', why: 'Подотчётность (ISO/IEC 25010): Ольга Викторовна при сверке должна видеть, кто изменил сумму заказ-наряда.', test: 'Изменить сумму под мастером — в журнале появилась строка с его именем и старым значением.' },
    { id: 'tls', t: 'Шифрование при передаче', req: 'Все обмены приложения, АРМ и планшета с сервером — только по HTTPS (TLS 1.2 и выше).', why: 'Данные идут через публичный интернет и вайфай станций.', test: 'Запрос по http:// не обслуживается; сканер проверяет версию TLS.' },
    { id: 'delete', t: 'Удаление аккаунта', req: 'При удалении аккаунта ПДн клиента обезличиваются, а заказ-наряды и платежи хранятся 5 лет.', why: 'Право клиента на удаление (152-ФЗ, ст. 21) не отменяет сроков хранения бухгалтерских документов (BR-16, F-retention).', test: 'Удалить аккаунт — в заказ-нарядах вместо ФИО «Клиент удалён», суммы на месте.' }
  ];
  const howAvail = {
    id: 'how-avail', covers: ['avail'], title: 'Как это работает: доступность, резервные копии и персональные данные', free: true, noReset: true,
    simple: {
      icon: '🛡️',
      plain: 'Доступность — доля времени, когда система работает. 99,5 % звучит как «почти всегда», но это 3,6 часа простоя в месяц. Каждая следующая девятка уменьшает простой в 10 раз, а стоит в разы дороже.',
      analogy: 'Аптека «24 часа» и аптека «до 21:00» продают одно и то же. Первой нужны три смены, охрана и запасной генератор. Вопрос не «можно ли круглосуточно», а «окупится ли».',
      tech: '<b>Доступность</b> = время работы / (время работы + простой). <b>RPO</b> (Recovery Point Objective) — сколько данных можно потерять при аварии (за какой период). <b>RTO</b> (Recovery Time Objective) — за сколько времени нужно восстановиться. <b>SLA</b> (Service Level Agreement) — договорённость об уровне сервиса с последствиями за нарушение. Персональные данные — 152-ФЗ «О персональных данных».'
    },
    lead: ui.brief({
      situation: 'Тимур Рашидович в письме: «и никогда не падало». Глеб считает на калькуляторе и мрачнеет: «„Никогда“ стоит как ещё одна станция». Вера: «Давайте посмотрим, сколько стоит каждая девятка и что „Искре“ на самом деле нужно».',
      todo: [
        'Вкладка «Девятки»: переключайте уровень доступности и смотрите простой в месяц, год и как это устроено.',
        'Вкладка «Резервные копии»: выберите частоту копий и способ восстановления — посмотрите, что будет при сбое в 14:30.',
        'Вкладка «Персональные данные»: нажимайте карточки — требование, откуда оно и как его проверит Лиза.'
      ],
      look: 'Бюджет простоя считают от календарного месяца: (1 − доступность) × 720 ч. Плановые работы — ночью, когда станции закрыты, и в бюджет они не входят.'
    }),
    render(el) {
      el.classList.add('mnf-root');
      const tabs = document.createElement('div'); el.appendChild(tabs);
      ui.tabs(tabs, [
        { id: 'nines', t: 'Девятки', render: renderNines },
        { id: 'backup', t: 'Резервные копии', render: renderBackup },
        { id: 'pd', t: 'Персональные данные', render: renderPd }
      ]);
      el.insertAdjacentHTML('beforeend', `<div class="stack" style="margin-top:14px">${ui.note('warn', 'Типичные ошибки', '<ul class="checks"><li class="bad">«Доступность 100 %» — не бывает. Даже у банков есть окна работ и аварии.</li><li class="bad">Доступность без периода и окна измерения: «99,5 %» за год и за месяц — разные обещания.</li><li class="bad">Резервные копии есть, но их ни разу не восстанавливали. Копия, которую не проверяли, — не копия.</li><li class="bad">«Удалить все данные по запросу клиента» — а как же 5 лет хранения заказ-нарядов и платежей?</li></ul>')}
        <details class="more"><summary>Как об этом спрашивают на собеседовании</summary><div>
          <p><b>«Что такое RPO и RTO?»</b> RPO — сколько данных можно потерять (точка, к которой восстанавливаемся), RTO — как быстро нужно восстановиться. Пример: RPO 15 минут, RTO 1 час.</p>
          <p><b>«Сколько простоя в месяц допускает 99,9 %?»</b> Около 43 минут (0,1 % × 720 ч). 99,5 % — около 3,6 часа, 99 % — около 7,2 часа.</p>
          <p><b>«Какие требования вы запишете к персональным данным?»</b> Согласие, локализация в РФ, роли и минимальный доступ, журнал действий, шифрование при передаче, сроки хранения и удаление или обезличивание.</p>
        </div></details></div>`);

      function renderNines(box) {
        let cur = '99.5';
        box.innerHTML = `<div class="stack"><div class="row"><span class="small dim">Доступность:</span>${ui.seg('n', NINES.map(n => ({ v: n.v, t: nineT(n.v) })), cur, 'accent')}</div><div data-o></div></div>`;
        function draw() {
          const n = NV(cur), dm = (1 - n.a) * 720, dy = (1 - n.a) * 8760, dw = (1 - n.a) * 168;
          TR.$('[data-o]', box).innerHTML = `<div class="stack">
            <div class="mnf-stats">
              <div class="stat"><span class="k">Простой в неделю</span><span class="v">${fmtH(dw)}</span></div>
              <div class="stat"><span class="k">Простой в месяц</span><span class="v">${fmtH(dm)}</span><span class="s">${num(1 - n.a, 4).replace(/0+$/, '')} × 720 ч</span></div>
              <div class="stat"><span class="k">Простой в год</span><span class="v">${fmtH(dy)}</span></div>
              <div class="stat"><span class="k">Инфраструктура</span><span class="v">${rub(n.cost)}</span><span class="s">в месяц, оценка Глеба</span></div>
            </div>
            <div class="card flat small"><b>Как устроено:</b> ${n.how}<br>${{
              '99': 'Для «Искры» 7 часов простоя в месяц — это почти гарантированно одно утро понедельника в сезон без онлайн-записи. Клиенты вернутся к телефону, а там и так теряется 21 % звонков.',
              '99.5': 'Около 3,6 часа в месяц. Это целевое НФТ «Искры»: доступность онлайн-записи 99,5 % в часы работы станций, плановые работы — ночью.',
              '99.9': 'Около 43 минут в месяц. Красиво, но дежурство 24/7 и вторая площадка — для сети автосервисов, которая ночью закрыта, это переплата.',
              '99.99': 'Около 4 минут в месяц. Уровень банков и платёжных систем. Стоит как маленькая IT-компания.'
            }[cur]}</div>
            <div class="stack tight">${NINES.map(x => `<div class="mnf-bar2"><span>${nineT(x.v)}</span><span class="track"><i style="width:${x.cost / 450000 * 100}%"></i></span><span class="x">${rub(x.cost)}</span></div>`).join('')}</div>
            <p class="small muted">Каждая девятка уменьшает простой в 10 раз, а цена растёт скачком: нужны вторая площадка, дежурства, автоматика. Поэтому цель выбирают от бизнеса: сколько стоит час простоя и когда система нужна.</p>
          </div>`;
        }
        ui.onSeg(box, (k, v) => { if (k === 'n') { cur = v; draw(); } });
        draw();
      }
      function renderBackup(box) {
        let b = 'day', r = 'manual';
        box.innerHTML = `<div class="stack">
          <p class="small">Вторник в сезон, <b>14:30</b>: отказал диск сервера базы данных. Что потеряем и когда снова заработаем?</p>
          <div class="row"><span class="small dim">Копии:</span>${ui.seg('b', Object.keys(BACKUP).map(k => ({ v: k, t: BACKUP[k].t })), b)}</div>
          <div class="row"><span class="small dim">Восстановление:</span>${ui.seg('r', Object.keys(RESTORE).map(k => ({ v: k, t: RESTORE[k].t })), r)}</div>
          <div data-o></div></div>`;
        function draw() {
          const B = BACKUP[b], R = RESTORE[r];
          const kR = R.rto > 3.6 ? 'bad' : R.rto > 1 ? 'warn' : 'ok';
          TR.$('[data-o]', box).innerHTML = `<div class="mnf-tl">
            <div class="mnf-ev ${B.k}"><span class="d">RPO · ${esc(B.rpo)}</span><div class="small"><b>Потеряем:</b> ${B.lost}.</div></div>
            <div class="mnf-ev ${kR}"><span class="d">RTO · ${fmtH(R.rto)}</span><div class="small">${R.d} ${R.rto > 3.6 ? 'Весь месячный бюджет простоя 99,5 % (3,6 ч) съеден одной аварией.' : R.rto > 1 ? 'Укладываемся в месячный бюджет, но на одну аварию.' : 'Укладываемся с запасом.'}</div></div>
          </div>
          <p class="small muted">Целевые значения для «Искры»: <b>RPO ≤ 15 минут, RTO ≤ 1 часа</b> — это реплика базы с журналом изменений и резервный сервер наготове. Раз в квартал — учения: восстановить копию на тестовом сервере и засечь время.</p>`;
        }
        ui.onSeg(box, (k, v) => { if (k === 'b') b = v; if (k === 'r') r = v; draw(); });
        draw();
      }
      function renderPd(box) {
        let cur = 'loc', view = 'req';
        box.innerHTML = `<div class="stack">
          <p class="small">Персональные данные (ПДн) — любая информация, по которой можно определить человека. У «Искры» это <b>ФИО, телефон, email, госномер и VIN</b> (BR-15). Требования к ним задаёт закон 152-ФЗ — это ограничения, а не пожелания.</p>
          <div class="row"><span class="small dim">Показать:</span>${ui.seg('v', [{ v: 'req', t: 'Требование' }, { v: 'why', t: 'Откуда оно' }, { v: 'test', t: 'Как проверит Лиза' }], view, 'accent')}</div>
          <div class="mnf-cards" data-c></div></div>`;
        function draw() {
          TR.$('[data-c]', box).innerHTML = PD.map(p => `<button type="button" class="mnf-card" data-p="${p.id}" aria-pressed="${p.id === cur}"><b>${esc(p.t)}</b>${p.id === cur ? `<span class="small">${p[view]}</span>` : '<span class="s">Нажмите, чтобы открыть</span>'}</button>`).join('');
        }
        ui.onSeg(box, (k, v) => { if (k === 'v') { view = v; draw(); } });
        TR.on(box, 'click', '[data-p]', (e, b) => { cur = b.dataset.p; draw(); });
        draw();
      }
    }
  };

  // =====================================================================
  // Практика 1. НФТ, спрятанные в репликах заказчика
  // =====================================================================
  const NFR_CH = ['perf', 'rel', 'sec', 'usab', 'compat', 'maint', 'port'];
  const REPL = [
    { who: 'timur', parts: ['Мне нужно, чтобы ', { id: 't1', t: 'запись не ложилась, как у конкурентов прошлой весной, когда их сайт полдня не открывался', ch: 'rel', why: 'Доступность — надёжность. Дальше её переводят в «девятки»: 99,5 % в часы работы.' }, '. И ', { id: 't2', t: 'чтобы всё летало, как в такси', ch: 'perf', alt: { usab: 'Ощущение «летает» — это про скорость отклика. Удобство — про понятность и обучаемость.' }, why: 'Скорость отклика — производительность. «Летало» переводим в секунды, перцентиль и нагрузку.' }, '. Ну и ', { id: 't3', t: 'на карте показать все семь станций с адресами', ch: null, why: 'Что показывает система — функциональное требование.' }, '.'] },
    { who: 'marina', parts: ['Мои мастера — не программисты. ', { id: 'm1', t: 'Новенький должен освоить вашу программу за одну смену, без курсов', ch: 'usab', why: 'Обучаемость — подхарактеристика удобства использования.' }, '. И ещё: у стойки интернет иногда пропадает — ', { id: 'm2', t: 'начатый заказ-наряд не должен теряться, если связь моргнула', ch: 'rel', alt: { usab: 'Защита от ошибок пользователя — это удобство, а здесь сбой сети, не ошибка человека. Это отказоустойчивость.' }, why: 'Отказоустойчивость — подхарактеристика надёжности: система переживает сбой связи без потери данных.' }, '. А в конце ', { id: 'm3', t: 'мастер печатает акт приёмки машины', ch: null, why: 'Действие системы — функциональное требование.' }, '.'] },
    { who: 'petrovich', parts: ['Мужики в цеху планшет в чистых руках держать не будут. ', { id: 'p1', t: 'Кнопки такие, чтобы попадать пальцем в перчатке', ch: 'usab', why: 'Удобство использования: управляемость в реальных условиях. В НФТ — размер кнопок не меньше 15 мм.' }, '. Ну и ', { id: 'p2', t: 'механик отмечает, какие работы сделал', ch: null, why: 'Функция планшета.' }, '.'] },
    { who: 'olga', parts: ['По закону ', { id: 'o1', t: 'данные клиентов должны лежать только на серверах в России', ch: 'sec', why: 'Ограничение 152-ФЗ, записывается в группе защищённости и ПДн.' }, '. И мне нужно, чтобы ', { id: 'o2', t: 'было видно, кто и когда поменял сумму в заказ-наряде', ch: 'sec', alt: { maint: 'Журнал для разбора ошибок — это сопровождаемость. А здесь журнал «кто изменил сумму» — подотчётность, это защищённость.' }, why: 'Подотчётность — подхарактеристика защищённости: каждое действие можно приписать конкретному человеку.' }, '. Ну и ', { id: 'o3', t: 'чек уходит клиенту на email или по SMS', ch: null, why: 'Функциональное требование (BR-10).' }, '.'] },
    { who: 'kirill', parts: ['Имейте в виду: ', { id: 'k1', t: 'в понедельник в девять, когда открываем запись на неделю, будет человек полторы тысячи одновременно', ch: 'perf', why: 'Нагрузка — входные данные для НФТ производительности (ёмкость).' }, '. А ещё ', { id: 'k2', t: 'тексты акций и пушей я хочу менять сам, без программистов и нового релиза', ch: 'maint', alt: { usab: 'Удобство касается того, как Кирилл работает с экраном. А «без программистов и релиза» — про изменяемость системы.' }, why: 'Изменяемость — подхарактеристика сопровождаемости: контент меняется настройкой, а не кодом.' }, '.'] },
    { who: 'aliya', parts: ['Главное, ', { id: 'a1', t: 'остатки из 1С должны приезжать не реже чем раз в 15 минут', ch: 'compat', alt: { perf: 'Частота обмена — не скорость ответа системы, а условие взаимодействия с 1С.' }, why: 'Взаимодействие с внешней системой — совместимость (BR-12).' }, ', иначе клиенту зарезервируют фильтр, которого нет.'] },
    { who: 'elena', parts: ['', { id: 'e1', t: 'У меня айфон пятилетней давности — на нём тоже должно работать', ch: 'port', alt: { compat: 'Совместимость — про обмен с другими системами. Работа на старых устройствах и версиях ОС — переносимость (адаптируемость).' }, why: 'Переносимость: на каких версиях iOS и Android работает приложение.' }, '. И ', { id: 'e2', t: 'хочу видеть статус ремонта, не звоня', ch: null, why: 'Функция приложения.' }, '.'] }
  ];
  const FRAGS = []; REPL.forEach(r => r.parts.forEach(p => { if (typeof p === 'object') FRAGS.push(Object.assign({ who: r.who }, p)); }));
  const FR = id => FRAGS.find(f => f.id === id);
  const NFR_FR = FRAGS.filter(f => f.ch);
  function hiddenEval(a) {
    const sel = (a && a.sel) || {};
    const rows = FRAGS.filter(f => f.id in sel).map(f => {
      const got = sel[f.id];
      if (!f.ch) return { f, s: 'bad', pts: 0, why: 'Это функциональное требование: ' + f.why };
      if (got === f.ch) return { f, s: 'ok', pts: 1 };
      if (got && f.alt && f.alt[got]) return { f, s: 'warn', pts: 0.75, why: f.alt[got] };
      return { f, s: got ? 'bad' : 'warn', pts: 0.5, why: got ? `Не «${CH(got).t}». ${f.why}` : 'Нашли, но не выбрали характеристику.' };
    });
    const hits = rows.filter(r => r.f.ch), fp = rows.filter(r => !r.f.ch);
    const score = Math.max(0, Math.min(1, hits.reduce((s, r) => s + r.pts, 0) / NFR_FR.length - 0.08 * fp.length));
    return { rows, hits, fp, missed: NFR_FR.filter(f => !(f.id in sel)), score };
  }
  const hiddenTask = {
    id: 'hidden', title: 'НФТ, спрятанные в репликах заказчика',
    simple: howIso.simple,
    lead: ui.brief({
      situation: 'Вера даёт вам выписку из заметок кик-оффа и интервью: «Заказчики почти никогда не говорят „нефункциональное требование“. Они говорят „чтобы не падало“ и „в перчатках“. Найдите все такие места — это сырьё для нашего раздела НФТ».',
      todo: [
        'Нажимайте на фрагменты реплик, в которых спрятано требование к качеству (скорость, надёжность, защита, удобство, совместимость, сопровождаемость, переносимость).',
        'Для каждого найденного фрагмента выберите характеристику ISO/IEC 25010 в списке под репликами.',
        'Функциональные фрагменты («что делает система») отмечать не нужно — за них снимаются баллы.',
        'Нажмите «Проверить». Засчитывается от 80 %: найдено и верно классифицировано большинство из 11 НФТ.'
      ],
      look: 'Задайте фрагменту вопрос: «Это о том, <i>что</i> делает система, или о том, <i>насколько хорошо</i>?» Нагрузка (сколько людей) — входные данные для производительности.'
    }),
    blank: () => ({ sel: {} }),
    reference: () => ({ sel: Object.fromEntries(NFR_FR.map(f => [f.id, f.ch])) }),
    render(el, ctx) {
      el.classList.add('mnf-root');
      const a = ctx.ans; a.sel = a.sel || {};
      const ev = ctx.result ? hiddenEval(a) : null;
      const st = id => { if (!ev) return ''; const r = ev.rows.find(x => x.f.id === id); if (r) return r.s; return ctx.readonly && FR(id).ch ? 'miss' : ''; };
      el.innerHTML = `<div class="stack"><div class="stack tight" data-r></div><div class="eyebrow">Найденные НФТ и их характеристики</div><div class="mnf-found" data-f></div></div>`;
      function draw() {
        TR.$('[data-r]', el).innerHTML = REPL.map(r => ui.say(r.who, r.parts.map(p => typeof p === 'string' ? esc(p) : `<button type="button" class="mnf-frag ${st(p.id)}" data-fr="${p.id}" aria-pressed="${p.id in a.sel}" ${ctx.readonly ? 'disabled' : ''}>${esc(p.t)}</button>`).join(''))).join('');
        const ids = FRAGS.filter(f => f.id in a.sel).map(f => f.id);
        TR.$('[data-f]', el).innerHTML = ids.length ? ids.map(id => {
          const f = FR(id), r = ev && ev.rows.find(x => x.f.id === id);
          return `<div class="it ${r ? r.s : ''}"><span>«${esc(f.t)}» <span class="small dim">— ${esc(TR.PEOPLE[f.who] ? TR.PEOPLE[f.who].name : f.who)}</span></span>
            <select data-sel="${id}" aria-label="Характеристика для: ${esc(f.t)}" ${ctx.readonly ? 'disabled' : ''}><option value="">Характеристика…</option>${NFR_CH.map(c => `<option value="${c}" ${a.sel[id] === c ? 'selected' : ''}>${esc(CH(c).t)}</option>`).join('')}</select>
            ${r && r.why ? `<div class="why">${r.why}</div>` : ''}</div>`;
        }).join('') : '<div class="small dim">Пока ничего не отмечено. Нажмите на фрагмент реплики.</div>';
      }
      TR.on(el, 'click', '[data-fr]', (e, b) => {
        if (ctx.readonly) return;
        const id = b.dataset.fr;
        if (id in a.sel) delete a.sel[id]; else a.sel[id] = '';
        ctx.save(); draw();
      });
      el.addEventListener('change', e => { const s = e.target.closest('select[data-sel]'); if (!s || ctx.readonly) return; a.sel[s.dataset.sel] = s.value; ctx.save(); });
      draw();
    },
    check(ans) {
      const r = hiddenEval(ans), notes = [];
      const ok = r.rows.filter(x => x.s === 'ok').length;
      notes.push({ ok: r.hits.length >= 9 ? true : r.hits.length >= 6 ? 'warn' : false, html: `Найдено НФТ: ${r.hits.length} из ${NFR_FR.length}, характеристика верна у ${ok}.` });
      if (r.missed.length) notes.push({ ok: 'warn', html: `Не найдено ${r.missed.length}. ${r.missed.some(f => f.id === 'k1') ? 'Подсказка: число пользователей в пик — тоже сырьё для НФТ. ' : ''}${r.missed.some(f => f.id === 'k2' || f.id === 'a1') ? 'Посмотрите на реплики Кирилла и Алии: «без программистов» и «раз в 15 минут» — о качестве, а не о функции.' : ''}` });
      r.fp.forEach(x => notes.push({ ok: false, html: `«${esc(x.f.t)}» — ${x.why}` }));
      r.rows.filter(x => x.f.ch && x.s !== 'ok').forEach(x => notes.push({ ok: x.s === 'warn' ? 'warn' : false, html: `«${esc(x.f.t)}» — ${x.why}` }));
      return {
        ok: r.score >= 0.8, score: r.score, notes,
        summary: `Найдено ${r.hits.length} из ${NFR_FR.length} НФТ, лишних отметок: ${r.fp.length}.`,
        mentor: r.score >= 0.8 ? null : r.fp.length > 1 ? 'Отделяйте «что» от «насколько хорошо». «Механик отмечает работы» — это что. «В перчатках» — насколько удобно.' : 'Ищите прилагательные и обстоятельства: «быстро», «не терялось», «только в России», «сам, без программистов», «на старом телефоне».'
      };
    },
    explain: `<p>В репликах спрятано <b>11 НФТ</b>, и ни одно не названо этим словом:</p>
      <ul class="checks">
        <li><b>Производительность</b>: «чтобы летало» (переведём в секунды и перцентиль) и «полторы тысячи одновременно» (нагрузка).</li>
        <li><b>Надёжность</b>: «не ложилась, как у конкурентов» (доступность) и «заказ-наряд не теряется, если связь моргнула» (отказоустойчивость).</li>
        <li><b>Защищённость</b>: «только на серверах в России» (152-ФЗ) и «кто и когда поменял сумму» (подотчётность).</li>
        <li><b>Удобство</b>: «освоить за смену» (обучаемость), «в перчатке» (управляемость).</li>
        <li><b>Совместимость</b>: остатки из 1С раз в 15 минут. <b>Сопровождаемость</b>: тексты акций без программистов. <b>Переносимость</b>: старый айфон.</li>
      </ul>
      <p>Функциональные фрагменты (карта станций, акт приёмки, отметка работ, чек, статус ремонта) тоже важны, но идут в другой раздел. Найти НФТ — полдела: каждое ещё нужно сделать <b>измеримым</b>, иначе «летало» так и останется спором на приёмке. Это следующее задание. Источник: ISO/IEC 25010; Вигерс, «Разработка требований», гл. 14 «За пределами функциональности».</p>`,
    refNote: 'Засчитываются близкие характеристики там, где граница действительно тонкая (например, «летало» как удобство), — с пониженным баллом.',
    report: ans => {
      const r = hiddenEval(ans);
      return r.rows.map(x => `- «${x.f.t}» → ${x.f.id in ((ans && ans.sel) || {}) && ans.sel[x.f.id] ? CH(ans.sel[x.f.id]).t : '—'} ${x.s === 'ok' ? '✓' : x.s === 'warn' ? '≈' : '✗'}`).join('\n') || '—';
    }
  };

  // =====================================================================
  // Практика 2. Конструктор «быстро → измеримо»
  // =====================================================================
  const MR = [
    { id: 'metric', k: 'Что меряем', opts: [
      { v: 'm1', t: 'время ответа сервера на запрос поиска свободных слотов', s: 'ok' },
      { v: 'm2', t: 'скорость работы приложения', s: 'bad', why: 'Не метрика: в приложении десятки действий. Глеб спросит: «Скорость чего?»' },
      { v: 'm3', t: 'время от открытия приложения до готовой записи', s: 'warn', why: 'Это время сценария, оно зависит от человека: сколько он думает над датой. Хорошая метрика для удобства, но не для скорости сервера.' }
    ], voice: { who: 'gleb', q: 'Что именно должно быть быстрым?' } },
    { id: 'thr', k: 'Порог', opts: [
      { v: '0.2', t: 'не более 0,2 секунды', s: 'warn', why: 'Человек не отличит 0,2 с от 0,8 с, а Глебу придётся строить кэши под каждый запрос. Платим за то, чего никто не заметит.' },
      { v: '1', t: 'не более 1 секунды', s: 'ok' },
      { v: '5', t: 'не более 5 секунд', s: 'bad', why: 'За 5 секунд человек решает, что приложение зависло, и жмёт повторно — нагрузка удваивается.' },
      { v: 'inst', t: 'мгновенно', s: 'bad', why: 'Не число — проверить нельзя.' }
    ], voice: { who: 'gleb', q: 'Сколько секунд — это «быстро»?' } },
    { id: 'pct', k: 'Для какой доли', opts: [
      { v: 'avg', t: 'в среднем', s: 'bad', why: 'Среднее прячет хвост: в понедельник среднее 0,94 с, а каждый пятый ждёт больше 1,5 с.' },
      { v: 'p50', t: 'для половины запросов (медиана)', s: 'bad', why: 'Про вторую половину клиентов требование ничего не говорит.' },
      { v: 'p95', t: 'для 95 % запросов', s: 'ok' },
      { v: 'p100', t: 'для всех запросов без исключения', s: 'warn', why: 'Один сбой сети — и требование нарушено. Недостижимо и дорого; редкие сбои меряют отдельно — долей ошибок.' }
    ], voice: { who: 'liza', q: 'А если один запрос из ста — 10 секунд, это нарушение?' } },
    { id: 'load', k: 'При какой нагрузке', opts: [
      { v: 'one', t: 'при одном пользователе на тестовом стенде', s: 'bad', why: 'При одном пользователе быстро всё. Проблемы начинаются в пик.' },
      { v: 'day', t: 'при обычной нагрузке — 600 записей в день', s: 'bad', why: 'Это число в сутки, а не одновременно, и не сезон. Пик 09:00 в апреле не покрыт.' },
      { v: 'peak', t: 'при 1 500 одновременных пользователях (понедельник, 09:00)', s: 'ok' },
      { v: 'x10', t: 'при 10 000 одновременных пользователях — с запасом', s: 'warn', why: 'Всего клиентов 31 000. Запас почти ×7 к реальному пику — дорогая архитектура ради нагрузки, которой не будет.' }
    ], voice: { who: 'gleb', q: 'При скольких людях одновременно?' } },
    { id: 'cond', k: 'Условия', opts: [
      { v: 'srv', t: 'меряем на сервере, от получения запроса до ответа; поиск по 7 станциям на 30 дней вперёд', s: 'ok' },
      { v: 'dev', t: 'меряем на компьютере разработчика', s: 'bad', why: 'На компьютере Глеба нет ни реальных данных, ни реальной нагрузки.' },
      { v: 'net', t: 'при хорошем интернете у клиента', s: 'warn', why: 'Что такое «хороший» — не определено, и сеть клиента мы не контролируем. Точку измерения лучше зафиксировать на сервере.' }
    ], voice: { who: 'liza', q: 'Где и на каких данных меряем?' } },
    { id: 'ver', k: 'Как проверим', opts: [
      { v: 'load', t: 'нагрузочный тест с профилем «понедельник, 09:00» перед каждым релизом', s: 'ok' },
      { v: 'hand', t: 'Лиза проверит вручную секундомером', s: 'bad', why: 'Один человек с секундомером не создаст нагрузку 1 500 пользователей.' },
      { v: 'rev', t: 'по отзывам клиентов после запуска', s: 'bad', why: 'Поздно: узнаем в апреле, когда клиенты уже ушли. И отзывы — не измерение.' }
    ], voice: { who: 'liza', q: 'Как я это проверю до сезона?' } }
  ];
  const MREF = { metric: 'm1', thr: '1', pct: 'p95', load: 'peak', cond: 'srv', ver: 'load' };
  function measureEval(a) {
    const pick = (a && a.pick) || {};
    const rows = MR.map(r => { const o = r.opts.find(x => x.v === pick[r.id]); return { r, o, s: o ? o.s : 'none', pts: o ? (o.s === 'ok' ? 1 : o.s === 'warn' ? 0.5 : 0) : 0 }; });
    const score = rows.reduce((s, x) => s + x.pts, 0) / MR.length;
    const crit = ['pct', 'load'].every(id => rows.find(x => x.r.id === id).s === 'ok');
    return { rows, score, crit };
  }
  const measureTask = {
    id: 'measure', title: 'Конструктор: из «быстро» в измеримое НФТ',
    simple: howMeasure.simple,
    lead: ui.brief({
      situation: 'Глеб: «Мне нужно одно требование к поиску свободного времени — такое, чтобы я понял, что строить, а Лиза — как принимать. Не „быстро“, а по-взрослому». Пока вы собираете требование, Глеб и Лиза задают вопросы — снимите их все.',
      todo: [
        'В каждой из шести строк выберите вариант. Вверху собирается текст требования.',
        'Справа (или ниже) — вопросы Глеба и Лизы: вопрос гаснет, когда ответ на него выбран. Но погасший вопрос ещё не значит, что ответ верный.',
        'Нажмите «Проверить». Засчитывается от 80 %, если верно выбраны доля запросов и нагрузка.'
      ],
      look: 'Опора — F-peak: 1 500 одновременно в понедельник в 09:00 в сезон. И помните про «хвост»: среднее его прячет.'
    }),
    blank: () => ({ pick: {} }),
    reference: () => ({ pick: Object.assign({}, MREF) }),
    render(el, ctx) {
      el.classList.add('mnf-root');
      const a = ctx.ans; a.pick = a.pick || {};
      const ev = ctx.result ? measureEval(a) : null;
      el.innerHTML = `<div class="stack"><div data-s></div><div class="mnf-voice" data-v></div><div class="mnf-rows" data-rows></div></div>`;
      function txt(id) { const r = MR.find(x => x.id === id), o = r.opts.find(x => x.v === a.pick[id]); return o ? `<span class="p">${esc(o.t)}</span>` : `<span class="gap">${esc(r.k.toLowerCase())}?</span>`; }
      function drawTop() {
        TR.$('[data-s]', el).innerHTML = `<div class="mnf-sent">НФТ-01. <b>Поиск свободных слотов:</b> ${txt('metric')} — ${txt('thr')} ${txt('pct')} ${txt('load')}. Условия: ${txt('cond')}. Проверка: ${txt('ver')}.</div>`;
        TR.$('[data-v]', el).innerHTML = MR.map(r => `<div class="v ${a.pick[r.id] ? 'done' : ''}">${a.pick[r.id] ? '✓ ' : ''}<b>${esc(TR.PEOPLE[r.voice.who].name)}:</b> ${esc(r.voice.q)}</div>`).join('');
      }
      function drawRows() {
        TR.$('[data-rows]', el).innerHTML = MR.map(r => {
          const x = ev && ev.rows.find(z => z.r.id === r.id);
          const cls = x ? (x.s === 'none' ? 'bad' : x.s) : '';
          return `<div class="mnf-row ${cls}"><span class="k">${esc(r.k)}</span><div class="mnf-opts">${r.opts.map(o => `<button type="button" class="mnf-opt" data-r="${r.id}" data-v="${o.v}" aria-pressed="${a.pick[r.id] === o.v}" ${ctx.readonly ? 'disabled' : ''}>${esc(o.t)}</button>`).join('')}</div>${x && x.o && x.o.why ? `<div class="why">${x.o.why}</div>` : x && x.s === 'none' ? '<div class="why">Не выбрано.</div>' : ''}</div>`;
        }).join('');
      }
      TR.on(el, 'click', '[data-r]', (e, b) => {
        if (ctx.readonly) return;
        a.pick[b.dataset.r] = b.dataset.v; ctx.save();
        TR.$$(`[data-r="${b.dataset.r}"]`, el).forEach(x => x.setAttribute('aria-pressed', String(x === b)));
        drawTop();
      });
      drawTop(); drawRows();
    },
    check(ans) {
      const r = measureEval(ans), notes = [];
      r.rows.forEach(x => {
        if (x.s === 'ok') notes.push({ ok: true, html: `${x.r.k}: «${esc(x.o.t)}» — верно.` });
        else notes.push({ ok: x.s === 'warn' ? 'warn' : false, html: `${x.r.k}: ${x.o ? `«${esc(x.o.t)}» — ${x.o.why}` : 'не выбрано.'}` });
      });
      return {
        ok: r.score >= 0.8 && r.crit, score: r.score, notes,
        summary: `Верных частей: ${r.rows.filter(x => x.s === 'ok').length} из ${MR.length}.`,
        mentor: r.crit ? null : 'Проверьте две главные части: какую долю запросов мы обещаем и при какой нагрузке. Ошибка в них — и тест «пройдёт» на системе, которая ляжет в первый понедельник апреля.'
      };
    },
    explain: `<p>Итоговое требование:</p>
      <div class="mnf-sent"><b>НФТ-01. Поиск свободных слотов:</b> время ответа сервера — не более 1 секунды для 95 % запросов при 1 500 одновременных пользователях (понедельник, 09:00, сезон). Меряем на сервере от получения запроса до ответа; поиск по 7 станциям на 30 дней вперёд. Проверка: нагрузочный тест с профилем «понедельник, 09:00» перед каждым релизом.</div>
      <p>Шесть частей: <b>метрика, порог, перцентиль, нагрузка, условия, способ проверки</b>. Уберите любую — и появится спор на приёмке. Самые коварные ошибки — среднее вместо перцентиля и «обычная нагрузка» вместо пика: тест зелёный, а клиенты в апреле видят крутилку. Завышенные требования («0,2 с», «10 000 пользователей», «100 % запросов») — тоже ошибка: они стоят денег и сроков, которых у MVP к 15 марта нет. Источник: Вигерс, «Разработка требований», гл. 14; Нильсен, «Время отклика: три важных порога» (0,1 с / 1 с / 10 с).</p>`,
    refNote: 'Засчитываются и «завышенные» варианты в отдельных строках с половинным баллом, если перцентиль и нагрузка выбраны верно.',
    report: ans => MR.map(r => { const o = r.opts.find(x => x.v === ((ans && ans.pick) || {})[r.id]); return `- ${r.k}: ${o ? o.t : '—'} ${o ? (o.s === 'ok' ? '✓' : o.s === 'warn' ? '≈' : '✗') : ''}`; }).join('\n')
  };

  // =====================================================================
  // Практика 3. Калькулятор доступности, бюджет простоя, ПДн
  // =====================================================================
  const LOSS_H = 40000;           // потери за час простоя в часы работы станций в сезон
  const WORK_SHARE = 13 / 24;     // доля простоя, приходящаяся на часы работы (08:00–21:00)
  const availCalc = v => { const n = NV(v), dm = (1 - n.a) * 720, loss = dm * WORK_SHARE * LOSS_H; return { n, dm, loss, total: loss + n.cost }; };
  const PD_Q = {
    q: 'Какие требования к персональным данным клиентов вы запишете в раздел НФТ «Искры»?', multi: true,
    options: [
      { t: 'Персональные данные (ФИО, телефон, email, госномер, VIN) хранятся и обрабатываются на серверах в России, включая резервные копии', ok: true, why: '152-ФЗ, ст. 18 ч. 5 и BR-15. Резервные копии — тоже базы данных.' },
      { t: 'При регистрации клиент даёт согласие на обработку ПДн; сохраняются дата и версия текста согласия', ok: true, why: 'Без согласия обработка незаконна; версия нужна, когда текст поменяется.' },
      { t: 'Механик видит машину и список работ, но не видит телефон клиента; мастер — клиентов только своей станции', ok: true, why: 'Минимально необходимый доступ. Предложение клиенту формирует мастер (BR-7), механику телефон не нужен.' },
      { t: 'Изменения сумм, статусов и ПДн пишутся в неизменяемый журнал: кто, когда, что было, что стало', ok: true, why: 'Подотчётность. Ольге Викторовне это нужно для сверки.' },
      { t: 'По запросу клиента удаляются все его данные, включая заказ-наряды и платежи', ok: false, why: 'Противоречит BR-16: заказ-наряды и платежи хранятся 5 лет. ПДн обезличиваем, документы остаются.' },
      { t: 'Ночные резервные копии для надёжности дублируются в зарубежное облако', ok: false, why: 'Нарушение локализации: копия с ПДн — тоже хранение.' },
      { t: 'Механик видит телефон клиента, чтобы сам звонить и быстрее согласовывать доп. работы', ok: false, why: 'Лишний доступ к ПДн и нарушение BR-7: предложение с ценой формирует мастер-приёмщик.' }
    ]
  };
  function availEval(a) {
    a = a || {};
    const choice = a.target || '';
    const s1 = choice === '99.5' ? 1 : choice === '99.9' ? 0.5 : 0;
    const v = parseFloat(String(a.hours || '').replace(',', '.'));
    const s2 = isFinite(v) && Math.abs(v - 3.6) <= 0.15 ? 1 : 0;
    const q = ui.quizScore(PD_Q, a.q || []);
    return { choice, s1, v, s2, q, score: Math.round((0.4 * s1 + 0.2 * s2 + 0.4 * q.score) * 1000) / 1000 };
  }
  const availTask = {
    id: 'avail', title: 'Доступность, бюджет простоя и персональные данные',
    simple: howAvail.simple,
    lead: ui.brief({
      situation: 'Артём: «Тимур Рашидович хочет „никогда не падало“. Я хочу бюджет на инфраструктуру. Посчитай, какую доступность записываем, — с цифрами, чтобы я мог показать ему». Глеб дал стоимость инфраструктуры, Кирилл — оценку потерь: в сезон час простоя в часы работы станций — около 40 000 ₽ (примерно 5 ушедших к конкурентам заказ-нарядов по 7 800 ₽).',
      todo: [
        'Часть 1. Выберите целевую доступность: смотрите на стоимость инфраструктуры, ожидаемые потери и итог в месяц.',
        'Часть 2. Посчитайте бюджет простоя для 99,5 % в часах за месяц (30 дней) и впишите число.',
        'Часть 3. Отметьте требования к персональным данным, которые попадут в раздел НФТ.',
        'Нажмите «Проверить». Засчитывается от 80 %: цель 40 %, расчёт 20 %, ПДн 40 %.'
      ],
      look: 'Ищем не самую высокую доступность, а самую разумную: где сумма «инфраструктура + потери» минимальна и где простой не ломает понедельник в сезон. Простой ночью «Искре» не страшен: станции закрыты.'
    }),
    blank: () => ({ target: '', hours: '', q: [] }),
    reference: () => ({ target: '99.5', hours: '3,6', q: quizRef(PD_Q) }),
    render(el, ctx) {
      el.classList.add('mnf-root');
      const a = ctx.ans; a.q = a.q || [];
      const ev = ctx.result ? availEval(a) : null;
      el.innerHTML = `<div class="stack">
        <div class="eyebrow">Часть 1 · Целевая доступность</div>
        <div class="mnf-cards" data-n></div>
        <div data-sum></div>
        <div class="eyebrow">Часть 2 · Бюджет простоя</div>
        <div class="mnf-num"><label class="field" style="min-width:0"><span>Простой в месяц при 99,5 %, часов</span><input type="text" inputmode="decimal" data-h aria-label="Простой в месяц, часов" value="${esc(a.hours || '')}" ${ctx.readonly ? 'disabled' : ''} placeholder="например, 5,2"></label><span class="small dim" data-hint></span></div>
        <div class="eyebrow">Часть 3 · Персональные данные</div>
        <div class="card flat" data-q></div>
      </div>`;
      function drawCards() {
        TR.$('[data-n]', el).innerHTML = NINES.map(n => {
          const c = availCalc(n.v), on = a.target === n.v;
          const cls = ev && on ? (ev.s1 === 1 ? 'ok' : ev.s1 > 0 ? 'warn' : 'bad') : '';
          return `<button type="button" class="mnf-card ${cls}" data-t="${n.v}" aria-pressed="${on}" ${ctx.readonly ? 'disabled' : ''}><b>${nineT(n.v)}</b><span class="s">Простой ≈ ${fmtH(c.dm)} в месяц · инфраструктура ${rub(n.cost)}</span><span class="small">${esc(n.how)}</span></button>`;
        }).join('');
        const sum = TR.$('[data-sum]', el);
        if (!a.target) { sum.innerHTML = '<div class="small dim">Выберите уровень — покажу расчёт.</div>'; return; }
        const max = Math.max.apply(null, NINES.map(n => availCalc(n.v).total));
        const c = availCalc(a.target);
        sum.innerHTML = `<div class="card flat stack tight">
          <div class="small"><b>${nineT(a.target)}:</b> простой ≈ ${fmtH(c.dm)} в месяц, из них в часы работы станций ≈ ${fmtH(c.dm * WORK_SHARE)} → потери ≈ ${rub(c.loss)}. Инфраструктура ${rub(c.n.cost)}. <b>Итого ≈ ${rub(c.total)} в месяц.</b></div>
          ${NINES.map(n => { const x = availCalc(n.v); return `<div class="mnf-bar2"><span>${nineT(n.v)}${n.v === a.target ? ' ◀' : ''}</span><span class="track" style="display:flex"><i style="width:${n.cost / max * 100}%;border-radius:4px 0 0 4px"></i><i class="loss" style="width:${x.loss / max * 100}%;border-radius:0 4px 4px 0"></i></span><span class="x">${rub(x.total)}</span></div>`; }).join('')}
          <div class="small dim">Оранжевое — инфраструктура, красное — ожидаемые потери от простоя в часы работы.</div>
        </div>`;
      }
      function hint() {
        const v = parseFloat(String(a.hours || '').replace(',', '.'));
        TR.$('[data-hint]', el).innerHTML = !a.hours ? '(1 − доступность) × 720 ч' : !isFinite(v) ? 'Нужно число' : v > 30 ? 'Похоже, это минуты? Нужны часы.' : `≈ ${fmtH(v)}${ev ? (ev.s2 ? ' — верно' : ' — пересчитайте: 0,5 % от 720 ч') : ''}`;
      }
      drawCards(); hint();
      ui.quiz(TR.$('[data-q]', el), Object.assign({}, PD_Q, { value: a.q, readonly: ctx.readonly, reveal: ctx.result, onChange: v => { a.q = v; ctx.save(); } }));
      TR.on(el, 'click', '[data-t]', (e, b) => { if (ctx.readonly) return; a.target = b.dataset.t; ctx.save(); ctx.decide('Целевая доступность', nineT(a.target)); drawCards(); });
      TR.on(el, 'input', '[data-h]', (e, inp) => { if (ctx.readonly) return; a.hours = inp.value; ctx.save(); hint(); });
    },
    check(ans) {
      const r = availEval(ans), notes = [];
      if (!r.choice) notes.push({ ok: false, html: 'Целевая доступность не выбрана.' });
      else if (r.s1 === 1) notes.push({ ok: true, html: '99,5 %: минимальная сумма «инфраструктура + потери», простой ≈ 3,6 ч в месяц, работы — ночью.' });
      else if (r.choice === '99.9') notes.push({ ok: 'warn', html: '99,9 % — надёжно, но дороже в сумме: дежурство 24/7 и вторая площадка для сети, которая ночью закрыта. Переплата ≈ 28 000 ₽ в месяц к варианту 99,5 %.' });
      else if (r.choice === '99') notes.push({ ok: false, html: '99 % — около 7 часов простоя в месяц: потери в сезон больше, чем экономия на серверах. И одно утро понедельника без записи — это 1 500 человек у телефона.' });
      else notes.push({ ok: false, html: '99,99 % — уровень банков: инфраструктура съедает больше, чем стоит весь простой. «Искра» ночью закрыта — платить за круглосуточную безотказность незачем.' });
      notes.push(r.s2 ? { ok: true, html: 'Бюджет простоя посчитан верно: 0,005 × 720 ч = 3,6 ч.' } : { ok: false, html: `Бюджет простоя: ${isFinite(r.v) ? `${String(ans.hours)} ч — неверно.` : 'не вписан.'} Формула: (1 − 0,995) × 720 ч = 3,6 ч.` });
      notes.push(r.q.ok ? { ok: true, html: 'Требования к ПДн выбраны верно.' } : { ok: r.q.score >= 0.5 ? 'warn' : false, html: 'ПДн: проверьте пояснения к вариантам — две ловушки противоречат закону о локализации и правилу хранения документов 5 лет (BR-16), одна — правилу BR-7.' });
      return {
        ok: r.score >= 0.8, score: r.score, notes,
        summary: `Цель: ${r.choice ? nineT(r.choice) : '—'}, бюджет простоя: ${r.s2 ? 'верно' : 'неверно'}, ПДн: ${Math.round(r.q.score * 100)} %.`,
        mentor: r.score >= 0.8 ? null : 'Самая высокая доступность — не самая правильная. Сложите цену инфраструктуры и потери от простоя — где сумма меньше?'
      };
    },
    explain: `<p><b>99,5 % в часы работы станций</b> — самое выгодное: ≈ 3,6 часа простоя в месяц, около 2 часов из них могут прийтись на часы работы (≈ 78 000 ₽ потерь в сезон), инфраструктура 70 000 ₽ — итого около 148 000 ₽. У 99 % потери вдвое больше экономии; у 99,9 % инфраструктура дороже, чем спасённые клиенты; 99,99 % — для банков. Числа потерь — оценка Кирилла, но порядок величин и логика «цена против потерь» — главное, что нужно показать заказчику.</p>
      <p>В НФТ записываем: <i>«Доступность онлайн-записи и АРМ — не ниже 99,5 % за календарный месяц, считая простой с 08:00 до 21:00; плановые работы — с 22:00 до 07:00 с уведомлением за сутки. RPO ≤ 15 минут, RTO ≤ 1 часа»</i>.</p>
      <p>Требования к ПДн — не «пожелания», а ограничения закона: локализация (включая резервные копии!), согласие, минимальный доступ по ролям, журнал, шифрование, обезличивание вместо удаления документов. Источники: ISO/IEC 25010 (надёжность, защищённость); 152-ФЗ «О персональных данных»; Вигерс, гл. 14.</p>`,
    refNote: 'Бюджет простоя принимается в диапазоне 3,45–3,75 ч. Цель 99,9 % засчитывается наполовину.',
    report: ans => { const r = availEval(ans); return `- Цель: ${r.choice ? nineT(r.choice) : '—'}\n- Простой в месяц при 99,5 %: ${(ans && ans.hours) || '—'} ч ${r.s2 ? '✓' : '✗'}\n- ПДн: ${Math.round(r.q.score * 100)} %`; }
  };

  // =====================================================================
  // Практика 4. Лаборатория: нагрузочный тест в понедельник 09:00
  // =====================================================================
  const LCFG = [
    { id: 'pct', k: 'Что сравниваем с порогом', opts: [{ v: 'avg', t: 'среднее время' }, { v: 'p95', t: '95-й перцентиль' }, { v: 'max', t: 'максимум' }] },
    { id: 'thr', k: 'Порог', opts: [{ v: '1', t: '1 секунда' }, { v: '3', t: '3 секунды' }] },
    { id: 'load', k: 'Сколько пользователей', opts: [{ v: '600', t: '600 одновременно' }, { v: '1500', t: '1 500 одновременно' }, { v: '3000', t: '3 000 одновременно' }] },
    { id: 'prof', k: 'Как приходят', opts: [{ v: 'flat', t: 'ровно весь час' }, { v: 'spike', t: 'всплеском: все в 09:00 за 2 минуты' }] }
  ];
  // результаты стенда: [avg, p95, max, ошибок %]
  const RES = {
    v1: { '600': { flat: [0.28, 0.55, 1.4, 0], spike: [0.35, 0.8, 2.1, 0] }, '1500': { flat: [0.52, 1.3, 3.0, 0.2], spike: [0.74, 2.6, 7.9, 3.5] }, '3000': { flat: [1.6, 4.9, 12, 9], spike: [2.4, 7.8, 30, 18] } },
    v2: { '600': { flat: [0.18, 0.35, 0.9, 0], spike: [0.2, 0.4, 1.1, 0] }, '1500': { flat: [0.27, 0.55, 1.6, 0], spike: [0.33, 0.8, 2.2, 0.1] }, '3000': { flat: [0.62, 1.4, 3.5, 0.4], spike: [0.9, 2.1, 6, 2.1] } }
  };
  const SHAPE = { spike: [0.25, 0.3, 1, 0.95, 0.8, 0.62, 0.5, 0.42, 0.36, 0.32, 0.3, 0.3], flat: [0.9, 1, 0.94, 1, 0.9, 0.97, 0.95, 1, 0.92, 0.98, 0.95, 1] };
  const TICKS = ['08:56', '08:58', '09:00', '09:02', '09:04', '09:06', '09:08', '09:10', '09:12', '09:14', '09:16', '09:18'];
  const PCT_I = { avg: 0, p95: 1, max: 2 };
  const ACTS = [
    { v: 'fix', t: 'Глеб ищет узкое место и чинит: кэш свободных слотов и индекс в базе (4 дня), потом повторный тест' },
    { v: 'relax', t: 'Поднять порог до 3 секунд — «всё равно быстро», и тест зелёный' },
    { v: 'hw', t: 'Без анализа удвоить серверы приложений (+35 000 ₽ в месяц) и выпускать' },
    { v: 'ignore', t: 'Выпускать как есть: «в сезоне разберёмся»' }
  ];
  const LAB_Q = {
    q: 'Почему тест «среднее время ≤ 1 с при 1 500 пользователях» проходит (0,74 с), а в первый понедельник апреля клиенты бросают запись?',
    options: [
      { t: 'Среднее прячет хвост: большинство запросов быстрые, но каждый двадцатый ждёт дольше 2,6 с, а часть получает ошибку — их и теряем', ok: true, why: 'Именно. Поэтому порог ставят на перцентиль, а долю ошибок меряют отдельно.' },
      { t: 'Нагрузочный тест в принципе не предсказывает поведение в проде, его можно не делать', why: 'Предсказывает — если критерий и профиль нагрузки правильные. Тест с p95 и всплеском показал бы проблему в декабре.' },
      { t: 'В понедельник у клиентов медленный мобильный интернет, система ни при чём', why: 'Тест мерил время на сервере — сеть клиента в нём не участвует. Медленным был сервер.' },
      { t: 'Порог 1 секунда слишком строгий: людям всё равно, ждать 1 или 3 секунды', why: 'Не всё равно: после секунды человек замечает ожидание, после нескольких — жмёт повторно или уходит.' }
    ]
  };
  const lv = (ver, c) => RES[ver][c.load][c.prof];
  function labEval(a) {
    a = a || {};
    const c = { pct: a.pct || 'avg', thr: a.thr || '3', load: a.load || '600', prof: a.prof || 'flat' };
    const full = !!(a.pct && a.thr && a.load && a.prof);
    const r1 = lv('v1', c), m1 = r1[PCT_I[c.pct]], pass1 = m1 <= +c.thr;
    const fixed = !pass1 && a.act === 'fix';
    const r2 = lv('v2', c), m2 = r2[PCT_I[c.pct]], pass2 = m2 <= +c.thr;
    const deployed = fixed ? 'v2' : 'v1';
    const real = RES[deployed]['1500'].spike;
    const cfgPts = (c.pct === 'p95' ? 0.1 : 0) + (c.thr === '1' ? 0.1 : 0) + (c.load === '1500' ? 0.1 : c.load === '3000' ? 0.05 : 0) + (c.prof === 'spike' ? 0.1 : 0);
    const q = ui.quizScore(LAB_Q, a.q || []);
    const outPts = !a.ran1 ? 0 : deployed === 'v2' ? 0.5 : 0;
    return { c, full, r1, m1, pass1, fixed, r2, m2, pass2, deployed, real, cfgPts, q, done: !!a.ran1 && (pass1 || !!a.act), score: Math.round((outPts + cfgPts + (q.ok ? 0.1 : 0)) * 1000) / 1000 };
  }
  const labTask = {
    id: 'lab', title: 'Лаборатория: нагрузочный тест «понедельник, 09:00»',
    simple: howMeasure.simple,
    lead: ui.brief({
      situation: 'Середина декабря. Первая сборка поиска слотов готова, Лиза поднимает нагрузочный стенд. «Скажи мне критерий — я прогоню тест, и по нему Артём решит, выпускаем или нет». Ваш критерий — это и есть ваше НФТ. А в первый понедельник апреля система встретит настоящую нагрузку: 1 500 человек в 09:00.',
      todo: [
        'Настройте критерий теста: что сравниваем, порог, сколько пользователей и как они приходят.',
        'Нажмите «Запустить тест» и посмотрите график по двухминутным окнам и вердикт.',
        'Если тест красный — решите, что делать. Затем прочитайте, что случилось в понедельник, 5 апреля, в 09:00.',
        'Ответьте на вопрос и нажмите «Проверить». Засчитывается, если в апрель ушла исправленная версия, критерий близок к правильному и ответ на вопрос верный.'
      ],
      lookTitle: 'Подсказка',
      look: 'Тест полезен ровно настолько, насколько его критерий похож на реальность. Реальность — F-peak: запись на неделю открывается в 09:00, и люди приходят не «ровно весь час».'
    }),
    blank: () => ({ pct: '', thr: '', load: '', prof: '', ran1: false, act: '', q: [] }),
    reference: () => ({ pct: 'p95', thr: '1', load: '1500', prof: 'spike', ran1: true, act: 'fix', q: quizRef(LAB_Q) }),
    render(el, ctx) {
      el.classList.add('mnf-root');
      const a = ctx.ans; a.q = a.q || [];
      el.innerHTML = `<div class="stack"><div class="mnf-rows" data-cfg></div><div data-run></div><div data-out></div><div class="card flat" data-q></div></div>`;
      function chart(ver, r) {
        const vals = r[PCT_I[r.c.pct]] !== undefined ? null : null; // заглушка не используется
        const base = lv(ver, r.c)[PCT_I[r.c.pct]], thr = +r.c.thr, top = Math.max(thr * 1.6, base * 1.15);
        const pts = SHAPE[r.c.prof].map(k => base * k);
        return `<div class="mnf-chart" role="img" aria-label="График по двухминутным окнам">${pts.map(x => `<span class="b ${x > thr ? 'slow' : ''}" style="height:${x / top * 100}%" title="${num(x, 2)} с"></span>`).join('')}<div class="ln thr" style="bottom:${thr / top * 100}%"><span>порог ${num(thr, 0)} с</span></div></div><div class="mnf-axis">${TICKS.map(t => `<span>${t}</span>`).join('')}</div>`;
      }
      function resStats(res, pass, label) {
        return `<div class="mnf-stats">
          <div class="stat"><span class="k">Среднее</span><span class="v">${num(res[0], 2)} с</span></div>
          <div class="stat"><span class="k">95-й перцентиль</span><span class="v ${res[1] > 1 ? 'bad' : 'ok'}">${num(res[1], 2)} с</span></div>
          <div class="stat"><span class="k">Ошибок</span><span class="v ${res[3] >= 1 ? 'bad' : ''}">${num(res[3], 1)} %</span></div>
          <div class="stat"><span class="k">${esc(label)}</span><span class="v ${pass ? 'ok' : 'bad'}">${pass ? 'зелёный' : 'красный'}</span></div>
        </div>`;
      }
      function draw() {
        const r = labEval(a);
        TR.$('[data-cfg]', el).innerHTML = LCFG.map(g => `<div class="mnf-row"><span class="k">${esc(g.k)}</span><div class="mnf-opts">${g.opts.map(o => `<button type="button" class="mnf-opt" data-g="${g.id}" data-v="${o.v}" aria-pressed="${a[g.id] === o.v}" ${ctx.readonly ? 'disabled' : ''}>${esc(o.t)}</button>`).join('')}</div></div>`).join('')
          + `<div class="mnf-sent small">Ваш критерий: <b>${r.full ? `${{ avg: 'среднее время', p95: '95-й перцентиль', max: 'максимальное время' }[r.c.pct]} поиска слотов ≤ ${r.c.thr} с при ${r.c.load} одновременных пользователях, ${r.c.prof === 'spike' ? 'всплеск в 09:00' : 'ровная нагрузка'}` : '…настройте все четыре строки'}</b></div>`;
        TR.$('[data-run]', el).innerHTML = ctx.readonly ? '' : `<div class="row"><button type="button" class="btn primary" data-go ${r.full ? '' : 'disabled'}>${a.ran1 ? '⟲ Перезапустить тест с новым критерием' : '▶ Запустить тест'}</button><span class="small dim">${r.full ? 'Стенд: копия прода, база на сезон.' : 'Сначала выберите все параметры.'}</span></div>`;
        const out = TR.$('[data-out]', el);
        if (!a.ran1) { out.innerHTML = ''; return; }
        let h = `<div class="stack"><div class="eyebrow">Тест 1 · первая сборка</div>${chart('v1', r)}${resStats(r.r1, r.pass1, 'Ваш вердикт')}`;
        h += ui.say('liza', r.pass1 ? `По вашему критерию — зелёный: ${num(r.m1, 2)} с ≤ ${r.c.thr} с. ${r.r1[3] >= 1 ? `Правда, ${num(r.r1[3], 1)} % запросов упали с ошибкой, но в критерии про ошибки ничего нет…` : ''} Пишу «принято».` : `Красный: ${num(r.m1, 2)} с при пороге ${r.c.thr} с. Что делаем?`);
        if (!r.pass1) {
          h += `<div class="stack tight">${ACTS.map(x => `<button type="button" class="mnf-opt" data-act="${x.v}" aria-pressed="${a.act === x.v}" ${ctx.readonly ? 'disabled' : ''}>${esc(x.t)}</button>`).join('')}</div>`;
          if (a.act === 'fix') {
            h += ui.say('gleb', 'Нашёл: на каждый запрос мы пересчитываем занятость всех 38 постов на 30 дней прямо в базе. Сделал кэш свободных слотов, который обновляется при каждой записи, и индекс. Прогоняем ещё раз.');
            h += `<div class="eyebrow">Тест 2 · после исправления</div>${chart('v2', Object.assign({}, r))}`.replace(chart('v2', r), chart('v2', r));
            h += resStats(r.r2, r.pass2, 'Ваш вердикт');
            if (!r.pass2) h += ui.say('gleb', `Под ${r.c.load} одновременных и порог ${r.c.thr} с не тянем даже после кэша. Чтобы дотянуть, нужно ещё два спринта на переделку хранения расписания. Реальный пик — 1 500, может, критерий завышен?`);
          } else if (a.act === 'relax') h += ui.say('vera', 'Порог подняли — тест позеленел. Но система не стала быстрее: поменялся только градусник.');
          else if (a.act === 'hw') h += ui.say('gleb', 'Удвоил серверы приложений. p95 стал 2,4 с вместо 2,6: узкое место — в базе, а её мы не трогали. Деньги тратим каждый месяц.');
          else if (a.act === 'ignore') h += ui.say('artem', 'Ладно, выпускаем. До апреля ещё далеко.');
        }
        if (r.pass1 || a.act) {
          const R = r.real, good = r.deployed === 'v2';
          h += `<div class="eyebrow">Понедельник, 5 апреля, 09:00 · реальность: 1 500 человек всплеском</div>
            <div class="mnf-tl">
              <div class="mnf-ev ${good ? 'ok' : 'bad'}"><span class="d">09:00–09:10</span><div class="small">p95 поиска — <b>${num(R[1], 2)} с</b>, ошибок — <b>${num(R[3], 1)} %</b>. ${good ? 'Крутилка почти не видна, записи идут потоком.' : 'Крутилка по 3–8 секунд, у каждого тридцатого — «Что-то пошло не так». Люди жмут «Обновить» — нагрузка растёт ещё.'}</div></div>
              <div class="mnf-ev ${good ? 'ok' : 'bad'}"><span class="d">09:10–11:00</span><div class="small">${good ? 'За утро — около 1 900 онлайн-записей. Колл-центр спокоен, Марина Олеговна впервые за годы не держит трубку у уха с 9 утра.' : 'Около 9 % бросают запись и звонят. Колл-центр снова теряет звонки — та же боль 21 %, от которой уходили. Тимур Рашидович звонит Артёму в 09:40.'}</div></div>
              <div class="mnf-ev ${good ? 'ok' : 'warn'}"><span class="d">Итог</span><div class="small">${good ? (r.c.load === '3000' ? 'Система выдержала. Но критерий «3 000 одновременно» был завышен: если бы ради него переделывали хранение, MVP к 15 марта не успели бы.' : r.c.prof === 'flat' || r.c.pct !== 'p95' ? 'Система выдержала — но отчасти повезло: критерий теста не совпадал с реальным пиком. Следующее изменение такой тест может пропустить.' : 'Тест с правильным критерием поймал проблему в декабре, когда исправить её стоило 4 дня работы Глеба.') : 'Срочное исправление в сезон: Глеб и Даша работают ночами, неделя под нагрузкой с жалобами. Исправить в декабре стоило 4 дня.'}</div></div>
            </div>`;
        }
        h += '</div>';
        out.innerHTML = h;
      }
      draw();
      ui.quiz(TR.$('[data-q]', el), Object.assign({}, LAB_Q, { value: a.q, readonly: ctx.readonly, reveal: ctx.result, onChange: v => { a.q = v; ctx.save(); } }));
      TR.on(el, 'click', '[data-g]', (e, b) => { if (ctx.readonly) return; a[b.dataset.g] = b.dataset.v; a.ran1 = false; a.act = ''; ctx.save(); draw(); });
      TR.on(el, 'click', '[data-go]', () => {
        if (ctx.readonly) return;
        a.ran1 = true; a.act = ''; ctx.save();
        const r = labEval(a);
        ctx.decide('Критерий нагрузочного теста', `${r.c.pct} ≤ ${r.c.thr} с, ${r.c.load} пользователей, ${r.c.prof}`);
        draw();
      });
      TR.on(el, 'click', '[data-act]', (e, b) => { if (ctx.readonly) return; a.act = b.dataset.act; ctx.save(); ctx.decide('Решение по красному тесту', ACTS.find(x => x.v === a.act).t); draw(); });
    },
    check(ans) {
      const r = labEval(ans), notes = [];
      if (!(ans && ans.ran1)) notes.push({ ok: false, html: 'Тест не запускали — нажмите «Запустить тест», чтобы увидеть последствия критерия.' });
      else if (!r.done) notes.push({ ok: false, html: 'Тест красный, а решение не принято — выберите, что делать.' });
      else if (r.deployed === 'v2') notes.push({ ok: true, html: 'В апрель ушла исправленная версия: понедельник прошёл спокойно.' });
      else notes.push({ ok: false, html: r.pass1 ? `Тест «прошёл» по вашему критерию, но на реальном пике p95 — 2,6 с и 3,5 % ошибок. Критерий не похож на понедельник 09:00.` : ans.act === 'relax' ? 'Порог подняли — система не стала быстрее. В апреле клиенты ждали по 3–8 секунд.' : ans.act === 'hw' ? 'Серверы приложений не были узким местом — проблема в базе. Деньги потрачены, понедельник провален.' : 'Выпустили как есть — и разбирались в сезон, в 10 раз дороже.' });
      if (r.c.pct !== 'p95') notes.push({ ok: false, html: `Сравнивали ${r.c.pct === 'avg' ? 'среднее — оно прячет хвост' : 'максимум — он непроверяем: один сбой сети, и тест красный навсегда'}. Нужен 95-й перцентиль.` });
      if (r.c.thr !== '1') notes.push({ ok: false, html: 'Порог 3 секунды — после секунды ожидание уже заметно, люди жмут повторно. Целевое НФТ — 1 секунда.' });
      if (r.c.load === '600') notes.push({ ok: false, html: '600 — это ноябрь. В сезон в 09:00 — 1 500 одновременно (F-peak).' });
      if (r.c.load === '3000') notes.push({ ok: 'warn', html: '3 000 одновременно — запас ×2 к реальному пику. Подстраховка понятна, но переделка под неё стоила бы двух спринтов MVP.' });
      if (r.c.prof !== 'spike') notes.push({ ok: false, html: 'Ровная нагрузка не похожа на реальность: запись открывается в 09:00, и все приходят за пару минут. Всплеск — самый тяжёлый момент.' });
      notes.push(r.q.ok ? { ok: true, html: 'Вопрос: верно — среднее прячет хвост медленных запросов и ошибки.' } : { ok: false, html: 'Вопрос: посмотрите на столбцы «Среднее» и «95-й перцентиль» в тесте с 1 500 пользователями и всплеском.' });
      const ok = r.score >= 0.8 && r.deployed === 'v2' && r.q.ok;
      return {
        ok, score: r.score, notes,
        summary: `${r.deployed === 'v2' ? 'Апрель прошёл спокойно' : 'Апрель с проблемами'}; критерий: ${Math.round(r.cfgPts / 0.4 * 100)} % совпадения с реальным пиком.`,
        mentor: ok ? null : r.deployed === 'v1' && r.pass1 ? 'Тест зелёный — а клиенты страдают. Значит, тест мерил не то. Что на самом деле происходит в понедельник в 09:00 и что видит клиент из «хвоста»?' : r.deployed === 'v1' ? 'Красный тест — подарок: он показал проблему за четыре месяца до сезона. Что дешевле — найти узкое место сейчас или поменять градусник?' : null
      };
    },
    explain: `<p>Правильный критерий совпадает с НФТ-01: <b>95-й перцентиль ≤ 1 с при 1 500 одновременных пользователях, всплеском в 09:00</b>. На первой сборке он красный (p95 2,6 с, 3,5 % ошибок), и это лучшая новость декабря: Глеб находит узкое место (пересчёт занятости постов на каждый запрос), делает кэш и индекс за 4 дня — и повторный тест зелёный (p95 0,8 с).</p>
      <ul class="checks">
        <li class="bad"><b>Среднее ≤ 1 с</b> — тест зелёный (0,74 с), а в апреле каждый двадцатый ждёт больше 2,6 с, и 3,5 % получают ошибку.</li>
        <li class="bad"><b>600 пользователей или ровная нагрузка</b> — тест проверяет ноябрь, а не сезон.</li>
        <li class="bad"><b>Поднять порог</b> — поменять градусник, а не температуру. <b>Удвоить серверы без анализа</b> — платить каждый месяц за то, что не было узким местом.</li>
        <li class="warn"><b>3 000 пользователей</b> — честная подстраховка, но переделка под неё съела бы два спринта MVP. Запас закладывают осознанно и с ценой.</li>
      </ul>
      <p>Вывод для аналитика: НФТ — это не строчка «для галочки», а критерий, по которому команда решает «выпускаем или нет». Неточное НФТ даёт зелёный тест и красный апрель. Добавьте в НФТ и долю ошибок: «не более 0,5 % ответов с ошибкой». Источник: Вигерс, гл. 14; ISO/IEC 25010 (производительность: временные характеристики, ёмкость); ISO/IEC 25023 (метрики качества).</p>`,
    report: ans => { const r = labEval(ans); return `- Критерий: ${r.c.pct} ≤ ${r.c.thr} с, ${r.c.load} пользователей, ${r.c.prof}\n- Тест 1: ${r.pass1 ? 'зелёный' : 'красный'}; решение: ${(ACTS.find(x => x.v === (ans && ans.act)) || { t: '—' }).t}\n- В апрель ушла ${r.deployed === 'v2' ? 'исправленная' : 'первая'} версия\n- Вопрос: ${r.q.ok ? 'верно' : 'неверно'}`; }
  };

  // =====================================================================
  // Практика 5. Ответ Тимуру: «чтобы летало и никогда не падало»
  // =====================================================================
  const T_RUBRIC = [
    'Переводит «летало» в число: поиск свободного времени — не дольше 1 секунды для 95 % запросов при 1 500 одновременных пользователях',
    'Объясняет, откуда числа: понедельник 09:00 в сезон, открытие записи на неделю; меряем «почти всех» (95 %), а не «в среднем»',
    'Переводит «никогда не падало» в доступность 99,5 % (≈ 3,6 часа в месяц, работы ночью, когда станции закрыты) и объясняет, почему 100 % не бывает',
    'Сравнивает цену и выгоду: каждая следующая девятка в разы дороже, а для «Искры» спасает меньше, чем стоит',
    'Говорит, как проверим: нагрузочный тест до сезона и мониторинг; плюс требования закона о персональных данных, которые не обсуждаются'
  ];
  const T_REF = 'Тимур Рашидович, «летало» мы записали в цифрах: поиск свободного времени — не дольше секунды для 95 из 100 запросов, даже когда в понедельник в 09:00 в сезон одновременно заходят 1 500 человек. Именно этот момент самый тяжёлый: открывается запись на неделю. Мы меряем не «в среднем» — среднее может быть хорошим, когда каждый пятый клиент ждёт три секунды, — а так, чтобы быстро было почти у всех. «Никогда не падало» мы записали как доступность 99,5 % — это до 3,6 часа простоя в месяц, а плановые работы делаем ночью, когда станции закрыты. 100 % не бывает ни у кого, даже у банков, а каждая следующая «девятка» стоит в разы дороже: 99,9 % — это дежурства 24/7 и второй дата-центр, примерно на 90 000 ₽ в месяц больше, а спасёт меньше, чем стоит. Проверим всё до сезона: в декабре прогоняем нагрузочный тест с профилем «понедельник, 09:00», после запуска следим за мониторингом. И отдельно — то, что не обсуждается: данные клиентов храним только в России, по 152-ФЗ.';
  const timurTask = {
    id: 'timur', title: 'Ответьте Тимуру: «чтобы летало и никогда не падало»',
    simple: {
      icon: '🗣️',
      plain: 'Заказчик говорит ощущениями. Аналитик переводит их в числа, объясняет, почему числа именно такие, и сколько стоит «ещё лучше».',
      analogy: 'Клиент автосервиса просит «сделать, чтобы не стучало». Мастер отвечает: «Заменим стойки — стук уйдёт, гарантия 6 месяцев или 10 000 км. Можно поставить спортивные за двойную цену, но на городских дорогах разницы вы не почувствуете».',
      tech: 'Согласование НФТ с заказчиком: перевод «атрибутов качества» в измеримые цели и компромиссы между ними (Вигерс, гл. 14 «Компромиссы атрибутов качества»); обоснование через стоимость простоя и стоимость инфраструктуры.'
    },
    lead: ui.brief({
      situation: 'Артём переслал Тимуру Рашидовичу раздел НФТ. Через десять минут ответ: «Что значит 99,5 %? Я сказал — никогда не падало. И при чём тут 95 процентов, я хочу, чтобы у всех летало». Артём: «Ответь ему сам, своими словами. Коротко, без „перцентилей“».',
      todo: [
        'Напишите 6–10 предложений, от 250 символов: на языке Тимура — клиенты, деньги, понедельник в сезон.',
        'Объясните, что значат ваши числа, почему не 100 % и как вы их проверите.',
        'Нажмите «Проверить с Верой (Claude)» или «Сверить с эталоном самому» и отметьте раскрытые пункты. Засчитывается от 60 %.'
      ],
      lookTitle: 'На что опереться',
      look: 'НФТ-01: 1 с для 95 % при 1 500 одновременно. Доступность 99,5 % ≈ 3,6 ч в месяц, работы ночью. 99,9 % — дороже на ≈ 90 000 ₽ в месяц. Нагрузочный тест в декабре. 152-ФЗ — данные в России.'
    }),
    blank: () => ({ j: {} }),
    reference: () => ({ j: { text: T_REF, self: T_RUBRIC.map(() => true) } }),
    render(el, ctx) {
      el.classList.add('mnf-root');
      el.insertAdjacentHTML('beforeend', ui.say('timur', 'Что значит 99,5 %? Я сказал — никогда не падало. И при чём тут 95 процентов? Я хочу, чтобы у всех летало.'));
      const j = document.createElement('div'); j.style.marginTop = '12px'; el.appendChild(j);
      ui.justify(j, {
        id: 'mnf-timur', q: 'Что ответить Тимуру Рашидовичу?',
        qPlain: 'Объясните владельцу сети автосервисов, что означают нефункциональные требования «поиск свободного времени не дольше 1 секунды для 95 % запросов при 1 500 одновременных пользователях» и «доступность 99,5 %», почему не 100 %, сколько стоит более высокая доступность и как требования проверят до сезона.',
        rubric: T_RUBRIC, reference: T_REF, value: ctx.ans.j, readonly: ctx.readonly, minLen: 250,
        placeholder: 'Тимур Рашидович, …',
        onChange: v => { ctx.ans.j = v; ctx.save(); ctx.decide('Ответ Тимуру про НФТ', v.text || ''); }
      });
    },
    check(ans) {
      const s = ui.justifyScore(ans && ans.j);
      return {
        ok: s >= 0.6, score: s,
        summary: s ? `Оценка ответа: ${Math.round(s * 100)} %.` : 'Напишите ответ (от 250 символов) и проверьте его с Верой или сверьте с эталоном сами.',
        notes: s && s < 0.6 ? [{ ok: false, html: 'Тимуру важны клиенты и деньги. Покажите на понедельнике 09:00, что значит «секунда для 95 %», и на цене «девяток», почему 99,5 %, а не 100 %.' }] : []
      };
    },
    explain: '<p>Сильный ответ переводит три вещи: <b>ощущение → число</b> («летало» = секунда почти для всех в самый тяжёлый момент), <b>мечту → компромисс</b> («никогда» = 99,5 %, потому что следующая девятка дороже, чем спасает) и <b>обещание → проверку</b> (нагрузочный тест в декабре, мониторинг в сезон). Слово «перцентиль» не нужно: «95 из 100 запросов» понятно любому.</p><p>Закон о персональных данных не предмет торга — его называют как данность. Дальше по проекту эти НФТ будут жить в критериях приёмки, архитектуре Глеба и тестах Лизы. В следующий раз — «Работа с требованиями»: как такие требования согласовывают, версионируют и меняют, когда Тимур Рашидович придумает что-то новое.</p>',
    report: ans => (ans && ans.j && ans.j.text) ? ans.j.text : '—'
  };

  // =====================================================================
  TR.stage({
    id: ID,
    when: 'пятница, 27 ноября, 16:00 · Глеб спрашивает: «а сколько это — быстро?»',
    intro: [
      { who: 'gleb', html: 'В письме Тимура Рашидовича: «Главное — чтобы летало и никогда не падало». Я не умею программировать «летало». Сколько это — быстро? Сколько секунд, при скольких людях? И «никогда» — это сколько денег?' },
      { who: 'liza', html: 'И мне нужен способ это проверить. «Быстро» я в тест-кейс не запишу, а в апреле будет поздно.' },
      { who: 'vera', html: 'Сегодня — нефункциональные требования: не «что делает система», а «насколько хорошо». Найдём их в словах заказчика, переведём в числа, посчитаем девятки и прогоним систему через понедельник, 09:00. Опора — пиковая нагрузка из блокнота.' }
    ],
    facts: ['F-peak', 'F-goal', 'F-deadline', 'F-pd', 'F-retention', 'F-parts'],
    glossary: [
      { term: 'Нефункциональное требование (НФТ)', simple: 'Не «что делает система», а «насколько хорошо»: как быстро, надёжно, защищённо, удобно.', tech: 'Требование к атрибуту качества системы или ограничение. Классификация — ISO/IEC 25010; Вигерс: атрибуты качества и ограничения.' },
      { term: 'ISO/IEC 25010', simple: 'Чек-лист из восьми «насколько хорошо», по которому удобно ничего не забыть.', tech: 'Модель качества программного продукта: функциональная пригодность, производительность, совместимость, удобство, надёжность, защищённость, сопровождаемость, переносимость. В России — ГОСТ Р ИСО/МЭК 25010-2015. Редакция 2023 г. добавила safety.' },
      { term: 'Время ответа', simple: 'Сколько ждать от нажатия до результата.', tech: 'Response time — интервал от получения запроса до отправки ответа (на сервере) или до отображения результата (на клиенте). Точку измерения указывают в требовании.' },
      { term: 'Перцентиль (p95)', simple: '95 из 100 запросов быстрее этого времени.', tech: 'Значение, ниже которого лежит заданная доля измерений. p50 — медиана, p95 и p99 — «хвост». Предпочтительнее среднего для НФТ к скорости.' },
      { term: 'Профиль нагрузки', simple: 'Кто, когда, сколько одновременно и что делает.', tech: 'Модель распределения пользователей и операций во времени. Основа сценария нагрузочного теста. У «Искры» — понедельник 09:00, 1 500 одновременно, 70 % поиск слотов.' },
      { term: 'Нагрузочный тест', simple: 'Проверка, как система ведёт себя, когда пользователей много.', tech: 'Load testing — тест под ожидаемой пиковой нагрузкой; stress testing — сверх неё, до отказа. Инструменты: JMeter, Gatling, k6.' },
      { term: 'Доступность', simple: 'Доля времени, когда система работает.', tech: 'Availability = время работы / (время работы + простой) за период. 99,5 % за месяц ≈ 3,6 ч простоя; 99,9 % ≈ 43 мин.' },
      { term: 'SLA', simple: 'Договорённость, какой уровень сервиса обещан и что будет, если нет.', tech: 'Service Level Agreement — соглашение об уровне сервиса с метриками (доступность, время реакции) и последствиями нарушения.' },
      { term: 'RPO и RTO', simple: 'RPO — сколько данных можно потерять, RTO — как быстро надо подняться.', tech: 'Recovery Point Objective и Recovery Time Objective — целевые точка и время восстановления после аварии. У «Искры»: RPO ≤ 15 мин, RTO ≤ 1 ч.' },
      { term: 'Персональные данные (ПДн)', simple: 'Всё, по чему можно узнать человека: ФИО, телефон, госномер.', tech: '152-ФЗ «О персональных данных»: согласие, локализация в РФ, меры защиты, права субъекта. У «Искры» — BR-15.' },
      { term: 'Ограничение', simple: 'Условие, которое не выбирают, а соблюдают: закон, обязательная интеграция.', tech: 'Constraint — требование, сужающее варианты решения: 152-ФЗ, 54-ФЗ, интеграция с 1С. Записывают рядом с НФТ, но не торгуются о нём.' }
    ],
    outro: 'Вместо «чтобы летало и не падало» у «Искры» теперь есть измеримые НФТ: поиск слотов — 1 с для 95 % запросов при 1 500 одновременных, доступность 99,5 % (≈ 3,6 ч в месяц), RPO 15 минут и RTO 1 час, требования к персональным данным по 152-ФЗ. Вы видели, как неточный критерий даёт зелёный тест и красный апрель. В среду — работа с требованиями: Тимур Рашидович пришлёт запрос на шиномонтаж с хранением шин, и нам предстоит понять, что он заденет.',
    tasks: [howIso, howMeasure, howAvail, hiddenTask, measureTask, availTask, labTask, timurTask]
  });
})();
