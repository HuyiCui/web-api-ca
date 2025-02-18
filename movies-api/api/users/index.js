import express from 'express';
import User from './userModel';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import Favourite from "../favourites/favouriteModel";

const router = express.Router(); // eslint-disable-line

// Get all users
router.get(
    '/',
    asyncHandler(async (req, res) => {
        const users = await User.find();
        res.status(200).json(users);
    })
);

// register(Create)/Authenticate User
router.post('/', asyncHandler(async (req, res) => {
    try {
        if (!req.body.username || !req.body.password) {
            return res.status(400).json({ success: false, msg: 'Username and password are required.' });
        }
        if (req.query.action === 'register') {
            await registerUser(req, res);
        } else {
            await authenticateUser(req, res);
        }
    } catch (error) {
        // Log the error and return a generic error message
        console.error(error);
        res.status(500).json({ success: false, msg: 'Internal server error.' });
    }
}));

// Update a user
router.put(
    '/:id',
    asyncHandler(async (req, res) => {
        const { id } = req.params;
        const updateData = req.body;

        if (updateData._id) delete updateData._id;

        const result = await User.updateOne({ _id: id }, updateData);

        if (result.matchedCount) {
            res.status(200).json({ code: 200, msg: 'User updated successfully.' });
        } else {
            res.status(404).json({ code: 404, msg: 'Unable to update user.' });
        }
    })
);

async function registerUser(req, res) {
    // Add input validation logic here
    await User.create(req.body);
    res.status(201).json({ success: true, msg: 'User successfully created.' });
}

async function authenticateUser(req, res) {
    const user = await User.findByUserName(req.body.username);
    if (!user) {
        return res.status(401).json({ success: false, msg: 'Authentication failed. User not found.' });
    }

    const isMatch = await user.comparePassword(req.body.password);
    if (isMatch) {
        const token = jwt.sign({ username: user.username }, process.env.SECRET);
        res.status(200).json({ success: true, token: 'BEARER ' + token });
    } else {
        res.status(401).json({ success: false, msg: 'Wrong password.' });
    }
}

router.post('/:id/favourites', asyncHandler(async (req, res) => {
    const { id } = req.params; // 用户ID
    const { movieId } = req.body; // 电影ID

    if (!id || !movieId) {
        return res.status(400).json({ success: false, msg: "User ID and Movie ID are required." });
    }

    const existingFavourite = await Favourite.findOne({ userId: id, movieId });
    if (existingFavourite) {
        return res.status(400).json({ success: false, msg: "Movie is already in favourites." });
    }

    const favourite = new Favourite({ userId: id, movieId });
    await favourite.save();

    res.status(201).json({ success: true, msg: "Movie added to favourites!" });
}));

router.get('/:id/favourites', asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ success: false, msg: "User ID is required." });
    }

    const favourites = await Favourite.find({ userId: id });
    res.status(200).json({ success: true, favourites });
}));

export default router;
