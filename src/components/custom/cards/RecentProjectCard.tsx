import React, { useEffect, useState } from 'react';
import { TbArrowUpRight } from 'react-icons/tb';

import RecentCardbg1 from '@/images/recent-card-bg1.svg';
import RecentCardbg2 from '@/images/recent-card-bg2.svg';
import RecentCardbg3 from '@/images/recent-card-bg3.svg';
import RecentCardbg4 from '@/images/recent-card-bg4.svg';

const backgrounds = [RecentCardbg1, RecentCardbg2, RecentCardbg3, RecentCardbg4];

interface RecentProjectCardProps {
  title: string;
  description?: string;
  date: string;
  type: string;
}

const RecentProjectCard: React.FC<RecentProjectCardProps> = ({
  title,
  description,
  date,
  type,
}) => {
  const [background, setBackground] = useState<string>('');

  useEffect(() => {
    // 한 번만 설정된 배경을 유지
    const randomBackground = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    setBackground(randomBackground);
  }, []);

  return (
    <div className="w-[276px] h-[318px] flex-shrink-0 rounded-lg bg-gray-50 overflow-hidden px-6 pt-5 pb-5">
      <div className="relative h-40 overflow-hidden">
        <img src={background} className="w-full h-full object-cover" />

        <div className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-100 z-10">
          <TbArrowUpRight className="text-primary" style={{ fontSize: '30px' }} />
        </div>
      </div>

      <div className="flex items-center space-x-2 mt-5 mb-3">
        <div className="text-body4 text-black px-2.5 border border-black rounded-full">{type}</div>
        <h3 className="text-body3 text-black truncate overflow-hidden whitespace-nowrap">
          {title}
        </h3>
      </div>

      <div>
        <p className="text-overline text-black mb-2 line-clamp-2">{description}</p>
        <span className="text-overline text-gray-500">{date}</span>
      </div>
    </div>
  );
};

export default RecentProjectCard;
