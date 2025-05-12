import { View, StyleSheet, Image, Alert, ImageBackground } from "react-native";
import { ActivityIndicator, TextInput } from "react-native-paper";
import React, { useState } from 'react';
import Botao from "../components/botao";
import { scanUrl, getAnalysisResults } from "../services/JS_Api";

export default function UrlPage() {
  const [url, setUrl] = useState('');
  const [carregando, setCarregando] = useState(false);

  const verificarUrl = async () => {
    if (!url.trim()) {
      Alert.alert('Atenção', 'Digite uma URL válida');
      return;
    }
  
    setCarregando(true);
    
    try {
      
      const urlNormalizada = url.trim().toLowerCase();
      setUrl(urlNormalizada);

     
      const scanResponse = await scanUrl(urlNormalizada);
      
      if (!scanResponse.data?.id) {
        throw new Error('Falha ao iniciar análise');
      }

      
      const analysisData = await getAnalysisResults(scanResponse.data.id);

      
      const stats = analysisData.data?.attributes?.stats || {};
      const totalScanners = Object.values(stats).reduce((sum, val) => sum + val, 0);
      
      const lastAnalysisDate = analysisData.data.attributes?.date 
      ? new Date(analysisData.data.attributes.date * 1000)
      : new Date(); 
    
    Alert.alert(
      '🔍 Resultado da Análise',
      `🌐 ${urlNormalizada}\n\n` +
      `🛡️ Segurança: ${totalScanners > 0 ? Math.round((stats.harmless / totalScanners) * 100) : 0}%\n` +
      `✅ Seguro: ${stats.harmless || 0}\n` +
      `⚠️ Suspeito: ${stats.suspicious || 0}\n` +
      `❌ Malicioso: ${stats.malicious || 0}\n\n` +
      `⏱️ Última análise: ${lastAnalysisDate.toLocaleString('pt-BR')}` 
    );

    } catch (erro) {
      console.error('Erro completo:', erro);
      Alert.alert(
        'Erro na Análise',
        erro.message.includes('não concluída') 
          ? 'A análise está em andamento. Tente novamente em alguns instantes.' 
          : 'Erro ao verificar URL. Verifique sua conexão.'
      );
    } finally {
      setCarregando(false);
    }
  };

  return (

  <ImageBackground style={{flex: 1, width: '100%',
    height: '100%',}}source={require('../assets/BackGround2.png')}>
    <View style={styles.conteiner}>
      <Image 
        style={styles.logo} 
        source={require('../assets/guardianLogo.png')} 
      />
      
      <TextInput
        style={styles.input}
        label="Digite a URL"
        placeholder="Exemplo: youtube.com"
        value={url}
        onChangeText={setUrl}
        mode="outlined"
        textColor="#a6a6a6"
        theme={{ colors: { primary: '#758fc8' }}}
        autoCapitalize="none"
      />
      
      {carregando ? (
        <ActivityIndicator size="large" color="#758fc8" />
      ) : (
        <Botao 
          onPress={verificarUrl}
          text="Verificar URL"
          icon="web"
          disabled={!url.trim()}
        />
      )}
    </View>
    </ImageBackground> 
  );
}


const styles = StyleSheet.create({
  conteiner: {
    flex: 1,
    alignItems: 'center',  
  },
  logo: {
    width: 300, 
    height: 300,
    marginTop: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  input: {
    margin: 12,
    backgroundColor: '#031a32',
    width: 300,
  }
});