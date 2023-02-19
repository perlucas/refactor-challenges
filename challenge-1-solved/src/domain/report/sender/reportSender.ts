import { ReportingChannel } from "../channel/reportingChannel";
import { Report } from "../report/report";

export class ReportSender {
    private providers: ReportingChannel[] = []

    registerProvider(provider: ReportingChannel) {
        this.providers.push(provider)
    }

    pushReport(report: Report) {
        for (const provider of this.providers) {
            provider.register(report)
        }
    }

    async dispatchAll(): Promise<void> {
        await Promise.all(
            this.providers.map(p => p.sendAll())
        )
    }
}