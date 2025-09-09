import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
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
  const { balances, isLoading } = useTransactions();
  const [showBalances, setShowBalances] = useState(false);
  const [showTransactionList, setShowTransactionList] = useState(false);

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
            <Text color="$gray100" fontSize="$xs">
              ByteBank
            </Text>
          </HStack>

          {/* Conta Corrente */}
          <HStack justifyContent="space-between" alignItems="center" mb="$4">
            <HStack alignItems="center" space="md">
              <Heading 
                size="xl" 
                color="$gray100"
                style={{
                  filter: showBalances ? 'none' : 'blur(6px)',
                }}
              >
                {formatCurrency(balances['conta-corrente'])}
              </Heading>
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
            <TouchableOpacity>
              <Text color="$gray300" fontSize="$sm" textDecorationLine="underline">
                Ver extrato
              </Text>
            </TouchableOpacity>
          </HStack>

          {/* Poupança */}
          <VStack>
            <HStack justifyContent="space-between" alignItems="center">
              <Text color="$gray300" fontSize="$md" fontWeight="$medium">
                Poupança
              </Text>
              <TouchableOpacity>
                <Text color="$blue400" fontSize="$sm" fontWeight="$medium">
                  Depositar
                </Text>
              </TouchableOpacity>
            </HStack>
            <HStack alignItems="center" space="md" mt="$1">
              <Text 
                color="$gray100" 
                fontSize="$xl"
                fontWeight="$semibold"
                style={{
                  filter: showBalances ? 'none' : 'blur(6px)',
                }}
              >
                {formatCurrency(balances['poupanca'])}
              </Text>
              <TouchableOpacity onPress={() => setShowBalances(!showBalances)}>
                <Box p="$1">
                  {showBalances ? (
                    <EyeOff size={16} color="#9CA3AF" />
                  ) : (
                    <Eye size={16} color="#9CA3AF" />
                  )}
                </Box>
              </TouchableOpacity>
            </HStack>
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
        <TransactionList onClose={handleCloseTransactions} />
      )}
    </VStack>
  );
}
