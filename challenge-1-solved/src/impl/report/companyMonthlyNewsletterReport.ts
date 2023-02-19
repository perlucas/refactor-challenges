import { Department } from "../../domain/department";
import { ReportFormat } from "../../domain/report/format/reportFormat";
import { Report } from "../../domain/report/report/report";
import { UserGenre } from "../../domain/user";
import { CustomError } from "../../utils/errors";

const { COMPANY_EMAIL } = process.env

const supportedFormats = {
    'NODEMAILER_EMAIL': thisReport => thisReport.nodemailerFormat()
}

export class CompanyMonthlyNewsletterReport extends Report {
    constructor(
        private departments: Department[]
    ){
        super()
    }

    supportsFormat(format: ReportFormat): boolean {
        return Object.keys(supportedFormats).includes(format.getIdentifier())
    }

    apply(format: ReportFormat) {
        const method = supportedFormats[ format.getIdentifier() ]
        return method(this)
    }

    private nodemailerFormat(): any {
        const adminUsers = this.departments
            .map(d => d.getAdminUsers())
            .flat()

        if (adminUsers.length === 0) {
            throw new CustomError('cannot send report')
        }

        let plainTextMessage = ''
        let htmlMessage = ''

        for (const d of this.departments) {
            const [maleUsers, femaleUsers] = [
                d.getUsersByGenre(UserGenre.MALE),
                d.getUsersByGenre(UserGenre.FEMALE)
            ]

            const message = `Male employees: ${maleUsers.length}
            Female employees: ${femaleUsers.length}`

            plainTextMessage += `- Department ${d.getName()} -
            ${message}`

            htmlMessage += `<h1>Department ${d.getName()}</h1>
            <p>${message}</p>`
        }


        return {
            from: COMPANY_EMAIL,
            to: adminUsers.map(u => u.getEmail()).join(', '),
            subject: 'Monthly Department Report - Company',
            text: plainTextMessage,
            html: htmlMessage
        }
    }
}