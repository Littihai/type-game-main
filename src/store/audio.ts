import { Howl } from 'howler';

const glassBreakSound = new Howl({
  src: ['/sounds/glass-break.mp3'], // Path ในโฟลเดอร์ public
  volume: 0.6,
});

export const playGlassBreak = () => {
  if (glassBreakSound.playing()) glassBreakSound.stop();
  glassBreakSound.play();
};