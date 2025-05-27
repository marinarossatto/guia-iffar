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

  const mostrar = (valor, fallback = 'Não informado') =>
    typeof valor === 'string' ? valor : fallback;

  return (
    <ScrollView style={styles.container}>
      <Card mode="outlined" style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge">{mostrar(nome, 'Curso sem nome')}</Text>
          <Divider style={styles.divisor} />

          <Text variant="bodyMedium">Modalidade: {mostrar(modalidade)}</Text>
          <Text variant="bodyMedium">Nível: {mostrar(nivel)}</Text>
          <Text variant="bodyMedium">Unidade: {mostrar(unidade)}</Text>
          <Text variant="bodyMedium">Duração: {mostrar(duracao)}</Text>
          <Text variant="bodyMedium">Turno: {mostrar(turno)}</Text>

          <Divider style={styles.divisor} />

          <Text variant="titleSmall">Descrição</Text>
          <Text variant="bodyMedium">{mostrar(descricao, 'Sem descrição disponível.')}</Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: { marginBottom: 15 },
  divisor: { marginVertical: 10 },
});
