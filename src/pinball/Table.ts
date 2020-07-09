import Bezier from "bezier-js";
import Game from "../core/Game";
import { degToRad } from "../core/util/MathUtil";
import CameraController from "./controllers/CameraController";
import ControlDisplay from "./ui/ControlDisplay";
import LogicBoard from "./LogicBoard";
import NudgeController from "./controllers/NudgeController";
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
import Scoreboard from "./ui/Scoreboard";
import Soundboard from "./Soundboard";
import Speedometer from "./ui/Speedometer";
import SlowMoController from "./controllers/SlowMoController";
import MagicBallController from "./controllers/MagicBallController";
import Light from "./lighting/Light";

export function setupTable(game: Game) {
  game.camera.center([0, 50]);
  game.camera.z = 7; // TODO: WHY DOES THIS HAVE TO BE 7?!?!

  // Overhead Lights
  game.addEntities([
    new Light({
      position: [-12 * 6, -12 * 3, 12 * 6],
      power: 1.0,
      quadraticFade: 0.00001,
    }),
    new Light({
      position: [12 * 6, 100 + 12 * 3, 12 * 4],
      power: 0.2,
      quadraticFade: 0.00001,
    }),
  ]);

  // Controls
  game.addEntity(new LogicBoard());
  game.addEntity(new Soundboard());
  game.addEntity(new NudgeController());
  game.addEntity(new CameraController());
  game.addEntity(new SlowMoController());
  game.addEntity(new MagicBallController());

  // Misc
  game.addEntity(new Scoreboard());
  game.addEntity(new Speedometer());
  game.addEntity(new ControlDisplay());
  game.addEntity(new Boundary(0, 100, -24, 28));
  game.addEntity(new Plunger([26, 97.5]));

  // Bumpers
  game.addEntity(new Bumper([-10, 35]));
  game.addEntity(new Bumper([-5, 30]));
  game.addEntity(new Bumper([0, 35]));
  game.addEntity(new Bumper([5, 30]));
  game.addEntity(new Bumper([10, 35]));

  // Posts
  game.addEntity(new Post([-12, 10]));
  game.addEntity(new Post([-8, 10]));
  game.addEntity(new Post([-4, 10]));
  game.addEntity(new Post([0, 10]));
  game.addEntity(new Post([4, 10]));
  game.addEntity(new Post([8, 10]));
  game.addEntity(new Post([12, 10]));

  game.addEntity(new Gate([28, 26.5], [24.5, 29.5], -degToRad(180)));
  game.addEntity(new Gate([28, 43.5], [24.5, 46.5], -degToRad(180)));

  // outer walls
  game.addEntity(new Wall([-24, 0], [-24, 100]));
  game.addEntity(new Wall([24, 30], [24, 42]));
  game.addEntity(new Wall([24, 47], [24, 100]));
  game.addEntity(new Wall([28, 24], [28, 100]));

  // triangles
  game.addEntity(
    new MultiWall([
      [-24, 40],
      [-20, 50],
      [-20, 53],
      [-24, 56],
    ])
  );
  game.addEntity(
    new MultiWall([
      [24, 47],
      [20, 50],
      [20, 53],
      [24, 56],
    ])
  );
  game.addEntity(new Flipper([19.5, 50.5], "right", 4));

  const LO = 61;
  // Slingshots/inlanes
  game.addEntity(new Wall([16.5, 8 + LO], [16.5, 19 + LO], 0.4));
  game.addEntity(new Wall([-16.5, 8 + LO], [-16.5, 19 + LO], 0.4));
  game.addEntity(new Slingshot([13, 8 + LO], [9, 24 + LO], 0.7));
  game.addEntity(new Slingshot([-13, 8 + LO], [-9, 24 + LO], 0.7, true));
  game.addEntity(
    new MultiWall(
      [
        [13, 8 + LO],
        [13, 21 + LO],
        [9, 24 + LO],
      ],
      0.6
    )
  );
  game.addEntity(
    new MultiWall(
      [
        [-13, 8 + LO],
        [-13, 21 + LO],
        [-9, 24 + LO],
      ],
      0.6
    )
  );

  // Outlanes
  game.addEntity(
    new MultiWall([
      [-20, 60],
      [-20, 22 + LO],
      [-8, 30 + LO],
    ])
  );
  game.addEntity(
    new MultiWall([
      [20, 60],
      [20, 22 + LO],
      [8, 30 + LO],
    ])
  );
  game.addEntity(new Wall([-24, 88], [-4, 100]));
  game.addEntity(new Wall([24, 88], [4, 100]));
  game.addEntity(new Drain([-4, 100], [4, 100]));

  game.addEntity(new Flipper([-8, 30.25 + LO], "left", 6.2));
  game.addEntity(new Flipper([8, 30.25 + LO], "right", 6.2));

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
