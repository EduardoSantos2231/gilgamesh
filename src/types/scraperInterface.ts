import type { Job } from "./job.types.js";

export interface IScraper {
  initScraper(): Promise<Job[]>
}
