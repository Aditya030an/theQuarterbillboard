import Razorpay from 'razorpay';
import dotenv from 'dotenv';
dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_LIVE_KEY,
  key_secret: process.env.RAZORPAY_LIVE_SECRET,
});

export default async function Purchase(req,res){
    try{

        const { amount, name, email, phoneNumber } = req.body

        const paymentLink = await razorpay.paymentLink.create({
            amount: amount * 100,
            currency: 'INR',
            customer:{
                name, email, contact: String(phoneNumber)
            },
            notify: { email: true, sms: true },
            callback_url: `http://localhost:3000/success`,
            notes: {
                email: email,
            }
        });

        return res.status(200).json({ url: paymentLink.short_url });
        
    } catch(error){
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error", error })
    }

}