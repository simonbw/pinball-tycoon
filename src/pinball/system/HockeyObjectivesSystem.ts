import { rInteger } from "../../core/util/Random";
import HitBumperObjective from "../objectives/HitBumperObjective";
import InlanesObjective from "../objectives/InlanesObjective";
import PassLoopObjective from "../objectives/PassLoopObjective";
import ScoreGoalsObjective from "../objectives/ScoreGoalsObjective";
import SpinnerObjective from "../objectives/SpinnerObjective";
import TargetBankObjective from "../objectives/TargetBankObjective";
import ObjectivesSystem from "./ObjectivesSystem";

export default class HockeyObjectivesSystem extends ObjectivesSystem {
  getNextObjective() {
    switch (rInteger(0, 6)) {
      case 0:
        return new HitBumperObjective();
      case 1:
        return new InlanesObjective();
      case 2:
        return new ScoreGoalsObjective(1);
      case 3:
        return new TargetBankObjective();
      case 4:
        return new PassLoopObjective();
      case 5:
      default:
        return new SpinnerObjective();
    }
  }
}
