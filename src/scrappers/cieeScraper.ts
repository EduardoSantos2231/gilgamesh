import type { Job, SearchConfig, IScraper, Platform, RegionKey } from "@/types/imports.js";
import { BaseScraper } from "./baseScraper.js";
import type { Page } from "puppeteer";
import { SUPPORTED_REGIONS } from "@/constants/supportedRegions.js";
import { logger } from "@/utils/imports.js";
import { MAX_PAGES } from "@/constants/maxPages.js";


export class CieeScraper extends BaseScraper implements IScraper {
  private readonly scraperName: Platform = "ciee";
  private readonly API_BASE_URL = "https://api.ciee.org.br/vagas/vitrine-vaga/publicadas";


  constructor(config: SearchConfig, page: Page) {
    super(config, page);
  }


  private buildTargetUrl(pageNumber: number): string {
    const regionKey = this.config.location as RegionKey;
    const { cieeCode } = SUPPORTED_REGIONS[regionKey];

    const query = new URLSearchParams({
      page: pageNumber.toString(),
      size: "20",
      sort: "codigoVaga,desc",
      codigoMunicipio: cieeCode || "",
      tipoVaga: "ESTAGIO",
    });

    return `${this.API_BASE_URL}?${query.toString()}`;
  }


  private async fetchApiData(url: string): Promise<any> {
    return await this.page.evaluate(async (endpoint) => {
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error(`Falha HTTP: ${response.status}`);
      return await response.json();
    }, url);
  }


  private mapToJobs(apiContent: any[]): Job[] {
    return apiContent.map((vaga) => ({
      title: vaga.areaProfissional || vaga.tipoVaga || "Estágio",
      company: vaga.nomeEmpresa || "Confidencial",
      location: `${vaga.local.cidade} - ${vaga.local.uf}`,
      modality: vaga.tipoVaga,
      link: `https://portal.ciee.org.br/vaga/${vaga.codigoVaga}`,
      salary: vaga.bolsaAuxilio ? `R$ ${vaga.bolsaAuxilio}` : "N/A",
    }));
  }


  async initScraper(): Promise<Job[]> {
    this.showInitMessage(this.scraperName);
    const allJobs: Job[] = [];
    let currentPage = 0;
    let isLastPage = false;

    try {
      while (!isLastPage && currentPage < MAX_PAGES) {
        const url = this.buildTargetUrl(currentPage);
        logger.info(`[CIEE] Coletando página ${currentPage}...`);

        const data = await this.fetchApiData(url);

        isLastPage = data.last;
        const rawContent = data.content || [];

        if (rawContent.length > 0) {
          allJobs.push(...this.mapToJobs(rawContent));
        }

        currentPage++;
        if (!isLastPage) await new Promise(r => setTimeout(r, 1000));
      }

      logger.success(`[CIEE] Finalizado com ${allJobs.length} vagas.`);
      return allJobs;

    } catch (error) {
      logger.error(`[CIEE] Erro no fluxo: ${error}`);
      return allJobs;
    } finally {
      await this.closePage();
    }
  }
}
