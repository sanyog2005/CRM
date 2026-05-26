const db = require('../config/db');
const bcrypt = require('bcrypt');

// GET CURRENT USER PROFILE
exports.getProfile = (req, res) => {
    const sql = "SELECT id, name, email, phone, role, branch, dept, status FROM users WHERE id = ?";
    db.query(sql, [req.params.id], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(404).json("User not found");
        return res.json(data[0]);
    });
};

// UPDATE PERSONAL DETAILS
exports.updateProfile = (req, res) => {
    // Only allow updating Name and Phone here
    const sql = "UPDATE users SET name = ?, phone = ? WHERE id = ?";
    db.query(sql, [req.body.name, req.body.phone, req.params.id], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json("Profile updated successfully");
    });
};

// CHANGE PASSWORD
exports.changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    try {
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
    } catch (err) {
        return res.status(500).json("Error changing password");
    }
};