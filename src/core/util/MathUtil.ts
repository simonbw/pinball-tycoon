// Modulo operator for modular arithmetic
export function mod(a: number, b: number): number {
  return ((a % b) + b) % b;
}

// Limit a value to be in a range.
export function clamp(value: number, min = 0, max = 1): number {
  return Math.max(min, Math.min(max, value));
}

// The smoothstep function between 0 and 1
export function smoothStep(value: number): number {
  value = clamp(value);
  return value * value * (3 - 2 * value);
}

export function lerp(a: number, b: number, t: number = 0.5): number {
  return (1 - t) * a + t * b;
}

export function lerpOrSnap(
  a: number,
  b: number,
  t: number = 0.5,
  threshold: number = 0.01
): number {
  if (Math.abs(b - a) < threshold) {
    return b;
  }
  return lerp(a, b, t);
}

/** Normalizes an angle in radians to be in the range [-pi, pi] */
export function normalizeRad(angle: number) {
  return mod(angle + Math.PI, Math.PI * 2) - Math.PI;
}

// Return the difference between two angles
export function angleDelta(a: number, b: number): number {
  return mod(b - a + Math.PI, Math.PI * 2) - Math.PI;
}

export function degToRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}
export function radToDeg(radians: number): number {
  return (radians * 180) / Math.PI;
}
