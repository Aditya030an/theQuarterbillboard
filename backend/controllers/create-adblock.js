import AdBlock from '../models/adblock.js'; 
import Razorpay from 'razorpay';
import dotenv from 'dotenv';
dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


export default async function createAdBlock(req, res) {
  try {
    const { adOwner, startingPixel, rows, cols, price, pixels, name, email  } = req.body;

    // Validate input
    if (!adOwner || !startingPixel || !rows || !cols || !price || !pixels || req.file === undefined) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const imageURL =  req.file.path // Use uploaded file path if available
    const paymentLink = await razorpay.paymentLink.create({
            amount: 600 * 100,
            currency: 'INR',
            customer:{
                name, email
            },
            notify: { email: true },
            callback_url: `http://localhost:3000/success`,
            notes: {
                email: email,
            }
      });
    // Create new ad block
    const newAdBlock = new AdBlock({
      adOwner,
      startingPixel,
      rows,
      cols,
      price,
      imageURL,
      status: false,
      pixels: JSON.parse(pixels)
    });

    // Save to database
    await newAdBlock.save();

    return res.status(201).json({ url: paymentLink.short_url, AdBlock });

  } catch (error) {
    console.error('Error creating ad block:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}