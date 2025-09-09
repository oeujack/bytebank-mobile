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
import { TransactionDTO } from '@dtos/TransactionDTO';
import { useTransactions } from '@hooks/useTransactions';
import { AppError } from '@utils/AppError';
import { Pencil, Trash2 } from 'lucide-react-native';
import { StackNavigatorRouterProps } from '@routes/stack.routes';

interface TransactionListProps {
  onClose: () => void;
}

export function TransactionList({ onClose }: TransactionListProps) {
  const navigation = useNavigation<StackNavigatorRouterProps>();
  const { transactions, isLoading, deleteTransaction } = useTransactions();

  function handleAddTransaction() {
    navigation.navigate('addEditTransaction', {});
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
            <HStack alignItems="center" space="sm" mb="$1">
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

          <HStack space="sm" alignItems="center">
            {item.attachment_url && (
              <Image
                source={{ uri: item.attachment_url }}
                alt="Anexo"
                width={48}
                height={48}
                borderRadius={8}
              />
            )}
            
            <VStack space="xs">
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

  return (
    <VStack flex={1} bg="$gray700" position="absolute" top={0} left={0} right={0} bottom={0} zIndex={1000}>
      {/* Header */}
      <HStack p="$6" justifyContent="space-between" alignItems="center" bg="$gray600">
        <Heading size="lg" color="$gray100">
          Transações
        </Heading>
        <TouchableOpacity onPress={onClose}>
          <Box p="$2" bg="$gray500" borderRadius="$md">
            <Text color="$gray100" fontSize="$lg" fontWeight="bold">×</Text>
          </Box>
        </TouchableOpacity>
      </HStack>

      {/* Lista de Transações */}
      <VStack flex={1} p="$6">
        {transactions.length === 0 ? (
          <Box flex={1} justifyContent="center" alignItems="center">
            <Text color="$gray400" textAlign="center">
              Nenhuma transação encontrada.{'\n'}
              Toque no botão + para adicionar uma nova transação.
            </Text>
          </Box>
        ) : (
          <FlatList
            data={transactions as any[]}
            keyExtractor={(item: any) => String(item.id)}
            renderItem={({ item }: any) => renderTransactionItem({ item })}
            showsVerticalScrollIndicator={false}
            flex={1}
          />
        )}
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