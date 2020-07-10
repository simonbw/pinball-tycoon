import Bezier from "bezier-js";
import Game from "../core/Game";
import { degToRad } from "../core/util/MathUtil";
import { V } from "../core/Vector";
import CameraController from "./controllers/CameraController";
import MagicBallController from "./controllers/MagicBallController";
import NudgeController from "./controllers/NudgeController";
import SlowMoController from "./controllers/SlowMoController";
import Light from "./lighting/Light";
import LogicBoard from "./LogicBoard";
import Boundary from "./playfield/Boundary";
import Bumper from "./playfield/Bumper";
import CurveWall from "./playfield/CurveWall";
import Drain from "./playfield/Drain";
import Flipper from "./playfield/Flipper";
import Gate from "./playfield/Gate";
import MultiWall from "./playfield/MultiWall";
import Plunger from "./playfield/Plunger";
import Post from "./playfield/Post";
import Slingshot from "./playfield/Slingshot";
import Wall from "./playfield/Wall";
import Soundboard from "./Soundboard";
import ControlDisplay from "./ui/ControlDisplay";
import Scoreboard from "./ui/Scoreboard";
import Speedometer from "./ui/Speedometer";
import { Rect } from "./Rect";

export const TABLE_CENTER = V(0, 50);
export const TABLE_SIZE = V(0, 50);

export const TABLE_RECT: Rect = { top: 0, bottom: 100, left: -24, right: 28 };

export function setupTable(game: Game) {
  // Overhead Lights
  game.addEntities([
    new Light({
      position: [10, 30, -12 * 10],
      intensity: 0.3,
    }),
    new Light({
      position: [-12 * 6, -12 * 3, -12 * 6],
      intensity: 0.2,
    }),
    new Light({
      position: [12 * 6, 100 + 12 * 3, -12 * 6],
      intensity: 0.2,
    }),
  ]);

  // Controls
  game.addEntity(new LogicBoard());
  game.addEntity(new Soundboard());
  game.addEntity(new NudgeController());
  game.addEntity(new CameraController(TABLE_CENTER));
  game.addEntity(new SlowMoController());
  game.addEntity(new MagicBallController());

  // Misc
  game.addEntity(new Scoreboard(TABLE_RECT.left, TABLE_RECT.right, 20));
  game.addEntity(new Speedometer());
  game.addEntity(new ControlDisplay());
  game.addEntity(new Boundary(TABLE_RECT));
  game.addEntity(new Plunger(V(26, 97.5)));

  // Bumpers
  game.addEntity(new Bumper(V(-10, 35)));
  game.addEntity(new Bumper(V(-5, 30)));
  game.addEntity(new Bumper(V(0, 35)));
  game.addEntity(new Bumper(V(5, 30)));
  game.addEntity(new Bumper(V(10, 35)));

  // Posts
  game.addEntity(new Post(V(-12, 10)));
  game.addEntity(new Post(V(-8, 10)));
  game.addEntity(new Post(V(-4, 10)));
  game.addEntity(new Post(V(0, 10)));
  game.addEntity(new Post(V(4, 10)));
  game.addEntity(new Post(V(8, 10)));
  game.addEntity(new Post(V(12, 10)));

  game.addEntity(new Gate(V(28, 26.5), V(24.5, 29.5), -degToRad(180)));
  game.addEntity(new Gate(V(28, 43.5), V(24.5, 46.5), -degToRad(180)));

  // outer walls
  game.addEntity(new Wall(V(-24, 0), V(-24, 100)));
  game.addEntity(new Wall(V(24, 30), V(24, 42)));
  game.addEntity(new Wall(V(24, 47), V(24, 100)));
  game.addEntity(new Wall(V(28, 24), V(28, 100)));

  // triangles
  game.addEntity(
    new MultiWall([V(-24, 40), V(-20, 50), V(-20, 53), V(-24, 56)])
  );
  game.addEntity(new MultiWall([V(24, 47), V(20, 50), V(20, 53), V(24, 56)]));
  game.addEntity(new Flipper(V(19.5, 50.5), "right", 4));

  const LO = 61;
  // Slingshots/inlanes
  game.addEntity(new Wall(V(16.5, 8 + LO), V(16.5, 19 + LO), 0.4));
  game.addEntity(new Wall(V(-16.5, 8 + LO), V(-16.5, 19 + LO), 0.4));
  game.addEntity(new Slingshot(V(13, 8 + LO), V(9, 24 + LO), 0.7));
  game.addEntity(new Slingshot(V(-13, 8 + LO), V(-9, 24 + LO), 0.7, true));
  game.addEntity(
    new MultiWall([V(13, 8 + LO), V(13, 21 + LO), V(9, 24 + LO)], 0.6)
  );
  game.addEntity(
    new MultiWall([V(-13, 8 + LO), V(-13, 21 + LO), V(-9, 24 + LO)], 0.6)
  );

  // Outlanes
  game.addEntity(new MultiWall([V(-20, 60), V(-20, 22 + LO), V(-8, 30 + LO)]));
  game.addEntity(new MultiWall([V(20, 60), V(20, 22 + LO), V(8, 30 + LO)]));
  game.addEntity(new Wall(V(-24, 88), V(-4, 100)));
  game.addEntity(new Wall(V(24, 88), V(4, 100)));
  game.addEntity(new Drain(V(-4, 100), V(4, 100)));

  game.addEntity(new Flipper(V(-8, 30.25 + LO), "left", 6.2));
  game.addEntity(new Flipper(V(8, 30.25 + LO), "right", 6.2));

  game.addEntity(
    new CurveWall(
      new Bezier({ x: 0, y: 0 }, { x: 28, y: 0 }, { x: 28, y: 24 }),
      40
    )
  );
  game.addEntity(
    new CurveWall(
      new Bezier({ x: 0, y: 0 }, { x: -24, y: 0 }, { x: -24, y: 24 }),
      40
    )
  );
}
