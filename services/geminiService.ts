import { GoogleGenAI, Type, Schema } from "@google/genai";
import { DiagnosisResult } from '../types';

const ai = new GoogleGenAI({ apiKey:impot.meta.vita_API_KEY });

const diagnosisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    diagnosis: {
      type: Type.STRING,
      description: "A clear, short technical diagnosis of the car problem in Spanish.",
    },
    severity: {
      type: Type.STRING,
      enum: ["Baja", "Media", "Alta", "Crítica"],
      description: "The severity of the issue.",
    },
    estimatedCostMin: {
      type: Type.NUMBER,
      description: "Minimum estimated cost in Mexican Pesos (MXN) for parts and labor in a rural area like Talpa.",
    },
    estimatedCostMax: {
      type: Type.NUMBER,
      description: "Maximum estimated cost in Mexican Pesos (MXN).",
    },
    advice: {
      type: Type.STRING,
      description: "Immediate advice for the driver (e.g., 'Stop the car immediately', 'Safe to drive slowly').",
    },
    requiredTools: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of tools the mechanic might need to bring.",
    },
  },
  required: ["diagnosis", "severity", "estimatedCostMin", "estimatedCostMax", "advice", "requiredTools"],
};

export const analyzeCarIssue = async (
  description: string,
  imageBase64?: string
): Promise<DiagnosisResult> => {
  try {
    const parts: any[] = [{ text: description }];

    if (imageBase64) {
      // Extract base64 data if it contains the prefix
      const base64Data = imageBase64.split(',')[1] || imageBase64;
      
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Data,
        },
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: parts,
      },
      config: {
        systemInstruction: `Eres un mecánico experto con 20 años de experiencia trabajando en Talpa de Allende, Jalisco. 
        Analiza el problema del vehículo basado en la descripción y/o imagen proporcionada.
        Tus estimados de precios deben ser realistas para la zona (Pesos Mexicanos MXN).
        Se breve, directo y útil.`,
        responseMimeType: "application/json",
        responseSchema: diagnosisSchema,
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No response from AI");
    }

    return JSON.parse(resultText) as DiagnosisResult;
  } catch (error) {
    console.error("Error analyzing car issue:", error);
    throw error;
  }
};
