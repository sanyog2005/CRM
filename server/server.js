const express = require('express');
const cors = require('cors');
require('dotenv').config();

// --- 1. IMPORT ROUTES ---
const authRoutes = require('./routes/authRoutes');
const staffRoutes = require('./routes/staffRoutes');
const branchRoutes = require('./routes/branchRoutes');
const leadRoutes = require('./routes/leadRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const profileRoutes = require('./routes/profileRoutes');

const app = express();


// --- 2. MIDDLEWARE ---

// --- UPDATE THIS SECTION ---
app.use(cors({
    origin: [
        "http://localhost:5173", // Vite default
        "http://127.0.0.1:5173", // Vite IP
        "http://localhost:3000", // React Create App default
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
// ---------------------------

app.use(express.json()); 

// ... rest of your code

// ----------------------------------------

// ... database connection


// --- 3. MOUNT ROUTES ---
// The first argument is the "base prefix" for the routes in that file.
// ... imports above



// Auth Routes (login/signup) -> /api/login, /api/signup
app.use('/api', authRoutes); 

// Staff Routes -> /api/staff
app.use('/api/staff', staffRoutes);

// Branch Routes -> /api/branches
app.use('/api/branches', branchRoutes);

// Lead Routes -> /api/leads
app.use('/api/leads', leadRoutes);

// Dashboard Routes -> /api/dashboard
app.use('/api/dashboard', dashboardRoutes);

// Profile Routes -> /api/profile
app.use('/api/profile', profileRoutes);


// --- 4. START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`------------------------------------------------`);
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`------------------------------------------------`);
});