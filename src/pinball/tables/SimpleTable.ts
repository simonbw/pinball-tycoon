import Bezier from "bezier-js";
import { HemisphereLight, Light } from "three";
import Entity from "../../core/entity/Entity";
import { degToRad } from "../../core/util/MathUtil";
import { V } from "../../core/Vector";
import { getGraphicsQuality } from "../controllers/GraphicsQualityController";
import Bumper from "../playfield/Bumper";
import Defender from "../playfield/Defender";
import Drain from "../playfield/Drain";
import Flipper from "../playfield/Flipper";
import Gate from "../playfield/Gate";
import Goal from "../playfield/Goal";
import Goalie from "../playfield/Goalie";
import BallRemainingLamp from "../playfield/lamps/BallRemainingLamp";
import BallSaveLamp from "../playfield/lamps/BallSaveLamp";
import OverheadLight from "../environment/OverheadLight";
import Playfield from "../playfield/Playfield";
import Plunger from "../playfield/Plunger";
import Slingshot from "../playfield/Slingshot";
import Spinner from "../playfield/Spinner";
import BezierWall from "../playfield/walls/BezierWall";
import MultiWall from "../playfield/walls/MultiWall";
import Wall from "../playfield/walls/Wall";
import Backglass from "../ui/Backglass";
import { Rect } from "../util/Rect";
import Table from "./Table";
import Topglass from "../environment/Topglass";

const BOUNDS: Rect = Rect.fromCorners([-24, 0], [28, 100]);
const INCLINE = degToRad(5);
const BALL_DROP = V(26, 92);

export default class SimpleTable extends Table implements Entity {
  spotlights: Light[] = [];

  constructor() {
    super(BOUNDS, INCLINE, BALL_DROP);

    this.setupLights();

    // Misc
    this.addChild(new Backglass(this));

    this.setupPlayfield();
  }

  setupPlayfield() {
    // Playfield
    this.addChildren(
      new Playfield(BOUNDS),
      new Topglass(BOUNDS, -6),
      new Plunger(V(26, 96)),
      new BallRemainingLamp(V(26, 94), 1),
      new BallRemainingLamp(V(26, 92), 2),
      new BallRemainingLamp(V(26, 90), 3)
    );

    // outer walls
    this.addChildren(
      new Wall(V(-24, 0), V(-24, 100)),
      new Wall(V(24, 30), V(24, 42), 0.8),
      new Wall(V(24, 47), V(24, 100)),
      new Wall(V(28, 24), V(28, 100))
    );
  }

  setupLights() {
    const hemisphereLight = new HemisphereLight(0x333333, 0xffffff, 1);
    hemisphereLight.position.set(0, 0, -2);
    this.object3ds.push(hemisphereLight);

    for (const [x, y] of [
      [0, -20],
      [-50, 40],
      [50, 40],
      [0, 110],
    ]) {
      this.addChild(new OverheadLight(V(x, y)));
    }

    this
      .addChildren
      // new BallSpotlight(this, this.center.x, this.bounds.top, -24, 10)
      // new BallSpotlight(this, this.center.x, this.bounds.bottom, -10, 200)
      ();
  }

  handlers = {
    setQuality: () => {
      for (const light of this.spotlights) {
        light.castShadow = getGraphicsQuality() === "high";
      }
    },
  };
}

/** Create a bezier point */
function bp(x: number, y: number): { x: number; y: number } {
  return { x, y };
}
