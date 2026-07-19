import type { Role } from '../rbac/roles';
import type { Emirate, Locale } from './common';
import type { CreditLimit } from './receivable';

export interface Address {
  id: string;
  label: string;
  emirate: Emirate;
  area: string;
  street: string;
  buildingInfo?: string;
}

interface BaseProfile {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: Role;
  locale: Locale;
  createdAt: string;
}

export interface RetailProfile extends BaseProfile {
  role: 'retail_customer';
  addresses: Address[];
}

export interface WholesaleProfile extends BaseProfile {
  role: 'wholesale_customer';
  businessName: string;
  tradeLicenseNumber?: string;
  tradeLicenseFileUrl?: string;
  creditLimit: CreditLimit;
  assignedSalesRepId?: string | null;
  /** Wholesale registration is instant/self-serve — always true, no approval step. */
  approvedForWholesalePricing: true;
}

export interface StaffProfile extends BaseProfile {
  role: 'super_admin' | 'admin' | 'accountant' | 'sales_rep' | 'warehouse';
}

export type UserProfile = RetailProfile | WholesaleProfile | StaffProfile;

/** Omit that distributes over a union instead of collapsing it to shared keys. */
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

export type NewUserProfile = DistributiveOmit<UserProfile, 'id' | 'createdAt'>;
