import { Download, AlertCircle, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DocumentPreview from '@/pages/Student/repository/thesis-preview';
import { useState } from "react";

const primaryBg = '#730000';

// Custom Header for Thesis Management Documents Table
export function ThesisDocumentsHeader() {
  return (
    <thead style={{ backgroundColor: primaryBg }}>
      <tr>
        <th className="px-4 py-3 text-center text-sm text-white">Document</th>
        <th className="px-4 py-3 text-center text-sm text-white">Type</th>
        <th className="px-4 py-3 text-center text-sm text-white">Version</th>
        <th className="px-4 py-3 text-center text-sm text-white">Date</th>
        <th className="px-4 py-3 text-center text-sm text-white">Status</th>
        <th className="px-4 py-3 text-center text-sm text-white">Action</th>
      </tr>
    </thead>
  );
}

// Custom Row for Thesis Management Documents Table
interface ThesisDocumentRowProps {
  document: string;
  description?: string;
  type: string;
  version: string;
  date: string;
  status: string;
}

export function ThesisDocumentRow({ 
  document, 
  description, 
  type, 
  version, 
  date, 
  status 
}: ThesisDocumentRowProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <>
      <tr className="border-t hover:bg-gray-50">
        <td className="px-4 py-3">
          <div className="font-medium text-[#0A0A0A] text-center">{document}</div>
          {description && <div className="text-xs text-[#0A0A0A80] text-center">{description}</div>}
        </td>
        <td className="px-4 py-3 text-center text-[#0A0A0A]">{type}</td>
        <td className="px-4 py-3 text-center text-[#0A0A0A]">{version}</td>
        <td className="px-4 py-3 text-center text-[#0A0A0A]">{date}</td>
        <td className="px-4 py-3">
          <div className="flex justify-center">
            <Badge className="inline-flex items-center justify-center gap-1 bg-[#FEF9C2] text-primary border-transparent">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{status}</span>
            </Badge>
          </div>
        </td>
        <td className="px-4 py-3">
          <div className="flex justify-center gap-2">
            <Button variant="tertiary" size="sm" onClick={() => setIsPreviewOpen(true)}>
              <FileText className="h-4 w-4 mr-1" />
              Preview
            </Button>
            <Button variant="primary" size="sm">
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
                  <DocumentPreview 
                    documentTitle={document}
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
