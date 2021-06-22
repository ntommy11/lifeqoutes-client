import React from 'react';
import { View ,Text, TouchableOpacity, Alert } from 'react-native';
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
  mutation login($email: String!, $password: String!){
    login(email:$email, password:$password){
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
      email: route?.params?.email
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
    }else{
      Alert.alert("로그인 실패","아이디 또는 비밀번호를 확인해주세요.")
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
          email:data.email,
          password:data.password,
        }
      })
    }
  }

  useEffect(()=>{
    register("email");
    register("password");
  },[register])// runs only once, or if the 'register' changes

  return(
    <AuthLayout>
      <TextInput
        value={watch("email")}
        autoCapitalize={"none"}
        placeholder="아이디"
        placeholderTextColor="gray"
        returnKeyType="next"
        onSubmitEditing={()=>onNext(passwordRef)}
        onChangeText={(text)=>setValue("email",text)}
      />
      <TextInput
        value={watch("password")}
        ref={passwordRef}
        placeholder="비밀번호"
        placeholderTextColor="gray"
        returnKeyType="done"
        autoCapitalize={"none"}
        onSubmitEditing={handleSubmit(onValid)}
        onChangeText={(text)=>setValue("password",text)}
        secureTextEntry={true}
      />
      <AuthButton 
        text="Log in" 
        disabled={!watch("email")||!watch("password")}  
        onPress={handleSubmit(onValid)} 
        loading={loading} />
    </AuthLayout>
  )
}