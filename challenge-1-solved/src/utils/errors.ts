import { Response } from "express";
import logger from "./logger";

export class CustomError extends Error {}

abstract class ErrorHandler {
    constructor(private next: ErrorHandler = null) {}

    protected abstract canHandle(error: Error): boolean;

    protected abstract respond(error: Error, response: Response): boolean;

    handle(error: Error, response: Response) {
        if (this.canHandle(error)) {
            const mustContinue = this.respond(error,response)
            if (!mustContinue) {
                return
            }
        }

        if (this.next !== null) {
            this.next.handle(error, response)
        }
    }
}

export class LoggerHandler extends ErrorHandler {
    protected canHandle(error: Error): boolean {
        return true
    }

    protected respond(error: Error, response: Response): boolean {
        logger.error(error.message || 'Error')
        return true
    }
}

export class CustomHandler extends ErrorHandler {
    protected canHandle(error: Error): boolean {
        return error instanceof CustomError
    }

    protected respond(error: Error, response: Response): boolean {
        response.sendStatus(200)
        return false
    }
}

export class DefaultHandler extends ErrorHandler {
    protected canHandle(error: Error): boolean {
        return true
    }

    protected respond(error: Error, response: Response<any, Record<string, any>>): boolean {
        response.sendStatus(500)
        return false
    }
}