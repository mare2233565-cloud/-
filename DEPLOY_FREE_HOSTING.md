# رفع المشروع على استضافة مجانية

المشروع شات Node.js + Socket.IO + MySQL، ويعتمد على **WebSocket** و**قاعدة بيانات MySQL** و**ملفات مرفوعة**.
لذلك لا يصلح مع استضافات PHP مثل InfinityFree، ولا مع Vercel/Netlify.

تم تجهيز المشروع ليشتغل على:

- **Render** (مجاني) + قاعدة MySQL مجانية من **Aiven** ← الخيار الموصى به
- **Railway** (سهل، لكن رصيده المجاني تجريبي وليس دائماً)
- **Koyeb / Fly.io / أي VPS** باستخدام ملف `Dockerfile` الموجود

---

## 1) ما تم تعديله في المشروع

| الملف | التعديل |
|---|---|
| `config.js` | كل الإعدادات تُقرأ من متغيرات البيئة `PORT`, `DB_*`, `APP_DOMAINS`, `ADMIN_*` مع بقاء القيم القديمة كافتراضية |
| `config.js` | اكتشاف دومين الاستضافة تلقائياً (`RENDER_EXTERNAL_HOSTNAME`, `RAILWAY_PUBLIC_DOMAIN`, `KOYEB_PUBLIC_DOMAIN`, `FLY_APP_NAME`) |
| `database/database.js` | التحويل من اتصال واحد إلى **Pool** باستخدام `mysql2` (يدعم MySQL 8 و SSL وإعادة الاتصال) |
| `server.js` | الاستماع على `0.0.0.0` والبورت من `PORT` |
| `server.js` | دعم HTTP خلف Reverse Proxy (HTTPS من الاستضافة) بدل شهادة `pem` المحلية |
| `server.js` | `trust proxy` (ضروري لعمل Rate Limit و IP الحقيقي) |
| `server.js` | إنشاء مجلدات `uploads` تلقائياً |
| `server.js` | إزالة `process.exit` عند أول زيارة لدومين جديد (كان يوقف السيرفر) |
| `server.js` | تعطيل النسخ الاحتياطي التلقائي إذا لم يوجد `mysqldump` |
| `server.js` | عدم تعليق رفع فيديو القصة إذا لم يوجد ffmpeg |
| `server.js` | إضافة `/healthz` لفحص صحة الخدمة |
| `package.json` | `npm start` أصبح `node server.js` بدل `pm2` |
| `package.json` | إصدار Node أصبح `20.x` بدل 13 (متوافق مع حوّاسيب Node الحديثة وبصيغة يفهمها Render) |
| `env.js` + `.env.example` | دعم ملف `.env` محلياً بدون مكتبات إضافية |

---

## 2) قبل الرفع (مهم)

1. غيّر باسورد الأدمن من `1111` إلى باسورد قوي قبل أول تشغيل.
   الحساب يُنشأ **مرة واحدة فقط** عند أول تشغيل، وتغيير المتغير بعد ذلك لا يغيّر الباسورد الموجود في القاعدة.
2. لا ترفع `node_modules` ولا `.env` (موجودين في `.gitignore`).
3. تأكد أن المشروع يعمل محلياً:

```bash
npm install
npm start
```

ثم افتح `http://localhost:5555`.

---

## 3) الخيار الموصى به: Render + Aiven MySQL

### أ) إنشاء قاعدة بيانات مجانية على Aiven

1. سجّل في <https://aiven.io> وأنشئ خدمة **MySQL** بخطة **Free**.
2. بعد انتهاء الإنشاء افتح الخدمة ← **Overview** وانسخ بيانات الاتصال (Service URI):

```
mysql://avnadmin:PASSWORD@mysql-xxxxx.aivencloud.com:12345/defaultdb?ssl-mode=REQUIRED
```

3. استخرج منها:

