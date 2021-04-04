import React from 'react';
import { View ,Text, TouchableOpacity } from 'react-native';
import { useRef } from 'react';
import AuthLayout from '../components/auth/AuthLayout';
import { TextInput } from '../components/auth/AuthShared';
import AuthButton from '../components/auth/AuthButton';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import { isLoggedInVar, logUserIn } from '../apollo';

const LOGIN_MUTATION = gql`
  mutation login($username: String!, $password: String!){
    login(username:$username, password:$password){
      ok
      token
      error
    }
  }
`;

export default function Login({route}){
  console.log(route);
  const {register, handleSubmit, setValue, watch} = useForm({
    defaultValues:{
      password: route?.params?.password,
      username: route?.params?.username
    }
  })
  const passwordRef = useRef();
  console.log(watch());
  const onCompleted = async (data)=>{
    console.log(data)
    const{
      login: {ok,token},
    } = data;
    if(ok){
      await logUserIn(token);
    }
  }
  const [loginMutation, {loading}] = useMutation(LOGIN_MUTATION,{
    onCompleted,
  });

  const onNext = (next)=>{
    next?.current?.focus(); 
  };
  const onValid = (data)=>{
    console.log(data)
    if(!loading){
      loginMutation({
        variables:{
          username:data.username,
          password:data.password,
        }
      })
    }
  }

  useEffect(()=>{
    register("username");
    register("password");
  },[register])// runs only once, or if the 'register' changes

  return(
    <AuthLayout>
      <TextInput
        value={watch("username")}
        autoCapitalize={"none"}
        placeholder="아이디"
        placeholderTextColor="gray"
        returnKeyType="next"
        onSubmitEditing={()=>onNext(passwordRef)}
        onChangeText={(text)=>setValue("username",text)}
      />
      <TextInput
        value={watch("password")}
        ref={passwordRef}
        placeholder="비밀번호"
        placeholderTextColor="gray"
        returnKeyType="done"
        onSubmitEditing={handleSubmit(onValid)}
        onChangeText={(text)=>setValue("password",text)}
      />
      <AuthButton 
        text="Log in" 
        disabled={!watch("username")||!watch("password")}  
        onPress={handleSubmit(onValid)} 
        loading={loading} />
    </AuthLayout>
  )
}