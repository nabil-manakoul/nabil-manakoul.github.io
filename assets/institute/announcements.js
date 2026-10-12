/* =====================================================================
   المستجدات والإعلانات — مصدر واحد موحّد
   ---------------------------------------------------------------------
   لنشر أو تعديل أي مستجدّ، عدّل فقط المصفوفة ISTA_ANNOUNCEMENTS أدناه.
   تظهر الإعلانات تلقائيًا في ثلاثة أماكن:
     • شريط إعلان علوي بارز (أهمّ إعلان، قابل للإغلاق)
     • قسم «مستجدات هامّة» (بطاقات لكل الإعلانات النشِطة)
     • الشريط المتحرّك أعلى الصفحة

   حقول الإعلان:
     id      : معرّف فريد. غيّره عند تعديل المحتوى ليعود شريط الإعلان للظهور
               لمن أغلقه سابقًا.
     type    : "extension" تمديد التسجيل | "schedule" استعمال الزمن |
               "event" حدث وفعالية | "general" إعلان عام | "urgent" عاجل
     title   : العنوان المختصر (يظهر في الشريط والبطاقة والشريط المتحرّك)
     body    : تفاصيل اختيارية (تظهر في البطاقة فقط)
     date    : "YYYY-MM-DD" تاريخ النشر (تظهر شارة «جديد» لمدة 7 أيام)
     until   : "YYYY-MM-DD" تاريخ الاختفاء التلقائي. اتركه فارغًا = بلا انتهاء.
     url     : رابط اختياري (مثل "#dates" أو "#registration" أو رابط خارجي)
     pinned  : true لتثبيته في المقدّمة

   ⚠️ الإعلانات أدناه نماذج للعرض — استبدلها بإعلاناتك الحقيقية أو احذفها.
   ===================================================================== */
window.ISTA_ANNOUNCEMENTS = [

  { id:'reg-ext-2026',
    type:'extension', pinned:true,
    title:'تمديد فترة التسجيل في بعض الشعب عبر دراسة الملفات',
    body:'في حالة عدم اكتمال عدد المترشّحين في شعبة معيّنة، تُمدَّد فترة التسجيل عبر دراسة الملفات. تابعوا رزنامة التواريخ بالموقع.',
    date:'2026-10-06', until:'2026-10-31', url:'#dates' },

  { id:'schedule-s1-2026',
    type:'schedule',
    title:'تحيين استعمال الزمن للأسدوس الأول',
    body:'تمّ تحديث استعمال الزمن لبعض المجموعات. يُرجى من المتدرّبين الاطّلاع عبر فضاء المتدربين.',
    date:'2026-10-10', until:'2026-10-25', url:'#spaces' },

  { id:'open-day-2026',
    type:'event',
    title:'يوم تواصلي مفتوح بالمعهد للتعريف بالشعب والتكوينات',
    body:'يُنظّم المعهد يومًا تواصليًا مفتوحًا لفائدة المترشّحين وأوليائهم للتعريف بالشعب وشروط الولوج ومسارات الإدماج المهني.',
    date:'2026-10-08', until:'2026-10-22', url:'#contact' },

  { id:'myway-reg',
    type:'general',
    title:'التسجيل الأولي يتم حصريًا عبر بوابة MyWay — myway.ac.ma',
    body:'يُنجَز التسجيل الأولي إلكترونيًا عبر بوابة MyWay الرسمية؛ والموقع يوجّه إليها ولا يستبدلها.',
    date:'2026-10-01', url:'#registration' }

  /* نماذج جاهزة للنسخ عند الحاجة:
  ,{ id:'urgent-xxx', type:'urgent', pinned:true,
     title:'إعلان عاجل …', body:'…',
     date:'2026-10-12', until:'2026-10-15', url:'#contact' }
  */
];

