import type { Platform } from "../interfaces/platform.type.js";
import type { Modalitie } from "./modalities.types.js";

export interface SearchConfig {
  location: string;
  modalities: Modalitie[];
  platforms: Platform[];
}
