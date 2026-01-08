import React, { useState, useMemo } from 'react';
import AppLayout from '@/layouts/app-layout';
import { panel_assign } from '@/routes/faculty/management/coordinator/defense_management';
import { router } from '@inertiajs/react';
import { cva, type VariantProps } from "class-variance-authority";
import { 
    Calendar as CalendarIcon, 
    Plus, 
    Download, 
    Edit2, 
    Trash2, 
    LayoutList,
    CalendarDays,
    Clock,
    MapPin,
    Hash,
    Monitor,
    User,
    ChevronDown,
    Check,
    AlertCircle
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
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";

// Import your custom components
import DatePicker from "@/components/date-picker";
import TimePicker from "@/components/time-picker";

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
    { id: '1', title: 'Machine Learning Approach for...', block: 'BSCpE 4-3', room: 'Room 315', panel: 'Flores, Garcia, Mendoza', date: new Date('2025-11-28T09:00:00'), status: 'Scheduled', section: '4-3' },
    { id: '2', title: 'IoT Based Monitoring System...', block: 'BSCpE 4-3', room: 'Room 315', panel: 'Flores, Garcia, Mendoza', date: new Date('2025-11-28T09:00:00'), status: 'Scheduled', section: '4-3' },
    { id: '3', title: 'Automated Attendance System...', block: 'BSCpE 4-3', room: 'Room 315', panel: 'Flores, Garcia, Mendoza', date: new Date('2025-11-28T09:00:00'), status: 'Completed', section: '4-3' },
    { id: '4', title: 'Network Security Analysis...', block: 'BSCpE 4-4', room: 'Room 315', panel: 'Flores, Garcia, Mendoza', date: new Date('2025-11-29T09:00:00'), status: 'Scheduled', section: '4-4' },
    { id: '5', title: 'FPGA Implementation of...', block: 'BSCpE 4-4', room: 'Room 315', panel: 'Flores, Garcia, Mendoza', date: new Date('2025-11-29T09:00:00'), status: 'Cancelled', section: '4-4' },
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

function DefenseTableRow({ data }: { data: typeof INITIAL_DEFENSES[0] }) {
    const getStatusStyle = (status: string) => {
        switch(status) {
            case 'Completed': return 'bg-green-600 border-transparent text-white';
            case 'Cancelled': return 'bg-red-500 border-transparent text-white';
            default: return 'bg-[#8EC5FF] border border-[#193CB8] text-[#193CB8] hover:bg-[#7bb9ff]';
        }
    };

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

const breadcrumb = [
    { title: 'Matrix Management', href: '#' },
];

// ----------------------------------------------------------------------
// 4. MAIN PAGE COMPONENT
// ----------------------------------------------------------------------

export default function MatrixManagement() {
    const [viewMode, setViewMode] = useState<'table' | 'calendar'>('calendar');
    const [currentDate, setCurrentDate] = useState(new Date('2025-11-28')); 
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false); 
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    
    // --- STATE: Main Data Source ---
    const [defensesList, setDefensesList] = useState(INITIAL_DEFENSES);

    // --- STATE: Form Data ---
    const [formData, setFormData] = useState({
        title: '',
        block: '',
        room: '',
        adviser: '',
        groupCode: '',
        equipment: '',
        // Initialize date/time with current datetime
        dateTime: new Date(), 
    });

    // --- DERIVED STATE: Calendar Events ---
    // Automatically updates when defensesList changes
    const calendarEvents: WeeklyEventType[] = useMemo(() => {
        return defensesList.map(d => ({
            id: d.id,
            title: `${d.block} (${d.room})`, 
            date: d.date,
            time: d.date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
            section: d.section
        }));
    }, [defensesList]);

    // --- HANDLERS ---

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleConfirmSchedule = () => {
        // 1. Validation Logic
        if (!formData.title || !formData.block) {
            setIsErrorModalOpen(true); // Open Error Modal instead of alert
            return;
        }

        // 2. Add New Data
        const newDefense = {
            id: Math.random().toString(36).substr(2, 9), 
            title: formData.title,
            block: formData.block,
            room: formData.room || 'TBA',
            panel: 'Pending Assignment', 
            date: formData.dateTime,
            status: 'Scheduled',
            section: formData.block.split(' ')[1] || 'N/A' 
        };

        setDefensesList(prev => [...prev, newDefense]);

        // 3. Reset Form & Switch Modals
        setFormData({
            title: '',
            block: '',
            room: '',
            adviser: '',
            groupCode: '',
            equipment: '',
            dateTime: new Date(), 
        });
        setIsScheduleModalOpen(false); // Close Form
        setIsSuccessModalOpen(true);   // Open Success Modal
    };

    // --- STYLES ---
    const labelClass = "text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1";
    const selectTriggerClass = "h-[38px] w-full rounded-[4px] border border-[#d4c5a0] bg-[#f3efd0] px-[12px] py-[8px] text-[13.33px] font-semibold text-[#333333] font-['DM_Sans',sans-serif] outline-none focus:shadow-[0_0_0_2px_#73000066] focus:border-transparent focus:ring-0";

    return (
        <AppLayout breadcrumbs={breadcrumb}>
            
            <div className="flex flex-col w-full min-h-screen bg-primary-foreground -mt-4 -mx-4 -mb-4 md:-mt-4 md:-mx-6 md:-mb-6 lg:-mt-6 lg:-mx-8 lg:-mb-8">
                
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
                    
                    {/* Page Tabs */}
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

                    <div className="space-y-6 pt-2">
                        
                        {/* Action Bar */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <Button 
                                variant="primary" 
                                onClick={() => setIsScheduleModalOpen(true)}
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

                        {/* Content Switching */}
                        <div className="min-h-[600px]">
                            {viewMode === 'calendar' ? (
                                <DefenseCalendarWeekly 
                                    events={calendarEvents}
                                    value={currentDate}
                                    onChange={setCurrentDate}
                                    className="shadow-sm border-sidebar-border/70"
                                />
                            ) : (
                                <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm dark:border-sidebar-border">
                                    <DefenseTableHeader />
                                    <div>
                                        {defensesList.map((defense) => (
                                            <DefenseTableRow key={defense.id} data={defense} />
                                        ))}
                                    </div>
                                    <div className="bg-gray-50 px-5 py-3 text-xs text-center text-gray-500 border-t border-gray-200">
                                        {defensesList.length} of {defensesList.length} Upcoming Defenses
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            
            <NavFooter />

            {/* ================= SCHEDULE DEFENSE MODAL ================= */}
            <Dialog open={isScheduleModalOpen} onOpenChange={setIsScheduleModalOpen}>
                <DialogContent 
                    className="max-w-[1000px] w-[95vw] h-[85vh] p-0 border-none rounded-lg bg-[#FDFCF6] shadow-2xl font-dm flex flex-col [&>button]:hidden overflow-hidden"
                >
                    {/* 1. STICKY HEADER */}
                    <div className="flex-none flex flex-row justify-between items-center px-8 py-6 border-b border-gray-200 bg-white z-10">
                        <div>
                            <h2 className="text-2xl font-bold text-[#800000] tracking-tight">Schedule Defense</h2>
                            <p className="text-sm text-gray-500 mt-1">Enter the details for the upcoming thesis defense.</p>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="text-right hidden sm:block">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Defense ID</span>
                                <span className="text-lg font-bold text-gray-700 font-mono">#DEF-2025-00X</span>
                            </div>
                            <button 
                                onClick={() => setIsScheduleModalOpen(false)}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-lg transition-colors"
                            >
                                <Plus className="w-5 h-5 rotate-45" /> 
                            </button>
                        </div>
                    </div>

                   
                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-[#FAFAFA]">
                        <div className="space-y-8">
                            
                            {/* SECTION 1: PROPOSAL INFO */}
                            <h3 className="text-sm font-bold text-[#800000] flex items-center gap-2 mb-0 pb-2 border-b border-gray-100">
                                <div className="w-1.5 h-4 bg-[#800000] rounded-full" />
                                Proposal Information
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                                {/* Title */}
                                <div className="md:col-span-8 space-y-1">
                                    <Label className={labelClass}>Thesis Title</Label>
                                    <Input 
                                        inputSize="full"
                                        value={formData.title}
                                        onChange={(e) => handleInputChange('title', e.target.value)}
                                        placeholder="Enter the approved thesis title..." 
                                    />
                                </div>

                                {/* Group Code */}
                                <div className="md:col-span-4 space-y-1">
                                    <Label className={labelClass}>Group Code</Label>
                                    <div className="relative">
                                        <Input 
                                            inputSize="full"
                                            value={formData.groupCode}
                                            onChange={(e) => handleInputChange('groupCode', e.target.value)}
                                            placeholder="e.g. 2101" 
                                            className="pl-10"
                                        />
                                        <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#333333]/50" />
                                    </div>
                                </div>

                                {/* Adviser */}
                                <div className="md:col-span-6 space-y-1">
                                    <Label className={labelClass}>Thesis Adviser</Label>
                                    <div className="relative">
                                        <Input 
                                            inputSize="full"
                                            value={formData.adviser}
                                            onChange={(e) => handleInputChange('adviser', e.target.value)}
                                            placeholder="Adviser Name" 
                                            className="pl-10"
                                        />
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#333333]/50" />
                                    </div>
                                </div>
                                
                                {/* Block */}
                                <div className="md:col-span-6 space-y-1">
                                    <Label className={labelClass}>Block</Label>
                                    <Select 
                                        value={formData.block} 
                                        onValueChange={(val) => handleInputChange('block', val)}
                                    >
                                        <SelectTrigger className={selectTriggerClass}>
                                            <SelectValue placeholder="Select Block" />
                                        </SelectTrigger>
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
                            

                            {/* SECTION 2: LOGISTICS */}
                            <h3 className="text-sm font-bold text-[#800000] flex items-center gap-2 mb-0 pb-2 border-b border-gray-100">
                                <div className="w-1.5 h-4 bg-[#800000] rounded-full" />
                                Defense Logistics
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {/* Date */}
                                <div className="space-y-1">
                                    <Label className={labelClass}>Date</Label>
                                    <DatePicker 
                                        placeholder="Select Date"
                                        value={formData.dateTime}
                                        onChange={(date) => handleInputChange('dateTime', date)}
                                        className="w-full"
                                        displayFormat="full"
                                    />
                                </div>

                                {/* Time */}
                                <div className="space-y-1">
                                    <Label className={labelClass}>Time Slot</Label>
                                    <TimePicker
                                        value={formData.dateTime}
                                        onChange={(date) => handleInputChange('dateTime', date)}
                                        placeholder="Select Time"
                                        className="w-full"
                                    />
                                </div>

                                {/* Room */}
                                <div className="space-y-1">
                                    <Label className={labelClass}>Room</Label>
                                    <div className="relative">
                                        <Input 
                                            inputSize="full"
                                            value={formData.room}
                                            onChange={(e) => handleInputChange('room', e.target.value)}
                                            placeholder="e.g. Room 305" 
                                            className="pl-10"
                                        />
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1a1a1a]/50" />
                                    </div>
                                </div>

                                {/* Equipment */}
                                <div className="md:col-span-3 space-y-1">
                                    <Label className={labelClass}>Equipment Required</Label>
                                    <div className="relative">
                                        <Input 
                                            inputSize="full"
                                            value={formData.equipment}
                                            onChange={(e) => handleInputChange('equipment', e.target.value)}
                                            placeholder="e.g. Projector, HDMI Cable, Extension Cord" 
                                            className="pl-10"
                                        />
                                        <Monitor className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1a1a1a]/50" />
                                    </div>
                                </div>
                            </div>
                            

                        </div>
                    </div>
                    
                    {/* 3. STICKY FOOTER */}
                    <div className="flex-none flex justify-end gap-3 px-8 py-5 border-t border-gray-200 bg-white">
                         <Button 
                            variant="outline" 
                            onClick={() => setIsScheduleModalOpen(false)}
                            className="h-9 px-6 border-transparent hover:bg-gray-100 text-gray-600 font-medium"
                        >
                            Cancel
                         </Button>
                         <Button 
                            onClick={handleConfirmSchedule}
                            className="bg-[#800000] hover:bg-[#600000] h-9 px-8 text-sm font-bold shadow-lg shadow-red-900/10"
                         >
                            <Plus className="w-4 h-4 mr-2" />
                            Confirm Schedule
                         </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* ================= 2. SUCCESS MODAL ================= */}
            <Dialog open={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen}>
                <DialogContent className="max-w-[320px] rounded-[24px] p-10 flex flex-col items-center justify-center border-none shadow-2xl bg-white [&>button]:hidden">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-lg">
                        <Check className="w-10 h-10 text-green-600" />
                    </div>
                    <p className="text-[16px] text-center text-gray-800 font-bold font-dm">
                        Schedule successfully added.
                    </p>
                </DialogContent>
            </Dialog>

            {/* ================= 3. ERROR MODAL (Validation) ================= */}
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