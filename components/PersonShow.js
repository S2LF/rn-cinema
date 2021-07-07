import React, { useState, useEffect } from "react";
import { Image, Text, View, TouchableOpacity, ActivityIndicator, StyleSheet, Modal, TouchableHighlight } from "react-native";
import {API_KEY} from "@env"
import axios from "axios";
import { tw } from 'react-native-tailwindcss';
import ReadMore from '@fawazahmed/react-native-read-more';
import age from 's-age';
import Collapsible from "react-native-collapsible";
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from "react-native-gesture-handler";

import { LOGO } from '../assets/img/index';
import { DEFAULT_MOVIE_POSTER } from '../assets/img/index';
import RenderSeparator from "./RenderSeparator";

function PersonShow({ route }){

    const navigation = useNavigation();

    const { id } = route.params;

    const [ loading, setLoading ] = useState(true);
    const [modal, setModal] = useState(false);

    const [infos, setInfos] = useState([]);
    const [cast, setCast] = useState([]);
    const [crew, setCrew] = useState([]);
    const [tvCast, setTvCast] = useState([]);
    const [tvCrew, setTvCrew] = useState([]);
    const [isCollapsedChildCast, setIsCollapsedChildCast ] = useState(true);
    const [isCollapsedChildCrew, setIsCollapsedChildCrew ] = useState(true);
    const [isCollapsedChildTvCast, setIsCollapsedChildTvCast ] = useState(true);
    const [isCollapsedChildTvCrew, setIsCollapsedChildTvCrew ] = useState(true);

    

    const url = 'https://api.themoviedb.org/3/';

    useEffect(() => {
        setLoading(true);
        (async () => {
                    const inf = await axios.get(`${url}person/${id}?api_key=${API_KEY}&language=fr-FR&append_to_response=credits`);
                    https://api.themoviedb.org/3/person/15344/tv_credits?api_key=6a0bc0546f0c4bea10345001c61a431f&language=fr-FR
                    setInfos(inf.data);
                    setCast(inf.data.credits.cast);
                    setCrew(inf.data.credits.crew);
                    const req_tvCredits= await axios.get(`${url}person/${id}/tv_credits?api_key=${API_KEY}&language=fr-FR`);
                    setTvCast(req_tvCredits.data.cast);
                    setTvCrew(req_tvCredits.data.crew);
                    setLoading(false);
            })();
    }, []);
    
    let mainFilmsFilter = [];
    if(infos.known_for_department === 'Directing'){
        mainFilmsFilter = crew;
    } else {
        mainFilmsFilter = cast;
    }

    mainFilmsFilter.sort(function(a, b){return b.vote_average - a.vote_average}).slice(0,3);

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
        <ScrollView style={[tw.selfCenter, tw.textCenter, tw.pR5, tw.pL5]}>
            { infos.name ?
                <Text style={[tw.pT2, tw.fontBold, tw.text2xl , {marginBottom: 15, textAlign: "center"}]}>{infos.name}</Text>
            : <Text  style={[tw.pT2, tw.fontBold, tw.text2xl , {marginBottom: 15, textAlign: "center"}]}>Pas de nom</Text> }
            { infos.profile_path && ( 
                <View style={[tw.selfCenter]}>
                    <TouchableHighlight onPress={() => setModal(!modal)}>
                    <Image
                        source={{ uri: `https://image.tmdb.org/t/p/w300${infos.profile_path}`}}
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
                                    source={{ uri: `https://image.tmdb.org/t/p/original${infos.profile_path}`}}
                                    style={{ width: '100%', height: "100%", padding: 0, resizeMode: "contain" }}
                                />
                            </View>
                        </View>
                    </Modal>
                </View>
            )}
            <Text style={[tw.mT4, tw.fontBold,tw.textLg, tw.textCenter]}>{ infos.birthday ? infos.birthday.split('-').reverse().join('/') : ' - '}{!infos.deathday && infos.birthday ? `(${(age(infos.birthday.split('-')[0]))} ans)` : ''}</Text>
            { infos.place_of_birth && <Text style={[tw.textCenter]}>{` à ${infos.place_of_birth}`}</Text>}
            {infos.deathday && <Text style={[tw.mT4, tw.fontBold,tw.textLg, tw.textCenter]}>Décès: {infos.deathday.split('-').reverse().join('/')}</Text> }
            <Text style={[tw.mT4, tw.fontBold,tw.textXl, tw.textCenter]}>Biographie</Text>
            {infos.biography ?
                <ReadMore seeLessText={'Voir moins'} seeMoreText={'Voir plus'} seeLessStyle={{color: '#3182ce', fontWeight: 'bold'}} seeMoreStyle={{color: '#3182ce', fontWeight: 'bold'}} numberOfLines={6}>
                    { infos.biography }
                </ReadMore>
            : <Text style={[tw.textCenter]}> - </Text>}
            {(mainFilmsFilter.length > 0) && (
            <>
            <Text style={[tw.mT4, tw.fontBold,tw.textXl, tw.textCenter]}>Filmographie principale</Text>
                {mainFilmsFilter.slice(0,3).map((item, index) => (
                    item !== undefined && (
                        <View key={item.id*index} style={[tw.flex1, tw.alignCenter, tw.pT2]}>
                                { item.name && <TouchableOpacity activeOpacity={0.8} onPress={() => {
                                    navigation.push('SerieShow', {
                                        id: item.id
                                    });
                                }}><Text style={[tw.fontBold, tw.textCenter, tw.textLg, tw.textBlue600]}>{item.name}</Text></TouchableOpacity> }
                                { item.title && <TouchableOpacity activeOpacity={0.8} onPress={() => {
                                    navigation.push('FilmShow', {
                                        id: item.id
                                    });
                                }}><Text style={[tw.fontBold, tw.textCenter, tw.textLg, tw.textBlue600]}>{item.title}</Text></TouchableOpacity> }
                            <View  style={[tw.mT2, tw.selfCenter]}>
                                { item.poster_path ?
                                    <Image source={{ uri: `https://image.tmdb.org/t/p/w150_and_h225_bestv2${item.poster_path}` }} style={{ width: 75, height: 75, resizeMode: "contain"}} />
                                :
                                    <Image
                                        source={DEFAULT_MOVIE_POSTER}
                                        style={{ width: 75, height: 75, resizeMode: "contain" }}
                                    />
                                }
                            </View>
                            {infos.known_for_department === 'Directing' ? <Text style={[tw.textCenter]}>{item.job}</Text> : (
                                <>
                                    <Text style={[tw.textCenter, tw.fontBold]}>Rôle</Text>
                                    <Text style={[tw.textCenter]}>{item.character}</Text>
                                </>)}
                            {item.release_date ? (
                                <View>
                                    <Text style={[tw.textCenter, tw.fontBold]}>Année de sortie</Text>
                                    <Text style={[tw.textCenter]}>{ item.release_date === '' ? '-' : item.release_date.split('-')[0]}</Text>
                                </View>
                            ) : <Text>''</Text>}
                            <Text style={[tw.textCenter, tw.fontBold]}>Synopsis</Text>
                            {item.overview ? 
                            <ReadMore seeLessText={'Voir moins'} seeMoreText={'Voir plus'} seeLessStyle={{color: '#3182ce', fontWeight: 'bold'}} seeMoreStyle={{color: '#3182ce', fontWeight: 'bold'}} numberOfLines={3}>
                                {item.overview}
                            </ReadMore>
                            : <Text style={[tw.textCenter]}>-</Text>}
                        </View>
                    )
                ))}
            </>
            )}
            {(cast.length || crew.length || tvCast.length || tvCrew.length) && (
                <View style={[tw.pB10, tw.selfCenter]}>
                    <Text style={[tw.mT4, tw.fontBold,tw.textXl, tw.textCenter]}>Toute sa filmographie ({cast.length+crew.length+tvCrew.length+tvCast.length})</Text>
                    <Text style={[tw.mT4, tw.fontBold,tw.textLg, tw.textCenter]}>En tant qu'acteur·rice ({cast.length+tvCast.length})</Text>

                    <TouchableOpacity activeOpacity={0.8} style={[ tw.p2, tw.m2]}>
                        <Text style={[ tw.bgGreen500, styles.otherButton, tw.w40, tw.selfCenter, tw.textWhite, tw.fontBold, tw.textCenter]} onPress={() => setIsCollapsedChildCast(!isCollapsedChildCast)}>Dans un film ({cast.length})</Text>
                    </TouchableOpacity>
                    {cast.length > 0 && (
                    <Collapsible collapsed={isCollapsedChildCast}>
                
                        {cast.length && cast.sort(function(a, b){return new Date(b.release_date) - new Date(a.release_date)}).map((item, index) => (
                            <View key={item.id*index}>
                                <View style={[tw.flexRow, tw.alignCenter, tw.selfCenter, tw.justifyCenter, tw.flexWrap]}>
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={() => {
                                            navigation.push('FilmShow', {
                                                id: item.id
                                            });
                                        }}
                                    >
                                        <Text style={[tw.fontBold, tw.textBlue600]}>{item.title}</Text>
                                    </TouchableOpacity>
                                    <Text>{item.release_date ? ` en ${item.release_date.split('-')[0]}` : ''}</Text>
                                </View>
                                <Text style={[tw.textCenter]}> <Text style={[tw.underline]}>Rôle</Text> : {item.character ?? ' - '}</Text>
                                <RenderSeparator/>
                            </View>
                        ))}
                    </Collapsible>
                    )}
                    <TouchableOpacity activeOpacity={0.8} style={[ tw.p2, tw.m2 ]}>
                        <Text style={[ tw.bgTeal500, styles.otherButton, tw.w40, tw.selfCenter, tw.textWhite, tw.fontBold, tw.textCenter]} onPress={() => setIsCollapsedChildTvCast(!isCollapsedChildTvCast)}>Dans une série ({tvCast.length})</Text>
                    </TouchableOpacity>
                    {tvCast.length > 0 && (
                    <Collapsible collapsed={isCollapsedChildTvCast}>
                        {tvCast.length && tvCast.sort(function(a, b){return new Date(b.first_air_date) - new Date(a.first_air_date)}).map((item, index) => (
                            <View key={item.id*index}>
                                <View style={[tw.flexRow, tw.alignCenter, tw.justifyCenter, tw.flexWrap]}>
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={() => {
                                            navigation.push('SerieShow', {
                                                id: item.id
                                            });
                                        }}
                                    >
                                        <Text style={[tw.fontBold, tw.textBlue600, tw.textCenter]}>{item.name}</Text>
                                    </TouchableOpacity>
                                    <Text>{item.first_air_date ? ` en ${item.first_air_date.split('-')[0]}` : ''}</Text>
                                    <Text style={[tw.textCenter]}> <Text style={[tw.underline]}>Rôle</Text> : {item.character ?? ' - '}</Text>
                                </View>
                                <RenderSeparator/>
                            </View>
                        ))}
                    </Collapsible>
                    )}
                    <Text style={[tw.mT4, tw.fontBold,tw.textLg, tw.textCenter]}>Dans l'équipe technique ou de production ({crew.length+tvCrew.length})</Text>
                    <TouchableOpacity activeOpacity={0.8} style={[ tw.p2, tw.m2]}>
                        <Text style={[tw.bgGreen500, styles.otherButton, tw.w50, tw.textWhite, tw.selfCenter, tw.fontBold, tw.textCenter]} onPress={(e) => setIsCollapsedChildCrew(!isCollapsedChildCrew)}>Films ({crew.length})</Text>
                    </TouchableOpacity>
                    {crew.length > 0 && (
                        <Collapsible collapsed={isCollapsedChildCrew}>
                            {crew.sort(function(a, b){return new Date(b.release_date) - new Date(a.release_date)}).map((item, index) => (
                                <View key={item.id*index}>
                                <View style={[tw.flexRow, tw.alignCenter, tw.selfCenter, tw.justifyCenter, tw.flexWrap]}>
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={() => {
                                            navigation.push('FilmShow', {
                                                id: item.id
                                            });
                                        }}
                                    >
                                        <Text style={[tw.fontBold, tw.textBlue600, tw.textCenter]}>{item.title}</Text>
                                    </TouchableOpacity><Text>{item.release_date ? ` en ${item.release_date.split('-')[0]}` : ''}</Text>
                                </View>
                                    <Text style={[tw.textCenter]}>{item.job ?? ' - '}</Text>
                                <RenderSeparator/>
                            </View>
                            ))}
                        </Collapsible>
                    )}
                    <TouchableOpacity activeOpacity={0.8} style={[ tw.p2, tw.m2]}>
                        <Text style={[tw.bgTeal500, styles.otherButton, tw.w50, tw.textWhite, tw.selfCenter, tw.fontBold, tw.textCenter]} onPress={(e) => setIsCollapsedChildTvCrew(!isCollapsedChildTvCrew)}>Séries ({tvCrew.length})</Text>
                    </TouchableOpacity>
                    {tvCrew.length > 0 && (
                        <Collapsible collapsed={isCollapsedChildTvCrew}>
                            {tvCrew.sort(function(a, b){return new Date(b.first_air_date) - new Date(a.first_air_date)}).map((item, index) => (
                                <View key={item.id*index}>
                                <View style={[tw.flexRow, tw.alignCenter, tw.justifyCenter, tw.flexWrap]}>
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={() => {
                                            navigation.push('SerieShow', {
                                                id: item.id
                                            });
                                        }}
                                    >
                                        <Text style={[tw.fontBold, tw.textBlue600, tw.textCenter]}>{item.name}</Text>
                                    </TouchableOpacity><Text>{item.first_air_date ? ` en ${item.first_air_date.split('-')[0]}` : ''}</Text>
                                </View>
                                <Text style={[tw.textCenter]}>{item.job ?? ' - '}</Text>
                                <RenderSeparator/>
                            </View>
                            ))}
                        </Collapsible>
                    )}
                </View>
            )}
        </ScrollView>)}
        
    </>
    )
}

export default PersonShow;


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