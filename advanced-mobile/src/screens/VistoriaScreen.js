import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
// FIX: Importando a SafeAreaView moderna
import { SafeAreaView } from 'react-native-safe-area-context';

export default function VistoriaScreen({ route, navigation }) {
  const { obra } = route.params; 
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);

  if (!permission) return <View style={styles.container} />;
  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Precisamos da sua câmera para registrar a obra.</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Permitir Câmera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  async function takePicture() {
    if (cameraRef.current && !isTakingPhoto) {
      setIsTakingPhoto(true);
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.7,
          base64: false,
        });
        
        navigation.navigate('Preview', { photo: photo.uri, obra: obra });

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
      
      {/* FIX: A Câmera agora fica de "papel de parede", atrás de tudo */}
      <CameraView 
        style={StyleSheet.absoluteFillObject} 
        facing={facing} 
        ref={cameraRef}
      />
        
      {/* FIX: Os botões não são mais "filhos" da câmera, eles flutuam por cima em posição absoluta */}
      <SafeAreaView style={styles.overlay}>
        
        <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={30} color="white" />
        </TouchableOpacity>

        <View style={styles.controlsContainer}>
          <TouchableOpacity style={styles.controlButton} onPress={toggleCameraFacing}>
            <Ionicons name="camera-reverse-outline" size={30} color="white" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            {isTakingPhoto ? (
              <ActivityIndicator color="#003366" />
            ) : (
              <View style={styles.captureInner} />
            )}
          </TouchableOpacity>

          <View style={styles.controlButton} /> 
        </View>

      </SafeAreaView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  permissionContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#fff' },
  permissionText: { textAlign: 'center', marginBottom: 20, fontSize: 18, color: '#333' },
  permissionButton: { backgroundColor: '#003366', padding: 15, borderRadius: 8 },
  permissionButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  overlay: {
    // A MÁGICA: Isso faz a tela invisível com botões ficar exatamente do mesmo tamanho da tela
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  closeButton: { alignSelf: 'flex-start', padding: 20, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 50, marginLeft: 20, marginTop: 10 },
  controlsContainer: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingBottom: 40, backgroundColor: 'rgba(0,0,0,0.3)', paddingTop: 20 },
  controlButton: { width: 50, alignItems: 'center' },
  captureButton: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' },
  captureInner: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#fff', borderWidth: 2, borderColor: '#003366' },
});