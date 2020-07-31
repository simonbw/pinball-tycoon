import ballDrop1 from "../../../resources/audio/ball-drop-1.flac";
import ballOnBall1 from "../../../resources/audio/ball-on-ball-1.flac";
import ballOnBall2 from "../../../resources/audio/ball-on-ball-2.flac";
import ballRolling2 from "../../../resources/audio/ball-rolling-2.flac";
import ballRolling3 from "../../../resources/audio/ball-rolling-3.flac";
import ballRolling from "../../../resources/audio/ball-rolling.flac";
import boing1 from "../../../resources/audio/boing-1.flac";
import boing2 from "../../../resources/audio/boing-2.flac";
import bumper1 from "../../../resources/audio/bumper-1.flac";
import bumper2 from "../../../resources/audio/bumper-2.flac";
import buzz from "../../../resources/audio/buzz.flac";
import defenderDown1 from "../../../resources/audio/defender-down-1.flac";
import defenderDown2 from "../../../resources/audio/defender-down-2.flac";
import defenderDown3 from "../../../resources/audio/defender-down-3.flac";
import defenderUp1 from "../../../resources/audio/defender-up-1.flac";
import defenderUp2 from "../../../resources/audio/defender-up-2.flac";
import drain from "../../../resources/audio/drain.flac";
import flipperDown2 from "../../../resources/audio/flipper-down-2.flac";
import flipperDown3 from "../../../resources/audio/flipper-down-3.flac";
import flipperDown from "../../../resources/audio/flipper-down.flac";
import flipperHit from "../../../resources/audio/flipper-hit.flac";
import flipperUp2 from "../../../resources/audio/flipper-up-2.flac";
import flipperUp3 from "../../../resources/audio/flipper-up-3.flac";
import flipperUp4 from "../../../resources/audio/flipper-up-4.flac";
import flipperUp5 from "../../../resources/audio/flipper-up-5.flac";
import flipperUp6 from "../../../resources/audio/flipper-up-6.flac";
import flipperUp7 from "../../../resources/audio/flipper-up-7.flac";
import flipperUp8 from "../../../resources/audio/flipper-up-8.flac";
import flipperUp from "../../../resources/audio/flipper-up.flac";
import gameOver from "../../../resources/audio/game-over.flac";
import gameStart from "../../../resources/audio/game-start.flac";
import gateHit from "../../../resources/audio/gate-hit.flac";
import goal from "../../../resources/audio/goal.flac";
import goalieDown from "../../../resources/audio/goalie-down.flac";
import newBall from "../../../resources/audio/new-ball.flac";
import nudge1 from "../../../resources/audio/nudge-1.flac";
import plungerHit from "../../../resources/audio/plunger-hit.flac";
import plungerWind from "../../../resources/audio/plunger-wind.flac";
import pop1 from "../../../resources/audio/pop1.flac";
import postHit from "../../../resources/audio/post-hit.flac";
import quarterDrop1 from "../../../resources/audio/quarter-drop-1.flac";
import ringingHit1 from "../../../resources/audio/ringing-hit-1.flac";
import rubberHit1 from "../../../resources/audio/rubber-hit-1.flac";
import rubberHit2 from "../../../resources/audio/rubber-hit-2.flac";
import rubberHit3 from "../../../resources/audio/rubber-hit-3.flac";
import spinner2 from "../../../resources/audio/spinner-2.flac";
import suck1 from "../../../resources/audio/suck-1.flac";
import tilt1 from "../../../resources/audio/tilt-1.flac";
import tilt2 from "../../../resources/audio/tilt-2.flac";
import tilt3 from "../../../resources/audio/tilt-3.flac";
import upgrade from "../../../resources/audio/upgrade.flac";
import wallHit1 from "../../../resources/audio/wall-hit-1.flac";
import wallHit2 from "../../../resources/audio/wall-hit-2.flac";

// TODO: These shouln't be listed in core/
export const SOUND_URLS = {
  ballDrop1,
  ballOnBall1,
  ballOnBall2,
  ballRolling,
  ballRolling2,
  ballRolling3,
  boing1,
  boing2,
  bumper1,
  bumper2,
  buzz,
  defenderDown1,
  defenderDown2,
  defenderDown3,
  defenderUp1,
  defenderUp2,
  drain,
  flipperDown,
  flipperDown2,
  flipperDown3,
  flipperHit,
  flipperUp,
  flipperUp2,
  flipperUp3,
  flipperUp4,
  flipperUp5,
  flipperUp6,
  flipperUp7,
  flipperUp8,
  gameOver,
  gameStart,
  gateHit,
  goal,
  goalieDown,
  newBall,
  nudge1,
  plungerHit,
  plungerWind,
  pop1,
  postHit,
  quarterDrop1,
  ringingHit1,
  rubberHit1,
  rubberHit2,
  rubberHit3,
  spinner2,
  suck1,
  tilt1,
  tilt2,
  tilt3,
  upgrade,
  wallHit1,
  wallHit2,
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

export function getSoundDuration(soundName: SoundName): number {
  return SOUNDS.get(soundName)?.duration ?? -1;
}

export function soundIsLoaded(name: SoundName) {
  return SOUNDS.get(name) != undefined;
}

export function loadAllSounds(audioContext: AudioContext) {
  return Promise.all(
    Object.entries(SOUND_URLS).map(([name, url]) =>
      loadSound(name as SoundName, url, audioContext)
    )
  );
}
