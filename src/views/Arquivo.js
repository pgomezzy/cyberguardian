import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ImageBackground, Platform } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';
import { uploadFileToVirusTotal, getAnalysisResults } from '../services/VirusTotal_Api';
import { PermissionsAndroid } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { cacheAnalysisResult, getCachedAnalysisResult } from '../utils/caching';
import Botao from '../components/botao';
import CustomModal from '../components/CustumModal';

export default function Arquivo() {
  
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '', buttons: [] });

  useEffect(() => {
    requestStoragePermission();
  }, []);

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Permissão de Armazenamento',
            message: 'O aplicativo precisa de acesso ao armazenamento para selecionar arquivos.',
            buttonNeutral: 'Perguntar depois',
            buttonNegative: 'Cancelar',
            buttonPositive: 'OK',
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          setModalContent({
            title: 'Permissão Negada',
            message: 'O aplicativo precisa de acesso ao armazenamento para funcionar.',
            buttons: [{ text: 'OK', onPress: () => setModalVisible(false) }],
          });
          setModalVisible(true);
        }
      } catch (err) {
        console.warn('Erro ao solicitar permissão:', err);
      }
    }
  };

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: false,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedFile = result.assets[0];
        setFile({
          uri: selectedFile.uri,
          name: selectedFile.name,
          type: selectedFile.mimeType || 'application/octet-stream',
          size: selectedFile.size,
        });
        setModalContent({
          title: 'Sucesso',
          message: `Arquivo selecionado: ${selectedFile.name}`,
          buttons: [{ text: 'OK', onPress: () => setModalVisible(false) }],
        });
        setModalVisible(true);
      } else {
        setFile(null);
        setModalContent({
          title: 'Cancelado',
          message: 'Nenhum arquivo selecionado.',
          buttons: [{ text: 'OK', onPress: () => setModalVisible(false) }],
        });
        setModalVisible(true);
      }
    } catch (err) {
      console.warn('Erro ao selecionar arquivo:', err);
      setModalContent({
        title: 'Erro',
        message: 'Falha ao selecionar arquivo: ' + err.message,
        buttons: [{ text: 'OK', onPress: () => setModalVisible(false) }],
      });
      setModalVisible(true);
      setFile(null);
    }
  };

  const analyzeFile = async () => {
    if (!file) {
      setModalContent({
        title: 'Erro',
        message: 'Nenhum arquivo selecionado.',
        buttons: [{ text: 'OK', onPress: () => setModalVisible(false) }],
      });
      setModalVisible(true);
      return;
    }

    setLoading(true);
    let resultDisplayed = false;

    try {
      const cachedResult = await getCachedAnalysisResult(file);
      if (cachedResult) {
        setScanResult(cachedResult);

        const totalScanners = Object.values(cachedResult.stats).reduce((sum, val) => sum + val, 0);
        const unsupportedCount = cachedResult.stats['type-unsupported'] || 0;
        const undetectedCount = cachedResult.stats['undetected'] || 0;
        const maliciousCount = cachedResult.stats['malicious'] || 0;
        const suspiciousCount = cachedResult.stats['suspicious'] || 0;
        const effectiveScanners = totalScanners - unsupportedCount;
        const safeCount = (cachedResult.stats.harmless || 0) + (maliciousCount === 0 && suspiciousCount === 0 ? undetectedCount : 0);
        const securityPercentage = effectiveScanners > 0 ? Math.round((safeCount / effectiveScanners) * 100) : 0;
        const lastAnalysisDate = new Date(cachedResult.lastAnalysisDate).toLocaleString('pt-BR');

        const message = `📄 ${file.name}\n\n` +
          `🛡️ Segurança: ${securityPercentage}%\n` +
          `✅ Seguro: ${safeCount}\n` +
          `⚠️ Suspeito: ${suspiciousCount}\n` +
          `❌ Malicioso: ${maliciousCount}\n` +
          `ℹ️ Não suportado: ${unsupportedCount}\n` +
          `🌐 Não detectado: ${undetectedCount}\n` +
          `⏱️ Última análise: ${lastAnalysisDate}`;

        setModalContent({
          title: '🔍 \n Resultado da Análise (do Cache)',
          message,
          buttons: [{ text: 'OK', onPress: () => setModalVisible(false) }],
        });
        resultDisplayed = true;
        setModalVisible(true);
      } else {
        const analysisId = await uploadFileToVirusTotal(file);

        const maxTimeout = 240000;
        const startTime = Date.now();
        let result;

        while (Date.now() - startTime < maxTimeout) {
          try {
            result = await getAnalysisResults(analysisId);
            if (result && result.stats) {
              await cacheAnalysisResult(file, result);
              setScanResult(result);

              const totalScanners = Object.values(result.stats).reduce((sum, val) => sum + val, 0);
              const unsupportedCount = result.stats['type-unsupported'] || 0;
              const undetectedCount = result.stats['undetected'] || 0;
              const maliciousCount = result.stats['malicious'] || 0;
              const suspiciousCount = result.stats['suspicious'] || 0;
              const effectiveScanners = totalScanners - unsupportedCount;
              const safeCount = (result.stats.harmless || 0) + (maliciousCount === 0 && suspiciousCount === 0 ? undetectedCount : 0);
              const securityPercentage = effectiveScanners > 0 ? Math.round((safeCount / effectiveScanners) * 100) : 0;
              const lastAnalysisDate = new Date(result.lastAnalysisDate).toLocaleString('pt-BR');

              const message = `📄 ${file.name}\n\n` +
                `🛡️ Segurança: ${securityPercentage}%\n` +
                `✅ Seguro: ${safeCount}\n` +
                `⚠️ Suspeito: ${suspiciousCount}\n` +
                `❌ Malicioso: ${maliciousCount}\n` +
                `ℹ️ Não suportado: ${unsupportedCount}\n` +
                `🌐 Não detectado: ${undetectedCount}\n` +
                `⏱️ Última análise: ${lastAnalysisDate}`;

              setModalContent({
                title: '🔍 Resultado da Análise',
                message,
                buttons: [{ text: 'OK', onPress: () => setModalVisible(false) }],
              });
              resultDisplayed = true;
              setModalVisible(true);
              break;
            }
          } catch (error) {
            console.log('Erro durante verificação do status (tempo decorrido: ' + Math.round((Date.now() - startTime) / 1000) + 's):', error.message);
          }
          await new Promise(resolve => setTimeout(resolve, 5000));
        }

        if (!result || !result.stats) {
          throw new Error('Análise não concluída dentro do tempo limite (4 minutos). Tente novamente.');
        }
      }
    } catch (err) {
      if (!resultDisplayed) {
        setModalContent({
          title: 'Erro na Análise',
          message: err.message.includes('não concluída')
            ? 'A análise está em andamento. Tente novamente em alguns instantes.'
            : 'Erro ao verificar arquivo. Verifique sua conexão ou tente novamente. Detalhes: ' + err.message,
          buttons: [{ text: 'OK', onPress: () => setModalVisible(false) }],
        });
        setModalVisible(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      style={{ flex: 1, width: '100%', height: '100%' }}
      source={require('../assets/BackGroundViews.png')}
    >
      <View style={styles.conteiner}>
        <ImageBackground style={styles.logo} source={require('../assets/guardianLogo.png')} />
        <View style={styles.content}>
          {file && (
            <Text style={styles.textos}>
              Arquivo: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </Text>
          )}
          <View style={styles.buttonContainer}>
            <Botao
              onPress={pickFile}
              text="Selecionar Arquivo"
              icon="file"
              disabled={loading}
            />
            <Botao
              onPress={analyzeFile}
              text="Analisar Arquivo"
              icon="check"
              disabled={!file || loading}
            />
          </View>
          {loading && <ActivityIndicator style={styles.activityIndicator} size="large" color="#758fc8" />}
          {scanResult && (
            <Text style={styles.textos}>
              Resultado: Malicioso: {scanResult.stats.malicious} | Suspeito: {scanResult.stats.suspicious} | Seguro: {scanResult.stats.harmless}
            </Text>
          )}
          <CustomModal
            visible={modalVisible}
            title={modalContent.title}
            message={modalContent.message}
            onClose={() => setModalVisible(false)}
            buttons={modalContent.buttons}
          />
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  conteiner: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  content: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoCabeçalho: {
    color: '#a6a6a6',
    fontSize: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginTop: 30,
    marginBottom: 20,
  },
  textos: {
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: 15,
    color: '#a6a6a6',
    marginVertical: 10,
    width: '90%',
  },
  input: {
    margin: 12,
    borderWidth: 1,
    flexDirection: 'row',
    backgroundColor: '#a7b0c4',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 20,
  },
  activityIndicator: {
    marginVertical: 20,
  },
});