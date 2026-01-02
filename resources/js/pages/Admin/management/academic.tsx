import { useState } from 'react';
import ManagementLayout from '@/pages/Admin/management/index';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { academic } from '@/routes/admin/management/index';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardHeader, CardTitle, CardContent,} from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AcademicYearRangePicker from '@/components/acad-year-range-picker';
import DatePicker from '@/components/date-picker';

// Icons
import AcademicYearIcon from '@/components/Icons/academic-year-management.svg';
import SemesterIcon from '@/components/Icons/semester-config.svg';
import TimelineIcon from '@/components/Icons/system-timeline.svg';
import ProgramIcon from '@/components/Icons/program-overview.svg';
import PinIcon from '@/components/Icons/pin.svg';
import CheckIcon from '@/components/Icons/ic_check-Default.svg';
import TimerIcon from '@/components/Icons/timer.svg';
import ManagementIcon from '@/components/Icons/ic_pen-settings-Default.svg';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Academic Settings Configuration', href: academic().url },
];

// Deadline events sample data
const DEADLINE_EVENTS = [
  { id: 1, title: 'Submission Deadline', dateRange: 'October 1 – November 15' },
  { id: 2, title: 'Defense Period', dateRange: 'November 20 – December 10' },
  { id: 3, title: 'Final Approval', dateRange: 'December 15 – December 30' },
  { id: 4, title: 'Grade Submission', dateRange: 'January 5 – January 10' },
];

