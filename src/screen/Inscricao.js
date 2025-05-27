import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useUsuario } from '../contexto/UsuarioContexto';
import { supabase } from '../config/supabase';

export default function Inscricao({ route, navigation }) {
  const { eventoId, eventoTitulo, eventoData } = route.params;
  const { usuario } = useUsuario();
  const [carregando, setCarregando] = useState(false);

  const realizarInscricao = async () => {
    if (!usuario || !usuario.id) {
      Alert.alert('Erro', 'Usuário não logado.');
      return;
    }

    setCarregando(true);

    try {
      const { count: totalConfirmados, error: erroContagem } = await supabase
        .from('inscricoes')
        .select('*', { count: 'exact', head: true })
        .eq('evento_id', eventoId)
        .eq('status', 'confirmada');

      if (erroContagem) throw erroContagem;

      const { data: eventoDataInfo, error: erroEvento } = await supabase
        .from('eventos')
        .select('total_vagas')
        .eq('id', eventoId)
        .single();

      if (erroEvento) throw erroEvento;

      const status = totalConfirmados < eventoDataInfo.total_vagas ? 'confirmada' : 'espera';

      const { error: erroInscricao } = await supabase
        .from('inscricoes')
        .insert({
          usuario_id: usuario.id,
          evento_id: eventoId,
          data: new Date().toISOString(),
          status,
        });

      if (erroInscricao) throw erroInscricao;

      Alert.alert(
        'Sucesso',
        status === 'confirmada'
          ? 'Inscrição confirmada com sucesso!'
          : 'Vagas esgotadas. Você foi colocado na lista de espera.'
      );

      navigation.navigate('EventosTab', { screen: 'EventosLista' });
      // Redireciona à lista de eventos

    } catch (error) {
      console.error('Erro ao se inscrever:', error);
      Alert.alert('Erro', 'Não foi possível realizar a inscrição.');
    }

    setCarregando(false);
  };

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.titulo}>Inscrição no Evento</Text>

      <Text style={styles.info}><Text style={styles.bold}>Título:</Text> {eventoTitulo}</Text>
      <Text style={styles.info}><Text style={styles.bold}>Data:</Text> {new Date(eventoData).toLocaleDateString('pt-BR')}</Text>

      <Button
        mode="contained"
        onPress={realizarInscricao}
        loading={carregando}
        disabled={carregando}
        style={styles.botao}
      >
        Confirmar Inscrição
      </Button>

      <Button mode="outlined" onPress={() => navigation.goBack()}>
        Cancelar
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    justifyContent: 'center',
  },
  titulo: {
    marginBottom: 24,
    textAlign: 'center',
  },
  info: {
    marginBottom: 12,
    fontSize: 16,
  },
  bold: {
    fontWeight: 'bold',
  },
  botao: {
    marginBottom: 12,
  },
});
