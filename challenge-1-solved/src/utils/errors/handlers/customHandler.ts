import { Response } from "express"
import { CustomError } from "../custom"
import { ErrorHandler } from "./errorHandler"

export class CustomHandler extends ErrorHandler {
    protected canHandle(error: Error): boolean {
        return error instanceof CustomError
    }

    protected respond(error: Error, response: Response): boolean {
        response.sendStatus(200)
        return false
    }
}