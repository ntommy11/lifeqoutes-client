import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { Image } from "react-native";
import Today from "../../screens/Today";
import Profile from "../../screens/Profile";
import Search from "../../screens/Search";
import { useColorScheme } from "react-native-appearance";

const Stack = createStackNavigator();

export default function StackNavFactory({screenName}){
  const colorScheme = useColorScheme();
  return <Stack.Navigator headerMode="screen" screenOptions={{
    headerBackTitleVisible: false,
    headerTintColor: colorScheme==="dark"?"white":"black",
    headerStyle:{
      shadowColor: colorScheme==="dark"?"rgba(255,255,255,0.2)":"gray",
      backgroundColor: colorScheme==="dark"?"black":"white",
    }
  }}>
    {screenName==="Today"?<Stack.Screen name={"Today"} component={Today} options={{
      headerTitle: ()=><Image resizeMode="contain" source={require("../../assets/logo2.png")} style={{
        maxHeight: 30,
      }}/>
    }}/>:null}
    {screenName==="Search"?<Stack.Screen name={"Search"} component={Search}/>:null}
    {screenName==="Profile"?<Stack.Screen name={"Profile"} component={Profile}/>:null}
  </Stack.Navigator>
}