import { isLocale, type Locale } from '@/lib/i18n/config';
import { notFound } from 'next/navigation';
import { PolicyPage } from '@/components/storefront/PolicyPage';

export default function DeliveryPolicyPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;

  if (locale === 'ar') {
    return (
      <PolicyPage locale={locale} titleEn="Delivery Policy" titleAr="سياسة التوصيل">
        <p>قطوف بتوصّل خضار وفاكهة طازة لكل إمارات الدولة السبع: دبي، أبوظبي، الشارقة، عجمان، أم القيوين، رأس الخيمة، والفجيرة.</p>
        <h2>رسوم التوصيل</h2>
        <p>رسوم التوصيل بتختلف حسب المنطقة، وبتظهر واضحة في صفحة الدفع قبل ما تأكد الطلب — مفيش رسوم مخفية.</p>
        <h2>مواعيد التوصيل</h2>
        <ul>
          <li>الطلبات القطاعية بتتوصل عادةً خلال نفس اليوم أو اليوم التالي حسب المنطقة ووقت الطلب.</li>
          <li>طلبات الجملة بتحتاج تنسيق مسبق مع فريق المبيعات بتاعك بخصوص المواعيد والكميات.</li>
        </ul>
        <h2>المنتجات الطازة</h2>
        <p>عشان الخضار والفاكهة منتجات سريعة التلف، بنحاول نقلل الوقت بين التجهيز والتوصيل قد ما نقدر. لو في تأخير متوقع هنبلغك عن طريق واتساب أو الإيميل.</p>
        <h2>حالة الطلب</h2>
        <p>تقدر تتابع حالة طلبك من صفحة «سجل الطلبات» في حسابك: قيد المراجعة → مؤكد → قيد التجهيز → خارج للتوصيل → تم التسليم.</p>
      </PolicyPage>
    );
  }

  return (
    <PolicyPage locale={locale} titleEn="Delivery Policy" titleAr="سياسة التوصيل">
      <p>Qutoof delivers fresh vegetables and fruit across all seven emirates: Dubai, Abu Dhabi, Sharjah, Ajman, Umm Al Quwain, Ras Al Khaimah, and Fujairah.</p>
      <h2>Delivery fees</h2>
      <p>Delivery fees vary by area and are shown clearly at checkout before you confirm your order — no hidden charges.</p>
      <h2>Delivery windows</h2>
      <ul>
        <li>Retail orders are typically delivered same-day or next-day, depending on your area and order time.</li>
        <li>Wholesale orders are coordinated directly with your assigned sales rep for timing and quantities.</li>
      </ul>
      <h2>Freshness first</h2>
      <p>Because vegetables and fruit are perishable, we keep the time between preparation and delivery as short as possible. If a delay is expected, we’ll let you know via WhatsApp or email.</p>
      <h2>Order status</h2>
      <p>Track your order from “Order history” in your account: Pending Review → Confirmed → Preparing → Out for Delivery → Delivered.</p>
    </PolicyPage>
  );
}
