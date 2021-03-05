import React, { useContext } from "react";
import { useEffect } from "react";
import { Text, View } from "react-native";


function List({ route }) {
    
    const { search, type } = route.params;

    useEffect(() => {
        switch (type) {
            case Film:
                const result = await axios.get(``)
                break;
        
            default:
                break;
        }
    })


    console.log('search', search, 'type', type)
    return (
    <Text>{search} {type}</Text>

    

    );
}

export default List;
