import type { Platform } from "../interfaces/platform.type.js";
import type { Job } from "../types/job.types.js";
import type { CieeApiVaga } from "../adapters/ciee-job.adapter.js";
import { ScraperError } from "../types/error.types.js";
import { BaseScraper } from "./baseScraper.js";
import { CieeJobAdapter } from "../adapters/ciee-job.adapter.js";
import { SUPPORTED_REGIONS } from "../constants/supportedRegions.js";
import { logger } from "../utils/logger.utils.js";
import type { RegionKey } from "../types/regions.types.js";
import type { Page } from "puppeteer";

interface CieeApiResponse {
  last: boolean;
  content?: CieeApiVaga[];
}

export class CieeScraper extends BaseScraper {
  readonly platform: Platform = "ciee";
  private readonly adapter = new CieeJobAdapter();
  private readonly BASE_URL = "https://api.ciee.org.br/vagas/vitrine-vaga/publicadas";

  private buildTargetUrl(pageNumber: number): string {
    const regionKey = this.config.location as RegionKey;
    const { cieeCode } = SUPPORTED_REGIONS[regionKey];

    const query = new URLSearchParams({
      page: pageNumber.toString(),
      size: "30",
      sort: "codigoVaga,desc",
      codigoMunicipio: cieeCode || "",
      tipoVaga: "ESTAGIO",
    });

    return `${this.BASE_URL}?${query.toString()}`;
  }

  private async fetchApiData(page: Page, url: string): Promise<CieeApiResponse> {
    return await page.evaluate(async (endpoint: string) => {
      const response = await fetch(endpoint);
      if (!response.ok) throw new ScraperError(`Falha HTTP: ${response.status}`);
      return await response.json();
    }, url) as CieeApiResponse;
  }

  async collect(page: Page): Promise<Job[]> {
    const allJobs: Job[] = [];
    let currentPage = 0;
    let isLastPage = false;

    try {
      while (!isLastPage && currentPage < this.MAX_PAGES) {
        const url = this.buildTargetUrl(currentPage);
        logger.info(`[CIEE] Coletando página ${currentPage}...`);

        try {
          const data = await this.fetchApiData(page, url);
          isLastPage = data.last;
          const rawContent = data.content || [];

          if (rawContent.length > 0) {
            const jobs = this.adapter.adaptMany(rawContent);
            allJobs.push(...jobs);
            logger.success(`[CIEE] Página ${currentPage}: ${rawContent.length} vagas encontradas.`);
          } else {
            logger.warn("[CIEE] Nenhuma vaga encontrada nesta página.");
          }
        } catch (err) {
          logger.warn(`[CIEE] Erro ao coletar página ${currentPage}: ${err}`);
        }

        currentPage++;
        if (!isLastPage) await new Promise((r) => setTimeout(r, 1000));
      }

      if (allJobs.length === 0) {
        logger.warn("[CIEE] Nenhuma vaga encontrada.");
      } else {
        logger.success(`[CIEE] Total: ${allJobs.length} vagas coletadas.`);
      }

      return allJobs;
    } catch (error) {
      logger.error(`[CIEE] Erro crítico: ${error}`);
      return allJobs;
    }
  }
}
