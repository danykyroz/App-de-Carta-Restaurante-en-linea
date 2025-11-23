import { GoogleGenAI } from "@google/genai";

// Helper to remove data:image/xyz;base64, prefix
const stripBase64Header = (base64String: string) => {
  return base64String.replace(/^data:image\/\w+;base64,/, "");
};

export const generateMenuDescription = async (title: string, category: string): Promise<{ description: string, suggestedPrice: number }> => {
  if (!process.env.API_KEY) {
    console.warn("API_KEY is missing. Returning mock data.");
    return { 
      description: "Delicious dish prepared with the finest ingredients. (AI Key missing)",
      suggestedPrice: 25000 
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `You are a world-class chef at a 5-star restaurant. 
    Write a sophisticated, mouth-watering description (max 30 words) in Spanish for a menu item named "${title}" in the category "${category}". 
    Also suggest a realistic price in Colombian Pesos (COP) for a high-end restaurant (just the number).
    
    Return ONLY a valid JSON object like this:
    {
      "description": "...",
      "price": 50000
    }`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const data = JSON.parse(text);
    return {
      description: data.description,
      suggestedPrice: data.price || 0
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      description: "Una exquisita preparación de nuestro chef.",
      suggestedPrice: 0
    };
  }
};

export const generateDishImage = async (prompt: string): Promise<string | null> => {
  if (!process.env.API_KEY) return null;

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Enhanced prompt for food photography
    const fullPrompt = `Professional food photography, 5-star restaurant style, delicious ${prompt}, cinematic lighting, 8k resolution, high detail, centered composition.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: fullPrompt }]
      },
      config: {
        // nano banana models support generating images but do not support responseMimeType
      }
    });

    // Find the image part
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    return null;

  } catch (error) {
    console.error("Image Generation Error:", error);
    return null;
  }
};

export const editDishImage = async (currentImageBase64: string, prompt: string): Promise<string | null> => {
  if (!process.env.API_KEY) return null;

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const base64Data = stripBase64Header(currentImageBase64);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/png', // Assuming PNG or JPEG, usually fine to default to common types for input
              data: base64Data
            }
          },
          { text: `Make this food image look better: ${prompt}. Keep it realistic, 5-star restaurant quality.` }
        ]
      }
    });

    // Find the image part
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    return null;

  } catch (error) {
    console.error("Image Edit Error:", error);
    return null;
  }
};