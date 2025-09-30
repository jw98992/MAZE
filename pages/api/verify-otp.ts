import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/db';
import bcrypt from 'bcrypt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { username, otp } = req.body;
  if (!username || !otp) return res.status(400).json({ error: '아이디와 OTP를 입력하세요.' });

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user || !user.otp || !user.otpExpires) return res.status(400).json({ error: '인증 정보가 없습니다.' });

  if (user.otp !== otp) return res.status(401).json({ error: 'OTP가 일치하지 않습니다.' });
  if (user.otpExpires < new Date()) return res.status(410).json({ error: 'OTP가 만료되었습니다.' });

  // OTP 사용 후 삭제
  await prisma.user.update({
    where: { username },
    data: { otp: null, otpExpires: null }
  });

  // 로그인 성공 처리(세션 등)
  // 실제 서비스에서는 JWT 발급 또는 세션 처리 필요
  return res.status(200).json({ message: '로그인 성공!' });
}
