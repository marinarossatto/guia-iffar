import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { TextInput, Button, Text, RadioButton } from 'react-native-paper';
import { supabase } from '../config/supabase';
import { useNavigation } from '@react-navigation/native';

export default function CadastroEvento() {
  const navigation = useNavigation();

  const [titulo, setTitulo] = useState('');
  const [data, setData] = useState('');
  const [local, setLocal] = useState('');
  const [descricao, setDescricao] = useState('');
  const [inscricao, setInscricao] = useState('aberta');
  const [carregando, setCarregando] = useState(false);

  const salvarEvento = async () => {
    if (!titulo || !data || !local || !descricao) {
      alert('Preencha todos os campos');
      return;
    }

    setCarregando(true);

    const { error } = await supabase.from('eventos').insert({
      titulo,
      data,
      local,
      descricao,
      inscricao
    });

    setCarregando(false);

    if (error) {
      console.error(error);
      alert('Erro ao salvar evento');
    } else {
      alert('Evento cadastrado com sucesso');
      navigation.navigate('Eventos');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="titleLarge" style={styles.titulo}>Novo Evento</Text>

      <TextInput
        label="Título"
        value={titulo}
        onChangeText={setTitulo}
        style={styles.input}
      />
      <TextInput
        label="Data"
        value={data}
        onChangeText={setData}
        style={styles.input}
        placeholder="DD/MM/AAAA"
      />
      <TextInput
        label="Local"
        value={local}
        onChangeText={setLocal}
        style={styles.input}
      />
      <TextInput
        label="Descrição"
        value={descricao}
        onChangeText={setDescricao}
        multiline
        style={styles.input}
      />

      <View style={styles.radioGroup}>
        <Text>Inscrições:</Text>
        <RadioButton.Group onValueChange={setInscricao} value={inscricao}>
          <View style={styles.radioItem}>
            <RadioButton value="aberta" />
            <Text>Abertas</Text>
          </View>
          <View style={styles.radioItem}>
            <RadioButton value="encerrada" />
            <Text>Encerradas</Text>
          </View>
        </RadioButton.Group>
      </View>

      <Button
        mode="contained"
        onPress={salvarEvento}
        loading={carregando}
        style={styles.botao}
      >
        Salvar Evento
      </Button>

      <Button
        mode="outlined"
        onPress={() => navigation.goBack()}
        style={styles.botao}
      >
        Cancelar
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  titulo: {
    marginBottom: 20,
    textAlign: 'center'
  },
  input: {
    marginBottom: 16
  },
  botao: {
    marginTop: 10
  },
  radioGroup: {
    marginBottom: 16
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center'
  }
});
