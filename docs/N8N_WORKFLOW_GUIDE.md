# دليل إعداد n8n Workflow

هذا الدليل يشرح بالتفصيل كيفية بناء Workflow على n8n لمعالجة البيانات وتوليد PDF.

---

## نظرة عامة على Workflow

### المدخلات:
- بيانات من الفورم (JSON)

### المخرجات:
- ملف PDF
- إرسال الملف عبر Telegram
- رابط التحميل

### العمليات:
1. استقبال البيانات
2. البحث في Google Sheets
3. استخراج الصفوف المطلوبة
4. حساب التواريخ وأسماء الأيام
5. استبدال Placeholders في Google Docs
6. توليد PDF
7. إرسال عبر Telegram
8. إرجاع رابط التحميل

---

## Node 1: Webhook - استقبال البيانات

**النوع:** Webhook (Trigger)

**الإعدادات:**
- **HTTP Method:** POST
- **Path:** `/training-plan` (أو أي مسار تختاره)
- **Response Mode:** "When Last Node Finishes"
- **Response Data:** "First Entry JSON"

**البيانات المستقبلة:**
```json
{
  "studentName": "محمد أحمد",
  "group": "المجموعة A",
  "planType": "خطة تدريبية أساسية",
  "planElement": "JavaScript Basics",
  "day1": "الأحد",
  "day2": "الثلاثاء",
  "startDay": 15,
  "startMonth": 10,
  "startYear": 2025,
  "planDuration": 10,
  "requesterName": "سارة علي"
}
```

**ملاحظة:** بعد إنشاء الـ Webhook، انسخ URL الخاص به وضعه في ملف `.env`:
```
VITE_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/training-plan
```

---

## Node 2: Google Sheets - البحث عن Plan Element

**النوع:** Google Sheets

**الإعدادات:**
- **Operation:** Lookup
- **Document:** [اختر Google Sheets الخاص بك]
- **Sheet:** PlanData
- **Lookup Column:** A (العمود الأول)
- **Lookup Value:** `{{ $json.planElement }}`

**الناتج:**
- صف واحد يحتوي على موقع plan element في الجدول

---

## Node 3: Google Sheets - قراءة الصفوف

**النوع:** Google Sheets

**الإعدادات:**
- **Operation:** Get Many
- **Document:** [نفس Google Sheets]
- **Sheet:** PlanData
- **Range:** `A{{ $json.rowNumber }}:Z{{ $json.rowNumber + $('Webhook').item.json.planDuration }}`

**الملاحظات:**
- نقرأ من الصف الذي وجدناه في Node 2
- نقرأ عدد صفوف = `planDuration`
- نقرأ جميع الأعمدة من A إلى Z

---

## Node 4: Function - تنسيق البيانات وحساب التواريخ

**النوع:** Function

**الكود:**

```javascript
const webhookData = $('Webhook').item.json;
const sheetsData = items.map(item => item.json);

const dayMapping = {
  'الأحد': 0,
  'الاثنين': 1,
  'الثلاثاء': 2,
  'الأربعاء': 3,
  'الخميس': 4,
  'الجمعة': 5,
  'السبت': 6
};

const dayNames = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

const day1Index = dayMapping[webhookData.day1];
const day2Index = dayMapping[webhookData.day2];

const startDate = new Date(
  webhookData.startYear,
  webhookData.startMonth - 1,
  webhookData.startDay
);

const trainingDays = [day1Index, day2Index].sort((a, b) => a - b);

const dates = [];
let currentDate = new Date(startDate);

while (dates.length < webhookData.planDuration) {
  const dayOfWeek = currentDate.getDay();

  if (trainingDays.includes(dayOfWeek)) {
    dates.push({
      dayName: dayNames[dayOfWeek],
      date: currentDate.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      dateShort: currentDate.toLocaleDateString('en-GB')
    });
  }

  currentDate.setDate(currentDate.getDate() + 1);
}

const result = {
  studentName: webhookData.studentName,
  group: webhookData.group,
  plan: webhookData.planType,
  requesterName: webhookData.requesterName
};

for (let i = 0; i < 25; i++) {
  const index = i + 1;

  if (i < dates.length) {
    result[`d${index}`] = dates[i].dayName;
    result[`dt${index}`] = dates[i].date;
  } else {
    result[`d${index}`] = '';
    result[`dt${index}`] = '';
  }

  if (i < sheetsData.length && sheetsData[i]) {
    const row = Object.values(sheetsData[i]);
    result[`h${index}`] = row[1] || '';
  } else {
    result[`h${index}`] = '';
  }
}

return [{ json: result }];
```

