// const reportsController = require('./controllers/reports')
import reportsController from './controllers/reports'

// const express = require('express')
import express from 'express'

const app = express()

const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/company/:companyId/reports/monthly/send', reportsController.sendMonthlyReports)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})