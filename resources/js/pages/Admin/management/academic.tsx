import ManagementLayout from '@/pages/Admin/management/index';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { academic } from '@/routes/admin/management/index';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Academic Management',
        href: academic().url,
    },
];

type AcademicPageProps = {
    active_sy: number | null;
    active_sem: number | null;
};

// HELPER: Create Valid and Scoped Range of possible s.y.
interface AcademicYear {
    value: number;
    label: string;
}

// Mampping Array for semester props
const mapSemester: Record<number, string> = {
    0: '1st Semester',
    1: '2nd Semester',
};

// Dnamic options for academic year
export function getAcademicYears(): AcademicYear[] {
    const currentYear: number = new Date().getFullYear();
    const pastRange = 2;
    const years: AcademicYear[] = [];

    // Loop from the past offset to the future offset
    for (let year = currentYear - pastRange; year <= currentYear; year++) {
        years.push({
            value: year,
            label: `${year}–${year + 1}`,
        });
    }

    return years;
}


export default function AcademicPage({ active_sy, active_sem }: AcademicPageProps) {
    const academicYears = getAcademicYears();

    return (
        <ManagementLayout 
            breadcrumbs={breadcrumbs}
            title="Academic Settings Configuration" 
            description="Configure academic year, semester parameters, and system timeline"
        >
            <div className="flex flex-1 flex-row gap-4"> 
                <div className="flex flex-1 flex-col gap-4">
                    <div className="flex-1 p-4 py-6 rounded-xl border border-sidebar-border/70">
                        {/* Academic year settings */}
                        <label className="mb-2 block text-sm font-medium text-muted-foreground">
                            Set the Active Academic Year:
                        </label>
                        <select defaultValue={active_sy ? active_sy : ""} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                            <option value="" disabled>Select an option</option>
                            {academicYears.map((year) => (
                                <option key={year.value} value={year.value}>
                                    {year.label}
                                </option>
                            ))}
                        </select>
                        <p className='pt-5 font-bold text-md text-center text-primary'>
                            Active School Year: { active_sy ? `${active_sy}–${Number(active_sy) + 1}` : 'Not yet Activated!'}
                        </p>
                    </div>
                    
                    <div className="flex-1 p-4 py-6 rounded-xl border border-sidebar-border/70">
                        {/* Semestral settings */}
                        <label className="mb-2 block text-sm font-medium text-muted-foreground">
                            Set the Active Semestral:
                        </label>
                        <select 
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            defaultValue={active_sem ? active_sem + 1 : ""} 
                        >
                            <option value="" disabled>Select an option</option>
                            <option value="1">1st Semester</option>
                            <option value="2">2nd Semester</option>
                        </select>
                        <p className='pt-5 font-bold text-md text-center text-primary'>
                            Active Semester: {active_sem ? mapSemester[active_sem] ?? `Semester ${active_sem}` : 'Not yet Activated!'}
                        </p>
                    </div>
                    
                </div>
                <div className="flex-1 overflow-hidden rounded-xl border border-sidebar-border/70">
                    <PlaceholderPattern className="size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>
        </ManagementLayout>
    );
}
