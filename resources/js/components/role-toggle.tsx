import { router } from '@inertiajs/react';
import { cn } from '@/lib/utils';

interface RoleToggleProps {
    currentRole: 'student' | 'faculty';
    studentRoute: any; // Using any since RouteDefinition isn't exported
    facultyRoute: any; // Using any since RouteDefinition isn't exported
    className?: string;
}

export default function RoleToggle({
    currentRole,
    studentRoute,
    facultyRoute,
    className
}: RoleToggleProps) {
    
    const handleRoleChange = (role: 'student' | 'faculty') => {
        const route = role === 'student' ? studentRoute : facultyRoute;
        router.visit(route.url, { method: route.method });
    };

    return (
        <div
            className={cn(
                "bg-breadcrumb flex h-[30px] items-start justify-between p-[5px] rounded-[14px] w-full sm:w-[398px]",
                className
            )}
        >
            {/* Student Option */}
            <button
                type="button"
                onClick={() => handleRoleChange('student')}
                className={cn(
                    "flex-1 h-full rounded-[10px] transition-all duration-200 font-['DM_Sans:Medium',sans-serif] font-medium text-[12px]",
                    currentRole === 'student'
                        ? "bg-primary text-white"
                        : "bg-transparent text-primary hover:bg-white hover:border hover:border-primary"
                )}
            >
                Student
            </button>

            {/* Faculty Option */}
            <button
                type="button"
                onClick={() => handleRoleChange('faculty')}
                className={cn(
                    "flex-1 h-full rounded-[10px] transition-all duration-200 font-['DM_Sans:Medium',sans-serif] font-medium text-[12px]",
                    currentRole === 'faculty'
                        ? "bg-primary text-white"
                        : "bg-transparent text-primary hover:bg-white hover:border hover:border-primary"
                )}
            >
                Faculty
            </button>
        </div>
    );
}