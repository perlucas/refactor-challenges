const mocks = {
    getFn: jest.fn(),
    response: {
        sendStatus: jest.fn()
    },
    nodemailerTransport: {
        sendMail: jest.fn()
    }
}

process.env.COMPANY_EMAIL = 'company@test.com'

jest.mock('axios', () => {
    return {
        get: mocks.getFn
    }
})

jest.mock('nodemailer', () => {
    return {
        createTransport: () => mocks.nodemailerTransport
    }
})

// @ts-ignore
import controller from "controllers/reports"

describe('reporting feature tests', () => {
    const requestMock = {params: {companyId: 100}}

    test('should send reports as expected, both department and company wide', async () => {

        const usersJson = {
            data: [
            {
                id: 1,
                departmentId: 1,
                genre: 'Male',
                isAdmin: false,
                email: 'test1@test.com',
                isActive: true
            },
            {
                id: 2,
                departmentId: 3,
                genre: 'Female',
                isAdmin: false,
                email: 'test2@test.com',
                isActive: true
            },
            {
                id: 3,
                departmentId: 1,
                genre: 'Female',
                isAdmin: false,
                email: 'test3@test.com',
                isActive: true
            },
            {
                id: 4,
                departmentId: 1,
                genre: 'Female',
                isAdmin: true,
                email: 'test4@test.com',
                isActive: true
            },
            {
                id: 5,
                departmentId: 3,
                genre: 'Male',
                isAdmin: true,
                email: 'test5@test.com',
                isActive: true
            },
            {
                id: 6,
                departmentId: 1,
                genre: 'Male',
                isAdmin: false,
                email: 'test6@test.com',
                isActive: true
            },
            {
                id: 7,
                departmentId: 1,
                genre: 'Male',
                isAdmin: false,
                email: 'test7@test.com',
                isActive: true
            },
            {
                id: 8,
                departmentId: 1,
                genre: 'Male',
                isAdmin: false,
                email: 'test8@test.com',
                isActive: false
            }
        ]}

        const departmentsJson = {
            data:[
            {
                id: 1,
                name: 'Test 1'
            },
            {
                id: 3,
                name: 'Test 3'
            }
        ]}

        mocks.getFn.mockImplementation(uri => {
            if (uri.endsWith('/departments')) {
                return Promise.resolve(departmentsJson)
            } else if (uri.endsWith('/users')) {
                return Promise.resolve(usersJson)
            }
            return null
        })

        await controller.sendMonthlyReports(requestMock, mocks.response, () => {})

        expect(mocks.nodemailerTransport.sendMail).toHaveBeenNthCalledWith(1, {
            from: process.env.COMPANY_EMAIL,
            to: 'test4@test.com',
            subject: `Monthly Department Report - Test 1`,
            text:`Male employees: 3
        Female employees: 2`,
            html: `<h1>Monthly Department Report - Department Test 1</h1>
            <p>Male employees: 3
        Female employees: 2</p>
            `
        })

        expect(mocks.nodemailerTransport.sendMail).toHaveBeenNthCalledWith(2, {
            from: process.env.COMPANY_EMAIL,
            to: 'test5@test.com',
            subject: `Monthly Department Report - Test 3`,
            text:`Male employees: 1
        Female employees: 1`,
            html: `<h1>Monthly Department Report - Department Test 3</h1>
            <p>Male employees: 1
        Female employees: 1</p>
            `
        })

        expect(mocks.nodemailerTransport.sendMail).toHaveBeenNthCalledWith(3, {
            from: process.env.COMPANY_EMAIL,
            to: 'test4@test.com, test5@test.com',
            subject: "Monthly Department Report - Company",
            text: `- Department Test 1 -
            Male employees: 3
            Female employees: 2- Department Test 3 -
            Male employees: 1
            Female employees: 1`,
            html: `<h1>Department Test 1</h1>
            <p>Male employees: 3
            Female employees: 2</p><h1>Department Test 3</h1>
            <p>Male employees: 1
            Female employees: 1</p>`
        })

    })

    test('should return HTTP 200 if fails with CustomError', async () => {
          const usersJson = {
            data: [
                {
                    id: 1,
                    departmentId: 1,
                    genre: 'Male',
                    isAdmin: false,
                    email: 'test1@test.com',
                    isActive: true
                },
                {
                    id: 2,
                    departmentId: 3,
                    genre: 'Female',
                    isAdmin: false,
                    email: 'test2@test.com',
                    isActive: true
                }
            ]
        }

        const departmentsJson = {
            data: [
                {
                    id: 1,
                    name: 'Test 1'
                },
                {
                    id: 3,
                    name: 'Test 3'
                }
            ]
        }

        mocks.getFn.mockImplementation(uri => {
            if (uri.endsWith('/departments')) {
                return Promise.resolve(departmentsJson)
            } else if (uri.endsWith('/users')) {
                return Promise.resolve(usersJson)
            }
            return null
        })

        await controller.sendMonthlyReports(requestMock, mocks.response)

        expect(mocks.response.sendStatus).toHaveBeenCalledWith(200)
    })

    test('should return HTTP 500 if no CustomError instance', async () => {
        mocks.getFn.mockImplementation(() => Promise.reject(new Error('test')))

        await controller.sendMonthlyReports(requestMock, mocks.response)
        
        expect(mocks.response.sendStatus).toHaveBeenCalledWith(500)
    })

})