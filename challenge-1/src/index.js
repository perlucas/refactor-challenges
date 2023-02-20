const reportsController = require('./controllers/reports')

const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/company/:companyId/reports/monthly/send', reportsController.sendMonthlyReports)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})