import React, { useState, useMemo } from 'react';
import AppLayout from '@/layouts/app-layout';
import { index } from '@/routes/faculty/coordinator/defense_management/index';
import { router, Head } from '@inertiajs/react';
import { cva, type VariantProps } from "class-variance-authority";
import { 
    Calendar as CalendarIcon, 
    Plus, 
    LayoutList,
    CalendarDays,
    Clock,
    MapPin,
    Hash,
    Monitor,
    User,
    ChevronDown,
    Check,
    AlertCircle,
    Trash
} from 'lucide-react';

// --- UI COMPONENTS ---
import { Button } from '@/components/ui/button'; 
import { Badge } from '@/components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"; 
import { DefenseCalendarWeekly, type WeeklyEventType } from '@/components/defense-calendar-weekly'; 
import { HeaderCard } from "@/components/ui/card";
import { cn } from '@/lib/utils';
import { NavFooter } from '@/components/nav-footer'; 
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import DatePicker from "@/components/date-picker";
import TimePicker from "@/components/time-picker";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";

// --- CUSTOM ICONS IMPORT ---
import ic_eyeopen_Default from '@/components/Icons/ic_eyeopen-Default.svg';
import ic_eyeopen_Hover from '@/components/Icons/ic_eyeopen-Hover.svg';
import ic_eyeopen_Clicked from '@/components/Icons/ic_eyeopen-Clicked.svg';
import ic_edit_Default from '@/components/Icons/ic_edit-Default.svg';
import ic_edit_Hover from '@/components/Icons/ic_edit-Hover.svg';
import ic_edit_Clicked from '@/components/Icons/ic_edit-Clicked.svg';
import ic_delete_Default from '@/components/Icons/ic_delete-Default.svg';
import ic_delete_Hover from '@/components/Icons/ic_delete-Hover.svg';
import ic_delete_Clicked from '@/components/Icons/ic_delete-Clicked.svg';
// --- STATUS BADGES IMPORT ---
import scheduledBadgesScheduled from '@/components/badges/scheduled_badges-Scheduled.svg';
import scheduledBadgesCancelled from '@/components/badges/scheduled_badges-Cancelled.svg';
import scheduledBadgesCompleted from '@/components/badges/scheduled_badges-Completed.svg';


// ----------------------------------------------------------------------
// 1. CUSTOM INPUT COMPONENT
// ----------------------------------------------------------------------

const inputVariants = cva(
  [
    "w-full rounded-[4px] border border-[#d4c5a0]", 
    "bg-[#f3efd0]", 
    "font-['DM_Sans',sans-serif] text-[13.33px] font-semibold text-[#333333]", 
    "outline-none transition-all shadow-none",
    "placeholder:text-[#333333]/50",
    "focus:shadow-[0_0_0_2px_#73000066] focus:border-transparent", 
    "disabled:opacity-50 disabled:cursor-not-allowed",
    "read-only:bg-gray-100 read-only:border-gray-200 read-only:text-gray-600 read-only:focus:shadow-none", // Added read-only styles
  ],
  {
    variants: {
      inputSize: {
        default: "h-[38px] px-[12px] py-[8px]",
        full: "w-full h-[38px] px-[12px] py-[8px]",
      },
    },
    defaultVariants: {
      inputSize: "default",
    },
  }
);

interface InputProps extends Omit<React.ComponentProps<"input">, 'size'>, VariantProps<typeof inputVariants> {}

function Input({ className, type, inputSize, ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(inputVariants({ inputSize }), className)}
      {...props}
    />
  )
}

// ----------------------------------------------------------------------
// 2. HELPER COMPONENTS & INITIAL DATA
// ----------------------------------------------------------------------
const StatusBadge = ({ status }: { status: string }) => {
    let iconSrc = scheduledBadgesScheduled; // Default

    switch (status) {
        case 'Completed':
            iconSrc = scheduledBadgesCompleted;
            break;
        case 'Cancelled':
            iconSrc = scheduledBadgesCancelled;
            break;
        case 'Scheduled':
        default:
            iconSrc = scheduledBadgesScheduled;
            break;
    }

    return (
        <img 
            src={iconSrc} 
            alt={status} 
            className="h-6 w-auto object-contain" 
        />
    );
};

