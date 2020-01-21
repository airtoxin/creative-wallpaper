import { PolySynth, TransportTime, Transport, Synth, Loop } from "tone";
import { choose } from "./util";

export const createSynth = () => {
  const synth = new PolySynth(Synth).toDestination();
  const chords = [
    ["C", "E", "G"],
    ["A", "C", "E"],
    ["D", "F", "A"],
    ["G", "B", "D"]
  ];
  let chordIndex = 0;

  new Loop(() => {
    chordIndex += 1;
    chordIndex %= chords.length;
  }, "1m").start();

  const generateRandomKey = (): string => {
    const keys = chords[chordIndex];
    const key = keys[Math.floor(Math.random() * keys.length)];
    const octave = 4 + Math.floor(Math.random() * 3);

    return `${key}${octave}`;
  };

  const generateRandomDuration = (): string => {
    return choose(["2n", "4n", "8n", "16n"]);
  };

  Transport.loopEnd = "1m";
  Transport.loop = false;
  Transport.toggle();

  const play = (
    key: string = generateRandomKey(),
    duration: string = generateRandomDuration(),
    velocity: number
  ) => {
    Transport.schedule(time => {
      synth.triggerAttackRelease(key, duration, time, velocity);
    }, TransportTime("@16n"));
  };

  return {
    play,
    generateRandomKey,
    generateRandomDuration
  };
};
