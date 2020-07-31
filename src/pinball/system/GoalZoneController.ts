import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import Defender from "../playfield/Defender";
import Goal from "../playfield/Goal";
import Goalie from "../playfield/Goalie";

export default class GoalZoneController extends BaseEntity implements Entity {
  goalie?: Goalie;
  defenders: Defender[] = [];
  goal?: Goal;

  constructor() {
    super();
  }

  addGoalie(goalie: Goalie) {
    this.goalie = goalie;
    this.addChild(goalie);
  }

  addGoal(goal: Goal) {
    this.goal = goal;
    this.addChild(goal);
  }

  addDefender(defender: Defender) {
    this.defenders.push(defender);
    this.addChild(defender);
  }
}
