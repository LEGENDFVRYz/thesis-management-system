import { useState } from 'react';
import { Trash2, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

interface Member {
  id: number;
  name: string;
  studentNumber: string;
  email: string;
  isLeader: boolean;
}

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateGroupModal({ isOpen, onClose }: CreateGroupModalProps) {
  const [selectedBlock, setSelectedBlock] = useState('');
  const [members, setMembers] = useState<Member[]>([
    { id: 1, name: '', studentNumber: '', email: '', isLeader: true },
    { id: 2, name: '', studentNumber: '', email: '', isLeader: false },
  ]);

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
  };

  const handleCreateGroup = () => {
    console.log('Creating group:', { selectedBlock, members });
    onClose();
  };

  const handleCancel = () => {
    setSelectedBlock('');
    setMembers([
      { id: 1, name: '', studentNumber: '', email: '', isLeader: true },
      { id: 2, name: '', studentNumber: '', email: '', isLeader: false },
    ]);
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
              onChange={(e) => setSelectedBlock(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#730000]"
            >
              <option value="">Select Block...</option>
              <option value="block-a">Block A</option>
              <option value="block-b">Block B</option>
              <option value="block-c">Block C</option>
            </select>
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
                    <input
                      type="text"
                      placeholder="Enter Name"
                      value={member.name}
                      onChange={(e) => handleMemberChange(member.id, 'name', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#730000]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Student Number</label>
                    <input
                      type="text"
                      placeholder="Enter Student Number"
                      value={member.studentNumber}
                      onChange={(e) => handleMemberChange(member.id, 'studentNumber', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#730000]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Email</label>
                    <input
                      type="email"
                      placeholder="Enter PUP Webmail"
                      value={member.email}
                      onChange={(e) => handleMemberChange(member.id, 'email', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#730000]"
                    />
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
            className="px-6 py-2 bg-[#730000] text-white hover:bg-red-800"
          >
            Create Group
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}