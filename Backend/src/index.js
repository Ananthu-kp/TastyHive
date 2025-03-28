import express from 'express';
const app = express()
import dotenv from 'dotenv'
dotenv.config()
import { connectDB } from './database/db.js';
connectDB()
import cookieParser from 'cookie-parser';
import cors from 'cors';
import userRoute from './routes/userRoutes.js'


app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    methods:    'GET, POST, PUT, DELETE, PATCH',
    credentials: true,
}));

app.use('/', userRoute);
// app.use('/admin', adminRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is Running on: http://localhost:${port}/`))