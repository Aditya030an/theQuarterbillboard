import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({
    path:".env"
})
console.log("mongoDb" , process.env.MONGO_URI);

const databaseConnection = ()=>{
    mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log("MongoDb connect successfully");
    }).catch((error)=>{
        console.log(error);
    })
};

export default databaseConnection;