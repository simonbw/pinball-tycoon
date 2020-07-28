/*
 * Attach all sorts of hacky stuff to the global state.
 */

export async function polyfill() {
  // (window as any).P2_ARRAY_TYPE = Array;
  if (!window.AudioContext && (window as any).webkitAudioContext) {
    const { AudioContext } = await import("standardized-audio-context");
    (window as any).AudioContext = AudioContext;
  }
}
