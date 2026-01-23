// @/utils/export.utils.ts
import { writeFileSync } from 'fs';
import { join } from 'path';
import type { Job } from "@/types/imports.js";
import { logger } from "./imports.js";

export class CsvExporter {
  static export(jobs: Job[], filename: string) {
    if (jobs.length === 0) {
      logger.warn("Nenhuma vaga para exportar.");
      return;
    }

    const headers = ['title', 'company', 'location', 'modality', 'link', 'postedAt'];

    const rows = jobs.map(job => {
      return headers.map(header => {
        const value = job[header as keyof Job] || '';
        // Remove quebras de linha e escapa aspas duplas
        const sanitizedValue = String(value).replace(/\n/g, ' ').replace(/"/g, '""');
        return `"${sanitizedValue}"`;
      }).join(';');
    });

    const csvContent = [headers.join(';'), ...rows].join('\n');

    try {
      const outputPath = join(process.cwd(), filename);
      writeFileSync(outputPath, '\ufeff' + csvContent, 'utf-8'); // '\ufeff' ajuda o Excel com acentuação
      logger.success(`Arquivo exportado com sucesso: ${outputPath}`);
    } catch (error) {
      logger.error(`Erro ao salvar CSV: ${error}`);
    }
  }
}
