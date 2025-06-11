import React, { useState, createContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import ExerciciosScreen from './screens/ExerciciosScreen';
import VideoScreen from './screens/VideoScreen';
import PerfilScreen from './screens/PerfilScreen';

const Stack = createNativeStackNavigator();

interface AuthContextData {
  token: string | null;
  setToken: (token: string | null) => void;
  password: string;
  setPassword: (password: string) => void;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const App = () => {
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState<string>('');

  return (
    <AuthContext.Provider value={{ token, setToken, password, setPassword }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Register" 
            component={RegisterScreen} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="ForgotPassword" 
            component={ForgotPasswordScreen} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Exercicios" 
            component={ExerciciosScreen} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Video" 
            component={VideoScreen} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Perfil" 
            component={PerfilScreen} 
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
});

export default App;
