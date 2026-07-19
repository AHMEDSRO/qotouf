import { notifyUsers, staffRecipientIds } from './store';

export type NotificationEvent =
  | { type: 'order_created'; orderId: string; orderNumber: string; customerId: string; salesRepId?: string | null }
  | { type: 'order_status_changed'; orderId: string; orderNumber: string; status: string }
  | { type: 'low_stock'; productId: string; productName: string; quantityInStock: number };

/**
 * Clean integration point for order notifications. Fans out to the in-dashboard
 * notification bell (Supabase Realtime); a WhatsApp Business API / email channel
 * can be added here later without touching any call site.
 */
export interface Notifier {
  notify(event: NotificationEvent): Promise<void>;
}

export const supabaseNotifier: Notifier = {
  async notify(event) {
    // eslint-disable-next-line no-console
    console.log(`[notify] ${event.type}`, event);

    if (event.type === 'order_created') {
      const recipients = await staffRecipientIds(['super_admin', 'admin']);
      if (event.salesRepId) recipients.push(event.salesRepId);
      await notifyUsers(
        recipients,
        'New order',
        `Order ${event.orderNumber} was just placed.`,
        `/dashboard/orders/${event.orderId}`
      );
    } else if (event.type === 'low_stock') {
      const recipients = await staffRecipientIds(['super_admin', 'admin', 'warehouse']);
      await notifyUsers(
        recipients,
        'Low stock',
        `${event.productName} is down to ${event.quantityInStock} units.`,
        `/dashboard/inventory`
      );
    }
  },
};

export const notifier: Notifier = supabaseNotifier;
