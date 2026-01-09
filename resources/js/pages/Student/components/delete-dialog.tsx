import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface DeleteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    description?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    isLoading?: boolean;
}

export function DeleteDialog({
    open,
    onOpenChange,
    title = 'Are you sure you want to delete this file?',
    description = 'This action cannot be undone.',
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    onConfirm,
    isLoading = false,
}: DeleteDialogProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div
                className="w-[400px] rounded-lg bg-background p-6"
                style={{
                    border: "1px solid var(--primary)",
                    boxShadow: "0 10px 20px rgb(115 0 0 / 0.25)",
                }}
            >
                <AlertCircle
                    size={48}
                    className="mx-auto mb-5"
                    style={{ color: "var(--primary)" }}
                />

                <p
                    className="mb-2 text-center font-dm font-medium text-body-2"
                    style={{ color: "var(--primary)" }}
                >
                    {title}
                </p>

                <p
                    className="mb-6 text-center font-dm text-body-4"
                    style={{ color: "var(--muted-foreground)" }}
                >
                    {description}
                </p>

                <div className="flex justify-center gap-4">
                    <Button
                        variant="secondary"
                        className="rounded-full px-8"
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                        size="default"
                    >
                        {cancelLabel}
                    </Button>

                    <Button
                        variant="negative"
                        className="rounded-full px-8"
                        onClick={onConfirm}
                        disabled={isLoading}
                        size="default"
                    >
                        {confirmLabel}
                    </Button>
                </div>
            </div>
        </div>
    );
}