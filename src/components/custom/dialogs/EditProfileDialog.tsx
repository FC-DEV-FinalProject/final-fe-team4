import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface EditConfirmProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export const EditConfirm = ({ open, onOpenChange, onConfirm }: EditConfirmProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[400px]">
        <DialogHeader>
          <DialogTitle>정말 수정하시겠습니까?</DialogTitle>
        </DialogHeader>
        <DialogFooter className="mt-5">
          <Button size="sm" variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button size="sm" onClick={onConfirm}>
            확인
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
