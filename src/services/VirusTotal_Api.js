import Constants from 'expo-constants';
import axios from 'axios';
import { BASE_URL } from '../constants/apiConstants';

const VIRUS_TOTAL_API_KEY = Constants.expoConfig?.extra?.VIRUS_TOTAL_API_KEY;
if (!VIRUS_TOTAL_API_KEY) {
  console.error('Chave API não encontrada em Constants.expoConfig.extra.VIRUS_TOTAL_API_KEY');
}
console.log('Chave API carregada:', VIRUS_TOTAL_API_KEY ? 'Encontrada' : 'Não encontrada');
const MAX_RETRIES = 5;
const RETRY_DELAY = 5000; 

const tryRequestWithRetries = async (url, options, retries = MAX_RETRIES) => {
  let attempt = 0;
  while (attempt < retries) {
    try {
      const response = await axios(url, options);
      return response.data;
    } catch (error) {
      console.warn(`Tentativa ${attempt + 1} falhou:`, error.message, 'Detalhes:', error.response?.data);
      if (attempt === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      attempt++;
    }
  }
};

export const scanUrl = async (urlDigitada) => {
  if (!urlDigitada?.trim()) throw new Error('URL é obrigatória');

  const urlParaEnviar = urlDigitada.trim().toLowerCase().replace(/^https?:\/\/(www\.)?/, 'https://');
  
  const options = {
    method: 'POST',
    headers: {
      'x-apikey': VIRUS_TOTAL_API_KEY,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: `url=${encodeURIComponent(urlParaEnviar)}`
  };

  console.log('Enviando requisição para:', `${BASE_URL}/urls`, 'com opções:', options);
  const response = await tryRequestWithRetries(`${BASE_URL}/urls`, options);
  console.log('Resposta bruta do scanUrl:', response);

  if (!response.data?.id) {
    throw new Error('Falha ao iniciar análise: ID não encontrado na resposta');
  }

  return response;
};

export const uploadFileToVirusTotal = async (file) => {
  if (!file || !file.uri) throw new Error('Arquivo inválido');

  if (file.size > 650 * 1024 * 1024) {
    throw new Error('Arquivo muito grande. Máximo 650MB.');
  }

  const isLarge = file.size > 32 * 1024 * 1024;
  const url = isLarge ? `${BASE_URL}/files/upload_url` : `${BASE_URL}/files`;

  const formData = new FormData();
  formData.append('file', {
    uri: file.uri,
    name: file.name,
    type: file.type || 'application/octet-stream',
  });

  let response;
  if (isLarge) {
    const uploadUrlResponse = await tryRequestWithRetries(url, {
      method: 'GET',
      headers: { 'x-apikey': VIRUS_TOTAL_API_KEY },
    });
    response = await tryRequestWithRetries(uploadUrlResponse.data, {
      method: 'POST',
      headers: {
        'x-apikey': VIRUS_TOTAL_API_KEY,
        'Content-Type': 'multipart/form-data',
      },
      data: formData,
    });
  } else {
    response = await tryRequestWithRetries(url, {
      method: 'POST',
      headers: {
        'x-apikey': VIRUS_TOTAL_API_KEY,
        'Content-Type': 'multipart/form-data',
      },
      data: formData,
    });
  }

  const analysisId = response.data.id;
  if (!analysisId) throw new Error('Falha ao obter ID da análise');
  return analysisId;
};

export const getAnalysisResults = async (analysisId) => {
  const url = `${BASE_URL}/analyses/${analysisId}`;
  const options = {
    method: 'GET',
    headers: { 'x-apikey': VIRUS_TOTAL_API_KEY },
  };

  const data = await tryRequestWithRetries(url, options);
  console.log('Status da análise:', data.data?.attributes?.status);

  if (data.data?.attributes?.status === 'completed') {
    return {
      stats: data.data.attributes.stats,
      lastAnalysisDate: data.data.attributes.date * 1000, 
    };
  }
  throw new Error('Análise não concluída');
};