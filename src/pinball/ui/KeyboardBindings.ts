import { KeyCode } from "../../core/io/Keys";

const DEFAULT_BINDINGS = {
  START_GAME: "KeyS" as KeyCode,
  LEFT_FLIPPER: "KeyX" as KeyCode,
  RIGHT_FLIPPER: "Period" as KeyCode,

  NUDGE_RIGHT: "Slash" as KeyCode,
  NUDGE_LEFT: "KeyZ" as KeyCode,
  NUDGE_UP_LEFT: "KeyC" as KeyCode,
  NUDGE_UP_RIGHT: "Comma" as KeyCode,

  SLO_MO: "ShiftLeft" as KeyCode,
  SLO_MO2: "ShiftRight" as KeyCode,

  MAGIC_MULTI: "KeyB" as KeyCode,
  MAGIC_RESET: "KeyR" as KeyCode,
  MAGIC_LEFT: "ArrowLeft" as KeyCode,
  MAGIC_UP: "ArrowUp" as KeyCode,
  MAGIC_RIGHT: "ArrowRight" as KeyCode,
  MAGIC_DOWN: "ArrowDown" as KeyCode,

  QUALITY_LOW: "Digit1" as KeyCode,
  QUALITY_MEDIUM: "Digit2" as KeyCode,
  QUALITY_HIGH: "Digit3" as KeyCode,

  PAUSE: "Escape" as KeyCode,
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
