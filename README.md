# نظام إدارة الخطط التدريبية

نظام متكامل لإدارة وإنشاء الخطط التدريبية تلقائياً بصيغة PDF، مع واجهة ويب سهلة الاستخدام ونظام معالجة آلي.

## المميزات

- واجهة ويب باللغة العربية سهلة الاستخدام وتدعم جميع أحجام الشاشات
- جلب البيانات ديناميكياً من Google Sheets
- حساب تلقائي للتواريخ بناءً على أيام الدوام المختارة
- توليد ملفات PDF احترافية من قوالب Google Docs
- إرسال تلقائي للملفات عبر Telegram
- معالجة شاملة للأخطاء مع رسائل واضحة للمستخدم
- تصميم عصري ومتجاوب مع animations سلسة

## البنية التقنية

### Frontend
- **React 18** مع TypeScript
- **Vite** كأداة بناء
- **Tailwind CSS** للتصميم
- **Lucide React** للأيقونات

### Backend & Integration
- **Google Apps Script** لجلب البيانات من Google Sheets
- **n8n Workflow** لمعالجة البيانات وتوليد PDF
- **Google Sheets** كقاعدة بيانات للمحتوى
- **Google Docs** كقوالب للمستندات
- **Telegram Bot** لإرسال الملفات

## البنية الهيكلية للمشروع

```
training-plan-system/
├── src/
│   ├── components/
│   │   └── TrainingPlanForm.tsx      # مكون الفورم الرئيسي
│   ├── services/
│   │   └── api.ts                     # خدمات API للتواصل الخارجي
│   ├── types/
│   │   └── index.ts                   # تعريفات TypeScript
│   ├── App.tsx                        # المكون الرئيسي
│   ├── main.tsx                       # نقطة الدخول
│   └── index.css                      # الأنماط العامة
├── google-apps-script/
│   └── Code.gs                        # سكريبت Google Apps
├── docs/
│   ├── GOOGLE_SHEETS_SETUP.md         # دليل إعداد Google Sheets
│   ├── N8N_WORKFLOW_GUIDE.md          # دليل بناء n8n Workflow
│   ├── GOOGLE_DOCS_TEMPLATE.md        # دليل إنشاء قالب Google Docs
│   └── DEPLOYMENT_GUIDE.md            # دليل النشر على Coolify
├── .env                               # متغيرات البيئة
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## المتطلبات الأساسية

- Node.js 18+
- npm أو yarn
- حساب Google مع صلاحيات Apps Script
- حساب n8n (مُستضاف أو محلي)
- Telegram Bot (اختياري)
- Coolify للنشر (أو أي خدمة استضافة أخرى)

## خطوات التثبيت والإعداد

### 1. استنساخ المشروع

```bash
git clone https://github.com/your-username/training-plan-system.git
cd training-plan-system
```

### 2. تثبيت المكتبات

```bash
npm install
```

### 3. إعداد Google Sheets

اتبع الخطوات التفصيلية في [`docs/GOOGLE_SHEETS_SETUP.md`](docs/GOOGLE_SHEETS_SETUP.md)

**باختصار:**
- أنشئ Google Sheets مع 5 صفحات: Groups, Plans, PlanElements, Requesters, PlanData
- املأ البيانات حسب البنية المطلوبة
- أنشئ Google Apps Script من محتوى `google-apps-script/Code.gs`
- انشره كـ Web App واحصل على الرابط

### 4. إعداد Google Docs Template

اتبع الخطوات في [`docs/GOOGLE_DOCS_TEMPLATE.md`](docs/GOOGLE_DOCS_TEMPLATE.md)

**باختصار:**
- أنشئ مستند Google Docs جديد
- أضف جميع Placeholders المطلوبة (<<student name>>, <<h1>>-<<h25>>, إلخ)
- احفظ Document ID للاستخدام في n8n

### 5. إعداد n8n Workflow

اتبع الدليل الشامل في [`docs/N8N_WORKFLOW_GUIDE.md`](docs/N8N_WORKFLOW_GUIDE.md)

**باختصار:**
- أنشئ Workflow جديد في n8n
- أضف جميع الـ Nodes المطلوبة (13 node)
- اربط Google Sheets, Google Docs, Google Drive, و Telegram
- احصل على Webhook URL

### 6. إعداد متغيرات البيئة

حدّث ملف `.env` بالقيم الصحيحة:

```env
# Supabase (موجود مسبقاً)
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-key

