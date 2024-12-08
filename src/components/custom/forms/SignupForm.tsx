import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { signup } from '@/api/authAPI';
import { checkEmail } from '@/api/profileAPI';
import TermsDialog from '@/components/custom/dialogs/TermsDialog';
import TermsAgreement from '@/components/custom/features/auth/TermsAgreement';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { TERMS } from '@/constants/terms';
import { SignupFormData } from '@/types/signup';
import { formatPhoneNumber } from '@/utils/phoneNumber';
import { signupFormSchema } from '@/utils/signupSchema';

const SignupForm = () => {
  const navigate = useNavigate();
  const [successDialog, setSuccessDialog] = useState(false);

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      email: '',
      pwd: '',
      pwdConfirm: '',
      name: '',
      phoneNumber: '',
      terms: [],
    },
  });

  const [termsDialog, setTermsDialog] = useState({
    open: false,
    title: '',
    content: '',
    type: '' as 'service' | 'privacy',
  });

  const [isAllTermsFlow, setIsAllTermsFlow] = useState(false);
  const onSubmit = async (data: SignupFormData) => {
    try {
      await signup({
        email: data.email,
        name: data.name,
        pwd: data.pwd,
        pwdConfirm: data.pwdConfirm,
        phoneNumber: data.phoneNumber,
        terms: data.terms.join(','),
      });
      setSuccessDialog(true);
    } catch (error) {
      alert(error instanceof Error ? error.message : '회원가입에 실패했습니다.');
    }
  };

  const handleEmailCheck = async () => {
    const email = form.getValues('email');
    try {
      await checkEmail(email);
      form.clearErrors('email');
      form.setError('email', {
        type: 'manual',
        message: '사용 가능한 이메일입니다.',
      });
    } catch (error) {
      form.setError('email', {
        type: 'manual',
        message: error instanceof Error ? error.message : '이메일 중복 확인에 실패했습니다.',
      });
    }
  };

  const handleOpenTerms = (type: 'service' | 'privacy', isAll: boolean = false) => {
    setIsAllTermsFlow(isAll);
    setTermsDialog({
      open: true,
      title: type === 'service' ? '서비스 이용약관' : '개인정보 처리방침',
      content: type === 'service' ? TERMS.SERVICE : TERMS.PRIVACY,
      type,
    });
  };

  const handleAgreeTerms = (type: 'service' | 'privacy') => {
    const currentTerms = form.getValues('terms') || [];
    if (!currentTerms.includes(type)) {
      form.setValue('terms', [...currentTerms, type], { shouldValidate: true });
    }
    if (isAllTermsFlow && type === 'service') {
      setTimeout(() => {
        handleOpenTerms('privacy', true);
      }, 100);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col p-9 space-y-5">
        <div className="flex flex-col space-y-2">
          <FormLabel className="text-black font-medium">
            이메일 (아이디) <span className="text-red-500">*</span>
          </FormLabel>
          <div className="flex gap-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      placeholder="aipark@aipark.ai"
                      className="h-[50px] placeholder:text-gray-100"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="button" onClick={handleEmailCheck} className="w-[100px] h-[50px] text-md">
              중복 확인
            </Button>
          </div>
        </div>

        <FormField
          control={form.control}
          name="pwd"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-black font-medium">
                비밀번호 <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="8-50자의 비밀번호를 입력해 주세요."
                  className="h-[50px] placeholder:text-gray-100"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pwdConfirm"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-black font-medium">
                비밀번호 확인 <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="비밀번호를 다시 입력해 주세요."
                  className="h-[50px] placeholder:text-gray-100"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-black font-medium">
                  이름 <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="이름을 입력해주세요."
                    className="h-[50px] placeholder:text-gray-100"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-black font-medium">
                전화번호 <span className="text-red-500">*</span>
                <span className="text-gray-400"> (비밀번호 찾을 때, 인증이 필요합니다.)</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="010-0000-0000"
                  className="h-[50px] placeholder:text-gray-100"
                  {...field}
                  onChange={(e) => {
                    const formattedNumber = formatPhoneNumber(e.target.value);
                    field.onChange(formattedNumber);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <TermsAgreement control={form.control} onOpenTerms={handleOpenTerms} />

        <Button type="submit" className="my-8 w-full">
          회원 가입하기
        </Button>

        <TermsDialog
          open={termsDialog.open}
          onOpenChange={(open) => setTermsDialog((prev) => ({ ...prev, open }))}
          title={termsDialog.title}
          content={termsDialog.content}
          type={termsDialog.type}
          onAgree={handleAgreeTerms}
        />

        <Dialog open={successDialog} onOpenChange={setSuccessDialog}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>회원가입 완료</DialogTitle>
              <DialogDescription>회원가입이 성공적으로 완료되었습니다.</DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-3">
              <Button
                size="sm"
                onClick={() => {
                  setSuccessDialog(false);
                  navigate('/signin');
                }}
              >
                확인
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </form>
    </Form>
  );
};

export default SignupForm;
