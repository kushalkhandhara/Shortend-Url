import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { connectToDB } from './db.js';
 
import authRoutes from './routes/auth.js';
import linkRoutes from './routes/links.js';
import clickRoutes from "./routes/click.js"

dotenv.config();
const app = express();
const port = process.env.PORT || 5001;

// Allow credentials and specify the origin explicitly
const corsOptions = {
  origin: 'http://localhost:5173', // This should match the frontend's origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  credentials: true, // Allow cookies and authentication credentials
};

// Apply CORS middleware
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.set('trust proxy', true);

// Connect to MongoDB
connectToDB();


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/links', linkRoutes);
app.use("/",clickRoutes)


app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
});
