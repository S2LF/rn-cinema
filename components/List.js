import React, { useState } from "react";
import { useEffect } from "react";
import { StyleSheet, Text, View, FlatList, ActivityIndicator } from "react-native";
import {API_KEY} from "@env"
import axios from "axios";
import { tw } from 'react-native-tailwindcss';

import FilmRow from './FilmRow';
import PersonRow from "./PersonRow";
import SerieRow from './SerieRow';
import RenderSeparator from "./RenderSeparator";



function List({ route }) {
    
    // https://api.themoviedb.org/3/search/movie?api_key=6a0bc0546f0c4bea10345001c61a431f&query='star wars'&language=fr-FR

    const [ result, setResult ] = useState([])
    const [ loading, setLoading ] = useState(true);

    const url = 'https://api.themoviedb.org/3/'

    // if(film.poster_path == null){
    //     oneListFilm +=("<img class='img_default' src='default-movie.png'><br>")
    // } else {
    //     oneListFilm +=("<img src='https://image.tmdb.org/t/p/w150_and_h225_bestv2"+film.poster_path+"'><br>")
    // }

    const { search, type } = route.params;
    useEffect(() => {
        setLoading(true);
        (async () => {
            switch (type) {
                case 'Film':
                    const resultFilm = await axios.get(`${url}search/movie?api_key=${API_KEY}&query=${search}&language=fr-FR`);
                    setResult(resultFilm.data.results);
                    setLoading(false);
                    break;
                case 'Personne':
                    const resultPerson = await axios.get(`${url}search/person?api_key=${API_KEY}&query=${search}&language=fr-FR`);
                    setResult(resultPerson.data.results);
                    // console.log(resultPerson.data.results);
                    setLoading(false);
                    break;
                case 'Série':
                    const resultSerie = await axios.get(`${url}search/tv?api_key=${API_KEY}&query=${search}&language=fr-FR`);
                    setResult(resultSerie.data.results);
                    setLoading(false);
                break;
                default:
                    break;
            }
        })();
    }, []);

    console.log('search', search, 'type', type)
    return (
    <>
    { loading ? (
        <>
            <View style={{flex: 1, justifyContent: "center", flexDirection: "row", justifyContent: "space-around", padding: 10 }}>
                <ActivityIndicator  size="large" color="#0000ff"/>
            </View>
        </>
        ) : ((
        (type === "Film") ? (
            <>
                <View style={[tw.shadow, tw.bgWhite, tw.p2]} >
                    <Text style={[tw.textCenter]}>{type} : {search}</Text>
                </View>
                { result.length ? (
                    <FlatList 
                        data={result}
                        keyExtractor={(item) => `list-item-${item.id}`}
                        ItemSeparatorComponent={RenderSeparator}
                        renderItem={({item, index}) => (
                            <FilmRow
                                poster_path={item.poster_path}
                                title={item.title}
                                release_date={item.release_date}
                                index={index}
                                id={item.id}
                                overview={item.overview}
                            />
                        )}
                    />
                ) : (
                    <View style={[tw.justifyCenter, tw.flex1]}><Text style={[tw.textCenter, tw.fontBold]}>Aucun résultat pour cette recherche.</Text></View>
                )}
            </>
        ) : 
        (type === 'Personne') ? (
            <>
                <View style={[tw.shadow, tw.bgWhite, tw.p2]} >
                        <Text style={[tw.textCenter]}>{type} : {search}</Text>
                </View>
                { result.length ? (
                    <FlatList
                        data={result}
                        keyExtractor={(item) => `list-item-${item.id}`}
                        ItemSeparatorComponent={RenderSeparator}
                        renderItem={({item, index}) => (
                            <PersonRow
                                name={item.name}
                                profile_path={item.profile_path}
                                index={index}
                                id={item.id}
                                known_for={item.known_for}
                                gender={item.genre}
                            />
                        )}
                    />
                ) : (
                    <View style={[tw.justifyCenter, tw.flex1]}><Text style={[tw.textCenter, tw.fontBold]}>Aucun résultat pour cette recherche.</Text></View>
                )}
            </>
        ) : 
        (type === 'Série') && (
            <>
                <View style={[tw.shadow, tw.bgWhite, tw.p2]} >
                    <Text style={[tw.textCenter]}>{type} : {search}</Text>
                </View>
                { result.length ? (
                    <FlatList 
                        data={result}
                        keyExtractor={(item) => `list-item-${item.id}`}
                        ItemSeparatorComponent={RenderSeparator}
                        renderItem={({item, index}) => (
                            <SerieRow
                                poster_path={item.poster_path}
                                title={item.name}
                                release_date={item.first_air_date}
                                index={index}
                                id={item.id}
                                overview={item.overview}
                            />
                        )}
                    />
                ) : (
                    <View style={[tw.justifyCenter, tw.flex1]}><Text style={[tw.textCenter, tw.fontBold]}>Aucun résultat pour cette recherche.</Text></View>
                )}
            </>
        )
    ))}
    </>
    );
}

export default List;
