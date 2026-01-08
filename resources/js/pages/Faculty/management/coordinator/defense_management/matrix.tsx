import { useState } from 'react';
import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { matrix, panel_assign } from '@/routes/faculty/management/coordinator/defense_management';
import { type BreadcrumbItem } from '@/types';
import { Link, router } from '@inertiajs/react';
import { 
    Calendar as CalendarIcon, 
    Plus, 
    Download, 
    Edit2, 
    Trash2, 
    LayoutList,
    CalendarDays
} from 'lucide-react';
// Import Shared Components
import { Button } from '@/components/ui/button'; 
import { Badge } from '@/components/ui/badge';
import { SidebarInset } from '@/components/ui/sidebar';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"; 
import { DefenseCalendarWeekly, type WeeklyEventType } from '@/components/defense-calendar-weekly'; 
import { cn } from '@/lib/utils';


// ----------------------------------------------------------------------
// CUSTOM TABS COMPONENT
// ----------------------------------------------------------------------

interface TabButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isActive?: boolean;
}

const TabButton = React.forwardRef<HTMLButtonElement, TabButtonProps>(
    ({ className, isActive = false, children, ...props }, ref) => (
        <button
            ref={ref}
            className={cn(
                'h-12 px-[20px] flex flex-col justify-center items-center gap-2.5',
                'rounded-t-[10px] transition-colors',
                // Base background
                isActive
                    ? 'bg-[#9b000a] text-white' // Active: Maroon
                    : 'bg-[#800000] text-white/70 hover:bg-[#9b000a] hover:text-white', // Inactive: Darker Maroon

                className
            )}
            {...props}
        >
            <div className="flex justify-center items-center gap-2.5">
                <span className="font-medium text-[16px] leading-normal whitespace-nowrap font-dm">
                    {children}
                </span>
            </div>
        </button>
    )
);
TabButton.displayName = 'TabButton';

// ----------------------------------------------------------------------
// APP CONTENT WRAPPER
// ----------------------------------------------------------------------

interface AppContentProps extends React.ComponentProps<'div'> {
    variant?: 'header' | 'sidebar';
    title?: string;
    subtitle?: string;
    icon?: React.ReactNode;
}

export function AppContent({
    variant = 'header',
    title,
    subtitle,
    icon,
    children,
    ...props
}: AppContentProps) {
    if (variant === 'sidebar') {
        return (
            <SidebarInset>
                <div className="flex-1 p-6" style={{ backgroundColor: 'var(--primary-foreground)' }} {...props}>
                    {children}
                </div>
            </SidebarInset>
        )
    }

    return (
        <div
            className="flex h-full w-full flex-1 flex-col" style={{ backgroundColor: 'var(--primary-foreground)' }}
            {...props}
        >
            {(title || subtitle) && (
                <div className="w-full border-b border-sidebar-border">
                    <div className="mx-auto max-w-[1440px] h-[124px] flex flex-row items-center px-6 py-8">
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3">
                                {icon ? icon : <div className="w-8 h-8 rounded bg-[#800000]"></div>}
                                <h2 className="text-[30px] font-normal leading-[36px] text-[#800000] dark:text-red-400">
                                    {title}
                                </h2>
                            </div>
                            <p className="text-[18px] font-normal leading-[16px] ml-11 text-[#800000]">
                                {subtitle}
                            </p>
                        </div>
                    </div>
                </div>
            )}
            <div className="mx-auto w-full max-w-[1440px] p-6">
                {children}
            </div>
        </div>
    )
}

// ----------------------------------------------------------------------
// MOCK DATA
// ----------------------------------------------------------------------

