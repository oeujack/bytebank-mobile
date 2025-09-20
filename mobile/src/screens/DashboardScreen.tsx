// src/screens/DashboardScreen.tsx

import React from "react";
import { StyleSheet, Dimensions, ScrollView } from "react-native";
import { VStack, HStack, Text, Heading, Box } from "@gluestack-ui/themed";

// NOVO: Importa o PieChart da nova biblioteca
import { PieChart, BarChart } from "react-native-chart-kit";
import {
  expensesByCategory,
  recentTransactions,
} from "@assets/mock/dashboarMock";
import { HomeHeader } from "@components/HomeHeader";

// Paleta de cores para o nosso gráfico
const COLORS = [
  "#FF6347",
  "#FFA500",
  "#FFD700",
  "#00FFFF",
  "#000080",
  "#800080",
];

const BARCOLOR = ["#2563EB"];

type DashboardScreenProps = {};

const DashboardScreen: React.FC<DashboardScreenProps> = () => {
  const chartKitData = expensesByCategory.map((item, index) => ({
    name: item.x,
    amount: item.y,
    color: COLORS[index % COLORS.length],
    legendFontColor: "#7F7F7F",
    legendFontSize: 15,
  }));

  const chartConfig = {
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2,
    fontFamily: "Roboto",
    propsForLabels: {
      fontFamily: "Roboto",
    },
  };

  const barChartConfig = {
    // 1. Removemos o gradiente definindo a mesma cor para o início e o fim
    backgroundGradientFrom: "#3D3D45",
    backgroundGradientTo: "#2e2e30ff",

    decimalPlaces: 0, // Removemos os decimais para valores de transação

    color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`, // Seu blue500
    labelColor: (opacity = 1) => `rgba(220, 220, 220, ${opacity})`,

    style: {
      borderRadius: 16,
    },

    propsForBackgroundLines: {
      stroke: "transparent",
    },

    fontFamily: "Roboto",
    propsForLabels: {
      fontFamily: "Roboto",
    },
    colors:`#2563EB`,
  };

  const barChartData = {
    ...recentTransactions, // Copia os labels e data do mock
    datasets: recentTransactions.datasets.map(dataset => ({
      ...dataset,
      // Aqui está a mágica: adicionamos um array de cores
      colors: dataset.data.map(() => (opacity = 1) => '#2563EB')
    }))
  };

  return (
    <ScrollView>
      <VStack flex={1}>
        <HomeHeader />

        <VStack flex={1} p="$2">
          {/* Seção de Saldos - Estilo do projeto anterior */}
          <VStack
            bg="$gray700"
            borderBottomWidth={1}
            borderBottomColor="$gray600"
          >
            <HStack justifyContent="space-between" alignItems="center" mb="$3">
              <Text color="$gray100" fontSize="$lg" fontWeight="$semibold">
                Despesas Frequentes
              </Text>
            </HStack>

            <PieChart
              data={chartKitData}
              width={Dimensions.get("window").width - 32}
              height={190}
              chartConfig={chartConfig}
              accessor={"amount"}
              backgroundColor={"transparent"}
              paddingLeft={"0"}
              absolute
            />
          </VStack>
        </VStack>

        <VStack flex={1} p="$2">
          {/* Seção de Saldos - Estilo do projeto anterior */}
          <VStack
            bg="$gray700"
            borderBottomWidth={1}
            borderBottomColor="$gray600"
          >
            <HStack justifyContent="space-between" alignItems="center" mb="$3">
              <Text color="$gray100" fontSize="$lg" fontWeight="$semibold">
                Últimas Transações
              </Text>
            </HStack>

            <BarChart
              data={barChartData}
              width={Dimensions.get("window").width - 18}
              height={260}
              yAxisLabel="R$"
              chartConfig={barChartConfig}
              verticalLabelRotation={30}
              flatColor={true}
              yAxisSuffix={""}
              withInnerLines={false}
              withCustomBarColorFromData={true} 
              style={{
                marginVertical: 8,
                borderRadius: 10,
              }}
            />
          </VStack>
        </VStack>
      </VStack>
    </ScrollView>
  );
};

export default DashboardScreen;
