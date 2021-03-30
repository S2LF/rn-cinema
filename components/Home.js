import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { tw } from 'react-native-tailwindcss';
import HomeSvg from './svg/HomeSvg';

export default function Home({ navigation }) {
    const [value, setValue] = useState('');
    const [select, setSelect] = useState('Film');
    const [valueError, setValueError] = useState('');
  
  return (
        <>
        <ScrollView style={[tw.pT10, {minHeight: 100}]} contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between', flexDirection: 'column' }}>
        <View style={[tw.itemsCenter]} >
        <Image source={{ uri: 'data:image/png;base64,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'}} 
                style={styles.tinyLogo} />
        <Text style={[tw.textBlue500, tw.textXl]}>Title</Text>
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
        {valueError !== '' && (
            <Text style={{ color: "red" }}>{valueError}</Text>
        )}
        </View>
        </ScrollView>
        <View style={[tw.wFull, tw.flexCol, tw.flex1, tw.selfEnd ]}>
        <TouchableOpacity activeOpacity={0.8} style={[tw.bgIndigo400,tw.itemsCenter, tw.wFull, tw.flexCol, {position:'absolute', bottom:0}]} onPress={() => {
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
        </>
    )
}

const styles = StyleSheet.create({
    tinyLogo: {
      width: 75,
      height: 75,
      margin: 10
    },
  });
  