import { FC, useState } from 'react';
import {
  TbFileDatabase,
  TbFileMusic,
  TbFileTypography,
  TbFolders,
  TbFolderShare,
  TbLayoutSidebar,
  TbSmartHome,
} from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';

import CreateProjectDialog from '@/components/custom/dialogs/CreateProjectDialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import logofull from '@/images/logo-full.png';
import logomini from '@/images/logo-mini.png';
import { useProjectStore } from '@/stores/project.store';

interface NavSidebarButtonProps {
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
}

const SidebarButton: FC<NavSidebarButtonProps> = ({ icon: Icon, label, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="flex flex-col group-[.expanded]/navbar:justify-start justify-center py-2 w-full group-[.expanded]/navbar:w-48 items-center px-2 rounded-lg cursor-pointer hover:bg-gray-50 group-[.expanded]/navbar:flex-row group/sidebarButton"
    >
      <Icon className="min-w-6 h-6 text-black group-hover/sidebarButton:text-primary" />
      <span
        className="ml-2.5 text-black overflow-hidden whitespace-nowrap   
        w-0 h-0 opacity-0 group-[.expanded]/navbar:w-auto group-[.expanded]/navbar:opacity-100  group-[.expanded]/navbar:h-auto group-hover/sidebarButton:text-primary"
      >
        {label}
      </span>
      <div
        className={
          'group-[.expanded]/navbar:absolute text-tiny opacity-100 group-[.expanded]/navbar:opacity-0 group-hover/sidebarButton:text-primary'
        }
      >
        {label}
      </div>
    </div>
  );
};

export function NavSidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const projects = useProjectStore((state) => state.projects);

  const getProjectIcon = (type: string) => {
    switch (type) {
      case 'TTS':
        return TbFileTypography;
      case 'VC':
        return TbFileMusic;
      case 'CONCAT':
        return TbFileDatabase;
      default:
        return TbFileTypography;
    }
  };

  return (
    <div
      className={`flex h-screen w-[104px] flex-col border-r bg-white px-6 group/navbar ${isExpanded ? 'expanded w-[244px]' : ''}`}
    >
      <div className=" border-b flex items-center">
        <div className="h-[91px] w-full flex items-center gap-2">
          {/* 미니 로고 */}
          <span
            className={`flex items-center transition-opacity duration-300 ${
              isExpanded ? 'opacity-0 hidden' : 'opacity-100'
            }`}
          >
            <img src={logomini} alt="AI" className="h-6 w-auto" />
          </span>

          {/* 풀 로고 */}
          <span
            className={`transition-opacity duration-300 ${
              isExpanded ? 'opacity-100' : 'opacity-0 hidden'
            }`}
          >
            <img src={logofull} alt="AI PARK" className="h-6 w-auto" />
          </span>
        </div>
      </div>

      {/* <Separator className="mb-6" /> */}

      {/* Dialog for Create Project */}
      <Dialog>
        {/* Dialog Trigger */}
        <DialogTrigger asChild>
          <Button size="icon" icon className="mt-6">
            새 프로젝트 생성
          </Button>
        </DialogTrigger>
        <CreateProjectDialog />
      </Dialog>

      <div className="scrollArea py-6">
        <div className="flex flex-col w-full text-black text-body2">
          <div>
            <h2
              className={`pt-2 pb-3 text-overline  ${
                isExpanded ? 'ml-2 text-left' : 'ml-0 text-center'
              }`}
            >
              General
            </h2>
          </div>
          <div className="flex flex-col w-full gap-3">
            <SidebarButton icon={TbSmartHome} label="홈" onClick={() => navigate('/')} />
            <SidebarButton
              icon={TbFolders}
              label={isExpanded ? '프로젝트 목록' : '프로젝트'}
              onClick={() => navigate('/projects')}
            />
            <SidebarButton
              icon={TbFolderShare}
              label={isExpanded ? '히스토리 내역' : '히스토리'}
              onClick={() => navigate('/Historys')}
            />
          </div>
        </div>
        <Separator className="my-4" />
        <div className="pt-2 pb-3">
          <h2
            className={`pt-2 pb-3 text-overline ${
              isExpanded ? 'ml-2 text-left' : 'ml-0 text-center'
            }`}
          >
            Workspace
          </h2>
        </div>
        <div className="flex flex-col w-full gap-3">
          {/* <SidebarButton icon={TbFileTypography} label="TTS" />
          <SidebarButton icon={TbFileMusic} label="VC" />
          <SidebarButton icon={TbFileDatabase} label="CONCAT" /> */}
          {projects.map((project) => (
            <SidebarButton
              key={project.id}
              icon={getProjectIcon(project.type)}
              label={project.name}
              onClick={() => navigate(`/${project.type.toLowerCase()}`)}
            />
          ))}
        </div>
      </div>
      <div className="mt-auto h-[93px]">
        <Separator />
        <button className="mt-9 ml-4" onClick={() => setIsExpanded(!isExpanded)}>
          <TbLayoutSidebar className="w-6 h-6 group-[.expanded]/navbar:text-gray-300 text-black" />
        </button>
      </div>
    </div>
  );
}