export default function AcademicSettings() {
  const [eventStatus, setEventStatus] = useState<'Active' | 'Past'>('Active');

  return (
    <ManagementLayout
      breadcrumbs={breadcrumbs}
      title={<div className="flex items-center gap-2 text-[#FFBD00]">
                          <img src={ManagementIcon} className="w-6 h-6" />
                          <span className="font-medium">Academic Settings Configuration</span>
                </div>
            }
      description="Configure academic year, semester parameters, and system timeline">

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 text-[#730000]">

        {/* ACADEMIC YEAR MANAGEMENT */}
        <div className="flex flex-col gap-6">
        <Card className="bg-[#FDFCF6] h-fit border border-[#73000042] shadow-[0_1px_16px_#00000040,0_1px_3px_#0000000A]">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <div className="flex items-center gap-2">
              <img src={AcademicYearIcon} className="w-6 h-6" alt="Academic year management" />
              <CardTitle>Academic Year Management</CardTitle>
            </div>
            <Button variant="primary">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.1333 2C10.485 2.00501 10.8205 2.14878 11.0667 2.4L13.6 4.93333C13.8512 5.17951 13.995 5.51497 14 5.86667V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H10.1333Z" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M11.3332 13.9998V9.33317C11.3332 9.15636 11.2629 8.98679 11.1379 8.86177C11.0129 8.73674 10.8433 8.6665 10.6665 8.6665H5.33317C5.15636 8.6665 4.98679 8.73674 4.86177 8.86177C4.73674 8.98679 4.6665 9.15636 4.6665 9.33317V13.9998" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4.6665 2V4.66667C4.6665 4.84348 4.73674 5.01305 4.86177 5.13807C4.98679 5.2631 5.15636 5.33333 5.33317 5.33333H9.99984" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Save</Button>
          </CardHeader>

          <CardContent className="grid grid-cols-2 gap-4 pb-0">
            <div>
              <label className="text-sm font-medium">Current Academic Year</label>
              <div className="bg-[#95969766] border-[0.8px] rounded-sm border-[#44444433] px-3 py-2 text-sm flex items-center justify-between">
                <span style={{ color: '#730000' }}>Academic Year 2024 – 2025</span>
                <img src={CheckIcon} className="w-5 h-5" style={{ filter: 'brightness(0) saturate(100%) invert(12%) sepia(86%) saturate(2065%) hue-rotate(335deg)' }} alt="checkmark" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Set New Academic Year</label>
              <AcademicYearRangePicker />
            </div>

            <DateField label="Start Date" />
            <DateField label="End Date" />

          </CardContent>
        </Card>

        {/* SYSTEM TIMELINE ALIGNMENT */}
        <Card className="bg-[#FDFCF6] border border-[#73000042] shadow-[0_1px_16px_#00000040,0_1px_3px_#0000000A] h-fit">
          <CardHeader className="flex flex-row items-center gap-2">
            <img src={TimelineIcon} className="w-6 h-6" alt="System timeline" />
            <CardTitle>System Timeline Alignment</CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {/* NOTICE */}
            <div className="flex items-center justify-center gap-2 rounded-md bg-[#FFFFFF] border border-[#730000] px-3 py-1.5 text-xs">
              <img src={TimerIcon} className="w-5 h-5" alt="time" />
              <span style={{ color: '#730000', fontSize: '16px' }}>Timeline must sync with the university calendar.</span>
            </div>

            {/* DEADLINE EVENT CARDS */}
            <div className="space-y-2">
              {DEADLINE_EVENTS.map((event) => (
                <Card
                  key={event.id}
                  className="relative rounded-xl overflow-hidden"
                  style={{ padding: '14px 18px 14px 22px',
                    backgroundColor:
                      eventStatus === 'Past' ? '#95969766' : '#FFBD0099',
                    border:
                      eventStatus === 'Past'
                        ? '0.5px solid #44444433'
                        : '1.5px solid #FFBD00',
                  }}
                >
                  {/* Red side accent */}
                  <div
                    className="absolute left-0 top-0 h-full w-[3px] rounded-l-md"
                    style={{ backgroundColor: '#730000' }}
                  />

                  <CardContent className="py-1.5 px-3 pl-0">
                    <p className="font-semibold text-base leading-tight" style={{ color: '#730000' }}>
                      {event.title}
                    </p>
                    <p className="text-xs flex items-center gap-1 mt-0.5 leading-tight" style={{ color: '#730000' }}>
                      <img src={PinIcon} className="w-4 h-4" alt="pin" />
                      {event.dateRange}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
        </div>

        <div className="flex flex-col gap-6">
        {/* SEMESTER CONFIGURATION */}
        <Card className="bg-[#FDFCF6] border border-[#73000042] shadow-[0_1px_16px_#00000040,0_1px_3px_#0000000A] h-fit">
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <div className="flex items-center gap-2"> 
            <img src={SemesterIcon} className="w-6 h-6" alt="Semester configuration" />
            <CardTitle>Semester Configuration</CardTitle>
            </div>
            <Button variant="primary">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.1333 2C10.485 2.00501 10.8205 2.14878 11.0667 2.4L13.6 4.93333C13.8512 5.17951 13.995 5.51497 14 5.86667V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H10.1333Z" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M11.3332 13.9998V9.33317C11.3332 9.15636 11.2629 8.98679 11.1379 8.86177C11.0129 8.73674 10.8433 8.6665 10.6665 8.6665H5.33317C5.15636 8.6665 4.98679 8.73674 4.86177 8.86177C4.73674 8.98679 4.6665 9.15636 4.6665 9.33317V13.9998" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4.6665 2V4.66667C4.6665 4.84348 4.73674 5.01305 4.86177 5.13807C4.98679 5.2631 5.15636 5.33333 5.33317 5.33333H9.99984" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Save</Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="text-sm font-medium">Active Semester</label>

            <Select defaultValue="first">
              <SelectTrigger className="w-full bg-[#F3EFD0] border-1px border-[#7300001A] text-[#730000] rounded-md">
                <SelectValue placeholder="Select Semester" />
              </SelectTrigger>
              <SelectContent className="bg-[#F3EFD0] border border-[#7300001A]">
                <SelectItem value="first" className="text-[#730000]">First Semester</SelectItem>
                <SelectItem value="second" className="text-[#730000]">Second Semester</SelectItem>
              </SelectContent>
            </Select>

            <div className="grid grid-cols-2 gap-4">
              <DateField label="Semester Start" />
              <DateField label="Semester End" />
              <DateField label="Defense Period Start" />
              <DateField label="Defense Period End" />
            </div>
          </CardContent>
        </Card>


        {/* PROGRAM OVERVIEW */}
        <Card className="bg-[#FDFCF6] border border-[#73000042] shadow-[0_1px_16px_#00000040,0_1px_3px_#0000000A] h-fit">
          <CardHeader className="flex flex-row items-center gap-2">
            <img src={ProgramIcon} className="w-6 h-6" alt="Program overview" />
            <CardTitle>Program Overview</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 pb-0">
            <label className="text-sm font-medium">Program Type</label>

            <Select defaultValue="mor">
              <SelectTrigger className="w-full bg-[#F3EFD0] border border-[#7300001A] text-[#730000] rounded-md">
                <SelectValue placeholder="Select Program Type" />
              </SelectTrigger>
              <SelectContent className="bg-[#F3EFD0] border border-[#7300001A]">
                <SelectItem value="mor" className="text-[#730000]">Methods of Research</SelectItem>
                <SelectItem value="dp" className="text-[#730000]">Design Project</SelectItem>
              </SelectContent>
            </Select>

            <label className="text-sm font-medium">Required Components</label>

            <CheckboxRow label="Title Proposal Defense" />
            <CheckboxRow label="Design Project 1 Defense" />
            <CheckboxRow label="Design Project 2 Defense" />

          </CardContent>
        </Card>
        </div>
      </div>
    </ManagementLayout>
  );
}

/* ---------- HELPERS ---------- */

function DateField({ label }: { label: string }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <DatePicker />
    </div>
  );
}

function CheckboxRow({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2">
      <Checkbox />
      <span className="text-sm">{label}</span>
    </div>
  );
}
