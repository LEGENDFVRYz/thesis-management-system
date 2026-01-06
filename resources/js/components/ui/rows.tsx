import { Download, Edit2, Trash2, Eye, Bell, Check, AlertCircle, FileText, LucideUsers, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function DefaultRows() {
  return (
    <div className="flex items-center justify-between gap-4 rounded bg-white px-5 py-3">
      <span className="min-w-[100px] text-sm text-gray-800 text-center">Row Column 1</span>
      <span className="min-w-[100px] text-sm text-gray-800 text-center">Row Column 2</span>
      <span className="min-w-[100px] text-sm text-gray-800 text-center">Row Column 3</span>
    </div>
  );
}

export function RowColumn1() {
  return (
    <div className="flex items-center justify-between gap-4 rounded bg-white px-5 py-3">
      <span className="min-w-[100px] text-sm text-gray-800 text-center">Row Column 1</span>
      <span className="min-w-[100px] text-sm text-gray-800 text-center">Row Column 2</span>
      <span className="min-w-[100px] flex items-center justify-center gap-2 text-sm text-gray-800">
        <LucideUsers className="h-4 w-4 text-red-600" />
        Row Column 3
      </span>
      <span className="min-w-[100px] text-sm text-gray-800 text-center">Row Column 4</span>
      <span className="min-w-[100px] text-sm text-gray-800 text-center">Row Column 5</span>
      <span className="min-w-[100px] text-sm text-gray-800 text-center">Row Column 6</span>

      {/* Status column */}
      <span className="min-w-[100px] flex items-center justify-center">
        <Badge className="bg-green-600 border-transparent text-center w-full">
          Graded
        </Badge>
      </span>

      {/* Actions column */}
      <Button variant="tertiary" className="min-w-[100px] flex items-center justify-center">
        <FileText className="h-4 w-4" />
        View Details
      </Button>

      {/* Edit column */}
      <span className="min-w-[100px] flex items-center justify-center gap-2 text-sm text-gray-800 underline cursor-pointer">
        <Edit className="h-4 w-4 text-gray-800" />
        Row Column 1
      </span>
    </div>
  );
}

interface RowData {
  value: React.ReactNode; // Can be string, badge, or icon
  isBadge?: boolean;
  className?: string;
  badgeVariant?: string; // Optional: to pass specific badge styles
}

interface MethodologyRowProps {
  variant: 'static' | 'dynamic';
  data?: RowData[]; // Only used for dynamic
}

export function MethodologyRow({ variant, data = [] }: MethodologyRowProps) {
  
  // Variant 1: Static (Original hardcoded structure)
  if (variant === 'static') {
    return (
      <div className="flex items-center justify-between gap-4 rounded bg-white px-5 py-3">
        <span className="min-w-[100px] text-sm text-gray-800 text-center">Row Column 1</span>
        <Badge className="bg-[#E9D4FF] border border-[#8200DB] text-[#8200DB] hover:bg-[#E9D4FF] text-center">
          Methodology Change
        </Badge>
        <span className="min-w-[100px] text-sm text-gray-800 text-center">Row Column 3</span>
        <Badge className="bg-green-600 border-transparent text-center">Graded</Badge>
      </div>
    );
  }

  // Variant 2: Dynamic (Loops through passed data)
  return (
    <div className="flex items-center justify-between gap-4 rounded bg-background py-3 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0">
      {data.map((item, index) => (
        <div key={index} className={cn("text-dm text-sm", item.className)}>
          {item.value}
        </div>
      ))}
    </div>
  );
}

export function ScheduledRow() {
  return (
    <div className="flex items-center justify-between gap-4 rounded bg-white px-5 py-3">
      <span className="min-w-[100px] text-sm text-gray-800 text-center">Row Column 1</span>
      <span className="min-w-[100px] text-sm text-gray-800 text-center">Row Column 2</span>
      <span className="min-w-[100px] text-sm text-gray-800 text-center">Row Column 3</span>
      <span className="min-w-[100px] text-sm text-gray-800 text-center">Row Column 4</span>
      <span className="min-w-[100px] text-sm text-gray-800 text-center">Row Column 5</span>
      <Badge className="bg-[#8EC5FF] border border-[#193CB8] text-[#193CB8] hover:bg-[#7bb9ff] text-center">
        Scheduled
      </Badge>

      <div className="flex items-center justify-center gap-2">
        <Download className="h-4 w-4 cursor-pointer text-gray-800" />
        <Edit2 className="h-4 w-4 cursor-pointer text-gray-800" />
        <Trash2 className="h-4 w-4 cursor-pointer text-gray-800" />
      </div>
    </div>
  );
}

export function RevisionRow() {
  return (
    <div className="flex items-center justify-between gap-4 rounded bg-white px-5 py-3">
      <span className="min-w-[100px] text-sm text-gray-800 text-center">Row Column 1</span>
      <span className="min-w-[100px] text-sm text-gray-800 text-center">Row Column 2</span>
      <span className="min-w-[80px] text-sm text-gray-800 text-center">Version</span>
      <span className="min-w-[100px] text-sm text-gray-800 text-center">Row Column 4</span>

      <Badge className="flex items-center justify-center gap-1 bg-[#FEF9C2] text-primary border-transparent">
        <AlertCircle className="h-4 w-4" />
        <span className="text-sm">For Revision</span>
      </Badge>

      <Button variant="tertiary" className="flex items-center justify-center">
        <FileText className="h-4 w-4" />
        Preview
      </Button>

      <Button variant="negative" className="flex items-center justify-center">
        <Download className="h-4 w-4" />
        Download
      </Button>
    </div>
  );
}

export function GradedRow() {
  return (
    <div className="flex items-center justify-between gap-4 rounded bg-white px-5 py-3">
      <span className="min-w-[100px] text-sm text-gray-800 text-center">Row Column 1</span>
      <span className="min-w-[100px] text-sm text-gray-800 text-center">Row Column 2</span>

      <div className="min-w-[100px] flex items-center justify-center gap-2 text-sm text-gray-800">
        <LucideUsers className="h-4 w-4 text-red-600" />
        <span>Row Column 3</span>
      </div>

      <span className="min-w-[100px] text-sm text-gray-800 text-center">Row Column 4</span>
      <span className="min-w-[100px] text-sm text-gray-800 text-center">Row Column 5</span>

      <Badge className="bg-green-600 border-transparent text-center">Graded</Badge>

      <Button variant="tertiary" className="flex items-center justify-center">
        <FileText className="h-4 w-4" />
        View Details
      </Button>
    </div>
  );
}
