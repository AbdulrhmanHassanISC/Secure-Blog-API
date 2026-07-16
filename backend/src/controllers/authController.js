const User = require('../models/usermodel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    const hashedpassword = await bcrypt.hash(password, 10);

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }
        const newUser = new User({ username, email, password: hashedpassword });
        await newUser.save();
        res.status(201).json({ success: true, message: "User registered successfully", data: newUser });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || "something went wrong" });
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const foundUser = await User.findOne({ email });
        if (!foundUser) {
            return res.status(400).json({ success: false, message: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, foundUser.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid password" });
        }
        const payload = { role: foundUser.role, userId: foundUser._id };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

        return res.status(200).json({
            success: true,
            message: `welcome ${foundUser.username}`,
            data: {
                token: token,
                user: {
                    userId: foundUser._id,
                    username: foundUser.username,
                    email: foundUser.email,
                    role: foundUser.role
                }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || "something went wrong" });
    }
}


const profile = (req, res) => {
    res.status(200).json({ success: true, message: "Profile retrieved successfully", data: { user: req.user } });
}
module.exports = { registerUser, loginUser, profile }