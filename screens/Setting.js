import React,{useState} from 'react';
import { Button, Text,View,Platform, Alert } from 'react-native';

import ScreenLayout from "../components/ScreenLayout";
import {Picker} from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';

const BUTTON_COLOR = "#0A82FF"

const REGISTER_TIME = gql`
  mutation editProfile($time:String){
    editProfile(time:$time){
      ok
      error 
    }
  }
`

let hours = new Array(24);
for(let i=0;i<24;i++){
  hours[i]=i;
}
let minutes = new Array(60);
for(let i=0;i<60;i++){
  minutes[i]=i;
}
export default function Setting(){
  const [hour, setHour] = useState(7);
  const [minute, setMinute] = useState(30);

  const [registerTime] = useMutation(REGISTER_TIME,{
    onCompleted:(data)=>{
      console.log(data);
      Alert.alert("푸시알림이 등록되었습니다.");
    }
  });
  return <ScreenLayout>
    <View style={{
      flex:1,
      width: "100%",
      paddingHorizontal: 10,
      paddingVertical: 10,
      backgroundColor:"white"
    }}>
      <View style={{flexDirection:"row"}}>
        <Ionicons name="notifications" size={20} color="tomato"/>
        <Text style={{
          fontWeight: "700",
          fontSize: 18,
        }}>푸시알림 설정</Text>
      </View>
      <View
      style={{
        padding:10,
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"center"
      }}
    >
      <View>
        <Picker
          selectedValue={hour}
          style={{
            height: 50,
            width: 100,
          }}
          mode="dropdown"
          onValueChange={(val,idx)=>setHour(val)}
        >
          {
            hours.map((item,index)=>{
              console.log(index);
              return <Picker.Item key={index} label={String(index)+"시"} value={index}/>
            })
          }
        </Picker>
      </View>
      <View>
        <Picker
          selectedValue={minute}
          style={{
            height: 50,
            width: 100,
          }}
          onValueChange={(val,idx)=>setMinute(val)}
        >
          {
            minutes.map((item,index)=>{
              console.log(index);
              return <Picker.Item key={index} label={String(index)+"분"} value={index}/>
            })
          }
        </Picker>
      </View>
    </View>
    <View style={{
      marginTop: Platform.OS==="ios"?170:10
    }}>
      <TouchableOpacity style={{
        justifyContent:"center",
        alignItems:"center",
        padding:10,
        borderRadius: 25,
        marginHorizontal: 10,
        backgroundColor: BUTTON_COLOR
      }}
        onPress={()=>{
          registerTime({
            variables:{
              time: `${hour},${minute}`
            }
          })
        }}
      >
        <Text style={{
          color:"white",
          fontSize: 18,
          fontWeight:"600"
        }}>알림 등록</Text>
      </TouchableOpacity>
    </View>
    </View>


  </ScreenLayout>
}