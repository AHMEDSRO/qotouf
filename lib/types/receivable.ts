export interface CreditLimit {
  limit: number;
  currentBalance: number;
  availableCredit: number;
}

export interface Receivable {
  id: string;
  wholesaleCustomerId: string;
  orderId: string;
  amountDue: number;
  dueDate: string;
  status: 'open' | 'paid' | 'overdue';
  createdAt: string;
}
