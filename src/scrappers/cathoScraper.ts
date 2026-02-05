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
    const elements = await page.$$eval("article", (els) =>
      els.map((el) => {
        const titleEl = el.querySelector("h2 a");
        const companyEl = el.querySelector("p");
        const locationEl = el.querySelector("a[href*=\"/vagas/\"][title*=\" - \"]");

        return {
          title: titleEl?.innerText?.trim() || "Título não disponível",
          company: companyEl?.innerText?.trim() || "Empresa Confidencial",
          location: locationEl?.textContent?.trim() || "Localização não informada",
          link: titleEl?.href || "",
        };
      })
    );

    return this.adapter.adaptMany(elements);
  }

  async collect(): Promise<Job[]> {
    const allJobs: Job[] = [];

    try {
      for (let currentPage = 1; currentPage <= this.MAX_PAGES; currentPage++) {
        const targetUrl = this.generateTargetUrl(currentPage);
        logger.info(`[CATHO] Varrendo página ${currentPage}...`);
        await this.acessUrl(targetUrl);

        let jobsFromPage: Job[] = [];

        try {
          await this.withPage(async (page) => {
            await page.waitForSelector("article", { timeout: 9000 });
            jobsFromPage = await this.extractJobsFromPage(page);
          });

          if (jobsFromPage.length === 0) {
            logger.warn("[CATHO] Nenhuma vaga encontrada nesta página.");
          } else {
            allJobs.push(...jobsFromPage);
            logger.success(`[CATHO] Página ${currentPage}: ${jobsFromPage.length} vagas encontradas.`);
          }
        } catch {
          logger.warn("[CATHO] Timeout ou estrutura da página mudou.");
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
