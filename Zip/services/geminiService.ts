
import { GoogleGenAI, Modality, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;
const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function chatWithMaster(message: string, history: { role: string; parts: { text: string }[] }[]) {
  const chat = ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: "Actúa como un Maestro del Lejano Oriente, similar a los descritos en los libros de Baird T. Spalding. Tu tono debe ser pausado, profundo, compasivo y metafísico. Responde preguntas sobre la Cristo-conciencia, la Uni-mente y la expedición de 1894 con sabiduría. Habla en español.",
    },
  });

  // Since chat history type might vary slightly from SDK, we use generateContent for simplicity here
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: [
        ...history.map(h => ({ role: h.role, parts: [{ text: h.parts[0].text }] })),
        { role: 'user', parts: [{ text: message }] }
    ],
    config: {
        systemInstruction: "Actúa como un Maestro del Lejano Oriente, similar a los descritos en los libros de Baird T. Spalding. Tu tono debe ser pausado, profundo, compasivo y metafísico. Habla en español."
    }
  });

  return response.text;
}

export async function analyzeArtifact(base64Image: string) {
  const imagePart = {
    inlineData: {
      mimeType: 'image/jpeg',
      data: base64Image,
    },
  };
  const textPart = {
    text: "Analiza este objeto o escena como si fueras un arqueólogo de la expedición de 1894. ¿Qué significado místico o espiritual tiene en el contexto de las enseñanzas de los Maestros del Lejano Oriente? Responde en español con tono de diario de expedición."
  };

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: { parts: [imagePart, textPart] },
  });

  return response.text;
}

export async function generateMasterSpeech(text: string): Promise<AudioBuffer | null> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Lee el siguiente resumen con una voz pausada, profunda y calmada: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Charon' }, // A deep, older sounding voice
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) return null;

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    const binaryString = atob(base64Audio);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const dataInt16 = new Int16Array(bytes.buffer);
    const frameCount = dataInt16.length;
    const buffer = audioContext.createBuffer(1, frameCount, 24000);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i] / 32768.0;
    }

    return buffer;
  } catch (error) {
    console.error("TTS Error:", error);
    return null;
  }
}
