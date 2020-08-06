import { MeshPhongMaterial } from "three";
import Entity from "../../../core/entity/Entity";
import { V2d } from "../../../core/Vector";
import { SoundInstance } from "../../sound/SoundInstance";
import DropTarget from "../DropTarget";

const MATERIAL = new MeshPhongMaterial({
  color: 0xffbb00,
});

const DROP_FORCE = 20;
const RESET_TIME = 60;
const WIDTH = 2.2;
const HEIGHT = 3.3;

export default class Defender extends DropTarget implements Entity {
  tags = ["defender"];

  constructor(position: V2d, angle: number = 0.0) {
    super(position, angle, WIDTH, HEIGHT, DROP_FORCE, RESET_TIME);
  }

  getMaterial() {
    return MATERIAL;
  }

  onDrop() {}

  onTimeout() {
    this.addChild(new SoundInstance("defenderUp1"));
  }
}

function isDefender(e?: Entity): e is Defender {
  return e instanceof Defender;
}
