import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Student } from './student_interface';

interface StudentTableViewProps {
  students: Student[];
  onViewStudent: (student: Student) => void;
}

export function StudentTableView({ students, onViewStudent }: StudentTableViewProps) {
  return (
    <div className="bg-white rounded-lg">
      <Table>
        <TableHeader>
          <TableRow className="bg-primary hover:bg-primary">
            <TableHead className="text-white text-center text-[13.33px] font-medium rounded-tl-lg">
              Student ID
            </TableHead>
            <TableHead className="text-white text-center text-[13.33px] font-medium">
              Student Name
            </TableHead>
            <TableHead className="text-white text-center text-[13.33px] font-medium">
              PUP Webmail
            </TableHead>
            <TableHead className="text-white text-center text-[13.33px] font-medium">
              Group Code
            </TableHead>
            <TableHead className="text-white text-center text-[13.33px] font-medium">
              Block
            </TableHead>
            <TableHead className="text-white text-center text-[13.33px] font-medium">
              Specialization
            </TableHead>
            <TableHead className="text-white text-center text-[13.33px] font-medium">
              Thesis Adviser
            </TableHead>
            <TableHead className="text-white text-center text-[13.33px] font-medium rounded-tr-lg">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.length > 0 ? (
            students.map((student, index) => (
              <TableRow key={`${student.studentNumber}-${index}`} className="hover:bg-breadcrumb">
                {/* Student ID */}
                <TableCell className="text-center text-[13.33px] font-medium">
                  {student.studentNumber}
                </TableCell>

                {/* Student Name */}
                <TableCell className="text-center text-[13.33px] font-medium">
                  {student.name}
                </TableCell>

                {/* PUP Webmail */}
                <TableCell className="text-center text-[13.33px] font-medium">
                  {student.email}
                </TableCell>

                {/* Group Code */}
                <TableCell className="text-center text-[13.33px] font-medium">
                  {student.groupCode}
                </TableCell>

                {/* Block */}
                <TableCell className="text-center text-[13.33px] font-medium">
                  BSCPE {student.yearLevel}-{student.block}
                </TableCell>

                {/* Specialization */}
                <TableCell className="text-center text-[13.33px] font-medium">
                  {student.specialization}
                </TableCell>

                {/* Thesis Adviser */}
                <TableCell className="text-center text-[13.33px] font-medium">
                  {student.adviser}
                </TableCell>

                {/* Action */}
                <TableCell className="text-center">
                  <Button 
                    variant="outline" 
                    className="border-primary text-primary"
                    onClick={() => onViewStudent(student)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-12">
                <p className="text-gray-500">
                  No students found matching your search.
                </p>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}