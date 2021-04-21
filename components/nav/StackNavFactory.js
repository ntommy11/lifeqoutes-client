import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { Image, useWindowDimensions } from "react-native";
import Today from "../../screens/Today";
import Profile from "../../screens/Profile";
import Search from "../../screens/Search";
import { useColorScheme } from "react-native-appearance";
import Saying from "../../screens/Saying";
import Create from "../../screens/Create";
import SayingList from "../../screens/SayingList";

const Stack = createStackNavigator();

export default function StackNavFactory({screenName}){
  const {width, height} = useWindowDimensions();
  const colorScheme = useColorScheme();
  return <Stack.Navigator headerMode="screen" screenOptions={{
    headerBackTitleVisible: false,
    headerTintColor: colorScheme==="dark"?"white":"black",
    headerStyle:{
      shadowColor: colorScheme==="dark"?"rgba(255,255,255,0.2)":"gray",
      backgroundColor: colorScheme==="dark"?"black":"white",
      height: 80,
    }
  }}>
    {screenName==="Today"?<Stack.Screen name={"Today"} component={Today} options={{
      headerTitle: ()=><Image resizeMode="contain" source={require("../../assets/logo2.png")} style={{
        maxHeight: 30,
      }}/>
    }}/>:null}
    {screenName==="Search"?<Stack.Screen name={"Search"} component={Search} options={{
      headerBackTitleVisible: false,
      headerTintColor: colorScheme==="dark"?"white":"black",
      headerStyle:{
        shadowColor: colorScheme==="dark"?"rgba(255,255,255,0.2)":"gray",
        backgroundColor: colorScheme==="dark"?"black":"white",
        height: 150,
      }
      }}/>:null}
    {screenName==="Create"?<Stack.Screen name={"Create"} component={Create} options={{
      title: "작성하기",
      headerTitleStyle:{
        fontWeight: 'bold',
        fontSize: 24
      }
    }}/>:null}
    {screenName==="Profile"?<Stack.Screen name={"Profile"} component={Profile}/>:null}
    <Stack.Screen name="Saying" component={Saying} options={{headerShown:false}}/>
    <Stack.Screen name="SayingList" component={SayingList}/>
  </Stack.Navigator>
}