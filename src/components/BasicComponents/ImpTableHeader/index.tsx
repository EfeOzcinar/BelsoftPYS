/* eslint-disable keyword-spacing */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
/* eslint-disable prettier/prettier */
import React from 'react';
import { Text, View } from 'react-native';

interface tableHeaderProps {
    headerStringList:string[];
    style?:any;
}
function ImpTableHeader({headerStringList,style}:tableHeaderProps){
    return(
        <View style={{flexDirection:'row',display:'flex',...style}}>
            {
                headerStringList.map((item:string)=>(
                    <Text numberOfLines={1} style={{fontWeight:'bold',width:`${95 / headerStringList.length}%`}}>{item}</Text>
                ))
            }
        </View>
    );
}

export default ImpTableHeader;
