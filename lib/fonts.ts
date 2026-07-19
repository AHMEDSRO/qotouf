import { Anton, Inter, Cairo, IBM_Plex_Mono } from 'next/font/google';

/**
 * Type system for قطوف:
 * - Anton: stamped/stencil-adjacent poster weight for EN headlines (crate-label energy).
 * - Cairo: carries both Arabic headline (Black/ExtraBold) and Arabic body — Arabic has far
 *   fewer strong display faces, so one family across weights is the idiomatic choice.
 * - Inter: EN body copy.
 * - IBM Plex Mono: prices/weights/origin codes — reads like a market scale readout.
 */
export const fontDisplay = Anton({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
  display: 'swap',
});

export const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const fontArabic = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '600', '700', '900'],
  variable: '--font-arabic',
  display: 'swap',
});

export const fontMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
});
