const asyncHandler =require('express-async-handler');
const Room =require('../models/Room');
// @Desc Get All Rooms
// @Route /api/rooms
// @Method GET
const roomCrtl={
    getAll:asyncHandler(async (req, res) => {
        const pageSize = 4;
        const page = Number(req.query.pageNumber) || 1;
        const keyword = req.query.keyword ? {
            $or: [
                { name: { $regex: req.query.keyword, $options: "i" } },
                { description: { $regex: req.query.keyword, $options: "i" } },
            ]
        }
            : {};
        const numOfBeds = req.query.numOfBeds ? { numOfBeds: req.query.numOfBeds } : {};
        const category = req.query.roomType ? { category: req.query.roomType } : {};
        const count = await Room.countDocuments(Object.assign(Object.assign(Object.assign({}, keyword), numOfBeds), category));
        const rooms = await Room.find(Object.assign(Object.assign(Object.assign({}, keyword), numOfBeds), category)).limit(pageSize)
            .skip(pageSize * (page - 1));
        res.status(201).json({
            rooms,
            page,
            pages: Math.ceil(count / pageSize),
            count
        });
    }),
    searchRooms:asyncHandler(async (req, res) => {
        const filterd = await Room.find({ $and: [
                { $or: [{ name: req.query.keyword }, { description: req.query.keyword }] },
                { numOfBeds: req.query.numOfBeds },
                { category: req.query.roomType }
            ] });
        res.status(201).json(filterd);
    }),
    getSingle:asyncHandler(async (req, res) => {
        const room = await Room.findById(req.params.id);
        if (!room) {
            res.status(401);
            throw new Error("Room not found");
        }
        res.status(201).json(room);
    }),
    addRoom:asyncHandler(async (req, res) => {
        req.body.user = req.user._id;
        const room = await Room.create(req.body);
        res.status(201).json(room);
    }),
    updateRoom:asyncHandler(async (req, res) => {
        let room = await Room.findById(req.params.id);
        if (!room) {
            res.status(401);
            throw new Error("Room not found");
        }
        room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(201).json(room);
    }),
    deleteRoom:asyncHandler(async (req, res) => {
        let room = await Room.findById(req.params.id);
        if (!room) {
            res.status(401);
            throw new Error("Room not found");
        }
        room = await Room.findByIdAndDelete(req.params.id);
        res.status(201).json({});
    }),
    createRoomReview:asyncHandler(async (req, res) => {
        var _a, _b, _c, _d, _e;
        const room = await Room.findById(req.params.id);
        if (room) {
            const alreadyReviewd = (_a = room.reviews) === null || _a === void 0 ? void 0 : _a.find(review => review.user.toString() === req.user._id.toString());
            if (alreadyReviewd) {
                res.status(401);
                throw new Error("Already reviewed");
            }
            const { rating, comment } = req.body;
            const review = {
                user: req.user._id,
                name: req.user.name,
                rating: Number(rating),
                comment,
            };
            (_b = room.reviews) === null || _b === void 0 ? void 0 : _b.push(review);
            room.numOfReviews = (_c = room.reviews) === null || _c === void 0 ? void 0 : _c.length;
            room.ratings = ((_d = room.reviews) === null || _d === void 0 ? void 0 : _d.reduce((acc, item) => (item === null || item === void 0 ? void 0 : item.rating) + acc, 0)) / Number((_e = room.reviews) === null || _e === void 0 ? void 0 : _e.length);
            await room.save();
            res.status(201).json({ message: "Review added" });
        }
        else {
            res.status(401);
            throw new Error("Room not found");
        }
    })
}
module.exports = roomCrtl;