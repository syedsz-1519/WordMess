import { audio } from '../engine/audio';

export const playClick = audio.playKeyPress;
export const playSuccess = audio.playCorrectTile;
export const playFailure = audio.playAbsentTile;
export const playWin = audio.playWin;
export const playLoss = audio.playLoss;
export { audio };
