import type { Platform, SearchConfig, Job, RegionKey } from "@/types/imports.js";
import { ScraperError, SUPPORTED_REGIONS } from "@/types/imports.js";
import { BaseScrapper } from "./baseScraper.js";
import type { Page } from "puppeteer";
import { logger } from "@/utils/imports.js";

export class CathoScraper extends BaseScrapper {
  private readonly scraperName: Platform = "catho";
  private readonly CATHO_BASE_URL = "https://www.catho.com.br/vagas";
  private readonly TI_AREA_IDENTIFIERS = ["51", "52"];

  constructor(config: SearchConfig, page: Page) {
    super(config, page);
  }


  private buildRegionalPath(): string {
    const regionKey = this.config.location as RegionKey;
    const data = SUPPORTED_REGIONS[regionKey];


    return `/${data.state}/${data.city}/`;
  }


  private buildSearchFilters(pageNumber: number): string {
    const searchParams = new URLSearchParams();
    searchParams.append("page", pageNumber.toString());

    this.TI_AREA_IDENTIFIERS.forEach((id, index) => {
      searchParams.append(`area_id[${index}]`, id);
    });

    searchParams.append("lastDays", "30");
    return `?${searchParams.toString()}`;
  }


  private generateTargetUrl(pageNumber: number): string {
    const regionalPath = this.buildRegionalPath();
    const filterQueryString = this.buildSearchFilters(pageNumber);
    return `${this.CATHO_BASE_URL}${regionalPath}${filterQueryString}`;
  }


  private async extractJobsFromPage(): Promise<Job[]> {
    return await this.page.$$eval('article', (elements) => {
      return elements.map(el => {
        const titleElement = el.querySelector('h2 a');
        const companyElement = el.querySelector('p');
        const locationElement = el.querySelector('a[href*="/vagas/"][title*=" - "]');

        const rawLocation = locationElement?.textContent?.trim() || 'Localização não informada';
        const cleanLocation = rawLocation.replace(/\s\(\d+\)$/, '');

        return {
          title: titleElement?.innerText?.trim() || 'Título não disponível',
          company: companyElement?.innerText?.trim() || 'Empresa Confidencial',
          location: cleanLocation,
          modality: 'unknown',
          link: titleElement?.href || '',
        };
      });
    }) as Job[];
  }


  async initScrapper(): Promise<Job[]> {
    this.showInitMessage(this.scraperName);

    const MAX_PAGES = 2;
    const allJobs: Job[] = [];

    try {
      for (let currentPage = 1; currentPage <= MAX_PAGES; currentPage++) {
        const targetUrl = this.generateTargetUrl(currentPage);
        logger.info(`[CATHO] Varrendo página ${currentPage}: ${targetUrl}`);

        await this.acessUrl(targetUrl);

        try {
          await this.page.waitForSelector('article', { timeout: 5000 });

          const jobsFromPage = await this.extractJobsFromPage();
          allJobs.push(...jobsFromPage);

          logger.success(`[CATHO] Página ${currentPage}: ${jobsFromPage.length} vagas encontradas.`);

          // Delay humano entre as páginas
          if (currentPage < MAX_PAGES) {
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        } catch (err) {
          throw new ScraperError("[CATHO] : Nenhuma vaga encontrada!")
        }
      }

      return allJobs;
    } catch (error) {
      logger.error(`[CATHO] Erro crítico na operação: ${error}`);
      return allJobs;
    } finally {
      await this.closePage();
      logger.info(`[CATHO] scraper finalizado.`);
    }
  }
}
