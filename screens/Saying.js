import React from 'react';
import { Text, View ,TouchableOpacity} from "react-native"
import ScreenLayout from '../components/ScreenLayout';

export default function Saying({navigation, route}){
  console.log(navigation, route);
  return(
    <ScreenLayout>
      <Text style={{color:"black"}}>Sayinh</Text>
    </ScreenLayout>
  )
}