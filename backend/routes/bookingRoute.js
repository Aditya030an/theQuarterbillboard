import express from "express";
import bookingModel from "../models/bookingModels.js";
import authUser from "../middleware/auth.js";
import {
  createBooking,
  getAllBookings,
} from "../controllers/bookingController.js";

const bookingRouter = express.Router();
// Route to create a new booking
bookingRouter.post("/createBooking", authUser , createBooking);

// Route to get all bookings
bookingRouter.get("/getAllBookings" , getAllBookings);

export default bookingRouter;
