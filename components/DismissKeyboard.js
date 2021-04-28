import React from 'react';
import { Keyboard, Platform, TouchableWithoutFeedback } from "react-native";

export default function DismissKeyboard({children}){
  const dismissKeyboard = ()=>{
    console.log("keyboard dismiss")
    Keyboard.dismiss();
  }
  return(  
    <TouchableWithoutFeedback style={{ flex: 1 }} onPress={dismissKeyboard} disabled={Platform.OS==="web"}>
      {children}
    </TouchableWithoutFeedback>
  );
}