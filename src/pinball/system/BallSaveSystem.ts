import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { NewBallEvent } from "./LogicBoard";

export interface BallSaveChangeEvent {
  type: "ballSaveChange";
  active: boolean;
}

function ballSaveLampEvent(active: boolean): BallSaveChangeEvent {
  return {
    type: "ballSaveChange",
    active,
  };
}

const INITIAL_SAVE_TIME = 10;

export default class BallSaveSystem extends BaseEntity implements Entity {
  initialSave: boolean = true;
  earnedSave: boolean = false;

  constructor() {
    super();
  }

  emitUpdate() {
    this.game?.dispatch(ballSaveLampEvent(this.canSave()));
  }

  canSave() {
    return this.earnedSave || this.initialSave;
  }

  saveIfPossible(): boolean {
    if (this.initialSave) {
      this.initialSave = false;
      this.emitUpdate();
      return true;
    } else if (this.earnedSave) {
      this.earnedSave = false;
      this.emitUpdate();
      return true;
    }
    return false;
  }

  earnSave() {
    this.earnedSave = true;
    this.emitUpdate();
  }

  handlers = {
    newBall: async ({ fromSave }: NewBallEvent) => {
      this.clearTimers();
      if (!fromSave) {
        this.initialSave = true;
        this.emitUpdate();
        await this.wait(INITIAL_SAVE_TIME);
        this.initialSave = false;
        this.emitUpdate();
      }
    },
  };
}
