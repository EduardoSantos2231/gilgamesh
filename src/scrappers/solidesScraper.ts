import type { Platform } from "../interfaces/platform.type.js";
import type { Job } from "../types/job.types.js";
import { BaseScraper } from "./baseScraper.js";
import { SolidesJobAdapter } from "../adapters/solides-job.adapter.js";
import { SUPPORTED_REGIONS } from "../constants/supportedRegions.js";
import { logger } from "../utils/logger.utils.js";
import type { RegionKey } from "../types/regions.types.js";

interface SolidesApiResponse {
  data?: {
    data?: unknown[];
    totalPages?: number;
  };
}

export class SolidesScraper extends BaseScraper {
  readonly platform: Platform = "solides";
  private readonly adapter = new SolidesJobAdapter();
  private readonly BASE_URL = "https://apigw.solides.com.br/jobs/v3/portal-vacancies-new";

  private buildTargetUrl(pageNumber: number): string {
    const region = SUPPORTED_REGIONS[this.config.location as RegionKey];

    const locationParam = `${region.apiName} - ${region.state.toUpperCase()}`;

    const query = new URLSearchParams({
      occupationAreas: "tecnologia",
      page: pageNumber.toString(),
      title: "",
      locations: locationParam,
      take: "30",
    });

    return `${this.BASE_URL}?${query.toString()}`;
  }

  async collect(): Promise<Job[]> {
    const allJobs: Job[] = [];
    let currentPage = 1;
    let hasNextPage = true;

    const page = await this.getPage();
    await page.goto("https://vagas.solides.com.br", { waitUntil: "domcontentloaded" });

    try {
      while (hasNextPage && currentPage <= this.MAX_PAGES) {
        const url = this.buildTargetUrl(currentPage);
        logger.info(`[Solides] Coletando página ${currentPage}...`);

        try {
          const rawResponse = await page.evaluate(async (endpoint: string) => {
            const res = await fetch(endpoint);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return await res.json();
          }, url) as SolidesApiResponse;

          const rawContent = rawResponse.data?.data || [];
          const totalPages = rawResponse.data?.totalPages || 1;

          if (rawContent.length > 0) {
            const jobs = this.adapter.adaptMany(rawContent as Parameters<typeof this.adapter.adaptMany>[0]);
            allJobs.push(...jobs);
            logger.success(`[Solides] Página ${currentPage}: ${rawContent.length} vagas encontradas.`);
          } else {
            logger.warn("[Solides] Nenhuma vaga encontrada nesta página.");
          }

          hasNextPage = currentPage < totalPages;
        } catch (err) {
          logger.warn(`[Solides] Erro ao coletar página ${currentPage}: ${err}`);
          hasNextPage = false;
        }

        currentPage++;

        if (hasNextPage && currentPage <= this.MAX_PAGES) {
          await new Promise((r) => setTimeout(r, 1500));
        }
      }

      if (allJobs.length === 0) {
        logger.warn("[Solides] Nenhuma vaga encontrada.");
      } else {
        logger.success(`[Solides] Total: ${allJobs.length} vagas coletadas.`);
      }

      return allJobs;
    } catch (error) {
      logger.error(`[Solides] Erro crítico: ${error}`);
      return allJobs;
    } finally {
      await page.close();
    }
  }
}
