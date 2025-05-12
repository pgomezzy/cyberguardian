import { View, Text, StyleSheet, Image, ImageBackground } from "react-native"
import {  useNavigation } from "@react-navigation/native";
import { Button } from "@react-navigation/elements";
import React from 'react';
import Botao from '../components/botao'

export default function Arquivo() {

  const navigation = useNavigation();

  return(
    <ImageBackground style={{flex: 1, width: '100%',
      height: '100%',}}source={require('../assets/BackGround.png')}>
    <View style={styles.conteiner}> 
      <Image style={styles.logo} source={require('../assets/guardianLogo.png')}/>
      <Botao onPress={() => navigation.navigate('Construção')}
        text='Arquivo'
        icon='archive'
        />

      <Text> arquivooo </Text>
    </View>
    </ImageBackground>
  )
}
const styles = StyleSheet.create({
  conteiner: {
    flex:1,
    alignItems: 'center',
    
  },
  textoCabeçalho: {
    color: '#a6a6a6', 
    fontSize: 20
  },
  logo: {
    width: 300, 
    height: 300,
    marginTop: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textos: {
    justifyContent: 'center',
    textAlign: 'center',
    fontSize : 15,
    color: '#a6a6a6',
    height: 75
  },
  input: {
    margin: 12,
    borderWidth: 1,
    flexDirection: 'row',
    backgroundColor: '#a7b0c4',
    
  },
})