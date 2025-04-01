import { Linking, StyleSheet, View, ScrollView } from "react-native";
import { Button, Text } from "react-native-paper";
import CursoCard from "../componentes/CursoCard";

const cursos_db = [
    { nome: "Sistemas para Internet", modalidade: "Superior", turno: "noturno" },
    { nome: "Técnico em Informática", modalidade: "Técnico/médio", turno: "diurno" }
];

export default function Cursos({ navigation }) {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.titulo}>
                Lista de Cursos
            </Text>
            {cursos_db.map((curso, index) => (
                <CursoCard key={index} {...curso} />
            ))}
            
            <Button style={styles.botao}>
            </Button>
        </ScrollView>
    );
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
});