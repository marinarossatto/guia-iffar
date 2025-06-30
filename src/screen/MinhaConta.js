import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Image, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Text, Button, TextInput, ActivityIndicator, Divider } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useUsuario } from '../contexto/UsuarioContexto';
import { supabase } from '../config/supabase';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

export default function MinhaConta() {
  const { usuario, perfil, setPerfil } = useUsuario();

  const [novaFoto, setNovaFoto] = useState(null);
  const [novaSenha, setNovaSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [novoEmail, setNovoEmail] = useState(usuario?.email || '');

  const [eventos, setEventos] = useState([]);
  const [carregandoEventos, setCarregandoEventos] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useFocusEffect(
    useCallback(() => {
      async function buscarEventos() {
        setCarregandoEventos(true);
        const { data: inscricoes } = await supabase
          .from('inscricoes')
          .select('evento_id')
          .eq('usuario_id', usuario.id);

        if (inscricoes && inscricoes.length > 0) {
          const ids = inscricoes.map(i => i.evento_id);
          const { data: eventos } = await supabase
            .from('eventos')
            .select('*')
            .in('id', ids);

          setEventos(eventos || []);
        } else {
          setEventos([]);
        }

        setCarregandoEventos(false);
      }

      buscarEventos();
    }, [usuario.id])
  );

  const escolherImagem = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada');
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 0.7 });
    if (!resultado.canceled) {
      setNovaFoto(resultado.assets[0].uri);
    }
  };

  const salvarAlteracoes = async () => {
    setSalvando(true);
    try {
      if (novoEmail.trim().toLowerCase() !== usuario.email) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(novoEmail.trim())) {
          Alert.alert('Erro', 'E-mail inválido.');
          setSalvando(false);
          return;
        }

        const { error: erroEmail } = await supabase.auth.updateUser({ email: novoEmail.trim() });
        if (erroEmail) throw erroEmail;
        Alert.alert('E-mail atualizado');
      }

      if (novaSenha.trim()) {
        const { error: erroSenha } = await supabase.auth.updateUser({ password: novaSenha });
        if (erroSenha) throw erroSenha;
      }

      if (novaFoto) {
        const nomeImagem = `usuarios/foto_${usuario.id}_${Date.now()}.jpg`;
        const arquivo = {
          uri: novaFoto,
          name: nomeImagem.split('/').pop(),
          type: 'image/jpeg',
        };

        const { error: erroUpload } = await supabase.storage
          .from('usuarios')
          .upload(nomeImagem, arquivo, {
            contentType: 'image/jpeg',
            upsert: true,
          });

        if (erroUpload) throw erroUpload;

        const { data } = supabase.storage.from('usuarios').getPublicUrl(nomeImagem);
        const urlFoto = data.publicUrl;

        const { error: erroUpdate } = await supabase
          .from('usuarios')
          .update({ foto_url: urlFoto })
          .eq('id', usuario.id);

        if (erroUpdate) throw erroUpdate;

        setPerfil(prev => ({ ...prev, foto_url: urlFoto }));
      }

      Alert.alert('Sucesso', 'Alterações salvas com sucesso!');
    } catch (err) {
      Alert.alert('Erro', err.message || 'Não foi possível salvar as alterações.');
    } finally {
      setSalvando(false);
      setNovaSenha('');
      setNovaFoto(null);
    }
  };

  if (!usuario?.id) {
    return (
      <View style={styles.bloqueado}>
        <Text variant="titleLarge" style={{ marginBottom: 12 }}>⛔ Acesso restrito</Text>
        <Text>Você precisa estar logado para acessar esta página.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.titulo}>Meu Perfil</Text>

        <TouchableOpacity style={styles.fotoWrapper} onPress={escolherImagem}>
          {novaFoto || perfil?.foto_url ? (
            <Image source={{ uri: novaFoto || perfil.foto_url }} style={styles.foto} />
          ) : (
            <View style={[styles.foto, styles.fotoVazia]}>
              <Ionicons name="camera" size={32} color="#888" />
            </View>
          )}
          <Text style={styles.fotoTexto}>Alterar Foto</Text>
        </TouchableOpacity>

        <Text style={styles.info}><Text style={styles.label}>Nome:</Text> {perfil?.nome}</Text>

        <TextInput
          label="E-mail"
          value={novoEmail}
          onChangeText={setNovoEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
          mode="outlined"
        />

        <TextInput
          label="Nova Senha"
          value={novaSenha}
          onChangeText={setNovaSenha}
          secureTextEntry={!mostrarSenha}
          style={styles.input}
          mode="outlined"
          right={
            <TextInput.Icon
              icon={mostrarSenha ? "eye-off" : "eye"}
              onPress={() => setMostrarSenha(prev => !prev)}
            />
          }
        />

        <Button
          mode="contained"
          loading={salvando}
          onPress={salvarAlteracoes}
          style={styles.botaoSalvar}
          icon="content-save"
        >
          Salvar Alterações
        </Button>

        <Divider style={{ marginVertical: 30 }} />

        <Text style={styles.titulo}>Meus Eventos</Text>

        {carregandoEventos ? (
          <ActivityIndicator animating size="large" style={{ marginTop: 20 }} />
        ) : eventos.length > 0 ? (
          eventos.map((ev, idx) => (
            <View key={idx} style={styles.eventoCardDecorado}>
              <Text style={styles.eventoTitulo}>🎓 {ev.titulo}</Text>
              <Text style={styles.eventoInfo}>📍 {ev.local}</Text>
              <Text style={styles.eventoInfo}>📅 {new Date(ev.data).toLocaleDateString('pt-BR')}</Text>
            </View>
          ))
        ) : (
          <Text style={{ marginTop: 10, textAlign: 'center', color: '#555' }}>
            Você ainda não participou de eventos.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
    paddingBottom: 50,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1c9b5e',
    textAlign: 'center',
  },
  fotoWrapper: {
    alignItems: 'center',
    marginBottom: 20,
  },
  foto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#1c9b5e',
  },
  fotoVazia: {
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fotoTexto: {
    marginTop: 8,
    color: '#1c9b5e',
    fontWeight: '600',
  },
  input: {
    marginBottom: 12,
  },
  info: {
    fontSize: 16,
    marginBottom: 12,
    color: '#34495e',
  },
  label: {
    fontWeight: 'bold',
    color: '#1c9b5e',
  },
  botaoSalvar: {
    marginTop: 8,
  },
  eventoCardDecorado: {
    backgroundColor: '#e9f8f1',
    borderLeftWidth: 5,
    borderLeftColor: '#1c9b5e',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
  },
  eventoTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#14532d',
    marginBottom: 4,
  },
  eventoInfo: {
    fontSize: 14,
    color: '#444',
  },
  bloqueado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
});
