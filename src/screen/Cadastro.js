import React, { useState, useCallback } from 'react';
import { StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { supabase } from '../config/supabase';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      setNome('');
      setEmail('');
      setSenha('');
    }, [])
  );

  const handleCadastro = async () => {
    const nomeTrimmed = nome.trim();
    const emailTrimmed = email.trim().toLowerCase();

    if (!nomeTrimmed) {
      return alert('Por favor, informe seu nome');
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
      return alert('Por favor, insira um e-mail válido');
    }

    if (senha.length < 6) {
      return alert('A senha deve ter no mínimo 6 caracteres');
    }

    setCarregando(true);

    try {
      const { data: { user }, error: authError } = await supabase.auth.signUp({
        email: emailTrimmed,
        password: senha,
        options: { data: { nome: nomeTrimmed, tipo: 'aluno' } }
      });

      if (authError) throw authError;

      const { error: dbError } = await supabase
        .from('usuarios')
        .insert({ id: user.id, nome: nomeTrimmed, tipo: 'aluno' });

      if (dbError) throw dbError;

      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: emailTrimmed,
        password: senha
      });

      if (loginError) throw loginError;

      alert('Conta criada com sucesso!');
      navigation.navigate('Login');

    } catch (error) {
      console.error(error);
      const mensagem =
        error?.message?.includes('already registered') ? 'Este e-mail já está cadastrado' :
        error?.message?.includes('users') ? 'Erro no sistema de autenticação' :
        'Erro ao cadastrar';

      alert(mensagem);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
        <Text variant="headlineMedium" style={styles.titulo}>Cadastro</Text>

        <TextInput
          label="Nome completo"
          value={nome}
          onChangeText={setNome}
          mode="outlined"
          style={styles.input}
          left={<TextInput.Icon icon="account" />}
        />

        <TextInput
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          mode="outlined"
          style={styles.input}
          left={<TextInput.Icon icon="email" />}
        />

        <TextInput
          label="Senha (mínimo 6 caracteres)"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          mode="outlined"
          style={styles.input}
          left={<TextInput.Icon icon="lock" />}
        />

        <Button
          mode="contained"
          onPress={handleCadastro}
          loading={carregando}
          disabled={carregando}
          style={styles.botao}
          icon="account-plus"
        >
          {carregando ? 'Cadastrando...' : 'Criar Conta'}
        </Button>

        <Button
          mode="text"
          onPress={() => navigation.navigate('Login')}
          style={styles.botaoSecundario}
        >
          Já possui uma conta? Faça login
        </Button>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  titulo: {
    marginBottom: 32,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#1c9b5e',
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'white',
  },
  botao: {
    marginTop: 8,
    paddingVertical: 6,
  },
  botaoSecundario: {
    marginTop: 16,
    alignSelf: 'center',
  },
});
