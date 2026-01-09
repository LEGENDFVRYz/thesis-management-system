import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface SuccessDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    message?: string;
}

export function SuccessDialog({
    open,
    onOpenChange,
    message = 'Action completed successfully.',
}: SuccessDialogProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div
                className="w-[400px] rounded-lg bg-background p-6"
                style={{
                    border: "1px solid var(--alert-success)",
                    boxShadow: "0 10px 20px rgb(0 128 0 / 0.25)",
                }}
            >
                <CheckCircle
                    size={48}
                    className="mx-auto mb-5"
                    style={{ color: "var(--alert-success)" }}
                />

                <p
                    className="mb-6 text-center font-dm font-medium text-body-2"
                    style={{ color: "var(--alert-success)" }}
                >
                    {message}
                </p>

                <div className="flex justify-center">
                    <Button
                        variant="secondary"
                        className="rounded-full px-10 bg-alert-success text-primary-foreground hover:bg-alert-success"
                        onClick={() => onOpenChange(false)}
                        size="default"
                    >
                        Done
                    </Button>
                </div>
            </div>
        </div>
    );
}