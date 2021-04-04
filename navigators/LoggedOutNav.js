import React from 'react';
import { createStackNavigator } from '@react-navigation/stack'
import CreateAccount from '../screens/CreateAccount';
import Login from '../screens/Login';
import Welcome from '../screens/Welcome';

const Stack = createStackNavigator();

export default function LoggedOutNav(){
  return <Stack.Navigator screenOptions={{
    headerBackTitleVisible: false,
    headerTitle: false,
    headerTransparent: true,
    headerTintColor: "white",
  }}>
    <Stack.Screen name="Welcome" component={Welcome} options={{
      headerShown: false,
    }}/>
    <Stack.Screen name="Login" component={Login}/>
    <Stack.Screen name="CreateAccount" component={CreateAccount} options={{

    }}/>

  </Stack.Navigator>
}