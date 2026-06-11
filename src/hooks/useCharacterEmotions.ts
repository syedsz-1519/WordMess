import { useCharacterStore } from '../store/characterStore';
import { audio } from '../engine/audio';
import { haptics } from '../engine/haptics';
import { speakText } from '../utils/speech';
import { WORDY_QUOTES, MESSY_TAUNTS } from '../constants/characterQuotes';

export const useCharacterEmotions = () => {
  const triggerWordy = useCharacterStore((state) => state.triggerWordy);
  const triggerMessy = useCharacterStore((state) => state.triggerMessy);
  const triggerWinState = useCharacterStore((state) => state.triggerWin);
  const triggerLossState = useCharacterStore((state) => state.triggerLoss);

  const onKeyPress = () => {
    audio.playKeyPress();
    haptics.keyPress();
    // Wordy does a tiny happy nod
    triggerWordy('happy', null);
  };

  const onCorrect = (word = '') => {
    audio.playCorrectTile();
    haptics.correct();
    const phrase = 'Nice one!';
    triggerWordy('cheer', phrase + ' 🌟');
    triggerMessy('idle', 'Not bad... 🖐️');
    speakText(phrase);
  };

  const onIncorrect = () => {
    audio.playAbsentTile();
    haptics.absent();
    const taunt = MESSY_TAUNTS[Math.floor(Math.random() * MESSY_TAUNTS.length)];
    triggerWordy('sad', 'Oh no! 😭');
    triggerMessy('laugh', taunt);
    speakText(taunt);
  };

  const onInvalid = () => {
    audio.playAbsentTile();
    haptics.absent();
    const phrase = 'Not a word!';
    triggerWordy('sad', 'Huh? 🧐');
    triggerMessy('mock', phrase + ' 😈');
    speakText(phrase);
  };

  const onWin = (word = '') => {
    audio.playWin();
    haptics.win();
    triggerWinState();
    speakText("We did it! Victory is ours!");
  };

  const onLoss = (targetWord = '') => {
    audio.playLoss();
    haptics.loss();
    triggerLossState();
    const msg = targetWord ? `Oh no, the word was ${targetWord}. better luck next time!` : "Oh no, better luck next time!";
    speakText(msg);
  };

  const onHint = (hintText: string) => {
    audio.playPresentTile();
    haptics.present();
    triggerWordy('happy', 'A clue! 💡');
    triggerMessy('mock', 'Pay attention! 😈');
    speakText(hintText);
  };

  const onPanic = () => {
    triggerMessy('mock', 'Hurry up! ⏱️');
    triggerWordy('sad', 'Aaaah! 😱');
    speakText("Hurry up!");
  };

  return {
    onKeyPress,
    onCorrect,
    onIncorrect,
    onInvalid,
    onWin,
    onLoss,
    onHint,
    onPanic
  };
};

export default useCharacterEmotions;
