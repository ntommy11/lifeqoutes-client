import React from 'react';
import { useEffect,useState } from 'react';
import { StyleSheet, Text, View ,TouchableOpacity, TextInput, useWindowDimensions, ActivityIndicator, SafeAreaView,FlatList, Alert} from "react-native"
import ScreenLayout from '../components/ScreenLayout';
import styled from "styled-components/native";
import DismissKeyboard from '../components/DismissKeyboard';
import { useColorScheme } from 'react-native-appearance';
import { useForm } from 'react-hook-form';
import SwitchSelector from "react-native-switch-selector";
import { Ionicons } from '@expo/vector-icons';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import { useNavigation } from '@react-navigation/core';
import SayingSmall from '../components/SayingSmall';
import Saying from '../components/Saying';
import {colors} from '../colors'

// 무한 스크롤 fetch 데이터레코드 수 
const TAKE = 40;
const TAG_COLOR = "#91F8D0";
const TAG_COLOR_DARK = "2E8B57"


//argument가 백엔드에서 오타남!! keword
const SEARCH_TAG = gql`
  query searchTag($keyword: String!, $take: Int!, $lastId:Int){
    searchTag(keword: $keyword, take: $take, lastId:$lastId){
      id
      name
      totalSayings
    }
  }
`
const SEARCH_AUTHOR = gql`
  query searchAuthor($keyword: String!, $take: Int!, $lastId: Int){
    searchAuthor(keyword: $keyword, take:$take, lastId:$lastId){
      id
      name
      totalSayings
    }
  }
`
const SEARCH_CONTENT = gql`
  query searchSaying($keyword: String!, $take: Int!, $lastId: Int){
    searchSaying(keyword: $keyword, take:$take, lastId:$lastId){
      id
      user{
        id
        name
        email
      }
      author{
        id
        name
      }
      text 
      tags{
        id
        name 
      }
      totalLikes
      totalComments
      isMine
      isLike
    }
  }
`
function SearchTagResult({keyword}){
  console.log("SearchTagResult::keyword=",keyword);
  const darkmode = useColorScheme()==="dark";
  const navigation = useNavigation();
  const renderTag = ({item})=>{
    //console.log("renderTag::item=",item);
    if(item.totalSayings===0) return <></>;
    return (
      <TouchableOpacity
        onPress={()=>navigation.navigate("SayingList",{
          id: item.id,
          keyword: item.name,
          type: "tag",
        })} 
        style={CSS.tagContainer(darkmode)}
      >
        <View style={{
          flexDirection:"row",
          flex:1, 
          justifyContent:"space-between",
          alignItems:"center"
        }}>
          <View style={CSS.tagLeft}> 
            <Text style={CSS.tagText}>{item.name}</Text>
            <Text style={{
              color: "#dddddd"
            }}> ({item.totalSayings})</Text>
          </View>
          <View>
            <Ionicons 
              name="arrow-forward-circle" 
              size={28} 
              color="white"
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  }
  const [offset, setOffset] = useState(0);
  const {data, loading, error, fetchMore} = useQuery(SEARCH_TAG,{
    variables:{
      keyword: keyword,
      take: TAKE,
    },
    errorPolicy:"all"
  });
  if(error){
    //console.log(error);
  }
  if(loading){
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    )     
  }
  if(data){
    //console.log("SearchTagResult::data=",data);
    let len = data.searchTag.length;
    if(len){
      let lastId = data.searchTag[len-1].id;
      console.log("lastId:",lastId);
      //console.log("lastId:",lastId);
      return(
        <SafeAreaView style={{width:"100%", flex:1}}>
          <FlatList
            keyboardShouldPersistTaps="handled"
            onEndReachedThreshold={0.5}
            onEndReached={()=>{fetchMore({
            variables:{
              keyword: keyword,
              take: TAKE,
              lastId: lastId
            }
            })}}
            style={{
              paddingTop: 30
            }}
            data={data.searchTag}
            renderItem={renderTag}
            keyExtractor={item => item.id.toString()}
          />
        </SafeAreaView>
      )
    }else{
      return <View></View>
    }
    //console.log("lastId:",lastId);

  }
  return <View><Text>default</Text></View>
}

