import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Download, FileText, Pencil, Trash2 } from 'lucide-react';
import { HTMLAttributes } from 'react';

interface FilePreviewProps extends HTMLAttributes<HTMLDivElement> {
    fileUrl: string;
    fileName: string;
    fileType?: 'pdf' | string; 
    fileSize?: string;
    onDownload?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
}

export default function FilePreview({
    className = '',
    fileUrl,
    fileName,
    fileType = 'pdf', 
    fileSize,
    onDownload,
    onEdit,
    onDelete,
    ...props
}: FilePreviewProps) {

    return (
        <div
            className={cn(
                'flex h-[600px] w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm animate-in fade-in zoom-in-95 duration-200',
                className
            )}
            {...props}
        >
            {/* 1. HEADER / TOOLBAR */}
            <div className="relative z-50 flex h-14 shrink-0 items-center justify-between border-b border-neutral-100 bg-white px-4">
                
                {/* Left: File Info */}
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#730000]/10">
                        <FileText className="h-4 w-4 text-[#730000]" />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <h3 className="truncate text-sm font-semibold text-neutral-900 max-w-[200px]" title={fileName}>
                            {fileName}
                        </h3>
                    </div>
                </div>

                {/* Right: THE 3 BUTTONS */}
                <div className="flex items-center gap-1">
                    
                    {/* 1. DOWNLOAD */}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onDownload || (() => window.open(fileUrl, '_blank'))}
                        className="h-8 w-8 text-neutral-500 hover:bg-neutral-100 hover:text-[#730000]"
                        title="Download"
                    >
                        <Download className="h-4 w-4" />
                    </Button>

                    {/* 2. EDIT / REPLACE */}
                    {onEdit && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                                e.preventDefault();
                                onEdit();
                            }}
                            className="h-8 w-8 text-neutral-500 hover:bg-neutral-100 hover:text-blue-600"
                            title="Replace File"
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>
                    )}

                    {/* 3. DELETE */}
                    {onDelete && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                                e.preventDefault();
                                onDelete();
                            }}
                            className="h-8 w-8 text-neutral-500 hover:bg-red-50 hover:text-red-600"
                            title="Delete File"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>

            {/* 2. PREVIEW CONTENT (PDF ONLY) */}
            <div className="relative flex-1 overflow-hidden bg-neutral-100">
                <iframe
                    src={`${fileUrl}#toolbar=0&view=FitH`}
                    className="h-full w-full"
                    title="PDF Preview"
                />
            </div>
        </div>
    );
}