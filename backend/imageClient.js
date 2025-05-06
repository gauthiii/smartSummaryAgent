// backend/imageClient.js
import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const HF_IMAGE_API = process.env.SDXL_API_URL;
const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;

// For __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Absolute path to frontend/sdxl_images
const imagesDir = path.join(__dirname, '..', 'frontend', 'sdxl_images');

// Ensure folder exists
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

export async function generateImageAndSave(prompt) {
  try {
    const response = await axios.post(
      HF_IMAGE_API,
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const base64String = response.data?.image_base64 || response.data; // Depending on API format
    if (!base64String || typeof base64String !== 'string') {
      console.error('Not a base64 string:', response.data);
      return {
        success: false,
        error: 'API did not return a valid base64 image string.'
      };
    }

    const timestamp = Date.now();
    const safePrompt = prompt.replace(/\s+/g, '_').slice(0, 20);
    const filename = `${safePrompt}_${timestamp}.png`;
    const filePath = path.join(imagesDir, filename);

    // Decode base64 and write file
    fs.writeFileSync(filePath, Buffer.from(base64String, 'base64'));

    return {
      success: true,
      path: `/sdxl_images/${filename}`
    };
  } catch (error) {
    console.error('Image generation error:', error.response?.data || error.message);
    return {
      success: false,
      error: 'Failed to generate and save image.'
    };
  }
}
