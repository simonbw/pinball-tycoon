import { KeyCode } from "../../core/io/Keys";

const DEFAULT_BINDINGS = {
  START_GAME: "KeyS",
  LEFT_FLIPPER: "KeyX",
  RIGHT_FLIPPER: "Period",

  NUDGE_RIGHT: "Slash",
  NUDGE_LEFT: "KeyZ",
  NUDGE_UP_LEFT: "KeyC",
  NUDGE_UP_RIGHT: "Comma",

  SLO_MO: "ShiftLeft",
  SLO_MO2: "ShiftRight",

  "MAGIC.MULTI": "KeyB",
  "MAGIC.RESET": "KeyR",
  "MAGIC.LEFT": "ArrowLeft",
  "MAGIC.UP": "ArrowUp",
  "MAGIC.RIGHT": "ArrowRight",
  "MAGIC.DOWN": "ArrowDown",
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
