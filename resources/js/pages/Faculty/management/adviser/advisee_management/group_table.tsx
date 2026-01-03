import React, { useState } from "react";
import { Users } from "lucide-react";
import { iconRegistry } from "@/components/icons-registry";

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
    close: IconState;
    manage: IconState;
  };
}

export default function CustomTable({
  rows,
  onEditClick,
  onManageClick,
  onRemoveClick
}: CustomTableProps) {
  const [iconStates, setIconStates] = useState<RowIconStates>({});

  const EditIcon = iconRegistry.editDefault;
  const EditHoverIcon = iconRegistry.editHover;
  const EditClickedIcon = iconRegistry.editClicked;

  const CloseIcon = iconRegistry.closeDefault;
  const CloseHoverIcon = iconRegistry.closeHover;
  const CloseClickedIcon = iconRegistry.closeClicked;
  

  const setRowIconState = (rowId: number, iconType: 'edit' | 'close' | 'manage', state: IconState) => {
    setIconStates(prev => ({
      ...prev,
      [rowId]: {
        ...prev[rowId],
        edit: iconType === 'edit' ? state : (prev[rowId]?.edit || 'default'),
        close: iconType === 'close' ? state : (prev[rowId]?.close || 'default'),
        manage: iconType === 'manage' ? state : (prev[rowId]?.manage || 'default'),
      }
    }));
  };

  const getRowIconState = (rowId: number, iconType: 'edit' | 'close' | 'manage'): IconState => {
    return iconStates[rowId]?.[iconType] || 'default';
  };

  const getEditIcon = (rowId: number) => {
    const state = getRowIconState(rowId, 'edit');
    switch (state) {
      case "hover":
        return <EditHoverIcon className="w-6 h-6 pointer-events-none" />;
      case "clicked":
        return <EditClickedIcon className="w-6 h-6 pointer-events-none" />;
      default:
        return <EditIcon className="w-6 h-6 pointer-events-none" />;
    }
  };

  const getCloseIcon = (rowId: number) => {
    const state = getRowIconState(rowId, 'close');
    switch (state) {
      case "hover":
        return <CloseHoverIcon className="w-6 h-6 pointer-events-none" />;
      case "clicked":
        return <CloseClickedIcon className="w-6 h-6 pointer-events-none" />;
      default:
        return <CloseIcon className="w-6 h-6 pointer-events-none" />;
    }
  };

  const getManageButtonClass = (rowId: number) => {
    const state = getRowIconState(rowId, 'manage');
    switch (state) {
      case "hover":
        return "px-4 py-1 border-2 border-yellow-500 rounded-md bg-yellow-400 text-black transition text-sm font-medium";
      case "clicked":
        return "px-4 py-1 border-2 border-red-600 rounded-md bg-red-500 text-white transition text-sm font-medium";
      default:
        return "px-4 py-1 border border-[#730000] rounded-md text-[#730000] bg-white transition text-sm font-medium";
    }
  };

  const handleEditClick = (row: any) => {
    console.log('Edit icon clicked for row:', row);
    onEditClick?.(row);
  };

  const handleRemoveClick = (row: any) => {
    console.log('Remove icon clicked for row:', row);
    onRemoveClick?.(row);
  };

  const handleManageClick = (row: any) => {
    console.log('Manage button clicked for row:', row);
    onManageClick?.(row);
  };

  return (
    <div className="w-full border rounded-lg overflow-hidden shadow">
      {/* Table Header */}
      <div className="flex" style={{ backgroundColor: "#730000" }}>
        {columns.map((col) => (
          <div key={col} className="flex-1 text-center text-white font-medium px-5 py-3">
            {col}
          </div>
        ))}
      </div>

      {/* Table Body */}
      <div>
        {rows.map((row) => (
          <div key={row.group_id} className="flex border-b last:border-b-0 hover:bg-gray-50">
            <div className="flex-1 text-center px-5 py-3">{row["Group Number"]}</div>
            <div className="flex-1 text-center px-5 py-3">{row.Title}</div>
            <div className="flex-1 flex items-center justify-center gap-1 px-5 py-3">
              <Users className="w-4 h-4 text-[#730000]" /> {row.Proponents}
            </div>
            <div className="flex-1 flex items-center justify-center px-5 py-3">{row.Block}</div>
            <div className="flex-1 flex items-center justify-center gap-3 px-5 py-3">
              <button
                onClick={() => handleRemoveClick(row)}
                onMouseEnter={() => setRowIconState(row.group_id, 'close', 'hover')}
                onMouseLeave={() => setRowIconState(row.group_id, 'close', 'default')}
                onMouseDown={() => setRowIconState(row.group_id, 'close', 'clicked')}
                onMouseUp={() => setRowIconState(row.group_id, 'close', 'default')}
                className="cursor-pointer transition"
                title="Remove"
              >
                {getCloseIcon(row.group_id)}
              </button>

              <button
                onClick={() => handleEditClick(row)}
                onMouseEnter={() => setRowIconState(row.group_id, 'edit', 'hover')}
                onMouseLeave={() => setRowIconState(row.group_id, 'edit', 'default')}
                onMouseDown={() => setRowIconState(row.group_id, 'edit', 'clicked')}
                onMouseUp={() => setRowIconState(row.group_id, 'edit', 'default')}
                className="cursor-pointer transition"
                title="Edit"
              >
                {getEditIcon(row.group_id)}
              </button>

              <button
                onClick={() => handleManageClick(row)}
                onMouseEnter={() => setRowIconState(row.group_id, 'manage', 'hover')}
                onMouseLeave={() => setRowIconState(row.group_id, 'manage', 'default')}
                onMouseDown={() => setRowIconState(row.group_id, 'manage', 'clicked')}
                onMouseUp={() => setRowIconState(row.group_id, 'manage', 'hover')}
                className={getManageButtonClass(row.group_id)}
                title="Manage"
              >
                Manage
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}