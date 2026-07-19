import { isLocale, type Locale } from '@/lib/i18n/config';
import { notFound } from 'next/navigation';
import { PolicyPage } from '@/components/storefront/PolicyPage';

export default function TermsPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;

  if (locale === 'ar') {
    return (
      <PolicyPage locale={locale} titleEn="Terms & Conditions" titleAr="الشروط والأحكام">
        <p>باستخدامك منصة قطوف، إنت موافق على الشروط دي.</p>
        <h2>الحسابات</h2>
        <p>المنصة فيها نوعين حساب: حساب قطاعي (أفراد) وحساب جملة (منشآت تجارية). التسجيل كتاجر جملة فوري، ورفع الرخصة التجارية مُستحسن لرفع مستوى الثقة لكنه مش شرط لفتح الحساب.</p>
        <h2>الأسعار والضريبة</h2>
        <p>كل الأسعار المعروضة بالدرهم الإماراتي وقبل احتساب ضريبة القيمة المضافة (5٪)، واللي بتتحسب تلقائيًا وتظهر بالتفصيل في فاتورتك النهائية.</p>
        <h2>الدفع</h2>
        <ul>
          <li>الدفع بالبطاقة (لما يتفعّل) بيتم بالكامل من خلال بوابة دفع معتمدة — بياناتك ما بتوصلش لسيرفراتنا مباشرة.</li>
          <li>عملاء الجملة المعتمدين يقدروا يدفعوا بتحويل بنكي أو بفاتورة آجلة، حسب حد الائتمان المحدد لحسابهم.</li>
        </ul>
        <h2>المخزون والتوفر</h2>
        <p>الكميات المعروضة بتتحدث بشكل دوري، لكن في حالات نادرة ممكن يخلص صنف بعد ما تأكد الطلب — هنبلغك فورًا ونقترح بديل أو نعدّل الفاتورة.</p>
        <h2>التواصل</h2>
        <p>هنستخدم واتساب والإيميل لإشعارك بحالة طلبك ولأي تواصل ضروري بخصوص حسابك.</p>
      </PolicyPage>
    );
  }

  return (
    <PolicyPage locale={locale} titleEn="Terms & Conditions" titleAr="الشروط والأحكام">
      <p>By using the Qtouf platform, you agree to these terms.</p>
      <h2>Accounts</h2>
      <p>The platform supports two account types: retail (individuals) and wholesale (businesses). Wholesale registration is instant; uploading a trade license is encouraged to build trust but isn’t required to open an account.</p>
      <h2>Pricing and VAT</h2>
      <p>All prices are shown in AED, exclusive of 5% VAT, which is calculated automatically and itemized on your final invoice.</p>
      <h2>Payment</h2>
      <ul>
        <li>Card payments (once activated) are handled entirely through a licensed payment gateway — your card details never reach our servers directly.</li>
        <li>Approved wholesale customers can pay by bank transfer or on invoice credit, up to their assigned credit limit.</li>
      </ul>
      <h2>Stock and availability</h2>
      <p>Displayed quantities are updated regularly, but in rare cases an item may sell out after your order is confirmed — we’ll notify you immediately and offer a substitute or adjust your invoice.</p>
      <h2>Communication</h2>
      <p>We use WhatsApp and email to notify you of order status and for any necessary communication about your account.</p>
    </PolicyPage>
  );
}
