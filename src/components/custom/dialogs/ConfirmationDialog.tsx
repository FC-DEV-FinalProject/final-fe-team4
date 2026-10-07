import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface DeleteConfirmProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export const DeleteConfirm = ({ open, onOpenChange, onConfirm }: DeleteConfirmProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[360px] h-[180px] flex flex-col justify-center items-center">
        <DialogHeader>
          <DialogTitle className="text-center mb-5">삭제하시겠습니까?</DialogTitle>
        </DialogHeader>
        <DialogFooter className="mt-5 flex gap-4 justify-center items-center">
          <Button size="lg" variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button size="lg" onClick={onConfirm}>
            확인
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
