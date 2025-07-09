import express from "express";
import cors from "cors";
import 'dotenv/config'
import connectDb from "./config/mongodb.js";
import userRouter from "./routes/userRoute.js";
import bookingRouter from "./routes/bookingRoute.js";

//App config
const app = express();
const port = process.env.PORT || 4000;
connectDb();


//middewares

app.use(express.json());
app.use(cors());

//api end points
app.use("/api/user" , userRouter);
app.use("/api/booking" , bookingRouter);

app.get("/" ,(req , res)=>{
    res.send("API working")
})

app.listen(port , ()=>{
    console.log("server started on PORT:" + port)
})