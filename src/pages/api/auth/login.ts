import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/utils/db';
import { setCookie } from 'cookies-next';
import crypto from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
      const userRef = db.ref(`users/${username}`);
      const userSnapshot = await userRef.get();

      if (!userSnapshot.exists()) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const user = userSnapshot.val();
      const [salt, storedHash] = user.password.split(':');
      const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');

      const isMatch = crypto.timingSafeEqual(Buffer.from(storedHash), Buffer.from(hash));

      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate a secure session token
      const sessionToken = crypto.randomBytes(32).toString('hex');
      await db.ref(`sessions/${sessionToken}`).set({ username, createdAt: Date.now() });

      // Set the session token as a cookie
      setCookie('sessionToken', sessionToken, { req, res, httpOnly: true });
      res.status(200).json({ message: 'Login successful' });
    } catch (error) {
      res.status(500).json({ error: 'Error logging in' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
