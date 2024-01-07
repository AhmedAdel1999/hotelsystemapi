const mongoose = require('mongoose');
const BookingSchema = new mongoose.Schema({
    room: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Room"
    },
    user: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User"
    },
    checkInDate: {
        type: Date,
        required: true,
    },
    checkOutDate: {
        type: Date,
        required: true,
    },
    amountPaid: {
        type: Number,
        required: true,
    },
    daysOfStay: {
        type: Number,
        required: true,
    },
    paymentInfo: {
        id: { type: String },
        status: { type: String },
        update_time: { type: Date },
        email_address: { type: String },
    },
    paidAt: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});
const Booking = mongoose.model("Booking", BookingSchema);
module.exports= Booking;