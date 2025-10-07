# دليل النشر على Coolify

هذا الدليل يشرح خطوات نشر التطبيق على Coolify مع ربطه بـ subdomain.

---

## المتطلبات الأساسية

قبل البدء، تأكد من توفر:

1. حساب على Coolify مع صلاحيات الوصول
2. Domain أو Subdomain جاهز للاستخدام
3. روابط Google Apps Script و n8n Webhook جاهزة
4. Git repository يحتوي على كود المشروع

---

## خطوة 1: تجهيز المشروع للنشر

### 1. تحديث ملف .env

قبل النشر، تأكد من تحديث ملف `.env` بالقيم الصحيحة:

```env
# قيم Supabase (موجودة مسبقاً)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# رابط Google Apps Script
VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec

# رابط n8n Webhook
VITE_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/training-plan
```

### 2. اختبار البناء محلياً

```bash
npm run build
```

إذا نجح البناء بدون أخطاء، أنت جاهز للنشر.

### 3. رفع الكود إلى Git Repository

```bash
git add .
git commit -m "Initial commit - Training Plan System"
git push origin main
```

**ملاحظة مهمة:** تأكد من إضافة `.env` إلى `.gitignore` حتى لا يتم رفع المفاتيح السرية.

---

## خطوة 2: إنشاء Application في Coolify

### 1. تسجيل الدخول إلى Coolify

اذهب إلى لوحة تحكم Coolify وسجّل دخولك.

### 2. إنشاء Project جديد

1. من القائمة الرئيسية، اضغط على **Projects**
2. اضغط على **+ New Project**
3. أدخل:
   - **Project Name:** Training Plan System
   - **Description:** نظام إدارة الخطط التدريبية
4. اضغط **Create**

### 3. إنشاء Application جديد

1. داخل المشروع، اضغط **+ New Resource**
2. اختر **Application**
3. اختر نوع التطبيق: **Public Repository** أو **Private Repository**

---

## خطوة 3: ضبط إعدادات Application

### 1. Git Configuration

أدخل معلومات Git repository:

```
Repository URL: https://github.com/your-username/training-plan-system.git
Branch: main
```

إذا كان Repository خاص:
- أضف SSH Key أو Personal Access Token

### 2. Build Configuration

**Build Pack:** Nixpacks (يتم اكتشافه تلقائياً لمشاريع Node.js)

أو يمكنك استخدام Dockerfile مخصص:

