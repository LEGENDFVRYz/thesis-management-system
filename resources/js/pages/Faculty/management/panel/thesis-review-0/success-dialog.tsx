import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Check } from 'lucide-react';

interface SuccessDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    message?: string;
}

export function SuccessDialog({
    open,
    onOpenChange,
    message = 'Draft saved successfully.',
}: SuccessDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[90vw] !max-w-[400px] rounded-2xl p-8">
                {/* Icon */}
                <div className="flex justify-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-alert-success">
                        <Check className="h-7 w-7 text-primary-foreground" />
                    </div>
                </div>

                {/* Message */}
                <div className="mt-6 text-center">
                    <p className="text-lg font-medium text-foreground">
                        {message}
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
