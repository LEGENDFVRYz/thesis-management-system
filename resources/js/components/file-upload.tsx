import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Upload, Check, FileText, X } from 'lucide-react';

// Types
interface FileUploadProps {
  onFileSelect?: (files: File[]) => void;
  onUploadComplete?: (files: File[]) => void;
  onError?: (error: string) => void;
  onCancel?: () => void;
  maxSizeMB?: number;
  acceptedFileTypes?: string[];
  uploadProgress?: number;
  isUploading?: boolean;
  className?: string;
  multiple?: boolean;
}

interface UploadedFileInfo {
  name: string;
  size: number;
  file: File;
}

// File Upload Component - GLOBAL COMPONENT
const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  onUploadComplete,
  onError,
  onCancel,
  maxSizeMB = 100,
  acceptedFileTypes = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx'],
  uploadProgress = 0,
  isUploading = false,
  className = '',
  multiple = true
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileInfo[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    return `${(bytes / (1024 * 1024)).toFixed(0)} MB`;
  };

  const validateFile = (file: File): string | null => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    
    if (file.size > maxSizeBytes) {
      return `File size exceeds ${maxSizeMB} MB limit`;
    }

    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedFileTypes.includes(fileExtension)) {
      return `File type not accepted. Allowed types: ${acceptedFileTypes.join(', ')}`;
    }

    return null;
  };

  const handleFiles = (files: FileList) => {
    const validFiles: UploadedFileInfo[] = [];
    const errors: string[] = [];

    Array.from(files).forEach(file => {
      const error = validateFile(file);
      
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push({
          name: file.name,
          size: file.size,
          file: file
        });
      }
    });

    if (errors.length > 0) {
      if (onError) {
        onError(errors.join('\n'));
      } else {
        alert(errors.join('\n'));
      }
    }

    if (validFiles.length > 0) {
      setUploadedFiles(validFiles);
      onFileSelect?.(validFiles.map(f => f.file));
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDone = () => {
    if (uploadedFiles.length > 0) {
      onUploadComplete?.(uploadedFiles.map(f => f.file));
      setUploadedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleCancel = () => {
    setUploadedFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onCancel?.();
  };

  // Success State
  if (uploadedFiles.length > 0 && !isUploading && uploadProgress === 100) {
    return (
      <div className={`bg-white rounded-lg border-2 border-gray-300 p-12 flex flex-col items-center justify-center ${className}`}>
        <div className="w-12 h-12 rounded-lg border-2 border-yellow-500 flex items-center justify-center mb-4">
          <Check className="w-6 h-6 text-yellow-500" />
        </div>
        
        <p className="text-red-900 font-medium mb-4">
          {uploadedFiles.length === 1 ? 'File uploaded successfully!' : `${uploadedFiles.length} files uploaded successfully!`}
        </p>
        
        <div className="w-full max-w-md space-y-3 mb-6">
          {uploadedFiles.map((file, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-gray-700 font-medium truncate">{file.name}</span>
              <span className="text-gray-500 flex-shrink-0">{formatFileSize(file.size)}</span>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleDone}
          className="px-8 py-2 border-2 border-gray-900 rounded-full text-gray-900 font-medium hover:bg-gray-50 transition-colors"
        >
          Done
        </button>
      </div>
    );
  }

  // Uploading State
  if (isUploading && uploadedFiles.length > 0) {
    return (
      <div className={`bg-white rounded-lg border-2 border-gray-300 p-12 flex flex-col items-center justify-center ${className}`}>
        <p className="text-gray-600 mb-6">Uploading file(s) ...</p>
        
        <div className="w-full max-w-md">
          <div className="h-2 bg-gray-300 rounded-full overflow-hidden">
            <div 
              className="h-full bg-red-900 transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  // Idle/Hover State
  return (
    <div
      className={`bg-white rounded-lg border-2 ${
        isDragging ? 'border-yellow-500' : 'border-gray-300'
      } p-12 flex flex-col items-center justify-center cursor-pointer transition-colors ${className}`}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileInputChange}
        accept={acceptedFileTypes.join(',')}
        multiple={multiple}
        className="hidden"
      />

      <div className={`w-12 h-12 rounded-lg border-2 ${
        isDragging ? 'border-yellow-500' : 'border-gray-900'
      } flex items-center justify-center mb-4 transition-colors`}>
        <Upload className={`w-6 h-6 ${
          isDragging ? 'text-yellow-500' : 'text-gray-900'
        } transition-colors`} />
      </div>

      <p className="text-gray-700 mb-2">
        {isDragging ? (
          <>
            Drag all the way over <span className="text-red-600">here</span>
          </>
        ) : (
          'Drag and drop files here, or click to select files'
        )}
      </p>
      
      <p className="text-gray-400 text-sm">You can upload up to {maxSizeMB} MB</p>
    </div>
  );
};

export default FileUpload;