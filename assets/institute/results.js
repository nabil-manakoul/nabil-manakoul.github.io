/* =====================================================================
   بوابة النتائج — قسم النتائج (Data-driven results portal)
   ---------------------------------------------------------------------
   البنية حسب الشعبة: لكل شعبة قائمة أنواع النتائج الخاصة بمستواها.

   للتحكم السهل: عدّل فقط الكائن ISTA_RESULTS أدناه.
   لكل نتيجة الحقول التالية:
     cat    : نوع النتيجة →
                "selection" (الانتقاء — لوائح المقبولين للمتدربين الجدد)
                "passage"   (المرور إلى سنة أعلى)
                "final"     (نهاية التكوين)
     title  : عنوان النتيجة كما يظهر في البطاقة
     when   : الفترة المعتادة للإعلان (نص حر، مثال: "يونيو")
     note   : ملاحظة اختيارية تظهر أسفل العنوان (اتركها فارغة إن لم تلزم)
     status : "waiting"   → لم تُعلن بعد (بطاقة انتظار + زر "أبلغني")
              "published" → مُعلنة (زر "عرض" يفتح الصورة/الـ PDF)
     date   : تاريخ الإعلان الفعلي (يظهر عند النشر) — نص حر
     url    : رابط الملف الرئيسي (صورة أو PDF)
                • للانتقاء: اللائحة الرسمية للمقبولين
                • لباقي النتائج: ملف النتائج
     url2   : رابط ثانوي اختياري (للانتقاء = لوائح الانتظار). اتركه فارغًا
              إن لم يوجد ملف ثانٍ.

   ➜ لنشر نتيجة: غيّر status إلى "published"، وأضف date و url (و url2 للانتقاء).
   ➜ لإضافة نتيجة جديدة: أضف كائنًا جديدًا داخل results الخاصة بالشعبة.
   ===================================================================== */
window.ISTA_RESULTS = {
  programs: [

    /* — تسيير المقاولات — تقني متخصص (3 سنوات) — */
    { prog:"تسيير المقاولات", cls:"ts", level:"تقني متخصص", years:"3 سنوات", results:[
      { cat:"selection", title:"نتائج الانتقاء — لوائح المقبولين", when:"بداية السنة التكوينية", note:"الانتقاء حسب معدلات الباكلوريا ووفق الخريطة التكوينية • لائحة رسمية + لوائح الانتظار", status:"waiting", date:"", url:"", url2:"" },
      { cat:"passage",   title:"نتائج المرور إلى السنة الثانية", when:"يونيو", note:"", status:"waiting", date:"", url:"" },
      { cat:"passage",   title:"نتائج المرور إلى السنة الثالثة", when:"يونيو", note:"", status:"waiting", date:"", url:"" },
      { cat:"final",     title:"نتائج امتحان نهاية التكوين",      when:"يناير", note:"الناجحون ينالون الدبلوم • للراسبين دورة استدراكية", status:"waiting", date:"", url:"" }
    ]},

    /* — مساعد إداري — تقني (3 سنوات) — */
    { prog:"مساعد إداري", cls:"tq", level:"تقني", years:"3 سنوات", results:[
      { cat:"selection", title:"نتائج الانتقاء — لوائح المقبولين", when:"بداية السنة التكوينية", note:"الانتقاء حسب معدلات الباكلوريا ووفق الخريطة التكوينية • لائحة رسمية + لوائح الانتظار", status:"waiting", date:"", url:"", url2:"" },
      { cat:"passage",   title:"نتائج المرور إلى السنة الثانية", when:"يونيو", note:"", status:"waiting", date:"", url:"" },
      { cat:"passage",   title:"نتائج المرور إلى السنة الثالثة", when:"يونيو", note:"", status:"waiting", date:"", url:"" },
      { cat:"final",     title:"نتائج امتحان نهاية التكوين",      when:"يناير", note:"الناجحون ينالون الدبلوم • للراسبين دورة استدراكية", status:"waiting", date:"", url:"" }
    ]},

    /* — كهرباء الإنشاءات — التأهيل (سنتان) — */
    { prog:"كهرباء الإنشاءات", cls:"ta", level:"التأهيل", years:"سنتان", results:[
      { cat:"selection", title:"نتائج الانتقاء — لوائح المقبولين", when:"بداية السنة التكوينية", note:"الانتقاء حسب معدلات الباكلوريا ووفق الخريطة التكوينية • لائحة رسمية + لوائح الانتظار", status:"waiting", date:"", url:"", url2:"" },
      { cat:"passage",   title:"نتائج المرور إلى السنة الثانية", when:"يونيو", note:"للمتدربين في السنة الأولى", status:"waiting", date:"", url:"" },
      { cat:"final",     title:"نتائج امتحان نهاية التكوين",      when:"يونيو", note:"للمتدربين في السنة الثانية", status:"waiting", date:"", url:"" }
    ]},

    /* — مصلح مركبات السيارات — التأهيل (سنتان) — */
    { prog:"مصلح مركبات السيارات", cls:"ta", level:"التأهيل", years:"سنتان", results:[
      { cat:"selection", title:"نتائج الانتقاء — لوائح المقبولين", when:"بداية السنة التكوينية", note:"الانتقاء حسب معدلات الباكلوريا ووفق الخريطة التكوينية • لائحة رسمية + لوائح الانتظار", status:"waiting", date:"", url:"", url2:"" },
      { cat:"passage",   title:"نتائج المرور إلى السنة الثانية", when:"يونيو", note:"للمتدربين في السنة الأولى", status:"waiting", date:"", url:"" },
      { cat:"final",     title:"نتائج امتحان نهاية التكوين",      when:"يونيو", note:"للمتدربين في السنة الثانية", status:"waiting", date:"", url:"" }
    ]},

    /* — كهرباء البناء — التخصص (سنة واحدة) — */
    { prog:"كهرباء البناء", cls:"sp", level:"التخصص", years:"سنة واحدة", results:[
      { cat:"selection", title:"نتائج الانتقاء — لوائح المقبولين", when:"بداية السنة التكوينية", note:"الانتقاء حسب معدلات الباكلوريا ووفق الخريطة التكوينية • لائحة رسمية + لوائح الانتظار", status:"waiting", date:"", url:"", url2:"" },
      { cat:"final",     title:"نتائج امتحان نهاية التكوين",      when:"يونيو", note:"", status:"waiting", date:"", url:"" }
    ]}

  ]
};

