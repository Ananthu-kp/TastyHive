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

const allowedOrigins = [
    "https://tasty-hive.vercel.app",
    "https://frontendv2-mu.vercel.app",
    "http://localhost:5173" 
  ];
  
  const corsOptions = {
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  };
  
  app.use(cors(corsOptions));
  
  // Simplify your OPTIONS handler
  app.options('*', cors(corsOptions));

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
