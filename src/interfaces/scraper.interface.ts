import type { Job } from "../types/job.types.js";
import type { Platform } from "./platform.type.js";
import type { Page } from "puppeteer";

export interface IScraper {
  readonly platform: Platform;
  collect(page: Page): Promise<Job[]>;
  execute(): Promise<Job[]>;
}
