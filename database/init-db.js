// database/init-db.js
const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./database/ocr.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the OCR database.');
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS birthcert (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        group_name TEXT,
        proposal TEXT,
        name TEXT,
        id_number TEXT,
        gender TEXT,
        dob TEXT,
        mother_name TEXT,
        mother_id TEXT,
        father_name TEXT,
        father_id TEXT
    )`, (err) => {
        if (err) {
            console.error(err.message);
        }
    });
});

db.close((err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Database setup completed.');
});
