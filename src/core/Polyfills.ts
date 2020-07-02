/*
 * Attach all sorts of hacky stuff to the global state.
 */

import { polyfillArrayAsVector } from "./Vector";

polyfillArrayAsVector(Array);
(window as any).P2_ARRAY_TYPE = Array;
