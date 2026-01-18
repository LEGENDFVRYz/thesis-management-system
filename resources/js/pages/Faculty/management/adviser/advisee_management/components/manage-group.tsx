import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
import { update } from '@/routes/faculty/adviser/group_comp/index';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import InputError from '@/components/input-error';

interface Member {
  id: number;
  name: string;
  studentNumber: string;
  initials: string;
  isLeader?: boolean;
}

interface SectionAdviser {
  section_adviser_id: number;
  section: string;
  year_level: number;
}

interface StudentWithoutGroup {
  id: number;
  student_name: string;
  student_number: string;
  email: string;
  section: string;
}

interface ManageGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectionAdvisers: SectionAdviser[];
  studentsWithoutGroup: StudentWithoutGroup[];
  groupData?: {
    groupId: number;
    sectionAdviserId: number;
    members: Member[];
  };
}

export default function ManageGroupModal({ isOpen, onClose, sectionAdvisers, studentsWithoutGroup, groupData }: ManageGroupModalProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update members when groupData changes
  useEffect(() => {
    if (groupData?.members) {
      setMembers(groupData.members);
    }
  }, [groupData]);

  const [selectedAction, setSelectedAction] = useState<'add' | 'remove' | 'replace'>('add');
  const [selectedMember, setSelectedMember] = useState('');
  const [selectedNewStudent, setSelectedNewStudent] = useState('');
  const [reason, setReason] = useState('');

  // Get available students for adding (filtered by block section and not already in group)
  const getAvailableStudents = () => {
    // Find the section adviser to get the section number
    const sectionAdviser = sectionAdvisers.find(
      sa => sa.section_adviser_id === groupData?.sectionAdviserId
    );

    // Filter students by block section if available
    let filteredStudents = studentsWithoutGroup;
    if (sectionAdviser) {
      filteredStudents = studentsWithoutGroup.filter(
        s => s.section === String(sectionAdviser.section)
      );
    }

    // Filter out students already in the group
    const currentStudentNumbers = members.map(m => m.studentNumber);
    return filteredStudents.filter(s => !currentStudentNumbers.includes(s.student_number));
  };

  // Get initials from student name
  const getInitials = (studentName: string): string => {
    const nameParts = studentName.split(',').map(p => p.trim());
    const lastName = nameParts[0] || '';
    const firstAndMiddle = nameParts[1] || '';
    return (firstAndMiddle.charAt(0) + lastName.charAt(0)).toUpperCase();
  };
  
  const [errors, setErrors] = useState<{
    selectedMember?: string;
    studentId?: string;
    email?: string;
    reason?: string;
  }>({});

  const validateForm = () => {
    const newErrors: {
      selectedMember?: string;
      studentId?: string;
      reason?: string;
    } = {};

    // Reason is required for ALL actions
    if (!reason.trim()) {
      newErrors.reason = 'Reason is required';
    }

    // Check specific fields based on action
    if (selectedAction === 'add') {
      if (!selectedNewStudent) {
        newErrors.studentId = 'Please select a student';
      }
    } 
    else if (selectedAction === 'remove') {
      if (!selectedMember) {
        newErrors.selectedMember = 'Please select a member';
      }
    } 
    else if (selectedAction === 'replace') {
      if (!selectedMember) {
        newErrors.selectedMember = 'Please select a member to replace';
      }
      if (!selectedNewStudent) {
        newErrors.studentId = 'Please select a replacement student';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = () => {
    if (!validateForm()) {
      return;
    }
    
    if (!groupData?.groupId || !groupData?.sectionAdviserId) {
      return;
    }

    let updatedMembers = [...members];

    if (selectedAction === 'add') {
      // Add new member
      const newStudent = studentsWithoutGroup.find(s => s.student_number === selectedNewStudent);
      if (!newStudent || members.length >= 4) {
        return;
      }
      updatedMembers.push({
        id: Math.max(...members.map(m => m.id), 0) + 1,
        name: newStudent.student_name,
        studentNumber: newStudent.student_number,
        initials: getInitials(newStudent.student_name),
        isLeader: false,
      });
    } else if (selectedAction === 'remove') {
      // Remove selected member
      if (!selectedMember || members.length <= 2) {
        return;
      }
      updatedMembers = members.filter(m => String(m.id) !== selectedMember);
    } else if (selectedAction === 'replace') {
      // Replace selected member with new student
      const newStudent = studentsWithoutGroup.find(s => s.student_number === selectedNewStudent);
      if (!selectedMember || !newStudent) {
        return;
      }
      const memberToReplace = members.find(m => String(m.id) === selectedMember);
      updatedMembers = members.map(m => {
        if (String(m.id) === selectedMember) {
          return {
            ...m,
            name: newStudent.student_name,
            studentNumber: newStudent.student_number,
            initials: getInitials(newStudent.student_name),
            isLeader: memberToReplace?.isLeader || false,
          };
        }
        return m;
      });
    }

    // Ensure at least one leader exists
    const hasLeader = updatedMembers.some(m => m.isLeader);
    if (!hasLeader && updatedMembers.length > 0) {
      updatedMembers[0].isLeader = true;
    }

    setIsSubmitting(true);

    router.put(update.url({ id: groupData.groupId }), {
      section_adviser_id: groupData.sectionAdviserId,
      members: updatedMembers.map(m => ({
        studentNumber: m.studentNumber,
        isLeader: m.isLeader || false,
      })),
    }, {
      onSuccess: () => {
        handleCancel();
      },
      onFinish: () => {
        setIsSubmitting(false);
      },
    });
  };

  const handleCancel = () => {
    setSelectedMember('');
    setSelectedNewStudent('');
    setReason('');
    setSelectedAction('add');
    setErrors({});
    onClose();
  };

  // Check if the form is valid for submission
  const isFormValid = () => {
    if (selectedAction === 'add') {
      return selectedNewStudent && members.length < 4;
    } else if (selectedAction === 'remove') {
      return selectedMember && members.length > 2;
    } else if (selectedAction === 'replace') {
      return selectedMember && selectedNewStudent;
    }
    return false;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="!w-[650px] !max-w-[650px] max-h-[90vh] p-0 gap-0 overflow-hidden flex flex-col">
        {/* Header */}
        <DialogHeader className="bg-[#730000] px-6 py-4 text-white flex-shrink-0 text-left space-y-1">
          <DialogTitle className="text-lg font-semibold text-white text-left">Manage Group Members</DialogTitle>
          <DialogDescription className="text-sm text-red-200 text-left">
            Fill in the group details and member information
          </DialogDescription>
        </DialogHeader>

        {/* Body */}
        <div className="flex-1 overflow-auto p-6 space-y-5">
          {/* Current Members */}
          <div className="border border-gray-300 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-red-600 text-sm">⊞</span>
              <span className="font-semibold text-sm">Current Members ({members.length}/4)</span>
            </div>

            <div className="space-y-3">
              {members.map((member) => (
                <div key={member.id} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#730000] flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                    {member.initials}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{member.name || member.initials}</div>
                    <div className="text-xs text-gray-600">{member.studentNumber}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Change Member/s */}
          <div>
            <h3 className="font-semibold text-sm text-[#730000] mb-3">Change Member/s</h3>
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setSelectedAction('add');
                  setErrors({});
                }}
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '13.33px',
                  lineHeight: '17px',
                }}
                className={`flex items-center justify-center px-[17px] py-[9px] h-9 rounded-lg font-medium transition ${
                  selectedAction === 'add'
                    ? 'bg-[#730000] text-white'
                    : 'bg-[#F3EFD0] text-[#730000] hover:border hover:border-[#730000]'
                }`}
              >
                Add Member
              </Button>
              <Button
                onClick={() => {
                  setSelectedAction('remove');
                  setErrors({});
                }}
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '13.33px',
                  lineHeight: '17px',
                }}
                className={`flex items-center justify-center px-[17px] py-[9px] h-9 rounded-lg font-medium transition ${
                  selectedAction === 'remove'
                    ? 'bg-[#730000] text-white'
                    : 'bg-[#F3EFD0] text-[#730000] hover:border hover:border-[#730000]'
                }`}
              >
                Remove Member
              </Button>
              <Button
                onClick={() => {
                  setSelectedAction('replace');
                  setErrors({});
                }}
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '13.33px',
                  lineHeight: '17px',
                }}
                className={`flex items-center justify-center px-[17px] py-[9px] h-9 rounded-lg font-medium transition ${
                  selectedAction === 'replace'
                    ? 'bg-[#730000] text-white'
                    : 'bg-[#F3EFD0] text-[#730000] hover:border hover:border-[#730000]'
                }`}
              >
                Replace Member
              </Button>
            </div>
          </div>

          {/* Form Fields - Dynamic based on selected action */}
          <div className="space-y-4">
            {/* Add Member Form */}
            {selectedAction === 'add' && (
              <>
                {members.length >= 4 ? (
                  <div className="bg-yellow-100 text-yellow-800 text-sm px-4 py-3 rounded border border-yellow-200">
                    This group already has the maximum of 4 members. Remove a member first to add a new one.
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Select New Member*
                    </label>
                    <select
                      value={selectedNewStudent}
                      onChange={(e) => setSelectedNewStudent(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#730000]"
                    >
                      <option value="">Select Student...</option>
                      {getAvailableStudents().map((student) => (
                        <option key={student.id} value={student.student_number}>
                          {student.student_name} - {student.student_number}
                        </option>
                      ))}
                    </select>
                    {getAvailableStudents().length === 0 && (
                      <p className="text-xs text-gray-500 mt-1">No available students in this block section.</p>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Reason for Change*
                  </label>
                  <textarea
                    placeholder="Explain the reason for this membership change.."
                    value={reason}
                    onChange={(e) => {
                      setReason(e.target.value);
                      if (errors.reason) {
                        setErrors({ ...errors, reason: undefined });
                      }
                    }}
                    rows={4}
                    className="w-full bg-white border border-gray-300 rounded-[8px] px-3 py-2 text-sm focus:outline-none focus:border-[#730000] focus:ring-0 resize-none"
                  />
                  <InputError message={errors.reason} className="mt-1" />
                </div>
              </>
            )}

            {/* Remove Member Form */}
            {selectedAction === 'remove' && (
              <>
                {members.length <= 2 ? (
                  <div className="bg-yellow-100 text-yellow-800 text-sm px-4 py-3 rounded border border-yellow-200">
                    This group has the minimum of 2 members. Add a member first before removing one.
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Select Member to Remove*
                    </label>
                    <select
                      value={selectedMember}
                      onChange={(e) => {
                        setSelectedMember(e.target.value)
                        if (errors.selectedMember) {
                          setErrors({ ...errors, selectedMember: undefined });
                        }
                      }}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#730000]"
                    >
                      <option value="">Select Member</option>
                      {members.map((member) => (
                        <option key={member.id} value={member.id}>
                          {member.name || member.initials} - {member.studentNumber}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Reason for Change*
                  </label>
                  <textarea
                    placeholder="Explain the reason for this membership change.."
                    value={reason}
                    onChange={(e) => {
                      setReason(e.target.value);
                      if (errors.reason) {
                        setErrors({ ...errors, reason: undefined });
                      }
                    }}
                    rows={4}
                    className="w-full bg-white border border-gray-300 rounded-[8px] px-3 py-2 text-sm focus:outline-none focus:border-[#730000] focus:ring-0 resize-none"
                  />
                  <InputError message={errors.reason} className="mt-1" />
                </div>
              </>
            )}

            {/* Replace Member Form */}
            {selectedAction === 'replace' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Select Member to Replace*
                  </label>
                  <select
                    value={selectedMember}
                    onChange={(e) => {
                      setSelectedMember(e.target.value);
                      if (errors.selectedMember) {
                        setErrors({ ...errors, selectedMember: undefined });
                      }
                    }}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#730000]"
                  >
                    <option value="">Select Member</option>
                    {members.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name || member.initials} - {member.studentNumber}
                      </option>
                    ))}
                  </select>
                  <InputError message={errors.selectedMember} className="mt-1" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Select Replacement Member*
                  </label>
                  <select
                    value={selectedNewStudent}
                    onChange={(e) => {
                      setSelectedNewStudent(e.target.value);
                      if (errors.studentId) {
                        setErrors({ ...errors, studentId: undefined });
                      }
                    }}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#730000]"
                  >
                    <option value="">Select Student...</option>
                    {getAvailableStudents().map((student) => (
                      <option key={student.id} value={student.student_number}>
                        {student.student_name} - {student.student_number}
                      </option>
                    ))}
                  </select>
                  {getAvailableStudents().length === 0 && (
                    <p className="text-xs text-gray-500 mt-1">No available students in this block section.</p>
                  )}
                  <InputError message={errors.studentId} className="mt-1" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Reason for Change*
                  </label>
                  <textarea
                    placeholder="Explain the reason for this membership change.."
                    value={reason}
                    onChange={(e) => {
                      setReason(e.target.value);
                      if (errors.reason) {
                        setErrors({ ...errors, reason: undefined });
                      }
                    }}
                    rows={4}
                    className="w-full bg-white border border-gray-300 rounded-[8px] px-3 py-2 text-sm focus:outline-none focus:border-[#730000] focus:ring-0 resize-none"
                  />
                  <InputError message={errors.reason} className="mt-1" />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="p-6 border-t border-gray-200 flex-shrink-0 bg-gray-50 !flex-row !justify-end gap-3 sm:!flex-row sm:!justify-end">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="px-6 py-2 border-[#730000] text-[#730000] hover:bg-red-50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            disabled={isSubmitting || !isFormValid()}
            className="px-6 py-2 bg-[#730000] text-white hover:bg-red-800 disabled:bg-gray-400"
          >
            {isSubmitting ? 'Updating...' : 'Update'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}