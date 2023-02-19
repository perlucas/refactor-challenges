import { Report } from "../report/report";

export interface ReportingChannel {
    register(report: Report): boolean
    sendAll(): Promise<void>
}