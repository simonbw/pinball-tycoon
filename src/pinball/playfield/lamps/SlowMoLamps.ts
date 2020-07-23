import BaseEntity from "../../../core/entity/BaseEntity";
import Entity from "../../../core/entity/Entity";
import { clamp } from "../../../core/util/MathUtil";
import { V, V2d } from "../../../core/Vector";
import {
  SlowMoCooldownEvent,
  SlowMoRemainingEvent,
} from "../../system/SlowMoController";
import Lamp from "./Lamp";

const COLOR_READY = 0x00aa00;
const COLOR_COOL = 0xaa0000;
const INTENSITY = 0.8;
const SIZE = 0.4;

export default class SlowMoLamps extends BaseEntity implements Entity {
  lamps: Lamp[];
  lit: boolean = false;

  constructor(position: V2d) {
    super();
    this.lamps = [];
    for (let i = -1; i <= 1; i++) {
      const lamp = new Lamp(
        position.add(V(0, -i * 1.2)),
        COLOR_READY,
        SIZE,
        INTENSITY
      );
      this.addChild(lamp);
      this.lamps.push(lamp);
    }
  }

  setLampColors(cooldown: boolean) {
    const color = cooldown ? COLOR_COOL : COLOR_READY;
    for (const lamp of this.lamps) {
      lamp.setColorGradual(color, 0.2);
    }
  }

  setLampPercents(percent: number) {
    const nLamps = this.lamps.length;
    for (let i = 0; i < nLamps; i++) {
      const lamp = this.lamps[i];
      const min = i / nLamps;
      const lampPercent = clamp((percent - min) * nLamps);
      lamp.setBrightnessImmediate(lampPercent ** 0.6);
    }
  }

  handlers = {
    gameStart: () => {
      console.log("gonna flash");
      for (const lamp of this.lamps) {
        lamp.flash(3);
      }
    },

    slowMoRemaining: (e: SlowMoRemainingEvent) => {
      this.setLampPercents(e.remaining);
    },
    slowMoCooldown: (e: SlowMoCooldownEvent) => {
      this.setLampColors(e.cooldown);
    },
  };
}
