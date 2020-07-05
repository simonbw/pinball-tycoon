// @ts-ignore
import popUrl from "../../../resources/audio/pop1.flac";

const soundUrls = { pop1: popUrl };

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
      loadSound(name, url as string, audioContext)
    )
  );
}
