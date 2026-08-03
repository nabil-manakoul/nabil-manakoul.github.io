/* =====================================================================
   بوابة النتائج — قسم النتائج (Data-driven results portal)
   ---------------------------------------------------------------------
   للتحكم السهل: عدّل فقط الكائن ISTA_RESULTS أدناه.
   لكل بطاقة (مستوى/شعبة) الحقول التالية:
     level  : اسم الشعبة (يظهر عنوانًا للبطاقة)
     cls    : لون/تصنيف المستوى  →  "ts" تقني متخصص | "tq" تقني |
              "ta" التأهيل | "sp" التخصص
     tag    : نص الشارة المعروضة (مثال: "تقني متخصص")
     status : "waiting"  → لم تُعلن بعد (تظهر بحالة انتظار)
              "published"→ مُعلنة (يظهر زر عرض النتائج)
     date   : تاريخ الإعلان (يظهر فقط عند النشر) — نص حر، اتركه فارغًا إن لم يتوفّر
     url    : رابط لائحة النتائج (PDF/صفحة) — يُفعَّل زر العرض عند وضعه

   لنشر نتيجة مستوى: غيّر status إلى "published"، وأضف date و url. فقط.
   ===================================================================== */
window.ISTA_RESULTS = {
  // نتائج الانتقاء (لوائح المقبولين)
  selection: [
    { level: "تسيير المقاولات",        cls: "ts", tag: "تقني متخصص", status: "waiting", date: "", url: "" },
    { level: "مساعد إداري",            cls: "tq", tag: "تقني",       status: "waiting", date: "", url: "" },
    { level: "كهرباء الإنشاءات",        cls: "ta", tag: "التأهيل",    status: "waiting", date: "", url: "" },
    { level: "مصلح مركبات السيارات",    cls: "ta", tag: "التأهيل",    status: "waiting", date: "", url: "" },
    { level: "كهرباء البناء",          cls: "sp", tag: "التخصص",     status: "waiting", date: "", url: "" }
  ],
  // نتائج نهاية السنة التكوينية
  final: [
    { level: "تسيير المقاولات",        cls: "ts", tag: "تقني متخصص", status: "waiting", date: "", url: "" },
    { level: "مساعد إداري",            cls: "tq", tag: "تقني",       status: "waiting", date: "", url: "" },
    { level: "كهرباء الإنشاءات",        cls: "ta", tag: "التأهيل",    status: "waiting", date: "", url: "" },
    { level: "مصلح مركبات السيارات",    cls: "ta", tag: "التأهيل",    status: "waiting", date: "", url: "" },
    { level: "كهرباء البناء",          cls: "sp", tag: "التخصص",     status: "waiting", date: "", url: "" }
  ]
};

(function () {
  "use strict";

  var DATA = window.ISTA_RESULTS || { selection: [], final: [] };

  var grid = document.getElementById("resultsGrid");
  var toggle = document.getElementById("rhubToggle");
  if (!grid || !toggle) return;

  var LEVEL_LABEL = {
    ts: "تقني متخصص", tq: "تقني", ta: "التأهيل", sp: "التخصص"
  };

  var current = "selection";

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function countPublished(list) {
    var n = 0;
    for (var i = 0; i < list.length; i++) if (list[i].status === "published") n++;
    return n;
  }

  function cardHTML(item, kind) {
    var pub = item.status === "published" && item.url;
    var cls = "rcard " + (pub ? "is-pub" : "is-wait") + " lv-" + esc(item.cls);
    var actionLabel = kind === "selection" ? "لائحة المقبولين" : "نتائج نهاية السنة";

    var media, foot;
    if (pub) {
      media =
        '<div class="rcard-badge"><span class="rc-ribbon">✓ متاحة الآن</span></div>' +
        '<div class="rcard-ico ok">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>' +
        '</div>';
      foot =
        '<a class="rc-btn go" href="' + esc(item.url) + '" target="_blank" rel="noopener">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h5"/></svg>' +
          '<span>عرض ' + actionLabel + '</span>' +
        '</a>' +
        (item.date ? '<span class="rc-date">📅 أُعلنت: ' + esc(item.date) + '</span>' : "");
    } else {
      media =
        '<div class="rcard-badge"><span class="rc-ribbon wait">قيد الانتظار</span></div>' +
        '<div class="rcard-ico wait" aria-hidden="true">' +
          '<span class="rc-pulse"></span>' +
          '<svg viewBox="0 0 24 24"><rect x="4" y="11" width="16" height="9" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/></svg>' +
        '</div>';
      foot =
        '<button class="rc-btn notify" type="button" data-notify="1">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 01-3.4 0"/></svg>' +
          '<span>أبلغني عند الإعلان</span>' +
        '</button>' +
        '<span class="rc-hint">ستُنشر فور صدورها رسميًا</span>';
    }

    return '<article class="' + cls + '">' +
      '<div class="rcard-top">' + media + '</div>' +
      '<div class="rcard-body">' +
        '<span class="rc-tag">' + esc(item.tag || LEVEL_LABEL[item.cls] || "") + '</span>' +
        '<h4 class="rc-level">' + esc(item.level) + '</h4>' +
      '</div>' +
      '<div class="rcard-foot">' + foot + '</div>' +
    '</article>';
  }

  function render() {
    var list = DATA[current] || [];
    var html = "";
    for (var i = 0; i < list.length; i++) html += cardHTML(list[i], current);
    grid.innerHTML = html || '<p class="rhub-empty">لا توجد بيانات لعرضها حاليًا.</p>';

    // wire notify buttons
    var btns = grid.querySelectorAll("[data-notify]");
    for (var j = 0; j < btns.length; j++) {
      btns[j].addEventListener("click", function () {
        if (typeof window.ISTAopenNotify === "function") {
          window.ISTAopenNotify();
        } else {
          var c = document.getElementById("contact");
          if (c) c.scrollIntoView({ behavior: "smooth" });
        }
      });
    }
  }

  function setTab(kind, btn) {
    current = kind;
    var tabs = toggle.querySelectorAll(".rhub-tab");
    for (var i = 0; i < tabs.length; i++) {
      var on = tabs[i] === btn;
      tabs[i].classList.toggle("on", on);
      tabs[i].setAttribute("aria-selected", on ? "true" : "false");
    }
    render();
  }

  // build toggle labels with published-count pills
  var selCount = countPublished(DATA.selection || []);
  var finCount = countPublished(DATA.final || []);

  toggle.innerHTML =
    '<button class="rhub-tab on" type="button" role="tab" aria-selected="true" data-kind="selection">' +
      '<span class="rt-ico">🎯</span><span class="rt-txt">نتائج الانتقاء</span>' +
      (selCount ? '<span class="rt-pill">' + selCount + '</span>' : '') +
    '</button>' +
    '<button class="rhub-tab" type="button" role="tab" aria-selected="false" data-kind="final">' +
      '<span class="rt-ico">🏆</span><span class="rt-txt">نتائج نهاية السنة التكوينية</span>' +
      (finCount ? '<span class="rt-pill">' + finCount + '</span>' : '') +
    '</button>' +
    '<span class="rhub-slider" aria-hidden="true"></span>';

  var tabBtns = toggle.querySelectorAll(".rhub-tab");
  for (var k = 0; k < tabBtns.length; k++) {
    (function (b) {
      b.addEventListener("click", function () {
        setTab(b.getAttribute("data-kind"), b);
        toggle.classList.toggle("at-final", b.getAttribute("data-kind") === "final");
      });
    })(tabBtns[k]);
  }

  render();
})();
