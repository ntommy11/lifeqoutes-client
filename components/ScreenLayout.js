import React from "react";
import { useColorScheme,ActivityIndicator, View } from "react-native";

export default function ScreenLayout({loading, children}){
  const colorScheme = useColorScheme();
  console.log(colorScheme)
  return <View style={{
    backgroundColor:colorScheme==="dark"?"black":"white", 
    flex:1, 
    alignItems:"center",
    justifyContent: "center" }}>
    {loading? <ActivityIndicator color="black"/>:children}
  </View>
}