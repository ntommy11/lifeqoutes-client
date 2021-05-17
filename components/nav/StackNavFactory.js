import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { Image, Text, useWindowDimensions } from "react-native";
import Today from "../../screens/Today";
import Profile from "../../screens/Profile";
import MyProfile from "../../screens/MyProfile";
import Search from "../../screens/Search";
import { useColorScheme } from "react-native-appearance";
import Create from "../../screens/Create";
import SayingList from "../../screens/SayingList";
import Saying from "../../screens/Saying";
import { colors } from "../../colors";
import EditTags from "../../screens/EditTags";

const Stack = createStackNavigator();

export default function StackNavFactory({screenName}){
  const {width, height} = useWindowDimensions();
  const colorScheme = useColorScheme();
  const darkmode = colorScheme==="dark";
  return <Stack.Navigator 
    mode="card" 
    headerMode="screen" 
    screenOptions={{
      headerBackTitleVisible: false,
      headerTintColor: colorScheme==="dark"?"white":"black",
      headerStyle:{
        shadowColor: colorScheme==="dark"?"rgba(255,255,255,0.2)":"#dedede",
        backgroundColor: colorScheme==="dark"?colors.darker:"white",
        height: 80,
      },
      cardStyle:{
        backgroundColor: darkmode?colors.darker:"white", // <- 중요! 스택 스크린 렌더링 전 기본 배경값 지정. 이걸 안하면 로드 시 처음에 껌뻑거릴 수 있다. 
      }
  }}>
    {screenName==="Today"?<Stack.Screen name={"Today"} component={Today} options={{
      headerTitle: ()=><Text style={{color: "white", fontWeight: "bold", fontSize: 24}}>인생글귀</Text>
    }}/>:null}
    {screenName==="Search"?<Stack.Screen name={"Search"} component={Search} options={{
      headerBackTitleVisible: false,
      headerTintColor: colorScheme==="dark"?"white":"black",
      headerStyle:{
        shadowColor: 'transparent',
        backgroundColor: colorScheme==="dark"?colors.darker:"white",
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
    {screenName==="MyProfile"?<Stack.Screen name={"MyProfile"} component={MyProfile}/>:null}
    <Stack.Screen name="SayingList" component={SayingList}/>
    <Stack.Screen  name="Saying" component={Saying} options={{headerShown:false}}/>
    <Stack.Screen name="Profile" component={Profile} />
    <Stack.Screen name="EditTags" component={EditTags} options={{
      headerStyle:{
        shadowColor: colorScheme==="dark"?"rgba(255,255,255,0.2)":"#dedede",
        backgroundColor: colorScheme==="dark"?colors.darker:"white",
        height: 150,
      }
    }}/>
  </Stack.Navigator>
}