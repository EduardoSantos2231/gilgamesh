import type { SearchConfig } from "../types/searchConfigs.types.js";
import type { IBrowserContext, IScraper, Platform } from "../interfaces/index.js";
import { CathoScraper } from "../scrappers/cathoScraper.js";
import { CieeScraper } from "../scrappers/cieeScraper.js";
import { SolidesScraper } from "../scrappers/solidesScraper.js";
import type { ValidationError } from "../types/error.types.js";

export class ScraperFactory {
  private static readonly registry: Record<Platform, new (config: SearchConfig, browserContext: IBrowserContext) => IScraper> = {
    catho: CathoScraper,
    ciee: CieeScraper,
    solides: SolidesScraper,
  };

  static create(
    platform: Platform,
    config: SearchConfig,
    browserContext: IBrowserContext
  ): IScraper {
    const ScraperClass = this.registry[platform];
    if (!ScraperClass) {
      const error = new Error(`Plataforma não suportada: ${platform}`) as ValidationError;
      error.name = "ValidationError";
      throw error;
    }
    return new ScraperClass(config, browserContext);
  }

  static getPlatforms(): Platform[] {
    return Object.keys(this.registry) as Platform[];
  }

  static isPlatformSupported(platform: string): platform is Platform {
    return platform in this.registry;
  }
}
