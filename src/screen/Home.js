import { LinearGradient } from "expo-linear-gradient";
import { Image, StyleSheet, View, ScrollView } from "react-native";
import { Button, Text } from "react-native-paper";
import { useUsuario } from '../contexto/UsuarioContexto';

export default function Home({ navigation }) {
  const { usuario, perfil, logout } = useUsuario();

  const sair = async () => {
    await logout();
    navigation.navigate('Login');
  };

  return (
    <LinearGradient colors={['#DFF5EB', '#FFFFFF']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.centered}>

       
          <Text style={styles.boasVindas}>
             Olá, {usuario && perfil?.nome ? perfil.nome : 'Visitante'}!
          </Text>
          <Text style={styles.subtitulo}>
            Seja bem-vindo ao Guia Acadêmico do IFFar 
          </Text>

        
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/logo-iffar.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

         
          <Text style={styles.titulo}>Guia Acadêmico IFFar</Text>

        
          <Button
            style={styles.botao}
            mode="contained"
            onPress={() => navigation.navigate('CursosTab', { screen: 'Cursos' })}
          >
            Ver Cursos
          </Button>

          <Button
            style={styles.botao}
            mode="contained"
            onPress={() => navigation.navigate('EventosTab', { screen: 'EventosLista' })}
          >
            Ver Eventos
          </Button>

          <Button
            style={styles.botao}
            mode="contained"
            onPress={() => navigation.navigate('Login')}
          >
            Login
          </Button>

          <Button
            style={styles.botao}
            mode="contained"
            onPress={() => navigation.navigate('Sobre')}
          >
            Sobre o app
          </Button>

          <Button
            style={styles.botao}
            mode="contained"
            onPress={sair}
          >
            Sair
          </Button>

        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
  },
  centered: {
    alignItems: 'center',
  },
  boasVindas: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1C9B5E',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    marginBottom: 24,
  },
  logoContainer: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: '50%',
    alignSelf: 'center'
  },
  logo: {
    width: '100%',
    height: 100,
  },
  titulo: {
    fontSize: 24,
    marginBottom: 30,
    textAlign: 'center',
    color: '#2c3e50'
  },
  botao: {
    marginVertical: 10,
    alignSelf: 'stretch',
  }
});
