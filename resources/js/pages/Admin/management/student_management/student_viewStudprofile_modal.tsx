import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Student } from './student_interface';
import { studentData, thesisTitles } from './student_sampleData';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
}

export function StudentProfileModal({ isOpen, onClose, student }: StudentProfileModalProps) {
  if (!isOpen || !student) return null;

  // Get co-researchers (other members of the same group)
  const coResearchers = studentData
    .filter(s => s.groupCode === student.groupCode && s.studentNumber !== student.studentNumber)
    .map(s => s.name);

  // Get thesis title of the group
  const thesisTitle = thesisTitles[student.groupCode] || "Research Project in Computer Engineering";

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-140 max-w-[900px] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-primary rounded-t-lg p-6 relative">
          <h2 className="text-white text-3xl font-bold">Student Profile</h2>
          <Button onClick={onClose} className="absolute top-6 right-6 text-white hover:text-gray-200 transition-colors">
            <X> </X>
          </Button>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Profile Section */}
          <div className="flex items-start gap-6 mb-8">
            {/* Name and Group */}
            <div className="flex-1">
              <h3 className="text-primary text-[40px] font-bold uppercase mb-2">
                {student.name}
              </h3>
              <div className="inline-block bg-primary-foreground-2 text-primary px-4 py-1 rounded-full text-sm font-medium">
                Group {student.groupCode}
              </div>
            </div>
          </div>

          {/* Student Information */}
          <div className="mb-8">
            <h4 className="text-primary text-xl font-bold mb-4">STUDENT INFORMATION</h4>
            
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              {/* Student ID */}
              <div>
                <p className="text-gray-600 text-sm mb-1">Student ID</p>
                <p className="text-gray-900 font-medium">{student.studentNumber}</p>
              </div>

              {/* PUP Webmail */}
              <div>
                <p className="text-gray-600 text-sm mb-1">PUP Webmail</p>
                <p className="text-gray-900 font-medium break-all">{student.email}</p>
              </div>

              {/* Block */}
              <div>
                <p className="text-gray-600 text-sm mb-1">Block</p>
                <p className="text-gray-900 font-medium">{student.block}</p>
              </div>

              {/* Specialization */}
              <div>
                <p className="text-gray-600 text-sm mb-1">Specialization</p>
                <p className="text-gray-900 font-medium">{student.specialization}</p>
              </div>
            </div>
          </div>

          {/* Thesis Information */}
          <div className="mb-8">
            <h4 className="text-primary text-xl font-bold mb-4">THESIS INFORMATION</h4>
            
            {/* Thesis Title */}
            <div className="mb-4">
              <p className="text-gray-600 text-sm mb-1">Thesis Title</p>
              <p className="text-gray-900 font-medium">
                {thesisTitle}
              </p>
            </div>

            {/* Co-researchers */}
            <div className="mb-4">
              <p className="text-gray-600 text-sm mb-2">Co-researchers</p>
              <div className="flex flex-wrap gap-2">
                {coResearchers.length > 0 ? (
                  coResearchers.map((researcher, index) => (
                    <span 
                      key={index}
                      className="inline-block border border-gray-300 rounded-full px-3 py-1 text-sm text-gray-700"
                    >
                      {researcher}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-gray-500">No co-researchers</span>
                )}
              </div>
            </div>

            {/* Thesis Adviser */}
            <div>
              <p className="text-gray-600 text-sm mb-1">Thesis Adviser</p>
              <p className="text-gray-900 font-medium">{student.adviser}</p>
            </div>
          </div>

          {/* Archive Button */}
          <div className="flex justify-end">
            <Button> Archive User </Button>
          </div>
        </div>
      </div>
    </div>
  );
}