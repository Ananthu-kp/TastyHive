import express from 'express';
const app = express();
import dotenv from 'dotenv';
dotenv.config();
import { connectDB } from './database/db.js';
connectDB();
import cookieParser from 'cookie-parser';
import cors from 'cors';
import userRoute from './routes/userRoutes.js';
import adminRoute from './routes/adminRoutes.js';
import menuRoute from './routes/menuRoutes.js';

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5173",  
  "https://frontendv2-mu.vercel.app", 
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));

// Explicitly handle preflight OPTIONS request
app.options('*', cors(corsOptions));

app.use('/', userRoute);
app.use('/admin', adminRoute);
app.use('/api/menu', menuRoute);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on: http://localhost:${port}/`));

export default app;
