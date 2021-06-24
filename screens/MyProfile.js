import React, { useEffect,useState } from 'react';
import { Text, View ,TouchableOpacity, ActivityIndicator, StyleSheet, Alert} from "react-native"
import ScreenLayout from '../components/ScreenLayout';
import { logUserOut } from '../apollo';
import gql from 'graphql-tag';
import { useMutation, useQuery } from '@apollo/client';
import {Ionicons} from '@expo/vector-icons';
import { useColorScheme } from 'react-native-appearance';
import { colors } from '../colors';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker';

const css = StyleSheet.create({
  itemContainer: darkmode=>({
    width:"100%",
    borderBottomWidth: 1,
    borderColor:darkmode?"rgba(255,255,255,0.15)":"#dedede",
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection:"row",
    justifyContent:"space-between"
  }),
  container: darkmode=>({
    width:"100%", 
    flex:1,
    alignItems:"center",
    justifyContent:"center",
    backgroundColor: darkmode?colors.dark:"white",
  }),
  header:{
    width:"100%",
    alignItems:"center",
    justifyContent:"center",
    borderColor:"#dedede",
    borderBottomWidth:1,
    flex:1
  },
  footer:{
    width:"100%",
    flex:1,
  },
  itemLeft:{
    flexDirection:"row", alignItems:"center"
  }

});

const SEE_MY_PROFILE = gql`
  query seeMyProfile{
    seeMyProfile{
      id,
      name,
      email,
      createdAt,
      bio,
      avatar,
      totalSayings,
      totalLikes,
      tags{
        id
      }
    }
  }
`
const LOGOUT = gql`
  mutation logout{
    logout{
      ok
      error 
    }
  }
`

export default function Search({navigation}){

  // color theme
  const colorScheme = useColorScheme();
  const darkmode = colorScheme==='dark';
  const textColor = darkmode?"white":"black";

  const {data, loading, error} = useQuery(SEE_MY_PROFILE);
  const [logoutMutation] = useMutation(LOGOUT,{
    onCompleted:(data)=>{
      console.log(data);
      //Alert.alert("로그아웃");
    },
  });
  const [value, setValue] = useState("");

  useEffect(()=>{
    navigation.setOptions({
      title: "내 프로필"
    })
  },[]);

  if(data){
    console.log(data);
    const user = data.seeMyProfile;
    return(
      <View style={css.container(darkmode)}>
        <View style={css.header}>
          <Ionicons name="person-circle" color="#dedede" size={72}/>
          <Text style={{color:textColor, fontWeight:"bold", fontSize:20}}>{user.name}</Text>
          <Text style={{color:textColor}}>{user.email}</Text>
        </View>
        <View style={css.footer}>
          <TouchableOpacity 
            onPress={()=>navigation.push("SayingList",{
              id: Number(user.id),
              keyword: "내가 작성한 말",
              type: "userCreate",
            })}
            style={css.itemContainer(darkmode)}
          >
            <View style={css.itemLeft}>
              <Ionicons name="create" size={20} color={textColor} style={{marginRight:5}}/>
              <Text style={{color:textColor, fontSize:20}}>작성 {user.totalSayings}</Text>
            </View>
            <Ionicons name="chevron-forward" color={textColor} size={24}/>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={()=>navigation.push("SayingList",{
              id: Number(user.id),
              keyword: "내가 찜한 말",
              type: "myLike",
            })}
            style={css.itemContainer(darkmode)}
          >
            <View style={css.itemLeft}>
              <Ionicons name="heart" size={20} color="tomato" style={{marginRight:5}}/>
              <Text style={{color:textColor, fontSize:20}}>찜 {user.totalLikes}</Text>
            </View>
            <Ionicons name="chevron-forward" color={textColor} size={24}/>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={()=>navigation.navigate("EditTags")}
            style={css.itemContainer(darkmode)}>
            <View style={css.itemLeft}>
              <Ionicons name="star" size={20} color={"orange"} style={{marginRight:5}}/>
              <Text style={{color:textColor, fontSize:20}}>관심 태그</Text>
            </View>
            <Ionicons name="chevron-forward" color={textColor} size={24}/>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={{marginBottom:10}} onPress={()=>{
          logoutMutation({
            update:(cache,{data:{logout:ok}})=>{
              if(ok){
                cache.evict({
                  id:`User:${user.id}`
                })
              }
            }
          });
          logUserOut();
        }}>
          <Text style={{color:"tomato"}}>로그아웃</Text>
        </TouchableOpacity>
      </View>
    )
  }
  if(loading){
    return(  
      <ScreenLayout>
        <ActivityIndicator/>
      </ScreenLayout>
    );
  }
  if(error){
    console.log(error);
  }
}