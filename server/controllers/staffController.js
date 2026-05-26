const db = require('../config/db');
const bcrypt = require('bcrypt');

// GET ALL STAFF
exports.getAllStaff = (req, res) => {
    // Select everything EXCEPT the password for security
    const sql = "SELECT id, name, email, role, dept, branch, status, phone, created_at FROM users ORDER BY created_at DESC";
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json(data);
    });
};

// ADD NEW STAFF (Creates Loginable User)
exports.addStaff = async (req, res) => {
    try {
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const sql = "INSERT INTO users (`name`, `email`, `password`, `role`, `dept`, `branch`, `status`, `phone`) VALUES (?)";
        const values = [
            req.body.name,
            req.body.email,
            hashedPassword,
            req.body.role.toLowerCase(), // Ensure lowercase
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
    } catch (err) {
        return res.status(500).json("Error processing request");
    }
};

// UPDATE STAFF DETAILS
exports.updateStaff = (req, res) => {
    // Does NOT update password here (handled in profile)
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
};

// DELETE STAFF
exports.deleteStaff = (req, res) => {
    const sql = "DELETE FROM users WHERE id = ?";
    db.query(sql, [req.params.id], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json("User removed");
    });
};