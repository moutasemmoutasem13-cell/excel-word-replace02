# إعداد Google Sheets

## البنية المطلوبة

يجب أن يحتوي Google Sheets على 5 صفحات (Tabs) بالترتيب التالي:

---

## 1. Sheet: "Groups" - المجموعات

| العمود A |
|----------|
| المجموعة الأولى |
| المجموعة الثانية |
| المجموعة الثالثة |

**مثال:**
```
A1: Group (عنوان - اختياري)
A2: المجموعة A
A3: المجموعة B
A4: المجموعة C
A5: المجموعة D
```

---

## 2. Sheet: "Plans" - أنواع الخطط

| العمود A |
|----------|
| خطة نوع 1 |
| خطة نوع 2 |
| خطة نوع 3 |

**مثال:**
```
A1: Plan Type (عنوان - اختياري)
A2: خطة تدريبية أساسية
A3: خطة تدريبية متقدمة
A4: خطة تدريبية مكثفة
```

---

## 3. Sheet: "PlanElements" - عناصر الخطط

| العمود A | العمود B |
|----------|----------|
| نوع الخطة | عنصر الخطة |

**مثال:**
```
A1: Plan Type          | B1: Plan Element
A2: خطة تدريبية أساسية  | B2: JavaScript Basics
A3: خطة تدريبية أساسية  | B3: HTML & CSS
A4: خطة تدريبية أساسية  | B4: React Fundamentals
A5: خطة تدريبية متقدمة  | B5: Node.js Backend
A6: خطة تدريبية متقدمة  | B6: Database Design
A7: خطة تدريبية متقدمة  | B7: API Development
```

**ملاحظة مهمة:** يجب أن يكون اسم نوع الخطة في العمود A مطابقاً تماماً للاسم في Sheet "Plans"

---

## 4. Sheet: "Requesters" - أسماء طالبي الملفات

| العمود A |
|----------|
| أحمد |
| سارة |
| محمد |

**مثال:**
```
A1: Requester Name (عنوان - اختياري)
A2: أحمد محمد
A3: سارة علي
A4: محمد حسن
A5: منى خالد
```

---

## 5. Sheet: "PlanData" - بيانات الخطط التفصيلية

هذا الجدول يحتوي على التفاصيل التي سيتم استخراجها وإدراجها في PDF

| العمود A | العمود B | العمود C | العمود D | ... |
|----------|----------|----------|----------|-----|
| اسم عنصر الخطة | التفاصيل 1 | التفاصيل 2 | التفاصيل 3 | ... |

**مثال:**
```
A1: Plan Element        | B1: Topic 1           | C1: Topic 2          | D1: Topic 3
A2: JavaScript Basics   | B2: Variables         | C2: Functions        | D2: Arrays
A3: JavaScript Basics   | B3: Loops             | C3: Objects          | D3: Conditions
A4: JavaScript Basics   | B4: DOM Manipulation  | C4: Events           | D4: Forms
A5: React Fundamentals  | B5: Components        | C5: Props            | D5: State
A6: React Fundamentals  | B6: Hooks             | C6: useEffect        | D6: Context API
```

**كيف يعمل:**
- عندما يختار المستخدم "JavaScript Basics" كـ Plan Element
- وعدد أيام الخطة = 3
- سيقوم النظام باستخراج 3 صفوف من هذا الجدول بدءاً من السطر الذي يطابق "JavaScript Basics"
- الصف 1: Variables, Functions, Arrays
- الصف 2: Loops, Objects, Conditions
- الصف 3: DOM Manipulation, Events, Forms

---

## خطوات الإعداد

### 1. إنشاء Google Sheets جديد

1. اذهب إلى [Google Sheets](https://sheets.google.com)
2. أنشئ ملف جديد
3. أعد تسمية الصفحات الافتراضية أو أضف صفحات جديدة بالأسماء التالية:
   - Groups
   - Plans
   - PlanElements
   - Requesters
   - PlanData

### 2. ملء البيانات

- املأ كل صفحة بالبيانات المطلوبة حسب الأمثلة أعلاه
- تأكد من أن الأسماء في "PlanElements" و "Plans" متطابقة
- تأكد من أن الأسماء في "PlanData" العمود A متطابقة مع العناصر في "PlanElements" العمود B

### 3. ربط Google Apps Script

1. من ملف Google Sheets، اذهب إلى: **Extensions > Apps Script**
2. احذف أي كود موجود
3. الصق محتوى ملف `google-apps-script/Code.gs`
4. احفظ المشروع (Ctrl+S أو File > Save)
5. سمّي المشروع: "Training Plan API"

### 4. نشر Apps Script كـ Web App

1. في محرر Apps Script، اضغط **Deploy > New deployment**
2. اضغط على أيقونة الترس ⚙️ بجوار "Select type"
3. اختر **Web app**
4. املأ التفاصيل:
   - **Description:** Training Plan Data API
   - **Execute as:** Me (بريدك الإلكتروني)
   - **Who has access:** Anyone
5. اضغط **Deploy**
6. إذا طُلب منك، اسمح بالصلاحيات المطلوبة
7. **انسخ رابط Web app URL** (سيكون بالشكل: `https://script.google.com/macros/s/AKfycbx.../exec`)

### 5. إضافة الرابط في المشروع

افتح ملف `.env` في المشروع وضع الرابط:

```env
VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

---

## اختبار الإعداد

### اختبار من Apps Script Editor

في محرر Apps Script، يمكنك تشغيل دالة الاختبار:

1. اختر `testGetData` من القائمة المنسدلة في الأعلى
2. اضغط على زر Run (▶️)
3. افتح "Execution log" من الأسفل
4. يجب أن ترى البيانات بصيغة JSON

### اختبار من المتصفح

افتح رابط Web App في المتصفح مباشرة، يجب أن تحصل على استجابة JSON مثل:

```json
{
  "groups": ["المجموعة A", "المجموعة B"],
  "plans": ["خطة تدريبية أساسية", "خطة تدريبية متقدمة"],
  "planElements": {
    "خطة تدريبية أساسية": ["JavaScript Basics", "HTML & CSS"],
    "خطة تدريبية متقدمة": ["Node.js Backend", "Database Design"]
  },
  "requesters": ["أحمد محمد", "سارة علي"]
}
```

---

## نصائح وملاحظات

1. **الصف الأول** في كل Sheet يمكن أن يكون عنوان (Header) - سيتم تجاهله تلقائياً
2. **لا تترك صفوف فارغة** بين البيانات
3. **تأكد من تطابق الأسماء** بين الجداول المختلفة
4. **احفظ نسخة احتياطية** من Google Sheets دورياً
5. إذا قمت بتعديل Apps Script، يجب إنشاء **Deployment جديد**
6. يمكنك تحديث البيانات في Google Sheets في أي وقت دون الحاجة لتحديث الكود

---

## حل المشاكل الشائعة

### البيانات لا تظهر في الفورم

- تأكد من رابط VITE_GOOGLE_SCRIPT_URL في ملف .env
- تأكد من أن Apps Script منشور بصلاحية "Anyone"
- افتح رابط Web App في المتصفح وتأكد من عودة JSON صحيح

### بعض القوائم فارغة

- تأكد من تسمية Sheets بالأسماء الصحيحة تماماً (حساسة لحالة الأحرف)
- تأكد من وجود بيانات في الأعمدة الصحيحة

### خطأ في الصلاحيات

- قد تحتاج إلى السماح للسكريبت بالوصول إلى Google Sheets
- اذهب إلى Apps Script > Permissions وامنح الصلاحيات المطلوبة
