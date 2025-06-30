import React from "react";
import { ScrollView, StyleSheet, View, Alert, Linking  } from "react-native";
import { Card, Divider, Text, Button, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';


export default function DetalheCurso({ route }) {
  const {
    nome,
    modalidade,
    nivel,
    unidade,
    duracao,
    turno,
    descricao,
    pdf_url, 
  } = route.params;

  const theme = useTheme();

  const mostrar = (valor, fallback = 'Não informado') =>
    typeof valor === 'string' && valor.trim() !== '' ? valor : fallback;

  const visualizarPDF = async () => {
    if (!pdf_url) {
      Alert.alert("Erro", "Nenhum PDF disponível.");
      return;
    }

    const supported = await Linking.canOpenURL(pdf_url);
    if (supported) {
      Linking.openURL(`https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(pdf_url)}`);
    } else {
      Alert.alert("Erro", "Não foi possível abrir o PDF.");
    }
  };

  const baixarPDF = async () => {
    try {
      if (!pdf_url) {
        Alert.alert("Erro", "Nenhum PDF disponível.");
        return;
      }

      const nomeArquivo = pdf_url.split('/').pop();
      const caminho = FileSystem.documentDirectory + nomeArquivo;

      const download = await FileSystem.downloadAsync(pdf_url, caminho);
      await Sharing.shareAsync(download.uri);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível baixar o PDF.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Card style={styles.card} mode="outlined">
          <Card.Content>
            <Text variant="titleLarge" style={styles.titulo}>
              {mostrar(nome, 'Curso sem nome')}
            </Text>

            <Divider style={styles.divisor} />

            <View style={styles.item}>
              <Text style={styles.label}>🎓 Modalidade:</Text>
              <Text style={styles.text}>{mostrar(modalidade)}</Text>
            </View>

            <View style={styles.item}>
              <Text style={styles.label}>🏫 Nível:</Text>
              <Text style={styles.text}>{mostrar(nivel)}</Text>
            </View>

            <View style={styles.item}>
              <Text style={styles.label}>📍 Unidade:</Text>
              <Text style={styles.text}>{mostrar(unidade)}</Text>
            </View>

            <View style={styles.item}>
              <Text style={styles.label}>⏱️ Duração:</Text>
              <Text style={styles.text}>{mostrar(duracao)}</Text>
            </View>

            <View style={styles.item}>
              <Text style={styles.label}>🌙 Turno:</Text>
              <Text style={styles.text}>{mostrar(turno)}</Text>
            </View>

            <Divider style={styles.divisor} />

            <Text variant="titleSmall" style={[styles.label, { color: theme.colors.primary }]}>
              📝 Descrição
            </Text>
            <Text style={styles.text}>{mostrar(descricao, 'Sem descrição disponível.')}</Text>

            {pdf_url && (
              <View style={{ marginTop: 20 }}>
                <Text style={[styles.label, { marginBottom: 8 }]}>📄 Arquivo do Curso</Text>
                <Button icon="file-eye" mode="outlined" onPress={visualizarPDF} style={{ marginBottom: 8 }}>
                  Visualizar PDF
                </Button>
                <Button icon="download" mode="contained" onPress={baixarPDF}>
                  Baixar PDF
                </Button>
              </View>
            )}
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 80,
    flexGrow: 1,
  },
  card: {
    marginBottom: 16,
  },
  titulo: {
    fontWeight: 'bold',
    color: '#1c9b5e',
    fontSize: 20,
    marginBottom: 8,
  },
  item: {
    marginBottom: 12,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#555',
    marginBottom: 2,
  },
  text: {
    fontSize: 15,
    color: '#333',
  },
  divisor: {
    marginVertical: 16,
  },
});
