import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Alert, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Feather';
import { AuthContext } from '../App';
import { jwtDecode } from 'jwt-decode';
import { api } from '../services/api';
import { Picker } from '@react-native-picker/picker';

interface JwtPayload {
  idUser: number;
  nome: string;
  email: string;
  uf: string;
  level: string;
  iat: number;
  exp: number;
}

type RootStackParamList = {
  Home: undefined;
  Perfil: undefined;
  Login: undefined;
};

type PerfilScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Perfil'>;
};

const ufs = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

const PerfilScreen = ({ navigation }: PerfilScreenProps) => {
  const { token, setToken, password } = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [uf, setUf] = useState('');
  
  let nomeExibicao = '';
  let emailExibicao = '';
  let ufExibicao = '';

  if (token) {
    try {
      const decodedToken = jwtDecode<JwtPayload>(token);
      nomeExibicao = decodedToken.nome || '';
      emailExibicao = decodedToken.email || '';
      ufExibicao = decodedToken.uf || '';
      
      // Preenche os campos do modal com os valores atuais
      if (!nome) setNome(nomeExibicao);
      if (!email) setEmail(emailExibicao);
      if (!uf) setUf(ufExibicao);
    } catch (error) {
      console.error('Erro ao decodificar o token:', error);
    }
  }

  const handleLogout = () => {
    setToken(null);
    navigation.navigate('Login');
  };

  const handleUpdate = async () => {
    if (!token) {
      Alert.alert('Erro', 'Usuário não autenticado');
      return;
    }

    try {
      const decodedToken = jwtDecode<JwtPayload>(token);
      
      // Configuração do cabeçalho com o token
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      
      const response = await api.put(`/user/${decodedToken.idUser}`, {
        codcli: decodedToken.idUser,
        nome,
        email,
        uf,
        level: decodedToken.level,
        password: password
      }, config);

      if (response.status === 201) {
        Alert.alert('Sucesso', 'Cadastro atualizado com sucesso!');
        setModalVisible(false);
      }
    } catch (error: any) {
      console.error('Erro ao atualizar cadastro:', error);
      const errorMessage = error.response?.data?.error || 'Não foi possível atualizar o cadastro';
      Alert.alert('Erro', errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.backButtonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Perfil</Text>

      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Nome:</Text>
          <Text style={styles.infoValue}>{nomeExibicao}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoValue}>{emailExibicao}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>UF:</Text>
          <Text style={styles.infoValue}>{ufExibicao}</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.updateButton]} onPress={() => setModalVisible(true)}>
          <Text style={styles.buttonText}>Atualizar Cadastro</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
          <Text style={styles.buttonText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Atualizar Cadastro</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Nome"
              placeholderTextColor="#666"
              value={nome}
              onChangeText={setNome}
            />

            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#666"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={uf}
                onValueChange={(itemValue) => setUf(itemValue)}
                style={styles.picker}
                dropdownIconColor="#fff"
              >
                {ufs.map((ufItem) => (
                  <Picker.Item 
                    key={ufItem} 
                    label={ufItem} 
                    value={ufItem}
                    color="#000"
                  />
                ))}
              </Picker>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]} 
                onPress={handleUpdate}
              >
                <Text style={styles.buttonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#90c6e6',
  },
  backButtonContainer: {
    position: 'absolute',
    top: 20,
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
  infoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
  infoItem: {
    marginBottom: 15,
    width: '100%',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 16,
    color: '#90c6e6',
    marginBottom: 5,
    textAlign: 'center',
  },
  infoValue: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  button: {
    backgroundColor: '#34b4d3',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  updateButton: {
    backgroundColor: '#34b4d3',
  },
  logoutButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#452b5a',
    borderRadius: 20,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#90c6e6',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    color: '#fff',
  },
  pickerContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    marginBottom: 15,
    overflow: 'hidden',
  },
  picker: {
    color: '#fff',
    height: 50,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f44336',
  },
  saveButton: {
    backgroundColor: '#34b4d3',
  },
});

export default PerfilScreen; 