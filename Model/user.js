import mongoose from "mongoose";

const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type: String,
        required:[true,'please enter your email'],
        unique:true,
        trim: true,
    lowercase: true,
    },
   password:{
    type:String,
    required: [true, 'Please enter your password'],
    minlength: [8, 'Password must be at least 8 characters long'],
   },
   role:{
    type:String,
    enum:["user","admin"],
    default:"user"
   },
   resetPasswordToken: String,
  resetPasswordExpires: Date,
   createdAt: {
    type: Date,
    default: Date.now,
  },
},{timestamps:true})

export const User=new mongoose.model("User",userSchema)