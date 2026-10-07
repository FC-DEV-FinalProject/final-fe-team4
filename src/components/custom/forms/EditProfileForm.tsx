import { Separator } from '@radix-ui/react-separator';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { changePassword, changeProfile } from '@/api/profileAPI';
import { EditConfirm } from '@/components/custom/dialogs/EditProfileDialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthStore } from '@/stores/auth.store';
import { formatPhoneNumber } from '@/utils/phoneNumber';
interface ProfileFormData {
  email: string;
  name: string;
  phoneNumber: string;
}

interface EditProfileFormProps {
  defaultValues: ProfileFormData;
  avatarUrl: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const EditProfileForm = ({ defaultValues, avatarUrl }: EditProfileFormProps) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { setUser } = useAuthStore();
  const [showAlert, setShowAlert] = useState(false);
  const [lastSuccessfulResponse, setLastSuccessfulResponse] = useState<ProfileFormData | boolean>(
    false
  );
  const [passwordChangeData, setPasswordChangeData] = useState<PasswordFormData | null>(null);
  const [profileChangeData, setProfileChangeData] = useState<ProfileFormData | null>(null);

  const profileForm = useForm<ProfileFormData>({
    defaultValues: {
      ...defaultValues,
      phoneNumber: formatPhoneNumber(defaultValues.phoneNumber),
    },
  });

