import {SafeAreaView, View, Text, StyleSheet, Image } from "react-native"
import {  useNavigation} from "@react-navigation/native";
import { TextInput } from "react-native-paper";
import React from 'react';
import Botao from "../components/botao";



export default function UrlPage(){
    const navigation = useNavigation();
  
    const [text, setText] = React.useState('');
    
    return(
  
      <View style={styles.conteiner}>
        <Image style={styles.logo} source={require('../assets/guardianLogo.png')}/>
        <TextInput 
          style={styles.input}
          label='URL' 
          placeholder="Digite a URL"
          value={text} 
          mode="outlined"
          textColor="#a6a6a6"
          onChangeText={text => setText(text)}
          theme={{colors:{primary: '#758fc8'}}}/>
          
          <Botao onPress={() => navigation.navigate('Construção')} 
            text='Verificar URL' icon='web'/>
      </  View>
  
      
      
    )
  }
  const styles = StyleSheet.create({
    conteiner: {
      flex:1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: "#031a32",
    },
    logo: {
      width: 300, 
      height: 170,
    },
    textos: {
      justifyContent: 'center',
      textAlign: 'center',
      fontSize : 15,
      color: '#a6a6a6'
    },
    input: {
      margin: 12,
      borderColor: '',
      flexDirection: 'row',
      backgroundColor: '#031a32',
      width: 300,
    },
  })