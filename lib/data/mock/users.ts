import type { UserProfile } from '@/lib/types/user';

const now = new Date().toISOString();

export function seedUsers(): UserProfile[] {
  return [
    {
      id: 'user-super-admin',
      email: 'ahmed@qtouf.ae',
      fullName: 'Ahmed (Super Admin)',
      role: 'super_admin',
      locale: 'ar',
      createdAt: now,
    },
    {
      id: 'user-admin',
      email: 'admin@qtouf.ae',
      fullName: 'Admin User',
      role: 'admin',
      locale: 'ar',
      createdAt: now,
    },
    {
      id: 'user-accountant',
      email: 'accounts@qtouf.ae',
      fullName: 'Accountant User',
      role: 'accountant',
      locale: 'ar',
      createdAt: now,
    },
    {
      id: 'user-sales-rep',
      email: 'sales@qtouf.ae',
      fullName: 'Sales Rep User',
      role: 'sales_rep',
      locale: 'ar',
      createdAt: now,
    },
    {
      id: 'user-warehouse',
      email: 'warehouse@qtouf.ae',
      fullName: 'Warehouse User',
      role: 'warehouse',
      locale: 'ar',
      createdAt: now,
    },
    {
      id: 'user-retail',
      email: 'retail@example.com',
      fullName: 'Retail Customer',
      role: 'retail_customer',
      locale: 'en',
      createdAt: now,
      addresses: [
        {
          id: 'addr-1',
          label: 'Home',
          emirate: 'dubai',
          area: 'Dubai Marina',
          street: 'Marina Walk 12',
        },
      ],
    },
    {
      id: 'user-wholesale',
      email: 'wholesale@example.com',
      fullName: 'Wholesale Customer',
      role: 'wholesale_customer',
      locale: 'en',
      createdAt: now,
      businessName: 'Gulf Fresh Trading LLC',
      tradeLicenseNumber: undefined,
      creditLimit: { limit: 50000, currentBalance: 12500, availableCredit: 37500 },
      assignedSalesRepId: 'user-sales-rep',
      approvedForWholesalePricing: true,
    },
  ];
}
