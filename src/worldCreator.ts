import { Bodies, Engine, Events, Render, World } from "matter-js";
import { range } from "./util";
import { createSynth } from "./synthCreator";

export const createWorld = () => {
  const {play, generateRandomKey} = createSynth();
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
    },
  });

  const gridSize = 150;

  for (const gridY of range(Math.floor(height / gridSize))) {
    for (const gridX of range(Math.floor(width / gridSize))) {
      World.add(engine.world, Bodies.polygon(
        gridX * gridSize + gridSize / 4 + (gridY % 2 === 0 ? gridSize / 2 : 0),
        gridY * gridSize + gridSize / 2,
        3,
        gridSize / 4,
        {
          isStatic: true,
          angle: Math.random() * Math.PI * 2,
          label: `wall_${generateRandomKey()}`
        }))
    }
  }

  setInterval(() => {
    const ball = Bodies.circle(Math.random() * width, 0, 10, {
      label: "ball",
      restitution: 1
    });

    World.add(engine.world, ball);
  }, 1000);

  Engine.run(engine);
  Render.run(render);

  Events.on(engine, "collisionStart", event => {
    const bodyA = event.pairs?.[0].bodyA;
    const bodyB = event.pairs?.[0].bodyB;

    const ball = bodyA.label === "ball" ? bodyA : bodyB.label === "ball" ? bodyB : undefined;
    const wall = bodyA.label.startsWith("wall") ? bodyA : bodyB.label.startsWith("wall") ? bodyB : undefined;

    if (ball && wall) {
      const key = wall.label.split("wall_")[1];

      play(key);
    }
  });
};
