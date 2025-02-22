import * as React from 'react';
import { TbChevronDown, TbChevronUp, TbLogout, TbUser } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';

import { logout } from '@/api/authAPI';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DEFAULT_PROFILE_IMAGE } from '@/constants/images';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth.store';

interface ProfileDropdownProps {
  className?: string;
}

const ProfileDropdown = React.forwardRef<HTMLDivElement, ProfileDropdownProps>(
  ({ className }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const navigate = useNavigate();
    const { user } = useAuthStore();

    const handleLogout = async () => {
      try {
        await logout();

        // Zustand 상태 초기화
        useAuthStore.getState().logout();

        navigate('/signin');
      } catch (error) {
        console.error('로그아웃 실패:', error);
        alert('로그아웃에 실패했습니다. 다시 시도해주세요.');
      }
    };

    const handleMyPageNavigation = () => {
      navigate('/mypage');
    };

    return (
      <div ref={ref} className={cn('flex items-center', className)}>
        <div className="flex items-center gap-2">
          <Avatar className="w-9 h-9">
            <AvatarImage src={DEFAULT_PROFILE_IMAGE} alt="User" />
            <AvatarFallback>{user?.name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start mr-2">
            <span className="text-gray-900 font-bold text-sm">{user?.name || 'Anonymous'}</span>
            <span className="text-gray-700 text-xs">{user?.email || 'No Email'}</span>
          </div>
          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger className="outline-none">
              <div className="text-foreground hover:bg-gray-100 p-1 rounded transition-colors mr-2">
                {isOpen ? <TbChevronUp size={20} /> : <TbChevronDown size={20} />}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[184px]" sideOffset={12}>
              <DropdownMenuItem onClick={handleMyPageNavigation} className="px-3 py-2">
                <TbUser className="mr-2" />
                <span>마이페이지</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-500 focus:text-red-500 px-3 py-2"
              >
                <TbLogout className="mr-2" />
                <span>로그아웃</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  }
);

ProfileDropdown.displayName = 'ProfileDropdown';

export default ProfileDropdown;
