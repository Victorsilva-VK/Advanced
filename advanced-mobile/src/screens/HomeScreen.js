import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native'; // Importante para recarregar ao voltar
import ObraCard from '../components/ObraCard';
import { supabase } from '../services/supabase'; // Importando nossa conexão nova

export default function HomeScreen({ navigation }) {
  const [obras, setObras] = useState([]); // Agora começa vazio
  const [loading, setLoading] = useState(true);

  // Função que vai no Supabase buscar os dados
  const fetchObras = async () => {
    try {
      setLoading(true);
      // SELECT * FROM OBRAS ORDER BY CREATED_AT DESC
      const { data, error } = await supabase
        .from('obras')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setObras(data || []);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao buscar obras: ' + error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // useFocusEffect garante que a lista atualize sempre que você voltar para essa tela
  useFocusEffect(
    useCallback(() => {
      fetchObras();
    }, [])
  );

  const handlePressObra = (itemObra) => {
    navigation.navigate('Detalhes', { obra: itemObra });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Minhas Obras</Text>
      </View>

      {loading ? (
        <View style={styles.centerLoading}>
          <ActivityIndicator size="large" color="#003366" />
          <Text style={{ marginTop: 10 }}>Carregando obras...</Text>
        </View>
      ) : (
        <FlatList
          data={obras}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          // Se a lista estiver vazia, mostramos um aviso
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhuma obra cadastrada ainda.</Text>
          }
          renderItem={({ item }) => (
            <ObraCard 
             titulo={item.titulo}
             endereco={item.endereco}
             status={item.status}
             onPress={() => handlePressObra(item)} 
            />
          )}
        />
      )}

      {/* Botão Flutuante (FAB) */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => navigation.navigate('NovaObra')}
      >
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
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003366',
  },
  listContent: {
    padding: 16,
    paddingBottom: 100, 
  },
  centerLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#999',
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