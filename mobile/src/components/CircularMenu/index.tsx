import { TouchableOpacity } from "react-native";
import { VStack, HStack, Text, Box } from "@gluestack-ui/themed";

interface CircularMenuProps {
  onTransactionsPress: () => void;
  onDashboardPress: () => void;
}

export function CircularMenu({
  onTransactionsPress,
  onDashboardPress,
}: CircularMenuProps) {
  return (
    <VStack alignItems="center" mt="$6" mb="$6">
      <Text color="$gray200" fontSize="$md" mb="$4" textAlign="center">
        Acesso Rápido
      </Text>

      <HStack space="xl" justifyContent="center">
        {/* Botão Transações */}
        <TouchableOpacity onPress={onTransactionsPress}>
          <VStack alignItems="center" space="sm">
            <Box
              width="$16"
              height="$16"
              bg="$green500"
              borderRadius="$full"
              justifyContent="center"
              alignItems="center"
              shadowColor="$black"
              shadowOffset={{ width: 0, height: 2 }}
              shadowOpacity={0.25}
              shadowRadius={3.84}
              elevation={5}
            >
              {/* Ícone de lista simples usando Text */}
              <VStack space="xs" alignItems="center">
                <Box width="$4" height="$1" bg="$white" borderRadius="$sm" />
                <Box width="$4" height="$1" bg="$white" borderRadius="$sm" />
                <Box width="$4" height="$1" bg="$white" borderRadius="$sm" />
              </VStack>
            </Box>
            <Text color="$gray200" fontSize="$xs" textAlign="center">
              Transações
            </Text>
          </VStack>
        </TouchableOpacity>

        {/* Botão Relatórios (placeholder para futuras funcionalidades) */}
        <TouchableOpacity onPress={onDashboardPress}>
          <VStack alignItems="center" space="sm">
            <Box
              width="$16"
              height="$16"
              bg="$green500"
              borderRadius="$full"
              justifyContent="center"
              alignItems="center"
              shadowColor="$black"
              shadowOffset={{ width: 0, height: 2 }}
              shadowOpacity={0.25}
              shadowRadius={3.84}
              elevation={5}
            >
              {/* Ícone de gráfico simples usando Text */}
              <HStack space="xs" alignItems="flex-end" height="$6">
                <Box width="$1.5" height="$4" bg="$white" borderRadius="$sm" />
                <Box width="$1.5" height="$6" bg="$yellow600" borderRadius="$sm" />
                <Box width="$1.5" height="$8" bg="$red500" borderRadius="$sm" />
              </HStack>
            </Box>
            <Text color="$gray200" fontSize="$xs" textAlign="center">
              Relatórios
            </Text>
          </VStack>
        </TouchableOpacity>

        {/* Botão Configurações (placeholder) */}
        <TouchableOpacity disabled>
          <VStack alignItems="center" space="sm">
            <Box
              width="$16"
              height="$16"
              bg="$gray500"
              borderRadius="$full"
              justifyContent="center"
              alignItems="center"
              opacity={0.5}
            >
              {/* Ícone de engrenagem simples */}
              <Box
                width="$4"
                height="$4"
                borderWidth={2}
                borderColor="$white"
                borderRadius="$md"
                position="relative"
              >
                <Box
                  width="$1"
                  height="$1"
                  bg="$white"
                  position="absolute"
                  top="$1.5"
                  left="$1.5"
                  borderRadius="$full"
                />
              </Box>
            </Box>
            <Text color="$gray400" fontSize="$xs" textAlign="center">
              Configurações
            </Text>
          </VStack>
        </TouchableOpacity>
      </HStack>
    </VStack>
  );
}
