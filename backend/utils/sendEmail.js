import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

export  async function sendEmailOtp(to, otp) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    await transporter.sendMail({
        from: `"OTP Service " <${process.env.EMAIL_USER}>`,
        to,
        subject: "Your OTP Code",
        text: `Your OTP is: ${otp}`
    });
}

export async function sendEmailBookingConfirm(to, subject, message) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    await transporter.sendMail({
        from: `"Booking Confirmation" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text: message
    });
}

export async function sendReferralEmail(by , to, referralCode , message) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    await transporter.sendMail({
        from: `"Referral Service" <${by}>`,
        to,
        subject: "You've been referred!",
        text: message ,
    });
}

export async function sendPhysioconnectEmail(to, subject, message) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    await transporter.sendMail({
        from: `"Physioconnect Service" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text: message
    });
}
