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
        proposal TEXT NOT NULL,
        name TEXT NOT NULL,
        id_number TEXT NOT NULL,
        gender TEXT NOT NULL,
        dob TEXT NOT NULL,
        mother_name TEXT NOT NULL,
        mother_id TEXT NOT NULL,
        father_name TEXT NOT NULL,
        father_id TEXT NOT NULL
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
