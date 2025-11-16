import type { AdminFetchReportTableDataResponse } from "../apiTypes/adminApiTypes";

export interface adminSliceIntialState {
  reportData: Array<AdminFetchReportTableDataResponse> | null;
  showAddJobForm: boolean;
  showAddPackageForm: boolean;
}
