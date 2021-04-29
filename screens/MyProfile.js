import React, { useEffect } from 'react';
import { Text, View ,TouchableOpacity, ActivityIndicator, StyleSheet} from "react-native"
import ScreenLayout from '../components/ScreenLayout';
import { logUserOut } from '../apollo';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import {Ionicons} from '@expo/vector-icons';
import { useColorScheme } from 'react-native-appearance';
import { colors } from '../colors';


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
    }
  }
`

export default function Search({navigation}){

  // color theme
  const colorScheme = useColorScheme();
  const darkmode = colorScheme==='dark';
  const textColor = darkmode?"white":"black";

  const {data, loading, error} = useQuery(SEE_MY_PROFILE);

  useEffect(()=>{
    navigation.setOptions({
      title: "내 프로필"
    })
  },[]);

  if(data){
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
            onPress={()=>navigation.navigate("SayingList",{
              id: Number(user.id),
              keyword: "내가 작성한 말",
              type: "userCreate",
            })}
            style={css.itemContainer(darkmode)}
          >
            <View style={css.itemLeft}>
              <Ionicons name="create" size={20} color={textColor} style={{marginRight:5}}/>
              <Text style={{color:textColor, fontSize:20}}>작성</Text>
            </View>
            <Ionicons name="chevron-forward" color={textColor} size={24}/>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={()=>navigation.navigate("SayingList",{
              id: Number(user.id),
              keyword: "내가 찜한 말",
              type: "userLike",
            })}
            style={css.itemContainer(darkmode)}
          >
            <View style={css.itemLeft}>
              <Ionicons name="heart" size={20} color="tomato" style={{marginRight:5}}/>
              <Text style={{color:textColor, fontSize:20}}>찜</Text>
            </View>
            <Ionicons name="chevron-forward" color={textColor} size={24}/>
          </TouchableOpacity>
          <TouchableOpacity style={css.itemContainer(darkmode)}>
            <View style={css.itemLeft}>
              <Ionicons name="star" size={20} color={"orange"} style={{marginRight:5}}/>
              <Text style={{color:textColor, fontSize:20}}>관심 태그</Text>
            </View>
            <Ionicons name="chevron-forward" color={textColor} size={24}/>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={()=>logUserOut()}>
          <Text style={{color:"white"}}>Log out</Text>
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