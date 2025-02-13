const express = require('express')
const router = express.Router()
const checkAuth = require('../middleware/checkAuth')
const Course = require('../model/Course')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const cloudinary = require('cloudinary').v2
const Student = require('../model/Student')
const Fee = require('../model/Fee')

cloudinary.config({
   cloud_name: process.env.CLOUD_NAME,
   api_key: process.env.API_KEY,
   api_secret: process.env.API_SECRET,
})
 
//add new course routes ki API routes
router.post('/add-course',checkAuth,(req, res)=>{
   //is token se humne userId nikal liya
      const token = req.headers.authorization.split(' ')[1]
      const verify = jwt.verify(token,process.env.SECRET_KEY)
   //token milne ke baad ab applicble hau as user ki hum course add karenge
   // yeha image upload hoga
      cloudinary.uploader.upload(req.files.image.tempFilePath, (err, result) => {
         //yeha course details upload hoga
         const newCourse = new Course({
            _id: new mongoose.Types.ObjectId(),
            courseName:req.body.courseName,
            price:req.body.price,
            description:req.body.description,
            startingDate:req.body.startingDate,
            endDate:req.body.endDate,
            uId:verify.uId,
            imageId:result.public_id,
            imageUrl:result.secure_url
         })
         // yeah save hojayega
         newCourse.save() 
         // save hone ke baad massage milega ki course added succefully
         .then(result => {
            res.status(200).json({
               message:"Course added successfully",newCourse:result
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

   //get all courses routes ki API routes
router.get('/all-courses',checkAuth,(req, res)=>{
   //is token se humne userId nikal liya
      const token = req.headers.authorization.split(' ')[1]
      const verify = jwt.verify(token,process.env.SECRET_KEY)
   //token milne ke baad ab applicble hau as user ki hum course get karenge
   // yeha course details fetch hoga
      Course.find({uId:verify.uId})
      // hume jo dekhana respone me uske liye select() ka use karenge
      .select('_id uId courseName description price startingDate endDate imageUrl imageId')
      .then(courses => {
         res.status(200).json({
            message:"All courses fetched successfully",courses:courses
         })
      })
      // agar nhi fetch hua to error aa jayega
      .catch(err => {
         console.log(err)
         res.status(500).json({
            error:err
         })
      })
})

//get single course routes ki API routes
router.get('/course-detail/:id',checkAuth,(req, res)=>{
   
      Course.findById(req.params.id)
      .select('_id uId courseName description price startingDate endDate imageUrl imageId')
      .then(result => {
         Student.find({courseId:req.params.id})
         .then(students=>{
            res.status(200).json({
               message:"Course fetched successfully and with students",course:result, studentList:students
            })
         })
      })
      .catch(err => {
         console.log(err)
         res.status(500).json({
            error:err
         })
      })
   })

//delete the course
   router.delete('/:id',checkAuth,(req, res)=>{
      const token = req.headers.authorization.split(' ')[1]
      const verify = jwt.verify(token,process.env.SECRET_KEY)

      Course.findByIdAndDelete(req.params.id)
      .then(course => {
         console.log(course)
         if(course.uId == verify.uId) 
         {
           Course.findByIdAndDelete(req.params.id)  //delete course from the database
            .then(result => {
               cloudinary.uploader.destroy(course.imageId,(deletedImage)=>{  // here deleting the image on cloudinary server
                  res.status(200).json({
                     message:"Course deleted successfully"
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

   // update course
   router.put('/:id',checkAuth,(req, res)=>{
      
      const token = req.headers.authorization.split(' ')[1]
      const verify = jwt.verify(token,process.env.SECRET_KEY)

      Course.findById(req.params.id)
      .then(course=>{
         if(course.uId != verify.uId){
            return res.status(500).json({message:"Unauthorized to update this course"})
         }
         // agar image file saath me hua to update karne ke liye
         if(req.files){
            cloudinary.uploader.destroy(course.imageId,(deletedImage)=>{  // here deleting the image on cloudinary server
               cloudinary.uploader.upload(req.files.image.tempFilePath, (err, result) => {
                  //yeha course details upload hoga
                  const NewupdatedCoursef = {
                     courseName:req.body.courseName,
                     price:req.body.price,
                     description:req.body.description,
                     startingDate:req.body.startingDate,
                     endDate:req.body.endDate,
                     uId:verify.uId,
                     imageId:result.public_id,
                     imageUrl:result.secure_url
                  }
                  Course.findByIdAndUpdate(req.params.id,NewupdatedCoursef,{new:true})
                  .then(data=>{
                     res.status(200).json({
                        message:"Course updated successfully",NewupdatedCoursef:data
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
            const NewupdatedCoursenf={
               courseName:req.body.courseName,
               price:req.body.price,
               description:req.body.description,
               startingDate:req.body.startingDate,
               endDate:req.body.endDate,
               uId:verify.uId,
               imageUrl:course.imageUrl,
               imageId:course.imageId
            }
            Course.findByIdAndUpdate(req.params.id,NewupdatedCoursenf,{new:true})
            .then(data=>{
               res.status(200).json({
                  message:"Course updated successfully",NewupdatedCoursenf:data
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

    //get latest 5 courses data from server
    router.get('/latest-courses',(req, res)=>{
       Course.find()
          .sort({startingDate:-1})
          .limit(5)
          .select('_id courseName price startingDate imageUrl')
          .then(courses=>{
             res.status(200).json({
                message:"Latest courses fetched successfully",courses:courses
             })
          })
          .catch(err=>{
             res.status(500).json({
                message:err.message
             })
          })
    })

    // home api
    router.get('/home',checkAuth,async(req, res)=>{
      try{
         const token = req.headers.authorization.split(' ')[1]
         const verify = jwt.verify(token,process.env.SECRET_KEY)
         const newPayments = await Fee.find({uId:verify.uId}).sort({$natural:-1}).limit(5)
         const newStudents = await Student.find({uId:verify.uId}).sort({$natural:-1}).limit(5)
         const totalCourses = await Course.countDocuments({uId:verify.uId})
         const totalStudents = await Student.countDocuments({uId:verify.uId})
         const totalAmount = await Fee.aggregate([
            { $match: { uId: verify.uId } },
            { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
         ])
         res.status(200).json({
            message:"Home page fetched successfully",
            Payments:newPayments,
            Students:newStudents,
            TotalCourses:totalCourses,
            TotalStudents:totalStudents,
            TotalAmount: totalAmount[0].totalAmount || 0
         })
      }
      catch(err)
      {
         res.status(500).json({
            error:err
         })
      }
    })


module.exports = router