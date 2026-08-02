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

  // News ticker — auto-rotating carousel (every 5 seconds)
  (function newsTicker(){
    var box = document.getElementById('newsTicker');
    if(!box) return;
    var el = box.querySelector('.trot-current');
    var dotsWrap = box.querySelector('.trot-dots');
    var items = [
      {t:'🔒 انتهت آجال التسجيل الأولي لموسم 2026/2027 — بعض الشعب قد تُفتح عبر دراسة الملفات', href:'#dates'},
      {t:'🌐 التسجيل الأولي يتم إلكترونيًا عبر بوابة MyWay — myway.ac.ma', href:'#registration'},
      {t:'📄 نتائج الانتقاء ونهاية السنة التكوينية تُنشر بالمعهد وعبر الموقع', href:'#results'},
      {t:'📚 حمّل النظام الداخلي للمعهد من المكتبة الرقمية', href:'#library'},
      {t:'⭐ شارك تجربتك وقيّم المعهد لمساعدة زملائك', href:'#reviews'},
      {t:'🏠 الداخلية والمطعم متوفّران للمتدربين القادمين من مناطق بعيدة', href:'#facilities'}
    ];
    var i = 0, timer;
    items.forEach(function(_, n){
      var d = document.createElement('button');
      d.type = 'button'; d.setAttribute('aria-label', 'الخبر ' + (n+1));
      d.addEventListener('click', function(){ show(n); reset(); });
      dotsWrap.appendChild(d);
    });
    var dots = dotsWrap.querySelectorAll('button');
    function paint(){ dots.forEach(function(d, n){ d.classList.toggle('on', n === i); }); }
    function show(n){
      i = (n + items.length) % items.length;
      el.style.opacity = 0;
      setTimeout(function(){
        el.textContent = items[i].t;
        el.setAttribute('href', items[i].href);
        el.style.opacity = 1;
        paint();
      }, 260);
    }
    function next(){ show(i + 1); }
    function prev(){ show(i - 1); }
    function start(){ timer = setInterval(next, 5000); }
    function reset(){ clearInterval(timer); start(); }
    box.querySelector('.trot-next').addEventListener('click', function(){ next(); reset(); });
    box.querySelector('.trot-prev').addEventListener('click', function(){ prev(); reset(); });
    box.addEventListener('mouseenter', function(){ clearInterval(timer); });
    box.addEventListener('mouseleave', start);
    el.textContent = items[0].t; el.setAttribute('href', items[0].href); el.style.opacity = 1; paint();
    start();
  })();

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

  // ===== Interactive lightbox for galleries =====
  var galleryEls = Array.prototype.slice.call(document.querySelectorAll('.gallery, .mosaic'));
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
