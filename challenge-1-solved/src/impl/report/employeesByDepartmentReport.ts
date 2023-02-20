import { Department } from "../../domain/department";
import { ReportFormat } from "../../domain/report/format/reportFormat";
import { Report } from "../../domain/report/report/report";
import { UserGenre } from "../../domain/user";
import { CustomError } from "../../utils/errors/custom";

const { COMPANY_EMAIL } = process.env

const supportedFormats = {
    'NODEMAILER_EMAIL': thisReport => thisReport.nodemailerFormat()
}

export class EmployeesByDepartmentReport extends Report {

    constructor(
        private department: Department
    ){
        super()
    }

    supportsFormat(format: ReportFormat): boolean {
        return Object.keys(supportedFormats).includes(format.getIdentifier())
    }

    apply(format: ReportFormat): any {
        const method = supportedFormats[ format.getIdentifier() ]
        return method(this)
    }

    /**
     * get the email formatted for nodemailer provider, called from apply
     * @returns any
     */
    private nodemailerFormat(): any {
        const [maleUsers, femaleUsers, adminUsers] = [
            this.department.getUsersByGenre(UserGenre.MALE),
            this.department.getUsersByGenre(UserGenre.FEMALE),
            this.department.getAdminUsers()
        ]

        if (adminUsers.length === 0) {
            throw new CustomError('cannot send report')
        }

        const message = `Male employees: ${maleUsers.length}
        Female employees: ${femaleUsers.length}`

        return {
            from: COMPANY_EMAIL,
            to: adminUsers.map(u => u.getEmail()).join(', '),
            subject: `Monthly Department Report - ${this.department.getName()}`,
            text: message,
            html: `<h1>Monthly Department Report - Department ${this.department.getName()}</h1>
            <p>${message}</p>
            `
        }
    }
}