(function () {
  "use strict";

  var DATA = (window.ISTA_RESULTS && window.ISTA_RESULTS.programs) || [];
  var tabsBox = document.getElementById("rprogTabs");
  var headBox = document.getElementById("rprogHead");
  var grid = document.getElementById("resultsGrid");
  if (!tabsBox || !grid) return;

  // category metadata: label + accent tone + inline svg icon
  var CAT = {
    selection: {
      label: "الانتقاء",
      tone: "adm",
      icon: '<svg viewBox="0 0 24 24"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>'
    },
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

  function pubCount(prog) {
    var n = 0;
    for (var i = 0; i < prog.results.length; i++)
      if (prog.results[i].status === "published" && prog.results[i].url) n++;
    return n;
  }

  function cardHTML(item) {
    var meta = CAT[item.cat] || CAT.final;
    var pub = item.status === "published" && item.url;
    var cls = "rcard " + (pub ? "is-pub" : "is-wait") + " cat-" + meta.tone;
    var isSel = item.cat === "selection";
    var mainLabel = isSel ? "اللائحة الرسمية" : "عرض النتائج";

    var top, foot;
    if (pub) {
      top =
        '<div class="rcard-badge"><span class="rc-ribbon">✓ متاحة الآن</span></div>' +
        '<div class="rcard-ico ok"><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg></div>';
      foot =
        '<a class="rc-btn go" href="' + esc(item.url) + '" target="_blank" rel="noopener">' +
          '<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h5"/></svg>' +
          '<span>' + mainLabel + '</span>' +
        '</a>' +
        (item.url2 ?
          '<a class="rc-btn go2" href="' + esc(item.url2) + '" target="_blank" rel="noopener">' +
            '<svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/></svg>' +
            '<span>لوائح الانتظار</span>' +
          '</a>' : "") +
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

    var btns = grid.querySelectorAll("[data-notify]");
    for (var j = 0; j < btns.length; j++) {
      btns[j].addEventListener("click", function () {
        if (typeof window.ISTAopenNotify === "function") window.ISTAopenNotify();
        else { var c = document.getElementById("contact"); if (c) c.scrollIntoView({ behavior: "smooth" }); }
      });
    }
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

  // build program tabs
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
})();
