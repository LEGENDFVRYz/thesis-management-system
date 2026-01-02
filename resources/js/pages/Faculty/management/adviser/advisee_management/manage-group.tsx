import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {Dialog,DialogContent,DialogHeader,DialogTitle,DialogDescription,DialogFooter,} from '@/components/ui/dialog';

import InputError from '@/components/input-error';

interface Member {
  id: number;
  name: string;
  studentNumber: string;
  initials: string;
}

interface ManageGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupData?: {
    members: Member[];
  };
}

export default function ManageGroupModal({ isOpen, onClose, groupData }: ManageGroupModalProps) {
  const [members] = useState<Member[]>(
    groupData?.members || [
      { id: 1, name: 'Juan Dela Cruz', studentNumber: '2022-09265-MN-0', initials: 'JDC' },
      { id: 2, name: 'John Doe', studentNumber: '2022-09265-MN-0', initials: 'JD' },
      { id: 3, name: '', studentNumber: '2022-09265-MN-0', initials: 'PK' },
    ]
  );

  const [selectedAction, setSelectedAction] = useState<'add' | 'remove' | 'replace'>('add');
  const [selectedMember, setSelectedMember] = useState('');
  const [newMemberName, setNewMemberName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');
  const [errors, setErrors] = useState<{
    selectedMember?: string;
    newMemberName?: string;
    studentId?: string;
    email?: string;
    reason?: string;
  }>({});

  const validateForm = () => {
    const newErrors: {
      selectedMember?: string;
      newMemberName?: string;
      studentId?: string;
      email?: string;
      reason?: string;
    } = {};

    if (selectedAction === 'add') {
      if (!newMemberName.trim()) {
        newErrors.newMemberName = 'Name is required';
      }
      if (!studentId.trim()) {
        newErrors.studentId = 'Student ID is required';
      }
      if (!email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!email.includes('@')) {
        newErrors.email = 'Please enter a valid email';
      }
      if (!reason.trim()) {
        newErrors.reason = 'Reason is required';
      }
    } else if (selectedAction === 'remove') {
      if (!selectedMember) {
        newErrors.selectedMember = 'Please select a member';
      }
      if (!reason.trim()) {
        newErrors.reason = 'Reason is required';
      }
    } else if (selectedAction === 'replace') {
      if (!selectedMember) {
        newErrors.selectedMember = 'Please select a member';
      }
      if (!newMemberName.trim()) {
        newErrors.newMemberName = 'Name is required';
      }
      if (!studentId.trim()) {
        newErrors.studentId = 'Student ID is required';
      }
      if (!email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!email.includes('@')) {
        newErrors.email = 'Please enter a valid email';
      }
      if (!reason.trim()) {
        newErrors.reason = 'Reason is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = () => {
    if (validateForm()) {
      console.log('Updating group:', {
        action: selectedAction,
        selectedMember,
        newMemberName,
        studentId,
        email,
        reason,
      });
      onClose();
    }
  };

  const handleCancel = () => {
    setSelectedMember('');
    setNewMemberName('');
    setStudentId('');
    setEmail('');
    setReason('');
    setSelectedAction('add');
    setErrors({});
    onClose();
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
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    New Member Name*
                  </label>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={newMemberName}
                    onChange={(e) => {
                      setNewMemberName(e.target.value);
                      if (errors.newMemberName) {
                        setErrors({ ...errors, newMemberName: undefined });
                      }
                    }}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#730000]"
                  />
                  <InputError message={errors.newMemberName} className="mt-1" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Student ID*
                  </label>
                  <input
                    type="text"
                    placeholder="2022-09786-MN-0"
                    value={studentId}
                    onChange={(e) => {
                      setStudentId(e.target.value);
                      if (errors.studentId) {
                        setErrors({ ...errors, studentId: undefined });
                      }
                    }}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#730000]"
                  />
                  <InputError message={errors.studentId} className="mt-1" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Email*
                  </label>
                  <input
                    type="email"
                    placeholder="jdc@iskolarngbayan.pup.edu.ph"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) {
                        setErrors({ ...errors, email: undefined });
                      }
                    }}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#730000]"
                  />
                  <InputError message={errors.email} className="mt-1" />
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
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#730000] resize-none"
                  />
                  <InputError message={errors.reason} className="mt-1" />
                </div>
              </>
            )}

            {/* Remove Member Form */}
            {selectedAction === 'remove' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Select Member*
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
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#730000] resize-none"
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
                    Select Member*
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
                    New Member Name*
                  </label>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={newMemberName}
                    onChange={(e) => {
                      setNewMemberName(e.target.value);
                      if (errors.newMemberName) {
                        setErrors({ ...errors, newMemberName: undefined });
                      }
                    }}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#730000]"
                  />
                  <InputError message={errors.newMemberName} className="mt-1" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Student ID*
                  </label>
                  <input
                    type="text"
                    placeholder="2022-09786-MN-0"
                    value={studentId}
                    onChange={(e) => {
                      setStudentId(e.target.value);
                      if (errors.studentId) {
                        setErrors({ ...errors, studentId: undefined });
                      }
                    }}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#730000]"
                  />
                  <InputError message={errors.studentId} className="mt-1" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Email*
                  </label>
                  <input
                    type="email"
                    placeholder="jdc@iskolarngbayan.pup.edu.ph"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) {
                        setErrors({ ...errors, email: undefined });
                      }
                    }}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#730000]"
                  />
                  <InputError message={errors.email} className="mt-1" />
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
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#730000] resize-none"
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
            className="px-6 py-2 border-[#730000] text-[#730000] hover:bg-red-50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            className="px-6 py-2 bg-[#730000] text-white hover:bg-red-800"
          >
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}