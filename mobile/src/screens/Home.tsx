import { useState } from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  VStack,
  HStack,
  Text,
  Heading,
  FlatList,
  Box,
  Icon,
  Image,
  Badge,
  BadgeText,
  Fab,
  FabIcon,
  AddIcon,
} from '@gluestack-ui/themed';
import { HomeHeader } from '@components/HomeHeader';
import { Loading } from '@components/Loading';
import { Button } from '@components/Button';
import { TransactionDTO } from '@dtos/TransactionDTO';
import { useTransactions } from '@hooks/useTransactions';
import { AppError } from '@utils/AppError';
import { Pencil, Trash2, Eye, EyeOff } from 'lucide-react-native';

export function Home() {
  const navigation = useNavigation();
  const { transactions, balances, isLoading, deleteTransaction } = useTransactions();
  const [showBalances, setShowBalances] = useState(false);

  function handleAddTransaction() {
    navigation.navigate('addEditTransaction');
  }

  function handleEditTransaction(transactionId: number) {
    navigation.navigate('addEditTransaction', { transactionId });
  }

  async function handleDeleteTransaction(transactionId: number) {
    Alert.alert(
      'Excluir Transação',
      'Tem certeza que deseja excluir esta transação?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTransaction(transactionId);
              Alert.alert('Sucesso', 'Transação excluída com sucesso');
            } catch (error) {
              const isAppError = error instanceof AppError;
              const title = isAppError ? error.message : 'Erro ao excluir transação';
              Alert.alert('Erro', title);
            }
          },
        },
      ]
    );
  }

  function formatCurrency(value: number) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('pt-BR');
  }

  function renderTransactionItem({ item }: { item: TransactionDTO }) {
    return (
      <Box
        bg="$gray600"
        p="$4"
        borderRadius="$lg"
        mb="$3"
      >
        <HStack justifyContent="space-between" alignItems="flex-start" mb="$2">
          <VStack flex={1} mr="$2">
            <HStack alignItems="center" space="$2" mb="$1">
              <Badge
                size="sm"
                variant="solid"
                bg={item.account_type === 'conta-corrente' ? '$blue500' : '$green500'}
              >
                <BadgeText fontSize="$xs">
                  {item.account_type === 'conta-corrente' ? 'Conta-Corrente' : 'Poupança'}
                </BadgeText>
              </Badge>
              <Badge
                size="sm"
                variant="outline"
                borderColor={item.transaction_type === 'deposito' ? '$green500' : '$orange500'}
              >
                <BadgeText 
                  fontSize="$xs"
                  color={item.transaction_type === 'deposito' ? '$green500' : '$orange500'}
                >
                  {item.transaction_type === 'deposito' ? 'Depósito' : 'Transferência'}
                </BadgeText>
              </Badge>
            </HStack>
            
            <Heading size="lg" color="$gray100" mb="$1">
              {formatCurrency(item.amount)}
            </Heading>
            
            {item.description && (
              <Text color="$gray300" fontSize="$sm" mb="$1">
                {item.description}
              </Text>
            )}
            
            <Text color="$gray400" fontSize="$xs">
              {formatDate(item.transaction_date || item.created_at || '')}
            </Text>
          </VStack>

          <HStack space="$2" alignItems="center">
            {item.attachment_url && (
              <Image
                source={{ uri: item.attachment_url }}
                alt="Anexo"
                width="$12"
                height="$12"
                borderRadius="$md"
              />
            )}
            
            <VStack space="$1">
              <TouchableOpacity onPress={() => handleEditTransaction(item.id!)}>
                <Box p="$2" bg="$gray500" borderRadius="$md">
                  <Icon as={Pencil} size="sm" color="$gray200" />
                </Box>
              </TouchableOpacity>
              
              <TouchableOpacity onPress={() => handleDeleteTransaction(item.id!)}>
                <Box p="$2" bg="$red500" borderRadius="$md">
                  <Icon as={Trash2} size="sm" color="$white" />
                </Box>
              </TouchableOpacity>
            </VStack>
          </HStack>
        </HStack>
      </Box>
    );
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <VStack flex={1}>
      <HomeHeader />
      
      <VStack flex={1} p="$6">
        {/* Seção de Saldos */}
        <VStack mb="$6">
          <HStack justifyContent="space-between" alignItems="center" mb="$3">
            <Heading size="lg" color="$gray100">
              Saldos
            </Heading>
            <Button
              title={showBalances ? 'Esconder' : 'Ver'}
              variant="outline"
              size="sm"
              onPress={() => setShowBalances(!showBalances)}
            />
          </HStack>

          {showBalances && (
            <HStack space="$3">
              <Box flex={1} bg="$blue500" p="$4" borderRadius="$lg">
                <Text color="$white" fontSize="$sm" mb="$1">
                  Conta-Corrente
                </Text>
                <Heading size="md" color="$white">
                  {formatCurrency(balances['conta-corrente'])}
                </Heading>
              </Box>
              
              <Box flex={1} bg="$green500" p="$4" borderRadius="$lg">
                <Text color="$white" fontSize="$sm" mb="$1">
                  Poupança
                </Text>
                <Heading size="md" color="$white">
                  {formatCurrency(balances['poupanca'])}
                </Heading>
              </Box>
            </HStack>
          )}
        </VStack>

        {/* Lista de Transações */}
        <VStack flex={1}>
          <Heading size="lg" color="$gray100" mb="$4">
            Transações
          </Heading>

          {transactions.length === 0 ? (
            <Box flex={1} justifyContent="center" alignItems="center">
              <Text color="$gray400" textAlign="center">
                Nenhuma transação encontrada.{'\n'}
                Toque no botão + para adicionar uma nova transação.
              </Text>
            </Box>
          ) : (
            <FlatList
              data={transactions}
              keyExtractor={(item) => String(item.id)}
              renderItem={renderTransactionItem}
              showsVerticalScrollIndicator={false}
              flex={1}
            />
          )}
        </VStack>
      </VStack>

      {/* FAB para adicionar transação */}
      <Fab
        size="lg"
        placement="bottom right"
        bg="$green500"
        onPress={handleAddTransaction}
      >
        <FabIcon as={AddIcon} />
      </Fab>
    </VStack>
  );
}
