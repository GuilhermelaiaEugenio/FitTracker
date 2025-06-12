import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, ScrollView, Alert, FlatList } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Feather';
import { AuthContext } from '../App';
import { jwtDecode } from 'jwt-decode';
import { api } from '../services/api';

interface JwtPayload {
  idUser: number;
  nome: string;
  email: string;
  uf: string;
  level: string;
  iat: number;
  exp: number;
}

interface Exercicio {
  codexer: number;
  nome: string;
  dias: string;
  descr: string;
  codcli: number;
}

interface ExercicioCompleto {
  codexer: number;
  completado: boolean;
  data: string;
}

type RootStackParamList = {
  Home: undefined;
  Exercicios: undefined;
};

type ExerciciosScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Exercicios'>;
};

const DIAS_SEMANA = [
  { id: 'domingo', label: 'Domingo' },
  { id: 'segunda', label: 'Segunda' },
  { id: 'terca', label: 'Terça' },
  { id: 'quarta', label: 'Quarta' },
  { id: 'quinta', label: 'Quinta' },
  { id: 'sexta', label: 'Sexta' },
  { id: 'sabado', label: 'Sábado' },
];

const ExerciciosScreen = ({ navigation }: ExerciciosScreenProps) => {
  const { token } = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [nome, setNome] = useState('');
  const [diasSelecionados, setDiasSelecionados] = useState<string[]>([]);
  const [descr, setDescr] = useState('');
  const [exercicios, setExercicios] = useState<Exercicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [exercicioEditando, setExercicioEditando] = useState<Exercicio | null>(null);
  const [exerciciosCompletos, setExerciciosCompletos] = useState<ExercicioCompleto[]>([]);
  const [dataAtual, setDataAtual] = useState(new Date());
  const [diaSemanaAtual, setDiaSemanaAtual] = useState('');

  useEffect(() => {
    carregarExercicios();
    const hoje = new Date();
    setDataAtual(hoje);
    const diasSemana = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
    setDiaSemanaAtual(diasSemana[hoje.getDay()]);
  }, []);

  const carregarExercicios = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.get('/exercicios');
      if (response.status === 200) {
        const decodedToken = jwtDecode<JwtPayload>(token);
        const exerciciosFiltrados = response.data.filter(
          (exercicio: Exercicio) => exercicio.codcli === decodedToken.idUser
        );
        setExercicios(exerciciosFiltrados);
      }
    } catch (error) {
      console.error('Erro ao carregar exercícios:', error);
      Alert.alert('Erro', 'Não foi possível carregar os exercícios');
    } finally {
      setLoading(false);
    }
  };

  const toggleDia = (diaId: string) => {
    setDiasSelecionados(prev => {
      if (prev.includes(diaId)) {
        return prev.filter(dia => dia !== diaId);
      } else {
        return [...prev, diaId];
      }
    });
  };

  const handleCadastro = async () => {
    if (!token) {
      Alert.alert('Erro', 'Usuário não autenticado');
      return;
    }

    if (diasSelecionados.length === 0) {
      Alert.alert('Erro', 'Selecione pelo menos um dia da semana');
      return;
    }

    try {
      const decodedToken = jwtDecode<JwtPayload>(token);
      const response = await api.post('/exercicios', {
        nome,
        dias: diasSelecionados.join(', '),
        descr,
        codcli: decodedToken.idUser
      });

      if (response.status === 201) {
        Alert.alert('Sucesso', 'Exercício cadastrado com sucesso!');
        setModalVisible(false);
        setNome('');
        setDiasSelecionados([]);
        setDescr('');
        carregarExercicios(); // Recarrega a lista após cadastrar
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível cadastrar o exercício');
      console.error(error);
    }
  };

  const handleDelete = async (codexer: number) => {
    try {
      const response = await api.delete(`/exercicios/${codexer}`);
      if (response.status === 200) {
        Alert.alert('Sucesso', 'Exercício excluído com sucesso!');
        carregarExercicios(); // Recarrega a lista após deletar
      }
    } catch (error) {
      console.error('Erro ao deletar exercício:', error);
      Alert.alert('Erro', 'Não foi possível excluir o exercício');
    }
  };

  const handleEdit = (exercicio: Exercicio) => {
    setExercicioEditando(exercicio);
    setNome(exercicio.nome);
    setDiasSelecionados(exercicio.dias.split(', '));
    setDescr(exercicio.descr);
    setEditModalVisible(true);
  };

  const handleUpdate = async () => {
    if (!token || !exercicioEditando) {
      Alert.alert('Erro', 'Usuário não autenticado ou exercício não selecionado');
      return;
    }

    if (diasSelecionados.length === 0) {
      Alert.alert('Erro', 'Selecione pelo menos um dia da semana');
      return;
    }

    try {
      const response = await api.put(`/exercicios/${exercicioEditando.codexer}`, {
        nome,
        dias: diasSelecionados.join(', '),
        descr,
        codcli: exercicioEditando.codcli
      });

      if (response.status === 200) {
        Alert.alert('Sucesso', 'Exercício atualizado com sucesso!');
        setEditModalVisible(false);
        setExercicioEditando(null);
        setNome('');
        setDiasSelecionados([]);
        setDescr('');
        carregarExercicios();
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o exercício');
      console.error(error);
    }
  };

  const toggleExercicioCompleto = (codexer: number) => {
    setExerciciosCompletos(prev => {
      const exercicioExistente = prev.find(e => e.codexer === codexer && e.data === dataAtual.toISOString().split('T')[0]);
      
      if (exercicioExistente) {
        return prev.filter(e => !(e.codexer === codexer && e.data === dataAtual.toISOString().split('T')[0]));
      } else {
        return [...prev, {
          codexer,
          completado: true,
          data: dataAtual.toISOString().split('T')[0]
        }];
      }
    });
  };

  const getExerciciosDoDia = () => {
    return exercicios.filter(exercicio => 
      exercicio.dias.toLowerCase().includes(diaSemanaAtual.toLowerCase())
    );
  };

  const getProgressoDoDia = () => {
    const exerciciosDoDia = getExerciciosDoDia();
    if (exerciciosDoDia.length === 0) return 0;

    const completados = exerciciosCompletos.filter(e => 
      e.data === dataAtual.toISOString().split('T')[0] &&
      exerciciosDoDia.some(ex => ex.codexer === e.codexer)
    ).length;

    return (completados / exerciciosDoDia.length) * 100;
  };

  const renderExercicio = ({ item }: { item: Exercicio }) => {
    const exerciciosDoDia = getExerciciosDoDia();
    const exercicioDoDia = exerciciosDoDia.some(e => e.codexer === item.codexer);
    const exercicioCompleto = exerciciosCompletos.some(
      e => e.codexer === item.codexer && e.data === dataAtual.toISOString().split('T')[0]
    );

    return (
      <View style={[
        styles.exercicioCard,
        exercicioDoDia ? styles.exercicioCardDoDia : null
      ]}>
        <View style={styles.exercicioHeader}>
          <Text style={styles.exercicioNome}>{item.nome || 'Sem nome'}</Text>
          <View style={styles.buttonContainer}>
            {exercicioDoDia && (
              <TouchableOpacity 
                style={[styles.actionButton, exercicioCompleto ? styles.completeButton : styles.incompleteButton]}
                onPress={() => toggleExercicioCompleto(item.codexer)}
              >
                <Icon name={exercicioCompleto ? "check" : "circle"} size={20} color="#fff" />
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              style={[styles.actionButton, styles.editButton]}
              onPress={() => handleEdit(item)}
            >
              <Icon name="edit-2" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => {
                Alert.alert(
                  'Confirmar exclusão',
                  'Tem certeza que deseja excluir este exercício?',
                  [
                    {
                      text: 'Cancelar',
                      style: 'cancel'
                    },
                    {
                      text: 'Excluir',
                      style: 'destructive',
                      onPress: () => handleDelete(item.codexer)
                    }
                  ]
                );
              }}
            >
              <Icon name="trash-2" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.exercicioDias}>Dias: {item.dias || 'Não especificado'}</Text>
        <Text style={styles.exercicioDescr}>{item.descr || 'Sem descrição'}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.backButtonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Exercícios</Text>

      {loading ? (
        <Text style={styles.loadingText}>Carregando exercícios...</Text>
      ) : (
        <>
          <FlatList
            data={exercicios}
            renderItem={renderExercicio}
            keyExtractor={(item) => `exercicio-${item?.codexer || Math.random()}`}
            contentContainerStyle={styles.exerciciosList}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Nenhum exercício cadastrado</Text>
            }
          />
          
          <View style={styles.progressContainer}>
            <Text style={styles.progressTitle}>Progresso do Dia ({diaSemanaAtual})</Text>
            <View style={styles.progressBarContainer}>
              <View 
                style={[
                  styles.progressBar, 
                  { width: `${getProgressoDoDia()}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {Math.round(getProgressoDoDia())}% completo
            </Text>
          </View>
        </>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cadastrar Exercício</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Nome do exercício"
              placeholderTextColor="#666"
              value={nome}
              onChangeText={setNome}
            />

            <View style={styles.diasContainer}>
              <Text style={styles.diasTitle}>Dias da Semana:</Text>
              {DIAS_SEMANA.map((dia) => (
                <TouchableOpacity
                  key={dia.id}
                  style={styles.diaItem}
                  onPress={() => toggleDia(dia.id)}
                >
                  <View style={[
                    styles.checkbox,
                    diasSelecionados.includes(dia.id) && styles.checkboxSelected
                  ]}>
                    {diasSelecionados.includes(dia.id) && (
                      <Icon name="check" size={16} color="#fff" />
                    )}
                  </View>
                  <Text style={styles.diaLabel}>{dia.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Descrição"
              placeholderTextColor="#666"
              value={descr}
              onChangeText={setDescr}
              multiline
              numberOfLines={4}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]} 
                onPress={handleCadastro}
              >
                <Text style={styles.buttonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.addButtonContainer}>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Icon name="plus" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Exercício</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Nome do exercício"
              placeholderTextColor="#666"
              value={nome}
              onChangeText={setNome}
            />

            <View style={styles.diasContainer}>
              <Text style={styles.diasTitle}>Dias da Semana:</Text>
              {DIAS_SEMANA.map((dia) => (
                <TouchableOpacity
                  key={dia.id}
                  style={styles.diaItem}
                  onPress={() => toggleDia(dia.id)}
                >
                  <View style={[
                    styles.checkbox,
                    diasSelecionados.includes(dia.id) && styles.checkboxSelected
                  ]}>
                    {diasSelecionados.includes(dia.id) && (
                      <Icon name="check" size={16} color="#fff" />
                    )}
                  </View>
                  <Text style={styles.diaLabel}>{dia.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Descrição"
              placeholderTextColor="#666"
              value={descr}
              onChangeText={setDescr}
              multiline
              numberOfLines={4}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setEditModalVisible(false)}
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
    marginTop: 50,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#90c6e6',
  },
  exerciciosList: {
    paddingBottom: 80,
  },
  exercicioCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 0,
  },
  exercicioCardDoDia: {
    borderWidth: 2,
    borderColor: '#fff',
  },
  exercicioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  exercicioNome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#90c6e6',
    marginBottom: 5,
  },
  exercicioDias: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 5,
  },
  exercicioDescr: {
    fontSize: 14,
    color: '#ccc',
  },
  loadingText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  emptyText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
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
  addButtonContainer: {
    position: 'absolute',
    bottom: 60,
    left: 20,
    zIndex: 10,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#34b4d3',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
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
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  diasContainer: {
    marginBottom: 15,
  },
  diasTitle: {
    fontSize: 16,
    color: '#90c6e6',
    marginBottom: 10,
  },
  diaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#34b4d3',
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#34b4d3',
  },
  diaLabel: {
    color: '#fff',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButton: {
    backgroundColor: '#2196F3',
  },
  deleteButton: {
    backgroundColor: '#f44336',
  },
  progressContainer: {
    padding: 16,
    paddingLeft: 60,
    backgroundColor: '#452b5a',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#fff',
  },
  progressBarContainer: {
    height: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 10,
  },
  progressText: {
    marginTop: 8,
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
  },
  completeButton: {
    backgroundColor: '#4CAF50',
  },
  incompleteButton: {
    backgroundColor: '#9E9E9E',
  },
});

export default ExerciciosScreen; 