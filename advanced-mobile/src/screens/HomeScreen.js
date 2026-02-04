import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
// FIX 1: Importando SafeAreaView da biblioteca correta para sumir o aviso amarelo
import { SafeAreaView } from 'react-native-safe-area-context'; 
import ObraCard from '../components/ObraCard';

// Dados falsos (Mock) para testar o layout
const DADOS_FAKE = [
  { id: '1', titulo: 'Reforma Apto 302', endereco: 'Rua das Flores, 120', status: 'Em Andamento' },
  { id: '2', titulo: 'Construção Casa Silva', endereco: 'Cond. Jardins, Lote 4', status: 'Atrasado' },
  { id: '3', titulo: 'Pintura Fachada', endereco: 'Av. Paulista, 1000', status: 'Vistoria' },
];

export default function HomeScreen({ navigation }) {
  
  // FIX 2: O parâmetro agora se chama 'itemObra' para combinar com o uso dentro da função
  const handlePressObra = (itemObra) => {
    // Agora 'itemObra' existe e é o objeto completo da obra
    navigation.navigate('Detalhes', { obra: itemObra });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Minhas Obras</Text>
      </View>

      <FlatList
        // FIX 3: Adicionando de volta a fonte de dados (sem isso a lista não aparece)
        data={DADOS_FAKE}
        // FIX 4: Adicionando a chave única para performance (boa prática)
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent} // Um espaçamento extra
        renderItem={({ item }) => (
            <ObraCard 
             titulo={item.titulo}
             endereco={item.endereco}
             status={item.status}
             onPress={() => handlePressObra(item)} 
            />
        )}
      />

      {/* Botão Flutuante (FAB) */}
      <TouchableOpacity style={styles.fab}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5', 
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    // O padding top é gerenciado automaticamente pelo SafeAreaView agora
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003366',
  },
  listContent: {
    padding: 16,
    paddingBottom: 100, // Espaço extra no final para o botão não cobrir o último item
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#003366', 
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fabText: {
    color: '#fff',
    fontSize: 32,
    marginTop: -4, 
  },
});