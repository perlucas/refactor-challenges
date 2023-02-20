import { ReportFormat } from "../../domain/report/format/reportFormat";
import { ReportingChannel } from "../../domain/report/channel/reportingChannel";
import { Report } from "../../domain/report/report/report";
import { NodemailerEmailFormat } from "./reportFormat";
import nodemailer from 'nodemailer'

const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USERNAME,
    SMTP_PASSWORD
} = process.env

export class EmailChannel implements ReportingChannel {
    private format: ReportFormat = new NodemailerEmailFormat()
    private reports: Report[] = []
    private transporter: any = null

    register(report: Report): boolean {
        console.log(`registering report, supported?: ${report.supportsFormat(this.format)}`)

        if (report.supportsFormat(this.format)) {
            this.reports.push(report)
            return true
        }
        return false
    }

    async sendAll(): Promise<void> {
        await Promise.all(
            this.reports.map(this.sendReport)
        )
    }

    private async sendReport(report: Report): Promise<void> {
        const message = report.apply(this.format)
        this.format.validate(message)

        await this.getTransporter().sendMail(message)
    }

    private getTransporter(): any {
        if (this.transporter == null) {
            this.transporter = nodemailer.createTransport({
                host: SMTP_HOST,
                port: SMTP_PORT,
                secure: false,
                auth: {
                    user: SMTP_USERNAME,
                    pass: SMTP_PASSWORD,
                },
            });
        }

        return this.transporter
    }
}