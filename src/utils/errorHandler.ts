import { logger } from '@/actions/imports.js';
import { type InquirerError, ValidationError, ScraperError } from '@/types/error.types.js';

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
    return error instanceof ValidationError;
  }

  private isScraperError(error: unknown): error is ScraperError {
    return error instanceof ScraperError;
  }

  handleError(error: unknown): void {
    if (this.isExitError(error)) {
      console.log('\n');
      logger.warn('Operação interrompida pelo usuário.');
      process.exit(0);
    }

    if (this.isScraperError(error)) {
      logger.error(`[Scraper] Falha ao coletar dados: ${error.message}`);
      // Aqui você poderia decidir não fechar o processo, apenas avisar
      return;
    }

    if (this.isValidationError(error)) {
      logger.error(`[Dados] Erro na padronização das vagas: ${error.message}`);
      return;
    }

    logger.error('Ocorreu um erro crítico não tratado:');
    console.error(error);
    process.exit(1);
  }
}
