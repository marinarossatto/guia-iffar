import { Card, Text } from "react-native-paper";
import { StyleSheet } from "react-native";

export default function EventoCard({ titulo, data, local}) {
    return (
        <Card style={styles.card} mode="outlined">
            <Card.Content>
                <Text variant="titleMedium" style={styles.title}>
                    {titulo}
                </Text>
                <Text variant="bodyMedium" style={styles.text}>
                    {data}
                </Text>
                <Text variant="bodyMedium" style={styles.text}>
                    {local}
                </Text>
            </Card.Content>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        margin: 10,
        borderRadius: 8,
      
      
    },
    title: {
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#2c3e50',
    },
    text: {
        color: '#7f8c8d',
        marginBottom: 3,
    },
});