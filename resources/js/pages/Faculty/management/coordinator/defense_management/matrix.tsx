import React, { useState, useMemo, useEffect } from 'react';
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
    Check,
    AlertCircle,
    Trash,
    X
} from 'lucide-react';

// --- UI COMPONENTS ---
import { Button } from '@/components/ui/button'; 
import { Badge } from '@/components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"; 
import { DefenseCalendarWeekly, type WeeklyEventType } from '@/components/defense-calendar-weekly'; 
import { cn } from '@/lib/utils';
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

// --- LAYOUTS ---
import DefenseManagementLayout from '.';
import { PageHeaderProps } from '@/types';
import { index as panel_assign } from '@/routes/faculty/coordinator/defense_management/panel_assign/index';

// --- CUSTOM ASSETS ---
import ic_eyeopen_Default from '@/components/Icons/ic_eyeopen-Default.svg';
import ic_eyeopen_Hover from '@/components/Icons/ic_eyeopen-Hover.svg';
import ic_eyeopen_Clicked from '@/components/Icons/ic_eyeopen-Clicked.svg';
import ic_edit_Default from '@/components/Icons/ic_edit-Default.svg';
import ic_edit_Hover from '@/components/Icons/ic_edit-Hover.svg';
import ic_edit_Clicked from '@/components/Icons/ic_edit-Clicked.svg';
import ic_delete_Default from '@/components/Icons/ic_delete-Default.svg';
import ic_delete_Hover from '@/components/Icons/ic_delete-Hover.svg';
import ic_delete_Clicked from '@/components/Icons/ic_delete-Clicked.svg';

import scheduledBadgesScheduled from '@/components/badges/scheduled_badges-Scheduled.svg';
import scheduledBadgesCancelled from '@/components/badges/scheduled_badges-Cancelled.svg';
import scheduledBadgesCompleted from '@/components/badges/scheduled_badges-Completed.svg';

// ----------------------------------------------------------------------
// 1. TYPES & INTERFACES
// ----------------------------------------------------------------------

interface Defense {
    id: string;
    title: string;
    block: string;
    room: string;
    panel: string;
    date: Date;
    status: 'Scheduled' | 'Completed' | 'Cancelled';
    section: string;
    adviser: string;
    groupCode: string;
    equipment: string;
}

// ----------------------------------------------------------------------
// 2. REUSABLE UI COMPONENTS
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
    "read-only:bg-gray-100 read-only:border-gray-200 read-only:text-gray-600 read-only:focus:shadow-none",
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
      className={cn(inputVariants({ inputSize }), className)}
      {...props}
    />
  )
}

// --- INTERACTIVE ICON ---
const InteractiveIcon = ({ 
    def,      
    hover,    
    clicked,  
    onClick, 
    title 
}: { def: string, hover: string, clicked: string, onClick: () => void, title: string }) => {
    const [state, setState] = useState('default');

    const getIconSrc = () => {
        switch (state) {
            case 'active': return clicked;
            case 'hover': return hover;
            default: return def;
        }
    };

    return (
        <button
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            title={title}
            onMouseEnter={() => setState('hover')}
            onMouseLeave={() => setState('default')}
            onMouseDown={() => setState('active')}
            onMouseUp={() => setState('hover')}
            className="focus:outline-none transition-transform active:scale-95"
        >
            <img src={getIconSrc()} alt={title} className="w-5 h-5 object-contain" />
        </button>
    );
};

