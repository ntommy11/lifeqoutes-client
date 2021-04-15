import { useQuery } from '@apollo/client';
import { NavigationHelpersContext } from '@react-navigation/core';
import gql from 'graphql-tag';
import React from 'react';
import { Text, View, TouchableOpacity, ActivityIndicator } from "react-native"
import { logUserOut } from '../apollo';
import Saying from '../components/Saying';
import ScreenLayout from '../components/ScreenLayout';


const TODAY_QUERY = gql`
  query seeSaying($id:Int!){
    seeSaying(id:$id){
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

export default function Today(){
  const { data, loading, error } = useQuery(TODAY_QUERY,{
    variables:{
      id: 1
    }
  });
  if(error){
    console.log(error);
  }
  if(data){
    console.log(data);
    return(
      <ScreenLayout>
        <Text>Today!</Text>
        <TouchableOpacity onPress={async()=>{await logUserOut()}}>
          <Text>로그아웃</Text>
        </TouchableOpacity>
        <Saying {...data.seeSaying} today={true}/>
      </ScreenLayout>
    )
  }
  return <ScreenLayout>
    <ActivityIndicator color="white"/>
  </ScreenLayout>

}