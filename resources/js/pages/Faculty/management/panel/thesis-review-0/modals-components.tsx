import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { AlertCircle } from 'lucide-react';

interface ConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    description?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    isLoading?: boolean;
}

export function ConfirmDialog({
    open,
    onOpenChange,
    title = 'Are you sure you want to save changes?',
    description = 'This action cannot be undone.',
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    onConfirm,
    isLoading = false,
}: ConfirmDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[90vw] !max-w-[400px] rounded-2xl p-6">
                {/* Icon */}
                <div className="flex justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                        <AlertCircle className="h-6 w-6 text-destructive" />
                    </div>
                </div>

                {/* Text */}
                <div className="mt-4 text-center">
                    <p className="text-base font-semibold text-foreground">
                        {title}
                    </p>
                    <p className="text-base font-semibold text-foreground">
                        {description}
                    </p>
                </div>

                {/* Actions */}
                <div className="mt-6 flex gap-3">
                    <Button
                        variant="outline"
                        size="default"
                        className="flex-1 rounded-full"
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                    >
                        {cancelLabel}
                    </Button>

                    <Button
                        variant="primary"
                        className="flex-1 rounded-full"
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {confirmLabel}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
