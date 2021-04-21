import React from 'react';
import { useEffect,useState } from 'react';
import { Text, View ,TouchableOpacity, TextInput, useWindowDimensions, ActivityIndicator, SafeAreaView,FlatList} from "react-native"
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

const Input = styled.TextInput``;

const TAKE = 20;

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
    return (
      <TouchableOpacity
        onPress={()=>navigation.navigate("SayingList",{
          id: item.id,
          keyword: item.name,
          type: "tag",
        })} 
        style={{
          borderWidth: 1,
          borderRadius: 25,
          paddingHorizontal: 2,
          paddingVertical: 2,
          marginHorizontal: 50,
          marginTop: 5,
          flex:1,
          justifyContent:"center",
          backgroundColor:"rgba(255,255,255,0.15)"
        }}
      >
        <View style={{
          flexDirection:"row",
          flex:1, 
          justifyContent:"space-between"
        }}>
          <View style={{
            flexDirection:"row",
            paddingLeft: 5,
            paddingVertical: 5,
            alignItems:"center"
          }}> 
            <Text style={{
              color: darkmode?"rgba(255,255,255,0.7)":"black",
              fontSize: 18
            }}>{item.name}</Text>
            <Text style={{
              color: "#878787"
            }}> ({item.totalSayings})</Text>
          </View>
          <View>
            <Ionicons 
              name="arrow-forward-circle" 
              size={28} 
              color={darkmode?"rgba(255,255,255,0.7)":"black"}
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
        <SafeAreaView style={{borderWidth:1, width:"100%", flex:1, paddingTop: 20}}>
          <FlatList
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
    return (
      <TouchableOpacity 
        onPress={()=>navigation.navigate("SayingList",{
          id: item.id,
          keyword: item.name,
          type: "author",
        })} 
        style={{
          borderWidth: 1,
          borderRadius: 25,
          paddingHorizontal: 2,
          paddingVertical: 2,
          marginHorizontal: 50,
          marginTop: 5,
          flex:1,
          justifyContent:"center",
          backgroundColor:"rgba(255,255,255,0.15)"
      }}>
        <View style={{
          flexDirection:"row",
          flex:1, 
          justifyContent:"space-between"
        }}>
          <View style={{
            flexDirection:"row",
            paddingLeft: 5,
            paddingVertical: 5,
            alignItems:"center"
          }}> 
            <Text style={{
              color: darkmode?"rgba(255,255,255,0.7)":"black",
              fontSize: 18
            }}>{item.name}</Text>
            <Text style={{
              color: "#878787"
            }}> ({item.totalSayings})</Text>
          </View>
          <View>
            <Ionicons 
              name="arrow-forward-circle" 
              size={28} 
              color={darkmode?"rgba(255,255,255,0.7)":"black"}
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
    console.log("SearchAuthorResult::data=",data);
    let len = data.searchAuthor.length;
    if(len){
      let lastId = data.searchAuthor[len-1].id;
      return(
        <SafeAreaView style={{borderWidth:1, width:"100%", flex:1, paddingTop: 20}}>
          <FlatList
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
    let len = data.searchSaying.length;
    if(len){
      let lastId = data.searchSaying[len-1].id;
      console.log("lastId:",lastId);
      return(
        <SafeAreaView style={{borderWidth:1, width:"100%", flex:1, paddingTop: 20}}>
          <FlatList
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
  if(selection=="tag") return <SearchTagResult keyword={keyword} darkmode={darkmode}/>
  else if(selection=="author") return <SearchAuthorResult keyword={keyword} darkmode={darkmode}/>
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
  console.log("selection:",selection);
  const SearchBox = () => (
    <View style={{
      flex:1,
      width:width*0.8,
      height:height/5,
      borderColor:"black",
      borderWidth:1,
      alignItems:"center",
      justifyContent:"center",
    }}>      
      <SwitchSelector 
        options={options}
        initial={0}
        onPress={value=>setSelection(value)}
        style={{
          width:width/2,
          borderWidth:1,
        }}
        height={30}
        backgroundColor= {darkmode?"rgba(255,255,255,0.2)":"#ededed"}
        selectedColor={darkmode?"black":"#fefefe"}
        textColor="#bdbdbd"
        buttonColor={darkmode?"rgba(255,255,255,0.8)":"black"}
        bold={true}
        borderRadius={30}
      />
      <View style={{
        flexDirection:"row",
        justifyContent:"center",
        borderWidth:1
      }}>
        <TextInput 
          style={{
            backgroundColor:darkmode?"rgba(255,255,255,0.3)":"#fefefe", 
            borderWidth:1, 
            width:"80%", 
            fontSize:18,
            paddingHorizontal: 5,
            paddingVertical: 7,
            borderRadius: 9,
            marginTop: 10,
            color: darkmode?"white":"black"
          }} 
          placeholderTextColor={darkmode?"rgba(255,255,255,0.5)":"#dedede"} 
          placeholder="Search"
          autoCaptialize="none"      
          returnKeyType="search"
          autoCorrect={false}
          onChangeText={(text)=>setValue("keyword", text)}
        />
        <TouchableOpacity style={{
          borderWidth:1,
          marginTop: 10,
          marginLeft: 10,
          paddingVertical: 5,
          paddingHorizontal: 7,
          alignItems:"center",
          justifyContent:"center",
        }}>
          <Text style={{
            color:darkmode?"white":"black", 
            fontWeight:"700",
            fontSize: 18
          }}>검색</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  useEffect(()=>{
    navigation.setOptions({
      headerTitle: SearchBox
    });
    register("keyword");
  },[]);

  console.log(watch());
  return(
    <DismissKeyboard>
      <View style={{
        backgroundColor:colorScheme==="dark"?"black":"white", 
        flex:1, 
        alignItems:"center",
        justifyContent: "center",
        borderWidth:1, 
      }}>
        <Result keyword={watch("keyword")?watch("keyword"):""} selection={selection} darkmode={darkmode}/>
      </View>     
    </DismissKeyboard>
  )
}