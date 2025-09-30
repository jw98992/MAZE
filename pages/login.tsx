import { useState } from 'react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'id' | 'otp'>('id');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    setLoading(true);
    setMessage('');
    const res = await fetch('/api/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    });
    const data = await res.json();
    if (res.ok) {
      setStep('otp');
      setMessage('휴대폰으로 OTP가 전송되었습니다.');
    } else {
      setMessage(data.error || '오류가 발생했습니다.');
    }
    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    setMessage('');
    const res = await fetch('/api/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, otp })
    });
    const data = await res.json();
    if (res.ok) {
      setMessage('로그인 성공!');
    } else {
      setMessage(data.error || '오류가 발생했습니다.');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: '100px auto', padding: 24, border: '1px solid #eee', borderRadius: 8 }}>
      <h2>휴대폰 OTP 로그인</h2>
      {step === 'id' && (
        <>
          <input
            type="text"
            placeholder="아이디 입력"
            value={username}
            onChange={e => setUsername(e.target.value)}
            style={{ width: '100%', marginBottom: 12, padding: 8 }}
          />
          <button onClick={handleSendOtp} disabled={loading || !username} style={{ width: '100%', padding: 10 }}>
            {loading ? '전송 중...' : 'OTP 요청'}
          </button>
        </>
      )}
      {step === 'otp' && (
        <>
          <input
            type="text"
            placeholder="OTP 번호 입력"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            style={{ width: '100%', marginBottom: 12, padding: 8 }}
          />
          <button onClick={handleVerifyOtp} disabled={loading || !otp} style={{ width: '100%', padding: 10 }}>
            {loading ? '확인 중...' : '로그인'}
          </button>
        </>
      )}
      {message && <div style={{ marginTop: 16, color: step === 'otp' && message === '로그인 성공!' ? 'green' : 'red' }}>{message}</div>}
    </div>
  );
}
