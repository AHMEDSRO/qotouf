import type { Role } from './roles';

export type Action =
  | 'view_cost_price'
  | 'edit_products'
  | 'bulk_import_products'
  | 'adjust_inventory'
  | 'create_wholesale_order'
  | 'assign_sales_rep'
  | 'view_all_orders'
  | 'view_own_orders'
  | 'update_order_status'
  | 'view_reports'
  | 'manage_payment_settings'
  | 'manage_users'
  | 'edit_role_permissions'
  | 'view_wholesale_pricing'
  | 'confirm_payments';

export const ROLE_PERMISSIONS: Record<Role, Action[]> = {
  super_admin: [
    'view_cost_price',
    'edit_products',
    'bulk_import_products',
    'adjust_inventory',
    'create_wholesale_order',
    'assign_sales_rep',
    'view_all_orders',
    'update_order_status',
    'view_reports',
    'manage_payment_settings',
    'manage_users',
    'edit_role_permissions',
    'view_wholesale_pricing',
    'confirm_payments',
  ],
  admin: [
    'edit_products',
    'bulk_import_products',
    'adjust_inventory',
    'create_wholesale_order',
    'assign_sales_rep',
    'view_all_orders',
    'update_order_status',
    'view_reports',
    'manage_payment_settings',
    'view_wholesale_pricing',
    'confirm_payments',
  ],
  accountant: ['view_cost_price', 'view_all_orders', 'view_reports', 'view_wholesale_pricing', 'confirm_payments'],
  sales_rep: ['create_wholesale_order', 'view_all_orders', 'view_wholesale_pricing'],
  warehouse: ['adjust_inventory', 'view_all_orders', 'update_order_status'],
  retail_customer: ['view_own_orders'],
  wholesale_customer: ['view_own_orders', 'view_wholesale_pricing'],
};

export function can(role: Role, action: Action): boolean {
  return ROLE_PERMISSIONS[role]?.includes(action) ?? false;
}

export class ForbiddenError extends Error {
  constructor(action: Action) {
    super(`Role lacks permission: ${action}`);
    this.name = 'ForbiddenError';
  }
}

export function assertCan(role: Role, action: Action): void {
  if (!can(role, action)) throw new ForbiddenError(action);
}
