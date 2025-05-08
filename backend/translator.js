// backend/translator.js
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const HF_API_URL = 'https://api-inference.huggingface.co/models/bigscience/bloomz-560m';
const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;

export async function translateTextToLanguages(text) {

    console.log("Running translator.js");


  const languages = [
    { code: 'ta', name: 'Tamil' },
    { code: 'hi', name: 'Hindi' },
    { code: 'fr', name: 'French' },
    { code: 'es', name: 'Spanish' },
    { code: 'zh', name: 'Chinese' }
  ];

  const translations = {};

  for (const lang of languages) {
    const prompt = `Translate to ${lang.name}: ${text}`;

    console.log(`translating to ${lang.name}`);

    try {
      const response = await axios.post(
        HF_API_URL,
        { inputs: prompt },
        {
          headers: {
            Authorization: `Bearer ${HF_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const generated = response.data?.[0]?.generated_text || '';
      const cleaned = generated.replace(prompt, '').trim();
      translations[lang.name] = cleaned;
    } catch (error) {
      console.error(`Error translating to ${lang.name}:`, error.response?.data || error.message);
      translations[lang.name] = '[Error translating]';
    }
  }

  return translations;
}
