// pages/api/household/csv.js
import sqlite3 from 'sqlite3';
import { parse } from 'json2csv';

const dbPath = './database/ocr.db';

export default function handler(req, res) {
    if (req.method === 'GET') {
        const {
            query: { group }
        } = req;

        let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ error: 'Failed to connect to the database' });
            }
        });

        const sql = `SELECT 
            proposal,
            name,
            id_number,
            gender,
            dob,
            relationship
         FROM household WHERE group_name = ? ORDER BY id`;
        db.all(sql, [group], (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }

            try {
                const csv = parse(rows, { fields: [
                    "proposal",
                    "name",
                    "id_number",
                    "gender",
                    "dob",
                    "relationship",
                ] });
                res.setHeader('Content-Type', 'text/csv; charset=utf-8');
                res.setHeader('Content-Disposition', `attachment; filename="household-${group}.csv"`);
                res.status(200).send('\uFEFF' + csv);
            } catch (err) {
                res.status(500).json({ error: 'Failed to generate CSV', message: err.message });
            }
        });

        db.close();
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
