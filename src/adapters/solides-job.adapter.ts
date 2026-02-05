import type { Job } from "../types/job.types.js";
import type { IJobAdapter } from "../interfaces/job-adapter.interface.js";

export interface SolidesApiVaga {
  title?: string;
  companyName: string;
  city: { name: string };
  state: { code: string };
  homeOffice?: boolean;
  redirectLink: string;
  createdAt?: string;
  salary?: {
    initialRange: number;
    finalRange: number;
  };
}

export class SolidesJobAdapter implements IJobAdapter<SolidesApiVaga> {
  adapt(data: SolidesApiVaga): Job {
    const initial = data.salary?.initialRange ?? 0;
    const final = data.salary?.finalRange ?? 0;

    const job: Job = {
      title: data.title?.toUpperCase() || "Título não disponível",
      company: data.companyName,
      location: `${data.city.name} - ${data.state.code}`,
      modality: data.homeOffice ? "Remoto" : "Presencial",
      link: data.redirectLink,
      salary: initial > 0 || final > 0 ? `R$ ${initial} - R$ ${final}` : "A combinar",
    };

    if (data.createdAt) {
      job.postedAt = data.createdAt;
    }

    return job;
  }

  adaptMany(data: SolidesApiVaga[]): Job[] {
    return data.map((item) => this.adapt(item));
  }
}
