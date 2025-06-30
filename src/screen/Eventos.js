import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Text, ActivityIndicator, FAB } from 'react-native-paper';
import EventoCard from '../componentes/EventoCard';
import { supabase } from '../config/supabase';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { useUsuario } from '../contexto/UsuarioContexto';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Eventos({ navigation }) {
  const [eventos, setEventos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const { usuario } = useUsuario();

  useFocusEffect(
    useCallback(() => {
      let ativo = true;

      async function buscarEventos() {
        setCarregando(true);

        const { data: listaEventos, error: erroEventos } = await supabase
          .from('eventos')
          .select('*');

        if (erroEventos) {
          console.log('Erro ao buscar eventos:', erroEventos);
          setCarregando(false);
          return;
        }

        let inscricoesUsuario = [];

        if (usuario?.id) {
          const { data: inscricoes, error: erroInscricoes } = await supabase
            .from('inscricoes')
            .select('evento_id, status')
            .eq('usuario_id', usuario.id);

          if (erroInscricoes) {
            console.log('Erro ao buscar inscrições:', erroInscricoes);
          } else {
            inscricoesUsuario = inscricoes;
          }
        }

        const eventosComStatus = await Promise.all(
          listaEventos.map(async (evento) => {
            if (!evento?.id || !evento?.total_vagas) return null;

            const { count: totalConfirmados } = await supabase
              .from('inscricoes')
              .select('*', { count: 'exact', head: true })
              .eq('evento_id', evento.id)
              .eq('status', 'confirmada');

            const inscricao = inscricoesUsuario.find(i => i.evento_id === evento.id);

            let quantidadeComentarios = 0;
            try {
              if (evento.comentarios) {
                const json = JSON.parse(evento.comentarios);
                quantidadeComentarios = Array.isArray(json) ? json.length : 0;
              }
            } catch (e) {
              quantidadeComentarios = 0;
            }

            const { count: quantidadeCurtidas } = await supabase
              .from('curtidas_evento')
              .select('*', { count: 'exact', head: true })
              .eq('evento_id', evento.id);

            const { data: imagens } = await supabase
              .storage
              .from('eventos')
              .list(`eventos/${evento.id}`);

            const quantidadeFotos = imagens?.length || 0;

            return {
              ...evento,
              statusInscricao: inscricao?.status || null,
              vagas_disponiveis: evento.total_vagas - (totalConfirmados || 0),
              quantidadeComentarios,
              quantidadeCurtidas: quantidadeCurtidas || 0,
              quantidadeFotos,
            };
          })
        );

        const eventosFiltrados = eventosComStatus.filter(e => e !== null);

        if (ativo) {
          setEventos(eventosFiltrados);
          setCarregando(false);
        }
      }

      buscarEventos();
    }, [usuario])
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text variant="titleLarge" style={styles.titulo}>Eventos Acadêmicos</Text>

        {carregando && <ActivityIndicator animating style={styles.loading} />}

        {!carregando && eventos.length === 0 ? (
          <Text style={styles.semEventos}>Não há eventos disponíveis no momento.</Text>
        ) : (
          eventos.map((evento) =>
            evento?.id ? (
              <EventoCard
                key={evento.id}
                {...evento}
                onPress={() => navigation.navigate('DetalheEvento', evento)}
              />
            ) : null
          )
        )}
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        label="Novo Evento"
        onPress={() =>
          navigation.navigate('EventosTab', {
            screen: 'CadastroEvento'
          })
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 100,
    backgroundColor: '#f5f5f5',
    flexGrow: 1,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1c9b5e',
    textAlign: 'center',
  },
  loading: {
    marginTop: 20,
  },
  semEventos: {
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
    color: '#888',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});
