import { useState } from 'react';
import { StyleSheet, View, Image, Alert } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { supabase } from '../config/supabase';

export default function Login({ navigation }) {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email.trim() || !senha.trim()) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos');
            return;
        }

        setLoading(true);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: email.trim().toLowerCase(),
                password: senha
            });

            if (error) throw error;
            navigation.navigate('Home');
            
        } catch (error) {
            console.error('Erro no login:', error);
            
            let errorMessage = 'Erro ao fazer login';
            if (error.message.includes('Invalid login credentials')) {
                errorMessage = 'E-mail ou senha incorretos';
            } else if (error.message.includes('Email not confirmed')) {
                errorMessage = 'Confirme seu e-mail antes de fazer login';
            }

            Alert.alert('Erro', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image 
                    source={require('../../assets/logo-iffar.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>
            
            <TextInput
                style={styles.input}
                label="E-mail"
                mode="outlined"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                left={<TextInput.Icon icon="email" />}
            />
            
            <TextInput
                style={styles.input}
                label="Senha"
                mode="outlined"
                secureTextEntry={true}
                value={senha}
                onChangeText={setSenha}
                left={<TextInput.Icon icon="lock" />}
            />
            
            <Button 
                style={styles.botao}
                mode="contained"
                onPress={handleLogin}
                loading={loading}
                disabled={loading}
            >
                {loading ? 'Carregando...' : 'Entrar'}
            </Button>
            
            <Button 
                style={styles.link}
                mode="text"
                onPress={() => navigation.navigate('Cadastro')}
                disabled={loading}
            >
                Ainda não tenho conta
            </Button>

           
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5'
    },
    logoContainer: {
        backgroundColor: 'white',
        padding: 50,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 40,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        width: '50%',
        alignSelf: 'center'
    },
    logo: {
        width: '100%',
        height: 100,
    },
    input: {
        marginVertical: 10,
        backgroundColor: '#fff'
    },
    botao: {
        marginVertical: 20,
        paddingVertical: 5,
        borderRadius: 5
    },
    link: {
        marginTop: 10
    }
});