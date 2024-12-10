import { TbArrowUpRight } from 'react-icons/tb';

interface HomeCardProps {
  title: string;
  description1: string;
  description2: string;
  onClick?: () => void;
}

const HomeCard = ({ title, description1, description2, onClick }: HomeCardProps) => {
  return (
    <div className="relative w-[230px] h-[230px] flex-shrink-0 rounded-[16px] bg-white p-4">
      <span className="text-body4 text-gray-700">{title}</span>

      <div className="relative w-[7px] h-[7px] bg-primary rounded-full mt-5 mb-3"></div>

      <div className="text-body1 text-black">
        <p>{description1}</p>
        <p>{description2}</p>
      </div>

      <div className="absolute right-5 bottom-5">
        <button
          onClick={onClick}
          className="relative w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
        >
          <TbArrowUpRight className="h-6 w-6 text-primary" />
        </button>
      </div>
    </div>
  );
};

export default HomeCard;
