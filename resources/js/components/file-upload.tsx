import { Check, CloudUpload, FileText, X } from 'lucide-react';
import { useRef, useState, DragEvent, ChangeEvent } from 'react';

// --- UTILITY ---
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

// --- SUB-COMPONENTS ---
// 1. Button (Themed for Thesis System)
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'outline';
}

function Button({ children, onClick, variant = 'default', className = '', ...props }: ButtonProps) {
  const baseStyles = 'px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#730000]';
  
  const variantStyles = variant === 'outline' 
    ? 'border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50'
    : 'bg-[#730000] text-white hover:bg-[#5a0000] shadow-md'; // Maroon Theme
  
  return (
    <button 
        type="button" 
        className={cn(baseStyles, variantStyles, className)} 
        onClick={onClick}
        {...props}
    >
      {children}
    </button>
  );
}

// 2. Toast (Local notification for this component)
function Toast({ message, description, type = 'success' }: { message: string, description?: string, type?: 'success' | 'error' }) {
  return (
    <div className={cn(
      'absolute top-4 right-4 z-[50] rounded-lg p-4 shadow-xl animate-in slide-in-from-top-2 duration-300 border bg-white',
      type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
    )}>
      <div className={cn('font-bold', type === 'success' ? 'text-green-800' : 'text-red-800')}>
        {message}
      </div>
      {description && (
        <div className={cn('text-xs mt-1 font-medium', type === 'success' ? 'text-green-600' : 'text-red-600')}>
          {description}
        </div>
      )}
    </div>
  );
}

// --- MAIN GLOBAL COMPONENT ---
interface FileUploadProps {
    acceptedTypes?: string; // e.g. ".pdf,.docx"
    maxSizeMB?: number;     // e.g. 50
    onFilesSelected?: (files: File[]) => void; // Communication with Parent
}

