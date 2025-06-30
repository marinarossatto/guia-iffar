import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function CursoCard({ nome, modalidade, nivel, duracao, turno, onPress }) {
  const theme = useTheme();
  const primary = theme.colors.primary;
  const mostrar = (valor, fallback = 'Não informado') =>
    typeof valor === 'string' ? valor : fallback;

  return (
    <Card mode="outlined" style={styles.card} onPress={onPress}>
      <Card.Content>
        <View style={styles.header}>
          <MaterialCommunityIcons
            name="book-education-outline"
            size={20}
            color={primary}
            style={{ marginRight: 8 }}
          />

          <Text style={styles.nome}>{mostrar(nome, 'Curso sem nome')}</Text>
          <View style={[styles.badgeBase, { backgroundColor: primary }]}>
            <Text style={styles.badgeText}>{mostrar(nivel)}</Text>
          </View>
        </View>

        <View style={styles.info}>
          <MaterialCommunityIcons name="clock-outline" size={18} color="#555" />
          <Text style={styles.infoText}>{mostrar(duracao)}</Text>
        </View>

        <View style={styles.info}>
          <MaterialCommunityIcons name="weather-night" size={18} color="#555" />
          <Text style={styles.infoText}>{mostrar(turno)}</Text>
        </View>

        <View style={styles.info}>
          <MaterialCommunityIcons name="account-group-outline" size={18} color="#555" />
          <Text style={styles.infoText}>{mostrar(modalidade)}</Text>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#1C9B5E',
    backgroundColor: '#fdfdfd',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  nome: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C9B5E',
  },
  badgeBase: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
});
