import React, { useEffect } from 'react';
import { ScrollView, Text, View ,TouchableOpacity, TextInput, TouchableWithoutFeedback,KeyboardAvoidingView, Keyboard, Alert,StyleSheet } from "react-native"
import { useColorScheme } from 'react-native-appearance';
import { Ionicons } from '@expo/vector-icons';
import { set, useForm } from 'react-hook-form';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AuthLayout from '../components/auth/AuthLayout';
import { SEARCH_AUTHOR, SEARCH_TAG } from '../queries';
import { useIsFocused } from '@react-navigation/core';
import useUser from '../hooks/useUser';

const BUTTON_COLOR = "#0A82FF"

const UPLOAD_SAYING = gql`
  mutation uploadSaying(
    $text: String!,
    $tag: [String],
    $author: String!
  ){
    uploadSaying(
      text: $text
      tag: $tag
      author: $author
    ){
      id
    }
  }
`
function Tag({name,tags,setTags}){
  //console.log(name);
  return (
    <TouchableOpacity 
      onPress={()=>{
        setTags(old=>old.filter((item)=>item!=name));
      }}
      style={css.tagWrapper}
    >
      <Text style={{color:"#464646"}}>{name} </Text>
      <Ionicons name="close"/>
    </TouchableOpacity>
  )
}
function RecommendTags({keyword,setValue,addTag}){
  if(keyword==undefined || keyword=="") return null;

  const {data,loading,error} = useQuery(SEARCH_TAG,{
    variables:{
      keyword:keyword.toUpperCase(),
      take: 10
    }
  });

  const [isCompleted, setIsCompleted] = useState(false);
  const close = ()=>{
    setIsCompleted(true);
  }
  if(isCompleted) return null;

  if(error){
    console.log()
  }
  if(data){
    //console.log(data);
    return(
      <ScrollView
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        showsHorizontalScrollIndicator={false}
        horizontal={true} 
        style={{
          position:'absolute',
          zIndex:1,  
          width:"100%",
          top:345,
        }}>
          {
            data.searchTag.map((item,index)=>{
              return(
                <TouchableOpacity 
                  key={index} 
                  onPress={()=>{
                    setValue("tag",item.name)
                    addTag();
                    close();
                  }}
                  style={css.recommendItem}>
                  <Text style={{fontWeight:"bold"}}>{item.name}</Text>
                  <Text style={{color:"#888888"}}> {item.totalSayings} </Text>
                </TouchableOpacity>
              )
            })
          }
      </ScrollView>
    )
  }
  return null;
}
function RecommendAuthor({keyword,setValue, darkmode}){
  if(keyword==undefined || keyword=="") return null;

  const {data,loading,error} = useQuery(SEARCH_AUTHOR,{
    variables:{
      keyword:keyword.toUpperCase(),
      take: 10
    }
  });

  const [isCompleted, setIsCompleted] = useState(false);
  const close = ()=>{
    setIsCompleted(true);
  }
  if(isCompleted) return null;

  if(error){
    //console.log()
  }
  if(data){
    //console.log(data);
    return(
      <ScrollView
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        showsHorizontalScrollIndicator={false}
        horizontal={true} 
        style={{
          position:'absolute',
          zIndex:1,  
          width:"100%",
          top:260,
        }}>
          {
            data.searchAuthor.map((item,index)=>{
              return(
                <TouchableOpacity 
                  key={index} 
                  onPress={()=>{
                    setValue("author",item.name)
                    close();
                  }}
                  style={css.recommendItem}>
                  <Text style={{fontWeight:"bold"}}>{item.name}</Text>
                  <Text style={{color:"#888888"}}> {item.totalSayings} </Text>
                </TouchableOpacity>
              )
            })
          }
      </ScrollView>
    )
  }
  return null;
}

function Subtitle({textColor,iconName,text}){
  let iconColor = null;
  switch(iconName){
    case "bulb": iconColor = "#FFD700"; break;
    case "person-add": iconColor = "#00BFFF"; break;
    case "pricetags": iconColor = "#87EEC6"; break;
  }
  return(
    <View style={{
      marginTop: 10,
      marginLeft: 5,
      flexDirection:"row"
    }}>
      <Ionicons name={iconName} size={18} color={iconColor}/>
      <Text style={{
        color: textColor,
        fontSize: 18
      }}> {text}</Text>
    </View>
  )
}

