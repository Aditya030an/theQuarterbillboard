import express from 'express';
import bookingModel from '../models/bookingModels.js';

const createBooking = async (req, res) => {
  try {
    const { userId, plan, dateTime, city, location , bookingType } = req.body;

    // Validate required fields
    if (!userId || !plan || !dateTime || !city || !location || !bookingType) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Create a new booking
    const newBooking = new bookingModel({
      userId,
      bookingType,
      plan,
      dateTime,
      city,
      location,
    });

    // Save the booking to the database
    await newBooking.save();

    res.status(201).json({ success: true, message: 'Booking created successfully', booking: newBooking });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const bookings = await bookingModel.find().populate();
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export { createBooking  , getAllBookings };
