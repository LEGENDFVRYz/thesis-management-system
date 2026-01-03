import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { GroupData } from './student_interface';
import { studentData } from './student_sampleData';

interface GroupProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: GroupData | null;
}

export function GroupProfileModal({ isOpen, onClose, group }: GroupProfileModalProps) {
  if (!isOpen || !group) return null;

  // Get full member details
  const memberDetails = studentData.filter(s => s.groupCode === group.groupCode);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-150 max-w-[900px] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-primary rounded-t-lg p-6 relative">
          <h2 className="text-white text-2xl font-bold">Group Profile</h2>
          <Button variant="link"
            onClick={onClose} 
            className="absolute top-6 right-6 text-white hover:text-gray-200 hover:bg-primary-foreground/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Group Header Section */}
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-primary text-[40px] font-bold">
              Group {group.groupCode}
            </h3>
          </div>
          
          <p className="text-gray-600 text-base mb-6">
            {group.block} | {group.specialization}
          </p>

          <div className="border-t border-gray-200 my-6" />

          {/* Thesis Information */}
          <div className="mb-8">
            <h4 className="text-primary text-xl font-bold mb-4">THESIS INFORMATION</h4>
            
            {/* Thesis Title*/}
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-1">
                <p className="text-gray-600 text-sm mb-1">Thesis Title</p>
                <p className="text-gray-900 font-medium">{group.thesisTitle}</p>
              </div>
            </div>

            {/* Group Members*/}
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-1">
                <p className="text-gray-600 text-sm mb-1">Group Members</p>
                <p className="text-gray-900 font-medium">{group.members.join(", ")}</p>
              </div>
            </div>

            {/* Thesis Adviser with Icon */}
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <p className="text-gray-600 text-sm mb-1">Thesis Adviser</p>
                <p className="text-gray-900 font-medium">{group.adviser}</p>
              </div>
            </div>
          </div>

          {/* Proponents Information */}
          <div className="mb-8">
            <h4 className="text-primary text-xl font-bold mb-4">PROPONENTS INFORMATION</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {memberDetails.map((member, index) => (
                <div key={member.studentNumber} className="space-y-2">
                  <p className="text-gray-500 text-sm font-medium">Member {index + 1}:</p>
                  <p className="text-gray-900 font-semibold">{member.name}</p>
                  <p className="text-gray-700 text-sm">{member.studentNumber}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}