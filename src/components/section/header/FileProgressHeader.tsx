import FileProgressDropdown, {
  FileProgressItem,
} from '@/components/custom/dropdowns/FileProgressDropdown';
import ProfileDropdown from '@/components/custom/dropdowns/ProfileDropdown';

interface FileProgressHeaderProps {
  files: FileProgressItem[];
  onDeleteCompleted?: () => void;
  onRetryFailed?: () => void;
}

export const FileProgressHeader = ({
  files,
  onDeleteCompleted,
  onRetryFailed,
}: FileProgressHeaderProps) => {
  return (
    <div className="flex items-center justify-between pt-3">
      <div className="space-y-2">
        <h1 className="text-[14px] font-bold ml-2">작업 현황</h1>
        <div className="relative">
          <FileProgressDropdown
            items={files}
            onDeleteCompleted={onDeleteCompleted}
            onRetryFailed={onRetryFailed}
          />
        </div>
      </div>
      <div className="mr-6">
        <ProfileDropdown />
      </div>
    </div>
  );
};
