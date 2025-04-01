import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'; 
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Home from './src/screen/Home';
import { PaperProvider } from 'react-native-paper';
import Eventos from './src/screen/Eventos';
import Cursos from './src/screen/Cursos';
import Sobre from './src/screen/Sobre';
import { tema } from './src/config/Tema';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider theme={tema}>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home}/>
         <Stack.Screen name="Eventos" component={Eventos}/>
         <Stack.Screen name="Cursos" component={Cursos}/>
         <Stack.Screen name="Sobre" component={Sobre}/>

      </Stack.Navigator>
    </NavigationContainer>
    </PaperProvider>
  );
}