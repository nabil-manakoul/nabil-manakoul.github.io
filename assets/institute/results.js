/* =====================================================================
   بوابة النتائج — قسم النتائج (Data-driven results portal)
   =====================================================================

   يتكوّن القسم من كتلتين مستقلّتين:

   (أ) بوابة نتائج الامتحانات — خاصّة بالمتدرّبين المسجّلين لدينا فعليًا:
       نتائج المرور إلى السنوات الأعلى + نتائج امتحانات نهاية التكوين.
       تُعرض حسب كل شعبة (programs أدناه).

   (ب) نتائج الانتقاء — خاصّة بالمترشّحين الجدد الملتحقين لأول مرة،
       وتخصّ مستوى «التقني المتخصص» فقط (الانتقاء حسب نقط الباكالوريا).
       تُضبط عبر الكائن selection أدناه، وتُعرض في كتلة مستقلّة.

   ---------------------------------------------------------------------
   للتحكّم السهل: عدّل فقط الكائن ISTA_RESULTS أدناه.

   • نتيجة امتحان (داخل program.results):
       cat    : "passage" (المرور) | "final" (نهاية التكوين)
       title  : عنوان النتيجة
       when   : الفترة المعتادة للإعلان (نص حر)
       note   : ملاحظة اختيارية
       status : "waiting" | "published"
       date   : تاريخ الإعلان الفعلي (عند النشر)
       url    : رابط ملف النتائج (صورة أو PDF)

   • نتائج الانتقاء (الكائن selection):
       status      : "waiting" | "published"
       resultDate  : تاريخ إصدار نتائج الانتقاء (نص للعرض)
       deadline    : تاريخ نهاية تأكيد التسجيل (نص للعرض) — عادةً أسبوع بعد الإعلان
       deadlineISO : نفس التاريخ بصيغة ISO لتشغيل العدّاد العكسي،
                     مثال: "2026-09-09T23:59:59"  (اتركه فارغًا لتعطيل العدّاد)
       url         : رابط اللائحة الرسمية للمقبولين
       url2        : رابط لوائح الانتظار (اختياري)

   ➜ لنشر النتائج: غيّر status إلى "published" وأضف resultDate و deadline
     و deadlineISO و url. سيبدأ العدّاد العكسي تلقائيًا نحو أجل تأكيد التسجيل.
   ===================================================================== */
window.ISTA_RESULTS = {

  /* (ب) نتائج الانتقاء — خاصّة بالتقني المتخصص فقط */
  selection: {
    program:     "تسيير المقاولات",
    level:       "تقني متخصص",
    note:        "الانتقاء حسب نقط الباكالوريا ووفق الخريطة التكوينية — لائحة رسمية للمقبولين ولوائح الانتظار حسب عدد المترشّحين المستوفين للشروط.",
    status:      "waiting",
    resultDate:  "",   // تاريخ إصدار النتائج، مثال: "02 شتنبر 2026"
    deadline:    "",   // آخر أجل لتأكيد التسجيل، مثال: "09 شتنبر 2026"
    deadlineISO: "",   // للعدّاد العكسي، مثال: "2026-09-09T23:59:59"
    url:         "",   // اللائحة الرسمية للمقبولين
    url2:        ""    // لوائح الانتظار (اختياري)
  },

  /* (أ) نتائج الامتحانات — حسب كل شعبة */
  programs: [

    /* — تسيير المقاولات — تقني متخصص (سنتان ونصف) — */
    { prog:"تسيير المقاولات", cls:"ts", level:"تقني متخصص", years:"سنتان ونصف", results:[
      { cat:"passage", title:"نتائج المرور إلى السنة الثانية", when:"يونيو", note:"", status:"waiting", date:"", url:"" },
      { cat:"passage", title:"نتائج المرور إلى السنة الثالثة", when:"يونيو", note:"", status:"waiting", date:"", url:"" },
      { cat:"final",   title:"نتائج امتحان نهاية التكوين",      when:"يناير", note:"الناجحون ينالون الدبلوم • للراسبين دورة استدراكية", status:"waiting", date:"", url:"" }
    ]},

    /* — مساعد إداري — تقني (سنتان ونصف) — */
    { prog:"مساعد إداري", cls:"tq", level:"تقني", years:"سنتان ونصف", results:[
      { cat:"passage", title:"نتائج المرور إلى السنة الثانية", when:"يونيو", note:"", status:"waiting", date:"", url:"" },
      { cat:"passage", title:"نتائج المرور إلى السنة الثالثة", when:"يونيو", note:"", status:"waiting", date:"", url:"" },
      { cat:"final",   title:"نتائج امتحان نهاية التكوين",      when:"يناير", note:"الناجحون ينالون الدبلوم • للراسبين دورة استدراكية", status:"waiting", date:"", url:"" }
    ]},

    /* — كهرباء الإنشاءات — التأهيل (سنتان) — */
    { prog:"كهرباء الإنشاءات", cls:"ta", level:"التأهيل", years:"سنتان", results:[
      { cat:"passage", title:"نتائج المرور إلى السنة الثانية", when:"يونيو", note:"للمتدربين في السنة الأولى", status:"waiting", date:"", url:"" },
      { cat:"final",   title:"نتائج امتحان نهاية التكوين",      when:"يونيو", note:"للمتدربين في السنة الثانية", status:"waiting", date:"", url:"" }
    ]},

    /* — مصلح مركبات السيارات — التأهيل (سنتان) — */
    { prog:"مصلح مركبات السيارات", cls:"ta", level:"التأهيل", years:"سنتان", results:[
      { cat:"passage", title:"نتائج المرور إلى السنة الثانية", when:"يونيو", note:"للمتدربين في السنة الأولى", status:"waiting", date:"", url:"" },
      { cat:"final",   title:"نتائج امتحان نهاية التكوين",      when:"يونيو", note:"للمتدربين في السنة الثانية", status:"waiting", date:"", url:"" }
    ]},

    /* — كهرباء البناء — التخصص (سنة واحدة) — */
    { prog:"كهرباء البناء", cls:"sp", level:"التخصص", years:"سنة واحدة", results:[
      { cat:"final",   title:"نتائج امتحان نهاية التكوين",      when:"يونيو", note:"", status:"waiting", date:"", url:"" }
    ]}

  ]
};

