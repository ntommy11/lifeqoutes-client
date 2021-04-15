import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Today from '../screens/Today';
import Search from '../screens/Search';
import Prifile from '../screens/Profile';
import {Ionicons} from '@expo/vector-icons'
import { View } from 'react-native';
import StackNavFactory from '../components/nav/StackNavFactory';
import { useColorScheme } from 'react-native-appearance';
const Tabs = createBottomTabNavigator()

export default function LoggedInNav(){
  const colorScheme = useColorScheme();
  return(
    <Tabs.Navigator
      tabBarOptions={{
        activeTintColor:colorScheme==="dark"?"white":"black",
        style:{
          borderTopColor:colorScheme==="dark"?"rgba(255,255,255,0.2)":"gray",
          backgroundColor:colorScheme==="dark"?"black":"white",
        },
        showLabel: false,
      }}
    >
      <Tabs.Screen name="Today"  options={{
        tabBarIcon:({focused,color,size})=><Ionicons name="today" color={color} size={focused?36:32}/>
      }}>
        {()=><StackNavFactory screenName="Today"/>}
      </Tabs.Screen>
      <Tabs.Screen name="Search"  options={{
        tabBarIcon:({focused,color,size})=><Ionicons name="search" color={color} size={focused?36:32}/>
      }}>
        {()=><StackNavFactory screenName="Search"/>}

      </Tabs.Screen>
      <Tabs.Screen name="Upload" component={View} options={{
        tabBarIcon:({focused,color,size})=><Ionicons name="camera" color={color} size={focused?36:32}/>
      }}/>
      <Tabs.Screen name="Profile"  options={{
        tabBarIcon:({focused,color,size})=><Ionicons name="person" color={color} size={focused?36:32}/>
      }}>
        {()=><StackNavFactory screenName="Profile"/>}

      </Tabs.Screen>

    </Tabs.Navigator>
  )
}