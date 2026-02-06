import React, { useState } from 'react';
import { 
  StyleSheet, View, Image, TextInput, TouchableOpacity, Text, 
  KeyboardAvoidingView, Platform, ScrollView, Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PreviewScreen({ route, navigation }) {
  // Recebendo a foto da tela anterior
  const { photo } = route.params;
  const [observacao, setObservacao] = useState('');

  const handleSalvar = () => {
    // AQUI É ONDE VAMOS SALVAR NO BANCO FUTURAMENTE
    console.log("Salvando Vistoria...");
    console.log("Foto:", photo);
    console.log("Obs:", observacao);

    Alert.alert(
      "Vistoria Salva!", 
      "Sua foto foi registrada com sucesso.",
      [
        { 
          text: "OK", 
          onPress: () => {
            // Volta lá para a tela de Detalhes da Obra (reseta a pilha de navegação)
            // Isso evita que o usuário volte para a câmera ao clicar "Voltar"
            navigation.popToTop(); 
          }
        }
      ]
    );
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container}>
        
        {/* A Imagem Capturada */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: photo }} style={styles.image} resizeMode="contain" />
        </View>

        {/* Formulário de Detalhes */}
        <View style={styles.formContainer}>
          <Text style={styles.label}>O que estamos vendo?</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Ex: Infiltração no rodapé, parede pintada..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={3}
            value={observacao}
            onChangeText={setObservacao}
          />

          {/* Botões de Ação */}
          <View style={styles.buttonsRow}>
            
            {/* Botão Refazer (Lixo) */}
            <TouchableOpacity 
              style={styles.discardButton} 
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="trash-outline" size={24} color="#c62828" />
              <Text style={styles.discardText}>Descartar</Text>
            </TouchableOpacity>

            {/* Botão Salvar (Check) */}
            <TouchableOpacity 
              style={styles.saveButton} 
              onPress={handleSalvar}
            >
              <Ionicons name="checkmark-circle" size={24} color="#fff" />
              <Text style={styles.saveText}>Salvar Vistoria</Text>
            </TouchableOpacity>
            
          </View>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#000', // Fundo preto para destacar a foto
  },
  imageContainer: {
    height: 500, // Altura fixa para a foto
    width: '100%',
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    marginTop: -20, // Efeito de sobreposição leve
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#333',
    textAlignVertical: 'top', // Para o texto começar em cima no Android
    marginBottom: 20,
    minHeight: 80,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  discardButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ffcdd2',
    backgroundColor: '#fff',
  },
  discardText: {
    color: '#c62828',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  saveButton: {
    flex: 2, // Botão salvar ocupa o dobro do espaço
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#2e7d32', // Verde Sucesso
  },
  saveText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
});