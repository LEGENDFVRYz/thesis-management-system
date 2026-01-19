import ManagementLayout from '@/pages/Admin/management/index';
import { PageHeaderProps, type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { deadline } from '@/routes/admin/management/index';
import { update } from '@/routes/admin/management/deadline/index';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight, Calendar, Save } from 'lucide-react';
import { DeadlineTimelineView } from './components/deadline-timeline-view';
import { DeadlineSubmissionSchedule } from './components/deadline-submission-schedule';
import { DeadlineDefenseSchedule } from './components/deadline-defense-schedule';
import { DeadlineNotificationRules } from './components/deadline-notification-rules';
import { Icon } from '@/components/icon-index';
import { Button } from '@/components/ui/button';
import DatePicker from '@/components/date-picker';
import CloseIcon from '@/components/Icons/ic_close-Default.svg';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

// Page Setup
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Deadlines',
        href: deadline().url,
    },
];

const pageHeader: PageHeaderProps = {
    title: "Deadline Management",
    subtitle: "Set submission windows, defense periods, and grading deadlines",
    icon: (
        <Icon
            name="sysConfig"
            className="w-8 h-8 text-primary"
        />
    ),
};


// Page Props
interface WorkflowStep {
    event_id: number;   // main key
    stage: number;
    sort_order: number;
    name: string;
    desc: string | null;
    start_date: string | null;
    offset: number;
    person_assigned?: string;
}

// Person Assigned options
const PERSON_ASSIGNED_OPTIONS = [
    { value: 'student', label: 'Student' },
    { value: 'adviser', label: 'Adviser' },
    { value: 'committee', label: 'Committee' },
    { value: 'panel', label: 'Panel' },
    { value: 'coordinator', label: 'Coordinator' },
];
interface DeadlineProps {
    allowed_stages: number[];
    workflow: WorkflowStep[];
}


const STAGE_LABELS: Record<number, string> = {
    1: 'MOR (Methods of Research)',
    2: 'DP1 (Design Project 1)',
    3: 'DP2 (Design Project 2)',
};


export default function DeadlinePage({ allowed_stages, workflow }: DeadlineProps) {
    const [activeStage, setActiveStage] = useState<number>(allowed_stages[0] || 1);

    // Controls
    const [modalOpen, setModalOpen] = useState(false);
    const [activeStep, setActiveStep] = useState<WorkflowStep | null>(null);

    // Filter items based on the active tab
    const currentSteps = workflow.filter((step) => step.stage === activeStage);

    return (
        <ManagementLayout
            breadcrumbs={breadcrumbs}
            pageHeader={pageHeader}
        >
            <div className="flex flex-col gap-3 p-4">
                {/* LEIGH PAST CODE: resolve later */}

                {/* Three Column Grid */}
                {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6"> */}
                    {/* <DeadlineSubmissionSchedule /> */}  
                    {/* <DeadlineDefenseSchedule /> */}     
                    {/* <DeadlineNotificationRules /> */}   
                {/* </div> */}

                {/* Initial Design for deadline management */}
                {/* --- TABS SECTION --- */}
                <div className="flex w-full items-center gap-2 border-b border-sidebar-border/70 pb-1">
                    {allowed_stages.map((stageId) => (
                        <button
                            key={stageId}
                            onClick={() => setActiveStage(stageId)}
                            className={cn(
                                "relative px-4 py-2 text-sm font-medium transition-colors hover:text-primary",
                                activeStage === stageId 
                                    ? "text-primary after:absolute after:bottom-[-5px] after:left-0 after:h-[2px] after:w-full after:bg-primary" 
                                    : "text-muted-foreground"
                                
                            )}
                        >
                            {STAGE_LABELS[stageId] ?? `Stage ${stageId}`}
                        </button>
                    ))}
                </div>

                {/* --- WORKFLOW SECTION --- */}
                {/* Note: Sample Frontend for testing the deadline edit (update) operations */}
                <div className="relative rounded-xl">
                    
                    {currentSteps.length === 0 ? (
                        <div className="flex h-40 items-center justify-center rounded-lg border border-dashed text-muted-foreground">
                            No workflow steps found for this stage.
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {currentSteps.map((step) => (
                                <WorkflowCard 
                                    key={step.event_id} 
                                    step={step} 
                                    onClick={() => {
                                        setActiveStep(step);
                                        setModalOpen(true);
                                    }}
                                />
                            ))}
                        </div>
                    )}

                </div>

                {/* Timeline View - Full Width */}
                {/* Note: currently view method lang yung component, nead a way to update the set date in the deadline */}
                <div className="mb-[120px]">
                    <DeadlineTimelineView />
                </div>
            </div>

            {/* --- TESTING MODAL --- */}
            {activeStep && (
                <DeadlineDateModal
                    key={activeStep.event_id}
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    step={activeStep}
                />
            )}
        </ManagementLayout>
    );
}


// --- TESTING CARD ---
function WorkflowCard({
    step,
    onClick,
}: {
    step: WorkflowStep;
    onClick: () => void;
}) {
    return (
        <div className="group relative flex flex-col justify-between rounded-lg border border-sidebar-border/70 bg-[#FDFCF6] p-5 shadow-sm transition-all hover:border-primary/50 hover:shadow-md">
            
            {/* Header: Step Number & Title */}
            <div>
                <div className="mb-3 flex items-center justify-between">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {step.sort_order}
                    </span>
                    {/* Placeholder for status badge later */}
                    <span className="text-[10px] uppercase text-muted-foreground">{step.stage == 1 ? '3rd Year' : '4th Year'}</span>
                </div>
                
                <h3 className="font-semibold text-foreground group-hover:text-primary">
                    {step.name}
                </h3>
                
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                    {step.desc || "No description provided."}
                </p>
            </div>

            {/* Footer: Actions / Metadata */}
            <div className="mt-5 flex items-center justify-between border-t border-sidebar-border/50 pt-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                        {step.start_date && step.offset !== 0
                            ? (() => {
                                const start = new Date(step.start_date);
                                const end = new Date(start);
                                end.setDate(start.getDate() + step.offset);
                                
                                return `${start.toISOString().split("T")[0]} to ${end.toISOString().split("T")[0]}`;
                            })()
                            : "Set Dates"}
                        </span>
                    </div>
                </div>
                
                <ChevronRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
            </div>

            {/* Make the whole card clickable */}
            <button 
                className="absolute inset-0 z-10 focus:outline-none" 
                onClick={onClick}
                aria-label={`Manage ${step.name}`}
            />
        </div>
    );
}


