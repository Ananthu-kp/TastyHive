import User from '../model/user.model.js'
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
dotenv.config();

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASS;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (email === adminEmail && password === adminPassword) {
            const token = jwt.sign({ email, isAdmin: true }, process.env.JWT_SECRET, {
                expiresIn: '1h',
            });

            return res.status(200).json({
                message: "Login successful",
                token,
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        console.log("User found:", user);
        console.log("Password match:", isPasswordValid);
        console.log("isAdmin:", user.isAdmin);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        if (!user.isAdmin) {
            return res.status(403).json({ message: "Access denied. Not an admin." });
        }

        const token = jwt.sign({ email, isAdmin: user.isAdmin }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.status(200).json({
            message: "Login successful",
            token,
        });
    } catch (error) {
        console.error("Error in admin login controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const { name } = req.query;
        let filter = {};

        if (name) {
            filter = { fullName: { $regex: name, $options: "i" } }; 
        }

        const users = await User.find(filter, "fullName email isAdmin");
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


const promoteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndUpdate(id, { isAdmin: true }, { new: true });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User promoted to admin", user });
    } catch (error) {
        console.error("Error promoting user:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const demoteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndUpdate(id, { isAdmin: false }, { new: true });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User demoted to normal user", user });
    } catch (error) {
        console.error("Error demoting user:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export default {
    login,
    getAllUsers,
    promoteUser,
    demoteUser
}