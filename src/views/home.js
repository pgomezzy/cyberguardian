import {SafeAreaView, View, Text, StyleSheet, Image, ImageBackground } from "react-native"
import {  useNavigation, NavigationContainer } from "@react-navigation/native";
import React from 'react';
import Botao from "../components/botao";

export default function Home(){
 
  const navigation = useNavigation();

  return(
  <ImageBackground style={{flex: 1, width: '100%',
    height: '100%',}}source={require('../assets/BackGround2.png')}>
    <View style={styles.conteiner}>
      <Image style={styles.logo} source={require('../assets/guardianLogo.png')}/>
      <View>
        <Text style={styles.textoCabeçalho}>Fique Seguro!!</Text>
      </View>
      <View>
        <Text style={styles.textos}>Use nosso app para verificar se seu arquivo ou url são confiáveis!</Text>
      </View>
      <View style={styles.botoes}>
        <Botao onPress={() => navigation.navigate('Arquivo')} text='Arquivo' icon='archive'/>
        <Botao onPress={() => navigation.navigate('URL')} text='URL' icon='web'/>
      </View>
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
    botoes: {
      flexDirection: 'row',
      gap: 30,
      marginBottom: 10,
      marginTop: 10,
    },
  })