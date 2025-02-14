const express = require('express')
const checkAuth = require('../middleware/checkAuth')
const jwt = require('jsonwebtoken')
const router = express.Router()
const Fee = require('../model/Fee')
const mongoose = require('mongoose')

 //Add fee
router.post('/add-fee',checkAuth,(req, res)=>{
    const token = req.headers.authorization.split(' ')[1]
    const verify = jwt.verify(token,process.env.SECRET_KEY)

    const newFee = new Fee({
        _id: new mongoose.Types.ObjectId(),
        fullName:req.body.fullName,
        phone:req.body.phone,
        courseId:req.body.courseId,
        uId:verify.uId,
        amount:req.body.amount,
        remark:req.body.remark,
    })
    newFee.save()
  .then(result => {
      res.status(200).json({ newFee: result });
  })
  .catch(err => {
      console.error("Error saving fee:", err);  // Yeh error terminal pe print karega
      res.status(500).json({ error: err.message }); 
  })
})

router.get('/payment-history', checkAuth, (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; // Token extract kar raha hai

    if (!token) {
        return res.status(401).json({ error: "No token provided" });
    }

    try {
        const verify = jwt.verify(token, process.env.SECRET_KEY); // Token verify kar raha hai
        Fee.find({ uId: verify.uId })
            .select('_id fullName phone amount remark uId createdAt')
            .then(result => {
                res.status(200).json({ paymentHistory: result });
            })
            .catch(err => {
                console.error("Database Query Error:", err);
                res.status(500).json({ error: err.message });
            });

    } catch (err) {
        console.error("Token Verification Error:", err);
        res.status(401).json({ error: "Invalid token" });
    }
});


//get all payments for any students in a course
router.get('/all-payments',checkAuth,(req,res) => {
    const token = req.headers.authorization.split(' ')[1]
    const verify = jwt.verify(token,process.env.SECRET_KEY)

    Fee.find({courseId:req.query.courseId,uId:verify.uId,phone:req.query.phone})
    .then(result=>{
        res.status(200).json({
            coursePayments:result
        })
    })
   .catch(err=>{
        res.status(500).json({
            error:err
        })
    })
})

module.exports =router