import type { AdminFetchReportTableDataResponse } from "../apiTypes/admin";

export interface adminSliceIntialState {
    reportData: Array<AdminFetchReportTableDataResponse> | null;
    showAddCompanyForm: boolean;
    showAddSubAdminForm: boolean;
    showAddJobForm: boolean;
    showAddPackageForm: boolean;
    showAddReviewForm: boolean;
}