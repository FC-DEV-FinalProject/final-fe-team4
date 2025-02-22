import { Slot } from '@radix-ui/react-slot';
import * as React from 'react';
import {
  TbDeviceFloppy,
  TbDownload,
  TbHistory,
  TbPlayerPlayFilled,
  TbRefresh,
  TbReload,
  TbSparkles,
  TbTrash,
  TbUpload,
  TbX,
} from 'react-icons/tb';

import { cn } from '@/lib/utils';
interface TTSPlaybackHistoryButtonProps {
  readonly onClick?: () => void;
  readonly isActive?: boolean;
  readonly className?: string;
  readonly isHistoryViewEnabled: boolean;
}
interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  readonly icon: React.ReactNode;
  readonly label: string;
  readonly asChild?: boolean;
  readonly iconBgColor?: string;
  readonly iconColor?: string;
  readonly textColor?: string;
  readonly width?: string;
  disabled?: boolean;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      label,
      asChild = false,
      iconBgColor,
      iconColor,
      textColor = 'text-gray-900',
      width = '228px',
      className,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center text-sm font-medium transition-colors',
          'hover:bg-gray-100',
          'bg-gray-50',
          disabled ? 'opacity-40 cursor-not-allowed' : '',
          className
        )}
        aria-label={label}
        {...props}
        style={{
          display: 'flex',
          width,
          padding: '8px 10px',
          alignItems: 'center',
          gap: '8px',
          borderRadius: '8px',
        }}
      >
        <span
          className={cn(iconBgColor, iconColor, 'flex items-center justify-center')}
          style={{
            width: '20px',
            height: '20px',
            borderRadius: '5px',
            fontSize: '20px',
          }}
        >
          {React.cloneElement(icon as React.ReactElement, { width: 20, height: 20 })}
        </span>
        <span
          className={cn(textColor)}
          style={{
            fontFamily: 'Pretendard',
            fontSize: '16px',
            fontWeight: 500,
            lineHeight: '24px',
          }}
        >
          {label}
        </span>
      </Comp>
    );
  }
);
IconButton.displayName = 'IconButton';

interface UploadTextButtonProps {
  onClick?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export const UploadTextButton: React.FC<UploadTextButtonProps> = ({
  onClick,
  isLoading,
  disabled,
}) => {
  return (
    <IconButton
      icon={<TbUpload />}
      label="텍스트 파일 업로드"
      iconBgColor="bg-purple-50"
      iconColor="text-purple-500"
      textColor="text-gray-800"
      width="167px"
      onClick={onClick}
      disabled={disabled || isLoading}
    />
  );
};

export function UploadAudioButton({ onClick }: { readonly onClick?: () => void }) {
  return (
    <IconButton
      icon={<TbUpload />}
      label="오디오 파일 업로드"
      iconBgColor="bg-purple-50"
      iconColor="text-purple-500"
      textColor="text-gray-800"
      width="167px"
      onClick={onClick}
    />
  );
}

export function SaveButton({ onClick }: { readonly onClick?: () => void }) {
  return (
    <IconButton
      icon={<TbDeviceFloppy />}
      label="저장"
      iconBgColor="bg-pink-50"
      iconColor="text-pink-500"
      textColor="text-gray-800"
      width="76px"
      onClick={onClick}
    />
  );
}

export function RecreateButton({ onClick }: { readonly onClick?: () => void }) {
  return (
    <IconButton
      icon={<TbReload />}
      label="재생성"
      iconBgColor="bg-blue-50"
      iconColor="text-blue-500"
      textColor="text-gray-800"
      width="90px"
      onClick={onClick}
    />
  );
}

export function DownloadButton({ onClick }: { readonly onClick?: () => void }) {
  return (
    <IconButton
      icon={<TbDownload />}
      label="다운로드"
      iconBgColor="bg-blue-50"
      iconColor="text-blue-500"
      textColor="text-gray-800"
      width="104px"
      onClick={onClick}
    />
  );
}

export function TTSPlaybackHistoryButton({
  onClick,
  isActive,
  isHistoryViewEnabled,
}: TTSPlaybackHistoryButtonProps) {
  return (
    <IconButton
      icon={<TbHistory />}
      label="내역"
      iconBgColor="bg-blue-50"
      iconColor="text-blue-500"
      textColor={`text-gray-800`}
      width="78px"
      onClick={onClick}
      className={cn(
        `border border-transparent group/tts`,
        isActive ? 'border-blue-500 bg-blue-50 text-blue-500 ' : '',
        isHistoryViewEnabled
          ? ''
          : 'bg-gray-50 opacity-50 cursor-not-allowed pointer-events-none  border-transparent '
      )}
      type="button"
    />
  );
}

export function ApplyButton({
  onClick,
  className,
}: {
  readonly onClick?: () => void;
  readonly className?: string;
}) {
  return (
    <IconButton
      icon={<TbSparkles />}
      label="적용하기"
      iconBgColor="bg-blue-50"
      iconColor="text-blue-600"
      onClick={onClick}
      className={className}
    />
  );
}

export function ResetChangesButton({
  onClick,
  className,
}: {
  readonly onClick?: () => void;
  readonly className?: string;
}) {
  return (
    <IconButton
      icon={<TbRefresh />}
      label="변경 초기화"
      iconBgColor="bg-blue-50"
      iconColor="text-blue-600"
      onClick={onClick}
      className={className}
    />
  );
}

export function DeleteCompletedButton() {
  return (
    <IconButton
      icon={<TbTrash />}
      label="완료 작업 삭제"
      iconBgColor="bg-blue-50"
      iconColor="text-blue-500"
      width="228px"
    />
  );
}

export function RetryFailedButton() {
  return (
    <IconButton
      icon={<TbPlayerPlayFilled />}
      label="실패 작업 재실행"
      iconBgColor="bg-blue-50"
      iconColor="text-blue-600"
      width="228px"
    />
  );
}

export function CloseButton({
  onClick,
  className,
}: {
  readonly onClick?: () => void;
  readonly className?: string;
}) {
  return (
    <IconButton
      icon={<TbX />}
      label="닫기"
      iconBgColor="bg-slate-100"
      iconColor="text-slate-600"
      textColor="text-gray-800"
      width="76px"
      onClick={onClick}
      className={className}
    />
  );
}

export { IconButton };
