import express from 'express';
const app = express()
import dotenv from 'dotenv'
dotenv.config()
import { connectDB } from './database/db.js';
connectDB()
import cookieParser from 'cookie-parser';
import cors from 'cors';
import userRoute from './routes/userRoutes.js'
import adminRoute from './routes/adminRoutes.js'
import menuRoute from './routes/menuRoutes.js'


app.use(express.json());
app.use(cookieParser());
const corsOptions = {
    origin: "https://frontendv2-mu.vercel.app", 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, 
};
app.use(cors(corsOptions));

// Explicitly handle preflight OPTIONS request
app.options('*', cors(corsOptions)); 

  

app.use('/', userRoute);
app.use('/admin', adminRoute);
app.use("/api/menu", menuRoute); 

if (process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Server is Running on: http://localhost:${port}/`));
}


export default app