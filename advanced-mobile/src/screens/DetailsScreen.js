import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
// Importamos ícones do pacote padrão do Expo
import { Ionicons } from '@expo/vector-icons'; 

export default function DetailsScreen({ route, navigation }) {
  // AQUI ESTÁ A MÁGICA: Recebendo o "bilhetinho" da tela anterior
  const { obra } = route.params; 

  return (
    <SafeAreaView style={styles.container}>
      
      {/* Cabeçalho Personalizado */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#003366" />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>{obra.titulo}</Text>
          <Text style={styles.subtitle}>{obra.endereco}</Text>
        </View>
      </View>

      {/* Grid de Ações (Os Botões Grandes da Juliana) */}
      <View style={styles.actionsContainer}>
        
        {/* Botão VISTORIA */}
        <TouchableOpacity 
          style={styles.bigButton} 
          onPress={() => Alert.alert("Em breve", "Aqui abrirá a câmera!")}
        >
          <View style={[styles.iconCircle, { backgroundColor: '#e3f2fd' }]}>
            <Ionicons name="camera" size={32} color="#1565c0" />
          </View>
          <Text style={styles.buttonText}>Nova Vistoria</Text>
        </TouchableOpacity>

        {/* Botão FINANCEIRO */}
        <TouchableOpacity 
          style={styles.bigButton}
          onPress={() => Alert.alert("Em breve", "Aqui abrirá o extrato!")}
        >
          <View style={[styles.iconCircle, { backgroundColor: '#e8f5e9' }]}>
            <Ionicons name="cash" size={32} color="#2e7d32" />
          </View>
          <Text style={styles.buttonText}>Financeiro</Text>
        </TouchableOpacity>

      </View>

      {/* Área de Resumo (Placeholder) */}
      <View style={styles.summaryContainer}>
        <Text style={styles.sectionTitle}>Resumo Recente</Text>
        <Text style={styles.emptyText}>Nenhuma atividade recente.</Text>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    paddingTop: 40, // Espaço da status bar
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003366',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  actionsContainer: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-between',
  },
  bigButton: {
    width: '48%', // Quase metade da tela
    height: 120,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    // Sombra
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  summaryContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  emptyText: {
    color: '#999',
    fontStyle: 'italic',
  },
});