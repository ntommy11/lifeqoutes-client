import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TextInput, TouchableOpacity, ActivityIndicator, SafeAreaView, StyleSheet, Text, useWindowDimensions, View,ScrollView } from 'react-native';
import { useColorScheme } from 'react-native-appearance';
import { SEARCH_TAG, LIKE_TAG, UNLIKE_TAG } from '../queries';
import {Ionicons} from '@expo/vector-icons';
import DismissKeyboard from '../components/DismissKeyboard';
import { useEffect } from 'react';
import { colors } from '../colors';
import { useMutation, useQuery } from '@apollo/client';
import ScreenLayout from '../components/ScreenLayout';


const TAKE = 50;

function Tag({id,isFollowing,name,totalSayings}){
  const [likeTag] = useMutation(LIKE_TAG,{
    variables:{
      id,
    },
    update:(cache, {data:{likeTag:{ok}}})=>{
      console.log("likeTag ok? ",ok);
      if(ok){
        const target = `Tag:${id}`;
        cache.modify({
          id: target,
          fields:{
            isFollowing(prev){
              return true;
            },
          }
        })
      }
    }
  });
  const [unlikeTag] = useMutation(UNLIKE_TAG,{
    variables:{
      id,
    },
    update:(cache, {data:{unlikeTag:{ok}}})=>{
      console.log("unlikeTag ok? ",ok);
      if(ok){
        const target = `Tag:${id}`;
        cache.modify({
          id: target,
          fields:{
            isFollowing(prev){
              return false;
            },
          }
        })
      }
    }
  });

  return(
    <TouchableOpacity 
      onPress={isFollowing?unlikeTag:likeTag}
      style={
        {
          flexDirection:"row",
          paddingVertical:3,
          paddingHorizontal:10,
          borderRadius: 25,
          borderWidth:isFollowing?2:1,
          borderColor: isFollowing?"tomato":"#898989",
          marginHorizontal: 5,
          marginVertical: 5,
          justifyContent: "center",
          alignItems:"center",
        }
    }>
      <Text style={
        {
          fontSize: 18,
          fontWeight: isFollowing?"bold":"normal",
          color:isFollowing?"tomato":"#898989",
        }
      }>{name}</Text>
      <Text style={{
        fontSize: 14,
        color:isFollowing?"tomato":"#898989",
      }}> {totalSayings}</Text>
    </TouchableOpacity>
  )

}

function SearchTagResult({keyword}){
  console.log("keyword:",keyword);
  const {data, loading, error, fetchMore} = useQuery(SEARCH_TAG,{
    variables:{
      keyword: keyword,
      take: TAKE,
    },
    errorPolicy:"all"
  });
  if(error){
    console.log(error);
  }
  if(loading){
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    )     
  }
  if(data){
    console.log("SearchTagResult::data=",data);
    let len = data.searchTag.length;
    if(len){
      let lastId = data.searchTag[len-1].id;
      console.log("lastId:",lastId);
      return(
        <ScrollView contentContainerStyle={{justifyContent:"center",alignItems:"center"}}>
          <View style={{marginVertical:10}}>
            <Text style={{color:"#454545", fontWeight:"700"}}>관심있는 태그를 터치하세요</Text>
          </View>
          <SafeAreaView style={{width:"100%", flex:1, flexDirection:"row", flexWrap:"wrap", paddingHorizontal:10,}}>
            {
              data.searchTag.map((item,index)=><Tag key={index} {...item}/>)
            }
          </SafeAreaView>
          <TouchableOpacity 
            onPress={()=>fetchMore({
              variables:{
                keyword: keyword,
                take: TAKE,
                lastId: lastId,
              }
            })}
            style={{marginTop:20, alignItems:"center", justifyContent:"center", width: 50}}>
            <Text style={{fontWeight:"bold", color:"#454545"}}>더보기</Text>
            <Ionicons name="caret-down-outline" size={32} color="#454545"/>
          </TouchableOpacity>
        </ScrollView>
      )
    }else{
      return <View></View>
    }
  } 
  return <View></View>
}

export default function EditTags({navigation}){
  const {width, height} = useWindowDimensions();
  const {setValue, register ,watch} = useForm();
  const [selection, setSelection] = useState("tag");
  const colorScheme = useColorScheme();
  const darkmode = colorScheme==="dark";
  
  //query
  console.log("selection:",selection);
  const SearchBox = () => (
    <View style={CSS.searchBoxContainer}>      
      <View style={{
        flexDirection:"row",
        justifyContent:"center",
        alignItems:"center",
        marginTop: 10,
        paddingHorizontal: 3,
        paddingVertical: 5,
        width:width*0.8,
        borderRadius: 10,
        backgroundColor:darkmode?"rgba(255,255,255,0.1)":colors.skin
      }}>
        <Ionicons name="search" size={28} color="#ababab"/>
        <TextInput
          style={{
            borderWidth:0, 
            fontSize:18,
            paddingHorizontal: 5,
            paddingVertical: 7,
            borderRadius: 9,
            width: "90%",
            color: darkmode?"white":"black"
          }} 
          placeholderTextColor={darkmode?"rgba(255,255,255,0.5)":"#ababab"} 
          placeholder="Search"
          autoCaptialize="none"      
          returnKeyType="search"
          autoCorrect={false}
          onChangeText={(text)=>setValue("keyword", text)}
        />
      </View>
    </View>
  );
  useEffect(()=>{
    navigation.setOptions({
      headerTitle: SearchBox,

    });
    register("keyword");
  },[]);

  console.log(watch());
  return(
    <DismissKeyboard>
      <ScreenLayout>
        <SearchTagResult keyword={watch("keyword")?watch("keyword"):""}/>
      </ScreenLayout>     
    </DismissKeyboard>
  )
}

const CSS = StyleSheet.create({
  tagContainer:darkmode=>({
    borderRadius: 25,
    paddingHorizontal: 2,
    paddingVertical: 2,
    marginHorizontal: 50,
    marginTop: 5,
    flex:1,
    justifyContent:"center",
    backgroundColor:darkmode?"rgba(255,255,255,0.1)":"#74D19D",
  }),
  tagLeft:{
    flexDirection:"row",
    paddingLeft: 10,
    paddingVertical: 5,
    alignItems:"center"
  },
  tagText:{
    color: "white",
    fontSize: 18,
    fontWeight: "bold"
  },
  searchBoxContainer:{
    flex:1,
    width:"100%",
    borderColor:"black",
    borderWidth:0,
    alignItems:"center",
    justifyContent:"center",
  }
})