export abstract class ReportFormat {

    abstract getIdentifier(): string

    abstract validate(message: any): void

}