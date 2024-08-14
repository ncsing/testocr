// pages/api/birthcert/[group].js
import sqlite3 from 'sqlite3';

const dbPath = './database/ocr.db';

export default function handler(req, res) {
    const {
        query: { group }
    } = req;

    let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Failed to connect to the database' });
        }
    });

    if (req.method === 'GET') {
        const sql = `SELECT 
            proposal,
            name,
            id_number,
            gender,
            dob,
            mother_name,
            mother_id,
            father_name,
            father_id
         FROM birthcert WHERE group_name = ? ORDER BY id`;

        db.all(sql, [group], (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.status(200).json(rows);
        });
        db.close();
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
