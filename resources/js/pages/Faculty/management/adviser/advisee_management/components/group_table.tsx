import React, { useState } from "react";
import { Users } from "lucide-react";
import { iconRegistry } from "@/components/icons-registry";
import {Table,TableBody,TableCell,TableHead,TableHeader,TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

// Columns for the table
const columns = ["Group Number", "Title", "Proponents", "Block", "Actions"];

interface CustomTableProps {
  rows: any[];
  onEditClick?: (row: any) => void;
  onManageClick?: (row: any) => void;
  onRemoveClick?: (row: any) => void;
}

type IconState = "default" | "hover" | "clicked";

interface RowIconStates {
  [key: number]: {
    edit: IconState;
  };
}

export default function CustomTable({
  rows,
  onEditClick,
  onManageClick,
  onRemoveClick,
}: CustomTableProps) {
  const [iconStates, setIconStates] = useState<RowIconStates>({});

  const EditIcon = iconRegistry.editDefault;
  const EditHoverIcon = iconRegistry.editHover;
  const EditClickedIcon = iconRegistry.editClicked;

  const setRowIconState = (rowId: number, state: IconState) => {
    setIconStates(prev => ({
      ...prev,
      [rowId]: {
        edit: state,
      }
    }));
  };

  const getRowIconState = (rowId: number): IconState => {
    return iconStates[rowId]?.edit || 'default';
  };

  const getEditIcon = (rowId: number) => {
    const state = getRowIconState(rowId);
    switch (state) {
      case "hover":
        return <EditHoverIcon className="w-6 h-6 pointer-events-none" />;
      case "clicked":
        return <EditClickedIcon className="w-6 h-6 pointer-events-none" />;
      default:
        return <EditIcon className="w-6 h-6 pointer-events-none" />;
    }
  };

  const handleEditClick = (row: any) => {
    console.log('Edit icon clicked for row:', row);
    onEditClick?.(row);
  };

  const handleManageClick = (row: any) => {
    console.log('Manage button clicked for row:', row);
    onManageClick?.(row);
  };

  return (
    <div className="overflow-x-auto rounded-lg border-1 border-[var(--primary)] bg-primary-foreground shadow">
      <Table className="border-separate border-spacing-0">
        {/* Table Header */}
        <TableHeader>
          <TableRow className="bg-[#730000] hover:bg-[#730000] border-none">
            {columns.map((col, index) => (
              <TableHead 
                key={col} 
                className={`text-center text-white font-medium px-5 py-3 ${
                  index === 0 ? 'rounded-tl-lg' : ''
                } ${
                  index === columns.length - 1 ? 'rounded-tr-lg' : ''
                }`}
              >
                {col}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        {/* Table Body */}
        <TableBody>
          {rows.map((row) => (
            <TableRow 
              key={row.group_id} 
              className="border-b last:border-b-0 hover:bg-gray-50"
            >
              <TableCell className="text-center px-5 py-3">
                {row["Group Number"]}
              </TableCell>
              <TableCell className="text-center px-5 py-3">
                {row.Title}
              </TableCell>
              <TableCell className="text-center px-5 py-3">
                <div className="flex items-center justify-center gap-1">
                  <Users className="w-4 h-4 text-[#730000]" /> {row.Proponents}
                </div>
              </TableCell>
              <TableCell className="text-center px-5 py-3">
                {row.Block}
              </TableCell>
              <TableCell className="text-center px-5 py-3">
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => handleEditClick(row)}
                    onMouseEnter={() => setRowIconState(row.group_id, 'hover')}
                    onMouseLeave={() => setRowIconState(row.group_id, 'default')}
                    onMouseDown={() => setRowIconState(row.group_id, 'clicked')}
                    onMouseUp={() => setRowIconState(row.group_id, 'default')}
                    className="cursor-pointer transition"
                    title="Edit"
                  >
                    {getEditIcon(row.group_id)}
                  </button>

                  <Button
                    variant="tertiary"
                    size="sm"
                    onClick={() => handleManageClick(row)}
                  >
                    Manage
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}