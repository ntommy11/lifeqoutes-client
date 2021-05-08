import React from 'react';
import { useState } from 'react';
import { createContext } from 'react';
import { useEffect } from 'react';
import { Image, Text, useWindowDimensions, View, StyleSheet,TouchableOpacity, Platform, ScrollView, LogBox, Alert } from 'react-native';
import { useColorScheme } from 'react-native-appearance';
import styled from "styled-components/native";
import { Ionicons } from '@expo/vector-icons';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../colors';

LogBox.ignoreAllLogs([
  'Non-serializable values were found in the navigation state',
]);

function Tag({id, name}){
  //console.log(id, name);
  return (
    <TouchableOpacity style={ss.tagWrapper}>
      <Text style={{color:"#464646"}}>{name}</Text>
    </TouchableOpacity>
  )
}

function Today({darkmode}){
  return(
    <View style={ss.today(darkmode)}>
      <Text style={{ color: darkmode?"#ababab":"#787878"}}>오늘의 말</Text>
    </View>
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
const DELETE_SAYING = gql`
  mutation deleteSaying($id:Int!){
    deleteSaying(id:$id){
      ok
      error
    }
  }
`

function DeleteSayingButton({id}){
  console.log(id, typeof(id));
  const nav = useNavigation();
  const onCompleted = (data)=>{
    console.log(data);
  };
  const [deleteSaying] = useMutation(DELETE_SAYING,{
    onCompleted,
    update:(cache,result)=>{
      console.log(result);
      const {data:{deleteSaying:{ok}}} = result;
      if(ok){
        cache.evict({
          id:`Saying:${id}`
        });
      }
    }
  })
  return(
    <TouchableOpacity 
      onPress={()=>Alert.alert(
        "글귀를 삭제하시겠습니까?",
        "",
        [
          {
            text: "예",
            onPress: ()=>{
              deleteSaying({
                variables: {
                  id:id,
                },
              });
            },
            style: "cancel"
          },
          {
            text: "아니오",
          }
        ],
        {
          cancelable: true,
        }
      )}
      style={{minHeight:18, borderColor:"white",width:32,marginTop:20}}>
      <Ionicons name="trash-outline" color="tomato" size={32}/>
    </TouchableOpacity>
  )
}

export default function Saying({id, user, text, tags, author, isLike, isMine, totalLikes, totalComments, today, refresh}){
  //console.log(refresh);
  // 텍스트 전처리
  const textlen = text.length;
  let fontSize = 0;
  if (textlen < 50){
    fontSize = 18;
  }else if(textlen < 100){
    fontSize = 16;
  }else{
    fontSize = 14;
  }
  //console.log("textlen:",textlen);
  let sentences = text.split('.');
  if(sentences[sentences.length-1]=="") sentences.pop();
  
  //console.log(sentences);

  console.log(id,text);
  const navigation = useNavigation();
  //const {id, user, text, tags, author, isLike, isMine, totalLikes, totalComments} = data.seeSaying;
  //console.log("data:",data)
  const colorScheme = useColorScheme();
  const darkmode = colorScheme==="dark";
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
      {
        today?<Today darkmode={darkmode}/>:null 
      }
      {/*isMine && <DeleteSayingButton id={id}/>*/}
      <TouchableOpacity style={ss.body} onPress={()=>navigation.push("Saying",{
        sid: id,
      })}>
        <View style={ss.textWrapper}>
          {
            sentences.map((text,index)=><Text key={index} style={ss.sayingText(colorScheme,fontSize)}>{text.trim()}.{"\n"}</Text>)
          }
        </View>
        <TouchableOpacity>
          <Text style={ss.author(colorScheme)}>{author.name}</Text>
        </TouchableOpacity>
      </TouchableOpacity>
      <View style={ss.footer}>
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
          <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} bounces={true}>
            {
              tags.map((item,index)=><Tag key={index} {...item}/>)
            }
          </ScrollView>
        </View>
    </View>
  )
}

const ss = StyleSheet.create({
  container: colorScheme=>({
    alignItems:"center",
    justifyContent:"center",
    flex: 1,
    borderWidth: 0,
    borderColor: "#dedede",
    backgroundColor: colorScheme==="dark"?colors.darker:"white",
    width: "85%",
    borderRadius: 20,
    marginVertical: 30,
    maxHeight: 600,
    minHeight: 350,
    shadowColor:"#000",
    shadowOffset:{
      width:1, 
      height: 2,
    },
    shadowOpacity:0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
    width: "100%"
  },
  sayingText:(colorScheme,fontSize)=>({
    color: `${colorScheme==="dark"?"white":"black"}`,
    fontSize: fontSize,
  }),
  author: colorScheme=>({
    color: `${colorScheme==="dark"?"#ababab":"#323232"}`	,
    fontSize: 16,
  }),
  comment:{
    marginLeft: 10,
    marginRight: 10,
    borderWidth: 0,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center"
  },
  likes:{
    borderWidth: 0,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center"
  },
  tagWrapper:{
    borderWidth: 0,
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginLeft: 5,
    marginBottom: 15,
    backgroundColor: "#eeeeee",
  },
  footer:{
    alignItems:"center",
    paddingHorizontal: 10,
    flexDirection: 'row',
    paddingVertical: 10,
  },
  today: darkmode =>({
    borderRadius:15, 
    backgroundColor: darkmode?"rgba(255,255,255,0.1)":"#efefef",
    paddingVertical:5, 
    paddingHorizontal:10, 
    marginTop:15,
  }),
  textWrapper:{
    alignItems:"center",
    justifyContent:"center",
    paddingVertical: 50, 
    paddingHorizontal:20,
    width:"100%"
  }
})