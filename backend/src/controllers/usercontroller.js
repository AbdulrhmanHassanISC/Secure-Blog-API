const user = require('../models/usermodel');

const getAllUsers = async(req,res) =>{
    try {
        const allUsers = await user.find();
        res.status(200).json(allUsers);
    } catch (error) {
        res.status(500).json({message:"something went wrong"});
    }
}

const getUserById = async(req,res) =>{
    const userid = req.params.id;
    try {
        const foundUser = await user.findById(userid);
        res.status(200).json(foundUser);
    } catch (error) {
        res.status(500).json({message:"something went wrong"});
    }
}


const updateUser = async(req,res) =>{
    try {
        const updatedUser = await user.findByIdAndUpdate(req.params.id,req.body,{new:true});
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({message:"something went wrong"});
    }
}

const deleteUser = async(req,res) =>{
    const userid = req.params.id;
    try {
        const deletedUser = await user.findByIdAndDelete(userid);
        res.status(200).json({message:"User deleted successfully" ,deletedUser});
    } catch (error) {
        res.status(500).json({message:"something went wrong"});
    }
}   

module.exports = {getAllUsers,getUserById,updateUser,deleteUser };
