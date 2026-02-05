import type { Job } from "../types/job.types.js";

export interface IJobAdapter<T = unknown> {
  adapt(data: T): Job | null;
  adaptMany(data: T[]): Job[];
}
