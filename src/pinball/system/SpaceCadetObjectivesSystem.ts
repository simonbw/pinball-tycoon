import { rInteger } from "../../core/util/Random";
import HitBumperObjective from "../objectives/HitBumperObjective";
import SpinnerObjective from "../objectives/SpinnerObjective";
import ObjectivesSystem from "./ObjectivesSystem";

export default class SpaceCadetObjectivesSystem extends ObjectivesSystem {
  getNextObjective() {
    switch (rInteger(0, 2)) {
      case 0:
        return new HitBumperObjective();
      default:
        return new SpinnerObjective();
    }
  }
}
