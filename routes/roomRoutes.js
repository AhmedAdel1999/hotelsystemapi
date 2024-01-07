const express = require("express");
const roomCrtl = require('../controllers/roomController');
const authMiddle = require('../middlewares/authMiddleware');

const router = express.Router();

router.route("/").get(roomCrtl.getAll).post(authMiddle.protect, authMiddle.admin, roomCrtl.addRoom);
router.route("/:id/reviews").post(authMiddle.protect, roomCrtl.createRoomReview);
router.route("/:id").get(roomCrtl.getSingle).put(authMiddle.protect, roomCrtl.updateRoom).delete(authMiddle.protect, authMiddle.admin, roomCrtl.deleteRoom);

module.exports= router;