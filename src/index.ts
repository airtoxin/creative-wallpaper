import { Synth } from "tone";
import { World, Edge, Vec2, Circle } from "planck-js";
import Renderer, { Runner } from "planck-renderer";

const synth = new Synth().toDestination();

synth.triggerAttackRelease("C4", "16n");

const canvas = document.querySelector("#root") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

const world = new World(Vec2(0, -10));
const renderer = new Renderer(world, ctx);

const runner = new Runner(world, {
  // default settings
  speed: 1,
  fps: 60
});

// init world entities
world.createBody().createFixture(Edge(Vec2(-40.0, 0.0), Vec2(40.0, 0.0)));
world.createDynamicBody(Vec2(0.0, 4.5)).createFixture(Circle(0.5), 10.0);
world.createDynamicBody(Vec2(0.0, 10.0)).createFixture(Circle(5.0), 10.0);

runner.start(() => {
  renderer.renderWorld();
});
