const express = require('express')
const router = express.Router()
const cloudinary = require('cloudinary').v2
const User = require('../model/User')
const { default: mongoose } = require('mongoose')
require("dotenv").config()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
})

//signup Api
router.post('/signup', (req, res) => {

    //0 check if email already exists
    User.findOne({ email: req.body.email})
    .then(users => {
        if (users) {
            return res.status(400).json({
                message: 'Email already exists'
            })
        }
    
    //1 step->upload image 
    cloudinary.uploader.upload(req.files.image.tempFilePath, (err, result) => {
        //2. step->password convert to hash code
        bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
                return res.status(500).json({
                    error: err
                })
            }
            // 3 step->upload text file 
            const newUser = new User({
                _id: new mongoose.Types.ObjectId,
                fullName: req.body.fullName,
                email: req.body.email,
                phone: req.body.phone,
                password: hash,
                imageUrl: result.secure_url,
                imageId: result.public_id
            })
            newUser.save()
                .then(result => {
                    res.status(200).json({
                        newUser: result
                    })
                }).catch(err => {
                    console.log(err)
                    res.status(500).json({
                        error: err
                    })

                })
        })

    })
  })
})

// login Api
router.post('/login', (req, res) => {
    //find email 
    User.find({email: req.body.email})
    .then(users => {
        if(users.length == 0)
        {
            return res.status(500).json({
            msg:"Email not registered...."
            })
        }
        //check password
        bcrypt.compare(req.body.password, users[0].password, (err, result) => {
            if(!result)
            {
                return res.status(500).json({
                msg:"Password not match...."
                })
            }
            
             //generate token
            const token = jwt.sign({
                fullName:users[0].fullName,
                email:users[0].email,
                phone:users[0].phone,
                uId:users[0]._id
            },
            process.env.SECRET_KEY,
            {
                expiresIn: '365d'
            }
        );

        //send token to user
        res.status(200).json({
            _id:users[0]._id,
            fullName:users[0].fullName,
            email:users[0].email,
            phone:users[0].phone,
            imageUrl: users[0].imageUrl,
            imageId: users[0].imageId,
            token:token
        })

        })
    })
})



module.exports = router