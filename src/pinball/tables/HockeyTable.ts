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
import OverheadLight from "../playfield/OverheadLight";
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
import Topglass from "./Topglass";

const BOUNDS: Rect = Rect.fromCorners([-24, 0], [28, 100]);
const INCLINE = degToRad(15);
const BALL_DROP = V(26, 92);

export default class HockeyTable extends Table implements Entity {
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

    this.setupUpperPlayfield();
    this.setupLowerPlayfield();

    // outer walls
    this.addChildren(
      new Wall(V(-24, 0), V(-24, 100)),
      new Wall(V(24, 30), V(24, 42), 0.8),
      new Wall(V(24, 47), V(24, 100)),
      new Wall(V(28, 24), V(28, 100))
    );
  }

  setupUpperPlayfield() {
    // TOP RIGHT
    this.addChildren(
      new Bumper(V(6, 20), 1.8),
      new Bumper(V(10, 25), 1.8),
      new Bumper(V(12, 17), 1.8),
      new Bumper(V(16, 23), 1.8)
    );
    this.addChild(new Gate(V(28, 43.5), V(24.5, 46.5), -degToRad(180)));

    // GOAL AREA
    const bl = V(-14, 22);
    const tr = V(-6, 18);
    const fm = tr.add(bl).imul(0.5);
    const d = tr.sub(bl);
    const n = d.rotate90ccw().inormalize();
    const angle = d.angle;
    this.addChildren(
      new Goal(fm.add(n.mul(-2.5)), angle, 10, 5),
      new Goalie(bl.add(n.mul(0.3)), tr.add(n.mul(0.3))),
      new Defender(fm.add(d.mul(-0.4)).add(n.mul(2)), angle),
      new Defender(fm.add(n.mul(2)), angle),
      new Defender(fm.add(d.mul(0.4)).add(n.mul(2)), angle)
    );

    this.addChild(new Spinner(V(-22, 27), degToRad(-3), 3.5));

    // Trapezoids
    this.addChildren(
      new MultiWall([V(-24, 40), V(-20, 50), V(-20, 53), V(-24, 56)]),
      new MultiWall([V(24, 47), V(20, 50), V(20, 53), V(24, 56)]),
      new Flipper(V(22, 48.5), "right", 3.6, degToRad(-20), degToRad(50))
    );

    // Top curves?
    this.addChildren(
      new BezierWall(new Bezier(bp(0, 0), bp(28, 0), bp(28, 24)), 40),
      new BezierWall(new Bezier(bp(0, 0), bp(-24, 0), bp(-24, 24)), 40)
    );

    // Upperer stuff
    this.addChild(new Bumper(V(-3, 6), 1.6));

    this.addChild(
      new MultiWall([V(-1, 17), V(3, 24), V(-1.5, 20), V(-1, 17)], 0.9)
    );

    this.addChild(
      new BezierWall(new Bezier(bp(-2, 12), bp(-22, 2), bp(-20, 28)), 40, 0.6)
    );

    this.addChild(new Gate(V(4, 4), V(0, 0), degToRad(110)));
    this.addChild(
      new BezierWall(new Bezier(bp(4, 4), bp(26, 4), bp(24, 30)), 40, 0.8)
    );
    this.addChild(
      new BezierWall(new Bezier(bp(6, 11), bp(20, 0), bp(24, 30)), 40, 0.8)
    );
    this.addChild(new Wall(V(4, 4), V(6, 11), 0.8));
  }

  setupLowerPlayfield() {
    const LO = 61;
    // Slingshots/inlanes
    this.addChildren(
      new Wall(V(16.5, 8 + LO), V(16.5, 19 + LO), 0.4),
      new Wall(V(-16.5, 8 + LO), V(-16.5, 19 + LO), 0.4),
      new Slingshot(V(13, 10 + LO), V(9, 24 + LO), 0.7),
      new Slingshot(V(-13, 10 + LO), V(-9, 24 + LO), 0.7, true),
      new MultiWall([V(13, 10 + LO), V(13, 21 + LO), V(9, 24 + LO)], 0.9),
      new MultiWall([V(-13, 10 + LO), V(-13, 21 + LO), V(-9, 24 + LO)], 0.9),
      new Flipper(V(-8, 30.25 + LO), "left", 6.2),
      new Flipper(V(8, 30.25 + LO), "right", 6.2),
      new BallSaveLamp(V(0, LO + 30.5)),
      // Outlanes
      new MultiWall([V(-20, LO - 2), V(-20, 22 + LO), V(-8, 30 + LO)]),
      new MultiWall([V(20, LO - 2), V(20, 22 + LO), V(8, 30 + LO)]),
      // Bottom stuff
      new Wall(V(-24, 88), V(-4, 100)),
      new Drain(Rect.fromTopLeft([-9, BOUNDS.bottom], 18, 4)),
      new Wall(V(24, 88), V(4, 100))
    );
  }

  setupLights() {
    const hemisphereLight = new HemisphereLight(0xffffff, 0x333333, 1);
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
