const express =require('express');
const bookingCrtl =require('../controllers/bookingController');
const authMiddle =require('../middlewares/authMiddleware');

const router = express.Router();

router.route("/").post(authMiddle.protect, bookingCrtl.newBooking).get(authMiddle.protect, authMiddle.admin, bookingCrtl.getAll);
router.route("/me").get(authMiddle.protect, bookingCrtl.myBookings);
router.route("/check").post(bookingCrtl.checkRoomIsAvailble);
router.route("/dates/:roomId").get(bookingCrtl.getBookedDates);
router.route("/:id").delete(authMiddle.protect, authMiddle.admin, bookingCrtl.deleteBooking);

module.exports= router;