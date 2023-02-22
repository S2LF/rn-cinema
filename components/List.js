import React, { useState, useEffect } from "react";
import { Text, View, FlatList, ActivityIndicator, Image } from "react-native";
import { API_KEY } from "@env"
import axios from "axios";
import { tw } from 'react-native-tailwindcss';

import FilmRow from './FilmRow';
import PersonRow from "./PersonRow";
import SerieRow from './SerieRow';
import RenderSeparator from "./RenderSeparator";

import { LOGO } from '../assets/img/index';


function List({ route }) {

    const [result, setResult] = useState([])
    const [loading, setLoading] = useState(true);


    const url = 'https://api.themoviedb.org/3/'

    const { search, type } = route.params;
    useEffect(() => {
        setLoading(true);
        (async () => {
            switch (type) {
                case 'Film':
                    console.log('search', search, 'type', type)
                    let resultFilm = [];
                    // Make a try/catch for the request
                    try {
                        resultFilm = await axios.get(`${url}search/movie?api_key=${API_KEY}&query=${search}&language=fr-FR`);
                        setResult(resultFilm.data.results);
                        setLoading(false);
                    } catch (error) {
                        console.log('error', error);
                    }


                    // const resultFilm = await axios.get(`${url}search/movie?api_key=${API_KEY}&query=${search}&language=fr-FR`);
                    // Make request for movies with a query with fetch*
                    // const resultFilm = await fetch(`${url}search/movie?api_key=${API_KEY}&query=${search}&language=fr-FR`)
                    // .then((response) => response.json())
                    // .then((json) => {
                    //     console.log(json);
                    //     return json;
                    // })


                    // console.log(resultFilm.data.results);
                    
                    setLoading(false);
                    break;
                case 'Personne':
                    try {
                        console.log("5")
                        const resultPerson = await axios.get(`${url}search/person?api_key=${API_KEY}&query=${search}&language=fr-FR`);
                        setResult(resultPerson.data.results);
                        setLoading(false);
                    } catch (error) {
                        console.log('error', error);
                    }
                    break;
                case 'Série':
                    try {
                        console.log("6")
                        const resultSerie = await axios.get(`${url}search/tv?api_key=${API_KEY}&query=${search}&language=fr-FR`);
                        setResult(resultSerie.data.results);
                        setLoading(false);
                    } catch (error) {
                        console.log('error', error);
                    }
                    break;
                default:
                    break;
            }
        })();
    }, []);

    // console.log('search', search, 'type', type)
    return (
        <>
            {loading ? (
                <>
                    <View style={{ flex: 1, justifyContent: "center", alignSelf: 'center', padding: 10 }}>
                        <Image source={LOGO} style={{ width: 150, height: 150, resizeMode: "contain" }} />
                        <Text style={[tw.textXl, tw.fontBold, tw.selfCenter]}>Chargement...</Text>
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                </>
            ) : ((
                (type === "Film") ? (
                    <>
                        {/* Make console log in react render */}
                        <View style={[tw.shadow, tw.bgWhite, tw.p2]} >
                            <Text style={[tw.textCenter]}>{type} : {search}</Text>
                        </View>
                        {result.length > 0 ? (
                            <FlatList
                                data={result}
                                keyExtractor={(item) => `list-item-${item.id}`}
                                ItemSeparatorComponent={RenderSeparator}
                                renderItem={({ item, index }) => (
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
                            {result.length > 0 ? (
                                <FlatList
                                    data={result}
                                    keyExtractor={(item) => `list-item-${item.id}`}
                                    ItemSeparatorComponent={RenderSeparator}
                                    renderItem={({ item, index }) => (
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
                                {result.length > 0 ? (
                                    <FlatList
                                        data={result}
                                        keyExtractor={(item) => `list-item-${item.id}`}
                                        ItemSeparatorComponent={RenderSeparator}
                                        renderItem={({ item, index }) => (
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
