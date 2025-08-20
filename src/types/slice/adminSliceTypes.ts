import type { AdminFetchReportTableDataResponse } from "../apiTypes/admin";

export interface adminSliceIntialState {
    reportData: Array<AdminFetchReportTableDataResponse> | null;
}