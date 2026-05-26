const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const bcrypt = require('bcrypt'); // 1. Import bcrypt at the top
const app = express();

// Middleware
// ... imports





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
// ----
app.use(express.json()); // Built-in alternative to body-parser
// ----------------------------------------

// ... database connection


app.use(bodyParser.json());

// Database Connection
const db = mysql.createPool({
    host: '127.0.0.1',
    port: 3307, // Check your XAMPP port (3306 or 3307)
    user: 'root',
    password: '',
    database: 'lead_management_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

db.getConnection((err) => {
    if (err) console.log("DB Connection Failed: ", err);
    else console.log("Connected to MySQL Database");
});

// --- ROUTES ---

// ... existing imports ...

// LOGIN ROUTE
// LOGIN ROUTE
// ✅ Make sure bcrypt is imported at the top
// const bcrypt = require('bcrypt'); 

app.post('/api/login', (req, res) => {
    console.log("------------------------------------------------");
    console.log("Login Attempt Received for:", req.body.email); 

    // 1. CHANGE SQL: Only search by email (don't check password here)
    const sql = "SELECT * FROM users WHERE email = ?";
    
    db.query(sql, [req.body.email], async (err, data) => {
        if (err) {
            console.error("❌ Database Error:", err);
            return res.status(500).json("Login error");
        }
        
        console.log("🔍 Database Found User:", data.length > 0 ? "Yes" : "No");

        // 2. CHECK IF USER EXISTS
        if (data.length === 0) {
            console.log("❌ User not found with this email.");
            return res.status(401).json("Invalid email or password");
        }

        const user = data[0];

        // 3. COMPARE PASSWORD (The Magic Step)
        // bcrypt.compare(plainPassword, hashedPassword)
        const isMatch = await bcrypt.compare(req.body.password, user.password);

        if (!isMatch) {
            console.log("❌ Password did NOT match hash.");
            return res.status(401).json("Invalid email or password");
        }

        // 4. SUCCESS
        console.log("✅ Password Matched! Logging in...");
        const { password, ...userData } = user; 
        return res.json(userData);
    });
});




// ... (Existing Database Connection code) ...

// --- SIGNUP ROUTE ---
app.post('/api/signup', async (req, res) => {
    const { fullName, email, password, role } = req.body;

    try {
        // 1. Check if user already exists
        const checkSql = "SELECT * FROM users WHERE email = ?";
        db.query(checkSql, [email], async (err, data) => {
            if (err) return res.status(500).json("Database error checking user");
            
            if (data.length > 0) {
                return res.status(409).json("Email already exists. Please login.");
            }

            // 2. Hash the password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // 3. Insert new user
            // Ensure role is lowercase to match MySQL ENUM ('admin', 'manager', 'staff')
            const insertSql = "INSERT INTO users (`name`, `email`, `password`, `role`) VALUES (?)";
            const values = [
                fullName,
                email,
                hashedPassword,
                role.toLowerCase() // Convert "Staff" -> "staff"
            ];

            db.query(insertSql, [values], (err, data) => {
                if (err) return res.status(500).json("Error creating user");
                return res.status(200).json("User registered successfully");
            });
        });

    } catch (err) {
        return res.status(500).json("Internal server error");
    }
});


// ✅ Ensure bcrypt is imported at the top
// const bcrypt = require('bcrypt');

// --- ADMIN STAFF MANAGEMENT (Directly Manages 'users' table) ---

// 1. GET ALL STAFF (Fetches Users)
app.get('/api/staff', (req, res) => {
    // We select everything EXCEPT the password for security
    const sql = "SELECT id, name, email, role, dept, branch, status, phone, created_at FROM users ORDER BY created_at DESC";
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json(data);
    });
});

// 2. ADD NEW STAFF (Creates Loginable User)
app.post('/api/staff', async (req, res) => {
    // 1. Hash the default password set by Admin
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const sql = "INSERT INTO users (`name`, `email`, `password`, `role`, `dept`, `branch`, `status`, `phone`) VALUES (?)";
    const values = [
        req.body.name,
        req.body.email,
        hashedPassword, // Store Hashed Password
        req.body.role.toLowerCase(), // Ensure 'manager'/'staff' is lowercase
        req.body.dept,
        req.body.branch,
        req.body.status,
        req.body.phone
    ];

    db.query(sql, [values], (err, data) => {
        if (err) {
            console.error(err);
            if (err.code === 'ER_DUP_ENTRY') return res.status(409).json("Email already exists");
            return res.status(500).json(err);
        }
        return res.json("Staff member added successfully");
    });
});

