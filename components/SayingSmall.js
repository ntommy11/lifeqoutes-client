import React from 'react';
import { useState } from 'react';
import { createContext } from 'react';
import { useEffect } from 'react';
import { Image, Text, useWindowDimensions, View, StyleSheet,TouchableOpacity, Platform } from 'react-native';
import { useColorScheme } from 'react-native-appearance';
import styled from "styled-components/native";
import { Ionicons } from '@expo/vector-icons';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';


const ss = StyleSheet.create({
  container: colorScheme=>({
    flex: 1,
    borderWidth: 1,
    backgroundColor: colorScheme==="dark"?"rgba(255,255,255,0.1)":"white",
    width: "85%",
    borderRadius: 20,
    maxHeight: 500,
    marginVertical: 30,
    minHeight: 300,
    /*...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width:2, height: -1},
        shadowOpacity: 0.3,
      },
      android:{
        elevation: 1
      }
    }),*/
  }),
  body:{
    flex:8,
    justifyContent: "center",
    alignItems: "center",
  },
  sayingText:colorScheme=>({
    color: `${colorScheme==="dark"?"white":"black"}`,
    fontSize: 18,
  }),
  author: colorScheme=>({
    color: `${colorScheme==="dark"?"#ababab":"#323232"}`	,
    fontSize: 14,
  }),
  comment:{
    marginLeft: 10,
    marginRight: 10,
    borderWidth: 1,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center"
  },
  likes:{
    borderWidth: 1,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center"
  }
})

function Tag({id, name}){
  console.log(id, name);
  return (
    <TouchableOpacity style={{
      borderWidth: 0,
      borderRadius: 15,
      paddingVertical: 5,
      paddingHorizontal: 10,
      marginLeft: 5,
      marginBottom: 15,
      backgroundColor: "#eeeeee",
      
    }}>
      <Text style={{color:"#464646"}}>{name}</Text>
    </TouchableOpacity>
  )
}

const TOGGLE_LIKE = gql`
  mutation toggleLike($id:Int!){
    toggleLike(id: $id){
      ok
      error 
    }
  }
`

export default function Saying({id, user, text, tags, author, isLike, isMine, totalLikes, totalComments}){
  console.log("Saying::text=",text);
  const navigation = useNavigation();
  //const {id, user, text, tags, author, isLike, isMine, totalLikes, totalComments} = data.seeSaying;
  //console.log("data:",data)
  const colorScheme = useColorScheme();
  
  const textColor = colorScheme==="dark"?"#fff":"#000";


  const [toggleLike] = useMutation(TOGGLE_LIKE,{
    variables:{
      id,
    },
    update: (cache, { data:{toggleLike:{ok}}})=>{
      console.log("ok=",ok);
      if(ok){
        const target = `Saying:${id}`; // 수정할 대상을 지정
        cache.modify({
          id: target,
          fields:{
            isLike(prev){
              return !prev;
            },
            totalLikes(prev){
              if (isLike) return prev-1;
              else return prev+1;
            },
          },
        });
      }
    },
    onCompleted:(data)=>console.log(data),
  });
  return(
    <View style={ss.container(colorScheme)}>
      <TouchableOpacity style={ss.body} onPress={()=>navigation.navigate("Saying",{
        sid: id,
      })}>
        <View style={{

          paddingVertical: 30, 
          paddingHorizontal:20}}>
          <Text style={ss.sayingText(colorScheme)}>{text}</Text>
        </View>
        <TouchableOpacity style={{

        }}>
          <Text style={ss.author(colorScheme)}>{author.name}</Text>
        </TouchableOpacity>
      </TouchableOpacity>
      <View style={{
          borderWidth: 1,
          borderStyle: "dashed",
          alignItems:"center",
          paddingHorizontal: 10,
          flex: 1,
          flexDirection: 'row'
        }}>
          <TouchableOpacity style={ss.likes} onPress={toggleLike}>
            <Ionicons 
              name={isLike?"heart":"heart-outline" }
              size={30} 
              color={isLike?"tomato":textColor}/>
            <Text style={{
              color:textColor
            }}>{totalLikes}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={ss.comment}>
            <Ionicons name="chatbox-outline" size={30} color={textColor}/>
            <Text style={{
              color:textColor
            }}>{totalComments}</Text>
          </TouchableOpacity>
          {
            tags.map((item,index)=><Tag key={index} {...item}/>)
          }
        </View>
    </View>
  )
}

/*
    <Container>
      <Body>
        <SayingText>
          ${text}
        </SayingText>
      </Body>
      <Footer>
        <Action>
        </Action>
        <Action>

        </Action>
        <Tags>

        </Tags>
        <User>
          ${user.username}
        </User>
      </Footer>
    </Container>
*/