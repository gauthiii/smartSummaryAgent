// backend/huggingFace.js
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const HUGGINGFACE_API_URL = process.env.HUGGINGFACE_FACEBOOK_API_URL;

const API_TOKEN = process.env.HUGGINGFACE_API_KEY;

export async function summarizeText(inputText) {
    try {
      const response = await axios.post(
        HUGGINGFACE_API_URL,
        {
          inputs: inputText,
          parameters: {
            max_length: 150,      // 📏 Limit the summary
            min_length: 30,       // 📉 Avoid too short
            do_sample: false,     // 🔁 Deterministic output
          }
        },
        {
          headers: {
            Authorization: `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      return response.data[0]?.summary_text || 'No summary returned.';
    } catch (error) {
      console.error('HuggingFace API Error:', error.response?.data || error.message);
      throw error;
    }
  }
  