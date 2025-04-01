import {Linking, StyleSheet, View} from "react-native";
import {Button, Text} from "react-native-paper";
import EventoCard from "../componentes/EventoCard";

const evento_db=[
    {titulo: "Semana Acadêmica", data:"26/06/2025", local: "Auditório"},
    {titulo: "BugCup", data:"05/09/2025", local: "Iffar"},
]

export default function Eventos ({navigation}) {
    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>
              Lista de Eventos
            </Text>
            {evento_db.map((evento, index)=>(
                <EventoCard key={index} {...evento} />
            ))}
            
            <Button style={styles.botao}>
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