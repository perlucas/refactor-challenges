import { ReportBuilder } from "../../domain/report/builder/reportBuilder";
import { Report } from "../../domain/report/report/report";
import { DepartmentRepository } from "../../domain/repository/departmentRepository";
import { CompanyMonthlyNewsletterReport } from "../report/companyMonthlyNewsletterReport";
import { EmployeesByDepartmentReport } from "../report/employeesByDepartmentReport";

export class CustomReportBuilder implements ReportBuilder {
    constructor(
        private companyId: number,
        private departmentRepository: DepartmentRepository
    ) {}

    async buildReports(): Promise<Report[]> {
        const departments = await this.departmentRepository.getAllDepartments(this.companyId)
        return [
            ...departments.map(d => new EmployeesByDepartmentReport(d)),
            new CompanyMonthlyNewsletterReport(departments)
        ]
    }
}