import { useQuery } from '@apollo/client';
import { NavigationHelpersContext, useFocusEffect, useIsFocused } from '@react-navigation/core';
import gql from 'graphql-tag';
import React, { useEffect } from 'react';
import { Text, View, TouchableOpacity, ActivityIndicator, ScrollView, Alert } from "react-native"
import { logUserOut } from '../apollo';
import Saying from '../components/Saying';
import ScreenLayout from '../components/ScreenLayout';
import { Ionicons } from '@expo/vector-icons';


const TODAY_QUERY = gql`
  query {
    seeFeed{
      id
      text 
      user{
        name
        email
      }
      author{
        id
        name
      }
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

export default function Today({navigation}){
  const { data, loading, error, refetch, startPolling, stopPolling } = useQuery(TODAY_QUERY,{
    fetchPolicy:"network-only",
    notifyOnNetworkStatusChange:true,
    onCompleted:()=>{
      console.log("query completed");
    },
  });
  const isFocused = useIsFocused();
  useEffect(()=>{
    console.log("isFocused:",isFocused);
    if(isFocused){
      startPolling(1000);
      setTimeout(()=>{
        stopPolling()
      },3000);
    }
  },[isFocused])
  if(error){
    console.log(error);
  }
  if(data){
    //console.log("data=",data);
    if(data.seeFeed!==null){
      return(
        <ScreenLayout>
          <ScrollView style={{width:"100%", flex:1}} contentContainerStyle={{justifyContent:"center", alignItems:"center"}}>
            {          
            <Saying {...data.seeFeed} today={true}/>
            }
          </ScrollView>
        </ScreenLayout>
      )
    } 
  }
  return <ScreenLayout>
    <ActivityIndicator color="white"/>
  </ScreenLayout>
}