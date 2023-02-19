import { Report } from "../report/report";

export interface ReportBuilder {
    buildReports(): Promise<Report[]>
}