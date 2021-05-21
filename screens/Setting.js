import React from 'react';
import { Button, Text } from 'react-native';

import ScreenLayout from "../components/ScreenLayout";

import Task from '../services/backgroundTask';

export default function Setting(){
  const registerTask = ()=>{
    Task.register()
      .then(()=>console.log("task registered!"))
      .catch( error => console.log(error))
  }
  const unregisterTask = ()=>{
    Task.unregister()
      .then(()=>console.log("task unregistered!"))
      .catch( error => console.log(error))
  }
  return <ScreenLayout>
    <Text>Setting</Text>
    <Button title="register" onPress={()=>registerTask()}/>
    <Button title="unregister" onPress={()=>unregisterTask()}/>
  </ScreenLayout>
}