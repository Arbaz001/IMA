const express = require('express')
const router = express.Router()

 
router.post('/add-fee',(req, res)=>{
    res.status(200).json({
        msg:"add new fee request "
    })
})





module.exports =router