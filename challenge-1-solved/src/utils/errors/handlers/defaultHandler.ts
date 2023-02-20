import { Response } from "express"
import { ErrorHandler } from "./errorHandler"

export class DefaultHandler extends ErrorHandler {
    protected canHandle(error: Error): boolean {
        return true
    }

    protected respond(error: Error, response: Response): boolean {
        response.sendStatus(500)
        return false
    }
}