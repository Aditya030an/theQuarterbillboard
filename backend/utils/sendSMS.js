
import dotenv from "dotenv";
dotenv.config();

import twilio from "twilio";

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

const sendSMS = async (phone, otp) => {
    await client.messages.create({
        body: `Your OTP is: ${otp}`,
        from: process.env.TWILIO_PHONE,
        to: phone
    });
};

export default sendSMS;

