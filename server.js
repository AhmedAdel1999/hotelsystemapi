const express =require('express');
const cors =require('cors');
const dotenv =require('dotenv');
const path =require('path');
const connectDB =require('./config/db');
// Routes
const roomRoutes =require('./routes/roomRoutes');
const userRoutes =require('./routes/userRoutes');
const bookingRoutes =require('./routes/bookingRoutes');
const uploadRoutes =require('./routes/uploadRoutes');
const errorMiddle = require('./middlewares/errorMiddleware');
const app = express();
dotenv.config();
connectDB();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "./uploads")));
// Default 
app.get("/api", (req, res) => {
    res.status(201).json({ message: "Welcome to Hotel Booking App" });
});
// Room Route
app.use("/api/rooms", roomRoutes);
// User Route
app.use("/api/users", userRoutes);
// Booking Route
app.use("/api/bookings", bookingRoutes);
// Upload Route
app.use("/api/uploads", uploadRoutes);
app.get("/api/config/paypal", (req, res) => {
    res.status(201).send(process.env.PAYPAL_CLIENT_ID);
});
app.use(errorMiddle.errorHandler);
app.use(errorMiddle.notFound);
const PORT = 5000;
app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));