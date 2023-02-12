import { Report } from "../report/report";

export interface ReportingServiceProvider {
    register(report: Report): boolean
    sendAll(): Promise<void>
}