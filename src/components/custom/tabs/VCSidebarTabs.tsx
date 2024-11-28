import React, { useEffect, useState } from 'react';
import { TbFileMusic } from 'react-icons/tb';

import KebabMenu from '@/components/custom/dropdowns/KebabMenu';
import FileUploadBox from '@/components/custom/feature/FileUploadBox';
// import Pagination from '@/components/ui/pagination';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
interface VoiceFile {
  id: string;
  name: string;
  size: number;
  isEditing?: boolean;
}
const dummyFiles: VoiceFile[] = Array.from({ length: 8 }, (_, i) => ({
  id: `file-${i + 1}`,
  name: `샘플 보이스 ${i + 1}.wav`,
  size: 104.2 * 1024 * 1024,
}));
const VCSidebarTabs = () => {
  const [activeFile, setActiveFile] = useState<VoiceFile | null>(null);
  const [files, setFiles] = useState<VoiceFile[]>(dummyFiles);
  const [currentPage, setCurrentPage] = useState(1);
  const filesPerPage = 4;
  const formatFileSize = (size: number) => {
    const sizeInMB = size / (1024 * 1024);
    return sizeInMB < 0.1 ? '0.1' : sizeInMB.toFixed(1);
  };
  const handleFileUpload = (newFile: VoiceFile) => {
    setFiles((prev) => {
      const isDuplicate = prev.some((file) => file.name === newFile.name);
      if (isDuplicate) return prev;
      return [newFile, ...prev];
    });
  };
  const handleFileSelect = (file: VoiceFile) => {
    setActiveFile(file);
  };
  const handleStartRename = (fileId: string) => {
    setFiles(
      files.map((file) => ({
        ...file,
        isEditing: file.id === fileId,
      }))
    );
  };
  const handleRename = (fileId: string, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const newName = (event.target as HTMLInputElement).value;
      setFiles(
        files.map((file) => ({
          ...file,
          name: file.id === fileId ? newName : file.name,
          isEditing: false,
        }))
      );
      if (activeFile?.id === fileId) {
        setActiveFile((prev) => (prev ? { ...prev, name: newName } : null));
      }
    }
  };
  const handleDelete = (fileId: string) => {
    setFiles(files.filter((file) => file.id !== fileId));
    if (activeFile?.id === fileId) {
      setActiveFile(null);
    }
  };
  useEffect(() => {
    if (files.length > dummyFiles.length) {
      setCurrentPage(1);
    }
  }, [files.length]);
  // const totalPages = Math.ceil(files.length / filesPerPage);
  const currentFiles = files.slice((currentPage - 1) * filesPerPage, currentPage * filesPerPage);
  const FileListItem = ({ file }: { file: VoiceFile }) => (
    <div
      className={`flex items-center justify-between h-[61px] px-3
        border-b border-gray-300 bg-background cursor-pointer
        hover:bg-accent active:bg-muted
        ${activeFile?.id === file.id ? 'bg-muted' : ''}`}
      onClick={() => handleFileSelect(file)}
    >
      <div className="flex items-center gap-3 flex-1">
        <div className="w-4 h-4 text-primary">
          <TbFileMusic size={16} />
        </div>
        <div className="flex-1">
          {file.isEditing ? (
            <input
              type="text"
              defaultValue={file.name}
              className="w-full text-[11px] font-medium px-1 py-0.5 border border-input rounded"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => handleRename(file.id, e)}
              autoFocus
            />
          ) : (
            <div className="text-[11px] font-medium text-foreground">{file.name}</div>
          )}
          <div className="text-[11px] text-muted-foreground">{formatFileSize(file.size)} MB</div>
        </div>
      </div>
      <KebabMenu
        onRename={() => handleStartRename(file.id)}
        onDelete={() => handleDelete(file.id)}
      />
    </div>
  );
  return (
    <div className="w-full h-[460px]">
      <h3 className="text-sm font-bold text-foreground mb-4">목소리</h3>
      <Tabs defaultValue="new" className="h-full">
        <TabsList className="w-full mb-4 flex gap-6 bg-transparent p-0 justify-start border-b border-gray-300 relative rounded-none">
          <TabsTrigger
            value="new"
            className="bg-transparent text-xs font-medium leading-[18px] px-0 pb-2
              text-muted-foreground data-[state=active]:text-foreground data-[state=active]:shadow-none
              data-[state=active]:bg-transparent w-fit rounded-none
              relative after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-[2px]
              after:bg-transparent data-[state=active]:after:bg-foreground data-[state=active]:after:z-10"
          >
            새 파일 추가
          </TabsTrigger>
          <TabsTrigger
            value="archive"
            className="bg-transparent text-xs font-medium leading-[18px] px-0 pb-2
              text-muted-foreground data-[state=active]:text-foreground data-[state=active]:shadow-none
              data-[state=active]:bg-transparent w-fit rounded-none
              relative after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-[2px]
              after:bg-transparent data-[state=active]:after:bg-foreground data-[state=active]:after:z-10"
          >
            파일 보관함
          </TabsTrigger>
        </TabsList>
        <div className="space-y-6">
          <TabsContent value="new" className="mt-0">
            <FileUploadBox onUploadSuccess={handleFileUpload} mode="upload" />
          </TabsContent>
          <TabsContent value="archive" className="mt-0">
            <FileUploadBox selectedFile={activeFile} mode="display" />
            <div className="mt-6">
              <div className="border-t border-gray-300">
                {currentFiles.map((file) => (
                  <FileListItem key={file.id} file={file} />
                ))}
              </div>
              {/* <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              /> */}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
export default VCSidebarTabs;
