# خطة الخادم (Backend) — الفضاءات الرقمية للمعهد

هذا المستند يشرح البنية التقنية اللازمة لتفعيل الفضاءات الرقمية الثلاثة
(**فضاء المتدربين**، **فضاء المكوّنين**، **لوحة تحكم الإدارة**) بعد نشر الموقع
على **استضافة مدفوعة**. الواجهة الأمامية (الصفحات وملفات CSS/JS) جاهزة وتعمل
حاليًا في **وضع المعاينة** ببيانات نموذجية؛ لا يتبقّى سوى ربطها بخادم حقيقي.

---

## 1. لماذا نحتاج خادمًا؟

الموقع الحالي **ثابت (static)** ومستضاف على GitHub Pages، وهو ممتاز للصفحات
التعريفية لكنه **لا يستطيع**:

- تسجيل الدخول والتحقق من الهوية (auth)،
- تخزين وقراءة النتائج وحسابات المستخدمين (قاعدة معطيات)،
- رفع الملفات والفيديوهات،
- حفظ التعديلات من لوحة التحكم.

هذه الوظائف تتطلب **خادمًا + قاعدة معطيات + تخزين ملفات**، وهو ما توفّره
الاستضافة المدفوعة.

---

## 2. المكوّنات المقترحة (Stack)

يمكن اعتماد أي مكدّس؛ فيما يلي خيار عملي ومنخفض الكلفة:

| المكوّن | الاقتراح | بدائل |
|--------|----------|-------|
| الواجهة الأمامية | نفس ملفات HTML/CSS/JS الحالية | — |
| الخادم / API | Node.js + Express (أو PHP/Laravel) | Python + FastAPI |
| قاعدة المعطيات | PostgreSQL | MySQL / MariaDB |
| المصادقة | JWT (رمز جلسة) + تشفير كلمات المرور بـ bcrypt | جلسات (sessions) |
| تخزين الملفات/الفيديو | مجلّد على الاستضافة أو خدمة كائنات (S3/Backblaze) | — |
| الاستضافة | خادم مشترك/VPS يدعم Node أو PHP + HTTPS | Render, Railway, o2switch |

> **بديل أسرع للإطلاق:** خدمة *Backend‑as‑a‑Service* مثل **Supabase** (قاعدة
> PostgreSQL + مصادقة + تخزين جاهزة) تقلّص وقت التطوير كثيرًا مع الإبقاء على نفس
> الواجهة الأمامية.

---

## 3. المصادقة (تسجيل الدخول)

### فضاء المتدربين
- **المعرّف:** الرمز الوطني للمتدرّب (CIN / CNE).
- **الرمز السري:** يولّده النظام وتُسلّمه الإدارة للمتدرّب **عند تأكيد التسجيل**.
- يُخزَّن الرمز السري **مُجزّأً (hashed)** لا كنص صريح.
- ⚠️ **لا علاقة له بحساب مايواي** ولا يُطلب من المتدرّب إدخال كلمة مرور مايواي
  في هذا الموقع إطلاقًا.

### فضاء المكوّنين
- **المعرّف:** رمز المكوّن الذي تنشئه الإدارة.
- كلمة مرور خاصة بالمكوّن (قابلة للتغيير عند أول دخول).

### لوحة تحكم الإدارة
- حسابات إدارية باسم مستخدم + كلمة مرور قوية + صلاحيات (roles).
- يُنصح بتفعيل المصادقة الثنائية (2FA) لهذه الحسابات.

---

## 4. نموذج المعطيات (مبسّط)

```
trainees(id, national_code, secret_hash, full_name, program, year, group, status)
trainers(id, code, password_hash, full_name, pole, status)
admins(id, username, password_hash, role)

results(
  id, trainee_id,
  type,        -- fin_module | regional | continu | passage | fin_formation
  module,
  note, coefficient, decision,   -- مستوفاة/ناجح/راسب...
  session_label, published_at
)

lessons(id, trainer_id, title, kind, program, group, file_url, video_url, created_at)
schedule(id, trainer_id, program, group, day, start, end, subject)  -- استعمال الزمن
lesson_calendar(id, trainer_id, date, subject, group, topic)         -- رزنامة الدروس

news(id, title, body, url, is_ticker, published_at)
programs(id, name, level, sector, seats, conditions, ...)
documents(id, title, category, file_url, published_at)
```

