import { Check, CloudUpload, FileText, X } from 'lucide-react';
import { useRef, useState } from 'react';

function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

function Button({ children, onClick, variant = 'default', className = '' }) {
  const baseStyles = 'px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variantStyles = variant === 'outline' 
    ? 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500'
    : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500';
  
  return (
    <button className={cn(baseStyles, variantStyles, className)} onClick={onClick}>
      {children}
    </button>
  );
}

function Toast({ message, description, type = 'success' }) {
  return (
    <div className={cn(
      'fixed top-4 right-4 z-50 rounded-lg p-4 shadow-lg animate-in slide-in-from-top-2 duration-300',
      type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
    )}>
      <div className={cn('font-semibold', type === 'success' ? 'text-green-900' : 'text-red-900')}>
        {message}
      </div>
      {description && (
        <div className={cn('text-sm mt-1', type === 'success' ? 'text-green-700' : 'text-red-700')}>
          {description}
        </div>
      )}
    </div>
  );
}

export default function FileUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState('idle');
  const [progress, setProgress] = useState(0);
  const [toast, setToast] = useState(null);
  const inputRef = useRef(null);

  const maxSizeMB = 100;
  const acceptedTypes = '.pdf,.docx,.jpg,.png';

  const showToast = (message, description, type = 'success') => {
    setToast({ message, description, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDrag = (e, dragging) => {
    e.preventDefault();
    e.stopPropagation();
    if (status !== 'idle') return;
    setIsDragging(dragging);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (status !== 'idle') return;
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndStartUpload(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndStartUpload(Array.from(e.target.files));
    }
  };

  const validateAndStartUpload = (uploadedFiles) => {
    const validFiles = [];
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    uploadedFiles.forEach((file) => {
      // Size Check
      if (file.size > maxSizeBytes) {
        showToast(`File too large: ${file.name}`, `Max size is ${maxSizeMB}MB.`, 'error');
        return;
      }

      // Type Check
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

    // Start Upload Simulation
    setFiles(validFiles);
    setStatus('uploading');
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        const nextProgress = prev + 15;

        // Check if the NEXT value reaches or exceeds 100
        if (nextProgress >= 100) {
          clearInterval(interval);
          setStatus('success');
          showToast('Upload complete', `${validFiles.length} file(s) uploaded successfully.`);
          return 100; 
        }
        
        return nextProgress;
      });
    }, 150);
  };

  const resetUpload = () => {
    setFiles([]);
    setStatus('idle');
    setProgress(0);
    if (inputRef.current) inputRef.current.value = '';
  };

  const removeFile = (indexToRemove) => {
    const updatedFiles = files.filter((_, index) => index !== indexToRemove);
    setFiles(updatedFiles);
    if (updatedFiles.length === 0) {
      resetUpload();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8 flex items-center justify-center">
      {toast && <Toast message={toast.message} description={toast.description} type={toast.type} />}
      
      <div
        className={cn(
          'relative flex min-h-[300px] w-full max-w-lg flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all duration-300 ease-in-out',
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white',
          status === 'success' && 'border-yellow-500 bg-gray-50'
        )}
        onDragOver={(e) => handleDrag(e, true)}
        onDragLeave={(e) => handleDrag(e, false)}
        onDrop={handleDrop}
      >
        {/* STATE 1: IDLE */}
        {status === 'idle' && (
          <div className="flex flex-col items-center p-6 text-center">
            <div className="mb-4 rounded-xl bg-gray-100 p-4 shadow-sm">
              <CloudUpload className="h-8 w-8 text-gray-600" />
            </div>
            <p className="mb-2 text-lg font-medium text-gray-700">
              Drag and drop files here, or{' '}
              <button
                type="button"
                className="cursor-pointer font-semibold text-blue-600 hover:underline"
                onClick={() => inputRef.current?.click()}
              >
                click to select
              </button>
            </p>
            <p className="text-sm text-gray-400">
              Supported: {acceptedTypes || 'PDF, DOCX, JPG'}
            </p>
            <p className="mt-1 text-xs text-gray-400 font-medium">
              Max size: {maxSizeMB} MB
            </p>
          </div>
        )}

        {/* STATE 2: UPLOADING */}
        {status === 'uploading' && (
          <div className="flex w-full max-w-xs flex-col items-center justify-center p-6">
            <div className="mb-2 flex w-full justify-between text-sm">
              <span className="font-medium text-gray-700">
                Uploading {files.length} file{files.length > 1 ? 's' : ''}...
              </span>
              <span className="text-gray-500">{progress}%</span>
            </div>
            
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100 border border-gray-200">
              <div
                className="h-full bg-red-900 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-gray-400">Please wait...</p>
          </div>
        )}

        {/* STATE 3: SUCCESS */}
        {status === 'success' && (
          <div className="flex w-full flex-col items-center p-6">
            <div className="mb-4 rounded-xl border border-yellow-500 bg-yellow-50 p-3 text-yellow-600">
              <Check className="h-8 w-8" />
            </div>

            <h3 className="mb-4 text-lg font-semibold text-gray-800">
              Upload Successful!
            </h3>

            {/* File List */}
            <div className="mb-6 w-full space-y-2 max-h-[160px] overflow-y-auto pr-2">
              {files.map((file, index) => (
                <div 
                  key={`${file.name}-${index}`}
                  className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm"
                >
                  <FileText className="h-5 w-5 shrink-0 text-red-600" />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-sm font-medium text-gray-900">
                      {file.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
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
              className="h-9 min-w-[120px] rounded-full border-gray-300 hover:bg-gray-100 hover:text-blue-600"
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