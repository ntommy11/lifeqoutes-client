import { useMutation, useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import React, { useEffect } from 'react';
import { Text, View ,TouchableOpacity, StyleSheet, ScrollView, TextInput, TouchableWithoutFeedback, Keyboard, SafeAreaView, FlatList} from "react-native"
import { useColorScheme } from 'react-native-appearance';
import ScreenLayout from '../components/ScreenLayout';
import {Ionicons} from '@expo/vector-icons';
import { useForm } from 'react-hook-form';
import DismissKeyboard from '../components/DismissKeyboard';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const ss = StyleSheet.create({
  container: colorScheme=>({
    backgroundColor:colorScheme==="dark"?"black":"white", 
    flex:1, 
    alignItems:"center",
    justifyContent: "center" 
  }),
  body:{
    flex:8,
    justifyContent: "center",
    alignItems: "center",
  },
  sayingText:colorScheme=>({
    color: `${colorScheme==="dark"?"white":"black"}`,
    fontSize: 22,
  }),
  author: colorScheme=>({
    color: `${colorScheme==="dark"?"#ababab":"#323232"}`	,
    fontSize: 16,
  }),
  comment:{
    marginLeft: 10,
    marginRight: 10,
    borderWidth: 1,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center"
  },
  likes:{
    borderWidth: 1,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center"
  }
})
const SEE_SAYING = gql`
  query seeSaying($id:Int!){
    seeSaying(id:$id){
      id
      user{
        id
        name
        email
      }
      author{
        id
        name
      }
      tags{
        id
        name
      }
      text
      totalLikes
      totalComments
      isLike
      isMine
    }
  }
`
const TOGGLE_LIKE = gql`
  mutation toggleLike($id:Int!){
    toggleLike(id: $id){
      ok
      error 
    }
  }
`

const CREATE_COMMENT = gql`
  mutation createComment($sayingId: Int!, $text: String!){
    createComment(sayingId: $sayingId, text:$text){
      ok
      error
    }
  }
`

const SEE_COMMENT = gql`
  query seeSayingComment($id:Int!, $take: Int!, $lastId:Int){
    seeSayingComment(id:$id, take:$take, lastId:$lastId){
      id
      createdAt 
      text 
      isMine 
      user{
        id
        name
        email
      }
    }
  }

`
function Comments({id}){
  console.log('id=',id);
  const renderItem = ({item})=>{
    return (
      <View>
        <Text style={{color:"white"}}>{item.createdAt}</Text>
        <Text style={{color:"white"}}>{item.text}</Text>
      </View>
    )
  }
  const {data,loading,error} = useQuery(SEE_COMMENT,{
    variables:{
      id:id,
      take: 10,
    }
  });
  if(data){
    console.log("Comments::data=",data);
    let len = data.seeSayingComment.length;
    if(len){
      let lastId = data.seeSayingComment[len-1].id;
      return(
        <SafeAreaView style={{borderWidth:1, width:"100%", flex:1, borderColor:"blue"}}>
          <FlatList 
            data={data.seeSayingComment}
            renderItem={renderItem}
            keyExtractor={item=>item.id.toString()}
          />
        </SafeAreaView>
      )
    }
  }
  if(error){
    console.log(error);
  }
  return <View></View>
}


function Form({id,darkmode,textColor}){
  const {register, handleSubmit, setValue, getValues, watch} = useForm();

  const onCompleted = (data)=>console.log(data);
  const [createComment, {loading}] = useMutation(CREATE_COMMENT,{
    onCompleted
  });
  const onValid = ({text}) => {
    if(!loading){
      createComment({
        variables:{
          sayingId: id,
          text: text,
        }
      })
    }
  }
  useEffect(()=>{
    register("text",{
      required: true,
    });
  },[]);
  return(
    <View style={{
      flex:1,
      flexDirection:"row", 
      borderWidth:0, 
      borderColor:"white", 
      borderRadius:30, 
      paddingHorizontal: 10,
      backgroundColor: darkmode?"rgba(255,255,255,0.1)":"#dedede",
      marginHorizontal: 10
    }}>
      <TextInput 
        placeholder="댓글 입력"
        placeholderTextColor="#dedede"
        onChangeText={(text)=>setValue("text",text)}
        style={{
              flex: 7,
              paddingRight: 15,
              color: textColor,
              paddingVertical: 5,
              fontSize: 20,
              marginVertical: 5,
        }}
      />
      <TouchableOpacity 
        onPress={handleSubmit(onValid)}
        style={{
          flex:2, 
          alignItems:"center", 
          justifyContent:"center", 
          borderWidth:1, 
          borderColor:textColor,
          marginLeft: 10,
          marginVertical : 10,
          borderRadius: 20
          }}
        >
        <Text style={{color:textColor}}>게시</Text>
      </TouchableOpacity>
    </View>
  )
}

function Tag({id, name}){
  console.log(id, name);
  return (
    <TouchableOpacity style={{
      borderWidth: 0,
      borderRadius: 15,
      paddingVertical: 5,
      paddingHorizontal: 10,
      marginLeft: 5,
      marginBottom: 15,
      backgroundColor: "#eeeeee",
      
    }}>
      <Text style={{color:"#464646"}}>{name}</Text>
    </TouchableOpacity>
  )
}

function Info({totalLikes, totalComments, isLike, textColor,tags, id}){
  const [toggleLike] = useMutation(TOGGLE_LIKE,{
    variables:{
      id,
    },
    update: (cache, { data:{toggleLike:{ok}}})=>{
      console.log("ok=",ok);
      if(ok){
        const target = `Saying:${id}`; // 수정할 대상을 지정
        cache.modify({
          id: target,
          fields:{
            isLike(prev){
              return !prev;
            },
            totalLikes(prev){
              if (isLike) return prev-1;
              else return prev+1;
            },
          },
        });
      }
    },
    onCompleted:(data)=>console.log(data),
  });
  return(
    <View style={{
      alignItems:"center",
      paddingHorizontal: 10,
      flex: 1,
      flexDirection: 'row',
      height: 100,
      borderColor:"#656565",
      maxHeight:80,
      borderTopWidth: 1,
      marginHorizontal: 10
    }}>
      <TouchableOpacity style={ss.likes} onPress={toggleLike}>
        <Ionicons 
          name={isLike?"heart":"heart-outline" }
          size={30} 
          color={isLike?"tomato":textColor}/>
        <Text style={{
          color:textColor
        }}>{totalLikes}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={ss.comment}>
        <Ionicons name="chatbox-outline" size={30} color={textColor}/>
        <Text style={{
          color:textColor
        }}>{totalComments}</Text>
      </TouchableOpacity>
      <ScrollView horizontal={true} bounces={true}>
        {
          tags.map((item,index)=><Tag key={index} {...item}/>)
        }
      </ScrollView>
    </View>
  )
}



export default function Saying({navigation, route}){
  const dismissKeyboard = ()=>{
    console.log("keyboard dismiss")
    Keyboard.dismiss();
  }
  const sid = route.params.sid; // saying id
  // color theme 
  const colorScheme = useColorScheme();
  const darkmode = colorScheme==='dark';
  const textColor = darkmode?"white":"black";

  const {data,loading,error} = useQuery(SEE_SAYING,{
    variables: {
      id: sid,
    }
  })

  if (data){
    const {id,text,user,author,tags,totalLikes, totalComments,isLike, isMine} = data.seeSaying;
    console.log("Saying::data=",data);
    return(
      <TouchableWithoutFeedback style={{ flex: 1 }} onPress={dismissKeyboard} disabled={Platform.OS==="web"}>
        <KeyboardAwareScrollView style={{flex:1, width:"100%", borderWidth:1,borderColor:"red", backgroundColor:darkmode?"black":"white"}}>
          <View style={ss.container(colorScheme)}>

          <View style={{borderColor:"red", borderWidth:1, width: "100%", flexDirection:"row", justifyContent:"space-between"}}>
            <TouchableOpacity onPress={()=>navigation.goBack()} style={{minHeight:18, marginTop:20, borderWidth:1,borderColor:"white",width:32}}><Ionicons name="arrow-back" color={textColor} size={32}/></TouchableOpacity>
            <TouchableOpacity onPress={()=>navigation.goBack()} style={{minHeight:18, marginTop:20, borderWidth:1,borderColor:"white",width:32}}><Ionicons name="trash-outline" color="tomato" size={32}/></TouchableOpacity>

          </View>
          <View style={{flex:1, alignItems:"center", justifyContent:"center", borderWidth:1, borderColor:textColor, minHeight:300}}>
            <View>
              <Text style={{color:textColor}}>{text}</Text>
            </View>
            <View>
              <Text style={{color:textColor}}>{author.name}</Text>
            </View>
          </View>
          <View style={{flexDirection:"row", marginBottom:10}}>
            <TouchableOpacity>
              <Ionicons name="download-outline" color={textColor} size={32}/>
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="share-social-outline" color={textColor} size={32}/>
            </TouchableOpacity>
          </View>
          <Info {...data.seeSaying} textColor={textColor}/>
          <Form id={id} darkmode={darkmode} textColor={textColor}/>
          </View>
          </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    )
  }
  console.log(navigation, route);
  return(
    <ScreenLayout>

    </ScreenLayout>
  )
}