export default function Create({navigation}){
  const {id:userId} = useUser();
  const {register, handleSubmit, setValue, getValues, watch} = useForm();
  const isFocused = useIsFocused();
  const colorScheme = useColorScheme();
  const darkmode = colorScheme==="dark";
  const textColor = darkmode?"white":"black";
  const [tags, setTags] = useState([]);
  const [bySelf, setBySelf] = useState(false);
  const [tagInput, setTagInput] = useState("");


  const onCompleted = (data)=>{
    //console.log(data);
    const {uploadSaying:{id}} = data; // UNZIP result data
    if(id){
      Alert.alert("업로드 성공!");
      navigation.navigate("Saying",{
        sid: id,
      });
    }
  }

  const onValid = (data)=>{
    console.log(data);
    if(data.text.length<5){
      Alert.alert("내용을 5자 이상 입력해주세요");
      return;
    }
    if(tags.length==0){
      Alert.alert("태그를 하나 이상 추가해주세요!");
      return;
    }
    //console.log("data:",data);
    if(!loading){
      uploadSayingMutation({
        variables:{
          text:data.text,
          author:data.author===""?"작자미상":data.author,
          tag:tags
        }
      })
    }

  }

  const onError = (errors)=>{
    console.log(errors);
    const {author, text} = errors;
    if(text.ref.value===""){
      Alert.alert("내용을 입력하세요");
    }
  }

  const addTag = ()=>{
    const {tag} = getValues();
    if (tag==undefined || tag==""){
      setValue("tag","")
      return;
    } 
    
    //console.log(tag);
    setTags(old=>[...old,tag]);
    //console.log("tags:",tags);
    setValue("tag","");
  }
  const [uploadSayingMutation, {loading}] = useMutation(UPLOAD_SAYING,{
    onCompleted,
    update:(cache, res)=>{
      const {data:{uploadSaying:{id}}} = res;
      //console.log("res=",res);
      //console.log("uploadSaying ok?",id);
      if(!id) return;
      cache.modify({
        id:`User:${userId}`,
        fields:{
          totalSayings(prev){
            return prev+1;
          }
        }
      })
    }
  })

  const dismissKeyboard = ()=>{
    //console.log("keyboard dismiss");
    Keyboard.dismiss();
  }

  useEffect(()=>{
    register("text",{
      required: true,
    });
    register("tag",{
      required:false,
    });
    register("author",{
      required: false,
    });
    navigation.addListener('focus',()=>{
      setValue("text","");
      setValue("tag","");
      setValue("author","");
      setTags([]);
    })
  },[register])
  //console.log(watch());
  if(isFocused){
    return(
      <TouchableWithoutFeedback style={{ flex: 1 }} onPress={dismissKeyboard} disabled={Platform.OS==="web"}>
        
        <KeyboardAwareScrollView
          extraHeight={0}
          enableResetScrollToCoords={false}
          keyboardShouldPersistTaps="handled"
          style={{flex:1, width:"100%", paddingHorizontal:20, paddingTop: 20, backgroundColor:darkmode?"#111819":"white"}} 
          showsVerticalScrollIndicator={false}
        >
        
        {/*
          <ScrollView         
            keyboardShouldPersistTaps="handled"
            style={{flex:1, width:"100%", paddingHorizontal:20, paddingTop: 20}} 
            showsVerticalScrollIndicator={false}>
        <KeyboardAvoidingView behavior="padding" enabled style={{flex:1, width:"100%", borderWidth:0,borderColor:"red"}}> 
        */}
          <View style={{
            backgroundColor:colorScheme==="dark"?"#111819":"white", 
            flex:1, 
            width:"100%"
          }}>
            <Subtitle textColor={textColor} iconName="bulb" text="내용"/>
            <TextInput 
              multiline={true}
              placeholder="내용을 입력하세요."
              placeholderTextColor={darkmode?"#878787":"#cdcdcd"}
              onChangeText={(text)=>setValue("text",text)}
              style={css.textInput(textColor,darkmode)}  
            />
            <Subtitle textColor={textColor} iconName="person-add" text="작자/출처"/>
            <View style={{
              flex:1,
              flexDirection: 'row'
            }}>
              <TextInput 
                value={watch("author")}
                multiline={false}
                onChangeText={(text)=>setValue("author",text)}
                style={css.authorInput(textColor,darkmode)}
              />
              <TouchableOpacity 
                style={css.bySelfContainer}
                onPress={()=>setBySelf(!bySelf)}
              >
                <Ionicons 
                  name={bySelf?"checkmark-circle":"checkmark-circle-outline" }
                  size={28} 
                  color={bySelf?"#1E96FF":"#ababab"}/>
                <Text style={{
                  color: bySelf?textColor:"#ababab",
                  fontSize: 20
                }}>미상</Text>
              </TouchableOpacity>
            </View>
            <RecommendAuthor keyword={watch("author")} setValue={setValue} darkmode={darkmode}/>
            <RecommendTags keyword={watch("tag")} setValue={setValue} addTag={addTag}/>
            <Subtitle textColor={textColor} iconName="pricetags" text="태그"/>
            <View style={{
              flex:1,
              flexDirection: 'row'
            }}>
              <TextInput 
                value={watch("tag")}
                onChangeText={(text)=>{
                  setValue("tag",text);
                  setTagInput(text);
                }}
                onSubmitEditing={()=>addTag()}
                style={css.authorInput(textColor,darkmode)}
              />
              <TouchableOpacity 
                onPress={()=>addTag()}
                style={{
                  flex:2, 
                  alignItems:"center", 
                  justifyContent:"center", 
                  borderColor:BUTTON_COLOR,
                  borderWidth:1,
                  borderRadius:5,
                  marginLeft: 10,
                  marginVertical : 10,
                  flexDirection:"row"
                  }}
                >
                <Text style={{color:BUTTON_COLOR, fontWeight:"bold"}}>추가</Text>
                <Ionicons name="add" color={BUTTON_COLOR} size={18}/>
              </TouchableOpacity>
            </View>
            <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} bounces={true}>
                {
                  tags.map((name,index)=><Tag key={index} name={name} setTags={setTags} tags={tags}/>)
                }
              </ScrollView>
            <TouchableOpacity 
              onPress={handleSubmit(onValid,onError)}
              style={css.submitButton}
            >
              <Text style={{color:"white", fontSize:18, fontWeight:"bold"}}>완료</Text>
            </TouchableOpacity>
          </View>
          {/*
          </KeyboardAvoidingView>
          </ScrollView>*/}
          
            </KeyboardAwareScrollView>
          
    </TouchableWithoutFeedback>
    )
  }else{
    return <View></View>
  }
}

