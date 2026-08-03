// ISTA Tafraout — interactions
(function(){
  // Mobile menu
  var burger = document.querySelector('.burger');
  var menu = document.getElementById('menu');
  if(burger && menu){
    burger.addEventListener('click', function(){
      menu.classList.toggle('open');
    });
    menu.addEventListener('click', function(e){
      if(e.target.closest('a')) menu.classList.remove('open');
    });
    // Close the dropdown when tapping/clicking outside it
    document.addEventListener('click', function(e){
      if(menu.classList.contains('open') && !menu.contains(e.target) && !burger.contains(e.target)){
        menu.classList.remove('open');
      }
    });
  }

  // Auto-hide header on scroll down, reveal on scroll up (keeps content visible)
  (function autoHideHeader(){
    var header = document.querySelector('.header');
    if(!header) return;
    var lastY = window.pageYOffset || 0;
    var ticking = false;
    function update(){
      var y = window.pageYOffset || 0;
      var menuOpen = menu && menu.classList.contains('open');
      if(!menuOpen && y > 200 && y > lastY + 4){
        header.classList.add('nav-hidden');       // scrolling down
      } else if(y < lastY - 4 || y < 200){
        header.classList.remove('nav-hidden');     // scrolling up / near top
      }
      lastY = y;
      ticking = false;
    }
    window.addEventListener('scroll', function(){
      if(!ticking){ window.requestAnimationFrame(update); ticking = true; }
    }, {passive:true});
  })();

  // Reveal on scroll
  var items = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, {threshold:0.12});
    items.forEach(function(el){ io.observe(el); });
  } else {
    items.forEach(function(el){ el.classList.add('in'); });
  }

  // Animated counters
  function animate(el){
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    var dur = 1400, start = null;
    function step(ts){
      if(!start) start = ts;
      var p = Math.min((ts - start)/dur, 1);
      var val = Math.floor(p * target);
      el.textContent = val.toLocaleString('ar-MA') + suffix;
      if(p < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString('ar-MA') + suffix;
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll('[data-count]');
  if('IntersectionObserver' in window){
    var co = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){ animate(en.target); co.unobserve(en.target); }
      });
    }, {threshold:0.5});
    counters.forEach(function(el){ co.observe(el); });
  } else {
    counters.forEach(animate);
  }

  // Footer year
  var y = document.getElementById('year');
  if(y) y.textContent = new Date().getFullYear();

  // News ticker — elegant announcement bar (auto-rotating every 5 seconds)
  (function newsTicker(){
    var box = document.getElementById('newsTicker');
    if(!box) return;
    var el = box.querySelector('.trot-current');
    var icoEl = box.querySelector('.tk-ico');
    var catEl = box.querySelector('.tk-cat');
    var headEl = box.querySelector('.tk-head');
    var segsWrap = box.querySelector('.trot-segs');
    if(!el || !headEl || !segsWrap) return;
    var items = [
      {ico:'📝', cat:'التسجيل',     t:'انتهت آجال التسجيل الأولي لموسم 2026/2027 — بعض الشعب قد تُفتح عبر دراسة الملفات', href:'#dates'},
      {ico:'🌐', cat:'بوابة MyWay', t:'التسجيل الأولي يتم إلكترونيًا عبر بوابة MyWay — myway.ac.ma', href:'#registration'},
      {ico:'📄', cat:'النتائج',      t:'نتائج الانتقاء ونهاية السنة التكوينية تُنشر بالمعهد وعبر الموقع', href:'#results'},
      {ico:'🖥️', cat:'جديد',        t:'فضاء المتدربين متاح للاطلاع على نتائجك بالرمز الوطني والرمز السري', href:'#spaces'},
      {ico:'📚', cat:'المكتبة',      t:'حمّل النظام الداخلي للمعهد من المكتبة الرقمية', href:'#library'},
      {ico:'🏠', cat:'الإيواء',      t:'الداخلية والمطعم متوفّران للمتدربين القادمين من مناطق بعيدة', href:'#facilities'}
    ];
    var i = 0, timer;
    items.forEach(function(_, n){
      var b = document.createElement('button');
      b.type = 'button'; b.setAttribute('aria-label', 'الخبر ' + (n+1));
      b.appendChild(document.createElement('i'));
      b.addEventListener('click', function(){ show(n); reset(); });
      segsWrap.appendChild(b);
    });
    var segs = segsWrap.querySelectorAll('button');
    function paintSegs(){
      segs.forEach(function(s, n){
        s.classList.toggle('on', n === i);
        s.classList.toggle('done', n < i);
        var f = s.querySelector('i'); if(f) f.classList.remove('run');
      });
      void segsWrap.offsetWidth; // reflow to restart the fill animation
      var af = segs[i] && segs[i].querySelector('i');
      if(af) af.classList.add('run');
    }
    function render(){
      var it = items[i];
      if(icoEl) icoEl.textContent = it.ico;
      if(catEl) catEl.textContent = it.cat;
      headEl.textContent = it.t;
      el.setAttribute('href', it.href);
    }
    function show(n){
      i = (n + items.length) % items.length;
      el.classList.add('swap');
      setTimeout(function(){
        render();
        el.classList.remove('swap');
        paintSegs();
      }, 300);
    }
    function next(){ show(i + 1); }
    function prev(){ show(i - 1); }
    function start(){ timer = setInterval(next, 5000); }
    function reset(){ clearInterval(timer); start(); }
    function armActive(){ var af = segs[i] && segs[i].querySelector('i'); if(af){ af.classList.remove('run'); void af.offsetWidth; af.classList.add('run'); } }
    box.querySelector('.trot-next').addEventListener('click', function(){ next(); reset(); });
    box.querySelector('.trot-prev').addEventListener('click', function(){ prev(); reset(); });
    box.addEventListener('mouseenter', function(){ clearInterval(timer); });
    box.addEventListener('mouseleave', function(){ start(); armActive(); });
    render(); paintSegs();
    start();
  })();

  // Intro video — custom play button toggles native playback
  (function introVideo(){
    var box = document.querySelector('.promo-video');
    if(!box) return;
    var v = box.querySelector('video');
    var play = box.querySelector('.pv-play');
    if(!v) return;
    if(play) play.addEventListener('click', function(){ v.play(); });
    v.addEventListener('play',  function(){ box.classList.add('playing'); });
    v.addEventListener('pause', function(){ box.classList.remove('playing'); });
    v.addEventListener('ended', function(){ box.classList.remove('playing'); });
  })();

  // Activity video gallery — play buttons
  document.querySelectorAll('.vid-frame').forEach(function(frame){
    var v = frame.querySelector('video');
    var btn = frame.querySelector('.vid-play');
    if(!v) return;
    if(btn) btn.addEventListener('click', function(){ v.play(); });
    v.addEventListener('play',  function(){ frame.classList.add('playing'); });
    v.addEventListener('pause', function(){ frame.classList.remove('playing'); });
    v.addEventListener('ended', function(){ frame.classList.remove('playing'); });
  });

  // Tab sets (scoped per container)
  document.querySelectorAll('.tabset').forEach(function(set){
    var tabs = set.querySelectorAll('.tab');
    tabs.forEach(function(tab){
      tab.addEventListener('click', function(){
        var panelId = tab.getAttribute('data-panel');
        tabs.forEach(function(t){ t.classList.remove('is-active'); t.setAttribute('aria-selected','false'); });
        tab.classList.add('is-active'); tab.setAttribute('aria-selected','true');
        set.querySelectorAll('.tab-panel').forEach(function(p){
          p.classList.toggle('is-active', p.id === panelId);
        });
      });
    });
  });

  // Back to top
  var toTop = document.getElementById('toTop');
  if(toTop){
    window.addEventListener('scroll', function(){
      toTop.classList.toggle('show', window.scrollY > 600);
    }, {passive:true});
    toTop.addEventListener('click', function(){
      window.scrollTo({ top:0, behavior:'smooth' });
    });
  }

  // Contact form -> compose email
  var form = document.getElementById('contactForm');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      if(!form.checkValidity()){ form.reportValidity(); return; }
      var g = function(id){ var el = document.getElementById(id); return el ? el.value.trim() : ''; };
      var subject = 'رسالة من الموقع: ' + (g('cf-subject') || 'استفسار');
      var body =
        'الاسم: ' + g('cf-name') + '\n' +
        'البريد: ' + g('cf-email') + '\n' +
        'الهاتف: ' + g('cf-phone') + '\n\n' +
        g('cf-message');
      var mail = 'mailto:contact@ista-tafraout.ma?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      var status = document.getElementById('formStatus');
      if(status) status.classList.add('show');
      window.location.href = mail;
    });
  }

  // ===== Registration status badges (auto open/closed) =====
  (function regStatus(){
    var cards = document.querySelectorAll('.date[data-deadline], .date[data-status]');
    if(!cards.length) return;
    var today = new Date(); today.setHours(0,0,0,0);
    cards.forEach(function(c){
      var badge = c.querySelector('.reg-badge');
      if(!badge) return;
      if(c.getAttribute('data-status') === 'seats'){
        badge.className = 'reg-badge rb-seats';
        badge.textContent = '⏳ حسب توفّر المقاعد';
        return;
      }
      var dl = new Date(c.getAttribute('data-deadline')); dl.setHours(23,59,59,0);
      if(today > dl){
        c.classList.add('is-closed');
        badge.className = 'reg-badge rb-closed';
        badge.textContent = '🔒 التسجيل مغلق';
      } else {
        badge.className = 'reg-badge rb-open';
        badge.textContent = '✅ التسجيل مفتوح';
      }
    });
  })();

  // ===== Carousels (auto every 5s) =====
  document.querySelectorAll('.carousel').forEach(function(root){
    var viewport = root.querySelector('.car-viewport');
    var track = root.querySelector('.car-track');
    var slides = Array.prototype.slice.call(track.children);
    var dotsWrap = root.querySelector('.car-dots');
    var index = 0, timer, dots = [];

    function slideW(){ return slides[0].getBoundingClientRect().width || 1; }
    function perView(){ return Math.max(1, Math.round(viewport.clientWidth / slideW())); }
    function maxIndex(){ return Math.max(0, slides.length - perView()); }
    function apply(){ track.style.transform = 'translateX(' + (-index * slideW()) + 'px)'; paintDots(); }
    function goIndex(i){ index = Math.min(Math.max(i, 0), maxIndex()); apply(); }
    function nextPage(){ var p = perView(); goIndex(index >= maxIndex() ? 0 : index + p); }
    function prevPage(){ var p = perView(); goIndex(index <= 0 ? maxIndex() : index - p); }

    function buildDots(){
      var p = perView();
      var pages = Math.max(1, maxIndex() === 0 ? 1 : Math.ceil((maxIndex() + 1) / p));
      dotsWrap.innerHTML = ''; dots = [];
      for(var k = 0; k < pages; k++){
        (function(k){
          var btn = document.createElement('button');
          btn.type = 'button'; btn.setAttribute('aria-label', 'مجموعة ' + (k + 1));
          btn.addEventListener('click', function(){ goIndex(Math.min(k * p, maxIndex())); reset(); });
          dotsWrap.appendChild(btn); dots.push(btn);
        })(k);
      }
      paintDots();
    }
    function paintDots(){
      var p = perView();
      var active = Math.min(dots.length - 1, Math.round(index / p));
      dots.forEach(function(d, n){ d.classList.toggle('on', n === active); });
    }
    function start(){ clearInterval(timer); timer = setInterval(nextPage, 5000); }
    function reset(){ start(); }

    root.querySelector('.car-next').addEventListener('click', function(){ nextPage(); reset(); });
    root.querySelector('.car-prev').addEventListener('click', function(){ prevPage(); reset(); });
    root.addEventListener('mouseenter', function(){ clearInterval(timer); });
    root.addEventListener('mouseleave', start);
    var rt;
    window.addEventListener('resize', function(){ clearTimeout(rt); rt = setTimeout(function(){ index = Math.min(index, maxIndex()); buildDots(); apply(); }, 160); });

    buildDots(); apply(); start();
  });

  // ===== Reviews (localStorage persistence) =====
  (function initReviews(){
    var list = document.getElementById('reviewsList');
    if(!list) return;
    var KEY = 'ista_reviews_v1';
    var seed = [
      {name:'أميمة', role:'متدرّبة — تسيير المقاولات', rating:5, text:'تكوين عملي وأساتذة متعاونون، استفدت كثيرًا من التداريب بالمقاولات.'},
      {name:'يوسف', role:'متدرّب — مصلح مركبات السيارات', rating:4, text:'ورشات مجهّزة وجوّ دراسي محفّز على التعلّم.'},
      {name:'سعاد', role:'متدرّبة — مساعد إداري', rating:5, text:'الداخلية والمطعم سهّلا عليّ الدراسة كوني قادمة من منطقة بعيدة.'}
    ];
    var stored = [];
    try{ stored = JSON.parse(localStorage.getItem(KEY)) || []; }catch(e){}
    var reviews = seed.concat(stored);

    function esc(s){ return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); }
    function starHtml(n){ var s=''; for(var i=1;i<=5;i++){ s+='<span class="'+(i<=n?'':'off')+'">★</span>'; } return s; }
    function render(){
      list.innerHTML = reviews.map(function(r){
        return '<div class="review-card"><div class="rc-head"><span class="rc-avatar">'+esc((r.name||'?').charAt(0))+
          '</span><span class="rc-who"><b>'+esc(r.name)+'</b><span>'+esc(r.role||'')+'</span></span>'+
          '<span class="rc-stars">'+starHtml(r.rating)+'</span></div><p>'+esc(r.text)+'</p></div>';
      }).join('');
      var avg = reviews.reduce(function(a,r){return a+r.rating;},0)/reviews.length;
      document.getElementById('avgScore').textContent = avg.toFixed(1);
      document.getElementById('avgStars').innerHTML = starHtml(Math.round(avg));
      document.getElementById('revCount').textContent = reviews.length;
    }

    var rating = 0;
    var starWrap = document.getElementById('starInput');
    var stars = starWrap ? Array.prototype.slice.call(starWrap.querySelectorAll('.star')) : [];
    function paint(v){ stars.forEach(function(s){ s.classList.toggle('on', parseInt(s.getAttribute('data-v'),10)<=v); }); }
    stars.forEach(function(s){
      s.addEventListener('mouseenter', function(){ paint(parseInt(s.getAttribute('data-v'),10)); });
      s.addEventListener('click', function(){ rating = parseInt(s.getAttribute('data-v'),10); paint(rating); });
    });
    if(starWrap) starWrap.addEventListener('mouseleave', function(){ paint(rating); });

    var rForm = document.getElementById('reviewForm');
    if(rForm) rForm.addEventListener('submit', function(e){
      e.preventDefault();
      var name = document.getElementById('rv-name').value.trim();
      var role = document.getElementById('rv-role').value.trim();
      var text = document.getElementById('rv-msg').value.trim();
      if(!rating){ alert('يرجى اختيار عدد النجوم لتقييمك.'); return; }
      if(!name || !text){ rForm.reportValidity(); return; }
      var rev = {name:name, role:role, rating:rating, text:text};
      reviews.push(rev); stored.push(rev);
      try{ localStorage.setItem(KEY, JSON.stringify(stored)); }catch(e){}
      render();
      rForm.reset(); rating=0; paint(0);
      var st = document.getElementById('revStatus');
      if(st){ st.classList.add('show'); setTimeout(function(){ st.classList.remove('show'); }, 4000); }
      document.getElementById('reviewsList').lastElementChild.scrollIntoView({behavior:'smooth', block:'center'});
    });

    render();
  })();

  // ===== Program details modal =====
  (function progDetails(){
    var modal = document.getElementById('progModal');
    if(!modal) return;
    var pmTitle = document.getElementById('pmTitle');
    var pmLevel = document.getElementById('pmLevel');
    var pmSector = document.getElementById('pmSector');
    var pmBody = document.getElementById('pmBody');
    function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
    var data = {
      'assistant-admin': {
        title:'مساعد إداري', level:'تقني', sector:'قطاع التدبير والتجارة',
        def:'يمنح الجذع المشترك لشعبة مساعد إداري للمتدرّب الكفايات اللازمة لاكتشاف مهن التدبير والتجارة، وضمان تعدّد مهاراته وتيسير اختياره للتخصّص المهني الأنسب لملفه.',
        options:['تخصص تجارة','تخصص تدبير','تخصص محاسبة'],
        access:[
          'السن: ألّا يتجاوز 30 سنة في فاتح شتنبر من السنة الجارية (أو 33 سنة للمستفيدين من نظام الجسور).',
          'المستوى الدراسي: إتمام السنة الثانية من سلك البكالوريا، أو التوفّر على دبلوم من مستوى التأهيل حسب جدول المعادلة.',
          'شُعب البكالوريا: جميع الشعب.',
          'القدرات والمؤهلات: مهارات ممتازة في التواصل الكتابي والشفهي؛ القدرة على التنظيم وتدبير الأولويات واحترام الآجال؛ المرونة العملية وحلّ المشكلات؛ الصبر والموثوقية.'
        ],
        prospects:'يزاول مساعد إداري مهامه داخل المقاولات الصغرى والمتوسطة (PME/PMI) والمقاولات الكبرى العمومية أو الخاصة، في مجالات التجارة والتدبير والمحاسبة حسب التخصّص المختار في السنة الثانية.'
      },
      'gestion-entreprises': {
        title:'تسيير المقاولات', level:'تقني متخصص', sector:'قطاع التدبير والتجارة',
        def:'يمتلك التقني المتخصص في تسيير المقاولات مستوىً من الممارسة في تقنيات التسيير، وخاصةً في التسويق والمالية، ما يؤهّله لشغل وظيفة مُسيّر عملياتي. وحسب حجم المقاولة، قد ينضمّ إلى فريق أو يتولّى وظيفةً كاملة أو جزءًا منها؛ وفي المقاولات الصغرى والمتوسطة يكون المتعاون المباشر لرئيس المقاولة، يقدّم له الدعم والمشورة في الجوانب المالية والتجارية والقانونية والموارد البشرية واللوجستيك.',
        access:[
          'السن: ألّا يتجاوز 30 سنة في فاتح شتنبر من السنة الجارية (أو 33 سنة للمستفيدين من نظام الجسور).',
          'المستوى الدراسي: الحصول على شهادة البكالوريا.',
          'شُعب البكالوريا: حسب جدول المعادلة المعتمد للسنة الجارية.'
        ],
        competencies:[
          'مسك المحاسبة العامة للمقاولة (يدويًا ومعلوماتيًا)',
          'إنجاز دراسة السوق',
          'القيام بالتدبير التجاري',
          'تدبير المعطيات التقنية للإنتاج',
          'ضمان تدبير الخزينة',
          'مسك المحاسبة التحليلية',
          'مسك التدبير الميزانياتي',
          'تدبير خطّ إنتاج (منتوج)',
          'مسك تدبير المخزون',
          'إنجاز دراسات بيئية',
          'إنجاز تحليل المناصب وإعداد مخططات التكوين'
        ],
        prospects:'يؤهّل هذا التكوين لشغل وظيفة مُسيّر عملياتي داخل المقاولات، والعمل كمتعاون مباشر لرئيس المقاولة بالمقاولات الصغرى والمتوسطة، مع تقديم الدعم والمشورة في الجوانب المالية والتجارية والقانونية والموارد البشرية واللوجستيك.'
      },
      'elec-installations': {title:'كهرباء الإنشاءات', level:'التأهيل', sector:'قطاع الكهرباء', soon:true},
      'reparateur-auto': {title:'مصلح مركبات السيارات', level:'التأهيل', sector:'قطاع الميكانيك', soon:true},
      'elec-batiment': {title:'كهرباء البناء', level:'التخصص', sector:'قطاع الكهرباء', soon:true}
    };
    function sec(icon, title, body, bg){
      return '<div class="pm-sec"><div class="pm-sec-title"><span class="ic" style="background:'+bg+'">'+icon+'</span>'+title+'</div>'+body+'</div>';
    }
    function list(arr){ return '<ul class="pm-list">'+arr.map(function(a){ return '<li>'+esc(a)+'</li>'; }).join('')+'</ul>'; }
    function build(d){
      if(d.soon){ return '<div class="pm-soon">📝 تفاصيل هذه الشعبة (التعريف · شروط الولوج · الآفاق) قيد الإعداد وستُضاف قريبًا.</div>'; }
      var opts = d.options ? '<div class="pm-options">'+d.options.map(function(o){ return '<span>'+esc(o)+'</span>'; }).join('')+'</div>' : '';
      var html = sec('📋','التعريف بالشعبة','<p>'+esc(d.def)+'</p>'+opts,'#eef5f8');
      if(d.access) html += sec('✅','شروط الولوج', list(d.access), '#e8f5ec');
      if(d.competencies) html += sec('🛠️','الكفايات والمهام', list(d.competencies), '#eef4fb');
      if(d.prospects) html += sec('🚀','آفاق الشعبة','<p>'+esc(d.prospects)+'</p>','#fdeee9');
      return html;
    }
    function open(key){
      var d = data[key]; if(!d) return;
      pmTitle.textContent = d.title; pmLevel.textContent = d.level; pmSector.textContent = d.sector;
      pmBody.innerHTML = build(d);
      modal.classList.add('open'); document.body.classList.add('pm-active'); document.body.style.overflow = 'hidden';
      var box = modal.querySelector('.pm-box'); if(box) box.scrollTop = 0;
    }
    function close(){ modal.classList.remove('open'); document.body.classList.remove('pm-active'); document.body.style.overflow = ''; }
    document.querySelectorAll('.prog-more').forEach(function(b){
      b.addEventListener('click', function(){ open(b.getAttribute('data-prog')); });
    });
    modal.querySelector('.pm-close').addEventListener('click', close);
    modal.addEventListener('click', function(e){ if(e.target === modal) close(); });
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && modal.classList.contains('open')) close(); });
  })();

  // ===== Interactive lightbox for galleries =====
  var galleryEls = Array.prototype.slice.call(document.querySelectorAll('.gallery, .car-track'));
  var allFigures = [];
  galleryEls.forEach(function(g){
    Array.prototype.slice.call(g.querySelectorAll('figure')).forEach(function(f){
      if(f.querySelector('img')) allFigures.push(f);
    });
  });

  if(allFigures.length){
    // Build overlay
    var lb = document.createElement('div');
    lb.className = 'lb';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.innerHTML =
      '<button class="lb-close" aria-label="إغلاق">✕</button>' +
      '<span class="lb-count"></span>' +
      '<button class="lb-btn lb-prev" aria-label="السابق">❯</button>' +
      '<div class="lb-stage"><img alt=""></div>' +
      '<button class="lb-btn lb-next" aria-label="التالي">❮</button>' +
      '<div class="lb-cap"></div>';
    document.body.appendChild(lb);

    var lbImg = lb.querySelector('.lb-stage img');
    var lbCap = lb.querySelector('.lb-cap');
    var lbCount = lb.querySelector('.lb-count');
    var group = [];   // figures of the active gallery
    var current = 0;

    function itemAt(i){
      var img = group[i].querySelector('img');
      var cap = group[i].querySelector('figcaption');
      return { src: img.getAttribute('src'), alt: img.getAttribute('alt') || '', cap: cap ? cap.textContent : '' };
    }
    function show(i){
      current = (i + group.length) % group.length;
      var it = itemAt(current);
      lbImg.setAttribute('src', it.src);
      lbImg.setAttribute('alt', it.alt);
      lbCap.textContent = it.cap;
      lbCount.textContent = (current + 1) + ' / ' + group.length;
    }
    function open(g, i){ group = g; show(i); lb.classList.add('open'); document.body.classList.add('lb-active'); document.body.style.overflow = 'hidden'; }
    function close(){ lb.classList.remove('open'); document.body.classList.remove('lb-active'); document.body.style.overflow = ''; }
    function next(){ show(current + 1); }
    function prev(){ show(current - 1); }

    // Each gallery navigates within its own set of figures
    galleryEls.forEach(function(g){
      var figs = Array.prototype.slice.call(g.querySelectorAll('figure')).filter(function(f){ return f.querySelector('img'); });
      figs.forEach(function(f, i){
        f.addEventListener('click', function(){ open(figs, i); });
      });
    });
    lb.querySelector('.lb-close').addEventListener('click', close);
    lb.querySelector('.lb-next').addEventListener('click', function(e){ e.stopPropagation(); next(); });
    lb.querySelector('.lb-prev').addEventListener('click', function(e){ e.stopPropagation(); prev(); });
    lb.addEventListener('click', function(e){ if(e.target === lb) close(); });
    document.addEventListener('keydown', function(e){
      if(!lb.classList.contains('open')) return;
      if(e.key === 'Escape') close();
      else if(e.key === 'ArrowLeft') next();   // RTL: left = next
      else if(e.key === 'ArrowRight') prev();  // RTL: right = previous
    });

    // Basic swipe support on touch devices
    var sx = 0;
    lb.addEventListener('touchstart', function(e){ sx = e.changedTouches[0].clientX; }, {passive:true});
    lb.addEventListener('touchend', function(e){
      var dx = e.changedTouches[0].clientX - sx;
      if(Math.abs(dx) > 45){ dx < 0 ? next() : prev(); }
    }, {passive:true});
  }
})();

