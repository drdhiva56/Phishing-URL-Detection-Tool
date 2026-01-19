
import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysis } from "../types";

export const analyzeUrlWithAI = async (url: string): Promise<AIAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Analyze the following URL for phishing potential, typosquatting, or malicious behavior: ${url}`,
    config: {
      systemInstruction: "You are a senior cybersecurity analyst specializing in network security and phishing detection. Provide a structured risk assessment of the provided URL.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          riskLevel: {
            type: Type.STRING,
            description: "One of: LOW, MEDIUM, HIGH, CRITICAL"
          },
          summary: {
            type: Type.STRING,
            description: "A concise summary of why the URL is or is not risky."
          },
          techniquesDetected: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of phishing techniques seen (e.g., typosquatting, sub-domain trickery, etc.)"
          },
          recommendation: {
            type: Type.STRING,
            description: "Advice for the user."
          }
        },
        required: ["riskLevel", "summary", "techniquesDetected", "recommendation"]
      }
    }
  });

  try {
    return JSON.parse(response.text || '{}');
  } catch (e) {
    throw new Error("Failed to parse AI response");
  }
};
