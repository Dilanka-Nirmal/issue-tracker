import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/auth.routes';
import issueRoutes from './routes/issue.routes';
import { errorHandler } from './middleware/error.middleware';

dotenv.config();

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:8080',
  'http://localhost:5173',
].filter(Boolean) as string[];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
  ],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Connect to DB lazily — only when a real request comes in
// This prevents the serverless function from crashing on OPTIONS preflight
let isConnected = false;
app.use(async (req, res, next) => {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
    } catch (error) {
      console.error('DB connection failed:', error);
      return res.status(500).json({ message: 'Database connection failed' });
    }
  }
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/issues', issueRoutes);

app.get('/api/health', (_, res) => res.json({
  status: 'OK',
  allowedOrigins,
}));

app.use(errorHandler);

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

export default app;

// --- Before Deploy to Vercel--------------------------------------------------

// import express from 'express';
// import cors from 'cors';
// import cookieParser from 'cookie-parser';
// import dotenv from 'dotenv';
// import connectDB from './config/db';
// import authRoutes from './routes/auth.routes';
// import issueRoutes from './routes/issue.routes';
// import { errorHandler } from './middleware/error.middleware';

// dotenv.config();

// connectDB();

// const app = express();

// app.use(cors({
//   origin: process.env.CLIENT_URL,
//   credentials: true,
// }));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

// app.use('/api/auth', authRoutes);
// app.use('/api/issues', issueRoutes);

// app.get('/api/health', (_, res) => res.json({ status: 'OK' }));

// app.use(errorHandler);

// // Only listen when running locally — Vercel handles this in production
// if (process.env.NODE_ENV !== 'production') {
//   const PORT = process.env.PORT || 5000;
//   app.listen(PORT, () => {
//     console.log(`🚀 Server running on port ${PORT}`);
//   });
// }

// // Export for Vercel serverless
// export default app;