import puppeteer, { type Browser, type BrowserContext, type Page } from "puppeteer";
import type { IBrowserContext } from "../../interfaces/browser-context.interface.js";
import { InitError } from "../../types/error.types.js";

interface StealthConfig {
  userAgent?: string;
  viewport?: { width: number; height: number };
  timezone?: string;
}

export class BrowserContextImpl implements IBrowserContext {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;

  constructor(private readonly config: StealthConfig = {}) {}

  async init(): Promise<void> {
    if (this.browser) return;

    this.browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-blink-features=AutomationControlled",
      ],
    });

    this.context = await this.browser.createBrowserContext();
  }

  async getPage(): Promise<Page> {
    if (!this.context) {
      throw new InitError("Browser não inicializado. Chame init() primeiro.");
    }

    const page = await this.context.newPage();

    await this.applyStealth(page);

    return page;
  }

  private async applyStealth(page: Page): Promise<void> {
    const userAgent = this.config.userAgent ?? "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

    await page.setUserAgent({
      userAgent,
      platform: "Windows",
      userAgentMetadata: {
        brands: [
          { brand: "Google Chrome", version: "120" },
          { brand: "Chromium", version: "120" },
          { brand: "Not=A?Brand", version: "99" },
        ],
        fullVersion: "120.0.0.0",
        platform: "Windows",
        platformVersion: "10.0",
        architecture: "x86",
        model: "",
        mobile: false,
      },
    });

    const viewport = this.config.viewport ?? { width: 1920, height: 1080 };
    await page.setViewport({
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: 1,
    });

    await page.setExtraHTTPHeaders({
      "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
    });

    if (this.config.timezone) {
      await page.emulateTimezone(this.config.timezone);
    }

    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, "webdriver", {
        get: () => false,
      });
    });

    page.setDefaultNavigationTimeout(30_000);
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.context = null;
    }
  }
}
