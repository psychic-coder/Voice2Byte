import axios from 'axios';


const SUPPORTED_LANGUAGES = new Set([
  'es', 'fr', 'de', 'it', 'pt', 'ru', 'zh', 
  'ja', 'ar', 'da', 'nl', 'sv', 'hi', 'bn'
]);

export async function translateToEnglish({ text, sourceLang }) {
  
  if (!text?.trim()) {
    console.warn('Empty text provided');
    return text;
  }


  if (!sourceLang || sourceLang === 'und') {
    console.warn('Undefined language, attempting auto-detection');
    try {
      const detected = await detectLanguage(text);
      sourceLang = detected?.language || 'es'; 
    } catch {
      sourceLang = 'es';
    }
  }

 
  if (sourceLang === 'en') return text;

  
  if (!SUPPORTED_LANGUAGES.has(sourceLang)) {
    console.warn(`Unsupported language: ${sourceLang}, attempting anyway`);
  }

  try {
    const encodedText = encodeURIComponent(text);
    const url = `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=${sourceLang}|en`;
    
    const response = await axios.get(url, {
      timeout: 3000, 
      params: {
        key: process.env.MYMEMORY_API_KEY 
      }
    });

    
    const translatedText = response.data?.responseData?.translatedText;
    if (!translatedText) {
      throw new Error(
        response.data?.responseStatus || 
        'Malformed API response'
      );
    }

   
    const matchScore = response.data?.responseData?.match || 0;
    if (matchScore < 0.7) {
      console.warn(`Low translation confidence: ${matchScore}`);
    }

    return translatedText;
  } catch (error) {
    console.error('Translation failed:', {
      error: error.message,
      text,
      sourceLang,
      stack: error.stack
    });
    return text; 
  }
}
