import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('GEMINI_API_KEY is not configured');
}

const ai = new GoogleGenAI({
  apiKey,
});

export async function generateDesignImage({
  garmentType,
  creativePrompt,
  referenceImageBase64,
  referenceImageMimeType,
}) {
  const prompt = `
Create a realistic image of the requested customized garment.

Garment type:
${garmentType}

Design instructions:
${creativePrompt}

Use the provided reference image as visual guidance for the garment and apply the user's design instructions.
Do not add logos or branding unless explicitly requested in the design prompt.
`;

  const parts = [
    {
      text: prompt,
    },
  ];

  if (referenceImageBase64) {
    parts.push({
      inlineData: {
        mimeType: referenceImageMimeType || 'image/png',
        data: referenceImageBase64,
      },
    });
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3.1-flash-image',
    contents: [
      {
        role: 'user',
        parts,
      },
    ],
    config: {
      responseModalities: ['TEXT', 'IMAGE'],
    },
  });

  const candidates = response.candidates || [];

  for (const candidate of candidates) {
    const responseParts = candidate.content?.parts || [];

    for (const part of responseParts) {
      if (part.inlineData?.data) {
        return {
          imageBase64: part.inlineData.data,
          mimeType: part.inlineData.mimeType || 'image/png',
        };
      }
    }
  }

  throw new Error('Gemini did not return a generated image');
}