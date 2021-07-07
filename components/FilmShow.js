import React, { useState, useEffect } from "react";
import { Image, Text, View, ActivityIndicator, TouchableOpacity, ScrollView, StyleSheet, Modal, TouchableHighlight } from "react-native";
import {API_KEY} from "@env"
import axios from "axios";
import { tw } from 'react-native-tailwindcss';
import Collapsible from "react-native-collapsible";
import { useNavigation } from '@react-navigation/native';
import ReadMore from "@fawazahmed/react-native-read-more";

import { LOGO } from '../assets/img/index';
import { DEFAULT_USER_POSTER } from '../assets/img/index';
import RenderSeparator from "./RenderSeparator";


export default function FilmShow({ route }){

    const navigation = useNavigation();

    const { id } = route.params;
    
    const [ loading, setLoading ] = useState(true);
    const [modal, setModal] = useState(false);

    const [infos, setInfos] = useState([]);
    const [cast, setCast] = useState([]);
    const [crew, setCrew] = useState([]);
    const [isCollapsedChildCast, setIsCollapsedChildCast ] = useState(true);
    const [isCollapsedChildCrew, setIsCollapsedChildCrew ] = useState(true);

    

    const url = 'https://api.themoviedb.org/3/';

    useEffect(() => {
        setLoading(true);
        (async () => {
                    const inf = await axios.get(`${url}movie/${id}?api_key=${API_KEY}&language=fr-FR&append_to_response=credits`);

                    setInfos(inf.data);
                    setCast(inf.data.credits.cast);
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
                <View style={[ tw.selfCenter, {flex: 1, justifyContent: "center", padding: 10 }]}>
                    <Image source={ LOGO } style={{ width: 150, height: 150, resizeMode: "contain" }} />
                    <Text style={[tw.textXl, tw.fontBold, tw.selfCenter, tw.pB2]}>Chargement...</Text>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            </>
        ) : (
        <ScrollView>
            <View style={[styles.centeredView, tw.selfCenter, tw.pL5, tw.pR5]}>
            { infos.title ?
                <Text style={[tw.pT2, tw.fontBold, tw.text2xl , {marginBottom: 15, textAlign: "center"}]}>{infos.title}</Text>
            : <Text  style={[tw.pT2, tw.fontBold, tw.text2xl , {marginBottom: 15, textAlign: "center"}]}>Pas de titre</Text> }
            { infos.poster_path && ( 
                <>
                <TouchableHighlight onPress={() => setModal(!modal)}>
                    <Image
                        source={{ uri: `https://image.tmdb.org/t/p/w300${infos.poster_path}`}}
                        style={{ width: 200, height: 300, padding: 0, resizeMode: "contain" }}
                    />
                </TouchableHighlight>
                <Modal
                    animationType="fade"
                    style={[tw.bgGrey900]}
                    visible={modal}
                >
                    <View style={[styles.modalCenteredView]}>
                        <TouchableHighlight
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => setModal(!modal)}
                        >
                            <Text style={styles.textStyle}>Fermer</Text>
                        </TouchableHighlight>
                        <View style={{elevation: 5, width: '100%', height: "100%"}}>
                            <Image
                                source={{ uri: `https://image.tmdb.org/t/p/original${infos.poster_path}`}}
                                style={{ width: '100%', height: "100%", padding: 0, resizeMode: "contain" }}
                            />
                        </View>
                    </View>
                </Modal>
            </>
                // <Image
                //     source={{ uri: `https://image.tmdb.org/t/p/w150_and_h225_bestv2${infos.poster_path}`}}
                //     style={{ width: 300, height: 300, resizeMode: "contain", paddingBottom: 10 }}
                // />
            )}
            <Text style={[tw.mT4, tw.fontBold,tw.textXl, tw.pB2]}>Synopsis</Text>
            {infos.overview ?
            <ReadMore seeLessText={'Voir moins'} seeMoreText={'Voir plus'} seeLessStyle={{color: '#3182ce', fontWeight: 'bold'}} seeMoreStyle={{color: '#3182ce', fontWeight: 'bold'}} numberOfLines={6}>
                { infos.overview }
            </ReadMore>
            : <Text> - </Text>}
            <Text style={[tw.mT4, tw.fontBold,tw.textXl]}>Année de sortie</Text>
            {infos.release_date ?
                <Text style={[tw.textLg]}>{ infos.release_date.split('-')[0] }</Text>
            : <Text> - </Text>}
            <Text style={[tw.mT4, tw.fontBold,tw.textXl]}>Pays de production</Text>
            {infos.production_countries.length > 0?
                infos.production_countries.map((item) => (
                    <Text key={item.iso_3166_1}>{item.name}</Text>
                ))
            : <Text> - </Text>}
            <Text style={[tw.mT4, tw.fontBold,tw.textXl]}>Réalisateur·rice·s</Text>
            {producer.length > 0 ?
                <View style={[tw.mT2, tw.wFull, tw.textCenter, tw.alignCenter]}>
                    <View style={[tw.selfCenter]}>
                        {producer[0].profile_path ? 
                            <Image source={{ uri: `https://image.tmdb.org/t/p/w150_and_h225_bestv2${producer[0].profile_path}` }} style={{ width: 75, height: 75, resizeMode: "contain"}} />
                        :
                            <Image
                                source={DEFAULT_USER_POSTER}
                                style={{width: 75, height: 75, resizeMode: "contain" }}
                            />
                        }
                    </View>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                            navigation.push('PersonShow', {
                                id: producer[0].id
                            });
                        }}
                    >
                        <Text  style={[tw.textBlue600, tw.fontBold]}> {producer[0].name }</Text>
                    </TouchableOpacity>
                </View>
            : <Text> - </Text>}
            <Text style={[tw.mT4, tw.fontBold,tw.textXl]}>Acteur·rice·s principaux</Text>
            {cast.length > 0 ? cast.slice(0,3).map((item) => (
                <View key={item.id} style={[tw.flex1, tw.alignCenter, tw.pB3]}>
                    <View  style={[tw.mT2, tw.selfCenter]}>
                    { item.profile_path ?
                        <Image source={{ uri: `https://image.tmdb.org/t/p/w150_and_h225_bestv2${item.profile_path}` }} style={{ width: 75, height: 75, resizeMode: "contain"}} />
                    :
                        <Image
                            source={DEFAULT_USER_POSTER}
                            style={{ width: 75, height: 75, resizeMode: "contain" }}
                        />
                    }
                    </View>

                    <View style={[tw.pL2, tw.pR2]}>
                        <View style={[tw.flexRow, tw.alignCenter]}>
                        <Text style={[tw.underline]}>Nom</Text><Text>:</Text><TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => {
                                navigation.push('PersonShow', {
                                    id: item.id
                                });
                            }}
                        >
                            <Text  style={[tw.textBlue600, tw.fontBold]}> {item.name }</Text>
                        </TouchableOpacity>
                        </View>
                        <Text><Text style={[tw.underline]}>Rôle</Text>: {item.character}</Text>
                    </View>

                    

                </View>
            )) : <Text> - </Text>}
            <Text style={[tw.mT4, tw.fontBold,tw.textXl, tw.pB2]}>Genres</Text>
            { infos.genres.length > 0 ?
            <Text style={[tw.textCenter]}>
                {infos.genres.map((el, index) => (
                    (index+1 == infos.genres.length) ? el.name : el.name+' - '
                ))}
            </Text>
            : <Text> - </Text>}
            {(cast.length > 0 || crew.length > 0 ) && (
                <>
                <View  style={[tw.pB10, tw.selfCenter]}>
                    <Text style={[tw.mT4, tw.fontBold,tw.textXl, tw.textCenter]}>Casting, équipe technique et de production ({cast.length+crew.length})</Text>
                    <TouchableOpacity activeOpacity={0.8} style={[ tw.p2, tw.m2]} onPress={() => setIsCollapsedChildCast(!isCollapsedChildCast)}>
                        <Text style={[ tw.bgGreen500, styles.otherButton, tw.w40, tw.selfCenter, tw.textWhite, tw.fontBold, tw.textCenter]} >Casting ({cast.length})</Text>
                    </TouchableOpacity>
                    {cast.length > 0 && (
                        <Collapsible collapsed={isCollapsedChildCast}>
                            {cast.sort(function(a, b){return new Date(b.release_date) - new Date(a.release_date)}).map((item) => (
                                <View key={item.id}>
                                    <View style={[tw.flexRow, tw.alignCenter, tw.selfCenter, tw.justifyCenter, tw.flexWrap]}>
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            onPress={() => {
                                                navigation.push('PersonShow', {
                                                    id: item.id
                                                });
                                            }}
                                        >
                                            <Text style={[tw.fontBold, tw.textBlue600]}>{item.name}</Text>
                                        </TouchableOpacity><Text> dans le rôle de : </Text><Text style={[tw.fontBold]}>{item.character ?? ' - '}</Text>
                                    </View>
                                    <RenderSeparator/>
                                </View>
                            ))}
                        </Collapsible>
                    )}
                    <TouchableOpacity activeOpacity={0.8} style={[ tw.p2, tw.m2]} onPress={() => setIsCollapsedChildCrew(!isCollapsedChildCrew)}>
                        <Text style={[tw.bgGreen500, styles.otherButton, tw.w50, tw.textWhite, tw.selfCenter, tw.fontBold, tw.textCenter]} >Équipe technique et de production ({crew.length})</Text>
                    </TouchableOpacity>
                    {crew.length > 0 && (
                        <Collapsible collapsed={isCollapsedChildCrew}>
                            {crew.sort(function(a, b){return new Date(b.release_date) - new Date(a.release_date)}).map((item, index) => (
                                <View key={item.id*index}>
                                    <View style={[tw.textCenter, tw.selfCenter]}>
                                        <Text  style={[tw.textCenter, tw.selfCenter]}>{item.job}</Text>
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            onPress={() => {
                                                navigation.push('PersonShow', {
                                                    id: item.id
                                                });
                                            }}
                                        >
                                            <Text style={[tw.fontBold, tw.textBlue600,tw.textCenter, tw.selfCenter]}>{item.name ?? ' - '}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <RenderSeparator/>
                                </View>
                            ))}
                        </Collapsible>
                    )}
                </View>
                </>
            )}
            </View>
        </ScrollView>
    )}
    </>
    )
}


const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 5
    },
    modalCenteredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 5,
        backgroundColor: "#1a202c",
        paddingTop: 30,
    },
    otherButton: {
      borderRadius: 20,
      padding: 10,
      elevation: 2
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