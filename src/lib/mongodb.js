// lib/mongodb.js
import { MongoClient } from 'mongodb';

const uri = "mongodb://localhost:12345";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let mongodb;

async function connectToDatabase() {
    if (!mongodb) {
        await client.connect();
        mongodb = client.db('esub20_ocr'); // The database name
    }
    return mongodb;
}

export default connectToDatabase;
