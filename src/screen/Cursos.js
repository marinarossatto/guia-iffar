import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import CursoCard from '../componentes/CursoCard';
import { supabase } from '../config/supabase';

export default function Cursos({ navigation }) {
  const [cursos, setCursos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function buscarCursos() {
      const { data, error } = await supabase.from('cursos').select('*');
      
      if (error) {
        console.error('Erro ao buscar cursos:', error);
      } else {
        console.log(data);
        
        setCursos(data);
      }
      setCarregando(false);
    }

    buscarCursos();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="titleLarge" style={styles.titulo}>Cursos do Campus</Text>

      {carregando && <ActivityIndicator animating />}

      {cursos.map((curso) => (
        <CursoCard
          key={curso.id}
          {...curso}
          onPress={() => navigation.navigate('DetalheCurso', curso)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  titulo: { marginBottom: 16 },
});
