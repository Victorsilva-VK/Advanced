import React, { useState } from 'react';
import { StyleSheet, View, Image, TextInput, TouchableOpacity, Text, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../services/supabase'; 

// IMPORTAÇÕES NOVAS (A solução mágica)
import * as FileSystem from 'expo-file-system/legacy';
import { decode } from 'base64-arraybuffer';

export default function PreviewScreen({ route, navigation }) {
  const { photo, obra } = route.params;
  const [observacao, setObservacao] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSalvar = async () => {
    setLoading(true);

    try {
      // 1. Lendo a foto fisicamente do celular e convertendo para Base64 (Texto gigante)
      const base64File = await FileSystem.readAsStringAsync(photo, {
        encoding: 'base64', // <--- MUDANÇA AQUI: Texto em minúsculo e entre aspas
      });

      // 2. Criar um nome único
      const fileExt = photo.split('.').pop() || 'jpg';
      const fileName = `${obra.id}_${Date.now()}.${fileExt}`;

      // 3. UPLOAD (Usando o 'decode' para transformar o Base64 num arquivo real pra nuvem)
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('vistorias')
        .upload(fileName, decode(base64File), {
          contentType: `image/${fileExt}`,
        });

      if (uploadError) throw uploadError;

      // 4. Pegar a URL Pública
      const { data: publicUrlData } = supabase.storage
        .from('vistorias')
        .getPublicUrl(fileName);

      const publicUrl = publicUrlData.publicUrl;

      // 5. Salvar no Banco (Tabela vistorias)
      const { error: dbError } = await supabase
        .from('vistorias')
        .insert([{ 
            obra_id: obra.id, 
            foto_url: publicUrl, 
            observacao: observacao || 'Sem observações' 
        }]);

      if (dbError) throw dbError;

      Alert.alert("Vistoria Salva!", "A foto já está na nuvem.", [
          { text: "OK", onPress: () => navigation.popToTop() }
      ]);

    } catch (error) {
      Alert.alert("Erro ao salvar", "Problema na rede ou upload. Tente novamente.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        
        <View style={styles.imageContainer}>
          <Image source={{ uri: photo }} style={styles.image} resizeMode="contain" />
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>O que estamos vendo?</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Parede com infiltração..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={3}
            value={observacao}
            onChangeText={setObservacao}
            editable={!loading}
          />

          <View style={styles.buttonsRow}>
            <TouchableOpacity style={[styles.discardButton, loading && { opacity: 0.5 }]} onPress={() => navigation.goBack()} disabled={loading}>
              <Ionicons name="trash-outline" size={24} color="#c62828" />
              <Text style={styles.discardText}>Descartar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.saveButton, loading && { backgroundColor: '#66bb6a' }]} onPress={handleSalvar} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : (
                <>
                  <Ionicons name="cloud-upload-outline" size={24} color="#fff" />
                  <Text style={styles.saveText}>Salvar na Nuvem</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Estilos continuam os mesmos
const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#000' },
  imageContainer: { height: 500, width: '100%', backgroundColor: '#000', justifyContent: 'center' },
  image: { width: '100%', height: '100%' },
  formContainer: { flex: 1, backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, marginTop: -20 },
  label: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  input: { backgroundColor: '#f5f5f5', borderRadius: 10, padding: 15, fontSize: 16, color: '#333', textAlignVertical: 'top', marginBottom: 20, minHeight: 80 },
  buttonsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 15 },
  discardButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 15, borderRadius: 10, borderWidth: 1, borderColor: '#ffcdd2', backgroundColor: '#fff' },
  discardText: { color: '#c62828', fontWeight: 'bold', marginLeft: 8 },
  saveButton: { flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 15, borderRadius: 10, backgroundColor: '#2e7d32' },
  saveText: { color: '#fff', fontWeight: 'bold', marginLeft: 8, fontSize: 16 },
});