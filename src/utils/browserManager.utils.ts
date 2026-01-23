import { InitError } from '@/types/imports.js';
import puppeteer, {
  type Browser,
  type BrowserContext,
  type Page,
} from 'puppeteer';

export class BrowserManager {
  private browser: Browser | null = null;

  async init(): Promise<void> {
    if (this.browser) return;

    this.browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-blink-features=AutomationControlled',
      ],
    });
  }

  async createPage(): Promise<{
    context: BrowserContext;
    page: Page;
  }> {
    if (!this.browser) {
      throw new InitError('Browser não foi inicializado, chame ``BrowserManager.init()');
    }

    const context = await this.browser.createBrowserContext()
    const page = await context.newPage();

    await page.setUserAgent({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
        'AppleWebKit/537.36 (KHTML, like Gecko) ' +
        'Chrome/120.0.0.0 Safari/537.36',

      platform: 'Windows',

      userAgentMetadata: {
        brands: [
          { brand: 'Google Chrome', version: '120' },
          { brand: 'Chromium', version: '120' },
          { brand: 'Not=A?Brand', version: '99' },
        ],
        fullVersion: '120.0.0.0',
        platform: 'Windows',
        platformVersion: '10.0',
        architecture: 'x86',
        model: '',
        mobile: false,
      },
    });


    await page.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
    });

    await page.setExtraHTTPHeaders({
      'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
    });

    await page.emulateTimezone('America/Sao_Paulo');

    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', {
        get: () => false,
      });
    });

    page.setDefaultNavigationTimeout(30_000);

    return { context, page };
  }

  async close(): Promise<void> {
    if (!this.browser) return;

    await this.browser.close();
    this.browser = null;
  }
}

