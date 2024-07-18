// pages/api/image/[proposal_no].js
import fs from 'fs';
import path from 'path';

const imagesDirectory = path.join(process.cwd(), 'images');

export default function handler(req, res) {
    const { proposal_no } = req.query;

    if (req.method === 'GET') {
        const filePath = path.join(imagesDirectory, `${proposal_no}.base64`);
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return res.status(404).json({ error: 'Image not found' });
            }
            res.status(200).json({ proposal_no, base64: data });
        });
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
