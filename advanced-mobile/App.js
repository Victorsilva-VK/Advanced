import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// --- IMPORTAÇÕES DAS TELAS ---
import HomeScreen from './src/screens/HomeScreen';
import DetailsScreen from './src/screens/DetailsScreen';
import VistoriaScreen from './src/screens/VistoriaScreen';
import PreviewScreen from './src/screens/PreviewScreen';
import FinanceiroScreen from './src/screens/FinanceiroScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* Aqui definimos nossas rotas */}
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ headerShown: false }} // Esconde o cabeçalho padrão feio
        />
        <Stack.Screen 
          name="Detalhes" 
          component={DetailsScreen} 
          options={{ headerShown: false }} 
        />

        <Stack.Screen 
          name="Vistoria" 
          component={VistoriaScreen} 
          options={{ headerShown: false }} // Câmera precisa ser tela cheia
        />
        <Stack.Screen 
          name="Preview" 
          component={PreviewScreen} 
          options={{ title: 'Nova Vistoria' }} // Aqui pode ter cabeçalho
        />
        <Stack.Screen 
          name="Financeiro" 
          component={FinanceiroScreen} 
          options={{ headerShown: false }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}