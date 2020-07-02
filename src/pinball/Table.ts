import Game from "../core/Game";
import { V } from "../core/Vector";
import Ball from "./playfield/Ball";
import Boundary from "./playfield/Boundary";
import Bumper from "./playfield/Bumper";
import Flipper from "./playfield/Flipper";
import Slingshot from "./playfield/Slingshot";
import Wall from "./playfield/Wall";
import Scoreboard from "../Scoreboard";
import Plunger from "./playfield/Plunger";
import Speedometer from "../Speedometer";
import MultiWall from "./playfield/MultiWall";
import Drain from "./playfield/Drain";

export function setupTable(game: Game) {
  game.camera.center(V([0, 50]));
  game.camera.z = 7;

  game.addEntity(new Scoreboard());
  game.addEntity(new Speedometer());

  game.addEntity(new Boundary(0, 100, -24, 28));

  game.addEntity(new Ball(V([26, 94])));
  game.addEntity(new Plunger(V([26, 97.5])));

  game.addEntity(new Bumper(V([-10, 35])));
  game.addEntity(new Bumper(V([-5, 30])));
  game.addEntity(new Bumper(V([0, 35])));
  game.addEntity(new Bumper(V([5, 30])));
  game.addEntity(new Bumper(V([10, 35])));

  game.addEntity(new Slingshot(V([16, 68]), V([9, 84]), 0.7));
  game.addEntity(new Slingshot(V([-16, 68]), V([-9, 84]), 0.7, true));
  game.addEntity(new MultiWall([V([16, 68]), V([16, 79]), V([9, 84])]));
  game.addEntity(new MultiWall([V([-16, 68]), V([-16, 79]), V([-9, 84])]));

  // Outlanes
  game.addEntity(new MultiWall([V([-20, 60]), V([-20, 82]), V([-8, 90])]));
  game.addEntity(new MultiWall([V([20, 60]), V([20, 82]), V([8, 90])]));
  game.addEntity(new MultiWall([V([-24, 88]), V([-4, 100])]));
  game.addEntity(new MultiWall([V([24, 88]), V([4, 100])]));

  game.addEntity(new Flipper(V([-8, 90.25]), "left", 6.2));
  game.addEntity(new Flipper(V([8, 90.25]), "right", 6.2));

  game.addEntity(new Wall(V([-24, 0]), V([-24, 100])));
  game.addEntity(new Wall(V([24, 30]), V([24, 100])));
  game.addEntity(new Wall(V([28, 24]), V([28, 100])));

  game.addEntity(new Drain(V([-4, 100]), V([4, 100])));

  game.addEntity(
    new MultiWall([
      V([28, 24]),
      V([24, 12]),
      V([20, 8]),
      V([16, 4]),
      V([12, 2]),
      V([8, 1.1]),
      V([4, 0.5]),
      V([0, 0]),
    ])
  );
}
