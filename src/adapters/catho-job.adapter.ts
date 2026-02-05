import type { Job } from "../types/job.types.js";
import type { IJobAdapter } from "../interfaces/job-adapter.interface.js";

interface CathoHtmlElement {
  title: string;
  company: string;
  location: string;
  link: string;
}

export class CathoJobAdapter implements IJobAdapter<CathoHtmlElement> {
  adapt(data: CathoHtmlElement): Job {
    const cleanLocation = data.location.replace(/\s\(\d+\)$/, "");

    return {
      title: data.title,
      company: data.company,
      location: cleanLocation,
      modality: "estagio",
      link: data.link,
    };
  }

  adaptMany(data: CathoHtmlElement[]): Job[] {
    return data.map((item) => this.adapt(item));
  }
}
