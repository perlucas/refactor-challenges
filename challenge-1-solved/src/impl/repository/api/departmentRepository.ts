import { Department } from "../../../domain/department";
import { DepartmentRepository } from "../../../domain/repository/departmentRepository";
import axios from 'axios'
import { User, UserAccessType, UserGenre } from "../../../domain/user";

const { API_BASE_URL } = process.env

export class APIDepartmentRepository implements DepartmentRepository {

    async getAllDepartments(companyId: number): Promise<Department[]> {

        const [
            { data: jsonDepartments },
            { data: jsonUsers }
        ] = await Promise.all([
            await axios.get(`${API_BASE_URL}/company/${companyId}/departments`),
            await axios.get(`${API_BASE_URL}/company/${companyId}/users`)
        ])

        return jsonDepartments.map(d => this.buildDepartment(d, jsonUsers))
    }

    private buildDepartment(jsonDepartment: any, allJsonUsers: any[]): Department {
        const department = new Department(
            jsonDepartment.id,
            jsonDepartment.name
        )

        allJsonUsers
            .filter(jsonUser => jsonUser.departmentId === department.getId() && jsonUser.isActive)
            .forEach(jsonUser => {
                const user = new User(
                    jsonUser.id,
                    jsonUser.name,
                    jsonUser.email,
                    jsonUser.genre === 'Male'
                        ? UserGenre.MALE
                        : UserGenre.FEMALE,
                    jsonUser.isAdmin
                        ? UserAccessType.ADMIN
                        : UserAccessType.NOT_ADMIN
                )
                department.addUser(user)
            })

        return department
    }
}