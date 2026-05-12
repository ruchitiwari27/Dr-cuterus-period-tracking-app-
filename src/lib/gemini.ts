import { GoogleGenerativeAI } from "@google/generative-ai";

// Please add VITE_GEMINI_API_KEY to your .env file
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyApSAK9tjHeiXyPQT3qPWVQjcNIT3bmtvs";
const genAI = new GoogleGenerativeAI(API_KEY);

export const getChatResponse = async (prompt: string, history: { role: "user" | "model"; parts: { text: string }[] }[] = []) => {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: "You are Dr. Cuterus, a friendly and professional women's health assistant. Provide concise, empathetic, and evidence-based advice about menstrual health, wellness, and cycles. Always encourage users to consult a healthcare provider for medical emergencies or complex symptoms. Keep responses warm and use occasional relevant emojis. Focus on the Dr. Cuterus brand voice: relatable, medically accurate, and empowering. If asked about something non-medical or unrelated to health/wellness, gently guide the conversation back to women's health."
    });

    const chat = model.startChat({
      history: history,
      generationConfig: {
        maxOutputTokens: 800,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();
    
    if (!text) throw new Error("Empty response from Gemini");
    
    return text;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Gemini API Error Detail:", error);
    
    // Check for specific error types if possible
    if (errorMessage.includes("API_KEY_INVALID")) {
      return "It looks like my API key is invalid. Please check the .env configuration! 🔑";
    }
    
    return "I'm having a little trouble connecting to my knowledge base right now. Please try again in a moment! 💕";
  }
};
