import { PolySynth, TransportTime, Transport } from "tone";

export const createSynth = () => {
  const synth = new PolySynth().toDestination();

  const generateRandomKey = (): string => {
    const keys = "CDFGA".split("");
    const key = keys[Math.floor(Math.random() * keys.length)] + "#";
    const octave = 3 + Math.floor(Math.random() * 2);

    return `${key}${octave}`;
  };

  Transport.loopEnd = "1m";
  Transport.loop = false;
  Transport.toggle();

  const play = (key: string = generateRandomKey()) => {
    Transport.schedule(time => {
      synth.triggerAttackRelease(key, "8n", time);
    }, TransportTime("@8n"));
  };

  return {
    play,
    generateRandomKey
  };
};
