import { Button } from '@/components/ui/button';
import { Table, LayoutGrid, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ViewToggleProps {
  view: string;
  onViewChange: (view: string) => void;
  onImport?: () => void;
}

export function ViewToggle({ view, onViewChange, onImport }: ViewToggleProps) {
  return (
    <div className="flex justify-between items-center mt-6 mb-6">
      {/* View Toggle Buttons */}
      <div className="flex gap-2">
        <Button
          variant={view === 'table' ? 'default' : 'outline'}
          size="sm"
          className={cn(
            "gap-2",
            view === 'table' 
              ? "bg-primary text-white hover:bg-primary/90" 
              : "border-gray-300 hover:bg-gray-50"
          )}
          onClick={() => onViewChange('table')}
        >
          <Table className="w-4 h-4" /> Table View
        </Button>
        <Button
          variant={view === 'card' ? 'default' : 'outline'}
          size="sm"
          className={cn(
            "gap-2",
            view === 'card' 
              ? "bg-primary text-white hover:bg-primary/90" 
              : "border-gray-300 hover:bg-gray-50"
          )}
          onClick={() => onViewChange('card')}
        >
          <LayoutGrid className="w-4 h-4" /> Group Card View
        </Button>
      </div>

      {/* Import Button */}
      {onImport && view === 'table' && (
        <Button onClick={onImport} className="gap-2">
          <Upload className="w-4 h-4" />
          Import
        </Button>
      )}
    </div>
  );
}