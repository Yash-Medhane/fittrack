require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');
const path = require('path');

const app = express();

// ✅ Use dynamic port (Heroku sets this)
const PORT = process.env.PORT || 3000;

// ✅ Connect Database
connectDB();

// ✅ Middlewares
app.use(cors());
app.use(express.json());

// ✅ API Routes
app.use('/api', userRoutes);

// ✅ Serve static frontend files (client inside server)
app.use(express.static(path.join(__dirname, "client")));

// ✅ Fallback route (for SPA)
app.use((req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "index.html"));
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
