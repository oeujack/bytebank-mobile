import React from "react";
import { TouchableOpacity, Platform } from "react-native";
import {
  VStack,
  HStack,
  Text,
  Heading,
  Box,
  Icon,
  Image,
  Badge,
  BadgeText,
} from "@gluestack-ui/themed";

import { Pencil, Trash2 } from "lucide-react-native";

interface TransactionItemProps {
  item: any;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const TransactionItem = React.memo(({ item, onEdit, onDelete }: TransactionItemProps) => {
  function formatCurrency(value: number) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("pt-BR");
  }

  return (
    <Box bg="$gray600" p="$4" borderRadius="$lg" mb="$3">
      <HStack justifyContent="space-between" alignItems="flex-start" mb="$2">
        <VStack flex={1} mr="$2">
          <HStack alignItems="center" space="sm" mb="$1">
            <Badge
              size="sm"
              variant="solid"
              bg={
                item.account_type === "conta-corrente" ? "$gray100" : "$gray100"
              }
            >
              <BadgeText fontSize="$xs">
                {item.account_type === "conta-corrente"
                  ? "Conta-Corrente"
                  : "Poupança"}
              </BadgeText>
            </Badge>
            <Badge
              size="sm"
              variant="outline"
              borderColor={
                item.transaction_type === "deposito"
                  ? "$green500"
                  : "$orange500"
              }
            >
              <BadgeText
                fontSize="$xs"
                color={
                  item.transaction_type === "deposito"
                    ? "$green500"
                    : "$orange500"
                }
              >
                {item.transaction_type === "deposito"
                  ? "Depósito"
                  : "Transferência"}
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

          <Text color="$gray100" fontSize="$xs">
            {formatDate(item.transaction_date || item.created_at || "")}
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

          <VStack space="xs" zIndex={999}>
            {Platform.OS === 'web' ? (
              <>
                <div 
                  style={{ 
                    padding: 8, 
                    backgroundColor: '#6b7280', 
                    borderRadius: 6, 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 4
                  }}
                  onClick={() => {
                    onEdit(item.id!);
                  }}
                >
                  <Icon as={Pencil} size="sm" color="$gray200" />
                </div>

                <div 
                  style={{ 
                    padding: 8, 
                    backgroundColor: '#ef4444', 
                    borderRadius: 6, 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onClick={() => {
                    onDelete(item.id!);
                  }}
                >
                  <Icon as={Trash2} size="sm" color="$white" />
                </div>
              </>
            ) : (
              <>
                <TouchableOpacity
                  onPress={() => {
                    onEdit(item.id!);
                  }}
                  style={{
                    padding: 8,
                    backgroundColor: '#6b7280',
                    borderRadius: 6,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 4
                  }}
                >
                  <Icon as={Pencil} size="sm" color="$gray200" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    onDelete(item.id!);
                  }}
                  style={{
                    padding: 8,
                    backgroundColor: '#ef4444',
                    borderRadius: 6,
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Icon as={Trash2} size="sm" color="$white" />
                </TouchableOpacity>
              </>
            )}
          </VStack>
        </HStack>
      </HStack>
    </Box>
  );
});

export default TransactionItem;
