import {SafeAreaView, View, Text, StyleSheet, Image } from "react-native"
import {  useNavigation, NavigationContainer } from "@react-navigation/native";
import { TextInput } from "react-native-paper";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Button, HeaderBackground } from "@react-navigation/elements";
import React from 'react';
import home from "./src/views/home";
import Arquivo from "./src/views/Arquivo";
import UrlPage from "./src/views/Url"


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
     </Stack.Navigator>
  </NavigationContainer>
)

}




