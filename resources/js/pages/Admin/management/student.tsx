// IMPORTS
import { useState, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import ManagementLayout from '@/pages/Admin/management/index';
import { type BreadcrumbItem } from '@/types';

// SHARED COMPONENTS 
import { NavFooter } from '@/components/nav-footer';

// STUDENT MNGMT COMPONENTS
import { FilterSection } from './student_management/student_filter_section';
import { StudentTableView } from './student_management/student_table_view';
import { GroupCardView } from './student_management/student_groupcard_view';
import { ViewToggle } from './student_management/student_view_toggle';
import { StudentProfileModal } from './student_management/student_viewStudprofile_modal';
import { GroupProfileModal } from './student_management/student_viewgroup_modal';

// TYPES AND SAMPLE DATA
import { Student, GroupData, FilterState } from './student_management/student_interface';
import { studentData, thesisTitles } from './student_management/student_sampleData';

import { filterAndSortStudents, filterAndSortGroups, groupStudentsByCode } from './student_management/student_data_utilities';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Student Management', href: '/admin/management/student' },
];

export default function StudentManagement({ students }: { students?: any[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({ blocks: [], specializations: [] });
  const [sortOption, setSortOption] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [view, setView] = useState("table");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<GroupData | null>(null);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  // Grouping students by group code for the group card view
  const groupedData = useMemo(() => {
    return groupStudentsByCode(studentData, thesisTitles);
  }, []);

  // Apply filtering and sorting for groups (in group card view)
  const filteredAndSortedGroups = useMemo(() => {
    return filterAndSortGroups(groupedData, filters, sortOption);
  }, [groupedData, filters, sortOption]);

  // Apply filtering and sorting for students
  const filteredAndSortedData = useMemo(() => {
    return filterAndSortStudents(studentData, searchQuery, filters, sortOption);
  }, [searchQuery, filters, sortOption]);

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  const handleViewGroup = (group: GroupData) => {
    setSelectedGroup(group);
    setIsGroupModalOpen(true);
  };

  const handleCloseGroupModal = () => {
    setIsGroupModalOpen(false);
    setSelectedGroup(null);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setFilters({ blocks: [], specializations: [] });
    setSortOption("");
  };

  const handleFilterToggle = () => {
    setFilterOpen(!filterOpen);
    setSortOpen(false);
  };

  const handleSortToggle = () => {
    setSortOpen(!sortOpen);
    setFilterOpen(false);
  };

  // Main Content
  return (
    <>
      <ManagementLayout
        breadcrumbs={breadcrumbs}
        title="Student Management"
        description="View and Manage Student Accounts and Thesis Group Assignments"
      >
        {/* Filter & Search Section */}
        <FilterSection
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filterOpen={filterOpen}
          sortOpen={sortOpen}
          onFilterToggle={handleFilterToggle}
          onSortToggle={handleSortToggle}
          onFilterClose={() => setFilterOpen(false)}
          onSortClose={() => setSortOpen(false)}
          onApplyFilter={setFilters}
          onApplySort={setSortOption}
          onClearFilters={handleClearFilters}
          view={view}
        />

        {/* View Toggle and Import Button */}
        <ViewToggle
          view={view}
          onViewChange={setView}
          onImport={() => {/* Handle import */}}
        />

        {/* Results Info */}
        {(searchQuery || filters.blocks.length > 0 || filters.specializations.length > 0) && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 font-['DM_Sans']">
              Found {filteredAndSortedData.length} student{filteredAndSortedData.length !== 1 ? 's' : ''} matching your filters
            </p>
          </div>
        )}

        {/* Data Views */}
        {view === 'table' ? (
          <StudentTableView
            students={filteredAndSortedData}
            onViewStudent={handleViewStudent}
          />
        ) : (
          <GroupCardView
            groups={filteredAndSortedGroups}
            onViewGroup={handleViewGroup}
          />
        )}

        {/* Modals */}
        <StudentProfileModal 
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          student={selectedStudent}
        />
        <GroupProfileModal 
          isOpen={isGroupModalOpen}
          onClose={handleCloseGroupModal}
          group={selectedGroup}
        />
      </ManagementLayout>

      <NavFooter />
    </>
  );
}