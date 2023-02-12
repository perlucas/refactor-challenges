import { ReportingServiceProvider } from "../provider/reportingServiceProvider";
import { Report } from "../report/report";

export class ReportingChannel {
    private providers: ReportingServiceProvider[] = []

    registerProvider(provider: ReportingServiceProvider) {
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