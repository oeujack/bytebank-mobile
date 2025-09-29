// src/screens/DashboardScreen.tsx

import React from "react";
import { StyleSheet, Dimensions, ScrollView } from "react-native";
import { VStack, HStack, Text, Heading, Box } from "@gluestack-ui/themed";
import { TransactionDTO } from '@dtos/TransactionDTO';
import { useTransactions } from '@hooks/useTransactions';

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
  const { balances, transactions, isLoading, fetchTransactions, fetchBalances } = useTransactions();

  const pieDataFromTransactions = Object.values(
  transactions.reduce((acc, t, idx) => {
    const key = t.description ?? `Transação ${idx + 1}`;
    if (!acc[key]) {
      acc[key] = {
        name: key,
        amount: 0,
        color: COLORS[idx % COLORS.length],
        legendFontColor: "#fff",
        legendFontSize: 15,
      };
    }
    acc[key].amount += t.amount;
    return acc;
  }, {} as Record<string, any>)
);

  const chartConfig = {
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2,
    fontFamily: "Roboto",
    propsForLabels: {
      fontFamily: "Roboto",
    },
  };

  const barChartConfig = {
    backgroundGradientFrom: "#3D3D45",
    backgroundGradientTo: "#3D3D45",

    decimalPlaces: 0,

    color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`, 
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,

    style: {
      borderRadius: 16,
    },

    propsForBackgroundLines: {
      stroke: "transparent",
    },

    fontFamily: "Roboto",
    propsForLabels: {
      fontFamily: "Roboto",
      fill: '#fff',
      color: '#fff'
    },
    colors:'#2563EB',
  };

  const barChartData = {
  labels: transactions.map(t => t.transaction_type ?? "").filter(label => typeof label === "string"), // Ensure only strings
  datasets: [
    {
      data: transactions.map(t => t.amount),
      colors: transactions.map(() => (opacity = 1) => '#2563EB'),
    }
  ]
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
                Últimas Transações Feitas
              </Text>
            </HStack>

            <PieChart
              data={pieDataFromTransactions}
              width={Dimensions.get("window").width - 29}
              height={200}
              chartConfig={chartConfig}
              accessor={"amount"}
              backgroundColor={"transparent"}
              paddingLeft={"0"}
              absolute
              hasLegend={true}
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
                Controle de transações
              </Text>
            </HStack>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <BarChart
              data={barChartData}
              width={600}
              height={340}
              yAxisLabel="R$"
              chartConfig={barChartConfig}
              verticalLabelRotation={24}
              flatColor={true}
              yAxisSuffix={""}
              withInnerLines={false}
              withCustomBarColorFromData={true} 
              style={{
                marginVertical: 8,
                borderRadius: 10,
              }}
              fromZero={true}
            />
          </ScrollView>
          </VStack>
        </VStack>
      </VStack>
    </ScrollView>
  );
};

export default DashboardScreen;
