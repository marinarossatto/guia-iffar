import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
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
import DetalheCurso from './src/screen/DetalheCurso';

const Tab = createBottomTabNavigator();

const Stack = createNativeStackNavigator();

function StackCursos() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Cursos" component={Cursos} options={{ title: 'Cursos do Campus' }} />
      <Stack.Screen name="DetalheCurso" component={DetalheCurso} options={{ title: 'Detalhes do Curso' }} />
    </Stack.Navigator>
  );
}
 

export default function App() {
  return (
    <PaperProvider theme={tema}>
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
            name="Eventos"
            component={Eventos}
            options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="calendar-month-outline" size={size} color={color} />
              ),
            }}
          />
           <Tab.Screen
            name="Login"
            component={Login}
            options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="account" size={size} color={color} />
              ),
            }}
          />
           <Tab.Screen
               name="Cadastro"
               component={Cadastro}
                options={{
                  tabBarItemStyle: { display: 'none' }, 
                  tabBarButton: () => null,
             }}
/>
          <Tab.Screen
            name="Sobre"
            component={Sobre}
            options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="information-outline" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen 
          name="DetalheCurso" 
          component={DetalheCurso}
           options={{
             tabBarButton: () => null,
              tabBarStyle: { display: 'none' } }} 
          />
        </Tab.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}