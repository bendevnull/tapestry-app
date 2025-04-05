import { NextApiRequest, NextApiResponse } from 'next';
import { getCookie } from 'cookies-next';
import { db } from '@/utils/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("Starting session validation")
  const sessionToken = await getCookie('sessionToken', { req, res });
  const time = new Date().toJSON();
  console.log(sessionToken)

  if (!sessionToken) {
    console.log("No session token found")
    return res.status(200).json({ time, isLoggedIn: false });
  }

  const sessionRef = db.ref(`sessions/${sessionToken}`);
  const sessionSnapshot = await sessionRef.get();

  if (!sessionSnapshot.exists()) {
    return res.status(200).json({ time, isLoggedIn: false });
  }

  const sessionData = sessionSnapshot.val();
  console.log(sessionData)
  const userRef = db.ref(`users/${sessionData.username}`);
  const userSnapshot = await userRef.get();

  if (!userSnapshot.exists()) {
    return res.status(200).json({ time, isLoggedIn: false, error: true });
  }

  const user = userSnapshot.val();
  res.status(200).json({ time, isLoggedIn: true, user });
}
