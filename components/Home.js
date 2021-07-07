import React, { useState, useEffect  } from 'react';
import { Picker } from '@react-native-picker/picker';
import { Image, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { tw } from 'react-native-tailwindcss';
import { useFonts, GreatVibes_400Regular } from '@expo-google-fonts/great-vibes';
import AppLoading from 'expo-app-loading';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { LOGO } from '../assets/img/index';
import Welcome from './Welcome';

export default function Home({ navigation }) {
    const [value, setValue] = useState('');
    const [select, setSelect] = useState('Film');
    const [valueError, setValueError] = useState('');
    const [isFirstLaunch, setIsFirstLaunch] = useState('maybe');


    useEffect( () => {
        const value = AsyncStorage.getItem("alreadyLaunched")
        if(value == null){
                AsyncStorage.setItem('alreadyLaunched', 'true'); // No need to wait for `setItem` to finish, although you might want to handle errors
                setIsFirstLaunch('true');
        }
        else{
            setIsFirstLaunch('false')
        }
    }, [])


    let [fontsLoaded] = useFonts({
        GreatVibes_400Regular,
    });

    if(!fontsLoaded){
        return <AppLoading/>
    }


    return (
        <KeyboardAvoidingView keyboardVerticalOffset={-900} style={{flex:1}} enabled>
        {isFirstLaunch === 'false' ? <Welcome visible={true}/> : ''}
        <ScrollView style={[tw.pT10, {minHeight: 100}]} contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between', flexDirection: 'column' }}>
        <View style={[tw.itemsCenter]} >
        <Image source={ LOGO }
                style={styles.tinyLogo} />
        <Text style={[{fontFamily: 'GreatVibes_400Regular'},tw.text4xl]}> Il était un film </Text>
        </View>
        <View style={[tw.flex1, tw.p2, tw.wFull, tw.hFull, tw.itemsCenter, tw.justifyCenter]}>
        <TextInput style={[tw.textBlack, tw.bgWhite ,tw.border, tw.p3, tw.wFull, tw.rounded, tw.m1, tw.textBase, valueError && {borderColor:'red'}]} 
                placeholder="Je recherche..." 
                onChangeText={text => {
                    setValue(text)
                    if(text !== ''){
                    setValueError('');
                    }
                    }}/>
        <View style={[tw.border, tw.rounded, tw.m1, tw.wFull]}>
            <Picker
            style={[tw.border, tw.bgWhite, tw.wFull]}
            itemStyle={[tw.textXl]}
            selectedValue={select}
            onValueChange={(itemValue) => {
                setSelect(itemValue)
            }}>
                <Picker.Item label="Film" value="Film" />
                <Picker.Item label="Série" value="Série" />
                <Picker.Item label="Personne" value="Personne" />
            </Picker>
        </View>
        <View style={{ flex : 1 }} />
        {valueError !== '' && (
            <Text style={{ color: "red" }}>{valueError}</Text>
        )}
        </View>
        </ScrollView>
        <View style={{flex: 1,
    justifyContent: 'flex-end'}}>
        <TouchableOpacity activeOpacity={0.8} style={[tw.bgIndigo400,tw.itemsCenter, tw.wFull, tw.flexCol]} onPress={() => {
            if(value === ''){
            setValueError('Veuillez saisir un élément de recherche.');
            } else {
            setValueError('');
            navigation.push('List', {
                search: value,
                type: select
            });
            }
        }}><Text style={[tw.p5, tw.textWhite, tw.fontBold]}>RECHERCHER</Text></TouchableOpacity>
        </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    tinyLogo: {
      width: 150,
      height: 150,
      resizeMode: "contain"
    },
  });
  