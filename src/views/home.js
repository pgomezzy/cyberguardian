import {SafeAreaView, View, Text, StyleSheet, Image } from "react-native"
import {  useNavigation, NavigationContainer } from "@react-navigation/native";
import { Button } from "@react-navigation/elements";
import React from 'react';
import Botao from "../components/botao";
export default function Home(){
 
  const navigation = useNavigation();

  return(
    
    <SafeAreaView style={styles.conteiner}>
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
    </SafeAreaView>
  )

}
const styles = StyleSheet.create({
    conteiner: {
      flex:1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: "#031a32",
    },
    textoCabeçalho: {
      color: '#a6a6a6', 
      fontSize: 20
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
    botoes: {
      flexDirection: 'row',
      gap: 30,
      marginBottom: 10,
      marginTop: 10,
    },
    input: {
      margin: 12,
      borderWidth: 1,
      flexDirection: 'row',
      backgroundColor: '#a7b0c4'
    },
  })