function SearchAuthorResult({keyword}){
  //console.log("SearchAuthorResult::keyword=",keyword);
  const navigation = useNavigation();
  const darkmode = useColorScheme()==="dark";
  const renderAuthor = ({item})=>{
    //console.log("renderTag::item=",item);
    if(item.totalSayings===0) return <></>;
    return (
      <TouchableOpacity 
        onPress={()=>navigation.navigate("SayingList",{
          id: item.id,
          keyword: item.name,
          type: "author",
        })} 
        style={CSS.tagContainer(darkmode)}>
        <View style={{
          flexDirection:"row",
          flex:1, 
          justifyContent:"space-between",
          alignItems:"center"
        }}>
          <View style={CSS.tagLeft}> 
            <Text style={CSS.tagText}>{item.name}</Text>
            <Text style={{
              color: "#878787"
            }}> ({item.totalSayings})</Text>
          </View>
          <View>
            <Ionicons 
              name="arrow-forward-circle" 
              size={28} 
              color="white"
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  }
  const {data, loading, error, fetchMore} = useQuery(SEARCH_AUTHOR,{
    variables:{
      keyword: keyword,
      take: TAKE
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
    //console.log("SearchAuthorResult::data=",data);
    let len = data.searchAuthor.length;
    if(len){
      let lastId = data.searchAuthor[len-1].id;
      return(
        <SafeAreaView style={{width:"100%", flex:1}}>
          <FlatList
            keyboardShouldPersistTaps="handled"
            onEndReachedThreshold={0.5}
            onEndReached={()=>fetchMore({
            variables:{
              keyword: keyword,
              take: TAKE,
              lastId: lastId
            }
            })}        
            style={{
              paddingTop: 30
            }}
            data={data.searchAuthor}
            renderItem={renderAuthor}
            keyExtractor={item => item.id.toString()}
          />
        </SafeAreaView>
      )
    }else{
      return <View></View>
    }
  }
  return <View><Text>default</Text></View>
}

function SearchContentResult({keyword}){
  const darkmode = useColorScheme()==="dark";
  const navigation = useNavigation();
  const renderItem = ({item})=>{
    return(
      <ScreenLayout>
        <Saying {...item}/>
      </ScreenLayout>
    ) 
  }
  const {data, loading, error, fetchMore} = useQuery(SEARCH_CONTENT,{
    variables:{
      keyword: keyword,
      take: TAKE,
    },
    errorPolicy:"all"
  });
  if(error){
    //console.log(error);
  }
  if(loading){
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    )     
  }
  if(data){
    //console.log("SearchTagResult::data=",data);
    let len = data.searchSaying.length;
    if(len){
      let lastId = data.searchSaying[len-1].id;
      //console.log("lastId:",lastId);
      return(
        <SafeAreaView style={{width:"100%", flex:1}}>
          <FlatList
            keyboardShouldPersistTaps="handled"
            onEndReachedThreshold={0}
            onEndReached={()=>fetchMore({
            variables:{
              keyword: keyword,
              take: TAKE,
              lastId: lastId
            }
            })}
            data={data.searchSaying}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
          />
        </SafeAreaView>
      )
    }else{
      return <View></View>
    }
    //console.log("lastId:",lastId);

  }
  return <View><Text>default</Text></View>
}

function Result({selection, keyword, darkmode}){
  if(selection=="tag") return <ScreenLayout><SearchTagResult keyword={keyword} darkmode={darkmode}/></ScreenLayout>
  else if(selection=="author") return <ScreenLayout><SearchAuthorResult keyword={keyword} darkmode={darkmode}/></ScreenLayout>
  else if(selection=="content") return <SearchContentResult keyword={keyword} darkmode={darkmode}/>
  return <ActivityIndicator/>
}
export default function Search({navigation}){
  const {width, height} = useWindowDimensions();
  const {setValue, register ,watch} = useForm();
  const [selection, setSelection] = useState("tag");
  const colorScheme = useColorScheme();
  const darkmode = colorScheme==="dark";
  const options = [
    { label: "태그", value: "tag"},
    { label: "작자", value: "author"},
    { label: "내용", value: "content"},
  ];
  
  //query
  //console.log("selection:",selection);
  const SearchBox = () => (
    <View style={CSS.searchBoxContainer}>      
      <SwitchSelector 
        options={options}
        initial={0}
        onPress={value=>setSelection(value)}
        style={{width:width/2}}
        hasPadding={true}
        height={30}
        borderColor={colors.blue}
        borderWidth={1}
        backgroundColor= {darkmode?"transparent":"white"}
        selectedColor={"#fefefe"}
        textColor={darkmode?"#ababab":"#bdbdbd"}
        buttonColor={colors.blue}
        bold={true}
        borderRadius={30}
      />
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

  //console.log(watch());
  return(
    <DismissKeyboard>
      <View style={{
        backgroundColor:colorScheme==="dark"?"black":"white", 
        flex:1, 
        alignItems:"center",
        justifyContent: "center",
      }}>
        <Result keyword={watch("keyword")?watch("keyword"):""} selection={selection} darkmode={darkmode}/>
      </View>     
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