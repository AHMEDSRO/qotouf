import { isLocale, type Locale } from '@/lib/i18n/config';
import { notFound } from 'next/navigation';
import { categoryRepository } from '@/lib/data';
import { getRequestContext } from '@/lib/auth/session';
import { requirePermission } from '@/lib/rbac/guard';
import { createProductAction } from '@/lib/dashboard/product-actions';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default async function NewProductPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const ctx = await getRequestContext();
  requirePermission(ctx, 'edit_products', `/${locale}/dashboard`);

  const categories = await categoryRepository.list(ctx);
  const action = createProductAction.bind(null, locale);

  return (
    <div className="max-w-xl space-y-6">
      <h2 className="font-display text-xl tracking-wide text-ink">{locale === 'en' ? 'New product' : 'منتج جديد'}</h2>

      <form action={action} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label={locale === 'en' ? 'Name (English)' : 'الاسم (إنجليزي)'}>
            <Input name="nameEn" required />
          </Field>
          <Field label={locale === 'en' ? 'Name (Arabic)' : 'الاسم (عربي)'}>
            <Input name="nameAr" required dir="rtl" />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label={locale === 'en' ? 'Description (English)' : 'الوصف (إنجليزي)'}>
            <Input name="descriptionEn" />
          </Field>
          <Field label={locale === 'en' ? 'Description (Arabic)' : 'الوصف (عربي)'}>
            <Input name="descriptionAr" dir="rtl" />
          </Field>
        </div>

        <Field label={locale === 'en' ? 'Category' : 'التصنيف'}>
          <select name="categoryId" required className="h-10 w-full rounded-card border border-border bg-surface px-3 text-sm text-ink">
            {categories
              .filter((c) => c.parentId !== null)
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name[locale]}
                </option>
              ))}
          </select>
        </Field>

        <div className="grid grid-cols-3 gap-4">
          <Field label={locale === 'en' ? 'Country of origin' : 'بلد المنشأ'}>
            <Input name="countryOfOrigin" placeholder="EG" required />
          </Field>
          <Field label={locale === 'en' ? 'Size / weight' : 'الحجم / الوزن'}>
            <Input name="sizeWeight" placeholder="1kg" required />
          </Field>
          <Field label={locale === 'en' ? 'Unit' : 'الوحدة'}>
            <select name="unit" required className="h-10 w-full rounded-card border border-border bg-surface px-3 text-sm text-ink">
              <option value="kg">kg</option>
              <option value="g">g</option>
              <option value="piece">piece</option>
              <option value="box">box</option>
              <option value="bunch">bunch</option>
            </select>
          </Field>
        </div>

        <Field label={locale === 'en' ? 'Image URL' : 'رابط الصورة'}>
          <Input name="imageUrl" type="url" required placeholder="https://placehold.co/600x400.png" />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label={locale === 'en' ? 'Cost price (AED)' : 'سعر التكلفة'}>
            <Input name="costPrice" type="number" step="0.01" min={0} required />
          </Field>
          <Field label={locale === 'en' ? 'Retail price (AED)' : 'سعر القطاعي'}>
            <Input name="retailPrice" type="number" step="0.01" min={0} required />
          </Field>
        </div>

        <Field label={locale === 'en' ? 'Wholesale price (AED, optional)' : 'سعر الجملة (اختياري)'}>
          <Input name="wholesalePrice" type="number" step="0.01" min={0} />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label={locale === 'en' ? 'Quantity in stock' : 'الكمية المتاحة'}>
            <Input name="quantityInStock" type="number" min={0} required />
          </Field>
          <Field label={locale === 'en' ? 'Low stock threshold' : 'حد التنبيه'}>
            <Input name="lowStockThreshold" type="number" min={0} defaultValue={20} required />
          </Field>
        </div>

        <Button type="submit" variant="accent">
          {locale === 'en' ? 'Create product' : 'إنشاء المنتج'}
        </Button>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-ink">{label}</span>
      {children}
    </label>
  );
}
