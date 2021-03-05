import { Picker } from '@react-native-picker/picker';
import { StatusBar } from 'expo-status-bar';
import React, { useState,  createContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";

import Home from './components/Home';
import List from './components/List';

const Stack = createStackNavigator();


export default function App() {
  // const [type, setType] = useState('Film');

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={Home}  options={{ title:'Accueil', headerStyle: { backgroundColor: '#f4511e', } }} />
            <Stack.Screen name="List" component={List} options={{ title:'Recherche'}} />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar backgroundColor={'black'} style="light" translucent={true}/>
    </>
  );
}