// --- Workflow Edit Modal ---
// Edits: event name, person responsible, and duration (offset in days)
function DeadlineDateModal({
    open,
    onClose,
    step,
}: {
    open: boolean;
    onClose: () => void;
    step: WorkflowStep;
}) {
    // Local state for DatePicker (needs Date object)
    const [startDate, setStartDate] = useState<Date | undefined>(
        step.start_date ? new Date(step.start_date) : undefined
    );

    const { data, setData, put, processing, errors } = useForm({
        event_id: step.event_id,
        name: step.name,
        desc: step.desc ?? '',
        offset: step.offset,
        start_date: step.start_date ?? '',
        person_assigned: step.person_assigned ?? '',
    });

    if (!open) return null;

    // Handle date change from DatePicker
    const handleDateChange = (date: Date | undefined) => {
        setStartDate(date);
        if (date) {
            // Format as YYYY-MM-DD for backend
            const formatted = date.toISOString().split('T')[0];
            setData('start_date', formatted);
        } else {
            setData('start_date', '');
        }
    };

    const submit = () => {
        put(update(step.event_id).url, {
            onSuccess: () => onClose(),
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl">
                {/* HEADER */}
                <div className="bg-[#730000] text-white px-6 py-4 flex items-center justify-between rounded-t-xl">
                    <h2 className="text-xl font-medium">Edit Workflow Step</h2>
                    <img
                        src={CloseIcon}
                        className="w-5 h-5 cursor-pointer filter brightness-0 invert"
                        onClick={onClose}
                    />
                </div>

                {/* CONTENT */}
                <div className="p-8 space-y-6">
                    {/* Event Name and Person Assigned */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">Event Name</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full rounded-[8px] border border-transparent bg-breadcrumb px-[12px] py-[8px] text-[13.33px] font-medium text-[#1a1a1a] outline-none transition-all shadow-xs placeholder:text-[#1a1a1a]/50 hover:border-primary-foreground-2 focus-visible:border-primary focus-visible:ring-0"
                                placeholder="e.g., Title Proposal Submission"
                            />
                            {errors.name && (
                                <p className="mt-1 text-xs text-primary">{errors.name}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">Person Assigned</label>
                            <Select
                                value={data.person_assigned}
                                onValueChange={(value) => setData('person_assigned', value)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select person" />
                                </SelectTrigger>
                                <SelectContent>
                                    {PERSON_ASSIGNED_OPTIONS.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.person_assigned && (
                                <p className="mt-1 text-xs text-primary">{errors.person_assigned}</p>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">Description</label>
                        <textarea
                            value={data.desc}
                            onChange={(e) => setData('desc', e.target.value)}
                            placeholder="e.g., Students submit title proposals to adviser"
                            rows={3}
                            className="w-full min-h-[100px] rounded-[8px] border border-transparent bg-breadcrumb px-[12px] py-[8px] text-[13.33px] font-medium text-[#1a1a1a] outline-none transition-all shadow-xs placeholder:text-[#1a1a1a]/50 hover:border-primary-foreground-2 focus-visible:border-primary focus-visible:ring-0 resize-none"
                        />
                        {errors.desc && (
                            <p className="mt-1 text-xs text-primary">{errors.desc}</p>
                        )}
                    </div>

                    {/* Duration and Deadline Date */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">Duration (days)</label>
                            <input
                                type="number"
                                min={0}
                                value={data.offset}
                                onChange={(e) => setData('offset', parseInt(e.target.value) || 0)}
                                className="w-full rounded-[8px] border border-transparent bg-breadcrumb px-[12px] py-[8px] text-[13.33px] font-medium text-[#1a1a1a] outline-none transition-all shadow-xs placeholder:text-[#1a1a1a]/50 hover:border-primary-foreground-2 focus-visible:border-primary focus-visible:ring-0"
                                placeholder="e.g., 7"
                            />
                            {errors.offset && (
                                <p className="mt-1 text-xs text-primary">{errors.offset}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">Deadline Date</label>
                            <DatePicker
                                value={startDate}
                                onChange={handleDateChange}
                                placeholder="Select Date"
                                displayFormat="full"
                            />
                            {errors.start_date && (
                                <p className="mt-1 text-xs text-primary">{errors.start_date}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* DIVIDER */}
                <div className="border-t border-gray-200"></div>

                {/* FOOTER */}
                <div className="px-6 py-4 flex justify-end">
                    <Button
                        onClick={submit}
                        disabled={processing}
                        className="bg-[#730000] text-white hover:bg-[#5a0000] flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        {processing ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </div>
        </div>
    );
}