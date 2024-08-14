// pages/api/household.js
import sqlite3 from 'sqlite3';

const dbPath = './database/ocr.db';

export default function handler(req, res) {
    if (req.method === 'GET') {
        let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ error: 'Failed to connect to the database' });
            }
        });

        const sql = `SELECT DISTINCT group_name FROM household`;
        db.all(sql, [], (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.status(200).json(rows.map(row => row.group_name));
        });

        db.close();
    }
    else if (req.method === 'POST') {
        const { 
            group,
            proposal,
            name,
            id,
            gender,
            dob,
            relationship,
         } = req.body;

        let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                console.error(err.message);
                res.status(500).json({ error: 'Failed to connect to the database' });
            }
        });

        console.log(
            group,
            proposal,
            name,
            id,
            gender,
            dob,
            relationship)

        const sql = `INSERT INTO household 
        (
            group_name,
            proposal,
            name,
            id_number,
            gender,
            dob,
            relationship
        ) VALUES 
        (?, ?, ?, ?, ?, ?, ?)`;
        db.run(sql, [
            group,
            proposal,
            name,
            id,
            gender,
            dob,
            relationship,
        ], function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.status(201).json({ message: 'Data inserted successfully', id: this.lastID });
            }
        });

        db.close();
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}