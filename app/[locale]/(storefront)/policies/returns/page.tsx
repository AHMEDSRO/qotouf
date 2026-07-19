import { isLocale, type Locale } from '@/lib/i18n/config';
import { notFound } from 'next/navigation';
import { PolicyPage } from '@/components/storefront/PolicyPage';

export default function ReturnPolicyPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;

  if (locale === 'ar') {
    return (
      <PolicyPage locale={locale} titleEn="Return Policy" titleAr="سياسة الاسترجاع">
        <p>لأن منتجاتنا طازة وسريعة التلف، سياسة الاسترجاع بتاعتنا مبنية على استبدال أو تعويض المنتج التالف، مش استرجاع تقليدي.</p>
        <h2>لو وصلك منتج تالف أو مش مطابق</h2>
        <ul>
          <li>بلّغنا خلال 24 ساعة من استلام الطلب عن طريق واتساب أو من صفحة الطلب في حسابك.</li>
          <li>يفضّل ترفق صورة للمنتج التالف — ده بيسرّع المراجعة.</li>
          <li>هيتم إما استبدال الصنف في التوصيلة الجاية، أو خصم قيمته من فاتورتك، حسب الأنسب لك.</li>
        </ul>
        <h2>عملاء الجملة</h2>
        <p>أي بند تالف في أوردر جملة بيتراجع مع موظف المبيعات المسؤول عن حسابك، ويتم تسويته في الفاتورة التالية أو برصيد فوري حسب الاتفاق.</p>
        <h2>حاجات مش مشمولة</h2>
        <p>التغيير في الرأي بعد التسليم، أو سوء التخزين بعد الاستلام، مش مشمولين في سياسة الاستبدال دي.</p>
      </PolicyPage>
    );
  }

  return (
    <PolicyPage locale={locale} titleEn="Return Policy" titleAr="سياسة الاسترجاع">
      <p>Because our products are fresh and perishable, our policy is built around replacement or compensation for damaged items, not a traditional return.</p>
      <h2>If an item arrives damaged or doesn’t match your order</h2>
      <ul>
        <li>Let us know within 24 hours of delivery via WhatsApp or from the order page in your account.</li>
        <li>A photo of the damaged item helps us review it faster.</li>
        <li>We’ll either replace the item on your next delivery or credit its value to your invoice — whichever works better for you.</li>
      </ul>
      <h2>Wholesale customers</h2>
      <p>Any damaged line item on a wholesale order is reviewed with your assigned sales rep and settled on your next invoice or as an immediate credit, by agreement.</p>
      <h2>What’s not covered</h2>
      <p>Change of mind after delivery, or improper storage after you’ve received the order, are not covered by this replacement policy.</p>
    </PolicyPage>
  );
}
