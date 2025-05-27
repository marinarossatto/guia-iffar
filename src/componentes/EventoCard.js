import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text, Badge, Button, useTheme } from 'react-native-paper';

export default function EventoCard({ 
  titulo, 
  data, 
  local, 
  inscricao, 
  total_vagas,
  vagas_disponiveis,
  statusInscricao,
  onPress 
}) {
  const theme = useTheme();

  return (
    <Card style={styles.card} mode="outlined">
      <Card.Content>
        <View style={styles.header}>
          <Text variant="titleMedium">{titulo}</Text>

          {statusInscricao === 'confirmada' && (
            <Badge style={[styles.badgeBase, { backgroundColor: '#555555' }]}>
              Inscrito
            </Badge>
          )}

          {statusInscricao === 'espera' && (
            <Badge style={[styles.badgeBase, { backgroundColor: '#F1C40F' }]}>
              ⏳ Em espera
            </Badge>
          )}

          {!statusInscricao && inscricao === false && (
            <Badge style={[styles.badgeBase, { backgroundColor: '#C4112F' }]}>
              🚫 Inscrições Encerradas
            </Badge>
          )}

          {!statusInscricao && inscricao === true && (
            <Badge style={[styles.badgeBase, { backgroundColor: theme.colors.primary }]}>
              Inscrições Abertas
            </Badge>
          )}
        </View>

        <Text variant="bodyMedium">📅 {new Date(data).toLocaleDateString('pt-BR')}</Text>
        <Text variant="bodyMedium">📍 {local}</Text>

        {inscricao && total_vagas !== null && (
          <Text variant="bodyMedium">
            🪑 Vagas restantes: {vagas_disponiveis} / {total_vagas}
          </Text>
        )}

        <Button
          mode="text"
          style={styles.botaoDetalhes}
          onPress={onPress}
        >
          Ver detalhes
        </Button>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeBase: {
    color: '#fff',
    paddingHorizontal: 10,
  },
  botaoDetalhes: {
    marginTop: 10,
    alignSelf: 'flex-start',
  },
});