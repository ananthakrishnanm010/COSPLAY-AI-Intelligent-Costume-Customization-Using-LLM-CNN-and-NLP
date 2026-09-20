import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateDesignImage } from '../services/imageService.js';
const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.post('/', async (req, res) => {
  try {
    const {
      garmentType,
      creativePrompt,
      referenceImageUrl,
    } = req.body;

    if (!garmentType) {
      return res.status(400).json({
        success: false,
        message: 'Garment type is required.',
      });
    }

    if (!creativePrompt?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Creative prompt is required.',
      });
    }


    // Convert the stored reference-image URL into a local file path.
    let referenceImageBase64;
    let referenceImageMimeType;

    if (referenceImageUrl) {
    const relativePath = referenceImageUrl.replace(/^\/uploads\//, '');
    const imagePath = path.join(__dirname, '..', 'uploads', relativePath);

    const imageBuffer = await fs.readFile(imagePath);
    referenceImageBase64 = imageBuffer.toString('base64');

    const extension = path.extname(imagePath).toLowerCase();

    const mimeTypes = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.webp': 'image/webp',
    };

    referenceImageMimeType =
        mimeTypes[extension] || 'image/png';
    }

    const result = await generateDesignImage({
      garmentType,
      creativePrompt,
      referenceImageBase64,
      referenceImageMimeType,
    });

    return res.json({
      success: true,
      imageBase64: result.imageBase64,
      mimeType: result.mimeType,
    });
  } catch (error) {
    console.error('Gemini generation error:', error);

    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate design.',
    });
  }
});

export default router;