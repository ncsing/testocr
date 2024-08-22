// pages/api/images.js
import fs from 'fs';
import path from 'path';

export const imagesDirectory = path.join(process.cwd(), 'images');

export default function handler(req, res) {
    if (req.method === 'GET') {
        returnImagesFromDirectory(imagesDirectory, res);
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

export function returnImagesFromDirectory(directory, res) {
    fs.readdir(directory, (err, files) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Failed to read directory' });
        }
      
        const proposals = files.filter(file => file.endsWith('.base64') || file.endsWith('.jpg') || file.endsWith('.png'))
                                .map(file => file.replace('.base64', '').replace('.jpg', '').replace('.png', ''));
        res.status(200).json(proposals);
    });
}
