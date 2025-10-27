import type { AdminFetchReportTableDataResponse } from "../apiTypes/adminApiTypes";
import type { User } from "../entities/user";

export interface adminSliceIntialState {
  reportData: Array<AdminFetchReportTableDataResponse> | null;
  showAddCompanyForm: boolean;
  showAddSubAdminForm: boolean;
  showAddJobForm: boolean;
  showAddPackageForm: boolean;
  showAddReviewForm: boolean;
  selectedAdmin: User | null;
}
