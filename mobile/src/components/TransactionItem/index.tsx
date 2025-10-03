import React from "react";
import { TouchableOpacity } from "react-native";
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

const TransactionItem = React.memo(({ item, onEdit, onDelete }: any) => {
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

          <VStack space="xs">
            <TouchableOpacity onPress={() => onEdit(item.id!)}>
              <Box p="$2" bg="$gray500" borderRadius="$md">
                <Icon as={Pencil} size="sm" color="$gray200" />
              </Box>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => onDelete(item.id!)}>
              <Box p="$2" bg="$red500" borderRadius="$md">
                <Icon as={Trash2} size="sm" color="$white" />
              </Box>
            </TouchableOpacity>
          </VStack>
        </HStack>
      </HStack>
    </Box>
  );
});

export default TransactionItem;
