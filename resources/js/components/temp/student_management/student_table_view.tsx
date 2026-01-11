import { Button } from '@/components/ui/button';
import { Student } from './student_interface';

interface StudentTableViewProps {
  students: Student[];
  onViewStudent: (student: Student) => void;
}

export function StudentTableView({ students, onViewStudent }: StudentTableViewProps) {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[1360px]">
        {/* Table Header*/}
        <div className="grid grid-cols-8 h-10 rounded-t-lg bg-primary transition-colors duration-200 hover:bg-destructive-foreground">
          <div className="flex items-center justify-center p-2.5">
            <span className="text-white text-center font-sans text-[13.33px] font-medium">
              Student ID
            </span>
          </div>
          <div className="flex items-center justify-center p-2.5">
            <span className="text-white text-center font-sans text-[13.33px] font-medium">
              Student Name
            </span>
          </div>
          <div className="flex items-center justify-center p-2.5">
            <span className="text-white text-center font-sans text-[13.33px] font-medium">
              PUP Webmail
            </span>
          </div>
          <div className="flex items-center justify-center p-2.5">
            <span className="text-white text-center font-sans text-[13.33px] font-medium">
              Group Code
            </span>
          </div>
          <div className="flex items-center justify-center p-2.5">
            <span className="text-white text-center font-sans text-[13.33px] font-medium">
              Block
            </span>
          </div>
          <div className="flex items-center justify-center p-2.5">
            <span className="text-white text-center font-sans text-[13.33px] font-medium">
              Specialization
            </span>
          </div>
          <div className="flex items-center justify-center p-2.5">
            <span className="text-white text-center font-sans text-[13.33px] font-medium">
              Thesis Adviser
            </span>
          </div>
          <div className="flex items-center justify-center p-2.5">
            <span className="text-white text-center font-sans text-[13.33px] font-medium">
              Action
            </span>
          </div>
        </div>

        {/* Table Rows */}
        {students.length > 0 ? (
          students.map((student, index) => (
            <div
              key={`${student.studentNumber}-${index}`}
              className="grid grid-cols-8 min-h-10 bg-white border-b border-gray-100 hover:bg-breadcrumb transition-colors"
            >
              {/* Student ID */}
              <div className="flex items-center justify-center p-2.5">
                <span className="text-black text-center text-[13.33px] font-medium">
                  {student.studentNumber}
                </span>
              </div>

              {/* Student Name */}
              <div className="flex items-center justify-center p-2.5">
                <span className="text-center text-[13.33px] font-medium">
                  {student.name}
                </span>
              </div>

              {/* PUP Webmail */}
              <div className="flex items-center justify-center p-2.5">
                <p className="text-center text-[13.33px] font-medium truncate leading-tight">
                  {student.email}
                </p>
              </div>

              {/* Group Code */}
              <div className="flex items-center justify-center p-2.5">
                <span className="text-sm">
                  {student.groupCode}
                </span>
              </div>

              {/* Block */}
              <div className="flex items-center justify-center p-2.5">
                <span className="text-black text-center font-sans text-[13.33px] font-medium">
                  BSCPE {student.yearLevel}-{student.block}
                </span>
              </div>

              {/* Specialization */}
              <div className="flex items-center justify-center p-2.5">
                <span className="text-center text-[13.33px] font-medium">
                  {student.specialization}
                </span>
              </div>

              {/* Thesis Adviser */}
              <div className="flex items-center justify-center p-2.5">
                <span className="text-center text-[13.33px] font-medium">
                  {student.adviser}
                </span>
              </div>

              {/* Action */}
              <div className="flex items-center justify-center p-2.5">
                <Button 
                  variant="outline" 
                  className='border-primary text-primary'
                  onClick={() => onViewStudent(student)}
                >
                  View
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 bg-white">
            <p className="text-gray-500 font-['DM_Sans']">
              No students found matching your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}