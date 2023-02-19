import { ReportFormat } from "../../domain/report/format/reportFormat";
import Schema from 'validate'

const messageSchema = new Schema({
    from: {
        type: String,
        required: true,
        length: {min: 5}
    },
    to: {
        type: String,
        required: true,
        length: {min: 5}
    },
    subject: {
        type: String,
        required: true,
        length: {min: 5}
    },
    text: {
        type: String,
        required: true,
        length: {min: 5}
    },
    html: {
        type: String,
        required: true,
        length: {min: 5}
    }
})

export class NodemailerEmailFormat extends ReportFormat {
    getIdentifier(): string {
        return 'NODEMAILER_EMAIL'
    }

    validate(message: any): void {
        messageSchema.assert(message)
    }
}