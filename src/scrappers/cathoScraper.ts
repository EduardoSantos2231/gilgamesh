import type { Platform } from "../interfaces/platform.type.js";
import type { Job } from "../types/job.types.js";
import type { Page } from "puppeteer";
import { SUPPORTED_REGIONS } from "../constants/supportedRegions.js";
import { BaseScraper } from "./baseScraper.js";
import { CathoJobAdapter } from "../adapters/catho-job.adapter.js";
import type { RegionKey } from "../types/regions.types.js";
import { logger } from "../utils/logger.utils.js";

export class CathoScraper extends BaseScraper {
  readonly platform: Platform = "catho";
  private readonly adapter = new CathoJobAdapter();
  private readonly TI_AREA_IDENTIFIERS = ["51", "52"];

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
    return `${"https://www.catho.com.br/vagas"}${regionalPath}${filterQueryString}`;
  }

  private async extractJobsFromPage(page: Page): Promise<Job[]> {
    const containerSelector = "#search-result ul > li";

    const containerExists = await page.$(containerSelector);
    if (!containerExists) {
      return [];
    }

    const elements = await page.$$eval(containerSelector, (els) =>
      els.map((el) => {
        const titleEl = el.querySelector("h2 a");
        if (!titleEl) return null;
        const title = titleEl.innerText?.trim() || "Título não disponível";
        const link = titleEl.href || "";

        const companyEl = el.querySelector("header p");
        const company = companyEl?.textContent?.trim() || "Empresa Confidencial";

        const locationEl = el.querySelector('a[title*=" - "]');
        let location = locationEl?.getAttribute("title") || locationEl?.textContent || "Localização não informada";

        location = location.replace(/\s\(\d+\)$/, "").trim();

        let modality = "Presencial";
        const lowerTitle = title.toLowerCase();
        if (lowerTitle.includes("trabalhe de casa") || lowerTitle.includes("work from home") || lowerTitle.includes("remoto")) {
          modality = "Remoto";
        } else if (lowerTitle.includes("híbrido")) {
          modality = "Híbrido";
        }

        const timeEl = el.querySelector("time");
        const postedAt = timeEl?.textContent?.trim();

        return {
          title,
          company,
          location,
          link,
          modality,
          postedAt
        };
      })
    );

    const validJobs = elements.filter((job) => job !== null);
    return this.adapter.adaptMany(validJobs as any);
  }

  async collect(page: Page): Promise<Job[]> {
    const allJobs: Job[] = [];

    try {
      for (let currentPage = 1; currentPage <= this.MAX_PAGES; currentPage++) {
        const targetUrl = this.generateTargetUrl(currentPage);
        logger.info(`[CATHO] Coletando página ${currentPage}...`);

        await page.goto(targetUrl, { waitUntil: "domcontentloaded" });

        const jobsFromPage = await this.extractJobsFromPage(page);

        if (jobsFromPage.length === 0) {
          logger.warn("[CATHO] Nenhuma vaga encontrada nesta página.");
        } else {
          allJobs.push(...jobsFromPage);
          logger.success(`[CATHO] Página ${currentPage}: ${jobsFromPage.length} vagas encontradas.`);
        }

        if (currentPage < this.MAX_PAGES) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      }

      if (allJobs.length === 0) {
        logger.warn("[CATHO] Nenhuma vaga encontrada.");
      } else {
        logger.success(`[CATHO] Total: ${allJobs.length} vagas coletadas.`);
      }

      return allJobs;
    } catch (error) {
      logger.error(`[CATHO] Erro crítico: ${error}`);
      return allJobs;
    }
  }
}
