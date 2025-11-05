export type WorkMode = "onsite" | "remote" | "hybrid";
export type JobType = "full-time" | "part-time" | "contract" | "internship";

export interface CareerData {
  _id: string;
  userId: string;

  currentSalary: number;
  expectedSalary: number;

  immediateJoiner: boolean;
  noticePeriod?: number;

  experience: string;
  currentDesignation: string;
  currentCompany: string;
  industry: string;

  currentJobType: JobType;                
  preferredJobTypes: JobType[];            
  preferredWorkModes: WorkMode[];                     

  resumeUrl: string;

  createdAt: string;
  updatedAt: string;
}
