import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { connectDB } from './database/db.js';
import userRoute from './routes/userRoutes.js';
import adminRoute from './routes/adminRoutes.js';
import menuRoute from './routes/menuRoutes.js';

dotenv.config();
const app = express();

// Connect to Database
connectDB();

app.use(express.json());
app.use(cookieParser());

// Proper CORS configuration
const corsOptions = {
    origin: "https://frontendv2-mu.vercel.app", 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight OPTIONS requests
app.options('*', (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "https://frontendv2-mu.vercel.app");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.sendStatus(200);
});

// Define API routes
app.use('/', userRoute);
app.use('/admin', adminRoute);
app.use("/api/menu", menuRoute);

// Start the server only in development
if (process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Server is running on http://localhost:${port}/`));
}

export default app;
