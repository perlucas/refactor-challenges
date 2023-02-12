import { Department } from "../department";

export interface DepartmentRepository {
    getAllDepartments(companyId: number): Promise<Department[]>
}