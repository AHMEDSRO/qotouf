export type Role =
  | 'super_admin'
  | 'admin'
  | 'accountant'
  | 'sales_rep'
  | 'warehouse'
  | 'retail_customer'
  | 'wholesale_customer';

export const STAFF_ROLES: Role[] = ['super_admin', 'admin', 'accountant', 'sales_rep', 'warehouse'];

export const ROLE_LABELS: Record<Role, { en: string; ar: string }> = {
  super_admin: { en: 'Super Admin', ar: 'المدير العام' },
  admin: { en: 'Admin', ar: 'أدمن' },
  accountant: { en: 'Accountant', ar: 'محاسب' },
  sales_rep: { en: 'Sales Rep', ar: 'موظف مبيعات' },
  warehouse: { en: 'Warehouse', ar: 'موظف مخزون' },
  retail_customer: { en: 'Retail Customer', ar: 'عميل قطاعي' },
  wholesale_customer: { en: 'Wholesale Customer', ar: 'عميل جملة' },
};

export function isStaffRole(role: Role): boolean {
  return STAFF_ROLES.includes(role);
}
