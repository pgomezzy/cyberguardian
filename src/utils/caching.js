import AsyncStorage from '@react-native-async-storage/async-storage';

const generateCacheKey = (file) => {
  return `analysis_${file.uri}_${file.name}`; 
};

const cacheAnalysisResult = async (file, result) => {
  try {
    const cacheKey = generateCacheKey(file);
    const cachedData = {
      result,
      timestamp: Date.now(), 
    };
    await AsyncStorage.setItem(cacheKey, JSON.stringify(cachedData));
    console.log(`Resultado salvo no cache para ${file.name}`);
  } catch (err) {
    console.warn('Erro ao salvar no cache:', err);
  }
};


const getCachedAnalysisResult = async (file) => {
  try {
    const cacheKey = generateCacheKey(file);
    const cachedData = await AsyncStorage.getItem(cacheKey);
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      const { result, timestamp } = parsedData;

      const cacheDuration = 24 * 60 * 60 * 1000;
      if (Date.now() - timestamp < cacheDuration) {
        console.log(`Resultado recuperado do cache para ${file.name}`);
        return result;
      } else {
        
        await AsyncStorage.removeItem(cacheKey);
        console.log(`Cache expirado para ${file.name}, removido.`);
        return null;
      }
    }
    return null; 
  } catch (err) {
    console.warn('Erro ao recuperar do cache:', err);
    return null;
  }
};

export { cacheAnalysisResult, getCachedAnalysisResult };