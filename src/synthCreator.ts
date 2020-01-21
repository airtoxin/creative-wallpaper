import { Limiter, Loop, MembraneSynth, PluckSynth, PolySynth, Synth, Time, Transport, TransportTime } from "tone";
import { choose } from "./util";

export const createSynth = () => {
  const limiter = new Limiter(-1).toDestination();
  const synth = new PolySynth(Synth, {
    volume: -8,
    oscillator: {
      type: "triangle8"
    },
    envelope: {
      attack: 0.001,
      decay: 0.1,
      sustain: 0.01,
      release: 0.1
    }
  }).connect(limiter);
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

  const kick = new MembraneSynth({volume: -4}).connect(limiter);
  new Loop(() => {
    Transport.schedule(time => {
      kick.triggerAttackRelease("C0", 0.005, time);
    }, TransportTime("@4n"));
  }, "4n").start();

  const hihat = new PluckSynth({volume: -10}).connect(limiter);
  new Loop(() => {
    Transport.schedule(time => {
      hihat.triggerAttackRelease("C5", 0.005, time + Time("8n").toSeconds());
    }, TransportTime("@4n"));
  }, "4n").start();

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
