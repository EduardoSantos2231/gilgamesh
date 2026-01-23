import { BrowserManager, CsvExporter } from '@/utils/imports.js';
import { CathoScraper } from '@/scrappers/cathoScraper.js';
import type { Job, SearchConfig, } from '@/types/imports.js';


function getCurrentDate(): string {
  const date = new Date(Date.now());
  return date.toLocaleDateString("pt-BR").replaceAll("/", "-");

}


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
          const jobs: Job[] = await cathoScraper.initScrapper()
          CsvExporter.export(jobs, `vagas_catho_${getCurrentDate()}.csv`)

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
      if (!page.isClosed()) await page.close();
    }
  }
}
