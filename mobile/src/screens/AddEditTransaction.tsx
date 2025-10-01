import { useState, useEffect } from "react";
import { Alert, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  VStack,
  Text,
  Heading,
  ScrollView,
  Image,
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicatorWrapper,
  SelectDragIndicator,
  SelectItem,
  HStack,
  Box,
  ChevronDownIcon,
  Icon,
} from "@gluestack-ui/themed";
import { ScreenHeader } from "@components/ScreenHeader";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { Loading } from "@components/Loading";
import { TransactionDTO } from "@dtos/TransactionDTO";
import { useTransactions } from "@hooks/useTransactions";
import { useImageUpload } from "@hooks/useImageUpload";
import { AppError } from "@utils/AppError";

type RouteParamsProps = {
  transactionId?: number;
};

export function AddEditTransaction() {
  const navigation = useNavigation();
  const route = useRoute();
  const { transactionId } = route.params as RouteParamsProps;

  const { createTransaction, updateTransaction, transactions } =
    useTransactions();
  const { selectImage, uploadImage, isUploading } = useImageUpload();

  const [accountType, setAccountType] = useState<"conta-corrente" | "poupanca">(
    "conta-corrente"
  );
  const [transactionType, setTransactionType] = useState<
    "transferencia" | "deposito"
  >("deposito");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [attachmentUrl, setAttachmentUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isEditing = !!transactionId;

  useEffect(() => {
    if (isEditing) {
      const transaction = transactions.find((t) => t.id === transactionId);
      if (transaction) {
        setAccountType(transaction.account_type);
        setTransactionType(transaction.transaction_type);
        setAmount(transaction.amount.toString());
        setDescription(transaction.description || "");
        setAttachmentUrl(transaction.attachment_url || null);
      }
    }
  }, [isEditing, transactionId, transactions]);

  async function handleImageSelect() {
    try {
      const image = await selectImage();
      if (image) {
        setImageUri(image.uri);
      }
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : "Erro ao selecionar imagem";
      Alert.alert("Erro", title);
    }
  }

  function handleAccountTypeChange(value: string) {
    setAccountType(value as "conta-corrente" | "poupanca");
  }

  function handleTransactionTypeChange(value: string) {
    setTransactionType(value as "transferencia" | "deposito");
  }

  async function handleSubmit() {
    console.log("handleSubmit")
    try {
      if (!amount || parseFloat(amount) <= 0) {
        return Alert.alert("Erro", "Valor deve ser maior que zero");
      }

      if (!imageUri && !attachmentUrl) {
        return Alert.alert("Erro", "É obrigatório anexar uma foto");
      }

      setIsLoading(true);

      let finalAttachmentUrl = attachmentUrl;

      // Se há uma nova imagem selecionada, fazer upload
      if (imageUri) {
        finalAttachmentUrl = await uploadImage(imageUri);
      }

      const transactionData = {
        account_type: accountType,
        transaction_type: transactionType,
        amount: parseFloat(amount),
        description: description.trim() || undefined,
        attachment_url: finalAttachmentUrl || undefined,
        transaction_date: new Date().toISOString(),
      };

      if (isEditing) {
        await updateTransaction(transactionId, transactionData);
        Alert.alert("Sucesso", "Transação atualizada com sucesso");
      } else {
        await createTransaction(transactionData);
        Alert.alert("Sucesso", "Transação criada com sucesso");
      }

      navigation.goBack();
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : "Erro ao salvar transação";
      Alert.alert("Erro", title);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading || isUploading) {
    return <Loading />;
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title={isEditing ? "Editar Transação" : "Nova Transação"} />

      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        <VStack p="$6" space="lg">
          {/* Tipo de Conta */}
          <VStack space="sm">
            <Text color="$gray200" fontSize="$sm">
              Tipo de Conta
            </Text>
            <Select
              selectedValue={accountType}
              onValueChange={handleAccountTypeChange}
            >
              <SelectTrigger variant="outline" size="lg">
                <SelectInput
                  placeholder="Selecione o tipo de conta"
                  style={{ color: "white" }}
                />
                <SelectIcon mr="$3" as={ChevronDownIcon} />
              </SelectTrigger>
              <SelectPortal>
                <SelectBackdrop />
                <SelectContent>
                  <SelectDragIndicatorWrapper>
                    <SelectDragIndicator />
                  </SelectDragIndicatorWrapper>
                  <SelectItem label="Conta-Corrente" value="conta-corrente" />
                  <SelectItem label="Poupança" value="poupanca" />
                </SelectContent>
              </SelectPortal>
            </Select>
          </VStack>

          {/* Tipo de Transação */}
          <VStack space="sm">
            <Text color="$gray200" fontSize="$sm">
              Tipo de Transação
            </Text>
            <Select
              selectedValue={transactionType}
              onValueChange={handleTransactionTypeChange}
            >
              <SelectTrigger variant="outline" size="lg">
                <SelectInput
                  placeholder="Selecione o tipo de transação"
                  style={{ color: "white" }}
                />
                <SelectIcon mr="$3" as={ChevronDownIcon} />
              </SelectTrigger>
              <SelectPortal>
                <SelectBackdrop />
                <SelectContent>
                  <SelectDragIndicatorWrapper>
                    <SelectDragIndicator />
                  </SelectDragIndicatorWrapper>
                  <SelectItem label="Transferência" value="transferencia" />
                  <SelectItem label="Depósito" value="deposito" />
                </SelectContent>
              </SelectPortal>
            </Select>
          </VStack>

          {/* Valor */}
          <Input
            placeholder="Valor"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />

          {/* Descrição */}
          <Input
            placeholder="Descrição (opcional)"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
          />

          {/* Upload de Anexo */}
          <VStack space="sm">
            <Text color="$gray200" fontSize="$sm">
              Anexo (obrigatório)
            </Text>

            <TouchableOpacity onPress={handleImageSelect}>
              <Box
                borderWidth={1}
                borderColor="$gray400"
                borderRadius="$lg"
                p="$4"
                alignItems="center"
                justifyContent="center"
                h="$32"
                borderStyle="dashed"
              >
                {imageUri || attachmentUrl ? (
                  <Image
                    source={{ uri: imageUri || attachmentUrl || undefined }}
                    alt="Anexo"
                    style={{ width: "100%", height: "100%", borderRadius: 8 }}
                  />
                ) : (
                  <VStack alignItems="center" space="sm">
                    {/* Ícone de câmera simples usando componentes básicos */}
                    <Box
                      width="$12"
                      height="$8"
                      bg="$gray400"
                      borderRadius="$md"
                      justifyContent="center"
                      alignItems="center"
                      position="relative"
                    >
                      <Box
                        width="$6"
                        height="$6"
                        borderWidth={2}
                        borderColor="$white"
                        borderRadius="$full"
                      />
                      <Box
                        width="$2"
                        height="$1"
                        bg="$gray400"
                        position="absolute"
                        top={-2}
                        borderRadius="$sm"
                      />
                    </Box>
                    <Text color="$gray400" textAlign="center">
                      Toque para adicionar uma foto
                    </Text>
                  </VStack>
                )}
              </Box>
            </TouchableOpacity>
          </VStack>

          <Button
            title={isEditing ? "Salvar Alterações" : "Criar Transação"}
            onPress={handleSubmit}
            isLoading={isLoading}
            mt="$4"
          />
        </VStack>
      </ScrollView>
    </VStack>
  );
}
