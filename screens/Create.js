import React, { useEffect } from 'react';
import { Text, View ,TouchableOpacity, TextInput, TouchableWithoutFeedback,KeyboardAvoidingView, Keyboard } from "react-native"
import { useColorScheme } from 'react-native-appearance';
import { ScrollView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useForm } from 'react-hook-form';
import { gql, useMutation } from '@apollo/client';
import { useState } from 'react';
import RootTagContext from 'react-native/Libraries/ReactNative/RootTagContext';

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
      ok
      error
    }
  }
`
function Tag({name,tags,setTags}){
  console.log(name);
  return (
    <TouchableOpacity 
      onPress={()=>{
        setTags(old=>old.filter((item)=>item!=name));
      }}
      style={{
        borderWidth: 0,
        borderRadius: 15,
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginLeft: 5,
        marginBottom: 15,
        backgroundColor: "#eeeeee",
        flexDirection:"row",        
      }}
    >
      <Text style={{color:"#464646"}}>{name} </Text>
      <Ionicons name="close"/>
    </TouchableOpacity>
  )
}

export default function Create({navigation}){
  const colorScheme = useColorScheme();
  const textColor = colorScheme==="dark"?"white":"black";
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const {register, handleSubmit, setValue, getValues, watch} = useForm();
  const addTag = ()=>{
    const {tag} = getValues();
    if (tag=="") return;
    console.log(tag);
    setTags(old=>[...old,tag]);
    console.log("tags:",tags);
    setTagInput("")
  }
  const [uploadSayingMutation, {loading}] = useMutation(UPLOAD_SAYING)

  const dismissKeyboard = ()=>{
    console.log("keyboard dismiss");
    Keyboard.dismiss();
  }

  useEffect(()=>{
    register("text",{
      required: true,
    });
    register("tag",{
      required: true,
    });
    register("author",{
      required: true,
    });
  },[register])
  return(
    <TouchableWithoutFeedback style={{ flex: 1 }} onPress={dismissKeyboard} disabled={Platform.OS==="web"}>
      <View style={{
        backgroundColor:colorScheme==="dark"?"black":"white", 
        flex:1, 
        alignItems:"center",
        justifyContent: "center" 
      }}>
      <ScrollView style={{flex:1, width:"100%", borderWidth:1,borderColor:"red"}}>
        <View style={{
          flex: 1,
          width: "100%",
          borderColor: "blue",
          borderWidth:1,
        }}>
        <View style={{
          marginLeft: 15
        }}>
        <Text style={{
          color: textColor,
        }}>내용</Text>
        </View>
        <TextInput 
          multiline={true}
          placeholder="내용을 입력하세요."
          onChangeText={(text)=>setValue("text",text)}
          style={{
            borderWidth: 1,
            borderColor: textColor,
            paddingRight: 15,
            height: 200,
            color: textColor,
            borderRadius:7,
            paddingVertical: 5,
            paddingHorizontal: 5,
            fontSize: 20,
            marginVertical: 10,
            marginHorizontal: 15,
          }}  
        />
        <View style={{
          marginLeft: 15
        }}>
        <Text style={{
          color: textColor,
        }}>작자</Text>
        </View>
        <View style={{
          flex:1,
          flexDirection: 'row'
        }}>
          <TextInput 
            multiline={false}
            onChangeText={(text)=>setValue("author",text)}
            style={{
              flex: 7,
              borderWidth: 1,
              borderColor: textColor,
              paddingRight: 15,
              color: textColor,
              borderRadius:7,
              paddingVertical: 5,
              paddingHorizontal: 5,
              fontSize: 20,
              marginVertical: 10,
              marginHorizontal: 15,
            }}
          />
          <View style={{
            flex:2,
            flexDirection: "row",
            alignItems:"center",
          }}>
            <Ionicons name="checkmark-circle-outline" size={32} color={textColor}/>
            <Text style={{
              color: textColor,
              fontSize: 22
            }}>본인</Text>
          </View>
        </View>
        <View style={{
          marginLeft: 15
        }}>
        <Text style={{
          color: textColor,
        }}>태그</Text>
        </View>
        <View style={{
          flex:1,
          flexDirection: 'row'
        }}>
          <TextInput 
            value={tagInput}
            onChangeText={(text)=>{
              setValue("tag",text);
              setTagInput(text);
            }}
            onSubmitEditing={()=>addTag()}
            style={{
              flex: 7,
              borderBottomWidth: 1,
              borderColor: textColor,
              paddingRight: 15,
              color: textColor,
              paddingVertical: 5,
              paddingHorizontal: 5,
              fontSize: 20,
              marginVertical: 10,
              marginHorizontal: 15,
            }}
          />
          <TouchableOpacity style={{flex:2, alignItems:"center", justifyContent:"center", borderWidth:1, borderColor:textColor}}>
            <Text style={{color:textColor}}>추가</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal={true} bounces={true}>
            {
              tags.map((name,index)=><Tag key={index} name={name} setTags={setTags} tags={tags}/>)
            }
          </ScrollView>
        <TouchableOpacity style={{alignItems:"center", justifyContent:"center"}}>
          <Text style={{color:textColor}}>완료</Text>
        </TouchableOpacity>


      </View>
      </ScrollView>
      </View>
  </TouchableWithoutFeedback>
  )
}