import {
  Bodies,
  Body,
  Engine,
  Events,
  IBodyDefinition,
  Render,
  World
} from "matter-js";
import { range } from "./util";
import { createSynth } from "./synthCreator";

export const createWorld = () => {
  const { play, generateRandomKey, generateRandomDuration } = createSynth();
  const engine = Engine.create({});
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;

  const width = document.body.clientWidth;
  const height = document.body.clientHeight;

  const render = Render.create({
    canvas,
    engine,
    options: {
      width,
      height
    }
  });

  const gridSize = 100;

  for (const gridY of range(Math.floor(height / gridSize))) {
    for (const gridX of range(
      Math.floor(width / gridSize) + (gridY % 2 === 0 ? 0 : 1)
    )) {
      const x =
        gridX * gridSize + gridSize / 4 + (gridY % 2 === 0 ? gridSize / 2 : 0);
      const y = gridY * gridSize + gridSize / 2;
      const wallOption: IBodyDefinition = {
        isStatic: true,
        angle: -Math.PI / 3 + (Math.random() * Math.PI) / 3,
        label: `wall_${generateRandomKey()}`
      };
      const wall =
        (gridX + gridY) % 4 === 0
          ? Bodies.circle(x, y, gridSize / 5, wallOption)
          : Bodies.polygon(x, y, 3, gridSize / 4, wallOption);

      World.add(engine.world, wall);
    }
  }

  const balls: { [id: number]: Body } = {};
  const addBall = () => {
    const ball = Bodies.circle(width / 4 + (Math.random() * width) / 2, 0, 10, {
      label: `ball_${generateRandomDuration()}`,
      restitution: 0.9,
      friction: 0,
      density: 1000
    });

    balls[ball.id] = ball;
    World.add(engine.world, ball);
  };
  for (const i of range(4)) {
    setTimeout(addBall, 500 * i);
  }

  Engine.run(engine);
  Render.run(render);

  Events.on(engine, "collisionStart", event => {
    const bodyA = event.pairs?.[0].bodyA;
    const bodyB = event.pairs?.[0].bodyB;

    const ball = bodyA.label.startsWith("ball")
      ? bodyA
      : bodyB.label.startsWith("ball")
      ? bodyB
      : undefined;
    const wall = bodyA.label.startsWith("wall")
      ? bodyA
      : bodyB.label.startsWith("wall")
      ? bodyB
      : undefined;

    if (ball && wall) {
      // const key = wall.label.split("wall_")[1];
      const duration = ball.label.split("ball_")[1];

      play(undefined, duration, ball.speed > 10 ? 1 : ball.speed / 10);
    }
  });

  Events.on(engine, "afterTick", () => {
    for (const [id, ball] of Object.entries(balls)) {
      if (
        ball.bounds.min.y > height ||
        ball.bounds.min.x < 0 ||
        ball.bounds.min.x > width
      ) {
        delete balls[id as any];
        World.remove(engine.world, ball, false);
        addBall();
      }
    }
  });
};
