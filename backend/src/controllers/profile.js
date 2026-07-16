const userModel = require("../models/usermodel");

const profile = async (req, res, next) => {
    try {
        const { userId, role } = req.user;

        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const user = await userModel.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            success: true,
            message: "Profile fetched successfully",
            data: {
                user: user,
                userId: userId,
                role: role
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: error.message });
    }
};

const updateAvatar = async (req, res, next) => {
    try {
        const { userId, role } = req.user;

        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        if(!req.file){
            return res.status(400).json({ message: "Avatar is required" });
        }

        const avatarPath = req.file.path;
        const user = await userModel.findByIdAndUpdate(userId, { avatar: avatarPath }, { new: true }).select("-password")

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            success: true,
            message: "Avatar updated successfully",
            data: {
                user: user
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: error.message });
    }
}


module.exports = { profile, updateAvatar };