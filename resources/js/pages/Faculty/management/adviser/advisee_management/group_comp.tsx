  import AppLayout from '@/layouts/app-layout';
  import { useEffect, useMemo, useState } from 'react';
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
  import { Filter, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
  import { Button } from '@/components/ui/button';

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
                // pa correct nalang
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

    // --- STATES ---
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");

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
    const rows = useMemo(() => {
      return Array.from(groupsMap.values()).map((group) => ({
          group_id: group.groupId,
          section_adviser_id: group.sectionAdviserId,
          "Group Number": group.groupNumber,
          Title: group.title ?? 'No Title Yet',
          Proponents: group.proponents,
          Block: `BSCPE ${getYearFromCourse(group.course)}-${group.block}`,
      }));
    }, [groupsMap]);

    // --- FILTER & PAGINATION LOGIC ---
    const filteredRows = useMemo(() => {
      if (!searchQuery) return rows;
      const lowerQuery = searchQuery.toLowerCase();
      
      return rows.filter(row => 
          String(row["Group Number"]).toLowerCase().includes(lowerQuery) ||
          row.Title.toLowerCase().includes(lowerQuery) ||
          row.Block.toLowerCase().includes(lowerQuery)
      );
    }, [rows, searchQuery]);

    useEffect(() => {
      setCurrentPage(1);
    }, [searchQuery, itemsPerPage]);

    const totalItems = filteredRows.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    
    const paginatedRows = useMemo(() => {
      return filteredRows.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredRows, startIndex, itemsPerPage]);

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
          <div className="overflow-x-auto min-h-[400px]">
              <CustomTable
                  rows={paginatedRows} // Use paginated rows
                  onEditClick={handleEditClick}
                  onManageClick={handleManageClick}
                  onRemoveClick={handleRemoveClick}
              />
              
              {totalItems === 0 && (
                  <div className="p-8 text-center text-gray-500">
                      No groups found matching your search.
                  </div>
              )}
          </div>

          {/* Pagination Footer */}
          {totalItems > 0 && (
              <div className="border-t border-gray-200 bg-gray-50/50 dark:border-zinc-800 dark:bg-zinc-900/50 p-4">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      
                      {/* Left: Info & Limit */}
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <span className="whitespace-nowrap">
                              Showing <strong>{startIndex + 1}</strong> - <strong>{endIndex}</strong> of <strong>{totalItems}</strong>
                          </span>
                          
                          <div className="hidden sm:flex items-center gap-2">
                              <span className="text-xs">Rows per page</span>
                              <Select
                                  value={itemsPerPage.toString()} 
                                  onValueChange={(val) => setItemsPerPage(Number(val))}
                              >
                                  <SelectTrigger className="h-8 w-[70px]">
                                      <SelectValue placeholder={itemsPerPage} />
                                  </SelectTrigger>
                                  <SelectContent side="top">
                                      {[5, 10, 20, 50].map((size) => (
                                          <SelectItem key={size} value={size.toString()}>
                                              {size}
                                          </SelectItem>
                                      ))}
                                  </SelectContent>
                              </Select>
                          </div>
                      </div>

                      {/* Right: Buttons */}
                      <div className="flex items-center gap-1">
                          <Button
                              size="icon"
                              className="h-8 w-8 hidden sm:flex"
                              onClick={() => setCurrentPage(1)}
                              disabled={currentPage === 1}
                              title="First Page"
                          >
                              <ChevronsLeft className="h-4 w-4"/>
                          </Button>
                          <Button
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                              disabled={currentPage === 1}
                              title="Previous Page"
                          >
                              <ChevronLeft className="h-4 w-4"/>
                          </Button>
                          
                          <div className="flex items-center justify-center min-w-[3rem] px-2 text-sm font-semibold text-gray-900 dark:text-white">
                              Page {currentPage} of {totalPages}
                          </div>

                          <Button
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                              disabled={currentPage === totalPages}
                              title="Next Page"
                          >
                              <ChevronRight className="h-4 w-4"/>
                          </Button>
                          <Button
                              size="icon"
                              className="h-8 w-8 hidden sm:flex"
                              onClick={() => setCurrentPage(totalPages)}
                              disabled={currentPage === totalPages}
                              title="Last Page"
                          >
                              <ChevronsRight className="h-4 w-4"/>
                          </Button>
                      </div>
                  </div>
              </div>
          )}

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