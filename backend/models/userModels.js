import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  role:{
    type: String,
    default: "user",
    enum: ["user", "admin", "employee"],
  },
  otp: {
    type: String,
  },
  otpExpires: Date,
  isVerified: {
    type: Boolean,
    default: false,
  },
  cartData:{type:Object , default:{}},
   
} , {minimize:false}) ;

const userModel =mongoose.models.user ||  mongoose.model("user" , userSchema);

export default userModel;

