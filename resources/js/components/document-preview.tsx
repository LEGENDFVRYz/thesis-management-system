import { Download, FileText, Pencil, Trash2 } from 'lucide-react';
import { HTMLAttributes } from 'react';

// --- UTILITY ---
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

// --- SUB-COMPONENT: BUTTON 
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'outline' | 'ghost';
    size?: 'default' | 'sm';
}

function Button({ children, onClick, variant = 'default', size = 'default', className = '', ...props }: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#730000] disabled:opacity-50 disabled:pointer-events-none';
  
  // VARIANTS
  const variants = {
    default: 'bg-[#730000] text-white hover:bg-[#5a0000]',
    outline: 'border border-neutral-300 bg-transparent hover:bg-neutral-100 text-neutral-900',
    ghost:   'bg-transparent hover:bg-neutral-100 text-neutral-700', 
  };

  // SIZES
  const sizes = {
    default: 'h-10 py-2 px-4',
    sm:      'h-8 px-3 text-xs', 
  };
  
  return (
    <button 
        type="button" 
        className={cn(baseStyles, variants[variant], sizes[size], className)} 
        onClick={onClick}
        {...props}
    >
      {children}
    </button>
  );
}

// --- MAIN GLOBAL COMPONENT ---
interface FilePreviewProps extends HTMLAttributes<HTMLDivElement> {
    fileUrl: string;
    fileName: string;
    fileType?: 'pdf' | string; 
    fileSize?: string;
    onDownload?: () => void;
    onEdit?: () => void;   // If provided, shows Edit button
    onDelete?: () => void; // If provided, shows Delete button
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
                'flex h-[600px] w-full flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm animate-in fade-in zoom-in-95 duration-200',
                className
            )}
            {...props}
        >
            {/* 1. HEADER / TOOLBAR */}
            <div className="relative z-10 flex h-14 shrink-0 items-center justify-between border-b border-neutral-100 bg-white px-4">
                
                {/* Left: File Info */}
                <div className="flex items-center gap-3 overflow-hidden">
                    {/* Icon Box */}
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#730000]/10">
                        <FileText className="h-4 w-4 text-[#730000]" />
                    </div>
                    
                    {/* Text Info */}
                    <div className="flex flex-col min-w-0">
                        <h3 
                            className="truncate text-sm font-semibold text-neutral-900 max-w-[200px] sm:max-w-[300px]" 
                            title={fileName}
                        >
                            {fileName}
                        </h3>
                        {fileSize && (
                            <span className="text-xs text-neutral-400">{fileSize}</span>
                        )}
                    </div>
                </div>

                {/* Right: ACTION BUTTONS */}
                <div className="flex items-center gap-1">
                    
                    {/* A. DOWNLOAD */}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onDownload || (() => window.open(fileUrl, '_blank'))}
                        className="h-8 w-8 p-0 text-neutral-500 hover:bg-neutral-100 hover:text-[#730000]"
                        title="Download"
                    >
                        <Download className="h-4 w-4" />
                    </Button>

                    {/* B. EDIT / REPLACE */}
                    {onEdit && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                                e.preventDefault();
                                onEdit();
                            }}
                            className="h-8 w-8 p-0 text-neutral-500 hover:bg-neutral-100 hover:text-blue-600"
                            title="Replace File"
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>
                    )}

                    {/* C. DELETE */}
                    {onDelete && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                                e.preventDefault();
                                onDelete();
                            }}
                            className="h-8 w-8 p-0 text-neutral-500 hover:bg-red-50 hover:text-red-600"
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