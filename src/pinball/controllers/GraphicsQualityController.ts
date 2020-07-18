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

/** It's easier to just have this be global */
let CURRENT_QUALITY: GraphicsQuality = "low";

export default class GraphicsQualityController extends BaseEntity
  implements Entity {
  onAdd() {
    this.setMedium();
  }

  onKeyDown(keycode: KeyCode) {
    if (keycode === getBinding("QUALITY_TOGGLE")) {
      if (CURRENT_QUALITY === "low") {
        this.setMedium();
      } else if (CURRENT_QUALITY === "medium") {
        this.setLow();
      } else {
        this.setLow();
      }
    }

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

  get composer() {
    return this.game!.renderer.composer;
  }

  setLow() {
    CURRENT_QUALITY = "low";
    this.renderer.shadowMap.enabled = false;
    this.renderer.setPixelRatio(1);
    this.composer.setPixelRatio(1);
    this.game!.dispatch(graphicsQualityEvent("low"));
  }

  setMedium() {
    CURRENT_QUALITY = "medium";
    this.renderer.shadowMap.enabled = false;
    this.renderer.setPixelRatio(window.devicePixelRatio ?? 1);
    this.composer.setPixelRatio(window.devicePixelRatio ?? 1);
    this.game!.dispatch(graphicsQualityEvent("medium"));
  }

  setHigh() {
    CURRENT_QUALITY = "high";
    this.renderer.shadowMap.enabled = true;
    this.renderer.setPixelRatio(window.devicePixelRatio ?? 1);
    this.composer.setPixelRatio(window.devicePixelRatio ?? 1);
    this.game!.dispatch(graphicsQualityEvent("high"));
  }
}

export function getGraphicsQuality(): GraphicsQuality {
  return CURRENT_QUALITY;
}
