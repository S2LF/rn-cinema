import React, { useState, useEffect  } from "react";
import { Image, Text, View, ActivityIndicator, TouchableOpacity} from "react-native";
import {API_KEY} from "@env"
import axios from "axios";
import { tw } from 'react-native-tailwindcss';
import age from 's-age';
import { useNavigation } from '@react-navigation/native';


import { DEFAULT_USER_POSTER } from '../assets/img/index';

function PersonRow({name, profile_path, index, id, known_for}){

    const navigation = useNavigation();


    const [loading, setLoading] = useState(true)
    const [infos, setInfos] = useState([]);
    const [cast, setCast] = useState([]);
    const [crew, setCrew] = useState([]);


    const url = 'https://api.themoviedb.org/3/';

    useEffect(() => {
        setLoading(true);
        (async () => {
                    const inf = await axios.get(`${url}person/${id}?api_key=${API_KEY}&language=fr-FR&append_to_response=credits`);
                    setInfos(inf.data);
                    setCast(inf.data.credits.cast);
                    setLoading(false);
            })();
    }, []);
    
    let mainFilmsFilter = [];

    if(known_for.length){
        known_for.forEach(element => {
            let el = cast.filter((e) => {return e.id == element.id });
            mainFilmsFilter.push(el[0]);
        });
    }

    return (
    <>
        { loading ? (
            <>
                <View style={{flex: 1, justifyContent: "center", flexDirection: "row", justifyContent: "space-around", padding: 10 }}>
                    <ActivityIndicator  size="large" color="#0000ff"/>
                </View>
            </>
        ) : (
            <>
            <Text style={[tw.textBlack, tw.textCenter, tw.text2xl, tw.pB2, tw.pT2, tw.fontBold]}>{name}</Text>
            <View style={[ tw.wFull, tw.flexRow, (index % 2) && tw.flexRowReverse]}>
                {!profile_path ? (
                    <Image
                        source={DEFAULT_USER_POSTER}
                        style={{ width: 150, height: 150, resizeMode: "contain" }}
                    />
                ) : (
                    <Image
                        source={{ uri: `https://image.tmdb.org/t/p/w150_and_h225_bestv2${profile_path}`}}
                        style={{ width: 150, height: 150, padding: 0, resizeMode: "contain" }}
                    />
                )}
                <View style={[tw.flex1, tw.alignCenter, tw.justifyAround, tw.pL2, tw.pR2]}>
                    <Text><Text style={[tw.underline]}>Né(e) le</Text>: { infos.birthday ? infos.birthday.split('-').reverse().join('/') : ' - '} {!infos.deathday && infos.birthday ? `(${(age(infos.birthday.split('-')[0]))} ans)` : ''}</Text>
                    { infos.deathday ? <Text><Text style={[tw.underline]}>Décès le</Text>: { infos.deathday ? infos.deathday.split('-').reverse().join('/') : ' - '}</Text> : <Text>{''}</Text>}
                    <View>
                        <Text>
                            <Text style={[tw.underline]}>Connus pour</Text>:{"\n"}
                            { known_for && known_for.map((el) => (
                                (el.media_type) === "tv" ? 
                                (
                                    <Text key={el.id}>{el.name}{"\n"}</Text>
                                ) : (
                                    <Text key={el.id}>{el.title}{"\n"}</Text>
                                )
                            )) 
                            }
                        </Text>
                    </View>
                    <TouchableOpacity activeOpacity={0.8} style={[tw.bgGreen400, tw.p1,tw.itemsCenter, tw.rounded]} onPress={() => {
                        // setModalVisible(true);
                        navigation.push('PersonShow', {
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

export default PersonRow;
