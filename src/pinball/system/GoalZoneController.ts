import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import Defender from "../playfield/Defender";
import Goal from "../playfield/Goal";
import Goalie from "../playfield/Goalie";
import { scoreEvent } from "./LogicBoard";
import { SoundInstance } from "../sound/SoundInstance";
import { clamp } from "../../core/util/MathUtil";
import { PositionalSound } from "../sound/PositionalSound";

export default class GoalZoneController extends BaseEntity implements Entity {
  goalie?: Goalie;
  defenders: Defender[] = [];
  goal?: Goal;

  goalCount: number = 0;

  constructor() {
    super();
  }

  addGoal(goal: Goal) {
    this.goal = goal;
    this.addChild(goal);

    goal.onScoop = () => this.onGoal(goal);
    goal.onRelease = () => this.onGoalRelease(goal);
  }

  addGoalie(goalie: Goalie) {
    this.goalie = goalie;
    this.addChild(goalie);

    goalie.onDrop = () => this.onGoalieDown(goalie);
  }

  addDefender(defender: Defender) {
    this.defenders.push(defender);
    this.addChild(defender);
    defender.onDrop = () => this.onDefenderDown(defender);
  }

  getDefenderUpCount() {
    const isUp = (d: Defender) => d.up;
    return this.defenders.filter(isUp).length;
  }

  onGoalieDown(goalie: Goalie) {
    const scoreMultiplier = clamp(this.goalCount + 1, 0, 4);
    if (this.getDefenderUpCount() === 0) {
      this.game!.dispatch(scoreEvent(5300 * scoreMultiplier));
      this.addChild(new SoundInstance("goalieDown"));
    } else {
      this.game!.dispatch(scoreEvent(2450 * scoreMultiplier));
      this.addChild(new SoundInstance("goalieDown"));
    }
  }

  onDefenderDown(defender: Defender) {
    const count = this.getDefenderUpCount();
    if (count === 0) {
      this.game!.dispatch(scoreEvent(10850));
      this.addChild(new SoundInstance("defenderDown3"));
    } else if (count === 1) {
      this.game!.dispatch(scoreEvent(3850));
      this.addChild(new SoundInstance("defenderDown2"));
    } else {
      this.game!.dispatch(scoreEvent(1850));
      this.addChild(new SoundInstance("defenderDown1"));
    }
  }

  async onGoal(goal: Goal) {
    this.goalCount += 1;
    this.addChild(new SoundInstance("goal"));
    const scoreMultiplier = clamp(this.goalCount, 0, 4);
    this.game?.dispatch(scoreEvent(25000 * scoreMultiplier));

    if (this.goalie) {
      this.goalie.clearTimers();
      this.goalie.lower();
      this.goalie.speed = (this.goalie.speed % 5) + 1;
    }

    for (const defender of this.defenders) {
      defender.clearTimers();
      defender.lower();
    }

    this.game?.dispatch({ type: "goal" });
  }

  async onGoalRelease(goal: Goal) {
    const soundPos = goal.getPosition();
    this.addChild(new PositionalSound("pop1", soundPos, { speed: 0.5 }));
    await this.wait(0.3);
    this.resetDefenders();
  }

  resetDefenders() {
    this.goalie?.raise();
    for (const defender of this.defenders) {
      defender.raise();
    }
  }

  handlers = {
    gameStart: () => {
      this.goalCount = 0;
      this.goalie?.setSpeed(1.0);
    },
  };
}
