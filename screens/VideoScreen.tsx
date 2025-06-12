import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Linking } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Feather';
import { api } from '../services/api';

type RootStackParamList = {
  Home: undefined;
  Video: undefined;
};

type VideoScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Video'>;
};

interface Video {
  id: number;
  nome: string;
  imagelink: string;
  linkvi: string;
}

const VideoScreen = ({ navigation }: VideoScreenProps) => {
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      const response = await api.get('/videos');
      setVideos(response.data);
    } catch (error) {
      console.error('Erro ao carregar vídeos:', error);
    }
  };

  const handleVideoPress = (linkvi: string) => {
    Linking.openURL(linkvi);
  };

  const renderVideoItem = ({ item }: { item: Video }) => (
    <TouchableOpacity 
      style={styles.videoCard}
      onPress={() => handleVideoPress(item.linkvi)}
    >
      <View style={styles.videoContent}>
        <Image 
          source={{ uri: item.imagelink }} 
          style={styles.thumbnail}
          resizeMode="contain"
        />
        <Text style={styles.videoTitle}>{item.nome}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.backButtonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Vídeos</Text>
      <FlatList
        data={videos}
        renderItem={renderVideoItem}
        keyExtractor={(item) => item?.id?.toString() || Math.random().toString()}
        contentContainerStyle={styles.videoList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#452b5a',
  },
  title: {
    fontSize: 28,
    marginBottom: 30,
    marginTop: 50,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#90c6e6',
  },
  backButtonContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#34b4d3',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  videoList: {
    paddingBottom: 20,
  },
  videoCard: {
    backgroundColor: '#34b4d3',
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
    elevation: 3,
    width: '95%',
    alignSelf: 'center',
  },
  videoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  thumbnail: {
    width: 150,
    height: 100,
  },
  videoTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    padding: 15,
    flex: 1,
  },
});

export default VideoScreen; 