**الشرح:**
- يقوم بتحويل أسماء الأيام العربية إلى أرقام
- يحسب التواريخ بناءً على اليومين المحددين فقط
- يولد 25 متغير لأسماء الأيام (d1-d25)
- يولد 25 متغير للتواريخ الكاملة (dt1-dt25)
- يولد 25 متغير للمحتوى من Google Sheets (h1-h25)

---

## Node 5: Google Docs - قراءة القالب

**النوع:** Google Docs

**الإعدادات:**
- **Operation:** Get Document
- **Document ID:** [ID مستند Google Docs القالب]

**ملاحظة:** يمكن الحصول على Document ID من رابط المستند:
```
https://docs.google.com/document/d/DOCUMENT_ID_HERE/edit
```

---

## Node 6: Function - استبدال Placeholders

**النوع:** Function

**الكود:**

```javascript
const docData = $('Google Docs').item.json;
const placeholderData = $('Function').item.json;

let content = docData.body.content
  .map(element => {
    if (element.paragraph) {
      return element.paragraph.elements
        .map(el => el.textRun?.content || '')
        .join('');
    }
    return '';
  })
  .join('');

content = content.replace(/<<student name>>/g, placeholderData.studentName);
content = content.replace(/<<group>>/g, placeholderData.group);
content = content.replace(/<<plan>>/g, placeholderData.plan);
content = content.replace(/<<requester>>/g, placeholderData.requesterName);

for (let i = 1; i <= 25; i++) {
  const hRegex = new RegExp(`<<h${i}>>`, 'g');
  const dRegex = new RegExp(`<<d${i}>>`, 'g');
  const dtRegex = new RegExp(`<<dt${i}>>`, 'g');

  content = content.replace(hRegex, placeholderData[`h${i}`] || '');
  content = content.replace(dRegex, placeholderData[`d${i}`] || '');
  content = content.replace(dtRegex, placeholderData[`dt${i}`] || '');
}

return [{
  json: {
    content,
    studentName: placeholderData.studentName,
    group: placeholderData.group
  }
}];
```

**الشرح:**
- يستخرج النص من مستند Google Docs
- يستبدل جميع Placeholders بالقيم الفعلية
- يعيد المحتوى الجديد

---

## Node 7: Google Docs - إنشاء مستند جديد

**النوع:** Google Docs

**الإعدادات:**
- **Operation:** Create Document
- **Document Name:** `خطة_تدريبية_{{ $json.studentName }}_{{ $now }}`
- **Content:** `{{ $json.content }}`

---

## Node 8: Google Drive - تصدير كـ PDF

**النوع:** Google Drive

**الإعدادات:**
- **Operation:** Download File
- **File ID:** `{{ $json.documentId }}`
- **Options > MIME Type:** application/pdf

---

## Node 9: Google Drive - حفظ PDF

**النوع:** Google Drive

**الإعدادات:**
- **Operation:** Upload File
- **File Content:** `{{ $json.data }}`
- **File Name:** `خطة_تدريبية_{{ $('Function').item.json.studentName }}.pdf`
- **Options > Parent Folder:** [اختر مجلد للحفظ]

---

## Node 10: Google Drive - جعل الملف عام

**النوع:** Google Drive

**الإعدادات:**
- **Operation:** Share File
- **File ID:** `{{ $json.id }}`
- **Permissions:**
  - **Role:** reader
  - **Type:** anyone

---

## Node 11: Telegram - إرسال الملف

**النوع:** Telegram

**الإعدادات:**
- **Operation:** Send Document
- **Chat ID:** [ID القناة أو المستخدم]
- **Binary Property:** data
- **Caption:**
  ```
  📄 خطة تدريبية جديدة

  👤 الطالب: {{ $('Function').item.json.studentName }}
  📚 المجموعة: {{ $('Function').item.json.group }}
  📋 الخطة: {{ $('Function').item.json.plan }}
  🙋 طلب الملف: {{ $('Function').item.json.requesterName }}
  ```

**ملاحظات:**
- يجب إنشاء Telegram Bot أولاً عبر @BotFather
- احصل على Bot Token وضعه في إعدادات n8n
- للحصول على Chat ID، أرسل رسالة للبوت ثم استخدم:
  ```
  https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
  ```

---

## Node 12: Function - تنسيق الاستجابة النهائية

