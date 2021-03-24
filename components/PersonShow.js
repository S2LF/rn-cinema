import React, { useState, useEffect } from "react";
import { Image, Text, View, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import {API_KEY} from "@env"
import axios from "axios";
import { tw } from 'react-native-tailwindcss';
import ReadMore from '@fawazahmed/react-native-read-more';
import age from 's-age';
import Collapsible from "react-native-collapsible";
import { useNavigation } from '@react-navigation/native';

import { DEFAULT_MOVIE_POSTER } from '../assets/img/index';
import RenderSeparator from "./RenderSeparator";
import { ScrollView } from "react-native-gesture-handler";

function PersonShow({ route }){

    const navigation = useNavigation();

    const { id } = route.params;

    const [ loading, setLoading ] = useState(true);

    const [infos, setInfos] = useState([]);
    const [cast, setCast] = useState([]);
    const [crew, setCrew] = useState([]);
    const [isCollapsedChildCast, setIsCollapsedChildCast ] = useState(true);
    const [isCollapsedChildCrew, setIsCollapsedChildCrew ] = useState(true);

    

    const url = 'https://api.themoviedb.org/3/';

    useEffect(() => {
        setLoading(true);
        (async () => {
                    const inf = await axios.get(`${url}person/${id}?api_key=${API_KEY}&language=fr-FR&append_to_response=credits`);

                    setInfos(inf.data);
                    setCast(inf.data.credits.cast);
                    setCrew(inf.data.credits.crew);
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
                    <Text style={[tw.textXl, tw.fontBold]}>Chargement...</Text>
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
                    <Image
                        source={{ uri: `https://image.tmdb.org/t/p/w150_and_h225_bestv2${infos.profile_path}`}}
                        style={[{width: 300, height: 300, resizeMode: "contain", paddingBottom: 10}]}
                    />
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
                                {console.log(item)}
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
            {(cast.length || crew.length) && (
                <View style={[tw.pB10]}>
                    <Text style={[tw.mT4, tw.fontBold,tw.textXl, tw.textCenter]}>Toute sa filmographie ({cast.length+crew.length})</Text>
                    <TouchableOpacity activeOpacity={0.8} style={[ tw.p2, tw.m2]}>
                        <Text style={[ tw.bgGreen500, styles.button, tw.w40, tw.selfCenter, tw.textWhite, tw.fontBold, tw.textCenter]} onPress={(e) => setIsCollapsedChildCast(!isCollapsedChildCast)}>En tant qu'acteur ({cast.length})</Text>
                    </TouchableOpacity>
                    {cast.length > 0 && (
                    <Collapsible collapsed={isCollapsedChildCast}>
                        {cast.length && cast.sort(function(a, b){return new Date(b.release_date) - new Date(a.release_date)}).map((item, index) => (
                            <View key={item.id*index} style={[tw.p1]}>
                                <Text style={[ tw.textCenter]}><Text style={[tw.fontBold]}>{item.title}</Text>{item.release_date ? ` en ${item.release_date.split('-')[0]}` : ''}{"\n"}<Text style={[tw.underline]}>Rôle</Text> : {item.character ?? ' - '}</Text>
                                <RenderSeparator/>
                            </View>
                        ))}
                    </Collapsible>
                    )}
                    <TouchableOpacity activeOpacity={0.8}>
                        <Text style={[tw.bgGreen500, styles.button, tw.w50, tw.textWhite, tw.selfCenter, tw.fontBold, tw.textCenter]} onPress={(e) => setIsCollapsedChildCrew(!isCollapsedChildCrew)}>Dans l'équipe technique ou de production ({crew.length})</Text>
                    </TouchableOpacity>
                    {crew.length > 0 && (
                        <Collapsible collapsed={isCollapsedChildCrew}>
                            {crew.sort(function(a, b){return new Date(b.release_date) - new Date(a.release_date)}).map((item, index) => (
                                <View key={item.id*index} style={[tw.p1]}>
                                    <Text style={[ tw.textCenter]}><Text style={[tw.fontBold]}>{item.title}</Text>{item.release_date ? ` en ${item.release_date.split('-')[0]}` : ''}{"\n"}{item.job ?? ' - '}</Text>
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
    modalView: {
      margin: 10,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 10,
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