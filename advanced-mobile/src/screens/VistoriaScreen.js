import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function VistoriaScreen({ navigation }) {
  const [facing, setFacing] = useState('back'); // Começa com a câmera traseira
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null); // Referência para controlar a câmera
  const [isTakingPhoto, setIsTakingPhoto] = useState(false); // Para evitar clique duplo

  // 1. Verificando Permissões (Lógica de Segurança)
  if (!permission) {
    // Permissão ainda carregando
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    // Permissão negada ou ainda não pedida
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Precisamos da sua câmera para registrar a obra.</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Permitir Câmera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 2. Função para inverter câmera (Frente/Trás)
  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  // 3. Função para Tirar a Foto (O Clique)
  async function takePicture() {
    if (cameraRef.current && !isTakingPhoto) {
      setIsTakingPhoto(true);
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.7, // 70% da qualidade (já comprime um pouco)
          base64: false, // Não precisamos do texto gigante agora
        });
        
        navigation.navigate('Preview', { photo: photo.uri });

      } catch (error) {
        Alert.alert('Erro', 'Não foi possível tirar a foto.');
        console.error(error);
      } finally {
        setIsTakingPhoto(false);
      }
    }
  }

  return (
    <View style={styles.container}>
      {/* O Componente da Câmera em Tela Cheia */}
      <CameraView 
        style={styles.camera} 
        facing={facing} 
        ref={cameraRef}
      >
        
        {/* Overlay: Botões em cima da câmera */}
        <SafeAreaView style={styles.overlay}>
          
          {/* Botão Fechar (Topo Esquerdo) */}
          <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={30} color="white" />
          </TouchableOpacity>

          {/* Área de Controles (Fundo) */}
          <View style={styles.controlsContainer}>
            
            {/* Botão Inverter Câmera */}
            <TouchableOpacity style={styles.controlButton} onPress={toggleCameraFacing}>
              <Ionicons name="camera-reverse-outline" size={30} color="white" />
            </TouchableOpacity>

            {/* Botão de Disparo (O Gatilho) */}
            <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
              {isTakingPhoto ? (
                <ActivityIndicator color="#003366" />
              ) : (
                <View style={styles.captureInner} />
              )}
            </TouchableOpacity>

            {/* Botão Vazio para equilibrar o layout (Espaço) */}
            <View style={styles.controlButton} /> 

          </View>

        </SafeAreaView>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  permissionText: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 18,
    color: '#333',
  },
  permissionButton: {
    backgroundColor: '#003366',
    padding: 15,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between', // Separa topo e fundo
  },
  closeButton: {
    alignSelf: 'flex-start',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.3)', // Fundo semitransparente
    borderRadius: 50,
    marginLeft: 20,
    marginTop: 10,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 40,
    backgroundColor: 'rgba(0,0,0,0.3)', // Fundo escuro na base para ver os botões
    paddingTop: 20,
  },
  controlButton: {
    width: 50,
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#003366', // Borda azul fina
  },
});