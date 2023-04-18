import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.status(405).json({ message: 'Method Not Allowed' });
        return;
    }
    try {
        const quizData = req.body;
        const dataFolderPath = path.join(process.cwd(), 'data');
        const filePath = path.join(dataFolderPath, 'quiz.json');
        if (!fs.existsSync(dataFolderPath)) {
            fs.mkdirSync(dataFolderPath);
        }
        fs.writeFileSync(filePath, JSON.stringify(quizData, null, 2));
        res.status(200).json({ message: 'Quiz saved successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}