import mongoose from "mongoose";
import { User } from "../models/User.js";
import bcrypt from 'bcrypt';

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}); // Exclude password field
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {

    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updates = { ...req.body };

    // 1. HANDLE PASSWORD SECURELY
    if (updates.password && updates.password.trim() !== "") {
        // If admin typed a new password, hash it!
        const hashedPassword = await bcrypt.hash(updates.password, 10);
        updates.password = hashedPassword;
    } else {
        // If admin left it blank, remove it so the old password stays safe
        delete updates.password;
    }

    // 2. ADJUST RESTRICTIONS
    // You should probably remove 'delete updates.email' if you want admins to edit emails.
    // I am leaving role and feesDetails deleted just in case you want to lock them.
    // delete updates.role; 
    // delete updates.email; 
    delete updates.feesDetails; 

    // 3. FIND AND UPDATE USER
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Apply all updates to the user object
    Object.keys(updates).forEach((key) => {
        user[key] = updates[key];
    });

    // Save triggers validation and database update
    await user.save();

    // 4. RETURN CLEAN DATA
    const userObj = user.toObject();
    delete userObj.password; // Don't send the hash back to the frontend

    res.status(200).json(userObj);
    
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export { getAllUsers, deleteUser, updateUser };