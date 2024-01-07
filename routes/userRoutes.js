const express = require('express');
const authMiddle = require('../middlewares/authMiddleware');
const userCrtl = require('../controllers/userController');

const router = express.Router();

router.route("/").get(authMiddle.protect, authMiddle.admin, userCrtl.getAll);
router.route("/:id").put(authMiddle.protect, authMiddle.admin, userCrtl.updateUser).get(authMiddle.protect, authMiddle.admin, userCrtl.getSingleUser).delete(authMiddle.protect, authMiddle.admin, userCrtl.deleteUser);
router.route("/register").post(userCrtl.register);
router.route("/login").post(userCrtl.login);
router.route("/update/profile").put(authMiddle.protect, userCrtl.updateProfile);
router.route("/update/password").put(authMiddle.protect, userCrtl.updatePassword);

module.exports=  router;