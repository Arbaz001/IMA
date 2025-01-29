const http = require('http')
const app = require('./app')
require("dotenv").config()

const port = process.env.PORT || 3000  // process.env.PORT is set by Heroku when deploying app, otherwise default to 3000.  'dotenv' is used to load environment variables from a.env file.  This file should not be included in version control.  'dotenv' is a Node.js module that loads environment variables from a.env file into process.env.  This is useful for managing sensitive data such

const server = http.createServer(app)

server.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})