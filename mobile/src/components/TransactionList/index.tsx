import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  VStack,
  HStack,
  Text,
  Heading,
  FlatList,
  Box,
  Fab,
  FabIcon,
  AddIcon,
  Select,
  SelectTrigger,
  SelectInput,
  SelectContent,
  SelectItem,
  SelectPortal,
  SelectBackdrop,
  SelectIcon,
  ChevronDownIcon,
  Button,
  ButtonText,
  Input,
  InputField,
} from "@gluestack-ui/themed";
import { TransactionDTO } from "@dtos/TransactionDTO";
import { useTransactions } from "@hooks/useTransactions";
import { AppError } from "@utils/AppError";
import { StackNavigatorRouterProps } from "@routes/stack.routes";
import TransactionItem from "@components/TransactionItem";

interface TransactionListProps {
  onClose: () => void;
  onTransactionDeleted?: () => void;
}

export function TransactionList({
  onClose,
  onTransactionDeleted,
}: TransactionListProps) {
  const navigation = useNavigation<StackNavigatorRouterProps>();
  const { transactions, isLoading, deleteTransaction } = useTransactions();

  const [filterType, setFilterType] = useState<string>("todos");
  const [filterPeriod, setFilterPeriod] = useState<string>("todos");
  const [search, setSearch] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(10);
  const [loadingMore, setLoadingMore] = useState(false);

  function handleAddTransaction() {
    navigation.navigate("addEditTransaction", {});
  }

  const handleEditTransaction = useCallback((transactionId: number) => {
    navigation.navigate("addEditTransaction", { transactionId });
  }, [navigation]);

  const handleDeleteTransaction = useCallback(async (transactionId: number) => {
    const isConfirmed = window.confirm("Tem certeza que deseja excluir esta transação?");
    
    if (isConfirmed) {
      try {
        await deleteTransaction(transactionId);
        window.alert("Transação excluída com sucesso");
        
        if (onTransactionDeleted) {
          onTransactionDeleted();
        }
      } catch (error) {
        const isAppError = error instanceof AppError;
        const title = isAppError
          ? error.message
          : "Não foi possível excluir a transação. Tente novamente.";
          
        window.alert("Erro: " + title);
      }
    }
  }, [deleteTransaction, onTransactionDeleted]);

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    return transactions.filter((t: TransactionDTO) => {
      // Filtra por tipo
      if (filterType !== "todos" && t.transaction_type !== filterType) {
        return false;
      }

      // Filtro por busca
      if (search.trim() !== "") {
        const searchNormalized = search.trim().toLowerCase();

        // Normaliza o valor do amount
        const amountStr = Math.abs(t.amount)
          .toFixed(2) 
          .replace(".", ","); 

        const descriptionStr = (t.description || "").toLowerCase();

        // Verifica se a busca é número
        if (!isNaN(Number(searchNormalized))) {
          // se for número, compara exato
          if (amountStr !== searchNormalized && amountStr !== `${searchNormalized},00`) {
            return false;
          }
        } else {
          // se for texto, usa includes
          if (!descriptionStr.includes(searchNormalized)) {
            return false;
          }
        }
      }

      // Filtra por período

      // Normaliza a data da transação
      if (!t.transaction_date) return false;
      const transactionDate = new Date(t.transaction_date);

      if (filterPeriod === "hoje") {
        const isToday = transactionDate.toDateString() === now.toDateString();
        if (!isToday) return false;
      }

      if (filterPeriod === "ultimos7") {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 7);
        if (transactionDate < sevenDaysAgo) return false;
      }

      if (filterPeriod === "ultimos30") {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(now.getDate() - 30);
        if (transactionDate < thirtyDaysAgo) return false;
      }

      return true;
    });
  }, [transactions, filterType, filterPeriod, search]);

  const displayedTransactions = useMemo(() => {
    return filteredTransactions.slice(0, itemsToShow);
  }, [filteredTransactions, itemsToShow]);

  /* Função para scroll infinito */
  function loadMoreTransactions() {
    if (loadingMore) return; // trava múltiplas chamadas
    if (itemsToShow >= filteredTransactions.length) return; // nada mais a carregar

    setLoadingMore(true);
    setItemsToShow((prev) => Math.min(prev + 10, filteredTransactions.length));

    setTimeout(() => setLoadingMore(false), 1000); // libera depois de um tempo
  }

  useEffect(() => {
    setItemsToShow(10);
  }, [filterType]);

  const renderTransactionItem = useCallback(
    ({ item }: { item: TransactionDTO }) => {
      return (
        <TransactionItem
          item={item}
          onEdit={handleEditTransaction}
          onDelete={handleDeleteTransaction}
        />
      );
    },
    [handleEditTransaction, handleDeleteTransaction]
  );

  return (
    <VStack
      flex={1}
      bg="$gray700"
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      zIndex={1000}
    >
      {/* Header */}
      <HStack
        p="$6"
        justifyContent="space-between"
        alignItems="center"
        bg="$gray600"
      >
        <Heading size="lg" color="$gray100">
          Transações
        </Heading>
        <div onClick={onClose} style={{ cursor: 'pointer' }}>
          <Box p="$2" bg="$gray500" borderRadius="$md">
            <Text color="$gray100" fontSize="$lg" fontWeight="bold">
              ×
            </Text>
          </Box>
        </div>
      </HStack>
      <Box>
        {/* Botão para abrir/fechar filtros */}
        <Box px="$6" mt="$4">
          <Button bg="$green500" onPress={() => setShowFilters(!showFilters)}>
            <ButtonText>
              {showFilters ? "Ocultar Filtros" : "Mostrar Filtros"}
            </ButtonText>
          </Button>
        </Box>

        {showFilters && (
          <>
            {/* Busca */}
            <Box px="$6" mt="$4">
              <Input $focus-borderColor="$green500">
                <InputField
                  color="$white"
                  placeholder="Buscar"
                  value={search}
                  onChangeText={setSearch}
                />
              </Input>
            </Box>
            {/* Filtro de Tipo de Transação */}
            <Box px="$6" mt="$4">
              <Text color="$white" mb="$2">
                Tipo de Transação
              </Text>
              <Select selectedValue={filterType} onValueChange={setFilterType}>
                <SelectTrigger variant="outline" size="md">
                  <SelectInput placeholder="Filtrar por tipo" color="$white" />
                  <SelectIcon as={ChevronDownIcon} />
                </SelectTrigger>
                <SelectPortal>
                  <SelectBackdrop />
                  <SelectContent>
                    <SelectItem label="Todos" value="todos" />
                    <SelectItem label="Depósito" value="deposito" />
                    <SelectItem label="Transferência" value="transferencia" />
                  </SelectContent>
                </SelectPortal>
              </Select>
            </Box>
            {/*Filtro de data*/}
            <Box px="$6" mt="$4">
              <Text color="$white" mb="$2">
                Período
              </Text>
              <Select
                selectedValue={filterPeriod}
                onValueChange={setFilterPeriod}
              >
                <SelectTrigger variant="outline" size="md">
                  <SelectInput
                    placeholder="Filtrar por período"
                    color="$white"
                  />
                  <SelectIcon as={ChevronDownIcon} />
                </SelectTrigger>
                <SelectPortal>
                  <SelectBackdrop />
                  <SelectContent>
                    <SelectItem label="Todos" value="todos" />
                    <SelectItem label="Hoje" value="hoje" />
                    <SelectItem label="Últimos 7 dias" value="ultimos7" />
                    <SelectItem label="Últimos 30 dias" value="ultimos30" />
                  </SelectContent>
                </SelectPortal>
              </Select>
            </Box>
          </>
        )}
      </Box>
      {/* Lista de Transações */}
      <VStack flex={1} p="$6">
        {displayedTransactions.length === 0 ? (
          <Box flex={1} justifyContent="center" alignItems="center">
            <Text color="$white" textAlign="center">
              Nenhuma transação encontrada.{"\n"}
              Verifique o filtro e tente novamente ou
              Toque no botão + para adicionar uma nova transação.
            </Text>
          </Box>
        ) : (
          <FlatList
            data={displayedTransactions as any[]}
            keyExtractor={(item: any) => String(item.id)}
            renderItem={({ item }: any) => renderTransactionItem({ item })}
            onEndReached={loadMoreTransactions}
            onEndReachedThreshold={0.1}
            showsVerticalScrollIndicator={false}
            flex={1}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={5}
            ListFooterComponent={
              loadingMore ? (
                <Box py="$4" justifyContent="center" alignItems="center">
                  <Text color="$white">Carregando mais...</Text>
                </Box>
              ) : null
            }
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
