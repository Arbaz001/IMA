const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const cors = require('cors')

//routes url path
const userRoute = require('./routes/user')
const courseRoute = require('./routes/course')
const feeRoute = require('./routes/fee')
const studentRoute = require('./routes/student')
require("dotenv").config()
const db_link = process.env.db_link

mongoose.connect(`${db_link}`)
.then(()=>{
    console.log("Connected to MongoDB")
})
.catch((err) => {
    console.log("Failed to connect to MongoDB")
})

app.use(bodyParser.json())
app.use(cors())

app.use(fileUpload({
    useTempFiles: true,
    // tempFileDir:'/tmp/'
}))

app.use("/user",userRoute)  //done
app.use("/course",courseRoute)
app.use("/fee",feeRoute)
app.use("/student",studentRoute)

app.use("*",(req,res) => {
    res.status(404).json({
        msg:"bad request"
    })
})


module.exports=app