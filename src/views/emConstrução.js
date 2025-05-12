import { View, Text, StyleSheet, Image } from "react-native"
import React from 'react';


export default function Construção(){


    return(
        <View style={styles.conteiner}>
            <Image style={styles.logo} source={require('../assets/guardianLogo.png')} />
            <Text>Construindo</Text>

        </View>
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