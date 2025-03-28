import { Button } from '@/components/ui/button';
import ErrorImage from '@/images/error.svg';

const ErrorPage = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[233px] h-[233px] mt-[159px] flex-shrink-0">
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url(${ErrorImage})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
      </div>

      <h1 className="mt-10 text-[40px] font-bold leading-[48px]">페이지를 찾을 수 없습니다.</h1>

      <p className="mt-10 text-center text-lg font-semibold leading-6">
        현재 입력하신 주소의 페이지는 삭제되었거나, 다른 페이지로 변경되었습니다.
        <br />
        주소를 다시 확인해 주세요.
      </p>

      <Button className="mt-10">메인 페이지로 이동</Button>
    </div>
  );
};

export default ErrorPage;
