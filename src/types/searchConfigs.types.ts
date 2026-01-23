import type { Platform, Modalitie } from "./imports.js";

export interface SearchConfig {
  area: string;
  location: string;
  modalities: Modalitie[];
  platforms: Platform[];
}
