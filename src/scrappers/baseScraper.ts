import type { Platform, SearchConfig } from "@/types/imports.js";
import { logger } from "@/utils/imports.js";
import type { Page } from "puppeteer";

export abstract class BaseScraper {
  constructor(protected config: SearchConfig, protected page: Page) { }

  protected showInitMessage(scraperName: Platform) {
    logger.success(`Iniciando ${scraperName}`)
    logger.success(`Modalidade: ${this.config.modalities}`)
  }

  protected async acessUrl(url: string) {
    await this.page.goto(url, { waitUntil: "domcontentloaded" })
  }

  protected async closePage() {
    return await this.page.close()
  }
}
