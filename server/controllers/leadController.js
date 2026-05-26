const db = require('../config/db');

exports.getAllLeads = (req, res) => {
    const sql = "SELECT * FROM leads ORDER BY created_at DESC";
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json(data);
    });
};

exports.createLead = (req, res) => {
    const sql = "INSERT INTO leads (`name`, `company`, `email`, `phone`, `source`, `branch`, `staff`, `status`, `value`, `notes`) VALUES (?)";
    const leadValue = req.body.value === '' ? 0 : req.body.value;
    const values = [
        req.body.name, req.body.company, req.body.email, req.body.phone,
        req.body.source, req.body.branch, req.body.staff, req.body.status,
        leadValue, req.body.notes
    ];

    db.query(sql, [values], (err) => {
        if (err) {
            console.error("❌ Insert Error:", err);
            return res.status(500).json(err);
        }
        return res.json("Lead created successfully");
    });
};

exports.updateLead = (req, res) => {
    const sql = "UPDATE leads SET `name`=?, `company`=?, `email`=?, `phone`=?, `value`=?, `status`=?, `branch`=?, `staff`=?, `notes`=? WHERE id=?";
    const values = [
        req.body.name, req.body.company, req.body.email, req.body.phone,
        req.body.value, req.body.status, req.body.branch, req.body.staff,
        req.body.notes, req.params.id
    ];
    db.query(sql, values, (err) => {
        if (err) return res.status(500).json(err);
        return res.json("Lead updated");
    });
};

exports.deleteLead = (req, res) => {
    const sql = "DELETE FROM leads WHERE id = ?";
    db.query(sql, [req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        return res.json("Lead deleted");
    });
};

exports.setFollowUp = (req, res) => {
    const sql = "UPDATE leads SET `follow_up_date`=?, `follow_up_reason`=?, `follow_up_note`=? WHERE id=?";
    db.query(sql, [req.body.date, req.body.reason, req.body.note, req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        return res.json("Reminder set successfully");
    });
};

exports.bulkImport = (req, res) => {
    const leads = req.body;
    if (!leads || leads.length === 0) return res.status(400).json("No data provided");

    const values = leads.map(lead => [
        lead.name || 'Unknown', lead.company || '', lead.phone || '',
        lead.email || '', lead.source || 'Import', lead.branch || 'Headquarters',
        lead.staff || 'Unassigned', lead.status || 'New', lead.value || 0, lead.notes || ''
    ]);

    const sql = "INSERT INTO leads (name, company, phone, email, source, branch, staff, status, value, notes) VALUES ?";
    db.query(sql, [values], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Leads imported", count: result.affectedRows });
    });
};