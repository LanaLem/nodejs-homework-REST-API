
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user');
require('dotenv').config();
const { SECRET_KEY } = process.env;
const gravatar = require("gravatar");
const fs = require("fs/promises");
const path = require("path");
const jimp = require("jimp");

const register = async (req, res, next) => {
    const { email, password, subscription } = req.body;
    const avatarURL = gravatar.url(email, { s: "250", r: "pg", d: "404" }, true)
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
        return res.status(409).json({ "message": 'Email in use' });
    }

    try {
        const user = new User({ email, password, subscription, avatarURL });
        await user.save();
        return res.status(201).json({
            user: {
                email,
                subscription: user.subscription,
                avatarURL
            },
        });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    const passwordCheck = await bcrypt.compare(password, user.password);
    if (!user || !passwordCheck) {
        return res.status(401).json({ "message": 'Email or password is wrong' });
    }

    const token = jwt.sign({ _id: user._id }, SECRET_KEY, { expiresIn: '15m' });
    user.token = token
    await User.findByIdAndUpdate(user._id, user)
    return res.status(200).json({
        token,
        user: {
            email,
            subscription: user.subscription,
        },
    });
};

const logout = async (req, res, next) => {
    const { user } = req;
    if (!user) {
        return res.status(401).json({ "message": 'Not authorized' });
    }
    user.token = null;
    await User.findByIdAndUpdate(user._id, user, { new: true });

    return res.status(204).json({ "message": 'No Content' });
};

const currentUser = async (req, res, next) => {
    const { user } = req;
    const currentUser = await User.findOne({ token: user.token });

    return res.status(200).json({
        user: {
            email: currentUser.email,
            subscription: currentUser.subscription,
        },
    });
};

const updateSubscription = async (req, res, next) => {
    const { subscription } = req.body;
    const { _id } = req.user;
    const updatedUsersSubscription = await User.findByIdAndUpdate(
        _id,
        { subscription },
        { new: true }
    );

    return res.status(200).json({
        user: {
            email: updatedUsersSubscription.email,
            subscription: updatedUsersSubscription.subscription,
        }
    },);
};

async function changeAvatarUrl(req, res, next) {
    const { _id } = req.user
    const newPath = path.join(__dirname, "../../public/avatars", req.file.filename);

    const fileName = _id + `_${req.file.filename}`;
    try {
        const file = await jimp.read(req.file.path);
        file.resize(250, 250).write(req.file.path);
        await fs.rename(req.file.path, newPath);
        const avatarUrl = path.join("public", "avatars", fileName);

        await User.findByIdAndUpdate(_id, { avatarUrl }, { new: true });
        return res.status(200).json({ avatarUrl });
    } catch (error) {
        await fs.unlink(req.file.path);
        throw error;
    }
}

module.exports = {
    register,
    login,
    logout,
    currentUser,
    updateSubscription,
    changeAvatarUrl,
};
