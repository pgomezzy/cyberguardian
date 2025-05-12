import Constants from 'expo-constants';

const VIRUS_TOTAL_API_KEY = Constants.expoConfig?.extra?.VIRUS_TOTAL_API_KEY;
const VIRUS_TOTAL_URL = 'https://www.virustotal.com/api/v3';
const MAX_RETRIES = 5;
const RETRY_DELAY = 5000;


const makeRequest = async (url, options) => {
  try {
    const resposta = await fetch(url, options);
    if (!resposta.ok) {
      const erro = await resposta.json();
      throw new Error(erro.error?.message || 'Erro na requisição');
    }
    return await resposta.json();
  } catch (erro) {
    console.error('Erro na requisição:', erro);
    throw erro;
  }
};


const tryRequestWithRetries = async (url, options) => {
  let tentativas = 0;
  while (tentativas < MAX_RETRIES) {
    try {
      return await makeRequest(url, options);
    } catch (erro) {
      console.warn(`Tentativa ${tentativas + 1} falhou:`, erro.message);
      if (tentativas === MAX_RETRIES - 1) throw erro;
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      tentativas++;
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
    body: `url=${encodeURIComponent(urlParaEnviar)}`
  };

  return await tryRequestWithRetries(`${VIRUS_TOTAL_URL}/urls`, options);
};


export const getAnalysisResults = async (analysisId) => {
  const options = {
    headers: { 'x-apikey': VIRUS_TOTAL_API_KEY }
  };

  const url = `${VIRUS_TOTAL_URL}/analyses/${analysisId}`;

  const dados = await tryRequestWithRetries(url, options);


  if (dados.data?.attributes?.status === 'completed' && dados.data?.attributes?.date > 0) {
    return dados;
  }

  throw new Error('Análise não concluída');
};