const InteractiveIcon = ({ 
    def,      
    hover,    
    clicked,  
    onClick, 
    title 
}) => {
    const [state, setState] = useState('default');

    // Logic to choose which image source to show
    const getIconSrc = () => {
        switch (state) {
            case 'active': return clicked;
            case 'hover': return hover;
            default: return def;
        }
    };

    return (
        <button
            onClick={onClick}
            title={title}
            // Event listeners to change state
            onMouseEnter={() => setState('hover')}
            onMouseLeave={() => setState('default')}
            onMouseDown={() => setState('active')}
            onMouseUp={() => setState('hover')}
            className="focus:outline-none transition-transform active:scale-95"
        >
            <img 
                src={getIconSrc()} 
                alt={title} 
                className="w-5 h-5 object-contain" 
            />
        </button>
    );
};
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
                isActive
                    ? 'bg-[#9b000a] text-white' 
                    : 'bg-[#800000] text-white/70 hover:bg-[#9b000a] hover:text-white',
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

const INITIAL_DEFENSES = [
    { id: '1', title: 'Machine Learning Approach for...', block: 'BSCpE 4-3', room: 'Room 315', panel: 'Flores, Garcia, Mendoza', date: new Date('2025-11-28T09:00:00'), status: 'Scheduled', section: '4-3', adviser: 'Dr. Smith', groupCode: '2101', equipment: 'Projector' },
    { id: '2', title: 'IoT Based Monitoring System...', block: 'BSCpE 4-3', room: 'Room 315', panel: 'Flores, Garcia, Mendoza', date: new Date('2025-11-28T09:00:00'), status: 'Scheduled', section: '4-3', adviser: 'Engr. Doe', groupCode: '2102', equipment: 'Monitor' },
    { id: '3', title: 'Automated Attendance System...', block: 'BSCpE 4-3', room: 'Room 315', panel: 'Flores, Garcia, Mendoza', date: new Date('2025-11-28T09:00:00'), status: 'Completed', section: '4-3', adviser: 'Dr. Alan', groupCode: '2103', equipment: 'None' },
    { id: '4', title: 'Network Security Analysis...', block: 'BSCpE 4-4', room: 'Room 315', panel: 'Flores, Garcia, Mendoza', date: new Date('2025-11-29T09:00:00'), status: 'Scheduled', section: '4-4', adviser: 'Engr. Joy', groupCode: '2104', equipment: 'HDMI' },
    { id: '5', title: 'FPGA Implementation of...', block: 'BSCpE 4-4', room: 'Room 315', panel: 'Flores, Garcia, Mendoza', date: new Date('2025-11-29T09:00:00'), status: 'Cancelled', section: '4-4', adviser: 'Dr. Strange', groupCode: '2105', equipment: 'Board' },
];

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

