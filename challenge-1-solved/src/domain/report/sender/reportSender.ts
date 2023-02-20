import { ReportingChannel } from "../channel/reportingChannel";
import { Report } from "../report/report";

export class ReportSender {
    private channels: ReportingChannel[] = []

    registerChannel(channel: ReportingChannel) {
        this.channels.push(channel)
    }

    pushReport(report: Report) {
        for (const channel of this.channels) {
            channel.register(report)
        }
    }

    async dispatchAll(): Promise<void> {
        await Promise.all(
            this.channels.map(c => c.sendAll())
        )
    }
}