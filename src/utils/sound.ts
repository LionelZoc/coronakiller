import { Audio } from "expo-av";

// Define constants
export const SOUND_TYPES = {
  HIT: "hit",
  MISS: "miss",
} as const;

// Extract a type from the constants
export type SoundType = (typeof SOUND_TYPES)[keyof typeof SOUND_TYPES];

// Define the playSound function
export const playSound = async (
  type: SoundType,
  soundOn: boolean,
  sound: Audio.Sound,
): Promise<void> => {
  if (!soundOn) return;

  if (type === SOUND_TYPES.HIT) {
    await sound.stopAsync();
    await sound.playAsync();
  }
  //   else if (missSound) {
  //     await missSound.stopAsync();
  //     await missSound.playAsync();
  //   }
};
