import Razorpay from 'razorpay';
import dotenv from 'dotenv';
import { createHmac } from 'crypto';
import AdBlock from '../models/adblock.js';
dotenv.config();

export default async function RazorPayWebhook(req,res){
    try{
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

        const payload = req.body; 
        const signature = req.headers['x-razorpay-signature'];
        const expectedSignature = createHmac('sha256', secret).update(payload).digest('hex');
        if (expectedSignature !== signature) {
          console.log("The payload: ", payload)
          console.log("The expected signature : ", expectedSignature)
          console.log("The signature I received : ", signature)
          console.log("Invalid signature!")
          return res.status(400).json({ message: 'Invalid signature' });
        }

        const event = JSON.parse(payload.toString());
        console.log("THE EVENT : ", event)

        if (event.event === 'payment_link.paid') {
            console.log("EVENT DETAILS: ", event)
            const payment = event.payload.payment.entity;
            const paymentLink = event.payload.payment_link.entity;
            const email = event.payload.payment_link.entity.notes.email;
            
            // Send Razorpay response ✅ fast
            const adBlock = await AdBlock.find({ email, status: false }).sort({ timestamp: -1 })
            await adBlock.findByIdAndUpdate(adBlock._id, { $set: { transactionId: paymentLink.id, paymentId: payment.id, status: true }},  { new: true })

            return res.status(200).json({ message: "Webhook received" });

            
        }

    } catch(error){
        console.log("Error: ", error)
        return res.status(500).json({ message: "Internal Server Error", error })
    }

}