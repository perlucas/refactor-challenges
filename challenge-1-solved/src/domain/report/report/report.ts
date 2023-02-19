import { ReportFormat } from "../format/reportFormat";

export abstract class Report {

    abstract supportsFormat(format: ReportFormat): boolean

    abstract apply(format: ReportFormat): any

}