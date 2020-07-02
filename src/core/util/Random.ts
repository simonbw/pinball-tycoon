import { mod } from "./MathUtil";

/**
 * Utility for doing things based on random numbers.
 */

// just for shorthand
const r = Math.random;

// Return a random number between `min` and `max`.
export function uniform(min: number, max: number): number {
  if (min == null) {
    return r();
  }
  if (max == null) {
    max = min;
    min = 0;
  }
  return (max - min) * r() + min;
}

// Return a random integer between min and max.
export function integer(min: number, max: number): number {
  return Math.floor(uniform(min, max));
}

// returns a random number from an (approximately) normal distribution centered at `mean` with `deviation`
export function normal(mean: number, deviation: number): number {
  if (mean == null) {
    mean = 0;
  }
  if (deviation == null) {
    deviation = 1;
  }
  return (deviation * (r() + r() + r() + r() + r() + r() - 3)) / 3 + mean;
}

// Return a random element from an array.
export function choose<T>(...options: T[]): any {
  return options[integer(0, options.length)];
}

// Remove and return a random element from an array.
export function take<T>(options: T[]): T {
  return options.splice(integer(0, options.length), 1)[0];
}

// Put an array into a random order and return the array.
export function shuffle<T>(a: T[]): T[] {
  let i, j, temp;
  i = a.length;
  while (--i > 0) {
    j = integer(0, i + 1);
    temp = a[j];
    a[j] = a[i];
    a[i] = temp;
  }
  return a;
}

// Put an array into a deterministically random order and return the array.
export function seededShuffle<T>(a: T[], seed: number): T[] {
  let i, j, temp;
  i = a.length;
  while (--i > 0) {
    seed = (seed * 1103515245 + 12345) | 0;
    j = mod(seed, i + 1);
    temp = a[j];
    a[j] = a[i];
    a[i] = temp;
  }
  return a;
}

// Flip a coin.
export function bool(chance: number): boolean {
  if (chance == null) {
    chance = 0.5;
  }
  return r() < chance;
}
