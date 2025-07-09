import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  bookingType: {
    type: String,
    required: true,
  },
  plan: {
    type: Object,
    required: true,
  },
  dateTime: {
    type: Date,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const bookingModel = mongoose.models.booking || mongoose.model("booking", bookingSchema);

export default bookingModel;
