import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { supabase } from '../services/supabase';

export default function NovaTransacaoScreen({ route, navigation }) {
  // Recebe o ID da obra para saber em qual "pasta" guardar o gasto
  const { obra_id } = route.params;

  const [descricao, setDescricao] = useState('');
  const[valor, setValor] = useState('');
  const [categoria, setCategoria] = useState('');
  const[tipo, setTipo] = useState('expense'); // Padrão: Despesa
  const[loading, setLoading] = useState(false);

  const handleSalvar = async () => {
    // 1. Validação
    if (!descricao || !valor || !categoria) {
      Alert.alert('Atenção', 'Preencha todos os campos!');
      return;
    }

    // Troca vírgula por ponto para o banco de dados entender a matemática
    const valorNumerico = parseFloat(valor.replace(',', '.'));
    if (isNaN(valorNumerico)) {
      Alert.alert('Atenção', 'Digite um valor numérico válido.');
      return;
    }

    setLoading(true);

    try {
      // 2. Insert no Banco de Dados
      const { error } = await supabase
        .from('financeiro')
        .insert([
          { 
            obra_id: obra_id,
            descricao: descricao,
            valor: valorNumerico,
            tipo: tipo,
            categoria: categoria
          }
        ]);

      if (error) throw error;

      Alert.alert('Sucesso', 'Lançamento registrado!',[
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);

    } catch (error) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.content}>
        
        {/* Escolha do Tipo (Receita Verde / Despesa Vermelha) */}
        <View style={styles.typeSelector}>
          <TouchableOpacity 
            style={[styles.typeBtn, tipo === 'income' && styles.typeBtnIncomeActive]}
            onPress={() => setTipo('income')}
          >
            <Text style={[styles.typeText, tipo === 'income' && styles.typeTextActive]}>💰 Receita</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.typeBtn, tipo === 'expense' && styles.typeBtnExpenseActive]}
            onPress={() => setTipo('expense')}
          >
            <Text style={[styles.typeText, tipo === 'expense' && styles.typeTextActive]}>💸 Despesa</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Descrição *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Compra de Cimento"
          value={descricao}
          onChangeText={setDescricao}
        />

        <Text style={styles.label}>Valor (R$) *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 150,50"
          keyboardType="numeric" // Abre o teclado de números
          value={valor}
          onChangeText={setValor}
        />

        <Text style={styles.label}>Categoria *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Material, Mão de Obra, Taxa"
          value={categoria}
          onChangeText={setCategoria}
        />

        <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleSalvar} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Salvar Lançamento</Text>}
        </TouchableOpacity>

      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 24 },
  typeSelector: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  typeBtn: { flex: 1, padding: 15, borderRadius: 8, borderWidth: 1, borderColor: '#ddd', alignItems: 'center' },
  typeBtnIncomeActive: { backgroundColor: '#e8f5e9', borderColor: '#2e7d32' },
  typeBtnExpenseActive: { backgroundColor: '#ffebee', borderColor: '#c62828' },
  typeText: { fontSize: 16, color: '#666', fontWeight: 'bold' },
  typeTextActive: { color: '#333' },
  label: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 8, marginTop: 16 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 15, fontSize: 16, backgroundColor: '#f9f9f9' },
  button: { backgroundColor: '#003366', padding: 16, borderRadius: 12, marginTop: 40, alignItems: 'center' },
  buttonDisabled: { backgroundColor: '#999' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});