import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { api } from '../services/api';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Picker } from '@react-native-picker/picker';
import { AxiosError } from 'axios';

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
};

type RegisterScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Register'>;
};

const ufs = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

const RegisterScreen = ({ navigation }: RegisterScreenProps) => {
  const [dados, setDados] = useState({ 
    nome: '',
    email: '',
    uf: 'SP',
    password: '',
    level: '1'
  });

  const handleRegister = async () => {
    try {
      // Validar campos obrigatórios
      if (!dados.nome || !dados.email || !dados.password || !dados.level) {
        Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
        return;
      }

      // Validar formato do email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(dados.email)) {
        Alert.alert('Erro', 'Por favor, insira um email válido.');
        return;
      }

      // Validar senha
      if (dados.password.length < 6) {
        Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres.');
        return;
      }

      console.log('Dados sendo enviados:', dados);
      const response = await api.post('user', dados);
      console.log('Resposta da API:', response.data);
      
      if (response.data) {
        Alert.alert(
          'Sucesso',
          'Cadastro realizado com sucesso!',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Login')
            }
          ]
        );
      }
    } catch (error) {
      console.error('Erro no cadastro:', error);
      if (error instanceof AxiosError) {
        if (error.response) {
          console.error('Dados do erro:', error.response.data);
          console.error('Status do erro:', error.response.status);
          
          if (error.response.status === 500) {
            Alert.alert('Erro', 'Erro interno do servidor. Por favor, tente novamente mais tarde.');
          } else if (error.response.data.erro === 'Email já cadastrtado') {
            Alert.alert('Erro', 'Este email já está cadastrado.');
          } else {
            Alert.alert('Erro', `Não foi possível realizar o cadastro: ${error.response.data.error || 'Erro desconhecido'}`);
          }
        } else if (error.request) {
          console.error('Erro na requisição:', error.request);
          Alert.alert('Erro', 'Não foi possível conectar ao servidor. Verifique sua conexão.');
        } else {
          console.error('Erro:', error.message);
          Alert.alert('Erro', 'Ocorreu um erro ao processar sua solicitação.');
        }
      } else {
        Alert.alert('Erro', 'Ocorreu um erro inesperado. Por favor, tente novamente.');
      }
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={dados.nome}
        onChangeText={(text) => setDados({ ...dados, nome: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={dados.email}
        onChangeText={(text) => setDados({ ...dados, email: text })}
      />

      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>UF:</Text>
        <Picker
          selectedValue={dados.uf}
          style={styles.picker}
          onValueChange={(value: string) => setDados({ ...dados, uf: value })}
        >
          {ufs.map((uf) => (
            <Picker.Item key={uf} label={uf} value={uf} />
          ))}
        </Picker>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={dados.password}
        onChangeText={(text) => setDados({ ...dados, password: text })}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    marginBottom: 30,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  pickerLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  picker: {
    flex: 1,
    height: 50,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
  },
  button: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default RegisterScreen; 