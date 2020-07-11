import Bezier from "bezier-js";
import { DirectionalLight, HemisphereLight, Vector3 } from "three";
import BaseEntity from "../core/entity/BaseEntity";
import Entity from "../core/entity/Entity";
import { degToRad } from "../core/util/MathUtil";
import { V } from "../core/Vector";
import CameraController from "./controllers/CameraController";
import MagicBallController from "./controllers/MagicBallController";
import NudgeController from "./controllers/NudgeController";
import SlowMoController from "./controllers/SlowMoController";
import LogicBoard from "./LogicBoard";
import Bumper from "./playfield/Bumper";
import CurveWall from "./playfield/CurveWall";
import Drain from "./playfield/Drain";
import Flipper from "./playfield/Flipper";
import Gate from "./playfield/Gate";
import MultiWall from "./playfield/MultiWall";
import Playfield from "./playfield/Playfield";
import Plunger from "./playfield/Plunger";
import Post from "./playfield/Post";
import Slingshot from "./playfield/Slingshot";
import Wall from "./playfield/Wall";
import { Rect } from "./Rect";
import Soundboard from "./Soundboard";
import Backglass from "./ui/Backglass";
import ControlDisplay from "./ui/ControlDisplay";
import Speedometer from "./ui/Speedometer";

export const TABLE_CENTER = new Vector3(0, 50, 0);
export const TABLE_RECT: Rect = { top: 0, bottom: 100, left: -24, right: 28 };
export const TABLE_ANGLE = degToRad(15);

export default class Table extends BaseEntity implements Entity {
  constructor() {
    super();

    this.object3ds = [];
    this.object3ds.push(new HemisphereLight(0xffffff, 0x333333, 0.3));

    for (const [x, y] of [
      [-20, -20],
      [60, 10],
      [0, 140],
    ]) {
      const light = new DirectionalLight(0xffffff, 0.2);
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
    this.addChild(new Playfield(TABLE_RECT));
    this.addChild(new Plunger(V(26, 97.5)));

    // Bumpers
    this.addChild(new Bumper(V(-10, 35)));
    this.addChild(new Bumper(V(-5, 30)));
    this.addChild(new Bumper(V(0, 35)));
    this.addChild(new Bumper(V(5, 30)));
    this.addChild(new Bumper(V(10, 35)));

    // Posts
    this.addChild(new Post(V(-12, 10)));
    this.addChild(new Post(V(-8, 10)));
    this.addChild(new Post(V(-4, 10)));
    this.addChild(new Post(V(0, 10)));
    this.addChild(new Post(V(4, 10)));
    this.addChild(new Post(V(8, 10)));
    this.addChild(new Post(V(12, 10)));

    this.addChild(new Gate(V(28, 26.5), V(24.5, 29.5), -degToRad(180)));
    this.addChild(new Gate(V(28, 43.5), V(24.5, 46.5), -degToRad(180)));

    // outer walls
    this.addChild(new Wall(V(-24, 0), V(-24, 100)));
    this.addChild(new Wall(V(24, 30), V(24, 42)));
    this.addChild(new Wall(V(24, 47), V(24, 100)));
    this.addChild(new Wall(V(28, 24), V(28, 100)));

    // triangles
    this.addChild(
      new MultiWall([V(-24, 40), V(-20, 50), V(-20, 53), V(-24, 56)])
    );
    this.addChild(new MultiWall([V(24, 47), V(20, 50), V(20, 53), V(24, 56)]));
    this.addChild(new Flipper(V(19.5, 50.5), "right", 4));

    const LO = 61;
    // Slingshots/inlanes
    this.addChild(new Wall(V(16.5, 8 + LO), V(16.5, 19 + LO), 0.4));
    this.addChild(new Wall(V(-16.5, 8 + LO), V(-16.5, 19 + LO), 0.4));
    this.addChild(new Slingshot(V(13, 8 + LO), V(9, 24 + LO), 0.7));
    this.addChild(new Slingshot(V(-13, 8 + LO), V(-9, 24 + LO), 0.7, true));
    this.addChild(
      new MultiWall([V(13, 8 + LO), V(13, 21 + LO), V(9, 24 + LO)], 0.6)
    );
    this.addChild(
      new MultiWall([V(-13, 8 + LO), V(-13, 21 + LO), V(-9, 24 + LO)], 0.6)
    );

    // Outlanes
    this.addChild(new MultiWall([V(-20, 60), V(-20, 22 + LO), V(-8, 30 + LO)]));
    this.addChild(new MultiWall([V(20, 60), V(20, 22 + LO), V(8, 30 + LO)]));
    this.addChild(new Wall(V(-24, 88), V(-4, 100)));
    this.addChild(new Wall(V(24, 88), V(4, 100)));
    this.addChild(new Drain(V(-4, 100), V(4, 100)));

    this.addChild(new Flipper(V(-8, 30.25 + LO), "left", 6.2));
    this.addChild(new Flipper(V(8, 30.25 + LO), "right", 6.2));

    this.addChild(
      new CurveWall(
        new Bezier({ x: 0, y: 0 }, { x: 28, y: 0 }, { x: 28, y: 24 }),
        40
      )
    );
    this.addChild(
      new CurveWall(
        new Bezier({ x: 0, y: 0 }, { x: -24, y: 0 }, { x: -24, y: 24 }),
        40
      )
    );
  }
}
