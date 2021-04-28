import { useMutation, useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import React, { useEffect, useState } from 'react';
import { Text, View ,TouchableOpacity, StyleSheet, ScrollView, TextInput, TouchableWithoutFeedback, Keyboard, SafeAreaView, FlatList, KeyboardAvoidingView, Alert, ActivityIndicator, Platform} from "react-native"
import { useColorScheme } from 'react-native-appearance';
import ScreenLayout from '../components/ScreenLayout';
import {Ionicons} from '@expo/vector-icons';
import { useForm } from 'react-hook-form';
import DismissKeyboard from '../components/DismissKeyboard';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/core';
import { stripIgnoredCharacters } from 'graphql';
import { colors } from '../colors';

const BUTTON_COLOR = "#0A82FF"

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
const DELETE_COMMENT = gql`
  mutation deleteComment($id:Int!){
    deleteComment(id:$id){
      ok
      error 
    }
  }
`
const DELETE_SAYING = gql`
  mutation deleteSaying($id:Int!){
    deleteSaying(id:$id){
      ok
      error
    }
  }
`

function DeleteSayingButton({id}){
  console.log(id, typeof(id));
  const nav = useNavigation();
  const onCompleted = (data)=>console.log(data);
  const [deleteSaying] = useMutation(DELETE_SAYING,{onCompleted})
  return(
    <TouchableOpacity 
      onPress={()=>Alert.alert(
        "글귀를 삭제하시겠습니까?",
        "",
        [
          {
            text: "예",
            onPress: ()=>{
              deleteSaying({
                variables: {
                  id:id,
                },
              });
              nav.goBack(); 
            },
            style: "cancel"
          },
          {
            text: "아니오",
          }
        ],
        {
          cancelable: true,
        }
      )}
      style={{minHeight:18, borderColor:"white",width:32,marginTop:20}}>
      <Ionicons name="trash-outline" color="tomato" size={32}/>
    </TouchableOpacity>
  )
}
function Form({id,darkmode,textColor,refetch}){
  const {register, handleSubmit, setValue, getValues, watch} = useForm();

  const onCompleted = (data)=>{
    console.log(data)
    setValue("text", "");
    refetch();
  };
  const [createComment, {loading}] = useMutation(CREATE_COMMENT,{
    onCompleted
  });
  const onValid = ({text}) => {
    if(!loading){
      createComment({
        variables:{
          sayingId: id,
          text: text,
        },
        update: (cache, {data:{createComment:ok}})=>{
          if(ok){
            const target = `Saying:${id}`;
            cache.modify({
              id: target,
              fields:{
                totalComments(prev){
                  return prev+1;
                }
              }
            })
          }
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
    <View style={ss.formContainer(darkmode)}>
      <TextInput 
        value={watch("text")}
        placeholder="댓글 입력"
        placeholderTextColor="#bdbdbd"
        onChangeText={(text)=>setValue("text",text)}
        style={ss.formInput(textColor)}
      />
      <TouchableOpacity onPress={handleSubmit(onValid)} style={ss.formSubmit(textColor)}>
        <Text style={{color:"white", fontWeight:"bold"}}>게시</Text>
      </TouchableOpacity>
    </View>
  )
}

function Tag({id, name}){
  console.log(id, name);
  return (
    <TouchableOpacity style={ss.tagWrapper}>
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
    <View style={ss.infoContainer}>
      <TouchableOpacity style={ss.likes} onPress={toggleLike}>
        <Ionicons 
          name={isLike?"heart":"heart-outline" }
          size={30} 
          color={isLike?"tomato":textColor}/>
        <Text style={{color:textColor}}>{totalLikes}</Text>
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

function Header({id,refetch}){
  const navigation = useNavigation();
  const dismissKeyboard = ()=>{Keyboard.dismiss();}
  const colorScheme = useColorScheme();
  const darkmode = colorScheme==='dark';
  const textColor = darkmode?"white":"black";
  const {data,loading,error} = useQuery(SEE_SAYING,{
    variables: {
      id: id,
    }
  });
  if(data){
    const {id,text,user,author,tags,totalLikes, totalComments,isLike, isMine} = data.seeSaying;
    // 텍스트 전처리
    const textlen = text.length;
    let fontSize = 0;
    if (textlen < 50){
      fontSize = 18;
    }else if(textlen < 100){
      fontSize = 16;
    }else{
      fontSize = 14;
    }
    let sentences = text.split('.');
    if(sentences[sentences.length-1]=="") sentences.pop();

    return(
      <TouchableWithoutFeedback style={{ flex: 1, marginTop:10}} onPress={dismissKeyboard} disabled={Platform.OS==="web"}>
          <View style={ss.container(colorScheme)}>

            <View style={{width: "100%", flexDirection:"row", justifyContent:"space-between"}}>
              <TouchableOpacity onPress={()=>navigation.goBack()} style={{minHeight:18, width:32, marginLeft:10, marginTop:20}}><Ionicons name="arrow-back" color={textColor} size={32}/></TouchableOpacity>
              {isMine?
                <DeleteSayingButton id={id}/>
                :
                null
              }
            </View>
            <View style={ss.sayingBox(textColor,darkmode)}>
              <View style={ss.textWrapper}>
                {
                  sentences.map((text,index)=><Text key={index} style={ss.sayingText(colorScheme,fontSize)}>{text.trim()}.{"\n"}</Text>)
                }
              </View>
              <View style={{marginTop: 20}}>
                <Text style={ss.author(colorScheme)}>{author.name}</Text>
              </View>
            </View>
            <View style={{flexDirection:"row", paddingBottom:10, width:"100%", alignItems:"center",justifyContent:"center"}}>
              <TouchableOpacity>
                <Ionicons name="download-outline" color={textColor} size={32}/>
              </TouchableOpacity>
              <TouchableOpacity>
                <Ionicons name="share-social-outline" color={textColor} size={32}/>
              </TouchableOpacity>
            </View>
            <Info {...data.seeSaying} textColor={textColor}/>
            <Form id={id} darkmode={darkmode} textColor={textColor} refetch={refetch}/>
          </View>
      </TouchableWithoutFeedback>
    )
  }
  if(error){
    console.log(error);
  }
  return <View></View>
}

function RenderComment({item, refetch, id}){
  const navigation = useNavigation();
  // theme variables
  const colorScheme = useColorScheme();
  const darkmode = colorScheme==='dark';
  const textColor = darkmode?"white":"black";

  // user informations preprocessing 
  const isMine = item.isMine;
  const user = item.user;
  const time  = new Date(Number(item.createdAt));
  const hours = time.getHours();
  const minutes = time.getMinutes();
  const year = time.getFullYear();
  const date = time.getDate();
  const month = time.getMonth();

  // 삭제될 경우 
  const deleteComment = async () =>{
    try{
      const res = await deleteCommentMutation({
        variables:{
          id: item.id, // 여기서 id는 Comment의 id임.
        },
        update: (cache, {data:{deleteComment:ok}})=>{
          if(ok){
            const target = `Saying:${id}`; // 여기서 id는 Saying의 id임
            cache.modify({
              id: target,
              fields:{
                totalComments(prev){
                  return prev-1;
                }
              }
            })
          }
        }
      });
      console.log(res);
      refetch();
    }catch(e){
      console.log(e);
    }
  }
  // 코멘트 삭제 뮤테이션 
  const [deleteCommentMutation] = useMutation(DELETE_COMMENT);


  return (
    <View style={ss.commentContainer(darkmode)}>
      <View style={ss.commentHeader}>
        <View style={ss.commentHeaderLeft}>
          <TouchableOpacity 
            onPress={()=>navigation.navigate("Profile",{ // 유저 프로필 스크린으로 네이게이션
              id: user.id, // 유저 아이디, 이름, 이메일을 route.props로 전달 
              name: user.name,
              email: user.email 
            })}
            style={ss.username}>
            <Text style={{color:textColor, fontSize:18, fontWeight:"bold"}}>
              {user.name}
            </Text>
            <Ionicons name="chevron-forward-circle-outline" color={textColor} size={18}/>
          </TouchableOpacity>
          <Text style={{color:darkmode?"rgba(255,255,255,0.3)":"#bebebe", fontWeight:"bold"}}>
            {year}.{month}.{date}  {hours>=10?hours:`0${hours}`}:{minutes>=10?minutes:`0${minutes}`}
          </Text>
        </View>
        {isMine?
          <TouchableOpacity 
            onPress={()=>Alert.alert(
              "댓글을 삭제하시겠습니까?",
              "",
              [
                {
                  text: "예",
                  onPress: ()=>{deleteComment(); },
                  style: "cancel"
                },
                {
                  text: "아니오",
                }
              ],
              {
                cancelable: true,
              }
            )}
            style={ss.delete}
          >
            <Text style={{color:"tomato"}}>삭제</Text>
          </TouchableOpacity>
          :
          null
        }
      </View>

      <View style={{
        paddingHorizontal: 10,
        paddingVertical: 10
      }}>
        <Text style={{
          color:textColor
        }}>{item.text}</Text>
      </View>
    </View>
  )

}


export default function Saying({navigation, route}){
  const dismissKeyboard = ()=>{
    console.log("keyboard dismiss")
    Keyboard.dismiss();
  }
  const id = route.params.sid; // saying id
  // color theme 
  const colorScheme = useColorScheme();
  const darkmode = colorScheme==='dark';
  const textColor = darkmode?"white":"black";

  // 새로고침 함수 정의 
  const [refreshing, setRefreshing] = useState(false);
  const refresh = async ()=>{
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }
  // 코멘트 수 새로고침을 위한 상태 정의
  const [totalComments,setTotalComments] = useState(0);
  // 쿼리문 
  const {data,loading,error, refetch} = useQuery(SEE_COMMENT,{
    variables:{
      id:id,
      take: 10,
    }
  });
  // 댓글 컴포넌트 
  const renderItem = ({item})=>{
    return (
      <RenderComment item={item} refetch={refetch} id={id}/>
    )
  }
  if(loading){
    <ScreenLayout>
      <ActivityIndicator/>
    </ScreenLayout>
  }
  if(data){
    console.log("Comments::data=",data);
    let len = data.seeSayingComment.length;
    if(len){
      let lastId = data.seeSayingComment[len-1].id;
    }
    return(
      <SafeAreaView 
        style={{
          width:"100%", 
          flex:1,
          alignItems:"center",
          justifyContent:"center",
          backgroundColor: darkmode?colors.dark:"white",
        }}>
        <KeyboardAvoidingView behavior={Platform.OS==='ios'?"padding":null} enabled style={{flex:1, width:"100%", borderWidth:0,borderColor:"red"}}>

        <FlatList 
          keyboardShouldPersistTaps="handled"
          refreshing={refreshing}
          onRefresh={refresh}
          ListHeaderComponent={<Header id={id} refetch={refetch}/>}
          data={data.seeSayingComment}
          renderItem={renderItem}
          keyExtractor={item=>item.id.toString()}
          showsVerticalScrollIndicator={false}
        />
        </KeyboardAvoidingView>
      </SafeAreaView>
    )
    
  }
  if(error){
    console.log(error);
  }
  return <View></View>
}

const ss = StyleSheet.create({
  container: colorScheme=>({
    backgroundColor:colorScheme==="dark"?colors.dark:"white", 
    flex:1, 
    alignItems:"center",
    justifyContent: "center" 
  }),
  body:{
    flex:8,
    justifyContent: "center",
    alignItems: "center",
  },
  sayingText:(colorScheme,fontSize)=>({
    color: `${colorScheme==="dark"?"white":"black"}`,
    fontSize: fontSize,
  }),
  author: colorScheme=>({
    color: `${colorScheme==="dark"?"#ababab":"#323232"}`	,
    fontSize: 16,
  }),
  comment:{
    marginLeft: 10,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  likes:{
    justifyContent: "center",
    alignItems: "center"
  },
  commentContainer: darkmode=>({
    marginTop: 10,
    marginHorizontal: 10,
    borderBottomWidth:1,
    borderColor: darkmode?"rgba(255,255,255,0.1)":"#dedede",
  }),
  username:{
    marginRight: 10,
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"center"
  },
  delete:{
    alignItems:"center",
    justifyContent:"center",
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  commentHeader:{
    flexDirection:"row",
    justifyContent:"space-between",
  },
  commentHeaderLeft:{
    flexDirection:"row", 
    alignItems:"center",
    paddingLeft: 10
  },
  formContainer: darkmode=>({
    flex:1,
    flexDirection:"row", 
    borderWidth:0, 
    borderColor:"white", 
    borderRadius:30, 
    paddingHorizontal: 10,
    backgroundColor: darkmode?"rgba(255,255,255,0.1)":"#eeeeee",
    marginHorizontal: 10
  }),
  formInput: textColor=>({
    flex:5,
    paddingRight: 15,
    color: textColor,
    paddingVertical: 5,
    fontSize: 20,
    marginVertical: 5,
  }),
  formSubmit: textColor=>({
    flex:1, 
    alignItems:"center", 
    justifyContent:"center", 
    backgroundColor: BUTTON_COLOR,
    marginLeft: 10,
    marginVertical : 10,
    borderRadius: 20
  }),
  tagWrapper:{
    borderWidth: 0,
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginLeft: 5,
    marginBottom: 15,
    backgroundColor: "#eeeeee",
  },
  infoContainer:{
    alignItems:"center",
    paddingHorizontal: 10,
    flex: 1,
    flexDirection: 'row',
    height: 100,
    borderColor:"#656565",
    maxHeight:80,
    borderTopWidth: 1,
    marginHorizontal: 10
  },
  sayingBox: (textColor,darkmode)=>({
    flex:1, 
    width:"100%", 
    alignItems:"center", 
    justifyContent:"center", 
    borderWidth:0, 
    borderColor:textColor, 
    minHeight:300,
  }),
  textWrapper:{
    alignItems:"center",
    justifyContent:"center",
    paddingVertical: 50, 
    paddingHorizontal:20
  }
})
