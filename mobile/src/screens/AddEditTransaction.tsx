// Importa o React e os tipos necessários
import { VStack } from '@gluestack-ui/themed';
import React from 'react';
// Importa Text e StyleSheet do react-native
import { Text, StyleSheet } from 'react-native';

type DashboardScreenProps = {};

const DashboardScreen: React.FC<DashboardScreenProps> = () => {

  return (
    <VStack
      style={{
        flex: 1, // Para ocupar a tela toda
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Text style={styles.title}>Meu Dashboard</Text>
    </VStack>
  );
};

// Como o VStack cuida do layout, nosso StyleSheet fica mais simples
const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default DashboardScreen;