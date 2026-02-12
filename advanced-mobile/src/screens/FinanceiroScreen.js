import React, { useMemo } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TransactionItem from '../components/TransactionItem';

// MOCK: Dados falsos para simular o banco de dados
const DADOS_FINANCEIROS = [
  { id: '1', description: 'Entrada Cliente (1ª Parc)', value: 15000.00, type: 'income', date: '10/01', category: 'Pagamento' },
  { id: '2', description: 'Compra de Cimento', value: 450.50, type: 'expense', date: '12/01', category: 'Material' },
  { id: '3', description: 'Diária Pedreiro', value: 200.00, type: 'expense', date: '12/01', category: 'Mão de Obra' },
  { id: '4', description: 'Tintas Coral', value: 890.00, type: 'expense', date: '15/01', category: 'Material' },
  { id: '5', description: 'Aditivo Cliente (Extra)', value: 2000.00, type: 'income', date: '18/01', category: 'Pagamento' },
];

export default function FinanceiroScreen({ navigation }) {

  // Lógica de Cálculo (Senior Tip: useMemo evita recalcular toda hora se os dados não mudarem)
  const { totalIncome, totalExpense, balance } = useMemo(() => {
    let income = 0;
    let expense = 0;

    DADOS_FINANCEIROS.forEach(item => {
      if (item.type === 'income') income += item.value;
      else expense += item.value;
    });

    return {
      totalIncome: income,
      totalExpense: expense,
      balance: income - expense
    };
  }, []); // Array vazio = calcula só quando a tela abre

  return (
    <SafeAreaView style={styles.container}>
      
      {/* 1. Cabeçalho (O Placar) */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Extrato Financeiro</Text>
          <View style={{ width: 24 }} /> 
        </View>

        <Text style={styles.balanceLabel}>Saldo da Obra</Text>
        <Text style={styles.balanceValue}>R$ {balance.toFixed(2).replace('.', ',')}</Text>

        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <View style={[styles.dot, { backgroundColor: '#4caf50' }]} />
            <Text style={styles.summaryLabel}>Receitas</Text>
            <Text style={styles.summaryValue}>+ {totalIncome.toFixed(2).replace('.', ',')}</Text>
          </View>
          <View style={styles.summaryItem}>
            <View style={[styles.dot, { backgroundColor: '#ef5350' }]} />
            <Text style={styles.summaryLabel}>Despesas</Text>
            <Text style={styles.summaryValue}>- {totalExpense.toFixed(2).replace('.', ',')}</Text>
          </View>
        </View>
      </View>

      {/* 2. Lista de Movimentações */}
      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>Últimos Lançamentos</Text>
        
        <FlatList
          data={DADOS_FINANCEIROS}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TransactionItem 
              description={item.description}
              value={item.value}
              type={item.type}
              date={item.date}
              category={item.category}
            />
          )}
          contentContainerStyle={{ paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* 3. Botão de Adicionar (FAB) */}
      <TouchableOpacity style={styles.fab}>
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#003366', // Fundo azul escuro no topo
  },
  header: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 30,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  balanceValue: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  summaryRow: {
    flexDirection: 'row',
    marginTop: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 15,
  },
  summaryItem: {
    flex: 1,
  },
  summaryLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  summaryValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  listContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    paddingBottom: 0,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    marginLeft: 10,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ef6c00', // Laranja para contraste com o Azul
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
});