import express from "express";

import { getUser, loginUser , registerUser  , verifiedOtp } from "../controllers/userController.js";
import authUser from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/register" , registerUser);

userRouter.post("/login" , loginUser);

userRouter.post("/verifiedOtp" , verifiedOtp);

userRouter.get("/getUser",authUser , getUser);

export default userRouter;