| المتغير | القيمة |
|---|---|
| `DB_HOST` | `mysql-xxxxx.aivencloud.com` |
| `DB_PORT` | `12345` |
| `DB_USER` | `avnadmin` |
| `DB_PASSWORD` | الباسورد |
| `DB_NAME` | `defaultdb` |
| `DB_SSL` | `1` |

> بديل مجاني لقاعدة البيانات: **TiDB Cloud Serverless** (5GB مجاناً) — نفس المتغيرات، والمنفذ غالباً `4000` و`DB_SSL=1`.
> الخطط المجانية تتغير من وقت لآخر، راجع صفحة الأسعار قبل البدء.

### ب) رفع المشروع على GitHub

من داخل مجلد المشروع:

```bash
git init
git add .
git commit -m "first deploy"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main
```

أو استخدم **GitHub Desktop** وارفع المجلد كما هو.

### ج) إنشاء الخدمة على Render

1. سجّل في <https://render.com> واربط حساب GitHub.
2. **New → Web Service** واختر المستودع.
3. الإعدادات:

| الإعداد | القيمة |
|---|---|
| Environment | `Node` |
| Build Command | `npm install --omit=dev` |
| Start Command | `npm start` |
| Instance Type | `Free` |
| Health Check Path | `/healthz` |

4. أضف **Environment Variables**:

```
NODE_ENV        = production
TRUST_PROXY     = 1
DB_HOST         = mysql-xxxxx.aivencloud.com
DB_PORT         = 12345
DB_USER         = avnadmin
DB_PASSWORD     = ********
DB_NAME         = defaultdb
DB_SSL          = 1
DB_BACKUP       = 0
ADMIN_USER      = aymin
ADMIN_PASSWORD  = باسورد-قوي-هنا
APP_DOMAINS     = (اتركه فارغاً أول مرة)
```

> `APP_DOMAINS` غير مطلوب على Render لأنه يضيف دومين `*.onrender.com` تلقائياً.
> لو أضفت دومين مخصص لاحقاً، أضفه هنا: `chat.example.com,www.chat.example.com` أو اكتب `*`.

5. اضغط **Create Web Service** وانتظر انتهاء البناء.
6. افتح الرابط `https://xxxx.onrender.com`.

أول زيارة تنشئ إعدادات الموقع وكلمة المرور، ثم يعيد تحميل الصفحة تلقائياً.

### د) الدخول

- سجّل الدخول من الموقع نفسه باسم `ADMIN_USER` والباسورد `ADMIN_PASSWORD`.
- المستخدم يُنشأ بصلاحية `gochat` (مالك) عند أول تشغيل.
- غيّر الباسورد بعد الدخول من لوحة الإدارة.

### هـ) دومين مخصص

1. Render ← خدمتك ← **Settings → Custom Domains** وأضف الدومين.
2. أضف الدومين في `APP_DOMAINS` داخل Environment.
3. Render يوفر شهادة HTTPS تلقائياً. لا تفعّل `SSL=1`.

---

## 4) الخيار الثاني: Railway

1. أنشئ مشروعاً جديداً ← **Deploy from GitHub Repo**.
2. أضف **MySQL** من `New → Database → MySQL`.
3. من خدمة MySQL انسخ بيانات الاتصال، وضعها في خدمة التطبيق:

| متغير Railway | متغير المشروع |
|---|---|
| `MYSQLHOST` | `DB_HOST` |
| `MYSQLPORT` | `DB_PORT` |
| `MYSQLUSER` | `DB_USER` |
| `MYSQLPASSWORD` | `DB_PASSWORD` |
| `MYSQLDATABASE` | `DB_NAME` |

4. `DB_SSL=0` مع قاعدة Railway الداخلية.
5. Railway يحدد `PORT` تلقائياً، لا تضعه يدوياً.
6. أضف `ADMIN_USER` و`ADMIN_PASSWORD` و`TRUST_PROXY=1`.

> Railway لم يعد يوفّر خطة مجانية دائمة في أغلب الفترات (رصيد تجريبي فقط). تحقق من الصفحة قبل الاعتماد عليه.

