import Bezier from "bezier-js";
import Game from "../core/Game";
import { degToRad } from "../core/util/MathUtil";
import { V } from "../core/Vector";
import ControlDisplay from "./ControlDisplay";
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
import Scoreboard from "./Scoreboard";
import Soundboard from "./Soundboard";
import Speedometer from "./Speedometer";

export function setupTable(game: Game) {
  game.camera.center(V([0, 50]));
  game.camera.z = 7;

  game.addEntity(new LogicBoard());
  game.addEntity(new Soundboard());

  // Misc
  game.addEntity(new Scoreboard());
  game.addEntity(new Speedometer());
  game.addEntity(new ControlDisplay());
  game.addEntity(new Boundary(0, 100, -24, 28));
  game.addEntity(new Plunger(V([26, 97.5])));

  // Bumpers
  game.addEntity(new Bumper(V([-10, 35])));
  game.addEntity(new Bumper(V([-5, 30])));
  game.addEntity(new Bumper(V([0, 35])));
  game.addEntity(new Bumper(V([5, 30])));
  game.addEntity(new Bumper(V([10, 35])));

  // Posts
  game.addEntity(new Post(V([-12, 10])));
  game.addEntity(new Post(V([-8, 10])));
  game.addEntity(new Post(V([-4, 10])));
  game.addEntity(new Post(V([0, 10])));
  game.addEntity(new Post(V([4, 10])));
  game.addEntity(new Post(V([8, 10])));
  game.addEntity(new Post(V([12, 10])));

  game.addEntity(new Gate(V([28, 26.5]), V([24.5, 29.5]), -degToRad(180)));
  game.addEntity(new Gate(V([28, 43.5]), V([24.5, 46.5]), -degToRad(180)));

  // outer walls
  game.addEntity(new Wall(V([-24, 0]), V([-24, 100])));
  game.addEntity(new Wall(V([24, 30]), V([24, 42])));
  game.addEntity(new Wall(V([24, 47]), V([24, 100])));
  game.addEntity(new Wall(V([28, 24]), V([28, 100])));

  // triangles
  game.addEntity(new Flipper(V([19.5, 50.5]), "right", 4));
  game.addEntity(
    new MultiWall([V([-24, 44]), V([-20, 50]), V([-20, 53]), V([-24, 56])])
  );
  game.addEntity(
    new MultiWall([V([24, 47]), V([20, 50]), V([20, 53]), V([24, 56])])
  );

  // Slingshots/inlanes
  game.addEntity(new Slingshot(V([16, 68]), V([9, 84]), 0.7));
  game.addEntity(new Slingshot(V([-16, 68]), V([-9, 84]), 0.7, true));
  game.addEntity(new MultiWall([V([16, 68]), V([16, 79]), V([9, 84])]));
  game.addEntity(new MultiWall([V([-16, 68]), V([-16, 79]), V([-9, 84])]));

  // Outlanes
  game.addEntity(new MultiWall([V([-20, 60]), V([-20, 82]), V([-8, 90])]));
  game.addEntity(new MultiWall([V([20, 60]), V([20, 82]), V([8, 90])]));
  game.addEntity(new MultiWall([V([-24, 88]), V([-4, 100])]));
  game.addEntity(new MultiWall([V([24, 88]), V([4, 100])]));
  game.addEntity(new Drain(V([-4, 100]), V([4, 100])));

  game.addEntity(new Flipper(V([-8, 90.25]), "left", 6.2));
  game.addEntity(new Flipper(V([8, 90.25]), "right", 6.2));

  game.addEntity(
    new CurveWall(new Bezier({ x: 0, y: 0 }, { x: 28, y: 0 }, { x: 28, y: 24 }))
  );
  game.addEntity(
    new CurveWall(
      new Bezier({ x: 0, y: 0 }, { x: -24, y: 0 }, { x: -24, y: 24 })
    )
  );
}
