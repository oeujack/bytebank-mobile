import { useState, useEffect } from 'react';
import { api } from '@services/api';
import { TransactionDTO, BalanceDTO } from '@dtos/TransactionDTO';
import { useImageUpload } from './useImageUpload';
import { AppError } from '@utils/AppError';
import { storageAuthTokenGet } from '@storage/storageAuthToken';

export function useTransactions() {
  const [transactions, setTransactions] = useState<TransactionDTO[]>([]);
  const [balances, setBalances] = useState<BalanceDTO>({
    'conta-corrente': 0,
    'poupanca': 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const { deleteImage } = useImageUpload();

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
      
      // Buscar a transação para obter a URL da imagem antes de deletar
      const transaction = transactions.find(t => t.id === id);
      
      // Deletar a transação da API
      await api.delete(`/transactions/${id}`);
      
      // Se a transação tem uma imagem, deletar do Firebase (sem aguardar)
      if (transaction?.attachment_url) {
        deleteImage(transaction.attachment_url).catch(console.error);
      }
      
      // Atualizar local state primeiro para feedback imediato
      setTransactions(prevTransactions => prevTransactions.filter(t => t.id !== id));
      
      // Depois atualizar dados do servidor
      await Promise.all([
        fetchTransactions(),
        fetchBalances()
      ]);
      
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Erro ao deletar transação';
      throw new AppError(errorMessage);
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
