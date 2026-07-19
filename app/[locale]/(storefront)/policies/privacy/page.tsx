import { isLocale, type Locale } from '@/lib/i18n/config';
import { notFound } from 'next/navigation';
import { PolicyPage } from '@/components/storefront/PolicyPage';

export default function PrivacyPolicyPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;

  if (locale === 'ar') {
    return (
      <PolicyPage locale={locale} titleEn="Privacy Policy" titleAr="سياسة الخصوصية">
        <p>خصوصية بياناتك مهمة لينا. الصفحة دي بتوضح إيه اللي بنجمعه وليه.</p>
        <h2>البيانات اللي بنجمعها</h2>
        <ul>
          <li>بيانات الحساب: الاسم، الإيميل، رقم الهاتف، وعنوان التوصيل (أو بيانات المنشأة لعملاء الجملة).</li>
          <li>بيانات الطلبات: المنتجات، الكميات، القيم، وتاريخ الطلبات.</li>
          <li>بيانات الدفع الأساسية (زي طريقة الدفع)، من غير ما نخزّن بيانات البطاقة نفسها على سيرفراتنا.</li>
        </ul>
        <h2>ليه بنستخدمها</h2>
        <p>لتنفيذ وتوصيل طلباتك، إدارة حسابك وحد الائتمان (لعملاء الجملة)، والتواصل معاك بخصوص حالة الطلب.</p>
        <h2>مين بيشوف بياناتك</h2>
        <p>فريق قطوف المصرّح له بس (حسب دوره الوظيفي)، وموفّري الخدمة اللي بنشتغل معاهم (استضافة قاعدة البيانات، بوابة الدفع) — وكلهم ملتزمين بحماية بياناتك.</p>
        <h2>حقوقك</h2>
        <p>تقدر تطلب تشوف أو تعدّل أو تحذف بياناتك في أي وقت عن طريق التواصل معانا.</p>
      </PolicyPage>
    );
  }

  return (
    <PolicyPage locale={locale} titleEn="Privacy Policy" titleAr="سياسة الخصوصية">
      <p>Your data privacy matters to us. This page explains what we collect and why.</p>
      <h2>What we collect</h2>
      <ul>
        <li>Account details: name, email, phone, and delivery address (or business details for wholesale customers).</li>
        <li>Order data: products, quantities, amounts, and order history.</li>
        <li>Basic payment information (such as payment method), without ever storing card details on our own servers.</li>
      </ul>
      <h2>How we use it</h2>
      <p>To fulfil and deliver your orders, manage your account and credit limit (for wholesale customers), and contact you about order status.</p>
      <h2>Who can see it</h2>
      <p>Only authorized Qutoof staff (based on their role), and the service providers we work with (database hosting, payment gateway) — all bound to protect your data.</p>
      <h2>Your rights</h2>
      <p>You can request to view, correct, or delete your data at any time by contacting us.</p>
    </PolicyPage>
  );
}
