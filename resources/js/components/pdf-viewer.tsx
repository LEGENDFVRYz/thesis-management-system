import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from "react-pdf";
import axios from 'axios';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { FileText, Loader2, TriangleAlert } from 'lucide-react';


// Worker setup configuration
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
).toString();

// Component Props
interface PdfViewerProps {
    fileUrl: string;            // route for the pdf stream
    className?: string;
}

export default function PdfViewer({ fileUrl, className = '' }: PdfViewerProps) {
    const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
    const [numPages, setNumPages] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch the PDF Blob
    useEffect(() => {
        setLoading(true);
        axios.get(fileUrl, {
            responseType: 'blob', 
            withCredentials: true 
        })
        .then((response) => {
            setPdfBlob(response.data);
            setLoading(false);
        })
        .catch((err) => {
            console.error("PDF Fetch Error:", err);
            setError("Unable to load document. You may not have permission.");
            setLoading(false);
        });

        // Clean-up when unmount
        return () => {
            setPdfBlob(null);
        };
    }, [fileUrl]);

    // Disable context menu (Right Click)
    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
    };
    

    return (
        <div 
            // className={`flex flex-col items-center bg-gray-100 p-4 select-none ${className}`}
            className={`flex flex-col w-full min-h-[600px] h-full p-4 bg-gray-100 select-none relative ${className}`}
            onContextMenu={handleContextMenu}
        >
            <div className="flex-1 flex flex-col items-center justify-center w-full bg-gray-200 py-4">
                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center animate-pulse gap-4">
                        <div className="w-[600px] h-[800px] bg-gray-200 rounded shadow-sm border border-gray-300"></div>
                        <div className="h-4 w-32 bg-gray-200 rounded"></div>
                    </div>
                )}
                
                {/* Network Error State */}
                {error && !loading && (
                    <ErrorState 
                        message={error}
                        description='Netowrk Failed. Please check your internet connection or permissions'
                    />
                )}

                {/* Viewer */}
                {pdfBlob && !loading && (
                    <Document
                        file={pdfBlob}
                        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                        className="flex flex-col items-center"
                        loading={<LoadingState/>}
                        error={
                            <ErrorState 
                                message={'Failed to render PDF content'}
                                description='Data transfer failed. Reload the page to try again.'
                            />
                        }
                        noData={
                            <ErrorState 
                                message="No PDF data received." 
                                description='We couldn’t find the Docuement. Please contact your administrator for help.' 
                            />
                        }
                    >
                        {/* Render All Pages */}
                        {Array.from(new Array(numPages), (el, index) => (
                            <div key={`page_${index + 1}`} className="mb-4">
                                <Page 
                                    pageNumber={index + 1} 
                                    
                                    renderTextLayer={false}       // Disables text selection/copying
                                    renderAnnotationLayer={false} // Disables internal links
                                    
                                    // Basic configuration:
                                    width={1000}
                                    className="shadow-xl border border-gray-200 bg-white"
                                />
                                <p className="text-center text-xs text-gray-400 mt-2">
                                    Page {index + 1} of {numPages}
                                </p>
                            </div>
                        ))}
                    </Document>
                )}
            </div>

            {/* Security Notice */}
            <div className="w-full pt-4 text-center border-t border-gray-200/50 mt-auto bg-gray-100 z-10">
                <p className="text-xs text-gray-500 font-mono tracking-widest uppercase">
                    PUP COLLEGE OF ENGINEERING: COMPUTER ENGINEERING DEPARTMENT
                </p>
                <p className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">
                    All Rights Reserved • Do Not Distribute
                </p>
            </div>
        </div>
    );
}



// Reusable Error UI Component
const ErrorState = ({ message, description }: { message: string, description?: string; }) => (
    <div className="flex flex-col items-center text-center max-w-md p-6">
        {/* Error Icon */}
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
            <TriangleAlert />
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {message || "Error Loading File"}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-500 mb-6">
            {description || "We couldn't decrypt the secure file. Please check your internet connection or permissions."}
        </p>
    </div>
);

// LoadingState Component Wrapper
const LoadingState = () => (
    <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        
        {/* Main Text */}
        <h3 className="text-sm font-semibold text-gray-700">
            Loading Document
        </h3>
    
        <p className="text-xs text-gray-400 mt-1 animate-pulse">
            Please wait while we prepare your document...
        </p>
    </div>
);