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
  private readonly AREA_TECH_FILTER = "informática";

  adapt(data: CieeApiVaga): Job | null {
    const areaProfissional = data.areaProfissional?.toLowerCase() || "";

    if (!areaProfissional.includes(this.AREA_TECH_FILTER)) {
      return null;
    }

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
    const validData = data.filter(item => this.adapt(item) !== null);
    return validData.map(item => this.adapt(item)!);
  }
}
