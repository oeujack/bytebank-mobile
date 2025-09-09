export interface TransactionDTO {
  id?: number;
  user_id?: number;
  account_type: 'conta-corrente' | 'poupanca';
  transaction_type: 'transferencia' | 'deposito';
  amount: number;
  description?: string;
  attachment_url?: string;
  transaction_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface BalanceDTO {
  'conta-corrente': number;
  'poupanca': number;
}
