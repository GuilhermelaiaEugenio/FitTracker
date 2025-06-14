import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { api } from '../services/api';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AxiosError } from 'axios';
import { AuthContext } from '../App';

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  ForgotPassword: undefined;
};

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const [dados, setDados] = useState({ email: '', password: '' });
  const { setToken, setPassword } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      const response = await api.post('userauth', dados);
      console.log('Resposta completa do backend:', response.data);
      console.log('Token recebido:', response.data.token);
      setToken(response.data.token);
      setPassword(dados.password);
      Alert.alert(
        'Sucesso',
        'Login realizado com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Home')
          }
        ]
      );
    } catch (error) {
      console.error('Erro no login:', error);
      if (error instanceof AxiosError && error.response) {
        console.error('Dados do erro:', error.response.data);
        Alert.alert('Erro', error.response.data.mensagem || 'Não foi possível realizar o login.');
      } else {
        Alert.alert('Erro', 'Não foi possível conectar ao servidor. Verifique sua conexão.');
      }
    }
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <View style={styles.container}>
      <Image 
        source={require('../assets/logo.png')} 
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>FitTracker</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#dbdbdb"
        keyboardType="email-address"
        value={dados.email}
        onChangeText={(text) => setDados({ ...dados, email: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#dbdbdb"
        secureTextEntry
        value={dados.password}
        onChangeText={(text) => setDados({ ...dados, password: text })}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.forgotPasswordButton} 
        onPress={() => navigation.navigate('ForgotPassword')}
      >
        <Text style={styles.forgotPasswordText}>Esqueci minha senha</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#452b5a',
  },
  logo: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    marginBottom: 30,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#90c6e6',
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    color: '#fff',
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
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  forgotPasswordButton: {
    marginTop: 20,
    alignSelf: 'center',
  },
  forgotPasswordText: {
    color: '#2196F3',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen; 