import React, { useState } from "react";
import { useEffect } from "react";
import { Image, Text, View, ActivityIndicator, TouchableOpacity} from "react-native";
import {API_KEY} from "@env"
import axios from "axios";
import { tw } from 'react-native-tailwindcss';
import Collapsible from "react-native-collapsible";
import { useNavigation } from '@react-navigation/native';

import { DEFAULT_MOVIE_POSTER } from '../assets/img/index';

function FilmRow({ poster_path, title, release_date, index, id}){

    const navigation = useNavigation();

    const [loading, setLoading] = useState(true);
    const [infos, setInfos] = useState([]);
    const [crew, setCrew] = useState([]);

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
                    <Image
                        source={DEFAULT_MOVIE_POSTER}
                        style={{ width: 150, height: 150, resizeMode: "contain" }}
                    />
                ) : (
                    <Image
                        source={{ uri: `https://image.tmdb.org/t/p/w150_and_h225_bestv2${poster_path}`}}
                        style={{ width: 150, height: 150, padding: 0, resizeMode: "contain" }}
                    />
                )}
                <View style={[tw.flex1, tw.alignCenter, tw.justifyAround, tw.pL2, tw.pR2]}>
                    <Text><Text style={[tw.underline]}>Année de sortie</Text>: {release_date && release_date.split('-')[0]}</Text>
                    <View style={[tw.flexRow, tw.alignCenter]}><Text style={[tw.underline]}>Réalisateur</Text><Text>:</Text>
                    {producer.length ? (
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
                            <Text style={[tw.underline]}>Genres</Text>:{"\n"}
                            { infos.genres && infos.genres.map((el, index) => (
                                (index+1 == infos.genres.length) ? <Text key={el.id}>{el.name}</Text> : <Text key={el.id}>{el.name+' - '}</Text>
                            )) 
                            }
                        </Text>
                    </View>
                    <TouchableOpacity activeOpacity={0.8} style={[tw.bgGreen400, tw.p1,tw.itemsCenter, tw.rounded]} onPress={() => {
                        // setModalVisible(true);
                        navigation.push('FilmShow', {
                            id: id
                        });
                    }}><Text style={[tw.textWhite, tw.fontBold]}>En savoir +</Text></TouchableOpacity>
                </View>
            </View>
            </>
        )}
    </>
    )

}

export default FilmRow;
