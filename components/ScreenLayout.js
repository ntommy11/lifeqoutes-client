import React from "react";
import { useColorScheme,ActivityIndicator, View } from "react-native";
import {colors} from '../colors'


export default function ScreenLayout({loading, children}){
  const colorScheme = useColorScheme();
  //console.log(colorScheme)
  return <View style={{
    backgroundColor:colorScheme==="dark"?colors.dark:colors.skin, 
    flex:1, 
    alignItems:"center",
    width:"100%",
    justifyContent: "center" }}>
    {loading? <ActivityIndicator color="black"/>:children}
  </View>
}