import type { Platform } from "../interfaces/platform.type.js";
import type { Job } from "../types/job.types.js";
import type { Page } from "puppeteer";
import { BaseScraper } from "./baseScraper.js";
import { SolidesJobAdapter } from "../adapters/solides-job.adapter.js";
import { SUPPORTED_REGIONS } from "../constants/supportedRegions.js";
import { logger } from "../utils/logger.utils.js";
import type { RegionKey } from "../types/regions.types.js";
import { MODALITY_TO_SOLIDES } from "../types/modalities.types.js";

interface SolidesApiResponse {
  success: boolean;
  errors: string[];
  data: {
    totalPages: number;
    currentPage: number;
    count: number;
    data: unknown[];
  };
}

export class SolidesScraper extends BaseScraper {
  readonly platform: Platform = "solides";
  private readonly adapter = new SolidesJobAdapter();

  private buildTargetUrl(pageNumber: number, contractType: string): string {
    const region = SUPPORTED_REGIONS[this.config.location as RegionKey];

    const params = new URLSearchParams({
      contractsType: contractType,
      occupationAreas: "tecnologia",
      page: pageNumber.toString(),
      title: "",
      locations: region.solidesLocations,
      take: "14",
    });

    return `https://apigw.solides.com.br/jobs/v3/portal-vacancies-new?${params.toString()}`;
  }

  async collect(page: Page): Promise<Job[]> {
    const allJobs: Job[] = [];

    await page.goto("https://vagas.solides.com.br", { waitUntil: "domcontentloaded" });

    try {
      for (const modality of this.config.modalities) {
        const contractType = MODALITY_TO_SOLIDES[modality];
        logger.info(`[Solides] Coletando: ${modality}...`);

        const modalityJobs = await this.collectByModality(page, contractType);
        allJobs.push(...modalityJobs);

        const isLastModality = this.config.modalities.indexOf(modality) === this.config.modalities.length - 1;
        if (!isLastModality) {
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
    }
  }

  private async collectByModality(page: Page, contractType: string): Promise<Job[]> {
    const allJobs: Job[] = [];
    let currentPage = 1;
    let hasNextPage = true;

    while (hasNextPage) {
      const url = this.buildTargetUrl(currentPage, contractType);
      logger.info(`[Solides] Página ${currentPage} (${contractType})...`);

      const response = await page.evaluate(async (endpoint: string) => {
        const res = await fetch(endpoint);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
      }, url) as SolidesApiResponse;

      const rawContent = response.data?.data || [];
      const totalPages = response.data?.totalPages || 1;

      if (rawContent.length > 0) {
        const jobs = this.adapter.adaptMany(rawContent as Parameters<typeof this.adapter.adaptMany>[0]);
        allJobs.push(...jobs);
        logger.success(`[Solides] ${contractType}: +${rawContent.length} vagas`);
      }

      hasNextPage = currentPage < totalPages;
      currentPage++;

      if (hasNextPage) {
        await new Promise((r) => setTimeout(r, 1500));
      }
    }

    return allJobs;
  }
}
