# ملخص سريع للإعداد والتشغيل

## ما تم إنجازه

تم بناء نظام متكامل لإدارة الخطط التدريبية يتضمن:

### 1. الواجهة الأمامية (Frontend)
- **مكون React** شامل بواجهة عربية احترافية
- **نموذج ديناميكي** يحتوي على:
  - حقل نصي لاسم الطالب
  - قائمة منسدلة للمجموعة
  - قائمتان مترابطتان لنوع الخطة وعناصرها
  - قائمتان لأيام الدوام (اليوم الأول والثاني)
  - ثلاثة حقول لتاريخ البداية (يوم/شهر/سنة)
  - حقل رقمي لمدة الخطة (1-25 يوم)
  - قائمة لاسم طالب الملف
- **تصميم متجاوب** يعمل على جميع الأجهزة
- **معالجة أخطاء شاملة** مع رسائل واضحة
- **زر تحميل PDF** يظهر بعد النجاح

### 2. خدمة API للتواصل
- **ملف services/api.ts** يحتوي على:
  - دالة `fetchGoogleSheetsData()` لجلب البيانات من Google Sheets
  - دالة `submitFormToN8n()` لإرسال البيانات إلى n8n

### 3. Google Apps Script
- **ملف Code.gs** جاهز للنسخ واللصق في Google Apps Script
- **يقرأ 5 صفحات** من Google Sheets:
  - Groups (المجموعات)
  - Plans (أنواع الخطط)
  - PlanElements (عناصر كل خطة)
  - Requesters (أسماء طالبي الملفات)
  - PlanData (البيانات التفصيلية)
- **يُرجع JSON** منظم بجميع البيانات
- **شرح مفصل** لطريقة النشر كـ Web App

### 4. توثيق شامل
تم إنشاء 4 ملفات توثيق مفصلة:

#### أ. GOOGLE_SHEETS_SETUP.md
- بنية Google Sheets المطلوبة بالتفصيل
- أمثلة على كل جدول
- خطوات إنشاء وربط Apps Script
- طريقة نشر Web App
- اختبار الإعداد
- حل المشاكل الشائعة

#### ب. N8N_WORKFLOW_GUIDE.md
- شرح تفصيلي لـ 13 Node المطلوبة
- كود JavaScript لكل Function Node:
  - حساب التواريخ بذكاء
  - توليد 25 متغير لكل نوع (h, d, dt)
  - استبدال Placeholders في المستند
- إعداد Google APIs (Sheets, Docs, Drive)
- إعداد Telegram Bot
- معالجة الأخطاء
- اختبار Workflow

#### ج. GOOGLE_DOCS_TEMPLATE.md
- قائمة كاملة بجميع Placeholders (78 placeholder)
- أمثلة متعددة على تصميم القالب
- قالب جدول احترافي
- قالب نصي بسيط
- قالب احترافي كامل مع رسوم
- طريقة إضافة Placeholders بشكل صحيح
- منح الصلاحيات لـ Service Account

#### د. DEPLOYMENT_GUIDE.md
- دليل شامل للنشر على Coolify
- إعداد Environment Variables
- ربط Subdomain و SSL
- ضبط DNS Records
- Nginx Configuration
- CI/CD مع GitHub Actions
- Performance Optimization
- Backup & Recovery
- حل المشاكل الشائعة

---

## الخطوات السريعة للبدء

### الخطوة 1: تحديث Environment Variables
افتح ملف `.env` وحدّث:
```env
VITE_GOOGLE_SCRIPT_URL=YOUR_GOOGLE_APPS_SCRIPT_URL_HERE
VITE_N8N_WEBHOOK_URL=YOUR_N8N_WEBHOOK_URL_HERE
```

### الخطوة 2: إعداد Google Sheets
1. أنشئ Google Sheets جديد
2. أضف 5 صفحات: Groups, Plans, PlanElements, Requesters, PlanData
3. املأ البيانات (راجع `docs/GOOGLE_SHEETS_SETUP.md`)

### الخطوة 3: إعداد Google Apps Script
1. Extensions > Apps Script
2. الصق محتوى `google-apps-script/Code.gs`
3. Deploy > New deployment > Web app
4. انسخ URL وضعه في `.env`

### الخطوة 4: إنشاء قالب Google Docs
1. أنشئ مستند Google Docs جديد
2. أضف التصميم المطلوب مع Placeholders (راجع `docs/GOOGLE_DOCS_TEMPLATE.md`)
3. احفظ Document ID

### الخطوة 5: بناء n8n Workflow
1. أنشئ Workflow جديد في n8n
2. أضف 13 Nodes حسب `docs/N8N_WORKFLOW_GUIDE.md`
3. اربط Google APIs و Telegram
4. احصل على Webhook URL وضعه في `.env`

### الخطوة 6: تشغيل المشروع
```bash
npm install
npm run dev
```

### الخطوة 7: اختبار النظام
1. افتح `http://localhost:5173`
2. املأ النموذج
3. اضغط "إنشاء الخطة"
4. تحقق من توليد PDF وإرساله عبر Telegram

---

## بنية الملفات المهمة

```
المشروع/
├── src/
│   ├── components/TrainingPlanForm.tsx  ← المكون الرئيسي
│   ├── services/api.ts                  ← خدمات API
│   └── types/index.ts                   ← التعريفات
├── google-apps-script/
│   └── Code.gs                          ← سكريبت جاهز للنسخ
├── docs/
│   ├── GOOGLE_SHEETS_SETUP.md           ← دليل Sheets
│   ├── N8N_WORKFLOW_GUIDE.md            ← دليل n8n
│   ├── GOOGLE_DOCS_TEMPLATE.md          ← دليل القالب
│   └── DEPLOYMENT_GUIDE.md              ← دليل النشر
├── .env                                 ← ضع الروابط هنا
└── README.md                            ← التوثيق الرئيسي
```

