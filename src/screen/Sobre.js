import {Linking, StyleSheet, View} from "react-native";
import {Button, Text} from "react-native-paper";

export default function Sobre ({navigation}) {
    return (
        
 <View style={styles.container}>
            <Text style={styles.titulo}>
                Sobre o app
            </Text>
            <Text>
                Este aplicativo é um projeto acadêmico
                 do curso de Sistemas para Internet - Campus Panambi.
            </Text>
            
<Button style= {styles.botao}

        mode="contained"
        onPress={()=>
            Linking.openURL('https://www.iffarroupilha.edu.br/portal')

        }>
            Acessar o site do Campus

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