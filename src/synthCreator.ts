import { Synth } from "tone";

export const createSynth = (): Synth => {
  const synth = new Synth().toDestination();
  synth.triggerAttackRelease("C4", "16n");

  return synth;
};
