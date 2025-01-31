const express = require('express')
const router = express.Router()
const checkAuth = require('../middleware/checkAuth')
const Student = require('../model/Student')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
 })
 
 //add new student routes ki API routes
router.post('/add-student',checkAuth,(req, res)=>{
   //is token se humne userId nikal liya
      const token = req.headers.authorization.split(' ')[1]
      const verify = jwt.verify(token,process.env.SECRET_KEY)
   //token milne ke baad ab applicble hau as user ki hum Student add karenge
   // yeha image upload hoga
      cloudinary.uploader.upload(req.files.image.tempFilePath, (err, result) => {
         //yeha course details upload hoga
         const newStudent = new Student({
            _id: new mongoose.Types.ObjectId(),
            fullName :req.body.fullName,
            phone : req.body.phone,
            email : req.body.email,
            address : req.body.address,
            imageId:result.public_id,
            imageUrl:result.secure_url,
            courseId:req.body.courseId,  //yeh courseId ko humne verify karenge ki course ham isse add karenge
            uId:verify.uId, //yeh userId ko humne verify karenge ki user ham isse add karenge
         })
         // yeah save hojayega
         newStudent.save() 
         // save hone ke baad massage milega ki Student added succefully
         .then(result => {
            res.status(200).json({
               message:"Student added successfully",newCourse:result
            })
         })
         // agar nhi add hua to error aa jayega
         .catch(err => {
            console.log(err)
            res.status(500).json({
               error:err
            })
         })
      })
   })
   
 //get all own students routes ki API routes
 router.get('/all-students',checkAuth,(req, res)=>{
      //is token se humne userId nikal liya
      const token = req.headers.authorization.split(' ')[1]
      const verify = jwt.verify(token,process.env.SECRET_KEY)
      //yeh courseId ko humne verify karenge ki course ham isse add karenge
      Student.find({uId:verify.uId})
      .select('_id uId fullName phone email address imageId imageUrl ')
      .then(result => {
         res.status(200).json({
            message:"Students fetched successfully",students:result
         })
      })
      .catch(err => {
         console.log(err)
         res.status(500).json({
            error:err
         })
      })
})
 // get own all students for a specific course
 router.get('/all-students/:courseId',checkAuth,(req, res)=>{
    //is token se humne userId nikal liya
    const token = req.headers.authorization.split(' ')[1]
    const verify = jwt.verify(token,process.env.SECRET_KEY)
    //yeh courseId ko humne verify karenge ki course ham isse add karenge
    Student.find({uId:verify.uId,courseId:req.params.courseId})
    .select('_id uId fullName phone email address imageId imageUrl ')
    .then(result => {
       res.status(200).json({
          message:"Students fetched successfully",students:result
       })
    })
    .catch(err => {
       console.log(err)
       res.status(500).json({
          error:err
       })
    })
})

// delete student 
 router.delete('/:id',checkAuth,(req, res)=>{
       const token = req.headers.authorization.split(' ')[1]
       const verify = jwt.verify(token,process.env.SECRET_KEY)
 
       Student.findByIdAndDelete(req.params.id)
       .then(student => {
          console.log(student)
          if(student.uId == verify.uId) 
          {
            Student.findByIdAndDelete(req.params.id)  //delete student from the database
             .then(result => {
                cloudinary.uploader.destroy(student.imageId,(deletedImage)=>{  // here deleting the image on cloudinary server
                   res.status(200).json({
                      message:"Student deleted successfully"
                   })
                })
              })
              .catch(err => {
                 console.log(err)
                 res.status(500).json({
                    msg:err
                 })
              })
          }
          else{
             res.status(401).json({
                message:"Unauthorized to delete this course"
             })
          }
       })   
    })

 // update student
router.put('/:id',checkAuth,(req, res)=>{
      
      const token = req.headers.authorization.split(' ')[1]
      const verify = jwt.verify(token,process.env.SECRET_KEY)

      Student.findById(req.params.id)
      .then(student=>{
         if(student.uId != verify.uId){
            return res.status(500).json({message:"Unauthorized to update this Student"})
         }
         // agar image file saath me hua to update karne ke liye
         if(req.files){
            cloudinary.uploader.destroy(student.imageId,(deletedImage)=>{  // here deleting the image on cloudinary server
               cloudinary.uploader.upload(req.files.image.tempFilePath, (err, result) => {
                  //yeha course details upload hoga
                  const NewupdatedStudentf = {
                     fullName :req.body.fullName,
                     phone : req.body.phone,
                     email : req.body.email,
                     address : req.body.address,
                     uId:verify.uId,
                     imageId:result.public_id,
                     imageUrl:result.secure_url
                  }
                  Student.findByIdAndUpdate(req.params.id,NewupdatedStudentf,{new:true})
                  .then(data=>{
                     res.status(200).json({
                        message:"Student updated successfully",NewupdatedStudentf:data
                     })
                  })
                  .catch(err=>{
                     res.status(500).json({
                        message:err.message
                     })
                  })
               })
            })
         }
         // agar image file nahi hua to update karenge
         else{
            const NewupdatedStudentnf={
               fullName :req.body.fullName,
               phone : req.body.phone,
               email : req.body.email,
               address : req.body.address,
               uId:verify.uId,
               imageUrl:student.imageUrl,
               imageId:student.imageId
            }
            Student.findByIdAndUpdate(req.params.id,NewupdatedStudentnf,{new:true})
            .then(data=>{
               res.status(200).json({
                  message:"Student updated successfully",NewupdatedStudentnf:data
               })
            })
            .catch(err=>{
               res.status(500).json({
                  message:err.message
               })
            })
         }

      })
      .catch(err=>{
         res.status(500).json({
            message:err.message
         })
      })
   })

   //get latest 5 students data from server
   router.get('/latest-students',checkAuth,(req, res)=>{
      Student.find()
        .sort({createdAt: -1})
        .limit(5)
        .select('_id uId fullName phone email address imageId imageUrl courseId')
        .populate('courseId','_id courseName')
        .then(result => {
            res.status(200).json({
               message:"Latest 5 students fetched successfully",students:result
            })
         })
        .catch(err => {
            console.log(err)
            res.status(500).json({
               error:err
            })
         })
   })
// export the router module
module.exports =router