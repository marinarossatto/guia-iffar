import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity, Image, TextInput, Linking,} from 'react-native';
import { Card, Button, useTheme, Text } from 'react-native-paper';
import { Ionicons, MaterialIcons, AntDesign } from '@expo/vector-icons';
import { useUsuario } from '../contexto/UsuarioContexto';
import { supabase } from '../config/supabase';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DetalheEvento({ route, navigation }) {
  const { colors } = useTheme();
  const { usuario, perfil } = useUsuario();
  const evento = route?.params;

  const [curtidas, setCurtidas] = useState(0);
  const [curtiu, setCurtiu] = useState(false);
  const [mostrarComentarios, setMostrarComentarios] = useState(false);
  const [novoComentario, setNovoComentario] = useState('');
  const [comentarios, setComentarios] = useState([]);
  const [imagensEvento, setImagensEvento] = useState([]);
  const [mostrarImagens, setMostrarImagens] = useState(false);

  useEffect(() => {
    async function buscarCurtidas() {
      const { count } = await supabase
        .from('curtidas_evento')
        .select('*', { count: 'exact', head: true })
        .eq('evento_id', evento.id);
      setCurtidas(count || 0);

      const { data: jaCurtiu } = await supabase
        .from('curtidas_evento')
        .select('id')
        .eq('evento_id', evento.id)
        .eq('usuario_id', usuario.id)
        .maybeSingle();

      setCurtiu(!!jaCurtiu);
    }

    async function buscarImagens() {
      const { data, error } = await supabase.storage
        .from('eventos')
        .list(`eventos/${evento.id}`, { limit: 100 });
      if (!error && data) {
        const urls = await Promise.all(
          data.map(async (img) => {
            const { data: urlData } = supabase.storage
              .from('eventos')
              .getPublicUrl(`eventos/${evento.id}/${img.name}`);
            return urlData.publicUrl;
          })
        );
        setImagensEvento(urls);
      }
    }

    if (evento?.comentarios) {
      try {
        const parsed = JSON.parse(evento.comentarios);
        if (Array.isArray(parsed)) setComentarios(parsed);
      } catch {}
    }

    buscarCurtidas();
    buscarImagens();
  }, [evento]);

  async function alternarCurtida() {
    const { data: curtidaExistente } = await supabase
      .from('curtidas_evento')
      .select('id')
      .eq('evento_id', evento.id)
      .eq('usuario_id', usuario.id)
      .maybeSingle();

    if (curtidaExistente) {
      const { error } = await supabase
        .from('curtidas_evento')
        .delete()
        .eq('id', curtidaExistente.id);

      if (!error) {
        setCurtidas((c) => Math.max(0, c - 1));
        setCurtiu(false);
      }
    } else {
      const { error } = await supabase.from('curtidas_evento').insert({
        evento_id: evento.id,
        usuario_id: usuario.id,
      });

      if (!error) {
        setCurtidas((c) => c + 1);
        setCurtiu(true);
      } else {
        Alert.alert('Erro', 'Não foi possível curtir o evento.');
      }
    }
  }

  async function enviarComentario() {
    if (!novoComentario.trim()) return;

    const nomeUsuario = perfil?.nome || perfil?.usuario || 'Anônimo';
    const idUsuario = usuario?.id || null;

    const novo = {
      nome: nomeUsuario,
      texto: novoComentario.trim(),
      usuario_id: idUsuario,
      data: new Date().toISOString(),
    };

    const atualizado = [...comentarios, novo];

    const { error } = await supabase
      .from('eventos')
      .update({ comentarios: JSON.stringify(atualizado) })
      .eq('id', evento.id);

    if (!error) {
      setComentarios(atualizado);
      setNovoComentario('');
    } else {
      Alert.alert('Erro', 'Não foi possível enviar o comentário.');
    }
  }

  if (!evento || !evento.id) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ fontSize: 18, color: 'red', textAlign: 'center' }}>
          ❌ Erro: dados do evento não foram carregados.
        </Text>
        <Button mode="outlined" onPress={() => navigation.goBack()} style={{ marginTop: 16 }}>
          Voltar
        </Button>
      </SafeAreaView>
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
    statusInscricao,
    foto_url,
    latitude,
    longitude,
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
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Card style={styles.card}>
          <Card.Title title={titulo} titleStyle={{ color: colors.primary, fontWeight: 'bold' }} />
          <Card.Content>
            {foto_url && (
              <TouchableOpacity onPress={() => navigation.navigate('VisualizarImagem', { url: foto_url })}>
                <Image source={{ uri: foto_url }} style={styles.imagem} resizeMode="cover" />
              </TouchableOpacity>
            )}

            <Text style={styles.label}>📅 Data:</Text>
            <Text style={styles.text}>{new Date(data).toLocaleDateString('pt-BR')}</Text>

            <Text style={styles.label}>📍 Local:</Text>
            <Text style={styles.text}>{local}</Text>

            <Text style={styles.label}>📝 Descrição:</Text>
            <Text style={styles.text}>{descricao}</Text>

            {inscricao && total_vagas && (
              <Text style={styles.text}>
                🎫 Vagas disponíveis: {vagas_disponiveis ?? total_vagas} / {total_vagas}
              </Text>
            )}

            {latitude && longitude && (
              <View style={styles.mapaBox}>
                <Text style={styles.mapaTitulo}>📍 Quer saber onde será o evento?</Text>
                <Text style={styles.mapaDescricao}>
                  Toque no botão abaixo para abrir a localização no Google Maps.
                </Text>
                <Button
                  mode="outlined"
                  icon="map-marker"
                  compact
                  style={styles.botaoMapa}
                  labelStyle={{ color: colors.primary, fontSize: 14 }}
                  onPress={() =>
                    Linking.openURL(
                      `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
                    )
                  }
                >
                  Ver no mapa
                </Button>
              </View>
            )}

            {inscricao && !statusInscricao && (
              <Button
                mode="contained"
                style={styles.botaoInscricao}
                onPress={() =>
                  navigation.navigate('Inscricao', {
                    eventoId: id,
                    eventoTitulo: titulo,
                    eventoData: data,
                  })
                }
              >
                Inscrever-se
              </Button>
            )}

            {(statusInscricao === 'confirmada' || statusInscricao === 'espera') && (
              <Button mode="outlined" style={styles.botaoCancelar} onPress={cancelarInscricao}>
                Cancelar inscrição
              </Button>
            )}

            <View style={styles.rodapeIcones}>
              <TouchableOpacity style={styles.iconeComTexto} onPress={alternarCurtida}>
                <View style={styles.iconWrapper}>
                  <AntDesign name={curtiu ? 'heart' : 'hearto'} size={20} color={colors.primary} />
                  <Text style={[styles.sobrescrito, styles.sobrescritoCurtir]}>{curtidas}</Text>
                </View>
                <Text style={[styles.textoIcone, { color: colors.primary }]}>Curtir</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.iconeComTexto} onPress={() => setMostrarComentarios(!mostrarComentarios)}>
                <View style={styles.iconWrapper}>
                  <Ionicons name="chatbubble-ellipses-outline" size={20} color={colors.primary} />
                  <Text style={styles.sobrescrito}>{comentarios.length}</Text>
                </View>
                <Text style={[styles.textoIcone, { color: colors.primary }]}>Comentar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.iconeComTexto} onPress={() => setMostrarImagens(!mostrarImagens)}>
                <View style={styles.iconWrapper}>
                  <MaterialIcons name="photo-library" size={20} color={colors.primary} />
                  <Text style={styles.sobrescrito}>{imagensEvento.length}</Text>
                </View>
                <Text style={[styles.textoIcone, { color: colors.primary }]}>Imagens</Text>
              </TouchableOpacity>
            </View>

            {mostrarComentarios && (
              <View style={{ marginTop: 16 }}>
                {comentarios.map((c, i) => (
                  <View key={i} style={{ marginBottom: 8 }}>
                    <Text style={{ fontWeight: 'bold', marginBottom: 2 }}>{c.nome}</Text>
                    <Text>{c.texto}</Text>
                    {c.data && (
                      <Text style={{ fontSize: 12, color: '#888' }}>
                        {new Date(c.data).toLocaleString('pt-BR')}
                      </Text>
                    )}
                  </View>
                ))}
                <TextInput
                  placeholder="Escreva um comentário"
                  value={novoComentario}
                  onChangeText={setNovoComentario}
                  style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    padding: 8,
                    borderRadius: 4,
                    marginTop: 8,
                  }}
                />
                <Button onPress={enviarComentario} style={{ marginTop: 8 }}>
                  Enviar
                </Button>
              </View>
            )}

            {mostrarImagens && (
              <View style={{ marginTop: 16 }}>
                {imagensEvento.map((url, idx) => (
                  <Image
                    key={idx}
                    source={{ uri: url }}
                    style={{ width: '100%', height: 200, borderRadius: 8, marginBottom: 16 }}
                    resizeMode="cover"
                  />
                ))}
              </View>
            )}
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 120,
    flexGrow: 1,
  },
  card: {
    marginBottom: 16,
  },
  imagem: {
    width: '100%',
    height: 200,
    borderRadius: 8,
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
  mapaBox: {
    padding: 5,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginTop: 10,
  },
  mapaTitulo: {
    fontWeight: 'bold',
    marginBottom: 6,
    fontSize: 16,
  },
  mapaDescricao: {
    marginBottom: 8,
    fontSize: 14,
    color: '#333',
  },
  botaoMapa: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderColor: '#1c9b5e',
  },
  botaoInscricao: {
    marginTop: 20,
  },
  botaoCancelar: {
    marginTop: 16,
  },
  rodapeIcones: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 24,
    marginTop: 24,
  },
  iconeComTexto: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
  },
  iconWrapper: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sobrescrito: {
    position: 'absolute',
    top: -6,
    right: -10,
    fontSize: 10,
    color: 'red',
    fontWeight: 'bold',
  },
  sobrescritoCurtir: {
    top: -8,
    right: -12,
  },
  textoIcone: {
    fontSize: 14,
    marginTop: 2,
  },
});
