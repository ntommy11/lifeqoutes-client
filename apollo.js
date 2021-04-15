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