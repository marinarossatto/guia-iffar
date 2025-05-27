import React, { useState } from 'react';
import { ScrollView, StyleSheet, Alert, View, Image, Platform } from 'react-native';
import { TextInput, Button, Text, Switch } from 'react-native-paper';
import { useUsuario } from '../contexto/UsuarioContexto';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../config/supabase';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system'; // ✅ IMPORTANTE

export default function CadastroEvento() {
  const { perfil } = useUsuario();
  const navigation = useNavigation();

  const [titulo, setTitulo] = useState('');
  const [dataEvento, setDataEvento] = useState('');
  const [local, setLocal] = useState('');
  const [descricao, setDescricao] = useState('');
  const [inscricao, setInscricao] = useState(true);
  const [total_vagas, setTotal_vagas] = useState('');

  const [fotoEventoUrl, setFotoEventoUrl] = useState(null);
  const [fotoLocal, setFotoLocal] = useState(null);
  const [carregandoFoto, setCarregandoFoto] = useState(false);

  if (perfil?.tipo !== 'admin') {
    return (
      <View style={styles.bloqueado}>
        <Text variant="titleLarge">⛔ Acesso restrito</Text>
        <Text>Esta funcionalidade é exclusiva para administradores.</Text>
      </View>
    );
  }

  const uploadFoto = async (uri) => {
    setCarregandoFoto(true);
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const byteArray = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
      const blob = new Blob([byteArray], { type: 'image/jpeg' });

      const nomeImagem = `evento_${Date.now()}.jpg`;

      const { error } = await supabase.storage.from('eventos').upload(nomeImagem, blob, {
        contentType: 'image/jpeg',
        upsert: true,
      });

      if (error) {
        console.error("Erro ao enviar imagem:", error);
        Alert.alert('Erro ao enviar imagem', error.message);
      } else {
        const { data: { publicUrl } } = supabase.storage.from('eventos').getPublicUrl(nomeImagem);
        setFotoEventoUrl(publicUrl);
        console.log("Imagem enviada:", publicUrl);
      }
    } catch (err) {
      console.error("Erro geral no envio da imagem:", err);
      Alert.alert('Erro', 'Erro no envio da imagem.');
    } finally {
      setCarregandoFoto(false);
    }
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
      setFotoLocal(imagem.uri);
      await uploadFoto(imagem.uri);
    }
  };

  const escolherDaGaleria = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada...');
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [4, 3], quality: 0.7 });

    if (!resultado.canceled) {
      const imagem = resultado.assets[0];
      setFotoLocal(imagem.uri);
      await uploadFoto(imagem.uri);
    }
  };

  const selecionarImagem = () => {
    Alert.alert('Adicionar Imagem', 'Escolha a origem da imagem:', [
      { text: 'Câmera', onPress: tirarFoto },
      { text: 'Galeria', onPress: escolherDaGaleria },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  const salvarEvento = async () => {
    try {
      if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dataEvento)) {
        Alert.alert('Erro', 'A data deve estar no formato dd/mm/aaaa.');
        return;
      }

      const [dia, mes, ano] = dataEvento.split('/');
      const dataFormatada = `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;

      if (isNaN(new Date(dataFormatada).getTime())) {
        Alert.alert('Erro', 'Data inválida.');
        return;
      }

      if (!titulo || !local) {
        Alert.alert('Erro', 'Preencha os campos obrigatórios.');
        return;
      }

      if (inscricao && (!total_vagas || isNaN(total_vagas) || parseInt(total_vagas) <= 0)) {
        Alert.alert('Erro', 'Informe um número válido de vagas.');
        return;
      }

      const { error } = await supabase.from('eventos').insert([{
        titulo,
        data: dataFormatada,
        local,
        descricao,
        inscricao,
        total_vagas: parseInt(total_vagas),
        foto_url: fotoEventoUrl,
      }]);

      if (error) {
        Alert.alert('Erro ao salvar', error.message);
      } else {
        Alert.alert('Sucesso', 'Evento cadastrado!');
        setTitulo('');
        setDataEvento('');
        setLocal('');
        setDescricao('');
        setTotal_vagas('');
        setInscricao(true);
        navigation.navigate('EventosTab', { screen: 'EventosLista' });
      }
    } catch (error) {
      Alert.alert('Erro', 'Problema ao processar a data.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="titleLarge" style={styles.titulo}>Novo Evento</Text>

      <TextInput label="Título" value={titulo} onChangeText={setTitulo} style={styles.input} />
      <TextInput label="Data (dd/mm/aaaa)" value={dataEvento} onChangeText={setDataEvento} style={styles.input} />
      <TextInput label="Local" value={local} onChangeText={setLocal} style={styles.input} />
      <TextInput label="Descrição" value={descricao} onChangeText={setDescricao} multiline style={styles.input} />
      <TextInput label="Quantidade de vagas" value={total_vagas} onChangeText={setTotal_vagas} keyboardType="numeric" style={styles.input} />

      <View style={styles.switchContainer}>
        <Text>Inscrição aberta?</Text>
        <Switch value={inscricao} onValueChange={setInscricao} />
      </View>

      <Button mode="outlined" onPress={selecionarImagem} style={{ marginTop: 20 }}>Adicionar Imagem do Evento</Button>

      {Platform.OS === 'web' && (
        <input
          type="file"
          accept="image/*"
          onChange={(event) => {
            const file = event.target.files[0];
            if (file) {
              const uri = URL.createObjectURL(file);
              setFotoLocal(uri);
              uploadFoto(uri);
            }
          }}
        />
      )}

      {fotoLocal && <Image source={{ uri: fotoLocal }} style={{ width: 200, height: 200, marginTop: 10, borderRadius: 10 }} />}
      <Button mode="contained" onPress={salvarEvento} style={{ marginTop: 20 }}>Salvar Evento</Button>
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
