const db = require('../config/db');

// GET ALL BRANCHES (With Manager Name)
exports.getAllBranches = (req, res) => {
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
};

// GET AVAILABLE MANAGERS (For Dropdown)
// Originally /api/managers - now grouped here as a utility for branches
exports.getManagers = (req, res) => {
    const sql = "SELECT id, name FROM users WHERE role = 'manager'";
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json(data);
    });
};

// ADD NEW BRANCH
exports.createBranch = (req, res) => {
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
};

// UPDATE BRANCH
exports.updateBranch = (req, res) => {
    const sql = "UPDATE branches SET `name`=?, `location`=?, `manager_id`=?, `capacity`=?, `status`=?, `color`=? WHERE id=?";
    const values = [
        req.body.name, 
        req.body.location, 
        req.body.manager_id, 
        req.body.capacity, 
        req.body.status, 
        req.body.color, 
        req.params.id
    ];
    db.query(sql, values, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json("Branch updated");
    });
};

// DELETE BRANCH
exports.deleteBranch = (req, res) => {
    const sql = "DELETE FROM branches WHERE id = ?";
    db.query(sql, [req.params.id], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json("Branch deleted");
    });
};