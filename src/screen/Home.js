import { LinearGradient } from "expo-linear-gradient";
import { Image, StyleSheet, View } from "react-native";
import { Badge, Button, Text } from "react-native-paper";
import { useUsuario } from '../contexto/UsuarioContexto'; 


export default function Home({ navigation }) {

    const { usuario, perfil, logout } = useUsuario();
    const sair = async () => {
        await logout();
        navigation.navigate('Login'); // redireciona manualmente para login
     };

    return (
        <LinearGradient colors={['#DFF5EB', '#FFFFFF']} style={styles.container}>
        <View style={styles.centered}>
            <Text>Olá, {perfil?.nome || 'Visitante'}!</Text>

           
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../../assets/logo-iffar.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>


                <Text style={styles.titulo}>
                    Guia Acadêmico IFFar
                </Text>

                <Button
                    style={styles.botao}
                    mode="contained"
                    onPress={() => navigation.navigate('CursosTab')}
                >
                    Ver Cursos
                </Button>

                <Button
                    style={styles.botao}
                    mode="contained"
                    onPress={() => navigation.navigate('Eventos')}
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
                    mode="outlined"
                    onPress={() => navigation.navigate('Sobre')}
                >
                    Sobre o app
                </Button>

                <Button mode="outlined" onPress={sair} style={{ marginTop: 20 }}>
                    Sair
                </Button>
               
            </View>
        </LinearGradient> 
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
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
    },
    botaoVoltar: {
        marginTop: 20,
        alignSelf: 'center'
    }
});