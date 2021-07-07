import React, { useState } from 'react';
import { useFonts, GreatVibes_400Regular } from '@expo-google-fonts/great-vibes';
import AppLoading from "expo-app-loading";
import { Alert, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { tw } from "react-native-tailwindcss";



export default function Welcome({ visible }){

    const [modalVisible, setModalVisible] = useState(visible);

    let [fontsLoaded] = useFonts({
        GreatVibes_400Regular,
    });

    if(!fontsLoaded){
        return <AppLoading/>
    }


    return (
        <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
          <Text style={[tw.text2xl]}>Bienvenue sur</Text>
          <Text style={[{fontFamily: 'GreatVibes_400Regular'}, tw.text4xl, tw.pB2]}> Il était un film </Text>
        <Text style={[tw.pB2]}>Merci d'avoir téléchargé cette application !</Text>
        <Text>L'utilisation est simple, il suffit de taper le nom d'un film, d'une série ou d'une personne...</Text>
        <Text style={[tw.pT5, tw.fontBold]}>A bientôt !</Text>
            <Pressable
              style={[styles.button, styles.buttonClose, tw.mT5]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>C'est parti !</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    )
}

const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22
    },
    modalView: {
      margin: 20,
      alignSelf: 'center',
      backgroundColor: "white",
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5
    },
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2
    },
    buttonOpen: {
      backgroundColor: "#F194FF",
    },
    buttonClose: {
      backgroundColor: "#2196F3",
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center"
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center"
    }
  });