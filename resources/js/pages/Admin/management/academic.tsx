import ManagementLayout from '@/pages/Admin/management/index';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { academic } from '@/routes/admin/management/index';
import { update } from '@/routes/admin/management/academic';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/date-picker';
import { formatLocal } from '@/lib/utils';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Academic Management',
        href: academic().url,
    },
];

type SchoolYearItem = {
    start: string | null;
    end: string | null;
    semesters: Record<
        number, {
            start: string | null;
            end: string | null;
        }
    >;
};

type AcademicPageProps = {
    active_sy: number | null;
    active_sem: number | null;
    school_year: Record<number, SchoolYearItem>;
};

// HELPER: Create Valid and Scoped Range of possible s.y.
type AcademicYearForm = {
    year: number | null;
    start_date: string | null;
    end_date: string | null;
};

// Mampping Array for semester props
const mapSemester: Record<number, string> = {
    0: '1st Semester',
    1: '2nd Semester',
};


export default function AcademicPage({ active_sy , school_year, active_sem }: AcademicPageProps) {
    const [acadDate, setAcadDate] = useState<{
        start: Date | null; end: Date | null;
    }>({
        start: active_sy ? new Date(school_year[active_sy].start!) : null,
        end: active_sy ? new Date(school_year[active_sy].end!) : null,
    });

    const [selectedSy, setSelectedSy] = useState<number | null>(active_sy);

    // HELPER: change the datepicker value default dependent on the selected year
    const handleSyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newYearId = Number(e.target.value);
        setSelectedSy(newYearId);

        const selectedRecord = school_year[newYearId];
        if (selectedRecord) {
            const start = selectedRecord.start ? new Date(selectedRecord.start) : null;
            const end = selectedRecord.end ? new Date(selectedRecord.end) : null;

            setAcadDate({ start, end });
        }
    };

    // FORM HANDLER
    const { data, setData, put, processing, errors } = useForm<AcademicYearForm>({
        year: active_sy,
        start_date: acadDate.start ? formatLocal(acadDate.start) : null,
        end_date: acadDate.end ? formatLocal(acadDate.end) : null,
    });
    

    return (
        <ManagementLayout 
            breadcrumbs={breadcrumbs}
            title="Academic Settings Configuration" 
            description="Configure academic year, semester parameters, and system timeline"
        >
            <div className="flex flex-1 flex-row gap-4"> 
                <div className="flex flex-1 flex-col gap-4">
                    <div className="flex flex-1 flex-col p-4 py-6 rounded-xl border border-sidebar-border/70 gap-5">
                        {/* Academic year settings */}
                        <div className='flex flex-1 justify-between align-middle'>
                            <h1>Academic Year Management</h1>
                            <button 
                                disabled={processing}
                                onClick={() =>
                                    put(update().url, {
                                        preserveScroll: true,
                                    })
                                }
                                className='bg-primary text-primary-foreground py-2 px-8 text-sm rounded-md cursor-pointer'
                            >
                                {processing ? 'Saving...' : 'Save'}
                            </button>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-muted-foreground">
                                Set the Active Academic Year:
                            </label>
                            <select 
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                value={selectedSy ?? ""}
                                onChange={handleSyChange}
                            >
                                <option value="" disabled>Select an option</option>
                                {Object.keys(school_year).map((yr) => {
                                    const year = Number(yr);

                                    // dynamic sychool year options from the backend
                                    return (
                                        <option key={year} value={year}>
                                            {year} – {year + 1}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                        
                        <div className='flex flex-row gap-5 flex-1'>
                            <div className='flex-1'>
                                <Label className="text-primary">Start Date</Label>
                                <DatePicker
                                    key={`sy-start-${selectedSy}`}  // id for changing defaults
                                    displayFormat="full"
                                    value={acadDate.start ?? undefined}
                                    placeholder="Select Start Date"
                                    onChange={(date) => {
                                        setAcadDate((prev) => ({ ...prev, start: date }));  // render feedbackl
                                        setData('start_date', formatLocal(date));           // form feedback
                                    }}
                                />
                                {errors.start_date && (
                                    <p className="text-red-500 text-xs">{errors.start_date}</p>
                                )}
                            </div>
                            <div className='flex-1'>
                                <Label className="text-primary">End Date</Label>
                                <DatePicker
                                    key={`sy-end-${selectedSy}`}    // id for changing defaults
                                    displayFormat="full"
                                    value={acadDate.end ?? undefined}
                                    placeholder="Select End Date"
                                    onChange={(date) => {
                                        setAcadDate((prev) => ({ ...prev, start: date }));  // render feedbackl
                                        setData('end_date', formatLocal(date));           // form feedback
                                    }}
                                />
                                {errors.end_date && (
                                    <p className="text-red-500 text-xs">{errors.end_date}</p>
                                )}
                            </div>
                        </div>
                        
                        <p className='pt-5 font-bold text-md text-center text-primary flex-1'>
                            Current Active School Year: { active_sy ? `${active_sy}–${Number(active_sy) + 1}` : 'Not yet Activated!'}
                        </p>
                    </div>
                    
                    <div className="flex flex-1 flex-col p-4 py-6 rounded-xl border border-sidebar-border/70 gap-5">
                        {/* Semestral settings */}
                        <div className='flex flex-1 justify-between align-middle'>
                            <h1>Semestral Management</h1>
                            <button className='bg-primary text-primary-foreground py-2 px-8 text-sm rounded-md cursor-pointer'>Save</button>
                        </div>
                        <div>
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
                        </div>


                        <div className='flex flex-row gap-5 flex-1'>
                            <div className='flex-1'>
                                <Label className="text-primary">Start Date</Label>
                                <DatePicker
                                    displayFormat="full"
                                    value={acadDate.start ?? undefined}
                                    placeholder="Select Start Date"
                                    onChange={(date) => {
                                        setAcadDate((prev) => ({ ...prev, start: date })); 
                                        console.log("Updated Acad Date:", acadDate);
                                    }}
                                />
                            </div>
                            <div className='flex-1'>
                                <Label className="text-primary">End Date</Label>
                                <DatePicker
                                    displayFormat="full"
                                    value={acadDate.end ?? undefined}
                                    placeholder="Select End Date"
                                    onChange={(date) => {
                                        setAcadDate((prev) => ({ ...prev, end: date })); 
                                        console.log("Updated Acad Date:", acadDate);
                                    }}
                                />
                            </div>
                        </div>

                        <p className='pt-5 font-bold text-md text-center text-primary flex-1'>
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
