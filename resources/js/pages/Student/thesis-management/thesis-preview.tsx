import React from 'react';
import { Download, FileText, X } from 'lucide-react';

interface DocumentPreviewProps {
    documentTitle: string;
    documentUrl?: string;
    onDownload?: () => void;
    onClose?: () => void;
    showDownloadButton?: boolean;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({
    documentTitle,
    documentUrl,
    onDownload,
    onClose,
    showDownloadButton = true,
}) => {

    const handleDownloadClick = () => {
        if (onDownload) {
            onDownload();
        } else if (documentUrl) {
            const link = document.createElement('a');
            link.href = documentUrl;
            link.download = documentTitle || 'document';
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div 
            className="flex flex-col w-full h-full min-h-[600px] overflow-hidden p-6"
            style={{
                borderRadius: '8px',
                border: '1px solid rgba(115, 0, 0, 0.26)',
                background: '#FDFCF6',
                boxShadow: '0 0.5px 1.75px 0 rgba(0, 0, 0, 0.04), 0 1.85px 6.25px 0 rgba(0, 0, 0, 0.25)'
            }}
        >
            {/* Header with title "Document Preview" and close button */}
            <div 
                className="flex items-center justify-between pb-4 mb-4"
                style={{ borderBottom: '1px solid rgba(115, 0, 0, 0.1)' }}
            >
                <h2 className="text-base font-semibold" style={{ color: '#730000' }}>
                    Document Preview
                </h2>
                <button 
                    className="text-gray-600 hover:text-gray-900"
                    onClick={onClose}
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Document title and download button row */}
            <div 
                className="flex items-center justify-between pb-4 mb-4"
                style={{ borderBottom: '1px solid rgba(115, 0, 0, 0.1)' }}
            >
                <span 
                    className="text-sm font-normal truncate max-w-[500px]" 
                    title={documentTitle}
                    style={{ color: '#1a1a1a' }}
                >
                    {documentTitle}
                </span>

                {showDownloadButton && (
                    <button
                        onClick={handleDownloadClick}
                        disabled={!documentUrl}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
                        style={{ 
                            backgroundColor: '#F3EFD0',
                            color: '#730000',
                        }}
                    >
                        <Download className="w-4 h-4" />
                        Download Full Document
                    </button>
                )}
            </div>

            {/* Preview area */}
            <div 
                className="flex-1 relative rounded-md overflow-hidden"
                style={{ background: '#F5F5F7' }}
            >
                {documentUrl ? (
                    <iframe 
                        src={`${documentUrl}#toolbar=0`}
                        className="w-full h-full absolute inset-0"
                        title={documentTitle}
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full p-10">
                        <FileText className="w-16 h-16 mb-3" style={{ color: '#D1D1D6' }} />
                        <p className="text-sm" style={{ color: '#6B6B6B' }}>Document Preview Area</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DocumentPreview;