import Bezier from "bezier-js";
import { DirectionalLight, HemisphereLight, Object3D, Vector3 } from "three";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { degToRad } from "../../core/util/MathUtil";
import { V } from "../../core/Vector";
import CameraController from "../controllers/CameraController";
import MagicBallController from "../controllers/MagicBallController";
import NudgeController from "../controllers/NudgeController";
import SlowMoController from "../controllers/SlowMoController";
import LogicBoard from "../LogicBoard";
import Bumper from "../playfield/Bumper";
import CurveWall from "../playfield/CurveWall";
import Defender from "../playfield/Defender";
import Drain from "../playfield/Drain";
import Flipper from "../playfield/Flipper";
import Gate from "../playfield/Gate";
import Goal from "../playfield/Goal";
import Goalie from "../playfield/Goalie";
import MultiWall from "../playfield/MultiWall";
import Playfield from "../playfield/Playfield";
import Plunger from "../playfield/Plunger";
import Slingshot from "../playfield/Slingshot";
import Wall from "../playfield/Wall";
import { Rect } from "../Rect";
import Soundboard from "../Soundboard";
import Backglass from "../ui/Backglass";
import ControlDisplay from "../ui/ControlDisplay";
import Speedometer from "../ui/Speedometer";

export const TABLE_CENTER = new Vector3(0, 50, 0);
export const TABLE_RECT: Rect = { top: 0, bottom: 100, left: -24, right: 28 };
export const TABLE_ANGLE = degToRad(15);

export default class Table extends BaseEntity implements Entity {
  object3ds: Object3D[] = [];

  constructor() {
    super();

    this.setupLights();

    // Controllers
    this.addChild(new LogicBoard());
    this.addChild(new Soundboard());
    this.addChild(new NudgeController());
    this.addChild(new CameraController(TABLE_CENTER));
    this.addChild(new SlowMoController());
    this.addChild(new MagicBallController());

    // Misc
    this.addChild(new Backglass(TABLE_RECT.left, TABLE_RECT.right, 20));
    this.addChild(new Speedometer());
    this.addChild(new ControlDisplay());

    this.setupPlayfield();
  }

  setupPlayfield() {
    // Playfield
    this.addChild(new Playfield(TABLE_RECT));
    this.addChild(new Plunger(V(26, 97.5)));

    this.setupUpperPlayfield();
    this.setupLowerPlayfield();

    // outer walls
    this.addChild(new Wall(V(-24, 0), V(-24, 100)));
    this.addChild(new Wall(V(24, 30), V(24, 42), 0.8));
    this.addChild(new Wall(V(24, 47), V(24, 100)));
    this.addChild(new Wall(V(28, 24), V(28, 100)));
  }

  setupUpperPlayfield() {
    // TOP RIGHT
    this.addChildren(
      new Bumper(V(6, 20), 1.4),
      new Bumper(V(10, 25), 1.4),
      new Bumper(V(12, 17), 1.4),
      new Bumper(V(16, 23), 1.4)
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

    // triangles

    this.addChildren(
      new MultiWall([V(-24, 40), V(-20, 50), V(-20, 53), V(-24, 56)]),
      new MultiWall([V(24, 47), V(20, 50), V(20, 53), V(24, 56)]),
      new Flipper(V(22, 48.5), "right", 3.6, degToRad(-20), degToRad(50))
    );

    this.addChildren(
      new CurveWall(new Bezier(bp(0, 0), bp(28, 0), bp(28, 24)), 40),
      new CurveWall(new Bezier(bp(0, 0), bp(-24, 0), bp(-24, 24)), 40)
    );

    this.addChild(new Bumper(V(-3, 6), 1.1));

    this.addChild(
      new MultiWall([V(-1, 17), V(3, 24), V(-1.5, 20), V(-1, 17)], 0.9)
    );

    this.addChild(
      new CurveWall(
        new Bezier({ x: -2, y: 12 }, { x: -22, y: 2 }, { x: -20, y: 28 }),
        40,
        0.6
      )
    );

    this.addChild(new Gate(V(4, 4), V(0, 0), degToRad(90)));
    this.addChild(
      new CurveWall(
        new Bezier({ x: 4, y: 4 }, { x: 26, y: 4 }, { x: 24, y: 30 }),
        40,
        0.8
      )
    );
    this.addChild(
      new CurveWall(
        new Bezier({ x: 6, y: 11 }, { x: 20, y: 0 }, { x: 24, y: 30 }),
        40,
        0.8
      )
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
      new MultiWall([V(-13, 10 + LO), V(-13, 21 + LO), V(-9, 24 + LO)], 0.9)
    );

    // Outlanes
    this.addChild(new MultiWall([V(-20, 60), V(-20, 22 + LO), V(-8, 30 + LO)]));
    this.addChild(new MultiWall([V(20, 60), V(20, 22 + LO), V(8, 30 + LO)]));

    // Bottom ramp to drain
    this.addChild(new Wall(V(-24, 88), V(-4, 100)));
    this.addChild(new Wall(V(24, 88), V(4, 100)));

    // this.addChild(new GoalMesh(V(0, 100), Math.PI, 8, 4));
    this.addChild(new Drain(V(-4, 100), V(4, 100)));

    this.addChild(new Flipper(V(-8, 30.25 + LO), "left", 6.2));
    this.addChild(new Flipper(V(8, 30.25 + LO), "right", 6.2));
  }

  setupLights() {
    this.object3ds.push(new HemisphereLight(0xffffff, 0x333333, 0.1));

    for (const [x, y] of [
      [-50, -20],
      [0, -20],
      [50, -20],
      [-50, 40],
      [0, 40],
      [50, 40],
      [-50, 110],
      [0, 110],
      [50, 110],
    ]) {
      const light = new DirectionalLight(0xffffff, 0.1);
      light.position.set(x, y, -90);
      light.target.position.copy(TABLE_CENTER);
      light.castShadow = true;
      light.shadow.mapSize.height *= 4;
      light.shadow.mapSize.width *= 4;
      light.shadow.camera.left = -100;
      light.shadow.camera.right = 100;
      light.shadow.camera.top = 100;
      light.shadow.camera.bottom = -100;
      this.object3ds.push(light, light.target);
    }
  }
}

/** Create a bezier point */
function bp(x: number, y: number): { x: number; y: number } {
  return { x, y };
}
