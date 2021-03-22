import React, { useState } from "react";
import { useEffect } from "react";
import { Image, Text, View, ActivityIndicator, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import {API_KEY} from "@env"
import axios from "axios";
import { tw } from 'react-native-tailwindcss';
import Collapsible from "react-native-collapsible";
import { useNavigation } from '@react-navigation/native';

import { DEFAULT_MOVIE_POSTER } from '../assets/img/index';
import { DEFAULT_USER_POSTER } from '../assets/img/index';
import RenderSeparator from "./RenderSeparator";
import ReadMore from "@fawazahmed/react-native-read-more";


export default function FilmShow({ route }){

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
                    <Text style={[tw.textXl, tw.fontBold]}>Chargement...</Text>
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
                <Image
                    source={{ uri: `https://image.tmdb.org/t/p/w150_and_h225_bestv2${infos.poster_path}`}}
                    style={{ width: 300, height: 300, resizeMode: "contain", paddingBottom: 10 }}
                />
            )}
            <Text style={[tw.mT4, tw.fontBold,tw.textXl, tw.pB2]}>Synopsis</Text>
            {infos.overview ?
            <ReadMore seeLessText={'Voir moins'} seeMoreText={'Voir plus'} seeLessStyle={{color: '#3182ce', fontWeight: 'bold'}} seeMoreStyle={{color: '#3182ce', fontWeight: 'bold'}} numberOfLines={6}>
                { infos.overview }
            </ReadMore>
            : <Text> - </Text>}
            <Text style={[tw.mT4, tw.fontBold,tw.textXl]}>Année de sortie{"\n"}</Text>
            {infos.release_date ?
                <Text style={[tw.textLg]}>{ infos.release_date.split('-')[0] }</Text>
            : <Text> - </Text>}
            <Text style={[tw.mT4, tw.fontBold,tw.textXl]}>Pays de production{"\n"}</Text>
            {infos.production_countries.length ?
                infos.production_countries.map((item) => (
                    <Text key={item.iso_3166_1}>{item.name}</Text>
                ))
            : <Text> - </Text>}
            <Text style={[tw.mT4, tw.fontBold,tw.textXl]}>Réalisateur{"\n"}</Text>
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
            <Text style={[tw.mT4, tw.fontBold,tw.textXl]}>Acteurs principaux{"\n"}</Text>
            {cast.length ? cast.slice(0,3).map((item) => (
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
            <Text style={[tw.mT4, tw.fontBold,tw.textXl]}>Genres{"\n"}</Text>
            { infos.genres.length ?
            <Text style={[tw.textCenter]}>
                {infos.genres.map((el, index) => (
                    (index+1 == infos.genres.length) ? el.name : el.name+' - '
                ))}
            {"\n"}</Text>
            : <Text> - {"\n"}</Text>}
            {(cast.length || crew.length) && (
                <View  style={[tw.pB10, tw.selfCenter]}>
                    <Text style={[tw.mT4, tw.fontBold,tw.textXl, tw.textCenter]}>Casting, équipe technique et de production ({cast.length+crew.length})</Text>
                    <TouchableOpacity activeOpacity={0.8}  style={[ tw.p2, tw.m2]} onPress={(e) => setIsCollapsedChildCast(!isCollapsedChildCast)}>
                        <Text style={[ tw.bgGreen500, styles.button, tw.w40, tw.selfCenter, tw.textWhite, tw.fontBold, tw.textCenter]} >Casting ({cast.length})</Text>
                    </TouchableOpacity>
                    {crew.length && (
                    <Collapsible collapsed={isCollapsedChildCast}>
                        {cast.length && cast.sort(function(a, b){return new Date(b.release_date) - new Date(a.release_date)}).map((item) => (
                            <View key={item.id} style={[tw.p1, tw.textCenter, tw.flexRow]}>
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
                                <RenderSeparator/>
                            </View>
                        ))}
                    </Collapsible>
                    )}
                    <TouchableOpacity activeOpacity={0.8} onPress={(e) => setIsCollapsedChildCrew(!isCollapsedChildCrew)}>
                        <Text style={[tw.bgGreen500, styles.button, tw.w50, tw.textWhite, tw.selfCenter, tw.fontBold, tw.textCenter]} >Équipe technique et de production ({crew.length})</Text>
                    </TouchableOpacity>
                    {crew.length && (
                        <Collapsible collapsed={isCollapsedChildCrew}>
                            {crew.sort(function(a, b){return new Date(b.release_date) - new Date(a.release_date)}).map((item, index) => (
                                <View key={item.id*index} style={[tw.p1, tw.textCenter]}>
                                    <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => {
                                        navigation.push('PersonShow', {
                                            id: item.id
                                        });
                                    }}
                                >
                                    <Text style={[tw.fontBold, tw.textBlue600]}>{item.job}</Text>
                                </TouchableOpacity>
                                    <Text>{"\n"}{item.name ?? ' - '}</Text>
                                    <RenderSeparator/>
                                </View>
                            ))}
                        </Collapsible>
                    )}
                </View>
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