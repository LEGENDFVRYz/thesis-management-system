import { Student, GroupData, FilterState } from './student_interface';

export function filterAndSortStudents(
  students: Student[],
  searchQuery: string,
  filters: FilterState,
  sortOption: string
): Student[] {
  let result = [...students];

  // Apply search
  if (searchQuery) {
    result = result.filter(student =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.groupCode.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Apply block filter
  if (filters.blocks.length > 0) {
    result = result.filter(student =>
      filters.blocks.includes(student.block)
    );
  }

  // Apply specialization filter
  if (filters.specializations.length > 0) {
    result = result.filter(student => 
      filters.specializations.includes(student.specialization)
    );
  }

  // Apply sorting
  if (sortOption === "student-id-asc") {
    result.sort((a, b) => a.studentNumber.localeCompare(b.studentNumber));
  } else if (sortOption === "student-id-desc") {
    result.sort((a, b) => b.studentNumber.localeCompare(a.studentNumber));
  } else if (sortOption === "student-name-a-z") {
    result.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortOption === "student-name-z-a") {
    result.sort((a, b) => b.name.localeCompare(a.name));
  } else if (sortOption === "group-code-asc") {
    result.sort((a, b) => a.groupCode.localeCompare(b.groupCode));
  } else if (sortOption === "group-code-desc") {
    result.sort((a, b) => b.groupCode.localeCompare(a.groupCode));
  }

  return result;
}

export function filterAndSortGroups(
  groups: GroupData[],
  filters: FilterState,
  sortOption: string
): GroupData[] {
  let result = [...groups];

  // Apply block filter
  if (filters.blocks.length > 0) {
    result = result.filter(group =>
      filters.blocks.includes(group.block)
    );
  }

  // Apply specialization filter
  if (filters.specializations.length > 0) {
    result = result.filter(group => 
      filters.specializations.includes(group.specialization)
    );
  }

  // Apply sorting for groups
  if (sortOption === "group-code-asc") {
    result.sort((a, b) => a.groupCode.localeCompare(b.groupCode));
  } else if (sortOption === "group-code-desc") {
    result.sort((a, b) => b.groupCode.localeCompare(a.groupCode));
  } else if (sortOption === "thesis-title-a-z") {
    result.sort((a, b) => a.thesisTitle.localeCompare(b.thesisTitle));
  } else if (sortOption === "thesis-title-z-a") {
    result.sort((a, b) => b.thesisTitle.localeCompare(a.thesisTitle));
  }

  return result;
}

export function groupStudentsByCode(students: Student[], thesisTitles: { [key: string]: string }): GroupData[] {
  const groups: { [key: string]: GroupData } = {};
  
  students.forEach(student => {
    if (!groups[student.groupCode]) {
      groups[student.groupCode] = {
        groupCode: student.groupCode,
        thesisTitle: thesisTitles[student.groupCode] || "Research Project in Computer Engineering",
        thesisStage: "Title Proposal",
        members: [],
        adviser: student.adviser,
        specialization: student.specialization,
        block: student.block
      };
    }
    groups[student.groupCode].members.push(student.name);
  });
  
  return Object.values(groups);
}