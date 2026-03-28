import { cbseData } from './cbse';
import type { BoardData } from './schema';

export const boards: Record<string, BoardData> = {
  cbse: cbseData,
  // Extendable for state boards like:
  // bihar: biharData,
};
