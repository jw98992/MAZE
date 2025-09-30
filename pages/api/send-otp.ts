import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/db';
import { sendOTP } from '../../lib/solapi';

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: '아이디를 입력하세요.' });

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return res.status(404).json({ error: '존재하지 않는 아이디입니다.' });

  const otp = generateOTP();
  const otpExpires = new Date(Date.now() + 3 * 60 * 1000); // 3분
  await prisma.user.update({
    where: { username },
    data: { otp, otpExpires }
  });
  await sendOTP(user.phone, otp);
  return res.status(200).json({ message: 'OTP가 전송되었습니다.' });
}
