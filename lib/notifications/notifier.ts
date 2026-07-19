export type NotificationEvent =
  | { type: 'order_created'; orderId: string; orderNumber: string; customerId: string }
  | { type: 'order_status_changed'; orderId: string; orderNumber: string; status: string };

/**
 * Clean integration point for order notifications. Phase 1 only logs to the
 * console; Phase 2 swaps this for a WhatsApp Business API + email implementation
 * without touching any call site (orderRepository.create/updateStatus).
 */
export interface Notifier {
  notify(event: NotificationEvent): Promise<void>;
}

export const consoleNotifier: Notifier = {
  async notify(event) {
    // eslint-disable-next-line no-console
    console.log(`[notify] ${event.type}`, event);
  },
};

export const notifier: Notifier = consoleNotifier;
