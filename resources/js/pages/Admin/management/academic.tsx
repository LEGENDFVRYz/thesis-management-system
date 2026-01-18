import { useState } from 'react';
import ManagementLayout from '@/pages/Admin/management/index';
import { PageHeaderProps, type BreadcrumbItem } from '@/types';
import { useForm } from '@inertiajs/react';
import { academic } from '@/routes/admin/management/index';
import { update } from '@/routes/admin/management/academic';
import { formatLocal } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AcademicYearRangePicker from '@/components/acad-year-range-picker';
import DatePicker from '@/components/date-picker';
import AcademicYearIcon from '@/components/Icons/academic-year-management.svg';
import SemesterIcon from '@/components/Icons/semester-config.svg';
import CheckIcon from '@/components/Icons/ic_check-Default.svg';
import { Save } from 'lucide-react';
import { Icon } from '@/components/icon-index';

// Page Setup
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Academic Settings Configuration',
        href: academic().url,
    },
];

const pageHeader: PageHeaderProps = {
    title: "Academic Settings Configuration",
    subtitle: "Configure academic year, semester parameters, and system timeline",
    icon: (
        <Icon
            name="calendarDefault"
            className="w-8 h-8 text-primary"
        />
    ),
};

// Deadline events sample data
const DEADLINE_EVENTS = [
    { id: 1, title: 'Submission Deadline', dateRange: 'October 1 - November 15' },
    { id: 2, title: 'Defense Period', dateRange: 'November 20 - December 10' },
    { id: 3, title: 'Final Approval', dateRange: 'December 15 - December 30' },
    { id: 4, title: 'Grade Submission', dateRange: 'January 5 - January 10' },
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

    const handleSyChange = (date: Date) => {
        // Convert date to year number (due to backend requirements)
        const newYearId = date.getFullYear();
        setSelectedSy(newYearId);

        // Get selected school year record
        const selectedRecord = school_year[newYearId];
        if (selectedRecord) {
            const start = selectedRecord.start
                ? new Date(selectedRecord.start)
                : null;
            const end = selectedRecord.end
                ? new Date(selectedRecord.end)
                : null;

            setAcadDate({ start, end });

            acadForm.setData({
                year: newYearId,
                start_date: start ? formatLocal(start) : null,
                end_date: end ? formatLocal(end) : null,
            });
        }

        // UPDATE SEMESTER FORM 
        let newSemStart: Date | null = null;
        let newSemEnd: Date | null = null;

        if (selectedRecord?.semesters?.[0]) {
            const semRecord = selectedRecord.semesters[0];
            newSemStart = semRecord.start
                ? new Date(semRecord.start)
                : null;
            newSemEnd = semRecord.end
                ? new Date(semRecord.end)
                : null;
        }

        // Update Semester Date State
        setSemDate({ start: newSemStart, end: newSemEnd });

        // Update Semester Form Data
        semForm.setData({
            sy_year: newYearId,   // syncs academic year
            sem_index: 0,         // default semester
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

    const handleSemChange = (value: number) => {
        // HELPER: change the datepicker value default
        const newSemId = value;
        setSelectedSem(newSemId);

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

    // --- HELPER
    const years = Object.keys(school_year).map(Number); 
    const minYear = Math.min(...years);                 // dynamic valid range 
    const maxYear = Math.max(...years);                 // dynamic valid range 

    return (
        <ManagementLayout 
            breadcrumbs={breadcrumbs}
            pageHeader={pageHeader}
        >
            <div className="flex flex-1 h-full flex-col gap-4"> 
                <div className="flex flex-row gap-4 h-full">

                    {/* Academic year settings */}
                    <Card className="bg-[#FDFCF6] h-full border border-[#73000042] shadow-md flex-1">
                        <CardHeader className="flex flex-row items-center gap-2 pb-2">
                            <img src={AcademicYearIcon} className="w-6 h-6" alt="Academic year management" />
                            <CardTitle>Academic Year Management</CardTitle>
                        </CardHeader>

                        <CardContent className="grid grid-cols-2 gap-4">
                            {/* Current Academic Yr */}
                            <div>
                                <label className="text-sm font-medium">Current Academic Year</label>
                                <div className="bg-[#95969766] border rounded-sm border-[#44444433] px-3 py-2 text-sm flex items-center justify-between">
                                    <span className="text-[#730000] font-semibold">
                                        Academic Year { active_sy ? `${active_sy}–${Number(active_sy) + 1}` : 'not yet activated!'}
                                    </span>
                                    <img src={CheckIcon} className="w-5 h-5" 
                                    style={{ filter: "brightness(0) saturate(100%) invert(12%) sepia(86%) saturate(2065%) hue-rotate(335deg)" }} // to make it in 730000 color
                                    alt="checkmark" />
                                </div>
                            </div>
                            
                            {/* Set Academic Picker */}
                            <div>
                                <label className="text-sm font-medium">Set New Academic Year</label>
                                <AcademicYearRangePicker
                                    value={selectedSy ? new Date(selectedSy, 0, 1) : undefined}
                                    onChange={handleSyChange}
                                    range={[minYear, maxYear]}
                                />
                            </div>
                            
                            {/* DATEPICKER SECTION */}
                            <div className='flex-1'>
                                <label className="text-sm font-medium">Start Date</label>
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
                                <label className="text-sm font-medium">End Date</label>
                                <DatePicker
                                    key={`sy-end-${selectedSy}`}    // id for changing defaults
                                    displayFormat="full"
                                    value={acadDate.end ?? undefined}
                                    placeholder="Select End Date"
                                    onChange={(date) => {
                                        setAcadDate((prev) => ({ ...prev, end: date }));  // render feedbackl
                                        acadForm.setData('end_date', formatLocal(date));           // form feedback
                                    }}
                                />
                                {acadForm.errors.end_date && (
                                    <p className="text-red-500 text-xs">{acadForm.errors.end_date}</p>
                                )}
                            </div>
                            

                            <div className="col-span-2 flex justify-end gap-2 mt-2">
                                <Button 
                                    disabled={acadForm.processing}
                                    onClick={() => acadForm.put(update().url, { preserveScroll: true })}
                                    variant="primary"
                                >
                                    {/* ISSUE: WRONG ICON -- RESOLVED */}
                                     <Save className="w-4 h-4" />
                                    Save
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Semestral settings */}
                    <Card className="bg-[#FDFCF6] border border-[#73000042] shadow-md flex-1">
                        <CardHeader className="flex flex-row items-center gap-2 pb-2">
                            <img src={SemesterIcon} className="w-6 h-6" alt="Semester configuration" />
                            <CardTitle>Semester Configuration</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <label className="text-sm font-medium">Active Semester</label>

                            <Select 
                                value={selectedSem !== null ? String(selectedSem) : ""}
                                onValueChange={(value) => handleSemChange(Number(value))}
                            >
                                <SelectTrigger className="w-full bg-[#F3EFD0] border border-[#7300001A] text-[#730000] font-semibold rounded-md">
                                    <SelectValue placeholder="Select Semester" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#F3EFD0] border border-[#7300001A]">
                                    <SelectItem value="0" className="text-[#730000]">First Semester</SelectItem>
                                    <SelectItem value="1" className="text-[#730000]">Second Semester</SelectItem>
                                </SelectContent>
                            </Select>


                            {/* DATE PICKER */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className='flex-1'>
                                    <label className="text-sm font-medium">Start Date</label>
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
                                    <label className="text-sm font-medium">End Date</label>
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

                            <div className="col-span-2 flex justify-end gap-2 mt-2">
                                {/* ISSUE: WRONG ICON -- RESOLVED */}
                                <Button 
                                    variant="primary"
                                    disabled={semForm.processing}
                                    onClick={() => semForm.put(update().url, { preserveScroll: true })}
                                >
                                     <Save className="w-4 h-4" />
                                    Save
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* OTHER FEATURES HERE ARE TEMPOPRARILY REMOVED DUE TO NEW PATCH NOTES */}
            
        </ManagementLayout>
    );
}


// Chilly Past Code: Already resolve, if there is missing piece, check it here in case
//   return (
//     <ManagementLayout
//       breadcrumbs={breadcrumbs}
//       title={<div className="flex items-center gap-2 text-[#FFBD00]">
//                           <img src={ManagementIcon} className="w-6 h-6" />
//                           <span className="font-medium">Academic Settings Configuration</span>
//                 </div>
//             }
//       description="Configure academic year, semester parameters, and system timeline">

//       {/* GRID */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-3 text-[#730000]">

//         {/* ACADEMIC YEAR MANAGEMENT */}
//         <div className="flex flex-col gap-6">
//         <Card className="bg-[#FDFCF6] h-fit border border-[#73000042] shadow-[0_1px_16px_#00000040,0_1px_3px_#0000000A]">
//           <CardHeader className="flex flex-row items-center gap-2 pb-2">
//             <img src={AcademicYearIcon} className="w-6 h-6" alt="Academic year management" />
//             <CardTitle>Academic Year Management</CardTitle>
//           </CardHeader>

//           <CardContent className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="text-sm font-medium">Current Academic Year</label>
//               <div className="bg-[#95969766] border-[0.8px] rounded-sm border-[#44444433] px-3 py-2 text-sm flex items-center justify-between">
//                 <span style={{ color: '#730000' }}>Academic Year 2024 – 2025</span>
//                 <img src={CheckIcon} className="w-5 h-5" style={{ filter: 'brightness(0) saturate(100%) invert(12%) sepia(86%) saturate(2065%) hue-rotate(335deg)' }} alt="checkmark" />
//               </div>
//             </div>
//             <div>
//               <label className="text-sm font-medium">Set New Academic Year</label>
//               <AcademicYearRangePicker />
//             </div>

//             <DateField label="Start Date" />
//             <DateField label="End Date" />

//             <div className="col-span-2 flex justify-end gap-2 mt-2">
//               <Button variant="primary">
//                 <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M10.1333 2C10.485 2.00501 10.8205 2.14878 11.0667 2.4L13.6 4.93333C13.8512 5.17951 13.995 5.51497 14 5.86667V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H10.1333Z" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
//                 <path d="M11.3332 13.9998V9.33317C11.3332 9.15636 11.2629 8.98679 11.1379 8.86177C11.0129 8.73674 10.8433 8.6665 10.6665 8.6665H5.33317C5.15636 8.6665 4.98679 8.73674 4.86177 8.86177C4.73674 8.98679 4.6665 9.15636 4.6665 9.33317V13.9998" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
//                 <path d="M4.6665 2V4.66667C4.6665 4.84348 4.73674 5.01305 4.86177 5.13807C4.98679 5.2631 5.15636 5.33333 5.33317 5.33333H9.99984" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
//               </svg>
//               Save</Button>
//             </div>
//           </CardContent>
//         </Card>

//         {/* SYSTEM TIMELINE ALIGNMENT */}
//         <Card className="bg-[#FDFCF6] border border-[#73000042] shadow-[0_1px_16px_#00000040,0_1px_3px_#0000000A] h-fit">
//           <CardHeader className="flex flex-row items-center gap-2">
//             <img src={TimelineIcon} className="w-6 h-6" alt="System timeline" />
//             <CardTitle>System Timeline Alignment</CardTitle>
//           </CardHeader>

//           <CardContent className="space-y-3">
//             {/* NOTICE */}
//             <div className="flex items-center justify-center gap-2 rounded-md bg-[#FFFFFF] border border-[#730000] px-3 py-1.5 text-xs">
//               <img src={TimerIcon} className="w-5 h-5" alt="time" />
//               <span style={{ color: '#730000', fontSize: '16px' }}>Timeline must sync with the university calendar.</span>
//             </div>

//             {/* DEADLINE EVENT CARDS */}
//             <div className="space-y-2">
//               {DEADLINE_EVENTS.map((event) => (
//                 <Card
//                   key={event.id}
//                   className="relative rounded-xl overflow-hidden"
//                   style={{ padding: '14px 18px 14px 22px',
//                     backgroundColor:
//                       eventStatus === 'Past' ? '#95969766' : '#FFBD0099',
//                     border:
//                       eventStatus === 'Past'
//                         ? '0.5px solid #44444433'
//                         : '1.5px solid #FFBD00',
//                   }}
//                 >
//                   {/* Red side accent */}
//                   <div
//                     className="absolute left-0 top-0 h-full w-[3px] rounded-l-md"
//                     style={{ backgroundColor: '#730000' }}
//                   />

//                   <CardContent className="py-1.5 px-3 pl-0">
//                     <p className="font-semibold text-base leading-tight" style={{ color: '#730000' }}>
//                       {event.title}
//                     </p>
//                     <p className="text-xs flex items-center gap-1 mt-0.5 leading-tight" style={{ color: '#730000' }}>
//                       <img src={PinIcon} className="w-4 h-4" alt="pin" />
//                       {event.dateRange}
//                     </p>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>

//             {/* SYNC BUTTON */}
//             <div className="flex justify-end mt-4">
//               <Button variant="primary" className="gap-2">
//                 <RotateCw className="w-4 h-4" />
//                 Sync
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//         </div>

//         <div className="flex flex-col gap-6">
        // {/* SEMESTER CONFIGURATION */}
        // <Card className="bg-[#FDFCF6] border border-[#73000042] shadow-[0_1px_16px_#00000040,0_1px_3px_#0000000A] h-fit">
        //     <CardHeader className="flex flex-row items-center gap-2 pb-2">
        //     <img src={SemesterIcon} className="w-6 h-6" alt="Semester configuration" />
        //     <CardTitle>Semester Configuration</CardTitle>
        //   </CardHeader>
        //   <CardContent className="space-y-4">
        //     <label className="text-sm font-medium">Active Semester</label>

        //     <Select 
        //       value={semester.activeSemester} 
        //       onValueChange={(value) => setSemester({...semester, activeSemester: value})}
        //     >
        //       <SelectTrigger className="w-full bg-[#F3EFD0] border-1px border-[#7300001A] text-[#730000] rounded-md">
        //         <SelectValue placeholder="Select Semester" />
        //       </SelectTrigger>
        //       <SelectContent className="bg-[#F3EFD0] border border-[#7300001A]">
        //         <SelectItem value="first" className="text-[#730000]">First Semester</SelectItem>
        //         <SelectItem value="second" className="text-[#730000]">Second Semester</SelectItem>
        //       </SelectContent>
        //     </Select>

        //     <div className="grid grid-cols-2 gap-4">
        //       <DateField label="Semester Start" />
        //       <DateField label="Semester End" />
        //       <DateField label="Defense Period Start" />
        //       <DateField label="Defense Period End" />
        //     </div>

        //     <div className="flex justify-end gap-2 mt-2">
        //       <Button variant="primary">
        //         <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        //         <path d="M10.1333 2C10.485 2.00501 10.8205 2.14878 11.0667 2.4L13.6 4.93333C13.8512 5.17951 13.995 5.51497 14 5.86667V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H10.1333Z" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
        //         <path d="M11.3332 13.9998V9.33317C11.3332 9.15636 11.2629 8.98679 11.1379 8.86177C11.0129 8.73674 10.8433 8.6665 10.6665 8.6665H5.33317C5.15636 8.6665 4.98679 8.73674 4.86177 8.86177C4.73674 8.98679 4.6665 9.15636 4.6665 9.33317V13.9998" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
        //         <path d="M4.6665 2V4.66667C4.6665 4.84348 4.73674 5.01305 4.86177 5.13807C4.98679 5.2631 5.15636 5.33333 5.33317 5.33333H9.99984" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
        //       </svg>
        //       Save</Button>
        //     </div>
        //   </CardContent>
        // </Card>


//         {/* PROGRAM OVERVIEW */}
//         <Card className="bg-[#FDFCF6] border border-[#73000042] shadow-[0_1px_16px_#00000040,0_1px_3px_#0000000A] h-fit">
//           <CardHeader className="flex flex-row items-center gap-2 pb-2">
//             <img src={ProgramIcon} className="w-6 h-6" alt="Program overview" />
//             <CardTitle>Program Overview</CardTitle>
//           </CardHeader>

//           <CardContent className="space-y-4">
//             <label className="text-sm font-medium">Program Type</label>

//             <Select defaultValue="mor">
//               <SelectTrigger className="w-full bg-[#F3EFD0] border border-[#7300001A] text-[#730000] rounded-md">
//                 <SelectValue placeholder="Select Program Type" />
//               </SelectTrigger>
//               <SelectContent className="bg-[#F3EFD0] border border-[#7300001A]">
//                 <SelectItem value="mor" className="text-[#730000]">Methods of Research</SelectItem>
//                 <SelectItem value="dp" className="text-[#730000]">Design Project</SelectItem>
//               </SelectContent>
//             </Select>

//             <label className="text-sm font-medium">Required Components</label>

//             <CheckboxRow label="Title Proposal Defense" />
//             <CheckboxRow label="Design Project 1 Defense" />
//             <CheckboxRow label="Design Project 2 Defense" />

//             <div className="flex justify-end gap-2 mt-2">
//               <Button variant="outline">Reset</Button>
//               <Button variant="primary">
//                 <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M10.1333 2C10.485 2.00501 10.8205 2.14878 11.0667 2.4L13.6 4.93333C13.8512 5.17951 13.995 5.51497 14 5.86667V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H10.1333Z" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
//                 <path d="M11.3332 13.9998V9.33317C11.3332 9.15636 11.2629 8.98679 11.1379 8.86177C11.0129 8.73674 10.8433 8.6665 10.6665 8.6665H5.33317C5.15636 8.6665 4.98679 8.73674 4.86177 8.86177C4.73674 8.98679 4.6665 9.15636 4.6665 9.33317V13.9998" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
//                 <path d="M4.6665 2V4.66667C4.6665 4.84348 4.73674 5.01305 4.86177 5.13807C4.98679 5.2631 5.15636 5.33333 5.33317 5.33333H9.99984" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
//               </svg>
//               Save</Button>
//             </div>
//           </CardContent>
//         </Card>
//         </div>
//       </div>
//     </ManagementLayout>
//   );
// }

// /* HELPERS */
// function DateField({ label }: { label: string }) {
//     return (
//         <div>
//             <label className="text-sm font-medium">{label}</label>
//             <DatePicker />
//         </div>
//     );
// }

// function CheckboxRow({ label }: { label: string }) {
//   return (
//         <div className="flex items-center gap-2">
//             <Checkbox />
//             <span className="text-sm">{label}</span>
//         </div>
//   );
// }