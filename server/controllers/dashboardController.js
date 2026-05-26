const db = require('../config/db');

exports.getStats = (req, res) => {
    const { branch, staff } = req.query;
    let condition = "WHERE 1=1";
    if (branch) condition += ` AND LOWER(branch) = LOWER('${branch}')`;
    if (staff) condition += ` AND LOWER(staff) = LOWER('${staff}')`;

    const queries = {
        total: `SELECT COUNT(*) as count FROM leads ${condition}`,
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
            if (err) stats[key] = 0;
            else stats[key] = data[0].count;
            
            completed++;
            if (completed === keys.length) res.json(stats);
        });
    });
};

exports.getTasks = (req, res) => {
    const { branch, staff } = req.query;
    let condition = "WHERE follow_up_date IS NOT NULL AND DATE(follow_up_date) <= CURDATE()";
    if (branch) condition += ` AND LOWER(branch) = LOWER('${branch}')`;
    if (staff) condition += ` AND LOWER(staff) = LOWER('${staff}')`;

    const sql = `SELECT * FROM leads ${condition} ORDER BY follow_up_date ASC`;
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json(data);
    });
};