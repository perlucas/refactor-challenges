import { Response } from "express"
import logger from "../../logger"
import { ErrorHandler } from "./errorHandler"

export class LoggerHandler extends ErrorHandler {
    protected canHandle(error: Error): boolean {
        return true
    }

    protected respond(error: Error, response: Response): boolean {
        logger.error(error.message || 'Error')
        return true
    }
}