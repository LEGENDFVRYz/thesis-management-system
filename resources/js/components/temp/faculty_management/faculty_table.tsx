//UPDATE: Used existing table component
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Faculty } from './faculty_types';

interface FacultyTableProps {
  data: Faculty[];
  onViewEdit: (faculty: Faculty) => void;
}

export function FacultyTable({ data, onViewEdit }: FacultyTableProps) {
  return (
    <div className="bg-white rounded-lg">
      <Table>
        <TableHeader>
          <TableRow className="bg-primary hover:bg-primary">
            <TableHead className="text-white text-center text-[13.33px] font-medium rounded-tl-lg">
              Faculty ID
            </TableHead>
            <TableHead className="text-white text-center text-[13.33px] font-medium">
              Faculty Name
            </TableHead>
            <TableHead className="text-white text-center text-[13.33px] font-medium">
              PUP Webmail
            </TableHead>
            <TableHead className="text-white text-center text-[13.33px] font-medium">
              Role(s)
            </TableHead>
            <TableHead className="text-white text-center text-[13.33px] font-medium">
              Faculty Type
            </TableHead>
            <TableHead className="text-white text-center text-[13.33px] font-medium">
              Date Added
            </TableHead>
            <TableHead className="text-white text-center text-[13.33px] font-medium rounded-tr-lg">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((faculty) => (
              <TableRow key={faculty.id} className="hover:bg-breadcrumb">
                {/* Faculty ID */}
                <TableCell className="text-center text-[13.33px] font-medium">
                  {faculty.id}
                </TableCell>

                {/* Faculty Name */}
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    {faculty.hasPhoto ? (
                      <img
                        src=""
                        alt=""
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#ECECF0]">
                        <span className="text-black font-arimo text-sm">
                          {faculty.initials}
                        </span>
                      </div>
                    )}
                    <span className="text-[13.33px] font-medium">
                      {faculty.name}
                    </span>
                  </div>
                </TableCell>

                {/* Email */}
                <TableCell className="text-center text-[13.33px] font-medium">
                  {faculty.email}
                </TableCell>

                {/* Roles */}
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1 flex-wrap">
                    {faculty.roles.map((role, idx) => (
                      <span
                        key={idx}
                        className={`px-1.5 py-0.5 rounded-lg text-sm ${
                          role === "Thesis Coordinator"
                            ? "bg-primary text-primary-foreground-2"
                            : role === "Thesis Adviser"
                            ? "bg-primary-foreground-2 text-primary"
                            : "bg-breadcrumb text-primary"
                        }`}
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </TableCell>

                {/* Faculty Type */}
                <TableCell
                  className={`text-center font-sans text-[13.33px] font-medium ${
                    faculty.type === "External (Non-Faculty)"
                      ? "text-primary"
                      : "text-black"
                  }`}
                >
                  {faculty.type}
                </TableCell>

                {/* Date Added */}
                <TableCell className="text-center text-[13.33px] font-medium">
                  {faculty.dateAdded}
                </TableCell>

                {/* Action */}
                <TableCell className="text-center">
                  <Button 
                    variant="outline" 
                    className="border-primary text-primary"
                    onClick={() => onViewEdit(faculty)}
                  >
                    View & Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-12">
                <p className="text-gray-500">
                  No faculty members found matching your search.
                </p>
              </TableCell>
            </TableRow>
          )}
        </TableBody>  
      </Table>
    </div>
  );
}