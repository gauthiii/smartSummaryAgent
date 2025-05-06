// backend/imageClient.js
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const FAL_GHIBLI_API = 'https://router.huggingface.co/fal-ai/fal-ai/flux-lora';
const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;

export async function generateGhibliImage(prompt) {
  try {
    const response = await axios.post(
      FAL_GHIBLI_API,
      {
        sync_mode: true,
        prompt: `"${prompt}"`
      },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer' // because it returns an image blob
      }
    );

    const base64Image = Buffer.from(response.data, 'binary').toString('base64');
    return `data:image/png;base64,${base64Image}`;
  } catch (error) {
    console.error('Fal/Ghibli image generation error:', error.response?.data || error.message);
    throw error;
  }
}
