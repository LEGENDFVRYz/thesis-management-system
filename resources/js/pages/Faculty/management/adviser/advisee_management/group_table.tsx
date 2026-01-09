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
  onApproveClick?: (row: any) => void;
}

  type IconState = "default" | "hover" | "clicked";

interface RowIconStates {
  [key: number]: {
    edit: IconState;
    close: IconState;
    manage: IconState;
    check: IconState;
  };
}

export default function CustomTable({
  rows,
  onEditClick,
  onManageClick,
  onRemoveClick,
  onApproveClick, 
}: CustomTableProps) {
  const [iconStates, setIconStates] = useState<RowIconStates>({});

  const EditIcon = iconRegistry.editDefault;
  const EditHoverIcon = iconRegistry.editHover;
  const EditClickedIcon = iconRegistry.editClicked;

  const CloseIcon = iconRegistry.closeDefault;
  const CloseHoverIcon = iconRegistry.closeHover;
  const CloseClickedIcon = iconRegistry.closeClicked;

  const CheckIcon = iconRegistry.checkDefault;
  const CheckHoverIcon = iconRegistry.checkHover;
  const CheckClickedIcon = iconRegistry.checkClicked;
  

  const setRowIconState = (rowId: number, iconType: 'edit' | 'close' | 'manage' | 'check', state: IconState) => {
    setIconStates(prev => ({
      ...prev,
      [rowId]: {
        ...prev[rowId],
        edit: iconType === 'edit' ? state : (prev[rowId]?.edit || 'default'),
        close: iconType === 'close' ? state : (prev[rowId]?.close || 'default'),
        manage: iconType === 'manage' ? state : (prev[rowId]?.manage || 'default'),
        check: iconType === 'check' ? state : (prev[rowId]?.check || 'default'),
      }
    }));
  };

  const getRowIconState = (rowId: number, iconType: 'edit' | 'close' | 'manage' | 'check'): IconState => {
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
                      </>
                    )}

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

                  {/* <Button
                    onClick={() => handleManageClick(row)}
                    variant="tertiary"
                    size="sm"
                    className="px-4 py-1 text-sm"
                    title="Manage"
                  >
                    Manage
                  </Button> */}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}