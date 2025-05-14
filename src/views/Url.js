import { useState } from 'react';
import { View, StyleSheet, ImageBackground, Image } from 'react-native';
import { ActivityIndicator, TextInput } from 'react-native-paper';
import { scanUrl, getAnalysisResults } from '../services/VirusTotal_Api';
import { cacheAnalysisResult, getCachedAnalysisResult } from '../utils/caching';
import CustomModal from '../components/CustumModal'; 
import Botao from '../components/botao';

export default function UrlPage() {
  const [url, setUrl] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '', buttons: [] });

  const verificarUrl = async () => {
    if (!url.trim()) {
      setModalContent({
        title: 'Atenção',
        message: 'Digite uma URL válida',
        buttons: [{ text: 'OK', onPress: () => setModalVisible(false) }],
      });
      setModalVisible(true);
      return;
    }

    setCarregando(true);
    let resultDisplayed = false;

    try {
      const urlNormalizada = url.trim().toLowerCase();
      setUrl(urlNormalizada);

      const urlObject = { uri: urlNormalizada, name: urlNormalizada };

      const cachedResult = await getCachedAnalysisResult(urlObject);
      if (cachedResult) {
        const stats = cachedResult.data?.attributes?.stats || {};
        const totalScanners = Object.values(stats).reduce((sum, val) => sum + val, 0);
        const unsupportedCount = stats['type-unsupported'] || 0;
        const undetectedCount = stats['undetected'] || 0;
        const maliciousCount = stats['malicious'] || 0;
        const suspiciousCount = stats['suspicious'] || 0;
        const effectiveScanners = totalScanners - unsupportedCount;
        const safeCount = (stats.harmless || 0) + (maliciousCount === 0 && suspiciousCount === 0 ? undetectedCount : 0);
        const securityPercentage = effectiveScanners > 0 ? Math.round((safeCount / effectiveScanners) * 100) : 0;
        const lastAnalysisDate = cachedResult.data.attributes?.date
          ? new Date(cachedResult.data.attributes.date * 1000).toLocaleString('pt-BR')
          : new Date().toLocaleString('pt-BR');

        const message = `🌐 ${urlNormalizada}\n\n` +
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
        const scanResponse = await scanUrl(urlNormalizada);

        if (!scanResponse.data?.id) {
          throw new Error('Falha ao iniciar análise');
        }

        const maxTimeout = 180000; 
        const startTime = Date.now();
        let analysisData;

        while (Date.now() - startTime < maxTimeout) {
          try {
            analysisData = await getAnalysisResults(scanResponse.data.id);
            if (analysisData && analysisData.stats) {
              await cacheAnalysisResult(urlObject, { data: { attributes: { stats: analysisData.stats, date: analysisData.lastAnalysisDate / 1000 } } });
              const stats = analysisData.stats;
              const totalScanners = Object.values(stats).reduce((sum, val) => sum + val, 0);
              const unsupportedCount = stats['type-unsupported'] || 0;
              const undetectedCount = stats['undetected'] || 0;
              const maliciousCount = stats['malicious'] || 0;
              const suspiciousCount = stats['suspicious'] || 0;
              const effectiveScanners = totalScanners - unsupportedCount;
              const safeCount = (stats.harmless || 0) + (maliciousCount === 0 && suspiciousCount === 0 ? undetectedCount : 0);
              const securityPercentage = effectiveScanners > 0 ? Math.round((safeCount / effectiveScanners) * 100) : 0;
              const lastAnalysisDate = analysisData.lastAnalysisDate
                ? new Date(analysisData.lastAnalysisDate).toLocaleString('pt-BR')
                : new Date().toLocaleString('pt-BR');

              const message = `🌐 ${urlNormalizada}\n\n` +
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

        if (!analysisData || !analysisData.stats) {
          throw new Error('Análise não concluída dentro do tempo limite (3 minutos). Tente novamente.');
        }
      }
    } catch (erro) {
      console.error('Erro completo:', erro);
      if (!resultDisplayed) {
        setModalContent({
          title: 'Erro na Análise',
          message: erro.message.includes('não concluída')
            ? 'A análise está em andamento. Tente novamente em alguns instantes.'
            : 'Erro ao verificar URL. Verifique sua conexão.',
          buttons: [{ text: 'OK', onPress: () => setModalVisible(false) }],
        });
        setModalVisible(true);
      }
    } finally {
      setCarregando(false);
    }
  };

  return (
    <ImageBackground style={{ flex: 1, width: '100%', height: '100%' }} source={require('../assets/BackGroundViews.png')}>
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
          theme={{ colors: { primary: '#758fc8' } }}
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
        <CustomModal
          visible={modalVisible}
          title={modalContent.title}
          message={modalContent.message}
          onClose={() => setModalVisible(false)}
          buttons={modalContent.buttons}
        />
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