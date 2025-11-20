import type { ApplicationStatusType } from "@/utils/zod/commonZod";

export interface Application {
  _id: string;
  jobId: string;
  userId: string;
  status: ApplicationStatusType;
  applicationUniqueId: string;
  createdAt: string;
  updatedAt: string;
}
