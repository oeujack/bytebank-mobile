import { useState, useCallback } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  VStack,
  HStack,
  Text,
  Heading,
  Box,
} from '@gluestack-ui/themed';
import { HomeHeader } from '@components/HomeHeader';
import { Loading } from '@components/Loading';
import { Button } from '@components/Button';
import { CircularMenu } from '@components/CircularMenu';
import { TransactionList } from '@components/TransactionList';
import { useTransactions } from '@hooks/useTransactions';
import { Eye, EyeOff } from 'lucide-react-native';

export function Home() {
  const { balances, transactions, isLoading, fetchTransactions, fetchBalances } = useTransactions();
  const [showBalances, setShowBalances] = useState(true);
  const [showTransactionList, setShowTransactionList] = useState(false);

  const blurStyle = StyleSheet.create({
    blurred: {
      fontSize: 20,
      color: '#7C7C8A',
      letterSpacing: 2,
    },
    normal: {},
  });

  function formatCurrency(value: number) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }

  function handleShowTransactions() {
    setShowTransactionList(true);
  }

  function handleCloseTransactions() {
    setShowTransactionList(false);
  }

  function handleTransactionDeleted() {
    // Forçar atualização dos dados após exclusão
    fetchTransactions();
    fetchBalances();
  }

  // Atualizar dados quando a tela ganhar foco (ex: ao voltar da edição)
  useFocusEffect(
    useCallback(() => {
      fetchTransactions();
      fetchBalances();
    }, [])
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <VStack flex={1}>
      <HomeHeader />
      
      <VStack flex={1} p="$6">
        {/* Seção de Saldos - Estilo do projeto anterior */}
        <VStack 
          bg="$gray700" 
          borderBottomWidth={1} 
          borderBottomColor="$gray600"
          p="$4"
          mb="$6"
        >
          {/* Header do Saldo */}
          <HStack justifyContent="space-between" alignItems="center" mb="$3">
            <Text color="$gray100" fontSize="$lg" fontWeight="$semibold">
              Saldo
            </Text>
            <TouchableOpacity onPress={() => setShowBalances(!showBalances)}>
              <Box p="$1">
                {showBalances ? (
                  <EyeOff size={20} color="#9CA3AF" />
                ) : (
                  <Eye size={20} color="#9CA3AF" />
                )}
              </Box>
            </TouchableOpacity>
          </HStack>

          {/* Conta Corrente */}
          <HStack justifyContent="flex-start" alignItems="center" mb="$4">
            <Heading 
              size="xl" 
              color="$gray100"
              style={!showBalances ? blurStyle.blurred : blurStyle.normal}
            >
              {!showBalances ? '● ● ● ● ● ●' : formatCurrency(balances['conta-corrente'])}
            </Heading>
          </HStack>

          {/* Poupança */}
          <VStack>
            <Text color="$gray300" fontSize="$md" fontWeight="$medium" mb="$1">
              Poupança
            </Text>
            <Text 
              color="$gray100" 
              fontSize="$xl"
              fontWeight="$semibold"
              style={!showBalances ? blurStyle.blurred : blurStyle.normal}
            >
              {!showBalances ? '● ● ● ● ● ●' : formatCurrency(balances['poupanca'])}
            </Text>
          </VStack>
        </VStack>

        {/* Menu Circular */}
        <CircularMenu onTransactionsPress={handleShowTransactions} />

        {/* Área de boas-vindas */}
        <VStack flex={1} justifyContent="center" alignItems="center" px="$4">
          <Text color="$gray300" fontSize="$lg" textAlign="center" mb="$2">
            Bem-vindo ao ByteBank
          </Text>
          <Text color="$gray400" fontSize="$sm" textAlign="center" lineHeight="$sm">
            Gerencie suas transações bancárias de forma simples e segura.{'\n'}
            Use o menu acima para acessar suas funcionalidades.
          </Text>
        </VStack>
      </VStack>

      {/* Modal de Lista de Transações */}
      {showTransactionList && (
        <TransactionList 
          onClose={handleCloseTransactions} 
          onTransactionDeleted={handleTransactionDeleted}
        />
      )}
    </VStack>
  );
}