(function () {
  "use strict";

  var TYPES = {
    extension: { label: 'تمديد التسجيل', ico: '⏰', cls: 't-ext' },
    schedule:  { label: 'استعمال الزمن', ico: '🗓️', cls: 't-sch' },
    event:     { label: 'حدث وفعالية',   ico: '🎉', cls: 't-evt' },
    general:   { label: 'إعلان عام',      ico: '📣', cls: 't-gen' },
    urgent:    { label: 'عاجل',           ico: '🚨', cls: 't-urg' }
  };
  var PRIO = { urgent: 0, extension: 1, schedule: 2, event: 3, general: 4 };
  var MONTHS = ['يناير','فبراير','مارس','أبريل','ماي','يونيو','يوليوز','غشت','شتنبر','أكتوبر','نونبر','دجنبر'];

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function meta(a) { return TYPES[a.type] || TYPES.general; }
  function fmtDate(s) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || '');
    if (!m) return '';
    return parseInt(m[3], 10) + ' ' + MONTHS[parseInt(m[2], 10) - 1] + ' ' + m[1];
  }
  function isActive(a) {
    var now = new Date();
    if (a.date) { var d = new Date(a.date + 'T00:00:00'); if (!isNaN(d) && now < d) return false; }
    if (a.until) { var u = new Date(a.until + 'T23:59:59'); if (isNaN(u) || now > u) return false; }
    return true;
  }
  function isNew(a) {
    if (!a.date) return false;
    var d = new Date(a.date + 'T00:00:00');
    return !isNaN(d) && (Date.now() - d.getTime()) / 86400000 <= 7;
  }

  var active = (window.ISTA_ANNOUNCEMENTS || []).filter(isActive).sort(function (a, b) {
    if (!!b.pinned !== !!a.pinned) return b.pinned ? 1 : -1;
    var pa = PRIO[a.type] == null ? 9 : PRIO[a.type];
    var pb = PRIO[b.type] == null ? 9 : PRIO[b.type];
    if (pa !== pb) return pa - pb;
    return new Date(b.date || 0) - new Date(a.date || 0);
  });
  window.ISTA_ANN_ACTIVE = active;

  // feed for the news ticker (consumed by main.js newsTicker)
  window.ISTA_tickerItems = function () {
    return active.map(function (a) {
      var t = meta(a);
      return { ico: t.ico, cat: t.label, t: a.title, href: a.url || '#annSection' };
    });
  };

  // ---------- top announcement bar (single, highest-priority) ----------
  (function bar() {
    var bar = document.getElementById('annBar');
    if (!bar) return;
    if (!active.length) { bar.hidden = true; return; }
    var top = active[0];
    var KEY = 'ista_annbar_dismissed';
    var dismissed = '';
    try { dismissed = localStorage.getItem(KEY) || ''; } catch (_) {}
    if (dismissed === top.id) { bar.hidden = true; return; }
    var t = meta(top);
    bar.className = 'ann-bar ' + t.cls;
    bar.innerHTML =
      '<div class="container ann-bar-in">' +
        '<span class="ann-bar-ico" aria-hidden="true">' + t.ico + '</span>' +
        '<span class="ann-bar-tag">' + esc(t.label) + '</span>' +
        '<span class="ann-bar-txt">' + esc(top.title) + '</span>' +
        (top.url ? '<a class="ann-bar-link" href="' + esc(top.url) + '">التفاصيل ←</a>' : '') +
        '<button class="ann-bar-x" type="button" aria-label="إغلاق الإعلان">✕</button>' +
      '</div>';
    bar.hidden = false;
    bar.querySelector('.ann-bar-x').addEventListener('click', function () {
      try { localStorage.setItem(KEY, top.id); } catch (_) {}
      bar.hidden = true;
    });
  })();

  // ---------- "مستجدات هامّة" section ----------
  (function section() {
    var sec = document.getElementById('annSection');
    var grid = document.getElementById('annGrid');
    if (!sec || !grid) return;
    if (!active.length) { sec.hidden = true; return; }
    grid.innerHTML = active.map(function (a) {
      var t = meta(a);
      var dateTxt = fmtDate(a.date);
      return '<article class="ann-card ' + t.cls + '">' +
        '<div class="ann-card-top">' +
          '<span class="ann-chip">' + t.ico + ' ' + esc(t.label) + '</span>' +
          (isNew(a) ? '<span class="ann-new">جديد</span>' : '') +
        '</div>' +
        '<h3 class="ann-card-title">' + esc(a.title) + '</h3>' +
        (a.body ? '<p class="ann-card-body">' + esc(a.body) + '</p>' : '') +
        '<div class="ann-card-foot">' +
          (dateTxt ? '<span class="ann-date">🗓️ ' + esc(dateTxt) + '</span>' : '<span></span>') +
          (a.url ? '<a class="ann-more" href="' + esc(a.url) + '">التفاصيل ←</a>' : '') +
        '</div>' +
      '</article>';
    }).join('');
    sec.hidden = false;
  })();

})();
