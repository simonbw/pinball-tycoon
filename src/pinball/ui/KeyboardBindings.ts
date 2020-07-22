import { KeyCode } from "../../core/io/Keys";

/** Used for editor hints */
function K(k: KeyCode): KeyCode {
  return k;
}

const DEFAULT_BINDINGS = {
  START_GAME: K("KeyS"),

  LEFT_FLIPPER: K("KeyX"),
  RIGHT_FLIPPER: K("Period"),
  PLUNGE: K("Enter"),

  NUDGE_RIGHT: K("Slash"),
  NUDGE_LEFT: K("KeyZ"),
  NUDGE_UP_LEFT: K("KeyC"),
  NUDGE_UP_RIGHT: K("Comma"),

  PAUSE: K("Escape"),

  SLO_MO: K("ShiftLeft"),
  SLO_MO2: K("ShiftRight"),

  CAMERA_TOGGLE: K("KeyY"),

  QUALITY_TOGGLE: K("KeyQ"),
  QUALITY_LOW: K("Digit1"),
  QUALITY_MEDIUM: K("Digit2"),
  QUALITY_HIGH: K("Digit3"),

  MAGIC_MULTI: K("KeyB"),
  MAGIC_RESET: K("KeyR"),
  MAGIC_LEFT: K("ArrowLeft"),
  MAGIC_UP: K("ArrowUp"),
  MAGIC_RIGHT: K("ArrowRight"),
  MAGIC_DOWN: K("ArrowDown"),

  TOGGLE_STATS: K("Backquote"),
};

let bindings = { ...DEFAULT_BINDINGS };

type ControlName = keyof typeof bindings;

export function getBinding(controlName: ControlName): KeyCode {
  return bindings[controlName] as KeyCode;
}

export function getBindings(
  ...controlNames: readonly ControlName[]
): KeyCode[] {
  return controlNames.map((name) => getBinding(name));
}

export function setBinding(controlName: ControlName, keyCode: KeyCode) {
  bindings[controlName] = keyCode;
  saveBindings();
}

export function saveBindings() {
  localStorage.setItem("bindings", JSON.stringify(bindings));
}

export function clearBindings() {
  localStorage.removeItem("bindings");
  bindings = { ...DEFAULT_BINDINGS };
}

export function isControlName(name: string): name is ControlName {
  return name in bindings;
}

export function loadBindings() {
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
