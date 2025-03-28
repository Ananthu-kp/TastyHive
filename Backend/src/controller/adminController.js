import User from '../model/user.model.js'
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASS;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (email !== adminEmail || password !== adminPassword) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ email }, process.env.JWT_SECRET, {
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
}

export default {
    login
}