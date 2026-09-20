import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateDesignImage } from '../services/imageService.js';
import {
  validateCustomizationInput,
  validateParsedCustomization,
} from '../validators/customizationValidation.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.post('/', async (req, res) => {
  try {
    const {
      garmentType,
      creativePrompt,
      referenceImageUrl,
      parsedCustomization,
    } = req.body;

    // Customization validation
    const inputValidation = validateCustomizationInput({
      garmentType,
      creativePrompt,
    });

    if (!inputValidation.valid) {
      return res.status(422).json({
        success: false,
        code: inputValidation.code,
        message: inputValidation.message,
      });
    }

    // COS-46:
    // If an LLM/parser result is supplied, validate it before
    // allowing the request to proceed to image generation.
    if (parsedCustomization !== undefined) {
      const llmValidation =
        validateParsedCustomization(parsedCustomization);

      if (!llmValidation.valid) {
        return res.status(422).json({
          success: false,
          code: llmValidation.code,
          message: llmValidation.message,
          details: {
            missingFields: llmValidation.missingFields,
          },
        });
      }
    }

    // Convert the stored reference-image URL into a local file path.
    let referenceImageBase64;
    let referenceImageMimeType;

    if (referenceImageUrl) {
      const relativePath = referenceImageUrl.replace(/^\/uploads\//, '');
      const imagePath = path.join(
        __dirname,
        '..',
        'uploads',
        relativePath
      );

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
      garmentType: inputValidation.data.garmentType,
      creativePrompt: inputValidation.data.creativePrompt,
      referenceImageBase64,
      referenceImageMimeType,
    });

    return res.json({
      success: true,
      imageBase64: result.imageBase64,
      mimeType: result.mimeType,
    });
  } catch (error) {
    console.error('Design generation error:', error);

    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate design.',
    });
  }
});

export default router;
