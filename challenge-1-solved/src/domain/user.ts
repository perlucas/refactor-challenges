import { Department } from "./department"

export enum UserGenre {
    MALE = 'M',
    FEMALE = 'F'
}

export enum UserAccessType {
    ADMIN = 1,
    NOT_ADMIN = 2
}

export class User {

    constructor(
        private id: number,
        private fullName: string,
        private email: string,
        private genre: UserGenre,
        private accessType: UserAccessType = UserAccessType.NOT_ADMIN,
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

    public getGenre(): UserGenre {
        return this.genre
    }

    public getAccessType(): UserAccessType {
        return this.accessType
    }

    public getDepartment(): Department {
        return this.department
    }

    public setDepartment(d: Department) {
        this.department = d
    }
}