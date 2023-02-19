const { default: axios } = require('axios')
const nodemailer = require('nodemailer')
const logger = require('../utils/logger')
const { CustomError } = require('../utils/errors')

const {
    API_BASE_URL,
    COMPANY_EMAIL,
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USERNAME,
    SMTP_PASSWORD
} = process.env

const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: false,
    auth: {
        user: SMTP_USERNAME,
        pass: SMTP_PASSWORD,
    },
});

async function sendEmployeesByDepartmentReport(usersByGenre, department, receiverUsers) {

    if (!usersByGenre.male || !usersByGenre.female || !receiverUsers.length) {
        throw new CustomError('cannot send report')
    }

    const message = `Male employees: ${usersByGenre.male}
    Female employees: ${usersByGenre.female}`

    await transporter.sendMail({
        from: COMPANY_EMAIL,
        to: receiverUsers.map(u => u.email).join(', '),
        subject: `Monthly Department Report - ${department.name}`,
        text: message,
        html: `<h1>Monthly Department Report - Department ${department.name}</h1>
        <p>${message}</p>
        `
    })
}

async function sendCompanyMonthlyNewsletter(allUsersByGenre, departments, receiverUsers) {
    if (!usersByGenre.male || !usersByGenre.female || !receiverUsers.length) {
        throw new CustomError('cannot send report')
    }

    let plainTextMessage = ''
    let htmlMessage = ''

    for (const departmentId in allUsersByGenre) {
        const stats = allUsersByGenre[departmentId]
        const department = departments.find(d => d.id === departmentId)

        const message = `Male employees: ${stats.male}
        Female employees: ${stats.female}`

        plainTextMessage += `- Department ${department.name} -
        ${message}`

        htmlMessage += `<h1>Department ${department.name}</h1>
        <p>${message}</p>`
    }


    await transporter.sendMail({
        from: COMPANY_EMAIL,
        to: receiverUsers.map(u => u.email).join(', '),
        subject: "Monthly Department Report - Company",
        text: plainTextMessage,
        html: htmlMessage
    })
}



async function sendMonthlyReports(request, response, next) {
    const { companyId } = request.params

    try {
        const usersResponse = await axios.get(`${API_BASE_URL}/company/${companyId}/users`)

        const activeUsers = usersResponse.filter(u => u.isActive)

        const usersPerDepartmentAndGenre = activeUsers.reduce((d, u) => {
            if (d[u.departmentId]) {
                d[u.departmentId] = {
                    male: d[u.departmentId].male + (u.genre === 'Male' ? 1 : 0),
                    female: d[u.departmentId].female + (u.genre === 'Female' ? 1 : 0)
                }
            } else {
                d[u.departmentId] = {
                    male: (u.genre === 'Male' ? 1 : 0),
                    female: (u.genre === 'Female' ? 1 : 0)
                }
            }
        }, {})

        const departmentsResponse = await axios.get(`${API_BASE_URL}/company/${companyId}/departments`)
        for (const department of departmentsResponse) {
            await sendEmployeesByDepartmentReport(
                usersPerDepartmentAndGenre[department.id],
                department,
                activeUsers.filter(u => u.departmentId === department.id && u.isAdmin)
            )
        }

        await sendCompanyMonthlyNewsletter(
            usersPerDepartmentAndGenre,
            departmentsResponse,
            activeUsers.filter(u => u.isAdmin)
        )

        response.sendStatus(200)

    } catch (err) {
        logger.error(err.message || 'Error')

        if (err instanceof CustomError) {
            response.sendStatus(200)
            return
        }

        throw err
    }

}

module.exports = {
    sendMonthlyReport: sendMonthlyReports
}