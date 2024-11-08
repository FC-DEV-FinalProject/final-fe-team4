import { LoginInput } from '@/components/login/LoginInput';
import { Checkbox } from '@/components/ui/CheckBox';
import { Button } from '@/components/ui/CommonButton';
import Logo from '@/images/logo.png';

const LoginComponent = () => {
  return (
    <div className="w-[432px] h-[600px] flex-shrink-0 rounded-xl border border-gray-300 bg-white flex flex-col">
      <div className="mt-[56px] mb-[80px] flex justify-center">
        <img src={Logo} alt="AIPark Logo" className="w-[132px] h-[36px] flex-shrink-0" />
      </div>

      <form className="flex flex-col px-[36px]">
        <label className="self-stretch text-black text-base font-medium leading-6 font-pretendard">
          이메일 (아이디)
        </label>
        <LoginInput
          type="email"
          placeholder="aipark@aipark.ai"
          className="mt-2 w-[360px] h-[50px] rounded-lg border border-gray-300 bg-white px-4 font-pretendard"
        />

        <label className="mt-[20px] self-stretch text-black text-base font-medium leading-6 font-pretendard">
          비밀번호
        </label>
        <LoginInput
          type="password"
          placeholder="8자 이상의 비밀번호"
          className="mt-2 w-[360px] h-[50px] rounded-lg border border-gray-300 bg-white px-4 font-pretendard"
        />

        <div className="mt-2 flex items-center justify-between text-base font-pretendard">
          <div className="flex items-center gap-2">
            <Checkbox
              id="remember"
              className="h-4 w-4 border-gray-100 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <label htmlFor="remember" className="text-gray-400 font-medium leading-6 select-none">
              아이디 저장
            </label>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="text-gray-400 font-medium leading-6 hover:text-gray-700"
            >
              아이디 찾기
            </button>
            <span className="text-gray-100">|</span>
            <button
              type="button"
              className="text-gray-400 font-medium leading-6 hover:text-gray-700"
            >
              비밀번호 찾기
            </button>
          </div>
        </div>

        <div className="mt-[36px] space-y-4">
          <Button>로그인</Button>
          <Button variant="secondary">회원가입</Button>
        </div>
      </form>
    </div>
  );
};

export default LoginComponent;
