import type { Platform } from "../interfaces/platform.type.js";
import type { SearchConfig } from "../types/searchConfigs.types.js";
import type { IBrowserContext, IScraper } from "../interfaces/index.js";
import type { Job } from "../types/job.types.js";
import type { Page } from "puppeteer";
import { logger } from "../utils/logger.utils.js";

export abstract class BaseScraper implements IScraper {
  protected readonly MAX_PAGES = 2;

  constructor(
    protected config: SearchConfig,
    protected browserContext: IBrowserContext
  ) {}

  abstract readonly platform: Platform;
  abstract collect(): Promise<Job[]>;

  protected async getPage(): Promise<Page> {
    return await this.browserContext.getPage();
  }

  protected showInitMessage(): void {
    logger.success(`Iniciando ${this.platform}`);
    logger.success(`Modalidade: ${this.config.modalities.join(", ")}`);
  }

  protected async acessUrl(url: string): Promise<void> {
    const page = await this.getPage();
    await page.goto(url, { waitUntil: "domcontentloaded" });
  }

  protected async withPage<T>(fn: (page: Page) => Promise<T>): Promise<T> {
    const page = await this.getPage();
    try {
      return await fn(page);
    } finally {
      await page.close();
    }
  }

  async execute(): Promise<Job[]> {
    this.showInitMessage();
    return await this.collect();
  }
}