**النوع:** Function

**الكود:**

```javascript
const driveData = $('Google Drive').item.json;

const pdfUrl = `https://drive.google.com/file/d/${driveData.id}/view`;
const downloadUrl = `https://drive.google.com/uc?export=download&id=${driveData.id}`;

return [{
  json: {
    success: true,
    pdfUrl: downloadUrl,
    viewUrl: pdfUrl,
    message: 'تم إنشاء الخطة التدريبية بنجاح'
  }
}];
```

---

## Node 13: Respond to Webhook

**النوع:** Respond to Webhook

**الإعدادات:**
- **Response Body:** `{{ $json }}`

---

## إعداد Credentials المطلوبة في n8n

### 1. Google Sheets API
- اذهب إلى Google Cloud Console
- فعّل Google Sheets API
- أنشئ Service Account
- حمّل JSON key
- أضف Service Account email إلى Google Sheets بصلاحية Editor

### 2. Google Docs API
- نفس الخطوات السابقة
- فعّل Google Docs API

### 3. Google Drive API
- نفس الخطوات السابقة
- فعّل Google Drive API

### 4. Telegram Bot
- أرسل رسالة إلى @BotFather
- أنشئ Bot جديد بالأمر `/newbot`
- احصل على Bot Token
- أضف Token في n8n Credentials

---

## معالجة الأخطاء (Error Handling)

يُنصح بإضافة Error Trigger Node في بداية Workflow:

**Error Trigger Settings:**
- يتم تفعيله عند فشل أي Node
- يرسل إشعار للمسؤول عبر Telegram أو Email
- يعيد استجابة خطأ واضحة للواجهة

**مثال على استجابة الخطأ:**
```javascript
return [{
  json: {
    success: false,
    error: 'حدث خطأ أثناء معالجة الطلب',
    details: $json.error?.message
  }
}];
```

---

## اختبار Workflow

### 1. اختبار من n8n Interface

استخدم "Execute Workflow" مع بيانات تجريبية:

```json
{
  "studentName": "اختبار",
  "group": "المجموعة A",
  "planType": "خطة تدريبية أساسية",
  "planElement": "JavaScript Basics",
  "day1": "الأحد",
  "day2": "الثلاثاء",
  "startDay": 1,
  "startMonth": 1,
  "startYear": 2025,
  "planDuration": 5,
  "requesterName": "اختبار"
}
```

### 2. اختبار من الواجهة

- تأكد من إضافة Webhook URL في `.env`
- املأ الفورم واضغط Submit
- راقب تنفيذ Workflow في n8n
- تأكد من وصول الملف عبر Telegram

---

## نصائح للأداء

1. **استخدم Caching** للبيانات التي لا تتغير كثيراً
2. **قلّل عدد API Calls** بدمج العمليات المتشابهة
3. **استخدم Queue Mode** إذا كان عدد الطلبات كبير
4. **راقب Execution History** لتتبع المشاكل
5. **احفظ نسخة احتياطية** من Workflow بانتظام

---

## Workflow Diagram

```
Webhook (استقبال)
   ↓
Google Sheets (بحث)
   ↓
Google Sheets (قراءة صفوف)
   ↓
Function (حساب التواريخ)
   ↓
Google Docs (قراءة القالب)
   ↓
Function (استبدال Placeholders)
   ↓
Google Docs (إنشاء مستند)
   ↓
Google Drive (تصدير PDF)
   ↓
Google Drive (حفظ ملف)
   ↓
Google Drive (مشاركة)
   ↓
Telegram (إرسال)
   ↓
Function (تنسيق استجابة)
   ↓
Respond to Webhook
```

---

## حل المشاكل الشائعة

### Webhook لا يستجيب
- تأكد من تفعيل Workflow
- تأكد من صحة URL
- تحقق من CORS إذا كان n8n على domain مختلف

### خطأ في Google Sheets
- تأكد من صلاحيات Service Account
- تحقق من أن Sheet Name صحيح تماماً
- تأكد من وجود البيانات في الأعمدة الصحيحة

### PDF فارغ أو غير منسق
- تحقق من أن Placeholders في Docs مكتوبة بشكل صحيح
- تأكد من أن Function تعيد جميع القيم
- استخدم Debug mode لمعاينة البيانات في كل خطوة

### Telegram لا يرسل
- تحقق من Bot Token
- تأكد من صحة Chat ID
- تحقق من أن الملف لا يتجاوز حد Telegram (50MB)
