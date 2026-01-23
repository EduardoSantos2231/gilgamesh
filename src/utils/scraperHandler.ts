import { BrowserManager } from '@/utils/imports.js';
import { CathoScraper } from '@/scrappers/cathoScraper.js';
import type { SearchConfig, } from '@/types/imports.js';

export async function scraperHandler(
  config: SearchConfig,
  browserInstance: BrowserManager
) {
  for (const platform of config.platforms) {

    const { context, page } = await browserInstance.createPage();

    try {
      console.log(`[Handler] Iniciando varredura na plataforma: ${platform}`);

      switch (platform.toLowerCase()) {
        case 'catho':
          const cathoScraper = new CathoScraper(config, page)
          await cathoScraper.initScrapper()
          break;

        case 'ciee':
          // await CieeScrapper.initScraping(page, config);
          break;

        default:
          console.warn(`[Handler] Plataforma ${platform} ainda não suportada.`);
          await page.close(); // Não esquecer de fechar a página se não usar
      }
    } catch (error) {
      console.error(`[Handler] Erro ao processar ${platform}:`, error);
      // Garantimos o fechamento da página mesmo em erro se o Scraper falhar
      if (!page.isClosed()) await page.close();
    }
  }
}