```dockerfile
FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 3. Port Configuration

```
Port: 3000 (أو المنفذ الذي يستخدمه Vite)
```

---

## خطوة 4: إضافة Environment Variables

في صفحة Application، اذهب إلى **Environment Variables**:

اضغط **+ Add Variable** وأضف:

```
VITE_SUPABASE_URL = https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY = your-anon-key
VITE_GOOGLE_SCRIPT_URL = https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
VITE_N8N_WEBHOOK_URL = https://your-n8n-instance.com/webhook/training-plan
```

**ملاحظة:** تأكد من أن أسماء المتغيرات تبدأ بـ `VITE_` حتى يتعرف عليها Vite.

---

## خطوة 5: ضبط Domain و Subdomain

### 1. إضافة Domain

في قسم **Domains**:

1. اضغط **+ Add Domain**
2. أدخل الـ subdomain المطلوب:
   ```
   training.yourdomain.com
   ```
3. اضغط **Add**

### 2. تفعيل SSL

Coolify يفعّل SSL تلقائياً باستخدام Let's Encrypt:

- تأكد من تفعيل خيار **Enable Automatic SSL**

### 3. ضبط DNS Records

في لوحة تحكم الـ Domain الخاص بك (مثل Namecheap أو Cloudflare):

أضف سجل DNS جديد:

```
Type: A أو CNAME
Name: training (أو اسم الـ subdomain)
Value: IP address الخاص بـ Coolify server
TTL: Auto أو 300
```

**مثال:**
```
A Record
Name: training
Value: 123.456.789.0
TTL: 300
```

انتظر من 5-30 دقيقة حتى ينتشر التحديث.

---

## خطوة 6: Deploy Application

### 1. بدء النشر

بعد ضبط جميع الإعدادات:

1. اضغط **Deploy**
2. راقب عملية البناء في **Build Logs**
3. انتظر حتى يصبح Status = **Running**

### 2. التحقق من النشر

افتح المتصفح واذهب إلى:
```
https://training.yourdomain.com
```

يجب أن تظهر واجهة النظام.

---

## خطوة 7: اختبار النظام الكامل

### 1. اختبار جلب البيانات

- افتح الصفحة
- تحقق من تحميل القوائم المنسدلة من Google Sheets
- إذا ظهرت رسالة خطأ، افحص:
  - صحة رابط Google Apps Script
  - صلاحيات النشر (Anyone can access)

### 2. اختبار إرسال الفورم

- املأ جميع الحقول
- اضغط Submit
- راقب:
  - رسالة التحميل
  - استجابة n8n
  - ظهور رابط PDF

### 3. اختبار Telegram

- تحقق من وصول ملف PDF إلى Telegram
- تأكد من احتواء الرسالة على المعلومات الصحيحة

---

## Nginx Configuration (إذا لزم)

إذا كنت تستخدم Nginx كـ reverse proxy، استخدم هذا الإعداد:

```nginx
server {
    listen 80;
    server_name training.yourdomain.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name training.yourdomain.com;

    # SSL Configuration
    ssl_certificate /path/to/fullchain.pem;
    ssl_certificate_key /path/to/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;

    root /usr/share/nginx/html;
    index index.html;

    # Compression
    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;
    gzip_comp_level 5;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

---

## خطوة 8: المراقبة والصيانة

### 1. مراقبة Logs

في Coolify، يمكنك مراقبة:

- **Build Logs:** لوغات عملية البناء
- **Runtime Logs:** لوغات التشغيل الفعلي
- **Deployment History:** سجل عمليات النشر

### 2. التحديثات التلقائية

لتفعيل التحديثات التلقائية عند Push إلى Git:

1. في إعدادات Application
2. فعّل **Automatic Deployment**
3. اختر **Branch:** main
4. الآن عند كل Push، سيتم النشر تلقائياً

### 3. Rollback إذا لزم

إذا حدثت مشكلة:

1. اذهب إلى **Deployment History**
2. اختر آخر نسخة عاملة
3. اضغط **Rollback**

---

## حل المشاكل الشائعة

### 1. الصفحة لا تفتح بعد النشر

**الحل:**
- تحقق من DNS propagation: `dig training.yourdomain.com`
- تحقق من Firewall rules على السيرفر
- تأكد من أن التطبيق يعمل: افحص Runtime Logs

### 2. القوائم فارغة في الواجهة

**الحل:**
- افحص Console في المتصفح (F12)
- تحقق من صحة `VITE_GOOGLE_SCRIPT_URL`
- تأكد من أن Apps Script منشور بصلاحية "Anyone"
- جرب فتح رابط Apps Script مباشرة في المتصفح

### 3. خطأ عند إرسال الفورم

**الحل:**
- تحقق من صحة `VITE_N8N_WEBHOOK_URL`
- تأكد من تشغيل n8n Workflow
- افحص n8n Execution Logs
- تحقق من CORS settings في n8n

### 4. SSL Certificate Error

**الحل:**
- تحقق من DNS records
- انتظر قليلاً (قد يستغرق إصدار Certificate بضع دقائق)
- جرب إعادة إنشاء Certificate في Coolify
- تأكد من أن Port 80 و 443 مفتوحين

### 5. Build يفشل في Coolify

**الحل:**
- افحص Build Logs للتفاصيل
- تأكد من أن `package.json` يحتوي على جميع Dependencies
- جرب البناء محلياً: `npm run build`
- تحقق من Node.js version compatibility

---

## Continuous Integration (CI/CD)

### استخدام GitHub Actions

يمكنك إضافة ملف `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Coolify

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build project
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
          VITE_GOOGLE_SCRIPT_URL: ${{ secrets.VITE_GOOGLE_SCRIPT_URL }}
          VITE_N8N_WEBHOOK_URL: ${{ secrets.VITE_N8N_WEBHOOK_URL }}

      - name: Trigger Coolify Deploy
        run: |
          curl -X POST https://coolify.yourdomain.com/api/v1/deploy \
            -H "Authorization: Bearer ${{ secrets.COOLIFY_TOKEN }}" \
            -d '{"project": "training-plan-system"}'
```

---

## Performance Optimization

### 1. Enable Caching

في `vite.config.ts`:

```typescript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          icons: ['lucide-react']
        }
      }
    }
  }
});
```

### 2. Image Optimization

إذا كان التطبيق يحتوي على صور:
- استخدم WebP format
- Lazy loading للصور
- استخدم CDN إذا لزم

### 3. Code Splitting

Vite يقوم بذلك تلقائياً، لكن يمكنك تحسينه بـ:

```typescript
const LazyComponent = lazy(() => import('./components/HeavyComponent'));
```

---

## Backup و Recovery

### 1. نسخ احتياطي للكود

- الكود موجود في Git Repository (محفوظ تلقائياً)
- استخدم Git Tags للإصدارات المهمة:
  ```bash
  git tag -a v1.0.0 -m "First production release"
  git push origin v1.0.0
  ```

### 2. نسخ احتياطي للبيانات

- Google Sheets: نسخة احتياطية يدوية أو تلقائية
- Google Docs Template: احفظ نسخة محلية
- Environment Variables: احفظها في مكان آمن (Password Manager)

### 3. Disaster Recovery Plan

إذا توقف النظام:

1. تحقق من Coolify Status
2. افحص Logs لمعرفة السبب
3. إذا لزم، قم بـ Rollback إلى آخر نسخة عاملة
4. أصلح المشكلة في branch منفصل
5. اختبر محلياً ثم Deploy

---

## الخلاصة

**الخطوات الأساسية:**

1. جهّز المشروع وتأكد من البناء المحلي
2. ارفع الكود إلى Git Repository
3. أنشئ Application في Coolify
4. أضف Environment Variables
5. اربط Subdomain
6. Deploy وراقب Logs
7. اختبر النظام بالكامل
8. راقب الأداء والأخطاء

**روابط مهمة بعد النشر:**

- Application URL: `https://training.yourdomain.com`
- Coolify Dashboard: لمراقبة الأداء
- Google Sheets: لتحديث البيانات
- n8n Dashboard: لمراقبة Workflows
- Telegram: لاستقبال الملفات

---

## الدعم والمساعدة

إذا واجهت أي مشكلة:

1. راجع هذا الدليل والأدلة الأخرى في مجلد `/docs`
2. افحص Logs في Coolify
3. اختبر كل مكون على حدة
4. استخدم Browser DevTools للتشخيص
5. راجع توثيق Coolify الرسمي
