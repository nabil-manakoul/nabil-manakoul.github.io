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
      if(e.target.tagName === 'A') menu.classList.remove('open');
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
