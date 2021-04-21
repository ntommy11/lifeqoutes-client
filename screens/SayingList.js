import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import React, { useEffect } from 'react';
import { FlatList, SafeAreaView, Text, View } from 'react-native';
import { useColorScheme } from 'react-native-appearance';
import Saying from '../components/Saying';
import ScreenLayout from '../components/ScreenLayout';

const TAKE = 10

const SEARCH_TAG = gql`
  query searchTag($keyword: String!, $take: Int!, $lastId:Int){
    searchTag(keword: $keyword, take: 1){
      id
      name
      totalSayings
      sayings(take:$take, lastId:$lastId){
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
  }
`
const SEARCH_AUTHOR = gql`
  query searchAuthor($keyword: String!, $take: Int!, $lastId:Int){
    searchAuthor(keyword: $keyword, take: 1){
      id
      name
      totalSayings
      sayings(take:$take, lastId:$lastId){
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
  }
`


function SayingsByTag({keyword}){
  const renderItem = ({item})=>{
    console.log("item:",item);
    return(
      <ScreenLayout>
        <Saying {...item}/>
      </ScreenLayout> 
    )
  }

  const {data,loading,error,fetchMore} = useQuery(SEARCH_TAG,{
    variables:{
      keyword: keyword,
      take: TAKE
    }
  });
  if(error){
    console.log(error);
  }
  if(data){
    console.log("SayingsByTag::data=",data);
    let len = data.searchTag[0].sayings.length;
    if(len){
      let lastId = data.searchTag[0].sayings[len-1].id;
      return(
        <SafeAreaView style={{borderWidth:1, width:"100%", flex:1, paddingTop: 0}}>
          <FlatList
            onEndReached={()=>fetchMore({
            variables:{
              keyword: keyword,
              take: TAKE,
              lastId: lastId
            }
            })}        
            style={{
              paddingTop: 10,
              flex: 1,
            }}
            data={data.searchTag[0].sayings}
            renderItem={renderItem}
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

function SayingsByAuthor({keyword}){
  const renderItem = ({item})=>{
    console.log("item:",item);
    return(
      <ScreenLayout>
        <Saying {...item}/>
      </ScreenLayout> 
    )
  }

  const {data,loading,error,fetchMore} = useQuery(SEARCH_AUTHOR,{
    variables:{
      keyword: keyword,
      take: TAKE
    }
  });
  if(error){
    console.log(error);
  }
  if(data){
    console.log("SayingsByAuthor::data=",data);
    let len = data.searchAuthor[0].sayings.length;
    if(len){
      let lastId = data.searchAuthor[0].sayings[len-1].id;
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
              flex: 1,
            }}
            data={data.searchAuthor[0].sayings}
            renderItem={renderItem}
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


export default function SayingList({navigation, route}){
  const {id, keyword, type} = route.params;
  const colorScheme = useColorScheme();
  useEffect(()=>{
    navigation.setOptions({
      title: keyword,
    });
  });
  console.log(navigation, id,keyword,type);
  return(
    <View style={{
      backgroundColor:colorScheme==="dark"?"black":"white", 
      flex:1, 
      alignItems:"center",
      justifyContent: "center",
      borderWidth:1, 
    }}>
      {type=="tag"?<SayingsByTag keyword={keyword}/>:<SayingsByAuthor keyword={keyword}/>}
    
    </View>
  )
}