const DEFENSES = [
    { 
        id: '1', 
        title: 'Machine Learning Approach for...', 
        block: 'BSCPE 4-3', 
        room: 'Room 315', 
        panel: 'Flores, Garcia, Mendoza', 
        date: new Date('2025-11-28T09:00:00'), 
        status: 'Scheduled',
        section: '4-3' 
    },
    { 
        id: '2', 
        title: 'IoT Based Monitoring System...', 
        block: 'BSCPE 4-3', 
        room: 'Room 315', 
        panel: 'Flores, Garcia, Mendoza', 
        date: new Date('2025-11-28T09:00:00'), 
        status: 'Scheduled',
        section: '4-3'
    },
    { 
        id: '3', 
        title: 'Automated Attendance System...', 
        block: 'BSCPE 4-3', 
        room: 'Room 315', 
        panel: 'Flores, Garcia, Mendoza', 
        date: new Date('2025-11-28T09:00:00'), 
        status: 'Completed',
        section: '4-3'
    },
    { 
        id: '4', 
        title: 'Network Security Analysis...', 
        block: 'BSCPE 4-4', 
        room: 'Room 315', 
        panel: 'Flores, Garcia, Mendoza', 
        date: new Date('2025-11-29T09:00:00'), 
        status: 'Scheduled',
        section: '4-4'
    },
    { 
        id: '5', 
        title: 'FPGA Implementation of...', 
        block: 'BSCPE 4-4', 
        room: 'Room 315', 
        panel: 'Flores, Garcia, Mendoza', 
        date: new Date('2025-11-29T09:00:00'), 
        status: 'Cancelled',
        section: '4-4'
    },
];

const CALENDAR_EVENTS: WeeklyEventType[] = DEFENSES.map(d => ({
    id: d.id,
    title: `${d.block} (${d.room})`, 
    date: d.date,
    time: d.date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    section: d.section
}));

// ----------------------------------------------------------------------
// TABLE COMPONENTS
// ----------------------------------------------------------------------

const GRID_LAYOUT = "grid grid-cols-[1.5fr_100px_100px_1.5fr_1.2fr_100px_100px] gap-4 items-center px-5 py-3";

function DefenseTableHeader() {
    return (
        <div className={`${GRID_LAYOUT} bg-[#800000] text-white text-sm font-bold rounded-t-lg`}>
            <span className="text-center">Title</span>
            <span className="text-center">Block</span>
            <span className="text-center">Room</span>
            <span className="text-center">Panel</span>
            <span className="text-center">Date & Time</span>
            <span className="text-center">Status</span>
            <span className="text-center">Action</span>
        </div>
    );
}

