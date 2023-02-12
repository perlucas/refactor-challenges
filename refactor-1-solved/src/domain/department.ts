import { User } from "./user"

export class Department {
    private users: User[] = []

    constructor(
        private id: number,
        private name: string
    ){}

    public getId(): number {
        return this.id
    }

    public getName(): string {
        return this.name
    }

    public getUsers(): User[] {
        return [...this.users]
    }

    public addUser(u: User) {
        this.users.push(u)
        u.setDepartment(this)
    }
}