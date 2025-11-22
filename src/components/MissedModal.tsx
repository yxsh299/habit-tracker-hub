import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface MissedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
  habitName: string;
}

const MissedModal = ({ isOpen, onClose, onSubmit, habitName }: MissedModalProps) => {
  const [reason, setReason] = useState('');

  const handleSubmit = () => {
    if (reason.trim()) {
      onSubmit(reason);
      setReason('');
      onClose();
    }
  };

  const quickReasons = [
    'Too busy today',
    'Feeling unwell',
    'Forgot about it',
    'Unexpected event',
    'Low energy',
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-text-primary">Why did you miss "{habitName}"?</DialogTitle>
          <DialogDescription className="text-text-secondary">
            Understanding why helps us support you better
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex flex-wrap gap-2">
            {quickReasons.map((quickReason) => (
              <button
                key={quickReason}
                onClick={() => setReason(quickReason)}
                className="px-3 py-1.5 text-sm rounded-lg bg-bg-700 text-text-secondary hover:bg-bg-600 hover:text-text-primary border border-border transition-colors"
              >
                {quickReason}
              </button>
            ))}
          </div>

          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Or type your own reason..."
            className="min-h-[100px] bg-input border-border text-text-primary placeholder:text-text-muted"
          />

          <div className="flex gap-2 justify-end">
            <Button
              onClick={onClose}
              variant="outline"
              className="border-border text-text-secondary hover:bg-bg-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!reason.trim()}
              className="bg-warning hover:bg-warning/90 text-warning-foreground"
            >
              Submit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MissedModal;