---

## الروابط المطلوبة

بعد إكمال الإعداد، ستحتاج هذه الروابط:

| الخدمة | الرابط | مكان الحصول عليه |
|--------|--------|------------------|
| Google Apps Script | `https://script.google.com/macros/s/.../exec` | بعد نشر Web App |
| n8n Webhook | `https://your-n8n.com/webhook/training-plan` | من Webhook Node في n8n |
| Google Sheets | `spreadsheet_id` | من رابط Sheets |
| Google Docs | `document_id` | من رابط Docs القالب |
| Telegram Bot | `bot_token` | من @BotFather |

---

## آلية العمل الكاملة

### 1. عند فتح الصفحة:
```
المتصفح → Google Apps Script → Google Sheets → العودة بـ JSON → تعبئة القوائم
```

### 2. عند إرسال النموذج:
```
المتصفح
  ↓ (POST JSON)
n8n Webhook
  ↓
Google Sheets (البحث والقراءة)
  ↓
Function Node (حساب التواريخ)
  ↓
Google Docs (قراءة القالب)
  ↓
Function Node (استبدال Placeholders)
  ↓
Google Docs (إنشاء مستند جديد)
  ↓
Google Drive (تصدير PDF)
  ↓
Google Drive (حفظ ومشاركة)
  ↓
Telegram (إرسال الملف)
  ↓
المتصفح (رابط التحميل)
```

---

## حساب التواريخ - مثال عملي

**المدخلات:**
- تاريخ البداية: 1 يناير 2025 (أربعاء)
- اليوم الأول: الأحد
- اليوم الثاني: الثلاثاء
- مدة الخطة: 5 أيام

**المعالجة:**
1. نبدأ من 1 يناير (أربعاء) - ليس يوم دوام، نتخطاه
2. 5 يناير (أحد) - يوم دوام ✓ → d1, dt1, h1
3. 7 يناير (ثلاثاء) - يوم دوام ✓ → d2, dt2, h2
4. 12 يناير (أحد) - يوم دوام ✓ → d3, dt3, h3
5. 14 يناير (ثلاثاء) - يوم دوام ✓ → d4, dt4, h4
6. 19 يناير (أحد) - يوم دوام ✓ → d5, dt5, h5

**النتيجة في PDF:**
```
| اليوم    | التاريخ           | الموضوع         |
|----------|------------------|-----------------|
| الأحد    | 5 يناير 2025     | JavaScript      |
| الثلاثاء | 7 يناير 2025     | HTML & CSS      |
| الأحد    | 12 يناير 2025    | React Basics    |
| الثلاثاء | 14 يناير 2025    | State & Props   |
| الأحد    | 19 يناير 2025    | Hooks           |
```

---

## نقاط مهمة يجب تذكرها

### ✅ قبل التشغيل
- [ ] Google Sheets معبأ بالبيانات
- [ ] Apps Script منشور كـ Web App بصلاحية "Anyone"
- [ ] Google Docs Template جاهز مع جميع Placeholders
- [ ] n8n Workflow مكتمل ومفعّل
- [ ] Telegram Bot معد (إذا لزم)
- [ ] Environment Variables محدّثة في `.env`

### ⚠️ أخطاء شائعة
- نسيان نشر Apps Script بصلاحية "Anyone"
- كتابة Placeholders بشكل خاطئ (حساسة لحالة الأحرف)
- عدم منح Service Account صلاحية Editor على Docs/Sheets
- n8n Workflow غير مفعّل
- روابط خاطئة في `.env`

### 💡 نصائح للنجاح
- اختبر كل مكون على حدة قبل ربطهم معاً
- استخدم Browser DevTools (F12) لفحص الأخطاء
- راقب n8n Execution Logs لمعرفة أين تحدث المشاكل
- احفظ نسخة احتياطية من Google Sheets و Docs Template
- استخدم Git لحفظ إصدارات الكود

---

## الدعم والمساعدة

إذا واجهت أي مشكلة:

1. **راجع الأدلة التفصيلية:** كل شيء موثق في `docs/`
2. **افحص الـ Logs:**
   - Browser Console (F12)
   - n8n Execution Logs
   - Coolify Runtime Logs
3. **تحقق من الأساسيات:**
   - الروابط في `.env` صحيحة
   - الصلاحيات ممنوحة
   - الخدمات تعمل
4. **اختبر كل جزء منفصلاً:**
   - Apps Script: افتح رابطه في المتصفح
   - n8n: شغّل Workflow يدوياً
   - Frontend: افحص Network tab

---

## الخلاصة

تم بناء نظام متكامل وجاهز للاستخدام مع:

- ✅ واجهة React احترافية باللغة العربية
- ✅ Google Apps Script لجلب البيانات
- ✅ n8n Workflow كامل (13 Node)
- ✅ حساب تلقائي ذكي للتواريخ
- ✅ توليد PDF من قوالب Google Docs
- ✅ إرسال عبر Telegram
- ✅ توثيق شامل لكل خطوة
- ✅ دليل نشر على Coolify
- ✅ اختبار ناجح للبناء

**كل ما تحتاجه الآن:**
1. ملء Google Sheets بالبيانات
2. نشر Apps Script
3. بناء n8n Workflow
4. تحديث `.env`
5. التشغيل والاختبار

حظاً موفقاً! 🚀
