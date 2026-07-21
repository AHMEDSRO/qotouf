/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
  experimental: {
    // Next.js can't trace the dynamically-built fs paths used by @react-pdf/renderer
    // (Font.register/Image with process.cwd()-joined paths) — without this, the
    // invoice route works in dev but 500s on Vercel because the font/logo never
    // ship with the serverless function bundle. Belongs under `experimental` on
    // Next 14 (promoted to top-level only in Next 15) — it still worked at the top
    // level too, just with a config-validation warning on every dev/build.
    outputFileTracingIncludes: {
      '/api/orders/[id]/invoice': ['./public/fonts/**', './public/logo.jpg'],
    },
    // Server Actions default to a 1MB request body — too small for a real product
    // photo upload (product-actions.ts createProductAction/updateProductAction).
    // Matches the 5MB limit set on the "product-images" Supabase Storage bucket.
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
};

export default nextConfig;
