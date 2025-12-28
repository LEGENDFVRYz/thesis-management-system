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

// PAGE PROPS
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


// FORM TYPE A:
type AcademicYearForm = {
    year: number | null;
    start_date: string | null;
    end_date: string | null;
};

// FORM TYPE B:
type SemesterForm = {
    sy_year: number | null;
    sem_index: number | null;
    start_date: string | null;
    end_date: string | null;
};

// HELPER: Mampping Array for semester props
const mapSemester: Record<number, string> = {
    0: '1st Semester',
    1: '2nd Semester',
};


export default function AcademicPage({ active_sy , school_year, active_sem }: AcademicPageProps) {
    // SHARED STATE
    const [selectedSy, setSelectedSy] = useState<number | null>(active_sy);
    const [selectedSem, setSelectedSem] = useState<number | null>(active_sem);


    // (FORM A) ACADEMIC YEAR FORM 
    const [acadDate, setAcadDate] = useState<{ start: Date | null; end: Date | null; }>({
        start: active_sy ? new Date(school_year[active_sy].start!) : null,
        end: active_sy ? new Date(school_year[active_sy].end!) : null,
    });

    const acadForm = useForm<AcademicYearForm>({
        year: active_sy,
        start_date: acadDate.start ? formatLocal(acadDate.start) : null,
        end_date: acadDate.end ? formatLocal(acadDate.end) : null,
    });

    const handleSyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        // HELPER: change the datepicker value default dependent on the selected year
        const newYearId = Number(e.target.value);
        setSelectedSy(newYearId);

        // Update the record and save it to the form
        const selectedRecord = school_year[newYearId];
        if (selectedRecord) {
            const start = selectedRecord.start ? new Date(selectedRecord.start) : null;
            const end = selectedRecord.end ? new Date(selectedRecord.end) : null;
            setAcadDate({ start, end });

            acadForm.setData({
                year: newYearId,
                start_date: start ? formatLocal(start) : null,
                end_date: end ? formatLocal(end) : null,
            });
        }

        // UPDATE SEMESTER FORM (THE FIX)
        let newSemStart: Date | null = null;
        let newSemEnd: Date | null = null;

        if (selectedRecord && selectedRecord.semesters[0]) {
            const semRecord = selectedRecord.semesters[0];
            newSemStart = semRecord.start ? new Date(semRecord.start) : null;
            newSemEnd = semRecord.end ? new Date(semRecord.end) : null;
        }

        // Update Semester Date State
        setSemDate({ start: newSemStart, end: newSemEnd });

        // Update Semester Form Data
        semForm.setData({
            sy_year: newYearId,          // <--- Important: Syncs the year
            sem_index: 0,  // <--- Defaults to 0
            start_date: newSemStart ? formatLocal(newSemStart) : null,
            end_date: newSemEnd ? formatLocal(newSemEnd) : null,
        });
    };


    // (FORM B) SEMESTER FORM 
    const [semDate, setSemDate] = useState<{ start: Date | null; end: Date | null }>({
        start: active_sy && active_sem !== null && school_year[active_sy]?.semesters[active_sem]?.start
            ? new Date(school_year[active_sy].semesters[active_sem].start!) : null,
        end: active_sy && active_sem !== null && school_year[active_sy]?.semesters[active_sem]?.end
            ? new Date(school_year[active_sy].semesters[active_sem].end!) : null,
    });

    const semForm = useForm<SemesterForm>({
        sy_year: active_sy,
        sem_index: active_sem,
        start_date: semDate.start ? formatLocal(semDate.start) : null,
        end_date: semDate.end ? formatLocal(semDate.end) : null,
    });

    const handleSemChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        // HELPER: change the datepicker value default dependent on the selected semester
        const newSemId = Number(e.target.value);
        setSelectedSem(newSemId);

        // We look up the semester based on the CURRENTLY selected School Year
        const currentYearRecord = selectedSy ? school_year[selectedSy] : null;

        if (currentYearRecord && currentYearRecord.semesters[newSemId]) {
            const semRecord = currentYearRecord.semesters[newSemId];
            const start = semRecord.start ? new Date(semRecord.start) : null;
            const end = semRecord.end ? new Date(semRecord.end) : null;

            // Update UI State
            setSemDate({ start, end });

            // Update Form Data
            semForm.setData({
                sy_year: selectedSy,
                sem_index: newSemId,
                start_date: start ? formatLocal(start) : null,
                end_date: end ? formatLocal(end) : null,
            });
        } else {
            // Reset if data missing
            setSemDate({ start: null, end: null });
            semForm.setData({
                sy_year: selectedSy,
                sem_index: newSemId,
                start_date: null,
                end_date: null
            });
        }
    };


    return (
        <ManagementLayout 
            breadcrumbs={breadcrumbs}
            title="Academic Settings Configuration" 
            description="Configure academic year, semester parameters, and system timeline"
        >
            <div className="flex flex-1 flex-row gap-4"> 
                <div className="flex flex-1 flex-col gap-4">
                    {/* Academic year settings */}
                    <div className="flex flex-1 flex-col p-4 py-6 rounded-xl border border-sidebar-border/70 gap-5">
                        <div className='flex flex-1 justify-between align-middle'>
                            <h1>Academic Year Management</h1>
                            <button 
                                disabled={acadForm.processing}
                                onClick={() => acadForm.put(update().url, { preserveScroll: true })}
                                className='bg-primary text-primary-foreground py-2 px-8 text-sm rounded-md cursor-pointer'
                            >
                                {acadForm.processing ? 'Saving...' : 'Save'}
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
                                        acadForm.setData('start_date', formatLocal(date));           // form feedback
                                    }}
                                />
                                {acadForm.errors.start_date && (
                                    <p className="text-red-500 text-xs">{acadForm.errors.start_date}</p>
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
                                        acadForm.setData('end_date', formatLocal(date));           // form feedback
                                    }}
                                />
                                {acadForm.errors.end_date && (
                                    <p className="text-red-500 text-xs">{acadForm.errors.end_date}</p>
                                )}
                            </div>
                        </div>
                        
                        <p className='pt-5 font-bold text-md text-center text-primary flex-1'>
                            Current Active School Year: { active_sy ? `${active_sy}–${Number(active_sy) + 1}` : 'Not yet Activated!'}
                        </p>
                    </div>
                    
                    {/* Semestral settings */}
                    <div className="flex flex-1 flex-col p-4 py-6 rounded-xl border border-sidebar-border/70 gap-5">
                        <div className='flex flex-1 justify-between align-middle'>
                            <h1>Semestral Management</h1>
                            <button 
                                disabled={semForm.processing}
                                onClick={() => semForm.put(update().url, { preserveScroll: true })}
                                className='bg-primary text-primary-foreground py-2 px-8 text-sm rounded-md cursor-pointer'>Save</button>
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium text-muted-foreground">
                                Set the Active Semestral:
                            </label>
                            <select 
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                value={selectedSem !== null ? selectedSem : ""} 
                                onChange={handleSemChange}
                            >
                                <option value="" disabled>Select an option</option>
                                <option value="0">1st Semester</option>
                                <option value="1">2nd Semester</option>
                            </select>
                        </div>

                        <div className='flex flex-row gap-5 flex-1'>
                            <div className='flex-1'>
                                <Label className="text-primary">Start Date</Label>
                                <DatePicker
                                    key={`sem-start-${selectedSem}`}
                                    value={semDate.start ?? undefined}
                                    displayFormat="full"
                                    placeholder="Select Start Date"
                                    onChange={(date) => {
                                        setSemDate((prev) => ({ ...prev, start: date })); 
                                        semForm.setData('start_date', formatLocal(date))
                                    }}
                                />
                                {semForm.errors.start_date && (
                                    <p className="text-red-500 text-xs">{semForm.errors.start_date}</p>
                                )}
                            </div>
                            <div className='flex-1'>
                                <Label className="text-primary">End Date</Label>
                                <DatePicker
                                    key={`sem-end-${selectedSem}`}
                                    displayFormat="full"
                                    value={semDate.end ?? undefined}
                                    placeholder="Select End Date"
                                    onChange={(date) => {
                                        setSemDate((prev) => ({ ...prev, end: date })); 
                                        semForm.setData('end_date', formatLocal(date))
                                    }}
                                />
                                {semForm.errors.end_date && (
                                    <p className="text-red-500 text-xs">{semForm.errors.end_date}</p>
                                )}
                            </div>
                        </div>

                        <p className='pt-5 font-bold text-md text-center text-primary flex-1'>
                            Active Semester: {active_sem !== null ? mapSemester[active_sem] ?? `Semester ${active_sem + 1}` : 'Not yet Activated!'}
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
