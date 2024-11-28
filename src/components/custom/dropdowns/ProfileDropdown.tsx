import * as React from 'react';
import { TbChevronDown, TbChevronUp, TbLogout, TbUser } from 'react-icons/tb';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface ProfileDropdownProps {
  name: string;
  email: string;
  imageUrl?: string;
  onMyPage?: () => void;
  onSignout?: () => void;
  className?: string;
}

const ProfileDropdown = React.forwardRef<HTMLDivElement, ProfileDropdownProps>(
  ({ name, email, onMyPage, imageUrl, onSignout, className }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
      <div ref={ref} className={cn('flex items-center', className)}>
        <div className="flex items-center gap-2">
          <Avatar className="w-9 h-9">
            <AvatarImage src={imageUrl} alt={name} />
            <AvatarFallback>{name[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start mr-2">
            <span className="text-gray-900 font-bold text-sm">{name}</span>
            <span className="text-gray-700 text-xs">{email}</span>
          </div>
          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger className="outline-none">
              <div className="text-foreground hover:bg-gray-100 p-1 rounded transition-colors mr-2">
                {isOpen ? <TbChevronUp size={20} /> : <TbChevronDown size={20} />}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[184px]" sideOffset={12}>
              <DropdownMenuItem onClick={onMyPage} className="px-3 py-2">
                <TbUser className="mr-2" />
                <span>마이페이지</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={onSignout}
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
