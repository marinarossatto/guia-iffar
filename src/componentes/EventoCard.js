import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { Ionicons, MaterialIcons, AntDesign } from '@expo/vector-icons';

export default function EventoCard({
  titulo,
  data,
  local,
  inscricao,
  total_vagas,
  vagas_disponiveis,
  statusInscricao,
  quantidadeComentarios = 0,
  quantidadeFotos = 0,
  quantidadeCurtidas = 0,
  onPress
}) {
  const theme = useTheme();
  const primary = theme.colors.primary;

  const getBadge = () => {
    if (statusInscricao === 'confirmada') {
      return { texto: 'Inscrito', cor: '#555' };
    }
    if (statusInscricao === 'espera') {
      return { texto: '⏳ Em espera', cor: '#F1C40F' };
    }
    if (!statusInscricao && inscricao === false) {
      return { texto: '🚫 Encerradas', cor: '#C4112F' };
    }
    if (!statusInscricao && inscricao === true) {
      return { texto: 'Abertas', cor: primary };
    }
    return null;
  };

  const badge = getBadge();

  return (
    <TouchableOpacity onPress={onPress}>
      <Card style={styles.card} mode="outlined">
        <Card.Content>
          <View style={styles.header}>
            <Text style={styles.titulo}>{titulo}</Text>
            {badge && (
              <View style={[styles.badgeBase, { backgroundColor: badge.cor }]}>
                <Text style={styles.badgeText}>{badge.texto}</Text>
              </View>
            )}
          </View>

          <Text style={styles.info}>📅 {new Date(data).toLocaleDateString('pt-BR')}</Text>
          <Text style={styles.info}>📍 {local}</Text>

          {inscricao && total_vagas !== null && (
            <Text style={styles.info}>
              🪑 Vagas: {vagas_disponiveis} / {total_vagas}
            </Text>
          )}

          <View style={styles.iconesRodape}>
            <View style={styles.iconWrapper}>
              <AntDesign name="hearto" size={20} color={primary} />
              <Text style={[styles.sobrescrito, styles.sobrescritoCurtir]}>{quantidadeCurtidas}</Text>
            </View>
            <View style={styles.iconWrapper}>
              <Ionicons name="chatbubble-ellipses-outline" size={20} color={primary} />
              <Text style={styles.sobrescrito}>{quantidadeComentarios}</Text>
            </View>
            <View style={styles.iconWrapper}>
              <MaterialIcons name="photo-library" size={20} color={primary} />
              <Text style={styles.sobrescrito}>{quantidadeFotos}</Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#1C9B5E',
    backgroundColor: '#fdfdfd',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C9B5E',
    flex: 1,
    marginRight: 10,
  },
  badgeBase: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
  },
  info: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  iconesRodape: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 20,
    marginTop: 12,
  },
  iconWrapper: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sobrescrito: {
    position: 'absolute',
    top: -10,
    right: -10,
    fontSize: 10,
    color: 'red',
    fontWeight: 'bold',
  },
  sobrescritoCurtir: {
    right: -12,
  },
});
