import { Linking, StyleSheet, View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";

export default function Sobre({ navigation }) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.titulo, { color: colors.primary }]}>
        Sobre o app
      </Text>

      <Text style={[styles.texto, { color: colors.text }]}>
        Este aplicativo é um projeto acadêmico do curso de Sistemas para
        Internet do IFFar - Campus Panambi. Seu objetivo é auxiliar alunos e a
        comunidade com informações úteis sobre cursos e eventos institucionais.
      </Text>

      <Button
        mode="contained"
        style={styles.botao}
        labelStyle={{ color: 'white' }}
        onPress={() =>
          Linking.openURL('https://www.iffarroupilha.edu.br/portal')
        }
      >
        Acessar o site do Campus
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
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
