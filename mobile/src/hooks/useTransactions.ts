import { useState, useEffect } from 'react';
import { api } from '@services/api';
import { TransactionDTO, BalanceDTO } from '@dtos/TransactionDTO';
import { AppError } from '@utils/AppError';

export function useTransactions() {
  const [transactions, setTransactions] = useState<TransactionDTO[]>([]);
  const [balances, setBalances] = useState<BalanceDTO>({
    'conta-corrente': 0,
    'poupanca': 0
  });
  const [isLoading, setIsLoading] = useState(false);

  async function fetchTransactions() {
    try {
      setIsLoading(true);
      const response = await api.get('/transactions');
      setTransactions(response.data);
    } catch (error) {
      throw new AppError('Erro ao buscar transações');
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchBalances() {
    try {
      const response = await api.get('/transactions/balances');
      setBalances(response.data);
    } catch (error) {
      throw new AppError('Erro ao buscar saldos');
    }
  }

  async function createTransaction(transaction: Omit<TransactionDTO, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
    try {
      setIsLoading(true);
      const response = await api.post('/transactions', transaction);
      await fetchTransactions();
      await fetchBalances();
      return response.data;
    } catch (error) {
      throw new AppError('Erro ao criar transação');
    } finally {
      setIsLoading(false);
    }
  }

  async function updateTransaction(id: number, transaction: Partial<TransactionDTO>) {
    try {
      setIsLoading(true);
      const response = await api.put(`/transactions/${id}`, transaction);
      await fetchTransactions();
      await fetchBalances();
      return response.data;
    } catch (error) {
      throw new AppError('Erro ao atualizar transação');
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteTransaction(id: number) {
    try {
      setIsLoading(true);
      await api.delete(`/transactions/${id}`);
      await fetchTransactions();
      await fetchBalances();
    } catch (error) {
      throw new AppError('Erro ao deletar transação');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchTransactions();
    fetchBalances();
  }, []);

  return {
    transactions,
    balances,
    isLoading,
    fetchTransactions,
    fetchBalances,
    createTransaction,
    updateTransaction,
    deleteTransaction
  };
}