// 3. UPDATE STAFF DETAILS
app.put('/api/staff/:id', (req, res) => {
    // Note: This endpoint does NOT update password (for security). 
    // Create a separate 'Reset Password' endpoint if needed.
    const sql = "UPDATE users SET `name`=?, `role`=?, `dept`=?, `branch`=?, `status`=?, `email`=?, `phone`=? WHERE id=?";
    const values = [
        req.body.name, 
        req.body.role.toLowerCase(), 
        req.body.dept, 
        req.body.branch, 
        req.body.status, 
        req.body.email, 
        req.body.phone, 
        req.params.id
    ];
    db.query(sql, values, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json("Staff details updated");
    });
});

// 4. DELETE STAFF (Revokes Access)
app.delete('/api/staff/:id', (req, res) => {
    const sql = "DELETE FROM users WHERE id = ?";
    db.query(sql, [req.params.id], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json("User removed");
    });
});

// --- REMOVE THE OLD /api/signup ROUTE IF YOU WANT TO DISABLE PUBLIC SIGNUP ---
// ... (Existing Login and Lead routes) ...
// --- BRANCH MANAGEMENT ROUTES ---

// 1. GET ALL BRANCHES (With Manager Name)
app.get('/api/branches', (req, res) => {
    const sql = `
        SELECT b.*, u.name as manager_name 
        FROM branches b 
        LEFT JOIN users u ON b.manager_id = u.id 
        ORDER BY b.created_at DESC
    `;
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json(data);
    });
});

// 2. GET AVAILABLE MANAGERS (For Dropdown)
app.get('/api/managers', (req, res) => {
    const sql = "SELECT id, name FROM users WHERE role = 'manager'";
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json(data);
    });
});

// 3. ADD NEW BRANCH
app.post('/api/branches', (req, res) => {
    const sql = "INSERT INTO branches (`name`, `location`, `manager_id`, `capacity`, `status`, `color`) VALUES (?)";
    const values = [
        req.body.name,
        req.body.location,
        req.body.manager_id || null, // Allow empty manager
        req.body.capacity,
        req.body.status,
        req.body.color
    ];
    db.query(sql, [values], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json("Branch created");
    });
});

// 4. UPDATE BRANCH
app.put('/api/branches/:id', (req, res) => {
    const sql = "UPDATE branches SET `name`=?, `location`=?, `manager_id`=?, `capacity`=?, `status`=?, `color`=? WHERE id=?";
    const values = [
        req.body.name, req.body.location, req.body.manager_id, 
        req.body.capacity, req.body.status, req.body.color, req.params.id
    ];
    db.query(sql, values, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json("Branch updated");
    });
});

// 5. DELETE BRANCH
app.delete('/api/branches/:id', (req, res) => {
    const sql = "DELETE FROM branches WHERE id = ?";
    db.query(sql, [req.params.id], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json("Branch deleted");
    });
});
// ... existing routes ...
// --- LEAD MANAGEMENT ROUTES ---

// 1. GET ALL LEADS (Admin View)
// 2. ADD NEW LEAD (Improved)
app.post('/api/leads', (req, res) => {
    console.log("📥 Received Lead Data:", req.body); // Debug Log

    const sql = "INSERT INTO leads (`name`, `company`, `email`, `phone`, `source`, `branch`, `staff`, `status`, `value`, `notes`) VALUES (?)";
    
    // FIX: Convert empty value string to 0, otherwise MySQL errors on DECIMAL column
    const leadValue = req.body.value === '' ? 0 : req.body.value;

    const values = [
        req.body.name,
        req.body.company,
        req.body.email,
        req.body.phone,
        req.body.source,
        req.body.branch,
        req.body.staff,
        req.body.status,
        leadValue, // ✅ Use the safe value
        req.body.notes
    ];

    db.query(sql, [values], (err, data) => {
        if (err) {
            console.error("❌ Lead Insert Error:", err); // This will show the real error in terminal
            return res.status(500).json("Database error: " + err.message);
        }
        console.log("✅ Lead Saved Successfully");
        return res.json("Lead created successfully");
    });
});

// 2. UPDATE LEAD (General Edit)
app.put('/api/leads/:id', (req, res) => {
    const sql = "UPDATE leads SET `name`=?, `company`=?, `email`=?, `phone`=?, `value`=?, `status`=?, `branch`=?, `staff`=?, `notes`=? WHERE id=?";
    const values = [
        req.body.name, req.body.company, req.body.email, req.body.phone, 
        req.body.value, req.body.status, req.body.branch, req.body.staff, 
        req.body.notes, req.params.id
    ];
    db.query(sql, values, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json("Lead updated");
    });
});

// 3. SET REMINDER / FOLLOW UP
app.put('/api/leads/followup/:id', (req, res) => {
    const sql = "UPDATE leads SET `follow_up_date`=?, `follow_up_reason`=?, `follow_up_note`=? WHERE id=?";
    const values = [req.body.date, req.body.reason, req.body.note, req.params.id];
    
    db.query(sql, values, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json("Reminder set successfully");
    });
});

