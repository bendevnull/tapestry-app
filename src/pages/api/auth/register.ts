import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/utils/db';
import crypto from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isEmailValid) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const hashedPassword = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');

    try {
      const userRef = db.ref(`users/${username}`);
      const userExists = await userRef.exists();

      if (userExists) {
        return res.status(400).json({ error: 'Username already exists' });
      }

      const emailRef = db.query('users').filter('email', '==', email);
      const emailExists = await emailRef.exists();

      if (emailExists) {
        return res.status(400).json({ error: 'Email already exists' });
      }

      await userRef.set({ username, email, password: `${salt}:${hashedPassword}` });
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error registering user' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
