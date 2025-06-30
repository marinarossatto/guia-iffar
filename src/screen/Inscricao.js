import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useUsuario } from '../contexto/UsuarioContexto';
import { supabase } from '../config/supabase';
import * as Calendar from 'expo-calendar';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Inscricao({ route, navigation }) {
  const { eventoId, eventoTitulo, eventoData } = route.params;
  const { usuario } = useUsuario();
  const [carregando, setCarregando] = useState(false);

  const enviarEmailConfirmacao = async (status) => {
    try {
      const { data, error } = await supabase.functions.invoke('quick-processor', {
        body: {
          to: usuario.email,
          subject: `Confirmação de inscrição no evento "${eventoTitulo}"`,
          html: `
            <h2>Confirmação de Inscrição</h2>
            <p>Olá, ${usuario.email}!</p>
            <p>Sua inscrição no evento <strong>${eventoTitulo}</strong> foi <strong>${status}</strong>.</p>
            <p>Data do evento: ${new Date(eventoData).toLocaleDateString('pt-BR')}</p>
            <p>Nos vemos lá! 🎉</p>
          `,
        },
      });

      if (error) console.error('❌ Erro ao enviar e-mail:', error);
    } catch (error) {
      console.error('❌ Erro ao chamar função de e-mail:', error);
    }
  };

  const adicionarAoCalendario = async () => {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Não foi possível acessar o calendário.');
      return;
    }

    const calendarios = await Calendar.getCalendarsAsync();
    const calendarioPadrao = calendarios.find(c => c.allowsModifications) || calendarios[0];

    const inicio = new Date(eventoData);
    const fim = new Date(inicio);
    fim.setHours(inicio.getHours() + 2);

    try {
      await Calendar.createEventAsync(calendarioPadrao.id, {
        title: eventoTitulo,
        startDate: inicio,
        endDate: fim,
        timeZone: 'America/Sao_Paulo',
        notes: 'Evento confirmado via app IFFar',
      });
    } catch (e) {
      console.error('Erro ao adicionar ao calendário:', e);
      Alert.alert('Erro', 'Não foi possível adicionar à sua agenda.');
    }
  };

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

      await enviarEmailConfirmacao(status);

      if (status === 'confirmada') {
        await adicionarAoCalendario();
      }

      Alert.alert(
        'Sucesso',
        status === 'confirmada'
          ? 'Inscrição confirmada com sucesso! E-mail enviado.'
          : 'Vagas esgotadas. Você foi colocado na lista de espera. E-mail enviado.'
      );

      navigation.navigate('EventosTab', { screen: 'EventosLista' });

    } catch (error) {
      console.error('Erro ao se inscrever:', error);
      Alert.alert('Erro', 'Não foi possível realizar a inscrição.');
    }

    setCarregando(false);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
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

        <Button mode="outlined" onPress={() => navigation.goBack()} style={styles.botaoSecundario}>
          Cancelar
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flexGrow: 1,
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
  botaoSecundario: {
    marginBottom: 12,
  },
});
