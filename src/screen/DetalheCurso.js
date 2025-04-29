import { ScrollView, StyleSheet } from "react-native";
import { Card, Divider, Text } from "react-native-paper";

export default function DetalheCurso({ route }) {
    const {
        nome,
        modalidade,
        nivel,
        unidade,
        duracao,
        turno,
        descricao,
    } = route.params;

    return (
        <ScrollView style={styles.container}>
            <Card mode="outlined" style={styles.card}>
                <Card.Content>  {/* Changed from CardContent to Card.Content */}
                    <Text variant="titleLarge">
                        {nome}
                    </Text>
                    <Divider style={styles.divisor}/>
                    <Text variant="bodyMedium">Modalidade: {modalidade}</Text>
                    <Text variant="bodyMedium">Nível: {nivel}</Text>
                    <Text variant="bodyMedium">Unidade: {unidade}</Text>
                    <Text variant="bodyMedium">Duração: {duracao}</Text>
                    <Text variant="bodyMedium">Turno: {turno}</Text>
                    <Divider style={styles.divisor}/>
                    <Text variant="titleSmall">Descrição</Text>
                    <Text variant="bodyMedium">{descricao}</Text>
                </Card.Content>
            </Card>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    card: { marginBottom: 15 },
    divisor: { marginVertical: 10 }
});