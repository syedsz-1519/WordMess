export const speakText = (text: string) => {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Strip emojis from speech text for cleaner synthesis
  const cleanText = text.replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, '');

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.rate = 0.75;
  utterance.pitch = 0.5;
  utterance.volume = 0.8;

  const speak = () => {
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v =>
      v.name.includes('Daniel') ||
      v.name.includes('Google UK English Male') ||
      v.lang === 'en-GB' ||
      v.name.includes('Male')
    ) || voices.find(v => v.lang.startsWith('en'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    window.speechSynthesis.speak(utterance);
  };

  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.onvoiceschanged = () => {
      speak();
      window.speechSynthesis.onvoiceschanged = null; // Clean up
    };
  } else {
    speak();
  }
};

export default speakText;