// ============================================================
// Notifications opt-in — appears once on site entry.
// Collects an email or phone to send real-time updates.
// Stores locally now; POSTs to the institute backend once hosted
// (set window.ISTA_SUBSCRIBE_URL, e.g. "/api/subscribe"). See BACKEND-PLAN.md.
// ============================================================
(function notifyOptIn(){
  var KEY = 'ista_notify_v1';
  var REASK_DAYS = 7;
  // ضع هنا رابط نموذج Formspree الخاص بك لتصلك الاشتراكات على بريدك.
  // مثال: 'https://formspree.io/f/xxxxxxx'  (اتركه فارغًا لتعطيل الإرسال)
  var FORMSPREE_ENDPOINT = '';
  function getState(){ try{ return JSON.parse(localStorage.getItem(KEY)) || null; }catch(_){ return null; } }
  function setState(o){ try{ localStorage.setItem(KEY, JSON.stringify(o)); }catch(_){} }
  function shouldShow(){
    var s = getState();
    if(!s) return true;
    if(s.status === 'subscribed') return false;
    if(s.status === 'dismissed'){
      var days = (Date.now() - (s.at || 0)) / 86400000;
      return days >= REASK_DAYS;
    }
    return true;
  }
  if(!shouldShow()) return;

  var mode = 'email';
  var wrap = document.createElement('div');
  wrap.className = 'nmodal';
  wrap.setAttribute('role', 'dialog');
  wrap.setAttribute('aria-modal', 'true');
  wrap.setAttribute('aria-label', 'الاشتراك في الإشعارات');
  wrap.innerHTML =
    '<div class="nmodal-card" role="document">' +
      '<button class="nmodal-close" type="button" aria-label="إغلاق">✕</button>' +
      '<div class="nmodal-ico" aria-hidden="true">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 01-3.4 0"/></svg>' +
      '</div>' +
      '<h3 class="nmodal-title">ابقَ على اطّلاع بآخر المستجدات</h3>' +
      '<p class="nmodal-sub">اشترك لتصلك <b>إشعارات فورية</b> عند نشر مستجدات مهمة: فتح التسجيل، النتائج، التواريخ والمباريات.</p>' +
      '<div class="nmodal-tabs" role="tablist">' +
        '<button type="button" class="nmodal-tab on" data-mode="email">✉️ البريد الإلكتروني</button>' +
        '<button type="button" class="nmodal-tab" data-mode="phone">📱 رقم الهاتف</button>' +
      '</div>' +
      '<form class="nmodal-form" novalidate>' +
        '<input class="nmodal-input" type="email" name="val" dir="ltr" placeholder="you@example.com" autocomplete="email">' +
        '<div class="nmodal-err" aria-live="polite"></div>' +
        '<button type="submit" class="btn btn-primary nmodal-submit">تفعيل الإشعارات</button>' +
      '</form>' +
      '<button type="button" class="nmodal-later">ليس الآن</button>' +
      '<p class="nmodal-note">🔒 نحترم خصوصيتك — تُستعمل بياناتك فقط لإرسال مستجدات المعهد، ويمكنك إلغاء الاشتراك في أي وقت.</p>' +
      '<div class="nmodal-done" hidden>' +
        '<div class="nmodal-check">✓</div>' +
        '<h3>تم تفعيل الإشعارات!</h3>' +
        '<p>شكرًا لك — ستصلك مستجدات المعهد المهمة أولًا بأول.</p>' +
        '<button type="button" class="btn btn-primary nmodal-ok">تمّ</button>' +
      '</div>' +
    '</div>';

  var input = wrap.querySelector('.nmodal-input');
  var errBox = wrap.querySelector('.nmodal-err');
  var form = wrap.querySelector('.nmodal-form');
  var tabs = wrap.querySelectorAll('.nmodal-tab');
  var card = wrap.querySelector('.nmodal-card');
  var doneBox = wrap.querySelector('.nmodal-done');

  function close(status){
    if(status) setState({ status: status, at: Date.now() });
    wrap.classList.remove('open');
    document.body.classList.remove('nmodal-lock');
    setTimeout(function(){ if(wrap.parentNode) wrap.parentNode.removeChild(wrap); }, 250);
    document.removeEventListener('keydown', onKey);
  }
  function onKey(e){ if(e.key === 'Escape') close('dismissed'); }

  tabs.forEach(function(t){
    t.addEventListener('click', function(){
      tabs.forEach(function(x){ x.classList.remove('on'); });
      t.classList.add('on');
      mode = t.getAttribute('data-mode');
      errBox.textContent = '';
      if(mode === 'email'){ input.type='email'; input.dir='ltr'; input.placeholder='you@example.com'; input.setAttribute('autocomplete','email'); }
      else { input.type='tel'; input.dir='ltr'; input.placeholder='06 00 00 00 00'; input.setAttribute('autocomplete','tel'); }
      input.value=''; input.focus();
    });
  });

  function valid(val){
    if(mode === 'email') return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    return /^\+?\d[\d\s\-]{7,}$/.test(val);
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    var val = (input.value || '').trim();
    if(!valid(val)){
      errBox.textContent = mode === 'email' ? 'المرجو إدخال بريد إلكتروني صحيح.' : 'المرجو إدخال رقم هاتف صحيح.';
      input.focus();
      return;
    }
    errBox.textContent = '';
    // 1) Send to Formspree (delivers the subscription to the institute's email).
    if(FORMSPREE_ENDPOINT){
      try{
        fetch(FORMSPREE_ENDPOINT, {
          method:'POST',
          headers:{ 'Content-Type':'application/json', 'Accept':'application/json' },
          body: JSON.stringify({
            email: mode === 'email' ? val : undefined,
            'نوع الاشتراك': mode === 'email' ? 'بريد إلكتروني' : 'رقم الهاتف',
            'قيمة الاشتراك': val,
            _subject: 'اشتراك جديد في إشعارات المعهد — تافراوت'
          })
        }).catch(function(){});
      }catch(_){}
    }
    // 2) Send to the institute backend once hosted.
    if(window.ISTA_SUBSCRIBE_URL){
      try{
        fetch(window.ISTA_SUBSCRIBE_URL, { method:'POST', headers:{'Content-Type':'application/json'},
          body: JSON.stringify({ type: mode, value: val }) }).catch(function(){});
      }catch(_){}
    }
    try{
      var subs = JSON.parse(localStorage.getItem('ista_subscribers') || '[]');
      subs.push({ type: mode, value: val, at: Date.now() });
      localStorage.setItem('ista_subscribers', JSON.stringify(subs));
    }catch(_){}
    setState({ status: 'subscribed', at: Date.now() });
    form.style.display = 'none';
    wrap.querySelector('.nmodal-tabs').style.display = 'none';
    wrap.querySelector('.nmodal-later').style.display = 'none';
    wrap.querySelector('.nmodal-note').style.display = 'none';
    wrap.querySelector('.nmodal-title').style.display = 'none';
    wrap.querySelector('.nmodal-sub').style.display = 'none';
    wrap.querySelector('.nmodal-ico').style.display = 'none';
    doneBox.hidden = false;
  });

  wrap.querySelector('.nmodal-close').addEventListener('click', function(){ close('dismissed'); });
  wrap.querySelector('.nmodal-later').addEventListener('click', function(){ close('dismissed'); });
  wrap.querySelector('.nmodal-ok').addEventListener('click', function(){ close(); });
  wrap.addEventListener('click', function(e){ if(e.target === wrap) close('dismissed'); });

  function reveal(){
    document.body.appendChild(wrap);
    document.body.classList.add('nmodal-lock');
    // force reflow then animate in
    void card.offsetWidth;
    wrap.classList.add('open');
    document.addEventListener('keydown', onKey);
    setTimeout(function(){ input.focus(); }, 350);
  }
  // Appear shortly after entering the site.
  setTimeout(reveal, 2500);
})();
