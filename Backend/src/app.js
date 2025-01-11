require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const seedRoutes = require('./routes/seedRoutes');
const transactionRoutes = require('../src/routes/transactionRoutes');
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
/*const corsOptions = {
  origin: 'http://localhost:5173/',  // Your frontend URL
  methods: 'GET,POST,PUT,DELETE',  // Allowed HTTP methods
  allowedHeaders: 'Content-Type,Authorization',  // Allowed headers
};*/

// Middleware
app.use(cors({
    origin: "http://localhost:5173", 
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/transactions', transactionRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

// Routes
app.use('/api/seed', seedRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});