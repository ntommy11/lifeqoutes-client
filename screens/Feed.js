import React from 'react';
import { Text, View, TouchableOpacity } from "react-native"
import { logUserOut } from '../apollo';

export default function Feed(){

  return(
    <View>
      <Text>Feed!</Text>
      <TouchableOpacity onPress={async()=>{await logUserOut()}}>
        <Text>로그아웃</Text>
      </TouchableOpacity>
    </View>
  )
}