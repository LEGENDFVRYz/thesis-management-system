import React, { useState, useRef, useEffect, DragEvent, ChangeEvent } from 'react';
import { Upload, Check, FileText, X, Download, Edit2, Trash2 } from 'lucide-react';

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

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFileUpload?: (files: File[]) => void;
  onDelete?: () => void;
  onDownload?: () => void;
  onError?: (error: string) => void;
  currentDocument?: {
    name: string;
    size: number;
    url?: string;
  };
  maxSizeMB?: number;
  acceptedFileTypes?: string[];
  multiple?: boolean;
}

interface UploadedFileInfo {
  name: string;
  size: number;
  file: File;
}

type ModalView = 'preview' | 'upload' | 'uploading' | 'success' | 'delete-confirm' | 'delete-success';

const formatFileSize = (bytes: number): string => {
  return `${(bytes / (1024 * 1024)).toFixed(0)} MB`;
};

export const DocumentPreview: React.FC<DocumentModalProps> = ({
  isOpen,
  onClose,
  onFileUpload,
  onDelete,
  onDownload,
  onError,
  currentDocument,
  maxSizeMB = 100,
  acceptedFileTypes = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx'],
  multiple = true
}) => {
  const [modalView, setModalView] = useState<ModalView>('preview');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileInfo[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const deleteTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dragCounterRef = useRef<number>(0);

  const validateFiles = (files: File[]): { valid: File[], errors: string[] } => {
    const valid: File[] = [];
    const errors: string[] = [];
    
    files.forEach(file => {
      if (file.size > maxSizeMB * 1024 * 1024) {
        errors.push(`${file.name} exceeds ${maxSizeMB}MB limit`);
        return;
      }
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      const isAccepted = acceptedFileTypes.some(type => 
        type.toLowerCase() === fileExtension || 
        file.name.toLowerCase().endsWith(type.toLowerCase())
      );
      if (!isAccepted) {
        errors.push(`${file.name} is not an accepted file type`);
        return;
      }
      valid.push(file);
    });
    return { valid, errors };
  };

  const handleFiles = (files: FileList) => {
    const fileArray = Array.from(files);
    const filesToValidate = multiple ? fileArray : fileArray.slice(0, 1);
    const { valid, errors } = validateFiles(filesToValidate);
    
    // FIX: Ensure errors are reported
    if (errors.length > 0) {
      const errorMessage = errors.join(', ');
      onError?.(errorMessage);
      if (valid.length === 0) return;
    }
    
    if (valid.length > 0) {
      const uploadFileArray = valid.map(file => ({
        name: file.name,
        size: file.size,
        file: file
      }));
      setUploadedFiles(uploadFileArray);
      setModalView('uploading');
      setUploadProgress(0);
      
      if (uploadIntervalRef.current) clearInterval(uploadIntervalRef.current);
      
      uploadIntervalRef.current = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            if (uploadIntervalRef.current) {
              clearInterval(uploadIntervalRef.current);
              uploadIntervalRef.current = null;
            }
            // Trigger parent update
            onFileUpload?.(uploadFileArray.map(f => f.file));
            setModalView('success');
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }
  };

  useEffect(() => {
    return () => {
      if (uploadIntervalRef.current) clearInterval(uploadIntervalRef.current);
      if (deleteTimeoutRef.current) clearTimeout(deleteTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      if (uploadIntervalRef.current) clearInterval(uploadIntervalRef.current);
      if (deleteTimeoutRef.current) clearTimeout(deleteTimeoutRef.current);
      setModalView('preview');
      setIsDragging(false);
      setUploadedFiles([]);
      setUploadProgress(0);
      dragCounterRef.current = 0;
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) handleClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current++;
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounterRef.current = 0;
    const files = e.dataTransfer.files;
    if (files.length > 0) handleFiles(files);
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) handleFiles(files);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleClose = () => {
    if (uploadIntervalRef.current) clearInterval(uploadIntervalRef.current);
    if (deleteTimeoutRef.current) clearTimeout(deleteTimeoutRef.current);
    setModalView('preview');
    setIsDragging(false);
    setUploadedFiles([]);
    setUploadProgress(0);
    dragCounterRef.current = 0;
    if (fileInputRef.current) fileInputRef.current.value = '';
    onClose();
  };

  const handleDeleteConfirm = () => {
    setModalView('delete-success');
    onDelete?.();
    
    if (deleteTimeoutRef.current) clearTimeout(deleteTimeoutRef.current);
    deleteTimeoutRef.current = setTimeout(() => {
      handleClose();
      deleteTimeoutRef.current = null;
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      {modalView === 'preview' && (
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
            <h2 className="text-base font-normal text-red-900">Document Preview</h2>
            <button onClick={handleClose} className="text-gray-900 hover:text-gray-600" type="button">
              <X className="w-5 h-5" strokeWidth={2} />
            </button>
          </div>
          
          <div className="px-6 pb-6 pt-3">
            <div className="flex items-center justify-end gap-2 mb-3">
              <button 
                onClick={onDownload}
                type="button"
                className="w-9 h-9 bg-white rounded-lg border border-gray-900 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <Download className="w-5 h-5 text-gray-900" strokeWidth={2} />
              </button>
              <button 
                onClick={() => setModalView('upload')}
                type="button"
                className="w-9 h-9 bg-white rounded-lg border border-gray-900 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <Edit2 className="w-5 h-5 text-gray-900" strokeWidth={2} />
              </button>
              <button 
                onClick={() => setModalView('delete-confirm')}
                type="button"
                className="w-9 h-9 bg-white rounded-lg border border-gray-900 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <Trash2 className="w-5 h-5 text-gray-900" strokeWidth={2} />
              </button>
            </div>
            
            <div className="bg-gray-100 rounded-2xl h-80 flex flex-col items-center justify-center">
              {currentDocument ? (
                <>
                  <FileText className="w-16 h-16 text-gray-400 mb-4" strokeWidth={1.5} />
                  <p className="text-sm text-gray-900 font-medium">{currentDocument.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(currentDocument.size)}</p>
                </>
              ) : (
                <>
                  <FileText className="w-16 h-16 text-gray-400 mb-4" strokeWidth={1.5} />
                  <p className="text-sm text-gray-600">Document Preview Area</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {modalView === 'upload' && (
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
            <h2 className="text-base font-normal text-red-900">File Upload</h2>
            <button onClick={() => setModalView('preview')} className="text-gray-900 hover:text-gray-600" type="button">
              <X className="w-5 h-5" strokeWidth={2} />
            </button>
          </div>
          
          <div className="px-6 pb-6 pt-3">
            <div
              className={`bg-gray-50 rounded-2xl border-2 ${
                isDragging ? 'border-yellow-500' : 'border-transparent'
              } h-80 flex flex-col items-center justify-center cursor-pointer transition-colors`}
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
                } transition-colors`} strokeWidth={2} />
              </div>
              
              <p className="text-gray-700 mb-2 text-center px-6">
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
          </div>
        </div>
      )}

      {modalView === 'uploading' && (
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
            <h2 className="text-base font-normal text-red-900">File Upload</h2>
            <button onClick={() => setModalView('preview')} className="text-gray-900 hover:text-gray-600" type="button">
              <X className="w-5 h-5" strokeWidth={2} />
            </button>
          </div>
          
          <div className="px-6 pb-6 pt-3">
            <div className="bg-white rounded-2xl border-2 border-gray-300 h-80 flex flex-col items-center justify-center">
              <p className="text-gray-600 mb-6">Uploading file(s) ...</p>
              
              <div className="w-full px-12">
                <div className="h-2 bg-gray-300 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-900 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {modalView === 'success' && uploadedFiles.length > 0 && (
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
            <h2 className="text-base font-normal text-red-900">File Upload</h2>
            <button onClick={() => setModalView('preview')} className="text-gray-900 hover:text-gray-600" type="button">
              <X className="w-5 h-5" strokeWidth={2} />
            </button>
          </div>
          
          <div className="px-6 pb-6 pt-3">
            <div className="bg-white rounded-2xl border-2 border-gray-300 h-80 flex flex-col items-center justify-center px-6">
              <div className="w-12 h-12 rounded-lg border-2 border-yellow-500 flex items-center justify-center mb-4">
                <Check className="w-6 h-6 text-yellow-500" strokeWidth={3} />
              </div>
              
              <p className="text-red-900 font-medium mb-6">
                {uploadedFiles.length === 1 ? 'File uploaded successfully!' : `${uploadedFiles.length} files uploaded successfully!`}
              </p>
              
              <div className="w-full space-y-3 mb-6 overflow-y-auto max-h-32">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-white" strokeWidth={2} />
                    </div>
                    <span className="text-gray-700 font-medium truncate">{file.name}</span>
                    <span className="text-gray-500 flex-shrink-0">{formatFileSize(file.size)}</span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="px-8 py-2 border-2 border-gray-900 rounded-full text-gray-900 font-medium hover:bg-gray-50 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {modalView === 'delete-confirm' && (
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
            <h2 className="text-base font-normal text-red-900">File Delete</h2>
            <button onClick={() => setModalView('preview')} className="text-gray-900 hover:text-gray-600" type="button">
              <X className="w-5 h-5" strokeWidth={2} />
            </button>
          </div>
          
          <div className="px-6 pb-6 pt-3">
            <div className="bg-gray-100 rounded-2xl h-80 px-6 flex flex-col items-center justify-center">
              <div className="w-14 h-14 bg-red-900 rounded-full flex items-center justify-center mb-6">
                <span className="text-white text-2xl font-bold">!</span>
              </div>
              
              <p className="text-sm text-center text-gray-900 font-normal mb-1">
                Are you sure you want to delete this file?
              </p>
              <p className="text-sm text-center text-gray-900 mb-8">
                This action cannot be undone.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setModalView('preview')}
                  type="button"
                  className="px-8 py-2.5 border border-gray-900 rounded-full text-sm font-normal text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  type="button"
                  className="px-8 py-2.5 bg-red-900 rounded-full text-sm font-normal text-white hover:bg-red-800 transition-colors"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {modalView === 'delete-success' && (
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
            <h2 className="text-base font-normal text-red-900">File Delete</h2>
            <button onClick={handleClose} className="text-gray-900 hover:text-gray-600" type="button">
              <X className="w-5 h-5" strokeWidth={2} />
            </button>
          </div>
          
          <div className="px-6 pb-6 pt-3">
            <div className="bg-gray-100 rounded-2xl h-80 px-6 flex flex-col items-center justify-center">
              <div className="w-14 h-14 bg-green-700 rounded-full flex items-center justify-center mb-6">
                <Check className="w-8 h-8 text-white" strokeWidth={3} />
              </div>
              
              <p className="text-sm text-center text-gray-900 font-normal">
                File deleted successfully.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const FileUpload: React.FC<FileUploadProps> = ({
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<UploadedFileInfo | undefined>(undefined);

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
      if (onError) onError(errors.join('\n'));
      else alert(errors.join('\n'));
    }

    if (validFiles.length > 0) {
      setUploadedFiles(validFiles);
      onFileSelect?.(validFiles.map(f => f.file));
    }
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
    if (files.length > 0) handleFiles(files);
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) handleFiles(files);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDone = () => {
    if (uploadedFiles.length > 0) {
      onUploadComplete?.(uploadedFiles.map(f => f.file));
      setUploadedFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleFileClick = (file: UploadedFileInfo) => {
    setPreviewFile(file);
    setIsModalOpen(true);
  };

  const handleModalFileUpload = (files: File[]) => {
    if (files.length > 0) {
      const newFileObj = {
        name: files[0].name,
        size: files[0].size,
        file: files[0]
      };

      // FIX: Ensure we are matching strictly against the current previewed file
      setUploadedFiles(prevFiles => prevFiles.map(f => 
        (f === previewFile) ? newFileObj : f
      ));

      // Update the preview so if they click edit AGAIN, they edit the new file
      setPreviewFile(newFileObj);
    }
  };

  const handleModalDelete = () => {
    if (previewFile) {
      setUploadedFiles(prevFiles => prevFiles.filter(f => f !== previewFile));
    }
    setPreviewFile(undefined);
    setIsModalOpen(false);
  };
  
  // Wrapper for modal errors so they don't fail silently
  const handleModalError = (err: string) => {
    if (onError) onError(err);
    else alert(err);
  };

  if (uploadedFiles.length > 0 && !isUploading && uploadProgress === 100) {
    return (
      <>
        <div className={`bg-white rounded-lg border-2 border-gray-300 p-12 flex flex-col items-center justify-center ${className}`}>
          <div className="w-12 h-12 rounded-lg border-2 border-yellow-500 flex items-center justify-center mb-4">
            <Check className="w-6 h-6 text-yellow-500" />
          </div>
          
          <p className="text-red-900 font-medium mb-4">
            {uploadedFiles.length === 1 ? 'File uploaded successfully!' : `${uploadedFiles.length} files uploaded successfully!`}
          </p>
          
          <div className="w-full max-w-md space-y-3 mb-6">
            {uploadedFiles.map((file, index) => (
              <div 
                // FIX: Added file name/size to key to force re-render if file changes but index stays same
                key={`${file.name}-${file.size}-${index}`} 
                className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer transition-colors border border-transparent hover:border-gray-200"
                onClick={() => handleFileClick(file)}
                title="Click to preview/edit"
              >
                <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span className="text-gray-700 font-medium truncate flex-1 text-left">{file.name}</span>
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

        <DocumentPreview 
          isOpen={isModalOpen}
          currentDocument={previewFile}
          onClose={() => setIsModalOpen(false)}
          onFileUpload={handleModalFileUpload}
          onDelete={handleModalDelete}
          // FIX: Pass error handler here so edit validation failures aren't silent
          onError={handleModalError} 
          multiple={false}
        />
      </>
    );
  }

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

  return (
    <>
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
    </>
  );
};