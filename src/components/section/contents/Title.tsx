import { useEffect, useState } from 'react';
import { TbCheck, TbPencil } from 'react-icons/tb';
import { Link, useNavigate } from 'react-router-dom';

import { CloseButton, SaveButton } from '@/components/custom/buttons/IconButton';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useVCStore } from '@/stores/vc.store';

export interface TitleProps {
  variant?: 'project' | 'recent';
  type?: 'TTS' | 'VC' | 'Concat';
  projectTitle?: string;
  title?: string;
  description?: string;
  onSave?: () => void;
  onClose?: () => void;
  onProjectNameChange?: (newName: string) => void;
}

const Title = ({
  variant = 'project',
  type,
  projectTitle = '',
  title,
  description,
  onSave,
  onClose,
  onProjectNameChange,
}: TitleProps) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(projectTitle);
  const handleSaveVC = useVCStore((state) => state.handleSave);

  useEffect(() => {
    setEditTitle(projectTitle);
  }, [projectTitle]);

  const handleSubmit = () => {
    setIsEditing(false);
    if (editTitle !== projectTitle && onProjectNameChange) {
      onProjectNameChange(editTitle);
    }
  };

  const handleSaveClick = () => {
    if (type === 'VC') {
      handleSaveVC();
    }
    onSave?.();
  };

  const handleClose = () => {
    onClose?.();
    navigate('/project');
  };

  if (variant === 'recent') {
    return (
      <div className="py-5">
        <h2 className="text-h2 text-black mb-2">{title}</h2>
        <p className="text-body2 text-black">{description}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[71px] mx-1">
      <div className="flex items-center gap-2 mb-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={`/${type?.toLowerCase()}`} className="text-gray-900 hover:text-gray-700">
                  {type}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild className="text-primary">
                <Link to="#">{editTitle}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={handleSubmit}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                className="text-2xl font-semibold h-9 w-auto min-w-[200px]"
                autoFocus
              />
              <div className="w-8 h-8 flex items-center justify-center">
                <button
                  onClick={handleSubmit}
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <TbCheck className="w-5 h-5 text-black" />
                </button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-semibold text-black">{editTitle}</h1>
              <div className="w-8 h-8 flex items-center justify-center">
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="ghost"
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <TbPencil className="w-5 h-5 ml-0 text-black" />
                </Button>
              </div>
            </>
          )}
        </div>
        <div className="flex items-center gap-2 -mt-1">
          <SaveButton onClick={handleSaveClick} />
          <CloseButton onClick={handleClose} />
        </div>
      </div>
    </div>
  );
};

export default Title;
