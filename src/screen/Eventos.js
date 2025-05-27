import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Text, ActivityIndicator, FAB } from 'react-native-paper';
import EventoCard from '../componentes/EventoCard';
import { supabase } from '../config/supabase';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { useUsuario } from '../contexto/UsuarioContexto';

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

            const { count: totalConfirmados, error: erroContagem } = await supabase
              .from('inscricoes')
              .select('*', { count: 'exact', head: true })
              .eq('evento_id', evento.id)
              .eq('status', 'confirmada');

            const inscricao = inscricoesUsuario.find(i => i.evento_id === evento.id);

            return {
              ...evento,
              statusInscricao: inscricao?.status || null,
              vagas_disponiveis: evento.total_vagas - (totalConfirmados || 0),
            };
          })
        );

        const eventosFiltrados = eventosComStatus.filter(e => e !== null);

        console.log('🧪 Eventos carregados:', eventosFiltrados);

        if (ativo) {
          setEventos(eventosFiltrados);
          setCarregando(false);
        }
      }

      buscarEventos();

      return () => {
        ativo = false;
      };
    }, [usuario])
  );

  return (
    <>
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
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 100,
  },
  titulo: {
    marginBottom: 16,
    fontSize: 22,
    fontWeight: 'bold',
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
