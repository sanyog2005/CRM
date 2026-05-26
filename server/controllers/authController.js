const db = require('../config/db');
const bcrypt = require('bcrypt');

exports.login = (req, res) => {
    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [req.body.email], async (err, data) => {
        if (err) return res.status(500).json("Login error");
        if (data.length === 0) return res.status(401).json("Invalid email or password");

        const user = data[0];
        const isMatch = await bcrypt.compare(req.body.password, user.password);

        if (!isMatch) return res.status(401).json("Invalid email or password");

        const { password, ...userData } = user;
        return res.json(userData);
    });
};

exports.signup = async (req, res) => {
    const { fullName, email, password, role } = req.body;
    try {
        const checkSql = "SELECT * FROM users WHERE email = ?";
        db.query(checkSql, [email], async (err, data) => {
            if (err) return res.status(500).json("Database error");
            if (data.length > 0) return res.status(409).json("Email already exists.");

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const insertSql = "INSERT INTO users (`name`, `email`, `password`, `role`) VALUES (?)";
            const values = [fullName, email, hashedPassword, role.toLowerCase()];

            db.query(insertSql, [values], (err) => {
                if (err) return res.status(500).json("Error creating user");
                return res.status(200).json("User registered successfully");
            });
        });
    } catch (err) {
        return res.status(500).json("Internal server error");
    }
};