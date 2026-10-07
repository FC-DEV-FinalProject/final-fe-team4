import EditProfileForm from '@/components/custom/forms/EditProfileForm';
import MainHeader from '@/components/section/header/MainHeader';
import { DEFAULT_PROFILE_IMAGE } from '@/constants/images';
import PageLayout from '@/layouts/PageLayout';
import { useAuthStore } from '@/stores/auth.store';

const MyPage = () => {
  const { user } = useAuthStore();

  const defaultValues = {
    email: user?.email || '',
    name: user?.name || '',
    phoneNumber: user?.phoneNumber || '',
  };

  return (
    <PageLayout variant="main" header={<MainHeader />}>
      <div className="pt-7 px-12">
        <h1 className="text-2xl font-bold mb-8">마이페이지</h1>
        <EditProfileForm defaultValues={defaultValues} avatarUrl={DEFAULT_PROFILE_IMAGE} />
      </div>
    </PageLayout>
  );
};

export default MyPage;
