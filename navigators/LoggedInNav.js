import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Today from '../screens/Today';
import Search from '../screens/Search';
import Prifile from '../screens/Profile';
import {Ionicons} from '@expo/vector-icons'
import { Platform, View } from 'react-native';
import StackNavFactory from '../components/nav/StackNavFactory';
import { useColorScheme } from 'react-native-appearance';
import Create from '../screens/Create';
import { colors } from '../colors';
import { gql, useMutation, useReactiveVar } from '@apollo/client';
import { pushTokenVar } from '../apollo';
const Tabs = createBottomTabNavigator()

import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import useUser from '../hooks/useUser';
import { isEmpty } from '../utils';

const REGISTER_TOKEN = gql`
  mutation registerToken($id:Int!, $token:String!){
    registerToken(id:$id, token:$token){
      ok
      error 
    }
  }
`

export default function LoggedInNav(){
  const pushToken = useReactiveVar(pushTokenVar);
  const user = useUser();
  console.log("pushTokenVar:",pushToken);
  console.log("typeof pushTokenVar:",typeof(pushToken));
  console.log("LoggedInNav::User=",user);
  const colorScheme = useColorScheme();

  const [registerToken] = useMutation(REGISTER_TOKEN,{
    onCompleted: (data)=>{
      console.log("registerToken onCompleted:",data);
    }
  });

  React.useEffect(()=>{
    if(!isEmpty(user)){
      if(pushToken.length===0){
        registerForPushNotification().then(token=>{
          console.log("pushToken: ", token);
          pushTokenVar(token);
          registerToken({
            variables:{
              id: Number(user.id),
              token: token,
            }
          })
        }).catch(err=>console.log(err));
      }
    }
  },[user]);

  async function registerForPushNotification(){
    const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    if(status != 'granted'){
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    }
    if(status!='granted'){
      Alert.alert("failed to get the push token");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    return token;
  }

  return(
    <Tabs.Navigator
      tabBarOptions={{
        keyboardHidesTabBar: Platform.OS==="ios"?false:true,
        activeTintColor:colorScheme==="dark"?"white":"black",
        style:{
          borderWidth:0,
          shadowColor:"white",
          shadowOpacity:0,
          shadowOffset:{
            height:0
          },
          borderTopColor:colorScheme==="dark"?"rgba(255,255,255,0.2)":"#dedede",
          backgroundColor:colorScheme==="dark"?colors.darker:"white",
          height: 70,
          paddingTop: 10
        },
        showLabel: false,
      }}
    >
      <Tabs.Screen name="Today"  options={{
        tabBarIcon:({focused,color,size})=><Ionicons name="today" color={color} size={focused?30:30} style={{width:32}}/>
      }}>
        {()=><StackNavFactory screenName="Today"/>}
      </Tabs.Screen>
      <Tabs.Screen name="Search"  options={{
        tabBarIcon:({focused,color,size})=><Ionicons name="search" color={color} size={focused?32:30} style={{width:32}}/>
      }}>
        {()=><StackNavFactory screenName="Search"/>}

      </Tabs.Screen>
      <Tabs.Screen name="Create" options={{
        tabBarIcon:({focused,color,size})=><Ionicons name="create" color={color} size={focused?32:30} style={{width:32}}/>
      }}>
        {()=><StackNavFactory screenName="Create"/>}
      </Tabs.Screen>
      <Tabs.Screen name="MyProfile"  options={{
        tabBarIcon:({focused,color,size})=><Ionicons name="person" color={color} size={focused?32:30} style={{width:32}}/>
      }}>
        {()=><StackNavFactory screenName="MyProfile"/>}

      </Tabs.Screen>
      <Tabs.Screen name="Setting"  options={{
        tabBarIcon:({focused,color,size})=><Ionicons name="settings" color={color} size={focused?32:30} style={{width:32}}/>
      }}>
        {()=><StackNavFactory screenName="Setting"/>}

      </Tabs.Screen>
    </Tabs.Navigator>
  )
}