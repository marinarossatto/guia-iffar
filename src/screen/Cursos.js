import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Text, ActivityIndicator, FAB } from 'react-native-paper';
import CursoCard from '../componentes/CursoCard';
import { supabase } from '../config/supabase';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Cursos({ navigation }) {
  const [cursos, setCursos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function buscarCursos() {
      const { data, error } = await supabase.from('cursos').select('*');
      if (error) {
        console.error('Erro ao buscar cursos:', error);
      } else {
        setCursos(data);
      }
      setCarregando(false);
    }

    buscarCursos();
  }, []);

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text variant="titleLarge" style={styles.titulo}>
          Cursos do Campus
        </Text>

        {carregando && <ActivityIndicator animating />}

        {cursos.map((curso) => (
          <CursoCard
            key={curso.id}
            {...curso}
            onPress={() => navigation.navigate('DetalheCurso', curso)}
          />
        ))}
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('CursosTab', { screen: 'CadastroCurso' })}
        label="Novo Curso"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    padding: 20,
    paddingBottom: 100, 
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1c9b5e',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});
