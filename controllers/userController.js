const asyncHandler =require("express-async-handler");
const bcrypt =require('bcrypt');
const User =require("../models/User");
const generateToken =require("../utils/generateToken");
// @Desc Register user
// @Route /api/users/register
// @Method POST
const userCrtl={
    register:asyncHandler(async (req, res) => {
        const { name, email, password, avatar } = req.body;
        const user = new User({
            name,
            email,
            password,
            avatar
        });
        await user.save();
        res.status(201).json({
            id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        });
    }),
    login:asyncHandler(async (req, res) => {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            res.status(401);
            throw new Error("User not found");
        }
        if (await user.comparePassword(password)) {
            res.status(201).json({
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                isAdmin: user.isAdmin,
                token: generateToken(user._id)
            });
        }
        else {
            res.status(401);
            throw new Error("Email or password incorrect");
        }
    }),
    updateProfile:asyncHandler(async (req, res) => {
        let user = await User.findById(req.user.id);
        if (!user) {
            res.status(401);
            throw new Error("User not found");
        }
        const { name, email, avatar } = req.body;
        console.log(name, email, avatar)
        user = await User.findByIdAndUpdate(req.user.id, {
            name, email, avatar
        }, { new: true }).select("-password");
        res.status(201).json({
            id: user === null || user === void 0 ? void 0 : user._id,
            name: user === null || user === void 0 ? void 0 : user.name,
            email: user === null || user === void 0 ? void 0 : user.email,
            avatar: user === null || user === void 0 ? void 0 : user.avatar,
            isAdmin: user === null || user === void 0 ? void 0 : user.isAdmin,
            token: generateToken(user === null || user === void 0 ? void 0 : user._id)
        });
    }),
    updatePassword:asyncHandler(async (req, res) => {
        let user = await User.findById(req.user.id);
        if (!user) {
            res.status(401);
            throw new Error("User not found");
        }
        const { oldPassword, newPassword } = req.body;
        if ((await user.comparePassword(oldPassword))) {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(newPassword, salt);
            user = await User.findByIdAndUpdate(req.user.id, {
                password: hash
            }, { new: true });
            res.status(201).json({
                id: user === null || user === void 0 ? void 0 : user._id,
                name: user === null || user === void 0 ? void 0 : user.name,
                email: user === null || user === void 0 ? void 0 : user.email,
                avatar: user === null || user === void 0 ? void 0 : user.avatar,
                isAdmin: user === null || user === void 0 ? void 0 : user.isAdmin,
                token: generateToken(user === null || user === void 0 ? void 0 : user._id)
            });
        }
        else {
            res.status(401);
            throw new Error("Old password incorrect");
        }
    }),
    getAll:asyncHandler(async (req, res) => {
        const pageSize = 4;
        const page = Number(req.query.pageNumber) || 1;
        const count = await User.countDocuments();
        const users = await User.find({}).select("-password").limit(pageSize).skip(pageSize * (page - 1));
        res.status(201).json({
            users,
            page,
            pages: Math.ceil(count / pageSize),
            count
        });
    }),
    getSingleUser:asyncHandler(async (req, res) => {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) {
            res.status(401);
            throw new Error("User not found");
        }
        res.status(201).json(user);
    }),
    updateUser:asyncHandler(async (req, res) => {
        let user = await User.findById(req.params.id);
        if (!user) {
            res.status(401);
            throw new Error("User not found");
        }
        user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-password");
        res.status(201).json(user);
    }),
    deleteUser:asyncHandler(async (req, res) => {
        let user = await User.findById(req.params.id);
        if (!user) {
            res.status(401);
            throw new Error("User not found");
        }
        await User.findByIdAndDelete(req.params.id);
        res.status(201).json({});
    })
}
module.exports = userCrtl;