// Updated to accept onView, onEdit, onDelete callbacks
function DefenseTableRow({ data, onView, onEdit, onDelete }: { 
    data: typeof INITIAL_DEFENSES[0], 
    onView: (data: any) => void,
    onEdit: (data: any) => void, 
    onDelete: (id: string) => void 
}) {
    
    return (
        <div className={`${GRID_LAYOUT} bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors`}>
            <span className="text-sm text-gray-800 font-medium truncate" title={data.title}>{data.title}</span>
            <span className="text-sm text-gray-800 text-center">{data.block}</span>
            <span className="text-sm text-gray-800 text-center">{data.room}</span>
            <span className="text-sm text-gray-800 truncate text-center" title={data.panel}>{data.panel}</span>
            <div className="flex flex-col items-center text-sm text-gray-800">
                <span>{data.date.toLocaleDateString()}</span>
                <span className="text-xs text-gray-500">{data.date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
            </div>
            
            {/* Status Badge */}
            <div className="flex justify-center">
                <StatusBadge status={data.status} />
            </div>

            <div className="flex items-center justify-center gap-3">
                <InteractiveIcon 
                    def={ic_eyeopen_Default} 
                    hover={ic_eyeopen_Hover} 
                    clicked={ic_eyeopen_Clicked} 
                    onClick={() => onView(data)} 
                    title="View Details" 
                />
                
                <InteractiveIcon 
                    def={ic_edit_Default} 
                    hover={ic_edit_Hover} 
                    clicked={ic_edit_Clicked} 
                    onClick={() => onEdit(data)} 
                    title="Edit" 
                />
                
                <InteractiveIcon 
                    def={ic_delete_Default} 
                    hover={ic_delete_Hover} 
                    clicked={ic_delete_Clicked} 
                    onClick={() => onDelete(data.id)} 
                    title="Delete" 
                />
            </div>
        </div>
    );
}

const breadcrumb = [
    { title: 'Matrix Management', href: '#' },
];

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
// 4. MAIN PAGE COMPONENT
// ----------------------------------------------------------------------

export default function MatrixManagement({ defenseMatrices = [], availableProjects = [] }: { defenseMatrices: any[] , availableProjects: any[] }) {
    const [viewMode, setViewMode] = useState<'table' | 'calendar'>('calendar');
    const [currentDate, setCurrentDate] = useState(new Date('2025-11-28'));
    
    // --- STATE: Modals ---
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false); 
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    
    // --- STATE: Main Data Source ---
    const [defensesList, setDefensesList] = useState(INITIAL_DEFENSES);
    const [defenseToDelete, setDefenseToDelete] = useState<string | null>(null);

    // --- STATE: Form Data ---
    const emptyForm = {
        id: '',
        title: '',
        block: '',
        room: '',
        adviser: '',
        groupCode: '',
        equipment: '',
        dateTime: new Date(), 
        panel: '',
        status: ''
    };

    const [formData, setFormData] = useState(emptyForm);
    const [editFormData, setEditFormData] = useState(emptyForm);
    const [viewFormData, setViewFormData] = useState(emptyForm);

    // --- DERIVED STATE: Calendar Events ---
    const calendarEvents: WeeklyEventType[] = useMemo(() => {
        return defensesList.map(d => ({
            id: d.id,
            title: `${d.block} (${d.room})`, 
            date: d.date,
            time: d.date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
            section: d.section
        }));
    }, [defensesList]);

    // --- HANDLERS: ADD ---
    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleConfirmSchedule = () => {
        if (!formData.title || !formData.block) {
            setIsErrorModalOpen(true);
            return;
        }
        const newDefense = {
            id: Math.random().toString(36).substr(2, 9), 
            title: formData.title,
            block: formData.block,
            room: formData.room || 'TBA',
            panel: 'Pending Assignment', 
            date: formData.dateTime,
            status: 'Scheduled',
            section: formData.block.split(' ')[1] || 'N/A',
            adviser: formData.adviser,
            groupCode: formData.groupCode,
            equipment: formData.equipment
        };
        setDefensesList(prev => [...prev, newDefense]);
        setFormData(emptyForm);
        setIsScheduleModalOpen(false);
        setIsSuccessModalOpen(true);
    };

    // --- HANDLERS: VIEW ---
    const handleViewClick = (data: any) => {
        setViewFormData({
            id: data.id,
            title: data.title,
            block: data.block,
            room: data.room,
            adviser: data.adviser || '',
            groupCode: data.groupCode || '',
            equipment: data.equipment || '',
            dateTime: data.date,
            panel: data.panel || 'Pending',
            status: data.status
        });
        setIsViewModalOpen(true);
    };

    // --- HANDLERS: EDIT ---
    const handleEditClick = (data: any) => {
        setEditFormData({
            id: data.id,
            title: data.title,
            block: data.block,
            room: data.room,
            adviser: data.adviser || '',
            groupCode: data.groupCode || '',
            equipment: data.equipment || '',
            dateTime: data.date,
            panel: data.panel,
            status: data.status
        });
        setIsEditModalOpen(true);
    };

    const handleEditInputChange = (field: string, value: any) => {
        setEditFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleUpdateDefense = () => {
        if (!editFormData.title || !editFormData.block) {
            setIsErrorModalOpen(true);
            return;
        }

        setDefensesList(prev => prev.map(item => {
            if (item.id === editFormData.id) {
                return {
                    ...item,
                    title: editFormData.title,
                    block: editFormData.block,
                    room: editFormData.room,
                    adviser: editFormData.adviser,
                    groupCode: editFormData.groupCode,
                    equipment: editFormData.equipment,
                    date: editFormData.dateTime,
                    section: editFormData.block.split(' ')[1] || 'N/A'
                };
            }
            return item;
        }));

        setIsEditModalOpen(false);
        setIsSuccessModalOpen(true); 
    };

    // --- HANDLERS: DELETE ---
    const handleDeleteClick = (id: string) => {
        setDefenseToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (defenseToDelete) {
            setDefensesList(prev => prev.filter(item => item.id !== defenseToDelete));
            setIsDeleteModalOpen(false);
            setDefenseToDelete(null);
        }
    };

    // --- STYLES ---
    const labelClass = "text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1";
    const selectTriggerClass = "h-[38px] w-full rounded-[4px] border border-[#d4c5a0] bg-[#f3efd0] px-[12px] py-[8px] text-[13.33px] font-semibold text-[#333333] font-['DM_Sans',sans-serif] outline-none focus:shadow-[0_0_0_2px_#73000066] focus:border-transparent focus:ring-0";
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
            <Head title="Matrix Management" />
            
            <div className="flex flex-col min-h-screen bg-primary-foreground -mt-4 -mx-4 -mb-4 md:-mt-4 md:-mx-6 md:-mb-6 lg:-mt-6 lg:-mx-8 lg:-mb-8">
                
                {/* Header Card */}
                <HeaderCard
                    title="Matrix Management"
                    description="Monitor all defense schedule, facilities, and equipment"
                    className="w-full max-w-none rounded-none border-t-0 border-x-0"
                    icon={
                        <div className="flex h-full w-full items-center justify-center rounded-md bg-[#800000] text-white">
                            <CalendarIcon className="h-5 w-5" />
                        </div>
                    }
                />

                <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8 w-full">
                    
                    {/* 1. Page Tabs */}
                    <div className="flex items-end gap-1 mb-0 border-b border-[#800000]/10 pb-0">
                        <TabButton 
                            isActive={false} 
                            onClick={() => router.get(index().url)}
                        >
                            Panel Assignment
                        </TabButton>
                        <TabButton isActive={true}>
                            Matrix Management
                        </TabButton>
                    </div>

                    {/* 2. Controls & Content - Removing the extra 'space-y-6' wrapper fixed layout */}
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center pt-2">
                        <Button 
                            variant="primary" 
                            onClick={() => {
                                setFormData(emptyForm);
                                setIsScheduleModalOpen(true);
                            }}
                        >
                            <Plus className="mr-2 h-4 w-4" /> 
                            Schedule a Defense
                        </Button>

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

                    <div className="min-h-[600px] flex-1">
                        {viewMode === 'calendar' ? (
                            <DefenseCalendarWeekly 
                                events={calendarEvents}
                                value={currentDate}
                                onChange={setCurrentDate}
                                className="shadow-sm border-sidebar-border/70 h-full"
                            />
                        ) : (
                            <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm dark:border-sidebar-border h-full flex flex-col">
                                <DefenseTableHeader />
                                <div className="flex-1 overflow-auto">
                                    {defensesList.map((defense) => (
                                        <DefenseTableRow 
                                            key={defense.id} 
                                            data={defense} 
                                            onView={handleViewClick}
                                            onEdit={handleEditClick}
                                            onDelete={handleDeleteClick}
                                        />
                                    ))}
                                </div>
                                <div className="bg-gray-50 px-5 py-3 text-xs text-center text-gray-500 border-t border-gray-200 mt-auto">
                                    {defensesList.length} of {defensesList.length} Upcoming Defenses
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <NavFooter />
            </div>
            

            {/* ================= 1. ADD SCHEDULE MODAL ================= */}
            <Dialog open={isScheduleModalOpen} onOpenChange={setIsScheduleModalOpen}>
                <DialogContent className="max-w-[1000px] w-[95vw] h-[85vh] p-0 border-none rounded-lg bg-[#FDFCF6] shadow-2xl font-dm flex flex-col [&>button]:hidden overflow-hidden">
                    {/* Header */}
                    <div className="flex-none flex flex-row justify-between items-center px-8 py-6 border-b border-gray-200 bg-white z-10">
                        <div>
                            <h2 className="text-2xl font-bold text-[#800000] tracking-tight">Schedule Defense</h2>
                            <p className="text-sm text-gray-500 mt-1">Enter the details for the upcoming thesis defense.</p>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="text-right hidden sm:block">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Defense ID</span>
                                <span className="text-lg font-bold text-gray-700 font-mono">#DEF-NEW</span>
                            </div>
                            <button 
                                onClick={() => setIsScheduleModalOpen(false)}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-lg transition-colors"
                            >
                                <Plus className="w-5 h-5 rotate-45" /> 
                            </button>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-[#FAFAFA]">
                        <div className="space-y-8">
                            {/* Proposal Info */}
                            <h3 className="text-sm font-bold text-[#800000] flex items-center gap-2 mb-0 pb-2 border-b border-gray-100">
                                <div className="w-1.5 h-4 bg-[#800000] rounded-full" />
                                Proposal Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                                <div className="md:col-span-8 space-y-1">
                                    <Label className={labelClass}>Thesis Title</Label>
                                    <Input inputSize="full" value={formData.title} onChange={(e) => handleInputChange('title', e.target.value)} placeholder="Enter thesis title..." />
                                </div>
                                <div className="md:col-span-4 space-y-1">
                                    <Label className={labelClass}>Group Code</Label>
                                    <div className="relative">
                                        <Input inputSize="full" value={formData.groupCode} onChange={(e) => handleInputChange('groupCode', e.target.value)} placeholder="e.g. 2101" className="pl-10" />
                                        <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#333333]/50" />
                                    </div>
                                </div>
                                <div className="md:col-span-6 space-y-1">
                                    <Label className={labelClass}>Thesis Adviser</Label>
                                    <div className="relative">
                                        <Input inputSize="full" value={formData.adviser} onChange={(e) => handleInputChange('adviser', e.target.value)} placeholder="Adviser Name" className="pl-10" />
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#333333]/50" />
                                    </div>
                                </div>
                                <div className="md:col-span-6 space-y-1">
                                    <Label className={labelClass}>Block</Label>
                                    <Select value={formData.block} onValueChange={(val) => handleInputChange('block', val)}>
                                        <SelectTrigger className={selectTriggerClass}><SelectValue placeholder="Select Block" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="BSCpE 4-1">BSCpE 4-1</SelectItem>
                                            <SelectItem value="BSCpE 4-2">BSCpE 4-2</SelectItem>
                                            <SelectItem value="BSCpE 4-3">BSCpE 4-3</SelectItem>
                                            <SelectItem value="BSCpE 4-4">BSCpE 4-4</SelectItem>
                                            <SelectItem value="BSCpE 4-5">BSCpE 4-5</SelectItem>
                                            <SelectItem value="BSCpE 4-6">BSCpE 4-6</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Logistics */}
                            <h3 className="text-sm font-bold text-[#800000] flex items-center gap-2 mb-0 pb-2 border-b border-gray-100">
                                <div className="w-1.5 h-4 bg-[#800000] rounded-full" />
                                Defense Logistics
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div className="space-y-1">
                                    <Label className={labelClass}>Date</Label>
                                    <DatePicker placeholder="Select Date" value={formData.dateTime} onChange={(date) => handleInputChange('dateTime', date)} className="w-full" displayFormat="full" />
                                </div>
                                <div className="space-y-1">
                                    <Label className={labelClass}>Time Slot</Label>
                                    <TimePicker value={formData.dateTime} onChange={(date) => handleInputChange('dateTime', date)} placeholder="Select Time" className="w-full" />
                                </div>
                                <div className="space-y-1">
                                    <Label className={labelClass}>Room</Label>
                                    <div className="relative">
                                        <Input inputSize="full" value={formData.room} onChange={(e) => handleInputChange('room', e.target.value)} placeholder="e.g. Room 305" className="pl-10" />
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1a1a1a]/50" />
                                    </div>
                                </div>
                                <div className="md:col-span-3 space-y-1">
                                    <Label className={labelClass}>Equipment Required</Label>
                                    <div className="relative">
                                        <Input inputSize="full" value={formData.equipment} onChange={(e) => handleInputChange('equipment', e.target.value)} placeholder="e.g. Projector, HDMI Cable, Extension Cord" className="pl-10" />
                                        <Monitor className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1a1a1a]/50" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Footer */}
                    <div className="flex-none flex justify-end gap-3 px-8 py-5 border-t border-gray-200 bg-white">
                         <Button variant="outline" onClick={() => setIsScheduleModalOpen(false)} className="h-9 px-6 border-transparent hover:bg-gray-100 text-gray-600 font-medium">Cancel</Button>
                         <Button onClick={handleConfirmSchedule} className="bg-[#800000] hover:bg-[#600000] h-9 px-8 text-sm font-bold shadow-lg shadow-red-900/10">
                            <Plus className="w-4 h-4 mr-2" /> Confirm Schedule
                         </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* ================= 2. VIEW DEFENSE MODAL ================= */}
            <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
                <DialogContent className="max-w-[1000px] w-[95vw] h-[85vh] p-0 border-none rounded-lg bg-[#FDFCF6] shadow-2xl font-dm flex flex-col [&>button]:hidden overflow-hidden">
                    {/* Header */}
                    <div className="flex-none flex flex-row justify-between items-center px-8 py-6 border-b border-gray-200 bg-white z-10">
                        <div>
                            <div className="flex items-center gap-3">
                                <h2 className="text-2xl font-bold text-[#800000] tracking-tight">Defense Details</h2>
                                <Badge className={viewFormData.status === 'Completed' ? 'bg-green-600' : 'bg-blue-600'}>
                                    {viewFormData.status}
                                </Badge>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">Reviewing information for the selected defense.</p>
                        </div>
                        <div className="flex items-center gap-6">
                            <button onClick={() => setIsViewModalOpen(false)} className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-lg transition-colors">
                                <Plus className="w-5 h-5 rotate-45" /> 
                            </button>
                        </div>
                    </div>

                    {/* Body - Read Only Inputs */}
                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-[#FAFAFA]">
                        <div className="space-y-8">
                            <h3 className="text-sm font-bold text-[#800000] flex items-center gap-2 mb-0 pb-2 border-b border-gray-100">
                                <div className="w-1.5 h-4 bg-[#800000] rounded-full" /> Proposal Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                                <div className="md:col-span-8 space-y-1">
                                    <Label className={labelClass}>Thesis Title</Label>
                                    <Input inputSize="full" value={viewFormData.title} readOnly />
                                </div>
                                <div className="md:col-span-4 space-y-1">
                                    <Label className={labelClass}>Group Code</Label>
                                    <div className="relative">
                                        <Input inputSize="full" value={viewFormData.groupCode} readOnly className="pl-10" />
                                        <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#333333]/50" />
                                    </div>
                                </div>
                                <div className="md:col-span-6 space-y-1">
                                    <Label className={labelClass}>Thesis Adviser</Label>
                                    <div className="relative">
                                        <Input inputSize="full" value={viewFormData.adviser} readOnly className="pl-10" />
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#333333]/50" />
                                    </div>
                                </div>
                                <div className="md:col-span-6 space-y-1">
                                    <Label className={labelClass}>Block</Label>
                                    <Input inputSize="full" value={viewFormData.block} readOnly />
                                </div>
                            </div>

                            <h3 className="text-sm font-bold text-[#800000] flex items-center gap-2 mb-0 pb-2 border-b border-gray-100">
                                <div className="w-1.5 h-4 bg-[#800000] rounded-full" /> Defense Logistics
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div className="space-y-1">
                                    <Label className={labelClass}>Date</Label>
                                    <Input inputSize="full" value={viewFormData.dateTime ? viewFormData.dateTime.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : ''} readOnly />
                                </div>
                                <div className="space-y-1">
                                    <Label className={labelClass}>Time</Label>
                                    <div className="relative">
                                        <Input inputSize="full" value={viewFormData.dateTime ? viewFormData.dateTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : ''} readOnly className="pl-10" />
                                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1a1a1a]/50" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <Label className={labelClass}>Room</Label>
                                    <div className="relative">
                                        <Input inputSize="full" value={viewFormData.room} readOnly className="pl-10" />
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1a1a1a]/50" />
                                    </div>
                                </div>
                                <div className="md:col-span-3 space-y-1">
                                    <Label className={labelClass}>Equipment</Label>
                                    <div className="relative">
                                        <Input inputSize="full" value={viewFormData.equipment} readOnly className="pl-10" />
                                        <Monitor className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1a1a1a]/50" />
                                    </div>
                                </div>
                                <div className="md:col-span-3 space-y-1">
                                    <Label className={labelClass}>Assigned Panel</Label>
                                    <div className="p-3 bg-gray-50 border border-[#d4c5a0] rounded-[4px] text-sm text-[#333333] font-medium">
                                        {viewFormData.panel}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Footer - Close Button */}
                    <div className="flex-none flex justify-end gap-3 px-8 py-5 border-t border-gray-200 bg-white">
                         <Button variant="outline" onClick={() => setIsViewModalOpen(false)} className="h-9 px-6 border-transparent hover:bg-gray-100 text-gray-600 font-medium">Close</Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* ================= 3. EDIT DEFENSE MODAL ================= */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="max-w-[1000px] w-[95vw] h-[85vh] p-0 border-none rounded-lg bg-[#FDFCF6] shadow-2xl font-dm flex flex-col [&>button]:hidden overflow-hidden">
                    {/* Header */}
                    <div className="flex-none flex flex-row justify-between items-center px-8 py-6 border-b border-gray-200 bg-white z-10">
                        <div>
                            <h2 className="text-2xl font-bold text-[#800000] tracking-tight">Edit Defense Details</h2>
                            <p className="text-sm text-gray-500 mt-1">Update information for the selected defense.</p>
                        </div>
                        <div className="flex items-center gap-6">
                            <button onClick={() => setIsEditModalOpen(false)} className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-lg transition-colors">
                                <Plus className="w-5 h-5 rotate-45" /> 
                            </button>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-[#FAFAFA]">
                        <div className="space-y-8">
                            <h3 className="text-sm font-bold text-[#800000] flex items-center gap-2 mb-0 pb-2 border-b border-gray-100">
                                <div className="w-1.5 h-4 bg-[#800000] rounded-full" /> Proposal Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                                <div className="md:col-span-8 space-y-1">
                                    <Label className={labelClass}>Thesis Title</Label>
                                    <Input inputSize="full" value={editFormData.title} onChange={(e) => handleEditInputChange('title', e.target.value)} />
                                </div>
                                <div className="md:col-span-4 space-y-1">
                                    <Label className={labelClass}>Group Code</Label>
                                    <div className="relative">
                                        <Input inputSize="full" value={editFormData.groupCode} onChange={(e) => handleEditInputChange('groupCode', e.target.value)} className="pl-10" />
                                        <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#333333]/50" />
                                    </div>
                                </div>
                                <div className="md:col-span-6 space-y-1">
                                    <Label className={labelClass}>Thesis Adviser</Label>
                                    <div className="relative">
                                        <Input inputSize="full" value={editFormData.adviser} onChange={(e) => handleEditInputChange('adviser', e.target.value)} className="pl-10" />
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#333333]/50" />
                                    </div>
                                </div>
                                <div className="md:col-span-6 space-y-1">
                                    <Label className={labelClass}>Block</Label>
                                    <Select value={editFormData.block} onValueChange={(val) => handleEditInputChange('block', val)}>
                                        <SelectTrigger className={selectTriggerClass}><SelectValue placeholder="Select Block" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="BSCpE 4-1">BSCpE 4-1</SelectItem>
                                            <SelectItem value="BSCpE 4-2">BSCpE 4-2</SelectItem>
                                            <SelectItem value="BSCpE 4-3">BSCpE 4-3</SelectItem>
                                            <SelectItem value="BSCpE 4-4">BSCpE 4-4</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <h3 className="text-sm font-bold text-[#800000] flex items-center gap-2 mb-0 pb-2 border-b border-gray-100">
                                <div className="w-1.5 h-4 bg-[#800000] rounded-full" /> Defense Logistics
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div className="space-y-1">
                                    <Label className={labelClass}>Date</Label>
                                    <DatePicker placeholder="Select Date" value={editFormData.dateTime} onChange={(date) => handleEditInputChange('dateTime', date)} className="w-full" displayFormat="full" />
                                </div>
                                <div className="space-y-1">
                                    <Label className={labelClass}>Time Slot</Label>
                                    <TimePicker value={editFormData.dateTime} onChange={(date) => handleEditInputChange('dateTime', date)} className="w-full" />
                                </div>
                                <div className="space-y-1">
                                    <Label className={labelClass}>Room</Label>
                                    <div className="relative">
                                        <Input inputSize="full" value={editFormData.room} onChange={(e) => handleEditInputChange('room', e.target.value)} className="pl-10" />
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1a1a1a]/50" />
                                    </div>
                                </div>
                                <div className="md:col-span-3 space-y-1">
                                    <Label className={labelClass}>Equipment Required</Label>
                                    <div className="relative">
                                        <Input inputSize="full" value={editFormData.equipment} onChange={(e) => handleEditInputChange('equipment', e.target.value)} className="pl-10" />
                                        <Monitor className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1a1a1a]/50" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Footer */}
                    <div className="flex-none flex justify-end gap-3 px-8 py-5 border-t border-gray-200 bg-white">
                         <Button variant="outline" onClick={() => setIsEditModalOpen(false)} className="h-9 px-6 border-transparent hover:bg-gray-100 text-gray-600 font-medium">Cancel</Button>
                         <Button onClick={handleUpdateDefense} className="bg-[#800000] hover:bg-[#600000] h-9 px-8 text-sm font-bold shadow-lg shadow-red-900/10">
                            Save Changes
                         </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* ================= 4. DELETE CONFIRMATION MODAL ================= */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent className="max-w-[400px] rounded-[24px] p-8 flex flex-col items-center justify-center border-none shadow-2xl bg-white [&>button]:hidden">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
                        <Trash className="w-8 h-8 text-[#800000]" />
                    </div>
                    <h3 className="text-[20px] text-center text-gray-800 font-bold font-dm mb-2">Delete Schedule?</h3>
                    <p className="text-sm text-center text-gray-500 mb-8 px-4">
                        Are you sure you want to delete this schedule? This action cannot be undone.
                    </p>
                    <div className="flex gap-3 w-full">
                        <Button 
                            variant="outline" 
                            onClick={() => setIsDeleteModalOpen(false)} 
                            className="flex-1 h-10 border-gray-200 text-gray-600 hover:bg-gray-50"
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleConfirmDelete} 
                            className="flex-1 h-10 bg-[#800000] hover:bg-[#600000] text-white font-bold"
                        >
                            Delete
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* ================= 5. SUCCESS MODAL ================= */}
            <Dialog open={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen}>
                <DialogContent className="max-w-[320px] rounded-[24px] p-10 flex flex-col items-center justify-center border-none shadow-2xl bg-white [&>button]:hidden">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-lg">
                        <Check className="w-10 h-10 text-green-600" />
                    </div>
                    <p className="text-[16px] text-center text-gray-800 font-bold font-dm">
                        Action completed successfully.
                    </p>
                </DialogContent>
            </Dialog>

            {/* ================= 6. ERROR MODAL (Validation) ================= */}
            <Dialog open={isErrorModalOpen} onOpenChange={setIsErrorModalOpen}>
                <DialogContent className="max-w-[320px] rounded-[24px] p-10 flex flex-col items-center justify-center border-none shadow-2xl bg-white [&>button]:hidden">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6 shadow-lg">
                        <AlertCircle className="w-10 h-10 text-[#800000]" />
                    </div>
                    <p className="text-[16px] text-center text-gray-800 font-bold font-dm mb-2">
                        Missing Information
                    </p>
                    <p className="text-sm text-center text-gray-500">
                        Please fill in the required fields: <br/> 
                        <span className="font-bold">Thesis Title</span> and <span className="font-bold">Block</span>.
                    </p>
                </DialogContent>
            </Dialog>

        </AppLayout>

    );




}