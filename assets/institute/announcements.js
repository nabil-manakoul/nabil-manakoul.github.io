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
      return { ico: t.ico, cat: t.label, t: a.title, href: a.url || '', annId: a.id };
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
        '<button class="ann-bar-txt" type="button" data-annopen="' + esc(top.id) + '">' + esc(top.title) + '</button>' +
        '<button class="ann-bar-link" type="button" data-annopen="' + esc(top.id) + '">التفاصيل ←</button>' +
        '<button class="ann-bar-x" type="button" aria-label="إغلاق الإعلان">✕</button>' +
      '</div>';
    bar.hidden = false;
    bar.querySelector('.ann-bar-x').addEventListener('click', function () {
      try { localStorage.setItem(KEY, top.id); } catch (_) {}
      bar.hidden = true;
    });
    var openers = bar.querySelectorAll('[data-annopen]');
    for (var oi = 0; oi < openers.length; oi++) {
      openers[oi].addEventListener('click', function () {
        if (typeof window.ISTA_openAnnouncement === 'function') window.ISTA_openAnnouncement(top.id);
      });
    }
  })();

  // ---------- creative, iconic announcement details modal ----------
  var modal = null;
  function buildModal() {
    if (modal) return modal;
    modal = document.createElement('div');
    modal.className = 'annm';
    modal.id = 'annModal';
    modal.hidden = true;
    modal.innerHTML =
      '<div class="annm-overlay" data-annm-close></div>' +
      '<div class="annm-card" role="dialog" aria-modal="true" aria-label="تفاصيل المستجدّ">' +
        '<div class="annm-head">' +
          '<span class="annm-deco" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></span>' +
          '<button class="annm-x" type="button" data-annm-close aria-label="إغلاق">✕</button>' +
        '</div>' +
        '<span class="annm-ico" aria-hidden="true"></span>' +
        '<div class="annm-body">' +
          '<span class="annm-badge"></span>' +
          '<h3 class="annm-title"></h3>' +
          '<div class="annm-meta"></div>' +
          '<p class="annm-text"></p>' +
          '<div class="annm-actions"></div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(modal);
    modal.addEventListener('click', function (e) { if (e.target.closest('[data-annm-close]')) closeModal(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && modal && !modal.hidden) closeModal(); });
    return modal;
  }
  function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(function () { modal.hidden = true; }, 260);
  }
  function findAnn(id) {
    var a = window.ISTA_ANNOUNCEMENTS || [];
    for (var i = 0; i < a.length; i++) if (a[i].id === id) return a[i];
    return null;
  }
  window.ISTA_openAnnouncement = function (id) {
    var a = findAnn(id);
    if (!a) return;
    var t = meta(a);
    var m = buildModal();
    m.className = 'annm ' + t.cls;
    m.querySelector('.annm-ico').textContent = t.ico;
    m.querySelector('.annm-badge').textContent = t.label;
    m.querySelector('.annm-title').textContent = a.title;
    var dateTxt = fmtDate(a.date);
    m.querySelector('.annm-meta').innerHTML =
      (dateTxt ? '<span class="annm-date">🗓️ ' + esc(dateTxt) + '</span>' : '') +
      (isNew(a) ? '<span class="annm-new">جديد</span>' : '');
    m.querySelector('.annm-text').textContent = a.body || a.title;
    var act = m.querySelector('.annm-actions');
    act.innerHTML = a.url ? '<a class="annm-btn" href="' + esc(a.url) + '">الانتقال إلى القسم المعني ←</a>' : '';
    var lnk = act.querySelector('a');
    if (lnk) lnk.addEventListener('click', function () { closeModal(); });
    m.hidden = false;
    void m.offsetWidth;
    m.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

})();
