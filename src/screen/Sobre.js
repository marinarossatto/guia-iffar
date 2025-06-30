import { Linking, StyleSheet, ScrollView, Alert } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Sobre({ navigation }) {
  const { colors } = useTheme();

  const abrirSite = async () => {
    const url = 'https://www.iffarroupilha.edu.br/portal';
    const suportado = await Linking.canOpenURL(url);
    if (suportado) {
      Linking.openURL(url);
    } else {
      Alert.alert('Erro', 'Não foi possível abrir o link.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.titulo, { color: colors.primary }]}>
          Sobre o app
        </Text>

        <Text style={[styles.texto, { color: colors.onSurface }]}>
          Este aplicativo é um projeto acadêmico do curso de Sistemas para
          Internet do IFFar - Campus Panambi. Seu objetivo é auxiliar alunos e a
          comunidade com informações úteis sobre cursos e eventos institucionais.
        </Text>

        <Button
          mode="contained"
          style={styles.botao}
          labelStyle={{ color: 'white' }}
          onPress={abrirSite}
        >
          Acessar o site do Campus
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#F4F4F4',
  },
  titulo: {
    fontSize: 26,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  texto: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 30,
  },
  botao: {
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
  },
});