function DefenseTableRow({ data }: { data: any }) {
    const getStatusStyle = (status: string) => {
        switch(status) {
            case 'SCHEDULED': return 'bg-[#8EC5FF] border border-[#193CB8] text-[#193CB8] hover:bg-[#7bb9ff]';
            case 'Completed': return 'bg-green-600 border-transparent text-white';
            case 'Cancelled': return 'bg-red-500 border-transparent text-white';
            default: return 'bg-[#8EC5FF] border border-[#193CB8] text-[#193CB8] hover:bg-[#7bb9ff]';
        }
    };

    const defenseDateTime = new Date(`${data.defense_date}T${data.defense_time}`);

    return (
        <div className={`${GRID_LAYOUT} bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors`}>
            <span className="text-sm text-gray-800 font-medium truncate" title={data.project_title}>
                {data.project_title}
            </span>
            <span className="text-sm text-gray-800 text-center">
                BSCPE {data.year_level}-{data.section}
            </span>
            <span className="text-sm text-gray-800 text-center">
                {data.defense_room}
            </span>
            <span className="text-sm text-gray-800 truncate text-center" title={data.confirmed_panels || 'TBA'}>
                {data.confirmed_panels || 'TBA'}
            </span>
            <div className="flex flex-col items-center text-sm text-gray-800">
                <span>{defenseDateTime.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                <span className="text-xs text-gray-500">
                    {defenseDateTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                </span>
            </div>
            <div className="flex justify-center">
                <Badge className={`${getStatusStyle(data.status)} text-center justify-center w-full text-[10px] h-6`}>
                    {data.status}
                </Badge>
            </div>
            <div className="flex items-center justify-center gap-2">
                <Download className="h-4 w-4 cursor-pointer text-gray-600 hover:text-[#800000]" />
                <Edit2 className="h-4 w-4 cursor-pointer text-gray-600 hover:text-blue-600" />
                <Trash2 className="h-4 w-4 cursor-pointer text-gray-600 hover:text-red-600" />
            </div>
        </div>
    );
}

// ----------------------------------------------------------------------
// MOCK DATA ADD A SCHEDULE DEFENSE
// ----------------------------------------------------------------------

const dummyProjects = [
    "Machine Learning Approach",
    "IoT Based Monitoring System",
    "Automated Attendance System",
    "Network Security Analysis",
    "FPGA Implementation"
];

const dummyGroupCodes = [
    "BSCPE4-3A",
    "BSCPE4-3B",
    "BSCPE4-4A",
    "BSCPE4-4B"
];

// ----------------------------------------------------------------------
// MAIN DASHBOARD
// ----------------------------------------------------------------------

const breadcrumb: BreadcrumbItem[] = [
    {
        title: 'Matrix Management',
        href: matrix().url,
    },
];

export default function MatrixManagement({ defenseMatrices = [], availableProjects = [] }: { defenseMatrices: any[] , availableProjects: any[] }) {
    const [viewMode, setViewMode] = useState<'table' | 'calendar'>('calendar');
    const [currentDate, setCurrentDate] = useState(new Date('2025-11-28'));
    const [isModalOpen, setIsModalOpen] = useState(false);
    // ====== Modal States ======
    const [selectedProject, setSelectedProject] = useState('');
    const [selectedGroupCode, setSelectedGroupCode] = useState('');
    const [room, setRoom] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');


    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <AppLayout breadcrumbs={breadcrumb}>
            <AppContent
                variant="header"
                title="Matrix Management" 
                subtitle="Monitor all defense schedule, facilities, and equipment"
                icon={
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#800000] text-white">
                        <CalendarIcon className="h-5 w-5" />
                    </div>
                }
            >
                {/* 1. Page Tabs - UPDATED WITH TabButton */}
                <div className="flex items-end gap-1 mb-0 border-b border-[#800000]/10 pb-0">
                    <TabButton 
                        isActive={false} 
                        onClick={() => router.get(panel_assign().url)}
                    >
                        Panel Assignment
                    </TabButton>
                    <TabButton isActive={true}>
                        Matrix Management
                    </TabButton>
                </div>

                {/* Main Content Area */}
                <div className="space-y-6 pt-6">
                    
                    {/* Action Bar */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        
                        {/* 2. Standard Button Component */}
                        <Button 
                            variant="primary" 
                            onClick={openModal}
                        >
                            <Plus className="mr-2 h-4 w-4" /> 
                            Schedule a Defense
                        </Button>

                        {/* 3. Toggle Group */}
                        <ToggleGroup 
                            type="single" 
                            value={viewMode} 
                            onValueChange={(value) => { if(value) setViewMode(value as 'table' | 'calendar') }}
                            className="bg-[#F3E5CA] rounded-xl p-1 gap-1 w-auto whitespace-nowrap"
                        >
                            <ToggleGroupItem 
                                value="table" 
                                className="data-[state=on]:bg-[#800000] data-[state=on]:text-white text-[#800000] hover:bg-[#800000]/10 hover:text-[#800000] h-8 px-3 text-xs font-bold"
                            >
                                <LayoutList className="mr-2 h-3 w-3" /> 
                                Table View
                            </ToggleGroupItem>
                            <ToggleGroupItem 
                                value="calendar" 
                                className="data-[state=on]:bg-[#800000] data-[state=on]:text-white text-[#800000] hover:bg-[#800000]/10 hover:text-[#800000] h-8 px-3 text-xs font-bold"
                            >
                                <CalendarDays className="mr-2 h-3 w-3" /> 
                                Calendar View
                            </ToggleGroupItem>
                        </ToggleGroup>
                    </div>

                    {/* Content Switching */}
                    <div className="min-h-[600px]">
                        {viewMode === 'calendar' ? (
                            <DefenseCalendarWeekly 
                                events={CALENDAR_EVENTS}
                                value={currentDate}
                                onChange={setCurrentDate}
                                className="shadow-sm border-sidebar-border/70"
                            />
                        ) : (
                            <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm dark:border-sidebar-border">
                                <DefenseTableHeader />
                                <div>
                                    {defenseMatrices.map(defense => (
                                        <DefenseTableRow key={defense.id} data={defense} />
                                    ))}
                                </div>
                                <div className="bg-gray-50 px-5 py-3 text-xs text-center text-gray-500 border-t border-gray-200">
                                    {defenseMatrices.length} of {defenseMatrices.length} Upcoming Defenses
                                </div>
                            </div>
                        )}
                    </div>

                </div>

            </AppContent>

                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                        <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
                            <h2 className="text-xl font-bold mb-4">Schedule a Defense</h2>

                            <div className="space-y-4">
                                {/* Project Dropdown */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Project Title
                                    </label>
                                    <select
                                        className="w-full border border-gray-300 rounded px-3 py-2"
                                        value={selectedProject}
                                        onChange={(e) => { 
                                            const projectId = e.target.value;
                                            setSelectedProject(projectId);

                                            const matchedGroup = availableProjects.find(proj => String(proj.endorsement_id) === projectId);
                                            setSelectedGroupCode(matchedGroup ? matchedGroup.group_code : '');
                                        }}
                                    >
                                        <option value="">Select Project</option>
                                        {availableProjects.map((proj: any) => (
                                            <option key={proj.endorsement_id} value={proj.endorsement_id}>
                                                {proj.project_title}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Group Code Dropdown */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Group Code
                                    </label>
                                    <select
                                        className="w-full border border-gray-300 rounded px-3 py-2"
                                        value={selectedGroupCode}
                                        onChange={(e) => { 
                                            const groupCode = e.target.value;
                                            setSelectedGroupCode(groupCode);

                                            const matchedProject = availableProjects.find(proj => proj.group_code === groupCode);
                                            setSelectedProject(matchedProject ? String(matchedProject.endorsement_id) : '');
                                        }}
                                    >
                                        <option value="">Select Group</option>
                                        {availableProjects.map((proj: any) => (
                                            <option key={proj.group_code} value={proj.group_code}>
                                                {proj.group_code}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Room, Date, Time */}
                                {/* Room, Date, Time */}
                                <input
                                    type="text"
                                    placeholder="Room"
                                    className="w-full border rounded px-3 py-2"
                                    value={room}
                                    maxLength={3}
                                    onChange={(e) => {
                                        // Only allow numbers
                                        const value = e.target.value.replace(/\D/g, '');
                                        setRoom(value);
                                    }}
                                />
                                <input
                                    type="date"
                                    className="w-full border rounded px-3 py-2"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                                <input
                                    type="time"
                                    className="w-full border rounded px-3 py-2"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-2 mt-6">
                                <Button variant="secondary" onClick={closeModal}>Cancel</Button>
                                <Button
                                    variant="primary"
                                    onClick={() => {
                                        if (!selectedProject || !selectedGroupCode || !room || !date || !time) {
                                            alert('Please fill in all fields');
                                            return;
                                        }

                                        // ✅ Send form data to Laravel
                                        router.post('/faculty/defense-management/matrix', {
                                            endorsement_id: selectedProject,
                                            group_code: selectedGroupCode,
                                            room: room,
                                            date: date,
                                            time: time,
                                        }, {
                                            onSuccess: () => {
                                                closeModal(); // close the modal
                                            },
                                            onError: (errors) => {
                                                console.error(errors);
                                            }
                                        });
                                    }}
                                >
                                    Save
                                </Button>

                            </div>
                        </div>
                    </div>
                )}

        </AppLayout>

    );




}