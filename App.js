import AppLoading from 'expo-app-loading';
import React, { useState,useEffect } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Font from 'expo-font';
import { Asset } from 'expo-asset';
import LoggedOutNav from './navigators/LoggedOutNav';
import { NavigationContainer } from '@react-navigation/native';
import { Appearance, AppearanceProvider } from 'react-native-appearance';
import client, { isLoggedInVar, pushTokenVar, tokenVar } from './apollo';
import { ApolloProvider, useReactiveVar } from '@apollo/client';
import LoggedInNav from './navigators/LoggedInNav';
import AsyncStorage from '@react-native-async-storage/async-storage';

import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';

export default function App() {
  useEffect(()=>{
    registerForPushNotification().then(token=>{
      console.log("pushToken: ", token);
      pushTokenVar(token);
    }).catch(err=>console.log(err));
  },[])

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
  const [loading, setLoading] = useState(true);
  const onFinish = () => setLoading(false);
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const pushToken = useReactiveVar(pushTokenVar);
  const preloadAssets = ()=>{
    // 폰트 로딩
    const fontsToLoad = [Ionicons.font]
    const fontPromises = fontsToLoad.map(font=>Font.loadAsync(font));
    console.log(fontPromises);

    // 이미지 로딩
    const imagesToLoad = [require("./assets/logo.png")];
    const imagePromises = imagesToLoad.map(image=>Asset.loadAsync(image));

    return Promise.all([...fontPromises, ...imagePromises]);
  }
  const preload = async() => {
    const token = await AsyncStorage.getItem("token");
    console.log(`token:${token}`);
    if(token){
      isLoggedInVar(true);
      tokenVar(token);
    }
    return preloadAssets();
  }
  if(loading){
    return <AppLoading
      startAsync ={preload}
      onError={console.warn}
      onFinish={onFinish}
      />;
  }
  console.log(`color scheme: ${Appearance.getColorScheme()}`);
/*
  const subscription = Appearance.addChangeListener(({colorScheme})=>{
    console.log(colorScheme);  
  });
  console.log(`isLoggedIn:${isLoggedIn}`)
*/
  // notification setup
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
  

  return (
    <ApolloProvider client={client}>
      <AppearanceProvider>
        <NavigationContainer>
          {isLoggedIn? <LoggedInNav/>:<LoggedOutNav/>}
        </NavigationContainer>
      </AppearanceProvider>
    </ApolloProvider>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const TASK = "setNotif";

TaskManager.defineTask(TASK,()=>{
  try{
    const receivedNewData = "new data";
    console.log(new Data);
    return receivedNewData? BackgroundFetch.Result.NewData : BackgroundFetch.Result.NoData;
  }catch(error){
    return BackgroundFetch.Result.Failed;
  }
})