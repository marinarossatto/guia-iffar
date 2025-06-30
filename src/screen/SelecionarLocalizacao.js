import React, { useState } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SelecionarLocalizacao() {
  const navigation = useNavigation();
  const route = useRoute();

  const dadosAnteriores = route.params?.dadosAnteriores || {};

  const [localizacao, setLocalizacao] = useState(
    dadosAnteriores.latitude && dadosAnteriores.longitude
      ? {
          latitude: dadosAnteriores.latitude,
          longitude: dadosAnteriores.longitude,
        }
      : {
          latitude: -28.283915, 
          longitude: -53.500839,
        }
  );

  const confirmarLocalizacao = () => {
    if (!localizacao.latitude || !localizacao.longitude) {
      Alert.alert('Erro', 'Selecione uma localização no mapa.');
      return;
    }

    navigation.navigate(route.params.voltarPara || 'CadastroEvento', {
      ...dadosAnteriores,
      latitude: localizacao.latitude,
      longitude: localizacao.longitude,
      voltouDoMapa: true,
    });
  };

  const pegarLocalizacaoAtual = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Não foi possível acessar sua localização.');
      return;
    }

    const pos = await Location.getCurrentPositionAsync({});
    setLocalizacao({
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        region={{
          latitude: localizacao.latitude,
          longitude: localizacao.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        onPress={(e) => {
          const { latitude, longitude } = e.nativeEvent.coordinate;
          setLocalizacao({ latitude, longitude });
        }}
      >
        <Marker coordinate={localizacao} />
      </MapView>

      <Button mode="outlined" onPress={pegarLocalizacaoAtual} style={styles.botaoTopo}>
        Usar minha localização atual
      </Button>

      <Button mode="contained" onPress={confirmarLocalizacao} style={styles.botaoConfirmar}>
        Confirmar Localização
      </Button>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  botaoTopo: {
    position: 'absolute',
    top: 40,
    alignSelf: 'center',
    zIndex: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    elevation: 4,
  },
  botaoConfirmar: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    paddingHorizontal: 32,
  },
});
