import ProfileDropdown from '@/components/custom/dropdowns/ProfileDropdown';
import { useAuthStore } from '@/stores/auth.store';

export const MainHeader = () => {
  const { user } = useAuthStore();

  return (
    <div className="flex items-center justify-between pt-[26px]">
      <div className="space-y-2">
        <div className="relative">
          <p className="text-xl font-bold text-gray-900">{user?.name || 'User'}님, 반갑습니다!</p>
        </div>
      </div>
      <div className="mr-6">
        <ProfileDropdown />
      </div>
    </div>
  );
};

export default MainHeader;
