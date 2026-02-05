import { logger } from './logger.utils.js';
import type { InquirerError } from '../types/error.types.js';
import { ValidationError, ScraperError, InitError } from '../types/error.types.js';

interface Handlers {
  handleError(error: unknown): void
}

export class ErrorHandler implements Handlers {

  private isExitError(error: unknown): error is InquirerError {
    return (
      error instanceof Error &&
      (error.name === 'ExitPromptError' || error.message.includes('SIGINT'))
    );
  }

  private isValidationError(error: unknown): error is ValidationError {

    return error instanceof Error &&
      (error.name === 'ValidationError')
  }

  private isScraperError(error: unknown): error is ScraperError {

    return error instanceof Error &&
      (error.name === 'ScraperError')

  }

  private isInitError(error: unknown): error is InitError {

    return error instanceof Error &&
      (error.name === 'InitError')
  }

  handleError(error: unknown): void {
    if (this.isInitError(error)) {
      console.log("\n")
      logger.error(`Erro ao iniciar browser: ${error.message}`);
      process.exit(1)
    }

    if (this.isExitError(error)) {
      console.log('\n');
      logger.warn('Operação interrompida pelo usuário.');
      process.exit(0);
    }

    if (this.isScraperError(error)) {
      logger.error(`[Scraper] Falha ao coletar dados: \n${error.message}`);
      return;
    }

    if (this.isValidationError(error)) {
      logger.error(`[Dados] Erro na padronização das vagas: \n${error.message}`);
      return;
    }

    logger.error('Ocorreu um erro crítico não tratado:');
    console.error(error);
    process.exit(1);
  }
}
