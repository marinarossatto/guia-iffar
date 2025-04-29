import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../config/supabase';

export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  const navigation = useNavigation();

  const handleCadastro = async () => {
    const nomeTrimmed = nome.trim();
    const emailTrimmed = email.trim().toLowerCase();

  
    if (!nomeTrimmed) {
      Alert.alert('Erro', 'Por favor, informe seu nome');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
      Alert.alert('Erro', 'Por favor, insira um e-mail válido');
      return;
    }

    if (senha.length < 6) {
      Alert.alert('Erro', 'A senha deve ter no mínimo 6 caracteres');
      return;
    }

    setCarregando(true);

    try {
     
      const { data: { user }, error: authError } = await supabase.auth.signUp({
        email: emailTrimmed,
        password: senha,
        options: {
          data: {
            nome: nomeTrimmed,
            tipo: 'aluno'
          }
        }
      });

      if (authError) throw authError;

      
      const { error: dbError } = await supabase
        .from('usuarios')
        .insert({
          id: user.id,        
          nome: nomeTrimmed,  
          tipo: 'aluno'       
        });

      if (dbError) {
        console.error('Erro ao inserir na tabela usuarios:', dbError);
        throw new Error('Erro ao salvar dados do usuário');
      }

    
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: emailTrimmed,
        password: senha
      });

      if (loginError) throw loginError;

      Alert.alert(
        'Cadastro realizado!', 
        'Conta criada com sucesso. Faça login para continuar.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );

    } catch (error) {
      console.error('Erro completo:', error);
      
      let mensagem = 'Erro ao cadastrar';
      if (error.message.includes('already registered')) {
        mensagem = 'Este e-mail já está cadastrado';
      } else if (error.message.includes('users')) {
        mensagem = 'Erro no sistema de autenticação';
      } 

      Alert.alert('Erro', mensagem);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.titulo}>
        Cadastro
      </Text>

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5'
  },
  titulo: {
    marginBottom: 32,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#2c3e50'
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'white'
  },
  botao: {
    marginTop: 8,
    paddingVertical: 6
  },
  botaoSecundario: {
    marginTop: 16
  }
});