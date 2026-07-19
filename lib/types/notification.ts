export interface AppNotification {
  id: string;
  recipientUserId: string;
  title: string;
  body: string;
  /** Locale-agnostic path (e.g. "/dashboard/orders/order-123") — prefix with the current locale when linking. */
  link: string | null;
  isRead: boolean;
  createdAt: string;
}
