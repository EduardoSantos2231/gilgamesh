import type { Platform, SearchConfig, Job, RegionKey } from "@/types/imports.js"
import { SUPPORTED_REGIONS } from "@/types/imports.js";
import { BaseScrapper } from "./baseScraper.js"
import type { Page } from "puppeteer"
import { logger } from "@/utils/imports.js";

export class CathoScraper extends BaseScrapper {
  private readonly scraperName: Platform = "catho";
  private readonly CATHO_BASE_URL = "https://www.catho.com.br/vagas";


  constructor(config: SearchConfig, page: Page) {
    super(config, page)
  }

  private readonly TI_AREA_IDENTIFIERS = ["51", "52"];

  private buildRegionalPath(): string {
    const regionKey = this.config.location as RegionKey;

    const region = SUPPORTED_REGIONS[regionKey];

    if (!region) {
      throw new Error(
        `[Catho] A localização "${regionKey}" não está mapeada no sistema. ` +
        `Verifique @/types/region.types.ts`
      );
    }

    return `/${region.state}/${region.city}/`;
  }
  private buildSearchFilters(): string {
    const searchParams = new URLSearchParams();

    this.TI_AREA_IDENTIFIERS.forEach((id, index) => {
      searchParams.append(`area_id[${index}]`, id);
    });

    const DAYS_THRESHOLD = "30";
    searchParams.append("lastDays", DAYS_THRESHOLD);

    return `?${searchParams.toString()}`;
  }

  private generateTargetUrl(): string {
    const regionalPath = this.buildRegionalPath();
    const filterQueryString = this.buildSearchFilters();

    // Montagem final: Base + Local + Termo + Filtros
    const finalRequestUrl = `${this.CATHO_BASE_URL}${regionalPath}${filterQueryString}`;

    return finalRequestUrl;
  }

  async initScrapper(): Promise<Job[]> {
    this.showInitMessage(this.scraperName);

    const targetUrl = this.generateTargetUrl();
    logger.info(`[Catho] Alvo definido: ${targetUrl}`);

    try {
      await this.acessUrl(targetUrl);

      // 1. Espera o seletor principal de vagas carregar
      await this.page.waitForSelector('article', { timeout: 10000 });

      // 2. Extração usando a interface Job
      const jobs = await this.page.$$eval('article', (elements) => {
        return elements.map(el => {
          const titleElement = el.querySelector('h2 a');
          const companyElement = el.querySelector('p'); // Nome da empresa

          // Captura o local (geralmente fica após o nome da empresa ou em um span)
          const locationText = el.querySelector('button[title*="vagas em"]')?.textContent;

          return {
            title: titleElement?.innerText?.trim() || 'Título não disponível',
            company: companyElement?.innerText?.trim() || 'Empresa Confidencial',
            location: locationText?.trim() || 'Salvador/BA',
            modality: 'Presencial/Híbrido', // A Catho as vezes esconde isso, deixamos um padrão
            link: titleElement?.href || '',
          };
        });
      });

      logger.success(`[Catho] Extração concluída: ${jobs.length} vagas encontradas.`);
      return jobs as Job[];
    } catch (error) {
      logger.error(`[Catho] Falha na extração: ${error}`);
      return [];
    } finally {
      await this.closePage();
    }
  }
}
