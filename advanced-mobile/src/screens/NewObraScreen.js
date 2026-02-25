import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../services/supabase'; // Importando a conexão

export default function NewObraScreen({ navigation }) {
  const [titulo, setTitulo] = useState('');
  const [endereco, setEndereco] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSalvar = async () => {
    // 1. Validação Básica
    if (titulo.trim() === '') {
      Alert.alert('Atenção', 'Por favor, dê um nome para a obra.');
      return;
    }

    setLoading(true);

    try {
      // 2. Enviar para o Supabase
      const { error } = await supabase
        .from('obras')
        .insert([
          { 
            titulo: titulo, 
            endereco: endereco,
            status: 'Em Andamento' // Padrão inicial
          }
        ]);

      if (error) throw error;

      // 3. Sucesso!
      Alert.alert('Sucesso', 'Obra cadastrada!', [
        { text: 'OK', onPress: () => navigation.goBack() } // Volta para a Home
      ]);

    } catch (error) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.label}>Nome da Obra / Cliente *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Reforma Apto 302 - Sra. Ana"
          value={titulo}
          onChangeText={setTitulo}
        />

        <Text style={styles.label}>Endereço</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Rua das Palmeiras, 100"
          value={endereco}
          onChangeText={setEndereco}
        />

        {/* Botão Salvar com Loading */}
        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleSalvar}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="save-outline" size={24} color="#fff" style={{ marginRight: 10 }} />
              <Text style={styles.buttonText}>Cadastrar Obra</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#003366',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 40,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});