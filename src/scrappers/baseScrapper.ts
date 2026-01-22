import type { Platform, SearchConfig } from "@/types/imports.js";
import type { Page } from "puppeteer";

export abstract class BaseScrapper {
  constructor(public scrapperName: Platform, public config: SearchConfig, public page: Page) { }

}
