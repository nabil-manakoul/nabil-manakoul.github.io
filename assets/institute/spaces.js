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
})();
