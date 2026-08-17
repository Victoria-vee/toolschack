import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import { AppError } from './error';
import { requestLogger } from './users/user.middleware';
import authRoutes from './users/user.routes';
import toolRoutes from "./tools/tool.routes";

dns.setDefaultResultOrder('ipv4first');
dotenv.config();
console.log("JWT_SECRET loaded:", !!process.env.JWT_SECRET);

const app = express();
const PORT = process.env.PORT || 5000;
const DATABASE_URI = process.env.DATABASE_URI || '';

app.use(express.json());
app.use(requestLogger);
app.use('/api/auth', authRoutes); 
app.use("/tools", toolRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid ID format' });
  }
  console.error('Unhandled Error:', err);
  res.status(500).json({ error: 'Something went wrong on the server' });
});
mongoose
  .connect(DATABASE_URI)
  .then(() => {
    console.log('Connected successfully to MongoDB Atlas');
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  });