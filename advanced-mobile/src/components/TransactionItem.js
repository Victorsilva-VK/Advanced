import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TransactionItem({ description, value, type, date, category }) {
  // Define a cor baseada no tipo (Despesa = Vermelho, Receita = Verde)
  const isExpense = type === 'expense';
  const color = isExpense ? '#c62828' : '#2e7d32';
  const iconName = isExpense ? 'arrow-down-circle' : 'arrow-up-circle';

  // Formatação simples de moeda (R$)
  const formattedValue = `R$ ${Math.abs(value).toFixed(2).replace('.', ',')}`;

  return (
    <View style={styles.container}>
      {/* Ícone à Esquerda */}
      <View style={[styles.iconContainer, { backgroundColor: isExpense ? '#ffebee' : '#e8f5e9' }]}>
        <Ionicons name={iconName} size={24} color={color} />
      </View>

      {/* Descrição e Data */}
      <View style={styles.infoContainer}>
        <Text style={styles.description}>{description}</Text>
        <Text style={styles.date}>{date} • {category}</Text>
      </View>

      {/* Valor à Direita */}
      <Text style={[styles.value, { color: color }]}>
        {isExpense ? '-' : '+'} {formattedValue}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContainer: {
    flex: 1, // Empurra o valor para a direita
  },
  description: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  date: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});