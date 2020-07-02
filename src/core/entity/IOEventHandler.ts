import { ControllerButton } from "../constants/Gamepad";

export default interface IOEventHandler {
  // Called when the mouse is left clicked anywhere
  onClick?(): void;
  // Called when the left mouse button is pressed anywhere
  onMouseDown?(): void;
  // Called when the left mouse button is released anywhere
  onMouseUp?(): void;
  // Called when the mouse is right clicked anywhere
  onRightClick?(): void;
  // Called when the right mouse button is pressed anywhere
  onRightDown?(): void;
  // Called when the right mouse button is released anywhere
  onRightUp?(): void;
  // called when a keyboard key is pressed
  onKeyDown?(key: number): void;
  // called when a keyboard key is released
  onKeyUp?(key: number): void;
  // Called when a gamepad button is pressed
  onButtonDown?(button: ControllerButton): void;
  // Called when a gamepad button is released
  onButtonUp?(button: ControllerButton): void;
}
