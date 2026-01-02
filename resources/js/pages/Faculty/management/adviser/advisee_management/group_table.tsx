import React, { useState } from "react";
import { Users } from "lucide-react";
import { iconRegistry } from "@/components/icons-registry";

// Columns for the table
const columns = ["Defense ID", "Title", "Proponents", "Block", "Actions"];

interface CustomTableProps {
  status: "pending" | "approved";
  pendingRows: any[];
  approvedRows: any[];
  onEditClick?: (row: any) => void;
  onManageClick?: (row: any) => void;
  onApproveClick?: (row: any) => void;
  onRemoveClick?: (row: any) => void;
}

type IconState = "default" | "hover" | "clicked";

interface RowIconStates {
  [key: number]: {
    edit: IconState;
    check: IconState;
    close: IconState;
    manage: IconState;
  };
}

export default function CustomTable({ 
  status, 
  pendingRows,
  approvedRows,
  onEditClick, 
  onManageClick, 
  onApproveClick, 
  onRemoveClick 
}: CustomTableProps) {
  const rows = status === "pending" ? pendingRows : approvedRows;
  const [iconStates, setIconStates] = useState<RowIconStates>({});

  const EditIcon = iconRegistry.editDefault;
  const EditHoverIcon = iconRegistry.editHover;
  const EditClickedIcon = iconRegistry.editClicked;

  const CheckIcon = iconRegistry.checkDefault;
  const CheckHoverIcon = iconRegistry.checkHover;
  const CheckClickedIcon = iconRegistry.checkClicked;

  const CloseIcon = iconRegistry.closeDefault;
  const CloseHoverIcon = iconRegistry.closeHover;
  const CloseClickedIcon = iconRegistry.closeClicked;
  

  const setRowIconState = (rowId: number, iconType: 'edit' | 'check' | 'close' | 'manage', state: IconState) => {
    setIconStates(prev => ({
      ...prev,
      [rowId]: {
        ...prev[rowId],
        edit: iconType === 'edit' ? state : (prev[rowId]?.edit || 'default'),
        check: iconType === 'check' ? state : (prev[rowId]?.check || 'default'),
        close: iconType === 'close' ? state : (prev[rowId]?.close || 'default'),
        manage: iconType === 'manage' ? state : (prev[rowId]?.manage || 'default'),
      }
    }));
  };

  const getRowIconState = (rowId: number, iconType: 'edit' | 'check' | 'close' | 'manage'): IconState => {
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

  const getCheckIcon = (rowId: number) => {
    const state = getRowIconState(rowId, 'check');
    switch (state) {
      case "hover":
        return <CheckHoverIcon className="w-6 h-6 pointer-events-none" />;
      case "clicked":
        return <CheckClickedIcon className="w-6 h-6 pointer-events-none" />;
      default:
        return <CheckIcon className="w-6 h-6 pointer-events-none" />;
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

  const handleApproveClick = (row: any) => {
    console.log('Approve icon clicked for row:', row);
    onApproveClick?.(row);
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
          <div key={row["Defense ID"]} className="flex border-b last:border-b-0 hover:bg-gray-50">
            <div className="flex-1 text-center px-5 py-3">{row["Defense ID"]}</div>
            <div className="flex-1 text-center px-5 py-3">{row.Title}</div>
            <div className="flex-1 flex items-center justify-center gap-1 px-5 py-3">
              <Users className="w-4 h-4 text-[#730000]" /> {row.Proponents}
            </div>
            <div className="flex-1 text-center px-5 py-3">{row.Block}</div>
            <div className="flex-1 flex items-center justify-center gap-3 px-5 py-3">
              <button
                onClick={() => handleApproveClick(row)}
                onMouseEnter={() => setRowIconState(row["Defense ID"], 'check', 'hover')}
                onMouseLeave={() => setRowIconState(row["Defense ID"], 'check', 'default')}
                onMouseDown={() => setRowIconState(row["Defense ID"], 'check', 'clicked')}
                onMouseUp={() => setRowIconState(row["Defense ID"], 'check', 'default')}
                className="cursor-pointer transition"
                title="Approve"
              >
                {getCheckIcon(row["Defense ID"])}
              </button>

              <button
                onClick={() => handleRemoveClick(row)}
                onMouseEnter={() => setRowIconState(row["Defense ID"], 'close', 'hover')}
                onMouseLeave={() => setRowIconState(row["Defense ID"], 'close', 'default')}
                onMouseDown={() => setRowIconState(row["Defense ID"], 'close', 'clicked')}
                onMouseUp={() => setRowIconState(row["Defense ID"], 'close', 'default')}
                className="cursor-pointer transition"
                title="Remove"
              >
                {getCloseIcon(row["Defense ID"])}
              </button>

              <button
                onClick={() => handleEditClick(row)}
                onMouseEnter={() => setRowIconState(row["Defense ID"], 'edit', 'hover')}
                onMouseLeave={() => setRowIconState(row["Defense ID"], 'edit', 'default')}
                onMouseDown={() => setRowIconState(row["Defense ID"], 'edit', 'clicked')}
                onMouseUp={() => setRowIconState(row["Defense ID"], 'edit', 'default')}
                className="cursor-pointer transition"
                title="Edit"
              >
                {getEditIcon(row["Defense ID"])}
              </button>

              <button
                onClick={() => handleManageClick(row)}
                onMouseEnter={() => setRowIconState(row["Defense ID"], 'manage', 'hover')}
                onMouseLeave={() => setRowIconState(row["Defense ID"], 'manage', 'default')}
                onMouseDown={() => setRowIconState(row["Defense ID"], 'manage', 'clicked')}
                onMouseUp={() => setRowIconState(row["Defense ID"], 'manage', 'hover')}
                className={getManageButtonClass(row["Defense ID"])}
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