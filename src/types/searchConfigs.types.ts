import type { Platform, Modalitie } from "./imports.js";

export interface SearchConfig {
  location: string;
  modalities: Modalitie[];
  platforms: Platform[];
}