const css = StyleSheet.create({
  tagWrapper:{
    borderWidth: 0,
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginLeft: 5,
    backgroundColor: "#eeeeee",
    flexDirection:"row",   
    alignItems:"center",
    justifyContent:"center" 
  },
  textInput:(textColor,darkmode)=>({
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: darkmode?"transparent":"#cdcdcd",
    paddingRight: 15,
    height: 200,
    color: textColor,
    borderRadius:7,
    paddingVertical: 5,
    fontSize: 20,
    marginVertical: 10,
    paddingHorizontal: 10
  }),
  authorInput:(textColor,darkmode)=>({
    backgroundColor: "rgba(255,255,255,0.05)",
    flex: 7,
    borderWidth: 1,
    borderColor: darkmode?"transparent":"#cdcdcd",
    paddingRight: 15,
    color: textColor,
    borderRadius:7,
    paddingVertical: 5,
    fontSize: 20,
    marginVertical: 10,
    paddingHorizontal: 10
  }),
  tagInput:textColor=>({
    flex: 7,
    borderBottomWidth: 1,
    borderColor: textColor,
    paddingRight: 15,
    color: textColor,
    paddingVertical: 5,
    fontSize: 20,
    marginVertical: 10,
  }),
  bySelfContainer:{
    flex:2,
    flexDirection: "row",
    alignItems:"center",
    marginLeft:10,
  },
  submitButton:{
    alignItems:"center", 
    justifyContent:"center",
    backgroundColor:BUTTON_COLOR,
    marginHorizontal: 120,
    padding: 10, 
    borderRadius: 25,
    marginTop: 40,
    marginBottom: 50,
  },
  recommendItem:{
    backgroundColor:"#dedede",
    borderRadius:5,
    padding: 5,
    marginRight: 5,
    flexDirection:"row",
    alignItems:"center"
  }
})
