import React, { useState, useCallback, useMemo } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import TransactionItem from '../components/TransactionItem';
import { supabase } from '../services/supabase'; // Conexão

export default function FinanceiroScreen({ route, navigation }) {
  // 1. Recebendo o bilhetinho (a obra)
  const { obra } = route.params; 

  const [transacoes, setTransacoes] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. Buscar no Banco de Dados
  const fetchTransacoes = async () => {
    try {
      setLoading(true);
      // SELECT * FROM financeiro WHERE obra_id = ID_DA_OBRA ORDER BY data_lancamento DESC
      const { data, error } = await supabase
        .from('financeiro')
        .select('*')
        .eq('obra_id', obra.id) // O filtro mágico!
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTransacoes(data ||[]);
    } catch (error) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Recarrega sempre que entrar na tela
  useFocusEffect(
    useCallback(() => {
      fetchTransacoes();
    },[])
  );

  // 3. A Matemática (Calcula tudo automaticamente)
  const { totalIncome, totalExpense, balance } = useMemo(() => {
    let income = 0;
    let expense = 0;

    transacoes.forEach(item => {
      if (item.tipo === 'income') income += item.valor;
      else expense += item.valor;
    });

    return { totalIncome: income, totalExpense: expense, balance: income - expense };
  }, [transacoes]); // Refaz a conta se as transações mudarem

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          {/* Mostramos o nome da obra no cabeçalho */}
          <Text style={styles.headerTitle}>{obra.titulo}</Text>
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

      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>Lançamentos</Text>
        
        {loading ? (
          <ActivityIndicator size="large" color="#003366" style={{ marginTop: 20 }}/>
        ) : (
          <FlatList
            data={transacoes}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#999', marginTop: 20 }}>Nenhum gasto registrado ainda.</Text>}
            renderItem={({ item }) => (
              <TransactionItem 
                description={item.descricao}
                value={item.valor}
                type={item.tipo}
                date={item.data_lancamento || 'Hoje'} // fallback temporário
                category={item.categoria}
              />
            )}
            contentContainerStyle={{ paddingBottom: 80 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* 4. Botão flutuante enviando o ID da obra para a tela de nova transação */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('NovaTransacao', { obra_id: obra.id })}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>

    </SafeAreaView>
  );
}

// OS ESTILOS SÃO EXATAMENTE OS MESMOS DE ANTES
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#003366' },
  header: { padding: 20, paddingTop: 10, paddingBottom: 30 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  balanceLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 14 },
  balanceValue: { color: '#fff', fontSize: 36, fontWeight: 'bold', marginVertical: 5 },
  summaryRow: { flexDirection: 'row', marginTop: 20, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 15 },
  summaryItem: { flex: 1 },
  summaryLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 12 },
  summaryValue: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginTop: 2 },
  dot: { width: 8, height: 8, borderRadius: 4, marginBottom: 4 },
  listContainer: { flex: 1, backgroundColor: '#f5f5f5', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 20, paddingBottom: 0 },
  listTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15, marginLeft: 10 },
  fab: { position: 'absolute', bottom: 24, right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: '#ef6c00', justifyContent: 'center', alignItems: 'center', elevation: 6 },
});