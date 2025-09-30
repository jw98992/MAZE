import SolapiMessageService from 'solapi';

const messageService = new SolapiMessageService(
  process.env.SOLAPI_API_KEY!,
  process.env.SOLAPI_API_SECRET!
);

export async function sendOTP(phone: string, otp: string) {
  return messageService.send({
    to: phone,
    from: process.env.SOLAPI_SENDER!,
    text: `[인증번호] ${otp}를 입력해주세요.`
  });
}
