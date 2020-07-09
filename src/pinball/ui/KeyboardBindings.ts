import { KeyCode } from "../../core/io/Keys";

const bindings = {
  START_GAME: "KeyS",
  LEFT_FLIPPER: "KeyX",
  RIGHT_FLIPPER: "Period",
  NUDGE_RIGHT: "Slash",
  NUDGE_LEFT: "KeyZ",
  NUDGE_UP_LEFT: "KeyC",
  NUDGE_UP_RIGHT: "Comma",

  MULTIBALL: "KeyB",
  RESET: "KeyR",
  LEFT: "ArrowLeft",
  UP: "ArrowUp",
  RIGHT: "ArrowRight",
  DOWN: "ArrowDown",
};

type ControlName = keyof typeof bindings;

function getBinding(controlName: ControlName): KeyCode {
  return bindings[controlName] as KeyCode;
}

function saveBindings() {
  localStorage.setItem("bindings", JSON.stringify(bindings));
}

function isControlName(name: string): name is ControlName {
  return name in bindings;
}

function loadBindings() {
  let loaded;
  try {
    loaded = JSON.parse(localStorage.getItem("bindings") || "{}");
  } catch {}
  for (const controlName in loaded) {
    if (isControlName(controlName)) {
      bindings[controlName] = loaded[controlName];
    }
  }
}

const START_GAME_KEY = "KeyS";

const LEFT_FLIPPER_KEY = "KeyX";
const RIGHT_FLIPPER_KEY = "Period";

const KEY_MULTIBALL: KeyCode = "KeyB";
const KEY_RESET: KeyCode = "KeyR";
const KEY_LEFT: KeyCode = "ArrowLeft";
const KEY_UP: KeyCode = "ArrowUp";
const KEY_RIGHT: KeyCode = "ArrowRight";
const KEY_DOWN: KeyCode = "ArrowDown";

const NUDGE_RIGHT_KEY: KeyCode = "Slash";
const NUDGE_LEFT_KEY: KeyCode = "KeyZ";
const NUDGE_UP_LEFT_KEY: KeyCode = "KeyC";
const NUDGE_UP_RIGHT_KEY: KeyCode = "Comma";

const KEYS_SLOW_MO: KeyCode[] = ["ShiftLeft", "ShiftRight"];
