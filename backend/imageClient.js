// backend/imageClient.js
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const HF_IMAGE_API = process.env.SDXL_API_URL;
const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;

export async function generateImage(prompt) {
  try {
    const response = await axios.post(
      HF_IMAGE_API,
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer' // Needed for image bytes
      }
    );

    // Convert image bytes to base64
    const base64Image = Buffer.from(response.data, 'binary').toString('base64');
    return `data:image/png;base64,${base64Image}`;
  } catch (error) {
    console.error('Image generation error:', error.response?.data || error.message);
    throw error;
  }
}
