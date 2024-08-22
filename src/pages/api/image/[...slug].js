// pages/api/image/[proposal_no].js
import fs from 'fs';
import path from 'path';
import { imagesDirectory } from '../images';

export default function handler(req, res) {
    const { slug } = req.query;
    const proposal_no = slug.slice(-1).toString();
    const directory = slug.slice(0, -1).join('/');
    const directoryPath = path.join(imagesDirectory, directory);
    console.log("Query: ", req.query, "Path: ", req.path, "Slug: ", slug, "Proposal No: ", proposal_no, "Directory: ", directory, "Directory Path: ", directoryPath);

    if (req.method === 'GET') {
        returnImageFromDirectoryWithProposalNo(directoryPath, proposal_no, res);
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

export function returnImageFromDirectoryWithProposalNo(directory, proposal_no, res) {
    const extensions = ['.base64', '.jpg', '.png'];
    const filePath = extensions.map(ext => path.join(directory, `${proposal_no}${ext}`))
                               .find(fp => fs.existsSync(fp));

    if (!filePath) {
        return res.status(404).json({ error: 'Image not found' });
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to read image file' });
        }

        let base64Data;
        if (filePath.endsWith('.base64')) {
            base64Data = data.toString('utf8');
        } else if (filePath.endsWith('.jpg')) {
            base64Data = `data:image/jpeg;base64,${data.toString('base64')}`;
        } else if (filePath.endsWith('.png')) {
            base64Data = `data:image/png;base64,${data.toString('base64')}`;
        }

        res.status(200).json({ proposal_no, base64: base64Data });
    });
}