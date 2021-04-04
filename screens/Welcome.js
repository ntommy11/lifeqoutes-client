import React from 'react';
import { View,Text,TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { colors } from '../colors';
import AuthLayout from "../components/auth/AuthLayout";
import AuthButton from "../components/auth/AuthButton";

const Container = styled.View`
  flex:1;
  background-color: black;
  align-items: center;
  justify-content: center;
  padding: 0px 40px;
`;

const Logo = styled.Image`
  max-width: 50%;
  height: 100px;
`;

const CreateAccount = styled.TouchableOpacity`
  background-color: ${colors.blue};
  padding: 10px 10px;
  border-radius: 5px;
  width: 100%;
  opacity: ${props=>props.disabled?"0.5":"1"};
`
const CreateAccountText = styled.Text `
  color: white;
  font-weight: 600;
  font-size: 16px;
  text-align: center;

`
const LoginLink = styled.Text`
  color:${colors.blue};
  font-weight: 600;
  margin-top: 20px;

`


export default function Welcome({navigation}){
  const goToCreateAccount = ()=>navigation.navigate("CreateAccount");
  const goToLogin = () => navigation.navigate("Login");
  return(
    <AuthLayout>
      <AuthButton text="Create New Account" disabled={false} onPress={goToCreateAccount}/>
      <TouchableOpacity onPress={goToLogin}>
        <LoginLink>Log in</LoginLink>
      </TouchableOpacity>
    </AuthLayout>
  )
}