const TabButton = ({ isActive, children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { isActive?: boolean }) => (
    <button
        className={cn(
            'h-12 px-[20px] flex flex-col justify-center items-center gap-2.5 rounded-t-[10px] transition-colors',
            isActive ? 'bg-[#9b000a] text-white' : 'bg-[#800000] text-white/70 hover:bg-[#9b000a] hover:text-white',
            className
        )}
        {...props}
    >
        <span className="font-medium text-[16px] leading-normal whitespace-nowrap font-dm">
            {children}
        </span>
    </button>
);

const StatusBadge = ({ status }: { status: string }) => {
    const badges = {
        'Completed': scheduledBadgesCompleted,
        'Cancelled': scheduledBadgesCancelled,
        'Scheduled': scheduledBadgesScheduled
    };
    return <img src={badges[status as keyof typeof badges] || scheduledBadgesScheduled} alt={status} className="h-6 w-auto object-contain" />;
};

// ----------------------------------------------------------------------
// 3. PAGE CONFIGURATION
// ----------------------------------------------------------------------

const INITIAL_DEFENSES: Defense[] = [
    { id: '1', title: 'Machine Learning Approach for...', block: 'BSCpE 4-3', room: 'Room 315', panel: 'Flores, Garcia, Mendoza', date: new Date('2025-11-28T09:00:00'), status: 'Scheduled', section: '4-3', adviser: 'Dr. Smith', groupCode: '2101', equipment: 'Projector' },
    { id: '2', title: 'IoT Based Monitoring System...', block: 'BSCpE 4-3', room: 'Room 315', panel: 'Flores, Garcia, Mendoza', date: new Date('2025-11-28T09:00:00'), status: 'Scheduled', section: '4-3', adviser: 'Engr. Doe', groupCode: '2102', equipment: 'Monitor' },
    { id: '3', title: 'Automated Attendance System...', block: 'BSCpE 4-3', room: 'Room 315', panel: 'Flores, Garcia, Mendoza', date: new Date('2025-11-28T09:00:00'), status: 'Completed', section: '4-3', adviser: 'Dr. Alan', groupCode: '2103', equipment: 'None' },
    { id: '4', title: 'Network Security Analysis...', block: 'BSCpE 4-4', room: 'Room 315', panel: 'Flores, Garcia, Mendoza', date: new Date('2025-11-29T09:00:00'), status: 'Scheduled', section: '4-4', adviser: 'Engr. Joy', groupCode: '2104', equipment: 'HDMI' },
    { id: '5', title: 'FPGA Implementation of...', block: 'BSCpE 4-4', room: 'Room 315', panel: 'Flores, Garcia, Mendoza', date: new Date('2025-11-29T09:00:00'), status: 'Cancelled', section: '4-4', adviser: 'Dr. Strange', groupCode: '2105', equipment: 'Board' },
];

const breadcrumbs = [{ title: 'Matrix Management', href: '#' }];

const pageHeader: PageHeaderProps = {
    title: "Matrix Management",
    subtitle: "Monitor all defense schedule, facilities, and equipment",
    icon: (
        <div className="flex h-full w-full items-center justify-center rounded-md bg-[#800000] text-white">
            <CalendarIcon className="h-5 w-5" />
        </div>
    ),
};

const GRID_LAYOUT = "grid grid-cols-[1.5fr_100px_100px_1.5fr_1.2fr_100px_100px] gap-4 items-center px-5 py-3";

// ----------------------------------------------------------------------
// 4. MAIN PAGE COMPONENT
// ----------------------------------------------------------------------

export default function MatrixManagement() {
    const [viewMode, setViewMode] = useState<'table' | 'calendar'>('calendar');
    const [currentDate, setCurrentDate] = useState(new Date('2025-11-28'));
    
    // Data State
    const [defensesList, setDefensesList] = useState<Defense[]>(INITIAL_DEFENSES);
    
    // Unified Modal States 
    const [formModalState, setFormModalState] = useState<{ open: boolean, mode: 'add' | 'edit' | 'view', data?: Defense | null }>({ open: false, mode: 'add', data: null });
    const [deleteModalState, setDeleteModalState] = useState<{ open: boolean, id: string | null }>({ open: false, id: null });
    const [feedbackModalState, setFeedbackModalState] = useState<{ open: boolean, type: 'success' | 'error', message?: string }>({ open: false, type: 'success' });

    // Calendar Events
    const calendarEvents: WeeklyEventType[] = useMemo(() => {
        return defensesList.map(d => ({
            id: d.id,
            title: `${d.block} (${d.room})`, 
            date: d.date,
            time: d.date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
            section: d.section
        }));
    }, [defensesList]);

    // Handlers
    const handleSave = (data: Partial<Defense>) => {
        if (formModalState.mode === 'add') {
            const newDefense: Defense = {
                id: Math.random().toString(36).substr(2, 9),
                title: data.title!,
                block: data.block!,
                room: data.room || 'TBA',
                panel: 'Pending Assignment',
                date: data.date || new Date(),
                status: 'Scheduled',
                section: data.block?.split(' ')[1] || 'N/A',
                adviser: data.adviser || '',
                groupCode: data.groupCode || '',
                equipment: data.equipment || ''
            };
            setDefensesList(prev => [...prev, newDefense]);
        } else {
            setDefensesList(prev => prev.map(item => item.id === data.id ? { ...item, ...data } as Defense : item));
        }
        setFormModalState({ ...formModalState, open: false });
        setFeedbackModalState({ open: true, type: 'success' });
    };

    const handleDelete = () => {
        if (deleteModalState.id) {
            setDefensesList(prev => prev.filter(item => item.id !== deleteModalState.id));
            setDeleteModalState({ open: false, id: null });
            setFeedbackModalState({ open: true, type: 'success' });
        }
    };

    return (
        <DefenseManagementLayout breadcrumbs={breadcrumbs} pageHeader={pageHeader}>
            <Head title="Matrix Management" />
            
            <div className="flex flex-col gap-6">
                
                {/* 1. Navigation Tabs */}
                <div className="flex items-end gap-1 mb-0 border-b border-[#800000]/10 pb-0">
                    <TabButton onClick={() => router.get(panel_assign().url)}>Panel Assignment</TabButton>
                    <TabButton isActive>Matrix Management</TabButton>
                </div>

                {/* 2. Controls */}
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center pt-2">
                    <Button 
                        variant="primary" 
                        onClick={() => setFormModalState({ open: true, mode: 'add', data: null })}
                    >
                        <Plus className="mr-2 h-4 w-4" /> Schedule a Defense
                    </Button>

                    <ToggleGroup 
                        type="single" 
                        value={viewMode} 
                        onValueChange={(value) => { if(value) setViewMode(value as 'table' | 'calendar') }}
                        className="bg-[#F3E5CA] rounded-xl p-1 gap-1 w-auto whitespace-nowrap"
                    >
                        <ToggleGroupItem value="table" className="data-[state=on]:bg-[#800000] data-[state=on]:text-white text-[#800000] h-8 px-3 text-xs font-bold">
                            <LayoutList className="mr-2 h-3 w-3" /> Table View
                        </ToggleGroupItem>
                        <ToggleGroupItem value="calendar" className="data-[state=on]:bg-[#800000] data-[state=on]:text-white text-[#800000] h-8 px-3 text-xs font-bold">
                            <CalendarDays className="mr-2 h-3 w-3" /> Calendar View
                        </ToggleGroupItem>
                    </ToggleGroup>
                </div>

                {/* 3. Main Content Area */}
                <div className="min-h-[600px] flex-1">
                    {viewMode === 'calendar' ? (
                        <DefenseCalendarWeekly 
                            events={calendarEvents}
                            value={currentDate}
                            onChange={setCurrentDate}
                            className="shadow-sm border-sidebar-border/70 h-full"
                        />
                    ) : (
                        <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm dark:border-sidebar-border h-full flex flex-col bg-white">
                            <div className={`${GRID_LAYOUT} bg-[#800000] text-white text-sm font-bold`}>
                                <span className="text-center">Title</span>
                                <span className="text-center">Block</span>
                                <span className="text-center">Room</span>
                                <span className="text-center">Panel</span>
                                <span className="text-center">Date & Time</span>
                                <span className="text-center">Status</span>
                                <span className="text-center">Action</span>
                            </div>
                            <div className="flex-1 overflow-auto">
                                {defensesList.map((defense) => (
                                    <div key={defense.id} className={`${GRID_LAYOUT} border-b border-gray-100 hover:bg-gray-50 transition-colors`}>
                                        <span className="text-sm text-gray-800 font-medium truncate" title={defense.title}>{defense.title}</span>
                                        <span className="text-sm text-gray-800 text-center">{defense.block}</span>
                                        <span className="text-sm text-gray-800 text-center">{defense.room}</span>
                                        <span className="text-sm text-gray-800 truncate text-center" title={defense.panel}>{defense.panel}</span>
                                        <div className="flex flex-col items-center text-sm text-gray-800">
                                            <span>{defense.date.toLocaleDateString()}</span>
                                            <span className="text-xs text-gray-500">{defense.date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
                                        </div>
                                        <div className="flex justify-center"><StatusBadge status={defense.status} /></div>
                                        
                                        {/* --- INTERACTIVE ICONS --- */}
                                        <div className="flex items-center justify-center gap-3">
                                            <InteractiveIcon 
                                                def={ic_eyeopen_Default} 
                                                hover={ic_eyeopen_Hover} 
                                                clicked={ic_eyeopen_Clicked} 
                                                onClick={() => setFormModalState({ open: true, mode: 'view', data: defense })} 
                                                title="View Details" 
                                            />
                                            <InteractiveIcon 
                                                def={ic_edit_Default} 
                                                hover={ic_edit_Hover} 
                                                clicked={ic_edit_Clicked} 
                                                onClick={() => setFormModalState({ open: true, mode: 'edit', data: defense })} 
                                                title="Edit" 
                                            />
                                            <InteractiveIcon 
                                                def={ic_delete_Default} 
                                                hover={ic_delete_Hover} 
                                                clicked={ic_delete_Clicked} 
                                                onClick={() => setDeleteModalState({ open: true, id: defense.id })} 
                                                title="Delete" 
                                            />
                                        </div>

                                    </div>
                                ))}
                            </div>
                            <div className="bg-gray-50 px-5 py-3 text-xs text-center text-gray-500 border-t border-gray-200 mt-auto">
                                {defensesList.length} Upcoming Defenses
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* --- MODALS --- */}
            <DefenseFormDialog 
                open={formModalState.open} 
                onOpenChange={(open) => setFormModalState(prev => ({ ...prev, open }))}
                mode={formModalState.mode}
                initialData={formModalState.data}
                onSave={handleSave}
            />

            <ConfirmationDialog 
                open={deleteModalState.open} 
                onOpenChange={(open) => setDeleteModalState(prev => ({ ...prev, open }))}
                onConfirm={handleDelete}
                title="Delete Schedule?"
                description="Are you sure you want to delete this schedule? This action cannot be undone."
            />

            <FeedbackDialog 
                open={feedbackModalState.open} 
                onOpenChange={(open) => setFeedbackModalState(prev => ({ ...prev, open }))}
                type={feedbackModalState.type}
                message={feedbackModalState.message}
            />
        </DefenseManagementLayout>
    );
}

// ----------------------------------------------------------------------
// 5. HELPER COMPONENT: Reusable Form Dialog
// ----------------------------------------------------------------------

function DefenseFormDialog({ open, onOpenChange, mode, initialData, onSave }: { 
    open: boolean, 
    onOpenChange: (open: boolean) => void, 
    mode: 'add' | 'edit' | 'view', 
    initialData?: Defense | null,
    onSave: (data: Partial<Defense>) => void
}) {
    const isView = mode === 'view';
    const isEdit = mode === 'edit';
    const title = mode === 'add' ? 'Schedule Defense' : mode === 'edit' ? 'Edit Defense Details' : 'Defense Details';
    
    // Local State for form fields
    const [formData, setFormData] = useState<Partial<Defense>>({});

    // Reset form when modal opens/changes
    useEffect(() => {
        if (open) {
            setFormData(initialData || {
                title: '', block: '', room: '', adviser: '', groupCode: '', equipment: '', date: new Date(), panel: 'Pending Assignment'
            });
        }
    }, [open, initialData]);

    const handleSave = () => {
        // Simple validation
        if (!formData.title || !formData.block) return; 
        onSave(formData);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[1000px] w-[95vw] h-[85vh] p-0 border-none rounded-lg bg-[#FDFCF6] shadow-2xl font-dm flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex-none flex flex-row justify-between items-center px-8 py-6 border-b border-gray-200 bg-white z-10">
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-bold text-[#800000] tracking-tight">{title}</h2>
                            {isView && <Badge className={initialData?.status === 'Completed' ? 'bg-green-600' : 'bg-blue-600'}>{initialData?.status}</Badge>}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{isView ? 'Reviewing information.' : 'Enter details below.'}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        {!isView && <span className="text-xs font-bold text-gray-400 uppercase tracking-widest hidden sm:block">ID: {initialData?.id || 'NEW'}</span>}
                        <button onClick={() => onOpenChange(false)} className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-lg transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Form Body */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-[#FAFAFA]">
                    <div className="space-y-8">
                        {/* Section 1 */}
                        <SectionHeader title="Proposal Information" />
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                            <div className="md:col-span-8 space-y-1">
                                <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Thesis Title</Label>
                                <Input inputSize="full" readOnly={isView} value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Enter thesis title..." />
                            </div>
                            <div className="md:col-span-4 space-y-1">
                                <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Group Code</Label>
                                <div className="relative">
                                    <Input inputSize="full" readOnly={isView} value={formData.groupCode || ''} onChange={e => setFormData({...formData, groupCode: e.target.value})} className="pl-10" />
                                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#333333]/50" />
                                </div>
                            </div>
                            <div className="md:col-span-6 space-y-1">
                                <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Thesis Adviser</Label>
                                <div className="relative">
                                    <Input inputSize="full" readOnly={isView} value={formData.adviser || ''} onChange={e => setFormData({...formData, adviser: e.target.value})} className="pl-10" />
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#333333]/50" />
                                </div>
                            </div>
                            <div className="md:col-span-6 space-y-1">
                                <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Block</Label>
                                {isView ? (
                                    <Input inputSize="full" readOnly value={formData.block || ''} />
                                ) : (
                                    <Select value={formData.block} onValueChange={val => setFormData({...formData, block: val})}>
                                        <SelectTrigger className="h-[38px] w-full rounded-[4px] border border-[#d4c5a0] bg-[#f3efd0] px-[12px] py-[8px] text-[13.33px] font-semibold text-[#333333] outline-none"><SelectValue placeholder="Select Block" /></SelectTrigger>
                                        <SelectContent>
                                            {['BSCpE 4-1', 'BSCpE 4-2', 'BSCpE 4-3', 'BSCpE 4-4'].map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                )}
                            </div>
                        </div>

                        {/* Section 2 */}
                        <SectionHeader title="Defense Logistics" />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="space-y-1">
                                <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Date</Label>
                                {isView ? <Input inputSize="full" readOnly value={formData.date?.toLocaleDateString() || ''} /> : 
                                    <DatePicker value={formData.date} onChange={d => setFormData({...formData, date: d || new Date()})} className="w-full" displayFormat="full" />
                                }
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Time</Label>
                                {isView ? <Input inputSize="full" readOnly value={formData.date?.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) || ''} /> :
                                    <TimePicker value={formData.date} onChange={d => setFormData({...formData, date: d || new Date()})} className="w-full" />
                                }
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Room</Label>
                                <div className="relative">
                                    <Input inputSize="full" readOnly={isView} value={formData.room || ''} onChange={e => setFormData({...formData, room: e.target.value})} className="pl-10" />
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1a1a1a]/50" />
                                </div>
                            </div>
                            <div className="md:col-span-3 space-y-1">
                                <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Equipment</Label>
                                <div className="relative">
                                    <Input inputSize="full" readOnly={isView} value={formData.equipment || ''} onChange={e => setFormData({...formData, equipment: e.target.value})} className="pl-10" />
                                    <Monitor className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1a1a1a]/50" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex-none flex justify-end gap-3 px-8 py-5 border-t border-gray-200 bg-white">
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="h-9 px-6 hover:bg-gray-100 text-gray-600">
                        {isView ? 'Close' : 'Cancel'}
                    </Button>
                    {!isView && (
                        <Button onClick={handleSave} className="bg-[#800000] hover:bg-[#600000] h-9 px-8 text-sm font-bold shadow-lg shadow-red-900/10">
                            {mode === 'add' ? <><Plus className="w-4 h-4 mr-2" /> Confirm Schedule</> : 'Save Changes'}
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

const SectionHeader = ({ title }: { title: string }) => (
    <h3 className="text-sm font-bold text-[#800000] flex items-center gap-2 mb-0 pb-2 border-b border-gray-100">
        <div className="w-1.5 h-4 bg-[#800000] rounded-full" /> {title}
    </h3>
);

// ----------------------------------------------------------------------
// 6. HELPER COMPONENT: Feedback Dialogs
// ----------------------------------------------------------------------

function ConfirmationDialog({ open, onOpenChange, onConfirm, title, description }: any) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[400px] rounded-[24px] p-8 flex flex-col items-center justify-center border-none shadow-2xl bg-white">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
                    <Trash className="w-8 h-8 text-[#800000]" />
                </div>
                <h3 className="text-[20px] text-center text-gray-800 font-bold font-dm mb-2">{title}</h3>
                <p className="text-sm text-center text-gray-500 mb-8 px-4">{description}</p>
                <div className="flex gap-3 w-full">
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1 h-10 border-gray-200 text-gray-600 hover:bg-gray-50">Cancel</Button>
                    <Button onClick={onConfirm} className="flex-1 h-10 bg-[#800000] hover:bg-[#600000] text-white font-bold">Delete</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function FeedbackDialog({ open, onOpenChange, type, message }: { open: boolean, onOpenChange: (v: boolean) => void, type: 'success' | 'error', message?: string }) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[320px] rounded-[24px] p-10 flex flex-col items-center justify-center border-none shadow-2xl bg-white">
                <div className={cn("w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-lg", type === 'success' ? 'bg-green-100' : 'bg-red-100')}>
                    {type === 'success' ? <Check className="w-10 h-10 text-green-600" /> : <AlertCircle className="w-10 h-10 text-[#800000]" />}
                </div>
                <p className="text-[16px] text-center text-gray-800 font-bold font-dm">
                    {message || (type === 'success' ? 'Action completed successfully.' : 'An error occurred.')}
                </p>
            </DialogContent>
        </Dialog>
    );
}