import { Picker } from '@react-native-picker/picker';
import { StatusBar } from 'expo-status-bar';
import React, { useState,  createContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";

import Home from './components/Home';
import List from './components/List';
import PersonShow from './components/PersonShow';
import FilmShow from './components/FilmShow';
import SerieShow from './components/SerieShow';

const Stack = createStackNavigator();


export default function App() {
  // const [type, setType] = useState('Film');

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={Home}  options={{ title:'Accueil', headerStyle: { backgroundColor: '#fbd38d', } }} />
            <Stack.Screen name="List" component={List} options={{ title:'Recherche', headerStyle: { shadowOffset: 0 } }} />
            <Stack.Screen name="FilmShow" component={FilmShow} options={{ title:'Détails du film', headerStyle: { shadowOffset: 0 } }} />
            <Stack.Screen name="SerieShow" component={SerieShow} options={{ title:'Détails de la série', headerStyle: { shadowOffset: 0 } }} />
            <Stack.Screen name="PersonShow" component={PersonShow} options={{ title:'Détails d\'une personne', headerStyle: { shadowOffset: 0 } }} />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar backgroundColor={'black'} style="light" translucent={true}/>
    </>
  );
}