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
  

// backend/phi3Client.js
// import axios from 'axios';
// import dotenv from 'dotenv';

// dotenv.config();

// const HF_API_URL = 'https://api-inference.huggingface.co/models/microsoft/Phi-3-mini-4k-instruct';
// const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;

// export async function summarizeText(userInput) {
//   try {
//     const response = await axios.post(
//       HF_API_URL,
//       {
//         inputs: userInput,
//         parameters: {
//           temperature: 0.7,
//           max_new_tokens: 200,
//           return_full_text: false
//         }
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${HF_API_KEY}`,
//           'Content-Type': 'application/json'
//         }
//       }
//     );

//     return response.data?.generated_text || 'No response generated.';
//   } catch (error) {
//     console.error('Phi-3 API Error:', error.response?.data || error.message);
//     throw error;
//   }
// }