# Google Apps Script
VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec

# n8n Webhook
VITE_N8N_WEBHOOK_URL=https://your-n8n.com/webhook/training-plan
```

### 7. تشغيل المشروع محلياً

```bash
npm run dev
```

افتح المتصفح على `http://localhost:5173`

### 8. بناء للإنتاج

```bash
npm run build
```

الملفات الناتجة ستكون في مجلد `dist/`

## النشر على Coolify

اتبع الدليل التفصيلي في [`docs/DEPLOYMENT_GUIDE.md`](docs/DEPLOYMENT_GUIDE.md)

**الخطوات الرئيسية:**

1. ارفع الكود إلى Git Repository
2. أنشئ Application جديد في Coolify
3. أضف Environment Variables
4. اربط Subdomain
5. Deploy واختبر

## الاستخدام

### 1. فتح النظام

افتح رابط التطبيق في المتصفح

### 2. ملء النموذج

- **اسم الطالب:** أدخل اسم الطالب
- **المجموعة:** اختر من القائمة (تُجلب من Google Sheets)
- **نوع الخطة:** اختر نوع الخطة
- **عنصر الخطة:** يتم تحديث القائمة تلقائياً بناءً على نوع الخطة
- **أيام الدوام:** اختر يومين مختلفين
- **تاريخ البداية:** أدخل اليوم والشهر والسنة
- **مدة الخطة:** أدخل عدد الأيام (1-25)
- **طالب الملف:** اختر من القائمة

### 3. إنشاء الخطة

اضغط زر "إنشاء الخطة" وانتظر معالجة البيانات

### 4. تحميل الملف

بعد نجاح العملية، ستظهر رسالة نجاح مع زر "تحميل الملف"

## آلية عمل النظام

### 1. جلب البيانات

عند فتح الصفحة، يتم جلب البيانات من Google Sheets عبر Apps Script

### 2. معالجة الفورم

عند إرسال الفورم:

1. n8n يستقبل البيانات عبر Webhook
2. يبحث في Google Sheets عن plan element
3. يستخرج الصفوف المطلوبة بعدد plan duration
4. يحسب التواريخ بناءً على start date و day1/day2
5. يولّد قوائم h1-h25 (محتوى), d1-d25 (أيام), dt1-dt25 (تواريخ)
6. يقرأ قالب Google Docs ويستبدل جميع Placeholders
7. يصدّر المستند كـ PDF عبر Google Drive
8. يرسل الملف عبر Telegram للأرشفة
9. يُرجع رابط التحميل للواجهة

### 3. حساب التواريخ

النظام يحسب التواريخ بناءً على اليومين المحددين فقط، متخطياً باقي أيام الأسبوع.

## الأسئلة الشائعة

### لماذا القوائم فارغة؟

- تأكد من نشر Google Apps Script بصلاحية "Anyone"
- تأكد من صحة `VITE_GOOGLE_SCRIPT_URL` في `.env`
- افحص Console في المتصفح للأخطاء

### لماذا يفشل إرسال الفورم؟

- تأكد من تشغيل n8n Workflow
- تأكد من صحة `VITE_N8N_WEBHOOK_URL`
- افحص Execution Logs في n8n

### كيف أحدّث البيانات؟

قم بتحديث Google Sheets مباشرة، التغييرات ستظهر فوراً عند إعادة تحميل الصفحة.

## الدعم

للمساعدة والدعم، راجع ملفات التوثيق في مجلد `docs/`

---

**الإصدار:** 1.0.0
**آخر تحديث:** أكتوبر 2025
