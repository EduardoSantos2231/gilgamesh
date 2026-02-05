import type { Job } from "../types/job.types.js";
import type { Platform } from "./platform.type.js";

export interface IScraper {
  readonly platform: Platform;
  collect(): Promise<Job[]>;
}
