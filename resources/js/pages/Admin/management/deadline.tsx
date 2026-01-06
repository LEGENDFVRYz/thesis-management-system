import ManagementLayout from '@/pages/Admin/management/index';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { deadline } from '@/routes/admin/management/index';
import { update } from '@/routes/admin/management/deadline/index';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import { Calendar } from '@/components/calendar';
import { DeadlineTimelineView } from './deadline-timeline-view';
import { DeadlineSubmissionSchedule } from './deadline-submission-schedule';
import { DeadlineDefenseSchedule } from './deadline-defense-schedule';
import { DeadlineNotificationRules } from './deadline-notification-rules';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Deadlines',
        href: deadline().url,
    },
];

// Page Props
interface WorkflowStep {
    event_id: number;   // main key
    stage: number;
    sort_order: number;
    name: string;
    desc: string | null;
    start_date: string | null;
    offset: number;
}
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
            title="Deadline Management"
            description="Set submission windows, defense periods, and grading deadlines"
        >
            <div className="flex flex-col gap-6 p-4">
                {/* LEIGH PAST CODE: resolve later */}
                {/* Timeline View - Full Width */}
                {/* <DeadlineTimelineView /> */}

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
                <div className="relative min-h-[50vh] flex-1 rounded-xl">
                    
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
        <div className="group relative flex flex-col justify-between rounded-lg border border-sidebar-border/70 bg-sidebar-background p-5 shadow-sm transition-all hover:border-primary/50 hover:shadow-md">
            
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


// --- Testing modal ---
function DeadlineDateModal({
    open,
    onClose,
    step,
}: {
    open: boolean;
    onClose: () => void;
    step: WorkflowStep;
}) {
    const { data, setData, put, processing, errors } = useForm({
        event_id: step.event_id,
        start_date: step.start_date ?? '',
    });

    if (!open) return null;

    const submit = () => {
        put(update(step.event_id).url, {
            onSuccess: () => onClose(),
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-sm rounded-lg bg-background p-6 shadow-lg">
                <h2 className="mb-4 text-lg font-semibold">
                    Update Start Date
                </h2>

                {errors._error && (
                    <div className="text-sm text-red-600 text-center">
                        {errors._error}
                    </div>
                )}

                <input
                    type="date"
                    value={data.start_date ?? undefined}
                    onChange={(e) => setData('start_date', e.target.value)}
                    className="w-full rounded border px-3 py-2 text-sm"
                />
                {errors.start_date && (
                    <div className="w-full text-sm text-primary text-center">
                        {errors.start_date}
                    </div>
                )}

                <div className="mt-5 flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="text-sm text-muted-foreground"
                    >
                        Cancel
                    </button>

                    <button
                        disabled={processing}
                        onClick={submit}
                        className="rounded bg-primary px-4 py-2 text-sm text-white"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}