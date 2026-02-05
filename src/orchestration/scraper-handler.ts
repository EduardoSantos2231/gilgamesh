import { ScraperFactory } from "../factories/scraper.factory.js";
import { BrowserContextImpl } from "../infrastructure/browser/browser-context.impl.js";
import { CsvExporter } from "../utils/export.utils.js";
import type { SearchConfig } from "../types/searchConfigs.types.js";
import { logger } from "../utils/logger.utils.js";

function getCurrentDate(): string {
  const date = new Date(Date.now());
  return date.toLocaleDateString("pt-BR").replaceAll("/", "-");
}

export class ScraperHandler {
  async execute(config: SearchConfig): Promise<void> {
    const browserContext = new BrowserContextImpl();
    await browserContext.init();

    try {
      for (const platform of config.platforms) {
        logger.info(`[Handler] Iniciando varredura na plataforma: ${platform}`);

        const scraper = ScraperFactory.create(platform, config, browserContext);
        const jobs = await scraper.execute();

        CsvExporter.export(jobs, `vagas_${platform}_${getCurrentDate()}.csv`);
      }
    } finally {
      await browserContext.close();
    }
  }
}
