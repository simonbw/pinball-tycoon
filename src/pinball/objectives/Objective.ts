import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";

export default class Objective extends BaseEntity implements Entity {
  promise: Promise<void>;
  private resolve!: () => void;

  isComplete: boolean = false;

  constructor() {
    super();
    this.promise = new Promise((resolve) => {
      this.resolve = resolve;
    });
  }

  complete() {
    this.isComplete = true;
    this.onComplete();
    this.resolve();
    this.destroy();
  }

  onComplete() {}

  waitTillComplete() {
    return this.promise;
  }

  toString() {
    return this.isComplete ? this.constructor.name : "Objective Complete";
  }
}
