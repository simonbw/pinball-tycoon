import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { rInteger } from "../../core/util/Random";
import HitBumperObjective from "../objectives/HitBumperObjective";
import InlanesObjective from "../objectives/InlanesObjective";
import Objective from "../objectives/Objective";
import PassLoopObjective from "../objectives/PassLoopObjective";
import ScoreGoalsObjective from "../objectives/ScoreGoalsObjective";
import SpinnerObjective from "../objectives/SpinnerObjective";
import TargetBankObjective from "../objectives/TargetBankObjective";
import { SoundInstance } from "../sound/SoundInstance";
import { scoreEvent } from "./LogicBoard";

export interface NewObjectiveEvent {
  type: "newObjective";
  objective: Objective;
}

function newObjectiveEvent(objective: Objective): NewObjectiveEvent {
  return {
    type: "newObjective",
    objective,
  };
}

export default class ObjectivesSystem extends BaseEntity implements Entity {
  currentObjective?: Objective;
  completedObjectives: Objective[] = [];
  looping: boolean = false;

  constructor() {
    super();
  }

  async objectivesLoop() {
    this.looping = true;
    while (this.game && this.looping) {
      this.currentObjective = this.addChild(this.getNextObjective());
      this.game.dispatch(newObjectiveEvent(this.currentObjective));
      await this.currentObjective.waitTillComplete();
      this.completedObjectives.push(this.currentObjective);
      await this.wait(0.2);
      this.game.dispatch(scoreEvent(250000)); // TODO: Scores based on difficulty
      this.addChild(new SoundInstance("goal"));
      await this.wait(1.5);
    }
  }

  stopLooping() {
    this.looping = false;
    this.clearTimers();
  }

  getNextObjective(): Objective {
    return new HitBumperObjective(5);
  }

  handlers = {
    newBall: async () => {
      this.stopLooping();
      this.currentObjective?.destroy();
      this.currentObjective = undefined;
    },

    hasPlunged: async () => {
      this.objectivesLoop();
    },
  };
}
