import { Department } from "./department"

export class User {

    constructor(
        private id: number,
        private fullName: string,
        private email: string,
        private department: Department = null
    ){}

    public getId(): number {
        return this.id
    }

    public getFullname(): string {
        return this.fullName
    }

    public getEmail(): string {
        return this.email
    }

    public getDepartment(): Department {
        return this.department
    }

    public setDepartment(d: Department) {
        this.department = d
    }
}