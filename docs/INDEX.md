# دليل التوثيق - نظام إدارة الخطط التدريبية

مرحباً بك في الدليل الشامل لنظام إدارة الخطط التدريبية!

## نظرة عامة

هذا النظام عبارة عن حل متكامل يجمع بين:
- **واجهة ويب** React + TypeScript
- **Google Sheets** كقاعدة بيانات
- **Google Apps Script** لجلب البيانات
- **n8n Workflow** للمعالجة التلقائية
- **Google Docs** كقوالب PDF
- **Telegram** للإرسال والأرشفة

---

## دليل البدء السريع

### للمبتدئين

1. اقرأ [`SETUP_SUMMARY.md`](../SETUP_SUMMARY.md) في جذر المشروع
2. اتبع الخطوات بالترتيب
3. ارجع للأدلة التفصيلية عند الحاجة

### للمطورين

1. [`GOOGLE_SHEETS_SETUP.md`](GOOGLE_SHEETS_SETUP.md) - إعداد قاعدة البيانات
2. [`GOOGLE_DOCS_TEMPLATE.md`](GOOGLE_DOCS_TEMPLATE.md) - إنشاء القالب
3. [`N8N_WORKFLOW_GUIDE.md`](N8N_WORKFLOW_GUIDE.md) - بناء Workflow
4. [`DEPLOYMENT_GUIDE.md`](DEPLOYMENT_GUIDE.md) - النشر على Coolify

---

## الأدلة المتوفرة

### 1. إعداد Google Sheets
**الملف:** [`GOOGLE_SHEETS_SETUP.md`](GOOGLE_SHEETS_SETUP.md)

**المحتوى:**
- بنية الجداول المطلوبة (5 Sheets)
- أمثلة تفصيلية لكل جدول
- إنشاء ونشر Google Apps Script
- اختبار الإعداد
- حل المشاكل الشائعة

**متى تحتاجه:** قبل البدء بأي شيء

---

### 2. قالب Google Docs
**الملف:** [`GOOGLE_DOCS_TEMPLATE.md`](GOOGLE_DOCS_TEMPLATE.md)

**المحتوى:**
- قائمة كاملة بـ 78 Placeholder
- 3 نماذج تصميم مختلفة
- طريقة إضافة Placeholders الصحيحة
- تنسيق احترافي
- منح الصلاحيات

**متى تحتاجه:** بعد إعداد Google Sheets

---

### 3. دليل n8n Workflow
**الملف:** [`N8N_WORKFLOW_GUIDE.md`](N8N_WORKFLOW_GUIDE.md)

**المحتوى:**
- 13 Node بالتفصيل الكامل
- أكواد JavaScript جاهزة
- إعداد Google APIs Credentials
- إعداد Telegram Bot
- اختبار Workflow
- معالجة الأخطاء

**متى تحتاجه:** بعد جاهزية Sheets و Docs

---

### 4. دليل النشر
**الملف:** [`DEPLOYMENT_GUIDE.md`](DEPLOYMENT_GUIDE.md)

**المحتوى:**
- نشر على Coolify خطوة بخطوة
- إعداد Environment Variables
- ربط Subdomain و SSL
- Nginx Configuration
- CI/CD
- Performance Optimization
- Backup & Recovery

**متى تحتاجه:** بعد اكتمال جميع الإعدادات

---

## مسار التنفيذ الموصى به

```
1. Google Sheets Setup
   ↓
2. Google Apps Script
   ↓
3. Google Docs Template
   ↓
4. n8n Workflow
   ↓
5. Frontend Configuration (.env)
   ↓
6. Local Testing
   ↓
7. Deployment
```

---

## الملفات الرئيسية في المشروع

### الكود

| الملف | الوصف |
|-------|-------|
| `src/App.tsx` | المكون الرئيسي |
| `src/components/TrainingPlanForm.tsx` | مكون النموذج الكامل |
| `src/services/api.ts` | خدمات API |
| `src/types/index.ts` | تعريفات TypeScript |
| `google-apps-script/Code.gs` | سكريبت جاهز للنسخ |

### التوثيق

| الملف | الوصف |
|-------|-------|
| `README.md` | التوثيق الرئيسي |
| `SETUP_SUMMARY.md` | ملخص سريع |
| `docs/INDEX.md` | هذا الملف |

---

## الأسئلة الشائعة

### من أين أبدأ؟

ابدأ من [`SETUP_SUMMARY.md`](../SETUP_SUMMARY.md) في جذر المشروع.

### هل أحتاج خبرة برمجية؟

- **للإعداد الأساسي:** لا، الأدلة مفصلة خطوة بخطوة
- **للتخصيص المتقدم:** نعم، معرفة JavaScript/TypeScript مفيدة

### كم يستغرق الإعداد الكامل؟

- **أول مرة:** 2-4 ساعات
- **مع خبرة سابقة:** 1-2 ساعة

### هل يمكن استخدام النظام بدون n8n؟

لا، n8n هو القلب النابض للنظام، يقوم بـ:
- معالجة البيانات
- حساب التواريخ
- توليد PDF
- الإرسال عبر Telegram

### هل يمكن استخدام قاعدة بيانات بدلاً من Google Sheets؟

نعم، لكن ستحتاج:
- تعديل API endpoints
- تعديل n8n Workflow
- إعادة كتابة منطق القراءة

### كيف أحدّث البيانات؟

ببساطة عدّل Google Sheets مباشرة، التغييرات فورية.

---

## الدعم والمساعدة

### عند مواجهة مشكلة

1. **ابحث في القسم المناسب:** كل دليل يحتوي على "حل المشاكل الشائعة"
2. **افحص الـ Logs:**
   - Browser Console (F12)
   - n8n Execution Logs
   - Coolify Runtime Logs
3. **تحقق من الأساسيات:**
   - الروابط في `.env` صحيحة
   - الصلاحيات ممنوحة
   - الخدمات تعمل

### أدوات التشخيص

| المشكلة | الأداة |
|---------|--------|
| واجهة لا تعمل | Browser DevTools (F12) |
| البيانات لا تُجلب | افتح رابط Apps Script مباشرة |
| n8n لا يستجيب | افحص Execution History |
| PDF فارغ | شغّل Workflow يدوياً وراقب كل خطوة |

---

## التحديثات والصيانة

### تحديث البيانات
- عدّل Google Sheets مباشرة

### تحديث التصميم
- عدّل Google Docs Template مباشرة

### تحديث الكود
```bash
git pull origin main
npm install
npm run build
```

### نسخ احتياطي منتظم
- Google Sheets: File > Make a copy
- Google Docs: File > Make a copy
- الكود: Git commits

---

## الخلاصة

هذه الأدلة توفر كل ما تحتاجه لبناء وتشغيل النظام بنجاح. اتبع الترتيب الموصى به، واستخدم الأمثلة المقدمة، ولا تتردد في الرجوع للأدلة عند الحاجة.

**نتمنى لك تجربة سلسة وناجحة!**

---

**آخر تحديث:** أكتوبر 2025
**الإصدار:** 1.0.0
