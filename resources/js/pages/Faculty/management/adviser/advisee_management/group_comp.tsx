import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { useState } from 'react';
import { group_comp } from '@/routes/faculty/management/adviser/advisee_management';
import { type BreadcrumbItem } from '@/types';
import AdviseeManagementLayout from '.';
import OptionToggle from './option-toggle';
import { Head } from '@inertiajs/react';
import CustomTable from './group_table';
import CreateGroupModal from './create-group';
import EditGroupModal from './edit-group';
import ManageGroupModal from './manage-group';

const breadcrumb: BreadcrumbItem[] = [
  {
    title: 'Group Composition',
    href: '/faculty/management/adviser/group-composition',
  },
];

// Initial data
const initialPendingRows = [
  { "Defense ID": 4103, Title: "Machine Learning 1", Proponents: 4, Block: "BSCPE 4-1" },
  { "Defense ID": 4104, Title: "Machine Learning 2", Proponents: 2, Block: "BSCPE 4-2" },
  { "Defense ID": 4106, Title: "Machine Learning 3", Proponents: 2, Block: "BSCPE 4-3" },
  { "Defense ID": 4105, Title: "Machine Learning 4", Proponents: 4, Block: "BSCPE 4-3" },
  { "Defense ID": 4107, Title: "Machine Learning 5", Proponents: 2, Block: "BSCPE 4-3" },
];

const initialApprovedRows = [
  { "Defense ID": 3201, Title: "Data Analytics ", Proponents: 4, Block: "BSCPE 3-1" },
  { "Defense ID": 3102, Title: "Cybersecurity ", Proponents: 2, Block: "BSCPE 3-2" },
  { "Defense ID": 303, Title: "AI Project 3", Proponents: 4, Block: "BSCPE 3-3" },
];

export default function Dashboard() {
  const [status, setStatus] = useState<'pending' | 'approved'>('pending');
  const [pendingRows, setPendingRows] = useState(initialPendingRows);
  const [approvedRows, setApprovedRows] = useState(initialApprovedRows);
  
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);

  const handleEditClick = (row: any) => {
    console.log('Opening Edit Modal for:', row);
    setSelectedRow(row);
    setIsEditModalOpen(true);
  };

  const handleManageClick = (row: any) => {
    console.log('Opening Manage Modal for:', row);
    setSelectedRow(row);
    setIsManageModalOpen(true);
  };

  const handleApproveClick = (row: any) => {
    console.log('Approve clicked for:', row);
    // Remove from pending and add to approved
    setPendingRows(prev => prev.filter(r => r["Defense ID"] !== row["Defense ID"]));
    setApprovedRows(prev => [...prev, row]);
  };

  const handleRemoveClick = (row: any) => {
    console.log('Remove clicked for:', row);
    // Remove from current table
    if (status === 'pending') {
      setPendingRows(prev => prev.filter(r => r["Defense ID"] !== row["Defense ID"]));
    } else {
      setApprovedRows(prev => prev.filter(r => r["Defense ID"] !== row["Defense ID"]));
    }
  };

  return (
    <AdviseeManagementLayout
      breadcrumbs={breadcrumb}
      title="Group Composition"
      description="Create and manage thesis group compositions and membership changes"
    >
      <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 p-6">

        {/* Option Toggle + Dialog Button */}
        <div className="flex items-center justify-between mb-4">
          <OptionToggle
            currentStatus={status}
            onStatusChange={setStatus}
            pendingCount={pendingRows.length}
            approvedCount={approvedRows.length}
          />

          <button
            onClick={() => setIsGroupModalOpen(true)}
            className="flex items-center gap-2 w-[190px] h-[36px] bg-[#730000] rounded-[8px] px-4 py-2 text-white font-medium hover:bg-red-800 transition"
          >
            <span>+</span> Create New Group
          </button>
        </div>

        {/* Table */}
        <CustomTable 
          status={status}
          pendingRows={pendingRows}
          approvedRows={approvedRows}
          onEditClick={handleEditClick}
          onManageClick={handleManageClick}
          onApproveClick={handleApproveClick}
          onRemoveClick={handleRemoveClick}
        />

      </div>

      {/* Create Group Modal */}
      <CreateGroupModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
      />

      {/* Edit Group Modal */}
      <EditGroupModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedRow(null);
        }}
        groupData={selectedRow ? {
          members: [
            { id: 1, name: 'Juan Dela Cruz', studentNumber: '2022-09589-MN-0', email: 'jdc@iskolangbayan.pup.edu.ph', isLeader: true },
            { id: 2, name: 'Juan Dela Cruz', studentNumber: '2022-09589-MN-0', email: 'jdc@iskolangbayan.pup.edu.ph', isLeader: false },
            { id: 3, name: 'Juan Dela Cruz', studentNumber: '2022-09589-MN-0', email: 'jdc@iskolangbayan.pup.edu.ph', isLeader: false },
            { id: 4, name: 'Juan Dela Cruz', studentNumber: '2022-09589-MN-0', email: 'jdc@iskolangbayan.pup.edu.ph', isLeader: false },
          ]
        } : undefined}
      />

      {/* Manage Group Modal */}
      <ManageGroupModal
        isOpen={isManageModalOpen}
        onClose={() => {
          setIsManageModalOpen(false);
          setSelectedRow(null);
        }}
        groupData={selectedRow ? {
          members: [
            { id: 1, name: 'Juan Dela Cruz', studentNumber: '2022-09265-MN-0', initials: 'JDC' },
            { id: 2, name: 'John Doe', studentNumber: '2022-09265-MN-0', initials: 'JD' },
            { id: 3, name: '', studentNumber: '2022-09265-MN-0', initials: 'PK' },
          ]
        } : undefined}
      />
    </AdviseeManagementLayout>
  );
}