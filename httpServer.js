
const bodyParser = require('body-parser');
const express = require('express');
const database = require('./database/db');
const https = require('https')
const fs = require('fs')
const app = express()
const cors = require('cors')

const userRoutes = require('./endpoints/publicUsers/UserRoute')
const publicUserRoutes = require('./endpoints/publicUsers/PublicUserRoute')
const userService = require('./endpoints/publicUsers/UserService')
const authenticationRoutes = require('./endpoints/authentication/AuthenticationRoute')
const degreeCourseRoutes = require('./endpoints/degreeCourses/degreeCourseRoute')
const degreeCourseApplicationRoute = require('./endpoints/degreeCourseApplication/degreeCourseApplicationRoute')

app.use('*', cors({
  exposedHeaders: ['*']
}))
app.use(bodyParser.json())
app.use('/api/users', userRoutes)
app.use('/api/publicUsers', publicUserRoutes)
app.use('/api/authenticate', authenticationRoutes)
app.use('/api/degreeCourses', degreeCourseRoutes)
app.use('/api/degreeCourseApplications', degreeCourseApplicationRoute)

database.initDB(function (error, db) {
  if (db) {
    userService.standardAdmin()
    console.log("Datenbank korrekt.")
  } else {
    console.log("Datenbank nicht korrekt")
  }
})

const key = fs.readFileSync('./certificates/privateKey.pem')
const cert = fs.readFileSync('./certificates/caKey.pem')
const server = https.createServer({ key: key, cert: cert }, app)

const port = 443;
server.listen(port, () => {
  console.log(`Example app listening at https://localhost:${port}`)
})

// brew services start mongodb/brew/mongodb-community
