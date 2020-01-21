import { Bodies, Engine, Events, Render, World } from "matter-js";
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
      World.add(
        engine.world,
        Bodies.polygon(
          gridX * gridSize +
            gridSize / 4 +
            (gridY % 2 === 0 ? gridSize / 2 : 0),
          gridY * gridSize + gridSize / 2,
          3,
          gridSize / 4,
          {
            isStatic: true,
            angle: Math.random() * Math.PI * 2,
            label: `wall_${generateRandomKey()}`
          }
        )
      );
    }
  }

  setInterval(() => {
    const ball = Bodies.circle(width / 4 + (Math.random() * width) / 2, 0, 10, {
      label: `ball_${generateRandomDuration()}`,
      restitution: 1
    });

    World.add(engine.world, ball);
  }, 2000);

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
      const key = wall.label.split("wall_")[1];
      const duration = ball.label.split("ball_")[1];

      play(undefined, duration, ball.speed > 10 ? 1 : ball.speed / 10);
    }
  });
};
