/* ISTA Tafraout — digital spaces (trainees / trainers / admin)
 * ------------------------------------------------------------------
 * This is the FRONT-END of the spaces. It runs today in "preview" mode
 * (بيانات تجريبية) so the interface can be seen and reviewed. Once the
 * site is published on paid hosting with the institute backend, replace
 * the demoAuth() call inside handleLogin() with a real request to the
 * server API — see BACKEND-PLAN.md for the endpoints and data model:
 *
 *   POST /api/auth/login   { role, id, secret }  ->  { token, profile }
 *   GET  /api/results      (Authorization: Bearer <token>)
 *   GET  /api/lessons      (Authorization: Bearer <token>)
 *
 * IMPORTANT: trainee login uses the national trainee code + a secret
 * code issued by the administration at registration confirmation.
 * It does NOT collect MyWay credentials.
 * ------------------------------------------------------------------ */
(function(){
  var root = document.querySelector('[data-space]');
  if(!root) return;

  var form   = document.getElementById('authForm');
  var app    = document.getElementById('spaceApp');
  var errBox = document.getElementById('authErr');
  var SESSION_KEY = 'ista_space_' + root.getAttribute('data-space');

  // --- Demo directory (preview only; the real check happens on the server) ---
  // Any non-empty credentials open the preview; these named demos give a nicer name.
  var DEMOS = {
    stagiaires: { name: 'المتدرّب النموذجي', extra: 'تقني متخصص — تسيير المقاولات · السنة الثانية' },
    formateurs: { name: 'المكوّن النموذجي', extra: 'قطب التدبير والتجارة' },
    admin:      { name: 'مدير المعهد', extra: 'حساب إداري — صلاحيات كاملة' }
  };

  function initials(name){
    var p = (name||'').trim().split(/\s+/);
    return ((p[0]||'')[0]||'') + ((p[1]||'')[0]||'');
  }

  function openApp(profile){
    var av = document.getElementById('appAvatar');
    var nm = document.getElementById('appName');
    var ex = document.getElementById('appExtra');
    if(av) av.textContent = initials(profile.name) || '👤';
    if(nm) nm.textContent = profile.name;
    if(ex) ex.textContent = profile.extra || '';
    if(form) form.closest('.auth-wrap').style.display = 'none';
    if(app){
      app.classList.add('on');
      // Scroll so the welcome bar clears the sticky header (any height).
      var head = document.querySelector('.header');
      var off = (head ? head.getBoundingClientRect().height : 110) + 14;
      var y = app.getBoundingClientRect().top + window.pageYOffset - off;
      window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
    }
  }

  function demoAuth(id, secret){
    // Preview logic only. Replace with a fetch() to the backend on hosting.
    var key = root.getAttribute('data-space');
    var d = DEMOS[key] || { name: 'مستخدم', extra: '' };
    return { name: d.name, extra: d.extra, id: id };
  }

  function handleLogin(e){
    e.preventDefault();
    if(errBox) errBox.classList.remove('on');
    var id = (document.getElementById('fId')||{}).value || '';
    var secret = (document.getElementById('fSecret')||{}).value || '';
    if(!id.trim() || !secret.trim()){
      if(errBox){ errBox.textContent = 'المرجو إدخال جميع الخانات.'; errBox.classList.add('on'); }
      return;
    }
    // === Replace this block with the real API call on hosting ===
    var profile = demoAuth(id.trim(), secret.trim());
    try{ sessionStorage.setItem(SESSION_KEY, JSON.stringify(profile)); }catch(_){}
    openApp(profile);
  }

  if(form) form.addEventListener('submit', handleLogin);

  // Logout
  var logout = document.getElementById('appLogout');
  if(logout) logout.addEventListener('click', function(){
    try{ sessionStorage.removeItem(SESSION_KEY); }catch(_){}
    if(app) app.classList.remove('on');
    if(form){ form.reset(); form.closest('.auth-wrap').style.display = ''; window.scrollTo({top:0,behavior:'smooth'}); }
  });

  // Restore a preview session on reload
  try{
    var saved = sessionStorage.getItem(SESSION_KEY);
    if(saved) openApp(JSON.parse(saved));
  }catch(_){}

  /* ================================================================
   * Secure OTP results-access wizard (trainees page — preview mode)
   * ----------------------------------------------------------------
   * On hosting, replace the two demo steps with real API calls:
   *   POST /api/results/otp/request  { reg, cin }        -> { masked_phone, ttl }
   *   POST /api/results/otp/verify   { reg, code }       -> { token, profile }
   * The server looks up the phone (never sent by the client), sends the
   * SMS, hashes/expires the OTP, rate-limits, then returns the token.
   * ================================================================ */
  (function otpWizard(){
    var wiz = document.getElementById('otpWizard');
    if(!wiz) return;

    var DEMO_OTP  = '123456';   // preview only — the real code is generated & sent by the server
    var TTL       = 120;        // OTP validity (seconds)
    var RESEND_IN = 30;         // resend cooldown (seconds)

    var panes  = { 1: document.getElementById('otpStep1'), 2: document.getElementById('otpStep2') };
    var steps  = wiz.querySelectorAll('.otp-step');
    var err    = document.getElementById('otpErr');
    var digits = Array.prototype.slice.call(wiz.querySelectorAll('.otp-d'));
    var elCount  = document.getElementById('otpCount');
    var elResend = document.getElementById('otpResend');
    var elResendIn = document.getElementById('otpResendIn');
    var elPhone  = document.getElementById('otpPhone');
    var ttlTimer = null, csTimer = null;

    function showErr(m){ if(err){ err.textContent = m; err.classList.add('on'); } }
    function clrErr(){ if(err) err.classList.remove('on'); }

    function gotoStep(n){
      for(var k in panes){ if(panes[k]) panes[k].classList.toggle('is-active', +k === n); }
      for(var i=0;i<steps.length;i++){
        var sn = +steps[i].getAttribute('data-s');
        steps[i].classList.toggle('is-active', sn === n);
        steps[i].classList.toggle('done', sn < n);
      }
    }
    function fmt(s){ var m=Math.floor(s/60), r=s%60; return (m<10?'0':'')+m+':'+(r<10?'0':'')+r; }

    function stopTimers(){ if(ttlTimer){clearInterval(ttlTimer);ttlTimer=null;} if(csTimer){clearInterval(csTimer);csTimer=null;} }

    function startTimers(){
      stopTimers();
      // validity countdown
      var t = TTL;
      if(elCount) elCount.textContent = fmt(t);
      var verifyBtn = panes[2].querySelector('button[type="submit"]');
      if(verifyBtn) verifyBtn.disabled = false;
      ttlTimer = setInterval(function(){
        t--;
        if(elCount) elCount.textContent = fmt(Math.max(0,t));
        if(t<=0){
          clearInterval(ttlTimer); ttlTimer=null;
          if(elCount){ elCount.textContent = 'انتهت الصلاحية'; }
          if(verifyBtn) verifyBtn.disabled = true;
          showErr('انتهت صلاحية الرمز. اطلب رمزًا جديدًا عبر «إعادة الإرسال».');
        }
      }, 1000);
      // resend cooldown
      var c = RESEND_IN;
      if(elResend){ elResend.disabled = true; }
      if(elResendIn) elResendIn.textContent = '('+fmt(c)+')';
      csTimer = setInterval(function(){
        c--;
        if(elResendIn) elResendIn.textContent = '('+fmt(Math.max(0,c))+')';
        if(c<=0){
          clearInterval(csTimer); csTimer=null;
          if(elResend){ elResend.disabled = false; }
          if(elResendIn) elResendIn.textContent = '';
        }
      }, 1000);
    }

    function maskPhone(){
      // preview: a fixed masked phone. On hosting, use masked_phone from the API.
      return '06••••••';
    }

    function clearDigits(){ digits.forEach(function(d){ d.value=''; }); if(digits[0]) digits[0].focus(); }
    function code(){ return digits.map(function(d){ return d.value; }).join(''); }

    // OTP digit inputs: auto-advance, backspace, paste
    digits.forEach(function(d, i){
      d.addEventListener('input', function(){
        d.value = d.value.replace(/\D/g,'').slice(0,1);
        if(d.value && i < digits.length-1) digits[i+1].focus();
        clrErr();
      });
      d.addEventListener('keydown', function(e){
        if(e.key === 'Backspace' && !d.value && i>0) digits[i-1].focus();
      });
      d.addEventListener('paste', function(e){
        e.preventDefault();
        var t = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g,'').slice(0,6);
        for(var j=0;j<t.length && (i+j)<digits.length;j++) digits[i+j].value = t[j];
        var next = Math.min(i+t.length, digits.length-1);
        digits[next].focus();
      });
    });

    // Step 1 → request OTP (preview: just move on)
    panes[1].addEventListener('submit', function(e){
      e.preventDefault();
      clrErr();
      var reg = (document.getElementById('oReg')||{}).value || '';
      var cin = (document.getElementById('oCin')||{}).value || '';
      if(!reg.trim() || !cin.trim()){ showErr('المرجو إدخال رقم التسجيل ورقم البطاقة الوطنية.'); return; }
      // === On hosting: POST /api/results/otp/request { reg, cin } ===
      if(elPhone) elPhone.textContent = maskPhone();
      gotoStep(2);
      clearDigits();
      startTimers();
    });

    // Step 2 → verify OTP (preview: compare with DEMO_OTP)
    panes[2].addEventListener('submit', function(e){
      e.preventDefault();
      clrErr();
      var c = code();
      if(c.length < 6){ showErr('أدخل الرمز المكوّن من 6 أرقام.'); return; }
      // === On hosting: POST /api/results/otp/verify { reg, code } -> { token, profile } ===
      if(c !== DEMO_OTP){
        showErr('الرمز غير صحيح. تأكّد من الأرقام أو اطلب رمزًا جديدًا.');
        wiz.classList.remove('shake'); void wiz.offsetWidth; wiz.classList.add('shake');
        return;
      }
      stopTimers();
      gotoStep(3);
      var d = DEMOS[root.getAttribute('data-space')] || { name:'المتدرّب', extra:'' };
      var profile = { name:d.name, extra:d.extra };
      try{ sessionStorage.setItem(SESSION_KEY, JSON.stringify(profile)); }catch(_){}
      setTimeout(function(){ openApp(profile); }, 250);
    });

    // Resend
    if(elResend) elResend.addEventListener('click', function(){
      if(elResend.disabled) return;
      clrErr(); clearDigits(); startTimers();
    });
    // Back to step 1
    var back = document.getElementById('otpBack');
    if(back) back.addEventListener('click', function(){ stopTimers(); clrErr(); gotoStep(1); });
  })();
})();
