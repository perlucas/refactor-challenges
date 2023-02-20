import { CustomReportBuilder } from '../impl/builder/customReportBuilder'
import { APIDepartmentRepository } from '../impl/repository/api/departmentRepository'
import { ReportSender } from '../domain/report/sender/reportSender'
import { EmailChannel } from '../impl/nodemailer/emailChannel'
import { LoggerHandler, CustomHandler, DefaultHandler } from '../utils/errors/handlers'

async function sendMonthlyReports(request, response, next) {
    const { companyId } = request.params

    try {
        // configure reports sender
        const sender = new ReportSender()
        sender.registerChannel(new EmailChannel())

        // prepare and enqueue reports
        const reportBuilder = new CustomReportBuilder(companyId, new APIDepartmentRepository())
        const reports = await reportBuilder.buildReports()

        reports.forEach(r => sender.pushReport(r))

        // send them all
        await sender.dispatchAll()

        response.sendStatus(200)

    } catch (err) {

        const handlerChain = new LoggerHandler(
            new CustomHandler(
                new DefaultHandler()
            )
        )

        handlerChain.handle(err, response)
    }

}

export default { sendMonthlyReports }