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
      this.currentObjective = this.addChild(makeRandomObjective());
      this.game.dispatch(newObjectiveEvent(this.currentObjective));
      await this.currentObjective.waitTillComplete();
      this.completedObjectives.push(this.currentObjective);
      await this.wait(0.2);
      this.game.dispatch(scoreEvent(250000));
      this.addChild(new SoundInstance("goal"));
      await this.wait(1.5);
    }
  }

  stopLooping() {
    this.looping = false;
    this.clearTimers();
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

function makeRandomObjective(): Objective {
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
