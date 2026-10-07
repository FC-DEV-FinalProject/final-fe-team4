import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TermsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  content: string;
  type: 'service' | 'privacy';
  onAgree: (type: 'service' | 'privacy') => void;
}

const TermsDialog = ({ open, onOpenChange, title, content, type, onAgree }: TermsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[800px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh]">
          <div className="whitespace-pre-wrap text-sm pr-4">{content}</div>
        </ScrollArea>
        <div className="flex justify-center mt-4">
          <Button
            size="md"
            onClick={() => {
              onAgree(type);
              onOpenChange(false);
            }}
          >
            동의하기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TermsDialog;
