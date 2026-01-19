import { Download, AlertCircle, FileText, ExternalLink, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DocumentPreview from '@/pages/Student/management/thesis-management/components/thesis-preview';
import { useState } from "react";
import ApprovedBadge from '@/components/badges/verdict_badges-Approved.svg'
import RejectedBadge from '@/components/badges/verdict_badges-Rejected.svg'
import RevisionBadge from '@/components/badges/verdict_badges-For_Revision.svg'
import PendingBadge from '@/components/badges/status_badge-Pending_Review.svg'
import { view } from "@/routes/student/thesis/documents";

const primaryBg = '#730000';

// Function to get the appropriate verdict badge based on status
const getVerdictBadge = (status: string) => {
  const s = status.toLowerCase();

  if (s.includes('pending')) {
    return {
      src: PendingBadge,
      alt: 'Pending',
    };
  }

  if (s.includes('approved')) {
    return {
      src: ApprovedBadge,
      alt: 'Approved',
    };
  }

  if (s.includes('revision')) {
    return {
      src: RevisionBadge,
      alt: 'For Revision',
    };
  }

  if (s.includes('rejected')) {
    return {
      src: RejectedBadge,
      alt: 'Rejected',
    };
  }

  return null;
};


// Custom Header for Thesis Management Documents Table
export function ThesisDocumentsHeader() {
  return (
    <thead style={{ backgroundColor: primaryBg }}>
      <tr>
        <th className="px-4 py-3 text-center text-sm text-white">Document</th>
        <th className="px-4 py-3 text-center text-sm text-white">Type</th>
        <th className="px-4 py-3 text-center text-sm text-white">Description</th>
        <th className="px-4 py-3 text-center text-sm text-white">Date</th>
        <th className="px-4 py-3 text-center text-sm text-white">Status</th>
        <th className="px-4 py-3 text-center text-sm text-white">Action</th>
      </tr>
    </thead>
  );
}

// Custom Row for Thesis Management Documents Table
interface ThesisDocumentRowProps {
  id: number | string;
  document: string;
  description?: string;
  type: string;
  date: string;
  status: string;
  isSubmitted?: boolean;   
  onDownload?: () => void; 
}

export function ThesisDocumentRow({ 
  id,
  document, 
  description, 
  type, 
  date, 
  status,
  isSubmitted = false,
  onDownload           
}: ThesisDocumentRowProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const fileUrl = isSubmitted ? view(id).url : '#';

  return (
    <>
      <tr className="border-t hover:bg-gray-50">
        <td className="px-4 py-3">
          <div className="font-medium text-[#0A0A0A] text-center">{document}</div>
          {description && <div className="text-xs text-[#0A0A0A80] text-center">{description}</div>}
        </td>
        <td className="px-4 py-3 text-center text-[#0A0A0A]">{type}</td>
        <td className="px-4 py-3 text-center text-[#0A0A0A]">{description || '—'}</td>
        <td className="px-4 py-3 text-center text-[#0A0A0A]">{date}</td>
        <td className="px-4 py-3 align-middle">
            <div className="flex justify-center">
                {(() => {
                const badge = getVerdictBadge(status);
                if (!badge) return null;

                return (
                    <img
                    src={badge.src}
                    alt={badge.alt}
                    className="h-6 w-auto"
                    />
                );
                })()}
            </div>
            </td>
        <td className="px-4 py-3">
          <div className="flex justify-center gap-2">
            <Button variant="tertiary" size="sm" onClick={() => setIsPreviewOpen(true)} disabled={!isSubmitted}>
              <FileText className="h-4 w-4 mr-1" />
              Preview
            </Button>
            <Button variant="primary" size="sm" onClick={onDownload} disabled={!isSubmitted}>
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
          </div>
        </td>
      </tr>

      {isPreviewOpen && (
        <tr>
          <td colSpan={6}>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className="relative w-full max-w-6xl h-[90vh] bg-white rounded-lg shadow-xl">
                <div className="h-full overflow-auto">
                  <DocumentPreview2
                    documentTitle={document}
                    fileUrl={fileUrl}
                    onClose={() => setIsPreviewOpen(false)}
                  />
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}

    </>
  );
}



// temporary for presentation only
function DocumentPreview2({
  documentTitle,
  fileUrl,
  onClose,
}: {
  documentTitle: string;
  fileUrl: string;
  onClose: () => void;
}) {
  return (
    <div
      className="flex flex-col w-full h-full min-h-[600px] overflow-hidden p-6"
      style={{
        borderRadius: "8px",
        border: "1px solid rgba(115, 0, 0, 0.26)",
        background: "#FDFCF6",
        boxShadow:
          "0 0.5px 1.75px 0 rgba(0, 0, 0, 0.04), 0 1.85px 6.25px 0 rgba(0, 0, 0, 0.25)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#73000019]">
        <h2 className="text-base font-semibold text-[#730000]">
          Document Preview
        </h2>

        <button
          className="text-gray-600 hover:text-gray-900 transition-colors"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Title + Download Bar */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#73000019]">
        <span
          className="text-sm font-normal truncate max-w-[500px] text-[#1a1a1a]"
          title={documentTitle}
        >
          {documentTitle}
        </span>

        <button
          onClick={() => window.open(fileUrl, "_self")}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors hover:opacity-90 bg-[#F3EFD0] text-[#730000]"
        >
          <Download className="w-4 h-4" />
          Download Full Document
        </button>
      </div>

      {/* Native Iframe Preview */}
      <div className="flex-1 relative rounded-md overflow-hidden bg-[#F5F5F7]">
        {fileUrl && fileUrl !== '#' ? (
          <iframe
            // #toolbar=0&navpanes=0 hides PDF viewer tools in Chrome/Edge/Firefox
            src={`${fileUrl}#toolbar=0&navpanes=0`} 
            className="w-full h-full absolute inset-0 border-0"
            title={`Preview of ${documentTitle}`}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-sm text-gray-500">
            <div className="flex flex-col items-center gap-2">
                <AlertCircle className="w-8 h-8 opacity-20" />
                <span>Preview unavailable</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}