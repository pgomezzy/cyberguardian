import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from 'react';
import home from "./src/views/home";
import Arquivo from "./src/views/Arquivo";
import UrlPage from "./src/views/Url"
import Construção from "./src/views/emConstrução";
import Constants from 'expo-constants';

console.log('🔑 API KEY:', Constants.expoConfig.extra.VIRUS_TOTAL_API_KEY);
const Stack = createNativeStackNavigator();



export default function App(){

return(
  <NavigationContainer >
    <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen 
          name='Home' 
          component={home}
          options={{headerStyle: {backgroundColor: '#031a32'}, headerTintColor: '#a6a6a6'}}  
        />
        <Stack.Screen
          name='Arquivo' 
          component={Arquivo}
          options={{headerStyle: {backgroundColor: '#031a32'}, headerTintColor: '#a6a6a6'}}  
          />
        <Stack.Screen
          name='URL' 
          component={UrlPage}
          options={{headerStyle: {backgroundColor: '#031a32'}, headerTintColor: '#a6a6a6'}}  
          /> 
        <Stack.Screen 
          name='Construção'
          component={Construção}
          options={{headerStyle: {backgroundColor: '#031a32'}, headerTintColor: '#a6a6a6'}}  
          />
     </Stack.Navigator>
  </NavigationContainer>
)

}






