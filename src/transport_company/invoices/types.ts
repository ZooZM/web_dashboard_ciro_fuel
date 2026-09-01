export interface Invoice {
  _id: string;
  orderId: string;
  amount: number;
  method: 'DIRECT' | 'DEFERRED' | 'CREDIT';
  state: 'ISSUED' | 'SETTLED' | 'VOID';
  createdAt: string;
  settledAt: string | null;
}
