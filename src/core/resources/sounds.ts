import ballRolling from "../../../resources/audio/ball-rolling.flac";
import boing1 from "../../../resources/audio/boing-1.flac";
import boing2 from "../../../resources/audio/boing-2.flac";
import defenderDown1 from "../../../resources/audio/defender-down-1.flac";
import defenderDown2 from "../../../resources/audio/defender-down-2.flac";
import defenderDown3 from "../../../resources/audio/defender-down-3.flac";
import defenderUp1 from "../../../resources/audio/defender-up-1.flac";
import defenderUp2 from "../../../resources/audio/defender-up-2.flac";
import drain from "../../../resources/audio/drain.flac";
import flipperDown from "../../../resources/audio/flipper-down.flac";
import flipperHit from "../../../resources/audio/flipper-hit.flac";
import flipperUp from "../../../resources/audio/flipper-up.flac";
import gameOver from "../../../resources/audio/game-over.flac";
import gameStart from "../../../resources/audio/game-start.flac";
import gateHit from "../../../resources/audio/gate-hit.flac";
import goal from "../../../resources/audio/goal.flac";
import newBall from "../../../resources/audio/new-ball.flac";
import nudge1 from "../../../resources/audio/nudge-1.flac";
import plungerHit from "../../../resources/audio/plunger-hit.flac";
import plungerWind from "../../../resources/audio/plunger-wind.flac";
import pop1 from "../../../resources/audio/pop1.flac";
import postHit from "../../../resources/audio/post-hit.flac";
import wallHit1 from "../../../resources/audio/wall-hit-1.flac";
import wallHit2 from "../../../resources/audio/wall-hit-2.flac";
import goalieDown from "../../../resources/audio/goalie-down.flac";
import upgrade from "../../../resources/audio/upgrade.flac";

// TODO: Don't do this like this. These shouln't be listed in core/
export const SOUND_URLS = {
  ballRolling,
  boing1,
  boing2,
  defenderDown1,
  defenderDown2,
  defenderDown3,
  defenderUp1,
  defenderUp2,
  drain,
  flipperDown,
  flipperHit,
  flipperUp,
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

export function loadAllSounds(audioContext: AudioContext) {
  return Promise.all(
    Object.entries(SOUND_URLS).map(([name, url]) =>
      loadSound(name as SoundName, url, audioContext)
    )
  );
}
