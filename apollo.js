import { ApolloClient, createHttpLink, InMemoryCache, makeVar } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies:{
      Query:{
        fields:{
          searchTag:{
            //keyArgs:false,
            keyArgs:["keword"],
            merge(existing=[], incoming){
              console.log("incoming:",incoming);
              return [...existing, ...incoming];
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