import type { JobtypeType, WorkModeType } from "@/utils/zod/commonZod";

export interface CareerData {
  _id: string;
  userId: string;

  currentSalary?: number;
  expectedSalary?: number;

  immediateJoiner: boolean;
  noticePeriod?: number;

  experience?: string;
  currentDesignation?: string;
  currentCompany?: string;
  industry?: string;

  currentJobType?: JobtypeType;
  preferredJobTypes?: JobtypeType[];
  preferredWorkModes?: WorkModeType[];

  resume: File | string;

  createdAt: string;
  updatedAt: string;
}