  const passwordForm = useForm<PasswordFormData>({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onProfileSubmit = async (data: ProfileFormData) => {
    try {
      setErrorMessage('');
      const formattedData = {
        ...data,
        phoneNumber: formatPhoneNumber(data.phoneNumber),
      };
      setProfileChangeData(formattedData);
      setIsModalOpen(true);
    } catch (error) {
      if (error instanceof AxiosError) {
        setErrorMessage(error.response?.data?.message || '프로필 수정에 실패했습니다.');
      } else if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    try {
      setErrorMessage('');
      if (data.newPassword !== data.confirmPassword) {
        throw new Error('새 비밀번호가 일치하지 않습니다.');
      }
      setPasswordChangeData(data);
      setIsModalOpen(true);
    } catch (error) {
      if (error instanceof AxiosError) {
        setErrorMessage(error.response?.data?.message || '비밀번호 변경에 실패했습니다.');
      } else if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  const handleConfirmSubmit = async () => {
    try {
      if (profileChangeData) {
        const response = await changeProfile(profileChangeData);
        setLastSuccessfulResponse(response.data);
      }
      if (passwordChangeData) {
        await changePassword({
          currentPassword: passwordChangeData.currentPassword,
          newPassword: passwordChangeData.newPassword,
          confirmPassword: passwordChangeData.confirmPassword,
        });
        setLastSuccessfulResponse(true);
      }
      if (lastSuccessfulResponse) {
        if (typeof lastSuccessfulResponse === 'object' && lastSuccessfulResponse !== null) {
          setUser({
            email: lastSuccessfulResponse.email,
            name: lastSuccessfulResponse.name,
            phoneNumber: formatPhoneNumber(lastSuccessfulResponse.phoneNumber),
          });
        }
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 2000);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        setErrorMessage(error.response?.data?.message || '수정에 실패했습니다.');
      } else if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('알 수 없는 오류가 발생했습니다.');
      }
    }
    setProfileChangeData(null);
    setPasswordChangeData(null);
    setIsModalOpen(false);
  };

  return (
    <>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="profile">나의 회원정보</TabsTrigger>
          <TabsTrigger value="security">비밀번호 설정</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <h2 className="text-lg font-semibold mb-4">나의 회원정보</h2>
          <Separator className="h-[1px] bg-gray-200 mb-6 max-w-[600px]" />
          <Form {...profileForm}>
            <form
              onSubmit={profileForm.handleSubmit(onProfileSubmit)}
              className="flex flex-col space-y-6"
            >
              <FormField
                control={profileForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-4 ml-1">
                    <div className="w-[240px]">
                      <FormLabel className="text-black font-medium">
                        이메일 (아이디)
                        <div className="text-sm text-gray-500 font-normal">
                          이메일 주소는 변경할 수 없습니다.
                        </div>
                      </FormLabel>
                    </div>
                    <FormControl>
                      <Input
                        {...field}
                        disabled
                        className="flex-1 max-w-[320px] h-[50px] border-none text-black "
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Separator className="h-[1px] bg-gray-200 max-w-[600px]" />
              <div className="flex  items-center gap-4 ml-1">
                <div className="w-[240px]">
                  <FormLabel className="w-[240px] h-[58px] text-black font-medium">
                    사진
                    <div className="text-sm text-gray-500 font-normal">
                      현재 기본 이미지로만 표시됩니다.
                    </div>
                  </FormLabel>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={avatarUrl} />
                    </Avatar>
                  </div>
                </div>
              </div>
              <Separator className="h-[1px] bg-gray-200 max-w-[600px]" />
              <FormField
                control={profileForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-4 ml-1">
                    <div className="w-[240px] h-[55px] flex items-center">
                      <FormLabel className="text-black font-medium">
                        이름 <span className="text-red-500">*</span>
                        <div className="text-sm text-gray-500 font-normal">
                          나의 프로필에 게시되는 이름입니다.
                        </div>
                      </FormLabel>
                    </div>
                    <FormControl>
                      <Input {...field} className="flex-1 max-w-[320px] h-[50px]" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Separator className="h-[1px] bg-gray-200 max-w-[600px]" />
              <FormField
                control={profileForm.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-4 ml-1">
                    <div className="w-[240px] h-[55px] flex items-center">
                      <FormLabel className="text-black font-medium">
                        전화번호 <span className="text-red-500">*</span>
                        <div className="text-sm text-gray-500 font-normal">
                          전화번호 수정 시 인증이 필요합니다.
                        </div>
                      </FormLabel>
                    </div>
                    <FormControl>
                      <Input
                        {...field}
                        maxLength={13}
                        onChange={(e) => {
                          const value = formatPhoneNumber(e.target.value);
                          field.onChange({ target: { name: field.name, value } });
                        }}
                        className="flex-1 max-w-[320px] h-[50px]"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />{' '}
              {errorMessage && <p className="text-red-500 text-sm text-center">{errorMessage}</p>}
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="security">
          <h2 className="text-lg font-semibold mb-4">비밀번호 설정</h2>
          <Separator className="h-[1px] bg-gray-200 mb-6 max-w-[600px]" />
          <Form {...passwordForm}>
            <form
              onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
              className="flex flex-col space-y-6"
            >
              {' '}
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-4">
                    <FormLabel className="text-black font-medium w-[240px] ml-1">
                      현재 비밀번호 <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="현재 비밀번호를 입력해 주세요."
                        className="max-w-[320px] h-[50px]"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-4">
                    <FormLabel className="text-black font-medium w-[240px] ml-1">
                      새 비밀번호 <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="새 비밀번호를 입력해 주세요."
                        className="max-w-[320px] h-[50px]"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-4">
                    <FormLabel className="text-black font-medium w-[240px] ml-1">
                      새 비밀번호 확인 <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="새 비밀번호를 확인해 주세요."
                        className="max-w-[320px] h-[50px]"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {errorMessage && <p className="text-red-500 text-sm text-center">{errorMessage}</p>}
            </form>
          </Form>
        </TabsContent>
      </Tabs>

      <Separator className="h-[1px] bg-gray-200 mt-6 mb-16 max-w-[600px]" />
      <div className="flex space-x-4">
        <Button type="button" size="sm" variant="outline">
          취소
        </Button>
        <Button
          type="submit"
          size="sm"
          onClick={() => {
            if (activeTab === 'profile') {
              profileForm.handleSubmit(onProfileSubmit)();
            } else {
              passwordForm.handleSubmit(onPasswordSubmit)();
            }
          }}
        >
          {activeTab === 'profile' ? '회원정보 수정' : '비밀번호 변경'}
        </Button>
      </div>

      <EditConfirm
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onConfirm={handleConfirmSubmit}
      />
      {showAlert && (
        <div className="absolute left-1/2 -translate-x-1/2 top-6">
          <Alert variant="default" className="w-[360px] bg-white">
            <AlertDescription className="text-sm">
              회원정보가 성공적으로 수정되었습니다.
            </AlertDescription>
          </Alert>
        </div>
      )}
    </>
  );
};

export default EditProfileForm;
