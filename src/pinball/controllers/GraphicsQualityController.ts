import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { KeyCode } from "../../core/io/Keys";
import { getBinding } from "../ui/KeyboardBindings";

type GraphicsQuality = "low" | "medium" | "high";

export interface GraphicsQualityEvent {
  type: "setQuality";
  quality: GraphicsQuality;
}

function graphicsQualityEvent(quality: GraphicsQuality): GraphicsQualityEvent {
  return { type: "setQuality", quality };
}

export default class GraphicsQualityController extends BaseEntity
  implements Entity {
  quality: GraphicsQuality = "high";

  onKeyDown(keycode: KeyCode) {
    switch (keycode) {
      case getBinding("QUALITY_LOW"):
        return this.setLow();
      case getBinding("QUALITY_MEDIUM"):
        return this.setMedium();
      case getBinding("QUALITY_HIGH"):
        return this.setHigh();
    }
  }

  get renderer() {
    return this.game!.renderer.threeRenderer;
  }

  setLow() {
    this.renderer.shadowMap.enabled = false;
    this.game!.dispatch(graphicsQualityEvent("low"));
  }

  setMedium() {
    this.renderer.shadowMap.enabled = false;
    this.game!.dispatch(graphicsQualityEvent("medium"));
  }

  setHigh() {
    this.renderer.shadowMap.enabled = true;
    this.game!.dispatch(graphicsQualityEvent("high"));
  }
}
