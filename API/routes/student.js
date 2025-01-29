const express = require('express')
const router = express.Router()

 
router.post('/add-student',(req, res)=>{
    res.status(200).json({
        msg:"add new student request "
    })
})





module.exports =router