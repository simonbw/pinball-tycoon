/*
 * Attach all sorts of hacky stuff to the global state.
 */

import "regenerator-runtime/runtime";

export async function polyfill() {
  // (window as any).P2_ARRAY_TYPE = Array;
  if (!window.AudioContext && (window as any).webkitAudioContext) {
    // @ts-ignore
    const { AudioContext } = await import("standardized-audio-context");
    (window as any).AudioContext = AudioContext;
  }
}
