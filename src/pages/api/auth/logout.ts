import { NextApiRequest, NextApiResponse } from 'next';
import { deleteCookie } from 'cookies-next';
import { db } from '@/utils/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const sessionToken = req.cookies.sessionToken;

    if (sessionToken) {
      await db.ref(`sessions/${sessionToken}`).remove();
    }

    deleteCookie('sessionToken', { req, res });
    res.status(200).json({ message: 'Logout successful' });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
