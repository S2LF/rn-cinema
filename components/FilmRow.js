import React, { useState, useEffect } from "react";
import { Image, Text, View, ActivityIndicator, TouchableOpacity, TouchableHighlight, Modal, Pressable, StyleSheet} from "react-native";
import {API_KEY} from "@env"
import axios from "axios";
import { tw } from 'react-native-tailwindcss';
import { useNavigation } from '@react-navigation/native';

import { DEFAULT_MOVIE_POSTER } from '../assets/img/index';

function FilmRow({ poster_path, title, release_date, index, id}){

    const navigation = useNavigation();

    const [loading, setLoading] = useState(true);
    const [infos, setInfos] = useState([]);
    const [crew, setCrew] = useState([]);
    const [modal, setModal] = useState(false);

    const url = 'https://api.themoviedb.org/3/';

    useEffect(() => {
        setLoading(true);
        (async () => {
                    const inf = await axios.get(`${url}movie/${id}?api_key=${API_KEY}&language=fr-FR&append_to_response=credits`);
                    setInfos(inf.data);
                    setCrew(inf.data.credits.crew);
                    setLoading(false);
            })();
    }, []);

    let producer = crew.filter((el) => (
        el.job === 'Director'
    ))

    return (
    <>
        { loading ? (
            <>
                <View style={{flex: 1, justifyContent: "center", flexDirection: "row", justifyContent: "space-around", padding: 10 }}>
                    <ActivityIndicator  size="large" color="#0000ff" />
                </View>
            </>
        ) : (
            <>
            <Text style={[tw.textBlack, tw.textCenter, tw.text2xl, tw.pB2, tw.pT2, tw.fontBold]}>{title}</Text>
            <View style={[ tw.wFull, tw.flexRow, (index % 2) && tw.flexRowReverse]}>
                {!poster_path ? (
                    <View style={{margin: 20}}>
                        <Image
                            source={DEFAULT_MOVIE_POSTER}
                            style={{ width: 120, height: 180, resizeMode: "contain" }}
                        />
                    </View>
                ) : (
                    <View style={{margin: 20}}>
                        <TouchableHighlight onPress={() => setModal(!modal)}>
                            <Image
                                source={{ uri: `https://image.tmdb.org/t/p/w150_and_h225_bestv2${poster_path}`}}
                                style={{ width: 120, height: 180, padding: 0, resizeMode: "contain" }}
                            />
                        </TouchableHighlight>
                        <Modal
                            animationType="fade"
                            style={[tw.bgGrey900]}
                            visible={modal}
                        >
                            <View style={[styles.centeredView]}>
                                <TouchableHighlight
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => setModal(!modal)}
                                >
                                    <Text style={styles.textStyle}>Fermer</Text>
                                </TouchableHighlight>
                                <View style={{elevation: 5, width: '100%', height: "100%"}}>
                                    <Image
                                        source={{ uri: `https://image.tmdb.org/t/p/original${poster_path}`}}
                                        style={{ width: '100%', height: "100%", padding: 0, resizeMode: "contain" }}
                                    />
                                </View>
                            </View>
                        </Modal>
                    </View>
                )}
                <View style={[tw.flex1, tw.alignCenter, tw.justifyAround, tw.pL2, tw.pR2]}>
                    <Text><Text style={[tw.underline]}>Année de sortie</Text>: {release_date && release_date.split('-')[0]}</Text>
                    <View style={[tw.flexRow, tw.flexWrap, tw.alignCenter]}><Text style={[tw.underline]}>Réalisateur·rice·s</Text><Text>:</Text>
                    {producer.length > 0 ? (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => {
                                    navigation.push('PersonShow', {
                                        id: producer[0].id
                                    });
                                }}
                            >
                                <Text style={[tw.textBlue600, tw.fontBold]}> {producer[0].name }</Text>
                            </TouchableOpacity>
                        ) : (<Text> - </Text>)}
                    </View>
                    <View style={[tw.pB2]}>
                        <Text>
                            <Text style={[tw.underline]}>Genres</Text>:
                            { infos.genres && infos.genres.map((el, index) => (
                                (index+1 == infos.genres.length) ? <Text key={el.id}>{el.name}</Text> : <Text key={el.id}>{el.name+' - '}</Text>
                            )) 
                            }
                        </Text>
                    </View>
                    <TouchableHighlight underlayColor={'#38a169'} activeOpacity={0.8} style={[tw.bgGreen400, tw.p1,tw.itemsCenter, tw.rounded]} onPress={() => {
                        // setModalVisible(true);
                        navigation.push('FilmShow', {
                            id: id
                        });
                    }}><Text style={[tw.textWhite, tw.fontBold]}>En savoir +</Text></TouchableHighlight>
                </View>
            </View>
            </>
        )}
    </>
    )

}

export default FilmRow;

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 5,
        backgroundColor: "#1a202c",
        paddingTop: 30,
    },
    modalView: {
    //   backgroundColor: "white",

    //   borderRadius: 20,
    //   padding: 10,
    //   shadowColor: "#000",
    //   shadowOffset: {
    //     width: 0,
    //     height: 2
    //   },
    //   shadowOpacity: 0.25,
    //   shadowRadius: 4,
    },
    button: {
    //   borderRadius: 20,

      padding: 10,
      elevation: 2
    },
    buttonOpen: {
      backgroundColor: "#F194FF",
    },
    buttonClose: {
    //   backgroundColor: "#2196F3",
    // marginTop: 100,
    // marginBottom: -50,
    borderWidth: 1,
    borderColor: 'white',
    elevation: 6, 
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        // marginBottom: -50,
    },
    modalText: {
    //   marginBottom: 15,
      textAlign: "center"
    }
  });