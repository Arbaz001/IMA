const express = require('express')
const router = express.Router()
const checkAuth = require('../middleware/checkAuth')
 
//add new course routes
router.post('/add-course',checkAuth,(req, res)=>{
   // yeaha se start karna hai 2:57:30
})




module.exports =router