// 4. DELETE LEAD
app.delete('/api/leads/:id', (req, res) => {
    const sql = "DELETE FROM leads WHERE id = ?";
    db.query(sql, [req.params.id], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json("Lead deleted");
    });
});  


// ==========================================
// LEAD MANAGEMENT ROUTES
// ==========================================


// 3. SET REMINDER / FOLLOW UP
app.put('/api/leads/followup/:id', (req, res) => {
    // The date comes in as "2026-01-23 14:00:00" -> MySQL accepts this perfectly
    const sql = "UPDATE leads SET `follow_up_date`=?, `follow_up_reason`=?, `follow_up_note`=? WHERE id=?";
    const values = [req.body.date, req.body.reason, req.body.note, req.params.id];
    
    db.query(sql, values, (err, data) => {
        if (err) {
            console.error("❌ Follow-up Error:", err);
            return res.status(500).json(err);
        }
        return res.json("Reminder set successfully");
    });
});

// 1. GET ALL LEADS
app.get('/api/leads', (req, res) => {
    const sql = "SELECT * FROM leads ORDER BY created_at DESC";
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json(data);
    });
});

// 2. ADD NEW LEAD (This is the one causing 404!)
app.post('/api/leads', (req, res) => {
    console.log("📥 Received Lead Data:", req.body); 

    const sql = "INSERT INTO leads (`name`, `company`, `email`, `phone`, `source`, `branch`, `staff`, `status`, `value`, `notes`) VALUES (?)";
    
    // Convert empty value to 0 to prevent database errors
    const leadValue = req.body.value === '' ? 0 : req.body.value;

    const values = [
        req.body.name,
        req.body.company,
        req.body.email,
        req.body.phone,
        req.body.source,
        req.body.branch,
        req.body.staff,
        req.body.status,
        leadValue,
        req.body.notes
    ];

    db.query(sql, [values], (err, data) => {
        if (err) {
            console.error("❌ Insert Error:", err);
            return res.status(500).json(err);
        }
        return res.json("Lead created successfully");
    });
});

// 3. UPDATE LEAD
app.put('/api/leads/:id', (req, res) => {
    const sql = "UPDATE leads SET `name`=?, `company`=?, `email`=?, `phone`=?, `value`=?, `status`=?, `branch`=?, `staff`=?, `notes`=? WHERE id=?";
    const values = [
        req.body.name, req.body.company, req.body.email, req.body.phone, 
        req.body.value, req.body.status, req.body.branch, req.body.staff, 
        req.body.notes, req.params.id
    ];
    db.query(sql, values, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json("Lead updated");
    });
});

// 4. DELETE LEAD
app.delete('/api/leads/:id', (req, res) => {
    const sql = "DELETE FROM leads WHERE id = ?";
    db.query(sql, [req.params.id], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json("Lead deleted");
    });
});



// --- DASHBOARD STATS (Robust & Case-Insensitive) ---
// --- DASHBOARD STATS (Branch Filtering) ---
app.get('/api/dashboard/stats', (req, res) => {
    const branch = req.query.branch; // Get branch from query params
    
    // Base SQL condition
    const branchCondition = branch ? `AND branch = '${branch}'` : "";

    const queries = {
        total: `SELECT COUNT(*) as count FROM leads WHERE 1=1 ${branchCondition}`,
        today: `SELECT COUNT(*) as count FROM leads WHERE DATE(follow_up_date) = CURDATE() ${branchCondition}`,
        new: `SELECT COUNT(*) as count FROM leads WHERE LOWER(status) = 'new' ${branchCondition}`,
        inprogress: `SELECT COUNT(*) as count FROM leads WHERE LOWER(status) IN ('contacted', 'negotiation', 'follow-up') ${branchCondition}`,
        converted: `SELECT COUNT(*) as count FROM leads WHERE LOWER(status) IN ('qualified', 'converted') ${branchCondition}`,
        lost: `SELECT COUNT(*) as count FROM leads WHERE LOWER(status) = 'lost' ${branchCondition}`
    };

    const stats = {};
    let completed = 0;
    const keys = Object.keys(queries);

    keys.forEach(key => {
        db.query(queries[key], (err, data) => {
            if (err) { console.error(err); stats[key] = 0; }
            else { stats[key] = data[0].count; }
            
            completed++;
            if (completed === keys.length) res.json(stats);
        });
    });
});

// --- TASKS (Branch Filtering) ---
app.get('/api/dashboard/tasks', (req, res) => {
    const branch = req.query.branch;
    const branchCondition = branch ? `AND branch = '${branch}'` : "";
    
    const sql = `SELECT * FROM leads WHERE follow_up_date IS NOT NULL AND DATE(follow_up_date) <= CURDATE() ${branchCondition} ORDER BY follow_up_date DESC`;
    
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json(data);
    });
});

