import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from "react-pdf";
import axios from 'axios';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';


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
            className={`flex flex-col items-center bg-gray-100 p-4 select-none ${className}`}
            onContextMenu={handleContextMenu}
        >
            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center h-64 text-gray-500 animate-pulse">
                    Loading Secure Document...
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="flex items-center justify-center h-64 text-red-500 bg-red-50 p-4 rounded">
                    {error}
                </div>
            )}

            {/* Viewer */}
            {pdfBlob && !loading && (
                <Document
                    file={pdfBlob}
                    onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                    className="shadow-xl"
                    loading={<div className="text-center p-4">Decrypting PDF...</div>}
                >
                    {/* Render All Pages */}
                    {Array.from(new Array(numPages), (el, index) => (
                        <div key={`page_${index + 1}`} className="mb-4">
                            <Page 
                                pageNumber={index + 1} 
                                
                                renderTextLayer={false}       // Disables text selection/copying
                                renderAnnotationLayer={false} // Disables internal links
                                
                                // Basic configuration:
                                width={800}
                                className="border border-gray-200 bg-white"
                            />
                            <p className="text-center text-xs text-gray-400 mt-2">
                                Page {index + 1} of {numPages}
                            </p>
                        </div>
                    ))}
                </Document>
            )}

            {/* Security Notice */}
            {!loading && !error && (
                <div className="mt-4 text-xs text-gray-400 font-mono">
                    ALL RIGHTS RESERVED • DO NOT DISTRIBUTE
                </div>
            )}
        </div>
    );
}