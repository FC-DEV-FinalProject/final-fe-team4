import React, { useState } from 'react';

import { findID, findPassword } from '@/api/profileAPI';
import { ResultDialog } from '@/components/custom/dialogs/FindResultDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatPhoneNumber } from '@/utils/phoneNumber';
interface FindAccountProps {
  type: 'ID' | 'PW';
}

interface FindAccountState {
  name: string;
  email?: string;
  phone: string;
  verificationCode: string;
  isPhoneVerified: boolean;
}

const FindAccount: React.FC<FindAccountProps> = ({ type }) => {
  const [formData, setFormData] = useState<FindAccountState>({
    name: '',
    email: '',
    phone: '',
    verificationCode: '',
    isPhoneVerified: false,
  });
  const [resultDialogOpen, setResultDialogOpen] = useState(false);
  const [resultDialogInfo, setResultDialogInfo] = useState({
    title: '',
    message: '',
  });
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      setFormData((prev) => ({
        ...prev,
        phone: formatPhoneNumber(value),
      }));
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (type === 'ID') {
        const response = await findID(formData.name, formData.phone);
        setResultDialogInfo({
          title: '아이디 찾기 결과',
          message: `아이디(이메일) : [ ${response.data.email} ]`,
        });
        setResultDialogOpen(true);
      } else {
        const response = await findPassword({
          email: formData.email!,
          phoneNumber: formData.phone,
        });
        setResultDialogInfo({
          title: '비밀번호 찾기 결과',
          message: `비밀번호 : [ ${response.data.password} ]`,
        });
        setResultDialogOpen(true);
      }
    } catch (error) {
      setResultDialogInfo({
        title: '오류',
        message: error instanceof Error ? error.message : '오류가 발생했습니다.',
      });
      setResultDialogOpen(true);
    }
  };

  const handleSMS = async () => {
    try {
      setResultDialogInfo({
        title: '인증번호 발송',
        message: '인증번호가 발송되었습니다.',
      });
      setResultDialogOpen(true);
    } catch (error) {
      setResultDialogInfo({
        title: '오류',
        message: error instanceof Error ? error.message : '인증번호 발송에 실패했습니다.',
      });
      setResultDialogOpen(true);
    }
  };
  const handleSMSConfirm = async () => {
    setFormData((prev) => ({
      ...prev,
      isPhoneVerified: true,
    }));
    setResultDialogInfo({
      title: '인증 성공',
      message: '휴대폰 인증이 완료되었습니다.',
    });
    setResultDialogOpen(true);
  };

  return (
    <div className="flex flex-col w-full max-w-[360px] gap-6">
      <h1 className="text-3xl font-bold">{type === 'ID' ? '아이디 찾기' : '비밀번호 찾기'}</h1>

      <p className="text-gray-600">
        {type === 'ID'
          ? '회원정보에 등록된 연락처로 본인 확인을 진행하여 아이디를 찾아보세요.'
          : '회원정보에 등록된 연락처로 본인 확인을 해 주시면 비밀번호를 재설정할 수 있어요.'}
      </p>

      <div className="flex flex-col gap-4">
        {type === 'ID' && (
          <div>
            <label className="text-base font-medium mb-1 block">이름</label>
            <Input
              variant="signin"
              type="text"
              name="name"
              placeholder="홍길동"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
        )}

        {type === 'PW' && (
          <div>
            <label className="text-base font-medium mb-1 block">이메일 (아이디)</label>
            <Input
              variant="signin"
              type="email"
              name="email"
              placeholder="aipark@aipark.ai"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
        )}
        <div>
          <label className="text-base font-medium mb-1 block">전화번호</label>
          <div className="flex gap-2">
            <Input
              variant="signin"
              name="phone"
              className="flex-2"
              placeholder="010-1234-5678"
              type="tel"
              maxLength={13}
              value={formData.phone}
              onChange={handleInputChange}
            />
            {type === 'PW' && (
              <Button
                variant="secondary"
                size="md"
                onClick={handleSMS}
                disabled={!formData.phone || formData.phone.length < 13}
              >
                인증 전송
              </Button>
            )}
          </div>
        </div>
        {type === 'PW' && (
          <div>
            <label className="text-base font-medium mb-1 block">인증 번호</label>
            <div className="flex gap-2">
              <Input
                variant="signin"
                type="text"
                name="verificationCode"
                placeholder="******"
                className="flex-2"
                value={formData.verificationCode}
                onChange={handleInputChange}
              />
              <Button
                variant="secondary"
                size="md"
                onClick={handleSMSConfirm}
                disabled={!formData.verificationCode}
              >
                인증 확인
              </Button>
            </div>
          </div>
        )}
      </div>

      <Button
        variant="default"
        size="default"
        onClick={handleSubmit}
        disabled={
          !formData.phone ||
          (type === 'ID' && !formData.name) ||
          (type === 'PW' && !formData.email) ||
          (type === 'PW' && !formData.isPhoneVerified)
        }
      >
        {type === 'ID' ? '아이디 찾기' : '비밀번호 찾기'}
      </Button>
      <Button variant="outline" size="default" onClick={() => window.history.back()}>
        로그인 화면으로 돌아가기
      </Button>
      <ResultDialog
        open={resultDialogOpen}
        onOpenChange={setResultDialogOpen}
        title={resultDialogInfo.title}
        message={resultDialogInfo.message}
      />
    </div>
  );
};
export default FindAccount;
