import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, StyleSheet, Alert, View, Image } from 'react-native';
import { TextInput, Button, Text, Switch } from 'react-native-paper';
import { useUsuario } from '../contexto/UsuarioContexto';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { supabase } from '../config/supabase';
import * as ImagePicker from 'expo-image-picker';

export default function CadastroEvento() {
  const { perfil } = useUsuario();
  const navigation = useNavigation();
  const route = useRoute();

  const [titulo, setTitulo] = useState('');
  const [dataEvento, setDataEvento] = useState('');
  const [local, setLocal] = useState('');
  const [descricao, setDescricao] = useState('');
  const [inscricao, setInscricao] = useState(true);
  const [total_vagas, setTotal_vagas] = useState('');
  const [imagensLocal, setImagensLocal] = useState([]);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const p = route.params;
      if (!p?.voltouDoMapa) return;

      if ('titulo' in p) setTitulo(p.titulo);
      if ('dataEvento' in p) setDataEvento(p.dataEvento);
      if ('local' in p) setLocal(p.local);
      if ('descricao' in p) setDescricao(p.descricao);
      if ('total_vagas' in p) setTotal_vagas(p.total_vagas);
      if ('inscricao' in p) setInscricao(p.inscricao);
      if ('imagensLocal' in p) setImagensLocal(p.imagensLocal);
      if ('latitude' in p) setLatitude(p.latitude);
      if ('longitude' in p) setLongitude(p.longitude);
    }, [route.params])
  );

  const handleDataChange = (text) => {
    let digits = text.replace(/\D/g, '');
    if (digits.length > 8) digits = digits.slice(0, 8);
    let formatted = digits;
    if (digits.length > 2 && digits.length <= 4) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    } else if (digits.length > 4) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
    }
    setDataEvento(formatted);
  };

  const tirarFoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão da câmera negada...');
      return;
    }
    const resultado = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [4, 3], quality: 0.7 });
    if (!resultado.canceled) {
      const imagem = resultado.assets[0];
      setImagensLocal(prev => [...prev, imagem.uri]);
    }
  };

  const escolherDaGaleria = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada...');
      return;
    }
    const resultado = await ImagePicker.launchImageLibraryAsync({ allowsMultipleSelection: true, allowsEditing: true, aspect: [4, 3], quality: 0.7 });
    if (!resultado.canceled) {
      const novasImagens = resultado.assets.map(a => a.uri);
      setImagensLocal(prev => [...prev, ...novasImagens]);
    }
  };

  const selecionarImagem = () => {
    Alert.alert('Adicionar Imagem', 'Escolha a origem da imagem:', [
      { text: 'Câmera', onPress: tirarFoto },
      { text: 'Galeria', onPress: escolherDaGaleria },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  if (perfil?.tipo !== 'admin') {
    return (
      <View style={styles.bloqueado}>
        <Text variant="titleLarge">⛔ Acesso restrito</Text>
        <Text>Esta funcionalidade é exclusiva para administradores.</Text>
      </View>
    );
  }

  const salvarEvento = async () => {
    if (!titulo.trim() || !local.trim()) {
      Alert.alert('Erro', 'Preencha os campos obrigatórios.');
      return;
    }

    if (inscricao && (!total_vagas || isNaN(total_vagas) || parseInt(total_vagas) <= 0)) {
      Alert.alert('Erro', 'Informe um número válido de vagas.');
      return;
    }

    if (!latitude || !longitude) {
      Alert.alert('Erro', 'Selecione a localização do evento no mapa.');
      return;
    }

    const parts = dataEvento.split('/');
    let [dia, mes, ano] = parts;
    if (parts.length === 3) {
      if (ano.length === 2) ano = '20' + ano;
    } else {
      Alert.alert('Erro', 'Digite a data corretamente');
      return;
    }

    const dataObj = new Date(`${ano}-${mes}-${dia}T00:00:00`);
    if (isNaN(dataObj.getTime())) {
      Alert.alert('Erro', 'Data inválida.');
      return;
    }

    const evento = {
      titulo: titulo.trim(),
      data: dataObj,
      local: local.trim(),
      descricao: descricao.trim(),
      inscricao,
      total_vagas: inscricao ? parseInt(total_vagas) : null,
      foto_url: imagensLocal[0] || null,
      latitude,
      longitude
    };

    const { data: eventoCriado, error } = await supabase.from('eventos').insert([evento]).select().single();
    if (error || !eventoCriado) {
      console.error('❌ Erro Supabase:', error);
      Alert.alert('Erro ao salvar', error.message);
      return;
    }

    const eventoId = eventoCriado.id;

    for (let i = 0; i < imagensLocal.length; i++) {
      const uri = imagensLocal[i];
      const nomeImagem = `eventos/${eventoId}/imagem_${Date.now()}_${i}.jpg`;
      const arquivo = { uri, name: nomeImagem, type: 'image/jpeg' };
      const { error: uploadError } = await supabase.storage.from('eventos').upload(nomeImagem, arquivo);
      if (uploadError) {
        console.error('Erro ao enviar imagem:', uploadError);
      }
    }

    Alert.alert('Sucesso', 'Evento cadastrado!');
    setTitulo('');
    setDataEvento('');
    setLocal('');
    setDescricao('');
    setTotal_vagas('');
    setInscricao(true);
    setImagensLocal([]);
    setLatitude(null);
    setLongitude(null);
    navigation.navigate('EventosTab', { screen: 'EventosLista' });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="titleLarge" style={styles.titulo}>Novo Evento</Text>

      <TextInput label="Título" value={titulo} onChangeText={setTitulo} style={styles.input} />
      <TextInput label="Data" value={dataEvento} onChangeText={handleDataChange} placeholder="Ex: 090625 ou 09062025" keyboardType="numeric" style={styles.input} />
      <TextInput label="Local" value={local} onChangeText={setLocal} style={styles.input} />
      <TextInput label="Descrição" value={descricao} onChangeText={setDescricao} multiline style={styles.input} />
      <TextInput label="Quantidade de vagas" value={total_vagas} onChangeText={setTotal_vagas} keyboardType="numeric" style={styles.input} />

      <View style={styles.switchContainer}>
        <Text>Inscrição aberta?</Text>
        <Switch value={inscricao} onValueChange={setInscricao} />
      </View>

      <Button
        mode="outlined"
        onPress={() =>
          navigation.navigate('SelecionarLocalizacao', {
            voltarPara: 'CadastroEvento',
            dadosAnteriores: {
              titulo,
              dataEvento,
              local,
              descricao,
              total_vagas,
              inscricao,
              imagensLocal,
              latitude,
              longitude,
            }
          })
        }
        style={{ marginTop: 20 }}
      >
        Selecionar Localização no Mapa
      </Button>

      {latitude && longitude && (
        <Text style={{ marginTop: 8 }}>
          📍 Coordenadas: {latitude.toFixed(6)}, {longitude.toFixed(6)}
        </Text>
      )}

      <Button mode="outlined" onPress={selecionarImagem} style={{ marginTop: 20 }}>
        Adicionar Imagens
      </Button>

      <ScrollView horizontal style={{ marginTop: 10 }}>
        {imagensLocal.map((uri, idx) => (
          <Image
            key={idx}
            source={{ uri }}
            style={{ width: 100, height: 100, borderRadius: 10, marginRight: 8 }}
          />
        ))}
      </ScrollView>

      <Button mode="contained" onPress={salvarEvento} style={{ marginTop: 20 }}>
        Salvar Evento
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24 },
  titulo: { marginBottom: 16 },
  input: { marginBottom: 12 },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  bloqueado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
});
