import {SafeAreaView, View, Text, StyleSheet, Image } from "react-native"
import {  useNavigation, NavigationContainer } from "@react-navigation/native";
import { TextInput } from "react-native-paper";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Button } from "@react-navigation/elements";
import React from 'react';

const Stack = createNativeStackNavigator();

function PaginaInicial() {
  const navigation = useNavigation();

  return(
    
    <SafeAreaView style={styles.conteiner}>
      <Image style={styles.logo} source={require('./src/assets/guardianLogo.png')}/>
      <View>
        <Text style={styles.textoCabeçalho}>Fique Seguro!!</Text>
      </View>
      <View>
        <Text style={styles.textos}>Use nosso app para verificar se seu arquivo ou url são confiáveis!</Text>
      </View>
      <View style={styles.botoes}>
        <Button onPress={() => navigation.navigate('Arquivo')}>Arquivo</Button>
        <Button onPress={() => navigation.navigate('URL')}>URL</Button>
      </View>
    </SafeAreaView>
  )

}
export default function App(){

return(
  <NavigationContainer >
    <Stack.Navigator initialRouteName='Home'>
      <Stack.Screen name='Home' component={PaginaInicial}/>
      <Stack.Screen name='Arquivo' component={ArquivoPage}/>
      <Stack.Screen name='URL' component={UrlPage}/>
    </Stack.Navigator>
  </NavigationContainer>
)

}

function UrlPage(){
  const navigation = useNavigation();

  const [text, setText] = React.useState('');
  
  return(

    <View style={styles.conteiner}>
      <Image style={styles.logo} source={require('./src/assets/guardianLogo.png')}/>
      <TextInput style={styles.input} label='URL' value={text} onChangeText={text => setText(text)}/>
    </  View>

    
    
  )
}
function ArquivoPage() {
  const navigation = useNavigation();

  return(

    <View style={styles.conteiner}> 
      <Image style={styles.logo} source={require('./src/assets/guardianLogo.png')}/>
      <Text> arquivoooo </Text>
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