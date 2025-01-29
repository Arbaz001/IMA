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
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: hash,
                imageUrl: result.secure_url,
                imageId: result.public_id
            })
            newUser.save()
                .then(result => {
                    res.status(200).json({
                        message: "User created successfully",
                        user: result
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
                email:users[0].email,
                firstName:users[0].firstName,
                lastName:users[0].lastName,
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
            firstName:users[0].firstName,
            lastName:users[0].lastName,
            email:users[0].email,
            imageUrl: users[0].imageUrl,
            imageId: users[0].imageId,
            token:token
        })

        })
    })
})



module.exports = router