const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// 1️⃣ Init app
const app = express();

// 2️⃣ Middleware
dotenv.config();
app.use(cors());
app.use(express.json());

// 3️⃣ Connect MongoDB
connectDB();

// 4️⃣ Routes
app.use('/api/polls', require('./routes/pollRoutes'));
app.use('/api/auth', require('./routes/authRoutes')); // if you have auth

// 5️⃣ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
