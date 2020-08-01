import Objective from "./Objective";
import Entity from "../../core/entity/Entity";

export default class CompoundObjective extends Objective implements Entity {
  constructor(...objectives: Objective[]) {
    super();
    Promise.all(objectives.map((o) => o.waitTillComplete())).then(() =>
      this.complete()
    );
  }
}
