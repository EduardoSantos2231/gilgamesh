import type { Platform } from "@/types/plataforms.types.js"
import { BaseScrapper } from "./baseScrapper.js"
import type { SearchConfig } from "@/types/searchConfigs.types.js"
import type { Page } from "puppeteer"

export class CathoScrapper extends BaseScrapper {
  constructor(scrapperName: Platform, config: SearchConfig, page: Page) {
    super(scrapperName, config, page)
    this.scrapperName = "catho"
  }
}
