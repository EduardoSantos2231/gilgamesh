import type { Platform, Modalitie } from "./imports.js";

export interface SearchConfig {
  term: string;
  area: string;
  location?: string;
  modalities: Modalitie[];
  platforms: Platform[];
}
