import { useQuery } from '@apollo/client';
import { NavigationHelpersContext } from '@react-navigation/core';
import gql from 'graphql-tag';
import React from 'react';
import { Text, View, TouchableOpacity, ActivityIndicator } from "react-native"
import { logUserOut } from '../apollo';
import Saying from '../components/Saying';
import ScreenLayout from '../components/ScreenLayout';


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
  const { data, loading, error } = useQuery(TODAY_QUERY);
  if(error){
    console.log(error);
  }
  if(data){
    console.log(data);
    return(
      <ScreenLayout>

        <Saying {...data.seeFeed} today={true}/>
      </ScreenLayout>
    )
  }
  return <ScreenLayout>
    <ActivityIndicator color="white"/>
    <TouchableOpacity onPress={()=>logUserOut()}><Text>logout</Text></TouchableOpacity>
  </ScreenLayout>
}