export default function FileUpload({ 
    acceptedTypes = '.pdf,.docx,.jpg,.png', 
    maxSizeMB = 100,
    onFilesSelected 
}: FileUploadProps) {
  
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success'>('idle');
  const [progress, setProgress] = useState(0);
  const [toast, setToast] = useState<{message: string, description: string, type: 'success' | 'error'} | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string, description: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, description, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDrag = (e: DragEvent, dragging: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    if (status !== 'idle') return;
    setIsDragging(dragging);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (status !== 'idle') return;
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndStartUpload(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndStartUpload(Array.from(e.target.files));
    }
  };

  const validateAndStartUpload = (uploadedFiles: File[]) => {
    const validFiles: File[] = [];
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    uploadedFiles.forEach((file) => {
      // 1. Check Size
      if (file.size > maxSizeBytes) {
        showToast(`File too large: ${file.name}`, `Max size is ${maxSizeMB}MB.`, 'error');
        return;
      }
      // 2. Check Type
      if (acceptedTypes) {
        const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
        const allowedExtensions = acceptedTypes.split(',').map((t) => t.trim().toLowerCase());
        if (!allowedExtensions.includes(fileExtension)) {
          showToast(`Invalid format: ${file.name}`, `Allowed: ${acceptedTypes}`, 'error');
          return;
        }
      }
      validFiles.push(file);
    });

    if (validFiles.length === 0) return;

    // Start Simulation
    setFiles(validFiles);
    setStatus('uploading');
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        const nextProgress = prev + 10; 

        if (nextProgress >= 100) {
          clearInterval(interval);
          setStatus('success');
          showToast('Upload Complete', `${validFiles.length} file(s) ready.`);
          
          // DELAY: Wait 1s so user sees the 100% Red Bar before logic runs
          setTimeout(() => {
              if (onFilesSelected) {
                  onFilesSelected(validFiles); 
              }
          }, 1000); 
          
          return 100; 
        }
        return nextProgress;
      });
    }, 120);
  };

  const resetUpload = () => {
    setFiles([]);
    setStatus('idle');
    setProgress(0);
    if (inputRef.current) inputRef.current.value = '';
    if (onFilesSelected) onFilesSelected([]);
  };

  const removeFile = (indexToRemove: number) => {
    const updatedFiles = files.filter((_, index) => index !== indexToRemove);
    setFiles(updatedFiles);
    
    if (onFilesSelected) onFilesSelected(updatedFiles);

    if (updatedFiles.length === 0) {
      resetUpload();
    }
  };

  return (
    <div className="w-full relative">
      {toast && <Toast message={toast.message} description={toast.description} type={toast.type} />}
      
      <div
        className={cn(
          'relative flex min-h-[300px] w-full flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all duration-300 ease-in-out bg-white',
          // THEME: Blue -> Maroon/Red Logic
          isDragging ? 'border-[#730000] bg-red-50' : 'border-neutral-300',
          status === 'success' && 'border-green-500 bg-neutral-50'
        )}
        onDragOver={(e) => handleDrag(e, true)}
        onDragLeave={(e) => handleDrag(e, false)}
        onDrop={handleDrop}
      >
        {/* STATE 1: IDLE */}
        {status === 'idle' && (
          <div className="flex flex-col items-center p-6 text-center animate-in fade-in zoom-in-95">
            <div className="mb-4 rounded-xl bg-neutral-100 p-4 shadow-sm">
              <CloudUpload className="h-8 w-8 text-neutral-600" />
            </div>
            <p className="mb-2 text-lg font-medium text-neutral-700">
              Drag and drop files here, or{' '}
              <button
                type="button"
                className="cursor-pointer font-bold text-[#730000] hover:underline"
                onClick={() => inputRef.current?.click()}
              >
                click to select
              </button>
            </p>
            <p className="text-sm text-neutral-400">
              Supported: {acceptedTypes}
            </p>
            <p className="mt-1 text-xs text-neutral-400 font-medium">
              Max size: {maxSizeMB} MB
            </p>
          </div>
        )}

        {/* STATE 2: UPLOADING (With the RED BAR you wanted) */}
        {status === 'uploading' && (
          <div className="flex w-full max-w-xs flex-col items-center justify-center p-6 animate-in fade-in zoom-in-95">
            <div className="mb-2 flex w-full justify-between text-sm">
              <span className="font-semibold text-neutral-700">
                Uploading {files.length} file{files.length > 1 ? 's' : ''}...
              </span>
              <span className="text-neutral-500 font-mono">{progress}%</span>
            </div>
            
            <div className="h-3 w-full overflow-hidden rounded-full bg-neutral-100 border border-neutral-200">
              <div
                className="h-full bg-[#730000] transition-all duration-300 ease-out rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-neutral-400">Please wait while we process your document.</p>
          </div>
        )}

        {/* STATE 3: SUCCESS */}
        {status === 'success' && (
          <div className="flex w-full flex-col items-center p-6 animate-in fade-in zoom-in-95">
            <div className="mb-4 rounded-xl border border-green-200 bg-green-50 p-3 text-green-700">
              <Check className="h-8 w-8" />
            </div>

            <h3 className="mb-4 text-lg font-bold text-neutral-800">
              Upload Successful!
            </h3>

            {/* File List */}
            <div className="mb-6 w-full space-y-2 max-h-[160px] overflow-y-auto pr-2">
              {files.map((file, index) => (
                <div 
                  key={`${file.name}-${index}`}
                  className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-white px-4 py-3 shadow-sm"
                >
                  <FileText className="h-5 w-5 shrink-0 text-[#730000]" />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-sm font-medium text-neutral-900">
                      {file.name}
                    </span>
                    <span className="text-xs text-neutral-500">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="ml-2 text-neutral-400 hover:text-red-600 transition-colors"
                    title="Remove file"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <Button 
              onClick={resetUpload} 
              variant="outline" 
              className="h-9 min-w-[120px] rounded-full text-neutral-600 hover:text-[#730000] border-neutral-300"
            >
              Upload New
            </Button>
          </div>
        )}

        <input
          type="file"
          multiple
          ref={inputRef}
          className="hidden"
          accept={acceptedTypes}
          onChange={handleFileInput}
        />
      </div>
    </div>
  );
}