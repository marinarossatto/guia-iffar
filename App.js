import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UsuarioProvider } from './src/contexto/UsuarioContexto';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Home from './src/screen/Home';
import Eventos from './src/screen/Eventos';
import Cursos from './src/screen/Cursos';
import Sobre from './src/screen/Sobre';
import Login from './src/screen/Login';
import Cadastro from './src/screen/Cadastro';
import Inscricao from './src/screen/Inscricao';
import DetalheCurso from './src/screen/DetalheCurso';
import DetalheEvento from './src/screen/DetalheEvento';
import CadastroEvento from './src/screen/CadastroEvento';
import CadastroCurso from './src/screen/CadastroCurso';
import MinhaConta from './src/screen/MinhaConta';
import SelecionarLocalizacao from './src/screen/SelecionarLocalizacao';

import { tema } from './src/config/Tema';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function StackCursos() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Cursos" component={Cursos} />
      <Stack.Screen name="DetalheCurso" component={DetalheCurso} />
      <Stack.Screen name="CadastroCurso" component={CadastroCurso} />
    </Stack.Navigator>
  );
}

function StackEventos() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="EventosLista" component={Eventos} />
      <Stack.Screen name="DetalheEvento" component={DetalheEvento} />
      <Stack.Screen name="CadastroEvento" component={CadastroEvento} />
      <Stack.Screen name="Inscricao" component={Inscricao} />
      <Stack.Screen name="SelecionarLocalizacao" component={SelecionarLocalizacao} />
    </Stack.Navigator>
  );
}

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: tema.colors.primary,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
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
          tabBarLabel: 'Login',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="MinhaConta"  
        component={MinhaConta}
        options={{
          tabBarLabel: 'Perfil',  
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-circle-outline" size={size} color={color} />
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
      <Tab.Screen
        name="Cadastro"
        component={Cadastro}
        options={{
          tabBarButton: () => null,
          tabBarStyle: { display: 'none' },
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={tema}>
        <UsuarioProvider>
          <StatusBar style="auto" />
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Tabs" component={Tabs} />
            </Stack.Navigator>
          </NavigationContainer>
        </UsuarioProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
