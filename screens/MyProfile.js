import React from 'react';
import { Text, View ,TouchableOpacity} from "react-native"
import ScreenLayout from '../components/ScreenLayout';
import { logUserOut } from '../apollo';

export default function Search({navigation}){
  return(
    <ScreenLayout>
      <Text style={{color:"white"}}>Profile!</Text>
      <TouchableOpacity onPress={()=>logUserOut()}>
        <Text style={{color:"white"}}>Log out</Text>
      </TouchableOpacity>
    </ScreenLayout>
  )
}