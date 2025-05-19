import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Exercicios: undefined;
  Video: undefined;
  Perfil: undefined;
};

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const handleLogout = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      {/* Abas superiores fixas no topo */}
      <View style={styles.tabContainer}>
        <TouchableOpacity style={styles.tabButton} onPress={() => navigation.navigate('Exercicios')}>
          <Text style={styles.tabButtonText}>Exercícios</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton} onPress={() => navigation.navigate('Video')}>
          <Text style={styles.tabButtonText}>Vídeos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabButton, {borderRightWidth: 0}]} onPress={() => navigation.navigate('Perfil')}>
          <Text style={styles.tabButtonText}>Perfil</Text>
        </TouchableOpacity>
      </View>
      {/* Espaço para não sobrepor o conteúdo */}
      <View style={{ height: 60 }} />
      {/* Conteúdo centralizado */}
      <View style={styles.centerContent}>
        <Text style={styles.title}>Bem-vindo!</Text>
        <Text style={styles.subtitle}>Você está logado no sistema</Text>

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>Esta é a tela principal do aplicativo.</Text>
          <Text style={styles.infoText}>Aqui você pode adicionar mais funcionalidades.</Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 70, // espaço para as abas
    backgroundColor: '#fff',
  },
  tabContainer: {
    position: 'absolute',
    top: 30, // Espaço extra para não ficar sob a câmera frontal
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#fff',
    zIndex: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#000', // linha preta embaixo das abas
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 25,
    backgroundColor: '#2196F3',
    borderRightWidth: 1,
    borderRightColor: '#000',
    borderTopWidth: 1,
    borderTopColor: '#000',
  },
  tabButtonText: {
    color: '#fff',
    fontWeight: 'normal',
    fontSize: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#2196F3',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  infoContainer: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#f44336',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignSelf: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen; 