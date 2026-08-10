import { GoogleGenAI } from '@google/genai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

let _ai: GoogleGenAI | null = null;

function getAI(): GoogleGenAI {
  if (!_ai) {
    if (!apiKey) {
      throw new Error('VITE_GEMINI_API_KEY is not set');
    }
    _ai = new GoogleGenAI({ apiKey });
  }
  return _ai;
}

const SYSTEM_PROMPT = `You are a cryptic hint master for a word puzzle game.
The player is trying to guess a 5-letter English word.
You must give ONE cryptic hint — indirect, poetic, using metaphor or wordplay — max 12 words.
Never say the word directly. Never give the first letter. Make it clever but solvable.`;

export const getCrypticHint = async (targetWord: string, wrongGuess: string, guessesSoFar: number) => {
  if (!apiKey) {
    return "This is a mock cryptic hint since no API key was provided.";
  }

  try {
    const response = await getAI().models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Target word: ${targetWord}\nPlayer's wrong guess: ${wrongGuess}\nGuesses so far: ${guessesSoFar}/6\nGive one cryptic hint.`,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.9,
      }
    });
    
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "The spirits are silent. No hint available.";
  }
};