(function () {
  "use strict";

  var ROOT = window.ISTA_RESULTS || {};
  var DATA = ROOT.programs || [];
  var tabsBox = document.getElementById("rprogTabs");
  var headBox = document.getElementById("rprogHead");
  var grid = document.getElementById("resultsGrid");
  var selBox = document.getElementById("resultsSelection");
  if (!tabsBox || !grid) return;

  var CAT = {
    passage: {
      label: "المرور",
      tone: "pas",
      icon: '<svg viewBox="0 0 24 24"><path d="M12 19V5"/><path d="M5 12l7-7 7 7"/></svg>'
    },
    final: {
      label: "نهاية التكوين",
      tone: "fin",
      icon: '<svg viewBox="0 0 24 24"><path d="M22 10L12 5 2 10l10 5 10-5z"/><path d="M6 12v5c0 1 3 2.5 6 2.5s6-1.5 6-2.5v-5"/></svg>'
    }
  };

  var current = 0;

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function wireNotify(scope) {
    var btns = scope.querySelectorAll("[data-notify]");
    for (var j = 0; j < btns.length; j++) {
      btns[j].addEventListener("click", function () {
        if (typeof window.ISTAopenNotify === "function") window.ISTAopenNotify();
        else { var c = document.getElementById("contact"); if (c) c.scrollIntoView({ behavior: "smooth" }); }
      });
    }
  }

  function pubCount(prog) {
    var n = 0;
    for (var i = 0; i < prog.results.length; i++)
      if (prog.results[i].status === "published" && prog.results[i].url) n++;
    return n;
  }

  /* ---------- exam result card ---------- */
  function cardHTML(item) {
    var meta = CAT[item.cat] || CAT.final;
    var pub = item.status === "published" && item.url;
    var cls = "rcard " + (pub ? "is-pub" : "is-wait") + " cat-" + meta.tone;

    var top, foot;
    if (pub) {
      top =
        '<div class="rcard-badge"><span class="rc-ribbon">✓ متاحة الآن</span></div>' +
        '<div class="rcard-ico ok"><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg></div>';
      foot =
        '<a class="rc-btn go" href="' + esc(item.url) + '" target="_blank" rel="noopener">' +
          '<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h5"/></svg>' +
          '<span>عرض النتائج</span>' +
        '</a>' +
        (item.date ? '<span class="rc-date">📅 أُعلنت: ' + esc(item.date) + '</span>' : "");
    } else {
      top =
        '<div class="rcard-badge"><span class="rc-ribbon wait">قيد الانتظار</span></div>' +
        '<div class="rcard-ico wait"><span class="rc-pulse"></span>' +
          '<svg viewBox="0 0 24 24"><rect x="4" y="11" width="16" height="9" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/></svg>' +
        '</div>';
      foot =
        '<button class="rc-btn notify" type="button" data-notify="1">' +
          '<svg viewBox="0 0 24 24"><path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 01-3.4 0"/></svg>' +
          '<span>أبلغني عند الإعلان</span>' +
        '</button>' +
        '<span class="rc-hint">تُنشر فور صدورها رسميًا</span>';
    }

    return '<article class="' + cls + '">' +
      '<div class="rcard-top">' + top +
        '<span class="rc-cat"><span class="rc-cat-ico">' + meta.icon + '</span>' + esc(meta.label) + '</span>' +
      '</div>' +
      '<div class="rcard-body">' +
        '<h4 class="rc-level">' + esc(item.title) + '</h4>' +
        (item.when ? '<span class="rc-when">🗓️ عادةً في: <b>' + esc(item.when) + '</b></span>' : '') +
        (item.note ? '<span class="rc-note">' + esc(item.note) + '</span>' : '') +
      '</div>' +
      '<div class="rcard-foot">' + foot + '</div>' +
    '</article>';
  }

  function renderHead(prog) {
    if (!headBox) return;
    var pc = pubCount(prog);
    var total = prog.results.length;
    headBox.innerHTML =
      '<div class="rph-main">' +
        '<span class="rph-badge lv-' + esc(prog.cls) + '">' + esc(prog.level) + '</span>' +
        '<h3 class="rph-name">' + esc(prog.prog) + '</h3>' +
        '<span class="rph-years">⏳ مدة التكوين: ' + esc(prog.years) + '</span>' +
      '</div>' +
      '<div class="rph-stat' + (pc ? ' has' : '') + '">' +
        '<b>' + pc + '</b> من <b>' + total + '</b> نتائج منشورة' +
      '</div>';
  }

  function render() {
    var prog = DATA[current];
    if (!prog) { grid.innerHTML = '<p class="rhub-empty">لا توجد بيانات لعرضها.</p>'; return; }
    renderHead(prog);
    var html = "";
    for (var i = 0; i < prog.results.length; i++) html += cardHTML(prog.results[i]);
    grid.innerHTML = html;
    wireNotify(grid);
  }

  function setTab(idx) {
    current = idx;
    var tabs = tabsBox.querySelectorAll(".rprog-tab");
    for (var i = 0; i < tabs.length; i++) {
      var on = i === idx;
      tabs[i].classList.toggle("on", on);
      tabs[i].setAttribute("aria-selected", on ? "true" : "false");
    }
    render();
  }

  /* ---------- countdown to registration-confirmation deadline ---------- */
  var selTimer = null;
  function pad2(n) { return (n < 10 ? "0" : "") + n; }
  function startCountdown(el) {
    var target = new Date(el.getAttribute("data-deadline")).getTime();
    if (isNaN(target)) return;
    var dE = el.querySelector("[data-d]"), hE = el.querySelector("[data-h]"),
        mE = el.querySelector("[data-m]"), sE = el.querySelector("[data-s]");
    function tick() {
      var diff = target - Date.now();
      if (diff <= 0) {
        el.classList.add("ended");
        el.innerHTML = '<span class="rsc-ended">⛔ انتهى أجل تأكيد التسجيل</span>';
        if (selTimer) { clearInterval(selTimer); selTimer = null; }
        return;
      }
      var t = Math.floor(diff / 1000);
      var d = Math.floor(t / 86400); t -= d * 86400;
      var h = Math.floor(t / 3600);  t -= h * 3600;
      var m = Math.floor(t / 60);    t -= m * 60;
      if (dE) dE.textContent = pad2(d);
      if (hE) hE.textContent = pad2(h);
      if (mE) mE.textContent = pad2(m);
      if (sE) sE.textContent = pad2(t);
    }
    tick();
    selTimer = setInterval(tick, 1000);
  }

  /* ---------- selection block (التقني المتخصص only) ---------- */
  function renderSelection() {
    if (!selBox) return;
    if (selTimer) { clearInterval(selTimer); selTimer = null; }
    var s = ROOT.selection;
    if (!s) { selBox.innerHTML = ""; return; }
    var pub = s.status === "published" && s.url;
    var cls = "rsel-card " + (pub ? "is-pub" : "is-wait");

    var status, actions, extra = "";
    if (pub) {
      status = '<span class="rsel-status pub">✓ متاحة الآن</span>';
      actions =
        '<a class="rc-btn go" href="' + esc(s.url) + '" target="_blank" rel="noopener">' +
          '<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h5"/></svg>' +
          '<span>اللائحة الرسمية للمقبولين</span>' +
        '</a>' +
        (s.url2 ?
          '<a class="rc-btn go2" href="' + esc(s.url2) + '" target="_blank" rel="noopener">' +
            '<svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/></svg>' +
            '<span>لوائح الانتظار</span>' +
          '</a>' : "");

      // date pills: results-issue date + registration-confirmation deadline
      var pills = "";
      if (s.resultDate) pills += '<span class="rsel-dpill"><i>📅</i> إصدار النتائج: <b>' + esc(s.resultDate) + '</b></span>';
      if (s.deadline)   pills += '<span class="rsel-dpill warn"><i>⏰</i> آخر أجل لتأكيد التسجيل: <b>' + esc(s.deadline) + '</b></span>';
      if (pills) extra += '<div class="rsel-dates">' + pills + '</div>';

      // live countdown to the deadline
      if (s.deadlineISO) {
        extra +=
          '<div class="rsel-count" data-deadline="' + esc(s.deadlineISO) + '">' +
            '<span class="rsc-label">⏳ المتبقّي على نهاية تأكيد التسجيل</span>' +
            '<div class="rsc-units">' +
              '<div class="rsc-u"><b data-d>00</b><span>يوم</span></div>' +
              '<div class="rsc-u"><b data-h>00</b><span>ساعة</span></div>' +
              '<div class="rsc-u"><b data-m>00</b><span>دقيقة</span></div>' +
              '<div class="rsc-u"><b data-s>00</b><span>ثانية</span></div>' +
            '</div>' +
          '</div>';
      }
    } else {
      status = '<span class="rsel-status wait">قيد الانتظار</span>';
      actions =
        '<button class="rc-btn notify" type="button" data-notify="1">' +
          '<svg viewBox="0 0 24 24"><path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 01-3.4 0"/></svg>' +
          '<span>أبلغني عند الإعلان</span>' +
        '</button>' +
        '<span class="rc-hint">يُعلن تاريخ النتائج وأجل تأكيد التسجيل فور صدورها</span>';
    }

    selBox.innerHTML =
      '<div class="rsel-head"><span class="rsel-line"></span><span class="rsel-htxt">للمترشّحين الجدد</span><span class="rsel-line"></span></div>' +
      '<div class="' + cls + '">' +
        '<div class="rsel-ico" aria-hidden="true">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12A10 10 0 1112 2"/><path d="M22 4L12 14.01l-3-3"/></svg>' +
        '</div>' +
        '<div class="rsel-body">' +
          '<div class="rsel-tags"><span class="rsel-tag">نتائج الانتقاء</span><span class="rsel-lvl">' + esc(s.level) + '</span>' + status + '</div>' +
          '<h3 class="rsel-title">لائحة المقبولين في الانتقاء</h3>' +
          '<p class="rsel-desc">' + esc(s.note) + '</p>' +
          '<div class="rsel-meta">🎓 الشعبة: <b>' + esc(s.program) + '</b></div>' +
          extra +
        '</div>' +
        '<div class="rsel-actions">' + actions + '</div>' +
      '</div>';
    wireNotify(selBox);
    var cd = selBox.querySelector(".rsel-count");
    if (cd) startCountdown(cd);
  }

  /* ---------- build program tabs ---------- */
  var thtml = "";
  for (var i = 0; i < DATA.length; i++) {
    var p = DATA[i];
    var pc = pubCount(p);
    thtml +=
      '<button class="rprog-tab lv-' + esc(p.cls) + (i === 0 ? ' on' : '') + '" type="button" role="tab"' +
        ' aria-selected="' + (i === 0 ? 'true' : 'false') + '" data-idx="' + i + '">' +
        '<span class="rpt-name">' + esc(p.prog) + '</span>' +
        '<span class="rpt-lvl">' + esc(p.level) + '</span>' +
        (pc ? '<span class="rpt-dot" title="نتائج منشورة"></span>' : '') +
      '</button>';
  }
  tabsBox.innerHTML = thtml;

  var tb = tabsBox.querySelectorAll(".rprog-tab");
  for (var k = 0; k < tb.length; k++) {
    (function (idx, el) {
      el.addEventListener("click", function () { setTab(idx); });
    })(k, tb[k]);
  }

  render();
  renderSelection();

  // Allow re-rendering if the data is updated at runtime.
  window.ISTArefreshResults = function () { render(); renderSelection(); };
})();
