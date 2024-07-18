// pages/api/images.js
import fs from 'fs';
import path from 'path';

const imagesDirectory = path.join(process.cwd(), 'images');

export default function handler(req, res) {
    if (req.method === 'GET') {
        fs.readdir(imagesDirectory, (err, files) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Failed to read directory' });
            }

            if (req.query.listOnly === "true") {
                const proposals = files.filter(file => file.endsWith('.base64')).map(file => file.replace('.base64', ''));
                res.status(200).json(proposals);
            } else {
                const imageFiles = files.filter(file => file.endsWith('.base64'));

                Promise.all(imageFiles.map(file => {
                    return new Promise((resolve, reject) => {
                        const fullPath = path.join(imagesDirectory, file);
                        fs.readFile(fullPath, 'utf8', (err, data) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve({
                                    proposal_no: file.replace('.base64', ''),
                                    base64: data
                                });
                            }
                        });
                    });
                }))
                .then(results => {
                    res.status(200).json(results);
                })
                .catch(error => {
                    console.error(error);
                    res.status(500).json({ error: 'Failed to read image files' });
                });
            }
        });
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