---

## 5) الخيار الثالث: Docker (Koyeb / Fly.io / VPS)

المشروع يحتوي `Dockerfile` جاهز:

```bash
docker build -t gochat .
docker run -p 8080:8080 \
  -e DB_HOST=... -e DB_PORT=3306 -e DB_USER=... -e DB_PASSWORD=... \
  -e DB_NAME=... -e DB_SSL=1 -e ADMIN_USER=admin -e ADMIN_PASSWORD=... \
  gochat
```

على Koyeb: **Create Service → Docker → GitHub** وحدد منفذ `8080`.

---

## 6) ملاحظات مهمة عن الاستضافة المجانية

| الملاحظة | التفاصيل |
|---|---|
| **النوم التلقائي** | خدمة Render المجانية تنام بعد 15 دقيقة بلا زيارات، وأول فتح بعد النوم يأخذ 30–60 ثانية |
| **الملفات المرفوعة** | قرص Render المجاني مؤقت: الصور والملفات التي يرفعها المستخدمون قد تُفقد عند إعادة النشر/التشغيل. ملفات الموقع الأساسية موجودة في المستودع وتبقى |
| **النسخ الاحتياطي** | معطّل افتراضياً لأن `mysqldump` غير متوفر. لو أردت تفعيله ضع `DB_BACKUP=1` بعد تثبيت `mysql-client` (Dockerfile) |
| **قاعدة البيانات** | لا تنام عادة، لكن لو كانت الخدمة لم تتصل بها عند أول تشغيل: أعد تشغيل الخدمة من Render ← **Manual Deploy → Restart** |
| **الذاكرة** | الخطة المجانية 512MB. مناسبة للاستخدام الخفيف، وليست لآلاف المستخدمين |
| **تحديث الملفات** | كل `git push` يعيد النشر. بعد التحديث امسح كاش المتصفح `Ctrl+Shift+R` |
| **الملفات الدائمة** | إن أردت حفظ الصور بشكل دائم استخدم Render Disk (مدفوع) أو تخزين خارجي مثل Cloudinary لاحقاً |

---

## 7) حل المشاكل الشائعة

| المشكلة | الحل |
|---|---|
| **الموقع غير متاح** | الدومين غير موجود في `APP_DOMAINS`. أضفه، أو اكتب `*`، أو أعد النشر |
| **Database connection error** | راجع `DB_HOST` و`DB_PORT` و`DB_NAME`، وغالباً تحتاج `DB_SSL=1` مع Aiven/TiDB |
| **الصفحة تعمل لكن بدون قاعدة بيانات** | القاعدة لم تكن جاهزة عند أول تشغيل. أعد تشغيل الخدمة |
| **`sharp` أو `Could not load`** | المشروع يحدد Node `20.x` في `package.json`. على Render اضبط `NODE_VERSION=20` لو ظهر إصدار مختلف. أعد البناء |
| **رفع الصور لا يعمل** | تأكد أن مجلدات `uploads` موجودة (تُنشأ تلقائياً) وأن الخدمة تعمل من جذر المشروع (الكود يعمل `process.chdir`) |
| **الرسائل لا تصل** | تأكد أن الاستضافة تدعم WebSocket (Render وKoyeb وRailway تدعمها) |
| **بطء أول فتح** | طبيعي في الخطة المجانية (استيقاظ الخدمة) |

---

## 8) التحقق النهائي

- [ ] `https://your-app.onrender.com/healthz` يرجع `ok`
- [ ] الصفحة الرئيسية تفتح وليست "الموقع غير متاح"
- [ ] تسجيل الدخول بحساب الأدمن يعمل
- [ ] إنشاء غرفة وإرسال رسالة يعمل بين متصفحين
- [ ] تغيير باسورد الأدمن من الإدارة
- [ ] مراجعة Logs في Render بعد أول تشغيل: يجب أن تظهر `Connected database!` و`Server started on port ...`
