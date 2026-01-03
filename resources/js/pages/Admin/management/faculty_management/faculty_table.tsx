import { Button } from '@/components/ui/button';

interface Faculty {
  id: string;
  name: string;
  email: string;
  roles: string[];
  type: string;
  dateAdded: string;
  initials?: string;
  hasPhoto?: boolean;
}

interface FacultyTableProps {
  data: Faculty[];
  onViewEdit: (faculty: Faculty) => void;
}

export function FacultyTable({ data, onViewEdit }: FacultyTableProps) {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[1360px]">
        {/* Table Header */}
        <div className="grid grid-cols-7 h-10 rounded-t-lg bg-primary transition-colors duration-200 hover:bg-destructive-foreground">
          <div className="flex items-center justify-center p-2.5">
            <span className="text-white text-center font-sans text-[13.33px] font-medium">
              Faculty ID
            </span>
          </div>
          <div className="flex items-center justify-center p-2.5">
            <span className="text-white text-center font-sans text-[13.33px] font-medium">
              Faculty Name
            </span>
          </div>
          <div className="flex items-center justify-center p-2.5">
            <span className="text-white text-center font-sans text-[13.33px] font-medium">
              PUP Webmail
            </span>
          </div>
          <div className="flex items-center justify-center p-2.5">
            <span className="text-white text-center font-sans text-[13.33px] font-medium">
              Role(s)
            </span>
          </div>
          <div className="flex items-center justify-center p-2.5">
            <span className="text-white text-center font-sans text-[13.33px] font-medium">
              Faculty Type
            </span>
          </div>
          <div className="flex items-center justify-center p-2.5">
            <span className="text-white text-center font-sans text-[13.33px] font-medium">
              Date Added
            </span>
          </div>
          <div className="flex items-center justify-center p-2.5">
            <span className="text-white text-center font-sans text-[13.33px] font-medium">
              Action
            </span>
          </div>
        </div>

        {/* Table Rows */}
        {data.length > 0 ? (
          data.map((faculty) => (
            <div
              key={faculty.id}
              className="grid grid-cols-7 min-h-10 bg-white border-b border-gray-100 hover:bg-breadcrumb transition-colors"
            >
              {/* Faculty ID */}
              <div className="flex items-center justify-center p-2.5">
                <span className="text-black text-center text-[13.33px] font-medium">
                  {faculty.id}
                </span>
              </div>

              {/* Faculty Name */}
              <div className="flex items-center justify-center p-2.5 gap-2">
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
                <span className="text-[#0A0A0A] text-center text-[13.33px] font-medium">
                  {faculty.name}
                </span>
              </div>

              {/* Email */}
              <div className="flex items-center justify-center p-2.5">
                <span className="text-[#0A0A0A] text-center text-[13.33px] font-medium">
                  {faculty.email}
                </span>
              </div>

              {/* Roles */}
              <div className="flex items-center justify-center p-2.5 gap-1 flex-wrap">
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

              {/* Faculty Type */}
              <div className="flex items-center justify-center p-2.5">
                <span
                  className={`text-center font-sans text-[13.33px] font-medium ${
                    faculty.type === "External (Non-Faculty)"
                      ? "text-primary"
                      : "text-black"
                  }`}
                >
                  {faculty.type}
                </span>
              </div>

              {/* Date Added */}
              <div className="flex items-center justify-center p-2.5">
                <span className="text-black text-center text-[13.33px] font-medium">
                  {faculty.dateAdded}
                </span>
              </div>

              {/* Action */}
              <div className="flex items-center justify-center p-2.5">
                <Button 
                  variant="outline" 
                  className='border-primary text-primary'
                  onClick={() => onViewEdit(faculty)}
                >
                  View & Edit
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 bg-white">
            <p className="text-gray-500">
              No faculty members found matching your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}