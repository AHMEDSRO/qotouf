# قطوف (qtouf)

منصة بيع خضار وفاكهة أونلاين — جملة وقطاعي — دولة الإمارات.

## الفاز الحالي: Phase 1 — Local Scaffold

البيانات في الفاز ده بتتخزن في ملف JSON محلي (`.data/`) بدل Supabase — راجع `lib/data/` لمعمارية الـ repository اللي هتخلي التحويل لـ Supabase لاحقًا سهل من غير ما تتغير صفحات أو كومبوننتس.

تسجيل الدخول في الفاز ده وهمي (Mock) عن طريق `RoleSwitcher` — من غير Supabase Auth حقيقي.

## التشغيل محليًا

```bash
npm install
cp .env.example .env.local
npm run dev
```

يفتح على `http://localhost:3000` وهيحولك تلقائيًا لـ `/en` أو `/ar` حسب لغة المتصفح.

## البنية

- `app/[locale]/` — الصفحات (متجر + حساب + داشبورد)، كل حاجة تحت البادئة `/en` أو `/ar`
- `lib/data/` — طبقة البيانات (repository pattern) — مبنية على ملف JSON دلوقتي، هتتحول لـ Supabase لاحقًا
- `lib/rbac/` — الأدوار والصلاحيات
- `lib/types/` — أنواع البيانات (Product, Order, User...)
- `components/dev/RoleSwitcher.tsx` — أداة تطوير بس، لتبديل الدور الحالي وتجربة الصلاحيات

## المراحل القادمة

ربط Supabase الحقيقي، رفع المشروع على GitHub وربطه بـ Vercel، تفعيل Stripe، WhatsApp Business API، شات بوت ذكي، تسعير متدرج، تتبع صلاحية المنتجات، تطبيق موبايل/PWA.
