import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Check, AlertCircle } from 'lucide-react';
import { Student } from './student_interface';
import { studentData, thesisTitles } from './student_sampleData';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
}

// Confirmation Popup Component
function ConfirmationPopup({ 
  isOpen, 
  onClose, 
  onConfirm 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
      <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4 shadow-xl">
        <div className="flex flex-col items-center text-center">
          {/* Warning Icon */}
          <div className="w-16 h-16 flex items-center justify-center mb-4">
            <AlertCircle size={60} className="text-primary" />
          </div>
          
          {/* Confirmation Message */}
          <p className="text-gray-800 text-base mb-2 font-medium">
            Are you sure you want to archive this user?
          </p>

          {/* Action Buttons */}
          <div className="flex gap-3 w-full">
            <Button 
              onClick={onClose}
              variant="outline"
              className="flex-1 px-6 py-2 rounded-full border-2 border-gray-800 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button 
              onClick={onConfirm}
              className="flex-1 px-6 py-2 rounded-full bg-primary hover:bg-red-700 text-white"
            >
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Success Popup Component
function SuccessPopup({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
      <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4 shadow-xl">
        <div className="flex flex-col items-center text-center">
          {/* Success Icon */}
          <div className="w-16 h-16 rounded-full bg-alert-success flex items-center justify-center mb-4">
            <Check size={32} className="text-white" strokeWidth={3} />
          </div>
          
          {/* Success Message */}
          <p className="text-gray-800 text-base mb-6">
            Student user added to archive successfully.
          </p>
          
          {/* Done Button */}
          <Button 
            onClick={onClose}
            variant="outline"
            className="px-8 py-2 rounded-full border-2 border-gray-800 hover:bg-gray-100"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}

export function StudentProfileModal({ isOpen, onClose, student }: StudentProfileModalProps) {
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const [showArchiveSuccess, setShowArchiveSuccess] = useState(false);

  if (!isOpen || !student) return null;

  // Get co-researchers (other members of the same group)
  const coResearchers = studentData
    .filter(s => s.groupCode === student.groupCode && s.studentNumber !== student.studentNumber)
    .map(s => s.name);

  // Get thesis title of the group
  const thesisTitle = thesisTitles[student.groupCode] || "Research Project in Computer Engineering";

  const handleArchiveClick = () => {
    setShowArchiveConfirm(true);
  };

  const handleArchiveConfirm = () => {
    setShowArchiveConfirm(false);
    console.log("Archive student:", student.studentNumber);
    setShowArchiveSuccess(true);
  };

  const handleArchiveSuccessClose = () => {
    setShowArchiveSuccess(false);
    onClose();
  };

  return (
    <>
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
            <h2 className="text-white text-2xl font-bold">Student Profile</h2>
            <Button variant="link" onClick={onClose} className="absolute top-6 right-6 text-white hover:text-gray-200 transition-colors">
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
              <Button onClick={handleArchiveClick}> Archive User </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Archive Confirmation Popup */}
      <ConfirmationPopup 
        isOpen={showArchiveConfirm}
        onClose={() => setShowArchiveConfirm(false)}
        onConfirm={handleArchiveConfirm}
      />

      {/* Archive Success Popup */}
      <SuccessPopup 
        isOpen={showArchiveSuccess}
        onClose={handleArchiveSuccessClose}
      />
    </>
  );
}