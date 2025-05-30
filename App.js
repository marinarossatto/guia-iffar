import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UsuarioProvider } from './src/contexto/UsuarioContexto';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Home from './src/screen/Home';
import Eventos from './src/screen/Eventos';
import Cursos from './src/screen/Cursos';
import Sobre from './src/screen/Sobre';
import { tema } from './src/config/Tema';
import Login from './src/screen/Login';
import Cadastro from './src/screen/Cadastro';
import Inscricao from './src/screen/Inscricao';
import DetalheCurso from './src/screen/DetalheCurso';
import DetalheEvento from './src/screen/DetalheEvento'; // Importe a nova tela
import CadastroEvento from './src/screen/CadastroEvento';
import CadastroCurso from './src/screen/CadastroCurso';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const StackCursos = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Cursos" component={Cursos} />
    <Stack.Screen name="DetalheCurso" component={DetalheCurso} />
    <Stack.Screen name="CadastroCurso" component={CadastroCurso} />
  </Stack.Navigator>
);



const StackEventos = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="EventosLista" component={Eventos} />
    <Stack.Screen name="DetalheEvento" component={DetalheEvento} />
    <Stack.Screen name="CadastroEvento" component={CadastroEvento} />
    <Stack.Screen name="Inscricao" component={Inscricao} /> 
  </Stack.Navigator>
);

export default function App() {
  return (
    <PaperProvider theme={tema}>
      <UsuarioProvider>
        <StatusBar style="auto" />
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={{
              headerShown: false,
              tabBarActiveTintColor: tema.colors.primary,
            }}
          >
            <Tab.Screen
              name="Home"
              component={Home}
              options={{
                tabBarLabel: 'Início',
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons name="home" size={size} color={color} />
                ),
              }}
            />
            
            <Tab.Screen
              name="CursosTab"
              component={StackCursos}
              options={{
                tabBarLabel: 'Cursos',
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons name="book-outline" size={size} color={color} />
                ),
              }}
            />
            
            <Tab.Screen
              name="EventosTab"
              component={StackEventos}
              options={{
                tabBarLabel: 'Eventos',
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons name="calendar-month-outline" size={size} color={color} />
                ),
              }}
            />
            
            <Tab.Screen
              name="Login"
              component={Login}
              options={{
                tabBarLabel: 'Conta',
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons name="account" size={size} color={color} />
                ),
              }}
            />
            
            <Tab.Screen
              name="Sobre"
              component={Sobre}
              options={{
                tabBarLabel: 'Sobre',
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons name="information-outline" size={size} color={color} />
                ),
              }}
            />
            
            {/* Tela de Cadastro (oculta na tab bar) */}
            <Tab.Screen
              name="Cadastro"
              component={Cadastro}
              options={{
                tabBarButton: () => null,
                tabBarStyle: { display: 'none' },
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </UsuarioProvider>
    </PaperProvider>
  );
}