import boing1 from "../../../resources/audio/boing1.flac";
import defenderDown from "../../../resources/audio/defender-down.flac";
import defendersDown from "../../../resources/audio/defenders-down.flac";
import drain from "../../../resources/audio/drain.flac";
import hockeyDrain from "../../../resources/audio/hockey-drain.flac";
import flipperDown from "../../../resources/audio/flipperDown1.wav";
import flipperHit from "../../../resources/audio/flipperHit1.flac";
import flipperUp from "../../../resources/audio/flipperUp1.wav";
import gameOver from "../../../resources/audio/gameOver.flac";
import gameStart from "../../../resources/audio/gameStart.flac";
import gateHit from "../../../resources/audio/gateHit.flac";
import goalHorn from "../../../resources/audio/goal-horn.flac";
import newBall from "../../../resources/audio/newBall.flac";
import plungerHit from "../../../resources/audio/plungerHit.flac";
import pop1 from "../../../resources/audio/pop1.flac";
import postHit from "../../../resources/audio/postHit.flac";
import wallHit1 from "../../../resources/audio/wallHit1.flac";

// TODO: Don't do this like this
export const SOUND_URLS = {
  boing1,
  defenderDown,
  defendersDown,
  drain,
  flipperDown,
  flipperHit,
  flipperUp,
  gameOver,
  gameStart,
  gateHit,
  goalHorn,
  hockeyDrain,
  newBall,
  plungerHit,
  pop1,
  postHit,
  wallHit1,
};

export type SoundName = keyof typeof SOUND_URLS;

export const SOUNDS: Map<SoundName, AudioBuffer> = new Map();

export async function loadSound(
  name: SoundName,
  url: string,
  audioContext: AudioContext
): Promise<AudioBuffer> {
  return fetch(url)
    .then((response) => response.arrayBuffer())
    .then((data) => audioContext.decodeAudioData(data))
    .then((buffer) => {
      SOUNDS.set(name, buffer);
      return buffer;
    });
}

export function loadAllSounds(audioContext: AudioContext) {
  return Promise.all(
    Object.entries(SOUND_URLS).map(([name, url]) =>
      loadSound(name as SoundName, url, audioContext)
    )
  );
}
