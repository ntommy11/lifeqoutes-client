import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { ActivityIndicator, Alert, FlatList, SafeAreaView, Text, View } from 'react-native';
import { useColorScheme } from 'react-native-appearance';
import Saying from '../components/Saying';
import ScreenLayout from '../components/ScreenLayout';
import {colors} from '../colors'
const TAKE = 10

// 유저가 찜한 글 목록 
const SEE_USER_LIKE = gql`
  query seeUserLike($userId:Int!, $take:Int!, $lastId:Int){
    seeUserLike(userId:$userId, take:$take, lastId:$lastId){
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

const SEE_TAG_SAYING = gql`
  query seeTagSaying($id: Int!, $take: Int!, $lastId:Int){
    seeTagSaying(id:$id, take:$take, lastId:$lastId){
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

const SEE_AUTHOR_SAYING = gql`
  query seeAuthorSaying($id: Int!, $take: Int!, $lastId:Int){
    seeAuthorSaying(id: $id, take: $take, lastId:$lastId){
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

function SayingsByUserLike({userId}){
  console.log("userId=",userId);
  const renderItem = ({item})=>{
    //console.log("item:",item);
    return(
      <ScreenLayout>
        <Saying {...item}/>
      </ScreenLayout> 
    )
  }
  const [refreshing, setRefreshing] = useState(false);
  const refresh = async ()=>{
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }
  const {data,loading,error,refetch,fetchMore} = useQuery(SEE_USER_LIKE,{
    variables:{
      userId: userId,
      take: TAKE
    }
  });
  if(error){
    console.log(error);
  }
  if(data){
    //console.log("SayingsByTag::data=",data);
    let len = data.seeUserLike.length;
    if(len){
      let lastId = data.seeUserLike[len-1].id;
      return(
        <SafeAreaView style={{width:"100%", flex:1, paddingTop: 0}}>
          <FlatList
            refreshing={refreshing}
            onRefresh={refresh}
            onEndReached={()=>fetchMore({
            variables:{
              userId: userId,
              take: TAKE,
              lastId: lastId
            },/*
            updateQuery: (prev, {fetchMoreResult})=>{
              console.log("fetchmore:",fetchMoreResult);
              if (!fetchMoreResult) return prev;
              return Object.assign({},prev,{
                seeTag: {
                  sayings: [...prev.seeTag.sayings, ...fetchMoreResult.seeTag.sayings],
                }
              })
            }*/
            })}        
            style={{
              paddingTop: 10,
              flex: 1,
            }}
            data={data.seeUserLike}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
          />
        </SafeAreaView>
      )
    }else{
      return <View></View>
    }
  }
  return <ScreenLayout><ActivityIndicator/></ScreenLayout>
}

function SayingsByTag({id}){
  const renderItem = ({item})=>{
    //console.log("item:",item);
    return(
      <ScreenLayout>
        <Saying {...item}/>
      </ScreenLayout> 
    )
  }
  const [refreshing, setRefreshing] = useState(false);
  const refresh = async ()=>{
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }
  const {data,loading,error,refetch,fetchMore} = useQuery(SEE_TAG_SAYING,{
    variables:{
      id: id,
      take: TAKE
    }
  });
  if(error){
    console.log(error);
  }
  if(data){
    //console.log("SayingsByTag::data=",data);
    let len = data.seeTagSaying.length;
    if(len){
      let lastId = data.seeTagSaying[len-1].id;
      return(
        <SafeAreaView style={{flex:1,width:"100%"}}>
          <FlatList
            refreshing={refreshing}
            onRefresh={refresh}
            onEndReached={()=>fetchMore({
            variables:{
              id: id,
              take: TAKE,
              lastId: lastId
            },/*
            updateQuery: (prev, {fetchMoreResult})=>{
              console.log("fetchmore:",fetchMoreResult);
              if (!fetchMoreResult) return prev;
              return Object.assign({},prev,{
                seeTag: {
                  sayings: [...prev.seeTag.sayings, ...fetchMoreResult.seeTag.sayings],
                }
              })
            }*/
            })}        
            style={{
              flex: 1,
            }}
            data={data.seeTagSaying}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
          />
        </SafeAreaView>
      )
    }else{
      return <View></View>
    }
  }
  return <ScreenLayout><ActivityIndicator/></ScreenLayout>
}

function SayingsByAuthor({id}){
  const renderItem = ({item})=>{
    //console.log("item:",item);
    return(
      <ScreenLayout>
        <Saying {...item}/>
      </ScreenLayout> 
    )
  }
  const [refreshing, setRefreshing] = useState(false);
  const refresh = async ()=>{
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }
  const {data,loading,error,refetch,fetchMore} = useQuery(SEE_AUTHOR_SAYING,{
    variables:{
      id: id,
      take: TAKE
    }
  });
  if(error){
    console.log(error);
  }
  if(data){
    //console.log("SayingsByAuthor::data=",data);
    let len = data.seeAuthorSaying.length;
    if(len){
      let lastId = data.seeAuthorSaying[len-1].id;
      return(
        <SafeAreaView style={{width:"100%", flex:1}}>
          <FlatList
            refreshing={refreshing}
            onRefresh={refresh}
            onEndReachedThreshold={0}
            onEndReached={()=>fetchMore({
              variables:{
                id: id,
                take: TAKE,
                lastId: lastId
              }
            })}
            
            style={{
              flex: 1,
            }}
            data={data.seeAuthorSaying}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
          />
        </SafeAreaView>
      )
    }else{
      return <View></View>
    }
  }
  return <ScreenLayout><ActivityIndicator/></ScreenLayout>
}


export default function SayingList({navigation, route}){
  const {id, keyword, type} = route.params;
  console.log(id,keyword,type);
  const colorScheme = useColorScheme();
  const darkmode = colorScheme==="dark";
  useEffect(()=>{
    navigation.setOptions({
      title: keyword,
      headerStyle:{
        shadowColor:'transparent',
        backgroundColor: darkmode?colors.darker:"white",
      }
    });
  });
  //console.log(navigation, id,keyword,type);
  if(type=="userLike"){
    return(
      <ScreenLayout>
        <SayingsByUserLike userId={id} />
      </ScreenLayout>
    )
  }else{
    return(
      <View style={{
        backgroundColor:colorScheme==="dark"?colors.dark:colors.skin, 
        flex:1, 
        alignItems:"center",
        justifyContent: "center",
      }}>
        {type=="tag"?<SayingsByTag id={id}/>:<SayingsByAuthor id={id}/>}
        
      </View>
  )}
}