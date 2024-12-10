import { Link } from 'react-router-dom';

import SignupForm from '@/components/custom/forms/SignupForm';
import SigninLogo from '@/images/signin-logo.svg';

const SignupPage = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#F7F7F7] overflow-hidden">
      <div className="relative w-[1440px] h-screen max-h-[1024px] flex mx-auto">
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url(${SigninLogo})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        <div className="w-1/2" />
        <div className="relative z-10 w-1/2 h-full bg-white overflow-y-auto">
          <div className="w-[432px] mt-[88px] ml-[156px] flex flex-col">
            <h2 className="text-[24px] font-bold leading-9">회원가입</h2>
            <div className="mt-2">
              <span className="text-sm text-gray-900">이미 계정이 있으신가요? </span>
              <Link to="/signin" className="text-sm text-primary font-medium hover:text-blue-700">
                로그인
              </Link>
            </div>
          </div>
          <div className="w-[432px] min-h-[750px] ml-[120px] flex-shrink-0 flex flex-col">
            <SignupForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
