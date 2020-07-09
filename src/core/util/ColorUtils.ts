import { clamp } from "./MathUtil";

export function rgbToHex(red: number, green: number, blue: number): number {
  return (
    clamp(blue, 0, 255) +
    (clamp(green, 0, 255) << 8) +
    (clamp(red, 0, 255) << 16)
  );
}

type RGB = { r: number; g: number; b: number };

export function rgbObjToHex({ r, g, b }: RGB): number {
  return rgbToHex(r, g, b);
}

export function hexToRGB(hex: number): RGB {
  return {
    r: hex >> 16,
    g: (hex >> 8) & 0x0000ff,
    b: hex & 0x0000ff,
  };
}

export function hexToVec3(hex: number): [number, number, number] {
  const r = hex >> 16;
  const g = (hex >> 8) & 0x0000ff;
  const b = hex & 0x0000ff;
  return [r / 255.0, g / 255.0, b / 255.0];
}

// given colors "from" and "to", return a hex array [from, x, y, z, to]
// where there are exactly (steps + 1) elements in the array
// and each element is a color that fades between the two endpoint colors
export function colorRange(from: number, to: number, steps: number): number[] {
  const perStepFade = 1.0 / steps;
  const out = [];
  for (let i = 0; i < steps; i++) {
    out.push(colorFade(from, to, perStepFade * i));
  }
  return out;
}

export function colorFade(from: number, to: number, percentTo: number): number {
  const rgbFrom = hexToRGB(from);
  const rgbTo = hexToRGB(to);

  rgbFrom.r = Math.floor(rgbFrom.r * (1.0 - percentTo));
  rgbFrom.g = Math.floor(rgbFrom.g * (1.0 - percentTo));
  rgbFrom.b = Math.floor(rgbFrom.b * (1.0 - percentTo));

  rgbTo.r = Math.floor(rgbTo.r * percentTo);
  rgbTo.g = Math.floor(rgbTo.g * percentTo);
  rgbTo.b = Math.floor(rgbTo.b * percentTo);

  return rgbObjToHex(rgbFrom) + rgbObjToHex(rgbTo);
}
