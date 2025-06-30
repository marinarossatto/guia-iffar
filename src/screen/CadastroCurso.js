import React, { useState } from 'react';
import { ScrollView, StyleSheet, Alert, View } from 'react-native';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';
import { useUsuario } from '../contexto/UsuarioContexto';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../config/supabase';
import * as DocumentPicker from 'expo-document-picker';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CadastroCurso() {
  const { perfil } = useUsuario();
  const navigation = useNavigation();
  const { colors } = useTheme();

  const [nome, setNome] = useState('');
  const [modalidade, setModalidade] = useState('');
  const [nivel, setNivel] = useState('');
  const [turno, setTurno] = useState('');
  const [unidade, setUnidade] = useState('');
  const [duracao, setDuracao] = useState('');
  const [descricao, setDescricao] = useState('');
  const [arquivoUrl, setArquivoUrl] = useState(null);

  if (perfil?.tipo !== 'admin') {
    return (
      <View style={styles.bloqueado}>
        <Text variant="titleLarge" style={{ marginBottom: 10 }}>⛔ Acesso restrito</Text>
        <Text>Esta funcionalidade é exclusiva para administradores.</Text>
      </View>
    );
  }

  const selecionarArquivo = async () => {
    try {
      const resultado = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (resultado.assets && resultado.assets.length > 0) {
        const { uri, name, mimeType } = resultado.assets[0];
        const nomeArquivo = `cursos/${Date.now()}_${name}`;

        const arquivo = {
          uri,
          name,
          type: mimeType || 'application/pdf',
        };

        const { error } = await supabase
          .storage
          .from('cursos')
          .upload(nomeArquivo, arquivo);

        if (error) {
          Alert.alert('Erro', 'Falha ao enviar o PDF.');
          console.error(error);
        } else {
          const { data: { publicUrl } } = supabase
            .storage
            .from('cursos')
            .getPublicUrl(nomeArquivo);

          setArquivoUrl(publicUrl);
          Alert.alert('PDF enviado com sucesso!');
        }
      }
    } catch (error) {
      console.error('Erro ao selecionar PDF:', error);
      Alert.alert('Erro', 'Não foi possível selecionar o arquivo.');
    }
  };

  const salvarCurso = async () => {
    if (!nome || !modalidade || !nivel || !turno || !unidade || !duracao) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
      return;
    }

    const { error } = await supabase.from('cursos').insert([
      {
        nome,
        modalidade,
        nivel,
        turno,
        unidade,
        duracao,
        descricao,
        pdf_url: arquivoUrl ?? null,
      }
    ]);

    if (error) {
      Alert.alert('Erro ao salvar', error.message);
    } else {
      Alert.alert('Sucesso', 'Curso cadastrado!');
      navigation.navigate('CursosTab', { screen: 'Cursos' });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text variant="titleLarge" style={styles.titulo}>Cadastrar Curso</Text>

        <TextInput label="Nome do curso" value={nome} onChangeText={setNome} style={styles.input} />
        <TextInput label="Modalidade" value={modalidade} onChangeText={setModalidade} style={styles.input} />
        <TextInput label="Nível" value={nivel} onChangeText={setNivel} style={styles.input} />
        <TextInput label="Turno" value={turno} onChangeText={setTurno} style={styles.input} />
        <TextInput label="Unidade" value={unidade} onChangeText={setUnidade} style={styles.input} />
        <TextInput label="Duração" value={duracao} onChangeText={setDuracao} style={styles.input} />
        <TextInput label="Descrição" value={descricao} onChangeText={setDescricao} multiline style={styles.input} />

        <Button mode="outlined" onPress={selecionarArquivo} icon="file-pdf-box"  style={styles.botaoPDF}>
          Anexar PDF do curso
        </Button>

        {arquivoUrl && (
          <Text style={[styles.sucesso, { color: colors.primary }]}>
            📎 PDF anexado com sucesso!
          </Text>
        )}

        <Button mode="contained" onPress={salvarCurso} style={styles.botaoSalvar}>
          Salvar Curso
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1c9b5e',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 12,
  },
  botaoPDF: {
    marginTop: 12,
  },
  sucesso: {
    marginTop: 10,
    fontSize: 14,
  },
  botaoSalvar: {
    marginTop: 24,
    paddingVertical: 6,
  },
  bloqueado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
});
