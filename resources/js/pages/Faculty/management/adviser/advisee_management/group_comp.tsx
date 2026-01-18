import AppLayout from '@/layouts/app-layout';
import { useState } from 'react';
import { PageHeaderProps, type BreadcrumbItem } from '@/types';
import AdviseeManagementLayout from '.';
import { Head, router } from '@inertiajs/react';
import CustomTable from './components/group_table';
import CreateGroupModal from './components/create-group';
import EditGroupModal from './components/edit-group';
import ManageGroupModal from './components/manage-group';
import { index } from '@/routes/faculty/adviser/group_comp';
import { destroy } from '@/routes/faculty/adviser/group_comp/index';
import { Icon } from '@/components/icon-index';

// Page Setup
const breadcrumb: BreadcrumbItem[] = [
  {
    title: 'Group Composition',
    href: index().url,
  },
];

const pageHeader: PageHeaderProps = {
    title: "Group Composition",
    subtitle: "Create and manage thesis group compositions and membership changes",
    icon: (
        <Icon
            name="calendarDefault"
            className="w-8 h-8 text-primary"
        />
    ),
};

// Types for data from GroupComp.php controller
interface SectionAdviser {
  section_adviser_id: number;
  section: number;
  year_level: number;
}

interface StudentWithoutGroup {
  id: number;
  student_name: string;
  student_number: string;
  email: string;
  section: string;
  year_level: number;
}

interface Student {
  defense_id: string;
  title: string | null;
  student_id: string;
  student_name: string;
  student_program_section: string;
  student_email: string;
  group_number: number;
  section: number;
  year_level: number;
  group_code: string;
  adviser_name: string;
  // Critical fields for CRUD operations
  group_id: number;
  section_adviser_id: number;
  is_leader: boolean;
}

interface PageProps {
  students: Student[];
  sectionAdvisers: SectionAdviser[];
  studentsWithoutGroup: StudentWithoutGroup[];
}

export default function GroupComposition({ students = [], sectionAdvisers = [], studentsWithoutGroup = [] }: PageProps) {
  // Derive groups from students data
  const groupsMap = new Map<number, {
    groupId: number;
    sectionAdviserId: number;
    groupCode: string;
    title: string | null;
    block: string;
    proponents: number
  }>();

  students.forEach(student => {
    const groupKey = student.group_id;
    if (!groupsMap.has(groupKey)) {
      groupsMap.set(groupKey, {
        groupId: student.group_id,
        sectionAdviserId: student.section_adviser_id,
        groupCode: student.group_code,
        title: student.title,
        block: student.student_program_section,
        proponents: 0,
      });
    }
    const group = groupsMap.get(groupKey)!;
    group.proponents += 1;
  });

  // Transform groups data to match table format
  const rows = Array.from(groupsMap.values()).map((group) => ({
    group_id: group.groupId,
    section_adviser_id: group.sectionAdviserId,
    "Group Number": group.groupCode,
    Title: group.title ?? 'No Title Yet',
    Proponents: group.proponents,
    Block: group.block,
  }));

  // Helper function to get members for a specific group
  const getMembersForGroup = (groupId: number) => {
    const filteredStudents = students.filter(student => student.group_id === groupId);
    return filteredStudents.map((student, index) => {
      return {
        id: index + 1, // This is a temporary id for the mapping
        name: student.student_name,
        studentNumber: student.student_id,
        email: student.student_email,
        isLeader: Boolean(student.is_leader),
      };
    });
  };
  
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
  };

  const handleRemoveClick = (row: any) => {
    if (confirm(`Are you sure you want to remove group ${row["Group Number"]}? This will unassign all students from this group.`)) {
      router.delete(destroy.url({ id: row.group_id }));
    }
  };

  return (
    <AdviseeManagementLayout
      breadcrumbs={breadcrumb}
      pageHeader={pageHeader}
    >
      <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 p-6">

        {/* Create New Group Button */}
        <div className="flex items-center justify-end mb-4">
          <button
            onClick={() => setIsGroupModalOpen(true)}
            className="flex items-center gap-2 w-[190px] h-[36px] bg-[#730000] rounded-[8px] px-4 py-2 text-white font-medium hover:bg-red-800 transition"
          >
            <span>+</span> Create New Group
          </button>
        </div>

        {/* Table */}
        <CustomTable
          rows={rows}
          onEditClick={handleEditClick}
          onManageClick={handleManageClick}
          onRemoveClick={handleRemoveClick}
        />

      </div>

      {/* Create Group Modal */}
      <CreateGroupModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        sectionAdvisers={sectionAdvisers}
        studentsWithoutGroup={studentsWithoutGroup}
      />

      {/* Edit Group Modal */}
      <EditGroupModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedRow(null);
        }}
        sectionAdvisers={sectionAdvisers}
        studentsWithoutGroup={studentsWithoutGroup}
        groupData={selectedRow ? {
          groupId: selectedRow.group_id,
          sectionAdviserId: selectedRow.section_adviser_id,
          block: selectedRow.Block,
          members: getMembersForGroup(selectedRow.group_id),
        } : undefined}
      />

      {/* Manage Group Modal */}
      <ManageGroupModal
        isOpen={isManageModalOpen}
        onClose={() => {
          setIsManageModalOpen(false);
          setSelectedRow(null);
        }}
        sectionAdvisers={sectionAdvisers}
        studentsWithoutGroup={studentsWithoutGroup}
        groupData={selectedRow ? {
          groupId: selectedRow.group_id,
          sectionAdviserId: selectedRow.section_adviser_id,
          members: students
            .filter(student => student.group_id === selectedRow.group_id)
            .map((student, index) => {
              // Generate initials from student name
              const nameParts = student.student_name.split(',').map(p => p.trim());
              const lastName = nameParts[0] || '';
              const firstAndMiddle = nameParts[1] || '';
              const initials = (firstAndMiddle.charAt(0) + lastName.charAt(0)).toUpperCase();
              return {
                id: index + 1,
                name: student.student_name,
                studentNumber: student.student_id,
                initials,
                isLeader: student.is_leader,
              };
            }),
        } : undefined}
      />
    </AdviseeManagementLayout>
  );
}