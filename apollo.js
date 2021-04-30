import { ApolloClient, createHttpLink, InMemoryCache, makeVar, ApolloLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { relayStylePagination } from '@apollo/client/utilities';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onError } from 'apollo-link-error'


const deduplicate = (array)=>{
  let unique__ref = [];
  let res = [];
  array.forEach((obj)=>{
    if(!unique__ref.includes(obj.__ref)){
      unique__ref.push(obj.__ref);
      res.push(obj);
    }
  });
  return res;
}

const TOKEN = "token"

export const isLoggedInVar = makeVar(false);
export const tokenVar = makeVar("");

export const logUserIn = async (token)=>{
  await AsyncStorage.multiSet([
    [TOKEN, token],
    ["loggedIn", "yes"],
  ]);
  isLoggedInVar(true);
  tokenVar(token);
}

export const logUserOut = async()=>{
  await AsyncStorage.removeItem(TOKEN);
  isLoggedInVar(false);
  tokenVar(null);
}

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    console.log('graphQLErrors', graphQLErrors);
  }
  if (networkError) {
    console.log('networkError', networkError);
  }
});


const httpLink = createHttpLink({
  uri:"http://54.180.106.241:4000/graphql",
});

const authLink = setContext((_,{headers})=>{
  return{
    headers:{
      ...headers,
      authorization: tokenVar()
    }
  }
});

const link = ApolloLink.from([authLink,errorLink,httpLink]);

const client = new ApolloClient({
  link: link,//authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies:{
      Query:{
        fields:{
          searchTag:{
            //keyArgs:false,
            keyArgs:["keword"],
            merge(existing=[], incoming){
              console.log("incoming:",incoming);
              return deduplicate([...existing, ...incoming]);
            }
          },
          searchAuthor:{
            //keyArgs:false,
            keyArgs:["keyword"],
            merge(existing=[], incoming){
              console.log("incoming:",incoming);
              return [...existing, ...incoming];
            }
          }, 
          seeTagSaying:{
            keyArgs:["id"],
            merge(existing=[], incoming){
              return deduplicate([...existing, ...incoming]);
            }
          },
          seeAuthorSaying:{
            keyArgs:["id"],
            merge(existing=[], incoming){
              return deduplicate([...existing, ...incoming]);
            }      
          },
          seeUserSaying:{
            keyArgs:["id"],
            merge(existing=[], incoming){
              console.log("existing:",existing);
              console.log('incoming:',incoming);
              return deduplicate([...existing, ...incoming]);
            }      
          },
          seeUserLike:{
            keyArgs:["id"],
            merge(existing=[], incoming){
              return deduplicate([...existing, ...incoming]);
            }     
          }
        }
      }
    }
  
  }),
});
export default client;

/*

import { ApolloClient, InMemoryCache, makeVar } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const isLoggedInVar = makeVar(false);
export const tokenVar = makeVar("");

export const logUserIn = async (token)=>{
  await AsyncStorage.multiSet([
    ["token", token],
    ["loggedIn", "yes"],
  ]);
  isLoggedInVar(true);
  tokenVar(token);
}
export const logUserOut = async ()=>{
  await AsyncStorage.multiRemove([
    "token", 
    "loggedIn"
  ]);
  isLoggedInVar(false);
  tokenVar(null);
}
const SERVER_URI = "http://54.180.106.241:4000/graphql"

const client = new ApolloClient({
  uri:SERVER_URI,
  cache: new InMemoryCache(),
});
export default client;
*/