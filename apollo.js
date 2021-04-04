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
const client = new ApolloClient({
  uri:"https://wisesaying3.azurewebsites.net/graphql",
  cache: new InMemoryCache(),
});
export default client;