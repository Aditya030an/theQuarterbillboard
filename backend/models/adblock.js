import mongoose from 'mongoose';

const { ObjectId } = mongoose.Schema.Types;

const adBlockSchema = new mongoose.Schema({
  adOwner: { type: String, required: true },
  startingPixel: { type: Number, required: true },
  rows: { type: Number, required: true },
  cols: { type: Number, required: true },
  price: { type: Number, required: true },
  imageURL: { type: String, required: true },                    
  pixels: [{ type: Number, required: true }],
  timestamp: { type: Date, default: Date.now },
  paymentId: { type: String },
  status: { type: Boolean, required: true },
  transactionId: { type: String },
});

const AdBlock = mongoose.model('AdBlock', adBlockSchema);
export default AdBlock;
