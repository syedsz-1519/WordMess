import { getCrypticHint as getGeminiHint } from './gemini';

export const getClaudeCrypticHint = async (targetWord: string, wrongGuess: string, guessesSoFar: number) => {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  if (!apiKey) {
    // Fallback to Gemini
    return getGeminiHint(targetWord, wrongGuess, guessesSoFar);
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 60,
        system: "You are a cryptic Oracle for a word game. Give ONE hint as a riddle or metaphor, max 12 words. Never say the word. Be poetic and mysterious.",
        messages: [
          {
            role: 'user',
            content: `Word: ${targetWord}. Wrong guess: ${wrongGuess}. Give a cryptic hint.`
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.warn("Claude API failed, falling back to Gemini:", error);
    return getGeminiHint(targetWord, wrongGuess, guessesSoFar);
  }
};
export default getClaudeCrypticHint;
