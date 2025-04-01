import {StyleSheet, View} from "react-native";
import {Button, Text} from "react-native-paper";

export default function Home ({navigation}) {
    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>
                Guia Acadêmico IFFar PANAMBI
            </Text>
            
            <Button 
                style={styles.botao}
                mode="contained"
                onPress={() => navigation.navigate('Cursos')}>
                Ver Cursos
            </Button>

            <Button 
                style={styles.botao}
                mode="contained"
                onPress={() => navigation.navigate('Eventos')}>
                Ver Eventos
            </Button>

            <Button 
                style={styles.botao}
                mode="outlined"
                onPress={() => navigation.navigate('Sobre')}>
                    
                sobre o app
            </Button>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20
    },
    titulo: {
        fontSize: 24,
        marginBottom: 30,  
        textAlign: 'center',
    },
    botao: {
        marginVertical: 10,
    },
})