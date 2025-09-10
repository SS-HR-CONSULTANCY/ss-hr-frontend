import type { AdminFetchReportTableDataResponse } from "../apiTypes/adminApiTypes";

export interface adminSliceIntialState {
    reportData: Array<AdminFetchReportTableDataResponse> | null;
    showAddCompanyForm: boolean;
    showAddSubAdminForm: boolean;
    showAddJobForm: boolean;
    showAddPackageForm: boolean;
    showAddReviewForm: boolean;
}