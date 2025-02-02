const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    _id:mongoose.Types.ObjectId,
    fullName:{type:String,reuired:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    phone:{type:String,required:true},
    imageUrl:{type:String,required:true},
    imageId:{type:String,default:true},
})

module.exports = mongoose.model('User',userSchema)