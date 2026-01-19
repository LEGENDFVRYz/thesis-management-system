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
import { Users } from 'lucide-react';

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
        <Users className="w-8 h-8 text-primary" />
    ),
};


// Types for data from GroupComp.php controller
interface SectionAdviser {
  section_adviser_id: number;
  section: number;
}

interface StudentWithoutGroup {
  id: number;
  student_name: string;
  student_number: string;
  email: string;
  section: string;
}

interface Student {
  student_name: string;
  student_number: string;
  email: string;
  is_leader: boolean;
  section: string;
  group_id: number;
  section_adviser_id: number;
  formatted_group_number: string;
  course: string;
  block: string;
  faculty_id: number;
  thesis_title: string | null;
}

interface PageProps {
  students: Student[];
  sectionAdvisers: SectionAdviser[];
  studentsWithoutGroup: StudentWithoutGroup[];
}


export default function GroupComposition({ students = [], sectionAdvisers = [], studentsWithoutGroup = [] }: PageProps) {
  // Helper function to get year from course
  const getYearFromCourse = (course: string): string => {
    if (course === 'MOR') return '3';
    if (course === 'DP1' || course === 'DP2') return '4';
    return '';
  };

  // Derive groups from students data
  const groupsMap = new Map<string, {
    groupId: number;
    sectionAdviserId: number;
    groupNumber: string;
    title: string | null;
    block: string;
    course: string;
    proponents: number
  }>();

  students.forEach(student => {
    const groupKey = student.formatted_group_number;
    if (!groupsMap.has(groupKey)) {
      groupsMap.set(groupKey, {
        groupId: student.group_id,
        sectionAdviserId: student.section_adviser_id,
        groupNumber: student.formatted_group_number,
        title: student.thesis_title,
        block: student.block,
        course: student.course,
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
    "Group Number": group.groupNumber,
    Title: group.title ?? 'No Title Yet',
    Proponents: group.proponents,
    Block: `BSCPE ${getYearFromCourse(group.course)}-${group.block}`,
  }));

  // Helper function to get members for a specific group
  const getMembersForGroup = (groupNumber: string | number) => {
    const groupNumberStr = String(groupNumber);
    const filteredStudents = students.filter(student => student.formatted_group_number === groupNumberStr);
    console.log('Raw students for group', groupNumberStr, filteredStudents);
    return filteredStudents.map((student, index) => {
      console.log('Student is_leader value:', student.student_name, student.is_leader, typeof student.is_leader);
      return {
        id: index + 1,
        name: student.student_name,
        studentNumber: student.student_number,
        email: student.email,
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
          members: getMembersForGroup(selectedRow["Group Number"]),
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
            .filter(student => student.formatted_group_number === String(selectedRow["Group Number"]))
            .map((student, index) => {
              // Generate initials from student name
              const nameParts = student.student_name.split(',').map(p => p.trim());
              const lastName = nameParts[0] || '';
              const firstAndMiddle = nameParts[1] || '';
              const initials = (firstAndMiddle.charAt(0) + lastName.charAt(0)).toUpperCase();
              return {
                id: index + 1,
                name: student.student_name,
                studentNumber: student.student_number,
                initials,
                isLeader: student.is_leader,
              };
            }),
        } : undefined}
      />
    </AdviseeManagementLayout>
  );
}