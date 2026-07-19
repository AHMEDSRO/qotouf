import { MessageCircle } from 'lucide-react';
import type { Locale } from '@/lib/i18n/config';

const DEFAULT_NUMBER = '971500000000';

export function WhatsAppButton({ locale }: { locale: Locale }) {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || DEFAULT_NUMBER;
  const message = encodeURIComponent(locale === 'en' ? 'Hi Qutoof, I have a question about an order.' : 'أهلاً قطوف، عندي سؤال عن أوردر.');

  return (
    <a
      href={`https://wa.me/${number}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={locale === 'en' ? 'Chat on WhatsApp' : 'تواصل عبر واتساب'}
      className="fixed bottom-4 start-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}
