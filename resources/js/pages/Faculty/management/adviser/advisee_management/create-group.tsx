import { useState } from 'react';
import { Trash2, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
import { store } from '@/routes/faculty/management/adviser/advisee_management/group_comp';
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
  email: string;
  isLeader: boolean;
}

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

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectionAdvisers: SectionAdviser[];
  studentsWithoutGroup: StudentWithoutGroup[];
}

export default function CreateGroupModal({ isOpen, onClose, sectionAdvisers, studentsWithoutGroup }: CreateGroupModalProps) {
  const [selectedBlock, setSelectedBlock] = useState('');
  const [members, setMembers] = useState<Member[]>([
    { id: 1, name: '', studentNumber: '', email: '', isLeader: true },
    { id: 2, name: '', studentNumber: '', email: '', isLeader: false },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    block?: string;
    members?: { [key: number]: { name?: string; studentNumber?: string; email?: string } };
  }>({});

  const handleAddMember = () => {
    if (members.length < 4) {
      setMembers([...members, {
        id: Math.max(...members.map(m => m.id), 0) + 1,
        name: '',
        studentNumber: '',
        email: '',
        isLeader: false,
      }]);
    }
  };

  const handleRemoveMember = (id: number) => {
    if (members.length > 2) {
      setMembers(members.filter(m => m.id !== id));
      // Clear errors for removed member
      if (errors.members?.[id]) {
        const newErrors = { ...errors };
        if (newErrors.members) {
          delete newErrors.members[id];
        }
        setErrors(newErrors);
      }
    }
  };

  const handleSetLeader = (id: number) => {
    setMembers(members.map(m => ({
      ...m,
      isLeader: m.id === id,
    })));
  };

  const handleMemberChange = (id: number, field: keyof Omit<Member, 'id' | 'isLeader'>, value: string) => {
    setMembers(members.map(m =>
      m.id === id ? { ...m, [field]: value } : m
    ));
    // Clear error for this field when user starts typing
    if (errors.members?.[id]?.[field]) {
      const newErrors = { ...errors };
      if (newErrors.members) {
        delete newErrors.members[id][field];
        if (Object.keys(newErrors.members[id]).length === 0) {
          delete newErrors.members[id];
        }
      }
      setErrors(newErrors);
    }
  };

  const validateForm = () => {
    const newErrors: {
      block?: string;
      members?: { [key: number]: { name?: string; studentNumber?: string; email?: string } };
    } = {};

    // Validate block selection
    if (!selectedBlock) {
      newErrors.block = 'Please select a block';
    }

    // Validate members
    const memberErrors: { [key: number]: { name?: string; studentNumber?: string; email?: string } } = {};
    members.forEach(member => {
      const errors: { name?: string; studentNumber?: string; email?: string } = {};
      
      if (!member.name.trim()) {
        errors.name = 'Name is required';
      }
      
      if (!member.studentNumber.trim()) {
        errors.studentNumber = 'Student number is required';
      }
      
      if (!member.email.trim()) {
        errors.email = 'Email is required';
      } else if (!member.email.includes('@')) {
        errors.email = 'Please enter a valid email';
      }

      if (Object.keys(errors).length > 0) {
        memberErrors[member.id] = errors;
      }
    });

    if (Object.keys(memberErrors).length > 0) {
      newErrors.members = memberErrors;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlockChange = (newBlock: string) => {
    setSelectedBlock(newBlock);

    if (errors.block) {
      setErrors((prev) => ({ ...prev, block: undefined }));
    }
    
    // Clear all member selections when block changes (since students are filtered by block)
    setMembers(members.map(m => ({
      ...m,
      name: '',
      studentNumber: '',
      email: '',
    })));
  };

  const handleStudentSelect = (memberId: number, studentNumber: string) => {
    const selectedStudent = studentsWithoutGroup.find(s => s.student_number === studentNumber);
    if (selectedStudent) {
      setMembers(members.map(m =>
        m.id === memberId
          ? {
              ...m,
              name: selectedStudent.student_name,
              studentNumber: selectedStudent.student_number,
              email: selectedStudent.email,
            }
          : m
      ));
    } else {
      // Clear fields if no student selected
      setMembers(members.map(m =>
        m.id === memberId
          ? { ...m, name: '', studentNumber: '', email: '' }
          : m
      ));
    }
  };

  // Get available students (filtered by selected block and not already selected by other members)
  const getAvailableStudents = (currentMemberId: number) => {
    // Find the selected section adviser to get the section number
    const selectedSectionAdviser = sectionAdvisers.find(
      sa => sa.section_adviser_id === parseInt(selectedBlock)
    );

    // Filter students by block section if a block is selected
    let filteredStudents = studentsWithoutGroup;
    if (selectedSectionAdviser) {
      filteredStudents = studentsWithoutGroup.filter(
        s => s.section === String(selectedSectionAdviser.section)
      );
    }

    // Filter out students already selected by other members
    const selectedStudentNumbers = members
      .filter(m => m.id !== currentMemberId && m.studentNumber)
      .map(m => m.studentNumber);
    return filteredStudents.filter(s => !selectedStudentNumbers.includes(s.student_number));
  };

  const handleCreateGroup = () => {
    if (validateForm()) {
      console.log('Creating group:', { selectedBlock, members });
      onClose();
    }
    
    if (!selectedBlock || members.length < 2) {
      return;
    }

    setIsSubmitting(true);

    router.post(store.url(), {
      section_adviser_id: parseInt(selectedBlock),
      members: members.map(m => ({
        studentNumber: m.studentNumber,
        isLeader: m.isLeader,
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
    setSelectedBlock('');
    setMembers([
      { id: 1, name: '', studentNumber: '', email: '', isLeader: true },
      { id: 2, name: '', studentNumber: '', email: '', isLeader: false },
    ]);
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="!w-[900px] !max-w-[900px] h-[700px] p-0 gap-0 overflow-hidden flex flex-col">
        {/* Header */}
        <DialogHeader className="bg-[#730000] px-6 py-4 text-white flex-shrink-0 text-left space-y-1">
          <DialogTitle className="text-lg font-semibold text-white text-left">Create New Group</DialogTitle>
          <DialogDescription className="text-sm text-red-200 text-left">
            Fill in the group details and member information
          </DialogDescription>
        </DialogHeader>

        {/* Body */}
        <div className="flex-1 overflow-auto p-6 space-y-5">
          {/* Group Information */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Group Information
            </label>
            <select
              value={selectedBlock}
              onChange={(e) => handleBlockChange(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#730000]"
            >
              <option value="">Select Block...</option>
              {sectionAdvisers.map((sa) => (
                <option key={sa.section_adviser_id} value={sa.section_adviser_id}>
                  Block {sa.section}
                </option>
              ))}
            </select>
            <InputError message={errors.block} className="mt-1" />
          </div>

          {/* Members Header */}
          <div className="flex justify-between items-center">
            <span className="font-medium text-sm">Group Members ({members.length}/4)</span>
            <Button
              onClick={handleAddMember}
              disabled={members.length >= 4}
              className="bg-[#730000] text-white text-sm px-3 py-1 rounded-md hover:bg-red-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              <span>+</span>Add Member
            </Button>
          </div>

          {/* Info Note */}
          <div className="bg-yellow-100 text-yellow-800 text-xs px-4 py-2 rounded border border-yellow-200">
            Groups must have 2–4 members. Click the crown icon to set the group leader.
          </div>

          {/* Member Cards */}
          <div className="space-y-3">
            {members.map((member) => (
              <div key={member.id} className="border border-gray-300 rounded-md p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Member {member.id}</span>
                    {member.isLeader && (
                      <span className="text-xs bg-yellow-400 text-black px-2 py-[2px] rounded font-medium">
                        Leader
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSetLeader(member.id)}
                      title="Set Leader"
                      className="text-[#730000] hover:text-red-800 transition"
                    >
                      <Crown size={18} />
                    </button>
                    <button
                      onClick={() => handleRemoveMember(member.id)}
                      title="Remove"
                      disabled={members.length <= 2}
                      className="text-[#730000] hover:text-red-800 disabled:text-gray-400 disabled:cursor-not-allowed transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Name</label>
                    <select
                      value={member.studentNumber}
                      onChange={(e) => handleStudentSelect(member.id, e.target.value)}
                      disabled={!selectedBlock}
                      className={`w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#730000] ${!selectedBlock ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''}`}
                    >
                      <option value="">{selectedBlock ? 'Select Student...' : 'Select a block first...'}</option>
                      {getAvailableStudents(member.id).map((student) => (
                        <option key={student.id} value={student.student_number}>
                          {student.student_name}
                        </option>
                      ))}
                      {/* Keep current selection visible if already selected */}
                      {member.studentNumber && !getAvailableStudents(member.id).find(s => s.student_number === member.studentNumber) && (
                        <option value={member.studentNumber}>
                          {member.name}
                        </option>
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Student Number</label>
                    <Input
                      type="text"
                      placeholder="Auto-filled"
                      value={member.studentNumber}
                      readOnly
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-100 text-gray-600 cursor-not-allowed"
                    />
                    <InputError message={errors.members?.[member.id]?.studentNumber} className="mt-1" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Email</label>
                    <Input
                      type="email"
                      placeholder="Auto-filled"
                      value={member.email}
                      readOnly
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-100 text-gray-600 cursor-not-allowed"
                    />
                    <InputError message={errors.members?.[member.id]?.email} className="mt-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="p-6 border-t border-gray-200 flex-shrink-0 bg-gray-50 !flex-row !justify-end gap-3 sm:!flex-row sm:!justify-end">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="px-6 py-2 border-[#730000] text-[#730000] hover:bg-red-50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateGroup}
            disabled={isSubmitting || !selectedBlock || members.length < 2}
            className="px-6 py-2 bg-[#730000] text-white hover:bg-red-800 disabled:bg-gray-400"
          >
            {isSubmitting ? 'Creating...' : 'Create Group'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}