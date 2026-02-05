import type { Page } from "puppeteer";

export interface IBrowserContext {
  getPage(): Promise<Page>;
  close(): Promise<void>;
}
