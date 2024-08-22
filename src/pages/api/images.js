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
              const proposals = files.filter(file => file.endsWith('.base64') || file.endsWith('.jpg') || file.endsWith('.png'))
                                     .map(file => file.replace('.base64', '').replace('.jpg', '').replace('.png', ''));
              res.status(200).json(proposals);
            } else {
              const imageFiles = files.filter(file => file.endsWith('.base64') || file.endsWith('.jpg') || file.endsWith('.png'));
              
              Promise.all(imageFiles.map(file => {
                return new Promise((resolve, reject) => {
                  const fullPath = path.join(imagesDirectory, file);
                  
                  if (file.endsWith('.base64')) {
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
                  } else if (file.endsWith('.jpg')) {
                    fs.readFile(fullPath, (err, data) => {
                      if (err) {
                        reject(err);
                      } else {
                        const base64 = data.toString('base64');
                        resolve({
                          proposal_no: file.replace('.jpg', ''),
                          base64: `data:image/jpeg;base64,${base64}`
                        });
                      }
                    });
                  } else if (file.endsWith('.png')) {
                    fs.readFile(fullPath, (err, data) => {
                      if (err) {
                        reject(err);
                      } else {
                        const base64 = data.toString('base64');
                        resolve({
                          proposal_no: file.replace('.png', ''),
                          base64: `data:image/png;base64,${base64}`
                        });
                      }
                    });
                  }
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
