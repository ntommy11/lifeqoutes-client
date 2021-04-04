import React from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import styled from 'styled-components/native';

const Container = styled.View`
  flex:1;
  background-color: black;
  align-items: center;
  justify-content: center;
  padding: 0px 40px;
`;

const Logo = styled.Image`
  max-width: 50%;
  width: 100%;
  margin: 0 auto;
  height: 100px;
`;


export default function AuthLayout({children}){
  const dismissKeyboard = ()=>{
    Keyboard.dismiss();
  }
  return(
    <TouchableWithoutFeedback style={{ flex: 1 }} onPress={dismissKeyboard} disabled={Platform.OS==="web"}>
      <Container>
        <KeyboardAvoidingView
          style={{
            width: "100%",
          }}
          behavior="position"
          keyboardVerticalOffset={Platform.OS === "ios" ? 30 : 0}>
          <Logo resizeMode="contain" source={require("../../assets/logo2.png")} />
          {children}
        </KeyboardAvoidingView>
      </Container>

    </TouchableWithoutFeedback>

  )
}