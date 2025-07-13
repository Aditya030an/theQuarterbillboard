import express from "express";
import userModel from "../models/userModels.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {sendEmailOtp} from "../utils/sendEmail.js"
import sendSMS from "../utils/sendSMS.js"

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRATE);
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

//Route for user login
const loginUser = async (req, res) => {
  try {
    console.log("req body" , req.body);
    const { email, password , value  , updatePassword} = req.body;

    const user = await userModel.findOne({ email });
    console.log("user" , user);
    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }
    if(value === "login"){
      const isMatch = await bcrypt.compare(password, user.password);
      
      if (!isMatch) {
        return res
        .status(400)
        .json({ message: "Invalid credentials", success: false });
      }
    }
    if(updatePassword){
      const hashPassword = await bcrypt.hash(password, 10);
      user.password = hashPassword;
      await user.save();
      res.status(200).json({ message: "Password updated successfully" , success: true });
    }
    // const otp = generateOTP();
    // user.otp = otp;
    // // user.otpExpires = new Date(Date.now() + 30 * 1000);
    // user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
    // await user.save();
    // await sendEmailOtp(user.email, otp);
    // await sendSMS(`+91${user.phoneNumber}`, otp);
     const token =await createToken(user?._id);
    res.status(200).json({ message: "OTP sent" ,  otpExpires: user.otpExpires , user  , token,  success: true });
  } catch (error) {
    console.log(error);
    res.json({ message: error.message });
  }
};

//Router for user registration
const registerUser = async (req, res) => {
  try {
    const { name , email, password , role } = req.body;

    console.log("register" , name , email,password, role , req.body);

    //checking user already exist
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ message: "User Already exist", success: false });
    }



    //validing email format and strong passward
    if (!validator.isEmail(email)) {
      return res.json({ message: "Enter a valid email", success: false });
    }
    if (password.length < 8) {
      return res.json({
        message: "Please enter a strong password",
        success: false,
      });
    }
  
    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({
      name,
      email,
      password: hashPassword,
      role,
    });

    const user = await newUser.save();

    const token = createToken(user._id);
    res.json({ success: true, token, user });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
    throw error;
  }
};
const verifiedOtp = async (req, res) => {
  console.log("req" , req.body);
  try {
    const { email, otp } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.otp === otp && user.otpExpires > new Date()) {
      user.isVerified = true;
      await user.save();
      const token =await createToken(user?._id);
      res.json({ success: true , user , token , message:"OTP verified Successfully" });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP" });
    }
  } catch (error) {
    console.log(error);
    res.json({ message: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    console.log("req user" , req?.body?.userId);
    const user = await userModel.findById(req?.body?.userId);
    console.log("user" , user);
    if (!user) {
      return res.status(404).json({success:false ,  message: "User not found" });
    }
    res.status(200).json({success:true ,  user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
}

export { loginUser, registerUser, verifiedOtp , getUser };
