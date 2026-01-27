import { type Job, type SearchConfig, type IScraper, type Platform, type RegionKey } from "@/types/imports.js";
import { BaseScraper } from "./baseScraper.js";
import type { Page } from "puppeteer";
import { SUPPORTED_REGIONS } from "@/constants/supportedRegions.js";
import { logger } from "@/utils/imports.js";
import { MAX_PAGES } from "@/constants/maxPages.js";

export class SolidesScraper extends BaseScraper implements IScraper {
  private readonly scraperName: Platform = "solides";
  private readonly API_BASE_URL = "https://apigw.solides.com.br/jobs/v3/portal-vacancies-new";


  constructor(config: SearchConfig, page: Page) {
    super(config, page);
  }


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

    return `${this.API_BASE_URL}?${query.toString()}`;
  }


  private async fetchApiData(url: string): Promise<any> {
    if (this.page.url() === 'about:blank') {
      await this.page.goto('https://vagas.solides.com.br', { waitUntil: 'domcontentloaded' });
    }
    return await this.page.evaluate(async (endpoint) => {
      const response = await fetch(endpoint)
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    }, url);
  }


  private mapToJobs(apiData: any[]): Job[] {
    return apiData.map((vaga) => {

      const initial = vaga.salary?.initialRange;
      const final = vaga.salary?.finalRange;

      return {
        title: vaga.title?.toUpperCase(),

        company: vaga.companyName,

        location: `${vaga.city.name} - ${vaga.state.code}`,

        modality: vaga.homeOffice ? "Remoto" : "Presencial",

        link: vaga.redirectLink,

        postedAt: vaga.createdAt,

        salary: (initial > 0 || final > 0) ? `R$ ${initial} - R$ ${final}` : "A combinar"
      };
    });
  }


  async initScraper(): Promise<Job[]> {
    this.showInitMessage(this.scraperName);
    const allJobs: Job[] = [];
    let currentPage = 1;
    let hasNextPage = true;

    try {
      while (hasNextPage && currentPage <= MAX_PAGES) {
        const url = this.buildTargetUrl(currentPage);
        logger.info(`[Solides] Coletando página ${currentPage}...`);

        const response = await this.fetchApiData(url);


        const rawContent = response.data?.data || [];
        const totalPages = response.data?.totalPages || 1;

        if (rawContent.length > 0) {
          allJobs.push(...this.mapToJobs(rawContent));
        }


        hasNextPage = currentPage < totalPages;
        currentPage++;

        if (hasNextPage && currentPage <= MAX_PAGES) {
          await new Promise(r => setTimeout(r, 1500));
        }
      }

      logger.success(`[Solides] Finalizado com ${allJobs.length} vagas.`);
      return allJobs;

    } catch (error) {
      logger.error(`[Solides] Erro no fluxo: \n${error}`);
      return allJobs;
    } finally {
      await this.closePage();
    }
  }
}
