import Entity from "../../../core/entity/Entity";
import { V2d } from "../../../core/Vector";
import Lamp, { LampOptions } from "./Lamp";

export default class TargetLamp extends Lamp implements Entity {
  constructor(position: V2d, public id: string, options: LampOptions = {}) {
    super(position, options);
  }

  handlers = {
    gameStart: () => {
      this.flash(5);
    },
  };

  onAdd() {
    this.flash(Infinity);
  }
}
