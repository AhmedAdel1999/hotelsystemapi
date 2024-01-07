const jwt =require('jsonwebtoken');
const asyncHandler =require('express-async-handler');
const User =require('../models/User');
const authMiddle={
    protect: asyncHandler(async (req, res, next) => {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            try {
                token = req.headers.authorization.split(" ")[1];
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.user = await User.findById(decoded.id).select("-password");
                next();
            }
            catch (error) {
                console.log(error.message);
                res.status(401);
                throw new Error("no token1");
            }
        }
        if (!token) {
            res.status(401);
            throw new Error("no token2, no auth");
        }
    }),
    admin:(req, res, next) => {
        if (req.user && req.user.isAdmin) {
            next();
        }
        else {
            res.status(401);
            console.log("her")
            throw new Error("no token3, no auth");
        }
    }
}
module.exports = authMiddle;