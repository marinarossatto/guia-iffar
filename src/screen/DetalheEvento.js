import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Button, useTheme } from 'react-native-paper';
import { useUsuario } from '../contexto/UsuarioContexto';
import { supabase } from '../config/supabase';

export default function DetalheEvento({ route, navigation }) {
  const { colors } = useTheme();
  const { usuario } = useUsuario();

  const evento = route?.params;

  if (!evento || !evento.id) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ fontSize: 18, color: 'red', textAlign: 'center' }}>
          ❌ Erro: dados do evento não foram carregados.
        </Text>
        <Button mode="outlined" onPress={() => navigation.goBack()} style={{ marginTop: 16 }}>
          Voltar
        </Button>
      </View>
    );
  }

  const {
    id,
    titulo,
    descricao,
    data,
    local,
    inscricao,
    total_vagas,
    vagas_disponiveis,
    statusInscricao
  } = evento;

  const cancelarInscricao = async () => {
    const { error } = await supabase
      .from('inscricoes')
      .delete()
      .eq('evento_id', id)
      .eq('usuario_id', usuario.id);
  
    if (error) {
      Alert.alert('Erro', 'Não foi possível cancelar a inscrição.');
      return;
    }
  
    Alert.alert('Sucesso', 'Inscrição cancelada.');
    navigation.navigate('EventosTab', { screen: 'EventosLista' });
  };
  
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Title
          title={titulo}
          titleStyle={{ color: colors.primary, fontWeight: 'bold' }}
        />
        <Card.Content>
          <Text style={styles.label}>📅 Data:</Text>
          <Text style={styles.text}>{new Date(data).toLocaleDateString('pt-BR')}</Text>

          <Text style={styles.label}>📍 Local:</Text>
          <Text style={styles.text}>{local}</Text>

          <Text style={styles.label}>📝 Descrição:</Text>
          <Text style={styles.text}>{descricao}</Text>

          {inscricao && !statusInscricao && (
            <Button
              mode="contained"
              style={styles.botaoInscricao}
              onPress={() => navigation.navigate('Inscricao', {
                eventoId: id,
                eventoTitulo: titulo,
                eventoData: data
              })}
            >
              Inscrever-se
            </Button>
          )}

          {(statusInscricao === 'confirmada' || statusInscricao === 'espera') && (
            <Button
              mode="outlined"
              style={styles.botaoCancelar}
              onPress={cancelarInscricao}
            >
              Cancelar inscrição
            </Button>
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 8,
    color: '#555',
  },
  text: {
    marginBottom: 8,
    fontSize: 16,
  },
  botaoInscricao: {
    marginTop: 20,
  
  },
  botaoCancelar: {
    marginTop: 16,
  
  },
});
