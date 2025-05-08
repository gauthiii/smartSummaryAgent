// backend/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { summarizeText } from './huggingFace.js'; // ✅ CHANGED: use Hugging Face summarizer
import { generateImageAndSave } from './imageClient.js';
import { generateGhibliImage } from './ghibliAgent.js';
import { translateTextToLanguages } from './translator.js';


dotenv.config();

const app = express();
const port = 3012;

// For ES modules to get __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// ✅ Add this after middleware setup but before routes
app.use('/sdxl_images', express.static(path.join(__dirname, '..', 'frontend', 'sdxl_images')));

// Serve static files from frontend/
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Serve the frontend/index.html on root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// ========================= HUGGING FACE API =========================

app.post('/summarize', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Input text is required.' });
    }

    const summary = await summarizeText(text);
    console.log(summary);
    res.json({ summary });
  } catch (err) {
    console.error('Summarization Error:', err.message);
    res.status(500).json({ error: 'Failed to summarize text.' });
  }
});


app.post('/generate-image', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ success: false, error: 'Prompt is required.' });
    }

    const result = await generateImageAndSave(prompt);


    console.log(result);

    if (result.success) {
      res.json({
        success: true,
        path: result.path
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error || 'Failed to generate image.'
      });
    }
  } catch (err) {
    console.error('Image API Error:', err.message);
    res.status(500).json({ success: false, error: 'Image generation failed.' });
  }
});

app.post('/generate-ghibli', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    const imageBase64 = await generateGhibliImage(prompt);
    res.json({ image: imageBase64 });
  } catch (err) {
    console.error('Ghibli API Error:', err.message);
    res.status(500).json({ error: 'Ghibli image generation failed.' });
  }
});


app.post('/translate', async (req, res) => {

  console.log("Calling translator API");
  
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required for translation.' });
  }

  try {
    const translations = await translateTextToLanguages(text);
    res.json({ translations });
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ error: 'Translation failed.' });
  }
});

// ========================= Server Listen =========================
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
