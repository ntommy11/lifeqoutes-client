import React from 'react';
import { Text, View ,TouchableOpacity} from "react-native"
import ScreenLayout from '../components/ScreenLayout';

export default function Search({navigation}){
  return(
    <ScreenLayout>
      <Text style={{color:"white"}}>Feed!</Text>
      <TouchableOpacity onPress={()=> navigation.navigate("Photo")}>
        <Text style={{color:"white"}}>Photo</Text>
      </TouchableOpacity>
    </ScreenLayout>
  )
}