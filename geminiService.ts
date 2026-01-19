
import { GoogleGenAI } from "@google/genai";

// Fix: Updated to instantiate GoogleGenAI inside the function as per guidelines for the latest session state.
export const auditOutpassRequest = async (reason: string, destination: string, outTime: string, inTime: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `
    Audit this hostel outpass request for risk and validity.
    Destination: ${destination}
    Reason: ${reason}
    Duration: From ${outTime} to ${inTime}

    Assess if the reason sounds legitimate for a university student. 
    Identify potential risks (e.g. late night hours, vague destination).
    Provide a concise assessment (max 3 sentences).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are a hostel warden's assistant. Be helpful, professional, and safety-conscious. Analyze the sincerity and risk of requests.",
      }
    });
    return response.text || "No assessment available.";
  } catch (error) {
    console.error("AI Audit failed:", error);
    return "Error performing AI assessment.";
  }
};