// --- DASHBOARD STATS (Fixed: Counts Overdue + Case Insensitive) ---
app.get('/api/dashboard/stats', (req, res) => {
    const { branch, staff } = req.query;

    // Base condition: always valid
    let condition = "WHERE 1=1";
    
    // Add filters if they exist (using LOWER for safety)
    if (branch) condition += ` AND LOWER(branch) = LOWER('${branch}')`;
    if (staff) condition += ` AND LOWER(staff) = LOWER('${staff}')`;

    const queries = {
        total: `SELECT COUNT(*) as count FROM leads ${condition}`,
        // ✅ FIX: Count Overdue + Today (matches the list below)
        today: `SELECT COUNT(*) as count FROM leads ${condition} AND follow_up_date IS NOT NULL AND DATE(follow_up_date) <= CURDATE()`,
        new: `SELECT COUNT(*) as count FROM leads ${condition} AND LOWER(status) = 'new'`,
        inprogress: `SELECT COUNT(*) as count FROM leads ${condition} AND LOWER(status) IN ('contacted', 'negotiation', 'follow-up')`,
        converted: `SELECT COUNT(*) as count FROM leads ${condition} AND LOWER(status) IN ('qualified', 'converted')`,
        lost: `SELECT COUNT(*) as count FROM leads ${condition} AND LOWER(status) = 'lost'`
    };

    const stats = {};
    let completed = 0;
    const keys = Object.keys(queries);

    keys.forEach(key => {
        db.query(queries[key], (err, data) => {
            if (err) { console.error(`Error in ${key}:`, err); stats[key] = 0; }
            else { stats[key] = data[0].count; }
            
            completed++;
            if (completed === keys.length) res.json(stats);
        });
    });
});

// --- TASKS (Fixed: Case Insensitive) ---
app.get('/api/dashboard/tasks', (req, res) => {
    const { branch, staff } = req.query;
    
    let condition = "WHERE follow_up_date IS NOT NULL AND DATE(follow_up_date) <= CURDATE()";
    if (branch) condition += ` AND LOWER(branch) = LOWER('${branch}')`;
    if (staff) condition += ` AND LOWER(staff) = LOWER('${staff}')`;

    const sql = `SELECT * FROM leads ${condition} ORDER BY follow_up_date ASC`;
    
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json(data);
    });
});
// ==========================================
// USER SETTINGS & PROFILE ROUTES
// ==========================================

// 1. GET CURRENT USER PROFILE
app.get('/api/profile/:id', (req, res) => {
    const sql = "SELECT id, name, email, phone, role, branch, dept, status FROM users WHERE id = ?";
    db.query(sql, [req.params.id], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(404).json("User not found");
        return res.json(data[0]);
    });
});

// 2. UPDATE PERSONAL DETAILS
app.put('/api/profile/:id', (req, res) => {
    // Only allow updating Name and Phone (Role/Branch/Email are usually fixed or Admin-only)
    const sql = "UPDATE users SET name = ?, phone = ? WHERE id = ?";
    db.query(sql, [req.body.name, req.body.phone, req.params.id], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json("Profile updated successfully");
    });
});

// 3. CHANGE PASSWORD (Secure)
app.put('/api/profile/password/:id', async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    // 1. Fetch current hashed password
    const sqlGet = "SELECT password FROM users WHERE id = ?";
    db.query(sqlGet, [req.params.id], async (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(404).json("User not found");

        const user = data[0];

        // 2. Verify Old Password
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(401).json("Incorrect current password");
        }

        // 3. Hash New Password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newPassword, salt);

        // 4. Update Database
        const sqlUpdate = "UPDATE users SET password = ? WHERE id = ?";
        db.query(sqlUpdate, [hash, req.params.id], (err, result) => {
            if (err) return res.status(500).json(err);
            return res.json("Password changed successfully");
        });
    });
});

// --- BULK IMPORT LEADS ---
app.post('/api/leads/bulk', (req, res) => {
    const leads = req.body; // Expecting an array of objects
    
    if (!leads || leads.length === 0) return res.status(400).json("No data provided");

    // Map object keys to array of values for MySQL
    const values = leads.map(lead => [
        lead.name || 'Unknown',
        lead.company || '',
        lead.phone || '',
        lead.email || '',
        lead.source || 'Import',
        lead.branch || 'Headquarters', // Auto-set branch
        lead.staff || 'Unassigned',
        lead.status || 'New',
        lead.value || 0,
        lead.notes || ''
    ]);

    const sql = "INSERT INTO leads (name, company, phone, email, source, branch, staff, status, value, notes) VALUES ?";
    
    db.query(sql, [values], (err, result) => {
        if (err) {
            console.error("Bulk Import Error:", err);
            return res.status(500).json(err);
        }
        res.json({ message: "Leads imported successfully", count: result.affectedRows });
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});