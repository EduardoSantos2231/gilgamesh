import type { Job } from "../types/job.types.js";
import type { IJobAdapter } from "../interfaces/job-adapter.interface.js";

export interface CieeApiVaga {
  areaProfissional?: string;
  tipoVaga: string;
  nomeEmpresa: string;
  local: { cidade: string; uf: string };
  codigoVaga: number;
  bolsaAuxilio?: number;
}

export class CieeJobAdapter implements IJobAdapter<CieeApiVaga> {
  adapt(data: CieeApiVaga): Job {
    return {
      title: data.areaProfissional || data.tipoVaga,
      company: data.nomeEmpresa,
      location: `${data.local.cidade} - ${data.local.uf}`,
      modality: data.tipoVaga,
      link: `https://portal.ciee.org.br/vaga/${data.codigoVaga}`,
      salary: data.bolsaAuxilio ? `R$ ${data.bolsaAuxilio}` : "N/A",
    };
  }

  adaptMany(data: CieeApiVaga[]): Job[] {
    return data.map((item) => this.adapt(item));
  }
}
