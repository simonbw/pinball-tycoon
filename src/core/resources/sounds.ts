import boing1 from "../../../resources/audio/boing1.flac";
import drain from "../../../resources/audio/drain.flac";
import flipperDown from "../../../resources/audio/flipperDown1.wav";
import flipperHit from "../../../resources/audio/flipperHit1.flac";
import flipperUp from "../../../resources/audio/flipperUp1.wav";
import gameOver from "../../../resources/audio/gameOver.flac";
import gameStart from "../../../resources/audio/gameStart.flac";
import gateHit from "../../../resources/audio/gateHit.flac";
import newBall from "../../../resources/audio/newBall.flac";
import plungerHit from "../../../resources/audio/plungerHit.flac";
import pop1 from "../../../resources/audio/pop1.flac";
import postHit from "../../../resources/audio/postHit.flac";
import wallHit1 from "../../../resources/audio/wallHit1.flac";

const soundUrls = {
  boing1,
  drain,
  flipperDown,
  flipperHit,
  flipperUp,
  gameOver,
  gameStart,
  gateHit,
  newBall,
  plungerHit,
  pop1,
  postHit,
  wallHit1,
};

export type SoundName = keyof typeof soundUrls;

export const sounds: Map<SoundName, AudioBuffer> = new Map();

async function loadSound(
  name: SoundName,
  url: string,
  audioContext: AudioContext
): Promise<AudioBuffer> {
  return fetch(url)
    .then((response) => response.arrayBuffer())
    .then((data) => audioContext.decodeAudioData(data))
    .then((buffer) => {
      sounds.set(name, buffer);
      return buffer;
    });
}

export function loadAllSounds(audioContext: AudioContext) {
  return Promise.all(
    Object.entries(soundUrls).map(([name, url]) =>
      loadSound(name as SoundName, url as string, audioContext)
    )
  );
}
