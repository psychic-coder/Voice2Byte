
import { franc } from 'franc';
import langs from 'langs';

const detectLanguage = (text) => {
  const langCode = franc(text);

  if (langCode === 'und') {
    return { isoCode: 'und', languageName: 'Could not detect language' };
  }

  const language = langs.where('3', langCode);

  return {
    isoCode: language?.['1'] || 'und',
    languageName: language ? language.name : `Unknown language (code: ${langCode})`
  };
};

export default detectLanguage;
