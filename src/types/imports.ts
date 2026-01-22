import type { Modalitie } from "./modalities.types.js";
import type { Platform } from "./plataforms.types.js";
import type { InquirerError } from "./error.types.js";
import type { Job } from "./job.types.js";
import { ScraperError, ValidationError, InitError } from "./error.types.js";
import type { SearchConfig } from "./searchConfigs.types.js";

export {
  type Platform, type SearchConfig,
  type Modalitie, type InquirerError,
  type Job,
  ScraperError, ValidationError,
  InitError,
}
