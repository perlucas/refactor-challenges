import { Response } from "express"

export abstract class ErrorHandler {
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