import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { login } from '@/api/authAPI';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import Logo from '@/images/logo.png';
import { useAuthStore } from '@/stores/auth.store';

const SigninForm = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [rememberEmail, setRememberEmail] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (rememberEmail) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      const userData = await login(email, password);
      setUser({
        id: userData.data.id,
        email: userData.data.email,
        name: userData.data.name,
        phoneNumber: userData.data.phoneNumber,
      });
      navigate('/');
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        setErrorMessage(error.response?.data?.message || '로그인 실패. 다시 시도해주세요.');
      } else if (error instanceof Error) {
        setErrorMessage(error.message || '로그인 실패. 다시 시도해주세요.');
      } else {
        setErrorMessage('알 수 없는 오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberEmail(true);
    }
  }, []);

  return (
    <div className="w-[432px] h-[600px] flex-shrink-0 rounded-xl border border-gray-300 bg-white flex flex-col">
      <div className="mt-[56px] mb-[80px] flex justify-center">
        <img src={Logo} alt="AIPark Logo" className="w-[132px] h-[36px] flex-shrink-0" />
      </div>

      <form className="flex flex-col px-[36px]" onSubmit={handleLogin}>
        <label className="self-stretch text-black text-base font-medium leading-6 font-pretendard">
          이메일 (아이디)
        </label>
        <Input
          variant="signin"
          type="email"
          placeholder="aipark@aipark.ai"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-[360px] h-[50px] rounded-lg border border-gray-300 bg-white px-4 font-pretendard"
        />

        <div className="mt-[20px] flex items-center justify-between">
          <label className="self-stretch text-black text-base font-medium leading-6 font-pretendard">
            비밀번호
          </label>
        </div>
        <Input
          variant="signin"
          type="password"
          placeholder="8자 이상의 비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-[360px] h-[50px] rounded-lg border border-gray-300 bg-white px-4 font-pretendard"
        />

        <div className="mt-2 flex items-center justify-between text-base font-pretendard">
          <div className="flex items-center gap-2">
            <Checkbox
              id="remember"
              checked={rememberEmail}
              onCheckedChange={(checked) => setRememberEmail(checked as boolean)}
              className="h-4 w-4 border-gray-100 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <label htmlFor="remember" className="text-gray-400 font-medium leading-6 select-none">
              아이디 저장
            </label>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => navigate('/find-id')}
              className="text-gray-400 font-medium leading-6 hover:text-gray-700"
            >
              아이디 찾기
            </button>
            <span className="text-gray-100">|</span>
            <button
              type="button"
              onClick={() => navigate('/find-pw')}
              className="text-gray-400 font-medium leading-6 hover:text-gray-700"
            >
              비밀번호 찾기
            </button>
          </div>
        </div>
        <div className="mt-[36px] space-y-4">
          <Button type="submit">로그인</Button>
          <Button variant="secondary" onClick={() => navigate('/signup')}>
            회원가입
          </Button>
        </div>
        {/* 에러 메시지 */}
        {errorMessage && (
          <p className="mt-4 text-red-500 text-sm font-medium text-center">{errorMessage}</p>
        )}
      </form>
    </div>
  );
};

export default SigninForm;
