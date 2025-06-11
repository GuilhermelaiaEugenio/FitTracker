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

        <View style={[styles.summaryContainer, { marginTop: 30 }]}>
          <Text style={styles.summaryTitle}>Resumo das Funcionalidades</Text>
          
          <View style={styles.summarySection}>
            <Text style={styles.summaryHeader}>Exercícios</Text>
            <Text style={styles.summaryText}>
              Gerencie seus exercícios físicos diários. Visualize todos os exercícios cadastrados, com destaque para os do dia atual. Adicione novos exercícios preenchendo nome, dias da semana e descrição. Marque os exercícios como completados com um simples toque. Edite ou exclua exercícios conforme necessário. Acompanhe seu progresso diário de forma simples e intuitiva.
            </Text>
          </View>

          <View style={styles.separator} />

          <View style={styles.summarySection}>
            <Text style={styles.summaryHeader}>Vídeos</Text>
            <Text style={styles.summaryText}>
              Explore nossa coleção de vídeos em cards organizados. Cada card apresenta uma thumbnail e o nome do vídeo. Clique em qualquer card para assistir ao vídeo no YouTube. Interface limpa e intuitiva para fácil navegação. Acesse todo o conteúdo com apenas um toque.
            </Text>
          </View>

          <View style={styles.separator} />

          <View style={styles.summarySection}>
            <Text style={styles.summaryHeader}>Perfil</Text>
            <Text style={styles.summaryText}>
              Acesse e gerencie suas informações pessoais. Visualize e atualize seu nome, email e estado. Faça alterações facilmente através do botão "Atualizar Cadastro". Saia da sua conta quando desejar com o botão "Sair".
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#452b5a',
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
    backgroundColor: '#34b4d3',
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
    fontSize: 28,
    marginBottom: 5,
    marginTop: 30,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#90c6e6',
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
  },
  button: {
    backgroundColor: '#34b4d3',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryContainer: {
    marginTop: 30,
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#90c6e6',
    textAlign: 'center',
    marginBottom: 20,
  },
  summarySection: {
    marginBottom: 15,
  },
  summaryHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#34b4d3',
    marginBottom: 10,
  },
  summaryText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
  },
  separator: {
    height: 1,
    backgroundColor: '#34b4d3',
    marginVertical: 15,
    opacity: 0.3,
  },
});

export default HomeScreen; 