---

## 5. الواجهات البرمجية (API) — نقاط النهاية الأساسية

```
POST /api/auth/login        { role, id, secret }        -> { token, profile }
POST /api/auth/logout

# اشتراك الزوّار في الإشعارات (النافذة المنبثقة عند الدخول)
POST /api/subscribe         { type: "email"|"phone", value }  -> { ok }
# ثم يرسل الخادم الإشعارات عبر مزوّد بريد (Mailgun/SES) أو SMS (Twilio/مزوّد محلي)
# عند نشر مستجد مهم من لوحة التحكم. الواجهة الأمامية مهيّأة: تكفي تهيئة
# window.ISTA_SUBSCRIBE_URL = "/api/subscribe" ليعمل الإرسال الحقيقي.

# متدرّب
GET  /api/me/results?type=fin_module                     (Bearer token)

# مكوّن
GET  /api/me/lessons
POST /api/me/lessons        (رفع درس/ملف)
GET  /api/me/schedule
GET  /api/me/calendar

# إدارة
GET/POST/PUT/DELETE /api/admin/results
GET/POST/PUT/DELETE /api/admin/trainees        (+ توليد الرمز السري)
GET/POST/PUT/DELETE /api/admin/trainers
GET/POST/PUT/DELETE /api/admin/news
GET/POST/PUT/DELETE /api/admin/programs
GET/POST/PUT/DELETE /api/admin/documents
```

جميع نقاط `/api/me/*` و`/api/admin/*` محميّة بالتحقق من الرمز (JWT) والصلاحيات.

---

## 6. خطوات الربط (من المعاينة إلى التشغيل)

الواجهة الأمامية كُتبت لتسهيل هذا الانتقال:

1. في `assets/institute/spaces.js`، استبدل استدعاء `demoAuth()` داخل
   `handleLogin()` بطلب حقيقي:
   ```js
   const res = await fetch('/api/auth/login', {
     method:'POST', headers:{'Content-Type':'application/json'},
     body: JSON.stringify({ role, id, secret })
   });
   if(!res.ok){ /* أظهر authErr */ return; }
   const { token, profile } = await res.json();
   ```
2. خزّن `token` (في الذاكرة أو `sessionStorage`) وأرفقه في ترويسة
   `Authorization: Bearer <token>` مع كل طلب.
3. في صفحات الفضاءات، استبدل الجداول/البطاقات النموذجية بمحتوى يُجلب من الـ API
   بعد الدخول (render من JSON).
4. في `admin.html`، اربط كل بطاقة بنموذج تحرير (CRUD) يستدعي `/api/admin/*`.
5. احذف عبارات «وضع المعاينة / بيانات نموذجية» من الشارات (`.space-banner`).

---

## 7. ملاحظات أمنية مهمة

- **HTTPS إجباري** على كامل الموقع بعد الاستضافة.
- تخزين كلمات المرور والرموز السرية **مجزّأة** (bcrypt/argon2) فقط.
- تحديد محاولات الدخول (rate limiting) ضد التخمين.
- عدم عرض النتائج إلا لصاحبها (تحقّق `trainee_id == token.sub`).
- **عدم جمع بيانات دخول مايواي**؛ التسجيل القبلي يبقى عبر البوابة الرسمية
  [myway.ac.ma](https://www.myway.ac.ma/fr) فقط، والموقع يوجّه إليها ولا يستبدلها.
- نسخ احتياطي دوري لقاعدة المعطيات.

---

## 8. ما هو جاهز الآن

- ✅ صفحات الفضاءات الثلاث بواجهات كاملة ومتجاوبة (RTL).
- ✅ شاشات الدخول بالحقول الصحيحة (الرمز الوطني + الرمز السري للمتدرّب).
- ✅ عرض تجريبي للنتائج والدروس والرزنامة واستعمال الزمن ولوحة التحكم.
- ✅ بنية JavaScript مهيّأة لاستبدال المعاينة باستدعاءات الخادم بسهولة.

يبقى تنفيذ الخادم وقاعدة المعطيات على الاستضافة المدفوعة حسب الخطة أعلاه.
