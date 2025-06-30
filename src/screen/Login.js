import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { supabase } from '../config/supabase';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useUsuario } from '../contexto/UsuarioContexto';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  const navigation = useNavigation();
  const { setUsuario, setPerfil } = useUsuario();

  // Limpar campos ao focar a tela
  useFocusEffect(
    useCallback(() => {
      setEmail('');
      setSenha('');
    }, [])
  );

  const fazerLogin = async () => {
    setCarregando(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error) {
      console.log('Erro no login:', error);
      Alert.alert('Erro', 'Email ou senha inválidos.');
      setCarregando(false);
      return;
    }

    const user = data.user;

    if (user) {
      const { data: perfilUsuario, error: erroPerfil } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', user.id)
        .single();

      if (erroPerfil) {
        Alert.alert('Erro', 'Não foi possível buscar o perfil do usuário.');
        setCarregando(false);
        return;
      }

      const { data: inscricoesUsuario, error: erroInscricoes } = await supabase
        .from('inscricoes')
        .select('evento_id,status')
        .eq('usuario_id', user.id);

      if (erroInscricoes) {
        Alert.alert('Erro', 'Erro ao buscar inscrições do usuário.');
        setCarregando(false);
        return;
      }

      setUsuario({
        ...user,
        inscricoes: inscricoesUsuario || []
      });

      setPerfil(perfilUsuario);
      navigation.navigate('Home');
    }

    setCarregando(false);
  };

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.titulo}>Entrar</Text>

      <TextInput
        label="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        label="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        style={styles.input}
      />

      <Button
        mode="contained"
        onPress={fazerLogin}
        loading={carregando}
        disabled={carregando}
        style={styles.botao}
      >
        Entrar
      </Button>

      <Button
        mode="text"
        onPress={() => navigation.navigate('Cadastro')}
        style={styles.link}
      >
        Ainda não tenho conta
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#1c9b5e',
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'white',
  },
  botao: {
    marginTop: 8,
    paddingVertical: 6,
  },
  link: {
    marginTop: 12,
    alignSelf: 'center',
  },
});
