import { BrowserManager, CsvExporter } from '@/utils/imports.js';
import { CathoScraper } from '@/scrappers/cathoScraper.js';
import type { Job, SearchConfig, } from '@/types/imports.js';
import { CieeScraper } from '@/scrappers/cieeScraper.js';
import { SolidesScraper } from '@/scrappers/solidesScraper.js';


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
          const jobs: Job[] = await cathoScraper.initScraper()
          CsvExporter.export(jobs, `vagas_catho_${getCurrentDate()}.csv`)
          break;

        case 'ciee':
          const cieeScraper = new CieeScraper(config, page)
          const cieeJobs: Job[] = await cieeScraper.initScraper()
          CsvExporter.export(cieeJobs, `vagas_ciee_${getCurrentDate()}.csv`)
          break;

        case 'solides':
          const solidesScraper = new SolidesScraper(config, page)
          const solidesJobs: Job[] = await solidesScraper.initScraper()
          CsvExporter.export(solidesJobs, `vagas_solides_${getCurrentDate()}.csv`)
          break;

        default:
          console.warn(`[Handler] Plataforma ${platform} ainda não suportada.`);
          await page.close();
      }
    } catch (error) {
      console.error(`[Handler] Erro ao processar ${platform}:`, error);
      if (!page.isClosed()) await page.close();
    }
  }
}
