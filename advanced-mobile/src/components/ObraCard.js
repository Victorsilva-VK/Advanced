import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

// Este componente recebe dados (props) para ser dinâmico
export default function ObraCard({ titulo, endereco, status, onPress }) {
  
  // Funçãozinha para escolher a cor do status
  const getStatusColor = (status) => {
    switch(status) {
      case 'Em Andamento': return '#e8f5e9'; // Fundo Verde claro
      case 'Atrasado': return '#ffebee'; // Fundo Vermelho claro
      case 'Vistoria': return '#fff3e0'; // Fundo Laranja claro
      default: return '#f5f5f5';
    }
  };

  const getStatusTextColor = (status) => {
    switch(status) {
      case 'Em Andamento': return '#2e7d32'; // Texto Verde
      case 'Atrasado': return '#c62828'; // Texto Vermelho
      case 'Vistoria': return '#ef6c00'; // Texto Laranja
      default: return '#616161';
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.infoContainer}>
        <Text style={styles.titulo}>{titulo}</Text>
        <Text style={styles.endereco}>{endereco}</Text>
      </View>
      
      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(status) }]}>
        <Text style={[styles.statusText, { color: getStatusTextColor(status) }]}>
          {status}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row', // Alinha texto e status lado a lado
    justifyContent: 'space-between',
    alignItems: 'center',
    // Sombra suave (Elevation no Android, Shadow no iOS)
    elevation: 3, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoContainer: {
    flex: 1, // Ocupa o espaço disponível
    marginRight: 10,
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  endereco: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});