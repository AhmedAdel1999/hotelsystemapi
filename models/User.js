const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please fill a valid email address",
        ],
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true
});
UserSchema.pre("save", async function (next) {
    const user = this;
    if (!user.isModified("password"))
        return next();
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(user.password, salt);
    user.password = hash;
    next();
});
UserSchema.methods.comparePassword = function (entredPassword) {
    const user = this;
    return bcrypt.compareSync(entredPassword, user.password);
};
const User = mongoose.model("User", UserSchema);
module.exports= User;