import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";


import Home from './components/Home';
import List from './components/List';
import PersonShow from './components/PersonShow';
import FilmShow from './components/FilmShow';
import SerieShow from './components/SerieShow';
import { View } from 'react-native';
import HomeSvg from './components/svg/HomeSvg';

const Stack = createStackNavigator();


export default function App() {

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator screenOptions={({navigation}) => ({
          headerRight: () => (<View  style={{ paddingRight:10}}><HomeSvg width={20} height={20}
            onPress={() => {
                        navigation.navigate('Home');
                    }}
                    title="Accueil" /></View>)
        })} initialRouteName="Home">
            <Stack.Screen name="Home" component={Home}  options={{ title:'Accueil', headerStyle: { backgroundColor: '#feebc8', } }} />
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